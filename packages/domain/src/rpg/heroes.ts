// Halls of Heroes (D106, D107): each hall seats four Heroes, and each seat teaches one unique Limit Break. A Hero always
// uses her seat's Limit Break at full strength; a Learner under her inherits it at half, plus 5% a Bond Level, and keeps
// its shape: its weapons and elements (worn or not), its hits and its statuses. Classes v2 (engine v15, §5) adds the
// Paladin Bastion: 24 Limit Breaks, read by generation like every class rule (D179). Engine v16 (the Tier rework's fight,
// H65) changes two seats' kinds (CP35). Halls v2 (engine v19, D241; H129, built dark) rebuilds them as five halls by
// family and twenty Limit Breaks, each with a power of its own. A Limit Break never takes a Skill Rank (CP28): its power
// is her open depth's.
import { BATTLE_ENGINE_VERSION, RPG_REWORK_ENGINE, rpgRework, rpgV2 } from './battle/caps'
import { RPG_AOE_SHARE, RPG_RANDOM_BONUS, RPG_VOLLEY, type RpgHit, type RpgSkillDef, type RpgSupport } from './catalog'
import type { RpgClass, RpgDamageKind } from './kinds'
import { heroLimitHall, heroLimitIds, heroSeatHome, type HeroHall, type HeroLimitId } from './hero-id'
export * from './hero-id'

/**
 * Her Limit Break's power in single-target casts at her depth, by the class she fights as: what her class's own Limit
 * Break deals (D311, D86), engines v10–v18. A Hero's Limit Break at 100% matches it; at Bond 0 it is half, about one
 * turn's damage. From v15 (§5) the hybrids' rise to 2.2×. From v19 each Limit Break carries its own (`HeroLimit.power`,
 * Halls v2 §3) × her class's scale (`heroLimitScale`).
 */
/** Classes v3's seven (H126): interim values, never read (no fight before v19 has her, and from v19 the Limit Break's own
 * power is read instead, H129). */
const POWER_V19_NEW = { recruit: 2, duelist: 2, acolyte: 2, caller: 2, apprentice: 2, armsummoner: 2.2, tomeblade: 2.2 } as const
const POWER_V1: Readonly<Record<RpgClass, number>> = { brawler: 2, mage: 2.4, spellblade: 2, cleric: 1.5, summoner: 1.8, paladin: 1.5, ...POWER_V19_NEW }
const POWER_V2: Readonly<Record<RpgClass, number>> = { ...POWER_V1, spellblade: 2.2, summoner: 2.2 }
/** The live generation's powers (the manual's tables); the engine reads `heroLimitPower(classId, version)`. */
export const HERO_LIMIT_POWER: Readonly<Record<RpgClass, number>> = rpgV2() ? POWER_V2 : POWER_V1
/** v15: the share of a hall Limit Break's mend or Barrier, 1.5× the doubled depth-5 share as its power is 1.5× (§5); ×0.4
 * on every Uma, × the caster's ATK or M.ATK scaling and the cast's strength. */
export const HERO_LIMIT_SUPPORT_SHARE = 0.66
/** Halls v2's class scale (HV5): her Limit Break's power × this, 1 for every class but the two healers (a Tier 0 is no
 * healer, CV22), who act at half power and carry the party's support: a healer on a Healer seat lands today's 1.5×. The
 * v19 table, for the screens and the manual; the engine reads `heroLimitScale(classId, version)`.
 * H131 (D249) measured each class's Limit Break damage a fight against v18's on the balance party's world stages (Halls v2's
 * HV-D, H1; 32 seeds) against §3.5's change at her casts (HV5's formula at the foes standing when she cast) and moved each
 * scale to its band's edge toward it (the drafts 1 and 0.75; the bands 0.95–1.05 and 0.70–0.80). Measured ÷ the formula at
 * the drafts, then at these: the Brawler 108% → 105% (met), the Sorcerer 115% → 111%, the Arms Spellblade 149% → 142%, the Tome
 * Spellblade 138% → 133%, the Arms Summoner 151% → 145%, the Tome Summoner 158% → 150%, the Paladin 75% → 79%, the Cleric
 * 83% → 88%. What no scale closes is offense: a Learner's first home seat now strikes in her own weapons' kinds (every hit, from
 * 0% for the hybrids and two thirds for the Brawler and the Sorcerer), so her weapons' Might and her accessory's flat offense
 * ride it, where the healers' seats moved off theirs (the Paladin 100% → 46%, the Cleric 52% → 0%). The Tier 0s keep 1 (no
 * v18 to measure against). */
