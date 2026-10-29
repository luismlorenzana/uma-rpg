// Save/profile validation needs ids and gates, not skill names, hit definitions or the full generated catalog (H16).
import { isRpgTome, isRpgWeapon, RPG_ALL_CLASSES, RPG_TOMES, RPG_WEAPON_KINDS, RPG_WEAPONS, rpgIsTier0, type RpgClass, type RpgTreeId, type RpgWeapon } from './kinds'

export interface RpgNodeIdentity {
  id: string; tree: RpgTreeId; classId: RpgClass; weapon: RpgWeapon; depth: number; variant: 'a' | 'b' | null
  /** Side skills cost their depth; cores are free but retain this catalog field. */
  cost: number
}
/** The weapons a class has trees for. */
export const rpgClassWeapons = (classId: RpgClass): readonly RpgWeapon[] =>
  classId === 'brawler' ? RPG_WEAPON_KINDS : classId === 'mage' ? RPG_TOMES : RPG_WEAPONS
export const rpgTreeOf = (classId: RpgClass, weapon: RpgWeapon): RpgTreeId => `${classId}-${weapon}`
/** Single-target total power by depth, and the full-turn MP by depth (6 + 4 × depth). */
export const RPG_SKILL_POWER = [1.6, 2.2, 2.9, 3.7, 4.6] as const
export const RPG_SKILL_MP = [10, 14, 18, 22, 26] as const
/** Side skills open at Uma Lv 5, 15, 25, 35 and 45 (D73); cores use the class rank (D77). Engines v6–v15: from v16 there
 * are no side skills (CP14). */
export const rpgSideNodeLevel = (depth: number): number => 10 * depth - 5

// --- The Tier rework's trees (engine v16, H65; class-progression.md §6.1, §6.2, §6.5) ----------------------------------
//
// From v16 a weapon tree is a trunk (depths 1–2, the cores) and one fork at depth 3 into two lines, A (the cores 3–5, the
// default) and B (one catalog side line's depths 3–5). The catalog keeps every node and id; these tables say which side
// line is a tree's B, here with the ids so the save parser (H69) reads them without the catalog.

/** A tree's line at its fork (CP18): A, the core, or B. R4 adds C. */
export type RpgBranch = 'A' | 'B'
/** Her lines by weapon (`lines` on the profile, the fight's input and the save): a weapon listed takes that line, any other
 * weapon A, the default (CP14). */
export type RpgLines = Partial<Record<RpgWeapon, Exclude<RpgBranch, 'A'>>>
const every = (letter: 'a' | 'b'): Readonly<Partial<Record<RpgWeapon, 'a' | 'b'>>> => Object.fromEntries(RPG_WEAPONS.map((w) => [w, letter]))
const byChannel = (arms: 'a' | 'b', tomes: 'a' | 'b'): Readonly<Partial<Record<RpgWeapon, 'a' | 'b'>>> =>
  Object.fromEntries(RPG_WEAPONS.map((w) => [w, isRpgTome(w) ? tomes : arms]))
/** Branch B's catalog side letter, by class and kind (§6.5; the side's letter is not the branch's): the Brawler and the Mage
 * by kind, the Spell Blade's Pierce (her `b`, v15's Flurry), the Summoner's Bonded on Tome trees (`b`) and Pack on Arms
 * trees (`a`), the healers' Heavy (`b`, with the revives on the Light tree's depth 3). Classes v3 (CV17, H126): the Tome
 * Spellblade's Pierce on every tree (`b`), the Arms Summoner's mirror, Bonded on her Arms trees (`b`) and Pack on her Tome
 * trees (`a`); a Tier 0 has no fork. */
