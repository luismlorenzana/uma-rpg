// The compact profile Details sheet (UP26, H140): two pages in one sheet. Details opens on her damage and her final stats; All stats
// holds every live battle row and the small core/work provenance ledger. A sheet never opens a sheet (G4), so the page swaps.
import {
  BATTLE_ENGINE_VERSION, PROFESSION_MAX_LEVEL, activeClass, highestGrade, professionExpToNext, projectRpgStats, umaBattleSheet, umaDamageSheet, umaPick, umaProfile, umaTrade,
  type OwnedUma, type RosterOutfit, type SheetGroup, type SheetRow,
} from '@rpg/domain'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { tradeLabel } from '../../save/trade'
import { BottomSheet } from '../../ui/BottomSheet'
import { StatMark } from '../observatory/star-marks'
import * as copy from './copy'
import { DamageCard, StatParts } from './DamageCard'
import { statTiles } from './damage-view'

export interface DetailsSheetProps {
  open: boolean
  onClose: () => void
  outfit: RosterOutfit
  uma: OwnedUma
  tier: number
}

const CORE = [
  ['Speed', 'speed'], ['Stamina', 'stamina'], ['Power', 'power'], ['Guts', 'guts'], ['Wit', 'wit'],
] as const

export function DetailsSheet({ open, onClose, outfit, uma, tier }: DetailsSheetProps) {
  const [page, setPage] = useState<'details' | 'all'>('details')
  const top = useRef<HTMLDivElement>(null)
  useEffect(() => { top.current?.closest('.overflow-y-auto')?.scrollTo?.(0, 0) }, [page])
  if (!open) return null
  const classId = activeClass(outfit, uma, tier)
  const groups = umaBattleSheet(outfit, uma, classId, tier, BATTLE_ENGINE_VERSION)
  const damage = umaDamageSheet(outfit, uma, classId, tier, BATTLE_ENGINE_VERSION)
  const close = () => { setPage('details'); onClose() }

  return (
    <BottomSheet title={page === 'details' ? copy.details.title : copy.details.all} onClose={close}>
      <div ref={top}>
        {page === 'details'
          ? <FirstPage damage={damage} groups={groups} onAll={() => setPage('all')} />
          : <AllStats outfit={outfit} uma={uma} tier={tier} groups={groups} onBack={() => setPage('details')} />}
      </div>
    </BottomSheet>
  )
}

function FirstPage({ damage, groups, onAll }: { damage: ReturnType<typeof umaDamageSheet>; groups: readonly SheetGroup[]; onAll: () => void }) {
  const tiles = statTiles(groups)
  return (
    <div data-profile-details>
      {damage && <DamageCard sheet={damage} />}
      <section className={damage ? 'mt-3.5' : ''}>
        <h3 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">{copy.details.stats}</h3>
        <ul className={`grid gap-1 ${tiles.length > 5 ? 'grid-cols-3' : 'grid-cols-5'}`} data-stat-tiles>
          {tiles.map(({ label, value, mark }) => (
            <li key={label} className="rounded-xs bg-raised px-0.5 py-1.5 text-center text-[11px] text-ink-soft">
              <b className="block font-display text-[16px] font-bold leading-tight tabular-nums text-ink">{value}</b>
              <span className="inline-flex items-center gap-0.5">{mark && <StatMark stat={mark} />}{label}</span>
            </li>
          ))}
        </ul>
      </section>
      <button type="button" onClick={onAll} className="mt-3 flex min-h-11 w-full items-center justify-between rounded-sm bg-raised px-3 text-[13px] font-semibold active:bg-panel">
        {copy.details.all} <span aria-hidden="true" className="text-ink-soft">›</span>
      </button>
    </div>
  )
}

function AllStats({ outfit, uma, tier, groups, onBack }: { outfit: RosterOutfit; uma: OwnedUma; tier: number; groups: readonly SheetGroup[]; onBack: () => void }) {
  const [formula, setFormula] = useState(false)
  const core = projectRpgStats(umaProfile(outfit, uma, tier, activeClass(outfit, uma, tier)), BATTLE_ENGINE_VERSION)
  const grade = highestGrade(uma.craft.level)
  const nextGrade = grade < 10 ? { grade: grade + 1, craft: 5 * (grade + 1) - 4 } : null
  const craftNext = uma.craft.level < PROFESSION_MAX_LEVEL ? professionExpToNext(uma.craft.level) : null
  return (
    <div className="space-y-2 text-[13px]" data-all-stats>
      <button type="button" onClick={onBack} className="-mt-1 flex min-h-11 items-center text-[13px] font-semibold text-ink-soft">{copy.details.back}</button>
      {groups.map((group) => <BattleGroup key={group.title} group={group} />)}
      <DetailSection title="Core">
        {CORE.map(([label, key]) => (
          <DetailRow key={key} label={label} value={String(core[key])} parts={copy.coreSource(outfit.baseStats[key], outfit.growthRatePercents[key])} />
        ))}
      </DetailSection>
      <DetailSection title="Work">
        <DetailRow label="Craft" value={copy.craftLevel(uma.craft.level)} />
        <DetailRow label="EXP" value={copy.exp(uma.craft.exp, craftNext)} />
        <DetailRow label="Grades" value={copy.gradeGate(grade, nextGrade)} />
        <DetailRow label="Trade" value={tradeLabel(umaTrade(outfit, umaPick(uma)))} />
      </DetailSection>
      <DetailSection title="Since">
        <DetailRow label="Unlocked" value={new Date(uma.unlockedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} />
      </DetailSection>
      <button type="button" onClick={() => setFormula((value) => !value)} aria-expanded={formula}
        className="min-h-11 w-full rounded-sm bg-raised px-3 text-left text-[13px] font-semibold active:bg-panel">
        How stats add up {formula ? '−' : '+'}
      </button>
      {formula && (
        <div className="space-y-1 text-[11px] leading-tight text-ink-soft" data-stat-formula>
          {copy.statFormulaLines.map((line) => <p key={line}>{line}</p>)}
        </div>
      )}
    </div>
  )
}

function BattleGroup({ group }: { group: SheetGroup }) {
  return (
    <DetailSection title={group.title}>
      {group.rows.map((row, index) => <BattleRow key={`${row.label}-${index}`} row={row} />)}
    </DetailSection>
  )
}

function BattleRow({ row }: { row: SheetRow }) {
  const total = Number(row.value)
  const gear = row.gear ?? 0, accessory = row.accessory ?? 0, extra = row.extra ?? 0, moon = row.star ?? 0
  const parts = Number.isFinite(total) ? copy.statPartList(total - gear - extra, gear - accessory, accessory, extra - moon, moon) : []
  return <DetailRow label={row.label} value={`${row.value}${row.note ? ` · ${row.note}` : ''}`} parts={parts.length > 0 && <StatParts parts={parts} />} />
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-soft">{title}</h3>
      <div className="divide-y divide-hairline">{children}</div>
    </section>
  )
}

function DetailRow({ label, value, parts }: { label: string; value: string; parts?: ReactNode }) {
  return (
    <div className="py-1 leading-tight">
      <div className="flex items-baseline justify-between gap-2">
        <span className="shrink-0 whitespace-nowrap text-ink-soft">{label}</span>
        <span className="min-w-0 text-right font-semibold text-ink">{value}</span>
      </div>
      {parts && <p className="text-[11px] leading-[14px] text-ink-soft">{parts}</p>}
    </div>
  )
}