export const HERO_LIMIT_SCALE: Readonly<Record<RpgClass, number>> = {
  brawler: 0.95, mage: 0.95, spellblade: 0.95, cleric: 0.8, summoner: 0.95, paladin: 0.8,
  recruit: 1, duelist: 1, acolyte: 1, caller: 1, apprentice: 1, armsummoner: 0.95, tomeblade: 0.95,
}
/** Her class's scale in an engine's generation: Halls v2's from v19, 1 before (her class's power is the whole of it). */
export const heroLimitScale = (classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): number =>
  (rpgRework('classes', engine) ? HERO_LIMIT_SCALE[classId] : 1)
/** Halls v2's ceiling (HV15): at most this many hits on one foe in one cast of a Limit Break (the Duel's guard rail). */
export const HERO_LIMIT_MAX_HITS = 10

/** One hit: its kinds (two fuse into one hit, half each, to v18) and its share of the Limit Break's power. `double` (v19's
 * Katana and Light strikes, Halls v2): two hits at half its share each, the second on the same foe. */
export interface HeroHit { kinds: readonly RpgDamageKind[]; share: number; double?: true }
/**
 * One cast of a hero Limit Break. `one`: every hit on the tapped foe; `all`: every foe takes each hit (at the area share);
 * `random`: each hit on a random foe. `splash` then hits every other foe once. A cast with no hits only casts its status.
 * `support` (v15's halls): a mend, Barrier, cleanse or revive after its hits, at the cast's strength. `volley` (v19, Halls
 * v2's Bow and Dark seats): a `one` cast whose hits strike the tapped foe at `RPG_VOLLEY.target` of their share and whose
 * splash strikes every other foe at `RPG_VOLLEY.splash` of its share, instead of the area share.
 */
export interface HeroCast {
  target: 'one' | 'all' | 'random'
  hits: readonly HeroHit[]
  splash?: HeroHit
  status?: RpgSkillDef['status']
  support?: RpgSupport
  volley?: true
}
/** A seat's Limit Break. `classId` is its home class (the hall's class to v18; Halls v2's table from v19, `heroSeatHome`).
 * `power` (v19's twenty only): its own, × her class's scale and her open depth's power (HV5). `lore`: the design's line for
 * the seat card (H133). */
export interface HeroLimit {
  id: HeroLimitId; hall: HeroHall; classId: RpgClass; name: string; blurb: string; lore?: string; power?: number; casts: readonly HeroCast[]
}
/** Limit Breaks as authored to v18, each in its id's hall (the field comes last, so older tables keep their shape). */
const inHalls = (list: readonly Omit<HeroLimit, 'hall'>[]): HeroLimit[] => list.map((l) => ({ ...l, hall: heroLimitHall(l.id) }))

const one = (kind: RpgDamageKind, share: number): HeroHit => ({ kinds: [kind], share })
const fused = (a: RpgDamageKind, b: RpgDamageKind, share: number): HeroHit => ({ kinds: [a, b], share })
/** `n` hits cycling through `kinds`, sharing the whole. */
const cycle = (n: number, ...kinds: RpgDamageKind[]): HeroHit[] => Array.from({ length: n }, (_, i) => one(kinds[i % kinds.length]!, 1 / n))

