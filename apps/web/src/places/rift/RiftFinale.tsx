// The Rift's finale (H52, rift.md §6): on the win that wins the run, before the achievement cut-in, a last cut-in of every
// champion of the run: "The Rift is won", the tier, the champions' faces revealed one after another, and Continue. The
// look is the achievement cut-in's (a dark, opaque dialog over the result; focus on Continue); under reduced motion
// everything draws at rest.
import { Button, useReducedMotionSetting } from '@luismlorenzana/uma-kit/ui'
import { m } from 'motion/react'
import { useEffect, useRef, type KeyboardEvent } from 'react'
import type { Campaign } from '../../battle/campaign'
import { CastFace } from '../../battle/CastFace'

const IN = { duration: 0.3, ease: [0.2, 0, 0, 1] as const }
/** Each face enters this long after the one before, the first after the title. */
const STAGGER = 0.07
const FIRST = 0.25
/** Four to a row (the list is 4 × 64 + 3 × 12 = 292 wide), the last row centred. */
const FACE = 64

export function RiftFinale({ campaign, tier, faces, onDone }: { campaign: Campaign; tier: number; faces: readonly string[]; onDone: () => void }) {
  const reduced = useReducedMotionSetting()
  const layer = useRef<HTMLDivElement>(null)
  const done = useRef(false)
  useEffect(() => {
    layer.current?.querySelector('button')?.focus()
  }, [])
  const finish = () => {
    if (done.current) return
    done.current = true
    onDone()
  }
  // Continue is the only control: Tab stays on it.
  const trap = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return
    e.preventDefault()
    layer.current?.querySelector('button')?.focus()
  }
  const n = faces.length
  return (
    <div ref={layer} data-theme="dark" role="dialog" aria-modal="true" aria-label="The Rift is won" onKeyDown={trap}
      className="pt-safe pb-safe fixed inset-0 z-50 flex flex-col bg-page text-ink">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <m.div data-finale-card initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={IN}
          className="mx-auto flex min-h-full w-full max-w-sm flex-col items-center justify-center px-6 py-8 text-center">
          <p className="text-micro">Tier {tier}</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold text-accent">The Rift is won</h2>
          {n > 0 && (
            <ul aria-label="Champions" className="mt-6 flex max-w-[292px] flex-wrap justify-center gap-3">
              {faces.map((id, i) => (
                <m.li key={id} data-finale-face initial={reduced ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...IN, delay: FIRST + STAGGER * i }} aria-label={campaign.cast.byId.get(id)?.name}
                  className="rounded-full ring-2 ring-accent/60">
                  <CastFace campaign={campaign} castId={id} size={FACE} />
                </m.li>
              ))}
            </ul>
          )}
          <p className="mt-6 text-[14px] text-ink-soft">Twenty Umas, four fronts, {n} champion{n === 1 ? '' : 's'}</p>
          <Button size="sm" className="mt-8 w-full" onClick={finish}>Continue</Button>
        </m.div>
      </div>
    </div>
  )
}
