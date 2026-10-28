# Halls of Heroes and inheritance

The six class halls on the Hub's Learning page are the **Halls of Heroes** (D106) and the **only source of Limit
Breaks** (D112): an Uma who is neither a Hero nor a Learner has none, and her gauge fills with nothing to spend. Each
hall has four seats, and each seat teaches its own Limit Break (D107): 24 in all, as engine v18 plays them.

Code: `packages/domain/src/rpg/heroes.ts` (the Limit Breaks, their power and kinds), `rpg/hero-id.ts` (seat ids, halls,
Bond numbers), `save/heroes.ts` (seats, Learners, Bonds, what a fight takes), `rpg/battle/limit.ts` (casting),
`rpg/battle/auto.ts` (Auto's pick), `apps/web/src/places/halls/HallPage.tsx` and `hall-view.ts` (the page).

## The six Halls

| Hall | Class | Its Limit Breaks lean on |
|---|---|---|
| Brawler Dojo | Brawler | The five Arms |
| Mage Tower | Mage | The five elements |
| Spell Blade Salle | Spell Blade | An Arm and an element in one hit |
| Cleric Chapel | Cleric | The five elements, with blessings, a curse and support |
| Summoner Circle | Summoner | Beasts that strike with an Arm and its twin element |
| Paladin Bastion | Paladin | Arms, two of them with Light or Dark, and support |

A hall's class is its theme, not a rule: any owned Uma may sit in any hall, whatever class she fights as. On the Hub each
hall shows four pips over its building, a seated Hero's face ringed in the accent color, an empty seat a dot.

## Heroes

- **A seat's Hero** is any owned Uma who is not a Hero elsewhere and not a Learner. She sits in one seat at most.
- **She has no menu:** her Limit Break is always her seat's, at full strength (100%), whatever class she fights as.
- **Its power** is the Limit Break power of the class she fights as ([classes](classes.md#limit-breaks)), shaped by
  the seat. Its hits use their own channel's offense, ATK for an Arm and M.ATK for an element, with her Might and flat
  offense on each kind.
- **Swapping a Hero** keeps the seat's Learners. **Emptying the seat** sends them away; their Bonds stay with them.

## Learners

- **Up to ten Learners** sit under each Hero, and a Learner sits under **two Heroes at most**. A Hero is never a
  Learner, and a Learner leaves her Heroes before she can be seated as one. The pickers grey out anyone who can't take
  the seat and say why ("Already a Hero", "A Learner: leave her Heroes first", "A Hero", "Already has 2 Heroes", "10
  Learners at most").
- **In a fight** her Limit Break menu lists her Heroes' Limit Breaks, each with its Hero's face, the kinds it deals and
  its strength; picking one plays the Hero's bust in the cut-in.
- **Strength:** 50% at Bond 0, plus 5% a Bond Level, 100% at Bond 10. It keeps its whole shape at any strength: its
  weapons and elements (even ones she doesn't carry), its number of hits, its targets and its statuses. Its hits and a
  mend or Barrier scale with the strength; a cleanse or a revive lands whole.
- **Her offense** (C3): an inherited Limit Break hits with the higher of her ATK and M.ATK, whatever its kinds. Each kind
  still decides weaknesses, shield chips and locks, and brings her Might and flat offense on that kind. A Mage can carry
  an Arms Limit Break to Break a foe weak only to Arms.
- **Her coverage** (CP28): an inherited Limit Break reaches kinds her three weapons miss. A seat in the hall reads the
  twin sets its Limit Break answers ("Answers Fire · Light"), and the Learner picker the sets a seat would add to hers
  ("Adds Light, Dark, Twilight"), by her active class's weapons ([classes](classes.md#weapons)).

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

## The 24 Limit Breaks

- **Power:** at 100% a Limit Break is worth her class's Limit Break power × her open depth's single-target power (the
  deepest depth her Class Rank opens), shared among its hits. Every-foe hits and splashes deal the area share (0.55 a
  foe); random hits get the 1.05 bonus, as skills do. Limit Breaks never take a Skill Rank. The gauge, its charge and
  the cost are in [combat](combat.md#limit-breaks).
- **Kinds:** each hit carries one kind, or two at once (Twilight Eclipse, the Spell Blade Salle's four, Cinder Wyrm's
  bite, Frost Behemoth, Archangel's Verdict and Archdemon's Pact's rends). A two-kind hit lands as two parts at half its
  power, one of each kind, and each part is weak, chips a shield and breaks a lock on its own.
- **Support:** four also tend the party. Dawn Hymn mends every Uma, Frost Sanctuary cleanses and Barriers every Uma,
  Rampart Charge Barriers every Uma, and Valkyrie Lances raises the first fallen. A mend or a Barrier is 66% × 0.4 of
  each Uma's max HP, × the caster's healing scale ([combat](combat.md#support)) and the cast's strength.
- **Statuses:** Choir of Angels gives every ally Aegis 2, Legion of Demons hexes every foe before its claws, Archangel's
  Verdict gives every ally Brave 2 and Faith 2, and Archdemon's Pact puts Armor Break 3 and Mind Break 3 on its foe
  before its rends. A cast with no hits only casts its status.

<!-- live:heroes -->
| Hall | Seat | Limit Break | Kinds | What it does | Casts |
|---|---|---|---|---|---|
| Brawler Dojo (Brawler) | 1 | Arsenal Rush | greatsword, axe, lance, bow, katana | A blow with every Arm in turn on one foe | 5 hits on one foe |
| Brawler Dojo (Brawler) | 2 | Iaido Cleave | greatsword, katana | One Greatsword cleave, then two Katana draws, on one foe | 3 hits on one foe |
| Brawler Dojo (Brawler) | 3 | Spear and Arrow Storm | lance, bow | Eight blows at random foes, Lance and Bow in turn | 8 hits on random foes |
| Brawler Dojo (Brawler) | 4 | Earthsplitter | axe | Three Axe quakes on every foe | 3 hits on every foe |
| Mage Tower (Mage) | 1 | Elemental Cascade | fire, ice, lightning, light, dark | A spell of every element in turn on one foe | 5 hits on one foe |
| Mage Tower (Mage) | 2 | Twilight Eclipse | light, dark | One hit of Light and Dark at once on one foe | 1 hit on one foe |
| Mage Tower (Mage) | 3 | Trinity Storm | fire, ice, lightning | Three great spells, Fire, Ice and Lightning, on one foe | 3 hits on one foe |
| Mage Tower (Mage) | 4 | Chaos Rain | light, dark | Twelve bolts at random foes, Light and Dark in turn | 12 hits on random foes |
| Spell Blade Salle (Spell Blade) | 1 | Sunfire Edge | greatsword, fire | Three Greatsword-and-Fire cleaves on one foe; its flames splash every other foe | 3 hits on one foe + splash |
| Spell Blade Salle (Spell Blade) | 2 | Rimefang Waltz | katana, ice | Six Katana-and-Ice cuts on one foe | 6 hits on one foe |
| Spell Blade Salle (Spell Blade) | 3 | Thunder Javelin | lance, lightning | Four Lance-and-Lightning throws at random foes | 4 hits on random foes |
| Spell Blade Salle (Spell Blade) | 4 | Eclipse Volley | bow, light, dark | Bow volleys on every foe, one of Light, one of Dark | 2 hits on every foe |
| Cleric Chapel (Cleric) | 1 | Choir of Angels | light, lightning | Light on every foe, then Lightning on every foe, then Aegis 2 on every ally | 2 hits on every foe + aegis 2 on every ally |
| Cleric Chapel (Cleric) | 2 | Legion of Demons | dark | Hex on every foe, then eight Dark claws at random foes | hex 1 on every foe; 8 hits on random foes |
| Cleric Chapel (Cleric) | 3 | Dawn Hymn | fire | Fire on every foe, then a mend on every ally | 1 hit on every foe + a mend on every ally |
| Cleric Chapel (Cleric) | 4 | Frost Sanctuary | ice | Ice on every foe, then a cleanse and a Barrier on every ally | 1 hit on every foe + a Barrier on every ally + a cleanse |
| Summoner Circle (Summoner) | 1 | Cinder Wyrm | greatsword, fire | A Greatsword-and-Fire bite on one foe, then Fire breath on every foe | 1 hit on one foe; 1 hit on every foe |
| Summoner Circle (Summoner) | 2 | Frost Behemoth | axe, ice | Two Axe-and-Ice stomps on every foe | 2 hits on every foe |
| Summoner Circle (Summoner) | 3 | Thunderbird | lance, lightning | Six dives at random foes, Lance and Lightning in turn | 6 hits on random foes |
| Summoner Circle (Summoner) | 4 | Moon Fox | katana, dark, bow, light | Eight strikes at random foes: Katana, Dark, Bow and Light in turn | 8 hits on random foes |
| Paladin Bastion (Paladin) | 1 | Archangel’s Verdict | greatsword, light | A Greatsword-and-Light judgment on one foe, then Brave and Faith 2 on every ally | 1 hit on one foe + brave 2 on every ally; faith 2 on every ally |
| Paladin Bastion (Paladin) | 2 | Archdemon’s Pact | katana, dark | Armor Break and Mind Break 3 on one foe, then three Katana-and-Dark rends | armor-break 3 on the foe; mind-break 3 on the foe; 3 hits on one foe |
| Paladin Bastion (Paladin) | 3 | Rampart Charge | axe | One Axe charge on one foe, then a Barrier on every ally | 1 hit on one foe + a Barrier on every ally |
| Paladin Bastion (Paladin) | 4 | Valkyrie Lances | lance | Four Lance hits at random foes, then the first fallen ally rises | 4 hits on random foes + the first fallen rises |

| Setting | Value |
|---|---|
| Seats | 4 per hall, 6 halls, 24 in all; a Hero sits in one seat |
| Learners | 10 per Hero; 2 Heroes per Learner; a Hero is never a Learner |
| Power at 100% | her own class's Limit Break, in single-target casts at her open depth: Brawler 2×, Mage 2.4×, Spell Blade 2.2×, Cleric 1.5×, Summoner 2.2×, Paladin 1.5× |
| Learner strength | 50% at Bond 0, +5% a Bond Level, 100% at Bond 10 |
| Bond EXP per won fight | 2 a stage, 3 an elite or boss, toward each of a Learner's Heroes, or a Hero's own seat; 12 a level (Sweeps and replays count) |
<!-- /live -->

## In the engine

- **A fight's input** (`BattleAlly`): an ally may carry `hero` (her seat) or `inherits` (one or two seats, each with
  her Bond Level and the Hero's outfit id), never both; `save/heroes.ts`' `heroFields` builds them from the world when a
  fight starts. A `limit` action names `hero`: a Hero only her own seat, a Learner one of hers.
- **An ally with neither** has no Limit Break: her gauge fills, the "LB" badge never shows, and a `limit` action is
  refused.
- **Auto** (`rpg/battle/auto.ts`) fires a Hero's own Limit Break, and a Learner's with the strongest Bond (the first of
  her seats on a tie), on the foe it scores best.
- **Each seat by engine:** `heroLimitFor(id, version)` gives a seat's Limit Break in the fight's own engine, so fights
  from older engines replay with their halls ([combat](combat.md)).
