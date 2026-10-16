// Where the Hub opens (D43, D147): the last page viewed on this device, else Town Hall, the bar's first tab.
import { HUB_PAGES, type HubPage } from '@rpg/domain'

const KEY = 'rpg.lastPage'

export function lastPage(): HubPage {
  try {
    const value = localStorage.getItem(KEY)
    return (HUB_PAGES as readonly string[]).includes(value ?? '') ? (value as HubPage) : 'town'
  } catch {
    return 'town'
  }
}

export function rememberPage(page: HubPage): void {
  try {
    localStorage.setItem(KEY, page)
  } catch {
    // Storage blocked: the Hub opens on Town Hall next time.
  }
}
