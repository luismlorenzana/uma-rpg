// Tier 1's foes, pinned (H45): every region and capital stage of `w1`–`w5`, hashed. Tier 2's foe curve restarts at its
// Lv 1 (tier2-world Z3), and in Tier 1 the tier level is the lifetime level, so none of this may move by one HP point.
// A deliberate Tier 1 rebalance changes the digest on purpose: update it in the same change and say so in its D-row.
// H72 (D210) moved it on purpose: engine v16 went live, so every foe is weak to her twins and the sub-boss and boss carry
// R1's shields, 6 and 8 (class-progression.md §4, §14; D202, D207). H116 leaves that engine-v17 generation frozen while
// v18 deals weaknesses v2. v15's digest, 719d3a73, stays pinned with the engine named in `twins-v16.test.ts`.
import { describe, expect, it } from 'vitest'
import { capitalChapter } from './capital'
import { regionChapter, worldContinent } from './world'

const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))

/** FNV-1a, as `world.ts` hashes. */
function fnv1a(text: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return (h >>> 0).toString(16).padStart(8, '0')
}

describe('Tier 1 foes (H45)', () => {
  it('keep engine v17 exactly: every region and capital stage of w1–w5 before weaknesses v2', () => {
    const parts: string[] = []
    for (let order = 1; order <= 5; order++) {
      const continent = worldContinent({ name: 'T', order })
      for (const region of continent.regions) parts.push(JSON.stringify(regionChapter(region, cast, 17).nodes))
      parts.push(JSON.stringify(capitalChapter(continent, cast, 17).nodes))
    }
    expect(parts).toHaveLength(5 * 41)
    expect(fnv1a(parts.join('\n'))).toBe('e94279ca')
  })
})
