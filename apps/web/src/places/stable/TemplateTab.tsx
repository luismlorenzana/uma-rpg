// H119's inline Template skeleton: no chip and no sheet, just the template facts beside aptitudes and the racing unique.
import { KEY_LABELS, skillText, type OwnedUma, type RosterOutfit, type RpgClass } from '@rpg/domain'
import { useEffect, useState } from 'react'
import { loadSkills, type MasterView } from '../../master/master'
import * as copy from './copy'
import { templateCard, templateTrade } from './template-view'

const GRADE_COLORS: Readonly<Record<string, string>> = {
  S: '#f2c94c', A: '#f2994a', B: '#eb6fb0', C: '#7fb8ff', D: '#6fd39a', E: '#b8a6f0', F: '#a6b0bc', G: '#8a94a0',
}

export interface TemplateTabProps {
  view: MasterView
  outfit: RosterOutfit
  uma: OwnedUma | null
  classId: RpgClass | null
  tier: 1 | 2 | 3
  stock: Readonly<Record<string, number>>
}

export function TemplateTab({ view, outfit, uma, classId, tier, stock }: TemplateTabProps) {
  const card = templateCard(outfit, uma, classId, tier, stock)
  const [unique, setUnique] = useState<{ name: string; description: string } | null | 'loading'>('loading')
  useEffect(() => {
    let live = true
    loadSkills(view.manifest).then((skills) => live && setUnique(skillText(skills, outfit.uniqueSkillId)), () => live && setUnique(null))
    return () => { live = false }
  }, [outfit, view.manifest])
  const groups = [
    { name: 'Surface', grades: outfit.aptitudes.surface as Record<string, string> },
    { name: 'Distance', grades: outfit.aptitudes.distance as Record<string, string> },
    { name: 'Style', grades: outfit.aptitudes.strategy as Record<string, string> },
  ]

  return (
    <div className="space-y-2.5" data-profile-template>
      <section className="space-y-1.5 rounded-md bg-panel p-2.5">
        <h3 className="font-display text-[15px] font-bold text-accent">★ {card.name}</h3>
        {card.readings.map((reading) => (
          <p key={reading.label} className="text-[12px] text-ink-soft">
            <span className="font-semibold text-ink">{reading.label}</span> · {copy.reading(reading.value, reading.source === 'picked' ? 'Picked' : reading.source)}
          </p>
        ))}
        <p className="text-[12px] text-ink-soft">{templateTrade(outfit, uma)}</p>
        <p className="text-[12px] text-ink-soft">{card.flourish}</p>
        {card.signature && <p className="text-[12px] text-ink-soft">{card.signature}</p>}
        {card.moon?.map((line) => <p key={line} className="text-[12px] text-ink-soft">{line}</p>)}
      </section>

      <section className="space-y-1.5 rounded-md bg-panel p-2.5">
        <h3 className="text-micro">Aptitudes</h3>
        {groups.map((group) => (
          <div key={group.name} className="flex items-start gap-2">
            <h4 className="w-14 shrink-0 pt-1 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">{group.name}</h4>
            <div className="flex min-w-0 flex-1 flex-wrap gap-1">
              {Object.entries(group.grades).map(([key, grade]) => (
                <span key={key} className="flex items-center gap-1 rounded-full bg-raised py-0.5 pl-2 pr-0.5 text-[11px]">
                  {KEY_LABELS[key] ?? key}<GradeChip grade={grade} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-md bg-panel p-2.5">
        <h3 className="text-micro mb-1">Unique skill</h3>
        {unique === 'loading' ? <p className="text-[12px] text-ink-faint">Loading…</p> : unique ? (
          <div>
            <p className="font-display text-[14px] font-bold">{unique.name}</p>
            <p className="text-[12px] text-ink-soft">{unique.description}</p>
          </div>
        ) : <p className="text-[12px] text-ink-faint">Not in the current game data.</p>}
      </section>
    </div>
  )
}

function GradeChip({ grade }: { grade: string }) {
  return (
    <span className="flex size-5 items-center justify-center rounded-full font-display text-[12px] font-bold text-accent-ink"
      style={{ background: GRADE_COLORS[grade] ?? '#999' }}>
      {grade}
    </span>
  )
}
