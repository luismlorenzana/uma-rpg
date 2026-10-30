// Save v27 (H69, D205), live from H72 (D210) to H82 (D218; R1's packets ran this file with the switch mocked to 16). A v26
// save parses through the chain (three weapons, `lines`, `calling`, then v28's grades, and since H134 v32's reset, which
// clears the setups and the calling into its record) and its open v15 fights replay to their frozen ends. v27's class
// setup (three weapons, lines, a loadout on her path) is still save v32's: its refusals are read on the live save.
import { describe, expect, it } from 'vitest'
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/caps'
import { replayV15 } from '../rpg/battle/v15-replays.fixture'
import { rpgDefaultWeapons, RPG_WEAPON_SLOTS } from '../rpg/rules'
import { toV27, toV28, toV29, toV30, toV31 } from './migrations'
import { gearV1, parseSave, SAVE_SCHEMA_VERSION, SaveParseError, type TierWorld } from './save'
import { migrated, v15Replay, v26Save, V27_RIFT_FIGHT, V27_WORLD_FIGHT } from './v27.fixture'

type Raw = Record<string, unknown>
/** The fixture through `toV27`, as JSON labelled v27 (so the chain leaves `toV27` out), with one Uma's raw record changed. */
function editedUma(id: string, change: (uma: Raw) => void): unknown {
  return { ...(migrated(v26Save(), (w) => {
    const next = toV27(w)
    change((next.umas as Record<string, Raw>)[id]!)
    return next
  }) as Raw), schemaVersion: 27 }
}
/** The fixture parsed through the chain to v32 and written back (labelled v32, so no step runs), with one Uma changed. */
function editedV32Uma(id: string, change: (uma: Raw) => void): unknown {
  const save = JSON.parse(JSON.stringify(parseSave(JSON.parse(JSON.stringify(v26Save()))))) as { tierWorlds: Record<string, { umas: Record<string, Raw> }> }
  change(save.tierWorlds['1']!.umas[id]!)
  return save
}

