import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot } from '@luismlorenzana/uma-kit/ui'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { domAnimation } from 'motion/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { heroLimitsOf, placeById } from '@rpg/domain'
import type { ReactNode } from 'react'
import { buildCampaign } from '../battle/campaign'
import { FeaturedSheet } from '../hub/Featured'
import StablePage from '../places/stable/StablePage'
import PartyHallPage from '../places/party-hall/PartyHallPage'
import FacilityPage from '../places/work/FacilityPage'
import ObservatoryPage from '../places/observatory/ObservatoryPage'
import HallPage from '../places/halls/HallPage'
import ExchangePage from '../places/exchange/ExchangePage'
import { ActivePartyBar } from '../places/scenario-gate/ActiveParty'
import { albumFixture } from './testing'

let fixture: Awaited<ReturnType<typeof albumFixture>>
const calls = vi.hoisted(() => ({ slot: vi.fn(async () => {}), hero: vi.fn(async () => {}), learner: vi.fn(async () => {}), party: vi.fn(async () => {}) }))
vi.mock('../save/game', async importOriginal => ({ ...await importOriginal<typeof import('../save/game')>(),
  useWorld: () => fixture.world, setSlot: calls.slot, appointHero: calls.hero, addLearner: calls.learner, chooseActiveParty: calls.party,
}))
vi.mock('../master/master', async importOriginal => ({ ...await importOriginal<typeof import('../master/master')>(),
  useMaster: () => ({ status: 'ready', view: fixture.view }),
}))

