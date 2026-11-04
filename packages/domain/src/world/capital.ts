// H15: a continent's three authored Finals routes, distinct from its region bosses and the Tier Finale. Capital runs
// (D293, H159): a run's sixteen fights, four lanes of three generals and a final boss, one lane a route.
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { rpgCampaignChapter, rpgFinalsFight, rpgFinalsNodeIds, type RpgCampaignChapter, type RpgMapNode } from '../rpg/campaign/chapters'
import { RPG_FINALS_ROUTES, rpgFinals, rpgMapRoutes } from '../rpg/campaign/finals'
import { CAPITAL_RUN_GENERALS, capitalRunNodeId, capitalRunOf } from './capital-run-id'
import { capitalFranchise, stageFaces, type EnemyRoster } from './roster'
import { WORLD_LEVELS, type WorldContinent } from './world'

export const capitalId = (continentId: string): string => `${continentId}-capital`
export function capitalStageIds(continentId: string, route: number): { vanguard: string; champion: string } {
  if (!Number.isInteger(route) || route < 1 || route > RPG_FINALS_ROUTES) throw new RangeError('Bad Finals route')
  const id = `${capitalId(continentId)}-r${route}`
  return { vanguard: `${id}-s1`, champion: `${id}-s2` }
}

/** Reuse the authored chapter foes, elements, escorts, weaknesses and tuning; only the world layout, ids and faces change.
 * Faces come from the capital's franchise (D135): a vanguard is a Sub-boss with Key enemy minions, a champion a Boss
 * with Sub-boss minions. Each route opens independently from start; its champion needs its vanguard.
 * Stage 0 deliberately pays the vanguard as a sub-boss, not the legacy chapter's vanguard reward kind. Its foes are an
 * engine's generation's, as the chapter's (D202): from v16 her twins and Tier 1's shields; the live one by default. */
export function capitalChapter(continent: WorldContinent, roster: EnemyRoster, engine: number = BATTLE_ENGINE_VERSION): RpgCampaignChapter {
  const id = capitalId(continent.id), finals = rpgFinals(continent.order)
  // The legacy generator wants a cast for its own names; the faces are replaced below.
  const chapter = rpgCampaignChapter({ scenarioId: id, name: continent.name, order: continent.order }, [{ id: '', name: '' }], engine)
  const franchise = capitalFranchise(continent.order)
  const reface = (node: RpgMapNode): RpgMapNode => {
    const face = stageFaces(roster, franchise, node.id)
    const [lead, minion] = node.kind === 'boss' ? (['boss', 'subboss'] as const) : (['subboss', 'key'] as const)
    return { ...node, enemies: node.enemies.map((e, slot) => ({ ...e, castId: face(slot === 0 ? lead : minion, slot)?.id ?? '' })) }
  }
  const level = continent.levelStart + WORLD_LEVELS - 1
  const nodes: RpgMapNode[] = []
  rpgMapRoutes(finals).forEach((route, i) => {
    const old = rpgFinalsNodeIds(i + 1), ids = capitalStageIds(continent.id, i + 1)
    const vanguard = chapter.nodes.find((n) => n.id === old.vanguard)!
    const champion = chapter.nodes.find((n) => n.id === old.champion)!
    nodes.push(reface({ ...vanguard, id: ids.vanguard, row: 1, stage: 0, name: `${route.name} · Vanguard`, note: null,
      exits: [ids.champion] }))
    nodes.push(reface({ ...champion, id: ids.champion, row: 2, stage: 0, name: `${route.name} · Champion`, note: null, exits: [] }))
  })
  const start: RpgMapNode = { id: 'start', row: 0, col: 2, kind: 'camp', level, stage: 0,
    name: 'Capital', element: null, note: null, enemies: [], exits: nodes.filter((n) => n.kind === 'sub-boss').map((n) => n.id) }
  return { ...chapter, id, levelStart: level, rows: 3, nodes: [start, ...nodes] }
}

const GENERAL_NUMERALS = ['I', 'II', 'III'] as const

/**
 * A capital run's sixteen fights (D293, H159; capitals.md §3–§5), all at the capital's level: four lanes, each one of the
 * scenario's four routes, of three generals and a final boss.
 * - A general is the route's vanguard shape, a Sub-boss with Key minions. General I and III lead with the vanguard's
 *   element and escorts, General II with the champion's.
 * - A final boss is two waves: the champion's two escorts and a regular of the vanguard's element (her first escort's
 *   role), then the champion's shape, a Boss with Sub-boss minions.
 * - The foes are seeded by the capital and the lane, so every run of a capital plays the same; the faces are seeded by the
 *   node id, so each run looks new (CA9).
 * - Every fight opens from the start camp: the order (generals in turn, the Final after every lane's third) is the rules'
 *   (H160).
 */
export function capitalRunChapter(continent: WorldContinent, runId: string, roster: EnemyRoster, engine: number = BATTLE_ENGINE_VERSION): RpgCampaignChapter {
  const run = capitalRunOf(runId)
  if (!run || run.continentId !== continent.id) throw new RangeError(`${runId} isn't a run of ${continent.id}`)
  const level = continent.levelStart + WORLD_LEVELS - 1
  const franchise = capitalFranchise(continent.order)
  const nodes: RpgMapNode[] = []
  rpgFinals(continent.order).routes.forEach((route, i) => {
    const lane = i + 1, seed = `${capitalId(continent.id)}-l${lane}`
    for (let k = 1; k <= CAPITAL_RUN_GENERALS; k++) {
      const id = capitalRunNodeId(runId, lane, k as 1 | 2 | 3), foe = k === 2 ? route.champion : route.vanguard
      const face = stageFaces(roster, franchise, id)
      const { enemies } = rpgFinalsFight(`${seed}-g${k}`, continent.order, { kind: 'sub-boss', level, foe }, engine)
      nodes.push({ id, row: k, col: i, kind: 'sub-boss', level, stage: 0, name: `${route.name} · General ${GENERAL_NUMERALS[k - 1]}`,
        element: foe.element, note: route.line, exits: [],
        enemies: enemies.map((e, slot) => ({ ...e, castId: face(slot === 0 ? 'subboss' : 'key', slot)?.id ?? '' })) })
    }
    const id = capitalRunNodeId(runId, lane, 'final'), face = stageFaces(roster, franchise, id)
    const lead = [...route.champion.escorts, [route.vanguard.escorts[0][0], route.vanguard.element] as const]
    const fight = rpgFinalsFight(`${seed}-final`, continent.order, { kind: 'boss', level, foe: route.champion, lead }, engine)
    const boss = fight.waves![0]!
    nodes.push({ id, row: CAPITAL_RUN_GENERALS + 1, col: i, kind: 'boss', level, stage: 0, name: `${route.name} · Final`,
      element: route.champion.element, note: route.line, exits: [],
      enemies: fight.enemies.map((e, slot) => ({ ...e, castId: face('key', slot)?.id ?? '' })),
      waves: [boss.map((e, j) => ({ ...e, castId: face(j === 0 ? 'boss' : 'subboss', lead.length + j)?.id ?? '' }))] })
  })
  const start: RpgMapNode = { id: 'start', row: 0, col: 2, kind: 'camp', level, stage: 0, name: 'Capital', element: null, note: null,
    enemies: [], exits: nodes.map((n) => n.id) }
  return { id: runId, order: continent.order, tier: Math.ceil(continent.order / 5), title: `${continent.name} · Run ${run.n}`,
    levelStart: level, rows: CAPITAL_RUN_GENERALS + 2, nodes: [start, ...nodes] }
}
