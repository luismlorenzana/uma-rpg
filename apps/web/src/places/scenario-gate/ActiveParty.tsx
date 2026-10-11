// The active party (D66): the five who fight, swappable from any world screen outside a fight. Each Uma shows her level
// and the MP she carries between stages (Springs refill it).
import {
  activeBuild, applyPoints, buildOf, isBusy, isPartyFull, openFightOf, projectRpgStats, RPG_BUILD, rpgCarriedMp, rpgTreePointsEarned,
  rpgTreePointsSpent, SaveRuleError, umaPoints, umaProfile, worldRun,
} from '@rpg/domain'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { Campaign } from '../../battle/campaign'
import { BUILD_LABEL } from '../../battle/labels'
import { pagePath } from '../../hub/navigation'
import { AtlasSprite } from '../../master/art'
import { chooseActiveParty, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'

export function ActivePartyBar({ campaign }: { campaign: Campaign }) {
  const world = useWorld()
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
        {!isPartyFull(party) && <span className="text-[11px] text-danger">A fight needs five</span>}
      </div>
      <div className="flex gap-1.5">
        {members.map((id) => {
          const uma = world.umas[id]!
          const outfit = campaign.outfits.get(id)
          if (!outfit) return null
          const build = activeBuild(outfit, uma)
          const profile = umaProfile(outfit, uma, 1, build)
          const points = umaPoints(uma, build)
          const max = applyPoints(projectRpgStats(profile), points).stats.mp
          const mp = rpgCarriedMp(run, profile, points)
          const spare = rpgTreePointsEarned(uma.level) - rpgTreePointsSpent(buildOf(uma, build).tree.map((n) => ({ tier: 1, id: n })))
          return (
            <button key={id} type="button" className="relative w-12" title={BUILD_LABEL[build]} aria-label={`${outfit.name}: Lv ${uma.level}, MP ${mp} of ${max}`}
              onClick={() => navigate(pagePath({ page: 'town', id: 'stable' }, `outfit/${id}/skills`), { state: { fromPlace: true } })}>
              <AtlasSprite art={campaign.view.art} family="outfit-icons" frameKey={id} size={48} className={isBusy(world, id) ? 'opacity-40 grayscale' : ''} />
              <span className="absolute left-0 top-0 rounded-full bg-black/70 px-1 font-display text-[9px] font-bold leading-3.5">{isBusy(world, id) ? 'Busy' : `Lv ${uma.level}`}</span>
              {spare > 0 && <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-page bg-accent" />}
              <span className="mt-0.5 block h-1.5 overflow-hidden rounded-full bg-white/10">
                <span className="block h-full rounded-full bg-[#5aa6f0]" style={{ width: `${max > 0 ? (mp / max) * 100 : 0}%` }} />
              </span>
            </button>
          )
        })}
      </div>
      {picking && (
        <BottomSheet title="Who fights?" onClose={() => setPicking(false)}>
          <ul className="space-y-1.5">
            {world.parties.map((p, i) => {
              const ids = p.slots.filter((s): s is string => s !== null)
              if (ids.length === 0) return null
              return (
                <li key={i}>
                  <button type="button" onClick={() => chooseActiveParty(i).then(() => setPicking(false), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t switch.'))}
                    className={`flex w-full items-center gap-2 rounded-sm p-2 text-left ${i === index ? 'bg-accent/20 ring-1 ring-accent' : 'bg-raised'}`}>
                    <span className="w-20 shrink-0 truncate text-[13px] font-semibold">{p.name}</span>
                    <span className="flex flex-1 gap-1">{ids.map((id) => <AtlasSprite key={id} art={campaign.view.art} family="outfit-icons" frameKey={id} size={30} />)}</span>
                    {!isPartyFull(p) && <span className="text-[11px] text-ink-faint">{ids.length}/5</span>}
                  </button>
                </li>
              )
            })}
          </ul>
          <button type="button" onClick={() => navigate(pagePath({ page: 'town', id: 'party-hall' }), { state: { fromPlace: true } })} className="mt-3 min-h-11 w-full rounded-sm border border-hairline-strong text-[13px] font-semibold">
            Edit parties in the Party Hall
          </button>
          {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
        </BottomSheet>
      )}
    </div>
  )
}
