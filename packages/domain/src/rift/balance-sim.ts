// The Rift's balance simulation's support (rift.md §11, H51; classes v2 §9, H60): the guided parties, the fights, the
// buckets and the Duel's guard rail, by engine, shared by `rift/balance.test.ts` (H51's tables, `SIM_ENGINE` picks the
// generation), `rift/balance-v15.test.ts` (classes v2's targets), `rift/balance-v16.test.ts` (R1's, H71) and
// `rift/balance-v19.test.ts` (Classes v3's, H131: `guardRailV19`). Test support only: nothing in the game imports it.
import { BATTLE_ENGINE_VERSION, rpgRework, rpgV2 } from '../rpg/battle/caps'
import { applyBattleAction, createBattle } from '../rpg/battle/engine'
import { BATTLE_LIMIT_MAX } from '../rpg/battle/limit'
import type { BattleAction, BattleAlly, BattleCue, BattleEnemy, BattleHalf, BattleInput, BattleState } from '../rpg/battle/types'
import { RPG_ALL_NODES, RPG_NODES, rpgNodeSkill, type RpgNode } from '../rpg/catalog'
import { heroLimitIds, type HeroLimitId } from '../rpg/hero-id'
import { isRpgElement } from '../rpg/kinds'
import { rpgNodeLine, type RpgLines } from '../rpg/node-identity'
import { RPG_ELEMENTS, RPG_TIER0_MAX_RANK, RPG_TIER_MAX_LEVEL, RPG_WEAPON_KINDS, isRpgTome, rpgAutoLoadout, rpgClassSlots, rpgClassTrees, rpgHand,
  rpgIsTier0, validRpgWeapons, type RpgClass, type RpgNodeRef, type RpgWeapon } from '../rpg/rules'
import { balanceMember, type BalanceOptions } from '../world/balance-party'
import { play, type Played, type PlayObserver } from '../world/balance-play'
import { riftGuidedBuild, riftParty, riftTuning } from './fronts'
import { riftBattleInput, riftFight, riftSeed, type RiftContext, type RiftFightPlan } from './generate'
import { packRoster } from './roster.fixture'
import { RIFT_STAGES, type RiftFront } from './state'

export const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true }
export const roster = packRoster()
/** Three runs, so a stage's weaknesses and faces vary as they do between runs. */
export const RUNS = ['t1-r1', 't1-r2', 't1-r3'] as const
export const ctx = (runId: string | null): RiftContext => ({ tier: 1, runId, roster, defeated: new Set() })

/** A front's guided party (D168; v2 D178): its five classes in the engine's generation (`riftParty`), on curve at Lv 50;
 * from v16 (H71) its guided build (`riftGuidedBuild`, CP7): each member on her own three weapons. `respec` puts one member
 * at a fresh class's Class Rank (the same gear), as an Uma who has just switched: Rank 1, and from v19 Rank 10, where a Tier 1
 * class opens (CV8; H131's S9); `options` adds to each member's (H60: a support accessory). */
export const guided = (front: RiftFront, engine: number = BATTLE_ENGINE_VERSION, respec?: number, options: BalanceOptions = {}): BattleAlly[] =>
  (rpgRework('fight', engine)
    ? riftGuidedBuild(front, engine).map((m, i) => balanceMember(m.classId, i, RPG_TIER_MAX_LEVEL,
      { ...ON_CURVE, engine, weapons: m.weapons, ...options, ...(i === respec ? { classRank: freshRank(engine) } : {}) }))
    : partyOf(riftParty(front, engine), engine, respec, options))