beforeEach(async () => {
  fixture = await albumFixture()
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null,
    setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  configureKit({ storagePrefix: 'rpg.' })
  vi.clearAllMocks()
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })
function show(node: ReactNode) {
  return render(<MemoryRouter><MotionRoot features={domAnimation}><AlbumArtProvider art={{ useUrl: () => 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E' }}>{node}</AlbumArtProvider></MotionRoot></MemoryRouter>)
}
const page = (id: string, rest = '') => ({ place: placeById(id)!, rest })
const dialog = () => screen.getByRole('dialog')

describe('SB4 uses the shared album in every RPG choice', () => {
  it('opens the Stable at five faces, searches, switches all views and persists a saved view', async () => {
    const ui = show(<StablePage {...page('stable')} />)
    expect(ui.container.innerHTML).toContain('repeat(5')
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search Stable' }), { target: { value: 'Cinder' } })
    expect(screen.getByRole('button', { name: 'Cinder, Lv 20' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Beryl, Lv 20' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Card view' }))
    expect(ui.container.innerHTML).toContain('repeat(3')
    fireEvent.click(screen.getByRole('button', { name: 'List view' }))
    expect(ui.container.innerHTML).toContain('repeat(1')
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Saved views' }))
    fireEvent.change(await screen.findByRole('textbox', { name: 'Name this view' }), { target: { value: 'Cinder list' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(JSON.parse(localStorage.getItem('rpg.album:stable')!).views[0]).toMatchObject({ name: 'Cinder list', query: { search: 'Cinder', view: 'list' } })
  })

  it('party slots show disabled current members and locked Umas, then pass the exact slot/id to RPG rules', async () => {
    fixture.world.parties[0]!.slots[0] = '81001'
    show(<PartyHallPage {...page('party-hall', '1')} />)
    fireEvent.click(screen.getByRole('button', { name: /Slot 2 · add an Uma/ }))
    expect(within(dialog()).getByRole('button', { name: 'Aster. In this party' }).hasAttribute('disabled')).toBe(true)
    expect(within(dialog()).getByRole('button', { name: 'Fable. Locked' }).hasAttribute('disabled')).toBe(true)
    fireEvent.click(within(dialog()).getByRole('button', { name: 'Cinder' }))
    await waitFor(() => expect(calls.slot).toHaveBeenCalledWith(0, 1, '81003'))
  })

  it('facility choice uses Craft order and advances to What, rather than cancelling the job sheet', async () => {
    show(<FacilityPage {...page('monster-den')} />)
    fireEvent.click(screen.getByRole('button', { name: /Slot 1 · assign an Uma/ }))
    const buttons = within(dialog()).getAllByRole('button').filter(button => ['Aster', 'Beryl', 'Cinder', 'Dune', 'Ember'].includes(button.getAttribute('aria-label') ?? ''))
    expect(buttons.map(button => button.getAttribute('aria-label'))).toEqual(['Aster', 'Cinder', 'Dune', 'Beryl', 'Ember'])
    fireEvent.click(within(dialog()).getByRole('button', { name: 'Aster' }))
    await screen.findByRole('dialog', { name: 'What does she make?' })
    expect(screen.queryByRole('dialog', { name: 'Who works here?' })).toBeNull()
  })

  it('Observatory honors its explicit Uma route and changes her through the shared picker', async () => {
    show(<ObservatoryPage {...page('observatory', '81001')} />)
    expect(screen.getByRole('heading', { name: 'Aster' })).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'Choose an Uma' }))
    fireEvent.click(within(dialog()).getByRole('button', { name: 'Cinder' }))
    await screen.findByRole('heading', { name: 'Cinder' })
  })

  it('Hall Heroes and Learners use shared choices and display the existing domain refusals instead of hiding them', async () => {
    const seat = heroLimitsOf('brawler')[0]!.id
    fixture.world.heroes[seat] = { hero: '81001', learners: ['81002'] }
    show(<HallPage {...page('brawler-dojo')} />)
    fireEvent.click(screen.getByRole('button', { name: 'Add a Learner' }))
    expect(within(dialog()).getByRole('button', { name: 'Aster. Already seated here' }).hasAttribute('disabled')).toBe(true)
    expect(within(dialog()).getByRole('button', { name: 'Beryl. Already learning here' }).hasAttribute('disabled')).toBe(true)
    fireEvent.click(within(dialog()).getByRole('button', { name: 'Cinder' }))
    await waitFor(() => expect(calls.learner).toHaveBeenCalledWith(seat, '81003'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Choose a Hero' })[0]!)
    expect(within(dialog()).getByRole('button', { name: 'Aster. Already a Hero' }).hasAttribute('disabled')).toBe(true)
    fireEvent.click(within(dialog()).getByRole('button', { name: 'Ember' }))
    await waitFor(() => expect(calls.hero).toHaveBeenCalledWith(heroLimitsOf('brawler')[1]!.id, '81005'))
  })

  it('Manuals advance from the shared choice to the existing rank bars', async () => {
    show(<ExchangePage />)
    fireEvent.click(screen.getByRole('button', { name: /Read a Manual/ }))
    fireEvent.click(within(dialog()).getByRole('button', { name: 'Cinder' }))
    await screen.findByRole('dialog', { name: 'Which bar?' })
    expect(within(dialog()).getByRole('heading', { name: 'Classes' })).toBeDefined()
  })

  it('active-party choice still selects a party index, not a single Uma or a new party', async () => {
    fixture.world.parties[0]!.slots[0] = '81001'
    fixture.world.parties[1]!.slots = ['81002', '81003', null, null, null]
    const campaign = buildCampaign(fixture.view, { members: [], byId: new Map() })
    show(<ActivePartyBar campaign={campaign} />)
    fireEvent.click(screen.getByRole('button', { name: /· swap/ }))
    expect(within(dialog()).getByRole('button', { name: `${fixture.world.parties[0]!.name}. Active party` }).hasAttribute('disabled')).toBe(true)
    fireEvent.click(within(dialog()).getByRole('button', { name: fixture.world.parties[1]!.name }))
    await waitFor(() => expect(calls.party).toHaveBeenCalledWith(1))
  })

  it('the plaza keeps a shared album grid for Feature another', () => {
    show(<FeaturedSheet open onClose={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Beryl, Lv 20' }))
    expect(localStorage.getItem('rpg.featured')).toBe('81002')
  })
})
