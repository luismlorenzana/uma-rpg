// The Wilds' shared work screens (SC4, D144): uma-kit owns the compact slot, queue, speed, recall, upgrade and job-sheet
// interaction; uma-rpg supplies its save, four work kinds, recipes, target plan, art and words.
import {
  activeClass, BRIDGES, checkRestartStopped, CRAFT_LABEL, EFFECT_LABEL, EQUIP_LABEL, EQUIP_TYPES, facilitySpec,
  facilityTargets, familyById, gearById, gearId, gemById, GEMS, gemNodes, gradeUnlockLevel, ITEM_EFFECTS, ITEM_FAMILIES,
  itemById, placeById, REFINE_BATCHES, refusalText, RPG_WORK_ENV, stockName, targetPlan,
  type EquipType, type Gem, type GemKind, type RpgQueueInput, type RpgWorkRequest, type TierWorld,
} from '@rpg/domain'
import { workOrder } from '@luismlorenzana/uma-kit/roster'
import {
  FacilityHeader, JobSheet, jobQuery, PeekRow, readJobQuery, SlotRow, StoppedQueueCard, TargetsStrip,
  withoutJobQuery, WorkProvider, useWorkView, type JobSelection, type WorkActions,
} from '@luismlorenzana/uma-kit/work'
import { useState, type ReactNode } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { albumRows, lockedReason, type RpgUmaRow } from '../../album/rows'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { nodeLabel, nodeValue, PLANET_COLOR, PLANET_SHORT } from '../../items/planets'
import type { MasterView } from '../../master/master'
import {
  collectEverything, collectWorker, dismissWork, editWorkQueue, finishWorker, recallWorker, repeatWork, restartWork,
  speedWorker, startWork, upgrade, useAlbumScope, useWorld,
} from '../../save/game'
import { HelpButton } from '../../ui/HelpButton'
import { LaurelIcon } from '../../ui/icons'
import { useNow } from '../../ui/useNow'
import { MasterGate } from '../MasterGate'
import type { PageProps, PeekProps } from '../registry'
import { pieceLine } from '../stable/WeaponSheet'

/** A facility's title and help. Long rule text stays behind the help button (D95). */
function describe(placeId: string): { title: string; help: string[] } {
  const spec = facilitySpec(placeId)!
  const family = spec.family ? familyById(spec.family) : null
  const level = `Each job raises her ${CRAFT_LABEL}; grade g opens at ${CRAFT_LABEL} 5g − 4.`
  if (family) return { title: family.name, help: [`Gathers ${family.name.toLowerCase()}, the ${EFFECT_LABEL[family.effect]} family, in ten grades.`, level] }
  if (spec.kind === 'craft') return { title: 'Crafting', help: ['Crafts weapons, armor and accessories from two refined items of the same grade.', level] }
  if (spec.kind === 'cut') return { title: 'Cutting', help: ['Cuts Star Gems from refined materials. Set one at the Observatory to open its Extra Stats node.', level] }
  return { title: 'Refining', help: ['Refines raw materials one into one, in a quarter of their gathering time.', level] }
}

const requestLabel = (request: RpgWorkRequest) => ({ name: outputView(request.item).name, item: request.item, count: request.count })

