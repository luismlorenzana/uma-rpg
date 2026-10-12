// H15: a continent's three authored Finals routes, distinct from its region bosses and the Tier Finale.
import { rpgCampaignChapter, rpgFinalsNodeIds, type RpgCampaignChapter, type RpgCastMember, type RpgMapNode } from '../rpg/campaign/chapters'
import { RPG_FINALS_ROUTES, rpgFinals } from '../rpg/campaign/finals'
import { WORLD_LEVELS, type WorldContinent } from './world'

export const capitalId = (continentId: string): string => `${continentId}-capital`
export function capitalStageIds(continentId: string, route: number): { vanguard: string; champion: string } {
  if (!Number.isInteger(route) || route < 1 || route > RPG_FINALS_ROUTES) throw new RangeError('Bad Finals route')
  const id = `${capitalId(continentId)}-r${route}`
  return { vanguard: `${id}-s1`, champion: `${id}-s2` }
}

/** Reuse the authored chapter foes, elements, escorts, weaknesses and tuning; only the world layout and ids change.
 * `cast` is the private PriConne pack. Each route opens independently from start; its champion needs its vanguard.
 * Stage 0 deliberately pays the vanguard as a sub-boss, not the legacy chapter's vanguard reward kind. */
export function capitalChapter(continent: WorldContinent, cast: readonly RpgCastMember[]): RpgCampaignChapter {
  const id = capitalId(continent.id), finals = rpgFinals(continent.order)
  const chapter = rpgCampaignChapter({ scenarioId: id, name: continent.name, order: continent.order }, cast)
  const level = continent.levelStart + WORLD_LEVELS - 1
  const nodes: RpgMapNode[] = []
  finals.routes.forEach((route, i) => {
    const old = rpgFinalsNodeIds(i + 1), ids = capitalStageIds(continent.id, i + 1)
    const vanguard = chapter.nodes.find((n) => n.id === old.vanguard)!
    const champion = chapter.nodes.find((n) => n.id === old.champion)!
    nodes.push({ ...vanguard, id: ids.vanguard, row: 1, stage: 0, name: `${route.name} · Vanguard`, note: null,
      exits: [ids.champion] })
    nodes.push({ ...champion, id: ids.champion, row: 2, stage: 0, name: `${route.name} · Champion`, note: null, exits: [] })
  })
  const start: RpgMapNode = { id: 'start', row: 0, col: 2, kind: 'camp', level, stage: 0,
    name: 'Capital', element: null, note: null, enemies: [], exits: nodes.filter((n) => n.kind === 'sub-boss').map((n) => n.id) }
  return { ...chapter, id, levelStart: level, rows: 3, nodes: [start, ...nodes] }
}
