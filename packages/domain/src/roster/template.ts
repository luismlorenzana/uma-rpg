// The Uma Template (docs/design/tier-rework/uma-templates.md, D197; H67, D203): three readings of an outfit's racing
// profile, her calling, stride and knack, by one pure rule over master data read by stable id. Never her name, her id, her
// surface or her skills (UT3). They name her template, "{knack word} {type}", one of 90 (UT5), and feed its pieces: her
// calling (her fight type and, from engine v16, her starting class; CP29), the Flourish (H68), and from R2 her signature
// family and her moon. The names are this game's own. Nothing here is stored (UT17): only her calling pick, `UmaCalling`,
// which the save holds from v27 (H69). In the main bundle (the start reads it), so it stays the rule and its tables.
// Classes v3 (engine v19, D240; H126, dark until H134): her calling is her Tier 0, read from her best running styles alone
// (CV19: five rows, no pick); five callings × three strides make 75 templates (CV21); her Flourish works as any class of
// her Tier 0's family; her moon's node II reads her calling's root (`economy/planet.ts`).
import type { Aptitudes, AptitudeGrade, Stats, StatKey } from '@luismlorenzana/uma-data'
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/caps'
import type { RpgFlourish } from '../rpg/battle/types'
import { rpgClassFamily } from '../rpg/class-tree'
import { rpgIsTier0, type RpgClass, type RpgTier0Class } from '../rpg/kinds'

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
/** The calling rule's row, the first that fits (uma-templates §2.2): 1–4 fixed, 5–8 the pick's. From v19 Classes v3's
 * rows 1–5 (`UmaCallingRowV3`). */
export type UmaCallingRow = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
/** Classes v3's calling rows (CV19): 1 Front among her best styles, 2 Pace alone, 3 Pace with Late or End, 4 End among
 * them, 5 Late alone. */
export type UmaCallingRowV3 = 1 | 2 | 3 | 4 | 5
/** The classes a calling can name: classes v2's six (engines v16–v18) and Classes v3's five Tier 0 (v19). The two new
 * hybrids are no calling. */
export type UmaCallingClass = Exclude<RpgClass, 'armsummoner' | 'tomeblade'>
/** What her calling reads: her styles and distances, and her base Power and Wit at her starting stars. */
export interface CallingOutfit { aptitudes: Pick<Aptitudes, 'strategy' | 'distance'>; baseStats: Pick<Stats, 'power' | 'wit'> }
/** What her template reads from an outfit's master data (a `RosterOutfit` and a `BattleOutfit` fit). */
export interface TemplateOutfit { aptitudes: Pick<Aptitudes, 'strategy' | 'distance'>; baseStats: Stats; growthRatePercents: Stats }
/** The calling pick a Pace or Late Uma has (CP29): her row's two classes, the suggested one first, and the stats that
 * suggest it. */
