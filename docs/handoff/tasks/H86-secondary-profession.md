# H86 — The secondary profession: any other profession's base work from Tier 2, the main trade's own pair, the picker's order (dark)

**uma-rpg · Either · M · Needs: H82 (Release 2 live) · Unblocks: H87, H89 (and through them H88, H90)**

> **Versions re-planned by D221, D224 and D230 (2026-10-27):** saves v29 (tickets-only grant), v30 (the farm by line) and
> v31 (the Wilds' trios, H114) are taken and live. Read this packet's save v29 as **v32**, v30 as **v33** and v31 as
> **v34**; engines unchanged. Materials, recipes and the three-place rows are the farm by line's
> ([farm-by-line.md](../../design/tier-rework/farm-by-line.md)): re-read them before any step that names R2's pairs, the
> ladder or a cross-line recipe.

## Why

Release 2 gave every Uma one **trade**: her calling's gathering and crafting pair, on one Craft Level, in ten places
of four slots each ([profession-progression.md](../../design/tier-rework/profession-progression.md), D195). A Tier 2
world starts with one Rift run's twenty Umas, and a run that follows the callings has two thin trades (three Mages, three
Summoners): only Mages make jewels, so the run waits on them. The owner's answer is **a secondary**: "another
profession's base items, while the main one reaches its higher tiers" (PP14, PP15):
- from Tier 2, **one other profession, any of the eight outside her trade**, making included;
- she does **its base work**; **the tier's own pair and every grade made of it stay her main trade's** (a fifth of the
  work, the Branch Gems included);
- with it every run split maxes in 28.5 days; with a gathering-only secondary a run with two Mages takes 40 (§8.5).

This packet builds the rules, dark: the pick, its fee, the job gate and the order the place pickers list Umas in. The
save field is parsed by H87; the screens are H88's.

## Context (read first)

Code pointers are by file and function: Releases 1 and 2 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md); [implementation.md](../../design/tier-rework/implementation.md)
  (D198). **H83's D-row of Release 3's build decisions** if it has landed (point 2: Tier 3 worlds do the secondary's
  base work only until R5; point 7: `OwnedUma.secondary` absent until picked); this packet repeats what it needs.
- The design: [profession-progression.md](../../design/tier-rework/profession-progression.md) §2.2 (the trade by calling,
  PP2, PP3), **§2.3 (PP14, PP15)**, §2.4, §3.4 (PP9, the ladder: which grades take the tier's own pair), **§4.3 (who
  may take a slot, PP16's open shop)**, **§4.4 (the place pages' pickers)**, §6.2 (every grade's materials by tier),
  §8.1–§8.5 (Tier 2, the secondary at work, a run of twenty), §6.4 (Laurels scale × tier, so the fee does), §16's
  PP14, PP15, PP23.
- **Release 2's work** (H77 above all; its packet, D-row and code): the ten professions and their places
  (`mine`, `forest`, `fields`, `fishery`, the Monster Den, `workbench`, `forge`, `armorer`, `charm-shop`, `lapidary`, by
  the ids H77 gave them), the material catalog with each type's tier (PP8), the recipes by the ladder, **the trade
  gate in the job kinds' `plan`**, the open shop, the trade by calling (her calling read from master data by stable
  id), the targets strip per place (PP22). H80's place pages and quick looks (to know what H88 will show).
