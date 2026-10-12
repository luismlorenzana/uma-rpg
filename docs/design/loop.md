# The core loop: fights feed the Hub

> **Status: built through D96, 2026-10-12.** Current currencies, rewards and jobs are generated in
> [the game-loop manual](../game/loops.md) and [materials](../game/materials.md). This page explains why they connect.

## The loop

1. **Fight.** Stages pay Uma EXP, Laurels and tokens of their ten-level band (D72, D82, D93).
2. **Craft and cook.** Forge gear takes four refined materials and no token. Kitchen dishes take refined ingredients
   and Cooking Tokens (D86, D94).
3. **Equip and eat.** Bound gear supplies points and Orb kinds; dishes unlock Extra Stats (D28, D58, D86).
4. **Train.** Class ranks spend Promotion Tokens. Weapon, Armor and Accessory Levels spend Mastery Tokens (D94).
5. **Fight higher levels**, or replay a cleared stage at a quarter reward (D79).

While one party fights, many other Umas work the Hub in parallel. When fighters need training or MP, rotate parties
(D55, D72, D96). This is not a serial five-Uma schedule.

## Bands

A band is a continent's ten levels. Class rank r → r+1 takes band r, up to rank 5 (D77).
A gear-level step from L takes Mastery band ⌈L/2⌉; a dish of grade g takes Cooking band ⌈g/2⌉ (D94).
Exact token ids, kinds and bands are generated in [tokens](../game/materials.md#tokens).

## Tokens

| Kind | Kinds per band | Spend |
|---|---|---|
| Promotion | Five classes, bands 1–4 only | One per class rank-up |
| Mastery | One, bands 1–5 | One per Weapon, Armor or Accessory Level-up |
| Cooking | Eight stats, bands 1–5 | Planet dish one, Duo two, Feast eight |

Crafting Tokens retired in D94. There are 65 token ids, not the earlier 21 per band.
Tokens trade through Laurels: sell for 20 × band, buy for twice that (D80). They live in the Warehouse.

A regular stage drops two, an elite three and a boss five, plus one per extra wave (D82, D93).
A first-clear elite/boss guarantees a Promotion Token in bands 1–4; band 5 splits that share between Mastery and
Cooking. Other drops use 15% Promotion, 42.5% Mastery and 42.5% Cooking. Replay/Sweep drops each have a 25% keep
chance (D79). The seeded roll makes retried saves deterministic, not every separate replay identical.

## Ranks and levels are linear

Class ranks take six base hours per step, twenty-four from 1 to 5. Gear levels take three per step, twenty-seven
from 1 to 10 (D68, D77). Aptitude and facility speed reduce these times; Time Tickets apply (D74).
A full mastery track takes nine Mastery Tokens, usable on any gear-level track, not ten crafted pieces (D94).
Training rules and hall mappings are in [the manual](../game/loops.md#training).

## Fight-time and collection targets

**About four hours of fighting for one fresh Lv1→50 party**, and about twenty parties around the hundred-hour
mark, is the target (D71), not a measured wall-clock guarantee. W3 adds waves and extra rewards (D91, D93).
[The pacing model](pacing.md) owns timers; the pacing simulator measures the current rules without retuning them.

## One Uma's budget (D82, D93, D94)

Counting a fifth of the party's drops, one Uma's Lv1→50 progression is intended to fund:

| Track | Token cost | Target |
|---|---|---|
| Class rank 1→5 | Four Promotion Tokens | Two classes (eight) |
| Gear Level 1→10 | Nine Mastery Tokens | Two mastery tracks (eighteen) |
| Extra Stats planet | Ten Cooking Tokens | Two planets (twenty) |

`save/tokens.test.ts` checks the expected budget using waves' EXP and drops, not the retired chapter model.
It checks Lv41–50's fourfold Laurels against Exchange prices too: the extra Laurels buy roughly one and a half
additional class tracks (D82). Drops are shared stock; random class/stat distribution may require trading (D80).

The whole Extra Stats map costs 144 Cooking Tokens: eighty moons, thirty-two for bridges and thirty-two for the
Sun (D58, D67). Gear has a material budget, not a Crafting Token budget (D94).
