# Class Progression: the six classes from Tier 1 to Tier 3

> **Authored 2026-10-23, for the owner's review. Nothing here is built.** The first standalone doc of the Tier rework
> ([README §5](README.md#5-cross-reference-then-review), step 3.1). It absorbs [classes.md](classes.md) and
> [skill-trees.md](skill-trees.md), which stay as history, and supersedes every CL and SK call ([§16](#16-decisions)
> maps each one). Calls are **CP1–CP31**, each with a recommendation. No open questions.
>
> **Owner change, 2026-10-23: strikes are dropped.** "I think I want to overall keep the 10 weapon types as damage types,
> and still allow for some small variety." Heavy, Flurry and Area are gone as a weakness axis, a slot type and a word.
> The ten kinds (five Arms, five Tomes) stay the damage and weakness types, as today; each weapon keeps its own shape
> inside its tree (a Bow's many hits, an Axe's reach), which is the small variety. Slots follow the channel only; foes
> are weak to kinds ([§4](#4-foe-weaknesses-by-tier)).
>
> **Values** follow SB1 ([README §2.5](README.md#25-the-stat-budget-sb1-working-rule-2026-10-23)): every flat build
> value is its Tier 1 value × 1, × 1.8 or × 2.6.
>
> **Pages** (full desktop, light and dark): [overview, composition and the calling pick](previews/class-overview.html) ·
> [template sheets, equippable weapons, Lv 50 stats](previews/class-templates.html) ·
> [the tree viewer](previews/class-trees.html) · [foe weaknesses and coverage](previews/class-weaknesses.html).
>
> **Interfaces, not designed here:** weapon forms and materials (weapon-progression.md), Extra Stats
> (extra-stats-progression.md), professions (profession-progression.md), Uma Templates (a later pass: their two slots
> are marked, not filled).

## The owner's points

| The owner's point | Answered in |
|---|---|
| A standalone, detailed doc for Class Progression: class templates, equippable weapons, class trees | This doc; [§3](#3-weapons-three-slots-and-what-fits-them), [§5](#5-the-class-template-per-tier), [§6](#6-the-class-trees) |
| Simplify Tier 1's baseline class facts | [§0](#0-at-a-glance), [§5.3](#53-tier-1s-complexity-today-and-proposed) |
| Every class starts with 3 weapon slots, with defaults that keep every party balanced for every battle | [§3.1](#31-three-slots-by-channel-cp2), [§3.2](#32-the-default-weapons-cp3), [§4.5](#45-balanced-checked-cp4) |
| Rework Tier 1 foes' weaknesses | [§4.1](#41-tier-1-her-twins-cp5) |
| Are bosses weak to types rather than weapons? Split physical and magical? (2026-10-22) | Answered by the owner's change: kinds, not types ([§4](#4-foe-weaknesses-by-tier)); bosses keep one Arm and one element in every tier, so both channels always answer them ([§4.2](#42-tiers-2-and-3-the-list-narrows-by-rank-cp6)) |
| Keep the 10 weapon types as damage types, with some small variety (2026-10-23) | [§3](#3-weapons-three-slots-and-what-fits-them), [§4](#4-foe-weaknesses-by-tier), the weapon shapes in [§6.5](#65-every-classs-trees) |
| Show every class's trees, and the class composition | [§6](#6-the-class-trees), [§2.3](#23-one-healer-a-party-and-the-party-shapes); [trees](previews/class-trees.html), [overview](previews/class-overview.html) |
| The class template sheet per tier: weapons, armors, accessories | [§5](#5-the-class-template-per-tier), [templates](previews/class-templates.html) |
| What other dimensions class selection affects | [§11](#11-what-class-selection-affects) |
| Trees incremental by tier, a real tree with real options, no side-point asymmetry (first round) | [§6](#6-the-class-trees) |
| Pace and Late: maybe choose between Mage and Spell Blade, once at Lv 1, on the Uma sheet (2026-10-22) | [§10](#10-the-calling-pick) |
| Stat growth mustn't drift across tiers (SB1, 2026-10-23) | [§9](#9-class-stats-at-lv-50-under-sb1) |

## 0. At a glance

| | Today (every tier) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| **Classes** | 6, switched freely | 6, switched freely | + a **specialization**, one of two a class | + a **mastery**, one a class |
| **Weapon slots** | 5: Brawler 5 Arms, Mage 5 Tomes, the others 3 + 2 | **3, by her class's Arms count:** 3 · 0 · 2 · 1 · 2 · 1 | 3 | 3 |
| **A slot takes** | Brawler, Mage: fixed; others any kind of the slot's channel | Any kind of the slot's channel, three different kinds | The same; a weapon's form may add a kind (weapons doc) | The same |
| **Foes weak to** | 2–5 kinds, half drawn at random | **2: one Arm and its twin element**, every foe | Regulars **1**; sub-bosses and bosses 2 | Regulars and sub-bosses 1; **bosses 2** |
| **Armor** | 5, a half per piece | 5, her class's half | 5, per piece for the four between | The same |
| **Accessories** | 2: Damage, Support | 1: Support | 2: + Damage (an Orb) | 3: + a second Support |
| **Trees she uses** | 5 (of 5 or 10) | 3 | 3 | 3 |
| **Nodes a tree** | 15 | 8 | 14 | 17 |
| **Picks a class** | 25 forks and a 50-point budget | 3 | 6 | 9 |
| **Skills held · equipped** | Up to 50 · 3 → 10 | 15 · 3 → 7 | 15 · 3 → 10 | 30 · 10 and a master slot |
| **Depth gates (Class Rank)** | 1, 10, 20, 30, 40; sides 5 … 45 | 1, 10, 20, 30, 40 | The same | + 50 |
| **Her tree's root** | — | Class, ★ Flourish slot | + specialization | + mastery |
| **Limit Breaks** | Six halls, 24 | The same | + LB+ at Bond 10 | The same |
| **Her calling** | Running style | U4's rule, and **a one-time pick** for Pace and Late Umas | Kept | Kept |
| **Build values** | Flat | Tier 1's | × 1.8 | × 2.6 |

## 1. Today

Classes v2 (D160, live since H61, D188). Manual: [classes](../../game/classes.md), [skill trees](../../game/skill-trees.md),
[heroes](../../game/heroes.md), [combat](../../game/combat.md). Design: [classes-v2](../classes-v2.md) (D186–D188),
[tiers](../tiers.md), [tier2-classes](../tier2-classes.md), [the Rift](../rift.md) §5.

| Piece | Today |
|---|---|
| Classes | Six, free switching, one healer a party (C8, D178) |
| Weapon slots | Five. Brawler all five Arms and Mage all five Tomes, fixed. Spell Blade and Paladin 3 Arms + 2 Tomes, Summoner and Cleric 3 Tomes + 2 Arms, each slot picked within its channel (`rules.ts` `RPG_CLASS_SLOTS`) |
| Trees | One per class and weapon kind: 50, 750 nodes (`catalog.ts`). Five depths, a core and sides A and B at each; sides cost points |
| Foe weaknesses | Arms: 2 drawn at random for regulars and elites, 1 for bosses, 3 for a Light + Dark foe. Elements: what beats her signature on the ring, minus her own; a regular with one answer gets a random second (`world/world.ts`) |
| Rift fronts | Iron 1 Arm a foe; Arcane 2 elements (1 for a boss); Duel 1–2 Arms and 1–2 elements, locks mixed; Horde one Arm and one element a foe |
| Starting class | Running style: Front Brawler, Pace Mage, Late Paladin (Power > Wit) or Cleric, End Summoner; never a Spell Blade (D162, D180) |
| Limit Breaks | Only from the six Halls of Heroes: 24 seats (D112, D181) |

## 2. The six classes

### 2.1 Who they are (CP1)

The six classes stay the six in every tier, with classes v2's identities: the Brawler all physical, the Mage all
magical, the two hybrids 70/30 each way as a mirror, two healers who act at half hand, one healer a party.

| Class | Fight type | Weapon slots | Damage split | Role in a party | Hand: an act, MP | Limit Break power | Her calling (U4) |
|---|---|---|---|---|---|---|---|
| **Brawler** | Physical | 3 Arms | 100 / 0 | Raw physical burst: one foe hard, or a crowd with her Axe | ×1, MP ×1 | 2× | Front runners; Pace sprinters with Power over Wit |
| **Mage** | Magical | 3 Tomes | 0 / 100 | Raw magic; the element ring | ×1, MP ×1 | 2.4× | Pace chasers, Wit at or over Power, **or picked** ([§10](#10-the-calling-pick)) |
| **Spell Blade** | Physical hybrid | 2 Arms + 1 Tome | 70 / 30 | The shield chipper: every act a blade and a spell, the blade landing one extra hit | Arms ×0.72 + Tome ×0.44; MP ×0.5 a half | 2.2× | Pace chasers, Power over Wit, **or picked** |
| **Summoner** | Magical hybrid | 1 Arm + 2 Tomes | 30 / 70 | Crowds: her Tome summon lingers and strikes every foe in farewell. No support | Tome ×0.58 + Arms ×0.56; MP ×0.5 a half; the farewell on top | 2.2× | End closers; Wit-led closers |
| **Paladin** | Healer | 2 Arms + 1 Tome | Half hand | Barriers, Aegis, debuffs, Valkyrie's Oath; heals from ATK | ×0.5, MP ×0.6 | 1.5× | Late surgers, Power over Wit, **or picked** |
| **Cleric** | Healer | 1 Arm + 2 Tomes | Half hand | Mends, Regen, drain, Rebirth; heals from M.ATK | ×0.5, MP ×0.6 | 1.5× | Late surgers, Wit at or over Power, **or picked** |

### 2.2 The hands and leans (CP9)

Unchanged by this doc (H63, D187); the Tier 1 simulation re-checks them on the full template.

| Class | HP | ATK | M.ATK | DEF | M.DEF | MP | Hand |
|---|---|---|---|---|---|---|---|
| Brawler | ×1.15 | ×1.1 | ×0.9 | ×1.1 | ×0.9 | ×0.8 | ×1 |
| Mage | ×0.9 | ×0.9 | ×1.15 | ×0.9 | ×1.1 | ×1.3 | ×1 |
| Spell Blade | ×1 | ×1.1 | ×0.95 | ×1 | ×1 | ×1 | Arms 0.72 + Tome 0.44 (1.16 a turn), extra hit on the Arms half |
| Summoner | ×1 | ×0.95 | ×1.1 | ×1 | ×1 | ×1 | Tome 0.58 + Arms 0.56 (1.14), farewell on every foe |
| Paladin | ×1 | ×1 | ×0.8 | ×1.15 | ×1 | ×1.3 | 0.5; mends and Barriers from ATK |
| Cleric | ×1 | ×0.8 | ×1 | ×1 | ×1.15 | ×1.3 | 0.5; mends and Barriers from M.ATK |

- **The 70/30 pair on 2 + 1.** Every act is still one Arms half and one Tome half; the hands set the split, not the
  slot count. Her lead half picks between two trees, her minor half draws on one. Auto alternates lead, minor, lead.
- **The mirror** (XR5, kept): on the full template (three weapons, one Support, the full Extra Stats map) the Spell
  Blade and the Summoner deal equal damage a turn within ±5%, each 70/30 ± 5; the knob is the hands, the Summoner's
  Arms hand first, never the map. Paladin against Cleric sustain within ±10%.
- **The healers' 2 + 1 sharpens classes v2's split:** the Paladin's two Arms give Barriers and debuffs and her one Tome
  mends; the Cleric's two Tomes mend and buff and her one Arm Barriers.

### 2.3 One healer a party, and the party shapes

A party fights with one Paladin or Cleric at most (C8, D178); everything else is free. Five shapes carry the game:

| Shape | Members | Where | What it does |
|---|---|---|---|
| **The default party** | Brawler, Mage, Spell Blade, Summoner, and a Paladin or a Cleric | The world | One of each fight type. On defaults it holds **all ten kinds** and at least two members answer every Tier 1 foe ([§4.5](#45-balanced-checked-cp4)) |
| **Iron** | 2 Brawler, 2 Spell Blade, Paladin | Rift: Arms only, elements warded | Every Arm in the party: Greatsword 3, Axe 2, Lance 3, Bow 2, Katana 2 |
| **Arcane** | 2 Mage, 2 Summoner, Cleric | Rift: elements only, Arms warded | Iron's mirror: Fire 2, Ice 2, Lightning 2, Light 3, Dark 3 |
| **Duel** | 2 Brawler, 2 Mage, Paladin | Rift: one boss, both channels | Burst in both channels; every twin set answered by 2–5 |
| **Horde** | 2 Spell Blade, 2 Summoner, Cleric | Rift: waves | Multi-hit and farewells; every twin set answered by 2–5 |
| Five of one class | Any | Anywhere | Allowed. On defaults five copies hold the same three kinds; spread picks (each a different three) answer every twin set three times |

The guided parties are the Rift's (rift §5, D178 point 5), unchanged. The page draws each with its coverage
([overview](previews/class-overview.html#shapes)).

### 2.4 Fight types across the roster

Today's 270 outfits by calling (variance U4): physical 61 (22.6%), physical hybrid 56 (20.7%), magical 46 (17.0%),
magical hybrid 46 (17.0%), healer 61 (22.6%), which professions' trades rely on (PR1). The calling pick
([§10](#10-the-calling-pick)) lets 102 Pace Umas move between physical hybrid and magical, each anywhere from 0 to
37.8%; the Late pick moves no fight type (both choices are healers).

## 3. Weapons: three slots and what fits them

### 3.1 Three slots, by channel (CP2)

- **Every class has three weapon slots, in every tier.** Depth comes from forms, trees and Extra Stats, never more slots.
- **A slot has a channel, nothing else.** The class sets how many are Arms:

  | Class | Arms slots | Tome slots | Spreads to choose from | Today |
  |---|---|---|---|---|
  | Brawler | 3 | 0 | 10 (any three of five Arms) | 1 (all five) |
  | Mage | 0 | 3 | 10 | 1 |
  | Spell Blade, Paladin | 2 | 1 | 50 (10 Arms pairs × 5 Tomes) | 100 |
  | Summoner, Cleric | 1 | 2 | 50 | 100 |

- **Three different kinds.** Any kind of the slot's channel fits; a kind sits in one slot at a time.
- **The slot order** is the lead channel first (an Arms slot first for the Brawler, Spell Blade and Paladin, a Tome
  slot first for the others). The first slot names the Orb of the Tier 2 preset ([§5](#5-the-class-template-per-tier)).
- **What fills them** is the kind's own tree ([§6](#6-the-class-trees)): the weapon's shape (a Greatsword's heavy hit,
  a Lance's random thrusts) is the small variety the owner asked to keep.

### 3.2 The default weapons (CP3)

| Class | Slot 1 | Slot 2 | Slot 3 | Twin sets it answers ([§4.1](#41-tier-1-her-twins-cp5)) | Today's five (v2) |
|---|---|---|---|---|---|
| **Brawler** | Greatsword | Axe | Katana | Fire, Ice, Dark; Twilight | All five Arms |
| **Mage** | Fire Tome | Thunder Tome | Light Tome | Fire, Lightning, Light | All five Tomes |
| **Spell Blade** | Lance | Bow | Dark Tome | Lightning, Light, Dark; Twilight | Greatsword, Lance, Katana, Fire, Thunder |
| **Summoner** | Blizzard Tome | Dark Tome | Greatsword | Ice, Dark, Fire | Fire, Blizzard, Thunder, Greatsword, Lance |
| **Paladin** | Greatsword | Lance | Blizzard Tome | Fire, Lightning, Ice | Greatsword, Axe, Lance, Blizzard, Fire |
| **Cleric** | Light Tome | Dark Tome | Axe | Light, Dark, Ice | Light, Dark, Thunder, Katana, Bow |

**The pattern,** what makes every shape balanced on defaults:
- **The Brawler and the Mage share one twin set (Fire) and between them answer all five,** so the Duel's two classes
  answer every boss.
- **The Spell Blade's Arms are the two the Brawler doesn't hold** (Lance, Bow), so the Iron party holds every Arm.
  **The Summoner's Tomes are the two the Mage doesn't hold** (Blizzard, Dark), so the Arcane party holds every
  element. Iron and Arcane are exact mirrors: 3 · 2 · 3 · 2 · 2 against 2 · 2 · 2 · 3 · 3, twelve each.
- **The Spell Blade's Tome (Dark) and the Summoner's Arm (Greatsword) close the Horde's five.**
- **The healers keep their classes v2 specials:** the Paladin's Aegis (Greatsword), Valkyrie's Oath (Lance's B branch)
  and her Barrier on every Uma (Blizzard), three of her four (CL4's set, kept); the Cleric's Regen and Rebirth (Light),
  drain (Dark) and an Axe blow that Enfeebles (CL4's Axe, kept).
- **All ten kinds** sit in the five fight types' defaults with either healer.

**Why each, for the class itself:**
- **Brawler:** her first tree (Heavy Slash) on the Greatsword, her crowd answer on the Axe, the Katana's twin cuts; every
  shape she needs, one act a turn at full power.
- **Mage:** a nuke (Fire), random bolts that reach several foes (Thunder), a many-hit spell that chips (Light). Her
  every-foe spell is one pick away (Blizzard for Light or Thunder).
- **Spell Blade:** every default multi-hits (Lance 2–3, Bow 2–4, Dark 2), and her Arms half adds one more: the fastest
  chipper, her identity.
- **Summoner:** her lead summon reaches every foe and lingers for the farewell (Blizzard); her Dark summons strike twice
  and carry the Warlock's curse in Tier 2; her Greatsword is the knight line (Squire to Sword Saint).

**Alternatives:** the first round's CL4 (strike-typed, retired with the strikes); the ring for both pure classes
(Brawler Greatsword, Axe, Lance with Mage Fire, Blizzard, Thunder), which leaves the Light and Dark twin sets to the
Paladin alone in the Duel (one chipper) and none in five of the world's Light and Dark signatures; today's spreads cut
to their first three (Iron holds three Arms, Arcane three elements).

### 3.3 Equippable kinds, per tier (CP12)

Every class can slot every kind of its channels in every tier. What changes per tier is the weapon, not the slot.

| Class | Arms slots take | Tome slots take | Extra kinds a form adds count (Tier 2 Dual; Tier 3 Prism, Tempered) |
|---|---|---|---|
| Brawler | Greatsword, Axe, Lance, Bow, Katana | — | Arms kinds only |
| Mage | — | Fire, Blizzard, Thunder, Light, Dark | Elements only |
| Spell Blade, Paladin | Any two Arms | Any one Tome | Any of the ten |
| Summoner, Cleric | Any one Arm | Any two Tomes | Any of the ten |

- **Tier 1:** a weapon is one kind, its tree and its grade's Might.
- **Tier 2:** at G5 a weapon takes a form (Dual: a second kind; Pure: harder weak hits). The **slot doesn't change**: a
  Dual stays in its first kind's slot and channel and opens its first kind's tree; its second kind is coverage, under
  GE7's channel rule (a Brawler's Greatsword + Fire hits as a plain Greatsword).
- **Tier 3:** the second fork (Prism, Tempered, Keen). The same slot rules.
- Forms are the weapons doc's; this doc owns which kinds fit which class's slots, and the rule above for extra kinds.

The [templates page](previews/class-templates.html#matrix) draws the matrix (class × slot × kind, defaults marked).

### 3.4 Switching class, and what it costs

- **Free, as today**, outside fights. Each class keeps its own three weapons, picks and loadout.
- **Gear follows her:** she owns every kind, and armor and accessory grades sit on the slot (XR6). A new class costs only
  the weapons of its three she hasn't raised: 0–30 Weapon Gems.
- **From the defaults**, the classes share: Brawler–Paladin, Brawler–Summoner (Greatsword), Brawler–Cleric (Axe),
  Mage–Cleric (Light), Spell Blade–Paladin (Lance), Spell Blade–Summoner and Spell Blade–Cleric and Summoner–Cleric
  (Dark): one shared weapon, two to raise (20 gems). **Summoner–Paladin share two** (Greatsword, Blizzard: 10 gems).
  Brawler–Mage, Brawler–Spell Blade, Mage–Spell Blade, Mage–Summoner, Mage–Paladin and Paladin–Cleric share none (30).
- **The five fight types' defaults are the ten kinds:** a roster that raised one Uma of each type raised every kind once.

## 4. Foe weaknesses by tier

The ten kinds are the weakness types. A foe's card shows her kinds as icons, nothing else: "Weak: [Lance] [Thunder]".

### 4.1 Tier 1: her twins (CP5)

**Twins** are an Arm and the element that share a shape in the catalog (`RPG_KIND_PAIRS`, D86): **Greatsword and
Fire, Axe and Ice, Lance and Lightning, Bow and Light, Katana and Dark.** A twin set is named by its element: "the
Lightning twins" are the Lance and the Thunder Tome.

**A Tier 1 foe is weak to one twin set: the element that beats hers on the ring, and its twin Arm.**
- **The ring,** today's: Fire > Ice > Lightning > Fire; Light ⇄ Dark. A Fire foe is weak to Lightning and the Lance; an
  Ice foe to Fire and the Greatsword; a Lightning foe to Ice and the Axe; a Light foe to Dark and the Katana; a Dark foe
  to Light and the Bow.
- **Two elements:** she reads her lead element first (a pair signature's lead alternates by slot, W3); if its answer is
  one of her own, her second. A Fire + Lightning foe answers to Ice either way; an Ice + Light foe to Fire (lead Ice) or
  Dark (lead Light).
- **Light and Dark together** answer to no element: she's weak to the Arms of her own two, **the Bow and the Katana**
  ("Twilight"), as today's Light + Dark foes break on weapons alone.
- **Every foe, every rank:** regulars, sub-bosses, bosses and the capitals' Finals. Two kinds, one in each channel, one
  rule. Today: 2–5 kinds, half drawn at random, five rules.

**Over the world's 19 biomes and 48 signatures** (a pair's two leads count a half each): the Fire twins answer 11,
the Ice twins 11, the Lightning twins 9.5, the Dark twins 8, the Light twins 6.5, Twilight 2. The
[weaknesses page](previews/class-weaknesses.html#biomes) lists every biome.

**Why twins:** the Arm is read from the element, so one ring teaches both channels; each channel always has an answer
on every foe; a hybrid holding a twin set (a Lance and a Thunder Tome) lands both halves weak.

### 4.2 Tiers 2 and 3: the list narrows by rank (CP6)

| Foe | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Regulars** and the elites' Keys | Her twins (2) | **One of them** | One |
| **Sub-bosses** | Her twins | Her twins | **One of them** |
| **Bosses** | Her twins | Her twins | Her twins |

- **Which one:** the channel her weaker defense guards, read from her role (on her card). **Strikers and guards** (DEF
  above M.DEF) are weak to **her element**; **casters and skirmishers** (DEF at or below M.DEF) to **her Arm**. A
  Twilight foe keeps the Arm of her lead element (Light: Bow; Dark: Katana).
- **Bosses keep both in every tier,** so every Uma, of any class, can answer a boss with the right weapon in one slot.
- **The narrowing is Tier 2's and 3's depth:** a party covers kinds by its make-up and picks, and the weapons doc's
  Dual (a second kind) and Prism answer it; Pure and Keen pay off on the single kinds.
- **Regions lean:** 7 biomes are all casters or skirmishers (Arm-weak: Coast, Swamp, Geyser Basin, Storm Peaks,
  Highlands, Sky Isles, Haunted Moor), 5 all strikers or guards (element-weak: Desert, Canyon, Tundra, Glacier, Ancient
  Ruins), 7 mixed. In Tier 2 a party for the Coast brings Arms; one for the Canyon brings Tomes. Bosses keep both.
- **The ring and the twins don't change:** a Tier 3 foe's one kind is still from her Tier 1 twins.

### 4.3 The Rift's fronts (CP7)

The fronts draw their kinds by the run's seed, from the front, never the face, as today; a foe's own element is never
her weakness. Today's counts stay in Tier 1, drawn as twins where both channels count.

| Front | Ward | Tier 1 | Tier 2 | Tier 3 | Guided party |
|---|---|---|---|---|---|
| **Iron** | Elements ×0.5 | One Arm a foe (today's, H51) | The same | The same | 2 Brawler, 2 Spell Blade, Paladin |
| **Arcane** | Arms ×0.5 | Two elements a foe, one for a boss (today's) | One a foe | The same | 2 Mage, 2 Summoner, Cleric |
| **Duel** | — | The boss's twins: two sets at stages 1–6, one at 7–12 (today's counts) | One set | One set | 2 Brawler, 2 Mage, Paladin |
| **Horde** | — | Each foe a twin set; a wave repeats none until all five are used | Keys one kind (by role); leaders their twins | Keys and sub-boss leaders one kind; boss leaders twins | 2 Spell Blade, 2 Summoner, Cleric |

Drawing the Duel's and the Horde's kinds as twins is the one change in Tier 1: today's independent draws can ask the
Duel party for a Bow and a Dark Tome, which none of its defaults hold.

### 4.4 Locks and shields (CP8)

- **Locks, today's rule:** a charged move's 2–4 locks are kinds drawn from her weaknesses; every hit of a lock's kind
  breaks one. The Duel's sets stay mixed (Arms, element, Arms …, v14). With twins every Tier 1 lock set is answerable
  by both channels. No engine change.
- **Shields:** today's (regular 2–3, sub-boss 6, boss 8; Rift by front), and Tier 2's +1 (tier2-world Z2). The strikes'
  shield rule (CL9) goes with the strikes.
- **The simulation's knob** ([§15](#15-pacing)): an Uma on defaults answers about 60% of Tier 1 foes (Brawler 67%,
  Paladin 66%, Summoner 63%, Mage 56%, Spell Blade 54%, Cleric 53%) where today's five weapons answer nearly all, so
  Breaks come slower. The simulation re-sets shields so rounds to the first Break stay within ±0.5 of today's; the
  draft is sub-boss 6 → 5 and boss 8 → 6, regulars unchanged.

### 4.5 Balanced, checked (CP4)

**Four tests, each a script over the defaults and the generator, before any fight:**

1. **The five fight types' defaults hold all ten kinds,** with a Paladin or with a Cleric. ✓ both.
2. **The default party has at least two members who answer every Tier 1 foe.**
3. **Each Rift front's guided party has at least two members who answer each of its foes,** on defaults.
4. **Any Uma, of any class, can answer any foe's twins with one pick** (a kind of her channel in one slot). ✓ by CP2.

| Twin set (Tier 1) | Signatures | Default party + Cleric | Default party + Paladin | Duel party | Horde party |
|---|---|---|---|---|---|
| Fire: Greatsword, Fire | 11 | 3 | 4 | 5 | 2 |
| Ice: Axe, Ice | 11 | 3 | 3 | 3 | 3 |
| Lightning: Lance, Lightning | 9.5 | 2 | 3 | 3 | 2 |
| Light: Bow, Light | 6.5 | 3 | 2 | 2 | 3 |
| Dark: Katana, Dark | 8 | 4 | 3 | 2 | 5 |
| Twilight: Bow, Katana | 2 | 2 | 2 | — (the Rift draws a twin set) | 2 |

| One kind (Iron, Arcane) | Greatsword | Axe | Lance | Bow | Katana | Fire | Ice | Lightning | Light | Dark |
|---|---|---|---|---|---|---|---|---|---|---|
| Iron party | 3 | 2 | 3 | 2 | 2 | — | — | — | — | — |
| Arcane party | — | — | — | — | — | 2 | 2 | 2 | 3 | 3 |

**Every cell is at least two.** ✓ tests 2 and 3.

**In Tiers 2 and 3**, single kinds: the default party holds every kind at least once (with a Cleric: Greatsword 2, Axe 2,
Lance 1, Bow 1, Katana 1, Fire 1, Ice 1, Lightning 1, Light 2, Dark 3), so every regular is answerable on defaults; two
members is a pick or a Dual away. Bosses keep their twins, so tests 2 and 3 hold for them as in Tier 1. Iron's and
Arcane's single kinds are the table above. The Tier 2 Horde's keys ask its party to cover the Katana, Fire and
Lightning by picks or Duals: that's Tier 2's planning, and its Rift prices it.

**Win rates** stay the simulation's ([§15](#15-pacing)).

### 4.6 Alternatives considered

| Model | Tier 1 | Tiers 2–3 | Why not |
|---|---|---|---|
| **Twins, narrowing by rank** (recommended) | One Arm and its twin element | Regulars to one (Tier 2), sub-bosses too (Tier 3); bosses keep both | — |
| One kind a foe from Tier 1 | One kind, by role | The same | With three weapons a kind sits in one to three of five default members: Tier 1 couldn't promise two answers, and the pure classes miss half of every region |
| The ring's element and a drawn Arm (today's spirit) | Two, the Arm by seed | The same | The Arm can't be read from anything, and some draws leave a guided party without an answer (the Duel on Bow + Dark) |
| Twins in every tier | Twins | Twins | Tier 2 and 3 add nothing to plan; the forms (Dual, Pure, Keen) lose their job |
| Strikes, 3 → 6 → 10 | A strike | Strike × channel, then a kind | Withdrawn by the owner, 2026-10-23 |
| Today's lists | 2–5 kinds, half random | — | The complexity the rework removes |

## 5. The class template per tier

### 5.1 The template (CP10)

| | Tier 1 | Tier 2 | Tier 3 | Today |
|---|---|---|---|---|
| **Weapons** | 3, by the class's Arms count | 3 | 3 | 5 |
| **Armor** | 5 (head, body, legs, arms, feet), **her class's half**: physical for Brawler, Spell Blade, Paladin; magical for Mage, Summoner, Cleric | 5; Brawler physical, Mage magical, **the four between per piece** | As Tier 2 | 5, per piece |
| **Accessories** | **1: Support** (5 Talismans, 5 Amulets) | **2: + Damage**, an Orb of any of the ten kinds | **3: + a second Support**, a different type | 2 |
| **Class choice** | Her class | + a specialization, one of two | + a mastery, fixed | — |
| **Trees · picks** | 3 · 3 | 3 · 6 | 3 · 9 | 5 · 25 + points |
| **Equipped skills** | 3 → 7 (Lv 10, 20, 30, 40) | 3 → 10 | 10 and a master slot | 3 → 10 |

Grades are the weapons doc's (every slot G0–G10, worn at Uma Lv 5g − 4); the slots and what they hold are this doc's.

### 5.2 Every class's sheet (CP11)

**Tier 1** (the standard preset: these weapons, the armor half, this Support):

| Class | Weapon slots | Armor | Support (preset) |
|---|---|---|---|
| Brawler | Arms: Greatsword · Arms: Axe · Arms: Katana | Physical | Vampire Talisman |
| Mage | Tome: Fire · Tome: Thunder · Tome: Light | Magical | Siphon Amulet |
| Spell Blade | Arms: Lance · Arms: Bow · Tome: Dark | Physical | Vampire Talisman |
| Summoner | Tome: Blizzard · Tome: Dark · Arms: Greatsword | Magical | Siphon Amulet |
| Paladin | Arms: Greatsword · Arms: Lance · Tome: Blizzard | Physical | Thorn Talisman |
| Cleric | Tome: Light · Tome: Dark · Arms: Axe | Magical | Spring Amulet |

**Tier 2** adds the Damage slot (the preset's Orb is her first slot's kind), per-piece armor for the four between
(the preset still dresses her class's half) and a specialization ([§7.2](#72-specializations-tier-2-cp26)):

| Class | Orb (preset) | Armor | Specialization: preselected at Ascend · the other |
|---|---|---|---|
| Brawler | Greatsword Orb | Physical | Warlord if Speed ≥ Stamina · Berserker |
| Mage | Fire Orb | Magical | Sage if Wit ≥ Speed · Sorcerer |
| Spell Blade | Lance Orb | Per piece (preset physical) | Blademaster if Power ≥ Wit · Rune Knight |
| Summoner | Ice Orb | Per piece (preset magical) | Conjurer if Power ≥ Wit · Warlock |
| Paladin | Greatsword Orb | Per piece (preset physical) | Templar if Speed ≥ Stamina · Guardian |
| Cleric | Light Orb | Per piece (preset magical) | Bishop if Speed ≥ Wit · Oracle |

**Tier 3** adds a second Support (different from the first) and the mastery ([§7.3](#73-masteries-tier-3-cp27)):

| Class | Supports (preset) | Mastery |
|---|---|---|
| Brawler | Vampire Talisman, Iron Talisman | Unstoppable |
| Mage | Siphon Amulet, Veil Amulet | Resonance |
| Spell Blade | Vampire Talisman, Bulwark Talisman | Spellbind |
| Summoner | Siphon Amulet, Spring Amulet | Menagerie |
| Paladin | Thorn Talisman, Iron Talisman | Last Stand |
| Cleric | Spring Amulet, Ward Amulet | Overflow |

The [templates page](previews/class-templates.html) draws all eighteen sheets with their slots.

### 5.3 Tier 1's complexity, today and proposed

| What a Tier 1 player handles for one class | Today | Proposed |
|---|---|---|
| Weapons a class holds | 5 | **3** |
| Weapon spreads to choose from | Brawler, Mage 1; the others 100 | Brawler, Mage 10; the others 50 |
| Rules for what a foe is weak to | 5: random Arms lists, the ring, Light ⇄ Dark, a pair's answers minus her own, Light + Dark weapons only | **1: her twins** |
| Weak marks on a foe's card | 2–5 kinds | **2** |
| Finding her weak weapon | Match up to 5 marks against 5 weapons | Match 2 marks against 3 weapons |
| Armor | 5 halves to choose, 32 suits | **None:** her class's half |
| Accessories | 2 slots: 10 Orbs × 10 supports | **1 slot:** 10 supports |
| Loadouts a class can wear (weapons × armor × accessories) | Brawler 3,200; the others 320,000 | Brawler, Mage 100; the others 500 |
| Trees on her page · nodes | 5 or 10 · 75 or 150 | **3 · 24** |
| Picks · a skill currency | 25 forks · side points | **3 · none** |
| Charged-move locks | Kinds to match | The same: kinds, from her two |

## 6. The class trees

### 6.1 The rules every tier shares (CP13–CP17, CP21–CP23)

- **One tree per weapon slot, three a class** (CP13). The catalog stays one tree per class and kind (50 trees, today's
  ids); her three slots pick which three she uses. The page draws one **class tree**: a **root** (her class) and her three
  weapon trees under it.
- **A weapon tree** has a **trunk** (depths 1–2, always hers), a **fork** at depth 3 into **branches**, and each
  branch's **tip** (depth 5); Tier 3 adds a **capstone** (depth 6).
- **No skill points, at any tier** (CP14). Class Rank opens a depth, and every node at an open depth on her path is hers
  at once. A fork's branches are exclusive and free; **branch A is the default**; swaps are free outside fights and her
  equipped skills follow (with Rend equipped, taking Combo puts Rending Combo in its slot).
- **A fork changes what she's for** (CP15): reach (one foe, random foes, every foe, a splash), hits (count or weight; a
  pierce), support (a status's weight, who a mend or Barrier reaches, a revive) or Breaks. Never a few percent alone.
  **A** is today's core line, the anchor the simulation plays; **B** and **C** are sidegrades.
- **Class Rank gates only** (CP16): depth 1 at Class Rank 1, 2 at 10, 3 at 20, 4 at 30, 5 at 40, 6 at 50 (Tier 3). The
  side gates (5, 15 … 45) retire. A weapon's grade gates no skill.
- **Trees never add a damage kind** (CP17): a skill hits with its weapon's kinds (and from Tier 2 its form's extra kinds,
  under GE7). The Brawler stays physical whatever she picks.
- **Names** (CP21): today's catalog names, the strikes' renames (SK14) **reverted**: "Mystic Cleave Flurry" and "Heavy
  Rupture" keep their names. New nodes are named by rule ([§6.6](#66-new-nodes-by-rule)). The Summoner's Axe summons
  "Berserker" and "Jotun Warlord" become **Marauder** and **Jotun King** (A4: the specialization names), ids unchanged.
- **The Skills tab draws a real tree** (CP23, SK10's design): the root plate, three weapon tabs with a path glyph, the open
  tree as nodes and lines, her path filled, unheld branches dimmed, locked depths faded with their Class Rank; the points
  UI retires.

### 6.2 Tier 1: two branches (CP18)

```
D1 · CR 1      D2 · CR 10     D3 · CR 20 (fork)        D4 · CR 30          D5 · CR 40 (tip)
Heavy Slash ── Cleave ──┬── A  Sunder ─────────── Rend ────────────── Meteor Strike
                        └── B  Triple Sunder ──── Rending Combo ───── Meteor Combo
```

- **8 nodes a tree, one pick a tree, three a class.** She holds 5 skills a tree, 15 in all; equips 3 → 7.
- **Every node exists today:** the trunk and A are cores 1–5, B one side line's depths 3–5. No new skill, no engine
  change of its own.
- **B, the lean:** for the Brawler and the Mage it follows the weapon kind; for the other four it follows the class:
  the Spell Blade's **Flurry** (one more hit), the Summoner's **Bonded** (Tome trees: a harder farewell) or **Pack**
  (Arms trees: one more hit), the healers' **Heavy** (one more stack, and the revives where they sit today: the
  Cleric's Rebirth at Light D3, the Paladin's Valkyrie's Oath at Lance D4).

### 6.3 Tier 2: branch C and the tip fork (CP19)

```
Heavy Slash ── Cleave ──┬── A  Sunder ─────────── Rend ───────── Meteor Strike ─┬─ Power
                        │                                                       ├─ Break
                        │                                                       └─ ★ signature tip (one tree, template slot)
                        ├── B  Triple Sunder ──── Rending Combo ─ Meteor Combo ─┬─ Power · Break
                        └── C  Rampart Breaker ── Cataclysm ──── Worldbreaker ──┬─ Power · Break
```

- **Branch C joins the fork,** by the same rules. The Brawler's and the Mage's are today's third lines; the hybrids' are
  **Q17's crossovers** (SK9, kept), on the leading half only: the Spell Blade's **Sweep** on her Arms trees (her Arms
  half reaches every foe at the area share, without her extra hit), the Summoner's **Hunt** on her Tome trees (her
  farewell strikes its own target three times instead of every foe once). The others: the Spell Blade's Tome tree
  **Focused** (today's A line), the Summoner's Arms trees **Mighty** (new), the healers' **Wide** (new: the mend or
  Barrier reaches every Uma from depth 3).
- **Each branch's tip forks:** **Power** (the Tier 1 tip) or **Break** (the same skill; its first weak hit on a foe
  removes one more shield point, once an act, under the shared chip cap, E6). Weapon arts' A/B fork lives here; forms
  never touch Breaks.
- **The root** shows her specialization ([§7.2](#72-specializations-tier-2-cp26)).
- **14 nodes a tree, two picks a tree, six a class.** She holds 5 skills a tree; equips 3 → 10.

### 6.4 Tier 3: capstones and two branches held (CP20)

```
                        ┌── A  Sunder ─ Rend ─ Meteor Strike ─┬─ Power ─┐
Heavy Slash ── Cleave ──┤   (held)                            └─ Break ─┴── D6 · CR 50  Grand Meteor Strike
                        ├── B  Triple Sunder ─ … ─ Meteor Combo ─┬─ Power ─┐
                        │   (held)                                └─ Break ─┴── D6  Grand Meteor Combo
                        └── C  Rampart Breaker ─ … ─ Worldbreaker ─ …       ── D6  Grand Worldbreaker (not held)
```

- **She holds two of the three branches** at the fork (default A and B), each with its own tip pick and capstone. Auto
  picks between them each turn: one tree, two answers.
- **Depth 6 at Class Rank 50:** each branch's **capstone**, its tip one depth on: power 5.6 (the depth table's next
  step), full-turn MP 30.
- **The master slot** (CP22) holds one capstone outside her ten equipped skills.
- **17 nodes a tree, three picks a tree** (the pair and two tips), **nine a class.** She holds 10 skills a tree, 30.
- **The root** shows her mastery beside her specialization ([§7.3](#73-masteries-tier-3-cp27)).

### 6.5 Every class's trees

Each table is every tree the class can slot, with every node's name. **A** is the core line; **B** opens in Tier 1;
**C** in Tier 2; the capstones (D6) in Tier 3. Break tips keep their tip's name, marked "· Break". Numbers per node are
on the [tree viewer](previews/class-trees.html) (hover any node); the shapes are below each table.

#### Brawler

| Tree | Trunk: D1 · D2 | A, the core (D3 · D4 · D5) | B, Tier 1 | C, from Tier 2 | Capstones D6, Tier 3: A · B · C |
|---|---|---|---|---|---|
| Greatsword | Heavy Slash · Cleave | Sunder · Rend · Meteor Strike | **Combo:** Triple Sunder · Rending Combo · Meteor Combo | **Crush:** Rampart Breaker · Cataclysm · Worldbreaker | Grand Meteor Strike · Grand Meteor Combo · Grand Worldbreaker |
| Axe | Sweep · Whirl | Cyclone · Quake · Maelstrom | **Reap:** Headsman's Cyclone · Guillotine Quake · Executioner's Storm | **Tempest:** Grand Cyclone · Aftershock · Tempest | Grand Maelstrom · Grand Executioner's Storm · Grand Tempest |
| Lance | Thrust Flurry · Lance Barrage | Spiral Barrage · Dragon Dive · Heaven's Rain | **Impale:** Skewer · Dragon Fang · Gungnir | **Scatter:** Storm of Spears · Dragon Swarm · Thousand Spears | Grand Heaven's Rain · Grand Gungnir · Grand Thousand Spears |
| Bow | Twin Arrows · Triple Shot | Quiver Volley · Arrow Storm · Starfall Barrage | **Rain:** Rain of Arrows · Arrow Hail · Starfall Rain | **Ballista:** Ballista Shot · Comet Arrow · Sunpiercer | Grand Starfall Barrage · Grand Starfall Rain · Grand Sunpiercer |
| Katana | Double Slash · Crossing Cut | Twin Moon · Iai Storm · Moonfall | **Draw:** Flash Draw · Moonlit Draw · Final Draw | **Cross:** Twin Cross · Scattering Petals · Thousand Petals | Grand Moonfall · Grand Final Draw · Grand Thousand Petals |

| Tree | A, the core | B | C |
|---|---|---|---|
| Greatsword | One foe; 1 → 3 hits; D5 4.6, Armor Break 2 | One more hit, ×0.92: Breaks sooner | One hit, ×1.15, +2 MP |
| Axe | Every foe ×0.55; +4 MP; D5 Armor Break 1 on each | Every foe ×0.45, then a hit ×0.5 on her target; +6 MP | Every foe, one more hit, ×0.5; +6 MP |
| Lance | Random foes, 2 → 6 hits ×1.05; D5 Armor Break 1 on each | One foe, half the hits, ×1.15; +2 MP | Random foes, two more hits at 0.3; +4 MP |
| Bow | One foe, 2 → 6 hits; D5 Armor Break 2 | And a splash ×0.2 on every other foe; +4 MP | One foe, half the hits, ×1.15; +2 MP |
| Katana | One foe, 2 hits; D5 ×1.3 on a Broken foe | One hit ×1.15 that ignores the unbroken halving; +2 MP | 2 hits ×0.7 on her foe and 2 ×0.42 on one other; +4 MP |

#### Mage

| Tree | Trunk: D1 · D2 | A, the core (D3 · D4 · D5) | B, Tier 1 | C, from Tier 2 | Capstones D6, Tier 3: A · B · C |
|---|---|---|---|---|---|
| Fire Tome | Fire · Fira | Firaga · Firaja · Flare Star | **Wave:** Firaga Wave · Firaja Wave · Flare Wave | **Chain:** Firaga Chain · Firaja Chain · Flare Chain | Grand Flare Star · Grand Flare Wave · Grand Flare Chain |
| Blizzard Tome | Blizzard · Blizzara | Blizzaga · Blizzaja · Absolute Zero | **Spike:** Blizzaga Spike · Blizzaja Spike · Zero Spike | **Shards:** Blizzaga Shards · Blizzaja Shards · Zero Shards | Grand Absolute Zero · Grand Zero Spike · Grand Zero Shards |
| Thunder Tome | Thunder · Thundara | Thundaga · Thundaja · Judgment Storm | **Bolt:** Thundaga Bolt · Thundaja Bolt · Judgment Bolt | **Storm:** Thundaga Storm · Thundaja Storm · Judgment Tempest | Grand Judgment Storm · Grand Judgment Bolt · Grand Judgment Tempest |
| Light Tome | Lux · Luxra | Luxaga · Luxaja · Holy | **Cascade:** Luxaga Cascade · Luxaja Cascade · Holy Cascade | **Beam:** Luxaga Lance · Luxaja Lance · Holy Lance | Grand Holy · Grand Holy Cascade · Grand Holy Lance |
| Dark Tome | Nox · Noxra | Noxaga · Noxaja · Black Hole | **Pierce:** Noxaga Pierce · Noxaja Pierce · Void Pierce | **Cascade:** Noxaga Cascade · Noxaja Cascade · Void Cascade | Grand Black Hole · Grand Void Pierce · Grand Void Cascade |

| Tree | A, the core | B | C |
|---|---|---|---|
| Fire | One foe, 1 hit; D5 Burn 2 | Every foe ×0.55; +4 MP | Random foes, 2 → 4 hits ×1.05 |
| Blizzard | Every foe ×0.55; +4 MP; D5 2 hits, Enfeeble 1 | One foe, 1 hit at full power | Random foes, 2 → 4 hits ×1.05 |
| Thunder | Random foes, 2 → 4 hits ×1.05; D5 Shock 1 a hit | One foe, 1 hit | Every foe ×0.55; +4 MP |
| Light | One foe, 2 → 6 hits; D5 ×1.3 on a Broken foe | Every foe, 2 hits ×0.5; +6 MP | One foe, half the hits, ×1.15; +2 MP |
| Dark | One foe, 2 hits; D5 ×1.3 below half HP | One hit ×1.15 that ignores the unbroken halving; +2 MP | Every foe, 2 hits ×0.5; +6 MP |

#### Spell Blade

Every skill is a single-target half; her Arms half lands one extra hit; hands 0.72 and 0.44, MP ×0.5 a half.

| Tree | Trunk: D1 · D2 | A, the core (D3 · D4 · D5) | B, Tier 1 | C, from Tier 2 | Capstones D6, Tier 3: A · B · C |
|---|---|---|---|---|---|
| Greatsword | Rune Cleave · Arcane Cleave | Mystic Cleave · Astral Cleave · Celestial Cleave | **Flurry:** Mystic Cleave Flurry · Astral Cleave Flurry · Celestial Cleave Flurry | **Sweep:** Sweeping Mystic Cleave · Sweeping Astral Cleave · Sweeping Celestial Cleave (new) | Empyreal Cleave · Empyreal Cleave Flurry · Sweeping Empyreal Cleave |
| Axe | Rune Hew · Arcane Hew | Mystic Hew · Astral Hew · Celestial Hew | **Flurry:** Mystic Hew Flurry · Astral Hew Flurry · Celestial Hew Flurry | **Sweep:** Sweeping Mystic Hew · Sweeping Astral Hew · Sweeping Celestial Hew (new) | Empyreal Hew · Empyreal Hew Flurry · Sweeping Empyreal Hew |
| Lance | Rune Thrust · Arcane Thrust | Mystic Thrust · Astral Thrust · Celestial Thrust | **Flurry:** Mystic Thrust Flurry · Astral Thrust Flurry · Celestial Thrust Flurry | **Sweep:** Sweeping Mystic Thrust · Sweeping Astral Thrust · Sweeping Celestial Thrust (new) | Empyreal Thrust · Empyreal Thrust Flurry · Sweeping Empyreal Thrust |
| Bow | Rune Shot · Arcane Shot | Mystic Shot · Astral Shot · Celestial Shot | **Flurry:** Mystic Shot Flurry · Astral Shot Flurry · Celestial Shot Flurry | **Sweep:** Sweeping Mystic Shot · Sweeping Astral Shot · Sweeping Celestial Shot (new) | Empyreal Shot · Empyreal Shot Flurry · Sweeping Empyreal Shot |
| Katana | Rune Draw · Arcane Draw | Mystic Draw · Astral Draw · Celestial Draw | **Flurry:** Mystic Draw Flurry · Astral Draw Flurry · Celestial Draw Flurry | **Sweep:** Sweeping Mystic Draw · Sweeping Astral Draw · Sweeping Celestial Draw (new) | Empyreal Draw · Empyreal Draw Flurry · Sweeping Empyreal Draw |
| Fire Tome | Rune Brand · Arcane Brand | Mystic Brand · Astral Brand · Celestial Brand | **Flurry:** Mystic Brand Flurry · Astral Brand Flurry · Celestial Brand Flurry | **Focused:** Focused Mystic Brand · Focused Astral Brand · Focused Celestial Brand | Empyreal Brand · Empyreal Brand Flurry · Focused Empyreal Brand |
| Blizzard Tome | Rune Rime · Arcane Rime | Mystic Rime · Astral Rime · Celestial Rime | **Flurry:** Mystic Rime Flurry · Astral Rime Flurry · Celestial Rime Flurry | **Focused:** Focused Mystic Rime · Focused Astral Rime · Focused Celestial Rime | Empyreal Rime · Empyreal Rime Flurry · Focused Empyreal Rime |
| Thunder Tome | Rune Bolt · Arcane Bolt | Mystic Bolt · Astral Bolt · Celestial Bolt | **Flurry:** Mystic Bolt Flurry · Astral Bolt Flurry · Celestial Bolt Flurry | **Focused:** Focused Mystic Bolt · Focused Astral Bolt · Focused Celestial Bolt | Empyreal Bolt · Empyreal Bolt Flurry · Focused Empyreal Bolt |
| Light Tome | Rune Ray · Arcane Ray | Mystic Ray · Astral Ray · Celestial Ray | **Flurry:** Mystic Ray Flurry · Astral Ray Flurry · Celestial Ray Flurry | **Focused:** Focused Mystic Ray · Focused Astral Ray · Focused Celestial Ray | Empyreal Ray · Empyreal Ray Flurry · Focused Empyreal Ray |
| Dark Tome | Rune Shade · Arcane Shade | Mystic Shade · Astral Shade · Celestial Shade | **Flurry:** Mystic Shade Flurry · Astral Shade Flurry · Celestial Shade Flurry | **Focused:** Focused Mystic Shade · Focused Astral Shade · Focused Celestial Shade | Empyreal Shade · Empyreal Shade Flurry · Focused Empyreal Shade |

| Line | What it does |
|---|---|
| A, the core | One foe; her kind's hits (Greatsword, Fire, Axe, Ice 1 → 2; Lance, Thunder 2 → 3; Bow, Light 2 → 4; Katana, Dark 2); D5 Burn, Enfeeble, Shock or Armor Break 1, or ×1.3 on a Broken foe (Katana, Light), or below half HP (Dark) |
| B, Flurry | One more hit, ×0.95, +2 MP: her shield-breaking, further |
| C, Sweep (Arms trees, new) | Every foe at the area share (×0.55), her extra hit given up, +4 MP: Q17's crossover toward the Summoner's crowds |
| C, Focused (Tome trees) | One hit fewer, ×1.1, +2 MP |

#### Summoner

A Tome summon lingers at 0.3 and strikes every foe in farewell when her next pair comes; an Arms summon arrives and
strikes, and leaves nothing. Hands 0.58 and 0.56, MP ×0.5 a half. No support.

| Tree | Trunk: D1 · D2 | A, the core (D3 · D4 · D5) | B, Tier 1 | C, from Tier 2 | Capstones D6, Tier 3: A · B · C |
|---|---|---|---|---|---|
| Greatsword | Squire · Shield Knight | Knight Captain · Aegis Champion · Sword Saint | **Pack:** Knight Captain Pack · Aegis Champion Pack · Sword Saint Pack | **Mighty:** Mighty Knight Captain · Mighty Aegis Champion · Mighty Sword Saint (new) | Blade Emperor · Blade Emperor Pack · Mighty Blade Emperor |
| Axe | Brigand · Marauder | Axe Ogre · Minotaur Chief · Jotun King | **Pack:** Axe Ogre Pack · Minotaur Chief Pack · Jotun King Pack | **Mighty:** Mighty Axe Ogre · Mighty Minotaur Chief · Mighty Jotun King (new) | Titan Warchief · Titan Warchief Pack · Mighty Titan Warchief |
| Lance | Pikeman · Dragoon | Lance Knight · Valkyrie · Valkyrie Queen | **Pack:** Lance Knight Pack · Valkyrie Pack · Valkyrie Queen Pack | **Mighty:** Mighty Lance Knight · Mighty Valkyrie · Mighty Valkyrie Queen (new) | Valkyrie Empress · Valkyrie Empress Pack · Mighty Valkyrie Empress |
| Bow | Slinger · Archer | Ranger · Sylph Archer · Sagittarius | **Pack:** Ranger Pack · Sylph Archer Pack · Sagittarius Pack | **Mighty:** Mighty Ranger · Mighty Sylph Archer · Mighty Sagittarius (new) | Moon Archer · Moon Archer Pack · Mighty Moon Archer |
| Katana | Ronin · Samurai | Kensei · Blade Shogun · Sword Spirit | **Pack:** Kensei Pack · Blade Shogun Pack · Sword Spirit Pack | **Mighty:** Mighty Kensei · Mighty Blade Shogun · Mighty Sword Spirit (new) | Blade Phantom · Blade Phantom Pack · Mighty Blade Phantom |
| Fire Tome | Ember Sprites · Salamander | Fire Drake · Infernal Wyrm · Phoenix | **Bonded:** Bonded Fire Drake · Bonded Infernal Wyrm · Bonded Phoenix | **Hunt:** Fire Drake Hunt · Infernal Wyrm Hunt · Phoenix Hunt (new) | Sun Dragon · Bonded Sun Dragon · Sun Dragon Hunt |
| Blizzard Tome | Frost Sprites · Snow Sentinel | Ice Golem · Frost Titan · Winter Queen | **Bonded:** Bonded Ice Golem · Bonded Frost Titan · Bonded Winter Queen | **Hunt:** Ice Golem Hunt · Frost Titan Hunt · Winter Queen Hunt (new) | Glacier Colossus · Bonded Glacier Colossus · Glacier Colossus Hunt |
| Thunder Tome | Spark Sprites · Thunderbird | Storm Roc · Thunder Kirin · Raijin | **Bonded:** Bonded Storm Roc · Bonded Thunder Kirin · Bonded Raijin | **Hunt:** Storm Roc Hunt · Thunder Kirin Hunt · Raijin Hunt (new) | Tempest Lord · Bonded Tempest Lord · Tempest Lord Hunt |
| Light Tome | Cherub · Mending Angel | Seraph Choir · Dominion Host · Heaven's Legion | **Bonded:** Bonded Seraph Choir · Bonded Dominion Host · Bonded Heaven's Legion | **Hunt:** Seraph Choir Hunt · Dominion Host Hunt · Heaven's Legion Hunt (new) | Radiant Throne · Bonded Radiant Throne · Radiant Throne Hunt |
| Dark Tome | Leech Imp · Night Bat | Vampire Knight · Blood Countess · Abyssal Overlord | **Bonded:** Bonded Vampire Knight · Bonded Blood Countess · Bonded Abyssal Overlord | **Hunt:** Vampire Knight Hunt · Blood Countess Hunt · Abyssal Overlord Hunt (new) | Night Sovereign · Bonded Night Sovereign · Night Sovereign Hunt |

| Line | What it does |
|---|---|
| A, the core | A summon in its kind's shape: Fire and Greatsword one foe, 1 → 3 hits; Ice and Axe every foe ×0.55, +4 MP; Lightning and Lance random foes ×1.05; Light and Bow one foe, 2 → 4 hits; Dark and Katana 2 hits. D5: Burn, Enfeeble, Shock or Armor Break, ×1.3 on a Broken foe (Katana) |
| B, Bonded (Tome trees) | Lingers at 0.4, not 0.3, +2 MP: a harder farewell on every foe |
| B, Pack (Arms trees) | One more hit, ×0.95 (Bonded would do nothing on an Arms summon) |
| C, Hunt (Tome trees, new) | Its farewell strikes its own target three times instead of every foe once, +2 MP: Q17's crossover toward the Spell Blade's focus |
| C, Mighty (Arms trees, new) | One hit fewer, ×1.1, +2 MP |

#### Paladin and Cleric

The two healers share every tree's names and shape; their kits differ ([§2.1](#21-who-they-are-cp1)). Two B nodes
differ: the Paladin's **Lance D4 is Valkyrie's Oath** (Heavy Transfix for the Cleric), the Cleric's **Light D3 is
Rebirth** (Heavy Devotion for the Paladin). Both revive the first fallen.

| Tree | Trunk: D1 · D2 | A, the core (D3 · D4 · D5) | B, Tier 1 | C, from Tier 2 | Capstones D6, Tier 3: A · B · C |
|---|---|---|---|---|---|
| Greatsword | Breach · Sunder Armor | Rupture · Ravage · Ruin | **Heavy:** Heavy Rupture · Heavy Ravage · Heavy Ruin | **Wide:** Wide Rupture · Wide Ravage · Wide Ruin (new) | Obliterate · Heavy Obliterate · Wide Obliterate |
| Axe | Hack · Hamstring | Maim · Cripple · Unmake | **Heavy:** Heavy Maim · Heavy Cripple · Heavy Unmake | **Wide:** Wide Maim · Wide Cripple · Wide Unmake (new) | Unravel · Heavy Unravel · Wide Unravel |
| Lance | Pierce Mind · Puncture | Impale · Transfix · Mindspike | **Heavy:** Heavy Impale · Valkyrie's Oath (Paladin) or Heavy Transfix · Heavy Mindspike | **Wide:** Wide Impale · Wide Transfix · Wide Mindspike (new) | Mindshatter · Heavy Mindshatter · Wide Mindshatter |
| Bow | Chip · Crack | Fracture · Splinter · Shatterstorm | **Heavy:** Heavy Fracture · Heavy Splinter · Heavy Shatterstorm | **Wide:** Wide Fracture · Wide Splinter · Wide Shatterstorm (new) | Shatterfall · Heavy Shatterfall · Wide Shatterfall |
| Katana | Mark · Curse | Hex · Doom · Anathema | **Heavy:** Heavy Hex · Heavy Doom · Heavy Anathema | **Wide:** Wide Hex · Wide Doom · Wide Anathema (new) | Oblivion · Heavy Oblivion · Wide Oblivion |
| Fire Tome | Valor · Courage | Bravery · Heroism · Exaltation | **Heavy:** Heavy Bravery · Heavy Heroism · Heavy Exaltation | **Wide:** Wide Bravery · Wide Heroism · Wide Exaltation (new) | Glory · Heavy Glory · Wide Glory |
| Blizzard Tome | Ward · Guard | Bulwark · Fortress · Sanctum | **Heavy:** Heavy Bulwark · Heavy Fortress · Heavy Sanctum | **Wide:** Wide Bulwark · Wide Fortress · Wide Sanctum (new) | Citadel · Heavy Citadel · Wide Citadel |
| Thunder Tome | Spark · Charge | Surge · Overcharge · Breakstorm | **Heavy:** Heavy Surge · Heavy Overcharge · Heavy Breakstorm | **Wide:** Wide Surge · Wide Overcharge · Wide Breakstorm (new) | Thunderbreak · Heavy Thunderbreak · Wide Thunderbreak |
| Light Tome | Grace · Faith | Devotion · Piety · Benediction | **Heavy:** Rebirth (Cleric) or Heavy Devotion · Heavy Piety · Heavy Benediction | **Wide:** Wide Devotion · Wide Piety · Wide Benediction (new) | Sanctity · Heavy Sanctity · Wide Sanctity |
| Dark Tome | Calm · Focus | Clarity · Insight · Enlightenment | **Heavy:** Heavy Clarity · Heavy Insight · Heavy Enlightenment | **Wide:** Wide Clarity · Wide Insight · Wide Enlightenment (new) | Transcendence · Heavy Transcendence · Wide Transcendence |

| Line | What it does |
|---|---|
| A, the core | One foe, 1 hit, at her half hand. A status by kind, 1 · 1 · 2 · 2 · 3 stacks for 2 rounds: Greatsword Armor Break, Lance Mind Break, Axe Enfeeble, Bow Shatter, Katana Hex on the foe; Fire Brave, Light Faith, Ice Aegis, Thunder Breaker, Dark Clarity on every Uma. **Blows** Barrier the most threatened Uma; **spells** mend the most hurt and cleanse; at D5 both reach every Uma (×0.4) and a blow's status every foe. Shares 28 · 32 · 36 · 40 · 44% of max HP, from her ATK (Paladin) or M.ATK (Cleric). Paladin: Blizzard spells also Barrier every Uma (0.5 of the share), Greatsword blows give Aegis 1, Axe blows Enfeeble every foe from D4. Cleric: Light spells leave Regen, Dark spells drain 30% |
| B, Heavy | One more stack, +4 MP; the revives (Rebirth, Valkyrie's Oath) |
| C, Wide (new) | Her mend or Barrier reaches every Uma (×0.4) from D3, where today only D5 does; +4 MP |

### 6.6 New nodes, by rule

Everything below is new content for Tier 2 (engine v17) and Tier 3. Numbers are drafts for the simulation; SK3's rule
binds them (reach, hits, support or Breaks).

| Node | Where | Shape | Power | MP (full turn) | Name |
|---|---|---|---|---|---|
| **Sweep** (D3–D5) | Spell Blade, Arms trees, C | Every foe; the core's hits; her extra hit given up | ×0.55 of the depth's power, each foe | Core + 4 | "Sweeping {Mystic · Astral · Celestial} {weapon noun}" |
| **Hunt** (D3–D5) | Summoner, Tome trees, C | The core summon; its farewell strikes its own target 3 times instead of every foe once | Core | Core + 2 | "{summon} Hunt" |
| **Mighty** (D3–D5) | Summoner, Arms trees, C | One hit fewer | ×1.1 | Core + 2 | "Mighty {summon}" |
| **Wide** (D3–D5) | Paladin, Cleric, C | The core; its mend or Barrier on every Uma (×0.4) | Core | Core + 4 | "Wide {core name}" |
| **Break tip** (D5) | Every branch, Tier 2 on | Its tip; the first weak hit on a foe removes one more shield point, once an act (E6's cap, shared with every extra chip) | Its tip's | Its tip's | "{tip} · Break" |
| **Capstone** (D6) | Every branch, Tier 3 | Its tip one depth on; its status or rider one stack more | 5.6 single-target units (the tip × 5.6 ÷ 4.6) | Tip + 4 (30 for a core) | Brawler, Mage: "Grand {tip}". Spell Blade: the sixth rung, Empyreal. Summoner: a sixth summon (Sun Dragon, Glacier Colossus, Tempest Lord, Radiant Throne, Night Sovereign, Blade Emperor, Titan Warchief, Valkyrie Empress, Moon Archer, Blade Phantom). Healers: a sixth word (Obliterate, Unravel, Mindshatter, Shatterfall, Oblivion, Glory, Citadel, Thunderbreak, Sanctity, Transcendence), with "Heavy" and "Wide" for B and C |

**Skill MP by tier:** ×1, ×1.7, ×2.4 (tier2-classes A10), which the MP bar matches under SB1 (a Brawler's 173 → 296 →
419: ×1.71, ×2.42).

### 6.7 The root (CP24)

The root is her class plate, above her three trees.

| Tier | The plate |
|---|---|
| 1 | Her class, emblem and hand ("Spell Blade · Arms ×0.72 + Tome ×0.44"); **★ her Flourish slot** |
| 2 | + her **specialization**, one of two, swapped here ([§7.2](#72-specializations-tier-2-cp26)) |
| 3 | + her **mastery** ([§7.3](#73-masteries-tier-3-cp27)) and the master slot |

**Two template-only slots, marked, not filled** (SK11's, for the Uma Templates pass):
- **★ The Flourish** at the root, every tier: one class-wide node, on while she fights as her calling.
- **★ The signature tip,** from Tier 2: a third option at the tip fork of one tree, her calling's tree of her signature
  kind (at both of that tree's tip forks in Tier 3). The viewer draws it dashed on the six trees that can be signature
  kinds (Katana, Dark, Greatsword, Fire, Bow, Light).

Nothing else in a tree is template-only.

### 6.8 Counts

| | Today | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| Trees she uses | 5 | 3 | 3 | 3 |
| Nodes a tree | 15 | 8 | 14 | 17 |
| Picks a tree | 5 forks, and points | 1: A or B | 2: A, B or C; the tip | 3: two of A, B, C; two tips |
| Picks a class | 25 + 50 points | 3 | 6 | 9 |
| Skills she holds | Up to 50 | 15 | 15 | 30 |
| Equipped | 3 → 10 | 3 → 7 | 3 → 10 | 10 and a master slot |
| Nodes across the 50 trees | 750 | 400 | 700 | 850 |
| New nodes to write | — | 0 | Sweep 15, Hunt 15, Mighty 15, Wide 60, Break tips 150 | Capstones 150 |

## 7. Class Rank, specializations, masteries

### 7.1 Class Rank (CP25)

- **Per class, per world, 1–50.** A win pays 2E Class EXP to the class she fought as (D102); the curve is Uma Level's
  (120 + 16 × rank to next). Past Rank 50 it banks at half rate as **Class Marks**; a Class Manual (1,000 Marks) gives
  1,000 Class EXP. Gear Marks become Class Marks one for one (GE15). The Rift's Echoes pay Class EXP at 2×.
- **It opens depths** ([§6.1](#61-the-rules-every-tier-shares-cp13cp17-cp21cp23)) and sets her Limit Break's depth.
  Fighting as one class, Class Rank 20 comes at about Uma Lv 13, 30 at Lv 20, 40 at Lv 27, 50 at Lv 34.
- **Promotion:** Class Rank 1 in every class in the new world; banked EXP past Lv 50 becomes Class Marks (T3, up to
  2,000: about Class Rank 10 for one class).
- **Nothing else gates a class:** no skill points, no weapon rank; a weapon's grade is the weapons doc's.

### 7.2 Specializations, Tier 2 (CP26)

Each class picks **one of two** passives, tier2-classes' twelve as written (A5), with their names (A4). No new class
ids, no lean change (A2 dropped), Limit Break power the class's. Picked per class, **swapped freely** on the class plate
outside fights; Ascend preselects one for every class by A6's stat rule. Her chip reads "Spell Blade · Blademaster".

| Class | First (preselected if) | Its passive | Second | Its passive |
|---|---|---|---|---|
| Brawler | **Warlord** (Speed ≥ Stamina) | A Broken sub-boss or boss takes +20% from her | **Berserker** | Her Axe hits her target at full power; the others still take the area share |
| Mage | **Sage** (Wit ≥ Speed) | A spell of a different element from her last deals +15% | **Sorcerer** | A lone foe takes +15% from her spells |
| Spell Blade | **Blademaster** (Power ≥ Wit) | A weak Arms half on a shielded foe removes one more shield point (once an act, the shared cap) | **Rune Knight** | Her Tome half also strikes every other foe weak to its element, at 15% |
| Summoner | **Conjurer** (Power ≥ Wit) | Her farewells strike 20% harder | **Warlock** | Her Light and Dark summons put Mind Break 1 on the foe they strike |
| Paladin | **Templar** (Speed ≥ Stamina) | Her Barriers on every Uma are 25% larger | **Guardian** | Her Arms blows also guard the Uma most threatened until the round ends |
| Cleric | **Bishop** (Speed ≥ Wit) | Her mends on every Uma are 25% larger | **Oracle** | Her buffs on every Uma last 3 rounds, from 2 |

Every passive is kind-based or kind-free; none read a strike. Targets (tier2-classes §10): +8–15% where it applies, no
more than +5% elsewhere; each of a pair the better pick on at least one front.

### 7.3 Masteries, Tier 3 (CP27)

**One mechanic a class, six in all,** on from Class Rank 1 of Tier 3, beside her specialization. Draft effects, under
tier2-classes §3's rules (no extra act, no Limit refund, no longer Break, at most one extra shield point an act, no new
damage kind, no party support from the Summoner); Tier 3's simulation sets the numbers (+8–15% where it applies).

| Class | Mastery | On screen | Draft effect | Where it pays |
|---|---|---|---|---|
| Brawler | **Unstoppable** | "Her hits lose less to a standing shield." | An unbroken foe takes ×0.6 from her hits, not ×0.5 | Every fight before the Break; most where shields are high |
| Mage | **Resonance** | "Her deepest spells ring twice." | Her depth 5 and 6 spells strike again at 30% on the same targets; the second strike never removes a shield point | Long fights she can cast through |
| Spell Blade | **Spellbind** | "Both halves weak: +20%." | When both halves of her act land weak on the same foe, the act deals +20% | Tier 3 bosses keep their twins: a Spell Blade holding a twin set lands it every act |
| Summoner | **Menagerie** | "Her summons stay a pair longer." | Each Tome summon lingers for two of her pairs, and strikes in farewell at both | Crowds; the Horde |
| Paladin | **Last Stand** | "Her Barrier saves a falling Uma once a fight." | Once a fight, an Uma under her Barrier who takes a fatal hit stays at 1 HP | The Duel's heavy hitters |
| Cleric | **Overflow** | "Mends past full become a Barrier." | A mend's healing past max HP becomes a Barrier, up to 10% of max HP | Spread damage |

## 8. Halls of Heroes and Limit Breaks (CP28)

**The halls are class progression's second line,** unchanged by the rework: six halls (the Brawler Dojo, Mage Tower,
Spell Blade Salle, Summoner Circle, Paladin Bastion, Cleric Chapel), four seats each, **24 Limit Breaks**, the only
source of Limit Breaks (D112). A Hero uses her seat's at 100%; a Learner either of her two Heroes' at 50% + 5% a Bond
Level. Its power is her **own class's** (Brawler 2×, Mage 2.4×, hybrids 2.2×, healers 1.5×) at her open depth.

**With weaknesses by kind, a Limit Break is coverage:** its kinds decide weaknesses and locks whatever she wields (C3),
so a Mage who learned Arsenal Rush answers an Arm-weak regular in Tier 2.

| Hall | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Brawler Dojo | Arsenal Rush: every Arm | Iaido Cleave: Greatsword, Katana | Spear and Arrow Storm: Lance, Bow | Earthsplitter: Axe |
| Mage Tower | Elemental Cascade: every element | Twilight Eclipse: Light, Dark | Trinity Storm: Fire, Ice, Lightning | Chaos Rain: Light, Dark |
| Spell Blade Salle | Sunfire Edge: Greatsword, Fire | Rimefang Waltz: Katana, Ice | Thunder Javelin: Lance, Lightning | Eclipse Volley: Bow, Light, Dark |
| Summoner Circle | Cinder Wyrm: Greatsword, Fire | Frost Behemoth: Axe, Ice | Thunderbird: Lance, Lightning | Moon Fox: Katana, Dark, Bow, Light |
| Paladin Bastion | Archangel's Verdict: Greatsword, Light | Archdemon's Pact: Katana, Dark | Rampart Charge: Greatsword | Valkyrie Lances: Lance |
| Cleric Chapel | Choir of Angels: Light | Legion of Demons: Dark | Dawn Hymn: Fire | Frost Sanctuary: Ice |

**Across the tiers:**

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Seats and Limit Breaks | 24 | The same 24, in the new world's halls | The same |
| Bonds | Earned per world | **Reset at promotion**; the halls start empty (T4) | The same |
| Hero LB+ | — | **At Bond 10**, a Hero with her own seat or a Learner with her Hero gains the seat's extra effect (A7; tier2-classes §7.2's 24 drafts, +15–25%) | Kept |
| Power | Her class's | Her class's (A8) | Her class's |

## 9. Class stats at Lv 50 under SB1

An Uma's full sheet at each tier's Lv 50: the balance simulation's average outfit (base 110, +10% growth in Speed,
Stamina and Power), fully built (every slot G10, every Extra Stats node her class uses, her template matched), from
[stats-by-tier](previews/stats-by-tier.html), with **every flat build value × 1, × 1.8, × 2.6** (SB1). Offense is on
her lead kind: her ATK or M.ATK plus the weapon's Might (68 · 122 · 177), and from Tier 2 the Orb and the Halo (61 ·
88 each).

| Class | Tier | HP | MP | ATK | M.ATK | DEF | M.DEF | Offense, lead kind | Offense, flat drafts |
|---|---|---|---|---|---|---|---|---|---|
| **Brawler** | 1 | 1,427 | 173 | 200 | 116 | 187 | 162 | 268 | 268 |
|  | 2 | 2,457 | 296 | 357 | 206 | 334 | 290 | 601 | 426 |
|  | 3 | 3,496 | 419 | 516 | 298 | 482 | 418 | 869 | 517 |
| **Mage** | 1 | 1,194 | 256 | 116 | 205 | 166 | 182 | 273 | 273 |
|  | 2 | 2,062 | 435 | 206 | 366 | 296 | 325 | 610 | 435 |
|  | 3 | 2,936 | 615 | 298 | 530 | 428 | 469 | 883 | 531 |
| **Spell Blade** | 1 | 1,287 | 207 | 200 | 151 | 176 | 172 | 268 | 268 |
|  | 2 | 2,220 | 352 | 357 | 270 | 315 | 308 | 601 | 426 |
|  | 3 | 3,160 | 498 | 516 | 390 | 455 | 444 | 869 | 517 |
| **Summoner** | 1 | 1,287 | 207 | 151 | 200 | 176 | 172 | 268 | 268 |
|  | 2 | 2,220 | 352 | 270 | 357 | 315 | 308 | 601 | 426 |
|  | 3 | 3,160 | 498 | 390 | 516 | 455 | 444 | 869 | 517 |
| **Paladin** | 1 | 1,287 | 256 | 189 | 135 | 192 | 172 | 257 | 257 |
|  | 2 | 2,220 | 435 | 338 | 242 | 343 | 308 | 582 | 407 |
|  | 3 | 3,160 | 615 | 489 | 349 | 496 | 444 | 842 | 490 |
| **Cleric** | 1 | 1,287 | 256 | 135 | 189 | 176 | 187 | 257 | 257 |
|  | 2 | 2,220 | 435 | 242 | 338 | 315 | 334 | 582 | 407 |
|  | 3 | 3,160 | 615 | 349 | 489 | 455 | 482 | 842 | 490 |

- **The build's share holds:** a Brawler's HP is 25% build at Tier 1 and 26% at Tier 3 (the flat drafts: 25% → 12%);
  her ATK 42% at every tier. Offense rises from 57% to 66% in Tier 2 only because the Orb and the Halo arrive there.
- **The classes' identities hold at every tier:** the leans are multiplicative, so the Mage keeps the deepest MP, the
  Brawler the most HP, the hybrids their mirror.
- **What this doc owns here:** the leans and hands (§2.2). The values themselves are the weapons and Extra Stats docs'
  under SB1; the overall balancing sets them by simulation. The [templates page](previews/class-templates.html#stats)
  draws every class's sheet with its sources.

## 10. The calling pick

The owner (2026-10-22): "Pace + Lates I may want the option to choose between Mage and Spell Blade, maybe one of those
things we do once at Uma Level 1 at 0 Class Rank, authoring some choices on the Uma sheet."

### 10.1 The call (CP29)

**A one-time pick on the Uma sheet between her running style's two classes:** a **Pace** Uma picks **Spell Blade or
Mage**, a **Late** Uma **Paladin or Cleric**. Her Power against her Wit **pre-selects** (today's rule: Power over Wit
the Spell Blade or the Paladin), so a player who never looks gets U4's calling.

| Her racing profile (U4's rows, first that fits) | Calling | Umas today | The pick |
|---|---|---|---|
| Best style Front | Brawler | 47 | — |
| Wit ≥ Power, and A in two of Pace, Late, End | Summoner | 33 | — |
| Best style End | Summoner | 13 | — |
| Best style Pace, Power > Wit, best distance Sprint | Brawler | 14 | — |
| Best style Pace, Power > Wit | Spell Blade | 56 | **Spell Blade** (pre-selected) or Mage |
| Best style Pace, Wit ≥ Power | Mage | 46 | **Mage** (pre-selected) or Spell Blade |
| Best style Late, Power > Wit | Paladin | 48 | **Paladin** (pre-selected) or Cleric |
| Best style Late, Wit ≥ Power | Cleric | 13 | **Cleric** (pre-selected) or Paladin |

- **163 of 270 Umas get the pick** (102 Pace, 61 Late). The four signal rows stay fixed: their racing profile already
  names one class (a front runner, an end closer, a Pace sprinter, a Wit-led closer), and they keep the Brawler's and
  the Summoner's share (opened to the pick, the Brawler could lose 14 callings and the Summoner most of its 33 Wit-led
  closers).
- **When:** the pick stays open until it is **confirmed**: by a tap, or by her **first won fight** (the owner's "once at
  Uma Level 1, at 0 Class Rank": she has no Class EXP before it). Owned Umas at save v26 start unconfirmed, with the
  pre-selection active, and a dot on the sheet until the owner confirms. Changing an unconfirmed pick is refused while
  she works (her trade moves with it). Once confirmed it never changes; she still switches class freely.
- **Literal reading** (Pace and Late both choose Mage or Spell Blade), shown for comparison: Late's 61 become hybrids or
  Mages, **no Uma's calling is a healer**: the Paladin and the Cleric lose every starter and every Flourish, and the
  healer trade (Fields · Workbench) has no Umas, while the Workbench processes every refined item. Physical hybrid would
  reach 38.5%. Not recommended.

### 10.2 What the pick sets (CP30)

| | Pace: Spell Blade ↔ Mage | Late: Paladin ↔ Cleric |
|---|---|---|
| **Her calling** (fight type) | Physical hybrid ↔ magical | Healer either way |
| **Her starting class** (a new unlock) | The pick | The pick |
| **Her trade** (PR1) | Forest · Armorer ↔ Monster Den · Lapidary | Fields · Workbench either way |
| **Her template** (variance) | Type by stride (Flashblade, Spellfencer, Longblade ↔ Flarecaster, Spellwright, Starkeeper); Flourish on as a Spell Blade ↔ as a Mage; her moon's lead ATK ↔ M.ATK; signature tip on her Arms kind's tree ↔ her Tome kind's | Shieldrunner, Warden, Stalwart ↔ Lamplighter, Mender, Pilgrim; ATK ↔ M.ATK; Arms ↔ Tome |
| **Starting armor and preset** | Physical ↔ magical | Physical ↔ magical |
| **Never** | Locks her class, changes a stat or lean, moves a class's rank, or moves her once confirmed | The same |

**On the sheet** ([overview page](previews/class-overview.html#calling)): a card under her name, "Her calling · choose
once", two class tiles with the pre-selected one marked ("Suggested: Power 96 over Wit 88"), what each sets in one line
each, the two trades' head counts in her world ("Forest · Armorer: 3 Umas · Monster Den · Lapidary: 6"), so a short
trade can be filled, and Confirm. "Her first win confirms it."

**Why:** the owner's moment and place; a default that is today's rule, so nothing changes for a player who ignores it;
the trades stay near a fifth each unless the owner moves them on purpose, and the head counts help him balance them.

## 11. What class selection affects

| Dimension | Tier 1 | Tiers 2–3 | Today |
|---|---|---|---|
| **Weapons and channel** | 3 slots: 3 + 0, 2 + 1, 1 + 2, 0 + 3 | The same; a form's extra kinds count only in a class that wields their channel | 5 slots |
| **Trees she uses** | Her three weapons' trees of this class | Deeper ([§6](#6-the-class-trees)) | 5 |
| **Hand:** power, MP, the pair, the extra hit, the farewell, the half-hand healer | Per class (§2.2) | Unchanged | The same |
| **Stat leans** | Per class | Unchanged (no specialization moves them) | The same |
| **Healing and its stat** | Paladin ATK, Cleric M.ATK; one healer a party | Unchanged | The same |
| **Armor** | Her class's half | Per piece for the four between | Per piece |
| **Accessories** | 1 Support, any type | + an Orb of any kind; + a second Support | 2 |
| **Standard preset** | 3 weapons, the half, a Support | + the Orb of her first slot; + a second Support | 5, half, Orb, support |
| **Limit Break power** | Brawler 2×, Mage 2.4×, hybrids 2.2×, healers 1.5× | Unchanged; LB+ is the halls' | The same |
| **Class Rank** | Per class; opens depths | The same, + D6 in Tier 3 | Opens depths and side points |
| **Specialization, mastery** | — | One of two (Tier 2); a mastery (Tier 3) | — |
| **Which foes she answers** | The twin sets of her three kinds (53–67% of foes on defaults) | Single kinds for regulars; Duals and picks widen it | Nearly all |
| **Her template** | Her Flourish only as her calling; her moon's lead only in classes of its channel | + her signature tip only as her calling | — |
| **Extra Stats** | The map is class-free; her class decides which offense moon counts | The same; Halo kinds are a free setting | Which nodes she picks |
| **Rift fronts** | Guided party by class; ward by channel | Each tier's Rift | The same |
| **What a switch costs** | Only the weapons she hasn't raised: 0–30 Weapon Gems | The same in her tier; promotion resets grades | Ranks per new kind |
| **Professions** | **None:** her trade follows her calling (and her pick), never her active class (CL14 kept) | The same | — |
| **Her starting class** | Her calling, or her pick | Kept through Ascend | Her style |
| **Auto** | Plays her three trees, her branch, her tip | + her specialization, two branches, the master slot | Five trees |

## 12. Provides

| To | What |
|---|---|
| **README §2** | The six classes; slots by channel (3 · 0 · 2 · 1 · 2 · 1 Arms); the template per tier; weaknesses by kind: twins in Tier 1, narrowing by rank (§4); the calling pick; SB1 applied to class sheets |
| **weapon-progression.md** | Three slots a class by channel; the defaults (§3.2) and presets (§5.2, the Orb of her first slot); every kind fits every slot of its channel in every tier; the class-switch cost from the defaults (§3.4); foes' single kinds from Tier 2 (regulars) and Tier 3 (sub-bosses), bosses' twins in every tier, which the forms answer; Break +1 lives only in the trees |
| **extra-stats-progression.md** | Each class's channels and leans; the hybrids' mirror on full maps, the hands the knob; the twins and single kinds the Halo's kind setting answers; SB1 sheets (§9) |
| **profession-progression.md** | Per Uma, per tier: 3 weapons, 5 armor (one half in Tier 1), accessories 1 · 2 · 3. Her trade follows her calling, which the Pace pick can move between Forest · Armorer and Monster Den · Lapidary (each fight type 0–37.8% for those two, the others fixed); the Late pick moves none |
| **Uma Templates pass (variance)** | The root's Flourish slot and the signature tip slot (§6.7); the calling's pick (§10) as the template's calling for Pace and Late Umas |
| **The world and the Rift** | The generator's weakness rule per tier and rank (§4.1–§4.2); the fronts' draws (§4.3); locks as today; the shield re-measure (§4.4) |
| **The Skills tab and the Uma sheet** | The tree drawn (CP23); the root plate (§6.7); the calling card (§10.2) |

**What weapon-progression must change because strikes are gone:**
1. Gear §3.1 "three slots a class, one per strike (CL1)" → **three slots by channel** (CP2): each slot holds any kind of
   its channel.
2. Gear §4.1 "a Dual keeps its slot's strike" → **a Dual keeps its first kind's slot, channel and tree;** its second kind
   is coverage under GE7, "any kind of a channel her class wields", not "any strike".
3. Gear §4.1 example "a Greatsword + Ice is a Heavy weapon that also answers an Ice-weak (Area) foe" → **"a Greatsword +
   Ice answers a foe weak to the Axe's twin, Ice"** (§4.1's twins; from Tier 2 a foe weak to Ice alone).
4. Gear's "Tier 2 and 3, where foes are weak to kinds of their strike (CL10)" → **foes' lists narrow by rank (CP6):**
   regulars one kind from Tier 2, sub-bosses from Tier 3, bosses keep their twins. The forms' worth is measured on that.
5. The defaults and presets (CL4 → CP3): the Spell Blade's Orb is a Lance Orb, the Summoner's an Ice Orb; the class-switch
   example "a Brawler turning Paladin raises one Blizzard Tome" → **raises a Lance and a Blizzard Tome** (they share the
   Greatsword).
6. The weapon tree preview's strike column, and the Gear tab's strike badges, → **channel badges** (Arms, Tome).
7. Forms' Might, the Orb and armor values are written as Tier 1 values × 1 / 1.8 / 2.6 (SB1).

## 13. Assumes

| From | Assumed | If not |
|---|---|---|
| The owner (2026-10-23) | The ten kinds are the damage and weakness types; strikes are dropped | — |
| weapon-progression.md | Weapons carry kinds; trees carry shape (GE4). Forms add kinds under GE7, keep the slot's channel, never touch Breaks. Weapons owned per kind, grades G0–G10 at Lv 5g − 4. Accessories 1 · 2 · 3 | The extra-kind rule moves into §3.3 |
| extra-stats-progression.md | A class-free map; her class decides which offense moon counts | — |
| profession-progression.md | Her trade follows her calling's fight type (PR1), now her pick's for Pace Umas | Professions' own rule names the trade; the pick then sets only class and template |
| Uma Templates pass | Fills the two slots of §6.7 | They stay empty: nothing else depends on them |
| The Rift | Its fronts, wards and guided parties as rift §5 (D178); its numbers re-measured for three weapons and twins | — |
| tier2-classes.md | The twelve passives (A5), the Ascend rule (A6), LB+ (A7), Limit Break power (A8), skill MP (A10) | — |
| The engine | v16 carries Tier 1: three weapons by channel (input checks), Tier 1's accessory count, the Flourish's MP twists; the weakness rule is the generator's, locks need nothing new. v17 carries Tier 2's nodes, Break tips, specializations; Tier 3's comes with Tier 3 | — |

## 14. Save impact

**Save v26 (the Tier 1 rework's one migration, every world):**

| Data | What happens |
|---|---|
| `classes[id].weapons` (5 → 3) | **The class's new defaults** (CP3), in every class. Grades reset anyway (GE15), so her old five carry nothing a default can't; her per-tree picks stay, so slotting an old kind back restores its branch |
| `classes[id].tree` | **Learned sides become picks** (SK13): B on a tree if she learned any node of that tree's B line (§6.5's mapping: Brawler and Mage by kind; the Spell Blade's "… Flurry" line; the Summoner's Bonded on Tome trees, Pack on Arms trees; the healers' "Heavy …" line), else A. Every other side is deleted; the third lines come back as Tier 2's C, not as picks |
| `classes[id].loadout` | Skills she no longer holds are removed; an empty loadout goes back to auto |
| `legacy` refs | Retired (tier2-classes A9) |
| Side points | Nothing stored, nothing to refund |
| **The calling pick** (new) | `OwnedUma.calling: { pick, confirmed }`, only for the 163 pick-eligible outfits; owned Umas get the pre-selection, unconfirmed. Everything else of the template stays derived (U13) |
| Starting class | New unlocks start in their calling or their pick |
| Class ids, Class Ranks, Hero seats, Bonds, Class Marks | Unchanged; Gear Marks → Class Marks one for one (GE15) |
| Accessories, armor, crafted weapons | The weapons doc's (GE15): deleted, refunded raw |
| Foes | Generated, never saved. The Tier 1 foe digest (`world/tier1-foes.test.ts`) moves on purpose, in the D-row; an open fight replays on its own engine |
| Stored fights | Unchanged: v6–v15 replay on their own engines (`RPG_ALL_NODES` keeps every retired node) |

**Save v27 (Tier 2):** a specialization per class (default by A6); branch C and tip picks (Power, Break, signature).
**Tier 3's save** with its design: two held branches a tree and the master slot.

**The refund:** nothing in classes or trees was crafted, so nothing to refund here.

**Code that retires:** `RPG_WEAPON_SLOTS = 5`, `RPG_CLASS_SLOTS`' five-slot rows, the side points
(`RPG_SIDE_POINTS_PER_LEVEL`, `rpgTreePointsEarned`, `rpgTreePointsSpent`), the side gates (`rpgSideNodeLevel`),
D166's points count, the generator's random Arms lists.

## 15. Pacing

The time to level, the EXP and rewards per fight and the time to gear an Uma on curve keep today's order (README §2):

- **Class progression keeps today's pace:** Class EXP 2E a win, the same depth gates, no points to save. A pick is free
  and instant.
- **Damage a turn:** an Uma acts once a turn whatever she holds. **The weak-act share falls** from nearly all (five
  weapons answer most lists) to about 60% (three weapons, two kinds a foe), while every foe keeps at least two answers
  in the default and guided parties. Breaks come slower; the simulation re-sets shields (§4.4, draft sub-boss 5, boss
  6) so rounds to the first Break stay within ±0.5 of today's at Lv 10, 30, 50.
- **The re-baseline** (README §9.5 item 1): an on-curve party (three default weapons, branch A, one Support, the full
  map, no Orb) wins every Tier 1 stage within 3 points of today's table; the Orb's −4% to −16% goes back through the foe
  budget.
- **The hybrids and healers:** 70/30 ± 5, the mirror ±5%, Paladin against Cleric ±10%, on full maps (§2.2).
- **The fronts:** inside rift §11's bands with three weapons and twins; no single Uma Breaks a Duel boss in one act
  (each class's best default act checked).
- **Branches:** a B or C branch beats A by 10–20% in its context; any mix of branches within ±5 points of win rate of
  all-A; a Sweep Spell Blade or a Hunt Summoner within ±15% of the mirror in its context.
- **Tier 2:** the specializations, the Orb, branch C, the Break tips and the narrowed regulars are priced in Tier 2's
  term (Z4, XR15). **Tier 3:** depth 6, two branches and the masteries in Tier 3's.
- **The calling pick** moves no EXP, only who works where; the head counts on the card keep the trades near a fifth.

## 16. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **CP1** The six classes | The six of classes v2 in every tier, with their identities, hands and Limit Break power; one healer a party | Twelve Tier 2 classes (tier2-classes A1) | The party shapes and the mirrors rest on six; depth comes from the specialization |
| **CP2** Weapon slots | **Three in every tier, typed by channel only:** Brawler 3 Arms, Mage 3 Tomes, Spell Blade and Paladin 2 Arms + 1 Tome, Summoner and Cleric 1 Arm + 2 Tomes; any three different kinds of those channels | Strike-typed slots (CL1, retired with the strikes); untyped; five | The owner's three; the channel split is the classes' identity; no strike left to type by |
| **CP3** Default weapons | Brawler Greatsword, Axe, Katana; Mage Fire, Thunder, Light; Spell Blade Lance, Bow, Dark; Summoner Blizzard, Dark, Greatsword; Paladin Greatsword, Lance, Blizzard; Cleric Light, Dark, Axe | The ring for both pure classes; today's first three; CL4 | All ten kinds in the five types; every guided party answers every foe twice; Iron and Arcane mirror; the healers keep their specials |
| **CP4** "Balanced" | **Four checks:** the five types hold all ten kinds; the default party answers every Tier 1 foe at least twice; each guided party answers each of its foes at least twice; any class answers any twins with one pick | At least one answer; win rates only | Checkable by script before a fight; win rates stay the simulation's |
| **CP5** Tier 1 weaknesses | **Her twins:** the element that beats hers on the ring and its twin Arm; two elements read her lead first; Light + Dark the Bow and the Katana | One kind by role; the ring's element and a drawn Arm; strikes | One rule, two icons, an answer in each channel on every foe; the Arm read from the element |
| **CP6** Later tiers | **Narrow by rank:** Tier 2 regulars to one kind (the element for strikers and guards, the Arm for casters and skirmishers); Tier 3 sub-bosses too; **bosses keep their twins** | Twins in every tier; one kind for all; strike × channel | Depth for the forms and picks; every Uma can always answer a boss |
| **CP7** The Rift's fronts | Today's counts and wards; the Duel's and the Horde's draws as twins; Arcane to one element from Tier 2; the Horde narrows by rank | Independent draws (the Duel party can miss Bow + Dark) | Every guided party answers every foe on defaults |
| **CP8** Locks and shields | Locks as today (kinds from her weaknesses; the Duel's mixed sets); shields as today, re-measured for the lower weak share (draft sub-boss 6 → 5, boss 8 → 6) | Shields by strike (CL9, retired); a lock that breaks to any weak act (CL8) | No engine change; the simulation holds rounds to the Break |
| **CP9** The hybrids and healers on 2 + 1 | Hands unchanged; the mirror re-checked on full maps (±5%, 70/30 ± 5), the hands the knob, the Summoner's Arms hand first; Paladin vs Cleric ±10% | New hands now | One act is one pair whatever the slots (CL5 kept) |
| **CP10** The template per tier | Weapons 3 · 3 · 3; armor 5, her class's half in Tier 1, per piece for the four between from Tier 2; accessories 1 · 2 · 3 (Support; + Damage; + Support) | A fourth weapon or a sixth armor later | Depth from forms, trees and Extra Stats, not slots (CL6, CL7 kept) |
| **CP11** Presets | §5.2's: defaults, her half, a Support; + the Orb of her first slot; + a second Support | The Orb of her best grade | One tap dresses any class at any tier |
| **CP12** Equippable kinds | Every kind of a slot's channel, in every tier; a form's extra kind counts only in a class that wields its channel (GE7) | Per-class kind lists | Free picks keep coverage a party puzzle; the channel rule keeps the Brawler physical |
| **CP13** What a tree is | One per weapon slot, three a class, under a class root; the catalog stays class × kind | One tree per class; one per kind for every class | Ids and replays stay; one tree on screen (SK1) |
| **CP14** What a node costs | Nothing, at any tier; branches exclusive, free, swappable; A the default | Points against a budget | Removes the asymmetry (SK2) |
| **CP15** What a fork changes | Reach, hits, support or Breaks; never a few percent alone | Free-form variants | Real options (SK3) |
| **CP16** Gates | Class Rank only: 1, 10, 20, 30, 40, 50 | Weapon grade; Uma Level | Today's pace, one bar (SK4) |
| **CP17** Kinds in trees | Never: trees give shape, power, MP, effects | Element branches | The Brawler stays physical (SK5) |
| **CP18** Tier 1 trees | Trunk D1–D2, one fork at D3 into A and B (by kind for Brawler and Mage, by class for the others); 8 nodes, all in today's catalog | No fork; a fork at every depth | One real option a weapon, no new content (SK6) |
| **CP19** Tier 2 trees | Branch C (Q17's Sweep and Hunt on the leading half; Focused, Mighty, Wide; the third lines); a Power or Break tip fork on every branch | Points (A3); weapon arts | One more pick a tree; Break +1 has one home (SK7, SK9) |
| **CP20** Tier 3 trees | Depth 6 capstones at Class Rank 50; two branches held; the master slot holds a capstone | A capstone fork; depth 6 alone | Versatility and depth (SK8) |
| **CP21** Names | Today's catalog names; **SK14's renames reverted**; new nodes by rule (§6.6); the Summoner's Berserker and Jotun Warlord become Marauder and Jotun King | "Rapid …", "Potent …" | The renames existed only for the strikes |
| **CP22** Equipped slots | 3 → 7, 3 → 10, 10 and a master slot | Two a tree | Fits 15, 15 and 30 held (SK12) |
| **CP23** The Skills tab | A real tree: root plate, three weapon tabs, nodes and lines, the branch sheet; the points UI retires | Rows per depth | Reads as a tree (SK10) |
| **CP24** Template-only slots | The root's ★ Flourish (every tier) and the ★ signature tip (Tier 2 on), marked, filled by the Uma Templates pass | A template branch per tree | Two small fixed places (SK11) |
| **CP25** Class Rank | Today's: 2E a win, Marks and Manuals, per class per world, reset at promotion | Gates by Uma Level | Nothing to change; it already paces depths |
| **CP26** Specializations | Tier 2: the twelve passives as written, one of two a class, swapped freely, preselected at Ascend by A6's rule, no lean change | Twelve classes; leans ±0.1 | The content without the machinery (CL11) |
| **CP27** Masteries | Tier 3: Unstoppable, Resonance, Spellbind, Menagerie, Last Stand, Overflow (§7.3), drafts priced by Tier 3's simulation | Designed later; twelve masters | One mechanic a class, under the same rules as the passives (CL12) |
| **CP28** Halls | Unchanged: six halls, 24 Limit Breaks, Bonds per world, LB+ at Bond 10 from Tier 2, power by class | A Limit Break of her class's own | They already are class progression; kinds make them coverage |
| **CP29** The calling pick | A one-time pick on the Uma sheet: **Pace Spell Blade or Mage, Late Paladin or Cleric**, Power vs Wit pre-selecting; confirmed by a tap or her first win; owned Umas start unconfirmed; the four signal rows fixed | The literal reading (Pace and Late both Mage or Spell Blade); no pick | The owner's moment; healers keep their callers; the default is today's rule |
| **CP30** What the pick sets | Her calling, starting class, trade, template channel and type, armor and preset; never her class afterwards (a class switch moves no job: CL14 kept) | The pick sets only her start | One signal, as the calling was meant to be |
| **CP31** The save | v26: weapons to the new defaults, sides to picks, loadouts pruned, `legacy` retired, the calling pick stored; v27: specializations and Tier 2 picks | Keep her best old kinds per channel | Grades reset anyway; defaults are balanced; her branch picks per tree are kept |

**The first round's calls, mapped:**

| Old | Now | | Old | Now |
|---|---|---|---|---|
| CL1 three slots by strike | **CP2** (by channel) | | SK1 a tree per slot | CP13 |
| CL2 Tier 1 weak to a strike | **CP5** (twins) | | SK2 no points | CP14 |
| CL3 balanced, three tests | CP4 (on kinds) | | SK3 what a fork changes | CP15 |
| CL4 defaults by strike | **CP3** | | SK4 Class Rank gates | CP16 |
| CL5 hands, mirror on full maps | CP9 (kept) | | SK5 no kinds in trees | CP17 |
| CL6 template per tier | CP10 (kept) | | SK6 Tier 1 shape | CP18 |
| CL7 Tier 1's Support | CP10 (kept) | | SK7 Tier 2 shape | CP19 |
| CL8 a lock breaks to a weak act | **CP8** (locks as today) | | SK8 Tier 3 shape | CP20 |
| CL9 shields by strike | **CP8** (dropped) | | SK9 Q17's crossovers | CP19 |
| CL10 the strike stays, kinds narrow | **CP6** (narrow by rank) | | SK10 the Skills tab | CP23 |
| CL11 specializations | CP26 (kept) | | SK11 template slots | CP24 |
| CL12 masteries | CP27 (drafted) | | SK12 equipped slots | CP22 |
| CL13 start in her calling | CP29 (+ the pick) | | SK13 the save | CP31 |
| CL14 class and professions | CP30 (kept) | | SK14 renames | **CP21 (reverted)** |
| CL15 the strikes' names | **Dropped** (no strikes) | | | |

In bold, the calls the owner's 2026-10-23 change replaced.