/** The game-owned side of uma-kit/work: the kit never owns saves, clocks, rules or vocabulary. */
function RpgWorkProvider({ view, world, now, children }: { view: MasterView; world: TierWorld; now: string; children: ReactNode }) {
  const actions: WorkActions = {
    collect: async ({ outfitId }) => {
      const got = await collectWorker(outfitId)
      return got.levelsUp > 0 ? { kind: 'done', message: `${CRAFT_LABEL} +${got.levelsUp}` } : undefined
    },
    repeat: ({ outfitId }) => repeatWork(outfitId),
    speedUp: ({ outfitId, startedAt, tickets }) => speedWorker(outfitId, startedAt, tickets),
    finish: ({ outfitId, startedAt }) => finishWorker(outfitId, startedAt),
    recall: ({ outfitId }) => recallWorker(outfitId),
    queue: (input) => editWorkQueue(input as RpgQueueInput),
    unqueue: ({ outfitId, index }) => editWorkQueue({ outfitId, remove: index }),
    upgrade: ({ building }) => upgrade(building),
    start: ({ outfitId, slot, request }) => {
      const job = request as RpgWorkRequest
      return startWork(slot.building, slot.slot, { outfitId }, job.item, job.count)
    },
    restart: ({ outfitId }) => restartWork(outfitId),
    dismiss: ({ outfitId }) => dismissWork(outfitId),
  }
  const roster = new Map(view.roster.map((outfit) => [outfit.outfitId, outfit.name]))
  return (
    <WorkProvider
      state={world}
      now={Date.parse(now)}
      env={RPG_WORK_ENV}
      actions={actions}
      names={{
        uma: (id) => roster.get(id) ?? id,
        item: (id) => outputView(id).name,
        place: (id) => placeById(id)?.name ?? id,
      }}
      words={{ workLevel: CRAFT_LABEL, workLevelLabel: 'Craft Lv {level}' }}
      describeRequest={(request) => requestLabel(request as RpgWorkRequest)}
      formatRefusal={(refusal) => refusalText(refusal, Date.parse(now))}
      checkRestart={(state, outfitId) => checkRestartStopped(state, outfitId, Date.parse(now))}
      renderMoney={(amount) => <span className="inline-flex items-center gap-1"><LaurelIcon size={17} />{amount.toLocaleString('en-US')}</span>}
    >
      {children}
    </WorkProvider>
  )
}

export default function FacilityPage({ place }: PageProps) {
  return <MasterGate>{(view) => <Facility view={view} placeId={place.id} />}</MasterGate>
}

function Facility({ view, placeId }: { view: MasterView; placeId: string }) {
  const world = useWorld()
  const now = useNow()
  if (!world) return null
  return (
    <RpgWorkProvider view={view} world={world} now={now}>
      <FacilityBody view={view} world={world} now={now} placeId={placeId} />
    </RpgWorkProvider>
  )
}

