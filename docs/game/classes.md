# Classes and weapons

Six classes and ten weapons, as engine v18 and save v31 play them. Every Uma has one **active class** at a time and
switches freely. She keeps each class's own three weapons, her line on each of its trees and her equipped skills. A
fight already open keeps the setup it started with, and fights from older engines replay on their own rules
([combat](combat.md)).

Classes and weapons are set on her profile's **Skills** tab (the Stable → an Uma, [sections](sections.md#stable)): its
Class tile opens the six classes in two rows of three, and its three tree tabs hold her weapons. Each class has a pixel
emblem, shown beside its name in the picker, on her profile and on the party bars.

Code: `packages/domain/src/rpg/kinds.ts` (weapons, kinds, twins, the healers), `rpg/rules.ts` (slots, defaults, hands,
leans, held skills, Skill Ranks, the auto loadout), `rpg/node-identity.ts` (lines), `rpg/catalog.ts` (the trees, see
[skill trees](skill-trees.md)), `roster/template.ts` (her calling and template), `save/class.ts` and `save/battle.ts`
(her class, weapons, lines, calling pick and fight setup), `save/presets.ts` (standard presets), `save/forge.ts`
(accessory forms), `economy/grades.ts`, `economy/accessories.ts` and `economy/planet.ts` (gear, the signature, her moon).
Design intent: [class progression](../design/tier-rework/class-progression.md),
[Uma templates](../design/tier-rework/uma-templates.md), [weapon progression](../design/tier-rework/weapon-progression.md).

## The six classes

| Class | Plays like |
|---|---|
| **Brawler** | Pure physical damage. Three Arms, one full act a turn |
| **Mage** | Pure magic. Three Tomes, one full cast a turn |
| **Spell Blade** | Two Arms and a Tome, physical-led. Every act is an Arms half and a Tome half, the Arms half the stronger and first. Her Arms half lands one extra hit (the same total), so she chips shields fast. All her skills strike one foe. Her line B, Pierce, cuts through a standing shield instead |
| **Summoner** | Two Tomes and an Arm, the Spell Blade's mirror: magic-led. Every act is a Tome summon and an Arms summon, the Tome the stronger and first. The Tome summon stays; when her next pair comes it strikes every foe once in farewell and leaves. The Arms summon strikes and goes. No support |
| **Paladin** | Two Arms and a Tome. A healer whose mends and Barriers grow with her ATK. Her blows weaken the foe they hit and Barrier the Uma in most danger; her spells bless the party, mend the most hurt and cleanse. Her Blizzard spells also Barrier every Uma, her Greatsword blows give Aegis to whoever they Barrier, her Axe weakens every foe from depth 4, and Valkyrie's Oath, her Light tree's depth-3 B, raises the fallen |
| **Cleric** | Two Tomes and an Arm. A healer whose mends and Barriers grow with her M.ATK, with the Paladin's kit. Her Light spells leave Regen, a mend that repeats; her Dark spells drain; Rebirth, her Light tree's depth-3 B, raises the fallen |

Brawler, Mage, Spell Blade and Summoner deal damage only. The Paladin and the Cleric act at half power and carry the
party's support ([combat](combat.md#support)).

**One healer a party** (C8, D178): a party fights with one Paladin or Cleric at most. A party with two shows "One
healer a party" in the Party Hall, on the world map's party bar and in the Rift's party slots, and can't start a fight
until one of them changes to a damage class; the engine refuses such a party too. Party edits and class switches are
never refused, and Sweeps don't fight, so they don't check.

