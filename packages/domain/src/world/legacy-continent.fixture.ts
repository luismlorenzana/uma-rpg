// Historical world-shape/replay fixtures only. Production always uses all 48 honeycomb regions and six Springs.
import { worldContinent, type ContinentSource } from './world'

export function legacyWorldContinent(source: ContinentSource) {
  const c = worldContinent(source)
  return { ...c, regions: c.regions.slice(0, 40),
    springs: c.springs.slice(0, 5).map((s, i) => ({ ...s, row: i * 2 })) }
}
