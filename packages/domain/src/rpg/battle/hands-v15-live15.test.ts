// Classes v2's names with the one switch at 15 (H55, D183): "Paladin" is a class from v15, so the Greatsword summon line's
// depth-3 knight becomes the Knight Captain; its id stays. `caps.ts` is mocked in this file of its own, as in
// `v14-replays-live15.test.ts`; H61's switch makes this the live case.
import { describe, expect, it, vi } from 'vitest'
import { rpgNode } from '../catalog'
import { rpgV2 } from './engine'

vi.mock('./caps', async (importOriginal) => {
  const caps = await importOriginal<typeof import('./caps')>()
  return { ...caps, BATTLE_ENGINE_VERSION: 15, rpgV2: (engine: number = 15) => engine >= caps.RPG_V2_ENGINE }
})

describe('the Summoner’s Knight Captain with the switch at 15 (H55)', () => {
  it('renames the depth-3 Greatsword summon and its two sides, nothing else', () => {
    expect(rpgV2()).toBe(true)
    expect(['summoner-greatsword.3', 'summoner-greatsword.3a', 'summoner-greatsword.3b'].map((id) => rpgNode(id)!.name))
      .toEqual(['Knight Captain', 'Knight Captain Pack', 'Bonded Knight Captain'])
    expect(rpgNode('summoner-greatsword.4')!.name).toBe('Aegis Champion')
  })
})
