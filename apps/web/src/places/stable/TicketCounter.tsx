import { useActiveTier, useWorld } from '../../save/game'
import { TicketIcon } from '../../ui/icons'

/** The Stable header's counter: Uma Tickets left. Tier 1 only: Umas are unlocked there (D5). */
export default function TicketCounter() {
  const tickets = useWorld()?.wallet.unlockTickets ?? 0
  const tierOne = useActiveTier() === 1
  if (!tierOne) return null
  return (
    <span className="flex items-center gap-1 font-display text-[15px] font-bold" aria-label={`${tickets} Uma Tickets`}>
      <TicketIcon size={20} /> {tickets}
    </span>
  )
}
