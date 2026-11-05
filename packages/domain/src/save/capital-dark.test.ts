import { describe, expect, it } from 'vitest'
import { windowBoard } from '../rpg/windows'
import { capitalRunChapter } from '../world/capital'
import { worldContinent } from '../world/world'
import { abandonCapitalRun, capitalFightBlock, capitalRunBlock, startCapitalFight, startCapitalRun } from './capital'
import { capitalRunsLive } from './collections'
import { OUTFITS, riftWorldSave, ROSTER, T } from './rift-rules.fixture'
import { newSave, parseSave, parseSaveAsync } from './save'
import { recordCapitalWin, recordChampion } from './windows'

describe('capital runs stay dark on the production version (H160)', () => {
  it('keeps v36 saves byte-for-byte unchanged through both parsers, with no new fields', async () => {
    const s = newSave('Dark capitals', T(0)), before = JSON.stringify(s)
    expect(s.schemaVersion).toBe(36)
    expect(capitalRunsLive()).toBe(false)
    expect(s.tierWorlds['1']).not.toHaveProperty('capitalRuns')
    expect(s.tierWorlds['1']).not.toHaveProperty('capitals')
    expect(JSON.stringify(parseSave(s))).toBe(before)
    expect(JSON.stringify(await parseSaveAsync(s))).toBe(before)
  })

  it('refuses every new action without moving the save, and retains today’s champion credit and rule', () => {
    const s = riftWorldSave(), before = structuredClone(s)
    const dark = 'Capital runs come with save v37', chapter = capitalRunChapter(worldContinent({ name: 'Test Continent', order: 1 }), 'w1-run1', ROSTER)
    expect(capitalRunBlock(s, 'w1', [0, 1, 2, 3])).toBe(dark)
    expect(capitalFightBlock(s, 'w1-run1', 1, 'general', OUTFITS)).toBe(dark)
    expect(() => startCapitalRun(s, 'w1', [0, 1, 2, 3], T(1))).toThrow(dark)
    expect(() => startCapitalFight(s, chapter, 'w1-run1', 1, 'general', OUTFITS, T(1))).toThrow(dark)
    expect(() => abandonCapitalRun(s, 'w1-run1', T(1))).toThrow(dark)
    expect(recordCapitalWin(s, '1', 'w1', ['101'], T(1))).toBe(s)
    expect(s).toEqual(before)
    expect(windowBoard(1, true).find((n) => n.id === 'world-1')!.rule).toBe("Continent 1: its capital's three champions")
    expect(recordChampion(s, '1', 'w1-capital-r1-s2', ['101']).account.windows!['101']!['1']!.champions).toBe(1)
  })
})
