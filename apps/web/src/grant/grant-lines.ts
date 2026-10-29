// "The Wilds are rebuilt" as words (R2, PP25; profession-progression.md §14.6 word for word; H80): a world's `grant`
// (save v28, H78) turned into the sheet's lines. A part whose numbers are all zero is left out, and so is a zero inside a
// part; the Umas are sorted by tickets, a banked Uma says her EXP past Lv 50, and the floor's line shows when it paid more
// than the Umas did. Pure, so the Account's row and the tests read the same numbers.
import { PROFESSION_MAX_LEVEL, type ClassesV3Record, type TierGrant } from '@rpg/domain'

export interface GrantUma { outfitId: string; name: string; trade: string | null; line: string; tickets: number }

export interface GrantLines {
  lead: string
  /** "+63,800 Speed Tickets", large. */
  tickets: string
  /** "31,900 hours of work: …", under it. */
  hours: string
  went: string | null
  back: string | null
  stays: string
  umas: GrantUma[]
  floor: string | null
  footer: string
}

export const GRANT_TITLE = 'The Wilds are rebuilt'
const LEAD = 'Ten professions, each in its own place. Every Uma starts again at Craft Lv 1, and the time they worked comes back as Speed Tickets.'
const STAYS = 'Uma Levels, classes and Class Ranks, Laurels, every ticket you had'
const FOOTER = 'A ticket takes 30 minutes off a running job: Finish on a job, or Finish all on a place.'
/** An Uma whose outfit master data lacks. */
export const UNKNOWN_UMA = 'An Uma'

const num = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 1 })
const count = (n: number, one: string, many: string) => `${num(n)} ${n === 1 ? one : many}`
const joined = (parts: (string | null)[]) => parts.filter((p): p is string => p !== null).join(' · ')

/** The sheet's lines. `who` names an Uma and her trade ("Forest · Armorer"), or undefined for one master data lacks. */
export function grantLines(grant: TierGrant, who: (outfitId: string) => { name: string; trade: string | null } | undefined): GrantLines {
  const { gear, gems, upgrades } = grant.deleted
  const went = joined([
    gear > 0 ? count(gear, 'gear piece', 'gear pieces') : null,
    gems > 0 ? count(gems, 'Star Gem', 'Star Gems') : null,
    upgrades > 0 ? count(upgrades, 'facility upgrade', 'facility upgrades') : null,
  ])
  const { laurels, items, stock } = grant.back
  const back = joined([
    laurels > 0 ? count(laurels, 'Laurel', 'Laurels') : null,
    items > 0 ? count(items, 'refined item', 'refined items') : null,
    stock > 0 ? `your Warehouse’s ${count(stock, 'item', 'items')}, now the new materials (Ores → Copper and Iron …)` : null,
  ])
  const umas = Object.entries(grant.umas).filter(([, u]) => u.tickets > 0).map(([outfitId, u]): GrantUma => {
    const named = who(outfitId)
    const banked = u.level >= PROFESSION_MAX_LEVEL && u.exp > 0 ? ` (${num(u.exp)} EXP past Lv ${PROFESSION_MAX_LEVEL})` : ''
    return { outfitId, name: named?.name ?? UNKNOWN_UMA, trade: named?.trade ?? null, line: `Craft Lv ${u.level} → 1 · ${num(u.tickets)}${banked}`, tickets: u.tickets }
  }).sort((a, b) => b.tickets - a.tickets || a.name.localeCompare(b.name))
  const extra = grant.tickets - umas.reduce((n, u) => n + u.tickets, 0)
  return {
    lead: LEAD,
    tickets: `+${num(grant.tickets)} Speed Tickets`,
    hours: `${num(grant.tickets / 2)} hours of work: every gather, refine, craft and cut your Umas did`,
    went: went ? `${went}. Their making is in those hours.` : null,
    back: back || null,
    stays: STAYS,
    umas,
    floor: extra > 0 ? `Pieces whose makers have left this world · +${num(extra)}` : null,
    footer: FOOTER,
  }
}

/** The Account's row (PP25): "The Tier rework’s grant · 63,800 Speed Tickets". */
export const grantRow = (grant: TierGrant): { label: string; value: string } =>
  ({ label: 'The Tier rework’s grant', value: `${num(grant.tickets)} Speed Tickets` })

/** Classes v3's one-time sheet's title (H132; its words are `classes-lines.ts`'). */
export const CLASSES_TITLE = 'The classes are rebuilt'
/** The Account's row for Classes v3's reset (CV30, H132): "The classes are rebuilt · 78 Class Manuals". Here beside the
 * grant's, so the Account's chunk doesn't load the sheet's words. */
export const classesRow = (record: Pick<ClassesV3Record, 'manuals'>): { label: string; value: string } =>
  ({ label: CLASSES_TITLE, value: `${num(record.manuals)} Class Manuals` })
