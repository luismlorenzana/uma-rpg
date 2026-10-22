import { MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import type { RiftFightResult } from '@rpg/domain/rift'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { domMax } from 'motion/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Campaign } from '../../battle/campaign'
import { riftResultView } from './rift-view'
import { againRef } from './RiftFightRoute'
import { RiftResult } from './RiftResult'

const campaign = { view: { art: null }, outfits: new Map(), cast: { byId: new Map() }, name: (id: string) => `Uma ${id}` } as unknown as Campaign
const base = { rounds: 6, members: [], gearMarks: 0, classMarks: 0, cleared: null, attempt: null, runWon: false, earned: [] }
const front = (stage: number, outcome: 'victory' | 'loss', cleared: number | null): RiftFightResult =>
  ({ ...base, outcome, ref: { kind: 'front', front: 'iron', stage }, cleared })
const convergence = (fight: number, outcome: 'victory' | 'loss', attempt: number | null, runWon = false): RiftFightResult =>
  ({ ...base, outcome, ref: { kind: 'convergence', fight }, attempt, runWon })
const echo: RiftFightResult = {
  ...base, outcome: 'victory', ref: { kind: 'echo', front: 'arcane', level: '55' }, gearMarks: 0, classMarks: 120,
  members: [{ outfitId: '101', exp: 0, beforeLevel: 50, afterLevel: 50, afterExp: 0, shards: 0, bonds: [], ranks: [
    { ref: { kind: 'class', id: 'mage' }, exp: 1300, before: { rank: 4, exp: 100 }, after: { rank: 9, exp: 40 } },
    { ref: { kind: 'weapon', id: 'tome-fire' }, exp: 650, before: { rank: 3, exp: 0 }, after: { rank: 5, exp: 10 } },
  ] }],
}

beforeEach(() => {
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  setReducedMotion(true)
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('the Rift result’s words (H50)', () => {
  it('reads a front’s stage, its seal and a loss', () => {
    expect(riftResultView(front(5, 'victory', 5))).toEqual({ heading: 'Victory!', lines: ['6 rounds', 'Stage 5 cleared · 5/12'], again: 'Next stage', back: 'Back to the Rift' })
    expect(riftResultView(front(12, 'victory', 12))).toEqual({ heading: 'Victory!', lines: ['6 rounds', 'Iron sealed'], again: null, back: 'Back to the Rift' })
    expect(riftResultView(front(5, 'loss', null))).toEqual({ heading: 'Defeated', lines: ['6 rounds', 'No penalty'], again: 'Retry', back: 'Back to the Rift' })
  })

  it('reads the Convergence’s fights, its win and a lost attempt', () => {
    expect(riftResultView(convergence(1, 'victory', 2))).toMatchObject({ lines: ['6 rounds', 'Fight 2 of 4 won'], again: 'Next: Duel' })
    expect(riftResultView(convergence(0, 'victory', 1))).toMatchObject({ again: 'Next: Arcane' })
    expect(riftResultView(convergence(3, 'victory', 4, true))).toMatchObject({ lines: ['6 rounds', 'The Rift is won!'], again: null })
    expect(riftResultView(convergence(2, 'loss', null))).toMatchObject({ heading: 'Defeated', lines: ['6 rounds', 'The attempt is over'], again: null })
  })

  it('reads an Echo and its Sweeps', () => {
    expect(riftResultView(echo)).toMatchObject({ lines: ['6 rounds'], again: 'Fight again' })
    expect(riftResultView({ ...echo, rounds: 0, swept: 5 })).toMatchObject({ lines: ['Swept 5 times'], again: 'Sweep again' })
    expect(riftResultView({ ...echo, rounds: 0, swept: 1 })).toMatchObject({ lines: ['Swept with a ticket'] })
    expect(riftResultView({ ...echo, outcome: 'loss', members: [] })).toMatchObject({ heading: 'Defeated', again: 'Retry' })
  })

  it('follows each result with its next fight', () => {
    expect(againRef(front(5, 'victory', 5))).toEqual({ kind: 'front', front: 'iron', stage: 6 })
    expect(againRef(front(12, 'victory', 12))).toBeNull()
    expect(againRef(front(5, 'loss', null))).toEqual({ kind: 'front', front: 'iron', stage: 5 })
    expect(againRef(convergence(1, 'victory', 2))).toEqual({ kind: 'convergence', fight: 2 })
    expect(againRef(convergence(3, 'victory', 4, true))).toBeNull()
    expect(againRef(convergence(1, 'loss', null))).toBeNull()
    expect(againRef(echo)).toEqual(echo.ref)
  })
})

describe('the Rift result', () => {
  const show = (result: RiftFightResult, onAgain = vi.fn(), onBack = vi.fn()) =>
    render(<MotionRoot features={domMax}><RiftResult campaign={campaign} result={result} onAgain={onAgain} onBack={onBack} /></MotionRoot>)
  const buttons = () => [...document.querySelectorAll<HTMLButtonElement>('[data-rift-result] button')].map((b) => b.textContent)

  it('offers the next stage after a front win, and only the way back after a seal', () => {
    const onAgain = vi.fn()
    show(front(5, 'victory', 5), onAgain)
    expect(document.querySelector('[data-rift-result]')!.textContent).toContain('Stage 5 cleared · 5/12')
    expect(buttons()).toEqual(['Next stage', 'Back to the Rift'])
    act(() => { fireEvent.click(screen.getByRole('button', { name: 'Next stage' })) })
    expect(onAgain).toHaveBeenCalledOnce()
    cleanup()
    show(front(12, 'victory', 12))
    expect(document.querySelector('[data-rift-result]')!.textContent).toContain('Iron sealed')
    expect(buttons()).toEqual(['Back to the Rift'])
  })

  it('offers a retry after a loss and the next Convergence fight after a win', () => {
    show(front(5, 'loss', null))
    expect(buttons()).toEqual(['Retry', 'Back to the Rift'])
    cleanup()
    show(convergence(0, 'victory', 1))
    expect(buttons()).toEqual(['Next: Arcane', 'Back to the Rift'])
    cleanup()
    show(convergence(2, 'loss', null))
    expect(document.querySelector('[data-rift-result]')!.textContent).toContain('The attempt is over')
    expect(buttons()).toEqual(['Back to the Rift'])
  })

  it('shows an Echo’s rank bars and Marks, with no EXP line', () => {
    show(echo)
    const text = document.querySelector('[data-rift-result]')!.textContent!
    expect(text).toContain('Uma 101')
    expect(text).toContain('Mage Rank 9')
    expect(text).toContain('+120 Class Marks')
    expect(text).not.toContain('EXP')
    expect(buttons()).toEqual(['Fight again', 'Back to the Rift'])
  })

  it('plays the achievement cut-in first, then shows the result', () => {
    show({ ...front(12, 'victory', 12), earned: [{ id: 't1-seal-iron', run: 't1-r1' }] })
    expect(screen.getByRole('dialog').getAttribute('aria-label')).toBe('Achievement earned: Iron Seal · Tier 1')
    act(() => { fireEvent.click(screen.getByRole('button', { name: 'Continue' })) })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.querySelector('[data-rift-result]')!.textContent).toContain('Iron sealed')
  })

  it('shows no cut-in when nothing was earned', () => {
    show(front(5, 'victory', 5))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})

describe('the Rift’s finale on the result (H52)', () => {
  const finale = { tier: 1, faces: ['b1', 'b2'] }
  const won = { ...convergence(3, 'victory', 4, true), earned: [{ id: 't1-rift-conquered', run: 't1-r1' }, { id: 'swift-convergence', run: 't1-r1' }] }
  const show = (result: RiftFightResult) =>
    render(<MotionRoot features={domMax}><RiftResult campaign={campaign} result={result} finale={finale} onAgain={vi.fn()} onBack={vi.fn()} /></MotionRoot>)
  const label = () => screen.queryByRole('dialog')?.getAttribute('aria-label') ?? null
  const go = () => act(() => { fireEvent.click(screen.getByRole('button', { name: 'Continue' })) })

  it('plays the finale first on the win that wins the run, then each achievement, then the result', () => {
    show(won)
    expect(label()).toBe('The Rift is won')
    expect(document.querySelectorAll('[data-finale-face]')).toHaveLength(2)
    go()
    expect(label()).toBe('Achievement earned: Rift Conquered · Tier 1')
    go()
    expect(label()).toBe('Achievement earned: Swift Convergence')
    go()
    expect(label()).toBeNull()
    expect(document.querySelector('[data-rift-result]')!.textContent).toContain('The Rift is won!')
  })

  it('goes from the finale straight to the result when nothing was earned', () => {
    show({ ...won, earned: [] })
    expect(label()).toBe('The Rift is won')
    go()
    expect(label()).toBeNull()
  })

  it('plays no finale on any other result', () => {
    show({ ...convergence(2, 'victory', 3), earned: [] })
    expect(label()).toBeNull()
    cleanup()
    show({ ...front(12, 'victory', 12), earned: [{ id: 't1-seal-iron', run: 't1-r1' }] })
    expect(label()).toBe('Achievement earned: Iron Seal · Tier 1')
    cleanup()
    show({ ...convergence(3, 'loss', null), earned: [] })
    expect(label()).toBeNull()
  })
})
