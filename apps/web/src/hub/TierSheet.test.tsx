import { newOwnedUma, newSave, newTierWorld, tierLook, TIERS, unlockUma, type Save } from '@rpg/domain'
import { MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { domMax } from 'motion/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetGame, setActiveTier, useGame } from '../save/game'
import { RpgAccountBar } from './Bars'
import { tierCards, TierSheet } from './TierSheet'
import { TierVeil } from './TierVeil'

// The switch's store call is H35's, tested there; here it only has to be called with the picked tier.
vi.mock('../save/game', async (importOriginal) => ({ ...(await importOriginal<typeof import('../save/game')>()), setActiveTier: vi.fn(() => true) }))
// The kit draws the bar (its own tests check the shifter's link); here the game's props are checked. A kit `Link` can't
// render in this suite: the kit and the tests load react-router as two instances.
const bar = vi.hoisted(() => ({ props: null as Record<string, unknown> | null }))
vi.mock('@luismlorenzana/uma-kit/shell', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@luismlorenzana/uma-kit/shell')>()),
  AccountBar: (props: Record<string, unknown>) => {
    bar.props = props
    return null
  },
}))

const NOW = '2026-10-21T12:00:00.000Z'
const RIFT = 'The Rift isn’t open yet'
/** Tier 1 with one Uma; Tier 2 a synthetic world holding two (no promotion exists yet). */
function twoTiers(): Save {
  const save = unlockUma(newSave('Luis', NOW), '101', NOW)
  const tier2 = { ...newTierWorld(NOW, 0), umas: { '201': newOwnedUma(NOW), '202': newOwnedUma(NOW) } }
  return { ...save, tierWorlds: { ...save.tierWorlds, '2': tier2 } }
}

function Where() {
  const location = useLocation()
  return <p data-testid="where">{`${location.pathname}${location.search}`}</p>
}

function show(node: ReactNode, at = '/wilds?sheet=tier') {
  render(
    <MotionRoot features={domMax}>
      <MemoryRouter initialEntries={[at]}>
        <Routes><Route path="*" element={<>{node}<Where /></>} /></Routes>
      </MemoryRouter>
    </MotionRoot>,
  )
}
const card = (tier: number) => document.querySelector<HTMLElement>(`[data-tier-cards] [data-tier="${tier}"]`)!

beforeEach(() => {
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.mocked(setActiveTier).mockClear()
  useGame.setState({ uid: 'u1', status: 'ready', save: twoTiers(), activeTier: 1 })
})
afterEach(() => {
  cleanup()
  resetGame()
  vi.unstubAllGlobals()
})

describe('the tier cards (H36)', () => {
  it('opens every tier with a world, marks the active one, and locks the rest', () => {
    expect(tierCards(twoTiers(), 1)).toEqual([
      { tier: 1, name: 'Apprentice', active: true, open: true, count: '1 Uma', rift: RIFT },
      { tier: 2, name: 'Adept', active: false, open: true, count: '2 Umas', rift: RIFT },
      { tier: 3, name: 'Master', active: false, open: false, lock: 'Promote Umas through the Tier 2 Rift' },
    ])
    show(<TierSheet open onClose={() => {}} />)
    expect(card(1).tagName).toBe('BUTTON')
    expect(card(1).getAttribute('aria-current')).toBe('true')
    expect(card(1).textContent).toContain('Tier 1 · Apprentice')
    expect(card(1).textContent).toContain('1 Uma')
    expect(card(1).textContent).toContain(RIFT)
    expect(card(2).tagName).toBe('BUTTON')
    expect(card(2).getAttribute('aria-current')).toBeNull()
    expect(card(2).textContent).toContain('2 Umas')
    expect(card(3).tagName).not.toBe('BUTTON')
    expect(card(3).getAttribute('aria-disabled')).toBe('true')
    expect(card(3).querySelector('button')).toBeNull()
    expect(card(3).textContent).toContain('Promote Umas through the Tier 2 Rift')
    expect(card(3).textContent).not.toContain(RIFT)
  })

  it('locks Tiers 2 and 3 on a one-tier save', () => {
    const one = unlockUma(newSave('Luis', NOW), '101', NOW)
    expect(tierCards(one, 1).map((c) => [c.tier, c.open])).toEqual([[1, true], [2, false], [3, false]])
    expect(tierCards(newSave('Luis', NOW), 1)[0]).toMatchObject({ open: true, count: 'No Umas yet' })
    const locked = tierCards(one, 1)[1]!
    expect(locked.open ? null : locked.lock).toBe('Promote Umas through the Tier 1 Rift')
  })

  it('gives each tier its look', () => {
    expect(TIERS.map((t) => [t.tier, t.look])).toEqual([[1, 'day'], [2, 'dusk'], [3, 'night']])
    expect([1, 2, 3].map(tierLook)).toEqual(['day', 'dusk', 'night'])
  })
})

describe('picking a tier', () => {
  it('switches to another tier and lands on its Town Hall, at once under reduced motion', async () => {
    setReducedMotion(true)
    const onClose = vi.fn()
    show(<TierSheet open onClose={onClose} />)
    act(() => { fireEvent.click(card(2)) })
    expect(setActiveTier).toHaveBeenCalledWith(2)
    await waitFor(() => expect(screen.getByTestId('where').textContent).toBe('/town'))
    expect(document.querySelector('[data-veil]')).toBeNull()
  })

  it('just closes the sheet on the active tier', () => {
    setReducedMotion(true)
    const onClose = vi.fn()
    show(<TierSheet open onClose={onClose} />)
    act(() => { fireEvent.click(card(1)) })
    expect(onClose).toHaveBeenCalledOnce()
    expect(setActiveTier).not.toHaveBeenCalled()
    expect(screen.getByTestId('where').textContent).toBe('/wilds?sheet=tier')
  })

  it('switches behind the veil otherwise', async () => {
    show(<><TierSheet open onClose={() => {}} /><TierVeil /></>)
    act(() => { fireEvent.click(card(2)) })
    expect(document.querySelector('[data-veil]')).not.toBeNull()
    expect(setActiveTier).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.getByTestId('where').textContent).toBe('/town'))
    expect(setActiveTier).toHaveBeenCalledWith(2)
  })
})

describe('the top bar', () => {
  it('opens the Tier sheet from the crest and the Account from the initial', () => {
    show(<RpgAccountBar />, '/wilds')
    expect(bar.props).toMatchObject({
      tier: 1,
      tierShifter: { to: '/wilds?sheet=tier', label: 'Tier 1, switch tiers' },
      account: { to: '/town/account', label: 'Account: Luis' },
    })
  })
})
