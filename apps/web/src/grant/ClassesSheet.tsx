// "The classes are rebuilt" (Classes v3 §8.6, CV30; H132): the one-time sheet over the shell, once per world with an
// unseen `classesV3` record whose trades have settled, and again from the Account's row. On the model of "The Wilds are
// rebuilt" (`GrantSheet`): the kit's sheet, its footer's two buttons, the By Uma list with faces. Both buttons mark it
// seen; To the Exchange opens the Exchange's Manual sheet on its picker. Lazy: the shell holds only its check.
import { FaceTile } from '@luismlorenzana/uma-kit/album'
import { Sheet } from '@luismlorenzana/uma-kit/ui'
import type { ReactNode } from 'react'
import { ClassEmblem } from '../battle/pixel-icons'
import { useMaster } from '../master/master'
import { useActiveTier, useWorld } from '../save/game'
import { classesLines, rebuiltClass } from './classes-lines'

/** The roots' tints, physical to magical (the reset page's). */
const ROOT_TONE = ['text-stat-power', 'text-accent-strong', 'text-info'] as const

export default function ClassesSheet({ onLater, onExchange }: { onLater: () => void; onExchange: () => void }) {
  const world = useWorld()
  const tier = useActiveTier()
  const master = useMaster()
  const record = world?.classesV3
  if (!world || !record) return null
  const roster = master.status === 'ready' ? master.view.roster : null
  const outfits = new Map(roster?.map((outfit) => [outfit.outfitId, outfit]) ?? [])
  const merged = Object.keys(world.heroes).some((id) => id.startsWith('healer-'))
    || Object.values(world.umas).some((uma) => Object.keys(uma.bonds).some((id) => id.startsWith('healer-')))
  const lines = classesLines(record, (id) => {
    const outfit = outfits.get(id)
    const line = record.umas[id]
    return outfit ? { name: outfit.name, after: line ? rebuiltClass(outfit, line, tier) : null } : undefined
  }, tier, merged)
  const row = (label: string, value: ReactNode) => value && (
    <div className="grid grid-cols-[4.5rem_1fr] gap-2 py-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-ink-faint">{label}</span>
      <span className="text-[13px]">{value}</span>
    </div>
  )
  return (
    <Sheet open onClose={onLater} title={lines.title} footer={
      <div className="flex gap-2">
        <button type="button" onClick={onExchange} className="min-h-11 flex-1 rounded-sm bg-accent font-display font-bold text-accent-ink">To the Exchange</button>
        <button type="button" onClick={onLater} className="min-h-11 flex-1 rounded-sm bg-sunken font-semibold">Later</button>
      </div>
    }>
      <div className="space-y-3" data-classes-sheet>
        <div className="rounded-md bg-raised p-3 text-center">
          <p className="font-display text-[22px] font-extrabold leading-tight text-accent" data-classes-grant>{lines.grant}</p>
          <p className="mt-0.5 text-[13px] text-ink-soft">{lines.marks}</p>
        </div>
        <p className="text-[14px] text-ink-soft">{lines.lead}</p>
        {lines.tree && (
          <div className="grid grid-cols-[1fr_2fr_1fr] gap-1 rounded-md bg-raised p-2 text-center" data-classes-tree>
            {lines.tree.map((column, i) => (
              <div key={column.root} className="min-w-0">
                <p className={`text-[11px] font-bold uppercase tracking-[0.04em] ${ROOT_TONE[i] ?? ''}`}>{column.root}</p>
                <p className="mt-1 flex justify-center gap-1">{column.classes.map((c) => <ClassEmblem key={c.classId} classId={c.classId} />)}</p>
                <p className="mt-0.5 text-[11px] text-ink-soft">{column.classes.map((c) => c.name).join(' · ')}</p>
              </div>
            ))}
          </div>
        )}
        <section>
          <h3 className="text-micro mb-1">How to rebuild an Uma</h3>
          <ol className="space-y-1.5">
            {lines.steps.map((step, i) => (
              <li key={step.text} className="flex gap-2 text-[13px]">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">{i + 1}</span>
                <span>{step.text}{step.note && <span className="block text-[12px] text-ink-soft">{step.note}</span>}</span>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h3 className="text-micro">At a glance</h3>
          <div className="divide-y divide-hairline">
            {row('Reset', lines.reset)}
            {row('Stays', lines.stays)}
            {row('Weapons', lines.weapons)}
            {row('Trades', lines.trades)}
            {row('Halls', lines.halls && (
              <span className="block" data-classes-halls>
                <span className="block">{lines.halls.head}</span>
                {lines.halls.moves.map((move) => (
                  <span key={move.outfitId} className="block text-[12px]"><span className="font-semibold">{move.label}</span> <span className="text-ink-soft">{move.value}</span></span>
                ))}
                <span className="block text-[12px] text-ink-soft">{lines.halls.foot}</span>
              </span>
            ))}
          </div>
        </section>
        {lines.umas.length > 0 && (
          <section>
            <h3 className="text-micro mb-1">Each Uma, by Manuals</h3>
            <ul className="divide-y divide-hairline rounded-md bg-raised" data-classes-umas>
              {lines.umas.map((uma) => (
                <li key={uma.outfitId} className="flex min-h-12 items-center gap-2 px-2 py-1.5">
                  <FaceTile outfitId={uma.outfitId} size={32} round label={uma.name} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">{uma.name}</span>
                    <span className="block text-[12px] text-ink-soft">{uma.line}</span>
                  </span>
                  {uma.manuals > 0 && <span className="shrink-0 font-display text-[15px] font-bold tabular-nums">{uma.manuals}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Sheet>
  )
}
