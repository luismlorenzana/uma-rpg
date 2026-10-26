// Her battle sheet (combat-balance.md §6.0): every battle stat of her active class, for her profile. Apart from the
// battle rules so it ships with the Stable's lazy chunk, not the main bundle (H57). Engine v16 (H70): her MP row carries
// what she regains a round (SB18's base regen and any Spring's) and a ★ Flourish row her template's (UT6, UT14).
import {
  BATTLE_ENGINE_VERSION, BATTLE_FLOURISH_FROM, BATTLE_FLOURISH_RATE, BATTLE_FLOURISH_SHARE, BATTLE_HEAL_OFFENSE_SCALE, BATTLE_HEAL_SCALE,
  BATTLE_LIMIT_MAX, rpgV2,
} from '../rpg/battle/caps'
import type { RpgFlourish } from '../rpg/battle/types'
import { rpgIsHealer, rpgWeaponKind } from '../rpg/kinds'
import { projectRpgStats, rpgBaseMpRegen, type RpgClass } from '../rpg/rules'
import { addPoints, applyPoints } from '../economy/bonus'
import { equippedAccessories, equippedMight, noAccessoryEffects } from '../economy/gear'
import { accessoryFlatValue, accessoryParts, signatureBonus, signatureWorn } from '../economy/accessories'
import { gradeOf, mightAt, type AccessorySlotState, type GearTier } from '../economy/grades'
import { classRankOf, WEAPON_LABEL } from '../economy/ranks'
import { mapPoints, moonTemplate } from '../economy/planet'
import { umaTemplate } from '../roster/template'
import { activeClass, classOf, umaFlourish, umaPointParts, umaProfile, umaWeaponMight, type BattleOutfit } from './battle'
import { gearV1, isGrades, starMapOf, type OwnedUma } from './save'

/** The classes' names on the sheet ("No effect as Brawler"). */
const CLASS_NAME: Readonly<Record<RpgClass, string>> = {
  brawler: 'Brawler', mage: 'Mage', spellblade: 'Spell Blade', summoner: 'Summoner', paladin: 'Paladin', cleric: 'Cleric',
}
const pct = (share: number) => `${Math.round(share * 1000) / 10}%`
/** A Flourish in a few words (UT6), from the engine's own numbers: "Even pace · 1% a round, up to 4%". */
export function flourishShort(flourish: RpgFlourish): string {
  const most = pct(BATTLE_FLOURISH_SHARE)
  if (flourish === 'clean-break') return `Clean break · a Barrier of ${most} at the start`
  if (flourish === 'even-pace') return `Even pace · ${pct(BATTLE_FLOURISH_RATE['even-pace'])} a round, up to ${most}`
  return `Late reserve · from round ${BATTLE_FLOURISH_FROM}, ${pct(BATTLE_FLOURISH_RATE['late-reserve'])} a round, up to ${most}`
}
/** The sheet's ★ Flourish row: hers as she fights now, or "No effect as Brawler" outside her calling's class. */
export const flourishSheetLine = (flourish: RpgFlourish | null, classId: RpgClass): string =>
  (flourish ? flourishShort(flourish) : `No effect as ${CLASS_NAME[classId]}`)

/** One line of her battle sheet: the total, for the six core stats what gear and Extra Stats add, and a short note after
 * them (v16's MP: "+13 a round"). */
export interface SheetRow { label: string; value: string; gear?: number; extra?: number; star?: number; note?: string }
export interface SheetGroup { title: 'Offense' | 'Defense' | 'Sustain' | 'Other'; rows: SheetRow[] }
const KIND_NAME = (k: string) => k[0]!.toUpperCase() + k.slice(1)
const permille = (n: number) => `${Math.round(n) / 10}%`

