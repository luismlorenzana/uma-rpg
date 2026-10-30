// Her template on the Uma sheet (the Tier rework's R1, engine v16, H70; uma-templates.md §5, UT14; class-progression.md
// §10.2): the chip after her rarity stars, which opens "Her template" (the three readings with their sources, then her
// ★ Flourish and its state). Reads `template-view.ts`. (The calling pick card, CP29, retired with Classes v3: H134.)
import { rpgRework, type OwnedUma, type RosterOutfit, type RpgClass } from '@rpg/domain'
import { useState } from 'react'
import { useActiveTier, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { reading } from './copy'
import { templateCard, templateChip, templateTrade } from './template-view'

/** "★ Clever Spellwright": her template, after her stars; a dot while her calling can still be picked. */
export function TemplateChip({ outfit, uma, classId }: { outfit: RosterOutfit; uma: OwnedUma | null; classId: RpgClass | null }) {
  const [open, setOpen] = useState(false)
  const tier = useActiveTier()
  const world = useWorld()
  const chip = templateChip(outfit, uma)
  const card = open ? templateCard(outfit, uma, classId, tier as 1 | 2 | 3, world?.items) : null
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Template: ${chip.name.slice(2)}${chip.dot ? ', calling not chosen' : ''}`}
        className="flex min-h-11 items-center gap-1 rounded-sm bg-accent/15 px-2 py-1 text-left text-[12px] font-semibold leading-tight text-accent">
        {chip.name}
        {chip.dot && <span aria-hidden className="size-1.5 rounded-full bg-success" />}
      </button>
      {card && (
        <BottomSheet title="Her template" onClose={() => setOpen(false)}>
          <div className="space-y-3">
            <p className="font-display text-lg font-bold text-accent">★ {card.name}</p>
            <div className="divide-y divide-hairline rounded-md bg-raised">
              {card.readings.map((r) => (
                <p key={r.label} className="flex items-baseline justify-between gap-3 px-3 py-2 text-[13px]">
                  <span className="text-ink-soft">{r.label}</span>
                  <span className="min-w-0 text-right font-semibold">{reading(r.value, r.source)}</span>
                </p>
              ))}
            </div>
            {rpgRework('economy') && <p className="rounded-md bg-raised px-3 py-2 text-[13px] font-semibold" data-template-trade>{templateTrade(outfit, uma)}</p>}
            <p className="rounded-md bg-raised px-3 py-2 text-[13px] font-semibold">{card.flourish}</p>
            {card.signature && <p className="rounded-md bg-raised px-3 py-2 text-[13px] font-semibold">{card.signature}</p>}
            {card.moon?.map((line) => <p key={line} className="rounded-md bg-raised px-3 py-2 text-[13px] font-semibold">{line}</p>)}
          </div>
        </BottomSheet>
      )}
    </>
  )
}
