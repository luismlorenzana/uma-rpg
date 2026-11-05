// The capital's open runs (H161). Loaded only by the live branch of the Scenario Gate route.
import { capitalRunOf, type WorldContinent } from '@rpg/domain'
import { useState } from 'react'
import type { Campaign } from '../../../battle/campaign'
import { formatLevel } from '../../../battle/labels'
import { useHubNavigation } from '../../../hub/navigation'
import { useWorld } from '../../../save/game'
import type { PageProps } from '../../registry'
import { ResumeFight } from '../ResumeFight'
import { CAPITAL_WORDS, runCount, runFinals, runName, runParties, runPath } from './capital-view'
import { NewRun } from './NewRun'
import { CapitalRunPage } from './CapitalRunPage'
import { Pips } from './RunBits'

export default function CapitalPage({ campaign, continent, place, runId }: {
  campaign: Campaign; continent: WorldContinent; place: PageProps['place']; runId?: string
}) {
  const world = useWorld()
  const nav = useHubNavigation()
  const [newRun, setNewRun] = useState(false)
  if (!world) return null
  if (runId) return <CapitalRunPage key={runId} campaign={campaign} continent={continent} place={place} runId={runId} />
  const runs = world.capitalRuns?.filter((r) => r.continent === continent.id) ?? []
  return <div className="space-y-3 p-3 pb-6" data-capital-page>
    <header>
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="min-w-0 font-display text-lg font-bold">{continent.name} · Capital</h2>
        <span className="shrink-0 text-[12px] text-ink-soft">{formatLevel(continent.levelStart + 9)}</span>
      </div>
      <p className="text-[13px] text-ink-soft">Runs won: {world.capitals?.[continent.id]?.won ?? 0}</p>
    </header>
    <ResumeFight place={place} />
    <ul className="space-y-2" aria-label="Open runs">
      {runs.map((run) => {
        const finalOpen = run.lanes.every((l) => l.generals === 3)
        const count = finalOpen ? runFinals(run) : run.lanes.filter((l) => l.generals === 3).length
        return <li key={run.id}>
          <button type="button" onClick={() => nav.sub(place, runPath(continent.id, run.id))} data-capital-run={capitalRunOf(run.id)?.n}
            className="w-full space-y-1 rounded-md border border-hairline bg-raised p-3 text-left">
            <span className="flex justify-between gap-2 font-display font-bold"><span>{runName(run.id)}</span><span className="text-[13px] text-ink-soft">{runCount(run)}</span></span>
            <span className="block text-[12px] text-ink-soft">{runParties(run)}</span>
            <span className="flex items-center gap-2 text-[12px] text-ink-soft">
              {finalOpen ? 'Final' : 'Lanes'} <Pips count={count} total={4} label={finalOpen ? 'Finals' : 'Lanes through'} />
              <span>{finalOpen ? `${count} of 4` : 'Final locked'}</span>
            </span>
          </button>
        </li>
      })}
    </ul>
    <button type="button" onClick={() => setNewRun(true)} className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink">{CAPITAL_WORDS.newRun}</button>
    <div className="text-[12px] text-ink-soft"><p>{CAPITAL_WORDS.full}</p><p>{CAPITAL_WORDS.generals} · {CAPITAL_WORDS.finals}</p></div>
    {newRun && <NewRun campaign={campaign} continent={continent} place={place} onClose={() => setNewRun(false)} />}
  </div>
}
