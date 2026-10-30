// The Learning routes on the live engine (v18; H133 is inert until H134): the Paladin Bastion's link opens the Paladin
// Bastion as today, with today's title and card, and no Healer Sanctum stands yet. The kit's `useLeave` is swapped for the
// test's router (the kit and the tests load react-router as two instances). Invented outfits only.
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot } from '@luismlorenzana/uma-kit/ui'
import { placeById } from '@rpg/domain'
import { cleanup, render, screen, within } from '@testing-library/react'
import { domAnimation } from 'motion/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { albumFixture } from '../album/testing'
import { PlaceRoute } from './HubScreen'

let fixture: Awaited<ReturnType<typeof albumFixture>>
vi.mock('../save/game', async (importOriginal) => ({ ...await importOriginal<typeof import('../save/game')>(), useWorld: () => fixture.world }))
vi.mock('../master/master', async (importOriginal) => ({ ...await importOriginal<typeof import('../master/master')>(),
  useMaster: () => ({ status: 'ready', view: fixture.view }),
}))
vi.mock('@luismlorenzana/uma-kit/shell', async (importOriginal) => {
  const { useNavigate } = await import('react-router')
  return {
    ...await importOriginal<typeof import('@luismlorenzana/uma-kit/shell')>(),
    useLeave: () => { const navigate = useNavigate(); return (to: string) => navigate(to, { replace: true }) },
  }
})

beforeEach(async () => {
  fixture = await albumFixture()
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null,
    setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  configureKit({ storagePrefix: 'rpg.' })
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

function Where() {
  const location = useLocation()
  return <p data-testid="where">{location.pathname}</p>
}
function show(at: string) {
  render(<MemoryRouter initialEntries={[at]}><MotionRoot features={domAnimation}><AlbumArtProvider art={{ useUrl: () => null }}>
    <Routes>
      <Route path="/:page/:placeId/*" element={<><PlaceRoute /><Where /></>} />
      <Route path="/:page" element={<Where />} />
    </Routes>
  </AlbumArtProvider></MotionRoot></MemoryRouter>)
}

describe('the Learning routes before the switch (H133)', () => {
  it('opens the Paladin Bastion as today: its title, "Seat n · Limit Break" and no shape line', async () => {
    fixture.world.heroes = { 'paladin-1': { hero: '81001', learners: [] } }
    show('/learning/paladin-bastion')
    const main = (await screen.findByText('Paladin Hall of Heroes')).closest('main')!
    expect(within(main).getAllByText(/^Seat \d · Limit Break$/).map((p) => p.textContent))
      .toEqual(['Seat 1 · Limit Break', 'Seat 2 · Limit Break', 'Seat 3 · Limit Break', 'Seat 4 · Limit Break'])
    expect(main.querySelector('[data-seat-shape]')).toBeNull()
    expect(within(main).getByRole('button', { name: 'Hero: Aster' })).toBeDefined()
    expect(screen.getByTestId('where').textContent).toBe('/learning/paladin-bastion')
  })

  it('has no Healer Sanctum yet: its link drops to the Learning page', () => {
    expect(placeById('healer-sanctum')).toBeUndefined()
    show('/learning/healer-sanctum')
    expect(screen.getByTestId('where').textContent).toBe('/learning')
  })
})
