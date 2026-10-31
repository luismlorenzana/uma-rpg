// The Stars tab's rules (H122; D239 UP15, UP22; D264's jewels; proposal §4.3): a node's title, value, state and before → after,
// and Set all's plan against a simulated map and stock. Pure, on the domain's rules (`jewelBlock`, `jewelNodes`,
// `umaBattleSheet`), so order and gates hold and a balance change shows here.
import {
  isStarMap, jewelBlock, jewelNodes, KNACK_LABEL, madeName, MAP_NODES, mapNodeGate, moonTemplate, nodeBody, nodeJewel, nodeJewelCount, nodeNumeral, nodePoints,
  prowessSplit, umaBattleSheet, umaPick, umaTemplate, withHerMoon, type BattleOutfit, type GearTier, type MoonTemplate, type OwnedUma, type RpgClass, type RpgWeapon,
  type StarMap, type TemplateOutfit,
} from '@rpg/domain'
import { gate, itemCount, nodeGate, nodeValue as nodeValueCopy, setLine, valueStep } from '../stable/copy'

const ROMAN = ['I', 'II', 'III', 'IV', 'V'] as const
const cap = (word: string) => word[0]!.toUpperCase() + word.slice(1)
type Stock = Readonly<Record<string, number>>

/** "Guard III", "★ Bruiser's moon II". */
export function mapNodeTitle(id: string, type: string): string {
  const body = nodeBody(id), numeral = ROMAN[nodeNumeral(id) - 1]
  return body === 'template' ? `★ ${cap(type)}'s moon ${numeral}` : `${cap(body)} ${numeral}`
}

/** What a node gives, resolved for her class: "DEF/M.DEF +6", Prowess "ATK +6" as a Brawler. */
export function mapNodeValue(id: string, classId: RpgClass, knack: keyof typeof KNACK_LABEL, channel: MoonTemplate['channel'], tier: GearTier,
  weapons?: readonly RpgWeapon[]): string {
  const body = nodeBody(id), value = nodePoints(id, tier)
  if (body === 'planet') return nodeValueCopy({ kind: 'planet', value })
  if (body === 'prowess') {
    const split = prowessSplit(value, classId, weapons)
    return [split.atk ? nodeValueCopy({ kind: 'prowess', stat: 'ATK', value: split.atk }) : '', split.matk ? nodeValueCopy({ kind: 'prowess', stat: 'M.ATK', value: split.matk }) : ''].filter(Boolean).join(' · ')
  }
  if (body === 'vigor') return nodeValueCopy({ kind: 'vigor', hp: value * 5, mp: value })
  if (body === 'guard') return nodeValueCopy({ kind: 'guard', value })
  if (nodeNumeral(id) === 2 && channel === 'both') {
    const half = Math.floor(value / 2)
    return half * 2 === value ? nodeValueCopy({ kind: 'guard', value: half })
      : `${nodeValueCopy({ kind: 'stat', stat: 'DEF', value: half })} · ${nodeValueCopy({ kind: 'stat', stat: 'M.DEF', value: value - half })}`
  }
  if (nodeNumeral(id) === 2) return nodeValueCopy({ kind: 'stat', stat: channel === 'physical' ? 'DEF' : 'M.DEF', value })
  return knack === 'tireless' ? nodeValueCopy({ kind: 'stat', stat: 'HP', value: value * 5 })
    : knack === 'clever' ? nodeValueCopy({ kind: 'stat', stat: 'MP', value })
      : knack === 'mighty' ? nodeValueCopy({ kind: 'guard', value })
        : knack === 'fleet' ? nodeValueCopy({ kind: 'stat', stat: 'Evasion', value: '2.4%' })
          : nodeValueCopy({ kind: 'stat', stat: 'Limit start', value: 1 })
}

/** Whether a jewel in the Warehouse opens this node now. Her moon takes none, so it is never ready (D264). */
export const nodeReady = (map: StarMap, node: string, level: number, stock: Stock): boolean => jewelBlock(map, nodeJewel(node), node, level, stock) === null

/** One jewel set on one node. */
export interface SetStep { jewel: string; node: string }
/** Every jewel kind, in Set all's order: Planet Jewels I–V, then Moon Jewels I–V. */
const JEWELS: readonly string[] = [...new Set(MAP_NODES.filter((id) => nodeBody(id) !== 'template').map(nodeJewel))]
  .sort((a, b) => Number(!a.includes('planet')) - Number(!b.includes('planet')) || a.localeCompare(b))
/**
 * Every jewel that fits now (H122 decision 1): repeats until nothing fits, Planet Jewels first, then Moon Jewels by numeral,
 * each placed by `jewelNodes` against a simulated map and stock, so a node opens only after the one before it. A Planet Jewel
 * can only open the Planet; a Moon Jewel goes to the shared moon with the fewest open nodes, Prowess, Vigor, Guard on a tie.
 * UP22 put her moon first; since D264 it takes no jewel and opens with the three moons.
 */
