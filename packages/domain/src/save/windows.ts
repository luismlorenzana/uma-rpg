// What lights a window (collections.md §3–§5, §9; D283, H152): the steps an Uma's state meets, latched into the account
// so they stay lit through resets, class switches and ascending; the switch's credit for what came before; and the view
// the screens read. Dark until save v35 (`collectionsLive`).
import { RPG_TIER1_CLASSES } from '../rpg/class-tree'
import { RPG_TIER0_CLASSES } from '../rpg/kinds'
import {
  WINDOW_CLASS_NTH, WINDOW_CLASS_RANKS, WINDOW_GRADES, WINDOW_LEVELS, WINDOW_STEP_IDS, WINDOW_TRACKS, WINDOW_WEAPONS, windowBoard, type WindowNumeral,
  type WindowStepId, type WindowTrack,
} from '../rpg/windows'
export { windowBoard } from '../rpg/windows'
import { ARMOR_SLOTS } from '../economy/ranks'
import { withHerMoon } from '../economy/planet'
import { activeClass, classOf, type BattleOutfit } from './class'
import { capitalRunsLive, collectionsLive } from './collections'
import { TIERS } from './rules'
import { gradesOf, starMapOf, type OwnedUma, type Save, type TierWorld } from './save'
import { codeDay, emptyWindow, stepCode, withSteps, WINDOW_DARK, type WindowRecord, type WindowRecords } from './window-record'

/** Whether a tier has a Rift: a tier above it to ascend into. */
export const tierHasRift = (tier: number): boolean => TIERS.some((t) => t.tier === tier + 1)

/** A tier's board, its Rift by the tier list. */
export const boardOf = (tier: number) => windowBoard(tier, tierHasRift(tier))

const NUMERALS: readonly WindowNumeral[] = [1, 2, 3, 4, 5]

/** Her ranks in the Tier 1 classes, best first; a class she hasn't touched stands at 1. */
function tier1Ranks(uma: Pick<OwnedUma, 'ranks'>): number[] {
  return RPG_TIER1_CLASSES.map((c) => uma.ranks.classes[c]?.rank ?? 1).sort((a, b) => b - a)
}

/** The lowest grade of her eleven worn slots: the three weapons of the class she fights as, five armor, three accessories. */
export function wornFloor(uma: OwnedUma, outfit: BattleOutfit, tier: number): number {
  const grades = gradesOf(uma)
  const weapons = classOf(uma, activeClass(outfit, uma, tier)).weapons
  const all = [
    ...weapons.map((w) => grades.weapons[w]?.grade ?? 0),
    ...ARMOR_SLOTS.map((s) => grades.armor[s]?.grade ?? 0),
    ...grades.accessories.map((a) => a.grade),
  ]
  return all.length === 0 ? 0 : Math.min(...all)
}

/** How many of her weapon kinds stand at `grade` or more, any class's (Weapons, save v36). */
function weaponsAt(uma: OwnedUma, grade: number): number {
  return Object.values(gradesOf(uma).weapons).filter((g) => (g?.grade ?? 0) >= grade).length
}

/** Stars n: every Planet and moon node numbered n or less, and her moon's I from II and II from IV. */
function starsMet(uma: OwnedUma, n: WindowNumeral): boolean {
  const open = new Set(withHerMoon(starMapOf(uma).open))
  for (const body of ['planet', 'prowess', 'vigor', 'guard']) for (let i = 1; i <= n; i++) if (!open.has(`${body}:${i}`)) return false
  return (n < 2 || open.has('template:1')) && (n < 4 || open.has('template:2'))
}

