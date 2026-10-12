# Class rework: the Class Sheet

> **Status: D86 built 2026-10-11; refreshed through D96 on 2026-10-12.** Current save v17, engine v7 (D91, D94, D96, D98).
> This is the approved Class Sheet's intent; exact live skills and numbers are generated in the
> [class manual](../game/classes.md) and [skill trees](../game/skill-trees.md) (D92).
> Approved by the owner with three notes folded in: hybrids may equip any of the ten
> Orbs; Light and Dark take the mirrored shapes (§2, §11.2); and every material family is produced and consumed
> equally (§10). It replaces the five classes and six builds of [classes.md](classes.md) and [battles.md](battles.md).
> Everything marked **(my call)** is a decision the owner didn't specify.

## 1. The shape in one table

| | **Brawler** | **Mage** | **Summoner** | **Spell Blade** | **Cleric** |
|---|---|---|---|---|---|
| Flavor (never a restriction) | Front, Front+Pace | Pace, Pace+Late | End, Late+End | Pace, Pace+Late | Late |
| Role | Pure physical DPS | Pure magic DPS | Hybrid DPS, magic-leaning | Hybrid DPS, physical-leaning | Support: buffs and debuffs |
| Weapon slots (5) | 5 Arms, all fixed | 5 Tomes, all fixed | 3 Tomes + 2 Arms, chosen | 3 Arms + 2 Tomes, chosen | Any 5, chosen |
| Typical accessory (not a restriction) | An Elemental Orb or a stat accessory | An Arms Orb or a stat accessory | Any Orb or a stat accessory | Any Orb or a stat accessory | Any Orb or a stat accessory |
| Armor slot (1) | Any armor | Any armor | Any armor | Any armor | Any armor |
| Actions a turn | 1 | 1 | 1, plus the lingering summon | 1, made of an Arms skill and a Tome skill | 1 |
| Damage per turn (Brawler = 1.0) | 1.0 | 1.0 | 0.6 + 0.3 linger = 0.9 | 0.45 + 0.45 = 0.9 | 0.5, plus a status |
| Skill trees | 5 (one per Arm) | 5 (one per Tome) | 10 (only the 5 equipped are active) | 10 (only the 5 equipped are active) | 10 (only the 5 equipped are active) |
| Kinds on hand at once | 5 Arms + 1 element (Orb) = 6 | 5 elements + 1 Arm (Orb) = 6 | 5 chosen + 1 (Orb) = 6 | 5 chosen + 1 (Orb) = 6 | 5 chosen + 1 (Orb) = 6 |

Every class has **5 weapon slots, 1 armor, 1 accessory**, acts **once a turn** and can reach **6 of the 10 weakness kinds**
with an Orb. What differs is which kinds and how hard each turn hits.

## 2. The ten kinds

| Arms (physical, ATK) | Shape (Brawler) | ↔ | Element (magic, M.ATK) | Shape (Mage) |
|---|---|---|---|---|
| **Greatsword** | Single target, heavy | ↔ | **Fire** | Single target |
| **Axe** | Every foe | ↔ | **Ice** (Blizzard) | Every foe |
| **Lance** (was Spear) | Random multi-hit | ↔ | **Lightning** (Thunder) | Random multi-hit |
| **Bow** | Single target, many hits | ↔ | **Light** | Single target, many hits |
| **Katana** (new, replaces Short Sword) | Single target, double slashes | ↔ | **Dark** | Single target, two heavy casts |

These are the Brawler/Mage baseline patterns. Summoner patterns are in §6; Spell Blade halves and Cleric strikes
are single-target (§7–§8). Side skills can change the shape. Read exact targets and hit counts from the
[class-specific tree rows](../game/skill-trees.md), not as one universal targeting rule.

- **Foes keep five Arms and five element weaknesses**; Short Sword weaknesses become Katana and Spear becomes Lance.
  The elemental triangle (Fire > Ice > Lightning > Fire, Light ↔ Dark) is unchanged.
- **Ultima retires (my call).** No class, tome or summon deals it; Limit Breaks use the equipped kinds instead
  (§9). That makes it a clean 5 + 5.
- **One-handed and two-handed no longer exist.** A weapon is a weapon; the hand factor moves to the class (§1).
- **Each hit is one kind** (Brawler hits are pure Arms now, Mage hits pure element) **plus the Orb's kind, if any**.
  An Orb adds its kind to every hit for weakness and shield breaking, **with no extra damage**: a Fire Orb Brawler's
  Greatsword hits break a Greatsword-weak or Fire-weak shield. A hit removes one shield point however many of its
  kinds match.

