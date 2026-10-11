// Time Tickets on a running job or training (D74): each takes 30 minutes off; "Finish" spends what's left.
import { jobFinished, ticketsToFinish, type Job } from '@rpg/domain'

export function TimeCut({ job, now, tickets, onCut }: { job: Job; now: string; tickets: number; onCut: (count: number) => void }) {
  if (jobFinished(job, now) >= job.count) return null
  const need = ticketsToFinish(job, now)
  return (
    <>
      <button type="button" disabled={tickets < 1} onClick={() => onCut(1)} className="min-h-10 rounded-sm bg-panel px-2.5 text-[13px] font-semibold disabled:opacity-35"
        aria-label={`Use a Time Ticket: 30 minutes off (${tickets} held)`}>−30m</button>
      {need > 1 && (
        <button type="button" disabled={tickets < need} onClick={() => onCut(need)} className="min-h-10 rounded-sm bg-panel px-2.5 text-[13px] font-semibold disabled:opacity-35"
          aria-label={`Finish now for ${need} Time Tickets (${tickets} held)`}>Finish · {need}</button>
      )}
    </>
  )
}
