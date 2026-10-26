import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot } from '@luismlorenzana/uma-kit/ui'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { domAnimation } from 'motion/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { placeById, raiseGrade, setJewel, withTrack, worldOf, type Save, type TierWorld } from '@rpg/domain'
import { albumFixture, NOW } from '../../album/testing'
import { OutfitProfile } from './OutfitProfile'

let fixture: Awaited<ReturnType<typeof albumFixture>>
vi.mock('../../save/game', async importOriginal => ({ ...await importOriginal<typeof import('../../save/game')>(), useWorld: () => fixture.world }))
vi.mock('../../master/master', async importOriginal => ({ ...await importOriginal<typeof import('../../master/master')>(),
  useMaster: () => ({ status: 'ready', view: fixture.view }),
}))
vi.mock('@luismlorenzana/uma-kit/content', async importOriginal => ({
  ...await importOriginal<typeof import('@luismlorenzana/uma-kit/content')>(), useArtUrl: () => null,
}))

beforeEach(async () => {
  fixture = await albumFixture()
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null,
    setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  configureKit({ storagePrefix: 'rpg.' })
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

const profile = () => <MemoryRouter><MotionRoot features={domAnimation}><AlbumArtProvider art={{ useUrl: () => null }}>
  <OutfitProfile view={fixture.view} outfitId="81001" place={placeById('stable')!} />
</AlbumArtProvider></MotionRoot></MemoryRouter>
const withWorld = (save: Save, fn: (w: TierWorld) => TierWorld): Save => ({ ...save, tierWorlds: { ...save.tierWorlds, '1': fn(worldOf(save)) } })

describe('her profile says what she can upgrade (H34; R2\'s grades and jewels since H82)', () => {
  it('shows the Gear dot, the grade rows\' marks and the jewels to set, and drops them once used; no skill costs points (v16 on)', () => {
    // Aster: Class Rank 5, and a Weapon Gem G1 and a Planet Jewel I in the Warehouse.
    let save = withWorld(fixture.save, (w) => {
      const aster = w.umas['81001']!
      return { ...w, items: { 'weapon-gem-g1': 1, 'jewel-planet-1': 1 }, umas: { ...w.umas, '81001': { ...aster,
        ranks: withTrack(aster.ranks, { kind: 'class', id: 'brawler' }, { rank: 5, exp: 0 }) } } }
    })
    fixture.world = worldOf(save)
    const ui = render(profile())
    // Nothing costs points from engine v16 (CP14): the Skills tab has no dot and her class chip no points pill.
    expect(screen.getByRole('tab', { name: 'Skills' })).toBeDefined()
    expect(screen.queryByText(/\d pts/)).toBeNull()
    fireEvent.click(screen.getByRole('tab', { name: 'Gear, can upgrade' }))
    // Equip opens first (H107); the Upgrade view's tab counts what can raise or be set.
    expect(screen.getByRole('tab', { name: 'Equip' }).getAttribute('aria-selected')).toBe('true')
    fireEvent.click(screen.getByRole('tab', { name: /^Upgrade · \d+$/ }))
    // The one Weapon Gem could raise any of her three weapons: each row is marked; the jewel opens Planet I.
    expect(screen.getAllByRole('img', { name: 'Can upgrade' })).toHaveLength(3)
    expect(screen.getByText('1 to set')).toBeDefined()

    // She raises her Greatsword and sets the jewel on Planet I.
    save = raiseGrade(save, '81001', { kind: 'weapon', weapon: 'greatsword' }, NOW)
    save = setJewel(save, '81001', 'jewel-planet-1', 'planet:1', NOW)
    fixture.world = worldOf(save)
    ui.rerender(profile())
    expect(screen.getByRole('tab', { name: 'Gear' })).toBeDefined()
    expect(screen.getByRole('tab', { name: 'Upgrade' })).toBeDefined()
    expect(screen.getByRole('tab', { name: 'Skills' })).toBeDefined()
    expect(screen.queryByRole('img', { name: 'Can upgrade' })).toBeNull()
    expect(screen.queryByText(/to set/)).toBeNull()
  })
})
