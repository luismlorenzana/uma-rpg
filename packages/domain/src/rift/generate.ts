// The Rift's fights (docs/design/rift.md §4–§9, D161; built in H47, D173): any front stage, Convergence fight or Echo as
// the `BattleEnemy` waves the engine takes, with engine v14's foe traits where the front calls for them (D169). Pure and
// deterministic: the same context and fight give the same foes, weaknesses and faces; only a retry's seed is new.
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/engine'
import type { BattleAlly, BattleEnemy, BattleInput, BattleWeaknesses } from '../rpg/battle/types'
import { rpgChapterReach } from '../rpg/campaign/chapters'
import { RPG_FOE_ROLES, rpgFoe, rpgFoeCurveLevel } from '../rpg/campaign/enemies'
import { RPG_ELEMENTS, RPG_TIER_MAX_LEVEL, RPG_WEAPON_KINDS, rpgTwinWeaknesses, type RpgElement } from '../rpg/rules'
import type { EnemyRoster } from '../world/roster'
import { WORLD_TUNING } from '../world/world'
import { RIFT_FRONT_SPECS, riftShape, riftTuning, type RiftSlot, type RiftTuning } from './fronts'
import { riftEchoFaces, riftRunFaces, riftShapeOf } from './picker'
import { CONVERGENCE_FIGHTS, ECHO_LEVELS, RIFT_FRONTS, RIFT_STAGES, riftRefKey, type RiftFightRef, type RiftFront } from './state'

export interface RiftContext {
  tier: number
  /** The run (front and Convergence fights). Echoes ignore it. */
  runId: string | null
  roster: EnemyRoster
  /** Faces this account had defeated when the run started (`defeatedBefore`). Echoes ignore it. */
  defeated: ReadonlySet<string>
}

export interface RiftFightPlan {
  ref: RiftFightRef
  /** "Stage 5", "Champion", "Convergence · Iron", "Echo · Lv 55". */
  name: string
  /** The level shown, a tier level: 50, or the Echo's 45, 50 or 55. */
  level: number
  /** HP and offense over the same shape at strength 1. */
  strength: number
  enemies: BattleEnemy[]
  waves?: BattleEnemy[][]
}

/** FNV-1a, as the world map's battle seeds (`run.ts`): a Rift fight's seed from its battle id (`riftBattleId`). */
export function riftSeed(battleId: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < battleId.length; i += 1) { h ^= battleId.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return h >>> 0
}

/** The faces `defeated` (cast id → first defeated) holds from strictly before `at`: a run's preference, fixed at its start. */
export function defeatedBefore(defeated: Readonly<Record<string, string>>, at: string): Set<string> {
  const limit = Date.parse(at)
  return new Set(Object.entries(defeated).filter(([, t]) => Date.parse(t) < limit).map(([id]) => id))
}

const isFront = (front: unknown): front is RiftFront => RIFT_FRONTS.includes(front as RiftFront)
const inRange = (n: unknown, lo: number, hi: number): boolean => Number.isInteger(n) && (n as number) >= lo && (n as number) <= hi

function checkRef(ref: RiftFightRef): void {
  const ok = !!ref && (ref.kind === 'front' ? isFront(ref.front) && inRange(ref.stage, 1, RIFT_STAGES)
    : ref.kind === 'convergence' ? inRange(ref.fight, 0, CONVERGENCE_FIGHTS - 1)
    : ref.kind === 'echo' ? isFront(ref.front) && ECHO_LEVELS.includes(ref.level) : false)
  if (!ok) throw new RangeError(`Unknown Rift fight: ${JSON.stringify(ref)}`)
}

/** A fight's strength (§5): front stage n 1 + climb × (n − 1) ÷ 11, a Convergence fight (1 + climb) × (1 + convergence),
 * an Echo 1, or `echo55` at Lv 55, in an engine's tuning (H60). Rounded to four places. */
export function riftStrength(ref: RiftFightRef, engine: number = BATTLE_ENGINE_VERSION): number {
  checkRef(ref)
  const t = riftTuning(engine)
  const strength = ref.kind === 'front' ? 1 + (t.climb * (ref.stage - 1)) / (RIFT_STAGES - 1)
    : ref.kind === 'convergence' ? (1 + t.climb) * (1 + t.convergence)
    : ref.level === '55' ? t.echo55 : 1
  return Math.round(strength * 1e4) / 1e4
}

const ordered = <T extends string>(list: readonly T[], key: string): T[] => [...list].sort((a, b) => riftSeed(`${key}:${a}`) - riftSeed(`${key}:${b}`))
const canonical = <T extends string>(list: readonly T[], all: readonly T[]): T[] => [...list].sort((a, b) => all.indexOf(a) - all.indexOf(b))

