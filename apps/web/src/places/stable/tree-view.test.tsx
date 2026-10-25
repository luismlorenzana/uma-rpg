// The Skills tab from engine v16 (H70; class-progression.md §6.1, §6.2, CP23, CP32), with the one switch mocked to 16 in this
// file of its own (H64's `capsAt`): three weapon tabs, a tree a slot with its trunk and fork, her branch filled and the
// other dimmed, a closed depth faded with its gate, five rank pips, and the branch sheet's "Take branch A" calling the
// save's `pickBranch`. Invented outfits; the store is the real one, holding a test save.
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { BATTLE_ENGINE_VERSION, newOwnedUma, newSave, rpgNode, withTrack, worldOf, type Save } from '@rpg/domain'
import * as battle from '@rpg/domain/battle'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { domMax } from 'motion/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { albumFixture } from '../../album/testing'
import { resetGame, useGame } from '../../save/game'
import { SkillsPage } from './SkillsPage'

vi.mock('../../../../../packages/domain/src/rpg/battle/caps', async (orig) =>
  (await import('../../../../../packages/domain/src/rpg/battle/caps-at.fixture')).capsAt(16, await orig()))
vi.mock('@rpg/domain/battle', async (orig) => {
  const actual = await orig<typeof import('@rpg/domain/battle')>()
  return { ...actual, pickBranch: vi.fn(actual.pickBranch) }
})

const NOW = '2026-10-25T12:00:00.000Z'
let outfit: Awaited<ReturnType<typeof albumFixture>>['view']['roster'][number]

/** A Lv 30 Brawler at Class Rank 22 on her three defaults, her Lance on branch B, skills chosen for her. */
async function brawler(): Promise<Save> {
  const { view } = await albumFixture()
  outfit = view.roster[0]!
  const save = newSave('Trees', NOW)
  const base = newOwnedUma(NOW, 'brawler')
  worldOf(save).umas[outfit.outfitId] = {
    ...base, level: 30, classId: 'brawler',
    ranks: withTrack(base.ranks, { kind: 'class', id: 'brawler' }, { rank: 22, exp: 0 }),
    classes: { brawler: { weapons: ['greatsword', 'axe', 'lance'], lines: { lance: 'B' }, loadout: null } },
  }
  return save
}
function show(save: Save) {
  useGame.setState({ status: 'ready', save, activeTier: 1 })
  render(<MemoryRouter><MotionRoot features={domMax}><AlbumArtProvider art={{ useUrl: () => null }}>
    <SkillsPage outfit={outfit} name="Aster" />
  </AlbumArtProvider></MotionRoot></MemoryRouter>)
}
const node = (id: string) => document.querySelector<HTMLElement>(`[data-node="${id}"]`)!
const branch = (name: RegExp) => screen.getByRole('group', { name })

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

describe('the Skills tab as a tree (H70)', () => {
  it('runs with the switch at 16', () => expect(BATTLE_ENGINE_VERSION).toBe(16))

  it('draws three tabs, her Lance on B filled, depth 4 faded with its gate, and Sunder\'s pips at Rank 2', async () => {
    show(await brawler())
    const tabs = within(screen.getByRole('tablist', { name: 'Trees' })).getAllByRole('tab')
    expect(tabs.map((t) => t.getAttribute('aria-label'))).toEqual(['Greatsword, branch A', 'Axe, branch A', 'Lance, branch B'])
    expect(screen.getAllByRole('button', { name: /^Weapon \d/ })).toHaveLength(3)

    // The Greatsword tree: the trunk and A held to depth 3; Sunder at Rank 2 of 5, its next rank at Class Rank 24.
    expect(rpgNode('brawler-greatsword.3')!.name).toBe('Sunder')
    expect(node('brawler-greatsword.3').dataset.held).toBe('true')
    expect(within(node('brawler-greatsword.3')).getByRole('img', { name: 'Rank 2 of 5' })).toBeDefined()
    expect(node('brawler-greatsword.3').textContent).toContain('Rank 2 · next at Class Rank 24')
    expect(node('brawler-greatsword.1').textContent).toContain('Rank 5')
    expect(node('brawler-greatsword.3b').dataset.held).toBeUndefined()

    fireEvent.click(tabs[2]!)
    // Her Lance on B: B's depth-3 node is hers (the B column filled), A's dimmed; depth 4 is closed on both lines.
    expect(within(branch(/^Branch B · Impale, hers$/)).getByRole('button', { name: 'B · Impale' }).className).toContain('bg-accent')
    expect(node('brawler-lance.3a').dataset.held).toBe('true')
    expect(node('brawler-lance.3').dataset.held).toBeUndefined()
    expect(node('brawler-lance.3').className).toContain('opacity-55')
    for (const id of ['brawler-lance.4a', 'brawler-lance.4']) {
      expect(node(id).className).toContain('opacity-45')
      expect(node(id).textContent).toContain('Class Rank 30')
    }
    // No points anywhere, and no Learn.
    expect(screen.queryByText(/point/)).toBeNull()
    expect(screen.queryByRole('button', { name: /^Learn/ })).toBeNull()
  })

  it('takes branch A from its sheet, calling the save\'s pickBranch with A, and her tree follows', async () => {
    show(await brawler())
    fireEvent.click(within(screen.getByRole('tablist', { name: 'Trees' })).getAllByRole('tab')[2]!)
    fireEvent.click(within(branch(/^Branch A$/)).getByRole('button', { name: 'A' }))
    const take = await screen.findByRole('button', { name: 'Take branch A' })
    await act(async () => { fireEvent.click(take) })
    await waitFor(() => expect(vi.mocked(battle.pickBranch)).toHaveBeenCalledWith(expect.anything(), outfit, 'brawler', 'lance', 'A', expect.any(String), '1'))
    await waitFor(() => expect(node('brawler-lance.3').dataset.held).toBe('true'))
    expect(worldOf(useGame.getState().save!).umas[outfit.outfitId]!.classes.brawler!.lines).toEqual({})
    // The held branch's sheet has no button.
    fireEvent.click(within(branch(/^Branch A, hers$/)).getByRole('button', { name: 'A' }))
    expect(await screen.findByText('Her branch')).toBeDefined()
    expect(screen.queryByRole('button', { name: /^Take branch/ })).toBeNull()
  })
})
