// Save v25 with the switch on (H58; live since H61, D188): a v24 world `toV25` produced parses under classes v2's live
// lists (six classes, 24 seats), through the chain's later steps to v27 since H72 (D210) and v28 since H82 (D218), and its
// open v14 fights replay; the same world labelled v25 skips `toV25`. The chain itself is `migrations-v25.test.ts`'s.
import { describe, expect, it } from 'vitest'
import { replayV14 } from '../rpg/battle/v14-replays.fixture'
import { HERO_LIMIT_IDS } from '../rpg/hero-id'
import { RPG_ALL_CLASSES, RPG_CLASSES } from '../rpg/kinds'
import { healerBlock, type BattleOutfit } from './battle'
import { toV25 } from './migrations'
import { gearV1, parseSave, SaveParseError } from './save'
import { migrated, v14Replay, v24Save, V25_RIFT_FIGHT, V25_WORLD_FIGHT } from './v25.fixture'


/** Every Uma of the fixture as a Late surger: the class of one who never picked is her style's, the Cleric. */
const OUTFITS: ReadonlyMap<string, BattleOutfit> = new Map(Array.from({ length: 20 }, (_, i) => `${100 + i}`).map((id) => [id, {
  outfitId: id, baseStats: { speed: 100, stamina: 100, power: 120, guts: 100, wit: 100 },
  growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 }, aptitudes: { strategy: { front: 'G', pace: 'G', late: 'A', end: 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } },
}]))

describe('save v25 with the switch on (H58)', () => {
  it('runs with classes v2’s live lists', () => {
    expect(RPG_CLASSES).toEqual(RPG_ALL_CLASSES)
    expect(HERO_LIMIT_IDS).toHaveLength(24)
  })

  it('parses a v24 world run through toV25: the Paladin and the Bastion’s seats (then v27’s classes and v28’s grades)', () => {
    const save = parseSave(migrated(v24Save(), toV25))
    const world = save.tierWorlds['1']!
    expect(Object.keys(world.umas['103']!.classes).sort()).toEqual(['cleric', 'mage', 'paladin'])
    // toV25's Paladin (`migrations-v25.test.ts`), then toV27's three and lines: her Light 3B and Lance 4B put both on B, and
    // only her Axe 2 of the renamed loadout is on her path in her three.
    expect(world.umas['103']!.classes.paladin).toEqual({ weapons: ['greatsword', 'axe', 'tome-light'], lines: { lance: 'B', 'tome-light': 'B' },
      loadout: ['paladin-axe.2'] })
    expect(world.umas['103']!.ranks.classes.paladin).toEqual({ rank: 40, exp: 0 })
    expect(world.heroes['paladin-1']).toEqual({ hero: '107', learners: ['108', '109'] })
    expect(world.heroes['paladin-2']).toEqual({ hero: '110', learners: ['108'] })
    expect(world.heroes['cleric-3']).toBeUndefined()
    expect(world.umas['108']!.bonds).toEqual({ 'paladin-1': { level: 4, exp: 3 }, 'paladin-2': { level: 10, exp: 0 } })
    // toV25's typed accessories (`migrations-v25.test.ts`) are gone with v28's grades: their pieces are in the grant.
    expect(world.umas['105']!.gear).toEqual({ weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] })
    expect(world.grant!.deleted.gear).toBeGreaterThan(0)
    // Party 1 keeps its two Clerics: they can't fight together until one changes class.
    expect(world.parties[1]!.slots).toEqual(['105', '111', '112', '113', '114'])
    expect(healerBlock(world, world.parties[1]!.slots as string[], OUTFITS)).toBe('One healer a party')
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
    expect(Object.keys(parseSave(unmigrated).tierWorlds['1']!.umas['103']!.classes).sort()).toEqual(['cleric', 'mage'])
  })
})
