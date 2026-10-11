// The world map (D66, D71; docs/design/world/): a tier's five continents, one per scenario and ten levels each, of 40
// biome regions at fixed levels (four per level) and five Springs; each region a path of twelve stages. Generated from
// the continent's release order with fixed seeds, so ids and contents never move under a save. A region is handed to the
// battle rules as a small chapter (a start camp and its stages in a line), so fights reuse the chapter machinery.
import type { BattleEnemy, BattleWeaknesses, EnemyRank } from '../rpg/battle/types'
import { rpgChapterReach, type RpgCampaignChapter, type RpgCastMember, type RpgMapNode } from '../rpg/campaign/chapters'
import { RPG_FOE_TUNING, rpgFoe, type RpgFoeRole } from '../rpg/campaign/enemies'
import { RPG_ELEMENTS, RPG_WEAPON_KINDS, type RpgElement } from '../rpg/kinds'
import { BIOMES, biomeById, biomeFranchise, signatureWeaknesses, type Biome, type BiomeDef, type Formation, type Franchise } from './biomes'

export const WORLD_LEVELS = 10
export const WORLD_REGIONS_PER_LEVEL = 4
export const WORLD_STAGES = 12
export const WORLD_SPRINGS = 5
/** A Spring refills the active party's MP, then recharges for two hours (D66). */
export const SPRING_RECHARGE_MS = 2 * 3600 * 1000

export interface WorldRegion { id: string; continentId: string; biome: Biome; name: string; level: number; row: number; col: number }
export interface WorldSpring { id: string; continentId: string; /** Sits above this level row (0 is the continent's first level). */ row: number }
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
const LEAN: readonly Biome[] = ['forest', 'coast', 'desert', 'tundra', 'moor']
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
    const row = Math.floor(i / WORLD_REGIONS_PER_LEVEL)
    const col = i % WORLD_REGIONS_PER_LEVEL
    const n = seen.get(biome) ?? 0
    seen.set(biome, n + 1)
    return { id: `${id}-${row + 1}-${col + 1}`, continentId: id, biome, name: `${biomeById(biome).name}${ROMAN[n] ?? ''}`, level: levelStart + row, row, col }
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
  bossHp: 0.55, bossOffensePerLevel: 0.005,
} as const

const FORMATION: Readonly<Record<Formation, { count: number; hp: number; shield: number; name: string }>> = {
  solo: { count: 1, hp: 3.5, shield: 6, name: 'Lone elite' },
  duo: { count: 2, hp: 1.8, shield: 4, name: 'Pair' },
  trio: { count: 3, hp: 1.2, shield: 3, name: 'Trio' },
  squad: { count: 4, hp: 1, shield: 2, name: 'Squad' },
  // Five until the engine fights eight (W3); smaller each, so the budget holds.
  swarm: { count: 5, hp: 0.7, shield: 1, name: 'Swarm' },
  escort: { count: 3, hp: 0.8, shield: 2, name: 'Escort' },
}

/**
 * What each of a region's twelve stages is: ten regular stages, an elite, the boss. Stages 1–2 teach (pairs of the
 * first two signatures), 7 is a crowd, 10 the biome's own formation; the rest walk the biome's formation × signature
 * combinations in a seeded order, so a region repeats one only when its biome runs out.
 */
export function stagePlan(biome: BiomeDef, regionId: string): { formation: Formation; signature: readonly RpgElement[] }[] {
  const sigs = biome.signatures
  const combos = shuffle(biome.formations.flatMap((formation) => sigs.map((signature) => ({ formation, signature }))), `${regionId}:combos`)
  const used = new Set<number>()
  const plan: { formation: Formation; signature: readonly RpgElement[] }[] = []
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
    if (n <= 2) plan.push({ formation: 'duo', signature: sigs[(n - 1) % sigs.length]! })
    else if (n === 7) {
      const previous = plan[plan.length - 1]!.signature
      plan.push({ formation: biome.formations.includes('swarm') ? 'swarm' : 'squad', signature: sigs.find((g) => g !== previous) ?? sigs[0]! })
    }
    else if (n === 10) plan.push({ formation: biome.formations[0]!, signature: sigs[0]! })
    else plan.push(take())
  }
  plan.push({ formation: 'solo', signature: sigs[sigs.length - 1]! })
  plan.push({ formation: 'escort', signature: sigs[0]! })
  return plan
}

