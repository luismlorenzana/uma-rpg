// The item catalog (docs/archive/design/items.md, D18–D20, D144): eight Wilds families, one per effect, ten grades, each raw item
// with its one refined form. Ids match the icon atlas in @luismlorenzana/uma-art (P37); a web test keeps them in
// step. Generated once from the atlas index; edit both together.

import type { ItemEffect } from './kinds'
export * from './kinds'

interface FamilySpec {
  id: string
  name: string
  effect: ItemEffect
  /** The Hub site that produces it. */
  site: string
  raw: readonly (readonly [string, string])[]
  refined: readonly (readonly [string, string])[]
}

export const FAMILY_SPECS: readonly FamilySpec[] = [
  { id: 'hides-scales', name: "Hides & Scales", effect: 'hp', site: 'monster-den',
    raw: [['puffbun-pelt', "Puffbun Pelt"], ['boarling-hide', "Boarling Hide"], ['wolfkin-pelt', "Wolfkin Pelt"], ['rock-lizard-scale', "Rock Lizard Scale"], ['ironback-hide', "Ironback Hide"], ['basilisk-scale', "Basilisk Scale"], ['manticore-hide', "Manticore Hide"], ['behemoth-hide', "Behemoth Hide"], ['wyvern-scale', "Wyvern Scale"], ['dragon-scale', "Dragon Scale"]],
    refined: [['puffbun-leather', "Puffbun Leather"], ['boarling-leather', "Boarling Leather"], ['wolfkin-leather', "Wolfkin Leather"], ['lizard-leather', "Lizard Leather"], ['ironback-leather', "Ironback Leather"], ['basilisk-leather', "Basilisk Leather"], ['manticore-leather', "Manticore Leather"], ['behemoth-leather', "Behemoth Leather"], ['wyvern-leather', "Wyvern Leather"], ['dragonhide', "Dragonhide"]] },
  { id: 'essences', name: "Essences", effect: 'mp', site: 'ley-spring',
    raw: [['mist-essence', "Mist Essence"], ['dew-essence', "Dew Essence"], ['breeze-essence', "Breeze Essence"], ['ember-essence', "Ember Essence"], ['tide-essence', "Tide Essence"], ['spark-essence', "Spark Essence"], ['glimmer-essence', "Glimmer Essence"], ['shadow-essence', "Shadow Essence"], ['aether', "Aether"], ['prismatic-essence', "Prismatic Essence"]],
    refined: [['mist-infusion', "Mist Infusion"], ['dew-infusion', "Dew Infusion"], ['breeze-infusion', "Breeze Infusion"], ['ember-infusion', "Ember Infusion"], ['tide-infusion', "Tide Infusion"], ['spark-infusion', "Spark Infusion"], ['glimmer-infusion', "Glimmer Infusion"], ['shadow-infusion', "Shadow Infusion"], ['aether-infusion', "Aether Infusion"], ['prismatic-infusion', "Prismatic Infusion"]] },
  { id: 'ores', name: "Ores", effect: 'atk', site: 'mine',
    raw: [['copper-ore', "Copper Ore"], ['tin-ore', "Tin Ore"], ['iron-ore', "Iron Ore"], ['silver-ore', "Silver Ore"], ['cobalt-ore', "Cobalt Ore"], ['gold-ore', "Gold Ore"], ['platinum-ore', "Platinum Ore"], ['titanium-ore', "Titanium Ore"], ['mythril-ore', "Mythril Ore"], ['orichalcum-ore', "Orichalcum Ore"]],
    refined: [['copper-ingot', "Copper Ingot"], ['tin-ingot', "Tin Ingot"], ['iron-ingot', "Iron Ingot"], ['silver-ingot', "Silver Ingot"], ['cobalt-ingot', "Cobalt Ingot"], ['gold-ingot', "Gold Ingot"], ['platinum-ingot', "Platinum Ingot"], ['titanium-ingot', "Titanium Ingot"], ['mythril-ingot', "Mythril Ingot"], ['orichalcum-ingot', "Orichalcum Ingot"]] },
  { id: 'crystals', name: "Crystals", effect: 'matk', site: 'crystal-cavern',
    raw: [['quartz', "Quartz"], ['amethyst', "Amethyst"], ['citrine', "Citrine"], ['garnet', "Garnet"], ['emerald', "Emerald"], ['sapphire', "Sapphire"], ['ruby', "Ruby"], ['diamond', "Diamond"], ['starstone', "Starstone"], ['philosophers-stone', "Philosopher's Stone"]],
    refined: [['cut-quartz', "Cut Quartz"], ['cut-amethyst', "Cut Amethyst"], ['cut-citrine', "Cut Citrine"], ['cut-garnet', "Cut Garnet"], ['cut-emerald', "Cut Emerald"], ['cut-sapphire', "Cut Sapphire"], ['cut-ruby', "Cut Ruby"], ['cut-diamond', "Cut Diamond"], ['cut-starstone', "Cut Starstone"], ['cut-philosophers-stone', "Cut Philosopher's Stone"]] },
  { id: 'stones', name: "Stones", effect: 'def', site: 'quarry',
    raw: [['limestone', "Limestone"], ['sandstone', "Sandstone"], ['slate', "Slate"], ['granite', "Granite"], ['basalt', "Basalt"], ['marble', "Marble"], ['obsidian', "Obsidian"], ['jade', "Jade"], ['runestone', "Runestone"], ['meteorite', "Meteorite"]],
    refined: [['limestone-block', "Limestone Block"], ['sandstone-block', "Sandstone Block"], ['slate-block', "Slate Block"], ['granite-block', "Granite Block"], ['basalt-block', "Basalt Block"], ['marble-block', "Marble Block"], ['obsidian-block', "Obsidian Block"], ['jade-block', "Jade Block"], ['runestone-block', "Runestone Block"], ['meteorite-block', "Meteorite Block"]] },
  { id: 'fibers', name: "Fibers", effect: 'mdef', site: 'meadow',
    raw: [['flax', "Flax"], ['jute', "Jute"], ['hemp', "Hemp"], ['cotton', "Cotton"], ['wool', "Wool"], ['alpaca-fleece', "Alpaca Fleece"], ['cashmere-fleece', "Cashmere Fleece"], ['silk-cocoon', "Silk Cocoon"], ['moonsilk-cocoon', "Moonsilk Cocoon"], ['cloudfleece', "Cloudfleece"]],
    refined: [['linen', "Linen"], ['burlap', "Burlap"], ['hemp-cloth', "Hemp Cloth"], ['cotton-cloth', "Cotton Cloth"], ['wool-cloth', "Wool Cloth"], ['alpaca-cloth', "Alpaca Cloth"], ['cashmere-cloth', "Cashmere Cloth"], ['silk', "Silk"], ['moonsilk', "Moonsilk"], ['cloudweave', "Cloudweave"]] },
  { id: 'woods', name: "Woods", effect: 'speed', site: 'forest',
    raw: [['pine-log', "Pine Log"], ['birch-log', "Birch Log"], ['cedar-log', "Cedar Log"], ['maple-log', "Maple Log"], ['oak-log', "Oak Log"], ['cherry-log', "Cherry Log"], ['mahogany-log', "Mahogany Log"], ['ebony-log', "Ebony Log"], ['elderwood-log', "Elderwood Log"], ['yggdrasil-branch', "Yggdrasil Branch"]],
    refined: [['pine-plank', "Pine Plank"], ['birch-plank', "Birch Plank"], ['cedar-plank', "Cedar Plank"], ['maple-plank', "Maple Plank"], ['oak-plank', "Oak Plank"], ['cherry-plank', "Cherry Plank"], ['mahogany-plank', "Mahogany Plank"], ['ebony-plank', "Ebony Plank"], ['elderwood-plank', "Elderwood Plank"], ['yggdrasil-plank', "Yggdrasil Plank"]] },
  { id: 'bones-horns', name: "Bones & Horns", effect: 'limit', site: 'fossil-dig',
    raw: [['seashell', "Seashell"], ['ammonite', "Ammonite"], ['trilobite', "Trilobite"], ['fossil-bone', "Fossil Bone"], ['mammoth-tusk', "Mammoth Tusk"], ['saber-fang', "Saber Fang"], ['raptor-claw', "Raptor Claw"], ['tyrant-tooth', "Tyrant Tooth"], ['titan-bone', "Titan Bone"], ['unicorn-horn', "Unicorn Horn"]],
    refined: [['shell-carving', "Shell Carving"], ['ammonite-carving', "Ammonite Carving"], ['trilobite-carving', "Trilobite Carving"], ['bone-carving', "Bone Carving"], ['tusk-carving', "Tusk Carving"], ['fang-carving', "Fang Carving"], ['claw-carving', "Claw Carving"], ['tooth-carving', "Tooth Carving"], ['titan-carving', "Titan Carving"], ['unicorn-carving', "Unicorn Carving"]] },
]
