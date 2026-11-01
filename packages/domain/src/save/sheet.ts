// Her battle sheet (combat-balance.md §6.0): every battle stat of her active class, for her profile. Apart from the
// battle rules so it ships with the Stable's lazy chunk, not the main bundle (H57). Engine v16 (H70): her MP row carries
// what she regains a round (SB18's base regen and any Spring's) and a ★ Flourish row her template's (UT6, UT14).
import {
  BATTLE_ENGINE_VERSION, BATTLE_HEAL_OFFENSE_SCALE, BATTLE_HEAL_SCALE,
  BATTLE_LIMIT_MAX, rpgV2,
} from '../rpg/battle/caps'
import type { RpgFlourish } from '../rpg/battle/types'
import { isRpgTome, rpgIsHealer, rpgWeaponKind, type RpgDamageKind, type RpgWeapon } from '../rpg/kinds'
import { projectRpgStats, rpgBaseMpRegen, rpgClassName, type RpgClass } from '../rpg/rules'
import { addPoints, applyPoints } from '../economy/bonus'
import { equippedAccessories, equippedMight, noAccessoryEffects } from '../economy/gear'
import { accessoryOffense, accessorySlotsParts, accessorySlotValue, signatureBonus, signatureWorn } from '../economy/accessories'
import { gradeMight, gradeOf, mightAt, type AccessorySlotState, type GearTier } from '../economy/grades'
import { classRankOf, WEAPON_LABEL } from '../economy/ranks'
import { mapPoints, moonTemplate } from '../economy/planet'
import { umaTemplate } from '../roster/template'
import { activeClass, classOf, umaFlourish, umaPointParts, umaProfile, umaWeaponMight, type BattleOutfit } from './battle'
import { gearV1, isGrades, starMapOf, umaPick, type OwnedUma } from './save'
import { accessoryEffect, accessoryLine, flourish, limitStart, mp, signature } from './sheet-words'

/** A Flourish in the profile wording list (D258). */
export function flourishShort(flourish: RpgFlourish): string {
  return flourishLineValue(flourish, true)
}
/** Kept for callers that only know whether a Flourish is active; the live sheet has the full template fact. */
export const flourishSheetLine = (flourish: RpgFlourish | null, classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): string =>
  (flourish ? flourishShort(flourish) : `Off · ${rpgClassName(classId, engine)}`)

const flourishLineValue = (value: RpgFlourish, on: boolean): string => flourish(value, on).replace('★ Flourish · ', '')

/** One line of her battle sheet: the total, for the six core stats what gear and Extra Stats add, and a short note after
 * them (v16's MP: "+13 a round"). `accessory` is the Pendants' or Charms' share of `gear`; the rest of it is armor (H139). */
export interface SheetRow { label: string; value: string; gear?: number; accessory?: number; extra?: number; star?: number; note?: string }
export interface SheetGroup { title: 'Offense' | 'Defense' | 'Sustain' | 'Other'; rows: SheetRow[] }
const KIND_NAME = (k: string) => k[0]!.toUpperCase() + k.slice(1)
const permille = (n: number) => `${Math.round(n) / 10}%`

/** One accessory slot's row in the battle sheet. */
export function accessorySheetLine(slot: AccessorySlotState | undefined, tier: GearTier): string {
  if (!slot || slot.grade < 1 || slot.family === null) return 'None'
  return accessoryLine(slot.family, accessoryEffect(slot.family, slot.grade, tier, slot.kind))
}
/** What makes up her ATK or M.ATK, every part as her sheet has it (H139). A Pendant or a Charm is a real stat, so it's inside
 * `total`, as `accessory`. */
export interface OffenseStat { label: 'ATK' | 'M.ATK'; total: number; base: number; armor: number; accessory: number; stars: number; moon: number }
/** One of her three weapons as it hits, the damage stack's step 1 (`battleDamage`): `base` is her ATK or M.ATK, `orb` her Orbs'
 * flat offense on its kind. */
export interface WeaponDamage { weapon: RpgWeapon; kind: RpgDamageKind; stat: 'ATK' | 'M.ATK'; total: number; base: number; might: number; orb: number; signature: number }
/** `stats`: the ones her weapons use, ATK first. `bosses`: her Insignias' percent on sub-bosses and bosses, 0 with none. */
export interface DamageSheet { weapons: WeaponDamage[]; stats: OffenseStat[]; bosses: number }

/** What each of her three weapons hits with before the skill and the foe (D275), for Details. Read off her battle sheet, so no
 * stat has a second formula; `damage-sheet.test.ts` proves the sum equal to a fight's. Null for a non-graded Uma, the older
 * engines' test shapes. */
