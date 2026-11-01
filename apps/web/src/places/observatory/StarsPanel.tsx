// The Stars tab (H122; D239 UP15, UP22; proposal §4.3): her Extra Stats map, the six totals and her moon's ★ line. A node opens
// one sheet with what it gives, before → after and Set; Set all sets every jewel that fits behind one confirm. Her moon's nodes
// take no jewel and open with the three moons (D264). The rules are `stars-view.ts`.
import {
  activeClass, classOf, EFFECT_LABEL, isStarMap, mapPoints, moonTemplate, SaveRuleError, umaPick, umaTemplate,
  type GearTier, type OwnedUma, type RosterOutfit, type TierWorld,
} from '@rpg/domain'
import { Fragment, useState } from 'react'
import { pointText } from '../../items/planets'
import { setJewels, setMapJewel } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { actions, extraStats } from '../stable/copy'
import { CHART_BODIES, type StarState } from './star-chart'
import { StatMark } from './star-marks'
import { StarChart } from './StarChart'
import { mapNodeValue, nodeReady, nodeSheet, setAllLines, setAllPlan, type NodeStep } from './stars-view'

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
            <p>Each node opens with its jewel, in order: a star's numeral is its jewel's.</p>
            <p>A Planet node takes three Planet Jewels; a moon's node one Moon Jewel.</p>
            <p>Her moon takes no jewel: node I opens with all three moons' node II, node II with their node IV.</p>
            <p>Every open node counts, from the next fight.</p>
            <p>Set all gives each Moon Jewel to the moon with the fewest open nodes.</p>
          </HelpButton>
        </span>
      </div>
      <StarChart map={map} ready={(id) => nodeReady(map, id, uma.level, world.items)} templateType={template.type} onNode={setNode} />
      <div className="grid grid-cols-3 gap-1 text-center text-[12.5px]" aria-label="Totals">
        {(['hp', 'mp', 'atk', 'matk', 'def', 'mdef'] as const).map((stat) => (
          <span key={stat} className="flex items-center justify-center gap-1 rounded-xs bg-raised p-1"><StatMark stat={stat} className="text-ink-soft" /><span className="font-semibold">{EFFECT_LABEL[stat]}</span> <span className="text-ink-soft">{pointText(stat, shared[stat])}</span></span>
        ))}
      </div>
      {star.length > 0 && (
        <p className="text-center text-[12.5px] font-semibold text-accent">★ {star.map((value, index) => {
          const mark = value.startsWith('Evasion') ? 'evasion' : value.startsWith('Limit') ? 'limit' : null
          return <Fragment key={value}>{index > 0 && ' · '}{mark && <StatMark stat={mark} className="mr-0.5 inline-block align-[-3px]" />}{value}</Fragment>
        })}</p>
      )}
      {node && <NodeSheet outfit={outfit} uma={uma} world={world} tier={tier} node={node} onClose={() => setNode(null)} />}
      {all && <SetAllSheet outfit={outfit} uma={uma} world={world} tier={tier} onClose={() => setAll(false)} />}
    </div>
  )
}

/** A node's sheet, the Stars tab's and Template's ★ Moon rows' (H123). Set stays on the sheet, on Open (G5). The strip moves it along
 * its body, so a body has one sheet, not a sheet on a sheet (G4; H143). */
export function NodeSheet({ outfit, uma, world, tier, node: opened, onClose }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; tier: GearTier; node: string; onClose: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const [node, setNode] = useState(opened)
  const classId = activeClass(outfit, uma, tier)
  const view = nodeSheet(outfit, uma, node, classId, classOf(uma, classId).weapons, tier, world.items)
  const set = () => void setMapJewel(outfit.outfitId, view.jewelId, node).then(() => setError(null), (err: unknown) => setError(failed(err)))
  const pick = (id: string) => { setNode(id); setError(null) }
  const [first, ...rest] = view.changes
  return (
    <BottomSheet title={view.title} onClose={onClose} footer={view.footer
      ? <button type="button" disabled={!view.footer.ready} onClick={set}
          className={`min-h-12 w-full rounded-sm px-3 font-display font-bold ${view.footer.ready ? 'bg-accent text-accent-ink' : 'bg-raised text-[14px] text-ink-soft'}`}>{view.footer.label}</button>
      : undefined}>
      <div className="space-y-1 text-center" data-node-sheet>
        <BodyStrip steps={view.steps} selected={node} onPick={pick} />
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

const DOT: Readonly<Record<StarState, string>> = {
  open: 'border-hairline-strong text-[#101a24]', ready: 'border-2 border-ink text-ink', next: 'border-2 border-ink-soft text-ink', later: 'border-hairline-strong text-ink-soft',
}
/** Every node of a body, its value under it, in the chart's four states; a tap moves the sheet there. */
function BodyStrip({ steps, selected, onPick }: { steps: readonly NodeStep[]; selected: string; onPick: (id: string) => void }) {
  const body = CHART_BODIES.find((b) => b.stars.some((star) => star.id === selected))!
  return (
    <ol className="mb-2 grid auto-cols-fr grid-flow-col" data-body-strip>
      {steps.map((step, index) => {
        const here = step.id === selected
        return (
          <li key={step.id} className="relative">
            {index > 0 && <span aria-hidden="true" className={`absolute right-1/2 top-[16px] h-0.5 w-full ${steps[index - 1]!.state === 'open' && step.state === 'open' ? 'bg-ink-soft' : 'bg-hairline-strong'}`} />}
            <button type="button" onClick={() => onPick(step.id)} aria-current={here ? 'step' : undefined} aria-label={`${step.numeral}, ${step.value}, ${step.state}`} data-step={step.id} data-star-state={step.state}
              className="relative z-10 flex min-h-[58px] w-full flex-col items-center gap-1 pt-0.5">
              <span className={`relative grid size-[30px] place-items-center rounded-full border font-display text-[12px] font-extrabold ${DOT[step.state]} ${here ? 'ring-2 ring-ink-soft ring-offset-2 ring-offset-panel' : ''}`}
                style={{ background: step.state === 'open' ? body.color : 'var(--color-panel)' }}>
                {step.numeral}
                {step.state === 'ready' && <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-panel bg-success" />}
              </span>
              <span className={`text-[11px] leading-tight ${here ? 'font-bold text-ink' : 'text-ink-soft'}`}>{step.value}</span>
            </button>
          </li>
        )
      })}
    </ol>
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
