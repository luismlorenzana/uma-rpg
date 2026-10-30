// Classes v3's sheets on today's Skills tab from the switch (H137, D253; classes-v3.md §14.1–§14.2; inert until H134), with
// the switch mocked to 19: the class button opens the Classes sheet; Fight as and Start call `chooseClass` and the sheet
// stays open on its new state; Promote on a Ready tile swaps to the promotion sheet on that child and "Classes ›" swaps
// back; the Manuals door pushes the Exchange's sheet with `{ back: true }` and its Back reopens the Classes sheet; a Tier 0's
// tree is one node with the promotion line; at Rank 10 the class button reads Promote and promoting calls `promoteUma`, then
// the tab shows the child's tree. Invented outfits; the store is the real one, holding a test save.
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { newOwnedUma, newSave, worldOf, type OwnedUma, type RpgClass, type Save } from '@rpg/domain'
import * as battle from '@rpg/domain/battle'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { domMax } from 'motion/react'
import { MemoryRouter, Route, Routes, useLocation, useNavigate, type Location } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { albumFixture } from '../../album/testing'
import { resetGame, useGame } from '../../save/game'
import { SkillsPage } from './SkillsPage'

vi.mock('../../../../../packages/domain/src/rpg/battle/caps', async (orig) =>
  (await import('../../../../../packages/domain/src/rpg/battle/caps-at.fixture')).capsAt(19, await orig()))
vi.mock('@rpg/domain/battle', async (orig) => {
  const actual = await orig<typeof import('@rpg/domain/battle')>()
  return { ...actual, chooseClass: vi.fn(actual.chooseClass), promoteUma: vi.fn(actual.promoteUma) }
})

const NOW = '2026-10-29T12:00:00.000Z'
let outfit: Awaited<ReturnType<typeof albumFixture>>['view']['roster'][number]
let location: Location

type Tracks = Partial<Record<RpgClass, { rank: number; exp: number }>>
/** A save with one Uma, fighting as `classId` with these Class Ranks and no saved setups. */
async function saveWith(classId: RpgClass, classes: Tracks, level = 30): Promise<Save> {
  const { view } = await albumFixture()
  outfit = view.roster[0]!
  const save = newSave('Classes', NOW)
  const uma: OwnedUma = { ...newOwnedUma(NOW), level, classId, ranks: { classes } }
  worldOf(save).umas[outfit.outfitId] = uma
  return save
}
/** The promotion page's Uma C: a Brawler R34 who holds Arms Spellblade R12, her Recruit at 10, an Acolyte started at R4. */
const umaC = () => saveWith('brawler', { brawler: { rank: 34, exp: 0 }, spellblade: { rank: 12, exp: 0 }, recruit: { rank: 10, exp: 0 }, acolyte: { rank: 4, exp: 0 } })

function Probe() {
  location = useLocation()
  return null
}
function ExchangeStub() {
  const navigate = useNavigate()
  return <button type="button" onClick={() => navigate(-1)}>Back to the profile</button>
}
function show(save: Save) {
  useGame.setState({ status: 'ready', save, activeTier: 1 })
  const path = `/town/stable/outfit/${outfit.outfitId}`
  render(<MemoryRouter initialEntries={[{ pathname: path, state: { fromPlace: true } }]}>
    <MotionRoot features={domMax}><AlbumArtProvider art={{ useUrl: () => null }}>
      <Probe />
      <Routes>
        <Route path="/town/stable/*" element={<SkillsPage outfit={outfit} name="Aster" />} />
        <Route path="/town/exchange/*" element={<ExchangeStub />} />
      </Routes>
    </AlbumArtProvider></MotionRoot>
  </MemoryRouter>)
}
const her = () => worldOf(useGame.getState().save!).umas[outfit.outfitId]!
const sheet = (name: string | RegExp) => screen.getByRole('dialog', { name })
const tile = (id: string) => document.querySelector<HTMLElement>(`[data-class-tile="${id}"]`)!
const footer = () => document.querySelector<HTMLButtonElement>('[data-classes-footer]')!
/** The promotion sheet's before → after line (each side a span of its own, so it wraps after the arrow). */
const plan = () => document.querySelector('[data-promotion-plan] p')!.textContent

