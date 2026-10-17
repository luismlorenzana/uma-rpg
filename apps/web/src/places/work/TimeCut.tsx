// Speed Tickets on a running job (D74): each takes 30 minutes off; "Finish" spends what's left.
import type { SlotJob } from '@rpg/domain'

export function TimeCut({ job, tickets, onCut }: { job: SlotJob; tickets: number; onCut: (count: number) => void }) {
  if (job.done) return null
  const need = job.ticketsToFinish
  return (
    <>
      <button type="button" disabled={tickets < 1} onClick={() => onCut(1)} className="min-h-10 rounded-sm bg-panel px-2.5 text-[13px] font-semibold disabled:opacity-35"
        aria-label={`Use a Speed Ticket: 30 minutes off (${tickets} held)`}>−30m</button>
      {need > 1 && (
        <button type="button" disabled={tickets < need} onClick={() => onCut(need)} className="min-h-10 rounded-sm bg-panel px-2.5 text-[13px] font-semibold disabled:opacity-35"
          aria-label={`Finish now for ${need} Speed Tickets (${tickets} held)`}>Finish · {need}</button>
      )}
    </>
  )
}
