import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { syntheticMasterData, buildMemoryRelease } from '@luismlorenzana/uma-data/testing'
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { outfitRowBase } from '@luismlorenzana/uma-kit/roster'
import { MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { buildChapters, buildRoster, newOwnedUma, newSave, placeById, nearestSpring, type CapitalLanes, type CapitalRun, type Save } from '@rpg/domain'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { domMax } from 'motion/react'
import type { ReactNode } from 'react'
import { MemoryRouter, useLocation } from 'react-router'
import { buildCampaign, type Campaign } from '../../../battle/campaign'
import { resetGame, useGame } from '../../../save/game'
import * as game from '../../../save/game'
import { ContinentMap } from '../ScenarioGatePage'
import { RegionMap } from '../RegionMap'
import { HoneycombMap } from './HoneycombMap'
import { capitalSeats, fittedTransform, honeycombFrontier, honeycombGeometry } from './honeycomb-view'
import PartyHallPage from '../../party-hall/PartyHallPage'
import PartyCounter from '../../party-hall/PartyCounter'
import PartyPeek from '../../party-hall/PartyHallPeek'
import { PartyPick } from '../../rift/PartyPick'
import { NewRun } from '../capital/NewRun'

let campaign: Campaign
vi.mock('../../../battle/campaign', async (original) => ({ ...await original<typeof import('../../../battle/campaign')>(), CampaignGate: ({ children }: { children: (c: Campaign) => ReactNode }) => children(campaign) }))
vi.mock('../../MasterGate', () => ({ MasterGate: ({ children }: { children: (v: Campaign['view']) => ReactNode }) => children(campaign.view) }))
vi.mock('../ActiveParty', () => ({ ActivePartyBar: () => null }))
vi.mock('./MapCanvas', () => ({ MapCanvas: () => <div data-pixel-map />, BiomeIcon: () => null }))
vi.mock('../../../save/db', () => ({ writeSaveRow: vi.fn(async () => undefined) }))
vi.mock('../../../ui/useNow', async (original) => ({ ...await original<typeof import('../../../ui/useNow')>(), useNow: () => '2026-11-05T12:00:00.000Z' }))
const NOW = '2026-11-05T12:00:00.000Z', place = placeById('scenario-gate')!
async function fixture() {
  const data = syntheticMasterData(), release = await buildMemoryRelease(data), base = buildRoster(data)[0]!
  const roster = Array.from({ length: 120 }, (_, i) => ({ ...base, outfitId: String(81001 + i), name: `Uma ${i + 1}` }))
  const album = new Map(roster.map((o) => [o.outfitId, { ...outfitRowBase(data.outfits[0]!, data.characters[0]), id: o.outfitId }]))
  campaign = buildCampaign({ manifest: release.manifest, roster, album, art: null, chapters: buildChapters(data.scenarios) }, { members: [], byId: new Map() })
  const s = newSave('Hex test', NOW), w = s.tierWorlds['1']!
  roster.forEach((o, i) => { w.umas[o.outfitId] = newOwnedUma(NOW); w.parties[Math.floor(i / 5)]!.slots[i % 5] = o.outfitId })
  return s
}
function run(s: Save, n: number): CapitalRun {
  return { id: `w1-run${n}`, continent: 'w1', startedAt: NOW, lanes: Array.from({ length: 4 }, (_, i) => ({ party: i, umas: [...s.tierWorlds['1']!.parties[i]!.slots], generals: i ? 1 : 3, finalAt: null })) as CapitalLanes }
}
function Location() { const location = useLocation(); return <span data-location>{location.pathname}</span> }
function show(s: Save, node?: ReactNode) {
  useGame.setState({ save: s, status: 'ready', activeTier: 1, uid: null })
  return render(<MotionRoot features={domMax}><AlbumArtProvider art={{ useUrl: () => 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E' }}>
    <MemoryRouter initialEntries={['/battle/scenario-gate/c/w1']}><Location />{node ?? <ContinentMap campaign={campaign} continent={campaign.continents[0]!} place={place} />}</MemoryRouter>
  </AlbumArtProvider></MotionRoot>)
}
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true); setReducedMotion(true)
  const storage = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) })
})
afterEach(() => { cleanup(); resetGame(); vi.restoreAllMocks(); vi.unstubAllGlobals() })

