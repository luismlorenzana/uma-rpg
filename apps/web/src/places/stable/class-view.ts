// Classes v3's class tree and promotion as the profile draws them (D240 CV32, classes-v3.md §14.1–§14.2; H137, D253): the
// Classes sheet's tiles in the tree's grid, each in the state language (UP23) with its word, the selection's line and its
// footer; the promotion sheet's children, Suggested and Held, before → after from `promotionPlan`; the Tier 0 tree's node and
// its promotion line; the class button's word and whether a promotion waits. Pure, on H126's data only (`umaClassTree`,
// `promotionPlan`, the class tree's tables): it never re-derives a rule, and the sheets only draw what it returns. Built on
// today's Skills tab (D252), inert until the switch (H134); H120 reuses it in profile v2's Class tab.
//
// Every new wording lives here, in one place H117's copy test can absorb (C3); the three facts the Exchange shares come from
// `ui/rank-words.ts`.
import {
  activeClass, BATTLE_ENGINE_VERSION, classTrack, healerBlock, partyOf, promotionPlan, RPG_CLASS_CHILDREN, RPG_CLASS_PARENTS, RPG_CLASS_ROOTS,
  RPG_ROOT_NAME, RPG_TIER0_CLASSES, RPG_TIER0_MAX_RANK, RPG_TIER0_ROOT, RPG_TIER0_SKILL, RPG_TIER1_CLASSES, rpgClassExpToNext, rpgClassName,
  rpgClassSlots, rpgDefaultWeapons, rpgHand, rpgHoldsTier1, rpgIsHealer, rpgIsTier0, rpgPromotionWaits, rpgReadyParent, rpgRework,
  rpgSuggestedPromotion, umaClassTree, type BattleOutfit, type OwnedUma, type RpgClass, type RpgClassTile, type RpgClassTileState,
  type RpgSlotKind, type RpgTier0Class, type RpgTier1Class, type RpgWeapon, type TierWorld,
} from '@rpg/domain'
import { classRankWord, tier0RankWord, waitingWord } from '../../ui/rank-words'

const num = (n: number) => n.toLocaleString('en-US')
type Uma = Pick<OwnedUma, 'classId' | 'ranks' | 'classes'>

// --- Words (profile v2's wording list, C3; H120 decision 11) -------------------------------------------------------------

/** A class's slots: "3 Arms", "2 Arms + 1 Tome", "2 Tomes + 1 Arm", "3 Tomes"; a Tier 0's "Any 3 weapons". */
export function slotsWord(slots: readonly RpgSlotKind[]): string {
  if (slots.every((s) => s === 'any')) return `Any ${slots.length} weapons`
  const lead = slots[0] === 'tome' ? 'tome' : 'arms'
  const count = (c: 'arms' | 'tome') => slots.filter((s) => (s === 'tome') === (c === 'tome')).length
  const part = (c: 'arms' | 'tome') => { const n = count(c); return n ? `${n} ${c === 'tome' ? 'Tome' : 'Arm'}${n === 1 ? '' : 's'}` : null }
  return [part(lead), part(lead === 'tome' ? 'arms' : 'tome')].filter((p): p is string => !!p).join(' + ')
}
/** A Tier 1 class's role in a few words (H120's wording list). */
const ROLE: Readonly<Record<RpgTier1Class, string>> = {
  brawler: 'One act ×1', mage: 'One cast ×1', spellblade: 'Multi-hit', tomeblade: 'Multi-hit',
  armsummoner: 'Area · lingers', summoner: 'Area · lingers', paladin: 'Healer · ATK', cleric: 'Healer · M.ATK',
}
/** Her hand, half by half in her slots' order: "Hand · Arms ×0.57 · Tome ×0.46"; a pure class's one half. */
export function handWord(classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): string {
  const hand = rpgHand({ classId }, engine)
  const halves = [...new Set(rpgClassSlots(classId, engine).flatMap((s) => (s === 'any' ? ['arms', 'tome'] as const : [s === 'tome' ? 'tome' as const : 'arms' as const])))]
  return `Hand · ${halves.map((h) => `${h === 'tome' ? 'Tome' : 'Arms'} ×${+hand[h].toFixed(2)}`).join(' · ')}`
}
/** A tile's word in the tree: its rank ("R34", a Tier 0's "R7/10"), "Ready", "R1 · free" or "Closed". */
export function tileWord(tile: Pick<RpgClassTile, 'state' | 'tier' | 'rank'>): string {
  switch (tile.state) {
    case 'ready': return 'Ready'
    case 'open': return 'R1 · free'
    case 'closed': return 'Closed'
    default: return tile.tier === 0 ? tier0RankWord(tile.rank) : classRankWord(tile.rank)
  }
}
/** The state's name on the selection's line (C7). */
const STATE_NAME: Readonly<Record<RpgClassTileState, string>> = { on: 'On', available: 'Held', ready: 'Ready', open: 'Open', closed: 'Closed' }

