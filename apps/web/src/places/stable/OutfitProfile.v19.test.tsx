// Her profile's Ready dot from the switch (H137, D253; inert until H134), with the switch mocked to 19: the Skills tab carries
// the kit's green dot while she fights as a Tier 0 at Class Rank 10 with a child she doesn't hold, and drops it below Rank
// 10 or once she fights as a Tier 1 class. Invented outfits only.
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot } from '@luismlorenzana/uma-kit/ui'
import { placeById, worldOf, type RpgClass, type Save, type TierWorld } from '@rpg/domain'
import { cleanup, render, screen } from '@testing-library/react'
import { domAnimation } from 'motion/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { albumFixture } from '../../album/testing'
import { OutfitProfile } from './OutfitProfile'

vi.mock('../../../../../packages/domain/src/rpg/battle/caps', async (orig) =>
  (await import('../../../../../packages/domain/src/rpg/battle/caps-at.fixture')).capsAt(19, await orig()))
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
/** Aster fighting as `classId` with these Class Ranks. */
function aster(classId: RpgClass, classes: Record<string, { rank: number; exp: number }>): TierWorld {
  const save: Save = fixture.save
  const world = worldOf(save)
  return { ...world, umas: { ...world.umas, '81001': { ...world.umas['81001']!, level: 10, classId, ranks: { classes } } } }
}

describe('the Skills tab\'s Ready dot (v19)', () => {
  it('shows while a promotion waits on her Tier 0 at R10', () => {
    fixture.world = aster('recruit', { recruit: { rank: 10, exp: 400 } })
    render(profile())
    expect(screen.getByRole('tab', { name: 'Skills, ready' })).toBeDefined()
    expect(screen.getByRole('tab', { name: 'Gear' })).toBeDefined()
  })

  it('stays off below R10 and as a Tier 1 class', () => {
    fixture.world = aster('recruit', { recruit: { rank: 9, exp: 0 } })
    const ui = render(profile())
    expect(screen.getByRole('tab', { name: 'Skills' })).toBeDefined()
    fixture.world = aster('brawler', { recruit: { rank: 10, exp: 0 }, brawler: { rank: 10, exp: 0 } })
    ui.rerender(profile())
    expect(screen.getByRole('tab', { name: 'Skills' })).toBeDefined()
  })
})
