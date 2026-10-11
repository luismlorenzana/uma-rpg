// Every class tree, node and number (D86, docs/design/class-rework.md). One rule per class builds each tree, so a
// rebalance changes a rule here, not a table of cells. Powers are full-turn units (a Brawler's Attack = 1.0) before the
// class's hand (rules.ts) scales them. Every tree is one line of five depths: a core skill and two side skills (A, B)
// at each. Each kind keeps one shape in every class: Greatsword and Fire hit one foe hard, Axe and Ice every foe, Lance
// and Lightning random foes, Bow and Light one foe many times, Katana and Dark twice.
import {
  isRpgTome, RPG_TOMES, RPG_WEAPON_KINDS, RPG_WEAPONS, rpgWeaponKind,
  type RpgClass, type RpgDamageKind, type RpgStatusKind, type RpgTreeId, type RpgWeapon, type RpgWeaponKind,
} from './kinds'

/** Single-target total power by depth, and the full-turn MP by depth (6 + 4 × depth). */
export const RPG_SKILL_POWER = [1.6, 2.2, 2.9, 3.7, 4.6] as const
export const RPG_SKILL_MP = [10, 14, 18, 22, 26] as const
/** Every-foe skills deal this share of single-target power to each foe; random multi-hits get a small bonus. */
export const RPG_AOE_SHARE = 0.55
export const RPG_RANDOM_BONUS = 1.05
/** A depth's side skills open at mid-band, Uma Lv 5, 15, 25, 35 and 45 (D73); its core with the class rank (D77). */
export const rpgSideNodeLevel = (depth: number): number => 10 * depth - 5

export interface RpgPart { kind: RpgDamageKind; share: number }
export interface RpgHit { power: number; parts: RpgPart[] }
export type RpgSkillTarget = 'one' | 'all' | 'random'
/** A Cleric skill's status (D86): an Arms blow debuffs the foe, a Tome spell buffs every ally. */
export type RpgStatusKey = 'armor-break' | 'mind-break' | 'enfeeble' | 'shatter' | 'hex' | 'brave' | 'faith' | 'aegis' | 'breaker' | 'clarity'
export interface RpgSkillDef {
  target: RpgSkillTarget
  /** `all`: every foe takes each hit. `one`: every hit on the tapped foe. `random`: each hit on a random living foe. */
  hits: RpgHit[]
  /** Extra hits on the tapped foe after an every-foe skill (Reap). */
  focus?: RpgHit[]
  /** After the last hit, one hit on every other living foe (Spread). */
  splash?: RpgHit
  /** Hits on one other living foe, picked by the fight's seed (Cross). */
  other?: RpgHit[]
  /** Full-turn MP at Tier 1, before the hand factor. */
  mp: number
  /** The kind the skill is known by. */
  primary: RpgDamageKind
  rider?: { status: RpgStatusKind; stacks: number; per: 'foe' | 'hit' }
  /** Every living ally gains this (Heaven's Legion). */
  allies?: { status: 'barrier'; stacks: number }
  special?: 'pierce' | 'vs-broken' | 'vs-wounded'
  /** The Cleric's status: on the foe hit, on every foe, or on every ally. */
  status?: { key: RpgStatusKey; stacks: number; turns: number; to: 'foe' | 'foes' | 'allies' }
  /** A summon: it stays on the field and acts again at this share when its Summoner next summons (D86). */
  summon?: { linger: number }
}
export interface RpgNode {
  id: string
  tree: RpgTreeId
  classId: RpgClass
  weapon: RpgWeapon
  depth: number
  variant: 'a' | 'b' | null
  name: string
  /** Side skills cost their depth in points; core skills come free as their depth opens (D86). */
  cost: number
  skill: RpgSkillDef
  /** One line for the tree screen. */
  summary: string
}

