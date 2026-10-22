import { newOwnedUma, newSave, newTierWorld, unlockUma, type Save } from '@rpg/domain'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { useEffect, useState, type ReactNode } from 'react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetGame, setActiveTier, useGame } from '../save/game'
import { TierShell } from './TierShell'

// The real shell needs master data and the kit's frame; this one counts its mounts and renders the page.
const mounts = vi.hoisted(() => ({ count: 0 }))
vi.mock('./Shell', async () => {
  const { useEffect } = await import('react')
  const { Outlet } = await import('react-router')
  return {
    Shell: () => {
      useEffect(() => { mounts.count++ }, [])
      return <Outlet />
    },
  }
})

const NOW = '2026-10-21T12:00:00.000Z'
/** Tier 1 with an Uma, and a synthetic Tier 2 world (no promotion exists yet). */
function twoTiers(): Save {
  const save = unlockUma(newSave('Luis', NOW), '101', NOW)
  return { ...save, tierWorlds: { ...save.tierWorlds, '2': { ...newTierWorld(NOW, 0), umas: { '201': newOwnedUma(NOW) } } } }
}

function Where() {
  const location = useLocation()
  return <p data-testid="where">{`${location.pathname}${location.search} ${JSON.stringify(location.state)}`}</p>
}

/** Renders its children once the router is listening, as the boot gates do in the app. */
function AfterBoot({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  return ready ? children : null
}

function show(entry: string | { pathname: string; search: string; state: unknown }) {
  render(<MemoryRouter initialEntries={[entry]}><AfterBoot><Routes><Route element={<TierShell />}><Route path=":page" element={<Where />} /></Route></Routes></AfterBoot></MemoryRouter>)
}

beforeEach(() => {
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value) })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  mounts.count = 0
  useGame.setState({ uid: 'u1', status: 'ready', save: twoTiers(), activeTier: 1 })
})
afterEach(() => {
  cleanup()
  resetGame()
  vi.unstubAllGlobals()
})

describe('the tier shell (H35)', () => {
  it('remounts the whole shell when the active tier changes, and only then', () => {
    show('/town')
    expect(mounts.count).toBe(1)
    act(() => { setActiveTier(1) })
    expect(mounts.count).toBe(1)
    act(() => { setActiveTier(2) })
    expect(mounts.count).toBe(2)
    expect(screen.getByTestId('where').textContent).toBe('/town null')
  })

  it('opens a ?tier= link on that tier, then drops the param and keeps the entry’s state', async () => {
    show({ pathname: '/wilds', search: '?tier=2', state: { back: true } })
    await waitFor(() => expect(screen.getByTestId('where').textContent).toBe('/wilds {"back":true}'))
    expect(useGame.getState().activeTier).toBe(2)
    expect(localStorage.getItem('rpg.tier')).toBe('2')
  })

  it('drops a ?tier= with no world and stays on the tier it was on', async () => {
    show('/wilds?tier=9')
    await waitFor(() => expect(screen.getByTestId('where').textContent).toBe('/wilds null'))
    expect(useGame.getState().activeTier).toBe(1)
    expect(mounts.count).toBe(1)
  })
})
