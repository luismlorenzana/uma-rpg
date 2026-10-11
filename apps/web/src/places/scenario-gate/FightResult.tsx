// What a fight paid (D51): EXP and levels for all five, Laurels, Shards at Lv10/20/30/40/50 and any Ticket they made.
import { rpgTreePointsEarned, stockName, type FightResult as Result, type RpgCampaignChapter } from '@rpg/domain'
import type { Campaign } from '../../battle/campaign'
import { ItemIcon } from '../../items/ItemIcon'
import { AtlasSprite } from '../../master/art'
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
          {win && result.firstClear === true && ' · first clear: triple Laurels'}
          {win && result.firstClear === false && ' · replay: a quarter of the first clear'}
        </p>
        {win ? (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {result.laurels > 0 && <span className="flex items-center gap-1.5 rounded-full bg-raised px-3 py-1.5 font-semibold text-laurel"><LaurelIcon size={18} />+{result.laurels} Laurels</span>}
              {result.shards > 0 && <span className="flex items-center gap-1.5 rounded-full bg-raised px-3 py-1.5 font-semibold text-shard"><ShardIcon size={18} />+{result.shards} Shard{result.shards > 1 ? 's' : ''}</span>}
              {result.tickets > 0 && <span className="flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1.5 font-semibold text-ticket"><TicketIcon size={18} />+{result.tickets} Unlock Ticket{result.tickets > 1 ? 's' : ''}!</span>}
            </div>
            {Object.keys(result.tokens ?? {}).length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Tokens">
                {Object.entries(result.tokens).map(([id, n]) => (
                  <li key={id} className="flex items-center gap-1.5 rounded-full bg-raised py-1 pl-1 pr-3 text-[12px] font-semibold">
                    <ItemIcon id={id} size={22} /> {n > 1 ? `${n}× ` : ''}{stockName(id)}
                  </li>
                ))}
              </ul>
            )}
            <ul className="mt-4 space-y-2">
              {result.members.map((m) => {
                const up = m.afterLevel > m.beforeLevel
                const points = rpgTreePointsEarned(m.afterLevel) - rpgTreePointsEarned(m.beforeLevel)
                return (
                  <li key={m.outfitId} className="flex items-center gap-3 rounded-md bg-raised p-2">
                    <AtlasSprite art={campaign.view.art} family="outfit-icons" frameKey={m.outfitId} size={44} />
                    <div className="min-w-0 flex-1 text-[13px]">
                      <p className="flex justify-between gap-2">
                        <span className="truncate font-semibold">{campaign.name(m.outfitId)}</span>
                        <span className="shrink-0 text-accent">+{m.exp} EXP</span>
                      </p>
                      <p className={up ? 'font-semibold text-accent' : 'text-ink-soft'}>
                        {up ? `Level up! Lv ${m.beforeLevel} → ${m.afterLevel}` : `Lv ${m.afterLevel}`}
                        {points > 0 ? ` · +${points} skill points` : ''}
                        {m.shards > 0 ? ' · +1 Shard' : ''}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        ) : (
          <p className="mt-4 text-[14px] text-ink-soft">
            No reward, no penalty: the run is as it was before the fight. Equip skills that hit their weaknesses, refill MP at a Spring, swap in a party that covers them, or level up on earlier stages.
          </p>
        )}
      </div>
      <div className="pb-safe grid grid-cols-2 gap-2 border-t border-hairline bg-panel p-3">
        <button type="button" onClick={onAgain} className="min-h-12 rounded-sm border border-hairline-strong font-semibold">{againLabel ?? (win ? 'Fight again' : 'Retry')}</button>
        <button type="button" onClick={onMap} className="min-h-12 rounded-sm bg-accent font-display font-bold text-accent-ink">Back to the map</button>
      </div>
    </div>
  )
}
