// Extra Stats v3 (R2, D194, D208, D213; extra-stats-progression §2, §3, §6, §10, §15): the Planet and three moons, Prowess,
// Vigor and Guard, beside her moon, opened by jewels. Ids, grades, gates and points only, so the main bundle, the save's
// parse (H78) and the Observatory (H79) share them; the setter is `save/observatory.ts`' `setJewel`.
// - EP1, EP6: the Planet (5 nodes) and three moons (5 each), 20 nodes, every class the same; her moon's 2 beside. Every
//   open node counts: no active slots, no toggles.
// - EP2: the Planet gives +1, +2, +4, +6, +8 points to all six core stats (HP 5 a point), grades 1, 3, 5, 7, 9.
// - EP3, EP4: a moon node is worth its grade, +2 … +10 (grades 2 … 10): Guard to DEF and to M.DEF, Vigor to HP and to MP.
// - EP23: Prowess splits each node's points by her active class (ATK / M.ATK: Brawler 100/0, Mage 0/100, Spell Blade 70/30,
//   Summoner 30/70, Paladin 80/20, Cleric 20/80), the larger share rounded half up and the rest to the smaller.
// - EP5: a node opens with its jewel, in order, at Uma Lv 5g − 4 (Planet n on Lv 10n − 9, a moon's n on Lv 10n − 4).
// - EP7: values are Tier 1's × 1, × 1.8, × 2.6 (SB1's `tierScaled`), each node rounded half up; Limit start and evasion
//   don't scale. EP8: Speed and Limit stay off the shared map (only her Fleet and Gritty knacks reach them).
// - EP13: the core is rebuilt empty at every promotion (a fresh map in the new world). EP15: no new defensive values.
// - EP14 with UT10, her moon: `template:1` (Lv 16, Moon Jewel II) +4 points × tier to her knack's stat (Tireless HP,
//   Clever MP, Mighty DEF and M.DEF, Fleet 4 Speed points, Gritty 4 Limit points, the last two every tier);
//   `template:2` (Lv 36, Moon Jewel IV) +8 × tier to her calling channel's defense, DEF if physical, M.DEF if magical;
//   from v19 by her calling's root (CV21, H126): a Warrior DEF, a Mage M.DEF, an All-Rounder half each.
//   Both count in every class, outside the foe budget.
// - Classes v3 (CV7, H126): a Tier 0's Prowess splits by her slots instead, a third a slot to its channel.
// - EP16: the foes' build budget × the tier's multiplier is `rpg/campaign/enemies.ts`' `rpgFoeTierBudget`; the balance
//   party's on-curve map (the core her level opens) is `world/balance-party.ts`' `onCurveStars`.
// - EP17, EP22: Planet Jewel I–V (`jewel-planet-1`…`5`, grades 1, 3, 5, 7, 9) and Moon Jewel I–V (`jewel-moon-1`…`5`,
//   grades 2, 4, 6, 8, 10; any moon's node of its numeral, picked when set), H74's `items/made-id.ts` ids.
import { jewelId } from '../items/made-id'
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/caps'
import {
  isRpgTome, RPG_CLASS_ARMOR, RPG_TIER0_ROOT, rpgDefaultWeapons, rpgIsTier0, rpgThirdsSplit, type RpgClass, type RpgTier1Class, type RpgWeapon,
} from '../rpg/rules'
import { umaCalling, umaKnack, type CallingOutfit, type TemplateOutfit, type UmaCallingClass, type UmaKnack } from '../roster/template'
import { noPoints, type Points } from './bonus'
import { gradeGateLevel, tierScaled, type GearTier } from './grades'

/** Her Extra Stats map in save v28 (EP §15): the nodes open, and from R3 her weapon moons' settings (empty until then). */
export interface StarMap { open: string[]; moons: [] }
export const emptyStarMap = (): StarMap => ({ open: [], moons: [] })

/** The shared bodies in map order, then her moon. */
export const MAP_BODIES = ['planet', 'prowess', 'vigor', 'guard', 'template'] as const
export type MapBody = typeof MAP_BODIES[number]
/** The three moons, in map order (the Set list's order, EP §3.5). */
export const MAP_MOONS = ['prowess', 'vigor', 'guard'] as const
export type MapMoon = typeof MAP_MOONS[number]
const BODY_NODES: Readonly<Record<MapBody, number>> = { planet: 5, prowess: 5, vigor: 5, guard: 5, template: 2 }

