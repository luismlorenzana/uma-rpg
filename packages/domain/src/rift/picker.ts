// The Rift's faces (docs/design/rift.md §9, D161; built in H47, D173): one allocation per run across the three packs,
// Azur Lane and NIKKE leading, PriConne supporting, faces this account hadn't defeated when the run started first, so a
// run shows as many different faces as it can and the Bestiary fills over a few runs. Faces are presentation and the
// Bestiary only: a retry rebuilds the same foes, weaknesses and faces (§4).
import { RIFT_FRONTS, RIFT_STAGES, CONVERGENCE_FIGHTS, riftRefKey, type RiftFightRef } from './state'
import { riftShape, RIFT_TUNING, type RiftFace, type RiftSlot } from './fronts'
import type { EnemyRoster, EnemyTier, Franchise, RosterMember } from '../world/roster'

/** Each pack's share of a face tier's slots (§9): about 40 / 37 / 23, the packs' sizes. */
export const RIFT_FRANCHISE_WEIGHTS: Readonly<Record<Franchise, number>> = { azurlane: 40, nikke: 37, priconne: 23 }
/** The packs by weight, heaviest first: the order a pack out of faces lends in. */
const BY_WEIGHT = (Object.keys(RIFT_FRANCHISE_WEIGHTS) as Franchise[])
  .sort((a, b) => RIFT_FRANCHISE_WEIGHTS[b] - RIFT_FRANCHISE_WEIGHTS[a])
/** Members with no pack (a test's plain list) are drawn last. */
type Pack = Franchise | 'other'
const PACKS: readonly Pack[] = [...BY_WEIGHT, 'other']
/** A face tier with no members borrows from the nearest one (key → sub-boss → boss), then regulars, then anyone. */
const NEAREST: Readonly<Record<RiftFace, readonly EnemyTier[]>> = {
  key: ['key', 'subboss', 'boss', 'regular'], subboss: ['subboss', 'boss', 'key', 'regular'], boss: ['boss', 'subboss', 'key', 'regular'],
}

function hash(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return h >>> 0
}

/** A face per slot of each fight, by `riftRefKey`: wave by wave, as `riftShape` lists them. */
export type RiftFaces = ReadonlyMap<string, readonly string[]>

/** Smooth weighted round-robin over the packs: each draw adds every weight and takes the highest, less the total, so a
 * tier's slots split 40 / 37 / 23 evenly along the run. Draws skipped for a pair wait for the next slot. */
function packSequence(): { next: () => Franchise; nextOtherThan: (avoid: ReadonlySet<Pack>) => Franchise } {
  const current = Object.fromEntries(BY_WEIGHT.map((f) => [f, 0])) as Record<Franchise, number>
  const total = BY_WEIGHT.reduce((sum, f) => sum + RIFT_FRANCHISE_WEIGHTS[f], 0)
  const waiting: Franchise[] = []
  const draw = (): Franchise => {
    let best = BY_WEIGHT[0]!
    for (const f of BY_WEIGHT) {
      current[f] += RIFT_FRANCHISE_WEIGHTS[f]
      if (current[f] > current[best]) best = f
    }
    current[best] -= total
    return best
  }
  return {
    next: () => waiting.shift() ?? draw(),
    nextOtherThan: (avoid) => {
      const i = waiting.findIndex((f) => !avoid.has(f))
      if (i >= 0) return waiting.splice(i, 1)[0]!
      for (let k = 0; k < 2 * BY_WEIGHT.length; k += 1) {
        const f = draw()
        if (!avoid.has(f)) return f
        waiting.push(f)
      }
      return waiting.shift()!
    },
  }
}

interface Pool { tier: EnemyTier | 'any'; packs: ReadonlyMap<Pack, readonly RosterMember[]>; used: Set<string> }

/**
 * Allocates faces to fights in order (D173): for each face tier, the roster's members of that tier, those not in
 * `defeated` first, then by `hash(tier:key:id)`, split by pack. Each slot takes a pack by the tier's round-robin and that
 * pack's first face not yet used; a pack out of unused faces lends to the next by weight (unused faces not yet defeated
 * first, from any pack); a tier out of unused faces starts over, never repeating a face within one fight. A pair's later
 * bosses take the next pack in the sequence that differs from those already in the pair.
 */
