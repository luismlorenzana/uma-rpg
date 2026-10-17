// Refining at the Workbench (S4, D101, D139): one raw item into its refined pair, in a quarter of gathering's time, in
// batches up to ×40 so a ×40 refine takes as long as a 10-item gather. Craft Level opens the grade.
import { payItems, workRefusal, type WorkKindRules } from '@luismlorenzana/uma-work'
import { facilitySpec } from '../../economy/jobs'
import { jobExp, maxJobCount, refineMinutes } from '../../economy/pacing'
import { gradeUnlockLevel, itemById } from '../../items/catalog'
import type { TierWorld } from '../../save/save'
import { craftLevel, many, secondsAt } from './shared'

export const refine: WorkKindRules<TierWorld> = {
  maxItems: maxJobCount('refine'),
  plan(world, outfitId, request, _now, { slot, speed, env }) {
    const item = itemById(request.item)
    if (request.kind !== 'refine' || facilitySpec(slot.building)?.kind !== 'refine' || !item?.refined) return workRefusal('not-here')
    if (!env.exp.gradeOpen(world, outfitId, 'refine', item.grade)) return workRefusal('grade', { level: gradeUnlockLevel(item.grade) })
    const minutes = refineMinutes(craftLevel(world, outfitId))
    return many({ seconds: secondsAt(minutes, speed), inputs: [{ item: item.pair, qty: 1 }], output: { item: item.id }, exp: jobExp(minutes) }, request.count)
  },
  pay: payItems,
}
