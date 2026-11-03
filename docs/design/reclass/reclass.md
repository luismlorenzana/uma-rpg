# Reclass: every calling promotes into three classes

**Status:** proposal for the owner's review, 2026-11-02. Nothing is built. The preview page is
[previews/reclass.html](previews/reclass.html) (the tree today and proposed, each calling's trio and its weapons).

## The owner's points

- Now that a window asks for several classes at Class Rank 50 (Class IV and V: two and three Tier 1 classes, D283),
  every base class should be able to reclass into at least three classes; more than three may be fine too.
- The Brawler and the Sorcerer feel well balanced because they only reclass into physical and magical classes
  respectively. Keep some limits on every class, by its identity.

## 1. Today

A Tier 0 promotes at Class Rank 10 into its children ([classes](../../game/classes.md#tier-0-and-promotion)). Every Tier 0
is open to every Uma, so any Uma can reach any Tier 1 class; what differs is how many come **inside her family**, one tap
each once her Tier 0 is at Rank 10. Another family costs one more Tier 0 at Rank 10: 3,600 Class EXP, four Class
Manuals or the first continent's fights.

| Tier 0 (calling) | Outfits with it | Promotes into today | Weapon kinds on their presets |
|---|---|---|---|
| Warrior | 48 | Brawler, Arms Spellblade, Arms Summoner | 7 |
| Mage | 72 | Sorcerer, Tome Spellblade, Tome Summoner | 6 |
| Spellblade | 72 | Arms Spellblade, Tome Spellblade | 4 |
| Summoner | 34 | Arms Summoner, Tome Summoner | 4 |
| Healer | 46 | Paladin, Cleric | 4 |

So 152 of the 272 outfits (56%) start in a family of two. For them the window's Class V (three Tier 1 classes at Rank
50) needs a second Tier 0, and the Weapons track (five weapon kinds, D289) needs a class outside the family, since two
classes' presets hold only four kinds.

## 2. The rule proposed: three children each, by identity

Four limits, so every class keeps what it is:

1. **The pure roots stay pure.** The Brawler opens only from the Warrior, the Sorcerer only from the Mage. These are
   the owner's balanced pair: the physical root and the magical root, never a hybrid's side door.
2. **Healing stays the Healer's.** The Paladin and the Cleric open only from the Healer, so the one-healer-a-party rule
   keeps its weight and a healer is still a calling, not a pick-up.
3. **The Spellblade and the Summoner are kin.** The Spellblade Salle's word is "pacts with familiars", the Summoner
   Circle's "familiars, summoned": each opens one of the other's classes, on the side it already leans to. The
   Spellblade (modelled on the Arms Spellblade) opens the **Arms Summoner**; the Summoner (modelled on the Tome
   Summoner) opens the **Tome Spellblade**.
4. **The Healer's third is the Tome Summoner.** The Healer Sanctum's Limit Breaks are already summoned beings (Seraph's
   Storm, Cinder Fiend's Barrage): a deity's seraphs and fiends answer her. It's the Tome side, the side of the
   Cleric she's modelled on.

| Tier 0 | Promotes into, proposed | New | Weapon kinds on the presets |
|---|---|---|---|
| Warrior | Brawler, Arms Spellblade, Arms Summoner | — | 7 |
| Mage | Sorcerer, Tome Spellblade, Tome Summoner | — | 6 |
| Spellblade | Arms Spellblade, Tome Spellblade, **Arms Summoner** | Arms Summoner | 6 |
| Summoner | Arms Summoner, Tome Summoner, **Tome Spellblade** | Tome Spellblade | 6 |
| Healer | Paladin, Cleric, **Tome Summoner** | Tome Summoner | 7 |

Every calling then reaches Class V and the Weapons track inside its own family, on the presets alone. The tree gets
three new edges; no class closes, none is removed.

**Each Tier 1 class's parents, after:**

| Class | Opens with |
|---|---|
| Brawler | Warrior |
| Arms Spellblade | Warrior, Spellblade |
| Arms Summoner | Warrior, Summoner, **Spellblade** |
| Paladin | Healer |
| Cleric | Healer |
| Tome Summoner | Mage, Summoner, **Healer** |
| Tome Spellblade | Mage, Spellblade, **Summoner** |
| Sorcerer | Mage |

## 3. Alternatives considered

- **A. Keep the tree.** Class V and Weapons stay reachable for everyone through a second Tier 0 (3,600 Class EXP each).
  Cheapest, but the 56% in families of two pay a step the other 44% don't, and it reads as a wall.
- **B. Four for the hybrids** ("more than three"): the Spellblade and the Summoner each open both of the other's
  classes (four each), the Healer both Summoners. More choice, but the Spellblade's and the Summoner's families become the
  same four classes and stop meaning anything; their halls would differ in name only.
- **C. Channel lock for the hybrids** (each opens every class of the channel it models, like the Warrior and the Mage):
  the Spellblade would open the Brawler and the Healer the Sorcerer-side classes, breaking limits 1 and 2.

**Recommended: the rule in §2.** It meets the owner's "at least three" for every calling with the fewest new links,
and each link has a reason already in the game (the halls' words, the Sanctum's summons).

## 4. What it touches

- **The rules:** `RPG_CLASS_CHILDREN` and `RPG_CLASS_PARENTS` (`rpg/class-tree.ts`): three new edges. Gates and the
  "Opens with Warrior R10 or Summoner R10" text read them, so a closed class names three parents where it has them.
- **No save change.** A Tier 1 class is still opened by promotion from a parent at Rank 10; a save that's valid today
  stays valid, since only new doors open. An Uma whose Spellblade, Summoner or Healer is already at Rank 10 sees her new
  child **Ready** at once.
- **No engine bump either.** A fight reads the class she fights as, never the tree, so an open fight replays the same.
- **The promotion sheet:** three children for every Tier 0, the Suggested badge unchanged in spirit (the family's own
  class first: the Spellblade's Arms or Tome Spellblade by Power and Wit, the Summoner's Arms or Tome Summoner, the
  Healer's Paladin or Cleric), the kin class never suggested.
- **The manual:** classes.md's tree, its Tier 0 table (live, from the code) and the reclass table; the class tree preview
  page.
- **Not touched:** the halls and their seats, Flourishes (a Tier 0's Flourish still works as its family; the kin class
  isn't her family), presets, the Rift's guidance, Tier 2 and 3 (no Tier 0 there: every Tier 1 class opens at Rank 1).

## 5. Decisions to take

| Id | Call | Recommended |
|---|---|---|
| RC1 | Three children for every Tier 0 | Yes |
| RC2 | The pure roots stay pure (Brawler from the Warrior, Sorcerer from the Mage) | Yes |
| RC3 | Healers only from the Healer | Yes |
| RC4 | Kin: the Spellblade opens the Arms Summoner, the Summoner the Tome Spellblade | Yes |
| RC5 | The Healer's third is the Tome Summoner | Yes |
| RC6 | The kin class is never Suggested, and a Flourish doesn't work as it | Yes |
| RC7 | No save or engine bump: only new doors open | Yes |