/** The steps her state meets now. World and Rift light only through their won-run hooks, never from current state. */
export function windowMet(uma: OwnedUma, outfit: BattleOutfit, tier: number): Set<WindowStepId> {
  const met = new Set<WindowStepId>()
  const t1 = tier1Ranks(uma)
  const t0 = Math.max(...RPG_TIER0_CLASSES.map((c) => uma.ranks.classes[c]?.rank ?? 1))
  const floor = wornFloor(uma, outfit, tier)
  for (const n of NUMERALS) {
    const i = n - 1
    if (uma.level >= WINDOW_LEVELS[i]!) met.add(`level-${n}`)
    if (uma.craft.level >= WINDOW_LEVELS[i]!) met.add(`craft-${n}`)
    const rank = t1[WINDOW_CLASS_NTH[i]! - 1] ?? 1
    if (n === 1 ? (tier === 1 && t0 >= WINDOW_CLASS_RANKS[0]) || rank >= WINDOW_CLASS_RANKS[0] : rank >= WINDOW_CLASS_RANKS[i]!) met.add(`class-${n}`)
    if (floor >= WINDOW_GRADES[i]!) met.add(`gear-${n}`)
    if (weaponsAt(uma, WINDOW_GRADES[i]!) >= WINDOW_WEAPONS) met.add(`weapons-${n}`)
    if (starsMet(uma, n)) met.add(`stars-${n}`)
  }
  return met
}

/** Whether every step of the tier's board is lit. */
export function windowFull(record: WindowRecord, tier: number): boolean {
  return boardOf(tier).every((step) => stepCode(record, step.id) !== WINDOW_DARK)
}

const recordOf = (windows: WindowRecords | undefined, outfitId: string, tier: string): WindowRecord =>
  windows?.[outfitId]?.[tier] ?? emptyWindow()

/** The windows with one record replaced, or the same object when it's the one already there. */
function put(windows: WindowRecords, outfitId: string, tier: string, record: WindowRecord): WindowRecords {
  if (windows[outfitId]?.[tier] === record) return windows
  return { ...windows, [outfitId]: { ...windows[outfitId], [tier]: record } }
}

/** Her record with what her state meets latched, and, once full without a Rift (Tier 3), the Rift's place too, so the
 * window stays full if a Rift arrives (CO33). */
function latchOne(record: WindowRecord, uma: OwnedUma, outfit: BattleOutfit, tier: number, now: string): WindowRecord {
  let next = withSteps(record, windowMet(uma, outfit, tier), now)
  if (!tierHasRift(tier) && windowFull(next, tier)) next = withSteps(next, ['rift'], now)
  return next
}

/** The switch's credit (collections.md §9): World for an Uma at its continent's top level in a world that has won all
 * three champions, the Rift for every roster of a won run, and a full window for each tier an Uma ascended from. */
function credit(save: Save, outfits: ReadonlyMap<string, BattleOutfit>, now: string): WindowRecords {
  let windows: WindowRecords = { ...save.account.windows }
  for (const [key, world] of Object.entries(save.tierWorlds)) {
    const tier = Number(key)
    const first = 5 * (tier - 1) + 1
    // Only pre-v35 credit reads these retired stage ids. Their old wins remain inert everywhere else.
    const won = (n: number) => [1, 2, 3].every((route) => (world.world.run.wins[`w${first + n - 1}-capital-r${route}-s2`] ?? 0) > 0)
    for (const [id, uma] of Object.entries(world.umas)) {
      let record = recordOf(windows, id, key)
      record = withSteps(record, NUMERALS.filter((n) => uma.level >= WINDOW_LEVELS[n - 1]! && won(n)).map((n) => `world-${n}` as const), now)
      for (const run of world.rift.runs) if (run.wonAt !== null && run.roster.includes(id)) record = withSteps(record, ['rift'], run.wonAt)
      const outfit = outfits.get(id)
      if (outfit) record = latchOne(record, uma, outfit, tier, now)
      windows = put(windows, id, key, record)
    }
  }
  for (const [id, entries] of Object.entries(save.account.history)) {
    for (const entry of entries) {
      const from = String(entry.tier - 1)
      const full = withSteps(recordOf(windows, id, from), WINDOW_STEP_IDS, entry.at)
      windows = put(windows, id, from, full)
    }
  }
  return windows
}

