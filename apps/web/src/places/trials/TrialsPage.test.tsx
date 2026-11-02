// Trials (D283, H153): the Echoes in their own place, named Trials on screen.
import { MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { newOwnedUma, newSave, placeById, type Save } from '@rpg/domain'
import { cleanup, render } from '@testing-library/react'
import { domMax } from 'motion/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Campaign } from '../../battle/campaign'
import { resetGame, useGame } from '../../save/game'
import { riftResultView, riftRefTitle } from '../rift/rift-view'
import { TrialGrid } from './TrialsPage'

const NOW = '2026-11-02T12:00:00.000Z'
const campaign = { view: { art: null, roster: [] }, outfits: new Map(), cast: { members: [], byId: new Map() }, name: (id: string) => id } as unknown as Campaign

function save(): Save {
  const s = newSave('Trials', NOW)
  const world = s.tierWorlds['1']!
  for (let i = 0; i < 5; i++) world.umas[`${101 + i}`] = { ...newOwnedUma(NOW), level: 50 }
  world.rift.echoes = { iron: { '50': NOW } }
  return s
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  setReducedMotion(true)
})
afterEach(() => {
  cleanup()
  resetGame()
  vi.unstubAllGlobals()
})

describe('Trials (H153)', () => {
  it('lists four fronts at Lv 45, 50 and 55, a won one ticked', () => {
    useGame.setState({ uid: 'u1', status: 'ready', save: save(), activeTier: 1 })
    render(<MotionRoot features={domMax}><MemoryRouter initialEntries={['/battle/trials']}><TrialGrid campaign={campaign} place={placeById('trials')!} /></MemoryRouter></MotionRoot>)
    const cells = [...document.querySelectorAll('[data-trials] button')].map((b) => b.getAttribute('aria-label'))
    expect(cells).toHaveLength(12)
    expect(cells.slice(0, 3)).toEqual(['Iron Trial, Lv 45', 'Iron Trial, Lv 50, won', 'Iron Trial, Lv 55'])
    expect(document.querySelector('[data-trials-line]')!.textContent).toBe('Class EXP ×2 · Lv 50 parties')
  })

  it('names a Trial\'s fight and sends its result back to Trials', () => {
    const ref = { kind: 'echo', front: 'iron', level: '55' } as const
    expect(riftRefTitle(ref)).toBe('Trial · Iron')
    expect(riftResultView({ outcome: 'victory', ref, rounds: 4, members: [], gearMarks: 0, classMarks: 0, cleared: null, attempt: null, runWon: false, earned: [] }).back)
      .toBe('Back to Trials')
  })
})
