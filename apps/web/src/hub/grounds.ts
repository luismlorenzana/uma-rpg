// Each Hub page's ground for uma-kit's map (D147): its uma-art tile page, palette and props. Battle draws H31's `battle`
// tiles once the pinned atlas has them, and Town Hall's until then.
import type { HubPage } from '@rpg/domain'
import { PALETTES, type PageGround } from '@luismlorenzana/uma-kit/hub'

export function pageGround(page: HubPage, tileFrames: Readonly<Record<string, unknown>>): PageGround {
  switch (page) {
    case 'town':
      return { id: 'town', tiles: 'town', palette: PALETTES.town! }
    case 'learning':
      return { id: 'learning', tiles: 'learning', palette: PALETTES.learning! }
    case 'battle':
      return { id: 'battle', tiles: tileFrames['battle/ground-0'] === undefined ? 'town' : 'battle', palette: PALETTES.battle! }
    case 'wilds':
      return { id: 'wilds', tiles: 'wilds', palette: PALETTES.wilds!, stream: true }
  }
}
