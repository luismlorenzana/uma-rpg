// Four frozen parties walk their generals, then fight their own finals in any order (H161).
import { capitalRunNodeId, capitalRunNodeOf, openFightOf, rpgFinals, SaveRuleError, tierKey, type WorldContinent } from '@rpg/domain'
import { capitalFightBlock } from '@rpg/domain/capital'
import { useState } from 'react'
import type { Campaign } from '../../../battle/campaign'
import { CastFace } from '../../../battle/CastFace'
import { FoeRow } from '../../../battle/FoeRow'
import { formatLevel } from '../../../battle/labels'
import { useHubNavigation } from '../../../hub/navigation'
import { abandonRun, beginCapitalFight, useGame, useWorld } from '../../../save/game'
import { BottomSheet } from '../../../ui/BottomSheet'
import { LockIcon } from '../../../ui/icons'
import type { PageProps } from '../../registry'
import { ResumeFight } from '../ResumeFight'
import { CAPITAL_WORDS, finalLock, generalLine, runCount, runGenerals, runName } from './capital-view'
import { Pips, RunFaces } from './RunBits'

export function CapitalRunPage({ campaign, continent, place, runId }: {
  campaign: Campaign; continent: WorldContinent; place: PageProps['place']; runId: string
}) {
  const world = useWorld()
  const save = useGame((s) => s.save)
  const nav = useHubNavigation()
  const [shown, setShown] = useState<{ lane: number; kind: 'general' | 'final' } | null>(null)
  const [abandon, setAbandon] = useState(false)
  const [abandoned, setAbandoned] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const home = () => nav.sub(place, `capital/${continent.id}`)
  if (!world || !save) return null
  const run = world.capitalRuns?.find((r) => r.id === runId && r.continent === continent.id)
  if (!run && !abandoned && !busy) return <div className="space-y-2 p-3"><p>{CAPITAL_WORDS.noRun}</p><button type="button" onClick={home} className="min-h-11 font-semibold">Back to the capital</button></div>
  const chapter = campaign.region(runId)!
  const routes = rpgFinals(continent.order).routes
  const generals = run ? runGenerals(run) : 0
  const node = shown && run ? chapter.nodes.find((n) => n.id === capitalRunNodeId(runId, shown.lane, shown.kind === 'final' ? 'final' : (run.lanes[shown.lane - 1]!.generals + 1) as 1 | 2 | 3)) : null
  const fightBlock = shown ? capitalFightBlock(save, runId, shown.lane, shown.kind, campaign.outfits, tierKey(campaign.tier)) : null
  const ownFight = capitalRunNodeOf(openFightOf(world)?.battle?.nodeId ?? '')?.runId === runId
  const fight = async () => {
    if (!shown) return
    setBusy(true); setError(null)
    try { await beginCapitalFight(chapter, runId, shown.lane, shown.kind, campaign.outfits); nav.sub(place, 'fight') }
    catch (err) { setError(err instanceof SaveRuleError ? err.message : 'Couldn’t start the fight') }
    finally { setBusy(false) }
  }
  const remove = async () => {
    setBusy(true); setError(null)
    try { await abandonRun(runId); setAbandoned(true) }
    catch (err) { setError(err instanceof SaveRuleError ? err.message : 'Couldn’t abandon the run') }
    finally { setBusy(false) }
  }
  return <div className="space-y-3 p-3 pb-6" data-capital-run-page>
    {run && <>
      <header><p className="text-[12px] text-ink-soft">{continent.name} · Capital</p><div className="flex justify-between gap-2"><h2 className="font-display text-lg font-bold">{runName(run.id)}</h2><span className="text-[13px] text-ink-soft">{runCount(run)}</span></div></header>
      <ResumeFight place={place} />
      <ol className="space-y-2" aria-label="Lanes">
        {run.lanes.map((lane, i) => <li key={i} className="space-y-2 rounded-md bg-raised p-2.5" data-capital-lane={i + 1}>
          <div className="flex items-baseline justify-between gap-2"><h3 className="min-w-0 font-display text-[14px] font-bold">{routes[i]!.name}</h3><span className="max-w-[45%] shrink-0 truncate text-[12px] text-ink-soft">{world.parties[lane.party]?.name ?? `Party ${lane.party + 1}`}</span></div>
          <RunFaces campaign={campaign} ids={lane.umas} />
          <div className="flex items-center gap-2">
            <Pips count={lane.generals} total={3} label="Generals" />
            <p className="min-w-0 flex-1 text-[12px] text-ink-soft">{generalLine(lane.generals)}{lane.generals < 3 && ` · ${formatLevel(continent.levelStart + 9)}`}</p>
            {lane.generals < 3 && <button type="button" aria-label={`${routes[i]!.name} · Fight`} onClick={() => { setShown({ lane: i + 1, kind: 'general' }); setError(null) }}
              className="min-h-11 rounded-sm bg-accent px-3 font-display text-[13px] font-bold text-accent-ink">Fight</button>}
          </div>
        </li>)}
      </ol>
      <section className="space-y-2 rounded-md border border-accent/40 bg-raised p-2.5" data-capital-final>
        <h3 className="flex items-center gap-2 font-display font-bold">The Final {generals < 12 && <LockIcon size={14} />}</h3>
        {generals < 12 ? <p className="text-[12px] text-ink-soft">{finalLock(generals)}</p> : <ul className="space-y-2">
          {run.lanes.map((lane, i) => {
            const final = chapter.nodes.find((n) => n.id === capitalRunNodeId(runId, i + 1, 'final'))!
            const boss = [...final.enemies, ...(final.waves?.flat() ?? [])].find((e) => e.rank === 'boss')
            return <li key={i} className="flex items-center gap-2 border-t border-hairline pt-2">
              {boss && <CastFace campaign={campaign} castId={boss.castId} size={36} />}
              <span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold">{routes[i]!.name}</span><span className="block text-[12px] text-ink-soft">{world.parties[lane.party]?.name ?? `Party ${lane.party + 1}`}</span></span>
              {lane.finalAt ? <span className="text-[13px] font-semibold text-success">Won ✓</span> : <button type="button" onClick={() => { setShown({ lane: i + 1, kind: 'final' }); setError(null) }} aria-label={`${routes[i]!.name} · Final · Fight`}
                className="min-h-11 rounded-sm bg-accent px-3 font-display text-[13px] font-bold text-accent-ink">Fight</button>}
            </li>
          })}
        </ul>}
      </section>
      <button type="button" onClick={() => { setAbandon(true); setError(null) }} className="min-h-11 w-full rounded-sm border border-hairline-strong text-[13px] font-semibold text-ink-soft">{CAPITAL_WORDS.abandon}</button>
    </>}
    {shown && node && <BottomSheet title={`${routes[shown.lane - 1]!.name} · ${shown.kind === 'final' ? 'Final' : `General ${run!.lanes[shown.lane - 1]!.generals + 1}`}`} onClose={() => setShown(null)} footer={<div className="space-y-1.5">
      <button type="button" disabled={busy || fightBlock !== null} onClick={() => void fight()} className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">Fight</button>
      {fightBlock && <p className="text-center text-[12px] text-ink-soft">{fightBlock}</p>}
      {error && <p role="alert" className="text-center text-[12px] text-danger">{error}</p>}
    </div>}>
      <div className="mb-3 flex items-center justify-between gap-2"><span className="text-[12px] text-ink-soft">{formatLevel(node.level)}</span><RunFaces ids={run!.lanes[shown.lane - 1]!.umas} campaign={campaign} /></div>
      {[node.enemies, ...(node.waves ?? [])].map((wave, i) => <section key={i} className="mb-2">
        {!!node.waves?.length && <h3 className="text-micro mb-1">Wave {i + 1}</h3>}
        <ul className="space-y-1.5">{wave.map((e) => <FoeRow key={e.id} campaign={campaign} enemy={e} rank={e.rank} />)}</ul>
      </section>)}
    </BottomSheet>}
    {abandon && <BottomSheet title={CAPITAL_WORDS.abandon} onClose={() => abandoned ? home() : setAbandon(false)} footer={
      <button type="button" disabled={busy || (!abandoned && ownFight)} onClick={() => abandoned ? home() : void remove()}
        className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">{abandoned ? 'Back to the capital' : 'Abandon'}</button>
    }>
      <p className="text-[13px]">{abandoned ? 'Run abandoned' : CAPITAL_WORDS.lost}</p>
      {ownFight && <p className="mt-2 text-[12px] text-ink-soft">Finish the fight first</p>}
      {error && <p role="alert" className="mt-2 text-[12px] text-danger">{error}</p>}
    </BottomSheet>}
  </div>
}
