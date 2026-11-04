// The Class tab's trees (D224, H120): class plus three icon tree tabs in one row; connected icon nodes whose tap sheet owns
// their words and Equip action; her line filled and the other dimmed; gates/ranks on the nodes; line swaps unchanged.
// Invented outfits; the store is the real one, holding a test save.
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
import { ClassTab } from './ClassTab'

vi.mock('@rpg/domain/battle', async (orig) => {
  const actual = await orig<typeof import('@rpg/domain/battle')>()
  return { ...actual, pickBranch: vi.fn(actual.pickBranch) }
})

const NOW = '2026-10-25T12:00:00.000Z'
let outfit: Awaited<ReturnType<typeof albumFixture>>['view']['roster'][number]

/** A Lv 30 Brawler at Class Rank 22 (held in Tier 1's world from Rank 10) on Greatsword, Axe and Lance, her Lance on
 * branch B, skills chosen for her. */
/** A Lv 30 Uma of a class, on these weapons. */
async function uma(classId: 'cleric' | 'tomeblade', weapons: ['tome-light' | 'tome-fire', 'tome-ice' | 'tome-fire', 'lance' | 'katana']): Promise<Save> {
  const { view } = await albumFixture()
  outfit = view.roster[0]!
  const save = newSave('Trees', NOW)
  const base = newOwnedUma(NOW, 'brawler')
  worldOf(save).umas[outfit.outfitId] = {
    ...base, level: 30, classId,
    ranks: withTrack(base.ranks, { kind: 'class', id: classId }, { rank: 22, exp: 0 }),
    classes: { [classId]: { weapons, lines: {}, loadout: null } },
  }
  return save
}

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
function Live() {
  const world = worldOf(useGame((s) => s.save)!)
  return <ClassTab outfit={outfit} uma={world.umas[outfit.outfitId]!} world={world} />
}
function show(save: Save) {
  useGame.setState({ status: 'ready', save, activeTier: 1 })
  render(<MemoryRouter><MotionRoot features={domMax}><AlbumArtProvider art={{ useUrl: () => null }}>
    <Live />
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

describe('the Class tab as a tree (H70, H120)', () => {
  it('runs on engine 19: weaknesses v2 (H116) and Classes v3 (H134) live', () => expect(BATTLE_ENGINE_VERSION).toBe(21))

  it('says what a tree carries and where, so a buff or a debuff is never a guess (D282)', async () => {
    show(await uma('cleric', ['tome-light', 'tome-fire', 'lance']))
    const line = () => document.querySelector('[data-tree-status]')?.textContent
    await waitFor(() => expect(line()).toBe('Brave, Faith · line A, depth 3+'))
    fireEvent.click(screen.getByRole('tab', { name: /Fire Tome/ }))
    expect(line()).toBe('Brave, Faith · every skill')
    fireEvent.click(screen.getByRole('tab', { name: /Lance/ }))
    expect(line()).toBe('Mind Break · every skill')
  })

  it('prints no status on a Brawler\'s tree: she is pure damage (D282)', async () => {
    show(await brawler())
    await screen.findAllByRole('tab')
    expect(document.querySelector('[data-tree-status]')).toBeNull()
  })

  it('draws class plus three tree icons, her Lance on B filled, gates on closed nodes, and Grand Cleave\'s detail on tap', async () => {
    show(await brawler())
    const tabs = within(screen.getByRole('tablist', { name: 'Trees' })).getAllByRole('tab')
    expect(tabs.map((t) => t.getAttribute('aria-label'))).toEqual(['Greatsword, line A', 'Axe, line A', 'Lance, line B'])
    expect(screen.getByRole('button', { name: 'Class: Brawler, R22' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Change Greatsword' })).toBeDefined()

    // The Greatsword tree: the trunk and A held to depth 3; the node is compact and its tap sheet owns the words.
    expect(rpgNode('brawler-greatsword.3')!.name).toBe('Grand Cleave')
    expect(node('brawler-greatsword.3').dataset.held).toBe('true')
    expect(node('brawler-greatsword.3').getAttribute('aria-label')).toBe('Grand Cleave, Rank 2 · next R24, equipped')
    expect(node('brawler-greatsword.1').getAttribute('aria-label')).toBe('Cleave, Rank 5')
    expect(node('brawler-greatsword.3b').dataset.held).toBeUndefined()
    fireEvent.click(node('brawler-greatsword.3'))
    expect(await screen.findByRole('img', { name: 'Rank 2 of 5' })).toBeDefined()
    expect(screen.getByText('Rank 2 · next R24')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Unequip' })).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    fireEvent.click(tabs[2]!)
    // Her Lance on B: B's depth-3 node is hers (the B column filled), A's dimmed; depth 4 is closed on both lines.
    expect(within(branch(/^Line B · Impale, held$/)).getByRole('button', { name: 'Line B · Impale, held' }).className).toContain('bg-accent')
    expect(node('brawler-lance.3a').dataset.held).toBe('true')
    expect(node('brawler-lance.3').dataset.held).toBeUndefined()
    expect(node('brawler-lance.3').className).toContain('opacity-55')
    for (const id of ['brawler-lance.4a', 'brawler-lance.4']) {
      expect(node(id).className).toContain('opacity-40')
      expect(node(id).getAttribute('aria-label')).toMatch(/closed until Class Rank 30/)
    }
    // No points anywhere, and no Learn.
    expect(screen.queryByText(/point/)).toBeNull()
    expect(screen.queryByRole('button', { name: /^Learn/ })).toBeNull()
  })

  it('takes line A from its sheet, calling the save\'s pickBranch with A; her tree follows and the sheet stays open on Held', async () => {
    show(await brawler())
    fireEvent.click(within(screen.getByRole('tablist', { name: 'Trees' })).getAllByRole('tab')[2]!)
    fireEvent.click(within(branch(/^Line A$/)).getByRole('button', { name: 'Line A' }))
    const take = await screen.findByRole('button', { name: 'Take line A' })
    await act(async () => { fireEvent.click(take) })
    await waitFor(() => expect(vi.mocked(battle.pickBranch)).toHaveBeenCalledWith(expect.anything(), outfit, 'brawler', 'lance', 'A', expect.any(String), '1'))
    await waitFor(() => expect(node('brawler-lance.3').dataset.held).toBe('true'))
    expect(worldOf(useGame.getState().save!).umas[outfit.outfitId]!.classes.brawler!.lines).toEqual({})
    // The held line's sheet reads Held, disabled.
    expect(await screen.findByRole('button', { name: 'Held' })).toHaveProperty('disabled', true)
    expect(screen.queryByRole('button', { name: /^Take line/ })).toBeNull()
  })
})
