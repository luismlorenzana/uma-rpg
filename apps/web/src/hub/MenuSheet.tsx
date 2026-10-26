// The menu, "Every place" (D147, uma-kit's PlaceMenu): every page's places in the bar's order with locks and Ready counts,
// then the Account. `?sheet=menu` on the route it opens over, so Back closes it.
import { HUB_PAGE_NAMES, HUB_PAGES, placeById, placeOpen, placesOn } from '@rpg/domain'
import { PlaceMenu, peekPath, type MenuGroup } from '@luismlorenzana/uma-kit/shell'
import { Sheet } from '@luismlorenzana/uma-kit/ui'
import { useActiveTier, useWorld } from '../save/game'
import { useNow } from '../ui/useNow'
import { readyPlaces } from './ready'

export function MenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const world = useWorld()
  const tier = useActiveTier()
  const now = useNow(15_000)
  const ready = readyPlaces(world, now, tier)
  const groups: MenuGroup[] = HUB_PAGES.map((page) => ({
    key: page,
    label: HUB_PAGE_NAMES[page],
    places: placesOn(page).map((place) => ({
      key: place.id,
      name: place.name,
      to: place.direct ? `/${place.page}/${place.id}` : peekPath(place.page, place.id),
      locked: !placeOpen(place, world, tier),
      count: ready.has(place.id) ? 1 : 0,
    })),
  }))
  const account = placeById('account')!
  return (
    <Sheet open={open} onClose={onClose} title="Every place">
      <PlaceMenu groups={groups} extra={[{ key: account.id, name: account.name, to: `/${account.page}/${account.id}` }]} />
    </Sheet>
  )
}
