import { biomeById, honeycombState, honeycombXY, springReadyAt, TWIN_BOSS_ROW, type HoneyTile, type WorldContinent } from '@rpg/domain'
import { useAlbumArt } from '@luismlorenzana/uma-kit/album'
import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from 'react'
import type { Campaign } from '../../../battle/campaign'
import { formatLevels } from '../../../battle/labels'
import { useWorld } from '../../../save/game'
import { formatDuration, useNow } from '../../../ui/useNow'
import { runName } from '../capital/capital-view'
import { HoneycombPeek } from './HoneycombPeek'
import { capitalSeats, dotColor, fittedTransform, HEX_SIZE, hexPoints, hexProgress, honeycombFrontier, honeycombGeometry, type MapTransform } from './honeycomb-view'

const GLYPH: Record<string, string> = { meadow: 'tree', forest: 'tree', jungle: 'tree', coast: 'wave', swamp: 'wave', desert: 'sun', canyon: 'peak', volcano: 'flame', geyser: 'flame',
  peaks: 'peak', highlands: 'peak', glacier: 'crystal', crystal: 'crystal', tundra: 'snow', underworld: 'moon', moor: 'moon', sky: 'cloud', ruins: 'pillar', rift: 'star' }
const SHAPES: Record<string, string> = { tree: 'M0,-7 L6,2 L2,2 L2,7 L-2,7 L-2,2 L-6,2 Z', wave: 'M-8,2 Q-4,-4 0,2 T8,2 L8,6 L-8,6 Z', sun: 'M0,-6 A6,6 0 1,1 -0.1,-6 Z', peak: 'M-8,6 L-2,-6 L2,0 L4,-3 L8,6 Z',
  flame: 'M0,-8 C5,-2 6,2 3,6 C2,3 0,3 0,1 C-1,4 -4,4 -4,6 C-7,2 -4,-3 0,-8 Z', crystal: 'M0,-8 L5,-2 L0,8 L-5,-2 Z', snow: 'M0,-7 L0,7 M-6,-3.5 L6,3.5 M-6,3.5 L6,-3.5',
  moon: 'M3,-7 A7,7 0 1,0 3,7 A5,5 0 1,1 3,-7 Z', cloud: 'M-7,4 A4,4 0 0,1 -5,-3 A5,5 0 0,1 4,-4 A4,4 0 0,1 7,4 Z', pillar: 'M-5,-6 L5,-6 L4,-4 L4,5 L5,7 L-5,7 L-4,5 L-4,-4 Z',
  star: 'M0,-8 L2,-2 L8,-2 L3,2 L5,8 L0,4 L-5,8 L-3,2 L-8,-2 L-2,-2 Z' }
function Portrait({ id, x, y, radius }: { id: string; x: number; y: number; radius: number }) {
  const art = useAlbumArt(), url = art.useUrl('face', id), clip = `hex-face-${useId().replaceAll(':', '')}`
  return url ? <><defs><clipPath id={clip}><circle cx={x} cy={y} r={radius} /></clipPath></defs><image href={url} x={x - radius} y={y - radius} width={radius * 2} height={radius * 2} clipPath={`url(#${clip})`} preserveAspectRatio="xMidYMid slice" /></> : null
}
function Faces({ ids, large = false, show, seat = false, dim = false }: { ids: string[]; large?: boolean; show: boolean; seat?: boolean; dim?: boolean }) {
  return <g data-hex-faces={large ? 'large' : 'small'} opacity={dim ? 0.6 : 1}>
    {ids.map((id, i) => {
      const x = seat ? (i % 2 ? 11 : -11) : (i - (ids.length - 1) / 2) * (large ? 16.4 : 12)
      const y = seat ? (i < 2 ? -15 : 7) : -5, radius = seat ? 9 : large ? 8 : 5.6
      return <g key={i}><circle cx={x} cy={y} r={radius + 1.6} fill={large ? 'var(--color-accent)' : '#0a1018'} />
        <circle cx={x} cy={y} r={radius} fill={dotColor(ids[0] ?? id)} />{show && <Portrait id={id} x={x} y={y} radius={radius} />}</g>
    })}
  </g>
}