const LIMITS: readonly HeroLimit[] = inHalls([
  // Brawler: the owner's four.
  { id: 'brawler-1', classId: 'brawler', name: 'Arsenal Rush', blurb: 'A blow with every Arm in turn on one foe',
    casts: [{ target: 'one', hits: cycle(5, 'greatsword', 'axe', 'lance', 'bow', 'katana') }] },
  { id: 'brawler-2', classId: 'brawler', name: 'Iaido Cleave', blurb: 'One Greatsword cleave, then two Katana draws, on one foe',
    casts: [{ target: 'one', hits: [one('greatsword', 0.5), one('katana', 0.25), one('katana', 0.25)] }] },
  { id: 'brawler-3', classId: 'brawler', name: 'Spear and Arrow Storm', blurb: 'Eight blows at random foes, Lance and Bow in turn',
    casts: [{ target: 'random', hits: cycle(8, 'lance', 'bow') }] },
  { id: 'brawler-4', classId: 'brawler', name: 'Earthsplitter', blurb: 'Three Axe quakes on every foe',
    casts: [{ target: 'all', hits: cycle(3, 'axe') }] },
  // Mage: the owner's four.
  { id: 'mage-1', classId: 'mage', name: 'Elemental Cascade', blurb: 'A spell of every element in turn on one foe',
    casts: [{ target: 'one', hits: cycle(5, 'fire', 'ice', 'lightning', 'light', 'dark') }] },
  { id: 'mage-2', classId: 'mage', name: 'Twilight Eclipse', blurb: 'One hit of Light and Dark at once on one foe',
    casts: [{ target: 'one', hits: [fused('light', 'dark', 1)] }] },
  { id: 'mage-3', classId: 'mage', name: 'Trinity Storm', blurb: 'Three great spells, Fire, Ice and Lightning, on one foe',
    casts: [{ target: 'one', hits: cycle(3, 'fire', 'ice', 'lightning') }] },
  { id: 'mage-4', classId: 'mage', name: 'Chaos Rain', blurb: 'Twelve bolts at random foes, Light and Dark in turn',
    casts: [{ target: 'random', hits: cycle(12, 'light', 'dark') }] },
  // Spell Blade: every hit an Arm and an element at once.
  { id: 'spellblade-1', classId: 'spellblade', name: 'Sunfire Edge', blurb: 'A Greatsword-and-Fire cleave on one foe; its flames splash every other foe',
    casts: [{ target: 'one', hits: [fused('greatsword', 'fire', 0.7)], splash: one('fire', 0.3) }] },
  { id: 'spellblade-2', classId: 'spellblade', name: 'Rimefang Waltz', blurb: 'Six Katana-and-Ice cuts on one foe',
    casts: [{ target: 'one', hits: Array.from({ length: 6 }, () => fused('katana', 'ice', 1 / 6)) }] },
  { id: 'spellblade-3', classId: 'spellblade', name: 'Thunder Javelin', blurb: 'Four Lance-and-Lightning throws at random foes',
    casts: [{ target: 'random', hits: Array.from({ length: 4 }, () => fused('lance', 'lightning', 0.25)) }] },
  { id: 'spellblade-4', classId: 'spellblade', name: 'Eclipse Volley', blurb: 'Bow volleys on every foe, one of Light, one of Dark',
    casts: [{ target: 'all', hits: [fused('bow', 'light', 0.5), fused('bow', 'dark', 0.5)] }] },
  // Cleric: angels, demons, an archangel and an archdemon, each with its blessing or curse.
  { id: 'cleric-1', classId: 'cleric', name: 'Choir of Angels', blurb: 'Light on every foe twice, then Aegis 2 on every ally',
    casts: [{ target: 'all', hits: cycle(2, 'light'), status: { key: 'aegis', stacks: 2, turns: 2, to: 'allies' } }] },
  { id: 'cleric-2', classId: 'cleric', name: 'Legion of Demons', blurb: 'Hex on every foe, then eight Dark claws at random foes',
    casts: [{ target: 'one', hits: [], status: { key: 'hex', stacks: 1, turns: 2, to: 'foes' } }, { target: 'random', hits: cycle(8, 'dark') }] },
  { id: 'cleric-3', classId: 'cleric', name: 'Archangel’s Verdict', blurb: 'A Greatsword-and-Light judgment on one foe, then Brave and Faith 2 on every ally',
    casts: [{ target: 'one', hits: [fused('greatsword', 'light', 1)], status: { key: 'brave', stacks: 2, turns: 2, to: 'allies' } },
      { target: 'one', hits: [], status: { key: 'faith', stacks: 2, turns: 2, to: 'allies' } }] },
  { id: 'cleric-4', classId: 'cleric', name: 'Archdemon’s Pact', blurb: 'Armor Break and Mind Break 3 on one foe, then three Katana-and-Dark rends',
    casts: [{ target: 'one', hits: [], status: { key: 'armor-break', stacks: 3, turns: 2, to: 'foe' } },
      { target: 'one', hits: [], status: { key: 'mind-break', stacks: 3, turns: 2, to: 'foe' } },
      { target: 'one', hits: Array.from({ length: 3 }, () => fused('katana', 'dark', 1 / 3)) }] },
  // Summoner: four beasts, each an Arm and its element (D86's pairs), struck in turn.
  { id: 'summoner-1', classId: 'summoner', name: 'Cinder Wyrm', blurb: 'A Greatsword-and-Fire bite on one foe, then Fire breath on every foe',
    casts: [{ target: 'one', hits: [fused('greatsword', 'fire', 0.5)] }, { target: 'all', hits: [one('fire', 0.5)] }] },
  { id: 'summoner-2', classId: 'summoner', name: 'Frost Behemoth', blurb: 'Two Axe-and-Ice stomps on every foe',
    casts: [{ target: 'all', hits: [fused('axe', 'ice', 0.5), fused('axe', 'ice', 0.5)] }] },
  { id: 'summoner-3', classId: 'summoner', name: 'Thunderbird', blurb: 'Six dives at random foes, Lance and Lightning in turn',
    casts: [{ target: 'random', hits: cycle(6, 'lance', 'lightning') }] },
  { id: 'summoner-4', classId: 'summoner', name: 'Moon Fox', blurb: 'Eight strikes on one foe: Katana, Dark, Bow and Light in turn',
    casts: [{ target: 'one', hits: cycle(8, 'katana', 'dark', 'bow', 'light') }] },
])

