// The Template tab's rules (H123; D239 UP16–UP19, D240 CV19, CV21; proposal §5): her template's name, the three readings and
// what each read, her calling and trade, every ★ piece as a label, a number and a state, the racing chips with the three
// sources ringed, and the Flourish sheet. Her calling is read from her running styles, so nothing here is picked (the pick
// retired with H134). Pure, on the domain's rules. Lazy, with the Stable's pages.
import {
  ACCESSORY_FAMILY_LABEL, accessoryFamilyUsable, classOf, FLOURISH_NAMES, flourish, isGrades, isStarMap, KEY_LABELS, KNACK_LABEL, KNACK_STAT, mapNodeGate, moonTemplate,
  rpgClassFamily, rpgClassName, signatureBonus, signatureWorn, STRIDE_LABEL, tradeOfCalling, umaFlourishActive, umaPick, umaTemplate,
  type AccessoryFamily, type GearTier, type OwnedUma, type RosterOutfit, type RpgClass, type RpgFlourish, type RpgTier0Class, type TemplateOutfit,
} from '@rpg/domain'
import type { AptitudeGrade } from '@luismlorenzana/uma-data'
import { tradeLabel } from '../../save/trade'
import { mapNodeValue } from '../observatory/stars-view'
import { classFooter, classTiles } from './class-view'
import { atLevel, calling, callingOnUnlock, flourishNow, growth as growthWords, offAs, signatureFirst, worksAs } from './copy'

const STAT_LABEL = { speed: 'Speed', stamina: 'Stamina', power: 'Power', guts: 'Guts', wit: 'Wit' } as const
const GRADES: readonly AptitudeGrade[] = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
const DISTANCES = ['sprint', 'mile', 'medium', 'long'] as const
const STYLES = ['front', 'pace', 'late', 'end'] as const
const STATS = ['speed', 'stamina', 'power', 'guts', 'wit'] as const
const rank = (g: AptitudeGrade) => GRADES.indexOf(g)
const grade = (key: string, g: AptitudeGrade) => `${KEY_LABELS[key] ?? key} ${g}`

/** The running styles her calling read (CV19): every style at her top grade. */
function callingStyles(outfit: TemplateOutfit): typeof STYLES[number][] {
  const { strategy } = outfit.aptitudes
  const top = Math.min(...STYLES.map((s) => rank(strategy[s])))
  return STYLES.filter((s) => rank(strategy[s]) === top)
}
/** The distance her stride read: the longest at her best distance grade. */
function strideDistance(outfit: Pick<TemplateOutfit, 'aptitudes'>): typeof DISTANCES[number] {
  const { distance } = outfit.aptitudes
  const top = Math.min(...DISTANCES.map((d) => rank(distance[d])))
  return [...DISTANCES].reverse().find((d) => rank(distance[d]) === top)!
}
/** What her calling reading read: "Pace A", "Late A". */
export const callingSources = (outfit: TemplateOutfit): string[] => callingStyles(outfit).map((s) => grade(s, outfit.aptitudes.strategy[s]))
/** What her stride read: "Medium A". */
export function strideSource(outfit: Pick<TemplateOutfit, 'aptitudes'>): string {
  const longest = strideDistance(outfit)
  return grade(longest, outfit.aptitudes.distance[longest])
}
/** What her knack read: her top growth rate, "Wit +20%". */
export function knackSource(outfit: TemplateOutfit): string {
  const stat = KNACK_STAT[umaTemplate(outfit).knack]
  return `${STAT_LABEL[stat]} +${outfit.growthRatePercents[stat]}%`
}

/** A Flourish's shape and number: "Even pace · 1%/round · max 4%". From the engine's own numbers, so a tuning moves it. */
export const flourishValue = (value: RpgFlourish): string => flourish(value, true).replace('★ Flourish · ', '').replace(/ · On$/, '')
/** A Flourish's full line. */
export const flourishLine = (value: RpgFlourish): string => flourish(value, true)

/** The tab's first dot reason (§5.5, UP18): an accessory slot at G1 or more with no family, or her ★ family not worn while a
 * slot could wear it. Her ★ only when her weapons can use it (D266): a Charm on three Arms stays off, by choice, as the
 * standard preset leaves it, and a choice is never flagged. */
