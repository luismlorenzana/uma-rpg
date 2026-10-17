// A working facility (S4, S6, S7; D55, D58, D59, D144): the eight Wilds sites gather raw items, the Workbench refines them
// 1 → 1, the Forge crafts gear and the Lapidary cuts Star Gems. Each slot holds one Uma's job: what she makes, how many,
// how far along. Collect pays the output and her Craft EXP. The jobs run in the shared engine (SC3); this page reads them
// through the domain's slot view until SC4's screens.
import {
  activeClass, availabilityBlock, BRIDGES, CRAFT_LABEL, CRAFT_SHORT, facilityTargets, targetPlan, type TargetNeed, EFFECT_LABEL, EQUIP_LABEL, EQUIP_TYPES, gearById, gearId, type EquipType, facilityLevel, facilitySpec, facilityView, familyById, FACILITY_SLOTS, FACILITY_SPEED, gemById, GEMS, gemNodes, gradeUnlockLevel, ITEM_EFFECTS, ITEM_FAMILIES,
  itemById, itemMinutes, makeMinutes, maxJobCount, MINUTE, planJob, REFINE_BATCHES, refineMinutes, SaveRuleError,
  stockName, upgradeCost, type Gem, type GemKind, type RosterOutfit, type SlotJob, type StoppedQueue, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { nodeLabel, nodeValue, PLANET_COLOR, PLANET_SHORT } from '../../items/planets'
import { AtlasSprite } from '../../master/art'
import type { MasterView } from '../../master/master'
import { collect, collectEverything, cutTime, dismissWork, queueWork, recall, repeatWork, restartWork, startWork, unqueueWork, upgrade, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { LaurelIcon, TargetIcon } from '../../ui/icons'
import { formatDuration, useNow } from '../../ui/useNow'
import { MasterGate } from '../MasterGate'
import type { PageProps, PeekProps } from '../registry'
import { QueueList } from './QueueList'
import { pieceLine } from '../stable/WeaponSheet'
import { TimeCut } from './TimeCut'


/** A facility's title and its help: what it makes and what it raises. */
function describe(placeId: string): { title: string; help: string[] } {
  const spec = facilitySpec(placeId)!
  const family = spec.family ? familyById(spec.family) : null
  const level = `Each job raises her ${CRAFT_LABEL}; grade g opens at ${CRAFT_LABEL} 5g − 4.`
  if (family) return { title: family.name, help: [`Gathers ${family.name.toLowerCase()}, the ${EFFECT_LABEL[family.effect]} family, ten grades.`, level] }
  if (spec.kind === 'craft') return { title: 'Crafting',
    help: ['Crafts weapons, armor and accessories: two refined items of the grade, from two of the eight families.', level] }
  if (spec.kind === 'cut') return { title: 'Cutting',
    help: ['Cuts Star Gems from refined materials. Setting one at the Observatory opens a node on her Extra Stats map: a moon gem its planet\'s moon, a bridge gem the bridge between two planets, a Sun gem a Sun node.', level] }
  return { title: 'Refining', help: ['Refines raw materials, one into one, in a quarter of the time it took to gather.', level] }
}

export default function FacilityPage({ place }: PageProps) {
  return <MasterGate>{(view) => <Facility view={view} placeId={place.id} />}</MasterGate>
}

function Facility({ view, placeId }: { view: MasterView; placeId: string }) {
  const world = useWorld()
  const now = useNow()
  const [assign, setAssign] = useState<number | null>(null)
  const [want, setWant] = useState<string | null>(null)
  const [queueing, setQueueing] = useState<number | null>(null)
  const [upgrading, setUpgrading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  if (!world) return null
  const facility = facilityView(world, placeId, now)
  const info = describe(placeId)
  // What the targets still need from here (D100), and the first free slot to start one in.
  const classOf = (id: string) => { const o = view.roster.find((r) => r.outfitId === id); return o ? activeClass(o, world.umas[id]!) : 'brawler' }
  const targets = world.targets.length > 0 ? facilityTargets(targetPlan(world, classOf), placeId) : null
  const wanted = new Map((targets ?? []).map((n) => [n.key, n.short]))
  const free = facility.jobs.findIndex((j) => j === null)
  const ready = facility.ready
  const run = (op: () => Promise<unknown>) => {
    setMessage(null)
    op().catch((err: unknown) => setMessage(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  return (
    <div className="space-y-3 p-4">
      <section className="rounded-md bg-raised p-3">
        <div className="-mr-2 -mt-2 flex items-center justify-between">
          <p className="font-display text-lg font-bold">{info.title}</p>
          <HelpButton title={info.title}>{info.help.map((line) => <p key={line}>{line}</p>)}</HelpButton>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-[12px] text-ink-soft">
          <span>Level {facility.level} · {facility.jobs.length} slots{FACILITY_SPEED[facility.level - 1]! > 1 ? ' · 25% faster' : ''}</span>
          {upgradeCost(world, placeId) && (
            <button type="button" onClick={() => setUpgrading(true)} className="min-h-9 rounded-sm bg-panel px-3 font-semibold text-accent">Upgrade</button>
          )}
        </div>
      </section>
      {ready && (
        <button type="button" onClick={() => run(() => collectEverything([placeId]))} className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink">
          Collect everything ready
        </button>
      )}
      {targets && (
        <TargetsCard lines={targets} canStart={free >= 0}
          onPick={(key) => { setWant(key); setAssign(free) }} />
      )}
      <ul className="space-y-2">
        {facility.jobs.map((job, slot) => (
          <li key={slot}>
            {job ? (
              <JobCard view={view} job={job} now={now} placeId={placeId} onCollect={() => run(() => collect(placeId, slot))}
                onRepeat={() => run(() => repeatWork(job.outfitId))}
                onCut={(n) => run(() => cutTime(placeId, slot, n))} onRecall={() => run(() => recall(placeId, slot))} timeTickets={world.wallet.timeTickets}
                onQueue={() => setQueueing(slot)} onUnqueue={(i) => run(() => unqueueWork(placeId, slot, i))} />
            ) : (
              <button type="button" onClick={() => { setWant(null); setAssign(slot) }} className="flex min-h-16 w-full items-center gap-3 rounded-md border border-dashed border-hairline-strong px-3 text-left">
                <span className="flex size-10 items-center justify-center rounded-full bg-raised text-xl text-ink-faint">+</span>
                <span className="text-[14px] text-ink-soft">Slot {slot + 1} · assign an Uma</span>
              </button>
            )}
          </li>
        ))}
      </ul>
      {facility.stopped.map((q) => (
        <StoppedCard key={q.outfitId} view={view} queue={q} onRestart={() => run(() => restartWork(q.outfitId))} onDismiss={() => run(() => dismissWork(q.outfitId))} />
      ))}
      {message && <p className="rounded-sm bg-danger/15 p-2 text-[13px] text-danger">{message}</p>}
      {assign !== null && <AssignSheet view={view} world={world} now={now} placeId={placeId} want={want} wanted={wanted}
        onClose={() => setAssign(null)} onStart={(outfit, output, count) => startWork(placeId, assign, outfit, output, count).then(() => setAssign(null))} />}
      {queueing !== null && facility.jobs[queueing] && (
        <AssignSheet view={view} world={world} now={now} placeId={placeId} wanted={wanted} onClose={() => setQueueing(null)}
          fixed={view.roster.find((o) => o.outfitId === facility.jobs[queueing]!.outfitId)}
          onStart={(outfit, output, count) => queueWork(placeId, queueing, outfit, output, count).then(() => setQueueing(null))} />
      )}
      {upgrading && <UpgradeSheet world={world} placeId={placeId} onClose={() => setUpgrading(false)} onUpgrade={() => upgrade(placeId).then(() => setUpgrading(false))} />}
    </div>
  )
}

/** What the targets still need from this facility (D100), lowest grade first; tap one to start it in a free slot. */
/** What the targets still need from here (D126): every line the Warehouse doesn't cover yet, with what's in it and what's
 * coming; tapping one starts what's still short. */
function TargetsCard({ lines, canStart, onPick }: { lines: TargetNeed[]; canStart: boolean; onPick: (key: string) => void }) {
  const [all, setAll] = useState(false)
  const shown = all ? lines : lines.slice(0, 6)
  return (
    <section className="rounded-md bg-raised p-3">
      <h4 className="text-micro mb-1.5 flex items-center gap-1.5"><TargetIcon size={13} className="text-accent" /> For your targets</h4>
      {lines.length === 0 ? <p className="text-[13px] text-ink-soft">All set here</p> : (
        <ul className="space-y-1">
          {shown.map((n) => (
            <li key={n.key}>
              <button type="button" disabled={!canStart || n.short === 0} onClick={() => onPick(n.key)}
                className="flex w-full items-center gap-2 rounded-sm bg-panel px-2 py-1.5 text-left disabled:cursor-default">
                <ItemIcon id={n.icon} size={28} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold">{n.name} · G{n.grade}</span>
                  <span className="block text-[11px] text-ink-faint">need {n.need} · have {n.have}{n.coming ? ` · ${n.coming} coming` : ''}</span>
                </span>
                {n.short > 0
                  ? <span className="shrink-0 font-display text-[15px] font-bold text-accent">×{n.short}</span>
                  : <span className="shrink-0 text-[11px] font-semibold text-success">On the way</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
      {lines.length > 6 && (
        <button type="button" onClick={() => setAll((v) => !v)} className="mt-1 min-h-9 text-[12px] font-semibold text-accent">
          {all ? 'Show fewer' : `Show all ${lines.length}`}
        </button>
      )}
    </section>
  )
}

/** A queue that couldn't start (SC3): what stopped it, then Restart or Dismiss. */
function StoppedCard({ view, queue, onRestart, onDismiss }: { view: MasterView; queue: StoppedQueue; onRestart: () => void; onDismiss: () => void }) {
  const outfit = view.roster.find((o) => o.outfitId === queue.outfitId)
  const first = queue.requests[0]!
  return (
    <div className="rounded-md border border-hairline-strong p-3">
      <div className="flex items-center gap-3">
        <AtlasSprite art={view.art} family="outfit-icons" frameKey={queue.outfitId} size={36} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold">{outfit?.name ?? queue.outfitId} · queue stopped</p>
          <p className="truncate text-[12px] text-ink-soft">{outputView(first.item).name} ×{first.count}{queue.requests.length > 1 ? ` +${queue.requests.length - 1}` : ''} · {queue.why}</p>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={onRestart} className="min-h-10 flex-1 rounded-sm bg-accent text-[13px] font-bold text-accent-ink">Restart</button>
        <button type="button" onClick={onDismiss} className="min-h-10 rounded-sm bg-panel px-3 text-[13px] text-ink-soft">Dismiss</button>
      </div>
    </div>
  )
}

function JobCard({ view, job, now, placeId, timeTickets, onCollect, onRepeat, onCut, onRecall, onQueue, onUnqueue }: {
  view: MasterView; job: SlotJob; now: string; placeId: string; timeTickets: number; onCollect: () => void; onRepeat: () => void; onCut: (n: number) => void; onRecall: () => void
  onQueue: () => void; onUnqueue: (index: number) => void
}) {
  const item = outputView(job.output)
  const outfit = view.roster.find((o) => o.outfitId === job.outfitId)
  const finished = job.finished
  const readyCount = job.ready
  const done = job.done
  const left = job.endsAt - Date.parse(now)
  return (
    <div className="rounded-md bg-raised p-3">
      <div className="flex items-center gap-3">
        <AtlasSprite art={view.art} family="outfit-icons" frameKey={job.outfitId} size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold">{outfit?.name ?? job.outfitId}</p>
          <p className="flex items-center gap-1 text-[12px] text-ink-soft">
            {item.icon && <ItemIcon id={item.icon} size={20} />}
            <span className="truncate">{item.name} ×{job.count}</span>
          </p>
        </div>
        <span className="shrink-0 text-right text-[12px] text-ink-soft">{done ? 'Done' : formatDuration(left)}<br />{finished}/{job.count}</span>
      </div>
      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/10">
        <span className="block h-full rounded-full bg-accent" style={{ width: `${job.progress * 100}%` }} />
      </span>
      <div className="mt-2 flex gap-2">
        <button type="button" disabled={readyCount <= 0 && !done} onClick={onCollect} className="min-h-10 flex-1 rounded-sm bg-accent text-[13px] font-bold text-accent-ink disabled:opacity-35">
          {done ? `Collect ${readyCount}${job.queue.length > 0 ? ' · next' : ''}` : `Collect${readyCount > 0 ? ` ${readyCount}` : ''}`}
        </button>
        {done && job.queue.length === 0 && (
          <button type="button" onClick={onRepeat} className="min-h-10 rounded-sm bg-panel px-3 text-[13px] font-semibold" aria-label={`Collect and make ${job.count} more`}>
            Repeat ×{job.count}
          </button>
        )}
        <TimeCut job={job} tickets={timeTickets} onCut={onCut} />
        <button type="button" onClick={onRecall} className="min-h-10 rounded-sm bg-panel px-3 text-[13px] text-ink-soft" aria-label={`Recall ${outfit?.name ?? ''} from ${placeId}`}>
          Recall
        </button>
      </div>
      <QueueList job={job} now={now} onAdd={onQueue} onRemove={onUnqueue} label={(q) => (
        <><ItemIcon id={outputView(q.output).icon} size={18} /> {outputView(q.output).name} ×{q.count}</>
      )} />
    </div>
  )
}

/** Pick an Uma, then what she makes, then how many. With `fixed`, she's queueing another job: no Uma to pick, and no
 * stock cap, since its inputs are taken when it starts. */
function AssignSheet({ view, world, now, placeId, fixed, want = null, wanted, onClose, onStart }: {
  view: MasterView; world: TierWorld; now: string; placeId: string; fixed?: RosterOutfit; onClose: () => void
  /** A target's line to start with, once she's chosen; and every line the targets need, to badge (D100). */
  want?: string | null; wanted?: ReadonlyMap<string, number>
  onStart: (outfit: RosterOutfit, output: string, count: number) => Promise<void>
}) {
  const spec = facilitySpec(placeId)!
  const queueing = !!fixed
  const [outfit, setOutfit] = useState<RosterOutfit | null>(fixed ?? null)
  const [output, setOutput] = useState<string | null>(null)
  const [count, setCount] = useState(1)
  const [error, setError] = useState<string | null>(null)
  // Free Umas first, then the highest level here (it sets her speed, D139), then the most EXP into it.
  const owned = view.roster.filter((o) => world.umas[o.outfitId])
    .map((o) => ({ o, block: availabilityBlock(world, o.outfitId, now), prof: world.umas[o.outfitId]!.craft }))
    .sort((a, b) => Number(!!a.block) - Number(!!b.block) || b.prof.level - a.prof.level || b.prof.exp - a.prof.exp || a.o.name.localeCompare(b.o.name))
  const options = outfit
    ? spec.kind === 'gather' ? familyById(spec.family!)!.raw.map((i) => i.id) : ITEM_FAMILIES.flatMap((f) => f.refined.map((i) => i.id))
    : []
  const plan = outfit && output ? planJob(world, placeId, outfit, output, queueing ? 0 : count) : null
  // How many the Warehouse covers: refining needs the raw item, crafting and cutting every material.
  const stock = plan && !queueing && spec.kind !== 'gather' ? makeable(world, plan.inputs) : Infinity
  // Her level sets the time, the same for every grade (D139); the facility's level speeds it.
  const eachMs = (level: number) => (spec.kind === 'refine' ? refineMinutes(level) : spec.kind === 'gather' ? itemMinutes(level) : makeMinutes(level)) * MINUTE /
    FACILITY_SPEED[facilityLevel(world, placeId) - 1]!
  const most = maxJobCount(spec.kind)
  const max = Math.max(1, Math.min(most, stock))
  // Refining comes in batches of ×1, ×4, ×8, ×20 and ×40 (D139); the rest makes 1–10.
  const sizes: readonly number[] = spec.kind === 'refine' ? REFINE_BATCHES : [1, 2, 3, 5, 10]
  const title = !outfit ? 'Who works here?' : !output ? (queueing ? 'Queue: what next?' : 'What does she make?') : 'How many?'
  return (
    <BottomSheet title={title} onClose={onClose} footer={outfit && output && plan ? (
      <button type="button" disabled={!!plan.block} onClick={() => {
        setError(null)
        onStart(outfit, output, Math.min(count, max)).catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t start.'))
      }} className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
        {plan.block ?? `${queueing ? 'Queue' : 'Start'} · ${formatDuration(plan.itemMs * Math.min(count, max))}`}
      </button>
    ) : undefined}>
      {!outfit && (
        <ul className="space-y-1.5">
          {owned.length === 0 && <li className="text-[14px] text-ink-soft">Unlock Umas at the Stable first.</li>}
          {owned.map(({ o, block, prof }) => {
            return (
              <li key={o.outfitId}>
                <button type="button" disabled={!!block} onClick={() => { setOutfit(o); if (want) { setOutput(want); setCount(Math.min(most, wanted?.get(want) ?? 1)) } }} className="flex w-full items-center gap-3 rounded-sm bg-raised p-2 text-left disabled:opacity-45">
                  <AtlasSprite art={view.art} family="outfit-icons" frameKey={o.outfitId} size={40} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold">{o.name}</span>
                    <span className="block text-[12px] text-ink-soft">{block ?? `${formatDuration(eachMs(prof.level))} each at her level`}</span>
                  </span>
                  <span className="shrink-0 text-center leading-none">
                    <span className="block font-display text-[20px] font-bold">{prof.level}</span>
                    <span className="block text-[10px] text-ink-faint">{CRAFT_SHORT} Lv</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {outfit && !output && spec.kind === 'craft' && (
        <CraftPicker world={world} level={world.umas[outfit.outfitId]!.craft.level} queueing={queueing} onPick={(id) => { setOutput(id); setCount(1) }} />
      )}
      {outfit && !output && spec.kind === 'cut' && (
        <GemPicker world={world} level={world.umas[outfit.outfitId]!.craft.level} queueing={queueing} wanted={wanted} onPick={(id) => { setOutput(id); setCount(1) }} />
      )}
      {outfit && !output && (spec.kind === 'gather' || spec.kind === 'refine') && (
        <div className="grid grid-cols-2 gap-1.5">
          {options.map((id) => {
            const out = outputView(id)
            const p = planJob(world, placeId, outfit, id, 1)
            const locked = world.umas[outfit.outfitId]!.craft.level < gradeUnlockLevel(out.grade)
            const have = spec.kind === 'refine' ? (p ? makeable(world, p.inputs) : 0) : null
            return (
              <button key={id} type="button" disabled={locked || (!queueing && have !== null && have < 1)} onClick={() => { setOutput(id); setCount(1) }}
                className="flex items-center gap-2 rounded-sm bg-raised p-2 text-left disabled:opacity-40">
                <ItemIcon id={out.icon} size={32} />
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-semibold">{out.name}</span>
                  <span className="block truncate text-[11px] text-ink-soft">
                    {wanted?.get(id) ? <span className="font-semibold text-accent">Target ×{wanted.get(id)} · </span> : null}
                    {locked ? `Lv${gradeUnlockLevel(out.grade)}` : have !== null ? `${have} to refine` : `${formatDuration(p?.itemMs ?? 0)} each`}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      )}
      {outfit && output && plan && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ItemIcon id={outputView(output).icon} size={48} />
            <div className="text-[14px]">
              <p className="font-semibold">{plan.output.name} · grade {plan.output.grade}</p>
              <p className="text-ink-soft">{formatDuration(plan.itemMs)} each · {plan.expEach} EXP each</p>
            </div>
          </div>
          {Object.keys(plan.inputs).length > 0 && (
            <ul className="flex flex-wrap gap-1.5 text-[12px]">
              {Object.entries(plan.inputs).map(([id, n]) => (
                <li key={id} className="flex items-center gap-1 rounded-sm bg-raised px-2 py-1">
                  <ItemIcon id={id} size={20} /> {stockName(id)} ×{n * Math.min(count, max)}
                  <span className="text-ink-faint">({world.items[id] ?? 0})</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-1.5">
            {sizes.filter((n) => n <= max).concat(max > 1 && !sizes.includes(max) ? [max] : []).map((n) => (
              <button key={n} type="button" onClick={() => setCount(n)} className={`min-h-10 min-w-12 rounded-sm px-3 font-semibold ${Math.min(count, max) === n ? 'bg-accent text-accent-ink' : 'bg-raised'}`}>×{n}</button>
            ))}
          </div>
          <p className="text-[12px] text-ink-soft">
            {Math.min(count, max)} items · {formatDuration(plan.itemMs * Math.min(count, max))} · {plan.expEach * Math.min(count, max)} {CRAFT_SHORT} EXP
          </p>
          <button type="button" onClick={() => setOutput(null)} className="text-[13px] text-ink-soft underline">Choose another item</button>
        </div>
      )}
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </BottomSheet>
  )
}

/** How many the Warehouse covers of a recipe. */
const makeable = (world: TierWorld, inputs: Record<string, number>) => Math.min(...Object.entries(inputs).map(([id, n]) => Math.floor((world.items[id] ?? 0) / n)))

/** The Forge's picker: a type and a grade (her Craft Level opens them). Its 40 types as icons only, four rows of ten
 * (D124, D144): weapons, armor, Orbs, then Talismans and Amulets, each row physical then magical. The picked type's
 * name and recipe show below. */
const FORGE_ROWS: readonly (readonly EquipType[])[] = [
  [...EQUIP_TYPES.filter((t) => ['greatsword', 'axe', 'lance', 'bow', 'katana'].includes(t)), ...EQUIP_TYPES.filter((t) => t.startsWith('tome-'))],
  ['helm', 'cuirass', 'greaves', 'gauntlets', 'boots', 'circlet', 'robe', 'leggings', 'bracers', 'slippers'],
  ['orb-greatsword', 'orb-axe', 'orb-lance', 'orb-bow', 'orb-katana', 'orb-fire', 'orb-ice', 'orb-lightning', 'orb-light', 'orb-dark'],
  [...EQUIP_TYPES.filter((t) => t.startsWith('talisman-')), ...EQUIP_TYPES.filter((t) => t.startsWith('amulet-'))],
]

/** One square icon button of a picker grid. */
function IconPick({ id, on, dim, disabled, label, badge, onClick }: { id: string; on: boolean; dim?: boolean; disabled?: boolean; label: string; badge?: boolean; onClick: () => void }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} aria-label={label} aria-pressed={on} title={label}
      className={`relative flex aspect-square items-center justify-center rounded-xs ${on ? 'bg-accent/25 ring-2 ring-accent' : 'bg-raised'} ${dim ? 'opacity-45' : ''} disabled:opacity-25`}>
      <ItemIcon id={id} size={28} />
      {badge && <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-accent" />}
    </button>
  )
}

/** The grade chips 1–10 a Craft Level opens. */
function GradeChips({ level, grade, onPick }: { level: number; grade: number; onPick: (g: number) => void }) {
  return (
    <div className="grid grid-cols-10 gap-0.5">{Array.from({ length: 10 }, (_, i) => i + 1).map((g) => (
      <button key={g} type="button" disabled={level < gradeUnlockLevel(g)} onClick={() => onPick(g)} aria-label={`Grade ${g}${level < gradeUnlockLevel(g) ? `, needs Craft Lv${gradeUnlockLevel(g)}` : ''}`}
        className={`min-h-8 rounded-full text-[12px] font-semibold ${g === grade ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'} disabled:opacity-35`}>{g}</button>
    ))}</div>
  )
}

/** The picked recipe: its name, what it does, its materials and Next. */
function RecipeCard({ world, id, line, queueing, onPick }: { world: TierWorld; id: string; line: string; queueing: boolean; onPick: (id: string, have: number) => void }) {
  const made = gearById(id) ?? gemById(id)!
  const have = makeable(world, made.inputs)
  return (
    <div className="rounded-sm bg-raised p-2.5">
      <p className="flex items-center gap-2 text-[14px] font-semibold"><ItemIcon id={outputView(id).icon} size={28} /> {made.name} · G{made.grade}</p>
      <p className="mt-0.5 text-[12px] text-ink-soft">{line}</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5 text-[12px]">
        {Object.entries(made.inputs).map(([input, n]) => (
          <li key={input} className="flex items-center gap-1 rounded-sm bg-panel px-2 py-1"><ItemIcon id={input} size={18} /> {stockName(input)} ×{n} <span className="text-ink-faint">({world.items[input] ?? 0})</span></li>
        ))}
      </ul>
      <button type="button" disabled={have < 1 && !queueing} onClick={() => onPick(id, have)} className="mt-2 min-h-11 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
        {have < 1 ? (queueing ? 'Next · none in stock yet' : 'Not enough materials') : `Next · ${have} possible`}
      </button>
    </div>
  )
}

function CraftPicker({ world, level, queueing, onPick }: { world: TierWorld; level: number; queueing: boolean; onPick: (id: string, have: number) => void }) {
  const [type, setType] = useState<EquipType>('greatsword')
  const [grade, setGrade] = useState(1)
  const id = gearId(type, grade)
  return (
    <div className="space-y-2.5">
      <div className="space-y-1" role="group" aria-label="Type">
        {FORGE_ROWS.map((row, r) => (
          <div key={r} className="grid grid-cols-10 gap-0.5">
            {row.map((t, i) => (
              <span key={t} className={i === 5 ? 'border-l border-hairline pl-0.5' : ''}>
                <IconPick id={gearId(t, grade)} on={t === type} label={EQUIP_LABEL[t]} dim={!queueing && makeable(world, gearById(gearId(t, grade))!.inputs) < 1} onClick={() => setType(t)} />
              </span>
            ))}
          </div>
        ))}
      </div>
      <GradeChips level={level} grade={grade} onPick={setGrade} />
      <RecipeCard world={world} id={id} line={pieceLine(id)} queueing={queueing} onPick={onPick} />
    </div>
  )
}

/** The Lapidary's picker (D144): the 100 Star Gems as icons, moons by planet and grade, bridges by pair, then the Sun's
 * four. A gem she can't cut now is dimmed; one her targets need has a dot. */
const GEM_TABS: readonly (readonly [GemKind, string])[] = [['moon', 'Moons'], ['bridge', 'Bridges'], ['sun', 'Sun']]

function GemPicker({ world, level, queueing, wanted, onPick }: {
  world: TierWorld; level: number; queueing: boolean; wanted?: ReadonlyMap<string, number>; onPick: (id: string, have: number) => void
}) {
  const [kind, setKind] = useState<GemKind>('moon')
  const [picked, setPicked] = useState('gem-hp-1')
  const gem = gemById(picked)!
  const of = (test: (g: Gem) => boolean) => GEMS.filter(test)
  const rows: { key: string; label: string; color: string; gems: Gem[] }[] = kind === 'moon'
    ? ITEM_EFFECTS.map((e) => ({ key: e, label: PLANET_SHORT[e], color: PLANET_COLOR[e], gems: of((g) => g.kind === 'moon' && g.effects[0] === e) }))
    : kind === 'bridge'
      ? BRIDGES.map(([a, b]) => ({ key: `${a}-${b}`, label: `${PLANET_SHORT[a]}·${PLANET_SHORT[b]}`, color: PLANET_COLOR[a], gems: of((g) => g.kind === 'bridge' && g.effects[0] === a && g.effects[1] === b) }))
      : [{ key: 'sun', label: 'Sun', color: '#f5c542', gems: of((g) => g.kind === 'sun') }]
  const node = gemNodes(gem).at(-1)!
  const pick = (g: Gem) => setPicked(g.id)
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-3 rounded-sm bg-sunken p-1" role="tablist" aria-label="Kind">
        {GEM_TABS.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => { setKind(k); setPicked(of((g) => g.kind === k)[0]!.id) }}
            className={`min-h-9 rounded-xs text-[13px] font-semibold ${kind === k ? 'bg-raised text-ink shadow-2' : 'text-ink-faint'}`}>{label}</button>
        ))}
      </div>
      <div className={kind === 'bridge' ? 'grid grid-cols-2 gap-x-3 gap-y-1' : 'space-y-1'} role="group" aria-label="Star Gem">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-1">
            <span className="w-12 shrink-0 text-[10.5px] font-semibold" style={{ color: row.color }}>{row.label}</span>
            <div className={`grid gap-0.5 ${kind === 'moon' ? 'flex-1 grid-cols-10' : kind === 'bridge' ? 'grid-cols-[repeat(2,2.25rem)]' : 'grid-cols-[repeat(4,2.25rem)]'}`}>
              {row.gems.map((g) => (
                <IconPick key={g.id} id={g.id} on={g.id === picked} label={`${g.name}, grade ${g.grade}`} disabled={level < gradeUnlockLevel(g.grade)}
                  dim={!queueing && makeable(world, g.inputs) < 1} badge={!!wanted?.get(g.id)} onClick={() => pick(g)} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <RecipeCard world={world} id={gem.id} line={`Opens ${nodeLabel(node)} · ${nodeValue(node)}${wanted?.get(gem.id) ? ` · Target ×${wanted.get(gem.id)}` : ''}`} queueing={queueing} onPick={onPick} />
    </div>
  )
}

function UpgradeSheet({ world, placeId, onClose, onUpgrade }: { world: TierWorld; placeId: string; onClose: () => void; onUpgrade: () => Promise<void> }) {
  const cost = upgradeCost(world, placeId)
  const [error, setError] = useState<string | null>(null)
  if (!cost) return null
  const next = facilityLevel(world, placeId) + 1
  const enough = world.wallet.laurels >= cost.laurels && Object.entries(cost.items).every(([id, n]) => (world.items[id] ?? 0) >= n)
  return (
    <BottomSheet title={`Upgrade to level ${next}`} onClose={onClose} footer={
      <button type="button" disabled={!enough} onClick={() => onUpgrade().catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t upgrade.'))}
        className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">{enough ? 'Upgrade' : 'Not enough yet'}</button>
    }>
      <p className="mb-3 text-[14px] text-ink-soft">{next === 2 ? `+1 slot (${FACILITY_SLOTS[1]})` : 'Jobs 25% faster'}</p>
      <ul className="space-y-1.5 text-[14px]">
        <li className="flex items-center justify-between rounded-sm bg-raised p-2"><span className="flex items-center gap-2"><LaurelIcon size={20} /> Laurels</span><span>{world.wallet.laurels} / {cost.laurels}</span></li>
        {Object.entries(cost.items).map(([id, n]) => (
          <li key={id} className="flex items-center justify-between rounded-sm bg-raised p-2">
            <span className="flex items-center gap-2"><ItemIcon id={id} size={24} /> {itemById(id)?.name}</span>
            <span className={(world.items[id] ?? 0) >= n ? '' : 'text-danger'}>{world.items[id] ?? 0} / {n}</span>
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </BottomSheet>
  )
}

/** The quick look: who's working and how far along, with one-tap collect. */
export function FacilityPeek({ place }: PeekProps) {
  const world = useWorld()
  const now = useNow()
  if (!world) return null
  const facility = facilityView(world, place.id, now)
  const info = describe(place.id)
  const ready = facility.ready
  return (
    <div className="space-y-3 p-4">
      <p className="text-[12px] text-ink-soft">{info.title} · level {facility.level}</p>
      <ul className="space-y-1.5">
        {facility.jobs.map((job, i) => (
          <li key={i} className="flex items-center gap-2 rounded-sm bg-raised p-2 text-[13px]">
            {job ? (
              <>
                <ItemIcon id={outputView(job.output).icon} size={24} />
                <span className="min-w-0 flex-1 truncate">{outputView(job.output).name} {job.finished}/{job.count}{job.queue.length > 0 ? ` +${job.queue.length}` : ''}</span>
                <span className="text-ink-soft">{job.done ? 'Done' : formatDuration(job.endsAt - Date.parse(now))}</span>
              </>
            ) : <span className="text-ink-faint">Slot {i + 1} · free</span>}
          </li>
        ))}
      </ul>
      {ready && (
        <button type="button" onClick={() => void collectEverything([place.id])} className="min-h-11 w-full rounded-sm bg-accent font-display font-bold text-accent-ink">Collect</button>
      )}
    </div>
  )
}
