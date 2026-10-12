// An outfit's profile (S1–S7, reorganised D60 and D77): a header with her Uma Level and EXP, the class she fights as,
// her Farm and Craft Levels and what she's doing now, then tabs: Skills (class, five weapons, skill trees, Class Ranks;
// first, as it changes most), Battle (her RPG stats), Gear (equipment, Weapon and Armor Ranks, Extra Stats), Work (professions and
// jobs) and Racing (the original's aptitudes, stats and unique skill). A locked outfit shows the Unlock flow and her
// racing profile.
import { STATS } from '@luismlorenzana/uma-data'
import {
  activeClass, activeNodeSlots, ARMOR_KINDS, BOND_MAX_LEVEL, bondCapacity, HERO_HALLS, HERO_LIMIT_IDS, heroLimit, heroLimitClass, heroSeatOf, parentsOf, armorTrack, isInFight, aptitudeTime, applyPoints, best, classOf, classRankOf, classTrack, DISTANCE_GEAR, EFFECT_LABEL,
  highestGrade, ITEM_EFFECTS, jobEndsAt, jobFinished, KEY_LABELS, partyOf, placeById, WEAPON_TYPES, weaponTrack,
  PROFESSION_LABEL, PROFESSION_MAX_LEVEL, PROFESSION_SHORT, professionExpToNext, projectRpgStats, RPG_CLASSES, RPG_TIER_MAX_LEVEL, rpgActiveSlots, umaLoadout,
  rpgExpToNext, rpgTreePointsEarned, rpgTreePointsSpent, SaveRuleError, skillText, STYLE_CLASSES, SURFACE_PROFESSION, umaPointParts, umaPoints, umaProfile, workOf,
  type OwnedUma, type Place, type Profession, type RosterOutfit, type TierWorld,
} from '@rpg/domain'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Bar, CLASS_LABEL, WeaponGlyph } from '../../battle/labels'
import { useHubNavigation } from '../../hub/navigation'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { AtlasSprite, imagePath, useArtUrl } from '../../master/art'
import { loadSkills, type MasterView } from '../../master/master'
import { markTarget, unlock, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { BackIcon, LockIcon, TargetIcon, TicketIcon } from '../../ui/icons'
import { formatDuration, useNow } from '../../ui/useNow'
import { RankCells, RankRow } from '../../ui/RankBars'
import { pointText } from '../observatory/ObservatoryPage'
import { GearCard } from './GearCard'
import { SkillsPage } from './SkillsPage'

const STAT_NAMES: Record<string, string> = { speed: 'Speed', stamina: 'Stamina', power: 'Power', guts: 'Guts', wit: 'Wit' }
const GRADE_COLORS: Record<string, string> = { S: '#f2c94c', A: '#f2994a', B: '#eb6fb0', C: '#7fb8ff', D: '#6fd39a', E: '#b8a6f0', F: '#a6b0bc', G: '#8a94a0' }
const TABS = ['skills', 'battle', 'gear', 'work', 'racing'] as const
type Tab = (typeof TABS)[number]
const TAB_LABEL: Record<Tab, string> = { skills: 'Skills', battle: 'Battle', gear: 'Gear', work: 'Work', racing: 'Racing' }
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
      <span className="text-ink-soft">{label}</span>
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
  const outfit = view.roster.find((o) => o.outfitId === outfitId)
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
  return (
    <div className="space-y-3 p-4">
      <button type="button" onClick={() => nav.subBack(place)} className="-ml-2 flex min-h-11 items-center gap-1 px-2 text-[14px] font-semibold text-ink-soft">
        <BackIcon size={18} /> All outfits
      </button>
      <Header view={view} outfit={outfit} owned={owned} world={world} bust={bust} onClass={() => setTab('skills')} />
      {owned && world ? (
        <>
          <div className="sticky top-0 z-10 -mx-4 bg-page/95 px-4 py-1.5 backdrop-blur">
            <div className="grid grid-cols-5 rounded-sm bg-sunken p-1" role="tablist" aria-label="Profile">
              {TABS.map((t) => (
                <button key={t} type="button" role="tab" aria-selected={shown === t} onClick={() => setTab(t)}
                  className={`min-h-10 rounded-xs text-[12.5px] font-semibold ${shown === t ? 'bg-raised text-ink shadow-2' : 'text-ink-faint'}`}>
                  {TAB_LABEL[t]}
                </button>
              ))}
            </div>
          </div>
          {shown === 'skills' && <SkillsTab outfit={outfit} uma={owned} world={world} />}
          {shown === 'battle' && <BattleTab outfit={outfit} uma={owned} world={world} onClass={() => setTab('skills')} />}
          {shown === 'gear' && <GearTab outfit={outfit} uma={owned} world={world} />}
          {shown === 'work' && <WorkTab outfit={outfit} uma={owned} world={world} />}
          {shown === 'racing' && <RacingTab view={view} outfit={outfit} />}
        </>
      ) : (
        <>
          <UnlockBox view={view} outfit={outfit} tickets={world?.wallet.unlockTickets ?? 0} />
          <RacingTab view={view} outfit={outfit} />
        </>
      )}
    </div>
  )
}

