// The window on screen (D283, H155; collections.md §4, §7): the pixel rule that lights it, and the words its board, the
// profile's square and the Gallery read. Pure, so tests hold them.
import { capitalRunsLive, WINDOW_DARK, WINDOW_STEP_IDS, type WindowNumeral, type WindowRecords, type WindowStepId, type WindowTrack } from '@rpg/domain'
import type { WindowNext, WindowView } from '@rpg/domain/windows'

/** The pane map's values: the lead is always drawn, the face lights with the last step, every other pane in 1–250. */
const LEAD = 0
const LAST = 250
const FACE = 255

/**
 * A window with `lit` of its `steps` steps lit, on RGBA pixels (uma-platform's `litPixels`, P84, which tests check this
 * against): a pixel whose map value is the lead or at most 250 × lit ÷ (steps − 1) is drawn as it is, the face only at
 * `lit = steps`, any other as dark glass. Without a map, a full window is drawn whole and any other dark.
 */
export function litRgba(window: Uint8ClampedArray, order: Uint8ClampedArray | null, lit: number, steps: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(window.length)
  const full = lit >= steps
  const limit = full ? FACE : (LAST * lit) / (steps - 1)
  for (let p = 0; p < window.length; p += 4) {
    const r = window[p]!, g = window[p + 1]!, b = window[p + 2]!
    out[p + 3] = window[p + 3]!
    const value = order ? order[p]! : full ? LEAD : FACE
    if (value === LEAD || value <= limit) {
      out[p] = r
      out[p + 1] = g
      out[p + 2] = b
      continue
    }
    const y = 0.299 * r + 0.587 * g + 0.114 * b
    out[p] = Math.round((0.3 * r + 0.7 * y) * 0.16 + 9)
    out[p + 1] = Math.round((0.3 * g + 0.7 * y) * 0.16 + 11)
    out[p + 2] = Math.round((0.3 * b + 0.7 * y) * 0.16 + 18)
  }
  return out
}

/** "14/31 · 45%" (CO36). */
export const windowCount = (view: Pick<WindowView, 'lit' | 'total' | 'percent'>): string => `${view.lit}/${view.total} · ${view.percent}%`

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** "2 Nov", from a `YYYY-MM-DD` day. */
export function dayLabel(day: string): string {
  const [, m, d] = day.split('-').map(Number)
  return `${d} ${MONTHS[(m ?? 1) - 1]}`
}

/** The board's short label for a step: "Lv 10", "R30", "2 at R50", "Craft 20", "G6", "5 at G6", "Stars III", "Cont. 7", "Rift". */
export function stepLabel(step: Pick<WindowView['steps'][number], 'track' | 'numeral' | 'rule'>, tier: number): string {
  const n = step.numeral ?? 0
  const roman = ['I', 'II', 'III', 'IV', 'V'][n - 1] ?? ''
  switch (step.track) {
    case 'level': return `Lv ${10 * n}`
    case 'craft': return `Craft ${10 * n}`
    case 'class': return n === 1 ? 'R10' : n === 2 ? 'R30' : n === 3 ? 'R50' : `${n - 2} at R50`
    case 'gear': return `G${2 * n}`
    case 'weapons': return `5 at G${2 * n}`
    case 'stars': return `Stars ${roman}`
    case 'world': return `Cont. ${5 * (tier - 1) + n}`
    case 'rift': return 'Rift'
  }
}

/** What's left on a track's next step: "Lv 34/40", "R41/50", "Craft 22/30", "8 of 11 at G6", "3 of 5 at G6", "10/13", "1 of 3". */
export function nextLabel(next: WindowNext): string {
  switch (next.track) {
    case 'level': return `Lv ${next.have}/${next.need}`
    case 'class': return `R${next.have}/${next.need}`
    case 'craft': return `Craft ${next.have}/${next.need}`
    case 'gear':
    case 'weapons': return `${next.have} of ${next.need} at G${next.grade}`
    case 'stars': return `${next.have}/${next.need}`
    case 'world': return capitalRunsLive() ? next.run ? `${next.have} of 4 finals` : 'Not run' : `${next.have} of ${next.need}`
  }
}

/** Where a track's steps come from, for a tile's inline line. */
export const TRACK_SOURCE: Readonly<Record<WindowView['steps'][number]['track'], string>> = {
  level: 'Campaign · Drills', class: 'Campaign · Trials · Manuals', craft: 'Wilds jobs', gear: 'Made items', weapons: 'Made items · any class', stars: 'Planet and Moon Jewels',
  world: capitalRunsLive() ? 'Capital runs' : 'Capital Finals', rift: 'The Rift',
}

/** The track names for the board's rows. */
export const TRACK_NAME: Readonly<Record<WindowView['steps'][number]['track'], string>> = {
  level: 'Level', class: 'Class', craft: 'Craft', gear: 'Gear', weapons: 'Weapons', stars: 'Stars', world: 'World', rift: 'Rift',
}

