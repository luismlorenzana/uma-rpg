# Classes and weapons

Five classes and ten weapons (D86). Every Uma has one **active class** at a time and can switch freely. She keeps each
class's own weapons, learned skills and loadout. Classes and weapons are chosen on the Stable → an Uma → **Skills**
page ([sections](sections.md#stable)).

Native-size pixel emblems accompany the full class names in the picker, profile chip and active party bar.
The names remain available to accessibility tools.

Code: `packages/domain/src/rpg/kinds.ts` (weapons and kinds), `rules.ts` (slots, hands, stat leans, learning rules),
`catalog.ts` (trees, see [skill trees](skill-trees.md)), `battle/limit.ts` (Limit Breaks), `economy/ranks.ts`
(ranks).

## The five classes

| Class | Plays like |
|---|---|
| **Brawler** | Pure physical damage. All five Arms, one heavy act a turn. An Elemental Orb adds an element to every hit |
| **Mage** | Pure magic. All five Tomes, one full cast a turn. An Arms Orb adds a weapon kind to every cast |
| **Spell Blade** | Three Arms and two Tomes. Every act is a blade and a spell, each at about half strength |
| **Cleric** | Any five weapons. Half offense, half healer and shielder (D141): her blows weaken the foe they hit and put a Barrier on the Uma in danger; her spells bless the whole party, mend the most hurt and cleanse. Rebirth raises the fallen |
| **Summoner** | Three Tomes and two Arms. Each summon strikes, stays, and strikes again when the next one comes. Half offense, half support (D141): her summon lines each have a job, so her five weapons make her a striker, a healer or a shielder |

Brawler, Mage and Spell Blade are pure offense; Cleric and Summoner share their turns between damage and support
([combat](combat.md#support-v12)).

**Summon lines (D141):**

| Line | Summons | Job |
|---|---|---|
| Fire | Ember Sprites, Salamander, Fire Drake, Infernal Wyrm, Phoenix | Strike (Burn at depth 5) |
| Blizzard | Frost Sprites, Snow Sentinel, Ice Golem, Frost Titan, Winter Queen | A Barrier on every Uma |
| Thunder | Spark Sprites, Thunderbird, Storm Roc, Thunder Kirin, Raijin | Strike (Shock at depth 5) |
| Light | Cherub, Mending Angel, Seraph Choir, Dominion Host, Heaven's Legion | Mend every Uma, and again each round while it lingers |
| Dark | Leech Imp, Night Bat, Vampire Knight, Blood Countess, Abyssal Overlord | Drain: its damage heals the most hurt |
| Greatsword | Squire, Shield Knight, Paladin, Aegis Champion, Sword Saint | Aegis on every Uma |
| Axe | Brigand, Berserker, Axe Ogre, Minotaur Chief, Jotun Warlord | Enfeeble every foe it hits |
| Lance | Pikeman, Dragoon, Lance Knight, Valkyrie, Valkyrie Queen | Valkyries (depth 4–5) raise the fallen |
| Bow, Katana | Slinger … Sagittarius; Ronin … Sword Spirit | Strike |

<!-- live:classes -->
| Class | Slots | Trees | Hand: power, MP | Special | Stat lean (HP, ATK, MATK, DEF, MDEF, MP, Heal) | Limit Break power | Starts as |
|---|---|---|---|---|---|---|---|
| Brawler | 5 Arms | 5 | ×1, ×1 | — | ×1.15 ×1.1 ×0.9 ×1.1 ×0.9 ×0.8 ×0.8 | 2× her open depth | Front runners |
| Mage | 5 Tomes | 5 | ×1, ×1 | — | ×0.9 ×0.9 ×1.15 ×0.9 ×1.1 ×1.3 ×1 | 2.4× her open depth | Pace chasers |
| Spell Blade | 3 Arms + 2 Tomes | 10 | ×0.45, ×0.5 | Every act is an Arms half and a Tome half | ×1 ×1.05 ×1.05 ×1 ×1 ×1 ×0.9 | 2× her open depth | — |
| Cleric | Any 5 | 10 | ×0.5, ×0.6 | Each skill carries a status; her spells mend and cleanse, her blows raise a Barrier | ×1 ×0.8 ×1 ×1 ×1.15 ×1.3 ×1.3 | 1.5× her open depth | Late surgers |
| Summoner | 3 Tomes + 2 Arms | 10 | ×0.6, ×0.7 | A summon lingers and acts again at 0.3; most summon lines also mend, shield, drain, bless or revive | ×1 ×1 ×1 ×1 ×1 ×1.1 ×1.2 | 1.8× her open depth | End closers |
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

**Weapon slots (D98).** A class has five weapon slots, and the weapon in each slot opens its skill tree. Every Uma holds
a **Training weapon** of all ten kinds: grade 0, no stats, always hers. A slot holds the Training weapon until she wears
a crafted one of that kind, which opens the same tree and adds its Might to the hits made with it (+4 a grade, D104). A
crafted piece serves every class that holds
its weapon. Spell Blade, Cleric and Summoner choose each slot's weapon within the slot's kind (Arms, Tome or any); a
Brawler's and a Mage's slots are fixed to their five. A new Uma's slots hold her class's default spread, in Training
weapons, so she starts with the depth-1 cores of those trees.

**Armor slots (D103, D124)** mirror them: head, body, legs, arms and feet, each holding its physical or its magical
piece, with a Training piece of each kind until she binds a crafted one ([materials](materials.md#gear)).

**Two accessory slots (D124)** hold any two accessories of different types:
- **Orbs** (offense): an Arms Orb or an Elemental Orb adds its kind to every hit, for weaknesses only, with no damage of
  its own.
- **Talismans** (physical defense) and **Amulets** (magical defense): one small effect each.

## Skills: depths, points and slots

- Each tree is **five depths**. Each depth has a **core** skill and two **side** skills, A and B, and you take one of the
  two (a fork).
- **Cores are free**: a depth's core is known as soon as that depth opens.
- **Sides cost points.** A side costs its depth; she can forget a side to take the other.
- **A depth opens** when her **Class Rank** in that class reaches its gate (D102). Her Uma Level no longer gates depths.
- **Side points:** one per Class Rank, per class, spent across that class's trees.

<!-- live:depths -->
| Depth | Core skill opens | Side skills open | Side cost | Single-target power | Full-turn MP |
|---|---|---|---|---|---|
| 1 | Class Rank 1 | Class Rank 5 | 1 point | 1.6 | 10 |
| 2 | Class Rank 10 | Class Rank 15 | 2 points | 2.2 | 14 |
| 3 | Class Rank 20 | Class Rank 25 | 3 points | 2.9 | 18 |
| 4 | Class Rank 30 | Class Rank 35 | 4 points | 3.7 | 22 |
| 5 | Class Rank 40 | Class Rank 45 | 5 points | 4.6 | 26 |
<!-- /live -->

<!-- live:active-slots -->
3 equipped skills at Lv 1, one more at Lv 10, 15, 20, 25, 30, 35, 40 (10 at most). 1 side point per Class Rank, per class.
<!-- /live -->

A Brawler or Mage has 5 trees. The others have all 10, and the 5 weapons in her slots decide which are usable. Until
you pick her skills, the auto loadout takes each slot's deepest open core in turn (a hybrid's Arms and Tomes
alternating, her larger half first). Every skill
is listed in [skill trees](skill-trees.md).

## Limit Breaks

<!-- live:limits -->
**Limit Breaks come only from the Halls of Heroes** (D112, engine v10). A Hero always uses her seat's, at 100%; a Learner uses either of her Heroes', at 50% plus 5% a Bond Level (100% at Bond 10). An Uma who is neither has none, and her gauge has nothing to spend. At 100% a Limit Break is worth her class's power below, in single-target casts at her open depth:

| Class | Limit Break power |
|---|---|
| Brawler | 2× |
| Mage | 2.4× |
| Spell Blade | 2× |
| Cleric | 1.5× |
| Summoner | 1.8× |

The gauge fills to 12: +2 for an Attack, +4 for a skill. A Limit Break costs no MP and takes her turn. Fights from engines v6–v9 replay with the classes' retired Limit Breaks: Brawler Twin Strike: one equipped skill cast twice at full power, or two Attacks with a weapon; Mage Prismatic Nova: a hit of each of the five elements, 2.4× her open depth's power in all; Spell Blade Twin Arts: an Arms skill and a Tome skill, both at full power (no half); Cleric Divine Patrons: a hit with each of her five weapons (1.5× in all), each status at 3 stacks; Summoner Grand Summon: one summon at twice her strength that lingers at twice its share.
<!-- /live -->

## Ranks and levels

Four bars, all filled by winning fights (D102). Nothing is trained and no token is spent.

| Bar | Range | Rises with | Opens |
|---|---|---|---|
| **Uma Level** | 1–50 | Every win | Her stats, skill slots (3 → 10) and Extra Stats slots |
| **Class Rank**, per class | 1–50 | Wins as that class | That class's trees: cores at Rank 1, 10, 20, 30, 40, side skills at 5 … 45, a side point a rank. Her Limit Break's depth |
| **Weapon Rank**, per weapon | 1–10 | Wins with that weapon in her slots | Wearing that weapon up to grade = rank, in every class |
| **Armor Rank**, per armor kind | 1–10 | Wins wearing that kind | Wearing that kind up to grade = rank |

Curves, EXP per win and Marks are in [loops](loops.md#ranks). A Lv 1 Uma can reach any rank: there are no caps between
bars.
