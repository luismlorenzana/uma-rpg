// The Rift's generator is a lazy subpath (H47, D173): the web resolves `@rpg/domain/rift` for the Rift page's import, and
// nothing in the main bundle imports it.
import type { RiftContext, RiftFightPlan } from '@rpg/domain/rift'
import { describe, expect, expectTypeOf, it } from 'vitest'

describe('@rpg/domain/rift', () => {
  it('resolves its types and loads on demand', async () => {
    expectTypeOf<RiftFightPlan['level']>().toEqualTypeOf<number>()
    expectTypeOf<RiftContext['runId']>().toEqualTypeOf<string | null>()
    const rift = await import('@rpg/domain/rift')
    const t = rift.RIFT_TUNING
    expect(rift.riftStrength({ kind: 'convergence', fight: 0 })).toBe(Math.round((1 + t.climb) * (1 + t.convergence) * 1e4) / 1e4)
  })
})
