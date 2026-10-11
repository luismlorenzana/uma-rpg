// A working facility (S4, S6; D55, D58): the 16 sites gather raw items, the Pantry and Workbench refine them 1 → 1, and
// the Kitchen cooks dishes and the Forge crafts gear (S7, D59). Each slot holds one Uma's job: what she makes, how many, how far along. Collect pays the
// output and her profession EXP.
import {
  availabilityBlock, DISHES, dishById, EFFECT_LABEL, EQUIP_LABEL, EQUIP_TYPES, gearById, gearId, ITEM_EFFECTS, type EquipType, type ItemEffect, facilityOf, facilitySpec, familyById, FACILITY_SLOTS, FACILITY_SPEED, gradeUnlockLevel, ITEM_FAMILIES,
  itemById, jobEndsAt, jobFinished, jobProgress, MAX_JOB_COUNT, planJob, professionAptitude, PROFESSION_LABEL, rushCost, SaveRuleError,
  upgradeCost, type Job, type Profession, type RosterOutfit, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { AtlasSprite } from '../../master/art'
import type { MasterView } from '../../master/master'
import { collect, collectEverything, recall, rush, startWork, upgrade, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { LaurelIcon } from '../../ui/icons'
import { formatDuration, useNow } from '../../ui/useNow'
import { MasterGate } from '../MasterGate'
import type { PageProps, PeekProps } from '../registry'

const SPEED_NOTE: Record<string, string> = { S: '×2 speed', A: '×2 speed', B: '×1.7', C: '×1.5', D: '×1.33', E: '×1.2', F: '×1.1', G: '×1' }

function describe(placeId: string): { title: string; line: string; profession: Profession } {
  const spec = facilitySpec(placeId)!
  const family = spec.family ? familyById(spec.family) : null
  if (family) return { title: family.name, line: `Gathers ${family.name.toLowerCase()} for the ${EFFECT_LABEL[family.effect]} effect`, profession: spec.profession! }
  if (spec.kind === 'cook') return { title: 'Cooking', line: 'Cooks dishes from refined ingredients; each new dish an Uma eats unlocks an Extra Stats node', profession: 'farming' }
  if (spec.kind === 'craft') return { title: 'Crafting', line: 'Crafts weapons, armor and accessories: the main material sets the type and grade, the accent adds its effect', profession: 'gathering' }
  return { title: 'Refining', line: `Refines every ${spec.profession === 'farming' ? 'farming' : 'gathering'} family, one into one`, profession: spec.profession! }
}

export default function FacilityPage({ place }: PageProps) {
  return <MasterGate>{(view) => <Facility view={view} placeId={place.id} />}</MasterGate>
}

function Facility({ view, placeId }: { view: MasterView; placeId: string }) {
  const world = useWorld()
  const now = useNow()
  const [assign, setAssign] = useState<number | null>(null)
  const [upgrading, setUpgrading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  if (!world) return null
  const facility = facilityOf(world, placeId)
  const info = describe(placeId)
  const ready = facility.jobs.some((j) => j && (jobFinished(j, now) > j.collected || jobFinished(j, now) >= j.count))
  const run = (op: () => Promise<unknown>) => {
    setMessage(null)
    op().catch((err: unknown) => setMessage(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  return (
    <div className="space-y-3 p-4">
      <section className="rounded-md bg-raised p-3">
        <p className="font-display text-lg font-bold">{info.title}</p>
        <p className="text-[13px] text-ink-soft">{info.line}. Raises {PROFESSION_LABEL[info.profession]}.</p>
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
      <ul className="space-y-2">
        {facility.jobs.map((job, slot) => (
          <li key={slot}>
            {job ? (
              <JobCard view={view} job={job} now={now} placeId={placeId} onCollect={() => run(() => collect(placeId, slot))}
                onRush={() => run(() => rush(placeId, slot))} onRecall={() => run(() => recall(placeId, slot))} rushTickets={world.wallet.rushTickets} />
            ) : (
              <button type="button" onClick={() => setAssign(slot)} className="flex min-h-16 w-full items-center gap-3 rounded-md border border-dashed border-hairline-strong px-3 text-left">
                <span className="flex size-10 items-center justify-center rounded-full bg-raised text-xl text-ink-faint">+</span>
                <span className="text-[14px] text-ink-soft">Slot {slot + 1} · assign an Uma</span>
              </button>
            )}
          </li>
        ))}
      </ul>
      {message && <p className="rounded-sm bg-danger/15 p-2 text-[13px] text-danger">{message}</p>}
      {assign !== null && <AssignSheet view={view} world={world} placeId={placeId} profession={info.profession} onClose={() => setAssign(null)}
        onStart={(outfit, output, count) => startWork(placeId, assign, outfit, output, count).then(() => setAssign(null))} />}
      {upgrading && <UpgradeSheet world={world} placeId={placeId} onClose={() => setUpgrading(false)} onUpgrade={() => upgrade(placeId).then(() => setUpgrading(false))} />}
    </div>
  )
}

function JobCard({ view, job, now, placeId, rushTickets, onCollect, onRush, onRecall }: {
  view: MasterView; job: Job; now: string; placeId: string; rushTickets: number; onCollect: () => void; onRush: () => void; onRecall: () => void
}) {
  const item = outputView(job.output)
  const outfit = view.roster.find((o) => o.outfitId === job.outfitId)
  const finished = jobFinished(job, now)
  const readyCount = finished - job.collected
  const done = finished >= job.count
  const left = jobEndsAt(job) - Date.parse(now)
  const cost = done ? 0 : rushCost(job, now)
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
          {done ? `Collect ${readyCount}` : `Collect${readyCount > 0 ? ` ${readyCount}` : ''}`}
        </button>
        {!done && (
          <button type="button" disabled={rushTickets < cost} onClick={onRush} className="min-h-10 rounded-sm bg-panel px-3 text-[13px] font-semibold disabled:opacity-35" aria-label={`Rush for ${cost} Rush Tickets`}>
            Rush · {cost}
          </button>
        )}
        <button type="button" onClick={onRecall} className="min-h-10 rounded-sm bg-panel px-3 text-[13px] text-ink-soft" aria-label={`Recall ${outfit?.name ?? ''} from ${placeId}`}>
          Recall
        </button>
      </div>
    </div>
  )
}

/** Pick an Uma, then what she makes, then how many. */
function AssignSheet({ view, world, placeId, profession, onClose, onStart }: {
  view: MasterView; world: TierWorld; placeId: string; profession: Profession; onClose: () => void
  onStart: (outfit: RosterOutfit, output: string, count: number) => Promise<void>
}) {
  const spec = facilitySpec(placeId)!
  const [outfit, setOutfit] = useState<RosterOutfit | null>(null)
  const [output, setOutput] = useState<string | null>(null)
  const [count, setCount] = useState(10)
  const [error, setError] = useState<string | null>(null)
  const owned = view.roster.filter((o) => world.umas[o.outfitId])
    .map((o) => ({ o, block: availabilityBlock(world, o.outfitId), prof: world.umas[o.outfitId]!.professions[profession] }))
    .sort((a, b) => Number(!!a.block) - Number(!!b.block) || b.prof.level - a.prof.level || a.o.name.localeCompare(b.o.name))
  const options = outfit
    ? spec.kind === 'gather'
      ? familyById(spec.family!)!.raw.map((i) => i.id)
      : spec.kind === 'cook'
        ? DISHES.map((d) => d.id)
        : ITEM_FAMILIES.filter((f) => f.side === profession).flatMap((f) => f.refined.map((i) => i.id))
    : []
  const plan = outfit && output ? planJob(world, placeId, outfit, output, count) : null
  // How many the Warehouse covers: refining needs the raw item, cooking every ingredient.
  const makeable = (inputs: Record<string, number>) => Math.min(...Object.entries(inputs).map(([id, n]) => Math.floor((world.items[id] ?? 0) / n)))
  const stock = plan && (spec.kind === 'refine' || spec.kind === 'cook' || spec.kind === 'craft') ? makeable(plan.inputs) : Infinity
  const max = Math.max(1, Math.min(MAX_JOB_COUNT, stock))
  const title = !outfit ? 'Who works here?' : !output ? 'What does she make?' : 'How many?'
  return (
    <BottomSheet title={title} onClose={onClose} footer={outfit && output && plan ? (
      <button type="button" disabled={!!plan.block} onClick={() => {
        setError(null)
        onStart(outfit, output, Math.min(count, max)).catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t start.'))
      }} className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
        {plan.block ?? `Start · ${formatDuration(plan.msEach * Math.min(count, max))}`}
      </button>
    ) : undefined}>
      {!outfit && (
        <ul className="space-y-1.5">
          {owned.length === 0 && <li className="text-[14px] text-ink-soft">Unlock Umas at the Stable first.</li>}
          {owned.map(({ o, block, prof }) => {
            const grade = professionAptitude(o, profession)
            return (
              <li key={o.outfitId}>
                <button type="button" disabled={!!block} onClick={() => setOutfit(o)} className="flex w-full items-center gap-3 rounded-sm bg-raised p-2 text-left disabled:opacity-45">
                  <AtlasSprite art={view.art} family="outfit-icons" frameKey={o.outfitId} size={40} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold">{o.name}</span>
                    <span className="block text-[12px] text-ink-soft">{block ?? `${PROFESSION_LABEL[profession]} Lv${prof.level} · ${profession === 'farming' ? 'Turf' : 'Dirt'} ${grade} ${SPEED_NOTE[grade]}`}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {outfit && !output && spec.kind === 'craft' && (
        <CraftPicker world={world} level={world.umas[outfit.outfitId]!.professions.gathering.level} onPick={(id, have) => { setOutput(id); setCount(Math.max(1, Math.min(10, have))) }} />
      )}
      {outfit && !output && spec.kind !== 'craft' && (
        <div className="grid grid-cols-2 gap-1.5">
          {options.map((id) => {
            const out = outputView(id)
            const p = planJob(world, placeId, outfit, id, 1)
            const locked = world.umas[outfit.outfitId]!.professions[profession].level < gradeUnlockLevel(out.grade)
            const have = spec.kind === 'refine' || spec.kind === 'cook' ? (p ? makeable(p.inputs) : 0) : null
            const dish = dishById(id)
            return (
              <button key={id} type="button" disabled={locked || (have !== null && have < 1)} onClick={() => { setOutput(id); setCount(have !== null ? Math.min(10, have) : 10) }}
                className="flex items-center gap-2 rounded-sm bg-raised p-2 text-left disabled:opacity-40">
                <ItemIcon id={out.icon} size={32} />
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-semibold">{out.name}</span>
                  <span className="block truncate text-[11px] text-ink-soft">
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
                  <ItemIcon id={id} size={20} /> {itemById(id)?.name} ×{n * Math.min(count, max)}
                  <span className="text-ink-faint">({world.items[id] ?? 0})</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-1.5">
            {[1, 5, 10, 25, 50].filter((n) => n <= max).concat(max > 1 && ![1, 5, 10, 25, 50].includes(max) ? [max] : []).map((n) => (
              <button key={n} type="button" onClick={() => setCount(n)} className={`min-h-10 min-w-12 rounded-sm px-3 font-semibold ${Math.min(count, max) === n ? 'bg-accent text-accent-ink' : 'bg-raised'}`}>×{n}</button>
            ))}
          </div>
          <p className="text-[12px] text-ink-soft">
            {Math.min(count, max)} items · {formatDuration(plan.msEach * Math.min(count, max))} · {plan.expEach * Math.min(count, max)} {PROFESSION_LABEL[profession]} EXP
          </p>
          <button type="button" onClick={() => setOutput(null)} className="text-[13px] text-ink-soft underline">Choose another item</button>
        </div>
      )}
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </BottomSheet>
  )
}

/** The Forge's picker: a type, a grade (her Gathering level opens them) and an accent (the effect it adds). */
function CraftPicker({ world, level, onPick }: { world: TierWorld; level: number; onPick: (id: string, have: number) => void }) {
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
        <div className="flex flex-wrap gap-1">{EQUIP_TYPES.map((t) => <button key={t} type="button" onClick={() => setType(t)} className={chip(t === type)}>{EQUIP_LABEL[t]}</button>)}</div>
      </div>
      <div>
        <p className="text-micro mb-1">Grade</p>
        <div className="flex flex-wrap gap-1">{Array.from({ length: 10 }, (_, i) => i + 1).map((g) => (
          <button key={g} type="button" disabled={level < gradeUnlockLevel(g)} onClick={() => setGrade(g)} className={chip(g === grade)} aria-label={`Grade ${g}${level < gradeUnlockLevel(g) ? `, needs Gathering Lv${gradeUnlockLevel(g)}` : ''}`}>{g}</button>
        ))}</div>
      </div>
      <div>
        <p className="text-micro mb-1">Accent</p>
        <div className="flex flex-wrap gap-1">{ITEM_EFFECTS.map((e) => <button key={e} type="button" onClick={() => setAccent(e)} className={chip(e === accent)}>{EFFECT_LABEL[e]}</button>)}</div>
      </div>
      <div className="rounded-sm bg-raised p-2.5">
        <p className="flex items-center gap-2 text-[14px] font-semibold"><ItemIcon id={outputView(piece.id).icon} size={28} /> {piece.name}</p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5 text-[12px]">
          {Object.entries(piece.inputs).map(([id, n]) => (
            <li key={id} className="flex items-center gap-1 rounded-sm bg-panel px-2 py-1"><ItemIcon id={id} size={18} /> {itemById(id)?.name} ×{n} <span className="text-ink-faint">({world.items[id] ?? 0})</span></li>
          ))}
        </ul>
        <button type="button" disabled={have < 1} onClick={() => onPick(piece.id, have)} className="mt-2 min-h-11 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
          {have < 1 ? 'Not enough materials' : `Next · ${have} possible`}
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
      <p className="mb-3 text-[14px] text-ink-soft">{next === 2 ? `A third slot (${FACILITY_SLOTS[1]} in all).` : 'Every job here a quarter faster.'}</p>
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
      <p className="text-[15px] leading-relaxed">{place.blurb}</p>
      <p className="text-[12px] text-ink-soft">{info.line} · level {facility.level}</p>
      <ul className="space-y-1.5">
        {facility.jobs.map((job, i) => (
          <li key={i} className="flex items-center gap-2 rounded-sm bg-raised p-2 text-[13px]">
            {job ? (
              <>
                <ItemIcon id={outputView(job.output).icon} size={24} />
                <span className="min-w-0 flex-1 truncate">{outputView(job.output).name} {jobFinished(job, now)}/{job.count}</span>
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
