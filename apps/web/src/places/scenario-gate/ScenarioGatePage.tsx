// The Scenario Gate opens the world map (D66): five continents, one per scenario of the tier, each ten levels of biome
// regions with Springs between them; a region's twelve stages; the open fight. Routes: `` (world), `c/<continent>`,
// `r/<region>`, `fight`. Plain art first (owner: something quick to see and give feedback on).
import { biomeById, openFightOf, springReadyAt, worldRun, SaveRuleError, type FightResult as Result, type WorldContinent } from '@rpg/domain'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CampaignGate, type Campaign } from '../../battle/campaign'
import { pagePath, useHubNavigation } from '../../hub/navigation'
import { AtlasSprite } from '../../master/art'
import { beginFight, drinkAtSpring, useWorld } from '../../save/game'
import { LockIcon } from '../../ui/icons'
import { formatDuration, useNow } from '../../ui/useNow'
import type { PageProps } from '../registry'
import { ActivePartyBar } from './ActiveParty'
import { FightResult } from './FightResult'
import { FightScreen } from './FightScreen'
import { RegionMap } from './RegionMap'

export default function ScenarioGatePage({ place, rest }: PageProps) {
  const [kind, id] = rest.split('/')
  return (
    <CampaignGate>
      {(campaign) => {
        if (kind === 'fight') return <FightRoute campaign={campaign} place={place} />
        if (kind === 'r' && id) {
          const region = campaign.region(id)
          return region ? <RegionMap campaign={campaign} region={region} place={place} /> : <p className="p-4 text-ink-soft">That region isn’t on the map.</p>
        }
        if (kind === 'c' && id) {
          const continent = campaign.continents.find((c) => c.id === id)
          return continent ? <ContinentMap campaign={campaign} continent={continent} place={place} /> : <p className="p-4 text-ink-soft">That continent isn’t on the map.</p>
        }
        return <WorldMap campaign={campaign} place={place} />
      }}
    </CampaignGate>
  )
}

/** Stages won per region id, from the world's run. */
function clearedByRegion(wins: Record<string, number>): Map<string, number> {
  const out = new Map<string, number>()
  for (const [stage, n] of Object.entries(wins)) {
    if (n < 1 || stage === 'start') continue
    const region = stage.replace(/-s\d+$/, '')
    out.set(region, (out.get(region) ?? 0) + 1)
  }
  return out
}

function ResumeFight({ place }: { place: PageProps['place'] }) {
  const world = useWorld()
  const nav = useHubNavigation()
  if (!world || !openFightOf(world)) return null
  return (
    <button type="button" onClick={() => nav.sub(place, 'fight')} className="flex min-h-11 w-full items-center justify-center rounded-sm bg-accent font-display font-bold text-accent-ink">
      Resume the open fight
    </button>
  )
}