/** A fresh class's Class Rank in an engine's generation: 1, and from v19 a Tier 1 class's 10 (CV8). */
const freshRank = (engine: number): number => (rpgRework('classes', engine) ? RPG_TIER0_MAX_RANK : 1)
/** Five classes on curve at Lv 50 in an engine's generation. */
export const partyOf = (classes: readonly RpgClass[], engine: number = BATTLE_ENGINE_VERSION, respec?: number, options: BalanceOptions = {}): BattleAlly[] =>
  classes.map((c, i) => balanceMember(c, i, RPG_TIER_MAX_LEVEL, { ...ON_CURVE, engine, ...options, ...(i === respec ? { classRank: freshRank(engine) } : {}) }))
/** The same Uma with the game's default loadout (`rpgAutoLoadout`: each weapon's deepest open cores), as a save fights
 * before the player picks her skills, in an engine's generation (from v16 her held skills on her `lines`, H71). The
 * balance party equips each weapon's deepest core and side skill instead (from v16 her deepest held ones). */
export const defaultLoadoutAt = (engine: number) => (a: BattleAlly): BattleAlly => ({ ...a, loadout: rpgAutoLoadout({ outfitId: a.id, classId: a.classId,
  weapons: a.weapons, tier: a.tier, level: a.level, exp: 0, tree: [], legacy: [], classRank: a.classRank ?? a.level, ...(a.lines ? { lines: a.lines } : {}),
  baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 }, growthRates: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 } }, engine) })
/** The wrong party for a front (H51): all-magic on Iron, all-physical on Arcane; the Duel and the Horde swap. */
export const WRONG: Readonly<Record<RiftFront, RiftFront>> = { iron: 'arcane', arcane: 'iron', duel: 'horde', horde: 'duel' }

export const seedsOf = (n: number): number[] => Array.from({ length: n }, (_, i) => riftSeed(`sim:${i}`))
/** A Rift fight's plan in an engine's tuning. */
export const planOf = (runId: string | null, ref: Parameters<typeof riftFight>[1], engine: number = BATTLE_ENGINE_VERSION): RiftFightPlan =>
  riftFight(ctx(runId), ref, engine)
export const fight = (plan: RiftFightPlan, allies: BattleAlly[], seed: number, engine: number = BATTLE_ENGINE_VERSION, observe?: PlayObserver): Played =>
  play(riftBattleInput(plan, allies, seed, engine as BattleInput['version']), observe)

export interface Bucket { n: number; wins: number; rounds: number; hp: number; lowest: number; kos: number }
export const empty = (): Bucket => ({ n: 0, wins: 0, rounds: 0, hp: 0, lowest: 0, kos: 0 })
export const add = (b: Bucket, r: Played): void => { b.n++; b.wins += r.won ? 1 : 0; b.rounds += r.rounds; b.hp += r.hpLeft; b.lowest += r.lowest; b.kos += r.kos }
export const pct = (x: number) => `${Math.round(100 * x)}%`
export const rate = (b: Bucket) => (b.n ? b.wins / b.n : 0)
export const cell = (b: Bucket) => b.n ? `${pct(rate(b))} ${(b.rounds / b.n).toFixed(1)}r hp ${pct(b.hp / b.n)} low ${pct(b.lowest / b.n)} ko ${(b.kos / b.n).toFixed(1)}` : '—'

export const GROUPS = [[1, 4], [5, 8], [9, 11], [12, 12]] as const

/** A front's stages played by a party: a bucket per stage, over every run and seed. */
export function frontStages(front: RiftFront, allies: BattleAlly[], seeds: readonly number[], engine: number = BATTLE_ENGINE_VERSION,
  observe?: PlayObserver): Bucket[] {
  return Array.from({ length: RIFT_STAGES }, (_, i) => {
    const b = empty()
    for (const runId of RUNS) {
      const plan = planOf(runId, { kind: 'front', front, stage: i + 1 }, engine)
      for (const seed of seeds) add(b, fight(plan, allies, seed, engine, observe))
    }
    return b
  })
}
export const merge = (list: readonly Bucket[]): Bucket => list.reduce((m, b) => ({ n: m.n + b.n, wins: m.wins + b.wins, rounds: m.rounds + b.rounds,
  hp: m.hp + b.hp, lowest: m.lowest + b.lowest, kos: m.kos + b.kos }), empty())

