// The Template tab (H123; D239 UP16–UP19; proposal §5): her uniqueness in one place. Her template's name, the three readings and
// what each read, her calling and trade, then every ★ piece as a label, a number and a state that opens the sheet where it
// changes: the Flourish sheet, Gear's accessory sheet, Stars' node sheet. Her racing aptitudes follow as her template's sources,
// the three it read ringed. A locked or elsewhere outfit shows the same rows with numbers and no states. The rules are
// `template-view.ts`.
import { pickClass, useActiveTier } from '../../save/game'
import { activeClass, SaveRuleError, skillText, type GearTier, type OwnedUma, type RosterOutfit, type RpgClass, type TierWorld } from '@rpg/domain'
import { useEffect, useState } from 'react'
import { loadSkills, type MasterView } from '../../master/master'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { NodeSheet } from '../observatory/StarsPanel'
import * as copy from './copy'
import { AccessorySheet } from './GearTab'
import { flourishSheet, signatureSlot, templateTab, type RacingChip, type TemplateRow, type TemplateRowKey } from './template-view'

const GRADE_COLORS: Readonly<Record<string, string>> = {
  S: '#f2c94c', A: '#f2994a', B: '#eb6fb0', C: '#7fb8ff', D: '#6fd39a', E: '#b8a6f0', F: '#a6b0bc', G: '#8a94a0',
}
const TONE: Readonly<Record<NonNullable<TemplateRow['tone']>, string>> = { on: 'text-accent', off: 'text-ink-faint', closed: 'text-ink-faint' }

export interface TemplateTabProps {
  view: MasterView
  outfit: RosterOutfit
  uma: OwnedUma | null
  world: TierWorld | null
  tier: GearTier
}

type Sheet = TemplateRowKey | 'racing'

export function TemplateTab({ view, outfit, uma, world, tier }: TemplateTabProps) {
  const [sheet, setSheet] = useState<Sheet | null>(null)
  const active = useActiveTier()
  const classId = uma ? activeClass(outfit, uma, active) : null
  const tab = templateTab(outfit, uma, classId, tier)
  const close = () => setSheet(null)
  return (
    <div className="space-y-2" data-profile-template>
      <div className="flex min-h-11 items-center justify-between gap-2">
        <h3 className="min-w-0 font-display text-[22px] font-extrabold leading-tight"><span className="text-accent">★</span> {tab.name}</h3>
        <HelpButton title="Template">
          <p>Calling: her best running styles.</p>
          <p>Stride: her longest distance at her best grade.</p>
          <p>Knack: her top growth, which names her signature family.</p>
          <p>★ Flourish works as any class of her calling's family.</p>
          <p>★ Signature adds ATK and M.ATK while a slot at G1 or more wears her family.</p>
          <p>★ Moon I opens with all three moons' node II, ★ Moon II with their node IV.</p>
        </HelpButton>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {tab.readings.map((reading) => (
          <div key={reading.label} className="min-w-0 rounded-sm bg-raised px-1.5 py-1 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-faint">{reading.label}</p>
            <p className="text-[12.5px] font-semibold">{reading.value}</p>
            <p className="text-[11px] leading-tight text-ink-soft">from {reading.source}</p>
          </div>
        ))}
      </div>
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-x-2 px-1 text-[12.5px]">
        <p className="font-semibold">{tab.calling}</p>
        <p className="text-ink-soft">{tab.trade}</p>
      </div>
      <div className="space-y-1">
        {tab.rows.map((row) => <Row key={row.key} row={row} onOpen={uma ? () => setSheet(row.key) : undefined} />)}
      </div>
      <section className="space-y-1 rounded-sm bg-raised p-2" aria-label="Racing">
        {tab.racing.groups.map((group) => (
          <div key={group.name} className="flex items-start gap-2">
            <h4 className="w-16 shrink-0 pt-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-faint">{group.name}</h4>
            <div className="flex min-w-0 flex-1 flex-wrap gap-1">{group.chips.map((chip) => <Chip key={chip.key} chip={chip} />)}</div>
          </div>
        ))}
        {tab.racing.growth && <p className="text-[12.5px] text-ink-soft">{tab.racing.growth}</p>}
      </section>
      <button type="button" onClick={() => setSheet('racing')} className="flex min-h-11 w-full items-center justify-between gap-2 rounded-sm bg-raised px-2.5 text-left">
        <span className="text-[12.5px] font-semibold">{copy.racingSkill}</span>
        <span className="text-ink-faint">›</span>
      </button>

      {sheet === 'racing' && <RacingSkillSheet view={view} outfit={outfit} onClose={close} />}
      {uma && world && classId && sheet === 'flourish' && <FlourishSheet outfit={outfit} uma={uma} classId={classId} tier={active} onClose={close} />}
      {uma && world && sheet === 'signature' && <AccessorySheet outfit={outfit} uma={uma} world={world} tier={tier} slot={signatureSlot(uma, tab.family)} onClose={close} />}
      {uma && world && (sheet === 'moon-1' || sheet === 'moon-2') && <NodeSheet outfit={outfit} uma={uma} world={world} tier={tier} node={sheet === 'moon-1' ? 'template:1' : 'template:2'} onClose={close} />}
    </div>
  )
}

