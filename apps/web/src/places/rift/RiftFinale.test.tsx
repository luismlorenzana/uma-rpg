import { MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { domMax } from 'motion/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Campaign } from '../../battle/campaign'
import { RiftFinale } from './RiftFinale'

/** Invented faces with no art: each draws as her colour. */
const FACES = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9']
const campaign = { cast: { byId: new Map(FACES.map((id) => [id, { id, name: `Boss ${id}`, tier: 'boss', color: '#334455' }])) } } as unknown as Campaign
const show = (onDone: () => void, faces = FACES) =>
  render(<MotionRoot features={domMax}><RiftFinale campaign={campaign} tier={1} faces={faces} onDone={onDone} /></MotionRoot>)
const dialog = () => screen.getByRole('dialog')
const card = () => document.querySelector<HTMLElement>('[data-finale-card]')!
const faces = () => [...document.querySelectorAll<HTMLElement>('[data-finale-face]')]

beforeEach(() => {
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  setReducedMotion(false)
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('the Rift’s finale (H52)', () => {
  it('shows the title, the tier and every champion’s face, and Continue calls onDone once', () => {
    const onDone = vi.fn()
    show(onDone)
    expect(dialog().getAttribute('aria-modal')).toBe('true')
    expect(dialog().getAttribute('aria-label')).toBe('The Rift is won')
    expect(dialog().closest('[data-theme="dark"]')).not.toBeNull()
    expect(dialog().className).toContain('fixed inset-0 z-50')
    expect(card().textContent).toBe('Tier 1The Rift is wonTwenty Umas, four fronts, 9 championsContinue')
    expect(faces().map((f) => f.getAttribute('aria-label'))).toEqual(FACES.map((id) => `Boss ${id}`))
    expect(faces()[0]!.querySelector('span')!.style.width).toBe('64px')
    const go = screen.getByRole('button', { name: 'Continue' })
    expect(document.activeElement).toBe(go)
    act(() => { fireEvent.click(go) })
    act(() => { fireEvent.click(go) })
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('counts one champion as one', () => {
    show(vi.fn(), ['b1'])
    expect(card().textContent).toContain('four fronts, 1 champion')
    expect(faces()).toHaveLength(1)
  })

  it('reveals the faces one after another, and under reduced motion draws everything at rest', () => {
    show(vi.fn())
    expect(card().style.opacity).toBe('0')
    expect(faces().every((f) => f.style.opacity === '0' && f.style.transform.includes('scale(0.6)'))).toBe(true)
    cleanup()

    setReducedMotion(true)
    show(vi.fn())
    expect(card().style.opacity).not.toBe('0')
    expect(faces().some((f) => f.style.opacity === '0' || f.style.transform.includes('scale(0.6)'))).toBe(false)
  })
})