function FacilityBody({ view, world, now, placeId }: { view: MasterView; world: TierWorld; now: string; placeId: string }) {
  const work = useWorkView()
  const cards = work.cards(placeId)
  const info = describe(placeId)
  const spec = facilitySpec(placeId)!
  const location = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const query = readJobQuery(params)
  const rows = albumRows(view, world, [], now, useAlbumScope())
  const classOf = (id: string) => {
    const outfit = view.roster.find((row) => row.outfitId === id)
    return outfit && world.umas[id] ? activeClass(outfit, world.umas[id]) : 'brawler'
  }
  const targets = world.targets.length === 0 ? [] : facilityTargets(targetPlan(world, classOf), placeId)
  const wanted = new Map(targets.map((target) => [target.key, target.short]))
  const free = cards.find((card) => card.kind === 'free')
  const ready = cards.some((card) => card.kind === 'held' && card.waiting > 0)
  const stopped = Object.values(work.settled.work).filter((row) => row.dropped?.slot.building === placeId)
  const closeJob = () => {
    if (query?.back) navigate(query.back, { replace: true })
    else navigate({ pathname: location.pathname, search: withoutJobQuery(location.search) }, { replace: true })
  }
  const openJob = (search: string) => navigate({ pathname: location.pathname, search })
  return (
    <div className="space-y-3 p-4">
      <section className="rounded-md bg-raised px-3">
        <div className="flex min-h-11 items-center justify-between gap-2 border-b border-hairline">
          <h2 className="font-display text-lg font-bold">{info.title}</h2>
          <HelpButton title={info.title}>{info.help.map((line) => <p key={line}>{line}</p>)}</HelpButton>
        </div>
        <FacilityHeader building={placeId}>
          {ready && (
            <button type="button" onClick={() => void collectEverything([placeId])}
              className="min-h-9 shrink-0 rounded-full bg-accent px-3 text-[13px] font-semibold text-accent-ink">
              Collect here
            </button>
          )}
        </FacilityHeader>
      </section>

      <ul className="space-y-2">
        {cards.map((card) => (
          <li key={card.slot.slot}>
            <SlotRow
              slot={card.slot}
              onStart={() => openJob(jobQuery({ slot: card.slot.slot }))}
              onQueue={card.kind === 'held' ? (outfitId) => openJob(jobQuery({ uma: outfitId, queue: true })) : undefined}
              repeat
            />
          </li>
        ))}
      </ul>

      <TargetsStrip targets={targets.map((target) => ({
        id: target.key,
        item: target.icon,
        grade: target.grade,
        short: target.short,
        label: `${target.name}, grade ${target.grade}. Need ${target.need}, have ${target.have}${target.coming ? `, ${target.coming} coming` : ''}`,
        onPick: free && target.short > 0 ? () => openJob(jobQuery({ job: target.key, count: target.short, slot: free.slot.slot })) : undefined,
      }))} />

      {stopped.map((row) => <StoppedQueueCard key={row.outfitId} outfitId={row.outfitId} />)}

      <JobSheet<RpgUmaRow>
        query={query}
        building={placeId}
        title={placeById(placeId)?.name ?? info.title}
        rows={rows}
        request={(job, count): RpgWorkRequest => ({ kind: spec.kind, item: job, count })}
        initialJob={() => initialJob(placeId)}
        sizeRule={spec.kind === 'refine' ? { mode: 'count', sizes: REFINE_BATCHES } : { mode: 'count' }}
        sizePlacement="before-what"
        disabled={lockedReason}
        picker={{ order: workOrder, renderBadges: (row) => row.uma ? {
          bottomRight: <span aria-label={`Craft Level ${row.workLevel}`} className="rounded-tl-sm bg-black/75 px-1 font-display text-[9px] font-bold leading-3.5">C{row.workLevel}</span>,
        } : undefined }}
        renderWhat={(selection) => <WhatPicker selection={selection} placeId={placeId} world={world} wanted={wanted} queueing={query?.queue === true} />}
        renderPreview={(_, selection) => <PreviewLine job={selection.job} />}
        onClose={closeJob}
        onDone={closeJob}
      />
    </div>
  )
}

function initialJob(placeId: string): string | null {
  const spec = facilitySpec(placeId)!
  if (spec.kind === 'gather') return familyById(spec.family!)!.raw[0]?.id ?? null
  if (spec.kind === 'refine') return ITEM_FAMILIES[0]?.refined[0]?.id ?? null
  if (spec.kind === 'craft') return gearId('greatsword', 1)
  return 'gem-hp-1'
}

function WhatPicker({ selection, placeId, world, wanted, queueing }: {
  selection: JobSelection & { onChange: (job: string) => void }
  placeId: string
  world: TierWorld
  wanted: ReadonlyMap<string, number>
  queueing: boolean
}) {
  const spec = facilitySpec(placeId)!
  const level = selection.outfitId ? world.umas[selection.outfitId]?.craft.level ?? 1 : 1
  if (spec.kind === 'craft') return <ForgePicker world={world} level={level} job={selection.job} queueing={queueing} onPick={selection.onChange} />
  if (spec.kind === 'cut') return <GemPicker world={world} level={level} job={selection.job} queueing={queueing} wanted={wanted} onPick={selection.onChange} />
  const options = spec.kind === 'gather'
    ? familyById(spec.family!)!.raw.map((item) => item.id)
    : ITEM_FAMILIES.flatMap((family) => family.refined.map((item) => item.id))
  return <ItemChoices ids={options} job={selection.job} level={level} world={world} queueing={queueing} wanted={wanted} onPick={selection.onChange} />
}

