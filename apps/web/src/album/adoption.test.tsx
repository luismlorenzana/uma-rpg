import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { WorkArtProvider } from '@luismlorenzana/uma-kit/work'
import { configureKit, MotionRoot } from '@luismlorenzana/uma-kit/ui'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { domAnimation } from 'motion/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { heroLimitsOf, ITEM_FAMILIES, placeById, withTrack } from '@rpg/domain'
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
const calls = vi.hoisted(() => ({ slot: vi.fn(async () => {}), lead: vi.fn(async () => {}), hero: vi.fn(async () => {}), learner: vi.fn(async () => {}), party: vi.fn(async () => {}) }))
vi.mock('../save/game', async importOriginal => ({ ...await importOriginal<typeof import('../save/game')>(),
  useWorld: () => fixture.world, setSlot: calls.slot, leadParty: calls.lead, appointHero: calls.hero, addLearner: calls.learner, chooseActiveParty: calls.party,
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
  return render(<MemoryRouter><MotionRoot features={domAnimation}><AlbumArtProvider art={{ useUrl: () => 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E' }}><WorkArtProvider art={{ Item: ({ id }) => <span>{id}</span> }}>{node}</WorkArtProvider></AlbumArtProvider></MotionRoot></MemoryRouter>)
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

  it('marks an Uma who can upgrade on the Stable tile, and the Can upgrade quick pick shows only her', async () => {
    // Every fixture Uma is a Brawler: Class Rank 5 lets 81001 alone learn a depth-1 side skill.
    const aster = fixture.world.umas['81001']!
    fixture.world = { ...fixture.world, umas: { ...fixture.world.umas, '81001': { ...aster, ranks: withTrack(aster.ranks, { kind: 'class', id: 'brawler' }, { rank: 5, exp: 0 }) } } }
    show(<StablePage {...page('stable')} />)
    expect(within(screen.getByRole('button', { name: 'Aster, Lv 3' })).getByRole('img', { name: 'Can upgrade' })).toBeDefined()
    expect(within(screen.getByRole('button', { name: 'Beryl, Lv 20' })).queryByRole('img', { name: 'Can upgrade' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Can upgrade' }))
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Beryl, Lv 20' })).toBeNull())
    expect(screen.getByRole('button', { name: 'Aster, Lv 3' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Cinder, Lv 20' })).toBeNull()
  })

  it('party slots hide locked Umas, dim movable members and pass the exact slot/id to RPG rules', async () => {
    fixture.world.parties[0]!.slots[0] = '81001'
    fixture.world.parties[1]!.slots[0] = '81003'
    show(<PartyHallPage {...page('party-hall', '1')} />)
    expect(screen.getByText((_, element) => element?.textContent === 'Lead · Brawler')).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: /Slot 2 · add an Uma/ }))
    expect(within(dialog()).getByRole('button', { name: 'Aster. In this party' }).hasAttribute('disabled')).toBe(true)
    expect(within(dialog()).queryByRole('button', { name: /Fable/ })).toBeNull()
    const cinder = within(dialog()).getByRole('button', { name: 'Cinder' })
    expect(cinder.hasAttribute('disabled')).toBe(false)
    expect(cinder.dataset.dimmed).toBe('true')
    expect(within(dialog()).getByRole('button', { name: 'Dune' }).dataset.dimmed).toBeUndefined()
    fireEvent.click(cinder)
    await waitFor(() => expect(calls.slot).toHaveBeenCalledWith(0, 1, '81003'))
  })

  it('lets a party member become the lead used by party choices', async () => {
    fixture.world.parties[0]!.slots = ['81001', '81004', null, null, null]
    show(<PartyHallPage {...page('party-hall', '1')} />)
    fireEvent.click(screen.getByRole('button', { name: /Dune/ }))
    fireEvent.click(within(dialog()).getByRole('button', { name: 'Make party lead' }))
    await waitFor(() => expect(calls.lead).toHaveBeenCalledWith(0, '81004'))
  })

  it('marks a lead without covering faces or changing her chosen slot', () => {
    fixture.world.parties[0]!.slots = ['81001', '81004', null, null, null]
    fixture.world.parties[0]!.lead = '81004'
    show(<PartyHallPage {...page('party-hall')} />)
    const card = screen.getByText('Party 1').closest('button')!
    expect(within(card).getByRole('img', { name: 'Party lead' })).toBeDefined()
    expect(within(card).getByText('Lv 3')).toBeDefined()
    expect(within(card).getByText('Lv 8')).toBeDefined()
    expect(card.querySelectorAll('[data-party-lead]')).toHaveLength(1)
    expect(fixture.world.parties[0]!.slots).toEqual(['81001', '81004', null, null, null])
  })

  it('facility choice shows Craft Levels and keeps How many above the long item grid', async () => {
    show(<FacilityPage {...page('monster-den')} />)
    fireEvent.click(screen.getByRole('button', { name: /Start a job in slot 1/ }))
    fireEvent.click(within(dialog()).getByRole('button', { name: 'Choose an Uma' }))
    const picker = await screen.findByRole('dialog', { name: 'Choose an Uma' })
    const buttons = within(picker).getAllByRole('button').filter(button => ['Aster', 'Beryl', 'Cinder', 'Dune', 'Ember'].includes(button.getAttribute('aria-label') ?? ''))
    expect(buttons.map(button => button.getAttribute('aria-label'))).toEqual(['Aster', 'Cinder', 'Dune', 'Beryl', 'Ember'])
    expect(within(within(picker).getByRole('button', { name: 'Aster' })).getByLabelText('Craft Level 12')).toBeDefined()
    fireEvent.click(within(picker).getByRole('button', { name: 'Aster' }))
    const what = await screen.findByRole('region', { name: 'What' })
    const count = screen.getByRole('radiogroup', { name: 'How many' })
    expect(count.compareDocumentPosition(what) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0)
  })

  it('compresses the Workbench to family and grade choices and keeps the chosen quantity while either changes', async () => {
    for (const family of ITEM_FAMILIES) {
      for (const raw of family.raw) fixture.world.items[raw.id] = 100
    }
    show(<FacilityPage {...page('workbench')} />)
    fireEvent.click(screen.getByRole('button', { name: /Start a job in slot 1/ }))
    const sheet = dialog()
    const twenty = within(sheet).getByRole('radio', { name: /^×20,/ })
    fireEvent.click(twenty)
    expect(twenty.getAttribute('aria-checked')).toBe('true')
    const families = sheet.querySelectorAll('[data-item-family]')
    expect(families).toHaveLength(8)
    fireEvent.click(families[1]!)
    expect(within(sheet).getByRole('radio', { name: /^×20,/ }).getAttribute('aria-checked')).toBe('true')
    fireEvent.click(within(sheet).getByRole('button', { name: /^Grade 2/ }))
    expect(within(sheet).getByRole('radio', { name: /^×20,/ }).getAttribute('aria-checked')).toBe('true')
    expect(sheet.querySelector('[data-selected-item]')).not.toBeNull()
  })

  it('shows grades on the Farm wishlist icons', () => {
    fixture.world.targets = ['81001']
    const ui = show(<FacilityPage {...page('monster-den')} />)
    expect(ui.container.querySelector('[data-kit="targets-strip"] [data-grade]')).not.toBeNull()
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