describe('the honeycomb screen (H165)', () => {
  it('draws 61 labelled keyboard buttons, including untouched and old completed regions', async () => {
    const s = await fixture(); s.tierWorlds['1']!.world.run.wins['w1-1-1-s12'] = 1
    show(s)
    expect(document.querySelectorAll('svg [role="button"]')).toHaveLength(61)
    expect(document.querySelector('[data-pixel-map]')).toBeNull()
    const old = document.querySelector('[data-hex="w1-1-1"]')!
    expect(old.getAttribute('aria-label')).toContain('completed'); expect(old.textContent).toContain('✓')
    expect(old.querySelector('[data-hex-faces]')).toBeNull()
    expect(document.querySelector('[data-hex="w1-1-2"]')!.getAttribute('data-state')).toBe('untouched')
    fireEvent.keyDown(old, { key: 'Enter' })
    expect(screen.getByRole('dialog').textContent).toContain('Cleared ✓')
    fireEvent.click(screen.getByRole('button', { name: 'Enter' }))
    expect(document.querySelector('[data-location]')!.textContent).toContain('/r/w1-1-1')
  })

  it('uses small claimed teams and large clear teams, and loads portrait images only above 1.6×', async () => {
    const s = await fixture(), w = s.tierWorlds['1']!, ids = w.parties[0]!.slots as string[]
    w.world.run.wins['w1-1-1-s1'] = 1; w.world.run.wins['w1-1-2-s12'] = 1
    w.regionTeams = { 'w1-1-1': { claim: { umas: ids, at: NOW } }, 'w1-1-2': { clear: { umas: ids, at: NOW } } }
    show(s)
    expect(document.querySelectorAll('[data-hex="w1-1-1"] [data-hex-faces="small"] circle')).toHaveLength(10)
    expect(document.querySelector('[data-hex="w1-1-2"] [data-hex-faces="large"]')).toBeTruthy()
    expect(document.querySelectorAll('svg image')).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' })); fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(document.querySelectorAll('svg image')).toHaveLength(10)
    fireEvent.click(screen.getByRole('button', { name: 'Fit map' }))
    expect(document.querySelector('svg[data-zoom]')!.getAttribute('data-zoom')).toBe('1.00')
  })

  it('shows the Spring state, its eight regions, and refills through the shared save action', async () => {
    const s = await fixture(), drink = vi.spyOn(game, 'drinkAtSpring').mockResolvedValue(undefined)
    show(s)
    fireEvent.click(screen.getByRole('button', { name: 'Spring 6, Ready' }))
    expect(screen.getByRole('list', { name: 'Regions served' }).children).toHaveLength(8)
    fireEvent.click(screen.getByRole('button', { name: 'Refill' }))
    await waitFor(() => expect(drink).toHaveBeenCalledWith('w1-spring6'))
    cleanup(); s.tierWorlds['1']!.world.springs['w1-spring6'] = NOW; show(s)
    fireEvent.click(screen.getByRole('button', { name: /Spring 6,/ }))
    expect((screen.getByRole('button', { name: 'Refill' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('prioritizes open seats while preserving newest wins, previews all twenty and opens the run', async () => {
    const s = await fixture(), w = s.tierWorlds['1']!, r = run(s, 7); r.lanes[1]!.generals = 2
    w.capitalRuns = [r]; w.capitals = { w1: { started: 7, won: 6, recent: [6, 5, 4, 3, 2, 1].map((n) => ({ id: `w1-run${n}`, wonAt: NOW, lanes: r.lanes.map((l) => l.umas) })) } }
    const seats = capitalSeats(w, 'w1')
    expect(seats.map((r) => r.id)).toEqual([6, 5, 4, 3, 2, 7].map((n) => `w1-run${n}`))
    show(s)
    expect(screen.getByRole('button', { name: 'Seat 6, Run 7, 7 of 16' })).toBeTruthy()
    fireEvent.keyDown(screen.getByRole('button', { name: 'Seat 6, Run 7, 7 of 16' }), { key: ' ' })
    expect(screen.getByRole('dialog').querySelectorAll('img')).toHaveLength(20)
    expect(screen.getAllByText(/Lane [1-4]/)).toHaveLength(4)
    fireEvent.click(screen.getByRole('button', { name: 'Open run' }))
    expect(document.querySelector('[data-location]')!.textContent).toContain('/capital/w1/run/w1-run7')
  })

  it('opens the capital from an empty seat, keeps all six won runs in its quick look', async () => {
    const s = await fixture(); show(s)
    fireEvent.click(screen.getByRole('button', { name: 'Seat 1, open' }))
    expect(screen.getByRole('dialog').textContent).toContain('No runs yet')
    fireEvent.click(screen.getByRole('button', { name: 'Open capital' }))
    expect(document.querySelector('[data-location]')!.textContent).toContain('/capital/w1')
    cleanup()
    const r = run(s, 7), w = s.tierWorlds['1']!; w.capitalRuns = [r]
    w.capitals = { w1: { started: 7, won: 6, recent: [6, 5, 4, 3, 2, 1].map((n) => ({ id: `w1-run${n}`, wonAt: NOW, lanes: r.lanes.map((l) => l.umas) })) } }
    show(s); fireEvent.click(screen.getByRole('button', { name: 'Capital, 6 runs won' }))
    expect(screen.getByRole('dialog').querySelectorAll('section')).toHaveLength(7)
  })

  it('shows six Springs and 48 regions in the remembered list, and uses the nearest Spring on a region', async () => {
    const s = await fixture(); localStorage.setItem('rpg-world-map-view', 'list'); show(s)
    const springs = screen.getByRole('group', { name: 'Map view' })
    expect(springs).toBeTruthy()
    expect(screen.getByLabelText('Springs').querySelectorAll('button')).toHaveLength(6)
    expect(document.querySelectorAll('button[style*="border-color"]')).toHaveLength(48)
    cleanup()
    const c = campaign.continents[0]!, r = c.regions[0]!, id = nearestSpring(c, r.id)!
    s.tierWorlds['1']!.world.springs[id] = NOW
    show(s, <RegionMap campaign={campaign} region={campaign.region(r.id)!} place={place} />)
    expect((screen.getByRole('button', { name: /Spring, recharges/ }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('keeps the frontier visible in its fitted bounds and zooms to at most 3× without page reflow', async () => {
    const s = await fixture(), c = campaign.continents[0]!, g = honeycombGeometry(c)
    const frontier = honeycombFrontier(c, (id) => id === 'w1-x-1')
    expect(frontier).toBe('w1-x-2')
    const fit = fittedTransform(g, 375, 300, frontier)
    expect(fit.zoom).toBe(1); expect(Number.isFinite(fit.x) && Number.isFinite(fit.y)).toBe(true)
    show(s)
    for (let n = 0; n < 8; n++) fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(document.querySelector('svg[data-zoom]')!.getAttribute('data-zoom')).toBe('3.00')
    expect((screen.getByRole('button', { name: 'Zoom in' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('fits the actual space above the dock, including the smaller phone', async () => {
    const s = await fixture()
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return { x: 0, y: 300, left: 0, top: this.tagName === 'NAV' ? 580 : 300, right: 375, bottom: 600, width: 375, height: 300, toJSON: () => ({}) }
    })
    const dock = document.createElement('nav'); dock.setAttribute('aria-label', 'Pages'); document.body.append(dock)
    try {
      show(s)
      expect(document.querySelector('svg[data-zoom]')!.getAttribute('viewBox')).toBe('0 0 375 272')
    } finally { dock.remove() }
  })

  it('pans on drag, suppresses the drag click, and pinches around the two-pointer midpoint', async () => {
    class Pointer extends MouseEvent {
      pointerId: number
      constructor(type: string, init: MouseEventInit & { pointerId?: number } = {}) { super(type, init); this.pointerId = init.pointerId ?? 1 }
    }
    vi.stubGlobal('PointerEvent', Pointer)
    const s = await fixture(); show(s)
    const svg = document.querySelector<SVGSVGElement>('svg[data-zoom]')!, g = svg.firstElementChild!
    const before = g.getAttribute('transform')
    fireEvent.pointerDown(svg, { pointerId: 1, clientX: 100, clientY: 100 })
    fireEvent.pointerMove(svg, { pointerId: 1, clientX: 135, clientY: 125 })
    fireEvent.pointerUp(svg, { pointerId: 1 })
    expect(g.getAttribute('transform')).not.toBe(before)
    fireEvent.click(document.querySelector('[data-hex="w1-1-1"]')!)
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.pointerDown(svg, { pointerId: 1, clientX: 100, clientY: 100 })
    fireEvent.pointerDown(svg, { pointerId: 2, clientX: 200, clientY: 100 })
    fireEvent.pointerMove(svg, { pointerId: 2, clientX: 300, clientY: 100 })
    expect(svg.getAttribute('data-zoom')).toBe('2.00')
    fireEvent.pointerCancel(svg, { pointerId: 1 }); fireEvent.pointerCancel(svg, { pointerId: 2 })
    fireEvent.click(screen.getByRole('button', { name: 'Fit map' }))
    expect(svg.getAttribute('data-zoom')).toBe('1.00')
  })

  it('lists 24 parties in Party Hall, its counter/peek, the Rift pick and capital sign-up', async () => {
    const s = await fixture()
    show(s, <><PartyCounter /><PartyPeek /><PartyHallPage place={placeById('party-hall')!} rest="" /></>)
    expect(screen.getByLabelText('24 of 24 parties full')).toBeTruthy()
    expect(screen.getAllByText('Party 24')).toHaveLength(1)
    cleanup(); show(s, <PartyPick campaign={campaign} world={s.tierWorlds['1']!} value={null} block={() => null} onChange={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /Change the party/ }))
    expect(screen.getByText('Party 24')).toBeTruthy()
    cleanup(); show(s, <NewRun campaign={campaign} continent={campaign.continents[0]!} place={place} onClose={() => {}} />)
    fireEvent.click(screen.getAllByRole('button', { name: /Pick a party/ })[0]!)
    expect(document.querySelectorAll('[data-capital-party]')).toHaveLength(24)
  })
})
