import {
  ACCESSORY_FAMILIES, ACCESSORY_FAMILY_LABEL, RPG_DAMAGE_KINDS, rpgWeaponKind, WEAPON_LABEL,
  type AccessoryFamily, type RpgClass, type RpgDamageKind, type RpgWeapon,
} from '@rpg/domain'

export interface AccessoryChoiceV3 {
  family: AccessoryFamily
  label: string
  signature: boolean
  kinds: readonly { kind: RpgDamageKind; label: string }[]
}

/** The four base families, her signature first. Orbs offer ten kinds; Bells only her three weapon kinds. */
export function accessoryChoicesV3(signature: AccessoryFamily, weapons: readonly RpgWeapon[], _classId: RpgClass): AccessoryChoiceV3[] {
  const ordered = [signature, ...ACCESSORY_FAMILIES.filter((family) => family !== signature)]
  return ordered.map((family) => ({
    family, label: ACCESSORY_FAMILY_LABEL[family], signature: family === signature,
    kinds: family === 'orb' ? RPG_DAMAGE_KINDS.map((kind) => ({ kind, label: kind[0]!.toUpperCase() + kind.slice(1) }))
      : family === 'bell' ? weapons.map((weapon) => ({ kind: rpgWeaponKind(weapon), label: WEAPON_LABEL[weapon] })) : [],
  }))
}