/** Every node in map order: `planet:1`–`5`, `prowess:1`–`5`, `vigor:1`–`5`, `guard:1`–`5`, `template:1`–`2`. */
export const MAP_NODES: readonly string[] = MAP_BODIES.flatMap((body) => Array.from({ length: BODY_NODES[body] }, (_, i) => `${body}:${i + 1}`))
/** The core: the 20 shared nodes, every class the same (EP1, EP23). */
export const CORE_NODES: readonly string[] = MAP_NODES.filter((id) => !id.startsWith('template:'))
const NODE_SET = new Set(MAP_NODES)
export const isMapNode = (id: string): boolean => NODE_SET.has(id)
/** A node's body (`prowess` for `prowess:3`). */
export const nodeBody = (id: string): MapBody => id.slice(0, id.indexOf(':')) as MapBody
/** A node's numeral on its body (3 for `prowess:3`). */
export const nodeNumeral = (id: string): number => Number(id.slice(id.indexOf(':') + 1))

/** A node's grade: Planet n 2n − 1, a moon's n 2n, her moon's I 4 and II 8 (EP §3.2, §6.4). */
export function mapNodeGrade(id: string): number {
  const body = nodeBody(id), n = nodeNumeral(id)
  if (body === 'planet') return 2 * n - 1
  if (body === 'template') return 4 * n
  return 2 * n
}
/** The Uma level a node opens at: 5g − 4, the gear cadence (EP5). */
export const mapNodeGate = (id: string): number => gradeGateLevel(mapNodeGrade(id))
/** The jewel that opens a node: Planet n a Planet Jewel n, a moon's n a Moon Jewel n, her moon's I and II Moon Jewels II
 * and IV (EP17, §6.4). */
export function nodeJewel(id: string): string {
  const body = nodeBody(id), n = nodeNumeral(id)
  if (body === 'planet') return jewelId('planet', n)
  return jewelId('moon', body === 'template' ? 2 * n : n)
}

/** How many jewels open a node (D264): a Planet node three, a moon's node one, so every rank sets three jewels. */
export const nodeJewelCount = (id: string): number => (nodeBody(id) === 'planet' ? 3 : 1)
/** Her open nodes with her moon's, which take no jewel (D264): node I opens with the third moon's node II, node II with the
 * third moon's node IV. */
export function withHerMoon(open: readonly string[]): string[] {
  const next = [...open]
  for (const [id, n] of [['template:1', 2], ['template:2', 4]] as const) {
    if (!next.includes(id) && MAP_MOONS.every((moon) => next.includes(`${moon}:${n}`))) next.push(id)
  }
  return next
}

/** Tier 1's points a node: the Planet's I–V (EP2) and a moon's I–V (EP3). */
export const PLANET_T1 = [1, 2, 4, 6, 8] as const
export const MOON_T1 = [2, 4, 6, 8, 10] as const
/** Her moon's Tier 1 points: node I her knack's +4, node II her lead's +8 (UT10). */
export const TEMPLATE_T1 = [4, 8] as const
/** Fleet's and Gritty's node I: 4 points of Speed (2.4% evasion) or Limit (1.6 of the gauge) in every tier (EP7, UT10). */
export const KNACK_SHARE_POINTS = 4
/** Prowess's split (EP23): the percent of each node's points that goes to ATK, the rest to M.ATK. Classes v3's two new
 * hybrids mirror their pair (CV18: the Arms Summoner 70, the Tome Spellblade 30); a Tier 0 splits by her slots. */
export const PROWESS_SPLIT: Readonly<Record<RpgTier1Class, number>> = {
  brawler: 100, mage: 0, spellblade: 70, summoner: 30, paladin: 80, cleric: 20, armsummoner: 70, tomeblade: 30,
}

/** A node's points at a tier (EP7): its Tier 1 value × the tier, rounded half up. */
export function nodePoints(id: string, tier: GearTier): number {
  const body = nodeBody(id), n = nodeNumeral(id)
  const tierOne = body === 'planet' ? PLANET_T1[n - 1] : body === 'template' ? TEMPLATE_T1[n - 1] : MOON_T1[n - 1]
  return tierScaled(tierOne ?? 0, tier)
}