/** Art, name, the big Uma Level with its EXP and the class she fights as, then Farm and Craft Levels and what she's up to. */
/** Marks her as a farming target: the facilities list what maxing her takes (D100). */
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

function Header({ view, outfit, owned, world, bust, onClass }: { view: MasterView; outfit: RosterOutfit; owned: OwnedUma | null; world: TierWorld | null; bust: string | null; onClass: () => void }) {
  const navigate = useNavigate()
  const now = useNow(30_000)
  const next = owned && owned.level < RPG_TIER_MAX_LEVEL ? rpgExpToNext(owned.level) : null
  const work = owned && world ? workOf(world, outfit.outfitId) : null
  const party = owned && world ? partyOf(world, outfit.outfitId) : null
  const fighting = owned && world ? isInFight(world, outfit.outfitId) : false
  return (
    <section className="space-y-3">
      <div className="flex items-end gap-3">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-md bg-raised">
          {bust ? <img src={bust} alt="" className={`size-full object-cover object-top ${owned ? '' : 'opacity-70 saturate-50'}`} />
            : <AtlasSprite art={view.art} family="outfit-icons" frameKey={outfit.outfitId} size={112} />}
          {!owned && <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[11px] text-locked"><LockIcon size={11} /> Locked</span>}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[12px] font-semibold text-accent">{'★'.repeat(outfit.rarity)}</p>
            {owned && world && <TargetToggle outfitId={outfit.outfitId} on={world.targets.includes(outfit.outfitId)} />}
          </div>
          <h3 className="text-xl leading-tight">{outfit.name}</h3>
          {outfit.title && <p className="truncate text-[13px] text-ink-soft">{outfit.title}</p>}
          {owned && (
            <div className="mt-1.5">
              <p className="font-display text-[26px] font-extrabold leading-none">Lv {owned.level}<span className="ml-1.5 text-[12px] font-semibold text-ink-faint">Uma Level</span></p>
              <Bar className="mt-1.5" value={next ? owned.exp : 1} max={next ?? 1} tone="exp" />
              <p className="mt-0.5 text-[11px] text-ink-faint">{next ? `${owned.exp} / ${next} EXP` : `Max level · ${owned.exp} EXP banked`}</p>
              <ClassChip outfit={outfit} uma={owned} onClick={onClass} />
            </div>
          )}
        </div>
      </div>
      {owned && (
        <div className="grid grid-cols-3 gap-2">
          {(['farming', 'gathering'] as const).map((p) => (
            <div key={p} className={`rounded-md p-2 ${p === 'farming' ? 'bg-[#2c3a26]' : 'bg-[#3a3026]'}`}>
              <p className="text-[11px] font-semibold text-ink-soft">{PROFESSION_LABEL[p]}</p>
              <p className="font-display text-xl font-bold leading-tight">{owned.professions[p].level}</p>
              <p className="text-[10.5px] text-ink-faint">Grade {highestGrade(owned.professions[p].level)} open</p>
            </div>
          ))}
          <button type="button" className="rounded-md bg-raised p-2 text-left active:bg-white/5"
            onClick={() => (work ? navigate(`/${placeById(work.placeId)!.page}/${work.placeId}`, { state: { fromHub: true } })
              : navigate(party ? `/town/party-hall/${party.party + 1}` : '/town/party-hall', { state: { fromHub: true } }))}>
            <p className="text-[11px] font-semibold text-ink-soft">{work ? 'Working' : fighting ? 'Fighting' : 'Party'}</p>
            <p className="truncate text-[13px] font-semibold text-accent">{work ? placeById(work.placeId)?.name : party ? world?.parties[party.party]?.name : 'None · add'}</p>
            <p className="truncate text-[10.5px] text-ink-faint">
              {work ? (jobFinished(work.job, now) >= work.job.count ? 'Done · collect' : formatDuration(jobEndsAt(work.job) - Date.parse(now))) : fighting ? 'Open fight' : 'Free'}
            </p>
          </button>
        </div>
      )}
    </section>
  )
}

function UnlockBox({ view, outfit, tickets }: { view: MasterView; outfit: RosterOutfit; tickets: number }) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  return (
    <section className="space-y-1.5">
      <button type="button" disabled={tickets < 1} onClick={() => setConfirming(true)}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-accent font-display text-base font-bold text-accent-ink disabled:opacity-40">
        <TicketIcon size={20} /> Unlock · 1 Ticket
      </button>
      <p className="text-center text-[12px] text-ink-faint">
        {tickets > 0 ? `${tickets} Unlock Tickets left` : 'No Unlock Tickets left'}
      </p>
      {confirming && (
        <BottomSheet title={`Unlock ${outfit.name}?`} onClose={() => setConfirming(false)} footer={
          <div className="flex gap-2">
            <button type="button" onClick={() => setConfirming(false)} className="min-h-12 flex-1 rounded-sm border border-hairline-strong font-semibold text-ink-soft">Not now</button>
            <button type="button" onClick={() => unlock(outfit.outfitId).then(() => { setConfirming(false); setError(null) }, (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Could not unlock.'))}
              className="min-h-12 flex-[2] rounded-sm bg-accent font-display font-bold text-accent-ink">Unlock for 1 Ticket</button>
          </div>
        }>
          <div className="flex items-center gap-3">
            <AtlasSprite art={view.art} family="outfit-icons" frameKey={outfit.outfitId} size={64} />
            <div className="text-[14px]">
              <p className="font-semibold">{outfit.title ?? outfit.name}</p>
              <p className="text-ink-soft">{tickets} → {tickets - 1} Unlock Tickets. Unlocking is final.</p>
            </div>
          </div>
          {error && <p className="mt-3 text-[13px] text-danger">{error}</p>}
        </BottomSheet>
      )}
    </section>
  )
}

// --- Battle: her RPG stats as she fights now ---------------------------------------------------------------------

function BattleTab({ outfit, uma, world, onClass }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; onClass: () => void }) {
  const classId = activeClass(outfit, uma)
  const base = projectRpgStats(umaProfile(outfit, uma, 1, classId))
  const parts = umaPointParts(uma, classId)
  const boosted = applyPoints(base, umaPoints(uma, classId))
  // What gear adds alone; Extra Stats are the rest of the total, so the two always add up (D99).
  const geared = applyPoints(base, parts.gear).stats
  const equipped = umaLoadout(outfit, uma, 1, classId)
  const party = partyOf(world, outfit.outfitId)
  const keys = [['HP', 'hp'], ['MP', 'mp'], ['ATK', 'atk'], ['M.ATK', 'matk'], ['DEF', 'pdef'], ['M.DEF', 'mdef']] as const
  const rows = keys.map(([label, k]) => ({ label, now: boosted.stats[k], gear: geared[k] - base[k], extra: boosted.stats[k] - geared[k] }))
  return (
    <div className="space-y-3">
      <button type="button" onClick={onClass} className="flex min-h-12 w-full items-center justify-between rounded-md bg-raised px-3 text-left">
        <span>
          <span className="block text-[11px] text-ink-faint">Fights as</span>
          <span className="block text-[14px] font-semibold">{CLASS_LABEL[classId]}</span>
        </span>
        <span className="text-[12px] text-ink-soft">{equipped.length}/{rpgActiveSlots(uma.level)} skills · {party ? world.parties[party.party]?.name : 'no party'}</span>
      </button>
      <section className="rounded-md bg-raised">
        <div className="-mb-2 flex items-center gap-2 pl-3 text-[11px] text-ink-faint">
          <span className="flex-1">Battle stats</span>
          <span className="text-shard">Gear</span>
          <span className="text-success">Extra Stats</span>
          <HelpButton title="Battle stats">
            <p>Her core stats grow by level and set her battle stats: Speed gives ATK and M.ATK, Stamina and Power HP, Wit MP, Power DEF, and Power and Wit M.DEF. Her class leans them.</p>
            <p>The total comes first; in brackets, what her gear adds (blue) and what her active Extra Stats add (green), 1.5% a point. Training weapons add nothing. Speed points give evasion; Limit points a head start on the Limit Break gauge.</p>
          </HelpButton>
        </div>
        <div className="divide-y divide-hairline">
          {rows.map((r) => (
            <Row key={r.label} label={r.label} value={
              <span className="tabular-nums">
                <span className="font-display">{r.now}</span>
                {(r.gear > 0 || r.extra > 0) && (
                  <span className="font-normal text-ink-faint">
                    {' ('}{r.gear > 0 && <span className="text-shard">+{r.gear}</span>}{r.gear > 0 && r.extra > 0 && ' '}{r.extra > 0 && <span className="text-success">+{r.extra}</span>})
                  </span>
                )}
              </span>
            } />
          ))}
          <Row label="Evasion" value={`${(boosted.evasion / 10).toFixed(1)}%`} note="from Speed" />
          <Row label="Limit Break head start" value={`${boosted.limitStart} / 12`} />
        </div>
      </section>
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

/** The class she fights as and its five weapons, under her level: one tap to the Skills tab. */
function ClassChip({ outfit, uma, onClick }: { outfit: RosterOutfit; uma: OwnedUma; onClick: () => void }) {
  const classId = activeClass(outfit, uma)
  const setup = classOf(uma, classId)
  const rank = classRankOf(uma.ranks, classId)
  const points = rpgTreePointsEarned(rank) - rpgTreePointsSpent(setup.tree.map((id) => ({ tier: 1, id })))
  return (
    <button type="button" onClick={onClick} className="mt-1.5 flex min-h-9 w-full items-center gap-1.5 rounded-sm bg-raised px-2 text-left text-[12.5px] font-semibold">
      <span className="min-w-0 flex-1 truncate">{CLASS_LABEL[classId]} · Rank {rank}</span>
      <span className="flex shrink-0 gap-0.5">{setup.weapons.map((w) => <WeaponGlyph key={w} weapon={w} size={12} />)}</span>
      {points > 0 && <span className="shrink-0 rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-ink">{points} pts</span>}
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
          <span className="font-semibold">Hero</span> of the {CLASS_LABEL[heroLimitClass(seat)]} Hall · her Limit Break is always {heroLimit(seat).name} ›
        </button>
      ) : bonds.length === 0 ? (
        <p className="text-[13px] text-ink-soft">Not learning under a Hero. Seat her as a Learner in a Hall of Heroes on the Learning page.</p>
      ) : bonds.map((id) => {
        const bond = uma.bonds[id] ?? { level: 0, exp: 0 }
        const now = parents.includes(id)
        return (
          <button key={id} type="button" onClick={hall(id)} className="flex w-full items-baseline justify-between gap-2 text-left text-[13px]">
            <span className="truncate">{heroLimit(id).name}{now ? '' : <span className="text-ink-faint"> · former Hero</span>}</span>
            <span className="shrink-0 text-ink-soft">Bond {bond.level}/{BOND_MAX_LEVEL} · {Math.round(bondCapacity(bond.level) * 100)}% ›</span>
          </button>
        )
      })}
    </section>
  )
}

// --- Gear: what she wears, Weapon and Armor Ranks (D102), Extra Stats -------------------------------------------------

function GearTab({ outfit, uma, world }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld }) {
  const navigate = useNavigate()
  const points = umaPoints(uma, activeClass(outfit, uma))
  return (
    <div className="space-y-3">
      <GearCard outfit={outfit} uma={uma} world={world} />
      <button type="button" onClick={() => navigate(`/town/observatory/${outfit.outfitId}`, { state: { fromHub: true } })} className="w-full rounded-md bg-raised p-3 text-left">
        <span className="flex items-center justify-between">
          <span className="text-[14px] font-semibold">Extra Stats</span>
          <span className="text-[12px] text-ink-soft">{uma.stars.active.length}/{activeNodeSlots(uma.level)} active · {uma.stars.unlocked.length}/100 · map ›</span>
        </span>
        <span className="mt-1 block text-[11px] text-ink-faint">
          Total with armor: {ITEM_EFFECTS.filter((e) => points[e]).map((e) => `${EFFECT_LABEL[e]} ${pointText(e, points[e])}`).join(' · ') || 'nothing yet'}
        </span>
      </button>
      <section className="space-y-2 rounded-md bg-raised p-3">
        <p className="text-[11px] text-ink-faint">Weapon Ranks</p>
        <RankCells label="Weapon Ranks" cells={WEAPON_TYPES.map((w) => ({ key: w, kind: 'weapon' as const, id: w, track: weaponTrack(uma.ranks, w) }))} />
        <p className="pt-1 text-[11px] text-ink-faint">Armor Ranks</p>
        <RankCells label="Armor Ranks" cells={ARMOR_KINDS.map((k) => ({ key: k, kind: 'armor' as const, id: k, track: armorTrack(uma.ranks, k) }))} />
      </section>
    </div>
  )
}