/** v15 (classes v2 §5): the six halls' 24. The Chapel's seats 3–4 move to the Paladin Bastion's 1–2, and both halls gain
 * two: Tome-led in the Chapel, Arms-led in the Bastion, each mending, shielding or reviving. Sunfire Edge cleaves three
 * times and Moon Fox strikes random foes. */
const BY_V1 = new Map(LIMITS.map((l) => [l.id, l]))
const heal = (support: Omit<RpgSupport, 'share'>): RpgSupport => ({ share: HERO_LIMIT_SUPPORT_SHARE, ...support })
const moved = (from: HeroLimitId, id: HeroLimitId): HeroLimit => ({ ...BY_V1.get(from)!, id, classId: 'paladin', hall: 'paladin' })
const NEW: readonly HeroLimit[] = [
  ...inHalls([
    { id: 'spellblade-1', classId: 'spellblade', name: 'Sunfire Edge', blurb: 'Three Greatsword-and-Fire cleaves on one foe; its flames splash every other foe',
      casts: [{ target: 'one', hits: Array.from({ length: 3 }, () => fused('greatsword', 'fire', 0.7 / 3)), splash: one('fire', 0.3) }] },
    { id: 'cleric-3', classId: 'cleric', name: 'Dawn Hymn', blurb: 'Fire on every foe, then a mend on every ally',
      casts: [{ target: 'all', hits: [one('fire', 1)], support: heal({ mend: 'all' }) }] },
    { id: 'cleric-4', classId: 'cleric', name: 'Frost Sanctuary', blurb: 'Ice on every foe, then a cleanse and a Barrier on every ally',
      casts: [{ target: 'all', hits: [one('ice', 1)], support: heal({ shield: 'all', cleanse: true }) }] },
    { id: 'summoner-4', classId: 'summoner', name: 'Moon Fox', blurb: 'Eight strikes at random foes: Katana, Dark, Bow and Light in turn',
      casts: [{ target: 'random', hits: cycle(8, 'katana', 'dark', 'bow', 'light') }] },
  ]),
  moved('cleric-3', 'paladin-1'),
  moved('cleric-4', 'paladin-2'),
  ...inHalls([
    { id: 'paladin-3', classId: 'paladin', name: 'Rampart Charge', blurb: 'One Greatsword charge on one foe, then a Barrier on every ally',
      casts: [{ target: 'one', hits: [one('greatsword', 1)], support: heal({ shield: 'all' }) }] },
    { id: 'paladin-4', classId: 'paladin', name: 'Valkyrie Lances', blurb: 'Four Lance hits at random foes, then the first fallen ally rises',
      casts: [{ target: 'random', hits: cycle(4, 'lance'), support: { share: 0, revive: true } }] },
  ]),
]
/** A replaced seat keeps its place in the Map, and the Bastion's four come last: seat order, as `ALL_HERO_LIMIT_IDS`. */
const BY_V2 = new Map([...LIMITS, ...NEW].map((l) => [l.id, l]))
/** v16, the Tier rework's fight (CP35, class-progression §8.3): two seats change kind so every hall spreads over the twin
 * sets. Rampart Charge charges with an Axe (the Bastion answered Fire twice and Ice never), and Choir of Angels' second
 * hit is Lightning (the Chapel had none). Shapes, power and support stay. */
