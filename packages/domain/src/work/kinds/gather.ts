// Gathering at a Wilds site (S4, D139): the site's own family's raw items. Her Craft Level sets the minutes for every
// grade and opens grade g at Lv 5g − 4; the site's level speeds it; each item pays 2 Craft EXP a minute of her time.
import { payItems, workRefusal, type WorkKindRules } from '@luismlorenzana/uma-work'
import { facilitySpec } from '../../economy/jobs'
import { itemMinutes, jobExp } from '../../economy/pacing'
import { gradeUnlockLevel, itemById } from '../../items/catalog'
import type { TierWorld } from '../../save/save'
import { craftLevel, many, secondsAt } from './shared'

export const gather: WorkKindRules<TierWorld> = {
  plan(world, outfitId, request, _now, { slot, speed, env }) {
    const spec = facilitySpec(slot.building)
    const item = itemById(request.item)
    if (request.kind !== 'gather' || spec?.kind !== 'gather' || !item || item.refined || item.family !== spec.family) return workRefusal('not-here')
    if (!env.exp.gradeOpen(world, outfitId, 'gather', item.grade)) return workRefusal('grade', { level: gradeUnlockLevel(item.grade) })
    const minutes = itemMinutes(craftLevel(world, outfitId))
    return many({ seconds: secondsAt(minutes, speed), inputs: [], output: { item: item.id }, exp: jobExp(minutes) }, request.count)
  },
  pay: payItems,
}
