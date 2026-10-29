// The twins re-paired at engine v19 (H128; classes-v3.md §4.3, CV13), built dark: Katana–Light and Bow–Dark from v19,
// Twilight still the Bow and the Katana, v16–v18 keeping theirs, and `rpgTwinsOf` pinned to v16's sets whatever the switch.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BATTLE_ENGINE_VERSION } from './battle/caps'
import {
  RPG_ELEMENTS, RPG_KIND_PAIRS, RPG_KIND_PAIRS_V19, RPG_TWIN_SET_IDS, RPG_TWIN_SETS, rpgAnsweredTwinSets, rpgKindPairs, rpgTwinArm, rpgTwinKind,
  rpgTwinSets, rpgTwinsOf, rpgTwinWeaknesses, type RpgElement,
} from './kinds'

const V16_SETS = { fire: ['greatsword', 'fire'], ice: ['axe', 'ice'], lightning: ['lance', 'lightning'], light: ['bow', 'light'],
  dark: ['katana', 'dark'], twilight: ['bow', 'katana'] }
const V19_SETS = { ...V16_SETS, light: ['katana', 'light'], dark: ['bow', 'dark'] }
/** A few world signatures (single and paired), each at two slots. */
const SIGNATURES: readonly (readonly RpgElement[])[] = [['fire'], ['ice'], ['lightning'], ['light'], ['dark'], ['fire', 'ice'], ['light', 'dark'],
  ['dark', 'fire'], ['lightning', 'light']]
const twinsAll = (of: typeof rpgTwinsOf) => SIGNATURES.flatMap((sig) => [0, 1].map((slot) => of(sig, slot)))

