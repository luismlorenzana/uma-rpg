// The live docs' generated blocks (docs/game/, D92): every list in the game manual is rendered here from the rules, so it
// can't drift from the game. A doc marks a block with `<!-- live:<key> -->` … `<!-- /live -->`; `pnpm docs:update` rewrites
// them, and `docs.test.ts` fails when one is stale. Pure: no I/O (the test reads and writes the files).
import { BATTLE_LAURELS, EXP_PER_MINUTE, FACILITY_SLOTS, FACILITY_SPEED, FACILITY_UPGRADE, FIRST_CLEAR_LAURELS,
  itemMinutes, LATE_LAURELS, makeMinutes, refineMinutes, MAX_JOB_COUNT, POINT_EVASION, POINT_HP, POINT_LIMIT, REFINE_BATCHES,
  PROFESSION_MAX_LEVEL, professionExpToNext, rawItemPrice, REPLAY_SHARE, SWEEP_TICKET_PRICE, TIME_TICKET_PRICE, TIME_TICKET_SPAN } from '../economy/pacing'
import { markdown as pacingSimulation } from '../economy/pacing.sim'
import { DISHES } from '../economy/dishes'
import {
  accessoryEffects, accessoryKindOf, ARMOR_DEFENSE_PER_GRADE, armorOffense, EQUIP_LABEL, EQUIP_TYPES, gearById, gearId, gearPoints, isAccessory, isMagicalGear, isOrb, isWeapon,
  MIGHT_BY_GRADE, mightOf, recipeFamilies, slotOf, type EquipType,
} from '../economy/gear'
import { MAX_QUEUE, FACILITIES } from '../economy/jobs'
import {
  ACCESSORY_EXP_SHARE, ACCESSORY_KINDS, ACCESSORY_LABEL, ARMOR_EXP_SHARE, ARMOR_KINDS, ARMOR_LABEL, ARMOR_SLOT_LABEL, ARMOR_SLOTS, ARMOR_SLOT_KINDS, CLASS_EXP_SHARE, CLASS_MAX_RANK, classExpToNext, GEAR_MAX_RANK,
  gearExpToNext, MANUAL_EXP, MANUAL_PRICE, MARKS_SHARE, WEAPON_EXP_SHARE, WEAPON_LABEL,
} from '../economy/ranks'
import { HUB_PAGE_NAMES, HUB_PAGES, placeById, placesOn } from '../hub/places'
import { EFFECT_LABEL, gradeUnlockLevel, ITEM_EFFECTS, ITEM_FAMILIES, itemById } from '../items/catalog'
import { BATTLE_LIMIT_CHARGE, BATTLE_LIMIT_MAX, BATTLE_LIMIT_NAMES, BATTLE_LIMIT_POWER } from '../rpg/battle/limit'
import * as K from '../rpg/battle/skills'
import {
  BOND_EXP_PER_WIN, BOND_EXP_TO_NEXT, BOND_MAX_LEVEL, bondCapacity, HERO_HALLS, HERO_LIMIT_POWER, HERO_LIMITS, HERO_MAX_LEARNERS, heroLimitKinds,
  LEARNER_MAX_PARENTS,
} from '../rpg/heroes'
import { RPG_CLERIC_STATUS, RPG_NODES, RPG_SKILL_MP, RPG_SKILL_POWER, RPG_SUPPORT_ALL, RPG_SUPPORT_SHARE, rpgSideNodeLevel, rpgTreeOf, type RpgNode } from '../rpg/catalog'
import { RPG_BATTLE_EXP_WEIGHTS, RPG_LEVEL_EXP_MAX, RPG_LEVEL_EXP_MIN, RPG_LEVEL_EXP_STEP, RPG_SHARD_LEVELS } from '../rpg/campaign/rewards'
import { RPG_FOE_TUNING, rpgFoe, rpgFoeBudget, type RpgFoeRole } from '../rpg/campaign/enemies'
import { balanceMember, onCurveGrade } from '../world/balance-party'
import {
  isRpgTome, RPG_ACTIVE_SLOT_GATES, RPG_BASE_ACTIVE_SLOTS, RPG_CLASS_SLOTS, RPG_CLASS_STATS, RPG_CLASSES, RPG_DEPTH_GATES, RPG_SIDE_POINTS_PER_LEVEL,
  RPG_TIER_MAX_LEVEL, RPG_WEAPONS, rpgClassWeapons, rpgExpToNext, rpgHand, rpgOpenDepth, rpgWeaponKind, type RpgClass, type RpgWeapon,
} from '../rpg/rules'
import { BIOMES, signatureWeaknesses } from '../world/biomes'
import { bandFranchise, capitalFranchise, FRANCHISES } from '../world/roster'
import {
  BOSS_WAVES, CONTINENT_LEAN, regionChapter, SPRING_RECHARGE_MS, WAVE_HP, WAVE_PAY, WAVE_STAGES, WORLD_ESCORT, WORLD_FORMATIONS,
  WORLD_BOSS_TWICE_FROM, WORLD_REGION_LEVELS, WORLD_REGIONS_PER_ROW, WORLD_ROWS, WORLD_STAGES, WORLD_TUNING, worldContinent,
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

const CLASS_NAME: Readonly<Record<RpgClass, string>> = { brawler: 'Brawler', mage: 'Mage', spellblade: 'Spell Blade', cleric: 'Cleric', summoner: 'Summoner' }
const weaponName = (w: RpgWeapon): string => WEAPON_LABEL[w]
const itemName = (id: string) => itemById(id)?.name ?? id
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
}
const STARTS_AS: Readonly<Record<RpgClass, string>> = { brawler: 'Front runners', mage: 'Pace chasers', spellblade: '—', cleric: 'Late surgers', summoner: 'End closers' }

