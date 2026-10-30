// "The classes are rebuilt" as words (Classes v3 §8.6, CV30; halls-v2.md §7.2 item 5, HV19; H132): a world's
// `classesV3` record (save v32, H130) turned into the one-time sheet's parts. A part with nothing in it is left out. The
// "before" names are engine v18's, as the record's v31 ids were then; the class after the arrow is v19's. Its lead and
// steps are sentences, as a one-time sheet's may be (C2). Pure, so the sheet and the tests read the same numbers.
import {
  HERO_HALL_PLACES, heroLimitFor, placeById, placeSpecV4, RPG_CLASS_ROOTS, RPG_REWORK_ENGINE, RPG_ROOT_NAME, RPG_TIER0_CLASSES, RPG_TIER0_ROOT,
  RPG_V2_CLASSES, rpgClassName, startingClass, tradePlaces, umaCalling, type CallingOutfit, type ClassesV3Line, type ClassesV3Record,
  type HallMergeLine, type RpgClass, type RpgTier0Class, type TradeId,
} from '@rpg/domain'
import { LINE_WORD } from '../items/v3-words'
import { classRankWord } from '../ui/rank-words'
import { CLASSES_TITLE, UNKNOWN_UMA } from './grant-lines'

// The Account's row lives beside the grant's (`grant-lines.ts`), so the Account's chunk doesn't load these words.
export { CLASSES_TITLE, classesRow } from './grant-lines'

/** The engines the record spans: v31's classes were engine v18's, the reset's are v19's. */
const AFTER = RPG_REWORK_ENGINE.classes
const BEFORE = AFTER - 1

const LEAD_TIER1 = 'Every Uma starts her class tree at Rank 1 of her Tier 0.'
const LEAD_LATER = 'Every Uma starts again at Rank 1 of her class.'
const STEP_READ_TIER1 = 'Exchange → Read a Class Manual → her Tier 0 → Her share'
const STEP_READ_LATER = 'Exchange → Read a Class Manual → her class → Her share'
const STEP_PROMOTE = 'Her profile → Skills → Promote (Rank 10)'
const STEP_PROMOTE_NOTE = 'EXP past Rank 10 goes with her into the new class'
const RESET = 'Class Ranks · weapons per class · lines · equipped skills · callings'
const STAYS = 'Uma Levels · weapon, armor and accessory grades · Extra Stats · Craft Levels · Bonds · Hall seats · Laurels · items'
const WEAPONS = 'No Weapon Rank since R2: grades stay'
const HALLS_FOOT = 'Each Uma keeps her higher Bond'
/** Halls v2's merged hall until H133 gives it a place (HV21). */
const SANCTUM = 'Healer Sanctum'
/** The two halls the Healer Sanctum merged (save v32, HV18), by the names they had to v18. */
const OLD_HALLS = 'Paladin Bastion · Cleric Chapel'

const num = (n: number) => n.toLocaleString('en-US')

/** What the sheet knows of an Uma from master data: her name, and the class she starts again in (`rebuiltClass`). */
export interface ClassesWho { name: string; after: RpgClass | null }
export interface ClassesUma { outfitId: string; name: string; manuals: number; line: string }
export interface ClassesStep { text: string; note: string | null }
export interface ClassesRoot { root: string; classes: readonly { classId: RpgTier0Class; name: string }[] }
export interface ClassesHalls { head: string; moves: readonly { outfitId: string; label: string; value: string }[]; foot: string }

export interface ClassesLines {
  title: string
  /** "+78 Class Manuals", large. */
  grant: string
  /** "78,000 Class Marks · Exchange", under it. */
  marks: string
  lead: string
  /** Tier 1's world: the three roots and their Tier 0s; null in a later world (no Tier 0 there). */
  tree: readonly ClassesRoot[] | null
  steps: readonly ClassesStep[]
  reset: string
  stays: string
  weapons: string
  trades: string | null
  halls: ClassesHalls | null
  /** By Manuals, most first: each Uma with a share or a moved trade. */
  umas: readonly ClassesUma[]
}

/** A trade by its line's word: "Wood". */
const tradeWord = (trade: TradeId): string => {
  const spec = placeSpecV4(tradePlaces(trade)[0])
  return spec ? LINE_WORD[spec.line] : trade
}

const isV2Class = (id: string): id is RpgClass => (RPG_V2_CLASSES as readonly string[]).includes(id)

/** Her classes before the reset, highest rank first (then the most EXP, then the old list's order): "Summoner R50 · Mage R15". */
function before(line: ClassesV3Line): string[] {
  return Object.entries(line.ranks)
    .flatMap(([id, track]) => (track && isV2Class(id) ? [{ id, track }] : []))
    .sort((a, b) => b.track.rank - a.track.rank || b.track.exp - a.track.exp
      || RPG_V2_CLASSES.indexOf(a.id as typeof RPG_V2_CLASSES[number]) - RPG_V2_CLASSES.indexOf(b.id as typeof RPG_V2_CLASSES[number]))
    .map(({ id, track }) => `${rpgClassName(id, BEFORE)} ${classRankWord(track.rank)}`)
}

