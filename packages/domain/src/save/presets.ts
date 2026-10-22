// A standard equipment preset per class (H33, classes v2 §7, C6, D164): the class's default weapon spread, its armor
// half in all five slots, an Orb in accessory 1 and a support accessory in accessory 2. Applying it wears what she can:
// on each type's track, her best own piece her rank allows, or the stock's next grades her ranks allow, bound in order
// (D119) as tapping a sheet grade by grade does, else the Training piece. It never binds a grade above her rank, armor of
// the other half, other accessory types or weapons outside the spread. Pure, like the rest of the save rules.
import { ACCESSORY_SLOTS, ARMOR_SLOTS, armorKindFor, type AccessorySlot, type ArmorKind, type ArmorSlot } from '../economy/ranks'
import { gearId, gearIdentity, gearLevel, type AmuletType, type EquipType, type GearSlot, type OrbType, type TalismanType } from '../economy/gear-id'
import { RPG_CLASS_ARMOR, RPG_CLASSES, rpgDefaultWeapons, type RpgClass, type RpgWeapon } from '../rpg/rules'
import { classOf } from './battle'
import { ownGear } from './forge'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { slotKind, type OwnedUma, type Save, type TierWorld } from './save'

/**
 * Each class's suggested accessories. The Orb (accessory 1) adds a kind her default spread lacks: the shape partner
 * (`RPG_KIND_PAIRS`) of her first weapon whose partner she doesn't wield, since today an Orb only adds its kind for
 * weaknesses. The support (accessory 2) is the first of the balance simulation's kit, so the preset is what the game is
 * tuned with. `Record<RpgClass, …>` makes v2's Paladin a compile error until her row is added.
 */
export const CLASS_PRESET_ACCESSORIES: Readonly<Record<RpgClass, { orb: OrbType; support: TalismanType | AmuletType }>> = {
  brawler: { orb: 'orb-fire', support: 'talisman-vampire' },
  mage: { orb: 'orb-greatsword', support: 'amulet-siphon' },
  spellblade: { orb: 'orb-dark', support: 'talisman-vampire' },
  cleric: { orb: 'orb-ice', support: 'amulet-spring' },
  summoner: { orb: 'orb-axe', support: 'amulet-spring' },
  // Classes v2's Paladin (D179), on the rule above until H57 sets v2's; no list shows her before the switch.
  paladin: { orb: 'orb-lightning', support: 'talisman-thorn' },
}

/** A class's standard preset: weapons from `rpgDefaultWeapons`, armor from `RPG_CLASS_ARMOR`, accessories from the table. */
export interface ClassPreset {
  classId: RpgClass
  weapons: RpgWeapon[]
  armor: 'physical' | 'magical'
  orb: OrbType
  support: TalismanType | AmuletType
}
export function classPreset(classId: RpgClass): ClassPreset {
  return { classId, weapons: rpgDefaultWeapons(classId), armor: RPG_CLASS_ARMOR[classId], ...CLASS_PRESET_ACCESSORIES[classId] }
}

/** What applying a preset does to her. */
export interface PresetPlan {
  classId: RpgClass
  /** The class's five weapons after it. */
  weapons: RpgWeapon[]
  /** All five armor slots' kinds after it. */
  kinds: Record<ArmorSlot, ArmorKind>
  /** The piece each preset slot ends on: null is a Training piece, or an emptied accessory slot. An accessory slot kept
   * as it is is left out. */
  wear: Partial<Record<GearSlot, string | null>>
  /** Stock pieces bound on the way, lowest grade first per track. */
  binds: string[]
  /** Slots that end differently: weapon positions, weapon pieces, an armor slot's kind or piece, accessory slots. */
  changes: number
}

/** On one type's track: the piece she'd wear, her best own piece her rank allows or the top of the climb, and the stock
 * pieces bound on the way. The climb binds each next grade above her best bound one while it's in stock and her rank
 * allows it (D119). */
