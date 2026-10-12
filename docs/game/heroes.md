# Halls of Heroes and inheritance

The Learning page's five class halls are its **Halls of Heroes** (D106). Each hall has four seats, and each seat
teaches one unique Limit Break (D107): twenty in all. Code: `packages/domain/src/rpg/heroes.ts` (the Limit Breaks),
`rpg/hero-id.ts` (ids and Bond numbers), `save/heroes.ts` (seats, Learners, Bonds), `rpg/battle/limit.ts` (casting),
`apps/web/src/places/halls/HallPage.tsx` (the page).

## Heroes

- **A seat's Hero** is any owned Uma who is not a Hero elsewhere and not a Learner. She sits in one seat at most.
- **She has no menu:** her Limit Break is always her seat's, at full strength (100%), whatever class she fights as.
  Its power is her own class's Limit Break power (about twice a turn's damage), shaped by the seat.
- **Swapping a Hero** keeps the seat's Learners. **Emptying the seat** sends them away; their Bonds stay with them.
- The halls appear on the Hub map with a gold ring for each seated Hero.

## Learners

- **Up to ten Learners** sit under each Hero, and a Learner sits under **two Heroes at most**. A Hero is never a
  Learner. The pickers hide anyone who can't take the seat: Heroes, and Learners who already have two Heroes.
- **In a fight** her Limit Break menu lists her own class's Limit Breaks and then each Hero's, with the Hero's face, the
  kinds it deals and its strength. Picking an inherited one plays the Hero's bust in the cut-in.
- **Strength:** 50% at Bond 0, plus 5% a Bond Level, 100% at Bond 10. It keeps its whole shape at any strength: its
  weapons and elements (even ones she doesn't carry), its number of hits, its targets and its statuses.
- **Bond EXP:** every won fight, replays and Sweeps included, raises her Bond with each of her Heroes. A Bond is kept
  when she leaves a Hero, so returning picks up where she was. On first clears alone, a Learner bonds fully with two
  Heroes by about Lv 23 and with four by Lv 50.
- Her profile's Skills tab lists her seat, or her Heroes and every Bond she has made.

## The twenty Limit Breaks

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
| Spell Blade Salle (Spell Blade) | 1 | Sunfire Edge | greatsword, fire | A Greatsword-and-Fire cleave on one foe; its flames splash every other foe | 1 hit on one foe + splash |
| Spell Blade Salle (Spell Blade) | 2 | Rimefang Waltz | katana, ice | Six Katana-and-Ice cuts on one foe | 6 hits on one foe |
| Spell Blade Salle (Spell Blade) | 3 | Thunder Javelin | lance, lightning | Four Lance-and-Lightning throws at random foes | 4 hits on random foes |
| Spell Blade Salle (Spell Blade) | 4 | Eclipse Volley | bow, light, dark | Bow volleys on every foe, one of Light, one of Dark | 2 hits on every foe |
| Cleric Chapel (Cleric) | 1 | Choir of Angels | light | Light on every foe twice, then Aegis 2 on every ally | 2 hits on every foe + aegis 2 on every ally |
| Cleric Chapel (Cleric) | 2 | Legion of Demons | dark | Hex on every foe, then eight Dark claws at random foes | hex 1 on every foe; 8 hits on random foes |
| Cleric Chapel (Cleric) | 3 | Archangel’s Verdict | greatsword, light | A Greatsword-and-Light judgment on one foe, then Brave and Faith 2 on every ally | 1 hit on one foe + brave 2 on every ally; faith 2 on every ally |
| Cleric Chapel (Cleric) | 4 | Archdemon’s Pact | katana, dark | Armor Break and Mind Break 3 on one foe, then three Katana-and-Dark rends | armor-break 3 on the foe; mind-break 3 on the foe; 3 hits on one foe |
| Summoner Circle (Summoner) | 1 | Cinder Wyrm | greatsword, fire | A Greatsword-and-Fire bite on one foe, then Fire breath on every foe | 1 hit on one foe; 1 hit on every foe |
| Summoner Circle (Summoner) | 2 | Frost Behemoth | axe, ice | Two Axe-and-Ice stomps on every foe | 2 hits on every foe |
| Summoner Circle (Summoner) | 3 | Thunderbird | lance, lightning | Six dives at random foes, Lance and Lightning in turn | 6 hits on random foes |
| Summoner Circle (Summoner) | 4 | Moon Fox | katana, dark, bow, light | Eight strikes on one foe: Katana, Dark, Bow and Light in turn | 8 hits on one foe |

| Setting | Value |
|---|---|
| Seats | 4 per hall, 20 in all; a Hero sits in one seat |
| Learners | 10 per Hero; 2 Heroes per Learner; a Hero is never a Learner |
| Power at 100% | her own class's Limit Break, in single-target casts at her open depth: Brawler 2×, Mage 2.4×, Spell Blade 2×, Cleric 1.5×, Summoner 1.8× |
| Learner strength | 50% at Bond 0, +5% a Bond Level, 100% at Bond 10 |
| Bond EXP per won fight | 2 a stage, 3 an elite or boss, toward each of her Heroes; 12 a level (Sweeps and replays count) |
<!-- /live -->

## Rules in the engine

- Engine v9 (`BattleInput.version: 9`): an ally may carry `hero` (her seat) or `inherits` (one or two seats, each with
  its Bond Level and the Hero's outfit id). A `limit` action may name `hero`. Older fights replay unchanged.
- Every-foe hits and splashes deal the area share (0.55 a foe); random hits get the 1.05 bonus, as skills do.
- A cast with no hits only casts its status (the Legion of Demons hexes every foe before its claws land).
- Auto (`rpg/battle/auto.ts`) fires a Hero's own Limit Break, and a Learner's own class Limit Break first, or her first
  Hero's when she has none of her own.
