import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import atlas from '@luismlorenzana/uma-art/world/atlas.json'
import { BiomeIcon, MapCanvas, mapScale } from './MapCanvas'
import { MapViewSwitch, useMapView } from './MapView'
import type { MapLayout } from './layout'

describe('map canvas and device preferences', () => {
  it('uses the current atlas dimensions for biome icons when new frames grow the sheet', async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const el = document.createElement('div'), root = createRoot(el)
    try {
      await act(async () => { root.render(<BiomeIcon biome="meadow" />) })
      expect(el.querySelector('span')!.style.backgroundSize).toBe(`${atlas.width * 1.5}px ${atlas.height * 1.5}px`)
    } finally { await act(async () => { root.unmount() }); vi.unstubAllGlobals() }
  })
  it('snaps pixels, crops at most half a tile per edge on 2× phones, and fits a 1× phone', () => {
    expect(mapScale(390, 2)).toBe(1.5); expect(mapScale(375, 2)).toBe(1.5)
    expect(mapScale(375, 1)).toBe(1); expect(mapScale(600, 1)).toBe(2)
    expect(mapScale(375, 1.25) * 1.25).toBe(1)
  })
  it('draws terrain once, animates only the small ring, honors live reduced motion and keeps semantic 44px spots', async () => {
    vi.useFakeTimers(); vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const draws = vi.fn(), context = { setTransform: vi.fn(), clearRect: vi.fn(), drawImage: draws, imageSmoothingEnabled: true }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D)
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
    const listeners = new Set<() => void>(), query = { matches: false, addEventListener: (_: string, f: () => void) => listeners.add(f), removeEventListener: (_: string, f: () => void) => listeners.delete(f) }
    vi.stubGlobal('matchMedia', () => query)
    vi.stubGlobal('Image', class { onload?: () => void; set src(_: string) { queueMicrotask(() => this.onload?.()) } })
    const layout: MapLayout = { cols: 16, rows: 28, cells: [{ col: 0, row: 0, frame: 'ground/meadow-0' }], sprites: [{ x: 32, y: 32, frame: 'marker/frontier-0' }], spots: [{ id: 's1', kind: 'stage', x: 32, y: 32, w: 16, h: 16 }], frontier: 's1' }
    const el = document.createElement('div'), root = createRoot(el), tap = vi.fn()
    document.body.append(el)
    const render = () => root.render(<MapCanvas layout={layout} focusKey="test" describe={() => ({ label: 'Stage 1, Lv 1, available' })} onSpot={tap} />)
    try {
      await act(async () => { render(); await Promise.resolve() })
      expect(context.imageSmoothingEnabled).toBe(false)
      const initial = draws.mock.calls.length
      await act(async () => { render() }); expect(draws).toHaveBeenCalledTimes(initial)
      await act(async () => { vi.advanceTimersByTime(650) }); expect(draws).toHaveBeenCalledTimes(initial + 1)
      await act(async () => { query.matches = true; listeners.forEach((f) => f()) })
      const reduced = draws.mock.calls.length
      await act(async () => { vi.advanceTimersByTime(1950) }); expect(draws).toHaveBeenCalledTimes(reduced)
      const button = el.querySelector('button')!
      expect(parseFloat(button.style.width)).toBeGreaterThanOrEqual(44); expect(parseFloat(button.style.height)).toBeGreaterThanOrEqual(44)
      await act(async () => { button.click() }); expect(tap).toHaveBeenCalledWith(layout.spots[0])
    } finally { await act(async () => { root.unmount() }); el.remove(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals() }
    expect(listeners.size).toBe(0)
  })
  it('defaults to Map when storage is denied and remains switchable', async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    vi.stubGlobal('localStorage', { getItem: () => { throw Error('denied') }, setItem: () => { throw Error('denied') } })
    function View() { const [view, setView] = useMapView(); return <MapViewSwitch view={view} onChange={setView} /> }
    const el = document.createElement('div'), root = createRoot(el)
    try {
      await act(async () => { root.render(<View />) })
      const buttons = el.querySelectorAll('button')
      expect(buttons[0]!.getAttribute('aria-pressed')).toBe('true')
      await act(async () => { buttons[1]!.click() })
      expect(buttons[1]!.getAttribute('aria-pressed')).toBe('true')
    } finally { await act(async () => { root.unmount() }); vi.unstubAllGlobals() }
  })
})
