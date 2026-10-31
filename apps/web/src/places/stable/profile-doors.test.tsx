// Every door into the profile (H124; proposal §6.2): each pushes with `{ back: true }` and its list, opens the tab it implies, and
// the stepper steps through the list, replacing the entry and keeping the tab. Invented outfits.
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { WorkArtProvider } from '@luismlorenzana/uma-kit/work'
import { heroLimitsOfHall, placeById } from '@rpg/domain'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { domAnimation } from 'motion/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes, useLocation, useNavigate, type Location } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { albumFixture } from '../../album/testing'
import { buildCampaign } from '../../battle/campaign'
import { FeaturedSheet } from '../../hub/Featured'
import HallPage from '../halls/HallPage'
import PartyHallPage from '../party-hall/PartyHallPage'
import { ActivePartyBar } from '../scenario-gate/ActiveParty'
import StableCounter from './StableCounter'
import StablePage from './StablePage'

let fixture: Awaited<ReturnType<typeof albumFixture>>
vi.mock('../../save/game', async (orig) => ({ ...await orig<typeof import('../../save/game')>(), useWorld: () => fixture.world }))
vi.mock('../../master/master', async (orig) => ({ ...await orig<typeof import('../../master/master')>(), useMaster: () => ({ status: 'ready', view: fixture.view }) }))

