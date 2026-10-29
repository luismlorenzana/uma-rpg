// Her template on the Uma sheet (the Tier rework's R1, engine v16, H70, live since H72; uma-templates.md §5, UT14;
// class-progression.md §10.2, CP29): the chip and its card, the calling pick card, the Racing tab's "Her template" and the
// Skills tab's ★ Flourish line. Pure. Lazy, with the Stable's pages.
import {
  BATTLE_FLOURISH_FROM, BATTLE_FLOURISH_RATE, BATTLE_FLOURISH_SHARE, FLOURISH_NAMES, KEY_LABELS, KNACK_LABEL, KNACK_STAT, STRIDE_LABEL, tradeOfCalling,
  ACCESSORY_FAMILY_LABEL, isGrades, isStarMap, mapNodeGate, nodePoints, signatureBonus, signatureWorn,
  umaCallingPick, umaCallingRow, umaTemplate,
  type GearTier, type OwnedUma, type RpgClass, type RpgFlourish, type TemplateOutfit, type TradeId, type UmaCalling, type UmaCallingClass,
} from '@rpg/domain'
import type { AptitudeGrade } from '@luismlorenzana/uma-data'
import { CLASS_LABEL } from '../../battle/labels'
import { tradeLabel } from '../../save/trade'

const STAT_LABEL = { speed: 'Speed', stamina: 'Stamina', power: 'Power', guts: 'Guts', wit: 'Wit' } as const
const GRADES: readonly AptitudeGrade[] = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
const DISTANCES = ['sprint', 'mile', 'medium', 'long'] as const
const STYLES = ['front', 'pace', 'late', 'end'] as const
const rank = (g: AptitudeGrade) => GRADES.indexOf(g)
const pct = (share: number) => `${Math.round(share * 1000) / 10}%`

/** Her calling pick as the save holds it, when the world owns her. */
type Holder = Pick<OwnedUma, 'calling'> | null

/** Her stored pick, when it is one of her row's two (a master-data fix can move her out of them; UT4). */
function pickOf(outfit: TemplateOutfit, uma: Holder): RpgClass | null {
  const pick = uma?.calling.pick ?? null
  return pick && umaCallingPick(outfit)?.options.includes(pick) ? pick : null
}

/** "Wit 102 ≥ Power 90" or "Power 104 > Wit 90": the stats her calling rule read. */
function powerWit(outfit: TemplateOutfit): string {
  const { power, wit } = outfit.baseStats
  return power > wit ? `Power ${power} > Wit ${wit}` : `Wit ${wit} ≥ Power ${power}`
}
const grade = (key: string, g: AptitudeGrade) => `${KEY_LABELS[key] ?? key} ${g}`

/** What her calling reading read, row by row (uma-templates §2.2): "Pace A", "Wit 102 ≥ Power 90". */
export function callingSources(outfit: TemplateOutfit): string[] {
  const { strategy, distance } = outfit.aptitudes
  const style = STYLES.reduce((top, s) => (rank(strategy[s]) < rank(strategy[top]) ? s : top))
  switch (umaCallingRow(outfit)) {
    case 1: return [grade('front', strategy.front)]
    case 2: return [grade('late', strategy.late), grade('end', strategy.end)]
    case 3: return [grade('end', strategy.end)]
    case 4: return [grade('pace', strategy.pace), grade('sprint', distance.sprint), powerWit(outfit)]
    default: return [grade(style, strategy[style]), powerWit(outfit)]
  }
}
/** What her stride read: the longest distance at her best distance grade, "Medium A". */
export function strideSource(outfit: Pick<TemplateOutfit, 'aptitudes'>): string {
  const { distance } = outfit.aptitudes
  const top = Math.min(...DISTANCES.map((d) => rank(distance[d])))
  const longest = [...DISTANCES].reverse().find((d) => rank(distance[d]) === top)!
  return grade(longest, distance[longest])
}
/** What her knack read: her top growth rate, "Wit +20%". */
export function knackSource(outfit: TemplateOutfit): string {
  const stat = KNACK_STAT[umaTemplate(outfit).knack]
  return `${STAT_LABEL[stat]} +${outfit.growthRatePercents[stat]}%`
}

