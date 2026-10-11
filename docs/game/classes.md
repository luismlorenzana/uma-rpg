# Classes and weapons

Five classes and ten weapons (D86). Every Uma has one **active class** at a time and can switch freely. She keeps each
class's own weapons, learned skills and loadout. Classes and weapons are chosen on the Stable → an Uma → **Skills**
page ([sections](sections.md#stable)).

Code: `packages/domain/src/rpg/kinds.ts` (weapons and kinds), `rules.ts` (slots, hands, stat leans, learning rules),
`catalog.ts` (trees, see [skill trees](skill-trees.md)), `battle/limit.ts` (Limit Breaks), `economy/training.ts`
(ranks).

## The five classes

| Class | Plays like |
|---|---|
| **Brawler** | Pure physical damage. All five Arms, one heavy act a turn. An Elemental Orb adds an element to every hit |
| **Mage** | Pure magic. All five Tomes, one full cast a turn. An Arms Orb adds a weapon kind to every cast |
| **Spell Blade** | Three Arms and two Tomes. Every act is a blade and a spell, each at about half strength |
| **Cleric** | Any five weapons. Her blows weaken the foe they hit; her spells bless the whole party. No healing yet |
| **Summoner** | Three Tomes and two Arms. Each summon strikes, stays, and strikes again when the next one comes |

<!-- live:classes -->
| Class | Slots | Trees | Hand: power, MP | Special | Stat lean (HP, ATK, MATK, DEF, MDEF, MP) | Limit Break | Starts as |
|---|---|---|---|---|---|---|---|
| Brawler | 5 Arms | 5 | ×1, ×1 | — | ×1.15 ×1.1 ×0.9 ×1.1 ×0.9 ×0.8 | Twin Strike: one equipped skill cast twice at full power, or two Attacks with a weapon | Front runners |
| Mage | 5 Tomes | 5 | ×1, ×1 | — | ×0.9 ×0.9 ×1.15 ×0.9 ×1.1 ×1.3 | Prismatic Nova: a hit of each of the five elements, 2.4× her open depth's power in all | Pace chasers |
| Spell Blade | 3 Arms + 2 Tomes | 10 | ×0.45, ×0.5 | Every act is an Arms half and a Tome half | ×1 ×1.05 ×1.05 ×1 ×1 ×1 | Twin Arts: an Arms skill and a Tome skill, both at full power (no half) | — |
| Cleric | Any 5 | 10 | ×0.5, ×0.6 | Each skill carries a status | ×1 ×0.8 ×1 ×1 ×1.15 ×1.3 | Divine Patrons: a hit with each of her five weapons (1.5× in all), each status at 3 stacks | Late surgers |
| Summoner | 3 Tomes + 2 Arms | 10 | ×0.6, ×0.7 | A summon lingers and acts again at 0.3 | ×1 ×1 ×1 ×1 ×1 ×1.1 | Grand Summon: one summon at twice her strength that lingers at twice its share | End closers |
<!-- /live -->

**Hand:** the share of full power and full MP her acts use. A Brawler's Attack is 1.0. A Spell Blade's two halves are
0.45 each, so she lands 0.9 a turn across two kinds.

**Starts as:** a new Uma begins in the class of her best running style. Spell Blade is never a default.

## Weapons

Ten weapons: five **Arms** (physical kinds) and five **Tomes** (elements). Each kind keeps one shape in every class, so
an Axe skill always reaches every foe, whoever swings it. A Cleric's skills with that weapon carry the status listed.

<!-- live:weapons -->
| Weapon | Id | Kind | Channel | Shape | Cleric status | Classes |
|---|---|---|---|---|---|---|
| Greatsword | `greatsword` | Greatsword | Physical | One foe, heavy | Armor Break | Brawler, Spell Blade, Cleric, Summoner |
| Axe | `axe` | Axe | Physical | Every foe | Enfeeble | Brawler, Spell Blade, Cleric, Summoner |
| Lance | `lance` | Lance | Physical | Random foes | Mind Break | Brawler, Spell Blade, Cleric, Summoner |
| Bow | `bow` | Bow | Physical | One foe, many hits | Shatter | Brawler, Spell Blade, Cleric, Summoner |
| Katana | `katana` | Katana | Physical | Twice: the foe and one other | Hex | Brawler, Spell Blade, Cleric, Summoner |
| Fire Tome | `tome-fire` | Fire | Magical | One foe, heavy | Brave | Mage, Spell Blade, Cleric, Summoner |
| Blizzard Tome | `tome-ice` | Ice | Magical | Every foe | Aegis | Mage, Spell Blade, Cleric, Summoner |
| Thunder Tome | `tome-lightning` | Lightning | Magical | Random foes | Breaker | Mage, Spell Blade, Cleric, Summoner |
| Light Tome | `tome-light` | Light | Magical | One foe, many hits | Faith | Mage, Spell Blade, Cleric, Summoner |
| Dark Tome | `tome-dark` | Dark | Magical | Twice: the foe and one other | Clarity | Mage, Spell Blade, Cleric, Summoner |
<!-- /live -->

**Orbs** are accessories, one per kind (`orb-<kind>`, ten in all). An Orb adds its kind to every hit for weaknesses only,
with no damage of its own ([materials](materials.md#gear)).

## Skills: depths, points and slots

- Each tree is **five depths**. Each depth has a **core** skill and two **side** skills, A and B, and you take one of the
  two (a fork).
- **Cores are free**: a depth's core is known as soon as that depth opens.
- **Sides cost points.** A side costs its depth. An Uma earns one side point per level and spends them across her
  class's trees; she can forget a side to take the other.
- **A depth opens** when both her **class rank** reaches the depth (trained in the Learning halls) and her level reaches
  the gate. Side skills open at mid-band.

<!-- live:depths -->
| Depth | Core skill opens | Side skills open | Side cost | Single-target power | Full-turn MP |
|---|---|---|---|---|---|
| 1 | Class rank 1 and Uma Lv 1 | Uma Lv 5 | 1 point | 1.6 | 10 |
| 2 | Class rank 2 and Uma Lv 10 | Uma Lv 15 | 2 points | 2.2 | 14 |
| 3 | Class rank 3 and Uma Lv 20 | Uma Lv 25 | 3 points | 2.9 | 18 |
| 4 | Class rank 4 and Uma Lv 30 | Uma Lv 35 | 4 points | 3.7 | 22 |
| 5 | Class rank 5 and Uma Lv 40 | Uma Lv 45 | 5 points | 4.6 | 26 |
<!-- /live -->

<!-- live:active-slots -->
3 equipped skills at Lv 1, one more at Lv 10, 15, 20, 25, 30, 35, 40 (10 at most). 1 side point per level.
<!-- /live -->

A Brawler or Mage has 5 trees. The others have all 10, and the 5 weapons she picks decide which are usable. Every skill
is listed in [skill trees](skill-trees.md).

## Limit Breaks

<!-- live:limits -->
| Class | Limit Break |
|---|---|
| Brawler | Twin Strike: one equipped skill cast twice at full power, or two Attacks with a weapon |
| Mage | Prismatic Nova: a hit of each of the five elements, 2.4× her open depth's power in all |
| Spell Blade | Twin Arts: an Arms skill and a Tome skill, both at full power (no half) |
| Cleric | Divine Patrons: a hit with each of her five weapons (1.5× in all), each status at 3 stacks |
| Summoner | Grand Summon: one summon at twice her strength that lingers at twice its share |

The gauge fills to 12: +2 for an Attack, +4 for a skill. A Limit Break costs no MP and takes her turn.
<!-- /live -->

## Ranks and levels

| Track | Range | Trained at | What it does |
|---|---|---|---|
| Class rank | 1–5 | The class's hall (Learning page) | Opens skill depths. Each rank-up spends a Promotion Token of the band |
| Weapon Level | 1–10 | The class's hall | Level k lets her wear grade-k weapons of that class. Each level-up spends a Mastery Token |
| Armor Level | 1–10 | Armory | Level k wears grade-k armor. Each level-up spends a Mastery Token |
| Accessory Level | 1–10 | Jeweler | Level k wears grade-k Rings, Charms and Orbs. Each level-up spends a Mastery Token |

Times, token bands and aptitude speed are in [loops](loops.md#training).
