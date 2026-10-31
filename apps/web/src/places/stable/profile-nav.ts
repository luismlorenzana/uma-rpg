// The profile's doors and ‹ n/N › (H124; D239 UP20, UP21; proposal §6): the stepper over the list a door passed, a profile
// route's parts, and the roster's list and saved scroll. Pure but for the scroll's session key.
import type { ProfileTab } from './profile-tabs'
import { tabFromRoute } from './profile-tabs'

/** ‹ 3/26 ›: where she is in the list, and who the arrows go to. The ends wrap, so a party of five steps like a ring. */
export interface Stepper { label: string; name: string; previous: string; next: string }
/** The stepper, or null with one Uma or an id outside the list (a locked one is never in a list). */
export function stepper(list: readonly string[], id: string): Stepper | null {
  const at = list.indexOf(id)
  if (list.length < 2 || at < 0) return null
  return { label: `${at + 1}/${list.length}`, name: `Uma ${at + 1} of ${list.length}`,
    previous: list[(at - 1 + list.length) % list.length]!, next: list[(at + 1) % list.length]! }
}

/** The outfit and tab of a profile route, or null on the roster. */
export function profileRoute(pathname: string): { id: string; tab: ProfileTab | null } | null {
  const match = /\/town\/stable\/outfit\/([^/]+)(?:\/([^/]+))?/.exec(pathname)
  return match ? { id: decodeURIComponent(match[1]!), tab: tabFromRoute(match[2]) } : null
}

/** The roster's owned Umas, in the view's order. */
export const rosterList = (rows: readonly { id: string; uma: unknown }[]): string[] => rows.filter((row) => row.uma).map((row) => row.id)

const SCROLL_KEY = 'rpg.stable.scroll'
const scroller = (): HTMLElement | null => document.querySelector('[data-place-page] main')
/** Opening a face keeps the roster's place. */
export function saveRosterScroll(): void {
  try {
    sessionStorage.setItem(SCROLL_KEY, String(scroller()?.scrollTop ?? 0))
  } catch {
    // This session's convenience only.
  }
}
/** Back on the roster: its place, once. */
export function restoreRosterScroll(): void {
  try {
    const saved = Number(sessionStorage.getItem(SCROLL_KEY))
    sessionStorage.removeItem(SCROLL_KEY)
    const main = scroller()
    if (saved > 0 && main) main.scrollTop = saved
  } catch {
    // This session's convenience only.
  }
}
/** A step starts at the top of her page. */
export function scrollProfileTop(): void {
  const main = scroller()
  if (main) main.scrollTop = 0
}