// --- The Classes sheet (§14.1, CV32) --------------------------------------------------------------------------------------

/** One class on the tree, with its name and word. */
export interface ClassTileView extends RpgClassTile { name: string; word: string }
/** One row of the grid: its label ("Tier 0", "Tier 1", or none for a second Tier 1 row) and a cell a column, null where
 * the column has no class. */
export interface ClassGridRow { label: string | null; cells: (ClassTileView | null)[] }
/** The tree's grid: the roots over their columns (none before v19), the column count and the rows. */
export interface ClassGrid { roots: { name: string; span: number }[] | null; columns: number; rows: ClassGridRow[] }

/** Her tiles in the tree's order (`umaClassTree`), named by the generation. */
export function classTiles(outfit: BattleOutfit, uma: Uma, tier: number | string = 1, engine: number = BATTLE_ENGINE_VERSION): ClassTileView[] {
  return umaClassTree(uma, outfit, tier, engine).map((t) => ({ ...t, name: rpgClassName(t.classId, engine), word: tileWord(t) }))
}
/** The Tier 0 whose column a Tier 1 class sits in: its All-Rounder parent, else its only one (Brawler under Recruit,
 * Sorcerer under Initiate, each All-Rounder's two under it, the Arms child above the Tome one). */
const columnOf = (classId: RpgTier1Class): number => {
  const parents = RPG_CLASS_PARENTS[classId]
  const home = parents.find((p) => RPG_TIER0_ROOT[p] === 'all-rounder') ?? parents[0]!
  return RPG_TIER0_CLASSES.indexOf(home)
}
/**
 * The tiles laid out as the promotion page draws the tree (CV1): from v19 five columns under the three roots, Warrior ·
 * All-Rounder · Mage, the Tier 0 row (Tier 1's world only, CV10) over two Tier 1 rows; before v19 the generation's classes
 * in rows of three, no roots.
 */
export function classGrid(tiles: readonly ClassTileView[], engine: number = BATTLE_ENGINE_VERSION): ClassGrid {
  if (!rpgRework('classes', engine)) {
    const rows: ClassGridRow[] = []
    for (let i = 0; i < tiles.length; i += 3) rows.push({ label: null, cells: tiles.slice(i, i + 3) })
    return { roots: null, columns: 3, rows }
  }
  const byId = new Map(tiles.map((t) => [t.classId, t]))
  const columns = RPG_TIER0_CLASSES.length
  const roots = RPG_CLASS_ROOTS.map((root) => ({ name: RPG_ROOT_NAME[root], span: RPG_TIER0_CLASSES.filter((c) => RPG_TIER0_ROOT[c] === root).length }))
  const rows: ClassGridRow[] = []
  if (RPG_TIER0_CLASSES.some((c) => byId.has(c))) rows.push({ label: 'Tier 0', cells: RPG_TIER0_CLASSES.map((c) => byId.get(c) ?? null) })
  const stacks = RPG_TIER0_CLASSES.map((_, col) => RPG_TIER1_CLASSES.filter((c) => columnOf(c) === col))
  const depth = Math.max(...stacks.map((s) => s.length))
  for (let r = 0; r < depth; r++) {
    rows.push({ label: r === 0 ? 'Tier 1' : null, cells: stacks.map((s) => (s[r] ? byId.get(s[r]!) ?? null : null)) })
  }
  return { roots, columns, rows }
}