## 3. Shared rules

**Attacking.** The free action (Attack) uses any equipped weapon, picked in the menu: power 1.0 × the class's hand,
that weapon's kind, no MP. A Mage's Attack is a Tome bolt of its element, so even a dry Mage chips shields.

**Skills.** Skill power by depth stays `1.6 / 2.2 / 2.9 / 3.7 / 4.6` (single target, one full turn), and MP
`10 / 14 / 18 / 22 / 26`. Every-foe skills deal 55% to each foe and random multi-hits get +5%, as today. Each class
scales power and MP by its hand:

| Class | Skill power | MP | Note |
|---|---|---|---|
| Brawler, Mage | ×1.0 | ×1.0 | |
| Summoner | ×0.6 now, then ×0.3 when it lingers | ×0.7 | The linger needs no MP |
| Spell Blade | ×0.45 for each half | ×0.5 for each half | One act pays both halves |
| Cleric | ×0.5, plus its status | ×0.6 | |

**Depths and ranks (D77, unchanged).** Class rank r opens depths 1–r in every tree of that class, each depth also
waiting for Uma Lv 1/10/20/30/40.

**Core skills come free; side skills cost points (my call).** The owner asked that a Brawler can max all five
trees. So once a depth opens, **every core skill at that depth is learned in every tree of the class**, with no
points. **Skill points buy side skills only**: one point a level (50 at Lv50), a side skill costs its depth, one side
per fork (A or B), swapped freely with a refund. Filling every fork of 5 trees costs 75 points, so a Lv50 Uma fills
about two thirds of them. That's the "side nodes are still limited".

**Skill slots (unchanged).** 3 at Lv1, one more at Lv 10/15/20/25/30/35/40: up to 10 equipped skills, from any of the
equipped weapons' trees.

**Weapon Levels (D70, unchanged).** One Weapon Level per class (1–10), trained in its hall; level k lets the class wear
grade-k weapons in all five slots. Armor and Accessory Levels unchanged.

## 4. Brawler: the pure physical DPS

- **Slots**: Greatsword, Axe, Lance, Bow, Katana, all five always, plus an **Elemental Orb** (Fire, Ice, Lightning,
  Light or Dark) or a stat accessory.
- **Acts once a turn**, at full power. **Five active trees**, all usable together; skills from any of them fill the
  slots.
- **Coverage**: all 5 Arms + 1 element.

| Tree | Core shape (hits by depth) | Side A | Side B | Depth 5 core adds |
|---|---|---|---|---|
| **Greatsword** | One foe, 1/1/2/2/3 hits | **Crush**: 1 hit ×1.15, +2 MP | **Combo**: +1 hit, ×0.92 | Armor Break 2 |
| **Axe** | Every foe (55%), 1/1/2/2/3 hits, +4 MP | **Wide**: +1 hit at 50% each, +6 MP | **Reap**: 45% to all + 50% more on the tapped foe, +6 MP | Armor Break 1 on every foe |
| **Lance** | Random foes, 2/2/4/4/6 hits, +5% | **Impale**: one foe, half the hits, ×1.15, +2 MP | **Scatter**: +2 random hits worth 30%, +4 MP | Armor Break 1 on each foe hit |
| **Bow** | One foe, 2/2/4/4/6 hits | **Power Shot**: half the hits, ×1.15, +2 MP | **Spread**: same, plus a 20% hit on every other foe, +4 MP | Armor Break 2 |
| **Katana** | One foe, always 2 slashes | **Draw**: 1 slash ×1.15 that deals full damage before the foe is Broken (pierce), +2 MP | **Cross**: 2 slashes on the tapped foe + 2 at 60% on another, +4 MP | +30% to a Broken foe |

Names (core / A / B, depth 1 → 5):

- **Greatsword**: Heavy Slash, Cleave, Sunder, Rend, Meteor Strike / Crush, Bone Crush, Rampart Breaker, Cataclysm,
  Worldbreaker / Twin Slash, Double Cleave, Triple Sunder, Rending Combo, Meteor Combo
- **Axe**: Sweep, Whirl, Cyclone, Quake, Maelstrom / Wide Sweep, Twin Whirl, Grand Cyclone, Aftershock, Tempest /
  Hewing Sweep, Reaping Whirl, Headsman's Cyclone, Guillotine Quake, Executioner's Storm