const BY_V16 = new Map(BY_V2)
BY_V16.set('paladin-3', { ...BY_V2.get('paladin-3')!, blurb: 'One Axe charge on one foe, then a Barrier on every ally',
  casts: [{ target: 'one', hits: [one('axe', 1)], support: heal({ shield: 'all' }) }] })
BY_V16.set('cleric-1', { ...BY_V2.get('cleric-1')!, blurb: 'Light on every foe, then Lightning on every foe, then Aegis 2 on every ally',
  casts: [{ target: 'all', hits: [one('light', 0.5), one('lightning', 0.5)], status: { key: 'aegis', stacks: 2, turns: 2, to: 'allies' } }] })
// --- Halls v2 (engine v19, D241; halls-v2.md §0, §2–§4; H129) ------------------------------------------------------------
// Five halls, four seats each, twenty Limit Breaks, each with its own power (HV5, HV6): the Ultimates 2.9, the tri attacks
// 2.5, the doubles, volleys and the Circle's sweeps 2.2, the pacts 1.9 at random (2.0 with the bonus), the healers' 2.0
// and one stack. A double (a Katana or Light strike) lands twice at half its share, the second on the same foe; a volley
// (the Bow's and Dark's) strikes the tapped foe at 0.8 and every other foe at 0.35 (`RPG_VOLLEY`). No seat mends,
// shields, cleanses or revives (HV14), and no cast lands more than `HERO_LIMIT_MAX_HITS` on one foe (HV15). Shares are of
// the Limit Break's power; the literals read the design's §4 tables, not the catalog.

/** A double strike: two hits at half `share` each, the second on the same foe. */
const twice = (kind: RpgDamageKind, share: number): HeroHit => ({ kinds: [kind], share, double: true })
/** One of the Dojo's and the Tower's volleys, half the power each (their seat 4): two hits on her foe, a splash on the rest. */
const volley = (kind: RpgDamageKind): HeroCast => ({ target: 'one', volley: true, hits: [one(kind, 0.25), one(kind, 0.25)], splash: one(kind, 0.5) })
/** One of the Healer Sanctum's stacks, two rounds: a blessing on every ally after the hits, a curse on the foe before. */
const stack = (key: 'brave' | 'faith' | 'armor-break' | 'mind-break'): NonNullable<HeroCast['status']> =>
  ({ key, stacks: 1, turns: 2, to: key === 'brave' || key === 'faith' ? 'allies' : 'foe' })
