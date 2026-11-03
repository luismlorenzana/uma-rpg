// Windows with the collections live (save v35, D283, H152; the Weapons track since v36, D289).
import { describe, expect, it } from 'vitest'
import { WINDOW_STEP_IDS, windowBoard } from '../rpg/windows'
import { capitalStageIds } from '../world/capital'
import { collectionsLive } from './collections'
import { toV35 } from './migrations'
import { ascendUmas, ascendUmasBlock, signUpBlock, signUpRift } from './rift'
import { OUTFITS, riftWorldSave, T, TWENTY } from './rift-rules.fixture'
import { worldOf } from './rules'
import { newOwnedUma, newSave, parseSave, type OwnedUma, type Save } from './save'
import { championBit, codeDay, dayCode, emptyWindow, stepCode, stepDay, widenSteps, WINDOW_STEPS_LENGTH, withSteps, type WindowRecord } from './window-record'
import { lastLitDay, latchWindows, readyToAscend, recordChampion, recordRiftWin, windowFull, windowMet, windowNext, windowOf, wornFloor } from './windows'

const outfit = OUTFITS.get('101')!
const uma = (change: (u: OwnedUma) => void = () => {}): OwnedUma => {
  const u: OwnedUma = JSON.parse(JSON.stringify({ ...newOwnedUma(T(0)), classId: 'brawler' }))
  change(u)
  return u
}
const ranks = (u: OwnedUma, set: Record<string, number>) => {
  for (const [c, rank] of Object.entries(set)) (u.ranks.classes as Record<string, { rank: number; exp: number }>)[c] = { rank, exp: 0 }
}
const allGrades = (u: OwnedUma, grade: number) => {
  const g = u.gear as { weapons: Record<string, { grade: number }>; armor: Record<string, { grade: number }>; accessories: { grade: number }[] }
  for (const w of ['greatsword', 'axe', 'lance', 'bow', 'katana', 'fire', 'ice', 'lightning', 'light', 'dark']) g.weapons[w] = { grade }
  for (const s of ['head', 'body', 'legs', 'arms', 'feet']) g.armor[s] = { grade }
  for (const a of g.accessories) a.grade = grade
}
const nodes = (u: OwnedUma, upTo: number) => {
  const open: string[] = []
  for (const body of ['planet', 'prowess', 'vigor', 'guard']) for (let i = 1; i <= upTo; i++) open.push(`${body}:${i}`)
  ;(u.stars as { open: string[] }).open = open
}
const ids = (set: Set<string>) => [...set].sort()

describe('the switch', () => {
  it('is on here, and a new save starts its windows at once', () => {
    expect(collectionsLive()).toBe(true)
    const save = newSave('W', T(0))
    expect(save.schemaVersion).toBe(36)
    expect(save.account).toMatchObject({ windows: {}, windowsStart: T(0) })
    expect(save.tierWorlds['1']!.drills).toEqual({ day: null, runs: 10, won: {} })
    expect(save.tierWorlds['1']!.wallet.trainingLogs).toBe(0)
  })
})

describe('the board', () => {
  it('has 36 steps in Tiers 1 and 2, 35 in Tier 3: the record v35\'s 31 then Weapons, the board Weapons after Gear (D289)', () => {
    expect(new Set(windowBoard(1, true).map((s) => s.id))).toEqual(new Set(WINDOW_STEP_IDS))
    expect(WINDOW_STEP_IDS.slice(30)).toEqual(['rift', 'weapons-1', 'weapons-2', 'weapons-3', 'weapons-4', 'weapons-5'])
    expect(windowBoard(1, true).map((s) => s.track).filter((t, i, all) => all.indexOf(t) === i)).toEqual(['level', 'class', 'craft', 'gear', 'weapons', 'stars', 'world', 'rift'])
    expect(windowBoard(3, false)).toHaveLength(35)
    expect(windowBoard(1, true).find((s) => s.id === 'weapons-3')!.rule).toBe('Five weapons at G6')
    expect(windowBoard(2, true).find((s) => s.id === 'world-1')!.rule).toBe("Continent 6: its capital's three champions")
  })
})

