// Each chapter's Finals (docs/archive/design/battles.md): four authored routes, each a vanguard (a sub-boss) and then a
// champion, with their elements and escorts. Ported from uma-racer, where they were keyed by scenario slug; uma-rpg reads
// them by release order (D48). Names and lines are original; the faces come from the private PriConne cast. The fourth
// route is a capital run's fourth lane (D293, H159): today's map and the legacy chapter read the first three.
import type { RpgElement } from '../rules'

export type RpgEscortRole = 'striker' | 'caster' | 'guard' | 'skirmisher'
export interface RpgFinalsFoe {
  element: RpgElement
  /** The two regular foes beside her. */
  escorts: readonly [readonly [RpgEscortRole, RpgElement], readonly [RpgEscortRole, RpgElement]]
}
export interface RpgFinalsRoute { name: string; line: string; vanguard: RpgFinalsFoe; champion: RpgFinalsFoe }
export interface RpgFinals { routes: readonly [RpgFinalsRoute, RpgFinalsRoute, RpgFinalsRoute, RpgFinalsRoute] }
/** The routes today's capital and the legacy chapter hold, until capital runs replace them (H162). */
export const RPG_FINALS_ROUTES = 3
/** A capital run's lanes: every authored route (D293). */
export const RPG_FINALS_LANES = 4

const route = (name: string, line: string, vanguard: [RpgElement, RpgEscortRole, RpgElement, RpgEscortRole, RpgElement],
  champion: [RpgElement, RpgEscortRole, RpgElement, RpgEscortRole, RpgElement]): RpgFinalsRoute => {
  const foe = ([element, r1, e1, r2, e2]: typeof vanguard): RpgFinalsFoe => ({ element, escorts: [[r1, e1], [r2, e2]] })
  return { name, line, vanguard: foe(vanguard), champion: foe(champion) }
}

/**
 * Every scenario's four champions differ in element, and across the 56 routes each element leads 11 or 12 (fire, ice,
 * light and dark 11, lightning 12). A vanguard may share her champion's element (one answer clears the route) or not (it
 * needs two). The fourth routes hold at most two escorts of one role.
 */