/** A v19 seat: its hall the id's, its home class Halls v2's (`heroSeatHome`). */
const seat = (id: HeroLimitId, name: string, power: number, blurb: string, lore: string, casts: readonly HeroCast[]): HeroLimit =>
  ({ id, hall: heroLimitHall(id), classId: heroSeatHome(id, RPG_REWORK_ENGINE.classes), name, blurb, lore, power, casts })
const T = 1 / 3
const HALLS_V2: readonly HeroLimit[] = [
  // The Warrior Dojo (HV8): self-training, the five Arms.
  seat('brawler-1', 'Triad Onslaught', 2.5, 'A Greatsword, an Axe and a Lance blow on one foe',
    'The first form every Recruit drills: the three heavy Arms in one unbroken motion.',
    [{ target: 'one', hits: [one('greatsword', T), one('axe', T), one('lance', T)] }]),
  seat('brawler-2', 'Ten Thousand Swings', 2.9, 'One Greatsword blow on one foe', 'Every practice swing she ever made, in one blow.',
    [{ target: 'one', hits: [one('greatsword', 1)] }]),
  seat('brawler-3', 'Echo Draw', 2.2, 'Three draws on one foe, each Katana cut twice', 'Drawn so fast that each cut lands twice.',
    [{ target: 'one', hits: [twice('katana', T), twice('katana', T), twice('katana', T)] }]),
  seat('brawler-4', 'Hundred-Arrow Rain', 2.2, 'Two Bow volleys: two arrows each on one foe, one on every other foe',
    'Two volleys: two arrows into her mark, one into every other foe.', [volley('bow'), volley('bow')]),
  // The Mage Tower (HV9): self-study, the Dojo's twin seat by seat.
  seat('mage-1', 'Triad Tempest', 2.5, 'A Fire, an Ice and a Lightning spell on one foe',
    'The first lesson every Apprentice copies out: the ring’s three elements in one breath.',
    [{ target: 'one', hits: [one('fire', T), one('ice', T), one('lightning', T)] }]),
  seat('mage-2', 'Ten Thousand Candles', 2.9, 'One Fire blast on one foe', 'Every candle burned down over a book, in one fire.',
    [{ target: 'one', hits: [one('fire', 1)] }]),
  seat('mage-3', 'Echo Ray', 2.2, 'Three rays on one foe, each Light ray striking twice', 'A ray read twice, so it strikes twice.',
    [{ target: 'one', hits: [twice('light', T), twice('light', T), twice('light', T)] }]),
  seat('mage-4', 'Hundred-Shadow Rain', 2.2, 'Two Dark volleys: two bolts each on one foe, one on every other foe',
    'Two downpours of shadow: the heaviest on her mark, the rest over the field.', [volley('dark'), volley('dark')]),
  // The Spell Blade Salle (HV10): familiar pacts, five strikes at random foes, the lead kind three (60%).
  seat('spellblade-1', 'Shrike Pact', 1.9, 'Five strikes at random foes, Katana and Lance in turn, each Katana cut twice',
    'The shrike pins its prey: her Lance throws fix them, her Katana cuts twice.',
    [{ target: 'random', hits: [twice('katana', 0.2), one('lance', 0.2), twice('katana', 0.2), one('lance', 0.2), twice('katana', 0.2)] }]),
  seat('spellblade-2', 'Firefly Pact', 1.9, 'Five strikes at random foes, Katana and Light in turn, each striking twice',
    'A swarm of fireflies lights each target; her Katana and their light find it, twice each.',
    [{ target: 'random', hits: [twice('katana', 0.2), twice('light', 0.2), twice('katana', 0.2), twice('light', 0.2), twice('katana', 0.2)] }]),
  seat('spellblade-3', 'Storm Heron Pact', 1.9, 'Five strikes at random foes, Light and Lightning in turn, each Light ray twice',
    'The heron spears with lightning, and its plumes flash twice.',
    [{ target: 'random', hits: [twice('light', 0.2), one('lightning', 0.2), twice('light', 0.2), one('lightning', 0.2), twice('light', 0.2)] }]),
  seat('spellblade-4', 'Wisp Pact', 1.9, 'Five strikes at random foes, Light and Katana in turn, each striking twice',
    'Wisps lead her blade through the dark: their light strikes twice, and so does the Katana that follows.',
    [{ target: 'random', hits: [twice('light', 0.2), twice('katana', 0.2), twice('light', 0.2), twice('katana', 0.2), twice('light', 0.2)] }]),
  // The Summoner Circle (HV11): three hits on every foe, the lead kind twice.
  seat('summoner-1', 'Centaur Warband', 2.2, 'Axe, Bow, then Axe on every foe', 'A warband of centaurs rides through every foe: axes, bows, axes.',
    [{ target: 'all', hits: [one('axe', T), one('bow', T), one('axe', T)] }]),
  seat('summoner-2', 'Gargoyle Flock', 2.2, 'Axe, Dark, then Axe on every foe',
    'Stone wings dive on every foe, raking with axe-blades under a cloud of shadow.',
    [{ target: 'all', hits: [one('axe', T), one('dark', T), one('axe', T)] }]),
  seat('summoner-3', 'Frostshade Wyrm', 2.2, 'Dark, Ice, then Dark on every foe', 'One wyrm of night and rime breathes over the whole field.',
    [{ target: 'all', hits: [one('dark', T), one('ice', T), one('dark', T)] }]),
  seat('summoner-4', 'Night Colossus', 2.2, 'Dark, Axe, then Dark on every foe',
    'A colossus of shadow strides through, swinging an axe the size of a gate.',
    [{ target: 'all', hits: [one('dark', T), one('axe', T), one('dark', T)] }]),
  // The Healer Sanctum (HV12–HV14): a deity called down once, one foe, four hits, the lead kind 60%, one stack.
  seat('healer-1', 'Archangel’s Judgment', 2, 'Two Lance thrusts and a Light double on one foe, then Brave 1 on every ally',
    'The Archangel comes down lance first, and her judgment strikes twice.',
    [{ target: 'one', hits: [one('lance', 0.3), one('lance', 0.3), twice('light', 0.4)], status: stack('brave') }]),
  seat('healer-2', 'Archdemon’s Toll', 2, 'Armor Break 1 on one foe, then two Axe and two Dark hits on her',
    'The Archdemon names a price: the foe’s armor first, then the axes.',
    [{ target: 'one', hits: [], status: stack('armor-break') },
      { target: 'one', hits: [one('axe', 0.3), one('axe', 0.3), one('dark', 0.2), one('dark', 0.2)] }]),
  seat('healer-3', 'Seraph’s Pyre', 2, 'Two Fire blasts and two Greatsword strokes on one foe, then Faith 1 on every ally',
    'The burning Seraph sweeps her sword of fire.',
    [{ target: 'one', hits: [one('fire', 0.3), one('fire', 0.3), one('greatsword', 0.2), one('greatsword', 0.2)], status: stack('faith') }]),
  seat('healer-4', 'Thunder Fiend’s Barrage', 2, 'Mind Break 1 on one foe, then two Lightning and two Bow hits on her',
    'The Thunder Fiend cracks the foe’s mind, then looses bolts and arrows.',
    [{ target: 'one', hits: [], status: stack('mind-break') },
      { target: 'one', hits: [one('lightning', 0.3), one('lightning', 0.3), one('bow', 0.2), one('bow', 0.2)] }]),
]
/** v19's twenty, in seat order (`heroLimitIds(19)`). */
const BY_V19 = new Map(HALLS_V2.map((l) => [l.id, l]))

