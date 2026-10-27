// The materials (D224; farm-by-line.md FL5, FL8, FL14, FL15; H109, live since H112): five lines of ten grades, each
// grade a raw item and its refined form, the same fifty types in every world. Each line is one uma-art family of its
// `items` atlas (ores, woods, vegetables, fish, crystals) and a grade its family's grade, so ids, names and icons are
// uma-art's own. R2's sixty ids (save v28–v29) are among them; save v30's migration moved each to its line's G1 or G6
// (`toV30`). Many ids are also legacy ids (`identity.ts`) with another meaning; the economy stage decides (D208).

export const MATERIAL_LINES = ['metal', 'wood', 'vegetables', 'fish', 'stone'] as const
/** A gathering profession's material: Mining metal, Wood Chopping wood, Farming vegetables, Fishing fish, Hunting stone. */
export type MaterialLine = typeof MATERIAL_LINES[number]

/** uma-art's item family a line's icons belong to (Farming's and Fishing's are the old farm's, gone since save v21). */
export type MaterialArtFamily = 'ores' | 'woods' | 'vegetables' | 'fish' | 'crystals'
export const LINE_ART_FAMILY: Readonly<Record<MaterialLine, MaterialArtFamily>> = {
  metal: 'ores', wood: 'woods', vegetables: 'vegetables', fish: 'fish', stone: 'crystals',
}

/** The words an id spells without their marks. */
const MARKED: Readonly<Record<string, string>> = { puree: 'Purée', philosophers: "Philosopher's" }
/** An item's name from its uma-art id: its words capitalized, two keeping their marks ("Tomato Purée"). */
export const itemNameOf = (id: string): string => id.split('-').map((w) => MARKED[w] ?? w[0]!.toUpperCase() + w.slice(1)).join(' ')

/** The ten grades of a line, raw then refined, as uma-art's family holds them (FL5). */
const LINE_GRADES: Readonly<Record<MaterialLine, readonly (readonly [string, string])[]>> = {
  metal: [['copper-ore', 'copper-ingot'], ['tin-ore', 'tin-ingot'], ['iron-ore', 'iron-ingot'], ['silver-ore', 'silver-ingot'],
    ['cobalt-ore', 'cobalt-ingot'], ['gold-ore', 'gold-ingot'], ['platinum-ore', 'platinum-ingot'], ['titanium-ore', 'titanium-ingot'],
    ['mythril-ore', 'mythril-ingot'], ['orichalcum-ore', 'orichalcum-ingot']],
  wood: [['pine-log', 'pine-plank'], ['birch-log', 'birch-plank'], ['cedar-log', 'cedar-plank'], ['maple-log', 'maple-plank'],
    ['oak-log', 'oak-plank'], ['cherry-log', 'cherry-plank'], ['mahogany-log', 'mahogany-plank'], ['ebony-log', 'ebony-plank'],
    ['elderwood-log', 'elderwood-plank'], ['yggdrasil-branch', 'yggdrasil-plank']],
  vegetables: [['carrot', 'chopped-carrot'], ['potato', 'diced-potato'], ['cabbage', 'shredded-cabbage'], ['onion', 'diced-onion'],
    ['tomato', 'tomato-puree'], ['bell-pepper', 'sliced-bell-pepper'], ['eggplant', 'sliced-eggplant'], ['asparagus', 'trimmed-asparagus'],
    ['golden-carrot', 'golden-carrot-puree'], ['emperor-pumpkin', 'pumpkin-puree']],
  fish: [['carp', 'carp-fillet'], ['trout', 'trout-fillet'], ['sardine', 'sardine-fillet'], ['mackerel', 'mackerel-fillet'],
    ['salmon', 'salmon-fillet'], ['sea-bream', 'sea-bream-fillet'], ['eel', 'eel-fillet'], ['tuna', 'tuna-fillet'],
    ['silverfin', 'silverfin-fillet'], ['rainbow-koi', 'rainbow-koi-fillet']],
  stone: [['quartz', 'cut-quartz'], ['amethyst', 'cut-amethyst'], ['citrine', 'cut-citrine'], ['garnet', 'cut-garnet'],
    ['emerald', 'cut-emerald'], ['sapphire', 'cut-sapphire'], ['ruby', 'cut-ruby'], ['diamond', 'cut-diamond'],
    ['starstone', 'cut-starstone'], ['philosophers-stone', 'cut-philosophers-stone']],
}
/** Grades a line holds. */
export const LINE_GRADE_COUNT = 10

/** A raw or refined item of a line: its grade opens it at Craft Lv 5g − 4 (FL6) and a grade-g made item takes it (FL7). */
export interface LineItem {
  id: string
  line: MaterialLine
  grade: number
  refined: boolean
  /** The other form: a raw item's refined id, a refined item's raw id. */
  pair: string
  name: string
  /** Its icon: uma-art's family and grade. */
  art: { family: MaterialArtFamily; grade: number }
}

/** The hundred ids: line by line (Metal, Wood, Vegetables, Fish, Stone), raw G1–G10, then refined G1–G10. */
export const LINE_ITEMS: readonly LineItem[] = MATERIAL_LINES.flatMap((line) => [false, true].flatMap((refined) =>
  LINE_GRADES[line].map(([raw, done], i): LineItem => {
    const id = refined ? done : raw
    return { id, line, grade: i + 1, refined, pair: refined ? raw : done, name: itemNameOf(id), art: { family: LINE_ART_FAMILY[line], grade: i + 1 } }
  })))

const BY_ID = new Map(LINE_ITEMS.map((m) => [m.id, m]))
export const lineItem = (id: string): LineItem | undefined => BY_ID.get(id)
export const isLineItemId = (id: string): boolean => BY_ID.has(id)

/** A line's raw or refined id at a grade. */
export function lineItemId(line: MaterialLine, grade: number, refined: boolean): string {
  const pair = LINE_GRADES[line][grade - 1]
  if (!pair) throw new RangeError(`No ${line} G${grade}`)
  return pair[refined ? 1 : 0]
}

/** A line's ten items of one form, G1 first. */
export const lineItems = (line: MaterialLine, refined: boolean): LineItem[] => LINE_ITEMS.filter((m) => m.line === line && m.refined === refined)
