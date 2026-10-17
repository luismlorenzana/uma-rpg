// uma-rpg's side of the shared work engine (SC3, uma-platform P53): its four kinds, its facilities as buildings
// (3 / 4 / 5 slots, a quarter faster at Lv 3, upgrades in Laurels and refined items), Speed Tickets in the wallet,
// Craft Level from every collect, and Laurels for upgrades. No ledger.
import { buildingTable, type WorkEnv } from '@luismlorenzana/uma-work'
import { FACILITIES } from '../economy/jobs'
import { FACILITY_SLOTS, FACILITY_SPEED, FACILITY_UPGRADE, grantProfessionExp } from '../economy/pacing'
import { familyById, gradeUnlockLevel } from '../items/catalog'
import type { TierWorld } from '../save/save'
import { craft } from './kinds/craft'
import { cut } from './kinds/cut'
import { gather } from './kinds/gather'
import { refine } from './kinds/refine'

/** Every facility, in the Hub's order: a site's upgrades take its own family and its partner, a building's blocks and
 * planks (D144). */
export const RPG_BUILDINGS = buildingTable(Object.fromEntries(FACILITIES.map((f) => [f.id, {
  slots: [...FACILITY_SLOTS],
  speed: [...FACILITY_SPEED],
  upgrades: FACILITY_UPGRADE.map((step) => ({
    money: step.laurels,
    items: f.upgradeFamilies.map((family) => ({ item: familyById(family)!.refined[step.grade - 1]!.id, qty: step.count })),
  })),
}])))

/** What a collect's Craft EXP did. */
export interface CraftGain { levelsUp: number }

export const RPG_WORK_ENV: WorkEnv<TierWorld> = {
  kinds: { gather, refine, craft, cut },
  buildings: RPG_BUILDINGS,
  tickets: {
    balance: (world) => world.wallet.timeTickets,
    spend: (world, n) => ({ ...world, wallet: { ...world.wallet, timeTickets: world.wallet.timeTickets - n } }),
  },
  exp: {
    grant(world, outfitId, exp) {
      const uma = world.umas[outfitId]
      if (!uma) return { state: world, detail: { levelsUp: 0 } satisfies CraftGain }
      const after = grantProfessionExp(uma.craft, exp)
      return { state: { ...world, umas: { ...world.umas, [outfitId]: { ...uma, craft: after } } }, detail: { levelsUp: after.level - uma.craft.level } satisfies CraftGain }
    },
    gradeOpen: (world, outfitId, _kind, grade) => (world.umas[outfitId]?.craft.level ?? 1) >= gradeUnlockLevel(grade),
  },
  money: {
    balance: (world) => world.wallet.laurels,
    spend: (world, n) => ({ ...world, wallet: { ...world.wallet, laurels: world.wallet.laurels - n } }),
  },
  isWorker: (world, outfitId) => world.umas[outfitId] !== undefined,
}
