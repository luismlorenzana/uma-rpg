// The campaign in the app: Tier 1's world map (D66: five continents, one per scenario, of generated regions) with the
// PriConne cast's faces (D50), and the outfits' battle data. Pages render through CampaignGate once master data and the
// cast are loaded.
import { biomeById, FRANCHISES, regionChapter, stageRegionId, worldContinent, type RosterOutfit, type RpgCampaignChapter, type RpgElement, type WorldContinent, type WorldRegion } from '@rpg/domain'
import { useMemo, type ReactNode } from 'react'
import { retryCast, useCast, type Cast } from '../content/cast'
import type { MasterView } from '../master/master'
import { MasterGate } from '../places/MasterGate'

export interface Campaign {
  view: MasterView
  cast: Cast
  /** Tier 1's continents in release order. */
  continents: WorldContinent[]
  /** A region's stages as a small chapter for the battle rules (built on first use). */
  region: (id: string) => RpgCampaignChapter | null
  regionInfo: (id: string) => WorldRegion | null
  /** The region chapter a stage belongs to. */
  stageRegion: (stageId: string) => RpgCampaignChapter | null
  /** A region's biome color. */
  color: (regionId: string) => string
  outfits: Map<string, RosterOutfit>
  /** A unit's display name: a cast member for foes, an outfit for Umas. */
  name: (id: string, castId?: string) => string
}

const cache = new WeakMap<MasterView, WeakMap<Cast, Campaign>>()

function buildCampaign(view: MasterView, cast: Cast): Campaign {
  const face = (m: { id: string; name: string; element?: RpgElement }) => ({ id: m.id, name: m.name, ...(m.element ? { element: m.element } : {}) })
  const members = Object.fromEntries(FRANCHISES.map((f) => [f, cast.packs[f].map(face)]))
  const continents = view.chapters.filter((c) => c.tier === 1).sort((a, b) => a.order - b.order).map((c) => worldContinent({ name: c.name, order: c.order }))
  const regions = new Map(continents.flatMap((c) => c.regions.map((r) => [r.id, r] as const)))
  const built = new Map<string, RpgCampaignChapter>()
  const region = (id: string): RpgCampaignChapter | null => {
    const info = regions.get(id)
    if (!info) return null
    let chapter = built.get(id)
    if (!chapter) built.set(id, (chapter = regionChapter(info, members)))
    return chapter
  }
  const outfits = new Map(view.roster.map((o) => [o.outfitId, o]))
  return {
    view, cast, continents, outfits, region,
    regionInfo: (id) => regions.get(id) ?? null,
    stageRegion: (stageId) => region(stageRegionId(stageId)),
    color: (id) => { const r = regions.get(id); return r ? biomeById(r.biome).color : '#3a4a66' },
    name: (id, castId) => (castId ? cast.byId.get(castId)?.name ?? castId : outfits.get(id)?.name ?? id),
  }
}

export function useCampaignOf(view: MasterView, cast: Cast): Campaign {
  return useMemo(() => {
    let byCast = cache.get(view)
    if (!byCast) cache.set(view, (byCast = new WeakMap()))
    let campaign = byCast.get(cast)
    if (!campaign) byCast.set(cast, (campaign = buildCampaign(view, cast)))
    return campaign
  }, [view, cast])
}

function CastGate({ view, children }: { view: MasterView; children: (campaign: Campaign) => ReactNode }) {
  const cast = useCast()
  if (cast.status === 'ready') return <Ready view={view} cast={cast.cast}>{children}</Ready>
  if (cast.status === 'error')
    return (
      <div className="space-y-3 p-4">
        <p>The rival cast could not be loaded. {cast.message}</p>
        <button type="button" onClick={retryCast} className="min-h-11 rounded-sm bg-accent px-4 font-display font-bold text-accent-ink">
          Try again
        </button>
      </div>
    )
  return <p className="p-4 text-ink-soft">Gathering the rivals…</p>
}

function Ready({ view, cast, children }: { view: MasterView; cast: Cast; children: (campaign: Campaign) => ReactNode }) {
  return <>{children(useCampaignOf(view, cast))}</>
}

/** Renders children once master data and the cast are loaded. */
export function CampaignGate({ children }: { children: (campaign: Campaign) => ReactNode }) {
  return <MasterGate>{(view) => <CastGate view={view}>{children}</CastGate>}</MasterGate>
}