function bestReachable(uma: OwnedUma, stock: Readonly<Record<string, number>>, type: EquipType): { id: string | null; binds: string[] } {
  const rank = gearLevel(uma.ranks, type)
  let top = 0
  let best: { id: string; grade: number } | null = null
  for (const id of ownGear(uma)) {
    const piece = gearIdentity(id)
    if (piece?.type !== type) continue
    top = Math.max(top, piece.grade)
    if (piece.grade <= rank && (!best || piece.grade > best.grade)) best = { id, grade: piece.grade }
  }
  const binds: string[] = []
  for (let g = top + 1; g <= rank && (stock[gearId(type, g)] ?? 0) > 0; g++) binds.push(gearId(type, g))
  return { id: binds[binds.length - 1] ?? best?.id ?? null, binds }
}

/** What her class's standard preset would do to her (pure). Throws `not-owned` or `bad-class`. */
export function classPresetPlan(world: TierWorld, outfitId: string, classId: RpgClass): PresetPlan {
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'not unlocked')
  if (!RPG_CLASSES.includes(classId)) throw new SaveRuleError('bad-class', `no class ${classId}`)
  const preset = classPreset(classId)
  const worn = (slot: GearSlot): string | null => uma.gear.equipped[slot] ?? null
  const binds: string[] = []
  const take = (type: EquipType): string | null => {
    const r = bestReachable(uma, world.gear, type)
    binds.push(...r.binds)
    return r.id
  }
  const wear: Partial<Record<GearSlot, string | null>> = {}
  const current = classOf(uma, classId).weapons
  let changes = preset.weapons.filter((w, i) => current[i] !== w).length
  for (const w of preset.weapons) {
    wear[w] = take(w)
    if (wear[w] !== worn(w)) changes++
  }
  const kinds = {} as Record<ArmorSlot, ArmorKind>
  for (const slot of ARMOR_SLOTS) {
    kinds[slot] = armorKindFor(slot, preset.armor)
    wear[slot] = take(kinds[slot])
    if (kinds[slot] !== slotKind(uma.gear, slot) || wear[slot] !== worn(slot)) changes++
  }
  // The Orb in accessory 1, the support in accessory 2: v2's damage and support slots (C10). A slot with nothing of its
  // type keeps what it holds, unless the other slot now takes that type.
  const picks: Record<AccessorySlot, string | null> = { 'accessory-1': take(preset.orb), 'accessory-2': take(preset.support) }
  const typeOf = (id: string | null) => (id ? gearIdentity(id)?.type : undefined)
  for (const slot of ACCESSORY_SLOTS) {
    const other = ACCESSORY_SLOTS.find((s) => s !== slot)!
    const here = worn(slot)
    const end = picks[slot] ?? (here && typeOf(here) === typeOf(picks[other]) ? null : undefined)
    if (end === undefined) continue
    wear[slot] = end
    if (end !== here) changes++
  }
  return { classId, weapons: preset.weapons, kinds, wear, binds, changes }
}

/** Her world with the preset applied: the class's weapons (only when they change), bound pieces from the stock into her
 * locker, what she wears and all five armor kinds. The same world when nothing would change. */
export function applyClassPreset(world: TierWorld, outfitId: string, classId: RpgClass): TierWorld {
  const plan = classPresetPlan(world, outfitId, classId)
  if (plan.changes === 0) return world
  const uma = world.umas[outfitId]!
  let gear = world.gear
  if (plan.binds.length) {
    gear = { ...gear }
    for (const id of plan.binds) {
      gear[id] = gear[id]! - 1
      if (gear[id] === 0) delete gear[id]
    }
  }
  const equipped = { ...uma.gear.equipped }
  for (const [slot, id] of Object.entries(plan.wear) as [GearSlot, string | null][]) {
    if (id === null) delete equipped[slot]
    else equipped[slot] = id
  }
  const setup = classOf(uma, classId)
  const classes = setup.weapons.every((w, i) => w === plan.weapons[i]) ? uma.classes : { ...uma.classes, [classId]: { ...setup, weapons: [...plan.weapons] } }
  const locker = plan.binds.length ? [...uma.gear.locker, ...plan.binds] : uma.gear.locker
  return { ...world, gear, umas: { ...world.umas, [outfitId]: { ...uma, classes, gear: { locker, equipped, kinds: { ...plan.kinds } } } } }
}

/** Puts on her class's standard preset; the same save when nothing would change. */
export function wearClassPreset(save: Save, outfitId: string, classId: RpgClass, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const next = applyClassPreset(world, outfitId, classId)
  if (next === world) return save
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: next } }
}