/** Prowess's node split by her class (EP23): the larger share rounded half up in whole numbers (`points × pct ÷ 100`),
 * the rest to the smaller, so the node keeps its total. A Tier 0 by her `weapons` (CV7): a third a slot to its channel,
 * half up to ATK (her class's defaults when none are named). */
export function prowessSplit(points: number, classId: RpgClass, weapons?: readonly RpgWeapon[]): { atk: number; matk: number } {
  if (rpgIsTier0(classId)) return rpgThirdsSplit(points, (weapons ?? rpgDefaultWeapons(classId)).filter((w) => !isRpgTome(w)).length)
  const atk = PROWESS_SPLIT[classId]
  const larger = Math.max(atk, 100 - atk)
  const lead = Math.floor((2 * points * larger + 100) / 200)
  return atk >= 50 ? { atk: lead, matk: points - lead } : { atk: points - lead, matk: lead }
}

/** What her moon reads (UT10): her knack (node I) and her calling's channel (node II's defense). From v19 an All-Rounder
 * calling's `both` (CV21): half on DEF, half on M.DEF. */
export interface MoonTemplate { knack: UmaKnack; channel: 'physical' | 'magical' | 'both' }
/** Her moon's node II channel by her calling (UT10): her calling's armor half; from v19 her Tier 0's root (CV21): the
 * Warrior physical, the Mage magical, the All-Rounders' Spellblade, Summoner and Healer both. */
export function moonChannel(calling: UmaCallingClass, engine: number = BATTLE_ENGINE_VERSION): MoonTemplate['channel'] {
  if (!rpgRework('classes', engine) || !rpgIsTier0(calling)) return RPG_CLASS_ARMOR[calling]
  const root = RPG_TIER0_ROOT[calling]
  return root === 'warrior' ? 'physical' : root === 'mage' ? 'magical' : 'both'
}
/** Her moon's template from her outfit and calling pick (H67, H69): `umaTemplate`'s knack and its calling's channel,
 * read from its parts so the template's name tables stay out of this module. By generation (from v19 the pick is ignored). */
export function moonTemplate(outfit: Pick<TemplateOutfit, 'baseStats' | 'growthRatePercents'> & CallingOutfit, pick?: RpgClass | null,
  engine: number = BATTLE_ENGINE_VERSION): MoonTemplate {
  return { knack: umaKnack(outfit), channel: moonChannel(umaCalling(outfit, pick, engine), engine) }
}

/**
 * Her map's points as `applyPoints` reads them (EP2–EP4, EP7, EP14, EP23): the Planet to all six core stats, Prowess
 * split by `classId` (her active class, read when a fight starts; a Tier 0's by her `weapons`), Vigor to HP and MP, Guard
 * to DEF and M.DEF and, with `template`, her moon (node II `both`: ⌊value ÷ 2⌋ to DEF, the rest to M.DEF). HP in points
 * (× `POINT_HP` in `applyPoints`), evasion as Speed points and Limit start as Limit points, so the fight's stats come out
 * as today's points do. Ids that aren't map nodes, and her moon without a template, add nothing.
 */
export function mapPoints(open: readonly string[], classId: RpgClass, tier: GearTier, template?: MoonTemplate, weapons?: readonly RpgWeapon[]): Points {
  const points = noPoints()
  for (const id of open) {
    if (!isMapNode(id)) continue
    const body = nodeBody(id), value = nodePoints(id, tier)
    if (body === 'planet') {
      points.hp += value; points.mp += value; points.atk += value; points.matk += value; points.def += value; points.mdef += value
    } else if (body === 'prowess') {
      const split = prowessSplit(value, classId, weapons)
      points.atk += split.atk; points.matk += split.matk
    } else if (body === 'vigor') {
      points.hp += value; points.mp += value
    } else if (body === 'guard') {
      points.def += value; points.mdef += value
    } else if (template && nodeNumeral(id) === 1) {
      const knack = template.knack
      if (knack === 'tireless') points.hp += value
      else if (knack === 'clever') points.mp += value
      else if (knack === 'mighty') { points.def += value; points.mdef += value }
      else if (knack === 'fleet') points.speed += KNACK_SHARE_POINTS
      else points.limit += KNACK_SHARE_POINTS
    } else if (template?.channel === 'both') {
      const half = Math.floor(value / 2)
      points.def += half; points.mdef += value - half
    } else if (template) {
      points[template.channel === 'physical' ? 'def' : 'mdef'] += value
    }
  }
  return points
}
