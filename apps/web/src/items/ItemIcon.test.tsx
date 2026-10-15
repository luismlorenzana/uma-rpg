import atlas from '@luismlorenzana/uma-art/gear/atlas.json'
import { EQUIP_TYPES, gearId } from '@rpg/domain'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { ItemIcon } from './ItemIcon'

describe('H28 gear icon rendering', () => {
  it('renders every new grade at 1×/2× using its own row and the enlarged sheet, without fallback badges', async () => {
    const types = EQUIP_TYPES.filter(t => t === 'boots' || t === 'slippers' || t.startsWith('talisman-') || t.startsWith('amulet-'))
    expect(types).toHaveLength(12)
    const cases = types.flatMap(type => Array.from({ length: 10 }, (_, g) => [32, 64].map(size => ({ id: gearId(type, g + 1), size })))).flat()
    const host = document.createElement('div'), root = createRoot(host)
    document.body.append(host); vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    try {
      await act(async () => root.render(<>{cases.map(({ id, size }) => <ItemIcon key={`${id}:${size}`} id={id} size={size} label={id} />)}</>))
      const icons = [...host.querySelectorAll<HTMLElement>('[role="img"]')]
      expect(icons).toHaveLength(240)
      cases.forEach(({ id, size }, i) => {
        const icon = icons[i]!, frame = atlas.frames[id as keyof typeof atlas.frames], scale = size / 32
        expect(icon.getAttribute('aria-label')).toBe(id)
        expect(icon.style.width).toBe(`${size}px`); expect(icon.style.height).toBe(`${size}px`)
        expect(icon.style.backgroundSize).toBe(`${atlas.width * scale}px ${atlas.height * scale}px`)
        expect(icon.style.backgroundPosition).toBe(`${-frame.x * scale}px ${-frame.y * scale}px`)
        expect(icon.style.backgroundImage).toContain('/gear/atlas.png')
        expect(icon.style.imageRendering).toBe('pixelated')
        expect(icon.children).toHaveLength(0)
      })
    } finally {
      await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals()
    }
  })
})