<!-- live:classes -->
| Class | Slots | Trees | Hand: power, MP | Special | Stat lean (HP, ATK, MATK, DEF, MDEF, MP) | Limit Break power | Her calling (starts as) | Starting armor |
|---|---|---|---|---|---|---|---|---|
| Brawler | 3 Arms | 5 | ×1, MP ×1 | — | ×1.15 ×1.1 ×0.9 ×1.1 ×0.9 ×0.8 | 2× her open depth | Front runners; Pace sprinters, Power over Wit | Physical |
| Mage | 3 Tomes | 5 | ×1, MP ×1 | — | ×0.9 ×0.9 ×1.15 ×0.9 ×1.1 ×1.3 | 2.4× her open depth | Pace chasers, Wit at or over Power, or picked | Magical |
| Spell Blade | 2 Arms + 1 Tome | 10 | ×0.72 Arms, ×0.44 Tome; MP ×0.5 a half | Every act is an Arms half and a Tome half, the Arms half first; it lands one extra hit | ×1 ×1.1 ×0.95 ×1 ×1 ×1 | 2.2× her open depth | Pace chasers, Power over Wit, or picked | Physical |
| Cleric | 2 Tomes + 1 Arm | 10 | ×0.5, MP ×0.6 | Healer, from M.ATK. Blows debuff the foe and Barrier the threatened Uma; spells bless, mend and cleanse. Light spells leave Regen, Dark spells drain | ×1 ×0.8 ×1 ×1 ×1.15 ×1.3 | 1.5× her open depth | Late surgers, Wit at or over Power, or picked | Magical |
| Summoner | 2 Tomes + 1 Arm | 10 | ×0.5 Arms, ×0.62 Tome; MP ×0.5 a half | Every act is a Tome summon and an Arms summon, the Tome half first. The Tome summon lingers; when her next pair comes, it strikes every foe at 0.3 × 0.1. No support | ×1 ×0.95 ×1.1 ×1 ×1 ×1 | 2.2× her open depth | Late + End closers; End closers | Magical |
| Paladin | 2 Arms + 1 Tome | 10 | ×0.5, MP ×0.6 | Healer, from ATK. Blows debuff the foe and Barrier the threatened Uma; spells bless, mend and cleanse. Blizzard spells Barrier every Uma, Greatsword blows give Aegis | ×1 ×1 ×0.8 ×1.15 ×1 ×1.3 | 1.5× her open depth | Late surgers, Power over Wit, or picked | Physical |
<!-- /live -->

