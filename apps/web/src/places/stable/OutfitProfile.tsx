// The Uma profile v2 frame (H119, UP25–UP27): one compact identity header, three fact doors and four stable skeleton tabs.
// Later packets replace each skeleton's body without moving this header, route or tab contract.
import { AtlasSprite, imagePath, useArtUrl } from '@luismlorenzana/uma-kit/content'
import { ProfileFrame, UnlockConfirm } from '@luismlorenzana/uma-kit/places'
import { UiMark } from '@luismlorenzana/uma-kit/ui'
import {
  RPG_TIER_MAX_LEVEL, SaveRuleError, rpgExpToNext,
  type OwnedUma, type Place, type RosterOutfit, type TierWorld,
} from '@rpg/domain'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { seeStableOutfit } from '../../album/preferences'
import { umaUpgrades } from '../../album/upgrades'
import { useHubNavigation } from '../../hub/navigation'
import type { MasterView } from '../../master/master'
import { markTarget, unlock, useActiveTier, useOwnerTier, useWorld } from '../../save/game'
import { TargetIcon, TicketIcon } from '../../ui/icons'
import { StarsPanel } from '../observatory/StarsPanel'
import { ClassTab } from './ClassTab'
import { DetailsSheet } from './DetailsSheet'
import { FactsRow } from './FactsRow'
import { GearTab } from './GearTab'
import { TemplateTab } from './TemplateTab'
import { exp, level, unlock as unlockCopy } from './copy'
import { PROFILE_TABS, rememberTab, storedTab, tabDots, tabFromRoute, type ProfileTab } from './profile-tabs'

export interface OutfitProfileProps {
  view: MasterView
  outfitId: string
  place: Place
  route?: string
}

export function OutfitProfile({ view, outfitId, place, route }: OutfitProfileProps) {
  const nav = useHubNavigation()
  const navigate = useNavigate()
  const location = useLocation()
  const world = useWorld()
  const tier = useActiveTier()
  const home = useOwnerTier(outfitId)
  const outfit = view.roster.find((row) => row.outfitId === outfitId)
  const owned = world?.umas[outfitId] ?? null
  const routed = tabFromRoute(route)
  // The Skills-alone route retired with its page (H120): it lands on the Class tab.
  const [remembered, setRemembered] = useState<ProfileTab>(() =>
    route === 'skills' || (location.state as { sheet?: string } | null)?.sheet ? 'class' : storedTab())
  const [details, setDetails] = useState(false)
  const bust = useArtUrl(outfit ? imagePath(view.art, 'outfit-busts', outfit.outfitId) ?? imagePath(view.art, 'outfit-portraits', outfit.outfitId) : null)

  useEffect(() => seeStableOutfit(view.roster.map((row) => row.outfitId), outfitId), [view, outfitId])
  useEffect(() => {
    if (!outfit) return
    if (routed) {
      rememberTab(routed)
      setRemembered(routed)
      return
    }
    navigate(`/town/stable/outfit/${encodeURIComponent(outfitId)}/${remembered}`, { replace: true, state: location.state })
  }, [location.state, navigate, outfit, outfitId, remembered, routed])

  const openTab = (tab: ProfileTab) => {
    rememberTab(tab)
    setRemembered(tab)
    navigate(`/town/stable/outfit/${encodeURIComponent(outfitId)}/${tab}`, { replace: true, state: location.state })
  }

  if (!outfit) {
    return (
      <div className="p-4">
        <p className="mb-3 text-ink-soft">That outfit isn't in the current game data.</p>
        <button type="button" onClick={() => nav.subBack(place)} className="min-h-11 rounded-sm bg-raised px-4 font-semibold">Back to the Stable</button>
      </div>
    )
  }

  const tab = routed ?? remembered
  const upgrades = owned && world ? umaUpgrades(world, outfit, tier) : null
  const dots = tabDots(upgrades)
  const next = owned && owned.level < RPG_TIER_MAX_LEVEL ? rpgExpToNext(owned.level) : null

  return (
    <>
      <ProfileFrame<ProfileTab>
        size="compact"
        portrait={bust
          ? <img src={bust} alt="" className="size-full object-cover object-top" />
          : <AtlasSprite art={view.art} family="outfit-icons" frameKey={outfit.outfitId} size={64} />}
        name={outfit.name}
        title={outfit.title}
        level={owned ? level(owned.level) : undefined}
        progress={owned ? { value: next ? owned.exp : 1, max: next ?? 1, label: exp(owned.exp, next) } : undefined}
        chips={<span className="font-semibold text-accent">{'★'.repeat(outfit.rarity)}</span>}
        corner={owned && world ? <TargetToggle outfitId={outfitId} on={world.targets.includes(outfitId)} /> : undefined}
        locked={!owned}
        summary={owned && world
          ? <FactsRow outfit={outfit} uma={owned} world={world} tier={tier} onDetails={() => setDetails(true)} />
          : home !== null ? <ElsewhereNote text={unlockCopy({ kind: 'tier', tier: home })} />
          : tier > 1 ? <ElsewhereNote text={unlockCopy({ kind: 'tier-one' })} />
          : <UnlockBox outfit={outfit} tickets={world?.wallet.unlockTickets ?? 0} />}
        tabs={owned && world ? PROFILE_TABS.map(({ key, label }) => ({ key, label, dot: dots[key], dotLabel: `${label}, ready` })) : undefined}
        tab={owned && world ? tab : undefined}
        onTab={openTab}
      >
        {owned && world ? (
          <>
            {tab === 'class' && <ClassTab outfit={outfit} uma={owned} world={world} />}
            {tab === 'gear' && <GearTab outfit={outfit} uma={owned} world={world} tier={tier as 1 | 2 | 3} upgrades={upgrades} />}
            {tab === 'stars' && <StarsPanel outfit={outfit} uma={owned} world={world} tier={tier as 1 | 2 | 3} />}
            {tab === 'template' && <TemplateTab view={view} outfit={outfit} uma={owned} world={world} tier={tier as 1 | 2 | 3} />}
          </>
        ) : <TemplateTab view={view} outfit={outfit} uma={null} world={null} tier={tier as 1 | 2 | 3} />}
      </ProfileFrame>
      {owned && <DetailsSheet open={details} onClose={() => setDetails(false)} outfit={outfit} uma={owned} tier={tier} />}
    </>
  )
}

