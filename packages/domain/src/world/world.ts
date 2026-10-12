// The world map (D66, D71, D97; docs/design/world/): a tier's five continents, one per scenario and ten levels each, of 40
// biome regions and five Springs. Each region is a climb of twelve stages over five levels: half a continent's regions
// cover its first five levels, half its last five, so a party crosses a continent in two regions. Generated from
// the continent's release order with fixed seeds, so ids and contents never move under a save. A region is handed to the
// battle rules as a small chapter (a start camp and its stages in a line), so fights reuse the chapter machinery.
import type { BattleEnemy, BattleWeaknesses, EnemyRank } from '../rpg/battle/types'
import { rpgChapterReach, type RpgCampaignChapter, type RpgCastMember, type RpgMapNode } from '../rpg/campaign/chapters'
import { RPG_FOE_TUNING, rpgFoe, type RpgFoeRole } from '../rpg/campaign/enemies'
import { RPG_ELEMENTS, RPG_WEAPON_KINDS, type RpgElement } from '../rpg/kinds'
import { BIOMES, biomeById, biomeFranchise, FRANCHISES, signatureWeaknesses, type Biome, type BiomeDef, type Formation, type Franchise } from './biomes'

export const WORLD_LEVELS = 10
/** Ten rows of four regions on a continent's map: rows 1–5 hold its first five levels, rows 6–10 its last five. */
export const WORLD_ROWS = 10
export const WORLD_REGIONS_PER_ROW = 4
/** Levels one region climbs (D97). */
export const WORLD_REGION_LEVELS = 5
export const WORLD_STAGES = 12
export const WORLD_SPRINGS = 5
/** A Spring refills the active party's MP, then recharges for two hours (D66). */
export const SPRING_RECHARGE_MS = 2 * 3600 * 1000

export interface WorldRegion {
  id: string; continentId: string; biome: Biome; name: string
  /** The region's first and last levels: its first stages are at `level`, its elite and boss at `levelTop` (D97). */
  level: number; levelTop: number
  row: number; col: number
}
export interface WorldSpring { id: string; continentId: string; /** Sits above this row (0 is the continent's bottom row). */ row: number }
export interface WorldContinent { id: string; order: number; name: string; levelStart: number; regions: WorldRegion[]; springs: WorldSpring[] }
export interface ContinentSource { name: string; order: number }

function hash(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return h >>> 0
}
const pick = <T>(list: readonly T[], key: string): T => list[hash(key) % list.length]!
const shuffle = <T>(list: readonly T[], key: string): T[] => list.map((v, i) => ({ v, k: hash(`${key}:${i}`) })).sort((a, b) => a.k - b.k).map((x) => x.v)

/** Each continent's climate lean: the biome it holds a third of (D66). */
export const CONTINENT_LEAN: readonly Biome[] = ['forest', 'coast', 'desert', 'tundra', 'moor']
const LEAN = CONTINENT_LEAN
const ROMAN = ['', ' II', ' III']

/** A continent of the first tier: `order` 1–5, levels `10 × (order − 1) + 1` on. */
export function worldContinent(source: ContinentSource): WorldContinent {
  const id = `w${source.order}`
  const levelStart = (source.order - 1) * WORLD_LEVELS + 1
  // Every biome twice, the Meadow and the lean a third time: 40 slots, the Meadow's first copy at the first level.
  const slots: Biome[] = [...BIOMES.map((b) => b.id), ...BIOMES.map((b) => b.id), 'meadow', LEAN[(source.order - 1) % LEAN.length]!]
  const rest = shuffle(slots.filter((_, i) => i !== 0), `${id}:layout`)
  const order: Biome[] = ['meadow', ...rest]
  const seen = new Map<Biome, number>()
  const regions = order.map((biome, i): WorldRegion => {
    const row = Math.floor(i / WORLD_REGIONS_PER_ROW)
    const col = i % WORLD_REGIONS_PER_ROW
    const n = seen.get(biome) ?? 0
    seen.set(biome, n + 1)
    const level = levelStart + (row < WORLD_ROWS / 2 ? 0 : WORLD_REGION_LEVELS)
    return { id: `${id}-${row + 1}-${col + 1}`, continentId: id, biome, name: `${biomeById(biome).name}${ROMAN[n] ?? ''}`, level,
      levelTop: level + WORLD_REGION_LEVELS - 1, row, col }
  })
  const springs = Array.from({ length: WORLD_SPRINGS }, (_, k): WorldSpring => ({ id: `${id}-spring${k + 1}`, continentId: id, row: k * 2 }))
  return { id, order: source.order, name: source.name, levelStart, regions, springs }
}

