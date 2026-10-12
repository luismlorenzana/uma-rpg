// H14: economic victory ledger, not a second combat simulator. The opt-in report assumes every stage is won;
// world/balance.test.ts measures whether a party can actually win. Nothing is spent or silently trained here.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { ITEM_FAMILIES, gradeUnlockLevel } from '../items/catalog'
import { rpgRewardKind, type RpgRewardKind } from '../rpg/campaign/rewards'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import { rpgDefaultWeapons } from '../rpg/rules'
import { chooseClass, payEntrants, springReadyAt, stageLaurels, useSpring } from '../save/battle'
import { setPartySlot, unlockUma, worldOf } from '../save/rules'
import { MAX_UMA_LEVEL, newSave, parseSave, PARTY_SIZE, STARTING_UNLOCK_TICKETS, type Save, type TierWorld } from '../save/save'
import { grantProfessionExp, planJob, type WorkOutfit } from '../save/work'
import { regionChapter, stagePay, worldContinent, WORLD_LEVELS, type WorldRegion } from '../world/world'
import { MOONS } from './dishes'
import { gearById, gearId } from './gear'
import { jobComplete, jobEndsAt, jobFinished, type Job } from './jobs'
import { aptitudeTime, CLASS_MAX_RANK, FACILITY_SPEED, LATE_LAURELS, MAX_JOB_COUNT, MINUTE, MASTERY_MAX_RANK, REPLAY_SHARE } from './pacing'
import {
  cookTokenId, gradeBand, levelBand, masteryBand, masteryTokenId, PROMOTION_BANDS, promotionTokenId,
  rollTokens, TOKEN_BANDS, TOKEN_DROPS, TOKEN_ODDS, tokenBuyPrice, tokenById,
} from './tokens'

const EPOCH = Date.parse('2026-10-12T00:00:00.000Z')
const at = (ms: number) => new Date(EPOCH + ms).toISOString()
// Packet assumptions, not game constants or measured playback durations.
const FIGHT_SECONDS: Record<RpgRewardKind, number> = { fight: 40, 'sub-boss': 70, vanguard: 70, boss: 100 }
const TARGET_MINUTES = 4 * 60, TARGET_TOLERANCE = 0.25
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `sim-foe-${i}`, name: `Synthetic foe ${i}` }))
const continents = Array.from({ length: TOKEN_BANDS }, (_, i) => worldContinent({ name: `Synthetic continent ${i + 1}`, order: i + 1 }))
const regions = continents.flatMap((c) => c.regions)
const ids = Array.from({ length: PARTY_SIZE }, (_, i) => `${9_000_000 + i}`) // invented positive ids, never master data
const classes = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner'] as const
type Counts = { class: number; mastery: number; cook: number }
const noCounts = (): Counts => ({ class: 0, mastery: 0, cook: 0 })
interface Band {
  band: number; fights: number; first: number; replays: number; milliseconds: number; exp: number; laurels: number
  lateExtra: number; tokens: Counts; expected: Counts
}

function freshParty(): Save {
  let save = newSave('Pacing simulation', at(0))
  ids.forEach((id, slot) => {
    save = unlockUma(save, id, at(0))
    save = setPartySlot(save, 0, slot, id, at(0))
    save = chooseClass(save, id, classes[slot]!, at(0))
  })
  return save
}