const BY_SLUG: Readonly<Record<string, RpgFinals>> = {
  'ura-finale': { routes: [
    route('Sprint Final', 'Short and fierce: a lightning start, then a blazing finish.',
      ['lightning', 'skirmisher', 'lightning', 'striker', 'fire'], ['fire', 'skirmisher', 'fire', 'striker', 'lightning']),
    route('Mile Final', 'Clean and balanced: frost first, then a radiant miler.',
      ['ice', 'caster', 'ice', 'guard', 'light'], ['light', 'caster', 'light', 'striker', 'ice']),
    route('Long-Distance Final', "A stayer's grind through dusk and cold.",
      ['dark', 'guard', 'dark', 'caster', 'ice'], ['ice', 'guard', 'ice', 'caster', 'dark']),
    route('Medium Final', 'A duel at middle distance: the dark horse kicks late.',
      ['lightning', 'skirmisher', 'lightning', 'caster', 'dark'], ['dark', 'skirmisher', 'dark', 'striker', 'lightning']),
  ] },
  'unity-cup': { routes: [
    route('Team Blaze', 'A hot-blooded team that charges in together.',
      ['fire', 'striker', 'fire', 'striker', 'lightning'], ['fire', 'striker', 'fire', 'caster', 'lightning']),
    route('Team Glacier', 'A patient team that walls up and wears you down.',
      ['ice', 'guard', 'ice', 'caster', 'ice'], ['ice', 'guard', 'dark', 'caster', 'ice']),
    route('Team Eclipse', 'Light and shadow trade places every turn.',
      ['light', 'caster', 'light', 'skirmisher', 'dark'], ['dark', 'skirmisher', 'dark', 'caster', 'light']),
    route('Team Tempest', 'A stormy team that strikes before the bell.',
      ['fire', 'skirmisher', 'lightning', 'caster', 'fire'], ['lightning', 'striker', 'lightning', 'guard', 'ice']),
  ] },
  trackblazer: { routes: [
    route('Spring Climax', 'Fresh legs and quick feet: a fast, slippery pack.',
      ['light', 'skirmisher', 'light', 'striker', 'lightning'], ['lightning', 'skirmisher', 'lightning', 'skirmisher', 'light']),
    route('Summer Climax', 'Heat haze over the track; the favourite runs hot.',
      ['lightning', 'striker', 'lightning', 'caster', 'fire'], ['fire', 'striker', 'fire', 'guard', 'ice']),
    route('Winter Climax', 'Long nights and cold ground, guarded to the end.',
      ['ice', 'guard', 'ice', 'caster', 'dark'], ['dark', 'caster', 'dark', 'guard', 'ice']),
    route('Autumn Climax', 'Falling leaves and clear skies: a bright finish.',
      ['dark', 'caster', 'dark', 'striker', 'light'], ['light', 'striker', 'light', 'guard', 'dark']),
  ] },
  'grand-concert': { routes: [
    route('Opening Act', 'An electric opener that never lets the tempo drop.',
      ['lightning', 'skirmisher', 'lightning', 'caster', 'fire'], ['lightning', 'skirmisher', 'lightning', 'striker', 'light']),
    route('Encore Stage', 'Spotlights and chorus: casters fill the stage.',
      ['light', 'caster', 'light', 'caster', 'lightning'], ['light', 'caster', 'light', 'guard', 'dark']),
    route('Midnight Live', 'A late show in the dark, loud and heavy.',
      ['dark', 'skirmisher', 'dark', 'striker', 'fire'], ['dark', 'striker', 'dark', 'caster', 'ice']),
    route('Acoustic Set', 'A cool, quiet set that hushes the hall.',
      ['ice', 'guard', 'ice', 'caster', 'light'], ['ice', 'caster', 'ice', 'skirmisher', 'dark']),
  ] },
  'grand-masters': { routes: [
    route('Trial of Radiance', 'A shining master whose guards never fall first.',
      ['light', 'guard', 'light', 'caster', 'ice'], ['light', 'caster', 'light', 'guard', 'fire']),
    route('Trial of Shadow', 'Quick shadows that mark you, then strike.',
      ['dark', 'skirmisher', 'dark', 'skirmisher', 'lightning'], ['dark', 'skirmisher', 'dark', 'caster', 'dark']),
    route('Trial of Flame', 'Ice at the gate, fire at the summit.',
      ['ice', 'striker', 'ice', 'caster', 'fire'], ['fire', 'striker', 'fire', 'striker', 'fire']),
    route('Trial of Storms', 'A storm master who strikes from every side.',
      ['fire', 'skirmisher', 'fire', 'guard', 'lightning'], ['lightning', 'skirmisher', 'lightning', 'striker', 'ice']),
  ] },
  'project-larc': { routes: [
    route('Longchamp Straight', 'The long straight under bright autumn sun.',
      ['lightning', 'skirmisher', 'lightning', 'striker', 'light'], ['light', 'striker', 'light', 'skirmisher', 'lightning']),
    route('Paris by Night', 'City lights and dark corners.',
      ['dark', 'caster', 'dark', 'skirmisher', 'ice'], ['dark', 'caster', 'dark', 'guard', 'light']),
    route('Autumn Rain', 'Heavy going on a cold, soft track.',
      ['ice', 'guard', 'ice', 'caster', 'lightning'], ['ice', 'guard', 'ice', 'striker', 'dark']),
    route('Summer Storm', 'Thunder rolls over the paddock before the start.',
      ['light', 'guard', 'light', 'caster', 'lightning'], ['lightning', 'striker', 'lightning', 'caster', 'fire']),
  ] },
  uaf: { routes: [
    route('Red Division', 'Power events: big hits, no subtlety.',
      ['fire', 'striker', 'fire', 'skirmisher', 'fire'], ['fire', 'striker', 'fire', 'guard', 'lightning']),
    route('Blue Division', 'Water and speed: slippery and hard to pin down.',
      ['ice', 'skirmisher', 'ice', 'caster', 'ice'], ['ice', 'skirmisher', 'ice', 'caster', 'light']),
    route('Yellow Division', 'Precision events: sharp, electric and well drilled.',
      ['lightning', 'caster', 'lightning', 'guard', 'lightning'], ['lightning', 'caster', 'lightning', 'skirmisher', 'fire']),
    route('White Division', 'Endurance events: steady, bright and patient.',
      ['dark', 'guard', 'dark', 'striker', 'light'], ['light', 'guard', 'light', 'caster', 'ice']),
  ] },
  'great-food-festival': { routes: [
    route('Grill Masters', 'Smoke and sizzle: everything here burns.',
      ['fire', 'striker', 'fire', 'caster', 'lightning'], ['fire', 'striker', 'fire', 'caster', 'fire']),
    route('Frozen Dessert Bar', 'Sweet, cold and full of casters.',
      ['ice', 'caster', 'ice', 'guard', 'light'], ['ice', 'caster', 'ice', 'caster', 'light']),
    route('Midnight Feast', 'The last stalls stay open late, and guarded.',
      ['dark', 'skirmisher', 'dark', 'striker', 'fire'], ['dark', 'guard', 'dark', 'striker', 'fire']),
    route('Spice Market', 'Fiery spice that crackles on the tongue.',
      ['fire', 'skirmisher', 'fire', 'caster', 'lightning'], ['lightning', 'skirmisher', 'lightning', 'striker', 'fire']),
  ] },
  'mecha-umamusume': { routes: [
    route('Reactor Core', 'Shielded by drones and charged to the limit.',
      ['fire', 'guard', 'lightning', 'caster', 'fire'], ['lightning', 'caster', 'lightning', 'guard', 'lightning']),
    route('Thruster Bay', 'Afterburners: everything here moves first.',
      ['lightning', 'skirmisher', 'fire', 'skirmisher', 'lightning'], ['fire', 'skirmisher', 'fire', 'striker', 'lightning']),
    route('Coolant Plant', 'Cold machinery and heavy armour.',
      ['dark', 'guard', 'ice', 'caster', 'dark'], ['ice', 'guard', 'ice', 'caster', 'ice']),
    route('Stealth Hangar', 'Dark hulls that strike from the shadows.',
      ['ice', 'skirmisher', 'dark', 'guard', 'ice'], ['dark', 'skirmisher', 'dark', 'caster', 'lightning']),
  ] },
  'twinkle-legends': { routes: [
    route('Shooting Star', 'A streak of light, gone before you can swing.',
      ['lightning', 'skirmisher', 'light', 'skirmisher', 'lightning'], ['light', 'skirmisher', 'light', 'caster', 'lightning']),
    route('Eclipse', 'Day turns to night halfway round.',
      ['light', 'caster', 'light', 'guard', 'dark'], ['dark', 'caster', 'dark', 'caster', 'light']),
    route('Thunderhead', 'A storm legend with a heavy hand.',
      ['ice', 'striker', 'ice', 'guard', 'lightning'], ['lightning', 'striker', 'lightning', 'striker', 'ice']),
    route('Supernova', 'A dying star that burns brightest at the end.',
      ['light', 'caster', 'light', 'striker', 'fire'], ['fire', 'striker', 'fire', 'caster', 'light']),
  ] },
  'design-your-island': { routes: [
    route('Volcano Peak', 'Lava rock and ash: tough, and hot.',
      ['fire', 'striker', 'fire', 'guard', 'fire'], ['fire', 'striker', 'fire', 'caster', 'dark']),
    route('Coral Caves', 'Echoing caves, cold water and casters.',
      ['ice', 'caster', 'ice', 'skirmisher', 'lightning'], ['ice', 'caster', 'ice', 'caster', 'light']),
    route('Monsoon Coast', 'Wind, rain and lightning on the shore.',
      ['lightning', 'skirmisher', 'lightning', 'striker', 'ice'], ['lightning', 'skirmisher', 'lightning', 'guard', 'ice']),
    route('Lighthouse Point', 'A bright beacon watched by tireless keepers.',
      ['dark', 'guard', 'dark', 'skirmisher', 'light'], ['light', 'guard', 'light', 'caster', 'ice']),
  ] },
  'yukoma-hot-springs': { routes: [
    route('Steam Baths', 'Thick steam and scalding water.',
      ['fire', 'caster', 'fire', 'guard', 'ice'], ['fire', 'caster', 'fire', 'striker', 'fire']),
    route('Snow Garden', 'Quiet snow and stubborn defenders.',
      ['ice', 'guard', 'ice', 'striker', 'ice'], ['ice', 'guard', 'ice', 'caster', 'light']),
    route('Lantern Path', 'Paper lanterns light the night walk.',
      ['dark', 'skirmisher', 'dark', 'caster', 'light'], ['light', 'caster', 'light', 'skirmisher', 'dark']),
    route('Mountain Shrine', 'An old shrine at the top of a dark stair.',
      ['light', 'caster', 'light', 'guard', 'dark'], ['dark', 'guard', 'dark', 'striker', 'fire']),
  ] },
  'beyond-dreams': { routes: [
    route('Toward the Light', 'Push through the dark to reach the light.',
      ['dark', 'guard', 'dark', 'caster', 'dark'], ['light', 'caster', 'light', 'striker', 'light']),
    route('Shadow of Doubt', 'Old doubts that stand in the way.',
      ['light', 'skirmisher', 'light', 'striker', 'dark'], ['dark', 'skirmisher', 'dark', 'guard', 'dark']),
    route('Forward Together', 'Shoulder to shoulder, at full speed.',
      ['fire', 'striker', 'fire', 'skirmisher', 'lightning'], ['lightning', 'striker', 'lightning', 'caster', 'fire']),
    route('Still Waters', 'A calm, cold resolve that never breaks.',
      ['lightning', 'striker', 'lightning', 'caster', 'ice'], ['ice', 'caster', 'ice', 'guard', 'dark']),
  ] },
  'tracen-diner': { routes: [
    route('Kitchen Fire', 'Woks on full flame.',
      ['fire', 'striker', 'fire', 'caster', 'fire'], ['fire', 'striker', 'fire', 'guard', 'lightning']),
    route('Cold Noodle Counter', 'Chilled bowls and quick hands.',
      ['ice', 'caster', 'ice', 'skirmisher', 'light'], ['ice', 'caster', 'ice', 'caster', 'ice']),
    route('Morning Prep', 'Opening time: first light and a full house.',
      ['lightning', 'guard', 'light', 'skirmisher', 'lightning'], ['light', 'guard', 'light', 'striker', 'lightning']),
    route('Rush Hour', 'Orders fly and the grill crackles at lunchtime.',
      ['ice', 'skirmisher', 'ice', 'striker', 'lightning'], ['lightning', 'skirmisher', 'lightning', 'guard', 'fire']),
  ] },
}

/** The fourteen authored Finals in release order; scenario names come from master data. */
const SLUG_ORDER = ['ura-finale', 'unity-cup', 'trackblazer', 'grand-concert', 'grand-masters', 'project-larc', 'uaf',
  'great-food-festival', 'mecha-umamusume', 'twinkle-legends', 'design-your-island', 'yukoma-hot-springs', 'beyond-dreams', 'tracen-diner'] as const
export const RPG_FINALS: readonly RpgFinals[] = SLUG_ORDER.map((slug) => BY_SLUG[slug]!)

/** The three routes today's capital and the legacy chapter read (`RPG_FINALS_ROUTES`), until H162. */
export const rpgMapRoutes = (finals: RpgFinals): readonly RpgFinalsRoute[] => finals.routes.slice(0, RPG_FINALS_ROUTES)

/** A chapter's Finals by release order. A scenario newer than the fourteen authored ones reuses them in turn until it gets its own. */
export function rpgFinals(order: number): RpgFinals {
  if (!Number.isSafeInteger(order) || order < 1) throw new RangeError(`Bad chapter order ${order}`)
  return RPG_FINALS[(order - 1) % RPG_FINALS.length]!
}
