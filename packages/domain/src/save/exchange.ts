// The Exchange (S4, design §11, D54): Laurels from battles buy raw items of the continents you've reached, Time
// Tickets and Sweep Tickets; spare stock sells back for Laurels; Marks buy Manuals (D102). A Sweep replays a beaten
// regular stage at once and pays what a replay pays (D79).
//
// From the economy stage (R2, PP17; the farm by line since H112, D224, FL12, FL13): raw materials by grade, G1–G5 after
// the tier's first win at 30 Laurels and G6–G10 after a win on continent 3 at 80, × the world's tier, in every world;
// selling materials and made items × the tier. Tickets as today.
import { chapterGrades, rawItemPrice, REPLAY_SHARE, SWEEP_TICKET_PRICE, TIME_TICKET_PRICE } from '../economy/pacing'
import { gemById } from '../economy/gems'
import { gearById } from '../economy/gear'
import { itemById } from '../items/catalog'
import { worldMaterialTier } from '../items/made'
import { madeIdentity } from '../items/made-id'
import { LINE_ITEMS, lineItem } from '../items/lines'
import { rpgRework } from '../rpg/battle/caps'
import type { RpgCampaignChapter } from '../rpg/campaign/chapters'
import { activeClass, classOf, openFightOf, payEntrants, stageLaurels, worldRun, type BattleOutfit, type FightResult, type MemberGain, type RankGain } from './battle'
import { grantClassTrack, grantTrack, MANUAL_EXP, MANUAL_PRICE, MARKS_SHARE, maxRankOf, trackOf, withTrack, type RankRef } from '../economy/ranks'
import { RPG_TIER0_BANK, rpgClassGate, rpgClassMaxRank, rpgIsTier0 } from '../rpg/rules'
import { stageBand, stagePay } from '../world/world'
import { gearStock, gemStock, isGrades, PARTY_SIZE, type Save, type TierWorld } from './save'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'

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

// --- R2's stock (PP17) -----------------------------------------------------------------------------------------------

/** The furthest continent of the world's own tier with a won stage (`stockedGrades`' reading of `stageBand`), 0 before the
 * first win. */
export function continentReached(world: TierWorld): number {
  let reached = 0
  for (const [stageId, wins] of Object.entries(worldRun(world).wins)) {
    const band = stageBand(stageId)
    if (wins > 0 && band >= 1) reached = Math.max(reached, ((band - 1) % 5) + 1)
  }
  return reached
}

/** A raw grade's band (FL12): G1–G5 low, G6–G10 high. */
export type RawBand = 'low' | 'high'
export const rawBand = (grade: number): RawBand => (grade <= 5 ? 'low' : 'high')
/** The continent a band opens after: G1–G5 after the tier's first win, G6–G10 after continent 3. */
export const stockedAfter = (band: RawBand): number => (band === 'low' ? 1 : 3)

/** The raw materials the Exchange sells now in a world (FL12): each line's ten grades, by band, in every tier. */
export function stockedTypes(world: TierWorld, _tier?: string | number): string[] {
  const reached = continentReached(world)
  return LINE_ITEMS.filter((m) => !m.refined && reached >= stockedAfter(rawBand(m.grade))).map((m) => m.id)
}

/** Raw prices (FL12): a G1–G5 item 30 Laurels, a G6–G10 one 80, × the world's tier (D170: fights pay × tier). */
export const RAW_PRICE_V3: Readonly<Record<RawBand, number>> = { low: 20, high: 53 }
/** A raw line item's price in a world of `tier`; 0 for an id that isn't one. */
export function rawPriceV4(id: string, tier: string | number): number {
  const m = lineItem(id)
  return m && !m.refined ? RAW_PRICE_V3[rawBand(m.grade)] * worldMaterialTier(Number(tier)) : 0
}

/** Buys raw items: by grade to engine v16 (`stocked` from `stockedGrades`), by id from the economy stage (`stocked` from
 * `stockedTypes`, refusing one it doesn't stock). */
