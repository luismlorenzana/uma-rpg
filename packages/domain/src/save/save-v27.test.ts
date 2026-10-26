// Save v27 (H69, D205), live from H72 (D210) to H82 (D218; R1's packets ran this file with the switch mocked to 16). A v26
// save parses through the chain (three weapons, `lines`, `calling`, then v28's grades) and its open v15 fights replay to
// their frozen ends; the same world labelled v27 (so the chain skips `toV27`) doesn't.
import { describe, expect, it } from 'vitest'
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/caps'
import { replayV15 } from '../rpg/battle/v15-replays.fixture'
import { RPG_WEAPON_SLOTS } from '../rpg/rules'
import { toV27 } from './migrations'
import { gearV1, parseSave, SAVE_SCHEMA_VERSION, SaveParseError } from './save'
import { migrated, v15Replay, v26Save, V27_RIFT_FIGHT, V27_WORLD_FIGHT } from './v27.fixture'

type Raw = Record<string, unknown>
/** The fixture through `toV27`, as JSON labelled v27 (so the chain leaves it), with one Uma's raw record changed. */
function editedUma(id: string, change: (uma: Raw) => void): unknown {
  return { ...(migrated(v26Save(), (w) => {
    const next = toV27(w)
    change((next.umas as Record<string, Raw>)[id]!)
    return next
  }) as Raw), schemaVersion: 27 }
}

describe('save v27 (H69, live since H72)', () => {
  it('runs with the Tier rework’s fight and economy live and the save v29 (D221)', () => {
    expect([BATTLE_ENGINE_VERSION, rpgRework('fight'), RPG_WEAPON_SLOTS, SAVE_SCHEMA_VERSION]).toEqual([17, true, 3, 29])
  })

  it('parses a v26 world through the chain: three weapons, lines and every Uma’s calling', () => {
    expect(parseSave(JSON.parse(JSON.stringify(v26Save())))).toEqual(parseSave(migrated(v26Save(), toV27)))
    const world = parseSave(JSON.parse(JSON.stringify(v26Save()))).tierWorlds['1']!
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
    // Her crafted Katana went with v28's grades (H82): it is the grant's one piece.
    expect(world.umas['102']!.gear).toEqual({ weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] })
    expect(world.grant!.deleted.gear).toBe(1)
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

  it('refuses the same world unmigrated (labelled v27, so the chain skips it), on its five weapons', () => {
    const unmigrated = { ...JSON.parse(JSON.stringify(v26Save())), schemaVersion: 27 }
    expect(() => parseSave(unmigrated)).toThrow(SaveParseError)
    expect(() => parseSave(unmigrated)).toThrow(/umas\.100\.classes\.brawler\.weapons: not three weapons a brawler can wield/)
  })

  it('refuses a v27 class with a tree, and a v27 Uma without her calling', () => {
    expect(() => parseSave(editedUma('104', (u) => { (u.classes as Record<string, Raw>).summoner!.tree = [] })))
      .toThrow(/umas\.104\.classes\.summoner: unknown keys tree/)
    expect(() => parseSave(editedUma('104', (u) => { delete u.calling }))).toThrow(/umas\.104\.calling: expected an object/)
    expect(() => parseSave(editedUma('104', (u) => { u.calling = { pick: null, confirmed: false, at: 1 } }))).toThrow(/umas\.104\.calling: unknown keys at/)
  })

  it('refuses a calling pick of a class no row picks, and a confirmed flag that isn’t one', () => {
    expect(() => parseSave(editedUma('104', (u) => { u.calling = { pick: 'brawler', confirmed: false } }))).toThrow(/umas\.104\.calling\.pick/)
    expect(() => parseSave(editedUma('104', (u) => { u.calling = { pick: 'summoner', confirmed: true } }))).toThrow(/umas\.104\.calling\.pick/)
    expect(() => parseSave(editedUma('104', (u) => { u.calling = { pick: 'mage', confirmed: 'yes' } }))).toThrow(/umas\.104\.calling\.confirmed/)
    for (const pick of [null, 'spellblade', 'mage', 'paladin', 'cleric']) {
      expect(parseSave(editedUma('104', (u) => { u.calling = { pick, confirmed: true } })).tierWorlds['1']!.umas['104']!.calling).toEqual({ pick, confirmed: true })
    }
  })

  it('reads lines only as B on her class’s kinds, and a loadout only on her path in her three trees, within v16’s slots', () => {
    const setup = (lines: unknown, loadout: unknown, weapons: unknown = ['greatsword', 'axe', 'lance']) =>
      editedUma('100', (u) => { (u.classes as Record<string, Raw>).brawler = { weapons, lines, loadout } })
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
