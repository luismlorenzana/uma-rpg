// Classes v2's accessories over the save, built dark (H57, classes-v2.md §6, §7) and live since H61 (D188): the typed slots
// when she equips, the six standard presets, "Can upgrade" for an empty typed slot, and the battle sheet's Orb and Mends
// rows. v2 cases pass engine 15, and the live game's defaults are checked to be the same; v1's (engine 14) alongside.
import { describe, expect, it, vi } from 'vitest'
import { orbKind } from '../economy/gear-id'
import { BATTLE_HEAL_OFFENSE_SCALE } from '../rpg/battle/caps'
import { RPG_V2_CLASSES, RPG_CLASS_ARMOR, rpgWeaponKind, validRpgWeapons } from '../rpg/rules'
import type { BattleOutfit } from './battle'
import { equipGear, wearAccessory } from './forge'
import { CLASS_PRESET_ACCESSORIES, CLASS_PRESET_SUPPORT_V2, classPreset, classPresetPlan, wearClassPreset } from './presets'
import { SaveRuleError, unlockUma, worldOf } from './rules'
import { gearV1, newSave, parseSave, type OwnedUma, type Save, type TierWorld } from './save'
import { umaBattleSheet } from './sheet'
import { upgradesFor } from './upgrades'

// The v1 economy's rules, kept as the old game's record since R2's switch (H82, D218): this file runs as the game before
// it, the switch at engine 16 (today's facilities, crafted pieces, Star Gems and gear ranks) and old saves read through
// the chain to v27.
vi.mock('../rpg/battle/caps', async (orig) => (await import('../rpg/battle/caps-at.fixture')).capsAt(16, await orig()))
vi.mock('./migrations', async (orig) => { const m = await orig<typeof import('./migrations')>(); return { ...m, migrateWorld: m.migrateWorldToV27 } })

const T = (n: number) => `2026-10-22T12:00:${String(n).padStart(2, '0')}.000Z`
// An invented front runner: a Brawler.
const O101: BattleOutfit = { outfitId: '101', baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
  growthRatePercents: { speed: 10, stamina: 10, power: 0, guts: 0, wit: 20 }, aptitudes: { strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } } }
const edit = (save: Save, fn: (w: TierWorld) => TierWorld): Save => ({ ...save, tierWorlds: { ...save.tierWorlds, '1': fn(worldOf(save)) } })
const editUma = (save: Save, fn: (u: OwnedUma) => OwnedUma): Save => edit(save, (w) => ({ ...w, umas: { ...w.umas, '101': fn(w.umas['101']!) } }))
/** Uma 101 as a Brawler, with this stock. */
const brawler = (gear: Record<string, number> = {}): Save => edit(unlockUma(newSave('Luis', T(0)), '101', T(0), '1', 'brawler'), (w) => ({ ...w, gear }))
/** Pieces already hers, worn in these slots. */
const wearing = (save: Save, equipped: Record<string, string>): Save => editUma(save, (u) => ({
  ...u, gear: { ...gearV1(u), locker: [...gearV1(u).locker, ...Object.values(equipped)], equipped: { ...gearV1(u).equipped, ...equipped } },
}))
const accessories = (save: Save) => {
  const e = gearV1(worldOf(save).umas['101']!).equipped
  return { 'accessory-1': e['accessory-1'], 'accessory-2': e['accessory-2'] }
}
const refusal = (fn: () => unknown): string | null => {
  try { fn(); return null } catch (err) { return err instanceof SaveRuleError ? `${err.reason}: ${err.message}` : String(err) }
}
const roundTrips = (save: Save) => expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)

