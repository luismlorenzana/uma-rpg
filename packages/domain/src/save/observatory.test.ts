import { describe, expect, it } from 'vitest'
import { regionChapter, worldContinent } from '../world/world'
import { applyPoints, noPoints } from '../economy/bonus'
import { gemById, gemNodes, GEMS, nodeGem, STAR_NODES, starPoints } from '../economy/gems'
import { makeMinutes, MINUTE } from '../economy/pacing'
import { ITEM_FAMILIES } from '../items/catalog'
import { battleDamage, createBattle } from '../rpg/battle/engine'
import { projectRpgStats } from '../rpg/rules'
import { startFight, umaProfile } from './battle'
import { extraStatPoints, gemBlock, nodeFromGem, setActiveNodes, setGem } from './observatory'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, parseSave, type Save } from './save'
import { collectJob, grantProfessionExp, planJob, startJob } from './work'

const T0 = Date.parse('2026-10-10T12:00:00.000Z')
const at = (ms: number) => new Date(T0 + ms).toISOString()
const cutter = {
  outfitId: '101', baseStats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100 }, growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { surface: { turf: 'A', dirt: 'G' }, strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'G', long: 'G' } },
} as const

const withUma = (): Save => unlockUma(newSave('Luis', at(0)), '101', at(0))
const stock = (save: Save, items: Record<string, number>, gems: Record<string, number> = {}): Save => {
  const w = worldOf(save)
  return { ...save, tierWorlds: { '1': { ...w, items: { ...w.items, ...items }, gems: { ...w.gems, ...gems } } } }
}
const setLevel = (save: Save, level: number): Save => {
  const w = worldOf(save)
  return { ...save, tierWorlds: { '1': { ...w, umas: { ...w.umas, '101': { ...w.umas['101']!, level } } } } }
}

describe('Star Gems (D144)', () => {
  it('makes 80 moon gems, 16 bridge gems and 4 Sun gems from refined Wilds items, every family in demand', () => {
    expect(GEMS.filter((g) => g.kind === 'moon')).toHaveLength(80)
    expect(GEMS.filter((g) => g.kind === 'bridge')).toHaveLength(16)
    expect(GEMS.filter((g) => g.kind === 'sun')).toHaveLength(4)
    expect(STAR_NODES).toHaveLength(100)
    const used = new Set(GEMS.flatMap((g) => Object.keys(g.inputs)))
    expect(ITEM_FAMILIES.flatMap((f) => f.refined.map((i) => i.id)).every((id) => used.has(id))).toBe(true)
    expect(gemById('gem-mp-1')).toMatchObject({ name: 'Quartz of Spirit', effects: ['mp'], inputs: { 'mist-infusion': 1 } })
    // D65's structure: a side joins at grade 4, a second at grade 8.
    expect(gemById('gem-atk-4')).toMatchObject({ name: 'Garnet of Strength', inputs: { 'silver-ingot': 1, 'cut-amethyst': 1 } })
    expect(Object.values(gemById('gem-mp-10')!.inputs).reduce((a, b) => a + b, 0)).toBe(3)
    expect(gemById('gem-hp-def-3')!.name).toBe('Citrine of Vigor & Fortitude')
    expect(gemById('gem-sun-4')!.name).toBe('Garnet of the Sun')
  })

  it('opens moons from the lowest up to the gem’s grade, bridges at grades 3 and 7, and the Sun with Sun gems', () => {
    expect(gemNodes(gemById('gem-hp-3')!)).toEqual(['moon:hp:1', 'moon:hp:2', 'moon:hp:3'])
    expect(gemNodes(gemById('gem-hp-def-3')!)).toEqual(['bridge:hp-def:1'])
    expect(gemNodes(gemById('gem-sun-6')!)).toEqual(['sun:1', 'sun:2'])
    // Every node has exactly one gem of its grade.
    for (const node of STAR_NODES) expect(gemNodes(gemById(nodeGem(node))!).at(-1), node).toBe(node)
    // Worth their grade (D141): a grade-1 moon 1, a grade-3 bridge 1.5 to each side, a grade-4 Sun node 0.5 to all.
    expect(starPoints(['moon:hp:1', 'bridge:hp-def:1', 'sun:1'])).toMatchObject({ hp: 3, def: 2, mp: 0.5 })
    expect(starPoints(['moon:atk:10', 'moon:atk:9'])).toMatchObject({ atk: 19 })
  })
})

