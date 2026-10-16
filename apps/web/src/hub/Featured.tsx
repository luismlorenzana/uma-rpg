// Town Hall's plaza (D147, D150, uma-racer's plaza on uma-kit's crowd): up to five small chibis standing on the road.
// The featured Uma (the one chosen on this device, else the highest Uma Level) is in front; the active party's other
// members stand round her, then the next highest levels. Tapping one opens her sheet: Fight, Profile, or feature another.
import { TOWN_PLAZA, type RosterOutfit, type TierWorld } from '@rpg/domain'
import { CROWD_SPOTS, type Plaza } from '@luismlorenzana/uma-kit/hub'
import { readPref, Sheet, subscribePrefs, writePref } from '@luismlorenzana/uma-kit/ui'
import { useMemo, useSyncExternalStore } from 'react'
import { Link, useSearchParams } from 'react-router'
import { AtlasSprite, imagePath, useArtUrl } from '../master/art'
import { useMaster } from '../master/master'
import { useWorld } from '../save/game'

const KEY = 'rpg.featured'
/** How tall a plaza chibi stands, in CSS px. */
const FIGURE = 44

/** Owned Umas, highest Uma Level first, then newest release, then name. */
function byLevel(world: TierWorld, roster: readonly RosterOutfit[]): RosterOutfit[] {
  return roster.filter((o) => world.umas[o.outfitId])
    .sort((a, b) => world.umas[b.outfitId]!.level - world.umas[a.outfitId]!.level || b.releasedJp.localeCompare(a.releasedJp) || a.name.localeCompare(b.name))
}

/** The plaza's Umas: the featured one first, then the active party's others, then the highest levels, five at most. */
export function crowdOf(world: TierWorld, roster: readonly RosterOutfit[], chosen: string | null): RosterOutfit[] {
  const owned = byLevel(world, roster)
  const featured = owned.find((o) => o.outfitId === chosen) ?? owned[0]
  if (featured === undefined) return []
  const party = world.parties[world.world.activeParty]?.slots ?? []
  const byId = new Map(owned.map((o) => [o.outfitId, o]))
  const ids = [featured.outfitId, ...party.filter((id): id is string => id !== null), ...owned.map((o) => o.outfitId)]
  return [...new Set(ids)].map((id) => byId.get(id)).filter((o): o is RosterOutfit => o !== undefined).slice(0, CROWD_SPOTS.length)
}

type Where = { readonly pathname: string; readonly search: string }
const pathWith = (where: Where, params: URLSearchParams): string => `${where.pathname}${params.size > 0 ? `?${params}` : ''}`

/** The plaza sheet for one Uma, over the current page. */
export function sheetFor(where: Where, outfitId: string): string {
  const params = new URLSearchParams(where.search)
  params.set('sheet', 'featured')
  params.set('uma', outfitId)
  return pathWith(where, params)
}

/** The current page without any global sheet. */
export function withoutSheet(where: Where): string {
  const params = new URLSearchParams(where.search)
  params.delete('sheet')
  params.delete('uma')
  return pathWith(where, params)
}

function useChosen(): string | null {
  return useSyncExternalStore(subscribePrefs, () => readPref(KEY), () => null)
}

export function useCrowd(): RosterOutfit[] {
  const world = useWorld()
  const master = useMaster()
  const chosen = useChosen()
  return useMemo(() => (world && master.status === 'ready' ? crowdOf(world, master.view.roster, chosen) : []), [world, master, chosen])
}

function UmaArt({ outfitId, size }: { outfitId: string; size: number }) {
  const master = useMaster()
  const art = master.status === 'ready' ? master.view.art : null
  const chibi = useArtUrl(imagePath(art, 'outfit-chibis', `${outfitId}-a`))
  if (chibi) return <img src={chibi} alt="" width={size} height={size} className="object-contain drop-shadow-md" style={{ width: size, height: size }} />
  // An outfit without a chibi stands as a round token of its icon, about a chibi's head and body high.
  const token = Math.round(size * 0.82)
  return (
    <span className="flex items-end justify-center" style={{ width: size, height: size }}>
      <span className="block overflow-hidden rounded-full shadow-2 ring-2 ring-panel" style={{ width: token, height: token }}>
        <AtlasSprite art={art} family="outfit-icons" frameKey={outfitId} size={token} />
      </span>
    </span>
  )
}

/** The plaza on the map: each Uma a small chibi linking to her sheet. */
export function plaza(crowd: readonly RosterOutfit[], sheetTo: (outfitId: string) => string): Plaza | undefined {
  if (crowd.length === 0) return undefined
  return {
    at: TOWN_PLAZA,
    figures: crowd.map((o, i) => ({
      key: o.outfitId,
      node: (
        <Link to={sheetTo(o.outfitId)} state={{ back: true }} aria-label={`${o.name}${i === 0 ? ', featured' : ''}: Fight, Profile or feature another`}
          className="block rounded-md p-0.5 active:bg-ink/10">
          <UmaArt outfitId={o.outfitId} size={FIGURE} />
        </Link>
      ),
    })),
  }
}

export function FeaturedSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const world = useWorld()
  const master = useMaster()
  const chosen = useChosen()
  const [search] = useSearchParams()
  const owned = world && master.status === 'ready' ? byLevel(world, master.view.roster) : []
  const featured = owned.find((o) => o.outfitId === chosen) ?? owned[0] ?? null
  // The Uma tapped on the plaza, else the featured one.
  const shown = owned.find((o) => o.outfitId === search.get('uma')) ?? featured
  const art = master.status === 'ready' ? master.view.art : null
  return (
    <Sheet open={open} onClose={onClose} title={shown?.name ?? 'No Umas yet'}>
      {shown !== null && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <UmaArt outfitId={shown.outfitId} size={64} />
            <p className="text-[13px] text-ink-soft">Lv {world?.umas[shown.outfitId]?.level ?? 1}{shown.title ? ` · ${shown.title}` : ''}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/battle/scenario-gate" replace className="font-display flex min-h-12 items-center justify-center rounded-sm bg-accent font-semibold text-accent-ink shadow-1">Fight</Link>
            <Link to={`/town/stable/outfit/${shown.outfitId}`} replace className="font-display flex min-h-12 items-center justify-center rounded-sm border border-hairline-strong bg-panel font-semibold shadow-1">Profile</Link>
          </div>
          <section>
            <h3 className="text-micro mb-1.5">Feature another</h3>
            <ul className="grid grid-cols-5 gap-1.5">
              {owned.map((o) => (
                <li key={o.outfitId}>
                  <button type="button" onClick={() => writePref(KEY, o.outfitId)} aria-label={`Feature ${o.name}`} aria-pressed={o.outfitId === featured?.outfitId}
                    className={`relative block w-full rounded-sm p-0.5 ${o.outfitId === featured?.outfitId ? 'ring-2 ring-accent' : ''}`}>
                    <AtlasSprite art={art} family="outfit-icons" frameKey={o.outfitId} size={56} className="w-full rounded-sm" />
                    <span className="font-display absolute right-1 bottom-1 rounded-full bg-scrim/80 px-1 text-[10px] leading-4 text-ink-on-dark">Lv {world?.umas[o.outfitId]?.level}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Sheet>
  )
}