const power = (d: number) => RPG_SKILL_POWER[d - 1]!
const mp = (d: number) => RPG_SKILL_MP[d - 1]!
const at = <T>(list: readonly T[], d: number) => list[d - 1]!
const round = (n: number) => Math.round(n * 1000) / 1000
/** `n` hits of one kind sharing `total`. */
const pure = (n: number, total: number, kind: RpgDamageKind): RpgHit[] =>
  Array.from({ length: n }, () => ({ power: round(total / n), parts: [{ kind, share: 1 }] }))
const plus = (def: RpgSkillDef, more: Partial<RpgSkillDef>): RpgSkillDef => ({ ...def, ...more })

const STATUS_TEXT: Readonly<Record<RpgStatusKey, string>> = {
  'armor-break': 'Armor Break', 'mind-break': 'Mind Break', enfeeble: 'Enfeeble', shatter: 'Shatter', hex: 'Hex',
  brave: 'Brave', faith: 'Faith', aegis: 'Aegis', breaker: 'Breaker', clarity: 'Clarity',
}
function describe(skill: RpgSkillDef): string {
  const per = skill.target === 'all' ? 'every foe' : skill.target === 'random' ? 'random foes' : 'one foe'
  const n = skill.hits.length
  const total = skill.hits.reduce((s, h) => s + h.power, 0)
  const parts = [`${per} · ${n} hit${n === 1 ? '' : 's'} · ${round(total)}`]
  if (skill.status) parts.push(`${STATUS_TEXT[skill.status.key]} ${skill.status.stacks} ${skill.status.to === 'allies' ? 'on every ally' : skill.status.to === 'foes' ? 'on every foe' : 'on the foe'}`)
  if (skill.summon) parts.push(`lingers at ${skill.summon.linger}`)
  return parts.join(' · ')
}

const NODES: RpgNode[] = []
interface TreeSpec {
  classId: RpgClass
  weapon: RpgWeapon
  names: readonly string[]
  a: readonly string[]
  b: readonly string[]
  core: (d: number) => RpgSkillDef
  sideA: (d: number) => RpgSkillDef
  sideB: (d: number) => RpgSkillDef
}
export const rpgTreeOf = (classId: RpgClass, weapon: RpgWeapon): RpgTreeId => `${classId}-${weapon}`
function addTree(spec: TreeSpec): void {
  const tree = rpgTreeOf(spec.classId, spec.weapon)
  for (let d = 1; d <= 5; d += 1) {
    const base = { tree, classId: spec.classId, weapon: spec.weapon, depth: d, cost: d }
    const core = spec.core(d)
    NODES.push({ ...base, id: `${tree}.${d}`, variant: null, name: at(spec.names, d), skill: core, summary: describe(core) })
    for (const side of ['a', 'b'] as const) {
      const skill = side === 'a' ? spec.sideA(d) : spec.sideB(d)
      NODES.push({ ...base, id: `${tree}.${d}${side}`, variant: side, name: at(side === 'a' ? spec.a : spec.b, d), skill, summary: describe(skill) })
    }
  }
}

const GH = [1, 1, 2, 2, 3], SH = [2, 2, 4, 4, 6], LH = [2, 2, 3, 3, 4]
const half = (d: number) => Math.max(1, at(SH, d) / 2)

// --- Brawler: the five Arms at full power -----------------------------------------------------------------------------

