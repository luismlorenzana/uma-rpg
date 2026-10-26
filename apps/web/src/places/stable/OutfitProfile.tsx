// An outfit's profile (S1–S7, reorganised D60 and D77): a header with her Uma Level and EXP, the class she fights as,
// her Craft Level and what she's doing now, then tabs: Skills (class, three weapons, skill trees, Class Ranks; first, as it
// changes most), Battle (her RPG stats), Gear (the standard preset, equipment, Weapon and Armor Ranks, Extra Stats),
// Work (Craft Level and her job) and Racing (the original's aptitudes, stats and unique skill). A locked outfit shows
// the Unlock flow and her racing profile; an outfit another tier's world owns says where she lives, and a later tier
// sends unlocks to Tier 1 (H35, D5). The header, the tabs and the unlock confirm are the kit's frame (uma-platform P56,
// SD3). "Can upgrade" (H34) dots the Gear tab and counts Extra Stats. Engine v16 (the Tier rework's R1, H70, live since
// H72): her template's chip and card follow the stars, a Pace or Late Uma's calling pick card sits above her class chip
// until confirmed, and the Racing tab's "Her template" says what her aptitudes do.
import { STATS } from '@luismlorenzana/uma-data'
import { AtlasSprite, imagePath, useArtUrl } from '@luismlorenzana/uma-kit/content'
import {
  activeClass, activeNodeSlots, ARMOR_KINDS, BOND_MAX_LEVEL, bondCapacity, HERO_HALLS, HERO_LIMIT_IDS, heroLimit, heroLimitClass, heroSeatOf, parentsOf, armorTrack, isInFight, itemMinutes, MINUTE, classOf, classRankOf, classTrack, EFFECT_LABEL,
  highestGrade, ITEM_EFFECTS, KEY_LABELS, partyOf, placeById, WEAPON_TYPES, weaponTrack,
  CRAFT_LABEL, CRAFT_SHORT, PROFESSION_MAX_LEVEL, professionExpToNext, projectRpgStats, RPG_CLASSES, RPG_TIER_MAX_LEVEL, rpgActiveSlots, umaLoadout,
  rpgExpToNext, rpgRework, rpgV2, SaveRuleError, skillText, umaBattleSheet, umaPoints, umaProfile, umaTrade, slotJobOf, ACCESSORY_KINDS, accessoryTrack, starsV1,
  isGrades, isStarMap, moonTemplate, starMapOf,
  type OwnedUma, type Place, type RosterOutfit, type TierWorld, type UmaUpgrades,
} from '@rpg/domain'
import { formatLevel } from '@luismlorenzana/uma-kit/roster'
import { ProfileFrame, UnlockConfirm } from '@luismlorenzana/uma-kit/places'
import { UiMark } from '@luismlorenzana/uma-kit/ui'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { seeStableOutfit } from '../../album/preferences'
import { umaUpgrades } from '../../album/upgrades'
import { Bar, CLASS_LABEL, kindLabel, WeaponGlyph } from '../../battle/labels'
import { ClassEmblem } from '../../battle/pixel-icons'
import { useHubNavigation } from '../../hub/navigation'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { loadSkills, type MasterView } from '../../master/master'
import { markTarget, unlock, useActiveTier, useOwnerTier, useWorld } from '../../save/game'
import { tradeLabel } from '../../save/trade'
import { HelpButton } from '../../ui/HelpButton'
import { BackIcon, TargetIcon, TicketIcon } from '../../ui/icons'
import { formatDuration, useNow } from '../../ui/useNow'
import { RankCells, RankRow } from '../../ui/RankBars'
import { pointText } from '../../items/planets'
import { GearCard } from './GearCard'
import { PresetButton } from './PresetButton'
import { SkillsPage } from './SkillsPage'
import { CallingCard, TemplateChip } from './TemplateCard'
import { racingTemplate } from './template-view'

