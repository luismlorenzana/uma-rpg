import { describe, expect, it } from 'vitest'
import { applyPoints } from '../economy/bonus'
import { newGrades, type GearTier } from '../economy/grades'
import { MANUAL_PRICE } from '../economy/ranks'
import { rpgCarriedMp, rpgPartyAllies } from '../rpg/campaign/run'
import { rpgFoe } from '../rpg/campaign/enemies'
import { createBattle } from '../rpg/battle/engine'
import { projectRpgStats, rpgDefaultWeapons, rpgWeaponKind, type RpgClass } from '../rpg/rules'
import type { UmaKnack } from '../roster/template'
import { manualBlock, readManuals } from './exchange'
import { fillRanks, partyMembers, payEntrants, umaPointParts } from './battle'
import { accessorySlot, ECONOMY_V3_NOW as NOW, FULL_CORE, FULL_MAP, gradedUma, gradedWorld, starMap, templateOutfit } from './economy-v3.fixture'
import { umaBattleSheet } from './sheet'
import type { StarMap } from '../economy/planet'
import type { Save, TierWorld } from './save'


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
    const save: Save = { schemaVersion: 30, account: { trainerName: 'Tester', createdAt: NOW, updatedAt: NOW, achievements: {}, history: {}, defeated: {} }, tierWorlds: { '1': world } }
    expect(readManuals(save, '101', { kind: 'class', id: 'brawler' }, 1, NOW).tierWorlds['1']!.wallet.classMarks).toBe(0)
  })

  it('keeps grade points additive with today’s Extra Stats', () => {
    const { member } = allyOf('brawler', 1)
    expect(applyPoints(projectRpgStats(member.profile, 17), member.points!).stats.hp).toBeGreaterThan(projectRpgStats(member.profile, 17).hp)
  })
})

