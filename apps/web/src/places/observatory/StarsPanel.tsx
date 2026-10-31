// The Stars tab (H122; D239 UP15, UP22; proposal §4.3): her Extra Stats map, the six totals and her moon's ★ line. A node opens
// one sheet with what it gives, before → after and Set; Set all sets every jewel that fits behind one confirm. Her moon's nodes
// take no jewel and open with the three moons (D264). The rules are `stars-view.ts`.
import {
  activeClass, classOf, EFFECT_LABEL, isStarMap, mapPoints, moonTemplate, SaveRuleError, umaPick, umaTemplate,
  type GearTier, type OwnedUma, type RosterOutfit, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { pointText } from '../../items/planets'
import { setJewels, setMapJewel } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { actions, extraStats } from '../stable/copy'
import { observatoryLayoutV3 } from './layout-v3'
import { mapNodeTitle, mapNodeValue, nodeReady, nodeSheet, setAllLines, setAllPlan } from './stars-view'

const cap = (word: string) => word[0]!.toUpperCase() + word.slice(1)
const failed = (err: unknown) => (err instanceof SaveRuleError ? err.message : 'That didn’t work.')

export function StarsPanel({ outfit, uma, world, tier }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; tier: GearTier }) {
  const [node, setNode] = useState<string | null>(null)
  const [all, setAll] = useState(false)
  if (!isStarMap(uma.stars)) return null
  const map = uma.stars
  const classId = activeClass(outfit, uma, tier)
  const weapons = classOf(uma, classId).weapons
  const template = umaTemplate(outfit, umaPick(uma))
  const moon = moonTemplate(outfit, umaPick(uma))
  const plan = setAllPlan(map, world.items, uma.level)
  const shared = mapPoints(map.open.filter((id) => !id.startsWith('template:')), classId, tier, undefined, weapons)
  const star = map.open.filter((id) => id.startsWith('template:')).map((id) => mapNodeValue(id, classId, moon.knack, moon.channel, tier, weapons))
  return (
    <div className="space-y-2" data-stars-panel>
      <div className="flex min-h-11 items-center justify-between gap-2">
        <p className="text-[12.5px] font-semibold">{extraStats(map.open.length, plan.length)}</p>
        <span className="flex shrink-0 items-center gap-1">
          {plan.length > 0 && <button type="button" onClick={() => setAll(true)} className="min-h-11 rounded-sm bg-accent px-3 text-[12.5px] font-bold text-accent-ink">{actions.setAll}</button>}
          <HelpButton title="Extra Stats">
            <p>Each node opens with its jewel, in order.</p>
            <p>A Planet node takes three Planet Jewels; a moon's node one Moon Jewel.</p>
            <p>Her moon takes no jewel: node I opens with all three moons' node II, node II with their node IV.</p>
            <p>Every open node counts, from the next fight.</p>
            <p>Set all gives each Moon Jewel to the moon with the fewest open nodes.</p>
          </HelpButton>
        </span>
      </div>
      <StarMapV3 open={map.open} ready={(id) => nodeReady(map, id, uma.level, world.items)} templateType={template.type} onNode={setNode} />
      <div className="grid grid-cols-3 gap-1 text-center text-[12.5px]" aria-label="Totals">
        {(['hp', 'mp', 'atk', 'matk', 'def', 'mdef'] as const).map((stat) => (
          <span key={stat} className="rounded-xs bg-raised p-1"><span className="font-semibold">{EFFECT_LABEL[stat]}</span> <span className="text-ink-soft">{pointText(stat, shared[stat])}</span></span>
        ))}
      </div>
      {star.length > 0 && <p className="text-center text-[12.5px] font-semibold text-accent">★ {star.join(' · ')}</p>}
      {node && <NodeSheet outfit={outfit} uma={uma} world={world} tier={tier} node={node} onClose={() => setNode(null)} />}
      {all && <SetAllSheet outfit={outfit} uma={uma} world={world} tier={tier} onClose={() => setAll(false)} />}
    </div>
  )
}

