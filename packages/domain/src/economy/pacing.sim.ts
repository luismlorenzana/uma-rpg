// H14: deterministic economic victory ledger. No combat, invented MP spend, training or tokens (D105).
import { ITEM_FAMILIES, gradeUnlockLevel } from '../items/catalog'
import { rpgRewardKind, type RpgRewardKind } from '../rpg/campaign/rewards'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import { rpgDefaultWeapons } from '../rpg/rules'
import { chooseClass, payEntrants, springReadyAt, stageLaurels, useSpring, type Entrant } from '../save/battle'
import { setPartySlot, unlockUma, worldOf } from '../save/rules'
import { MAX_UMA_LEVEL, newSave, PARTY_SIZE, type Save, type TierWorld } from '../save/save'
import { grantProfessionExp, planJob, type WorkOutfit } from '../save/work'
import { regionChapter, stagePay, worldContinent, WORLD_LEVELS, type WorldRegion } from '../world/world'
import { gearById, gearId } from './gear'
import { jobComplete, jobEndsAt, jobFinished, type Job } from './jobs'
import { LATE_LAURELS, MAX_JOB_COUNT, MINUTE, REPLAY_SHARE } from './pacing'

export const EPOCH = Date.parse('2026-10-12T00:00:00.000Z')
export const at = (ms: number) => new Date(EPOCH + ms).toISOString()
// Packet assumptions, not game constants or measured playback durations.
export const FIGHT_SECONDS: Record<RpgRewardKind, number> = { fight: 40, 'sub-boss': 70, vanguard: 70, boss: 100 }
export const TARGET_MINUTES = 4 * 60, TARGET_TOLERANCE = 0.25
export const cast = Array.from({ length: 30 }, (_, i) => ({ id: `sim-foe-${i}`, name: `Synthetic foe ${i}` }))
export const continents = Array.from({ length: MAX_UMA_LEVEL / WORLD_LEVELS }, (_, i) => worldContinent({ name: `Synthetic continent ${i + 1}`, order: i + 1 }))
export const regions = continents.flatMap((c) => c.regions)
export const ids = Array.from({ length: PARTY_SIZE }, (_, i) => `${9_000_000 + i}`) // invented positive ids, never master data
export const classes = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner'] as const
export interface Band {
  band: number; fights: number; first: number; replays: number; milliseconds: number; exp: number; laurels: number
  lateExtra: number; classExp: number; weaponExp: number; armorExp: number; gearMarks: number; classMarks: number
}
export const newBand = (band: number): Band => ({ band, fights: 0, first: 0, replays: 0, milliseconds: 0, exp: 0,
  laurels: 0, lateExtra: 0, classExp: 0, weaponExp: 0, armorExp: 0, gearMarks: 0, classMarks: 0 })

export function freshParty(): Save {
  let save = newSave('Pacing simulation', at(0))
  ids.forEach((id, slot) => {
    save = unlockUma(save, id, at(0))
    save = setPartySlot(save, 0, slot, id, at(0))
    save = chooseClass(save, id, classes[slot]!, at(0))
  })
  return save
}

/** Abstract a won stage through the same reward/level/token functions used by fights and Sweeps. */
export function win(save: Save, node: RpgMapNode, row: Band, _seed: number, elapsed: number): Save {
  const world = worldOf(save), run = world.world.run, first = !(run.wins[node.id] ?? 0)
  const share = first ? 1 : REPLAY_SHARE, kind = rpgRewardKind(node), pay = stagePay(node)
  const laurels = Math.round(stageLaurels(kind, 1, first, node.level) * pay)
  // No action ledger here: equal weapon shares, as a Sweep; real combat use is not invented.
  const entrants: Entrant[] = ids.map((outfitId, i) => ({ outfitId, classId: classes[i]!,
    weapons: rpgDefaultWeapons(classes[i]!), used: new Set() }))
  const paid = payEntrants(world, entrants, kind, node.level, laurels, '1', share * pay)
  const member = paid.members[0]!
  const barExp = (kind: 'class' | 'weapon' | 'armor') => member.ranks.filter((r) => r.ref.kind === kind).reduce((n, r) => n + r.exp, 0)
  row.classExp += barExp('class'); row.weaponExp += barExp('weapon'); row.armorExp += barExp('armor')
  row.gearMarks += paid.gearMarks; row.classMarks += paid.classMarks
  row.fights++; row.first += Number(first); row.replays += Number(!first)
  row.milliseconds += FIGHT_SECONDS[kind] * 1000
  row.exp += paid.members[0]!.exp // each identical fresh Uma earns this, not a fivefold EXP total
  row.laurels += paid.laurels
  row.lateExtra += laurels - Math.round(stageLaurels(kind, 1, first, Math.min(node.level, LATE_LAURELS.fromLevel - 1)) * pay)
  return { ...save, account: { ...save.account, updatedAt: at(elapsed) }, tierWorlds: { '1': {
    ...paid.world, world: { ...world.world, run: { ...run, wins: { ...run.wins, [node.id]: (run.wins[node.id] ?? 0) + 1 }, updatedAt: at(elapsed) } },
  } } }
}

/** The next unvisited region in the party's current five-level range, never a higher-level region. */
export function frontierRegion(level: number, visited: ReadonlySet<string>): WorldRegion | undefined {
  return regions.find((r) => r.level <= level && level <= r.levelTop && !visited.has(r.id))
}

/** Traverse one complete region at the party's current level, then advance to its new level in increasing order.
 * Unused low-level regions remain fresh for other parties. If EXP is short after a region, replay its last regular
 * stage until the next level opens. At Lv50 stop immediately, including in the middle of a region. */
