// The Exchange (S4, design §11, D54): Laurels from battles buy raw items of the chapters you've reached, Rush Tickets
// and Sweep Tickets. A Sweep completes a beaten regular fight at once: its EXP and Shards, no Laurels.
import { chapterGrades, rawItemPrice, RUSH_TICKET_PRICE, SWEEP_TICKET_PRICE } from '../economy/pacing'
import { itemById } from '../items/catalog'
import type { RpgCampaignChapter } from '../rpg/campaign/chapters'
import { rpgRunKey } from '../rpg/campaign/run'
import { openFightOf, payEntrants, runOf, type FightResult } from './battle'
import { PARTY_SIZE, type Save, type TierWorld } from './save'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { workOf } from './status'

export const MAX_PURCHASE = 99

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/** Grades the Exchange stocks: each chapter a party has won a fight in brings its grade pair (`order` within the tier). */
export function stockedGrades(world: TierWorld, chapters: readonly { id: string; order: number }[]): number[] {
  const grades = new Set<number>()
  for (const c of chapters) {
    const reached = Object.values(world.runs).some((r) => r.chapterId === c.id && Object.keys(r.wins).some((k) => k !== 'start'))
    if (reached) for (const g of chapterGrades(((c.order - 1) % 5) + 1)) grades.add(g)
  }
  return [...grades].sort((a, b) => a - b)
}

export function buyRawItem(save: Save, itemId: string, quantity: number, stocked: readonly number[], now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const item = itemById(itemId)
  if (!item || item.refined) throw new SaveRuleError('bad-job', 'the Exchange sells raw items only')
  if (!stocked.includes(item.grade)) throw new SaveRuleError('bad-job', `grade ${item.grade} isn’t stocked yet: reach its chapter`)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_PURCHASE) throw new SaveRuleError('bad-count', `buy 1–${MAX_PURCHASE}`)
  const cost = rawItemPrice(item.grade) * quantity
  if (world.wallet.laurels < cost) throw new SaveRuleError('no-laurels', `needs ${cost} Laurels`)
  return withWorld(save, tier, {
    ...world, wallet: { ...world.wallet, laurels: world.wallet.laurels - cost }, items: { ...world.items, [item.id]: (world.items[item.id] ?? 0) + quantity },
  }, now)
}

export function buyTickets(save: Save, kind: 'rush' | 'sweep', quantity: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_PURCHASE) throw new SaveRuleError('bad-count', `buy 1–${MAX_PURCHASE}`)
  const cost = (kind === 'rush' ? RUSH_TICKET_PRICE : SWEEP_TICKET_PRICE) * quantity
  if (world.wallet.laurels < cost) throw new SaveRuleError('no-laurels', `needs ${cost} Laurels`)
  const wallet = kind === 'rush'
    ? { ...world.wallet, laurels: world.wallet.laurels - cost, rushTickets: world.wallet.rushTickets + quantity }
    : { ...world.wallet, laurels: world.wallet.laurels - cost, sweepTickets: world.wallet.sweepTickets + quantity }
  return withWorld(save, tier, { ...world, wallet }, now)
}

/** Why the party can't sweep this node, or null. */
export function sweepBlock(world: TierWorld, chapter: RpgCampaignChapter, party: number, nodeId: string): string | null {
  const node = chapter.nodes.find((n) => n.id === nodeId)
  if (!node || node.kind !== 'fight') return 'Only regular fights can be swept'
  if ((runOf(world, party, chapter.id)?.wins[nodeId] ?? 0) < 1) return 'Beat it with this party first'
  const slots = world.parties[party]?.slots ?? []
  if (slots.length !== PARTY_SIZE || slots.some((s) => s === null)) return 'Needs a full party'
  if (slots.some((s) => s && workOf(world, s))) return 'A member is working'
  if (openFightOf(world, party)) return 'Finish the open fight first'
  if (world.wallet.sweepTickets < 1) return 'No Sweep Tickets'
  return null
}

/** Spends a Sweep Ticket on a beaten regular fight: EXP and Shards as if won, no Laurels, MP untouched. */
export function sweepFight(save: Save, chapter: RpgCampaignChapter, party: number, nodeId: string, now: string, tier = TIER_ONE): { save: Save; result: FightResult } {
  const world = worldOf(save, tier)
  const block = sweepBlock(world, chapter, party, nodeId)
  if (block) throw new SaveRuleError('cannot-fight', block)
  const node = chapter.nodes.find((n) => n.id === nodeId)!
  const run = runOf(world, party, chapter.id)!
  const paid = payEntrants(world, world.parties[party]!.slots as string[], 'fight', node.level, 0, tier)
  const next: TierWorld = {
    ...paid.world,
    wallet: { ...paid.world.wallet, sweepTickets: paid.world.wallet.sweepTickets - 1 },
    runs: { ...world.runs, [rpgRunKey(party, chapter.id)]: { ...run, wins: { ...run.wins, [nodeId]: (run.wins[nodeId] ?? 0) + 1 }, updatedAt: now } },
  }
  return { save: withWorld(save, tier, next, now), result: { outcome: 'victory', chapterId: chapter.id, nodeId, rounds: 0, members: paid.members, laurels: 0, shards: paid.shards, tickets: paid.tickets } }
}
