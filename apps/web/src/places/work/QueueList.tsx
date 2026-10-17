// A slot's queue (QoL, D62): the jobs lined up behind the current one, each starting when the last ends (SC3: times
// from the shared engine, read through the domain's slot view).
import { MAX_QUEUE, type SlotJob } from '@rpg/domain'
import type { ReactNode } from 'react'
import { formatDuration } from '../../ui/useNow'

type Queued = SlotJob['queue'][number]

export function QueueList({ job, now, label, onRemove, onAdd, addLabel = 'Queue next' }: {
  job: SlotJob; now: string; label: (q: Queued) => ReactNode; onRemove: (index: number) => void; onAdd?: () => void; addLabel?: string
}) {
  const t = Date.parse(now)
  if (job.queue.length === 0 && !onAdd) return null
  return (
    <div className="mt-2 space-y-1">
      {job.queue.map((q, i) => (
        <div key={i} className="flex items-center gap-2 rounded-sm bg-panel py-1 pl-2 text-[12px]">
          <span className="text-ink-faint">{i + 1}.</span>
          <span className="flex min-w-0 flex-1 items-center gap-1 truncate">{label(q)}</span>
          <span className="shrink-0 text-ink-soft">{t >= q.endsAt ? 'Done' : t >= q.startsAt ? `ends in ${formatDuration(q.endsAt - t)}` : `in ${formatDuration(q.startsAt - t)}`}</span>
          <button type="button" onClick={() => onRemove(i)} className="flex size-8 shrink-0 items-center justify-center text-ink-faint" aria-label={`Remove queued job ${i + 1}`}>✕</button>
        </div>
      ))}
      {onAdd && !job.done && job.queue.length < MAX_QUEUE && (
        <button type="button" onClick={onAdd} className="min-h-9 w-full rounded-sm border border-dashed border-hairline-strong text-[12px] font-semibold text-ink-soft">
          + {addLabel} ({job.queue.length}/{MAX_QUEUE})
        </button>
      )}
    </div>
  )
}