beforeEach(() => {
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  configureKit({ storagePrefix: 'rpg.' })
  setReducedMotion(true)
  vi.mocked(battle.chooseClass).mockClear()
  vi.mocked(battle.promoteUma).mockClear()
})
afterEach(() => {
  cleanup()
  resetGame()
  vi.unstubAllGlobals()
})

describe('the Classes sheet on the Skills tab (v19)', () => {
  it('opens from the class button on the tree; Fight as switches her and the sheet stays open on its new state', async () => {
    show(await umaC())
    fireEvent.click(screen.getByRole('button', { name: 'Class: Brawler, R34' }))
    const classes = sheet('Classes')
    expect(within(classes).getAllByRole('radio')).toHaveLength(13)
    expect(tile('brawler').getAttribute('aria-checked')).toBe('true')
    expect(footer().textContent).toBe('Fights as Brawler')
    expect(footer().disabled).toBe(true)

    fireEvent.click(tile('spellblade'))
    expect(within(classes).getByText('Arms Spellblade · Held')).toBeDefined()
    expect(footer().textContent).toBe('Fight as Arms Spellblade')
    await act(async () => { fireEvent.click(footer()) })
    await waitFor(() => expect(vi.mocked(battle.chooseClass)).toHaveBeenCalledWith(expect.anything(), outfit.outfitId, 'spellblade', expect.any(String), '1'))
    await waitFor(() => expect(tile('spellblade').dataset.state).toBe('on'))
    expect(footer().textContent).toBe('Fights as Arms Spellblade')
    expect(her().classId).toBe('spellblade')
  })

  it('starts an open Tier 0 at R1, and a closed tile says its gate', async () => {
    show(await umaC())
    fireEvent.click(screen.getByRole('button', { name: 'Class: Brawler, R34' }))
    fireEvent.click(tile('tomeblade'))
    expect(footer().textContent).toBe('Opens with Duelist R10 or Initiate R10')
    expect(footer().disabled).toBe(true)
    fireEvent.click(tile('caller'))
    expect(footer().textContent).toBe('Start Caller · R1')
    await act(async () => { fireEvent.click(footer()) })
    await waitFor(() => expect(vi.mocked(battle.chooseClass)).toHaveBeenCalledWith(expect.anything(), outfit.outfitId, 'caller', expect.any(String), '1'))
    await waitFor(() => expect(tile('caller').dataset.state).toBe('on'))
  })

  it('swaps to the promotion sheet on a Ready tile\'s child, and "Classes" swaps back: never two sheets', async () => {
    show(await umaC())
    fireEvent.click(screen.getByRole('button', { name: 'Class: Brawler, R34' }))
    fireEvent.click(tile('armsummoner'))
    expect(footer().textContent).toBe('Promote to Arms Summoner')
    fireEvent.click(footer())
    const promotion = await screen.findByRole('dialog', { name: 'Promote · Recruit R10' })
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Classes' })).toBeNull())
    expect(within(promotion).getByRole('radio', { name: 'Arms Summoner' }).getAttribute('aria-checked')).toBe('true')
    expect(within(promotion).getByRole('radio', { name: 'Brawler, Held' })).toBeDefined()
    expect(plan()).toBe('Recruit R10 → Arms Summoner R10')
    fireEvent.click(within(promotion).getByRole('button', { name: /^Classes/ }))
    expect(await screen.findByRole('dialog', { name: 'Classes' })).toBeDefined()
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /^Promote/ })).toBeNull())
  })

  it('opens the Exchange\'s Manual sheet on her with { back: true }, and its Back reopens the Classes sheet', async () => {
    show(await umaC())
    fireEvent.click(screen.getByRole('button', { name: 'Class: Brawler, R34' }))
    await act(async () => { fireEvent.click(within(sheet('Classes')).getByRole('button', { name: /^Class Manuals/ })) })
    await waitFor(() => expect(location.pathname).toBe(`/town/exchange/manual/${outfit.outfitId}`))
    expect(location.state).toEqual({ back: true })

    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Back to the profile' })) })
    await waitFor(() => expect(location.pathname).toBe(`/town/stable/outfit/${outfit.outfitId}`))
    expect(await screen.findByRole('dialog', { name: 'Classes' })).toBeDefined()
    // The entry's request is read once and replaced away; the profile's own state stays.
    await waitFor(() => expect(location.state).toEqual({ fromPlace: true }))
  })
})

