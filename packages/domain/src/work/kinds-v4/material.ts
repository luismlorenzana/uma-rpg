// Gathering and processing under the farm by line (D224; farm-by-line.md FL2, FL6, FL10; H109). Gathering: a raw item
// of the place's line, one gather's minutes at her Craft Level (54 → 36), 1–10 a job. Processing, at the line's making
// place only: a refined item of its line from its raw form, one for one, a quarter of a gather, batches up to ×40. Either
// opens grade g at Craft Lv 5g − 4, the same in every world, pays 2 Craft EXP a minute before the place's speed, and pays
// into the Warehouse.
import { payItems, workRefusal, type WorkKindRules } from '@luismlorenzana/uma-work'
import { itemMinutes, jobExp, maxJobCount, refineMinutes } from '../../economy/pacing'
import { placeSpecV4 } from '../../economy/places-v4'
import { gradeUnlockLevel } from '../../items/catalog'
import { lineItem } from '../../items/lines'
import type { TierWorld } from '../../save/save'
import { craftLevel, many, secondsAt } from '../kinds/shared'
import type { KindSetup } from '../kinds-v3/setup'
import { tradeBlock } from '../kinds-v3/trade'

export function materialKindV4(kind: 'gather' | 'refine', { tradeOf }: KindSetup): WorkKindRules<TierWorld> {
  const gather = kind === 'gather'
  return {
    maxItems: maxJobCount(kind),
    plan(world, outfitId, request, _now, { slot, speed, env }) {
      const place = placeSpecV4(slot.building)
      const m = lineItem(request.item)
      if (request.kind !== kind || !place?.kinds.includes(kind) || !m || m.refined === gather || m.line !== place.line) return workRefusal('not-here')
      const trade = tradeBlock(world, outfitId, slot.building, tradeOf)
      if (trade) return trade
      if (!env.exp.gradeOpen(world, outfitId, kind, m.grade)) return workRefusal('grade', { level: gradeUnlockLevel(m.grade) })
      const level = craftLevel(world, outfitId)
      const minutes = gather ? itemMinutes(level) : refineMinutes(level)
      const inputs = gather ? [] : [{ item: m.pair, qty: 1 }]
      return many({ seconds: secondsAt(minutes, speed), inputs, output: { item: m.id }, exp: jobExp(minutes) }, request.count)
    },
    pay: payItems,
  }
}
