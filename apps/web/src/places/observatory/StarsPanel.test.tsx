// The Stars tab on the real store with a test save (H122): Set opens a node and stays on Open; Set all lists its lines and sets
// them in one save write. The Observatory: its list, ready first; a row's door; the old route lands on Stars.
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { newSave, placeById, worldOf, type Save } from '@rpg/domain'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { domMax } from 'motion/react'
import { MemoryRouter, Route, Routes, useLocation, type Location } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { albumFixture } from '../../album/testing'
import { resetGame, useGame } from '../../save/game'
import ObservatoryPage from './ObservatoryPage'
import { StarsPanel } from './StarsPanel'

let fixture: Awaited<ReturnType<typeof albumFixture>>
vi.mock('../../master/master', async (orig) => ({ ...await orig<typeof import('../../master/master')>(), useMaster: () => ({ status: 'ready', view: fixture.view }) }))

const NOW = '2026-10-31T12:00:00.000Z'
let location: Location
const outfit = () => fixture.view.roster[0]!

async function saveWith(open: string[], items: Record<string, number>): Promise<Save> {
  fixture = await albumFixture()
  const save: Save = { ...fixture.save }
  const world = worldOf(save)
  world.items = items
  world.umas[outfit().outfitId] = { ...world.umas[outfit().outfitId]!, level: 40, stars: { open, moons: [] } }
  return save
}
function Probe() {
  location = useLocation()
  return null
}
function Live() {
  const world = worldOf(useGame((s) => s.save)!)
  return <StarsPanel outfit={outfit()} uma={world.umas[outfit().outfitId]!} world={world} tier={1} />
}
function shell(path: string, element: React.ReactNode) {
  return <MemoryRouter initialEntries={[{ pathname: path, state: { back: true } }]}><MotionRoot features={domMax}><AlbumArtProvider art={{ useUrl: () => null }}>
    <Probe />{element}
  </AlbumArtProvider></MotionRoot></MemoryRouter>
}
const stars = () => worldOf(useGame.getState().save!).umas[outfit().outfitId]!.stars as { open: string[] }
const items = () => worldOf(useGame.getState().save!).items

beforeEach(() => {
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  configureKit({ storagePrefix: 'rpg.' })
  setReducedMotion(true)
})
afterEach(() => {
  cleanup()
  resetGame()
  vi.unstubAllGlobals()
})

