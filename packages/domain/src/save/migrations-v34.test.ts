// Save v34's migration (D264), unmocked: `toV34` on raw v33 worlds. Her slot stays slot 1 and two empty ones join it, a Bell
// loses its kind as it becomes the Charm, Planet Jewels in stock count three each, and her moon opens where its rank is set.
import { describe, expect, it } from 'vitest'
import { migrateWorld, toV34 } from './migrations'
import { worldOf } from './rules'
import { newOwnedUma, newSave, parseSave, type Save } from './save'
import { SAVE_SCHEMA_VERSION } from './version'

type Raw = Record<string, unknown>
const EMPTY = { grade: 0, family: null, form: 'base' }
const uma = (over: Raw = {}): Raw => ({ gear: { weapons: { axe: { grade: 2 } }, armor: {}, accessories: [EMPTY] }, stars: { open: [], moons: [] }, ...over })
const world = (umas: Record<string, Raw>, items: Record<string, number> = {}): Raw => ({ umas, items, wallet: { laurels: 7 } })
const gearOf = (w: Raw, id: string) => ((w.umas as Record<string, Raw>)[id]!.gear as { accessories: unknown[] }).accessories
const openOf = (w: Raw, id: string) => ((w.umas as Record<string, Raw>)[id]!.stars as { open: string[] }).open
const slot = (accessory: Raw) => uma({ gear: { weapons: {}, armor: {}, accessories: [accessory] } })

describe('toV34: accessories', () => {
  it('keeps her slot as slot 1 with its grade and adds two empty ones', () => {
    const after = toV34(world({ 1: slot({ grade: 6, family: 'orb', form: 'base', kind: 'axe' }), 2: slot({ grade: 3, family: 'pendant', form: 'base' }), 3: uma() }))
    expect(gearOf(after, '1')).toEqual([{ grade: 6, family: 'orb', form: 'base', kind: 'axe' }, EMPTY, EMPTY])
    expect(gearOf(after, '2')).toEqual([{ grade: 3, family: 'pendant', form: 'base' }, EMPTY, EMPTY])
    expect(gearOf(after, '3')).toEqual([EMPTY, EMPTY, EMPTY])
  })

  it('takes a Bell’s kind as it becomes the Charm, its grade kept', () => {
    expect(gearOf(toV34(world({ 1: slot({ grade: 9, family: 'bell', form: 'base', kind: 'greatsword' }) })), '1'))
      .toEqual([{ grade: 9, family: 'bell', form: 'base' }, EMPTY, EMPTY])
  })

  it('touches nothing else of hers, and no other Uma’s gear shape', () => {
    const before = uma({ level: 12, ranks: { classes: {} } })
    const after = (toV34(world({ 1: before })).umas as Record<string, Raw>)['1']!
    expect(after).toEqual({ ...before, gear: { ...(before.gear as Raw), accessories: [EMPTY, EMPTY, EMPTY] } })
  })
})

describe('toV34: jewels', () => {
  it('counts each Planet Jewel in stock three times: each one opened a node', () => {
    const after = toV34(world({}, { 'jewel-planet-1': 2, 'jewel-planet-5': 1, 'jewel-moon-2': 4, 'weapon-gem-g1': 7, 'cut-quartz': 9 }))
    expect(after.items).toEqual({ 'jewel-planet-1': 6, 'jewel-planet-5': 3, 'jewel-moon-2': 4, 'weapon-gem-g1': 7, 'cut-quartz': 9 })
  })

  it('opens her moon where all three moons hold its rank, and leaves it where they don’t', () => {
    const moons = (n: number) => ['prowess', 'vigor', 'guard'].flatMap((m) => Array.from({ length: n }, (_, i) => `${m}:${i + 1}`))
    const after = toV34(world({
      1: uma({ stars: { open: moons(2), moons: [] } }),
      2: uma({ stars: { open: moons(4), moons: [] } }),
      3: uma({ stars: { open: ['prowess:2', 'vigor:2', 'template:1'], moons: [] } }),
      4: uma({ stars: { open: ['prowess:1', 'vigor:2'], moons: [] } }),
    }))
    expect(openOf(after, '1')).toEqual([...moons(2), 'template:1'])
    expect(openOf(after, '2')).toEqual([...moons(4), 'template:1', 'template:2'])
    expect(openOf(after, '3')).toEqual(['prowess:2', 'vigor:2', 'template:1'])
    expect(openOf(after, '4')).toEqual(['prowess:1', 'vigor:2'])
  })
})

describe('toV34: the chain', () => {
  it('is the last step: migrateWorld runs it on a v33 world, and not on a v34 one', () => {
    const raw = world({ 1: uma() }, { 'jewel-planet-1': 1 })
    expect(migrateWorld(raw, 33)).toEqual(toV34(raw))
    expect(migrateWorld(raw, SAVE_SCHEMA_VERSION)).toBe(raw)
    expect(SAVE_SCHEMA_VERSION).toBe(34)
  })

  it('leaves anything malformed for the strict parse', () => {
    expect((toV34({ umas: { 1: 'nope' } }).umas as Raw)['1']).toBe('nope')
    expect(() => toV34({})).not.toThrow()
  })

  it('parses a stored v33 save to v34, three slots on every Uma, which round-trips', () => {
    const save = newSave('Slots', '2026-10-30T12:00:00.000Z') as unknown as Raw
    const w = (save.tierWorlds as Record<string, Raw>)['1']!
    w.items = { 'jewel-planet-2': 2 }
    w.umas = { 101: { ...newOwnedUma('2026-10-30T12:00:00.000Z'), gear: { weapons: {}, armor: {}, accessories: [EMPTY] } } }
    const stored = JSON.parse(JSON.stringify({ ...save, schemaVersion: 33 })) as Raw
    const parsed: Save = parseSave(stored)
    expect(parsed.schemaVersion).toBe(34)
    expect(worldOf(parsed).umas['101']!.gear).toMatchObject({ accessories: [EMPTY, EMPTY, EMPTY] })
    expect(worldOf(parsed).items).toEqual({ 'jewel-planet-2': 6 })
    expect(parseSave(JSON.parse(JSON.stringify(parsed)))).toEqual(parsed)
  })

  it('refuses a v34 slot count or a kind on anything but an Orb', () => {
    const stored = (accessories: unknown[]) => {
      const save = JSON.parse(JSON.stringify(newSave('Slots', '2026-10-30T12:00:00.000Z'))) as Raw
      ;(save.tierWorlds as Record<string, Raw>)['1']!.umas = { 101: JSON.parse(JSON.stringify({ ...newOwnedUma('2026-10-30T12:00:00.000Z'), gear: { weapons: {}, armor: {}, accessories } })) }
      return save
    }
    expect(() => parseSave(stored([EMPTY, EMPTY]))).toThrow(/accessories: expected 3–3 entries/)
    expect(() => parseSave(stored([{ grade: 0, family: 'bell', form: 'base', kind: 'fire' }, EMPTY, EMPTY]))).toThrow(/accessories\.0\.kind: only an Orb has a kind/)
    expect(() => parseSave(stored([{ grade: 0, family: 'bell', form: 'base' }, EMPTY, { grade: 0, family: 'orb', form: 'base', kind: 'axe' }]))).not.toThrow()
  })
})