const BRAWLER: Readonly<Record<RpgWeaponKind, Omit<TreeSpec, 'classId' | 'weapon'>>> = {
  greatsword: {
    names: ['Heavy Slash', 'Cleave', 'Sunder', 'Rend', 'Meteor Strike'],
    a: ['Crush', 'Bone Crush', 'Rampart Breaker', 'Cataclysm', 'Worldbreaker'],
    b: ['Twin Slash', 'Double Cleave', 'Triple Sunder', 'Rending Combo', 'Meteor Combo'],
    core: (d) => ({ target: 'one', hits: pure(at(GH, d), power(d), 'greatsword'), mp: mp(d), primary: 'greatsword',
      ...(d === 5 ? { rider: { status: 'armor-break', stacks: 2, per: 'foe' } } : {}) }),
    sideA: (d) => ({ target: 'one', hits: pure(1, 1.15 * power(d), 'greatsword'), mp: mp(d) + 2, primary: 'greatsword' }),
    sideB: (d) => ({ target: 'one', hits: pure(at(GH, d) + 1, 0.92 * power(d), 'greatsword'), mp: mp(d), primary: 'greatsword' }),
  },
  axe: {
    names: ['Sweep', 'Whirl', 'Cyclone', 'Quake', 'Maelstrom'],
    a: ['Wide Sweep', 'Twin Whirl', 'Grand Cyclone', 'Aftershock', 'Tempest'],
    b: ['Hewing Sweep', 'Reaping Whirl', "Headsman's Cyclone", 'Guillotine Quake', "Executioner's Storm"],
    core: (d) => ({ target: 'all', hits: pure(at(GH, d), RPG_AOE_SHARE * power(d), 'axe'), mp: mp(d) + 4, primary: 'axe',
      ...(d === 5 ? { rider: { status: 'armor-break', stacks: 1, per: 'foe' } } : {}) }),
    sideA: (d) => ({ target: 'all', hits: pure(at(GH, d) + 1, 0.5 * power(d), 'axe'), mp: mp(d) + 6, primary: 'axe' }),
    sideB: (d) => ({ target: 'all', hits: pure(at(GH, d), 0.45 * power(d), 'axe'), focus: pure(1, 0.5 * power(d), 'axe'), mp: mp(d) + 6, primary: 'axe' }),
  },
  lance: {
    names: ['Thrust Flurry', 'Lance Barrage', 'Spiral Barrage', 'Dragon Dive', "Heaven's Rain"],
    a: ['Piercing Thrust', 'Impaler', 'Skewer', 'Dragon Fang', 'Gungnir'],
    b: ['Scatter Thrust', 'Wild Barrage', 'Storm of Spears', 'Dragon Swarm', 'Thousand Spears'],
    core: (d) => ({ target: 'random', hits: pure(at(SH, d), RPG_RANDOM_BONUS * power(d), 'lance'), mp: mp(d), primary: 'lance',
      ...(d === 5 ? { rider: { status: 'armor-break', stacks: 1, per: 'foe' } } : {}) }),
    sideA: (d) => ({ target: 'one', hits: pure(half(d), 1.15 * power(d), 'lance'), mp: mp(d) + 2, primary: 'lance' }),
    sideB: (d) => ({ target: 'random', hits: [...pure(at(SH, d), RPG_RANDOM_BONUS * power(d), 'lance'), ...pure(2, 0.3 * power(d), 'lance')],
      mp: mp(d) + 4, primary: 'lance' }),
  },
  bow: {
    names: ['Twin Arrows', 'Triple Shot', 'Quiver Volley', 'Arrow Storm', 'Starfall Barrage'],
    a: ['Power Shot', 'Piercing Arrow', 'Ballista Shot', 'Comet Arrow', 'Sunpiercer'],
    b: ['Spread Shot', 'Scatter Volley', 'Rain of Arrows', 'Arrow Hail', 'Starfall Rain'],
    core: (d) => ({ target: 'one', hits: pure(at(SH, d), power(d), 'bow'), mp: mp(d), primary: 'bow',
      ...(d === 5 ? { rider: { status: 'armor-break', stacks: 2, per: 'foe' } } : {}) }),
    sideA: (d) => ({ target: 'one', hits: pure(half(d), 1.15 * power(d), 'bow'), mp: mp(d) + 2, primary: 'bow' }),
    sideB: (d) => ({ target: 'one', hits: pure(at(SH, d), power(d), 'bow'), splash: pure(1, 0.2 * power(d), 'bow')[0], mp: mp(d) + 4, primary: 'bow' }),
  },
  katana: {
    names: ['Double Slash', 'Crossing Cut', 'Twin Moon', 'Iai Storm', 'Moonfall'],
    a: ['Quick Draw', 'Iaido', 'Flash Draw', 'Moonlit Draw', 'Final Draw'],
    b: ['Cross Cut', 'X-Slash', 'Twin Cross', 'Scattering Petals', 'Thousand Petals'],
    core: (d) => ({ target: 'one', hits: pure(2, power(d), 'katana'), mp: mp(d), primary: 'katana', ...(d === 5 ? { special: 'vs-broken' } : {}) }),
    sideA: (d) => ({ target: 'one', hits: pure(1, 1.15 * power(d), 'katana'), mp: mp(d) + 2, primary: 'katana', special: 'pierce' }),
    sideB: (d) => ({ target: 'one', hits: pure(2, 0.7 * power(d), 'katana'), other: pure(2, 0.42 * power(d), 'katana'), mp: mp(d) + 4, primary: 'katana' }),
  },
}
for (const weapon of RPG_WEAPON_KINDS) addTree({ classId: 'brawler', weapon, ...BRAWLER[weapon] })

