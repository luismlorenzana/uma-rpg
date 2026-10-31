// The compact profile Details sheet (UP26): every live battle row plus the small core/work provenance ledger.
import {
  BATTLE_ENGINE_VERSION, PROFESSION_MAX_LEVEL, activeClass, highestGrade, professionExpToNext, projectRpgStats, umaBattleSheet, umaPick, umaProfile, umaTrade,
  type OwnedUma, type RosterOutfit, type SheetGroup, type SheetRow,
} from '@rpg/domain'
import { useState, type ReactNode } from 'react'
import { tradeLabel } from '../../save/trade'
import { BottomSheet } from '../../ui/BottomSheet'
import * as copy from './copy'

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
  const [formula, setFormula] = useState(false)
  const classId = activeClass(outfit, uma, tier)
  const core = projectRpgStats(umaProfile(outfit, uma, tier, classId), BATTLE_ENGINE_VERSION)
  const groups = umaBattleSheet(outfit, uma, classId, tier, BATTLE_ENGINE_VERSION)
  const grade = highestGrade(uma.craft.level)
  const nextGrade = grade < 10 ? { grade: grade + 1, craft: 5 * (grade + 1) - 4 } : null
  const craftNext = uma.craft.level < PROFESSION_MAX_LEVEL ? professionExpToNext(uma.craft.level) : null
  if (!open) return null

  return (
    <BottomSheet title="Details" onClose={onClose}>
      <div className="grid grid-cols-2 gap-x-3 text-[13px]" data-profile-details>
        <div className="space-y-2">
          {groups.map((group) => <BattleGroup key={group.title} group={group} />)}
        </div>
        <div className="space-y-2">
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
            className="min-h-11 w-full rounded-sm bg-raised px-2 text-left text-[11px] font-semibold text-ink-soft active:bg-panel">
            How stats add up {formula ? '−' : '+'}
          </button>
          {formula && (
            <div className="space-y-1 text-[10px] leading-tight text-ink-faint" data-stat-formula>
              {copy.statFormulaLines.map((line) => <p key={line}>{line}</p>)}
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
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
  const moon = row.star ?? 0
  const extra = row.extra ?? 0
  const parts = Number.isFinite(total)
    ? copy.statParts(total - (row.gear ?? 0) - extra, row.gear ?? 0, extra - moon, moon)
    : ''
  return <DetailRow label={row.label} value={`${row.value}${row.note ? ` · ${row.note}` : ''}`} parts={parts} />
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-faint">{title}</h3>
      <div className="divide-y divide-hairline/50">{children}</div>
    </section>
  )
}

function DetailRow({ label, value, parts }: { label: string; value: string; parts?: string }) {
  return (
    <div className="py-0.5 leading-[14px]">
      <div className="flex items-baseline justify-between gap-1">
        <span className="shrink-0 whitespace-nowrap text-ink-soft">{label}</span>
        <span className="min-w-0 text-right font-semibold text-ink">{value}</span>
      </div>
      {parts && <StatParts parts={parts} />}
    </div>
  )
}

function StatParts({ parts }: { parts: string }) {
  const [before, moon] = parts.split(' · ★ ')
  return (
    <p className="text-[11px] leading-[11px] text-ink-faint">
      {before}{moon !== undefined && <><span> · </span><span className="text-accent">★ {moon}</span></>}
    </p>
  )
}
