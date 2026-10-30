# Halls of Heroes and inheritance

The five halls on the Hub's Learning page are the **Halls of Heroes** (D106; Halls v2, D241) and the **only source of
Limit Breaks** (D112): an Uma who is neither a Hero nor a Learner has none, and her gauge fills with nothing to spend.
There is one hall a family, each with four seats, and each seat teaches its own Limit Break with its own power (D107,
HV5): twenty in all, as engine v19 plays them. Fights from engine v18 and before replay with six halls' 24 Limit Breaks,
each worth her class's own power ([combat](combat.md#limit-breaks)).

Code: `packages/domain/src/rpg/heroes.ts` (the twenty, their power, kinds and shapes, the class scale),
`rpg/hero-id.ts` (halls, seat ids, home classes, Bond numbers), `save/heroes.ts` (seats, Learners, Bonds, what a fight
takes), `rpg/battle/limit.ts` (casting), `rpg/battle/auto.ts` (Auto's pick), `hub/places.ts` (the halls on the Learning
page), `apps/web/src/places/halls/HallPage.tsx` and `hall-view.ts` (the page). Design: [Halls
v2](../design/classes-v3/halls-v2.md).

## The five halls

| Hall | Its family | Home classes, by seat | Its power comes from | Its Limit Breaks |
|---|---|---|---|---|
| **Warrior Dojo** | Warrior | Brawler 1–4 | Self-training | The five Arms, nothing else: a tri attack, an Ultimate, doubles, volleys |
| **Mage Tower** | Mage | Sorcerer 1–4 | Self-study | The five elements, nothing else: the Dojo's twin, seat by seat |
| **Spellblade Salle** | Spellblade | Arms Spellblade 1–2, Tome Spellblade 3–4 | Pacts with familiars | Two kinds, five strikes at random foes |
| **Summoner Circle** | Summoner | Arms Summoner 1–2, Tome Summoner 3–4 | Familiars, summoned | Two kinds, three hits on every foe |
| **Healer Sanctum** | Healer | Paladin 1–2, Cleric 3–4 | A followed deity | An Arm and an element on one foe, and one stack of a blessing or a curse |