describe('the pairs and the twin sets by engine (CV13)', () => {
  it('keeps v6–v18\'s pairs and gives v19 Katana–Light and Bow–Dark, in the elements\' order', () => {
    expect(RPG_KIND_PAIRS).toEqual([['greatsword', 'fire'], ['axe', 'ice'], ['lance', 'lightning'], ['bow', 'light'], ['katana', 'dark']])
    expect(RPG_KIND_PAIRS_V19).toEqual([['greatsword', 'fire'], ['axe', 'ice'], ['lance', 'lightning'], ['katana', 'light'], ['bow', 'dark']])
    expect(RPG_KIND_PAIRS_V19.map(([, e]) => e)).toEqual(RPG_ELEMENTS)
    for (const v of [6, 15, 16, 17, 18]) expect(rpgKindPairs(v), `v${v}`).toBe(RPG_KIND_PAIRS)
    expect(rpgKindPairs(19)).toBe(RPG_KIND_PAIRS_V19)
    expect(rpgKindPairs()).toBe(RPG_KIND_PAIRS)
  })

  it('gives the six sets at 18 and at 19, Twilight unchanged; the live sets stay v18\'s', () => {
    expect(rpgTwinSets(18)).toEqual(V16_SETS)
    expect(rpgTwinSets(16)).toEqual(V16_SETS)
    expect(rpgTwinSets(19)).toEqual(V19_SETS)
    expect(Object.keys(rpgTwinSets(19))).toEqual(RPG_TWIN_SET_IDS)
    expect(RPG_TWIN_SET_IDS).toEqual(['fire', 'ice', 'lightning', 'light', 'dark', 'twilight'])
    expect(BATTLE_ENGINE_VERSION).toBe(18)
    expect(RPG_TWIN_SETS).toEqual(V16_SETS)
    expect([rpgTwinWeaknesses('light', 19), rpgTwinWeaknesses('dark', 19), rpgTwinWeaknesses('twilight', 19)]).toEqual([
      { weapons: ['katana'], elements: ['light'] }, { weapons: ['bow'], elements: ['dark'] }, { weapons: ['bow', 'katana'], elements: [] }])
    expect([rpgTwinWeaknesses('light', 18), rpgTwinWeaknesses('dark')]).toEqual([
      { weapons: ['bow'], elements: ['light'] }, { weapons: ['katana'], elements: ['dark'] }])
  })

  it('twins Katana ↔ Light and Bow ↔ Dark at 19, Bow ↔ Light and Katana ↔ Dark at 18, the rest alike', () => {
    expect(['katana', 'light', 'bow', 'dark'].map((k) => rpgTwinKind(k as never, 19))).toEqual(['light', 'katana', 'dark', 'bow'])
    expect(['katana', 'light', 'bow', 'dark'].map((k) => rpgTwinKind(k as never, 18))).toEqual(['dark', 'bow', 'light', 'katana'])
    for (const [arm, element] of RPG_KIND_PAIRS.slice(0, 3)) {
      for (const v of [18, 19]) expect([rpgTwinKind(arm, v), rpgTwinKind(element, v), rpgTwinArm(element, v)]).toEqual([element, arm, arm])
    }
    expect([rpgTwinArm('light', 19), rpgTwinArm('dark', 19), rpgTwinArm('light', 18), rpgTwinArm('dark')]).toEqual(['katana', 'bow', 'bow', 'katana'])
  })

  it('answers the Light set and Twilight with a Katana at 19, the Dark set and Twilight with a Bow', () => {
    expect(rpgAnsweredTwinSets(['katana'], 19)).toEqual(['light', 'twilight'])
    expect(rpgAnsweredTwinSets(['bow'], 19)).toEqual(['dark', 'twilight'])
    expect(rpgAnsweredTwinSets(['katana'], 18)).toEqual(['dark', 'twilight'])
    expect(rpgAnsweredTwinSets(['bow'])).toEqual(['light', 'twilight'])
    // An Uma's weapons pass as they are: a Tome answers its element's set either way.
    expect(rpgAnsweredTwinSets(['tome-light', 'tome-ice', 'bow'], 19)).toEqual(['ice', 'light', 'dark', 'twilight'])
    expect(rpgAnsweredTwinSets(['tome-light', 'tome-ice', 'bow'], 18)).toEqual(['ice', 'light', 'twilight'])
  })

  it('keeps engines v16–v17\'s world twins on v16\'s sets (`rpgTwinsOf`)', () => {
    const twins = twinsAll(rpgTwinsOf)
    // The light foe's twins answer with Dark and its v16 Arm, the Katana; the dark foe's with Light and the Bow.
    expect(rpgTwinsOf(['light'], 0)).toEqual({ weapons: ['katana'], elements: ['dark'] })
    expect(rpgTwinsOf(['dark'], 0)).toEqual({ weapons: ['bow'], elements: ['light'] })
    expect(rpgTwinsOf(['light', 'dark'], 0)).toEqual({ weapons: ['bow', 'katana'], elements: [] })
    const v16 = RPG_TWIN_SET_IDS.map((set) => rpgTwinWeaknesses(set, 16))
    for (const w of twins) expect(v16).toContainEqual(w)
  })
})

describe('the twins with the switch mocked to 19', () => {
  afterEach(() => { vi.doUnmock('./battle/caps'); vi.resetModules() })

  it('makes v19\'s sets live and leaves `rpgTwinsOf` on v16\'s', async () => {
    const unmocked = twinsAll(rpgTwinsOf)
    vi.resetModules()
    vi.doMock('./battle/caps', async (orig) => (await import('./battle/caps-at.fixture')).capsAt(19, await orig()))
    const live = await import('./kinds')
    expect(live.RPG_TWIN_SETS).toEqual(V19_SETS)
    expect(live.rpgKindPairs()).toEqual(RPG_KIND_PAIRS_V19)
    expect([live.rpgTwinKind('bow'), live.rpgTwinArm('light')]).toEqual(['dark', 'katana'])
    expect(live.rpgAnsweredTwinSets(['katana'])).toEqual(['light', 'twilight'])
    expect(twinsAll(live.rpgTwinsOf)).toEqual(unmocked)
  })
})
