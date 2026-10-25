// Halls of Heroes (D106, D107): each class's hall seats four Heroes, and each seat teaches one unique Limit Break. A Hero
// always uses her seat's Limit Break at full strength; a Learner under her inherits it at half, plus 5% a Bond Level, and
// keeps its shape: its weapons and elements (worn or not), its hits and its statuses. Classes v2 (engine v15, §5) adds the
// Paladin Bastion: 24 Limit Breaks, read by generation like every class rule (D179). Engine v16 (the Tier rework's fight,
// H65) changes two seats' kinds (CP35). A Limit Break never takes a Skill Rank (CP28): its power is her open depth's.
import { BATTLE_ENGINE_VERSION, rpgRework, rpgV2 } from './battle/caps'
import { RPG_AOE_SHARE, RPG_RANDOM_BONUS, type RpgSkillDef, type RpgSupport } from './catalog'
import type { RpgClass, RpgDamageKind } from './kinds'
import type { HeroLimitId } from './hero-id'
export * from './hero-id'

/**
 * Her Limit Break's power in single-target casts at her depth, by the class she fights as: what her class's own Limit
 * Break deals (D311, D86). A Hero's Limit Break at 100% matches it; at Bond 0 it is half, about one turn's damage. From
 * v15 (§5) the hybrids' rise to 2.2×.
 */
const POWER_V1: Readonly<Record<RpgClass, number>> = { brawler: 2, mage: 2.4, spellblade: 2, cleric: 1.5, summoner: 1.8, paladin: 1.5 }
const POWER_V2: Readonly<Record<RpgClass, number>> = { ...POWER_V1, spellblade: 2.2, summoner: 2.2 }
/** The live generation's powers (the manual's tables); the engine reads `heroLimitPower(classId, version)`. */
export const HERO_LIMIT_POWER: Readonly<Record<RpgClass, number>> = rpgV2() ? POWER_V2 : POWER_V1
/** v15: the share of a hall Limit Break's mend or Barrier, 1.5× the doubled depth-5 share as its power is 1.5× (§5); ×0.4
 * on every Uma, × the caster's ATK or M.ATK scaling and the cast's strength. */
export const HERO_LIMIT_SUPPORT_SHARE = 0.66

/** One hit: its kinds (two fuse into one hit, half each) and its share of the Limit Break's power. */
export interface HeroHit { kinds: readonly RpgDamageKind[]; share: number }
/**
 * One cast of a hero Limit Break. `one`: every hit on the tapped foe; `all`: every foe takes each hit (at the area share);
 * `random`: each hit on a random foe. `splash` then hits every other foe once. A cast with no hits only casts its status.
 * `support` (v15's halls): a mend, Barrier, cleanse or revive after its hits, at the cast's strength.
 */
export interface HeroCast {
  target: 'one' | 'all' | 'random'
  hits: readonly HeroHit[]
  splash?: HeroHit
  status?: RpgSkillDef['status']
  support?: RpgSupport
}
export interface HeroLimit { id: HeroLimitId; classId: RpgClass; name: string; blurb: string; casts: readonly HeroCast[] }

const one = (kind: RpgDamageKind, share: number): HeroHit => ({ kinds: [kind], share })
const fused = (a: RpgDamageKind, b: RpgDamageKind, share: number): HeroHit => ({ kinds: [a, b], share })
/** `n` hits cycling through `kinds`, sharing the whole. */
const cycle = (n: number, ...kinds: RpgDamageKind[]): HeroHit[] => Array.from({ length: n }, (_, i) => one(kinds[i % kinds.length]!, 1 / n))

const LIMITS: readonly HeroLimit[] = [
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
]

/** v15 (classes v2 §5): the six halls' 24. The Chapel's seats 3–4 move to the Paladin Bastion's 1–2, and both halls gain
 * two: Tome-led in the Chapel, Arms-led in the Bastion, each mending, shielding or reviving. Sunfire Edge cleaves three
 * times and Moon Fox strikes random foes. */
