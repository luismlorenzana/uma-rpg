// The Uma Template (docs/design/tier-rework/uma-templates.md, D197; H67, D203): three readings of an outfit's racing
// profile, her calling, stride and knack, by one pure rule over master data read by stable id. Never her name, her id, her
// surface or her skills (UT3). They name her template, "{knack word} {type}", one of 90 (UT5), and feed its pieces: her
// calling (her fight type and, from engine v16, her starting class; CP29), the Flourish (H68), and from R2 her signature
// family and her moon. The names are this game's own. Nothing here is stored (UT17): only her calling pick, `UmaCalling`,
// which the save holds from v27 (H69). In the main bundle (the start reads it), so it stays the rule and its tables.
import type { Aptitudes, AptitudeGrade, Stats, StatKey } from '@luismlorenzana/uma-data'
import type { RpgFlourish } from '../rpg/battle/types'
import type { RpgClass } from '../rpg/kinds'

/** Her strides, shortest first: Sprint or Mile a dash, Medium the middle, Long a stayer. */
export const UMA_STRIDES = ['dash', 'middle', 'stayer'] as const
/** Her stride: the longest distance at her best distance grade. */
export type UmaStride = typeof UMA_STRIDES[number]
/** Her knacks, in the catalog's order (uma-templates §2.4). */
export const UMA_KNACKS = ['fleet', 'mighty', 'tireless', 'gritty', 'clever'] as const
/** Her knack: her top growth rate's stat. */
export type UmaKnack = typeof UMA_KNACKS[number]
/** The four accessory families, in the weapons doc's order. */
export const UMA_FAMILIES = ['pendant', 'orb', 'bell', 'insignia'] as const
/** Her signature accessory's family, named by her knack (UT7); R2 builds the accessory. */
export type UmaFamily = typeof UMA_FAMILIES[number]
/** Her calling pick as the save holds it (CP29; H69's `OwnedUma.calling`): the class she picked, and whether it is final. */
export interface UmaCalling { pick: RpgClass | null; confirmed: boolean }
/** The calling rule's row, the first that fits (uma-templates §2.2): 1–4 fixed, 5–8 the pick's. */
export type UmaCallingRow = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
/** What her calling reads: her styles and distances, and her base Power and Wit at her starting stars. */
export interface CallingOutfit { aptitudes: Pick<Aptitudes, 'strategy' | 'distance'>; baseStats: Pick<Stats, 'power' | 'wit'> }
/** What her template reads from an outfit's master data (a `RosterOutfit` and a `BattleOutfit` fit). */
export interface TemplateOutfit { aptitudes: Pick<Aptitudes, 'strategy' | 'distance'>; baseStats: Stats; growthRatePercents: Stats }
/** The calling pick a Pace or Late Uma has (CP29): her row's two classes, the suggested one first, and the stats that
 * suggest it. */
export interface UmaCallingPick { options: [RpgClass, RpgClass]; suggested: RpgClass; power: number; wit: number }
/** Her template: the three readings, her type and knack word, her name, her Flourish, her family and her calling's row. */
export interface UmaTemplate {
  calling: RpgClass
  stride: UmaStride
  knack: UmaKnack
  type: string
  word: string
  name: string
  flourish: RpgFlourish
  family: UmaFamily
  row: UmaCallingRow
}
/** What the Stable's Template facets and search read (UT15; H70 wires them). */
export interface UmaTemplateFacets { calling: RpgClass; stride: UmaStride; knack: UmaKnack; name: string }