describe('typed slots when she equips (classes v2 §6.1, C10)', () => {
  it('puts an Orb in the Damage slot and a Talisman or an Amulet in the Support slot, whichever is free', () => {
    let save = brawler({ 'orb-fire-g1': 1, 'talisman-vital-g1': 1, 'amulet-veil-g1': 1, 'orb-lance-g1': 1 })
    save = equipGear(save, '101', 'talisman-vital-g1', T(1), '1', undefined, 15)
    expect(accessories(save)).toEqual({ 'accessory-1': undefined, 'accessory-2': 'talisman-vital-g1' })
    save = equipGear(save, '101', 'orb-fire-g1', T(2), '1', undefined, 15)
    expect(accessories(save)).toEqual({ 'accessory-1': 'orb-fire-g1', 'accessory-2': 'talisman-vital-g1' })
    // An Amulet swaps the Talisman out, a second Orb the first; each stays in her locker.
    save = wearAccessory(save, '101', 'accessory-2', 'amulet-veil-g1', T(3), '1', 15)
    save = wearAccessory(save, '101', 'accessory-1', 'orb-lance-g1', T(4), '1', 15)
    expect(accessories(save)).toEqual({ 'accessory-1': 'orb-lance-g1', 'accessory-2': 'amulet-veil-g1' })
    expect(gearV1(worldOf(save).umas['101']!).locker).toEqual(expect.arrayContaining(['talisman-vital-g1', 'orb-fire-g1']))
    roundTrips(save)
  })

  it('refuses the other slot, with the slot’s rule', () => {
    const save = wearing(brawler(), { 'accessory-1': 'orb-fire-g1', 'accessory-2': 'talisman-vital-g1' })
    expect(refusal(() => wearAccessory(save, '101', 'accessory-2', 'orb-fire-g1', T(1), '1', 15)))
      .toBe('bad-loadout: The Support slot takes a Talisman or an Amulet')
    expect(refusal(() => wearAccessory(save, '101', 'accessory-1', 'talisman-vital-g1', T(1), '1', 15))).toBe('bad-loadout: The Damage slot takes an Orb')
    expect(refusal(() => equipGear(save, '101', 'talisman-vital-g1', T(1), '1', 'accessory-1', 15))).toBe('bad-loadout: The Damage slot takes an Orb')
  })

  it('types the live slots, where v1 let either slot take any accessory, the first free one by default', () => {
    const stock = brawler({ 'talisman-vital-g1': 1, 'orb-lance-g1': 1 })
    expect(accessories(equipGear(stock, '101', 'talisman-vital-g1', T(1)))).toEqual({ 'accessory-1': undefined, 'accessory-2': 'talisman-vital-g1' })
    let v1 = equipGear(stock, '101', 'talisman-vital-g1', T(1), '1', undefined, 14)
    expect(accessories(v1)).toEqual({ 'accessory-1': 'talisman-vital-g1', 'accessory-2': undefined })
    v1 = wearAccessory(v1, '101', 'accessory-2', 'orb-lance-g1', T(2), '1', 14)
    expect(accessories(v1)).toEqual({ 'accessory-1': 'talisman-vital-g1', 'accessory-2': 'orb-lance-g1' })
  })
})

describe('six standard presets (classes v2 §7, C6)', () => {
  it('gives each class her v2 spread, her armor half, the Orb of her leading kind and a support', () => {
    const rows = Object.fromEntries(RPG_V2_CLASSES.map((c) => [c, [classPreset(c, 15).orb, classPreset(c, 15).support]]))
    expect(rows).toEqual({
      brawler: ['orb-greatsword', 'talisman-vampire'], mage: ['orb-fire', 'amulet-siphon'], spellblade: ['orb-greatsword', 'talisman-vampire'],
      cleric: ['orb-light', 'amulet-spring'], summoner: ['orb-fire', 'amulet-siphon'], paladin: ['orb-greatsword', 'talisman-thorn'],
    })
    for (const c of RPG_V2_CLASSES) {
      const p = classPreset(c, 15)
      expect(validRpgWeapons(c, p.weapons, 15), c).toBe(true)
      expect(p.armor, c).toBe(RPG_CLASS_ARMOR[c])
      // A flat Orb strengthens her leading damage: her spread's first weapon's kind.
      expect(orbKind(p.orb), c).toBe(rpgWeaponKind(p.weapons[0]!))
      // v1's support, but where v2 lists its own.
      expect(p.support, c).toBe(CLASS_PRESET_SUPPORT_V2[c] ?? CLASS_PRESET_ACCESSORIES[c].support)
      // The live preset is v16's since H72 (her three, her Orb on her first slot's kind; `world/balance-v16.test.ts`).
      expect(classPreset(c), c).toEqual(classPreset(c, 16))
    }
    expect(classPreset('cleric', 15).weapons).toEqual(['tome-light', 'tome-dark', 'tome-lightning', 'katana', 'bow'])
  })

  it('binds and wears a Paladin’s: her spread, physical armor, a Greatsword Orb and a Thorn Talisman', () => {
    const kit = ['greatsword', 'axe', 'lance', 'tome-ice', 'tome-fire', 'helm', 'cuirass', 'greaves', 'gauntlets', 'boots', 'orb-greatsword', 'talisman-thorn']
    const save = brawler(Object.fromEntries(kit.map((t) => [`${t}-g1`, 1])))
    // Classes v1 had no Paladin; the live game has.
    expect(refusal(() => classPresetPlan(worldOf(save), '101', 'paladin', 14))).toBe('bad-class: no class paladin')
    const plan = classPresetPlan(worldOf(save), '101', 'paladin', 15)
    expect(plan.weapons).toEqual(['greatsword', 'axe', 'lance', 'tome-ice', 'tome-fire'])
    expect(plan.kinds).toEqual({ head: 'helm', body: 'cuirass', legs: 'greaves', arms: 'gauntlets', feet: 'boots' })
    expect([...plan.binds].sort()).toEqual(kit.map((t) => `${t}-g1`).sort())
    const after = wearClassPreset(save, '101', 'paladin', T(1), '1', 15)
    const uma = worldOf(after).umas['101']!
    expect(gearV1(uma).equipped).toEqual({ ...Object.fromEntries(kit.slice(0, 5).map((w) => [w, `${w}-g1`])),
      head: 'helm-g1', body: 'cuirass-g1', legs: 'greaves-g1', arms: 'gauntlets-g1', feet: 'boots-g1',
      'accessory-1': 'orb-greatsword-g1', 'accessory-2': 'talisman-thorn-g1' })
    expect(worldOf(after).gear).toEqual({})
    expect(classPresetPlan(worldOf(after), '101', 'paladin', 15).changes).toBe(0)
  })
})

