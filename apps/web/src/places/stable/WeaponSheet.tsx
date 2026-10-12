// One of a class's five weapon slots (D98) or one of her five armor slots (D103): the weapon she holds there opens its
// skill tree; the armor kind decides her Barrier or Regen. Every Uma holds a Training
// weapon of each kind (grade 0, no stats); a crafted piece of the kind adds its stats. A Summoner, Spell Blade or Cleric
// chooses each slot's weapon within the slot's kind; a Brawler's and a Mage's slots keep theirs.
import {
  ARMOR_LABEL, ARMOR_SLOT_KINDS, ARMOR_SLOT_LABEL, armorKindOf, classOf, EFFECT_LABEL, equipBlock, gearById, gearPoints, isMagicalArmor, isRpgTome,
  isWeapon, ITEM_EFFECTS, MIGHT_PER_GRADE, RPG_CLASS_SLOTS, rpgClassWeapons, rpgPicksWeapons, SaveRuleError, slotKind, type ArmorKind, type ArmorSlot,
  type OwnedUma, type RpgClass, type RpgWeapon, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { SLOT_LABEL, trainingName, WEAPON_LABEL, WeaponGlyph } from '../../battle/labels'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { hold, wearArmorPiece } from '../../save/game'
import { ArmorMark } from '../../ui/RankBars'
import { BottomSheet } from '../../ui/BottomSheet'
import { pointText } from '../observatory/ObservatoryPage'

/** What a piece does, in one line: a weapon's Might, armor's stats with its Barrier or Regen, an Orb's kind (D104). */
export function pieceLine(id: string): string {
  const piece = gearById(id)
  if (!piece) return ''
  if (isWeapon(piece.type)) return `Might +${piece.grade * MIGHT_PER_GRADE} on its hits`
  const p = gearPoints(piece)
  const stats = ITEM_EFFECTS.filter((e) => p[e]).map((e) => `${EFFECT_LABEL[e]} ${pointText(e, p[e])}`)
  const kind = armorKindOf(piece.type as Exclude<typeof piece.type, RpgWeapon>)
  if (kind === 'arms-orb' || kind === 'elemental-orb') return 'Its kind on every hit, for weaknesses'
  return [...stats, isMagicalArmor(kind) ? `Regen ${piece.grade}` : `Barrier ${piece.grade * 5}`].join(' · ')
}

/** What a slot holds: the weapon and its piece (null for the Training one). */
export function heldIn(uma: OwnedUma, classId: RpgClass, slot: number): { weapon: RpgWeapon; gearId: string | null } {
  const weapon = classOf(uma, classId).weapons[slot]!
  return { weapon, gearId: uma.gear.equipped[weapon] ?? null }
}

/** A Training weapon's icon: the weapon's mark in an empty frame. */
export function TrainingIcon({ weapon, size = 28 }: { weapon: RpgWeapon; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-xs border border-dashed border-hairline-strong text-ink-soft" style={{ width: size, height: size }}>
      <WeaponGlyph weapon={weapon} size={Math.round(size * 0.6)} />
    </span>
  )
}

export function WeaponSheet({ outfitId, uma, world, classId, slot, onClose }: {
  outfitId: string; uma: OwnedUma; world: TierWorld; classId: RpgClass; slot: number; onClose: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const weapons = classOf(uma, classId).weapons
  const kind = RPG_CLASS_SLOTS[classId][slot]!
  const here = weapons[slot]!
  const kinds = rpgPicksWeapons(classId)
    ? [here, ...rpgClassWeapons(classId).filter((w) => w !== here && (kind === 'any' || (kind === 'tome') === isRpgTome(w)))]
    : [here]
  const pieces = (w: RpgWeapon) => [
    ...uma.gear.locker.filter((id) => gearById(id)?.type === w).map((id) => ({ id, bound: true })),
    ...Object.keys(world.gear).filter((id) => gearById(id)?.type === w && !uma.gear.locker.includes(id)).map((id) => ({ id, bound: false })),
  ]
  const held = (w: RpgWeapon, id: string | null) => here === w && (uma.gear.equipped[w] ?? null) === id
  const choose = (w: RpgWeapon, id: string | null) =>
    hold(outfitId, classId, slot, w, id).then(onClose, (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  return (
    <BottomSheet title={`Slot ${slot + 1} · ${SLOT_LABEL[kind]}`} onClose={onClose}>
      <div className="space-y-3">
        {kinds.map((w) => (
          <section key={w}>
            <h4 className="text-micro mb-1">
              {WEAPON_LABEL[w]}{weapons.includes(w) && w !== here ? ` · swaps with slot ${weapons.indexOf(w) + 1}` : ''}
            </h4>
            <ul className="space-y-1">
              <li>
                <button type="button" disabled={held(w, null)} onClick={() => void choose(w, null)}
                  className={`flex w-full items-center gap-2 rounded-sm p-2 text-left ${held(w, null) ? 'bg-accent/15 ring-1 ring-accent' : 'bg-raised'}`}>
                  <TrainingIcon weapon={w} size={32} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">{trainingName(w)} · G0</span>
                    <span className="block text-[11px] text-ink-soft">No stats</span>
                  </span>
                  <span className="shrink-0 text-[11px] text-ink-faint">{held(w, null) ? 'Held' : 'Hers'}</span>
                </button>
              </li>
              {pieces(w).map(({ id, bound }) => {
                const block = equipBlock(uma, id)
                const out = outputView(id)
                return (
                  <li key={id}>
                    <button type="button" disabled={!!block || held(w, id)} onClick={() => void choose(w, id)}
                      className={`flex w-full items-center gap-2 rounded-sm p-2 text-left disabled:opacity-60 ${held(w, id) ? 'bg-accent/15 ring-1 ring-accent' : 'bg-raised'}`}>
                      <ItemIcon id={out.icon} size={32} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold">{out.name} · G{out.grade}</span>
                        <span className="block text-[11px] text-ink-soft">{block ?? pieceLine(id)}</span>
                      </span>
                      <span className="shrink-0 text-[11px] text-ink-faint">{held(w, id) ? 'Held' : bound ? 'Hers' : `Stock ×${world.gear[id]} · binds`}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
        {error && <p className="text-[13px] text-danger">{error}</p>}
      </div>
    </BottomSheet>
  )
}

/** The Training piece's name for an armor kind: "Training Helm". */
export const trainingArmorName = (kind: ArmorKind): string => `Training ${ARMOR_LABEL[kind]}`

/** One of her five armor slots (D103): its physical or magical kind, as a Training piece or a crafted one. */
export function ArmorSheet({ outfitId, uma, world, slot, onClose }: { outfitId: string; uma: OwnedUma; world: TierWorld; slot: ArmorSlot; onClose: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const here = slotKind(uma.gear, slot)
  const kinds = [here, ...ARMOR_SLOT_KINDS[slot].filter((k) => k !== here)] as ArmorKind[]
  const ofKind = (id: string, kind: ArmorKind) => { const p = gearById(id); return !!p && !isWeapon(p.type) && armorKindOf(p.type) === kind }
  const pieces = (kind: ArmorKind) => [
    ...uma.gear.locker.filter((id) => ofKind(id, kind)).map((id) => ({ id, bound: true })),
    ...Object.keys(world.gear).filter((id) => ofKind(id, kind) && !uma.gear.locker.includes(id)).map((id) => ({ id, bound: false })),
  ]
  const held = (kind: ArmorKind, id: string | null) => here === kind && (uma.gear.equipped[slot] ?? null) === id
  const choose = (kind: ArmorKind, id: string | null) =>
    wearArmorPiece(outfitId, slot, kind, id).then(onClose, (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  return (
    <BottomSheet title={ARMOR_SLOT_LABEL[slot]} onClose={onClose}>
      <div className="space-y-3">
        {kinds.map((kind) => (
          <section key={kind}>
            <h4 className="text-micro mb-1">{ARMOR_LABEL[kind]} · {isMagicalArmor(kind) ? 'Magical' : 'Physical'}</h4>
            <ul className="space-y-1">
              <li>
                <button type="button" disabled={held(kind, null)} onClick={() => void choose(kind, null)}
                  className={`flex w-full items-center gap-2 rounded-sm p-2 text-left ${held(kind, null) ? 'bg-accent/15 ring-1 ring-accent' : 'bg-raised'}`}>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xs border border-dashed border-hairline-strong opacity-70"><ArmorMark kind={kind} size={22} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">{trainingArmorName(kind)} · G0</span>
                    <span className="block text-[11px] text-ink-soft">No stats</span>
                  </span>
                  <span className="shrink-0 text-[11px] text-ink-faint">{held(kind, null) ? 'Worn' : 'Hers'}</span>
                </button>
              </li>
              {pieces(kind).map(({ id, bound }) => {
                const block = equipBlock(uma, id)
                const out = outputView(id)
                return (
                  <li key={id}>
                    <button type="button" disabled={!!block || held(kind, id)} onClick={() => void choose(kind, id)}
                      className={`flex w-full items-center gap-2 rounded-sm p-2 text-left disabled:opacity-60 ${held(kind, id) ? 'bg-accent/15 ring-1 ring-accent' : 'bg-raised'}`}>
                      <ItemIcon id={out.icon} size={32} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold">{out.name} · G{out.grade}</span>
                        <span className="block text-[11px] text-ink-soft">{block ?? pieceLine(id)}</span>
                      </span>
                      <span className="shrink-0 text-[11px] text-ink-faint">{held(kind, id) ? 'Worn' : bound ? 'Hers' : `Stock ×${world.gear[id]} · binds`}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
        {error && <p className="text-[13px] text-danger">{error}</p>}
      </div>
    </BottomSheet>
  )
}