function allocate(roster: EnemyRoster, tier: number, key: string, defeated: ReadonlySet<string>,
  fights: readonly { key: string; shape: readonly (readonly RiftSlot[])[] }[]): RiftFaces {
  if (!roster.length) throw new RangeError('The Rift needs the enemy roster')
  const sorted = [...roster].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  const pools = new Map<EnemyTier | 'any', Pool>()
  const poolFor = (face: RiftFace): Pool => {
    const tierOf = NEAREST[face].find((t) => sorted.some((m) => m.tier === t)) ?? 'any'
    let pool = pools.get(tierOf)
    if (!pool) {
      const members = tierOf === 'any' ? sorted : sorted.filter((m) => m.tier === tierOf)
      const ranked = members.map((m) => ({ m, seen: defeated.has(m.id) ? 1 : 0, h: hash(`${tier}:${key}:${m.id}`) }))
        .sort((a, b) => a.seen - b.seen || a.h - b.h || (a.m.id < b.m.id ? -1 : 1)).map((x) => x.m)
      pool = { tier: tierOf, packs: new Map(PACKS.map((p) => [p, ranked.filter((m) => (m.franchise ?? 'other') === p)])), used: new Set() }
      pools.set(tierOf, pool)
    }
    return pool
  }
  const sequences = new Map<RiftFace, ReturnType<typeof packSequence>>()
  const sequenceFor = (face: RiftFace) => sequences.get(face) ?? sequences.set(face, packSequence()).get(face)!

  /** The first face of the pool in pack order that `ok` accepts: undefeated ones first, then any. */
  const find = (pool: Pool, order: readonly Pack[], ok: (m: RosterMember) => boolean): RosterMember | null => {
    for (const fresh of [true, false]) {
      for (const p of order) {
        const m = pool.packs.get(p)!.find((x) => ok(x) && (!fresh || !defeated.has(x.id)))
        if (m) return m
      }
    }
    return null
  }

  const out = new Map<string, string[]>()
  for (const fight of fights) {
    const inFight = new Set<string>()
    const faces: string[] = []
    for (const wave of fight.shape) {
      const pair = new Set<Pack>()
      for (const slot of wave) {
        const pool = poolFor(slot.face)
        const seq = sequenceFor(slot.face)
        const pack = slot.pair && pair.size ? seq.nextOtherThan(pair) : seq.next()
        // Its pack, then the others by weight; a pair partner's pack only when no other pack has a face.
        const order = [pack, ...PACKS.filter((p) => p !== pack && !pair.has(p)), ...PACKS.filter((p) => p !== pack && pair.has(p))]
        const free = (m: RosterMember) => !pool.used.has(m.id) && !inFight.has(m.id)
        let m = slot.pair ? find(pool, order.filter((p) => !pair.has(p)), free) ?? find(pool, order, free) : find(pool, order, free)
        if (!m) {
          // Every face of the tier is used: it starts over, still never repeating one within this fight.
          pool.used.clear()
          m = find(pool, order.filter((p) => !pair.has(p)), free) ?? find(pool, order, free) ?? find(pool, order, () => true)!
        }
        pool.used.add(m.id)
        inFight.add(m.id)
        if (slot.pair) pair.add(m.franchise ?? 'other')
        faces.push(m.id)
      }
    }
    out.set(fight.key, faces)
  }
  return out
}

/** A run's 52 fights in allocation order: the fronts in `RIFT_FRONTS` order, stages 1–12, then the Convergence 0–3. */
export const RIFT_RUN_FIGHTS: readonly RiftFightRef[] = [
  ...RIFT_FRONTS.flatMap((front) => Array.from({ length: RIFT_STAGES }, (_, i): RiftFightRef => ({ kind: 'front', front, stage: i + 1 }))),
  ...Array.from({ length: CONVERGENCE_FIGHTS }, (_, fight): RiftFightRef => ({ kind: 'convergence', fight })),
]

/** The front stage a fight takes its shape from: a Convergence fight its front's champion, an Echo `echoStage`. */
export function riftShapeOf(ref: RiftFightRef): { front: (typeof RIFT_FRONTS)[number]; stage: number } {
  switch (ref.kind) {
    case 'front': return { front: ref.front, stage: ref.stage }
    case 'convergence': return { front: RIFT_FRONTS[ref.fight]!, stage: RIFT_STAGES }
    case 'echo': return { front: ref.front, stage: RIFT_TUNING.echoStage }
  }
}

const memo = new WeakMap<EnemyRoster, Map<string, RiftFaces>>()
const setKeys = new WeakMap<ReadonlySet<string>, string>()
const keyOf = (set: ReadonlySet<string>): string => {
  let k = setKeys.get(set)
  if (k === undefined) { k = [...set].sort().join(','); setKeys.set(set, k) }
  return k
}
function remembered(roster: EnemyRoster, key: string, make: () => RiftFaces): RiftFaces {
  let byKey = memo.get(roster)
  if (!byKey) { byKey = new Map(); memo.set(roster, byKey) }
  let faces = byKey.get(key)
  if (!faces) { faces = make(); byKey.set(key, faces) }
  return faces
}

/** Every face of a run's 52 fights, by `riftRefKey` (memoized per roster array, tier, run and defeated set). Throws a
 * `RangeError` for an empty roster. */
export function riftRunFaces(roster: EnemyRoster, tier: number, runId: string, defeated: ReadonlySet<string>): RiftFaces {
  return remembered(roster, `${tier}|${runId}|${keyOf(defeated)}`, () => allocate(roster, tier, runId, defeated,
    RIFT_RUN_FIGHTS.map((ref) => { const { front, stage } = riftShapeOf(ref); return { key: riftRefKey(ref), shape: riftShape(front, stage) } })))
}

/** An Echo's faces: its one fight allocated alone, keyed `echo:<front>:<level>`, preferring nothing, so they don't move
 * as the Bestiary fills. */
export function riftEchoFaces(roster: EnemyRoster, tier: number, ref: Extract<RiftFightRef, { kind: 'echo' }>): readonly string[] {
  const key = riftRefKey(ref)
  const { front, stage } = riftShapeOf(ref)
  return remembered(roster, `${tier}|${key}|`, () => allocate(roster, tier, key, new Set(), [{ key, shape: riftShape(front, stage) }])).get(key)!
}
