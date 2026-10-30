// The Tier rework's coverage checks (H66, D202; class-progression.md §4.5, CP4 and CP7): the campaign is balanced on the
// owner's defaults (H64) and the Rift's guided builds answer their fronts, checked on the rules and the generator before
// any fight. Fast, so it runs on every build; it prints nothing. v16–v18's twins throughout (explicit since H134: Classes v3
// re-pairs them from v19, CV13, `kinds-v19.test.ts`).
import { describe, expect, it } from 'vitest'
import {
  isRpgTome, isRpgWeaponKind, RPG_DAMAGE_KINDS, RPG_ELEMENTS, RPG_TWIN_SET_IDS, RPG_WEAPON_KINDS, rpgAnsweredTwinSets,
  rpgClassSlots, rpgDefaultWeapons, rpgTomeOf, rpgTwinSets, rpgTwinsOf, rpgWeaponKind, validRpgWeapons,
  type RpgClass, type RpgV2Class, type RpgDamageKind, type RpgTwinSet, type RpgWeapon,
} from '../rpg/rules'
import type { BattleWeaknesses } from '../rpg/battle/types'
import { riftGuidedBuild, riftParty } from '../rift/fronts'
import { RIFT_FRONTS, type RiftFront } from '../rift/state'
import { BIOMES } from './biomes'
import { capitalChapter } from './capital'
import { regionChapter, worldContinent } from './world'

const V16 = 16
const ALL_CLASSES: readonly RpgV2Class[] = ['brawler', 'mage', 'spellblade', 'summoner', 'paladin', 'cleric']
type Healer = 'cleric' | 'paladin'
/** The five fight types on the owner's defaults: physical, magical, the two hybrids and a healer. */
const defaultParty = (healer: Healer): RpgWeapon[][] =>
  (['brawler', 'mage', 'spellblade', 'summoner', healer] as const).map((c) => rpgDefaultWeapons(c, V16))
const kindsOf = (weapons: readonly RpgWeapon[]): RpgDamageKind[] => weapons.map(rpgWeaponKind)
/** How many members hold each of `kinds`. */
const holders = (party: readonly (readonly RpgWeapon[])[], kinds: readonly RpgDamageKind[]): number[] =>
  kinds.map((k) => party.filter((m) => kindsOf(m).includes(k)).length)
/** How many members answer each twin set (hold either of its kinds). */
const answers = (party: readonly (readonly RpgWeapon[])[], sets: readonly RpgTwinSet[] = RPG_TWIN_SET_IDS): number[] =>
  sets.map((set) => party.filter((m) => rpgAnsweredTwinSets(m, V16).includes(set)).length)
const setOf = (w: BattleWeaknesses): RpgTwinSet => w.elements[0] ?? 'twilight'
/** The world's 48 signatures as twin sets: each signature one, a pair's two leads a half each (W3). */
const signatureSets = (): [RpgTwinSet, number][] => BIOMES.flatMap((b) => b.signatures.flatMap((sig) =>
  sig.length > 1 ? [0, 1].map((slot): [RpgTwinSet, number] => [setOf(rpgTwinsOf(sig, slot)), 0.5]) : [[setOf(rpgTwinsOf(sig, 0)), 1] as [RpgTwinSet, number]]))
const ELEMENT_SETS = RPG_TWIN_SET_IDS.filter((s) => s !== 'twilight')
const pct = (x: number) => Math.round(x * 100)

describe('the world’s 48 signatures as twin sets (CP5)', () => {
  it('asks for Fire 11, Ice 11, Lightning 9.5, Dark 8, Light 6.5 and Twilight 2', () => {
    const sets = signatureSets()
    expect(BIOMES.flatMap((b) => b.signatures)).toHaveLength(48)
    const weight = (set: RpgTwinSet) => sets.filter(([s]) => s === set).reduce((sum, [, w]) => sum + w, 0)
    expect(RPG_TWIN_SET_IDS.map(weight)).toEqual([11, 11, 9.5, 6.5, 8, 2])
  })
})

