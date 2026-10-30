// The Exchange's Class Manual sheet as data (Classes v3 §14.3, CV30; profile v2's grammar §2.4; H132): her bars by
// generation, the counts a selected bar takes (each with why it can't be read), and the footer's before → after and its
// label. One shape for both generations: v18 lists her six classes with 1 · 5 · 10 · Max; from v19 (H134) the five Tier 0s
// (her calling's first) and the Tier 1 classes she holds, "To Rank 10", "Her share" while the reset's record lists one,
// and a Tier 0 at Rank 10 banking EXP for her promotion. The Exchange's own labels live here, not in the profile's
// wording list ("Her share" is CV30's name for the count). Pure.
import {
  activeClass, grantClassTrack, MANUAL_EXP, MANUAL_PRICE, manualBlock, MARKS_SHARE, MAX_PURCHASE, RPG_TIER0_BANK, RPG_TIER0_MAX_RANK,
  rpgClassExpToNext, rpgClassMaxRank, rpgClassName, rpgIsTier0, rpgRework, trackOf, umaCalling, umaHeldClasses, type BattleOutfit,
  type OwnedUma, type RankTrack, type RpgClass, type TierWorld,
} from '@rpg/domain'
import { classRankWord, tier0RankWord, waitingWord } from '../../ui/rank-words'

export type ClassRef = { kind: 'class'; id: RpgClass }

/** One bar: her track in a class, its name, "R34" or "R1/10 · Calling" or "R10 · +400 EXP waiting", and how full it is. */
export interface ManualBar {
  ref: ClassRef
  name: string
  caption: string
  fill: { value: number; max: number }
  /** Her calling's Tier 0 (v19, Tier 1's world). */
  calling: boolean
}

/** A count chip: 1 · 5 · 10 · To Rank 10 · Her share · Max. */
export type CountKey = '1' | '5' | '10' | 'rank10' | 'share' | 'max'
export interface ManualCount { key: CountKey; label: string; count: number; block: string | null }

/** The footer: before → after (its first part large, the rest under it), and the button's label or why it is disabled. */
export interface ManualFooter {
  step: { text: string; head: string; tail: string[] } | null
  label: string
  block: string | null
}

const num = (n: number) => n.toLocaleString('en-US')
const CALLING = 'Calling'
const TO_TEN = 'To Rank 10'
const SHARE = 'Her share'
const MAX = 'Max'
/** Manuals a Tier 0's first ten ranks take (3,600 EXP, CV5). */
const TIER0_LADDER = Array.from({ length: RPG_TIER0_MAX_RANK - 1 }, (_, i) => i + 1)

/** A Tier 0 in the live generation (from v19; its ids exist in every generation's tables). */
const isTier0 = (id: RpgClass): boolean => rpgRework('classes') && rpgIsTier0(id)
/** Whether a Tier 0 sits at its top rank, where its EXP waits for her promotion. */
const banking = (id: RpgClass, track: RankTrack): boolean => isTier0(id) && track.rank >= RPG_TIER0_MAX_RANK

/** A bar's words: a Tier 0 "R7/10", "· Calling" on hers, and at Rank 10 with EXP waiting "R10 · +400 EXP waiting" alone
 * (the promotion line's wording, short enough for a row); anyone else "R34", "R50 · Max". */
function caption(id: RpgClass, track: RankTrack, calling: boolean): string {
  if (isTier0(id)) {
    if (banking(id, track) && track.exp > 0) return `${classRankWord(track.rank)} · ${waitingWord(track.exp)}`
    return calling ? `${tier0RankWord(track.rank)} · ${CALLING}` : tier0RankWord(track.rank)
  }
  return track.rank >= rpgClassMaxRank(id) ? `${classRankWord(track.rank)} · ${MAX}` : classRankWord(track.rank)
}

function fill(id: RpgClass, track: RankTrack): ManualBar['fill'] {
  if (banking(id, track)) return { value: track.exp, max: RPG_TIER0_BANK }
  const next = rpgClassExpToNext(id, track.rank)
  return Number.isFinite(next) ? { value: track.exp, max: next } : { value: 1, max: 1 }
}

