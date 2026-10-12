// The Halls of Heroes (D106): five halls, one per class, four seats each. A seat's Hero always fights with its unique
// Limit Break; up to ten Learners sit under her, two Heroes at most each, and earn Bond with every won fight. A Bond
// stays with the Learner when she leaves, so returning to a Hero picks up where she was.
import {
  BOND_EXP_PER_WIN, BOND_EXP_TO_NEXT, BOND_MAX_LEVEL, HERO_LIMIT_IDS, HERO_MAX_LEARNERS, isHeroLimitId, LEARNER_MAX_PARENTS,
  type HeroLimitId,
} from '../rpg/hero-id'
import type { BattleInherit } from '../rpg/battle/types'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import type { BondTrack, HeroSeat, OwnedUma, Save, TierWorld } from './save'

/** The seat she is the Hero of, if any. */
export function heroSeatOf(world: Pick<TierWorld, 'heroes'>, outfitId: string): HeroLimitId | null {
  return HERO_LIMIT_IDS.find((id) => world.heroes[id]?.hero === outfitId) ?? null
}
/** The seats she learns under (two at most), in seat order. */
export function parentsOf(world: Pick<TierWorld, 'heroes'>, outfitId: string): HeroLimitId[] {
  return HERO_LIMIT_IDS.filter((id) => world.heroes[id]?.learners.includes(outfitId))
}
export const bondOf = (uma: Pick<OwnedUma, 'bonds'>, id: HeroLimitId): BondTrack => uma.bonds[id] ?? { level: 0, exp: 0 }

/** What she brings into a fight (engine v9): her Hero seat, or the Limit Breaks she inherits with her Bond and their Hero. */
export function heroFields(world: Pick<TierWorld, 'heroes' | 'umas'>, outfitId: string): { hero?: HeroLimitId; inherits?: BattleInherit[] } {
  const hero = heroSeatOf(world, outfitId)
  if (hero) return { hero }
  const uma = world.umas[outfitId]
  const inherits = parentsOf(world, outfitId).map((limit) => ({ limit, bond: uma ? bondOf(uma, limit).level : 0, from: world.heroes[limit]!.hero }))
  return inherits.length ? { inherits } : {}
}

/** Adds Bond EXP; past Bond 10 it's dropped. */
export function grantBond(track: BondTrack, amount: number): BondTrack {
  let { level, exp } = track
  exp += Math.max(0, Math.floor(amount))
  while (level < BOND_MAX_LEVEL && exp >= BOND_EXP_TO_NEXT) { exp -= BOND_EXP_TO_NEXT; level += 1 }
  return level >= BOND_MAX_LEVEL ? { level: BOND_MAX_LEVEL, exp: 0 } : { level, exp }
}

/** One Bond a won fight raised. */
export interface BondGain { limit: HeroLimitId; exp: number; before: BondTrack; after: BondTrack }
/** Bond EXP a won fight pays one Learner, toward each Hero she sits under. */
export function payBonds(world: Pick<TierWorld, 'heroes'>, outfitId: string, uma: OwnedUma, kind: keyof typeof BOND_EXP_PER_WIN): { uma: OwnedUma; gains: BondGain[] } {
  const gains: BondGain[] = []
  let bonds = uma.bonds
  for (const limit of parentsOf(world, outfitId)) {
    const before = bondOf(uma, limit)
    if (before.level >= BOND_MAX_LEVEL) continue
    const after = grantBond(before, BOND_EXP_PER_WIN[kind])
    bonds = { ...bonds, [limit]: after }
    gains.push({ limit, exp: BOND_EXP_PER_WIN[kind], before, after })
  }
  return { uma: gains.length ? { ...uma, bonds } : uma, gains }
}

function withHeroes(save: Save, tier: string, world: TierWorld, heroes: TierWorld['heroes'], now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: { ...world, heroes } } }
}
function seatId(id: string): HeroLimitId {
  if (!isHeroLimitId(id)) throw new SaveRuleError('bad-slot', 'not a Hero seat')
  return id
}

/** Why she can't be this seat's Hero, or null. */
export function heroBlock(world: TierWorld, id: HeroLimitId, outfitId: string): string | null {
  if (!world.umas[outfitId]) return 'Not unlocked'
  const seat = heroSeatOf(world, outfitId)
  if (seat && seat !== id) return 'Already a Hero'
  if (parentsOf(world, outfitId).length) return 'A Learner: leave her Heroes first'
  return null
}
/** Why she can't learn under this seat's Hero, or null. */
export function learnerBlock(world: TierWorld, id: HeroLimitId, outfitId: string): string | null {
  const seat = world.heroes[id]
  if (!seat) return 'This seat has no Hero'
  if (!world.umas[outfitId]) return 'Not unlocked'
  if (heroSeatOf(world, outfitId)) return 'A Hero'
  if (seat.learners.includes(outfitId)) return 'Already learning here'
  if (parentsOf(world, outfitId).length >= LEARNER_MAX_PARENTS) return `Already has ${LEARNER_MAX_PARENTS} Heroes`
  if (seat.learners.length >= HERO_MAX_LEARNERS) return `${HERO_MAX_LEARNERS} Learners at most`
  return null
}

/** Seats a Hero, or swaps the one there (her Learners stay); null empties the seat, which sends its Learners away. */
export function setHero(save: Save, limitId: string, outfitId: string | null, now: string, tier = TIER_ONE): Save {
  const id = seatId(limitId)
  const world = worldOf(save, tier)
  const { [id]: seat, ...rest } = world.heroes
  if (outfitId === null) return withHeroes(save, tier, world, rest, now)
  const block = heroBlock(world, id, outfitId)
  if (block) throw new SaveRuleError(world.umas[outfitId] ? 'too-many' : 'not-owned', block)
  const next: HeroSeat = { hero: outfitId, learners: seat?.learners ?? [] }
  return withHeroes(save, tier, world, { ...world.heroes, [id]: next }, now)
}

/** Puts a Learner under a seat's Hero. */
export function addLearner(save: Save, limitId: string, outfitId: string, now: string, tier = TIER_ONE): Save {
  const id = seatId(limitId)
  const world = worldOf(save, tier)
  const block = learnerBlock(world, id, outfitId)
  if (block) throw new SaveRuleError(world.umas[outfitId] ? 'too-many' : 'not-owned', block)
  const seat = world.heroes[id]!
  return withHeroes(save, tier, world, { ...world.heroes, [id]: { ...seat, learners: [...seat.learners, outfitId] } }, now)
}

/** Takes a Learner from under a seat's Hero; her Bond stays with her. */
export function removeLearner(save: Save, limitId: string, outfitId: string, now: string, tier = TIER_ONE): Save {
  const id = seatId(limitId)
  const world = worldOf(save, tier)
  const seat = world.heroes[id]
  if (!seat?.learners.includes(outfitId)) throw new SaveRuleError('not-owned', 'not a Learner here')
  return withHeroes(save, tier, world, { ...world.heroes, [id]: { ...seat, learners: seat.learners.filter((l) => l !== outfitId) } }, now)
}