describe('Extra Stats v3 in the fight (H76; EP2–EP4, EP14, EP23, UT10)', () => {
  /** A graded Lv 46 Uma with G10 armor, fighting as `classId`, with this map, in a world of `tier`. */
  function mapAlly(classId: RpgClass, tier: GearTier, stars: StarMap, outfit = templateOutfit('101', 'tireless', 'physical'), pick: RpgClass | null = null) {
    const gear = newGrades(tier)
    for (const slot of ['head', 'body', 'legs', 'arms', 'feet'] as const) gear.armor[slot] = { grade: 10 }
    const uma = gradedUma({ level: 46, classId, gear, stars, calling: { pick, confirmed: true }, ranks: { classes: { [classId]: { rank: 46, exp: 0 } } } })
    const world = gradedWorld({ umas: { '101': uma } })
    const members = partyMembers(world, ['101'], new Map([['101', outfit]]), String(tier), 17)
    const ally = rpgPartyAllies(members, (profile, points) => rpgCarriedMp({ mp: {} }, profile, points, 17), 17)[0]!
    const bare = projectRpgStats(members[0]!.profile, 17)
    return { uma, ally, bare, outfit }
  }

  it('a Tier 1 Spell Blade (Tireless, physical calling) with the full core and her moon: HP +255 + 20, MP +51, ATK +42, M.ATK +30, DEF +51 + 8, M.DEF +51', () => {
    const { ally, bare } = mapAlly('spellblade', 1, FULL_MAP)
    // Her G10 suit, physical: HP +150, DEF and M.DEF +40, MP +30, ATK +25 (H74).
    expect(ally.stats).toMatchObject({ hp: bare.hp + 150 + 255 + 20, mp: bare.mp + 30 + 51, atk: bare.atk + 25 + 42, matk: bare.matk + 30,
      pdef: bare.pdef + 40 + 51 + 8, mdef: bare.mdef + 40 + 51 })
    expect(ally.evasion).toBe(120)
    expect(ally.limitStart).toBeUndefined()
  })

  it('as a Mage the next fight’s map gives ATK +21, M.ATK +51: Prowess reads her active class, no jewel moves', () => {
    const { ally, bare } = mapAlly('mage', 1, FULL_MAP)
    // A magical suit puts its offense into M.ATK.
    expect([ally.stats.atk - bare.atk, ally.stats.matk - bare.matk - 25]).toEqual([21, 51])
    expect(ally.stats.pdef - bare.pdef - 40).toBe(51 + 8)
  })

  it('the same map in Tier 2 gives +92 to a stat with its moon', () => {
    const { ally, bare } = mapAlly('spellblade', 2, FULL_MAP)
    // Tier 2's suit: M.DEF +72, MP +54; her moon's node II is DEF (+14), so M.DEF and MP carry the core alone.
    expect([ally.stats.mdef - bare.mdef - 72, ally.stats.mp - bare.mp - 54]).toEqual([92, 92])
    expect(ally.stats.pdef - bare.pdef - 72).toBe(92 + 14)
    expect(ally.stats.hp - bare.hp - 270).toBe(5 * 92 + 35)
  })

  it('her moon reads her knack and her stored calling pick’s channel', () => {
    const fleet = mapAlly('brawler', 1, starMap('template:1', 'template:2'), templateOutfit('101', 'fleet', 'magical'))
    expect(fleet.ally.evasion).toBe(120 + 24)
    expect(fleet.ally.stats.mdef - fleet.bare.mdef - 40).toBe(8)
    const gritty = mapAlly('brawler', 1, starMap('template:1'), templateOutfit('101', 'gritty', 'physical'))
    expect(gritty.ally.limitStart).toBe(1)
    // A Pace runner with Power over Wit (row 5): the Spell Blade, or the Mage by her pick.
    const pace = { ...templateOutfit('101', 'mighty', 'physical'), aptitudes: { strategy: { front: 'G' as const, pace: 'A' as const, late: 'G' as const,
      end: 'G' as const }, distance: { sprint: 'G' as const, mile: 'G' as const, medium: 'A' as const, long: 'G' as const } },
      baseStats: { speed: 110, stamina: 110, power: 120, guts: 110, wit: 100 } }
    const asRow = mapAlly('brawler', 1, starMap('template:1', 'template:2'), pace)
    expect([asRow.ally.stats.pdef - asRow.bare.pdef - 40, asRow.ally.stats.mdef - asRow.bare.mdef - 40]).toEqual([4 + 8, 4])
    const picked = mapAlly('brawler', 1, starMap('template:1', 'template:2'), pace, 'mage')
    expect([picked.ally.stats.pdef - picked.bare.pdef - 40, picked.ally.stats.mdef - picked.bare.mdef - 40]).toEqual([4, 4 + 8])
  })

  it('keeps gear and Extra Stats apart on her sheet, and a v1 map’s active nodes as before', () => {
    const { uma, outfit } = mapAlly('spellblade', 1, FULL_MAP)
    const parts = umaPointParts(uma, 'spellblade', 1, { knack: 'tireless', channel: 'physical' })
    expect(parts.extra).toEqual({ hp: 51 + 4, mp: 51, atk: 42, matk: 30, def: 51 + 8, mdef: 51, speed: 0, limit: 0 })
    expect(parts.gear).toMatchObject({ hp: 30, def: 40, mdef: 40, mp: 30, atk: 25 })
    const defense = umaBattleSheet(outfit, uma, 'spellblade', 1, 17).find((g) => g.title === 'Defense')!.rows
    expect(defense.find((r) => r.label === 'DEF')).toMatchObject({ gear: 40, extra: 59 })
    expect(umaPointParts({ ...uma, stars: FULL_CORE }, 'spellblade', 1).extra).toMatchObject({ hp: 51, def: 51 })
    const v1 = umaPointParts({ ...uma, stars: { unlocked: ['moon:hp:1', 'moon:hp:2'], active: ['moon:hp:2'] } }, 'spellblade', 1)
    expect(v1.extra.hp).toBe(2)
  })
})

