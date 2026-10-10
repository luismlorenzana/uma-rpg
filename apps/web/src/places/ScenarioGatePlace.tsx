// The Scenario Gate (S1): Tier 1's chapters with crest and level band; later tiers locked. Battles arrive in S3.
import { AtlasSprite } from '../master/art'
import { MasterGate } from './MasterGate'
import { LockIcon } from '../ui/icons'

export default function ScenarioGatePlace() {
  return (
    <MasterGate>
      {(view) => {
        const tiers = [...new Set(view.chapters.map((c) => c.tier))].sort((a, b) => a - b)
        return (
          <div className="space-y-5 p-4">
            {tiers.map((tier) => {
              const chapters = view.chapters.filter((c) => c.tier === tier)
              const open = tier === 1
              return (
                <section key={tier}>
                  <h3 className="text-micro mb-2">
                    Tier {tier} {!open && '· locked'}
                  </h3>
                  {open ? (
                    <ul className="space-y-2">
                      {chapters.map((c) => (
                        <li key={c.scenarioId} className="flex items-center gap-3 rounded-md border-l-4 bg-raised p-2.5" style={{ borderColor: c.color }}>
                          <AtlasSprite art={view.art} family="scenario-icons" frameKey={String(c.scenarioId)} size={44} label={`${c.name} crest`} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display font-bold">{c.name}</p>
                            <p className="text-[12px] text-ink-soft">
                              Chapter {c.order} · Lv {c.levelBand[0]}–{c.levelBand[1]}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-sunken px-2 py-0.5 text-[11px] font-bold text-ink-faint">S3</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-2 rounded-md bg-raised/60 p-3 text-[13px] text-ink-soft">
                      <LockIcon size={16} className="text-locked" />
                      <span>
                        {chapters.map((c) => c.name).join(' · ')}
                        {chapters.length < 5 && ' · next scenario'} — promote an Uma to reach Tier {tier}.
                      </span>
                    </div>
                  )}
                </section>
              )
            })}
            <p className="text-center text-[12px] text-ink-faint">Battles open in S3.</p>
          </div>
        )
      }}
    </MasterGate>
  )
}