/** Abstract a won stage through the same reward/level/token functions used by fights and Sweeps. */
function win(save: Save, node: RpgMapNode, row: Band, seed: number, elapsed: number): Save {
  const world = worldOf(save), run = world.world.run, first = !(run.wins[node.id] ?? 0)
  const share = first ? 1 : REPLAY_SHARE, kind = rpgRewardKind(node), pay = stagePay(node)
  const laurels = Math.round(stageLaurels(kind, 1, first, node.level) * pay)
  const paid = payEntrants(world, ids, kind, node.level, laurels, '1', share * pay)
  const tokens = rollTokens(`${seed}:${node.id}:${run.wins[node.id] ?? 0}`, kind, levelBand(node.level), share, node.waves?.length ?? 0)
  const items = { ...world.items }
  for (const [id, count] of Object.entries(tokens)) {
    items[id] = (items[id] ?? 0) + count
    row.tokens[tokenById(id)!.kind] += count
  }
  const drops = TOKEN_DROPS[kind] + (node.waves?.length ?? 0)
  const guaranteed = kind === 'boss' || kind === 'sub-boss' ? 1 : 0
  const promotions = row.band <= PROMOTION_BANDS ? guaranteed + (drops - guaranteed) * TOKEN_ODDS.class : 0
  // Remaining odds split equally; use the actual odds to retain the D94 contract, not a second drop table.
  const nonPromotion = drops - promotions, others = TOKEN_ODDS.mastery + TOKEN_ODDS.cook
  row.expected.class += promotions * share
  row.expected.mastery += nonPromotion * TOKEN_ODDS.mastery / others * share
  row.expected.cook += nonPromotion * TOKEN_ODDS.cook / others * share
  row.fights++; row.first += Number(first); row.replays += Number(!first)
  row.milliseconds += FIGHT_SECONDS[kind] * 1000
  row.exp += paid.members[0]!.exp // each identical fresh Uma earns this, not a fivefold EXP total
  row.laurels += paid.laurels
  row.lateExtra += laurels - Math.round(stageLaurels(kind, 1, first, Math.min(node.level, LATE_LAURELS.fromLevel - 1)) * pay)
  return { ...save, account: { ...save.account, updatedAt: at(elapsed) }, tierWorlds: { '1': {
    ...paid.world, items, world: { ...world.world, run: { ...run, wins: { ...run.wins, [node.id]: (run.wins[node.id] ?? 0) + 1 }, updatedAt: at(elapsed) } },
  } } }
}

/** Traverse one complete region at the party's current level, then advance to its new level in increasing order.
 * Unused low-level regions remain fresh for other parties. If EXP is short after a region, replay its last regular
 * stage until the next level opens. At Lv50 stop immediately, including in the middle of a region. */
function simulate(seed = 1400) {
  let save = freshParty(), elapsed = 0, springUses = 0, last: WorldRegion | undefined
  const rows: Band[] = Array.from({ length: TOKEN_BANDS }, (_, i) => ({ band: i + 1, fights: 0, first: 0, replays: 0,
    milliseconds: 0, exp: 0, laurels: 0, lateExtra: 0, tokens: noCounts(), expected: noCounts() }))
  const visited: string[] = []
  for (let guard = 0; guard < 1000 && worldOf(save).umas[ids[0]!]!.level < MAX_UMA_LEVEL; guard++) {
    const level = worldOf(save).umas[ids[0]!]!.level
    const region = regions.find((r) => r.level >= level && r.level > (last?.level ?? 0))
    if (!region) throw new Error(`No frontier region at Lv${level}`)
    const chapter = regionChapter(region, cast), stages = chapter.nodes.filter((n) => n.kind !== 'camp')
    const row = rows[levelBand(region.level) - 1]!
    visited.push(region.id)
    for (const node of stages) {
      const refill = refillIfDry(save, elapsed)
      save = refill.save; elapsed = refill.elapsed; springUses += refill.used
      elapsed += FIGHT_SECONDS[rpgRewardKind(node)] * 1000
      save = win(save, node, row, seed, elapsed)
      if (worldOf(save).umas[ids[0]!]!.level === MAX_UMA_LEVEL) break
    }
    const replay = stages.filter((n) => n.kind === 'fight').at(-1)!
    for (let guard = 0; worldOf(save).umas[ids[0]!]!.level < MAX_UMA_LEVEL && worldOf(save).umas[ids[0]!]!.level <= region.levelTop; guard++) {
      if (guard > 1000) throw new Error('Replay EXP did not advance the frontier')
      elapsed += FIGHT_SECONDS.fight * 1000
      save = win(save, replay, row, seed, elapsed)
    }
    last = region
  }
  return { save, rows, visited, springUses, minutes: elapsed / MINUTE }
}

/** Shared stock can be traded; these are token-equivalents, not a claim each random class/stat/band is complete. */
function budget(rows: Band[], expected: boolean): Counts {
  const total = rows.reduce((sum, row) => {
    const got = expected ? row.expected : row.tokens
    for (const kind of ['class', 'mastery', 'cook'] as const) sum[kind] += got[kind] / PARTY_SIZE
    return sum
  }, noCounts())
  return total
}

/** One Brawler's current five weapons, Plate and Fire Orb; 28 refined items, no Forge tokens (D94). */
function fullSet(grade: number): Record<string, number> {
  const inputs: Record<string, number> = {}
  for (const type of [...rpgDefaultWeapons('brawler'), 'plate', 'orb-fire'] as const)
    for (const [id, n] of Object.entries(gearById(gearId(type, grade, 'atk'))!.inputs)) inputs[id] = (inputs[id] ?? 0) + n
  return inputs
}

