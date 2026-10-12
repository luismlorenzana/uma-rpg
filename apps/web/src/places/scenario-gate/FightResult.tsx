// What a fight paid (D51, D102): EXP and levels for all five with every bar she filled (her class, five weapons, five
// armor kinds, her Bonds with her Heroes, D106), Laurels, Marks, Shards at Lv10/20/30/40/50 and any Ticket they made.
import {
  BOND_EXP_TO_NEXT, BOND_MAX_LEVEL, heroLimit, rpgExpToNext, RPG_TIER_MAX_LEVEL, type FightResult as Result, type RankGain, type RpgCampaignChapter,
  type RpgClass,
} from '@rpg/domain'
import { Bar, CLASS_LABEL } from '../../battle/labels'
import type { Campaign } from '../../battle/campaign'
import { AtlasSprite } from '../../master/art'
import { RankCells, RankRow, type RankCell } from '../../ui/RankBars'
import { HelpButton } from '../../ui/HelpButton'
import { LaurelIcon, ShardIcon, TicketIcon } from '../../ui/icons'

export function FightResult({ campaign, chapter, result, onAgain, onMap, againLabel }: {
  campaign: Campaign
  chapter: RpgCampaignChapter
  result: Result
  onAgain: () => void
  onMap: () => void
  againLabel?: string
}) {
  const win = result.outcome === 'victory'
  const node = chapter.nodes.find((n) => n.id === result.nodeId)
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-page">
      <div className="pt-safe min-h-0 flex-1 overflow-y-auto p-4">
        <p className="text-[12px] text-ink-faint">{chapter.title} · {node?.name}</p>
        <h1 className={`font-display text-4xl font-extrabold ${win ? 'text-accent' : 'text-ink-soft'}`}>{win ? 'Victory!' : 'Defeated'}</h1>
        <p className="text-[13px] text-ink-soft">
          {result.rounds > 0 ? `${result.rounds} round${result.rounds === 1 ? '' : 's'}`
            : `Swept ${'swept' in result && (result as { swept: number }).swept > 1 ? `${(result as { swept: number }).swept} times` : 'with a ticket'}`}
          {win && result.firstClear === true && ' · First clear!'}
        </p>
        {win ? (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {result.laurels > 0 && <span className="flex items-center gap-1.5 rounded-full bg-raised px-3 py-1.5 font-semibold text-laurel"><LaurelIcon size={18} />+{result.laurels} Laurels</span>}
              {result.shards > 0 && <span className="flex items-center gap-1.5 rounded-full bg-raised px-3 py-1.5 font-semibold text-shard"><ShardIcon size={18} />+{result.shards} Shard{result.shards > 1 ? 's' : ''}</span>}
              {result.tickets > 0 && <span className="flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1.5 font-semibold text-ticket"><TicketIcon size={18} />+{result.tickets} Unlock Ticket{result.tickets > 1 ? 's' : ''}!</span>}
            </div>
            {(result.gearMarks > 0 || result.classMarks > 0) && (
              <p className="mt-2 text-[12px] font-semibold text-ink-soft">
                {[result.gearMarks > 0 ? `+${result.gearMarks} Gear Marks` : '', result.classMarks > 0 ? `+${result.classMarks} Class Marks` : ''].filter(Boolean).join(' · ')}
              </p>
            )}
            <ul className="mt-4 space-y-2">
              {result.members.map((m) => {
                const up = m.afterLevel > m.beforeLevel
                const next = m.afterLevel < RPG_TIER_MAX_LEVEL ? rpgExpToNext(m.afterLevel) : 0
                const cls = m.ranks.find((g) => g.ref.kind === 'class')
                const cells = (kind: 'weapon' | 'armor'): RankCell[] => m.ranks.filter((g): g is RankGain & { ref: { kind: typeof kind } } => g.ref.kind === kind)
                  .map((g) => ({ key: `${kind}:${g.ref.id}`, kind, id: g.ref.id as RankCell['id'], track: g.after, before: g.before }))
                return (
                  <li key={m.outfitId} className="space-y-1.5 rounded-md bg-raised p-2">
                    <div className="flex items-center gap-3">
                      <AtlasSprite art={campaign.view.art} family="outfit-icons" frameKey={m.outfitId} size={44} />
                      <div className="min-w-0 flex-1 text-[13px]">
                        <p className="flex justify-between gap-2">
                          <span className="truncate font-semibold">{campaign.name(m.outfitId)}</span>
                          <span className="shrink-0 text-accent">+{m.exp} EXP</span>
                        </p>
                        <p className={up ? 'font-semibold text-accent' : 'text-ink-soft'}>
                          {up ? `Level up! Lv ${m.beforeLevel} → ${m.afterLevel}` : `Lv ${m.afterLevel}`}
                          {m.shards > 0 ? ' · +1 Shard' : ''}
                        </p>
                        <Bar className="mt-0.5" value={next ? m.afterExp : 1} max={next || 1} tone="exp" />
                      </div>
                    </div>
                    {cls && <RankRow label={CLASS_LABEL[cls.ref.id as RpgClass]} kind="class" track={cls.after} before={cls.before} gain={cls.exp} />}
                    <RankCells label="Weapon Ranks" cells={cells('weapon')} />
                    <RankCells label="Armor Ranks" cells={cells('armor')} />
                    {(m.bonds ?? []).map((b) => {
                      const bondUp = b.after.level > b.before.level
                      const top = b.after.level >= BOND_MAX_LEVEL
                      return (
                        <div key={b.limit} className="text-[12px]">
                          <p className="flex items-baseline justify-between gap-2">
                            <span className="truncate">Bond · {heroLimit(b.limit).name} <span className="font-semibold">{b.after.level}</span>{top ? ' · Max' : ''}</span>
                            <span className={`shrink-0 ${bondUp ? 'font-semibold text-accent' : 'text-ink-faint'}`}>{bondUp ? `Bond up! ${b.before.level} → ${b.after.level}` : `+${b.exp}`}</span>
                          </p>
                          <Bar className="mt-0.5" value={top ? 1 : b.after.exp} max={top ? 1 : BOND_EXP_TO_NEXT} tone="limit" />
                        </div>
                      )
                    })}
                  </li>
                )
              })}
            </ul>
          </>
        ) : (
          <div className="mt-4 flex items-center justify-center gap-1 text-[14px] text-ink-soft">
            No penalty
            <HelpButton title="Tips">
              <p>Nothing is lost: MP is as it was before the fight.</p>
              <p>Equip skills that hit the foes' weaknesses, refill MP at a Spring, swap in a party whose weapons cover them, or level up on earlier stages.</p>
            </HelpButton>
          </div>
        )}
      </div>
      <div className="pb-safe grid grid-cols-2 gap-2 border-t border-hairline bg-panel p-3">
        <button type="button" onClick={onAgain} className="min-h-12 rounded-sm border border-hairline-strong font-semibold">{againLabel ?? (win ? 'Fight again' : 'Retry')}</button>
        <button type="button" onClick={onMap} className="min-h-12 rounded-sm bg-accent font-display font-bold text-accent-ink">Back to the map</button>
      </div>
    </div>
  )
}
