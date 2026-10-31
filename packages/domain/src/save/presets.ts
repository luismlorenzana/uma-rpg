// A standard equipment preset per class (H33, classes v2 §7, C6, D164): the class's default weapon spread, its armor
// half in all five slots, an Orb in accessory 1 and a support accessory in accessory 2. Applying it wears what she can:
// on each type's track, her best own piece her rank allows, or the stock's next grades her ranks allow, bound in order
// (D119) as tapping a sheet grade by grade does, else the Training piece. It never binds a grade above her rank, armor of
// the other half, other accessory types or weapons outside the spread. Pure, like the rest of the save rules.
// R2 (H75; WP25, UT8, SB10): a graded Uma's preset is her class's three weapons and her accessory slot's form (its family
// and kind), her grades untouched and nothing bound (`classPresetV3`, `presetAccessory`).
// D263: the owner's weapon presets, one for each Tier 1 class (`weaponPreset`). A Tier 0 picks one of its children's, so a
// Healer can start gearing as a Paladin or as a Cleric. `classPresetV3` stays what the sims wear.
import { ACCESSORY_SLOTS, ARMOR_SLOTS, armorKindFor, type AccessorySlot, type ArmorKind, type ArmorSlot } from '../economy/ranks'
import { gearId, gearIdentity, gearLevel, type AmuletType, type EquipType, type GearSlot, type OrbType, type TalismanType } from '../economy/gear-id'
import type { AccessoryFamily, AccessorySlotState, UmaGrades } from '../economy/grades'
import { BATTLE_ENGINE_VERSION, rpgRework, rpgV2 } from '../rpg/battle/caps'
import {
  isRpgTome, RPG_CLASS_ARMOR, RPG_TIER0_MODEL, rpgClasses, rpgDefaultWeapons, rpgHand, rpgIsTier0, rpgPresetClasses, rpgPresetWeapons, rpgTwinKind,
  rpgWeaponKind, type RpgClass, type RpgDamageKind, type RpgTier1Class, type RpgWeapon,
} from '../rpg/rules'
import { classOf, withClassWeapons } from './battle'
import { ownGear } from './forge'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { gearStock, gearV1, isGrades, slotKind, type OwnedUma, type Save, type TierWorld } from './save'

/**
 * Each class's suggested accessories in classes v1. The Orb (accessory 1) adds a kind her default spread lacks: the shape
 * partner (`RPG_KIND_PAIRS`) of her first weapon whose partner she doesn't wield, since a v1 Orb only adds its kind for
 * weaknesses. The support (accessory 2) is the first of the balance simulation's kit, so the preset is what the game is
 * tuned with.
 */
export const CLASS_PRESET_ACCESSORIES: Readonly<Record<RpgClass, { orb: OrbType; support: TalismanType | AmuletType }>> = {
  brawler: { orb: 'orb-fire', support: 'talisman-vampire' },
  mage: { orb: 'orb-greatsword', support: 'amulet-siphon' },
  spellblade: { orb: 'orb-dark', support: 'talisman-vampire' },
  cleric: { orb: 'orb-ice', support: 'amulet-spring' },
  summoner: { orb: 'orb-axe', support: 'amulet-spring' },
  // Classes v2's Paladin (D179), on the rule above for the type; no v1 list shows her.
  paladin: { orb: 'orb-lightning', support: 'talisman-thorn' },
  // Classes v3's seven (H126), no v1 list shows them: each her model's or mirror's row.
  recruit: { orb: 'orb-fire', support: 'talisman-vampire' },
  duelist: { orb: 'orb-dark', support: 'talisman-vampire' },
  acolyte: { orb: 'orb-ice', support: 'amulet-spring' },
  caller: { orb: 'orb-axe', support: 'amulet-spring' },
  apprentice: { orb: 'orb-greatsword', support: 'amulet-siphon' },
  armsummoner: { orb: 'orb-dark', support: 'talisman-vampire' },
  tomeblade: { orb: 'orb-axe', support: 'amulet-spring' },
}
/**
 * Classes v2's preset accessories (C6, H57). The Orb, for the Damage slot, is her default spread's first weapon's kind: a
 * flat Orb strengthens her leading damage. The support, for the Support slot, is the first of the balance simulation's
 * v2 kit, picked by §6.3's roles: Vampire for Brawler and Spell Blade, Siphon for Mage and Summoner, Thorn for the guarding
 * Paladin, Spring for the Cleric's casts. That is v1's support but the Summoner's, so this lists only where v2 differs;
 * H60 adds a row here when it changes a kit's support.
 */
