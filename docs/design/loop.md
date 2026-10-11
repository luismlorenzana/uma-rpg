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

A **band** is ten levels: a continent of the world map (today, a chapter). Band n covers:

| Band | Fights at | Class promotion | Gear and dish grades |
|---|---|---|---|
| 1 | Lv1–10 | rank 1 → 2 | 1–2 |
| 2 | Lv11–20 | rank 2 → 3 | 3–4 |
| 3 | Lv21–30 | rank 3 → 4 | 5–6 |
| 4 | Lv31–40 | rank 4 → 5 | 7–8 |
| 5 | Lv41–50 | rank 5 → 6 | 9–10 |

## Tokens

Per band, 21 kinds; Crafting and Cooking mirror each other on the eight stats, the same eight the item families pair up
on (§8.2):

| Token | Kinds per band | Spent on |
|---|---|---|
| **Class Promotion** | 5: one per class | Starting a class rank in its hall (taken when the job starts, returned on recall) |
| **Crafting** | 8: one per stat | Crafting a piece whose **accent** is that stat: an ATK Crafting Token makes any ATK-accent gear of its band |
| **Cooking** | 8: one per stat | Cooking a dish that **feeds** that stat. Duo dishes take one of each of their two stats, Feasts one of each of all eight |

- **Drops per win** (seeded by the fight, so a replay drops the same; halved by D71): regular fight 1, stage
  sub-boss 2, Finals vanguard 2, champion 3. Sub-bosses and champions always include a Promotion Token. Each other drop is Crafting
  42.5%, Cooking 42.5%, Promotion 15%, at a random class or stat.
- **Sweeps drop no tokens**: tokens come from fights you play.
- **Swaps**: the Exchange trades **three tokens of one kind and band for one of your choice**, so bad luck never
  stalls a plan.
- Tokens can't be sold. They sit in the Warehouse's **Tokens** shelf, by band.

## Ranks and levels are linear (D68, D70)

| Track | Where | Per step, at G | At A | Whole track at G |
|---|---|---|---|---|
| Class rank (1 → 6) | Its class hall | 6 h | 3 h | 30 h, plus a Promotion Token per rank |
| Weapon Level (1 → 10), per class | Its class hall | 3 h | 1½ h | 27 h |
| Armor Level (1 → 10) | The Armory | 3 h | 1½ h | 27 h |
| Accessory Level (1 → 10) | The Jeweler | 3 h | 1½ h | 27 h |

Level k wears grade k. Per band that's one class rank and two levels of each gear track.

## How long Lv1 → 50 takes (D71)

**About 4 hours of fighting for a fresh party** (about 120 stages of about two minutes), less for Umas riding with
higher-level ones (the catch-up EXP). **About 20 parties make the 100-hour mark**, paced in practice by the loop above:
each band waits on its promotions, gear and dishes.

On the world map that means **about 0.4 of a level per regular stage**, so 48 stages a level serve about 20 parties'
first clears ([world/README.md](world/README.md)). In today's chapters, clearing every node ends a party at Lv 7, 15,
24, 33 and 43, and replays close the gap.

## What a party needs per band, and what it gets

| Per Uma, per band | Tokens |
|---|---|
| One class promotion | 1 Promotion |
| Weapon, armor and accessory, once | 3–4 Crafting |
| About five dishes (five more active nodes per ten levels) | about 5 Cooking |

About 45–50 tokens per party per band. With chapters today, a party's ~25 fights per band (plus replays) drop about
30–40; on the world map, about 24 stages per band drop about the same, with elites and bosses carrying more. Tokens pool
across parties and swap three for one, and the balance pass tunes the drops with the world map.