describe('the campaign’s four checks on the owner’s defaults (CP4)', () => {
  it.each(['cleric', 'paladin'] as const)('1. the five fight types hold all ten kinds, with a %s', (healer) => {
    expect(new Set(defaultParty(healer).flatMap(kindsOf))).toEqual(new Set(RPG_DAMAGE_KINDS))
  })

  it.each([
    ['cleric', [2, 3, 3, 2, 2, 3]],
    ['paladin', [3, 3, 3, 2, 2, 2]],
  ] as const)('2. with a %s, at least two members answer every twin set (Fire, Ice, Lightning, Light, Dark, Twilight: %j)', (healer, table) => {
    expect(answers(defaultParty(healer))).toEqual(table)
    expect(Math.min(...table)).toBeGreaterThanOrEqual(2)
  })

  it.each([
    ['cleric', [1, 1, 2, 2, 1, 1, 2, 2, 2, 1]],
    ['paladin', [2, 2, 2, 1, 1, 1, 1, 2, 2, 1]],
  ] as const)('3. with a %s, every single kind is held at least once (Greatsword … Dark: %j)', (healer, table) => {
    expect(RPG_DAMAGE_KINDS).toEqual([...RPG_WEAPON_KINDS, ...RPG_ELEMENTS])
    expect(holders(defaultParty(healer), RPG_DAMAGE_KINDS)).toEqual(table)
  })

  it('4. any class answers any element’s twin set with one pick, and every class with an Arms slot Twilight', () => {
    // One pick: a kind of the set in one of her slots of its channel, the rest her defaults, still a legal set of three.
    const onePick = (classId: RpgClass, set: RpgTwinSet): boolean => {
      const defaults = rpgDefaultWeapons(classId, V16)
      if (rpgAnsweredTwinSets(defaults, V16).includes(set)) return true
      return rpgTwinSets(V16)[set].some((kind) => {
        const weapon: RpgWeapon = isRpgWeaponKind(kind) ? kind : rpgTomeOf(kind)
        return rpgClassSlots(classId, V16).some((slot, i) => (slot === 'tome') === isRpgTome(weapon) &&
          validRpgWeapons(classId, defaults.map((w, k) => (k === i ? weapon : w)), V16))
      })
    }
    for (const classId of ALL_CLASSES) for (const set of ELEMENT_SETS) expect(onePick(classId, set), `${classId} ${set}`).toBe(true)
    // Twilight is two Arms and no element (D66's Light + Dark foes break on weapons alone): the Mage, all Tomes, can't.
    expect(ALL_CLASSES.filter((c) => !onePick(c, 'twilight'))).toEqual(['mage'])
  })

  it('weights the default party’s answers at 2.47 a foe with a Cleric and 2.66 with a Paladin', () => {
    const sets = signatureSets()
    const average = (healer: Healer) => {
      const party = defaultParty(healer)
      return sets.reduce((sum, [set, w]) => sum + w * answers(party, [set])[0]!, 0) / 48
    }
    expect(average('cleric')).toBeCloseTo(2.47, 2)
    expect(average('paladin')).toBeCloseTo(2.66, 2)
  })

  it('answers 66% of signatures with one Brawler or Mage, 59% a Paladin, 41% a Spell Blade or Cleric, 34% a Summoner', () => {
    const sets = signatureSets()
    const share = (classId: RpgClass) => {
      const held = rpgAnsweredTwinSets(rpgDefaultWeapons(classId, V16), V16)
      return pct(sets.filter(([s]) => held.includes(s)).reduce((sum, [, w]) => sum + w, 0) / 48)
    }
    const expected: Record<RpgV2Class, number> = { brawler: 66, mage: 66, paladin: 59, spellblade: 41, cleric: 41, summoner: 34 }
    for (const classId of ALL_CLASSES) expect(Math.abs(share(classId) - expected[classId]), classId).toBeLessThanOrEqual(1)
  })

  it.each(['cleric', 'paladin'] as const)('gives every foe of every Tier 1 region and capital on v16 two answers or more, with a %s', (healer) => {
    const party = defaultParty(healer).map(kindsOf)
    let foes = 0
    for (let order = 1; order <= 5; order++) {
      const continent = worldContinent({ name: 'T', order })
      const list = [...continent.regions.map((r) => regionChapter(r, [], V16)), capitalChapter(continent, [], V16)]
      for (const foe of list.flatMap((c) => c.nodes.flatMap((n) => [n.enemies, ...(n.waves ?? [])].flat()))) {
        const weak: RpgDamageKind[] = [...foe.weaknesses.weapons, ...foe.weaknesses.elements]
        expect(party.filter((m) => m.some((k) => weak.includes(k))).length).toBeGreaterThanOrEqual(2)
        foes += 1
      }
    }
    expect(foes).toBeGreaterThan(5000)
  })
})

