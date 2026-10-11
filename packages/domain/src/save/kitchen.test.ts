import { describe, expect, it } from 'vitest'
import { applyPoints, noPoints } from '../economy/bonus'
import { DISHES, dishById, nodesFor, STAR_NODES, starPoints } from '../economy/dishes'
import { makeMinutes, MINUTE } from '../economy/pacing'
import { ITEM_FAMILIES } from '../items/catalog'
import { battleDamage, createBattle } from '../rpg/battle/engine'
import { rpgCampaignChapter } from '../rpg/campaign/chapters'
import { projectRpgStats } from '../rpg/rules'
import { startFight, umaProfile } from './battle'
import { eatDish, extraStatPoints, setActiveNodes } from './kitchen'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, parseSave, type Save } from './save'
import { collectJob, facilityOf, planJob, startJob } from './work'

const T0 = Date.parse('2026-10-10T12:00:00.000Z')
const at = (ms: number) => new Date(T0 + ms).toISOString()
const cook = {
  outfitId: '101', baseStats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100 }, growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { surface: { turf: 'A', dirt: 'G' }, strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'G', long: 'G' } },
} as const

const withUma = (): Save => unlockUma(newSave('Luis', at(0)), '101', at(0))
const stock = (save: Save, items: Record<string, number>, dishes: Record<string, number> = {}): Save => {
  const w = worldOf(save)
  return { ...save, tierWorlds: { '1': { ...w, items: { ...w.items, ...items }, dishes: { ...w.dishes, ...dishes } } } }
}
const setLevel = (save: Save, level: number): Save => {
  const w = worldOf(save)
  return { ...save, tierWorlds: { '1': { ...w, umas: { ...w.umas, '101': { ...w.umas['101']!, level } } } } }
}

describe('dishes (S6, D58)', () => {
  it('makes 80 planet dishes, 16 Duo dishes and 4 Feasts from farming families only, every family in demand', () => {
    expect(DISHES.filter((d) => d.kind === 'planet')).toHaveLength(80)
    expect(DISHES.filter((d) => d.kind === 'duo')).toHaveLength(16)
    expect(DISHES.filter((d) => d.kind === 'feast')).toHaveLength(4)
    expect(STAR_NODES).toHaveLength(100)
    const used = new Set(DISHES.flatMap((d) => Object.keys(d.inputs)))
    const farmingRefined = ITEM_FAMILIES.filter((f) => f.side === 'farming').flatMap((f) => f.refined.map((i) => i.id))
    expect(farmingRefined.every((id) => used.has(id))).toBe(true)
    expect(dishById('dish-fruits-1')).toMatchObject({ name: 'Apple Tart', effects: ['mp'], inputs: { 'apple-preserve': 2 } })
    expect(Object.keys(dishById('dish-fruits-1')!.inputs)).toHaveLength(2)
  })

  it('unlocks moons from the lowest up to the dish’s grade, bridges at grades 3 and 7, and the Sun with Feasts', () => {
    expect(nodesFor(dishById('dish-grains-3')!)).toEqual(['moon:hp:1', 'moon:hp:2', 'moon:hp:3'])
    expect(nodesFor(dishById('duo-hp-def-3')!)).toEqual(['bridge:hp-def:1'])
    expect(nodesFor(dishById('feast-6')!)).toEqual(['sun:1', 'sun:2'])
    expect(starPoints(['moon:hp:1', 'bridge:hp-def:1', 'sun:1'])).toMatchObject({ hp: 1.625, def: 0.625, mp: 0.125 })
  })
})