- **Lance**: Thrust Flurry, Lance Barrage, Spiral Barrage, Dragon Dive, Heaven's Rain / Piercing Thrust, Impaler,
  Skewer, Dragon Fang, Gungnir / Scatter Thrust, Wild Barrage, Storm of Spears, Dragon Swarm, Thousand Spears
- **Bow**: Twin Arrows, Triple Shot, Quiver Volley, Arrow Storm, Starfall Barrage / Power Shot, Piercing Arrow,
  Ballista Shot, Comet Arrow, Sunpiercer / Spread Shot, Scatter Volley, Rain of Arrows, Arrow Hail, Starfall Rain
- **Katana**: Double Slash, Crossing Cut, Twin Moon, Iai Storm, Moonfall / Quick Draw, Iaido, Flash Draw, Moonlit Draw,
  Final Draw / Cross Cut, X-Slash, Twin Cross, Scattering Petals, Thousand Petals

## 5. Mage: the pure magic DPS

- **Slots**: Fire, Blizzard, Thunder, Light and Dark **Tomes**, all five always, plus an **Arms Orb** (Greatsword, Axe,
  Lance, Bow or Katana: a spectral weapon joins every cast) or a stat accessory.
- **Orbs**: Elemental Orbs usually expand a Brawler's coverage, Arms Orbs a Mage's. **Every class may wear any of the
  ten** (D86); choosing an already covered kind adds no new weakness coverage.
- **Acts once a turn** (it was twice at 0.6), at full power. **Five active trees.**
- **Coverage**: all 5 elements + 1 Arm.
- The trees are today's Mage-staff and Arcane-staff branches, one tree per Tome, minus Ultima:

| Tree | Core shape | Side A | Side B | Depth 5 core |
|---|---|---|---|---|
| **Fire Tome** | One foe, 1 hit | **Wave**: every foe | **Chain**: random 2/2/3/3/4 hits | Flare Star: Burn 2 |
| **Blizzard Tome** | Every foe, 1 hit | **Spike**: one foe | **Shards**: random multi-hit | Absolute Zero: 2 hits on every foe + Enfeeble 1 |
| **Thunder Tome** | Random 2/2/3/3/4 hits | **Bolt**: one foe | **Squall**: every foe | Judgment Storm: Shock 1 per hit |
| **Light Tome** | One foe, 2/2/4/4/6 hits | **Lux Lance**: half the hits, ×1.15 | **Lux Cascade**: 2 hits on every foe at 50% | Holy: +30% against a Broken foe |
| **Dark Tome** | One foe, 2 heavy casts | **Nox Pierce**: 1 cast ×1.15, full damage before the Break | **Nox Cascade**: 2 hits on every foe at 50% | Black Hole: +30% against a foe under half HP |

Names are today's: Fire, Fira, Firaga, Firaja, Flare Star (Wave and Chain variants); Blizzard … Absolute Zero (Spike,
Shards); Thunder … Judgment Storm (Bolt, Squall); Lux … Holy (Lance, Cascade); Nox … Black Hole (Lance, Cascade).

## 6. Summoner: summons that linger

- **Slots**: **3 Tomes + 2 Arms**, any of the ten (it uses the same weapons as everyone), plus any Orb or a stat
  accessory.
- **Acts once a turn** (it was twice at 0.5, plus a free Familiar; the Familiar retires).
- **Ten trees**, one per weapon, each the same simple shape: **one summon that grows every depth**. Only the five
  equipped are usable; side skills can be learned in all ten.
- **Coverage**: the 5 kinds equipped, + the Orb.

**The linger (new).** A summon skill calls its summon, which hits at once (×0.6) and **stays on the field**, shown
beside the Summoner. The next time she casts a summon, the lingering one **acts first**: it repeats its own pattern
(same hits, same targets rule, its rider) **at ×0.3**, then leaves, and the new one arrives and stays. Attacking or
guarding leaves the summon waiting. A knocked-out Summoner's summon leaves. Chaining summons is 0.9 a turn, slightly
under a pure DPS class as asked, and every turn shows two kinds.