function ItemChoices({ ids, job, level, world, queueing, wanted, onPick }: {
  ids: readonly string[]; job: string | null; level: number; world: TierWorld; queueing: boolean
  wanted: ReadonlyMap<string, number>; onPick: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {ids.map((id) => {
        const out = outputView(id)
        const made = itemById(id)!
        const locked = level < gradeUnlockLevel(out.grade)
        const short = made.refined && makeable(world, { [made.pair]: 1 }) < 1
        return (
          <button key={id} type="button" disabled={locked} onClick={() => onPick(id)} aria-pressed={job === id}
            className={`relative flex min-h-12 items-center gap-2 rounded-sm border p-2 text-left ${job === id ? 'border-accent bg-accent-wash' : 'border-transparent bg-raised'} ${short && !queueing ? 'opacity-45' : ''} disabled:opacity-30`}>
            <ItemIcon id={id} size={32} />
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-semibold">{out.name}</span>
              <span className="block text-[11px] text-ink-soft">{locked ? `Craft Lv ${gradeUnlockLevel(out.grade)}` : `Grade ${out.grade}`}</span>
            </span>
            {!!wanted.get(id) && <span className="absolute right-1 top-1 size-2 rounded-full bg-accent" aria-label={`Target ×${wanted.get(id)}`} />}
          </button>
        )
      })}
    </div>
  )
}

const makeable = (world: TierWorld, inputs: Readonly<Record<string, number>>): number => {
  const rows = Object.entries(inputs)
  return rows.length === 0 ? Number.POSITIVE_INFINITY : Math.min(...rows.map(([id, count]) => Math.floor((world.items[id] ?? 0) / count)))
}

/** Forge layout from D144: four rows of ten types, physical then magical, plus ten grade chips. */
const FORGE_ROWS: readonly (readonly EquipType[])[] = [
  [...EQUIP_TYPES.filter((type) => ['greatsword', 'axe', 'lance', 'bow', 'katana'].includes(type)), ...EQUIP_TYPES.filter((type) => type.startsWith('tome-'))],
  ['helm', 'cuirass', 'greaves', 'gauntlets', 'boots', 'circlet', 'robe', 'leggings', 'bracers', 'slippers'],
  ['orb-greatsword', 'orb-axe', 'orb-lance', 'orb-bow', 'orb-katana', 'orb-fire', 'orb-ice', 'orb-lightning', 'orb-light', 'orb-dark'],
  [...EQUIP_TYPES.filter((type) => type.startsWith('talisman-')), ...EQUIP_TYPES.filter((type) => type.startsWith('amulet-'))],
]

function IconPick({ id, on, dim, disabled, label, badge, onClick }: {
  id: string; on: boolean; dim?: boolean; disabled?: boolean; label: string; badge?: boolean; onClick: () => void
}) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} aria-label={label} aria-pressed={on} title={label}
      className={`relative flex aspect-square min-h-8 items-center justify-center rounded-xs ${on ? 'bg-accent/25 ring-2 ring-accent' : 'bg-raised'} ${dim ? 'opacity-45' : ''} disabled:opacity-25`}>
      <ItemIcon id={id} size={28} />
      {badge && <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-accent" />}
    </button>
  )
}

function GradeChips({ level, grade, onPick }: { level: number; grade: number; onPick: (grade: number) => void }) {
  return (
    <div className="grid grid-cols-10 gap-0.5" role="group" aria-label="Grade">
      {Array.from({ length: 10 }, (_, index) => index + 1).map((next) => {
        const locked = level < gradeUnlockLevel(next)
        return (
          <button key={next} type="button" disabled={locked} onClick={() => onPick(next)}
            aria-label={`Grade ${next}${locked ? `, needs Craft Lv ${gradeUnlockLevel(next)}` : ''}`}
            className={`min-h-8 rounded-full text-[12px] font-semibold ${next === grade ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'} disabled:opacity-35`}>
            {next}
          </button>
        )
      })}
    </div>
  )
}

