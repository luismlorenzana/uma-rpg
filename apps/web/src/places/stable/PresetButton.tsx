// The live grades preset: one tap puts on a class's weapons and template accessory. A Tier 1 class has one; a Tier 0 lists
// one for each class it promotes into, so gear can start on the weapons she'll keep (D263).
// Save-v27 binding confirmations retired with the old profile sheet (H117).
import {
  activeClass, isGrades, SaveRuleError, umaPick, umaTemplate,
  type OwnedUma, type RosterOutfit, type RpgTier1Class, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { ClassEmblem } from '../../battle/pixel-icons'
import { useActiveTier, wearPreset } from '../../save/game'
import { actions } from './copy'
import { presetRows } from './gear-equip'

export function PresetButton({ outfit, uma, world }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld }) {
  const [error, setError] = useState<string | null>(null)
  const tier = useActiveTier()
  if (!isGrades(uma.gear)) return null
  const classId = activeClass(outfit, uma, tier)
  const family = umaTemplate(outfit, umaPick(uma)).family
  const rows = presetRows(world, outfit.outfitId, classId, family)
  const apply = (pick: RpgTier1Class) => wearPreset(outfit.outfitId, classId, family, pick).then(
    () => setError(null),
    (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'),
  )
  return (
    <>
      {rows.length > 1 && <h4 className="text-micro">{actions.standardPreset}</h4>}
      {rows.map((row) => (
        <button key={row.pick} type="button" disabled={row.on} onClick={() => void apply(row.pick)}
          className="flex min-h-11 w-full items-center gap-2 rounded-sm bg-raised px-2 py-1 text-left disabled:opacity-60">
          <ClassEmblem classId={row.pick} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-semibold">{row.title}</span>
            <span className="block truncate text-[10.5px] text-ink-soft">{row.detail}</span>
          </span>
          {!row.on && <span className="shrink-0 text-ink-faint">›</span>}
        </button>
      ))}
      {error && <p className="text-[13px] text-danger">{error}</p>}
    </>
  )
}
