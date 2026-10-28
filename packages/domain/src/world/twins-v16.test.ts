// Tier 1's foes on engine v16 (H66, D202; class-progression.md §4.1, §4.4): every foe of every rank is weak to her twins
// (CP5), the sub-boss's and the boss's shields are `RPG_FOE_SHIELDS_V16`'s (CP8, SB6; H71 measured today's 6 and 8, D207),
// and nothing else moves; live since H72 (D210), so the generators give v16's foes by default. v15's generation stays
// byte for byte as it was, whatever the switch says: the digests below were taken on the generators before H66.
import { describe, expect, it } from 'vitest'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import type { BattleEnemy } from '../rpg/battle/types'
import { rpgCampaignChapter, type RpgCampaignChapter } from '../rpg/campaign/chapters'
import { RPG_FOE_SHIELDS_V16, RPG_FOE_TUNING, rpgFoeShields } from '../rpg/campaign/enemies'
import {
  RPG_ELEMENTS, RPG_KIND_PAIRS, RPG_TWIN_SET_IDS, RPG_TWIN_SETS, rpgAnsweredTwinSets, rpgElementWeakness, rpgTwinArm, rpgTwinsOf,
  type RpgElement,
} from '../rpg/kinds'
import { RIFT_FRONT_SPECS, riftGuidedBuild, riftTuning } from '../rift/fronts'
import { riftFight } from '../rift/generate'
import { packRoster } from '../rift/roster.fixture'
import { RIFT_FRONTS } from '../rift/state'
import { capitalChapter } from './capital'
import { regionChapter, worldContinent } from './world'

const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const continents = (orders: readonly number[]) => orders.map((order) => worldContinent({ name: 'T', order }))
const TIER1 = continents([1, 2, 3, 4, 5])
/** Every region chapter and capital of the given continents, in an engine's generation. */
const chapters = (list: ReturnType<typeof continents>, engine: number): RpgCampaignChapter[] =>
  list.flatMap((c) => [...c.regions.map((r) => regionChapter(r, cast, engine)), capitalChapter(c, cast, engine)])
const foesOf = (chapter: RpgCampaignChapter): BattleEnemy[] => chapter.nodes.flatMap((n) => [n.enemies, ...(n.waves ?? [])].flat())

/** FNV-1a, as `world.ts` hashes and `tier1-foes.test.ts` pins. */
function fnv1a(text: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return (h >>> 0).toString(16).padStart(8, '0')
}

describe('her twins (CP5): the rule', () => {
  it('names the six twin sets and each element’s Arm', () => {
    expect(RPG_TWIN_SET_IDS).toEqual(['fire', 'ice', 'lightning', 'light', 'dark', 'twilight'])
    for (const [arm, element] of RPG_KIND_PAIRS) {
      expect(rpgTwinArm(element)).toBe(arm)
      expect(RPG_TWIN_SETS[element]).toEqual([arm, element])
    }
    expect(RPG_TWIN_SETS.twilight).toEqual(['bow', 'katana'])
  })

  it.each([
    [['fire'], 0, ['lance'], ['lightning']],
    [['ice'], 0, ['greatsword'], ['fire']],
    [['lightning'], 0, ['axe'], ['ice']],
    [['light'], 0, ['katana'], ['dark']],
    [['dark'], 0, ['bow'], ['light']],
    [['fire', 'lightning'], 0, ['axe'], ['ice']],
    [['fire', 'lightning'], 1, ['axe'], ['ice']],
    [['ice', 'light'], 0, ['greatsword'], ['fire']],
    [['ice', 'light'], 1, ['katana'], ['dark']],
    [['light', 'dark'], 0, ['bow', 'katana'], []],
    [['light', 'dark'], 1, ['bow', 'katana'], []],
  ] as const)('a %j foe in slot %i is weak to %j and %j', (signature, slot, weapons, elements) => {
    expect(rpgTwinsOf(signature, slot)).toEqual({ weapons, elements })
  })

  it('reads a pair’s lead by slot, as her element does, and never names her own element', () => {
    for (const a of RPG_ELEMENTS) {
      for (const b of RPG_ELEMENTS) {
        const signature = a === b ? [a] : [a, b]
        for (const slot of [0, 1, 2, 3]) {
          const weak = rpgTwinsOf(signature, slot)
          for (const own of signature) expect(weak.elements).not.toContain(own)
          expect(rpgTwinsOf(signature, slot + 2)).toEqual(weak)
        }
      }
    }
  })

  it('lists the twin sets a list of kinds answers, weapons as the kinds they deal', () => {
    expect(rpgAnsweredTwinSets(['greatsword', 'axe', 'lance'])).toEqual(['fire', 'ice', 'lightning'])
    expect(rpgAnsweredTwinSets(['katana', 'lance', 'tome-lightning'])).toEqual(['lightning', 'dark', 'twilight'])
    expect(rpgAnsweredTwinSets(['tome-light', 'ice', 'bow'])).toEqual(['ice', 'light', 'twilight'])
    expect(rpgAnsweredTwinSets([])).toEqual([])
  })
})

