// The item catalog (docs/design/items.md, D18–D20): sixteen families, eight effects, two sides, ten grades, each raw
// item with its one refined form. Ids match the icon atlas in @luismlorenzana/uma-art (P37); a web test keeps them in
// step. Generated once from the atlas index; edit both together.

import type { ItemEffect, ItemSide } from './kinds'
export * from './kinds'

interface FamilySpec {
  id: string
  name: string
  side: ItemSide
  effect: ItemEffect
  /** The Hub site that produces it. */
  site: string
  raw: readonly (readonly [string, string])[]
  refined: readonly (readonly [string, string])[]
}

export const FAMILY_SPECS: readonly FamilySpec[] = [
  { id: 'grains', name: "Grains", side: 'farming', effect: 'hp', site: 'fields',
    raw: [['wheat', "Wheat"], ['oats', "Oats"], ['barley', "Barley"], ['rice', "Rice"], ['corn', "Corn"], ['rye', "Rye"], ['buckwheat', "Buckwheat"], ['wild-rice', "Wild Rice"], ['moonrice', "Moonrice"], ['sunwheat', "Sunwheat"]],
    refined: [['wheat-flour', "Wheat Flour"], ['rolled-oats', "Rolled Oats"], ['pearl-barley', "Pearl Barley"], ['polished-rice', "Polished Rice"], ['cornmeal', "Cornmeal"], ['rye-flour', "Rye Flour"], ['buckwheat-flour', "Buckwheat Flour"], ['hulled-wild-rice', "Hulled Wild Rice"], ['moonrice-flour', "Moonrice Flour"], ['sunwheat-flour', "Sunwheat Flour"]] },
  { id: 'fruits', name: "Fruits", side: 'farming', effect: 'mp', site: 'orchard',
    raw: [['apple', "Apple"], ['pear', "Pear"], ['peach', "Peach"], ['plum', "Plum"], ['orange', "Orange"], ['grape', "Grape"], ['mango', "Mango"], ['pomegranate', "Pomegranate"], ['starpeach', "Starpeach"], ['golden-apple', "Golden Apple"]],
    refined: [['apple-preserve', "Apple Preserve"], ['pear-preserve', "Pear Preserve"], ['peach-preserve', "Peach Preserve"], ['plum-preserve', "Plum Preserve"], ['orange-marmalade', "Orange Marmalade"], ['grape-jelly', "Grape Jelly"], ['mango-pulp', "Mango Pulp"], ['pomegranate-molasses', "Pomegranate Molasses"], ['starpeach-nectar', "Starpeach Nectar"], ['golden-apple-preserve', "Golden Apple Preserve"]] },
  { id: 'fish', name: "Fish", side: 'farming', effect: 'atk', site: 'fishery',
    raw: [['carp', "Carp"], ['trout', "Trout"], ['sardine', "Sardine"], ['mackerel', "Mackerel"], ['salmon', "Salmon"], ['sea-bream', "Sea Bream"], ['eel', "Eel"], ['tuna', "Tuna"], ['silverfin', "Silverfin"], ['rainbow-koi', "Rainbow Koi"]],
    refined: [['carp-fillet', "Carp Fillet"], ['trout-fillet', "Trout Fillet"], ['sardine-fillet', "Sardine Fillet"], ['mackerel-fillet', "Mackerel Fillet"], ['salmon-fillet', "Salmon Fillet"], ['sea-bream-fillet', "Sea Bream Fillet"], ['eel-fillet', "Eel Fillet"], ['tuna-fillet', "Tuna Fillet"], ['silverfin-fillet', "Silverfin Fillet"], ['rainbow-koi-fillet', "Rainbow Koi Fillet"]] },
  { id: 'herbs-spices', name: "Herbs & Spices", side: 'farming', effect: 'matk', site: 'herb-garden',
    raw: [['basil', "Basil"], ['mint', "Mint"], ['rosemary', "Rosemary"], ['thyme', "Thyme"], ['ginger', "Ginger"], ['peppercorn', "Peppercorn"], ['cinnamon', "Cinnamon"], ['saffron', "Saffron"], ['mandrake', "Mandrake"], ['phoenix-pepper', "Phoenix Pepper"]],
    refined: [['dried-basil', "Dried Basil"], ['dried-mint', "Dried Mint"], ['dried-rosemary', "Dried Rosemary"], ['dried-thyme', "Dried Thyme"], ['ground-ginger', "Ground Ginger"], ['ground-pepper', "Ground Pepper"], ['ground-cinnamon', "Ground Cinnamon"], ['saffron-threads', "Saffron Threads"], ['mandrake-powder', "Mandrake Powder"], ['phoenix-spice', "Phoenix Spice"]] },
  { id: 'vegetables', name: "Vegetables", side: 'farming', effect: 'def', site: 'vegetable-garden',
    raw: [['carrot', "Carrot"], ['potato', "Potato"], ['cabbage', "Cabbage"], ['onion', "Onion"], ['tomato', "Tomato"], ['bell-pepper', "Bell Pepper"], ['eggplant', "Eggplant"], ['asparagus', "Asparagus"], ['golden-carrot', "Golden Carrot"], ['emperor-pumpkin', "Emperor Pumpkin"]],
    refined: [['chopped-carrot', "Chopped Carrot"], ['diced-potato', "Diced Potato"], ['shredded-cabbage', "Shredded Cabbage"], ['diced-onion', "Diced Onion"], ['tomato-puree', "Tomato Pur\u00e9e"], ['sliced-bell-pepper', "Sliced Bell Pepper"], ['sliced-eggplant', "Sliced Eggplant"], ['trimmed-asparagus', "Trimmed Asparagus"], ['golden-carrot-puree', "Golden Carrot Pur\u00e9e"], ['pumpkin-puree', "Pumpkin Pur\u00e9e"]] },
  { id: 'mushrooms', name: "Mushrooms", side: 'farming', effect: 'mdef', site: 'mushroom-cave',
    raw: [['button-mushroom', "Button Mushroom"], ['shiitake', "Shiitake"], ['oyster-mushroom', "Oyster Mushroom"], ['enoki', "Enoki"], ['chanterelle', "Chanterelle"], ['porcini', "Porcini"], ['morel', "Morel"], ['truffle', "Truffle"], ['glowcap', "Glowcap"], ['king-reishi', "King Reishi"]],
    refined: [['dried-button-mushroom', "Dried Button Mushroom"], ['dried-shiitake', "Dried Shiitake"], ['dried-oyster-mushroom', "Dried Oyster Mushroom"], ['dried-enoki', "Dried Enoki"], ['dried-chanterelle', "Dried Chanterelle"], ['dried-porcini', "Dried Porcini"], ['dried-morel', "Dried Morel"], ['shaved-truffle', "Shaved Truffle"], ['glowcap-powder', "Glowcap Powder"], ['reishi-powder', "Reishi Powder"]] },
  { id: 'sweets', name: "Sweets", side: 'farming', effect: 'speed', site: 'sugar-grove',
    raw: [['honeycomb', "Honeycomb"], ['sugarcane', "Sugarcane"], ['sugar-beet', "Sugar Beet"], ['maple-sap', "Maple Sap"], ['cacao-pod', "Cacao Pod"], ['vanilla-pod', "Vanilla Pod"], ['agave-heart', "Agave Heart"], ['palm-sap', "Palm Sap"], ['fairy-honeycomb', "Fairy Honeycomb"], ['ambrosia-blossom', "Ambrosia Blossom"]],
    refined: [['honey', "Honey"], ['cane-sugar', "Cane Sugar"], ['beet-sugar', "Beet Sugar"], ['maple-syrup', "Maple Syrup"], ['chocolate', "Chocolate"], ['vanilla-extract', "Vanilla Extract"], ['agave-syrup', "Agave Syrup"], ['palm-sugar', "Palm Sugar"], ['fairy-honey', "Fairy Honey"], ['ambrosia', "Ambrosia"]] },
  { id: 'nuts-seeds', name: "Nuts & Seeds", side: 'farming', effect: 'limit', site: 'nut-grove',
    raw: [['peanut', "Peanut"], ['sunflower-seed', "Sunflower Seed"], ['sesame', "Sesame"], ['walnut', "Walnut"], ['chestnut', "Chestnut"], ['almond', "Almond"], ['pistachio', "Pistachio"], ['macadamia', "Macadamia"], ['thundernut', "Thundernut"], ['worldseed', "Worldseed"]],
    refined: [['peanut-butter', "Peanut Butter"], ['sunflower-oil', "Sunflower Oil"], ['sesame-paste', "Sesame Paste"], ['walnut-paste', "Walnut Paste"], ['chestnut-paste', "Chestnut Paste"], ['almond-paste', "Almond Paste"], ['pistachio-paste', "Pistachio Paste"], ['macadamia-butter', "Macadamia Butter"], ['thundernut-oil', "Thundernut Oil"], ['worldseed-oil', "Worldseed Oil"]] },
  { id: 'hides-scales', name: "Hides & Scales", side: 'gathering', effect: 'hp', site: 'monster-den',
    raw: [['puffbun-pelt', "Puffbun Pelt"], ['boarling-hide', "Boarling Hide"], ['wolfkin-pelt', "Wolfkin Pelt"], ['rock-lizard-scale', "Rock Lizard Scale"], ['ironback-hide', "Ironback Hide"], ['basilisk-scale', "Basilisk Scale"], ['manticore-hide', "Manticore Hide"], ['behemoth-hide', "Behemoth Hide"], ['wyvern-scale', "Wyvern Scale"], ['dragon-scale', "Dragon Scale"]],
    refined: [['puffbun-leather', "Puffbun Leather"], ['boarling-leather', "Boarling Leather"], ['wolfkin-leather', "Wolfkin Leather"], ['lizard-leather', "Lizard Leather"], ['ironback-leather', "Ironback Leather"], ['basilisk-leather', "Basilisk Leather"], ['manticore-leather', "Manticore Leather"], ['behemoth-leather', "Behemoth Leather"], ['wyvern-leather', "Wyvern Leather"], ['dragonhide', "Dragonhide"]] },
  { id: 'essences', name: "Essences", side: 'gathering', effect: 'mp', site: 'ley-spring',
    raw: [['mist-essence', "Mist Essence"], ['dew-essence', "Dew Essence"], ['breeze-essence', "Breeze Essence"], ['ember-essence', "Ember Essence"], ['tide-essence', "Tide Essence"], ['spark-essence', "Spark Essence"], ['glimmer-essence', "Glimmer Essence"], ['shadow-essence', "Shadow Essence"], ['aether', "Aether"], ['prismatic-essence', "Prismatic Essence"]],
    refined: [['mist-infusion', "Mist Infusion"], ['dew-infusion', "Dew Infusion"], ['breeze-infusion', "Breeze Infusion"], ['ember-infusion', "Ember Infusion"], ['tide-infusion', "Tide Infusion"], ['spark-infusion', "Spark Infusion"], ['glimmer-infusion', "Glimmer Infusion"], ['shadow-infusion', "Shadow Infusion"], ['aether-infusion', "Aether Infusion"], ['prismatic-infusion', "Prismatic Infusion"]] },
  { id: 'ores', name: "Ores", side: 'gathering', effect: 'atk', site: 'mine',
    raw: [['copper-ore', "Copper Ore"], ['tin-ore', "Tin Ore"], ['iron-ore', "Iron Ore"], ['silver-ore', "Silver Ore"], ['cobalt-ore', "Cobalt Ore"], ['gold-ore', "Gold Ore"], ['platinum-ore', "Platinum Ore"], ['titanium-ore', "Titanium Ore"], ['mythril-ore', "Mythril Ore"], ['orichalcum-ore', "Orichalcum Ore"]],
    refined: [['copper-ingot', "Copper Ingot"], ['tin-ingot', "Tin Ingot"], ['iron-ingot', "Iron Ingot"], ['silver-ingot', "Silver Ingot"], ['cobalt-ingot', "Cobalt Ingot"], ['gold-ingot', "Gold Ingot"], ['platinum-ingot', "Platinum Ingot"], ['titanium-ingot', "Titanium Ingot"], ['mythril-ingot', "Mythril Ingot"], ['orichalcum-ingot', "Orichalcum Ingot"]] },
  { id: 'crystals', name: "Crystals", side: 'gathering', effect: 'matk', site: 'crystal-cavern',
    raw: [['quartz', "Quartz"], ['amethyst', "Amethyst"], ['citrine', "Citrine"], ['garnet', "Garnet"], ['emerald', "Emerald"], ['sapphire', "Sapphire"], ['ruby', "Ruby"], ['diamond', "Diamond"], ['starstone', "Starstone"], ['philosophers-stone', "Philosopher's Stone"]],
    refined: [['cut-quartz', "Cut Quartz"], ['cut-amethyst', "Cut Amethyst"], ['cut-citrine', "Cut Citrine"], ['cut-garnet', "Cut Garnet"], ['cut-emerald', "Cut Emerald"], ['cut-sapphire', "Cut Sapphire"], ['cut-ruby', "Cut Ruby"], ['cut-diamond', "Cut Diamond"], ['cut-starstone', "Cut Starstone"], ['cut-philosophers-stone', "Cut Philosopher's Stone"]] },
  { id: 'stones', name: "Stones", side: 'gathering', effect: 'def', site: 'quarry',
    raw: [['limestone', "Limestone"], ['sandstone', "Sandstone"], ['slate', "Slate"], ['granite', "Granite"], ['basalt', "Basalt"], ['marble', "Marble"], ['obsidian', "Obsidian"], ['jade', "Jade"], ['runestone', "Runestone"], ['meteorite', "Meteorite"]],
    refined: [['limestone-block', "Limestone Block"], ['sandstone-block', "Sandstone Block"], ['slate-block', "Slate Block"], ['granite-block', "Granite Block"], ['basalt-block', "Basalt Block"], ['marble-block', "Marble Block"], ['obsidian-block', "Obsidian Block"], ['jade-block', "Jade Block"], ['runestone-block', "Runestone Block"], ['meteorite-block', "Meteorite Block"]] },
  { id: 'fibers', name: "Fibers", side: 'gathering', effect: 'mdef', site: 'meadow',
    raw: [['flax', "Flax"], ['jute', "Jute"], ['hemp', "Hemp"], ['cotton', "Cotton"], ['wool', "Wool"], ['alpaca-fleece', "Alpaca Fleece"], ['cashmere-fleece', "Cashmere Fleece"], ['silk-cocoon', "Silk Cocoon"], ['moonsilk-cocoon', "Moonsilk Cocoon"], ['cloudfleece', "Cloudfleece"]],
    refined: [['linen', "Linen"], ['burlap', "Burlap"], ['hemp-cloth', "Hemp Cloth"], ['cotton-cloth', "Cotton Cloth"], ['wool-cloth', "Wool Cloth"], ['alpaca-cloth', "Alpaca Cloth"], ['cashmere-cloth', "Cashmere Cloth"], ['silk', "Silk"], ['moonsilk', "Moonsilk"], ['cloudweave', "Cloudweave"]] },
  { id: 'woods', name: "Woods", side: 'gathering', effect: 'speed', site: 'forest',
    raw: [['pine-log', "Pine Log"], ['birch-log', "Birch Log"], ['cedar-log', "Cedar Log"], ['maple-log', "Maple Log"], ['oak-log', "Oak Log"], ['cherry-log', "Cherry Log"], ['mahogany-log', "Mahogany Log"], ['ebony-log', "Ebony Log"], ['elderwood-log', "Elderwood Log"], ['yggdrasil-branch', "Yggdrasil Branch"]],
    refined: [['pine-plank', "Pine Plank"], ['birch-plank', "Birch Plank"], ['cedar-plank', "Cedar Plank"], ['maple-plank', "Maple Plank"], ['oak-plank', "Oak Plank"], ['cherry-plank', "Cherry Plank"], ['mahogany-plank', "Mahogany Plank"], ['ebony-plank', "Ebony Plank"], ['elderwood-plank', "Elderwood Plank"], ['yggdrasil-plank', "Yggdrasil Plank"]] },
  { id: 'bones-horns', name: "Bones & Horns", side: 'gathering', effect: 'limit', site: 'fossil-dig',
    raw: [['seashell', "Seashell"], ['ammonite', "Ammonite"], ['trilobite', "Trilobite"], ['fossil-bone', "Fossil Bone"], ['mammoth-tusk', "Mammoth Tusk"], ['saber-fang', "Saber Fang"], ['raptor-claw', "Raptor Claw"], ['tyrant-tooth', "Tyrant Tooth"], ['titan-bone', "Titan Bone"], ['unicorn-horn', "Unicorn Horn"]],
    refined: [['shell-carving', "Shell Carving"], ['ammonite-carving', "Ammonite Carving"], ['trilobite-carving', "Trilobite Carving"], ['bone-carving', "Bone Carving"], ['tusk-carving', "Tusk Carving"], ['fang-carving', "Fang Carving"], ['claw-carving', "Claw Carving"], ['tooth-carving', "Tooth Carving"], ['titan-carving', "Titan Carving"], ['unicorn-carving', "Unicorn Carving"]] },
]