- **Slots:** her three weapon slots by channel, the lead channel first ([weapons](#weapons)).
- **Trees:** the trees her slots can open: the Brawler's five Arms, the Mage's five Tomes, all ten for the others.
- **Hand:** the share of full power and full MP her acts use; a Brawler's Attack is 1.0. A Spell Blade's two halves
  (0.72 + 0.44) add up to a little more than one full turn, her Arms half the larger. A Summoner's (Tome 0.62 + Arms
  0.5) are close to level, her Tome half the larger, and her farewell comes on top, so the two deal about the same damage
  a turn (the Summoner 88–110% of the Spell Blade at Lv 10–50 on engine v18, D236). Each half costs its own MP. The
  healers act at half power for 0.6 of the MP.
- **Stat lean:** multiplies her projected HP, ATK, M.ATK, DEF, M.DEF and MP while she fights as the class
  ([combat](combat.md#damage)).
- **Limit Break power:** what a Limit Break she casts as this class is worth ([Limit Breaks](#limit-breaks)).
- **Her calling:** the racing profiles that call the class ([below](#her-calling-and-her-template)).
- **Starting armor** is the class's armor half: her armor's offense goes to ATK or M.ATK by the class she fights as
  ([armor](#armor-and-the-accessory)). There is no armor kind to choose or start in.

## Her calling and her template

**Her calling** (CP29, D203, D220) is the class her racing profile names. The first rule that fits, reading her best
running styles (every style at her top grade) and her base Power and Wit at her starting stars:

1. **Front** among her best styles: a **Brawler**.
2. Otherwise **Pace** among her best styles (Pace + Late included): a Power-led sprinter (Power over Wit, and Sprint the
   shortest distance at her best distance grade) is a **Brawler**; another Power-led Uma a **Spell Blade**; a Wit-led
   Uma (Wit at or over Power) a **Mage**. The last two have the calling pick.
3. Otherwise **Late and End** both among her best: a **Summoner**.
4. Otherwise **End**: a **Summoner**.
5. Otherwise **Late**: a **Paladin** with Power over Wit, else a **Cleric**. Both have the calling pick.

- **She starts in it.** A new Uma is written in her calling's class. An Uma with no class written (unlocked before
  engine v16 and never switched) fights as her best running style's: Front a Brawler, Pace a Mage, Late a Cleric, End a
  Summoner.
- **The calling pick** (CP29, CP30): a Pace Uma of rule 2's last two cases picks once between the Spell Blade and the
  Mage, a Late Uma between the Paladin and the Cleric. Her Power against her Wit pre-selects ("Suggested · Power 96 over
  Wit 88"). The pick stays open until it is confirmed, by Confirm on the card or by her first won fight (a world fight,
  a Sweep or a Rift fight). At Uma Lv 1 a pick also moves her class while she still fights as her previous calling's
  class. The pick moves her trade, so it waits while she has work started or queued ("Finish her work first"). Once
  confirmed it never changes; she still switches class freely. An open calling shows a dot on her template chip.
- **When the rule's rows change** (D220), `save/calling-repair.ts` repairs stored picks after the roster loads: a
  confirmed calling that now has a pick reopens on its suggestion, and a pick on a row that no longer has one clears.
  Her class and progress never move.

**Her template** (UT2–UT6, D203, D204): three readings of her racing profile name her "{knack word} {type}", one of 90,
the same in every tier: her **calling**, her **stride** (the longest distance at her best distance grade) and her
**knack** (her top growth rate; ties go to the higher base stat, then Speed, Stamina, Power, Guts, Wit). Her calling and
stride give her type, her knack its word: "Clever Spellwright".

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

Its four pieces all work in Tier 1:

- **★ Her Flourish** works only while she fights as her calling's class ("No effect as Brawler" otherwise): 4% of her
  max HP a fight, in her stride's shape. Clean break's Barrier lapses at round 1's end. Not a heal skill: no healing
  scale, it never overheals, and a fallen Uma gets none. Once a fight, not each wave
  ([combat](combat.md#sustain-mp-and-the-flourish)).
- **★ Her signature** (UT7, D212): her knack names an accessory family: Fleet the Bell, Mighty the Orb, Tireless the
  Pendant, Gritty and Clever the Insignia. While her accessory slot wears that family at G1 or more, her ATK and M.ATK
  rise 0.2 a level × the tier (Tier 1: +2, +6, +10 at Lv 10, 30, 50), whatever class she fights as. Her standard preset
  wears it, and the Gear tab lists her family first with a ★ ([materials](materials.md#gear)).
- **★ Her moon** (UT10, D213): two nodes beside her Extra Stats map, opened by a Moon Jewel II (Lv 16) and IV (Lv 36).
  Node I gives +4 × the tier to her knack's stat: Tireless HP, Clever MP, Mighty DEF and M.DEF, Fleet 4 Speed points
  (2.4% evasion) and Gritty 4 Limit points (a starting charge of 1), those two in every tier. Node II gives +8 × the tier
  to her calling's channel's defense: DEF for a Brawler, Spell Blade or Paladin calling, M.DEF for a Mage, Summoner or
  Cleric one. Both count whatever class she fights as ([loops](loops.md#extra-stats-and-gear)).
- **Her trade** (PP2): her calling names her trade, one material line's three Wilds places: the Brawler Metal, the Spell
  Blade Wood, the Paladin and the Cleric Vegetables, the Summoner Fish, the Mage Stone
  ([loops](loops.md#craft-level)).
- **Nothing else moves:** a template adds no damage kind, lean, hand or rule, and never takes anything away.

The template's chip and card and the calling pick card are on the Uma sheet ([sections](sections.md#stable)); the Stable
filters by calling, stride, knack, signature and trade.

## Weapons

Ten weapons: five **Arms**, each its own physical kind, and five **Tomes**, each dealing its element. A kind has one
shape on the Brawler's and the Mage's trunks and A lines and on the Summoner's summons:

| Kinds | Shape |
|---|---|
| Greatsword, Fire | One foe, one to three heavy hits |
| Axe, Ice | Every foe |
| Lance, Lightning | Random foes |
| Bow, Light | One foe, many hits |
| Katana, Dark | One foe, two hits |

The Spell Blade's skills all strike one foe, her kinds differing only in their hits; the healers' skills each strike one
foe once; an Attack is one hit on one foe. A line B can change the shape
([skill trees](skill-trees.md#the-lines-at-a-glance)). A Paladin's or a Cleric's skills with a weapon carry its healer
status: her blows on the foe they hit, her spells on every Uma.

**Twins:** each Arm has a twin element: Greatsword and Fire, Axe and Ice, Lance and Lightning, Bow and Light, Katana and
Dark; the Bow and the Katana together are **Twilight**. The twin sets are what the Rift's fronts draw, what a Hall's seat
reads ([heroes](heroes.md#learners)) and how a hybrid's preset places an Orb or a Bell; the world's stages deal each foe
her own list ([combat](combat.md#weaknesses-shields-and-breaks)).

**Colors** (D234): every kind has its own color on screen, each Arm beside its twin: Fire red, Ice blue, Lightning
yellow, Light pale gold, Dark violet; Greatsword orange, Axe purple, Lance green, Bow jade, Katana rose.

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

The table's **Shape** is the kind's shape above: no Tier 1 skill hits "one other" foe, so a Katana or Dark skill lands
its two hits on one foe.

**Three weapon slots, by channel (CP2).** A class has three slots, each an **Arms** or a **Tome** slot, the lead channel
first: a Brawler three Arms, a Mage three Tomes, a Spell Blade and a Paladin two Arms and a Tome, a Summoner and a Cleric
two Tomes and an Arm. Every class picks: any kind of a slot's channel fits it, three different kinds, and swaps within a
channel are free. The weapon in each slot opens its tree. A class she hasn't set up holds its three defaults (the
presets below). When she stops slotting a kind, her equipped skills of its tree leave her loadout (a loadout left empty
goes back to auto); her line on that tree stays.

**Each weapon has a grade** (WP2, FL4), G0 to G10, raised with Arms Gems for an Arm and Tome Ink for a Tome; grade g
opens at Uma Lv 5g − 4. G0 opens the tree with no Might, and each grade's Might joins her offense on the hits made with
that weapon ([materials](materials.md#gear)). The grade belongs to the weapon, so it serves every class that slots it.

### Armor and the accessory

**Armor:** five slots, head, body, legs, arms and feet, each at a grade raised with Armor Fittings and each adding its
stat (DEF, HP, MP, M.DEF, Speed). Every piece also adds offense to her class's half: ATK for a Brawler, a Spell Blade or
a Paladin, M.ATK for a Mage, a Summoner or a Cleric, so switching class switches it.

**One accessory slot** (WP19, D212, D223): its grade, raised with Accessory Settings, and its family, a setting changed
freely outside fights; G0 does nothing. The four families:

- **Pendant:** flat offense on each of her three weapons' kinds.
- **Orb:** flat offense on one kind, one of her three weapons' kinds.
- **Bell:** after an act with an Attack in it, her weapon of its kind strikes once more; one of her weapons' kinds.
- **Insignia:** her hits on sub-bosses and bosses hit harder.

Values are in [materials](materials.md#gear) and how they reach a hit in [combat](combat.md#damage). The slot is hers, not
her class's: after a class or weapon switch, an Orb or a Bell left on a kind she no longer slots stays set, and its card
says so. She sets it on the Gear tab's Equip view: four cards of one shape, her ★ signature family first.

### Standard presets

**Each class has one (D164, WP25).** "Use standard preset", on the Gear tab's Equip view, puts her active class on its
three default weapons (the owner's, CP3) and sets her accessory slot's form: her ★ signature family, an Orb or a Bell on
her first weapon's kind (a Spell Blade's or a Summoner's on the kind of her lead half that twins her lone weapon: the
Spell Blade's Lance, the Summoner's Light), a Pendant or an Insignia with none. When her family is already the class's
own, she gets the class's form below. Grades don't move and nothing is spent. Her lines stay; her equipped skills of a
tree the preset takes out of her slots leave her loadout.

<!-- live:presets -->
| Class | Weapons | Armor | Accessory |
|---|---|---|---|
| Brawler | Greatsword, Axe, Lance | Physical | Bell (Greatsword) |
| Mage | Fire Tome, Blizzard Tome, Thunder Tome | Magical | Pendant |
| Spell Blade | Katana, Lance, Thunder Tome | Physical | Pendant |
| Cleric | Light Tome, Blizzard Tome, Bow | Magical | Orb (Blizzard Tome) |
| Summoner | Dark Tome, Light Tome, Bow | Magical | Orb (Light Tome) |
| Paladin | Greatsword, Axe, Light Tome | Physical | Pendant |
<!-- /live -->

The table's **Accessory** is the class's own form, which the balance simulation wears. The defaults pair up: the
Brawler's and the Mage's are the ring (Fire, Ice and Lightning's twins, one channel each); the Spell Blade, the Summoner
and the Cleric each hold one twin set in both channels (Lance and Thunder Tome; Bow and Light Tome; Bow and Light Tome);
the Paladin keeps her Barriers, Aegis and Enfeeble on the Greatsword and the Axe and her revive on the Light Tome. A
party of the five fight types on defaults holds all ten kinds with either healer. The Rift's fronts suggest guided
weapons on top of them ([loops](loops.md#the-rift)).

## Skills: depths, lines and ranks

- **Five depths a tree, eight nodes** (CP13, CP18). Depths 1 and 2 are the **trunk**, always hers. At depth 3 the tree
  **forks** into **line A** and **line B** (the Skills tab calls them branches), and her line runs on through depths 4
  and 5.
- **Nothing is learned and nothing costs points** (CP14). A depth opens when her **Class Rank** in that class reaches
  its gate (D102, CP16), and every node there on her path is hers at once.
- **Line A is the default; line B is a sidegrade with its own name** (Combo, Impale, Pierce, Heavy…; every tree's is in
  [skill trees](skill-trees.md#the-lines-at-a-glance)). She takes B, or A again, free at any time; her equipped skills
  follow in place (with Rend equipped, taking Combo puts Rending Combo in its slot). A line sits on any kind of her
  class's trees, slotted or not.
- **Skill Ranks** (CP32): every skill she holds is Rank 1 when its depth opens and gains a rank every 2 Class Ranks, up
  to Rank 5, on its own. A rank scales its power, and a healer's mend and Barrier shares, ×0.95 to ×1.05; MP, hits,
  targets and statuses never change. A line swap keeps the ranks: they read her Class Rank.
- **Pierce** (CP42): the Spell Blade's line B on every tree, the Brawler's Katana B and the Mage's Dark B land one hit
  that ignores the halving a standing shield gives ([skill trees](skill-trees.md#pierce)).

<!-- live:depths -->
| Depth | Line | Opens at | Ranks 2–5 at Class Rank | Single-target power, Rank 1 → 5 | Full-turn MP |
|---|---|---|---|---|---|
| 1 | Trunk | Class Rank 1 | 3, 5, 7, 9 | 1.52 → 1.68 (1.6 at Rank 3) | 10 |
| 2 | Trunk | Class Rank 10 | 12, 14, 16, 18 | 2.09 → 2.31 (2.2 at Rank 3) | 14 |
| 3 | The fork: A or B | Class Rank 20 | 22, 24, 26, 28 | 2.76 → 3.05 (2.9 at Rank 3) | 18 |
| 4 | Her line, A or B | Class Rank 30 | 32, 34, 36, 38 | 3.52 → 3.89 (3.7 at Rank 3) | 22 |
| 5 | Her line, A or B | Class Rank 40 | 42, 44, 46, 48 | 4.37 → 4.83 (4.6 at Rank 3) | 26 |
<!-- /live -->

**Equipped skills:**

<!-- live:active-slots -->
3 equipped skills at Lv 1, one more at Lv 10, 20, 30, 40 (7 at most). No points and no side skills: every skill on her path is hers at its depth's Class Rank, and ranks up every 2 Class Ranks (×0.95 at Rank 1 to ×1.05 at Rank 5).
<!-- /live -->

She equips skills she holds on the trees of her three slotted weapons; her Uma Level sets how many. Until you pick, the
auto loadout takes each slotted tree's deepest held skill in turn, then the next deepest (a hybrid's Arms and Tomes
alternating, the channel with two slots first). "Back to auto" returns to it. Every skill is listed in
[skill trees](skill-trees.md).

## Limit Breaks

A class has no Limit Break of its own: she has one only as a **Hero** (her seat's) or a **Learner** (either of her
Heroes'), from the Halls of Heroes ([heroes](heroes.md)). The class she fights as sets its power: the table's Limit Break
power × the single-target power of her open depth (the deepest depth her Class Rank opens), never her Skill Ranks. The
gauge and a Limit Break's support are in [combat](combat.md#limit-breaks).

## Ranks and levels

Four bars grow an Uma (D102). Nothing is trained and no token is spent, and gear has no ranks: a slot's grade is what she
wears ([materials](materials.md#gear)).

| Bar | Range | Rises with | Opens |
|---|---|---|---|
| **Uma Level** | 1–50 | Every won fight | Her stats, equipped skills (3 → 7), the grades her gear can reach (G g at Lv 5g − 4) and the Extra Stats nodes she can open |
| **Class Rank**, per class | 1–50 | Won fights as that class (2E for her E Uma EXP) | That class's depths at Rank 1, 10, 20, 30, 40; a Skill Rank every 2 Class Ranks; her Limit Break's depth; her base MP regen, a step a depth |
| **Craft Level** | 1–50 | Her work in the Wilds | The grades she can gather, process and make ([loops](loops.md#craft-level)) |
| **Bond**, per Hall seat | 0–10 | Won world fights as a Learner, or a Hero of that seat | A Learner's Limit Break strength, 50% to 100% ([heroes](heroes.md#bonds)) |

Curves, EXP per win and Class Marks are in [loops](loops.md#ranks). A Lv 1 Uma can reach any Class Rank: there are no
caps between bars.
