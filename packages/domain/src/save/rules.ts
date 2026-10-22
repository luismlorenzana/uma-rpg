// Collection and party rules (S2): pure functions over the save that return a new save or throw SaveRuleError.
// Design: game-design.md §3 (unlocks, D44 final), §6 (parties, one per Uma: D46), D47 (Uma Shards → Tickets).
import type { RpgClass } from '../rpg/rules'
import { workOf } from './status'
import { newOwnedUma, normalizeName, PARTY_COUNT, PARTY_NAME_MAX, PARTY_SIZE, SHARDS_PER_TICKET, type Party, type Save, type TierWorld, type Wallet } from './save'

export type SaveRuleReason = 'no-ticket' | 'already-owned' | 'not-owned' | 'bad-party' | 'bad-slot' | 'bad-name' | 'no-world'
  | 'bad-class' | 'cannot-learn' | 'bad-loadout' | 'cannot-fight' | 'in-fight'
  | 'no-items' | 'bad-count' | 'busy' | 'bad-job' | 'no-laurels' | 'too-many'

export class SaveRuleError extends Error {
  readonly reason: SaveRuleReason
  constructor(reason: SaveRuleReason, message: string) {
    super(message)
    this.name = 'SaveRuleError'
    this.reason = reason
  }
}

export const TIER_ONE = '1'

/** A tier number as the save's world key: 2 → "2" (H35). The app counts tiers in numbers; the save keys them by string. */
export const tierKey = (tier: number): string => String(tier)

/** A tier's look (H36, tiers.md T2): its tint over the theme. The same strings as uma-kit's `Tint`; the domain never
 * imports the kit. */
export type TierLook = 'day' | 'dusk' | 'night'

export interface TierInfo {
  readonly tier: number
  readonly name: string
  readonly look: TierLook
}

/** The tiers, 1 to 3: master data has three and uma-art three crests. Names from tiers.md §6 (Option A, D159). */
export const TIERS: readonly TierInfo[] = [
  { tier: 1, name: 'Apprentice', look: 'day' },
  { tier: 2, name: 'Adept', look: 'dusk' },
  { tier: 3, name: 'Master', look: 'night' },
]

/** A tier's look; a tier past the list keeps the last one's. */
export const tierLook = (tier: number): TierLook => (TIERS.find((t) => t.tier === tier) ?? TIERS.at(-1)!).look

/** The tiers that have a world in the save, lowest first. Tier 1 always does. */
export function savedTiers(save: Pick<Save, 'tierWorlds'>): number[] {
  return Object.keys(save.tierWorlds).map(Number).sort((a, b) => a - b)
}

/** The tier whose world she lives in, or null when no world owns her. An Uma lives in one tier world (D159 §3). */
export function ownerTier(save: Pick<Save, 'tierWorlds'>, outfitId: string): number | null {
  return savedTiers(save).find((tier) => save.tierWorlds[tierKey(tier)]?.umas[outfitId]) ?? null
}

export function worldOf(save: Save, tier = TIER_ONE): TierWorld {
  const world = save.tierWorlds[tier]
  if (!world) throw new SaveRuleError('no-world', `no Tier ${tier} world`)
  return world
}

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/**
 * Spends one Uma Ticket on an outfit; final once committed (D44). `startClass` is her starting class, which picks her
 * armor kinds (D160 §7); without it she starts all-physical. A Paladin start (classes v2) is also written as her class
 * (D180). An outfit any world owns is refused: she lives in one (§3).
 */
export function unlockUma(save: Save, outfitId: string, now: string, tier = TIER_ONE, startClass?: RpgClass): Save {
  const world = worldOf(save, tier)
  const home = ownerTier(save, outfitId)
  if (home !== null) throw new SaveRuleError('already-owned', home === Number(tier) ? 'already unlocked' : `already in Tier ${home}`)
  if (world.wallet.unlockTickets < 1) throw new SaveRuleError('no-ticket', 'no Uma Tickets left')
  return withWorld(save, tier, {
    ...world,
    wallet: { ...world.wallet, unlockTickets: world.wallet.unlockTickets - 1 },
    umas: { ...world.umas, [outfitId]: newOwnedUma(now, startClass) },
  }, now)
}