/** The five twin sets the Rift draws from v16 (CP7): each an element and its twin Arm; Twilight is the world's alone. */
const RIFT_TWIN_SETS: readonly RpgElement[] = RPG_ELEMENTS
/** Twin sets as one foe's weaknesses: their Arms and their elements, in canonical order (the pairs share it). */
const twinSets = (sets: readonly RpgElement[]): BattleWeaknesses => {
  const each = canonical(sets, RIFT_TWIN_SETS).map(rpgTwinWeaknesses)
  return { weapons: each.flatMap((w) => w.weapons), elements: each.flatMap((w) => w.elements) }
}

/** One wave's weaknesses (§5), from the front, never the face: Iron Arms only and Arcane elements only, by rank, a pair's
 * differing; the Duel both, by stage; the Horde one of each, dealt from the 25 pairs so no two foes of a wave share one.
 * From v16 (CP7, D202) the Duel draws `duel.sets` twin sets, and the Horde deals each foe a twin set, a wave repeating
 * none until all five are dealt (a champion pair's partners, dealt first, differ); Iron and Arcane draw as before. */
function waveWeaknesses(front: RiftFront, stage: number, wave: readonly RiftSlot[], keyOf: (k: number) => string,
  tuning: RiftTuning, engine: number): BattleWeaknesses[] {
  const t = tuning.weak
  const twins = rpgRework('fight', engine)
  const taken = new Set<string>()
  const deal = RPG_WEAPON_KINDS.flatMap((w) => RPG_ELEMENTS.map((e) => [w, e] as const))
  const deck: RpgElement[] = []
  /** `count` kinds of `all` by the slot's seed; a pair's later foe takes kinds her partners don't have first. */
  const draw = <T extends string>(all: readonly T[], count: number, slot: RiftSlot, key: string): T[] => {
    const order = ordered(all, key)
    const kinds = (slot.pair ? [...order.filter((x) => !taken.has(x)), ...order.filter((x) => taken.has(x))] : order).slice(0, count)
    if (slot.pair) kinds.forEach((x) => taken.add(x))
    return canonical(kinds, all)
  }
  return wave.map((slot, k) => {
    const key = keyOf(k)
    switch (front) {
      case 'iron': return { weapons: draw(RPG_WEAPON_KINDS, t.iron[slot.rank], slot, `${key}:arms`), elements: [] }
      case 'arcane': return { weapons: [], elements: draw(RPG_ELEMENTS, t.arcane[slot.rank], slot, `${key}:elements`) }
      case 'duel': {
        const sets = twins ? t.duel.sets?.[stage - 1] : undefined
        if (sets !== undefined) return twinSets(draw(RIFT_TWIN_SETS, sets, slot, `${key}:sets`))
        return { weapons: draw(RPG_WEAPON_KINDS, t.duel.weapons[stage - 1]!, slot, `${key}:arms`),
          elements: draw(RPG_ELEMENTS, t.duel.elements[stage - 1]!, slot, `${key}:elements`) }
      }
      case 'horde': {
        if (twins) {
          if (!deck.length) deck.push(...RIFT_TWIN_SETS)
          return twinSets(deck.splice(riftSeed(`${key}:set`) % deck.length, 1))
        }
        const [weapon, element] = deal.splice(riftSeed(`${key}:pair`) % deal.length, 1)[0]!
        return { weapons: [weapon], elements: [element] }
      }
    }
  })
}

function check(ctx: RiftContext, ref: RiftFightRef): void {
  if (!inRange(ctx?.tier, 1, 1000)) throw new RangeError(`Unknown Rift tier: ${String(ctx?.tier)}`)
  checkRef(ref)
  if (ref.kind !== 'echo' && !ctx.runId) throw new RangeError('A front or Convergence fight needs its run')
}

/**
 * Any Rift fight (D173): its front stage's shape (`riftShape`; a Convergence fight its front's champion, an Echo stage
 * `echoStage`) at the tier's Lv 50 (an Echo at 45 or 50, Lv 55 being Lv 50 at `echo55`), at its strength, with the
 * front's weaknesses and traits and the run's faces, in an engine's tuning (`riftTuning`, H60; the live one by default, as
 * a fight starts on it). Throws a `RangeError` for a fight out of range, a front or Convergence fight without a run, or an
 * empty roster.
 */
