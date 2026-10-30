// Save v33's migration (D261), unmocked: `toV33` on raw v32 worlds. The Warrior Dojo's and the Mage Tower's seats 3 and 4 fold
// into the same hall's 1 and 2: Bonds keep the higher, a kept seat keeps everyone it has, and nothing else moves.
import { describe, expect, it } from 'vitest'
import { loadV19Replays, replayV19 } from '../rpg/battle/v19-replays.fixture'
import { migrateWorld, toV33, toV34 } from './migrations'
import { parseSave, SAVE_SCHEMA_VERSION, type Save } from './save'
import { v31Save } from './v31.fixture'

type Raw = Record<string, unknown>
type Seat = { hero: string; learners: string[] }
type Track = { level: number; exp: number }
const bond = (level: number, exp = 0): Track => ({ level, exp })
const uma = (bonds: Record<string, Track> = {}) => ({ level: 10, bonds })
/** A bare world: `toV33` reads only `umas` and `heroes`. */
const world = (umas: Record<string, ReturnType<typeof uma>>, heroes: Record<string, Seat>): Raw => JSON.parse(JSON.stringify({ wallet: { classMarks: 7 }, umas, heroes })) as Raw
const heroesOf = (w: Raw) => w.heroes as Record<string, Seat>
const bondsOf = (w: Raw, id: string) => (w.umas as Record<string, { bonds: Record<string, Track> }>)[id]!.bonds

describe('toV33: Bonds', () => {
  it('keeps each Uma’s higher Bond with the kept seat, by level then EXP, and drops the closed seat’s', () => {
    const after = toV33(world({
      1: uma({ 'brawler-3': bond(7, 2), 'brawler-1': bond(4, 11) }),
      2: uma({ 'brawler-3': bond(4, 2), 'brawler-1': bond(4, 3) }),
      3: uma({ 'brawler-4': bond(10) }),
      4: uma({ 'mage-3': bond(2, 1), 'mage-1': bond(2, 5), 'mage-4': bond(6), 'spellblade-1': bond(9) }),
    }, {}))
    expect(bondsOf(after, '1')).toEqual({ 'brawler-1': bond(7, 2) })
    expect(bondsOf(after, '2')).toEqual({ 'brawler-1': bond(4, 3) })
    expect(bondsOf(after, '3')).toEqual({ 'brawler-2': bond(10) })
    expect(bondsOf(after, '4')).toEqual({ 'mage-1': bond(2, 5), 'mage-2': bond(6), 'spellblade-1': bond(9) })
  })
})

describe('toV33: the seats', () => {
  it('moves a closed seat whole into an empty kept seat: its Hero and its Learners in their order', () => {
    const after = toV33(world({}, { 'mage-3': { hero: '1', learners: ['3', '2'] }, 'brawler-4': { hero: '4', learners: [] } }))
    expect(heroesOf(after)).toEqual({ 'mage-1': { hero: '1', learners: ['3', '2'] }, 'brawler-2': { hero: '4', learners: [] } })
  })

  it('keeps a seat’s Hero and Learners, then adds the closed seat’s Hero, then its Learners by Bond (a tie keeps their order)', () => {
    const after = toV33(world({
      10: uma({ 'brawler-1': bond(10) }), 20: uma({ 'brawler-3': bond(10) }), 21: uma({ 'brawler-3': bond(2) }), 22: uma({ 'brawler-3': bond(6) }), 23: uma({ 'brawler-3': bond(2) }),
    }, { 'brawler-1': { hero: '10', learners: ['11'] }, 'brawler-3': { hero: '20', learners: ['21', '22', '23'] } }))
    expect(heroesOf(after)).toEqual({ 'brawler-1': { hero: '10', learners: ['11', '20', '22', '21', '23'] } })
    // Her own Bond 10 comes with her: the Hero of the closed seat casts the kept seat's at full strength.
    expect(bondsOf(after, '20')).toEqual({ 'brawler-1': bond(10) })
  })

  it('never takes a kept seat’s Hero or Learners out: past ten places the closed seat’s stay out, Bonds kept', () => {
    const full = Array.from({ length: 9 }, (_, i) => String(100 + i))
    const after = toV33(world({ 200: uma({ 'mage-4': bond(9) }), 201: uma({ 'mage-4': bond(8) }) },
      { 'mage-2': { hero: '1', learners: full }, 'mage-4': { hero: '2', learners: ['200', '201'] } }))
    expect(heroesOf(after)).toEqual({ 'mage-2': { hero: '1', learners: [...full, '2'] } })
    expect(bondsOf(after, '200')).toEqual({ 'mage-2': bond(9) })
    expect(bondsOf(after, '201')).toEqual({ 'mage-2': bond(8) })
  })

  it('seats an Uma once when she sat under both, freeing her second place', () => {
    const after = toV33(world({ 5: uma({ 'brawler-1': bond(1), 'brawler-3': bond(4) }) },
      { 'brawler-1': { hero: '1', learners: ['5'] }, 'brawler-3': { hero: '2', learners: ['5'] } }))
    expect(heroesOf(after)['brawler-1']).toEqual({ hero: '1', learners: ['5', '2'] })
    expect(bondsOf(after, '5')).toEqual({ 'brawler-1': bond(4) })
  })

  it('folds a Learner of seats 3 and 4 into two seats: nobody gains a Hero past two', () => {
    const after = toV33(world({}, { 'brawler-3': { hero: '1', learners: ['5'] }, 'brawler-4': { hero: '2', learners: ['5'] }, 'mage-1': { hero: '3', learners: [] } }))
    expect(heroesOf(after)).toEqual({ 'brawler-1': { hero: '1', learners: ['5'] }, 'brawler-2': { hero: '2', learners: ['5'] }, 'mage-1': { hero: '3', learners: [] } })
  })

  it('leaves the other halls’ seats and the Sanctum’s, whose kinds change, as they are', () => {
    const seats = { 'spellblade-3': { hero: '1', learners: ['9'] }, 'summoner-4': { hero: '2', learners: [] }, 'healer-3': { hero: '3', learners: ['8'] }, 'healer-4': { hero: '4', learners: [] } }
    const before = world({ 9: uma({ 'spellblade-3': bond(3) }), 8: uma({ 'healer-3': bond(5) }) }, seats)
    expect(toV33(before)).toEqual(before)
  })

  it('changes nothing else in the world, and runs once: a second pass changes nothing', () => {
    const once = toV33(world({ 1: uma({ 'brawler-3': bond(3) }) }, { 'brawler-3': { hero: '1', learners: [] } }))
    expect(once.wallet).toEqual({ classMarks: 7 })
    expect(toV33(once)).toEqual(once)
  })

  it('leaves anything malformed for the strict parse', () => {
    const bad = world({}, {})
    bad.heroes = { 'brawler-3': { hero: 7 } }
    expect(heroesOf(toV33(bad))).toEqual({ 'brawler-3': { hero: 7 } })
  })
})

