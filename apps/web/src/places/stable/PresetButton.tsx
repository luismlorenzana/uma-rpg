// The live grades preset: one tap restores the active class's standard weapons, armor half and template accessory.
// Save-v27 binding confirmations retired with the old profile sheet (H117).
import {
  ACCESSORY_FAMILY_LABEL, activeClass, classPresetPlan, classPresetV3, isGrades, SaveRuleError, umaPick, umaTemplate,
  type OwnedUma, type RosterOutfit, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { CLASS_LABEL } from '../../battle/labels'
import { ClassEmblem } from '../../battle/pixel-icons'
import { useActiveTier, wearPreset } from '../../save/game'
import { standardPreset } from './copy'

export function PresetButton({ outfit, uma, world }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld }) {
  const [error, setError] = useState<string | null>(null)
  const tier = useActiveTier()
  if (!isGrades(uma.gear)) return null
  const classId = activeClass(outfit, uma, tier)
  const family = umaTemplate(outfit, umaPick(uma)).family
  const preset = classPresetV3(classId)
  const plan = classPresetPlan(world, outfit.outfitId, classId, undefined, family)
  const on = plan.changes === 0
  const apply = () => wearPreset(outfit.outfitId, classId, family).then(
    () => setError(null),
    (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'),
  )
  return (
    <>
      <button type="button" disabled={on} onClick={() => void apply()}
        className="flex min-h-11 w-full items-center gap-2 rounded-sm bg-raised px-2 text-left disabled:opacity-60">
        <ClassEmblem classId={classId} />
        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold">{standardPreset(on)}</span>
        <span className="truncate text-[10.5px] text-ink-soft">{CLASS_LABEL[classId]} · {preset.armor === 'magical' ? 'Magical' : 'Physical'} · {ACCESSORY_FAMILY_LABEL[family]}</span>
        {!on && <span className="shrink-0 text-ink-faint">›</span>}
      </button>
      {error && <p className="text-[13px] text-danger">{error}</p>}
    </>
  )
}
