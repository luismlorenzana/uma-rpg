// The run rules call the achievement hook (H49's `achievementsEarned`) with the win already recorded, and store whatever
// it grants. The hook is mocked here, in a file of its own, so its real rules don't decide what this checks.
import { describe, expect, it, vi } from 'vitest'
import { achievementsEarned, type RiftWin } from '../rift/achievements'
import { beginConvergence, signUpRift, startRiftFight } from './rift'
import { OUTFITS, play, riftWorldSave, ROSTER, T, TWENTY, weaken } from './rift-rules.fixture'
import { worldOf } from './rules'
import type { Save } from './save'

vi.mock('../rift/achievements', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../rift/achievements')>()),
  achievementsEarned: vi.fn(() => [{ id: 'crossover', run: 't1-r1' }, { id: 'bestiary', run: null }]),
}))
const hook = vi.mocked(achievementsEarned)
const lastWin = (): RiftWin => hook.mock.calls.at(-1)![0]

describe('the achievement hook (H49’s contract, D171)', () => {
  it('sees a front win already recorded and has its grants stored with the time and run', () => {
    hook.mockClear()
    const started = startRiftFight(signUpRift(riftWorldSave(), TWENTY, T(1)), { kind: 'front', front: 'iron', stage: 1 }, 0, OUTFITS, ROSTER, T(2))
    const held = { ...started.account.achievements }
    const won = play(weaken(started))
    expect(hook).toHaveBeenCalledTimes(1)
    const win = lastWin()
    expect(win).toMatchObject({ tier: 1, ref: { kind: 'front', front: 'iron', stage: 1 }, attemptRounds: null, roster: ROSTER })
    expect(win.run).toEqual(worldOf(won.save).rift.runs[0])
    expect(win.run!.fronts.iron).toBe(1)
    expect(win.defeated).toEqual(won.save.account.defeated)
    expect(Object.keys(win.defeated)).toHaveLength(1)
    expect(win.state.outcome).toBe('victory')
    expect(hook.mock.calls[0]![1]).toEqual(held)
    const at = won.save.account.updatedAt
    expect(won.save.account.achievements).toEqual({ crossover: { at, run: 't1-r1' }, bestiary: { at, run: null } })
    expect(won.result.earned).toEqual([{ id: 'crossover', run: 't1-r1' }, { id: 'bestiary', run: null }])
  })

  it('sees the Convergence’s last win with all four rounds and the run won', () => {
    hook.mockClear()
    let save: Save = signUpRift(riftWorldSave(), TWENTY, T(1))
    const world = save.tierWorlds['1']!
    world.rift.runs[0]!.fronts = { iron: 12, arcane: 12, duel: 12, horde: 12 }
    save = beginConvergence(save, [0, 1, 2, 3], T(2))
    const rounds: number[] = []
    for (let fight = 0; fight < 4; fight += 1) {
      const won = play(weaken(startRiftFight(save, { kind: 'convergence', fight }, null, OUTFITS, ROSTER, T(10 + 100 * fight))), 50 + 100 * fight)
      save = won.save
      rounds.push(won.result.rounds)
      expect(lastWin().attemptRounds).toEqual(rounds)
    }
    expect(lastWin().attemptRounds).toHaveLength(4)
    expect(lastWin().run!.wonAt).toBe(save.account.updatedAt)
    expect(lastWin().run!.convergence.open).toBeNull()
    // An Echo win passes no run.
    const echo = play(weaken(startRiftFight(save, { kind: 'echo', front: 'duel', level: '45' }, 4, OUTFITS, ROSTER, T(900))), 1000)
    expect(echo.result.outcome).toBe('victory')
    expect(lastWin()).toMatchObject({ run: null, attemptRounds: null, ref: { kind: 'echo', front: 'duel', level: '45' } })
  })
})
