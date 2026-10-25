// One of a class's weapon slots (D98; five to v15, three by channel from v16), one of her five armor slots (D103, D124)
// or one of her two accessory slots: the weapon she holds there opens its skill tree; armor adds its stats; an accessory
// its kind or a defensive effect (from classes v2 the slots are typed, Damage for an Orb's flat offense and Support for a
// Talisman or an Amulet, H59). Every Uma holds a Training weapon and armor piece of each kind (grade 0, no stats), shown
// only until she binds its grade 1. A class that picks (`rpgPicksWeapons`: to v15 the Summoner, Spell Blade and Cleric,
// from v16 every class, CP12) chooses each slot's weapon among her class's kinds of the slot's channel; the others keep
// theirs. She binds each kind's grades in order (D119): the sheet shows her best piece and the stock above it, never the
// grades she has spent.
import {
  ACCESSORY_LABEL, ACCESSORY_SLOT_LABEL, ACCESSORY_SLOTS, accessoryEffects, ARMOR_LABEL, ARMOR_SLOT_KINDS, ARMOR_SLOT_LABEL, BATTLE_ENGINE_VERSION,
  boundGrade, classOf, EFFECT_LABEL, EQUIP_LABEL, equipBlock, gearById, gearChoices, gearPoints, isAccessory, isMagicalArmor, isOrb, isRpgTome,
  isWeapon, ITEM_EFFECTS, mightOf, RPG_CLASS_SLOTS, rpgClassWeapons, rpgPicksWeapons, rpgV2, SaveRuleError, slotKind,
  type AccessoryEffects, type AccessorySlot, type ArmorKind, type ArmorSlot, type OwnedUma, type RpgClass, type RpgDamageKind, type RpgWeapon,
  type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { kindLabel, SLOT_LABEL, trainingName, WEAPON_LABEL, WeaponGlyph } from '../../battle/labels'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { hold, wearAccessoryPiece, wearArmorPiece } from '../../save/game'
import { ArmorMark } from '../../ui/RankBars'
import { BottomSheet } from '../../ui/BottomSheet'
import { pointText } from '../../items/planets'
import { accessorySheetTypes, noAccessories } from './accessory-slots'

/** Accessories' defensive effects, one phrase each (D124). Regen and the two shields are shares of her max HP (D141). */
export function effectLines(a: AccessoryEffects): string[] {
  const pct = (permille: number) => `${permille / 10}%`
  return [
    a.regen && `Heals ${pct(a.regen)} of her HP a round`, a.mpRegen && `Restores ${a.mpRegen} MP a round`,
    a.lifesteal && `Heals ${pct(a.lifesteal)} of physical damage dealt`, a.mpSteal && `MP from ${pct(a.mpSteal)} of magical damage dealt`,
    a.barrier && `Shield of ${pct(a.barrier)} of her HP vs physical`, a.veil && `Shield of ${pct(a.veil)} of her HP vs magical`,
    a.guard && `${pct(a.guard)} less physical damage`, a.resist && `${pct(a.resist)} less magical damage`,
    a.thorns && `Returns ${pct(a.thorns)} of physical damage`, a.mirror && `Returns ${pct(a.mirror)} of magical damage`,
  ].filter((x): x is string => !!x)
}

/** What a piece does, in one line: a weapon's Might, armor's stats, an Orb's kind (classes v2: its flat offense, "+34 Fire
 * offense"), an accessory's effect (D104, D124, D182). */
export function pieceLine(id: string, engine: number = BATTLE_ENGINE_VERSION): string {
  const piece = gearById(id)
  if (!piece) return ''
  if (isWeapon(piece.type)) return `Might +${mightOf(piece.grade)} on its hits`
  if (isOrb(piece.type)) {
    if (!rpgV2(engine)) return 'Its kind on every hit, for weaknesses'
    return Object.entries(accessoryEffects(piece, engine).orbMight ?? {}).map(([kind, n]) => `+${n} ${kindLabel(kind as RpgDamageKind)} offense`).join(' · ')
  }
  if (isAccessory(piece.type)) return effectLines(accessoryEffects(piece, engine)).join(' · ')
  const p = gearPoints(piece)
  return ITEM_EFFECTS.filter((e) => p[e]).map((e) => `${EFFECT_LABEL[e]} ${pointText(e, p[e])}`).join(' · ')
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
  const pieces = (w: RpgWeapon) => gearChoices(uma, world.gear, (p) => p.type === w)
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
              {boundGrade(uma, w) === 0 && <li>
                <button type="button" disabled={held(w, null)} onClick={() => void choose(w, null)}
                  className={`flex w-full items-center gap-2 rounded-sm p-2 text-left ${held(w, null) ? 'bg-accent/15 ring-1 ring-accent' : 'bg-raised'}`}>
                  <TrainingIcon weapon={w} size={32} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">{trainingName(w)} · G0</span>
                    <span className="block text-[11px] text-ink-soft">No stats</span>
                  </span>
                  <span className="shrink-0 text-[11px] text-ink-faint">{held(w, null) ? 'Held' : 'Hers'}</span>
                </button>
              </li>}
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
  const pieces = (kind: ArmorKind) => gearChoices(uma, world.gear, (p) => p.type === kind)
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
              {boundGrade(uma, kind) === 0 && <li>
                <button type="button" disabled={held(kind, null)} onClick={() => void choose(kind, null)}
                  className={`flex w-full items-center gap-2 rounded-sm p-2 text-left ${held(kind, null) ? 'bg-accent/15 ring-1 ring-accent' : 'bg-raised'}`}>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xs border border-dashed border-hairline-strong opacity-70"><ArmorMark kind={kind} size={22} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">{trainingArmorName(kind)} · G0</span>
                    <span className="block text-[11px] text-ink-soft">No stats</span>
                  </span>
                  <span className="shrink-0 text-[11px] text-ink-faint">{held(kind, null) ? 'Worn' : 'Hers'}</span>
                </button>
              </li>}
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

/** One of her two accessory slots (D124): any accessory it takes that she has bound or the stock holds, grouped by kind,
 * except the type she wears in the other slot. An empty slot holds nothing. */
export function AccessorySheet({ outfitId, uma, world, slot, onClose }: { outfitId: string; uma: OwnedUma; world: TierWorld; slot: AccessorySlot; onClose: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const here = uma.gear.equipped[slot] ?? null
  const other = ACCESSORY_SLOTS.find((s) => s !== slot)!
  const otherType = uma.gear.equipped[other] ? gearById(uma.gear.equipped[other]!)?.type : undefined
  const choose = (id: string | null) =>
    wearAccessoryPiece(outfitId, slot, id).then(onClose, (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  const groups = accessorySheetTypes(slot, otherType).map(({ kind, types }) => ({
    kind, types: types.map((t) => ({ t, pieces: gearChoices(uma, world.gear, (p) => p.type === t) })).filter((x) => x.pieces.length > 0),
  })).filter((g) => g.types.length > 0)
  return (
    <BottomSheet title={ACCESSORY_SLOT_LABEL[slot]} onClose={onClose}>
      <div className="space-y-3">
        {here && (
          <button type="button" onClick={() => void choose(null)} className="min-h-11 w-full rounded-sm border border-hairline-strong text-[13px] font-semibold text-ink-soft">
            Take it off (it stays hers)
          </button>
        )}
        {groups.length === 0 && <p className="text-[13px] text-ink-soft">{noAccessories(slot)}</p>}
        {groups.map(({ kind, types }) => (
          <section key={kind}>
            <h4 className="text-micro mb-1">{ACCESSORY_LABEL[kind]}</h4>
            <ul className="space-y-1">
              {types.flatMap(({ t, pieces }) => pieces.map(({ id, bound }) => {
                const block = equipBlock(uma, id)
                const out = outputView(id)
                const worn = here === id
                return (
                  <li key={id}>
                    <button type="button" disabled={!!block || worn} onClick={() => void choose(id)}
                      className={`flex w-full items-center gap-2 rounded-sm p-2 text-left disabled:opacity-60 ${worn ? 'bg-accent/15 ring-1 ring-accent' : 'bg-raised'}`}>
                      <ItemIcon id={out.icon} size={32} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold">{EQUIP_LABEL[t]} · G{out.grade}</span>
                        <span className="block text-[11px] text-ink-soft">{block ?? pieceLine(id)}</span>
                      </span>
                      <span className="shrink-0 text-[11px] text-ink-faint">{worn ? 'Worn' : bound ? 'Hers' : `Stock ×${world.gear[id]} · binds`}</span>
                    </button>
                  </li>
                )
              }))}
            </ul>
          </section>
        ))}
        {error && <p className="text-[13px] text-danger">{error}</p>}
      </div>
    </BottomSheet>
  )
}