// --- The Duel guard rail (classes-v2 §3.1) ----------------------------------------------------------------------------

/** A fresh Duel boss weak to every kind (the worst case), her shield at the engine's cap so one act's points all show, and
 * HP no act can take. */
function railBoss(engine: number): BattleEnemy {
  const boss = planOf('t1-r1', { kind: 'front', front: 'duel', stage: 1 }, engine).enemies[0]!
  return { ...boss, shield: 20, stats: { ...boss.stats, hp: 10_000_000 }, weaknesses: { weapons: [...RPG_WEAPON_KINDS], elements: [...RPG_ELEMENTS] } }
}
/** Her five weapons with `need` among them, kept to her class's slots. */
function weaponsWith(classId: RpgClass, base: readonly RpgWeapon[], need: readonly RpgWeapon[], engine: number): RpgWeapon[] | null {
  const any = rpgClassSlots(classId, engine).includes('any')
  const out = [...base]
  for (const w of need) {
    if (out.includes(w)) continue
    const i = out.findIndex((x) => !need.includes(x) && (any || isRpgTome(x) === isRpgTome(w)))
    if (i < 0) return null
    out[i] = w
  }
  return validRpgWeapons(classId, out, engine) ? out : null
}
/** Her on-curve self with these skills learned and equipped, and the weapons they need. */
function withSkills(base: BattleAlly, nodes: readonly RpgNode[], engine: number): BattleAlly | null {
  const weapons = weaponsWith(base.classId, base.weapons, nodes.map((n) => n.weapon), engine)
  if (!weapons) return null
  const refs: RpgNodeRef[] = nodes.map((n) => ({ tier: 1, id: n.id }))
  return { ...base, weapons, tree: refs.filter((_, k) => nodes[k]!.variant !== null), loadout: refs, mp: base.stats.mp }
}
/** The four others of a rail fight: no healer from v15, so a healer's own rail fight has one. */
const railOthers = (engine: number): BattleAlly[] =>
  (rpgV2(engine) ? ['brawler', 'mage', 'spellblade', 'summoner'] as const : ['brawler', 'mage', 'cleric', 'summoner'] as const)
    .map((c, i) => balanceMember(c, i + 1, 50, { ...ON_CURVE, engine }))
interface RailFight { chips: number; arms: number; tome: number; hits: number }
/** The shield points one act removes from the rail boss, or null when the engine refuses the act; from v15 also split by
 * the kind of the hit each point followed (an Arms kind or an element). `linger` presets her own lingering summon (a
 * Summoner's earlier act), `limit` a full gauge. */
function railFight(ally: BattleAlly, action: (id: string, target: string) => BattleAction, engine: number, others: BattleAlly[],
  setup?: (s: BattleState) => void): RailFight | null {
  let state: BattleState
  try {
    state = createBattle({ version: engine as BattleInput['version'], seed: 7, allies: [{ ...ally, id: '100' }, ...others], enemies: [railBoss(engine)] }).state
  } catch { return null }
  setup?.(state)
  const foe = state.units.find((u) => u.side === 'enemy')!
  const before = foe.shield
  const step = applyBattleAction(state, action('100', foe.id))
  if (step.error) return null
  let arms = 0, tome = 0, hits = 0, shield = before, last: BattleCue | null = null
  for (const c of step.cues) {
    if (c.kind === 'hit' && c.actorId === '100') last = c
    if (c.kind === 'hit' && c.actorId === '100' && c.targetId === foe.id && c.channel !== 'status') hits++
    if (c.kind === 'shield' && c.targetId === foe.id && c.amount !== undefined) {
      const points = shield - c.amount
      shield = c.amount
      if (last?.kind === 'hit' && last.element && isRpgElement(last.element)) tome += points
      else arms += points
    }
  }
  return { chips: before - step.state.units.find((u) => u.side === 'enemy')!.shield, arms, tome, hits }
}

