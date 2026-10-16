// The featured Uma on Town Hall's plaza (D147, uma-racer's plaza): one Uma standing on the road, the one chosen on this
// device or else the highest Uma Level. Tapping her opens a sheet: Fight, Profile, or feature another.
import { TOWN_PLAZA, type RosterOutfit, type TierWorld } from '@rpg/domain'
import { readPref, Sheet, subscribePrefs, writePref } from '@luismlorenzana/uma-kit/ui'
import { useMemo, useSyncExternalStore } from 'react'
import { Link } from 'react-router'
import { AtlasSprite, imagePath, useArtUrl } from '../master/art'
import { useMaster } from '../master/master'
import { useWorld } from '../save/game'

const KEY = 'rpg.featured'

/** Owned Umas, highest Uma Level first, then newest release, then name. */
function byLevel(world: TierWorld, roster: readonly RosterOutfit[]): RosterOutfit[] {
  return roster.filter((o) => world.umas[o.outfitId])
    .sort((a, b) => world.umas[b.outfitId]!.level - world.umas[a.outfitId]!.level || b.releasedJp.localeCompare(a.releasedJp) || a.name.localeCompare(b.name))
}

export function useFeatured(): RosterOutfit | null {
  const world = useWorld()
  const master = useMaster()
  const chosen = useSyncExternalStore(subscribePrefs, () => readPref(KEY), () => null)
  return useMemo(() => {
    if (!world || master.status !== 'ready') return null
    const owned = byLevel(world, master.view.roster)
    return owned.find((o) => o.outfitId === chosen) ?? owned[0] ?? null
  }, [world, master, chosen])
}

function UmaArt({ outfitId, size }: { outfitId: string; size: number }) {
  const master = useMaster()
  const art = master.status === 'ready' ? master.view.art : null
  const chibi = useArtUrl(imagePath(art, 'outfit-chibis', `${outfitId}-a`))
  if (chibi) return <img src={chibi} alt="" width={size} height={size} className="object-contain drop-shadow-md" style={{ width: size, height: size }} />
  return <AtlasSprite art={art} family="outfit-icons" frameKey={outfitId} size={size} className="rounded-md" />
}

/** The plaza's slot on the map: her art and name. */
export function plaza(featured: RosterOutfit | null, sheetTo: string) {
  if (featured === null) return undefined
  return {
    at: TOWN_PLAZA,
    node: (
      <Link to={sheetTo} state={{ back: true }} aria-label={`${featured.name}: Fight, Profile or feature another`}
        className="flex min-h-24 min-w-24 flex-col items-center justify-center gap-1 rounded-md p-1 active:bg-ink/5">
        <UmaArt outfitId={featured.outfitId} size={72} />
        <span aria-hidden className="max-w-28 truncate rounded-full border border-accent/40 bg-accent-wash px-2 py-0.5 text-[11px] leading-4 font-semibold text-ink">{featured.name}</span>
      </Link>
    ),
  }
}

export function FeaturedSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const featured = useFeatured()
  const world = useWorld()
  const master = useMaster()
  const others = world && master.status === 'ready' ? byLevel(world, master.view.roster) : []
  const art = master.status === 'ready' ? master.view.art : null
  return (
    <Sheet open={open} onClose={onClose} title={featured?.name ?? 'No Umas yet'}>
      {featured !== null && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <UmaArt outfitId={featured.outfitId} size={64} />
            <p className="text-[13px] text-ink-soft">Lv {world?.umas[featured.outfitId]?.level ?? 1}{featured.title ? ` · ${featured.title}` : ''}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/battle/scenario-gate" replace className="font-display flex min-h-12 items-center justify-center rounded-sm bg-accent font-semibold text-accent-ink shadow-1">Fight</Link>
            <Link to={`/town/stable/outfit/${featured.outfitId}`} replace className="font-display flex min-h-12 items-center justify-center rounded-sm border border-hairline-strong bg-panel font-semibold shadow-1">Profile</Link>
          </div>
          <section>
            <h3 className="text-micro mb-1.5">Feature another</h3>
            <ul className="grid grid-cols-5 gap-1.5">
              {others.map((o) => (
                <li key={o.outfitId}>
                  <button type="button" onClick={() => writePref(KEY, o.outfitId)} aria-label={`Feature ${o.name}`} aria-pressed={o.outfitId === featured.outfitId}
                    className={`relative block w-full rounded-sm p-0.5 ${o.outfitId === featured.outfitId ? 'ring-2 ring-accent' : ''}`}>
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
