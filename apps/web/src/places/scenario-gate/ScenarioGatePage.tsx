// The Scenario Gate opens the active tier's world map (D66, D97, H35): five continents, one per scenario of the tier, each ten levels of
// biome regions with Springs between them, the lower rows climbing its first five levels and the upper its last five; a region's twelve stages; the open fight. Routes: `` (world), `c/<continent>`,
// `r/<region>`, `capital/<continent>`, `fight`. Canvas maps keep the complete lists one tap away.
import { biomeById, capitalId, capitalStageIds, openFightOf, rpgFinals, springReadyAt, tierKey, worldRun, SaveRuleError, type FightResult as Result, type WorldContinent } from '@rpg/domain'
import { AtlasSprite } from '@luismlorenzana/uma-kit/content'
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { CampaignGate, type Campaign } from '../../battle/campaign'
import { formatLevel, formatLevels } from '../../battle/labels'
import { pagePath, useHubNavigation } from '../../hub/navigation'
import { beginFight, drinkAtSpring, useGame, useWorld } from '../../save/game'
import { LockIcon } from '../../ui/icons'
import { formatDuration, useNow } from '../../ui/useNow'
import type { PageProps } from '../registry'
import { ActivePartyBar } from './ActiveParty'
import { CapitalMap } from './CapitalMap'
import { FightResult } from './FightResult'
import { FightScreen } from './FightScreen'
import { clearedIn, continentBandY, continentLayout, worldLayout } from './map/layout'
import { BiomeIcon, MapCanvas } from './map/MapCanvas'
import { MapViewSwitch, useMapView } from './map/MapView'
import { RegionMap } from './RegionMap'