/**
 * World tuning (D75), set against the balance simulation (`SIM=1 npx vitest run src/world/balance.test.ts`). Skills
 * grow with depth faster than the foe curve, so foes gain HP and offense per level on top of it (a regular foe ×2.7 HP
 * and ×2 offense by Lv50); a region boss is a fraction of a chapter champion (one of forty per continent).
 */
export const WORLD_TUNING = {
  regularHpPerLevel: 0.035, regularOffensePerLevel: 0.02,
  eliteHpPerLevel: 0.01, eliteOffensePerLevel: 0.005,
  bossHp: 0.5, bossOffensePerLevel: 0.005,
} as const

/**
 * Formation templates (encounters.md, W3): how many foes, the HP they share in regular foes (so a solo and a swarm
 * are about as hard) and each one's shield. A solo elite acts twice a round. An escort is a captain and her guards.
 */
export const WORLD_FORMATIONS: Readonly<Record<Formation, { count: readonly [number, number]; budget: number; shield: number; name: string }>> = {
  solo: { count: [1, 1], budget: 3.5, shield: 6, name: 'Lone elite' },
  duo: { count: [2, 2], budget: 3.6, shield: 4, name: 'Pair' },
  trio: { count: [3, 3], budget: 3.6, shield: 3, name: 'Trio' },
  squad: { count: [4, 5], budget: 4, shield: 2, name: 'Squad' },
  swarm: { count: [6, 8], budget: 3.6, shield: 1, name: 'Swarm' },
  escort: { count: [3, 5], budget: 0, shield: 2, name: 'Escort' },
}
/** An escort's captain and each guard, in regular foes' HP. */
export const WORLD_ESCORT = { captain: 2.5, captainShield: 5, guard: 0.8 } as const
const ESCORT = WORLD_ESCORT
const FORMATION = WORLD_FORMATIONS
/** Waves (W3): stages 8 and 9 come in two, the boss in three; a stage in waves pays 1.5× (`WAVE_PAY`), so its waves
 * share 1.5 stages' HP, and the boss's two opening waves are lighter, so the champion's wave decides it. */
export const WAVE_STAGES: Readonly<Record<number, number>> = { 8: 2, 9: 2 }
export const BOSS_WAVES = 3
export const WAVE_HP: Readonly<Record<number, number>> = { 1: 1, 2: 0.75, 3: 0.3 }

export interface StagePlan { formation: Formation; signature: readonly RpgElement[]; waves: number }

/**
 * What each of a region's twelve stages is: ten regular stages, an elite, the boss. Stages 1–2 teach (pairs of the
 * first two signatures), 7 is a crowd, 8–9 come in two waves, 10 is the biome's own formation; the rest walk the
 * biome's formation × signature combinations in a seeded order, so a region repeats one only when its biome runs out.
 */
