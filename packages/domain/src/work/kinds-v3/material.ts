// Gathering and processing, R2 (PP7, PP12, PP13; H77). Gathering: a raw material of the place's line, one gather's minutes
// at her Craft Level (54 → 36), 1–10 a job. Processing at the Workbench: any refined material from its raw form, one for
// one, a quarter of a gather, batches up to ×40. Either takes only the types of the world's tier and below, opens a low
// type at Craft Lv 1 and a high type at Lv 26, pays 2 Craft EXP a minute before the place's speed, and pays into the
// Warehouse.
import { payItems, workRefusal, type WorkKindRules } from '@luismlorenzana/uma-work'
import { placeSpecV3 } from '../../economy/professions'
import { itemMinutes, jobExp, maxJobCount, refineMinutes } from '../../economy/pacing'
import { gradeUnlockLevel } from '../../items/catalog'
import { materialGateGrade, materialIdentity } from '../../items/materials-id'
import type { TierWorld } from '../../save/save'
import { craftLevel, many, secondsAt } from '../kinds/shared'
import type { KindSetup } from './setup'
import { tradeBlock } from './trade'

export function materialKindV3(kind: 'gather' | 'refine', { tier, tradeOf }: KindSetup): WorkKindRules<TierWorld> {
  const gather = kind === 'gather'
  return {
    maxItems: maxJobCount(kind),
    plan(world, outfitId, request, _now, { slot, speed, env }) {
      const place = placeSpecV3(slot.building)
      const m = materialIdentity(request.item)
      if (request.kind !== kind || place?.kind !== kind || !m || m.refined === gather || m.tier > tier || (gather && m.line !== place.line)) {
        return workRefusal('not-here')
      }
      const trade = tradeBlock(world, outfitId, slot.building, tradeOf)
      if (trade) return trade
      const grade = materialGateGrade(m.id)
      if (!env.exp.gradeOpen(world, outfitId, kind, grade)) return workRefusal('grade', { level: gradeUnlockLevel(grade) })
      const level = craftLevel(world, outfitId)
      const minutes = gather ? itemMinutes(level) : refineMinutes(level)
      const inputs = gather ? [] : [{ item: m.pair, qty: 1 }]
      return many({ seconds: secondsAt(minutes, speed), inputs, output: { item: m.id }, exp: jobExp(minutes) }, request.count)
    },
    pay: payItems,
  }
}
