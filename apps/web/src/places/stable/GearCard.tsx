// What she wears (S7, D59, D86): one piece per weapon her class wields (five), an armor and an accessory (a Ring, a
// Charm or an Orb). Pieces from the stock bind
// to her for good when equipped; her own pieces swap freely. Mastery rank k in a type lets her wear grade k.
import {
  activeClass, classOf, EFFECT_LABEL, EQUIP_LABEL, equipBlock, gearById, gearPoints, ITEM_EFFECTS, SaveRuleError, slotOf,
  type GearSlot, type OwnedUma, type RosterOutfit, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { takeOff, wear } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { pointText } from '../observatory/ObservatoryPage'

const slotLabel = (slot: GearSlot) => (slot === 'armor' ? 'Armor' : slot === 'accessory' ? 'Accessory' : EQUIP_LABEL[slot])

function pieceLine(id: string): string {
  const piece = gearById(id)
  if (!piece) return ''
  const p = gearPoints(piece)
  return ITEM_EFFECTS.filter((e) => p[e]).map((e) => `${EFFECT_LABEL[e]} ${pointText(e, p[e])}`).join(' · ')
}

export function GearCard({ outfit, uma, world }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld }) {
  const slots: GearSlot[] = [...classOf(uma, activeClass(outfit, uma)).weapons, 'armor', 'accessory']
  const [open, setOpen] = useState<GearSlot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const run = (op: () => Promise<void>) => op().then(() => { setOpen(null); setError(null) }, (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  const candidates = (slot: GearSlot) => {
    const fits = (id: string) => gearById(id) && slotOf(gearById(id)!.type) === slot
    return {
      own: uma.gear.locker.filter(fits),
      stock: Object.keys(world.gear).filter((id) => fits(id) && !uma.gear.locker.includes(id)),
    }
  }
  return (
    <section className="space-y-1.5 rounded-md bg-raised p-3">
      <h4 className="text-micro">Gear</h4>
      {slots.map((slot) => {
        const id = uma.gear.equipped[slot]
        const out = id ? outputView(id) : null
        return (
          <button key={slot} type="button" onClick={() => setOpen(slot)} className="flex min-h-12 w-full items-center gap-2 rounded-sm bg-panel px-2 text-left">
            {out ? <ItemIcon id={out.icon} size={28} /> : <span className="size-7 rounded-xs border border-dashed border-hairline-strong" />}
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] text-ink-faint">{slotLabel(slot)}</span>
              <span className="block truncate text-[13px] font-semibold">{out ? `${out.name} · G${out.grade}` : 'Empty'}</span>
            </span>
          </button>
        )
      })}
      {open && (() => {
        const { own, stock } = candidates(open)
        return (
          <BottomSheet title={slotLabel(open)} onClose={() => { setOpen(null); setError(null) }}>
            {uma.gear.equipped[open] && (
              <button type="button" onClick={() => run(() => takeOff(outfit.outfitId, open))} className="mb-2 min-h-11 w-full rounded-sm border border-hairline-strong text-[13px] font-semibold text-ink-soft">
                Take off (it stays in her locker)
              </button>
            )}
            {own.length + stock.length === 0 && <p className="text-[14px] text-ink-soft">Nothing for this slot yet: craft some at the Forge (Wilds).</p>}
            <ul className="space-y-1.5">
              {[...own.map((id) => ({ id, bound: true })), ...stock.map((id) => ({ id, bound: false }))].map(({ id, bound }) => {
                const block = equipBlock(uma, id)
                const out = outputView(id)
                return (
                  <li key={id}>
                    <button type="button" disabled={!!block || uma.gear.equipped[open] === id} onClick={() => run(() => wear(outfit.outfitId, id))}
                      className="flex w-full items-center gap-2 rounded-sm bg-raised p-2 text-left disabled:opacity-45">
                      <ItemIcon id={out.icon} size={32} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold">{out.name} · G{out.grade}</span>
                        <span className="block text-[11px] text-ink-soft">{block ?? pieceLine(id)}</span>
                      </span>
                      <span className="shrink-0 text-[11px] text-ink-faint">{uma.gear.equipped[open] === id ? 'Worn' : bound ? 'Hers' : `Stock ×${world.gear[id]} · binds`}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
          </BottomSheet>
        )
      })()}
    </section>
  )
}
