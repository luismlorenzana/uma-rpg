import { MasterGate } from '../MasterGate'

/** The Scenario Gate's quick look: Tier 1's world map at a glance. */
export default function ScenarioGatePeek() {
  return (
    <MasterGate>
      {(view) => {
        const tier1 = view.chapters.filter((c) => c.tier === 1)
        return (
          <div className="space-y-3 p-4">
            <p className="text-[15px] leading-relaxed text-ink">The world map: a continent per scenario, ten levels each, 480 stages each.</p>
            <ul className="space-y-1.5">
              {tier1.map((c) => (
                <li key={c.scenarioId} className="flex items-center justify-between rounded-sm border-l-4 bg-raised px-3 py-2 text-[13px]" style={{ borderColor: c.color }}>
                  <span className="truncate font-semibold">{c.name}</span>
                  <span className="shrink-0 text-ink-faint">Lv {c.levelBand[0]}–{c.levelBand[1]}</span>
                </li>
              ))}
            </ul>
            <p className="text-[12px] text-ink-faint">Pick a region and fight PriConne rivals with your active party for EXP, Shards, Laurels and tokens. Springs refill MP.</p>
          </div>
        )
      }}
    </MasterGate>
  )
}