function slots(c: RpgClass): string {
  const s = RPG_CLASS_SLOTS[c]
  const arms = s.filter((k) => k === 'arms').length, tomes = s.filter((k) => k === 'tome').length
  const parts = [[arms, `${arms} Arms`], [tomes, `${tomes} Tome${tomes > 1 ? 's' : ''}`]] as const
  return s.includes('any') ? 'Any 5' : [...parts].sort((a, b) => b[0] - a[0]).filter(([n]) => n > 0).map(([, t]) => t).join(' + ')
}

// --- Classes and skills ---------------------------------------------------------------------------------------------

function classes(): string {
  return table(['Class', 'Slots', 'Trees', 'Hand: power, MP', 'Special', 'Stat lean (HP, ATK, MATK, DEF, MDEF, MP, Heal)', 'Limit Break power', 'Starts as'],
    RPG_CLASSES.map((c) => {
      const h = rpgHand({ classId: c })
      const s = RPG_CLASS_STATS[c]
      const special = h.pair ? 'Every act is an Arms half and a Tome half' : h.linger ? `A summon lingers and acts again at ${h.linger}; most summon lines also mend, shield, drain, bless or revive`
        : c === 'cleric' ? 'Each skill carries a status; her spells mend and cleanse, her blows raise a Barrier' : '—'
      return [CLASS_NAME[c], slots(c), rpgClassWeapons(c).length, `${x(h.power)}, ${x(h.mp)}`, special,
        [s.hp, s.atk, s.matk, s.pdef, s.mdef, s.mp, s.heal].map((v) => x(v)).join(' '), `${HERO_LIMIT_POWER[c]}× her open depth`, STARTS_AS[c]]
    }))
}

