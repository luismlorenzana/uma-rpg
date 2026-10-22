// A region (D66, D97): one biome climbing five levels, its twelve stages on a path. Stages open in order and stay open for replays;
// progress is the world's, whichever party won. Tap a stage for its rivals, then fight with the active party.
import {
  biomeById, healerBlock, openFightOf, rpgNodeStatus, SaveRuleError, springReadyAt, sweepBlock, worldRun, type FightResult as Result, type RpgCampaignChapter, type RpgElement,
  type RpgMapNode, type RpgNodeStatus,
} from '@rpg/domain'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Campaign } from '../../battle/campaign'
import { CastFace } from '../../battle/CastFace'
import { FoeRow } from '../../battle/FoeRow'
import { ElementGlyph, formatLevel, formatLevels } from '../../battle/labels'
import { useHubNavigation } from '../../hub/navigation'
import { beginFight, drinkAtSpring, sweep, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { LockIcon } from '../../ui/icons'
import { formatDuration, useNow } from '../../ui/useNow'
import type { PageProps } from '../registry'
import { ActivePartyBar } from './ActiveParty'
import { regionLayout, springForRegion } from './map/layout'
import { BiomeIcon, MapCanvas } from './map/MapCanvas'
import { MapViewSwitch, useMapView } from './map/MapView'
import { FightResult } from './FightResult'

/** The elements a stage's foes carry: one, or a pair. */
const signatureOf = (n: RpgMapNode): RpgElement[] => (n.note ? (n.note.split(' + ') as RpgElement[]) : n.element ? [n.element] : [])

export function RegionMap({ campaign, region, place }: { campaign: Campaign; region: RpgCampaignChapter; place: PageProps['place'] }) {
  const info = campaign.regionInfo(region.id)!
  return <StageMap campaign={campaign} region={region} place={place} title={info.name}
    levels={formatLevels(info.level, info.levelTop)} color={biomeById(info.biome).color} />
}

/** Regions and capital routes share stage choices, rival sheets, fight entry and sweep results. */
export function StageMap({ campaign, region, place, title, levels, color, capital = false, renderStages }: {
  campaign: Campaign; region: RpgCampaignChapter; place: PageProps['place']; title: string; levels: string; color: string
  capital?: boolean; renderStages?: (choice: (node: RpgMapNode, index: number) => ReactNode) => ReactNode
}) {
  const world = useWorld()
  const nav = useHubNavigation()
  const [open, setOpen] = useState<RpgMapNode | null>(null)
  const [swept, setSwept] = useState<{ result: Result; nodeId: string } | null>(null)
  const [sweepFor, setSweepFor] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useMapView()
  const info = campaign.regionInfo(region.id)
  const now = useNow(30_000)
  const spring = info ? springForRegion(campaign.continents.find((c) => c.id === info.continentId), info) : undefined
  const readyAt = world && spring ? springReadyAt(world, spring.id, now) : null, dry = !!readyAt
  const wins = world ? worldRun(world).wins : undefined
  const layout = useMemo(() => info && wins ? regionLayout(info,
    { wins, drySprings: new Set(dry && spring ? [spring.id] : []) }, spring?.id) : null, [info, wins, dry, spring?.id])
  // A continent's capital sits at the end of its scroll. Enter its routes at the top, not at that inherited offset.
  useEffect(() => {
    if (!capital) return
    let parent = mapRef.current?.parentElement
    while (parent && !/auto|scroll/.test(getComputedStyle(parent).overflowY)) parent = parent.parentElement
    if (parent) parent.scrollTop = 0
  }, [region.id, capital, !!world])
  if (!world) return null
  const run = worldRun(world)
  const fightOpen = openFightOf(world)
  // Classes v2 (C8): the active party fights with one healer at most; the button says why it can't (H59).
  const healers = healerBlock(world, (world.parties[world.world.activeParty]?.slots ?? []).filter((s): s is string => s !== null), campaign.outfits)
  const springLabel = readyAt ? `Spring, recharges in ${formatDuration(Date.parse(readyAt) - Date.parse(now))}` : 'Spring, refill party MP'
  const drink = async () => {
    if (!spring) return
    try { await drinkAtSpring(spring.id); setError(null) }
    catch (err) { setError(err instanceof SaveRuleError ? err.message : 'The Spring didn’t answer.') }
  }
  const status = (id: string): RpgNodeStatus => rpgNodeStatus(region, run, id)
  const stages = region.nodes.filter((n) => n.kind !== 'camp')
  const cleared = stages.filter((n) => (run.wins[n.id] ?? 0) > 0).length
  const fight = async (node: RpgMapNode) => {
    setError(null)
    try {
      await beginFight(region, node.id, campaign.outfits)
      setOpen(null)
      nav.sub(place, 'fight')
    } catch (err) {
      setError(err instanceof SaveRuleError ? err.message : 'The fight couldn’t start.')
    }
  }
  const doSweep = async (nodeId: string, times = 1) => {
    setError(null)
    try {
      const result = await sweep(region, nodeId, campaign.outfits, times)
      setOpen(null)
      setSweepFor(null)
      setSwept({ result, nodeId })
    } catch (err) {
      setError(err instanceof SaveRuleError ? err.message : 'Couldn’t sweep.')
    }
  }
  const choice = (n: RpgMapNode, i: number) => {
    const s = status(n.id), wins = run.wins[n.id] ?? 0
    // Waves (W3): the boss leads her last wave.
    const waves = [n.enemies, ...(n.waves ?? [])]
    const foes = waves.reduce((sum, w) => sum + w.length, 0)
    const lead = n.kind !== 'fight' ? waves.at(-1)![0]?.castId : undefined
    return (
      <button type="button" onClick={() => setOpen(n)} aria-label={`Stage ${i + 1}, ${n.name}, ${s}`}
        className={`flex min-h-11 w-full items-center gap-3 rounded-md p-2.5 text-left ${s === 'locked' ? 'bg-sunken opacity-55' : 'bg-raised'} ${s === 'available' ? 'ring-1 ring-ink/60' : ''}`}>
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full font-display text-[15px] font-bold ${s === 'cleared' ? 'bg-accent/30 text-accent' : 'bg-panel'}`}>
          {lead ? <CastFace campaign={campaign} castId={lead} size={36} /> : i + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold">{capital ? n.kind === 'boss' ? 'Champion ★' : 'Vanguard ♛' : `${n.name}${n.kind === 'boss' ? ' ★' : n.kind === 'sub-boss' ? ' ♛' : ''}`}</span>
          <span className="flex items-center gap-1 text-[12px] text-ink-soft">
            {signatureOf(n).map((e) => <ElementGlyph key={e} element={e} size={14} />)}
            <span>{formatLevel(n.level)} · {waves.length > 1 ? `${waves.length} waves · ` : ''}{foes} foe{foes > 1 ? 's' : ''}</span>
          </span>
        </span>
        <span className="shrink-0 text-[12px] text-ink-faint">{s === 'cleared' ? `✓${wins > 1 ? ` ×${wins}` : ''}` : s === 'locked' ? 'locked' : 'open'}</span>
      </button>
    )
  }
  return (
    <div ref={mapRef}>
      <div data-map-header className="sticky top-0 z-10 space-y-2 border-b border-hairline bg-page/95 p-3 backdrop-blur" style={{ borderTop: `4px solid ${color}` }}>
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="flex min-w-0 items-center gap-1 font-display text-lg font-bold">{info && <BiomeIcon biome={info.biome} />}{title}</h2>
          <span className="shrink-0 text-[12px] text-ink-soft">{levels} · {cleared}/{stages.length} cleared</span>
        </div>
        {!capital && <div className="flex items-center gap-2">
          <MapViewSwitch view={view} onChange={setView} />
          {spring && <button type="button" aria-label={springLabel} disabled={dry || !!fightOpen}
            onClick={() => void drink()} className="flex min-h-11 flex-1 items-center justify-center rounded-sm border border-[#5aa6f0]/50 bg-[#5aa6f0]/10 px-2 text-[12px] font-semibold text-[#8cc4ff] disabled:opacity-50">
            Spring · {readyAt ? formatDuration(Date.parse(readyAt) - Date.parse(now)) : 'MP'}
          </button>}
        </div>}
        <ActivePartyBar campaign={campaign} />
        {error && !open && <p role="alert" className="text-[12px] text-danger">{error}</p>}
        {fightOpen?.battle && (
          <button type="button" onClick={() => nav.sub(place, 'fight')} className="flex min-h-11 w-full items-center justify-center rounded-sm bg-accent font-display font-bold text-accent-ink">
            Resume the open fight
          </button>
        )}
      </div>
      {renderStages ? renderStages(choice) : view === 'map' && layout ? <MapCanvas layout={layout} focusKey={region.id}
        focusId={layout.frontier ?? stages.at(-1)?.id} onSpot={(spot) => spot.kind === 'spring' ? void drink() : setOpen(stages.find((n) => n.id === spot.id)!)}
        describe={(spot) => {
          if (spot.kind === 'spring') return { label: springLabel, disabled: dry || !!fightOpen,
            content: <span className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xs bg-page/90 px-1 text-[11px] font-semibold">MP</span> }
          const node = stages.find((n) => n.id === spot.id)!, i = stages.indexOf(node), s = status(node.id)
          return { label: `Stage ${i + 1}, ${node.name}, ${formatLevel(node.level)}, ${s}`, content: <span className={`absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-xs bg-page/90 px-1 text-[11px] font-semibold ${s === 'cleared' ? 'text-ink-faint' : s === 'available' ? 'text-accent' : 'text-ink-soft'}`}>
            {s === 'cleared' ? <span aria-hidden="true">✓</span> : s === 'locked' ? <LockIcon size={10} /> : null}{i + 1} · {formatLevel(node.level)}</span> }
        }} /> : <ol className="space-y-2 p-3">
        {stages.map((n, i) => <li key={n.id}>{choice(n, i)}</li>)}
      </ol>}

      {open && (
        <BottomSheet title={open.name} onClose={() => { setOpen(null); setError(null) }} footer={
          <div className="flex gap-2">
            <button type="button" disabled={status(open.id) === 'locked' || !!fightOpen?.battle || !!healers} onClick={() => void fight(open)}
              className="min-h-12 flex-[2] rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
              {status(open.id) === 'locked' ? 'Locked' : fightOpen?.battle ? 'Fight open' : healers ?? (status(open.id) === 'cleared' ? 'Fight again' : 'Fight')}
            </button>
            {open.kind === 'fight' && status(open.id) === 'cleared' && (
              <button type="button" disabled={!!sweepBlock(world, region, open.id)} onClick={() => setSweepFor(open.id)}
                className="min-h-12 flex-1 rounded-sm border border-hairline-strong font-semibold disabled:opacity-40" aria-label={sweepBlock(world, region, open.id) ?? 'Sweep with a ticket'}>
                Sweep · {world.wallet.sweepTickets}
              </button>
            )}
          </div>
        }>
          <p className="mb-2 flex items-center gap-1 text-[13px] text-ink-soft">
            {formatLevel(open.level)} · {open.kind === 'boss' ? capital ? 'Champion' : 'Region boss' : open.kind === 'sub-boss' ? capital ? 'Vanguard' : 'Elite' : 'Stage'} ·
            {signatureOf(open).map((e) => <ElementGlyph key={e} element={e} size={14} />)}
            {open.waves?.length ? ` · ${open.waves.length + 1} waves` : ''}
          </p>
          {[open.enemies, ...(open.waves ?? [])].map((wave, w, all) => (
            <section key={w} className="mb-2">
              {all.length > 1 && <h3 className="text-micro mb-1">Wave {w + 1}</h3>}
              <ul className="space-y-1.5">
                {wave.map((e) => <FoeRow key={e.id} campaign={campaign} enemy={e} rank={e.rank} />)}
              </ul>
            </section>
          ))}
          {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
        </BottomSheet>
      )}
      {sweepFor && (
        <BottomSheet title="Sweep" onClose={() => setSweepFor(null)}>
          <div className="-mt-2 mb-1 flex items-center justify-between text-[13px] text-ink-soft">
            <span>Sweep Tickets: {world.wallet.sweepTickets}</span>
            <HelpButton title="Sweeps">
              <p>A sweep wins a cleared regular stage at once for one Sweep Ticket. It pays like a replay: a quarter of the first clear's EXP and Laurels, with Marks at a quarter of their chance. MP isn't used.</p>
            </HelpButton>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 5, 10, world.wallet.sweepTickets].filter((n, i, a) => n >= 1 && n <= world.wallet.sweepTickets && a.indexOf(n) === i).map((n) => (
              <button key={n} type="button" onClick={() => void doSweep(sweepFor, n)} className="min-h-12 rounded-sm bg-accent font-display font-bold text-accent-ink">
                {n === world.wallet.sweepTickets && n > 10 ? `All ${n}` : `×${n}`}
              </button>
            ))}
          </div>
          {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
        </BottomSheet>
      )}
      {swept && <FightResult campaign={campaign} chapter={region} result={swept.result} onMap={() => setSwept(null)} againLabel={`Sweep again · ${world.wallet.sweepTickets}`}
        onAgain={() => { if (!sweepBlock(world, region, swept.nodeId)) void sweep(region, swept.nodeId, campaign.outfits).then((result) => setSwept({ result, nodeId: swept.nodeId })) }} />}
    </div>
  )
}
