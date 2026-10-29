// Classes v3's reset over the save (save v32, D240, D247; classes-v3.md §8.1, §8.4, §8.5; H130, dark until H134): the
// Tier 0 a v31 class's fight pays after the reset, and the trades the new calling moves. `toV32` (migrations.ts) writes
// the reset and its record; what needs master data runs here, after the parse, as D220's calling repair does. Loaded
// with `save/battle.ts`, which re-exports it (the web imports it only while a world's record waits for its trades). Pure.
import type { RpgTier0Class, RpgV2Class } from '../rpg/kinds'
import { grantProfessionExp } from '../economy/pacing'
import { tradeOfCalling } from '../economy/professions'
import { umaCalling, type CallingOutfit } from '../roster/template'
import type { ClassesV3Line, Save, TierWorld } from './save'

/**
 * Each v31 class's Tier 0, its own family's (classes-v3.md §1): the Brawler the Recruit, the Mage (the Sorcerer) the
 * Initiate, the Spell Blade (the Arms Spellblade) the Duelist, the Summoner (the Tome Summoner) the Caller, the Paladin
 * and the Cleric the Acolyte. A fight open across the reset replays on v18 with her v31 class, which in Tier 1's world is
 * no class she holds, so from the classes stage its class share pays this Tier 0 (`fillRanks`). No master data.
 */
export const RPG_RESET_TIER0: Readonly<Record<RpgV2Class, RpgTier0Class>> = {
  brawler: 'recruit', mage: 'apprentice', spellblade: 'duelist', summoner: 'caller', paladin: 'acolyte', cleric: 'acolyte',
}

/** The engines the trade step reads her calling on: v31's (with her pick) and Classes v3's (by her styles alone). */
const V31_ENGINE = 18
const V32_ENGINE = 19

/** A world's work with one Uma's row settled with no clock (saves v30 and v31's rule, `settleWork`'s, for her row only):
 * every started entry's outputs from `collected` on go into the Warehouse and pay their Craft EXP into her `craft`; her
 * queue drops with her row. */
function settleRow(world: TierWorld, outfitId: string): Pick<TierWorld, 'work' | 'items' | 'umas'> {
  const row = world.work[outfitId]
  const uma = world.umas[outfitId]
  if (!row || !uma) return world
  const items = { ...world.items }
  let exp = 0
  for (const entry of row.entries) {
    for (let i = entry.collected; i < entry.outputs.length; i++) {
      const out = entry.outputs[i]
      if (out && 'item' in out) items[out.item] = (items[out.item] ?? 0) + 1
      exp += entry.exp[i] ?? 0
    }
  }
  const { [outfitId]: _settled, ...work } = world.work
  return { work, items, umas: { ...world.umas, [outfitId]: { ...uma, craft: grantProfessionExp(uma.craft, exp) } } }
}

/**
 * The trades Classes v3's calling moves (CV20, CV28; classes-v3.md §8.4), once per world after save v32's reset: for each
 * Uma of a world's record (`classesV3`, `traded` false) still owned there whose outfit `outfits` holds, her old trade is
 * her v31 calling's with her v31 pick (`umaCalling` on v18) and her new one her Tier 0's (v19). Where they differ, her
 * running work finishes into the Warehouse with its Craft EXP and her queue drops (`settleRow`), and her line gains
 * `trade`; an Uma whose trade stays keeps working. Then the world's `traded` is true. An Uma whose outfit `outfits`
 * lacks, and a world with no record, are untouched; a second run changes nothing. The web calls it on every boot once the
 * roster has loaded (`apps/web/src/save/game.ts`); a migration never reads her styles, Power or Wit.
 */
export function settleClassesV3Trades(save: Save, outfits: readonly (CallingOutfit & { outfitId: string })[], now: string): Save {
  const byId = new Map(outfits.map((outfit) => [outfit.outfitId, outfit]))
  let changed = false
  const tierWorlds = Object.fromEntries(Object.entries(save.tierWorlds).map(([tier, world]) => {
    const record = world.classesV3
    if (!record || record.traded) return [tier, world]
    changed = true
    let next: TierWorld = world
    const umas: Record<string, ClassesV3Line> = { ...record.umas }
    for (const [id, line] of Object.entries(record.umas)) {
      const outfit = byId.get(id)
      if (!outfit || !world.umas[id]) continue
      const from = tradeOfCalling(umaCalling(outfit, line.pick, V31_ENGINE)), to = tradeOfCalling(umaCalling(outfit, null, V32_ENGINE))
      if (from === to) continue
      umas[id] = { ...line, trade: { from, to } }
      next = { ...next, ...settleRow(next, id) }
    }
    return [tier, { ...next, classesV3: { ...record, umas, traded: true } }]
  }))
  return changed ? { ...save, account: { ...save.account, updatedAt: now }, tierWorlds } : save
}
