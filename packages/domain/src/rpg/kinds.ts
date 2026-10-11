// RPG vocabulary (D86, docs/design/class-rework.md): ten weapons, ten damage kinds, five classes. Arms deal their own
// kind; a Tome deals its element. Every kind has one shape in every class: Greatsword and Fire hit one foe hard, Axe
// and Ice every foe, Lance and Lightning random foes, Bow and Light one foe many times, Katana and Dark twice.

/** Elements that can be weaknesses. Fire > Ice > Lightning > Fire; Light ↔ Dark. */
export const RPG_ELEMENTS = ['fire', 'ice', 'lightning', 'light', 'dark'] as const
export type RpgElement = typeof RPG_ELEMENTS[number]
/** Arms: the physical weapons, each its own weakness kind. */
export const RPG_WEAPON_KINDS = ['greatsword', 'axe', 'lance', 'bow', 'katana'] as const
export type RpgWeaponKind = typeof RPG_WEAPON_KINDS[number]
/** Tomes: the magic weapons, one per element. */
export const RPG_TOMES = ['tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark'] as const
export type RpgTome = typeof RPG_TOMES[number]
export const RPG_WEAPONS = [...RPG_WEAPON_KINDS, ...RPG_TOMES] as const
export type RpgWeapon = typeof RPG_WEAPONS[number]
/** The ten kinds a hit can carry and a foe can be weak to. */
export type RpgDamageKind = RpgWeaponKind | RpgElement
export const RPG_DAMAGE_KINDS: readonly RpgDamageKind[] = [...RPG_WEAPON_KINDS, ...RPG_ELEMENTS]
export const RPG_CLASSES = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner'] as const
export type RpgClass = typeof RPG_CLASSES[number]
/** A class's tree for one weapon: `brawler-greatsword`, `mage-tome-fire`. */
export type RpgTreeId = `${RpgClass}-${RpgWeapon}`

export const isRpgWeaponKind = (kind: unknown): kind is RpgWeaponKind => RPG_WEAPON_KINDS.includes(kind as RpgWeaponKind)
export const isRpgElement = (kind: unknown): kind is RpgElement => RPG_ELEMENTS.includes(kind as RpgElement)
export const isRpgTome = (w: unknown): w is RpgTome => RPG_TOMES.includes(w as RpgTome)
export const isRpgWeapon = (w: unknown): w is RpgWeapon => RPG_WEAPONS.includes(w as RpgWeapon)
export const isRpgDamageKind = (k: unknown): k is RpgDamageKind => isRpgWeaponKind(k) || isRpgElement(k)
export const rpgPhysical = (kind: RpgDamageKind): boolean => isRpgWeaponKind(kind)
/** The kind a weapon deals: an Arm its own, a Tome its element. */
export const rpgWeaponKind = (w: RpgWeapon): RpgDamageKind => (isRpgTome(w) ? (w.slice('tome-'.length) as RpgElement) : w)
/** The Tome of an element. */
export const rpgTomeOf = (element: RpgElement): RpgTome => `tome-${element}` as RpgTome
/** Each Arm and the element that shares its shape (D86). */
export const RPG_KIND_PAIRS: readonly (readonly [RpgWeaponKind, RpgElement])[] = [
  ['greatsword', 'fire'], ['axe', 'ice'], ['lance', 'lightning'], ['bow', 'light'], ['katana', 'dark'],
]

/** The element a foe of this element is weak to. */
export function rpgElementWeakness(element: RpgElement): RpgElement {
  return ({ fire: 'lightning', ice: 'fire', lightning: 'ice', light: 'dark', dark: 'light' } as const)[element]
}
/** The element this one beats: Fire beats Ice, Ice beats Lightning, Lightning beats Fire. */
export function rpgElementBeats(element: 'fire' | 'ice' | 'lightning'): 'fire' | 'ice' | 'lightning' {
  return ({ fire: 'ice', ice: 'lightning', lightning: 'fire' } as const)[element]
}

/** Statuses on foes (from allies) and on allies (from the Cleric and summons), plus the foes' own D265 statuses. */
export type RpgStatusKind =
  | 'burn' | 'enfeeble' | 'shock' | 'armor-break' | 'mind-break' | 'hex'
  | 'brave' | 'faith' | 'breaker' | 'aegis'
  | 'slow' | 'mark' | 'weaken' | 'ward' | 'power-up'