export function riftFight(ctx: RiftContext, ref: RiftFightRef, engine: number = BATTLE_ENGINE_VERSION): RiftFightPlan {
  check(ctx, ref)
  const { front, stage } = riftShapeOf(ref)
  const spec = RIFT_FRONT_SPECS[front]
  const tuning = riftTuning(engine)
  const shown = ref.kind === 'echo' ? Number(ref.level) : tuning.level
  const lifetime = RPG_TIER_MAX_LEVEL * (ctx.tier - 1) + Math.min(shown, RPG_TIER_MAX_LEVEL)
  const strength = riftStrength(ref, engine)
  const faces = ref.kind === 'echo' ? riftEchoFaces(ctx.roster, ctx.tier, ref)
    : riftRunFaces(ctx.roster, ctx.tier, ctx.runId!, ctx.defeated).get(riftRefKey(ref))!
  const prefix = `${ctx.tier}:${ref.kind === 'echo' ? 'echo' : ctx.runId}:${riftRefKey(ref)}`
  const keyOf = (slot: number) => `${prefix}:${slot}`
  const reach = rpgChapterReach(lifetime)
  // A regular's HP takes the world's regular-foe step at the tier level (Z3, D170), as `stageWaves` does.
  const step = 1 + WORLD_TUNING.regularHpPerLevel * (rpgFoeCurveLevel(lifetime) - 1)
  let next = 0
  const waves = riftShape(front, stage, engine).map((wave) => {
    const first = next
    const weak = waveWeaknesses(front, stage, wave, (k) => keyOf(first + k), tuning, engine)
    return wave.map((slot, k): BattleEnemy => {
      const n = next++
      const key = keyOf(n)
      const weaknesses = weak[k]!
      // Her own element (her moves) is one she isn't weak to (§5).
      const own = RPG_ELEMENTS.filter((e) => !weaknesses.elements.includes(e))
      const element = own[riftSeed(`${key}:element`) % own.length]!
      const role = slot.role === 'seeded' ? RPG_FOE_ROLES[riftSeed(`${key}:role`) % RPG_FOE_ROLES.length]! : slot.role
      const base = rpgFoe({ id: `foe${n + 1}`, castId: faces[n]!, element, role, rank: slot.rank, level: lifetime, shield: slot.shield, weaknesses,
        ...(slot.rank === 'regular' ? {} : { reach }), ...(slot.acts === 2 ? { twice: true } : {}) })
      return {
        ...base,
        stats: { ...base.stats, hp: Math.max(1, Math.round(base.stats.hp * slot.hp * (slot.rank === 'regular' ? step : 1) * strength)),
          atk: Math.round(base.stats.atk * slot.offense * strength), matk: Math.round(base.stats.matk * slot.offense * strength) },
        ...(spec.ward ? { ward: spec.ward } : {}), ...(slot.acts === 3 ? { thrice: true } : {}), ...(front === 'duel' ? { mixedLocks: true } : {}),
      }
    })
  })
  const name = ref.kind === 'front' ? (ref.stage === RIFT_STAGES ? 'Champion' : `Stage ${ref.stage}`)
    : ref.kind === 'convergence' ? `Convergence · ${spec.name}` : `Echo · Lv ${ref.level}`
  const [enemies, ...rest] = waves
  return { ref: { ...ref }, name, level: shown, strength, enemies: enemies!, ...(rest.length ? { waves: rest } : {}) }
}

/** A front's twelve stages, in order. */
export function riftChain(ctx: RiftContext, front: RiftFront, engine: number = BATTLE_ENGINE_VERSION): RiftFightPlan[] {
  if (!isFront(front)) throw new RangeError(`Unknown Rift front: ${String(front)}`)
  return Array.from({ length: RIFT_STAGES }, (_, i) => riftFight(ctx, { kind: 'front', front, stage: i + 1 }, engine))
}

/** The Convergence's four fights, in `RIFT_FRONTS` order. */
export function riftConvergence(ctx: RiftContext, engine: number = BATTLE_ENGINE_VERSION): RiftFightPlan[] {
  return Array.from({ length: CONVERGENCE_FIGHTS }, (_, fight) => riftFight(ctx, { kind: 'convergence', fight }, engine))
}

/** A Rift fight's frozen input on the live engine (or `version`, for the balance simulation, H60; its plan from
 * `riftFight` on the same engine): the allies as built (H48 with full MP), the plan's waves. */
export function riftBattleInput(plan: RiftFightPlan, allies: readonly BattleAlly[], seed: number,
  version: BattleInput['version'] = BATTLE_ENGINE_VERSION): BattleInput {
  return { version, seed, allies: [...allies], enemies: plan.enemies, ...(plan.waves ? { waves: plan.waves } : {}) }
}
