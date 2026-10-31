// The Observatory (S6, design §10, D58, D144): each Uma's Sun-and-planets map. Setting a Star Gem opens a node; up to
// 5 + ⌊level / 2⌋ open nodes are active at once, each adding its grade's points to her stats in every fight.
import {
  activeNodeSlots, BRIDGES, gemNameV1, gemStock, isStarMap, ITEM_EFFECTS, nodeFromGem, nodeGem, RING, SaveRuleError, starPoints,
  starsV1, type OwnedUma,
} from '@rpg/domain'
import { useState } from 'react'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { nodeLabel, nodeValue, PLANET_COLOR as COLOR, PLANET_SHORT as SHORT, pointText } from '../../items/planets'
import { FaceTile } from '@luismlorenzana/uma-kit/album'
import { byLevel, formatLevel } from '@luismlorenzana/uma-kit/roster'
import { albumRows, lockedReason } from '../../album/rows'
import { PickerStep } from '../../album/PickerStep'
import type { MasterView } from '../../master/master'
import { activate, setStarGem, useAlbumScope, useWorld } from '../../save/game'
import { MasterGate } from '../MasterGate'
import type { PageProps } from '../registry'
import { StarsPanel } from './StarsPanel'

export default function ObservatoryPage({ rest }: PageProps) {
  return <MasterGate>{(view) => <Observatory view={view} initial={rest || null} />}</MasterGate>
}