/**
 * Her bars in her world (`tier`), by generation: v18 her six classes; from v19 in Tier 1's world the five Tier 0s, her
 * calling's first, then the Tier 1 classes she holds in the tree's order (a closed one isn't listed); in a later world the
 * eight Tier 1 classes, her active class first.
 */
export function manualBars(outfit: BattleOutfit, uma: Pick<OwnedUma, 'classId' | 'ranks'>, tier: number): ManualBar[] {
  const held = umaHeldClasses(uma, tier)
  const v3 = rpgRework('classes')
  const first = !v3 ? null : tier === 1 ? umaCalling(outfit, null) : activeClass(outfit, uma, tier)
  const order = first && held.includes(first) ? [first, ...held.filter((c) => c !== first)] : held
  return order.map((id) => {
    const track = trackOf(uma.ranks, { kind: 'class', id })
    const calling = v3 && tier === 1 && id === first
    return { ref: { kind: 'class', id }, name: rpgClassName(id), caption: caption(id, track, calling), fill: fill(id, track), calling }
  })
}

/** The bar selected first: the class she fights as, else the first. */
export function firstBar(bars: readonly ManualBar[], outfit: BattleOutfit, uma: Pick<OwnedUma, 'classId'>, tier: number): RpgClass | null {
  const active = activeClass(outfit, uma, tier)
  return bars.find((bar) => bar.ref.id === active)?.ref.id ?? bars[0]?.ref.id ?? null
}

/** Manuals a bar takes before a count stops (CV §14.3): a Tier 0 at Rank 10 only to its bank's room, the last Manual
 * allowed to pass it (the rest banks as Marks at half, as `manualBlock` lets it); any other bar has no cap. */
function roomOf(id: RpgClass, track: RankTrack): number {
  return banking(id, track) ? Math.ceil(Math.max(0, RPG_TIER0_BANK - track.exp) / MANUAL_EXP) : Infinity
}

/** "To Rank 10": the whole Manuals that bring a Tier 0 from her track to Rank 10, ⌈(3,600 − her EXP from Rank 1) ÷ 1,000⌉. */
export function toRankTen(id: RpgClass, track: RankTrack): number {
  const from = TIER0_LADDER.filter((rank) => rank < track.rank).reduce((sum, rank) => sum + rpgClassExpToNext(id, rank), 0) + track.exp
  const ladder = TIER0_LADDER.reduce((sum, rank) => sum + rpgClassExpToNext(id, rank), 0)
  return Math.max(0, Math.ceil((ladder - from) / MANUAL_EXP))
}

/** Why `n` Manuals can't be read on this bar now (`marks` when only the Marks fall short), or null: the bar's own block
 * (`manualBlock`'s gate or top rank, read with no count), then the count's (the purchase cap, the bank's room, the Marks). */
function blockOf(world: TierWorld, outfitId: string, ref: ClassRef, n: number, tier: number): { text: string; marks: boolean } | null {
  const uma = world.umas[outfitId]
  if (!uma) return { text: 'Not unlocked', marks: false }
  const bar = manualBlock(world, outfitId, ref, 0, tier)
  if (bar) return { text: bar, marks: false }
  if (n > MAX_PURCHASE) return { text: `Up to ${MAX_PURCHASE}`, marks: false }
  const room = roomOf(ref.id, trackOf(uma.ranks, ref))
  if (n > room) return { text: `Room for ${room}`, marks: false }
  const price = MANUAL_PRICE * Math.max(1, n)
  return world.wallet.classMarks < price ? { text: `Needs ${num(price)} Class Marks`, marks: true } : null
}
/** Why `n` Manuals can't be read on this bar now, or null. */
export const readBlock = (world: TierWorld, outfitId: string, ref: ClassRef, n: number, tier: number): string | null =>
  blockOf(world, outfitId, ref, n, tier)?.text ?? null

