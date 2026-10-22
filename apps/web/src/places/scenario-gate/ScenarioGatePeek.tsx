import { rpgChapterLevelStart } from '@rpg/domain'
import { formatLevels } from '../../battle/labels'
import { useActiveTier } from '../../save/game'
import { MasterGate } from '../MasterGate'

/** The Scenario Gate's quick look: the active tier's world map at a glance. */
export default function ScenarioGatePeek() {
  const tier = useActiveTier()
  return (
    <MasterGate>
      {(view) => {
        const chapters = view.chapters.filter((c) => c.tier === tier)
        return (
          <div className="space-y-3 p-4">
            <ul className="space-y-1.5">
              {chapters.map((c) => {
                // Lifetime levels: Tier 1 reads "Lv 1–10", Tier 2 "T2 Lv 1–10".
                const start = rpgChapterLevelStart(c.order)
                return (
                  <li key={c.scenarioId} className="flex items-center justify-between rounded-sm border-l-4 bg-raised px-3 py-2 text-[13px]" style={{ borderColor: c.color }}>
                    <span className="truncate font-semibold">{c.name}</span>
                    <span className="shrink-0 text-ink-faint">{formatLevels(start, start + 9)}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      }}
    </MasterGate>
  )
}
