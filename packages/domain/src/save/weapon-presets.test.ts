// The owner's weapon presets (D263): one for each Tier 1 class, the two party comps, offered by the Tier 0s that promote into
// it, and where a promotion lands. No fight reads them, so no engine or save generation moves.
import { describe, expect, it } from 'vitest'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { newGrades } from '../economy/grades'
import {
  RPG_CLASS_CHILDREN, RPG_CLASS_PARENTS, RPG_TIER0_CLASSES, RPG_TIER1_CLASSES, RPG_WEAPON_PRESETS, RPG_WEAPONS, rpgDefaultWeapons, rpgPresetClasses, rpgPresetWeapons,
  rpgWeaponKind, validRpgWeapons, type RpgClass, type RpgTier1Class, type RpgWeapon,
} from '../rpg/rules'
import { chooseClass, classOf, promoteUma, setClassWeapons } from './battle'
import { applyClassPreset, classPresetPlan, weaponPreset, wearClassPreset } from './presets'
import { TIER_ONE, worldOf } from './rules'
import { newOwnedUma, newSave, type OwnedUma, type Save, type TierWorld } from './save'

const T = '2026-10-30T12:00:00.000Z'
const graded = (over: Partial<OwnedUma> = {}): OwnedUma => ({ ...newOwnedUma(T), gear: newGrades(1), ...over })
const worldWith = (uma: OwnedUma): TierWorld => ({ ...worldOf(newSave('Presets', T)), umas: { '101': uma } })
const saveWith = (uma: OwnedUma): Save => { const save = newSave('Presets', T); return { ...save, tierWorlds: { ...save.tierWorlds, [TIER_ONE]: worldWith(uma) } } }
const her = (save: Save) => worldOf(save).umas['101']!
const counts = (party: readonly RpgTier1Class[]) => {
  const n = Object.fromEntries(RPG_WEAPONS.map((w) => [w, 0])) as Record<RpgWeapon, number>
  for (const c of party) for (const w of RPG_WEAPON_PRESETS[c]) n[w]++
  return RPG_WEAPONS.map((w) => n[w])
}
const refusal = (run: () => unknown) => { try { run() } catch (err) { return (err as { reason?: string }).reason } return null }

