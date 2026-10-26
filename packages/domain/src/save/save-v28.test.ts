// Save v28's strict parse and new saves (H78; R2's build decision 7), live since H82 (D218): the rich v27 save through
// `toV28` parses and its open v15 fights replay to their frozen ends; unmigrated, it doesn't; a v28 world's rules are
// refused one by one; a new save is v28's and round-trips.
import { describe, expect, it } from 'vitest'
import { replayV15 } from '../rpg/battle/v15-replays.fixture'
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/caps'
import { toV28 } from './migrations'
import { markGrantSeen, unlockUma } from './rules'
import { newSave, parseSave, SaveParseError, type Save } from './save'
import { richV27Save } from './v28.fixture'
import { v15Replay, V27_RIFT_FIGHT, V27_WORLD_FIGHT } from './v27.fixture'


type Raw = Record<string, unknown>
type RawWorld = Raw & { umas: Record<string, Raw>; items: Record<string, number> }
/** The rich save with every world through `toV28`, still labelled v27 (H82 bumps it), and `change` on Tier 1's world. */
function v28Save(change: (world: RawWorld) => void = () => {}): Raw {
  const raw = richV27Save()
  const tierWorlds = Object.fromEntries(Object.entries(raw.tierWorlds).map(([k, w]) => [k, toV28(w, Number(k))]))
  change(tierWorlds['1'] as RawWorld)
  return JSON.parse(JSON.stringify({ ...raw, tierWorlds })) as Raw
}

