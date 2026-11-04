// Skill names (D298; docs/design/skill-names/skill-names.md, SN1–SN15): one grammar for every Tier 1 tree. A tree has one
// word; depths 2–4 put the same ladder before it, depth 5 is the tree's own capstone, and line B is line A's name with the
// line's word after it. Mirrored classes share their family's words. Names are presentation: ids, saves and fights never
// read them.
import type { RpgTier1Class, RpgWeapon } from './kinds'
import { RPG_BRANCH_B_NAME } from './node-identity'

/** Depths 1–4's ladder, the same in every tree (SN2): the word, then Greater, Grand and Supreme. */
export const RPG_SKILL_LADDER = ['', 'Greater', 'Grand', 'Supreme'] as const

export type RpgSkillFamily = 'brawler' | 'sorcerer' | 'spellblade' | 'summoner' | 'healer'
/** Each class's family (SN5): both Spellblades, both Summoners and both healers share one set of words. */
export const RPG_SKILL_FAMILY: Readonly<Record<RpgTier1Class, RpgSkillFamily>> = {
  brawler: 'brawler', mage: 'sorcerer', spellblade: 'spellblade', tomeblade: 'spellblade',
  armsummoner: 'summoner', summoner: 'summoner', paladin: 'healer', cleric: 'healer',
}

/** A tree's word and its depth-5 capstone (SN3), in its family's theme (SN10). */
export interface RpgTreeWords { word: string; capstone: string }
type Words = Readonly<Partial<Record<RpgWeapon, RpgTreeWords>>>
const w = (word: string, capstone: string): RpgTreeWords => ({ word, capstone })

/** Every family's words, weapon by weapon: the Brawler the falling sky, the Sorcerer the cosmos, the Spellblade an Edge,
 * the Summoner a creature and its legend, the healer what the tree gives (a Barrier, a heal, its status; SN11). */
export const RPG_TREE_WORDS: Readonly<Record<RpgSkillFamily, Words>> = {
  brawler: {
    greatsword: w('Cleave', 'Meteor Strike'), axe: w('Whirl', 'Maelstrom'), lance: w('Flurry', "Heaven's Rain"),
    bow: w('Salvo', 'Starfall'), katana: w('Crescent', 'Moonfall'),
  },
  sorcerer: {
    'tome-fire': w('Flame', 'Flare Star'), 'tome-ice': w('Frost', 'Absolute Zero'), 'tome-lightning': w('Thunder', 'Ion Storm'),
    'tome-light': w('Lux', 'Sunburst'), 'tome-dark': w('Nox', 'Black Hole'),
  },
  spellblade: {
    greatsword: w('Sever', 'Titan Edge'), axe: w('Hew', 'Gale Edge'), lance: w('Lunge', 'Comet Edge'), bow: w('Arc', 'Falcon Edge'),
    katana: w('Iai', 'Moon Edge'), 'tome-fire': w('Scorch', 'Inferno Edge'), 'tome-ice': w('Rime', 'Glacier Edge'),
    'tome-lightning': w('Volt', 'Storm Edge'), 'tome-light': w('Lumen', 'Dawn Edge'), 'tome-dark': w('Umbra', 'Dusk Edge'),
  },
  summoner: {
    greatsword: w('Knight', 'Sword Saint'), axe: w('Minotaur', 'Mountain King'), lance: w('Dragoon', 'Valkyrie'),
    bow: w('Archer', 'Sylph Lord'), katana: w('Samurai', 'Shogun'), 'tome-fire': w('Drake', 'Phoenix'),
    'tome-ice': w('Golem', 'Winter Queen'), 'tome-lightning': w('Roc', 'Kirin'), 'tome-light': w('Angel', 'Archon'),
    'tome-dark': w('Vampire', 'Blood Countess'),
  },
  healer: {
    greatsword: w('Breach', 'Ruin'), axe: w('Rampart', 'Citadel'), lance: w('Daze', 'Oblivion'), bow: w('Wither', 'Blight'),
    katana: w('Rend', 'Doom'), 'tome-fire': w('Valor', 'Exaltation'), 'tome-ice': w('Haven', 'Sanctuary'),
    'tome-lightning': w('Pulse', 'Stormheart'), 'tome-light': w('Grace', 'Benediction'), 'tome-dark': w('Siphon', 'Eventide'),
  },
}

/** A Tier 1 skill's name: line A's at depths 1–5 (the trunk at 1–2), and line B's at 3–5, A's name and the line's word
 * (SN4): "Grand Cleave Combo", "Meteor Strike Combo". Throws for a tree her class lacks. */
export function rpgSkillName(classId: RpgTier1Class, weapon: RpgWeapon, depth: number, line: 'A' | 'B'): string {
  const words = RPG_TREE_WORDS[RPG_SKILL_FAMILY[classId]][weapon]
  if (!words || !Number.isInteger(depth) || depth < 1 || depth > 5) throw new RangeError(`No skill name for ${classId} ${weapon} ${depth}`)
  const a = depth === 5 ? words.capstone : [RPG_SKILL_LADDER[depth - 1], words.word].filter(Boolean).join(' ')
  if (line === 'A' || depth < 3) return a
  const lineWord = RPG_BRANCH_B_NAME[classId][weapon]
  if (!lineWord) throw new RangeError(`No line B on ${classId} ${weapon}`)
  return `${a} ${lineWord}`
}