/** Faces for a region: one list, or packs by franchise (D76); a missing or empty pack falls back to PriConne's. */
export type CastPacks = readonly RpgCastMember[] | Partial<Record<Franchise, readonly RpgCastMember[]>>
function facesFor(cast: CastPacks, biome: Biome): readonly RpgCastMember[] {
  if (Array.isArray(cast)) return cast as readonly RpgCastMember[]
  const packs = cast as Partial<Record<Franchise, readonly RpgCastMember[]>>
  const own = packs[biomeFranchise(biome)]
  return own && own.length > 0 ? own : packs.priconne ?? []
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
    const enemies = stageEnemies(region, biome, id, kind, p.formation, p.signature, cast, reach)
    nodes.push({ id, row: i + 1, col: 2, kind, level: region.level, stage: 0,
      name: kind === 'boss' ? `${biome.name} boss` : kind === 'sub-boss' ? 'Elite' : FORMATION[p.formation].name,
      element: p.signature[0] ?? null, note: p.signature.length > 1 ? p.signature.join(' + ') : null, enemies, exits: ids[i + 1] ? [ids[i + 1]!] : [] })
  })
  return { id: region.id, order: 0, tier, title: `${region.name} · Lv ${region.level}`, levelStart: region.level, rows: WORLD_STAGES + 1, nodes }
}

function stageEnemies(region: WorldRegion, biome: BiomeDef, stageId: string, kind: 'fight' | 'sub-boss' | 'boss', formation: Formation,
  signature: readonly RpgElement[], cast: readonly RpgCastMember[], reach: number): BattleEnemy[] {
  const used = new Set<string>()
  // A franchise with elements (P&D) shows a monster of the foe's own element when it has one.
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
  const answers = signatureWeaknesses(signature)
  const weaknesses = (slot: number, rank: EnemyRank): BattleWeaknesses => {
    const key = `${stageId}:${slot}`
    const weapons = [...RPG_WEAPON_KINDS].sort((a, b) => hash(`${key}:${a}`) - hash(`${key}:${b}`))
    // Light+dark answers to no element: those foes break on weapons alone (D66).
    const w = answers.length === 0 ? 3 : rank === 'regular' ? 2 : rank === 'sub-boss' ? 2 : 1
    const extra = rank === 'regular' && answers.length < 2 && answers.length > 0
      ? [pick(RPG_ELEMENTS.filter((e) => !signature.includes(e) && !answers.includes(e)), `${key}:el`)] : []
    return { weapons: weapons.slice(0, w), elements: [...answers, ...extra] }
  }
  const role = (slot: number): RpgFoeRole => pick(biome.roles, `${stageId}:${slot}:role`)
  const above = region.level - 1
  const foe = (slot: number, rank: EnemyRank, r: RpgFoeRole, hp: number, shield: number): BattleEnemy => {
    const element = signature[slot % signature.length]!
    const base = rpgFoe({ id: `foe${slot + 1}`, castId: face(slot, element).id, element, role: r, rank, level: region.level, shield,
      weaknesses: weaknesses(slot, rank), ...(rank === 'regular' ? {} : { reach }) })
    const tough = rank === 'boss' ? WORLD_TUNING.bossHp : 1 + (rank === 'sub-boss' ? WORLD_TUNING.eliteHpPerLevel : WORLD_TUNING.regularHpPerLevel) * above
    const offense = 1 + (rank === 'regular' ? WORLD_TUNING.regularOffensePerLevel : rank === 'sub-boss' ? WORLD_TUNING.eliteOffensePerLevel : WORLD_TUNING.bossOffensePerLevel) * above
    return { ...base, stats: { ...base.stats, hp: Math.max(1, Math.round(base.stats.hp * hp * tough)),
      atk: Math.round(base.stats.atk * offense), matk: Math.round(base.stats.matk * offense) } }
  }
  if (kind === 'boss') {
    return [foe(0, 'boss', 'champion', 1, RPG_FOE_TUNING.bossShield), foe(1, 'regular', 'guard', 0.8, 2), foe(2, 'regular', 'guard', 0.8, 2)]
  }
  if (kind === 'sub-boss') return [foe(0, 'sub-boss', 'captain', 1, RPG_FOE_TUNING.subBossShield)]
  const f = FORMATION[formation]
  if (formation === 'escort') return [foe(0, 'regular', 'striker', 2.5, 5), foe(1, 'regular', 'guard', f.hp, f.shield), foe(2, 'regular', 'guard', f.hp, f.shield)]
  return Array.from({ length: f.count }, (_, slot) => foe(slot, 'regular', role(slot), f.hp, f.shield))
}

/** The region a stage id belongs to (`w1-3-2-s5` → `w1-3-2`). */
export const stageRegionId = (stageId: string): string => stageId.replace(/-s\d+$/, '')
/** A stage's band: its continent's order. */
export const stageBand = (stageId: string): number => Number(/^w(\d+)-/.exec(stageId)?.[1] ?? 0)
