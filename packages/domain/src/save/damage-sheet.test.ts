// H139: what Details shows for each of her three weapons is what a fight hits with. The fight is built through the real path,
// `partyMembers` and `rpgPartyAllies`, so a source the sheet forgets or adds fails here.
import { describe, expect, it } from 'vitest'
import { newGrades, type AccessorySlotState, type GearTier } from '../economy/grades'
import { rpgFoe } from '../rpg/campaign/enemies'
import { rpgCarriedMp, rpgPartyAllies } from '../rpg/campaign/run'
import { battleDamage, BATTLE_ENGINE_VERSION, createBattle } from '../rpg/battle/engine'
import { battleChannel } from '../rpg/battle/skills'
import { rpgDefaultWeapons, rpgIsTier0, rpgWeaponKind, type RpgClass, type RpgDamageKind } from '../rpg/rules'
import type { UmaKnack } from '../roster/template'
import { partyMembers } from './battle'
import { accessorySlot, gradedUma, gradedWorld, starMap, templateOutfit } from './economy-v3.fixture'
import { umaBattleSheet, umaDamageSheet } from './sheet'

const IDS = ['101', '102', '103', '104', '105']
const ARMOR = ['head', 'body', 'legs', 'arms', 'feet'] as const

interface Case { classId: RpgClass; tier: GearTier; slots: AccessorySlotState[]; weaponGrade?: number; knack?: UmaKnack }

/** Her, built as the case says, and four plain Brawlers, in the world a fight is built from. */
function party({ classId, tier, slots, weaponGrade = 8, knack = 'gritty' }: Case) {
  const gear = newGrades(tier)
  for (const weapon of rpgDefaultWeapons(classId)) gear.weapons[weapon] = { grade: weaponGrade }
  for (const slot of ARMOR) gear.armor[slot] = { grade: 6 }
  gear.accessories = [...slots, ...gear.accessories.slice(slots.length)]
  const uma = gradedUma({ level: 40, classId, gear, stars: starMap('planet:1', 'planet:2', 'prowess:1', 'prowess:2', 'guard:1', 'vigor:1'),
    ranks: { classes: { [classId]: { rank: rpgIsTier0(classId) ? 10 : 40, exp: 0 } } } })
  const plain = gradedUma({ level: 40, classId: 'brawler', gear: newGrades(tier), ranks: { classes: { brawler: { rank: 40, exp: 0 } } } })
  const umas = Object.fromEntries(IDS.map((id, i) => [id, i === 0 ? uma : plain]))
  const outfit = templateOutfit('101', knack, 'physical')
  const outfits = new Map(IDS.map((id) => [id, { ...outfit, outfitId: id }]))
  const members = partyMembers(gradedWorld({ umas }), IDS, outfits, String(tier))
  const allies = rpgPartyAllies(members, (profile, points) => rpgCarriedMp({ mp: {} }, profile, points), BATTLE_ENGINE_VERSION)
  return { outfit, uma, ally: allies[0]!, allies }
}

/** One Attack-sized hit on a Broken foe with no defense and no weakness: the offense itself. */
function hitWith(allies: ReturnType<typeof party>['allies'], kind: RpgDamageKind): number {
  const foe = rpgFoe({ id: 'f1', castId: 'cast-f1', element: 'ice', role: 'striker', rank: 'regular', level: 50, shield: 6, weaknesses: { weapons: ['bow'], elements: ['dark'] } })
  const { state } = createBattle({ version: BATTLE_ENGINE_VERSION, seed: 1, allies, enemies: [foe] })
  const target = state.units.find((unit) => unit.id === 'f1')!
  target.brokenAt = 1
  Object.assign(state.input.enemies[0]!, { weaknesses: { weapons: [], elements: [] } })
  Object.assign(state.input.enemies[0]!.stats, { pdef: 0, mdef: 0 })
  return battleDamage(state, state.units.find((unit) => unit.id === '101')!, target, battleChannel(kind), 1, kind).amount
}

const ACCESSORIES: Readonly<Record<string, (classId: RpgClass) => AccessorySlotState[]>> = {
  none: () => [],
  'a Charm, an Orb on a held kind and an Insignia': (classId) => [accessorySlot('bell', 3), accessorySlot('orb', 3, rpgWeaponKind(rpgDefaultWeapons(classId)[0]!)), accessorySlot('insignia', 3)],
  'Pendants and an Orb on an unheld kind': () => [accessorySlot('pendant', 5), accessorySlot('pendant', 2), accessorySlot('orb', 4, 'dark')],
}
const CASES: Case[] = (['brawler', 'mage', 'spellblade', 'cleric', 'tomeblade'] as const).flatMap((classId) => ([1, 2, 3] as const).flatMap((tier) =>
  Object.values(ACCESSORIES).map((slots) => ({ classId, tier, slots: slots(classId) }))))