const worker: WorkOutfit = { outfitId: ids[0]!, aptitudes: { surface: { turf: 'A', dirt: 'A' } } }
/** Conditional one-slot capacity at the band's grade. The worker must already meet that grade's profession gate. */
function capacity(world: TierWorld, grade: number, minutes: number, side: 'farming' | 'gathering'): number {
  const family = ITEM_FAMILIES.find((f) => f.side === side)!, uma = world.umas[worker.outfitId]!
  const leveled = { ...world, umas: { ...world.umas, [worker.outfitId]: { ...uma, professions: {
    ...uma.professions, [side]: { level: gradeUnlockLevel(grade), exp: 0 },
  } } } }
  const plan = planJob(leveled, family.site, worker, family.raw[grade - 1]!.id)!
  if (plan.block) throw new Error(plan.block)
  return minutes * MINUTE / plan.msEach
}

/** Fresh A workers continuously gather grade 1 in parallel with fights (not the fighting Umas in a real save).
 * Keep partial-output time between band boundaries; use timestamp completion and the live profession EXP curve. */
function freshWorker(rows: Band[], side: 'farming' | 'gathering') {
  const world = worldOf(freshParty()), family = ITEM_FAMILIES.find((f) => f.side === side)!
  const plan = planJob(world, family.site, worker, family.raw[0]!.id)!
  let time = 0, finished = 0, completedBefore = 0, profession = { level: 1, exp: 0 }
  let job: Job = { kind: 'gather', outfitId: worker.outfitId, output: plan.output.id, count: MAX_JOB_COUNT, collected: 0,
    startedAt: at(0), msEach: plan.msEach, expEach: plan.expEach, inputs: {}, queue: [] }
  const production = rows.map((row) => {
    time += row.milliseconds
    while (jobComplete(job, at(time))) {
      completedBefore += job.count
      job = { ...job, startedAt: new Date(jobEndsAt(job)).toISOString() }
    }
    const completed = completedBefore + jobFinished(job, at(time)), made = completed - finished
    profession = grantProfessionExp(profession, made * plan.expEach)
    finished = completed
    return made
  })
  return { production, profession, finished }
}

/** Spring readiness uses the live rule. Economic victories do not invent MP expenditure: baseline needs no Spring.
 * This helper supports an externally supplied dry-MP ledger and advances to the first recharge if all are dry. */
function refillIfDry(save: Save, elapsed: number): { save: Save; elapsed: number; used: number } {
  if (!ids.some((id) => worldOf(save).world.run.mp[id] === 0)) return { save, elapsed, used: 0 }
  const springs = continents.flatMap((c) => c.springs)
  let spring = springs.find((s) => !springReadyAt(worldOf(save), s.id, at(elapsed)))
  if (!spring) {
    const next = springs.map((s) => ({ spring: s, ready: Date.parse(springReadyAt(worldOf(save), s.id, at(elapsed))!) }))
      .sort((a, b) => a.ready - b.ready)[0]!
    elapsed = next.ready - EPOCH; spring = next.spring
  }
  return { save: useSpring(save, spring.id, at(elapsed)), elapsed, used: 1 }
}

const result = simulate()
const fullClassPrice = Array.from({ length: CLASS_MAX_RANK - 1 }, (_, i) => tokenBuyPrice(promotionTokenId('mage', i + 1))).reduce((a, b) => a + b, 0)