describe('save v28\'s parse (H78), the economy stage live', () => {
  it('runs with R2\'s economy live in this file', () => {
    expect([BATTLE_ENGINE_VERSION, rpgRework('economy')]).toEqual([17, true])
  })

  it('parses the rich v27 save through toV28, and its open v15 fights replay to their frozen ends', () => {
    const world = parseSave(v28Save()).tierWorlds['1']!
    expect(world.grant).toMatchObject({ tickets: 3900, seen: false })
    expect(world.umas['100']!.gear).toEqual({ weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] })
    expect('gear' in world || 'gems' in world).toBe(false)
    for (const [battle, spec] of [[world.world.run.battle!, V27_WORLD_FIGHT], [world.rift.battle!, V27_RIFT_FIGHT]] as const) {
      expect(battle.input.version).toBe(15)
      const frozen = v15Replay(spec.name)
      expect(replayV15(battle.input, [...battle.actions, ...frozen.actions.slice(spec.actions)])).toMatchObject({ outcome: frozen.outcome, hash: frozen.hash })
    }
  })

  it('migrates the same save labelled v27 on load, and refuses it labelled v28 (the chain skips `toV28`): its gear and gem shelves', () => {
    expect(() => parseSave(richV27Save())).not.toThrow()
    expect(() => parseSave({ ...richV27Save(), schemaVersion: 28 })).toThrow(/tierWorlds\.1: unknown keys gems, gear/)
  })

  it('refuses each of v28\'s rules broken', () => {
    const refused = (change: (world: RawWorld) => void, message: RegExp) => expect(() => parseSave(v28Save(change))).toThrow(message)
    // A Tier 2 type in a Tier 1 world; the Branch Gem before R3's weapons.
    refused((w) => { w.items['gold-ore'] = 1 }, /items\.gold-ore: a Tier 2 material in a Tier 1 world/)
    refused((w) => { w.items['branch-gem'] = 1 }, /items\.branch-gem: unknown item/)
    // A grade above her level's: Uma 101 is Lv 20, and G6 needs Lv 26.
    refused((w) => { (w.umas['101']!.gear as Raw).weapons = { greatsword: { grade: 6 } } }, /umas\.101\.gear\.weapons\.greatsword\.grade: G6 needs Lv 26/)
    // A building: places have no levels.
    refused((w) => { w.buildings = { mine: { level: 2 } } }, /buildings: unknown keys mine/)
    // A map node out of order: Planet II before Planet I.
    refused((w) => { w.umas['100']!.stars = { open: ['planet:2'], moons: [] } }, /umas\.100\.stars\.open: planet:2 needs planet:1 first/)
    // A legacy item, a gear rank, Gear Marks, an accessory slot too many, a Pendant with a kind, an Orb without one.
    refused((w) => { w.items.flax = 1 }, /items\.flax: unknown item/)
    refused((w) => { (w.umas['100']!.ranks as Raw).weapons = {} }, /ranks: unknown keys weapons/)
    refused((w) => { (w.wallet as Raw).gearMarks = 0 }, /wallet: unknown keys gearMarks/)
    const slots = (list: unknown[]) => (w: RawWorld) => { (w.umas['100']!.gear as Raw).accessories = list }
    refused(slots([{ grade: 0, family: null, form: 'base' }, { grade: 0, family: null, form: 'base' }]), /accessories: expected 1–1 entries/)
    refused(slots([{ grade: 0, family: 'pendant', form: 'base', kind: 'fire' }]), /accessories\.0\.kind: only an Orb or a Bell has a kind/)
    refused(slots([{ grade: 0, family: 'orb', form: 'base' }]), /accessories\.0\.kind: expected one of the ten kinds/)
  })

  it('reads v28\'s work: rows on the ten places, four slots, each request planned by its place\'s kind', () => {
    const entry = (item: string, kind = 'gather') => ({ request: { kind, item, count: 1 }, seconds: [100], inputs: [[]], outputs: [{ item }], exp: [40],
      startedAt: 0, acceleratedMs: 0, collected: 0, speed: 1.25, fromQueue: false })
    const row = (building: string, slot: number, item: string, kind?: string) => ({ outfitId: '101', slot: { building, slot }, entries: [entry(item, kind)], queue: [], last: null, dropped: null })
    const ok = parseSave(v28Save((w) => { w.work = { 101: row('fields', 3, 'carrot') } })).tierWorlds['1']!
    expect(ok.work['101']!.entries[0]!.request).toEqual({ kind: 'gather', item: 'carrot', count: 1 })
    expect(() => parseSave(v28Save((w) => { w.work = { 101: row('ley-spring', 0, 'carrot') } }))).toThrow(/work\.101\.slot\.building: not a place/)
    expect(() => parseSave(v28Save((w) => { w.work = { 101: row('fields', 4, 'carrot') } }))).toThrow(/work\.101\.slot\.slot: no such slot/)
    expect(() => parseSave(v28Save((w) => { w.work = { 101: row('mine', 0, 'carrot') } }))).toThrow(/request\.item: not made at this place/)
    expect(() => parseSave(v28Save((w) => { w.work = { 101: row('forge', 0, 'armor-fittings-g1', 'craft') } }))).toThrow(/request\.item: not made at this place/)
    expect(parseSave(v28Save((w) => { w.work = { 101: row('lapidary', 0, 'jewel-moon-1', 'cut') } })).tierWorlds['1']!.work['101']!.slot).toEqual({ building: 'lapidary', slot: 0 })
  })

  it('makes new saves in v28\'s shape, which round-trip; a new Uma has no armor kinds', () => {
    const save = newSave('Trainer', '2026-10-25T12:00:00.000Z')
    const world = save.tierWorlds['1']!
    expect(world).toMatchObject({ items: {}, buildings: {}, work: {}, grant: null })
    expect('gear' in world || 'gems' in world || 'gearMarks' in world.wallet).toBe(false)
    const unlocked = unlockUma(save, '9000', '2026-10-25T12:00:00.000Z', '1', 'mage')
    expect(unlocked.tierWorlds['1']!.umas['9000']).toMatchObject({
      classId: 'mage', craft: { level: 1, exp: 0 }, ranks: { classes: {} }, stars: { open: [], moons: [] },
      gear: { weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] },
    })
    for (const s of [save, unlocked]) expect(parseSave(JSON.parse(JSON.stringify(s)))).toEqual(s)
  })

  it('marks a world\'s grant seen once, for the first launch\'s sheet (H80)', () => {
    const save = parseSave(v28Save())
    const seen = markGrantSeen(save, '1', '2026-10-26T00:00:00.000Z')
    expect(seen.tierWorlds['1']!.grant!.seen).toBe(true)
    expect(seen.account.updatedAt).toBe('2026-10-26T00:00:00.000Z')
    expect(markGrantSeen(seen, '1', '2026-10-27T00:00:00.000Z')).toBe(seen)
    const none: Save = newSave('Trainer', '2026-10-25T12:00:00.000Z')
    expect(markGrantSeen(none, '1', '2026-10-26T00:00:00.000Z')).toBe(none)
    expect(parseSave(JSON.parse(JSON.stringify(seen)))).toEqual(seen)
  })
})
