// The Observatory (S6, design §10, D58): each Uma's Sun-and-planets map. Eating a dish unlocks a node; up to
// 5 + ⌊level / 2⌋ unlocked nodes are active at once, each adding a small share to her stats in every fight.
import {
  activeNodeSlots, BRIDGES, dishById, EFFECT_LABEL, ITEM_EFFECTS, nodeFromDish, nodeGrade, POINT_EVASION, POINT_HP, POINT_LIMIT, RING, SaveRuleError,
  starPoints, type ItemEffect, type OwnedUma,
} from '@rpg/domain'
import { useState } from 'react'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { AtlasSprite } from '../../master/art'
import type { MasterView } from '../../master/master'
import { activate, eat, useWorld } from '../../save/game'
import { MasterGate } from '../MasterGate'
import type { PageProps } from '../registry'

const SHORT: Record<ItemEffect, string> = { hp: 'HP', mp: 'MP', atk: 'ATK', matk: 'MATK', def: 'DEF', mdef: 'MDEF', speed: 'SPD', limit: 'LB' }
const COLOR: Record<ItemEffect, string> = { hp: '#e8706a', mp: '#6aa8ff', atk: '#ff9a4d', matk: '#c48bff', def: '#9fb4cc', mdef: '#5fd3c0', speed: '#ffd84d', limit: '#f0b8ff' }

function nodeLabel(id: string): string {
  const [kind, key, n] = id.split(':')
  if (kind === 'moon') return `${EFFECT_LABEL[key as ItemEffect]} moon ${n}`
  if (kind === 'bridge') return `${key!.split('-').map((e) => EFFECT_LABEL[e as ItemEffect]).join(' + ')} bridge ${n}`
  return `Sun ${key}`
}
export function pointText(e: ItemEffect, p: number): string {
  if (e === 'speed') return `${(p * POINT_EVASION * 100).toFixed(1)}% evasion`
  if (e === 'limit') return `+${Math.floor(p * POINT_LIMIT)} Limit start`
  return `+${Math.round(p * (e === 'hp' ? POINT_HP : 1) * 10) / 10}`
}

export default function ObservatoryPage({ rest }: PageProps) {
  return <MasterGate>{(view) => <Observatory view={view} initial={rest || null} />}</MasterGate>
}

function Observatory({ view, initial }: { view: MasterView; initial: string | null }) {
  const world = useWorld()
  const owned = view.roster.filter((o) => world?.umas[o.outfitId])
  const [picked, setPicked] = useState<string | null>(initial)
  const [message, setMessage] = useState<string | null>(null)
  if (!world) return null
  const id = picked && world.umas[picked] ? picked : owned[0]?.outfitId ?? null
  if (!id) return <p className="p-4 text-ink-soft">Unlock an Uma first.</p>
  const uma = world.umas[id]!
  const slots = activeNodeSlots(uma.level)
  const points = starPoints(uma.stars.active)
  const run = (op: () => Promise<unknown>, ok?: (r: unknown) => string) => {
    setMessage(null)
    op().then((r) => ok && setMessage(ok(r)), (err: unknown) => setMessage(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  const toggle = (node: string) => {
    if (!uma.stars.unlocked.includes(node)) {
      const kind = node.split(':')[0]
      return setMessage(`${nodeLabel(node)}: eat a grade-${nodeGrade(node)}+ ${kind === 'moon' ? 'dish of its planet' : kind === 'bridge' ? 'Duo dish of its pair' : 'Feast'} (cook it at the Kitchen)`)
    }
    const on = uma.stars.active.includes(node)
    if (!on && uma.stars.active.length >= slots) return setMessage(`All ${slots} active slots are in use: switch one off first`)
    run(() => activate(id, on ? uma.stars.active.filter((n) => n !== node) : [...uma.stars.active, node]))
  }
  const edible = Object.entries(world.dishes).filter(([d]) => nodeFromDish(uma, d))
  return (
    <div className="space-y-3 p-3">
      <div className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-1" role="tablist" aria-label="Uma">
        {owned.map((o) => (
          <button key={o.outfitId} type="button" role="tab" aria-selected={o.outfitId === id} onClick={() => setPicked(o.outfitId)}
            className={`shrink-0 rounded-md p-0.5 ${o.outfitId === id ? 'ring-2 ring-accent' : 'opacity-70'}`} aria-label={o.name}>
            <AtlasSprite art={view.art} family="outfit-icons" frameKey={o.outfitId} size={44} />
          </button>
        ))}
      </div>
      <div className="flex items-baseline justify-between">
        <h2 className="truncate font-display text-lg font-bold">{owned.find((o) => o.outfitId === id)?.name}</h2>
        <span className="shrink-0 text-[13px] text-ink-soft">Active {uma.stars.active.length}/{slots} · {uma.stars.unlocked.length}/100 unlocked</span>
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
        <h3 className="text-micro mb-1.5">Eat · dishes from the Kitchen</h3>
        {edible.length === 0 ? (
          <p className="text-[13px] text-ink-faint">{Object.keys(world.dishes).length ? 'No dish on the shelf has anything new for her.' : 'No dishes yet: cook some at the Kitchen (Farmlands).'}</p>
        ) : (
          <ul className="space-y-1.5">
            {edible.map(([dishId, n]) => {
              const dish = dishById(dishId)!
              const node = nodeFromDish(uma, dishId)!
              return (
                <li key={dishId}>
                  <button type="button" onClick={() => run(() => eat(id, dishId), (r) => `Unlocked ${nodeLabel(String(r))}`)} className="flex w-full items-center gap-2 rounded-sm bg-raised p-2 text-left">
                    <ItemIcon id={outputView(dishId).icon} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold">{dish.name} ×{n}</span>
                      <span className="block text-[11px] text-ink-soft">Unlocks {nodeLabel(node)}</span>
                    </span>
                    <span className="shrink-0 rounded-sm bg-accent px-2.5 py-1 text-[12px] font-bold text-accent-ink">Eat</span>
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

/** The map: the Sun in the middle, eight planets on a ring with ten moons each, two bridge nodes between neighbours. */
function StarMap({ uma, onToggle }: { uma: OwnedUma; onToggle: (node: string) => void }) {
  const C = 180
  const R = 118
  const angle = (i: number) => (i / RING.length) * Math.PI * 2 - Math.PI / 2
  const planet = (i: number) => ({ x: C + R * Math.cos(angle(i)), y: C + R * Math.sin(angle(i)) })
  const state = (n: string) => (uma.stars.active.includes(n) ? 'on' : uma.stars.unlocked.includes(n) ? 'off' : 'locked')
  const Node = ({ id, x, y, r, color }: { id: string; x: number; y: number; r: number; color: string }) => {
    const s = state(id)
    return (
      <circle cx={x} cy={y} r={r} onClick={() => onToggle(id)} role="button" aria-label={`${nodeLabel(id)}, ${s === 'locked' ? `needs a grade-${nodeGrade(id)} dish` : s === 'on' ? 'active' : 'off'}`}
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
