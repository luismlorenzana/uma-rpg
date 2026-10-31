import type { UmaUpgrades } from '@rpg/domain'

export const PROFILE_TABS = [
  { key: 'class', label: 'Class' },
  { key: 'gear', label: 'Gear' },
  { key: 'stars', label: 'Stars' },
  { key: 'template', label: 'Template' },
] as const

export type ProfileTab = (typeof PROFILE_TABS)[number]['key']
export type ProfileDots = Readonly<Record<ProfileTab, boolean>>

const TAB_KEY = 'rpg.profile.tab.v3'
const OLD_TAB_KEY = 'rpg.profile.tab.v2'
const OLD_TAB: Readonly<Record<string, ProfileTab>> = {
  skills: 'class',
  battle: 'class',
  gear: 'gear',
  work: 'class',
  racing: 'template',
}

export function tabFromRoute(segment: string | null | undefined): ProfileTab | null {
  return PROFILE_TABS.some((tab) => tab.key === segment) ? segment as ProfileTab : null
}

/** The remembered profile tab, migrating the retired five-tab key once. */
export function storedTab(): ProfileTab {
  try {
    const current = tabFromRoute(localStorage.getItem(TAB_KEY))
    if (current) return current
    const old = localStorage.getItem(OLD_TAB_KEY)
    localStorage.removeItem(OLD_TAB_KEY)
    const migrated = old ? OLD_TAB[old] : undefined
    if (migrated) localStorage.setItem(TAB_KEY, migrated)
    return migrated ?? 'class'
  } catch {
    return 'class'
  }
}

export function rememberTab(tab: ProfileTab): void {
  try {
    localStorage.setItem(TAB_KEY, tab)
  } catch {
    // Per-device convenience only.
  }
}

/** Ready marks owned by each skeleton tab until H120–H123 rebuild their bodies. */
export function tabDots(upgrades: UmaUpgrades | null, callingOpen: boolean): ProfileDots {
  return {
    class: false,
    gear: (upgrades?.gear ?? 0) > 0,
    stars: (upgrades?.stars ?? 0) > 0,
    template: callingOpen,
  }
}

/** The first actionable door, in the profile contract's priority order. */
export function firstDotTab(dots: ProfileDots): ProfileTab | null {
  return (['gear', 'stars', 'template'] as const).find((tab) => dots[tab]) ?? null
}

export interface ProfileDoorOptions {
  tab?: ProfileTab
  list?: readonly string[]
}

export function profileDoor(outfitId: string, options: ProfileDoorOptions = {}) {
  const tab = options.tab ?? storedTab()
  return {
    to: `/town/stable/outfit/${encodeURIComponent(outfitId)}/${tab}`,
    state: { back: true, ...(options.list ? { list: options.list } : {}) },
  }
}