/** Where an Uma sits, or null when she's in no party. */
export function partyOf(world: TierWorld, outfitId: string): { party: number; slot: number } | null {
  for (let party = 0; party < world.parties.length; party++) {
    const slot = world.parties[party]?.slots.indexOf(outfitId) ?? -1
    if (slot >= 0) return { party, slot }
  }
  return null
}

/** The member whose face represents a party. A party without an explicit lead falls back to its first member. */
export function partyLead(party: Party): string | null {
  return party.lead !== null && party.slots.includes(party.lead)
    ? party.lead
    : party.slots.find((id): id is string => id !== null) ?? null
}

/** Makes an existing member the lead without changing the party's chosen slot order. */
export function setPartyLead(save: Save, party: number, outfitId: string, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const target = world.parties[party]
  if (!Number.isInteger(party) || !target) throw new SaveRuleError('bad-party', `party ${party} doesn't exist`)
  const slot = target.slots.indexOf(outfitId)
  if (slot < 0) throw new SaveRuleError('not-owned', 'only a party member can lead it')
  if (world.world.run.party === party && world.world.run.battle !== null) throw new SaveRuleError('in-fight', 'finish or leave the open fight first')
  if (target.lead === outfitId) return save
  const parties = world.parties.map((row, index) => index === party ? { ...row, lead: outfitId } : row)
  return withWorld(save, tier, { ...world, parties }, now)
}

/**
 * Puts an owned Uma into a party slot (or empties it with null). She leaves any other slot she held: one party per Uma
 * (D46). Whoever was in the target slot is simply removed.
 */
export function setPartySlot(save: Save, party: number, slot: number, outfitId: string | null, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (!Number.isInteger(party) || party < 0 || party >= PARTY_COUNT) throw new SaveRuleError('bad-party', `party ${party} doesn't exist`)
  if (!Number.isInteger(slot) || slot < 0 || slot >= PARTY_SIZE) throw new SaveRuleError('bad-slot', `slot ${slot} doesn't exist`)
  if (outfitId !== null && !world.umas[outfitId]) throw new SaveRuleError('not-owned', 'only owned Umas can join a party')
  // A party in a fight keeps its line-up until the fight ends, and nobody leaves a fight for another party (D52).
  const fighting = (p: number) => world.world.run.party === p && world.world.run.battle !== null
  const from = outfitId === null ? null : partyOf(world, outfitId)
  if (fighting(party) || (from && fighting(from.party))) throw new SaveRuleError('in-fight', 'finish or leave the open fight first')
  const keepsLead = outfitId !== null && from?.party === party && world.parties[party]?.lead === outfitId
  const parties: Party[] = world.parties.map((p) => {
    const slots = p.slots.map((s) => (outfitId !== null && s === outfitId ? null : s))
    return { ...p, slots, lead: p.lead !== null && slots.includes(p.lead) ? p.lead : null }
  })
  const target = parties[party]
  if (!target) throw new SaveRuleError('bad-party', `party ${party} doesn't exist`)
  const displaced = target.slots[slot]
  target.slots[slot] = outfitId
  if (target.lead === displaced) target.lead = null
  if (keepsLead) target.lead = outfitId
  return withWorld(save, tier, { ...world, parties }, now)
}

export function renameParty(save: Save, party: number, name: string, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const clean = normalizeName(name, PARTY_NAME_MAX)
  if (!clean) throw new SaveRuleError('bad-name', `party names are 1–${PARTY_NAME_MAX} characters`)
  if (!world.parties[party]) throw new SaveRuleError('bad-party', `party ${party} doesn't exist`)
  const parties = world.parties.map((p, i) => (i === party ? { ...p, name: clean } : p))
  return withWorld(save, tier, { ...world, parties }, now)
}

/** Adds Uma Shards; every five become an Uma Ticket at once (D47). */
export function addShards(wallet: Wallet, shards: number): Wallet {
  const total = wallet.shards + Math.max(0, Math.floor(shards))
  return { ...wallet, unlockTickets: wallet.unlockTickets + Math.floor(total / SHARDS_PER_TICKET), shards: total % SHARDS_PER_TICKET }
}

/** Working at a site or a station. She still fights (D119); she just can't take a second job. */
export function isBusy(world: TierWorld, outfitId: string): boolean {
  return workOf(world, outfitId) !== null
}

export function isPartyFull(party: Party): boolean {
  return party.slots.every((s) => s !== null)
}