describe('save v27 (H69, live since H72)', () => {
  it('runs with the Tier rework’s fight and economy live, Classes v3 (H134) and the save v34', () => {
    expect([BATTLE_ENGINE_VERSION, rpgRework('fight'), RPG_WEAPON_SLOTS, SAVE_SCHEMA_VERSION]).toEqual([20, true, 3, 34])
  })

  it('parses a v26 world through the chain: three weapons, lines and every Uma’s calling, which v32 records and resets', () => {
    expect(parseSave(JSON.parse(JSON.stringify(v26Save())))).toEqual(parseSave(migrated(v26Save(), toV27)))
    // What toV27 wrote, carried by v28–v31's steps: her v31 world, before v32's reset.
    const raw = JSON.parse(JSON.stringify(v26Save().tierWorlds['1'])) as Raw
    const world = toV31(toV30(toV29(toV28(toV27(raw))))) as unknown as TierWorld
    expect(world.umas['100']!.classes.brawler).toEqual({ weapons: ['greatsword', 'axe', 'lance'], lines: { greatsword: 'B', lance: 'B', katana: 'B' },
      loadout: ['brawler-greatsword.5b', 'brawler-greatsword.2'] })
    expect(world.umas['101']!.classes.mage).toEqual({ weapons: ['tome-fire', 'tome-ice', 'tome-lightning'], lines: { 'tome-ice': 'B' }, loadout: null })
    expect(world.umas['102']!.classes.spellblade).toEqual({ weapons: ['katana', 'lance', 'tome-lightning'], lines: { katana: 'B' },
      loadout: ['spellblade-katana.4b', 'spellblade-lance.1'] })
    expect(world.umas['103']!.classes.paladin).toEqual({ weapons: ['greatsword', 'axe', 'tome-light'], lines: { lance: 'B', 'tome-light': 'B' },
      loadout: ['paladin-tome-light.3b', 'paladin-greatsword.3'] })
    expect(world.umas['104']!.classes.summoner).toEqual({ weapons: ['tome-dark', 'tome-light', 'bow'], lines: {}, loadout: null })
    expect(world.umas['105']!.classes.brawler!.loadout).toHaveLength(4)
    for (const uma of Object.values(world.umas)) {
      expect(uma.calling).toEqual({ pick: null, confirmed: false })
      for (const setup of Object.values(uma.classes)) expect(setup.weapons).toHaveLength(3)
    }
    // The parse ends at v32: every setup reset, her class and ranks in the record, no calling.
    const parsed = parseSave(JSON.parse(JSON.stringify(v26Save()))).tierWorlds['1']!
    for (const [id, uma] of Object.entries(parsed.umas)) {
      expect(uma).toMatchObject({ classId: null, classes: {} })
      expect('calling' in uma).toBe(false)
      expect(parsed.classesV3!.umas[id]).toMatchObject({ classId: world.umas[id]!.classId, ranks: world.umas[id]!.ranks.classes, pick: null })
    }
    // Her crafted Katana went with v28's grades (H82): it is the grant's one piece.
    expect(parsed.umas['102']!.gear).toEqual({ weapons: {}, armor: {}, accessories: Array(3).fill({ grade: 0, family: null, form: 'base' }) })
    expect(parsed.grant!.deleted.gear).toBe(1)
    // Written back and read again, the world is the same.
    const save = parseSave(migrated(v26Save(), toV27))
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })

  it('keeps both open fights as they were, and they replay on engine v15 to the frozen ends', () => {
    const before = v26Save().tierWorlds['1']!
    const world = parseSave(migrated(v26Save(), toV27)).tierWorlds['1']!
    expect(world.world.run.battle).toEqual(before.world.run.battle)
    expect(world.rift.battle).toEqual(before.rift.battle)
    for (const [battle, spec] of [[world.world.run.battle!, V27_WORLD_FIGHT], [world.rift.battle!, V27_RIFT_FIGHT]] as const) {
      expect(battle.input.version).toBe(15)
      expect(replayV15(battle.input, battle.actions)).toMatchObject({ outcome: 'active' })
      const frozen = v15Replay(spec.name)
      const rest = frozen.actions.slice(spec.actions)
      expect(replayV15(battle.input, [...battle.actions, ...rest])).toEqual({ outcome: frozen.outcome, rounds: frozen.rounds, hash: frozen.hash, cues: frozen.cues,
        cueDigest: frozen.cueDigest })
    }
  })

  it('reads the same world unmigrated (labelled v27, so the chain skips toV27) only as v32’s reset; a live setup of five weapons is refused', () => {
    const unmigrated = { ...JSON.parse(JSON.stringify(v26Save())), schemaVersion: 27 }
    // The chain leaves her five weapons to v32's reset, which clears every setup.
    expect(parseSave(unmigrated).tierWorlds['1']!.umas['100']).toMatchObject({ classId: null, classes: {} })
    // On a v32 save, a v26 class that missed toV27 still fails on its five weapons.
    const v26Brawler = JSON.parse(JSON.stringify(v26Save().tierWorlds['1']!.umas['100']!.classes.brawler)) as Raw
    const five = editedV32Uma('100', (u) => { u.classes = { brawler: v26Brawler } })
    expect(() => parseSave(five)).toThrow(SaveParseError)
    expect(() => parseSave(five)).toThrow(/umas\.100\.classes\.brawler\.weapons: not three weapons a brawler can wield/)
  })

  it('refuses a class with a tree, and from v32 an Uma with a calling', () => {
    const summoner = { weapons: rpgDefaultWeapons('summoner'), lines: {}, loadout: null }
    expect(() => parseSave(editedV32Uma('104', (u) => { u.classes = { summoner: { ...summoner, tree: [] } } })))
      .toThrow(/umas\.104\.classes\.summoner: unknown keys tree/)
    expect(() => parseSave(editedV32Uma('104', (u) => { u.classes = { summoner } }))).not.toThrow()
    expect(() => parseSave(editedV32Uma('104', (u) => { u.calling = { pick: null, confirmed: false } }))).toThrow(/umas\.104: unknown keys calling/)
  })

  it('carries a v27 calling pick a row picks into v32’s record, and no other', () => {
    for (const pick of ['spellblade', 'mage', 'paladin', 'cleric']) {
      expect(parseSave(editedUma('104', (u) => { u.calling = { pick, confirmed: true } })).tierWorlds['1']!.classesV3!.umas['104']!.pick).toBe(pick)
    }
    for (const calling of [{ pick: null, confirmed: true }, { pick: 'brawler', confirmed: false }, { pick: 'summoner', confirmed: true }, 'mage']) {
      expect(parseSave(editedUma('104', (u) => { u.calling = calling })).tierWorlds['1']!.classesV3!.umas['104']!.pick).toBeNull()
    }
  })

  it('reads lines only as B on her class’s kinds, and a loadout only on her path in her three trees, within v16’s slots', () => {
    const setup = (lines: unknown, loadout: unknown, weapons: unknown = ['greatsword', 'axe', 'lance']) =>
      editedV32Uma('100', (u) => { (u.classes as Record<string, Raw>).brawler = { weapons, lines, loadout } })
    // Any kind of her class, slotted or not; A is absence.
    expect(() => parseSave(setup({ bow: 'B', katana: 'B' }, null))).not.toThrow()
    expect(() => parseSave(setup({ greatsword: 'A' }, null))).toThrow(/classes\.brawler\.lines/)
    expect(() => parseSave(setup({ 'tome-fire': 'B' }, null))).toThrow(/classes\.brawler\.lines/)
    expect(() => parseSave(setup(['greatsword'], null))).toThrow(/classes\.brawler\.lines/)
    expect(() => parseSave(setup(undefined, null))).toThrow(/classes\.brawler\.lines/)
    // Her three weapons by slot position (a Brawler's are all Arms) and three only.
    expect(() => parseSave(setup({}, null, ['greatsword', 'axe']))).toThrow(/not three weapons/)
    expect(() => parseSave(setup({}, null, ['greatsword', 'axe', 'tome-fire']))).toThrow(/not three weapons/)
    // The trunk either way, depths 3–5 on her line, her three trees only.
    expect(() => parseSave(setup({ greatsword: 'B' }, ['brawler-greatsword.2', 'brawler-greatsword.5b', 'brawler-axe.4']))).not.toThrow()
    expect(() => parseSave(setup({ greatsword: 'B' }, ['brawler-greatsword.5']))).toThrow(/classes\.brawler\.loadout/)
    expect(() => parseSave(setup({}, ['brawler-greatsword.5b']))).toThrow(/classes\.brawler\.loadout/)
    expect(() => parseSave(setup({}, ['brawler-greatsword.2a']))).toThrow(/classes\.brawler\.loadout/)
    expect(() => parseSave(setup({ bow: 'B' }, ['brawler-bow.3b']))).toThrow(/classes\.brawler\.loadout/)
    expect(() => parseSave(setup({}, ['mage-tome-fire.1']))).toThrow(/classes\.brawler\.loadout/)
    // A Lv 50 Uma has seven slots from v16 (ten to v15).
    const eight = ['greatsword', 'axe', 'lance'].flatMap((w) => [1, 2, 3].map((d) => `brawler-${w}.${d}`)).slice(0, 8)
    expect(() => parseSave(setup({}, eight))).toThrow(/classes\.brawler\.loadout: expected at most 7 ids/)
    expect(() => parseSave(setup({}, eight.slice(0, 7)))).not.toThrow()
  })
})
