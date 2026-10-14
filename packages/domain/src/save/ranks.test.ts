import { describe, expect, it } from 'vitest'
import {
  classExpToNext, gearExpToNext, grantTrack, MANUAL_EXP, MANUAL_PRICE, weaponExpShares, withTrack, type RankTrack,
} from '../economy/ranks'
import { rpgExpToNext } from '../rpg/rules'
import { regionChapter, worldContinent } from '../world/world'
import { startFight, type BattleOutfit } from './battle'
import { manualBlock, readManuals, sweepFight } from './exchange'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, parseSave, SAVE_SCHEMA_VERSION, type Save } from './save'

const T = (n: number) => new Date(Date.parse('2026-10-12T12:00:00.000Z') + n * 1000).toISOString()
// Invented outfits only.
const outfit = (id: string): BattleOutfit => ({ outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
  growthRatePercents: { speed: 10, stamina: 10, power: 10, guts: 0, wit: 0 }, aptitudes: { strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' } } })
const IDS = ['101', '102', '103', '104', '105']
const OUTFITS = new Map(IDS.map((id) => [id, outfit(id)]))
const ura = regionChapter(worldContinent({ name: 'Synthetic', order: 1 }).regions[0]!, [{ id: 'c', name: 'C' }])
function party(): Save {
  let s = newSave('Luis', T(0))
  IDS.forEach((id, i) => { s = setPartySlot(unlockUma(s, id, T(1)), 0, i, id, T(2)) })
  return s
}
const edit = (save: Save, fn: (w: ReturnType<typeof worldOf>) => void): Save => { const s = JSON.parse(JSON.stringify(save)) as Save; fn(worldOf(s)); return s }

describe('ranks (D102)', () => {
  it('cuts every rank curve from the Uma curve: a class to 50 is a whole Lv1–50, a weapon to 10 is Lv1–46', () => {
    let umaTo50 = 0
    for (let l = 1; l < 50; l++) umaTo50 += rpgExpToNext(l)
    let classTo50 = 0, gearTo10 = 0
    for (let r = 1; r < 50; r++) classTo50 += classExpToNext(r)
    for (let r = 1; r < 10; r++) gearTo10 += gearExpToNext(r)
    expect(umaTo50).toBe(25_480)
    expect(classTo50).toBe(umaTo50)
    expect(gearExpToNext(1)).toBe(840)
    expect(gearTo10).toBe(21_960)
    // A campaign's Uma EXP (E) maxes two classes (2E) and five used weapons (about E each) with room to spare.
    expect(2 * umaTo50).toBe(2 * classTo50)
    expect(gearTo10).toBeLessThan(umaTo50)
  })

  it('ranks up, and returns what passes the top rank', () => {
    expect(grantTrack({ rank: 1, exp: 0 }, 'weapon', 900)).toEqual({ track: { rank: 2, exp: 60 }, ranksUp: 1, overflow: 0 })
    expect(grantTrack({ rank: 9, exp: gearExpToNext(9) - 10 }, 'armor', 30)).toEqual({ track: { rank: 10, exp: 0 }, ranksUp: 1, overflow: 20 })
    expect(grantTrack({ rank: 50, exp: 0 }, 'class', 500)).toEqual({ track: { rank: 50, exp: 0 }, ranksUp: 0, overflow: 500 })
    // A fresh track isn't stored.
    expect(withTrack({ classes: {}, weapons: { lance: { rank: 2, exp: 0 } }, armors: {}, accessories: {} }, { kind: 'weapon', id: 'lance' }, { rank: 1, exp: 0 }).weapons).toEqual({})
  })

  it('splits 5E over her five weapons, two parts for each one she used', () => {
    expect(weaponExpShares(['greatsword', 'axe', 'lance', 'bow', 'katana'], new Set(), 100)).toEqual({ greatsword: 100, axe: 100, lance: 100, bow: 100, katana: 100 })
    expect(weaponExpShares(['greatsword', 'axe', 'lance', 'bow', 'katana'], new Set(['greatsword', 'axe'] as const), 70)).toEqual(
      { greatsword: 100, axe: 100, lance: 50, bow: 50, katana: 50 })
  })

  it('banks EXP past a max rank as Marks at half rate, and Manuals spend them on one bar of one Uma', () => {
    const top: RankTrack = { rank: 10, exp: 0 }
    let save = edit(party(), (w) => {
      for (const id of IDS) w.umas[id]!.ranks.weapons = { greatsword: top, axe: top, lance: top, bow: top, katana: top }
      w.world.run.wins = { start: 1, [ura.nodes[1]!.id]: 1 }
      w.wallet.sweepTickets = 1
    })
    const swept = sweepFight(save, ura, ura.nodes[1]!.id, OUTFITS, T(3))
    // Every weapon is at Rank 10, so all of its EXP banks, at half rate; classes and armor are still climbing.
    const weaponGains = swept.result.members.flatMap((m) => m.ranks.filter((g) => g.ref.kind === 'weapon'))
    expect(weaponGains).toHaveLength(25)
    expect(swept.result.gearMarks).toBe(weaponGains.reduce((n, g) => n + Math.floor(g.exp * 0.5), 0))
    expect(swept.result.gearMarks).toBeGreaterThan(0)
    expect(swept.result.classMarks).toBe(0)
    expect(worldOf(swept.save).wallet.gearMarks).toBe(swept.result.gearMarks)
    save = edit(swept.save, (w) => { w.wallet.gearMarks = 2 * MANUAL_PRICE; w.wallet.classMarks = 0 })
    const ref = { kind: 'armor', id: 'robe' } as const
    expect(manualBlock(worldOf(save), '101', { kind: 'class', id: 'mage' })).toBe(`Needs ${MANUAL_PRICE} Class Marks`)
    expect(manualBlock(worldOf(save), '101', { kind: 'weapon', id: 'lance' })).toBe('Already at the top rank')
    save = readManuals(save, '101', ref, 2, T(4))
    expect(worldOf(save).wallet.gearMarks).toBe(0)
    expect(worldOf(save).umas['101']!.ranks.armors.robe).toEqual(grantTrack({ rank: 1, exp: 0 }, 'armor', 2 * MANUAL_EXP).track)
    expect(() => readManuals(save, '101', ref, 1, T(5))).toThrow(/Gear Marks/)
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })

  it('freezes her Class Rank into the fight, and her Uma EXP never beats her own level\'s share', () => {
    const input = worldOf(startFight(party(), ura, ura.nodes[1]!.id, OUTFITS, T(3))).world.run.battle!.input
    expect(input.allies.every((a) => a.classRank === 1)).toBe(true)
  })
})

describe('save v18: the progress reset (D105)', () => {
  /** A v17 save as it was stored: old ranks, gear ids and slots, tokens, a training job, a world map in progress. */
  function v17(): Record<string, unknown> {
    const raw = JSON.parse(JSON.stringify(party())) as Record<string, unknown> & { tierWorlds: Record<string, Record<string, unknown>> }
    raw.schemaVersion = 17
    const w = raw.tierWorlds['1']! as Record<string, any>
    delete w.wallet.gearMarks
    delete w.wallet.classMarks
    w.wallet.laurels = 500
    const uma = w.umas['101']
    uma.level = 20
    uma.exp = 100
    uma.classId = 'brawler'
    uma.ranks = { classes: { brawler: 3, mage: 1, spellblade: 1, cleric: 1, summoner: 1 }, weapons: { brawler: 4, mage: 1, spellblade: 1, cleric: 1, summoner: 1 }, armor: 2, accessory: 2 }
    uma.classes = { brawler: { weapons: ['greatsword', 'axe', 'lance', 'bow', 'katana'], tree: ['brawler-greatsword.1a'], loadout: ['brawler-greatsword.1a'] } }
    uma.stars = { unlocked: ['moon:hp:1', 'moon:hp:2', 'moon:def:1', 'moon:def:2', 'moon:mp:1', 'moon:mp:2'], active: ['moon:hp:1', 'moon:hp:2', 'moon:def:1', 'moon:def:2', 'moon:mp:1', 'moon:mp:2'] }
    uma.professions = { farming: { level: 7, exp: 3 }, gathering: { level: 1, exp: 0 } }
    uma.gear = { locker: ['greatsword-g1-atk', 'greatsword-g1-hp', 'mail-g2-def', 'ring-g1-hp', 'orb-fire-g1-mp'],
      equipped: { greatsword: 'greatsword-g1-atk', armor: 'mail-g2-def', accessory: 'orb-fire-g1-mp' } }
    delete uma.gear.kinds
    for (const id of ['102', '103', '104', '105']) {
      const u = w.umas[id]
      u.ranks = { classes: { brawler: 1, mage: 1, spellblade: 1, cleric: 1, summoner: 1 }, weapons: { brawler: 1, mage: 1, spellblade: 1, cleric: 1, summoner: 1 }, armor: 1, accessory: 1 }
      delete u.gear.kinds
    }
    w.items = { 'token-mastery-1': 3, 'token-cook-hp-1': 2, 'wheat-flour': 1 }
    w.gear = { 'plate-g1-atk': 2, 'charm-g1-hp': 1, 'tome-ice-g1-mp': 1 }
    w.world.run.wins = { start: 1, 'w1-1-1-s1': 3 }
    w.world.springs = { 'w1-spring1': T(0) }
    w.facilities = {
      'brawler-dojo': { level: 1, jobs: [{ kind: 'train', outfitId: '102', output: 'class:brawler', count: 1, collected: 0, startedAt: T(0), msEach: 1000, expEach: 0, inputs: { 'token-class-brawler-1': 1 }, queue: [] }, null] },
      forge: { level: 1, jobs: [{ kind: 'craft', outfitId: '103', output: 'ring-g1-hp', count: 2, collected: 0, startedAt: T(0), msEach: 1000, expEach: 1, inputs: { 'cut-quartz': 1 }, queue: [] }, null] },
      kitchen: { level: 1, jobs: [{ kind: 'cook', outfitId: '104', output: 'dish-grains-1', count: 1, collected: 0, startedAt: T(0), msEach: 1000, expEach: 1, inputs: { 'wheat-flour': 1, 'token-cook-hp-1': 1 }, queue: [] }, null] },
    }
    w.targets = ['101']
    return raw
  }

  it('resets every Uma to Lv1, every rank to 1 and the world map; keeps the collection, professions, items and choices', () => {
    const save = parseSave(v17())
    const w = worldOf(save)
    const uma = w.umas['101']!
    expect(save.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    expect(uma).toMatchObject({ level: 1, exp: 0, classId: 'brawler', ranks: { classes: {}, weapons: {}, armors: {}, accessories: {} }, bonds: {} })
    expect(uma.classes.brawler).toEqual({ weapons: ['greatsword', 'axe', 'lance', 'bow', 'katana'], tree: [], loadout: null })
    expect(uma.professions.farming).toEqual({ level: 7, exp: 3 })
    expect(uma.stars).toEqual({ unlocked: expect.arrayContaining(['moon:hp:1']), active: ['moon:hp:1', 'moon:hp:2', 'moon:def:1', 'moon:def:2', 'moon:mp:1'] })
    // Gear renamed: weapons and Orbs lose accents (a duplicate gives its materials back), Mail becomes a Cuirass, a Ring
    // gives its materials back; only grade-1 pieces stay on.
    // v20 (D124) then drops armor accents and moves the Orb to her first accessory slot.
    expect(uma.gear).toEqual({ locker: ['greatsword-g1', 'cuirass-g2', 'orb-fire-g1'], equipped: { greatsword: 'greatsword-g1', 'accessory-1': 'orb-fire-g1' },
      kinds: {} })
    expect(w.gear).toEqual({ 'cuirass-g1': 2, 'tome-ice-g1': 1 })
    expect(Object.keys(w.items).some((id) => id.startsWith('token-'))).toBe(false)
    expect(w.items['wheat-flour']).toBe(1)
    expect(w.items['copper-ingot']).toBe(2) // the duplicate Greatsword's and the Ring's
    expect(w.items['cut-quartz']).toBe(1 + 2) // the Ring's, and the Ring job's reserved input for its two pieces
    // The world map and Springs start over; Laurels, targets and parties stay; Marks start at 0.
    expect(w.world.run.wins).toEqual({})
    expect(w.world.springs).toEqual({})
    expect(w.wallet).toMatchObject({ laurels: 500, gearMarks: 0, classMarks: 0 })
    expect(w.targets).toEqual(['101'])
    expect(w.parties[0]!.slots).toEqual(IDS)
    // Training ends, a Ring's Forge job ends, a dish needs no token.
    expect(w.facilities['brawler-dojo']).toBeUndefined()
    expect(w.facilities.forge!.jobs[0]).toBeNull()
    expect(w.facilities.kitchen!.jobs[0]!.inputs).toEqual({ 'wheat-flour': 1 })
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })
})