function ForgePicker({ world, level, job, queueing, onPick }: {
  world: TierWorld; level: number; job: string | null; queueing: boolean; onPick: (id: string) => void
}) {
  const picked = gearById(job ?? '') ?? gearById(gearId('greatsword', 1))!
  const chooseType = (type: EquipType) => onPick(gearId(type, picked.grade))
  const chooseGrade = (grade: number) => onPick(gearId(picked.type, grade))
  return (
    <div className="space-y-2.5">
      <div className="space-y-1" role="group" aria-label="Gear type">
        {FORGE_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-10 gap-0.5">
            {row.map((type, index) => {
              const id = gearId(type, picked.grade)
              return (
                <span key={type} className={index === 5 ? 'border-l border-hairline pl-0.5' : ''}>
                  <IconPick id={id} on={type === picked.type} label={EQUIP_LABEL[type]}
                    dim={!queueing && makeable(world, gearById(id)!.inputs) < 1} onClick={() => chooseType(type)} />
                </span>
              )
            })}
          </div>
        ))}
      </div>
      <GradeChips level={level} grade={picked.grade} onPick={chooseGrade} />
      <RecipeSummary world={world} id={picked.id} line={pieceLine(picked.id)} />
    </div>
  )
}

const GEM_TABS: readonly (readonly [GemKind, string])[] = [['moon', 'Moons'], ['bridge', 'Bridges'], ['sun', 'Sun']]

