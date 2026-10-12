// A working facility (S4, S6; D55, D58): the 16 sites gather raw items, the Pantry and Workbench refine them 1 → 1, and
// the Kitchen cooks dishes and the Forge crafts gear (S7, D59). Each slot holds one Uma's job: what she makes, how many, how far along. Collect pays the
// output and her profession EXP.
import {
  activeClass, availabilityBlock, DISHES, facilityTargets, hasAccent, targetPlan, type TargetNeed, dishById, EFFECT_LABEL, EQUIP_LABEL, EQUIP_TYPES, gearById, gearId, ITEM_EFFECTS, type EquipType, type ItemEffect, facilityOf, facilitySpec, familyById, FACILITY_SLOTS, FACILITY_SPEED, gradeUnlockLevel, ITEM_FAMILIES,
  itemById, jobEndsAt, jobFinished, jobProgress, MAX_JOB_COUNT, planJob, professionAptitude, PROFESSION_LABEL, PROFESSION_SHORT, SaveRuleError,
  stockName, upgradeCost, type Job, type Profession, type RosterOutfit, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { AtlasSprite } from '../../master/art'
import type { MasterView } from '../../master/master'
import { collect, collectAndRepeat, collectEverything, cutTime, queueWork, recall, startWork, unqueueWork, upgrade, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { LaurelIcon, TargetIcon } from '../../ui/icons'
import { formatDuration, useNow } from '../../ui/useNow'
import { MasterGate } from '../MasterGate'
import type { PageProps, PeekProps } from '../registry'
import { QueueList } from './QueueList'
import { TimeCut } from './TimeCut'

const SPEED_NOTE: Record<string, string> = { S: '×2 speed', A: '×2 speed', B: '×1.7', C: '×1.5', D: '×1.33', E: '×1.2', F: '×1.1', G: '×1' }

/** A facility's title and its help: what it makes and what it raises. */
function describe(placeId: string): { title: string; help: string[]; profession: Profession } {
  const spec = facilitySpec(placeId)!
  const family = spec.family ? familyById(spec.family) : null
  const level = (p: Profession) => `Each job raises her ${PROFESSION_LABEL[p]}; grade g opens at ${PROFESSION_LABEL[p]} 5g − 4.`
  if (family) {
    const verb = spec.profession === 'farming' ? 'Grows' : 'Gathers'
    return { title: family.name, profession: spec.profession!,
      help: [`${verb} ${family.name.toLowerCase()}, the ${EFFECT_LABEL[family.effect]} family, ten grades.`, level(spec.profession!)] }
  }
  if (spec.kind === 'cook') return { title: 'Cooking', profession: 'farming',
    help: ['Cooks dishes from refined ingredients and Cooking Tokens. Eating a dish unlocks a node on her Extra Stats map.', level('farming')] }
  if (spec.kind === 'craft') return { title: 'Crafting', profession: 'gathering',
    help: ['Crafts weapons, armor, Rings, Charms and Orbs: four refined items of the grade, one from each of the type\'s families. The accent picks the stat it adds.', level('gathering')] }
  return { title: 'Refining', profession: spec.profession!,
    help: [`Refines raw ${spec.profession === 'farming' ? 'ingredients' : 'materials'}, one into one, in a quarter of the time it took to gather.`, level(spec.profession!)] }
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
  const facility = facilityOf(world, placeId)
  const info = describe(placeId)
  // What the targets still need from here (D100), and the first free slot to start one in.
  const classOf = (id: string) => { const o = view.roster.find((r) => r.outfitId === id); return o ? activeClass(o, world.umas[id]!) : 'brawler' }
  const targets = world.targets.length > 0 ? facilityTargets(targetPlan(world, classOf), placeId) : null
  const wanted = new Map((targets ?? []).map((n) => [n.key, n.short]))
  const free = facility.jobs.findIndex((j) => j === null)
  const ready = facility.jobs.some((j) => j && (jobFinished(j, now) > j.collected || jobFinished(j, now) >= j.count))
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
        <TargetsCard lines={targets} canStart={free >= 0 && facilitySpec(placeId)?.kind !== 'craft'}
          onPick={(key) => { setWant(key); setAssign(free) }} />
      )}
      <ul className="space-y-2">
        {facility.jobs.map((job, slot) => (
          <li key={slot}>
            {job ? (
              <JobCard view={view} job={job} now={now} placeId={placeId} onCollect={() => run(() => collect(placeId, slot))}
                onRepeat={() => { const o = view.roster.find((r) => r.outfitId === job.outfitId); if (o) run(() => collectAndRepeat(placeId, slot, o)) }}
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
      {message && <p className="rounded-sm bg-danger/15 p-2 text-[13px] text-danger">{message}</p>}
      {assign !== null && <AssignSheet view={view} world={world} placeId={placeId} profession={info.profession} want={want} wanted={wanted}
        onClose={() => setAssign(null)} onStart={(outfit, output, count) => startWork(placeId, assign, outfit, output, count).then(() => setAssign(null))} />}
      {queueing !== null && facility.jobs[queueing] && (
        <AssignSheet view={view} world={world} placeId={placeId} profession={info.profession} wanted={wanted} onClose={() => setQueueing(null)}
          fixed={view.roster.find((o) => o.outfitId === facility.jobs[queueing]!.outfitId)}
          onStart={(outfit, output, count) => queueWork(placeId, queueing, outfit, output, count).then(() => setQueueing(null))} />
      )}
      {upgrading && <UpgradeSheet world={world} placeId={placeId} onClose={() => setUpgrading(false)} onUpgrade={() => upgrade(placeId).then(() => setUpgrading(false))} />}
    </div>
  )
}

/** What the targets still need from this facility (D100), lowest grade first; tap one to start it in a free slot. */
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
              <button type="button" disabled={!canStart} onClick={() => onPick(n.key)}
                className="flex w-full items-center gap-2 rounded-sm bg-panel px-2 py-1.5 text-left disabled:cursor-default">
                <ItemIcon id={n.icon} size={28} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold">{n.name} · G{n.grade}</span>
                  <span className="block text-[11px] text-ink-faint">have {n.have}{n.coming ? ` · ${n.coming} coming` : ''}</span>
                </span>
                <span className="shrink-0 font-display text-[15px] font-bold text-accent">×{n.short}</span>
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

function JobCard({ view, job, now, placeId, timeTickets, onCollect, onRepeat, onCut, onRecall, onQueue, onUnqueue }: {
  view: MasterView; job: Job; now: string; placeId: string; timeTickets: number; onCollect: () => void; onRepeat: () => void; onCut: (n: number) => void; onRecall: () => void
  onQueue: () => void; onUnqueue: (index: number) => void
}) {
  const item = outputView(job.output)
  const outfit = view.roster.find((o) => o.outfitId === job.outfitId)
  const finished = jobFinished(job, now)
  const readyCount = finished - job.collected
  const done = finished >= job.count
  const left = jobEndsAt(job) - Date.parse(now)
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
        <span className="block h-full rounded-full bg-accent" style={{ width: `${jobProgress(job, now) * 100}%` }} />
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
        <TimeCut job={job} now={now} tickets={timeTickets} onCut={onCut} />
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
function AssignSheet({ view, world, placeId, profession, fixed, want = null, wanted, onClose, onStart }: {
  view: MasterView; world: TierWorld; placeId: string; profession: Profession; fixed?: RosterOutfit; onClose: () => void
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
  const [dishKind, setDishKind] = useState<'planet' | 'duo' | 'feast'>('planet')
  const [readyOnly, setReadyOnly] = useState(false)
  const owned = view.roster.filter((o) => world.umas[o.outfitId])
    .map((o) => ({ o, block: availabilityBlock(world, o.outfitId), prof: world.umas[o.outfitId]!.professions[profession] }))
    .sort((a, b) => Number(!!a.block) - Number(!!b.block) || b.prof.level - a.prof.level || a.o.name.localeCompare(b.o.name))
  const options = outfit
    ? spec.kind === 'gather'
      ? familyById(spec.family!)!.raw.map((i) => i.id)
      : spec.kind === 'cook'
        ? DISHES.filter((d) => d.kind === dishKind).map((d) => d.id)
        : ITEM_FAMILIES.filter((f) => f.side === profession).flatMap((f) => f.refined.map((i) => i.id))
    : []
  const plan = outfit && output ? planJob(world, placeId, outfit, output, queueing ? 0 : count) : null
  // How many the Warehouse covers: refining needs the raw item, cooking every ingredient.
  const makeable = (inputs: Record<string, number>) => Math.min(...Object.entries(inputs).map(([id, n]) => Math.floor((world.items[id] ?? 0) / n)))
  const stock = plan && !queueing && (spec.kind === 'refine' || spec.kind === 'cook' || spec.kind === 'craft') ? makeable(plan.inputs) : Infinity
  const max = Math.max(1, Math.min(MAX_JOB_COUNT, stock))
  const title = !outfit ? 'Who works here?' : !output ? (queueing ? 'Queue: what next?' : 'What does she make?') : 'How many?'
  return (
    <BottomSheet title={title} onClose={onClose} footer={outfit && output && plan ? (
      <button type="button" disabled={!!plan.block} onClick={() => {
        setError(null)
        onStart(outfit, output, Math.min(count, max)).catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t start.'))
      }} className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
        {plan.block ?? `${queueing ? 'Queue' : 'Start'} · ${formatDuration(plan.msEach * Math.min(count, max))}`}
      </button>
    ) : undefined}>
      {!outfit && (
        <ul className="space-y-1.5">
          {owned.length === 0 && <li className="text-[14px] text-ink-soft">Unlock Umas at the Stable first.</li>}
          {owned.map(({ o, block, prof }) => {
            const grade = professionAptitude(o, profession)
            return (
              <li key={o.outfitId}>
                <button type="button" disabled={!!block} onClick={() => { setOutfit(o); if (want) { setOutput(want); setCount(Math.min(MAX_JOB_COUNT, wanted?.get(want) ?? 1)) } }} className="flex w-full items-center gap-3 rounded-sm bg-raised p-2 text-left disabled:opacity-45">
                  <AtlasSprite art={view.art} family="outfit-icons" frameKey={o.outfitId} size={40} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold">{o.name}</span>
                    <span className="block text-[12px] text-ink-soft">{block ?? `${PROFESSION_SHORT[profession]} Lv ${prof.level} · ${profession === 'farming' ? 'Turf' : 'Dirt'} ${grade} ${SPEED_NOTE[grade]}`}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {outfit && !output && spec.kind === 'craft' && (
        <CraftPicker world={world} level={world.umas[outfit.outfitId]!.professions.gathering.level} queueing={queueing} onPick={(id) => { setOutput(id); setCount(1) }} />
      )}
      {outfit && !output && spec.kind === 'cook' && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {(['planet', 'duo', 'feast'] as const).map((k) => (
            <button key={k} type="button" onClick={() => setDishKind(k)}
              className={`min-h-9 rounded-full px-3 text-[12px] font-semibold ${dishKind === k ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'}`}>
              {k === 'planet' ? 'Dishes' : k === 'duo' ? 'Duo dishes' : 'Feasts'}
            </button>
          ))}
          <button type="button" aria-pressed={readyOnly} onClick={() => setReadyOnly((v) => !v)}
            className={`min-h-9 rounded-full px-3 text-[12px] font-semibold ${readyOnly ? 'bg-success text-white' : 'bg-raised text-ink-soft'}`}>Can cook now</button>
        </div>
      )}
      {outfit && !output && spec.kind !== 'craft' && (
        <div className="grid grid-cols-2 gap-1.5">
          {options.filter((id) => {
            if (!readyOnly || spec.kind !== 'cook') return true
            const p = planJob(world, placeId, outfit, id, 1)
            return !!p && !p.block
          }).map((id) => {
            const out = outputView(id)
            const p = planJob(world, placeId, outfit, id, 1)
            const locked = world.umas[outfit.outfitId]!.professions[profession].level < gradeUnlockLevel(out.grade)
            const have = spec.kind === 'refine' || spec.kind === 'cook' ? (p ? makeable(p.inputs) : 0) : null
            const dish = dishById(id)
            return (
              <button key={id} type="button" disabled={locked || (!queueing && have !== null && have < 1)} onClick={() => { setOutput(id); setCount(1) }}
                className="flex items-center gap-2 rounded-sm bg-raised p-2 text-left disabled:opacity-40">
                <ItemIcon id={out.icon} size={32} />
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-semibold">{out.name}</span>
                  <span className="block truncate text-[11px] text-ink-soft">
                    {wanted?.get(id) ? <span className="font-semibold text-accent">Target ×{wanted.get(id)} · </span> : null}
                    {locked ? `Lv${gradeUnlockLevel(out.grade)}` : have !== null ? `${have} ${dish ? 'to cook' : 'to refine'}` : `${formatDuration(p?.msEach ?? 0)} each`}
                    {dish ? ` · ${dish.effects.length === 8 ? 'all' : dish.effects.map((e) => EFFECT_LABEL[e]).join(' + ')}` : ''}
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
              <p className="text-ink-soft">{formatDuration(plan.msEach)} each · {plan.expEach} EXP each</p>
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
            {[1, 2, 3, 5, 10].filter((n) => n <= max).concat(max > 1 && ![1, 2, 3, 5, 10].includes(max) ? [max] : []).map((n) => (
              <button key={n} type="button" onClick={() => setCount(n)} className={`min-h-10 min-w-12 rounded-sm px-3 font-semibold ${Math.min(count, max) === n ? 'bg-accent text-accent-ink' : 'bg-raised'}`}>×{n}</button>
            ))}
          </div>
          <p className="text-[12px] text-ink-soft">
            {Math.min(count, max)} items · {formatDuration(plan.msEach * Math.min(count, max))} · {plan.expEach * Math.min(count, max)} {PROFESSION_SHORT[profession]} EXP
          </p>
          <button type="button" onClick={() => setOutput(null)} className="text-[13px] text-ink-soft underline">Choose another item</button>
        </div>
      )}
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </BottomSheet>
  )
}

/** The Forge's picker: a type, a grade (her Gathering level opens them) and an accent (the effect it adds). */
/** The Forge's types by family (D86): Arms, Tomes, armor, stat accessories and Orbs. */
const FORGE_GROUPS: readonly (readonly [string, readonly EquipType[]])[] = [
  ['Arms', EQUIP_TYPES.filter((t) => ['greatsword', 'axe', 'lance', 'bow', 'katana'].includes(t))],
  ['Tomes', EQUIP_TYPES.filter((t) => t.startsWith('tome-'))],
  ['Physical', ['helm', 'cuirass', 'greaves', 'gauntlets']],
  ['Magical', ['circlet', 'robe', 'leggings', 'bracers']],
  ['Arms Orbs', ['orb-greatsword', 'orb-axe', 'orb-lance', 'orb-bow', 'orb-katana']],
  ['Element Orbs', ['orb-fire', 'orb-ice', 'orb-lightning', 'orb-light', 'orb-dark']],
]

function CraftPicker({ world, level, queueing, onPick }: { world: TierWorld; level: number; queueing: boolean; onPick: (id: string, have: number) => void }) {
  const [type, setType] = useState<EquipType>('greatsword')
  const [grade, setGrade] = useState(1)
  const [accent, setAccent] = useState<ItemEffect>('atk')
  const piece = gearById(gearId(type, grade, accent))!
  const have = Math.min(...Object.entries(piece.inputs).map(([id, n]) => Math.floor((world.items[id] ?? 0) / n)))
  const chip = (on: boolean) => `min-h-9 rounded-full px-2.5 text-[12px] font-semibold ${on ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'} disabled:opacity-35`
  return (
    <div className="space-y-3">
      <div>
        <p className="text-micro mb-1">Type</p>
        <div className="space-y-1">
          {FORGE_GROUPS.map(([label, types]) => (
            <div key={label} className="flex flex-wrap items-center gap-1">
              <span className="w-20 shrink-0 text-[11px] text-ink-faint">{label}</span>
              {types.map((t) => <button key={t} type="button" onClick={() => setType(t)} className={chip(t === type)}>{EQUIP_LABEL[t].replace(' Tome', '').replace(' Orb', '')}</button>)}
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-micro mb-1">Grade</p>
        <div className="flex flex-wrap gap-1">{Array.from({ length: 10 }, (_, i) => i + 1).map((g) => (
          <button key={g} type="button" disabled={level < gradeUnlockLevel(g)} onClick={() => setGrade(g)} className={chip(g === grade)} aria-label={`Grade ${g}${level < gradeUnlockLevel(g) ? `, needs Craft Lv${gradeUnlockLevel(g)}` : ''}`}>{g}</button>
        ))}</div>
      </div>
      {hasAccent(type) && (
        <div>
          <p className="text-micro mb-1">Accent</p>
          <div className="flex flex-wrap gap-1">{ITEM_EFFECTS.map((e) => <button key={e} type="button" onClick={() => setAccent(e)} className={chip(e === accent)}>{EFFECT_LABEL[e]}</button>)}</div>
        </div>
      )}
      <div className="rounded-sm bg-raised p-2.5">
        <p className="flex items-center gap-2 text-[14px] font-semibold"><ItemIcon id={outputView(piece.id).icon} size={28} /> {piece.name}</p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5 text-[12px]">
          {Object.entries(piece.inputs).map(([id, n]) => (
            <li key={id} className="flex items-center gap-1 rounded-sm bg-panel px-2 py-1"><ItemIcon id={id} size={18} /> {stockName(id)} ×{n} <span className="text-ink-faint">({world.items[id] ?? 0})</span></li>
          ))}
        </ul>
        <button type="button" disabled={have < 1 && !queueing} onClick={() => onPick(piece.id, have)} className="mt-2 min-h-11 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
          {have < 1 ? (queueing ? 'Next · none in stock yet' : 'Not enough materials') : `Next · ${have} possible`}
        </button>
      </div>
    </div>
  )
}

function UpgradeSheet({ world, placeId, onClose, onUpgrade }: { world: TierWorld; placeId: string; onClose: () => void; onUpgrade: () => Promise<void> }) {
  const cost = upgradeCost(world, placeId)
  const facility = facilityOf(world, placeId)
  const [error, setError] = useState<string | null>(null)
  if (!cost) return null
  const next = facility.level + 1
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
  const facility = facilityOf(world, place.id)
  const info = describe(place.id)
  const ready = facility.jobs.some((j) => j && (jobFinished(j, now) > j.collected || jobFinished(j, now) >= j.count))
  return (
    <div className="space-y-3 p-4">
      <p className="text-[12px] text-ink-soft">{info.title} · level {facility.level}</p>
      <ul className="space-y-1.5">
        {facility.jobs.map((job, i) => (
          <li key={i} className="flex items-center gap-2 rounded-sm bg-raised p-2 text-[13px]">
            {job ? (
              <>
                <ItemIcon id={outputView(job.output).icon} size={24} />
                <span className="min-w-0 flex-1 truncate">{outputView(job.output).name} {jobFinished(job, now)}/{job.count}{job.queue.length > 0 ? ` +${job.queue.length}` : ''}</span>
                <span className="text-ink-soft">{jobFinished(job, now) >= job.count ? 'Done' : formatDuration(jobEndsAt(job) - Date.parse(now))}</span>
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