export const CLASS_PRESET_SUPPORT_V2: Readonly<Partial<Record<RpgClass, TalismanType | AmuletType>>> = { summoner: 'amulet-siphon' }

/** A class's standard preset: weapons from `rpgDefaultWeapons`, armor from `RPG_CLASS_ARMOR`, accessories from the table. */
export interface ClassPreset {
  classId: RpgClass
  weapons: RpgWeapon[]
  armor: 'physical' | 'magical'
  orb: OrbType
  support: TalismanType | AmuletType
}
/** A class's standard preset in an engine's generation (v2: H57). */
export function classPreset(classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): ClassPreset {
  const weapons = rpgDefaultWeapons(classId, engine)
  const v1 = CLASS_PRESET_ACCESSORIES[classId]
  return { classId, weapons, armor: RPG_CLASS_ARMOR[classId], ...(rpgV2(engine)
    ? { orb: `orb-${rpgWeaponKind(weapons[0]!)}`, support: CLASS_PRESET_SUPPORT_V2[classId] ?? v1.support } : v1) }
}

// --- R2's presets (H75; weapon-progression §5.8, WP25; uma-templates §3.4, UT8; stat-balance SB10) ------------------

/** A preset's accessory form: a family's base form, and an Orb's or a Bell's kind. */
export interface PresetAccessory { family: AccessoryFamily; kind?: RpgDamageKind }
/** WP25's Tier 1 forms (branch 1), every tier in R2, after SB10: a hybrid's single-kind form on her lead half (the
 * Summoner's Orb on her Light, the twin of her Bow); the Cleric's Orb on her Blizzard Tome. The balance party wears these. */
export const CLASS_PRESET_ACCESSORY_V3: Readonly<Record<RpgClass, PresetAccessory>> = {
  brawler: { family: 'bell', kind: 'greatsword' },
  mage: { family: 'pendant' },
  spellblade: { family: 'pendant' },
  summoner: { family: 'orb', kind: 'light' },
  paladin: { family: 'pendant' },
  cleric: { family: 'orb', kind: 'ice' },
  // Classes v3's seven (§3.8, H126), their v19 rows: a Tier 0 her model's form, the new hybrids by the same rule.
  recruit: { family: 'bell', kind: 'greatsword' },
  duelist: { family: 'pendant' },
  acolyte: { family: 'orb', kind: 'ice' },
  caller: { family: 'orb', kind: 'ice' },
  apprentice: { family: 'pendant' },
  armsummoner: { family: 'orb', kind: 'bow' },
  tomeblade: { family: 'pendant' },
}
/** Classes v3's forms (§3.8, CV16): v18's, the Tome Summoner's Orb on her Blizzard Tome (the twin of her Axe; was Light). */
const CLASS_PRESET_ACCESSORY_V19: Readonly<Record<RpgClass, PresetAccessory>> = { ...CLASS_PRESET_ACCESSORY_V3, summoner: { family: 'orb', kind: 'ice' } }
/** A class's preset accessory form in an engine's generation (WP25; from v19 Classes v3's, H126). */
export const classPresetAccessory = (classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): PresetAccessory =>
  ({ ...(rpgRework('classes', engine) ? CLASS_PRESET_ACCESSORY_V19 : CLASS_PRESET_ACCESSORY_V3)[classId] })
/** R2's standard preset (WP25): her class's three default weapons, its armor half (grades sit on slots, so no pieces) and
 * its accessory form. */
