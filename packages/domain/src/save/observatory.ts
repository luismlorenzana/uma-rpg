// The Observatory over the save (S6, design §10, D58, D144): setting a Star Gem opens the node of its own grade on her
// map, once every lower node of its track is open (D119), and uses the gem up; her active nodes (5 + level/2 at once) add
// points to her stats in every fight. Extra Stats v3 (R2, dark until H82; H76, D213): on a v3 map (`StarMap`) a jewel
// from the Warehouse opens its node, in order, at Uma Lv 5g − 4 (EP5, EP17), and every open node counts (EP6).
import { gemIdentity, gemNodes, nodeGrade, starPoints } from '../economy/stars'
import { activeNodeSlots } from '../economy/pacing'
import type { Points } from '../economy/bonus'
import { isMapNode, mapNodeGate, MAP_NODES, nodeBody, nodeJewel, nodeNumeral, type StarMap } from '../economy/planet'
import { madeName } from '../items/made'
import { madeIdentity } from '../items/made-id'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { isStarMap, starsV1, type OwnedUma, type Save, type TierWorld } from './save'

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/** Why she can't set this gem now, or null: its node is open already, or a lower node of its track is still locked. */
export function gemBlock(uma: OwnedUma, gemId: string): string | null {
  const gem = gemIdentity(gemId)
  if (!gem) return 'Unknown gem'
  const unlocked = starsV1(uma).unlocked
  const next = gemNodes(gem).find((n) => !unlocked.includes(n))
  if (!next) return 'Already set'
  return nodeGrade(next) < gem.grade ? `Set the grade ${nodeGrade(next)} gem first` : null
}

/** The node this gem would open for her (its own grade's, D119), or null when she can't set it now. */
export function nodeFromGem(uma: OwnedUma, gemId: string): string | null {
  const gem = gemIdentity(gemId)
  if (!gem || gemBlock(uma, gemId)) return null
  const unlocked = starsV1(uma).unlocked
  return gemNodes(gem).find((n) => !unlocked.includes(n)) ?? null
}

/** She sets one gem: its node opens and, while she has a free active slot, switches on. A v3 map takes jewels instead. */
export function setGem(save: Save, outfitId: string, gemId: string, now: string, tier = TIER_ONE): { save: Save; node: string } {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'only owned Umas set gems')
  if (isStarMap(uma.stars)) throw new SaveRuleError('bad-job', STAR_GEMS_RETIRED)
  if ((world.gems[gemId] ?? 0) < 1) throw new SaveRuleError('no-items', 'none of that gem left')
  const block = gemBlock(uma, gemId)
  if (block) throw new SaveRuleError('bad-job', block)
  const node = nodeFromGem(uma, gemId)!
  const unlocked = [...uma.stars.unlocked, node]
  const active = uma.stars.active.length < activeNodeSlots(uma.level) ? [...uma.stars.active, node] : uma.stars.active
  const gems = { ...world.gems, [gemId]: world.gems[gemId]! - 1 }
  if (gems[gemId] === 0) delete gems[gemId]
  const next: TierWorld = { ...world, gems, umas: { ...world.umas, [outfitId]: { ...uma, stars: { unlocked, active } } } }
  return { save: withWorld(save, tier, next, now), node }
}

/** Sets her active nodes: unlocked ones only, at most 5 + ⌊level / 2⌋. Free to change outside a fight. A v3 map has no
 * active slots (EP6). */
export function setActiveNodes(save: Save, outfitId: string, active: readonly string[], now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'not unlocked')
  if (isStarMap(uma.stars)) throw new SaveRuleError('bad-job', STAR_GEMS_RETIRED)
  const stars = uma.stars
  if (new Set(active).size !== active.length || active.some((n) => !stars.unlocked.includes(n))) throw new SaveRuleError('bad-job', 'only unlocked nodes can be active')
  if (active.length > activeNodeSlots(uma.level)) throw new SaveRuleError('bad-count', `at most ${activeNodeSlots(uma.level)} active at Lv${uma.level}`)
  return withWorld(save, tier, { ...world, umas: { ...world.umas, [outfitId]: { ...uma, stars: { ...stars, active: [...active] } } } }, now)
}

/** Her Extra Stats points from active nodes (a v1 map's; a v3 map's are `mapPoints`, which read her class and template). */
export const extraStatPoints = (uma: OwnedUma): Points => starPoints(starsV1(uma).active)