let location: Location
function Probe() {
  location = useLocation()
  return null
}
function HistoryBack() {
  const navigate = useNavigate()
  return <button type="button" onClick={() => navigate(-1)}>History back</button>
}
const page = (id: string, rest = '') => ({ place: placeById(id)!, rest })
function show(node: ReactNode, entries: Parameters<typeof MemoryRouter>[0]['initialEntries'] = ['/here']) {
  return render(<MemoryRouter initialEntries={entries} initialIndex={(entries?.length ?? 1) - 1}><MotionRoot features={domAnimation}>
    <AlbumArtProvider art={{ useUrl: () => null }}><WorkArtProvider art={{ Item: ({ id }) => <span>{id}</span> }}>
      <Probe /><HistoryBack />
      <Routes>
        <Route path="/here" element={node} />
        <Route path="/town/stable/outfit/:id/*" element={<><StableCounter /><p>Her profile</p></>} />
        <Route path="*" element={<p>Elsewhere</p>} />
      </Routes>
    </WorkArtProvider></AlbumArtProvider>
  </MotionRoot></MemoryRouter>)
}
beforeEach(async () => {
  fixture = await albumFixture()
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  configureKit({ storagePrefix: 'rpg.' })
  setReducedMotion(true)
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('the doors into the profile (H124)', () => {
  it('a roster face pushes the remembered tab with the view\'s owned list', async () => {
    localStorage.setItem('rpg.profile.tab.v3', 'gear')
    show(<StablePage {...page('stable')} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cinder, Lv 20' }))
    await waitFor(() => expect(location.pathname).toBe(`/town/stable/outfit/${fixture.view.roster[2]!.outfitId}/gear`))
    expect(location.state).toMatchObject({ back: true })
    const { list } = location.state as { list: string[] }
    expect([...list].sort()).toEqual(Object.keys(fixture.world.umas).sort())
    fireEvent.click(screen.getByRole('button', { name: 'History back' }))
    await waitFor(() => expect(location.pathname).toBe('/here'))
  })

  it('with Can upgrade on, a face opens the first tab with a dot', async () => {
    fixture.world = { ...fixture.world, items: { 'jewel-planet-1': 3 } }
    localStorage.setItem('rpg.album:stable', JSON.stringify({ query: { filters: { upgrade: true } } }))
    show(<StablePage {...page('stable')} />)
    fireEvent.click(screen.getByRole('button', { name: 'Aster, Lv 3' }))
    await waitFor(() => expect(location.pathname).toMatch(/\/stars$/))
  })

  it('View profile opens Class with the party, in slot order', async () => {
    const ids = Object.keys(fixture.world.umas)
    fixture.world.parties[0]!.slots = [ids[1]!, null, ids[0]!, null, null]
    show(<PartyHallPage {...page('party-hall', '1')} />)
    fireEvent.click(screen.getAllByRole('button', { name: /Beryl|Slot 1/ })[0]!)
    fireEvent.click(await screen.findByRole('button', { name: 'View profile' }))
    await waitFor(() => expect(location.pathname).toBe(`/town/stable/outfit/${ids[1]}/class`))
    expect(location.state).toEqual({ back: true, list: [ids[1], ids[0]] })
  })

  it('the party bar opens Class with the active party', async () => {
    const ids = Object.keys(fixture.world.umas)
    fixture.world.parties[0]!.slots = [ids[0]!, ids[1]!, null, null, null]
    show(<ActivePartyBar campaign={buildCampaign(fixture.view, { members: [], byId: new Map() })} />)
    fireEvent.click(screen.getByRole('button', { name: /^Aster:/ }))
    await waitFor(() => expect(location.pathname).toBe(`/town/stable/outfit/${ids[0]}/class`))
    expect(location.state).toEqual({ back: true, list: [ids[0], ids[1]] })
  })

  it('the plaza\'s Profile pushes, so Back returns to it', async () => {
    show(<FeaturedSheet open onClose={() => {}} />)
    fireEvent.click(await screen.findByRole('link', { name: 'Profile' }))
    await waitFor(() => expect(location.pathname).toMatch(/^\/town\/stable\/outfit\//))
    expect(location.state).toEqual({ back: true })
    fireEvent.click(screen.getByRole('button', { name: 'History back' }))
    await waitFor(() => expect(location.pathname).toBe('/here'))
  })

  it('a Hero\'s and a Learner\'s sheet open Class with the seat\'s list', async () => {
    const seat = heroLimitsOfHall('brawler')[0]!.id
    fixture.world.heroes[seat] = { hero: '81001', learners: ['81002', '81003'] }
    const ui = show(<HallPage {...page('brawler-dojo')} />)
    fireEvent.click(screen.getByRole('button', { name: 'Hero: Aster' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Profile' }))
    await waitFor(() => expect(location.pathname).toBe('/town/stable/outfit/81001/class'))
    expect(location.state).toEqual({ back: true, list: ['81001', '81002', '81003'] })
    ui.unmount()
    show(<HallPage {...page('brawler-dojo')} />)
    fireEvent.click(screen.getByRole('button', { name: /^Beryl, Bond/ }))
    fireEvent.click(await screen.findByRole('button', { name: 'Profile' }))
    await waitFor(() => expect(location.pathname).toBe('/town/stable/outfit/81002/class'))
  })
})

describe('the stepper (H124)', () => {
  const at = (list: string[] | undefined, id = '81002', tab = 'gear') => ['/before', { pathname: `/town/stable/outfit/${id}/${tab}`, state: { back: true, ...(list ? { list } : {}) } }]

  it('steps through the door\'s list, keeps the tab and replaces the entry, wrapping at the end', async () => {
    show(null, at(['81001', '81002']))
    const steps = screen.getByRole('group', { name: 'Uma 2 of 2' })
    expect(steps.textContent).toContain('2/2')
    fireEvent.click(within(steps).getByRole('button', { name: 'Next Uma' }))
    await waitFor(() => expect(location.pathname).toBe('/town/stable/outfit/81001/gear'))
    expect(location.state).toEqual({ back: true, list: ['81001', '81002'] })
    expect(screen.getByRole('group', { name: 'Uma 1 of 2' })).toBeDefined()
    // One Back returns past both steps: they replaced the entry.
    fireEvent.click(screen.getByRole('button', { name: 'History back' }))
    await waitFor(() => expect(location.pathname).toBe('/before'))
  })

  it('leaves out a locked id, and hides for one Uma or a locked profile', () => {
    const ui = show(null, at(['81002', '81006']))
    expect(screen.queryByRole('group', { name: /^Uma / })).toBeNull()
    ui.unmount()
    show(null, at(['81001', '81002'], '81006'))
    expect(screen.queryByRole('group', { name: /^Uma / })).toBeNull()
  })

  it('falls back to the roster\'s owned Umas on a shared link', () => {
    show(null, at(undefined))
    expect(screen.getByRole('group', { name: /^Uma \d of 5$/ })).toBeDefined()
  })

  it('shows Uma Tickets on the roster', () => {
    render(<MemoryRouter initialEntries={['/town/stable']}><MotionRoot features={domAnimation}><StableCounter /></MotionRoot></MemoryRouter>)
    expect(screen.getByLabelText(/Uma Tickets$/)).toBeDefined()
  })
})