describe('umaDamageSheet (H139): the sum a fight uses', () => {
  it.each([...CASES, { classId: 'recruit', tier: 1, slots: ACCESSORIES['a Charm, an Orb on a held kind and an Insignia']!('recruit') } as Case,
    { classId: 'mage', tier: 1, slots: [], weaponGrade: 0 } as Case])('$classId, Tier $tier: every row equals the fight', (spec) => {
    const { outfit, uma, ally, allies } = party(spec)
    const sheet = umaDamageSheet(outfit, uma, spec.classId, spec.tier)!
    expect(sheet.weapons.map((row) => row.weapon)).toEqual([...ally.weapons])
    for (const row of sheet.weapons) {
      const stat = row.stat === 'ATK' ? ally.stats.atk : ally.stats.matk
      expect(row.base + row.armor + row.accessory - row.orb + row.stars + row.moon, row.weapon).toBe(stat)
      expect(row.might, row.weapon).toBe(ally.might?.[row.kind] ?? 0)
      expect(row.orb, row.weapon).toBe(ally.flat?.[row.kind] ?? 0)
      expect(row.signature, row.weapon).toBe(ally.signature ?? 0)
      expect(row.total, row.weapon).toBe(row.base + row.might + row.accessory + row.armor + row.stars + row.moon + row.signature)
      expect(row.total, row.weapon).toBe(stat + row.might + row.orb + row.signature)
      expect(hitWith(allies, row.kind), row.weapon).toBe(row.total)
    }
  })

  it('adds her signature only while she wears her family', () => {
    const family = { classId: 'mage', tier: 1, knack: 'mighty' } as const
    const worn = party({ ...family, slots: [accessorySlot('orb', 1, 'fire')] })
    const bare = party({ ...family, slots: [] })
    const signature = worn.ally.signature ?? 0
    expect(signature).toBeGreaterThan(0)
    expect(umaDamageSheet(worn.outfit, worn.uma, 'mage', 1)!.weapons[1]!.signature).toBe(signature)
    expect(umaDamageSheet(bare.outfit, bare.uma, 'mage', 1)!.weapons[1]!.signature).toBe(0)
    expect(hitWith(worn.allies, 'ice')).toBe(umaDamageSheet(worn.outfit, worn.uma, 'mage', 1)!.weapons[1]!.total)
  })

  it('leaves an Orb on an unheld kind out of her three rows', () => {
    const { outfit, uma, ally } = party({ classId: 'brawler', tier: 1, slots: [accessorySlot('orb', 4, 'dark')] })
    expect(ally.flat).toEqual({ dark: 8 })
    expect(umaDamageSheet(outfit, uma, 'brawler', 1)!.weapons.map((row) => row.orb)).toEqual([0, 0, 0])
  })
})

describe('umaDamageSheet (D279): every source on every row', () => {
  it('reads the owner’s Sorcerer: Might, her Charm and Orb, armor and her signature', () => {
    const gear = newGrades(1)
    for (const weapon of rpgDefaultWeapons('mage')) gear.weapons[weapon] = { grade: 3 }
    for (const slot of ARMOR) gear.armor[slot] = { grade: 3 }
    gear.accessories = [accessorySlot('bell', 3), accessorySlot('orb', 3, 'fire'), accessorySlot('insignia', 3)]
    const uma = gradedUma({ level: 20, classId: 'mage', gear, ranks: { classes: { mage: { rank: 20, exp: 0 } } } })
    const sheet = umaDamageSheet(templateOutfit('101', 'clever', 'magical'), uma, 'mage', 1)!
    const [fire, ice] = sheet.weapons
    expect(fire).toMatchObject({ stat: 'M.ATK', might: 8, accessory: 9, orb: 6, armor: 10, stars: 0, moon: 0, signature: 2 })
    expect(ice).toMatchObject({ stat: 'M.ATK', might: 8, accessory: 3, orb: 0, armor: 10, stars: 0, moon: 0, signature: 2 })
    expect(fire!.total - ice!.total).toBe(6)
    expect(sheet.bosses).toBe(3)
  })

  it('gives a hybrid’s rows each its own channel’s sources, each adding up to the sheet’s stat', () => {
    const spec = { classId: 'spellblade', tier: 2, slots: [accessorySlot('pendant', 4), accessorySlot('bell', 2)] } as const
    const { outfit, uma } = party({ ...spec, slots: [...spec.slots] })
    const sheet = umaDamageSheet(outfit, uma, 'spellblade', 2)!
    const rows = umaBattleSheet(outfit, uma, 'spellblade', 2).flatMap((group) => group.rows)
    expect(new Set(sheet.weapons.map((row) => row.stat))).toEqual(new Set(['ATK', 'M.ATK']))
    for (const row of sheet.weapons) {
      expect(String(row.base + row.armor + row.accessory - row.orb + row.stars + row.moon)).toBe(rows.find((r) => r.label === row.stat)!.value)
      expect(row.accessory).toBeGreaterThan(0)
    }
  })

  it('sums her Insignias by grade, and shows none without one', () => {
    const insignias = party({ classId: 'brawler', tier: 1, slots: [accessorySlot('insignia', 1), accessorySlot('insignia', 3), accessorySlot('insignia', 1)] })
    const none = party({ classId: 'brawler', tier: 1, slots: [] })
    expect(umaDamageSheet(insignias.outfit, insignias.uma, 'brawler', 1)!.bosses).toBe(5)
    expect(umaDamageSheet(none.outfit, none.uma, 'brawler', 1)!.bosses).toBe(0)
  })

  it('is null for a non-graded Uma, whose sheet is unchanged', () => {
    const uma = { ...gradedUma({ classId: 'brawler' }), gear: { locker: [], equipped: {}, kinds: {} } }
    expect(umaDamageSheet(templateOutfit('101', 'gritty', 'physical'), uma, 'brawler', 1)).toBeNull()
  })

  it('keeps the sheet’s rows as they were, the Pendants’ and Charms’ share marked', () => {
    const { outfit, uma } = party({ classId: 'brawler', tier: 1, slots: [accessorySlot('pendant', 4)] })
    const atk = umaBattleSheet(outfit, uma, 'brawler', 1)[0]!.rows.find((row) => row.label === 'ATK')!
    expect(atk).toMatchObject({ accessory: 4 })
    expect(atk.gear).toBe(4 + 15)
    expect(umaBattleSheet(outfit, uma, 'brawler', 1)[0]!.rows.find((row) => row.label === 'M.ATK')).not.toHaveProperty('accessory')
  })
})