describe('windowMet', () => {
  it('reads Level and Craft at 10, 20 … 50', () => {
    expect(ids(windowMet(uma((u) => { u.level = 29; u.craft = { level: 30, exp: 0 } }), outfit, 1, 0)))
      .toEqual(['craft-1', 'craft-2', 'craft-3', 'level-1', 'level-2'])
    expect(windowMet(uma((u) => { u.level = 50 }), outfit, 1, 0).has('level-5')).toBe(true)
    expect(windowMet(uma((u) => { u.level = 49 }), outfit, 1, 0).has('level-5')).toBe(false)
  })

  it('reads Class from her best classes, not the one she fights as', () => {
    const tier0 = uma((u) => { u.classId = null; ranks(u, { recruit: 10 }) })
    expect(windowMet(tier0, outfit, 1, 0).has('class-1')).toBe(true)
    expect(windowMet(tier0, outfit, 2, 0).has('class-1')).toBe(false)
    const masters = uma((u) => { u.classId = 'paladin'; ranks(u, { brawler: 50, spellblade: 50, armsummoner: 49, paladin: 12 }) })
    expect(ids(windowMet(masters, outfit, 1, 0)).filter((s) => s.startsWith('class'))).toEqual(['class-1', 'class-2', 'class-3', 'class-4'])
    ranks(masters, { armsummoner: 50 })
    expect(windowMet(masters, outfit, 1, 0).has('class-5')).toBe(true)
  })

  it('reads Gear from the lowest of her eleven worn slots', () => {
    const u = uma((x) => allGrades(x, 6))
    expect(wornFloor(u, outfit, 1)).toBe(6)
    expect(ids(windowMet(u, outfit, 1, 0)).filter((s) => s.startsWith('gear'))).toEqual(['gear-1', 'gear-2', 'gear-3'])
    ;(u.gear as { accessories: { grade: number }[] }).accessories[2]!.grade = 5
    expect(windowMet(u, outfit, 1, 0).has('gear-3')).toBe(false)
    // A weapon she doesn't wear doesn't count.
    ;(u.gear as { accessories: { grade: number }[]; weapons: Record<string, { grade: number }> }).accessories[2]!.grade = 6
    ;(u.gear as { weapons: Record<string, { grade: number }> }).weapons.katana = { grade: 0 }
    expect(windowMet(u, outfit, 1, 0).has('gear-3')).toBe(true)
  })

  it('reads Stars by node rank, with her moon from II and IV', () => {
    const u = uma((x) => nodes(x, 4))
    expect(ids(windowMet(u, outfit, 1, 0)).filter((s) => s.startsWith('stars'))).toEqual(['stars-1', 'stars-2', 'stars-3', 'stars-4'])
    ;(u.stars as { open: string[] }).open = (u.stars as { open: string[] }).open.filter((n) => n !== 'planet:4')
    expect(windowMet(u, outfit, 1, 0).has('stars-4')).toBe(false)
  })

  it('reads World from the champions she beat: all three a continent', () => {
    const two = championBit(1, 1) + championBit(1, 2)
    expect(windowMet(uma(), outfit, 1, two).has('world-1')).toBe(false)
    expect(windowMet(uma(), outfit, 1, two + championBit(1, 3)).has('world-1')).toBe(true)
  })
})

describe('the record', () => {
  it('keeps a step\'s first day', () => {
    const lit = withSteps(emptyWindow(), ['level-1'], T(0))
    expect(stepDay(lit, 'level-1')).toBe('2026-10-20')
    expect(withSteps(lit, ['level-1'], '2026-12-01T00:00:00Z')).toBe(lit)
    expect(codeDay(dayCode('2026-01-01T23:59:00Z'))).toBe('2026-01-01')
    expect(lit.steps).toHaveLength(WINDOW_STEPS_LENGTH)
  })

  it('stays inside the budget: 270 Umas, one tier, under 45 KB (36 steps since v36)', () => {
    const full = withSteps(emptyWindow(), WINDOW_STEP_IDS, T(0))
    const windows = Object.fromEntries(Array.from({ length: 270 }, (_, i) => [String(100101 + i), { '1': { ...full, champions: 32767 } }]))
    expect(JSON.stringify(windows).length).toBeLessThan(45_000)
  })
})

/** A save whose credit already ran, so latching is the everyday kind. */
const started = (save: Save): Save => ({ ...save, account: { ...save.account, windowsStart: T(0) } })

