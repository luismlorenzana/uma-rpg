import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot } from '@luismlorenzana/uma-kit/ui'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { domAnimation } from 'motion/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  equipGear, learnSkill, placeById, rpgDefaultWeapons, rpgProfileTrees, setActiveNodes, setGem, withTrack, worldOf, type Save, type TierWorld,
} from '@rpg/domain'
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

describe('her profile says what she can upgrade (H34)', () => {
  it('shows the Gear and Skills dots, the gear row marks and the Extra Stats count, and drops them once used', () => {
    // Aster: Class Rank 5 (five depth-1 side points), a Greatsword and a gem in stock, and an open node switched off.
    let save = withWorld(fixture.save, (w) => {
      const aster = w.umas['81001']!
      return { ...w, gear: { 'greatsword-g1': 1 }, gems: { 'gem-hp-1': 1 }, umas: { ...w.umas, '81001': { ...aster,
        ranks: withTrack(aster.ranks, { kind: 'class', id: 'brawler' }, { rank: 5, exp: 0 }), stars: { unlocked: ['moon:atk:1'], active: [] } } } }
    })
    fixture.world = worldOf(save)
    const ui = render(profile())
    expect(screen.getByRole('tab', { name: 'Skills, can upgrade' })).toBeDefined()
    expect(screen.getByText('5 pts').className).toContain('bg-success')
    expect(screen.getByRole('button', { name: 'Weapon 1: Training Greatsword, can upgrade' })).toBeDefined()
    fireEvent.click(screen.getByRole('tab', { name: 'Gear, can upgrade' }))
    const marks = screen.getAllByRole('img', { name: 'Can upgrade' })
    expect(marks).toHaveLength(1)
    expect(within(marks[0]!.closest('button')!).getByText('Weapon 1')).toBeDefined()
    expect(screen.getByText('1 to set · 1 free')).toBeDefined()

    // She equips the Greatsword, sets the gem, switches the node on and learns a side in each of her five trees.
    const aster = fixture.view.roster[0]!
    save = equipGear(save, '81001', 'greatsword-g1', NOW)
    save = setGem(save, '81001', 'gem-hp-1', NOW).save
    save = setActiveNodes(save, '81001', ['moon:hp:1', 'moon:atk:1'], NOW)
    for (const tree of rpgProfileTrees({ classId: 'brawler', weapons: rpgDefaultWeapons('brawler') })) save = learnSkill(save, aster, 'brawler', `${tree}.1a`, NOW)
    fixture.world = worldOf(save)
    ui.rerender(profile())
    expect(screen.getByRole('tab', { name: 'Gear' })).toBeDefined()
    expect(screen.getByRole('tab', { name: 'Skills' })).toBeDefined()
    expect(screen.queryByRole('img', { name: 'Can upgrade' })).toBeNull()
    expect(screen.queryByText(/to set|\d free/)).toBeNull()
    expect(screen.queryByText(/\d pts/)).toBeNull()
  })
})
