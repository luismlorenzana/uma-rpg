// Switching tiers (H36, tiers.md §4): a veil in the page colour fades in, the active tier changes and the app lands on
// that tier's Town Hall, and two frames later the veil fades out over the remounted shell. The veil is rendered by Root,
// outside the keyed shell, so it survives the remount; the page colour is what a blank frame shows meanwhile, so nothing
// flashes. Under reduced motion there's no veil and the switch is immediate. It's the game's own transition: uma-kit
// draws nothing new for it.
import { useReducedMotionSetting } from '@luismlorenzana/uma-kit/ui'
import { AnimatePresence, m } from 'motion/react'
import { useCallback, useSyncExternalStore } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router'
import { setActiveTier } from '../save/game'

/** theme.css's `--duration-fast` and `--duration-emphasised`, in ms. */
const FADE_IN = 120
const FADE_OUT = 260

let veiled = false
const listeners = new Set<() => void>()
function setVeiled(next: boolean): void {
  veiled = next
  for (const listener of listeners) listener()
}
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

/**
 * Puts tier `tier`'s world on screen on its Town Hall: behind the veil, or at once under reduced motion. `before` runs
 * once the veil is up, before the switch (Ascend, which creates that world, H50): if it fails, the veil lifts, nothing
 * switches, and the returned promise rejects with its error.
 */
export function switchTier(tier: number, { navigate, reducedMotion, before }: {
  navigate: NavigateFunction; reducedMotion: boolean; before?: () => Promise<unknown>
}): Promise<void> {
  // A second tap while the veil is up changes nothing.
  if (veiled) return Promise.resolve()
  const go = () => {
    if (setActiveTier(tier)) void navigate('/town', { replace: true })
  }
  if (reducedMotion) {
    if (before) return before().then(go)
    go()
    return Promise.resolve()
  }
  setVeiled(true)
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      void (before ? before() : Promise.resolve()).then(() => {
        go()
        // The remounted shell commits, then paints once, before the veil lifts.
        requestAnimationFrame(() => requestAnimationFrame(() => setVeiled(false)))
        resolve()
      }, (err: unknown) => {
        setVeiled(false)
        reject(err)
      })
    }, FADE_IN)
  })
}

/** `switchTier` with this screen's router and the motion setting. */
export function useSwitchTier(): (tier: number, before?: () => Promise<unknown>) => Promise<void> {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotionSetting()
  return useCallback((tier: number, before?: () => Promise<unknown>) => switchTier(tier, { navigate, reducedMotion, before }), [navigate, reducedMotion])
}

export function TierVeil() {
  const shown = useSyncExternalStore(subscribe, () => veiled, () => false)
  return (
    <AnimatePresence>
      {shown && (
        <m.div
          aria-hidden
          data-veil
          className="fixed inset-0 z-60 bg-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: FADE_IN / 1000, ease: [0.2, 0, 0, 1] } }}
          exit={{ opacity: 0, transition: { duration: FADE_OUT / 1000, ease: [0.2, 0, 0, 1] } }}
        />
      )}
    </AnimatePresence>
  )
}
