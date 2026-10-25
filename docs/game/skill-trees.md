# Skill trees

Every tree, every node, every number, as engine v16 plays them (D201, D207, live since H72, D210): 50 trees, one per
class and weapon (D86; the Paladin's ten, D179), of eight nodes each: the **trunk** (depths 1–2), **line A** and **line
B** (depths 3–5), B named in each tree's heading. Generated from `packages/domain/src/rpg/catalog.ts`. The rules (her
three slots, lines, Skill Ranks) are in [classes](classes.md#skills-depths-lines-and-ranks).

How to read a row:
- **Node** is the id the save and the engine use: `<tree>.<depth>` for the trunk and line A, `<tree>.<depth>a|b` for
  line B (the catalog's side letter: B is `b` on most trees, `a` on some, by class and kind).
- **Line** says where it sits: the trunk, line A or line B.
- **MP** is what it costs her, after her hand.
- **What it does** gives the targets, the number of hits and the total power before her hand, at Skill Rank 3 (×1; her
  rank moves it ×0.95 to ×1.05). Extras follow: a status,
  a summon's linger share, a rider (a status on each foe hit), a special, and a healer's support: a mend, a Barrier,
  Aegis, Regen, a cleanse, a drain or a revive, as shares of max HP before her healing scale.
- A Spell Blade's Arms skills land one hit more than listed, the same total; a Summoner's Tome summons linger, then
  strike every foe once in farewell ([combat](combat.md#the-actions)).

Shapes by kind: Greatsword and Fire hit one foe hard; Axe and Ice every foe; Lance and Lightning random foes; Bow and
Light one foe many times; Katana and Dark twice (the foe, then one other).

<!-- live:skill-trees -->
### Brawler

5 trees; her three weapons choose three. Powers below are at Rank 3, before her hand (×1) and her Skill Rank; MP is hers (×1).

#### Brawler · Greatsword (`brawler-greatsword`), B · Combo

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `brawler-greatsword.1` | Trunk | Heavy Slash | 10 | one foe · 1 hit · 1.6 |
| 2 | `brawler-greatsword.2` | Trunk | Cleave | 14 | one foe · 1 hit · 2.2 |
| 3 | `brawler-greatsword.3` | A | Sunder | 18 | one foe · 2 hits · 2.9 |
| 4 | `brawler-greatsword.4` | A | Rend | 22 | one foe · 2 hits · 3.7 |
| 5 | `brawler-greatsword.5` | A | Meteor Strike | 26 | one foe · 3 hits · 4.599 |
| 3 | `brawler-greatsword.3b` | B · Combo | Triple Sunder | 18 | one foe · 3 hits · 2.667 |
| 4 | `brawler-greatsword.4b` | B · Combo | Rending Combo | 22 | one foe · 3 hits · 3.405 |
| 5 | `brawler-greatsword.5b` | B · Combo | Meteor Combo | 26 | one foe · 4 hits · 4.232 |

#### Brawler · Axe (`brawler-axe`), B · Reap

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `brawler-axe.1` | Trunk | Sweep | 14 | every foe · 1 hit · 0.88 |
| 2 | `brawler-axe.2` | Trunk | Whirl | 18 | every foe · 1 hit · 1.21 |
| 3 | `brawler-axe.3` | A | Cyclone | 22 | every foe · 2 hits · 1.596 |
| 4 | `brawler-axe.4` | A | Quake | 26 | every foe · 2 hits · 2.036 |
| 5 | `brawler-axe.5` | A | Maelstrom | 30 | every foe · 3 hits · 2.529 |
| 3 | `brawler-axe.3b` | B · Reap | Headsman's Cyclone | 24 | every foe · 2 hits · 1.306 |
| 4 | `brawler-axe.4b` | B · Reap | Guillotine Quake | 28 | every foe · 2 hits · 1.666 |
| 5 | `brawler-axe.5b` | B · Reap | Executioner's Storm | 32 | every foe · 3 hits · 2.07 |

#### Brawler · Lance (`brawler-lance`), B · Impale

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `brawler-lance.1` | Trunk | Thrust Flurry | 10 | random foes · 2 hits · 1.68 |
| 2 | `brawler-lance.2` | Trunk | Lance Barrage | 14 | random foes · 2 hits · 2.31 |
| 3 | `brawler-lance.3` | A | Spiral Barrage | 18 | random foes · 4 hits · 3.044 |
| 4 | `brawler-lance.4` | A | Dragon Dive | 22 | random foes · 4 hits · 3.884 |
| 5 | `brawler-lance.5` | A | Heaven's Rain | 26 | random foes · 6 hits · 4.83 |
| 3 | `brawler-lance.3a` | B · Impale | Skewer | 20 | one foe · 2 hits · 3.167 |
| 4 | `brawler-lance.4a` | B · Impale | Dragon Fang | 24 | one foe · 2 hits · 4.043 |
| 5 | `brawler-lance.5a` | B · Impale | Gungnir | 28 | one foe · 3 hits · 5.025 |

#### Brawler · Bow (`brawler-bow`), B · Rain

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `brawler-bow.1` | Trunk | Twin Arrows | 10 | one foe · 2 hits · 1.6 |
| 2 | `brawler-bow.2` | Trunk | Triple Shot | 14 | one foe · 2 hits · 2.2 |
| 3 | `brawler-bow.3` | A | Quiver Volley | 18 | one foe · 4 hits · 2.9 |
| 4 | `brawler-bow.4` | A | Arrow Storm | 22 | one foe · 4 hits · 3.7 |
| 5 | `brawler-bow.5` | A | Starfall Barrage | 26 | one foe · 6 hits · 4.602 |
| 3 | `brawler-bow.3b` | B · Rain | Rain of Arrows | 22 | one foe · 4 hits · 2.9 |
| 4 | `brawler-bow.4b` | B · Rain | Arrow Hail | 26 | one foe · 4 hits · 3.7 |
| 5 | `brawler-bow.5b` | B · Rain | Starfall Rain | 30 | one foe · 6 hits · 4.602 |

#### Brawler · Katana (`brawler-katana`), B · Draw

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `brawler-katana.1` | Trunk | Double Slash | 10 | one foe · 2 hits · 1.6 |
| 2 | `brawler-katana.2` | Trunk | Crossing Cut | 14 | one foe · 2 hits · 2.2 |
| 3 | `brawler-katana.3` | A | Twin Moon | 18 | one foe · 2 hits · 2.9 |
| 4 | `brawler-katana.4` | A | Iai Storm | 22 | one foe · 2 hits · 3.7 |
| 5 | `brawler-katana.5` | A | Moonfall | 26 | one foe · 2 hits · 4.6 |
| 3 | `brawler-katana.3a` | B · Draw | Flash Draw | 20 | one foe · 1 hit · 3.002 |
| 4 | `brawler-katana.4a` | B · Draw | Moonlit Draw | 24 | one foe · 1 hit · 3.83 |
| 5 | `brawler-katana.5a` | B · Draw | Final Draw | 28 | one foe · 1 hit · 4.761 |

### Mage

5 trees; her three weapons choose three. Powers below are at Rank 3, before her hand (×1) and her Skill Rank; MP is hers (×1).

#### Mage · Fire Tome (`mage-tome-fire`), B · Wave

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `mage-tome-fire.1` | Trunk | Fire | 10 | one foe · 1 hit · 1.6 |
| 2 | `mage-tome-fire.2` | Trunk | Fira | 14 | one foe · 1 hit · 2.2 |
| 3 | `mage-tome-fire.3` | A | Firaga | 18 | one foe · 1 hit · 2.9 |
| 4 | `mage-tome-fire.4` | A | Firaja | 22 | one foe · 1 hit · 3.7 |
| 5 | `mage-tome-fire.5` | A | Flare Star | 26 | one foe · 1 hit · 4.6 |
| 3 | `mage-tome-fire.3a` | B · Wave | Firaga Wave | 22 | every foe · 1 hit · 1.595 |
| 4 | `mage-tome-fire.4a` | B · Wave | Firaja Wave | 26 | every foe · 1 hit · 2.035 |
| 5 | `mage-tome-fire.5a` | B · Wave | Flare Wave | 30 | every foe · 1 hit · 2.53 |

#### Mage · Blizzard Tome (`mage-tome-ice`), B · Spike

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `mage-tome-ice.1` | Trunk | Blizzard | 14 | every foe · 1 hit · 0.88 |
| 2 | `mage-tome-ice.2` | Trunk | Blizzara | 18 | every foe · 1 hit · 1.21 |
| 3 | `mage-tome-ice.3` | A | Blizzaga | 22 | every foe · 1 hit · 1.595 |
| 4 | `mage-tome-ice.4` | A | Blizzaja | 26 | every foe · 1 hit · 2.035 |
| 5 | `mage-tome-ice.5` | A | Absolute Zero | 30 | every foe · 2 hits · 2.53 |
| 3 | `mage-tome-ice.3a` | B · Spike | Blizzaga Spike | 18 | one foe · 1 hit · 3.19 |
| 4 | `mage-tome-ice.4a` | B · Spike | Blizzaja Spike | 22 | one foe · 1 hit · 4.07 |
| 5 | `mage-tome-ice.5a` | B · Spike | Zero Spike | 26 | one foe · 1 hit · 5.06 |

#### Mage · Thunder Tome (`mage-tome-lightning`), B · Bolt

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `mage-tome-lightning.1` | Trunk | Thunder | 10 | random foes · 2 hits · 1.68 |
| 2 | `mage-tome-lightning.2` | Trunk | Thundara | 14 | random foes · 2 hits · 2.31 |
| 3 | `mage-tome-lightning.3` | A | Thundaga | 18 | random foes · 3 hits · 3.045 |
| 4 | `mage-tome-lightning.4` | A | Thundaja | 22 | random foes · 3 hits · 3.885 |
| 5 | `mage-tome-lightning.5` | A | Judgment Storm | 26 | random foes · 4 hits · 4.832 |
| 3 | `mage-tome-lightning.3a` | B · Bolt | Thundaga Bolt | 18 | one foe · 1 hit · 2.9 |
| 4 | `mage-tome-lightning.4a` | B · Bolt | Thundaja Bolt | 22 | one foe · 1 hit · 3.7 |
| 5 | `mage-tome-lightning.5a` | B · Bolt | Judgment Bolt | 26 | one foe · 1 hit · 4.6 |

#### Mage · Light Tome (`mage-tome-light`), B · Cascade

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `mage-tome-light.1` | Trunk | Lux | 10 | one foe · 2 hits · 1.6 |
| 2 | `mage-tome-light.2` | Trunk | Luxra | 14 | one foe · 2 hits · 2.2 |
| 3 | `mage-tome-light.3` | A | Luxaga | 18 | one foe · 4 hits · 2.9 |
| 4 | `mage-tome-light.4` | A | Luxaja | 22 | one foe · 4 hits · 3.7 |
| 5 | `mage-tome-light.5` | A | Holy | 26 | one foe · 6 hits · 4.602 |
| 3 | `mage-tome-light.3b` | B · Cascade | Luxaga Cascade | 24 | every foe · 2 hits · 1.45 |
| 4 | `mage-tome-light.4b` | B · Cascade | Luxaja Cascade | 28 | every foe · 2 hits · 1.85 |
| 5 | `mage-tome-light.5b` | B · Cascade | Holy Cascade | 32 | every foe · 2 hits · 2.3 |

#### Mage · Dark Tome (`mage-tome-dark`), B · Pierce

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `mage-tome-dark.1` | Trunk | Nox | 10 | one foe · 2 hits · 1.6 |
| 2 | `mage-tome-dark.2` | Trunk | Noxra | 14 | one foe · 2 hits · 2.2 |
| 3 | `mage-tome-dark.3` | A | Noxaga | 18 | one foe · 2 hits · 2.9 |
| 4 | `mage-tome-dark.4` | A | Noxaja | 22 | one foe · 2 hits · 3.7 |
| 5 | `mage-tome-dark.5` | A | Black Hole | 26 | one foe · 2 hits · 4.6 |
| 3 | `mage-tome-dark.3a` | B · Pierce | Noxaga Pierce | 20 | one foe · 1 hit · 3.002 |
| 4 | `mage-tome-dark.4a` | B · Pierce | Noxaja Pierce | 24 | one foe · 1 hit · 3.83 |
| 5 | `mage-tome-dark.5a` | B · Pierce | Void Pierce | 28 | one foe · 1 hit · 4.761 |

### Spell Blade

10 trees; her three weapons choose three. Powers below are at Rank 3, before her hand (×0.72 on Arms, ×0.44 on Tomes) and her Skill Rank; MP is hers (×0.5).

#### Spell Blade · Greatsword (`spellblade-greatsword`), B · Pierce

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `spellblade-greatsword.1` | Trunk | Rune Cleave | 5 | one foe · 1 hit · 1.6 |
| 2 | `spellblade-greatsword.2` | Trunk | Arcane Cleave | 7 | one foe · 1 hit · 2.2 |
| 3 | `spellblade-greatsword.3` | A | Mystic Cleave | 9 | one foe · 1 hit · 2.9 |
| 4 | `spellblade-greatsword.4` | A | Astral Cleave | 11 | one foe · 2 hits · 3.7 |
| 5 | `spellblade-greatsword.5` | A | Celestial Cleave | 13 | one foe · 2 hits · 4.6 |
| 3 | `spellblade-greatsword.3b` | B · Pierce | Piercing Mystic Cleave | 10 | one foe · 1 hit · 3.335 |
| 4 | `spellblade-greatsword.4b` | B · Pierce | Piercing Astral Cleave | 12 | one foe · 1 hit · 4.255 |
| 5 | `spellblade-greatsword.5b` | B · Pierce | Piercing Celestial Cleave | 14 | one foe · 1 hit · 5.29 |

#### Spell Blade · Axe (`spellblade-axe`), B · Pierce

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `spellblade-axe.1` | Trunk | Rune Hew | 5 | one foe · 1 hit · 1.6 |
| 2 | `spellblade-axe.2` | Trunk | Arcane Hew | 7 | one foe · 1 hit · 2.2 |
| 3 | `spellblade-axe.3` | A | Mystic Hew | 9 | one foe · 2 hits · 2.9 |
| 4 | `spellblade-axe.4` | A | Astral Hew | 11 | one foe · 2 hits · 3.7 |
| 5 | `spellblade-axe.5` | A | Celestial Hew | 13 | one foe · 2 hits · 4.6 |
| 3 | `spellblade-axe.3b` | B · Pierce | Piercing Mystic Hew | 10 | one foe · 1 hit · 3.335 |
| 4 | `spellblade-axe.4b` | B · Pierce | Piercing Astral Hew | 12 | one foe · 1 hit · 4.255 |
| 5 | `spellblade-axe.5b` | B · Pierce | Piercing Celestial Hew | 14 | one foe · 1 hit · 5.29 |

#### Spell Blade · Lance (`spellblade-lance`), B · Pierce

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `spellblade-lance.1` | Trunk | Rune Thrust | 5 | one foe · 2 hits · 1.6 |
| 2 | `spellblade-lance.2` | Trunk | Arcane Thrust | 7 | one foe · 2 hits · 2.2 |
| 3 | `spellblade-lance.3` | A | Mystic Thrust | 9 | one foe · 2 hits · 2.9 |
| 4 | `spellblade-lance.4` | A | Astral Thrust | 11 | one foe · 3 hits · 3.699 |
| 5 | `spellblade-lance.5` | A | Celestial Thrust | 13 | one foe · 3 hits · 4.599 |
| 3 | `spellblade-lance.3b` | B · Pierce | Piercing Mystic Thrust | 10 | one foe · 1 hit · 3.335 |
| 4 | `spellblade-lance.4b` | B · Pierce | Piercing Astral Thrust | 12 | one foe · 1 hit · 4.255 |
| 5 | `spellblade-lance.5b` | B · Pierce | Piercing Celestial Thrust | 14 | one foe · 1 hit · 5.29 |

#### Spell Blade · Bow (`spellblade-bow`), B · Pierce

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `spellblade-bow.1` | Trunk | Rune Shot | 5 | one foe · 2 hits · 1.6 |
| 2 | `spellblade-bow.2` | Trunk | Arcane Shot | 7 | one foe · 2 hits · 2.2 |
| 3 | `spellblade-bow.3` | A | Mystic Shot | 9 | one foe · 3 hits · 2.901 |
| 4 | `spellblade-bow.4` | A | Astral Shot | 11 | one foe · 3 hits · 3.699 |
| 5 | `spellblade-bow.5` | A | Celestial Shot | 13 | one foe · 4 hits · 4.6 |
| 3 | `spellblade-bow.3b` | B · Pierce | Piercing Mystic Shot | 10 | one foe · 1 hit · 3.335 |
| 4 | `spellblade-bow.4b` | B · Pierce | Piercing Astral Shot | 12 | one foe · 1 hit · 4.255 |
| 5 | `spellblade-bow.5b` | B · Pierce | Piercing Celestial Shot | 14 | one foe · 1 hit · 5.29 |

#### Spell Blade · Katana (`spellblade-katana`), B · Pierce

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `spellblade-katana.1` | Trunk | Rune Draw | 5 | one foe · 2 hits · 1.6 |
| 2 | `spellblade-katana.2` | Trunk | Arcane Draw | 7 | one foe · 2 hits · 2.2 |
| 3 | `spellblade-katana.3` | A | Mystic Draw | 9 | one foe · 2 hits · 2.9 |
| 4 | `spellblade-katana.4` | A | Astral Draw | 11 | one foe · 2 hits · 3.7 |
| 5 | `spellblade-katana.5` | A | Celestial Draw | 13 | one foe · 2 hits · 4.6 |
| 3 | `spellblade-katana.3b` | B · Pierce | Piercing Mystic Draw | 10 | one foe · 1 hit · 3.335 |
| 4 | `spellblade-katana.4b` | B · Pierce | Piercing Astral Draw | 12 | one foe · 1 hit · 4.255 |
| 5 | `spellblade-katana.5b` | B · Pierce | Piercing Celestial Draw | 14 | one foe · 1 hit · 5.29 |

#### Spell Blade · Fire Tome (`spellblade-tome-fire`), B · Pierce

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `spellblade-tome-fire.1` | Trunk | Rune Brand | 5 | one foe · 1 hit · 1.6 |
| 2 | `spellblade-tome-fire.2` | Trunk | Arcane Brand | 7 | one foe · 1 hit · 2.2 |
| 3 | `spellblade-tome-fire.3` | A | Mystic Brand | 9 | one foe · 1 hit · 2.9 |
| 4 | `spellblade-tome-fire.4` | A | Astral Brand | 11 | one foe · 2 hits · 3.7 |
| 5 | `spellblade-tome-fire.5` | A | Celestial Brand | 13 | one foe · 2 hits · 4.6 |
| 3 | `spellblade-tome-fire.3b` | B · Pierce | Piercing Mystic Brand | 10 | one foe · 1 hit · 3.335 |
| 4 | `spellblade-tome-fire.4b` | B · Pierce | Piercing Astral Brand | 12 | one foe · 1 hit · 4.255 |
| 5 | `spellblade-tome-fire.5b` | B · Pierce | Piercing Celestial Brand | 14 | one foe · 1 hit · 5.29 |

#### Spell Blade · Blizzard Tome (`spellblade-tome-ice`), B · Pierce

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `spellblade-tome-ice.1` | Trunk | Rune Rime | 5 | one foe · 1 hit · 1.6 |
| 2 | `spellblade-tome-ice.2` | Trunk | Arcane Rime | 7 | one foe · 1 hit · 2.2 |
| 3 | `spellblade-tome-ice.3` | A | Mystic Rime | 9 | one foe · 2 hits · 2.9 |
| 4 | `spellblade-tome-ice.4` | A | Astral Rime | 11 | one foe · 2 hits · 3.7 |
| 5 | `spellblade-tome-ice.5` | A | Celestial Rime | 13 | one foe · 2 hits · 4.6 |
| 3 | `spellblade-tome-ice.3b` | B · Pierce | Piercing Mystic Rime | 10 | one foe · 1 hit · 3.335 |
| 4 | `spellblade-tome-ice.4b` | B · Pierce | Piercing Astral Rime | 12 | one foe · 1 hit · 4.255 |
| 5 | `spellblade-tome-ice.5b` | B · Pierce | Piercing Celestial Rime | 14 | one foe · 1 hit · 5.29 |

#### Spell Blade · Thunder Tome (`spellblade-tome-lightning`), B · Pierce

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `spellblade-tome-lightning.1` | Trunk | Rune Bolt | 5 | one foe · 2 hits · 1.6 |
| 2 | `spellblade-tome-lightning.2` | Trunk | Arcane Bolt | 7 | one foe · 2 hits · 2.2 |
| 3 | `spellblade-tome-lightning.3` | A | Mystic Bolt | 9 | one foe · 2 hits · 2.9 |
| 4 | `spellblade-tome-lightning.4` | A | Astral Bolt | 11 | one foe · 3 hits · 3.699 |
| 5 | `spellblade-tome-lightning.5` | A | Celestial Bolt | 13 | one foe · 3 hits · 4.599 |
| 3 | `spellblade-tome-lightning.3b` | B · Pierce | Piercing Mystic Bolt | 10 | one foe · 1 hit · 3.335 |
| 4 | `spellblade-tome-lightning.4b` | B · Pierce | Piercing Astral Bolt | 12 | one foe · 1 hit · 4.255 |
| 5 | `spellblade-tome-lightning.5b` | B · Pierce | Piercing Celestial Bolt | 14 | one foe · 1 hit · 5.29 |

#### Spell Blade · Light Tome (`spellblade-tome-light`), B · Pierce

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `spellblade-tome-light.1` | Trunk | Rune Ray | 5 | one foe · 2 hits · 1.6 |
| 2 | `spellblade-tome-light.2` | Trunk | Arcane Ray | 7 | one foe · 2 hits · 2.2 |
| 3 | `spellblade-tome-light.3` | A | Mystic Ray | 9 | one foe · 3 hits · 2.901 |
| 4 | `spellblade-tome-light.4` | A | Astral Ray | 11 | one foe · 3 hits · 3.699 |
| 5 | `spellblade-tome-light.5` | A | Celestial Ray | 13 | one foe · 4 hits · 4.6 |
| 3 | `spellblade-tome-light.3b` | B · Pierce | Piercing Mystic Ray | 10 | one foe · 1 hit · 3.335 |
| 4 | `spellblade-tome-light.4b` | B · Pierce | Piercing Astral Ray | 12 | one foe · 1 hit · 4.255 |
| 5 | `spellblade-tome-light.5b` | B · Pierce | Piercing Celestial Ray | 14 | one foe · 1 hit · 5.29 |

#### Spell Blade · Dark Tome (`spellblade-tome-dark`), B · Pierce

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `spellblade-tome-dark.1` | Trunk | Rune Shade | 5 | one foe · 2 hits · 1.6 |
| 2 | `spellblade-tome-dark.2` | Trunk | Arcane Shade | 7 | one foe · 2 hits · 2.2 |
| 3 | `spellblade-tome-dark.3` | A | Mystic Shade | 9 | one foe · 2 hits · 2.9 |
| 4 | `spellblade-tome-dark.4` | A | Astral Shade | 11 | one foe · 2 hits · 3.7 |
| 5 | `spellblade-tome-dark.5` | A | Celestial Shade | 13 | one foe · 2 hits · 4.6 |
| 3 | `spellblade-tome-dark.3b` | B · Pierce | Piercing Mystic Shade | 10 | one foe · 1 hit · 3.335 |
| 4 | `spellblade-tome-dark.4b` | B · Pierce | Piercing Astral Shade | 12 | one foe · 1 hit · 4.255 |
| 5 | `spellblade-tome-dark.5b` | B · Pierce | Piercing Celestial Shade | 14 | one foe · 1 hit · 5.29 |

### Cleric

10 trees; her three weapons choose three. Powers below are at Rank 3, before her hand (×0.5) and her Skill Rank; MP is hers (×0.6).

#### Cleric · Greatsword (`cleric-greatsword`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `cleric-greatsword.1` | Trunk | Breach | 6 | one foe · 1 hit · 1.6 · Armor Break 1 on the foe · Barrier 28% on the most threatened |
| 2 | `cleric-greatsword.2` | Trunk | Sunder Armor | 8 | one foe · 1 hit · 2.2 · Armor Break 1 on the foe · Barrier 32% on the most threatened |
| 3 | `cleric-greatsword.3` | A | Rupture | 11 | one foe · 1 hit · 2.9 · Armor Break 2 on the foe · Barrier 36% on the most threatened |
| 4 | `cleric-greatsword.4` | A | Ravage | 13 | one foe · 1 hit · 3.7 · Armor Break 2 on the foe · Barrier 40% on the most threatened |
| 5 | `cleric-greatsword.5` | A | Ruin | 16 | one foe · 1 hit · 4.6 · Armor Break 3 on every foe · Barrier 44% on every ally |
| 3 | `cleric-greatsword.3b` | B · Heavy | Heavy Rupture | 13 | one foe · 1 hit · 2.9 · Armor Break 3 on the foe · Barrier 36% on the most threatened |
| 4 | `cleric-greatsword.4b` | B · Heavy | Heavy Ravage | 16 | one foe · 1 hit · 3.7 · Armor Break 3 on the foe · Barrier 40% on the most threatened |
| 5 | `cleric-greatsword.5b` | B · Heavy | Heavy Ruin | 18 | one foe · 1 hit · 4.6 · Armor Break 4 on every foe · Barrier 44% on every ally |

#### Cleric · Axe (`cleric-axe`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `cleric-axe.1` | Trunk | Hack | 6 | one foe · 1 hit · 1.6 · Enfeeble 1 on the foe · Barrier 28% on the most threatened |
| 2 | `cleric-axe.2` | Trunk | Hamstring | 8 | one foe · 1 hit · 2.2 · Enfeeble 1 on the foe · Barrier 32% on the most threatened |
| 3 | `cleric-axe.3` | A | Maim | 11 | one foe · 1 hit · 2.9 · Enfeeble 2 on the foe · Barrier 36% on the most threatened |
| 4 | `cleric-axe.4` | A | Cripple | 13 | one foe · 1 hit · 3.7 · Enfeeble 2 on the foe · Barrier 40% on the most threatened |
| 5 | `cleric-axe.5` | A | Unmake | 16 | one foe · 1 hit · 4.6 · Enfeeble 3 on every foe · Barrier 44% on every ally |
| 3 | `cleric-axe.3b` | B · Heavy | Heavy Maim | 13 | one foe · 1 hit · 2.9 · Enfeeble 3 on the foe · Barrier 36% on the most threatened |
| 4 | `cleric-axe.4b` | B · Heavy | Heavy Cripple | 16 | one foe · 1 hit · 3.7 · Enfeeble 3 on the foe · Barrier 40% on the most threatened |
| 5 | `cleric-axe.5b` | B · Heavy | Heavy Unmake | 18 | one foe · 1 hit · 4.6 · Enfeeble 4 on every foe · Barrier 44% on every ally |

#### Cleric · Lance (`cleric-lance`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `cleric-lance.1` | Trunk | Pierce Mind | 6 | one foe · 1 hit · 1.6 · Mind Break 1 on the foe · Barrier 28% on the most threatened |
| 2 | `cleric-lance.2` | Trunk | Puncture | 8 | one foe · 1 hit · 2.2 · Mind Break 1 on the foe · Barrier 32% on the most threatened |
| 3 | `cleric-lance.3` | A | Impale | 11 | one foe · 1 hit · 2.9 · Mind Break 2 on the foe · Barrier 36% on the most threatened |
| 4 | `cleric-lance.4` | A | Transfix | 13 | one foe · 1 hit · 3.7 · Mind Break 2 on the foe · Barrier 40% on the most threatened |
| 5 | `cleric-lance.5` | A | Mindspike | 16 | one foe · 1 hit · 4.6 · Mind Break 3 on every foe · Barrier 44% on every ally |
| 3 | `cleric-lance.3b` | B · Heavy | Heavy Impale | 13 | one foe · 1 hit · 2.9 · Mind Break 3 on the foe · Barrier 36% on the most threatened |
| 4 | `cleric-lance.4b` | B · Heavy | Heavy Transfix | 16 | one foe · 1 hit · 3.7 · Mind Break 3 on the foe · Barrier 40% on the most threatened |
| 5 | `cleric-lance.5b` | B · Heavy | Heavy Mindspike | 18 | one foe · 1 hit · 4.6 · Mind Break 4 on every foe · Barrier 44% on every ally |

#### Cleric · Bow (`cleric-bow`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `cleric-bow.1` | Trunk | Chip | 6 | one foe · 1 hit · 1.6 · Shatter 1 on the foe · Barrier 28% on the most threatened |
| 2 | `cleric-bow.2` | Trunk | Crack | 8 | one foe · 1 hit · 2.2 · Shatter 1 on the foe · Barrier 32% on the most threatened |
| 3 | `cleric-bow.3` | A | Fracture | 11 | one foe · 1 hit · 2.9 · Shatter 2 on the foe · Barrier 36% on the most threatened |
| 4 | `cleric-bow.4` | A | Splinter | 13 | one foe · 1 hit · 3.7 · Shatter 2 on the foe · Barrier 40% on the most threatened |
| 5 | `cleric-bow.5` | A | Shatterstorm | 16 | one foe · 1 hit · 4.6 · Shatter 3 on every foe · Barrier 44% on every ally |
| 3 | `cleric-bow.3b` | B · Heavy | Heavy Fracture | 13 | one foe · 1 hit · 2.9 · Shatter 3 on the foe · Barrier 36% on the most threatened |
| 4 | `cleric-bow.4b` | B · Heavy | Heavy Splinter | 16 | one foe · 1 hit · 3.7 · Shatter 3 on the foe · Barrier 40% on the most threatened |
| 5 | `cleric-bow.5b` | B · Heavy | Heavy Shatterstorm | 18 | one foe · 1 hit · 4.6 · Shatter 4 on every foe · Barrier 44% on every ally |

#### Cleric · Katana (`cleric-katana`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `cleric-katana.1` | Trunk | Mark | 6 | one foe · 1 hit · 1.6 · Hex 1 on the foe · Barrier 28% on the most threatened |
| 2 | `cleric-katana.2` | Trunk | Curse | 8 | one foe · 1 hit · 2.2 · Hex 1 on the foe · Barrier 32% on the most threatened |
| 3 | `cleric-katana.3` | A | Hex | 11 | one foe · 1 hit · 2.9 · Hex 2 on the foe · Barrier 36% on the most threatened |
| 4 | `cleric-katana.4` | A | Doom | 13 | one foe · 1 hit · 3.7 · Hex 2 on the foe · Barrier 40% on the most threatened |
| 5 | `cleric-katana.5` | A | Anathema | 16 | one foe · 1 hit · 4.6 · Hex 3 on every foe · Barrier 44% on every ally |
| 3 | `cleric-katana.3b` | B · Heavy | Heavy Hex | 13 | one foe · 1 hit · 2.9 · Hex 3 on the foe · Barrier 36% on the most threatened |
| 4 | `cleric-katana.4b` | B · Heavy | Heavy Doom | 16 | one foe · 1 hit · 3.7 · Hex 3 on the foe · Barrier 40% on the most threatened |
| 5 | `cleric-katana.5b` | B · Heavy | Heavy Anathema | 18 | one foe · 1 hit · 4.6 · Hex 4 on every foe · Barrier 44% on every ally |

#### Cleric · Fire Tome (`cleric-tome-fire`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `cleric-tome-fire.1` | Trunk | Valor | 6 | one foe · 1 hit · 1.6 · Brave 1 on every ally · heals the most hurt 28% · cleanses |
| 2 | `cleric-tome-fire.2` | Trunk | Courage | 8 | one foe · 1 hit · 2.2 · Brave 1 on every ally · heals the most hurt 32% · cleanses |
| 3 | `cleric-tome-fire.3` | A | Bravery | 11 | one foe · 1 hit · 2.9 · Brave 2 on every ally · heals the most hurt 36% · cleanses |
| 4 | `cleric-tome-fire.4` | A | Heroism | 13 | one foe · 1 hit · 3.7 · Brave 2 on every ally · heals the most hurt 40% · cleanses |
| 5 | `cleric-tome-fire.5` | A | Exaltation | 16 | one foe · 1 hit · 4.6 · Brave 3 on every ally · heals every ally 44% · cleanses |
| 3 | `cleric-tome-fire.3b` | B · Heavy | Heavy Bravery | 13 | one foe · 1 hit · 2.9 · Brave 3 on every ally · heals the most hurt 36% · cleanses |
| 4 | `cleric-tome-fire.4b` | B · Heavy | Heavy Heroism | 16 | one foe · 1 hit · 3.7 · Brave 3 on every ally · heals the most hurt 40% · cleanses |
| 5 | `cleric-tome-fire.5b` | B · Heavy | Heavy Exaltation | 18 | one foe · 1 hit · 4.6 · Brave 4 on every ally · heals every ally 44% · cleanses |

#### Cleric · Blizzard Tome (`cleric-tome-ice`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `cleric-tome-ice.1` | Trunk | Ward | 6 | one foe · 1 hit · 1.6 · Aegis 1 on every ally · heals the most hurt 28% · cleanses |
| 2 | `cleric-tome-ice.2` | Trunk | Guard | 8 | one foe · 1 hit · 2.2 · Aegis 1 on every ally · heals the most hurt 32% · cleanses |
| 3 | `cleric-tome-ice.3` | A | Bulwark | 11 | one foe · 1 hit · 2.9 · Aegis 2 on every ally · heals the most hurt 36% · cleanses |
| 4 | `cleric-tome-ice.4` | A | Fortress | 13 | one foe · 1 hit · 3.7 · Aegis 2 on every ally · heals the most hurt 40% · cleanses |
| 5 | `cleric-tome-ice.5` | A | Sanctum | 16 | one foe · 1 hit · 4.6 · Aegis 3 on every ally · heals every ally 44% · cleanses |
| 3 | `cleric-tome-ice.3b` | B · Heavy | Heavy Bulwark | 13 | one foe · 1 hit · 2.9 · Aegis 3 on every ally · heals the most hurt 36% · cleanses |
| 4 | `cleric-tome-ice.4b` | B · Heavy | Heavy Fortress | 16 | one foe · 1 hit · 3.7 · Aegis 3 on every ally · heals the most hurt 40% · cleanses |
| 5 | `cleric-tome-ice.5b` | B · Heavy | Heavy Sanctum | 18 | one foe · 1 hit · 4.6 · Aegis 4 on every ally · heals every ally 44% · cleanses |

#### Cleric · Thunder Tome (`cleric-tome-lightning`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `cleric-tome-lightning.1` | Trunk | Spark | 6 | one foe · 1 hit · 1.6 · Breaker 1 on every ally · heals the most hurt 28% · cleanses |
| 2 | `cleric-tome-lightning.2` | Trunk | Charge | 8 | one foe · 1 hit · 2.2 · Breaker 1 on every ally · heals the most hurt 32% · cleanses |
| 3 | `cleric-tome-lightning.3` | A | Surge | 11 | one foe · 1 hit · 2.9 · Breaker 2 on every ally · heals the most hurt 36% · cleanses |
| 4 | `cleric-tome-lightning.4` | A | Overcharge | 13 | one foe · 1 hit · 3.7 · Breaker 2 on every ally · heals the most hurt 40% · cleanses |
| 5 | `cleric-tome-lightning.5` | A | Breakstorm | 16 | one foe · 1 hit · 4.6 · Breaker 3 on every ally · heals every ally 44% · cleanses |
| 3 | `cleric-tome-lightning.3b` | B · Heavy | Heavy Surge | 13 | one foe · 1 hit · 2.9 · Breaker 3 on every ally · heals the most hurt 36% · cleanses |
| 4 | `cleric-tome-lightning.4b` | B · Heavy | Heavy Overcharge | 16 | one foe · 1 hit · 3.7 · Breaker 3 on every ally · heals the most hurt 40% · cleanses |
| 5 | `cleric-tome-lightning.5b` | B · Heavy | Heavy Breakstorm | 18 | one foe · 1 hit · 4.6 · Breaker 4 on every ally · heals every ally 44% · cleanses |

#### Cleric · Light Tome (`cleric-tome-light`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `cleric-tome-light.1` | Trunk | Grace | 6 | one foe · 1 hit · 1.6 · Faith 1 on every ally · heals the most hurt 28% · Regen 2 rounds · cleanses |
| 2 | `cleric-tome-light.2` | Trunk | Faith | 8 | one foe · 1 hit · 2.2 · Faith 1 on every ally · heals the most hurt 32% · Regen 2 rounds · cleanses |
| 3 | `cleric-tome-light.3` | A | Devotion | 11 | one foe · 1 hit · 2.9 · Faith 2 on every ally · heals the most hurt 36% · Regen 2 rounds · cleanses |
| 4 | `cleric-tome-light.4` | A | Piety | 13 | one foe · 1 hit · 3.7 · Faith 2 on every ally · heals the most hurt 40% · Regen 2 rounds · cleanses |
| 5 | `cleric-tome-light.5` | A | Benediction | 16 | one foe · 1 hit · 4.6 · Faith 3 on every ally · heals every ally 44% · Regen 2 rounds · cleanses |
| 3 | `cleric-tome-light.3b` | B · Heavy | Rebirth | 13 | one foe · 1 hit · 2.9 · Faith 3 on every ally · heals the most hurt 36% · Regen 2 rounds · cleanses · revives the fallen |
| 4 | `cleric-tome-light.4b` | B · Heavy | Heavy Piety | 16 | one foe · 1 hit · 3.7 · Faith 3 on every ally · heals the most hurt 40% · Regen 2 rounds · cleanses |
| 5 | `cleric-tome-light.5b` | B · Heavy | Heavy Benediction | 18 | one foe · 1 hit · 4.6 · Faith 4 on every ally · heals every ally 44% · Regen 2 rounds · cleanses |

#### Cleric · Dark Tome (`cleric-tome-dark`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `cleric-tome-dark.1` | Trunk | Calm | 6 | one foe · 1 hit · 1.6 · Clarity 1 on every ally · heals the most hurt 28% · cleanses · heals 30% of its damage |
| 2 | `cleric-tome-dark.2` | Trunk | Focus | 8 | one foe · 1 hit · 2.2 · Clarity 1 on every ally · heals the most hurt 32% · cleanses · heals 30% of its damage |
| 3 | `cleric-tome-dark.3` | A | Clarity | 11 | one foe · 1 hit · 2.9 · Clarity 2 on every ally · heals the most hurt 36% · cleanses · heals 30% of its damage |
| 4 | `cleric-tome-dark.4` | A | Insight | 13 | one foe · 1 hit · 3.7 · Clarity 2 on every ally · heals the most hurt 40% · cleanses · heals 30% of its damage |
| 5 | `cleric-tome-dark.5` | A | Enlightenment | 16 | one foe · 1 hit · 4.6 · Clarity 3 on every ally · heals every ally 44% · cleanses · heals 30% of its damage |
| 3 | `cleric-tome-dark.3b` | B · Heavy | Heavy Clarity | 13 | one foe · 1 hit · 2.9 · Clarity 3 on every ally · heals the most hurt 36% · cleanses · heals 30% of its damage |
| 4 | `cleric-tome-dark.4b` | B · Heavy | Heavy Insight | 16 | one foe · 1 hit · 3.7 · Clarity 3 on every ally · heals the most hurt 40% · cleanses · heals 30% of its damage |
| 5 | `cleric-tome-dark.5b` | B · Heavy | Heavy Enlightenment | 18 | one foe · 1 hit · 4.6 · Clarity 4 on every ally · heals every ally 44% · cleanses · heals 30% of its damage |

### Summoner

10 trees; her three weapons choose three. Powers below are at Rank 3, before her hand (×0.5 on Arms, ×0.58 on Tomes) and her Skill Rank; MP is hers (×0.5).

#### Summoner · Greatsword (`summoner-greatsword`), B · Pack

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `summoner-greatsword.1` | Trunk | Squire | 5 | one foe · 1 hit · 1.6 · lingers at 0.3 |
| 2 | `summoner-greatsword.2` | Trunk | Shield Knight | 7 | one foe · 1 hit · 2.2 · lingers at 0.3 |
| 3 | `summoner-greatsword.3` | A | Knight Captain | 9 | one foe · 2 hits · 2.9 · lingers at 0.3 |
| 4 | `summoner-greatsword.4` | A | Aegis Champion | 11 | one foe · 2 hits · 3.7 · lingers at 0.3 |
| 5 | `summoner-greatsword.5` | A | Sword Saint | 13 | one foe · 3 hits · 4.599 · lingers at 0.3 |
| 3 | `summoner-greatsword.3a` | B · Pack | Knight Captain Pack | 9 | one foe · 3 hits · 2.754 · lingers at 0.3 |
| 4 | `summoner-greatsword.4a` | B · Pack | Aegis Champion Pack | 11 | one foe · 3 hits · 3.516 · lingers at 0.3 |
| 5 | `summoner-greatsword.5a` | B · Pack | Sword Saint Pack | 13 | one foe · 4 hits · 4.368 · lingers at 0.3 |

#### Summoner · Axe (`summoner-axe`), B · Pack

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `summoner-axe.1` | Trunk | Brigand | 7 | every foe · 1 hit · 0.88 · lingers at 0.3 |
| 2 | `summoner-axe.2` | Trunk | Marauder | 9 | every foe · 1 hit · 1.21 · lingers at 0.3 |
| 3 | `summoner-axe.3` | A | Axe Ogre | 11 | every foe · 2 hits · 1.596 · lingers at 0.3 |
| 4 | `summoner-axe.4` | A | Minotaur Chief | 13 | every foe · 2 hits · 2.036 · lingers at 0.3 |
| 5 | `summoner-axe.5` | A | Jotun King | 15 | every foe · 3 hits · 2.529 · lingers at 0.3 |
| 3 | `summoner-axe.3a` | B · Pack | Axe Ogre Pack | 11 | every foe · 3 hits · 1.515 · lingers at 0.3 |
| 4 | `summoner-axe.4a` | B · Pack | Minotaur Chief Pack | 13 | every foe · 3 hits · 1.932 · lingers at 0.3 |
| 5 | `summoner-axe.5a` | B · Pack | Jotun King Pack | 15 | every foe · 4 hits · 2.404 · lingers at 0.3 |

#### Summoner · Lance (`summoner-lance`), B · Pack

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `summoner-lance.1` | Trunk | Pikeman | 5 | random foes · 2 hits · 1.68 · lingers at 0.3 |
| 2 | `summoner-lance.2` | Trunk | Dragoon | 7 | random foes · 2 hits · 2.31 · lingers at 0.3 |
| 3 | `summoner-lance.3` | A | Lance Knight | 9 | random foes · 3 hits · 3.045 · lingers at 0.3 |
| 4 | `summoner-lance.4` | A | Valkyrie | 11 | random foes · 3 hits · 3.885 · lingers at 0.3 |
| 5 | `summoner-lance.5` | A | Valkyrie Queen | 13 | random foes · 4 hits · 4.832 · lingers at 0.3 |
| 3 | `summoner-lance.3a` | B · Pack | Lance Knight Pack | 9 | random foes · 4 hits · 2.892 · lingers at 0.3 |
| 4 | `summoner-lance.4a` | B · Pack | Valkyrie Pack | 11 | random foes · 4 hits · 3.692 · lingers at 0.3 |
| 5 | `summoner-lance.5a` | B · Pack | Valkyrie Queen Pack | 13 | random foes · 5 hits · 4.59 · lingers at 0.3 |

#### Summoner · Bow (`summoner-bow`), B · Pack

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `summoner-bow.1` | Trunk | Slinger | 5 | one foe · 2 hits · 1.6 · lingers at 0.3 |
| 2 | `summoner-bow.2` | Trunk | Archer | 7 | one foe · 2 hits · 2.2 · lingers at 0.3 |
| 3 | `summoner-bow.3` | A | Ranger | 9 | one foe · 3 hits · 2.901 · lingers at 0.3 |
| 4 | `summoner-bow.4` | A | Sylph Archer | 11 | one foe · 3 hits · 3.699 · lingers at 0.3 |
| 5 | `summoner-bow.5` | A | Sagittarius | 13 | one foe · 4 hits · 4.6 · lingers at 0.3 |
| 3 | `summoner-bow.3a` | B · Pack | Ranger Pack | 9 | one foe · 4 hits · 2.756 · lingers at 0.3 |
| 4 | `summoner-bow.4a` | B · Pack | Sylph Archer Pack | 11 | one foe · 4 hits · 3.516 · lingers at 0.3 |
| 5 | `summoner-bow.5a` | B · Pack | Sagittarius Pack | 13 | one foe · 5 hits · 4.37 · lingers at 0.3 |

#### Summoner · Katana (`summoner-katana`), B · Pack

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `summoner-katana.1` | Trunk | Ronin | 5 | one foe · 2 hits · 1.6 · lingers at 0.3 |
| 2 | `summoner-katana.2` | Trunk | Samurai | 7 | one foe · 2 hits · 2.2 · lingers at 0.3 |
| 3 | `summoner-katana.3` | A | Kensei | 9 | one foe · 2 hits · 2.9 · lingers at 0.3 |
| 4 | `summoner-katana.4` | A | Blade Shogun | 11 | one foe · 2 hits · 3.7 · lingers at 0.3 |
| 5 | `summoner-katana.5` | A | Sword Spirit | 13 | one foe · 2 hits · 4.6 · lingers at 0.3 |
| 3 | `summoner-katana.3a` | B · Pack | Kensei Pack | 9 | one foe · 3 hits · 2.754 · lingers at 0.3 |
| 4 | `summoner-katana.4a` | B · Pack | Blade Shogun Pack | 11 | one foe · 3 hits · 3.516 · lingers at 0.3 |
| 5 | `summoner-katana.5a` | B · Pack | Sword Spirit Pack | 13 | one foe · 3 hits · 4.371 · lingers at 0.3 |

#### Summoner · Fire Tome (`summoner-tome-fire`), B · Bonded

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `summoner-tome-fire.1` | Trunk | Ember Sprites | 5 | one foe · 1 hit · 1.6 · lingers at 0.3 |
| 2 | `summoner-tome-fire.2` | Trunk | Salamander | 7 | one foe · 1 hit · 2.2 · lingers at 0.3 |
| 3 | `summoner-tome-fire.3` | A | Fire Drake | 9 | one foe · 2 hits · 2.9 · lingers at 0.3 |
| 4 | `summoner-tome-fire.4` | A | Infernal Wyrm | 11 | one foe · 2 hits · 3.7 · lingers at 0.3 |
| 5 | `summoner-tome-fire.5` | A | Phoenix | 13 | one foe · 3 hits · 4.599 · lingers at 0.3 |
| 3 | `summoner-tome-fire.3b` | B · Bonded | Bonded Fire Drake | 10 | one foe · 2 hits · 2.9 · lingers at 0.4 |
| 4 | `summoner-tome-fire.4b` | B · Bonded | Bonded Infernal Wyrm | 12 | one foe · 2 hits · 3.7 · lingers at 0.4 |
| 5 | `summoner-tome-fire.5b` | B · Bonded | Bonded Phoenix | 14 | one foe · 3 hits · 4.599 · lingers at 0.4 |

#### Summoner · Blizzard Tome (`summoner-tome-ice`), B · Bonded

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `summoner-tome-ice.1` | Trunk | Frost Sprites | 7 | every foe · 1 hit · 0.88 · lingers at 0.3 |
| 2 | `summoner-tome-ice.2` | Trunk | Snow Sentinel | 9 | every foe · 2 hits · 1.21 · lingers at 0.3 |
| 3 | `summoner-tome-ice.3` | A | Ice Golem | 11 | every foe · 2 hits · 1.596 · lingers at 0.3 |
| 4 | `summoner-tome-ice.4` | A | Frost Titan | 13 | every foe · 3 hits · 2.034 · lingers at 0.3 |
| 5 | `summoner-tome-ice.5` | A | Winter Queen | 15 | every foe · 3 hits · 2.529 · lingers at 0.3 |
| 3 | `summoner-tome-ice.3b` | B · Bonded | Bonded Ice Golem | 12 | every foe · 2 hits · 1.596 · lingers at 0.4 |
| 4 | `summoner-tome-ice.4b` | B · Bonded | Bonded Frost Titan | 14 | every foe · 3 hits · 2.034 · lingers at 0.4 |
| 5 | `summoner-tome-ice.5b` | B · Bonded | Bonded Winter Queen | 16 | every foe · 3 hits · 2.529 · lingers at 0.4 |

#### Summoner · Thunder Tome (`summoner-tome-lightning`), B · Bonded

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `summoner-tome-lightning.1` | Trunk | Spark Sprites | 5 | random foes · 2 hits · 1.68 · lingers at 0.3 |
| 2 | `summoner-tome-lightning.2` | Trunk | Thunderbird | 7 | random foes · 2 hits · 2.31 · lingers at 0.3 |
| 3 | `summoner-tome-lightning.3` | A | Storm Roc | 9 | random foes · 3 hits · 3.045 · lingers at 0.3 |
| 4 | `summoner-tome-lightning.4` | A | Thunder Kirin | 11 | random foes · 3 hits · 3.885 · lingers at 0.3 |
| 5 | `summoner-tome-lightning.5` | A | Raijin | 13 | random foes · 4 hits · 4.832 · lingers at 0.3 |
| 3 | `summoner-tome-lightning.3b` | B · Bonded | Bonded Storm Roc | 10 | random foes · 3 hits · 3.045 · lingers at 0.4 |
| 4 | `summoner-tome-lightning.4b` | B · Bonded | Bonded Thunder Kirin | 12 | random foes · 3 hits · 3.885 · lingers at 0.4 |
| 5 | `summoner-tome-lightning.5b` | B · Bonded | Bonded Raijin | 14 | random foes · 4 hits · 4.832 · lingers at 0.4 |

#### Summoner · Light Tome (`summoner-tome-light`), B · Bonded

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `summoner-tome-light.1` | Trunk | Cherub | 5 | one foe · 2 hits · 1.6 · lingers at 0.3 |
| 2 | `summoner-tome-light.2` | Trunk | Mending Angel | 7 | one foe · 2 hits · 2.2 · lingers at 0.3 |
| 3 | `summoner-tome-light.3` | A | Seraph Choir | 9 | one foe · 3 hits · 2.901 · lingers at 0.3 |
| 4 | `summoner-tome-light.4` | A | Dominion Host | 11 | one foe · 3 hits · 3.699 · lingers at 0.3 |
| 5 | `summoner-tome-light.5` | A | Heaven's Legion | 13 | one foe · 4 hits · 4.6 · lingers at 0.3 |
| 3 | `summoner-tome-light.3b` | B · Bonded | Bonded Seraph Choir | 10 | one foe · 3 hits · 2.901 · lingers at 0.4 |
| 4 | `summoner-tome-light.4b` | B · Bonded | Bonded Dominion Host | 12 | one foe · 3 hits · 3.699 · lingers at 0.4 |
| 5 | `summoner-tome-light.5b` | B · Bonded | Bonded Heaven's Legion | 14 | one foe · 4 hits · 4.6 · lingers at 0.4 |

#### Summoner · Dark Tome (`summoner-tome-dark`), B · Bonded

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `summoner-tome-dark.1` | Trunk | Leech Imp | 5 | one foe · 2 hits · 1.6 · lingers at 0.3 |
| 2 | `summoner-tome-dark.2` | Trunk | Night Bat | 7 | one foe · 2 hits · 2.2 · lingers at 0.3 |
| 3 | `summoner-tome-dark.3` | A | Vampire Knight | 9 | one foe · 2 hits · 2.9 · lingers at 0.3 |
| 4 | `summoner-tome-dark.4` | A | Blood Countess | 11 | one foe · 2 hits · 3.7 · lingers at 0.3 |
| 5 | `summoner-tome-dark.5` | A | Abyssal Overlord | 13 | one foe · 2 hits · 4.6 · lingers at 0.3 |
| 3 | `summoner-tome-dark.3b` | B · Bonded | Bonded Vampire Knight | 10 | one foe · 2 hits · 2.9 · lingers at 0.4 |
| 4 | `summoner-tome-dark.4b` | B · Bonded | Bonded Blood Countess | 12 | one foe · 2 hits · 3.7 · lingers at 0.4 |
| 5 | `summoner-tome-dark.5b` | B · Bonded | Bonded Abyssal Overlord | 14 | one foe · 2 hits · 4.6 · lingers at 0.4 |

### Paladin

10 trees; her three weapons choose three. Powers below are at Rank 3, before her hand (×0.5) and her Skill Rank; MP is hers (×0.6).

#### Paladin · Greatsword (`paladin-greatsword`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `paladin-greatsword.1` | Trunk | Breach | 6 | one foe · 1 hit · 1.6 · Armor Break 1 on the foe · Barrier 28% on the most threatened · Aegis 1 on the Barriered |
| 2 | `paladin-greatsword.2` | Trunk | Sunder Armor | 8 | one foe · 1 hit · 2.2 · Armor Break 1 on the foe · Barrier 32% on the most threatened · Aegis 1 on the Barriered |
| 3 | `paladin-greatsword.3` | A | Rupture | 11 | one foe · 1 hit · 2.9 · Armor Break 2 on the foe · Barrier 36% on the most threatened · Aegis 1 on the Barriered |
| 4 | `paladin-greatsword.4` | A | Ravage | 13 | one foe · 1 hit · 3.7 · Armor Break 2 on the foe · Barrier 40% on the most threatened · Aegis 1 on the Barriered |
| 5 | `paladin-greatsword.5` | A | Ruin | 16 | one foe · 1 hit · 4.6 · Armor Break 3 on every foe · Barrier 44% on every ally · Aegis 1 on the Barriered |
| 3 | `paladin-greatsword.3b` | B · Heavy | Heavy Rupture | 13 | one foe · 1 hit · 2.9 · Armor Break 3 on the foe · Barrier 36% on the most threatened · Aegis 1 on the Barriered |
| 4 | `paladin-greatsword.4b` | B · Heavy | Heavy Ravage | 16 | one foe · 1 hit · 3.7 · Armor Break 3 on the foe · Barrier 40% on the most threatened · Aegis 1 on the Barriered |
| 5 | `paladin-greatsword.5b` | B · Heavy | Heavy Ruin | 18 | one foe · 1 hit · 4.6 · Armor Break 4 on every foe · Barrier 44% on every ally · Aegis 1 on the Barriered |

#### Paladin · Axe (`paladin-axe`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `paladin-axe.1` | Trunk | Hack | 6 | one foe · 1 hit · 1.6 · Enfeeble 1 on the foe · Barrier 28% on the most threatened |
| 2 | `paladin-axe.2` | Trunk | Hamstring | 8 | one foe · 1 hit · 2.2 · Enfeeble 1 on the foe · Barrier 32% on the most threatened |
| 3 | `paladin-axe.3` | A | Maim | 11 | one foe · 1 hit · 2.9 · Enfeeble 2 on the foe · Barrier 36% on the most threatened |
| 4 | `paladin-axe.4` | A | Cripple | 13 | one foe · 1 hit · 3.7 · Enfeeble 2 on every foe · Barrier 40% on the most threatened |
| 5 | `paladin-axe.5` | A | Unmake | 16 | one foe · 1 hit · 4.6 · Enfeeble 3 on every foe · Barrier 44% on every ally |
| 3 | `paladin-axe.3b` | B · Heavy | Heavy Maim | 13 | one foe · 1 hit · 2.9 · Enfeeble 3 on the foe · Barrier 36% on the most threatened |
| 4 | `paladin-axe.4b` | B · Heavy | Heavy Cripple | 16 | one foe · 1 hit · 3.7 · Enfeeble 3 on every foe · Barrier 40% on the most threatened |
| 5 | `paladin-axe.5b` | B · Heavy | Heavy Unmake | 18 | one foe · 1 hit · 4.6 · Enfeeble 4 on every foe · Barrier 44% on every ally |

#### Paladin · Lance (`paladin-lance`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `paladin-lance.1` | Trunk | Pierce Mind | 6 | one foe · 1 hit · 1.6 · Mind Break 1 on the foe · Barrier 28% on the most threatened |
| 2 | `paladin-lance.2` | Trunk | Puncture | 8 | one foe · 1 hit · 2.2 · Mind Break 1 on the foe · Barrier 32% on the most threatened |
| 3 | `paladin-lance.3` | A | Impale | 11 | one foe · 1 hit · 2.9 · Mind Break 2 on the foe · Barrier 36% on the most threatened |
| 4 | `paladin-lance.4` | A | Transfix | 13 | one foe · 1 hit · 3.7 · Mind Break 2 on the foe · Barrier 40% on the most threatened |
| 5 | `paladin-lance.5` | A | Mindspike | 16 | one foe · 1 hit · 4.6 · Mind Break 3 on every foe · Barrier 44% on every ally |
| 3 | `paladin-lance.3b` | B · Heavy | Heavy Impale | 13 | one foe · 1 hit · 2.9 · Mind Break 3 on the foe · Barrier 36% on the most threatened |
| 4 | `paladin-lance.4b` | B · Heavy | Heavy Transfix | 16 | one foe · 1 hit · 3.7 · Mind Break 3 on the foe · Barrier 40% on the most threatened |
| 5 | `paladin-lance.5b` | B · Heavy | Heavy Mindspike | 18 | one foe · 1 hit · 4.6 · Mind Break 4 on every foe · Barrier 44% on every ally |

#### Paladin · Bow (`paladin-bow`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `paladin-bow.1` | Trunk | Chip | 6 | one foe · 1 hit · 1.6 · Shatter 1 on the foe · Barrier 28% on the most threatened |
| 2 | `paladin-bow.2` | Trunk | Crack | 8 | one foe · 1 hit · 2.2 · Shatter 1 on the foe · Barrier 32% on the most threatened |
| 3 | `paladin-bow.3` | A | Fracture | 11 | one foe · 1 hit · 2.9 · Shatter 2 on the foe · Barrier 36% on the most threatened |
| 4 | `paladin-bow.4` | A | Splinter | 13 | one foe · 1 hit · 3.7 · Shatter 2 on the foe · Barrier 40% on the most threatened |
| 5 | `paladin-bow.5` | A | Shatterstorm | 16 | one foe · 1 hit · 4.6 · Shatter 3 on every foe · Barrier 44% on every ally |
| 3 | `paladin-bow.3b` | B · Heavy | Heavy Fracture | 13 | one foe · 1 hit · 2.9 · Shatter 3 on the foe · Barrier 36% on the most threatened |
| 4 | `paladin-bow.4b` | B · Heavy | Heavy Splinter | 16 | one foe · 1 hit · 3.7 · Shatter 3 on the foe · Barrier 40% on the most threatened |
| 5 | `paladin-bow.5b` | B · Heavy | Heavy Shatterstorm | 18 | one foe · 1 hit · 4.6 · Shatter 4 on every foe · Barrier 44% on every ally |

#### Paladin · Katana (`paladin-katana`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `paladin-katana.1` | Trunk | Mark | 6 | one foe · 1 hit · 1.6 · Hex 1 on the foe · Barrier 28% on the most threatened |
| 2 | `paladin-katana.2` | Trunk | Curse | 8 | one foe · 1 hit · 2.2 · Hex 1 on the foe · Barrier 32% on the most threatened |
| 3 | `paladin-katana.3` | A | Hex | 11 | one foe · 1 hit · 2.9 · Hex 2 on the foe · Barrier 36% on the most threatened |
| 4 | `paladin-katana.4` | A | Doom | 13 | one foe · 1 hit · 3.7 · Hex 2 on the foe · Barrier 40% on the most threatened |
| 5 | `paladin-katana.5` | A | Anathema | 16 | one foe · 1 hit · 4.6 · Hex 3 on every foe · Barrier 44% on every ally |
| 3 | `paladin-katana.3b` | B · Heavy | Heavy Hex | 13 | one foe · 1 hit · 2.9 · Hex 3 on the foe · Barrier 36% on the most threatened |
| 4 | `paladin-katana.4b` | B · Heavy | Heavy Doom | 16 | one foe · 1 hit · 3.7 · Hex 3 on the foe · Barrier 40% on the most threatened |
| 5 | `paladin-katana.5b` | B · Heavy | Heavy Anathema | 18 | one foe · 1 hit · 4.6 · Hex 4 on every foe · Barrier 44% on every ally |

#### Paladin · Fire Tome (`paladin-tome-fire`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `paladin-tome-fire.1` | Trunk | Valor | 6 | one foe · 1 hit · 1.6 · Brave 1 on every ally · heals the most hurt 28% · cleanses |
| 2 | `paladin-tome-fire.2` | Trunk | Courage | 8 | one foe · 1 hit · 2.2 · Brave 1 on every ally · heals the most hurt 32% · cleanses |
| 3 | `paladin-tome-fire.3` | A | Bravery | 11 | one foe · 1 hit · 2.9 · Brave 2 on every ally · heals the most hurt 36% · cleanses |
| 4 | `paladin-tome-fire.4` | A | Heroism | 13 | one foe · 1 hit · 3.7 · Brave 2 on every ally · heals the most hurt 40% · cleanses |
| 5 | `paladin-tome-fire.5` | A | Exaltation | 16 | one foe · 1 hit · 4.6 · Brave 3 on every ally · heals every ally 44% · cleanses |
| 3 | `paladin-tome-fire.3b` | B · Heavy | Heavy Bravery | 13 | one foe · 1 hit · 2.9 · Brave 3 on every ally · heals the most hurt 36% · cleanses |
| 4 | `paladin-tome-fire.4b` | B · Heavy | Heavy Heroism | 16 | one foe · 1 hit · 3.7 · Brave 3 on every ally · heals the most hurt 40% · cleanses |
| 5 | `paladin-tome-fire.5b` | B · Heavy | Heavy Exaltation | 18 | one foe · 1 hit · 4.6 · Brave 4 on every ally · heals every ally 44% · cleanses |

#### Paladin · Blizzard Tome (`paladin-tome-ice`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `paladin-tome-ice.1` | Trunk | Ward | 6 | one foe · 1 hit · 1.6 · Aegis 1 on every ally · heals the most hurt 28% · Barrier 14% on every ally · cleanses |
| 2 | `paladin-tome-ice.2` | Trunk | Guard | 8 | one foe · 1 hit · 2.2 · Aegis 1 on every ally · heals the most hurt 32% · Barrier 16% on every ally · cleanses |
| 3 | `paladin-tome-ice.3` | A | Bulwark | 11 | one foe · 1 hit · 2.9 · Aegis 2 on every ally · heals the most hurt 36% · Barrier 18% on every ally · cleanses |
| 4 | `paladin-tome-ice.4` | A | Fortress | 13 | one foe · 1 hit · 3.7 · Aegis 2 on every ally · heals the most hurt 40% · Barrier 20% on every ally · cleanses |
| 5 | `paladin-tome-ice.5` | A | Sanctum | 16 | one foe · 1 hit · 4.6 · Aegis 3 on every ally · heals every ally 44% · Barrier 22% on every ally · cleanses |
| 3 | `paladin-tome-ice.3b` | B · Heavy | Heavy Bulwark | 13 | one foe · 1 hit · 2.9 · Aegis 3 on every ally · heals the most hurt 36% · Barrier 18% on every ally · cleanses |
| 4 | `paladin-tome-ice.4b` | B · Heavy | Heavy Fortress | 16 | one foe · 1 hit · 3.7 · Aegis 3 on every ally · heals the most hurt 40% · Barrier 20% on every ally · cleanses |
| 5 | `paladin-tome-ice.5b` | B · Heavy | Heavy Sanctum | 18 | one foe · 1 hit · 4.6 · Aegis 4 on every ally · heals every ally 44% · Barrier 22% on every ally · cleanses |

#### Paladin · Thunder Tome (`paladin-tome-lightning`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `paladin-tome-lightning.1` | Trunk | Spark | 6 | one foe · 1 hit · 1.6 · Breaker 1 on every ally · heals the most hurt 28% · cleanses |
| 2 | `paladin-tome-lightning.2` | Trunk | Charge | 8 | one foe · 1 hit · 2.2 · Breaker 1 on every ally · heals the most hurt 32% · cleanses |
| 3 | `paladin-tome-lightning.3` | A | Surge | 11 | one foe · 1 hit · 2.9 · Breaker 2 on every ally · heals the most hurt 36% · cleanses |
| 4 | `paladin-tome-lightning.4` | A | Overcharge | 13 | one foe · 1 hit · 3.7 · Breaker 2 on every ally · heals the most hurt 40% · cleanses |
| 5 | `paladin-tome-lightning.5` | A | Breakstorm | 16 | one foe · 1 hit · 4.6 · Breaker 3 on every ally · heals every ally 44% · cleanses |
| 3 | `paladin-tome-lightning.3b` | B · Heavy | Heavy Surge | 13 | one foe · 1 hit · 2.9 · Breaker 3 on every ally · heals the most hurt 36% · cleanses |
| 4 | `paladin-tome-lightning.4b` | B · Heavy | Heavy Overcharge | 16 | one foe · 1 hit · 3.7 · Breaker 3 on every ally · heals the most hurt 40% · cleanses |
| 5 | `paladin-tome-lightning.5b` | B · Heavy | Heavy Breakstorm | 18 | one foe · 1 hit · 4.6 · Breaker 4 on every ally · heals every ally 44% · cleanses |

#### Paladin · Light Tome (`paladin-tome-light`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `paladin-tome-light.1` | Trunk | Grace | 6 | one foe · 1 hit · 1.6 · Faith 1 on every ally · heals the most hurt 28% · cleanses |
| 2 | `paladin-tome-light.2` | Trunk | Faith | 8 | one foe · 1 hit · 2.2 · Faith 1 on every ally · heals the most hurt 32% · cleanses |
| 3 | `paladin-tome-light.3` | A | Devotion | 11 | one foe · 1 hit · 2.9 · Faith 2 on every ally · heals the most hurt 36% · cleanses |
| 4 | `paladin-tome-light.4` | A | Piety | 13 | one foe · 1 hit · 3.7 · Faith 2 on every ally · heals the most hurt 40% · cleanses |
| 5 | `paladin-tome-light.5` | A | Benediction | 16 | one foe · 1 hit · 4.6 · Faith 3 on every ally · heals every ally 44% · cleanses |
| 3 | `paladin-tome-light.3b` | B · Heavy | Valkyrie's Oath | 13 | one foe · 1 hit · 2.9 · Faith 3 on every ally · heals the most hurt 36% · cleanses · revives the fallen |
| 4 | `paladin-tome-light.4b` | B · Heavy | Heavy Piety | 16 | one foe · 1 hit · 3.7 · Faith 3 on every ally · heals the most hurt 40% · cleanses |
| 5 | `paladin-tome-light.5b` | B · Heavy | Heavy Benediction | 18 | one foe · 1 hit · 4.6 · Faith 4 on every ally · heals every ally 44% · cleanses |

#### Paladin · Dark Tome (`paladin-tome-dark`), B · Heavy

| Depth | Node | Line | Name | MP | What it does |
|---|---|---|---|---|---|
| 1 | `paladin-tome-dark.1` | Trunk | Calm | 6 | one foe · 1 hit · 1.6 · Clarity 1 on every ally · heals the most hurt 28% · cleanses |
| 2 | `paladin-tome-dark.2` | Trunk | Focus | 8 | one foe · 1 hit · 2.2 · Clarity 1 on every ally · heals the most hurt 32% · cleanses |
| 3 | `paladin-tome-dark.3` | A | Clarity | 11 | one foe · 1 hit · 2.9 · Clarity 2 on every ally · heals the most hurt 36% · cleanses |
| 4 | `paladin-tome-dark.4` | A | Insight | 13 | one foe · 1 hit · 3.7 · Clarity 2 on every ally · heals the most hurt 40% · cleanses |
| 5 | `paladin-tome-dark.5` | A | Enlightenment | 16 | one foe · 1 hit · 4.6 · Clarity 3 on every ally · heals every ally 44% · cleanses |
| 3 | `paladin-tome-dark.3b` | B · Heavy | Heavy Clarity | 13 | one foe · 1 hit · 2.9 · Clarity 3 on every ally · heals the most hurt 36% · cleanses |
| 4 | `paladin-tome-dark.4b` | B · Heavy | Heavy Insight | 16 | one foe · 1 hit · 3.7 · Clarity 3 on every ally · heals the most hurt 40% · cleanses |
| 5 | `paladin-tome-dark.5b` | B · Heavy | Heavy Enlightenment | 18 | one foe · 1 hit · 4.6 · Clarity 4 on every ally · heals every ally 44% · cleanses |
<!-- /live -->