/** One Uma's line: "Spell Blade R26 · Mage R8 → Mage R1 · trade Wood → Stone"; "No Class EXP → Spellblade R1". */
function umaLine(line: ClassesV3Line, after: RpgClass | null): string {
  const was = before(line)
  const to = after ? ` → ${rpgClassName(after, AFTER)} ${classRankWord(1)}` : ''
  const trade = line.trade ? ` · trade ${tradeWord(line.trade.from)} → ${tradeWord(line.trade.to)}` : ''
  return `${was.length ? was.join(' · ') : 'No Class EXP'}${to}${trade}`
}

const placeName = (placeId: string, fallback: string) => placeById(placeId)?.name ?? fallback

/** A merge line's value: "Hero → Learner · Archdemon’s Toll · Bond 7"; "Learner → no seat · Seraph’s Pyre · Bond 3". */
function hallMove(move: HallMergeLine): string {
  const was = move.was === 'hero' ? 'Hero' : 'Learner'
  const now = move.now === 'learner' ? 'Learner' : 'no seat'
  const limit = heroLimitFor(move.to, AFTER)?.name
  return [`${was} → ${now}`, limit, `Bond ${move.bond}`].filter(Boolean).join(' · ')
}

/**
 * The sheet's parts. `who` names an Uma from master data and the class she starts again in (undefined for an outfit it
 * lacks: "An Uma", no arrow). `tier` is the world's; `merged` whether the Paladin Bastion and the Cleric Chapel had any
 * seat or Bond to merge (the record lists only the Umas whose role moved), by default whether it lists any.
 */
export function classesLines(record: ClassesV3Record, who: (outfitId: string) => ClassesWho | undefined, tier: number,
  merged = record.halls.length > 0): ClassesLines {
  const tierOne = tier === 1
  const lines = Object.entries(record.umas)
  const moved = lines.filter(([, line]) => line.trade).length
  const name = (id: string) => who(id)?.name ?? UNKNOWN_UMA
  const umas = lines.filter(([, line]) => line.manuals > 0 || line.trade)
    .map(([outfitId, line]): ClassesUma => ({ outfitId, name: name(outfitId), manuals: line.manuals, line: umaLine(line, who(outfitId)?.after ?? null) }))
    .sort((a, b) => b.manuals - a.manuals || a.name.localeCompare(b.name))
  return {
    title: CLASSES_TITLE,
    grant: `+${num(record.manuals)} Class Manuals`,
    marks: `${num(record.marks)} Class Marks · Exchange`,
    lead: tierOne ? LEAD_TIER1 : LEAD_LATER,
    tree: tierOne ? RPG_CLASS_ROOTS.map((root) => ({
      root: RPG_ROOT_NAME[root],
      classes: RPG_TIER0_CLASSES.filter((c) => RPG_TIER0_ROOT[c] === root).map((classId) => ({ classId, name: rpgClassName(classId, AFTER) })),
    })) : null,
    steps: tierOne
      ? [{ text: STEP_READ_TIER1, note: null }, { text: STEP_PROMOTE, note: STEP_PROMOTE_NOTE }]
      : [{ text: STEP_READ_LATER, note: null }],
    reset: RESET,
    stays: STAYS,
    weapons: WEAPONS,
    trades: moved > 0 ? `${num(moved)} ${moved === 1 ? 'Uma' : 'Umas'} moved trade · ${moved === 1 ? 'her' : 'their'} running work finished into the Warehouse` : null,
    halls: merged || record.halls.length > 0 ? {
      // The two old halls are history at v19 (no place keeps their names), so the sheet names them as the owner knew them.
      head: `${OLD_HALLS} → ${placeName(HERO_HALL_PLACES.healer, SANCTUM)}`,
      moves: record.halls.map((move) => ({ outfitId: move.outfitId, label: name(move.outfitId), value: hallMove(move) })),
      foot: HALLS_FOOT,
    } : null,
    umas,
  }
}

/**
 * The class an Uma starts again in at the reset (CV25): in Tier 1's world her calling's Tier 0 by v19's rule; in a later
 * world her v31 class, kept as its Tier 1 class, or with none her calling's suggested promotion.
 */
export function rebuiltClass(outfit: CallingOutfit, line: Pick<ClassesV3Line, 'classId'>, tier: number): RpgClass {
  if (tier === 1) return umaCalling(outfit, null, AFTER)
  return line.classId && isV2Class(line.classId) ? line.classId : startingClass(outfit, AFTER, tier)
}
