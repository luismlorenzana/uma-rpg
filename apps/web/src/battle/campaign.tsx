// The campaign in the app: the active tier's world map (D66: five continents, one per scenario, of generated regions;
// ids w6–w10 in Tier 2, H35) with the enemy roster's faces (D135), and the outfits' battle data. Pages render through
// CampaignGate once master data and the roster are loaded.
import { biomeById, capitalChapter, capitalId, regionChapter, stageRegionId, worldContinent, type EnemyRoster, type RosterOutfit, type RpgCampaignChapter, type WorldContinent, type WorldRegion } from '@rpg/domain'
import { useMemo, type ReactNode } from 'react'
import { retryCast, useCast, type Cast } from '../content/cast'
import type { MasterView } from '../master/master'
import { MasterGate } from '../places/MasterGate'
import { useActiveTier } from '../save/game'

export interface Campaign {
  view: MasterView
  cast: Cast
  /** The tier whose world map this is. */
  tier: number
  /** The tier's continents in release order (four for a partial tier, T9). */
  continents: WorldContinent[]
  /** A region or capital's stages as a small chapter for the battle rules (built on first use). */
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

/** One campaign per master data, cast and tier. */
const cache = new WeakMap<MasterView, WeakMap<Cast, Map<number, Campaign>>>()

export function buildCampaign(view: MasterView, cast: Cast, tier = 1): Campaign {
  const roster: EnemyRoster = cast.members.map((m) => ({ id: m.id, name: m.name, franchise: m.franchise, tier: m.tier }))
  const continents = view.chapters.filter((c) => c.tier === tier).sort((a, b) => a.order - b.order).map((c) => worldContinent({ name: c.name, order: c.order }))
  const regions = new Map(continents.flatMap((c) => c.regions.map((r) => [r.id, r] as const)))
  const capitals = new Map(continents.map((c) => [capitalId(c.id), c] as const))
  const built = new Map<string, RpgCampaignChapter>()
  const region = (id: string): RpgCampaignChapter | null => {
    const info = regions.get(id)
    const capital = capitals.get(id)
    if (!info && !capital) return null
    let chapter = built.get(id)
    if (!chapter) built.set(id, (chapter = capital ? capitalChapter(capital, roster) : regionChapter(info!, roster)))
    return chapter
  }
  const outfits = new Map(view.roster.map((o) => [o.outfitId, o]))
  return {
    view, cast, tier, continents, outfits, region,
    regionInfo: (id) => regions.get(id) ?? null,
    stageRegion: (stageId) => region(stageRegionId(stageId)),
    color: (id) => {
      const r = regions.get(id), capital = capitals.get(id)
      return r ? biomeById(r.biome).color : view.chapters.find((c) => c.tier === tier && c.order === capital?.order)?.color ?? '#3a4a66'
    },
    name: (id, castId) => (castId ? cast.byId.get(castId)?.name ?? castId : outfits.get(id)?.name ?? id),
  }
}

/** The cached campaign of a master data, cast and tier. */
export function campaignOf(view: MasterView, cast: Cast, tier: number): Campaign {
  let byCast = cache.get(view)
  if (!byCast) cache.set(view, (byCast = new WeakMap()))
  let byTier = byCast.get(cast)
  if (!byTier) byCast.set(cast, (byTier = new Map()))
  let campaign = byTier.get(tier)
  if (!campaign) byTier.set(tier, (campaign = buildCampaign(view, cast, tier)))
  return campaign
}

function useCampaignOf(view: MasterView, cast: Cast): Campaign {
  const tier = useActiveTier()
  return useMemo(() => campaignOf(view, cast, tier), [view, cast, tier])
}

function CastGate({ view, children }: { view: MasterView; children: (campaign: Campaign) => ReactNode }) {
  const cast = useCast()
  if (cast.status === 'ready') return <Ready view={view} cast={cast.cast}>{children}</Ready>
  if (cast.status === 'error')
    return (
      <div className="space-y-3 p-4">
        <p>The enemies could not be loaded. {cast.message}</p>
        <button type="button" onClick={retryCast} className="min-h-11 rounded-sm bg-accent px-4 font-display font-bold text-accent-ink">
          Try again
        </button>
      </div>
    )
  return <p className="p-4 text-ink-soft">Gathering the enemies…</p>
}

function Ready({ view, cast, children }: { view: MasterView; cast: Cast; children: (campaign: Campaign) => ReactNode }) {
  return <>{children(useCampaignOf(view, cast))}</>
}

/** Renders children once master data and the cast are loaded. */
export function CampaignGate({ children }: { children: (campaign: Campaign) => ReactNode }) {
  return <MasterGate>{(view) => <CastGate view={view}>{children}</CastGate>}</MasterGate>
}
