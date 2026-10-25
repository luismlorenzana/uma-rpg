// Making, R2 (PP10, PP12, PP13; H77): the Forge, the Armorer and the Charm Shop craft, the Lapidary cuts. A live made item
// of the place's lines from `madeRecipe` at the world's tier, one gather's time a refined item in it, grade g at Craft Lv
// 5g − 4 (a jewel's grade is its node's); paid into the Warehouse with the materials (R2's build decision 5). The Branch Gem
// is defined but made only from R3's weapons (v18), in a Tier 2 world or above (R2's build decision 6).
import { payItems, workRefusal, type WorkKindRules } from '@luismlorenzana/uma-work'
import type { JobKind } from '../../economy/jobs'
import { placeSpecV3 } from '../../economy/professions'
import { itemMinutes, jobExp } from '../../economy/pacing'
import { gradeUnlockLevel } from '../../items/catalog'
import { madeRecipe } from '../../items/made'
import { madeIdentity, type MadeLine } from '../../items/made-id'
import { rpgRework } from '../../rpg/battle/caps'
import type { TierWorld } from '../../save/save'
import { craftLevel, many, secondsAt } from '../kinds/shared'
import type { KindSetup } from './setup'
import { tradeBlock } from './trade'

/** Whether a made line is made in a world of this tier now: everything but the Branch Gem, which waits for R3. */
export const madeLive = (line: MadeLine, tier: number): boolean => line !== 'branch-gem' || (rpgRework('t2Weapons') && tier >= 2)

export function makeV3(kind: Extract<JobKind, 'craft' | 'cut'>, { tier, tradeOf }: KindSetup): WorkKindRules<TierWorld> {
  return {
    plan(world, outfitId, request, _now, { slot, speed, env }) {
      const place = placeSpecV3(slot.building)
      const made = madeIdentity(request.item)
      if (request.kind !== kind || place?.kind !== kind || !made || !place.made.includes(made.line) || !madeLive(made.line, tier)) return workRefusal('not-here')
      const trade = tradeBlock(world, outfitId, slot.building, tradeOf)
      if (trade) return trade
      if (!env.exp.gradeOpen(world, outfitId, kind, made.grade)) return workRefusal('grade', { level: gradeUnlockLevel(made.grade) })
      const recipe = Object.entries(madeRecipe(made.id, tier))
      const minutes = itemMinutes(craftLevel(world, outfitId)) * recipe.reduce((n, [, qty]) => n + qty, 0)
      const inputs = recipe.map(([item, qty]) => ({ item, qty }))
      return many({ seconds: secondsAt(minutes, speed), inputs, output: { item: made.id }, exp: jobExp(minutes) }, request.count)
    },
    pay: payItems,
  }
}
