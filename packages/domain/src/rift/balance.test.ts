// The Rift's balance simulation (rift.md §11, H51): on-curve Lv 50 parties built through the game's own rules
// (`world/balance-party.ts`) play the Rift's fights on Auto (`world/balance-play.ts`, the shared policy, engine v14).
// The full tables: `SIM=1 npx vitest run src/rift/balance.test.ts`; `SIM_FRONTS=iron,duel` and `SIM_SEEDS=4` narrow
// them while tuning. The always-on checks are small and use fixed seeds.
import { describe, expect, it } from 'vitest'
import { applyBattleAction, createBattle } from '../rpg/battle/engine'
import { BATTLE_LIMIT_MAX } from '../rpg/battle/limit'
import type { BattleAction, BattleAlly, BattleEnemy, BattleHalf, BattleState } from '../rpg/battle/types'
import { rpgBattleExp } from '../rpg/campaign/rewards'
import { RPG_NODES, type RpgNode } from '../rpg/catalog'
import { HERO_LIMIT_IDS, type HeroLimitId } from '../rpg/hero-id'
import { RPG_CLASSES, RPG_ELEMENTS, RPG_TIER_MAX_LEVEL, RPG_WEAPON_KINDS, isRpgTome, rpgAutoLoadout, rpgClassTrees, rpgDefaultWeapons, validRpgWeapons,
  type RpgClass, type RpgNodeRef, type RpgWeapon } from '../rpg/rules'
import { CLASS_EXP_SHARE, classExpToNext, grantTrack, weaponExpShares, type RankTrack } from '../economy/ranks'
import { echoFoeLevel, ECHO_RANK_PAY } from '../save/rift'
import { balanceMember, type BalanceOptions } from '../world/balance-party'
import { play, type Played } from '../world/balance-play'
import { RIFT_FRONT_SPECS, RIFT_TUNING } from './fronts'
import { riftBattleInput, riftConvergence, riftFight, riftSeed, type RiftContext, type RiftFightPlan } from './generate'
import { RIFT_RUN_FIGHTS, riftRunFaces } from './picker'
import { packRoster } from './roster.fixture'
import { CONVERGENCE_FIGHTS, ECHO_LEVELS, RIFT_FRONTS, RIFT_STAGES, riftRefKey, type EchoLevel, type RiftFront } from './state'

const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true }
const roster = packRoster()
const tierOf = new Map(roster.map((m) => [m.id, m.tier]))
/** Three runs, so a stage's weaknesses and faces vary as they do between runs. */
const RUNS = ['t1-r1', 't1-r2', 't1-r3'] as const
const ctx = (runId: string | null): RiftContext => ({ tier: 1, runId, roster, defeated: new Set() })

/** A front's guided party (D168): its five classes, on curve at Lv 50; `respec` puts one member at Class Rank 1 (a
 * fresh class, the same gear), as an Uma who has just switched. */
const guided = (front: RiftFront, respec?: number): BattleAlly[] =>
  RIFT_FRONT_SPECS[front].party.map((c, i) => balanceMember(c, i, RPG_TIER_MAX_LEVEL, i === respec ? { ...ON_CURVE, classRank: 1 } : ON_CURVE))
/** The same Uma with the game's default loadout (`rpgAutoLoadout`: each weapon's deepest open cores), as a save fights
 * before the player picks her skills. The balance party equips each weapon's deepest core and side skill instead. */
const withDefaultLoadout = (a: BattleAlly): BattleAlly => ({ ...a, loadout: rpgAutoLoadout({ outfitId: a.id, classId: a.classId, weapons: a.weapons,
  tier: a.tier, level: a.level, exp: 0, tree: [], legacy: [], classRank: a.classRank ?? a.level,
  baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 }, growthRates: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 } }) })
/** The wrong party for a front (H51): all-magic on Iron, all-physical on Arcane; the Duel and the Horde swap. */
const WRONG: Readonly<Record<RiftFront, RiftFront>> = { iron: 'arcane', arcane: 'iron', duel: 'horde', horde: 'duel' }