describe('cooking and eating (S6)', () => {
  it('cooks at the Kitchen with Farming & Cooking, reserving the recipe, and puts dishes on their own shelf', () => {
    let save = stock(withUma(), { 'apple-preserve': 4, 'carp-fillet': 2 })
    const plan = planJob(worldOf(save), 'kitchen', cook, 'dish-fruits-1', 2)!
    expect(plan.msEach).toBe(makeMinutes(1) * MINUTE / 2)
    expect(plan.block).toBeNull()
    save = startJob(save, 'kitchen', 0, cook, 'dish-fruits-1', 2, at(0))
    expect(worldOf(save).items).toEqual({}) // two tarts: 4 Apple Preserve and their 2 Carp Fillet sides
    save = collectJob(save, 'kitchen', 0, at(2 * plan.msEach)).save
    expect(worldOf(save).dishes).toEqual({ 'dish-fruits-1': 2 })
    expect(worldOf(save).umas['101']!.professions.farming).toEqual({ level: 2, exp: 2 * makeMinutes(1) * 2 - 26 })
    expect(facilityOf(worldOf(save), 'kitchen').jobs[0]).toBeNull()
  })

  it('eats a dish for the lowest locked node, switches it on while slots last, and refuses a dish with nothing new', () => {
    let save = stock(withUma(), {}, { 'dish-grains-2': 3 })
    save = eatDish(save, '101', 'dish-grains-2', at(0)).save
    save = eatDish(save, '101', 'dish-grains-2', at(0)).save
    expect(worldOf(save).umas['101']!.stars).toEqual({ unlocked: ['moon:hp:1', 'moon:hp:2'], active: ['moon:hp:1', 'moon:hp:2'] })
    expect(() => eatDish(save, '101', 'dish-grains-2', at(0))).toThrow(/nothing new/)
    expect(worldOf(save).dishes).toEqual({ 'dish-grains-2': 1 })
    expect(() => setActiveNodes(save, '101', ['moon:hp:3'], at(0))).toThrow(/unlocked/)
    save = setActiveNodes(save, '101', ['moon:hp:2'], at(0))
    expect(extraStatPoints(worldOf(save).umas['101']!)).toMatchObject({ hp: 1 })
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })

  it('keeps 5 + ⌊level / 2⌋ nodes active at once', () => {
    const unlocked = ['moon:hp:1', 'moon:hp:2', 'moon:hp:3', 'moon:hp:4', 'moon:hp:5', 'moon:hp:6']
    const w = worldOf(withUma())
    let save: Save = { ...withUma(), tierWorlds: { '1': { ...w, umas: { '101': { ...w.umas['101']!, stars: { unlocked, active: [] } } } } } }
    expect(() => setActiveNodes(save, '101', unlocked, at(0))).toThrow(/at most 5/)
    save = setActiveNodes(setLevel(save, 2), '101', unlocked, at(0))
    expect(worldOf(save).umas['101']!.stars.active).toHaveLength(6)
  })
})

describe('Extra Stats in battle (S6)', () => {
  it('raises her stats, gives evasion and a Limit Break head start, and the engine uses them', () => {
    const points = { ...noPoints(), hp: 10, speed: 10, limit: 10 }
    const boosted = applyPoints(projectRpgStats({ baseStats: cook.baseStats, growthRates: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 }, tier: 1, level: 1, classId: 'brawler' }), points)
    expect(boosted).toMatchObject({ evasion: 60, limitStart: 4 })

    let save = ['102', '103', '104', '105'].reduce((s, id) => unlockUma(s, id, at(0)), withUma())
    const w = worldOf(save)
    const nodes = ['moon:hp:1', 'moon:speed:1', 'moon:speed:2', 'moon:limit:1', 'moon:limit:2', 'moon:limit:3']
    save = { ...save, tierWorlds: { '1': { ...w, umas: { ...w.umas, '101': { ...w.umas['101']!, level: 4, stars: { unlocked: nodes, active: nodes } } } } } }
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = rpgCampaignChapter({ scenarioId: 1, name: 'URA', order: 1 }, [{ id: 'c', name: 'C' }])
    const outfits = new Map(['101', '102', '103', '104', '105'].map((id) => [id, { ...cook, outfitId: id }]))
    const fighting = startFight(save, ura, 0, 'a1r1c1', outfits, at(0))
    const ally = worldOf(fighting).runs['0:1']!.battle!.input.allies[0]!
    const plain = projectRpgStats(umaProfile(cook, { ...worldOf(save).umas['101']! }, 1))
    expect(ally.stats.hp).toBe(Math.round(plain.hp * 1.015))
    expect(ally).toMatchObject({ evasion: 12, limitStart: 1 })
    const state = createBattle(worldOf(fighting).runs['0:1']!.battle!.input).state
    expect(state.units.find((u) => u.id === '101')!.limit).toBe(1)
    // The same hit lands 1.2% softer on her than without evasion.
    const bare = createBattle({ ...state.input, allies: state.input.allies.map((a) => (a.id === '101' ? { ...a, evasion: undefined } : a)) }).state
    const foe = state.units.find((u) => u.side === 'enemy')!
    const hit = (s: typeof state) => battleDamage(s, foe, s.units.find((u) => u.id === '101')!, 'physical', 4, null).amount
    expect(hit(state)).toBe(Math.max(1, Math.round(hit(bare) * 0.988)))
  })
})