// --- Mage: the five Tomes at full power --------------------------------------------------------------------------------

const series = (stem: string[], tail: string) => stem.map((s) => `${s} ${tail}`)
const MAGE: Readonly<Record<string, Omit<TreeSpec, 'classId' | 'weapon'>>> = {
  'tome-fire': {
    names: ['Fire', 'Fira', 'Firaga', 'Firaja', 'Flare Star'],
    a: series(['Fire', 'Fira', 'Firaga', 'Firaja', 'Flare'], 'Wave'), b: series(['Fire', 'Fira', 'Firaga', 'Firaja', 'Flare'], 'Chain'),
    core: (d) => ({ target: 'one', hits: pure(1, power(d), 'fire'), mp: mp(d), primary: 'fire',
      ...(d === 5 ? { rider: { status: 'burn', stacks: 2, per: 'foe' } } : {}) }),
    sideA: (d) => ({ target: 'all', hits: pure(1, RPG_AOE_SHARE * power(d), 'fire'), mp: mp(d) + 4, primary: 'fire' }),
    sideB: (d) => ({ target: 'random', hits: pure(at(LH, d), RPG_RANDOM_BONUS * power(d), 'fire'), mp: mp(d), primary: 'fire' }),
  },
  'tome-ice': {
    names: ['Blizzard', 'Blizzara', 'Blizzaga', 'Blizzaja', 'Absolute Zero'],
    a: series(['Blizzard', 'Blizzara', 'Blizzaga', 'Blizzaja', 'Zero'], 'Spike'), b: series(['Blizzard', 'Blizzara', 'Blizzaga', 'Blizzaja', 'Zero'], 'Shards'),
    core: (d) => d < 5 ? { target: 'all', hits: pure(1, RPG_AOE_SHARE * power(d), 'ice'), mp: mp(d) + 4, primary: 'ice' }
      : { target: 'all', hits: pure(2, RPG_AOE_SHARE * power(5), 'ice'), mp: mp(5) + 4, primary: 'ice', rider: { status: 'enfeeble', stacks: 1, per: 'foe' } },
    sideA: (d) => ({ target: 'one', hits: pure(1, power(d), 'ice'), mp: mp(d), primary: 'ice' }),
    sideB: (d) => ({ target: 'random', hits: pure(at(LH, d), RPG_RANDOM_BONUS * power(d), 'ice'), mp: mp(d), primary: 'ice' }),
  },
  'tome-lightning': {
    names: ['Thunder', 'Thundara', 'Thundaga', 'Thundaja', 'Judgment Storm'],
    a: ['Thunder Bolt', 'Thundara Bolt', 'Thundaga Bolt', 'Thundaja Bolt', 'Judgment Bolt'],
    b: ['Thunder Squall', 'Thundara Storm', 'Thundaga Storm', 'Thundaja Storm', 'Judgment Tempest'],
    core: (d) => ({ target: 'random', hits: pure(at(LH, d), RPG_RANDOM_BONUS * power(d), 'lightning'), mp: mp(d), primary: 'lightning',
      ...(d === 5 ? { rider: { status: 'shock', stacks: 1, per: 'hit' } } : {}) }),
    sideA: (d) => ({ target: 'one', hits: pure(1, power(d), 'lightning'), mp: mp(d), primary: 'lightning' }),
    sideB: (d) => ({ target: 'all', hits: pure(1, RPG_AOE_SHARE * power(d), 'lightning'), mp: mp(d) + 4, primary: 'lightning' }),
  },
  'tome-light': {
    names: ['Lux', 'Luxra', 'Luxaga', 'Luxaja', 'Holy'],
    a: ['Lux Lance', 'Luxra Lance', 'Luxaga Lance', 'Luxaja Lance', 'Holy Lance'],
    b: ['Lux Cascade', 'Luxra Cascade', 'Luxaga Cascade', 'Luxaja Cascade', 'Holy Cascade'],
    core: (d) => ({ target: 'one', hits: pure(at(SH, d), power(d), 'light'), mp: mp(d), primary: 'light', ...(d === 5 ? { special: 'vs-broken' } : {}) }),
    sideA: (d) => ({ target: 'one', hits: pure(half(d), 1.15 * power(d), 'light'), mp: mp(d) + 2, primary: 'light' }),
    sideB: (d) => ({ target: 'all', hits: pure(2, 0.5 * power(d), 'light'), mp: mp(d) + 6, primary: 'light' }),
  },
  'tome-dark': {
    names: ['Nox', 'Noxra', 'Noxaga', 'Noxaja', 'Black Hole'],
    a: ['Nox Pierce', 'Noxra Pierce', 'Noxaga Pierce', 'Noxaja Pierce', 'Void Pierce'],
    b: ['Nox Cascade', 'Noxra Cascade', 'Noxaga Cascade', 'Noxaja Cascade', 'Void Cascade'],
    core: (d) => ({ target: 'one', hits: pure(2, power(d), 'dark'), mp: mp(d), primary: 'dark', ...(d === 5 ? { special: 'vs-wounded' } : {}) }),
    sideA: (d) => ({ target: 'one', hits: pure(1, 1.15 * power(d), 'dark'), mp: mp(d) + 2, primary: 'dark', special: 'pierce' }),
    sideB: (d) => ({ target: 'all', hits: pure(2, 0.5 * power(d), 'dark'), mp: mp(d) + 6, primary: 'dark' }),
  },
}
for (const weapon of RPG_TOMES) addTree({ classId: 'mage', weapon, ...MAGE[weapon]! })

