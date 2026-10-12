import { describe, expect, it, vi } from 'vitest'
import { pixelImage } from './pixel-image'
describe('original pixel atlas loading', () => {
  it('shares successful image loads and retries a failed atlas without blocking a gradient fallback', async () => {
    const made: { onload?: () => void; onerror?: () => void }[] = []
    vi.stubGlobal('Image', class { onload?: () => void; onerror?: () => void; constructor() { made.push(this) } set src(_: string) {} })
    try {
      const a = pixelImage('synthetic:good'), b = pixelImage('synthetic:good')
      expect(a).toBe(b); made[0]!.onload!(); expect(await a).toBe(made[0])
      const missing = pixelImage('synthetic:missing'); made[1]!.onerror!(); expect(await missing).toBeNull()
      const retry = pixelImage('synthetic:missing'); expect(made).toHaveLength(3); made[2]!.onload!(); expect(await retry).toBe(made[2])
    } finally { vi.unstubAllGlobals() }
  })
})