const STAT_NAMES: Record<string, string> = { speed: 'Speed', stamina: 'Stamina', power: 'Power', guts: 'Guts', wit: 'Wit' }
const GRADE_COLORS: Record<string, string> = { S: '#f2c94c', A: '#f2994a', B: '#eb6fb0', C: '#7fb8ff', D: '#6fd39a', E: '#b8a6f0', F: '#a6b0bc', G: '#8a94a0' }
const TABS = ['skills', 'battle', 'gear', 'work', 'racing'] as const
type Tab = (typeof TABS)[number]
const TAB_LABEL: Record<Tab, string> = { skills: 'Skills', battle: 'Battle', gear: 'Gear', work: 'Work', racing: 'Racing' }
/** A tab's "Can upgrade" dot (H34): Gear while a piece or Extra Stats can (no skill costs points from engine v16, CP14). */
function tabDot(t: Tab, up: UmaUpgrades | null): { dot?: boolean; dotLabel?: string } {
  const on = !!up && t === 'gear' && (up.gear > 0 || up.stars > 0)
  return on ? { dot: true, dotLabel: `${TAB_LABEL[t]}, can upgrade` } : {}
}
const TAB_KEY = 'rpg.profile.tab.v2'

function storedTab(): Tab {
  try {
    const t = localStorage.getItem(TAB_KEY)
    return (TABS as readonly string[]).includes(t ?? '') ? (t as Tab) : 'skills'
  } catch {
    return 'skills'
  }
}

function GradeChip({ grade }: { grade: string }) {
  return (
    <span className="flex size-5 items-center justify-center rounded-full font-display text-[12px] font-bold text-accent-ink" style={{ background: GRADE_COLORS[grade] ?? '#999' }}>
      {grade}
    </span>
  )
}

/** A labelled row in a card. */
function Row({ label, value, note }: { label: string; value: React.ReactNode; note?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 text-[13px]">
      <span className="shrink-0 text-ink-soft">{label}</span>
      <span className="text-right">
        <span className="font-semibold">{value}</span>
        {note && <span className="text-ink-faint"> · {note}</span>}
      </span>
    </div>
  )
}

