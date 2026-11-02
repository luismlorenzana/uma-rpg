// The Drills page's words (D283, H154).
import { placeById } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { fightPlace } from '../scenario-gate/fight-place'
import { drillRows, logCounts, runsLine } from './drills-view'

const TODAY = '2026-11-02'

describe('the Drills page', () => {
  it('says the day\'s runs and when more come', () => {
    expect(runsLine(undefined, TODAY)).toBe('Runs 10 · +10 at 4:00')
    expect(runsLine({ day: '2026-10-30', runs: 5, won: {} }, TODAY)).toBe('Runs 30 · full')
  })

  it('lists five Drills with their level and Logs, the won ones marked', () => {
    const rows = drillRows({ day: TODAY, runs: 10, won: { 'drill-2': TODAY } }, [10, 20, 30, 40, 50])
    expect(rows.map((r) => [r.name, r.level, r.logs, r.won])).toEqual([
      ['Drill I', 'Lv 10', '2 Logs a win', false], ['Drill II', 'Lv 20', '3 Logs a win', true], ['Drill III', 'Lv 30', '4 Logs a win', false],
      ['Drill IV', 'Lv 40', '5 Logs a win', false], ['Drill V', 'Lv 50', '6 Logs a win', false]])
    expect(drillRows(undefined, [60, 70, 80, 90, 100])[0]!.level).toBe('T2 Lv 10')
  })
})

describe('the Logs sheet\'s counts', () => {
  it('offers 1, 5, 10, To the next ten and Max, inside what she can take and the world holds', () => {
    expect(logCounts(23, 0, 100).map((c) => [c.label, c.count])).toEqual([['1', 1], ['5', 5], ['10', 10], ['To Lv 30', 21], ['Max', 81]])
    expect(logCounts(48, 0, 4).map((c) => [c.label, c.count])).toEqual([['1', 1], ['Max', 4]])
    expect(logCounts(50, 0, 10)).toEqual([])
    expect(logCounts(10, 0, 0)).toEqual([])
  })
})

describe('an open Drill', () => {
  it('resumes on the Drills page, any other fight where it was', () => {
    const gate = placeById('scenario-gate')!
    expect(fightPlace(gate, 'drill-t1-3').id).toBe('drills')
    expect(fightPlace(gate, 'w1-1-1-s4').id).toBe('scenario-gate')
    expect(fightPlace(gate, undefined).id).toBe('scenario-gate')
  })
})
