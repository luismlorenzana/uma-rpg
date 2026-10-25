// Her template on the Uma sheet (the Tier rework's R1, engine v16, H70; uma-templates.md §5, UT14; class-progression.md
// §10.2, CP29): the chip after her rarity stars, which opens "Her template" (the three readings with their sources, then
// her ★ Flourish and its state), and a Pace or Late Uma's calling pick card above her class chip until it is confirmed.
// Both read `template-view.ts`.
import { SaveRuleError, type OwnedUma, type RosterOutfit, type RpgClass } from '@rpg/domain'
import { useState } from 'react'
import { CLASS_LABEL } from '../../battle/labels'
import { ClassEmblem } from '../../battle/pixel-icons'
import { chooseCalling, confirmCallingPick } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { callingCard, templateCard, templateChip } from './template-view'

/** "★ Clever Spellwright": her template, after her stars; a dot while her calling can still be picked. */
export function TemplateChip({ outfit, uma, classId }: { outfit: RosterOutfit; uma: OwnedUma | null; classId: RpgClass | null }) {
  const [open, setOpen] = useState(false)
  const chip = templateChip(outfit, uma)
  const card = open ? templateCard(outfit, uma, classId) : null
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Her template: ${chip.name.slice(2)}${chip.dot ? ', calling not chosen' : ''}`}
        className="flex min-h-8 items-center gap-1 rounded-sm bg-accent/15 px-2 py-1 text-left text-[12px] font-semibold leading-tight text-accent">
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
                  <span className="text-ink-soft">{r.label} ← {r.source}</span>
                  <span className="shrink-0 font-semibold">{r.value}</span>
                </p>
              ))}
            </div>
            <p className="rounded-md bg-raised px-3 py-2 text-[13px] font-semibold">{card.flourish}</p>
          </div>
        </BottomSheet>
      )}
    </>
  )
}

/** "Her calling · choose once" (CP29): two class tiles, the suggested one marked, her pick selected, and Confirm. */
export function CallingCard({ outfit, uma }: { outfit: RosterOutfit; uma: OwnedUma }) {
  const [error, setError] = useState<string | null>(null)
  const card = callingCard(outfit, uma.calling)
  if (!card) return null
  const run = (op: () => Promise<void>) => {
    setError(null)
    op().catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  return (
    <section className="mt-2 space-y-1.5 rounded-md border border-accent/50 bg-raised p-2.5" aria-label="Her calling">
      <p className="text-[12px] font-semibold">Her calling · choose once</p>
      <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Calling">
        {card.tiles.map((t) => (
          <button key={t.classId} type="button" role="radio" aria-checked={t.selected} onClick={() => !t.selected && run(() => chooseCalling(outfit, t.classId))}
            className={`flex min-h-20 flex-col items-start gap-0.5 rounded-sm p-2 text-left ${t.selected ? 'bg-accent/15 ring-2 ring-accent' : 'bg-panel'}`}>
            <span className="flex items-center gap-1.5 text-[13px] font-semibold"><ClassEmblem classId={t.classId} />{CLASS_LABEL[t.classId]}</span>
            <span className="text-[11.5px] font-semibold text-accent">★ {t.name}</span>
            <span className="text-[10.5px] leading-snug text-ink-soft">{t.flourish}</span>
            {t.suggested && <span className="text-[10.5px] leading-snug font-semibold text-ink-faint">{card.suggested}</span>}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => run(() => confirmCallingPick(outfit.outfitId))}
        className="min-h-11 w-full rounded-sm bg-accent font-display font-bold text-accent-ink">Confirm</button>
      <p className="text-center text-[11px] text-ink-faint">Her first win confirms it.</p>
      {error && <p role="alert" className="text-center text-[12px] text-danger">{error}</p>}
    </section>
  )
}