export interface GalleryEntry { id: string; percent: number; lit: number; total: number; last: string | null; name: string }

/** The Gallery's order (CO37): most complete first; ties to whoever lit her last step first, then by name. */
export function rankGallery(entries: readonly GalleryEntry[]): GalleryEntry[] {
  return [...entries].sort((a, b) => b.percent - a.percent || b.lit - a.lit || (a.last ?? '9999').localeCompare(b.last ?? '9999') || a.name.localeCompare(b.name))
}

/** The world's share lit (CO36): her lit steps over every owned Uma's steps. */
export function collectionPercent(entries: readonly Pick<GalleryEntry, 'lit' | 'total'>[]): number {
  const total = entries.reduce((sum, e) => sum + e.total, 0)
  return total === 0 ? 0 : Math.round((100 * entries.reduce((sum, e) => sum + e.lit, 0)) / total)
}

export type GalleryFilter = 'all' | 'ready' | 'owned' | 'locked'
export const GALLERY_FILTERS: readonly { key: GalleryFilter; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'ready', label: 'Ready' }, { key: 'owned', label: 'Owned' }, { key: 'locked', label: 'Locked' },
]

/** The Gallery's head: "3 full · 2 ready". */
export const galleryHead = (full: number, ready: number): string => `${full} full · ${ready} ready`
/** "Collection 62%" (CO36). */
export const collectionLine = (percent: number): string => `Collection ${percent}%`
/** A ranked tile's name: "1. Special Week". */
export const rankedName = (rank: number, name: string): string => `${rank}. ${name}`
export const GALLERY_WORDS = { locked: 'Locked', ascended: 'Ascended', ready: 'Ready to ascend · Gallery' } as const
/** The Ascend button: "Ascend 2". */
export const ascendCount = (n: number): string => `Ascend ${n}`

/** The Ascend sheet's lines for the ticked Umas (collections.md §5): where they land, what restarts, the purse. */
export function ascendLines(numbers: { to: number; laurels: number; speedTickets: number; classMarks: number }, tier: number): string[] {
  const f = (n: number) => n.toLocaleString('en-US')
  return [
    `Lv 1 in Tier ${numbers.to}`,
    'Ranks, skills and stars restart',
    `Gear returns to Tier ${tier}’s stock`,
    `+${f(numbers.laurels)} Laurels · +${f(numbers.speedTickets)} Speed Tickets`,
    ...(numbers.classMarks > 0 ? [`+${f(numbers.classMarks)} Class Marks`] : []),
  ]
}

/** Why one ready Uma can't go now, short: work names her, so it reads "At work · recall first". */
export const cantGo = (block: string): string => (block.startsWith('Recall') ? 'At work · recall first' : block)

/** The steps lit from one save's windows to the next, by Uma and tier, in the record's order. */
export function litBetween(before: WindowRecords | undefined, after: WindowRecords | undefined): { outfitId: string; tier: number; ids: WindowStepId[] }[] {
  const out: { outfitId: string; tier: number; ids: WindowStepId[] }[] = []
  for (const [outfitId, tiers] of Object.entries(after ?? {})) {
    for (const [tier, record] of Object.entries(tiers)) {
      const was = before?.[outfitId]?.[tier]?.steps
      if (was === record.steps) continue
      const code = (steps: string | undefined, i: number) => steps?.slice(3 * i, 3 * i + 3) || WINDOW_DARK
      const ids = WINDOW_STEP_IDS.filter((_, i) => code(record.steps, i) !== WINDOW_DARK && code(was, i) === WINDOW_DARK)
      if (ids.length) out.push({ outfitId, tier: Number(tier), ids })
    }
  }
  return out
}

const stepOf = (id: WindowStepId) => {
  if (id === 'rift') return { track: 'rift' as const, numeral: null, rule: '' }
  const [track, n] = id.split('-') as [WindowTrack, string]
  return { track, numeral: Number(n) as WindowNumeral, rule: '' }
}

/** The toast after a change lights steps (H155): one Uma's name and "Window +1 · Craft 30", or "Windows +5 · 3 Umas". */
export function windowToast(lit: readonly { outfitId: string; tier: number; ids: readonly WindowStepId[] }[], name: (outfitId: string) => string):
  { title: string; line: string } | null {
  const steps = lit.reduce((sum, l) => sum + l.ids.length, 0)
  if (steps === 0) return null
  const umas = new Set(lit.map((l) => l.outfitId))
  if (umas.size > 1) return { title: 'Windows lit', line: `Windows +${steps} · ${umas.size} Umas` }
  const one = lit[0]!
  return { title: name(one.outfitId), line: steps === 1 ? `Window +1 · ${stepLabel(stepOf(one.ids[0]!), one.tier)}` : `Window +${steps}` }
}