// --- Summoner: one summon per weapon, growing every depth, lingering after (D86) ---------------------------------------

const LINGER = 0.3
const SUMMONS: Readonly<Record<RpgWeapon, readonly string[]>> = {
  'tome-fire': ['Ember Sprites', 'Salamander', 'Fire Drake', 'Infernal Wyrm', 'Phoenix'],
  'tome-ice': ['Frost Sprites', 'Snow Wolves', 'Ice Golem', 'Frost Titan', 'Winter Queen'],
  'tome-lightning': ['Spark Sprites', 'Thunderbird', 'Storm Roc', 'Thunder Kirin', 'Raijin'],
  'tome-light': ['Cherub', 'Angel Lancer', 'Seraph Phalanx', 'Dominion Host', "Heaven's Legion"],
  'tome-dark': ['Imp Brute', 'Hellknight', 'Dread Knight', 'Demon Lord', 'Abyssal Overlord'],
  greatsword: ['Squire', 'Sword Knight', 'Paladin', 'Blade Champion', 'Sword Saint'],
  axe: ['Brigand', 'Berserker', 'Axe Ogre', 'Minotaur Chief', 'Jotun Warlord'],
  lance: ['Pikeman', 'Dragoon', 'Lance Knight', 'Valkyrie', 'Valkyrie Queen'],
  bow: ['Slinger', 'Archer', 'Ranger', 'Sylph Archer', 'Sagittarius'],
  katana: ['Ronin', 'Samurai', 'Kensei', 'Blade Shogun', 'Sword Spirit'],
}
/** A summon by its kind's shape, `extra` hits more and `scale` times the power, with its depth-5 capstone. */
function summon(weapon: RpgWeapon, d: number, extra = 0, scale = 1): RpgSkillDef {
  const kind = rpgWeaponKind(weapon)
  const p = scale * power(d)
  const capstone = d === 5
  const base: Omit<RpgSkillDef, 'target' | 'hits'> = { mp: mp(d), primary: kind, summon: { linger: LINGER } }
  switch (kind) {
    case 'fire': case 'greatsword':
      return { ...base, target: 'one', hits: pure(at(GH, d) + extra, p, kind),
        ...(capstone ? { rider: { status: kind === 'fire' ? 'burn' : 'armor-break', stacks: 2, per: 'foe' } } : {}) }
    case 'ice': case 'axe':
      return { ...base, target: 'all', hits: pure((kind === 'ice' ? [1, 2, 2, 3, 3] : GH)[d - 1]! + extra, RPG_AOE_SHARE * p, kind), mp: mp(d) + 4,
        ...(capstone ? { rider: { status: kind === 'ice' ? 'enfeeble' : 'armor-break', stacks: 1, per: 'foe' } } : {}) }
    case 'lightning': case 'lance':
      return { ...base, target: 'random', hits: pure(at(LH, d) + extra, RPG_RANDOM_BONUS * p, kind),
        ...(capstone ? { rider: { status: kind === 'lightning' ? 'shock' : 'armor-break', stacks: 1, per: 'hit' } } : {}) }
    case 'light': case 'bow':
      return { ...base, target: 'one', hits: pure(at(LH, d) + extra, p, kind),
        ...(capstone ? (kind === 'light' ? { allies: { status: 'barrier', stacks: 1 } } : { rider: { status: 'armor-break', stacks: 2, per: 'foe' } }) : {}) }
    default:
      return { ...base, target: 'one', hits: pure(2 + extra, p, kind),
        ...(capstone ? (kind === 'dark' ? { rider: { status: 'enfeeble', stacks: 2, per: 'foe' } } : { special: 'vs-broken' }) : {}) }
  }
}
for (const weapon of RPG_WEAPONS) {
  const names = SUMMONS[weapon]
  addTree({ classId: 'summoner', weapon, names, a: names.map((n) => `${n} Pack`), b: names.map((n) => `Bonded ${n}`),
    core: (d) => summon(weapon, d),
    sideA: (d) => summon(weapon, d, 1, 0.95),
    sideB: (d) => plus(summon(weapon, d), { summon: { linger: 0.4 }, mp: summon(weapon, d).mp + 2 }) })
}

