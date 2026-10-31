// The Gear tab on the real store with a test save (H121): a tile's sheet raises and stays open on the new grade; Raise all
// lists its lines and spends in one save write; a tap on an accessory row wears it (D266); the tab dot and the tiles agree.
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { newGrades, newOwnedUma, newSave, worldOf, type OwnedUma, type Save, type UmaGrades } from '@rpg/domain'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { domMax } from 'motion/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { umaUpgrades } from '../../album/upgrades'
import { albumFixture } from '../../album/testing'
import { resetGame, useGame } from '../../save/game'
import { GearTab } from './GearTab'
import { tabDots } from './profile-tabs'

const NOW = '2026-10-31T12:00:00.000Z'
let outfit: Awaited<ReturnType<typeof albumFixture>>['view']['roster'][number]

async function saveWith(items: Record<string, number>): Promise<Save> {
  const { view } = await albumFixture()
  outfit = view.roster[0]!
  const save = newSave('Gear', NOW)
  const gear = newGrades(1)
  gear.weapons.axe = { grade: 6 }
  gear.weapons.lance = { grade: 7 }
  gear.armor.feet = { grade: 5 }
  const uma: OwnedUma = { ...newOwnedUma(NOW, 'brawler'), level: 40, classId: 'brawler', gear, ranks: { classes: { brawler: { rank: 34, exp: 0 } } },
    classes: { brawler: { weapons: ['greatsword', 'axe', 'lance'], lines: {}, loadout: null } } }
  const world = worldOf(save)
  world.umas[outfit.outfitId] = uma
  world.items = items
  return save
}
function Live() {
  const world = worldOf(useGame((s) => s.save)!)
  return <GearTab outfit={outfit} uma={world.umas[outfit.outfitId]!} world={world} tier={1} upgrades={umaUpgrades(world, outfit, 1)} />
}
function show(save: Save) {
  useGame.setState({ status: 'ready', save, activeTier: 1 })
  render(<MemoryRouter><MotionRoot features={domMax}><AlbumArtProvider art={{ useUrl: () => null }}><Live /></AlbumArtProvider></MotionRoot></MemoryRouter>)
}
const world = () => worldOf(useGame.getState().save!)
const gear = () => world().umas[outfit.outfitId]!.gear as UmaGrades

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

describe('the Gear tab (H121)', () => {
  it('raises from a tile\'s sheet, which stays open on the new grade', async () => {
    show(await saveWith({ 'weapon-gem-g7': 1, 'weapon-gem-g8': 1 }))
    fireEvent.click(screen.getByRole('button', { name: /^Axe, grade 6/ }))
    const sheet = await screen.findByRole('dialog', { name: 'Axe · Slot 2' })
    expect(within(sheet).getByText('G6 → G8')).toBeDefined()
    await act(async () => { fireEvent.click(within(sheet).getByRole('button', { name: 'Raise to G8' })) })
    await waitFor(() => expect(gear().weapons.axe).toEqual({ grade: 8 }))
    expect(world().items).toEqual({})
    expect(within(screen.getByRole('dialog', { name: 'Axe · Slot 2' })).getByRole('button', { name: 'Lv 41' })).toHaveProperty('disabled', true)
  })

  it('raises one grade when G7 is tapped first', async () => {
    show(await saveWith({ 'weapon-gem-g7': 1, 'weapon-gem-g8': 1 }))
    fireEvent.click(screen.getByRole('button', { name: /^Axe, grade 6/ }))
    const sheet = await screen.findByRole('dialog', { name: 'Axe · Slot 2' })
    fireEvent.click(within(sheet).getByRole('radio', { name: 'G7' }))
    await act(async () => { fireEvent.click(within(sheet).getByRole('button', { name: 'Raise to G7' })) })
    await waitFor(() => expect(gear().weapons.axe).toEqual({ grade: 7 }))
    expect(world().items).toEqual({ 'weapon-gem-g8': 1 })
  })

  it('Raise all lists its lines and spends every step in one save write', async () => {
    show(await saveWith({ 'weapon-gem-g7': 1, 'weapon-gem-g8': 2, 'armor-fittings-g6': 1 }))
    expect(screen.getByText('Physical · 3 ready')).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'Raise all' }))
    const sheet = await screen.findByRole('dialog', { name: 'Raise all' })
    expect(within(sheet).getAllByRole('listitem').map((row) => row.textContent)).toEqual([
      'Axe G6 → G8 · Arms Gem G7 ×1 · G8 ×1', 'Lance G7 → G8 · Arms Gem G8 ×1', 'Feet G5 → G6 · Armor Fittings G6 ×1',
    ])
    expect(within(sheet).getByText('Uses 4 items')).toBeDefined()
    const saves: unknown[] = []
    const stop = useGame.subscribe((state, before) => { if (state.save !== before.save) saves.push(state.save) })
    await act(async () => { fireEvent.click(within(sheet).getByRole('button', { name: 'Raise 3' })) })
    await waitFor(() => expect(gear().armor.feet).toEqual({ grade: 6 }))
    stop()
    expect(saves).toHaveLength(1)
    expect(gear().weapons.axe).toEqual({ grade: 8 })
    expect(gear().weapons.lance).toEqual({ grade: 8 })
    expect(world().items).toEqual({})
  })

  it('wears a row on one tap with no Set button, and the tile shows it', async () => {
    show(await saveWith({}))
    const tiles = screen.getAllByRole('button', { name: /^Accessory \d/ })
    expect(tiles).toHaveLength(3)
    fireEvent.click(tiles[1]!)
    const sheet = await screen.findByRole('dialog', { name: 'Accessory 2 · G0' })
    expect(within(sheet).getAllByRole('button', { name: /^(★ )?Orb/ })).toHaveLength(3)
    expect(within(sheet).queryByRole('button', { name: 'Set' })).toBeNull()
    await act(async () => { fireEvent.click(within(sheet).getByRole('button', { name: /^(★ )?Insignia/ })) })
    await waitFor(() => expect(gear().accessories[1]).toMatchObject({ family: 'insignia' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(screen.getByRole('button', { name: /^Accessory 2, Insignia · Off/ })).toBeDefined()
  })

  it('agrees with the tab dot: no ready tiles, no Raise all and no dot with an empty Warehouse', async () => {
    show(await saveWith({}))
    expect(screen.getByText('Physical')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Raise all' })).toBeNull()
    expect(screen.queryByRole('button', { name: /, ready$/ })).toBeNull()
    expect(tabDots(umaUpgrades(world(), outfit, 1), false).gear).toBe(false)
  })
})