/** The selection's line under the tree: its name and state, its slots and role (a Tier 0: any three weapons and her skill,
 * then what it promotes to), its default weapons (none for a Tier 0), its hand, and the healer note. */
export interface ClassLine { title: string; facts: string[]; weapons: RpgWeapon[]; hand: string; healer: string | null }
/** What the footer does: switch to a held class, start an open one at Rank 1, or promote (the promotion sheet). */
export type ClassAct = 'switch' | 'start' | 'promote'
/** The footer for the selection: its label, and its act (null: disabled, the label then saying why). */
export interface ClassFooter { label: string; act: ClassAct | null }

/** "Party 1: 2 healers" when `classId` is a healer and her party would fight with two (one healer a party, C8), or null. */
export function healerWarning(world: Pick<TierWorld, 'umas' | 'parties'>, outfitId: string, classId: RpgClass, outfits: ReadonlyMap<string, BattleOutfit>,
  tier: number | string = 1, engine: number = BATTLE_ENGINE_VERSION): string | null {
  const party = partyOf(world as TierWorld, outfitId)
  const uma = world.umas[outfitId]
  if (!party || !uma || !rpgIsHealer(classId, engine)) return null
  const asIf = { umas: { ...world.umas, [outfitId]: { ...uma, classId } } }
  const ids = (world.parties[party.party]?.slots ?? []).filter((s): s is string => s !== null)
  return healerBlock(asIf, ids, outfits, engine, tier) ? `Party ${party.party + 1}: 2 healers` : null
}
/** The selection's line. */
export function classLine(tile: ClassTileView, engine: number = BATTLE_ENGINE_VERSION): Omit<ClassLine, 'healer'> {
  const title = `${tile.name} · ${STATE_NAME[tile.state]}`
  const slots = slotsWord(rpgClassSlots(tile.classId, engine))
  if (rpgRework('classes', engine) && rpgIsTier0(tile.classId)) {
    return { title, facts: [`${slots} · ${RPG_TIER0_SKILL[tile.classId]}`,
      `Promotes to ${RPG_CLASS_CHILDREN[tile.classId].map((c) => rpgClassName(c, engine)).join(', ')}`], weapons: [], hand: handWord(tile.classId, engine) }
  }
  const role = rpgRework('classes', engine) ? ROLE[tile.classId as RpgTier1Class] : null
  return { title, facts: [role ? `${slots} · ${role}` : slots], weapons: rpgDefaultWeapons(tile.classId, engine), hand: handWord(tile.classId, engine) }
}
/** The footer for a tile, by its state: On "Fights as …" (disabled; H120 puts the standard preset here), a held class
 * "Fight as …", a Ready one "Promote to …", an open one "Start … · R1", a closed one its gate, disabled. */
export function classFooter(tile: ClassTileView): ClassFooter {
  switch (tile.state) {
    case 'on': return { label: `Fights as ${tile.name}`, act: null }
    case 'available': return { label: `Fight as ${tile.name}`, act: 'switch' }
    case 'ready': return { label: `Promote to ${tile.name}`, act: 'promote' }
    case 'open': return { label: `Start ${tile.name} · R1`, act: 'start' }
    case 'closed': return { label: tile.gate ?? 'Closed', act: null }
  }
}

/** The Classes sheet: the grid, the selection (`selected`, else her active class), its line and its footer. */
export interface ClassesSheetView { grid: ClassGrid; selected: ClassTileView; line: ClassLine; footer: ClassFooter }
export function classesSheet(outfit: BattleOutfit, uma: Uma, world: Pick<TierWorld, 'umas' | 'parties'>, tier: number | string, selected: RpgClass | null,
  outfits?: ReadonlyMap<string, BattleOutfit>, engine: number = BATTLE_ENGINE_VERSION): ClassesSheetView {
  const tiles = classTiles(outfit, uma, tier, engine)
  const pick = tiles.find((t) => t.classId === selected) ?? tiles.find((t) => t.state === 'on') ?? tiles[0]!
  const healer = outfits ? healerWarning(world, outfit.outfitId, pick.classId, outfits, tier, engine) : null
  return { grid: classGrid(tiles, engine), selected: pick, line: { ...classLine(pick, engine), healer }, footer: classFooter(pick) }
}

