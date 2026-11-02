import { MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { emptyWindow, newOwnedUma, newSave, placeById, WINDOW_STEP_IDS, withSteps, type RiftRun, type Save } from '@rpg/domain'
import { cleanup, render, screen } from '@testing-library/react'
import { domMax } from 'motion/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Campaign } from '../../battle/campaign'
import { resetGame, useGame } from '../../save/game'
import { convergenceLine, riftStatus, RiftOverview } from './RiftPage'

const NOW = '2026-10-22T12:00:00.000Z'
const campaign = { view: { art: null, roster: [] }, outfits: new Map(), cast: { members: [], byId: new Map() }, name: (id: string) => id } as unknown as Campaign
const ids = (from: number, n: number) => Array.from({ length: n }, (_, i) => `${from + i}`)

/** Tier 1 with `n` Lv 50 Umas (and one Lv 30), and a run when given. */
function save(n: number, run?: Partial<RiftRun>): Save {
  const s = newSave('Rift page', NOW)
  const world = s.tierWorlds['1']!
  for (const id of ids(101, n)) world.umas[id] = { ...newOwnedUma(NOW), level: 50 }
  world.umas['99'] = { ...newOwnedUma(NOW), level: 30 }
  if (run) world.rift.runs.push({ id: 't1-r1', roster: ids(101, 20), startedAt: NOW, fronts: { iron: 0, arcane: 0, duel: 0, horde: 0 },
    convergence: { attempts: 0, open: null }, traces: {}, wonAt: null, ascendedAt: null, ...run })
  return s
}

function show(s: Save) {
  useGame.setState({ uid: 'u1', status: 'ready', save: s, activeTier: 1 })
  render(
    <MotionRoot features={domMax}>
      <MemoryRouter initialEntries={['/battle/tier-finale']}>
        <RiftOverview campaign={campaign} place={placeById('tier-finale')!} />
      </MemoryRouter>
    </MotionRoot>,
  )
}
const signUp = () => screen.queryByRole('button', { name: /^Sign up twenty/ }) as HTMLButtonElement | null
const fronts = () => [...document.querySelectorAll('[data-rift-fronts] button')].map((b) => b.getAttribute('aria-label'))

beforeEach(() => {
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  setReducedMotion(true)
})
afterEach(() => {
  cleanup()
  resetGame()
  vi.unstubAllGlobals()
})

describe('the Rift (H50)', () => {
  it('holds sign-up shut under twenty Lv 50 Umas; its Echoes are at Trials now (H153)', () => {
    show(save(12))
    expect(document.querySelector('[data-rift-status]')!.textContent).toBe('Tier 1 · 12 Lv 50 Umas')
    expect(signUp()!.disabled).toBe(true)
    expect(signUp()!.textContent).toContain('12 of 20 at Lv 50')
    expect(fronts()).toEqual([])
    expect(document.querySelector('[data-rift-echoes]')).toBeNull()
    expect(screen.queryByRole('button', { name: /^Ascend/ })).toBeNull()
  })

  it('opens sign-up at twenty', () => {
    show(save(20))
    expect(signUp()!.disabled).toBe(false)
    expect(signUp()!.textContent).toBe('Sign up twenty')
  })

  it('shows a run’s four fronts with their counts, and the Convergence waiting on them', () => {
    show(save(20, { fronts: { iron: 5, arcane: 12, duel: 0, horde: 3 } }))
    expect(document.querySelector('[data-rift-status]')!.textContent).toBe('Tier 1 · Run 1 · 1 of 4 fronts sealed')
    expect(signUp()).toBeNull()
    expect(fronts()).toEqual(['Iron front, 5/12', 'Arcane front, Sealed', 'Duel front, 0/12', 'Horde front, 3/12', 'Convergence, Seal all four fronts'])
    expect(document.querySelector('[data-rift-fronts]')!.textContent).toContain('2 Brawler · Arms Spellblade · Arms Summoner · Paladin')
    expect(screen.getByRole('button', { name: 'Roster' })).not.toBeNull()
  })

  it('points a won run to the Gallery with how many are ready, and opens sign-up again (H155, D283)', () => {
    const won = save(20, { fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 }, wonAt: NOW, convergence: { attempts: 2, open: null } })
    won.account.windows = { '101': { '1': withSteps(emptyWindow(), WINDOW_STEP_IDS, NOW) } }
    show(won)
    expect(document.querySelector('[data-rift-status]')!.textContent).toBe('Tier 1 · 20 Lv 50 Umas')
    expect(screen.queryByRole('button', { name: /Ascend/ })).toBeNull()
    expect(document.querySelector('[data-rift-won]')!.textContent).toBe('GalleryRift won · 1 ready')
    expect(signUp()).not.toBeNull()
  })

  it('reads the status and the Convergence card', () => {
    const run = save(20, { fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 } }).tierWorlds['1']!.rift.runs[0]!
    expect(riftStatus(null, 1)).toBe('1 Lv 50 Uma')
    expect(convergenceLine(run)).toBe('Assign four parties')
    expect(convergenceLine({ ...run, convergence: { attempts: 3, open: null } })).toBe('Assign four parties · 3 attempts')
    expect(convergenceLine({ ...run, convergence: { attempts: 1, open: { parties: [], rounds: [5] } } })).toBe('Fight 2 of 4 · Arcane')
    expect(convergenceLine({ ...run, wonAt: NOW })).toBe('Won')
  })
})
