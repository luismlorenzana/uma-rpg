// Save v25's migration (H58): `toV25` as written dark, chained by H61 (D188): a v24 save parses through it (and through
// v26's and v27's steps since H72, v28's since H82).
import { describe, expect, it } from 'vitest'
import { rpgNode } from '../rpg/catalog'
import { migrateWorld, toV25, toV26, toV27, toV28, toV29, toV30 } from './migrations'
import { gearV1, parseSave, SAVE_SCHEMA_VERSION, type OwnedUma, type TierWorld } from './save'
import { CLERIC_LOADOUT, CLERIC_TREE, migrated, v24Save, type V24Class } from './v25.fixture'

/** A v24 Uma: her classes in v24's shape. */
type V24Uma = Omit<OwnedUma, 'classes'> & { classes: Partial<Record<string, V24Class>> }
type V24World = Omit<TierWorld, 'umas'> & { umas: Record<string, V24Uma> }
const world = (): V24World => JSON.parse(JSON.stringify(v24Save().tierWorlds['1'])) as V24World
const migrate = (w: V24World): V24World => toV25(w as unknown as Record<string, unknown>) as unknown as V24World
const umaOf = (w: V24World, id: string): V24Uma => w.umas[id]!
const raw = (w: unknown) => w as Record<string, unknown>