// --- Spell Blade: single-target halves, an Arm and a Tome every act (D86) ----------------------------------------------

const BLADE_HITS: Readonly<Record<RpgDamageKind, readonly number[]>> = {
  greatsword: [1, 1, 1, 2, 2], fire: [1, 1, 1, 2, 2], axe: [1, 1, 2, 2, 2], ice: [1, 1, 2, 2, 2],
  lance: [2, 2, 2, 3, 3], lightning: [2, 2, 2, 3, 3], bow: [2, 2, 3, 3, 4], light: [2, 2, 3, 3, 4], katana: [2, 2, 2, 2, 2], dark: [2, 2, 2, 2, 2],
}
const BLADE_NOUN: Readonly<Record<RpgDamageKind, string>> = {
  greatsword: 'Cleave', axe: 'Hew', lance: 'Thrust', bow: 'Shot', katana: 'Draw', fire: 'Brand', ice: 'Rime', lightning: 'Bolt', light: 'Ray', dark: 'Shade',
}
const TIERS = ['Rune', 'Arcane', 'Mystic', 'Astral', 'Celestial']
function bladeCapstone(kind: RpgDamageKind): Partial<RpgSkillDef> {
  if (kind === 'katana' || kind === 'light') return { special: 'vs-broken' }
  if (kind === 'dark') return { special: 'vs-wounded' }
  const status: RpgStatusKind = kind === 'fire' ? 'burn' : kind === 'ice' ? 'enfeeble' : kind === 'lightning' ? 'shock' : 'armor-break'
  return { rider: { status, stacks: 1, per: 'foe' } }
}
for (const weapon of RPG_WEAPONS) {
  const kind = rpgWeaponKind(weapon)
  const names = TIERS.map((t) => `${t} ${BLADE_NOUN[kind]}`)
  const one = (d: number, n: number, scale: number, extraMp = 0): RpgSkillDef =>
    ({ target: 'one', hits: pure(n, scale * power(d), kind), mp: mp(d) + extraMp, primary: kind })
  addTree({ classId: 'spellblade', weapon, names, a: names.map((n) => `Focused ${n}`), b: names.map((n) => `${n} Flurry`),
    core: (d) => ({ ...one(d, at(BLADE_HITS[kind], d), 1), ...(d === 5 ? bladeCapstone(kind) : {}) }),
    sideA: (d) => one(d, Math.max(1, at(BLADE_HITS[kind], d) - 1), 1.1, 2),
    sideB: (d) => one(d, at(BLADE_HITS[kind], d) + 1, 0.95, 2) })
}

