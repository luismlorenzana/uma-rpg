// What she wears (S7, D59, D86, D98, D103, D124): her class's five weapons, her five armor slots (head, body, legs, arms,
// feet), each physical or magical, and her two accessories. An empty weapon or armor slot holds the Training piece of its
// kind; an empty accessory slot holds nothing. Pieces from the stock bind to her for good when equipped; her own pieces
// swap freely. Her Weapon, Armor or Accessory Rank lets her wear its grade.
import {
  ACCESSORY_SLOT_LABEL, ACCESSORY_SLOTS, activeClass, ARMOR_SLOT_LABEL, ARMOR_SLOTS, classOf, slotKind, type AccessorySlot, type ArmorSlot,
  type OwnedUma, type RosterOutfit, type RpgWeapon, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { trainingName } from '../../battle/labels'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { ArmorMark } from '../../ui/RankBars'
import { AccessorySheet, ArmorSheet, pieceLine, TrainingIcon, trainingArmorName, WeaponSheet } from './WeaponSheet'

type Open = { weapon: number } | { armor: ArmorSlot } | { accessory: AccessorySlot } | null

export function GearCard({ outfit, uma, world }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld }) {
  const classId = activeClass(outfit, uma)
  const weapons = classOf(uma, classId).weapons
  const [open, setOpen] = useState<Open>(null)
  const row = (key: string, label: string, icon: React.ReactNode, name: string, onClick: () => void, note?: string) => (
    <button key={key} type="button" onClick={onClick} className="flex min-h-12 w-full items-center gap-2 rounded-sm bg-panel px-2 text-left">
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] text-ink-faint">{label}</span>
        <span className="block truncate text-[13px] font-semibold">{name}</span>
        {note && <span className="block truncate text-[11px] text-ink-soft">{note}</span>}
      </span>
    </button>
  )
  return (
    <section className="space-y-1.5 rounded-md bg-raised p-3">
      <h4 className="text-micro">Weapons</h4>
      {weapons.map((w: RpgWeapon, i) => {
        const id = uma.gear.equipped[w]
        const out = id ? outputView(id) : null
        return row(`w${i}`, `Weapon ${i + 1}`, out ? <ItemIcon id={out.icon} size={28} /> : <TrainingIcon weapon={w} />,
          out ? `${out.name} · G${out.grade}` : `${trainingName(w)} · G0`, () => setOpen({ weapon: i }))
      })}
      <h4 className="text-micro pt-1.5">Armor</h4>
      {ARMOR_SLOTS.map((slot) => {
        const id = uma.gear.equipped[slot]
        const out = id ? outputView(id) : null
        const kind = slotKind(uma.gear, slot)
        return row(slot, ARMOR_SLOT_LABEL[slot], out ? <ItemIcon id={out.icon} size={28} />
          : <span className="flex size-7 shrink-0 items-center justify-center rounded-xs border border-dashed border-hairline-strong opacity-70"><ArmorMark kind={kind} size={20} /></span>,
        out ? `${out.name} · G${out.grade}` : `${trainingArmorName(kind)} · G0`, () => setOpen({ armor: slot }))
      })}
      <h4 className="text-micro pt-1.5">Accessories</h4>
      {ACCESSORY_SLOTS.map((slot) => {
        const id = uma.gear.equipped[slot]
        const out = id ? outputView(id) : null
        return row(slot, ACCESSORY_SLOT_LABEL[slot], out ? <ItemIcon id={out.icon} size={28} />
          : <span className="flex size-7 shrink-0 items-center justify-center rounded-xs border border-dashed border-hairline-strong text-ink-faint">+</span>,
        out ? `${out.name} · G${out.grade}` : 'Empty', () => setOpen({ accessory: slot }), id ? pieceLine(id) : undefined)
      })}
      {open && 'weapon' in open && (
        <WeaponSheet outfitId={outfit.outfitId} uma={uma} world={world} classId={classId} slot={open.weapon} onClose={() => setOpen(null)} />
      )}
      {open && 'armor' in open && <ArmorSheet outfitId={outfit.outfitId} uma={uma} world={world} slot={open.armor} onClose={() => setOpen(null)} />}
      {open && 'accessory' in open && <AccessorySheet outfitId={outfit.outfitId} uma={uma} world={world} slot={open.accessory} onClose={() => setOpen(null)} />}
    </section>
  )
}