| Tree | Summons, depth 1 → 5 | Shape | Depth 5 core adds |
|---|---|---|---|
| **Fire Tome** | Ember Sprites, Salamander, Fire Drake, Infernal Wyrm, Phoenix | One foe, 1/1/2/2/3 hits | Burn 2 |
| **Blizzard Tome** | Frost Sprites, Snow Wolves, Ice Golem, Frost Titan, Winter Queen | Every foe, 1/2/2/3/3 hits | Enfeeble 1 on every foe |
| **Thunder Tome** | Spark Sprites, Thunderbird, Storm Roc, Thunder Kirin, Raijin | Random foes, 2/2/3/3/4 hits | Shock 1 on each foe hit |
| **Light Tome** | Cherub, Angel Lancer, Seraph Phalanx, Dominion Host, Heaven's Legion | One foe, 2/2/3/3/4 hits | Barrier 1 on every ally |
| **Dark Tome** | Imp Brute, Hellknight, Dread Knight, Demon Lord, Abyssal Overlord | One foe, 2 hits | Enfeeble 2 |
| **Greatsword** | Squire, Sword Knight, Paladin, Blade Champion, Sword Saint | One foe, 1/1/2/2/3 hits | Armor Break 2 |
| **Axe** | Brigand, Berserker, Axe Ogre, Minotaur Chief, Jotun Warlord | Every foe, 1/1/2/2/3 hits | Armor Break 1 on every foe |
| **Lance** | Pikeman, Dragoon, Lance Knight, Valkyrie, Valkyrie Queen | Random foes, 2/2/3/3/4 hits | Armor Break 1 on each foe hit |
| **Bow** | Slinger, Archer, Ranger, Sylph Archer, Sagittarius | One foe, 2/2/3/3/4 hits | Armor Break 2 |
| **Katana** | Ronin, Samurai, Kensei, Blade Shogun, Sword Spirit | One foe, 2 hits | +30% to a Broken foe |

The Fire, Ice, Lightning, Light and Dark summons are today's; the Arms summons are new. Every summon takes its kind's
shape (§2).

Side skills, the same rule in every tree (my call):

- **A: Pack**: the summon comes as a pack, +1 hit, ×0.95 ("Salamander Pack").
- **B: Bonded**: its linger hits at ×0.4 instead of ×0.3, +2 MP ("Bonded Salamander").

## 7. Spell Blade: one blade, one spell, every act

- **Slots**: **3 Arms + 2 Tomes**, any, plus any Orb or a stat accessory.
- **Acts once a turn, and every act is a pair**: one Arms skill (or an Arms attack) **and** one Tome skill (or a
  Tome attack), each at ×0.45. The blade lands first. One act pays both MP costs.
- **Ten trees**, all **single target**, simple, mirrored Arm ↔ Element; only the five equipped are usable.
- **Coverage**: the 5 kinds equipped, two of them every turn, + the Orb.

| Arms tree | ↔ | Tome tree | Hits by depth | Depth 5 core adds |
|---|---|---|---|---|
| Greatsword: Rune / Arcane / Mystic / Astral / Celestial **Cleave** | ↔ | Fire: … **Brand** | 1/1/1/2/2 | Armor Break 1 ↔ Burn 1 |
| Axe: … **Hew** | ↔ | Ice: … **Rime** | 1/1/2/2/2 | Armor Break 1 ↔ Enfeeble 1 |
| Lance: … **Thrust** | ↔ | Lightning: … **Bolt** | 2/2/2/3/3 | Armor Break 1 ↔ Shock 1 |
| Bow: … **Shot** | ↔ | Light: … **Ray** | 2/2/3/3/4 | Armor Break 1 ↔ +30% against a Broken foe |
| Katana: … **Draw** | ↔ | Dark: … **Shade** | 2 each | +30% to a Broken foe ↔ +30% against a foe under half HP |

Names run Rune, Arcane, Mystic, Astral, Celestial by depth: "Rune Cleave" at depth 1, "Celestial Shade" at depth 5.
Side skills in every tree: **A: Focus**, one hit fewer, ×1.1; **B: Flurry**, one hit more, ×0.95.

## 8. Cleric: blows that weaken, spells that bless

- **Slots**: **any 5 weapons**, Arms and Tomes mixed as she likes, plus any Orb or a stat accessory.
- **Acts once a turn.** Every skill hits one foe at ×0.5 for its weapon's kind and **carries a status**: **an Arms
  skill debuffs the foe it hits, a Tome skill buffs every ally**. No healing for now, as you asked.
- **Ten trees**, paired so each blow has a mirror blessing:

| Arms tree: debuff on the foe | ↔ | Tome tree: buff on every ally |
|---|---|---|
| Greatsword: **Armor Break** (+10% weapon damage taken per stack) | ↔ | Fire: **Brave** (+10% weapon damage dealt) |
| Lance: **Mind Break** (+10% magic damage taken) | ↔ | Light: **Faith** (+10% magic damage dealt) |
| Axe: **Enfeeble** (−10% damage dealt) | ↔ | Ice: **Aegis** (−10% damage taken) |
| Bow: **Shatter** (removes 1 shield point per stack) | ↔ | Lightning: **Breaker** (the next weak hit removes 1 more shield point) |
| Katana: **Hex** (weak to Light and Dark for 2 rounds) | ↔ | Dark: **Clarity** (restores 4% max MP per stack) |

- **Stacks by depth**: 1 / 1 / 2 / 2 / 3, for 2 rounds. Depth 5's debuffs land on every foe (the hit stays on one).
- **Core names** (depth 1 → 5): Greatsword Breach, Sunder, Rupture, Ravage, Ruin; Lance Pierce, Puncture, Impale,
  Transfix, Mindspike; Axe Hack, Hew, Cleave, Maim, Unmake; Bow Chip, Crack, Fracture, Splinter, Shatterstorm; Katana
  Mark, Curse, Hex, Doom, Anathema; Fire Valor, Courage, Bravery, Heroism, Exaltation; Light Grace, Faith, Devotion,
  Piety, Benediction; Ice Ward, Guard, Bulwark, Fortress, Sanctum; Lightning Spark, Charge, Surge, Overcharge, Breakstorm;
  Dark Calm, Focus, Clarity, Insight, Enlightenment.
- **Side skills** in every tree: **A: Lasting**, the status lasts 1 round longer; **B: Heavy**, +1 stack, +4 MP.
- Her old passive blessing/healing tree retires. Barrier still exists as a summon rider (§6); it is not a Cleric
  healing-tree unlock. Regen, Cure and Rebirth are not current Cleric skills (D86).

## 9. Limit Breaks (kept close to today's)

