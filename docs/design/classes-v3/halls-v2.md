# Halls v2: the Halls of Heroes' Limit Break rework

> **For the owner's review, 2026-10-29. Nothing here is built.** The owner's request of 2026-10-29 ("Hall of Heroes
> Improvements"): lore for each hall, the Limit Breaks he named, the rest filled in, and whether a hall still needs four
> seats now that Classes v3 splits the classes. It is [Classes v3](classes-v3.md)'s companion and is aligned with its
> draft of the same day: the class list and ids, the twins, the weapon shapes (Katana and Light double, Bow and Dark a
> volley) are Classes v3's, and the halls ride its engine v19 and save v32 (its §15 is the seam). Calls are
> **HV1–HV25**, each with a recommendation ([§10](#10-decisions)). No open questions.
>
> **What it proposes, in seven lines:**
> 1. **Five halls, one per family:** the Warrior Dojo, the Mage Tower, the Spell Blade Salle, the Summoner Circle and the
>    Healer Sanctum, in place of today's six ([§2.1](#21-five-halls-one-per-family-hv1)).
> 2. **Four seats a hall, 20 Limit Breaks.** Two seats would leave the Bow, the Katana and Dark in one hall each and
>    give every class in a shared hall a single Limit Break ([§2.2](#22-four-seats-not-two-hv2)).
> 3. **A Limit Break carries its own power**, so the owner's order holds whoever casts it: **the Greatsword and Fire
>    Ultimates 2.9×**, **the tri attacks 2.5×** (3.0× on two weaknesses, a bit over the Ultimate), the other seats
>    2.2×, **the Spell Blade's 2.0×** at random, **the healers' 2.0×** and a one-stack blessing or curse. The mean,
>    2.23×, is today's 2.2× ([§3](#3-power-a-limit-breaks-own-hv5hv7)).
> 4. **The Warrior Dojo and the Mage Tower are twins seat by seat:** a tri attack, an Ultimate, a double-hit seat (Katana
>    and Light) and a volley seat (Bow and Dark). The Warrior Dojo is the owner's Fighter Hall: "Fighter" is a
>    master-data name, so it takes the Warrior root's name, as Classes v3 does (CV2) ([§4.1](#41-warrior-dojo),
>    [§4.2](#42-mage-tower)).
> 5. **The owner's eight pairs are built as he gave them:** the Spell Blade's familiar pacts strike five times at random
>    foes (Katana and Light strikes land twice), the Summoner's familiars hit every foe three times, the Paladin's
>    Archangel and Archdemon strike one foe; the Cleric's **Seraph** and **Thunder Fiend** follow them on the kinds the
>    halls hold least ([§4.3](#43-spell-blade-salle)–[§4.5](#45-healer-sanctum)).
> 6. **Every kind sits in at least two halls**, and every class has 23 to 56 pairs of Heroes that answer every twin set
>    her weapons miss ([§5](#5-coverage-hv17)).
> 7. **Nothing earned is lost:** seat n stays seat n, id and all, in the four halls that continue; the Paladin Bastion and the Cleric
>    Chapel fold two seats into one, keeping each Uma's higher Bond, and no Hero leaves without a Limit Break while
>    there is room ([§7](#7-the-migration-hv18hv21-hv24)).
>
> **Page** (full desktop, light and dark; every name on it is invented): [the halls, the damage order, coverage and
> the migration](previews/halls.html).
>
> **Sources:** the manual's [Halls of Heroes](../../game/heroes.md), [combat](../../game/combat.md#limit-breaks) and
> [classes](../../game/classes.md); [class progression §8](../tier-rework/class-progression.md#8-halls-of-heroes-and-limit-breaks-cp28-cp35)
> (CP28, CP35); the code: `rpg/heroes.ts`, `rpg/hero-id.ts`, `rpg/battle/limit.ts`, `save/heroes.ts`,
> `hub/places.ts`, `apps/web/src/places/halls/`. Live today: engine v18, save v31.

## The owner's points

| The owner's point (2026-10-29) | Answered in |
|---|---|
| "Not a full rework, but we need some optimization" | The Hall's rules stay (Heroes, Learners, Bonds, strength); the halls, seats and Limit Breaks change ([§6](#6-bonds-heroes-learners-and-lb-hv22-hv23)) |
| "We may still want to keep 4 seats and 4 authored skills … or if we really need to down-size to 2" | **Four** ([§2.2](#22-four-seats-not-two-hv2), HV2): what each seat adds, and the two-seat halls drawn out |
| "This may change now with the new class rebalance (Classes v3)" | Halls by the owner's five families (Classes v3's five Tier 0 lines), seats by its eight Tier 1 classes ([§2](#2-the-halls-and-seats)); what it must provide ([§8](#8-what-classes-v3-must-provide)) |
| **Fighter Hall:** power from self-training; skills about weapon damage | The **Warrior Dojo** ("Fighter" is a master-data skill name; the Warrior root's name, Classes v3 CV2): five Arms, no element ([§4.1](#41-warrior-dojo)) |
| Tri-weapon (Greatsword, Axe, Lance): second highest, a bit higher on several weaknesses; the tri-element's mirror | **Triad Onslaught**, 2.5×; 3.0× on two weaknesses, over the Ultimate's 2.9× ([§3.4](#34-the-owners-order-checked)) |
| Greatsword Ultimate: the highest hitting skill in the game | **Ten Thousand Swings**, 2.9× in one hit, 3.77× on its weakness ([§3.3](#33-the-damage-order-with-numbers)) |
| **Mage Hall:** power from self-study; tri-element (Fire, Ice, Lightning); Fire Ultimate mirroring the Greatsword's | **Triad Tempest** and **Ten Thousand Candles**, the Dojo's numbers exactly ([§4.2](#42-mage-tower)) |
| **Spellblade Hall:** pacts with familiars that empower weapon attacks; multi-hit; flavor in the names; class identity in damage split and hits; slightly less hard than others, multi-hit to random foes. Katana + Lance, Katana + Light (Arms), Light + Lightning, Light + Katana (Tome) | Four **pacts** (Shrike, Firefly, Storm Heron, Wisp): five strikes at random foes, the lead kind 60%, Katana and Light strikes landing twice, 2.0× ([§4.3](#43-spell-blade-salle)) |
| **Summoner Hall:** familiars summoned, AoE; as hard as the others in AoE capacity (maybe multi-hit AoE). Axe + Bow, Axe + Dark (Arms), Dark + Ice, Dark + Axe (Tome) | Packs for the Arms Summoner, one great familiar for the Tome Summoner; three hits on every foe, the standard 2.2×: on three foes nearly what the Ultimate deals on its weakness ([§4.4](#44-summoner-circle)) |
| **Healer Hall:** power from a followed deity; damage-focused, minor side effects if any; Archangel Summon (Lance + Light, single target), Archdemon Summon (Axe + Dark, single target); figure the less used combinations; the Cleric follows the Paladin with variations | **Archangel's Judgment** and **Archdemon's Toll** as he gave them; the Cleric's **Seraph's Pyre** (Fire + Greatsword) and **Thunder Fiend's Barrage** (Lightning + Bow) on the least-held kinds; one stack of a blessing or a curse each ([§4.5](#45-healer-sanctum)) |

## 0. At a glance

| | Today (engine v18) | Halls v2 |
|---|---|---|
| **Halls** | 6, one per class | **5, one per family:** Warrior Dojo, Mage Tower, Spell Blade Salle, Summoner Circle, Healer Sanctum |
| **Seats** | 4 a hall, 24 | **4 a hall, 20**: two per Tier 1 class in the shared halls, four for the Brawler and the Sorcerer |
| **Who sits** | Any Uma, any hall | The same; each seat names its home class |
| **Power** | Her class's (Brawler 2×, Mage 2.4×, hybrids 2.2×, healers 1.5×), every seat alike | **The Limit Break's own** × her class's scale (1; the Paladin and the Cleric 0.75): Ultimates **2.9×**, tri **2.5×**, others **2.2×**, Spell Blade **1.9×** at random (2.0×), healers **2.0×** |
| **Shapes** | One foe, every foe, random, splash; two-kind hits fused | One foe, random multi-hit, every foe (multi-hit), and Classes v3's volley (the tapped foe, then every other); Katana and Light strikes land twice; no fused hits |
| **Kinds a seat** | 1 to 5 (two rainbow seats) | 1 to 3 |
| **Most hits on one foe** | 12 (Chaos Rain) | 10 (Firefly Pact, Wisp Pact) |
| **Support** | Four seats mend, Barrier, cleanse or revive | **None:** damage only; the healers' four carry one stack of Brave, Faith, Armor Break or Mind Break |
| **Heroes, Learners, Bonds** | 10 Learners a Hero, 2 Heroes a Learner, 50% + 5% a Bond Level | **Unchanged** |
| **LB+ (Tier 2)** | 24 authored extras | **One rule:** +20% at Bond 10 (Tier 2, deferred) |
| **Save** | v31 | **v32, with Classes v3:** seats renamed or merged, Bonds carried |

**The five halls and their twenty seats** (owner-given in **bold**; power × her open depth's single-target power):

| Hall | Seat 1 | Seat 2 | Seat 3 | Seat 4 |
|---|---|---|---|---|
| **Warrior Dojo** (Brawler) | **Triad Onslaught** · Greatsword, Axe, Lance · one foe · 2.5× | **Ten Thousand Swings** · Greatsword · one foe, one hit · 2.9× | Echo Draw · Katana · one foe, 3 × 2 cuts · 2.2× | Hundred-Arrow Rain · Bow · volley: 4 on her foe, 2 on each other · 2.2× |
| **Mage Tower** (Sorcerer) | **Triad Tempest** · Fire, Ice, Lightning · one foe · 2.5× | **Ten Thousand Candles** · Fire · one foe, one hit · 2.9× | Echo Ray · Light · one foe, 3 × 2 rays · 2.2× | Hundred-Shadow Rain · Dark · volley: 4 on her foe, 2 on each other · 2.2× |
| **Spell Blade Salle** (Arms 1–2, Tome 3–4) | **Shrike Pact** · Katana + Lance · random ×8 · 1.9× | **Firefly Pact** · Katana + Light · random ×10 · 1.9× | **Storm Heron Pact** · Light + Lightning · random ×8 · 1.9× | **Wisp Pact** · Light + Katana · random ×10 · 1.9× |
| **Summoner Circle** (Arms 1–2, Tome 3–4) | **Centaur Warband** · Axe + Bow · every foe ×3 · 2.2× | **Gargoyle Flock** · Axe + Dark · every foe ×3 · 2.2× | **Frostshade Wyrm** · Dark + Ice · every foe ×3 · 2.2× | **Night Colossus** · Dark + Axe · every foe ×3 · 2.2× |
| **Healer Sanctum** (Paladin 1–2, Cleric 3–4) | **Archangel's Judgment** · Lance + Light · one foe · 2.0× + Brave 1 | **Archdemon's Toll** · Axe + Dark · one foe · 2.0× + Armor Break 1 | Seraph's Pyre · Fire + Greatsword · one foe · 2.0× + Faith 1 | Thunder Fiend's Barrage · Lightning + Bow · one foe · 2.0× + Mind Break 1 |

## 1. Today

The [Halls of Heroes](../../game/heroes.md) are the only source of Limit Breaks (D112): six class halls, four seats
each, 24 Limit Breaks. A Hero uses her seat's at 100%; up to ten Learners sit under her, each under two Heroes at
most, at 50% + 5% a Bond Level. Its power is **the caster's class's** Limit Break power × her open depth's single-target
power, shared among the seat's hits (`heroLimitPower(classId)`, `heroLimitSkills`); every-foe hits take the area share
0.55, random hits ×1.05. Its kinds decide weaknesses and locks whatever she wields, and a Learner hits with her higher
offense (C3), so a Limit Break is how a Learner reaches kinds her three weapons miss (CP28).

What no longer fits:

- **Five-weapon seats on three-weapon classes.** Arsenal Rush and Elemental Cascade strike with all five Arms or
  Tomes; the owner retires them for **three-kind** attacks.
- **Every seat deals the same total.** Power belongs to the caster's class, so the owner's order (an Ultimate first, a
  tri attack second, the Spell Blade's a little lower) can't be expressed: a seat only reshapes the same number.
- **Six halls for Classes v3's three roots, five Tier 0 classes and eight Tier 1 classes.** A hall per Tier 1 class
  would be eight; the owner's message names five, one per family.
- **Support on four seats** (Dawn Hymn, Frost Sanctuary, Rampart Charge, Valkyrie Lances). The owner wants the
  healers' Limit Breaks damage-focused.
- **Today's weapon shapes and twins.** Classes v3 makes the Katana and Light **double** (two hits) and the Bow and Dark a
  **volley** (the tapped foe takes 0.8 of the power, every other foe a 0.35 splash), and re-pairs the twins to
  Katana–Light and Bow–Dark; Moon Fox, Eclipse Volley and Twilight Eclipse were drawn on the old pairs.

## 2. The halls and seats

Built in H129 (D248), live from H134.

### 2.1 Five halls, one per family (HV1)

| Hall | The owner's hall · its Tier 0 | Home classes (Tier 1), seats | Lore: where the power comes from | Hall and place ids |
|---|---|---|---|---|
| **Warrior Dojo** | Fighter Hall · Recruit | Brawler, 1–4 | **Self-training.** Each Limit Break is a technique drilled until it became one motion: the Arms, nothing else | `brawler`, `brawler-dojo` (kept) |
| **Mage Tower** | Mage Hall · Apprentice | Sorcerer, 1–4 | **Self-study.** Each Limit Break is a spell read and copied until it answered: the elements, nothing else | `mage`, `mage-tower` (kept) |
| **Spell Blade Salle** | Spellblade Hall · Duelist | Arms Spellblade 1–2, Tome Spellblade 3–4 | **Pacts with familiars** that live in the blade and lend it their speed: many strikes, landing wherever the familiar flies | `spellblade`, `spell-blade-salle` (kept) |
| **Summoner Circle** | Summoner Hall · Caller | Arms Summoner 1–2, Tome Summoner 3–4 | **The familiars themselves, summoned:** a pack of small ones that strike with weapons, or one great one that breathes magic over the field | `summoner`, `summoner-circle` (kept) |
| **Healer Sanctum** | Healer Hall · Acolyte | Paladin 1–2, Cleric 3–4 | **A followed deity, called down once to strike.** Paladins answer to the Archangel and the Archdemon, Clerics to the Seraph and the Thunder Fiend: one of each side for each order | `healer`, `healer-sanctum` (new; the Paladin Bastion and the Cleric Chapel) |

**The names:** the owner's Fighter Hall shows as the **Warrior Dojo**, as Classes v3 shows his Fighter root as Warrior
("Fighter" is an exact master-data skill name, CV2). Every hall, Limit Break, deity and familiar name here was checked
against every string in the local master-data release, exact and inside a longer string, counts only: none matches.

**Why five:** they are the owner's five, one for each of Classes v3's Tier 0 lines, and each holds a lore of its own. A hall
per Tier 1 class would be eight buildings and 32 seats (or 16 at two seats), with the Spell Blade's and the Summoner's
two classes in separate halls although the owner gave their Limit Breaks as one set of four. A family hall keeps a
Learner's choice readable: five buildings, twenty seats, each class's own seats side by side.

**On the Learning page** (HV21): physical-led halls on the left and magic-led on the right, as today: the Warrior Dojo
and the Mage Tower at the top, the Spell Blade Salle and the Summoner Circle below them, the Healer Sanctum in the
middle, the Observatory under it. The Sanctum wears the `knights-bastion` frame the Paladin Bastion wears today; a
temple of its own is an optional art packet (HV-F).

### 2.2 Four seats, not two (HV2)

The owner asked whether a hall really needs four seats. **It does,** for five reasons:

| What a seat adds | With four seats | With two (the owner's two in the pure halls, one per class in the others) |
|---|---|---|
| **Kinds (coverage)** | Every kind in two halls or more; 36 kind slots over 20 seats | The **Bow, the Katana and Dark** in one hall each; no Bow, Katana, Light or Dark in the two pure halls |
| **Shapes** | The pure halls hold one foe (tri, Ultimate), double hits and a volley | The pure halls hold one-foe Limit Breaks only; no crowd answer outside the Summoner Circle |
| **Class fit** | Each Tier 1 class has **two** home seats in the shared halls, four in the pure ones | One home seat per class in the shared halls: an Arms Spellblade Hero has no choice at all |
| **The owner's own list** | His eight pairs for the Spell Blade and the Summoner, and the Paladin's two plus the Cleric's, are exactly four a hall | Half of what he gave would go unbuilt |
| **Roster** | 20 Heroes, 200 Learner places | 10 Heroes, 100 places: the Ultimates' seats fill and the rest of a large roster can't inherit |

**Bond pacing doesn't depend on the count:** a Learner earns Bond with each of her two Heroes per won fight whatever the
number of seats, so four seats a hall changes only how many choices she has, not how fast she grows. **24 → 20** is
the real reduction: the healers' two halls become one.

### 2.3 Who sits where, and the seat order (HV3, HV4)

- **Any Uma may sit in any seat,** Hero or Learner, whatever class she fights as (unchanged). The seat names its
  **home class** for theme and fit: a Hero's hits use her own channel's offense (ATK for an Arm, M.ATK for an
  element), so the class whose channel leads the seat makes its best Hero. A Learner hits with her higher offense (C3),
  so for her the home class doesn't matter: what matters is the kinds the seat adds.
- **No Tier 0 hall.** A Tier 0 (Recruit, Apprentice, Duelist, Caller, Acolyte) is a ten-rank start, and its Umas sit in
  any seat like anyone; each hall follows one Tier 0's line by name and lore only. A Hero who promotes keeps her seat.
- **Seat order:** the owner's two first. In the Warrior Dojo and the Mage Tower, **seat 1 the tri attack, seat 2 the
  Ultimate, seat 3 the double hits, seat 4 the volley**, so the two halls read as twins seat by seat. In the shared
  halls, **the Arms-led class's two, then the Tome-led class's two**, in the owner's order; in the Healer Sanctum, the
  Paladin's two, then the Cleric's.

## 3. Power: a Limit Break's own (HV5–HV7)

Built in H129 (D248), live from H134.

### 3.1 The formula (HV5)

> **Damage at 100% = the Limit Break's power × her class's Limit Break scale × her open depth's single-target power,**
> shared among its hits by their shares; every-foe hits at the area share (0.55 a foe), random hits ×1.05. Then the
> damage stack as for any hit ([combat](../../game/combat.md#damage)).

- **The Limit Break's power** is the seat's own number (the ladder below), so the owner's order holds whoever casts it.
- **Her class's scale:** **1** for every class but the two healers: the five Tier 0s (an Acolyte is no healer, Classes
  v3 CV22), the Brawler, the Sorcerer and the four hybrids; **0.75** for the Paladin and the Cleric, who act at
  half power and carry the party's support. A healer on a Healer seat lands 1.5×, today's healer Limit Break exactly.
  The scale is Classes v3's to set per class; this is the draft the simulation starts from (HV-D).
- **Her open depth** (the deepest her Class Rank opens; for a Tier 0, its one skill's power at her Class Rank, 1.52 →
  2.20, Classes v3 §2.2), **strength** (100% a Hero, 50% + 5% a Bond Level a Learner),
  **no Skill Rank**, **no MP**, the gauge: all as today.

### 3.2 The ladder (HV6)

| Rung | Limit Breaks | Power | Why there |
|---|---|---|---|
| **Ultimate** | Ten Thousand Swings, Ten Thousand Candles | **2.9×** in one hit | The owner's highest; one blow, so it's the finisher on a Broken foe or one weak to it. At 2.9× no other seat passes it on its weakness (Echo Draw's 2.86×) |
| **Tri** | Triad Onslaught, Triad Tempest | **2.5×** in three hits | Second; at two weaknesses 3.0×, a bit over the Ultimate on a foe not weak to it (§3.4) |
| **Standard** | Echo Draw, Echo Ray, Hundred-Arrow Rain, Hundred-Shadow Rain (volleys), the Summoner Circle's four (sweeps) | **2.2×** | Today's hybrid Limit Break; "as hard as the others", in AoE capacity for the Summoner's |
| **Spell Blade** | The four pacts | **1.9×**, ×1.05 at random: **2.0×** | "Slightly less hard than the others", for their many hits at random foes |
| **Healer** | The Healer Sanctum's four | **2.0×** + one stack | Damage-focused; the stack is the minor side effect (worth about +6% on the cast or +10% on the party's channel for two rounds) |

**The mean** over the twenty, the Spell Blade's random bonus and the healers' own Breaks counted, is **2.23×**, today's
damage classes' 2.2× (Brawler 2.0, Mage 2.4, the hybrids 2.2). A Brawler on her own hall gains (her four average
2.45×, from 2.0×); a Sorcerer stays (2.45× from 2.4×); the Summoner keeps 2.2×; the Spell Blade gives up 9% (2.0×
from 2.2×) for 8–10 hits; the healers keep 1.5×. The simulation confirms it (HV-D).

### 3.3 The damage order, with numbers

At 100%, a damage class (scale 1), on a Broken foe (an unbroken one halves every row alike), before her stats; × her
open depth's single-target power (4.6 at Class Rank 40). **% Ult** is against the Ultimate's 2.9×. "Weak" is the best
Tier 1 case: every kind of a one-kind seat; two of a tri's three (a Tier 1 foe holds at most two Arms and two
elements, so never three); both kinds of a two-kind seat.

| # | Limit Break | Hall | Shape · hits | Power | One foe | % Ult | One foe, weak | 3 foes (total) | 5 foes (total) | Chips on one weak foe |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ten Thousand Swings | Warrior | One foe · 1 | 2.9 | **2.90** | 100% | **3.77** | 2.90 | 2.90 | 1 |
| 1 | Ten Thousand Candles | Mage | One foe · 1 | 2.9 | **2.90** | 100% | **3.77** | 2.90 | 2.90 | 1 |
| 3 | Triad Onslaught | Warrior | One foe · 3 | 2.5 | 2.50 | 86% | 3.00 (one weak 2.75) | 2.50 | 2.50 | 2 |
| 3 | Triad Tempest | Mage | One foe · 3 | 2.5 | 2.50 | 86% | 3.00 (one weak 2.75) | 2.50 | 2.50 | 2 |
| 5 | Echo Draw | Warrior | One foe · 6 | 2.2 | 2.20 | 76% | 2.86 | 2.20 | 2.20 | 6 |
| 5 | Echo Ray | Mage | One foe · 6 | 2.2 | 2.20 | 76% | 2.86 | 2.20 | 2.20 | 6 |
| 7 | Archdemon's Toll | Healer | One foe · 4 | 2.0 | 2.12 | 73% | 2.76 | 2.12 | 2.12 | 4 |
| 7 | Thunder Fiend's Barrage | Healer | One foe · 4 | 2.0 | 2.12 | 73% | 2.76 | 2.12 | 2.12 | 4 |
| 9 | Archangel's Judgment | Healer | One foe · 4 | 2.0 | 2.00 | 69% | 2.60 | 2.00 | 2.00 | 4 |
| 9 | Seraph's Pyre | Healer | One foe · 4 | 2.0 | 2.00 | 69% | 2.60 | 2.00 | 2.00 | 4 |
| 11 | Shrike Pact | Spell Blade | Random · 8 | 1.9 | 2.00 | 69% | 2.59 | 2.00 | 2.00 | 8 |
| 11 | Firefly Pact | Spell Blade | Random · 10 | 1.9 | 2.00 | 69% | 2.59 | 2.00 | 2.00 | 10 |
| 11 | Storm Heron Pact | Spell Blade | Random · 8 | 1.9 | 2.00 | 69% | 2.59 | 2.00 | 2.00 | 8 |
| 11 | Wisp Pact | Spell Blade | Random · 10 | 1.9 | 2.00 | 69% | 2.59 | 2.00 | 2.00 | 10 |
| 15 | Hundred-Arrow Rain | Warrior | Volley · 4 + 2 a foe | 2.2 | 1.76 | 61% | 2.29 | 3.30 | 4.84 | 4, and 2 a foe |
| 15 | Hundred-Shadow Rain | Mage | Volley · 4 + 2 a foe | 2.2 | 1.76 | 61% | 2.29 | 3.30 | 4.84 | 4, and 2 a foe |
| 17 | Centaur Warband | Summoner | Every foe · 3 | 2.2 | 1.21 | 42% | 1.57 | **3.63** | **6.05** | 3 a foe |
| 17 | Gargoyle Flock | Summoner | Every foe · 3 | 2.2 | 1.21 | 42% | 1.57 | **3.63** | **6.05** | 3 a foe |
| 17 | Frostshade Wyrm | Summoner | Every foe · 3 | 2.2 | 1.21 | 42% | 1.57 | **3.63** | **6.05** | 3 a foe |
| 17 | Night Colossus | Summoner | Every foe · 3 | 2.2 | 1.21 | 42% | 1.57 | **3.63** | **6.05** | 3 a foe |

- **Random foes:** the pacts' total is 2.0× however many foes stand; on a lone foe every strike lands on her.
- **Volleys** (Classes v3's Bow and Dark): her foe takes 0.8 of the power, every other foe 0.35, so 1.76 + 0.77 a foe.
  They lead on one or two foes (2.53 on two, against a sweep's 2.42); **from three foes the Summoner's sweeps lead**.
- **Two-kind seats on one weakness:** the lead kind weak, ×1.18 (a pact 2.35, the Archangel 2.36, the Archdemon 2.50);
  the second kind only, ×1.12. A Summoner seat: lead ×1.20, second ×1.10.
- **A healer** casts every row at ×0.75: Ten Thousand Swings 2.2×, a Healer seat 1.5×.
- **A Learner** at Bond 0 casts every row at half: the Ultimate 1.45×, about a turn's damage, as today.

### 3.4 The owner's order, checked

| The owner's rule | The numbers | Holds |
|---|---|---|
| The Greatsword Ultimate is the highest hitting skill in the game | 2.9× in **one hit** (the next largest hit in the game is the tri's 0.83×). **On any one foe no Limit Break out-damages it,** except a tri attack on two weaknesses the Ultimate doesn't share (below). On its own weakness, 3.77×, nothing comes near | Yes |
| The Fire Ultimate mirrors it, thematically and in effect | Identical: one Fire hit, 2.9×, one chip | Yes |
| The tri attacks are second | 2.5× unweak, second on the ladder; 2.75× on one weakness, under the Ultimate's 2.9×; their Tier 1 best, 3.0×, is second only to the Ultimate's 3.77× | Yes |
| … "if it somehow hits multiple weaknesses this could [be] higher by a bit" | On a foe weak to two of its three kinds but not to the Ultimate's: **3.00× against 2.90×, +3%**. On a foe weak to the Greatsword the Ultimate stays first | Yes, by the plain weak rule (HV7) |
| The Spell Blade's hit slightly less hard than the others, for multi-hit at random | 2.0× total, 91% of a standard seat (2.2×), 69% of the Ultimate; its best, 2.59×, the lowest best of any one-foe seat; 8–10 hits that chip shields across the field | Yes |
| The Summoner's as hard as the others in AoE capacity, multi-hit, balanced | The standard 2.2×, at the area share, three hits on every foe: **3.63× on three foes**, nearly the Ultimate on its weakness (3.77×); **6.05× on five**, twice the Ultimate's blow; the best in the game from three foes (the volleys: 3.30 and 4.84) | Yes |
| The healers' damage-focused, minor side effects if any | 2.0×, the side effect one stack for two rounds; no mend, Barrier, cleanse or revive | Yes |

**On an average Tier 1 regular** (two of the five Arms and two of the five elements on her list), any kind is weak
about 40% of the time, so every Limit Break's expected weak bonus is the same, ×1.12, and **the expected order is the
power order**. What the tri attacks add is reliability: one of their three kinds is on the list for **about nine foes in
ten**, against four in ten for a one-kind seat.

### 3.5 Against today

| Today | Power then | Halls v2 at the same seat | Power now |
|---|---|---|---|
| Arsenal Rush (Brawler) | 2.0× in 5 kinds | Triad Onslaught | 2.5× in 3 |
| Elemental Cascade (Mage) | 2.4× in 5 kinds | Triad Tempest | 2.5× in 3 |
| A Spell Blade's seat | 2.2×, fused two-kind hits | A pact | 2.0×, two kinds in turn at random |
| A Summoner's seat | 2.2×, mostly random or one foe | A familiar | 2.2×, every foe ×3 |
| A healer's seat | 1.5× (a healer) with support | A deity | 1.5× (a healer), 2.0× (anyone else) with one stack |

## 4. Every Limit Break

Built in H129 (D248), live from H134.

Each hall's table, then each Limit Break's card. **Kinds** in the order they lead. **Split** is the share of the power
each kind carries. A **double** (a Katana or Light strike) lands twice on its target at half the strike's share each.
**Learners who gain most** are the Tier 1 classes whose default weapons miss the most of its kinds (the defaults
assumed in [§5.3](#53-by-class-what-her-weapons-miss-and-who-answers)). **From** is the seat it replaces
([§7](#7-the-migration-hv18hv21-hv24)).

### 4.1 Warrior Dojo

*Power from self-training. Every Limit Break is a technique: the five Arms, each with what training gives it.*

| Seat | Limit Break | Kinds | Shape | Hits | Power | Side effect |
|---|---|---|---|---|---|---|
| 1 | **Triad Onslaught** (the owner's tri-weapon) | Greatsword, Axe, Lance | One foe | 3 | 2.5× | — |
| 2 | **Ten Thousand Swings** (the owner's Greatsword Ultimate) | Greatsword | One foe | 1 | 2.9× | — |
| 3 | Echo Draw | Katana | One foe, double hits | 3 draws, 6 hits | 2.2× | — |
| 4 | Hundred-Arrow Rain | Bow | Volley: her foe, then every other | 4 on her foe, 2 on each other | 2.2× | — |

**F1 · Triad Onslaught** · home: Brawler · owner-given\
*The first form every Recruit drills: the three heavy Arms in one unbroken motion.*
- **Kinds:** Greatsword, Axe, Lance, one hit each (⅓ each) · **Shape:** one foe, 3 hits · **Power:** 2.5× (86% of the Ultimate)
- **On one foe:** 2.50; one weakness 2.75; two 3.00 (the Ultimate's 2.9 passed, "a bit"); three 3.25 (no Tier 1 foe holds three Arms)
- **Shield:** a chip a weak hit, up to 2 in Tier 1 · **Learners who gain most:** Sorcerer, Tome Spellblade, Cleric (all three Arms new)
- **From:** Brawler Dojo 1, Arsenal Rush

**F2 · Ten Thousand Swings** · home: Brawler · owner-given\
*Every practice swing she ever made, in one blow.*
- **Kinds:** Greatsword · **Shape:** one foe, one hit · **Power:** 2.9×, the highest in the game
- **On one foe:** 2.90; weak 3.77 · **Shield:** 1 chip · best on a Broken foe or one weak to the Greatsword
- **Learners who gain most:** any class without a Greatsword (all but the Brawler and the Paladin)
- **From:** Brawler Dojo 2, Iaido Cleave

**F3 · Echo Draw** · home: Brawler\
*Drawn so fast that each cut lands twice.*
- **Kinds:** Katana · **Shape:** one foe, three draws, each a double: 6 hits of 1/6 · **Power:** 2.2×
- **On one foe:** 2.20; weak 2.86 · **Shield:** up to 6 chips: the Dojo's breaker
- **Learners who gain most:** any class without a Katana (Brawler, Sorcerer, both Summoners, Paladin, Cleric)
- **From:** Brawler Dojo 3, Spear and Arrow Storm

**F4 · Hundred-Arrow Rain** · home: Brawler\
*Two volleys: two arrows into her mark, one into every other foe.*
- **Kinds:** Bow · **Shape:** Classes v3's volley, twice: 4 hits on her foe (0.8 of the power), 2 on every other (0.35) · **Power:** 2.2×
- **On one foe:** 1.76; weak 2.29 · **On a crowd:** 2.53 on two, 3.30 on three, 4.84 on five · **Shield:** 4 chips on her foe, 2 on each other weak foe
- **Learners who gain most:** any class without a Bow (Brawler, Sorcerer, both Spellblades, Tome Summoner, Paladin)
- **From:** Brawler Dojo 4, Earthsplitter

### 4.2 Mage Tower

*Power from self-study. The Dojo's twin, seat by seat: each Limit Break the element twinned with the Dojo's Arm.*

| Seat | Limit Break | Kinds | Shape | Hits | Power | Side effect |
|---|---|---|---|---|---|---|
| 1 | **Triad Tempest** (the owner's tri-element) | Fire, Ice, Lightning | One foe | 3 | 2.5× | — |
| 2 | **Ten Thousand Candles** (the owner's Fire Ultimate) | Fire | One foe | 1 | 2.9× | — |
| 3 | Echo Ray | Light | One foe, double hits | 3 rays, 6 hits | 2.2× | — |
| 4 | Hundred-Shadow Rain | Dark | Volley: her foe, then every other | 4 on her foe, 2 on each other | 2.2× | — |

**M1 · Triad Tempest** · home: Sorcerer · owner-given\
*The first lesson every Apprentice copies out: the ring's three elements in one breath.*
- **Kinds:** Fire, Ice, Lightning, one spell each · **Shape:** one foe, 3 hits · **Power:** 2.5×
- **On one foe:** 2.50; one weakness 2.75; two 3.00 · **Shield:** up to 2 chips in Tier 1
- **Learners who gain most:** Brawler, Arms Summoner, Paladin (all three elements new) · **From:** Mage Tower 1, Elemental Cascade

**M2 · Ten Thousand Candles** · home: Sorcerer · owner-given\
*Every candle burned down over a book, in one fire.*
- **Kinds:** Fire · **Shape:** one foe, one hit · **Power:** 2.9×, the Greatsword Ultimate's mirror
- **On one foe:** 2.90; weak 3.77 · **Shield:** 1 chip
- **Learners who gain most:** any class without Fire (all but the Sorcerer) · **From:** Mage Tower 2, Twilight Eclipse

**M3 · Echo Ray** · home: Sorcerer\
*A ray read twice, so it strikes twice.*
- **Kinds:** Light · **Shape:** one foe, three rays, each a double: 6 hits · **Power:** 2.2×
- **On one foe:** 2.20; weak 2.86 · **Shield:** up to 6 chips
- **Learners who gain most:** Brawler, Sorcerer, Arms Spellblade, both Summoners · **From:** Mage Tower 3, Trinity Storm

**M4 · Hundred-Shadow Rain** · home: Sorcerer\
*Two downpours of shadow: the heaviest on her mark, the rest over the field.*
- **Kinds:** Dark · **Shape:** volley, twice: 4 hits on her foe, 2 on every other · **Power:** 2.2×: 1.76 on her foe, 0.77 on each other
- **On one foe:** 1.76; weak 2.29 · **On a crowd:** 3.30 on three, 4.84 on five · **Shield:** 4 chips on her foe, 2 on each other weak foe
- **Learners who gain most:** any class without Dark (Brawler, Sorcerer, both Spellblades, Paladin, Cleric) · **From:** Mage Tower 4, Chaos Rain

### 4.3 Spell Blade Salle

*Power from pacts with familiars that live in the blade. The pact lends the familiar's speed: five strikes at random
foes, the lead kind three of them (60% of the power) and the other two (40%); a Katana or Light strike lands twice. The
Arms Spellblade's two lead with the Katana, the Tome Spellblade's two with Light.*

| Seat | Limit Break | Kinds (lead first) | Strikes | Hits | Split | Power |
|---|---|---|---|---|---|---|
| 1 | **Shrike Pact** | Katana + Lance | Katana, Lance, Katana, Lance, Katana | 8 (6 Katana, 2 Lance) | 60 / 40 | 1.9× random (2.0×) |
| 2 | **Firefly Pact** | Katana + Light | Katana, Light, Katana, Light, Katana | 10 (6 Katana, 4 Light) | 60 / 40 | 1.9× random (2.0×) |
| 3 | **Storm Heron Pact** | Light + Lightning | Light, Lightning, Light, Lightning, Light | 8 (6 Light, 2 Lightning) | 60 / 40 | 1.9× random (2.0×) |
| 4 | **Wisp Pact** | Light + Katana | Light, Katana, Light, Katana, Light | 10 (6 Light, 4 Katana) | 60 / 40 | 1.9× random (2.0×) |

**Why this shape** (HV10): the owner's three asks at once. **Class identity in the split:** 60/40 to the lead, as the
Spell Blade's hands lead one channel. **Class identity in the hits:** Classes v3's double hits on her Katana and Light,
so the Arms Spellblade's Katana and the Tome Spellblade's Light each land six times. **Slightly less hard:** 1.9×, with
the random bonus 2.0×, under the standard seats' 2.2× and level with the healers'; in exchange, 8–10 hits that chip
shields wherever they land. Firefly Pact and Wisp Pact hold the same two kinds and differ in their lead, as the owner
gave them: Firefly's Katana hits on ATK for an Arms Hero, Wisp's Light on M.ATK for a Tome Hero.

**S1 · Shrike Pact** · home: Arms Spellblade · owner-given\
*The shrike pins its prey: her Lance throws fix them, her Katana cuts twice.*
- **Kinds:** Katana (60%) + Lance (40%), both Arms · **Shape:** random foes, 5 strikes, 8 hits · **Power:** 1.9×, 2.0× at random
- **On one foe:** 2.00; Katana weak 2.35; Lance weak 2.23; both 2.59 · **Shield:** up to 8 chips, 6 from the Katana
- **Learners who gain most:** Sorcerer, both Summoners, Paladin, Cleric (both kinds new) · **From:** Spell Blade Salle 1, Sunfire Edge

**S2 · Firefly Pact** · home: Arms Spellblade · owner-given\
*A swarm of fireflies lights each target; her Katana and their light find it, twice each.*
- **Kinds:** Katana (60%) + Light (40%) · **Shape:** random foes, 5 strikes, all doubles: 10 hits · **Power:** 1.9×, 2.0× at random
- **On one foe:** 2.00; both weak 2.59 · **Shield:** up to 10 chips, the game's most (the Duel's guard rail, HV15)
- **Learners who gain most:** Brawler, Sorcerer, both Summoners · **From:** Spell Blade Salle 2, Rimefang Waltz

**S3 · Storm Heron Pact** · home: Tome Spellblade · owner-given\
*The heron spears with lightning, and its plumes flash twice.*
- **Kinds:** Light (60%) + Lightning (40%), both elements · **Shape:** random foes, 5 strikes, 8 hits · **Power:** 1.9×, 2.0× at random
- **On one foe:** 2.00; both weak 2.59 · **Shield:** up to 8 chips
- **Learners who gain most:** Brawler, both Summoners · **From:** Spell Blade Salle 3, Thunder Javelin

**S4 · Wisp Pact** · home: Tome Spellblade · owner-given\
*Wisps lead her blade through the dark: their light strikes twice, and so does the Katana that follows.*
- **Kinds:** Light (60%) + Katana (40%) · **Shape:** random foes, 5 strikes, all doubles: 10 hits · **Power:** 1.9×, 2.0× at random
- **On one foe:** 2.00; both weak 2.59 · **Shield:** up to 10 chips
- **Learners who gain most:** Brawler, Sorcerer, both Summoners · **From:** Spell Blade Salle 4, Eclipse Volley

### 4.4 Summoner Circle

*Power from the familiars themselves. The Arms Summoner calls a pack of small familiars that strike with weapons; the
Tome Summoner one great familiar that breathes magic over the field. Every one hits every foe three times, its lead
kind twice (⅔ of the power).*

| Seat | Limit Break | Kinds (lead first) | Each foe takes | Split | Power |
|---|---|---|---|---|---|
| 1 | **Centaur Warband** | Axe + Bow | Axe, Bow, Axe | 67 / 33 | 2.2× at the area share: 1.21 a foe |
| 2 | **Gargoyle Flock** | Axe + Dark | Axe, Dark, Axe | 67 / 33 | 2.2×: 1.21 a foe |
| 3 | **Frostshade Wyrm** | Dark + Ice | Dark, Ice, Dark | 67 / 33 | 2.2×: 1.21 a foe |
| 4 | **Night Colossus** | Dark + Axe | Dark, Axe, Dark | 67 / 33 | 2.2×: 1.21 a foe |

**Why this shape** (HV11): "as hard as the other classes in AoE capacity (maybe multi-hit AoE and balanced
properly)". The power is the standard 2.2× and the area share is the game's usual 0.55, so a Summoner seat is no
stronger on one foe than any sweep (1.21), passes the Ultimate's unweak blow at three foes (3.63) and doubles it at
five (6.05). The Dojo's and the Tower's volleys out-hit it on one or two foes; from three, the Circle leads. Its hits
sweep every foe evenly whatever their kinds (a Bow or Dark hit too): a Limit Break's shape is its own, and the
familiar's breath is the Circle's. **Three hits a foe** make it the crowd's breaker: up to 3 chips on every weak foe in one cast. The owner's
current Summoner (its farewell and its lingering summon) is untouched: these are Limit Breaks, cast once and gone.

**U1 · Centaur Warband** · home: Arms Summoner · owner-given\
*A warband of centaurs rides through every foe: axes, bows, axes.*
- **Kinds:** Axe (⅔) + Bow (⅓), both Arms · **Shape:** every foe, 3 hits · **On a crowd:** 1.21 a foe; lead weak 1.45, both 1.57
- **Shield:** up to 3 chips a foe · **Learners who gain most:** Sorcerer, both Spellblades · **From:** Summoner Circle 1, Cinder Wyrm

**U2 · Gargoyle Flock** · home: Arms Summoner · owner-given\
*Stone wings dive on every foe, raking with axe-blades under a cloud of shadow.*
- **Kinds:** Axe (⅔) + Dark (⅓) · **Shape:** every foe, 3 hits · **On a crowd:** 1.21 a foe; both weak 1.57
- **Learners who gain most:** Sorcerer, both Spellblades, Cleric · **From:** Summoner Circle 2, Frost Behemoth

**U3 · Frostshade Wyrm** · home: Tome Summoner · owner-given\
*One wyrm of night and rime breathes over the whole field.*
- **Kinds:** Dark (⅔) + Ice (⅓), both elements · **Shape:** every foe, 3 hits · **On a crowd:** 1.21 a foe; both weak 1.57
- **Learners who gain most:** Brawler, both Spellblades, Paladin · **From:** Summoner Circle 3, Thunderbird

**U4 · Night Colossus** · home: Tome Summoner · owner-given\
*A colossus of shadow strides through, swinging an axe the size of a gate.*
- **Kinds:** Dark (⅔) + Axe (⅓) · **Shape:** every foe, 3 hits · **On a crowd:** 1.21 a foe; both weak 1.57
- **Learners who gain most:** Sorcerer, both Spellblades, Cleric · **From:** Summoner Circle 4, Moon Fox

### 4.5 Healer Sanctum

*Power from a followed deity, called down once to strike. The Paladin's two are the owner's Archangel and Archdemon;
the Cleric's two are other gods with the same shape: one foe, four hits, an Arm and an element, the lead kind 60%, and
a single stack of a blessing (the angels, on every ally, after the hits) or a curse (the demons, on the foe, before the
hits so the cast feels it). No mend, Barrier, cleanse or revive: the healers' skills carry the party's support.*

| Seat | Limit Break | Deity | Kinds (lead first) | Hits | Split | Power | Side effect |
|---|---|---|---|---|---|---|---|
| 1 | **Archangel's Judgment** | The Archangel (Paladin) | Lance + Light | Lance, Lance, a Light double | 60 / 40 | 2.0× | Brave 1 on every ally, 2 rounds |
| 2 | **Archdemon's Toll** | The Archdemon (Paladin) | Axe + Dark | Axe, Axe, Dark, Dark | 60 / 40 | 2.0× (2.12× with its curse) | Armor Break 1 on the foe first, 2 rounds |
| 3 | Seraph's Pyre | The Seraph (Cleric) | Fire + Greatsword | Fire, Fire, Greatsword, Greatsword | 60 / 40 | 2.0× | Faith 1 on every ally, 2 rounds |
| 4 | Thunder Fiend's Barrage | The Thunder Fiend (Cleric) | Lightning + Bow | Lightning, Lightning, Bow, Bow | 60 / 40 | 2.0× (2.12× with its curse) | Mind Break 1 on the foe first, 2 rounds |

**The Cleric's two** (HV13): the owner asked for "different deities but very similar damage types and effects" and
"the less used weapon combinations". The Paladin's two answer the Lightning, Light, Ice and Dark sets; the Fire set
was missing from the Sanctum, and before the Cleric's seats **the Greatsword and Fire sat in one hall each** and the
**Lightning and Bow** in two seats each. **The Seraph** (the burning one, with a sword of fire) brings **Fire and the
Greatsword**; **the Thunder Fiend** brings **Lightning and the Bow**. Both pairs appear nowhere else in the halls. The
Paladin's are physical-led and bless or curse the physical channel (Brave, Armor Break); the Cleric's are magic-led and
touch the magical one (Faith, Mind Break).

**The Archdemon keeps the owner's Axe + Dark** (HV12), though the Summoner Circle holds the same two kinds twice: the
Archdemon is single target where the Summoner's are area, and moving it to the least-held Greatsword would change no
kind count, since the Seraph carries the Greatsword.

**H1 · Archangel's Judgment** · home: Paladin · owner-given\
*The Archangel comes down lance first, and her judgment strikes twice.*
- **Kinds:** Lance (60%) + Light (40%) · **Shape:** one foe, two Lance thrusts and a Light double: 4 hits · **Power:** 2.0×
- **On one foe:** 2.00; Lance weak 2.36; both 2.60 · **Then:** Brave 1 on every ally (+10% physical damage, 2 rounds)
- **Shield:** up to 4 chips · **Learners who gain most:** Sorcerer, both Summoners
- **From:** Paladin Bastion 1, Archangel's Verdict, and 4, Valkyrie Lances

**H2 · Archdemon's Toll** · home: Paladin · owner-given\
*The Archdemon names a price: the foe's armor first, then the axes.*
- **First:** Armor Break 1 on its foe (+10% physical damage taken, 2 rounds) · **Kinds:** Axe (60%) + Dark (40%) · **Shape:** one foe, 4 hits
- **On one foe:** 2.12 with its own Armor Break; Axe weak 2.50; both 2.76 · **Shield:** up to 4 chips
- **Learners who gain most:** Sorcerer, both Spellblades, Cleric · **From:** Paladin Bastion 2, Archdemon's Pact, and 3, Rampart Charge

**H3 · Seraph's Pyre** · home: Cleric\
*The burning Seraph sweeps her sword of fire.*
- **Kinds:** Fire (60%) + Greatsword (40%) · **Shape:** one foe, two Fire blasts and two Greatsword strokes: 4 hits · **Power:** 2.0×
- **On one foe:** 2.00; Fire weak 2.36; both 2.60 · **Then:** Faith 1 on every ally (+10% magical damage, 2 rounds)
- **Learners who gain most:** both Spellblades, both Summoners, Cleric · **From:** Cleric Chapel 1, Choir of Angels, and 3, Dawn Hymn

**H4 · Thunder Fiend's Barrage** · home: Cleric\
*The Thunder Fiend cracks the foe's mind, then looses bolts and arrows.*
- **First:** Mind Break 1 on its foe (+10% magical damage taken, 2 rounds) · **Kinds:** Lightning (60%) + Bow (40%) · **Shape:** one foe, 4 hits
- **On one foe:** 2.12 with its own Mind Break; both weak 2.76 · **Shield:** up to 4 chips
- **Learners who gain most:** Brawler, Tome Summoner, Paladin · **From:** Cleric Chapel 2, Legion of Demons, and 4, Frost Sanctuary

**A status at any strength:** a Learner's cast lands its stack whole, as today's statuses do; its hits scale with her
strength.

## 5. Coverage (HV17)

### 5.1 The ten kinds, by hall

Seats holding each kind (today's 24 seats in brackets):

| Kind | Warrior Dojo | Mage Tower | Spell Blade Salle | Summoner Circle | Healer Sanctum | Seats | Halls |
|---|---|---|---|---|---|---|---|
| Greatsword | 2 | — | — | — | 1 | 3 (5) | 2 |
| Axe | 1 | — | — | 3 | 1 | 5 (4) | 3 |
| Lance | 1 | — | 1 | — | 1 | 3 (5) | 3 |
| Bow | 1 | — | — | 1 | 1 | 3 (4) | 3 |
| Katana | 1 | — | 3 | — | — | 4 (5) | 2 |
| Fire | — | 2 | — | — | 1 | 3 (5) | 2 |
| Ice | — | 1 | — | 1 | — | 2 (5) | 2 |
| Lightning | — | 1 | 1 | — | 1 | 3 (5) | 3 |
| Light | — | 1 | 3 | — | 1 | 5 (7) | 3 |
| Dark | — | 1 | — | 3 | 1 | 5 (7) | 3 |

- **Every kind is in two halls or more and two seats or more.** Today's 52 kind slots fall to 36: the two rainbow seats
  (five kinds each) became the tri attacks, which the owner asked for.
- **The Healer Sanctum holds eight of the ten kinds**, the Dojo the five Arms and the Tower the five elements. The Spell
  Blade Salle and the Summoner Circle hold their classes' four (the owner's pairs).
- **Ice is the thinnest kind** (the Tower's Triad Tempest and the Circle's Frostshade Wyrm), but its twin set is among
  the best answered (seven seats, below): every Axe seat answers it on the Rift's twin draws, and three classes'
  defaults hold Ice.

### 5.2 Twin sets, by hall

Classes v3's pairs: Fire (Greatsword, Fire), Ice (Axe, Ice), Lightning (Lance, Lightning), Light (Katana, Light), Dark
(Bow, Dark). Seats answering each set (holding either kind):

| Set | Warrior Dojo | Mage Tower | Spell Blade Salle | Summoner Circle | Healer Sanctum | Seats |
|---|---|---|---|---|---|---|
| Fire | 2 | 2 | — | — | 1 | 5 |
| Ice | 1 | 1 | — | 4 | 1 | 7 |
| Lightning | 1 | 1 | 2 | — | 2 | 6 |
| Light | 1 | 1 | 4 | — | 1 | 7 |
| Dark | 1 | 1 | — | 4 | 2 | 8 |
| Twilight (Bow, Katana; kept by Classes v3 §4.3) | 2 | — | 3 | 1 | 1 | 7 |

**Three halls answer all five sets** (the Dojo, the Tower and the Sanctum); **the Salle and the Circle answer their
classes' two** (Lightning and Light, Ice and Dark), as their pairs are the owner's.

### 5.3 By class: what her weapons miss and who answers

On each Tier 1 class's default weapons (the brief's for the four hybrids; today's for the Brawler, the Sorcerer, the
Paladin and the Cleric, which Classes v3 may move: [§8](#8-what-classes-v3-must-provide)). A Learner has two Heroes:
"pairs" counts the 190 two-seat picks that answer every set her weapons miss.

| Class | Weapons | Sets held | Sets missing | Seats adding a kind | Most kinds two Heroes add | Pairs closing every missing set |
|---|---|---|---|---|---|---|
| Brawler | Greatsword, Axe, Lance | Fire, Ice, Lightning | Light, Dark | 18 of 20 | 5 (Triad Tempest + Firefly or Wisp Pact) | 56 |
| Sorcerer | Fire, Ice, Lightning | Fire, Ice, Lightning | Light, Dark | 18 | 5 (Triad Onslaught + Firefly or Wisp Pact) | 56 |
| Arms Spellblade | Lance, Katana, Lightning | Lightning, Light | Fire, Ice, Dark | 18 | 4 | 31 |
| Tome Spellblade | Lightning, Light, Katana | Lightning, Light | Fire, Ice, Dark | 15 | 5 (Triad Onslaught + Triad Tempest) | 31 |
| Arms Summoner | Axe, Bow, Dark | Ice, Dark | Fire, Lightning, Light | 14 | 5 | 23 |
| Tome Summoner | Dark, Ice, Axe | Ice, Dark | Fire, Lightning, Light | 15 | 4 | 23 |
| Paladin | Greatsword, Axe, Light | Fire, Ice, Light | Lightning, Dark | 18 | 5 (Triad Tempest + Shrike Pact) | 54 (Thunder Fiend's Barrage alone closes both) |
| Cleric | Light, Ice, Bow | Ice, Light, Dark | Fire, Lightning | 18 | 5 (Triad Onslaught + Triad Tempest) | 49 (either tri alone closes both) |

- **Every class answers every set it misses with two Heroes,** in 23 to 56 ways. Today one rainbow seat did it alone
  (Arsenal Rush, Elemental Cascade, CP28's §8.2); now that is the two Heroes' job, which is what a Learner's second
  Hero is for.
- **The pure classes want the Light and Dark seats, the hybrids the ring's,** as today: the Salle's and the Circle's
  seats feed the Brawler and the Sorcerer, the tri attacks the hybrids and the healers.
- **The Hall page keeps its words** ([heroes](../../game/heroes.md#learners)): a seat "Answers Fire · Dark", a Learner
  candidate "Adds Light, Dark", read on Classes v3's pairs.

## 6. Bonds, Heroes, Learners and LB+ (HV22, HV23)

**Unchanged** (HV22): a Hero sits in one seat and casts its Limit Break at 100% whatever class she fights as, her hits
on her own channel's offense; up to ten Learners a Hero, two Heroes a Learner, a Hero never a Learner; a Learner casts
at 50% + 5% a Bond Level, 100% at Bond 10, her hits at the higher of her ATK and M.ATK; Bond Levels 0–10 at 12 Bond
EXP a level, 2 a won stage and 3 an elite or a boss (Sweeps and replays count, the Rift pays none); a Bond stays with
the Uma; Auto fires a Hero's own Limit Break, a Learner's from her strongest Bond. A Limit Break keeps its whole shape
at any strength: its kinds, hits, targets, doubles and its one stack.

**What a seat's Bond carries:** her Bond Level and EXP with that seat, so her strength as its Learner, and from Tier 2
its LB+. Bonds are per tier world, so the migration runs in each world she has.

**LB+ (Tier 2, deferred with Tier 2; HV23):** at Bond 10, a Hero with her own seat or a Learner with her Hero's casts
it at **+20% power**; kinds, hits, shape and status never change. One rule for twenty seats replaces the 24 authored
extras of the Tier 2 drafts ([tier2-classes §7.2](../../archive/design/tier2-classes.md)); +20% is the middle of their
+15–25%.

## 7. The migration (HV18–HV21, HV24)

### 7.1 The seat map

**Seat n stays seat n, id and all,** in the four halls that continue (HV18, HV20): `brawler-n`, `mage-n`,
`spellblade-n` and `summoner-n` keep their Heroes, Learners and Bonds untouched and gain the new Limit Break from
Classes v3's engine (Classes v3's reset leaves seats and Bonds as they are, its §15). **The Paladin Bastion becomes the
Healer Sanctum's seats 1–2 and the Cleric Chapel its seats 3–4,** two old seats into each new one, each pair joined by
theme. That merge is the only data that moves.

| Today (engine v18) | | Halls v2 | |
|---|---|---|---|
| **Seat** | **Limit Break** | **Seat** | **Limit Break** |
| `brawler-1` | Arsenal Rush | `brawler-1` | Triad Onslaught |
| `brawler-2` | Iaido Cleave | `brawler-2` | Ten Thousand Swings |
| `brawler-3` | Spear and Arrow Storm | `brawler-3` | Echo Draw |
| `brawler-4` | Earthsplitter | `brawler-4` | Hundred-Arrow Rain |
| `mage-1` | Elemental Cascade | `mage-1` | Triad Tempest |
| `mage-2` | Twilight Eclipse | `mage-2` | Ten Thousand Candles |
| `mage-3` | Trinity Storm | `mage-3` | Echo Ray |
| `mage-4` | Chaos Rain | `mage-4` | Hundred-Shadow Rain |
| `spellblade-1` | Sunfire Edge | `spellblade-1` | Shrike Pact |
| `spellblade-2` | Rimefang Waltz | `spellblade-2` | Firefly Pact |
| `spellblade-3` | Thunder Javelin | `spellblade-3` | Storm Heron Pact |
| `spellblade-4` | Eclipse Volley | `spellblade-4` | Wisp Pact |
| `summoner-1` | Cinder Wyrm | `summoner-1` | Centaur Warband |
| `summoner-2` | Frost Behemoth | `summoner-2` | Gargoyle Flock |
| `summoner-3` | Thunderbird | `summoner-3` | Frostshade Wyrm |
| `summoner-4` | Moon Fox | `summoner-4` | Night Colossus |
| `paladin-1` (first) + `paladin-4` | Archangel's Verdict + Valkyrie Lances (angels, the Lance) | `healer-1` | Archangel's Judgment |
| `paladin-2` (first) + `paladin-3` | Archdemon's Pact + Rampart Charge (the demon, the Axe) | `healer-2` | Archdemon's Toll |
| `cleric-1` (first) + `cleric-3` | Choir of Angels + Dawn Hymn (angels, Fire) | `healer-3` | Seraph's Pyre |
| `cleric-2` (first) + `cleric-4` | Legion of Demons + Frost Sanctuary (demons) | `healer-4` | Thunder Fiend's Barrage |

**Why seat for seat** rather than by best kind fit: the Limit Break is new in every seat either way, and a fixed rule is
one the player can predict ("your Hero kept her seat"). Each Hero keeps her seat, her Learners keep her, and every Bond
moves whole.

### 7.2 The merge rule, for the Healer Sanctum (HV19)

For each new seat and its two old seats ("first" as listed above, then "second"):

1. **Bonds:** each Uma's Bond with the new seat is **the higher of her two** (level, then EXP). The old two tracks go.
2. **The Hero:** if one old seat had a Hero, she is the Hero. **If both had one, the Hero with the lower Bond on her own
   old seat keeps the seat** (a tie: the first seat's), and **the other becomes the new seat's first Learner** at her
   Bond. A Hero casts at 100% whatever her Bond, and a Learner at her Bond's strength, so this keeps the most: two
   Heroes at Bond 10 lose nothing at all.
3. **Learners:** both lists pooled, each Uma once. The displaced Hero first, then by Bond with the new seat (highest
   first; a tie keeps the first seat's order, then the second's). The first ten sit. **Anyone beyond ten keeps her Bond**
   and can be seated again when a place opens.
4. **A Learner who sat under both old seats** now has one Hero there, and her second place is free.
5. **One line on Classes v3's one-time sheet** ("The classes are rebuilt", its §8.6) names every Uma who moved: "The
   Paladin Bastion and the Cleric Chapel are now the Healer Sanctum. Uma A, Hero of Rampart Charge, is now a Learner of
   Archdemon's Toll at Bond 7."

**Example:** the Paladin Bastion's seat 2 has Hero A (Bond 4) with six Learners; seat 3 has Hero B (Bond 10) with five,
one of them also under seat 2. Healer 2: A stays Hero (lower Bond); B becomes its first Learner, at Bond 10, so she
still casts at 100%; the ten Learner places take B and nine of the other ten, by Bond; the tenth keeps her Bond with
`healer-2`; the shared Learner sits once and gains a free place.

### 7.3 Save v32 (rides Classes v3)

| Data | What happens |
|---|---|
| `tierWorlds[t].heroes` (every tier world) | Keys kept (`brawler-n`, `mage-n`, `spellblade-n`, `summoner-n`) or merged (`paladin-*`, `cleric-*` → `healer-*`) by §7.2 |
| `tierWorlds[t].umas[id].bonds` | The same map; merged seats take the higher Bond |
| Seat ids (`HeroLimitId`) | `${hall}-${1..4}` with hall `brawler`, `mage`, `spellblade`, `summoner`, `healer` (HV20), a hall type of its own, no longer a class; the save parser accepts `healer-*` from engine v19 and `paladin-*`, `cleric-*` before it. Built in H129 (D248), live from H134 |
| Stored and open fights | **Unchanged:** a fight carries its engine version and its `hero` and `inherits` ids, and replays on its own generation's Limit Breaks (`heroLimitFor(id, version)`, D179) |
| The migration's line | One line in Classes v3's `TierWorld.classesV3` record, shown on its one-time sheet |
| Refunds | None: nothing in a hall is bought |

**The engine** (HV24): Classes v3's generation (v19 if it is the next) reads the twenty by id; today's 24 replay for
engines v10–v18, as v15's and v16's changes do today. `HERO_LIMIT_SUPPORT_SHARE` and the hall support stay for those
replays.

## 8. What Classes v3 must provide

Classes v3's draft (2026-10-29) already gives most of it; this table is the seam with its §15, both ways.

| Halls v2 needs | Why | Classes v3 gives (draft) |
|---|---|---|
| **The class list and ids** | Home classes; the scale per class | ✓ 13 ids (§13): `recruit`, `apprentice`, `duelist`, `caller`, `acolyte`; `brawler`, `mage` (Sorcerer), `spellblade` (Arms Spellblade), `tomeblade`, `armsummoner`, `summoner` (Tome Summoner), `paladin`, `cleric` |
| **The healers** | The 0.75 scale | ✓ The Paladin and the Cleric; a Tier 0 counts as no healer (CV22), so the Acolyte casts at 1 |
| **The weapon shapes** | The Dojo's and the Tower's seats 3–4 follow them | ✓ Katana and Light double (two hits); Bow and Dark a volley, the tapped foe 0.8 and every other 0.35 (§4.1). If its S6 tunes the volley (splash 0.30–0.40), the two volley seats read the same constants |
| **The re-paired twins** and Twilight | §5.2's sets; the Hall page's "Answers" and "Adds" | ✓ Katana–Light, Bow–Dark from v19; Twilight stays Bow and Katana (§4.3) |
| **Default weapons** of the eight Tier 1 classes | §5.3 | ✓ As this doc assumed (§0's table): no change to §5.3 |
| **Engine and save** | §7.3 | ✓ Engine v19 and save v32 behind `rpgRework('classes')`; its §13 lists "Halls v2's Limit Breaks if ready for v19" |
| **The reset leaves seats and Bonds** | §7.1: no rename needed | ✓ Its §15 |
| **A line on "The classes are rebuilt"** | §7.2's merge line | Its §8.6 sheet takes one more line when a healer seat merged |

**What Halls v2 gives back** (its §15's right column):

| Classes v3 asks | Halls v2's answer |
|---|---|
| The halls and seats for the eight Tier 1 classes, and whether a Tier 0 has a hall | Five halls, four seats, the home classes of §2.1; **no Tier 0 hall** (§2.3) |
| Each class's Limit Break power (its column is an interim: Brawler 2×, Sorcerer 2.4×, hybrids 2.2×, healers 1.5×, Tier 0 2×) | **The power belongs to the Limit Break** (§3.2); a class gives only its scale: **1** for the five Tier 0s and the six damage classes, **0.75** for the Paladin and the Cleric. Its "Limit Break power" column becomes "Limit Break scale" |
| Engine v19 with it, or v20 | **v19, with it:** one migration, one sheet, and the reset already rebuilds every class (HV24) |
| Any seat move at the same save | The healer merge only (§7.2), with its line on the sheet |

**One engine addition is Halls v2's own** (HV-A): a double struck at random foes lands both its hits on the same drawn
foe. Classes v3's doubles strike one foe, so it never needed this.

## 9. What changes, in code and the manual

- **Domain:** `rpg/hero-id.ts` (a hall type, seat ids `${hall}-${n}`, `HERO_HALLS` by hall, the live seats by generation),
  `rpg/heroes.ts` (a `power` per Limit Break, the twenty by generation, the class scale, doubles), `rpg/battle/limit.ts`
  (`heroPlan` multiplies the Limit Break's power by her class's scale), `hub/places.ts` (`learningPlaces` by
  generation: five halls), `save/heroes.ts` and `save/migrations.ts` (§7), `save/save.ts`'s parser (the id sets).
- **The fight and Auto:** no new damage rule. Multi-hit on one foe, every foe or random foes, a splash (the volley) and a
  status before or after the hits all exist today; the only addition is a random double's second hit following its
  first (above). Auto scores the new shapes as it scores skills.
- **The balance simulation** (`rift/balance-sim.ts`): its Heroes on curve and the Duel's Limit Break rail (`limitRail`)
  on the twenty.
- **Web:** the Hall page's seat card gains its home class, its shape and its power ("×2.9"); the five buildings. The profile's Inheritance card and the fight's Limit Break menu read the new data unchanged.
- **The manual:** [heroes](../../game/heroes.md) rewritten (five halls, twenty seats, the ladder, the merge history);
  [combat](../../game/combat.md#limit-breaks) and [classes](../../game/classes.md) regenerated (`pnpm docs:update`:
  the "Limit Break power" column becomes the class's scale).

## 10. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **HV1** Halls | **Five, one per Tier 0 line:** Warrior Dojo, Mage Tower, Spell Blade Salle, Summoner Circle, Healer Sanctum | Six as today; eight, one per Tier 1 class; "Fighter Dojo" | The owner's five; the shared halls hold the owner's sets of four; "Fighter" is a master-data name, so the Warrior root's (Classes v3 CV2) |
| **HV2** Seats | **Four a hall, 20 Limit Breaks:** two per Tier 1 class in the shared halls, four for the Brawler and the Sorcerer | Two a hall (10); a hall per class at two | Two seats leave the Bow, the Katana and Dark in one hall each, the pure halls without crowd or Lite answers, and one Limit Break per shared-hall class |
| **HV3** Seat order | The owner's two first; Dojo and Tower: tri, Ultimate, double, area; shared halls: the Arms-led class's two, then the Tome-led's; Sanctum: Paladin, then Cleric | Alphabetical; by power | The Dojo and the Tower read as twins; each class's seats side by side |
| **HV4** Who sits | Any Uma in any seat, Tier 0 included; **no Tier 0 hall**; each seat names its home class; a Hero's hits on her own channel, a Learner's on her higher offense (unchanged) | Heroes limited to home classes; a hall for the Tier 0s | Coverage is the halls' point (CP28); the channel rule already makes the home class the best Hero; a Tier 0 lasts ten ranks |
| **HV5** Power | **The Limit Break's own power × her class's scale × her open depth's single-target power;** the scale 1 for the five Tier 0s and the six damage classes, 0.75 for the Paladin and the Cleric | Her class's power as today (Classes v3's interim column); the seat's alone | The owner's order needs power per Limit Break; the scale keeps a healer's at today's 1.5× |
| **HV6** The ladder | Ultimates 2.9×; tri 2.5×; standard 2.2× (Dojo and Tower 3–4, the Circle); Spell Blade 1.9× random (2.0×); healers 2.0× + one stack. Mean 2.23× | Ultimate 2.8× (Echo Draw on its weakness, 2.86×, would pass it); Spell Blade 2.0× (2.1× at random, level with the healers) | Each owner rule holds with a margin (§3.4); the mean stays at today's 2.2× |
| **HV7** The tri attacks' "a bit more" | **The plain weak rule:** on two weaknesses 3.0×, over the Ultimate's 2.9× on a foe not weak to it | A Triad rule (the whole cast weak per weak kind) | The owner's sentence holds without a new rule; a whole-cast rule put the tri over the Ultimate with one weakness |
| **HV8** The Warrior Dojo | Triad Onslaught (Greatsword, Axe, Lance), Ten Thousand Swings (Greatsword, one hit), Echo Draw (Katana, 3 doubles), Hundred-Arrow Rain (Bow, two volleys) | A Lance or Axe seat in 3–4; the Bow as an even sweep | The five Arms in one hall; Classes v3's Katana double and Bow volley |
| **HV9** The Mage Tower | The Dojo's twin: Triad Tempest, Ten Thousand Candles, Echo Ray (Light, 3 doubles), Hundred-Shadow Rain (Dark, two volleys) | Light and Dark in one seat (today's Twilight Eclipse) | "Mirror" taken seat by seat; twins under Classes v3's pairs |
| **HV10** The Spell Blade Salle | Familiar pacts: five strikes at random foes, the lead kind three (60%), Katana and Light strikes landing twice; 8 or 10 hits | Fused two-kind hits as today; one foe | The owner's identity asks: split, hit count, random, slightly less hard |
| **HV11** The Summoner Circle | Three hits on every foe (sweeps, whatever the kinds), the lead kind twice (67%); packs for the Arms Summoner, one great familiar for the Tome Summoner; 2.2× at the area share | A higher area share; one hit a foe; volleys for its Bow and Dark hits | "As hard as the others in AoE capacity": three foes equal the Ultimate on its weakness; three chips a foe; the crowd's best from three foes |
| **HV12** The Paladin's two | **As the owner gave them:** Archangel's Judgment (Lance + Light), Archdemon's Toll (Axe + Dark); one foe, four hits, 60/40 | The Archdemon on the Greatsword (the least-held Arm); "Archangel's Descent" ("Descent" is a master-data string) | His theme; the Seraph brings the Greatsword, so no kind count changes |
| **HV13** The Cleric's two | **Seraph's Pyre** (Fire + Greatsword) and **Thunder Fiend's Barrage** (Lightning + Bow): other deities, the Paladin's shape, magic-led | The Paladin's pairs Tome-led (Light + Lance, Dark + Axe); Ice instead of Lightning | The owner's "less used combinations": Fire and the Greatsword in one hall each, Lightning and the Bow in two seats; four classes' defaults miss the Lightning set |
| **HV14** Healer side effects | One stack, two rounds: angels bless every ally after the hits (Brave, Faith), demons curse the foe before them (Armor Break, Mind Break); no support | None at all; today's support | "Damage-focused with minor side effects if at all"; the curse lands before the hits so the cast feels it (+6%) |
| **HV15** Hit ceiling | At most **10 hits on one foe** a cast | 12 as today | The Duel's guard rail (no single act Breaks a Duel boss) gains room: the best Limit Break chips 10, not 12 |
| **HV16** Names | Invented, in each hall's lore; none of today's 24 reused; each checked against every master-data string (none matches, exact or inside) | Keep today's names on their seats | New shapes and kinds under old names would mislead; the original-game rule |
| **HV17** Coverage | Every kind in ≥ 2 halls and ≥ 2 seats; the Dojo, Tower and Sanctum answer all five sets; every class closes its missing sets with two Heroes (23–56 ways) | A rainbow seat a hall | The owner retired the five-weapon seats; a Learner's two Heroes are the coverage pick |
| **HV18** Seat map | Seat n → seat n, id and all, in the four continuing halls; the Paladin Bastion → Healer 1–2, the Cleric Chapel → Healer 3–4, two old seats a new one | Best kind fit per seat; empty the halls | Predictable; only the healer merge moves data |
| **HV19** Merging | Bonds: the higher of two; the less-bonded of two Heroes keeps the seat and the other becomes its first Learner; Learners pooled, ten by Bond; anyone left out keeps her Bond; one line on Classes v3's "The classes are rebuilt" sheet | The first seat's Hero always stays; unseat both; a notice of its own | Keeps the most strength: two Bond 10 Heroes lose nothing; one sheet for one update |
| **HV20** Seat ids | `${hall}-${n}`, a hall type of its own: `brawler`, `mage`, `spellblade`, `summoner` (kept) and `healer` (new); old ids kept for replays | Family ids (`fighter-1`, `tower-1`) | Four halls keep every id, so their Heroes and Bonds need no rewrite |
| **HV21** Places | Five halls on the Learning page, physical left, magic right, the Sanctum in the middle; `brawler-dojo` kept (shown as the Warrior Dojo), `healer-sanctum` new; the Sanctum wears `knights-bastion` until it has its own art | A `warrior-dojo` id; a new building first | Ids never show; art optional, not blocking |
| **HV22** Bonds and Learners | Unchanged: 10 Learners, 2 Heroes, 50% + 5% a Bond Level, Bond EXP per win | More Learners per Hero to keep 240 places | The owner asked for optimization, not new rules; 200 places are plenty |
| **HV23** LB+ (Tier 2) | One rule: +20% power at Bond 10 | 20 authored extras | Twenty new seats; Tier 2 is deferred (D238) |
| **HV24** Versions | **Rides Classes v3: engine v19 and save v32**, not v20; today's 24 replay on v10–v18 | A halls-only engine and save (v20) | One migration and one sheet for the class split and the halls |
| **HV25** Auto and the Hall page | Auto unchanged (scores the new shapes as skills); the seat card adds home class, shape and power | A new Limit Break picker | No new rule to explain |

## 11. Build plan

Packet ids are the main session's to assign (from the next free H number, decisions from the next free D, fetched from
`main`). These ride Classes v3's packets: HV-A and HV-B land in its engine and save packets, or right after them.

| Id | Packet | Scope | Who | Size | Needs |
|---|---|---|---|---|---|
| **HV-A** | **The twenty, in the domain** | `hero-id.ts` the hall type and ids by generation; `heroes.ts` the twenty with their `power`, kinds, shapes (volleys, doubles) and statuses; a random double's second hit on the same foe; the class scale; `heroPlan`; tests: every seat's kinds and power, the ladder's order (§3.4's rows as assertions), old engines' replays unchanged | Claude | M | Classes v3's class ids, volley constants and engine v19 |
| **HV-B** | **Save v32: the halls' migration** | §7's healer merge in every tier world; Bonds by max; the Hero and Learner rule; its line in `classesV3`; fixtures (a save with all 24 seats, two Heroes in a merged pair, an over-ten pool, a shared Learner) | Claude | M | HV-A; Classes v3's save packet |
| **HV-C** | **The Learning page and the Hall page** | `learningPlaces` by generation (five halls, the Warrior Dojo's name); the seat card's home class, shape and power; "Answers" and "Adds" on the new pairs; the merge line on Classes v3's sheet | ChatGPT | M | HV-A, HV-B |
| **HV-D** | **Balance** | The simulation on the twenty: each class's Limit Break damage a fight within ±5% of §3.5's change; party win rates within ±3 points of today's on Tier 1; the class scales tuned if not; the Duel's Limit Break rail re-measured (10 chips), shields left at 13 unless it moves | Claude | M | HV-A |
| **HV-E** | **The manual and close** | heroes.md rewritten, combat and classes regenerated (`pnpm docs:update`), the D-row, this doc's status line | Claude | S | HV-A–HV-D |
| **HV-F** | *Optional:* **A Healer Sanctum building** | One pixel building in uma-art, as a ChatGPT art packet; until then the `knights-bastion` frame | ChatGPT | S | — |

**Order:** HV-A → (HV-B ∥ HV-D) → HV-C → HV-E; HV-F any time.
