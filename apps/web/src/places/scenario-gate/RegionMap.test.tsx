import { buildMemoryRelease, syntheticMasterData } from '@luismlorenzana/uma-data/testing'
import { buildChapters, buildRoster, newSave, placeById, setPartySlot, startFight, unlockUma, useSpring, worldOf } from '@rpg/domain'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { buildCampaign } from '../../battle/campaign'
import type { Cast, CastMember } from '../../content/cast'
import type { MapLayout, MapSpot } from './map/layout'
import type { SpotContent } from './map/MapCanvas'
import { RegionMap } from './RegionMap'

const NOW = '2026-10-13T12:00:00.000Z'
let save = newSave('Test', NOW)
const drink = vi.fn(async (id: string) => { save = useSpring(save, id, new Date().toISOString()) })
vi.mock('../../save/game', () => ({ useWorld: () => worldOf(save), drinkAtSpring: (id: string) => drink(id), beginFight: vi.fn(), sweep: vi.fn() }))
vi.mock('./ActiveParty', () => ({ ActivePartyBar: () => null }))
vi.mock('../../content/cast', () => ({ castArtUrl: vi.fn(async () => 'blob:synthetic') }))
// Composition and real canvas have dedicated tests; exercise both semantic controls and stage sheets here.
vi.mock('./map/MapCanvas', () => ({
  BiomeIcon: () => null,
  MapCanvas: ({ layout, describe, onSpot }: { layout: MapLayout; describe: (s: MapSpot) => SpotContent; onSpot: (s: MapSpot) => void }) =>
    <div>{layout.spots.map((s) => { const d = describe(s); return <button key={s.id} disabled={d.disabled} aria-label={d.label} onClick={() => onSpot(s)}>{d.content}</button> })}</div>,
}))

async function fixture() {
  const data = syntheticMasterData(), outfit = data.outfits[0]!
  data.outfits = Array.from({ length: 5 }, (_, i) => ({ ...outfit, id: 9000000 + i, costumeId: 9000000 + i, talentGroupId: 9000000 + i }))
  const release = await buildMemoryRelease(data)
  const members: CastMember[] = Array.from({ length: 12 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}`, nameJa: '', color: '#888888',
    art: { path: `cast/rival${i}.00000000.png`, width: 32, height: 32 } }))
  const cast: Cast = { members, byId: new Map(members.map((m) => [m.id, m])),
    packs: { priconne: members, azurlane: [], lastorigin: [], nikke: [], destinychild: [], girlsfrontline: [] } }
  const campaign = buildCampaign({ manifest: release.manifest, roster: buildRoster(data), chapters: buildChapters(data.scenarios), art: null }, cast)
  const id = String(data.outfits[0]!.id)
  save = newSave('Test', NOW)
  data.outfits.forEach((o, i) => { save = setPartySlot(unlockUma(save, String(o.id), NOW), 0, i, String(o.id), NOW) })
  worldOf(save).world.run.mp[id] = 5
  return { campaign, id, region: campaign.region('w1-1-1')! }
}

describe('region stage destinations and shared Spring', () => {
  it('refills MP from either control, shares the continent cooldown, recharges live, and keeps cleared/locked sheets', async () => {
    vi.useFakeTimers(); vi.setSystemTime(NOW); vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: vi.fn() })
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible')
    drink.mockClear()
    const { campaign, id, region } = await fixture()
    const host = document.createElement('div'), root = createRoot(host); document.body.append(host)
    const render = () => root.render(<MemoryRouter><RegionMap campaign={campaign} region={region} place={placeById('scenario-gate')!} /></MemoryRouter>)
    const springs = () => [...host.querySelectorAll<HTMLButtonElement>('button[aria-label^="Spring,"]')]
    const stage = (n: number) => host.querySelector<HTMLButtonElement>(`button[aria-label^="Stage ${n},"]`)!
    try {
      await act(async () => { render() })
      expect(springs()).toHaveLength(2)
      expect(springs().every((b) => !b.disabled)).toBe(true)
      await act(async () => { springs()[1]!.click(); await Promise.resolve(); render() })
      expect(drink).toHaveBeenLastCalledWith('w1-spring1')
      expect(worldOf(save).world.run.mp[id]).toBeUndefined()
      expect(Object.keys(worldOf(save).world.springs)).toEqual(['w1-spring1'])
      expect(springs().every((b) => b.disabled && b.getAttribute('aria-label')!.includes('2h 00m'))).toBe(true)
      expect(host.textContent).toContain('Spring · 2h 00m')
      await act(async () => { vi.advanceTimersByTime(2 * 60 * 60 * 1000) })
      expect(springs().every((b) => !b.disabled)).toBe(true)
      await act(async () => { springs()[0]!.click(); await Promise.resolve(); render() })
      expect(drink).toHaveBeenCalledTimes(2)
      // The same marker is dry when this Spring was consumed on the continent screen too.
      expect(worldOf(save).world.springs['w1-spring1']).toBe('2026-10-13T14:00:00.000Z')
      worldOf(save).world.run.wins[region.id + '-s1'] = 1
      await act(async () => { render(); stage(1).click() })
      expect([...document.querySelectorAll<HTMLButtonElement>('button')].some((b) => b.textContent === 'Fight again' && !b.disabled)).toBe(true)
      await act(async () => { document.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!.click(); stage(3).click() })
      expect([...document.querySelectorAll<HTMLButtonElement>('button')].some((b) => b.textContent === 'Locked' && b.disabled)).toBe(true)
      await act(async () => {
        document.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!.click()
        vi.advanceTimersByTime(2 * 60 * 60 * 1000)
      })
      save = startFight(save, region, region.id + '-s2', campaign.outfits, new Date().toISOString())
      await act(async () => { render() })
      expect(springs().every((b) => b.disabled && b.getAttribute('aria-label') === 'Spring, refill party MP')).toBe(true)
      await act(async () => { springs()[0]!.click(); springs()[1]!.click() })
      expect(drink).toHaveBeenCalledTimes(2)
      expect(host.textContent).toContain('Resume the open fight')
    } finally {
      await act(async () => { root.unmount() }); host.remove()
      vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals()
    }
  })
})