describe('cutting and setting (D144)', () => {
  it('cuts at the Lapidary with Craft Level, reserving the recipe, and puts gems on their own shelf', () => {
    let save = stock(withUma(), { 'mist-infusion': 2 })
    const plan = planJob(worldOf(save), 'lapidary', cutter, 'gem-mp-1', 2)!
    expect(plan.itemMs).toBe(makeMinutes(1) * MINUTE)
    expect(plan.block).toBeNull()
    expect(planJob(worldOf(save), 'lapidary', cutter, 'gem-mp-2', 1)!.block).toBe('Needs Craft Lv6')
    save = startJob(save, 'lapidary', 0, cutter, 'gem-mp-1', 2, at(0))
    expect(worldOf(save).items).toEqual({}) // two gems: one Mist Infusion each
    save = collectJob(save, 'lapidary', 0, at(2 * plan.itemMs)).save
    expect(worldOf(save).gems).toEqual({ 'gem-mp-1': 2 })
    expect(worldOf(save).umas['101']!.craft).toEqual(grantProfessionExp({ level: 1, exp: 0 }, 2 * makeMinutes(1) * 2))
    expect(worldOf(save).work['101']?.slot ?? null).toBeNull()
  })

  it('sets a gem for its own grade\'s node once the lower ones are open, switches it on while slots last (D119)', () => {
    let save = stock(withUma(), {}, { 'gem-hp-1': 2, 'gem-hp-2': 2 })
    // Grade 2 waits for grade 1, and neither shows as settable until its turn.
    expect(gemBlock(worldOf(save).umas['101']!, 'gem-hp-2')).toBe('Set the grade 1 gem first')
    expect(nodeFromGem(worldOf(save).umas['101']!, 'gem-hp-2')).toBeNull()
    expect(() => setGem(save, '101', 'gem-hp-2', at(0))).toThrow(/grade 1 gem first/)
    save = setGem(save, '101', 'gem-hp-1', at(0)).save
    save = setGem(save, '101', 'gem-hp-2', at(0)).save
    expect(worldOf(save).umas['101']!.stars).toEqual({ unlocked: ['moon:hp:1', 'moon:hp:2'], active: ['moon:hp:1', 'moon:hp:2'] })
    // Set grades are spent.
    expect(() => setGem(save, '101', 'gem-hp-1', at(0))).toThrow(/Already set/)
    expect(() => setGem(save, '101', 'gem-hp-2', at(0))).toThrow(/Already set/)
    expect(worldOf(save).gems).toEqual({ 'gem-hp-1': 1, 'gem-hp-2': 1 })
    expect(() => setActiveNodes(save, '101', ['moon:hp:3'], at(0))).toThrow(/unlocked/)
    save = setActiveNodes(save, '101', ['moon:hp:2'], at(0))
    expect(extraStatPoints(worldOf(save).umas['101']!)).toMatchObject({ hp: 2 })
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
    const boosted = applyPoints(projectRpgStats({ baseStats: cutter.baseStats, growthRates: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 }, tier: 1, level: 1, classId: 'brawler' }), points)
    expect(boosted).toMatchObject({ evasion: 60, limitStart: 4 })

    let save = ['102', '103', '104', '105'].reduce((s, id) => unlockUma(s, id, at(0)), withUma())
    const w = worldOf(save)
    const nodes = ['moon:hp:1', 'moon:speed:1', 'moon:speed:2', 'moon:limit:1', 'moon:limit:2', 'moon:limit:3']
    save = { ...save, tierWorlds: { '1': { ...w, umas: { ...w.umas, '101': { ...w.umas['101']!, level: 4, stars: { unlocked: nodes, active: nodes } } } } } }
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = regionChapter(worldContinent({ name: 'URA', order: 1 }).regions[0]!, [{ id: 'c', name: 'C' }])
    const outfits = new Map(['101', '102', '103', '104', '105'].map((id) => [id, { ...cutter, outfitId: id }]))
    const fighting = startFight(save, ura, 'w1-1-1-s1', outfits, at(0))
    const ally = worldOf(fighting).world.run.battle!.input.allies[0]!
    const plain = projectRpgStats(umaProfile(cutter, { ...worldOf(save).umas['101']! }, 1))
    expect(ally.stats.hp).toBe(Math.round(plain.hp * 1.015))
    // Nodes are worth their grade (D141): Speed 1 + 2 = 3 points, 1.8% evasion; Limit 1 + 2 + 3 = 6, a 2.4 head start.
    expect(ally).toMatchObject({ evasion: 18, limitStart: 2 })
    const state = createBattle(worldOf(fighting).world.run.battle!.input).state
    expect(state.units.find((u) => u.id === '101')!.limit).toBe(2)
    // The same hit lands 1.8% softer on her than without evasion.
    const bare = createBattle({ ...state.input, allies: state.input.allies.map((a) => (a.id === '101' ? { ...a, evasion: undefined } : a)) }).state
    const foe = state.units.find((u) => u.side === 'enemy')!
    const hit = (s: typeof state) => battleDamage(s, foe, s.units.find((u) => u.id === '101')!, 'physical', 4, null).amount
    expect(Math.abs(hit(state) - hit(bare) * 0.982)).toBeLessThanOrEqual(1)
  })
})

