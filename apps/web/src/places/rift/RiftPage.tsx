// The Rift (H50, rift.md §4–§8): the Battle page's end-of-tier event. Routes under `/battle/tier-finale/`: `` the Rift,
// `front/<front>` (and `/<stage>`) a front's chain, `convergence`, `signup` and `fight`. The Rift shows the open fight's
// Resume, sign-up or the run's four fronts and the Convergence, Ascend once won, and the run's roster. Its Echoes are
// fought at Trials since H153 (D283).
import {
  CONVERGENCE_FIGHTS, FRONT_NAME, RIFT_FRONTS, RIFT_ROSTER, RIFT_STAGES, riftLevel50s, SaveRuleError, type RiftFront, type RiftRun,
} from '@rpg/domain'
import { cancelRiftBlock } from '@rpg/domain/rift'
import { useState } from 'react'
import { CampaignGate, type Campaign } from '../../battle/campaign'
import { FrontCrest } from '../../battle/pixel-icons'
import { useHubNavigation } from '../../hub/navigation'
import { cancelRiftSignUp } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import type { PageProps } from '../registry'
import { AscendSheet } from './AscendSheet'
import { ConvergenceView } from './ConvergenceView'
import { frontCount, FrontChain, ResumeRift } from './FrontChain'
import { Faces } from './PartyPick'
import { partyGuidance } from './rift-view'
import { RiftFightRoute } from './RiftFightRoute'
import { SignUp } from './SignUp'
import { useRift } from './use-rift'

const isFront = (value: string | undefined): value is RiftFront => RIFT_FRONTS.includes(value as RiftFront)

export default function RiftPage({ place, rest }: PageProps) {
  const [kind, a, b] = rest.split('/')
  return (
    <CampaignGate>
      {(campaign) => {
        if (kind === 'fight') return <RiftFightRoute campaign={campaign} place={place} />
        if (kind === 'front' && isFront(a)) {
          const stage = b ? Number(b) : null
          return <FrontChain key={`${a}/${b ?? ''}`} campaign={campaign} place={place} front={a}
            stage={stage !== null && Number.isInteger(stage) && stage >= 1 && stage <= RIFT_STAGES ? stage : null} />
        }
        if (kind === 'convergence') return <ConvergenceView campaign={campaign} place={place} />
        if (kind === 'signup') return <SignUp campaign={campaign} place={place} />
        return <RiftOverview campaign={campaign} place={place} />
      }}
    </CampaignGate>
  )
}

/** The status line: the run, or how many Lv 50 Umas the tier has. */
export function riftStatus(run: RiftRun | null, level50s: number): string {
  if (!run) return `${level50s} Lv 50 Uma${level50s === 1 ? '' : 's'}`
  const n = run.id.replace(/^t\d+-r/, '')
  if (run.wonAt) return `Run ${n} · won`
  return `Run ${n} · ${RIFT_FRONTS.filter((f) => run.fronts[f] >= RIFT_STAGES).length} of 4 fronts sealed`
}

/** The Convergence card's line. */
export function convergenceLine(run: RiftRun): string {
  if (run.wonAt) return 'Won'
  const attempt = run.convergence.open
  if (attempt) return `Fight ${attempt.rounds.length + 1} of ${CONVERGENCE_FIGHTS} · ${FRONT_NAME[RIFT_FRONTS[attempt.rounds.length]!]}`
  if (RIFT_FRONTS.some((f) => run.fronts[f] < RIFT_STAGES)) return 'Seal all four fronts'
  const n = run.convergence.attempts
  return n === 0 ? 'Assign four parties' : `Assign four parties · ${n} attempt${n === 1 ? '' : 's'}`
}

export function RiftOverview({ campaign, place }: { campaign: Campaign; place: PageProps['place'] }) {
  const { save, world, run, tier, key } = useRift()
  const nav = useHubNavigation()
  const [roster, setRoster] = useState(false)
  const [ascending, setAscending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  if (!save || !world) return null
  const n50 = riftLevel50s(world)
  const cancelBlock = run ? cancelRiftBlock(save, key) : 'No run'
  return (
    <div className="space-y-4 p-3 pb-6">
      <section className="space-y-2">
        <p className="text-[13px] text-ink-soft" data-rift-status>Tier {tier} · {riftStatus(run, n50)}</p>
        <ResumeRift place={place} />
        {!run && (
          <button type="button" disabled={n50 < RIFT_ROSTER} onClick={() => nav.sub(place, 'signup')}
            className="flex min-h-14 w-full flex-col items-center justify-center rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-50">
            Sign up twenty
            {n50 < RIFT_ROSTER && <span className="text-[12px] font-semibold">{n50} of {RIFT_ROSTER} at Lv 50</span>}
          </button>
        )}
        {run?.wonAt && (
          <button type="button" onClick={() => setAscending(true)} className="flex min-h-14 w-full items-center justify-center rounded-sm bg-accent font-display text-[17px] font-bold text-accent-ink">
            Ascend to Tier {tier + 1}
          </button>
        )}
      </section>

      {run && (
        <section>
          <h3 className="text-micro mb-2">Fronts</h3>
          <ul className="space-y-2" data-rift-fronts>
            {RIFT_FRONTS.map((front) => (
              <li key={front}>
                <button type="button" onClick={() => nav.sub(place, `front/${front}`)} aria-label={`${FRONT_NAME[front]} front, ${frontCount(run.fronts[front])}`}
                  className="flex min-h-16 w-full items-center gap-3 rounded-md bg-raised p-2.5 text-left">
                  <FrontCrest front={front} scale={2} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-display font-bold">{FRONT_NAME[front]}</span>
                      <span className={`shrink-0 text-[13px] font-semibold ${run.fronts[front] >= RIFT_STAGES ? 'text-accent' : 'text-ink-soft'}`}>{frontCount(run.fronts[front])}</span>
                    </span>
                    <span className="block truncate text-[12px] text-ink-soft">{partyGuidance(front)}</span>
                  </span>
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={() => nav.sub(place, 'convergence')} aria-label={`Convergence, ${convergenceLine(run)}`}
                className="flex min-h-14 w-full items-center gap-3 rounded-md border border-accent/50 bg-raised p-2.5 text-left">
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-bold">Convergence</span>
                  <span className="block truncate text-[12px] text-ink-soft">{convergenceLine(run)}</span>
                </span>
              </button>
            </li>
          </ul>
        </section>
      )}


      {run && (
        <button type="button" onClick={() => setRoster(true)} className="flex min-h-11 w-full items-center justify-center rounded-sm border border-hairline-strong font-semibold">
          Roster
        </button>
      )}

      {roster && run && (
        <BottomSheet title={`Roster · ${run.roster.length}`} onClose={() => setRoster(false)} footer={cancelBlock === null ? (
          <button type="button" onClick={() => void cancelRiftSignUp().then(() => setRoster(false), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t cancel.'))}
            className="min-h-12 w-full rounded-sm border border-hairline-strong font-semibold text-ink-soft">Cancel sign-up</button>
        ) : undefined}>
          <ul className="grid grid-cols-5 gap-2">
            {run.roster.map((id) => <li key={id} className="flex justify-center"><Faces campaign={campaign} ids={[id]} size={52} /></li>)}
          </ul>
          {error && <p role="alert" className="mt-2 text-[13px] text-danger">{error}</p>}
        </BottomSheet>
      )}
      <AscendSheet campaign={campaign} open={ascending} onClose={() => setAscending(false)} />
    </div>
  )
}
