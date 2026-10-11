// A slot's queue (QoL, D62): the jobs lined up behind the current one, each starting when the last ends.
import { MAX_QUEUE, queueTimeline, type Job, type QueuedJob } from '@rpg/domain'
import type { ReactNode } from 'react'
import { formatDuration } from '../../ui/useNow'

const STOCK_NOTE = 'Each starts when the one before ends; inputs are taken then, and the queue stops if the Warehouse is short.'

export function QueueList({ job, now, label, onRemove, onAdd, addLabel = 'Queue next', note = STOCK_NOTE }: {
  job: Job; now: string; label: (q: QueuedJob) => ReactNode; onRemove: (index: number) => void; onAdd?: () => void; addLabel?: string; note?: string
}) {
  const times = queueTimeline(job)
  const t = Date.parse(now)
  if (job.queue.length === 0 && !onAdd) return null
  return (
    <div className="mt-2 space-y-1">
      {job.queue.map((q, i) => {
        const { startsAt, endsAt } = times[i]!
        return (
          <div key={i} className="flex items-center gap-2 rounded-sm bg-panel py-1 pl-2 text-[12px]">
            <span className="text-ink-faint">{i + 1}.</span>
            <span className="flex min-w-0 flex-1 items-center gap-1 truncate">{label(q)}</span>
            <span className="shrink-0 text-ink-soft">{t >= endsAt ? 'Done' : t >= startsAt ? `ends in ${formatDuration(endsAt - t)}` : `in ${formatDuration(startsAt - t)}`}</span>
            <button type="button" onClick={() => onRemove(i)} className="flex size-8 shrink-0 items-center justify-center text-ink-faint" aria-label={`Remove queued job ${i + 1}`}>✕</button>
          </div>
        )
      })}
      {onAdd && job.queue.length < MAX_QUEUE && (
        <button type="button" onClick={onAdd} className="min-h-9 w-full rounded-sm border border-dashed border-hairline-strong text-[12px] font-semibold text-ink-soft">
          + {addLabel} ({job.queue.length}/{MAX_QUEUE})
        </button>
      )}
      {job.queue.length > 0 && <p className="text-[11px] text-ink-faint">{note}</p>}
    </div>
  )
}