function weapons(): string {
  return table(['Weapon', 'Id', 'Kind', 'Channel', 'Shape', 'Cleric status', 'Classes'], RPG_WEAPONS.map((w) => {
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

function depths(): string {
  return table(['Depth', 'Core skill opens', 'Side skills open', 'Side cost', 'Single-target power', 'Full-turn MP'], [1, 2, 3, 4, 5].map((d) => [
    d, `Class Rank ${RPG_DEPTH_GATES[d - 1]}`, `Class Rank ${rpgSideNodeLevel(d)}`, `${d} point${d > 1 ? 's' : ''}`, RPG_SKILL_POWER[d - 1]!, RPG_SKILL_MP[d - 1]!,
  ]))
}

function nodeRow(n: RpgNode, c: RpgClass): Cell[] {
  const hand = rpgHand({ classId: c })
  return [`\`${n.id}\``, n.variant ? `Side ${n.variant.toUpperCase()}` : 'Core', n.name, n.variant ? n.cost : 'free', Math.max(1, Math.round(n.skill.mp * hand.mp)), n.summary]
}
function skillTrees(): string {
  const out: string[] = []
  for (const c of RPG_CLASSES) {
    const hand = rpgHand({ classId: c })
    out.push(`### ${CLASS_NAME[c]}`, '', `${rpgClassWeapons(c).length} trees. Powers below are before her hand (${x(hand.power)}); MP is hers (${x(hand.mp)}).`, '')
    for (const w of rpgClassWeapons(c)) {
      const tree = rpgTreeOf(c, w)
      out.push(`#### ${CLASS_NAME[c]} · ${weaponName(w)} (\`${tree}\`)`, '')
      const nodes = RPG_NODES.filter((n) => n.tree === tree).sort((a, b) => a.depth - b.depth || (a.variant ?? '').localeCompare(b.variant ?? ''))
      out.push(table(['Depth', 'Node', 'Slot', 'Name', 'Cost', 'MP', 'What it does'], nodes.map((n) => [n.depth, ...nodeRow(n, c)])), '')
    }
  }
  return out.join('\n').trimEnd()
}

/** D112: Limit Breaks only from the Halls of Heroes; the classes' own replay in older fights. */
function limits(): string {
  return `**Limit Breaks come only from the Halls of Heroes** (D112, engine v10). A Hero always uses her seat's, at 100%; a ` +
    `Learner uses either of her Heroes', at ${bondCapacity(0) * 100}% plus 5% a Bond Level (${bondCapacity(BOND_MAX_LEVEL) * 100}% at ` +
    `Bond ${BOND_MAX_LEVEL}). An Uma who is neither has none, and her gauge has nothing to spend. At 100% a Limit Break is ` +
    `worth her class's power below, in single-target casts at her open depth:\n\n` +
    table(['Class', 'Limit Break power'], RPG_CLASSES.map((c) => [CLASS_NAME[c], `${HERO_LIMIT_POWER[c]}×`])) + '\n\n' +
    `The gauge fills to ${BATTLE_LIMIT_MAX}: +${BATTLE_LIMIT_CHARGE.attack} for an Attack, +${BATTLE_LIMIT_CHARGE.skill} for a skill. A Limit Break costs no MP and takes her turn. ` +
    `Fights from engines v6–v9 replay with the classes' retired Limit Breaks: ` +
    RPG_CLASSES.map((c) => `${CLASS_NAME[c]} ${RETIRED_LIMIT_OF[c]}`).join('; ') + '.'
}

/** The Halls of Heroes (D106, D107): every seat's Limit Break, and the Bond numbers. */
function heroes(): string {
  const hall = (c: RpgClass) => placeById(HERO_HALLS[c])?.name ?? c
  const shape = (target: string) => (target === 'all' ? 'every foe' : target === 'random' ? 'random foes' : 'one foe')
  return table(['Hall', 'Seat', 'Limit Break', 'Kinds', 'What it does', 'Casts'], HERO_LIMITS.map((l) => [
    `${hall(l.classId)} (${CLASS_NAME[l.classId]})`, l.id.slice(l.id.lastIndexOf('-') + 1), l.name, heroLimitKinds(l).join(', '), l.blurb,
    l.casts.map((c) => [c.hits.length ? `${c.hits.length} hit${c.hits.length === 1 ? '' : 's'} on ${shape(c.target)}` : '', c.splash ? 'splash' : '',
      c.status ? `${c.status.key} ${c.status.stacks} on ${c.status.to === 'allies' ? 'every ally' : c.status.to === 'foes' ? 'every foe' : 'the foe'}` : '']
      .filter(Boolean).join(' + ')).join('; '),
  ])) + '\n\n' + table(['Setting', 'Value'], [
    ['Seats', `4 per hall, ${HERO_LIMITS.length} in all; a Hero sits in one seat`],
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
    ['`BATTLE_COVER_CAP`', K.BATTLE_COVER_CAP, 'v12: a skill Barrier\'s cap, as a share of max HP; it lasts the round'],
    ['`RPG_SUPPORT_SHARE`', RPG_SUPPORT_SHARE.join(', '), 'v12: a mend\'s or Barrier\'s share of the target\'s max HP, by depth'],
    ['`RPG_SUPPORT_ALL`', RPG_SUPPORT_ALL, 'v12: that share on every Uma, at depth 5 and for summons'],
    ['`BATTLE_HEAL_SCALE`', K.BATTLE_HEAL_SCALE, 'v12: her Heal raises mends and Barriers ×(1 + Heal ÷ this)'],
    ['`BATTLE_REVIVE_SHARE`', K.BATTLE_REVIVE_SHARE, 'v12: a revive\'s share of max HP, before her Heal'],
    ['`BATTLE_RALLY_SHARE`', K.BATTLE_RALLY_SHARE, 'v12: share of a foe hit she can Rally back'],
    ['`BATTLE_BREATHER`', K.BATTLE_BREATHER, 'v12: share of max HP every Uma recovers when a new wave enters'],
    ['`BATTLE_LIMIT_MAX`', BATTLE_LIMIT_MAX, 'Limit Break gauge'],
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
 * Where an on-curve Uma's damage comes from, and what cuts the damage she takes (D142): the balance simulation's Brawler
 * (`world/balance-party.ts`, gear of the grade her level opens and her level's Extra Stats nodes) against a regular
 * striker of her level. Offense adds up; damage doesn't (offense² ÷ (offense + defense)), so each source is shown alone
 * on top of her level stat, and all together.
 */
function damageSources(): string {
  const offense: Cell[][] = []
  const taken: Cell[][] = []
  for (const level of [1, 10, 25, 40, 50]) {
    const grade = onCurveGrade(level)
    const foe = rpgFoe({ id: 'f', castId: 'c', element: 'fire', role: 'striker', rank: 'regular', level, shield: 2, weaknesses: { weapons: [], elements: [] } })
    const bare = balanceMember('brawler', 0, level), geared = balanceMember('brawler', 0, level, { gear: true })
    const built = balanceMember('brawler', 0, level, { gear: true, stars: true })
    const own = bare.stats.atk, armor = geared.stats.atk - own, extra = built.stats.atk - geared.stats.atk, might = mightOf(grade)
    const total = own + armor + extra + might
    const hit = (o: number) => (o * o) / (o + foe.stats.pdef)
    const part = (n: number) => `${n} (${Math.round((100 * n) / total)}%)`
    const times = (o: number) => `×${(hit(o) / hit(own)).toFixed(2)}`
    const depth = rpgOpenDepth(level)
    offense.push([`Lv ${level}`, `G${grade}, ${depth}`, part(own), part(extra), part(might), part(armor), total,
      times(own + extra), times(own + might), times(own + armor), times(total), `×${(RPG_SKILL_POWER[depth - 1]! / RPG_SKILL_POWER[0]).toFixed(2)}`])
    // What a regular foe's 100% physical hit takes of her HP, as each defensive source joins.
    const share = (u: typeof bare, cut = 0) => {
      const o = foe.stats.atk
      return `${Math.round((100 * (o * o) / (o + u.stats.pdef) * (1 - cut / 1000)) / u.stats.hp)}%`
    }
    const armorOnly = { ...bare, stats: { ...bare.stats, hp: geared.stats.hp, pdef: geared.stats.pdef } }
    const starsOnly = { ...bare, stats: { ...bare.stats, hp: bare.stats.hp + built.stats.hp - geared.stats.hp, pdef: bare.stats.pdef + built.stats.pdef - geared.stats.pdef } }
    taken.push([`Lv ${level}`, share(bare), share(starsOnly), share(armorOnly), share(bare, built.guard ?? 0), share(built, built.guard ?? 0)])
  }
  return table(['Level', 'Gear grade, skill depth', 'Uma stats (level)', 'Extra Stats', 'Weapon Might', 'Armor', 'Offense',
    'Hit: + Extra Stats', 'Hit: + weapon', 'Hit: + armor', 'Hit: all three', 'Skill depth vs depth 1'], offense) +
    '\n\nA regular foe\'s 100% physical hit, as a share of her HP:\n\n' +
    table(['Level', 'Uma stats only', '+ Extra Stats (HP, DEF)', '+ armor (HP, DEF)', '+ Iron Talisman', 'All (on curve)'], taken) +
    '\n\nThe Brawler leans ATK ×1.1 and DEF ×1.1; her on-curve nodes go to ATK, HP, DEF and M.DEF in turn, and she wears a Vampire and an Iron Talisman.'
}

function foeScaling(): string {
  const t = RPG_FOE_TUNING
  return table(['Setting', 'Value'], [
    ['HP', `(${t.hpBase} + ${t.hpPerStat} × reference stat) × role × rank`],
    ['Offense', `Set so a 100% hit takes a share of an average Uma's HP at her level (${pct(t.hitShareStart)} at Lv 1, ${pct(t.hitShare)} from Lv ${t.hitShareFull}), × the offense budget, × role`],
    ['Sub-boss and boss HP', `×${t.subBossHp} and ×${t.bossHp}, times the party's reachable skill depth`],
    ['Build budget', `What a built party's gear and Extra Stats call for: HP and defense ×(1 + ${t.budgetPerLevel} × (L − 1)² ÷ 49), ×${x(Math.round(rpgFoeBudget(50, t.budgetPerLevel) * 100) / 100)} at Lv 50; offense ×${x(Math.round(rpgFoeBudget(50, t.offenseBudgetPerLevel) * 100) / 100)} at Lv 50`],
    ['World: regular foes', `+${pct(WORLD_TUNING.regularHpPerLevel)} HP per level`],
    ['World: elites', `+${pct(WORLD_TUNING.eliteHpPerLevel)} HP per level`],
    ['World: region bosses', `${x(WORLD_TUNING.bossHp)} a champion's HP`],
    ['Acting twice', `From Lv ${WORLD_BOSS_TWICE_FROM}: a lone region boss and an elite's sub-boss; a lone elite always`],
    ['Formations', `A foe's offense is the square root of her HP share against a pair's foe, at most a full foe's`],
    ['Shields', `Regular ${t.regularShield} (by formation), sub-boss ${t.subBossShield}, boss ${t.bossShield}`],
  ])
}

// --- Materials, dishes, gear, tokens ---------------------------------------------------------------------------------

function families(): string {
  return table(['Family', 'Id', 'Side', 'Feeds', 'Site', 'Refined at'], ITEM_FAMILIES.map((f) => [f.name, `\`${f.id}\``, f.side === 'farming' ? 'Farming' : 'Gathering',
    EFFECT_LABEL[f.effect], placeById(f.site)?.name ?? f.site, f.side === 'farming' ? placeById('pantry')?.name ?? 'pantry' : placeById('workbench')?.name ?? 'workbench']))
}
function items(): string {
  const out: string[] = []
  for (const f of ITEM_FAMILIES) {
    out.push(`### ${f.name} (\`${f.id}\`, ${EFFECT_LABEL[f.effect]}, ${placeById(f.site)?.name ?? f.site})`, '')
    out.push(table(['Grade', 'Raw', 'Refined', 'Unlocks at profession Lv'], f.raw.map((r, i) => [
      r.grade, `${r.name} (\`${r.id}\`)`, `${f.refined[i]!.name} (\`${f.refined[i]!.id}\`)`, gradeUnlockLevel(r.grade),
    ])), '')
  }
  return out.join('\n').trimEnd()
}
function dishes(): string {
  return table(['Dish', 'Id', 'Kind', 'Grade', 'Feeds', 'Ingredients'], DISHES.map((d) => [d.name, `\`${d.id}\``, cap(d.kind), d.grade,
    d.effects.map((e) => EFFECT_LABEL[e]).join(', '), inputs(d.inputs)]))
}
function gear(): string {
  const family = (id: string) => ITEM_FAMILIES.find((f) => f.id === id)?.name ?? id
  const slot = (t: EquipType) => (isWeapon(t) ? 'Weapon' : isAccessory(t) ? `Accessory (${ACCESSORY_LABEL[accessoryKindOf(t)]})`
    : ARMOR_SLOT_LABEL[slotOf(t) as keyof typeof ARMOR_SLOT_LABEL])
  const g10 = (t: EquipType) => gearById(gearId(t, 10))!
  const effect = (t: EquipType): string => {
    const a = accessoryEffects(g10(t))
    const parts = [a.regen && `heals ${a.regen / 10}% of her HP a round`, a.mpRegen && `restores ${a.mpRegen} MP a round`, a.lifesteal && `heals ${a.lifesteal / 10}% of physical damage dealt`,
      a.mpSteal && `restores MP as ${a.mpSteal / 10}% of magical damage dealt`, a.barrier && `a shield of ${a.barrier / 10}% of her HP against physical damage`,
      a.veil && `a shield of ${a.veil / 10}% of her HP against magical damage`, a.guard && `${a.guard / 10}% less physical damage taken`, a.resist && `${a.resist / 10}% less magical damage taken`,
      a.thorns && `returns ${a.thorns / 10}% of physical damage taken`, a.mirror && `returns ${a.mirror / 10}% of magical damage taken`].filter(Boolean)
    return parts.join('; ')
  }
  const does = (t: EquipType) => {
    if (isWeapon(t)) return `Might +${mightOf(10)} on its hits`
    if (isOrb(t)) return 'Its kind on every hit, for weaknesses'
    if (isAccessory(t)) return effect(t)
    const p = gearPoints(g10(t))
    return ITEM_EFFECTS.filter((e) => p[e]).map((e) => `${EFFECT_LABEL[e]} +${p[e]}`).join(', ')
  }
  return table(['Type', 'Id', 'Slot', 'Half', 'Recipe families, grades 1–4 (then again from grade 5)', 'Example recipe: grade 3', 'At grade 10'], EQUIP_TYPES.map((t) => [
    EQUIP_LABEL[t], `\`${t}-g<grade>\``, slot(t), isMagicalGear(t) ? 'Magical' : 'Physical',
    [1, 2, 3, 4].map((g) => recipeFamilies(t, g).map(family).join(' + ')).join(' → '), inputs(gearById(gearId(t, 3))!.inputs), does(t),
  ])) + `\n\nA weapon's Might adds to the offense of the hits made with it, by grade: ${MIGHT_BY_GRADE.slice(1).join(', ')} (D142). Armor adds ATK (physical) or M.ATK (magical), +1 every two grades from grade 2 (${armorOffense(10)} at grade 10, D142), and its slot's defensive stat +${ARMOR_DEFENSE_PER_GRADE} a grade (D141). ` +
    `An Uma wears two accessories of different types.`
}

function ranks(): string {
  const gearRows: Cell[][] = [1, 2, 3, 5, 7, 9].map((r) => [r, gearExpToNext(r).toLocaleString('en-US'), `Lv ${5 * (r + 1) - 4}`])
  const classRows: Cell[][] = [1, 10, 20, 30, 40, 49].map((r) => [r, classExpToNext(r).toLocaleString('en-US')])
  return table(['Bar', 'Ranks', 'Per win worth E Uma EXP', 'Opens'], [
    ['Class Rank, per class', `1–${CLASS_MAX_RANK}`, `${CLASS_EXP_SHARE}E to the class she fought as`, 'Its trees: cores at 1, 10, 20, 30, 40; side skills at 5 … 45; a side point a rank'],
    ['Weapon Rank, per weapon', `1–${GEAR_MAX_RANK}`, `${WEAPON_EXP_SHARE}E over her five weapons, double for each she used`, 'Wears that weapon up to its rank\'s grade'],
    ['Armor Rank, per armor kind', `1–${GEAR_MAX_RANK}`, `${ARMOR_EXP_SHARE}E to each of her five armor kinds`, 'Wears that kind up to its rank\'s grade'],
    ['Accessory Rank, per accessory kind', `1–${GEAR_MAX_RANK}`, `${ACCESSORY_EXP_SHARE}E to the kind of each accessory she wears`, 'Wears accessories of that kind up to its rank\'s grade'],
  ]) + '\n\n' + table(['Class Rank', 'EXP to next'], classRows) + '\n\n' + table(['Weapon or Armor Rank', 'EXP to next', 'Next rank, used every fight, by'], gearRows) +
    `\n\nPast a max rank, EXP banks at ${pct(MARKS_SHARE)} as Marks: Gear Marks from weapons and armor, Class Marks from classes. A Manual costs ${MANUAL_PRICE.toLocaleString('en-US')} Marks and gives ${MANUAL_EXP.toLocaleString('en-US')} EXP to one bar of one Uma. ` +
    `Armor kinds by slot: ${ARMOR_SLOTS.map((s) => `${ARMOR_SLOT_LABEL[s]} ${ARMOR_SLOT_KINDS[s].map((k) => ARMOR_LABEL[k]).join(' or ')}`).join('; ')}. ${ARMOR_KINDS.length} kinds in all. ` +
    `Accessory kinds: ${ACCESSORY_KINDS.map((k) => ACCESSORY_LABEL[k]).join(', ')}.`
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
  return table(['Level', 'Uma EXP to next', 'Profession EXP to next'], rows) +
    `\n\nUma EXP to next level: 120 + 16 × level, up to Lv ${RPG_TIER_MAX_LEVEL}. A stage pays its weight × her own EXP to next level, −${pct(RPG_LEVEL_EXP_STEP)} per level she's above the foes (down to ${pct(RPG_LEVEL_EXP_MIN)}), never more than ${pct(RPG_LEVEL_EXP_MAX)}. Shards at Lv ${RPG_SHARD_LEVELS.join(', ')}. Profession EXP to next: ${professionExpToNext(0).toLocaleString('en-US')} + ${professionExpToNext(1) - professionExpToNext(0)} × level; jobs pay ${EXP_PER_MINUTE} EXP per base minute of work, so a level takes ${professionExpToNext(1) / EXP_PER_MINUTE / 60} base hours at Lv1 and ${professionExpToNext(PROFESSION_MAX_LEVEL - 1) / EXP_PER_MINUTE / 60} at Lv${PROFESSION_MAX_LEVEL - 1}.`
}
function prices(): string {
  return table(['Thing', 'Price (Laurels)'], [
    ...[1, 4, 7, 10].map((g) => [`Raw item, grade ${g}`, rawItemPrice(g)] as Cell[]),
    ['Time Ticket', TIME_TICKET_PRICE], ['Sweep Ticket', SWEEP_TICKET_PRICE],
  ]) + `\n\nA Time Ticket takes ${TIME_TICKET_SPAN / 60000} minutes off a running job. A Manual costs ${MANUAL_PRICE.toLocaleString('en-US')} Marks, not Laurels.`
}
const minutes = (m: number): string => `${Number(m.toFixed(1))} min`
const hours = (m: number): string => `${Number((m / 60).toFixed(1))} h`
function jobs(): string {
  return table(['Setting', 'Value'], [
    ['Gather one item', `any grade, by profession level: ${minutes(itemMinutes(1))} at Lv1, falling evenly to ${minutes(itemMinutes(PROFESSION_MAX_LEVEL))} at Lv${PROFESSION_MAX_LEVEL} (ten in ${hours(10 * itemMinutes(1))} and ${hours(10 * itemMinutes(PROFESSION_MAX_LEVEL))})`],
    ['Refine one item', `a quarter of that: ${minutes(refineMinutes(1))} at Lv1, ${minutes(refineMinutes(PROFESSION_MAX_LEVEL))} at Lv${PROFESSION_MAX_LEVEL}`],
    ['Cook or craft one', `twice a gather: ${minutes(makeMinutes(1))} at Lv1, ${minutes(makeMinutes(PROFESSION_MAX_LEVEL))} at Lv${PROFESSION_MAX_LEVEL}`],
    ['Profession EXP', `${EXP_PER_MINUTE} per minute of the job at her level, before the facility's speed`],
    ['Outputs per job', `gathering, cooking and crafting 1–${MAX_JOB_COUNT}; refining ${REFINE_BATCHES.map((n) => `×${n}`).join(', ')}`],
    ['Jobs queued after it', String(MAX_QUEUE)],
    ['Facility levels', `1–3: ${FACILITY_SLOTS.join(', ')} Uma slots; speed ${FACILITY_SPEED.map(x).join(', ')}`],
    ['Upgrade to Lv 2 / 3', FACILITY_UPGRADE.map((u) => `${u.laurels} Laurels + ${u.count}× grade-${u.grade} refined of each of its two families`).join(' / ')],
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
function facilities(): string {
  const family = (id: string | null) => (id ? ITEM_FAMILIES.find((f) => f.id === id)?.name ?? id : '—')
  return table(['Place', 'Job', 'Profession', 'Makes', 'Upgraded with'], FACILITIES.map((f) => [
    placeById(f.id)?.name ?? f.id, cap(f.kind), f.profession ? cap(f.profession) : '—',
    f.kind === 'gather' ? family(f.family) : f.kind === 'refine' ? (f.profession === 'farming' ? 'Farming refined items' : 'Gathering refined items') : f.kind === 'cook' ? 'Dishes' : 'Gear',
    f.upgradeFamilies.map(family).join(' + '),
  ]))
}

// --- The world ------------------------------------------------------------------------------------------------------

function biomes(): string {
  return table(['Biome', 'Id', 'Signatures (weak to)', 'Formations', 'Roles'], BIOMES.map((b) => [
    b.name, `\`${b.id}\``, b.signatures.map((s) => `${s.join('+')} (${signatureWeaknesses(s).join(', ') || 'weapons only'})`).join('; '),
    b.formations.join(', '), b.roles.join(', '),
  ]))
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
    classes, weapons, depths, 'skill-trees': skillTrees, limits, heroes, 'battle-constants': battleConstants, 'foe-roles': foeRoles, 'foe-scaling': foeScaling,
    'damage-sources': damageSources,
    families, items, dishes, gear, ranks, laurels, levels, prices, jobs, places, facilities, biomes, faces, formations, continents,
    'pacing-sim': pacingSimulation, 'region-sample': regionSample, world, dependencies: () => dependencies(context.packages),
    'active-slots': () => `${RPG_BASE_ACTIVE_SLOTS} equipped skills at Lv 1, one more at Lv ${RPG_ACTIVE_SLOT_GATES.join(', ')} (${RPG_BASE_ACTIVE_SLOTS + RPG_ACTIVE_SLOT_GATES.length} at most). ${RPG_SIDE_POINTS_PER_LEVEL} side point per Class Rank, per class.`,
  }
  return blocks[key]?.() ?? null
}