function Observatory({ view, initial }: { view: MasterView; initial: string | null }) {
  const world = useWorld()
  const rows = albumRows(view, world, [], undefined, useAlbumScope())
  const owned = rows.filter(row => row.uma).sort(byLevel)
  const [picking, setPicking] = useState(false)
  const [picked, setPicked] = useState<string | null>(initial)
  const [message, setMessage] = useState<string | null>(null)
  if (!world) return null
  const id = picked && world.umas[picked] ? picked : owned[0]?.id ?? null
  if (!id) return <p className="p-4 text-ink-soft">Unlock an Uma first.</p>
  const uma = world.umas[id]!
  if (isStarMap(uma.stars)) return <ObservatoryV3 rows={rows} owned={owned} id={id}
    picking={picking} setPicking={setPicking} setPicked={setPicked} />
  // Today's map (v1); R2's Planet and moons draw here from H79.
  const stars = starsV1(uma)
  const slots = activeNodeSlots(uma.level)
  const points = starPoints(stars.active)
  const run = (op: () => Promise<unknown>, ok?: (r: unknown) => string) => {
    setMessage(null)
    op().then((r) => ok && setMessage(ok(r)), (err: unknown) => setMessage(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  const toggle = (node: string) => {
    if (!stars.unlocked.includes(node)) {
      return setMessage(`${nodeLabel(node)}: set a ${gemNameV1(nodeGem(node))} (cut it at the Lapidary, in the Wilds)`)
    }
    const on = stars.active.includes(node)
    if (!on && stars.active.length >= slots) return setMessage(`All ${slots} active slots are in use: switch one off first`)
    run(() => activate(id, on ? stars.active.filter((n) => n !== node) : [...stars.active, node]))
  }
  const settable = Object.entries(gemStock(world)).filter(([g]) => nodeFromGem(uma, g))
  return (
    <div className="space-y-3 p-3">
      <button type="button" onClick={() => setPicking(true)} aria-label="Choose an Uma" className="flex min-h-12 items-center gap-3 rounded-md bg-raised p-2">
        <span className="w-11"><FaceTile outfitId={id} size={44} label={owned.find(row => row.id === id)?.name ?? 'Uma'} round /></span>
        <span>Choose an Uma</span>
      </button>
      {picking && <PickerStep title="Observatory Uma" rows={rows} disabled={lockedReason}
        describe={row => `${formatLevel(row.level)} · ${row.base.title ?? ''}`}
        onClose={() => setPicking(false)} onPick={id => { setPicked(id); setPicking(false) }} />}
      <div className="flex items-baseline justify-between">
        <h2 className="truncate font-display text-lg font-bold">{owned.find(o => o.id === id)?.name}</h2>
        <span className="shrink-0 text-[13px] text-ink-soft">Active {stars.active.length}/{slots} · {stars.unlocked.length}/100 open</span>
      </div>
      <StarMap uma={uma} onToggle={toggle} />
      <div className="grid grid-cols-4 gap-1 text-center text-[11px]">
        {ITEM_EFFECTS.map((e) => (
          <span key={e} className="rounded-xs bg-raised px-1 py-1">
            <span className="block font-semibold" style={{ color: COLOR[e] }}>{SHORT[e]}</span>
            <span className="text-ink-soft">{points[e] ? pointText(e, points[e]) : '—'}</span>
          </span>
        ))}
      </div>
      {message && <p className="rounded-sm bg-raised p-2 text-[13px]">{message}</p>}
      <section>
        <h3 className="text-micro mb-1.5">Set · Star Gems from the Lapidary</h3>
        {settable.length === 0 ? (
          <p className="text-[13px] text-ink-faint">{Object.keys(gemStock(world)).length ? 'No gem on the shelf opens anything new for her.' : 'No Star Gems yet: cut some at the Lapidary (Wilds).'}</p>
        ) : (
          <ul className="space-y-1.5">
            {settable.map(([gemId, n]) => {
              const node = nodeFromGem(uma, gemId)!
              return (
                <li key={gemId}>
                  <button type="button" onClick={() => run(() => setStarGem(id, gemId), (r) => `Opened ${nodeLabel(String(r))}`)} className="flex w-full items-center gap-2 rounded-sm bg-raised p-2 text-left">
                    <ItemIcon id={outputView(gemId).icon} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold">{gemNameV1(gemId)} ×{n}</span>
                      <span className="block text-[11px] text-ink-soft">Opens {nodeLabel(node)} · {nodeValue(node)}</span>
                    </span>
                    <span className="shrink-0 rounded-sm bg-accent px-2.5 py-1 text-[12px] font-bold text-accent-ink">Set</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

function ObservatoryV3({ rows, owned, id, picking, setPicking, setPicked }: {
  rows: ReturnType<typeof albumRows>; owned: ReturnType<typeof albumRows>; id: string
  picking: boolean; setPicking: (on: boolean) => void; setPicked: (id: string) => void
}) {
  return <div className="space-y-3 p-3">
    <button type="button" onClick={() => setPicking(true)} aria-label="Choose an Uma" className="flex min-h-12 w-full items-center gap-3 rounded-md bg-raised p-2 text-left">
      <FaceTile outfitId={id} size={44} label={owned.find(row => row.id === id)?.name ?? 'Uma'} round />
      <span className="min-w-0 flex-1 truncate font-semibold">{owned.find(row => row.id === id)?.name}</span>
    </button>
    {picking && <PickerStep title="Observatory Uma" rows={rows} disabled={lockedReason}
      describe={row => `${formatLevel(row.level)} · ${row.base.title ?? ''}`}
      onClose={() => setPicking(false)} onPick={next => { setPicked(next); setPicking(false) }} />}
    <StarsPanel outfitId={id} />
  </div>
}

/** The map: the Sun in the middle, eight planets on a ring with ten moons each, two bridge nodes between neighbours. */
function StarMap({ uma, onToggle }: { uma: OwnedUma; onToggle: (node: string) => void }) {
  const C = 180
  const R = 118
  const angle = (i: number) => (i / RING.length) * Math.PI * 2 - Math.PI / 2
  const planet = (i: number) => ({ x: C + R * Math.cos(angle(i)), y: C + R * Math.sin(angle(i)) })
  const stars = starsV1(uma)
  const state = (n: string) => (stars.active.includes(n) ? 'on' : stars.unlocked.includes(n) ? 'off' : 'locked')
  const Node = ({ id, x, y, r, color }: { id: string; x: number; y: number; r: number; color: string }) => {
    const s = state(id)
    return (
      <circle cx={x} cy={y} r={r} onClick={() => onToggle(id)} role="button" aria-label={`${nodeLabel(id)}, ${s === 'locked' ? `needs a ${gemNameV1(nodeGem(id))}` : s === 'on' ? 'active' : 'off'}`}
        fill={s === 'on' ? color : s === 'off' ? 'rgb(255 255 255 / 0.35)' : 'transparent'} stroke={s === 'locked' ? 'rgb(255 255 255 / 0.22)' : color} strokeWidth={1.2}
        style={s === 'on' ? { filter: `drop-shadow(0 0 4px ${color})` } : undefined} className={s === 'locked' ? '' : 'cursor-pointer'} />
    )
  }
  return (
    <svg viewBox="0 0 360 360" className="mx-auto block w-full max-w-sm rounded-md bg-sunken" aria-label="Sun-and-planets map">
      <circle cx={C} cy={C} r={R} fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth={1} />
      <circle cx={C} cy={C} r={22} fill="#d6a23e" opacity={0.25} />
      {[0, 1, 2, 3].map((i) => <Node key={i} id={`sun:${i + 1}`} x={C + 11 * Math.cos((i * Math.PI) / 2 + Math.PI / 4)} y={C + 11 * Math.sin((i * Math.PI) / 2 + Math.PI / 4)} r={5} color="#ffd84d" />)}
      {BRIDGES.map(([a, b], i) => {
        const p = planet(i), q = planet((i + 1) % RING.length)
        return [1, 2].map((n) => {
          const t = n === 1 ? 0.42 : 0.58
          const x = p.x + (q.x - p.x) * t, y = p.y + (q.y - p.y) * t
          return <Node key={`${a}-${b}-${n}`} id={`bridge:${a}-${b}:${n}`} x={x} y={y} r={4.5} color={COLOR[a]} />
        })
      })}
      {RING.map((e, i) => {
        const p = planet(i)
        return (
          <g key={e}>
            <circle cx={p.x} cy={p.y} r={15} fill={COLOR[e]} opacity={0.22} />
            <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLOR[e]}>{SHORT[e]}</text>
            {Array.from({ length: 10 }, (_, m) => {
              const a = angle(i) + ((m - 4.5) / 10) * Math.PI * 1.1
              return <Node key={m} id={`moon:${e}:${m + 1}`} x={p.x + 27 * Math.cos(a)} y={p.y + 27 * Math.sin(a)} r={3.6} color={COLOR[e]} />
            })}
          </g>
        )
      })}
    </svg>
  )
}