| Class | Limit Break | What it does (0 MP, a full gauge of 12) |
|---|---|---|
| Brawler | Twin Strike | One equipped skill twice at full power, or two Attacks with a chosen weapon |
| Mage | Prismatic Nova | Five hits, one per element (Ultima's hit retires), 2.4× a single-target cast |
| Summoner | Grand Summon | One summon at 2× that lingers at 2× too |
| Spell Blade | Twin Arts | One Arms skill and one Tome skill, both at full power |
| Cleric | Divine Patrons | Every equipped weapon's status at once (3 stacks), and a 1.5× hit |

## 10. Equipment, crafting and the Hub

**Weapon types: ten, all craftable at the Forge**, each `type × grade 1–10 × accent`, as today.

**Materials, symmetric by construction (owner, D86).** Every recipe is **four refined items of its grade, one from each
of four gathering families** (the accent no longer takes a material of its own, and the extras retire).
**The Forge takes no token (D94)**, superseding D86's Crafting Token. The eight gathering families split into two
halves, by flavor:

| Half | Families | Flavor |
|---|---|---|
| **Arms** | Ores, Stones, Woods, Hides & Scales | blade, whetstone, haft, grip |
| **Arcana** | Crystals, Fibers, Essences, Bones & Horns | focus, pages, ink, binding |

| Pieces | Recipe |
|---|---|
| Greatsword, Axe, Lance, Bow, Katana, Arms Orbs | The four Arms families |
| Fire, Blizzard, Thunder, Light, Dark Tomes, Elemental Orbs | The four Arcana families |
| Plate | Ores, Stones, Essences, Bones & Horns |
| Mail | Ores, Hides & Scales, Crystals, Essences |
| Leather | Hides & Scales, Woods, Fibers, Bones & Horns |
| Garb | Woods, Stones, Fibers, Crystals |
| Ring | Crystals, Essences, Ores, Stones |
| Charm | Bones & Horns, Fibers, Hides & Scales, Woods |

Every piece takes four different families, every armor and accessory two from each half, and each family sits in
exactly two armors and one stat accessory. A roster that mixes Brawlers and Mages, as any will, consumes all eight
families equally. Cooking already does the same for the eight farming families: each planet dish takes its own
family's refined item, sides rotate evenly around the ring, each family sits in two Duo dishes and every Feast takes all
eight. A test (`materials.test.ts`) keeps both true. Every site produces at the same rate (only grade sets the time).

- **Stats**: weapons give ATK (Arms) or M.ATK (Tomes); armor and accessories as today.
- **Retired**: Short Sword, Mage Staff, Arcane Staff, Cleric Staff, Summoner Tome.
- **A weapon's stat is its grade split over the five slots** (as today's split over a build's weapons): a Summoner's 3
  Tomes and 2 Arms give 60% M.ATK, 40% ATK. That is the right lean, because summons of Arms hit with ATK and summons
  of elements with M.ATK.
- **Accessories**: Ring and Charm stay the stat accessories (accent at double weight). **Orbs are new, ten of them**:
  five Elemental Orbs and five Arms Orbs, graded 1–10 like other accessories, with their accent at normal weight (half
  a Ring's). You choose: an Orb's extra kind, or a Ring or Charm's extra damage.
- **Icons (lean)**: the shared art atlas has rows for today's types. Until an art round in uma-platform adds new ones,
  Lance reuses Spear's icons, Katana reuses Short Sword's, the five Tomes reuse the Summoner Tome tinted by element, and
  Orbs reuse the Ring tinted by kind with the kind's glyph on top.
- **Token budget (D82, D93, D94)**: two class tracks, two mastery tracks and two planets per Uma. A mastery track is
  Weapon, Armor or Accessory Level 1→10 and costs nine Mastery Tokens, not ten crafted pieces. Crafting costs only
  materials; `save/tokens.test.ts` checks the expected fight budget with waves included.

**Screens.**

- **Profile, Skills tab**: class buttons, then an **equipment strip** of the class's five weapon slots, its accessory
  and its armor. For Summoner, Spell Blade and Cleric the slots are pickers (Summoner: three Tome slots, two Arms
  slots). Below: five tabs, one per equipped weapon's tree; the unequipped trees of a hybrid sit greyed further down.
- **Profile, Gear tab**: the same seven slots, filled with crafted pieces.
- **Fight**: **Attack** shows the five weapons as icons (one tap picks which to hit with); **Skills** opens a row of the
  five weapons, each filtering its skills. Spell Blade picks a blade skill, then a spell; Summoner's lingering summon
  shows beside her.
- **Forge**: all 26 gear types. **Jeweler**: Accessory Level training, covering Rings, Charms and Orbs (D70, D94).

**Save v14 (migration).**

- Every Uma's six builds become per-class loadouts. Brawler and Mage loadouts fill themselves. Summoner, Spell Blade
  and Cleric start on a default five: Summoner Fire, Blizzard and Thunder Tomes with Greatsword and Lance; Spell Blade
  Greatsword, Lance and Katana with Fire and Thunder; Cleric Greatsword, Axe and Bow with Fire and Light.
- **Learned skills reset**, with every point returned. Cores now come free; after D69's reset and D77 nobody has many.
- **Gear**: Spear pieces become Lance pieces and Short Swords become Katanas (same grade, accent and binding). Staves
  and Summoner Tomes are taken back and their crafting inputs (materials and the Crafting Token) returned to the
  Warehouse.
- An open fight closes with no loss, as in D66.

**Balance.** The sim gets the new classes and a five-class party (Brawler, Mage, Summoner, Spell Blade, Cleric) and
re-checks D75's targets before anything ships.

## 11. Recommendations on symmetry

1. **Retire Ultima** (done above). Ten kinds, five and five, and every Limit Break hits with what's equipped.
2. **Mirror Light and Dark onto the Bow and Katana** (approved, built into §2, §5 and §6): every class's skills of a
   kind share a shape, and the old every-foe Light and Dark casts live on as their Cascade side skills.
3. **Orbs for everyone** (done above): one accessory slot, Orb or stat. Every class can reach six kinds, and the
   hybrids decide which one.
4. **Pair the statuses Arm ↔ Element** (done above for the Cleric, and the depth-5 riders follow it): physical trees
   apply Armor Break, magic trees their element's rider. Later, Mage capstones could apply Mind Break as the Brawler's
   apply Armor Break.
5. **One budget per class, written down**: 1.0 / 1.0 / 0.9 / 0.9 / 0.5 + status. The sim checks each against it, so a
   change to one class can't quietly shift the others.

## 12. Completed build order (D86)

| Step | What |
|---|---|
| R1 | Kinds and catalog: ten weapons, Ultima out, the 40 trees by rule, free cores, side-skill points |
| R2 | Battle engine: one action for all, Spell Blade pairs, the Summoner linger, Orbs, Cleric statuses, Limit Breaks; sim |
| R3 | Gear: ten weapon types, Orbs, recipes, stat split; save v14 migration |
| R4 | Screens: Skills tab slots, Gear tab, fight menu, Forge and Jeweler |
| R5 | Docs, decisions D86+, balance pass with the sim |