export function simulate(seed = 1400) {
  let save = freshParty(), elapsed = 0, springUses = 0
  const rows: Band[] = Array.from({ length: MAX_UMA_LEVEL / WORLD_LEVELS }, (_, i) => newBand(i + 1))
  const visited: string[] = []
  for (let guard = 0; guard < 1000 && worldOf(save).umas[ids[0]!]!.level < MAX_UMA_LEVEL; guard++) {
    const level = worldOf(save).umas[ids[0]!]!.level
    const region = frontierRegion(level, new Set(visited))
    if (!region) throw new Error(`No frontier region at Lv${level}`)
    const chapter = regionChapter(region, cast), stages = chapter.nodes.filter((n) => n.kind !== 'camp')
    const row = rows[Math.ceil(region.level / WORLD_LEVELS) - 1]!
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
  }
  return { save, rows, visited, springUses, minutes: elapsed / MINUTE }
}

/** One Brawler's five weapons and five physical armor slots: 40 refined items (D103). */
export function fullSet(grade: number): Record<string, number> {
  const inputs: Record<string, number> = {}
  for (const type of [...rpgDefaultWeapons('brawler'), 'helm', 'cuirass', 'greaves', 'gauntlets', 'orb-greatsword'] as const)
    for (const [id, n] of Object.entries(gearById(gearId(type, grade, 'atk'))!.inputs)) inputs[id] = (inputs[id] ?? 0) + n
  return inputs
}

export const worker: WorkOutfit = { outfitId: ids[0]!, aptitudes: { surface: { turf: 'A', dirt: 'A' } } }
/** Conditional one-slot capacity at the band's grade. The worker must already meet that grade's profession gate. */
export function capacity(world: TierWorld, grade: number, minutes: number, side: 'farming' | 'gathering'): number {
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
export function freshWorker(rows: Band[], side: 'farming' | 'gathering') {
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
export function refillIfDry(save: Save, elapsed: number): { save: Save; elapsed: number; used: number } {
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

export const result = simulate()
/** Exact live-doc report; every numeric result is derived from the ledger, never hand-copied into a test. */
export function markdown(): string {
  const rows = [
    '| Band | Wins (first/replay) | Fight min | Uma EXP | Class EXP | Weapon EXP | Armor EXP | Laurels | Gear / Class Marks |',
    '|---|---|---|---|---|---|---|---|---|',
  ]
  for (const r of result.rows) rows.push(`| ${WORLD_LEVELS * (r.band - 1) + 1}–${WORLD_LEVELS * r.band} | ${r.fights} (${r.first}/${r.replays}) | ${(r.milliseconds / MINUTE).toFixed(1)} | ${r.exp} | ${r.classExp} | ${r.weaponExp} | ${r.armorExp} | ${r.laurels} | ${r.gearMarks} / ${r.classMarks} |`)
  const farm = freshWorker(result.rows, 'farming'), wilds = freshWorker(result.rows, 'gathering'), world = worldOf(result.save)
  rows.push('', 'EXP is per Uma; Weapon/Armor EXP sums her five bars. Currency and Marks are the whole party’s stock.', '',
    '| Grade | Refined / ten-piece set | Raw capacity Farm / Wilds* | Fresh G1 output Farm / Wilds |', '|---|---|---|---|')
  for (const r of result.rows) {
    const grade = 2 * r.band, minutes = r.milliseconds / MINUTE
    rows.push(`| ${grade} | ${Object.values(fullSet(grade)).reduce((n, v) => n + v, 0)} | ${capacity(world, grade, minutes, 'farming').toFixed(2)} / ${capacity(world, grade, minutes, 'gathering').toFixed(2)} | ${farm.production[r.band - 1]} / ${wilds.production[r.band - 1]} |`)
  }
  const total = result.rows.reduce((s, r) => ({ fights: s.fights + r.fights, first: s.first + r.first, replays: s.replays + r.replays }), { fights: 0, first: 0, replays: 0 })
  const uma = world.umas[ids[0]!]!
  rows.push('', `Total: **${total.fights} wins** (${total.first} first, ${total.replays} replay), **${result.minutes.toFixed(1)} fight minutes**, five Lv50 Umas.`,
    `Representative Brawler: Class Rank ${uma.ranks.classes.brawler!.rank}; five Weapon Ranks ${rpgDefaultWeapons('brawler').map((w) => uma.ranks.weapons[w]!.rank).join('/')}; five Armor Ranks ${Object.values(uma.ranks.armors).map((r) => r!.rank).join('/')}.`,
    `Banked: ${world.wallet.laurels} Laurels, ${world.wallet.gearMarks} Gear Marks and ${world.wallet.classMarks} Class Marks. No Manuals bought, no class switching, no tokens.`,
    `Four-hour target (180–300 min): **${result.minutes < TARGET_MINUTES * (1 - TARGET_TOLERANCE) ? 'under' : result.minutes > TARGET_MINUTES * (1 + TARGET_TOLERANCE) ? 'over' : 'met'}**. No game number retuned.`,
    `*One slot at A, facility Lv1, conditional on the worker already meeting the grade gate; partial output is unfinished. Fresh A workers finish ${farm.finished}/${wilds.finished} grade-1 raw items and end at Farm/Craft Lv${farm.profession.level}. Refining and crafting need additional time.`)
  return rows.join('\n')
}
export const report = (): string => 'Victory ledger: fixed classes; equal five-weapon shares; all currency banked; no combat or MP-spend estimate.\n\n' + markdown()
