# Classes and weapons

Six classes and ten weapons (D86; classes v2, D160, live since H61, D188; the Tier rework's fight, engine v16, live
since H72, D210). Every Uma has one **active class** at a time and can switch freely. She keeps each class's own three
weapons, her line on each of its trees and her loadout. Classes and weapons are chosen on the Stable → an Uma →
**Skills** page, six classes in two rows of three ([sections](sections.md#stable)).

Native-size pixel emblems accompany the full class names in the picker, profile chip and active party bar.
The names remain available to accessibility tools.

Code: `packages/domain/src/rpg/kinds.ts` (weapons, kinds and twins), `rules.ts` (slots, hands, stat leans, lines and
Skill Ranks), `catalog.ts` (trees, see [skill trees](skill-trees.md)), `battle/limit.ts` (Limit Breaks),
`roster/template.ts` (her calling and template), `economy/ranks.ts` (ranks), `save/presets.ts` (standard presets).

## The six classes

| Class | Plays like |
|---|---|
| **Brawler** | Pure physical damage. Three Arms, one heavy act a turn |
| **Mage** | Pure magic. Three Tomes, one full cast a turn |
| **Spell Blade** | Two Arms and a Tome, physical-led. Every act is a blade and a spell, the blade the stronger half; the blade lands one extra hit, so she chips shields fast. Her line B, Pierce, cuts through a shield instead |
| **Summoner** | Two Tomes and an Arm, the Spell Blade's mirror: magic-led. Every act is a Tome summon and an Arms summon, the Tome the stronger half. The Tome summon stays, and when her next pair comes it strikes every foe in farewell. No support |
| **Paladin** | Two Arms and a Tome. A healer whose mends and Barriers grow with her ATK. Her blows weaken the foe they hit and put a Barrier on the Uma in danger; her spells bless the party, mend the most hurt and cleanse. Her Blizzard spells also Barrier every Uma, her Greatsword blows give Aegis, her Axe weakens every foe from depth 4, and Valkyrie's Oath, her Light tree's depth-3 B, raises the fallen |
| **Cleric** | Two Tomes and an Arm. A healer whose mends and Barriers grow with her M.ATK, with the Paladin's kit. Her Light spells leave Regen, a mend that repeats, her Dark spells drain, and Rebirth, her Light tree's depth-3 B, raises the fallen |

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
| Axe | Brigand, Marauder, Axe Ogre, Minotaur Chief, Jotun King |
| Lance | Pikeman, Dragoon, Lance Knight, Valkyrie, Valkyrie Queen |
| Bow, Katana | Slinger … Sagittarius; Ronin … Sword Spirit |

Fights from engines v12–v14 replay with the lines' old support: Blizzard Barriers, Light mends, Dark drains, Greatsword
Aegis, Axe Enfeeble and the Valkyries' revive, which moved to the Paladin and the Cleric.

<!-- live:classes -->
| Class | Slots | Trees | Hand: power, MP | Special | Stat lean (HP, ATK, MATK, DEF, MDEF, MP) | Limit Break power | Her calling (starts as) | Starting armor |
|---|---|---|---|---|---|---|---|---|
| Brawler | 3 Arms | 5 | ×1, MP ×1 | — | ×1.15 ×1.1 ×0.9 ×1.1 ×0.9 ×0.8 | 2× her open depth | Front runners; Pace sprinters, Power over Wit | Physical |
| Mage | 3 Tomes | 5 | ×1, MP ×1 | — | ×0.9 ×0.9 ×1.15 ×0.9 ×1.1 ×1.3 | 2.4× her open depth | Pace chasers, Wit at or over Power, or picked | Magical |
| Spell Blade | 2 Arms + 1 Tome | 10 | ×0.72 Arms, ×0.44 Tome; MP ×0.5 a half | Every act is an Arms half and a Tome half, the Arms half first; it lands one extra hit | ×1 ×1.1 ×0.95 ×1 ×1 ×1 | 2.2× her open depth | Pace chasers, Power over Wit, or picked | Physical |
| Cleric | 2 Tomes + 1 Arm | 10 | ×0.5, MP ×0.6 | Healer, from M.ATK. Blows debuff the foe and Barrier the threatened Uma; spells bless, mend and cleanse. Light spells leave Regen, Dark spells drain | ×1 ×0.8 ×1 ×1 ×1.15 ×1.3 | 1.5× her open depth | Late surgers, Wit at or over Power, or picked | Magical |
| Summoner | 2 Tomes + 1 Arm | 10 | ×0.5 Arms, ×0.58 Tome; MP ×0.5 a half | Every act is a Tome summon and an Arms summon, the Tome half first. The Tome summon lingers; when her next pair comes, it strikes every foe at 0.3 × 0.1. No support | ×1 ×0.95 ×1.1 ×1 ×1 ×1 | 2.2× her open depth | Wit-led closers; End closers | Magical |
| Paladin | 2 Arms + 1 Tome | 10 | ×0.5, MP ×0.6 | Healer, from ATK. Blows debuff the foe and Barrier the threatened Uma; spells bless, mend and cleanse. Blizzard spells Barrier every Uma, Greatsword blows give Aegis | ×1 ×1 ×0.8 ×1.15 ×1 ×1.3 | 1.5× her open depth | Late surgers, Power over Wit, or picked | Physical |
<!-- /live -->

**Hand:** the share of full power and full MP her acts use. A Brawler's Attack is 1.0. A Spell Blade's two halves add
up to a little more than one full turn, across two kinds, her Arms half the larger; a Summoner's are close to level,
her Tome half the larger, and her farewell strike comes on top, so the two deal about the same damage a turn
(H63, H71). Each half costs its own MP. The healers act at half power.

## Her calling and her template

**Her calling** (engine v16, CP29, D203): her racing profile names one class, by the first row that fits: a front
runner is a Brawler; a Wit-led closer (Wit at or over Power, A in two of Pace, Late and End) and an End closer are
Summoners; a Pace sprinter with Power over Wit (best distance Sprint) is a Brawler; a Pace chaser a Spell Blade with
Power over Wit, else a Mage; a Late surger a Paladin with Power over Wit, else a Cleric. Her base Power and Wit are at
her starting stars; Power = Wit counts as Wit.

- **She starts in it.** A new Uma is written in her calling, as her class, and in its armor half: magical for a Mage, a
  Cleric or a Summoner, physical for a Brawler, a Spell Blade or a Paladin. Umas unlocked before v16 keep their class
  and armor (an Uma who never picked a class fights as her best running style's).
- **The calling pick** (CP29, CP30): a Pace Uma picks once between the Spell Blade and the Mage, a Late Uma between the
  Paladin and the Cleric. Her Power against her Wit pre-selects ("Suggested · Power 96 over Wit 88"). The pick stays
  open until it is confirmed, by a tap or by her first won fight. At Uma Lv 1 a pick also moves her class and, while she
  wears no armor piece, her armor half. Once confirmed it never changes; she still switches class freely. Every Uma owned
  at save v27 starts unconfirmed on her pre-selection, with a dot on her template chip.

**Her template** (UT2–UT6, D203, D204): three readings of her racing profile name her "{knack word} {type}", one of 90,
the same in every tier: her **calling**, her **stride** (the longest distance at her best grade) and her **knack** (her top
growth rate; ties go to the higher base stat, then Speed, Stamina, Power, Guts, Wit). Her calling and stride give her
type, her knack its word: "Clever Spellwright".

<!-- live:templates -->
| Calling | Dash | Middle | Stayer |
|---|---|---|---|
| Brawler | Charger | Bruiser | Ironhide |
| Mage | Flarecaster | Spellwright | Starkeeper |
| Spell Blade | Flashblade | Spellfencer | Longblade |
| Cleric | Lamplighter | Mender | Pilgrim |
| Summoner | Beckoner | Binder | Shepherd |
| Paladin | Shieldrunner | Warden | Stalwart |

| Knack: her top growth rate | Word |
|---|---|
| Speed | Fleet |
| Power | Mighty |
| Stamina | Tireless |
| Guts | Gritty |
| Wit | Clever |

| Stride: her longest distance at her best grade | Flourish | As her calling |
|---|---|---|
| Dash (Sprint or Mile) | Clean break | a Barrier of 4% of her max HP at the start |
| Middle (Medium) | Even pace | 1% of her max HP at each round's end, up to 4% |
| Stayer (Long) | Late reserve | 2% of her max HP at each round's end from round 3, up to 4% |
<!-- /live -->

- **★ Her Flourish** works only while she fights as her calling's class ("No effect as Brawler" otherwise): 4% of her max
  HP a fight, in her stride's shape. Not a heal skill: no healing scale, it never overheals, and a fallen Uma gets none.
  Once a fight, not each wave ([combat](combat.md#sustain-mp-and-the-flourish)).
- **Nothing else moves:** a template adds no damage kind, stat, lean, hand or rule, and never takes anything away. Her
  signature accessory and her moon come with the economy's release (R2).

The template's chip and card and the calling pick card are on the Uma sheet ([sections](sections.md#stable)); the Stable
filters by calling, stride and knack.

## Weapons

Ten weapons: five **Arms** (physical kinds) and five **Tomes** (elements). Each kind keeps one shape in every class, so
an Axe skill always reaches every foe, whoever swings it. A Paladin's or a Cleric's skills with that weapon carry the
status listed: her blows on the foe they hit, her spells on every Uma. An Arm and the element that share its shape are
**twins** (Greatsword and Fire, Axe and Ice, Lance and Lightning, Bow and Light, Katana and Dark): every foe is weak to
one twin set ([combat](combat.md#weaknesses-shields-and-breaks)).

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

**Three weapon slots, by channel (D98; CP2, engine v16).** A class has three slots, each an **Arms** or a **Tome** slot,
the lead channel first: a Brawler three Arms, a Mage three Tomes, a Spell Blade and a Paladin two Arms and a Tome, a
Summoner and a Cleric two Tomes and an Arm. Any kind of a slot's channel fits it, three different kinds, and every class
picks; the weapon in each slot opens its tree. Every Uma holds a **Training weapon** of all ten kinds: grade 0, no
stats, always hers. A slot holds the Training weapon until she wears a crafted one of that kind, which opens the same
tree and adds its Might to the hits made with it ([materials](materials.md#gear)). A crafted piece serves every class
that holds its weapon. A new class starts on its three defaults (the presets below), in Training weapons. When she
stops slotting a kind, her equipped skills of its tree leave her loadout; her line on it stays. Fights from engines
v6–v15 replay with five weapons a class.

**Armor slots (D103, D124)** mirror them: head, body, legs, arms and feet, each holding its physical or its magical
piece, with a Training piece of each kind until she binds a crafted one ([materials](materials.md#gear)). A new Uma's
five start in her calling's half ([her calling](#her-calling-and-her-template)).

**Two accessory slots (D124), typed (classes v2, C10):**
- **Damage** holds one **Orb**, an Arms Orb or an Elemental Orb. It adds offense to her hits of its kind: half a
  weapon's Might at its grade, +34 at grade 10 (C4). It no longer adds its kind for weaknesses or locks, so an Uma
  specializes in one kind: her best weapon's, or the one her front is weak to.
- **Support** holds one **Talisman** (physical) or **Amulet** (magical): one effect each ([combat](combat.md#damage)).

Equipping refuses the other slot's type ("The Damage slot takes an Orb", "The Support slot takes a Talisman or an
Amulet").

**Standard preset (D164).** Each class has one, applied on tap from her profile's Gear tab ("Use the standard preset",
for her active class): its three default weapons (the owner's, CP3), its armor half in all five slots, an Orb in the
Damage slot and a support in the Support slot. The Orb is of her first slot's kind, so it strengthens her leading
damage, and the support is the one the balance simulation plays with. It wears the best she can: her own pieces, or the
stock's next grades her ranks allow, else Training pieces ([loops](loops.md#extra-stats-and-gear)). Her lines stay;
her equipped skills of a tree the preset takes out of her slots leave her loadout.

<!-- live:presets -->
| Class | Weapons | Armor | Orb, Damage slot | Support, Support slot |
|---|---|---|---|---|
| Brawler | Greatsword, Axe, Lance | Physical | Greatsword Orb | Vampire Talisman |
| Mage | Fire Tome, Blizzard Tome, Thunder Tome | Magical | Fire Orb | Siphon Amulet |
| Spell Blade | Katana, Lance, Thunder Tome | Physical | Katana Orb | Vampire Talisman |
| Cleric | Light Tome, Blizzard Tome, Bow | Magical | Light Orb | Spring Amulet |
| Summoner | Dark Tome, Light Tome, Bow | Magical | Dark Orb | Siphon Amulet |
| Paladin | Greatsword, Axe, Light Tome | Physical | Greatsword Orb | Thorn Talisman |
<!-- /live -->

The defaults pair up: the Brawler's and the Mage's are the ring (Fire, Ice and Lightning in each channel), and the
Spell Blade's, the Summoner's and the Cleric's each hold a twin set in both channels (Lance and Thunder; Bow and Light;
Bow and Light), so both halves of a hybrid's act land weak on it. The five fight types' defaults hold all ten kinds
with either healer.

## Skills: depths, lines and ranks

- **Five depths a tree, eight nodes.** Depths 1 and 2 are the **trunk**, always hers. At depth 3 the tree **forks** into
  **line A** and **line B**, and her line runs on through depths 4 and 5 (CP13, CP18).
- **Nothing is learned and nothing costs points** (CP14). A depth opens when her **Class Rank** in that class reaches its
  gate (D102, CP16), and every node there on her line is hers at once.
- **Line A is the default; line B is a sidegrade with its own name** (Combo, Impale, Pierce, Heavy…; every tree's is in
  [skill trees](skill-trees.md)). She takes B, or A again, free at any time outside a fight; her equipped skills follow
  in place (with Rend equipped, taking Combo puts Rending Combo in its slot). A line sits on any kind of her class's
  trees, slotted or not.
- **Skill Ranks** (CP32): every skill she holds is Rank 1 when its depth opens and gains a rank every 2 Class Ranks, up
  to Rank 5, on its own. A rank scales its power, and a healer's mend and Barrier shares, ×0.95 to ×1.05; MP, hits,
  targets and statuses never change. A line swap keeps the ranks: they read her Class Rank.
- **Pierce** (CP42): the Spell Blade's line B on every tree, the Brawler's Katana B and the Mage's Dark B land one hit at
  ×1.15 that ignores the unbroken halving; the Spell Blade's Arms half still lands its extra hit.

<!-- live:depths -->
| Depth | Line | Opens at | Ranks 2–5 at Class Rank | Single-target power, Rank 1 → 5 | Full-turn MP |
|---|---|---|---|---|---|
| 1 | Trunk | Class Rank 1 | 3, 5, 7, 9 | 1.52 → 1.68 (1.6 at Rank 3) | 10 |
| 2 | Trunk | Class Rank 10 | 12, 14, 16, 18 | 2.09 → 2.31 (2.2 at Rank 3) | 14 |
| 3 | The fork: A or B | Class Rank 20 | 22, 24, 26, 28 | 2.76 → 3.05 (2.9 at Rank 3) | 18 |
| 4 | Her line, A or B | Class Rank 30 | 32, 34, 36, 38 | 3.52 → 3.89 (3.7 at Rank 3) | 22 |
| 5 | Her line, A or B | Class Rank 40 | 42, 44, 46, 48 | 4.37 → 4.83 (4.6 at Rank 3) | 26 |
<!-- /live -->

<!-- live:active-slots -->
3 equipped skills at Lv 1, one more at Lv 10, 20, 30, 40 (7 at most). No points and no side skills: every skill on her path is hers at its depth's Class Rank, and ranks up every 2 Class Ranks (×0.95 at Rank 1 to ×1.05 at Rank 5).
<!-- /live -->

A Brawler or Mage has 5 trees. The others have all 10, and the 3 weapons in her slots decide which are usable. Until
you pick her skills, the auto loadout takes each slot's deepest skill on her line in turn (a hybrid's Arms and Tomes
alternating, her larger half first). Every skill is listed in [skill trees](skill-trees.md). Fights from engines v6–v15
replay with side skills bought with points, ten equipped skills at most.

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

A Limit Break that mends or raises a Barrier does it at 66% of each Uma's max HP ×0.4, × her healing scale and the cast's strength; its cleanse and its revive land at any strength. The gauge fills to 12: +2 for an Attack, +4 for a skill. A Limit Break costs no MP and takes her turn. Limit Breaks don't rank: their power follows her open depth, never her Skill Ranks. Since engine v16 Rampart Charge charges with an Axe and Choir of Angels strikes with Light, then Lightning (CP35); fights from v15 replay with Rampart Charge's Greatsword and Choir of Angels' Light twice. Fights from engines v10–v14 replay with five halls' twenty: the Cleric Chapel's seats 3 and 4 Archangel’s Verdict and Archdemon’s Pact, Sunfire Edge in one cleave, Moon Fox on one foe, the Spell Blade at 2× and the Summoner at 1.8×, and a Learner's hits at each kind's own offense. Fights from engines v6–v9 replay with the classes' retired Limit Breaks: Brawler Twin Strike: one equipped skill cast twice at full power, or two Attacks with a weapon; Mage Prismatic Nova: a hit of each of the five elements, 2.4× her open depth's power in all; Spell Blade Twin Arts: an Arms skill and a Tome skill, both at full power (no half); Cleric Divine Patrons: a hit with each of her five weapons (1.5× in all), each status at 3 stacks; Summoner Grand Summon: one summon at twice her strength that lingers at twice its share.
<!-- /live -->

## Ranks and levels

Four bars, all filled by winning fights (D102). Nothing is trained and no token is spent.

| Bar | Range | Rises with | Opens |
|---|---|---|---|
| **Uma Level** | 1–50 | Every win | Her stats, skill slots (3 → 7) and Extra Stats slots |
| **Class Rank**, per class | 1–50 | Wins as that class | That class's trees: depths at Rank 1, 10, 20, 30, 40, and a Skill Rank every 2 Class Ranks. Her Limit Break's depth |
| **Weapon Rank**, per weapon | 1–10 | Wins with that weapon in her slots | Wearing that weapon up to grade = rank, in every class |
| **Armor Rank**, per armor kind | 1–10 | Wins wearing that kind | Wearing that kind up to grade = rank |

Curves, EXP per win and Marks are in [loops](loops.md#ranks). A Lv 1 Uma can reach any rank: there are no caps between
bars.
