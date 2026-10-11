// The Exchange (S4, design §11, D54): Laurels from battles buy raw items of the continents you've reached, Time
// Tickets, Sweep Tickets and any token (D80); tokens and spare stock sell back for Laurels. A Sweep replays a beaten
// regular stage at once and pays what a replay pays (D79).
import { chapterGrades, rawItemPrice, REPLAY_SHARE, SWEEP_TICKET_PRICE, TIME_TICKET_PRICE } from '../economy/pacing'
import { dishById } from '../economy/dishes'
import { gearById } from '../economy/gear'
import { itemById } from '../items/catalog'
import type { RpgCampaignChapter } from '../rpg/campaign/chapters'
import { openFightOf, payEntrants, stageLaurels, worldRun, type FightResult } from './battle'
import { stageBand, stagePay } from '../world/world'
import { PARTY_SIZE, type Save, type TierWorld } from './save'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { workOf } from './status'
import { isToken, levelBand, rollTokens, tokenBuyPrice, tokenById, tokenSellPrice } from '../economy/tokens'

export const MAX_PURCHASE = 99

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/** Grades the Exchange stocks: each continent with a won stage brings its grade pair (band n: grades 2n − 1 and 2n). */
export function stockedGrades(world: TierWorld): number[] {
  const grades = new Set<number>()
  for (const [stageId, wins] of Object.entries(worldRun(world).wins)) {
    const band = stageBand(stageId)
    if (wins > 0 && band >= 1) for (const g of chapterGrades(((band - 1) % 5) + 1)) grades.add(g)
  }
  return [...grades].sort((a, b) => a - b)
}

export function buyRawItem(save: Save, itemId: string, quantity: number, stocked: readonly number[], now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const item = itemById(itemId)
  if (!item || item.refined) throw new SaveRuleError('bad-job', 'the Exchange sells raw items only')
  if (!stocked.includes(item.grade)) throw new SaveRuleError('bad-job', `Grade ${item.grade} isn’t stocked yet: win a stage on its continent`)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_PURCHASE) throw new SaveRuleError('bad-count', `buy 1–${MAX_PURCHASE}`)
  const cost = rawItemPrice(item.grade) * quantity
  if (world.wallet.laurels < cost) throw new SaveRuleError('no-laurels', `needs ${cost} Laurels`)
  return withWorld(save, tier, {
    ...world, wallet: { ...world.wallet, laurels: world.wallet.laurels - cost }, items: { ...world.items, [item.id]: (world.items[item.id] ?? 0) + quantity },
  }, now)
}

export function buyTickets(save: Save, kind: 'time' | 'sweep', quantity: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_PURCHASE) throw new SaveRuleError('bad-count', `buy 1–${MAX_PURCHASE}`)
  const cost = (kind === 'time' ? TIME_TICKET_PRICE : SWEEP_TICKET_PRICE) * quantity
  if (world.wallet.laurels < cost) throw new SaveRuleError('no-laurels', `needs ${cost} Laurels`)
  const wallet = kind === 'time'
    ? { ...world.wallet, laurels: world.wallet.laurels - cost, timeTickets: world.wallet.timeTickets + quantity }
    : { ...world.wallet, laurels: world.wallet.laurels - cost, sweepTickets: world.wallet.sweepTickets + quantity }
  return withWorld(save, tier, { ...world, wallet }, now)
}

/** Why the active party can't sweep this stage, or null. */
export function sweepBlock(world: TierWorld, chapter: RpgCampaignChapter, nodeId: string): string | null {
  const node = chapter.nodes.find((n) => n.id === nodeId)
  if (!node || node.kind !== 'fight') return 'Only regular stages can be swept'
  if ((worldRun(world).wins[nodeId] ?? 0) < 1) return 'Clear it first'
  const slots = world.parties[world.world.activeParty]?.slots ?? []
  if (slots.length !== PARTY_SIZE || slots.some((s) => s === null)) return 'Needs a full party'
  if (slots.some((s) => s && workOf(world, s))) return 'A member is working'
  if (openFightOf(world)) return 'Finish the open fight first'
  if (world.wallet.sweepTickets < 1) return 'No Sweep Tickets'
  return null
}

/** Sweeps the same stage up to `times` times (stopping when tickets run out), adding up what each paid. */
export function sweepMany(save: Save, chapter: RpgCampaignChapter, nodeId: string, times: number, now: string, tier = TIER_ONE): { save: Save; result: FightResult; swept: number } {
  if (!Number.isInteger(times) || times < 1 || times > MAX_PURCHASE) throw new SaveRuleError('bad-count', `sweep 1–${MAX_PURCHASE} times`)
  let current = save
  const results: FightResult[] = []
  for (let i = 0; i < times; i++) {
    if (i > 0 && sweepBlock(worldOf(current, tier), chapter, nodeId)) break
    const r = sweepFight(current, chapter, nodeId, now, tier)
    current = r.save
    results.push(r.result)
  }
  const first = results[0]!
  const last = results[results.length - 1]!
  const tokens: Record<string, number> = {}
  for (const r of results) for (const [id, n] of Object.entries(r.tokens)) tokens[id] = (tokens[id] ?? 0) + n
  const result: FightResult = {
    ...first,
    laurels: results.reduce((n, r) => n + r.laurels, 0),
    tokens,
    shards: results.reduce((n, r) => n + r.shards, 0),
    tickets: results.reduce((n, r) => n + r.tickets, 0),
    members: last.members.map((m) => {
      const all = results.map((r) => r.members.find((x) => x.outfitId === m.outfitId)!)
      return { ...m, beforeLevel: all[0]!.beforeLevel, exp: all.reduce((n, x) => n + x.exp, 0), shards: all.reduce((n, x) => n + x.shards, 0) }
    }),
  }
  return { save: current, result, swept: results.length }
}