export function OutfitProfile({ view, outfitId, place }: { view: MasterView; outfitId: string; place: Place }) {
  const nav = useHubNavigation()
  const world = useWorld()
  const tier = useActiveTier()
  const home = useOwnerTier(outfitId)
  const outfit = view.roster.find((o) => o.outfitId === outfitId)
  useEffect(() => seeStableOutfit(view.roster.map(o => o.outfitId), outfitId), [view, outfitId])
  const owned = world?.umas[outfitId] ?? null
  const bust = useArtUrl(outfit ? imagePath(view.art, 'outfit-busts', outfit.outfitId) ?? imagePath(view.art, 'outfit-portraits', outfit.outfitId) : null)
  const [tab, setTabState] = useState<Tab>(storedTab)
  const setTab = (t: Tab) => {
    setTabState(t)
    try {
      localStorage.setItem(TAB_KEY, t)
    } catch {
      // per-device convenience only
    }
  }

  if (!outfit) {
    return (
      <div className="p-4">
        <p className="mb-3 text-ink-soft">That outfit isn’t in the current game data.</p>
        <button type="button" onClick={() => nav.subBack(place)} className="min-h-11 rounded-sm bg-raised px-4 font-semibold">Back to the Stable</button>
      </div>
    )
  }
  const shown: Tab = owned ? tab : 'racing'
  const upgrades = owned && world ? umaUpgrades(world, outfit, tier) : null
  return (
    <div>
      <div className="px-4 pt-2">
        <button type="button" onClick={() => nav.subBack(place)} className="-ml-2 flex min-h-11 items-center gap-1 px-2 text-[14px] font-semibold text-ink-soft">
          <BackIcon size={18} /> All outfits
        </button>
      </div>
      {/* The kit's frame (uma-platform P56, SD3): portrait, name, level and chips, this game's summary, then its tabs. */}
      <ProfileFrame<Tab>
        portrait={bust ? <img src={bust} alt="" className="size-full object-cover object-top" /> : <AtlasSprite art={view.art} family="outfit-icons" frameKey={outfit.outfitId} size={112} />}
        name={outfit.name}
        title={outfit.title}
        level={owned ? <>{formatLevel(owned.level)}<span className="ml-1.5 text-[12px] font-semibold text-ink-faint">Uma Level</span></> : undefined}
        chips={<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-[12px] font-semibold text-accent">{'★'.repeat(outfit.rarity)}</p>
          <TemplateChip outfit={outfit} uma={owned} classId={owned ? activeClass(outfit, owned) : null} />
        </div>}
        corner={owned && world ? <TargetToggle outfitId={outfit.outfitId} on={world.targets.includes(outfit.outfitId)} /> : undefined}
        locked={!owned}
        summary={owned && world ? <Summary outfit={outfit} owned={owned} world={world} onClass={() => setTab('skills')} />
          : home !== null ? <ElsewhereNote text={`In Tier ${home}`} />
          : tier > 1 ? <ElsewhereNote text="Unlocked in Tier 1" />
          : <UnlockBox outfit={outfit} tickets={world?.wallet.unlockTickets ?? 0} />}
        tabs={owned && world ? TABS.map((t) => ({ key: t, label: TAB_LABEL[t], ...tabDot(t, upgrades) })) : undefined}
        tab={owned && world ? shown : undefined}
        onTab={setTab}
      >
        {owned && world ? (
          <>
            {shown === 'skills' && <SkillsTab outfit={outfit} uma={owned} world={world} />}
            {shown === 'battle' && <BattleTab outfit={outfit} uma={owned} world={world} onClass={() => setTab('skills')} />}
            {shown === 'gear' && <GearTab outfit={outfit} uma={owned} world={world} upgrades={upgrades} />}
            {shown === 'work' && <WorkTab outfit={outfit} uma={owned} world={world} />}
            {shown === 'racing' && <RacingTab view={view} outfit={outfit} uma={owned} />}
          </>
        ) : <RacingTab view={view} outfit={outfit} uma={null} />}
      </ProfileFrame>
    </div>
  )
}

/** Marks her as a target: the facilities list what maxing her takes (D100). */
function TargetToggle({ outfitId, on }: { outfitId: string; on: boolean }) {
  const [error, setError] = useState<string | null>(null)
  return (
    <span className="relative -mr-1 -mt-2">
      <button type="button" aria-pressed={on} onClick={() => markTarget(outfitId, !on).then(() => setError(null), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))}
        className={`flex min-h-9 items-center gap-1 rounded-full px-2.5 text-[12px] font-semibold ${on ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'}`}>
        <TargetIcon size={14} /> {on ? 'Target' : 'Mark target'}
      </button>
      {error && <span className="absolute right-0 top-full z-10 mt-1 w-48 rounded-sm bg-danger/90 p-1.5 text-right text-[11px] text-white">{error}</span>}
    </span>
  )
}

