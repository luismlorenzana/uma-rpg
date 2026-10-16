import { useWorld } from '../../save/game'
import { TicketIcon } from '../../ui/icons'

/** The Stable header's counter: Uma Tickets left. */
export default function TicketCounter() {
  const tickets = useWorld()?.wallet.unlockTickets ?? 0
  return (
    <span className="flex items-center gap-1 font-display text-[15px] font-bold" aria-label={`${tickets} Uma Tickets`}>
      <TicketIcon size={20} /> {tickets}
    </span>
  )
}
