// The shared Extra Stats body (UP27): the Observatory adds its picker; an Uma profile embeds the same live panel.
import {
  EFFECT_LABEL, KNACK_LABEL, SaveRuleError, activeClass, classOf, isStarMap, jewelNodes, madeName, mapNodeGate,
  mapPoints, moonTemplate, nodeBody, nodeJewel, nodeJewelCount, nodeNumeral, nodePoints, prowessSplit, umaPick, umaTemplate,
  type GearTier, type MoonTemplate, type RpgClass, type RpgWeapon,
} from '@rpg/domain'
import { useState } from 'react'
import { ItemIcon } from '../../items/ItemIcon'
import { pointText } from '../../items/planets'
import { useMaster } from '../../master/master'
import { setMapJewel, useActiveTier, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { extraStatsCount, gate, itemCount, nodeValue as nodeValueCopy } from '../stable/copy'
import { observatoryLayoutV3 } from './layout-v3'

const ROMAN = ['I', 'II', 'III', 'IV', 'V'] as const
const cap = (word: string) => word[0]!.toUpperCase() + word.slice(1)

export function StarsPanel({ outfitId }: { outfitId: string }) {
  const master = useMaster()
  const world = useWorld()
  const tier = useActiveTier() as GearTier
  const [message, setMessage] = useState<string | null>(null)
  const [nodeOpen, setNodeOpen] = useState<string | null>(null)
  const [jewelPick, setJewelPick] = useState<{ jewel: string; nodes: string[] } | null>(null)
  if (!world || master.status !== 'ready') return null
  const uma = world.umas[outfitId]
  const outfit = master.view.roster.find((row) => row.outfitId === outfitId)
  if (!uma || !outfit || !isStarMap(uma.stars)) return null
  const map = uma.stars
  const classId = activeClass(outfit, uma, tier)
  const weapons = classOf(uma, classId).weapons
  const template = umaTemplate(outfit, umaPick(uma))
  const moon = moonTemplate(outfit, umaPick(uma))
  const sharedOpen = map.open.filter((node) => !node.startsWith('template:')).length
  const templateOpen = map.open.filter((node) => node.startsWith('template:')).length
  const settable = Object.entries(world.items).filter(([item, count]) => count > 0 && jewelNodes(map, item, uma.level, world.items).length > 0)
  const run = (jewel: string, node: string) => {
    setMessage(null)
    setMapJewel(outfitId, jewel, node).then(() => {
      setMessage(`Opened ${mapNodeTitle(node, template.type)}`)
      setJewelPick(null)
    }, (err: unknown) => setMessage(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  const set = (jewel: string) => {
    const nodes = jewelNodes(map, jewel, uma.level)
    if (nodes.length === 1) run(jewel, nodes[0]!)
    else setJewelPick({ jewel, nodes })
  }
  const points = mapPoints(map.open, classId, tier, moon, weapons)
  const sharedPoints = mapPoints(map.open.filter((node) => !node.startsWith('template:')), classId, tier, undefined, weapons)
  const prowess = mapPoints(map.open.filter((node) => node.startsWith('prowess:')), classId, tier, undefined, weapons)
  const prowessLine = [
    prowess.atk ? nodeValueCopy({ kind: 'prowess', stat: 'ATK', value: prowess.atk }) : '',
    prowess.matk ? nodeValueCopy({ kind: 'prowess', stat: 'M.ATK', value: prowess.matk }) : '',
  ].filter(Boolean).join(' · ') || '—'

  return (
    <div className="space-y-3" data-stars-panel>
      <div className="flex items-baseline justify-between gap-2">
        <div><h2 className="font-display text-lg font-bold">Extra Stats</h2>
          <p className="text-[12px] text-ink-soft">All open nodes count</p></div>
        <span className="shrink-0 text-[12px] text-ink-soft">{extraStatsCount(sharedOpen + templateOpen)}</span>
      </div>
      <StarMapV3 open={map.open} templateType={template.type} onNode={setNodeOpen} />
      <p className="rounded-sm bg-raised px-2 py-1.5 text-[12px] text-ink-soft">Prowess · {prowessLine}</p>
      <div className="grid grid-cols-3 gap-1 text-center text-[11px]">
        {(['hp', 'mp', 'atk', 'matk', 'def', 'mdef'] as const).map((stat) => {
          const star = points[stat] - sharedPoints[stat]
          return <span key={stat} className="rounded-xs bg-raised p-1"><span className="block font-semibold">{EFFECT_LABEL[stat]}</span>
            <span className="text-ink-soft">{pointText(stat, sharedPoints[stat])}{star ? ` ★ ${pointText(stat, star)}` : ''}</span></span>
        })}
      </div>
      {message && <p className="rounded-sm bg-raised p-2 text-[13px]">{message}</p>}
      <section><h3 className="mb-1.5 text-micro">Set</h3>
        {settable.length === 0 ? <p className="text-[13px] text-ink-faint">No jewels ready.</p> : <ul className="space-y-1.5">{settable.map(([jewel, count]) => {
          const node = jewelNodes(map, jewel, uma.level, world.items)[0]!
          return <li key={jewel}><button type="button" onClick={() => set(jewel)} className="flex min-h-12 w-full items-center gap-2 rounded-sm bg-raised p-2 text-left">
            <ItemIcon id={jewel} size={32} /><span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold">{itemCount(madeName(jewel) ?? jewel, count)}</span>
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
  )
}

function mapNodeTitle(id: string, type: string): string {
  const body = nodeBody(id), numeral = ROMAN[nodeNumeral(id) - 1]
  return body === 'template' ? `★ ${cap(type)}'s moon ${numeral}` : `${cap(body)} ${numeral}`
}

export function mapNodeValue(id: string, classId: RpgClass, knack: keyof typeof KNACK_LABEL, channel: MoonTemplate['channel'], tier: GearTier,
  weapons?: readonly RpgWeapon[]): string {
  const body = nodeBody(id), value = nodePoints(id, tier)
  if (body === 'planet') return nodeValueCopy({ kind: 'planet', value })
  if (body === 'prowess') {
    const split = prowessSplit(value, classId, weapons)
    return [split.atk ? nodeValueCopy({ kind: 'prowess', stat: 'ATK', value: split.atk }) : '', split.matk ? nodeValueCopy({ kind: 'prowess', stat: 'M.ATK', value: split.matk }) : ''].filter(Boolean).join(' · ')
  }
  if (body === 'vigor') return nodeValueCopy({ kind: 'vigor', hp: value * 5, mp: value })
  if (body === 'guard') return nodeValueCopy({ kind: 'guard', value })
  if (nodeNumeral(id) === 2 && channel === 'both') return `${nodeValueCopy({ kind: 'stat', stat: 'DEF', value: Math.floor(value / 2) })} · ${nodeValueCopy({ kind: 'stat', stat: 'M.DEF', value: value - Math.floor(value / 2) })}`
  if (nodeNumeral(id) === 2) return nodeValueCopy({ kind: 'stat', stat: channel === 'physical' ? 'DEF' : 'M.DEF', value })
  return knack === 'tireless' ? nodeValueCopy({ kind: 'stat', stat: 'HP', value: value * 5 })
    : knack === 'clever' ? nodeValueCopy({ kind: 'stat', stat: 'MP', value })
      : knack === 'mighty' ? nodeValueCopy({ kind: 'guard', value })
        : knack === 'fleet' ? nodeValueCopy({ kind: 'stat', stat: 'Evasion', value: '2.4%' })
          : nodeValueCopy({ kind: 'stat', stat: 'Limit start', value: 1 })
}

function NodeSheet({ node, open, classId, weapons, knack, channel, tier, type, onClose }: {
  node: string; open: boolean; classId: RpgClass; weapons: readonly RpgWeapon[]; knack: keyof typeof KNACK_LABEL; channel: MoonTemplate['channel']
  tier: GearTier; type: string; onClose: () => void
}) {
  return <BottomSheet title={mapNodeTitle(node, type)} onClose={onClose}><div className="space-y-2 rounded-md bg-raised p-3 text-[13px]">
    <p className="font-semibold">{mapNodeValue(node, classId, knack, channel, tier, weapons)}</p>
    <p className="text-ink-soft">{nodeBody(node) === 'template' ? 'With its moons' : `${madeName(nodeJewel(node))}${nodeJewelCount(node) > 1 ? ` ×${nodeJewelCount(node)}` : ''}`} · {open ? 'Open' : gate('level', mapNodeGate(node))}</p>
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
