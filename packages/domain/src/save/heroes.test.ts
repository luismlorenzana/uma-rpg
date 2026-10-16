import { describe, expect, it } from 'vitest'
import { BOND_EXP_PER_WIN, BOND_EXP_TO_NEXT, BOND_MAX_LEVEL, bondCapacity, hallClass, HERO_HALLS, HERO_LIMIT_IDS, heroLimitsOf } from '../rpg/heroes'
import { regionChapter, worldContinent } from '../world/world'
import { startFight, type BattleOutfit } from './battle'
import { sweepFight } from './exchange'
import { addLearner, grantBond, heroBlock, heroFields, learnerBlock, parentsOf, removeLearner, setHero } from './heroes'
import { V19_UNLOCK_TICKETS } from './migrations'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, parseSave, type Save } from './save'

const T = (n: number) => new Date(Date.parse('2026-10-12T12:00:00.000Z') + n * 1000).toISOString()
// Invented outfits only.
const outfit = (id: string): BattleOutfit => ({ outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
  growthRatePercents: { speed: 10, stamina: 10, power: 10, guts: 0, wit: 0 }, aptitudes: { strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' } } })
const PARTY = ['101', '102', '103', '104', '105']
const ALL = [...PARTY, '201', '202', '203']
const OUTFITS = new Map(ALL.map((id) => [id, outfit(id)]))
const ura = regionChapter(worldContinent({ name: 'Synthetic', order: 1 }).regions[0]!, [{ id: 'c', name: 'C' }])
function stable(): Save {
  let s = newSave('Luis', T(0))
  for (const id of ALL) s = unlockUma(s, id, T(1))
  PARTY.forEach((id, i) => { s = setPartySlot(s, 0, i, id, T(2)) })
  return s
}
const round = (s: Save) => expect(parseSave(JSON.parse(JSON.stringify(s)))).toEqual(s)

describe('Halls of Heroes (D106)', () => {
  it('has five halls of four seats, one unique Limit Break each', () => {
    expect(HERO_LIMIT_IDS).toHaveLength(20)
    expect(heroLimitsOf('cleric').map((l) => l.id)).toEqual(['cleric-1', 'cleric-2', 'cleric-3', 'cleric-4'])
    expect(hallClass(HERO_HALLS.spellblade)).toBe('spellblade')
    expect(hallClass('workbench')).toBeNull()
    expect([0, 1, 5, 10, 12].map(bondCapacity)).toEqual([0.5, 0.55, 0.75, 1, 1])
  })

  it('seats a Hero once, keeps her Learners when she is swapped, and sends them away when the seat empties', () => {
    let s = setHero(stable(), 'brawler-1', '201', T(3))
    expect(() => setHero(s, 'mage-1', '201', T(3))).toThrow(/Already a Hero/)
    s = addLearner(s, 'brawler-1', '101', T(4))
    s = setHero(s, 'brawler-1', '202', T(5))
    expect(worldOf(s).heroes['brawler-1']).toEqual({ hero: '202', learners: ['101'] })
    round(s)
    s = setHero(s, 'brawler-1', null, T(6))
    expect(worldOf(s).heroes).toEqual({})
    expect(parentsOf(worldOf(s), '101')).toEqual([])
  })

  it('takes up to two Heroes a Learner and ten Learners a Hero, never a Hero as a Learner or a Learner as a Hero', () => {
    let s = setHero(setHero(setHero(stable(), 'brawler-1', '201', T(3)), 'mage-2', '202', T(3)), 'cleric-3', '203', T(3))
    expect(learnerBlock(worldOf(s), 'summoner-1', '101')).toBe('This seat has no Hero')
    s = addLearner(addLearner(s, 'brawler-1', '101', T(4)), 'mage-2', '101', T(4))
    expect(parentsOf(worldOf(s), '101')).toEqual(['brawler-1', 'mage-2'])
    expect(learnerBlock(worldOf(s), 'cleric-3', '101')).toBe('Already has 2 Heroes')
    expect(learnerBlock(worldOf(s), 'brawler-1', '202')).toBe('A Hero')
    expect(learnerBlock(worldOf(s), 'mage-2', '101')).toBe('Already learning here')
    expect(heroBlock(worldOf(s), 'summoner-1', '101')).toBe('A Learner: leave her Heroes first')
    expect(() => addLearner(s, 'cleric-3', '101', T(5))).toThrow(/2 Heroes/)
    s = removeLearner(s, 'mage-2', '101', T(5))
    s = addLearner(s, 'cleric-3', '101', T(5))
    expect(parentsOf(worldOf(s), '101')).toEqual(['brawler-1', 'cleric-3'])
    round(s)
    // Eleven in one seat is one too many (owned Umas only).
    let big = stable()
    for (let i = 0; i < 11; i++) big = unlockUma(big, `30${i}`, T(1))
    big = setHero(big, 'mage-1', '201', T(3))
    for (let i = 0; i < 10; i++) big = addLearner(big, 'mage-1', `30${i}`, T(4))
    expect(learnerBlock(worldOf(big), 'mage-1', '3010')).toBe('10 Learners at most')
  })

  it('refuses broken seats when it reads a save', () => {
    const bad = (heroes: unknown) => {
      const raw = JSON.parse(JSON.stringify(stable()))
      raw.tierWorlds['1'].heroes = heroes
      return () => parseSave(raw)
    }
    expect(bad({ 'brawler-5': { hero: '201', learners: [] } })).toThrow(/not a Hero seat/)
    expect(bad({ 'brawler-1': { hero: '999', learners: [] } })).toThrow(/owned outfit/)
    expect(bad({ 'brawler-1': { hero: '201', learners: [] }, 'mage-1': { hero: '201', learners: [] } })).toThrow(/another seat/)
    expect(bad({ 'brawler-1': { hero: '201', learners: ['202'] }, 'mage-1': { hero: '202', learners: [] } })).toThrow(/is a Hero/)
    expect(bad({ 'brawler-1': { hero: '201', learners: ['101'] }, 'mage-1': { hero: '202', learners: ['101'] }, 'cleric-1': { hero: '203', learners: ['101'] } }))
      .toThrow(/more than 2/)
    const raw = JSON.parse(JSON.stringify(stable()))
    raw.tierWorlds['1'].umas['101'].bonds = { 'mage-1': { level: 10, exp: 3 } }
    expect(() => parseSave(raw)).toThrow(/expected 0 at the top level/)
  })

  it('brings her seat or her inherited Limit Breaks, with Bond Levels, into a fight', () => {
    let s = setHero(setHero(stable(), 'brawler-1', '201', T(3)), 'mage-2', '202', T(3))
    s = addLearner(addLearner(s, 'brawler-1', '101', T(4)), 'mage-2', '101', T(4))
    s = setHero(s, 'cleric-4', '102', T(4))
    const w = worldOf(s)
    w.umas['101'] = { ...w.umas['101']!, bonds: { 'mage-2': { level: 3, exp: 5 } } }
    expect(heroFields(w, '101')).toEqual({ inherits: [{ limit: 'brawler-1', bond: 0, from: '201' }, { limit: 'mage-2', bond: 3, from: '202' }] })
    const input = worldOf(startFight(s, ura, ura.nodes[1]!.id, OUTFITS, T(5))).world.run.battle!.input
    expect(input.version).toBe(13)
    expect(input.allies.find((a) => a.id === '101')).toMatchObject({ inherits: [{ limit: 'brawler-1', bond: 0 }, { limit: 'mage-2', bond: 3 }] })
    expect(input.allies.find((a) => a.id === '102')).toMatchObject({ hero: 'cleric-4' })
    expect(input.allies.find((a) => a.id === '103')).not.toHaveProperty('hero')
  })

  it('pays Bond EXP to each Hero a Learner sits under on every won fight, Sweeps included, and keeps it when she leaves', () => {
    expect(grantBond({ level: 9, exp: BOND_EXP_TO_NEXT - 1 }, 5)).toEqual({ level: BOND_MAX_LEVEL, exp: 0 })
    let s = setHero(setHero(stable(), 'brawler-1', '201', T(3)), 'mage-2', '202', T(3))
    s = addLearner(addLearner(s, 'brawler-1', '101', T(4)), 'mage-2', '101', T(4))
    const w = worldOf(s)
    w.world.run.wins = { start: 1, [ura.nodes[1]!.id]: 1 }
    w.wallet.sweepTickets = 2
    const swept = sweepFight(s, ura, ura.nodes[1]!.id, OUTFITS, T(5))
    const gain = swept.result.members.find((m) => m.outfitId === '101')!.bonds
    expect(gain.map((g) => [g.limit, g.exp, g.after])).toEqual([
      ['brawler-1', BOND_EXP_PER_WIN.fight, { level: 0, exp: 2 }], ['mage-2', BOND_EXP_PER_WIN.fight, { level: 0, exp: 2 }]])
    expect(swept.result.members.find((m) => m.outfitId === '102')!.bonds).toEqual([])
    s = removeLearner(swept.save, 'brawler-1', '101', T(6))
    expect(worldOf(s).umas['101']!.bonds).toEqual({ 'brawler-1': { level: 0, exp: 2 }, 'mage-2': { level: 0, exp: 2 } })
    s = sweepFight(s, ura, ura.nodes[1]!.id, OUTFITS, T(7)).save
    expect(worldOf(s).umas['101']!.bonds).toEqual({ 'brawler-1': { level: 0, exp: 2 }, 'mage-2': { level: 0, exp: 4 } })
    round(s)
  })

  it('raises a Hero’s Bond with her own seat, so seated later as its Learner she starts at what she earned (D112)', () => {
    let s = setHero(stable(), 'brawler-1', '101', T(3))
    const w = worldOf(s)
    w.world.run.wins = { start: 1, [ura.nodes[1]!.id]: 1 }
    w.wallet.sweepTickets = 3
    for (let i = 0; i < 3; i++) s = sweepFight(s, ura, ura.nodes[1]!.id, OUTFITS, T(4 + i)).save
    expect(worldOf(s).umas['101']!.bonds).toEqual({ 'brawler-1': { level: 0, exp: 3 * BOND_EXP_PER_WIN.fight } })
    s = setHero(s, 'brawler-1', '201', T(8))
    s = addLearner(s, 'brawler-1', '101', T(9))
    expect(heroFields(worldOf(s), '101')).toEqual({ inherits: [{ limit: 'brawler-1', bond: 0, from: '201' }] })
    expect(worldOf(s).umas['101']!.bonds['brawler-1']).toEqual({ level: 0, exp: 6 })
  })

  it('opens the halls on a v18 save with five more Uma Tickets', () => {
    const raw = JSON.parse(JSON.stringify(stable()))
    raw.schemaVersion = 18
    const w = raw.tierWorlds['1']
    delete w.heroes
    for (const u of Object.values(w.umas) as Record<string, unknown>[]) delete u.bonds
    const tickets = w.wallet.unlockTickets
    const save = parseSave(raw)
    expect(worldOf(save).wallet.unlockTickets).toBe(tickets + V19_UNLOCK_TICKETS)
    expect(worldOf(save).heroes).toEqual({})
    expect(worldOf(save).umas['101']!.bonds).toEqual({})
  })
})