export function HoneycombMap({ continent, campaign, onEnter }: { continent: WorldContinent; campaign: Campaign; onEnter: (path: string) => void }) {
  const world = useWorld(), now = useNow(30_000), host = useRef<HTMLDivElement>(null)
  const geometry = useMemo(() => honeycombGeometry(continent), [continent])
  const states = world ? honeycombState(world, continent) : {}
  const frontier = honeycombFrontier(continent, (id) => !!states[id]?.completed)
  const [viewport, setViewport] = useState({ width: 390, height: 360 }), [selected, setSelected] = useState<HoneyTile | null>(null)
  const [transform, setTransform] = useState<MapTransform>(() => fittedTransform(geometry, 390, 360, frontier))
  const pointers = useRef(new Map<number, { x: number; y: number }>()), moved = useRef(false), pinch = useRef(0), dragged = useRef(0)
  const fit = Math.min((viewport.width - 8) / geometry.width, (viewport.height - 8) / geometry.height)
  useEffect(() => {
    const measure = () => {
      const box = host.current?.getBoundingClientRect()
      if (box && box.width > 0) {
        const dock = document.querySelector('nav[aria-label="Pages"]')?.getBoundingClientRect()
        const bottom = dock && dock.top > box.top ? dock.top : window.innerHeight - 88
        setViewport({ width: box.width, height: Math.max(180, Math.min(620, bottom - box.top - 8)) })
      }
    }
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    if (host.current) observer?.observe(host.current)
    const header = host.current?.closest('[data-honeycomb]')?.previousElementSibling
    if (header) observer?.observe(header)
    window.addEventListener('resize', measure)
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure) }
  }, [])
  useEffect(() => { setTransform(fittedTransform(geometry, viewport.width, viewport.height, frontier)) }, [geometry, viewport.width, viewport.height])
  const zoom = (value: number | ((zoom: number) => number), anchor = { x: viewport.width / 2, y: viewport.height / 2 }) => setTransform((t) => {
    const z = Math.max(1, Math.min(3, typeof value === 'function' ? value(t.zoom) : value)), ratio = z / t.zoom
    return { zoom: z, x: anchor.x - (anchor.x - t.x) * ratio, y: anchor.y - (anchor.y - t.y) * ratio }
  })
  const move = (e: PointerEvent<SVGSVGElement>) => {
    const old = pointers.current.get(e.pointerId)
    if (!old) return
    const next = { x: e.clientX, y: e.clientY }
    pointers.current.set(e.pointerId, next)
    const points = [...pointers.current.values()]
    if (points.length === 2) {
      const distance = Math.hypot(points[0]!.x - points[1]!.x, points[0]!.y - points[1]!.y)
      const box = e.currentTarget.getBoundingClientRect()
      const ratio = pinch.current ? distance / pinch.current : 1
      zoom((z) => z * ratio, { x: (points[0]!.x + points[1]!.x) / 2 - box.left, y: (points[0]!.y + points[1]!.y) / 2 - box.top })
      pinch.current = distance; moved.current = true
    } else {
      const dx = next.x - old.x, dy = next.y - old.y
      dragged.current += Math.abs(dx) + Math.abs(dy)
      if (dragged.current > 4) { moved.current = true; e.currentTarget.setPointerCapture?.(e.pointerId) }
      setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }))
    }
  }
  if (!world) return null
  const seats = capitalSeats(world, continent.id), runsWon = world.capitals?.[continent.id]?.won ?? 0
  const capitalLabel = runsWon > 0 ? `${runsWon} ${runsWon === 1 ? 'run' : 'runs'} won` : (world.capitalRuns ?? []).some((r) => r.continent === continent.id) ? 'Open run' : 'No runs yet'
  return <div data-honeycomb data-frontier={frontier}>
    <div className="flex justify-end gap-1 border-b border-hairline px-2 py-1">
      <button type="button" aria-label="Zoom out" className="size-11 rounded-sm bg-raised font-bold disabled:opacity-40" disabled={transform.zoom <= 1} onClick={() => zoom(transform.zoom / 1.35)}>−</button>
      <button type="button" aria-label="Fit map" className="size-11 rounded-sm bg-raised font-bold" onClick={() => setTransform(fittedTransform(geometry, viewport.width, viewport.height, frontier))}>⊙</button>
      <button type="button" aria-label="Zoom in" className="size-11 rounded-sm bg-raised font-bold disabled:opacity-40" disabled={transform.zoom >= 3} onClick={() => zoom(transform.zoom * 1.35)}>+</button>
    </div>
    <div ref={host} className="relative overflow-hidden overscroll-contain bg-page" style={{ height: viewport.height }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${viewport.width} ${viewport.height}`} role="group" aria-label={`${continent.name}, honeycomb`} style={{ touchAction: 'none' }} data-zoom={transform.zoom.toFixed(2)}
        onPointerDown={(e) => { moved.current = pointers.current.size > 0; dragged.current = 0; pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pointers.current.size === 2) { const p = [...pointers.current.values()]; pinch.current = Math.hypot(p[0]!.x - p[1]!.x, p[0]!.y - p[1]!.y) } }}
        onPointerMove={move} onPointerUp={(e) => { pointers.current.delete(e.pointerId); pinch.current = 0 }} onPointerCancel={(e) => { pointers.current.delete(e.pointerId); pinch.current = 0 }}>
        <g transform={`translate(${transform.x},${transform.y}) scale(${fit * transform.zoom})`}>
          {geometry.tiles.map((tile, i) => {
            const point = honeycombXY(tile, HEX_SIZE), r = continent.regions.find((r) => r.id === tile.id), state = r ? states[r.id]! : undefined
            const seat = tile.kind === 'seat' ? seats[(tile.seat ?? 1) - 1] : undefined
            const ready = tile.kind === 'spring' ? springReadyAt(world, tile.id!, now) : null
            const charge = ready ? formatDuration(Date.parse(ready) - Date.parse(now)) : 'Ready'
            const team = state?.completed ? state.clear : state?.claim
            const label = r ? `${r.name}, ${formatLevels(r.level, r.levelTop)}, ${state?.completed ? 'completed' : `${state?.won ?? 0} of 12`}`
              : tile.kind === 'spring' ? `Spring ${tile.id?.split('spring')[1]}, ${charge}` : tile.kind === 'seat' ? `Seat ${tile.seat}, ${seat ? `${runName(seat.id)}, ${seat.won ? 'won' : `${seat.progress} of 16`}` : 'open'}` : `Capital, ${capitalLabel}`
            const fill = r ? biomeById(r.biome).color : tile.kind === 'spring' ? 'color-mix(in srgb, var(--color-info) 70%, #0b2a52)' : tile.kind === 'capital' ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-accent) 38%, var(--color-panel))'
            const complete = state?.completed || seat?.won, short = r?.name.replace('Ancient ', '').replace('Crystal ', '')
            const pick = () => setSelected(tile)
            const glyph = r ? GLYPH[r.biome] ?? 'star' : ''
            return <g key={i} transform={`translate(${point.x},${point.y})`} role="button" tabIndex={0} aria-label={label} aria-pressed={selected === tile}
              data-hex={tile.id ?? `${tile.kind}-${tile.seat ?? 0}`} data-state={state ? state.completed ? 'completed' : state.won ? 'claimed' : 'untouched' : undefined}
              className="cursor-pointer outline-none focus-visible:[&>.hex-rim]:stroke-info focus-visible:[&>.hex-rim]:stroke-[5]"
              onClick={() => { if (!moved.current) pick() }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick() } }}>
              <polygon className="hex-rim" points={hexPoints(48)} fill={fill} fillOpacity={state && !state.won ? 0.5 : 1}
                stroke={selected === tile ? 'var(--color-info)' : complete ? 'var(--color-accent)' : 'var(--color-hairline-strong)'} strokeWidth={selected === tile ? 5 : complete ? 3.5 : 1.5} />
              {r ? <>
                <polygon points={hexPoints(41)} fill="#0a1018" fillOpacity={0.55} />
                {state && state.won > 0 && !state.completed && <polygon points={hexPoints(41)} fill="none" stroke="var(--color-accent)" strokeWidth={3} strokeDasharray={hexProgress(state.won, 12)} />}
                <path d={SHAPES[glyph]} fill={glyph === 'snow' ? 'none' : '#fff'} stroke={glyph === 'snow' ? '#fff' : 'none'} strokeWidth={2} opacity={0.85} transform={`translate(0,${team ? -25 : -16}) scale(${team ? 0.8 : 1})`} />
                {team && <Faces ids={team.umas} large={state?.completed} show={transform.zoom >= 1.6} />}
                <text y={team ? 16 : 4} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#fff">{short}</text>
                <text y={team ? 29 : 17} textAnchor="middle" fontSize={9.5} fill={state?.completed ? '#f3cf6a' : '#e6edf5'}>{state?.completed ? '✓ · ' : ''}{formatLevels(r.level, r.levelTop)}{!state?.completed ? ` · ${state?.won ?? 0}/12` : ''}</text>
                {r.row === TWIN_BOSS_ROW && <text x={22} y={-26} textAnchor="middle" fontSize={9.5} fill="#f3cf6a">♛♛</text>}
              </> : tile.kind === 'seat' ? seat ? <>
                {!seat.won && <polygon points={hexPoints(43)} fill="none" stroke="var(--color-accent)" strokeWidth={3} strokeDasharray={hexProgress(seat.progress, 16, 43)} />}
                <Faces ids={seat.lanes.map((l) => l[0]!)} seat large={seat.won} dim={!seat.won} show={transform.zoom >= 1.6} />
                <text y={30} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="var(--color-ink)">{runName(seat.id)} · {seat.won ? '✓' : `${seat.progress}/16`}</text>
              </> : <text y={4} textAnchor="middle" fontSize={10} fill="var(--color-ink-soft)">Open seat</text> : tile.kind === 'capital' ? <>
                <path d="M-12,8 L-12,-6 L-8,-6 L-8,-10 L-4,-10 L-4,-6 L4,-6 L4,-10 L8,-10 L8,-6 L12,-6 L12,8 Z M-3,8 L-3,1 L3,1 L3,8 Z" fill="var(--color-accent-ink)" transform="translate(0,-14)" />
                <text y={12} textAnchor="middle" fontSize={13} fontWeight={800} fill="var(--color-accent-ink)">Capital</text><text y={27} textAnchor="middle" fontSize={10.5} fill="var(--color-accent-ink)">{capitalLabel}</text>
              </> : <>
                <path d="M0,-10 C5,-3 7,0 7,4 A7,7 0 0,1 -7,4 C-7,0 -5,-3 0,-10 Z" fill="#d8ecff" transform="translate(0,-12)" />
                <text y={12} textAnchor="middle" fontSize={12} fontWeight={800} fill="#fff">Spring</text><text y={26} textAnchor="middle" fontSize={10.5} fill="#dbe9ff">{charge}</text>
              </>}
            </g>
          })}
        </g>
      </svg>
    </div>
    {selected && <HoneycombPeek tile={selected} world={world} continent={continent} campaign={campaign} now={now} onClose={() => setSelected(null)} onEnter={onEnter} />}
  </div>
}