/** A node's sheet, the Stars tab's and Template's ★ Moon rows' (H123). Set stays on the sheet, on Open (G5). */
export function NodeSheet({ outfit, uma, world, tier, node, onClose }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; tier: GearTier; node: string; onClose: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const classId = activeClass(outfit, uma, tier)
  const view = nodeSheet(outfit, uma, node, classId, classOf(uma, classId).weapons, tier, world.items)
  const set = () => void setMapJewel(outfit.outfitId, view.jewelId, node).then(() => setError(null), (err: unknown) => setError(failed(err)))
  const [first, ...rest] = view.changes
  return (
    <BottomSheet title={view.title} onClose={onClose} footer={view.footer
      ? <button type="button" disabled={!view.footer.ready} onClick={set}
          className={`min-h-12 w-full rounded-sm px-3 font-display font-bold ${view.footer.ready ? 'bg-accent text-accent-ink' : 'bg-raised text-[14px] text-ink-soft'}`}>{view.footer.label}</button>
      : undefined}>
      <div className="space-y-1 text-center" data-node-sheet>
        <p className="text-[14px] font-semibold">{view.value}</p>
        {first && <p className="font-display text-[22px] font-extrabold leading-tight">{first}</p>}
        {rest.length > 0 && <p className="text-[12.5px] text-ink-soft">{rest.join(' · ')}</p>}
        {view.jewel && <p className="text-[12.5px] text-ink-soft">{view.jewel}</p>}
        {view.open && <p className="text-[14px] font-semibold text-accent">Open</p>}
        {error && <p className="text-[13px] text-danger">{error}</p>}
      </div>
    </BottomSheet>
  )
}

/** Set all: every jewel that fits, one line each, and one button. It closes when done: nothing is left to list. */
function SetAllSheet({ outfit, uma, world, tier, onClose }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; tier: GearTier; onClose: () => void }) {
  const [error, setError] = useState<string | null>(null)
  if (!isStarMap(uma.stars)) return null
  const classId = activeClass(outfit, uma, tier)
  const plan = setAllPlan(uma.stars, world.items, uma.level)
  const go = () => void setJewels(outfit.outfitId, plan).then(onClose, (err: unknown) => setError(failed(err)))
  return (
    <BottomSheet title={actions.setAll} onClose={onClose} footer={plan.length > 0
      ? <button type="button" onClick={go} className="min-h-12 w-full rounded-sm bg-accent px-3 font-display font-bold text-accent-ink">{actions.setCount(plan.length)}</button>
      : undefined}>
      <ul className="space-y-1" aria-label="Jewels">
        {setAllLines(plan, outfit, uma, classId, classOf(uma, classId).weapons, tier).map((line) => <li key={line} className="rounded-sm bg-raised px-3 py-2 text-[12.5px] font-semibold">{line}</li>)}
      </ul>
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </BottomSheet>
  )
}

/** The map: the Planet in the middle, the three moons around it, her moon apart. An open node is filled, a closed one faded,
 * and the green dot marks one a jewel in the Warehouse opens now. */
function StarMapV3({ open, ready, templateType, onNode }: { open: readonly string[]; ready: (id: string) => boolean; templateType: string; onNode: (id: string) => void }) {
  const layout = observatoryLayoutV3()
  const center = { planet: [180, 180], prowess: [180, 58], vigor: [92, 276], guard: [268, 276], template: [302, 112] } as const
  return <svg viewBox="0 0 360 360" className="mx-auto block w-full max-w-sm rounded-md bg-sunken" aria-label="Planet-and-moons map">
    <circle cx="180" cy="180" r="34" fill="none" stroke="rgb(255 216 77 / .25)" /><circle cx="180" cy="180" r="18" fill="#ffd84d" opacity=".18" />
    <path d="M180 58 A142 142 0 0 1 268 276 A142 142 0 0 1 92 276 A142 142 0 0 1 180 58" fill="none" stroke="rgb(255 255 255 / .08)" />
    <circle cx="302" cy="112" r="30" fill="none" stroke="rgb(240 184 255 / .22)" />
    {Object.entries(center).map(([body, [x, y]]) => <text key={body} x={x} y={y + 4} textAnchor="middle" fontSize="11" fill="currentColor" opacity=".7">{body === 'template' ? `★ ${cap(templateType)}` : cap(body)}</text>)}
    {layout.map((node) => {
      const on = open.includes(node.id)
      const dot = !on && ready(node.id)
      const select = () => onNode(node.id)
      return <g key={node.id} role="button" tabIndex={0} aria-label={`${mapNodeTitle(node.id, templateType)}, ${on ? 'open' : dot ? 'ready' : 'closed'}`} data-map-node={node.id} onClick={select}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select() } }} className="cursor-pointer">
        <circle cx={node.x} cy={node.y} r="22" fill="transparent" />
        <circle cx={node.x} cy={node.y} r={node.r} pointerEvents="none" opacity={on || dot ? 1 : 0.4}
          fill={on ? (node.orbit === 'template' ? '#f0b8ff' : '#d6a23e') : 'transparent'} stroke={node.orbit === 'template' ? '#f0b8ff' : '#d6a23e'} strokeWidth="1.5" />
        {dot && <circle cx={node.x + 6} cy={node.y - 6} r="3" pointerEvents="none" className="fill-success" />}
      </g>
    })}
  </svg>
}
