// Drills (collections.md §6.4, D283, H154): five fights a tier at its Lv 10, 20, 30, 40 and 50, paying Training Logs. Each
// is a real stage, its continent's top row's first region's stage 10 (the biome's own formation on its first signature,
// at the region's top level, which is the continent's), copied under its own id so a Drill never clears a map stage. Pure:
// no save import. Its ids and day are `rpg/drill-id.ts`, in the main bundle.
import { BATTLE_ENGINE_VERSION } from './battle/caps'
import type { RpgCampaignChapter, RpgMapNode } from './campaign/chapters'
import { DRILL_COUNT, DRILL_NUMERALS, drillChapterId, drillNodeId } from './drill-id'
import { rpgExpToNext } from './rules'
import type { EnemyRoster } from '../world/roster'
import { regionChapter, worldContinent, WORLD_ROWS } from '../world/world'

export * from './drill-id'

/** A tier's five Drills as one chapter: a camp whose exits reach every Drill, so each can be fought in any order. */
export function drillChapter(tier: number, roster: EnemyRoster, engine: number = BATTLE_ENGINE_VERSION): RpgCampaignChapter {
  const ids = Array.from({ length: DRILL_COUNT }, (_, i) => drillNodeId(tier, i + 1))
  const drills: RpgMapNode[] = ids.map((id, i) => {
    const continent = worldContinent({ name: '', order: 5 * (tier - 1) + i + 1 })
    const region = continent.regions.find((r) => r.row === WORLD_ROWS - 1 && r.col === 0)!
    const stage = regionChapter(region, roster, engine).nodes.find((n) => n.id === `${region.id}-s10`)!
    return { ...stage, id, row: 1, col: i, name: `Drill ${DRILL_NUMERALS[i]}`, exits: [] }
  })
  const start: RpgMapNode = { id: 'start', row: 0, col: 2, kind: 'camp', level: drills[0]!.level, stage: 0, name: 'Drills', element: null, note: null, enemies: [], exits: ids }
  return { id: drillChapterId(tier), order: 0, tier, title: 'Drills', levelStart: drills[0]!.level, rows: 2, nodes: [start, ...drills] }
}

/** One Training Log's Uma EXP for an Uma at `level`: a third of her next level, so three Logs make one (CO22). */
export const logExp = (level: number): number => Math.ceil(rpgExpToNext(level) / 3)
