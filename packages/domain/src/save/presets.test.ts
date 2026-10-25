import { describe, expect, it } from 'vitest'
import { isAmulet, isOrb, isTalisman, orbKind } from '../economy/gear-id'
import { withTrack, type ArmorKind, type RankRef } from '../economy/ranks'
import { RPG_ALL_CLASSES, RPG_CLASS_ARMOR, RPG_KIND_PAIRS, rpgWeaponKind, validRpgWeapons, type RpgClass, type RpgDamageKind } from '../rpg/rules'
import { chooseClass, classOf, equipSkills, learnSkill, setClassWeapons, startingClass, type BattleOutfit } from './battle'
import { applyClassPreset, CLASS_PRESET_ACCESSORIES, classPreset, classPresetPlan, wearClassPreset } from './presets'
import { SaveRuleError, unlockUma, worldOf } from './rules'
import { newSave, parseSave, type OwnedUma, type Save, type TierWorld } from './save'

const T = (n: number) => `2026-10-21T12:${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}.000Z`
// Invented outfits only: 101 a front runner (Brawler), 102 pace (Mage), 103 late (Cleric), 104 end (Summoner).
const outfit = (id: string, style: 'front' | 'pace' | 'late' | 'end'): BattleOutfit => ({
  outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
  growthRatePercents: { speed: 10, stamina: 10, power: 0, guts: 0, wit: 20 },
  aptitudes: { strategy: { front: style === 'front' ? 'A' : 'G', pace: style === 'pace' ? 'A' : 'G', late: style === 'late' ? 'A' : 'G', end: style === 'end' ? 'A' : 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } },
})
const OUTFITS = [outfit('101', 'front'), outfit('102', 'pace'), outfit('103', 'late'), outfit('104', 'end')]

/** Every invented outfit unlocked as today's unlock does it (H32: in her starting class's armor). */
const unlocked = (): Save => OUTFITS.reduce((s, o) => unlockUma(s, o.outfitId, T(0), '1', startingClass(o)), newSave('Luis', T(0)))
const edit = (save: Save, fn: (w: TierWorld) => TierWorld): Save => ({ ...save, tierWorlds: { ...save.tierWorlds, '1': fn(worldOf(save)) } })
const editUma = (save: Save, id: string, fn: (u: OwnedUma) => OwnedUma): Save => edit(save, (w) => ({ ...w, umas: { ...w.umas, [id]: fn(w.umas[id]!) } }))
const stocked = (save: Save, gear: Record<string, number>): Save => edit(save, (w) => ({ ...w, gear: { ...w.gear, ...gear } }))
const ranked = (save: Save, id: string, ref: RankRef, rank: number): Save => editUma(save, id, (u) => ({ ...u, ranks: withTrack(u.ranks, ref, { rank, exp: 0 }) }))
/** Pieces already bound to her and worn in these slots. */
const wearing = (save: Save, id: string, equipped: Record<string, string>, kinds: Record<string, ArmorKind> = {}): Save => editUma(save, id, (u) => ({
  ...u, gear: { locker: [...u.gear.locker, ...Object.values(equipped)], equipped: { ...u.gear.equipped, ...equipped }, kinds: { ...u.gear.kinds, ...kinds } },
}))
const plan = (save: Save, id: string, c: RpgClass) => classPresetPlan(worldOf(save), id, c)
const roundTrips = (save: Save) => expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
/** The reason a rule refuses, or null when it doesn't. */
const refusal = (fn: () => unknown): string | null => {
  try { fn(); return null } catch (err) { return err instanceof SaveRuleError ? err.reason : String(err) }
}