export interface RailAct { chips: number; act: string }
/** From v19 (H131) also the Limit Break that lands the most hits on the rail boss (HV15's ceiling, `HERO_LIMIT_MAX_HITS`). */
export interface Rail { classId: RpgClass; own: RailAct; limit: RailAct; hits?: { hits: number; act: string } }
const best = (list: readonly RailAct[]): RailAct => list.reduce((a, b) => (b.chips > a.chips ? b : a), { chips: 0, act: '—' })

/**
 * Every class's best single act against the rail boss (H51; H60 for v15): every Attack and every skill of her class's
 * trees (any depth, either side, each with the weapons it needs; a pair class's two halves, an Arms half and a Tome half,
 * each measured beside a one-hit Attack of the other kind and the best of each added), a Summoner's summon with her own
 * best summon lingering, and every Limit Break she could carry with a full gauge: any of her generation's seats (20 to
 * v14, 24 v15–v18, Halls v2's 20 from v19: `heroLimitIds(engine)`, H129), since any Uma may learn under any Hero (D106),
 * at full strength. No buffs from others.
 */
export function guardRail(classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): Rail {
  if (rpgRework('classes', engine)) return guardRailV19(classId, engine)
  return rpgRework('fight', engine) ? guardRailV16(classId, engine) : rpgV2(engine) ? guardRailV2(classId, engine) : guardRailV1(classId)
}

/** H51's rail, engine v14, as it printed. */
function guardRailV1(classId: RpgClass): Rail {
  const engine = 14
  const others = railOthers(engine)
  const railChips = (ally: BattleAlly, action: (id: string, target: string) => BattleAction, setup?: (s: BattleState) => void): number | null =>
    railFight(ally, action, engine, others, setup)?.chips ?? null
  const base = balanceMember(classId, 0, 50, ON_CURVE)
  const nodes = RPG_NODES.filter((n) => rpgClassTrees(classId).includes(n.tree))
  const pair = classId === 'spellblade'
  const acts: (RailAct & { tome: boolean })[] = []
  // A Spell Blade's half is measured beside the other half's one-hit Attack (one point on the rail boss), taken off.
  const partner = (ally: BattleAlly, tome: boolean): BattleHalf | undefined => pair ? { weapon: ally.weapons.find((w) => isRpgTome(w) !== tome)! } : undefined
  const less = pair ? 1 : 0
  for (const weapon of [...new Set([...base.weapons, ...nodes.map((n) => n.weapon)])]) {
    const ally = withSkills(base, [], engine)
    const armed = ally && weaponsWith(classId, ally.weapons, [weapon], engine)
    if (!ally || !armed) continue
    const a = { ...ally, weapons: armed }
    const chips = railChips(a, (id, target) => ({ kind: 'attack', actorId: id, targetId: target, weapon, ...(pair ? { pair: partner(a, isRpgTome(weapon))! } : {}) }))
    if (chips !== null) acts.push({ chips: chips - less, act: `Attack (${weapon})`, tome: isRpgTome(weapon) })
  }
  for (const node of nodes) {
    const ally = withSkills(base, [node], engine)
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
    const plain = railChips(withSkills(base, [probe], engine)!, (id, target) => ({ kind: 'skill', actorId: id, targetId: target, skill: { tier: 1, id: probe.id } }))!
    const linger = summons.reduce((m, l) => {
      const c = railChips(withSkills(base, [probe], engine)!, (id, target) => ({ kind: 'skill', actorId: id, targetId: target, skill: { tier: 1, id: probe.id } }), lingerOf(l))! - plain
      return c > m.chips ? { chips: c, node: l } : m
    }, { chips: -1, node: probe })
    for (const n of summons) {
      const chips = railChips(withSkills(base, [n], engine)!, (id, target) => ({ kind: 'skill', actorId: id, targetId: target, skill: { tier: 1, id: n.id } }), lingerOf(linger.node))
      if (chips !== null && chips > own.chips) own = { chips, act: `${n.name} (${linger.node.name} lingering)` }
    }
  }
  return { classId, own, limit: limitRail(base, heroLimitIds(engine), railChips) }
}