export function signatureDot(outfit: TemplateOutfit, uma: OwnedUma, classId: RpgClass): boolean {
  if (!isGrades(uma.gear) || !uma.gear.accessories.some((slot) => slot.grade >= 1)) return false
  if (uma.gear.accessories.some((slot) => slot.grade >= 1 && slot.family === null)) return true
  const family = umaTemplate(outfit, umaPick(uma)).family
  return !signatureWorn(uma.gear, family) && accessoryFamilyUsable(family, classOf(uma, classId).weapons)
}
/** The slot the Signature row opens: the one wearing her ★, else an empty one at G1 or more, else her highest. */
export function signatureSlot(uma: OwnedUma, family: AccessoryFamily): number {
  if (!isGrades(uma.gear)) return 0
  const slots = uma.gear.accessories
  const worn = slots.findIndex((slot) => slot.family === family && slot.grade >= 1)
  if (worn >= 0) return worn
  const empty = slots.findIndex((slot) => slot.family === null && slot.grade >= 1)
  if (empty >= 0) return empty
  return slots.reduce((best, slot, i) => (slot.grade > slots[best]!.grade ? i : best), 0)
}

export type TemplateRowKey = 'flourish' | 'signature' | 'moon-1' | 'moon-2'
/** One ★ piece: a label, a number, its state and the Ready dot. A locked Uma's has no state. */
export interface TemplateRow { key: TemplateRowKey; label: string; number: string; state: string | null; tone: 'on' | 'off' | 'closed' | null; dot: boolean }
export interface RacingChip { key: string; label: string; grade: string; ring: boolean }
export interface TemplateTabView {
  name: string
  family: AccessoryFamily
  readings: { label: 'Calling' | 'Stride' | 'Knack'; value: string; source: string }[]
  calling: string
  trade: string
  rows: TemplateRow[]
  racing: { groups: { name: string; chips: RacingChip[] }[]; growth: string; growthRing: string | null }
}

const chips = <K extends string>(grades: Readonly<Record<K, string>>, rings: readonly string[]): RacingChip[] =>
  (Object.keys(grades) as K[]).map((key) => ({ key, label: KEY_LABELS[key] ?? key, grade: grades[key], ring: rings.includes(key) }))

/** Her moon's state: Open, her level's gate, or waiting on the moons it opens with (D264). */
function moonState(uma: OwnedUma, node: string): string {
  if (isStarMap(uma.stars) && uma.stars.open.includes(node)) return 'Open'
  return uma.level < mapNodeGate(node) ? `Lv ${mapNodeGate(node)}` : 'With its moons'
}