describe('the standard preset per class (H33, classes v2 §7, C6)', () => {
  // Classes v1's presets (engine 14), kept to document the old game; v2's six are `accessories-v2.test.ts`'s (H57).
  it('had a v1 row for every class: its default spread, its armor half, an Orb for a kind it lacks and a support', () => {
    expect(Object.keys(CLASS_PRESET_ACCESSORIES).sort()).toEqual([...RPG_ALL_CLASSES].sort())
    const partner = (k: RpgDamageKind): RpgDamageKind => { const pair = RPG_KIND_PAIRS.find((p) => (p as readonly string[]).includes(k))!; return pair[0] === k ? pair[1] : pair[0] }
    for (const c of RPG_ALL_CLASSES) {
      const p = classPreset(c, 14)
      expect(validRpgWeapons(c, p.weapons, 14), c).toBe(true)
      expect(p.armor).toBe(RPG_CLASS_ARMOR[c])
      expect(isOrb(p.orb), c).toBe(true)
      const kinds = p.weapons.map(rpgWeaponKind)
      expect(kinds, c).not.toContain(orbKind(p.orb))
      // The shape partner of her first weapon whose partner she doesn't wield.
      expect(orbKind(p.orb), c).toBe(kinds.map(partner).find((k) => !kinds.includes(k)))
      expect(isTalisman(p.support) || isAmulet(p.support), c).toBe(true)
    }
    expect(classPreset('mage', 14)).toEqual({ classId: 'mage', weapons: ['tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark'], armor: 'magical', orb: 'orb-greatsword', support: 'amulet-siphon' })
  })

  it('is what a new Uma already wears (H32)', () => {
    const save = unlocked()
    for (const o of OUTFITS) {
      const c = startingClass(o)
      expect(plan(save, o.outfitId, c), c).toMatchObject({ changes: 0, binds: [] })
      expect(wearClassPreset(save, o.outfitId, c, T(1))).toBe(save)
    }
    // A Mage unlocked before H32 wore physical armor: the preset turns all five slots magical, in Training pieces.
    const old = unlockUma(newSave('Luis', T(0)), '102', T(0))
    const p = plan(old, '102', 'mage')
    expect(p.changes).toBe(5)
    expect(p.kinds).toEqual({ head: 'circlet', body: 'robe', legs: 'leggings', arms: 'bracers', feet: 'slippers' })
    expect(p.wear).toMatchObject({ head: null, body: null, legs: null, arms: null, feet: null, 'tome-fire': null })
    expect(p.wear).not.toHaveProperty('accessory-1')
    const after = wearClassPreset(old, '102', 'mage', T(1))
    expect(worldOf(after).umas['102']!.gear).toEqual({ locker: [], equipped: {}, kinds: p.kinds })
    expect(plan(after, '102', 'mage').changes).toBe(0)
    roundTrips(after)
  })

  it('climbs each track in order, up to her rank, and leaves the stock above it', () => {
    let save = stocked(ranked(unlocked(), '102', { kind: 'armor', id: 'robe' }, 2), { 'robe-g1': 1, 'robe-g2': 1, 'robe-g3': 1 })
    const p = plan(save, '102', 'mage')
    expect(p.binds).toEqual(['robe-g1', 'robe-g2'])
    expect(p.wear.body).toBe('robe-g2')
    expect(p.changes).toBe(1)
    save = wearClassPreset(save, '102', 'mage', T(1))
    const w = worldOf(save)
    expect(w.gear).toEqual({ 'robe-g3': 1 })
    expect(w.umas['102']!.gear.locker).toEqual(['robe-g1', 'robe-g2'])
    expect(w.umas['102']!.gear.equipped).toEqual({ body: 'robe-g2' })
    roundTrips(save)
    // Robe Rank 1 and only grade 2 in stock: grade 1 comes first, so nothing binds and she keeps the Training Robe.
    const short = stocked(unlocked(), { 'robe-g2': 2 })
    expect(plan(short, '102', 'mage')).toMatchObject({ binds: [], changes: 0, wear: { body: null } })
    // Her own best piece her rank allows comes before the stock: G1 bound, G2 in stock but Robe Rank 1.
    const own = editUma(stocked(unlocked(), { 'robe-g2': 1 }), '102', (u) => ({ ...u, gear: { ...u.gear, locker: ['robe-g1'] } }))
    expect(plan(own, '102', 'mage')).toMatchObject({ binds: [], changes: 1, wear: { body: 'robe-g1' } })
  })

  it('binds none of the other half, and sends a piece of it back to her locker', () => {
    let save = stocked(unlocked(), { 'circlet-g1': 1, 'robe-g1': 1, 'helm-g1': 1 })
    save = wearing(save, '101', { body: 'robe-g1' }, { body: 'robe' })
    const p = plan(save, '101', 'brawler')
    expect(p.binds).toEqual(['helm-g1'])
    expect(p.kinds.body).toBe('cuirass')
    expect(p.wear.body).toBeNull()
    save = wearClassPreset(save, '101', 'brawler', T(1))
    const uma = worldOf(save).umas['101']!
    expect(uma.gear.equipped).toEqual({ head: 'helm-g1' })
    expect(uma.gear.locker).toEqual(['robe-g1', 'helm-g1'])
    expect(uma.gear.kinds).toEqual({ head: 'helm', body: 'cuirass', legs: 'greaves', arms: 'gauntlets', feet: 'boots' })
    expect(worldOf(save).gear).toEqual({ 'circlet-g1': 1, 'robe-g1': 1 })
    roundTrips(save)
  })

  it('puts back the default spread, keeping her tree and loadout and her pieces on other weapons', () => {
    const blade = outfit('101', 'front')
    let save = edit(unlocked(), (w) => ({ ...w, umas: { ...w.umas, '101': { ...w.umas['101']!, ranks: withTrack(w.umas['101']!.ranks, { kind: 'class', id: 'spellblade' }, { rank: 5, exp: 0 }) } } }))
    save = chooseClass(save, '101', 'spellblade', T(1))
    save = setClassWeapons(save, '101', 'spellblade', ['katana', 'bow', 'axe', 'tome-dark', 'tome-ice'], T(2))
    save = learnSkill(save, blade, 'spellblade', 'spellblade-bow.1a', T(3))
    save = learnSkill(save, blade, 'spellblade', 'spellblade-katana.1a', T(4))
    save = equipSkills(save, blade, 'spellblade', ['spellblade-bow.1a', 'spellblade-katana.1a'], T(5))
    save = wearing(save, '101', { bow: 'bow-g1' })
    const before = classOf(worldOf(save).umas['101']!, 'spellblade')
    const p = plan(save, '101', 'spellblade')
    expect(p.weapons).toEqual(['greatsword', 'lance', 'katana', 'tome-fire', 'tome-lightning'])
    // All five positions change (her Katana moves from 1 to 3), and nothing else.
    expect(p.changes).toBe(5)
    save = wearClassPreset(save, '101', 'spellblade', T(6))
    const uma = worldOf(save).umas['101']!
    expect(classOf(uma, 'spellblade')).toEqual({ ...before, weapons: p.weapons })
    expect(uma.gear.equipped).toEqual({ bow: 'bow-g1' })
    roundTrips(save)
  })

  it('wears the Orb in the Damage slot and the support in the Support slot (classes v2, C10)', () => {
    // A Greatsword Orb from the stock goes to accessory 1, the Damage slot.
    let save = stocked(unlocked(), { 'orb-greatsword-g1': 1 })
    expect(plan(save, '101', 'brawler')).toMatchObject({ binds: ['orb-greatsword-g1'], wear: { 'accessory-1': 'orb-greatsword-g1' }, changes: 1 })
    save = wearClassPreset(save, '101', 'brawler', T(1))
    expect(worldOf(save).umas['101']!.gear.equipped).toEqual({ 'accessory-1': 'orb-greatsword-g1' })
    expect(worldOf(save).gear).toEqual({})
    roundTrips(save)
    // An Orb of another kind she wears gives way to her preset's; her Vampire Talisman binds into accessory 2, the Support slot.
    const other = stocked(wearing(unlocked(), '101', { 'accessory-1': 'orb-fire-g1' }), { 'orb-greatsword-g1': 1, 'talisman-vampire-g1': 1, 'amulet-ward-g1': 1 })
    const p = plan(other, '101', 'brawler')
    expect(p).toMatchObject({ binds: ['orb-greatsword-g1', 'talisman-vampire-g1'], wear: { 'accessory-1': 'orb-greatsword-g1', 'accessory-2': 'talisman-vampire-g1' }, changes: 2 })
    const after = wearClassPreset(other, '101', 'brawler', T(1))
    expect(worldOf(after).umas['101']!.gear.equipped).toEqual({ 'accessory-1': 'orb-greatsword-g1', 'accessory-2': 'talisman-vampire-g1' })
    expect(worldOf(after).umas['101']!.gear.locker).toEqual(expect.arrayContaining(['orb-fire-g1']))
    expect(worldOf(after).gear).toEqual({ 'amulet-ward-g1': 1 })
    roundTrips(after)
    // With no Orb of her kind to wear, her own Orb stays on.
    const kept = stocked(wearing(unlocked(), '101', { 'accessory-1': 'orb-fire-g1' }), { 'talisman-vampire-g1': 1 })
    expect(plan(kept, '101', 'brawler').wear).not.toHaveProperty('accessory-1')
  })

  it('applies to the world only when something changes, and refuses an Uma not owned or an unknown class', () => {
    const save = unlocked()
    const world = worldOf(save)
    expect(applyClassPreset(world, '101', 'brawler')).toBe(world)
    expect(applyClassPreset(world, '101', 'mage')).not.toBe(world)
    expect(refusal(() => wearClassPreset(save, '999', 'mage', T(1)))).toBe('not-owned')
    expect(refusal(() => wearClassPreset(save, '101', 'bard' as RpgClass, T(1)))).toBe('bad-class')
    expect(refusal(() => classPresetPlan(world, '101', 'bard' as RpgClass))).toBe('bad-class')
    // Classes v1 had no Paladin.
    expect(refusal(() => classPresetPlan(world, '101', 'paladin', 14))).toBe('bad-class')
  })
})