describe('a Tier 0 on the Skills tab (v19)', () => {
  it('draws one node a tree with her skill and weapon, R7/10, no fork or letters, and the promotion line', async () => {
    show(await saveWith('recruit', { recruit: { rank: 7, exp: 100 } }, 7))
    const tabs = within(screen.getByRole('tablist', { name: 'Trees' })).getAllByRole('tab')
    expect(tabs.map((t) => t.getAttribute('aria-label'))).toEqual(['Greatsword', 'Axe', 'Lance'])
    expect(screen.getByRole('button', { name: 'Drill Strike · Greatsword, R7/10, equipped' })).toBeDefined()
    expect(screen.queryByRole('group', { name: /^Branch/ })).toBeNull()
    expect(screen.getByText('Promotion at R10 · 3 to go')).toBeDefined()
    fireEvent.click(tabs[2]!)
    fireEvent.click(screen.getByRole('button', { name: 'Drill Strike · Lance, R7/10, equipped' }))
    const node = await screen.findByRole('dialog', { name: 'Drill Strike · Lance' })
    expect(within(node).getByText('Rank 7 · next at Class Rank 8')).toBeDefined()
    expect(within(node).getByText('Depth 1 · Trunk')).toBeDefined()
    expect(within(node).queryByRole('img', { name: /of 5/ })).toBeNull()
    fireEvent.click(within(node).getByRole('button', { name: 'Close' }))
    // Below Rank 10 the class button opens the tree.
    fireEvent.click(screen.getByRole('button', { name: 'Class: Recruit, R7/10' }))
    expect(await screen.findByRole('dialog', { name: 'Classes' })).toBeDefined()
  })

  it('at R10 reads Promote; the promotion sheet opens on the Suggested child; Promote lands her on its tree', async () => {
    show(await saveWith('recruit', { recruit: { rank: 10, exp: 400 } }, 10))
    expect(screen.getByRole('button', { name: /^Promotion · \+400 EXP waiting/ })).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'Class: Recruit, promotion ready' }))
    const promotion = await screen.findByRole('dialog', { name: 'Promote · Recruit R10' })
    expect(within(promotion).getByText('Free · the others stay open')).toBeDefined()
    expect(within(promotion).getByRole('radio', { name: 'Brawler, Suggested' }).getAttribute('aria-checked')).toBe('true')
    expect(plan()).toBe('Recruit R10 → Brawler R11')
    expect(within(promotion).getByText('Depths 1–2 · 6 skills · +400 EXP')).toBeDefined()
    await act(async () => { fireEvent.click(within(promotion).getByRole('button', { name: 'Promote to Brawler' })) })
    await waitFor(() => expect(vi.mocked(battle.promoteUma)).toHaveBeenCalledWith(expect.anything(), outfit.outfitId, 'recruit', 'brawler', expect.any(String), '1'))
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /^Promote/ })).toBeNull())
    expect(her()).toMatchObject({ classId: 'brawler', ranks: { classes: { brawler: { rank: 11, exp: 120 }, recruit: { rank: 10, exp: 0 } } } })
    // Her Brawler tree: the trunk, the fork and both lines; the class button reads her new rank.
    expect(screen.getByRole('button', { name: 'Class: Brawler, R11' })).toBeDefined()
    expect(screen.getAllByRole('group', { name: /^Branch/ })).toHaveLength(2)
    // The Classes sheet now shows the siblings Ready.
    fireEvent.click(screen.getByRole('button', { name: 'Class: Brawler, R11' }))
    await screen.findByRole('dialog', { name: 'Classes' })
    expect(tile('spellblade').dataset.state).toBe('ready')
    expect(tile('recruit').dataset.state).toBe('available')
  })
})
