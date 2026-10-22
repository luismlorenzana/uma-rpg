// The fight loads on demand (H62): the world map's fight rules (`@rpg/domain/battle`), the engine and the skill catalog
// they import, and the fight screen sit outside the main bundle. Once the Hub has painted, fetch them while the phone is
// idle, so opening the world map or a fight never waits for them. The service worker precaches the same files, so this
// also works offline after one online visit.

let started = false

type IdleWindow = { requestIdleCallback?: (run: () => void, options?: { timeout: number }) => number }

/** Starts the fight's chunks loading once, when the browser is idle (Safari has no idle callback: a short timeout). */
export function prefetchFight(): void {
  if (started) return
  started = true
  const load = () => {
    Promise.all([import('@rpg/domain/battle'), import('../places/scenario-gate/FightScreen')]).catch(() => {
      started = false // Offline before the first visit: a later Hub render tries again.
    })
  }
  const host = globalThis as IdleWindow
  if (typeof host.requestIdleCallback === 'function') host.requestIdleCallback(load, { timeout: 2000 })
  else setTimeout(load, 500)
}