/** Every Limit Break of the halls, fired by her as its Hero with a full gauge. */
function limitRail(base: BattleAlly, ids: readonly HeroLimitId[],
  railChips: (ally: BattleAlly, action: (id: string, target: string) => BattleAction, setup?: (s: BattleState) => void) => number | null): RailAct {
  return best(ids.map((hero) => {
    const ally: BattleAlly = { ...base, hero, inherits: undefined }
    const { inherits: _, ...plain } = ally
    const chips = railChips(plain, (id, target) => ({ kind: 'limit', actorId: id, targetId: target }), (s) => { s.units.find((u) => u.id === '100')!.limit = BATTLE_LIMIT_MAX })
    return { chips: chips ?? 0, act: `Limit Break ${hero}` }
  }))
}

/**
 * Classes v2's rail (H60): a pair class (the Spell Blade, and from v15 the Summoner) acts in an Arms half and a Tome half,
 * so each candidate half (an Attack with each weapon, each skill) is played beside a one-hit Attack of the other kind and
 * credited with the points that followed its own kind's hits; her best act is her best Arms half plus her best Tome half
 * (the Spell Blade's Arms half with its extra hit). A Summoner's adds her best lingering summon's farewell, played before
 * the pair. One-half classes as v14's rail.
 */
function guardRailV2(classId: RpgClass, engine: number): Rail {
  const others = railOthers(engine)
  const base = balanceMember(classId, 0, 50, { ...ON_CURVE, engine })
  const nodes = RPG_ALL_NODES.filter((n) => rpgClassTrees(classId).includes(n.tree))
  const pair = rpgHand({ classId }, engine).pair
  const acts: (RailAct & { tome: boolean })[] = []
  const partner = (ally: BattleAlly, tome: boolean): BattleHalf => ({ weapon: ally.weapons.find((w) => isRpgTome(w) !== tome)! })
  const credit = (r: RailFight | null, tome: boolean): number | null => (r === null ? null : pair ? (tome ? r.tome : r.arms) : r.chips)
  for (const weapon of [...new Set([...base.weapons, ...nodes.map((n) => n.weapon)])]) {
    const ally = withSkills(base, [], engine)
    const armed = ally && weaponsWith(classId, ally.weapons, [weapon], engine)
    if (!ally || !armed) continue
    const a = { ...ally, weapons: armed }
    const tome = isRpgTome(weapon)
    const chips = credit(railFight(a, (id, target) => ({ kind: 'attack', actorId: id, targetId: target, weapon, ...(pair ? { pair: partner(a, tome) } : {}) }), engine, others), tome)
    if (chips !== null) acts.push({ chips, act: `Attack (${weapon})`, tome })
  }
  for (const node of nodes) {
    const ally = withSkills(base, [node], engine)
    if (!ally) continue
    const tome = isRpgTome(node.weapon)
    const skill = { tier: 1, id: node.id }
    const chips = credit(railFight(ally, (id, target) => ({ kind: 'skill', actorId: id, targetId: target, skill, ...(pair ? { pair: partner(ally, tome) } : {}) }), engine, others), tome)
    if (chips !== null) acts.push({ chips, act: node.name, tome })
  }
  let own: RailAct
  if (pair) {
    const arms = best(acts.filter((a) => !a.tome)), tome = best(acts.filter((a) => a.tome))
    own = { chips: arms.chips + tome.chips, act: `${arms.act} + ${tome.act}` }
  } else own = best(acts)
  if (classId === 'summoner') {
    // Her own earlier Tome summon says farewell first (only a Tome half lingers): the best farewell, before her best pair.
    const lingerers = nodes.filter((n) => n.skill.summon && isRpgTome(n.weapon))
    const probe = withSkills(base, [], engine)!
    const act = (id: string, target: string): BattleAction => ({ kind: 'attack', actorId: id, targetId: target, weapon: probe.weapons.find(isRpgTome)!,
      pair: partner(probe, true) })
    const plain = railFight(probe, act, engine, others)!.chips
    const farewell = lingerers.reduce((m, l) => {
      const r = railFight(probe, act, engine, others, (s) => { s.summons = [{ allyId: '100', ref: { tier: 1, id: l.id }, scale: l.skill.summon!.linger }] })
      const c = (r?.chips ?? plain) - plain
      return c > m.chips ? { chips: c, act: l.name } : m
    }, { chips: 0, act: '—' })
    own = { chips: own.chips + farewell.chips, act: `${own.act} (${farewell.act} lingering)` }
  }
  const railChips = (ally: BattleAlly, action: (id: string, target: string) => BattleAction, setup?: (s: BattleState) => void): number | null =>
    railFight(ally, action, engine, others, setup)?.chips ?? null
  return { classId, own, limit: limitRail(base, heroLimitIds(engine), railChips) }
}
/** Her on-curve self (v16) holding these skills on their lines and equipped, with the weapons they need: no side skills,
 * a B node's tree on B, the trunk and A on A. Null when her class's three slots can't hold them. */
