// Halls of Heroes (D106, D107): each class's hall seats four Heroes, and each seat teaches one unique Limit Break. A Hero
// always uses her seat's Limit Break at full strength; a Learner under her inherits it at half, plus 5% a Bond Level, and
// keeps its shape: its weapons and elements (worn or not), its hits and its statuses.
import { RPG_AOE_SHARE, RPG_RANDOM_BONUS, type RpgSkillDef } from './catalog'
import type { RpgClass, RpgDamageKind } from './kinds'
import type { HeroLimitId } from './hero-id'
export * from './hero-id'

/**
 * Her Limit Break's power in single-target casts at her depth, by the class she fights as: what her class's own Limit
 * Break deals (D311, D86). A Hero's Limit Break at 100% matches it; at Bond 0 it is half, about one turn's damage.
 */
export const HERO_LIMIT_POWER: Readonly<Record<RpgClass, number>> = { brawler: 2, mage: 2.4, spellblade: 2, cleric: 1.5, summoner: 1.8 }

/** One hit: its kinds (two fuse into one hit, half each) and its share of the Limit Break's power. */
export interface HeroHit { kinds: readonly RpgDamageKind[]; share: number }
/**
 * One cast of a hero Limit Break. `one`: every hit on the tapped foe; `all`: every foe takes each hit (at the area share);
 * `random`: each hit on a random foe. `splash` then hits every other foe once. A cast with no hits only casts its status.
 */
export interface HeroCast {
  target: 'one' | 'all' | 'random'
  hits: readonly HeroHit[]
  splash?: HeroHit
  status?: RpgSkillDef['status']
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

const BY_ID = new Map(LIMITS.map((l) => [l.id, l]))
export const HERO_LIMITS: readonly HeroLimit[] = LIMITS
export const heroLimit = (id: HeroLimitId): HeroLimit => BY_ID.get(id)!
/** A seat's Limit Breaks by class, in seat order. */
export const heroLimitsOf = (classId: RpgClass): HeroLimit[] => LIMITS.filter((l) => l.classId === classId)
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
      ...(c.splash ? { splash: hit(c.splash, RPG_AOE_SHARE) } : {}), ...(c.status ? { status: c.status } : {}) }
  })
}
