// Each chapter's Finals (docs/design/battles.md): three authored routes, each a vanguard (a sub-boss) and then a
// champion, with their elements and escorts. Ported from uma-racer, where they were keyed by scenario slug; uma-rpg reads
// them by release order (D48). Names and lines are original; the faces come from the private PriConne cast.
import type { RpgElement } from '../rules'

export type RpgEscortRole = 'striker' | 'caster' | 'guard' | 'skirmisher'
export interface RpgFinalsFoe {
  element: RpgElement
  /** The two regular foes beside her. */
  escorts: readonly [readonly [RpgEscortRole, RpgElement], readonly [RpgEscortRole, RpgElement]]
}
export interface RpgFinalsRoute { name: string; line: string; vanguard: RpgFinalsFoe; champion: RpgFinalsFoe }
export interface RpgFinals { routes: readonly [RpgFinalsRoute, RpgFinalsRoute, RpgFinalsRoute] }
export const RPG_FINALS_ROUTES = 3

const route = (name: string, line: string, vanguard: [RpgElement, RpgEscortRole, RpgElement, RpgEscortRole, RpgElement],
  champion: [RpgElement, RpgEscortRole, RpgElement, RpgEscortRole, RpgElement]): RpgFinalsRoute => {
  const foe = ([element, r1, e1, r2, e2]: typeof vanguard): RpgFinalsFoe => ({ element, escorts: [[r1, e1], [r2, e2]] })
  return { name, line, vanguard: foe(vanguard), champion: foe(champion) }
}

/**
 * Every scenario's three champions differ in element, and across the fourteen each element leads seven to ten routes.
 * A vanguard may share her champion's element (one answer clears the route) or not (it needs two).
 */