// --- The promotion sheet (§14.2) ------------------------------------------------------------------------------------------

/**
 * The Tier 0 a promotion sheet promotes from (H120 decision 4), or null. Opened for a child (a Ready tile): the Tier 0 she
 * fights as when it is one of its parents at Rank 10, else its first parent at Rank 10 in the table's order. Opened from
 * the class button: the Tier 0 she fights as while a promotion waits on it (`rpgPromotionWaits`).
 */
export function promotionFrom(outfit: BattleOutfit, uma: Uma, tier: number | string = 1, child: RpgTier1Class | null = null,
  engine: number = BATTLE_ENGINE_VERSION): RpgTier0Class | null {
  if (!rpgRework('classes', engine) || Number(tier) !== 1) return null
  const active = activeClass(outfit, uma, tier, engine)
  if (!child) return rpgIsTier0(active) && rpgPromotionWaits(uma.ranks, active, tier, engine) ? active : null
  if (rpgIsTier0(active) && RPG_CLASS_PARENTS[child].includes(active) && classTrack(uma.ranks, active).rank >= RPG_TIER0_MAX_RANK) return active
  return rpgReadyParent(uma.ranks, child)
}

/** One child on the promotion sheet; a row the same on every tile is left out (null). */
export interface PromotionTileView {
  classId: RpgTier1Class
  name: string
  /** "Suggested" (CV11) or "Held" (she holds it already). */
  badge: 'Suggested' | 'Held' | null
  held: boolean
  slots: string | null
  weapons: RpgWeapon[]
  role: string | null
}
/** The promotion sheet: its title and caption, the children, the selection, before → after, and the footer. */
export interface PromotionView {
  from: RpgTier0Class
  title: string
  caption: string
  tiles: PromotionTileView[]
  selected: PromotionTileView
  /** "Recruit R10 → Brawler R10" (22 px), or a held child's "Brawler R14". */
  before: string
  /** "Depths 1–2 · 6 skills · +400 EXP", or null on a held child. */
  after: string | null
  footer: { label: string; act: 'promote' | 'switch' | null; block: string | null }
}
/**
 * Her promotion from `from` (a Tier 0 at Rank 10): one tile a child, Suggested on `rpgSuggestedPromotion`'s, Held on one she
 * holds, each with its slots, three defaults and role where they differ; the selection `selected`, else the Suggested
 * child she doesn't hold, else the first she doesn't hold; before → after from `promotionPlan` (the rank after the waiting
 * EXP lands, its depths and skills, the EXP and any Class Marks past Rank 50); the footer "Promote to …" (free, no
 * confirm; `block` from the plan), or on a held child "Fight as …".
 */
export function promotionSheet(outfit: BattleOutfit, uma: Uma, tier: number | string, from: RpgTier0Class, selected: RpgTier1Class | null = null,
  engine: number = BATTLE_ENGINE_VERSION): PromotionView {
  const children = RPG_CLASS_CHILDREN[from]
  const suggested = rpgSuggestedPromotion(from, outfit.baseStats)
  const slots = children.map((c) => slotsWord(rpgClassSlots(c, engine)))
  const roles = children.map((c) => ROLE[c])
  const differs = (row: readonly string[]) => new Set(row).size > 1
  const tiles = children.map((c, i): PromotionTileView => {
    const held = rpgHoldsTier1(uma.ranks, c)
    return { classId: c, name: rpgClassName(c, engine), badge: held ? 'Held' : c === suggested ? 'Suggested' : null, held,
      slots: differs(slots) ? slots[i]! : null, weapons: rpgDefaultWeapons(c, engine), role: differs(roles) ? roles[i]! : null }
  })
  const pick = tiles.find((t) => t.classId === selected) ?? tiles.find((t) => t.classId === suggested && !t.held) ?? tiles.find((t) => !t.held) ?? tiles[0]!
  const fromName = rpgClassName(from, engine)
  const base = { from, title: `Promote · ${fromName} R${RPG_TIER0_MAX_RANK}`, caption: 'Free · the others stay open', tiles, selected: pick }
  if (pick.held) {
    const on = activeClass(outfit, uma, tier, engine) === pick.classId
    return { ...base, before: `${pick.name} ${classRankWord(classTrack(uma.ranks, pick.classId).rank)}`, after: null,
      footer: on ? { label: `Fights as ${pick.name}`, act: null, block: null } : { label: `Fight as ${pick.name}`, act: 'switch', block: null } }
  }
  const plan = promotionPlan(uma, from, pick.classId, tier, engine)
  const after = [`Depths 1–${plan.depths}`, `${plan.skills} skills`, plan.waiting ? `+${num(plan.waiting)} EXP` : null,
    plan.marks ? `+${num(plan.marks)} Class Marks` : null].filter((p): p is string => !!p).join(' · ')
  return { ...base, before: `${fromName} R${RPG_TIER0_MAX_RANK} → ${pick.name} ${classRankWord(plan.after.rank)}`, after,
    footer: { label: `Promote to ${pick.name}`, act: 'promote', block: plan.block } }
}