describe('save v25’s migration (H58, chained in H61)', () => {
  it('stays chained before v26–v30: a v24 world runs through every later step, a v25 world through v26’s to v30’s', () => {
    expect(SAVE_SCHEMA_VERSION).toBe(30)
    const w24 = world()
    expect(migrateWorld(w24, 24)).toEqual(toV30(toV29(toV28(toV27(toV26(raw(migrate(world()))))))))
    expect(migrateWorld(w24, 25)).toEqual(toV30(toV29(toV28(toV27(toV26(raw(w24)))))))
    // A v24 save parses through v25, v26, v27 and v28.
    const save = v24Save()
    expect(save.schemaVersion).toBe(24)
    const parsed = parseSave(JSON.parse(JSON.stringify(save)))
    expect(parsed.schemaVersion).toBe(30)
    expect(parsed).toEqual(parseSave({ ...(migrated(save, (w) => toV28(toV27(toV26(toV25(w))))) as object), schemaVersion: 28 }))
    expect(Object.keys(parsed.tierWorlds['1']!.umas['103']!.classes).sort()).toEqual(['cleric', 'mage', 'paladin'])
  })

  it('makes a Cleric’s four Arms and a Fire Tome three Tomes and two Arms, and copies her to the Paladin the other way round', () => {
    const after = umaOf(migrate(world()), '103')
    expect(after.classes.cleric).toEqual({ weapons: ['tome-fire', 'tome-light', 'tome-dark', 'greatsword', 'axe'], tree: CLERIC_TREE, loadout: CLERIC_LOADOUT })
    expect(after.classes.paladin!.weapons).toEqual(['greatsword', 'axe', 'bow', 'tome-fire', 'tome-ice'])
    // Her tree renamed, Rebirth and Heavy Transfix included; her Class Rank copied, the others' untouched.
    expect(after.classes.paladin!.tree).toEqual(['paladin-greatsword.1a', 'paladin-axe.2a', 'paladin-tome-light.3b', 'paladin-lance.4b'])
    // The live names (v16's since H72: Valkyrie's Oath moved to her Light 3B, CP37; to v15 it was her Lance 4B).
    expect(rpgNode('cleric-tome-light.3b')!.name).toBe('Rebirth')
    expect(rpgNode('paladin-tome-light.3b')!.name).toBe("Valkyrie's Oath")
    expect(rpgNode('cleric-lance.4b')!.name).toBe('Heavy Transfix')
    expect(rpgNode('paladin-lance.4b')!.name).toBe('Heavy Transfix')
    expect(after.ranks.classes).toEqual({ cleric: { rank: 40, exp: 0 }, mage: { rank: 5, exp: 0 }, paladin: { rank: 40, exp: 0 } })
    expect(after.classes.mage).toEqual(umaOf(world(), '103').classes.mage)
    expect(after.classId).toBe('cleric')
  })

  it('renames her loadout for the Paladin, keeping her Paladin weapons’ skills, Arms first, then Tomes, each in her order', () => {
    // Greatsword, Axe and Bow lead; the Light Tome and Katana skills have no Paladin slot.
    expect(umaOf(migrate(world()), '103').classes.paladin!.loadout).toEqual(['paladin-greatsword.1a', 'paladin-axe.2', 'paladin-bow.3', 'paladin-tome-fire.1'])
    const w = world()
    umaOf(w, '103').classes.cleric!.loadout = null
    expect(umaOf(migrate(w), '103').classes.paladin!.loadout).toBeNull()
  })

  it('fills from v2’s spreads when she has too few of a kind, skipping ones she has', () => {
    const w = world()
    umaOf(w, '103').classes.cleric = { weapons: ['tome-dark', 'tome-ice', 'tome-fire', 'tome-light', 'katana'], tree: [], loadout: null }
    const after = umaOf(migrate(w), '103').classes
    expect(after.cleric!.weapons).toEqual(['tome-dark', 'tome-ice', 'tome-fire', 'katana', 'bow'])
    expect(after.paladin!.weapons).toEqual(['katana', 'greatsword', 'axe', 'tome-dark', 'tome-ice'])
  })

  it('gives an Uma with only Cleric ranks only the rank', () => {
    const after = umaOf(migrate(world()), '105')
    expect(after.ranks.classes).toEqual({ cleric: { rank: 12, exp: 30 }, paladin: { rank: 12, exp: 30 } })
    expect(after.classes).toEqual({})
  })

  it('moves the Chapel’s seats 3–4 to the Bastion’s 1–2 with their Heroes, Learners and Bonds', () => {
    const before = world(), after = migrate(before)
    expect(after.heroes).toEqual({
      'brawler-1': { hero: '111', learners: ['109'] }, 'paladin-1': { hero: '107', learners: ['108', '109'] }, 'paladin-2': { hero: '110', learners: ['108'] },
    })
    expect(umaOf(after, '107').bonds).toEqual({ 'paladin-1': { level: 3, exp: 5 } })
    expect(umaOf(after, '108').bonds).toEqual({ 'paladin-1': { level: 4, exp: 3 }, 'paladin-2': { level: 10, exp: 0 } })
    expect(umaOf(after, '109').bonds).toEqual({ 'paladin-1': { level: 1, exp: 0 }, 'brawler-1': { level: 2, exp: 0 } })
    expect(umaOf(after, '110').bonds).toEqual({ 'paladin-2': { level: 6, exp: 1 } })
    // A taken Bastion seat keeps hers, and the Chapel's stays where it was.
    before.heroes['paladin-1'] = { hero: '112', learners: [] }
    expect(migrate(before).heroes).toMatchObject({ 'cleric-3': { hero: '107' }, 'paladin-1': { hero: '112' }, 'paladin-2': { hero: '110' } })
  })

  it('puts an Orb in the Damage slot and a Talisman or Amulet in the Support slot; a second Orb stays in her locker', () => {
    const after = migrate(world())
    expect(umaOf(after, '105').gear).toEqual({ locker: ['orb-fire-g1', 'orb-ice-g1'], equipped: { 'accessory-1': 'orb-fire-g1' }, kinds: {} })
    expect(gearV1(umaOf(after, '106')).equipped).toEqual({ 'accessory-1': 'orb-greatsword-g1', 'accessory-2': 'amulet-spring-g1' })
    const w = world()
    gearV1(umaOf(w, '106')).equipped = { 'accessory-1': 'amulet-spring-g1', greatsword: 'greatsword-g1' }
    gearV1(umaOf(w, '106')).locker.push('greatsword-g1')
    expect(gearV1(umaOf(migrate(w), '106')).equipped).toEqual({ greatsword: 'greatsword-g1', 'accessory-2': 'amulet-spring-g1' })
  })

  it('leaves a Brawler, the parties, wallets, the Rift runs and both open fights byte for byte', () => {
    const before = world(), after = migrate(before)
    expect(JSON.stringify(umaOf(after, '100'))).toBe(JSON.stringify(umaOf(before, '100')))
    expect(JSON.stringify(after.world)).toBe(JSON.stringify(before.world))
    expect(JSON.stringify(after.rift)).toBe(JSON.stringify(before.rift))
    expect(after.parties).toEqual(before.parties)
    expect(after.wallet).toEqual(before.wallet)
    expect(Object.values(after.umas).map((u) => u.classId)).toEqual(Object.values(before.umas).map((u) => u.classId))
  })

  it('runs once: a second run changes nothing', () => {
    const once = migrate(world())
    expect(migrate(once)).toEqual(once)
  })

  it('leaves anything malformed for the strict parse', () => {
    const w = world() as unknown as Record<string, unknown>
    const umas = w.umas as Record<string, Record<string, unknown>>
    umas['103'] = { ...umas['103'], classes: { cleric: { weapons: ['greatsword', 'spear', 'bow', 'katana', 'tome-fire'], tree: [], loadout: null } } }
    umas['106'] = { ...umas['106'], gear: { locker: [], equipped: { 'accessory-1': 'helm-g1' }, kinds: {} } }
    umas['107'] = 'not an Uma' as unknown as Record<string, unknown>
    const after = toV25(w) as { umas: Record<string, Record<string, unknown>> }
    expect(after.umas['103']!.classes).toEqual(umas['103']!.classes)
    expect(after.umas['106']!.gear).toEqual(umas['106']!.gear)
    expect(after.umas['107']).toBe('not an Uma')
    expect(toV25({ umas: [] })).toEqual({ umas: [] })
  })
})
