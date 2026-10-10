import { useGame } from '../save/game'
import { LaurelIcon, ShardIcon, TicketIcon } from '../ui/icons'

function Amount({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <span className="flex items-center gap-1" aria-label={`${value} ${label}`}>
      {icon}
      <span className="font-display text-[15px] font-bold tabular-nums">{value}</span>
    </span>
  )
}

/** Trainer, tier world and wallet. Tapping it opens the Account (a hidden Town place). */
export function AccountBar({ onOpenAccount }: { onOpenAccount: () => void }) {
  const save = useGame((s) => s.save)
  const sync = useGame((s) => s.sync)
  const wallet = save?.tierWorlds['1']?.wallet
  const name = save?.account.trainerName ?? ''
  return (
    <header className="pt-safe relative z-20 border-b border-hairline bg-panel/95 backdrop-blur">
      <button type="button" onClick={onOpenAccount} className="flex min-h-13 w-full items-center gap-2.5 px-3 text-left" aria-label={`Account: ${name}, Tier 1`}>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-base font-bold text-accent-ink">
          {name.slice(0, 1).toUpperCase() || '?'}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-[15px] font-bold leading-tight">{name}</span>
          <span className="flex items-center gap-1.5 text-[11px] text-ink-soft">
            <span className="rounded-full border border-accent/50 px-1.5 font-semibold text-accent">Tier 1</span>
            {sync === 'offline' && <span>Offline</span>}
            {sync === 'error' && <span>Sync paused</span>}
          </span>
        </span>
        <span className="ml-auto flex items-center gap-3">
          <Amount icon={<TicketIcon size={20} />} value={wallet?.unlockTickets ?? 0} label="Unlock Tickets" />
          <Amount icon={<ShardIcon size={18} />} value={wallet?.shards ?? 0} label="Shards" />
          <Amount icon={<LaurelIcon size={20} />} value={wallet?.laurels ?? 0} label="Laurels" />
        </span>
      </button>
    </header>
  )
}
