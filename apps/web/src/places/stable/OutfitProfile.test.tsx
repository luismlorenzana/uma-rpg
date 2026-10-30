import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot } from '@luismlorenzana/uma-kit/ui'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { domAnimation } from 'motion/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { placeById, raiseGrade, setJewel, withTrack, worldOf, type RpgClass, type Save, type TierWorld } from '@rpg/domain'
import { albumFixture, NOW } from '../../album/testing'
import { OutfitProfile, rankGridClasses } from './OutfitProfile'

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

const profile = (outfitId = '81001') => <MemoryRouter><MotionRoot features={domAnimation}><AlbumArtProvider art={{ useUrl: () => null }}>
  <OutfitProfile view={fixture.view} outfitId={outfitId} place={placeById('stable')!} />
</AlbumArtProvider></MotionRoot></MemoryRouter>
const withWorld = (save: Save, fn: (w: TierWorld) => TierWorld): Save => ({ ...save, tierWorlds: { ...save.tierWorlds, '1': fn(worldOf(save)) } })

describe('her profile says what she can upgrade (H34; R2\'s grades and jewels since H82)', () => {
  it('keeps profile actions compact: an icon target, one-row accessory families, and one selected action', () => {
    render(profile())
    expect(screen.getByRole('button', { name: 'Mark target' }).textContent).toBe('')

    fireEvent.click(screen.getByRole('tab', { name: 'Gear' }))
    const families = within(screen.getByRole('radiogroup', { name: 'Accessory family' })).getAllByRole('radio')
    expect(families).toHaveLength(4)
    expect(families.map((family) => family.getAttribute('aria-label')!.replace('Signature ', '')).sort()).toEqual(['Pendant', 'Bell', 'Orb', 'Insignia'].sort())
    expect(screen.getAllByRole('button', { name: 'Set' })).toHaveLength(1)

    fireEvent.click(screen.getByRole('radio', { name: 'Orb' }))
    expect(within(screen.getByRole('group', { name: 'Orb: which weapon' })).getAllByRole('button')).toHaveLength(3)
    expect(screen.getAllByRole('button', { name: 'Set' })).toHaveLength(1)
  })

  it('shows the Gear dot, the grade rows\' marks and the jewels to set, and drops them once used; no skill costs points (v16 on)', () => {
    // Aster: a Recruit at Class Rank 5, and a Weapon Gem G1 and a Planet Jewel I in the Warehouse.
    let save = withWorld(fixture.save, (w) => {
      const aster = w.umas['81001']!
      return { ...w, items: { 'weapon-gem-g1': 1, 'jewel-planet-1': 1 }, umas: { ...w.umas, '81001': { ...aster,
        ranks: withTrack(aster.ranks, { kind: 'class', id: 'recruit' }, { rank: 5, exp: 0 }) } } }
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

  it('keeps the compact sheet controls touchable and omits the locked ticket balance', () => {
    const aster = fixture.world.umas['81001']!
    fixture.world = { ...fixture.world,
      heroes: { 'brawler-1': { hero: '81002', learners: ['81001'] } },
      umas: { ...fixture.world.umas, '81001': { ...aster,
        classId: 'brawler',
        classes: { ...aster.classes, brawler: { weapons: ['greatsword', 'axe', 'lance'], lines: {}, loadout: [] } },
        bonds: { 'brawler-1': { level: 2, exp: 0 } },
      } },
    }
    const ui = render(profile())
    expect(screen.getByRole('button', { name: /^Template:/ }).className).toContain('min-h-11')
    expect(screen.getByRole('button', { name: 'Back to auto' }).className).toContain('min-h-11')

    fireEvent.click(screen.getByRole('tab', { name: 'Skills' }))
    expect(screen.getByRole('button', { name: /Bond 2\/10/ }).className).toContain('min-h-11')

    ui.rerender(profile('81006'))
    expect(screen.getByRole('button', { name: 'Unlock · 1 Ticket' })).toBeDefined()
    expect(screen.queryByText(/Tickets left/)).toBeNull()
  })
})

/** Aster fighting as `classId` with these Class Ranks. */
function aster(classId: RpgClass, classes: Record<string, { rank: number; exp: number }>): TierWorld {
  const world = worldOf(fixture.save)
  return { ...world, umas: { ...world.umas, '81001': { ...world.umas['81001']!, level: 10, classId, ranks: { classes } } } }
}

/** Her profile's Ready dot (H137, D253; live since H134): the Skills tab carries the kit's green dot while she fights as a
 * Tier 0 at Class Rank 10 with a child she doesn't hold, and drops it below Rank 10 or once she fights as a Tier 1 class. */
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

describe('the Class Ranks grid (v19)', () => {
  it('lists the five Tier 0s and the Tier 1 classes she holds in Tier 1\'s world, the eight Tier 1 classes in a later one', () => {
    const ranks = { classes: { recruit: { rank: 10, exp: 0 }, brawler: { rank: 10, exp: 0 } } }
    expect(rankGridClasses({ ranks }, 1)).toEqual(['recruit', 'duelist', 'acolyte', 'caller', 'apprentice', 'brawler'])
    expect(rankGridClasses({ ranks }, 2)).toEqual(['brawler', 'spellblade', 'armsummoner', 'paladin', 'cleric', 'summoner', 'tomeblade', 'mage'])
  })
})