describe('"Can upgrade" with typed slots (classes v2 §7, H34)', () => {
  const slots = (save: Save, engine: 14 | 15) => upgradesFor(worldOf(save), '101', 'brawler', 1, engine)!.gearSlots.filter((s) => s.startsWith('accessory'))
  it('counts an empty Support slot for a Talisman or an Amulet in stock, never for an Orb', () => {
    const orbOn = wearing(brawler({ 'orb-lance-g1': 1 }), { 'accessory-1': 'orb-fire-g1' })
    expect(slots(orbOn, 15)).toEqual([])
    expect(slots(orbOn, 14)).toEqual(['accessory-2'])
    const talisman = edit(orbOn, (w) => ({ ...w, gear: { 'talisman-vital-g1': 1 } }))
    expect(slots(talisman, 15)).toEqual(['accessory-2'])
  })

  it('counts an empty Damage slot only for an Orb', () => {
    expect(slots(brawler({ 'amulet-spring-g1': 1 }), 15)).toEqual(['accessory-2'])
    expect(slots(brawler({ 'amulet-spring-g1': 1 }), 14)).toEqual(['accessory-1'])
    expect(slots(brawler({ 'orb-axe-g1': 1, 'amulet-spring-g1': 1 }), 15)).toEqual(['accessory-1', 'accessory-2'])
    expect(slots(brawler({ 'orb-axe-g1': 2 }), 15)).toEqual(['accessory-1'])
    expect(upgradesFor(worldOf(brawler({ 'orb-axe-g1': 2 })), '101', 'brawler')).toEqual(upgradesFor(worldOf(brawler({ 'orb-axe-g1': 2 })), '101', 'brawler', 1, 15))
  })
})

describe('the battle sheet in classes v2 (§3.3, §6.2)', () => {
  const uma = (save: Save) => worldOf(save).umas['101']!
  const rows = (save: Save, classId: 'brawler' | 'paladin' | 'cleric', engine?: number) =>
    umaBattleSheet(O101, uma(save), classId, 1, engine).flatMap((g) => g.rows)
  const row = (save: Save, classId: 'brawler' | 'paladin' | 'cleric', label: string, engine?: number) => rows(save, classId, engine).find((r) => r.label === label)
  const save = wearing(brawler(), { 'accessory-1': 'orb-fire-g10', 'accessory-2': 'amulet-siphon-g10' })

  it('shows her Orb’s offense, and no Heal row for a Brawler', () => {
    expect(row(save, 'brawler', 'Orb', 15)?.value).toBe('Fire Orb +34')
    expect(row(brawler(), 'brawler', 'Orb', 15)?.value).toBe('None')
    expect(row(save, 'brawler', 'Orbs', 15)).toBeUndefined()
    expect(row(save, 'brawler', 'Heal', 15)).toBeUndefined()
    expect(row(save, 'brawler', 'Mends', 15)).toBeUndefined()
    expect(row(save, 'brawler', 'MP Steal', 15)?.value).toBe('8%')
  })

  it('shows a healer’s mends from her ATK (Paladin) or M.ATK (Cleric)', () => {
    const atk = Number(row(save, 'paladin', 'ATK', 15)!.value)
    expect(row(save, 'paladin', 'Mends', 15)?.value).toBe(`×${(1 + atk / BATTLE_HEAL_OFFENSE_SCALE).toFixed(2)} (from ATK)`)
    const matk = Number(row(save, 'cleric', 'M.ATK', 15)!.value)
    expect(row(save, 'cleric', 'Mends', 15)?.value).toBe(`×${(1 + matk / BATTLE_HEAL_OFFENSE_SCALE).toFixed(2)} (from M.ATK)`)
    expect(row(save, 'cleric', 'Heal', 15)).toBeUndefined()
  })

  it('is v1’s at engine 14: Orb kinds and Heal; the live sheet is v16’s (H72)', () => {
    expect(row(save, 'brawler', 'Orbs', 14)?.value).toBe('Fire')
    expect(row(save, 'brawler', 'Heal', 14)?.value).toMatch(/^\d+ \(mends ×\d\.\d\d\)$/)
    expect(row(save, 'brawler', 'Orb', 14)).toBeUndefined()
    expect(row(save, 'cleric', 'Mends', 14)).toBeUndefined()
    expect(rows(save, 'brawler')).toEqual(rows(save, 'brawler', 16))
    expect(rows(save, 'cleric')).toEqual(rows(save, 'cleric', 16))
  })
})