export default function ScenarioGatePage({ place, rest }: PageProps) {
  const [kind, id] = rest.split('/')
  return (
    <CampaignGate>
      {(campaign) => {
        if (kind === 'fight') return <FightRoute campaign={campaign} place={place} />
        if (kind === 'capital' && id) {
          const continent = campaign.continents.find((c) => c.id === id)
          return continent ? <CapitalMap campaign={campaign} continent={continent} place={place} /> : <p className="p-4 text-ink-soft">Capital not found.</p>
        }
        if (kind === 'r' && id) {
          const region = campaign.regionInfo(id) ? campaign.region(id) : null
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

/** A count of continents in words: "five", or "four" for a partial tier (T9). */
const COUNT_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
const continentCount = (n: number) => `${COUNT_WORDS[n] ?? n} continent${n === 1 ? '' : 's'}`

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
  const worlds = useGame((s) => s.save?.tierWorlds)
  const nav = useHubNavigation()
  const [view, setView] = useMapView()
  const wins = world ? worldRun(world).wins : undefined
  const layout = useMemo(() => worldLayout(campaign.continents, { wins: wins ?? {} }), [campaign.continents, wins])
  if (!world) return null
  const cleared = clearedByRegion(worldRun(world).wins)
  // Locks: the tiers above this one that have no world yet (one opens with its first promotion).
  const later = [...new Set(campaign.view.chapters.filter((c) => c.tier > campaign.tier).map((c) => c.tier))].filter((t) => !worlds?.[tierKey(t)])
  return (
    <div>
      <div data-map-header className="sticky top-0 z-10 space-y-2 border-b border-hairline bg-page/95 p-3 backdrop-blur">
        <h2 className="font-display text-lg font-bold">World</h2>
        <MapViewSwitch view={view} onChange={setView} />
        <ActivePartyBar campaign={campaign} />
        <ResumeFight place={place} />
      </div>
      {view === 'map' ? <MapCanvas layout={layout} focusKey="world" focusId={campaign.continents[0]?.id}
        onSpot={(spot) => nav.sub(place, `c/${spot.id}`)} describe={(spot) => {
          const c = campaign.continents.find((c) => c.id === spot.id)!, info = campaign.view.chapters.find((ch) => ch.tier === campaign.tier && ch.order === c.order)
          const won = c.regions.reduce((n, r) => n + clearedIn(r.id, { wins: wins! }), 0)
          return { label: `${c.name}, ${formatLevels(c.levelStart, c.levelStart + 9)}, ${won} of 480 cleared`, content: <span className="absolute inset-x-0 bottom-0 flex items-center gap-1 rounded-sm bg-page/90 p-1 text-left">
            {info && campaign.view.art && <AtlasSprite art={campaign.view.art} family="scenario-icons" frameKey={String(info.scenarioId)} size={24} />}
            <span className="min-w-0"><span className="block text-[10px] font-bold">{c.name}</span><span className="block text-[10px] text-ink-soft">{formatLevels(c.levelStart, c.levelStart + 9)} · {won}/480</span></span>
          </span> }
        }} /> : <section className="p-3">
        <h3 className="text-micro mb-2">Tier {campaign.tier} · {continentCount(campaign.continents.length)}</h3>
        <ul className="space-y-2">
          {campaign.continents.map((c) => {
            const info = campaign.view.chapters.find((x) => x.tier === campaign.tier && x.order === c.order)
            const won = c.regions.reduce((n, r) => n + (cleared.get(r.id) ?? 0), 0)
            return (
              <li key={c.id}>
                <button type="button" onClick={() => nav.sub(place, `c/${c.id}`)} className="flex w-full items-center gap-3 rounded-md border-l-4 bg-raised p-2.5 text-left active:bg-white/5" style={{ borderColor: info?.color }}>
                  {info && <AtlasSprite art={campaign.view.art} family="scenario-icons" frameKey={String(info.scenarioId)} size={44} label={`${c.name} crest`} />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-bold">{c.name}</p>
                    <p className="text-[12px] text-ink-soft">{formatLevels(c.levelStart, c.levelStart + 9)} · {won}/{c.regions.length * 12} stages cleared</p>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </section>}
      {later.map((tier) => (
        <div key={tier} className="flex items-center gap-2 rounded-md bg-raised/60 p-3 text-[13px] text-ink-soft">
          <LockIcon size={16} className="text-locked" /> Tier {tier} locked
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
  const [view, setView] = useMapView()
  const wins = world ? worldRun(world).wins : undefined
  const dryIds = world ? continent.springs.filter((s) => springReadyAt(world, s.id, now)).map((s) => s.id).join(',') : ''
  const layout = useMemo(() => continentLayout(continent, { wins: wins ?? {}, drySprings: new Set(dryIds.split(',')) }), [continent, wins, dryIds])
  if (!world) return null
  const cleared = clearedByRegion(worldRun(world).wins)
  const rows = Array.from({ length: 10 }, (_, row) => row)
  const finals = rpgFinals(continent.order)
  const wonFinals = finals.routes.flatMap((_, i) => Object.values(capitalStageIds(continent.id, i + 1)))
    .filter((id) => (worldRun(world).wins[id] ?? 0) > 0).length
  return (
    <div>
      <div data-map-header className="sticky top-0 z-10 space-y-2 border-b border-hairline bg-page/95 p-3 backdrop-blur">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="truncate font-display text-lg font-bold">{continent.name}</h2>
          <span className="shrink-0 text-[12px] text-ink-soft">{formatLevels(continent.levelStart, continent.levelStart + 9)}</span>
        </div>
        <MapViewSwitch view={view} onChange={setView} />
        <ActivePartyBar campaign={campaign} />
        <ResumeFight place={place} />
        {error && <p className="text-[12px] text-danger">{error}</p>}
      </div>
      {view === 'map' ? <MapCanvas layout={layout} focusKey={continent.id} focusId={layout.frontier ?? continent.id}
        onSpot={(spot) => {
          if (spot.kind === 'region') nav.sub(place, `r/${spot.id}`)
          else if (spot.kind === 'capital') nav.sub(place, `capital/${continent.id}`)
          else void drinkAtSpring(spot.id).then(() => setError(null), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'The Spring didn’t answer.'))
        }} describe={(spot) => {
          if (spot.kind === 'capital') return { label: `${continent.name}, Capital, ${formatLevel(continent.levelStart + 9)}, ${wonFinals} of 6 cleared`, content: <span className="absolute inset-x-0 bottom-0 rounded-xs bg-page/90 text-[11px] font-bold">Capital · {wonFinals}/6</span> }
          if (spot.kind === 'spring') {
            const ready = springReadyAt(world, spot.id, now)
            return { label: ready ? `Spring, recharges in ${formatDuration(Date.parse(ready) - Date.parse(now))}` : 'Spring, refill party MP', disabled: !!ready || !!openFightOf(world) }
          }
          const r = continent.regions.find((r) => r.id === spot.id)!, won = cleared.get(r.id) ?? 0
          return { label: `${r.name}, ${formatLevels(r.level, r.levelTop)}, ${won} of 12 cleared`, content: <><span className="absolute inset-x-0 top-0 rounded-xs bg-page/80 px-0.5 text-center text-[10px] font-semibold leading-tight">{r.name}</span><span className="absolute bottom-0 right-0 rounded-xs bg-page/85 px-1 text-[10px] text-ink-soft">{won}/12</span></> }
        }}>
        {[0, 5].map((row) => <h3 key={row} className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-page/90 px-2 text-[11px] font-bold" style={{ top: `${(continentBandY(row) + 3) / layout.rows * 100}%` }}>{formatLevels(continent.levelStart + (row === 0 ? 0 : 5), continent.levelStart + (row === 0 ? 4 : 9))}</h3>)}
      </MapCanvas> : <div className="space-y-2 p-3">
        {rows.map((row) => {
          const spring = continent.springs.find((s) => s.row === row)
          const ready = spring ? springReadyAt(world, spring.id, now) : null
          // A heading where the climb changes: the first five levels, then the last five (D97).
          const first = continent.regions.find((r) => r.row === row)
          const below = continent.regions.find((r) => r.row === row - 1)
          return (
            <div key={row} className="space-y-2">
              {first && first.level !== below?.level && (
                <h3 className="pt-1 font-display text-[13px] font-bold text-ink-soft">{formatLevels(first.level, first.levelTop)}</h3>
              )}
              {spring && (
                <button type="button" disabled={!!ready || !!openFightOf(world)}
                  onClick={() => drinkAtSpring(spring.id).then(() => setError(null), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'The Spring didn’t answer.'))}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#5aa6f0]/60 bg-[#5aa6f0]/10 text-[13px] font-semibold text-[#8cc4ff] disabled:opacity-50">
                  ◆ Spring · {ready ? `recharges in ${formatDuration(Date.parse(ready) - Date.parse(now))}` : 'refill the party’s MP'}
                </button>
              )}
              <div>
                <div className="grid grid-cols-2 gap-1.5">
                  {continent.regions.filter((r) => r.row === row).map((r) => {
                    const biome = biomeById(r.biome)
                    const won = cleared.get(r.id) ?? 0
                    return (
                      <button key={r.id} type="button" onClick={() => nav.sub(place, `r/${r.id}`)}
                        className="min-h-14 rounded-sm border-l-4 bg-raised px-2 py-1.5 text-left active:bg-white/5" style={{ borderColor: biome.color, background: `color-mix(in srgb, ${biome.color} 18%, var(--color-raised, #1b2533))` }}>
                        <span className="flex items-center gap-1 text-[13px] font-semibold"><BiomeIcon biome={r.biome} /><span className="truncate">{r.name}</span></span>
                        <span className="block text-[11px] text-ink-soft">{won === 12 ? 'Cleared ✓' : `${won}/12`}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
        <button type="button" onClick={() => nav.sub(place, `capital/${continent.id}`)}
          className="flex min-h-14 w-full items-center justify-between gap-2 rounded-md border border-accent/50 bg-raised p-3 text-left">
          <span><span className="block font-display font-bold">{continent.name}</span><span className="block text-[12px] text-ink-soft">Capital · {formatLevel(continent.levelStart + 9)}</span></span>
          <span className="text-[12px] text-ink-soft">{wonFinals}/6</span>
        </button>
      </div>}
    </div>
  )
}

function FightRoute({ campaign, place }: { campaign: Campaign; place: PageProps['place'] }) {
  const world = useWorld()
  const navigate = useNavigate()
  const [ended, setEnded] = useState<{ result: Result; nodeId: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const run = world ? openFightOf(world) : null
  // The last action settles the fight in the save at once, while its cues still play. Keep showing the fight it was, so
  // the screen isn't remounted mid-animation; its own onEnd then brings up the result.
  const shownFight = useRef<{ battleId: string; nodeId: string } | null>(null)
  if (run?.battle) shownFight.current = { battleId: run.battle.battleId, nodeId: run.battle.nodeId }
  const fight = run?.battle ?? shownFight.current
  const stageId = ended?.nodeId ?? fight?.nodeId
  const region = stageId ? campaign.stageRegion(stageId) : null
  const capital = campaign.continents.find((c) => capitalId(c.id) === region?.id)
  const toRegion = () => navigate(pagePath(place, capital ? `capital/${capital.id}` : region ? `r/${region.id}` : ''), { replace: true })
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
  return <FightScreen key={fight?.battleId ?? 'none'} campaign={campaign} chapter={region} onMap={toRegion} onEnd={(result, nodeId) => setEnded({ result, nodeId })} />
}
