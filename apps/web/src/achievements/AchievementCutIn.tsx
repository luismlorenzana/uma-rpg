// The achievement cut-in (H49): a dark layer over a fight's result, one earned achievement at a time, each until
// Continue is tapped; after the last, `onDone`. The badge scales in and the card fades in over 300 ms, and nothing moves
// under reduced motion. The Rift's result shows it when `result.earned` isn't empty (H50).
import { Button, useReducedMotionSetting } from '@luismlorenzana/uma-kit/ui'
import { achievementDef, type AchievementGrant } from '@rpg/domain'
import { m } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AchievementBadge, FrontCrest } from '../battle/pixel-icons'
import { achievementTitle } from './words'

const IN = { duration: 0.3, ease: [0.2, 0, 0, 1] as const }

export function AchievementCutIn({ grants, onDone }: { grants: readonly AchievementGrant[]; onDone: () => void }) {
  const defs = grants.flatMap((g) => achievementDef(g.id) ?? [])
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotionSetting()
  const layer = useRef<HTMLDivElement>(null)
  const done = useRef(false)
  const finish = () => {
    if (done.current) return
    done.current = true
    onDone()
  }
  const def = defs[index]
  const empty = def === undefined
  // Focus follows the card on screen; with nothing to show, it's done at once (`finish` runs once by its own guard).
  useEffect(() => {
    if (empty) finish()
    else layer.current?.querySelector('button')?.focus()
  }, [index, empty])
  if (!def) return null
  const next = () => (index + 1 < defs.length ? setIndex(index + 1) : finish())
  // Continue is the only control: Tab stays on it.
  const trap = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return
    e.preventDefault()
    layer.current?.querySelector('button')?.focus()
  }
  const title = achievementTitle(def)
  return (
    <div ref={layer} data-theme="dark" role="dialog" aria-modal="true" aria-label={`Achievement earned: ${title}`} onKeyDown={trap}
      className="pt-safe pb-safe fixed inset-0 z-50 flex items-center justify-center bg-page px-6 text-ink">
      <m.div key={index} data-cut-in-card initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={IN}
        className="flex w-full max-w-xs flex-col items-center text-center">
        <m.div data-cut-in-badge initial={reduced ? false : { scale: 0.5 }} animate={{ scale: 1 }} transition={IN}
          className="relative mb-5 flex" aria-hidden="true">
          <AchievementBadge id={def.id} scale={4} />
          {/* Untouched's front crest sits beside the badge, which stays centred. */}
          {def.kind === 'title' && def.front && <span className="absolute bottom-0 left-full ml-2 flex"><FrontCrest front={def.front} scale={2} /></span>}
        </m.div>
        <p className="text-micro">Achievement</p>
        <h2 className="mt-1 font-display text-2xl font-extrabold text-accent">{title}</h2>
        <p className="mt-1 text-[14px] text-ink-soft">{def.how}</p>
        <Button size="sm" className="mt-8 w-full" onClick={next}>Continue</Button>
      </m.div>
    </div>
  )
}