const seedsOf = (n: number): number[] => Array.from({ length: n }, (_, i) => riftSeed(`sim:${i}`))
const fight = (plan: RiftFightPlan, allies: BattleAlly[], seed: number): Played => play(riftBattleInput(plan, allies, seed))

interface Bucket { n: number; wins: number; rounds: number; hp: number; lowest: number; kos: number }
const empty = (): Bucket => ({ n: 0, wins: 0, rounds: 0, hp: 0, lowest: 0, kos: 0 })
const add = (b: Bucket, r: Played): void => { b.n++; b.wins += r.won ? 1 : 0; b.rounds += r.rounds; b.hp += r.hpLeft; b.lowest += r.lowest; b.kos += r.kos }
const pct = (x: number) => `${Math.round(100 * x)}%`
const rate = (b: Bucket) => (b.n ? b.wins / b.n : 0)
const cell = (b: Bucket) => b.n ? `${pct(rate(b))} ${(b.rounds / b.n).toFixed(1)}r hp ${pct(b.hp / b.n)} low ${pct(b.lowest / b.n)} ko ${(b.kos / b.n).toFixed(1)}` : '—'

const GROUPS = [[1, 4], [5, 8], [9, 11], [12, 12]] as const

/** A front's stages played by a party: a bucket per stage, over every run and seed. */
function frontStages(front: RiftFront, allies: BattleAlly[], seeds: readonly number[]): Bucket[] {
  return Array.from({ length: RIFT_STAGES }, (_, i) => {
    const b = empty()
    for (const runId of RUNS) {
      const plan = riftFight(ctx(runId), { kind: 'front', front, stage: i + 1 })
      for (const seed of seeds) add(b, fight(plan, allies, seed))
    }
    return b
  })
}
const merge = (list: readonly Bucket[]): Bucket => list.reduce((m, b) => ({ n: m.n + b.n, wins: m.wins + b.wins, rounds: m.rounds + b.rounds,
  hp: m.hp + b.hp, lowest: m.lowest + b.lowest, kos: m.kos + b.kos }), empty())

// --- The Duel guard rail (classes-v2 §3.1) ----------------------------------------------------------------------------

/** A fresh Duel boss weak to every kind (the worst case), her shield at the engine's cap so one act's points all show, and
 * HP no act can take. */
function railBoss(): BattleEnemy {
  const boss = riftFight(ctx('t1-r1'), { kind: 'front', front: 'duel', stage: 1 }).enemies[0]!
  return { ...boss, shield: 20, stats: { ...boss.stats, hp: 10_000_000 }, weaknesses: { weapons: [...RPG_WEAPON_KINDS], elements: [...RPG_ELEMENTS] } }
}
/** Her five weapons with `need` among them, kept to her class's slots. */
function weaponsWith(classId: RpgClass, base: readonly RpgWeapon[], need: readonly RpgWeapon[]): RpgWeapon[] | null {
  const out = [...base]
  for (const w of need) {
    if (out.includes(w)) continue
    const i = out.findIndex((x) => !need.includes(x) && (classId === 'cleric' || isRpgTome(x) === isRpgTome(w)))
    if (i < 0) return null
    out[i] = w
  }
  return validRpgWeapons(classId, out) ? out : null
}
/** Her on-curve self with these skills learned and equipped, and the weapons they need. */
function withSkills(base: BattleAlly, nodes: readonly RpgNode[]): BattleAlly | null {
  const weapons = weaponsWith(base.classId, base.weapons, nodes.map((n) => n.weapon))
  if (!weapons) return null
  const refs: RpgNodeRef[] = nodes.map((n) => ({ tier: 1, id: n.id }))
  return { ...base, weapons, tree: refs.filter((_, k) => nodes[k]!.variant !== null), loadout: refs, mp: base.stats.mp }
}
/** The shield points one act removes from the rail boss, or null when the engine refuses the act. `linger` presets her
 * own lingering summon (a Summoner's earlier act), `limit` a full gauge. */
