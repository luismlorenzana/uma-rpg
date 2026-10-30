// One of a class's weapon slots (D98; five to v15, three by channel from v16): the weapon she holds there opens its skill
// tree. Every Uma holds a Training weapon of each kind (grade 0, no stats), shown only until she binds its grade 1. A class
// that picks (`rpgPicksWeapons`: to v15 the Summoner, Spell Blade and Cleric, from v16 every class, CP12) chooses each
// slot's weapon among her class's kinds of the slot's channel; the others keep theirs. From R2 (H82) the sheet lists her
// weapons by grade. v1's armor and accessory sheets retired with the Gear tab's v1 path (H107); `pieceLine` and
// `effectLines` still describe a piece for the work pages.
import {
  accessoryEffects, BATTLE_ENGINE_VERSION,
  boundGrade, classOf, EFFECT_LABEL, equipBlock, gearById, gearChoices, gearPoints, gearStock, gearV1, isAccessory, isGrades, isOrb,
  isRpgTome, isWeapon, ITEM_EFFECTS, mightOf, RPG_CLASS_SLOTS, rpgClassWeapons, rpgPicksWeapons, rpgV2, SaveRuleError,
  type AccessoryEffects, type OwnedUma, type RpgClass, type RpgDamageKind, type RpgWeapon,
  type GearTier, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { kindLabel, SLOT_LABEL, trainingName, WEAPON_LABEL, WeaponGlyph } from '../../battle/labels'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { hold, useActiveTier } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { pointText } from '../../items/planets'
import { weaponGradeLine } from './gear-v3'

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
  return { weapon, gearId: gearV1(uma).equipped[weapon] ?? null }
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
  const gear = gearV1(uma)
  const weapons = classOf(uma, classId).weapons
  const kind = RPG_CLASS_SLOTS[classId][slot]!
  const here = weapons[slot]!
  const kinds = rpgPicksWeapons(classId)
    ? [here, ...rpgClassWeapons(classId).filter((w) => w !== here && (kind === 'any' || (kind === 'tome') === isRpgTome(w)))]
    : [here]
  const pieces = (w: RpgWeapon) => gearChoices(uma, gearStock(world), (p) => p.type === w)
  const held = (w: RpgWeapon, id: string | null) => here === w && (gear.equipped[w] ?? null) === id
  // A graded Uma (save v28, R2): a weapon is a grade she raises on the Gear tab, so the sheet only picks the slot's weapon.
  const graded = isGrades(uma.gear) ? uma.gear : null
  const tier = Math.min(3, useActiveTier()) as GearTier
  const choose = (w: RpgWeapon, id: string | null) =>
    hold(outfitId, classId, slot, w, id).then(onClose, (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  return (
    <BottomSheet title={`Slot ${slot + 1} · ${SLOT_LABEL[kind]}`} onClose={onClose}>
      <div className="space-y-3">
        {graded ? <ul className="space-y-1">
          {kinds.map((w) => {
            const otherSlot = weapons.indexOf(w)
            return <li key={w}>
              <button type="button" disabled={here === w} onClick={() => void choose(w, null)}
                className={`flex min-h-11 w-full items-center gap-2 rounded-sm p-2 text-left ${here === w ? 'bg-accent/15 ring-1 ring-accent' : 'bg-raised'}`}>
                <TrainingIcon weapon={w} size={32} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{weaponGradeLine(graded, w, tier)}</span>
                <span className="shrink-0 text-[11px] text-ink-faint">{here === w ? 'Held' : otherSlot >= 0 ? `Slot ${otherSlot + 1}` : ''}</span>
              </button>
            </li>
          })}
        </ul> : kinds.map((w) => (
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
                      <span className="shrink-0 text-[11px] text-ink-faint">{held(w, id) ? 'Held' : bound ? 'Hers' : `Stock ×${gearStock(world)[id]} · binds`}</span>
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