function GemPicker({ world, level, job, queueing, wanted, onPick }: {
  world: TierWorld; level: number; job: string | null; queueing: boolean; wanted: ReadonlyMap<string, number>; onPick: (id: string) => void
}) {
  const selected = gemById(job ?? '') ?? gemById('gem-hp-1')!
  const [kind, setKind] = useState<GemKind>(selected.kind)
  const of = (test: (gem: Gem) => boolean) => GEMS.filter(test)
  const gems = kind === 'moon' ? of((gem) => gem.kind === 'moon') : kind === 'bridge' ? of((gem) => gem.kind === 'bridge') : of((gem) => gem.kind === 'sun')
  const rows: { key: string; label: string; color: string; gems: Gem[] }[] = kind === 'moon'
    ? ITEM_EFFECTS.map((effect) => ({ key: effect, label: PLANET_SHORT[effect], color: PLANET_COLOR[effect], gems: gems.filter((gem) => gem.effects[0] === effect) }))
    : kind === 'bridge'
      ? BRIDGES.map(([left, right]) => ({ key: `${left}-${right}`, label: `${PLANET_SHORT[left]}·${PLANET_SHORT[right]}`, color: PLANET_COLOR[left], gems: gems.filter((gem) => gem.effects[0] === left && gem.effects[1] === right) }))
      : [{ key: 'sun', label: 'Sun', color: '#f5c542', gems }]
  const shown = selected.kind === kind ? selected : gems[0]!
  const node = gemNodes(shown).at(-1)!
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-3 rounded-sm bg-sunken p-1" role="tablist" aria-label="Star Gem kind">
        {GEM_TABS.map(([next, label]) => (
          <button key={next} type="button" role="tab" aria-selected={kind === next}
            onClick={() => { setKind(next); onPick(of((gem) => gem.kind === next)[0]!.id) }}
            className={`min-h-9 rounded-xs text-[13px] font-semibold ${kind === next ? 'bg-raised text-ink shadow-2' : 'text-ink-faint'}`}>
            {label}
          </button>
        ))}
      </div>
      <div className={kind === 'bridge' ? 'grid grid-cols-2 gap-x-3 gap-y-1' : 'space-y-1'} role="group" aria-label="Star Gem">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-1">
            <span className="w-12 shrink-0 text-[10.5px] font-semibold" style={{ color: row.color }}>{row.label}</span>
            <div className={`grid gap-0.5 ${kind === 'moon' ? 'flex-1 grid-cols-10' : kind === 'bridge' ? 'grid-cols-[repeat(2,2.25rem)]' : 'grid-cols-[repeat(4,2.25rem)]'}`}>
              {row.gems.map((gem) => (
                <IconPick key={gem.id} id={gem.id} on={gem.id === shown.id} label={`${gem.name}, grade ${gem.grade}`}
                  disabled={level < gradeUnlockLevel(gem.grade)} dim={!queueing && makeable(world, gem.inputs) < 1}
                  badge={!!wanted.get(gem.id)} onClick={() => onPick(gem.id)} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <RecipeSummary world={world} id={shown.id} line={`Opens ${nodeLabel(node)} · ${nodeValue(node)}`} />
    </div>
  )
}

function RecipeSummary({ world, id, line }: { world: TierWorld; id: string; line: string }) {
  const made = gearById(id) ?? gemById(id)
  if (!made) return null
  return (
    <div className="rounded-sm bg-raised p-2.5">
      <p className="flex items-center gap-2 text-[14px] font-semibold"><ItemIcon id={id} size={28} />{made.name} · G{made.grade}</p>
      <p className="mt-0.5 text-[12px] text-ink-soft">{line}</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5 text-[12px]">
        {Object.entries(made.inputs).map(([input, count]) => (
          <li key={input} className="flex items-center gap-1 rounded-sm bg-panel px-2 py-1">
            <ItemIcon id={input} size={18} />{stockName(input)} ×{count} <span className="text-ink-faint">({world.items[input] ?? 0})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PreviewLine({ job }: { job: string | null }) {
  if (!job) return null
  const gem = gemById(job)
  const line = gearById(job) ? pieceLine(job) : gem ? `Opens ${nodeLabel(gemNodes(gem).at(-1)!)} · ${nodeValue(gemNodes(gem).at(-1)!)}` : ''
  return line ? <span className="w-full text-ink-soft">{line}</span> : null
}

/** The Hub quick look uses the same live cards in compact form; opening it then collecting is two taps. */
export function FacilityPeek({ place }: PeekProps) {
  return <MasterGate>{(view) => <FacilityPeekReady view={view} place={place} />}</MasterGate>
}

function FacilityPeekReady({ view, place }: { view: MasterView; place: PeekProps['place'] }) {
  const world = useWorld()
  const now = useNow()
  if (!world) return null
  return (
    <RpgWorkProvider view={view} world={world} now={now}>
      <FacilityPeekBody place={place} />
    </RpgWorkProvider>
  )
}

function FacilityPeekBody({ place }: PeekProps) {
  const work = useWorkView()
  const navigate = useNavigate()
  const cards = work.cards(place.id)
  const stopped = Object.values(work.settled.work).filter((row) => row.dropped?.slot.building === place.id)
  const page = `/${place.page}/${place.id}`
  return (
    <div className="space-y-2 p-4">
      <p className="text-[12px] text-ink-soft">{describe(place.id).title} · Lv {work.facility(place.id).level}</p>
      <ul className="space-y-1.5">
        {cards.map((card) => (
          <li key={card.slot.slot}>
            <PeekRow
              slot={card.slot}
              onStart={() => navigate(`${page}${jobQuery({ slot: card.slot.slot })}`, { state: { fromHub: true } })}
              onQueue={card.kind === 'held' ? (outfitId) => navigate(`${page}${jobQuery({ uma: outfitId, queue: true })}`, { state: { fromHub: true } }) : undefined}
              repeat
            />
          </li>
        ))}
      </ul>
      {stopped.map((row) => <StoppedQueueCard key={row.outfitId} outfitId={row.outfitId} />)}
    </div>
  )
}