function railChips(ally: BattleAlly, action: (id: string, target: string) => BattleAction, setup?: (s: BattleState) => void): number | null {
  const others = (['brawler', 'mage', 'cleric', 'summoner'] as const).map((c, i) => balanceMember(c, i + 1, 50, ON_CURVE))
  let state: BattleState
  try {
    state = createBattle({ version: 14, seed: 7, allies: [{ ...ally, id: '100' }, ...others], enemies: [railBoss()] }).state
  } catch { return null }
  setup?.(state)
  const before = state.units.find((u) => u.side === 'enemy')!.shield
  const step = applyBattleAction(state, action('100', state.units.find((u) => u.side === 'enemy')!.id))
  if (step.error) return null
  return before - step.state.units.find((u) => u.side === 'enemy')!.shield
}

interface RailAct { chips: number; act: string }
interface Rail { classId: RpgClass; own: RailAct; limit: RailAct }
const best = (list: readonly RailAct[]): RailAct => list.reduce((a, b) => (b.chips > a.chips ? b : a), { chips: 0, act: '—' })

/**
 * Every class's best single act against the rail boss (H51): every Attack and every skill of her class's trees (any
 * depth, either side, each with the weapons it needs; a Spell Blade's two halves, an Arms half and a Tome half, each
 * measured beside a one-hit Attack and the best of each added), a Summoner's summon with her own best summon lingering,
 * and every Limit Break she could carry with a full gauge: any of the twenty, since any Uma may learn under any Hero
 * (D106), at full strength. No buffs from others.
 */
function guardRail(classId: RpgClass): Rail {
  const base = balanceMember(classId, 0, 50, ON_CURVE)
  const nodes = RPG_NODES.filter((n) => rpgClassTrees(classId).includes(n.tree))
  const pair = classId === 'spellblade'
  const acts: (RailAct & { tome: boolean })[] = []
  // A Spell Blade's half is measured beside the other half's one-hit Attack (one point on the rail boss), taken off.
  const partner = (ally: BattleAlly, tome: boolean): BattleHalf | undefined => pair ? { weapon: ally.weapons.find((w) => isRpgTome(w) !== tome)! } : undefined
  const less = pair ? 1 : 0
  for (const weapon of [...new Set([...base.weapons, ...nodes.map((n) => n.weapon)])]) {
    const ally = withSkills(base, [])
    const armed = ally && weaponsWith(classId, ally.weapons, [weapon])
    if (!ally || !armed) continue
    const a = { ...ally, weapons: armed }
    const chips = railChips(a, (id, target) => ({ kind: 'attack', actorId: id, targetId: target, weapon, ...(pair ? { pair: partner(a, isRpgTome(weapon))! } : {}) }))
    if (chips !== null) acts.push({ chips: chips - less, act: `Attack (${weapon})`, tome: isRpgTome(weapon) })
  }
  for (const node of nodes) {
    const ally = withSkills(base, [node])
    if (!ally) continue
    const skill = { tier: 1, id: node.id }
    const chips = railChips(ally, (id, target) => ({ kind: 'skill', actorId: id, targetId: target, skill, ...(pair ? { pair: partner(ally, isRpgTome(node.weapon))! } : {}) }))
    if (chips !== null) acts.push({ chips: chips - less, act: node.name, tome: isRpgTome(node.weapon) })
  }
  let own: RailAct
  if (pair) {
    const arms = best(acts.filter((a) => !a.tome)), tome = best(acts.filter((a) => a.tome))
    own = { chips: arms.chips + tome.chips, act: `${arms.act} + ${tome.act}` }
  } else own = best(acts)
  if (classId === 'summoner') {
    // Her own earlier summon lingers and strikes again first: the best lingering one, beside each summon she casts.
    const summons = nodes.filter((n) => n.skill.summon)
    const lingerOf = (l: RpgNode) => (s: BattleState) => { s.summons = [{ allyId: '100', ref: { tier: 1, id: l.id }, scale: l.skill.summon!.linger }] }
    const probe = summons[0]!
    const plain = railChips(withSkills(base, [probe])!, (id, target) => ({ kind: 'skill', actorId: id, targetId: target, skill: { tier: 1, id: probe.id } }))!
    const linger = summons.reduce((m, l) => {
      const c = railChips(withSkills(base, [probe])!, (id, target) => ({ kind: 'skill', actorId: id, targetId: target, skill: { tier: 1, id: probe.id } }), lingerOf(l))! - plain
      return c > m.chips ? { chips: c, node: l } : m
    }, { chips: -1, node: probe })
    for (const n of summons) {
      const chips = railChips(withSkills(base, [n])!, (id, target) => ({ kind: 'skill', actorId: id, targetId: target, skill: { tier: 1, id: n.id } }), lingerOf(linger.node))
      if (chips !== null && chips > own.chips) own = { chips, act: `${n.name} (${linger.node.name} lingering)` }
    }
  }
  const limits: RailAct[] = HERO_LIMIT_IDS.map((hero: HeroLimitId) => {
    const ally: BattleAlly = { ...base, hero, inherits: undefined }
    const { inherits: _, ...plain } = ally
    const chips = railChips(plain, (id, target) => ({ kind: 'limit', actorId: id, targetId: target }), (s) => { s.units.find((u) => u.id === '100')!.limit = BATTLE_LIMIT_MAX })
    return { chips: chips ?? 0, act: `Limit Break ${hero}` }
  })
  return { classId, own, limit: best(limits) }
}
const duelShields = (): number[] => [...RIFT_TUNING.duel.shields]