/** Under the header: her Uma EXP and the class she fights as, then her Craft Level and what she's up to. */
function Summary({ outfit, owned, world, onClass }: { outfit: RosterOutfit; owned: OwnedUma; world: TierWorld; onClass: () => void }) {
  const navigate = useNavigate()
  const now = useNow(30_000)
  const next = owned.level < RPG_TIER_MAX_LEVEL ? rpgExpToNext(owned.level) : null
  const work = slotJobOf(world, outfit.outfitId, now)
  const party = partyOf(world, outfit.outfitId)
  const fighting = isInFight(world, outfit.outfitId)
  return (
    <section className="space-y-3">
      <div>
        <Bar value={next ? owned.exp : 1} max={next ?? 1} tone="exp" />
        <p className="mt-0.5 text-[11px] text-ink-faint">{next ? `${owned.exp} / ${next} EXP` : `Max level · ${owned.exp} EXP banked`}</p>
        <CallingCard outfit={outfit} uma={owned} />
        <ClassChip outfit={outfit} uma={owned} onClick={onClass} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-raised p-2">
          <p className="text-[11px] font-semibold text-ink-soft">{CRAFT_LABEL}</p>
          <p className="font-display text-xl font-bold leading-tight">{owned.craft.level}</p>
          <p className="text-[10.5px] text-ink-faint">Grade {highestGrade(owned.craft.level)} open</p>
        </div>
        <button type="button" className="rounded-md bg-raised p-2 text-left active:bg-white/5"
          onClick={() => (work ? navigate(`/${placeById(work.placeId)!.page}/${work.placeId}`, { state: { fromHub: true } })
            : navigate(party ? `/town/party-hall/${party.party + 1}` : '/town/party-hall', { state: { fromHub: true } }))}>
          <p className="text-[11px] font-semibold text-ink-soft">{work ? 'Working' : fighting ? 'Fighting' : 'Party'}</p>
          <p className="truncate text-[13px] font-semibold text-accent">{work ? placeById(work.placeId)?.name : party ? world.parties[party.party]?.name : 'None · add'}</p>
          <p className="truncate text-[10.5px] text-ink-faint">
            {work ? (work.done ? 'Done · collect' : formatDuration(work.endsAt - Date.parse(now))) : fighting ? 'Open fight' : 'Free'}
          </p>
        </button>
      </div>
    </section>
  )
}

/** A locked outfit: Unlock for an Uma Ticket, through the kit's confirm (SD3). */
/** An outfit this world doesn't own: where she lives, or where Umas are unlocked (D5). */
function ElsewhereNote({ text }: { text: string }) {
  return <p className="flex min-h-12 items-center justify-center rounded-sm bg-raised text-center font-display text-base font-bold text-ink-soft">{text}</p>
}

function UnlockBox({ outfit, tickets }: { outfit: RosterOutfit; tickets: number }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <section className="space-y-1.5">
      <button type="button" disabled={tickets < 1} onClick={() => setConfirming(true)}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-accent font-display text-base font-bold text-accent-ink disabled:opacity-40">
        <TicketIcon size={20} /> Unlock · 1 Ticket
      </button>
      <p className="text-center text-[12px] text-ink-faint">
        {tickets > 0 ? `${tickets} Uma Tickets left` : 'No Uma Tickets left'}
      </p>
      <UnlockConfirm open={confirming} onClose={() => setConfirming(false)} name={outfit.title ?? outfit.name} tickets={tickets}
        ticketMark={<UiMark mark="currency/uma-ticket" fallback={<TicketIcon size={16} />} />}
        onConfirm={() => unlock(outfit).then(() => setConfirming(false), (err: unknown) => {
          throw new Error(err instanceof SaveRuleError ? err.message : 'Could not unlock.')
        })} />
    </section>
  )
}

// --- Battle: her RPG stats as she fights now ---------------------------------------------------------------------