/**
 * Every Uma's window with what her state meets latched (CO2, CO10), on `now`'s day. The first time it runs on a save
 * (`windowsStart` null) it pays the switch's credit first. A step never goes dark. Returns the same save when nothing
 * changed, so a commit can skip the write; `updatedAt` doesn't move, since any device works out the same steps from the
 * same state, and the steps ride with the change that lit them. An Uma whose outfit isn't in `outfits` yet waits.
 */
export function latchWindows(save: Save, outfits: ReadonlyMap<string, BattleOutfit>, now: string): Save {
  if (!collectionsLive() || !save.account.windows) return save
  if (save.account.windowsStart === null || save.account.windowsStart === undefined) {
    return { ...save, account: { ...save.account, windows: credit(save, outfits, now), windowsStart: now } }
  }
  let windows = save.account.windows
  for (const [key, world] of Object.entries(save.tierWorlds)) {
    for (const [id, uma] of Object.entries(world.umas)) {
      const outfit = outfits.get(id)
      if (!outfit) continue
      windows = put(windows, id, key, latchOne(recordOf(windows, id, key), uma, outfit, Number(key), now))
    }
  }
  return windows === save.account.windows ? save : { ...save, account: { ...save.account, windows } }
}

/** The Rift's step for a won run's twenty (D283 decision 6). */
export function recordRiftWin(save: Save, tier: string, roster: readonly string[], now: string): Save {
  if (!collectionsLive() || !save.account.windows) return save
  let windows = save.account.windows
  for (const id of roster) windows = put(windows, id, tier, withSteps(recordOf(windows, id, tier), ['rift'], now))
  return windows === save.account.windows ? save : { ...save, account: { ...save.account, windows } }
}

/** World n lights for all twenty only when the fourth final falls (D293, H160). */
export function recordCapitalWin(save: Save, tier: string, continent: string, roster: readonly string[], now: string): Save {
  if (!capitalRunsLive() || !save.account.windows) return save
  const n = Number(/^w([1-9]\d*)$/.exec(continent)?.[1]) - 5 * (Number(tier) - 1)
  if (n < 1 || n > 5 || !Number.isInteger(n)) return save
  let windows = save.account.windows
  for (const id of roster) windows = put(windows, id, tier, withSteps(recordOf(windows, id, tier), [`world-${n as WindowNumeral}`], now))
  return windows === save.account.windows ? save : { ...save, account: { ...save.account, windows } }
}

export interface WindowTrackView { track: WindowTrack | 'rift'; lit: number; total: number; percent: number }
export interface WindowView {
  tier: number
  /** Her board's steps in order, each with the day it lit. */
  steps: { id: WindowStepId; track: WindowTrack | 'rift'; numeral: WindowNumeral | null; rule: string; day: string | null }[]
  lit: number
  total: number
  /** Rounded, for "14/31 · 45%" (CO36). */
  percent: number
  tracks: WindowTrackView[]
  full: boolean
}

const percentOf = (lit: number, total: number): number => (total === 0 ? 0 : Math.round((100 * lit) / total))

/** What the screens read of her window in a tier. */
export function windowOf(save: Save, outfitId: string, tier: number): WindowView {
  const record = recordOf(save.account.windows, outfitId, String(tier))
  const steps = boardOf(tier).map((step) => ({ ...step, day: codeDay(stepCode(record, step.id)) }))
  const lit = steps.filter((s) => s.day !== null).length
  const tracks = [...WINDOW_TRACKS, ...(tierHasRift(tier) ? ['rift' as const] : [])].map((track) => {
    const own = steps.filter((s) => s.track === track)
    const on = own.filter((s) => s.day !== null).length
    return { track, lit: on, total: own.length, percent: percentOf(on, own.length) }
  })
  return { tier, steps, lit, total: steps.length, percent: percentOf(lit, steps.length), tracks, full: lit === steps.length }
}