/** Her type by calling and stride: 18 words (UT5). */
export const UMA_TYPE_NAMES: Readonly<Record<RpgClass, Readonly<Record<UmaStride, string>>>> = {
  brawler: { dash: 'Charger', middle: 'Bruiser', stayer: 'Ironhide' },
  spellblade: { dash: 'Flashblade', middle: 'Spellfencer', stayer: 'Longblade' },
  mage: { dash: 'Flarecaster', middle: 'Spellwright', stayer: 'Starkeeper' },
  summoner: { dash: 'Beckoner', middle: 'Binder', stayer: 'Shepherd' },
  paladin: { dash: 'Shieldrunner', middle: 'Warden', stayer: 'Stalwart' },
  cleric: { dash: 'Lamplighter', middle: 'Mender', stayer: 'Pilgrim' },
}
/** Her knack's word, the first of her template's name (UT5). */
export const UMA_KNACK_WORDS: Readonly<Record<UmaKnack, string>> = { fleet: 'Fleet', mighty: 'Mighty', tireless: 'Tireless', gritty: 'Gritty', clever: 'Clever' }
/** The Flourish's names (UT6, UT16). */
export const FLOURISH_NAMES: Readonly<Record<RpgFlourish, string>> = { 'clean-break': 'Clean break', 'even-pace': 'Even pace', 'late-reserve': 'Late reserve' }
/** Her Flourish by stride (UT6): a dash's Barrier at the start, the middle's mend each round, a stayer's from round 3. */
export const STRIDE_FLOURISH: Readonly<Record<UmaStride, RpgFlourish>> = { dash: 'clean-break', middle: 'even-pace', stayer: 'late-reserve' }
/** Her signature family by knack (UT7). */
export const KNACK_FAMILY: Readonly<Record<UmaKnack, UmaFamily>> = { fleet: 'bell', mighty: 'orb', tireless: 'pendant', gritty: 'insignia', clever: 'insignia' }
/** A stride's label on the screens. */
export const STRIDE_LABEL: Readonly<Record<UmaStride, string>> = { dash: 'Dash', middle: 'Middle', stayer: 'Stayer' }
/** A knack's label on the screens: its word. */
export const KNACK_LABEL: Readonly<Record<UmaKnack, string>> = UMA_KNACK_WORDS
/** The stat a knack reads (her top growth rate) and her moon's node I raises (R2). */
export const KNACK_STAT: Readonly<Record<UmaKnack, StatKey>> = { fleet: 'speed', mighty: 'power', tireless: 'stamina', gritty: 'guts', clever: 'wit' }

/** What `umaCallingPickBlock` says. */
export const CALLING_NO_PICK = 'No pick for her'
export const CALLING_SET = 'Her calling is set'

// The rule's orders: styles tie Front, Pace, Late, End; distances run shortest first; growth ties go Speed, Stamina,
// Power, Guts, Wit (after the higher base stat); grades run best first.
const STYLES = ['front', 'pace', 'late', 'end'] as const
const DISTANCES = ['sprint', 'mile', 'medium', 'long'] as const
const STATS: readonly StatKey[] = ['speed', 'stamina', 'power', 'guts', 'wit']
const GRADES: readonly AptitudeGrade[] = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
const DISTANCE_STRIDE: Readonly<Record<typeof DISTANCES[number], UmaStride>> = { sprint: 'dash', mile: 'dash', medium: 'middle', long: 'stayer' }
const STAT_KNACK: Readonly<Record<StatKey, UmaKnack>> = { speed: 'fleet', stamina: 'tireless', power: 'mighty', guts: 'gritty', wit: 'clever' }
/** Each calling row's class (uma-templates §2.2): rows 1–4 fixed, 5–8 the pick's pre-selection. The manual prints them. */
export const UMA_ROW_CALLING: Readonly<Record<UmaCallingRow, RpgClass>> = {
  1: 'brawler', 2: 'summoner', 3: 'summoner', 4: 'brawler', 5: 'spellblade', 6: 'mage', 7: 'paladin', 8: 'cleric',
}
/** The calling pick's two classes by row (CP29), the pre-selection first. */
export const UMA_ROW_PICK: Readonly<Partial<Record<UmaCallingRow, readonly [RpgClass, RpgClass]>>> = {
  5: ['spellblade', 'mage'], 6: ['mage', 'spellblade'], 7: ['paladin', 'cleric'], 8: ['cleric', 'paladin'],
}

const grade = (g: AptitudeGrade): number => GRADES.indexOf(g)
/** The best key of a group in the rule's order: the first at the best grade. */
function bestKey<K extends string>(grades: Readonly<Record<K, AptitudeGrade>>, order: readonly K[]): K {
  return order.reduce((top, k) => (grade(grades[k]) < grade(grades[top]) ? k : top))
}
/** The keys at a group's best grade, in the rule's order. */
function atBest<K extends string>(grades: Readonly<Record<K, AptitudeGrade>>, order: readonly K[]): K[] {
  const top = grade(grades[bestKey(grades, order)])
  return order.filter((k) => grade(grades[k]) === top)
}