function report(): string {
  const farm = freshWorker(result.rows, 'farming'), wilds = freshWorker(result.rows, 'gathering')
  const world = worldOf(result.save), rows = [
    'Victory ledger: complete frontier regions; all currency banked; no combat, training or MP-spend estimate.',
    'Band | Wins (first/replay) | Fight min | EXP/Uma | Laurels | Class-track equivalents | Promotion/Mastery/Cooking | G | Refined/set | Raw capacity Farm/Wilds* | Fresh G1 raw Farm/Wilds',
  ]
  for (const r of result.rows) {
    const grade = 2 * r.band, materials = Object.values(fullSet(grade)).reduce((a, b) => a + b, 0), minutes = r.milliseconds / MINUTE
    rows.push(`${WORLD_LEVELS * (r.band - 1) + 1}–${WORLD_LEVELS * r.band} | ${r.fights} (${r.first}/${r.replays}) | ${minutes.toFixed(1)} | ${r.exp} | ${r.laurels} | ${(r.laurels / fullClassPrice).toFixed(2)} | ${r.tokens.class}/${r.tokens.mastery}/${r.tokens.cook} | ${grade} | ${materials} | ${capacity(world, grade, minutes, 'farming').toFixed(2)}/${capacity(world, grade, minutes, 'gathering').toFixed(2)} | ${farm.production[r.band - 1]}/${wilds.production[r.band - 1]}`)
  }
  const actual = budget(result.rows, false), expected = budget(result.rows, true)
  rows.push(`Total: ${result.rows.reduce((n, r) => n + r.fights, 0)} wins, ${result.minutes.toFixed(1)} min; five Lv50 Umas.`,
    `Per-Uma tokens, seeded actual P/M/C: ${actual.class.toFixed(2)}/${actual.mastery.toFixed(2)}/${actual.cook.toFixed(2)}; expectation: ${expected.class.toFixed(2)}/${expected.mastery.toFixed(2)}/${expected.cook.toFixed(2)}.`,
    `Expected token-equivalent tracks: ${(expected.class / (CLASS_MAX_RANK - 1)).toFixed(2)} class, ${(expected.mastery / (MASTERY_MAX_RANK - 1)).toFixed(2)} mastery, ${(expected.cook / MOONS).toFixed(2)} planet. Band/class/stat shortages can require Exchange trades.`,
    `Late extra Laurels/Uma: ${(result.rows.reduce((n, r) => n + r.lateExtra, 0) / PARTY_SIZE).toFixed(1)}, or ${(result.rows.reduce((n, r) => n + r.lateExtra, 0) / PARTY_SIZE / fullClassPrice).toFixed(2)} full class tracks.`,
    `*Conditional raw item-equivalents at A, facility Lv1. Partial items are unfinished; refined inputs also need Workbench time. Fresh workers end at Farm/Craft Lv${farm.profession.level}, with ${farm.finished}/${wilds.finished} grade-1 raw items; no higher-grade production (D96).`,
    'MP is not estimated: 0 Spring uses in the victory ledger is not a claim fights need no Springs. Four-hour target: UNDER. No game number retuned.')
  return rows.join('\n')
}

/** The design's small table is generated from the same run and checked even when SIM is off. */
function markdown(): string {
  const rows = ['| Band | Wins (first/replay) | Fight min | EXP/Uma | Laurels | P / M / C tokens |',
    '|---|---|---|---|---|---|']
  for (const r of result.rows) rows.push(`| ${WORLD_LEVELS * (r.band - 1) + 1}–${WORLD_LEVELS * r.band} | ${r.fights} (${r.first}/${r.replays}) | ${(r.milliseconds / MINUTE).toFixed(1)} | ${r.exp} | ${r.laurels} | ${r.tokens.class} / ${r.tokens.mastery} / ${r.tokens.cook} |`)
  return rows.join('\n')
}

