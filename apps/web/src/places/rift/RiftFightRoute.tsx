// The open Rift fight (H50): the shared fight screen on the Rift's source (the Twilight Rift's backdrop, foes read by their
// face), then the Rift's result. "Next stage" and "Retry" reuse the five who fought when one party still holds them;
// otherwise they open the stage's sheet to pick a party. The win that wins the run brings the finale's faces (H52).
import { RIFT_STAGES, SaveRuleError, type RiftFightRef } from '@rpg/domain'
import type { RiftFightResult } from '@rpg/domain/rift'
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import type { Campaign } from '../../battle/campaign'
import { faceRank, type FightSource } from '../../battle/fight-source'
import { pagePath } from '../../hub/navigation'
import { beginRiftFight, retreatRift, riftFightAction } from '../../save/game'
import type { PageProps } from '../registry'
import { FightScreen } from '../scenario-gate/FightScreen'
import { partyHolding, riftFinaleFaces, riftFinalePlans, riftHome, riftRefLabel, riftRefTitle } from './rift-view'
import { RiftResult } from './RiftResult'
import { useRift, useRunContext } from './use-rift'

/** The fight that follows a result's "again" button: the next stage after a front win, the same fight after a loss, the
 * Convergence's next fight, or the same Echo. Null when there's none. */
export function againRef(result: RiftFightResult): RiftFightRef | null {
  const { ref } = result
  if (ref.kind === 'front') {
    if (result.outcome !== 'victory') return ref
    return (result.cleared ?? 0) < RIFT_STAGES ? { kind: 'front', front: ref.front, stage: (result.cleared ?? ref.stage) + 1 } : null
  }
  if (ref.kind === 'convergence') return result.outcome === 'victory' && !result.runWon && result.attempt !== null ? { kind: 'convergence', fight: result.attempt } : null
  return ref
}

export function RiftFightRoute({ campaign, place }: { campaign: Campaign; place: PageProps['place'] }) {
  const view = useRift()
  const { world } = view
  const ctx = useRunContext(campaign, view)
  const navigate = useNavigate()
  const [ended, setEnded] = useState<{ result: RiftFightResult; five: string[]; finale: { tier: number; faces: string[] } | null } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const rank = useMemo(() => faceRank(campaign.cast.byId), [campaign.cast.byId])
  const battle = world?.rift.battle ?? null
  // The last action settles the fight in the save while its cues still play: keep showing the fight it was.
  const shown = useRef<{ battleId: string; ref: RiftFightRef; five: string[] } | null>(null)
  if (battle) shown.current = { battleId: battle.battleId, ref: battle.ref, five: battle.input.allies.map((a) => a.id) }
  const fight = shown.current
  const home = (ref: RiftFightRef | undefined) => navigate(pagePath(place, ref ? riftHome(ref) : ''), { replace: true })

  if (ended) {
    const again = async () => {
      const next = againRef(ended.result)
      if (!next || !world) return
      setError(null)
      const party = next.kind === 'convergence' ? null : partyHolding(world, ended.five)
      // No party holds the five any more: pick one on the stage's sheet (an Echo, on the Rift's page).
      if (next.kind !== 'convergence' && party === null) {
        navigate(pagePath(place, next.kind === 'front' ? `front/${next.front}/${next.stage}` : ''), { replace: true })
        return
      }
      try {
        await beginRiftFight(next, party, campaign.outfits, campaign.cast.members)
        setEnded(null)
      } catch (err) {
        setError(err instanceof SaveRuleError ? err.message : 'The fight couldn’t start.')
      }
    }
    return <RiftResult campaign={campaign} result={ended.result} error={error} finale={ended.finale} onAgain={() => void again()}
      onBack={() => home(ended.result.ref)} />
  }
  if (!fight) {
    return (
      <div data-theme="dark" className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-page p-6 text-center">
        <p>No Rift fight is open.</p>
        <button type="button" onClick={() => home(undefined)} className="min-h-11 rounded-sm bg-accent px-4 font-display font-bold text-accent-ink">Back to the Rift</button>
      </div>
    )
  }
  const source: FightSource<RiftFightResult> = {
    battle, title: riftRefTitle(fight.ref), name: riftRefLabel(fight.ref), biome: 'rift', back: 'Back to the Rift', rank,
    act: (action) => riftFightAction(action, campaign.cast.members), leave: retreatRift,
  }
  return <FightScreen key={fight.battleId} campaign={campaign} source={source} onMap={() => home(fight.ref)}
    onEnd={(result) => setEnded({ result, five: fight.five,
      // The run's own context: the faces it fought, fixed when it started.
      finale: result.runWon && ctx ? { tier: view.tier, faces: riftFinaleFaces(riftFinalePlans(ctx), campaign.cast.byId) } : null })} />
}
