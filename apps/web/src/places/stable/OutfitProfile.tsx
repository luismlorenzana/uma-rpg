// An outfit's profile (S1, extended in S2): art, aptitudes and what they do here, stats, unique skill, and either the
// Unlock flow (locked) or her state (owned: level, unlock date, party).
import { STATS } from '@luismlorenzana/uma-data'
import { best, DISTANCE_GEAR, KEY_LABELS, partyOf, SaveRuleError, skillText, STYLE_CLASSES, SURFACE_PROFESSION, type Place, type RosterOutfit } from '@rpg/domain'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useHubNavigation } from '../../hub/navigation'
import { AtlasSprite, imagePath, useArtUrl } from '../../master/art'
import { loadSkills, type MasterView } from '../../master/master'
import { unlock, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { BackIcon, LockIcon, TicketIcon } from '../../ui/icons'

const STAT_NAMES: Record<string, string> = { speed: 'Speed', stamina: 'Stamina', power: 'Power', guts: 'Guts', wit: 'Wit' }
const GRADE_COLORS: Record<string, string> = { S: '#f2c94c', A: '#f2994a', B: '#eb6fb0', C: '#7fb8ff', D: '#6fd39a', E: '#b8a6f0', F: '#a6b0bc', G: '#8a94a0' }

function Aptitudes({ outfit }: { outfit: RosterOutfit }) {
  const groups = [
    { name: 'Surface', grades: outfit.aptitudes.surface as Record<string, string> },
    { name: 'Distance', grades: outfit.aptitudes.distance as Record<string, string> },
    { name: 'Style', grades: outfit.aptitudes.strategy as Record<string, string> },
  ]
  return (
    <div className="space-y-2">
      {groups.map((g) => (
        <div key={g.name}>
          <h4 className="text-micro mb-1">{g.name}</h4>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(g.grades).map(([key, grade]) => (
              <span key={key} className="flex items-center gap-1.5 rounded-full bg-raised py-0.5 pl-2.5 pr-1 text-[12px]">
                {KEY_LABELS[key] ?? key}
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

/** Design §4.1: running style → class speed, distance → gear speed, surface → profession speed. */
function AptitudesAtWork({ outfit }: { outfit: RosterOutfit }) {
  const [style, styleGrade] = best(outfit.aptitudes.strategy)
  const [distance, distanceGrade] = best(outfit.aptitudes.distance)
  const [surface, surfaceGrade] = best(outfit.aptitudes.surface)
  const rows = [
    { label: 'Learns fastest', value: STYLE_CLASSES[style].join(' / '), note: `${KEY_LABELS[style]} ${styleGrade}` },
    { label: 'Masters fastest', value: DISTANCE_GEAR[distance].gear, note: `${KEY_LABELS[distance]} ${distanceGrade}` },
    { label: 'Works fastest at', value: SURFACE_PROFESSION[surface], note: `${KEY_LABELS[surface]} ${surfaceGrade}` },
  ]
  return (
    <section>
      <h4 className="text-micro mb-1">Aptitudes at work</h4>
      <div className="divide-y divide-hairline rounded-md bg-raised">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-3 px-3 py-2 text-[13px]">
            <span className="text-ink-soft">{r.label}</span>
            <span className="text-right">
              <span className="font-semibold">{r.value}</span> <span className="text-ink-faint">· {r.note}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function OutfitProfile({ view, outfitId, place }: { view: MasterView; outfitId: string; place: Place }) {
  const navigate = useNavigate()
  const nav = useHubNavigation()
  const world = useWorld()
  const outfit = view.roster.find((o) => o.outfitId === outfitId)
  const owned = world?.umas[outfitId] ?? null
  const tickets = world?.wallet.unlockTickets ?? 0
  const inParty = world && owned ? partyOf(world, outfitId) : null
  const bust = useArtUrl(outfit ? imagePath(view.art, 'outfit-busts', outfit.outfitId) ?? imagePath(view.art, 'outfit-portraits', outfit.outfitId) : null)
  const [unique, setUnique] = useState<{ name: string; description: string } | null | 'loading'>('loading')
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        <button type="button" onClick={() => nav.subBack(place)} className="min-h-11 rounded-sm bg-raised px-4 font-semibold">
          Back to the Stable
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <button type="button" onClick={() => nav.subBack(place)} className="-ml-2 flex min-h-11 items-center gap-1 px-2 text-[14px] font-semibold text-ink-soft">
        <BackIcon size={18} /> All outfits
      </button>
      <div className="flex items-end gap-3">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-md bg-raised">
          {bust ? (
            <img src={bust} alt="" className={`size-full object-cover object-top ${owned ? '' : 'opacity-70 saturate-50'}`} />
          ) : (
            <AtlasSprite art={view.art} family="outfit-icons" frameKey={outfit.outfitId} size={112} />
          )}
          {!owned && (
            <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[11px] text-locked">
              <LockIcon size={11} /> Locked
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-accent">{'★'.repeat(outfit.rarity)}</p>
          <h3 className="text-xl leading-tight">{outfit.name}</h3>
          {outfit.title && <p className="text-[13px] text-ink-soft">{outfit.title}</p>}
        </div>
      </div>

      {owned ? (
        <section className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md bg-raised p-2">
            <p className="text-micro">Level</p>
            <p className="font-display text-xl font-bold">{owned.level}</p>
          </div>
          <div className="rounded-md bg-raised p-2">
            <p className="text-micro">Unlocked</p>
            <p className="text-[13px] font-semibold">{new Date(owned.unlockedAt).toLocaleDateString()}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate(inParty ? `/town/party-hall/${inParty.party + 1}` : '/town/party-hall', { state: { fromHub: true } })}
            className="rounded-md bg-raised p-2 active:bg-white/5"
          >
            <p className="text-micro">Party</p>
            <p className="text-[13px] font-semibold text-accent">{inParty ? world?.parties[inParty.party]?.name : 'None · add'}</p>
          </button>
        </section>
      ) : (
        <section className="space-y-1.5">
          <button
            type="button"
            disabled={tickets < 1}
            onClick={() => setConfirming(true)}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-accent font-display text-base font-bold text-accent-ink disabled:opacity-40"
          >
            <TicketIcon size={20} /> Unlock · 1 Ticket
          </button>
          <p className="text-center text-[12px] text-ink-faint">
            {tickets > 0 ? `${tickets} Unlock Tickets left` : 'No tickets left: Umas earn Shards as they level (battles, S3); five Shards make a Ticket.'}
          </p>
        </section>
      )}

      <Aptitudes outfit={outfit} />
      <AptitudesAtWork outfit={outfit} />

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

      {confirming && (
        <BottomSheet
          title={`Unlock ${outfit.name}?`}
          onClose={() => setConfirming(false)}
          footer={
            <div className="flex gap-2">
              <button type="button" onClick={() => setConfirming(false)} className="min-h-12 flex-1 rounded-sm border border-hairline-strong font-semibold text-ink-soft">
                Not now
              </button>
              <button
                type="button"
                onClick={() => {
                  unlock(outfit.outfitId).then(
                    () => {
                      setConfirming(false)
                      setError(null)
                    },
                    (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Could not unlock.'),
                  )
                }}
                className="min-h-12 flex-[2] rounded-sm bg-accent font-display font-bold text-accent-ink"
              >
                Unlock for 1 Ticket
              </button>
            </div>
          }
        >
          <div className="flex items-center gap-3">
            <AtlasSprite art={view.art} family="outfit-icons" frameKey={outfit.outfitId} size={64} />
            <div className="text-[14px]">
              <p className="font-semibold">{outfit.title ?? outfit.name}</p>
              <p className="text-ink-soft">
                {tickets} → {tickets - 1} Unlock Tickets. Unlocking is final.
              </p>
            </div>
          </div>
          {error && <p className="mt-3 text-[13px] text-danger">{error}</p>}
        </BottomSheet>
      )}
    </div>
  )
}