describe('the weapon presets (D263)', () => {
  it('are the owner\'s sets, legal in every class\'s slots', () => {
    expect(RPG_WEAPON_PRESETS).toEqual({
      brawler: ['greatsword', 'axe', 'lance'], mage: ['tome-fire', 'tome-ice', 'tome-lightning'],
      spellblade: ['katana', 'axe', 'tome-lightning'], tomeblade: ['tome-lightning', 'tome-ice', 'katana'],
      armsummoner: ['bow', 'axe', 'tome-dark'], summoner: ['tome-dark', 'tome-ice', 'bow'],
      paladin: ['lance', 'greatsword', 'tome-light'], cleric: ['tome-light', 'tome-fire', 'lance'],
    })
    for (const c of RPG_TIER1_CLASSES) expect(validRpgWeapons(c, RPG_WEAPON_PRESETS[c]), c).toBe(true)
    // Each family's two share their fixed pair; only the middle slot flexes.
    const shared = (a: RpgTier1Class, b: RpgTier1Class) => RPG_WEAPON_PRESETS[a].filter((w) => RPG_WEAPON_PRESETS[b].includes(w)).sort()
    expect(shared('paladin', 'cleric')).toEqual(['lance', 'tome-light'])
    expect(shared('spellblade', 'tomeblade')).toEqual(['katana', 'tome-lightning'])
    expect(shared('summoner', 'armsummoner')).toEqual(['bow', 'tome-dark'])
  })

  it('cover all ten kinds in each party, with the owner\'s counts', () => {
    // Greatsword, Axe, Lance, Bow, Katana, Fire, Blizzard, Thunder, Light, Dark.
    expect(RPG_WEAPONS).toEqual(['greatsword', 'axe', 'lance', 'bow', 'katana', 'tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark'])
    const one: RpgTier1Class[] = ['brawler', 'mage', 'spellblade', 'summoner', 'paladin']
    const two: RpgTier1Class[] = ['brawler', 'mage', 'tomeblade', 'armsummoner', 'cleric']
    expect(counts(one)).toEqual([2, 2, 2, 1, 1, 1, 2, 2, 1, 1])
    expect(counts(two)).toEqual([1, 2, 2, 1, 1, 2, 2, 2, 1, 1])
    for (const party of [one, two]) expect(new Set(party.flatMap((c) => RPG_WEAPON_PRESETS[c].map(rpgWeaponKind))).size).toBe(10)
  })

  it('leave the defaults, older generations and the sims alone', () => {
    expect(rpgDefaultWeapons('paladin')).toEqual(['greatsword', 'axe', 'tome-light'])
    expect(rpgPresetWeapons('paladin', BATTLE_ENGINE_VERSION)).toEqual(['lance', 'greatsword', 'tome-light'])
    expect(rpgPresetWeapons('paladin', 19)).toEqual(['greatsword', 'axe', 'tome-light'])
    // An Uma who never picked keeps what she holds.
    expect(classOf(graded(), 'paladin').weapons).toEqual(['greatsword', 'axe', 'tome-light'])
  })

  it('offer a Tier 1 class its own, and a Tier 0 one for each class it promotes into', () => {
    for (const c of RPG_TIER1_CLASSES) expect(rpgPresetClasses(c)).toEqual([c])
    for (const t of RPG_TIER0_CLASSES) expect(rpgPresetClasses(t)).toEqual(RPG_CLASS_CHILDREN[t])
    expect(rpgPresetClasses('acolyte')).toEqual(['paladin', 'cleric'])
    expect(rpgPresetClasses('recruit')).toEqual(['brawler', 'spellblade', 'armsummoner'])
    for (const c of RPG_TIER1_CLASSES) for (const t of RPG_CLASS_PARENTS[c]) expect(rpgPresetClasses(t), t).toContain(c)
  })

  it('wear the class\'s form, an Orb or a Bell on a kind she holds, or her ★ family', () => {
    const form = (c: RpgTier1Class, family?: 'orb' | 'bell' | 'pendant' | 'insignia') => weaponPreset(c, family).accessory
    expect(form('brawler')).toEqual({ family: 'bell', kind: 'greatsword' })
    expect(form('mage')).toEqual({ family: 'pendant' })
    expect(form('armsummoner')).toEqual({ family: 'orb', kind: 'bow' })
    expect(form('summoner')).toEqual({ family: 'orb', kind: 'dark' })
    expect(form('cleric')).toEqual({ family: 'orb', kind: 'light' })
    expect(form('paladin', 'bell')).toEqual({ family: 'bell', kind: 'lance' })
    expect(form('tomeblade', 'orb')).toEqual({ family: 'orb', kind: 'lightning' })
    expect(form('spellblade', 'insignia')).toEqual({ family: 'insignia' })
    for (const c of RPG_TIER1_CLASSES) {
      const { kind } = form(c, 'orb')
      expect(RPG_WEAPON_PRESETS[c].map(rpgWeaponKind), c).toContain(kind)
    }
  })

  it('let a Tier 0 pick either branch, and leave her grades alone', () => {
    const gear = { ...newGrades(1), weapons: { lance: { grade: 2 } } }
    const uma = graded({ classId: 'acolyte', gear })
    const save = saveWith(uma)
    expect(classOf(uma, 'acolyte').weapons).toEqual(['tome-light', 'tome-ice', 'bow'])
    const paladin = wearClassPreset(save, '101', 'acolyte', T, TIER_ONE, undefined, null, 'paladin')
    expect(classOf(her(paladin), 'acolyte').weapons).toEqual(['lance', 'greatsword', 'tome-light'])
    expect(her(paladin).gear).toEqual({ ...gear, accessories: [{ grade: 0, family: 'pendant', form: 'base' }] })
    expect(classPresetPlan(worldOf(paladin), '101', 'acolyte', undefined, null, 'paladin').changes).toBe(0)
    expect(classPresetPlan(worldOf(paladin), '101', 'acolyte', undefined, null, 'cleric').changes).toBeGreaterThan(0)
    // The same save when nothing would change.
    expect(wearClassPreset(paladin, '101', 'acolyte', T, TIER_ONE, undefined, null, 'paladin')).toBe(paladin)
    const cleric = wearClassPreset(paladin, '101', 'acolyte', T, TIER_ONE, undefined, null, 'cleric')
    expect(classOf(her(cleric), 'acolyte').weapons).toEqual(['tome-light', 'tome-fire', 'lance'])
    expect(her(cleric).gear).toMatchObject({ accessories: [{ grade: 0, family: 'orb', form: 'base', kind: 'light' }] })
  })

  it('work for every Tier 0 and every child, and refuse a class it doesn\'t offer', () => {
    for (const t of RPG_TIER0_CLASSES) for (const c of RPG_CLASS_CHILDREN[t]) {
      const world = applyClassPreset(worldWith(graded({ classId: t })), '101', t, undefined, null, c)
      expect(classOf(world.umas['101']!, t).weapons, `${t} ${c}`).toEqual(RPG_WEAPON_PRESETS[c])
    }
    const world = worldWith(graded({ classId: 'acolyte' }))
    expect(refusal(() => classPresetPlan(world, '101', 'acolyte', undefined, null, 'brawler'))).toBe('bad-class')
    expect(refusal(() => classPresetPlan(world, '101', 'paladin', undefined, null, 'cleric'))).toBe('bad-class')
    // With no pick: a Tier 1 class's own, a Tier 0's model child.
    expect(classPresetPlan(world, '101', 'paladin').weapons).toEqual(RPG_WEAPON_PRESETS.paladin)
    expect(classPresetPlan(world, '101', 'acolyte').weapons).toEqual(RPG_WEAPON_PRESETS.cleric)
  })

  it('drop equipped skills of a tree the preset takes out of her slots', () => {
    const uma = graded({ classId: 'paladin', classes: { paladin: { weapons: ['greatsword', 'axe', 'tome-light'], lines: {}, loadout: ['paladin-axe.1', 'paladin-tome-light.1'] } } })
    const after = applyClassPreset(worldWith(uma), '101', 'paladin').umas['101']!
    expect(after.classes.paladin).toEqual({ weapons: ['lance', 'greatsword', 'tome-light'], lines: {}, loadout: ['paladin-tome-light.1'] })
  })
})

