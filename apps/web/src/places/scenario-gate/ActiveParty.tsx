// The active party (D66): the five who fight, swappable from any world screen outside a fight. Each Uma shows her level
// and the MP she carries between stages (Springs refill it).
import {
  activeClass, applyPoints, classOf, isPartyFull, openFightOf, projectRpgStats, rpgCarriedMp, rpgTreePointsEarned,
  rpgTreePointsSpent, SaveRuleError, umaPoints, umaProfile, worldRun,
} from '@rpg/domain'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { Campaign } from '../../battle/campaign'
import { CLASS_LABEL } from '../../battle/labels'
import { ClassEmblem } from '../../battle/pixel-icons'
import { pagePath } from '../../hub/navigation'
import { FaceTile } from '@luismlorenzana/uma-kit/album'
import { formatLevel } from '@luismlorenzana/uma-kit/roster'
import { PickerStep } from '../../album/PickerStep'
import { activePartyRows } from '../../album/party-rows'
import { chooseActiveParty, useActiveTier, useWorld } from '../../save/game'

export function ActivePartyBar({ campaign }: { campaign: Campaign }) {
  const world = useWorld()
  const tier = useActiveTier()
  const navigate = useNavigate()
  const [picking, setPicking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  if (!world) return null
  const index = world.world.activeParty
  const party = world.parties[index]!
  const members = party.slots.filter((s): s is string => s !== null)
  const run = worldRun(world)
  const fighting = !!openFightOf(world)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <button type="button" disabled={fighting} onClick={() => setPicking(true)} className="flex min-h-9 items-center gap-1.5 rounded-full bg-raised px-3 text-[13px] font-semibold disabled:opacity-50">
          {party.name} <span className="font-normal text-ink-faint">· swap</span>
        </button>
        <button type="button" onClick={() => navigate(pagePath({ page: 'town', id: 'party-hall' }), { state: { fromPlace: true } })} className="min-h-11 px-2 text-[12px] text-ink-soft">Edit parties</button>
        {!isPartyFull(party) && <span className="text-[11px] text-danger">A fight needs five</span>}
      </div>
      <div className="flex gap-1">
        {members.map((id) => {
          const uma = world.umas[id]!
          const outfit = campaign.outfits.get(id)
          if (!outfit) return null
          const classId = activeClass(outfit, uma)
          const profile = umaProfile(outfit, uma, tier, classId)
          const points = umaPoints(uma, classId)
          const max = applyPoints(projectRpgStats(profile), points).stats.mp
          const mp = rpgCarriedMp(run, profile, points)
          const spare = rpgTreePointsEarned(uma.level) - rpgTreePointsSpent(classOf(uma, classId).tree.map((n) => ({ tier, id: n })))
          return (
            <button key={id} type="button" className="relative min-w-0 flex-1" title={CLASS_LABEL[classId]} aria-label={`${outfit.name}: ${CLASS_LABEL[classId]}, Lv ${uma.level}, MP ${mp} of ${max}`}
              onClick={() => navigate(pagePath({ page: 'town', id: 'stable' }, `outfit/${id}/skills`), { state: { fromPlace: true } })}>
              <span className="relative mx-auto block w-12">
                <FaceTile outfitId={id} size={48} label={outfit.name} round />
                <span className="absolute left-0 top-0 rounded-full bg-black/70 px-1 font-display text-[9px] font-bold leading-3.5">Lv {uma.level}</span>
                {spare > 0 && <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-page bg-accent" />}
              </span>
              <span className="mt-0.5 block h-1.5 overflow-hidden rounded-full bg-white/10">
                <span className="block h-full rounded-full bg-[#5aa6f0]" style={{ width: `${max > 0 ? (mp / max) * 100 : 0}%` }} />
              </span>
              <span className="mt-0.5 flex items-center justify-center gap-px">
                <ClassEmblem classId={classId} />
                <span className="min-w-0 font-display text-left text-[9px] leading-2.5 tracking-tight">{CLASS_LABEL[classId]}</span>
              </span>
            </button>
          )
        })}
      </div>
      {picking && <PickerStep title="Who fights?" rows={activePartyRows(campaign.view, world)}
        disabled={row => row.partyIndex === index ? 'Active party' : null}
        describe={row => `${row.members.length}/5 · ${formatLevel(row.level)}`}
        renderChips={row => row.members.map(id => <span key={id} className="w-5"><FaceTile outfitId={id} size={20} label={campaign.outfits.get(id)?.name ?? 'Uma'} round /></span>)}
        onClose={() => setPicking(false)}
        onPick={id => {
          const row = activePartyRows(campaign.view, world).find(row => row.id === id)
          if (row) void chooseActiveParty(row.partyIndex).then(() => setPicking(false), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t switch.'))
        }} />}
      {error && <p className="text-[13px] text-danger">{error}</p>}
    </div>
  )
}
