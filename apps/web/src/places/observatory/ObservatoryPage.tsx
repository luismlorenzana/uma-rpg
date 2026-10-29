// The Observatory (S6, design §10, D58, D144): each Uma's Sun-and-planets map. Setting a Star Gem opens a node; up to
// 5 + ⌊level / 2⌋ open nodes are active at once, each adding its grade's points to her stats in every fight.
import {
  activeClass, activeNodeSlots, BRIDGES, EFFECT_LABEL, gemNameV1, gemStock, isStarMap, ITEM_EFFECTS, jewelNodes, KNACK_LABEL, madeName, mapNodeGate, mapPoints,
  MAP_NODES, moonTemplate, nodeBody, nodeFromGem, nodeGem, nodeJewel, nodeNumeral, nodePoints, prowessSplit, RING, SaveRuleError, starPoints, starsV1,
  umaTemplate, classOf, type GearTier, type MoonTemplate, type OwnedUma, type RpgClass, type RpgWeapon, umaPick,
} from '@rpg/domain'
import { CLASS_LABEL } from '../../battle/labels'
import { useState } from 'react'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { nodeLabel, nodeValue, PLANET_COLOR as COLOR, PLANET_SHORT as SHORT, pointText } from '../../items/planets'
import { FaceTile } from '@luismlorenzana/uma-kit/album'
import { byLevel, formatLevel } from '@luismlorenzana/uma-kit/roster'
import { albumRows, lockedReason } from '../../album/rows'
import { PickerStep } from '../../album/PickerStep'
import type { MasterView } from '../../master/master'
import { activate, setMapJewel, setStarGem, useActiveTier, useAlbumScope, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { MasterGate } from '../MasterGate'
import type { PageProps } from '../registry'
import { observatoryLayoutV3 } from './layout-v3'

export default function ObservatoryPage({ rest }: PageProps) {
  return <MasterGate>{(view) => <Observatory view={view} initial={rest || null} />}</MasterGate>
}

function Observatory({ view, initial }: { view: MasterView; initial: string | null }) {
  const world = useWorld()
  const tier = useActiveTier() as GearTier
  const rows = albumRows(view, world, [], undefined, useAlbumScope())
  const owned = rows.filter(row => row.uma).sort(byLevel)
  const [picking, setPicking] = useState(false)
  const [picked, setPicked] = useState<string | null>(initial)
  const [message, setMessage] = useState<string | null>(null)
  if (!world) return null
  const id = picked && world.umas[picked] ? picked : owned[0]?.id ?? null
  if (!id) return <p className="p-4 text-ink-soft">Unlock an Uma first.</p>
  const uma = world.umas[id]!
  if (isStarMap(uma.stars)) return <ObservatoryV3 view={view} rows={rows} owned={owned} id={id} uma={uma} tier={tier}
    picking={picking} setPicking={setPicking} setPicked={setPicked} message={message} setMessage={setMessage} />
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

const ROMAN = ['I', 'II', 'III', 'IV', 'V'] as const
const cap = (word: string) => word[0]!.toUpperCase() + word.slice(1)

function ObservatoryV3({ view, rows, owned, id, uma, tier, picking, setPicking, setPicked, message, setMessage }: {
  view: MasterView; rows: ReturnType<typeof albumRows>; owned: ReturnType<typeof albumRows>; id: string; uma: OwnedUma; tier: GearTier
  picking: boolean; setPicking: (on: boolean) => void; setPicked: (id: string) => void; message: string | null; setMessage: (s: string | null) => void
}) {
  const world = useWorld()!
  const map = isStarMap(uma.stars) ? uma.stars : { open: [], moons: [] as [] }
  const outfit = view.roster.find((o) => o.outfitId === id)!
  const classId = activeClass(outfit, uma, tier)
  const weapons = classOf(uma, classId).weapons
  const template = umaTemplate(outfit, umaPick(uma))
  const moon = moonTemplate(outfit, umaPick(uma))
  const [nodeOpen, setNodeOpen] = useState<string | null>(null)
  const [jewelPick, setJewelPick] = useState<{ jewel: string; nodes: string[] } | null>(null)
  const sharedOpen = map.open.filter((node) => !node.startsWith('template:')).length
  const templateOpen = map.open.filter((node) => node.startsWith('template:')).length
  const settable = Object.entries(world.items).filter(([item, count]) => count > 0 && jewelNodes(map, item, uma.level).length > 0)
  const run = (jewel: string, node: string) => {
    setMessage(null)
    setMapJewel(id, jewel, node).then(() => { setMessage(`Opened ${mapNodeTitle(node, template.type)}`); setJewelPick(null) },
      (err: unknown) => setMessage(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  const set = (jewel: string) => {
    const nodes = jewelNodes(map, jewel, uma.level)
    if (nodes.length === 1) run(jewel, nodes[0]!)
    else setJewelPick({ jewel, nodes })
  }
  const points = mapPoints(map.open, classId, tier, moon, weapons)
  const prowess = mapPoints(map.open.filter((node) => node.startsWith('prowess:')), classId, tier, undefined, weapons)
  return <div className="space-y-3 p-3">
    <button type="button" onClick={() => setPicking(true)} aria-label="Choose an Uma" className="flex min-h-12 w-full items-center gap-3 rounded-md bg-raised p-2 text-left">
      <FaceTile outfitId={id} size={44} label={owned.find(row => row.id === id)?.name ?? 'Uma'} round />
      <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{owned.find(o => o.id === id)?.name}</span>
        <span className="block text-[12px] text-ink-soft">Open {sharedOpen} of 20 · ★ {templateOpen} of 2</span></span>
    </button>
    {picking && <PickerStep title="Observatory Uma" rows={rows} disabled={lockedReason}
      describe={row => `${formatLevel(row.level)} · ${row.base.title ?? ''}`}
      onClose={() => setPicking(false)} onPick={next => { setPicked(next); setPicking(false) }} />}
    <div className="flex items-center justify-between"><h2 className="font-display text-lg font-bold">Extra Stats</h2>
      <HelpButton title="Observatory"><p>Each node opens with its jewel, in order. Every open node counts.</p></HelpButton></div>
    <StarMapV3 open={map.open} templateType={template.type} onNode={setNodeOpen} />
    <p className="rounded-sm bg-raised px-2 py-1.5 text-[12px] text-ink-soft">Prowess · {CLASS_NAME[classId]} {PROWESS[classId]}: ATK +{prowess.atk}, M.ATK +{prowess.matk}</p>
    <div className="grid grid-cols-3 gap-1 text-center text-[11px]">
      {(['hp', 'mp', 'atk', 'matk', 'def', 'mdef'] as const).map((stat) => {
        const shared = mapPoints(map.open.filter((node) => !node.startsWith('template:')), classId, tier, undefined, weapons)[stat]
        const star = points[stat] - shared
        return <span key={stat} className="rounded-xs bg-raised p-1"><span className="block font-semibold">{EFFECT_LABEL[stat]}</span>
          <span className="text-ink-soft">{pointText(stat, shared)}{star ? ` ★ ${pointText(stat, star)}` : ''}</span></span>
      })}
    </div>
    {message && <p className="rounded-sm bg-raised p-2 text-[13px]">{message}</p>}
    <section><h3 className="mb-1.5 text-micro">Set</h3>
      {settable.length === 0 ? <p className="text-[13px] text-ink-faint">No jewels ready.</p> : <ul className="space-y-1.5">{settable.map(([jewel, count]) => {
        const node = jewelNodes(map, jewel, uma.level)[0]!
        return <li key={jewel}><button type="button" onClick={() => set(jewel)} className="flex min-h-12 w-full items-center gap-2 rounded-sm bg-raised p-2 text-left">
          <ItemIcon id={jewel} size={32} /><span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold">{madeName(jewel)} ×{count}</span>
            <span className="block text-[11px] text-ink-soft">Opens {mapNodeTitle(node, template.type)} · {mapNodeValue(node, classId, moon.knack, moon.channel, tier, weapons)}</span></span>
          <span className="rounded-sm bg-accent px-2 py-1 text-[12px] font-bold text-accent-ink">Set</span></button></li>
      })}</ul>}
    </section>
    {nodeOpen && <NodeSheet node={nodeOpen} open={map.open.includes(nodeOpen)} classId={classId} weapons={weapons} knack={moon.knack} channel={moon.channel} tier={tier}
      type={template.type} onClose={() => setNodeOpen(null)} />}
    {jewelPick && <BottomSheet title={madeName(jewelPick.jewel) ?? 'Moon Jewel'} onClose={() => setJewelPick(null)}>
      <div className="space-y-2">{jewelPick.nodes.map((node) => <button key={node} type="button" onClick={() => run(jewelPick.jewel, node)} className="min-h-12 w-full rounded-sm bg-raised px-3 text-left text-[13px] font-semibold">
        {mapNodeTitle(node, template.type)} · {mapNodeValue(node, classId, moon.knack, moon.channel, tier, weapons)}
      </button>)}</div>
    </BottomSheet>}
  </div>
}

const CLASS_NAME = CLASS_LABEL
/** Prowess's split by class (EP23); Classes v3's two new hybrids mirror their pair, a Tier 0 splits by her slots (H126). */
const PROWESS: Readonly<Record<RpgClass, string>> = {
  brawler: '100/0', mage: '0/100', spellblade: '70/30', summoner: '30/70', paladin: '80/20', cleric: '20/80', armsummoner: '70/30', tomeblade: '30/70',
  recruit: 'by slot', duelist: 'by slot', acolyte: 'by slot', caller: 'by slot', apprentice: 'by slot',
}

function mapNodeTitle(id: string, type: string): string {
  const body = nodeBody(id), numeral = ROMAN[nodeNumeral(id) - 1]
  return body === 'template' ? `★ ${cap(type)}'s moon ${numeral}` : `${cap(body)} ${numeral}`
}

function mapNodeValue(id: string, classId: RpgClass, knack: keyof typeof KNACK_LABEL, channel: MoonTemplate['channel'], tier: GearTier,
  weapons?: readonly RpgWeapon[]): string {
  const body = nodeBody(id), value = nodePoints(id, tier)
  if (body === 'planet') return `+${value} to every stat`
  if (body === 'prowess') { const split = prowessSplit(value, classId, weapons); return `as ${CLASS_NAME[classId]} ATK +${split.atk}, M.ATK +${split.matk}` }
  if (body === 'vigor') return `HP +${value * 5}, MP +${value}`
  if (body === 'guard') return `DEF and M.DEF +${value}`
  if (nodeNumeral(id) === 2 && channel === 'both') return `DEF +${Math.floor(value / 2)} · M.DEF +${value - Math.floor(value / 2)}`
  if (nodeNumeral(id) === 2) return `${channel === 'physical' ? 'DEF' : 'M.DEF'} +${value}`
  return knack === 'tireless' ? `Tireless · HP +${value * 5}` : knack === 'clever' ? `Clever · MP +${value}`
    : knack === 'mighty' ? `Mighty · DEF and M.DEF +${value}` : knack === 'fleet' ? 'Fleet · Evasion +2.4%' : 'Gritty · Limit +1.6'
}

function NodeSheet({ node, open, classId, weapons, knack, channel, tier, type, onClose }: {
  node: string; open: boolean; classId: RpgClass; weapons: readonly RpgWeapon[]; knack: keyof typeof KNACK_LABEL; channel: MoonTemplate['channel']
  tier: GearTier; type: string; onClose: () => void
}) {
  return <BottomSheet title={mapNodeTitle(node, type)} onClose={onClose}><div className="space-y-2 rounded-md bg-raised p-3 text-[13px]">
    <p className="font-semibold">{mapNodeValue(node, classId, knack, channel, tier, weapons)}</p>
    <p className="text-ink-soft">{open ? `${madeName(nodeJewel(node))} · Open` : `needs a ${madeName(nodeJewel(node))} · opens at Lv ${mapNodeGate(node)}`}</p>
  </div></BottomSheet>
}

function StarMapV3({ open, templateType, onNode }: { open: readonly string[]; templateType: string; onNode: (id: string) => void }) {
  const layout = observatoryLayoutV3()
  const center = { planet: [180, 180], prowess: [180, 58], vigor: [92, 276], guard: [268, 276], template: [302, 112] } as const
  return <svg viewBox="0 0 360 360" className="mx-auto block w-full max-w-sm rounded-md bg-sunken" aria-label="Planet-and-moons map">
    <circle cx="180" cy="180" r="34" fill="none" stroke="rgb(255 216 77 / .25)" /><circle cx="180" cy="180" r="18" fill="#ffd84d" opacity=".18" />
    <path d="M180 58 A142 142 0 0 1 268 276 A142 142 0 0 1 92 276 A142 142 0 0 1 180 58" fill="none" stroke="rgb(255 255 255 / .08)" />
    <circle cx="302" cy="112" r="30" fill="none" stroke="rgb(240 184 255 / .22)" />
    {Object.entries(center).map(([body, [x, y]]) => <text key={body} x={x} y={y + 3} textAnchor="middle" fontSize="10" fill="currentColor" opacity=".7">{body === 'template' ? `★ ${cap(templateType)}` : cap(body)}</text>)}
    {layout.map((node) => { const on = open.includes(node.id); const select = () => onNode(node.id); return <g key={node.id} role="button" tabIndex={0}
      aria-label={`${mapNodeTitle(node.id, templateType)}, ${on ? 'open' : 'locked'}`} onClick={select}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select() } }} className="cursor-pointer">
      <circle cx={node.x} cy={node.y} r="22" fill="transparent" />
      <circle cx={node.x} cy={node.y} r={node.r} pointerEvents="none"
        fill={on ? (node.orbit === 'template' ? '#f0b8ff' : '#d6a23e') : 'transparent'} stroke={node.orbit === 'template' ? '#f0b8ff' : '#d6a23e'} strokeWidth="1.5" />
    </g> })}
  </svg>
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