export function stagePlan(biome: BiomeDef, regionId: string): StagePlan[] {
  const sigs = biome.signatures
  const combos = shuffle(biome.formations.flatMap((formation) => sigs.map((signature) => ({ formation, signature }))), `${regionId}:combos`)
  const used = new Set<number>()
  const plan: StagePlan[] = []
  // The next unused combination, preferring a formation unlike the stage before.
  const take = (): { formation: Formation; signature: readonly RpgElement[] } => {
    const previous = plan[plan.length - 1]?.formation
    let i = combos.findIndex((c, k) => !used.has(k) && c.formation !== previous)
    if (i < 0) i = combos.findIndex((_, k) => !used.has(k))
    if (i < 0) { used.clear(); i = combos.findIndex((c) => c.formation !== previous); if (i < 0) i = 0 }
    used.add(i)
    return combos[i]!
  }
  for (let n = 1; n <= 10; n++) {
    const waves = WAVE_STAGES[n] ?? 1
    if (n <= 2) plan.push({ formation: 'duo', signature: sigs[(n - 1) % sigs.length]!, waves })
    else if (n === 7) {
      const previous = plan[plan.length - 1]!.signature
      plan.push({ formation: biome.formations.includes('swarm') ? 'swarm' : 'squad', signature: sigs.find((g) => g !== previous) ?? sigs[0]!, waves })
    }
    else if (n === 10) plan.push({ formation: biome.formations[0]!, signature: sigs[0]!, waves })
    else plan.push({ ...take(), waves })
  }
  plan.push({ formation: 'solo', signature: sigs[sigs.length - 1]!, waves: 1 })
  plan.push({ formation: 'escort', signature: sigs[0]!, waves: BOSS_WAVES })
  return plan
}

/**
 * A stage's level (D97): the ten regular stages climb the region's five levels two at a time, and the elite and the
 * boss wait at the top. A regular stage pays about a third of a level, so a party that walks in at the region's first
 * level reaches its last by stage 10 and leaves for the next region's first level after the boss, a little short
 * rather than over: replaying a stage tops it up.
 */
export const stageLevel = (region: Pick<WorldRegion, 'level' | 'levelTop'>, stage: number): number =>
  Math.min(region.levelTop, region.level + Math.floor((Math.min(stage, 10) - 1) / 2))

/** Faces each pack lends the mixed pool (D81). */
export const POOL_PER_FRANCHISE = 5
/** A pack's pool faces: the members whose ids hash lowest, so a growing pack rarely reshuffles them. */
export const poolOf = <M extends RpgCastMember>(members: readonly M[]): M[] =>
  [...members].sort((a, b) => hash(`pool:${a.id}`) - hash(`pool:${b.id}`)).slice(0, POOL_PER_FRANCHISE)

/** Faces for a region: one list, or packs by franchise (D76, D81). A biome without its own pack, or whose pack is
 * missing, draws from the mixed pool: a few faces from every pack there is. */
export type CastPacks = readonly RpgCastMember[] | Partial<Record<Franchise, readonly RpgCastMember[]>>
function facesFor(cast: CastPacks, biome: Biome): readonly RpgCastMember[] {
  if (Array.isArray(cast)) return cast as readonly RpgCastMember[]
  const packs = cast as Partial<Record<Franchise, readonly RpgCastMember[]>>
  const franchise = biomeFranchise(biome)
  const own = franchise ? packs[franchise] : undefined
  if (own && own.length > 0) return own
  return FRANCHISES.flatMap((f) => poolOf(packs[f] ?? []))
}

