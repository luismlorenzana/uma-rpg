// The Convergence (H50, rift.md §6): assign four parties, one to each front's fight, covering the run's twenty; Begin
// starts the attempt and its first fight. With an attempt on: its four parties, the fights won, Fight for the next, and
// "End this attempt". Route `convergence`.
import { FRONT_NAME, RIFT_FRONTS, RIFT_STAGES, SaveRuleError, type RiftFightRef } from '@rpg/domain'
import { convergenceBlock, riftConvergence, type RiftFightPlan } from '@rpg/domain/rift'
import { useMemo, useState } from 'react'
import type { Campaign } from '../../battle/campaign'
import { FrontCrest } from '../../battle/pixel-icons'
import { useHubNavigation } from '../../hub/navigation'
import { beginRiftFight, endConvergence, startConvergence } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import type { PageProps } from '../registry'
import { ResumeRift } from './FrontChain'
import { Faces, PartyPick } from './PartyPick'
import { convergenceMissing, frontPartyBlock, suggestConvergence } from './rift-view'
import { planLine, PlanFoes } from './StageSheet'
import { useRift, useRunContext } from './use-rift'

export function ConvergenceView({ campaign, place }: { campaign: Campaign; place: PageProps['place'] }) {
  const view = useRift()
  const { save, world, run, key, tier } = view
  const ctx = useRunContext(campaign, view)
  const plans = useMemo(() => (ctx ? riftConvergence(ctx) : null), [ctx])
  const nav = useHubNavigation()
  const [parties, setParties] = useState<(number | null)[]>(() => (world && run ? suggestConvergence(world, run, campaign.outfits) : [null, null, null, null]))
  const [foes, setFoes] = useState<RiftFightPlan | null>(null)
  const [ending, setEnding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  if (!save || !world || !run || !plans) {
    return (
      <div className="space-y-3 p-4">
        <p className="text-ink-soft">Sign up twenty to reach the Convergence.</p>
        <button type="button" onClick={() => nav.subBack(place)} className="min-h-11 rounded-sm bg-raised px-4 font-semibold">Back to the Rift</button>
      </div>
    )
  }
  const sealed = RIFT_FRONTS.every((f) => run.fronts[f] >= RIFT_STAGES)
  const attempt = run.convergence.open
  const open = world.rift.battle !== null
  const name = (id: string) => campaign.outfits.get(id)?.name ?? id
  const fight = async (n: number) => {
    setError(null)
    try {
      const ref: RiftFightRef = { kind: 'convergence', fight: n }
      await beginRiftFight(ref, null, campaign.outfits, campaign.cast.members)
      nav.sub(place, 'fight')
    } catch (err) {
      setError(err instanceof SaveRuleError ? err.message : 'The fight couldn’t start.')
    }
  }
  const begin = async () => {
    setError(null)
    try {
      await startConvergence(parties as number[], campaign.outfits)
    } catch (err) {
      setError(err instanceof SaveRuleError ? err.message : 'The attempt couldn’t begin.')
      return
    }
    await fight(0)
  }
  const chosen = parties.every((p) => p !== null)
  const block = !sealed ? 'Seal all four fronts first' : chosen ? convergenceBlock(save, parties as number[], key, campaign.outfits) : 'Pick four parties'
  const missing = sealed && chosen ? convergenceMissing(world, run, parties) : []
  /** A party picked in another slot can't take this one too. */
  const slotBlock = (slot: number) => (i: number) => {
    const other = parties.findIndex((p, s) => p === i && s !== slot)
    return frontPartyBlock(world, run, i) ?? (other >= 0 ? `Picked for ${FRONT_NAME[RIFT_FRONTS[other]!]}` : null)
  }
  return (
    <div>
      <div className="space-y-2 border-b border-hairline p-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Convergence</h2>
          <span className="shrink-0 text-[12px] text-ink-soft">{run.convergence.attempts === 1 ? '1 attempt' : `${run.convergence.attempts} attempts`}</span>
        </div>
        <p className="text-[12px] text-ink-soft">{attempt ? `Fight ${attempt.rounds.length + 1} of ${RIFT_FRONTS.length}` : sealed ? 'Assign four parties' : 'Seal all four fronts first'}</p>
        <ResumeRift place={place} />
      </div>
      <ol className="space-y-2 p-3">
        {RIFT_FRONTS.map((front, i) => {
          const plan = plans[i]!
          const won = attempt ? attempt.rounds[i] : undefined
          const next = attempt ? attempt.rounds.length === i : false
          return (
            <li key={front} className={`space-y-2 rounded-md bg-raised p-2.5 ${next ? 'ring-2 ring-accent' : ''}`}>
              <div className="flex items-center gap-2">
                <FrontCrest front={front} />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{FRONT_NAME[front]}</span>
                  <span className="block truncate text-[12px] text-ink-soft">{planLine(plan, tier)}</span>
                </span>
                {attempt
                  ? <span className={`shrink-0 text-[12px] font-semibold ${won !== undefined ? 'text-accent' : 'text-ink-faint'}`}>{won !== undefined ? `Won · ${won} round${won === 1 ? '' : 's'}` : next ? 'Next' : '—'}</span>
                  : <button type="button" onClick={() => setFoes(plan)} className="min-h-11 shrink-0 px-2 text-[12px] font-semibold text-ink-soft">Foes</button>}
              </div>
              {attempt
                ? <Faces campaign={campaign} ids={attempt.parties[i] ?? []} size={28} />
                : <PartyPick campaign={campaign} world={world} value={parties[i] ?? null} block={slotBlock(i)} label={FRONT_NAME[front]} title={`${FRONT_NAME[front]}: which party?`}
                    onChange={(p) => setParties((cur) => cur.map((x, s) => (s === i ? p : x)))} />}
            </li>
          )
        })}
      </ol>
      <div className="space-y-2 px-3 pb-4">
        {attempt ? (
          <>
            <button type="button" disabled={open} onClick={() => void fight(attempt.rounds.length)}
              className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
              {open ? 'Fight open' : `Fight: ${FRONT_NAME[RIFT_FRONTS[attempt.rounds.length]!]}`}
            </button>
            <button type="button" disabled={open} onClick={() => setEnding(true)} className="min-h-11 w-full rounded-sm border border-hairline-strong font-semibold text-ink-soft disabled:opacity-40">
              End this attempt
            </button>
          </>
        ) : (
          <>
            <button type="button" disabled={block !== null || open} onClick={() => void begin()}
              className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
              Begin
            </button>
            {missing.length > 0
              ? <p className="text-[12px] text-danger">Missing: {missing.map(name).join(', ')}</p>
              : block && sealed && <p className="text-[12px] text-ink-soft">{block}</p>}
          </>
        )}
        {error && <p role="alert" className="text-[12px] text-danger">{error}</p>}
      </div>
      {foes && (
        <BottomSheet title={`Convergence · ${foes.name.replace('Convergence · ', '')}`} onClose={() => setFoes(null)}>
          <p className="mb-2 text-[13px] text-ink-soft">{planLine(foes, tier)}</p>
          <PlanFoes campaign={campaign} plan={foes} />
        </BottomSheet>
      )}
      {ending && (
        <BottomSheet title="End this attempt?" onClose={() => setEnding(false)} footer={
          <button type="button" onClick={() => void endConvergence().then(() => setEnding(false), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t end it.'))}
            className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink">End attempt</button>
        }>
          <p className="text-[14px] text-ink-soft">The next attempt starts from Iron.</p>
        </BottomSheet>
      )}
    </div>
  )
}
