# Halls of Heroes and inheritance

The Learning page's six class halls are its **Halls of Heroes** (D106), and the **only source of Limit Breaks** (D112):
an Uma who is neither a Hero nor a Learner has none. Each hall has four seats, and each seat teaches one unique Limit
Break (D107): 24 in all, with the Paladin Bastion's four (classes v2 §5, D181, live since H61). Code:
`packages/domain/src/rpg/heroes.ts` (the Limit Breaks), `rpg/hero-id.ts` (ids and Bond numbers), `save/heroes.ts`
(seats, Learners, Bonds), `rpg/battle/limit.ts` (casting), `apps/web/src/places/halls/HallPage.tsx` (the page).

## Heroes

- **A seat's Hero** is any owned Uma who is not a Hero elsewhere and not a Learner. She sits in one seat at most.
- **She has no menu:** her Limit Break is always her seat's, at full strength (100%), whatever class she fights as.
  Its power is her own class's Limit Break power (about twice a turn's damage), shaped by the seat.
- **Her own Bond:** every won fight raises a Hero's Bond with her own seat, as a Learner's (D112). Taken out of her
  seat and put back as its Learner, she starts at the Bond she earned. The Hero's sheet in the hall shows it.
- **Swapping a Hero** keeps the seat's Learners. **Emptying the seat** sends them away; their Bonds stay with them.
- The halls appear on the Hub map with a gold ring for each seated Hero.

## Learners

- **Up to ten Learners** sit under each Hero, and a Learner sits under **two Heroes at most**. A Hero is never a
  Learner. The pickers hide anyone who can't take the seat: Heroes, and Learners who already have two Heroes.
- **In a fight** her Limit Break menu lists her Heroes' Limit Breaks, with the Hero's face, the kinds it deals and its
  strength. Picking one plays the Hero's bust in the cut-in. She has no class Limit Break of her own (D112).