const byVersion = (version: number) =>
  (rpgRework('classes', version) ? BY_V19 : rpgRework('fight', version) ? BY_V16 : rpgV2(version) ? BY_V2 : BY_V1)
const LIVE = byVersion(BATTLE_ENGINE_VERSION)
/** The live generation's Limit Breaks, in seat order: the six halls' 24 (20 to v14), with v16's two kinds since H72
 * (D210); Halls v2's twenty from H134. Screens and the manual read these; the engine reads `heroLimitFor(id, version)`. */
export const HERO_LIMITS: readonly HeroLimit[] = [...LIVE.values()]
export const heroLimit = (id: HeroLimitId): HeroLimit => LIVE.get(id)!
/** A seat's Limit Break in an engine's generation (D179): the engine always asks with the fight's version. Undefined only
 * for a seat its generation lacks (a Paladin seat before v15 or from v19, a Healer seat before v19: the engine refuses
 * them). */
export const heroLimitFor = (id: HeroLimitId, version: number): HeroLimit | undefined => byVersion(version).get(id)
/** Her class's Limit Break power in engines v10–v18 (D179): the hybrids' 2.2× from v15 (§5). From v19 the Limit Break's
 * own `power` × `heroLimitScale` replaces it. */
export const heroLimitPower = (classId: RpgClass, version: number): number => (rpgV2(version) ? POWER_V2 : POWER_V1)[classId]
/** A seat's Limit Breaks by class, in seat order, in the live generation (kept for the live web until H133). */
export const heroLimitsOf = (classId: RpgClass): HeroLimit[] => HERO_LIMITS.filter((l) => l.classId === classId)
/** A hall's Limit Breaks in an engine's generation, in seat order: none for a hall that generation lacks. */
export const heroLimitsOfHall = (hall: HeroHall, engine: number = BATTLE_ENGINE_VERSION): HeroLimit[] =>
  heroLimitIds(engine).filter((id) => heroLimitHall(id) === hall).map((id) => byVersion(engine).get(id)!)