describe('latchWindows', () => {
  it('lights what her state meets, keeps old days, and returns the same save when nothing is new', () => {
    const base = started(riftWorldSave(5, 20))
    const once = latchWindows(base, OUTFITS, T(10))
    expect(windowOf(once, '101', 1).steps.filter((s) => s.day !== null).map((s) => s.id)).toEqual(['level-1', 'level-2'])
    expect(latchWindows(once, OUTFITS, '2026-12-01T00:00:00Z')).toBe(once)
  })

  it('never darkens a step, and a full Tier 3 window stays full if a Rift arrives', () => {
    const base = started(riftWorldSave(1, 30))
    const lit = latchWindows(base, OUTFITS, T(10))
    const lower = { ...lit, tierWorlds: { ...lit.tierWorlds, '1': { ...worldOf(lit, '1'), umas: { '101': { ...worldOf(lit, '1').umas['101']!, level: 1 } } } } }
    expect(windowOf(latchWindows(lower, OUTFITS, T(20)), '101', 1).steps.find((s) => s.id === 'level-3')!.day).toBe('2026-10-20')
    const tier3: WindowRecord = withSteps(emptyWindow(), WINDOW_STEP_IDS.filter((id) => id !== 'rift'), T(0))
    expect(windowFull(tier3, 3)).toBe(true)
  })

  it('pays the switch\'s credit the first time: World by the world\'s champions and her level, the Rift by won runs', () => {
    const save: Save = JSON.parse(JSON.stringify(riftWorldSave(25, 50)))
    save.account.windowsStart = null
    const world = worldOf(save, '1')
    for (const route of [1, 2, 3]) world.world.run.wins[capitalStageIds('w1', route).champion] = 1
    world.umas['125']!.level = 9
    const run = signUpRift(save, TWENTY, T(1))
    Object.assign(worldOf(run, '1').rift.runs[0]!, { fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 }, convergence: { attempts: 1, open: null }, wonAt: T(50) })
    const credited = latchWindows(run, OUTFITS, T(60))
    expect(credited.account.windowsStart).toBe(T(60))
    expect(windowOf(credited, '101', 1).steps.find((s) => s.id === 'world-1')!.day).not.toBeNull()
    expect(windowOf(credited, '125', 1).steps.find((s) => s.id === 'world-1')!.day).toBeNull()
    expect(windowOf(credited, '101', 1).steps.find((s) => s.id === 'rift')!.day).toBe('2026-10-20')
    expect(windowOf(credited, '121', 1).steps.find((s) => s.id === 'rift')!.day).toBeNull()
  })
})

describe('the hooks', () => {
  it('records a won capital champion for each entrant, and nothing for another stage', () => {
    const save = started(riftWorldSave(5, 20))
    const after = recordChampion(save, '1', capitalStageIds('w2', 3).champion, ['101', '102'])
    expect(after.account.windows!['101']!['1']!.champions).toBe(championBit(2, 3))
    expect(recordChampion(save, '1', 'w1-1-1-s12', ['101'])).toBe(save)
    expect(recordChampion(after, '1', capitalStageIds('w2', 3).champion, ['101', '102'])).toBe(after)
  })

  it('records the Rift step for a won run\'s twenty', () => {
    const after = recordRiftWin(started(riftWorldSave()), '1', TWENTY, T(5))
    expect(TWENTY.every((id) => stepCode(after.account.windows![id]!['1']!, 'rift') === dayCode(T(5)))).toBe(true)
  })

  it('shows each track\'s share and the window\'s percent', () => {
    const lit = latchWindows(started(riftWorldSave(1, 30)), OUTFITS, T(10))
    const view = windowOf(lit, '101', 1)
    expect(view).toMatchObject({ lit: 3, total: 36, percent: 8, full: false })
    expect(view.tracks.find((t) => t.track === 'level')).toEqual({ track: 'level', lit: 3, total: 5, percent: 60 })
  })
})