function BattleTab({ outfit, uma, world, onClass }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; onClass: () => void }) {
  const tier = useActiveTier()
  const classId = activeClass(outfit, uma)
  const base = projectRpgStats(umaProfile(outfit, uma, tier, classId))
  // Every battle stat, always listed (combat-balance.md §6.0): the domain builds the sheet, so a rule change shows here.
  const sheet = umaBattleSheet(outfit, uma, classId, tier)
  const equipped = umaLoadout(outfit, uma, tier, classId)
  const party = partyOf(world, outfit.outfitId)
  return (
    <div className="space-y-3">
      <button type="button" onClick={onClass} className="flex min-h-12 w-full items-center justify-between rounded-md bg-raised px-3 text-left">
        <span>
          <span className="block text-[11px] text-ink-faint">Fights as</span>
          <span className="block text-[14px] font-semibold">{CLASS_LABEL[classId]}</span>
        </span>
        <span className="text-[12px] text-ink-soft">{equipped.length}/{rpgActiveSlots(uma.level)} skills · {party ? world.parties[party.party]?.name : 'no party'}</span>
      </button>
      {sheet.map((group, i) => (
        <section key={group.title} className="rounded-md bg-raised">
          <div className="-mb-2 flex items-center gap-2 pl-3 text-[11px] text-ink-faint">
            <span className="flex-1">{group.title}</span>
            {i === 0 && (
              <>
                <span className="text-shard">Gear</span>
                <span className="text-success">Extra Stats</span>
                <HelpButton title="Battle stats">
                  {/* Classes v2 (H59): Guts into HP, flat Orbs in the Damage slot, healers from ATK or M.ATK. */}
                  <p>Her core stats grow by level and set her battle stats: Speed gives ATK and M.ATK, {rpgV2() ? 'Stamina, Power and Guts HP' : 'Stamina and Power HP'}, Wit MP, Power DEF, and Power and Wit M.DEF. Her class leans them.</p>
                  <p>The total comes first; in brackets, what her gear adds (blue) and what her active Extra Stats add (green). Armor adds up: physical pieces ATK, magical pieces M.ATK, and each slot its defensive stat.</p>
                  {rpgV2() ? <>
                    <p>Might is each weapon's own: it counts only for hits made with that weapon. Her Damage slot's Orb adds offense to every hit of its kind; her Support slot's Talisman or Amulet a defensive effect.</p>
                    <p>A Paladin's mends and Barriers grow with her ATK, a Cleric's with her M.ATK. Speed points give evasion; Limit points a head start on the Limit Break gauge.</p>
                  </> : <p>Might is each weapon's own: it counts only for hits made with that weapon. Her two accessories add an Orb's kind to her hits, or a defensive effect. Speed points give evasion; Limit points a head start on the Limit Break gauge.</p>}
                </HelpButton>
              </>
            )}
          </div>
          <div className="divide-y divide-hairline pt-2">
            {group.rows.map((r) => (
              <Row key={r.label} label={r.label} note={r.note} value={
                <span className="tabular-nums">
                  <span className={r.gear === undefined ? '' : 'font-display'}>{r.value}</span>
                  {(!!r.gear || !!r.extra || !!r.star) && (
                    <span className="font-normal text-ink-faint">
                      {' ('}{!!r.gear && <span className="text-shard">+{r.gear}</span>}{!!r.gear && (!!r.extra || !!r.star) && ' '}
                      {!!r.extra && <span className="text-success">+{r.star ? r.extra - r.star : r.extra}</span>}{!!r.star && <span className="text-success"> ★ +{r.star}</span>})
                    </span>
                  )}
                </span>
              } />
            ))}
          </div>
        </section>
      ))}
      <section className="rounded-md bg-raised">
        <p className="px-3 pt-2 text-[11px] text-ink-faint">Core stats</p>
        <div className="grid grid-cols-5 gap-1 p-2 text-center">
          {STATS.map((s) => (
            <span key={s} className="rounded-xs bg-panel py-1">
              <span className="block text-[10px] text-ink-faint">{STAT_NAMES[s]}</span>
              <span className="font-display text-[14px] font-bold tabular-nums">{base[s]}</span>
            </span>
          ))}
        </div>
      </section>
      <p className="text-[11px] text-ink-faint">Unlocked {new Date(uma.unlockedAt).toLocaleDateString()}.</p>
    </div>
  )
}

// --- Skills: class, weapons, trees (D86), then every class's rank ------------------------------------------------