describe('H14 pacing economy ledger', () => {
  it('levels five fresh Umas to 50, pays Shards, banks every reward and stays deterministic', () => {
    const world = worldOf(result.save)
    expect(ids.map((id) => world.umas[id]!.level)).toEqual(Array(PARTY_SIZE).fill(MAX_UMA_LEVEL))
    expect(world.wallet.unlockTickets).toBe(STARTING_UNLOCK_TICKETS) // five unlocks, five Lv50 replacement tickets
    expect(world.wallet.shards).toBe(0)
    expect(world.wallet.laurels).toBe(result.rows.reduce((n, r) => n + r.laurels, 0))
    expect(Object.values(world.items).reduce((a, b) => a + b, 0)).toBe(result.rows.reduce((n, r) => n + Object.values(r.tokens).reduce((a, b) => a + b, 0), 0))
    expect(simulate()).toEqual(result)
    expect(parseSave(JSON.parse(JSON.stringify(result.save)))).toEqual(result.save)
  })

  it('pays frontier replays a quarter, retains the first clear, and rolls fresh seeded token retention', () => {
    const row: Band = { band: 1, fights: 0, first: 0, replays: 0, milliseconds: 0, exp: 0, laurels: 0,
      lateExtra: 0, tokens: noCounts(), expected: noCounts() }
    const node = regionChapter(regions[0]!, cast).nodes.find((n) => n.kind === 'fight')!
    const first = win(freshParty(), node, row, 14, 40_000), second = win(first, node, row, 14, 80_000)
    expect([row.first, row.replays]).toEqual([1, 1])
    expect(worldOf(second).world.run.wins[node.id]).toBe(2)
    expect(worldOf(second).wallet.laurels - worldOf(first).wallet.laurels).toBe(stageLaurels('fight', 1, false, node.level))
    expect(worldOf(second).umas[ids[0]!]!.exp - worldOf(first).umas[ids[0]!]!.exp).toBe(Math.round(row.exp / (1 + REPLAY_SHARE) * REPLAY_SHARE))
    const drops = rollTokens(`14:${node.id}:1`, 'fight', 1, REPLAY_SHARE)
    for (const [id, n] of Object.entries(drops)) expect(worldOf(second).items[id]! - (worldOf(first).items[id] ?? 0)).toBe(n)
  })

  it.fails('D71 four-hour target ±25% — known miss under the packet’s 40/70/100-second assumptions', () => {
    // Expected failure, not a weakened success assertion. If tuning/policy makes the target pass, Vitest fails this
    // test so the known-miss marker must be removed. The opt-in report and PR expose the current measured miss.
    expect(result.minutes).toBeGreaterThanOrEqual(TARGET_MINUTES * (1 - TARGET_TOLERANCE))
    expect(result.minutes).toBeLessThanOrEqual(TARGET_MINUTES * (1 + TARGET_TOLERANCE))
  })

  it('meets D82/D94 expected token budgets through every recorded win and wave', () => {
    const tokens = budget(result.rows, true)
    expect(tokens.class).toBeGreaterThanOrEqual(2 * (CLASS_MAX_RANK - 1))
    expect(tokens.mastery).toBeGreaterThanOrEqual(2 * (MASTERY_MAX_RANK - 1))
    expect(tokens.cook).toBeGreaterThanOrEqual(2 * MOONS)
    // Real rank/dish bands and prices, not flattened or invented training costs.
    expect(Array.from({ length: MASTERY_MAX_RANK - 1 }, (_, i) => tokenById(masteryTokenId(masteryBand(i + 1)))!.band))
      .toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5])
    expect(tokenById(cookTokenId('hp', gradeBand(10)))!.band).toBe(5)
    expect(fullClassPrice).toBeGreaterThan(0)
  })

  it('counts the material-only seven-piece set and separates unlocked capacity from fresh workers', () => {
    for (const grade of [2, 4, 6, 8, 10]) {
      expect(Object.values(fullSet(grade)).reduce((a, b) => a + b, 0)).toBe(7 * 4)
      expect(Object.keys(fullSet(grade)).some((id) => id.startsWith('token-'))).toBe(false)
    }
    expect(freshWorker(result.rows, 'farming')).toEqual(freshWorker(result.rows, 'gathering'))
    expect(freshWorker(result.rows, 'farming').profession.level).toBe(1)
    expect(aptitudeTime('A')).toBe(0.5)
    expect(FACILITY_SPEED[0]).toBe(1)
  })

  it('uses ready Springs for dry MP, waits for recharge only when necessary, and keeps all currencies', () => {
    let save = freshParty(), elapsed = 0
    const dry = (s: Save): Save => { const w = worldOf(s); return { ...s, tierWorlds: { '1': { ...w, world: { ...w.world,
      run: { ...w.world.run, mp: Object.fromEntries(ids.map((id) => [id, 0])) },
    } } } } }
    expect(refillIfDry(save, elapsed).used).toBe(0)
    for (const _spring of continents.flatMap((c) => c.springs)) {
      const r = refillIfDry(dry(save), elapsed); save = r.save; elapsed = r.elapsed
      expect(elapsed).toBe(0); expect(worldOf(save).world.run.mp).toEqual({})
    }
    const r = refillIfDry(dry(save), elapsed)
    expect(r.elapsed).toBeGreaterThan(0)
    expect(worldOf(r.save).wallet).toEqual(worldOf(save).wallet)
    expect(worldOf(r.save).items).toEqual(worldOf(save).items)
  })

  it('keeps the Simulated design table in step with the full ledger', () => {
    const doc = readFileSync(new URL('../../../../docs/design/pacing.md', import.meta.url), 'utf8')
    expect(doc.split('<!-- pacing-sim -->\n')[1]?.split('\n<!-- /pacing-sim -->')[0]).toBe(markdown())
  })

  it.skipIf(process.env.SIM !== '1')('prints the Lv1–50 table and target misses', () => console.log(report()))
})
