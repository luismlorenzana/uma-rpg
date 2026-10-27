// The live docs' generated blocks (docs/game/, D92): every list in the game manual is rendered here from the rules, so it
// can't drift from the game. A doc marks a block with `<!-- live:<key> -->` … `<!-- /live -->`; `pnpm docs:update` rewrites
// them, and `docs.test.ts` fails when one is stale. Pure: no I/O (the test reads and writes the files).
import {
  BATTLE_LAURELS, EXP_PER_MINUTE, FIRST_CLEAR_LAURELS, LATE_LAURELS, makeMinutesV4, MAX_JOB_COUNT,
  POINT_EVASION, POINT_HP, POINT_LIMIT, REFINE_BATCHES, PROFESSION_MAX_LEVEL, professionExpToNext, REPLAY_SHARE,
  STEP_MINUTES, stepMinutes, SWEEP_TICKET_PRICE, TIME_TICKET_PRICE, TIME_TICKET_SPAN,
} from '../economy/pacing'
import { MAX_QUEUE } from '@luismlorenzana/uma-work'
import {
  ACCESSORY_FAMILY_LABEL, BELL_PERMILLE_PER_GRADE, INSIGNIA_PERMILLE_PER_GRADE, ORB_T1, PENDANT_T1, signatureBonus,
} from '../economy/accessories'
import { armorValues, GRADE_MAX, gradeGateLevel, mightAt, TIER_SCALE_TENTHS, type GearTier } from '../economy/grades'
import { MOON_T1, PLANET_T1, PROWESS_SPLIT, TEMPLATE_T1 } from '../economy/planet'
import { PLACE_SLOTS_V3, PLACE_SPEED_V3, professionById, TRADES } from '../economy/professions'
import { isMakingPlaceV4, isProcessingPlaceV4, PLACES_V4 } from '../economy/places-v4'
import { stockName } from '../economy/stock'
import { madeName } from '../items/made'
import { madeRecipeV4, RECIPE_V4 } from '../items/made-v4'
import { MADE_IDENTITIES } from '../items/made-id'
import { lineItems, MATERIAL_LINES, type MaterialLine } from '../items/lines'
import { RAW_PRICE_V3, SELL_RAW_V3 } from '../save/exchange'
import {
  BATTLE_ENGINE_VERSION, BATTLE_FLOURISH_FROM, BATTLE_FLOURISH_RATE, BATTLE_FLOURISH_SHARE, BATTLE_HEAL_OFFENSE_SCALE,
  BATTLE_REGEN_ROUNDS, RPG_BASE_MP_REGEN, RPG_BASE_MP_REGEN_DEPTHS, RPG_BASE_MP_REGEN_V17,
} from '../rpg/battle/caps'
import { CLASS_EXP_SHARE, CLASS_MAX_RANK, classExpToNext, MANUAL_EXP, MANUAL_PRICE, MARKS_SHARE, WEAPON_LABEL } from '../economy/ranks'
import { HUB_PAGE_NAMES, HUB_PAGES, placeById, placesOn } from '../hub/places'
import { gradeUnlockLevel } from '../items/catalog'
import { BATTLE_LIMIT_CHARGE, BATTLE_LIMIT_MAX, BATTLE_LIMIT_NAMES, BATTLE_LIMIT_POWER } from '../rpg/battle/limit'
import * as K from '../rpg/battle/skills'
import {
  BOND_EXP_PER_WIN, BOND_EXP_TO_NEXT, BOND_MAX_LEVEL, bondCapacity, HERO_HALLS, HERO_LIMIT_POWER,
  HERO_LIMIT_SUPPORT_SHARE, HERO_LIMITS, HERO_MAX_LEARNERS, heroLimitFor, heroLimitKinds, heroLimitPower,
  LEARNER_MAX_PARENTS, type HeroCast, type HeroLimitId,
} from '../rpg/heroes'
import {
  RPG_CLERIC_STATUS, RPG_PALADIN_AEGIS, RPG_PALADIN_SHIELD_SHARE, RPG_PIERCE_SCALE, RPG_SKILL_MP, RPG_SKILL_POWER,
  RPG_SUPPORT_ALL, RPG_SUPPORT_SHARE, RPG_SUPPORT_SHARE_V15, rpgNode, rpgNodeSkill, rpgTreeOf,
} from '../rpg/catalog'
import { RPG_BRANCH_B_NAME, rpgBranchNode } from '../rpg/node-identity'
import {
  rpgBattleExp, RPG_BATTLE_EXP_WEIGHTS, RPG_LEVEL_EXP_MAX, RPG_LEVEL_EXP_MIN, RPG_LEVEL_EXP_STEP, RPG_SHARD_LEVELS,
} from '../rpg/campaign/rewards'
import { RPG_FOE_TUNING, rpgFoe, rpgFoeBudget, rpgFoeShields, rpgFoeTierBudget, type RpgFoeRole } from '../rpg/campaign/enemies'
import { balanceMember, onCurveGrade } from '../world/balance-party'
import {
  isRpgTome, RPG_ACTIVE_SLOT_GATES, RPG_BASE_ACTIVE_SLOTS, RPG_CLASS_ARMOR, RPG_CLASS_SLOTS, RPG_CLASS_STATS,
  RPG_CLASSES, RPG_DEPTH_GATES, RPG_SKILL_RANK_FACTOR, RPG_SKILL_RANK_MAX, RPG_SKILL_RANK_STEP, RPG_TIER_MAX_LEVEL,
  RPG_TWIN_SETS, RPG_WEAPONS, rpgClasses, rpgClassWeapons, isRpgWeaponKind, rpgDefaultWeapons, rpgExpToNext, rpgHand,
  rpgOpenDepth, rpgTwinsOf, rpgWeaponKind, type RpgClass, type RpgWeapon,
} from '../rpg/rules'
import { ACHIEVEMENTS, type AchievementDef } from '../rift/achievements'
import { RIFT_FRONT_SPECS, riftGuidedBuild, riftShape, riftTuning, type RiftSlot } from '../rift/fronts'
import { riftStrength } from '../rift/generate'
import { RIFT_RUN_FIGHTS, riftShapeOf } from '../rift/picker'
import { CONVERGENCE_FIGHTS, ECHO_LEVELS, RIFT_FRONTS, RIFT_OPEN_AT, RIFT_ROSTER, RIFT_STAGES, RIFT_TIERS } from '../rift/state'
import { ASCEND_PURSE, BANKED_EXP_PER_MARK, BANKED_MARKS_CAP, ECHO_RANK_PAY, echoFoeLevel } from '../save/rift'
import { classPresetV3 } from '../save/presets'
import { TIERS } from '../save/rules'
import { BIOMES } from '../world/biomes'
import {
  FLOURISH_NAMES, KNACK_STAT, STRIDE_FLOURISH, STRIDE_LABEL, UMA_KNACK_WORDS, UMA_KNACKS, UMA_ROW_CALLING,
  UMA_ROW_PICK, UMA_STRIDES, UMA_TYPE_NAMES, type UmaCallingRow,
} from '../roster/template'
import { bandFranchise, capitalFranchise, FRANCHISES } from '../world/roster'
import {
  BOSS_WAVES, CONTINENT_LEAN, regionChapter, SPRING_RECHARGE_MS, WAVE_HP, WAVE_PAY, WAVE_STAGES, WORLD_ESCORT,
  WORLD_FORMATIONS, WORLD_BOSS_TWICE_FROM, WORLD_REGION_LEVELS, WORLD_REGIONS_PER_ROW, WORLD_ROWS, WORLD_STAGES,
  WORLD_TUNING, worldContinent,
} from '../world/world'

