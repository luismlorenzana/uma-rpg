import { describe, expect, it } from 'vitest'
import { capitalRunId, capitalRunNodeId, capitalRunNodeOf, capitalRunOf, isCapitalRunChapter } from './capital-run-id'

describe('capital run ids (D293, H159)', () => {
  it('names a run and its sixteen fights', () => {
    expect(capitalRunId('w1', 3)).toBe('w1-run3')
    expect(capitalRunNodeId('w1-run3', 2, 1)).toBe('w1-run3-l2-g1')
    expect(capitalRunNodeId('w1-run3', 4, 'final')).toBe('w1-run3-l4-final')
    expect(capitalRunOf('w12-run40')).toEqual({ continentId: 'w12', n: 40 })
    expect(isCapitalRunChapter({ id: 'w1-run3' })).toBe(true)
    for (const id of ['w1-capital', 'drills-t1', 'w1-run0', 'w1-run03', 'run3', 'w1-3-2']) expect(isCapitalRunChapter({ id }), id).toBe(false)
  })

  it('reads every fight back to its run, lane and step', () => {
    for (let lane = 1; lane <= 4; lane++) {
      for (const step of [1, 2, 3, 'final'] as const) {
        const id = capitalRunNodeId('w7-run12', lane, step)
        expect(capitalRunNodeOf(id)).toEqual({ runId: 'w7-run12', continentId: 'w7', lane,
          general: step === 'final' ? null : step, final: step === 'final' })
      }
    }
  })

  it('refuses ids that aren’t a run’s', () => {
    for (const id of ['w1-run3-l5-g1', 'w1-run3-l0-g1', 'w1-run3-l1-g4', 'w1-run3-l1-g0', 'w1-run3-l1', 'w1-run3-l1-final-s1',
      'w1-capital-r1-s1', 'w1-3-2-s5', 'drill-t1-1', 'w0-run1-l1-g1']) expect(capitalRunNodeOf(id), id).toBeNull()
    for (const [c, n] of [['w0', 1], ['x1', 1], ['w1', 0], ['w1', 1.5], ['w1', -2], ['w1', NaN]] as const) {
      expect(() => capitalRunId(c, n), `${c} ${n}`).toThrow(RangeError)
    }
    expect(() => capitalRunNodeId('w1-capital', 1, 1)).toThrow(RangeError)
    expect(() => capitalRunNodeId('w1-run1', 5, 1)).toThrow(RangeError)
    expect(() => capitalRunNodeId('w1-run1', 1, 4 as 1)).toThrow(RangeError)
  })
})