/** The tab: `uma` null for a locked or elsewhere outfit, its rows with numbers and no states. */
export function templateTab(outfit: RosterOutfit, uma: OwnedUma | null, classId: RpgClass | null, tier: GearTier): TemplateTabView {
  const t = umaTemplate(outfit, uma ? umaPick(uma) : null)
  const moon = moonTemplate(outfit, uma ? umaPick(uma) : null)
  const name = rpgClassName(t.calling)
  const on = classId !== null && umaFlourishActive(t, classId)
  const value = (node: string) => mapNodeValue(node, t.calling, moon.knack, moon.channel, tier)
  const worn = uma && isGrades(uma.gear) ? signatureWorn(uma.gear, t.family) : false
  const graded = uma && isGrades(uma.gear) ? uma.gear.accessories.some((slot) => slot.grade >= 1) : false
  const bonus = `ATK/M.ATK +${signatureBonus(uma?.level ?? 50, tier)}`
  const flourishRow: TemplateRow = { key: 'flourish', label: '★ Flourish', number: flourishValue(t.flourish), dot: false,
    state: uma ? (on ? 'On' : offAs(rpgClassName(classId!))) : null, tone: uma ? (on ? 'on' : 'off') : null }
  const signatureRow: TemplateRow = uma
    ? { key: 'signature', label: '★ Signature', number: bonus, state: worn ? 'Worn' : graded ? 'Not worn' : signatureFirst, tone: worn ? 'on' : graded ? null : 'closed',
        dot: signatureDot(outfit, uma, classId!) }
    : { key: 'signature', label: '★ Signature', number: atLevel(bonus, 50), state: null, tone: null, dot: false }
  const moonRow = (key: 'moon-1' | 'moon-2', label: string, node: string): TemplateRow => {
    const state = uma ? moonState(uma, node) : null
    return { key, label, number: value(node), state, tone: state === null ? null : state === 'Open' ? 'on' : 'closed', dot: false }
  }
  const styles = callingStyles(outfit) as readonly string[]
  const knackStat = KNACK_STAT[t.knack]
  const rates = STATS.filter((stat) => outfit.growthRatePercents[stat] > 0).map((stat) => ({ stat: STAT_LABEL[stat], percent: outfit.growthRatePercents[stat] }))
  return {
    name: t.name,
    family: t.family,
    readings: [
      { label: 'Calling', value: name, source: callingSources(outfit).join(' · ') },
      { label: 'Stride', value: STRIDE_LABEL[t.stride], source: strideSource(outfit) },
      { label: 'Knack', value: KNACK_LABEL[t.knack], source: `${knackSource(outfit)} · ${ACCESSORY_FAMILY_LABEL[t.family]}` },
    ],
    calling: uma ? calling(name) : callingOnUnlock(name),
    trade: tradeLabel(tradeOfCalling(t.calling)),
    rows: [flourishRow, signatureRow, moonRow('moon-1', '★ Moon I', 'template:1'), moonRow('moon-2', '★ Moon II', 'template:2')],
    racing: {
      groups: [
        { name: 'Surface', chips: chips(outfit.aptitudes.surface, []) },
        { name: 'Distance', chips: chips(outfit.aptitudes.distance, [strideDistance(outfit)]) },
        { name: 'Style', chips: chips(outfit.aptitudes.strategy, styles) },
      ],
      growth: growthWords(rates),
      growthRing: STAT_LABEL[knackStat],
    },
  }
}

/** One class of her family in the Flourish sheet. */
export interface FlourishChip { classId: RpgClass; name: string; tappable: boolean; selected: boolean }
export interface FlourishSheetView {
  shape: string
  flourishName: string
  works: string
  now: string
  chips: FlourishChip[]
  footer: { label: string; classId: RpgClass } | null
}
/**
 * The Flourish sheet (§5.3): its shape and number, what it works as, how it stands, and while it's off her family's classes
 * she can fight as: a tap selects, the default the highest Class Rank she holds (a Tier 1 class before its Tier 0 at a tie),
 * and the footer is Fight as …, or Start … · R1 on a Tier 0 she hasn't started. In a later tier's world the family has no Tier 0.
 */
export function flourishSheet(outfit: RosterOutfit, uma: OwnedUma, classId: RpgClass, tier: number | string, selected: RpgClass | null): FlourishSheetView {
  const t = umaTemplate(outfit, umaPick(uma))
  const on = umaFlourishActive(t, classId)
  const family = rpgClassFamily(t.calling as RpgTier0Class)
  const tiles = classTiles(outfit, uma, tier).filter((tile) => family.includes(tile.classId))
    .sort((a, b) => family.indexOf(a.classId) - family.indexOf(b.classId))
  const base = { shape: flourishValue(t.flourish), flourishName: FLOURISH_NAMES[t.flourish], works: worksAs(family.map((c) => rpgClassName(c))), now: flourishNow(on, rpgClassName(classId)) }
  if (on) return { ...base, chips: [], footer: null }
  const can = tiles.filter((tile) => tile.state === 'available' || tile.state === 'open')
  const held = can.filter((tile) => tile.state === 'available').sort((a, b) => b.rank - a.rank || b.tier - a.tier)
  const pick = can.find((tile) => tile.classId === selected) ?? held[0] ?? can[0]
  const footer = pick ? classFooter(pick) : null
  return { ...base, chips: tiles.map((tile) => ({ classId: tile.classId, name: tile.name, tappable: can.includes(tile), selected: tile === pick })),
    footer: pick && footer ? { label: footer.label, classId: pick.classId } : null }
}
