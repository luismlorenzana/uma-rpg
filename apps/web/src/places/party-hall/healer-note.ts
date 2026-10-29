// One healer a party (classes v2, C8, D178, H59): where parties are built, a party with two or more Umas who fight as
// healers (a Paladin or a Cleric) carries a note. It never blocks picking an Uma or switching her class; the fights refuse
// it (the domain's `healerBlock`). Nothing shows before classes v2.
import { healerBlock, type BattleOutfit, type Party, type TierWorld } from '@rpg/domain'

/** The note a party carries, "One healer a party", or null. `engine` defaults to the live generation; `tier` is her
 * world's (a null class reads it from Classes v3, H126). */
export function healerNote(world: Pick<TierWorld, 'umas'>, party: Pick<Party, 'slots'>, outfits: ReadonlyMap<string, BattleOutfit>,
  engine?: number, tier = 1): string | null {
  return healerBlock(world, party.slots.filter((s): s is string => s !== null), outfits, engine, tier)
}