type Cell = string | number
/** A Markdown table; pipes in cells are escaped. */
function table(head: readonly string[], rows: readonly (readonly Cell[])[]): string {
  const cell = (v: Cell) => String(v).replace(/\|/g, '\\|').replace(/\n/g, ' ')
  return [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n')
}
const pct = (n: number) => `${Math.round(n * 1000) / 10}%`
const x = (n: number) => `×${n}`
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const CLASS_NAME: Readonly<Record<RpgClass, string>> = {
  brawler: 'Brawler', mage: 'Mage', spellblade: 'Spell Blade', cleric: 'Cleric', summoner: 'Summoner', paladin: 'Paladin',
}
const weaponName = (w: RpgWeapon): string => WEAPON_LABEL[w]
const itemName = (id: string) => stockName(id)
const inputs = (list: Record<string, number>) => Object.entries(list).map(([id, n]) => `${n > 1 ? `${n}× ` : ''}${itemName(id)}`).join(', ')

/** Each kind's one shape in every class (D86). */
const SHAPE: Readonly<Record<string, string>> = {
  greatsword: 'One foe, heavy', fire: 'One foe, heavy', axe: 'Every foe', ice: 'Every foe', lance: 'Random foes', lightning: 'Random foes',
  bow: 'One foe, many hits', light: 'One foe, many hits', katana: 'Twice: the foe and one other', dark: 'Twice: the foe and one other',
}
/** The classes' own Limit Breaks, retired by D112: fights from engine v6–v9 still replay with them. */
const RETIRED_LIMIT_OF: Readonly<Record<RpgClass, string>> = {
  brawler: `${BATTLE_LIMIT_NAMES.twin}: one equipped skill cast twice at full power, or two Attacks with a weapon`,
  mage: `${BATTLE_LIMIT_NAMES.mage}: a hit of each of the five elements, ${BATTLE_LIMIT_POWER.mage}× her open depth's power in all`,
  spellblade: `${BATTLE_LIMIT_NAMES.arts}: an Arms skill and a Tome skill, both at full power (no half)`,
  cleric: `${BATTLE_LIMIT_NAMES.cleric}: a hit with each of her five weapons (${BATTLE_LIMIT_POWER.cleric}× in all), each status at 3 stacks`,
  summoner: `${BATTLE_LIMIT_NAMES.grand}: one summon at twice her strength that lingers at twice its share`,
  paladin: 'none: she came with engine v15',
}
/** The calling rule's rows in words (uma-templates §2.2, CP29), the first that fits. */
const CALLING_ROW: Readonly<Record<UmaCallingRow, string>> = {
  1: 'Front runners', 2: 'Late + End closers', 3: 'End closers',
  4: 'Pace sprinters, Power over Wit', 5: 'Pace chasers, Power over Wit', 6: 'Pace chasers, Wit at or over Power',
  7: 'Late surgers, Power over Wit', 8: 'Late surgers, Wit at or over Power',
}
/** Her calling, the class a new unlock starts in (engine v16, CP29): the rows that call her class, and "or picked" where
 * another row's pick names it. */
function callingOf(c: RpgClass): string {
  const rows = (Object.keys(CALLING_ROW).map(Number) as UmaCallingRow[])
  const own = rows.filter((r) => UMA_ROW_CALLING[r] === c).map((r) => CALLING_ROW[r])
  const picked = rows.some((r) => UMA_ROW_CALLING[r] !== c && UMA_ROW_PICK[r]?.includes(c))
  return `${own.join('; ')}${picked ? ', or picked' : ''}`
}

/** Her weapon slots by channel, the lead channel first: "3 Arms", "2 Arms + 1 Tome", "1 Arm + 2 Tomes" (CP2). */
function slots(c: RpgClass): string {
  const s = RPG_CLASS_SLOTS[c]
  if (s.includes('any')) return `Any ${s.length}`
  const count = (k: 'arms' | 'tome') => s.filter((x) => x === k).length
  const word = (k: 'arms' | 'tome', n: number) => (k === 'arms' ? (n === 1 ? 'Arm' : 'Arms') : n === 1 ? 'Tome' : 'Tomes')
  return [...new Set(s)].map((k) => `${count(k as 'arms' | 'tome')} ${word(k as 'arms' | 'tome', count(k as 'arms' | 'tome'))}`).join(' + ')
}

// --- Classes and skills ---------------------------------------------------------------------------------------------

/** Her hand (D179): one power for a single-half class, each half's for a pair class (classes v2: H55, H60). */
function handOf(c: RpgClass): string {
  const h = rpgHand({ classId: c })
  return h.pair ? `${x(h.arms)} Arms, ${x(h.tome)} Tome; MP ${x(h.mp)} a half` : `${x(h.power)}, MP ${x(h.mp)}`
}
/** What sets each class apart in classes v2 (§3, §4), with the live numbers. */
function special(c: RpgClass): string {
  const h = rpgHand({ classId: c })
  switch (c) {
    case 'spellblade': return 'Every act is an Arms half and a Tome half, the Arms half first; it lands one extra hit'
    case 'summoner': return `Every act is a Tome summon and an Arms summon, the Tome half first. The Tome summon lingers; when her next pair comes, ` +
      `it strikes every foe at ${h.linger} × ${K.BATTLE_FAREWELL_FACTOR}. No support`
    case 'paladin': return 'Healer, from ATK. Blows debuff the foe and Barrier the threatened Uma; spells bless, mend and cleanse. ' +
      'Blizzard spells Barrier every Uma, Greatsword blows give Aegis'
    case 'cleric': return 'Healer, from M.ATK. Blows debuff the foe and Barrier the threatened Uma; spells bless, mend and cleanse. ' +
      'Light spells leave Regen, Dark spells drain'
    default: return '—'
  }
}
function classes(): string {
  return table(['Class', 'Slots', 'Trees', 'Hand: power, MP', 'Special', 'Stat lean (HP, ATK, MATK, DEF, MDEF, MP)', 'Limit Break power', 'Her calling (starts as)', 'Starting armor'],
    RPG_CLASSES.map((c) => {
      const s = RPG_CLASS_STATS[c]
      return [CLASS_NAME[c], slots(c), rpgClassWeapons(c).length, handOf(c), special(c),
        [s.hp, s.atk, s.matk, s.pdef, s.mdef, s.mp].map((v) => x(v)).join(' '), `${HERO_LIMIT_POWER[c]}× her open depth`, callingOf(c), cap(RPG_CLASS_ARMOR[c])]
    }))
}

/** Her template (engine v16, D203, D204): the 18 types by calling and stride, the knack words, the Flourish by stride. */
function templates(): string {
  const most = pct(BATTLE_FLOURISH_SHARE)
  const flourish = (f: (typeof STRIDE_FLOURISH)[keyof typeof STRIDE_FLOURISH]) => f === 'clean-break' ? `a Barrier of ${most} of her max HP at the start`
    : f === 'even-pace' ? `${pct(BATTLE_FLOURISH_RATE['even-pace'])} of her max HP at each round's end, up to ${most}`
    : `${pct(BATTLE_FLOURISH_RATE['late-reserve'])} of her max HP at each round's end from round ${BATTLE_FLOURISH_FROM}, up to ${most}`
  return table(['Calling', ...UMA_STRIDES.map((s) => STRIDE_LABEL[s])], RPG_CLASSES.map((c) => [CLASS_NAME[c], ...UMA_STRIDES.map((s) => UMA_TYPE_NAMES[c][s])])) +
    '\n\n' + table(['Knack: her top growth rate', 'Word'], UMA_KNACKS.map((k) => [cap(KNACK_STAT[k]), UMA_KNACK_WORDS[k]])) +
    '\n\n' + table(['Stride: her longest distance at her best grade', 'Flourish', 'As her calling'], UMA_STRIDES.map((s) =>
      [`${STRIDE_LABEL[s]} (${s === 'dash' ? 'Sprint or Mile' : s === 'middle' ? 'Medium' : 'Long'})`, FLOURISH_NAMES[STRIDE_FLOURISH[s]], flourish(STRIDE_FLOURISH[s])]))
}

/** Each class's standard preset (H33, D164; R2's, WP25, live since H82): her three weapons, her armor half and her one
 * accessory slot's form. */
function presets(): string {
  return table(['Class', 'Weapons', 'Armor', 'Accessory'], RPG_CLASSES.map((c) => {
    const p = classPresetV3(c)
    const a = p.accessory
    return [CLASS_NAME[c], p.weapons.map(weaponName).join(', '), cap(p.armor), `${ACCESSORY_FAMILY_LABEL[a.family]}${a.kind ? ` (${kindName(a.kind)})` : ''}`]
  }))
}
/** A damage kind's name: a weapon's, or a Tome's element. */
const kindName = (k: string): string => WEAPON_LABEL[(isRpgWeaponKind(k) ? k : `tome-${k}`) as RpgWeapon]

function weapons(): string {
  return table(['Weapon', 'Id', 'Kind', 'Channel', 'Shape', 'Healer status', 'Classes'], RPG_WEAPONS.map((w) => {
    const kind = rpgWeaponKind(w)
    return [weaponName(w), `\`${w}\``, cap(kind), isRpgTome(w) ? 'Magical' : 'Physical', SHAPE[kind]!, statusName(RPG_CLERIC_STATUS[w]),
      RPG_CLASSES.filter((c) => rpgClassWeapons(c).includes(w)).map((c) => CLASS_NAME[c]).join(', ')]
  }))
}
const STATUS_NAME: Readonly<Record<string, string>> = {
  'armor-break': 'Armor Break', 'mind-break': 'Mind Break', enfeeble: 'Enfeeble', shatter: 'Shatter', hex: 'Hex',
  brave: 'Brave', faith: 'Faith', aegis: 'Aegis', breaker: 'Breaker', clarity: 'Clarity',
}
const statusName = (key: string) => STATUS_NAME[key] ?? key

/** Engine v16's depths (CP14, CP16, CP32): a Class Rank gate each, and Skill Ranks every 2 Class Ranks after it. */
function depths(): string {
  const power = (d: number, rank: number) => Math.round(RPG_SKILL_POWER[d - 1]! * RPG_SKILL_RANK_FACTOR[rank - 1]! * 100) / 100
  return table(['Depth', 'Line', 'Opens at', `Ranks 2–${RPG_SKILL_RANK_MAX} at Class Rank`, 'Single-target power, Rank 1 → 5', 'Full-turn MP'],
    [1, 2, 3, 4, 5].map((d) => {
      const gate = RPG_DEPTH_GATES[d - 1]!
      return [d, d <= 2 ? 'Trunk' : d === 3 ? 'The fork: A or B' : 'Her line, A or B', `Class Rank ${gate}`,
        Array.from({ length: RPG_SKILL_RANK_MAX - 1 }, (_, i) => gate + (i + 1) * RPG_SKILL_RANK_STEP).join(', '),
        `${power(d, 1)} → ${power(d, RPG_SKILL_RANK_MAX)} (${RPG_SKILL_POWER[d - 1]!} at Rank 3)`, RPG_SKILL_MP[d - 1]!]
    }))
}

/** Each of her class's trees as engine v16 plays it (CP13, CP18): the trunk, line A and line B with its name; v16's defs. */
function skillTrees(): string {
  const out: string[] = []
  for (const c of RPG_CLASSES) {
    const hand = rpgHand({ classId: c })
    const before = hand.pair ? `${x(hand.arms)} on Arms, ${x(hand.tome)} on Tomes` : x(hand.power)
    out.push(`### ${CLASS_NAME[c]}`, '', `${rpgClassWeapons(c).length} trees; her three weapons choose three. Powers below are at Rank 3, before her ` +
      `hand (${before}) and her Skill Rank; MP is hers (${x(hand.mp)}).`, '')
    for (const w of rpgClassWeapons(c)) {
      const tree = rpgTreeOf(c, w)
      const bName = RPG_BRANCH_B_NAME[c][w]!
      out.push(`#### ${CLASS_NAME[c]} · ${weaponName(w)} (\`${tree}\`), B · ${bName}`, '')
      const rows: Cell[][] = []
      const row = (id: string, d: number, line: string) => {
        const node = rpgNode(id)!, def = rpgNodeSkill(node, BATTLE_ENGINE_VERSION)
        rows.push([d, `\`${id}\``, line, node.name, Math.max(1, Math.round(def.mp * hand.mp)), node.summary])
      }
      for (const d of [1, 2]) row(rpgBranchNode(c, w, d, 'A'), d, 'Trunk')
      for (const d of [3, 4, 5]) row(rpgBranchNode(c, w, d, 'A'), d, 'A')
      for (const d of [3, 4, 5]) row(rpgBranchNode(c, w, d, 'B'), d, `B · ${bName}`)
      out.push(table(['Depth', 'Node', 'Line', 'Name', 'MP', 'What it does'], rows), '')
    }
  }
  return out.join('\n').trimEnd()
}

/** D112: Limit Breaks only from the Halls of Heroes; the classes' own replay in older fights. */
function limits(): string {
  const v1 = rpgClasses(14)
  const v14 = (id: HeroLimitId) => heroLimitFor(id, 14)!.name
  return `**Limit Breaks come only from the Halls of Heroes** (D112, engine v10). A Hero always uses her seat's, at 100%; a ` +
    `Learner uses either of her Heroes', at ${bondCapacity(0) * 100}% plus 5% a Bond Level (${bondCapacity(BOND_MAX_LEVEL) * 100}% at ` +
    `Bond ${BOND_MAX_LEVEL}), her inherited hits at the higher of her ATK and M.ATK while their kinds still decide weaknesses ` +
    `and locks (v15, C3). An Uma who is neither has none, and her gauge has nothing to spend. At 100% a Limit Break is ` +
    `worth her class's power below, in single-target casts at her open depth:\n\n` +
    table(['Class', 'Limit Break power'], RPG_CLASSES.map((c) => [CLASS_NAME[c], `${HERO_LIMIT_POWER[c]}×`])) + '\n\n' +
    `A Limit Break that mends or raises a Barrier does it at ${pct(HERO_LIMIT_SUPPORT_SHARE)} of each Uma's max HP ×${RPG_SUPPORT_ALL}, × her ` +
    `healing scale and the cast's strength; its cleanse and its revive land at any strength. ` +
    `The gauge fills to ${BATTLE_LIMIT_MAX}: +${BATTLE_LIMIT_CHARGE.attack} for an Attack, +${BATTLE_LIMIT_CHARGE.skill} for a skill. A Limit Break costs no MP and takes her turn. ` +
    `Limit Breaks don't rank: their power follows her open depth, never her Skill Ranks. Since engine v16 ${heroLimitFor('paladin-3', 16)!.name} charges with ` +
    `an Axe and ${heroLimitFor('cleric-1', 16)!.name} strikes with Light, then Lightning (CP35); fights from v15 replay with ${heroLimitFor('paladin-3', 15)!.name}'s ` +
    `Greatsword and ${heroLimitFor('cleric-1', 15)!.name}' Light twice. ` +
    `Fights from engines v10–v14 replay with five halls' twenty: the Cleric Chapel's seats 3 and 4 ${v14('cleric-3')} and ${v14('cleric-4')}, ` +
    `${v14('spellblade-1')} in one cleave, ${v14('summoner-4')} on one foe, ` +
    v1.filter((c) => heroLimitPower(c, 14) !== heroLimitPower(c, 15)).map((c) => `the ${CLASS_NAME[c]} at ${heroLimitPower(c, 14)}×`).join(' and ') +
    `, and a Learner's hits at each kind's own offense. Fights from engines v6–v9 replay with the classes' retired Limit Breaks: ` +
    v1.map((c) => `${CLASS_NAME[c]} ${RETIRED_LIMIT_OF[c]}`).join('; ') + '.'
}

/** The Halls of Heroes (D106, D107): every seat's Limit Break, and the Bond numbers. */
function heroes(): string {
  const hall = (c: RpgClass) => placeById(HERO_HALLS[c])?.name ?? c
  const shape = (target: string) => (target === 'all' ? 'every foe' : target === 'random' ? 'random foes' : 'one foe')
  const support = (c: HeroCast): string[] => {
    const s = c.support
    return s ? [s.mend ? 'a mend on every ally' : '', s.shield ? 'a Barrier on every ally' : '', s.cleanse ? 'a cleanse' : '', s.revive ? 'the first fallen rises' : ''] : []
  }
  return table(['Hall', 'Seat', 'Limit Break', 'Kinds', 'What it does', 'Casts'], HERO_LIMITS.map((l) => [
    `${hall(l.classId)} (${CLASS_NAME[l.classId]})`, l.id.slice(l.id.lastIndexOf('-') + 1), l.name, heroLimitKinds(l).join(', '), l.blurb,
    l.casts.map((c) => [c.hits.length ? `${c.hits.length} hit${c.hits.length === 1 ? '' : 's'} on ${shape(c.target)}` : '', c.splash ? 'splash' : '',
      c.status ? `${c.status.key} ${c.status.stacks} on ${c.status.to === 'allies' ? 'every ally' : c.status.to === 'foes' ? 'every foe' : 'the foe'}` : '',
      ...support(c)]
      .filter(Boolean).join(' + ')).join('; '),
  ])) + '\n\n' + table(['Setting', 'Value'], [
    ['Seats', `4 per hall, ${RPG_CLASSES.length} halls, ${HERO_LIMITS.length} in all; a Hero sits in one seat`],
    ['Learners', `${HERO_MAX_LEARNERS} per Hero; ${LEARNER_MAX_PARENTS} Heroes per Learner; a Hero is never a Learner`],
    ['Power at 100%', `her own class's Limit Break, in single-target casts at her open depth: ${RPG_CLASSES.map((c) => `${CLASS_NAME[c]} ${HERO_LIMIT_POWER[c]}×`).join(', ')}`],
    ['Learner strength', `${bondCapacity(0) * 100}% at Bond 0, +5% a Bond Level, ${bondCapacity(BOND_MAX_LEVEL) * 100}% at Bond ${BOND_MAX_LEVEL}`],
    ['Bond EXP per won fight', `${BOND_EXP_PER_WIN.fight} a stage, ${BOND_EXP_PER_WIN.boss} an elite or boss, toward each of a Learner's Heroes, or a Hero's own seat; ${BOND_EXP_TO_NEXT} a level (Sweeps and replays count)`],
  ])
}

function battleConstants(): string {
  const rows: Cell[][] = [
    ['`BATTLE_WEAK`', K.BATTLE_WEAK, 'Damage multiplier of a weak hit'],
    ['`BATTLE_UNBROKEN_FACTOR`', K.BATTLE_UNBROKEN_FACTOR, 'Damage a foe takes while its shield stands'],
    ['`BATTLE_WARD_FACTOR`', K.BATTLE_WARD_FACTOR, 'v14: damage a Rift foe takes from the channel she wards, on top of the unbroken halving'],
    ['`BATTLE_DEFENSE_SHARE`', K.BATTLE_DEFENSE_SHARE, 'Before v12: share of defense subtracted from offense'],
    ['`BATTLE_MIN_OFFENSE_SHARE`', K.BATTLE_MIN_OFFENSE_SHARE, 'Before v12: a hit keeps at least this share of offense'],
    ['`BATTLE_GUARD_FACTOR`', K.BATTLE_GUARD_FACTOR, 'Damage a guarding ally takes for the one she covers'],
    ['`BATTLE_BREAK_ROUNDS`', K.BATTLE_BREAK_ROUNDS, 'Rounds a Break lasts (the foe loses its actions)'],
    ['`BATTLE_MAX_ROUNDS`', K.BATTLE_MAX_ROUNDS, 'Round cap per wave; past it the fight is lost'],
    ['`BATTLE_STATUS_TURNS`', K.BATTLE_STATUS_TURNS, 'Default rounds a status lasts'],
    ['`BATTLE_STATUS_STACK_CAP`', K.BATTLE_STATUS_STACK_CAP, 'Stacks a status can reach'],
    ['`BATTLE_STATUS_STEP`', K.BATTLE_STATUS_STEP, 'Per stack: Cleric statuses, Mark, Shock'],
    ['`BATTLE_FOE_STATUS_STEP`', K.BATTLE_FOE_STATUS_STEP, 'Per stack: foes\' Weaken, Slow, Power-up, Ward'],
    ['`BATTLE_BURN_PERCENT`', K.BATTLE_BURN_PERCENT, 'Max HP lost per Burn stack at the end of a round'],
    ['`BATTLE_CLARITY_PERCENT`', K.BATTLE_CLARITY_PERCENT, 'Max MP restored per Clarity stack'],
    ['`BATTLE_BARRIER_PERCENT`', K.BATTLE_BARRIER_PERCENT, 'Barrier per stack of a summon\'s rider, as a share of max HP'],
    ['`BATTLE_BARRIER_CAP`', K.BATTLE_BARRIER_CAP, 'Before v12: Barrier cap, as a share of max HP'],
    ['`BATTLE_COVER_CAP`', K.BATTLE_COVER_CAP, 'v12–v14: a skill Barrier\'s cap, as a share of max HP; it lasts the round'],
    ['`BATTLE_COVER_CAP_V15`', K.BATTLE_COVER_CAP_V15, 'v15: the same cap, for one healer\'s doubled Barriers'],
    ['`RPG_SUPPORT_SHARE`', RPG_SUPPORT_SHARE.join(', '), 'v12–v14: a mend\'s or Barrier\'s share of the target\'s max HP, by depth'],
    ['`RPG_SUPPORT_SHARE_V15`', RPG_SUPPORT_SHARE_V15.join(', '), 'v15: the same shares for the Paladin and the Cleric, doubled (one healer a party)'],
    ['`RPG_SUPPORT_ALL`', RPG_SUPPORT_ALL, 'v12: that share on every Uma, at depth 5, for summons (to v14) and Limit Breaks (v15)'],
    ['`BATTLE_HEAL_SCALE`', K.BATTLE_HEAL_SCALE, 'v12–v14: her Heal raises mends and Barriers ×(1 + Heal ÷ this)'],
    ['`BATTLE_HEAL_OFFENSE_SCALE`', BATTLE_HEAL_OFFENSE_SCALE, 'v15: mends, Barriers and revives ×(1 + offense ÷ this): a Paladin\'s ATK, a Cleric\'s M.ATK, anyone else\'s higher'],
    ['`BATTLE_REVIVE_SHARE`', K.BATTLE_REVIVE_SHARE, 'v12: a revive\'s share of max HP, before her healing scale'],
    ['`RPG_PALADIN_SHIELD_SHARE`', RPG_PALADIN_SHIELD_SHARE, `v15: a Paladin's Blizzard spell also Barriers every Uma at this share of its share (×${RPG_SUPPORT_ALL} on every Uma)`],
    ['`RPG_PALADIN_AEGIS`', RPG_PALADIN_AEGIS, 'v15: Aegis stacks a Paladin\'s Greatsword blow gives each Uma her Barrier reaches'],
    ['`BATTLE_REGEN_SHARE`', K.BATTLE_REGEN_SHARE, 'v15: a Cleric\'s Regen mends this share of her Light spell\'s mend'],
    ['`BATTLE_REGEN_ROUNDS`', BATTLE_REGEN_ROUNDS, 'v15: the round ends a Regen mends at: the spell\'s round and the next'],
    ['`BATTLE_FAREWELL_FACTOR`', K.BATTLE_FAREWELL_FACTOR, 'v15: a lingering Tome summon\'s farewell strike on each foe, × its linger share × its hits\' power'],
    ['`HERO_LIMIT_SUPPORT_SHARE`', HERO_LIMIT_SUPPORT_SHARE, `v15: a hall Limit Break's mend or Barrier, as a share of max HP, ×${RPG_SUPPORT_ALL} on every Uma`],
    ['`BATTLE_RALLY_SHARE`', K.BATTLE_RALLY_SHARE, 'v12: share of a foe hit she can Rally back'],
    ['`BATTLE_BREATHER`', K.BATTLE_BREATHER, 'v12: share of max HP every Uma recovers when a new wave enters'],
    ['`BATTLE_LIMIT_MAX`', BATTLE_LIMIT_MAX, 'Limit Break gauge'],
    ['`RPG_SKILL_RANK_FACTOR`', RPG_SKILL_RANK_FACTOR.join(', '), `v16: a skill's power at Skill Ranks 1–${RPG_SKILL_RANK_MAX}, a rank every ${RPG_SKILL_RANK_STEP} Class Ranks from its depth's gate; a healer's mend and Barrier shares too`],
    ['`RPG_PIERCE_SCALE`', RPG_PIERCE_SCALE, 'v16: a Pierce hit\'s power (the Spell Blade\'s B line, the Brawler\'s Katana B, the Mage\'s Dark B); it ignores the unbroken halving'],
    ['`RPG_BASE_MP_REGEN`', RPG_BASE_MP_REGEN, `v16: every Uma regains this share of her max MP at each round's end for each skill depth her Class Rank opens, at least 1, beside a Spring's`],
    ['`RPG_BASE_MP_REGEN_DEPTHS`', RPG_BASE_MP_REGEN_DEPTHS, `v16: the depths the base MP regen counts, at most (${pct(RPG_BASE_MP_REGEN * RPG_BASE_MP_REGEN_DEPTHS)} from Class Rank ${RPG_DEPTH_GATES[RPG_BASE_MP_REGEN_DEPTHS - 1]})`],
    ['`BATTLE_FLOURISH_SHARE`', BATTLE_FLOURISH_SHARE, 'v16: her Flourish gives this share of her max HP a fight, while she fights as her calling\'s class'],
    ['`BATTLE_FLOURISH_RATE`', `Even pace ${BATTLE_FLOURISH_RATE['even-pace']}, Late reserve ${BATTLE_FLOURISH_RATE['late-reserve']}`, 'v16: the share of her max HP those two Flourishes mend at a round\'s end'],
    ['`BATTLE_FLOURISH_FROM`', BATTLE_FLOURISH_FROM, 'v16: the first round whose end Late reserve mends at'],
    ['`RPG_BASE_MP_REGEN_V17`', RPG_BASE_MP_REGEN_V17, `v17: the base MP regen a depth (${pct(RPG_BASE_MP_REGEN_V17 * RPG_BASE_MP_REGEN_DEPTHS)} from Class Rank ${RPG_DEPTH_GATES[RPG_BASE_MP_REGEN_DEPTHS - 1]})`],
    ['`BELL_PERMILLE_PER_GRADE`', BELL_PERMILLE_PER_GRADE, 'v17: a Bell\'s follow-up, per mille of an Attack a grade, × her hand'],
    ['`INSIGNIA_PERMILLE_PER_GRADE`', INSIGNIA_PERMILLE_PER_GRADE, 'v17: an Insignia\'s extra damage on sub-bosses and bosses, per mille a grade'],
    ['Signature', '0.2 a level × tier', 'v17: her ATK and M.ATK while she wears her knack\'s family'],
  ]
  return table(['Constant', 'Value', 'Meaning'], rows)
}

function foeRoles(): string {
  const roles: RpgFoeRole[] = ['striker', 'caster', 'guard', 'skirmisher', 'captain', 'champion']
  return table(['Role', 'Moves', 'Below 50% HP'], roles.map((role) => {
    const f = rpgFoe({ id: 'f', castId: 'c', element: 'fire', role, rank: role === 'champion' ? 'boss' : role === 'captain' ? 'sub-boss' : 'regular', level: 10, shield: 2, weaknesses: { weapons: [], elements: [] } })
    const list = (moves: typeof f.moves) => moves.map((m) => `${m.label} (${m.kind}${m.power ? `, ${m.power}%` : ''}, ${m.target}${m.charge ? `, charged, ${m.charge} locks` : ''})`).join('; ')
    return [cap(role), list(f.moves), f.phaseTwo ? list(f.phaseTwo.moves) : '—']
  })) + '\n\nShown with Fire; a foe uses her own element, and a dual-element foe her second element for her second elemental move.'
}

/**
 * Where an on-curve Uma's damage comes from, and what cuts the damage she takes (D142; R2's stack, WP31, live since H82):
 * the balance simulation's Brawler (`world/balance-party.ts`: her grades on curve, the core of her map her level opens,
 * her preset's Bell) against a regular striker of her level. Offense adds up; damage doesn't (offense² ÷ (offense +
 * defense)), so each source is shown as what her hit would lose without it, with the others kept, and all against her
 * level stat alone.
 */
function damageSources(): string {
  const offense: Cell[][] = []
  const taken: Cell[][] = []
  for (const level of [1, 10, 25, 40, 50]) {
    const grade = onCurveGrade(level)
    const foe = rpgFoe({ id: 'f', castId: 'c', element: 'fire', role: 'striker', rank: 'regular', level, shield: 2, weaknesses: { weapons: [], elements: [] } })
    const bare = balanceMember('brawler', 0, level), geared = balanceMember('brawler', 0, level, { gear: true })
    const built = balanceMember('brawler', 0, level, { gear: true, stars: true })
    const own = bare.stats.atk, armor = geared.stats.atk - own, extra = built.stats.atk - geared.stats.atk, might = mightAt(grade, 1)
    const total = own + armor + extra + might
    const hit = (o: number) => (o * o) / (o + foe.stats.pdef)
    const part = (n: number) => `${n} (${Math.round((100 * n) / total)}%)`
    const lose = (n: number) => `−${Math.round(100 * (1 - hit(total - n) / hit(total)))}%`
    const depth = rpgOpenDepth(level)
    offense.push([`Lv ${level}`, `G${grade}, ${depth}`, part(own), part(extra), part(might), part(armor), total,
      lose(extra), lose(might), lose(armor), `×${(hit(total) / hit(own)).toFixed(2)}`, `×${(RPG_SKILL_POWER[depth - 1]! / RPG_SKILL_POWER[0]).toFixed(2)}`])
    // What a regular foe's 100% physical hit takes of her HP, as each defensive source joins.
    const share = (u: typeof bare) => {
      const o = foe.stats.atk
      return `${Math.round((100 * (o * o) / (o + u.stats.pdef)) / u.stats.hp)}%`
    }
    const armorOnly = { ...bare, stats: { ...bare.stats, hp: geared.stats.hp, pdef: geared.stats.pdef } }
    const starsOnly = { ...bare, stats: { ...bare.stats, hp: bare.stats.hp + built.stats.hp - geared.stats.hp, pdef: bare.stats.pdef + built.stats.pdef - geared.stats.pdef } }
    taken.push([`Lv ${level}`, share(bare), share(starsOnly), share(armorOnly), share(built)])
  }
  return table(['Level', 'Gear grade, skill depth', 'Uma stats (level)', 'Extra Stats', 'Weapon Might', 'Armor', 'Offense',
    'Hit without Extra Stats', 'Hit without the weapon', 'Hit without armor', 'All three vs her stats alone', 'Skill depth vs depth 1'], offense) +
    '\n\nA regular foe\'s 100% physical hit, as a share of her HP:\n\n' +
    table(['Level', 'Uma stats only', '+ Extra Stats (HP, DEF)', '+ armor (HP, DEF)', 'All (on curve)'], taken) +
    '\n\nThe Brawler leans ATK ×1.1 and DEF ×1.1; her map is the core her level opens, Prowess all to ATK; her armor is the ' +
    'physical half. Her preset\'s Bell adds a follow-up Attack rather than offense; a Pendant or an Orb would add its flat offense ' +
    'on her kinds, and her signature +0.2 a level while she wears her knack\'s family.'
}

function foeScaling(): string {
  const t = RPG_FOE_TUNING
  const r2 = (n: number) => Math.round(n * 100) / 100
  const top = RPG_TIER_MAX_LEVEL
  return table(['Setting', 'Value'], [
    ['HP', `(${t.hpBase} + ${t.hpPerStat} × reference stat) × role × rank; the reference stat is an average Uma's at the foe's lifetime level`],
    ['Offense', `Set so a 100% hit takes a share of an average Uma's HP at her level (${pct(t.hitShareStart)} at tier Lv 1, ${pct(t.hitShare)} from tier Lv ${t.hitShareFull}), × the offense budget, × role`],
    ['Sub-boss and boss HP', `×${t.subBossHp} and ×${t.bossHp}, times the party's reachable skill depth`],
    ['Build budget', `What a built party's gear and Extra Stats call for, by tier level ℓ: HP and defense ×(1 + ${t.budgetPerLevel} × (ℓ − 1)² ÷ 49), ${x(r2(rpgFoeBudget(top, t.budgetPerLevel)))} at Lv ${top}; offense ${x(r2(rpgFoeBudget(top, t.offenseBudgetPerLevel)))} at Lv ${top}. It restarts at each tier's Lv 1, and its build part is × the tier's multiplier (×1.8 Tier 2, ×2.6 Tier 3; EP16): ${x(r2(rpgFoeTierBudget(2 * top, t.budgetPerLevel)))} HP and defense, ${x(r2(rpgFoeTierBudget(2 * top, t.offenseBudgetPerLevel)))} offense at Tier 2 Lv ${top}, ${x(r2(rpgFoeTierBudget(3 * top, t.budgetPerLevel)))} and ${x(r2(rpgFoeTierBudget(3 * top, t.offenseBudgetPerLevel)))} at Tier 3 Lv ${top}`],
    ['World: regular foes', `+${pct(WORLD_TUNING.regularHpPerLevel)} HP per tier level`],
    ['World: elites', `+${pct(WORLD_TUNING.eliteHpPerLevel)} HP per tier level`],
    ['World: region bosses', `${x(WORLD_TUNING.bossHp)} a champion's HP`],
    ['Acting twice', `From tier Lv ${WORLD_BOSS_TWICE_FROM}: a lone region boss and an elite's sub-boss; a lone elite always`],
    ['Formations', `A foe's offense is the square root of her HP share against a pair's foe, at most a full foe's`],
    ['Shields', `Regular ${t.regularShield} (by formation), sub-boss ${rpgFoeShields().subBoss}, boss ${rpgFoeShields().boss}`],
    ['Weaknesses', 'Her twins: the element that beats hers on the ring and its twin Arm, or the Bow and the Katana (Twilight) for a Light + Dark foe; every foe, every rank (v16)'],
  ])
}

// --- Materials, made items, gear (R2, live since H82; the farm by line since H112) -----------------------------------

const TIERS_123: readonly GearTier[] = [1, 2, 3]
const LINE_NAME: Readonly<Record<MaterialLine, string>> = { metal: 'Metal', wood: 'Wood', vegetables: 'Vegetables', fish: 'Fish', stone: 'Stone' }
const MADE_LINE_NAME: Readonly<Record<string, string>> = { 'weapon-gem': 'Arms Gems', 'tome-ink': 'Tome Ink', 'armor-fittings': 'Armor Fittings',
  'accessory-setting': 'Accessory Settings', 'jewel-planet': 'Planet Jewels', 'jewel-moon': 'Moon Jewels' }
/** A line's three places (FL31): gathering, processing and making, and what the last makes. */
function lineHome(line: MaterialLine): { profession: string; place: string; processor: string; maker: string; makes: string } {
  const gather = PLACES_V4.find((p) => p.line === line && p.kinds.includes('gather'))!
  const process = PLACES_V4.find((p) => p.line === line && isProcessingPlaceV4(p))!
  const make = PLACES_V4.find((p) => p.line === line && isMakingPlaceV4(p))!
  return {
    profession: professionById(gather.profession)!.name, place: placeById(gather.id)?.name ?? gather.id,
    processor: `the ${placeById(process.id)?.name ?? process.id} (${professionById(process.profession)!.name})`,
    maker: `the ${placeById(make.id)?.name ?? make.id} (${professionById(make.profession)!.name})`,
    makes: make.made.filter((m) => m !== 'branch-gem').map((m) => MADE_LINE_NAME[m]).join(' and '),
  }
}

/** The five lines (FL1, FL5): who gathers each, where it's processed and made, and its ten raw items. */
function families(): string {
  return table(['Line', 'Gathered by', 'Processed at', 'Made at', 'Makes', 'Raw, G1 → G10'], MATERIAL_LINES.map((line) => {
    const home = lineHome(line)
    return [LINE_NAME[line], `${home.profession}, the ${home.place}`, home.processor, home.maker, home.makes, lineItems(line, false).map((m) => m.name).join(', ')]
  }))
}
/** Every item, raw and refined, by line and grade (FL5, FL6): grade g opens at Craft Lv 5g − 4. */
function items(): string {
  const out: string[] = []
  for (const line of MATERIAL_LINES) {
    const home = lineHome(line)
    out.push(`### ${LINE_NAME[line]} (${home.profession}, the ${home.place}; ${home.processor}; ${home.maker})`, '')
    const refined = lineItems(line, true)
    out.push(table(['Grade', 'Raw', 'Refined', 'Opens at Craft Lv'], lineItems(line, false).map((m, i) => [
      `G${m.grade}`, `${m.name} (\`${m.id}\`)`, `${refined[i]!.name} (\`${refined[i]!.id}\`)`, gradeUnlockLevel(m.grade),
    ])), '')
  }
  return out.join('\n').trimEnd()
}
/** The jewels (EP17, EP22, FL7): which node each opens, its grade and gate, and its recipe: cut stones of its grade. */
function gems(): string {
  const jewels = MADE_IDENTITIES.filter((m) => m.line === 'jewel-planet' || m.line === 'jewel-moon')
  return table(['Jewel', 'Id', 'Opens', 'Grade', 'Uma Lv', 'Recipe'], jewels.map((m) => {
    const n = Math.ceil(m.grade / 2)
    const opens = m.line === 'jewel-planet' ? `Planet ${['I', 'II', 'III', 'IV', 'V'][n - 1]}` : `node ${['I', 'II', 'III', 'IV', 'V'][n - 1]} of a moon${n === 2 || n === 4 ? `; her moon's ${n === 2 ? 'I' : 'II'}` : ''}`
    return [madeName(m.id)!, `\`${m.id}\``, opens, m.grade, gradeGateLevel(m.grade), inputs(madeRecipeV4(m.id))]
  }))
}
/** Gear by grade (WP2–WP3, WP19–WP23, SB1): what each grade gives, the made item that raises it, and the four accessory
 * families' base forms. */
function gear(): string {
  const grades = Array.from({ length: GRADE_MAX }, (_, i) => i + 1)
  const tiers = (f: (tier: GearTier) => number) => TIERS_123.map(f).join(' · ')
  const values = table(['Grade', 'Opens at Lv', 'Weapon Might (Tier 1 · 2 · 3)', 'Armor: offense a piece', 'Head DEF', 'Body HP', 'Legs MP', 'Arms M.DEF', 'Feet Speed'],
    grades.map((g) => [g, gradeGateLevel(g), tiers((t) => mightAt(g, t)), armorValues('head', g, 1).offense, armorValues('head', g, 1).value,
      armorValues('body', g, 1).value, armorValues('legs', g, 1).value, armorValues('arms', g, 1).value, armorValues('feet', g, 1).value]))
  const made = table(['Grade', 'Arms Gem (an Arms weapon)', 'Tome Ink (a Tome)', 'Armor Fittings', 'Accessory Setting'], grades.map((g) => [g,
    inputs(madeRecipeV4(`weapon-gem-g${g}`)), inputs(madeRecipeV4(`tome-ink-g${g}`)), inputs(madeRecipeV4(`armor-fittings-g${g}`)),
    inputs(madeRecipeV4(`accessory-setting-g${g}`))]))
  const forms = table(['Family', 'Base form', 'G1 → G10 (Tier 1)'], [
    [ACCESSORY_FAMILY_LABEL.pendant, 'Flat offense on each of her three weapons\' kinds', PENDANT_T1.join(', ')],
    [ACCESSORY_FAMILY_LABEL.orb, 'Flat offense on one kind she sets, one of her three weapons’ kinds', ORB_T1.join(', ')],
    [ACCESSORY_FAMILY_LABEL.bell, 'When her act includes an Attack, her weapon of its kind strikes again at a share of an Attack', `${BELL_PERMILLE_PER_GRADE / 1000} a grade × her hand (${(BELL_PERMILLE_PER_GRADE * GRADE_MAX) / 1000} at G10), every tier`],
    [ACCESSORY_FAMILY_LABEL.insignia, 'Her hits on sub-bosses and bosses hit harder', `+${INSIGNIA_PERMILLE_PER_GRADE / 10}% a grade (+${(INSIGNIA_PERMILLE_PER_GRADE * GRADE_MAX) / 10}% at G10), every tier`],
  ])
  return values +
    `\n\nEach armor piece adds its offense to ATK on a physical Uma and to M.ATK on a magical one (her class's half), and its slot's stat. Armor's values × ${TIERS_123.map((t) => TIER_SCALE_TENTHS[t] / 10).join(', ')} in Tiers 1, 2 and 3 (Feet Speed doesn't scale).\n\n` +
    'What raises a slot one grade, in every world:\n\n' + made +
    '\n\nAccessory families (one slot, its family, form and kind a setting changed freely outside fights; the grade is the slot\'s):\n\n' + forms +
    `\n\nHer signature: while she wears her knack's family, ATK and M.ATK +${signatureBonus(10, 1)} · +${signatureBonus(30, 1)} · +${signatureBonus(50, 1)} at Lv 10 · 30 · 50 (0.2 a level × the tier).`
}
/** The Planet and three moons (EP1–EP8, EP23) and her moon (UT10): what a node gives in Tier 1. */
function starMap(): string {
  const n = [1, 2, 3, 4, 5]
  return table(['Body', 'Nodes', 'Opens at Lv', 'Points (Tier 1)', 'To'], [
    ['Planet', 'I–V', n.map((i) => gradeGateLevel(2 * i - 1)).join(', '), PLANET_T1.join(', '), 'all six core stats (HP 5 a point)'],
    ['Prowess', 'I–V', n.map((i) => gradeGateLevel(2 * i)).join(', '), MOON_T1.join(', '), `ATK and M.ATK by her active class: ${RPG_CLASSES.map((c) => `${CLASS_NAME[c]} ${PROWESS_SPLIT[c]}/${100 - PROWESS_SPLIT[c]}`).join(', ')}`],
    ['Vigor', 'I–V', n.map((i) => gradeGateLevel(2 * i)).join(', '), MOON_T1.join(', '), 'HP and MP'],
    ['Guard', 'I–V', n.map((i) => gradeGateLevel(2 * i)).join(', '), MOON_T1.join(', '), 'DEF and M.DEF'],
    ['★ Her moon', 'I, II', `${gradeGateLevel(4)}, ${gradeGateLevel(8)}`, TEMPLATE_T1.join(', '), 'I: her knack\'s stat; II: her calling\'s channel\'s defense'],
  ])
}

/** Class Rank, the one bar left from R2 (WP3; live since H82): what a win pays, and the EXP to next. */
function ranks(): string {
  const classRows: Cell[][] = [1, 10, 20, 30, 40, 49].map((r) => [r, classExpToNext(r).toLocaleString('en-US')])
  return table(['Bar', 'Ranks', 'Per win worth E Uma EXP', 'Opens'], [
    ['Class Rank, per class', `1–${CLASS_MAX_RANK}`, `${CLASS_EXP_SHARE}E to the class she fought as`,
      `Its trees' depths at ${RPG_DEPTH_GATES.join(', ')}; ranks every skill she holds, a Skill Rank every ${RPG_SKILL_RANK_STEP} Class Ranks up to ${RPG_SKILL_RANK_MAX}`],
  ]) + '\n\n' + table(['Class Rank', 'EXP to next'], classRows) +
    `\n\nPast the max rank, EXP banks at ${pct(MARKS_SHARE)} as Class Marks. A Class Manual costs ${MANUAL_PRICE.toLocaleString('en-US')} Class Marks and gives ${MANUAL_EXP.toLocaleString('en-US')} EXP to one class of one Uma. ` +
    'Gear has no ranks: a slot\'s grade is what she wears ([materials](materials.md#gear)).'
}

// --- Economy -------------------------------------------------------------------------------------------------------

function laurels(): string {
  return table(['Stage kind', 'Laurels per win', 'First clear', 'Replay or Sweep', `Lv ${LATE_LAURELS.fromLevel}–50 first clear`, 'EXP weight'],
    (Object.keys(BATTLE_LAURELS) as (keyof typeof BATTLE_LAURELS)[]).map((k) => [cap(k), BATTLE_LAURELS[k], BATTLE_LAURELS[k] * FIRST_CLEAR_LAURELS,
      Math.round(BATTLE_LAURELS[k] * FIRST_CLEAR_LAURELS * REPLAY_SHARE), BATTLE_LAURELS[k] * FIRST_CLEAR_LAURELS * LATE_LAURELS.factor, RPG_BATTLE_EXP_WEIGHTS[k]]))
    + `\n\nA stage in waves pays ${x(WAVE_PAY)} EXP and Laurels. Replays and Sweeps pay ${pct(REPLAY_SHARE)} of the first clear's EXP and Laurels.`
}
function levels(): string {
  const rows: Cell[][] = []
  for (let lv = 1; lv < RPG_TIER_MAX_LEVEL; lv += 7) rows.push([lv, rpgExpToNext(lv), professionExpToNext(lv)])
  return table(['Level', 'Uma EXP to next', 'Craft EXP to next'], rows) +
    `\n\nUma EXP to next level: 120 + 16 × level, up to Lv ${RPG_TIER_MAX_LEVEL}. A stage pays its weight × her own EXP to next level, −${pct(RPG_LEVEL_EXP_STEP)} per level she's above the foes (down to ${pct(RPG_LEVEL_EXP_MIN)}), never more than ${pct(RPG_LEVEL_EXP_MAX)}. Uma Shards at Lv ${RPG_SHARD_LEVELS.join(', ')}. Craft EXP to next: ${professionExpToNext(0).toLocaleString('en-US')} + ${professionExpToNext(1) - professionExpToNext(0)} × level; jobs pay ${EXP_PER_MINUTE} EXP per base minute of work, so a level takes ${professionExpToNext(1) / EXP_PER_MINUTE / 60} base hours at Lv1 and ${professionExpToNext(PROFESSION_MAX_LEVEL - 1) / EXP_PER_MINUTE / 60} at Lv${PROFESSION_MAX_LEVEL - 1}.`
}
/** The Exchange by grade (FL12, FL13): each line's ten raw grades, the same in every world, × the world's tier. */
function prices(): string {
  return table(['Raw materials', 'Stocked', 'Price (Laurels), × the world\'s tier'], [
    ['G1–G5, every line', 'after the tier\'s first win', RAW_PRICE_V3.low],
    ['G6–G10, every line', 'after a win on continent 3', RAW_PRICE_V3.high],
  ]) + '\n\n' +
    table(['Thing', 'Price (Laurels)'], [['Speed Ticket', TIME_TICKET_PRICE], ['Sweep Ticket', SWEEP_TICKET_PRICE]]) +
    `\n\nA Speed Ticket takes ${TIME_TICKET_SPAN / 60000} minutes off a running job. Selling, × the world's tier: a raw G1–G5 item ${SELL_RAW_V3.low}, a G6–G10 one ${SELL_RAW_V3.high}; refined twice that; a made item 6 + 6 × its grade. ` +
    `A Class Manual costs ${MANUAL_PRICE.toLocaleString('en-US')} Class Marks, not Laurels.`
}
const minutes = (m: number): string => `${Number(m.toFixed(1))} min`
const hours = (m: number): string => `${Number((m / 60).toFixed(1))} h`
function jobs(): string {
  return table(['Setting', 'Value'], [
    ['One step', `gather one raw or process one raw into one refined: ${STEP_MINUTES.atFirst} min at Craft Lv1, falling evenly to ${STEP_MINUTES.atMax} min at Lv${PROFESSION_MAX_LEVEL} (ten in ${hours(10 * stepMinutes(1))} and ${hours(10 * stepMinutes(PROFESSION_MAX_LEVEL))})`],
    ['Make one item', `one step for each refined item in it: an Arms Gem or Tome Ink ${RECIPE_V4['weapon-gem'].qty}, Armor Fittings ${RECIPE_V4['armor-fittings'].qty}, an Accessory Setting ${RECIPE_V4['accessory-setting'].qty}, a Planet Jewel ${RECIPE_V4['jewel-planet'].qty}, a Moon Jewel ${RECIPE_V4['jewel-moon'].qty} (an Arms Gem ${hours(makeMinutesV4(1, RECIPE_V4['weapon-gem'].qty))} at Lv1, ${hours(makeMinutesV4(PROFESSION_MAX_LEVEL, RECIPE_V4['weapon-gem'].qty))} at Lv${PROFESSION_MAX_LEVEL})`],
    ['Opens', 'grade g at Craft Lv 5g − 4, to gather, to process and to make'],
    ['Craft EXP', `${EXP_PER_MINUTE} per minute of the job at her level, before the place's speed`],
    ['Outputs per job', `gathering and making 1–${MAX_JOB_COUNT}; processing ${REFINE_BATCHES.map((n) => `×${n}`).join(', ')}`],
    ['Jobs queued after it', String(MAX_QUEUE)],
    ['Places', `${PLACE_SLOTS_V3} Uma slots each, speed ×${PLACE_SPEED_V3}, from day one; no upgrades`],
    ['Extra Stats and armor points', `+1 to its stat per point (+${POINT_HP} HP); Speed ${pct(POINT_EVASION)} evasion; Limit +${POINT_LIMIT} starting charge`],
  ])
}

// --- The Hub -------------------------------------------------------------------------------------------------------

function places(): string {
  const out: string[] = []
  for (const page of HUB_PAGES) {
    out.push(`### ${HUB_PAGE_NAMES[page]} (\`${page}\`)`, '')
    out.push(table(['Place', 'Id', 'Kind', 'Uma slots', 'What it is'], placesOn(page).map((p) => [p.name, `\`${p.id}\``, p.kind, p.slots || '—', p.blurb])), '')
  }
  return out.join('\n').trimEnd()
}
/** The fifteen places (FL31) and the trades: who works each, and its one job. */
function facilities(): string {
  const trade = (profession: string) => TRADES.find((t) => t.gathering === profession || t.processing === profession || t.crafting === profession)!
  const callings: Readonly<Record<string, string>> = { physical: 'Brawler', 'physical-hybrid': 'Spell Blade', healer: 'Paladin, Cleric', 'magical-hybrid': 'Summoner', magical: 'Mage' }
  const does = (id: string): string => {
    const spec = PLACES_V4.find((p) => p.id === id)!
    if (spec.kinds.includes('gather')) return `Gathers ${LINE_NAME[spec.line].toLowerCase()}, G1–G10`
    if (isProcessingPlaceV4(spec)) return `Processes ${LINE_NAME[spec.line].toLowerCase()} raw into refined, one for one`
    return `Makes ${spec.made.filter((m) => m !== 'branch-gem').map((m) => MADE_LINE_NAME[m]).join(' and ')}`
  }
  return table(['Place', 'Profession', 'Job', 'What it does', 'Its trade (callings)'], PLACES_V4.map((p) => {
    const profession = professionById(p.profession)!
    return [placeById(p.id)?.name ?? p.id, profession.name, cap(profession.kind), does(p.id), callings[trade(p.profession).id]!]
  })) + `\n\nEvery place has ${PLACE_SLOTS_V3} slots at ×${PLACE_SPEED_V3} from day one, and nothing to upgrade. An Uma works her trade's three places; a place whose trade has no Uma in the world is an open shop, taking everyone until one arrives.`
}

// --- The world ------------------------------------------------------------------------------------------------------

/** A twin set by name: "Lightning twins" (Lance, Thunder Tome), or Twilight (Bow, Katana). */
const twinName = (elements: readonly string[]): string => (elements[0] ? `${cap(elements[0])} twins` : 'Twilight')
/** Engine v16: a signature's foes are weak to her twins (CP5); a pair's lead alternates by slot, so it may answer to two. */
function biomes(): string {
  const weakTo = (s: Parameters<typeof rpgTwinsOf>[0]) => [...new Set((s.length > 1 ? [0, 1] : [0]).map((slot) => twinName(rpgTwinsOf(s, slot).elements)))].join(' or ')
  return table(['Biome', 'Id', 'Signatures (weak to)', 'Formations', 'Roles'], BIOMES.map((b) => [
    b.name, `\`${b.id}\``, b.signatures.map((s) => `${s.join('+')} (${weakTo(s)})`).join('; '),
    b.formations.join(', '), b.roles.join(', '),
  ])) + `\n\nThe twin sets: ${Object.entries(RPG_TWIN_SETS).map(([set, kinds]) => `${set === 'twilight' ? 'Twilight' : `${cap(set)} twins`} ` +
    `(${kinds.map((k) => WEAPON_LABEL[(isRpgWeaponKind(k) ? k : `tome-${k}`) as RpgWeapon]).join(', ')})`).join('; ')}.`
}
const FRANCHISE_NAME: Record<string, string> = { priconne: 'PriConne', azurlane: 'Azur Lane', nikke: 'NIKKE' }
/** Whose units each continent's halves and capital show (D135). */
function faces(): string {
  const rows = [1, 2, 3, 4, 5].map((order) => {
    const start = (order - 1) * 10 + 1
    return [`w${order}`, `${FRANCHISE_NAME[bandFranchise(order, 0)]} (Lv ${start}–${start + 4})`, `${FRANCHISE_NAME[bandFranchise(order, 5)]} (Lv ${start + 5}–${start + 9})`,
      FRANCHISE_NAME[capitalFranchise(order)]!]
  })
  const regions = Object.fromEntries(FRANCHISES.map((f) => [f, 0]))
  for (let order = 1; order <= 5; order++) for (let row = 0; row < 10; row++) regions[bandFranchise(order, row)]! += 4
  return table(['Continent', 'Rows 1–5', 'Rows 6–10', 'Capital'], rows) + '\n\n' +
    table(['Franchise', 'Regions'], FRANCHISES.map((f) => [FRANCHISE_NAME[f]!, regions[f]!]))
}
function formations(): string {
  return table(['Template', 'Foes', 'HP shared (regular foes)', 'Shield each', 'Notes'], (Object.keys(WORLD_FORMATIONS) as (keyof typeof WORLD_FORMATIONS)[]).map((k) => {
    const f = WORLD_FORMATIONS[k]
    return [`${f.name} (\`${k}\`)`, f.count[0] === f.count[1] ? f.count[0] : `${f.count[0]}–${f.count[1]}`,
      k === 'escort' ? `captain ${WORLD_ESCORT.captain}, guards ${WORLD_ESCORT.guard} each` : f.budget, k === 'escort' ? `captain ${WORLD_ESCORT.captainShield}, guards ${f.shield}` : f.shield,
      k === 'solo' ? 'Acts twice a round' : k === 'swarm' ? 'Two rows on the stage' : '—']
  })) + '\n\n' + table(['Stage', 'Waves', 'HP per wave'], [
    ...Object.entries(WAVE_STAGES).map(([n, w]) => [`Stage ${n}`, w, x(WAVE_HP[w]!)] as Cell[]),
    ['Boss (stage 12)', BOSS_WAVES, `${x(WAVE_HP[BOSS_WAVES]!)}, ${x(WAVE_HP[BOSS_WAVES]!)}, then the champion's wave in full`],
  ])
}
const SAMPLE_CAST = Array.from({ length: 24 }, (_, i) => ({ id: `cast-${i}`, name: `Rival ${i}` }))
function continents(): string {
  const out: string[] = []
  for (let order = 1; order <= 5; order++) {
    const c = worldContinent({ name: `Continent ${order}`, order })
    out.push(`### Continent ${order} (\`${c.id}\`), Lv ${c.levelStart}–${c.levelStart + 9}, leaning ${CONTINENT_LEAN[order - 1]}`, '')
    const rows: Cell[][] = []
    for (let row = 9; row >= 0; row--) {
      const regions = c.regions.filter((r) => r.row === row).sort((a, b) => a.col - b.col)
      const spring = c.springs.find((s) => s.row === row)
      rows.push([`${row + 1}`, `Lv ${regions[0]!.level}–${regions[0]!.levelTop}`, ...regions.map((r) => `${r.name} \`${r.id}\``), spring ? `Spring \`${spring.id}\`` : ''])
    }
    out.push(table(['Row', 'Levels', 'Region 1', 'Region 2', 'Region 3', 'Region 4', 'Spring on the way in'], rows), '')
  }
  return out.join('\n').trimEnd()
}
function regionSample(): string {
  const c = worldContinent({ name: 'Continent 1', order: 1 })
  const region = c.regions.find((r) => r.biome === 'volcano')!
  const chapter = regionChapter(region, SAMPLE_CAST)
  return `${region.name} \`${region.id}\`, Lv ${region.level}–${region.levelTop}:\n\n` + table(['Stage', 'Level', 'Kind', 'Name', 'Signature', 'Foes per wave', 'Notes'],
    chapter.nodes.filter((n) => n.kind !== 'camp').map((n, i) => {
      const waves = [n.enemies, ...(n.waves ?? [])]
      const notes = [...new Set(waves.flat().flatMap((e) => [e.twice ? 'acts twice' : '', e.element2 ? 'dual element' : '', e.rank !== 'regular' ? e.rank : '']).filter(Boolean))]
      return [i + 1, n.level, n.kind, n.name, n.note ?? n.element ?? '', waves.map((w) => w.length).join(' + '), notes.join(', ') || '—']
    }))
}
function world(): string {
  return table(['Setting', 'Value'], [
    ['Continents', '5 per tier, one per scenario, 10 levels each'],
    ['Regions', `40 per continent in ${WORLD_ROWS} rows of ${WORLD_REGIONS_PER_ROW}, each climbing ${WORLD_REGION_LEVELS} levels: rows 1–5 the continent's first five, rows 6–10 its last five. Every biome at least twice; the first is a Meadow`],
    ['Stages', `${WORLD_STAGES} per region: 10 regular climbing its levels two at a time, then an elite (11) and the boss (12) at its top level`],
    ['Springs', `5 per continent, one every two rows; recharge ${SPRING_RECHARGE_MS / 3600000} h`],
    ['Waves pay', x(WAVE_PAY)],
  ])
}

// --- The Rift -------------------------------------------------------------------------------------------------------

/** Runs of equal neighbours, as `[value, count]`. */
function runs<T>(list: readonly T[]): [T, number][] {
  const out: [T, number][] = []
  for (const v of list) {
    const last = out[out.length - 1]
    if (last && last[0] === v) last[1] += 1
    else out.push([v, 1])
  }
  return out
}
/** Stage numbers as ranges: `1–6`, `5, 7`, `12`. */
function stageList(stages: readonly number[]): string {
  const parts: string[] = []
  for (let i = 0; i < stages.length;) {
    let j = i
    while (j + 1 < stages.length && stages[j + 1] === stages[j]! + 1) j += 1
    parts.push(j > i + 1 ? `${stages[i]}–${stages[j]}` : j === i + 1 ? `${stages[i]}, ${stages[j]}` : `${stages[i]}`)
    i = j + 1
  }
  return parts.join(', ')
}
type Front = (typeof RIFT_FRONTS)[number]
/** One wave: `a boss (acts 2, shield 8) + 2 sub-boss-faced guards (shield 3)`. */
function riftWave(wave: readonly RiftSlot[]): string {
  const faced = { boss: 'boss-faced', subboss: 'sub-boss-faced', key: 'key' } as const
  const noun = (s: RiftSlot): string => (s.rank !== 'regular' ? s.rank
    : `${faced[s.face]} ${s.role === 'guard' ? 'guard' : s.role === 'captain' || s.role === 'champion' ? 'leader' : 'foe'}`)
  const groups = runs(wave.map((s) => JSON.stringify([noun(s), `${s.acts > 1 ? `acts ${s.acts}, ` : ''}shield ${s.shield}`, !!s.pair])))
  return groups.map(([key, n]) => {
    const [name, traits, pair] = JSON.parse(key) as [string, string, boolean]
    const many = `${n} ${name.endsWith('boss') ? `${name}es` : `${name}s`}${pair ? ' from two packs' : ''}`
    return `${n > 1 ? many : `a ${name}`} (${traits})`
  }).join(' + ')
}
/** A band of a front's stages; stages that differ are listed apart (`5, 7: …; 6, 8: …`). */
function riftBand(front: Front, from: number, to: number): string {
  const stage = (n: number): string => {
    const waves = riftShape(front, n).map(riftWave)
    const groups = runs(waves)
    if (waves.length === 1) return waves[0]!
    if (groups.length === 1) return `${waves.length} waves, each ${waves[0]}`
    let at = 1
    return groups.map(([w, k]) => { const s = `${k > 1 ? `waves ${at}–${at + k - 1}` : `wave ${at}`}: ${w}`; at += k; return s }).join('; ')
  }
  const groups = new Map<string, number[]>()
  for (let n = from; n <= to; n += 1) groups.set(stage(n), [...(groups.get(stage(n)) ?? []), n])
  return cap(groups.size === 1 ? [...groups.keys()][0]! : [...groups].map(([d, stages]) => `${stageList(stages)}: ${d}`).join('; '))
}
/** The Rift's fronts (D173): what each is weak to and wards, its stages from `riftShape`, its party; then levels and strength. */
function riftFronts(): string {
  // The live engine's numbers: classes v2's override since H61 (H60, D186).
  const t = riftTuning()
  const byRank = (counts: Readonly<Record<'regular' | 'sub-boss' | 'boss', number>>, kinds: string): string => {
    const groups = new Map<number, string[]>()
    for (const [names, n] of [[['key', 'regular'], counts.regular], [['sub-boss'], counts['sub-boss']], [['boss'], counts.boss]] as const) {
      groups.set(n, [...(groups.get(n) ?? []), ...names])
    }
    const list = (names: readonly string[]) => (names.length > 1 ? `${names.slice(0, -1).join(', ')} or ${names.at(-1)}` : names[0])
    return `${kinds} only: ${[...groups].map(([n, names]) => `${n} for a ${list(names)}`).join(', ')}; a champion pair's differ`
  }
  const perStage = (list: readonly number[]): string => {
    let at = 1
    return runs(list).map(([n, k]) => { const s = `${n} at stages ${stageList(Array.from({ length: k }, (_, i) => at + i))}`; at += k; return s }).join(', ')
  }
  // Engine v16 (CP7): the Duel's boss and every Horde foe draw twin sets, each an Arm and its element.
  const sets = t.weak.duel.sets
  const weak: Readonly<Record<Front, string>> = {
    iron: byRank(t.weak.iron, 'Arms'), arcane: byRank(t.weak.arcane, 'Elements'),
    duel: sets ? `Twin sets (${perStage(sets)}); locks mixed`
      : `Arms (${perStage(t.weak.duel.weapons)}) and elements (${perStage(t.weak.duel.elements)}); locks mixed`,
    horde: sets ? 'One twin set each; a wave repeats none until all five are used' : 'One Arms kind and one element each, no two foes of a wave alike',
  }
  const slots = RIFT_RUN_FIGHTS.flatMap((ref) => { const { front, stage } = riftShapeOf(ref); return riftShape(front, stage).flat() })
  // Its guided build (CP7): each member's class, and the three weapons of one re-specced off her class's defaults.
  const party = (f: Front): string => riftGuidedBuild(f).map((m) => {
    const own = m.weapons.join() !== rpgDefaultWeapons(m.classId).join()
    return own ? `${CLASS_NAME[m.classId]} (${m.weapons.map(weaponName).join(', ')})` : CLASS_NAME[m.classId]
  }).join(', ')
  return table(['Front', 'Weak to', 'Ward', 'Stages 1–4', '5–8', '9–11', 'Champion (12)', 'Guided build'], RIFT_FRONTS.map((f) => {
    const spec = RIFT_FRONT_SPECS[f]
    return [spec.name, weak[f], spec.ward ? `${spec.ward === 'magical' ? 'Elements' : 'Arms'} ×${K.BATTLE_WARD_FACTOR}` : '—',
      riftBand(f, 1, 4), riftBand(f, 5, 8), riftBand(f, 9, 11), riftBand(f, 12, 12), party(f)]
  })) + `\n\nFront and Convergence foes stand at tier Lv ${t.level}. Strength multiplies HP, ATK and M.ATK: stage n ×(1 + ${t.climb} × (n − 1) ÷ 11), ` +
    `×${riftStrength({ kind: 'front', front: 'iron', stage: 12 })} at the champion; a Convergence fight is its front's champion at ×${riftStrength({ kind: 'convergence', fight: 0 })}. ` +
    `An Echo is its front's stage ${t.echoStage} at tier Lv 45 or 50 (×1); Lv 55 is the Lv 50 one at ×${t.echo55}. ` +
    `Sub-bosses and bosses take the party's reachable skill depth, regular foes the world's regular-foe HP step; every Horde foe is regular rank. ` +
    `Rift foes hit harder than the world's: offense ×${t.escort.captain.offense} at stages 1–4, ×${t.elites.offense} for stages 5 and 7's sub-bosses, ` +
    `×${t.boss.offense} for a boss and her guard, ×${t.openers.offense} for an opening foe, ×${t.champion.offense} for a champion, ` +
    `×${t.duel.offense} on the Duel (her HP ×${t.duel.hp}) and ×${t.horde.offense} on the Horde. Arcane's foes have ×${t.scale.arcane.hp} HP and ×${t.scale.arcane.offense} offense over Iron's. ` +
    (t.champions ? `Champions, and so the Convergence's fights, scale again by front: ${RIFT_FRONTS.filter((f) => t.champions![f]).map((f) => {
      const c = t.champions![f]!
      return `${RIFT_FRONT_SPECS[f].name} ${c.hp === c.offense ? `×${c.hp} HP and offense` : c.hp === 1 ? `×${c.offense} offense` : `×${c.hp} HP and ×${c.offense} offense`}`
    }).join(', ')}. ` : '') +
    `A run's ${RIFT_RUN_FIGHTS.length} fights hold ${slots.filter((s) => s.face === 'boss').length} boss, ${slots.filter((s) => s.face === 'subboss').length} sub-boss ` +
    `and ${slots.filter((s) => s.face === 'key').length} key face slots.`
}

/** The Rift's run rules (H48, D174): opening, the roster, fronts, the Convergence, Echo pay and the Ascension purse. */
function riftRules(): string {
  const n = (v: number) => v.toLocaleString('en-US')
  const echoE = (level: (typeof ECHO_LEVELS)[number]) => rpgBattleExp('fight', echoFoeLevel(1, level), RPG_TIER_MAX_LEVEL)
  return table(['Rule', 'Value'], [
    ['The Rift opens', `${RIFT_OPEN_AT} Lv ${RPG_TIER_MAX_LEVEL} Umas in the tier's world (Tiers ${RIFT_TIERS.join(' and ')})`],
    ['A run', `${RIFT_ROSTER} Lv ${RPG_TIER_MAX_LEVEL} Umas; ${RIFT_FRONTS.length} fronts of ${RIFT_STAGES} stages, then the Convergence's ${CONVERGENCE_FIGHTS} fights`],
    ['Echoes', `Each front at Lv ${ECHO_LEVELS.join(', ')}`],
    ['Echo pay', `×${ECHO_RANK_PAY} a stage's Class, Weapon, Armor and Accessory Rank EXP; no Uma EXP, Laurels, Shards or Bonds`],
    ['Class EXP an Echo win, Lv 50 Uma', ECHO_LEVELS.map((l) => `Lv ${l}: ${n(ECHO_RANK_PAY * CLASS_EXP_SHARE * echoE(l))}`).join(' · ')],
    ['Ascension purse, per Uma', `${n(ASCEND_PURSE.laurels)} Laurels and ${ASCEND_PURSE.speedTickets} Speed Tickets (${n(ASCEND_PURSE.laurels * RIFT_ROSTER)} and ${ASCEND_PURSE.speedTickets * RIFT_ROSTER} a run)`],
    ['Banked EXP on Ascend, per Uma', `1 Class Mark per ${BANKED_EXP_PER_MARK} EXP, ${n(BANKED_MARKS_CAP)} at most`],
  ])
}

// --- Tiers ----------------------------------------------------------------------------------------------------------

function tiers(): string {
  return table(['Tier', 'Name', 'Look'], TIERS.map((t) => [t.tier, t.name, cap(t.look)]))
}

// --- Achievements ---------------------------------------------------------------------------------------------------

const ACHIEVEMENT_KIND: Readonly<Record<AchievementDef['kind'], string>> = { seal: 'Required', conquered: 'Required; unlocks Ascend', title: 'Title' }
function achievements(): string {
  return table(['Name', 'How', 'Kind'], ACHIEVEMENTS.map((a) => [a.tier === null ? a.name : `${a.name} · Tier ${a.tier}`, a.how, ACHIEVEMENT_KIND[a.kind]]))
}

// --- Dependencies ---------------------------------------------------------------------------------------------------

export interface PackageJson { name: string; dependencies?: Record<string, string>; devDependencies?: Record<string, string> }
function dependencies(pkgs: readonly { path: string; json: PackageJson }[]): string {
  return pkgs.map(({ path, json }) => {
    const list = (deps: Record<string, string> | undefined) => Object.entries(deps ?? {}).map(([n, v]) => `\`${n}\` ${v}`).join(', ') || '—'
    return `**${json.name}** (\`${path}\`)\n\n- Runtime: ${list(json.dependencies)}\n- Dev: ${list(json.devDependencies)}`
  }).join('\n\n')
}

/** Every block a doc may embed, by key. */
export function renderBlock(key: string, context: { packages: readonly { path: string; json: PackageJson }[] }): string | null {
  const blocks: Record<string, () => string> = {
    classes, templates, presets, weapons, depths, 'skill-trees': skillTrees, limits, heroes, 'battle-constants': battleConstants, 'foe-roles': foeRoles, 'foe-scaling': foeScaling,
    'damage-sources': damageSources,
    families, items, gems, gear, 'star-map': starMap, ranks, laurels, levels, prices, jobs, places, facilities, biomes, faces, formations, continents,
    'region-sample': regionSample, world, tiers, achievements, 'rift-fronts': riftFronts, 'rift-rules': riftRules,
    dependencies: () => dependencies(context.packages),
    'active-slots': () => `${RPG_BASE_ACTIVE_SLOTS} equipped skills at Lv 1, one more at Lv ${RPG_ACTIVE_SLOT_GATES.join(', ')} (${RPG_BASE_ACTIVE_SLOTS + RPG_ACTIVE_SLOT_GATES.length} at most). ` +
      `No points and no side skills: every skill on her path is hers at its depth's Class Rank, and ranks up every ${RPG_SKILL_RANK_STEP} Class Ranks ` +
      `(×${RPG_SKILL_RANK_FACTOR[0]} at Rank 1 to ×${RPG_SKILL_RANK_FACTOR[RPG_SKILL_RANK_MAX - 1]} at Rank ${RPG_SKILL_RANK_MAX}).`,
  }
  return blocks[key]?.() ?? null
}