function WorldMap({ campaign, place }: { campaign: Campaign; place: PageProps['place'] }) {
  const world = useWorld()
  const nav = useHubNavigation()
  if (!world) return null
  const cleared = clearedByRegion(worldRun(world).wins)
  const later = [...new Set(campaign.view.chapters.filter((c) => c.tier > 1).map((c) => c.tier))]
  return (
    <div className="space-y-4 p-4">
      <ActivePartyBar campaign={campaign} />
      <ResumeFight place={place} />
      <section>
        <h3 className="text-micro mb-2">Tier 1 · five continents</h3>
        <ul className="space-y-2">
          {campaign.continents.map((c) => {
            const info = campaign.view.chapters.find((x) => x.tier === 1 && x.order === c.order)
            const won = c.regions.reduce((n, r) => n + (cleared.get(r.id) ?? 0), 0)
            return (
              <li key={c.id}>
                <button type="button" onClick={() => nav.sub(place, `c/${c.id}`)} className="flex w-full items-center gap-3 rounded-md border-l-4 bg-raised p-2.5 text-left active:bg-white/5" style={{ borderColor: info?.color }}>
                  {info && <AtlasSprite art={campaign.view.art} family="scenario-icons" frameKey={String(info.scenarioId)} size={44} label={`${c.name} crest`} />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-bold">{c.name}</p>
                    <p className="text-[12px] text-ink-soft">Lv {c.levelStart}–{c.levelStart + 9} · {won}/{c.regions.length * 12} stages cleared</p>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      {later.map((tier) => (
        <div key={tier} className="flex items-center gap-2 rounded-md bg-raised/60 p-3 text-[13px] text-ink-soft">
          <LockIcon size={16} className="text-locked" /> Tier {tier}: promote an Uma to reach it.
        </div>
      ))}
    </div>
  )
}

function ContinentMap({ campaign, continent, place }: { campaign: Campaign; continent: WorldContinent; place: PageProps['place'] }) {
  const world = useWorld()
  const nav = useHubNavigation()
  const now = useNow(30_000)
  const [error, setError] = useState<string | null>(null)
  if (!world) return null
  const cleared = clearedByRegion(worldRun(world).wins)
  const rows = Array.from({ length: 10 }, (_, row) => row)
  return (
    <div>
      <div className="sticky top-0 z-10 space-y-2 border-b border-hairline bg-page/95 p-3 backdrop-blur">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="truncate font-display text-lg font-bold">{continent.name}</h2>
          <span className="shrink-0 text-[12px] text-ink-soft">Lv {continent.levelStart}–{continent.levelStart + 9}</span>
        </div>
        <ActivePartyBar campaign={campaign} />
        <ResumeFight place={place} />
        {error && <p className="text-[12px] text-danger">{error}</p>}
      </div>
      <div className="space-y-2 p-3">
        {rows.map((row) => {
          const spring = continent.springs.find((s) => s.row === row)
          const ready = spring ? springReadyAt(world, spring.id, now) : null
          return (
            <div key={row} className="space-y-2">
              {spring && (
                <button type="button" disabled={!!ready || !!openFightOf(world)}
                  onClick={() => drinkAtSpring(spring.id).then(() => setError(null), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'The Spring didn’t answer.'))}
                  className="flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-[#5aa6f0]/60 bg-[#5aa6f0]/10 text-[13px] font-semibold text-[#8cc4ff] disabled:opacity-50">
                  ◆ Spring · {ready ? `recharges in ${formatDuration(Date.parse(ready) - Date.parse(now))}` : 'refill the party’s MP'}
                </button>
              )}
              <div className="flex items-stretch gap-1.5">
                <span className="flex w-10 shrink-0 items-center justify-center rounded-sm bg-panel font-display text-[12px] font-bold text-ink-soft">Lv{continent.levelStart + row}</span>
                <div className="grid flex-1 grid-cols-2 gap-1.5">
                  {continent.regions.filter((r) => r.row === row).map((r) => {
                    const biome = biomeById(r.biome)
                    const won = cleared.get(r.id) ?? 0
                    return (
                      <button key={r.id} type="button" onClick={() => nav.sub(place, `r/${r.id}`)}
                        className="min-h-14 rounded-sm border-l-4 bg-raised px-2 py-1.5 text-left active:bg-white/5" style={{ borderColor: biome.color, background: `color-mix(in srgb, ${biome.color} 18%, var(--color-raised, #1b2533))` }}>
                        <span className="block truncate text-[13px] font-semibold">{r.name}</span>
                        <span className="block text-[11px] text-ink-soft">{won === 12 ? 'Cleared ✓' : `${won}/12`}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
        <p className="rounded-md bg-panel p-3 text-center text-[12px] text-ink-faint">Capital · Lv {continent.levelStart + 9}: the scenario’s Finals arrive in a later step.</p>
      </div>
    </div>
  )
}

function FightRoute({ campaign, place }: { campaign: Campaign; place: PageProps['place'] }) {
  const world = useWorld()
  const navigate = useNavigate()
  const [ended, setEnded] = useState<{ result: Result; nodeId: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const run = world ? openFightOf(world) : null
  const regionId = (ended?.nodeId ?? run?.battle?.nodeId ?? '').replace(/-s\d+$/, '')
  const region = regionId ? campaign.region(regionId) : null
  const toRegion = () => navigate(pagePath(place, region ? `r/${region.id}` : ''), { replace: true })
  if (!region) return <p className="p-4 text-ink-soft">No fight is open.</p>
  if (ended) {
    return (
      <>
        <FightResult campaign={campaign} chapter={region} result={ended.result} onMap={toRegion}
          onAgain={() => {
            beginFight(region, ended.nodeId, campaign.outfits).then(() => setEnded(null), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'The fight couldn’t start.'))
          }} />
        {error && <p className="fixed inset-x-0 bottom-24 z-50 mx-4 rounded-sm bg-danger/90 p-2 text-center text-[13px]">{error}</p>}
      </>
    )
  }
  return <FightScreen key={run?.battle?.battleId ?? 'none'} campaign={campaign} chapter={region} onMap={toRegion} onEnd={(result, nodeId) => setEnded({ result, nodeId })} />
}