describe('Weapons (save v36, D289)', () => {
  const graded = (grades: Record<string, number>) => uma((u) => {
    const g = u.gear as { weapons: Record<string, { grade: number }> }
    g.weapons = Object.fromEntries(Object.entries(grades).map(([w, grade]) => [w, { grade }]))
  })

  it('lights a step at five weapon kinds of that grade, any class\'s', () => {
    expect(ids(windowMet(graded({ greatsword: 4, axe: 4, lance: 4, bow: 4 }), outfit, 1, 0)).filter((id) => id.startsWith('weapons'))).toEqual([])
    expect(ids(windowMet(graded({ greatsword: 6, axe: 4, lance: 4, bow: 4, katana: 4 }), outfit, 1, 0)).filter((id) => id.startsWith('weapons')))
      .toEqual(['weapons-1', 'weapons-2'])
  })

  it('says what\'s left toward the next one', () => {
    const save = started(riftWorldSave(1, 50))
    const next = windowNext(save, graded({ greatsword: 2, axe: 2, lance: 2 }), outfit, '101', 1).find((n) => n.track === 'weapons')
    expect(next).toEqual({ track: 'weapons', numeral: 1, have: 3, need: 5, grade: 2 })
  })

  it('widens a v35 record: five dark steps, or a full window\'s last day', () => {
    const v35 = (codes: string[]) => codes.join('')
    expect(widenSteps(v35(Array(31).fill('---')))).toBe('---'.repeat(36))
    const full = Array.from({ length: 31 }, (_, i) => (i === 7 ? '0a9' : '08h'))
    expect(widenSteps(v35(full))).toBe(v35(full) + '0a9'.repeat(5))
    expect(widenSteps('---'.repeat(36))).toBe('---'.repeat(36))
  })

  it('parses a v35 save\'s windows into v36\'s', () => {
    const save = JSON.parse(JSON.stringify(newSave('W', T(0))))
    save.schemaVersion = 35
    save.account.windows = { '101': { '1': { steps: '08h'.repeat(5) + '---'.repeat(26), champions: 0 } } }
    const parsed = parseSave(save)
    expect(parsed.schemaVersion).toBe(36)
    expect(parsed.account.windows!['101']!['1']!.steps).toBe('08h'.repeat(5) + '---'.repeat(31))
  })
})

describe('the board on screen (H155)', () => {
  it('gives each track\'s next dark step and what she has toward it', () => {
    const lit = latchWindows(started(riftWorldSave(1, 34)), OUTFITS, T(10))
    const her = worldOf(lit, '1').umas['101']!
    const next = new Map(windowNext(lit, her, outfit, '101', 1).map((n) => [n.track, n]))
    expect(next.get('level')).toEqual({ track: 'level', numeral: 4, have: 34, need: 40 })
    expect(next.get('craft')).toMatchObject({ numeral: 1, need: 10 })
    expect(next.get('gear')).toMatchObject({ numeral: 1, need: 11, grade: 2 })
    expect(next.get('stars')).toMatchObject({ numeral: 1, need: 4 })
    expect(next.get('world')).toEqual({ track: 'world', numeral: 1, have: 0, need: 3 })
  })

  it('counts a continent\'s champions and the moon\'s nodes toward the next step', () => {
    const save = recordChampion(started(riftWorldSave(1, 10)), '1', capitalStageIds('w1', 2).champion, ['101'])
    const her = uma((u) => nodes(u, 1))
    const next = new Map(windowNext(save, her, outfit, '101', 1).map((n) => [n.track, n]))
    expect(next.get('world')).toMatchObject({ numeral: 1, have: 1, need: 3 })
    expect(next.get('stars')).toMatchObject({ numeral: 1, have: 4, need: 4 })
  })

  it('names her last lit day, and the world\'s ready Umas', () => {
    const save = started(riftWorldSave(1, 30))
    expect(lastLitDay(save, '101', 1)).toBeNull()
    expect(lastLitDay(latchWindows(save, OUTFITS, T(10)), '101', 1)).toBe(T(10).slice(0, 10))
    const full = { ...save, account: { ...save.account, windows: { '101': { '1': withSteps(emptyWindow(), WINDOW_STEP_IDS, T(3)) } } } }
    expect(readyToAscend(full, 1)).toEqual(['101'])
    expect(readyToAscend(full, 3)).toEqual([])
  })
})

