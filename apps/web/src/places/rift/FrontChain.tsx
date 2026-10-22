// A front's chain (H50, rift.md §5): its ward and party guidance, then its twelve stages in order, each with its leaders'
// faces; cleared ones ticked, the next one highlighted, the rest locked. Any row opens its stage sheet; only the next
// one fights. Route `front/<front>`, and `front/<front>/<stage>` with that stage's sheet open.
import { RIFT_STAGES, type RiftFront } from '@rpg/domain'
import { riftChain, RIFT_FRONT_SPECS } from '@rpg/domain/rift'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import type { Campaign } from '../../battle/campaign'
import { CastFace } from '../../battle/CastFace'
import { WARD_BADGE } from '../../battle/FoeRow'
import { FrontCrest } from '../../battle/pixel-icons'
import { pagePath, useHubNavigation } from '../../hub/navigation'
import { LockIcon } from '../../ui/icons'
import type { PageProps } from '../registry'
import { partyGuidance, stageLeaders } from './rift-view'
import { planLine, StageSheet, type StageStatus } from './StageSheet'
import { useRift, useRunContext } from './use-rift'

/** Resume the open Rift fight, when there is one. */
export function ResumeRift({ place }: { place: PageProps['place'] }) {
  const { world } = useRift()
  const nav = useHubNavigation()
  if (!world?.rift.battle) return null
  return (
    <button type="button" onClick={() => nav.sub(place, 'fight')} className="flex min-h-11 w-full items-center justify-center rounded-sm bg-accent font-display font-bold text-accent-ink">
      Resume the open fight
    </button>
  )
}

/** "5/12" or "Sealed". */
export const frontCount = (cleared: number): string => (cleared >= RIFT_STAGES ? 'Sealed' : `${cleared}/${RIFT_STAGES}`)

export function FrontChain({ campaign, place, front, stage }: { campaign: Campaign; place: PageProps['place']; front: RiftFront; stage: number | null }) {
  const view = useRift()
  const ctx = useRunContext(campaign, view)
  const plans = useMemo(() => (ctx ? riftChain(ctx, front) : null), [ctx, front])
  const navigate = useNavigate()
  const nav = useHubNavigation()
  const [open, setOpen] = useState<number | null>(stage)
  const next = useRef<HTMLButtonElement>(null)
  // The chain opens on its next stage.
  // (A block body: newer browsers' scrollIntoView returns a promise, which isn't a cleanup.)
  useEffect(() => {
    next.current?.scrollIntoView?.({ block: 'center' })
  }, [!!plans])
  const tierOf = (castId: string) => campaign.cast.byId.get(castId)?.tier
  const { run } = view
  if (!run || !plans) {
    return (
      <div className="space-y-3 p-4">
        <p className="text-ink-soft">Sign up twenty to fight the fronts.</p>
        <button type="button" onClick={() => nav.subBack(place)} className="min-h-11 rounded-sm bg-raised px-4 font-semibold">Back to the Rift</button>
      </div>
    )
  }
  const spec = RIFT_FRONT_SPECS[front]
  const cleared = run.fronts[front]
  const status = (n: number): StageStatus => (n <= cleared ? 'cleared' : n === cleared + 1 && run.wonAt === null ? 'next' : 'locked')
  const close = () => {
    setOpen(null)
    if (stage !== null) navigate(pagePath(place, `front/${front}`), { replace: true })
  }
  const shown = open !== null ? plans[open - 1] : undefined
  return (
    <div>
      <div className="sticky top-0 z-10 space-y-2 border-b border-hairline bg-page/95 p-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <FrontCrest front={front} scale={2} />
          <h2 className="min-w-0 flex-1 truncate font-display text-lg font-bold">{spec.name} front</h2>
          <span className="shrink-0 text-[13px] font-semibold text-ink-soft">{frontCount(cleared)}</span>
        </div>
        <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-ink-soft">
          {spec.ward && <span className="rounded-xs bg-danger/20 px-1 text-[11px] font-semibold text-danger">{WARD_BADGE[spec.ward]}</span>}
          <span>{partyGuidance(front)}</span>
        </p>
        <ResumeRift place={place} />
      </div>
      <ol className="space-y-2 p-3">
        {plans.map((plan, i) => {
          const n = i + 1, s = status(n)
          const leaders = stageLeaders(plan, tierOf)
          return (
            <li key={n}>
              <button ref={s === 'next' ? next : undefined} type="button" onClick={() => setOpen(n)} aria-label={`${plan.name}, ${s === 'next' ? 'next' : s}`}
                className={`flex min-h-14 w-full items-center gap-3 rounded-md p-2.5 text-left ${s === 'locked' ? 'bg-sunken opacity-60' : 'bg-raised'} ${s === 'next' ? 'ring-2 ring-accent' : ''}`}>
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-full font-display text-[14px] font-bold ${s === 'cleared' ? 'bg-accent/30 text-accent' : s === 'next' ? 'bg-accent text-accent-ink' : 'bg-panel'}`}>
                  {s === 'cleared' ? '✓' : s === 'locked' ? <LockIcon size={14} /> : n}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{plan.name}</span>
                  <span className="block truncate text-[12px] text-ink-soft">{planLine(plan, view.tier)}</span>
                </span>
                <span className="flex shrink-0 -space-x-2">
                  {leaders.map((id) => <span key={id} className="rounded-full ring-2 ring-raised"><CastFace campaign={campaign} castId={id} size={30} /></span>)}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      {shown && open !== null && <StageSheet campaign={campaign} place={place} front={front} plan={shown} status={status(open)} onClose={close} />}
    </div>
  )
}