/** A region as a small chapter for the battle rules: a start camp, then its twelve stages in a line. */
export function regionChapter(region: WorldRegion, castPacks: CastPacks, tier = 1): RpgCampaignChapter {
  const biome = biomeById(region.biome)
  const cast = facesFor(castPacks, region.biome)
  const plan = stagePlan(biome, region.id)
  const reach = rpgChapterReach(Math.floor((region.level - 1) / WORLD_LEVELS) * WORLD_LEVELS + 1)
  const ids = Array.from({ length: WORLD_STAGES }, (_, i) => `${region.id}-s${i + 1}`)
  const nodes: RpgMapNode[] = [{ id: 'start', row: 0, col: 2, kind: 'camp', level: region.level, stage: 0, name: region.name, element: null, note: null, enemies: [], exits: [ids[0]!] }]
  plan.forEach((p, i) => {
    const id = ids[i]!
    const kind = i === WORLD_STAGES - 1 ? 'boss' : i === WORLD_STAGES - 2 ? 'sub-boss' : 'fight'
    const level = stageLevel(region, i + 1)
    const [enemies, ...waves] = stageWaves(level, biome, id, kind, p, cast, reach)
    nodes.push({ id, row: i + 1, col: 2, kind, level, stage: 0,
      name: kind === 'boss' ? `${biome.name} boss` : kind === 'sub-boss' ? 'Elite' : FORMATION[p.formation].name,
      element: p.signature[0] ?? null, note: p.signature.length > 1 ? p.signature.join(' + ') : null, enemies: enemies!,
      ...(waves.length ? { waves } : {}), exits: ids[i + 1] ? [ids[i + 1]!] : [] })
  })
  return { id: region.id, order: 0, tier, title: `${region.name} · Lv ${region.level}–${region.levelTop}`, levelStart: region.level, rows: WORLD_STAGES + 1, nodes }
}

/** A stage's foes, wave by wave. A pair signature makes dual-element foes (W3): each carries both elements, the lead
 * one alternating by slot. Faces never repeat within a stage. */