const BY_V1 = new Map(LIMITS.map((l) => [l.id, l]))
const heal = (support: Omit<RpgSupport, 'share'>): RpgSupport => ({ share: HERO_LIMIT_SUPPORT_SHARE, ...support })
const moved = (from: HeroLimitId, id: HeroLimitId): HeroLimit => ({ ...BY_V1.get(from)!, id, classId: 'paladin' })
const NEW: readonly HeroLimit[] = [
  { id: 'spellblade-1', classId: 'spellblade', name: 'Sunfire Edge', blurb: 'Three Greatsword-and-Fire cleaves on one foe; its flames splash every other foe',
    casts: [{ target: 'one', hits: Array.from({ length: 3 }, () => fused('greatsword', 'fire', 0.7 / 3)), splash: one('fire', 0.3) }] },
  { id: 'cleric-3', classId: 'cleric', name: 'Dawn Hymn', blurb: 'Fire on every foe, then a mend on every ally',
    casts: [{ target: 'all', hits: [one('fire', 1)], support: heal({ mend: 'all' }) }] },
  { id: 'cleric-4', classId: 'cleric', name: 'Frost Sanctuary', blurb: 'Ice on every foe, then a cleanse and a Barrier on every ally',
    casts: [{ target: 'all', hits: [one('ice', 1)], support: heal({ shield: 'all', cleanse: true }) }] },
  { id: 'summoner-4', classId: 'summoner', name: 'Moon Fox', blurb: 'Eight strikes at random foes: Katana, Dark, Bow and Light in turn',
    casts: [{ target: 'random', hits: cycle(8, 'katana', 'dark', 'bow', 'light') }] },
  moved('cleric-3', 'paladin-1'),
  moved('cleric-4', 'paladin-2'),
  { id: 'paladin-3', classId: 'paladin', name: 'Rampart Charge', blurb: 'One Greatsword charge on one foe, then a Barrier on every ally',
    casts: [{ target: 'one', hits: [one('greatsword', 1)], support: heal({ shield: 'all' }) }] },
  { id: 'paladin-4', classId: 'paladin', name: 'Valkyrie Lances', blurb: 'Four Lance hits at random foes, then the first fallen ally rises',
    casts: [{ target: 'random', hits: cycle(4, 'lance'), support: { share: 0, revive: true } }] },
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
const byVersion = (version: number) => (rpgRework('fight', version) ? BY_V16 : rpgV2(version) ? BY_V2 : BY_V1)
const LIVE = byVersion(BATTLE_ENGINE_VERSION)
/** The live generation's Limit Breaks, in seat order: today's 20 until the switch (H61), the six halls' 24 after, with
 * v16's two kinds from H72. Screens and the manual read these; the engine reads `heroLimitFor(id, version)`. */
export const HERO_LIMITS: readonly HeroLimit[] = [...LIVE.values()]
export const heroLimit = (id: HeroLimitId): HeroLimit => LIVE.get(id)!
/** A seat's Limit Break in an engine's generation (D179): the engine always asks with the fight's version. Undefined only
 * for a seat its generation lacks (a Paladin seat before v15, which the engine refuses). */
export const heroLimitFor = (id: HeroLimitId, version: number): HeroLimit | undefined => byVersion(version).get(id)
/** Her class's Limit Break power in an engine's generation (D179): the hybrids' 2.2× from v15 (§5). */
export const heroLimitPower = (classId: RpgClass, version: number): number => (rpgV2(version) ? POWER_V2 : POWER_V1)[classId]
/** A seat's Limit Breaks by class, in seat order, in the live generation. */
export const heroLimitsOf = (classId: RpgClass): HeroLimit[] => HERO_LIMITS.filter((l) => l.classId === classId)
/** Every kind a Limit Break deals, in the order it first deals them. */
export function heroLimitKinds(limit: HeroLimit): RpgDamageKind[] {
  const kinds: RpgDamageKind[] = []
  for (const c of limit.casts) for (const h of [...c.hits, ...(c.splash ? [c.splash] : [])]) for (const k of h.kinds) if (!kinds.includes(k)) kinds.push(k)
  return kinds
}

/**
 * The casts a hero Limit Break makes, as skills: `total` is her Limit Break's power at full strength (single-target casts
 * at her depth). Every-foe hits and splashes deal the area share; random hits the random bonus, like any skill (D86).
 */
export function heroLimitSkills(limit: HeroLimit, total: number): RpgSkillDef[] {
  const round = (n: number) => Math.round(n * 1000) / 1000
  const hit = (h: HeroHit, factor: number) => ({ power: round(h.share * total * factor), parts: h.kinds.map((kind) => ({ kind, share: 1 / h.kinds.length })) })
  const primary = heroLimitKinds(limit)[0]!
  return limit.casts.map((c) => {
    const factor = c.target === 'all' ? RPG_AOE_SHARE : c.target === 'random' ? RPG_RANDOM_BONUS : 1
    return { target: c.target, hits: c.hits.map((h) => hit(h, factor)), mp: 0, primary: c.hits[0]?.kinds[0] ?? primary,
      ...(c.splash ? { splash: hit(c.splash, RPG_AOE_SHARE) } : {}), ...(c.status ? { status: c.status } : {}),
      ...(c.support ? { support15: c.support } : {}) }
  })
}
