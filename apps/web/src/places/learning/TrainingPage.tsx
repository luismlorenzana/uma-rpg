// The Learning District (S5, D57): class halls train class ranks (each rank opens a skill depth) and armories train
// gear mastery (rank k lets an Uma equip grade-k gear, S7). Running style sets class speed; distance sets mastery speed.
import {
  ARMORIES, availabilityBlock, MAX_QUEUE, CLASS_HALLS, CLASS_MAX_RANK, depthsOpen, facilityOf, GEAR_TYPE_LABEL, jobEndsAt, jobFinished, jobProgress,
  maxRankOf, parseTrack, planTraining, rankOf, SaveRuleError, trackAptitude, tracksAt, trackId, upgradeCost, type Job, type RosterOutfit,
  type TierWorld, type Track,
} from '@rpg/domain'
import { useState } from 'react'
import { CLASS_LABEL } from '../../battle/labels'
import { AtlasSprite } from '../../master/art'
import type { MasterView } from '../../master/master'
import { collect, collectEverything, queueWork, rankUpAndContinue, recall, train, unqueueWork, upgrade, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { formatDuration, useNow } from '../../ui/useNow'
import { MasterGate } from '../MasterGate'
import type { PageProps, PeekProps } from '../registry'
import { QueueList } from '../work/QueueList'

const SPEED: Record<string, string> = { S: '×2 speed', A: '×2 speed', B: '×1.7', C: '×1.5', D: '×1.33', E: '×1.2', F: '×1.1', G: '×1' }
const STYLE_LABEL: Record<string, string> = { front: 'Front', pace: 'Pace', late: 'Late', end: 'End', sprint: 'Sprint', mile: 'Mile', medium: 'Medium', long: 'Long' }

export const trackLabel = (t: Track): string => (t.kind === 'class' ? CLASS_LABEL[t.classId] : GEAR_TYPE_LABEL[t.type])
function aptitudeKey(placeId: string): string {
  return CLASS_HALLS[placeId] ? STYLE_LABEL[CLASS_HALLS[placeId]!.style]! : STYLE_LABEL[ARMORIES[placeId]?.distance ?? '']!
}
function rankNote(t: Track, rank: number): string {
  if (t.kind === 'class') return rank >= CLASS_MAX_RANK ? 'every depth open' : `opens depth ${depthsOpen(rank + 1)}`
  return `equips grade ${rank + 1} ${GEAR_TYPE_LABEL[t.type]}`
}

export default function TrainingPage({ place }: PageProps) {
  return <MasterGate>{(view) => <Training view={view} placeId={place.id} />}</MasterGate>
}

function Training({ view, placeId }: { view: MasterView; placeId: string }) {
  const world = useWorld()
  const now = useNow()
  const [assign, setAssign] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  if (!world) return null
  const facility = facilityOf(world, placeId)
  const tracks = tracksAt(placeId)
  const cost = upgradeCost(world, placeId)
  const run = (op: () => Promise<unknown>) => {
    setMessage(null)
    op().catch((err: unknown) => setMessage(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  return (
    <div className="space-y-3 p-4">
      <section className="rounded-md bg-raised p-3">
        <p className="font-display text-lg font-bold">{tracks.map(trackLabel).join(', ')}</p>
        <p className="text-[13px] text-ink-soft">
          {CLASS_HALLS[placeId] ? 'Class rank: rank 1 learns no skills; each rank opens one more depth, and each promotion spends a Promotion Token of its band (fights drop them).' : 'Gear mastery: rank k lets an Uma equip grade-k gear of that type.'}{' '}
          {aptitudeKey(placeId)} aptitude sets the speed. Training can’t be rushed.
        </p>
        <div className="mt-2 flex items-center justify-between text-[12px] text-ink-soft">
          <span>Level {facility.level} · {facility.jobs.length} slots</span>
          {cost && (
            <button type="button" disabled={world.wallet.laurels < cost.laurels || Object.entries(cost.items).some(([id, n]) => (world.items[id] ?? 0) < n)}
              onClick={() => run(() => upgrade(placeId))} className="min-h-9 rounded-sm bg-panel px-3 font-semibold text-accent disabled:opacity-40">
              Upgrade · {cost.laurels} Laurels
            </button>
          )}
        </div>
      </section>
      <ul className="space-y-2">
        {facility.jobs.map((job, slot) => (
          <li key={slot}>
            {job ? (
              <TrainingCard view={view} world={world} job={job} now={now} tracks={tracks} onCollect={() => run(() => collect(placeId, slot))} onRecall={() => run(() => recall(placeId, slot))}
                onContinue={() => { const o = view.roster.find((r) => r.outfitId === job.outfitId); if (o) run(() => rankUpAndContinue(placeId, slot, o)) }}
                onQueue={(t) => { const o = view.roster.find((r) => r.outfitId === job.outfitId); if (o) run(() => queueWork(placeId, slot, o, trackId(t), 1)) }}
                onUnqueue={(i) => run(() => unqueueWork(placeId, slot, i))} />
            ) : (
              <button type="button" onClick={() => setAssign(slot)} className="flex min-h-16 w-full items-center gap-3 rounded-md border border-dashed border-hairline-strong px-3 text-left">
                <span className="flex size-10 items-center justify-center rounded-full bg-raised text-xl text-ink-faint">+</span>
                <span className="text-[14px] text-ink-soft">Slot {slot + 1} · train an Uma</span>
              </button>
            )}
          </li>
        ))}
      </ul>
      {message && <p className="rounded-sm bg-danger/15 p-2 text-[13px] text-danger">{message}</p>}
      {assign !== null && <AssignTraining view={view} world={world} placeId={placeId} onClose={() => setAssign(null)}
        onStart={(o, t) => train(placeId, assign, o, t).then(() => setAssign(null))} />}
    </div>
  )
}

function TrainingCard({ view, world, job, now, tracks, onCollect, onRecall, onContinue, onQueue, onUnqueue }: {
  view: MasterView; world: TierWorld; job: Job; now: string; tracks: Track[]; onCollect: () => void; onRecall: () => void; onContinue: () => void
  onQueue: (t: Track) => void; onUnqueue: (index: number) => void
}) {
  const track = parseTrack(job.output)
  const outfit = view.roster.find((o) => o.outfitId === job.outfitId)
  const done = jobFinished(job, now) >= job.count
  const uma = world.umas[job.outfitId]
  // The rank each job trains from: today's, plus every job of the same track ahead of it.
  const rankAt = (output: string, ahead: readonly { output: string }[]) => {
    const t = parseTrack(output)
    return t && uma ? rankOf(uma.ranks, t) + ahead.filter((j) => j.output === output).length : 0
  }
  return (
    <div className="rounded-md bg-raised p-3">
      <div className="flex items-center gap-3">
        <AtlasSprite art={view.art} family="outfit-icons" frameKey={job.outfitId} size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold">{outfit?.name ?? job.outfitId}</p>
          <p className="text-[12px] text-ink-soft">{track ? `${trackLabel(track)} → next rank` : job.output}</p>
        </div>
        <span className="shrink-0 text-[12px] text-ink-soft">{done ? 'Done' : formatDuration(jobEndsAt(job) - Date.parse(now))}</span>
      </div>
      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/10">
        <span className="block h-full rounded-full bg-[#a99be0]" style={{ width: `${jobProgress(job, now) * 100}%` }} />
      </span>
      <div className="mt-2 flex gap-2">
        <button type="button" disabled={!done} onClick={onCollect} className="min-h-10 flex-1 rounded-sm bg-accent text-[13px] font-bold text-accent-ink disabled:opacity-35">Rank up</button>
        {done && job.queue.length === 0 && <button type="button" onClick={onContinue} className="min-h-10 rounded-sm bg-panel px-3 text-[13px] font-semibold">Rank up · train next</button>}
        <button type="button" onClick={onRecall} className="min-h-10 rounded-sm bg-panel px-3 text-[13px] text-ink-soft">Recall</button>
      </div>
      <QueueList job={job} now={now} onRemove={onUnqueue} note={track?.kind === 'class' ? 'Each rank starts when the one before ends and spends its Promotion Token then; the queue stops if you have none.' : 'Each rank starts training when the one before ends.'} label={(q) => {
        const t = parseTrack(q.output)
        const from = rankAt(q.output, [job, ...job.queue.slice(0, job.queue.indexOf(q))])
        return t ? `${trackLabel(t)} rank ${from} → ${from + 1}` : q.output
      }} />
      {job.queue.length < MAX_QUEUE && (
        <div className="mt-1 flex flex-wrap gap-1">
          {tracks.map((t) => {
            const from = rankAt(trackId(t), [job, ...job.queue])
            const top = from >= maxRankOf(t)
            return (
              <button key={trackId(t)} type="button" disabled={top} onClick={() => onQueue(t)}
                className="min-h-9 flex-1 rounded-sm border border-dashed border-hairline-strong px-2 text-[12px] font-semibold text-ink-soft disabled:opacity-40">
                {top ? `${trackLabel(t)} · top rank` : `+ Queue ${trackLabel(t)} ${from} → ${from + 1}`}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function AssignTraining({ view, world, placeId, onClose, onStart }: {
  view: MasterView; world: TierWorld; placeId: string; onClose: () => void; onStart: (o: RosterOutfit, t: Track) => Promise<void>
}) {
  const tracks = tracksAt(placeId)
  const [track, setTrack] = useState<Track>(tracks[0]!)
  const [error, setError] = useState<string | null>(null)
  const owned = view.roster.filter((o) => world.umas[o.outfitId])
    .map((o) => ({ o, block: availabilityBlock(world, o.outfitId), plan: planTraining(world, placeId, o, track) }))
    .sort((a, b) => Number(!!a.block) - Number(!!b.block) || (a.plan?.msEach ?? 0) - (b.plan?.msEach ?? 0))
  return (
    <BottomSheet title="Who trains?" onClose={onClose}>
      {tracks.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Gear type">
          {tracks.map((t) => (
            <button key={trackId(t)} type="button" role="tab" aria-selected={trackId(t) === trackId(track)} onClick={() => setTrack(t)}
              className={`min-h-9 rounded-full px-3 text-[13px] font-semibold ${trackId(t) === trackId(track) ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'}`}>{trackLabel(t)}</button>
          ))}
        </div>
      )}
      <ul className="space-y-1.5">
        {owned.length === 0 && <li className="text-[14px] text-ink-soft">Unlock Umas at the Stable first.</li>}
        {owned.map(({ o, block, plan }) => {
          const rank = rankOf(world.umas[o.outfitId]!.ranks, track)
          const why = block ?? plan?.block
          const grade = trackAptitude(track, o.aptitudes)
          return (
            <li key={o.outfitId}>
              <button type="button" disabled={!!why} onClick={() => onStart(o, track).catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t start.'))}
                className="flex w-full items-center gap-3 rounded-sm bg-raised p-2 text-left disabled:opacity-45">
                <AtlasSprite art={view.art} family="outfit-icons" frameKey={o.outfitId} size={40} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{o.name}</span>
                  <span className="block text-[12px] text-ink-soft">
                    {why ?? `${trackLabel(track)} rank ${rank} → ${rank + 1} (${rankNote(track, rank)}) · ${aptitudeKey(placeId)} ${grade} ${SPEED[grade]}${plan && Object.keys(plan.inputs).length > 0 ? ' · spends 1 Promotion Token' : ''}`}
                  </span>
                </span>
                {!why && plan && <span className="shrink-0 text-[12px] font-semibold text-accent">{formatDuration(plan.msEach)}</span>}
              </button>
            </li>
          )
        })}
      </ul>
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
      <p className="mt-3 text-[11px] text-ink-faint">Top rank: {maxRankOf(track)}.</p>
    </BottomSheet>
  )
}

export function TrainingPeek({ place }: PeekProps) {
  const world = useWorld()
  const now = useNow()
  if (!world) return null
  const facility = facilityOf(world, place.id)
  const ready = facility.jobs.some((j) => j && jobFinished(j, now) >= j.count)
  return (
    <div className="space-y-3 p-4">
      <p className="text-[15px] leading-relaxed">{place.blurb}</p>
      <ul className="space-y-1.5">
        {facility.jobs.map((job, i) => {
          const t = job ? parseTrack(job.output) : null
          return (
            <li key={i} className="flex items-center justify-between rounded-sm bg-raised p-2 text-[13px]">
              {job && t ? <><span>{trackLabel(t)}{job.queue.length > 0 ? ` +${job.queue.length}` : ''}</span><span className="text-ink-soft">{jobFinished(job, now) >= job.count ? 'Done' : formatDuration(jobEndsAt(job) - Date.parse(now))}</span></>
                : <span className="text-ink-faint">Slot {i + 1} · free</span>}
            </li>
          )
        })}
      </ul>
      {ready && <button type="button" onClick={() => void collectEverything([place.id])} className="min-h-11 w-full rounded-sm bg-accent font-display font-bold text-accent-ink">Rank up</button>}
    </div>
  )
}
