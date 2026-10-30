// The profile wording shared by the domain-built battle sheet and the lazy web screens (D251, H117).
// C1–C10: facts are labels and numbers, never narration; each fact has one builder and one number format.
import { BATTLE_FLOURISH_FROM, BATTLE_FLOURISH_RATE, BATTLE_FLOURISH_SHARE } from '../rpg/battle/caps'
import type { RpgFlourish } from '../rpg/battle/types'
import type { RpgDamageKind } from '../rpg/kinds'
import { ACCESSORY_FAMILY_LABEL, accessoryFlatValue } from '../economy/accessories'
import type { AccessoryFamily, GearTier } from '../economy/grades'

const pct = (share: number): string => `${Math.round(share * 1000) / 10}%`
const number = (value: number): string => value.toLocaleString('en-US')
const kindName = (kind: RpgDamageKind): string => kind[0]!.toUpperCase() + kind.slice(1)

/** C1, C3 and C8: an accessory's one effect wording; G0 is always Off. */
export function accessoryEffect(family: AccessoryFamily, grade: number, tier: GearTier, kind?: RpgDamageKind | null): string {
  if (grade < 1) return 'Off'
  if (family === 'pendant') return `+${number(accessoryFlatValue(family, grade, tier))} · 3 kinds`
  if (family === 'orb') return `${kind ? kindName(kind) : 'Kind'} +${number(accessoryFlatValue(family, grade, tier))}`
  if (family === 'bell') return `${kind ? kindName(kind) : 'Extra hit'} ×${(grade / 10).toFixed(1)}`
  return `Bosses +${(grade * 1.5).toLocaleString('en-US', { maximumFractionDigits: 1 })}%`
}

/** C3 and C8: the complete Flourish fact, with its one state word. */
export function flourish(value: RpgFlourish, on: boolean): string {
  const shape = value === 'clean-break' ? `Barrier ${pct(BATTLE_FLOURISH_SHARE)} · start`
    : value === 'even-pace' ? `${pct(BATTLE_FLOURISH_RATE['even-pace'])}/round · max ${pct(BATTLE_FLOURISH_SHARE)}`
    : `round ${BATTLE_FLOURISH_FROM}+ · ${pct(BATTLE_FLOURISH_RATE['late-reserve'])}/round · max ${pct(BATTLE_FLOURISH_SHARE)}`
  const name = value === 'clean-break' ? 'Clean break' : value === 'even-pace' ? 'Even pace' : 'Late reserve'
  return `★ Flourish · ${name} · ${shape} · ${on ? 'On' : 'Off'}`
}

/** C1 and C7: a signature is always listed, including Not worn. */
export const signature = (value: number, worn: boolean): string =>
  `★ Signature · ATK/M.ATK +${number(value)} · ${worn ? 'Worn' : 'Not worn'}`

/** C1 and C8: the whole Limit Break starting gauge. */
export const limitStart = (value: number, max: number): string => `Limit start ${number(value)}/${number(max)}`

/** C1 and C8: MP and its per-round recovery. */
export const mp = (value: number, regen: number): string => `MP ${number(value)} · +${number(regen)}/round`

/** The family label beside an effect, kept here so every domain consumer uses the same separator. */
export const accessoryLine = (family: AccessoryFamily, effect: string): string => `${ACCESSORY_FAMILY_LABEL[family]} · ${effect}`
