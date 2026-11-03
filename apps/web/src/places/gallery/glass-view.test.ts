import { describe, expect, it } from 'vitest'
import {
  ascendLines, cantGo, collectionPercent, dayLabel, litBetween, litRgba, nextLabel, rankGallery, stepLabel, windowCount, windowToast, type GalleryEntry,
} from './glass-view'

describe('litRgba', () => {
  // uma-platform's `litPixels` cases (P84), on RGBA: the lead, a pane early in the order, one late, and the face.
  const px = [200, 100, 50, 255]
  const window = Uint8ClampedArray.from([...px, ...px, ...px, ...px])
  const order = Uint8ClampedArray.from([0, 0, 0, 255, 25, 25, 25, 255, 250, 250, 250, 255, 255, 255, 255, 255])
  const dark = (() => {
    const [r, g, b] = px as [number, number, number]
    const y = 0.299 * r + 0.587 * g + 0.114 * b
    return [Math.round((0.3 * r + 0.7 * y) * 0.16 + 9), Math.round((0.3 * g + 0.7 * y) * 0.16 + 11), Math.round((0.3 * b + 0.7 * y) * 0.16 + 18), 255]
  })()
  const shown = (n: number, steps = 31) => Array.from(litRgba(window, order, n, steps))

  it('draws only the lead at 0 of 31', () => {
    expect(shown(0)).toEqual([...px, ...dark, ...dark, ...dark])
  })

  it('lights a pane once 250 × lit ÷ 30 reaches it', () => {
    expect(shown(2)).toEqual([...px, ...dark, ...dark, ...dark])
    expect(shown(3)).toEqual([...px, ...px, ...dark, ...dark])
  })

  it('keeps the face for the last step', () => {
    expect(shown(30)).toEqual([...px, ...px, ...px, ...dark])
    expect(shown(31)).toEqual([...px, ...px, ...px, ...px])
    expect(shown(30, 30)).toEqual([...px, ...px, ...px, ...px])
  })

  it('draws a window without a map whole when full, else dark', () => {
    expect(Array.from(litRgba(window, null, 31, 31))).toEqual([...px, ...px, ...px, ...px])
    expect(Array.from(litRgba(window, null, 12, 31))).toEqual([...dark, ...dark, ...dark, ...dark])
  })
})

describe('the board’s words', () => {
  it('counts with a share, and names each step short', () => {
    expect(windowCount({ lit: 14, total: 31, percent: 45 })).toBe('14/31 · 45%')
    expect(dayLabel('2026-11-02')).toBe('2 Nov')
    expect(stepLabel({ track: 'level', numeral: 3, rule: '' }, 1)).toBe('Lv 30')
    expect(stepLabel({ track: 'class', numeral: 4, rule: '' }, 1)).toBe('2 at R50')
    expect(stepLabel({ track: 'gear', numeral: 3, rule: '' }, 1)).toBe('G6')
    expect(stepLabel({ track: 'world', numeral: 2, rule: '' }, 2)).toBe('Cont. 7')
    expect(stepLabel({ track: 'rift', numeral: null, rule: '' }, 1)).toBe('Rift')
  })

  it('says what’s left on a track', () => {
    expect(nextLabel({ track: 'level', numeral: 4, have: 34, need: 40 })).toBe('Lv 34/40')
    expect(nextLabel({ track: 'class', numeral: 5, have: 41, need: 50 })).toBe('R41/50')
    expect(nextLabel({ track: 'gear', numeral: 3, have: 8, need: 11, grade: 6 })).toBe('8 of 11 at G6')
    expect(nextLabel({ track: 'world', numeral: 1, have: 1, need: 3 })).toBe('1 of 3')
  })
})

describe('the Gallery', () => {
  const entry = (id: string, lit: number, last: string | null, name = id): GalleryEntry => ({ id, lit, total: 31, percent: Math.round((100 * lit) / 31), last, name })

  it('ranks most complete first, ties to whoever lit her last step first, then by name (CO37)', () => {
    const ranked = rankGallery([entry('b', 14, '2026-11-02'), entry('a', 31, '2026-11-05'), entry('c', 14, '2026-11-01'), entry('e', 0, null, 'Zed'),
      entry('d', 0, null, 'Abe')])
    expect(ranked.map((e) => e.id)).toEqual(['a', 'c', 'b', 'd', 'e'])
  })

  it('shares the world’s lit steps over every owned Uma’s (CO36)', () => {
    expect(collectionPercent([{ lit: 31, total: 31 }, { lit: 0, total: 31 }])).toBe(50)
    expect(collectionPercent([])).toBe(0)
  })

  it('words Ascend for the ticked', () => {
    expect(ascendLines({ to: 2, laurels: 2_000, speedTickets: 10, classMarks: 0 }, 1)).toEqual([
      'Lv 1 in Tier 2', 'Ranks, skills and stars restart', 'Gear returns to Tier 1’s stock', '+2,000 Laurels · +10 Speed Tickets',
    ])
    expect(ascendLines({ to: 3, laurels: 1_000, speedTickets: 5, classMarks: 40 }, 2).at(-1)).toBe('+40 Class Marks')
    expect(cantGo('Recall or collect: Mihono Bourbon')).toBe('At work · recall first')
  })
})

describe('the toast', () => {
  const dark = '---'.repeat(36)
  const at = (steps: string, i: number) => `${steps.slice(0, 3 * i)}0a1${steps.slice(3 * i + 3)}`

  it('finds the steps a change lit, and only those', () => {
    const before = { a: { '1': { steps: at(dark, 0), champions: 0 } } }
    const after = { a: { '1': { steps: at(at(dark, 0), 12), champions: 0 } }, b: { '2': { steps: at(dark, 30), champions: 0 } } }
    expect(litBetween(before, after)).toEqual([{ outfitId: 'a', tier: 1, ids: ['craft-3'] }, { outfitId: 'b', tier: 2, ids: ['rift'] }])
    expect(litBetween(after, after)).toEqual([])
  })

  it('names one Uma’s step, or counts several', () => {
    expect(windowToast([{ outfitId: 'a', tier: 1, ids: ['craft-3'] }], () => 'Mihono Bourbon')).toEqual({ title: 'Mihono Bourbon', line: 'Window +1 · Craft 30' })
    expect(windowToast([{ outfitId: 'a', tier: 1, ids: ['craft-3', 'level-3'] }], () => 'M')?.line).toBe('Window +2')
    expect(windowToast([{ outfitId: 'a', tier: 1, ids: ['craft-3'] }, { outfitId: 'b', tier: 1, ids: ['rift'] }], () => 'M')?.line).toBe('Windows +2 · 2 Umas')
    expect(windowToast([], () => 'M')).toBeNull()
  })
})
