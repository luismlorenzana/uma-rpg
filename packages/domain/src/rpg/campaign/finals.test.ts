import { describe, expect, it } from 'vitest'
import { RPG_ELEMENTS } from '../rules'
import { RPG_FINALS, RPG_FINALS_LANES, rpgFinals } from './finals'

describe('the Finals routes (D293, H159)', () => {
  it('gives every scenario four routes with four different champion elements', () => {
    expect(RPG_FINALS_LANES).toBe(4)
    for (const finals of RPG_FINALS) {
      expect(finals.routes).toHaveLength(RPG_FINALS_LANES)
      expect(new Set(finals.routes.map((r) => r.champion.element)).size).toBe(4)
      expect(new Set(finals.routes.map((r) => r.name)).size).toBe(4)
      for (const r of finals.routes) expect(r.line.length).toBeGreaterThan(0)
    }
  })

  it('spreads the 56 champions evenly: each element 10 to 12 times', () => {
    const count = new Map(RPG_ELEMENTS.map((e) => [e, 0]))
    for (const finals of RPG_FINALS) for (const r of finals.routes) count.set(r.champion.element, count.get(r.champion.element)! + 1)
    expect(Object.fromEntries(count)).toEqual({ fire: 11, ice: 11, lightning: 12, light: 11, dark: 11 })
    for (const n of count.values()) expect(n >= 10 && n <= 12).toBe(true)
  })

  it('holds at most two escorts of one role in each fourth route', () => {
    for (const finals of RPG_FINALS) {
      const fourth = finals.routes[3]
      const roles = [...fourth.vanguard.escorts, ...fourth.champion.escorts].map(([role]) => role)
      for (const role of new Set(roles)) expect(roles.filter((r) => r === role).length, fourth.name).toBeLessThanOrEqual(2)
    }
  })

  it('writes Ura Finale’s fourth as the design gives it', () => {
    expect(rpgFinals(1).routes[3]).toEqual({
      name: 'Medium Final', line: 'A duel at middle distance: the dark horse kicks late.',
      vanguard: { element: 'lightning', escorts: [['skirmisher', 'lightning'], ['caster', 'dark']] },
      champion: { element: 'dark', escorts: [['skirmisher', 'dark'], ['striker', 'lightning']] },
    })
  })

})
