// A Hall of Heroes (D106, D107): four seats, each with its own unique Limit Break. A seat's Hero is shown large, her
// Learners (ten at most) below her. A Hero always uses her seat's Limit Break at full strength; a Learner inherits it at
// 50% plus 5% a Bond Level, and every won fight raises her Bond. A Learner sits under two Heroes at most.
import {
  BOND_EXP_PER_WIN, BOND_EXP_TO_NEXT, BOND_MAX_LEVEL, bondCapacity, bondOf, hallClass, HERO_MAX_LEARNERS, heroBlock, heroLimitKinds, heroLimitsOf, learnerBlock,
  LEARNER_MAX_PARENTS, parentsOf, SaveRuleError, heroLimit, type HeroLimit, type HeroLimitId, type RosterOutfit, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { Bar, CLASS_LABEL, KindMark } from '../../battle/labels'
import { AtlasSprite, imagePath, useArtUrl } from '../../master/art'
import type { MasterView } from '../../master/master'
import { addLearner, appointHero, removeLearner, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { MasterGate } from '../MasterGate'
import type { PageProps, PeekProps } from '../registry'

export default function HallPage({ place }: PageProps) {
  return <MasterGate>{(view) => <Hall view={view} placeId={place.id} />}</MasterGate>
}

/** A Limit Break's kinds as tiny icons. */
export function LimitKinds({ limit, size = 14 }: { limit: HeroLimit; size?: number }) {
  return <span className="flex flex-wrap items-center gap-1">{heroLimitKinds(limit).map((k) => <KindMark key={k} kind={k} size={size} />)}</span>
}

/** A Hero's bust, cropped to her head and shoulders; her round icon until it loads. */
function HeroPortrait({ view, outfitId }: { view: MasterView; outfitId: string }) {
  const bust = useArtUrl(imagePath(view.art, 'outfit-busts', outfitId) ?? imagePath(view.art, 'outfit-portraits', outfitId))
  return bust
    ? <img src={bust} alt="" className="size-full object-cover object-top" />
    : <span className="flex size-full items-center justify-center"><AtlasSprite art={view.art} family="outfit-icons" frameKey={outfitId} size={64} /></span>
}

type Pick = { seat: HeroLimitId; role: 'hero' | 'learner' }

function Hall({ view, placeId }: { view: MasterView; placeId: string }) {
  const world = useWorld()
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
            <p>Each seat teaches its own Limit Break. Its Hero always uses it, at full strength: about twice a turn’s damage.</p>
            <p>Up to {HERO_MAX_LEARNERS} Learners sit under each Hero, and a Learner under {LEARNER_MAX_PARENTS} Heroes at most. In a fight she may use
              either Hero’s Limit Break instead of her own, at 50% plus 5% a Bond Level (100% at Bond {BOND_MAX_LEVEL}), with all its weapons, elements,
              hits and statuses, even ones she doesn’t carry.</p>
            <p>Every won fight raises a Learner’s Bond with each of her Heroes: a stage {BOND_EXP_PER_WIN.fight}, an elite or a boss {BOND_EXP_PER_WIN.boss}, {BOND_EXP_TO_NEXT} a level. Her
              Bond stays with her when she leaves.</p>
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
                {seat ? <HeroPortrait view={view} outfitId={seat.hero} /> : <span className="flex size-full flex-col items-center justify-center text-ink-faint"><span className="text-2xl">+</span><span className="text-[11px]">Hero</span></span>}
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-micro">Seat {i + 1} · Limit Break</p>
                <p className="font-display text-[16px] font-bold leading-tight">{limit.name}</p>
                <div className="mt-0.5"><LimitKinds limit={limit} /></div>
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
                          <AtlasSprite art={view.art} family="outfit-icons" frameKey={id} size={40} />
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
        <UmaPicker view={view} world={world} pick={pick} onClose={() => setPick(null)}
          onPick={(id) => run(() => (pick.role === 'hero' ? appointHero(pick.seat, id) : addLearner(pick.seat, id)), () => { setPick(null); setHeroOpen(null) })} />
      )}

      {heroOpen && world.heroes[heroOpen] && (() => {
        const seat = world.heroes[heroOpen]!
        return (
          <BottomSheet title={`Hero · ${heroLimit(heroOpen).name}`} onClose={() => setHeroOpen(null)}>
            <div className="space-y-2">
              <p className="text-[14px]"><span className="font-semibold">{outfit(seat.hero)?.name ?? seat.hero}</span> uses {heroLimit(heroOpen).name} as her only Limit Break, at full strength.</p>
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
                <AtlasSprite art={view.art} family="outfit-icons" frameKey={learner.outfitId} size={48} />
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

/** Owned Umas who may take the seat: never a Hero elsewhere; a Learner never one with two Heroes already. Highest level first. */
function UmaPicker({ view, world, pick, onClose, onPick }: { view: MasterView; world: TierWorld; pick: Pick; onClose: () => void; onPick: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const block = (id: string) => (pick.role === 'hero' ? heroBlock(world, pick.seat, id) : learnerBlock(world, pick.seat, id))
  const rows = view.roster
    .filter((o: RosterOutfit) => world.umas[o.outfitId] && world.heroes[pick.seat]?.hero !== o.outfitId && !block(o.outfitId))
    .filter((o) => !q || o.name.toLowerCase().includes(q) || (o.title ?? '').toLowerCase().includes(q))
    .map((o) => ({ o, uma: world.umas[o.outfitId]! }))
    .sort((a, b) => b.uma.level - a.uma.level || a.o.name.localeCompare(b.o.name))
  return (
    <BottomSheet title={pick.role === 'hero' ? `Hero for ${heroLimit(pick.seat).name}` : `Learner for ${heroLimit(pick.seat).name}`} onClose={onClose}>
      <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name" aria-label="Search by name"
        className="mb-2 min-h-11 w-full rounded-sm bg-sunken px-3 text-[14px]" />
      <ul className="space-y-1.5">
        {rows.length === 0 && <li className="text-[14px] text-ink-soft">Nobody can take this seat.</li>}
        {rows.map(({ o, uma }) => {
          const parents = parentsOf(world, o.outfitId)
          const bond = bondOf(uma, pick.seat)
          return (
            <li key={o.outfitId}>
              <button type="button" onClick={() => onPick(o.outfitId)} className="flex w-full items-center gap-3 rounded-sm bg-raised p-2 text-left">
                <AtlasSprite art={view.art} family="outfit-icons" frameKey={o.outfitId} size={40} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{o.name}</span>
                  <span className="block truncate text-[12px] text-ink-soft">
                    Lv {uma.level}{uma.classId ? ` · ${CLASS_LABEL[uma.classId]}` : ''}
                    {pick.role === 'learner' && parents.length ? ` · learns under ${heroLimit(parents[0]!).name}` : ''}
                    {pick.role === 'learner' && (bond.level || bond.exp) ? ` · Bond ${bond.level} here` : ''}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 text-[11px] text-ink-faint">{pick.role === 'hero' ? 'Hidden: Heroes of other seats, and Learners.' : `Hidden: Heroes, and Learners who have ${LEARNER_MAX_PARENTS} Heroes.`}</p>
    </BottomSheet>
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
                {seat ? <AtlasSprite art={view.art} family="outfit-icons" frameKey={seat.hero} size={28} /> : <span className="size-7 rounded-full border border-dashed border-hairline-strong" />}
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
