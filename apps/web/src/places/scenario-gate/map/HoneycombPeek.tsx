import { nearestSpring, openFightOf, springReadyAt, type HoneyTile, type TierWorld, type WorldContinent } from '@rpg/domain'
import { useState } from 'react'
import type { Campaign } from '../../../battle/campaign'
import { formatLevel, formatLevels } from '../../../battle/labels'
import { drinkAtSpring } from '../../../save/game'
import { BottomSheet } from '../../../ui/BottomSheet'
import { formatDuration } from '../../../ui/useNow'
import { RunFaces } from '../capital/RunBits'
import { runName, runPath } from '../capital/capital-view'
import { capitalSeats, mapDate, type RunSeat } from './honeycomb-view'

export function HoneycombPeek({ tile, world, continent, campaign, now, onClose, onEnter }: {
  tile: HoneyTile; world: TierWorld; continent: WorldContinent; campaign: Campaign; now: string
  onClose: () => void; onEnter: (path: string) => void
}) {
  const [error, setError] = useState<string | null>(null), [busy, setBusy] = useState(false)
  const region = continent.regions.find((r) => r.id === tile.id)
  const seats = capitalSeats(world, continent.id), seat = tile.kind === 'seat' ? seats[(tile.seat ?? 1) - 1] : undefined
  const title = region?.name ?? (tile.kind === 'spring' ? `Spring ${tile.id?.split('spring')[1]}` : seat ? runName(seat.id) : `${continent.name} · Capital`)
  const ready = tile.kind === 'spring' ? springReadyAt(world, tile.id!, now) : null
  const enter = (path: string) => { onClose(); onEnter(path) }
  const refill = async () => {
    setBusy(true); setError(null)
    try { await drinkAtSpring(tile.id!) } catch (e) { setError(e instanceof Error ? e.message : 'Cannot refill') }
    finally { setBusy(false) }
  }
  const buttonClass = 'min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40'
  const footer = region ? <button type="button" className={buttonClass} onClick={() => enter(`r/${region.id}`)}>Enter</button>
    : tile.kind === 'spring' ? <button type="button" className={buttonClass} disabled={busy || !!ready || !!openFightOf(world)} onClick={() => void refill()}>Refill</button>
      : <button type="button" className={buttonClass} onClick={() => enter(seat && !seat.won ? runPath(continent.id, seat.id) : `capital/${continent.id}`)}>{seat && !seat.won ? 'Open run' : 'Open capital'}</button>
  const won = region ? Array.from({ length: 12 }, (_, i) => world.world.run.wins[`${region.id}-s${i + 1}`] ?? 0).filter((n) => n > 0).length : 0
  const teams = region ? world.regionTeams?.[region.id] : undefined
  const next = region ? campaign.region(region.id)?.nodes.find((n) => n.kind !== 'camp' && !world.world.run.wins[n.id]) : undefined
  const recent = world.capitals?.[continent.id]?.recent ?? []
  const runsWon = world.capitals?.[continent.id]?.won ?? 0
  const runs: RunSeat[] = [...(world.capitalRuns ?? []).filter((r) => r.continent === continent.id).map((r) => seats.find((s) => s.id === r.id)!),
    ...recent.map((r) => ({ id: r.id, won: true, at: r.wonAt, lanes: r.lanes, progress: 16 }))]
  return <BottomSheet title={title} onClose={onClose} footer={footer}>
    <div className="space-y-3" data-honey-peek={tile.kind}>
      {region ? <>
        <p className="text-[13px] text-ink-soft">{formatLevels(region.level, region.levelTop)} · {won}/12</p>
        {(['claim', 'clear'] as const).map((kind) => teams?.[kind] && <div key={kind}>
          <p className="mb-1 text-[13px] font-semibold">{kind === 'claim' ? 'Claimed' : 'Cleared'} · {mapDate(teams[kind]!.at)}</p>
          <RunFaces ids={teams[kind]!.umas} campaign={campaign} size={40} />
        </div>)}
        {!teams?.clear && (world.world.run.wins[`${region.id}-s12`] ?? 0) > 0 && <p className="text-[13px] font-semibold">Cleared ✓</p>}
        {next && <div><h3 className="text-micro">Next</h3><p className="text-[13px]">{next.name} · {formatLevel(next.level)}</p></div>}
      </> : tile.kind === 'spring' ? <>
        <p className="font-semibold">{ready ? formatDuration(Date.parse(ready) - Date.parse(now)) : 'Ready'}</p>
        <ul className="grid grid-cols-2 gap-2 text-[13px] text-ink-soft" aria-label="Regions served">
          {continent.regions.filter((r) => nearestSpring(continent, r.id) === tile.id).map((r) => <li key={r.id}>{r.name}</li>)}
        </ul>
      </> : <>
        <p className="text-[13px] text-ink-soft">{formatLevel(continent.levelStart + 9)} · {runsWon} {runsWon === 1 ? 'run' : 'runs'} won</p>
        {(seat ? [seat] : runs).map((r) => <section key={r.id} className="space-y-2 border-t border-hairline pt-2">
          <h3 className="text-[13px] font-semibold">{runName(r.id)} · {r.won ? `✓ ${mapDate(r.at!)}` : `${r.progress}/16`}</h3>
          {r.lanes.map((ids, i) => <div key={i}><span className="mb-1 block text-[11px] text-ink-soft">Lane {i + 1}</span><RunFaces ids={ids} campaign={campaign} size={36} /></div>)}
        </section>)}
        {runs.length === 0 && <p className="text-[13px] text-ink-soft">No runs yet</p>}
      </>}
      {error && <p role="alert" className="text-[13px] text-danger">{error}</p>}
    </div>
  </BottomSheet>
}