describe('save v21: one profession and Star Gems (D144)', () => {
  it('keeps the higher profession level as Craft Level, drops what the catalog no longer has, and widens the facilities', () => {
    const old = JSON.parse(JSON.stringify(unlockUma(withUma(), '102', at(0)))) as Record<string, any>
    old.schemaVersion = 20
    const w = old.tierWorlds['1']
    // A v20 world as it was: two professions, a second Warehouse half, uneaten dishes, and its facilities with two slots.
    w.umas['101'].professions = { farming: { level: 30, exp: 5 }, gathering: { level: 10, exp: 7 } }
    w.umas['102'].professions = { farming: { level: 1, exp: 0 }, gathering: { level: 12, exp: 1 } }
    for (const u of Object.values(w.umas) as Record<string, unknown>[]) delete u.craft
    w.umas['101'].stars = { unlocked: ['moon:hp:1'], active: ['moon:hp:1'] }
    w.items = { wheat: 3, 'copper-ore': 2 }
    delete w.gems
    w.dishes = { 'dish-grains-1': 2 }
    const job = (outfitId: string, output: string) => ({ kind: 'gather', outfitId, output, count: 2, collected: 0, startedAt: at(0), msEach: 1000, expEach: 1, inputs: {}, queue: [] })
    w.facilities = { fields: { level: 1, jobs: [job('102', 'wheat'), null] }, mine: { level: 2, jobs: [job('101', 'copper-ore'), null, null] } }
    const save = parseSave(old)
    const world = worldOf(save)
    // Her mine job's two ores and their 2 EXP land at v22 (SC3), when running jobs finish into the Warehouse.
    expect(world.umas['101']!.craft).toEqual({ level: 30, exp: 7 })
    expect(world.umas['102']!.craft).toEqual({ level: 12, exp: 1 })
    expect(world.umas['101']!.stars).toEqual({ unlocked: ['moon:hp:1'], active: ['moon:hp:1'] })
    expect(world.items).toEqual({ 'copper-ore': 4 })
    expect(world.gems).toEqual({})
    expect(world.buildings).toEqual({ mine: { level: 2 } })
    expect(world.work).toEqual({})
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })
})