/** R2's accessory row in the battle sheet. */
export function accessorySheetLine(slot: AccessorySlotState | undefined, weapons: readonly import('../rpg/kinds').RpgWeapon[], tier: GearTier): string {
  if (!slot || slot.grade < 1 || slot.family === null) return 'None'
  const label = slot.kind ? KIND_NAME(slot.kind) : ''
  if (slot.family === 'pendant') return `Pendant: +${accessoryFlatValue('pendant', slot.grade, tier)} on her three kinds`
  if (slot.family === 'orb') return `Orb: ${label} +${accessoryFlatValue('orb', slot.grade, tier)}`
  if (slot.family === 'bell') {
    const bell = accessoryParts(slot, weapons, tier).bell
    return bell ? `Bell: ${label} ${(bell.power / 1000).toFixed(1)} after her Attack` : `Bell: No ${label} in her slots`
  }
  return `Insignia: +${permille(15 * slot.grade)} on sub-bosses and bosses`
}
/** Every battle stat she has with her active class in her tier, each always listed, 0 included (combat-balance.md §6.0).
 * Classes v2 (H57): her Orb's offense ("Fire Orb +34"), and a healer's mends from her ATK or M.ATK instead of Heal. */
export function umaBattleSheet(outfit: BattleOutfit, uma: OwnedUma, classId: RpgClass = activeClass(outfit, uma), tier = 1,
  engine: number = BATTLE_ENGINE_VERSION): SheetGroup[] {
  const v2 = rpgV2(engine)
  const base = projectRpgStats(umaProfile(outfit, uma, tier, classId), engine)
  const parts = umaPointParts(uma, classId, tier as 1 | 2 | 3, moonTemplate(outfit, uma.calling.pick))
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
  const regen = rpgBaseMpRegen(boosted.stats.mp, classRankOf(uma.ranks, classId), engine) + a.mpRegen
  if (isGrades(uma.gear)) {
    const grades = uma.gear
    const gearTier = tier as GearTier
    const template = moonTemplate(outfit, uma.calling.pick)
    const map = starMapOf(uma)
    const sharedPoints = mapPoints(map.open.filter((id) => !id.startsWith('template:')), classId, gearTier)
    const sharedStats = applyPoints(base, addPoints(parts.gear, sharedPoints))
    const coreV3 = (label: string, k: 'hp' | 'mp' | 'atk' | 'matk' | 'pdef' | 'mdef'): SheetRow => ({
      label, value: String(boosted.stats[k]), gear: geared[k] - base[k],
      extra: boosted.stats[k] - geared[k], star: boosted.stats[k] - sharedStats.stats[k],
    })
    const slot = grades.accessories[0]
    const family = umaTemplate(outfit, uma.calling.pick).family
    const signature = signatureWorn(grades, family) ? signatureBonus(uma.level, gearTier) : 0
    const weaponRows: SheetRow[] = weapons.map((weapon) => ({
      label: 'Might', value: `${WEAPON_LABEL[weapon]} +${mightAt(gradeOf(grades, { kind: 'weapon', weapon }), gearTier)}`,
    }))
    return [
      { title: 'Offense', rows: [coreV3('ATK', 'atk'), coreV3('M.ATK', 'matk'), ...weaponRows,
        { label: 'Accessory', value: accessorySheetLine(slot, weapons, gearTier) },
        ...(signature ? [{ label: 'Signature', value: `+${signature} ★` }] : [])] },
      { title: 'Defense', rows: [coreV3('DEF', 'pdef'), coreV3('M.DEF', 'mdef'), { label: 'Evasion', value: permille(boosted.evasion) }] },
      { title: 'Sustain', rows: [coreV3('HP', 'hp'), ...mends, { ...coreV3('MP', 'mp'), note: `+${regen} a round` },
        { label: '★ Flourish', value: flourishSheetLine(umaFlourish(outfit, uma, classId), classId) }] },
      { title: 'Other', rows: [{ label: 'Limit Break head start', value: `${boosted.limitStart} / ${BATTLE_LIMIT_MAX}` }] },
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
      { ...core('MP', 'mp'), note: `+${regen} a round` }, { label: 'MP Steal', value: permille(a.mpSteal) },
      { label: '★ Flourish', value: flourishSheetLine(umaFlourish(outfit, uma, classId), classId) }] },
    { title: 'Other', rows: [{ label: 'Limit Break head start', value: `${boosted.limitStart} / ${BATTLE_LIMIT_MAX}` }] },
  ]
}