describe('a graded Uma’s accessory and signature in the fight (R2, H75)', () => {
  const CLASSES: readonly RpgClass[] = ['brawler', 'mage', 'spellblade', 'summoner', 'paladin']
  /** Five Tier 1 Lv 50 Umas, every weapon and armor slot G10; the Brawler (101) wears `slot` and is of `knack`. */
  function fight(slot: ReturnType<typeof accessorySlot>, knack: UmaKnack) {
    const umas = Object.fromEntries(CLASSES.map((classId, i) => {
      const gear = newGrades(1)
      for (const weapon of rpgDefaultWeapons(classId, 17)) gear.weapons[weapon] = { grade: 10 }
      for (const part of ['head', 'body', 'legs', 'arms', 'feet'] as const) gear.armor[part] = { grade: 10 }
      if (i === 0) gear.accessories = [slot]
      return [`${101 + i}`, gradedUma({ level: 50, classId, gear, ranks: { classes: { [classId]: { rank: 50, exp: 0 } } } })]
    }))
    const ids = Object.keys(umas)
    const outfits = new Map(ids.map((id, i) => [id, templateOutfit(id, i === 0 ? knack : 'gritty', 'physical')]))
    const members = partyMembers(gradedWorld({ umas }), ids, outfits, '1', 17)
    const allies = rpgPartyAllies(members, (profile, points) => rpgCarriedMp({ mp: {} }, profile, points, 17), 17)
    return { member: members[0]!, ally: allies[0]!, allies }
  }
  const foe = rpgFoe({ id: 'f1', castId: 'cast-f1', element: 'ice', role: 'striker', rank: 'boss', level: 50, shield: 6,
    weaknesses: { weapons: ['greatsword'], elements: ['fire'] } })
  const fields = ['flat', 'bell', 'insignia', 'signature'] as const
  const ofFields = (ally: object) => Object.fromEntries(fields.filter((f) => f in ally).map((f) => [f, (ally as Record<string, unknown>)[f]]))

  it('brings a Fleet Brawler’s G10 Greatsword Bell and her signature +10', () => {
    const { member, ally, allies } = fight(accessorySlot('bell', 10, 'greatsword'), 'fleet')
    expect(member).toMatchObject({ accessory: { flat: {}, bell: { kind: 'greatsword', power: 1000 } }, signature: 10 })
    expect(ofFields(ally)).toEqual({ bell: { kind: 'greatsword', power: 1000 }, signature: 10 })
    expect(() => createBattle({ version: 17, seed: 75, allies, enemies: [foe] })).not.toThrow()
  })

  it('brings a Pendant, not her family, as 14 on each of her three kinds and no signature', () => {
    const { ally, allies } = fight(accessorySlot('pendant', 10), 'fleet')
    expect(ofFields(ally)).toEqual({ flat: { greatsword: 14, axe: 14, lance: 14 } })
    // Apart from her weapons' Might (v15's Orb joined it; v17's doesn't).
    expect(ally.might).toEqual({ greatsword: 68, axe: 68, lance: 68 })
    expect(() => createBattle({ version: 17, seed: 75, allies, enemies: [foe] })).not.toThrow()
  })

  it('brings nothing from a G0 slot, her family or not', () => {
    for (const slot of [accessorySlot('bell', 0, 'greatsword'), accessorySlot(null, 0)]) {
      const { ally, allies } = fight(slot, 'fleet')
      expect(ofFields(ally)).toEqual({})
      expect(() => createBattle({ version: 17, seed: 75, allies, enemies: [foe] })).not.toThrow()
    }
  })

  it('brings an Orb on a kind she doesn’t wield, an Insignia, and her signature on another class’s family', () => {
    expect(ofFields(fight(accessorySlot('orb', 10, 'dark'), 'mighty').ally)).toEqual({ flat: { dark: 27 }, signature: 10 })
    expect(ofFields(fight(accessorySlot('insignia', 4), 'clever').ally)).toEqual({ insignia: { value: 60 }, signature: 10 })
    expect(ofFields(fight(accessorySlot('bell', 10, 'fire'), 'fleet').ally)).toEqual({ signature: 10 })
  })

  it('sends none of it to a fight on engine 16', () => {
    const umas = { '101': gradedUma({ level: 50, gear: { ...newGrades(1), accessories: [accessorySlot('bell', 10, 'greatsword')] } }) }
    const members = partyMembers(gradedWorld({ umas }), ['101'], new Map([['101', templateOutfit('101', 'fleet', 'physical')]]), '1', 17)
    const ally = rpgPartyAllies(members, (profile, points) => rpgCarriedMp({ mp: {} }, profile, points, 16), 16)[0]!
    expect(ofFields(ally)).toEqual({})
  })
})
