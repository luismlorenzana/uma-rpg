import { describe, expect, it, vi } from 'vitest'
import { applyPoints } from '../economy/bonus'
import { newGrades, type GearTier } from '../economy/grades'
import { MANUAL_PRICE } from '../economy/ranks'
import { rpgCarriedMp, rpgPartyAllies } from '../rpg/campaign/run'
import { projectRpgStats, rpgDefaultWeapons, rpgWeaponKind, type RpgClass } from '../rpg/rules'
import { manualBlock, readManuals } from './exchange'
import { fillRanks, partyMembers, payEntrants } from './battle'
import { ECONOMY_V3_NOW as NOW, gradedUma, gradedWorld } from './economy-v3.fixture'
import type { Save, TierWorld } from './save'

vi.mock('../rpg/battle/caps', async (orig) => (await import('../rpg/battle/caps-at.fixture')).capsAt(17, await orig()))

const outfit = (outfitId: string) => ({
  outfitId, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
  growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'A' as const, pace: 'G' as const, late: 'G' as const, end: 'G' as const },
    distance: { sprint: 'G' as const, mile: 'G' as const, medium: 'A' as const, long: 'G' as const } },
})

function built(classId: RpgClass, tier: GearTier): TierWorld {
  const gear = newGrades(tier)
  for (const weapon of rpgDefaultWeapons(classId, 17)) gear.weapons[weapon] = { grade: 10 }
  for (const slot of ['head', 'body', 'legs', 'arms', 'feet'] as const) gear.armor[slot] = { grade: 10 }
  return gradedWorld({ umas: { '101': gradedUma({ level: 46, classId, gear, ranks: { classes: { [classId]: { rank: 46, exp: 0 } } } }) } })
}

function allyOf(classId: RpgClass, tier: GearTier) {
  const world = built(classId, tier)
  const outfits = new Map([['101', outfit('101')]])
  const members = partyMembers(world, ['101'], outfits, String(tier), 17)
  const allies = rpgPartyAllies(members, (profile, points) => rpgCarriedMp({ mp: {} }, profile, points, 17), 17)
  return { world, ally: allies[0]!, member: members[0]! }
}

describe('graded battle projection (R2)', () => {
  it('projects the Tier 1 G10 Brawler suit and three weapons exactly', () => {
    const { ally, member } = allyOf('brawler', 1)
    const bare = projectRpgStats(member.profile, 17)
    expect(ally.might).toEqual(Object.fromEntries(member.profile.weapons.map((weapon) => [rpgWeaponKind(weapon), 68])))
    expect(ally.stats).toMatchObject({ hp: bare.hp + 150, pdef: bare.pdef + 40, mdef: bare.mdef + 40, mp: bare.mp + 30, atk: bare.atk + 25 })
    expect(ally.evasion).toBe(120)
    expect(['barrier', 'veil', 'regen', 'mpRegen', 'lifesteal', 'mpSteal', 'guard', 'resist', 'thorns', 'mirror', 'orbs']
      .every((field) => !(field in ally))).toBe(true)
  })

  it('scales flat armor and Might in Tier 2 but not evasion', () => {
    const { ally, member } = allyOf('brawler', 2)
    const bare = projectRpgStats(member.profile, 17)
    expect(ally.might).toEqual(Object.fromEntries(member.profile.weapons.map((weapon) => [rpgWeaponKind(weapon), 122])))
    expect(ally.stats).toMatchObject({ hp: bare.hp + 270, pdef: bare.pdef + 72, mdef: bare.mdef + 72, mp: bare.mp + 54, atk: bare.atk + 45 })
    expect(ally.evasion).toBe(120)
  })

  it('puts a magical suit’s offense into M.ATK', () => {
    const { ally, member } = allyOf('mage', 1)
    const bare = projectRpgStats(member.profile, 17)
    expect(ally.stats.matk).toBe(bare.matk + 25)
    expect(ally.stats.atk).toBe(bare.atk)
  })

  it('fills only Class Rank, banks no Gear Marks and preserves an absent wallet field', () => {
    const world = built('brawler', 1)
    const uma = world.umas['101']!
    const weapons = rpgDefaultWeapons('brawler', 17)
    const entrant = { outfitId: '101', classId: 'brawler' as const, weapons, used: new Set([weapons[0]!]) }
    const filled = fillRanks(uma, entrant, 100)
    expect(filled.gains.map((gain) => gain.ref)).toEqual([{ kind: 'class', id: 'brawler' }])
    expect(filled.gearMarks).toBe(0)
    const paid = payEntrants(world, [entrant], 'fight', 46, 0)
    expect('gearMarks' in paid.world.wallet).toBe(false)
    expect(paid.gearMarks).toBe(0)
  })

  it('retires gear Manuals but keeps Class Manuals', () => {
    const world = built('brawler', 1)
    world.wallet.classMarks = MANUAL_PRICE
    expect(manualBlock(world, '101', { kind: 'weapon', id: 'greatsword' })).toBe('Gear Manuals are retired')
    expect(manualBlock(world, '101', { kind: 'class', id: 'brawler' })).toBeNull()
    const save: Save = { schemaVersion: 27, account: { trainerName: 'Tester', createdAt: NOW, updatedAt: NOW, achievements: {}, history: {}, defeated: {} }, tierWorlds: { '1': world } }
    expect(readManuals(save, '101', { kind: 'class', id: 'brawler' }, 1, NOW).tierWorlds['1']!.wallet.classMarks).toBe(0)
  })

  it('keeps grade points additive with today’s Extra Stats', () => {
    const { member } = allyOf('brawler', 1)
    expect(applyPoints(projectRpgStats(member.profile, 17), member.points!).stats.hp).toBeGreaterThan(projectRpgStats(member.profile, 17).hp)
  })
})