export interface ClassPresetV3 { classId: RpgClass; weapons: RpgWeapon[]; armor: 'physical' | 'magical'; accessory: PresetAccessory }
/** A class's R2 standard preset, WP25's row; `presetAccessory` dresses it in an Uma's signature family. */
export function classPresetV3(classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): ClassPresetV3 {
  return { classId, weapons: rpgDefaultWeapons(classId, engine), armor: RPG_CLASS_ARMOR[classId], accessory: classPresetAccessory(classId, engine) }
}

/** Where a single-kind form (an Orb, a Bell) she is given sits (UT8 with the main session's ruling, SB10): a hybrid's on
 * her lead half (her hand's `lead`, H126), on the kind that twins her lone weapon in the engine's pairs (the Spell Blade's
 * Lance for her Thunder Tome, the Summoner's Light for her Bow; from v19, CV13, the Tome Summoner's Blizzard for her Axe,
 * the Tome Spellblade's Light for her Katana, the Arms Summoner's Bow for her Dark; her lead half's first when none does);
 * anyone else's on her lead kind, her first slot's. A Tier 0 (v19) by the child she models (`RPG_TIER0_MODEL`). */
export function presetKind(classId: RpgClass, weapons: readonly RpgWeapon[], engine: number = BATTLE_ENGINE_VERSION): RpgDamageKind {
  const model = rpgRework('classes', engine) && rpgIsTier0(classId) ? RPG_TIER0_MODEL[classId] : classId
  const hand = rpgHand({ classId: model }, engine)
  const first = rpgWeaponKind(weapons[0]!)
  if (!hand.pair) return first
  const tomeLeads = hand.lead === 'tome'
  const lead = weapons.filter((w) => isRpgTome(w) === tomeLeads).map(rpgWeaponKind)
  const lone = weapons.find((w) => isRpgTome(w) !== tomeLeads)
  const twin = lone ? rpgTwinKind(rpgWeaponKind(lone), engine) : undefined
  return twin && lead.includes(twin) ? twin : lead[0] ?? first
}

/**
 * Her preset's accessory form (UT8, the main session's ruling 2026-10-25: UT8 picks the family, SB10 picks the kind):
 * WP25's form when she has no template (the balance party) or her class's form is already her signature family;
 * otherwise her family's base form in the slot, an Orb or a Bell on `presetKind`'s kind, a Pendant or an Insignia with
 * none. `weapons` are the preset's (her class's three).
 */
export function presetAccessory(classId: RpgClass, weapons: readonly RpgWeapon[], family?: AccessoryFamily | null,
  engine: number = BATTLE_ENGINE_VERSION): PresetAccessory {
  const row = classPresetAccessory(classId, engine)
  if (!family || family === row.family) return row
  return family === 'orb' || family === 'bell' ? { family, kind: presetKind(classId, weapons, engine) } : { family }
}

/** Whether her weapons can use a family: a Pendant needs an Arm, a Charm (id `bell`) a Tome. */
const familyUsable = (family: AccessoryFamily, weapons: readonly RpgWeapon[]): boolean =>
  (family === 'pendant' ? weapons.some((w) => !isRpgTome(w)) : family === 'bell' ? weapons.some(isRpgTome) : true)
/** A weapon preset: a class's weapons and armor half, and one accessory form a slot. */
export interface WeaponPreset { classId: RpgClass; weapons: RpgWeapon[]; armor: 'physical' | 'magical'; accessories: PresetAccessory[] }
/** A Tier 1 class's weapon preset (D263, D266): its three weapons, its armor half and her three accessory forms: her armor
 * half's stat twice (a Pendant for ATK, a Charm for M.ATK) and an Orb on `presetKind`'s kind of those weapons (the Tome
 * Summoner's on Dark, the twin of her Bow; the Cleric's on Light, her first slot). Her ★ `family` goes first, in the place of
 * one of its own or else of slot 1, unless her weapons can't use it: the ★ is worth half a slot of her stat. */