const NO_FORK: Readonly<Partial<Record<RpgWeapon, 'a' | 'b'>>> = {}
export const RPG_BRANCH_B: Readonly<Record<RpgClass, Readonly<Partial<Record<RpgWeapon, 'a' | 'b'>>>>> = {
  brawler: { greatsword: 'b', axe: 'b', lance: 'a', bow: 'b', katana: 'a' },
  mage: { 'tome-fire': 'a', 'tome-ice': 'a', 'tome-lightning': 'a', 'tome-light': 'b', 'tome-dark': 'a' },
  spellblade: every('b'),
  summoner: byChannel('a', 'b'),
  paladin: every('b'),
  cleric: every('b'),
  recruit: NO_FORK, duelist: NO_FORK, acolyte: NO_FORK, caller: NO_FORK, apprentice: NO_FORK,
  armsummoner: byChannel('b', 'a'),
  tomeblade: every('b'),
}
/** Branch B's name, by class and kind, for the branch sheet (§6.5). */
export const RPG_BRANCH_B_NAME: Readonly<Record<RpgClass, Readonly<Partial<Record<RpgWeapon, string>>>>> = {
  brawler: { greatsword: 'Combo', axe: 'Reap', lance: 'Impale', bow: 'Rain', katana: 'Draw' },
  mage: { 'tome-fire': 'Wave', 'tome-ice': 'Spike', 'tome-lightning': 'Bolt', 'tome-light': 'Cascade', 'tome-dark': 'Pierce' },
  spellblade: Object.fromEntries(RPG_WEAPONS.map((w) => [w, 'Pierce'])),
  summoner: Object.fromEntries(RPG_WEAPONS.map((w) => [w, isRpgTome(w) ? 'Bonded' : 'Pack'])),
  paladin: Object.fromEntries(RPG_WEAPONS.map((w) => [w, 'Heavy'])),
  cleric: Object.fromEntries(RPG_WEAPONS.map((w) => [w, 'Heavy'])),
  recruit: {}, duelist: {}, acolyte: {}, caller: {}, apprentice: {},
  armsummoner: Object.fromEntries(RPG_WEAPONS.map((w) => [w, isRpgTome(w) ? 'Pack' : 'Bonded'])),
  tomeblade: Object.fromEntries(RPG_WEAPONS.map((w) => [w, 'Pierce'])),
}
/** The two hybrids Classes v3 adds (CV15): no older generation, so their trees hold only their lines' eight nodes. */
const LINE_ONLY: readonly RpgClass[] = ['armsummoner', 'tomeblade']
/** Whether a class's trees hold only their lines (the trunk and the fork's two lines: eight nodes a tree). */
export const rpgLineOnlyClass = (classId: RpgClass): boolean => LINE_ONLY.includes(classId)
/** Her line on a weapon's tree: B where `lines` says so, else A. */
export const rpgLineOf = (lines: RpgLines | undefined, weapon: RpgWeapon): RpgBranch => lines?.[weapon] ?? 'A'
/** The node a tree holds at a depth on a line: depths 1–2 the trunk's core (either line), 3–5 the core on A or branch B's
 * side node (`.${depth}${RPG_BRANCH_B[classId][weapon]}`). A Tier 0's tree is its one node at depth 1 (CV6). Throws for a
 * tree her class lacks or a depth outside 1–5 (a Tier 0's outside 1). */
export function rpgBranchNode(classId: RpgClass, weapon: RpgWeapon, depth: number, branch: RpgBranch): string {
  if (rpgIsTier0(classId)) {
    if (depth !== 1 || !isRpgWeapon(weapon)) throw new RangeError('Not in this class’s trees')
    return `${rpgTreeOf(classId, weapon)}.1`
  }
  const letter = RPG_BRANCH_B[classId]?.[weapon]
  if (!letter || !rpgClassWeapons(classId).includes(weapon) || !Number.isInteger(depth) || depth < 1 || depth > 5) {
    throw new RangeError('Not in this class’s trees')
  }
  return `${rpgTreeOf(classId, weapon)}.${depth}${depth >= 3 && branch === 'B' ? letter : ''}`
}
/** The line a node sits on in its tree (v16): `trunk` at depths 1–2, A for a core at 3–5, B for branch B's side node, and
 * null for a node on no Tier 1 line (the other side line, a depth 1–2 side). */
export function rpgNodeLine(id: string): 'trunk' | RpgBranch | null {
  const node = rpgNodeIdentity(id)
  if (!node) return null
  if (node.variant === null) return node.depth <= 2 ? 'trunk' : 'A'
  return node.depth >= 3 && RPG_BRANCH_B[node.classId][node.weapon] === node.variant ? 'B' : null
}
/** Valid lines for her weapons (v16): an object whose every key is one of them and every value B. A Tier 0 (`classId`)
 * has no fork, so only `{}` (H126). */
export function validRpgLines(lines: unknown, weapons: readonly RpgWeapon[], classId?: RpgClass): lines is RpgLines {
  if (!lines || typeof lines !== 'object' || Array.isArray(lines)) return false
  if (classId !== undefined && rpgIsTier0(classId)) return Object.keys(lines).length === 0
  return Object.entries(lines).every(([w, line]) => weapons.includes(w as RpgWeapon) && line === 'B')
}

/** The catalog's exact grammar, with no aliases or zero padding, by class shape (H126): classes v1's and v2's six hold 15
 * nodes a tree (five depths × core/A/B); the two new hybrids only their lines' eight (the cores, and branch B's side at
 * depths 3–5); a Tier 0 only its depth-1 node. Every generation's classes (D179): the save refuses a newer class's keys
 * before its switch through the live `RPG_CLASSES`. */
export function rpgNodeIdentity(id: string): RpgNodeIdentity | undefined {
  if (typeof id !== 'string') return undefined
  const match = /^([a-z]+)-([a-z-]+)\.([1-5])([ab])?$/.exec(id)
  if (!match) return undefined
  const classId = match[1] as RpgClass, weapon = match[2] as RpgWeapon
  if (!RPG_ALL_CLASSES.includes(classId) || !isRpgWeapon(weapon) || !rpgClassWeapons(classId).includes(weapon)) return undefined
  const depth = Number(match[3])
  const variant = (match[4] as 'a' | 'b' | undefined) ?? null
  if (rpgIsTier0(classId) && (depth !== 1 || variant !== null)) return undefined
  if (rpgLineOnlyClass(classId) && variant !== null && (depth < 3 || RPG_BRANCH_B[classId][weapon] !== variant)) return undefined
  return { id, tree: rpgTreeOf(classId, weapon), classId, weapon, depth, variant, cost: depth }
}