// --- Echo pacing (rift.md §8, R6) ---------------------------------------------------------------------------------------

/** Class EXP an Echo win pays a Lv 50 Uma (D174): `ECHO_RANK_PAY` × a stage's `CLASS_EXP_SHARE` × E. */
const echoClassExp = (level: EchoLevel): number => ECHO_RANK_PAY * CLASS_EXP_SHARE * rpgBattleExp('fight', echoFoeLevel(1, level), RPG_TIER_MAX_LEVEL)
/** Echo wins that raise a fresh class from Rank 1 to `rank`. */
function echoWinsTo(rank: number, level: EchoLevel): number {
  let track: RankTrack = { rank: 1, exp: 0 }
  let wins = 0
  while (track.rank < rank) { track = grantTrack(track, 'class', echoClassExp(level)).track; wins++ }
  return wins
}
/** Echo wins that raise her first weapon from Rank 1 to `rank` when she uses `used` of her five a fight (0: a Sweep,
 * whose five share evenly). */
function echoWeaponWinsTo(rank: number, level: EchoLevel, used: number): number {
  const weapons = rpgDefaultWeapons('brawler')
  const exp = ECHO_RANK_PAY * weaponExpShares(weapons, new Set(weapons.slice(0, used)), rpgBattleExp('fight', echoFoeLevel(1, level), RPG_TIER_MAX_LEVEL))[weapons[0]!]!
  let track: RankTrack = { rank: 1, exp: 0 }
  let wins = 0
  while (track.rank < rank) { track = grantTrack(track, 'weapon', exp).track; wins++ }
  return wins
}

// --- The Bestiary (rift.md §9) ------------------------------------------------------------------------------------------

/** Runs until every boss and every sub-boss of the pack-sized roster has been defeated, each run winning every fight
 * once and preferring the faces defeated before it started. */
function bestiaryRuns(): { boss: number; subboss: number; slots: { boss: number; subboss: number } } {
  const all = { boss: roster.filter((m) => m.tier === 'boss').length, subboss: roster.filter((m) => m.tier === 'subboss').length }
  const defeated = new Set<string>()
  const done: { boss: number; subboss: number } = { boss: 0, subboss: 0 }
  let slots = { boss: 0, subboss: 0 }
  for (let run = 1; run <= 10 && (!done.boss || !done.subboss); run++) {
    const faces = riftRunFaces(roster, 1, `t1-r${run}`, new Set(defeated))
    const ids = RIFT_RUN_FIGHTS.flatMap((ref) => [...faces.get(riftRefKey(ref))!])
    if (run === 1) slots = { boss: ids.filter((id) => tierOf.get(id) === 'boss').length, subboss: ids.filter((id) => tierOf.get(id) === 'subboss').length }
    for (const id of ids) if (tierOf.get(id) === 'boss' || tierOf.get(id) === 'subboss') defeated.add(id)
    for (const tier of ['boss', 'subboss'] as const) {
      if (!done[tier] && [...defeated].filter((id) => tierOf.get(id) === tier).length === all[tier]) done[tier] = run
    }
  }
  return { ...done, slots }
}