export function weaponPreset(classId: RpgTier1Class, family?: AccessoryFamily | null, engine: number = BATTLE_ENGINE_VERSION): WeaponPreset {
  const weapons = rpgPresetWeapons(classId, engine)
  const stat: AccessoryFamily = RPG_CLASS_ARMOR[classId] === 'physical' ? 'pendant' : 'bell'
  const slots: AccessoryFamily[] = [stat, stat, 'orb']
  if (family && familyUsable(family, weapons)) { slots.splice(Math.max(0, slots.indexOf(family)), 1); slots.unshift(family) }
  const accessories = slots.map((f): PresetAccessory => (f === 'orb' ? { family: f, kind: presetKind(classId, weapons, engine) } : { family: f }))
  return { classId, weapons, armor: RPG_CLASS_ARMOR[classId], accessories }
}

/** The preset `classId` wears: from `presets` the picked Tier 1 class's (D263; one of `rpgPresetClasses`, by default her own,
 * or a Tier 0's model child), before them her class's row in her family. */
function presetFor(classId: RpgClass, family: AccessoryFamily | null | undefined, engine: number, pick?: RpgTier1Class): WeaponPreset {
  if (!rpgRework('presets', engine)) {
    const preset = classPresetV3(classId, engine)
    return { ...preset, accessories: [presetAccessory(classId, preset.weapons, family, engine)] }
  }
  const to = pick ?? (rpgIsTier0(classId) ? RPG_TIER0_MODEL[classId] : classId)
  if (!rpgPresetClasses(classId).includes(to)) throw new SaveRuleError('bad-class', `no ${to} preset for ${classId}`)
  return weaponPreset(to, family, engine)
}

/** What applying a preset does to her. */
export interface PresetPlan {
  classId: RpgClass
  /** The class's five weapons after it (three from v16). */
  weapons: RpgWeapon[]
  /** All five armor slots' kinds after it; for a graded Uma her class's half, which her grades follow (R2). */
  kinds: Record<ArmorSlot, ArmorKind>
  /** The piece each preset slot ends on: null is a Training piece, or an emptied accessory slot. An accessory slot kept
   * as it is is left out. Empty for a graded Uma (R2: grades, not pieces). */
  wear: Partial<Record<GearSlot, string | null>>
  /** Stock pieces bound on the way, lowest grade first per track. Empty for a graded Uma: nothing binds. */
  binds: string[]
  /** Slots that end differently: weapon positions, weapon pieces, an armor slot's kind or piece, accessory slots. For a
   * graded Uma: weapon positions and her accessory slot's family or kind. */
  changes: number
  /** R2 (H75): a graded Uma's first accessory slot's form after it. */
  accessory?: PresetAccessory
  /** D264: each accessory slot's form after it. */
  accessories?: PresetAccessory[]
}

/** R2 (H75): the plan for a graded Uma: the preset's three weapons (counted by position, as v1's) and her accessory slot's
 * form; her grades untouched, nothing bound. */