/** A Flourish's full line, the Skills tab's root plate (UT6): "★ Even pace · 1% of her max HP a round, up to 4%". From the
 * engine's own numbers, so a tuning moves it. */
export function flourishLine(flourish: RpgFlourish): string {
  const most = pct(BATTLE_FLOURISH_SHARE)
  const what = flourish === 'clean-break' ? `a Barrier of ${most} of her max HP at the start`
    : flourish === 'even-pace' ? `${pct(BATTLE_FLOURISH_RATE['even-pace'])} of her max HP a round, up to ${most}`
    : `from round ${BATTLE_FLOURISH_FROM}, ${pct(BATTLE_FLOURISH_RATE['late-reserve'])} of her max HP a round, up to ${most}`
  return `★ ${FLOURISH_NAMES[flourish]} · ${what}`
}

/** The root plate's ★ line on the Skills tab: her Flourish, on while she is her calling's class; `off` names the class she
 * is, "No effect as Mage". */
export function rootFlourish(outfit: TemplateOutfit, uma: Holder, classId: RpgClass): { line: string; off: string | null } {
  const t = umaTemplate(outfit, pickOf(outfit, uma))
  return { line: flourishLine(t.flourish), off: t.calling === classId ? null : `No effect as ${CLASS_LABEL[classId]}` }
}

/** The chip after her rarity stars (UT14): "★ Clever Spellwright", with a dot while an owned Uma's calling can still be
 * picked. Locked outfits show it too (no dot). */
export function templateChip(outfit: TemplateOutfit, uma: Holder): { name: string; dot: boolean } {
  return { name: `★ ${umaTemplate(outfit, pickOf(outfit, uma)).name}`, dot: !!uma && !!umaCallingPick(outfit) && !uma.calling.confirmed }
}

export interface TemplateReading { label: 'Calling' | 'Stride' | 'Knack'; value: string; source: string }
/** The template card (UT14, R1's part): her name, the three readings with their sources ("Calling ← Pace A, Wit 102 ≥
 * Power 90", or "← picked"), and her Flourish with its state ("★ Even pace · as a Mage · on", "· no effect as Brawler";
 * a locked outfit's has none). */
export function templateCard(outfit: TemplateOutfit, uma: Holder, classId: RpgClass | null, tier: GearTier = 1): {
  name: string; readings: TemplateReading[]; flourish: string; signature?: string; moon?: string
} {
  const pick = pickOf(outfit, uma)
  const t = umaTemplate(outfit, pick)
  const state = classId === null ? '' : classId === t.calling ? ' · on' : ` · no effect as ${CLASS_LABEL[classId]}`
  const owned = uma && 'gear' in uma ? uma as OwnedUma : null
  const gradeGear = owned && isGrades(owned.gear) ? owned.gear : null
  const graded = gradeGear && owned && isStarMap(owned.stars)
  const family = t.family
  const signature = graded ? `Signature · ${ACCESSORY_FAMILY_LABEL[family]} · +${signatureBonus(owned.level, tier)} now · ${signatureWorn(gradeGear, family) ? 'worn' : `Wear a ${ACCESSORY_FAMILY_LABEL[family]}`}` : undefined
  const status = (id: string) => owned && isStarMap(owned.stars) && owned.stars.open.includes(id) ? 'open' : `Lv ${mapNodeGate(id)}`
  const one = nodePoints('template:1', tier), two = nodePoints('template:2', tier)
  const knack = t.knack === 'tireless' ? `HP +${one * 5}` : t.knack === 'clever' ? `MP +${one}`
    : t.knack === 'mighty' ? `DEF and M.DEF +${one}` : t.knack === 'fleet' ? 'Evasion +2.4%' : 'Limit +1.6'
  const defense = t.calling === 'mage' || t.calling === 'summoner' || t.calling === 'cleric' ? `M.DEF +${two}` : `DEF +${two}`
  return {
    name: t.name,
    readings: [
      { label: 'Calling', value: CLASS_LABEL[t.calling], source: pick ? 'picked' : callingSources(outfit).join(', ') },
      { label: 'Stride', value: STRIDE_LABEL[t.stride], source: strideSource(outfit) },
      { label: 'Knack', value: KNACK_LABEL[t.knack], source: knackSource(outfit) },
    ],
    flourish: `★ ${FLOURISH_NAMES[t.flourish]} · as a ${CLASS_LABEL[t.calling]}${state}`,
    ...(signature ? { signature, moon: `Moon · I ${knack} (${status('template:1')}) · II ${defense} (${status('template:2')})` } : {}),
  }
}

