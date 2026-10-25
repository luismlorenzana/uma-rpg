// A Hall of Heroes (D106, D107): four seats, each with its own unique Limit Break. A seat's Hero is shown large, her
// Learners (ten at most) below her. A Hero always uses her seat's Limit Break at full strength; a Learner inherits it at
// 50% plus 5% a Bond Level, and every won fight raises her Bond. A Learner sits under two Heroes at most. From engine v16
// (CP28, H70) a seat names the twin sets it answers, and a Learner candidate the sets it adds to her weapons'.
import {
  activeClass, BOND_EXP_PER_WIN, BOND_EXP_TO_NEXT, BOND_MAX_LEVEL, bondCapacity, bondOf, classOf, hallClass, HERO_MAX_LEARNERS, heroBlock, heroLimitKinds, heroLimitsOf, learnerBlock,
  LEARNER_MAX_PARENTS, parentsOf, rpgV2, SaveRuleError, heroLimit, type HeroLimit, type HeroLimitId,
} from '@rpg/domain'
import { useState } from 'react'
import { Bar, CLASS_LABEL, KindMark } from '../../battle/labels'
import { FaceTile, UmaBust } from '@luismlorenzana/uma-kit/album'
import { formatLevel } from '@luismlorenzana/uma-kit/roster'
import { albumRows, lockedReason } from '../../album/rows'
import { PickerStep } from '../../album/PickerStep'
import type { MasterView } from '../../master/master'
import { addLearner, appointHero, removeLearner, useAlbumScope, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { MasterGate } from '../MasterGate'
import type { PageProps, PeekProps } from '../registry'
import { learnerAdds, seatTwinSets, TWIN_SET_LABEL } from './hall-view'

export default function HallPage({ place }: PageProps) {
  return <MasterGate>{(view) => <Hall view={view} placeId={place.id} />}</MasterGate>
}

/** A Limit Break's kinds as tiny icons. */
export function LimitKinds({ limit, size = 14 }: { limit: HeroLimit; size?: number }) {
  return <span className="flex flex-wrap items-center gap-1">{heroLimitKinds(limit).map((k) => <KindMark key={k} kind={k} size={size} />)}</span>
}

type Pick = { seat: HeroLimitId; role: 'hero' | 'learner' }

function Hall({ view, placeId }: { view: MasterView; placeId: string }) {
  const world = useWorld()
  const scope = useAlbumScope()
  const [pick, setPick] = useState<Pick | null>(null)
  const [heroOpen, setHeroOpen] = useState<HeroLimitId | null>(null)
  const [learner, setLearner] = useState<{ seat: HeroLimitId; outfitId: string } | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const classId = hallClass(placeId)
  if (!world || !classId) return null
  const outfit = (id: string) => view.roster.find((o) => o.outfitId === id)
  const run = (op: () => Promise<unknown>, after?: () => void) => {
    setMessage(null)
    op().then(() => after?.()).catch((err: unknown) => setMessage(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  return (
    <div className="space-y-3 p-4">
      <section className="rounded-md bg-raised p-3">
        <div className="-mr-2 -mt-2 flex items-center justify-between">
          <p className="font-display text-lg font-bold">{CLASS_LABEL[classId]} Hall of Heroes</p>
          <HelpButton title="Hall of Heroes">
            <p>Limit Breaks come only from the Halls of Heroes. Each seat teaches its own; its Hero always uses it, at full strength: about twice a turn’s damage.</p>
            <p>Up to {HERO_MAX_LEARNERS} Learners sit under each Hero, and a Learner under {LEARNER_MAX_PARENTS} Heroes at most. In a fight she may use
              either Hero’s Limit Break, at 50% plus 5% a Bond Level (100% at Bond {BOND_MAX_LEVEL}), with all its weapons, elements,
              hits and statuses, even ones she doesn’t carry{rpgV2() ? ', its hits at the higher of her ATK and M.ATK' : ''}. An Uma who is neither a Hero nor a Learner has no Limit Break.</p>
            <p>Every won fight raises a Learner’s Bond with each of her Heroes, and a Hero’s Bond with her own seat: a stage {BOND_EXP_PER_WIN.fight}, an elite or a
              boss {BOND_EXP_PER_WIN.boss}, {BOND_EXP_TO_NEXT} a level. A Bond stays when she leaves, so a Hero taken out of her seat and put back as its
              Learner starts at the Bond she earned.</p>
            <p>A Hero can’t be a Learner. Swapping a Hero keeps the seat’s Learners; emptying the seat sends them away.</p>
          </HelpButton>
        </div>
        <p className="text-[12px] text-ink-soft">Four Heroes, each with her own Limit Break, and their Learners.</p>
      </section>
      {message && <p className="rounded-sm bg-danger/15 p-2 text-[13px] text-danger">{message}</p>}
      {heroLimitsOf(classId).map((limit, i) => {
        const seat = world.heroes[limit.id]
        const hero = seat ? outfit(seat.hero) : undefined
        return (
          <section key={limit.id} className="rounded-md bg-raised p-3">
            <div className="flex gap-3">
              <button type="button" onClick={() => (seat ? setHeroOpen(limit.id) : setPick({ seat: limit.id, role: 'hero' }))}
                aria-label={seat ? `Hero: ${hero?.name ?? seat.hero}` : 'Choose a Hero'}
                className={`h-24 w-20 shrink-0 overflow-hidden rounded-sm ${seat ? 'bg-panel ring-2 ring-[#ffd84d]/70' : 'border border-dashed border-hairline-strong'}`}>
                {seat ? <UmaBust outfitId={seat.hero} size={80} label={hero?.name ?? 'Hero'} className="size-full" /> : <span className="flex size-full flex-col items-center justify-center text-ink-faint"><span className="text-2xl">+</span><span className="text-[11px]">Hero</span></span>}
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-micro">Seat {i + 1} · Limit Break</p>
                <p className="font-display text-[16px] font-bold leading-tight">{limit.name}</p>
                <div className="mt-0.5"><LimitKinds limit={limit} /></div>
                {(() => {
                  const sets = seatTwinSets(limit)
                  return sets && sets.length > 0 && <p className="mt-0.5 text-[12px] font-semibold leading-4">Answers {sets.map((t) => TWIN_SET_LABEL[t]).join(' · ')}</p>
                })()}
                <p className="mt-0.5 text-[12px] leading-4 text-ink-soft">{limit.blurb}</p>
                <p className="mt-1 truncate text-[13px] font-semibold">{seat ? hero?.name ?? `Outfit ${seat.hero}` : <span className="text-ink-faint">No Hero yet</span>}</p>
              </div>
            </div>
            {seat && (
              <>
                <p className="text-micro mt-2.5">Learners {seat.learners.length}/{HERO_MAX_LEARNERS}</p>
                <ul className="mt-1 grid grid-cols-5 gap-1.5">
                  {seat.learners.map((id) => {
                    const bond = bondOf(world.umas[id]!, limit.id)
                    return (
                      <li key={id}>
                        <button type="button" onClick={() => setLearner({ seat: limit.id, outfitId: id })} aria-label={`${outfit(id)?.name ?? id}, Bond ${bond.level}`}
                          className="flex w-full flex-col items-center rounded-sm bg-panel px-0.5 pb-1 pt-1">
                          <span className="w-10"><FaceTile outfitId={id} size={40} label={outfit(id)?.name ?? 'Learner'} round /></span>
                          <span className="mt-0.5 text-[10.5px] font-semibold leading-3">Bond {bond.level}</span>
                          <Bar className="mt-0.5 h-1 w-10" value={bond.level >= BOND_MAX_LEVEL ? 1 : bond.exp} max={bond.level >= BOND_MAX_LEVEL ? 1 : BOND_EXP_TO_NEXT} tone="limit" />
                        </button>
                      </li>
                    )
                  })}
                  {seat.learners.length < HERO_MAX_LEARNERS && (
                    <li>
                      <button type="button" onClick={() => setPick({ seat: limit.id, role: 'learner' })} aria-label="Add a Learner"
                        className="flex h-full min-h-16 w-full items-center justify-center rounded-sm border border-dashed border-hairline-strong text-xl text-ink-faint">+</button>
                    </li>
                  )}
                </ul>
              </>
            )}
          </section>
        )
      })}

      {pick && (
        <PickerStep rows={albumRows(view, world, [], undefined, scope)} title={`${pick.role === 'hero' ? 'Hero' : 'Learner'} for ${heroLimit(pick.seat).name}`}
          disabled={row => lockedReason(row)
            ?? (world.heroes[pick.seat]?.hero === row.id ? 'Already seated here' : null)
            ?? (pick.role === 'hero' ? heroBlock(world, pick.seat, row.id) : learnerBlock(world, pick.seat, row.id))}
          describe={row => `${formatLevel(row.level)} · ${row.classId ? CLASS_LABEL[row.classId] : row.base.title ?? ''}`}
          renderChips={row => {
            if (!row.uma || pick.role !== 'learner') return undefined
            // v16 (CP28, §8.2): the sets this seat answers that her weapons miss.
            const adds = learnerAdds(heroLimit(pick.seat), classOf(row.uma, activeClass(row.outfit, row.uma)).weapons)
            return <span className="text-[10px] text-ink-soft">
              Bond {bondOf(row.uma, pick.seat).level} · {parentsOf(world, row.id).length}/{LEARNER_MAX_PARENTS} Heroes
              {adds && adds.length > 0 && <span className="block font-semibold text-ink">Adds {adds.map((t) => TWIN_SET_LABEL[t]).join(', ')}</span>}
            </span>
          }}
          onClose={() => setPick(null)}
          onPick={(id) => run(() => (pick.role === 'hero' ? appointHero(pick.seat, id) : addLearner(pick.seat, id)), () => { setPick(null); setHeroOpen(null) })} />
      )}

      {heroOpen && world.heroes[heroOpen] && (() => {
        const seat = world.heroes[heroOpen]!
        return (
          <BottomSheet title={`Hero · ${heroLimit(heroOpen).name}`} onClose={() => setHeroOpen(null)}>
            <div className="space-y-2">
              <p className="text-[14px]"><span className="font-semibold">{outfit(seat.hero)?.name ?? seat.hero}</span> uses {heroLimit(heroOpen).name} as her only Limit Break, at full strength.</p>
              {world.umas[seat.hero] && (() => {
                const bond = bondOf(world.umas[seat.hero]!, heroOpen)
                return (
                  <div className="text-[13px]">
                    <p className="text-ink-soft">Her own Bond with this seat: <span className="font-semibold text-ink">{bond.level}/{BOND_MAX_LEVEL}</span>, kept if she becomes its Learner</p>
                    <Bar className="mt-1" value={bond.level >= BOND_MAX_LEVEL ? 1 : bond.exp} max={bond.level >= BOND_MAX_LEVEL ? 1 : BOND_EXP_TO_NEXT} tone="limit" />
                  </div>
                )
              })()}
              <button type="button" onClick={() => { setHeroOpen(null); setPick({ seat: heroOpen, role: 'hero' }) }} className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink">Change Hero</button>
              <button type="button" onClick={() => run(() => appointHero(heroOpen, null), () => setHeroOpen(null))}
                className="min-h-12 w-full rounded-sm border border-hairline-strong font-semibold text-ink-soft">
                Empty this seat{seat.learners.length ? ` (its ${seat.learners.length} Learner${seat.learners.length === 1 ? '' : 's'} leave; their Bonds stay)` : ''}
              </button>
            </div>
          </BottomSheet>
        )
      })()}

      {learner && world.umas[learner.outfitId] && (() => {
        const bond = bondOf(world.umas[learner.outfitId]!, learner.seat)
        const others = parentsOf(world, learner.outfitId).filter((s) => s !== learner.seat)
        return (
          <BottomSheet title={outfit(learner.outfitId)?.name ?? learner.outfitId} onClose={() => setLearner(null)}>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="w-12 shrink-0"><FaceTile outfitId={learner.outfitId} size={48} label={outfit(learner.outfitId)?.name ?? 'Learner'} round /></span>
                <div className="min-w-0 flex-1 text-[13px]">
                  <p className="font-semibold">Bond {bond.level}/{BOND_MAX_LEVEL} · {Math.round(bondCapacity(bond.level) * 100)}% strength</p>
                  <Bar className="mt-1" value={bond.level >= BOND_MAX_LEVEL ? 1 : bond.exp} max={bond.level >= BOND_MAX_LEVEL ? 1 : BOND_EXP_TO_NEXT} tone="limit" />
                  <p className="mt-1 text-ink-soft">{bond.level >= BOND_MAX_LEVEL ? 'Fully bonded' : `${bond.exp}/${BOND_EXP_TO_NEXT} to Bond ${bond.level + 1}`}</p>
                </div>
              </div>
              <p className="text-[13px] text-ink-soft">Inherits {heroLimit(learner.seat).name}{others.length ? `, and ${heroLimit(others[0]!).name} from her other Hero` : ''}.</p>
              <button type="button" onClick={() => run(() => removeLearner(learner.seat, learner.outfitId), () => setLearner(null))}
                className="min-h-12 w-full rounded-sm border border-hairline-strong font-semibold text-ink-soft">Leave this Hero (her Bond stays)</button>
            </div>
          </BottomSheet>
        )
      })()}
    </div>
  )
}

export function HallPeek({ place }: PeekProps) {
  const world = useWorld()
  const classId = hallClass(place.id)
  if (!world || !classId) return null
  return (
    <MasterGate>
      {(view) => (
        <div className="space-y-1.5 p-4">
          {heroLimitsOf(classId).map((limit) => {
            const seat = world.heroes[limit.id]
            return (
              <div key={limit.id} className="flex items-center gap-2 rounded-sm bg-raised p-2 text-[13px]">
                {seat ? <span className="w-7 shrink-0"><FaceTile outfitId={seat.hero} size={28} label={view.roster.find(o => o.outfitId === seat.hero)?.name ?? 'Hero'} round /></span> : <span className="size-7 rounded-full border border-dashed border-hairline-strong" />}
                <span className="min-w-0 flex-1 truncate font-semibold">{limit.name}</span>
                <span className="text-ink-soft">{seat ? `${seat.learners.length}/${HERO_MAX_LEARNERS}` : 'Open'}</span>
              </div>
            )
          })}
        </div>
      )}
    </MasterGate>
  )
}
