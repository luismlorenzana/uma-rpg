import { syntheticMasterData, buildMemoryRelease } from '@luismlorenzana/uma-data/testing'
import { MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { buildChapters, buildRoster, newSave, placeById, PARTY_COUNT } from '@rpg/domain'
import { cleanup, render as mount } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { expect, it, vi } from 'vitest'
import { domMax } from 'motion/react'
import { buildCampaign } from '../../../battle/campaign'
import { useGame, resetGame } from '../../../save/game'
import { ContinentMap } from '../ScenarioGatePage'
vi.mock('../ActiveParty', () => ({ ActivePartyBar: () => null }))
vi.mock('./MapCanvas', () => ({ MapCanvas: () => <div data-pixel-map />, BiomeIcon: () => null }))

it('keeps the live v37 pixel map, 40-region List, five band Springs and 20 parties (H165 dark)', async () => {
  const data = syntheticMasterData(), release = await buildMemoryRelease(data)
  const campaign = buildCampaign({ manifest: release.manifest, roster: buildRoster(data), album: new Map(), art: null, chapters: buildChapters(data.scenarios) }, { members: [], byId: new Map() })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  useGame.setState({ save: newSave('Dark screen', '2026-11-05T12:00:00.000Z'), status: 'ready', activeTier: 1 })
  setReducedMotion(true)
  const render = () => { cleanup(); return mount(<MotionRoot features={domMax}><MemoryRouter><ContinentMap campaign={campaign} continent={campaign.continents[0]!} place={placeById('scenario-gate')!} /></MemoryRouter></MotionRoot>).container.innerHTML }
  const values = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) })
  try {
    expect(render()).toContain('data-pixel-map')
    expect(render()).not.toContain('data-honeycomb')
    values.set('rpg-world-map-view', 'list')
    const list = render()
    expect((list.match(/border-color:/g) ?? []).length).toBe(40)
    expect((list.match(/◆ Spring/g) ?? []).length).toBe(5)
    expect(PARTY_COUNT).toBe(20)
  } finally { cleanup(); resetGame(); vi.unstubAllGlobals() }
})
