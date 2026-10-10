// The Stable (S1): every outfit from master data, all locked until S2, with a read-only profile per outfit.
import { STATS } from '@luismlorenzana/uma-data'
import { matchesSearch, skillText, type RosterOutfit } from '@rpg/domain'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { AtlasSprite, imagePath, useArtUrl } from '../master/art'
import { loadSkills, type MasterView } from '../master/master'
import { useGame } from '../save/game'
import { BackIcon, LockIcon, SearchIcon, TicketIcon } from '../ui/icons'
import { MasterGate } from './MasterGate'
import type { PlaceBodyProps } from './PlaceOverlay'

const STAT_NAMES: Record<string, string> = { speed: 'Speed', stamina: 'Stamina', power: 'Power', guts: 'Guts', wit: 'Wit' }
const GRADE_COLORS: Record<string, string> = { S: '#f2c94c', A: '#f2994a', B: '#eb6fb0', C: '#7fb8ff', D: '#6fd39a', E: '#b8a6f0', F: '#a6b0bc', G: '#8a94a0' }

function Skeleton() {
  return (
    <div className="grid grid-cols-4 gap-2 p-4 min-[400px]:grid-cols-5">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="aspect-square animate-pulse rounded-md bg-raised" />
      ))}
    </div>
  )
}

export default function StablePlace({ rest }: PlaceBodyProps) {
  const outfitId = rest.startsWith('outfit/') ? rest.slice('outfit/'.length) : null
  return <MasterGate skeleton={<Skeleton />}>{(view) => (outfitId ? <OutfitProfile view={view} outfitId={outfitId} /> : <StableGrid view={view} />)}</MasterGate>
}