function classPresetPlanV3(uma: OwnedUma, grades: UmaGrades, classId: RpgClass, engine: number, family?: AccessoryFamily | null,
  pick?: RpgTier1Class): PresetPlan {
  const preset = presetFor(classId, family, engine, pick)
  const { accessories } = preset
  const current = classOf(uma, classId).weapons
  const kinds = Object.fromEntries(ARMOR_SLOTS.map((s) => [s, armorKindFor(s, preset.armor)])) as Record<ArmorSlot, ArmorKind>
  const changes = preset.weapons.filter((w, i) => current[i] !== w).length + accessories.filter((form, i) => {
    const slot = grades.accessories[i]
    return slot?.family !== form.family || slot?.kind !== form.kind || slot?.form !== 'base'
  }).length
  return { classId, weapons: preset.weapons, kinds, wear: {}, binds: [], changes, accessory: accessories[0], accessories }
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

/** What her class's standard preset would do to her (pure), in an engine's generation. Throws `not-owned` or `bad-class`.
 * A graded Uma (R2, H75) takes R2's preset, its accessory in her signature `family` (her template's, from the caller); `pick`
 * is the Tier 1 class whose preset a Tier 0 wears (D263). */
export function classPresetPlan(world: TierWorld, outfitId: string, classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION,
  family?: AccessoryFamily | null, pick?: RpgTier1Class): PresetPlan {
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'not unlocked')
  if (!rpgClasses(engine).includes(classId)) throw new SaveRuleError('bad-class', `no class ${classId}`)
  if (isGrades(uma.gear)) return classPresetPlanV3(uma, uma.gear, classId, engine, family, pick)
  const preset = classPreset(classId, engine)
  const currentGear = gearV1(uma)
  const worn = (slot: GearSlot): string | null => currentGear.equipped[slot] ?? null
  const binds: string[] = []
  const take = (type: EquipType): string | null => {
    const r = bestReachable(uma, gearStock(world), type)
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
    if (kinds[slot] !== slotKind(currentGear, slot) || wear[slot] !== worn(slot)) changes++
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
 * locker, what she wears and all five armor kinds. The same world when nothing would change. A graded Uma (R2, H75): the
 * class's weapons and her accessory slot's form in her signature `family`; every grade stays where it was. */
export function applyClassPreset(world: TierWorld, outfitId: string, classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION,
  family?: AccessoryFamily | null, pick?: RpgTier1Class): TierWorld {
  const plan = classPresetPlan(world, outfitId, classId, engine, family, pick)
  if (plan.changes === 0) return world
  const uma = world.umas[outfitId]!
  if (isGrades(uma.gear) && plan.accessories) return applyPresetV3(world, outfitId, uma, uma.gear, plan.weapons, plan.accessories, classId)
  const currentGear = gearV1(uma)
  let gear = gearStock(world)
  if (plan.binds.length) {
    gear = { ...gear }
    for (const id of plan.binds) {
      gear[id] = gear[id]! - 1
      if (gear[id] === 0) delete gear[id]
    }
  }
  const equipped = { ...currentGear.equipped }
  for (const [slot, id] of Object.entries(plan.wear) as [GearSlot, string | null][]) {
    if (id === null) delete equipped[slot]
    else equipped[slot] = id
  }
  const setup = classOf(uma, classId)
  const classes = setup.weapons.every((w, i) => w === plan.weapons[i]) ? uma.classes : { ...uma.classes, [classId]: withClassWeapons(setup, plan.weapons) }
  const locker = plan.binds.length ? [...currentGear.locker, ...plan.binds] : currentGear.locker
  return { ...world, gear, umas: { ...world.umas, [outfitId]: { ...uma, classes, gear: { locker, equipped, kinds: { ...plan.kinds } } } } }
}

/** R2 (H75): a graded Uma with the preset: the class's weapons (only when they change) and each accessory slot's form, its
 * grade kept. */
function applyPresetV3(world: TierWorld, outfitId: string, uma: OwnedUma, grades: UmaGrades, weapons: RpgWeapon[], forms: readonly PresetAccessory[],
  classId: RpgClass): TierWorld {
  const setup = classOf(uma, classId)
  const classes = setup.weapons.every((w, i) => w === weapons[i]) ? uma.classes : { ...uma.classes, [classId]: withClassWeapons(setup, weapons) }
  const accessories = Array.from({ length: Math.max(grades.accessories.length, forms.length) }, (_, i): AccessorySlotState => {
    const form = forms[i]
    return form ? { grade: grades.accessories[i]?.grade ?? 0, family: form.family, form: 'base', ...(form.kind ? { kind: form.kind } : {}) } : grades.accessories[i]!
  })
  return { ...world, umas: { ...world.umas, [outfitId]: { ...uma, classes, gear: { ...grades, accessories } } } }
}

/** Puts on her class's standard preset; the same save when nothing would change. A graded Uma's in her signature `family`
 * (R2, H75: the web passes her template's), a Tier 0's the Tier 1 class she `pick`s (D263). */
export function wearClassPreset(save: Save, outfitId: string, classId: RpgClass, now: string, tier = TIER_ONE,
  engine: number = BATTLE_ENGINE_VERSION, family?: AccessoryFamily | null, pick?: RpgTier1Class): Save {
  const world = worldOf(save, tier)
  const next = applyClassPreset(world, outfitId, classId, engine, family, pick)
  if (next === world) return save
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: next } }
}