function stageWaves(level: number, biome: BiomeDef, stageId: string, kind: 'fight' | 'sub-boss' | 'boss', plan: StagePlan,
  cast: readonly RpgCastMember[], reach: number): BattleEnemy[][] {
  const used = new Set<string>()
  // A pack with elements shows a face of the foe's own element when it has one.
  const face = (slot: number, element: RpgElement): RpgCastMember => {
    const matching = cast.filter((m) => m.element === element)
    const pool = matching.length > 0 ? matching : cast
    const offset = hash(`${stageId}:${slot}:cast`)
    for (let i = 0; i < pool.length; i++) {
      const m = pool[(offset + i) % pool.length]!
      if (!used.has(m.id) || used.size >= pool.length) { used.add(m.id); return m }
    }
    return pool[offset % pool.length]!
  }
  const weaknesses = (signature: readonly RpgElement[], slot: number, rank: EnemyRank): BattleWeaknesses => {
    const answers = signatureWeaknesses(signature)
    const key = `${stageId}:${slot}`
    const weapons = [...RPG_WEAPON_KINDS].sort((a, b) => hash(`${key}:${a}`) - hash(`${key}:${b}`))
    // Light+dark answers to no element: those foes break on weapons alone (D66).
    const w = answers.length === 0 ? 3 : rank === 'regular' ? 2 : rank === 'sub-boss' ? 2 : 1
    const extra = rank === 'regular' && answers.length < 2 && answers.length > 0
      ? [pick(RPG_ELEMENTS.filter((e) => !signature.includes(e) && !answers.includes(e)), `${key}:el`)] : []
    return { weapons: weapons.slice(0, w), elements: [...answers, ...extra] }
  }
  const role = (slot: number): RpgFoeRole => pick(biome.roles, `${stageId}:${slot}:role`)
  const above = level - 1
  let next = 0
  const foe = (signature: readonly RpgElement[], rank: EnemyRank, r: RpgFoeRole, hp: number, shield: number, twice = false): BattleEnemy => {
    const slot = next++
    const element = signature[slot % signature.length]!
    const element2 = signature.length > 1 ? signature[(slot + 1) % signature.length] : undefined
    const base = rpgFoe({ id: `foe${slot + 1}`, castId: face(slot, element).id, element, ...(element2 && element2 !== element ? { element2 } : {}),
      ...(twice ? { twice } : {}), role: r, rank, level, shield, weaknesses: weaknesses(signature, slot, rank), ...(rank === 'regular' ? {} : { reach }) })
    const tough = rank === 'boss' ? WORLD_TUNING.bossHp : 1 + (rank === 'sub-boss' ? WORLD_TUNING.eliteHpPerLevel : WORLD_TUNING.regularHpPerLevel) * above
    const offense = 1 + (rank === 'regular' ? WORLD_TUNING.regularOffensePerLevel : rank === 'sub-boss' ? WORLD_TUNING.eliteOffensePerLevel : WORLD_TUNING.bossOffensePerLevel) * above
    return { ...base, stats: { ...base.stats, hp: Math.max(1, Math.round(base.stats.hp * hp * tough)),
      atk: Math.round(base.stats.atk * offense), matk: Math.round(base.stats.matk * offense) } }
  }
  /** One wave of regular foes in a formation, at a share of its HP. */
  const formation = (f: Formation, signature: readonly RpgElement[], share: number, wave: number): BattleEnemy[] => {
    const shape = FORMATION[f]
    const [lo, hi] = shape.count
    const count = lo + (hash(`${stageId}:${wave}:count`) % (hi - lo + 1))
    if (f === 'escort') {
      return [foe(signature, 'regular', 'striker', ESCORT.captain * share, ESCORT.captainShield),
        ...Array.from({ length: count - 1 }, () => foe(signature, 'regular', 'guard', ESCORT.guard * share, shape.shield))]
    }
    const first = next
    return Array.from({ length: count }, (_, k) => foe(signature, 'regular', role(first + k), (shape.budget / count) * share, shape.shield, f === 'solo'))
  }
  const sigs = biome.signatures
  const after = (signature: readonly RpgElement[]) => sigs[(sigs.indexOf(signature) + 1) % sigs.length]!
  if (kind === 'sub-boss') return [[foe(plan.signature, 'sub-boss', 'captain', 1, RPG_FOE_TUNING.subBossShield, true)]]
  if (kind === 'boss') {
    // Two lighter waves of the biome's other signatures lead to the champion, her guards and the biome's main pair.
    const share = WAVE_HP[BOSS_WAVES]!
    return [formation(biome.formations[0]!, after(plan.signature), share, 0), formation('trio', after(after(plan.signature)), share, 1),
      [foe(plan.signature, 'boss', 'champion', 1, RPG_FOE_TUNING.bossShield), foe(plan.signature, 'regular', 'guard', 0.8, 2),
        foe(plan.signature, 'regular', 'guard', 0.8, 2)]]
  }
  const share = WAVE_HP[plan.waves] ?? 1
  const waves = [formation(plan.formation, plan.signature, share, 0)]
  if (plan.waves > 1) {
    const second = biome.formations.find((f) => f !== plan.formation) ?? 'trio'
    waves.push(formation(second, after(plan.signature), share, 1))
  }
  return waves
}

/** EXP and Laurels a stage in waves pays, over a one-wave stage (encounters.md); tokens stay as they are (D82). */
export const WAVE_PAY = 1.5
export const stagePay = (node: Pick<RpgMapNode, 'waves'>): number => (node.waves?.length ? WAVE_PAY : 1)

/** Finals' six fights together grant about one level; Laurels retain their usual rates. */
export const stageExpPay = (node: Pick<RpgMapNode, 'id' | 'waves'>): number =>
  stagePay(node) * (/^w[1-9]\d*-capital-r[1-3]-s[12]$/.test(node.id) ? 0.5 : 1)

/** The region-like chapter a stage belongs to: `w1-3-2-s5` → `w1-3-2`, `w1-capital-r2-s1` → `w1-capital`. */
export const stageRegionId = (stageId: string): string => stageId.replace(/(-capital)-r[1-3]-s[12]$/, '$1').replace(/-s\d+$/, '')
/** A stage's band: its continent's order. */
export const stageBand = (stageId: string): number => Number(/^w(\d+)-/.exec(stageId)?.[1] ?? 0)
