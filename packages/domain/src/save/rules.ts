// Collection and party rules (S2): pure functions over the save that return a new save or throw SaveRuleError.
// Design: game-design.md §3 (unlocks, D44 final), §6 (parties, one per Uma: D46), D47 (Shards → Tickets).
import { workOf } from './status'
import { newOwnedUma, normalizeName, PARTY_COUNT, PARTY_NAME_MAX, PARTY_SIZE, SHARDS_PER_TICKET, type Party, type Save, type TierWorld, type Wallet } from './save'

export type SaveRuleReason = 'no-ticket' | 'already-owned' | 'not-owned' | 'bad-party' | 'bad-slot' | 'bad-name' | 'no-world'
  | 'bad-build' | 'cannot-learn' | 'bad-loadout' | 'cannot-fight' | 'in-fight'
  | 'no-items' | 'bad-count' | 'busy' | 'bad-job' | 'no-laurels'

export class SaveRuleError extends Error {
  readonly reason: SaveRuleReason
  constructor(reason: SaveRuleReason, message: string) {
    super(message)
    this.name = 'SaveRuleError'
    this.reason = reason
  }
}

export const TIER_ONE = '1'

export function worldOf(save: Save, tier = TIER_ONE): TierWorld {
  const world = save.tierWorlds[tier]
  if (!world) throw new SaveRuleError('no-world', `no Tier ${tier} world`)
  return world
}

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/** Spends one Unlock Ticket on an outfit; final once committed (D44). */
export function unlockUma(save: Save, outfitId: string, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (world.umas[outfitId]) throw new SaveRuleError('already-owned', 'already unlocked')
  if (world.wallet.unlockTickets < 1) throw new SaveRuleError('no-ticket', 'no Unlock Tickets left')
  return withWorld(save, tier, {
    ...world,
    wallet: { ...world.wallet, unlockTickets: world.wallet.unlockTickets - 1 },
    umas: { ...world.umas, [outfitId]: newOwnedUma(now) },
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
  const parties: Party[] = world.parties.map((p) => ({ ...p, slots: p.slots.map((s) => (outfitId !== null && s === outfitId ? null : s)) }))
  const target = parties[party]
  if (!target) throw new SaveRuleError('bad-party', `party ${party} doesn't exist`)
  target.slots[slot] = outfitId
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

/** Adds Shards; every five become an Unlock Ticket at once (D47). */
export function addShards(wallet: Wallet, shards: number): Wallet {
  const total = wallet.shards + Math.max(0, Math.floor(shards))
  return { ...wallet, unlockTickets: wallet.unlockTickets + Math.floor(total / SHARDS_PER_TICKET), shards: total % SHARDS_PER_TICKET }
}

/** Busy at a site, a station or training (D16): she shows greyed out in her party and can't fight until recalled. */
export function isBusy(world: TierWorld, outfitId: string): boolean {
  return workOf(world, outfitId) !== null
}

export function isPartyFull(party: Party): boolean {
  return party.slots.every((s) => s !== null)
}
