// The v1 economy's display names (D144, D124; kept by D218 for the engine-16 tests and the v1 screens): its 160 raw and
// refined items, their eight families, its gear ("Copper Greatsword") and its Star Gems ("Garnet of Strength"). No v28+
// world holds a v1 id, so nothing live reads them; this is the only module that imports `families.ts`, and both load on
// demand, never in the main bundle (H136, scripts/check-size.mjs). The rules read the id-level catalog (`catalog.ts`).
import { isMagicalGear } from '../economy/gear'
import { EQUIP_LABEL, gearIdentity, type EquipType } from '../economy/gear-id'
import { gemIdentity } from '../economy/stars'
import { FAMILY_SPECS } from './families'
import type { ItemEffect } from './kinds'
import { lineItem } from './lines'
import { madeName } from './made'

const ITEM_NAME = new Map(FAMILY_SPECS.flatMap((f) => [...f.raw, ...f.refined]))
const FAMILY_NAME = new Map(FAMILY_SPECS.map((f) => [f.id, f.name]))
const rawName = (family: string, grade: number): string => FAMILY_SPECS.find((f) => f.id === family)!.raw[grade - 1]![1]

/** A v1 raw or refined item's name: "Copper Ore", "Copper Ingot". */
export const itemNameV1 = (id: string): string | undefined => ITEM_NAME.get(id)
/** A v1 item family's name: "Ores", "Hides & Scales". */
export const familyNameV1 = (id: string): string | undefined => FAMILY_NAME.get(id)

/** A grade's prefix from its half's first family: "Copper", "Quartz". */
const gradeWord = (type: EquipType, grade: number): string =>
  rawName(isMagicalGear(type) ? 'crystals' : 'ores', grade).replace(/ (Ore|Log|Pelt|Hide|Scale|Bundle|Crystal|Shard|Fiber|Essence|Bone|Horn|Stone)$/, '')
/** A v1 gear piece's name: "Copper Greatsword", "Quartz Fire Tome". */
export function gearNameV1(id: string): string | undefined {
  const piece = gearIdentity(id)
  return piece ? `${gradeWord(piece.type, piece.grade)} ${EQUIP_LABEL[piece.type]}` : undefined
}

/** Each stat's virtue in a Star Gem's name. */
export const VIRTUE: Readonly<Record<ItemEffect, string>> = {
  hp: 'Vigor', mp: 'Spirit', atk: 'Strength', matk: 'Sorcery', def: 'Fortitude', mdef: 'Resolve', speed: 'Swiftness', limit: 'Valor',
}
/** A v1 Star Gem's name: its grade's stone on the Crystal Cavern's ladder and its stat's virtue, "Garnet of Strength",
 * "Ruby of Vigor & Fortitude", "Diamond of the Sun". */
export function gemNameV1(id: string): string | undefined {
  const gem = gemIdentity(id)
  if (!gem) return undefined
  const stone = rawName('crystals', gem.grade)
  if (gem.kind === 'sun') return `${stone} of the Sun`
  return `${stone} of ${gem.effects.map((e) => VIRTUE[e]).join(' & ')}`
}

/** A Warehouse name across both economies: a line item, a made item, a v1 item, a Star Gem, a v1 gear piece, else the id. */
export const stockNameV1 = (id: string): string =>
  lineItem(id)?.name ?? madeName(id) ?? itemNameV1(id) ?? gemNameV1(id) ?? gearNameV1(id) ?? id