- **Strength:** 50% at Bond 0, plus 5% a Bond Level, 100% at Bond 10. It keeps its whole shape at any strength: its
  weapons and elements (even ones she doesn't carry), its number of hits, its targets and its statuses. A mend or
  Barrier scales with the strength; a cleanse or a revive lands whole.
- **Her offense** (C3): an inherited Limit Break hits with the higher of her ATK and M.ATK, whatever its kinds, and its
  kinds still decide weaknesses and locks. A Mage can carry an Arms Limit Break to Break a foe weak only to Arms. A
  Hero's own Limit Break hits with each kind's own offense.
- **Bond EXP:** every won fight, replays and Sweeps included, raises her Bond with each of her Heroes. A Bond is kept
  when she leaves a Hero, so returning picks up where she was. On first clears alone, a Learner bonds fully with two
  Heroes by about Lv 23 and with four by Lv 50.
- Her profile's Skills tab lists her seat, or her Heroes and every Bond she has made.

## The 24 Limit Breaks

Four of them also tend the party: Dawn Hymn mends every Uma, Frost Sanctuary cleanses and Barriers every Uma, Rampart
Charge Barriers every Uma, and Valkyrie Lances raises the first fallen. A mend or a Barrier is 66% × 0.4 of each Uma's
max HP, × the caster's healing scale ([combat](combat.md#support)) and the cast's strength; the cleanse and the revive
land at any strength. When the Paladin came (save v25), the
Chapel's seats 3 and 4, Archangel's Verdict and Archdemon's Pact, moved to the Bastion's seats 1 and 2 with their
Heroes, Learners and Bonds; the Chapel's seats 3 and 4 now teach Dawn Hymn and Frost Sanctuary.

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
| Cleric Chapel (Cleric) | 1 | Choir of Angels | light | Light on every foe twice, then Aegis 2 on every ally | 2 hits on every foe + aegis 2 on every ally |
| Cleric Chapel (Cleric) | 2 | Legion of Demons | dark | Hex on every foe, then eight Dark claws at random foes | hex 1 on every foe; 8 hits on random foes |
| Cleric Chapel (Cleric) | 3 | Dawn Hymn | fire | Fire on every foe, then a mend on every ally | 1 hit on every foe + a mend on every ally |
| Cleric Chapel (Cleric) | 4 | Frost Sanctuary | ice | Ice on every foe, then a cleanse and a Barrier on every ally | 1 hit on every foe + a Barrier on every ally + a cleanse |
| Summoner Circle (Summoner) | 1 | Cinder Wyrm | greatsword, fire | A Greatsword-and-Fire bite on one foe, then Fire breath on every foe | 1 hit on one foe; 1 hit on every foe |
| Summoner Circle (Summoner) | 2 | Frost Behemoth | axe, ice | Two Axe-and-Ice stomps on every foe | 2 hits on every foe |
| Summoner Circle (Summoner) | 3 | Thunderbird | lance, lightning | Six dives at random foes, Lance and Lightning in turn | 6 hits on random foes |
| Summoner Circle (Summoner) | 4 | Moon Fox | katana, dark, bow, light | Eight strikes at random foes: Katana, Dark, Bow and Light in turn | 8 hits on random foes |
| Paladin Bastion (Paladin) | 1 | Archangel’s Verdict | greatsword, light | A Greatsword-and-Light judgment on one foe, then Brave and Faith 2 on every ally | 1 hit on one foe + brave 2 on every ally; faith 2 on every ally |
| Paladin Bastion (Paladin) | 2 | Archdemon’s Pact | katana, dark | Armor Break and Mind Break 3 on one foe, then three Katana-and-Dark rends | armor-break 3 on the foe; mind-break 3 on the foe; 3 hits on one foe |
| Paladin Bastion (Paladin) | 3 | Rampart Charge | greatsword | One Greatsword charge on one foe, then a Barrier on every ally | 1 hit on one foe + a Barrier on every ally |
| Paladin Bastion (Paladin) | 4 | Valkyrie Lances | lance | Four Lance hits at random foes, then the first fallen ally rises | 4 hits on random foes + the first fallen rises |

| Setting | Value |
|---|---|
| Seats | 4 per hall, 6 halls, 24 in all; a Hero sits in one seat |
| Learners | 10 per Hero; 2 Heroes per Learner; a Hero is never a Learner |
| Power at 100% | her own class's Limit Break, in single-target casts at her open depth: Brawler 2×, Mage 2.4×, Spell Blade 2.2×, Cleric 1.5×, Summoner 2.2×, Paladin 1.5× |
| Learner strength | 50% at Bond 0, +5% a Bond Level, 100% at Bond 10 |
| Bond EXP per won fight | 2 a stage, 3 an elite or boss, toward each of a Learner's Heroes, or a Hero's own seat; 12 a level (Sweeps and replays count) |
<!-- /live -->

## Rules in the engine

- Engine v9 (`BattleInput.version: 9`): an ally may carry `hero` (her seat) or `inherits` (one or two seats, each with
  its Bond Level and the Hero's outfit id). A `limit` action may name `hero`.
- Engine v10 (D112): the classes' own Limit Breaks are gone, so an ally with neither field has no Limit Break (her
  gauge still fills; the "LB" badge never shows). Fights from v6–v9 replay with theirs.
- Engine v15 (D181): the six halls' 24, the hybrids' power at 2.2×, a hall Limit Break's support at its cast's
  strength, and a Learner's hits at her higher offense. Fights from v10–v14 replay with the five halls' twenty
  (`heroLimitFor(id, version)`).
- Every-foe hits and splashes deal the area share (0.55 a foe); random hits get the 1.05 bonus, as skills do.
- A cast with no hits only casts its status (the Legion of Demons hexes every foe before its claws land).
- Auto (`rpg/battle/auto.ts`) fires a Hero's own Limit Break, and a Learner's strongest Bond.