On the Learning page the Warrior Dojo and the Mage Tower stand at the top, the Spellblade Salle and the Summoner Circle
below them, the Healer Sanctum in the middle on its own temple, the Observatory under it
([sections](sections.md#learning)). The Warrior Dojo keeps the Brawler Dojo's id, `brawler-dojo`; the Sanctum is
`healer-sanctum`, where the Paladin Bastion and the Cleric Chapel stood ([below](#the-merge-save-v32)).

- **Any owned Uma may sit in any seat,** Hero or Learner, whatever class she fights as, a Tier 0 too: there is no Tier 0
  hall, and a Hero who promotes keeps her seat. A hall's family is its theme and a seat's **home class** its fit, not a
  rule: a Hero's hits use her own channel's offense, so the class whose channel leads the seat makes its best Hero; a
  Learner hits with her higher offense, so for her what counts is the kinds the seat adds.
- **The seat order:** the owner's two first. The Dojo and the Tower read as twins: seat 1 the tri attack, 2 the
  Ultimate, 3 the doubles, 4 the volleys. In the Salle and the Circle the Arms-led class's two, then the Tome-led
  class's; in the Sanctum the Paladin's two, then the Cleric's.
- On the Hub each hall shows four pips over its building, a seated Hero's face ringed in the accent color, an empty seat
  a dot.

## Heroes

- **A seat's Hero** is any owned Uma who is not a Hero elsewhere and not a Learner. She sits in one seat at most.
- **She has no menu:** her Limit Break is always her seat's, at full strength (100%), whatever class she fights as.
- **Its power** is the seat's own × the scale of the class she fights as × her open depth's power
  ([below](#the-twenty-limit-breaks)). Its hits use their own channel's offense, ATK for an Arm and M.ATK for an element,
  with her Might and flat offense on each kind.
- **Swapping a Hero** keeps the seat's Learners. **Emptying the seat** sends them away; their Bonds stay with them.

## Learners

- **Up to ten Learners** sit under each Hero, and a Learner sits under **two Heroes at most**. A Hero is never a
  Learner, and a Learner leaves her Heroes before she can be seated as one. The pickers grey out anyone who can't take
  the seat and say why ("Already a Hero", "A Learner: leave her Heroes first", "A Hero", "Already has 2 Heroes", "10
  Learners at most").
- **In a fight** her Limit Break menu lists her Heroes' Limit Breaks, each with its Hero's face, the kinds it deals and
  its strength; picking one plays the Hero's bust in the cut-in.
- **Strength:** 50% at Bond 0, plus 5% a Bond Level, 100% at Bond 10. It keeps its whole shape at any strength: its
  weapons and elements (even ones she doesn't carry), its number of hits, its targets, its doubles and its one stack.
  Its hits scale with the strength; a stack lands whole.
- **Her offense** (C3): an inherited Limit Break hits with the higher of her ATK and M.ATK, whatever its kinds. Each kind
  still decides weaknesses, shield chips and locks, and brings her Might and flat offense on that kind. A Sorcerer can
  carry an Arms Limit Break to Break a foe weak only to Arms.
- **Her coverage** (CP28, HV17): an inherited Limit Break reaches kinds her three weapons miss. A seat in the hall reads
  the twin sets its Limit Break answers ("Answers Dark · Twilight"), and the Learner picker the sets a seat would add to
  hers ("Adds Light, Twilight"), by her active class's weapons, on engine v19's twins: Katana–Light, Bow–Dark, Twilight
  the Bow and the Katana ([classes](classes.md#weapons)). Every kind sits in two halls or more, and every Tier 1 class can
  answer every twin set her default weapons miss with two Heroes, in 23 to 56 ways.

## Bonds

- **A Bond** is an Uma's track with one seat, Bond Level 0–10 at 12 Bond EXP a level (120 to Bond 10). Past Bond 10 it
  stops.
- **Every won world fight** raises a Learner's Bond with each of her Heroes' seats, and a Hero's Bond with her own seat
  (D112): 2 Bond EXP a stage, 3 an elite or a boss. Replays and Sweeps count; Rift fights pay no Bond. A region's first
  clears pay 26, so Bond 10 takes about five regions, with both Heroes at once.
- **A Bond stays with her** when she leaves a seat. A Hero's own Bond doesn't change her Limit Break (she has it at 100%),
  but taken out of her seat and put back as its Learner she starts at the Bond she earned; the Hero's sheet in the hall
  shows it.
- **Her profile's Skills tab** has an Inheritance card: her seat and its Bond, or her Heroes and every Bond she has made,
  each with its strength.

## The twenty Limit Breaks

- **Power** (HV5): at 100% a Limit Break is worth **its own power** × **the scale of the class she casts it as** × **her
  open depth's single-target power** (the deepest depth her Class Rank opens; a Tier 0's skill power at her Class Rank),
  shared among its hits. The scale is 1 for a Tier 0, 0.95 for the six Tier 1 damage classes and 0.8 for the Paladin and
  the Cleric (H131's balance, D249), so a healer on a Healer Sanctum seat lands 1.6×. Every-foe hits deal the area share
  (0.55 a foe); random hits get the 1.05 bonus, as skills do. Limit Breaks never take a Skill Rank. The gauge, its charge
  and the cost are in [combat](combat.md#limit-breaks).
- **The ladder** (HV6), the owner's order: the **Ultimates** 2.9× in one hit (Ten Thousand Swings, Ten Thousand Candles);
  the **tri attacks** 2.5× in three kinds (Triad Onslaught, Triad Tempest), 3.0× on a foe weak to two of them, a little
  over the Ultimate on a foe not weak to it; the **standard** seats 2.2× (the Dojo's and the Tower's doubles and volleys,
  the Summoner Circle's four); the **pacts** 1.9× at random foes (2.0× with the random bonus, for their many hits); the
  **Healer Sanctum's** four 2.0× and one stack. Across the twenty it averages about 2.23×.
- **Shapes:** one foe (the tri attacks, the Ultimates and the Sanctum's four, four hits each, the lead kind 60%);
  doubles (Echo Draw and Echo Ray, three strikes each landing twice: 6 hits); volleys (Hundred-Arrow Rain and
  Hundred-Shadow Rain, two volley casts: 4 hits on her foe and 2 on each other, at the weapons' 0.8 and 0.35); random
  (the pacts, five strikes with the lead kind three of them, a Katana or Light strike landing twice on the foe it drew: 8
  or 10 hits); every foe (the Circle's, three hits on every foe, the lead kind twice).
- **Kinds:** each hit carries one kind, and each is weak, chips a shield and breaks a lock on its own. The halls hold the
  ten kinds two seats or more each (Ice the fewest: the Tower's tri and the Circle's Frostshade Wyrm).
- **At most 10 hits on one foe** a cast (Firefly Pact and Wisp Pact reach it), so no Limit Break alone Breaks a Duel
  boss ([combat](combat.md#the-rifts-foes)).
- **No support** (HV14): no mend, Barrier, cleanse or revive. The Healer Sanctum's carry one stack for two rounds: the
  angels bless every ally after the hits (Archangel's Judgment Brave 1, Seraph's Pyre Faith 1), the demons curse the foe
  before them (Archdemon's Toll Armor Break 1, Thunder Fiend's Barrage Mind Break 1), so the cast feels it. A cast with
  no hits only casts its status.

What a seat is worth at 100% and a scale of 1, on a Broken foe (an unbroken one halves every row alike), before her
stats, × her open depth's power; a Tier 1 damage class casts ×0.95 of it, a healer ×0.8, a Learner at Bond 0 half:

| Seats | Power | One foe | One foe, weak | 3 foes in all | 5 foes in all | Most chips on one weak foe |
|---|---|---|---|---|---|---|
| The Ultimates | 2.9× | 2.90 | 3.77 | 2.90 | 2.90 | 1 |
| The tri attacks | 2.5× | 2.50 | 3.00 (two of three weak) | 2.50 | 2.50 | 2 |
| Echo Draw, Echo Ray | 2.2× | 2.20 | 2.86 | 2.20 | 2.20 | 6 |
| The Healer Sanctum's | 2.0× | 2.00–2.12 | 2.60–2.76 | 2.00–2.12 | 2.00–2.12 | 4 |
| The pacts | 1.9× | 2.00 | 2.59 | 2.00 | 2.00 | 8–10 |
| The volleys | 2.2× | 1.76 | 2.29 | 3.30 | 4.84 | 4, and 2 a foe |
| The Summoner Circle's | 2.2× | 1.21 | 1.57 | 3.63 | 6.05 | 3 a foe |

The demons' 2.12 counts their own curse. Of the seats that reach every foe, the volleys lead on one or two foes (2.53 on
two, against a sweep's 2.42) and the Circle's sweeps from three, where they are the best in the game.

<!-- live:heroes -->
| Hall | Seat | Home class | Limit Break | Power | Kinds | What it does | Casts |
|---|---|---|---|---|---|---|---|
| Warrior Dojo | 1 | Brawler | Triad Onslaught | 2.5× | greatsword, axe, lance | A Greatsword, an Axe and a Lance blow on one foe | 3 hits on one foe |
| Warrior Dojo | 2 | Brawler | Ten Thousand Swings | 2.9× | greatsword | One Greatsword blow on one foe | 1 hit on one foe |
| Warrior Dojo | 3 | Brawler | Echo Draw | 2.2× | katana | Three draws on one foe, each Katana cut twice | 6 hits on one foe |
| Warrior Dojo | 4 | Brawler | Hundred-Arrow Rain | 2.2× | bow | Two Bow volleys: two arrows each on one foe, one on every other foe | 2 hits on one foe, a volley + splash; 2 hits on one foe, a volley + splash |
| Mage Tower | 1 | Sorcerer | Triad Tempest | 2.5× | fire, ice, lightning | A Fire, an Ice and a Lightning spell on one foe | 3 hits on one foe |
| Mage Tower | 2 | Sorcerer | Ten Thousand Candles | 2.9× | fire | One Fire blast on one foe | 1 hit on one foe |
| Mage Tower | 3 | Sorcerer | Echo Ray | 2.2× | light | Three rays on one foe, each Light ray striking twice | 6 hits on one foe |
| Mage Tower | 4 | Sorcerer | Hundred-Shadow Rain | 2.2× | dark | Two Dark volleys: two bolts each on one foe, one on every other foe | 2 hits on one foe, a volley + splash; 2 hits on one foe, a volley + splash |
| Spellblade Salle | 1 | Arms Spellblade | Shrike Pact | 1.9× | katana, lance | Five strikes at random foes, Katana and Lance in turn, each Katana cut twice | 8 hits on random foes |
| Spellblade Salle | 2 | Arms Spellblade | Firefly Pact | 1.9× | katana, light | Five strikes at random foes, Katana and Light in turn, each striking twice | 10 hits on random foes |
| Spellblade Salle | 3 | Tome Spellblade | Storm Heron Pact | 1.9× | light, lightning | Five strikes at random foes, Light and Lightning in turn, each Light ray twice | 8 hits on random foes |
| Spellblade Salle | 4 | Tome Spellblade | Wisp Pact | 1.9× | light, katana | Five strikes at random foes, Light and Katana in turn, each striking twice | 10 hits on random foes |
| Summoner Circle | 1 | Arms Summoner | Centaur Warband | 2.2× | axe, bow | Axe, Bow, then Axe on every foe | 3 hits on every foe |
| Summoner Circle | 2 | Arms Summoner | Gargoyle Flock | 2.2× | axe, dark | Axe, Dark, then Axe on every foe | 3 hits on every foe |
| Summoner Circle | 3 | Tome Summoner | Frostshade Wyrm | 2.2× | dark, ice | Dark, Ice, then Dark on every foe | 3 hits on every foe |
| Summoner Circle | 4 | Tome Summoner | Night Colossus | 2.2× | dark, axe | Dark, Axe, then Dark on every foe | 3 hits on every foe |
| Healer Sanctum | 1 | Paladin | Archangel’s Judgment | 2× | lance, light | Two Lance thrusts and a Light double on one foe, then Brave 1 on every ally | 4 hits on one foe + Brave 1 on every ally |
| Healer Sanctum | 2 | Paladin | Archdemon’s Toll | 2× | axe, dark | Armor Break 1 on one foe, then two Axe and two Dark hits on her | Armor Break 1 on the foe; 4 hits on one foe |
| Healer Sanctum | 3 | Cleric | Seraph’s Pyre | 2× | fire, greatsword | Two Fire blasts and two Greatsword strokes on one foe, then Faith 1 on every ally | 4 hits on one foe + Faith 1 on every ally |
| Healer Sanctum | 4 | Cleric | Thunder Fiend’s Barrage | 2× | lightning, bow | Mind Break 1 on one foe, then two Lightning and two Bow hits on her | Mind Break 1 on the foe; 4 hits on one foe |

| Setting | Value |
|---|---|
| Seats | 4 per hall, 5 halls, 20 in all; a Hero sits in one seat; any Uma may sit in any seat |
| Learners | 10 per Hero; 2 Heroes per Learner; a Hero is never a Learner |
| Power at 100% | the Limit Break's own power × her class's scale (×1 Warrior, Spellblade, Healer, Summoner, Mage; ×0.95 Brawler, Arms Spellblade, Arms Summoner, Tome Summoner, Tome Spellblade, Sorcerer; ×0.8 Paladin, Cleric) × her open depth's power; at most 10 hits on one foe a cast |
| Learner strength | 50% at Bond 0, +5% a Bond Level, 100% at Bond 10 |
| Bond EXP per won fight | 2 a stage, 3 an elite or boss, toward each of a Learner's Heroes, or a Hero's own seat; 12 a level (Sweeps and replays count) |
<!-- /live -->

## The merge (save v32)

Halls v2 came with save v32 (HV18–HV19; H130, D247), once in every tier's world. **Seat n stayed seat n,** id and all,
in the four halls that continue: `brawler-n`, `mage-n`, `spellblade-n` and `summoner-n` kept their Heroes, Learners and
Bonds and took the new Limit Break. **The Paladin Bastion and the Cleric Chapel merged into the Healer Sanctum,** two
old seats into each new one, joined by theme:

| Old seats (engine v18) | Healer Sanctum seat | Its Limit Break |
|---|---|---|
| `paladin-1` (first) + `paladin-4` | `healer-1` | Archangel's Judgment |
| `paladin-2` (first) + `paladin-3` | `healer-2` | Archdemon's Toll |
| `cleric-1` (first) + `cleric-3` | `healer-3` | Seraph's Pyre |
| `cleric-2` (first) + `cleric-4` | `healer-4` | Thunder Fiend's Barrage |

- **Bonds:** each Uma kept the higher of her two Bonds (by level, then EXP) as her Bond with the new seat.
- **Heroes:** a seat with one Hero kept her. Of two Heroes, **the one with the lower Bond on her own old seat kept the
  seat** (a tie, the first seat's), and **the other became its first Learner** at her Bond, so two Heroes at Bond 10 lost
  nothing.
- **Learners:** both lists pooled, each Uma once, the displaced Hero first, then by Bond (a tie kept the first seat's
  order, then the second's). The first ten sat; anyone past ten kept her Bond and can be seated when a place opens. A
  Learner who sat under both old seats sat once and gained a free second place. An old seat whose partner was empty moved
  whole, its Learners in their order.
- **"The classes are rebuilt"** named every Uma whose role moved ("Hero → Learner · Archdemon's Toll · Bond 7") under
  "Each Uma keeps her higher Bond" ([sections](sections.md#account)). Nothing in a hall was refunded: nothing there is
  bought.
- A fight open across it finished on engine v18 with the old seats' Limit Breaks, and paid its Bonds to the merged
  seats. An old link to the Paladin Bastion or the Cleric Chapel lands on the Healer Sanctum.

## In the engine

- **A fight's input** (`BattleAlly`): an ally may carry `hero` (her seat) or `inherits` (one or two seats, each with
  her Bond Level and the Hero's outfit id), never both; `save/heroes.ts`' `heroFields` builds them from the world when a
  fight starts. A `limit` action names `hero`: a Hero only her own seat, a Learner one of hers.
- **Seat ids** are `${hall}-${n}` (`brawler`, `mage`, `spellblade`, `summoner` and from engine v19 `healer`, n 1–4);
  `paladin-*` and `cleric-*` exist for engines v15–v18 only (`heroLimitIds(engine)`, `isHeroLimitId`).
- **An ally with neither** has no Limit Break: her gauge fills, the "LB" badge never shows, and a `limit` action is
  refused.
- **Auto** (`rpg/battle/auto.ts`) fires a Hero's own Limit Break, and a Learner's with the strongest Bond (the first of
  her seats on a tie), on the foe it scores best.
- **Each seat by engine:** `heroLimitFor(id, version)` gives a seat's Limit Break in the fight's own engine, so fights
  from older engines replay with their halls ([combat](combat.md)).
