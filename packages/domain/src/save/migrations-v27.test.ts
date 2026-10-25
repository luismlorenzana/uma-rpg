// Save v27's migration (H69, D205; class-progression.md §14, CP31): `toV27` as written dark, pure and with the switch at
// today's 15. Not chained: `SAVE_SCHEMA_VERSION` stays 26 and `migrateWorld` never calls it until H72. The parse of what
// it writes, with the switch at 16, is `save-v27.test.ts`'s; here the live parse still reads v26 and refuses v27's keys.
import { describe, expect, it } from 'vitest'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { RPG_BRANCH_B, rpgDefaultWeapons, type RpgClass, type RpgWeapon } from '../rpg/rules'
import { migrateWorld, toV27 } from './migrations'
import { parseSave, SAVE_SCHEMA_VERSION, SaveParseError, type ClassLoadout, type OwnedUma, type TierWorld } from './save'
import { migrated, v26Save, V26_CLASSES } from './v27.fixture'

type Raw = Record<string, unknown>
const world = (): TierWorld => JSON.parse(JSON.stringify(v26Save().tierWorlds['1'])) as TierWorld
const migrate = (w: unknown): TierWorld => toV27(w as Raw) as unknown as TierWorld
const umaOf = (w: TierWorld, id: string): OwnedUma => w.umas[id]!
/** One Uma at a level with one class set up, in a world of her own. */
const one = (level: number, classId: RpgClass, setup: Partial<ClassLoadout> & Raw): TierWorld => {
  const w = world()
  w.umas = { '100': { ...umaOf(w, '100'), level, classes: { [classId]: setup } } }
  return w
}
const BRAWLER_ARMS: RpgWeapon[] = ['greatsword', 'axe', 'lance', 'bow', 'katana']