describe('Tier 1’s foes on v16 (D202)', () => {
  const v15 = chapters(TIER1, 15)
  const v16 = chapters(TIER1, 16)

  it('makes every foe of every region and capital weak to one Arm and its twin element, or the Bow and the Katana on Light + Dark', () => {
    const foes = v16.flatMap(foesOf)
    expect(foes.length).toBeGreaterThan(5000)
    let twilight = 0
    for (const foe of foes) {
      const own: RpgElement[] = [foe.element, ...(foe.element2 ? [foe.element2] : [])]
      const { weapons, elements } = foe.weaknesses
      if (own.includes('light') && own.includes('dark')) {
        twilight += 1
        expect({ weapons, elements }).toEqual({ weapons: ['bow', 'katana'], elements: [] })
        continue
      }
      // Her lead element's answer, or her second's when the lead's is one of her own.
      const lead = rpgElementWeakness(foe.element)
      const answer = own.includes(lead) ? rpgElementWeakness(foe.element2!) : lead
      expect(own).not.toContain(answer)
      expect({ weapons, elements }).toEqual({ weapons: [rpgTwinArm(answer)], elements: [answer] })
    }
    expect(twilight).toBeGreaterThan(0)
  })

  it('gives the sub-boss and the boss v16’s shields (H71: 6 and 8, today’s); regulars, guards and assistants keep theirs', () => {
    expect(rpgFoeShields(15)).toEqual({ subBoss: RPG_FOE_TUNING.subBossShield, boss: RPG_FOE_TUNING.bossShield })
    expect([RPG_FOE_TUNING.subBossShield, RPG_FOE_TUNING.bossShield]).toEqual([6, 8])
    expect(rpgFoeShields(16)).toEqual(RPG_FOE_SHIELDS_V16)
    expect(RPG_FOE_SHIELDS_V16).toEqual({ subBoss: 6, boss: 8 })
    const ranks = new Set<string>()
    v16.forEach((chapter, c) => foesOf(chapter).forEach((foe, k) => {
      const old = foesOf(v15[c]!)[k]!
      ranks.add(foe.rank)
      expect(foe.shield).toBe(foe.rank === 'sub-boss' ? 6 : foe.rank === 'boss' ? 8 : old.shield)
      expect(old.shield).toBe(foe.rank === 'sub-boss' ? 6 : foe.rank === 'boss' ? 8 : old.shield)
    }))
    expect([...ranks].sort()).toEqual(['boss', 'regular', 'sub-boss'])
  })

  it('moves nothing else: v16 and v15 chapters match once weaknesses and shields are set aside', () => {
    const bare = (list: RpgCampaignChapter[]) => list.map((chapter) => ({ ...chapter, nodes: chapter.nodes.map((n) => ({ ...n,
      enemies: n.enemies.map(({ weaknesses: _w, shield: _s, ...rest }) => rest),
      ...(n.waves ? { waves: n.waves.map((wave) => wave.map(({ weaknesses: _w, shield: _s, ...rest }) => rest)) } : {}) })) }))
    expect(bare(v16)).toEqual(bare(v15))
  })

  it('gives the scenario chapters’ foes (the capitals’ source) their twins and Tier 1’s shields too', () => {
    for (let order = 1; order <= 5; order++) {
      const chapter = rpgCampaignChapter({ scenarioId: 1000 + order, name: `Chapter ${order}`, order }, cast, 16)
      for (const foe of foesOf(chapter)) {
        expect(foe.element2).toBeUndefined()
        expect(foe.weaknesses).toEqual(rpgTwinsOf([foe.element], 0))
        if (foe.rank !== 'regular') expect(foe.shield).toBe(foe.rank === 'boss' ? 8 : 6)
      }
    }
  })
})

describe('the foe generators live (H116)', () => {
  it('generate the live engine’s foes by default: v18’s weakness lists', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(18)
    const w1 = worldContinent({ name: 'T', order: 1 })
    for (const region of w1.regions.slice(0, 8)) expect(regionChapter(region, cast)).toEqual(regionChapter(region, cast, 18))
    expect(capitalChapter(w1, cast)).toEqual(capitalChapter(w1, cast, 18))
    expect(rpgCampaignChapter({ scenarioId: 7, name: 'C', order: 2 }, cast)).toEqual(rpgCampaignChapter({ scenarioId: 7, name: 'C', order: 2 }, cast, 18))
    expect(rpgFoeShields()).toEqual(rpgFoeShields(18))
    expect(rpgFoeShields(17)).toEqual(RPG_FOE_SHIELDS_V16)
    const ctx = { tier: 1, runId: 't1-r1', roster: packRoster(), defeated: new Set<string>() }
    for (const front of ['duel', 'horde'] as const) {
      expect(riftFight(ctx, { kind: 'front', front, stage: 3 })).toEqual(riftFight(ctx, { kind: 'front', front, stage: 3 }, 18))
    }
    expect(riftTuning()).toBe(riftTuning(18))
    for (const front of RIFT_FRONTS) expect(RIFT_FRONT_SPECS[front].build).toEqual(riftGuidedBuild(front, 18))
  })
})

describe('v15’s generation, byte for byte (D202)', () => {
  it('keeps Tier 1’s regions and capitals at tier1-foes’ digest with the engine named', () => {
    const parts = TIER1.flatMap((c) => [...c.regions.map((r) => JSON.stringify(regionChapter(r, cast, 15).nodes)),
      JSON.stringify(capitalChapter(c, cast, 15).nodes)])
    expect(parts).toHaveLength(5 * 41)
    expect(fnv1a(parts.join('\n'))).toBe('719d3a73')
  })

  it('keeps every tier’s regions, capitals and scenario chapters as they were before H66', () => {
    const world = chapters(continents(Array.from({ length: 15 }, (_, i) => i + 1)), 15).map((c) => JSON.stringify(c.nodes))
    expect(world).toHaveLength(15 * 41)
    expect(fnv1a(world.join('\n'))).toBe('70bb0d74')
    const scenario = Array.from({ length: 15 }, (_, i) => JSON.stringify(rpgCampaignChapter({ scenarioId: 1000 + i, name: `C${i}`, order: i + 1 }, cast, 15)))
    expect(fnv1a(scenario.join('\n'))).toBe('45b78e29')
  })
})
