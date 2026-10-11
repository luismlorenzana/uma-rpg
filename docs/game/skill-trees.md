# Skill trees

Every tree, every node, every number: 40 trees of 15 nodes (D86). Generated from `packages/domain/src/rpg/catalog.ts`.
Rules for learning them are in [classes](classes.md#skills-depths-points-and-slots).

How to read a row:
- **Node** is the id the save and the engine use (`<tree>.<depth>` for the core, `<tree>.<depth>a|b` for the sides).
- **Cost** is the side points it takes (cores are free).
- **MP** is what it costs her, after her hand.
- **What it does** gives the targets, the number of hits and the total power before her hand. Extras follow: a status,
  a summon's linger share, a rider (a status on each foe hit), a Barrier, a special.

Shapes by kind: Greatsword and Fire hit one foe hard; Axe and Ice every foe; Lance and Lightning random foes; Bow and
Light one foe many times; Katana and Dark twice (the foe, then one other).

<!-- live:skill-trees -->
### Brawler

5 trees. Powers below are before her hand (×1); MP is hers (×1).

#### Brawler · Greatsword (`brawler-greatsword`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `brawler-greatsword.1` | Core | Heavy Slash | free | 10 | one foe · 1 hit · 1.6 |
| 1 | `brawler-greatsword.1a` | Side A | Crush | 1 | 12 | one foe · 1 hit · 1.84 |
| 1 | `brawler-greatsword.1b` | Side B | Twin Slash | 1 | 10 | one foe · 2 hits · 1.472 |
| 2 | `brawler-greatsword.2` | Core | Cleave | free | 14 | one foe · 1 hit · 2.2 |
| 2 | `brawler-greatsword.2a` | Side A | Bone Crush | 2 | 16 | one foe · 1 hit · 2.53 |
| 2 | `brawler-greatsword.2b` | Side B | Double Cleave | 2 | 14 | one foe · 2 hits · 2.024 |
| 3 | `brawler-greatsword.3` | Core | Sunder | free | 18 | one foe · 2 hits · 2.9 |
| 3 | `brawler-greatsword.3a` | Side A | Rampart Breaker | 3 | 20 | one foe · 1 hit · 3.335 |
| 3 | `brawler-greatsword.3b` | Side B | Triple Sunder | 3 | 18 | one foe · 3 hits · 2.667 |
| 4 | `brawler-greatsword.4` | Core | Rend | free | 22 | one foe · 2 hits · 3.7 |
| 4 | `brawler-greatsword.4a` | Side A | Cataclysm | 4 | 24 | one foe · 1 hit · 4.255 |
| 4 | `brawler-greatsword.4b` | Side B | Rending Combo | 4 | 22 | one foe · 3 hits · 3.405 |
| 5 | `brawler-greatsword.5` | Core | Meteor Strike | free | 26 | one foe · 3 hits · 4.599 |
| 5 | `brawler-greatsword.5a` | Side A | Worldbreaker | 5 | 28 | one foe · 1 hit · 5.29 |
| 5 | `brawler-greatsword.5b` | Side B | Meteor Combo | 5 | 26 | one foe · 4 hits · 4.232 |

#### Brawler · Axe (`brawler-axe`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `brawler-axe.1` | Core | Sweep | free | 14 | every foe · 1 hit · 0.88 |
| 1 | `brawler-axe.1a` | Side A | Wide Sweep | 1 | 16 | every foe · 2 hits · 0.8 |
| 1 | `brawler-axe.1b` | Side B | Hewing Sweep | 1 | 16 | every foe · 1 hit · 0.72 |
| 2 | `brawler-axe.2` | Core | Whirl | free | 18 | every foe · 1 hit · 1.21 |
| 2 | `brawler-axe.2a` | Side A | Twin Whirl | 2 | 20 | every foe · 2 hits · 1.1 |
| 2 | `brawler-axe.2b` | Side B | Reaping Whirl | 2 | 20 | every foe · 1 hit · 0.99 |
| 3 | `brawler-axe.3` | Core | Cyclone | free | 22 | every foe · 2 hits · 1.596 |
| 3 | `brawler-axe.3a` | Side A | Grand Cyclone | 3 | 24 | every foe · 3 hits · 1.449 |
| 3 | `brawler-axe.3b` | Side B | Headsman's Cyclone | 3 | 24 | every foe · 2 hits · 1.306 |
| 4 | `brawler-axe.4` | Core | Quake | free | 26 | every foe · 2 hits · 2.036 |
| 4 | `brawler-axe.4a` | Side A | Aftershock | 4 | 28 | every foe · 3 hits · 1.851 |
| 4 | `brawler-axe.4b` | Side B | Guillotine Quake | 4 | 28 | every foe · 2 hits · 1.666 |
| 5 | `brawler-axe.5` | Core | Maelstrom | free | 30 | every foe · 3 hits · 2.529 |
| 5 | `brawler-axe.5a` | Side A | Tempest | 5 | 32 | every foe · 4 hits · 2.3 |
| 5 | `brawler-axe.5b` | Side B | Executioner's Storm | 5 | 32 | every foe · 3 hits · 2.07 |

#### Brawler · Lance (`brawler-lance`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `brawler-lance.1` | Core | Thrust Flurry | free | 10 | random foes · 2 hits · 1.68 |
| 1 | `brawler-lance.1a` | Side A | Piercing Thrust | 1 | 12 | one foe · 1 hit · 1.84 |
| 1 | `brawler-lance.1b` | Side B | Scatter Thrust | 1 | 14 | random foes · 4 hits · 2.16 |
| 2 | `brawler-lance.2` | Core | Lance Barrage | free | 14 | random foes · 2 hits · 2.31 |
| 2 | `brawler-lance.2a` | Side A | Impaler | 2 | 16 | one foe · 1 hit · 2.53 |
| 2 | `brawler-lance.2b` | Side B | Wild Barrage | 2 | 18 | random foes · 4 hits · 2.97 |
| 3 | `brawler-lance.3` | Core | Spiral Barrage | free | 18 | random foes · 4 hits · 3.044 |
| 3 | `brawler-lance.3a` | Side A | Skewer | 3 | 20 | one foe · 2 hits · 3.334 |
| 3 | `brawler-lance.3b` | Side B | Storm of Spears | 3 | 22 | random foes · 6 hits · 3.914 |
| 4 | `brawler-lance.4` | Core | Dragon Dive | free | 22 | random foes · 4 hits · 3.884 |
| 4 | `brawler-lance.4a` | Side A | Dragon Fang | 4 | 24 | one foe · 2 hits · 4.256 |
| 4 | `brawler-lance.4b` | Side B | Dragon Swarm | 4 | 26 | random foes · 6 hits · 4.994 |
| 5 | `brawler-lance.5` | Core | Heaven's Rain | free | 26 | random foes · 6 hits · 4.83 |
| 5 | `brawler-lance.5a` | Side A | Gungnir | 5 | 28 | one foe · 3 hits · 5.289 |
| 5 | `brawler-lance.5b` | Side B | Thousand Spears | 5 | 30 | random foes · 8 hits · 6.21 |

#### Brawler · Bow (`brawler-bow`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `brawler-bow.1` | Core | Twin Arrows | free | 10 | one foe · 2 hits · 1.6 |
| 1 | `brawler-bow.1a` | Side A | Power Shot | 1 | 12 | one foe · 1 hit · 1.84 |
| 1 | `brawler-bow.1b` | Side B | Spread Shot | 1 | 14 | one foe · 2 hits · 1.6 |
| 2 | `brawler-bow.2` | Core | Triple Shot | free | 14 | one foe · 2 hits · 2.2 |
| 2 | `brawler-bow.2a` | Side A | Piercing Arrow | 2 | 16 | one foe · 1 hit · 2.53 |
| 2 | `brawler-bow.2b` | Side B | Scatter Volley | 2 | 18 | one foe · 2 hits · 2.2 |
| 3 | `brawler-bow.3` | Core | Quiver Volley | free | 18 | one foe · 4 hits · 2.9 |
| 3 | `brawler-bow.3a` | Side A | Ballista Shot | 3 | 20 | one foe · 2 hits · 3.334 |
| 3 | `brawler-bow.3b` | Side B | Rain of Arrows | 3 | 22 | one foe · 4 hits · 2.9 |
| 4 | `brawler-bow.4` | Core | Arrow Storm | free | 22 | one foe · 4 hits · 3.7 |
| 4 | `brawler-bow.4a` | Side A | Comet Arrow | 4 | 24 | one foe · 2 hits · 4.256 |
| 4 | `brawler-bow.4b` | Side B | Arrow Hail | 4 | 26 | one foe · 4 hits · 3.7 |
| 5 | `brawler-bow.5` | Core | Starfall Barrage | free | 26 | one foe · 6 hits · 4.602 |
| 5 | `brawler-bow.5a` | Side A | Sunpiercer | 5 | 28 | one foe · 3 hits · 5.289 |
| 5 | `brawler-bow.5b` | Side B | Starfall Rain | 5 | 30 | one foe · 6 hits · 4.602 |

#### Brawler · Katana (`brawler-katana`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `brawler-katana.1` | Core | Double Slash | free | 10 | one foe · 2 hits · 1.6 |
| 1 | `brawler-katana.1a` | Side A | Quick Draw | 1 | 12 | one foe · 1 hit · 1.84 |
| 1 | `brawler-katana.1b` | Side B | Cross Cut | 1 | 14 | one foe · 2 hits · 1.12 |
| 2 | `brawler-katana.2` | Core | Crossing Cut | free | 14 | one foe · 2 hits · 2.2 |
| 2 | `brawler-katana.2a` | Side A | Iaido | 2 | 16 | one foe · 1 hit · 2.53 |
| 2 | `brawler-katana.2b` | Side B | X-Slash | 2 | 18 | one foe · 2 hits · 1.54 |
| 3 | `brawler-katana.3` | Core | Twin Moon | free | 18 | one foe · 2 hits · 2.9 |
| 3 | `brawler-katana.3a` | Side A | Flash Draw | 3 | 20 | one foe · 1 hit · 3.335 |
| 3 | `brawler-katana.3b` | Side B | Twin Cross | 3 | 22 | one foe · 2 hits · 2.03 |
| 4 | `brawler-katana.4` | Core | Iai Storm | free | 22 | one foe · 2 hits · 3.7 |
| 4 | `brawler-katana.4a` | Side A | Moonlit Draw | 4 | 24 | one foe · 1 hit · 4.255 |
| 4 | `brawler-katana.4b` | Side B | Scattering Petals | 4 | 26 | one foe · 2 hits · 2.59 |
| 5 | `brawler-katana.5` | Core | Moonfall | free | 26 | one foe · 2 hits · 4.6 |
| 5 | `brawler-katana.5a` | Side A | Final Draw | 5 | 28 | one foe · 1 hit · 5.29 |
| 5 | `brawler-katana.5b` | Side B | Thousand Petals | 5 | 30 | one foe · 2 hits · 3.22 |

### Mage

5 trees. Powers below are before her hand (×1); MP is hers (×1).

#### Mage · Fire Tome (`mage-tome-fire`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `mage-tome-fire.1` | Core | Fire | free | 10 | one foe · 1 hit · 1.6 |
| 1 | `mage-tome-fire.1a` | Side A | Fire Wave | 1 | 14 | every foe · 1 hit · 0.88 |
| 1 | `mage-tome-fire.1b` | Side B | Fire Chain | 1 | 10 | random foes · 2 hits · 1.68 |
| 2 | `mage-tome-fire.2` | Core | Fira | free | 14 | one foe · 1 hit · 2.2 |
| 2 | `mage-tome-fire.2a` | Side A | Fira Wave | 2 | 18 | every foe · 1 hit · 1.21 |
| 2 | `mage-tome-fire.2b` | Side B | Fira Chain | 2 | 14 | random foes · 2 hits · 2.31 |
| 3 | `mage-tome-fire.3` | Core | Firaga | free | 18 | one foe · 1 hit · 2.9 |
| 3 | `mage-tome-fire.3a` | Side A | Firaga Wave | 3 | 22 | every foe · 1 hit · 1.595 |
| 3 | `mage-tome-fire.3b` | Side B | Firaga Chain | 3 | 18 | random foes · 3 hits · 3.045 |
| 4 | `mage-tome-fire.4` | Core | Firaja | free | 22 | one foe · 1 hit · 3.7 |
| 4 | `mage-tome-fire.4a` | Side A | Firaja Wave | 4 | 26 | every foe · 1 hit · 2.035 |
| 4 | `mage-tome-fire.4b` | Side B | Firaja Chain | 4 | 22 | random foes · 3 hits · 3.885 |
| 5 | `mage-tome-fire.5` | Core | Flare Star | free | 26 | one foe · 1 hit · 4.6 |
| 5 | `mage-tome-fire.5a` | Side A | Flare Wave | 5 | 30 | every foe · 1 hit · 2.53 |
| 5 | `mage-tome-fire.5b` | Side B | Flare Chain | 5 | 26 | random foes · 4 hits · 4.832 |

#### Mage · Blizzard Tome (`mage-tome-ice`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `mage-tome-ice.1` | Core | Blizzard | free | 14 | every foe · 1 hit · 0.88 |
| 1 | `mage-tome-ice.1a` | Side A | Blizzard Spike | 1 | 10 | one foe · 1 hit · 1.6 |
| 1 | `mage-tome-ice.1b` | Side B | Blizzard Shards | 1 | 10 | random foes · 2 hits · 1.68 |
| 2 | `mage-tome-ice.2` | Core | Blizzara | free | 18 | every foe · 1 hit · 1.21 |
| 2 | `mage-tome-ice.2a` | Side A | Blizzara Spike | 2 | 14 | one foe · 1 hit · 2.2 |
| 2 | `mage-tome-ice.2b` | Side B | Blizzara Shards | 2 | 14 | random foes · 2 hits · 2.31 |
| 3 | `mage-tome-ice.3` | Core | Blizzaga | free | 22 | every foe · 1 hit · 1.595 |
| 3 | `mage-tome-ice.3a` | Side A | Blizzaga Spike | 3 | 18 | one foe · 1 hit · 2.9 |
| 3 | `mage-tome-ice.3b` | Side B | Blizzaga Shards | 3 | 18 | random foes · 3 hits · 3.045 |
| 4 | `mage-tome-ice.4` | Core | Blizzaja | free | 26 | every foe · 1 hit · 2.035 |
| 4 | `mage-tome-ice.4a` | Side A | Blizzaja Spike | 4 | 22 | one foe · 1 hit · 3.7 |
| 4 | `mage-tome-ice.4b` | Side B | Blizzaja Shards | 4 | 22 | random foes · 3 hits · 3.885 |
| 5 | `mage-tome-ice.5` | Core | Absolute Zero | free | 30 | every foe · 2 hits · 2.53 |
| 5 | `mage-tome-ice.5a` | Side A | Zero Spike | 5 | 26 | one foe · 1 hit · 4.6 |
| 5 | `mage-tome-ice.5b` | Side B | Zero Shards | 5 | 26 | random foes · 4 hits · 4.832 |

#### Mage · Thunder Tome (`mage-tome-lightning`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `mage-tome-lightning.1` | Core | Thunder | free | 10 | random foes · 2 hits · 1.68 |
| 1 | `mage-tome-lightning.1a` | Side A | Thunder Bolt | 1 | 10 | one foe · 1 hit · 1.6 |
| 1 | `mage-tome-lightning.1b` | Side B | Thunder Squall | 1 | 14 | every foe · 1 hit · 0.88 |
| 2 | `mage-tome-lightning.2` | Core | Thundara | free | 14 | random foes · 2 hits · 2.31 |
| 2 | `mage-tome-lightning.2a` | Side A | Thundara Bolt | 2 | 14 | one foe · 1 hit · 2.2 |
| 2 | `mage-tome-lightning.2b` | Side B | Thundara Storm | 2 | 18 | every foe · 1 hit · 1.21 |
| 3 | `mage-tome-lightning.3` | Core | Thundaga | free | 18 | random foes · 3 hits · 3.045 |
| 3 | `mage-tome-lightning.3a` | Side A | Thundaga Bolt | 3 | 18 | one foe · 1 hit · 2.9 |
| 3 | `mage-tome-lightning.3b` | Side B | Thundaga Storm | 3 | 22 | every foe · 1 hit · 1.595 |
| 4 | `mage-tome-lightning.4` | Core | Thundaja | free | 22 | random foes · 3 hits · 3.885 |
| 4 | `mage-tome-lightning.4a` | Side A | Thundaja Bolt | 4 | 22 | one foe · 1 hit · 3.7 |
| 4 | `mage-tome-lightning.4b` | Side B | Thundaja Storm | 4 | 26 | every foe · 1 hit · 2.035 |
| 5 | `mage-tome-lightning.5` | Core | Judgment Storm | free | 26 | random foes · 4 hits · 4.832 |
| 5 | `mage-tome-lightning.5a` | Side A | Judgment Bolt | 5 | 26 | one foe · 1 hit · 4.6 |
| 5 | `mage-tome-lightning.5b` | Side B | Judgment Tempest | 5 | 30 | every foe · 1 hit · 2.53 |

#### Mage · Light Tome (`mage-tome-light`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `mage-tome-light.1` | Core | Lux | free | 10 | one foe · 2 hits · 1.6 |
| 1 | `mage-tome-light.1a` | Side A | Lux Lance | 1 | 12 | one foe · 1 hit · 1.84 |
| 1 | `mage-tome-light.1b` | Side B | Lux Cascade | 1 | 16 | every foe · 2 hits · 0.8 |
| 2 | `mage-tome-light.2` | Core | Luxra | free | 14 | one foe · 2 hits · 2.2 |
| 2 | `mage-tome-light.2a` | Side A | Luxra Lance | 2 | 16 | one foe · 1 hit · 2.53 |
| 2 | `mage-tome-light.2b` | Side B | Luxra Cascade | 2 | 20 | every foe · 2 hits · 1.1 |
| 3 | `mage-tome-light.3` | Core | Luxaga | free | 18 | one foe · 4 hits · 2.9 |
| 3 | `mage-tome-light.3a` | Side A | Luxaga Lance | 3 | 20 | one foe · 2 hits · 3.334 |
| 3 | `mage-tome-light.3b` | Side B | Luxaga Cascade | 3 | 24 | every foe · 2 hits · 1.45 |
| 4 | `mage-tome-light.4` | Core | Luxaja | free | 22 | one foe · 4 hits · 3.7 |
| 4 | `mage-tome-light.4a` | Side A | Luxaja Lance | 4 | 24 | one foe · 2 hits · 4.256 |
| 4 | `mage-tome-light.4b` | Side B | Luxaja Cascade | 4 | 28 | every foe · 2 hits · 1.85 |
| 5 | `mage-tome-light.5` | Core | Holy | free | 26 | one foe · 6 hits · 4.602 |
| 5 | `mage-tome-light.5a` | Side A | Holy Lance | 5 | 28 | one foe · 3 hits · 5.289 |
| 5 | `mage-tome-light.5b` | Side B | Holy Cascade | 5 | 32 | every foe · 2 hits · 2.3 |

#### Mage · Dark Tome (`mage-tome-dark`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `mage-tome-dark.1` | Core | Nox | free | 10 | one foe · 2 hits · 1.6 |
| 1 | `mage-tome-dark.1a` | Side A | Nox Pierce | 1 | 12 | one foe · 1 hit · 1.84 |
| 1 | `mage-tome-dark.1b` | Side B | Nox Cascade | 1 | 16 | every foe · 2 hits · 0.8 |
| 2 | `mage-tome-dark.2` | Core | Noxra | free | 14 | one foe · 2 hits · 2.2 |
| 2 | `mage-tome-dark.2a` | Side A | Noxra Pierce | 2 | 16 | one foe · 1 hit · 2.53 |
| 2 | `mage-tome-dark.2b` | Side B | Noxra Cascade | 2 | 20 | every foe · 2 hits · 1.1 |
| 3 | `mage-tome-dark.3` | Core | Noxaga | free | 18 | one foe · 2 hits · 2.9 |
| 3 | `mage-tome-dark.3a` | Side A | Noxaga Pierce | 3 | 20 | one foe · 1 hit · 3.335 |
| 3 | `mage-tome-dark.3b` | Side B | Noxaga Cascade | 3 | 24 | every foe · 2 hits · 1.45 |
| 4 | `mage-tome-dark.4` | Core | Noxaja | free | 22 | one foe · 2 hits · 3.7 |
| 4 | `mage-tome-dark.4a` | Side A | Noxaja Pierce | 4 | 24 | one foe · 1 hit · 4.255 |
| 4 | `mage-tome-dark.4b` | Side B | Noxaja Cascade | 4 | 28 | every foe · 2 hits · 1.85 |
| 5 | `mage-tome-dark.5` | Core | Black Hole | free | 26 | one foe · 2 hits · 4.6 |
| 5 | `mage-tome-dark.5a` | Side A | Void Pierce | 5 | 28 | one foe · 1 hit · 5.29 |
| 5 | `mage-tome-dark.5b` | Side B | Void Cascade | 5 | 32 | every foe · 2 hits · 2.3 |

### Spell Blade

10 trees. Powers below are before her hand (×0.45); MP is hers (×0.5).

#### Spell Blade · Greatsword (`spellblade-greatsword`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `spellblade-greatsword.1` | Core | Rune Cleave | free | 5 | one foe · 1 hit · 1.6 |
| 1 | `spellblade-greatsword.1a` | Side A | Focused Rune Cleave | 1 | 6 | one foe · 1 hit · 1.76 |
| 1 | `spellblade-greatsword.1b` | Side B | Rune Cleave Flurry | 1 | 6 | one foe · 2 hits · 1.52 |
| 2 | `spellblade-greatsword.2` | Core | Arcane Cleave | free | 7 | one foe · 1 hit · 2.2 |
| 2 | `spellblade-greatsword.2a` | Side A | Focused Arcane Cleave | 2 | 8 | one foe · 1 hit · 2.42 |
| 2 | `spellblade-greatsword.2b` | Side B | Arcane Cleave Flurry | 2 | 8 | one foe · 2 hits · 2.09 |
| 3 | `spellblade-greatsword.3` | Core | Mystic Cleave | free | 9 | one foe · 1 hit · 2.9 |
| 3 | `spellblade-greatsword.3a` | Side A | Focused Mystic Cleave | 3 | 10 | one foe · 1 hit · 3.19 |
| 3 | `spellblade-greatsword.3b` | Side B | Mystic Cleave Flurry | 3 | 10 | one foe · 2 hits · 2.756 |
| 4 | `spellblade-greatsword.4` | Core | Astral Cleave | free | 11 | one foe · 2 hits · 3.7 |
| 4 | `spellblade-greatsword.4a` | Side A | Focused Astral Cleave | 4 | 12 | one foe · 1 hit · 4.07 |
| 4 | `spellblade-greatsword.4b` | Side B | Astral Cleave Flurry | 4 | 12 | one foe · 3 hits · 3.516 |
| 5 | `spellblade-greatsword.5` | Core | Celestial Cleave | free | 13 | one foe · 2 hits · 4.6 |
| 5 | `spellblade-greatsword.5a` | Side A | Focused Celestial Cleave | 5 | 14 | one foe · 1 hit · 5.06 |
| 5 | `spellblade-greatsword.5b` | Side B | Celestial Cleave Flurry | 5 | 14 | one foe · 3 hits · 4.371 |

#### Spell Blade · Axe (`spellblade-axe`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `spellblade-axe.1` | Core | Rune Hew | free | 5 | one foe · 1 hit · 1.6 |
| 1 | `spellblade-axe.1a` | Side A | Focused Rune Hew | 1 | 6 | one foe · 1 hit · 1.76 |
| 1 | `spellblade-axe.1b` | Side B | Rune Hew Flurry | 1 | 6 | one foe · 2 hits · 1.52 |
| 2 | `spellblade-axe.2` | Core | Arcane Hew | free | 7 | one foe · 1 hit · 2.2 |
| 2 | `spellblade-axe.2a` | Side A | Focused Arcane Hew | 2 | 8 | one foe · 1 hit · 2.42 |
| 2 | `spellblade-axe.2b` | Side B | Arcane Hew Flurry | 2 | 8 | one foe · 2 hits · 2.09 |
| 3 | `spellblade-axe.3` | Core | Mystic Hew | free | 9 | one foe · 2 hits · 2.9 |
| 3 | `spellblade-axe.3a` | Side A | Focused Mystic Hew | 3 | 10 | one foe · 1 hit · 3.19 |
| 3 | `spellblade-axe.3b` | Side B | Mystic Hew Flurry | 3 | 10 | one foe · 3 hits · 2.754 |
| 4 | `spellblade-axe.4` | Core | Astral Hew | free | 11 | one foe · 2 hits · 3.7 |
| 4 | `spellblade-axe.4a` | Side A | Focused Astral Hew | 4 | 12 | one foe · 1 hit · 4.07 |
| 4 | `spellblade-axe.4b` | Side B | Astral Hew Flurry | 4 | 12 | one foe · 3 hits · 3.516 |
| 5 | `spellblade-axe.5` | Core | Celestial Hew | free | 13 | one foe · 2 hits · 4.6 |
| 5 | `spellblade-axe.5a` | Side A | Focused Celestial Hew | 5 | 14 | one foe · 1 hit · 5.06 |
| 5 | `spellblade-axe.5b` | Side B | Celestial Hew Flurry | 5 | 14 | one foe · 3 hits · 4.371 |

#### Spell Blade · Lance (`spellblade-lance`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `spellblade-lance.1` | Core | Rune Thrust | free | 5 | one foe · 2 hits · 1.6 |
| 1 | `spellblade-lance.1a` | Side A | Focused Rune Thrust | 1 | 6 | one foe · 1 hit · 1.76 |
| 1 | `spellblade-lance.1b` | Side B | Rune Thrust Flurry | 1 | 6 | one foe · 3 hits · 1.521 |
| 2 | `spellblade-lance.2` | Core | Arcane Thrust | free | 7 | one foe · 2 hits · 2.2 |
| 2 | `spellblade-lance.2a` | Side A | Focused Arcane Thrust | 2 | 8 | one foe · 1 hit · 2.42 |
| 2 | `spellblade-lance.2b` | Side B | Arcane Thrust Flurry | 2 | 8 | one foe · 3 hits · 2.091 |
| 3 | `spellblade-lance.3` | Core | Mystic Thrust | free | 9 | one foe · 2 hits · 2.9 |
| 3 | `spellblade-lance.3a` | Side A | Focused Mystic Thrust | 3 | 10 | one foe · 1 hit · 3.19 |
| 3 | `spellblade-lance.3b` | Side B | Mystic Thrust Flurry | 3 | 10 | one foe · 3 hits · 2.754 |
| 4 | `spellblade-lance.4` | Core | Astral Thrust | free | 11 | one foe · 3 hits · 3.699 |
| 4 | `spellblade-lance.4a` | Side A | Focused Astral Thrust | 4 | 12 | one foe · 2 hits · 4.07 |
| 4 | `spellblade-lance.4b` | Side B | Astral Thrust Flurry | 4 | 12 | one foe · 4 hits · 3.516 |
| 5 | `spellblade-lance.5` | Core | Celestial Thrust | free | 13 | one foe · 3 hits · 4.599 |
| 5 | `spellblade-lance.5a` | Side A | Focused Celestial Thrust | 5 | 14 | one foe · 2 hits · 5.06 |
| 5 | `spellblade-lance.5b` | Side B | Celestial Thrust Flurry | 5 | 14 | one foe · 4 hits · 4.368 |

#### Spell Blade · Bow (`spellblade-bow`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `spellblade-bow.1` | Core | Rune Shot | free | 5 | one foe · 2 hits · 1.6 |
| 1 | `spellblade-bow.1a` | Side A | Focused Rune Shot | 1 | 6 | one foe · 1 hit · 1.76 |
| 1 | `spellblade-bow.1b` | Side B | Rune Shot Flurry | 1 | 6 | one foe · 3 hits · 1.521 |
| 2 | `spellblade-bow.2` | Core | Arcane Shot | free | 7 | one foe · 2 hits · 2.2 |
| 2 | `spellblade-bow.2a` | Side A | Focused Arcane Shot | 2 | 8 | one foe · 1 hit · 2.42 |
| 2 | `spellblade-bow.2b` | Side B | Arcane Shot Flurry | 2 | 8 | one foe · 3 hits · 2.091 |
| 3 | `spellblade-bow.3` | Core | Mystic Shot | free | 9 | one foe · 3 hits · 2.901 |
| 3 | `spellblade-bow.3a` | Side A | Focused Mystic Shot | 3 | 10 | one foe · 2 hits · 3.19 |
| 3 | `spellblade-bow.3b` | Side B | Mystic Shot Flurry | 3 | 10 | one foe · 4 hits · 2.756 |
| 4 | `spellblade-bow.4` | Core | Astral Shot | free | 11 | one foe · 3 hits · 3.699 |
| 4 | `spellblade-bow.4a` | Side A | Focused Astral Shot | 4 | 12 | one foe · 2 hits · 4.07 |
| 4 | `spellblade-bow.4b` | Side B | Astral Shot Flurry | 4 | 12 | one foe · 4 hits · 3.516 |
| 5 | `spellblade-bow.5` | Core | Celestial Shot | free | 13 | one foe · 4 hits · 4.6 |
| 5 | `spellblade-bow.5a` | Side A | Focused Celestial Shot | 5 | 14 | one foe · 3 hits · 5.061 |
| 5 | `spellblade-bow.5b` | Side B | Celestial Shot Flurry | 5 | 14 | one foe · 5 hits · 4.37 |

#### Spell Blade · Katana (`spellblade-katana`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `spellblade-katana.1` | Core | Rune Draw | free | 5 | one foe · 2 hits · 1.6 |
| 1 | `spellblade-katana.1a` | Side A | Focused Rune Draw | 1 | 6 | one foe · 1 hit · 1.76 |
| 1 | `spellblade-katana.1b` | Side B | Rune Draw Flurry | 1 | 6 | one foe · 3 hits · 1.521 |
| 2 | `spellblade-katana.2` | Core | Arcane Draw | free | 7 | one foe · 2 hits · 2.2 |
| 2 | `spellblade-katana.2a` | Side A | Focused Arcane Draw | 2 | 8 | one foe · 1 hit · 2.42 |
| 2 | `spellblade-katana.2b` | Side B | Arcane Draw Flurry | 2 | 8 | one foe · 3 hits · 2.091 |
| 3 | `spellblade-katana.3` | Core | Mystic Draw | free | 9 | one foe · 2 hits · 2.9 |
| 3 | `spellblade-katana.3a` | Side A | Focused Mystic Draw | 3 | 10 | one foe · 1 hit · 3.19 |
| 3 | `spellblade-katana.3b` | Side B | Mystic Draw Flurry | 3 | 10 | one foe · 3 hits · 2.754 |
| 4 | `spellblade-katana.4` | Core | Astral Draw | free | 11 | one foe · 2 hits · 3.7 |
| 4 | `spellblade-katana.4a` | Side A | Focused Astral Draw | 4 | 12 | one foe · 1 hit · 4.07 |
| 4 | `spellblade-katana.4b` | Side B | Astral Draw Flurry | 4 | 12 | one foe · 3 hits · 3.516 |
| 5 | `spellblade-katana.5` | Core | Celestial Draw | free | 13 | one foe · 2 hits · 4.6 |
| 5 | `spellblade-katana.5a` | Side A | Focused Celestial Draw | 5 | 14 | one foe · 1 hit · 5.06 |
| 5 | `spellblade-katana.5b` | Side B | Celestial Draw Flurry | 5 | 14 | one foe · 3 hits · 4.371 |

#### Spell Blade · Fire Tome (`spellblade-tome-fire`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `spellblade-tome-fire.1` | Core | Rune Brand | free | 5 | one foe · 1 hit · 1.6 |
| 1 | `spellblade-tome-fire.1a` | Side A | Focused Rune Brand | 1 | 6 | one foe · 1 hit · 1.76 |
| 1 | `spellblade-tome-fire.1b` | Side B | Rune Brand Flurry | 1 | 6 | one foe · 2 hits · 1.52 |
| 2 | `spellblade-tome-fire.2` | Core | Arcane Brand | free | 7 | one foe · 1 hit · 2.2 |
| 2 | `spellblade-tome-fire.2a` | Side A | Focused Arcane Brand | 2 | 8 | one foe · 1 hit · 2.42 |
| 2 | `spellblade-tome-fire.2b` | Side B | Arcane Brand Flurry | 2 | 8 | one foe · 2 hits · 2.09 |
| 3 | `spellblade-tome-fire.3` | Core | Mystic Brand | free | 9 | one foe · 1 hit · 2.9 |
| 3 | `spellblade-tome-fire.3a` | Side A | Focused Mystic Brand | 3 | 10 | one foe · 1 hit · 3.19 |
| 3 | `spellblade-tome-fire.3b` | Side B | Mystic Brand Flurry | 3 | 10 | one foe · 2 hits · 2.756 |
| 4 | `spellblade-tome-fire.4` | Core | Astral Brand | free | 11 | one foe · 2 hits · 3.7 |
| 4 | `spellblade-tome-fire.4a` | Side A | Focused Astral Brand | 4 | 12 | one foe · 1 hit · 4.07 |
| 4 | `spellblade-tome-fire.4b` | Side B | Astral Brand Flurry | 4 | 12 | one foe · 3 hits · 3.516 |
| 5 | `spellblade-tome-fire.5` | Core | Celestial Brand | free | 13 | one foe · 2 hits · 4.6 |
| 5 | `spellblade-tome-fire.5a` | Side A | Focused Celestial Brand | 5 | 14 | one foe · 1 hit · 5.06 |
| 5 | `spellblade-tome-fire.5b` | Side B | Celestial Brand Flurry | 5 | 14 | one foe · 3 hits · 4.371 |

#### Spell Blade · Blizzard Tome (`spellblade-tome-ice`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `spellblade-tome-ice.1` | Core | Rune Rime | free | 5 | one foe · 1 hit · 1.6 |
| 1 | `spellblade-tome-ice.1a` | Side A | Focused Rune Rime | 1 | 6 | one foe · 1 hit · 1.76 |
| 1 | `spellblade-tome-ice.1b` | Side B | Rune Rime Flurry | 1 | 6 | one foe · 2 hits · 1.52 |
| 2 | `spellblade-tome-ice.2` | Core | Arcane Rime | free | 7 | one foe · 1 hit · 2.2 |
| 2 | `spellblade-tome-ice.2a` | Side A | Focused Arcane Rime | 2 | 8 | one foe · 1 hit · 2.42 |
| 2 | `spellblade-tome-ice.2b` | Side B | Arcane Rime Flurry | 2 | 8 | one foe · 2 hits · 2.09 |
| 3 | `spellblade-tome-ice.3` | Core | Mystic Rime | free | 9 | one foe · 2 hits · 2.9 |
| 3 | `spellblade-tome-ice.3a` | Side A | Focused Mystic Rime | 3 | 10 | one foe · 1 hit · 3.19 |
| 3 | `spellblade-tome-ice.3b` | Side B | Mystic Rime Flurry | 3 | 10 | one foe · 3 hits · 2.754 |
| 4 | `spellblade-tome-ice.4` | Core | Astral Rime | free | 11 | one foe · 2 hits · 3.7 |
| 4 | `spellblade-tome-ice.4a` | Side A | Focused Astral Rime | 4 | 12 | one foe · 1 hit · 4.07 |
| 4 | `spellblade-tome-ice.4b` | Side B | Astral Rime Flurry | 4 | 12 | one foe · 3 hits · 3.516 |
| 5 | `spellblade-tome-ice.5` | Core | Celestial Rime | free | 13 | one foe · 2 hits · 4.6 |
| 5 | `spellblade-tome-ice.5a` | Side A | Focused Celestial Rime | 5 | 14 | one foe · 1 hit · 5.06 |
| 5 | `spellblade-tome-ice.5b` | Side B | Celestial Rime Flurry | 5 | 14 | one foe · 3 hits · 4.371 |

#### Spell Blade · Thunder Tome (`spellblade-tome-lightning`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `spellblade-tome-lightning.1` | Core | Rune Bolt | free | 5 | one foe · 2 hits · 1.6 |
| 1 | `spellblade-tome-lightning.1a` | Side A | Focused Rune Bolt | 1 | 6 | one foe · 1 hit · 1.76 |
| 1 | `spellblade-tome-lightning.1b` | Side B | Rune Bolt Flurry | 1 | 6 | one foe · 3 hits · 1.521 |
| 2 | `spellblade-tome-lightning.2` | Core | Arcane Bolt | free | 7 | one foe · 2 hits · 2.2 |
| 2 | `spellblade-tome-lightning.2a` | Side A | Focused Arcane Bolt | 2 | 8 | one foe · 1 hit · 2.42 |
| 2 | `spellblade-tome-lightning.2b` | Side B | Arcane Bolt Flurry | 2 | 8 | one foe · 3 hits · 2.091 |
| 3 | `spellblade-tome-lightning.3` | Core | Mystic Bolt | free | 9 | one foe · 2 hits · 2.9 |
| 3 | `spellblade-tome-lightning.3a` | Side A | Focused Mystic Bolt | 3 | 10 | one foe · 1 hit · 3.19 |
| 3 | `spellblade-tome-lightning.3b` | Side B | Mystic Bolt Flurry | 3 | 10 | one foe · 3 hits · 2.754 |
| 4 | `spellblade-tome-lightning.4` | Core | Astral Bolt | free | 11 | one foe · 3 hits · 3.699 |
| 4 | `spellblade-tome-lightning.4a` | Side A | Focused Astral Bolt | 4 | 12 | one foe · 2 hits · 4.07 |
| 4 | `spellblade-tome-lightning.4b` | Side B | Astral Bolt Flurry | 4 | 12 | one foe · 4 hits · 3.516 |
| 5 | `spellblade-tome-lightning.5` | Core | Celestial Bolt | free | 13 | one foe · 3 hits · 4.599 |
| 5 | `spellblade-tome-lightning.5a` | Side A | Focused Celestial Bolt | 5 | 14 | one foe · 2 hits · 5.06 |
| 5 | `spellblade-tome-lightning.5b` | Side B | Celestial Bolt Flurry | 5 | 14 | one foe · 4 hits · 4.368 |

#### Spell Blade · Light Tome (`spellblade-tome-light`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `spellblade-tome-light.1` | Core | Rune Ray | free | 5 | one foe · 2 hits · 1.6 |
| 1 | `spellblade-tome-light.1a` | Side A | Focused Rune Ray | 1 | 6 | one foe · 1 hit · 1.76 |
| 1 | `spellblade-tome-light.1b` | Side B | Rune Ray Flurry | 1 | 6 | one foe · 3 hits · 1.521 |
| 2 | `spellblade-tome-light.2` | Core | Arcane Ray | free | 7 | one foe · 2 hits · 2.2 |
| 2 | `spellblade-tome-light.2a` | Side A | Focused Arcane Ray | 2 | 8 | one foe · 1 hit · 2.42 |
| 2 | `spellblade-tome-light.2b` | Side B | Arcane Ray Flurry | 2 | 8 | one foe · 3 hits · 2.091 |
| 3 | `spellblade-tome-light.3` | Core | Mystic Ray | free | 9 | one foe · 3 hits · 2.901 |
| 3 | `spellblade-tome-light.3a` | Side A | Focused Mystic Ray | 3 | 10 | one foe · 2 hits · 3.19 |
| 3 | `spellblade-tome-light.3b` | Side B | Mystic Ray Flurry | 3 | 10 | one foe · 4 hits · 2.756 |
| 4 | `spellblade-tome-light.4` | Core | Astral Ray | free | 11 | one foe · 3 hits · 3.699 |
| 4 | `spellblade-tome-light.4a` | Side A | Focused Astral Ray | 4 | 12 | one foe · 2 hits · 4.07 |
| 4 | `spellblade-tome-light.4b` | Side B | Astral Ray Flurry | 4 | 12 | one foe · 4 hits · 3.516 |
| 5 | `spellblade-tome-light.5` | Core | Celestial Ray | free | 13 | one foe · 4 hits · 4.6 |
| 5 | `spellblade-tome-light.5a` | Side A | Focused Celestial Ray | 5 | 14 | one foe · 3 hits · 5.061 |
| 5 | `spellblade-tome-light.5b` | Side B | Celestial Ray Flurry | 5 | 14 | one foe · 5 hits · 4.37 |

#### Spell Blade · Dark Tome (`spellblade-tome-dark`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `spellblade-tome-dark.1` | Core | Rune Shade | free | 5 | one foe · 2 hits · 1.6 |
| 1 | `spellblade-tome-dark.1a` | Side A | Focused Rune Shade | 1 | 6 | one foe · 1 hit · 1.76 |
| 1 | `spellblade-tome-dark.1b` | Side B | Rune Shade Flurry | 1 | 6 | one foe · 3 hits · 1.521 |
| 2 | `spellblade-tome-dark.2` | Core | Arcane Shade | free | 7 | one foe · 2 hits · 2.2 |
| 2 | `spellblade-tome-dark.2a` | Side A | Focused Arcane Shade | 2 | 8 | one foe · 1 hit · 2.42 |
| 2 | `spellblade-tome-dark.2b` | Side B | Arcane Shade Flurry | 2 | 8 | one foe · 3 hits · 2.091 |
| 3 | `spellblade-tome-dark.3` | Core | Mystic Shade | free | 9 | one foe · 2 hits · 2.9 |
| 3 | `spellblade-tome-dark.3a` | Side A | Focused Mystic Shade | 3 | 10 | one foe · 1 hit · 3.19 |
| 3 | `spellblade-tome-dark.3b` | Side B | Mystic Shade Flurry | 3 | 10 | one foe · 3 hits · 2.754 |
| 4 | `spellblade-tome-dark.4` | Core | Astral Shade | free | 11 | one foe · 2 hits · 3.7 |
| 4 | `spellblade-tome-dark.4a` | Side A | Focused Astral Shade | 4 | 12 | one foe · 1 hit · 4.07 |
| 4 | `spellblade-tome-dark.4b` | Side B | Astral Shade Flurry | 4 | 12 | one foe · 3 hits · 3.516 |
| 5 | `spellblade-tome-dark.5` | Core | Celestial Shade | free | 13 | one foe · 2 hits · 4.6 |
| 5 | `spellblade-tome-dark.5a` | Side A | Focused Celestial Shade | 5 | 14 | one foe · 1 hit · 5.06 |
| 5 | `spellblade-tome-dark.5b` | Side B | Celestial Shade Flurry | 5 | 14 | one foe · 3 hits · 4.371 |

### Cleric

10 trees. Powers below are before her hand (×0.5); MP is hers (×0.6).

#### Cleric · Greatsword (`cleric-greatsword`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `cleric-greatsword.1` | Core | Breach | free | 6 | one foe · 1 hit · 1.6 · Armor Break 1 on the foe |
| 1 | `cleric-greatsword.1a` | Side A | Lasting Breach | 1 | 7 | one foe · 1 hit · 1.6 · Armor Break 1 on the foe |
| 1 | `cleric-greatsword.1b` | Side B | Heavy Breach | 1 | 8 | one foe · 1 hit · 1.6 · Armor Break 2 on the foe |
| 2 | `cleric-greatsword.2` | Core | Sunder Armor | free | 8 | one foe · 1 hit · 2.2 · Armor Break 1 on the foe |
| 2 | `cleric-greatsword.2a` | Side A | Lasting Sunder Armor | 2 | 10 | one foe · 1 hit · 2.2 · Armor Break 1 on the foe |
| 2 | `cleric-greatsword.2b` | Side B | Heavy Sunder Armor | 2 | 11 | one foe · 1 hit · 2.2 · Armor Break 2 on the foe |
| 3 | `cleric-greatsword.3` | Core | Rupture | free | 11 | one foe · 1 hit · 2.9 · Armor Break 2 on the foe |
| 3 | `cleric-greatsword.3a` | Side A | Lasting Rupture | 3 | 12 | one foe · 1 hit · 2.9 · Armor Break 2 on the foe |
| 3 | `cleric-greatsword.3b` | Side B | Heavy Rupture | 3 | 13 | one foe · 1 hit · 2.9 · Armor Break 3 on the foe |
| 4 | `cleric-greatsword.4` | Core | Ravage | free | 13 | one foe · 1 hit · 3.7 · Armor Break 2 on the foe |
| 4 | `cleric-greatsword.4a` | Side A | Lasting Ravage | 4 | 14 | one foe · 1 hit · 3.7 · Armor Break 2 on the foe |
| 4 | `cleric-greatsword.4b` | Side B | Heavy Ravage | 4 | 16 | one foe · 1 hit · 3.7 · Armor Break 3 on the foe |
| 5 | `cleric-greatsword.5` | Core | Ruin | free | 16 | one foe · 1 hit · 4.6 · Armor Break 3 on every foe |
| 5 | `cleric-greatsword.5a` | Side A | Lasting Ruin | 5 | 17 | one foe · 1 hit · 4.6 · Armor Break 3 on every foe |
| 5 | `cleric-greatsword.5b` | Side B | Heavy Ruin | 5 | 18 | one foe · 1 hit · 4.6 · Armor Break 4 on every foe |

#### Cleric · Axe (`cleric-axe`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `cleric-axe.1` | Core | Hack | free | 6 | one foe · 1 hit · 1.6 · Enfeeble 1 on the foe |
| 1 | `cleric-axe.1a` | Side A | Lasting Hack | 1 | 7 | one foe · 1 hit · 1.6 · Enfeeble 1 on the foe |
| 1 | `cleric-axe.1b` | Side B | Heavy Hack | 1 | 8 | one foe · 1 hit · 1.6 · Enfeeble 2 on the foe |
| 2 | `cleric-axe.2` | Core | Hamstring | free | 8 | one foe · 1 hit · 2.2 · Enfeeble 1 on the foe |
| 2 | `cleric-axe.2a` | Side A | Lasting Hamstring | 2 | 10 | one foe · 1 hit · 2.2 · Enfeeble 1 on the foe |
| 2 | `cleric-axe.2b` | Side B | Heavy Hamstring | 2 | 11 | one foe · 1 hit · 2.2 · Enfeeble 2 on the foe |
| 3 | `cleric-axe.3` | Core | Maim | free | 11 | one foe · 1 hit · 2.9 · Enfeeble 2 on the foe |
| 3 | `cleric-axe.3a` | Side A | Lasting Maim | 3 | 12 | one foe · 1 hit · 2.9 · Enfeeble 2 on the foe |
| 3 | `cleric-axe.3b` | Side B | Heavy Maim | 3 | 13 | one foe · 1 hit · 2.9 · Enfeeble 3 on the foe |
| 4 | `cleric-axe.4` | Core | Cripple | free | 13 | one foe · 1 hit · 3.7 · Enfeeble 2 on the foe |
| 4 | `cleric-axe.4a` | Side A | Lasting Cripple | 4 | 14 | one foe · 1 hit · 3.7 · Enfeeble 2 on the foe |
| 4 | `cleric-axe.4b` | Side B | Heavy Cripple | 4 | 16 | one foe · 1 hit · 3.7 · Enfeeble 3 on the foe |
| 5 | `cleric-axe.5` | Core | Unmake | free | 16 | one foe · 1 hit · 4.6 · Enfeeble 3 on every foe |
| 5 | `cleric-axe.5a` | Side A | Lasting Unmake | 5 | 17 | one foe · 1 hit · 4.6 · Enfeeble 3 on every foe |
| 5 | `cleric-axe.5b` | Side B | Heavy Unmake | 5 | 18 | one foe · 1 hit · 4.6 · Enfeeble 4 on every foe |

#### Cleric · Lance (`cleric-lance`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `cleric-lance.1` | Core | Pierce Mind | free | 6 | one foe · 1 hit · 1.6 · Mind Break 1 on the foe |
| 1 | `cleric-lance.1a` | Side A | Lasting Pierce Mind | 1 | 7 | one foe · 1 hit · 1.6 · Mind Break 1 on the foe |
| 1 | `cleric-lance.1b` | Side B | Heavy Pierce Mind | 1 | 8 | one foe · 1 hit · 1.6 · Mind Break 2 on the foe |
| 2 | `cleric-lance.2` | Core | Puncture | free | 8 | one foe · 1 hit · 2.2 · Mind Break 1 on the foe |
| 2 | `cleric-lance.2a` | Side A | Lasting Puncture | 2 | 10 | one foe · 1 hit · 2.2 · Mind Break 1 on the foe |
| 2 | `cleric-lance.2b` | Side B | Heavy Puncture | 2 | 11 | one foe · 1 hit · 2.2 · Mind Break 2 on the foe |
| 3 | `cleric-lance.3` | Core | Impale | free | 11 | one foe · 1 hit · 2.9 · Mind Break 2 on the foe |
| 3 | `cleric-lance.3a` | Side A | Lasting Impale | 3 | 12 | one foe · 1 hit · 2.9 · Mind Break 2 on the foe |
| 3 | `cleric-lance.3b` | Side B | Heavy Impale | 3 | 13 | one foe · 1 hit · 2.9 · Mind Break 3 on the foe |
| 4 | `cleric-lance.4` | Core | Transfix | free | 13 | one foe · 1 hit · 3.7 · Mind Break 2 on the foe |
| 4 | `cleric-lance.4a` | Side A | Lasting Transfix | 4 | 14 | one foe · 1 hit · 3.7 · Mind Break 2 on the foe |
| 4 | `cleric-lance.4b` | Side B | Heavy Transfix | 4 | 16 | one foe · 1 hit · 3.7 · Mind Break 3 on the foe |
| 5 | `cleric-lance.5` | Core | Mindspike | free | 16 | one foe · 1 hit · 4.6 · Mind Break 3 on every foe |
| 5 | `cleric-lance.5a` | Side A | Lasting Mindspike | 5 | 17 | one foe · 1 hit · 4.6 · Mind Break 3 on every foe |
| 5 | `cleric-lance.5b` | Side B | Heavy Mindspike | 5 | 18 | one foe · 1 hit · 4.6 · Mind Break 4 on every foe |

#### Cleric · Bow (`cleric-bow`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `cleric-bow.1` | Core | Chip | free | 6 | one foe · 1 hit · 1.6 · Shatter 1 on the foe |
| 1 | `cleric-bow.1a` | Side A | Lasting Chip | 1 | 7 | one foe · 1 hit · 1.6 · Shatter 1 on the foe |
| 1 | `cleric-bow.1b` | Side B | Heavy Chip | 1 | 8 | one foe · 1 hit · 1.6 · Shatter 2 on the foe |
| 2 | `cleric-bow.2` | Core | Crack | free | 8 | one foe · 1 hit · 2.2 · Shatter 1 on the foe |
| 2 | `cleric-bow.2a` | Side A | Lasting Crack | 2 | 10 | one foe · 1 hit · 2.2 · Shatter 1 on the foe |
| 2 | `cleric-bow.2b` | Side B | Heavy Crack | 2 | 11 | one foe · 1 hit · 2.2 · Shatter 2 on the foe |
| 3 | `cleric-bow.3` | Core | Fracture | free | 11 | one foe · 1 hit · 2.9 · Shatter 2 on the foe |
| 3 | `cleric-bow.3a` | Side A | Lasting Fracture | 3 | 12 | one foe · 1 hit · 2.9 · Shatter 2 on the foe |
| 3 | `cleric-bow.3b` | Side B | Heavy Fracture | 3 | 13 | one foe · 1 hit · 2.9 · Shatter 3 on the foe |
| 4 | `cleric-bow.4` | Core | Splinter | free | 13 | one foe · 1 hit · 3.7 · Shatter 2 on the foe |
| 4 | `cleric-bow.4a` | Side A | Lasting Splinter | 4 | 14 | one foe · 1 hit · 3.7 · Shatter 2 on the foe |
| 4 | `cleric-bow.4b` | Side B | Heavy Splinter | 4 | 16 | one foe · 1 hit · 3.7 · Shatter 3 on the foe |
| 5 | `cleric-bow.5` | Core | Shatterstorm | free | 16 | one foe · 1 hit · 4.6 · Shatter 3 on every foe |
| 5 | `cleric-bow.5a` | Side A | Lasting Shatterstorm | 5 | 17 | one foe · 1 hit · 4.6 · Shatter 3 on every foe |
| 5 | `cleric-bow.5b` | Side B | Heavy Shatterstorm | 5 | 18 | one foe · 1 hit · 4.6 · Shatter 4 on every foe |

#### Cleric · Katana (`cleric-katana`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `cleric-katana.1` | Core | Mark | free | 6 | one foe · 1 hit · 1.6 · Hex 1 on the foe |
| 1 | `cleric-katana.1a` | Side A | Lasting Mark | 1 | 7 | one foe · 1 hit · 1.6 · Hex 1 on the foe |
| 1 | `cleric-katana.1b` | Side B | Heavy Mark | 1 | 8 | one foe · 1 hit · 1.6 · Hex 2 on the foe |
| 2 | `cleric-katana.2` | Core | Curse | free | 8 | one foe · 1 hit · 2.2 · Hex 1 on the foe |
| 2 | `cleric-katana.2a` | Side A | Lasting Curse | 2 | 10 | one foe · 1 hit · 2.2 · Hex 1 on the foe |
| 2 | `cleric-katana.2b` | Side B | Heavy Curse | 2 | 11 | one foe · 1 hit · 2.2 · Hex 2 on the foe |
| 3 | `cleric-katana.3` | Core | Hex | free | 11 | one foe · 1 hit · 2.9 · Hex 2 on the foe |
| 3 | `cleric-katana.3a` | Side A | Lasting Hex | 3 | 12 | one foe · 1 hit · 2.9 · Hex 2 on the foe |
| 3 | `cleric-katana.3b` | Side B | Heavy Hex | 3 | 13 | one foe · 1 hit · 2.9 · Hex 3 on the foe |
| 4 | `cleric-katana.4` | Core | Doom | free | 13 | one foe · 1 hit · 3.7 · Hex 2 on the foe |
| 4 | `cleric-katana.4a` | Side A | Lasting Doom | 4 | 14 | one foe · 1 hit · 3.7 · Hex 2 on the foe |
| 4 | `cleric-katana.4b` | Side B | Heavy Doom | 4 | 16 | one foe · 1 hit · 3.7 · Hex 3 on the foe |
| 5 | `cleric-katana.5` | Core | Anathema | free | 16 | one foe · 1 hit · 4.6 · Hex 3 on every foe |
| 5 | `cleric-katana.5a` | Side A | Lasting Anathema | 5 | 17 | one foe · 1 hit · 4.6 · Hex 3 on every foe |
| 5 | `cleric-katana.5b` | Side B | Heavy Anathema | 5 | 18 | one foe · 1 hit · 4.6 · Hex 4 on every foe |

#### Cleric · Fire Tome (`cleric-tome-fire`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `cleric-tome-fire.1` | Core | Valor | free | 6 | one foe · 1 hit · 1.6 · Brave 1 on every ally |
| 1 | `cleric-tome-fire.1a` | Side A | Lasting Valor | 1 | 7 | one foe · 1 hit · 1.6 · Brave 1 on every ally |
| 1 | `cleric-tome-fire.1b` | Side B | Heavy Valor | 1 | 8 | one foe · 1 hit · 1.6 · Brave 2 on every ally |
| 2 | `cleric-tome-fire.2` | Core | Courage | free | 8 | one foe · 1 hit · 2.2 · Brave 1 on every ally |
| 2 | `cleric-tome-fire.2a` | Side A | Lasting Courage | 2 | 10 | one foe · 1 hit · 2.2 · Brave 1 on every ally |
| 2 | `cleric-tome-fire.2b` | Side B | Heavy Courage | 2 | 11 | one foe · 1 hit · 2.2 · Brave 2 on every ally |
| 3 | `cleric-tome-fire.3` | Core | Bravery | free | 11 | one foe · 1 hit · 2.9 · Brave 2 on every ally |
| 3 | `cleric-tome-fire.3a` | Side A | Lasting Bravery | 3 | 12 | one foe · 1 hit · 2.9 · Brave 2 on every ally |
| 3 | `cleric-tome-fire.3b` | Side B | Heavy Bravery | 3 | 13 | one foe · 1 hit · 2.9 · Brave 3 on every ally |
| 4 | `cleric-tome-fire.4` | Core | Heroism | free | 13 | one foe · 1 hit · 3.7 · Brave 2 on every ally |
| 4 | `cleric-tome-fire.4a` | Side A | Lasting Heroism | 4 | 14 | one foe · 1 hit · 3.7 · Brave 2 on every ally |
| 4 | `cleric-tome-fire.4b` | Side B | Heavy Heroism | 4 | 16 | one foe · 1 hit · 3.7 · Brave 3 on every ally |
| 5 | `cleric-tome-fire.5` | Core | Exaltation | free | 16 | one foe · 1 hit · 4.6 · Brave 3 on every ally |
| 5 | `cleric-tome-fire.5a` | Side A | Lasting Exaltation | 5 | 17 | one foe · 1 hit · 4.6 · Brave 3 on every ally |
| 5 | `cleric-tome-fire.5b` | Side B | Heavy Exaltation | 5 | 18 | one foe · 1 hit · 4.6 · Brave 4 on every ally |

#### Cleric · Blizzard Tome (`cleric-tome-ice`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `cleric-tome-ice.1` | Core | Ward | free | 6 | one foe · 1 hit · 1.6 · Aegis 1 on every ally |
| 1 | `cleric-tome-ice.1a` | Side A | Lasting Ward | 1 | 7 | one foe · 1 hit · 1.6 · Aegis 1 on every ally |
| 1 | `cleric-tome-ice.1b` | Side B | Heavy Ward | 1 | 8 | one foe · 1 hit · 1.6 · Aegis 2 on every ally |
| 2 | `cleric-tome-ice.2` | Core | Guard | free | 8 | one foe · 1 hit · 2.2 · Aegis 1 on every ally |
| 2 | `cleric-tome-ice.2a` | Side A | Lasting Guard | 2 | 10 | one foe · 1 hit · 2.2 · Aegis 1 on every ally |
| 2 | `cleric-tome-ice.2b` | Side B | Heavy Guard | 2 | 11 | one foe · 1 hit · 2.2 · Aegis 2 on every ally |
| 3 | `cleric-tome-ice.3` | Core | Bulwark | free | 11 | one foe · 1 hit · 2.9 · Aegis 2 on every ally |
| 3 | `cleric-tome-ice.3a` | Side A | Lasting Bulwark | 3 | 12 | one foe · 1 hit · 2.9 · Aegis 2 on every ally |
| 3 | `cleric-tome-ice.3b` | Side B | Heavy Bulwark | 3 | 13 | one foe · 1 hit · 2.9 · Aegis 3 on every ally |
| 4 | `cleric-tome-ice.4` | Core | Fortress | free | 13 | one foe · 1 hit · 3.7 · Aegis 2 on every ally |
| 4 | `cleric-tome-ice.4a` | Side A | Lasting Fortress | 4 | 14 | one foe · 1 hit · 3.7 · Aegis 2 on every ally |
| 4 | `cleric-tome-ice.4b` | Side B | Heavy Fortress | 4 | 16 | one foe · 1 hit · 3.7 · Aegis 3 on every ally |
| 5 | `cleric-tome-ice.5` | Core | Sanctum | free | 16 | one foe · 1 hit · 4.6 · Aegis 3 on every ally |
| 5 | `cleric-tome-ice.5a` | Side A | Lasting Sanctum | 5 | 17 | one foe · 1 hit · 4.6 · Aegis 3 on every ally |
| 5 | `cleric-tome-ice.5b` | Side B | Heavy Sanctum | 5 | 18 | one foe · 1 hit · 4.6 · Aegis 4 on every ally |

#### Cleric · Thunder Tome (`cleric-tome-lightning`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `cleric-tome-lightning.1` | Core | Spark | free | 6 | one foe · 1 hit · 1.6 · Breaker 1 on every ally |
| 1 | `cleric-tome-lightning.1a` | Side A | Lasting Spark | 1 | 7 | one foe · 1 hit · 1.6 · Breaker 1 on every ally |
| 1 | `cleric-tome-lightning.1b` | Side B | Heavy Spark | 1 | 8 | one foe · 1 hit · 1.6 · Breaker 2 on every ally |
| 2 | `cleric-tome-lightning.2` | Core | Charge | free | 8 | one foe · 1 hit · 2.2 · Breaker 1 on every ally |
| 2 | `cleric-tome-lightning.2a` | Side A | Lasting Charge | 2 | 10 | one foe · 1 hit · 2.2 · Breaker 1 on every ally |
| 2 | `cleric-tome-lightning.2b` | Side B | Heavy Charge | 2 | 11 | one foe · 1 hit · 2.2 · Breaker 2 on every ally |
| 3 | `cleric-tome-lightning.3` | Core | Surge | free | 11 | one foe · 1 hit · 2.9 · Breaker 2 on every ally |
| 3 | `cleric-tome-lightning.3a` | Side A | Lasting Surge | 3 | 12 | one foe · 1 hit · 2.9 · Breaker 2 on every ally |
| 3 | `cleric-tome-lightning.3b` | Side B | Heavy Surge | 3 | 13 | one foe · 1 hit · 2.9 · Breaker 3 on every ally |
| 4 | `cleric-tome-lightning.4` | Core | Overcharge | free | 13 | one foe · 1 hit · 3.7 · Breaker 2 on every ally |
| 4 | `cleric-tome-lightning.4a` | Side A | Lasting Overcharge | 4 | 14 | one foe · 1 hit · 3.7 · Breaker 2 on every ally |
| 4 | `cleric-tome-lightning.4b` | Side B | Heavy Overcharge | 4 | 16 | one foe · 1 hit · 3.7 · Breaker 3 on every ally |
| 5 | `cleric-tome-lightning.5` | Core | Breakstorm | free | 16 | one foe · 1 hit · 4.6 · Breaker 3 on every ally |
| 5 | `cleric-tome-lightning.5a` | Side A | Lasting Breakstorm | 5 | 17 | one foe · 1 hit · 4.6 · Breaker 3 on every ally |
| 5 | `cleric-tome-lightning.5b` | Side B | Heavy Breakstorm | 5 | 18 | one foe · 1 hit · 4.6 · Breaker 4 on every ally |

#### Cleric · Light Tome (`cleric-tome-light`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `cleric-tome-light.1` | Core | Grace | free | 6 | one foe · 1 hit · 1.6 · Faith 1 on every ally |
| 1 | `cleric-tome-light.1a` | Side A | Lasting Grace | 1 | 7 | one foe · 1 hit · 1.6 · Faith 1 on every ally |
| 1 | `cleric-tome-light.1b` | Side B | Heavy Grace | 1 | 8 | one foe · 1 hit · 1.6 · Faith 2 on every ally |
| 2 | `cleric-tome-light.2` | Core | Faith | free | 8 | one foe · 1 hit · 2.2 · Faith 1 on every ally |
| 2 | `cleric-tome-light.2a` | Side A | Lasting Faith | 2 | 10 | one foe · 1 hit · 2.2 · Faith 1 on every ally |
| 2 | `cleric-tome-light.2b` | Side B | Heavy Faith | 2 | 11 | one foe · 1 hit · 2.2 · Faith 2 on every ally |
| 3 | `cleric-tome-light.3` | Core | Devotion | free | 11 | one foe · 1 hit · 2.9 · Faith 2 on every ally |
| 3 | `cleric-tome-light.3a` | Side A | Lasting Devotion | 3 | 12 | one foe · 1 hit · 2.9 · Faith 2 on every ally |
| 3 | `cleric-tome-light.3b` | Side B | Heavy Devotion | 3 | 13 | one foe · 1 hit · 2.9 · Faith 3 on every ally |
| 4 | `cleric-tome-light.4` | Core | Piety | free | 13 | one foe · 1 hit · 3.7 · Faith 2 on every ally |
| 4 | `cleric-tome-light.4a` | Side A | Lasting Piety | 4 | 14 | one foe · 1 hit · 3.7 · Faith 2 on every ally |
| 4 | `cleric-tome-light.4b` | Side B | Heavy Piety | 4 | 16 | one foe · 1 hit · 3.7 · Faith 3 on every ally |
| 5 | `cleric-tome-light.5` | Core | Benediction | free | 16 | one foe · 1 hit · 4.6 · Faith 3 on every ally |
| 5 | `cleric-tome-light.5a` | Side A | Lasting Benediction | 5 | 17 | one foe · 1 hit · 4.6 · Faith 3 on every ally |
| 5 | `cleric-tome-light.5b` | Side B | Heavy Benediction | 5 | 18 | one foe · 1 hit · 4.6 · Faith 4 on every ally |

#### Cleric · Dark Tome (`cleric-tome-dark`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `cleric-tome-dark.1` | Core | Calm | free | 6 | one foe · 1 hit · 1.6 · Clarity 1 on every ally |
| 1 | `cleric-tome-dark.1a` | Side A | Lasting Calm | 1 | 7 | one foe · 1 hit · 1.6 · Clarity 1 on every ally |
| 1 | `cleric-tome-dark.1b` | Side B | Heavy Calm | 1 | 8 | one foe · 1 hit · 1.6 · Clarity 2 on every ally |
| 2 | `cleric-tome-dark.2` | Core | Focus | free | 8 | one foe · 1 hit · 2.2 · Clarity 1 on every ally |
| 2 | `cleric-tome-dark.2a` | Side A | Lasting Focus | 2 | 10 | one foe · 1 hit · 2.2 · Clarity 1 on every ally |
| 2 | `cleric-tome-dark.2b` | Side B | Heavy Focus | 2 | 11 | one foe · 1 hit · 2.2 · Clarity 2 on every ally |
| 3 | `cleric-tome-dark.3` | Core | Clarity | free | 11 | one foe · 1 hit · 2.9 · Clarity 2 on every ally |
| 3 | `cleric-tome-dark.3a` | Side A | Lasting Clarity | 3 | 12 | one foe · 1 hit · 2.9 · Clarity 2 on every ally |
| 3 | `cleric-tome-dark.3b` | Side B | Heavy Clarity | 3 | 13 | one foe · 1 hit · 2.9 · Clarity 3 on every ally |
| 4 | `cleric-tome-dark.4` | Core | Insight | free | 13 | one foe · 1 hit · 3.7 · Clarity 2 on every ally |
| 4 | `cleric-tome-dark.4a` | Side A | Lasting Insight | 4 | 14 | one foe · 1 hit · 3.7 · Clarity 2 on every ally |
| 4 | `cleric-tome-dark.4b` | Side B | Heavy Insight | 4 | 16 | one foe · 1 hit · 3.7 · Clarity 3 on every ally |
| 5 | `cleric-tome-dark.5` | Core | Enlightenment | free | 16 | one foe · 1 hit · 4.6 · Clarity 3 on every ally |
| 5 | `cleric-tome-dark.5a` | Side A | Lasting Enlightenment | 5 | 17 | one foe · 1 hit · 4.6 · Clarity 3 on every ally |
| 5 | `cleric-tome-dark.5b` | Side B | Heavy Enlightenment | 5 | 18 | one foe · 1 hit · 4.6 · Clarity 4 on every ally |

### Summoner

10 trees. Powers below are before her hand (×0.6); MP is hers (×0.7).

#### Summoner · Greatsword (`summoner-greatsword`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `summoner-greatsword.1` | Core | Squire | free | 7 | one foe · 1 hit · 1.6 · lingers at 0.3 |
| 1 | `summoner-greatsword.1a` | Side A | Squire Pack | 1 | 7 | one foe · 2 hits · 1.52 · lingers at 0.3 |
| 1 | `summoner-greatsword.1b` | Side B | Bonded Squire | 1 | 8 | one foe · 1 hit · 1.6 · lingers at 0.4 |
| 2 | `summoner-greatsword.2` | Core | Sword Knight | free | 10 | one foe · 1 hit · 2.2 · lingers at 0.3 |
| 2 | `summoner-greatsword.2a` | Side A | Sword Knight Pack | 2 | 10 | one foe · 2 hits · 2.09 · lingers at 0.3 |
| 2 | `summoner-greatsword.2b` | Side B | Bonded Sword Knight | 2 | 11 | one foe · 1 hit · 2.2 · lingers at 0.4 |
| 3 | `summoner-greatsword.3` | Core | Paladin | free | 13 | one foe · 2 hits · 2.9 · lingers at 0.3 |
| 3 | `summoner-greatsword.3a` | Side A | Paladin Pack | 3 | 13 | one foe · 3 hits · 2.754 · lingers at 0.3 |
| 3 | `summoner-greatsword.3b` | Side B | Bonded Paladin | 3 | 14 | one foe · 2 hits · 2.9 · lingers at 0.4 |
| 4 | `summoner-greatsword.4` | Core | Blade Champion | free | 15 | one foe · 2 hits · 3.7 · lingers at 0.3 |
| 4 | `summoner-greatsword.4a` | Side A | Blade Champion Pack | 4 | 15 | one foe · 3 hits · 3.516 · lingers at 0.3 |
| 4 | `summoner-greatsword.4b` | Side B | Bonded Blade Champion | 4 | 17 | one foe · 2 hits · 3.7 · lingers at 0.4 |
| 5 | `summoner-greatsword.5` | Core | Sword Saint | free | 18 | one foe · 3 hits · 4.599 · lingers at 0.3 |
| 5 | `summoner-greatsword.5a` | Side A | Sword Saint Pack | 5 | 18 | one foe · 4 hits · 4.368 · lingers at 0.3 |
| 5 | `summoner-greatsword.5b` | Side B | Bonded Sword Saint | 5 | 20 | one foe · 3 hits · 4.599 · lingers at 0.4 |

#### Summoner · Axe (`summoner-axe`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `summoner-axe.1` | Core | Brigand | free | 10 | every foe · 1 hit · 0.88 · lingers at 0.3 |
| 1 | `summoner-axe.1a` | Side A | Brigand Pack | 1 | 10 | every foe · 2 hits · 0.836 · lingers at 0.3 |
| 1 | `summoner-axe.1b` | Side B | Bonded Brigand | 1 | 11 | every foe · 1 hit · 0.88 · lingers at 0.4 |
| 2 | `summoner-axe.2` | Core | Berserker | free | 13 | every foe · 1 hit · 1.21 · lingers at 0.3 |
| 2 | `summoner-axe.2a` | Side A | Berserker Pack | 2 | 13 | every foe · 2 hits · 1.15 · lingers at 0.3 |
| 2 | `summoner-axe.2b` | Side B | Bonded Berserker | 2 | 14 | every foe · 1 hit · 1.21 · lingers at 0.4 |
| 3 | `summoner-axe.3` | Core | Axe Ogre | free | 15 | every foe · 2 hits · 1.596 · lingers at 0.3 |
| 3 | `summoner-axe.3a` | Side A | Axe Ogre Pack | 3 | 15 | every foe · 3 hits · 1.515 · lingers at 0.3 |
| 3 | `summoner-axe.3b` | Side B | Bonded Axe Ogre | 3 | 17 | every foe · 2 hits · 1.596 · lingers at 0.4 |
| 4 | `summoner-axe.4` | Core | Minotaur Chief | free | 18 | every foe · 2 hits · 2.036 · lingers at 0.3 |
| 4 | `summoner-axe.4a` | Side A | Minotaur Chief Pack | 4 | 18 | every foe · 3 hits · 1.932 · lingers at 0.3 |
| 4 | `summoner-axe.4b` | Side B | Bonded Minotaur Chief | 4 | 20 | every foe · 2 hits · 2.036 · lingers at 0.4 |
| 5 | `summoner-axe.5` | Core | Jotun Warlord | free | 21 | every foe · 3 hits · 2.529 · lingers at 0.3 |
| 5 | `summoner-axe.5a` | Side A | Jotun Warlord Pack | 5 | 21 | every foe · 4 hits · 2.404 · lingers at 0.3 |
| 5 | `summoner-axe.5b` | Side B | Bonded Jotun Warlord | 5 | 22 | every foe · 3 hits · 2.529 · lingers at 0.4 |

#### Summoner · Lance (`summoner-lance`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `summoner-lance.1` | Core | Pikeman | free | 7 | random foes · 2 hits · 1.68 · lingers at 0.3 |
| 1 | `summoner-lance.1a` | Side A | Pikeman Pack | 1 | 7 | random foes · 3 hits · 1.596 · lingers at 0.3 |
| 1 | `summoner-lance.1b` | Side B | Bonded Pikeman | 1 | 8 | random foes · 2 hits · 1.68 · lingers at 0.4 |
| 2 | `summoner-lance.2` | Core | Dragoon | free | 10 | random foes · 2 hits · 2.31 · lingers at 0.3 |
| 2 | `summoner-lance.2a` | Side A | Dragoon Pack | 2 | 10 | random foes · 3 hits · 2.196 · lingers at 0.3 |
| 2 | `summoner-lance.2b` | Side B | Bonded Dragoon | 2 | 11 | random foes · 2 hits · 2.31 · lingers at 0.4 |
| 3 | `summoner-lance.3` | Core | Lance Knight | free | 13 | random foes · 3 hits · 3.045 · lingers at 0.3 |
| 3 | `summoner-lance.3a` | Side A | Lance Knight Pack | 3 | 13 | random foes · 4 hits · 2.892 · lingers at 0.3 |
| 3 | `summoner-lance.3b` | Side B | Bonded Lance Knight | 3 | 14 | random foes · 3 hits · 3.045 · lingers at 0.4 |
| 4 | `summoner-lance.4` | Core | Valkyrie | free | 15 | random foes · 3 hits · 3.885 · lingers at 0.3 |
| 4 | `summoner-lance.4a` | Side A | Valkyrie Pack | 4 | 15 | random foes · 4 hits · 3.692 · lingers at 0.3 |
| 4 | `summoner-lance.4b` | Side B | Bonded Valkyrie | 4 | 17 | random foes · 3 hits · 3.885 · lingers at 0.4 |
| 5 | `summoner-lance.5` | Core | Valkyrie Queen | free | 18 | random foes · 4 hits · 4.832 · lingers at 0.3 |
| 5 | `summoner-lance.5a` | Side A | Valkyrie Queen Pack | 5 | 18 | random foes · 5 hits · 4.59 · lingers at 0.3 |
| 5 | `summoner-lance.5b` | Side B | Bonded Valkyrie Queen | 5 | 20 | random foes · 4 hits · 4.832 · lingers at 0.4 |

#### Summoner · Bow (`summoner-bow`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `summoner-bow.1` | Core | Slinger | free | 7 | one foe · 2 hits · 1.6 · lingers at 0.3 |
| 1 | `summoner-bow.1a` | Side A | Slinger Pack | 1 | 7 | one foe · 3 hits · 1.521 · lingers at 0.3 |
| 1 | `summoner-bow.1b` | Side B | Bonded Slinger | 1 | 8 | one foe · 2 hits · 1.6 · lingers at 0.4 |
| 2 | `summoner-bow.2` | Core | Archer | free | 10 | one foe · 2 hits · 2.2 · lingers at 0.3 |
| 2 | `summoner-bow.2a` | Side A | Archer Pack | 2 | 10 | one foe · 3 hits · 2.091 · lingers at 0.3 |
| 2 | `summoner-bow.2b` | Side B | Bonded Archer | 2 | 11 | one foe · 2 hits · 2.2 · lingers at 0.4 |
| 3 | `summoner-bow.3` | Core | Ranger | free | 13 | one foe · 3 hits · 2.901 · lingers at 0.3 |
| 3 | `summoner-bow.3a` | Side A | Ranger Pack | 3 | 13 | one foe · 4 hits · 2.756 · lingers at 0.3 |
| 3 | `summoner-bow.3b` | Side B | Bonded Ranger | 3 | 14 | one foe · 3 hits · 2.901 · lingers at 0.4 |
| 4 | `summoner-bow.4` | Core | Sylph Archer | free | 15 | one foe · 3 hits · 3.699 · lingers at 0.3 |
| 4 | `summoner-bow.4a` | Side A | Sylph Archer Pack | 4 | 15 | one foe · 4 hits · 3.516 · lingers at 0.3 |
| 4 | `summoner-bow.4b` | Side B | Bonded Sylph Archer | 4 | 17 | one foe · 3 hits · 3.699 · lingers at 0.4 |
| 5 | `summoner-bow.5` | Core | Sagittarius | free | 18 | one foe · 4 hits · 4.6 · lingers at 0.3 |
| 5 | `summoner-bow.5a` | Side A | Sagittarius Pack | 5 | 18 | one foe · 5 hits · 4.37 · lingers at 0.3 |
| 5 | `summoner-bow.5b` | Side B | Bonded Sagittarius | 5 | 20 | one foe · 4 hits · 4.6 · lingers at 0.4 |

#### Summoner · Katana (`summoner-katana`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `summoner-katana.1` | Core | Ronin | free | 7 | one foe · 2 hits · 1.6 · lingers at 0.3 |
| 1 | `summoner-katana.1a` | Side A | Ronin Pack | 1 | 7 | one foe · 3 hits · 1.521 · lingers at 0.3 |
| 1 | `summoner-katana.1b` | Side B | Bonded Ronin | 1 | 8 | one foe · 2 hits · 1.6 · lingers at 0.4 |
| 2 | `summoner-katana.2` | Core | Samurai | free | 10 | one foe · 2 hits · 2.2 · lingers at 0.3 |
| 2 | `summoner-katana.2a` | Side A | Samurai Pack | 2 | 10 | one foe · 3 hits · 2.091 · lingers at 0.3 |
| 2 | `summoner-katana.2b` | Side B | Bonded Samurai | 2 | 11 | one foe · 2 hits · 2.2 · lingers at 0.4 |
| 3 | `summoner-katana.3` | Core | Kensei | free | 13 | one foe · 2 hits · 2.9 · lingers at 0.3 |
| 3 | `summoner-katana.3a` | Side A | Kensei Pack | 3 | 13 | one foe · 3 hits · 2.754 · lingers at 0.3 |
| 3 | `summoner-katana.3b` | Side B | Bonded Kensei | 3 | 14 | one foe · 2 hits · 2.9 · lingers at 0.4 |
| 4 | `summoner-katana.4` | Core | Blade Shogun | free | 15 | one foe · 2 hits · 3.7 · lingers at 0.3 |
| 4 | `summoner-katana.4a` | Side A | Blade Shogun Pack | 4 | 15 | one foe · 3 hits · 3.516 · lingers at 0.3 |
| 4 | `summoner-katana.4b` | Side B | Bonded Blade Shogun | 4 | 17 | one foe · 2 hits · 3.7 · lingers at 0.4 |
| 5 | `summoner-katana.5` | Core | Sword Spirit | free | 18 | one foe · 2 hits · 4.6 · lingers at 0.3 |
| 5 | `summoner-katana.5a` | Side A | Sword Spirit Pack | 5 | 18 | one foe · 3 hits · 4.371 · lingers at 0.3 |
| 5 | `summoner-katana.5b` | Side B | Bonded Sword Spirit | 5 | 20 | one foe · 2 hits · 4.6 · lingers at 0.4 |

#### Summoner · Fire Tome (`summoner-tome-fire`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `summoner-tome-fire.1` | Core | Ember Sprites | free | 7 | one foe · 1 hit · 1.6 · lingers at 0.3 |
| 1 | `summoner-tome-fire.1a` | Side A | Ember Sprites Pack | 1 | 7 | one foe · 2 hits · 1.52 · lingers at 0.3 |
| 1 | `summoner-tome-fire.1b` | Side B | Bonded Ember Sprites | 1 | 8 | one foe · 1 hit · 1.6 · lingers at 0.4 |
| 2 | `summoner-tome-fire.2` | Core | Salamander | free | 10 | one foe · 1 hit · 2.2 · lingers at 0.3 |
| 2 | `summoner-tome-fire.2a` | Side A | Salamander Pack | 2 | 10 | one foe · 2 hits · 2.09 · lingers at 0.3 |
| 2 | `summoner-tome-fire.2b` | Side B | Bonded Salamander | 2 | 11 | one foe · 1 hit · 2.2 · lingers at 0.4 |
| 3 | `summoner-tome-fire.3` | Core | Fire Drake | free | 13 | one foe · 2 hits · 2.9 · lingers at 0.3 |
| 3 | `summoner-tome-fire.3a` | Side A | Fire Drake Pack | 3 | 13 | one foe · 3 hits · 2.754 · lingers at 0.3 |
| 3 | `summoner-tome-fire.3b` | Side B | Bonded Fire Drake | 3 | 14 | one foe · 2 hits · 2.9 · lingers at 0.4 |
| 4 | `summoner-tome-fire.4` | Core | Infernal Wyrm | free | 15 | one foe · 2 hits · 3.7 · lingers at 0.3 |
| 4 | `summoner-tome-fire.4a` | Side A | Infernal Wyrm Pack | 4 | 15 | one foe · 3 hits · 3.516 · lingers at 0.3 |
| 4 | `summoner-tome-fire.4b` | Side B | Bonded Infernal Wyrm | 4 | 17 | one foe · 2 hits · 3.7 · lingers at 0.4 |
| 5 | `summoner-tome-fire.5` | Core | Phoenix | free | 18 | one foe · 3 hits · 4.599 · lingers at 0.3 |
| 5 | `summoner-tome-fire.5a` | Side A | Phoenix Pack | 5 | 18 | one foe · 4 hits · 4.368 · lingers at 0.3 |
| 5 | `summoner-tome-fire.5b` | Side B | Bonded Phoenix | 5 | 20 | one foe · 3 hits · 4.599 · lingers at 0.4 |

#### Summoner · Blizzard Tome (`summoner-tome-ice`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `summoner-tome-ice.1` | Core | Frost Sprites | free | 10 | every foe · 1 hit · 0.88 · lingers at 0.3 |
| 1 | `summoner-tome-ice.1a` | Side A | Frost Sprites Pack | 1 | 10 | every foe · 2 hits · 0.836 · lingers at 0.3 |
| 1 | `summoner-tome-ice.1b` | Side B | Bonded Frost Sprites | 1 | 11 | every foe · 1 hit · 0.88 · lingers at 0.4 |
| 2 | `summoner-tome-ice.2` | Core | Snow Wolves | free | 13 | every foe · 2 hits · 1.21 · lingers at 0.3 |
| 2 | `summoner-tome-ice.2a` | Side A | Snow Wolves Pack | 2 | 13 | every foe · 3 hits · 1.149 · lingers at 0.3 |
| 2 | `summoner-tome-ice.2b` | Side B | Bonded Snow Wolves | 2 | 14 | every foe · 2 hits · 1.21 · lingers at 0.4 |
| 3 | `summoner-tome-ice.3` | Core | Ice Golem | free | 15 | every foe · 2 hits · 1.596 · lingers at 0.3 |
| 3 | `summoner-tome-ice.3a` | Side A | Ice Golem Pack | 3 | 15 | every foe · 3 hits · 1.515 · lingers at 0.3 |
| 3 | `summoner-tome-ice.3b` | Side B | Bonded Ice Golem | 3 | 17 | every foe · 2 hits · 1.596 · lingers at 0.4 |
| 4 | `summoner-tome-ice.4` | Core | Frost Titan | free | 18 | every foe · 3 hits · 2.034 · lingers at 0.3 |
| 4 | `summoner-tome-ice.4a` | Side A | Frost Titan Pack | 4 | 18 | every foe · 4 hits · 1.932 · lingers at 0.3 |
| 4 | `summoner-tome-ice.4b` | Side B | Bonded Frost Titan | 4 | 20 | every foe · 3 hits · 2.034 · lingers at 0.4 |
| 5 | `summoner-tome-ice.5` | Core | Winter Queen | free | 21 | every foe · 3 hits · 2.529 · lingers at 0.3 |
| 5 | `summoner-tome-ice.5a` | Side A | Winter Queen Pack | 5 | 21 | every foe · 4 hits · 2.404 · lingers at 0.3 |
| 5 | `summoner-tome-ice.5b` | Side B | Bonded Winter Queen | 5 | 22 | every foe · 3 hits · 2.529 · lingers at 0.4 |

#### Summoner · Thunder Tome (`summoner-tome-lightning`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `summoner-tome-lightning.1` | Core | Spark Sprites | free | 7 | random foes · 2 hits · 1.68 · lingers at 0.3 |
| 1 | `summoner-tome-lightning.1a` | Side A | Spark Sprites Pack | 1 | 7 | random foes · 3 hits · 1.596 · lingers at 0.3 |
| 1 | `summoner-tome-lightning.1b` | Side B | Bonded Spark Sprites | 1 | 8 | random foes · 2 hits · 1.68 · lingers at 0.4 |
| 2 | `summoner-tome-lightning.2` | Core | Thunderbird | free | 10 | random foes · 2 hits · 2.31 · lingers at 0.3 |
| 2 | `summoner-tome-lightning.2a` | Side A | Thunderbird Pack | 2 | 10 | random foes · 3 hits · 2.196 · lingers at 0.3 |
| 2 | `summoner-tome-lightning.2b` | Side B | Bonded Thunderbird | 2 | 11 | random foes · 2 hits · 2.31 · lingers at 0.4 |
| 3 | `summoner-tome-lightning.3` | Core | Storm Roc | free | 13 | random foes · 3 hits · 3.045 · lingers at 0.3 |
| 3 | `summoner-tome-lightning.3a` | Side A | Storm Roc Pack | 3 | 13 | random foes · 4 hits · 2.892 · lingers at 0.3 |
| 3 | `summoner-tome-lightning.3b` | Side B | Bonded Storm Roc | 3 | 14 | random foes · 3 hits · 3.045 · lingers at 0.4 |
| 4 | `summoner-tome-lightning.4` | Core | Thunder Kirin | free | 15 | random foes · 3 hits · 3.885 · lingers at 0.3 |
| 4 | `summoner-tome-lightning.4a` | Side A | Thunder Kirin Pack | 4 | 15 | random foes · 4 hits · 3.692 · lingers at 0.3 |
| 4 | `summoner-tome-lightning.4b` | Side B | Bonded Thunder Kirin | 4 | 17 | random foes · 3 hits · 3.885 · lingers at 0.4 |
| 5 | `summoner-tome-lightning.5` | Core | Raijin | free | 18 | random foes · 4 hits · 4.832 · lingers at 0.3 |
| 5 | `summoner-tome-lightning.5a` | Side A | Raijin Pack | 5 | 18 | random foes · 5 hits · 4.59 · lingers at 0.3 |
| 5 | `summoner-tome-lightning.5b` | Side B | Bonded Raijin | 5 | 20 | random foes · 4 hits · 4.832 · lingers at 0.4 |

#### Summoner · Light Tome (`summoner-tome-light`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `summoner-tome-light.1` | Core | Cherub | free | 7 | one foe · 2 hits · 1.6 · lingers at 0.3 |
| 1 | `summoner-tome-light.1a` | Side A | Cherub Pack | 1 | 7 | one foe · 3 hits · 1.521 · lingers at 0.3 |
| 1 | `summoner-tome-light.1b` | Side B | Bonded Cherub | 1 | 8 | one foe · 2 hits · 1.6 · lingers at 0.4 |
| 2 | `summoner-tome-light.2` | Core | Angel Lancer | free | 10 | one foe · 2 hits · 2.2 · lingers at 0.3 |
| 2 | `summoner-tome-light.2a` | Side A | Angel Lancer Pack | 2 | 10 | one foe · 3 hits · 2.091 · lingers at 0.3 |
| 2 | `summoner-tome-light.2b` | Side B | Bonded Angel Lancer | 2 | 11 | one foe · 2 hits · 2.2 · lingers at 0.4 |
| 3 | `summoner-tome-light.3` | Core | Seraph Phalanx | free | 13 | one foe · 3 hits · 2.901 · lingers at 0.3 |
| 3 | `summoner-tome-light.3a` | Side A | Seraph Phalanx Pack | 3 | 13 | one foe · 4 hits · 2.756 · lingers at 0.3 |
| 3 | `summoner-tome-light.3b` | Side B | Bonded Seraph Phalanx | 3 | 14 | one foe · 3 hits · 2.901 · lingers at 0.4 |
| 4 | `summoner-tome-light.4` | Core | Dominion Host | free | 15 | one foe · 3 hits · 3.699 · lingers at 0.3 |
| 4 | `summoner-tome-light.4a` | Side A | Dominion Host Pack | 4 | 15 | one foe · 4 hits · 3.516 · lingers at 0.3 |
| 4 | `summoner-tome-light.4b` | Side B | Bonded Dominion Host | 4 | 17 | one foe · 3 hits · 3.699 · lingers at 0.4 |
| 5 | `summoner-tome-light.5` | Core | Heaven's Legion | free | 18 | one foe · 4 hits · 4.6 · lingers at 0.3 |
| 5 | `summoner-tome-light.5a` | Side A | Heaven's Legion Pack | 5 | 18 | one foe · 5 hits · 4.37 · lingers at 0.3 |
| 5 | `summoner-tome-light.5b` | Side B | Bonded Heaven's Legion | 5 | 20 | one foe · 4 hits · 4.6 · lingers at 0.4 |

#### Summoner · Dark Tome (`summoner-tome-dark`)

| Depth | Node | Slot | Name | Cost | MP | What it does |
|---|---|---|---|---|---|---|
| 1 | `summoner-tome-dark.1` | Core | Imp Brute | free | 7 | one foe · 2 hits · 1.6 · lingers at 0.3 |
| 1 | `summoner-tome-dark.1a` | Side A | Imp Brute Pack | 1 | 7 | one foe · 3 hits · 1.521 · lingers at 0.3 |
| 1 | `summoner-tome-dark.1b` | Side B | Bonded Imp Brute | 1 | 8 | one foe · 2 hits · 1.6 · lingers at 0.4 |
| 2 | `summoner-tome-dark.2` | Core | Hellknight | free | 10 | one foe · 2 hits · 2.2 · lingers at 0.3 |
| 2 | `summoner-tome-dark.2a` | Side A | Hellknight Pack | 2 | 10 | one foe · 3 hits · 2.091 · lingers at 0.3 |
| 2 | `summoner-tome-dark.2b` | Side B | Bonded Hellknight | 2 | 11 | one foe · 2 hits · 2.2 · lingers at 0.4 |
| 3 | `summoner-tome-dark.3` | Core | Dread Knight | free | 13 | one foe · 2 hits · 2.9 · lingers at 0.3 |
| 3 | `summoner-tome-dark.3a` | Side A | Dread Knight Pack | 3 | 13 | one foe · 3 hits · 2.754 · lingers at 0.3 |
| 3 | `summoner-tome-dark.3b` | Side B | Bonded Dread Knight | 3 | 14 | one foe · 2 hits · 2.9 · lingers at 0.4 |
| 4 | `summoner-tome-dark.4` | Core | Demon Lord | free | 15 | one foe · 2 hits · 3.7 · lingers at 0.3 |
| 4 | `summoner-tome-dark.4a` | Side A | Demon Lord Pack | 4 | 15 | one foe · 3 hits · 3.516 · lingers at 0.3 |
| 4 | `summoner-tome-dark.4b` | Side B | Bonded Demon Lord | 4 | 17 | one foe · 2 hits · 3.7 · lingers at 0.4 |
| 5 | `summoner-tome-dark.5` | Core | Abyssal Overlord | free | 18 | one foe · 2 hits · 4.6 · lingers at 0.3 |
| 5 | `summoner-tome-dark.5a` | Side A | Abyssal Overlord Pack | 5 | 18 | one foe · 3 hits · 4.371 · lingers at 0.3 |
| 5 | `summoner-tome-dark.5b` | Side B | Bonded Abyssal Overlord | 5 | 20 | one foe · 2 hits · 4.6 · lingers at 0.4 |
<!-- /live -->