// --- The checks ---------------------------------------------------------------------------------------------------------

describe('the Rift\'s balance (H51)', () => {
  it('lets Iron\'s guided party win Iron\'s stage 1', () => {
    const plan = riftFight(ctx('t1-r1'), { kind: 'front', front: 'iron', stage: 1 })
    expect(fight(plan, guided('iron'), riftSeed('rift:t1:1')).won).toBe(true)
  })

  it('has Arcane\'s guided party (all magic) lose Iron\'s champion', () => {
    const plan = riftFight(ctx('t1-r1'), { kind: 'front', front: 'iron', stage: 12 })
    expect(fight(plan, guided('arcane'), riftSeed('rift:t1:1')).won).toBe(false)
  })

  it('keeps every class\'s best single act below the Duel\'s lowest shield (the guard rail)', () => {
    const lowest = Math.min(...duelShields())
    for (const classId of RPG_CLASSES) {
      const rail = guardRail(classId)
      expect(rail.own.chips, `${classId}: ${rail.own.act}`).toBeLessThan(lowest)
      expect(rail.limit.chips, `${classId}: ${rail.limit.act}`).toBeLessThan(lowest)
    }
  }, 20_000)

  it('raises a fresh class to Rank 30 in the documented number of Echo wins', () => {
    let need = 0
    for (let r = 1; r < 30; r++) need += classExpToNext(r)
    expect(need).toBe(10_440)
    expect([echoWinsTo(30, '45'), echoWinsTo(30, '50'), echoWinsTo(30, '55')]).toEqual([17, 9, 9])
  })

  it.skipIf(!process.env.SIM)('prints the Rift\'s tables: fronts, the Convergence, the guard rail, Echoes, the Bestiary and a run', async () => {
    // Yields between long loops, so Vitest's worker keeps answering its runner.
    const tick = () => new Promise((resolve) => setTimeout(resolve, 0))
    const fronts = (process.env.SIM_FRONTS?.split(',') ?? RIFT_FRONTS) as RiftFront[]
    const seeds = seedsOf(Number(process.env.SIM_SEEDS ?? 8))
    const rows: string[] = [`${RUNS.length} runs × ${seeds.length} seeds a stage; on-curve Lv 50, first try on Auto`, '',
      'front | party | stages 1–4 | 5–8 | 9–11 | champion']
    const firstTry: Partial<Record<RiftFront, number[]>> = {}
    for (const front of fronts) {
      for (const [label, party] of [['right', front], ['wrong', WRONG[front]]] as const) {
        const stages = frontStages(front, guided(party), seeds)
        await tick()
        if (label === 'right') firstTry[front] = stages.map(rate)
        rows.push(`${front} | ${label} (${party}'s) | ${GROUPS.map(([a, z]) => cell(merge(stages.slice(a - 1, z)))).join(' | ')}`)
      }
    }
    // The same guided parties with the game's default loadout, for the record: what a save fights with before she picks.
    for (const front of fronts) {
      const stages = frontStages(front, guided(front).map(withDefaultLoadout), seeds)
      await tick()
      rows.push(`${front} | right, default loadout | ${GROUPS.map(([a, z]) => cell(merge(stages.slice(a - 1, z)))).join(' | ')}`)
    }
    // The Convergence: the four guided parties, an attempt won when all four fights are; then with default loadouts.
    const convergence = (loadout: (a: BattleAlly) => BattleAlly) => {
      const conv = Array.from({ length: CONVERGENCE_FIGHTS }, empty)
      let attempts = 0, won = 0
      for (const runId of RUNS) {
        const plans = riftConvergence(ctx(runId))
        for (const seed of seeds) {
          attempts++
          const results = plans.map((plan, i) => fight(plan, guided(RIFT_FRONTS[i]!).map(loadout), riftSeed(`${seed}:${i}`)))
          results.forEach((r, i) => add(conv[i]!, r))
          if (results.every((r) => r.won)) won++
        }
      }
      return { conv, attempts, won }
    }
    const { conv, attempts, won } = convergence((a) => a)
    const product = conv.reduce((p, b) => p * rate(b), 1)
    const byDefault = convergence(withDefaultLoadout)
    rows.push('', 'Convergence | Iron | Arcane | Duel | Horde | attempt', `fights | ${conv.map(cell).join(' | ')} | ${pct(won / attempts)} (${won}/${attempts}; product ${pct(product)})`,
      `default loadouts | ${byDefault.conv.map(cell).join(' | ')} | ${pct(byDefault.won / byDefault.attempts)} (${byDefault.won}/${byDefault.attempts})`)
    // The guard rail.
    rows.push('', `class | best own act | best Limit Break | Duel shields ${duelShields().join(', ')}`)
    for (const classId of RPG_CLASSES) {
      const rail = guardRail(classId)
      rows.push(`${classId} | ${rail.own.chips}: ${rail.own.act} | ${rail.limit.chips}: ${rail.limit.act}`)
    }
    // Echo pacing: the pay rule, then the win rates.
    rows.push('', 'Echo | Class EXP a win | wins to Rank 30 | to Rank 40 | to Rank 50 | Weapon Rank 8: one used, two used, swept')
    for (const level of ECHO_LEVELS) {
      rows.push(`Lv ${level} | ${echoClassExp(level)} | ${echoWinsTo(30, level)} | ${echoWinsTo(40, level)} | ${echoWinsTo(50, level)} | ` +
        `${echoWeaponWinsTo(8, level, 1)}, ${echoWeaponWinsTo(8, level, 2)}, ${echoWeaponWinsTo(8, level, 0)}`)
    }
    rows.push('', 'Echo | party | Lv 45 | Lv 50 | Lv 55')
    for (const front of fronts) {
      for (const [label, respec] of [['on curve', undefined], ['one re-specced', 0]] as const) {
        await tick()
        const allies = guided(front, respec)
        const cells = ECHO_LEVELS.map((level) => {
          const b = empty()
          const plan = riftFight(ctx(null), { kind: 'echo', front, level })
          for (const seed of seeds) for (const salt of RUNS) add(b, fight(plan, allies, riftSeed(`${salt}:${seed}`)))
          return cell(b)
        })
        rows.push(`${front} | ${label} | ${cells.join(' | ')}`)
      }
    }
    // The Bestiary.
    const bestiary = bestiaryRuns()
    rows.push('', `Bestiary: ${bestiary.slots.boss} boss and ${bestiary.slots.subboss} sub-boss slots a run; every sub-boss after ${bestiary.subboss} runs, every boss after ${bestiary.boss}`)
    // A run's length: expected fights with retries, from the first-try rates (a front stage 1 ÷ p; the Convergence's
    // attempts 1 ÷ P, each playing its fights until the first loss).
    if (fronts.length === RIFT_FRONTS.length) {
      const frontFights = RIFT_FRONTS.reduce((n, f) => n + firstTry[f]!.reduce((m, p) => m + 1 / Math.max(p, 0.01), 0), 0)
      const p = conv.map(rate)
      const perAttempt = 1 + p[0]! + p[0]! * p[1]! + p[0]! * p[1]! * p[2]!
      const attemptRate = Math.max(won / attempts, 0.01)
      const convFights = perAttempt / attemptRate
      rows.push(`A run: about ${Math.round(frontFights)} front fights for 48 stages and ${Math.round(convFights)} Convergence fights (${(1 / attemptRate).toFixed(1)} attempts): ${Math.round(frontFights + convFights)} in all`)
    }
    console.log(rows.join('\n'))
  }, 1_800_000)
})
