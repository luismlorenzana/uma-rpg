import { HUB_PAGE_NAMES, HUB_PAGES, placeById, type HubPage } from '@rpg/domain'
import { useWorld } from '../save/game'
import { MenuIcon } from '../ui/icons'
import { useNow } from '../ui/useNow'
import { readyPlaces } from './PlaceTargets'

const DOT: Record<HubPage, string> = { wilds: '#c49a6a', learning: '#a99be0', town: '#e0b25c' }

export function PageTabs({ page, onPage, onMenu }: { page: HubPage; onPage: (page: HubPage) => void; onMenu: () => void }) {
  const world = useWorld()
  const now = useNow(15_000)
  const ready = [...readyPlaces(world, now)]
  return (
    <nav className="pb-safe relative z-20 border-t border-hairline bg-panel/95 backdrop-blur" aria-label="Hub pages">
      <div className="flex">
        {HUB_PAGES.map((p) => {
          const active = p === page
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPage(p)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[13px] font-semibold ${active ? 'text-ink' : 'text-ink-faint'}`}
            >
              <span className="size-1.5 rounded-full" style={{ background: DOT[p], opacity: active ? 1 : 0.5 }} />
              {HUB_PAGE_NAMES[p]}
              {active && <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-accent" />}
              {(() => {
                const n = ready.filter((id) => placeById(id)?.page === p).length
                return n > 0 ? <span className="absolute right-[18%] top-1.5 min-w-4 rounded-full bg-success px-1 text-[10px] font-bold leading-4 text-white" aria-label={`${n} ready`}>{n}</span> : null
              })()}
            </button>
          )
        })}
        <button type="button" onClick={onMenu} className="flex min-h-14 w-14 items-center justify-center text-ink-soft" aria-label="Menu: every place">
          <MenuIcon />
        </button>
      </div>
    </nav>
  )
}
