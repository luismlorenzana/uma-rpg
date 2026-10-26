// "The Wilds are rebuilt" (R2, PP25; profession-progression.md §14.6; H80): the first launch's sheet over the shell, once
// per world with an unseen `grant`, and again from the Account's row. The shell's sheet (the kit's, as the Tier sheet):
// no kit change. Both buttons mark it seen; To the Wilds opens the Wilds page. Lazy: the shell holds only its check.
import { FaceTile } from '@luismlorenzana/uma-kit/album'
import { Sheet } from '@luismlorenzana/uma-kit/ui'
import { useMaster } from '../master/master'
import { useWorld } from '../save/game'
import { tradeLabel, tradeOfWorld } from '../save/trade'
import { GRANT_TITLE, grantLines } from './grant-lines'

export default function GrantSheet({ onLater, onWilds }: { onLater: () => void; onWilds: () => void }) {
  const world = useWorld()
  const master = useMaster()
  const grant = world?.grant
  if (!world || !grant) return null
  const roster = master.status === 'ready' ? master.view.roster : null
  const names = new Map(roster?.map((outfit) => [outfit.outfitId, outfit.name]) ?? [])
  const tradeOf = roster ? tradeOfWorld(world, roster) : () => null
  const lines = grantLines(grant, (id) => {
    const name = names.get(id)
    const trade = tradeOf(id)
    return name ? { name, trade: trade ? tradeLabel(trade) : null } : undefined
  })
  const part = (title: string, text: string | null) => text && (
    <section>
      <h3 className="text-micro mb-0.5">{title}</h3>
      <p className="text-[14px]">{text}</p>
    </section>
  )
  return (
    <Sheet open onClose={onLater} title={GRANT_TITLE} footer={
      <div className="flex gap-2">
        <button type="button" onClick={onWilds} className="min-h-11 flex-1 rounded-sm bg-accent font-display font-bold text-accent-ink">To the Wilds</button>
        <button type="button" onClick={onLater} className="min-h-11 flex-1 rounded-sm bg-sunken font-semibold">Later</button>
      </div>
    }>
      <div className="space-y-3" data-grant-sheet>
        <p className="text-[14px] text-ink-soft">{lines.lead}</p>
        <div className="rounded-md bg-raised p-3 text-center">
          <p className="font-display text-2xl font-bold text-accent" data-grant-tickets>{lines.tickets}</p>
          <p className="mt-0.5 text-[13px] text-ink-soft">{lines.hours}</p>
        </div>
        {part('What went', lines.went)}
        {part('What came back', lines.back)}
        {part('What stays', lines.stays)}
        {(lines.umas.length > 0 || lines.floor) && (
          <section>
            <h3 className="text-micro mb-1">By Uma</h3>
            <ul className="divide-y divide-hairline rounded-md bg-raised" data-grant-umas>
              {lines.umas.map((uma) => (
                <li key={uma.outfitId} className="flex min-h-12 items-center gap-2 px-2 py-1.5">
                  <FaceTile outfitId={uma.outfitId} size={32} round label={uma.name} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-1.5">
                      <span className="truncate text-[13px] font-semibold">{uma.name}</span>
                      {uma.trade && <span className="shrink-0 text-[11px] text-ink-faint">{uma.trade}</span>}
                    </span>
                    <span className="block text-[12px] tabular-nums text-ink-soft">{uma.line}</span>
                  </span>
                </li>
              ))}
              {lines.floor && <li className="px-2 py-2 text-[12px] font-semibold" data-grant-floor>{lines.floor}</li>}
            </ul>
          </section>
        )}
        <p className="text-[12px] text-ink-faint">{lines.footer}</p>
      </div>
    </Sheet>
  )
}
