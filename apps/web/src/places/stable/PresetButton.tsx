// The Gear tab's standard preset (H33, classes v2 §7, C6, D164): one tap puts on her active class's default weapons, its
// armor half in all five slots, its Orb and its support accessory, with the best pieces she can wear. Binding from the
// stock is for good, so a preset that binds lists those pieces first; the rest can be undone slot by slot.
import { ACCESSORY_FAMILY_LABEL, activeClass, classPreset, classPresetPlan, classPresetV3, EQUIP_LABEL, isGrades, SaveRuleError, umaTemplate, type OwnedUma, type RosterOutfit, type TierWorld, umaPick } from '@rpg/domain'
import { useMemo, useState } from 'react'
import { CLASS_LABEL } from '../../battle/labels'
import { ClassEmblem } from '../../battle/pixel-icons'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { useActiveTier, wearPreset } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'

export function PresetButton({ outfit, uma, world }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld }) {
  const classId = activeClass(outfit, uma, useActiveTier())
  const graded = isGrades(uma.gear)
  const family = graded ? umaTemplate(outfit, umaPick(uma)).family : undefined
  const preset = graded ? classPresetV3(classId) : classPreset(classId)
  const plan = useMemo(() => classPresetPlan(world, outfit.outfitId, classId, undefined, family), [world, outfit.outfitId, classId, family])
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const on = plan.changes === 0
  const apply = () => wearPreset(outfit.outfitId, classId, family).then(
    () => { setConfirm(false); setError(null) },
    (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'),
  )
  const close = () => { setConfirm(false); setError(null) }
  return (
    <>
      <button type="button" disabled={on} onClick={() => (plan.binds.length ? setConfirm(true) : void apply())}
        className="flex min-h-11 w-full items-center gap-2 rounded-sm bg-raised px-2 text-left disabled:opacity-60">
        <ClassEmblem classId={classId} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-semibold">{on ? 'Standard preset on' : 'Use standard preset'}</span>
        </span>
        <span className="truncate text-[10.5px] text-ink-soft">{CLASS_LABEL[classId]} · {preset.armor === 'magical' ? 'Magic' : 'Physical'} · {graded
          ? ACCESSORY_FAMILY_LABEL[plan.accessory!.family]
          : `${EQUIP_LABEL[(preset as ReturnType<typeof classPreset>).orb]} · ${EQUIP_LABEL[(preset as ReturnType<typeof classPreset>).support]}`}</span>
        {!on && <span className="shrink-0 text-ink-faint">›</span>}
      </button>
      {error && !confirm && <p className="text-[13px] text-danger">{error}</p>}
      {confirm && (
        <BottomSheet title="Standard preset" onClose={close} footer={
          <button type="button" onClick={() => void apply()} className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink">
            Use the standard preset
          </button>
        }>
          <p className="mb-2 text-[13px] text-ink-soft">Binds to her for good</p>
          <ul className="space-y-1">
            {plan.binds.map((id) => {
              const out = outputView(id)
              return (
                <li key={id} className="flex items-center gap-2 rounded-sm bg-raised p-2">
                  <ItemIcon id={out.icon} size={32} />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{out.name} · G{out.grade}</span>
                </li>
              )
            })}
          </ul>
          {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
        </BottomSheet>
      )}
    </>
  )
}