// --- Cleric: a blow that weakens, a spell that blesses (D86) -----------------------------------------------------------

/** Each Arm's debuff and its mirror Tome's buff. */
export const RPG_CLERIC_STATUS: Readonly<Record<RpgWeapon, RpgStatusKey>> = {
  greatsword: 'armor-break', 'tome-fire': 'brave', lance: 'mind-break', 'tome-light': 'faith', axe: 'enfeeble', 'tome-ice': 'aegis',
  bow: 'shatter', 'tome-lightning': 'breaker', katana: 'hex', 'tome-dark': 'clarity',
}
const CLERIC_NAMES: Readonly<Record<RpgWeapon, readonly string[]>> = {
  greatsword: ['Breach', 'Sunder Armor', 'Rupture', 'Ravage', 'Ruin'],
  lance: ['Pierce Mind', 'Puncture', 'Impale', 'Transfix', 'Mindspike'],
  axe: ['Hack', 'Hamstring', 'Maim', 'Cripple', 'Unmake'],
  bow: ['Chip', 'Crack', 'Fracture', 'Splinter', 'Shatterstorm'],
  katana: ['Mark', 'Curse', 'Hex', 'Doom', 'Anathema'],
  'tome-fire': ['Valor', 'Courage', 'Bravery', 'Heroism', 'Exaltation'],
  'tome-light': ['Grace', 'Faith', 'Devotion', 'Piety', 'Benediction'],
  'tome-ice': ['Ward', 'Guard', 'Bulwark', 'Fortress', 'Sanctum'],
  'tome-lightning': ['Spark', 'Charge', 'Surge', 'Overcharge', 'Breakstorm'],
  'tome-dark': ['Calm', 'Focus', 'Clarity', 'Insight', 'Enlightenment'],
}
const CLERIC_STACKS = [1, 1, 2, 2, 3]
function cleric(weapon: RpgWeapon, d: number, turns = 2, more = 0, extraMp = 0): RpgSkillDef {
  const kind = rpgWeaponKind(weapon)
  const to = isRpgTome(weapon) ? 'allies' : d === 5 ? 'foes' : 'foe'
  return { target: 'one', hits: pure(1, power(d), kind), mp: mp(d) + extraMp, primary: kind,
    status: { key: RPG_CLERIC_STATUS[weapon], stacks: at(CLERIC_STACKS, d) + more, turns, to } }
}
for (const weapon of RPG_WEAPONS) {
  const names = CLERIC_NAMES[weapon]
  addTree({ classId: 'cleric', weapon, names, a: names.map((n) => `Lasting ${n}`), b: names.map((n) => `Heavy ${n}`),
    core: (d) => cleric(weapon, d), sideA: (d) => cleric(weapon, d, 3, 0, 2), sideB: (d) => cleric(weapon, d, 2, 1, 4) })
}

export const RPG_NODES: readonly RpgNode[] = NODES
const BY_ID = new Map(NODES.map((n) => [n.id, n]))
export const rpgNode = (id: string): RpgNode | undefined => BY_ID.get(id)
export const rpgTreeNodes = (tree: RpgTreeId): RpgNode[] => NODES.filter((n) => n.tree === tree)