describe('a promotion (D263)', () => {
  const ready = (from: RpgClass) => saveWith(graded({ classId: from, ranks: { classes: { [from]: { rank: 10, exp: 0 } } } }))

  it('lands on the child\'s preset, whatever her Tier 0 held', () => {
    for (const t of RPG_TIER0_CLASSES) for (const c of RPG_CLASS_CHILDREN[t]) {
      const after = promoteUma(ready(t), '101', t, c, T)
      expect(classOf(her(after), c).weapons, `${t} ${c}`).toEqual(RPG_WEAPON_PRESETS[c])
      expect(her(after).classes[c]).toEqual({ weapons: RPG_WEAPON_PRESETS[c], lines: {}, loadout: null })
    }
  })

  it('keeps the Tier 0\'s own setup, and a class set up after it stays hers', () => {
    const start = wearClassPreset(ready('caller'), '101', 'caller', T, TIER_ONE, undefined, null, 'armsummoner')
    const after = promoteUma(start, '101', 'caller', 'summoner', T)
    expect(classOf(her(after), 'caller').weapons).toEqual(RPG_WEAPON_PRESETS.armsummoner)
    const set = setClassWeapons(after, '101', 'summoner', ['tome-dark', 'tome-ice', 'axe'], T)
    expect(classOf(her(chooseClass(set, '101', 'caller', T)), 'summoner').weapons).toEqual(['tome-dark', 'tome-ice', 'axe'])
  })
})
