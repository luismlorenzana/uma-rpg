// What the fight screen plays (H50): the world map and the Rift share `FightScreen`, each handing it a source with its
// open fight, its header, its backdrop, how a foe reads on the stage, and how to act and leave. The world map's source is
// built here (`campaignFightSource`), so its fights play exactly as before; the Rift builds its own with `faceRank`.
import { openFightOf, type BattleAction, type BattleEnemy, type BattleInput, type BattleStep, type Biome, type EnemyRank, type EnemyTier,
  type FightResult, type RpgCampaignChapter, type TierWorld, type WorldRegion } from '@rpg/domain'
import { fightAction, leaveFight } from '../save/game'

export interface FightSource<R> {
  /** The open fight, or null. */
  battle: { battleId: string; input: BattleInput; actions: readonly BattleAction[] } | null
  /** The header's small line and title. */
  title: string
  name: string
  /** The stage's backdrop. */
  biome: Biome
  /** Where Back and the menu return: "Back to the map", "Back to the Rift". */
  back: string
  /** How a foe reads: her size on the stage and her tag in lists. The world map's is her rank. */
  rank: (enemy: BattleEnemy) => EnemyRank
  act: (action: BattleAction) => Promise<{ step: BattleStep; result: R | null }>
  leave: () => Promise<void>
}

/** A foe as her rank says (the world map). */
export const byRank = (enemy: Pick<BattleEnemy, 'rank'>): EnemyRank => enemy.rank

/**
 * A Rift foe reads as her face, not her rank (D173): the Horde's leaders are regular rank so its HP budget works, but a
 * boss- or sub-boss-faced foe still stands, and is tagged, as one. Her face's tier comes from the roster; anything else
 * (a key or regular face, or a face the roster lacks) falls back to her rank.
 */
export function faceRank(roster: ReadonlyMap<string, { tier?: EnemyTier }>): (enemy: Pick<BattleEnemy, 'castId' | 'rank'>) => EnemyRank {
  return (enemy) => {
    const tier = roster.get(enemy.castId)?.tier
    return tier === 'boss' ? 'boss' : tier === 'subboss' ? 'sub-boss' : enemy.rank
  }
}

/** The world map's open fight in a region or capital chapter: its title, the stage's name and the region's biome. */
export function campaignFightSource(world: TierWorld | null, chapter: RpgCampaignChapter, region: WorldRegion | null): FightSource<FightResult> {
  const battle = world ? openFightOf(world)?.battle ?? null : null
  const node = battle ? chapter.nodes.find((n) => n.id === battle.nodeId) : undefined
  return {
    battle, title: chapter.title, name: node?.name ?? 'Fight', biome: region?.biome ?? 'ruins', back: 'Back to the map', rank: byRank,
    act: (action) => fightAction(chapter, action), leave: leaveFight,
  }
}