export function buyRawItem(save: Save, itemId: string, quantity: number, stocked: readonly number[] | readonly string[], now: string, tier = TIER_ONE): Save {
  if (rpgRework('economy')) return buyMaterial(save, itemId, quantity, stocked as readonly unknown[], now, tier)
  const world = worldOf(save, tier)
  const item = itemById(itemId)
  if (!item || item.refined) throw new SaveRuleError('bad-job', 'the Exchange sells raw items only')
  if (!(stocked as readonly unknown[]).includes(item.grade)) throw new SaveRuleError('bad-job', `Grade ${item.grade} isn’t stocked yet: win a stage on its continent`)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_PURCHASE) throw new SaveRuleError('bad-count', `buy 1–${MAX_PURCHASE}`)
  const cost = rawItemPrice(item.grade) * quantity
  if (world.wallet.laurels < cost) throw new SaveRuleError('no-laurels', `needs ${cost} Laurels`)
  return withWorld(save, tier, {
    ...world, wallet: { ...world.wallet, laurels: world.wallet.laurels - cost }, items: { ...world.items, [item.id]: (world.items[item.id] ?? 0) + quantity },
  }, now)
}

/** The economy stage's purchase: a stocked raw line item at `rawPriceV4`. */
function buyMaterial(save: Save, itemId: string, quantity: number, stocked: readonly unknown[], now: string, tier: string): Save {
  const world = worldOf(save, tier)
  const material = lineItem(itemId)
  if (!material || material.refined) throw new SaveRuleError('bad-job', 'the Exchange sells raw items only')
  if (!stocked.includes(itemId)) throw new SaveRuleError('bad-job', 'Not stocked yet')
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_PURCHASE) throw new SaveRuleError('bad-count', `buy 1–${MAX_PURCHASE}`)
  const cost = rawPriceV4(itemId, tier) * quantity
  if (world.wallet.laurels < cost) throw new SaveRuleError('no-laurels', `needs ${cost} Laurels`)
  return withWorld(save, tier, {
    ...world, wallet: { ...world.wallet, laurels: world.wallet.laurels - cost }, items: { ...world.items, [itemId]: (world.items[itemId] ?? 0) + quantity },
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
  if (openFightOf(world)) return 'Finish the open fight first'
  if (world.wallet.sweepTickets < 1) return 'No Sweep Tickets'
  return null
}

/** One member's bars over several wins: first before, last after, EXP added up (stage and Echo Sweeps). */
export function mergeGains(all: readonly MemberGain[]): MemberGain {
  const last = all[all.length - 1]!
  const ranks: RankGain[] = []
  for (const m of all) {
    for (const g of m.ranks) {
      const same = ranks.find((r) => r.ref.kind === g.ref.kind && r.ref.id === g.ref.id)
      if (same) { same.exp += g.exp; same.after = g.after } else ranks.push({ ...g })
    }
  }
  const bonds: MemberGain['bonds'] = []
  for (const m of all) {
    for (const g of m.bonds) {
      const same = bonds.find((b) => b.limit === g.limit)
      if (same) { same.exp += g.exp; same.after = g.after } else bonds.push({ ...g })
    }
  }
  return { ...last, beforeLevel: all[0]!.beforeLevel, exp: all.reduce((n, x) => n + x.exp, 0), shards: all.reduce((n, x) => n + x.shards, 0), ranks, bonds }
}

/** Sweeps the same stage up to `times` times (stopping when tickets run out), adding up what each paid. */
export function sweepMany(save: Save, chapter: RpgCampaignChapter, nodeId: string, times: number, outfits: ReadonlyMap<string, BattleOutfit>, now: string,
  tier = TIER_ONE): { save: Save; result: FightResult; swept: number } {
  if (!Number.isInteger(times) || times < 1 || times > MAX_PURCHASE) throw new SaveRuleError('bad-count', `sweep 1–${MAX_PURCHASE} times`)
  let current = save
  const results: FightResult[] = []
  for (let i = 0; i < times; i++) {
    if (i > 0 && sweepBlock(worldOf(current, tier), chapter, nodeId)) break
    const r = sweepFight(current, chapter, nodeId, outfits, now, tier)
    current = r.save
    results.push(r.result)
  }
  const first = results[0]!
  const last = results[results.length - 1]!
  const sum = (key: 'laurels' | 'shards' | 'tickets' | 'gearMarks' | 'classMarks') => results.reduce((n, r) => n + r[key], 0)
  const result: FightResult = {
    ...first,
    laurels: sum('laurels'), shards: sum('shards'), tickets: sum('tickets'), gearMarks: sum('gearMarks'), classMarks: sum('classMarks'),
    members: last.members.map((m) => mergeGains(results.map((r) => r.members.find((x) => x.outfitId === m.outfitId)!))),
  }
  return { save: current, result, swept: results.length }
}

/** Spends a Sweep Ticket on a cleared regular stage: it pays as a replay (D79), a quarter of the first clear's EXP of
 * every kind and Laurels, with MP untouched. Her five weapons share Weapon EXP evenly (nothing is "used" in a Sweep). */
export function sweepFight(save: Save, chapter: RpgCampaignChapter, nodeId: string, outfits: ReadonlyMap<string, BattleOutfit>, now: string,
  tier = TIER_ONE): { save: Save; result: FightResult } {
  const world = worldOf(save, tier)
  const block = sweepBlock(world, chapter, nodeId)
  if (block) throw new SaveRuleError('cannot-fight', block)
  const node = chapter.nodes.find((n) => n.id === nodeId)!
  const run = worldRun(world)
  const wins = run.wins[nodeId] ?? 0
  const pay = stagePay(node)
  const entrants = (world.parties[world.world.activeParty]!.slots as string[]).map((id) => {
    const outfit = outfits.get(id)
    if (!outfit) throw new SaveRuleError('cannot-fight', `outfit ${id} isn't in the game data`)
    const classId = activeClass(outfit, world.umas[id]!, tier)
    return { outfitId: id, classId, weapons: classOf(world.umas[id]!, classId).weapons, used: new Set<never>() }
  })
  const paid = payEntrants(world, entrants, 'fight', node.level, Math.round(stageLaurels('fight', chapter.tier, false, node.level) * pay), tier, REPLAY_SHARE * pay)
  const next: TierWorld = {
    ...paid.world,
    wallet: { ...paid.world.wallet, sweepTickets: paid.world.wallet.sweepTickets - 1 },
    world: { ...world.world, run: { ...run, wins: { ...run.wins, [nodeId]: wins + 1 }, updatedAt: now } },
  }
  return { save: withWorld(save, tier, next, now), result: { outcome: 'victory', chapterId: chapter.id, nodeId, rounds: 0, members: paid.members, laurels: paid.laurels,
    shards: paid.shards, tickets: paid.tickets, gearMarks: paid.gearMarks, classMarks: paid.classMarks, firstClear: false } }
}

// --- Manuals (D102): Marks for EXP on one bar of one Uma --------------------------------------------------------------

/** Why she can't read Manuals for this bar now, or null. From v19 (Classes v3, CV8, CV9; H126) a class she can't fight as
 * in her world (`tier`) is refused with its gate, and a Tier 0 at Rank 10 reads on until her waiting EXP's bank is full. */
export function manualBlock(world: TierWorld, outfitId: string, ref: RankRef, count = 1, tier: number | string = TIER_ONE): string | null {
  const uma = world.umas[outfitId]
  if (!uma) return 'Not unlocked'
  if (isGrades(uma.gear) && ref.kind !== 'class') return 'Gear Manuals are retired'
  const gate = ref.kind === 'class' ? rpgClassGate(uma.ranks, ref.id, tier) : null
  if (gate) return gate
  const track = trackOf(uma.ranks, ref)
  const top = ref.kind === 'class' ? rpgClassMaxRank(ref.id) : maxRankOf(ref.kind)
  const banked = ref.kind === 'class' && rpgIsTier0(ref.id) && rpgClassMaxRank(ref.id) < maxRankOf('class')
  if (track.rank >= top && (!banked || track.exp >= RPG_TIER0_BANK)) return 'Already at the top rank'
  const marks = ref.kind === 'class' ? world.wallet.classMarks : world.wallet.gearMarks ?? 0
  return marks < MANUAL_PRICE * count ? `Needs ${MANUAL_PRICE * count} ${ref.kind === 'class' ? 'Class' : 'Gear'} Marks` : null
}

/** Buys and reads `count` Manuals for one Uma's bar: each spends 1,000 Marks for 1,000 EXP. EXP past the top rank banks
 * back at half rate, like any other. Gear Marks buy Weapon and Armor Manuals, Class Marks Class Manuals. Class Manuals
 * count her reset share down (save v32's "Her share", H130: `left`, never below 0), whichever class reads them. */
export function readManuals(save: Save, outfitId: string, ref: RankRef, count: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (!Number.isInteger(count) || count < 1 || count > MAX_PURCHASE) throw new SaveRuleError('bad-count', `read 1–${MAX_PURCHASE}`)
  const block = manualBlock(world, outfitId, ref, count, tier)
  if (block) throw new SaveRuleError(block.startsWith('Needs') ? 'no-laurels' : 'bad-job', block)
  const uma = world.umas[outfitId]!
  const r = ref.kind === 'class' ? grantClassTrack(trackOf(uma.ranks, ref), ref.id, MANUAL_EXP * count)
    : grantTrack(trackOf(uma.ranks, ref), ref.kind, MANUAL_EXP * count)
  const back = Math.floor(r.overflow * MARKS_SHARE)
  const key = ref.kind === 'class' ? 'classMarks' : 'gearMarks'
  const marks = world.wallet[key] ?? 0
  const record = world.classesV3, line = record?.umas[outfitId]
  const share = ref.kind === 'class' && record && line && line.left > 0
    ? { classesV3: { ...record, umas: { ...record.umas, [outfitId]: { ...line, left: Math.max(0, line.left - count) } } } } : {}
  return withWorld(save, tier, {
    ...world, umas: { ...world.umas, [outfitId]: { ...uma, ranks: withTrack(uma.ranks, ref, r.track) } },
    wallet: { ...world.wallet, [key]: marks - MANUAL_PRICE * count + back }, ...share,
  }, now)
}

// --- Selling (QoL): spare stock back for a few Laurels, always far below what buying costs ---------------------------

export type Shelf = 'items' | 'gems' | 'gear'

/** Selling prices (PP17, FL13), before × the world's tier: raw G1–G5 6, G6–G10 16; refined twice that; a made item
 * 6 + 6g. */
export const SELL_RAW_V3: Readonly<Record<RawBand, number>> = { low: 4, high: 11 }
function sellPriceV3(shelf: Shelf, id: string, tier: number): number {
  if (shelf !== 'items') return 0
  const material = lineItem(id)
  const made = madeIdentity(id)
  const base = material ? SELL_RAW_V3[rawBand(material.grade)] * (material.refined ? 2 : 1) : made ? 6 + 6 * made.grade : 0
  return base * worldMaterialTier(tier)
}

/** Laurels for one (D65): raw `2 + 2g`, refined twice that, Star Gems and unbound gear `6 + 6g`. From R2 (PP17) only the
 * Warehouse's materials and made items sell, × the world's `tier`. */
export function sellPrice(shelf: Shelf, id: string, tier: string | number = TIER_ONE): number {
  if (rpgRework('economy')) return sellPriceV3(shelf, id, Number(tier))
  if (shelf === 'items') {
    const item = itemById(id)
    return item ? (2 + 2 * item.grade) * (item.refined ? 2 : 1) : 0
  }
  const grade = shelf === 'gems' ? gemById(id)?.grade : gearById(id)?.grade
  return grade ? 6 + 6 * grade : 0
}

export function sellStock(save: Save, shelf: Shelf, id: string, quantity: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const stock = shelf === 'items' ? world.items : shelf === 'gems' ? gemStock(world) : gearStock(world)
  const have = stock[id] ?? 0
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > have) throw new SaveRuleError('bad-count', `you have ${have}`)
  const price = sellPrice(shelf, id, tier)
  if (price < 1) throw new SaveRuleError('bad-job', 'that can’t be sold')
  const next = { ...stock, [id]: have - quantity }
  if (next[id] === 0) delete next[id]
  return withWorld(save, tier, { ...world, [shelf]: next, wallet: { ...world.wallet, laurels: world.wallet.laurels + price * quantity } }, now)
}