/** The class she fights as and its three weapons, under her level: one tap to the Skills tab. */
function ClassChip({ outfit, uma, onClick }: { outfit: RosterOutfit; uma: OwnedUma; onClick: () => void }) {
  const classId = activeClass(outfit, uma)
  const setup = classOf(uma, classId)
  const rank = classRankOf(uma.ranks, classId)
  return (
    <button type="button" onClick={onClick} className="mt-1.5 flex min-h-11 w-full items-center gap-1.5 rounded-sm bg-raised px-2 text-left text-[12.5px] font-semibold">
      <ClassEmblem classId={classId} />
      <span className="min-w-0 flex-1">
        <span className="block leading-tight">{CLASS_LABEL[classId]}</span>
        <span className="flex flex-wrap items-center gap-1 text-[10.5px] text-ink-soft">
          <span>Rank {rank}</span>
          <span className="inline-flex gap-0.5">{setup.weapons.map((w) => <WeaponGlyph key={w} weapon={w} size={12} />)}</span>
        </span>
      </span>
      <span className="shrink-0 text-ink-faint">›</span>
    </button>
  )
}

function SkillsTab({ outfit, uma, world }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld }) {
  return (
    <div className="space-y-4">
      <SkillsPage outfit={outfit} name={outfit.name} />
      <InheritanceCard outfitId={outfit.outfitId} uma={uma} world={world} />
      <section className="space-y-2 rounded-md bg-raised p-3">
        <p className="text-[11px] text-ink-faint">Class Ranks</p>
        {RPG_CLASSES.map((c) => <RankRow key={c} label={CLASS_LABEL[c]} kind="class" track={classTrack(uma.ranks, c)} />)}
      </section>
    </div>
  )
}

/** Her place in the Halls of Heroes (D106): her seat as a Hero, or her Heroes and every Bond she has made. */
function InheritanceCard({ outfitId, uma, world }: { outfitId: string; uma: OwnedUma; world: TierWorld }) {
  const navigate = useNavigate()
  const seat = heroSeatOf(world, outfitId)
  const parents = parentsOf(world, outfitId)
  const bonds = HERO_LIMIT_IDS.filter((id) => uma.bonds[id] || parents.includes(id))
  const hall = (id: (typeof HERO_LIMIT_IDS)[number]) => () => navigate(`/learning/${HERO_HALLS[heroLimitClass(id)]}`, { state: { fromHub: true } })
  return (
    <section className="space-y-1.5 rounded-md bg-raised p-3">
      <p className="text-[11px] text-ink-faint">Inheritance</p>
      {seat ? (
        <button type="button" onClick={hall(seat)} className="block w-full text-left text-[13px]">
          <span className="font-semibold">Hero</span> of the {CLASS_LABEL[heroLimitClass(seat)]} Hall · her Limit Break is always {heroLimit(seat).name}
          <span className="block text-ink-soft">Bond with her seat {(uma.bonds[seat] ?? { level: 0 }).level}/{BOND_MAX_LEVEL} ›</span>
        </button>
      ) : (
        <>
          {parents.length === 0 && (
            <p className="text-[13px] text-ink-soft">No Limit Break: seat her as a Hero or a Learner in a Hall of Heroes, on the Learning page.</p>
          )}
          {bonds.map((id) => {
        const bond = uma.bonds[id] ?? { level: 0, exp: 0 }
        const now = parents.includes(id)
        return (
          <button key={id} type="button" onClick={hall(id)} className="flex w-full items-baseline justify-between gap-2 text-left text-[13px]">
            <span className="truncate">{heroLimit(id).name}{now ? '' : <span className="text-ink-faint"> · former Hero</span>}</span>
            <span className="shrink-0 text-ink-soft">Bond {bond.level}/{BOND_MAX_LEVEL} · {Math.round(bondCapacity(bond.level) * 100)}% ›</span>
          </button>
        )
          })}
        </>
      )}
    </section>
  )
}

// --- Gear: the standard preset (D164), what she wears, Weapon and Armor Ranks (D102), Extra Stats ----------------------