- **The code** (as Release 2 left it): `packages/domain/src/work/kinds/` (each job kind's `plan` and its refusal texts),
  `work/env.ts`, `save/work.ts` (`planJob`, `startJob`, `queueJob`, `availabilityBlock`, `holderOf`, `slotJobOf`,
  `readyWork`), `save/targets.ts` (`targetPlan`, `facilityTargets`), the wallet's Laurels, `save/save.ts` (`OwnedUma`).
  `rpg/battle/caps.ts` (`rpgRework`), `rpg/battle/caps-at.fixture.ts` (H64's `capsAt`: how a test mocks the switch).

## Decisions made

**Approved calls, exact values:**
- **PP14 · The secondary:** from Tier 2, **any one of the other eight professions** (four gathering, four crafting:
  processing and making included); **she does its base work**: gathering or processing **the base pair**, making
  **the grades made of base types** (in Tier 2, G1–G4 and G6–G9). **Free the first time in each tier; a change costs
  1,000 Laurels × the tier** (2,000 in Tier 2), refused while she works there. Her one Craft Level serves it (the same
  speed and gates).
- **PP15 · The main trade's tier:** **the tier's own pair, and every grade made of it, stay her main trade's**: in
  Tier 2, Tier 2's raw and refined types and the G5 and G10 pieces made of them, **the Branch Gem** (H83: the G5 step in
  Tier 2's metal and wood), Planet Jewel III and Moon Jewel V among them.
- **§4.3 · Who may take a slot:** her trade's Umas, any job the place has; from Tier 2, Umas whose secondary is this
  profession, its base work; a job on the tier's own pair or a grade made of it refused **"Her main trade's work"**;
  anyone else shown greyed, **"Another trade"**. **The open shop (PP16)** is unchanged and wins: a world with no Uma
  of a trade opens its two places to every Uma for every job.
- **§4.4 · The pickers' order:** **her trade first, then secondaries (Tier 2+), then the rest greyed.**
- **PP23 · Promotion:** she arrives in the new world with no secondary (the old world keeps hers).

**This packet's decisions:**
- **Tier 3 worlds in R3 do base work only** (Tier 2's pair and Tier 3's stay the main trade's); PP14's Tier 3 reach
  (+ the secondary's Tier 2 work) is R5's (H101). Why: Release 3's build decisions, point 2.
- **One rule decides base work:** a job is base work when **every material it takes or gives is of Tier 1's types**
  (the base pair, by the catalog's tier for each type, PP8). Gathering a raw type, processing it, and making an item
  whose grade's recipe uses only base types all follow from it, so the Branch Gem, the G5 and G10 pieces and the two
  jewels above fall out without a list. Why: one rule the ladder already implies (PP9), with no table to keep in step.
- **The field:** `OwnedUma.secondary?: ProfessionId` (H77's profession id), **absent until she picks**. This packet adds
  it to the type; **H87 parses it** (save v29). Until H87 lands, tests build worlds directly; live, every call is refused
  (the stage is off), so no save carries it.
- **`setSecondary(save, outfitId, profession, now, tier)`**, behind `rpgRework('t2Weapons')` (live default):
  - refused: "From Tier 2" (a Tier 1 world); "Her own trade" (one of her trade's two professions); "Already her
    secondary"; "She's working at the Fishery" (a started or queued entry at **her current secondary's** place);
    "Not enough Laurels" (a change, not the first pick);
  - the first pick in a world is free; a change takes 1,000 × the world's tier Laurels from its wallet;
  - there is no "none": she changes it, never clears it (so "free the first time" can't be gamed by clearing).
- **The gate** joins the trade gate in each job kind's `plan` (where H77 put it): her trade → any job; her secondary
  (Tier 2+, at the stage) → base work only, else "Her main trade's work"; else "Another trade" unless the open shop
  applies. A job already started keeps running whatever changes later (the gate is checked at start and at a queue's
  next start, as H77's trade gate is).
- **`secondaryChoices(world, outfitId, tradeOf, plan)`** for H88's Work tab: the eight professions outside her trade in
  two rows (gathering: Mining, Wood Chopping, Farming, Fishing, Hunting less hers; crafting: Material Processing,
  Weapon, Armor, Accessory and Jewel Crafting less hers), each with its place, **the head count** (Umas in her world
  whose trade includes it), **a short flag** (its place's targets strip has a short item, `facilityTargets`), the
  fee for this pick (0 or 1,000 × tier) and its block, if any.
- **`workerOrder(world, placeId, outfitIds, tradeOf)`** for the place pages' pickers: her trade's Umas first, then the
  place's secondaries (Tier 2+), then the rest with their reason ("Another trade"); within each group the order the
  picker uses today. The open shop lists everyone in the first group.
- **Craft EXP and speed** don't change: a secondary job pays her one Craft Level its EXP, at her speed (PP14).
- **No screen, no save parse, no engine change.** `pnpm docs:update` leaves no diff.

## Do

1. **`OwnedUma.secondary?`** on the type, with a doc comment (PP14, D…; parsed from save v29, H87).
2. **The rule for base work** beside H77's catalog (a pure function over a job's materials and the world's tier).
3. **The gate** in the job kinds' `plan`, with the two refusal texts.
4. **`setSecondary`, `secondaryChoices`, `workerOrder`** in `save/` (a new `save/secondary.ts`), exported from the
   domain's index.
5. **Tests** (`save/secondary.test.ts`, the switch mocked to 18 with H64's `capsAt`):
   - in a Tier 2 world, a physical Uma (Mine · Forge) with the Fishing secondary gathers both base fish at the Fishery
     and is refused Tier 2's two with "Her main trade's work";
   - a Mage (Monster Den · Lapidary) with the Weapon Crafting secondary makes Weapon Gems G3 and G7 at the Forge and is
     refused G10 and the Branch Gem;
   - a Jewel Crafting secondary makes Moon Jewel I and Planet Jewel V and is refused Planet Jewel III and Moon Jewel V;
   - a Material Processing secondary processes a base raw type at the Workbench and is refused a Tier 2 one;
   - an Uma with no secondary is "Another trade"; in a world with no Mage the Lapidary opens to her (the open shop);
   - `setSecondary`: the first pick free; a change takes 2,000 Laurels; refused with too few, while she works at the
     current secondary's place, for her own trade, and in a Tier 1 world;
   - a Tier 3 world: the secondary does base work and is refused Tier 2's pair;
   - `secondaryChoices` lists eight, two rows, with head counts and the short flag from a target plan; `workerOrder`
     puts trade, then secondary, then the rest;
   - **unmocked** (the live game): `setSecondary` refuses and every gate answers as Release 2's.
   - Every existing test passes unchanged.
6. **Docs:** log the D-decision (fetch `main` first). profession-progression §2.3 and §4.3 gain "Built in H86 (D…), live
   from H90 (Tier 3's reach: R5)." `pnpm docs:update` leaves no diff.
7. **Check it locally** (your own ports, a desktop browser at 390×844, never the iOS Simulator) on a scratch Tier 2 save
   from the CJS build: a place page's picker and a job start as Release 2 left them; the Work tab looks as before.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (of 230 KB).
- [ ] The tests in step 5 pass, the unmocked ones included.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-decision is logged, the design doc has its
  lines.
- [ ] The local check in step 7 was done at 390×844 on a scratch save and described. Nothing from the original games in
  git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **A delegated worker (Claude or ChatGPT):** a pull request from `feat/h86-secondary-profession` with one commit,
  `feat(domain): the secondary profession, dark (H86)`; the body says why (thin trades, the main trade's tier). It
  shares no files with H83 except, possibly, the Forge's catalog (H83 renames its Tier 2+ G5 item to the Branch Gem):
  rebase on whichever lands first. Fetch `main` before you push so the D-number is free. Claude's main session reviews
  and merges it; ChatGPT may merge its own, logging its decisions (CLAUDE.md). Then the deploy is watched.
- **Flag it done:** after the merge, a `docs(handoff): H86 done (D…)` commit deletes this file, sets H86 to Done with a
  Done row, and sets H87 and H89 to Ready if their other needs are done.