function StableGrid({ view }: { view: MasterView }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const tickets = useGame((s) => s.save?.tierWorlds['1']?.wallet.unlockTickets ?? 0)
  const shown = useMemo(() => view.roster.filter((o) => matchesSearch(o, query)), [view.roster, query])
  return (
    <div>
      <div className="sticky top-0 z-10 space-y-2 border-b border-hairline bg-panel/95 p-3 backdrop-blur">
        <p className="flex items-center gap-1.5 text-[13px] text-ink-soft">
          <TicketIcon size={18} />
          <span className="font-semibold text-ink">{tickets} Unlock Tickets</span> · unlocking opens in S2
        </p>
        <label className="flex items-center gap-2 rounded-sm bg-sunken px-3">
          <SearchIcon size={18} className="text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${view.roster.length} outfits`}
            className="min-h-11 w-full bg-transparent text-ink outline-none placeholder:text-ink-faint"
            aria-label="Search outfits"
          />
        </label>
      </div>
      <ul className="grid grid-cols-4 gap-2 p-3 min-[400px]:grid-cols-5">
        {shown.map((o) => (
          <li key={o.outfitId} style={{ contentVisibility: 'auto', containIntrinsicSize: '96px' }}>
            <button
              type="button"
              onClick={() => navigate(`/town/stable/outfit/${o.outfitId}`, { state: { fromHub: true } })}
              className="flex w-full flex-col items-center gap-1 rounded-md p-1 text-center active:bg-white/5"
              aria-label={`${o.name}${o.title ? `, ${o.title}` : ''}, locked`}
            >
              <span className="relative">
                <AtlasSprite art={view.art} family="outfit-icons" frameKey={String(o.masterId)} size={60} className="opacity-60 grayscale-[35%]" />
                <span className="absolute bottom-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-locked">
                  <LockIcon size={12} />
                </span>
              </span>
              <span className="line-clamp-2 break-words text-[10.5px] font-semibold leading-tight text-ink-soft [overflow-wrap:anywhere]">{o.name}</span>
            </button>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="p-4 text-center text-ink-soft">No outfit matches “{query}”.</p>}
    </div>
  )
}

function Aptitudes({ outfit }: { outfit: RosterOutfit }) {
  const groups = [
    { name: 'Surface', grades: outfit.aptitudes.surface, labels: { turf: 'Turf', dirt: 'Dirt' } as Record<string, string> },
    { name: 'Distance', grades: outfit.aptitudes.distance, labels: { sprint: 'Sprint', mile: 'Mile', medium: 'Medium', long: 'Long' } as Record<string, string> },
    { name: 'Style', grades: outfit.aptitudes.strategy, labels: { front: 'Front', pace: 'Pace', late: 'Late', end: 'End' } as Record<string, string> },
  ]
  return (
    <div className="space-y-2">
      {groups.map((g) => (
        <div key={g.name}>
          <h4 className="text-micro mb-1">{g.name}</h4>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(g.grades).map(([key, grade]) => (
              <span key={key} className="flex items-center gap-1.5 rounded-full bg-raised py-0.5 pl-2.5 pr-1 text-[12px]">
                {g.labels[key] ?? key}
                <span className="flex size-5 items-center justify-center rounded-full font-display text-[12px] font-bold text-accent-ink" style={{ background: GRADE_COLORS[grade] ?? '#999' }}>
                  {grade}
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function OutfitProfile({ view, outfitId }: { view: MasterView; outfitId: string }) {
  const navigate = useNavigate()
  const outfit = view.roster.find((o) => o.outfitId === outfitId)
  const bust = useArtUrl(outfit ? imagePath(view.art, 'outfit-busts', outfit.outfitId) ?? imagePath(view.art, 'outfit-portraits', outfit.outfitId) : null)
  const [unique, setUnique] = useState<{ name: string; description: string } | null | 'loading'>('loading')
  useEffect(() => {
    let live = true
    if (!outfit) return
    loadSkills(view.manifest).then(
      (skills) => live && setUnique(skillText(skills, outfit.uniqueSkillId)),
      () => live && setUnique(null),
    )
    return () => {
      live = false
    }
  }, [outfit, view.manifest])
  if (!outfit) {
    return (
      <div className="p-4">
        <p className="mb-3 text-ink-soft">That outfit isn’t in the current game data.</p>
        <button type="button" onClick={() => navigate('/town/stable', { replace: true })} className="min-h-11 rounded-sm bg-raised px-4 font-semibold">
          Back to the Stable
        </button>
      </div>
    )
  }
  return (
    <div className="space-y-4 p-4">
      <button type="button" onClick={() => navigate('/town/stable', { replace: true })} className="-ml-2 flex min-h-11 items-center gap-1 px-2 text-[14px] font-semibold text-ink-soft">
        <BackIcon size={18} /> All outfits
      </button>
      <div className="flex items-end gap-3">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-md bg-raised">
          {bust ? <img src={bust} alt="" className="size-full object-cover object-top" /> : <AtlasSprite art={view.art} family="outfit-icons" frameKey={outfit.outfitId} size={112} />}
          <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[11px] text-locked">
            <LockIcon size={11} /> Locked
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-accent">{'★'.repeat(outfit.rarity)}</p>
          <h3 className="text-xl leading-tight">{outfit.name}</h3>
          {outfit.title && <p className="text-[13px] text-ink-soft">{outfit.title}</p>}
        </div>
      </div>
      <Aptitudes outfit={outfit} />
      <section>
        <h4 className="text-micro mb-1">Base stats · growth</h4>
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
        <h4 className="text-micro mb-1">Unique skill</h4>
        {unique === 'loading' ? (
          <p className="text-[13px] text-ink-faint">Loading…</p>
        ) : unique ? (
          <div className="rounded-md bg-raised p-3">
            <p className="font-display font-bold">{unique.name}</p>
            <p className="text-[13px] text-ink-soft">{unique.description}</p>
          </div>
        ) : (
          <p className="text-[13px] text-ink-faint">Not in the current game data.</p>
        )}
      </section>
    </div>
  )
}