export interface UmaCallingPick { options: [RpgClass, RpgClass]; suggested: RpgClass; power: number; wit: number }
/** Her template: the three readings, her type and knack word, her name, her Flourish, her family and her calling's row. */
export interface UmaTemplate {
  calling: UmaCallingClass
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
export interface UmaTemplateFacets { calling: UmaCallingClass; stride: UmaStride; knack: UmaKnack; name: string }

/** Her type by calling and stride: 18 words (UT5); from v19 (CV21) 15, each Tier 0 her model's three, the Acolyte the
 * Cleric's (Shieldrunner, Warden and Stalwart retire with the Paladin's calling). */
export const UMA_TYPE_NAMES: Readonly<Record<UmaCallingClass, Readonly<Record<UmaStride, string>>>> = {
  brawler: { dash: 'Charger', middle: 'Bruiser', stayer: 'Ironhide' },
  spellblade: { dash: 'Flashblade', middle: 'Spellfencer', stayer: 'Longblade' },
  mage: { dash: 'Flarecaster', middle: 'Spellwright', stayer: 'Starkeeper' },
  summoner: { dash: 'Beckoner', middle: 'Binder', stayer: 'Shepherd' },
  paladin: { dash: 'Shieldrunner', middle: 'Warden', stayer: 'Stalwart' },
  cleric: { dash: 'Lamplighter', middle: 'Mender', stayer: 'Pilgrim' },
  recruit: { dash: 'Charger', middle: 'Bruiser', stayer: 'Ironhide' },
  duelist: { dash: 'Flashblade', middle: 'Spellfencer', stayer: 'Longblade' },
  apprentice: { dash: 'Flarecaster', middle: 'Spellwright', stayer: 'Starkeeper' },
  caller: { dash: 'Beckoner', middle: 'Binder', stayer: 'Shepherd' },
  acolyte: { dash: 'Lamplighter', middle: 'Mender', stayer: 'Pilgrim' },
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

// The rule's orders: Front wins a best-style tie, then Pace owns any remaining tie; distances run shortest first;
// growth ties go Speed, Stamina, Power, Guts, Wit (after the higher base stat); grades run best first.
const STYLES = ['front', 'pace', 'late', 'end'] as const
const DISTANCES = ['sprint', 'mile', 'medium', 'long'] as const
const STATS: readonly StatKey[] = ['speed', 'stamina', 'power', 'guts', 'wit']
const GRADES: readonly AptitudeGrade[] = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
const DISTANCE_STRIDE: Readonly<Record<typeof DISTANCES[number], UmaStride>> = { sprint: 'dash', mile: 'dash', medium: 'middle', long: 'stayer' }
const STAT_KNACK: Readonly<Record<StatKey, UmaKnack>> = { speed: 'fleet', stamina: 'tireless', power: 'mighty', guts: 'gritty', wit: 'clever' }
/** Each calling row's class (uma-templates §2.2): rows 1–4 fixed, 5–8 the pick's pre-selection. The manual prints them. */
export const UMA_ROW_CALLING: Readonly<Record<UmaCallingRow, UmaCallingClass>> = {
  1: 'brawler', 2: 'summoner', 3: 'summoner', 4: 'brawler', 5: 'spellblade', 6: 'mage', 7: 'paladin', 8: 'cleric',
}
/** The calling pick's two classes by row (CP29), the pre-selection first. */
export const UMA_ROW_PICK: Readonly<Partial<Record<UmaCallingRow, readonly [RpgClass, RpgClass]>>> = {
  5: ['spellblade', 'mage'], 6: ['mage', 'spellblade'], 7: ['paladin', 'cleric'], 8: ['cleric', 'paladin'],
}
/** Classes v3's calling by row (CV19): her Tier 0. The manual prints them from H134. */
export const UMA_ROW_CALLING_V3: Readonly<Record<UmaCallingRowV3, RpgTier0Class>> = { 1: 'recruit', 2: 'duelist', 3: 'apprentice', 4: 'caller', 5: 'acolyte' }

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

/** Her calling's row (uma-templates §2.2), the first that fits: 1 Front among the best styles; 2 Late and End tied for
 * best (without Front or Pace); 3 End among the best; 4 Pace among the best, Power > Wit, the shortest distance at her
 * best grade Sprint; 5–6 Pace among the best, Power > Wit or not; 7–8 Late, Power > Wit or not. */
export function umaCallingRow(outfit: CallingOutfit): UmaCallingRow {
  const { strategy, distance } = outfit.aptitudes, { power, wit } = outfit.baseStats
  const styles = atBest(strategy, STYLES)
  if (styles.includes('front')) return 1
  if (styles.includes('pace')) return power > wit ? (atBest(distance, DISTANCES)[0] === 'sprint' ? 4 : 5) : 6
  if (styles.includes('late') && styles.includes('end')) return 2
  if (styles.includes('end')) return 3
  return power > wit ? 7 : 8
}

/** Classes v3's calling row (CV19), the first that fits, from her best running styles alone (every style at her top grade;
 * no Power, Wit or distance): 1 Front among them; 2 Pace alone; 3 Pace with Late or End; 4 End among them (Late + End, or
 * End); 5 Late alone. */
export function umaCallingRowV3(outfit: { aptitudes: Pick<Aptitudes, 'strategy'> }): UmaCallingRowV3 {
  const styles = atBest(outfit.aptitudes.strategy, STYLES)
  if (styles.includes('front')) return 1
  if (styles.includes('pace')) return styles.length === 1 ? 2 : 3
  if (styles.includes('end')) return 4
  return 5
}

/** D220's compatibility reading: the live rule before the best-style precedence fix. Kept only so current saves can
 * reopen a choice that the old fixed Summoner row had already confirmed, or clear a healer pick that is now fixed. */
function previousUmaCallingRow(outfit: CallingOutfit): UmaCallingRow {
  const { strategy, distance } = outfit.aptitudes, { power, wit } = outfit.baseStats
  const style = bestKey(strategy, STYLES)
  if (style === 'front') return 1
  if (wit >= power && (['pace', 'late', 'end'] as const).filter((s) => grade(strategy[s]) <= grade('A')).length >= 2) return 2
  if (style === 'end') return 3
  if (style === 'pace') return power > wit ? (atBest(distance, DISTANCES)[0] === 'sprint' ? 4 : 5) : 6
  return power > wit ? 7 : 8
}

/** Repairs only the choices whose eligibility changed in D220. An explicitly stored suggestion keeps the repair
 * idempotent after the player confirms it; active class and every other part of the owned Uma stay untouched. */
export function repairUmaCallingChoice(outfit: CallingOutfit, calling: UmaCalling): UmaCalling {
  const before = previousUmaCallingRow(outfit), after = umaCallingRow(outfit)
  const wasPick = UMA_ROW_PICK[before] !== undefined, isPick = UMA_ROW_PICK[after] !== undefined
  if (!wasPick && isPick && calling.pick === null && calling.confirmed) {
    return { pick: UMA_ROW_PICK[after]![0], confirmed: false }
  }
  if (wasPick && !isPick && (calling.pick !== null || !calling.confirmed)) return { pick: null, confirmed: true }
  return calling
}

/** Her calling pick (CP29): null for rows 1–4; for rows 5–8 her row's two classes, the suggested one first. From v19 null
 * for every Uma (CV19: the promotion is the pick). */
export function umaCallingPick(outfit: CallingOutfit, engine: number = BATTLE_ENGINE_VERSION): UmaCallingPick | null {
  if (rpgRework('classes', engine)) return null
  const options = UMA_ROW_PICK[umaCallingRow(outfit)]
  return options ? { options: [options[0], options[1]], suggested: options[0], power: outfit.baseStats.power, wit: outfit.baseStats.wit } : null
}

/** Her calling: her pick when she has one and it is one of her row's two (UT4), else her row's class. From v19 her Tier 0
 * by Classes v3's row (CV19), the pick ignored (the stored field stays until save v32 drops it). */
export function umaCalling(outfit: CallingOutfit, pick?: RpgClass | null, engine: number = BATTLE_ENGINE_VERSION): UmaCallingClass {
  if (rpgRework('classes', engine)) return UMA_ROW_CALLING_V3[umaCallingRowV3(outfit)]
  const row = umaCallingRow(outfit)
  return pick && UMA_ROW_PICK[row]?.includes(pick) ? pick as UmaCallingClass : UMA_ROW_CALLING[row]
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

/** Her template (UT3): her calling (with her pick), stride and knack; "{knack word} {type}"; her Flourish and family. From
 * v19 her calling is her Tier 0 and her row Classes v3's (1–5; CV19, CV21). */
export function umaTemplate(outfit: TemplateOutfit, pick?: RpgClass | null, engine: number = BATTLE_ENGINE_VERSION): UmaTemplate {
  const v3 = rpgRework('classes', engine)
  const row = v3 ? umaCallingRowV3(outfit) : umaCallingRow(outfit), calling = umaCalling(outfit, pick, engine)
  const stride = umaStride(outfit), knack = umaKnack(outfit)
  const type = UMA_TYPE_NAMES[calling][stride], word = UMA_KNACK_WORDS[knack]
  return { calling, stride, knack, type, word, name: `${word} ${type}`, flourish: STRIDE_FLOURISH[stride], family: KNACK_FAMILY[knack], row }
}

/** Whether her Flourish works: only as her calling's class (UT12); from v19 as any class of her Tier 0's family, her Tier 0
 * and its children (CV21). */
export function umaFlourishActive(template: Pick<UmaTemplate, 'calling'>, classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): boolean {
  if (rpgRework('classes', engine) && rpgIsTier0(template.calling)) return rpgClassFamily(template.calling).includes(classId)
  return template.calling === classId
}

/** What the Stable's Template facets and search read (UT15): her calling, stride, knack and name. */
export function umaTemplateFacets(outfit: TemplateOutfit, pick?: RpgClass | null, engine: number = BATTLE_ENGINE_VERSION): UmaTemplateFacets {
  const { calling, stride, knack, name } = umaTemplate(outfit, pick, engine)
  return { calling, stride, knack, name }
}

/** Why her calling pick can't change now, or null (CP29): rows 1–4 have none; a confirmed pick never changes. "Refused
 * while she works" lands with her trade (R2). From v19 no Uma has one (CV19). */
export function umaCallingPickBlock(outfit: CallingOutfit, calling?: UmaCalling | null, engine: number = BATTLE_ENGINE_VERSION): string | null {
  if (!umaCallingPick(outfit, engine)) return CALLING_NO_PICK
  return calling?.confirmed ? CALLING_SET : null
}