/** A ★ piece: label, number and state in one row; it opens its sheet, or reads only on a locked outfit. */
function Row({ row, onOpen }: { row: TemplateRow; onOpen?: () => void }) {
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-semibold">{row.label}</span>
        <span className="block text-[12.5px] text-ink-soft">{row.number}</span>
      </span>
      {row.state && <span className={`shrink-0 text-[12.5px] font-semibold ${row.tone ? TONE[row.tone] : ''}`}>{row.state}</span>}
      {row.dot && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-success" />}
      {onOpen && <span className="shrink-0 text-ink-faint">›</span>}
    </>
  )
  return onOpen
    ? <button type="button" onClick={onOpen} data-template-row={row.key} aria-label={`${row.label}, ${row.number}, ${row.state ?? ''}${row.dot ? ', ready' : ''}`}
        className="flex min-h-11 w-full items-center gap-2 rounded-sm bg-raised px-2.5 py-1 text-left">{body}</button>
    : <div data-template-row={row.key} className="flex min-h-11 items-center gap-2 rounded-sm bg-raised px-2.5 py-1">{body}</div>
}

function Chip({ chip }: { chip: RacingChip }) {
  return (
    <span className={`flex items-center gap-1 rounded-full bg-panel py-0.5 pl-2 pr-0.5 text-[11px] ${chip.ring ? 'ring-2 ring-accent' : ''}`}>
      {chip.label}
      <span className="flex size-5 items-center justify-center rounded-full font-display text-[12.5px] font-bold text-accent-ink" style={{ background: GRADE_COLORS[chip.grade] ?? '#999' }}>{chip.grade}</span>
    </span>
  )
}

/** The Flourish sheet: its shape and number, what it works as, how it stands; while it's off, her family's classes and one free
 * action. The sheet stays open on its new state (G5). */
function FlourishSheet({ outfit, uma, classId, tier, onClose }: { outfit: RosterOutfit; uma: OwnedUma; classId: RpgClass; tier: number; onClose: () => void }) {
  const [selected, setSelected] = useState<RpgClass | null>(null)
  const [error, setError] = useState<string | null>(null)
  const view = flourishSheet(outfit, uma, classId, tier, selected)
  const act = () => {
    if (!view.footer) return
    setError(null)
    pickClass(outfit.outfitId, view.footer.classId).catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  return (
    <BottomSheet title="★ Flourish" onClose={onClose} footer={view.footer
      ? <button type="button" onClick={act} className="min-h-12 w-full rounded-sm bg-accent px-3 font-display font-bold text-accent-ink">{view.footer.label}</button>
      : undefined}>
      <div className="space-y-2 text-center" data-flourish-sheet>
        <p className="font-display text-[22px] font-extrabold leading-tight">{view.shape}</p>
        <p className="text-[12.5px] text-ink-soft">{view.works}</p>
        <p className="text-[14px] font-semibold">{view.now}</p>
        {view.chips.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1" role="radiogroup" aria-label="Her family">
            {view.chips.map((chip) => (
              <button key={chip.classId} type="button" role="radio" aria-checked={chip.selected} disabled={!chip.tappable} onClick={() => setSelected(chip.classId)}
                className={`min-h-11 rounded-sm bg-raised px-3 text-[12.5px] font-semibold ${chip.selected ? 'ring-2 ring-accent' : ''} ${chip.tappable ? '' : 'opacity-40'}`}>{chip.name}</button>
            ))}
          </div>
        )}
        {error && <p className="text-[13px] text-danger">{error}</p>}
      </div>
    </BottomSheet>
  )
}

/** Her racing skill's name and text, from the master data. */
function RacingSkillSheet({ view, outfit, onClose }: { view: MasterView; outfit: RosterOutfit; onClose: () => void }) {
  const [skill, setSkill] = useState<{ name: string; description: string } | null | 'loading'>('loading')
  useEffect(() => {
    let live = true
    loadSkills(view.manifest).then((skills) => live && setSkill(skillText(skills, outfit.uniqueSkillId)), () => live && setSkill(null))
    return () => { live = false }
  }, [outfit, view.manifest])
  return (
    <BottomSheet title={copy.racingSkill} onClose={onClose}>
      {skill === 'loading' ? <p className="text-[14px] text-ink-faint">Loading…</p> : skill ? (
        <div className="space-y-1">
          <p className="font-display text-[14px] font-bold">{skill.name}</p>
          <p className="text-[14px] text-ink-soft">{skill.description}</p>
        </div>
      ) : <p className="text-[14px] text-ink-faint">Not in the current game data.</p>}
    </BottomSheet>
  )
}
