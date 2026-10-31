// The Uma profile v2 frame (H119, UP25–UP27): one compact identity header, three fact doors and four stable skeleton tabs.
// Later packets replace each skeleton's body without moving this header, route or tab contract.
import { AtlasSprite, imagePath, useArtUrl } from '@luismlorenzana/uma-kit/content'
import { ProfileFrame, UnlockConfirm } from '@luismlorenzana/uma-kit/places'
import { UiMark } from '@luismlorenzana/uma-kit/ui'
import {
  BOND_MAX_LEVEL, HERO_HALL_PLACES, HERO_LIMIT_IDS, RPG_CLASSES, RPG_TIER_MAX_LEVEL, SaveRuleError, activeClass, bondCapacity, classTrack,
  heroLimit, heroLimitHall, heroSeatHome, heroSeatOf, parentsOf, rpgClassExpToNext, rpgClassMaxRank, rpgExpToNext,
  rpgIsTier0, rpgRework, umaCallingPick,
  type OwnedUma, type Place, type RosterOutfit, type RpgClass, type TierWorld,
} from '@rpg/domain'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { seeStableOutfit } from '../../album/preferences'
import { umaUpgrades } from '../../album/upgrades'
import { Bar, CLASS_LABEL } from '../../battle/labels'
import { ClassEmblem } from '../../battle/pixel-icons'
import { useHubNavigation } from '../../hub/navigation'
import type { MasterView } from '../../master/master'
import { markTarget, unlock, useActiveTier, useOwnerTier, useWorld } from '../../save/game'
import { HelpButton } from '../../ui/HelpButton'
import { TargetIcon, TicketIcon } from '../../ui/icons'
import { StarsPanel } from '../observatory/StarsPanel'
import { DetailsSheet } from './DetailsSheet'
import { FactsRow } from './FactsRow'
import { EquipView, upgradeCount, UpgradeView } from './GearCardV3'
import { SkillsPage } from './SkillsPage'
import { TemplateTab } from './TemplateTab'
import { bond as bondCopy, exp, level, unlock as unlockCopy } from './copy'
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
  const [remembered, setRemembered] = useState<ProfileTab>(() =>
    (location.state as { sheet?: string } | null)?.sheet === 'classes' ? 'class' : storedTab())
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
  const classId = owned ? activeClass(outfit, owned, tier) : null
  const upgrades = owned && world ? umaUpgrades(world, outfit, tier) : null
  const callingOpen = !!owned && !!umaCallingPick(outfit) && !owned.calling?.confirmed
  const dots = tabDots(upgrades, callingOpen)
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
            {tab === 'gear' && <GearTab outfit={outfit} uma={owned} world={world} upgrades={upgrades} onClass={() => openTab('class')} />}
            {tab === 'stars' && <StarsPanel outfitId={outfitId} />}
            {tab === 'template' && <TemplateTab view={view} outfit={outfit} uma={owned} classId={classId} tier={tier as 1 | 2 | 3} stock={world.items} />}
          </>
        ) : <TemplateTab view={view} outfit={outfit} uma={null} classId={null} tier={tier as 1 | 2 | 3} stock={world?.items ?? {}} />}
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

// --- Class skeleton: today's complete Skills body, Inheritance and Class Ranks ---------------------------------------

/** Classes in the Class Ranks grid for this world and generation. */
export function rankGridClasses(uma: Pick<OwnedUma, 'ranks'>, tier: number | string): RpgClass[] {
  if (!rpgRework('classes')) return [...RPG_CLASSES]
  return RPG_CLASSES.filter((classId) => (rpgIsTier0(classId) ? Number(tier) === 1 : Number(tier) !== 1 || !!uma.ranks.classes[classId]))
}

function classFill(classId: RpgClass, track: { rank: number; exp: number }): { value: number; max: number } {
  return track.rank >= rpgClassMaxRank(classId) ? { value: 1, max: 1 } : { value: track.exp, max: rpgClassExpToNext(classId, track.rank) }
}