export function setAllPlan(map: StarMap, stock: Stock, level: number): SetStep[] {
  const steps: SetStep[] = []
  let open = [...map.open]
  const left: Record<string, number> = { ...stock }
  for (;;) {
    const sim = { ...map, open }
    const jewel = JEWELS.find((id) => (left[id] ?? 0) > 0 && jewelNodes(sim, id, level, left).length > 0)
    if (!jewel) return steps
    const node = jewelNodes(sim, jewel, level, left)[0]!
    steps.push({ jewel, node })
    left[jewel] = left[jewel]! - nodeJewelCount(node)
    open = withHerMoon([...open, node])
  }
}

type Outfit = BattleOutfit & TemplateOutfit
/** Set all's lines: "Moon Jewel IV → Guard IV · DEF/M.DEF +8". */
export function setAllLines(steps: readonly SetStep[], outfit: Outfit, uma: OwnedUma, classId: RpgClass, weapons: readonly RpgWeapon[], tier: GearTier): string[] {
  const moon = moonTemplate(outfit, umaPick(uma))
  const type = umaTemplate(outfit, umaPick(uma)).type
  return steps.map(({ jewel, node }) => setLine(itemWord(jewel, nodeJewelCount(node)), mapNodeTitle(node, type), mapNodeValue(node, classId, moon.knack, moon.channel, tier, weapons)))
}
const itemWord = (jewel: string, count: number) => (count > 1 ? `${madeName(jewel) ?? jewel} ×${count}` : madeName(jewel) ?? jewel)

/** A sheet's stats as numbers where they are. */
const statRows = (groups: ReturnType<typeof umaBattleSheet>) => new Map(groups.flatMap((g) => g.rows).map((row) => [row.label, row.value]))
const value = (text: string): string | number => (/^\d+$/.test(text) ? Number(text) : text)
/** What opening a node changes on her sheet, her moon's nodes it brings included: "DEF 151 → 157", then "M.DEF 129 → 135". From
 * the sheet itself, so a balance change shows here. Nothing for an open node. */
export function nodeBeforeAfter(outfit: BattleOutfit, uma: OwnedUma, node: string, classId: RpgClass, tier: GearTier): string[] {
  if (!isStarMap(uma.stars) || uma.stars.open.includes(node)) return []
  const before = statRows(umaBattleSheet(outfit, uma, classId, tier))
  const after = statRows(umaBattleSheet(outfit, { ...uma, stars: { ...uma.stars, open: withHerMoon([...uma.stars.open, node]) } }, classId, tier))
  return [...after].flatMap(([label, to]) => {
    const from = before.get(label)
    return from !== undefined && from !== to ? [valueStep(label, value(from), value(to))] : []
  })
}

/** A node's sheet: what it gives, before → after, its jewel with what's held, and the footer: Set, or the gate, disabled; an
 * open node has none and reads Open. */
export interface NodeView {
  title: string
  value: string
  open: boolean
  changes: string[]
  jewelId: string
  jewel: string | null
  footer: { label: string; ready: boolean } | null
}
export function nodeSheet(outfit: Outfit, uma: OwnedUma, node: string, classId: RpgClass, weapons: readonly RpgWeapon[], tier: GearTier, stock: Stock): NodeView {
  const map = uma.stars as StarMap
  const moon = moonTemplate(outfit, umaPick(uma))
  const type = umaTemplate(outfit, umaPick(uma)).type
  const open = map.open.includes(node)
  const body = nodeBody(node)
  const jewelId = nodeJewel(node)
  const count = nodeJewelCount(node)
  const held = stock[jewelId] ?? 0
  const before = Array.from({ length: nodeNumeral(node) - 1 }, (_, i) => `${body}:${i + 1}`).find((id) => !map.open.includes(id))
  const label = body === 'template' ? 'With its moons' : before ? nodeGate(mapNodeTitle(before, type))
    : uma.level < mapNodeGate(node) ? gate('level', mapNodeGate(node)) : held < count ? itemCount(madeName(jewelId) ?? jewelId, held) : 'Set'
  return { title: mapNodeTitle(node, type), value: mapNodeValue(node, classId, moon.knack, moon.channel, tier, weapons), open,
    changes: nodeBeforeAfter(outfit, uma, node, classId, tier), jewelId,
    jewel: body === 'template' || open ? null : itemCount(madeName(jewelId) ?? jewelId, count, held),
    footer: open ? null : { label, ready: label === 'Set' } }
}

/** The Observatory's list (H122 decision 6): owned Umas, those with the most ready first, then the roster's default. */
export function observatoryOrder<R extends { id: string }>(rows: readonly R[], readyOf: (id: string) => number, tie: (a: R, b: R) => number): R[] {
  return [...rows].sort((a, b) => readyOf(b.id) - readyOf(a.id) || tie(a, b))
}