function withHeld(base: BattleAlly, nodes: readonly RpgNode[], engine: number): BattleAlly | null {
  const weapons = weaponsWith(base.classId, base.weapons, nodes.map((n) => n.weapon), engine)
  if (!weapons) return null
  const lines: RpgLines = {}
  for (const n of nodes) if (rpgNodeLine(n.id) === 'B') lines[n.weapon] = 'B'
  const { lines: _, ...rest } = base
  return { ...rest, weapons, tree: [], ...(Object.keys(lines).length ? { lines } : {}), loadout: nodes.map((n) => ({ tier: 1, id: n.id })), mp: base.stats.mp }
}

/**
 * The Tier rework's rail (v16, H71): classes v2's, with her skills at Class Rank 50 (every Skill Rank 5, ×1.05) and
 * every node she can hold on either line of every tree her class can slot (the trunk, A and B: the Spell Blade's Pierce,
 * the Brawler's Combo, the Summoner's Pack and Bonded), each tree in a slot of its channel (three slots, by position).
 * Limit Breaks never rank (CP28): the 24 at full strength, as v15's.
 */
function guardRailV16(classId: RpgClass, engine: number): Rail {
  const others = railOthers(engine)
  const base = balanceMember(classId, 0, 50, { ...ON_CURVE, engine, classRank: 50 })
  const nodes = RPG_ALL_NODES.filter((n) => rpgClassTrees(classId).includes(n.tree) && rpgNodeLine(n.id) !== null)
  const pair = rpgHand({ classId }, engine).pair
  const acts: (RailAct & { tome: boolean })[] = []
  const partner = (ally: BattleAlly, tome: boolean): BattleHalf => ({ weapon: ally.weapons.find((w) => isRpgTome(w) !== tome)! })
  const credit = (r: RailFight | null, tome: boolean): number | null => (r === null ? null : pair ? (tome ? r.tome : r.arms) : r.chips)
  for (const weapon of [...new Set([...base.weapons, ...nodes.map((n) => n.weapon)])]) {
    const ally = withHeld(base, [], engine)
    const armed = ally && weaponsWith(classId, ally.weapons, [weapon], engine)
    if (!ally || !armed) continue
    const a = { ...ally, weapons: armed }
    const tome = isRpgTome(weapon)
    const chips = credit(railFight(a, (id, target) => ({ kind: 'attack', actorId: id, targetId: target, weapon, ...(pair ? { pair: partner(a, tome) } : {}) }), engine, others), tome)
    if (chips !== null) acts.push({ chips, act: `Attack (${weapon})`, tome })
  }
  for (const node of nodes) {
    const ally = withHeld(base, [node], engine)
    if (!ally) continue
    const tome = isRpgTome(node.weapon)
    const skill = { tier: 1, id: node.id }
    const chips = credit(railFight(ally, (id, target) => ({ kind: 'skill', actorId: id, targetId: target, skill, ...(pair ? { pair: partner(ally, tome) } : {}) }), engine, others), tome)
    if (chips !== null) acts.push({ chips, act: node.name, tome })
  }
  let own: RailAct
  if (pair) {
    const arms = best(acts.filter((a) => !a.tome)), tome = best(acts.filter((a) => a.tome))
    own = { chips: arms.chips + tome.chips, act: `${arms.act} + ${tome.act}` }
  } else own = best(acts)
  if (classId === 'summoner') {
    // Her own earlier Tome summon says farewell first (only a Tome half lingers, Bonded's at 0.4): the best farewell.
    const lingerers = nodes.filter((n) => rpgNodeSkill(n, engine).summon && isRpgTome(n.weapon))
    const probe = withHeld(base, [], engine)!
    const act = (id: string, target: string): BattleAction => ({ kind: 'attack', actorId: id, targetId: target, weapon: probe.weapons.find(isRpgTome)!,
      pair: partner(probe, true) })
    const plain = railFight(probe, act, engine, others)!.chips
    const farewell = lingerers.reduce((m, l) => {
      const r = railFight(probe, act, engine, others, (s) => { s.summons = [{ allyId: '100', ref: { tier: 1, id: l.id }, scale: rpgNodeSkill(l, engine).summon!.linger }] })
      const c = (r?.chips ?? plain) - plain
      return c > m.chips ? { chips: c, act: l.name } : m
    }, { chips: 0, act: '—' })
    own = { chips: own.chips + farewell.chips, act: `${own.act} (${farewell.act} lingering)` }
  }
  const railChips = (ally: BattleAlly, action: (id: string, target: string) => BattleAction, setup?: (s: BattleState) => void): number | null =>
    railFight(ally, action, engine, others, setup)?.chips ?? null
  return { classId, own, limit: limitRail(base, heroLimitIds(engine), railChips) }
}