/** A track's next dark step and how far she is toward it, for the board's "what's left" ("Lv 34/40", "8 of 11 at G6"). */
export interface WindowNext { track: WindowTrack; numeral: WindowNumeral; have: number; need: number; grade?: number; run?: string }

/** Each track's first dark step and her progress toward it; a track with every step lit has none. */
export function windowNext(save: Save, uma: OwnedUma, outfit: BattleOutfit, outfitId: string, tier: number): WindowNext[] {
  const record = recordOf(save.account.windows, outfitId, String(tier))
  const t1 = tier1Ranks(uma)
  const t0 = Math.max(...RPG_TIER0_CLASSES.map((c) => uma.ranks.classes[c]?.rank ?? 1))
  const grades = gradesOf(uma)
  const worn = [...classOf(uma, activeClass(outfit, uma, tier)).weapons.map((w) => grades.weapons[w]?.grade ?? 0),
    ...ARMOR_SLOTS.map((slot) => grades.armor[slot]?.grade ?? 0), ...grades.accessories.map((a) => a.grade)]
  const open = new Set(withHerMoon(starMapOf(uma).open))
  const out: WindowNext[] = []
  for (const track of WINDOW_TRACKS) {
    const n = NUMERALS.find((k) => stepCode(record, `${track}-${k}`) === WINDOW_DARK)
    if (!n) continue
    const i = n - 1
    switch (track) {
      case 'level': out.push({ track, numeral: n, have: uma.level, need: WINDOW_LEVELS[i]! }); break
      case 'craft': out.push({ track, numeral: n, have: uma.craft.level, need: WINDOW_LEVELS[i]! }); break
      case 'class': out.push({ track, numeral: n, have: n === 1 && tier === 1 ? Math.max(t0, t1[0] ?? 1) : t1[WINDOW_CLASS_NTH[i]! - 1] ?? 1, need: WINDOW_CLASS_RANKS[i]! }); break
      case 'gear': out.push({ track, numeral: n, have: worn.filter((g) => g >= WINDOW_GRADES[i]!).length, need: worn.length, grade: WINDOW_GRADES[i]! }); break
      case 'weapons': out.push({ track, numeral: n, have: Math.min(WINDOW_WEAPONS, weaponsAt(uma, WINDOW_GRADES[i]!)), need: WINDOW_WEAPONS, grade: WINDOW_GRADES[i]! }); break
      case 'stars': {
        const nodes = ['planet', 'prowess', 'vigor', 'guard'].flatMap((body) => Array.from({ length: n }, (_, k) => `${body}:${k + 1}`))
        if (n >= 2) nodes.push('template:1')
        if (n >= 4) nodes.push('template:2')
        out.push({ track, numeral: n, have: nodes.filter((id) => open.has(id)).length, need: nodes.length })
        break
      }
      case 'world': {
        const continent = `w${5 * (tier - 1) + n}`
        const run = save.tierWorlds[String(tier)]?.capitalRuns?.find((r) => r.continent === continent && r.lanes.some((l) => l.umas.includes(outfitId)))
        out.push({ track, numeral: n, have: run?.lanes.filter((l) => l.finalAt !== null).length ?? 0, need: 4, ...(run ? { run: run.id } : {}) })
        break
      }
    }
  }
  return out
}

/** The day of her last lit step in a tier, or null: the Gallery's tie-break. */
export function lastLitDay(save: Save, outfitId: string, tier: number): string | null {
  const days = windowOf(save, outfitId, tier).steps.map((s) => s.day).filter((d): d is string => d !== null).sort()
  return days.at(-1) ?? null
}

/** The world's ready Umas: a full window here and a tier above to go to. */
export function readyToAscend(save: Save, tier: number): string[] {
  const world: TierWorld | undefined = save.tierWorlds[String(tier)]
  if (!world || !tierHasRift(tier)) return []
  return Object.keys(world.umas).filter((id) => windowFull(recordOf(save.account.windows, id, String(tier)), tier))
}