/**
 * The counts for one bar: 1 · 5 · 10; from v19 "To Rank 10" on a Tier 0 below Rank 10 and "Her share" while the reset's
 * record lists hers above 0 (`left`, counting down as she reads: a hint, any bar); "Max", as many as the Marks buy (a Tier 0
 * at Rank 10: to its bank's room). Each with why it can't be read, or null.
 */
export function manualCounts(world: TierWorld, outfitId: string, ref: ClassRef, tier: number): ManualCount[] {
  const uma = world.umas[outfitId]
  if (!uma) return []
  const track = trackOf(uma.ranks, ref)
  const chips: Omit<ManualCount, 'block'>[] = [1, 5, 10].map((n) => ({ key: String(n) as CountKey, label: String(n), count: n }))
  if (isTier0(ref.id) && track.rank < RPG_TIER0_MAX_RANK) {
    const ten = toRankTen(ref.id, track)
    chips.push({ key: 'rank10', label: `${TO_TEN} · ${ten}`, count: ten })
  }
  const left = world.classesV3?.umas[outfitId]?.left ?? 0
  if (left > 0) chips.push({ key: 'share', label: `${SHARE} · ${left}`, count: left })
  const most = Math.min(Math.floor(world.wallet.classMarks / MANUAL_PRICE), MAX_PURCHASE, roomOf(ref.id, track))
  chips.push({ key: 'max', label: `${MAX} · ${most}`, count: most })
  return chips.map((chip) => ({ ...chip, block: readBlock(world, outfitId, ref, chip.count, tier) }))
}

/** The count chip selected first: "Her share" while it shows, else 1. */
export const firstCount = (counts: readonly ManualCount[]): CountKey => (counts.some((c) => c.key === 'share') ? 'share' : '1')

/** Before → after for `n` Manuals, from the domain's track grant on the class's own curve: "Brawler R34 → R36"; "Warrior R1
 * → R10 · +17,400 EXP waiting"; EXP past a bar's top that banks back: "· +360 Class Marks back". */
export function manualStep(uma: Pick<OwnedUma, 'ranks'>, ref: ClassRef, n: number): NonNullable<ManualFooter['step']> {
  const before = trackOf(uma.ranks, ref)
  const r = grantClassTrack(before, ref.id, MANUAL_EXP * n)
  const waiting = banking(ref.id, r.track) ? r.track.exp : 0
  const back = Math.floor(r.overflow * MARKS_SHARE)
  const head = `${rpgClassName(ref.id)} ${classRankWord(before.rank)} → ${classRankWord(r.track.rank)}`
  const tail = [waiting > 0 ? waitingWord(waiting) : null, back > 0 ? `+${num(back)} Class Marks back` : null].filter((t): t is string => t !== null)
  return { text: [head, ...tail].join(' · '), head, tail }
}

/** The footer's button: "Read 21 · 21,000 Class Marks". */
export const readLabel = (n: number): string => `Read ${num(n)} · ${num(n * MANUAL_PRICE)} Class Marks`

/** The footer for `n` Manuals on a bar: before → after (also while only the Marks fall short), and the button's label, or
 * why it is disabled. */
export function manualFooter(world: TierWorld, outfitId: string, ref: ClassRef, n: number, tier: number): ManualFooter {
  const uma = world.umas[outfitId]
  const block = blockOf(world, outfitId, ref, n, tier)
  const step = uma && n >= 1 && (!block || block.marks) ? manualStep(uma, ref, n) : null
  return { step, label: block?.text ?? readLabel(n), block: block?.text ?? null }
}

/** The sheet's head: "Aster · Class Marks 78,000", and "Her share · 21" while the reset's record lists hers above 0. */
export function manualHead(name: string, world: TierWorld, outfitId: string): { line: string; marks: string; share: string | null } {
  const left = world.classesV3?.umas[outfitId]?.left ?? 0
  const marks = `Class Marks ${num(world.wallet.classMarks)}`
  return { line: `${name} · ${marks}`, marks, share: left > 0 ? `${SHARE} · ${left}` : null }
}