/** Her calling's row (uma-templates §2.2), the first that fits: 1 best style Front; 2 Wit ≥ Power and A (or S) in two of
 * Pace, Late, End; 3 best style End; 4 best style Pace, Power > Wit, the shortest distance at her best grade Sprint; 5–6
 * best style Pace, Power > Wit or not; 7–8 best style Late, Power > Wit or not. */
export function umaCallingRow(outfit: CallingOutfit): UmaCallingRow {
  const { strategy, distance } = outfit.aptitudes, { power, wit } = outfit.baseStats
  const style = bestKey(strategy, STYLES)
  if (style === 'front') return 1
  if (wit >= power && (['pace', 'late', 'end'] as const).filter((s) => grade(strategy[s]) <= grade('A')).length >= 2) return 2
  if (style === 'end') return 3
  if (style === 'pace') return power > wit ? (atBest(distance, DISTANCES)[0] === 'sprint' ? 4 : 5) : 6
  return power > wit ? 7 : 8
}

/** Her calling pick (CP29): null for rows 1–4; for rows 5–8 her row's two classes, the suggested one first. */
export function umaCallingPick(outfit: CallingOutfit): UmaCallingPick | null {
  const options = UMA_ROW_PICK[umaCallingRow(outfit)]
  return options ? { options: [options[0], options[1]], suggested: options[0], power: outfit.baseStats.power, wit: outfit.baseStats.wit } : null
}

/** Her calling: her pick when she has one and it is one of her row's two (UT4), else her row's class. */
export function umaCalling(outfit: CallingOutfit, pick?: RpgClass | null): RpgClass {
  const row = umaCallingRow(outfit)
  return pick && UMA_ROW_PICK[row]?.includes(pick) ? pick : UMA_ROW_CALLING[row]
}

/** Her stride: the longest distance at her best distance grade (Sprint or Mile a dash, Medium the middle, Long a stayer). */
export function umaStride(outfit: { aptitudes: Pick<Aptitudes, 'distance'> }): UmaStride {
  const longest = atBest(outfit.aptitudes.distance, DISTANCES).at(-1) ?? 'sprint'
  return DISTANCE_STRIDE[longest]
}

/** Her knack: her highest growth rate; ties go to the higher base stat, then Speed, Stamina, Power, Guts, Wit. */
export function umaKnack(outfit: Pick<TemplateOutfit, 'baseStats' | 'growthRatePercents'>): UmaKnack {
  const { growthRatePercents: growth, baseStats: base } = outfit
  const top = STATS.reduce((a, s) => (growth[s] > growth[a] || (growth[s] === growth[a] && base[s] > base[a]) ? s : a))
  return STAT_KNACK[top]
}

/** Her template (UT3): her calling (with her pick), stride and knack; "{knack word} {type}"; her Flourish and family. */
export function umaTemplate(outfit: TemplateOutfit, pick?: RpgClass | null): UmaTemplate {
  const row = umaCallingRow(outfit), calling = umaCalling(outfit, pick), stride = umaStride(outfit), knack = umaKnack(outfit)
  const type = UMA_TYPE_NAMES[calling][stride], word = UMA_KNACK_WORDS[knack]
  return { calling, stride, knack, type, word, name: `${word} ${type}`, flourish: STRIDE_FLOURISH[stride], family: KNACK_FAMILY[knack], row }
}

/** Whether her Flourish works: only as her calling's class (UT12). */
export const umaFlourishActive = (template: Pick<UmaTemplate, 'calling'>, classId: RpgClass): boolean => template.calling === classId

/** What the Stable's Template facets and search read (UT15): her calling, stride, knack and name. */
export function umaTemplateFacets(outfit: TemplateOutfit, pick?: RpgClass | null): UmaTemplateFacets {
  const { calling, stride, knack, name } = umaTemplate(outfit, pick)
  return { calling, stride, knack, name }
}

/** Why her calling pick can't change now, or null (CP29): rows 1–4 have none; a confirmed pick never changes. "Refused
 * while she works" lands with her trade (R2). */
export function umaCallingPickBlock(outfit: CallingOutfit, calling?: UmaCalling | null): string | null {
  if (!umaCallingPick(outfit)) return CALLING_NO_PICK
  return calling?.confirmed ? CALLING_SET : null
}