export function umaDamageSheet(outfit: BattleOutfit, uma: OwnedUma, classId?: RpgClass, tier = 1,
  engine: number = BATTLE_ENGINE_VERSION): DamageSheet | null {
  if (!isGrades(uma.gear)) return null
  const grades = uma.gear
  const gearTier = tier as GearTier
  const active = classId ?? activeClass(outfit, uma, tier, engine)
  const rows = battleSheet(outfit, uma, active, tier, engine).find((group) => group.title === 'Offense')!.rows
  const statOf = (label: OffenseStat['label']): OffenseStat => {
    const row = rows.find((r) => r.label === label)!
    const total = Number(row.value), gear = row.gear ?? 0, extra = row.extra ?? 0, moon = row.star ?? 0, accessory = row.accessory ?? 0
    return { label, total, base: total - gear - extra, armor: gear - accessory, accessory, stars: extra - moon, moon }
  }
  const weapons = classOf(uma, active).weapons
  const might = gradeMight(grades, weapons, gearTier)
  const parts = accessorySlotsParts(grades.accessories, gearTier)
  const signature = signatureWorn(grades, umaTemplate(outfit, umaPick(uma), engine).family) ? signatureBonus(uma.level, gearTier, engine) : 0
  const damage = weapons.map((weapon): WeaponDamage => {
    const kind = rpgWeaponKind(weapon), stat = isRpgTome(weapon) ? 'M.ATK' : 'ATK'
    const base = statOf(stat).total, weaponMight = might[kind] ?? 0, orb = parts.flat[kind] ?? 0
    return { weapon, kind, stat, total: base + weaponMight + orb + signature, base, might: weaponMight, orb, signature }
  })
  const used = (['ATK', 'M.ATK'] as const).filter((label) => damage.some((row) => row.stat === label))
  return { weapons: damage, stats: used.map(statOf), bosses: (parts.insignia?.value ?? 0) / 10 }
}

/** Every battle stat she has with her active class in her tier, each always listed, 0 included (combat-balance.md §6.0).
 * Classes v2 (H57): her Orb's offense ("Fire Orb +34"), and a healer's mends from her ATK or M.ATK instead of Heal. */
