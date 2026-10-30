// A front's guided weapons for the chosen party (the Tier rework's R1, engine v16, CP7; H70): each member's build weapons as
// glyphs, matched to the front's guided build by her class in party order, and one button that sets them all (weapons are
// owned per kind, so it costs nothing). From v19 (Classes v3, CV §10.1; H134) a member matches by any class she holds and
// the tap also switches her to it; `GuidanceNeeds` names each guided class the party leaves empty and who could fill it.
import { FaceTile } from '@luismlorenzana/uma-kit/album'
import { activeClass, classOf, rpgRework, SaveRuleError, type RiftFront, type RpgClass, type RpgWeapon, type TierWorld } from '@rpg/domain'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { Campaign } from '../../battle/campaign'
import { CLASS_LABEL, WEAPON_LABEL, WeaponGlyph } from '../../battle/labels'
import { pagePath } from '../../hub/navigation'
import { useActiveTier, wieldWeapons } from '../../save/game'
import { fullParty, guidanceNeeds, guidedPlan, guidedWeapons, needLine, partyHeldOf } from './rift-view'

type Guide = { classId: RpgClass; weapons: readonly RpgWeapon[]; switch: boolean } | null

export function GuidedWeapons({ campaign, world, front, party }: { campaign: Campaign; world: TierWorld; front: RiftFront; party: number | null }) {
  const [error, setError] = useState<string | null>(null)
  const tier = useActiveTier()
  const five = party === null ? null : fullParty(world, party)
  if (!five) return null
  let guide: Guide[]
  if (rpgRework('classes')) guide = guidedPlan(partyHeldOf(world, five, campaign.outfits, tier), front)
  else {
    const classes: (RpgClass | null)[] = five.map((id) => {
      const uma = world.umas[id], outfit = campaign.outfits.get(id)
      return uma && outfit ? activeClass(outfit, uma, tier) : null
    })
    guide = guidedWeapons(classes, front).map((weapons, i) => (weapons && classes[i] ? { classId: classes[i]!, weapons, switch: false } : null))
  }
  const changes = five.flatMap((outfitId, i) => {
    const plan = guide[i], uma = world.umas[outfitId]
    if (!plan || !uma) return []
    const now = classOf(uma, plan.classId).weapons
    const same = now.length === plan.weapons.length && now.every((w, k) => w === plan.weapons[k])
    return same && !plan.switch ? [] : [{ outfitId, classId: plan.classId, weapons: plan.weapons, switch: plan.switch }]
  })
  const use = () => {
    setError(null)
    wieldWeapons(changes).catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  const label = (id: string) => (campaign.outfits.get(id) ? campaign.name(id) : 'Uma')
  return (
    <div className="space-y-1.5 rounded-sm bg-raised p-2" aria-label="Guided weapons">
      <ul className="grid grid-cols-5 gap-1">
        {five.map((id, i) => {
          const plan = guide[i]
          const said = plan ? `${plan.switch ? `${CLASS_LABEL[plan.classId]}: ` : ''}${plan.weapons.map((w) => WEAPON_LABEL[w]).join(', ')}` : 'no guided weapons'
          return (
            <li key={id} className="flex flex-col items-center gap-0.5" aria-label={`${label(id)}: ${said}`}>
              <FaceTile outfitId={id} size={26} label={label(id)} round />
              <span className="flex h-3.5 items-center gap-px text-ink-soft">
                {plan ? plan.weapons.map((w) => <WeaponGlyph key={w} weapon={w} size={13} />) : <span className="text-[10px] text-ink-faint">—</span>}
              </span>
            </li>
          )
        })}
      </ul>
      {!guide.some(Boolean) ? null : changes.length > 0
        ? <button type="button" onClick={use} className="min-h-11 w-full rounded-sm border border-accent font-semibold text-accent">Use the guided weapons</button>
        : <p className="text-center text-[12px] text-ink-faint">On the guided weapons</p>}
      {error && <p role="alert" className="text-center text-[12px] text-danger">{error}</p>}
    </div>
  )
}

/** From v19 (CV §10.1): each guided class the chosen party leaves empty, "Needs an Arms Summoner", and under it up to three
 * Umas of `roster` who could fill it (Ready to promote first, then Holds it); a row opens her profile on Skills. */
export function GuidanceNeeds({ campaign, world, front, party, roster }: {
  campaign: Campaign; world: TierWorld; front: RiftFront; party: number | null; roster: readonly string[]
}) {
  const tier = useActiveTier()
  const navigate = useNavigate()
  const five = party === null ? null : fullParty(world, party)
  if (!five || !rpgRework('classes')) return null
  const needs = guidanceNeeds(world, five, front, roster, campaign.outfits, tier)
  if (!needs.length) return null
  const label = (id: string) => (campaign.outfits.get(id) ? campaign.name(id) : 'Uma')
  return (
    <section className="mb-3 space-y-2" aria-label="Guidance">
      {needs.map((need) => (
        <div key={need.classId}>
          <h3 className="text-[13px] font-semibold">{needLine(need, (c) => CLASS_LABEL[c])}</h3>
          {need.umas.length > 0 && (
            <ul className="mt-1 space-y-1">
              {need.umas.map(({ outfitId, ready }) => (
                <li key={outfitId}>
                  <button type="button" className="flex min-h-11 w-full items-center gap-2 rounded-sm bg-raised px-2 text-left"
                    onClick={() => navigate(pagePath({ page: 'town', id: 'stable' }, `outfit/${outfitId}/skills`), { state: { fromPlace: true } })}>
                    <FaceTile outfitId={outfitId} size={28} label={label(outfitId)} round />
                    <span className="min-w-0 flex-1 truncate text-[13px]">{label(outfitId)}</span>
                    <span className={`shrink-0 text-[12px] ${ready ? 'font-semibold text-accent' : 'text-ink-soft'}`}>{ready ? 'Ready to promote' : 'Holds it'}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  )
}