function ClassTab({ outfit, uma, world }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld }) {
  const tier = useActiveTier()
  return (
    <div className="space-y-2">
      <SkillsPage outfit={outfit} name={outfit.name} />
      <InheritanceCard outfitId={outfit.outfitId} uma={uma} world={world} />
      <section className="rounded-md bg-panel p-2">
        <h3 className="text-micro">Class Ranks</h3>
        <div className="mt-1 grid grid-cols-3 gap-1" aria-label="Class Ranks">
          {rankGridClasses(uma, tier).map((classId) => {
            const track = classTrack(uma.ranks, classId)
            const progress = classFill(classId, track)
            return (
              <div key={classId} className="rounded-xs bg-raised px-1.5 py-1" aria-label={`${CLASS_LABEL[classId]} Rank ${track.rank}`}>
                <span className="flex items-center gap-1">
                  <ClassEmblem classId={classId} />
                  <span className="min-w-0 flex-1 truncate text-[10px] font-semibold">{CLASS_LABEL[classId]}</span>
                  <span className="font-display text-[11px] font-bold">{track.rank}</span>
                </span>
                <Bar className="mt-0.5 h-1" value={progress.value} max={progress.max} tone="exp" />
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function InheritanceCard({ outfitId, uma, world }: { outfitId: string; uma: OwnedUma; world: TierWorld }) {
  const navigate = useNavigate()
  const seat = heroSeatOf(world, outfitId)
  const parents = parentsOf(world, outfitId)
  const bonds = HERO_LIMIT_IDS.filter((id) => uma.bonds[id] || parents.includes(id))
  const hall = (id: (typeof HERO_LIMIT_IDS)[number]) => () => navigate(`/learning/${HERO_HALL_PLACES[heroLimitHall(id)]}`, { state: { back: true } })
  return (
    <section className="space-y-1 rounded-md bg-panel p-2">
      <div className="flex min-h-9 items-center justify-between">
        <h3 className="text-micro">Inheritance</h3>
        <HelpButton title="Inheritance">
          <p>Seat her in a Hall of Heroes. A Hero owns that seat's Limit Break; a Learner borrows it and builds a Bond.</p>
        </HelpButton>
      </div>
      {seat ? (
        <button type="button" onClick={hall(seat)} className="flex min-h-11 w-full items-center gap-2 rounded-xs bg-raised px-2 text-left">
          <ClassEmblem classId={heroSeatHome(seat)} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-semibold">{CLASS_LABEL[heroSeatHome(seat)]} Hero · {heroLimit(seat).name}</span>
            <span className="block text-[10px] text-ink-soft">Bond {(uma.bonds[seat] ?? { level: 0 }).level}/{BOND_MAX_LEVEL}</span>
          </span>
          <span className="text-ink-faint">›</span>
        </button>
      ) : (
        <>
          {parents.length === 0 && <p className="text-[12px] text-ink-soft">No inheritance yet</p>}
          {bonds.map((id) => {
            const bond = uma.bonds[id] ?? { level: 0, exp: 0 }
            const now = parents.includes(id)
            return (
              <button key={id} type="button" onClick={hall(id)} className="flex min-h-11 w-full items-center justify-between gap-2 text-left text-[13px]">
                <span className="truncate">{heroLimit(id).name}{now ? '' : <span className="text-ink-faint"> · former Hero</span>}</span>
                <span className="shrink-0 text-ink-soft">{bondCopy(bond.level, Math.round(bondCapacity(bond.level) * 100))}</span>
              </button>
            )
          })}
        </>
      )}
    </section>
  )
}

// --- Gear skeleton: both current bodies stacked, without a hidden sub-view -------------------------------------------

function GearTab({ outfit, uma, world, upgrades, onClass }: {
  outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; upgrades: ReturnType<typeof umaUpgrades> | null; onClass: () => void
}) {
  const tier = useActiveTier() as 1 | 2 | 3
  const count = upgradeCount(upgrades)
  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <h2 className="font-display text-[16px] font-bold">Equip</h2>
        <EquipView outfit={outfit} uma={uma} world={world} tier={tier} onSkills={onClass} />
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-[16px] font-bold">Upgrade{count ? ` · ${count}` : ''}</h2>
        <UpgradeView outfit={outfit} uma={uma} world={world} tier={tier} upgrades={upgrades} />
      </section>
    </div>
  )
}
