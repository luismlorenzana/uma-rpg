import { buildMemoryRelease, syntheticMasterData } from '@luismlorenzana/uma-data/testing'
import { buildChapters, buildRoster, capitalId, capitalStageIds, FRANCHISES, newSave, placeById, worldOf } from '@rpg/domain'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { buildCampaign } from '../../battle/campaign'
import type { Cast, CastMember } from '../../content/cast'
import { CapitalMap } from './CapitalMap'

let world = worldOf(newSave('Test', '2026-10-12T12:00:00.000Z'))
vi.mock('../../save/game', () => ({ useWorld: () => world, beginFight: vi.fn(), sweep: vi.fn() }))
// This test isolates the capital's choices and shared sheet; ActivePartyBar has its own game/store concerns.
vi.mock('./ActiveParty', () => ({ ActivePartyBar: () => null }))
vi.mock('../../content/cast', () => ({ castArtUrl: vi.fn(async () => 'blob:synthetic') }))

async function campaignFixture() {
  const data = syntheticMasterData(), release = await buildMemoryRelease(data)
  const members: CastMember[] = Array.from({ length: 12 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}`, nameJa: '', color: '#888888',
    art: { path: `cast/rival${i}.00000000.png`, width: 32, height: 32 } }))
  const cast: Cast = { members, byId: new Map(members.map((m) => [m.id, m])),
    packs: { priconne: members, azurlane: [], lastorigin: [], nikke: [], destinychild: [], girlsfrontline: [] } }
  expect(Object.keys(cast.packs).sort()).toEqual([...FRANCHISES].sort())
  return buildCampaign({ manifest: release.manifest, roster: buildRoster(data), chapters: buildChapters(data.scenarios), art: null }, cast)
}

describe('capital routes and shared stage sheets', () => {
  it('resolves capital stages after a reload without confusing them with ordinary region ids', async () => {
    const campaign = await campaignFixture(), continent = campaign.continents[0]!
    const chapter = campaign.region(capitalId(continent.id))!
    for (let route = 1; route <= 3; route++) for (const id of Object.values(capitalStageIds(continent.id, route))) {
      expect(campaign.stageRegion(id)).toBe(chapter)
    }
    expect(campaign.stageRegion('w1-1-1-s12')?.id).toBe('w1-1-1')
    expect(campaign.stageRegion('w9-capital-r1-s1')).toBeNull()
    expect(campaign.color(chapter.id)).toBe(campaign.view.chapters[0]!.color)
  })

  it('shows three named routes, opens the usual rival sheet, then reflects a vanguard clear only on its own champion', async () => {
    const campaign = await campaignFixture(), continent = campaign.continents[0]!
    const host = document.createElement('div'), root = createRoot(host)
    document.body.append(host)
    const render = () => root.render(<MemoryRouter><CapitalMap campaign={campaign} continent={continent} place={placeById('scenario-gate')!} /></MemoryRouter>)
    world = worldOf(newSave('Test', '2026-10-12T12:00:00.000Z'))
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    try {
      await act(async () => { render() })
      expect(host.querySelector('h2')?.textContent).toBe(continent.name)
      continent.name = 'Renamed synthetic continent'
      await act(async () => { render() })
      expect(host.querySelector('h2')?.textContent).toBe('Renamed synthetic continent')
      expect([...host.querySelectorAll('h3')].map((h) => h.textContent)).toEqual(['Sprint Final', 'Mile Final', 'Long-Distance Final'])
      const stages = () => [...host.querySelectorAll<HTMLButtonElement>('button[aria-label^="Stage "]')]
      expect(stages()).toHaveLength(6)
      expect(stages().filter((b) => b.getAttribute('aria-label')!.endsWith('available'))).toHaveLength(3)
      expect(stages().filter((b) => b.getAttribute('aria-label')!.endsWith('locked'))).toHaveLength(3)
      await act(async () => { stages()[1]!.click() })
      expect(document.querySelector('[role="dialog"]')?.textContent).toContain('Sprint Final · Champion')
      const locked = [...document.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent === 'Locked')!
      expect(locked.disabled).toBe(true)
      // Close with the sheet's actual accessible dismiss control, not an app/store shortcut.
      await act(async () => { document.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!.click() })
      world = { ...world, world: { ...world.world, run: { ...world.world.run, wins: { start: 1, [capitalStageIds(continent.id, 1).vanguard]: 1 } } } }
      await act(async () => { render() })
      expect(stages()[0]!.getAttribute('aria-label')).toMatch(/cleared$/)
      expect(stages()[1]!.getAttribute('aria-label')).toMatch(/available$/)
      expect(stages()[3]!.getAttribute('aria-label')).toMatch(/locked$/)
      expect(host.textContent).toContain('1/2')
    } finally {
      await act(async () => { root.unmount() })
      host.remove()
      vi.unstubAllGlobals()
    }
  })
})