/** The Racing tab's "Her template" (UT14): Calling, Stride, Knack and Flourish, each with its note. `classId` is the class
 * she fights as (null for a locked outfit: "As a Mage"). */
export function racingTemplate(outfit: TemplateOutfit, uma: Holder, classId: RpgClass | null): { label: string; value: string; note: string }[] {
  const pick = pickOf(outfit, uma)
  const t = umaTemplate(outfit, pick)
  return [
    { label: 'Calling', value: CLASS_LABEL[t.calling], note: pick ? 'Picked' : callingSources(outfit).join(' · ') },
    { label: 'Stride', value: STRIDE_LABEL[t.stride], note: strideSource(outfit) },
    { label: 'Knack', value: KNACK_LABEL[t.knack], note: knackSource(outfit) },
    { label: 'Flourish', value: FLOURISH_NAMES[t.flourish],
      note: classId === null ? `As a ${CLASS_LABEL[t.calling]}` : classId === t.calling ? 'Active' : `No effect as ${CLASS_LABEL[classId]}` },
  ]
}

export interface CallingTile {
  classId: RpgClass
  /** Her template's name with this pick, "Clever Spellfencer". */
  name: string
  /** "★ Even pace as a Spell Blade". */
  flourish: string
  suggested: boolean
  /** Her pick now: the stored one, else the suggestion. */
  selected: boolean
}
/** The calling pick card (CP29, §10.2): two tiles for a Pace or Late Uma whose calling isn't confirmed, the suggested one
 * first and marked ("Suggested · Power 96 over Wit 88"). Null for a fixed row and a confirmed calling. */
export function callingCard(outfit: TemplateOutfit, calling: UmaCalling | null | undefined): { tiles: CallingTile[]; suggested: string } | null {
  const pick = umaCallingPick(outfit)
  if (!pick || calling?.confirmed) return null
  const current = calling?.pick && pick.options.includes(calling.pick) ? calling.pick : pick.suggested
  const { power, wit } = pick
  return {
    tiles: pick.options.map((classId) => {
      const t = umaTemplate(outfit, classId)
      return { classId, name: t.name, flourish: `★ ${FLOURISH_NAMES[t.flourish]} as a ${CLASS_LABEL[classId]}`, suggested: classId === pick.suggested,
        selected: classId === current }
    }),
    suggested: `Suggested · ${power > wit ? `Power ${power} over Wit ${wit}` : wit > power ? `Wit ${wit} over Power ${power}` : `Wit ${wit} ≥ Power ${power}`}`,
  }
}

/** Her trade on the template card (R2, UT14; H80): "Trade · Monster Den · Lapidary", from her calling. */
export function templateTrade(outfit: TemplateOutfit, uma: Holder): string {
  return `Trade · ${tradeLabel(tradeOfCalling(umaTemplate(outfit, pickOf(outfit, uma)).calling))}`
}

/** A calling pick tile's trade (R2, uma-templates §2.3; H80): the trade the choice gives her and its head count in her
 * world, "Forest · Armorer · 8 Umas", so the owner can fill a short one. */
export function callingTradeLine(classId: RpgClass, counts: Readonly<Record<TradeId, number>>): string {
  const trade = tradeOfCalling(classId as UmaCallingClass)
  const n = counts[trade]
  return `${tradeLabel(trade)} · ${n === 1 ? '1 Uma' : `${n} Umas`}`
}