const BY_SLUG: Readonly<Record<string, RpgFinals>> = {
  'ura-finale': { routes: [
    route('Sprint Final', 'Short and fierce: a lightning start, then a blazing finish.',
      ['lightning', 'skirmisher', 'lightning', 'striker', 'fire'], ['fire', 'skirmisher', 'fire', 'striker', 'lightning']),
    route('Mile Final', 'Clean and balanced: frost first, then a radiant miler.',
      ['ice', 'caster', 'ice', 'guard', 'light'], ['light', 'caster', 'light', 'striker', 'ice']),
    route('Long-Distance Final', "A stayer's grind through dusk and cold.",
      ['dark', 'guard', 'dark', 'caster', 'ice'], ['ice', 'guard', 'ice', 'caster', 'dark']),
  ] },
  'unity-cup': { routes: [
    route('Team Blaze', 'A hot-blooded team that charges in together.',
      ['fire', 'striker', 'fire', 'striker', 'lightning'], ['fire', 'striker', 'fire', 'caster', 'lightning']),
    route('Team Glacier', 'A patient team that walls up and wears you down.',
      ['ice', 'guard', 'ice', 'caster', 'ice'], ['ice', 'guard', 'dark', 'caster', 'ice']),
    route('Team Eclipse', 'Light and shadow trade places every turn.',
      ['light', 'caster', 'light', 'skirmisher', 'dark'], ['dark', 'skirmisher', 'dark', 'caster', 'light']),
  ] },
  trackblazer: { routes: [
    route('Spring Climax', 'Fresh legs and quick feet: a fast, slippery pack.',
      ['light', 'skirmisher', 'light', 'striker', 'lightning'], ['lightning', 'skirmisher', 'lightning', 'skirmisher', 'light']),
    route('Summer Climax', 'Heat haze over the track; the favourite runs hot.',
      ['lightning', 'striker', 'lightning', 'caster', 'fire'], ['fire', 'striker', 'fire', 'guard', 'ice']),
    route('Winter Climax', 'Long nights and cold ground, guarded to the end.',
      ['ice', 'guard', 'ice', 'caster', 'dark'], ['dark', 'caster', 'dark', 'guard', 'ice']),
  ] },
  'grand-concert': { routes: [
    route('Opening Act', 'An electric opener that never lets the tempo drop.',
      ['lightning', 'skirmisher', 'lightning', 'caster', 'fire'], ['lightning', 'skirmisher', 'lightning', 'striker', 'light']),
    route('Encore Stage', 'Spotlights and chorus: casters fill the stage.',
      ['light', 'caster', 'light', 'caster', 'lightning'], ['light', 'caster', 'light', 'guard', 'dark']),
    route('Midnight Live', 'A late show in the dark, loud and heavy.',
      ['dark', 'skirmisher', 'dark', 'striker', 'fire'], ['dark', 'striker', 'dark', 'caster', 'ice']),
  ] },
  'grand-masters': { routes: [
    route('Trial of Radiance', 'A shining master whose guards never fall first.',
      ['light', 'guard', 'light', 'caster', 'ice'], ['light', 'caster', 'light', 'guard', 'fire']),
    route('Trial of Shadow', 'Quick shadows that mark you, then strike.',
      ['dark', 'skirmisher', 'dark', 'skirmisher', 'lightning'], ['dark', 'skirmisher', 'dark', 'caster', 'dark']),
    route('Trial of Flame', 'Ice at the gate, fire at the summit.',
      ['ice', 'striker', 'ice', 'caster', 'fire'], ['fire', 'striker', 'fire', 'striker', 'fire']),
  ] },
  'project-larc': { routes: [
    route('Longchamp Straight', 'The long straight under bright autumn sun.',
      ['lightning', 'skirmisher', 'lightning', 'striker', 'light'], ['light', 'striker', 'light', 'skirmisher', 'lightning']),
    route('Paris by Night', 'City lights and dark corners.',
      ['dark', 'caster', 'dark', 'skirmisher', 'ice'], ['dark', 'caster', 'dark', 'guard', 'light']),
    route('Autumn Rain', 'Heavy going on a cold, soft track.',
      ['ice', 'guard', 'ice', 'caster', 'lightning'], ['ice', 'guard', 'ice', 'striker', 'dark']),
  ] },
  uaf: { routes: [
    route('Red Division', 'Power events: big hits, no subtlety.',
      ['fire', 'striker', 'fire', 'skirmisher', 'fire'], ['fire', 'striker', 'fire', 'guard', 'lightning']),
    route('Blue Division', 'Water and speed: slippery and hard to pin down.',
      ['ice', 'skirmisher', 'ice', 'caster', 'ice'], ['ice', 'skirmisher', 'ice', 'caster', 'light']),
    route('Yellow Division', 'Precision events: sharp, electric and well drilled.',
      ['lightning', 'caster', 'lightning', 'guard', 'lightning'], ['lightning', 'caster', 'lightning', 'skirmisher', 'fire']),
  ] },
  'great-food-festival': { routes: [
    route('Grill Masters', 'Smoke and sizzle: everything here burns.',
      ['fire', 'striker', 'fire', 'caster', 'lightning'], ['fire', 'striker', 'fire', 'caster', 'fire']),
    route('Frozen Dessert Bar', 'Sweet, cold and full of casters.',
      ['ice', 'caster', 'ice', 'guard', 'light'], ['ice', 'caster', 'ice', 'caster', 'light']),
    route('Midnight Feast', 'The last stalls stay open late, and guarded.',
      ['dark', 'skirmisher', 'dark', 'striker', 'fire'], ['dark', 'guard', 'dark', 'striker', 'fire']),
  ] },
  'mecha-umamusume': { routes: [
    route('Reactor Core', 'Shielded by drones and charged to the limit.',
      ['fire', 'guard', 'lightning', 'caster', 'fire'], ['lightning', 'caster', 'lightning', 'guard', 'lightning']),
    route('Thruster Bay', 'Afterburners: everything here moves first.',
      ['lightning', 'skirmisher', 'fire', 'skirmisher', 'lightning'], ['fire', 'skirmisher', 'fire', 'striker', 'lightning']),
    route('Coolant Plant', 'Cold machinery and heavy armour.',
      ['dark', 'guard', 'ice', 'caster', 'dark'], ['ice', 'guard', 'ice', 'caster', 'ice']),
  ] },
  'twinkle-legends': { routes: [
    route('Shooting Star', 'A streak of light, gone before you can swing.',
      ['lightning', 'skirmisher', 'light', 'skirmisher', 'lightning'], ['light', 'skirmisher', 'light', 'caster', 'lightning']),
    route('Eclipse', 'Day turns to night halfway round.',
      ['light', 'caster', 'light', 'guard', 'dark'], ['dark', 'caster', 'dark', 'caster', 'light']),
    route('Thunderhead', 'A storm legend with a heavy hand.',
      ['ice', 'striker', 'ice', 'guard', 'lightning'], ['lightning', 'striker', 'lightning', 'striker', 'ice']),
  ] },
  'design-your-island': { routes: [
    route('Volcano Peak', 'Lava rock and ash: tough, and hot.',
      ['fire', 'striker', 'fire', 'guard', 'fire'], ['fire', 'striker', 'fire', 'caster', 'dark']),
    route('Coral Caves', 'Echoing caves, cold water and casters.',
      ['ice', 'caster', 'ice', 'skirmisher', 'lightning'], ['ice', 'caster', 'ice', 'caster', 'light']),
    route('Monsoon Coast', 'Wind, rain and lightning on the shore.',
      ['lightning', 'skirmisher', 'lightning', 'striker', 'ice'], ['lightning', 'skirmisher', 'lightning', 'guard', 'ice']),
  ] },
  'yukoma-hot-springs': { routes: [
    route('Steam Baths', 'Thick steam and scalding water.',
      ['fire', 'caster', 'fire', 'guard', 'ice'], ['fire', 'caster', 'fire', 'striker', 'fire']),
    route('Snow Garden', 'Quiet snow and stubborn defenders.',
      ['ice', 'guard', 'ice', 'striker', 'ice'], ['ice', 'guard', 'ice', 'caster', 'light']),
    route('Lantern Path', 'Paper lanterns light the night walk.',
      ['dark', 'skirmisher', 'dark', 'caster', 'light'], ['light', 'caster', 'light', 'skirmisher', 'dark']),
  ] },
  'beyond-dreams': { routes: [
    route('Toward the Light', 'Push through the dark to reach the light.',
      ['dark', 'guard', 'dark', 'caster', 'dark'], ['light', 'caster', 'light', 'striker', 'light']),
    route('Shadow of Doubt', 'Old doubts that stand in the way.',
      ['light', 'skirmisher', 'light', 'striker', 'dark'], ['dark', 'skirmisher', 'dark', 'guard', 'dark']),
    route('Forward Together', 'Shoulder to shoulder, at full speed.',
      ['fire', 'striker', 'fire', 'skirmisher', 'lightning'], ['lightning', 'striker', 'lightning', 'caster', 'fire']),
  ] },
  'tracen-diner': { routes: [
    route('Kitchen Fire', 'Woks on full flame.',
      ['fire', 'striker', 'fire', 'caster', 'fire'], ['fire', 'striker', 'fire', 'guard', 'lightning']),
    route('Cold Noodle Counter', 'Chilled bowls and quick hands.',
      ['ice', 'caster', 'ice', 'skirmisher', 'light'], ['ice', 'caster', 'ice', 'caster', 'ice']),
    route('Morning Prep', 'Opening time: first light and a full house.',
      ['lightning', 'guard', 'light', 'skirmisher', 'lightning'], ['light', 'guard', 'light', 'striker', 'lightning']),
  ] },
}

/** The fourteen authored Finals in release order; scenario names come from master data. */
const SLUG_ORDER = ['ura-finale', 'unity-cup', 'trackblazer', 'grand-concert', 'grand-masters', 'project-larc', 'uaf',
  'great-food-festival', 'mecha-umamusume', 'twinkle-legends', 'design-your-island', 'yukoma-hot-springs', 'beyond-dreams', 'tracen-diner'] as const
export const RPG_FINALS: readonly RpgFinals[] = SLUG_ORDER.map((slug) => BY_SLUG[slug]!)

/** A chapter's Finals by release order. A scenario newer than the fourteen authored ones reuses them in turn until it gets its own. */
export function rpgFinals(order: number): RpgFinals {
  if (!Number.isSafeInteger(order) || order < 1) throw new RangeError(`Bad chapter order ${order}`)
  return RPG_FINALS[(order - 1) % RPG_FINALS.length]!
}
