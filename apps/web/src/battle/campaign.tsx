// The campaign in the app: Tier 1's generated chapters (D48) with the PriConne cast's faces (D50), and the outfits'
// battle data. Pages render through CampaignGate once master data and the cast are loaded.
import { rpgCampaignChapter, type RosterOutfit, type RpgCampaignChapter } from '@rpg/domain'
import { useMemo, type ReactNode } from 'react'
import { retryCast, useCast, type Cast } from '../content/cast'
import type { MasterView } from '../master/master'
import { MasterGate } from '../places/MasterGate'

export interface Campaign {
  view: MasterView
  cast: Cast
  /** Tier 1's chapters in release order. */
  chapters: RpgCampaignChapter[]
  chapter: (id: string) => RpgCampaignChapter | null
  outfits: Map<string, RosterOutfit>
  /** A unit's display name: a cast member for foes, an outfit for Umas. */
  name: (id: string, castId?: string) => string
}

const cache = new WeakMap<MasterView, WeakMap<Cast, Campaign>>()

function buildCampaign(view: MasterView, cast: Cast): Campaign {
  const members = cast.members.map((m) => ({ id: m.id, name: m.name }))
  const chapters = view.chapters.filter((c) => c.tier === 1).map((c) => rpgCampaignChapter({ scenarioId: c.scenarioId, name: c.name, order: c.order }, members))
  const outfits = new Map(view.roster.map((o) => [o.outfitId, o]))
  return {
    view, cast, chapters, outfits,
    chapter: (id) => chapters.find((c) => c.id === id) ?? null,
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