describe('save v27’s migration (H69), dark', () => {
  it('is written but not chained: v26 stays the live version and the chain never runs it', () => {
    expect([SAVE_SCHEMA_VERSION, BATTLE_ENGINE_VERSION]).toEqual([26, 15])
    const raw = world() as unknown as Raw
    expect(migrateWorld(raw, 26)).toBe(raw)
    expect(migrateWorld(raw, 25)).not.toHaveProperty('umas.100.calling')
  })

  it('moves §14’s worked Brawler to her three defaults, her sides to lines and her loadout to what she still holds', () => {
    const w = one(50, 'brawler', { weapons: BRAWLER_ARMS, tree: ['brawler-greatsword.4b', 'brawler-lance.3a', 'brawler-katana.2a', 'brawler-axe.3a'],
      loadout: ['brawler-greatsword.5b', 'brawler-axe.3a', 'brawler-katana.5', 'brawler-greatsword.2'] })
    // The Lance's and the Katana's B lines are the catalog's `a`, at any depth; the Axe's `a` is not its B.
    expect([RPG_BRANCH_B.brawler.lance, RPG_BRANCH_B.brawler.katana, RPG_BRANCH_B.brawler.axe, RPG_BRANCH_B.brawler.greatsword]).toEqual(['a', 'a', 'b', 'b'])
    expect(umaOf(migrate(w), '100').classes.brawler).toEqual({
      weapons: ['greatsword', 'axe', 'lance'], lines: { greatsword: 'B', lance: 'B', katana: 'B' }, loadout: ['brawler-greatsword.5b', 'brawler-greatsword.2'],
    })
    expect(Object.keys(umaOf(migrate(w), '100').classes.brawler!)).toEqual(['weapons', 'lines', 'loadout'])
  })

  it('gives every class its owner’s defaults, in slot order', () => {
    for (const classId of ['brawler', 'mage', 'spellblade', 'summoner', 'paladin', 'cleric'] as const) {
      const w = one(1, classId, { weapons: [], tree: [], loadout: null })
      expect(umaOf(migrate(w), '100').classes[classId]).toEqual({ weapons: rpgDefaultWeapons(classId, 16), lines: {}, loadout: null })
    }
  })

  it('sends a Mage’s loadout of only side skills back to auto', () => {
    const after = umaOf(migrate(world()), '101').classes.mage!
    expect(V26_CLASSES[101]!.mage!.loadout).toEqual(['mage-tome-fire.3b', 'mage-tome-ice.2a'])
    // The Fire Tome's 3B is not its B line (Wave is `a`), so it stays on A; any `a` on the Ice Tome is its B.
    expect(after).toEqual({ weapons: ['tome-fire', 'tome-ice', 'tome-lightning'], lines: { 'tome-ice': 'B' }, loadout: null })
  })

  it('keeps at most a Lv 9 Uma’s three slots, and a Lv 15 one’s four of v15’s five', () => {
    const lv9 = one(9, 'brawler', { weapons: BRAWLER_ARMS, tree: [],
      loadout: ['brawler-axe.2', 'brawler-greatsword.1', 'brawler-bow.1', 'brawler-axe.1', 'brawler-greatsword.1', 'brawler-lance.1', 'brawler-lance.2'] })
    // Her Bow isn't one of her three; Greatsword 1 is kept once.
    expect(umaOf(migrate(lv9), '100').classes.brawler!.loadout).toEqual(['brawler-axe.2', 'brawler-greatsword.1', 'brawler-axe.1'])
    expect(umaOf(migrate(world()), '105').classes.brawler!.loadout).toEqual(['brawler-greatsword.1', 'brawler-axe.1', 'brawler-lance.1', 'brawler-greatsword.2'])
    const lv40 = one(40, 'brawler', { weapons: BRAWLER_ARMS, tree: [], loadout: ['brawler-greatsword.1', 'brawler-axe.1', 'brawler-lance.1', 'brawler-greatsword.2',
      'brawler-axe.2', 'brawler-lance.2', 'brawler-greatsword.3', 'brawler-axe.3', 'brawler-lance.3', 'brawler-greatsword.4'] })
    expect(umaOf(migrate(lv40), '100').classes.brawler!.loadout).toHaveLength(7)
  })

  it('puts a Spell Blade with her Katana 4B on B and keeps it equipped', () => {
    expect(umaOf(migrate(world()), '102').classes.spellblade).toEqual({
      weapons: ['katana', 'lance', 'tome-lightning'], lines: { katana: 'B' }, loadout: ['spellblade-katana.4b', 'spellblade-lance.1'],
    })
    // Her crafted Katana stays equipped on its kind.
    expect(umaOf(migrate(world()), '102').gear).toEqual(umaOf(world(), '102').gear)
  })

  it('keeps a Paladin’s Light 3B (Valkyrie’s Oath from v16) and drops her Lance 4B, whose Lance she no longer slots', () => {
    const after = umaOf(migrate(world()), '103').classes.paladin!
    expect(after).toEqual({ weapons: ['greatsword', 'axe', 'tome-light'], lines: { lance: 'B', 'tome-light': 'B' },
      loadout: ['paladin-tome-light.3b', 'paladin-greatsword.3'] })
  })

  it('touches no class she hasn’t set up, and adds every Uma’s calling, the pre-selection unconfirmed', () => {
    const before = world(), after = migrate(world())
    expect(umaOf(after, '106').classes).toEqual({})
    for (const [id, uma] of Object.entries(after.umas)) {
      expect(uma.calling).toEqual({ pick: null, confirmed: false })
      const { calling: _, classes: c, ...rest } = uma
      const { classes: b, ...was } = umaOf(before, id)
      // Nothing else of hers moves: her class, level, ranks, gear, stars, Bonds.
      expect(rest).toEqual(was)
      expect(Object.keys(c)).toEqual(Object.keys(b))
    }
    // A calling already there is kept.
    const set = world()
    umaOf(set, '107').calling = { pick: 'mage', confirmed: true }
    expect(umaOf(migrate(set), '107').calling).toEqual({ pick: 'mage', confirmed: true })
  })

  it('is idempotent and leaves a v27 class untouched', () => {
    const once = migrate(world())
    expect(migrate(JSON.parse(JSON.stringify(once)))).toEqual(once)
    const v27 = one(30, 'brawler', { weapons: ['greatsword', 'bow', 'katana'], lines: { bow: 'B' }, loadout: ['brawler-bow.3b'] })
    expect(umaOf(migrate(v27), '100').classes.brawler).toEqual({ weapons: ['greatsword', 'bow', 'katana'], lines: { bow: 'B' }, loadout: ['brawler-bow.3b'] })
  })

  it('leaves the open world-map and Rift fights, parties, wallets and the rest of the world byte for byte', () => {
    const before = world(), after = migrate(world())
    expect(JSON.stringify(after.world)).toBe(JSON.stringify(before.world))
    expect(JSON.stringify(after.rift)).toBe(JSON.stringify(before.rift))
    const { umas: _a, ...rest } = after
    const { umas: _b, ...was } = before
    expect(rest).toEqual(was)
    // The input is not changed in place.
    const raw = world()
    const copy = JSON.stringify(raw)
    migrate(raw)
    expect(JSON.stringify(raw)).toBe(copy)
  })

  it('leaves anything malformed for the strict parse', () => {
    const w = one(50, 'brawler', { weapons: BRAWLER_ARMS, tree: ['brawler-greatsword.4b', 7] as unknown as string[], loadout: null })
    expect(umaOf(migrate(w), '100').classes.brawler).toEqual(umaOf(w, '100').classes.brawler)
    const notObject = world()
    ;(umaOf(notObject, '100').classes as Raw).brawler = 'brawler'
    expect((umaOf(migrate(notObject), '100').classes as Raw).brawler).toBe('brawler')
    const badLoadout = one(50, 'brawler', { weapons: BRAWLER_ARMS, tree: [], loadout: 'auto' as unknown as null })
    expect(umaOf(migrate(badLoadout), '100').classes.brawler).toMatchObject({ weapons: ['greatsword', 'axe', 'lance'], loadout: 'auto' })
    const unknownClass = one(50, 'wizard' as RpgClass, { weapons: BRAWLER_ARMS, tree: [], loadout: null })
    expect((umaOf(migrate(unknownClass), '100').classes as Raw).wizard).toEqual({ weapons: BRAWLER_ARMS, tree: [], loadout: null })
    const oddUma = world()
    ;(oddUma.umas as Raw)['100'] = 'nobody'
    expect((migrate(oddUma).umas as Raw)['100']).toBe('nobody')
    expect(toV27({ umas: 'none' })).toEqual({ umas: 'none' })
  })
})

describe('the live parse with the switch at 15 (today)', () => {
  it('parses the v26 save as it is, five weapons and sides, and refuses v27’s keys', () => {
    const save = v26Save()
    const parsed = parseSave(JSON.parse(JSON.stringify(save)))
    expect(parsed).toEqual(save)
    expect(parsed.tierWorlds['1']!.umas['100']!.classes.brawler!.weapons).toHaveLength(5)
    const withLines = migrated(save, (w) => {
      const umas = w.umas as Record<string, Raw>
      umas['104'] = { ...umas['104'], classes: { summoner: { weapons: ['tome-fire', 'tome-ice', 'tome-lightning', 'greatsword', 'lance'], tree: [], lines: {}, loadout: null } } }
      return w
    })
    expect(() => parseSave(withLines)).toThrow(SaveParseError)
    expect(() => parseSave(withLines)).toThrow(/umas\.104\.classes\.summoner: unknown keys lines/)
    expect(() => parseSave(migrated(save, toV27))).toThrow(/umas\.100: unknown keys calling/)
  })
})
