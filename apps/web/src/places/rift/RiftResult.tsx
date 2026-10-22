// The Rift's result (H50): Victory or Defeated and the rounds; a front's stage or seal, the Convergence's fight, or an
// Echo's rank bars and Marks (no EXP: Echoes pay ranks only, R6). An achievement earned plays its cut-in first (H49).
import { RIFT_FRONTS, type RankGain, type RpgClass } from '@rpg/domain'
import type { RiftFightResult } from '@rpg/domain/rift'
import { AtlasSprite } from '@luismlorenzana/uma-kit/content'
import { useState } from 'react'
import { AchievementCutIn } from '../../achievements/AchievementCutIn'
import type { Campaign } from '../../battle/campaign'
import { CLASS_LABEL } from '../../battle/labels'
import { FrontCrest } from '../../battle/pixel-icons'
import { RankCells, RankRow, type RankCell } from '../../ui/RankBars'
import { riftRefTitle, riftResultView } from './rift-view'

export function RiftResult({ campaign, result, onAgain, onBack, againLabel, error }: {
  campaign: Campaign
  result: RiftFightResult
  onAgain: () => void
  onBack: () => void
  /** Overrides the "again" button's words (a Sweep's ticket count). */
  againLabel?: string
  error?: string | null
}) {
  const [cutIn, setCutIn] = useState(result.earned.length > 0)
  const view = riftResultView(result)
  const win = result.outcome === 'victory'
  const { ref } = result
  const front = ref.kind === 'convergence' ? RIFT_FRONTS[ref.fight]! : ref.front
  return (
    <>
      <div data-theme="dark" data-rift-result className="fixed inset-0 z-40 flex flex-col bg-page">
        <div className="pt-safe min-h-0 flex-1 overflow-y-auto">
          <div className="p-4">
          <p className="flex items-center gap-1.5 text-[12px] text-ink-faint"><FrontCrest front={front} />{riftRefTitle(ref)}</p>
          <h1 className={`font-display text-4xl font-extrabold ${win ? 'text-accent' : 'text-ink-soft'}`}>{view.heading}</h1>
          {view.lines.map((line, i) => (
            <p key={i} className={i === 0 ? 'text-[13px] text-ink-soft' : win ? 'mt-2 font-display text-[18px] font-bold' : 'mt-2 text-[14px] text-ink-soft'}>{line}</p>
          ))}
          {win && (result.gearMarks > 0 || result.classMarks > 0) && (
            <p className="mt-2 text-[12px] font-semibold text-ink-soft">
              {[result.gearMarks > 0 ? `+${result.gearMarks} Gear Marks` : '', result.classMarks > 0 ? `+${result.classMarks} Class Marks` : ''].filter(Boolean).join(' · ')}
            </p>
          )}
          {win && result.members.length > 0 && (
            <ul className="mt-4 space-y-2">
              {result.members.map((m) => {
                const cls = m.ranks.find((g) => g.ref.kind === 'class')
                const cells = (kind: 'weapon' | 'armor' | 'accessory'): RankCell[] => m.ranks.filter((g): g is RankGain & { ref: { kind: typeof kind } } => g.ref.kind === kind)
                  .map((g) => ({ key: `${kind}:${g.ref.id}`, kind, id: g.ref.id as RankCell['id'], track: g.after, before: g.before }))
                return (
                  <li key={m.outfitId} className="space-y-1.5 rounded-md bg-raised p-2">
                    <div className="flex items-center gap-3">
                      <AtlasSprite art={campaign.view.art} family="outfit-icons" frameKey={m.outfitId} size={36} />
                      <p className="min-w-0 flex-1 truncate text-[13px] font-semibold">{campaign.name(m.outfitId)}</p>
                    </div>
                    {cls && <RankRow label={CLASS_LABEL[cls.ref.id as RpgClass]} kind="class" track={cls.after} before={cls.before} gain={cls.exp} />}
                    <RankCells label="Weapon Ranks" cells={cells('weapon')} />
                    <RankCells label="Armor Ranks" cells={cells('armor')} />
                    {cells('accessory').length > 0 && <RankCells label="Accessory Ranks" cells={cells('accessory')} />}
                  </li>
                )
              })}
            </ul>
          )}
          {error && <p role="alert" className="mt-4 text-[13px] text-danger">{error}</p>}
          </div>
        </div>
        <div className={`pb-safe grid gap-2 border-t border-hairline bg-panel p-3 ${view.again ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {view.again && <button type="button" onClick={onAgain} className="min-h-12 rounded-sm border border-hairline-strong font-semibold">{againLabel ?? view.again}</button>}
          <button type="button" onClick={onBack} className="min-h-12 rounded-sm bg-accent font-display font-bold text-accent-ink">{view.back}</button>
        </div>
      </div>
      {cutIn && <AchievementCutIn grants={result.earned} onDone={() => setCutIn(false)} />}
    </>
  )
}