/** Spends a Sweep Ticket on a cleared regular stage: it pays as a replay (D79), a quarter of the first clear's EXP and
 * Laurels and each token's chance, with MP untouched. */
export function sweepFight(save: Save, chapter: RpgCampaignChapter, nodeId: string, now: string, tier = TIER_ONE): { save: Save; result: FightResult } {
  const world = worldOf(save, tier)
  const block = sweepBlock(world, chapter, nodeId)
  if (block) throw new SaveRuleError('cannot-fight', block)
  const node = chapter.nodes.find((n) => n.id === nodeId)!
  const run = worldRun(world)
  const wins = run.wins[nodeId] ?? 0
  const pay = stagePay(node)
  const paid = payEntrants(world, world.parties[world.world.activeParty]!.slots as string[], 'fight', node.level,
    Math.round(stageLaurels('fight', chapter.tier, false, node.level) * pay), tier, REPLAY_SHARE * pay)
  // Seeded by the stage and its win count, so each Sweep rolls afresh but a retried save rolls the same.
  const tokens = rollTokens(`sweep:${nodeId}:${wins}`, 'fight', levelBand(node.level), REPLAY_SHARE, node.waves?.length ?? 0)
  const items = { ...paid.world.items }
  for (const [id, n] of Object.entries(tokens)) items[id] = (items[id] ?? 0) + n
  const next: TierWorld = {
    ...paid.world, items,
    wallet: { ...paid.world.wallet, sweepTickets: paid.world.wallet.sweepTickets - 1 },
    world: { ...world.world, run: { ...run, wins: { ...run.wins, [nodeId]: wins + 1 }, updatedAt: now } },
  }
  return { save: withWorld(save, tier, next, now), result: { outcome: 'victory', chapterId: chapter.id, nodeId, rounds: 0, members: paid.members, laurels: paid.laurels,
    shards: paid.shards, tickets: paid.tickets, tokens, firstClear: false } }
}

// --- Tokens for Laurels (D80): any token sells for 20 × its band and buys for twice that ---------------------------

/** Buys `quantity` of any token, of any kind and band, for Laurels. */
export function buyTokens(save: Save, tokenId: string, quantity: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (!tokenById(tokenId)) throw new SaveRuleError('bad-job', 'not a token')
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_PURCHASE) throw new SaveRuleError('bad-count', `buy 1–${MAX_PURCHASE}`)
  const cost = tokenBuyPrice(tokenId) * quantity
  if (world.wallet.laurels < cost) throw new SaveRuleError('no-laurels', `needs ${cost} Laurels`)
  return withWorld(save, tier, {
    ...world, wallet: { ...world.wallet, laurels: world.wallet.laurels - cost }, items: { ...world.items, [tokenId]: (world.items[tokenId] ?? 0) + quantity },
  }, now)
}

// --- Selling (QoL): spare stock back for a few Laurels, always far below what buying costs ---------------------------

export type Shelf = 'items' | 'dishes' | 'gear'
/** Laurels for one (D65): raw `2 + 2g`, refined twice that, dishes and unbound gear `6 + 6g`; a token 20 × its band
 * (D80). */
export function sellPrice(shelf: Shelf, id: string): number {
  if (shelf === 'items' && isToken(id)) return tokenSellPrice(id)
  if (shelf === 'items') {
    const item = itemById(id)
    return item ? (2 + 2 * item.grade) * (item.refined ? 2 : 1) : 0
  }
  const grade = shelf === 'dishes' ? dishById(id)?.grade : gearById(id)?.grade
  return grade ? 6 + 6 * grade : 0
}

export function sellStock(save: Save, shelf: Shelf, id: string, quantity: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const stock = world[shelf]
  const have = stock[id] ?? 0
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > have) throw new SaveRuleError('bad-count', `you have ${have}`)
  const price = sellPrice(shelf, id)
  if (price < 1) throw new SaveRuleError('bad-job', 'that can’t be sold')
  const next = { ...stock, [id]: have - quantity }
  if (next[id] === 0) delete next[id]
  return withWorld(save, tier, { ...world, [shelf]: next, wallet: { ...world.wallet, laurels: world.wallet.laurels + price * quantity } }, now)
}
