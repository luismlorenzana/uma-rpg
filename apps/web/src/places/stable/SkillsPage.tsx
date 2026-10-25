// An Uma's class, weapons and skills (D86, D98), the first tab of her profile. Since engine v16 (the Tier rework's R1,
// H70, live since H72, D210) it is `SkillTree`: the class she fights as, her three weapon slots, one tree a slot with a
// trunk and a fork, Skill Ranks and no points.
import { activeClass, rpgTreeView, umaLoadout, umaProfile, type BattleOutfit } from '@rpg/domain'
import { useActiveTier, useWorld } from '../../save/game'
import { SkillTree } from './SkillTree'

export function SkillsPage({ outfit }: { outfit: BattleOutfit; name: string }) {
  const world = useWorld()
  const tier = useActiveTier()
  const uma = world?.umas[outfit.outfitId]
  if (!uma || !world) return <p className="p-4 text-ink-soft">Unlock her first.</p>
  const classId = activeClass(outfit, uma)
  const profile = umaProfile(outfit, uma, tier, classId)
  const loadout = umaLoadout(outfit, uma, tier, classId)
  const view = rpgTreeView(profile, loadout)
  if (!view) return null
  return <SkillTree outfit={outfit} uma={uma} world={world} tier={tier} classId={classId} profile={profile} view={view} loadout={loadout.map((r) => r.id)} />
}