/** Every kind a Limit Break deals, in the order it first deals them. */
export function heroLimitKinds(limit: HeroLimit): RpgDamageKind[] {
  const kinds: RpgDamageKind[] = []
  for (const c of limit.casts) for (const h of [...c.hits, ...(c.splash ? [c.splash] : [])]) for (const k of h.kinds) if (!kinds.includes(k)) kinds.push(k)
  return kinds
}

/**
 * The casts a hero Limit Break makes, as skills: `total` is her Limit Break's power at full strength (single-target casts
 * at her depth). Every-foe hits and splashes deal the area share; random hits the random bonus, like any skill (D86).
 * v19's shapes (Halls v2): a volley's hits deal `RPG_VOLLEY.target` and its splash `RPG_VOLLEY.splash`; a double becomes
 * two hits at half its share, the second carrying `follow` (a random cast strikes it on the first one's foe).
 */
export function heroLimitSkills(limit: HeroLimit, total: number): RpgSkillDef[] {
  const round = (n: number) => Math.round(n * 1000) / 1000
  const hit = (h: HeroHit, factor: number, share = h.share): RpgHit =>
    ({ power: round(share * total * factor), parts: h.kinds.map((kind) => ({ kind, share: 1 / h.kinds.length })) })
  const hits = (h: HeroHit, factor: number): RpgHit[] =>
    (h.double ? [hit(h, factor, h.share / 2), { ...hit(h, factor, h.share / 2), follow: true }] : [hit(h, factor)])
  const primary = heroLimitKinds(limit)[0]!
  return limit.casts.map((c) => {
    const factor = c.volley ? RPG_VOLLEY.target : c.target === 'all' ? RPG_AOE_SHARE : c.target === 'random' ? RPG_RANDOM_BONUS : 1
    return { target: c.target, hits: c.hits.flatMap((h) => hits(h, factor)), mp: 0, primary: c.hits[0]?.kinds[0] ?? primary,
      ...(c.splash ? { splash: hit(c.splash, c.volley ? RPG_VOLLEY.splash : RPG_AOE_SHARE) } : {}), ...(c.status ? { status: c.status } : {}),
      ...(c.support ? { support15: c.support } : {}) }
  })
}
