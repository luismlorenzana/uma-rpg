// Save v25 with the switch on (H58; live since H61, D188): a v24 world `toV25` produced parses through the chain's later
// steps to v27 since H72 (D210), v28 since H82 (D218) and v32's reset since H134, and its open v14 fights replay; the same
// world labelled v25 skips `toV25`. What `toV25` set up is read on the steps' v31 world, before v32 resets the classes and
// merges the Healer seats. The chain itself is `migrations-v25.test.ts`'s.
import { describe, expect, it } from 'vitest'
import { replayV14 } from '../rpg/battle/v14-replays.fixture'
import { HERO_LIMIT_IDS } from '../rpg/hero-id'
import { RPG_CLASSES, rpgClasses } from '../rpg/kinds'
import { healerBlock, type BattleOutfit } from './battle'
import { toV25, toV26, toV27, toV28, toV29, toV30, toV31 } from './migrations'
import { gearV1, parseSave, SaveParseError, type TierWorld } from './save'
import { migrated, v14Replay, v24Save, V25_RIFT_FIGHT, V25_WORLD_FIGHT } from './v25.fixture'


/** Every Uma of the fixture as a Late surger: the class of one who never picked is her style's, the Cleric. */
const OUTFITS: ReadonlyMap<string, BattleOutfit> = new Map(Array.from({ length: 20 }, (_, i) => `${100 + i}`).map((id) => [id, {
  outfitId: id, baseStats: { speed: 100, stamina: 100, power: 120, guts: 100, wit: 100 },
  growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 }, aptitudes: { strategy: { front: 'G', pace: 'G', late: 'A', end: 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } },
}]))
/** Tier 1's world of the v24 save through `toV25` and every step to v31: what v32's reset reads. */
const v31World = (): TierWorld => {
  const w = JSON.parse(JSON.stringify(v24Save().tierWorlds['1'])) as Record<string, unknown>
  return toV31(toV30(toV29(toV28(toV27(toV26(toV25(w))))))) as unknown as TierWorld
}

describe('save v25 with the switch on (H58)', () => {
  it('runs with Classes v3’s live lists (H134): thirteen classes, sixteen seats', () => {
    expect(RPG_CLASSES).toEqual(rpgClasses(19))
    expect(RPG_CLASSES).toHaveLength(13)
    expect(HERO_LIMIT_IDS).toHaveLength(16)
  })

  it('parses a v24 world run through toV25: the Paladin and the Bastion’s seats (then v27’s classes, v28’s grades and v32’s reset)', () => {
    // toV25's Paladin (`migrations-v25.test.ts`), then toV27's three and lines: her Light 3B and Lance 4B put both on B, and
    // only her Axe 2 of the renamed loadout is on her path in her three. That is her v31 setup, which v32 resets.
    const v31 = v31World()
    expect(Object.keys(v31.umas['103']!.classes).sort()).toEqual(['cleric', 'mage', 'paladin'])
    expect(v31.umas['103']!.classes.paladin).toEqual({ weapons: ['greatsword', 'axe', 'tome-light'], lines: { lance: 'B', 'tome-light': 'B' },
      loadout: ['paladin-axe.2'] })
    const save = parseSave(migrated(v24Save(), toV25))
    const world = save.tierWorlds['1']!
    // v32's record keeps her Cleric and the Paladin's copied rank; her setups are reset.
    expect(world.classesV3!.umas['103']).toMatchObject({ classId: 'cleric', ranks: { paladin: { rank: 40, exp: 0 } } })
    expect(world.umas['103']).toMatchObject({ classId: null, classes: {} })
    // The Bastion's seats 1–2 (the Chapel's 3–4 moved by toV25) are the Healer Sanctum's 1–2 since v32's merge.
    expect(world.heroes['healer-1']).toEqual({ hero: '107', learners: ['108', '109'] })
    expect(world.heroes['healer-2']).toEqual({ hero: '110', learners: ['108'] })
    expect(Object.keys(world.heroes).filter((id) => /^(paladin|cleric)-/.test(id))).toEqual([])
    expect(world.umas['108']!.bonds).toEqual({ 'healer-1': { level: 4, exp: 3 }, 'healer-2': { level: 10, exp: 0 } })
    // toV25's typed accessories (`migrations-v25.test.ts`) are gone with v28's grades: their pieces are in the grant.
    expect(world.umas['105']!.gear).toEqual({ weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] })
    expect(world.grant!.deleted.gear).toBeGreaterThan(0)
    // Party 1 keeps its two Clerics: on v18's rules they can't fight together until one changes class; v32's reset sends
    // both to their Tier 0, which is no healer.
    expect(world.parties[1]!.slots).toEqual(['105', '111', '112', '113', '114'])
    expect(healerBlock(v31, v31.parties[1]!.slots as string[], OUTFITS, 18)).toBe('One healer a party')
    expect(healerBlock(world, world.parties[1]!.slots as string[], OUTFITS)).toBeNull()
  })

  it('keeps both open fights as they were, and they replay on engine v14 to the frozen ends', () => {
    const before = v24Save().tierWorlds['1']!
    const world = parseSave(migrated(v24Save(), toV25)).tierWorlds['1']!
    expect(world.world.run.battle).toEqual(before.world.run.battle)
    expect(world.rift.battle).toEqual(before.rift.battle)
    for (const [battle, spec] of [[world.world.run.battle!, V25_WORLD_FIGHT], [world.rift.battle!, V25_RIFT_FIGHT]] as const) {
      expect(battle.input.version).toBe(14)
      expect(replayV14(battle.input, battle.actions)).toMatchObject({ outcome: 'active' })
      expect(replayV14(battle.input, battle.actions).error).toBeUndefined()
      // Played on with the frozen fight's remaining actions, it ends exactly as it did on the engine before classes v2.
      const frozen = v14Replay(spec.name)
      const rest = frozen.actions.slice(spec.actions)
      expect(replayV14(battle.input, [...battle.actions, ...rest])).toEqual({ outcome: frozen.outcome, rounds: frozen.rounds, hash: frozen.hash, cues: frozen.cues, cueDigest: frozen.cueDigest })
    }
  })

  it('skips toV25 on the same world labelled v25: no Paladin copy of the Cleric (its accessory moves v28 resets either way)', () => {
    const unmigrated = { ...JSON.parse(JSON.stringify(v24Save())), schemaVersion: 25 }
    // v32's record keeps her v31 ranks: no Paladin rank copied.
    expect(Object.keys(parseSave(unmigrated).tierWorlds['1']!.classesV3!.umas['103']!.ranks).sort()).toEqual(['cleric', 'mage'])
  })
})
