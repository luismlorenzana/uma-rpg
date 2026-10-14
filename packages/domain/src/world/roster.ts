// The enemy roster (D135, docs/design/enemy-roster.md): three franchises' units, each in one of four tiers, from the
// private enemy list the game loads (names and art never live in code). Which franchise a region shows goes by level:
// PriConne the first continent, then Azur Lane and NIKKE alternating every five levels, about in proportion to their
// rosters. A stage draws each foe's face from its franchise's units of the tier its slot calls for, never repeating one
// within the stage.
import type { RpgCastMember } from '../rpg/campaign/chapters'

export type Franchise = 'priconne' | 'azurlane' | 'nikke'
export const FRANCHISES: readonly Franchise[] = ['priconne', 'azurlane', 'nikke']
/** A unit's role (the owner's classification): regular fights, assistants to sub-bosses, sub-bosses, bosses. */
export type EnemyTier = 'regular' | 'key' | 'subboss' | 'boss'
export const ENEMY_TIERS: readonly EnemyTier[] = ['regular', 'key', 'subboss', 'boss']
export const isFranchise = (v: unknown): v is Franchise => FRANCHISES.includes(v as Franchise)
export const isEnemyTier = (v: unknown): v is EnemyTier => ENEMY_TIERS.includes(v as EnemyTier)

/** A unit as the rules see it. A member without a franchise or tier (a test's plain list) is drawn only as a fallback. */
export interface RosterMember extends RpgCastMember { franchise?: Franchise; tier?: EnemyTier }
export type EnemyRoster = readonly RosterMember[]

/**
 * A region's franchise, by its continent and half (rows 0–4 its first five levels, rows 5–9 its last five). PriConne
 * holds continent 1, Azur Lane continent 5; between them Azur Lane takes each first half and NIKKE each second: 40, 100
 * and 60 regions for 180, 344 and 230 units. Continents past the fifth (later tiers) keep the Azur Lane–NIKKE beat.
 */
export function bandFranchise(continentOrder: number, row: number): Franchise {
  if (continentOrder === 1) return 'priconne'
  if (continentOrder === 5) return 'azurlane'
  return row < 5 ? 'azurlane' : 'nikke'
}

/** A capital's Finals franchise: PriConne first, then Azur Lane and NIKKE in turn. */
export const capitalFranchise = (continentOrder: number): Franchise =>
  continentOrder === 1 ? 'priconne' : continentOrder % 2 === 0 ? 'azurlane' : 'nikke'

function hash(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Picks faces for one stage: `face(tier, slot)` returns a unit of the stage's franchise and that tier, by the slot's
 * hash over the units sorted by id (so the list's order doesn't matter), skipping any the stage already shows while
 * others remain. An empty tier borrows, in order: the same tier from any franchise, any tier of the franchise, anyone.
 * Null when the roster is empty.
 */
export function stageFaces(roster: EnemyRoster, franchise: Franchise, stageId: string): (tier: EnemyTier, slot: number) => RosterMember | null {
  const sorted = [...roster].sort((a, b) => a.id.localeCompare(b.id))
  const pools = new Map<EnemyTier, RosterMember[]>()
  const poolOf = (tier: EnemyTier): RosterMember[] => {
    let pool = pools.get(tier)
    if (!pool) {
      const own = sorted.filter((m) => m.franchise === franchise && m.tier === tier)
      pool = own.length ? own : sorted.filter((m) => m.tier === tier)
      if (!pool.length) pool = sorted.filter((m) => m.franchise === franchise)
      if (!pool.length) pool = sorted
      pools.set(tier, pool)
    }
    return pool
  }
  const used = new Set<string>()
  return (tier, slot) => {
    const pool = poolOf(tier)
    if (!pool.length) return null
    const offset = hash(`${stageId}:${slot}:face`)
    for (let i = 0; i < pool.length; i++) {
      const m = pool[(offset + i) % pool.length]!
      if (!used.has(m.id)) { used.add(m.id); return m }
    }
    return pool[offset % pool.length]!
  }
}
