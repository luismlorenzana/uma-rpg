// The live docs' generated blocks (docs/game/, D92): every list in the game manual is rendered here from the rules, so it
// can't drift from the game. A doc marks a block with `<!-- live:<key> -->` … `<!-- /live -->`; `pnpm docs:update` rewrites
// them, and `docs.test.ts` fails when one is stale. Pure: no I/O (the test reads and writes the files).
import { BATTLE_LAURELS, CLASS_MAX_RANK, CLASS_RANK_HOURS, EXP_PER_MINUTE, FACILITY_SLOTS, FACILITY_SPEED, FACILITY_UPGRADE, FIRST_CLEAR_LAURELS,
  itemMinutes, LATE_LAURELS, makeMinutes, MASTERY_MAX_RANK, MASTERY_RANK_HOURS, MAX_JOB_COUNT, POINT_EVASION, POINT_LIMIT, POINT_SHARE,
  professionExpToNext, rawItemPrice, REPLAY_SHARE, SWEEP_TICKET_PRICE, TIME_TICKET_PRICE, TIME_TICKET_SPAN } from '../economy/pacing'
import { DISHES } from '../economy/dishes'
import { ACCESSORY_TYPES, EQUIP_LABEL, gearById, gearId, gearPoints, recipeFamilies, type EquipType } from '../economy/gear'
import { MAX_QUEUE, FACILITIES } from '../economy/jobs'
import { ARMOR_TYPES, CLASS_HALLS, GEAR_TYPE_LABEL, WEAPON_TYPES, weaponClasses } from '../economy/training'
import { gradeBand, levelBand, masteryBand, PROMOTION_BANDS, TOKEN_BANDS, TOKEN_CLASS_NAME, TOKEN_DROPS, TOKEN_ODDS, tokenBuyPrice, TOKENS, tokenSellPrice } from '../economy/tokens'
import { HUB_PAGE_NAMES, HUB_PAGES, placeById, placesOn } from '../hub/places'
import { EFFECT_LABEL, gradeUnlockLevel, ITEM_EFFECTS, ITEM_FAMILIES, itemById } from '../items/catalog'
import { BATTLE_LIMIT_CHARGE, BATTLE_LIMIT_MAX, BATTLE_LIMIT_NAMES, BATTLE_LIMIT_POWER } from '../rpg/battle/limit'
import * as K from '../rpg/battle/skills'
import { RPG_CLERIC_STATUS, RPG_NODES, RPG_SKILL_MP, RPG_SKILL_POWER, rpgSideNodeLevel, rpgTreeOf, type RpgNode } from '../rpg/catalog'
import { RPG_BATTLE_EXP_WEIGHTS, RPG_LEVEL_EXP_MAX, RPG_LEVEL_EXP_MIN, RPG_LEVEL_EXP_STEP, RPG_SHARD_LEVELS } from '../rpg/campaign/rewards'
import { RPG_FOE_TUNING, rpgFoe, type RpgFoeRole } from '../rpg/campaign/enemies'
import {
  isRpgTome, RPG_ACTIVE_SLOT_GATES, RPG_BASE_ACTIVE_SLOTS, RPG_CLASS_SLOTS, RPG_CLASS_STATS, RPG_CLASSES, RPG_DEPTH_GATES, RPG_SIDE_POINTS_PER_LEVEL,
  RPG_TIER_MAX_LEVEL, RPG_WEAPONS, rpgClassWeapons, rpgExpToNext, rpgHand, rpgWeaponKind, type RpgClass, type RpgWeapon,
} from '../rpg/rules'
import { BIOMES, biomeFranchise, signatureWeaknesses } from '../world/biomes'
import {
  BOSS_WAVES, CONTINENT_LEAN, regionChapter, SPRING_RECHARGE_MS, WAVE_HP, WAVE_PAY, WAVE_STAGES, WORLD_ESCORT, WORLD_FORMATIONS,
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

const CLASS_NAME: Readonly<Record<RpgClass, string>> = TOKEN_CLASS_NAME
const weaponName = (w: RpgWeapon): string => GEAR_TYPE_LABEL[w]
const itemName = (id: string) => itemById(id)?.name ?? TOKENS.find((t) => t.id === id)?.name ?? id
const inputs = (list: Record<string, number>) => Object.entries(list).map(([id, n]) => `${n > 1 ? `${n}× ` : ''}${itemName(id)}`).join(', ')

/** Each kind's one shape in every class (D86). */
const SHAPE: Readonly<Record<string, string>> = {
  greatsword: 'One foe, heavy', fire: 'One foe, heavy', axe: 'Every foe', ice: 'Every foe', lance: 'Random foes', lightning: 'Random foes',
  bow: 'One foe, many hits', light: 'One foe, many hits', katana: 'Twice: the foe and one other', dark: 'Twice: the foe and one other',
}
const LIMIT_OF: Readonly<Record<RpgClass, string>> = {
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
  return table(['Class', 'Slots', 'Trees', 'Hand: power, MP', 'Special', 'Stat lean (HP, ATK, MATK, DEF, MDEF, MP)', 'Limit Break', 'Starts as'],
    RPG_CLASSES.map((c) => {
      const h = rpgHand({ classId: c })
      const s = RPG_CLASS_STATS[c]
      const special = h.pair ? 'Every act is an Arms half and a Tome half' : h.linger ? `A summon lingers and acts again at ${h.linger}` : c === 'cleric' ? 'Each skill carries a status' : '—'
      return [CLASS_NAME[c], slots(c), rpgClassWeapons(c).length, `${x(h.power)}, ${x(h.mp)}`, special,
        [s.hp, s.atk, s.matk, s.pdef, s.mdef, s.mp].map((v) => x(v)).join(' '), LIMIT_OF[c], STARTS_AS[c]]
    }))
}

function weapons(): string {
  return table(['Weapon', 'Id', 'Kind', 'Channel', 'Shape', 'Cleric status', 'Classes'], RPG_WEAPONS.map((w) => {
    const kind = rpgWeaponKind(w)
    return [weaponName(w), `\`${w}\``, cap(kind), isRpgTome(w) ? 'Magical' : 'Physical', SHAPE[kind]!, statusName(RPG_CLERIC_STATUS[w]),
      weaponClasses(w).map((c) => CLASS_NAME[c]).join(', ')]
  }))
}
const STATUS_NAME: Readonly<Record<string, string>> = {
  'armor-break': 'Armor Break', 'mind-break': 'Mind Break', enfeeble: 'Enfeeble', shatter: 'Shatter', hex: 'Hex',
  brave: 'Brave', faith: 'Faith', aegis: 'Aegis', breaker: 'Breaker', clarity: 'Clarity',
}
const statusName = (key: string) => STATUS_NAME[key] ?? key

function depths(): string {
  return table(['Depth', 'Core skill opens', 'Side skills open', 'Side cost', 'Single-target power', 'Full-turn MP'], [1, 2, 3, 4, 5].map((d) => [
    d, `Class rank ${d} and Uma Lv ${RPG_DEPTH_GATES[d - 1]}`, `Uma Lv ${rpgSideNodeLevel(d)}`, `${d} point${d > 1 ? 's' : ''}`, RPG_SKILL_POWER[d - 1]!, RPG_SKILL_MP[d - 1]!,
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

function limits(): string {
  return table(['Class', 'Limit Break'], RPG_CLASSES.map((c) => [CLASS_NAME[c], LIMIT_OF[c]])) + '\n\n' +
    `The gauge fills to ${BATTLE_LIMIT_MAX}: +${BATTLE_LIMIT_CHARGE.attack} for an Attack, +${BATTLE_LIMIT_CHARGE.skill} for a skill. A Limit Break costs no MP and takes her turn.`
}

function battleConstants(): string {
  const rows: Cell[][] = [
    ['`BATTLE_WEAK`', K.BATTLE_WEAK, 'Damage multiplier of a weak hit'],
    ['`BATTLE_UNBROKEN_FACTOR`', K.BATTLE_UNBROKEN_FACTOR, 'Damage a foe takes while its shield stands'],
    ['`BATTLE_DEFENSE_SHARE`', K.BATTLE_DEFENSE_SHARE, 'Share of defense subtracted from offense'],
    ['`BATTLE_MIN_OFFENSE_SHARE`', K.BATTLE_MIN_OFFENSE_SHARE, 'Floor: a hit keeps at least this share of offense'],
    ['`BATTLE_GUARD_FACTOR`', K.BATTLE_GUARD_FACTOR, 'Damage a guarding ally takes for the one she covers'],
    ['`BATTLE_BREAK_ROUNDS`', K.BATTLE_BREAK_ROUNDS, 'Rounds a Break lasts (the foe loses its actions)'],
    ['`BATTLE_MAX_ROUNDS`', K.BATTLE_MAX_ROUNDS, 'Round cap per wave; past it the fight is lost'],
    ['`BATTLE_STATUS_TURNS`', K.BATTLE_STATUS_TURNS, 'Default rounds a status lasts'],
    ['`BATTLE_STATUS_STACK_CAP`', K.BATTLE_STATUS_STACK_CAP, 'Stacks a status can reach'],
    ['`BATTLE_STATUS_STEP`', K.BATTLE_STATUS_STEP, 'Per stack: Cleric statuses, Mark, Shock'],
    ['`BATTLE_FOE_STATUS_STEP`', K.BATTLE_FOE_STATUS_STEP, 'Per stack: foes\' Weaken, Slow, Power-up, Ward'],
    ['`BATTLE_BURN_PERCENT`', K.BATTLE_BURN_PERCENT, 'Max HP lost per Burn stack at the end of a round'],
    ['`BATTLE_CLARITY_PERCENT`', K.BATTLE_CLARITY_PERCENT, 'Max MP restored per Clarity stack'],
    ['`BATTLE_BARRIER_PERCENT`', K.BATTLE_BARRIER_PERCENT, 'Barrier per stack, as a share of max HP'],
    ['`BATTLE_BARRIER_CAP`', K.BATTLE_BARRIER_CAP, 'Barrier cap, as a share of max HP'],
    ['`BATTLE_LIMIT_MAX`', BATTLE_LIMIT_MAX, 'Limit Break gauge'],
  ]
  return table(['Constant', 'Value', 'Meaning'], rows)
}

function foeRoles(): string {
  const roles: RpgFoeRole[] = ['striker', 'caster', 'guard', 'skirmisher', 'captain', 'champion']
  return table(['Role', 'Moves', 'Below 50% HP'], roles.map((role) => {
    const f = rpgFoe({ id: 'f', castId: 'c', element: 'fire', role, rank: role === 'champion' ? 'boss' : role === 'captain' ? 'sub-boss' : 'regular', level: 10, shield: 2, weaknesses: { weapons: [], elements: [] } })
    const list = (moves: typeof f.moves) => moves.map((m) => `${m.label} (${m.kind}${m.power ? `, ${m.power}%` : ''}, ${m.target})`).join('; ')
    return [cap(role), list(f.moves), f.phaseTwo ? list(f.phaseTwo.moves) : '—']
  })) + '\n\nShown with Fire; a foe uses her own element, and a dual-element foe her second element for her second elemental move.'
}

function foeScaling(): string {
  const t = RPG_FOE_TUNING
  return table(['Setting', 'Value'], [
    ['HP', `(${t.hpBase} + ${t.hpPerStat} × reference stat) × role × rank`],
    ['Sub-boss and boss HP', `×${t.subBossHp} and ×${t.bossHp}, times the party's reachable skill depth`],
    ['Gear budget', `+${pct(t.budgetPerLevel)} to every stat per level past Lv ${t.budgetFrom}`],
    ['World: regular foes', `+${pct(WORLD_TUNING.regularHpPerLevel)} HP and +${pct(WORLD_TUNING.regularOffensePerLevel)} offense per level`],
    ['World: elites', `+${pct(WORLD_TUNING.eliteHpPerLevel)} HP and +${pct(WORLD_TUNING.eliteOffensePerLevel)} offense per level`],
    ['World: region bosses', `${x(WORLD_TUNING.bossHp)} a champion's HP, +${pct(WORLD_TUNING.bossOffensePerLevel)} offense per level`],
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
    out.push(table(['Grade', 'Raw', 'Refined', 'Unlocks at profession Lv', 'Minutes to gather or refine one', 'Minutes to cook or craft at this grade'], f.raw.map((r, i) => [
      r.grade, `${r.name} (\`${r.id}\`)`, `${f.refined[i]!.name} (\`${f.refined[i]!.id}\`)`, gradeUnlockLevel(r.grade), itemMinutes(r.grade), makeMinutes(r.grade),
    ])), '')
  }
  return out.join('\n').trimEnd()
}
function dishes(): string {
  return table(['Dish', 'Id', 'Kind', 'Grade', 'Feeds', 'Ingredients'], DISHES.map((d) => [d.name, `\`${d.id}\``, cap(d.kind), d.grade,
    d.effects.map((e) => EFFECT_LABEL[e]).join(', '), inputs(d.inputs)]))
}
function gear(): string {
  const types: EquipType[] = [...WEAPON_TYPES, ...ARMOR_TYPES, ...ACCESSORY_TYPES]
  const family = (id: string) => ITEM_FAMILIES.find((f) => f.id === id)?.name ?? id
  const slot = (t: EquipType) => (WEAPON_TYPES as readonly string[]).includes(t) ? 'Weapon' : (ARMOR_TYPES as readonly string[]).includes(t) ? 'Armor' : 'Accessory'
  const points = (t: EquipType) => Object.entries(gearPoints(gearById(gearId(t, 10, 'hp'))!, 5)).filter(([, v]) => v > 0)
    .map(([k, v]) => `${EFFECT_LABEL[k as keyof typeof EFFECT_LABEL]} ${Math.round(v * 100) / 100}`).join(', ')
  return table(['Type', 'Id', 'Slot', 'Recipe families (one refined item each)', 'Example recipe: grade 3', 'Points at grade 10, HP accent'], types.map((t) => [
    EQUIP_LABEL[t], `\`${t}\``, slot(t), recipeFamilies(t).map(family).join(', '), inputs(gearById(gearId(t, 3, 'atk'))!.inputs), points(t),
  ])) + '\n\nA weapon\'s offense is split over the five weapons of her class (shown that way above).'
}
function tokens(): string {
  const rows: Cell[][] = Array.from({ length: TOKEN_BANDS }, (_, i) => i + 1).map((band) => {
    const lv = [1, 11, 21, 31, 41][band - 1]!
    const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((g) => gradeBand(g) === band)
    const from = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((l) => masteryBand(l) === band)
    return [band, `Lv ${lv}–${lv + 9}`, `G${grades[0]}–${grades.at(-1)}`, band <= PROMOTION_BANDS ? `rank ${band} → ${band + 1}` : '—',
      from.map((l) => `${l} → ${l + 1}`).join(', '), TOKENS.filter((t) => t.band === band).length]
  })
  return table(['Band', 'Dropped by stages at', 'Cooking grades', 'Promotion', 'Mastery', 'Token kinds'], rows) + '\n\n' +
    table(['Kind', 'Id pattern', 'Per band', 'Odds per drop', 'Used for'], [
      ['Promotion', '`token-class-<class>-<band>`', '5 (bands 1–4)', pct(TOKEN_ODDS.class), 'Class rank-ups'],
      ['Mastery', '`token-mastery-<band>`', '1', pct(TOKEN_ODDS.mastery), 'Weapon, Armor and Accessory Level-ups: from Level L, band ⌈L/2⌉'],
      ['Cooking', '`token-cook-<stat>-<band>`', String(ITEM_EFFECTS.length), pct(TOKEN_ODDS.cook), 'Every dish (each stat it feeds)'],
    ]) + '\n\n' + table(['Stage kind', 'Tokens per first clear'], Object.entries(TOKEN_DROPS).map(([k, n]) => [cap(k), n])) +
    `\n\nA stage in waves drops one more token per extra wave: ${TOKEN_DROPS.fight + 1} on stages 8 and 9, ${TOKEN_DROPS.boss + BOSS_WAVES - 1} from the boss.` +
    `\n\nReplays and Sweeps roll each token at ${pct(REPLAY_SHARE)} of its odds. Exchange: sell for ${tokenSellPrice('token-mastery-1')} Laurels a band, buy for ${tokenBuyPrice('token-mastery-1')} a band.`
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
    `\n\nUma EXP to next level: 120 + 16 × level, up to Lv ${RPG_TIER_MAX_LEVEL}. A stage pays its weight × the EXP to next level at the foes' level, ±${pct(RPG_LEVEL_EXP_STEP)} per level of gap (from ${pct(RPG_LEVEL_EXP_MIN)} to ${pct(RPG_LEVEL_EXP_MAX)}). Shards at Lv ${RPG_SHARD_LEVELS.join(', ')}. Profession EXP to next: 20 + 6 × level; jobs pay ${EXP_PER_MINUTE} EXP per minute of work.`
}
function prices(): string {
  return table(['Thing', 'Price (Laurels)'], [
    ...[1, 4, 7, 10].map((g) => [`Raw item, grade ${g}`, rawItemPrice(g)] as Cell[]),
    ['Time Ticket', TIME_TICKET_PRICE], ['Sweep Ticket', SWEEP_TICKET_PRICE],
    ...[1, 3, 5].map((b) => [`Token, band ${b} (sell / buy)`, `${tokenSellPrice(`token-mastery-${b}`)} / ${tokenBuyPrice(`token-mastery-${b}`)}`] as Cell[]),
  ]) + `\n\nA Time Ticket takes ${TIME_TICKET_SPAN / 60000} minutes off a running job or training.`
}
function jobs(): string {
  return table(['Setting', 'Value'], [
    ['Gather or refine one item', 'grade g: 30 + 30 × g minutes (G1 1 h, G10 5 h 30)'],
    ['Cook or craft one', 'twice that: 60 + 60 × g minutes'],
    ['Outputs per job', `up to ${MAX_JOB_COUNT}`],
    ['Jobs queued after it', String(MAX_QUEUE)],
    ['Facility levels', `1–3: ${FACILITY_SLOTS.join(', ')} Uma slots; speed ${FACILITY_SPEED.map(x).join(', ')}`],
    ['Upgrade to Lv 2 / 3', FACILITY_UPGRADE.map((u) => `${u.laurels} Laurels + ${u.count}× grade-${u.grade} refined of each of its two families`).join(' / ')],
    ['Class rank', `${CLASS_RANK_HOURS} h of training per rank, ranks 1–${CLASS_MAX_RANK}`],
    ['Weapon, Armor and Accessory Levels', `${MASTERY_RANK_HOURS} h per level, 1–${MASTERY_MAX_RANK}`],
    ['Extra Stats', `${pct(POINT_SHARE)} to its stat per point; Speed ${pct(POINT_EVASION)} evasion; Limit +${POINT_LIMIT} starting charge`],
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
    f.kind === 'gather' ? family(f.family) : f.kind === 'train' ? (CLASS_HALLS[f.id] ? `${CLASS_NAME[CLASS_HALLS[f.id]!.classId]} rank and Weapon Level` : f.id === 'armory' ? 'Armor Level' : 'Accessory Level')
      : f.kind === 'refine' ? (f.profession === 'farming' ? 'Farming refined items' : 'Gathering refined items') : f.kind === 'cook' ? 'Dishes' : 'Gear',
    f.upgradeFamilies.map(family).join(' + '),
  ]))
}

// --- The world ------------------------------------------------------------------------------------------------------

function biomes(): string {
  return table(['Biome', 'Id', 'Signatures (weak to)', 'Formations', 'Roles', 'Faces'], BIOMES.map((b) => [
    b.name, `\`${b.id}\``, b.signatures.map((s) => `${s.join('+')} (${signatureWeaknesses(s).join(', ') || 'weapons only'})`).join('; '),
    b.formations.join(', '), b.roles.join(', '), biomeFranchise(b.id) ?? 'mixed pool',
  ]))
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
      rows.push([`Lv ${c.levelStart + row}`, ...regions.map((r) => `${r.name} \`${r.id}\``), spring ? `Spring \`${spring.id}\`` : ''])
    }
    out.push(table(['Level', 'Region 1', 'Region 2', 'Region 3', 'Region 4', 'Spring on the way in'], rows), '')
  }
  return out.join('\n').trimEnd()
}
function regionSample(): string {
  const c = worldContinent({ name: 'Continent 1', order: 1 })
  const region = c.regions.find((r) => r.biome === 'volcano')!
  const chapter = regionChapter(region, SAMPLE_CAST)
  return `${region.name} \`${region.id}\`, Lv ${region.level}:\n\n` + table(['Stage', 'Kind', 'Name', 'Signature', 'Foes per wave', 'Notes'],
    chapter.nodes.filter((n) => n.kind !== 'camp').map((n, i) => {
      const waves = [n.enemies, ...(n.waves ?? [])]
      const notes = [...new Set(waves.flat().flatMap((e) => [e.twice ? 'acts twice' : '', e.element2 ? 'dual element' : '', e.rank !== 'regular' ? e.rank : '']).filter(Boolean))]
      return [i + 1, n.kind, n.name, n.note ?? n.element ?? '', waves.map((w) => w.length).join(' + '), notes.join(', ') || '—']
    }))
}
function world(): string {
  return table(['Setting', 'Value'], [
    ['Continents', '5 per tier, one per scenario, 10 levels each'],
    ['Regions', '40 per continent, 4 per level, every biome at least twice; the first is a Meadow'],
    ['Stages', '12 per region: 10 regular, an elite (11), the boss (12)'],
    ['Springs', `5 per continent, one every two levels; recharge ${SPRING_RECHARGE_MS / 3600000} h`],
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
    classes, weapons, depths, 'skill-trees': skillTrees, limits, 'battle-constants': battleConstants, 'foe-roles': foeRoles, 'foe-scaling': foeScaling,
    families, items, dishes, gear, tokens, laurels, levels, prices, jobs, places, facilities, biomes, formations, continents,
    'region-sample': regionSample, world, dependencies: () => dependencies(context.packages),
    'active-slots': () => `${RPG_BASE_ACTIVE_SLOTS} equipped skills at Lv 1, one more at Lv ${RPG_ACTIVE_SLOT_GATES.join(', ')} (${RPG_BASE_ACTIVE_SLOTS + RPG_ACTIVE_SLOT_GATES.length} at most). ${RPG_SIDE_POINTS_PER_LEVEL} side point per level.`,
  }
  return blocks[key]?.() ?? null
}