/** Marks her as a target: facilities list what maxing her takes (D100). */
function TargetToggle({ outfitId, on }: { outfitId: string; on: boolean }) {
  const [error, setError] = useState<string | null>(null)
  return (
    <span className="relative block">
      <button type="button" aria-pressed={on} aria-label={on ? 'Remove target' : 'Mark target'} title={on ? 'Target' : 'Mark target'}
        onClick={() => markTarget(outfitId, !on).then(() => setError(null), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))}
        className={`flex size-11 items-center justify-center rounded-full border shadow-1 ${on ? 'border-accent bg-accent text-accent-ink' : 'border-hairline-strong bg-raised text-ink-soft'}`}>
        <TargetIcon size={18} />
      </button>
      {error && <span className="absolute right-0 top-full z-10 mt-1 w-48 rounded-sm bg-danger/90 p-1.5 text-right text-[11px] text-white">{error}</span>}
    </span>
  )
}

function ElsewhereNote({ text }: { text: string }) {
  return <p className="flex min-h-11 items-center justify-center rounded-md bg-panel text-center font-display text-[14px] font-bold text-ink-soft">{text}</p>
}

function UnlockBox({ outfit, tickets }: { outfit: RosterOutfit; tickets: number }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <section>
      <button type="button" disabled={tickets < 1} onClick={() => setConfirming(true)}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-accent font-display text-[14px] font-bold text-accent-ink disabled:opacity-40">
        <TicketIcon size={18} /> {unlockCopy({ kind: 'ticket' })}
      </button>
      <UnlockConfirm open={confirming} onClose={() => setConfirming(false)} name={outfit.title ?? outfit.name} tickets={tickets}
        ticketMark={<UiMark mark="currency/uma-ticket" fallback={<TicketIcon size={16} />} />}
        onConfirm={() => unlock(outfit).then(() => setConfirming(false), (err: unknown) => {
          throw new Error(err instanceof SaveRuleError ? err.message : 'Could not unlock.')
        })} />
    </section>
  )
}