describe('the Stars tab (H122)', () => {
  it('sets a node from its sheet, which stays open on Open, and the jewel count falls', async () => {
    useGame.setState({ status: 'ready', save: await saveWith(['guard:1', 'guard:2'], { 'jewel-moon-3': 2 }), activeTier: 1 })
    render(shell('/stars', <Live />))
    expect(screen.getByText('Extra Stats · Open 2/22 · 1 ready')).toBeDefined()
    fireEvent.click(document.querySelector('[data-map-node="guard:3"]')!)
    const sheet = await screen.findByRole('dialog', { name: 'Guard III' })
    expect(within(sheet).getByText('Moon Jewel III ×1 · 2 held')).toBeDefined()
    await act(async () => { fireEvent.click(within(sheet).getByRole('button', { name: 'Set' })) })
    await waitFor(() => expect(stars().open).toContain('guard:3'))
    expect(items()).toEqual({ 'jewel-moon-3': 1 })
    expect(within(sheet).getByText('Open')).toBeDefined()
    expect(within(sheet).queryByRole('button', { name: 'Set' })).toBeNull()
  })

  it('draws each star’s state, and a body’s tap opens its next node', async () => {
    useGame.setState({ status: 'ready', save: await saveWith(['guard:1', 'guard:2'], { 'jewel-moon-3': 1 }), activeTier: 1 })
    render(shell('/stars', <Live />))
    const state = (id: string) => document.querySelector(`[data-map-node="${id}"]`)!.getAttribute('data-star-state')
    expect(document.querySelectorAll('[data-map-node]')).toHaveLength(22)
    expect([state('guard:2'), state('guard:3'), state('guard:4'), state('template:1')]).toEqual(['open', 'ready', 'later', 'next'])
    expect(document.querySelector('[data-map-node="guard:3"]')!.textContent).toBe('III')
    fireEvent.click(screen.getByRole('button', { name: 'Guard, 2 of 5 open' }))
    expect(await screen.findByRole('dialog', { name: 'Guard III' })).toBeDefined()
  })

  it('Set all lists its lines and sets them in one save write', async () => {
    useGame.setState({ status: 'ready', save: await saveWith(['prowess:1', 'vigor:1', 'guard:1'], { 'jewel-moon-2': 2, 'jewel-planet-1': 3 }), activeTier: 1 })
    render(shell('/stars', <Live />))
    fireEvent.click(screen.getByRole('button', { name: 'Set all' }))
    const sheet = await screen.findByRole('dialog', { name: 'Set all' })
    expect(within(sheet).getAllByRole('listitem').map((row) => row.textContent)).toHaveLength(3)
    const saves: unknown[] = []
    const stop = useGame.subscribe((state, before) => { if (state.save !== before.save) saves.push(state.save) })
    await act(async () => { fireEvent.click(within(sheet).getByRole('button', { name: 'Set 3' })) })
    await waitFor(() => expect(stars().open).toContain('planet:1'))
    stop()
    expect(saves).toHaveLength(1)
    expect(stars().open).toEqual(expect.arrayContaining(['prowess:2', 'vigor:2']))
    expect(items()).toEqual({})
  })

  it('hides Set all with nothing ready', async () => {
    useGame.setState({ status: 'ready', save: await saveWith(['guard:1'], {}), activeTier: 1 })
    render(shell('/stars', <Live />))
    expect(screen.getByText('Extra Stats · Open 1/22')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Set all' })).toBeNull()
  })
})

describe('the Observatory as a door (H122)', () => {
  const place = () => placeById('observatory')!

  it('lists her Umas, those with a jewel ready first, and a row opens Stars with the list', async () => {
    fixture = await albumFixture()
    const save = { ...fixture.save }
    const world = worldOf(save)
    const last = Object.keys(world.umas).at(-1)!
    world.umas[last] = { ...world.umas[last]!, level: 40 }
    world.items = { 'jewel-moon-1': 1 }
    for (const id of Object.keys(world.umas)) if (id !== last) world.umas[id] = { ...world.umas[id]!, level: 1 }
    useGame.setState({ status: 'ready', save, activeTier: 1 })
    render(shell('/learning/observatory', <Routes><Route path="/learning/observatory" element={<ObservatoryPage place={place()} rest="" />} /><Route path="*" element={<p>Her Stars</p>} /></Routes>))
    const rows = within(await screen.findByRole('list', { name: 'Umas' })).getAllByRole('button')
    expect(rows).toHaveLength(Object.keys(world.umas).length)
    expect(rows[0]!.textContent).toContain('Open 0/22')
    fireEvent.click(rows[0]!)
    await waitFor(() => expect(location.pathname).toMatch(/\/town\/stable\/outfit\/\d+\/stars$/))
    expect(location.state).toMatchObject({ back: true })
    expect((location.state as { list: string[] }).list).toHaveLength(rows.length)
  })

  it('says so with no Uma', async () => {
    fixture = await albumFixture()
    const save = newSave('Empty', NOW)
    useGame.setState({ status: 'ready', save, activeTier: 1 })
    render(shell('/learning/observatory', <ObservatoryPage place={place()} rest="" />))
    expect(await screen.findByText('Unlock an Uma first.')).toBeDefined()
  })

  it('redirects the old route to her Stars tab, keeping its state', async () => {
    fixture = await albumFixture()
    useGame.setState({ status: 'ready', save: fixture.save, activeTier: 1 })
    render(shell('/learning/observatory/81001', <Routes><Route path="/learning/observatory/*" element={<ObservatoryPage place={place()} rest="81001" />} /><Route path="*" element={<p>Her Stars</p>} /></Routes>))
    await waitFor(() => expect(location.pathname).toBe('/town/stable/outfit/81001/stars'))
    expect(location.state).toEqual({ back: true })
  })
})
