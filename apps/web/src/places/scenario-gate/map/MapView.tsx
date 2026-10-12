import { useState } from 'react'
export type MapView = 'map' | 'list'
const KEY = 'rpg-world-map-view'
export function useMapView(): [MapView, (view: MapView) => void] {
  const [view, setView] = useState<MapView>(() => {
    try { return localStorage.getItem(KEY) === 'list' ? 'list' : 'map' } catch { return 'map' }
  })
  return [view, (next) => { setView(next); try { localStorage.setItem(KEY, next) } catch { /* Private browsing can deny storage. */ } }]
}
export function MapViewSwitch({ view, onChange }: { view: MapView; onChange: (view: MapView) => void }) {
  return <div role="group" aria-label="Map view" className="flex gap-1">
    {(['map', 'list'] as const).map((v) => <button key={v} type="button" aria-pressed={view === v} onClick={() => onChange(v)}
      className={`min-h-11 min-w-16 rounded-sm px-3 text-[13px] font-semibold ${view === v ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'}`}>{v === 'map' ? 'Map' : 'List'}</button>)}
  </div>
}
