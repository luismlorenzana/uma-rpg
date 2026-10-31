// The Class tab's grammar (H120, UP10–UP12): an equipped square opens its sheet and nothing unequips; at a full loadout
// Replace swaps; Auto returns to auto; the Classes sheet's footer is the preset on her own class; the Limit line and its
// door, whose Back reopens the sheet; a Tier 0's weapon sheet lists all ten. Invented outfits; the store is the real one,
// holding a test save.
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { newGrades, newOwnedUma, newSave, rpgRework, withTrack, worldOf, type OwnedUma, type RpgClass, type Save } from '@rpg/domain'
import * as battle from '@rpg/domain/battle'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { domMax } from 'motion/react'
import { MemoryRouter, Route, Routes, useLocation, useNavigate, type Location } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { albumFixture } from '../../album/testing'
import { resetGame, useGame } from '../../save/game'
import { ClassTab } from './ClassTab'

vi.mock('@rpg/domain/battle', async (orig) => {
  const actual = await orig<typeof import('@rpg/domain/battle')>()
  return { ...actual, equipSkills: vi.fn(actual.equipSkills) }
})

const NOW = '2026-10-31T12:00:00.000Z'
let outfit: Awaited<ReturnType<typeof albumFixture>>['view']['roster'][number]
let location: Location

async function saveWith(classId: RpgClass, level: number, rank: number): Promise<Save> {
  const { view } = await albumFixture()
  outfit = view.roster[0]!
  const save = newSave('Class', NOW)
  const base = newOwnedUma(NOW, classId)
  const uma: OwnedUma = { ...base, level, classId, gear: newGrades(1), ranks: withTrack(base.ranks, { kind: 'class', id: classId }, { rank, exp: 0 }) }
  worldOf(save).umas[outfit.outfitId] = uma
  return save
}
function Probe() {
  location = useLocation()
  return null
}
function Live() {
  const world = worldOf(useGame((s) => s.save)!)
  return <ClassTab outfit={outfit} uma={world.umas[outfit.outfitId]!} world={world} />
}
function HallStub() {
  const navigate = useNavigate()
  return <button type="button" onClick={() => navigate(-1)}>Back to her</button>
}
function show(save: Save) {
  useGame.setState({ status: 'ready', save, activeTier: 1 })
  render(<MemoryRouter initialEntries={[{ pathname: `/town/stable/outfit/${outfit.outfitId}/class`, state: { back: true } }]}>
    <MotionRoot features={domMax}><AlbumArtProvider art={{ useUrl: () => null }}>
      <Probe />
      <Routes>
        <Route path="/town/stable/*" element={<Live />} />
        <Route path="/learning/*" element={<HallStub />} />
      </Routes>
    </AlbumArtProvider></MotionRoot>
  </MemoryRouter>)
}
const her = () => worldOf(useGame.getState().save!).umas[outfit.outfitId]!
const squares = () => within(screen.getByLabelText('Equipped skills')).getAllByRole('button')

beforeEach(() => {
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  configureKit({ storagePrefix: 'rpg.' })
  setReducedMotion(true)
  vi.mocked(battle.equipSkills).mockClear()
})
afterEach(() => {
  cleanup()
  resetGame()
  vi.unstubAllGlobals()
})