// --- The Skills tab's pieces (§14.1) -------------------------------------------------------------------------------------

/** The class button: her class's name and its word ("R34"; a Tier 0's "R7/10"; "Promote" while a promotion waits, with
 * the Ready dot), and the Tier 0 it promotes from then (the button opens the promotion sheet, else the Classes sheet). */
export interface ClassButtonView { classId: RpgClass; name: string; word: string; promote: RpgTier0Class | null }
export function classButton(outfit: BattleOutfit, uma: Uma, tier: number | string = 1, engine: number = BATTLE_ENGINE_VERSION): ClassButtonView {
  const classId = activeClass(outfit, uma, tier, engine)
  const rank = classTrack(uma.ranks, classId).rank
  const tier0 = rpgRework('classes', engine) && rpgIsTier0(classId)
  const promote = promotionFrom(outfit, uma, tier, null, engine)
  return { classId, name: rpgClassName(classId, engine), word: promote ? 'Promote' : tier0 ? tier0RankWord(rank) : classRankWord(rank), promote }
}

/** A Tier 0's EXP from Class Rank 1, and what Rank 10 takes (3,600): the promotion line's bar. */
export function tier0Progress(classId: RpgTier0Class, track: { rank: number; exp: number }, engine: number = BATTLE_ENGINE_VERSION): { value: number; max: number } {
  let max = 0, value = 0
  for (let r = 1; r < RPG_TIER0_MAX_RANK; r++) {
    const step = rpgClassExpToNext(classId, r, engine)
    max += step
    if (r < track.rank) value += step
  }
  return { value: Math.min(max, track.rank >= RPG_TIER0_MAX_RANK ? max : value + track.exp), max }
}
/** The Tier 0 tree's promotion line: "Promotion at R10 · 3 to go" with its bar to 10; at Rank 10 while a promotion waits
 * "Promotion · +400 EXP waiting" ("Promotion · Ready" with none), which opens the promotion sheet; null otherwise (every
 * child held). */
export interface PromotionLineView { text: string; value: number; max: number; opens: boolean }
export function promotionLine(uma: Uma, classId: RpgTier0Class, tier: number | string = 1, engine: number = BATTLE_ENGINE_VERSION): PromotionLineView | null {
  const track = classTrack(uma.ranks, classId)
  if (track.rank < RPG_TIER0_MAX_RANK) {
    return { text: `Promotion at R${RPG_TIER0_MAX_RANK} · ${RPG_TIER0_MAX_RANK - track.rank} to go`, ...tier0Progress(classId, track, engine), opens: false }
  }
  if (!rpgPromotionWaits(uma.ranks, classId, tier, engine)) return null
  return { text: track.exp > 0 ? `Promotion · ${waitingWord(track.exp)}` : 'Promotion · Ready', value: 1, max: 1, opens: true }
}
/** A Tier 0 node's title: her skill and the weapon that casts it, "Drill Strike · Lance" (the catalog names it by the
 * skill alone, CV6). */
export const tier0NodeTitle = (skill: string, weapon: string): string => `${skill} · ${weapon}`
