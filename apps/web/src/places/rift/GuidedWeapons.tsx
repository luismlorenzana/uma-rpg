// A front's guided weapons for the chosen party (the Tier rework's R1, engine v16, CP7; H70): each member's build weapons as
// glyphs, matched to the front's guided build by her class in party order, and one button that sets them all (weapons are
// owned per kind, so it costs nothing).
import { FaceTile } from '@luismlorenzana/uma-kit/album'
import { activeClass, classOf, SaveRuleError, type RiftFront, type RpgClass, type TierWorld } from '@rpg/domain'
import { useState } from 'react'
import type { Campaign } from '../../battle/campaign'
import { WEAPON_LABEL, WeaponGlyph } from '../../battle/labels'
import { wieldWeapons } from '../../save/game'
import { fullParty, guidedWeapons } from './rift-view'

export function GuidedWeapons({ campaign, world, front, party }: { campaign: Campaign; world: TierWorld; front: RiftFront; party: number | null }) {
  const [error, setError] = useState<string | null>(null)
  const five = party === null ? null : fullParty(world, party)
  if (!five) return null
  const classes: (RpgClass | null)[] = five.map((id) => {
    const uma = world.umas[id], outfit = campaign.outfits.get(id)
    return uma && outfit ? activeClass(outfit, uma) : null
  })
  const guide = guidedWeapons(classes, front)
  const changes = five.flatMap((outfitId, i) => {
    const weapons = guide[i], classId = classes[i], uma = world.umas[outfitId]
    if (!weapons || !classId || !uma) return []
    const now = classOf(uma, classId).weapons
    return now.length === weapons.length && now.every((w, k) => w === weapons[k]) ? [] : [{ outfitId, classId, weapons }]
  })
  const use = () => {
    setError(null)
    wieldWeapons(changes).catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  return (
    <div className="space-y-1.5 rounded-sm bg-raised p-2" aria-label="Guided weapons">
      <ul className="grid grid-cols-5 gap-1">
        {five.map((id, i) => (
          <li key={id} className="flex flex-col items-center gap-0.5"
            aria-label={`${campaign.outfits.get(id) ? campaign.name(id) : 'Uma'}: ${guide[i] ? guide[i]!.map((w) => WEAPON_LABEL[w]).join(', ') : 'no guided weapons'}`}>
            <FaceTile outfitId={id} size={26} label={campaign.outfits.get(id) ? campaign.name(id) : 'Uma'} round />
            <span className="flex h-3.5 items-center gap-px text-ink-soft">
              {guide[i] ? guide[i]!.map((w) => <WeaponGlyph key={w} weapon={w} size={13} />) : <span className="text-[10px] text-ink-faint">—</span>}
            </span>
          </li>
        ))}
      </ul>
      {!guide.some(Boolean) ? null : changes.length > 0
        ? <button type="button" onClick={use} className="min-h-11 w-full rounded-sm border border-accent font-semibold text-accent">Use the guided weapons</button>
        : <p className="text-center text-[12px] text-ink-faint">On the guided weapons</p>}
      {error && <p role="alert" className="text-center text-[12px] text-danger">{error}</p>}
    </div>
  )
}