/**
 * Classes v3's rail (v19, H131; classes-v3 §10.1, halls-v2 HV15): v16's at Class Rank 50, for all thirteen classes. A pair
 * class's halves are credited by the kind of the hit each point followed, so her lead half's extra hit (`rpgHand(…, 19)`'s
 * `lead` and `extra`) counts on whichever channel leads; her lingering farewell is her lead half's (the hand's `linger`: the
 * Tome Summoner's Tome summons, the Arms Summoner's Arms ones), played before her best pair. A Tier 0 is a one-half class at
 * Class Rank 10, her one skill on each of the ten weapons. Limit Breaks: Halls v2's twenty at full strength, each at her
 * class's scale (`heroLimitScale`, read by the engine), and the most hits any lands on the boss (HV15: 10 at most).
 */
function guardRailV19(classId: RpgClass, engine: number): Rail {
  const others = railOthers(engine)
  const base = balanceMember(classId, 0, 50, { ...ON_CURVE, engine, classRank: rpgIsTier0(classId) ? RPG_TIER0_MAX_RANK : 50 })
  const nodes = RPG_ALL_NODES.filter((n) => rpgClassTrees(classId).includes(n.tree) && rpgNodeLine(n.id) !== null)
  const hand = rpgHand({ classId }, engine)
  const pair = hand.pair
  const acts: (RailAct & { tome: boolean })[] = []
  const partner = (ally: BattleAlly, tome: boolean): BattleHalf => ({ weapon: ally.weapons.find((w) => isRpgTome(w) !== tome)! })
  const credit = (r: RailFight | null, tome: boolean): number | null => (r === null ? null : pair ? (tome ? r.tome : r.arms) : r.chips)
  for (const weapon of [...new Set([...base.weapons, ...nodes.map((n) => n.weapon)])]) {
    const ally = withHeld(base, [], engine)
    const armed = ally && weaponsWith(classId, ally.weapons, [weapon], engine)
    if (!ally || !armed) continue
    const a = { ...ally, weapons: armed }
    const tome = isRpgTome(weapon)
    const chips = credit(railFight(a, (id, target) => ({ kind: 'attack', actorId: id, targetId: target, weapon, ...(pair ? { pair: partner(a, tome) } : {}) }), engine, others), tome)
    if (chips !== null) acts.push({ chips, act: `Attack (${weapon})`, tome })
  }
  for (const node of nodes) {
    const ally = withHeld(base, [node], engine)
    if (!ally) continue
    const tome = isRpgTome(node.weapon)
    const skill = { tier: 1, id: node.id }
    const chips = credit(railFight(ally, (id, target) => ({ kind: 'skill', actorId: id, targetId: target, skill, ...(pair ? { pair: partner(ally, tome) } : {}) }), engine, others), tome)
    if (chips !== null) acts.push({ chips, act: node.name, tome })
  }
  let own: RailAct
  if (pair) {
    const arms = best(acts.filter((a) => !a.tome)), tome = best(acts.filter((a) => a.tome))
    own = { chips: arms.chips + tome.chips, act: `${arms.act} + ${tome.act}` }
  } else own = best(acts)
  if (pair && hand.linger > 0) {
    // Her own earlier lead summon says farewell first (only the lead half lingers, Bonded's at 0.4): the best farewell.
    const leadTome = hand.lead === 'tome'
    const lingerers = nodes.filter((n) => rpgNodeSkill(n, engine).summon && isRpgTome(n.weapon) === leadTome)
    const probe = withHeld(base, [], engine)!
    const act = (id: string, target: string): BattleAction => ({ kind: 'attack', actorId: id, targetId: target,
      weapon: probe.weapons.find((w) => isRpgTome(w) === leadTome)!, pair: partner(probe, leadTome) })
    const plain = railFight(probe, act, engine, others)!.chips
    const farewell = lingerers.reduce((m, l) => {
      const r = railFight(probe, act, engine, others, (s) => { s.summons = [{ allyId: '100', ref: { tier: 1, id: l.id }, scale: rpgNodeSkill(l, engine).summon!.linger }] })
      const c = (r?.chips ?? plain) - plain
      return c > m.chips ? { chips: c, act: l.name } : m
    }, { chips: 0, act: '—' })
    own = { chips: own.chips + farewell.chips, act: `${own.act} (${farewell.act} lingering)` }
  }
  // Every Limit Break of Halls v2's twenty, fired by her as its Hero with a full gauge: the most chips and the most hits.
  let limit: RailAct = { chips: 0, act: '—' }, hits = { hits: 0, act: '—' }
  for (const hero of heroLimitIds(engine)) {
    const { inherits: _, ...plain } = { ...base, hero }
    const r = railFight(plain, (id, target) => ({ kind: 'limit', actorId: id, targetId: target }), engine, others,
      (s) => { s.units.find((u) => u.id === '100')!.limit = BATTLE_LIMIT_MAX })
    if (r && r.chips > limit.chips) limit = { chips: r.chips, act: `Limit Break ${hero}` }
    if (r && r.hits > hits.hits) hits = { hits: r.hits, act: `Limit Break ${hero}` }
  }
  return { classId, own, limit, hits }
}

/** The Duel's shields, stage 1 to 12, in an engine's tuning. */
export const duelShields = (engine: number = BATTLE_ENGINE_VERSION): number[] => [...riftTuning(engine).duel.shields]