describe('save v35', () => {
  it('adds Drills and Training Logs to a v34 world, and nothing else', () => {
    const world = { wallet: { laurels: 3 }, umas: { '101': { level: 2 } } }
    expect(toV35(world)).toEqual({ wallet: { laurels: 3, trainingLogs: 0 }, umas: { '101': { level: 2 } }, drills: { day: null, runs: 10, won: {} } })
  })

  it('parses a v34 save into v35 with empty windows still to credit, and round-trips a v35 one', () => {
    const v35 = newSave('W', T(0))
    const v34 = JSON.parse(JSON.stringify(v35))
    v34.schemaVersion = 34
    delete v34.account.windows
    delete v34.account.windowsStart
    delete v34.tierWorlds['1'].drills
    delete v34.tierWorlds['1'].wallet.trainingLogs
    const parsed = parseSave(v34)
    expect(parsed.account).toMatchObject({ windows: {}, windowsStart: null })
    expect(parsed.tierWorlds['1']!.drills).toEqual({ day: null, runs: 10, won: {} })
    const lit = recordChampion(recordRiftWin(newSave('W', T(0)), '1', ['101'], T(5)), '1', capitalStageIds('w1', 2).champion, ['101'])
    expect(parseSave(JSON.parse(JSON.stringify(lit))).account.windows).toEqual(lit.account.windows)
  })

  it('refuses a malformed record', () => {
    const save = JSON.parse(JSON.stringify(newSave('W', T(0))))
    save.account.windows = { '101': { '1': { steps: '#'.repeat(108), champions: 0 } } }
    expect(() => parseSave(save)).toThrow(/steps/)
    save.account.windows = { '101': { '1': { steps: '---'.repeat(36), champions: 32768 } } }
    expect(() => parseSave(save)).toThrow(/champions/)
  })
})

describe('Ascend one Uma at a time', () => {
  const won = (): Save => {
    const save = signUpRift(started(riftWorldSave()), TWENTY, T(1))
    Object.assign(worldOf(save, '1').rift.runs[0]!, { fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 }, convergence: { attempts: 1, open: null }, wonAt: T(50) })
    return save
  }
  const fill = (save: Save, id: string): Save => {
    const windows = { ...save.account.windows, [id]: { '1': withSteps(emptyWindow(), WINDOW_STEP_IDS, T(55)) } }
    return { ...save, account: { ...save.account, windows } }
  }

  it('lets a new run sign up once the last one is won', () => {
    const save = won()
    expect(signUpBlock(save, [...TWENTY.slice(1), '121'])).toBeNull()
  })

  it('takes only Umas whose window is full', () => {
    expect(ascendUmasBlock(won(), ['101'])).toBe('Window not full: 101')
    expect(ascendUmasBlock(fill(won(), '101'), ['101'])).toBeNull()
  })

  it('moves her alone, with her purse, her run in her history, and the old Rift as it was', () => {
    const before = fill(fill(won(), '101'), '102')
    const { save, summary } = ascendUmas(before, ['101', '102'], T(70))
    expect(summary).toMatchObject({ from: 1, to: 2, umas: ['101', '102'], laurels: 2000, speedTickets: 10 })
    expect(worldOf(save, '1').umas['101']).toBeUndefined()
    expect(worldOf(save, '1').umas['103']).toBeDefined()
    expect(worldOf(save, '2').umas['101']!.level).toBe(1)
    expect(save.account.history['101']).toEqual([{ tier: 2, at: T(70), run: 't1-r1' }])
    expect(worldOf(save, '1').rift.runs[0]!.ascendedAt).toBeNull()
    expect(worldOf(save, '2').parties[0]!.slots.slice(0, 2)).toEqual(['101', '102'])
  })

  it('parses a won run whose twenty went up one by one, followed by a new run', () => {
    const save = JSON.parse(JSON.stringify(newSave('W', T(0)))) as Save
    const world = save.tierWorlds['1']!
    const next = Array.from({ length: 20 }, (_, i) => String(121 + i))
    for (const id of next) world.umas[id] = { ...newOwnedUma(T(0)), level: 50 }
    const sealed = { iron: 12, arcane: 12, duel: 12, horde: 12 }
    world.rift.runs = [
      { id: 't1-r1', roster: TWENTY, startedAt: T(1), fronts: sealed, convergence: { attempts: 1, open: null }, traces: {}, wonAt: T(50), ascendedAt: null },
      { id: 't1-r2', roster: next, startedAt: T(60), fronts: { iron: 0, arcane: 0, duel: 0, horde: 0 }, convergence: { attempts: 0, open: null }, traces: {}, wonAt: null, ascendedAt: null },
    ]
    save.tierWorlds['2'] = { ...newSave('W', T(0)).tierWorlds['1']!, umas: { '101': newOwnedUma(T(70)) } }
    save.account.history = { '101': [{ tier: 2, at: T(70), run: 't1-r1' }] }
    expect(() => parseSave(JSON.parse(JSON.stringify(save)))).not.toThrow()
  })
})