function GearTab({ outfit, uma, world, upgrades }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; upgrades: UmaUpgrades | null }) {
  const navigate = useNavigate()
  const tier = useActiveTier()
  const points = umaPoints(uma, activeClass(outfit, uma), tier as 1 | 2 | 3, moonTemplate(outfit, uma.calling.pick))
  const ready = isStarMap(uma.stars) ? (upgrades?.jewels.length ? `${upgrades.jewels.length} to set` : '')
    : [upgrades?.gems ? `${upgrades.gems} to set` : '', upgrades?.freeNodes ? `${upgrades.freeNodes} free` : ''].filter(Boolean).join(' · ')
  const map = starMapOf(uma)
  return (
    <div className="space-y-3">
      <PresetButton outfit={outfit} uma={uma} world={world} />
      <GearCard outfit={outfit} uma={uma} world={world} marked={isGrades(uma.gear) ? upgrades?.grades : upgrades?.gearSlots} />
      <button type="button" onClick={() => navigate(`/town/observatory/${outfit.outfitId}`, { state: { fromHub: true } })} className="w-full rounded-md bg-raised p-3 text-left">
        <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span className="text-[14px] font-semibold">Extra Stats</span>
            {ready && <span className="rounded-full bg-success px-1.5 text-[11px] font-bold text-ink-on-dark">{ready}</span>}
          </span>
          <span className="text-[12px] text-ink-soft">{isStarMap(uma.stars) ? `${map.open.length}/22 open` : `${starsV1(uma).active.length}/${activeNodeSlots(uma.level)} active · ${starsV1(uma).unlocked.length}/100`} · map ›</span>
        </span>
        <span className="mt-1 block text-[11px] text-ink-faint">
          Total with armor: {ITEM_EFFECTS.filter((e) => points[e]).map((e) => `${EFFECT_LABEL[e]} ${pointText(e, points[e])}`).join(' · ') || 'nothing yet'}
        </span>
      </button>
      {!isGrades(uma.gear) && <section className="space-y-2 rounded-md bg-raised p-3">
        <p className="text-[11px] text-ink-faint">Weapon Ranks</p>
        <RankCells label="Weapon Ranks" cells={WEAPON_TYPES.map((w) => ({ key: w, kind: 'weapon' as const, id: w, track: weaponTrack(uma.ranks, w) }))} />
        <p className="pt-1 text-[11px] text-ink-faint">Armor Ranks</p>
        <RankCells label="Armor Ranks" cells={ARMOR_KINDS.map((k) => ({ key: k, kind: 'armor' as const, id: k, track: armorTrack(uma.ranks, k) }))} />
        <p className="pt-1 text-[11px] text-ink-faint">Accessory Ranks</p>
        <RankCells label="Accessory Ranks" cells={ACCESSORY_KINDS.map((k) => ({ key: k, kind: 'accessory' as const, id: k, track: accessoryTrack(uma.ranks, k) }))} />
      </section>}
    </div>
  )
}

// --- Work: Craft Level and her job ---------------------------------------------------------------------------------

function WorkTab({ outfit, uma, world }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld }) {
  const navigate = useNavigate()
  const now = useNow()
  const work = slotJobOf(world, outfit.outfitId, now)
  const out = work ? outputView(work.output) : null
  return (
    <div className="space-y-3">
      {work && (
        <button type="button" onClick={() => navigate(`/${placeById(work.placeId)!.page}/${work.placeId}`, { state: { fromHub: true } })} className="flex w-full items-center gap-3 rounded-md bg-raised p-3 text-left">
          {out?.icon ? <ItemIcon id={out.icon} size={36} /> : <span className="size-9" />}
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] text-ink-faint">Working at {placeById(work.placeId)?.name}</span>
            <span className="block truncate text-[14px] font-semibold">{out?.name} · {work.finished}/{work.count}</span>
          </span>
          <span className="shrink-0 text-[12px] text-ink-soft">{work.done ? 'Done' : formatDuration(work.endsAt - Date.parse(now))}</span>
        </button>
      )}
      {[uma.craft].map((prof) => {
        const next = prof.level < PROFESSION_MAX_LEVEL ? professionExpToNext(prof.level) : null
        return (
          <section key="craft" className="rounded-md bg-raised p-3">
            <div className="flex items-baseline justify-between">
              {rpgRework('economy')
                ? <p className="text-[14px] font-semibold" data-craft-trade>Craft Lv <span className="font-display text-lg">{prof.level}</span> · {tradeLabel(umaTrade(outfit, uma.calling.pick))}</p>
                : <p className="text-[14px] font-semibold">{CRAFT_LABEL} <span className="font-display text-lg">{prof.level}</span></p>}
              <span className="text-[11px] text-ink-faint">10 gathered in {formatDuration(10 * itemMinutes(prof.level) * MINUTE)}</span>
            </div>
            <Bar className="mt-1.5" value={next ? prof.exp : 1} max={next ?? 1} tone="exp" />
            <p className="mt-1 text-[11px] text-ink-faint">
              {next ? `${prof.exp.toLocaleString('en-US')} / ${next.toLocaleString('en-US')} EXP` : 'Max level'} · grade {highestGrade(prof.level)} open
              {highestGrade(prof.level) < 10 ? ` · grade ${highestGrade(prof.level) + 1} at ${CRAFT_SHORT} Lv ${5 * (highestGrade(prof.level) + 1) - 4}` : ''}
            </p>
          </section>
        )
      })}
    </div>
  )
}