describe('toV33: chained', () => {
  /** A v31 save with its `brawler-1` and `mage-1` moved to `brawler-3` and `mage-4`: every world through the chain. */
  function v32Save(): Raw {
    const save = JSON.parse(JSON.stringify({ ...v31Save(), schemaVersion: 31 })) as Raw & { tierWorlds: Record<string, Raw> }
    const heroes = save.tierWorlds['1']!.heroes as Record<string, Seat>
    const umas = save.tierWorlds['1']!.umas as Record<string, { bonds: Record<string, Track> }>
    heroes['brawler-3'] = heroes['brawler-1']!
    heroes['mage-4'] = heroes['mage-1']!
    delete heroes['brawler-1']
    delete heroes['mage-1']
    umas['106']!.bonds['brawler-3'] = bond(6)
    return save
  }

  it('is chained: migrateWorld runs it on a v32 world and on an older one, then toV34', () => {
    const raw = world({ 1: uma({ 'mage-3': bond(1) }) }, { 'mage-3': { hero: '1', learners: [] } })
    expect(migrateWorld(raw, 32)).toEqual(toV34(toV33(raw)))
    expect(migrateWorld(raw, SAVE_SCHEMA_VERSION)).toBe(raw)
    expect(SAVE_SCHEMA_VERSION).toBe(34)
  })

  it('parses a stored save with seats to fold to v33, which round-trips, its Heroes and Learners in the kept seats', () => {
    const parsed: Save = parseSave(v32Save())
    expect(parsed.schemaVersion).toBe(34)
    expect(parseSave(JSON.parse(JSON.stringify(parsed)))).toEqual(parsed)
    const w = parsed.tierWorlds['1']!
    expect(Object.keys(w.heroes).filter((id) => /^(brawler|mage)-[34]$/.test(id))).toEqual([])
    expect(w.heroes['brawler-1']).toEqual({ hero: '106', learners: ['100', '116'] })
    expect(w.heroes['mage-2']).toEqual({ hero: '101', learners: ['105', '117'] })
    expect(w.umas['106']!.bonds['brawler-1']).toEqual(bond(6))
    expect(w.umas['106']!.bonds['brawler-3']).toBeUndefined()
  })

  it('keeps a fight open across it on its closed seats: it parses, and replays to its frozen end on v19', () => {
    const frozen = loadV19Replays().find((r) => r.name.startsWith('what D261 changes, on the Rift'))!
    const stored = v32Save() as Raw & { tierWorlds: Record<string, { rift: { battle: Raw } }> }
    const rift = stored.tierWorlds['1']!.rift
    rift.battle = { ...rift.battle, input: frozen.input, actions: frozen.actions.slice(0, 12) }
    const battle = parseSave(JSON.parse(JSON.stringify(stored))).tierWorlds['1']!.rift.battle!
    expect(battle.input.version).toBe(19)
    expect(battle.input.allies.filter((a) => a.hero).map((a) => a.hero)).toEqual(['brawler-3', 'mage-4', 'healer-2'])
    expect(replayV19(battle.input, [...battle.actions, ...frozen.actions.slice(12)])).toMatchObject({ outcome: frozen.outcome, hash: frozen.hash })
  })

  it('refuses a closed seat or Bond in a v33 save', () => {
    const save = JSON.parse(JSON.stringify(parseSave(v32Save()))) as Raw & { tierWorlds: Record<string, Raw> }
    const w = save.tierWorlds['1']!
    const closed = JSON.parse(JSON.stringify(save)) as typeof save
    ;(closed.tierWorlds['1']!.heroes as Record<string, unknown>)['brawler-3'] = { hero: Object.keys(w.umas as object)[0], learners: [] }
    expect(() => parseSave(closed)).toThrow(/not a Hero seat/)
  })
})
