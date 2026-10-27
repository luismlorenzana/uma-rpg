// Making under the farm by line (D224; farm-by-line.md FL3, FL6, FL9, FL10; H109): a making place makes its one item from
// its own line's refined items of the item's grade (`madeRecipeV4`), three quarters of a gather for each refined item in
// it (`makeMinutesV4`), grade g at Craft Lv 5g − 4 (a jewel's grade is its node's); paid into the Warehouse. The Branch
// Gem waits for R3 (`madeLive`).
import { payItems, workRefusal, type WorkKindRules } from '@luismlorenzana/uma-work'
import type { JobKind } from '../../economy/jobs'
import { jobExp, makeMinutesV4 } from '../../economy/pacing'
import { placeSpecV4 } from '../../economy/places-v4'
import { gradeUnlockLevel } from '../../items/catalog'
import { madeIdentity, type MadeLine } from '../../items/made-id'
import { madeRecipeV4 } from '../../items/made-v4'
import type { TierWorld } from '../../save/save'
import { craftLevel, many, secondsAt } from '../kinds/shared'
import { rpgRework } from '../../rpg/battle/caps'
import type { KindSetup } from '../kinds-v3/setup'
import { tradeBlock } from '../kinds-v3/trade'

/** Whether a made line is made in a world of this tier now: everything but the Branch Gem, which waits for R3's weapons
 * (v18) in a Tier 2 world or above. */
export const madeLive = (line: MadeLine, tier: number): boolean => line !== 'branch-gem' || (rpgRework('t2Weapons') && tier >= 2)

export function makeV4(kind: Extract<JobKind, 'craft' | 'cut'>, { tier, tradeOf }: KindSetup): WorkKindRules<TierWorld> {
  return {
    plan(world, outfitId, request, _now, { slot, speed, env }) {
      const place = placeSpecV4(slot.building)
      const made = madeIdentity(request.item)
      if (request.kind !== kind || !place?.kinds.includes(kind) || !made || !place.made.includes(made.line) || !madeLive(made.line, tier)) return workRefusal('not-here')
      const trade = tradeBlock(world, outfitId, slot.building, tradeOf)
      if (trade) return trade
      if (!env.exp.gradeOpen(world, outfitId, kind, made.grade)) return workRefusal('grade', { level: gradeUnlockLevel(made.grade) })
      const recipe = Object.entries(madeRecipeV4(made.id))
      const minutes = makeMinutesV4(craftLevel(world, outfitId), recipe.reduce((n, [, qty]) => n + qty, 0))
      const inputs = recipe.map(([item, qty]) => ({ item, qty }))
      return many({ seconds: secondsAt(minutes, speed), inputs, output: { item: made.id }, exp: jobExp(minutes) }, request.count)
    },
    pay: payItems,
  }
}
