import { MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { domMax } from 'motion/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AchievementCutIn } from './AchievementCutIn'

const GRANTS = [{ id: 't1-seal-iron', run: 't1-r2' }, { id: 'untouched-iron', run: 't1-r2' }]
const show = (onDone: () => void) => render(<MotionRoot features={domMax}><AchievementCutIn grants={GRANTS} onDone={onDone} /></MotionRoot>)
const dialog = () => screen.getByRole('dialog')
const card = () => document.querySelector<HTMLElement>('[data-cut-in-card]')!
const badge = () => document.querySelector<HTMLElement>('[data-cut-in-badge]')!

beforeEach(() => {
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('the achievement cut-in', () => {
  it('shows one grant at a time, steps on Continue and calls onDone once after the last', () => {
    const onDone = vi.fn()
    show(onDone)
    expect(dialog().getAttribute('aria-modal')).toBe('true')
    expect(dialog().getAttribute('aria-label')).toBe('Achievement earned: Iron Seal · Tier 1')
    expect(dialog().closest('[data-theme="dark"]')).not.toBeNull()
    expect(dialog().className).toContain('fixed inset-0 z-50')
    expect(card().textContent).toBe('AchievementIron Seal · Tier 1Win the Iron front’s championContinue')
    const big = badge().querySelector<HTMLElement>('span')!
    expect(big.style.width).toBe('96px'); expect(big.style.height).toBe('96px')
    const go = screen.getByRole('button', { name: 'Continue' })
    expect(document.activeElement).toBe(go)

    act(() => { fireEvent.click(go) })
    expect(dialog().getAttribute('aria-label')).toBe('Achievement earned: Untouched · Iron')
    expect(card().textContent).toContain('Seal Iron with no Uma knocked out')
    // Untouched: the one badge, with the front's crest beside it.
    expect(badge().querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Iron front')
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Continue' }))
    expect(onDone).not.toHaveBeenCalled()

    act(() => { fireEvent.click(screen.getByRole('button', { name: 'Continue' })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: 'Continue' })) })
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('scales the badge in and fades the card in, and under reduced motion draws them at rest', () => {
    show(vi.fn())
    expect(card().style.opacity).toBe('0')
    expect(badge().style.transform).toContain('scale(0.5)')
    cleanup()

    setReducedMotion(true)
    show(vi.fn())
    expect(card().style.opacity).not.toBe('0')
    expect(badge().style.transform).not.toContain('scale(0.5)')
  })

  it('finishes at once with nothing it can show', () => {
    const onDone = vi.fn()
    render(<MotionRoot features={domMax}><AchievementCutIn grants={[{ id: 'nope', run: null }]} onDone={onDone} /></MotionRoot>)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})
