import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot } from '@luismlorenzana/uma-kit/ui'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { domAnimation } from 'motion/react'
import { MemoryRouter, Route, Routes, useLocation, useNavigate, useParams, type InitialEntry } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  activeClass, placeById, tradePlaces, umaBattleSheet, umaPick, umaTrade,
  type OwnedUma,
} from '@rpg/domain'
import { albumFixture } from '../../album/testing'
import * as copy from './copy'
import { OutfitProfile, rankGridClasses } from './OutfitProfile'

let fixture: Awaited<ReturnType<typeof albumFixture>>
let ownerTier: number | null
vi.mock('../../save/game', async importOriginal => ({
  ...await importOriginal<typeof import('../../save/game')>(),
  useWorld: () => fixture.world,
  useOwnerTier: () => ownerTier,
}))
vi.mock('../../master/master', async importOriginal => ({
  ...await importOriginal<typeof import('../../master/master')>(),
  useMaster: () => ({ status: 'ready', view: fixture.view }),
}))
vi.mock('@luismlorenzana/uma-kit/content', async importOriginal => ({
  ...await importOriginal<typeof import('@luismlorenzana/uma-kit/content')>(), useArtUrl: () => null,
}))

let storage: Map<string, string>
beforeEach(async () => {
  fixture = await albumFixture()
  ownerTier = null
  storage = new Map()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  })
  configureKit({ storagePrefix: 'rpg.' })
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

function ProfileRoute() {
  const params = useParams()
  const route = params['*']?.split('/')[0]
  return <OutfitProfile view={fixture.view} outfitId={params.outfitId!} place={placeById('stable')!} route={route} />
}

function Where() {
  const location = useLocation()
  return <output data-testid="where">{location.pathname}|{JSON.stringify(location.state)}</output>
}

function Back() {
  const navigate = useNavigate()
  return <button type="button" onClick={() => navigate(-1)}>History back</button>
}

function profile(path = '/town/stable/outfit/81001/class', entries?: InitialEntry[]) {
  return <MemoryRouter initialEntries={entries ?? [path]} initialIndex={(entries?.length ?? 1) - 1}>
    <MotionRoot features={domAnimation}><AlbumArtProvider art={{ useUrl: () => null }}>
      <Routes>
        <Route path="/before" element={<p>Before</p>} />
        <Route path="/town/stable/outfit/:outfitId/*" element={<ProfileRoute />} />
        <Route path="*" element={<p>Elsewhere</p>} />
      </Routes>
      <Where /><Back />
    </AlbumArtProvider></MotionRoot>
  </MemoryRouter>
}

