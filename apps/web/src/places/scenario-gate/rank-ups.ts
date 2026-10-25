// A won fight's Skill Rank-ups (the Tier rework's R1, engine v16, CP23, CP32; H70): under each member's Class Rank bar on the
// result sheet, one line a skill whose rank rose with her Class Rank ("Cleave reached Rank 3"; a depth that just opened,
// "Sunder opened"). Read from the domain's `rpgSkillRankUps` on her profile as she stands after the win (her weapons and
// lines). Nothing before v16, where nothing ranks: `engine` is the fight's own version (the live one for a Sweep). Lazy,
// with the result sheets: the tree model reads the catalog.
import {
  BATTLE_ENGINE_VERSION, rpgRework, rpgSkillRankUps, umaProfile, type BattleOutfit, type RankGain, type RpgClass, type TierWorld,
} from '@rpg/domain'

export function rankUpLines(world: TierWorld | null, outfit: BattleOutfit | undefined, gain: RankGain | undefined, tier: number,
  engine: number = BATTLE_ENGINE_VERSION): string[] {
  if (!world || !outfit || gain?.ref.kind !== 'class' || !rpgRework('fight', engine)) return []
  const uma = world.umas[outfit.outfitId]
  if (!uma) return []
  const profile = umaProfile(outfit, uma, tier, gain.ref.id as RpgClass)
  return rpgSkillRankUps(profile, gain.before.rank, gain.after.rank, engine)
    .map((up) => (up.opened ? `${up.name} opened` : `${up.name} reached Rank ${up.rank}`))
}
