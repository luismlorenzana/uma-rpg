// Page swipes on the Hub map: a mostly horizontal drag of more than 60 px changes page (T006).
import { HUB_PAGES, type HubPage } from '@rpg/domain'

export interface Point {
  x: number
  y: number
}

export const SWIPE_MIN_PX = 60

/** -1 = previous page (finger moved right), 1 = next page (moved left), 0 = not a swipe. */
export function swipeDirection(start: Point, end: Point): -1 | 0 | 1 {
  const dx = end.x - start.x
  const dy = end.y - start.y
  if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return 0
  return dx < 0 ? 1 : -1
}

/** The neighbouring page, or null at either end. */
export function neighbourPage(page: HubPage, direction: -1 | 1): HubPage | null {
  return HUB_PAGES[HUB_PAGES.indexOf(page) + direction] ?? null
}

const KEY = 'rpg.lastPage'

export function lastPage(): HubPage {
  try {
    const value = localStorage.getItem(KEY)
    return (HUB_PAGES as readonly string[]).includes(value ?? '') ? (value as HubPage) : 'farmlands'
  } catch {
    return 'farmlands'
  }
}

export function rememberPage(page: HubPage): void {
  try {
    localStorage.setItem(KEY, page)
  } catch {
    // Storage blocked: the Hub just opens on Farmlands next time.
  }
}