// --- Racing: the original's profile ---------------------------------------------------------------------------

function RacingTab({ view, outfit, uma }: { view: MasterView; outfit: RosterOutfit; uma: OwnedUma | null }) {
  const [unique, setUnique] = useState<{ name: string; description: string } | null | 'loading'>('loading')
  useEffect(() => {
    let live = true
    loadSkills(view.manifest).then((skills) => live && setUnique(skillText(skills, outfit.uniqueSkillId)), () => live && setUnique(null))
    return () => {
      live = false
    }
  }, [outfit, view.manifest])
  const groups = [
    { name: 'Surface', grades: outfit.aptitudes.surface as Record<string, string> },
    { name: 'Distance', grades: outfit.aptitudes.distance as Record<string, string> },
    { name: 'Style', grades: outfit.aptitudes.strategy as Record<string, string> },
  ]
  // UT14: her template's readings and Flourish, what her aptitudes do here.
  const template = racingTemplate(outfit, uma, uma ? activeClass(outfit, uma) : null)
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {groups.map((g) => (
          <div key={g.name}>
            <h4 className="text-micro mb-1">{g.name}</h4>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(g.grades).map(([key, grade]) => (
                <span key={key} className="flex items-center gap-1.5 rounded-full bg-raised py-0.5 pl-2.5 pr-1 text-[12px]">{KEY_LABELS[key] ?? key}<GradeChip grade={grade} /></span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <section>
        <h4 className="text-micro mb-1">Her template</h4>
        <div className="divide-y divide-hairline rounded-md bg-raised">
          {template.map((r) => <Row key={r.label} label={r.label} value={r.value} note={r.note} />)}
        </div>
      </section>
      <section>
        <h4 className="text-micro mb-1">Racing base stats · growth</h4>
        <table className="w-full text-[13px]">
          <tbody>
            {STATS.map((stat) => (
              <tr key={stat} className="border-b border-hairline last:border-0">
                <td className="py-1.5 text-ink-soft">{STAT_NAMES[stat]}</td>
                <td className="py-1.5 text-right font-display font-bold tabular-nums">{outfit.baseStats[stat]}</td>
                <td className="w-16 py-1.5 text-right tabular-nums text-ink-faint">{outfit.growthRatePercents[stat] ? `+${outfit.growthRatePercents[stat]}%` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h4 className="text-micro mb-1">Unique skill (racing)</h4>
        {unique === 'loading' ? <p className="text-[13px] text-ink-faint">Loading…</p> : unique ? (
          <div className="rounded-md bg-raised p-3">
            <p className="font-display font-bold">{unique.name}</p>
            <p className="text-[13px] text-ink-soft">{unique.description}</p>
          </div>
        ) : <p className="text-[13px] text-ink-faint">Not in the current game data.</p>}
      </section>
    </div>
  )
}
