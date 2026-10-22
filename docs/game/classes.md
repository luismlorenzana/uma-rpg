# Classes and weapons

Six classes and ten weapons (D86; classes v2, D160, live since H61, D188). Every Uma has one **active class** at a time
and can switch freely. She keeps each class's own weapons, learned skills and loadout. Classes and weapons are chosen on
the Stable → an Uma → **Skills** page, six classes in two rows of three ([sections](sections.md#stable)).

Native-size pixel emblems accompany the full class names in the picker, profile chip and active party bar.
The names remain available to accessibility tools.

Code: `packages/domain/src/rpg/kinds.ts` (weapons and kinds), `rules.ts` (slots, hands, stat leans, learning rules),
`catalog.ts` (trees, see [skill trees](skill-trees.md)), `battle/limit.ts` (Limit Breaks), `economy/ranks.ts`
(ranks), `save/presets.ts` (standard presets).

## The six classes

| Class | Plays like |
|---|---|
| **Brawler** | Pure physical damage. All five Arms, one heavy act a turn |
| **Mage** | Pure magic. All five Tomes, one full cast a turn |
| **Spell Blade** | Three Arms and two Tomes, physical-led. Every act is a blade and a spell, the blade the stronger half; the blade lands one extra hit, so she chips shields fast |
| **Summoner** | Three Tomes and two Arms, the Spell Blade's mirror: magic-led. Every act is a Tome summon and an Arms summon, the Tome the stronger half. The Tome summon stays, and when her next pair comes it strikes every foe in farewell. No support |
| **Paladin** | Three Arms and two Tomes. A healer whose mends and Barriers grow with her ATK. Her blows weaken the foe they hit and put a Barrier on the Uma in danger; her spells bless the party, mend the most hurt and cleanse. Her Blizzard spells also Barrier every Uma, her Greatsword blows give Aegis, her Axe weakens every foe from depth 4, and Valkyrie's Oath raises the fallen |
| **Cleric** | Three Tomes and two Arms. A healer whose mends and Barriers grow with her M.ATK, with the Paladin's kit. Her Light spells leave Regen, a mend that repeats, her Dark spells drain, and Rebirth raises the fallen |

Brawler, Mage, Spell Blade and Summoner deal the damage; the Paladin and the Cleric split their turns between damage
and support, at twice the old shares ([combat](combat.md#support)).

**One healer a party** (C8, D178): a party fights with one Paladin or Cleric at most. A party with two shows "One
healer a party" in the Party Hall, on the world map's party bar and in the Rift's party slots, and can't fight until
one of them changes to a damage class. Party edits and class switches are never refused, and Sweeps don't fight, so
they don't check.

**Summon lines:** every line strikes. A summon keeps its weapon's shape on arrival.

| Line | Summons |
|---|---|
| Fire | Ember Sprites, Salamander, Fire Drake, Infernal Wyrm, Phoenix (Burn at depth 5) |
| Blizzard | Frost Sprites, Snow Sentinel, Ice Golem, Frost Titan, Winter Queen |
| Thunder | Spark Sprites, Thunderbird, Storm Roc, Thunder Kirin, Raijin (Shock at depth 5) |
| Light | Cherub, Mending Angel, Seraph Choir, Dominion Host, Heaven's Legion |
| Dark | Leech Imp, Night Bat, Vampire Knight, Blood Countess, Abyssal Overlord |
| Greatsword | Squire, Shield Knight, Knight Captain, Aegis Champion, Sword Saint |
| Axe | Brigand, Berserker, Axe Ogre, Minotaur Chief, Jotun Warlord |
| Lance | Pikeman, Dragoon, Lance Knight, Valkyrie, Valkyrie Queen |
| Bow, Katana | Slinger … Sagittarius; Ronin … Sword Spirit |

Fights from engines v12–v14 replay with the lines' old support: Blizzard Barriers, Light mends, Dark drains, Greatsword
Aegis, Axe Enfeeble and the Valkyries' revive, which moved to the Paladin and the Cleric.

<!-- live:classes -->
| Class | Slots | Trees | Hand: power, MP | Special | Stat lean (HP, ATK, MATK, DEF, MDEF, MP) | Limit Break power | Starts as | Starting armor |
|---|---|---|---|---|---|---|---|---|
| Brawler | 5 Arms | 5 | ×1, MP ×1 | — | ×1.15 ×1.1 ×0.9 ×1.1 ×0.9 ×0.8 | 2× her open depth | Front runners | Physical |
| Mage | 5 Tomes | 5 | ×1, MP ×1 | — | ×0.9 ×0.9 ×1.15 ×0.9 ×1.1 ×1.3 | 2.4× her open depth | Pace chasers | Magical |
| Spell Blade | 3 Arms + 2 Tomes | 10 | ×0.72 Arms, ×0.44 Tome; MP ×0.5 a half | Every act is an Arms half and a Tome half, the Arms half first; it lands one extra hit | ×1 ×1.1 ×0.95 ×1 ×1 ×1 | 2.2× her open depth | — | Physical |
| Cleric | 3 Tomes + 2 Arms | 10 | ×0.5, MP ×0.6 | Healer, from M.ATK. Blows debuff the foe and Barrier the threatened Uma; spells bless, mend and cleanse. Light spells leave Regen, Dark spells drain | ×1 ×0.8 ×1 ×1 ×1.15 ×1.3 | 1.5× her open depth | Late surgers, Wit at or over Power | Magical |
| Summoner | 3 Tomes + 2 Arms | 10 | ×0.56 Arms, ×0.58 Tome; MP ×0.5 a half | Every act is a Tome summon and an Arms summon, the Tome half first. The Tome summon lingers; when her next pair comes, it strikes every foe at 0.3 × 0.1. No support | ×1 ×0.95 ×1.1 ×1 ×1 ×1 | 2.2× her open depth | End closers | Magical |
| Paladin | 3 Arms + 2 Tomes | 10 | ×0.5, MP ×0.6 | Healer, from ATK. Blows debuff the foe and Barrier the threatened Uma; spells bless, mend and cleanse. Blizzard spells Barrier every Uma, Greatsword blows give Aegis | ×1 ×1 ×0.8 ×1.15 ×1 ×1.3 | 1.5× her open depth | Late surgers, Power over Wit | Physical |
<!-- /live -->

**Hand:** the share of full power and full MP her acts use. A Brawler's Attack is 1.0. A Spell Blade's two halves add
up to a little more than one full turn, across two kinds, her Arms half the larger; a Summoner's are close to level,
her Tome half the larger, and her farewell strike comes on top, so the two deal about the same damage a turn
(H63). Each half costs its own MP. The healers act at half power.

**Starts as:** a new Uma begins in the class of her best running style, and in that class's armor: magical for a Mage,
a Cleric or a Summoner, physical for a Brawler or a Paladin (D162). A Late surger starts as a **Paladin** when her base
Power beats her Wit, else as a Cleric, and a Paladin start is written as her class (D180). An Uma who never picked a
class keeps her style's, so nobody changed class when the Paladin came. Umas unlocked before keep their armor. Spell
Blade is never a default.

## Weapons

Ten weapons: five **Arms** (physical kinds) and five **Tomes** (elements). Each kind keeps one shape in every class, so
an Axe skill always reaches every foe, whoever swings it. A Paladin's or a Cleric's skills with that weapon carry the
status listed: her blows on the foe they hit, her spells on every Uma.

<!-- live:weapons -->
| Weapon | Id | Kind | Channel | Shape | Healer status | Classes |
|---|---|---|---|---|---|---|
| Greatsword | `greatsword` | Greatsword | Physical | One foe, heavy | Armor Break | Brawler, Spell Blade, Cleric, Summoner, Paladin |
| Axe | `axe` | Axe | Physical | Every foe | Enfeeble | Brawler, Spell Blade, Cleric, Summoner, Paladin |
| Lance | `lance` | Lance | Physical | Random foes | Mind Break | Brawler, Spell Blade, Cleric, Summoner, Paladin |
| Bow | `bow` | Bow | Physical | One foe, many hits | Shatter | Brawler, Spell Blade, Cleric, Summoner, Paladin |
| Katana | `katana` | Katana | Physical | Twice: the foe and one other | Hex | Brawler, Spell Blade, Cleric, Summoner, Paladin |
| Fire Tome | `tome-fire` | Fire | Magical | One foe, heavy | Brave | Mage, Spell Blade, Cleric, Summoner, Paladin |
| Blizzard Tome | `tome-ice` | Ice | Magical | Every foe | Aegis | Mage, Spell Blade, Cleric, Summoner, Paladin |
| Thunder Tome | `tome-lightning` | Lightning | Magical | Random foes | Breaker | Mage, Spell Blade, Cleric, Summoner, Paladin |
| Light Tome | `tome-light` | Light | Magical | One foe, many hits | Faith | Mage, Spell Blade, Cleric, Summoner, Paladin |
| Dark Tome | `tome-dark` | Dark | Magical | Twice: the foe and one other | Clarity | Mage, Spell Blade, Cleric, Summoner, Paladin |
<!-- /live -->

**Weapon slots (D98).** A class has five weapon slots, and the weapon in each slot opens its skill tree. Every Uma holds
a **Training weapon** of all ten kinds: grade 0, no stats, always hers. A slot holds the Training weapon until she wears
a crafted one of that kind, which opens the same tree and adds its Might to the hits made with it
([materials](materials.md#gear)). A crafted piece serves every class that holds its weapon. Spell Blade, Summoner,
Paladin and Cleric choose each slot's weapon within the slot's kind (Arms or Tome); a Brawler's and a Mage's slots are
fixed to their five. A new Uma's slots hold her class's default spread, in Training weapons, so she starts with the
depth-1 cores of those trees.

**Armor slots (D103, D124)** mirror them: head, body, legs, arms and feet, each holding its physical or its magical
piece, with a Training piece of each kind until she binds a crafted one ([materials](materials.md#gear)). A new Uma's
five start in her starting class's half ([starts as](#the-six-classes)).

**Two accessory slots (D124), typed (classes v2, C10):**
- **Damage** holds one **Orb**, an Arms Orb or an Elemental Orb. It adds offense to her hits of its kind: half a
  weapon's Might at its grade, +34 at grade 10 (C4). It no longer adds its kind for weaknesses or locks, so an Uma
  specializes in one kind: her best weapon's, or the one her front is weak to.
- **Support** holds one **Talisman** (physical) or **Amulet** (magical): one effect each ([combat](combat.md#damage)).

Equipping refuses the other slot's type ("The Damage slot takes an Orb", "The Support slot takes a Talisman or an
Amulet").

**Standard preset (D164).** Each class has one, applied on tap from her profile's Gear tab ("Use the standard preset",
for her active class): its default weapon spread, its armor half in all five slots, an Orb in the Damage slot and a
support in the Support slot. The Orb is of her spread's first weapon's kind, so it strengthens her leading damage, and
the support is the one the balance simulation plays with. It wears the best she can: her own pieces, or the stock's
next grades her ranks allow, else Training pieces ([loops](loops.md#extra-stats-and-gear)). Her learned and equipped
skills stay.

<!-- live:presets -->
| Class | Weapons | Armor | Orb, Damage slot | Support, Support slot |
|---|---|---|---|---|
| Brawler | Greatsword, Axe, Lance, Bow, Katana | Physical | Greatsword Orb | Vampire Talisman |
| Mage | Fire Tome, Blizzard Tome, Thunder Tome, Light Tome, Dark Tome | Magical | Fire Orb | Siphon Amulet |
| Spell Blade | Greatsword, Lance, Katana, Fire Tome, Thunder Tome | Physical | Greatsword Orb | Vampire Talisman |
| Cleric | Light Tome, Dark Tome, Thunder Tome, Katana, Bow | Magical | Light Orb | Spring Amulet |
| Summoner | Fire Tome, Blizzard Tome, Thunder Tome, Greatsword, Lance | Magical | Fire Orb | Siphon Amulet |
| Paladin | Greatsword, Axe, Lance, Blizzard Tome, Fire Tome | Physical | Greatsword Orb | Thorn Talisman |
<!-- /live -->

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
**Limit Breaks come only from the Halls of Heroes** (D112, engine v10). A Hero always uses her seat's, at 100%; a Learner uses either of her Heroes', at 50% plus 5% a Bond Level (100% at Bond 10), her inherited hits at the higher of her ATK and M.ATK while their kinds still decide weaknesses and locks (v15, C3). An Uma who is neither has none, and her gauge has nothing to spend. At 100% a Limit Break is worth her class's power below, in single-target casts at her open depth:

| Class | Limit Break power |
|---|---|
| Brawler | 2× |
| Mage | 2.4× |
| Spell Blade | 2.2× |
| Cleric | 1.5× |
| Summoner | 2.2× |
| Paladin | 1.5× |

A Limit Break that mends or raises a Barrier does it at 66% of each Uma's max HP ×0.4, × her healing scale and the cast's strength; its cleanse and its revive land at any strength. The gauge fills to 12: +2 for an Attack, +4 for a skill. A Limit Break costs no MP and takes her turn. Fights from engines v10–v14 replay with five halls' twenty: the Cleric Chapel's seats 3 and 4 Archangel’s Verdict and Archdemon’s Pact, Sunfire Edge in one cleave, Moon Fox on one foe, the Spell Blade at 2× and the Summoner at 1.8×, and a Learner's hits at each kind's own offense. Fights from engines v6–v9 replay with the classes' retired Limit Breaks: Brawler Twin Strike: one equipped skill cast twice at full power, or two Attacks with a weapon; Mage Prismatic Nova: a hit of each of the five elements, 2.4× her open depth's power in all; Spell Blade Twin Arts: an Arms skill and a Tome skill, both at full power (no half); Cleric Divine Patrons: a hit with each of her five weapons (1.5× in all), each status at 3 stacks; Summoner Grand Summon: one summon at twice her strength that lingers at twice its share.
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