// --- Work: Farm Level and Craft Level, and her job -----------------------------------------------------------------

function WorkTab({ outfit, uma, world }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld }) {
  const navigate = useNavigate()
  const now = useNow()
  const work = workOf(world, outfit.outfitId)
  const out = work ? outputView(work.job.output) : null
  const surface = (p: Profession) => (p === 'farming' ? outfit.aptitudes.surface.turf : outfit.aptitudes.surface.dirt)
  return (
    <div className="space-y-3">
      {work && (
        <button type="button" onClick={() => navigate(`/${placeById(work.placeId)!.page}/${work.placeId}`, { state: { fromHub: true } })} className="flex w-full items-center gap-3 rounded-md bg-raised p-3 text-left">
          {out?.icon ? <ItemIcon id={out.icon} size={36} /> : <span className="size-9" />}
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] text-ink-faint">Working at {placeById(work.placeId)?.name}</span>
            <span className="block truncate text-[14px] font-semibold">{out?.name} · {jobFinished(work.job, now)}/{work.job.count}</span>
          </span>
          <span className="shrink-0 text-[12px] text-ink-soft">{jobFinished(work.job, now) >= work.job.count ? 'Done' : formatDuration(jobEndsAt(work.job) - Date.parse(now))}</span>
        </button>
      )}
      {(['farming', 'gathering'] as const).map((p) => {
        const prof = uma.professions[p]
        const next = prof.level < PROFESSION_MAX_LEVEL ? professionExpToNext(prof.level) : null
        const grade = surface(p)
        return (
          <section key={p} className="rounded-md bg-raised p-3">
            <div className="flex items-baseline justify-between">
              <p className="text-[14px] font-semibold">{PROFESSION_LABEL[p]} <span className="font-display text-lg">{prof.level}</span></p>
              <span className="flex items-center gap-1 text-[11px] text-ink-faint">{p === 'farming' ? 'Turf' : 'Dirt'} <GradeChip grade={grade} /> ×{(1 / aptitudeTime(grade)).toFixed(1)} speed</span>
            </div>
            <Bar className="mt-1.5" value={next ? prof.exp : 1} max={next ?? 1} tone="exp" />
            <p className="mt-1 text-[11px] text-ink-faint">
              {next ? `${prof.exp.toLocaleString('en-US')} / ${next.toLocaleString('en-US')} EXP` : 'Max level'} · grade {highestGrade(prof.level)} open
              {highestGrade(prof.level) < 10 ? ` · grade ${highestGrade(prof.level) + 1} at ${PROFESSION_SHORT[p]} Lv ${5 * (highestGrade(prof.level) + 1) - 4}` : ''}
            </p>
          </section>
        )
      })}
    </div>
  )
}

// --- Racing: the original's profile ---------------------------------------------------------------------------

function RacingTab({ view, outfit }: { view: MasterView; outfit: RosterOutfit }) {
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
  const [style, styleGrade] = best(outfit.aptitudes.strategy)
  const [distance, distanceGrade] = best(outfit.aptitudes.distance)
  const [surface, surfaceGrade] = best(outfit.aptitudes.surface)
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
        <h4 className="text-micro mb-1">What her aptitudes do here</h4>
        <div className="divide-y divide-hairline rounded-md bg-raised">
          <Row label="Learns fastest" value={STYLE_CLASSES[style].join(' / ')} note={`${KEY_LABELS[style]} ${styleGrade}`} />
          <Row label="Masters fastest" value={DISTANCE_GEAR[distance].gear} note={`${KEY_LABELS[distance]} ${distanceGrade}`} />
          <Row label="Works fastest at" value={SURFACE_PROFESSION[surface]} note={`${KEY_LABELS[surface]} ${surfaceGrade}`} />
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
