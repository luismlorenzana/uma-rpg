// What she wears (S7, D59, D86, D98): her class's five weapons, an armor and an accessory (a Ring, a Charm or an Orb).
// A weapon slot holds a Training weapon until she wears a crafted one (WeaponSheet). Pieces from the stock bind to her
// for good when equipped; her own pieces swap freely. Her matching gear level lets her wear its grade.
import {
  activeClass, classOf, EQUIP_LABEL, equipBlock, gearById, SaveRuleError, slotOf, type GearSlot, type OwnedUma, type RosterOutfit, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { trainingName } from '../../battle/labels'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { takeOff, wear } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { pieceLine, TrainingIcon, WeaponSheet } from './WeaponSheet'

const slotLabel = (slot: GearSlot) => (slot === 'armor' ? 'Armor' : slot === 'accessory' ? 'Accessory' : EQUIP_LABEL[slot])

export function GearCard({ outfit, uma, world }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld }) {
  const classId = activeClass(outfit, uma)
  const weapons = classOf(uma, classId).weapons
  const slots: GearSlot[] = [...weapons, 'armor', 'accessory']
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
      {slots.map((slot, i) => {
        const id = uma.gear.equipped[slot]
        const out = id ? outputView(id) : null
        const weapon = i < weapons.length ? weapons[i]! : null
        return (
          <button key={slot} type="button" onClick={() => setOpen(slot)} className="flex min-h-12 w-full items-center gap-2 rounded-sm bg-panel px-2 text-left">
            {out ? <ItemIcon id={out.icon} size={28} /> : weapon ? <TrainingIcon weapon={weapon} /> : <span className="size-7 rounded-xs border border-dashed border-hairline-strong" />}
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] text-ink-faint">{weapon ? `Weapon ${i + 1}` : slotLabel(slot)}</span>
              <span className="block truncate text-[13px] font-semibold">{out ? `${out.name} · G${out.grade}` : weapon ? `${trainingName(weapon)} · G0` : 'Empty'}</span>
            </span>
          </button>
        )
      })}
      {open && weapons.includes(open as never) && (
        <WeaponSheet outfitId={outfit.outfitId} uma={uma} world={world} classId={classId} slot={weapons.indexOf(open as never)} onClose={() => setOpen(null)} />
      )}
      {open && !weapons.includes(open as never) && (() => {
        const { own, stock } = candidates(open)
        return (
          <BottomSheet title={slotLabel(open)} onClose={() => { setOpen(null); setError(null) }}>
            {uma.gear.equipped[open] && (
              <button type="button" onClick={() => run(() => takeOff(outfit.outfitId, open))} className="mb-2 min-h-11 w-full rounded-sm border border-hairline-strong text-[13px] font-semibold text-ink-soft">
                Take off
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
