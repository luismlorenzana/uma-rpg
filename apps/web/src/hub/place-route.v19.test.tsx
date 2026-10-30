// Halls v2's Learning routes from the switch (H133; halls-v2.md §2.1, HV21; inert until H134), with the switch mocked to
// 19: the Healer Sanctum's page draws its four seats under its own name, and an old Paladin Bastion or Cleric Chapel link
// lands on it, keeping the rest of the path, the query and the navigation state. The kit's `useLeave` is swapped for the
// test's router (the kit and the tests load react-router as two instances). Invented outfits only.
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot } from '@luismlorenzana/uma-kit/ui'
import { placeById, placesOn } from '@rpg/domain'
import { cleanup, render, screen, within } from '@testing-library/react'
import { domAnimation } from 'motion/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { albumFixture } from '../album/testing'
import { PLACE_UI } from '../places/registry'
import { PlaceRoute } from './HubScreen'

vi.mock('../../../../packages/domain/src/rpg/battle/caps', async (orig) =>
  (await import('../../../../packages/domain/src/rpg/battle/caps-at.fixture')).capsAt(19, await orig()))
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
  return <p data-testid="where">{`${location.pathname}${location.search} ${JSON.stringify(location.state)}`}</p>
}
function show(at: string, state?: unknown) {
  render(<MemoryRouter initialEntries={[{ pathname: at.split('?')[0]!, search: at.includes('?') ? `?${at.split('?')[1]}` : '', state }]}>
    <MotionRoot features={domAnimation}><AlbumArtProvider art={{ useUrl: () => null }}>
      <Routes>
        <Route path="/:page/:placeId/*" element={<><PlaceRoute /><Where /></>} />
        <Route path="/:page" element={<Where />} />
      </Routes>
    </AlbumArtProvider></MotionRoot>
  </MemoryRouter>)
}
const where = () => screen.getByTestId('where').textContent

describe('the Learning page from v19 (H133)', () => {
  it('registers the Hall page for the five halls only', () => {
    expect(placesOn('learning').filter((p) => p.kind === 'class-hall').map((p) => p.id))
      .toEqual(['brawler-dojo', 'mage-tower', 'spell-blade-salle', 'summoner-circle', 'healer-sanctum'])
    for (const id of ['brawler-dojo', 'mage-tower', 'spell-blade-salle', 'summoner-circle', 'healer-sanctum']) expect(PLACE_UI[id]?.Page, id).toBeDefined()
    expect(placeById('paladin-bastion')).toBeUndefined()
    expect(placeById('cleric-chapel')).toBeUndefined()
  })

  it('opens the Healer Sanctum: its name and its four seats, the merged Bastion\'s Hero on seat 1', async () => {
    fixture.world.heroes = { 'healer-1': { hero: '81001', learners: ['81002'] } }
    show('/learning/healer-sanctum')
    const page = await screen.findByText('Seat 1 · Paladin')
    const main = page.closest('main')!
    expect(within(main).getByText('Healer Sanctum', { selector: 'p' })).toBeDefined()
    expect(['Seat 1 · Paladin', 'Seat 2 · Paladin', 'Seat 3 · Cleric', 'Seat 4 · Cleric'].map((s) => within(main).getByText(s).textContent)).toHaveLength(4)
    expect(within(main).getAllByRole('button', { name: 'Choose a Hero' })).toHaveLength(3)
    expect(within(main).getByRole('button', { name: 'Hero: Aster' })).toBeDefined()
    expect([...main.querySelectorAll('[data-seat-shape]')].map((p) => p.textContent)).toEqual([
      'One foe · 4 hits · ×2.0 · Brave 1', 'One foe · 4 hits · ×2.0 · Armor Break 1', 'One foe · 4 hits · ×2.0 · Faith 1',
      'One foe · 4 hits · ×2.0 · Mind Break 1',
    ])
    expect(where()).toBe('/learning/healer-sanctum null')
  })

  it('lands an old Paladin Bastion or Cleric Chapel link on the Healer Sanctum, keeping its path, query and state', async () => {
    show('/learning/paladin-bastion', { fromHub: true })
    await screen.findByText('Seat 1 · Paladin')
    expect(where()).toBe('/learning/healer-sanctum {"fromHub":true}')
    cleanup()
    show('/learning/cleric-chapel/more?peek=x', { back: true })
    await screen.findByText('Seat 3 · Cleric')
    expect(where()).toBe('/learning/healer-sanctum/more?peek=x {"back":true}')
  })

  it('still drops an unknown place to its page', () => {
    show('/learning/nowhere')
    expect(where()).toBe('/learning null')
  })
})