describe('the Uma profile v2 frame (H119)', () => {
  it('uses the compact header, progress, facts and four fixed tabs only', () => {
    render(profile())
    expect(document.querySelector('[data-kit="profile-header"]')).not.toBeNull()
    expect(screen.getByRole('progressbar', { name: /\d+\/\d+/ })).toBeDefined()
    expect(screen.queryByText('All outfits')).toBeNull()
    expect(screen.getByRole('button', { name: 'Mark target' }).textContent).toBe('')
    expect(screen.getByRole('button', { name: 'Party No party' }).className).toContain('min-h-11')
    expect(screen.getByRole('button', { name: 'Work Idle' }).className).toContain('min-h-11')
    expect(screen.getByRole('button', { name: 'Details' }).className).toContain('min-h-11')
    expect(within(screen.getByRole('tablist', { name: 'Profile' })).getAllByRole('tab').map(tab => tab.textContent)).toEqual(['Class', 'Gear', 'Stars', 'Template'])
    for (const old of ['Skills', 'Battle', 'Work', 'Racing']) expect(screen.queryByRole('tab', { name: old })).toBeNull()
  })

  it('lets the route win, remembers it, replaces bare and unknown routes, and replaces tab history', async () => {
    storage.set('rpg.profile.tab.v3', 'gear')
    const ui = render(profile('/town/stable/outfit/81001/template'))
    expect(screen.getByRole('tab', { name: 'Template' }).getAttribute('aria-selected')).toBe('true')
    expect(storage.get('rpg.profile.tab.v3')).toBe('template')
    ui.unmount()

    storage.set('rpg.profile.tab.v3', 'stars')
    render(profile('/town/stable/outfit/81001/unknown'))
    await waitFor(() => expect(screen.getByTestId('where').textContent).toContain('/town/stable/outfit/81001/stars'))
    cleanup()

    cleanup()
    storage.delete('rpg.profile.tab.v3')
    storage.set('rpg.profile.tab.v2', 'racing')
    render(profile('/town/stable/outfit/81001'))
    await waitFor(() => expect(screen.getByTestId('where').textContent).toContain('/town/stable/outfit/81001/template'))
    expect(screen.getByRole('tab', { name: 'Template' }).getAttribute('aria-selected')).toBe('true')
    expect(storage.has('rpg.profile.tab.v2')).toBe(false)
    cleanup()

    render(profile('/town/stable/outfit/81001/class', ['/before', { pathname: '/town/stable/outfit/81001/class', state: { back: true } }]))
    fireEvent.click(screen.getByRole('tab', { name: 'Gear' }))
    expect(screen.getByTestId('where').textContent).toBe('/town/stable/outfit/81001/gear|{"back":true}')
    fireEvent.click(screen.getByRole('button', { name: 'History back' }))
    await waitFor(() => expect(screen.getByText('Before')).toBeDefined())
  })

  it('opens the Party and Work facts through exact Back-aware routes', async () => {
    const outfit = fixture.view.roster.find(row => row.outfitId === '81001')!
    const uma = fixture.world.umas['81001']!
    const idle = placeById(tradePlaces(umaTrade(outfit, umaPick(uma)))[0])!
    const ui = render(profile())
    fireEvent.click(screen.getByRole('button', { name: 'Party No party' }))
    await waitFor(() => expect(screen.getByTestId('where').textContent).toBe('/town/party-hall|{"back":true}'))
    ui.unmount()
    render(profile())
    fireEvent.click(screen.getByRole('button', { name: 'Work Idle' }))
    await waitFor(() => expect(screen.getByTestId('where').textContent).toBe(`/${idle.page}/${idle.id}|{"back":true}`))

    cleanup()
    fixture.world.parties[0]!.slots[0] = '81001'
    render(profile())
    fireEvent.click(screen.getByRole('button', { name: 'Party Party 1' }))
    await waitFor(() => expect(screen.getByTestId('where').textContent).toBe('/town/party-hall/1|{"back":true}'))

    cleanup()
    fixture.world.world.run.battle = { input: { allies: [{ id: '81001' }] } } as typeof fixture.world.world.run.battle
    render(profile())
    expect(screen.getByRole('button', { name: 'Party Fighting' })).toBeDefined()
  })

  it('shows every battle row, Core, Work and Since in the Details sheet, with a collapsed formula', () => {
    render(profile())
    fireEvent.click(screen.getByRole('button', { name: 'Details' }))
    const details = document.querySelector('[data-profile-details]') as HTMLElement
    expect(details).not.toBeNull()
    const outfit = fixture.view.roster.find(row => row.outfitId === '81001')!
    const uma = fixture.world.umas['81001']!
    const sheet = umaBattleSheet(outfit, uma, activeClass(outfit, uma, 1), 1)
    for (const group of sheet) {
      expect(within(details).getByText(group.title)).toBeDefined()
      for (const row of group.rows) expect(within(details).getAllByText(row.label).length).toBeGreaterThan(0)
    }
    for (const label of ['Core', 'Work', 'Since', 'Speed', 'Craft', 'Unlocked']) expect(within(details).getByText(label)).toBeDefined()
    expect(within(details).getByText(copy.coreSource(outfit.baseStats.speed, outfit.growthRatePercents.speed))).toBeDefined()
    expect(within(details).queryByText(/Fights as/)).toBeNull()
    expect(within(details).queryByText(/Total with armor/)).toBeNull()
    expect(document.querySelector('[data-stat-formula]')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'How stats add up +' }))
    const formula = document.querySelector('[data-stat-formula]') as HTMLElement
    expect(formula).not.toBeNull()
    for (const line of copy.statFormulaLines) expect(within(formula).getByText(line)).toBeDefined()
  })

  it('keeps the healer-only Mends row in Details', () => {
    fixture.world.umas['81001']!.classId = 'paladin'
    render(profile())
    fireEvent.click(screen.getByRole('button', { name: 'Details' }))
    expect(within(document.querySelector('[data-profile-details]') as HTMLElement).getByText('Mends')).toBeDefined()
  })

  it('keeps Gear stacked, embeds the shared Stars body and renders Template inline', () => {
    const ui = render(profile('/town/stable/outfit/81001/gear'))
    expect(screen.getByRole('heading', { name: 'Equip' })).toBeDefined()
    expect(screen.getByRole('heading', { name: /^Upgrade/ })).toBeDefined()
    expect(screen.queryByRole('tablist', { name: 'Gear' })).toBeNull()
    ui.unmount()

    render(profile('/town/stable/outfit/81001/stars'))
    expect(document.querySelector('[data-stars-panel]')).not.toBeNull()
    expect(screen.getByLabelText('Planet-and-moons map')).toBeDefined()
    cleanup()

    render(profile('/town/stable/outfit/81001/template'))
    expect(document.querySelector('[data-profile-template]')).not.toBeNull()
    expect(screen.getByText('Aptitudes')).toBeDefined()
    expect(screen.getByText('Unique skill')).toBeDefined()
  })

  it('keeps a locked or elsewhere outfit compact and gives it Template content without tabs', () => {
    const ui = render(profile('/town/stable/outfit/81006/template'))
    expect(screen.queryByRole('tablist', { name: 'Profile' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Unlock · 1 Ticket' })).toBeDefined()
    expect(document.querySelector('[data-profile-template]')).not.toBeNull()
    ownerTier = 2
    ui.rerender(profile('/town/stable/outfit/81006/template'))
    expect(screen.getByText('In Tier 2')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Unlock · 1 Ticket' })).toBeNull()
  })

  it('labels Gear and Stars dots independently and never dots Class', () => {
    fixture.world = { ...fixture.world, items: { ...fixture.world.items, 'weapon-gem-g1': 1, 'jewel-planet-1': 3 } }
    render(profile())
    expect(screen.getByRole('tab', { name: 'Class' })).toBeDefined()
    expect(screen.getByRole('tab', { name: 'Gear, ready' })).toBeDefined()
    expect(screen.getByRole('tab', { name: 'Stars, ready' })).toBeDefined()
  })
})

describe('the Class Ranks grid (v19)', () => {
  it('lists Tier 0s plus held Tier 1 classes in Tier 1, and every Tier 1 class later', () => {
    const ranks = { classes: { recruit: { rank: 10, exp: 0 }, brawler: { rank: 10, exp: 0 } } }
    expect(rankGridClasses({ ranks } as Pick<OwnedUma, 'ranks'>, 1)).toEqual(['recruit', 'duelist', 'acolyte', 'caller', 'apprentice', 'brawler'])
    expect(rankGridClasses({ ranks } as Pick<OwnedUma, 'ranks'>, 2)).toEqual(['brawler', 'spellblade', 'armsummoner', 'paladin', 'cleric', 'summoner', 'tomeblade', 'mage'])
  })
})