describe('the Rift’s guided builds, Tier 1 (CP7)', () => {
  const build = (front: RiftFront) => riftGuidedBuild(front, V16)
  const weapons = (front: RiftFront) => build(front).map((m) => m.weapons)

  it('keeps classes v2’s compositions (D178, point 5), every build legal, slot order lead channel first', () => {
    for (const front of RIFT_FRONTS) {
      expect(build(front).map((m) => m.classId)).toEqual(riftParty(front, V16))
      for (const m of build(front)) expect(validRpgWeapons(m.classId, m.weapons, V16), `${front} ${m.classId}`).toBe(true)
    }
    expect(build('iron').map((m) => m.weapons)).toEqual([['greatsword', 'axe', 'lance'], ['bow', 'katana', 'axe'], ['katana', 'lance', 'tome-lightning'],
      ['bow', 'greatsword', 'tome-fire'], ['greatsword', 'axe', 'tome-light']])
    expect(build('arcane').map((m) => m.weapons)).toEqual(build('arcane').map((m) => rpgDefaultWeapons(m.classId, V16)))
    expect(build('duel').map((m) => m.weapons)).toEqual([['greatsword', 'axe', 'lance'], ['bow', 'katana', 'lance'],
      ['tome-fire', 'tome-ice', 'tome-lightning'], ['tome-light', 'tome-dark', 'tome-lightning'], ['greatsword', 'axe', 'tome-light']])
    expect(build('horde').map((m) => m.weapons)).toEqual([['katana', 'lance', 'tome-lightning'], ['greatsword', 'axe', 'tome-fire'],
      ['tome-dark', 'tome-light', 'bow'], ['tome-ice', 'tome-fire', 'lance'], ['tome-light', 'tome-ice', 'bow']])
  })

  it('answers Iron’s Arms at least twice: Greatsword 3, Axe 3, Lance 2, Bow 2, Katana 2', () => {
    expect(holders(weapons('iron'), RPG_WEAPON_KINDS)).toEqual([3, 3, 2, 2, 2])
  })

  it('answers Arcane’s elements at least twice: Fire 2, Ice 3, Lightning 2, Light 3, Dark 2', () => {
    expect(holders(weapons('arcane'), RPG_ELEMENTS)).toEqual([2, 3, 2, 3, 2])
  })

  it('answers the Duel’s twin sets 3, 3, 4, 3, 2 and the Horde’s 2, 3, 2, 2, 2', () => {
    expect(answers(weapons('duel'), ELEMENT_SETS)).toEqual([3, 3, 4, 3, 2])
    expect(answers(weapons('horde'), ELEMENT_SETS)).toEqual([2, 3, 2, 2, 2])
  })

  it('holds every kind the later foes ask for at least once (the Horde: 1, 1, 2, 2, 1, 2, 2, 1, 2, 1)', () => {
    expect(holders(weapons('horde'), RPG_DAMAGE_KINDS)).toEqual([1, 1, 2, 2, 1, 2, 2, 1, 2, 1])
    expect(Math.min(...holders(weapons('duel'), RPG_DAMAGE_KINDS))).toBeGreaterThanOrEqual(1)
  })

  it('hands the guided classes their own defaults before v16', () => {
    for (const engine of [14, 15]) {
      for (const front of RIFT_FRONTS) {
        expect(riftGuidedBuild(front, engine)).toEqual(riftParty(front, engine).map((classId) => ({ classId, weapons: rpgDefaultWeapons(classId, engine) })))
      }
    }
  })
})
