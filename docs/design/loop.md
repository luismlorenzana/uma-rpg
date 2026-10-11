# The core loop: fights feed the Hub

> **Status: current (owner, 2026-10-11; D66–D68).** Tokens and linear ranks are built; the world map that sets the
> bands is a proposal ([world/](world/README.md)). Numbers live in `packages/domain/src/economy/tokens.ts` and
> `pacing.ts`.

## The loop

1. **Fight.** Win stages at your Umas' level. They earn EXP and Laurels, and the win drops **tokens** of the fight's band.
2. **Craft and cook.** The Forge needs a **Crafting Token**, the Kitchen a **Cooking Token**, both of the band of what
   you make, plus the usual refined items.
3. **Equip and eat.** Gear goes on; dishes unlock Extra Stats nodes.
4. **Promote.** A class rank trains passively in its hall but starts only by spending a **Class Promotion Token**.
   Weapon mastery trains passively, time alone.
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

- **Drops per win** (seeded by the fight, so a replay drops the same): regular fight 2, stage sub-boss 4, Finals
  vanguard 3, champion 6. Sub-bosses and champions always include a Promotion Token. Each other drop is Crafting
  42.5%, Cooking 42.5%, Promotion 15%, at a random class or stat.
- **Sweeps drop no tokens**: tokens come from fights you play.
- **Swaps**: the Exchange trades **three tokens of one kind and band for one of your choice**, so bad luck never
  stalls a plan.
- Tokens can't be sold. They sit in the Warehouse's **Tokens** shelf, by band.

## Ranks are linear (D68)

| Track | Per rank, at G | At A | Whole track at G |
|---|---|---|---|
| Class rank (1 → 6) | 6 h | 3 h | 30 h, plus a Promotion Token per rank |
| Weapon mastery (1 → 10) | 3 h | 1½ h | 27 h |

Per band that's one class rank and two mastery ranks: 6 hours of each at G.

## How long Lv1 → 50 takes (D66)

**About 2 hours of fighting for a fresh party** (about 60 stages of about two minutes), **about 1 hour** for Umas
riding with higher-level ones (the catch-up EXP). The full Tier 1 collection (248 Umas at Lv50, D40) is then about
100 hours of fights, paced in practice by the loop above: each band waits on its promotions, gear and dishes.

On the world map that means **about 0.8 of a level per regular stage**, so about 24 stages a level serve about 20
parties' first clears ([world/README.md](world/README.md)). Chapters keep today's EXP until the world map replaces
them.

## What a party needs per band, and what it gets

| Per Uma, per band | Tokens |
|---|---|
| One class promotion | 1 Promotion |
| Weapon, armor and accessory, once | 3–4 Crafting |
| About five dishes (five more active nodes per ten levels) | about 5 Cooking |

About 45–50 tokens per party per band. With chapters today, a party's ~25 fights per band drop about 60. On the world
map, about 12 stages per band drop fewer, so the band's elites and bosses carry more. The balance pass sets that with
the world map, and tokens pool across parties either way.