export function umaBattleSheet(outfit: BattleOutfit, uma: OwnedUma, classId?: RpgClass, tier = 1,
  engine: number = BATTLE_ENGINE_VERSION): SheetGroup[] {
  return battleSheet(outfit, uma, classId ?? activeClass(outfit, uma, tier, engine), tier, engine)
}
function battleSheet(outfit: BattleOutfit, uma: OwnedUma, classId: RpgClass, tier: number, engine: number): SheetGroup[] {
  const v2 = rpgV2(engine)
  const base = projectRpgStats(umaProfile(outfit, uma, tier, classId), engine)
  const parts = umaPointParts(uma, classId, tier as 1 | 2 | 3, moonTemplate(outfit, umaPick(uma), engine))
  const boosted = applyPoints(base, addPoints(parts.extra, parts.gear))
  const geared = applyPoints(base, parts.gear).stats
  const core = (label: string, k: 'hp' | 'mp' | 'atk' | 'matk' | 'pdef' | 'mdef'): SheetRow =>
    ({ label, value: String(boosted.stats[k]), gear: geared[k] - base[k], extra: boosted.stats[k] - geared[k] })
  const weapons = classOf(uma, classId).weapons
  const mightText = isGrades(uma.gear)
    ? (() => { const averaged = umaWeaponMight(uma, classId, tier as 1 | 2 | 3); return [averaged.atk ? `Arms +${averaged.atk}` : '', averaged.matk ? `Tomes +${averaged.matk}` : ''].filter(Boolean).join(' · ') })()
    : (() => { const might = equippedMight(gearV1(uma).equipped, weapons); return weapons.filter((w) => might[rpgWeaponKind(w)]).map((w) => `${WEAPON_LABEL[w]} +${might[rpgWeaponKind(w)]}`).join(' · ') })()
  const a = isGrades(uma.gear) ? noAccessoryEffects() : equippedAccessories(gearV1(uma).equipped, engine)
  // Regen and the two shields are shares of her max HP (D141): the sheet shows both.
  const hp = boosted.stats.hp
  const ofHp = (permilleOfHp: number, suffix = '') => permilleOfHp ? `${Math.max(1, Math.round((hp * permilleOfHp) / 1000))}${suffix} (${permille(permilleOfHp)})` : `0${suffix}`
  // v2 (§3.3): Heal retires; a Paladin's mends grow from her ATK, a Cleric's from her M.ATK, and other classes have none.
  const by = classId === 'paladin' ? 'atk' : 'matk'
  const heal = v2 ? boosted.stats[by] : base.dexterity
  const times = `×${(1 + heal / (v2 ? BATTLE_HEAL_OFFENSE_SCALE : BATTLE_HEAL_SCALE)).toFixed(2)}`
  const mends: SheetRow[] = !v2 ? [{ label: 'Heal', value: `${heal} (mends ${times})` }]
    : rpgIsHealer(classId, engine) ? [{ label: 'Mends', value: `${times} (from ${by === 'atk' ? 'ATK' : 'M.ATK'})` }] : []
  // SB18, UT6: the MP she regains at each round's end, the base regen by her Class Rank and her Spring's; her Flourish.
  const regen = rpgBaseMpRegen(boosted.stats.mp, { classId, classRank: classRankOf(uma.ranks, classId) }, engine) + a.mpRegen
  if (isGrades(uma.gear)) {
    const grades = uma.gear
    const gearTier = tier as GearTier
    const template = moonTemplate(outfit, umaPick(uma), engine)
    const map = starMapOf(uma)
    const sharedPoints = mapPoints(map.open.filter((id) => !id.startsWith('template:')), classId, gearTier, undefined, weapons)
    const sharedStats = applyPoints(base, addPoints(parts.gear, sharedPoints))
    const offense = accessoryOffense(grades.accessories, gearTier)
    const coreV3 = (label: string, k: 'hp' | 'mp' | 'atk' | 'matk' | 'pdef' | 'mdef'): SheetRow => ({
      label, value: String(boosted.stats[k]), gear: geared[k] - base[k],
      extra: boosted.stats[k] - geared[k], star: boosted.stats[k] - sharedStats.stats[k],
      ...(k === 'atk' && offense.atk ? { accessory: offense.atk } : k === 'matk' && offense.matk ? { accessory: offense.matk } : {}),
    })
    const family = umaTemplate(outfit, umaPick(uma), engine).family
    const worn = signatureWorn(grades, family)
    const signatureValue = signatureBonus(uma.level, gearTier)
    const flourishValue = umaTemplate(outfit, umaPick(uma), engine).flourish
    const flourishOn = umaFlourish(outfit, uma, classId, umaPick(uma), engine) !== null
    const weaponRows: SheetRow[] = weapons.map((weapon) => ({
      label: 'Might', value: `${WEAPON_LABEL[weapon]} +${mightAt(gradeOf(grades, { kind: 'weapon', weapon }), gearTier)}`,
    }))
    return [
      { title: 'Offense', rows: [coreV3('ATK', 'atk'), coreV3('M.ATK', 'matk'), ...weaponRows,
        ...grades.accessories.map((slot, i) => ({ label: `Accessory ${i + 1}`, value: accessorySheetLine(slot, gearTier) })),
        { label: '★ Signature', value: signature(signatureValue, worn).replace('★ Signature · ', '') }] },
      { title: 'Defense', rows: [coreV3('DEF', 'pdef'), coreV3('M.DEF', 'mdef'), { label: 'Evasion', value: permille(boosted.evasion) }] },
      { title: 'Sustain', rows: [coreV3('HP', 'hp'), ...mends, { ...coreV3('MP', 'mp'), note: mp(boosted.stats.mp, regen).split(' · ')[1] },
        { label: '★ Flourish', value: flourishLineValue(flourishValue, flourishOn) }] },
      { title: 'Other', rows: [{ label: 'Limit start', value: limitStart(boosted.limitStart, BATTLE_LIMIT_MAX).replace('Limit start ', '') }] },
    ]
  }
  return [
    { title: 'Offense', rows: [core('ATK', 'atk'), core('M.ATK', 'matk'), { label: 'Might', value: mightText || 'None' }, { label: v2 ? 'Orb' : 'Orbs',
      value: (v2 ? Object.entries(a.orbMight ?? {}).map(([k, n]) => `${KIND_NAME(k)} Orb +${n}`) : a.orbs.map(KIND_NAME)).join(', ') || 'None' }] },
    { title: 'Defense', rows: [core('DEF', 'pdef'), core('M.DEF', 'mdef'), { label: 'Evasion', value: permille(boosted.evasion) },
      { label: 'Physical damage cut', value: permille(a.guard) }, { label: 'Magical damage cut', value: permille(a.resist) },
      { label: 'Bulwark (physical) at the start', value: ofHp(a.barrier) }, { label: 'Veil (magical) at the start', value: ofHp(a.veil) },
      { label: 'Thorns', value: permille(a.thorns) }, { label: 'Mirror', value: permille(a.mirror) }] },
    { title: 'Sustain', rows: [core('HP', 'hp'), ...mends,
      { label: 'HP Regen', value: ofHp(a.regen, ' a round') }, { label: 'Lifesteal', value: permille(a.lifesteal) },
      { ...core('MP', 'mp'), note: mp(boosted.stats.mp, regen).split(' · ')[1] }, { label: 'MP Steal', value: permille(a.mpSteal) },
      { label: '★ Flourish', value: flourishLineValue(umaTemplate(outfit, umaPick(uma), engine).flourish, umaFlourish(outfit, uma, classId, umaPick(uma), engine) !== null) }] },
    { title: 'Other', rows: [{ label: 'Limit start', value: limitStart(boosted.limitStart, BATTLE_LIMIT_MAX).replace('Limit start ', '') }] },
  ]
}