// --- Extra Stats v3: jewels (R2, H76; EP5, EP17, EP22) -------------------------------------------------------------------

/** What a v1 map's Star Gem rules say on a v3 map, and a v3 rule on a v1 map. */
export const STAR_GEMS_RETIRED = 'Star Gems are retired'
export const NOT_GRADED = 'Not graded'
export const NONE_IN_WAREHOUSE = 'None in the Warehouse'
export const ALREADY_OPEN = 'Already open'

const isJewel = (id: string): boolean => {
  const line = madeIdentity(id)?.line
  return line === 'jewel-planet' || line === 'jewel-moon'
}

/**
 * Why this jewel can't open this node on her map now, or null (EP5, EP17): it must fit the node (a Planet Jewel n only
 * Planet n; a Moon Jewel n a moon's node n, and her moon's node of that jewel: II for `template:1`, IV for `template:2`),
 * the node must be closed, the node before it on its body open, and her level at its gate; then one in `stock`.
 */
export function jewelBlock(map: StarMap, jewelId: string, node: string, level: number, stock: Readonly<Record<string, number>>): string | null {
  if (!isJewel(jewelId)) return 'Not a jewel'
  if (!isMapNode(node)) return 'Unknown node'
  if (nodeJewel(node) !== jewelId) {
    // Its name's numeral is the node it opens on every body (EP §11.1): "Moon Jewel II" a node II.
    const name = madeName(jewelId)!, numeral = name.split(' ').at(-1)
    return madeIdentity(jewelId)!.line === 'jewel-planet' ? `A ${name} opens Planet ${numeral}` : `A ${name} opens a node ${numeral}`
  }
  if (map.open.includes(node)) return ALREADY_OPEN
  // In order: the first node below it on its body still closed names the jewel to set first.
  const before = Array.from({ length: nodeNumeral(node) - 1 }, (_, i) => `${nodeBody(node)}:${i + 1}`).find((id) => !map.open.includes(id))
  if (before) return `Set ${madeName(nodeJewel(before))} first`
  if (level < mapNodeGate(node)) return `Opens at Lv ${mapNodeGate(node)}`
  if ((stock[jewelId] ?? 0) < 1) return NONE_IN_WAREHOUSE
  return null
}

/** How many nodes a node's body has open: the Set list's "furthest behind" (EP §3.5). */
const openOn = (map: StarMap, node: string): number => map.open.filter((n) => nodeBody(n) === nodeBody(node)).length

/**
 * The nodes a jewel can open for her now (stock aside), in map order (the Planet, Prowess, Vigor, Guard, her moon), the
 * body furthest behind (fewest nodes open) first, as the Set list suggests it (EP §3.5); [] when none. A Planet Jewel has
 * one node at most; a Moon Jewel II or IV can also open her moon's.
 */
export function jewelNodes(map: StarMap, jewelId: string, level: number): string[] {
  const stock = { [jewelId]: 1 }
  const fits = MAP_NODES.filter((node) => jewelBlock(map, jewelId, node, level, stock) === null)
  return fits.map((node, i) => ({ node, i, behind: openOn(map, node) }))
    .sort((a, b) => a.behind - b.behind || a.i - b.i).map((x) => x.node)
}

/** She sets one jewel from the Warehouse (`world.items`) on a node of her v3 map: the count falls (a count at 0 leaves the
 * Warehouse) and the node opens, counting from the next fight (EP5, EP6). Refused with `jewelBlock`'s reason, and "Not
 * graded" for a v1 map. */
export function setJewel(save: Save, outfitId: string, jewelId: string, node: string, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'Not unlocked')
  if (!isStarMap(uma.stars)) throw new SaveRuleError('bad-job', NOT_GRADED)
  const block = jewelBlock(uma.stars, jewelId, node, uma.level, world.items)
  if (block) throw new SaveRuleError(block === NONE_IN_WAREHOUSE ? 'no-items' : 'bad-job', block)
  const items = { ...world.items, [jewelId]: world.items[jewelId]! - 1 }
  if (items[jewelId] === 0) delete items[jewelId]
  const stars: StarMap = { ...uma.stars, open: [...uma.stars.open, node] }
  return withWorld(save, tier, { ...world, items, umas: { ...world.umas, [outfitId]: { ...uma, stars } } }, now)
}
