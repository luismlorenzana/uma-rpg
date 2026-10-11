# The core loop: fights feed the Hub

> **Status: current (owner, 2026-10-11; D66–D71).** Tokens and linear ranks are built; the world map that sets the
> bands is a proposal ([world/](world/README.md)). Numbers live in `packages/domain/src/economy/tokens.ts` and
> `pacing.ts`.

## The loop

1. **Fight.** Win stages at your Umas' level. They earn EXP and Laurels, and the win drops **tokens** of the fight's band.
2. **Craft and cook.** The Forge needs a **Crafting Token**, the Kitchen a **Cooking Token**, both of the band of what
   you make, plus the usual refined items.
3. **Equip and eat.** Gear goes on; dishes unlock Extra Stats nodes.
4. **Promote.** A class rank trains passively in its hall but starts only by spending a **Class Promotion Token**.
   Weapon, Armor and Accessory Levels train passively, time alone (D70).
5. **Back to fighting**, one band up, for the next band's tokens.

While one party waits on its promotions and gear, you fight with another. That rotation is the point.

## Bands

A **band** is ten levels: a continent of the world map. Band n covers:

| Band | Fights at | Class promotion | Gear and dish grades |
|---|---|---|---|
| 1 | Lv1–10 | rank 1 → 2 | 1–2 |
| 2 | Lv11–20 | rank 2 → 3 | 3–4 |
| 3 | Lv21–30 | rank 3 → 4 | 5–6 |
| 4 | Lv31–40 | rank 4 → 5 | 7–8 |
| 5 | Lv41–50 | — (rank 5 is the top, D77) | 9–10 |

## Tokens

Per band, 21 kinds; Crafting and Cooking mirror each other on the eight stats, the same eight the item families pair up
on (§8.2):

| Token | Kinds per band | Spent on |
|---|---|---|
| **Class Promotion** | 5: one per class (bands 1–4) | Starting a class rank in its hall (taken when the job starts, returned on recall) |
| **Crafting** | 8: one per stat | Crafting a piece whose **accent** is that stat: an ATK Crafting Token makes any ATK-accent gear of its band |
| **Cooking** | 8: one per stat | Cooking a dish that **feeds** that stat. Duo dishes take one of each of their two stats, Feasts one of each of all eight |

- **Drops per win** (seeded by the fight, so a replay drops the same; D82): regular stage 2, elite 3, Finals vanguard
  3, boss or champion 5. Sub-bosses and champions always include a Promotion Token. Each other drop is Crafting
  42.5%, Cooking 42.5%, Promotion 15%, at a random class or stat. Band 5 drops no Promotion Tokens: their share goes to
  Crafting or Cooking (D77).
- **Replays** (D79): a stage already cleared drops each token with a 25% chance, and Sweeps pay as replays.
- **Laurels** (D80): any token sells for **20 Laurels × its band** and the Exchange sells **any token for twice that**,
  so two tokens of a band buy one of any kind in it, and bad luck never stalls a plan. Low bands can't cheaply buy high
  ones: ten band-1 tokens buy one band-5 token.
- They sit in the Warehouse's **Tokens** shelf, by band, and sell from there too.

## Ranks and levels are linear (D68, D70)

| Track | Where | Per step, at G | At A | Whole track at G |
|---|---|---|---|---|
| Class rank (1 → 5) | Its class hall | 6 h | 3 h | 24 h, plus a Promotion Token per rank |
| Weapon Level (1 → 10), per class | Its class hall | 3 h | 1½ h | 27 h |
| Armor Level (1 → 10) | The Armory | 3 h | 1½ h | 27 h |
| Accessory Level (1 → 10) | The Jeweler | 3 h | 1½ h | 27 h |

Level k wears grade k. Per band that's one class rank and two levels of each gear track.

## How long Lv1 → 50 takes (D71)

**About 4 hours of fighting for a fresh party** (about 120 stages of about two minutes), less for Umas riding with
higher-level ones (the catch-up EXP). **About 20 parties make the 100-hour mark**, paced in practice by the loop above:
each band waits on its promotions, gear and dishes.

On the world map that means **about 0.4 of a level per regular stage**, so 48 stages a level serve about 20 parties'
first clears ([world/README.md](world/README.md)). Built as D72: stages pay 0.4 / 0.6 / 0.8 of a level (regular, elite,
boss) and drop 2 / 3 / 5 tokens (D82).

## What one Uma earns from Lv1 to Lv50 (D82)

Each Uma counts as a fifth of her party's fights. A region's twelve stages pay 5.4 levels of EXP at its level, so a
party clears about 1.85 regions' worth of fresh stages per band and about nine on the way to Lv50.

| Track | Cost in tokens | Before D82, per Uma | Since D82, per Uma | Target |
|---|---|---|---|---|
| A class, rank 1 → 5 | 4 Promotion (one each of bands 1–4) | ~6 (1.5 classes) | ~8.7 (2.2 classes) | 2 classes |
| A weapon track, grade 1 → 10 (the Weapon Level itself is time only) | 10 Crafting (two a band) | ~11 (1 track) | ~21 (2.1 tracks) | 2 tracks |
| An Extra Stats planet, moons 1 → 10 | 10 Cooking (two a band) | ~11 (1 planet) | ~21 (2.1 planets) | 2 planets |

The whole Sun-and-planets map (100 nodes) costs 144 Cooking Tokens: 80 for the eight planets, 32 for the sixteen
bridges' Duo dishes and 32 for the Sun's four Feasts.

**Late Laurels**: stages at Lv41–50 pay four times the Laurels, about 580 extra per Uma over the band. A full class's four
Promotion Tokens cost 400 at the Exchange, so that's about one and a half more classes, or anything else Laurels buy.
The test `tokens.test.ts` keeps these numbers honest.