describe('the Class tab (H120)', () => {
  it('runs on Classes v3', () => expect(rpgRework('classes')).toBe(true))

  it('opens an equipped square\'s sheet and unequips nothing; Unequip there takes it off and the sheet stays open on Equip', async () => {
    show(await saveWith('brawler', 40, 34))
    const count = squares().length
    const square = squares()[0]!
    const name = square.getAttribute('aria-label')!
    fireEvent.click(square)
    const sheet = await screen.findByRole('dialog', { name })
    expect(battle.equipSkills).not.toHaveBeenCalled()
    expect(squares()).toHaveLength(count)
    await act(async () => { fireEvent.click(within(sheet).getByRole('button', { name: 'Unequip' })) })
    await waitFor(() => expect(squares()).toHaveLength(count - 1))
    expect(within(sheet).getByRole('button', { name: 'Equip' })).toBeDefined()
  })

  it('at a full loadout offers Replace: a tap on an equipped skill swaps it in place, then Auto returns to auto', async () => {
    show(await saveWith('brawler', 40, 34))
    expect(screen.getByRole('button', { name: 'Auto' }).getAttribute('aria-pressed')).toBe('true')
    const worn = squares().map((s) => s.getAttribute('aria-label')!)
    const free = [...document.querySelectorAll<HTMLElement>('[data-held]')].find((node) => !worn.some((name) => node.getAttribute('aria-label')!.startsWith(`${name},`)))!
    fireEvent.click(free)
    const sheet = await screen.findByRole('dialog')
    const take = sheet.querySelector('h2, [data-kit="sheet-title"]')?.textContent ?? free.getAttribute('aria-label')!.split(',')[0]!
    fireEvent.click(within(sheet).getByRole('button', { name: 'Replace' }))
    const list = within(sheet).getByRole('list', { name: 'Equipped skills' })
    await act(async () => { fireEvent.click(within(list).getAllByRole('button')[1]!) })
    await waitFor(() => expect(battle.equipSkills).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(squares()[1]!.getAttribute('aria-label')).toBe(take))
    expect(within(sheet).getByRole('button', { name: 'Unequip' })).toBeDefined()
    fireEvent.click(within(sheet).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    const auto = screen.getByRole('button', { name: 'Auto' })
    expect(auto.getAttribute('aria-pressed')).toBe('false')
    await act(async () => { fireEvent.click(auto) })
    await waitFor(() => expect(her().classes.brawler?.loadout ?? null).toBeNull())
  })

  it('offers the other line from a node on it, and a closed node its gate', async () => {
    show(await saveWith('brawler', 40, 22))
    fireEvent.click(document.querySelector('[data-node="brawler-greatsword.3b"]')!)
    const sheet = await screen.findByRole('dialog', { name: /./ })
    expect(within(sheet).getByRole('button', { name: 'Take line B' })).toBeDefined()
    fireEvent.click(within(sheet).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    fireEvent.click(document.querySelector('[data-node="brawler-greatsword.5"]')!)
    expect((await screen.findByRole('button', { name: 'Opens · R40' })).hasAttribute('disabled')).toBe(true)
  })

  it('sets the standard preset from the Classes sheet\'s footer on her own class', async () => {
    show(await saveWith('paladin', 40, 34))
    fireEvent.click(document.querySelector('[data-class-button]')!)
    const classes = await screen.findByRole('dialog', { name: 'Classes' })
    await act(async () => { fireEvent.click(within(classes).getByRole('button', { name: /^Standard preset/ })) })
    await waitFor(() => expect(her().classes.paladin?.weapons).toEqual(['lance', 'greatsword', 'tome-light']))
    expect((await within(classes).findByRole('button', { name: /Standard preset · On/ })).hasAttribute('disabled')).toBe(true)
  })

  it('reads the Limit line; its sheet opens her hall with { back: true }, and Back reopens the sheet', async () => {
    show(await saveWith('brawler', 40, 34))
    fireEvent.click(screen.getByRole('button', { name: 'Limit: None' }))
    const limit = await screen.findByRole('dialog', { name: 'Limit' })
    await act(async () => { fireEvent.click(within(limit).getByRole('button', { name: 'Open Warrior Dojo' })) })
    await waitFor(() => expect(location.pathname).toBe('/learning/brawler-dojo'))
    expect(location.state).toEqual({ back: true })
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Back to her' })) })
    await waitFor(() => expect(location.pathname).toContain('/class'))
    expect(await screen.findByRole('dialog', { name: 'Limit' })).toBeDefined()
    await waitFor(() => expect(location.state).toEqual({ back: true }))
  })

  it('lists all ten weapons for a Tier 0, Arms first, and the sheet stays open on the new weapon', async () => {
    show(await saveWith('recruit', 7, 7))
    fireEvent.click(screen.getByRole('button', { name: /^Change/ }))
    const sheet = await screen.findByRole('dialog', { name: 'Slot 1 · Any' })
    const rows = within(sheet).getAllByRole('button').filter((b) => b.textContent!.includes('Might'))
    expect(rows).toHaveLength(10)
    expect(rows[0]!.textContent).toContain('Greatsword')
    await act(async () => { fireEvent.click(rows[4]!) })
    await waitFor(() => expect(her().classes.recruit?.weapons[0]).not.toBe('greatsword'))
    expect(screen.getByRole('dialog', { name: 'Slot 1 · Any' })).toBeDefined()
  })
})
