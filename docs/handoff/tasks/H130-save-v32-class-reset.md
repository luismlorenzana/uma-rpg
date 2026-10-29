# H130 — Save v32 (dark): the class reset, the refund as Class Marks, the trades that move and the Healer Sanctum's merge; `toV32` written, not chained

**uma-rpg · Claude · M–L · Needs: H136, H126, H129 · Unblocks: H132, H133, H134**

## Why

Classes v3 ends with **the reset** (D240, [classes-v3.md §8](../../design/classes-v3/classes-v3.md#8-the-reset)): the
first time a save opens on save v32, every Uma in every world goes back to the start of the new tree, and her Class EXP
comes back as Class Marks the Exchange reads Manuals with, so she can rebuild every class she had. Halls v2 (D241,
[halls-v2.md §7](../../design/classes-v3/halls-v2.md#7-the-migration-hv18hv21-hv24)) rides the same save: the Paladin
Bastion and the Cleric Chapel fold into the Healer Sanctum, each Uma keeping her higher Bond. Both are one migration and one
record that the one-time sheet ("The classes are rebuilt", H132) reads.

This packet writes `toV32` and tests it, the v32 parse behind the `classes` stage, the record, the roster-aware step that
settles the work of Umas whose trade moves, and the small rules the record needs. **`SAVE_SCHEMA_VERSION` stays 31 and
`migrateWorld` doesn't call `toV32`:** H134 chains it with the engine switch.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`; D240, D241 and the D-rows of H126, H128 and H129 in [decisions.md](../../decisions.md)
  (Classes v3's build decisions: the stage, the parse following it, the switch in H134).
- **The designs:** [classes-v3.md](../../design/classes-v3/classes-v3.md) §2.6 and §7 (what a held class is), §8.1–§8.7
  (CV25–CV30, the worked examples), §13's save table, §14.3 (the Exchange's "Her share"), §16; the preview
  [reset.html](../../design/classes-v3/previews/reset.html). [halls-v2.md](../../design/classes-v3/halls-v2.md) §7.1–§7.3
  (HV18–HV21, HV24: the seat map, the merge rule and its example, save v32's seat ids).
- **The manual:** `docs/game/architecture.md` (the save, migrations, backups), `loops.md` (Class Rank, Manuals, Marks),
  `materials.md` (trades, the open shop), `heroes.md`.
- **How a dark save was done:** H69 (`toV27`) and H78 (`toV28`, the grant, "the strict parse and new saves follow the
  economy stage") in [docs/archive/handoff-history.md](../../archive/handoff-history.md); `save/save-v28.test.ts` at
  `d5428a2` (`git show d5428a2:packages/domain/src/save/save-v28.test.ts`) for a parse test under `capsAt`; D220's
  roster-aware repair (`save/calling-repair.ts`, called from `apps/web/src/save/game.ts:120`) for a step that needs master
  data.
- **H126, H129** (merged): the 13 classes and Tier 0's tracks (`grantClassTrack`, `RPG_TIER0_BANK`, `rpgClassOpen`,
  `activeClass` reading a null class per world, the calling by style with no pick); the seat ids by generation
  (`isHeroLimitId(id, engine)`, `healer-*` from v19).
- **The code** (line numbers on `main` at `b9ce7c5`; H126 and H129 move some, re-read them):
  - `save/version.ts` (`SAVE_SCHEMA_VERSION` 31); `save/migrations.ts`: `migrateWorld` (:205), `toV31` (:361), `TierGrant`
    (:370), `settleWork` (:416, the no-clock settle), `toV28` (:433, the record and literal-only rules).
  - `save/save.ts`: `OwnedUma` (:102; `calling` :125), `TierWorld` (:161; `grant` :191), `newOwnedUma` (:276),
    `newTierWorld` (:296), `parseTrack` (:696), `parseClassRanks` (:706), `parseBonds` (:733), `parseHeroes` (:749),
    `parseLoadout` (:777), `CALLING_PICKS`/`parseCalling` (:798–:808), `UMA_KEYS` and `parseUmas` (:808–:835),
    `parseGrant` (:961), `parseTierWorldV28` (:987), `parseTierWorld` (:1000); its static import of `migrations.ts` (:56,
    so `toV32` lands in the main bundle).
  - `save/rules.ts`: `unlockUma` (:72), `markGrantSeen` (:86). `save/battle.ts`: `fillRanks` (:429), `payEntrants` (:465),
    `settleFight` (:395). `save/exchange.ts`: `readManuals` (:209). `save/heroes.ts` (seats and Bonds).
  - Readers of `uma.calling`: `save/battle.ts` (`partyMembers`, `umaFlourish`, `pickCalling`), `economy/professions.ts`
    (`tradeResolver`), `save/rift.ts:598` (Ascend), `save/calling-repair.ts`, the web's `places/stable/template-view.ts`
    and `save/trade.ts` (`grep -rn "calling\.pick\|calling?.pick\|uma.calling" packages/domain/src apps/web/src`).
  - The fixtures: `save/v28.fixture.ts` (a rich old save), `save/v30.fixture.ts`, `save/economy-v3.fixture.ts`
    (`gradedWorld`, `gradedUma`); H126's `rpg/battle/v18-replays.fixture.ts` (open fights to freeze in the save).
  - `apps/api/src/save/firestore-save.repository.ts:6–:33`: a stored save of an older schema is copied to
    `saveBackups/{uid}-v{n}` before the first write of a newer one (D69); nothing to change, H134 checks it at 32.

## Decisions made

### The design's calls (exact values)

**CV25, CV29: the reset, in every world, once.**

| | Tier 1's world | Tier 2's and Tier 3's |
|---|---|---|
| `classId` | **null** (from v19 a null class reads as her calling's Tier 0 there, H126) | **kept** (every v31 id is a v19 Tier 1 id: Brawler, Sorcerer `mage`, Arms Spellblade `spellblade`, Tome Summoner `summoner`, Paladin, Cleric); a null stays null (her suggested promotion there) |
| `classes` | `{}`: every class back to its defaults (weapons, line A, auto skills) | the same |
| `ranks.classes` | `{}`: every class at Rank 1 | the same |
| `calling` | **dropped** (no pick from v19) | the same |
| Refund, into `wallet.classMarks` | Σ over her classes ⌈(EXP + min(EXP, 1,800)) ÷ 1,000⌉ Manuals × 1,000 | Σ ⌈EXP ÷ 1,000⌉ × 1,000 |
| Stays | Uma Level and EXP, Shards, gear grades and her accessory, her map and jewels, Craft, Laurels, tickets, items, banked Class Marks, parties, targets, achievements, the Rift, `grant`, the world map and its open fight | the same |

**A class's EXP** is what its Class Rank took on v31's curve plus its bar: E(r, x) = Σ_{k=1}^{r−1} (120 + 16k) + x. **The
refund rounds up class by class** (CV26); a class with no EXP gives none. **The worked examples** (§8.7), as the tests'
numbers: A (Brawler R34 bar 300, Paladin R12 bar 100) 16 + 5 = **21**; B (Spell Blade R26, Mage R8 bar 50) 10 + 3 = **13**;
C (Cleric R24 bar 200) **10**; D (no Class EXP) **0**; E (Summoner R50, Mage R15) 28 + 6 = **34**; the world **78
Manuals, 78,000 Class Marks**. In a Tier 2 world a Brawler R34 bar 300 gives ⌈13.236⌉ = **14**.

**CV28, work:** an Uma whose trade moves has her running job finished into the Warehouse with its Craft EXP and her queue
dropped (saves v30 and v31's no-clock settle); an Uma whose trade stays keeps working untouched; her Craft Level never
moves; a place whose trade loses its last Uma is an open shop (today's rule, nothing to do).

**CV26, CV30, the record:** each Uma's share is recorded for the sheet and for the Exchange's "Her share", a hint and not a
reservation; the sheet shows once per world and the Account reopens it.

**HV18–HV19, the Healer Sanctum's merge, in every world:**

| Old seats (first, second) | New seat |
|---|---|
| `paladin-1`, `paladin-4` | `healer-1` (Archangel's Judgment) |
| `paladin-2`, `paladin-3` | `healer-2` (Archdemon's Toll) |
| `cleric-1`, `cleric-3` | `healer-3` (Seraph's Pyre) |
| `cleric-2`, `cleric-4` | `healer-4` (Thunder Fiend's Barrage) |

1. **Bonds:** each Uma's Bond with the new seat is the higher of her two (level, then EXP); the old two go.
2. **The Hero:** one old Hero is the Hero; with two, **the one with the lower Bond on her own old seat keeps it** (a tie:
   the first seat's), and the other becomes the new seat's **first Learner** at her Bond.
3. **Learners:** both lists pooled, each Uma once: the displaced Hero first, then by Bond with the new seat, highest first
   (a tie keeps the first seat's order, then the second's). The first ten sit; anyone beyond keeps her Bond.
4. A Learner who sat under both old seats sits once; her second place is free.
5. **The other four halls' seats and every Bond on them are untouched** (seat n stays seat n, HV18).

### This packet's decisions

- **`toV32(world, tier)` in `save/migrations.ts`**, per world, in this order: read each Uma's v31 class, Class Ranks and
  pick; the refund by the world's tier; each Uma reset (the table above); the wallet; the healer merge; the record.
  **Literals only**, as every step: its own v31 curve (120 + 16k), its own seat map, no import of the live catalogs or
  master data. **Idempotent by shape:** a world that has `classesV3` is returned as it is. Anything malformed is left for
  the strict parse. `migrateWorld` stays "every step to v31" until H134.
- **The record: `TierWorld.classesV3?: ClassesV3Record`**, written once by `toV32`, absent in a world made after it:

  ```ts
  interface ClassesV3Record {
    manuals: number                          // the world's refund, Σ of the Umas'
    marks: number                            // manuals × 1,000, paid into wallet.classMarks
    umas: Record<string, ClassesV3Line>      // every Uma the world had at v31
    halls: HallMergeLine[]                   // the Umas whose role changed in the merge, in seat order
    traded: boolean                          // false until settleClassesV3Trades has run in this world
    seen: boolean                            // the one-time sheet's
  }
  interface ClassesV3Line {
    classId: string | null                                   // her v31 class (a v31 id), for "Summoner R50 · Mage R15 → Caller R1"
    ranks: Partial<Record<string, { rank: number; exp: number }>>  // her v31 Class Ranks, by v31 id
    pick: 'spellblade' | 'mage' | 'paladin' | 'cleric' | null  // her v31 calling pick, for the trade step only
    manuals: number                                          // her share
    left: number                                             // her share not read yet ("Her share" in the Exchange)
    trade?: { from: TradeId; to: TradeId }                   // set by the trade step when her trade moved
  }
  interface HallMergeLine {
    outfitId: string; from: string; to: HeroLimitId          // her v31 seat (a v18 id) and the Healer Sanctum's
    was: 'hero' | 'learner'; now: 'learner' | 'unseated'; bond: number
  }
  ```

  Her Tier 0 isn't stored: the sheet reads it from master data (`umaCalling`). Why a line for every Uma: the trade step
  needs each one's old pick, and a zero line still shows "→ Duelist R1 · trade Stone → Wood".
- **The trades that move need master data, so they settle after the parse** (D220's pattern): new
  `settleClassesV3Trades(save, outfits, now)` in `save/classes-v3.ts`. For each world whose record has `traded: false`, each
  Uma of the record with an outfit in `outfits`: her old trade is `tradeOfCalling(umaCalling(outfit, line.pick, 18))`, her
  new one `tradeOfCalling(umaCalling(outfit, null, 19))`; where they differ, her work row settles with v30/v31's no-clock
  rule (`settleWork` on her row only: every started entry's outputs from `collected` on into `items`, their Craft EXP into
  her `craft`, her queue dropped, her row removed) and her line gains `trade`. Then `traded: true`. Idempotent; a world
  without the record, or an Uma whose outfit isn't in `outfits`, is untouched. The web calls it on every boot after the
  roster loads, beside `repairCallingRule` (`apps/web/src/save/game.ts`, lazily imported): until H134 no save has a record,
  so it does nothing. Why not in `toV32`: the old trade reads her Power, Wit and styles, which a migration never reads.
- **`calling` leaves `OwnedUma` at v32.** The field becomes optional (`calling?: UmaCalling`), absent from the classes
  stage: the parse refuses it then and requires it before, and `newOwnedUma` omits it. Every reader goes through
  `umaPick(uma) = uma.calling?.pick ?? null` (the list above, the web's included). `repairCallingChoices` returns the save
  unchanged from the stage (H134 deletes it and its web call).
- **The v32 parse follows the live stage** (`rpgRework('classes')`), R2's pattern: unmocked, every save parses as v31;
  under `capsAt(19)` a world's Umas, ranks and seats parse as v32's:
  - `classId`: null or a class of the generation; in Tier 1's world a Tier 0 or a Tier 1 class she holds; in a later world
    a Tier 1 class;
  - `classes`: keys of the generation (no Tier 0 key in a later world); a Tier 0 setup holds three different weapons of
    any kind, `lines` `{}`, and only her weapons' `.1` nodes; a Tier 1 setup as today;
  - `ranks.classes`: a Tier 0 track (Tier 1's world only) at rank 1–10, its EXP under its next rank's below 10 and at most
    `RPG_TIER0_BANK` (23,680) at 10; a Tier 1 track at 1–50, and at 10 or above in Tier 1's world;
  - no `calling`; `heroes` and `bonds` by `isHeroLimitId` (H129: `healer-*`, no `paladin-*` or `cleric-*`);
  - `classesV3` optional, strict (its keys, counts ≥ 0, `left` ≤ `manuals`, lines' seat ids, `TradeId`s).
- **A fight open across the switch pays its class EXP to the family's Tier 0.** An open v18 world or Rift fight replays
  on v18 (its input is frozen) and settles after the reset; its entrant's class (a v31 id) is no class she holds in Tier
  1's world, so from the stage `fillRanks` pays a class share for a class not open to her there to its Tier 0:
  `RPG_RESET_TIER0 = { brawler: 'recruit', mage: 'apprentice', spellblade: 'duelist', summoner: 'caller', paladin:
  'acolyte', cleric: 'acolyte' }` (each class's own family; no master data). In a later world every Tier 1 class is open,
  so it pays as it is. Its Bonds go to the merged seats like any win's.
- **"Her share" counts down:** `readManuals` on a class bar of an Uma whose line has `left > 0` sets `left` to
  `max(0, left − count)`, whichever class. Why: a share offered after it was read would mislead.
- **`markClassesV3Seen(save, tier, now)`** in `save/rules.ts`, beside `markGrantSeen`: sets `seen` (H132's two buttons).
- **Unlocks from the stage:** a new Uma has no `calling`; her start class is H126's `startingClass(outfit, engine, tier)`.
- **Main JS:** `toV32` lands in the main bundle (`save.ts` imports `migrations.ts` statically), with the parse's additions;
  the trade step loads lazily. Expect about +1.5 KB gzip; say the number. If H126–H130 together pass 227 KB, say so in the
  PR so H120, H123 and H132 plan around it.

## Names other packets read

| Name | Where | Shape |
|---|---|---|
| `toV32(world, tier)` | `save/migrations.ts` | written, not chained (H134 chains it) |
| `ClassesV3Record`, `ClassesV3Line`, `HallMergeLine`, `TierWorld.classesV3` | `save/save.ts` (types), `save/migrations.ts` | as above |
| `settleClassesV3Trades(save, outfits, now)` | `save/classes-v3.ts` | `outfits: readonly (CallingOutfit & { outfitId: string })[]` |
| `markClassesV3Seen(save, tier, now)` | `save/rules.ts` | — |
| `umaPick(uma)` | `save/save.ts` | `RpgClass \| null` |
| `RPG_RESET_TIER0` | `save/classes-v3.ts` | v31 class → Tier 0 |
| `OwnedUma.calling?` | `save/save.ts` | absent from v32 |

## Do

1. **The fixture:** `save/v31.fixture.ts`, a rich v31 save in v28's pattern (from `economy-v3.fixture.ts`'s graded worlds):
   - **Tier 1's world:** the Umas A–E of §8.7 with their ranks and bars (B with `calling.pick: 'spellblade'` and a running
     Forest job plus one queued request; D unlocked with no Class EXP and no work), one more Uma with a running job in a
     trade that stays; **the merge's cases:** `paladin-2` Hero at Bond 4 with six Learners and `paladin-3` Hero at Bond 10
     with five, one Learner shared (HV19's example); `cleric-1` and `cleric-3` with eleven different Learners between them;
     `paladin-1` with a Hero and `paladin-4` empty; `cleric-2` and `cleric-4` empty, with Bonds on both for one Uma; Heroes
     and Learners in the four other halls; 5,000 banked Class Marks; an open world fight and an open Rift fight taken from
     H126's v18 fixture, their allies' ids mapped to this world's Umas (as `v27.fixture.ts` did with v15's), one of them a
     Brawler who learns under `paladin-2`.
   - **A Tier 2 world:** a Brawler R34 bar 300 with a chosen class, an Uma with a null class, a Paladin seat with a Hero.
2. **`save/migrations.ts`:** `toV32` as decided, with its record. **`save/save.ts`:** the types; `calling` optional;
   `umaPick`; `newOwnedUma` by the stage; the v32 parse behind the stage (Umas, setups, tracks, `classesV3`).
3. **`save/classes-v3.ts`:** `RPG_RESET_TIER0`, `settleClassesV3Trades`. **`save/battle.ts`:** `fillRanks`'s Tier 0 for a
   class not open to her. **`save/exchange.ts`:** `left`. **`save/rules.ts`:** `markClassesV3Seen`. Every `uma.calling`
   reader through `umaPick`; `repairCallingChoices` a no-op from the stage. **The web:** `game.ts` calls
   `settleClassesV3Trades` after the roster loads (lazy import), and the web's `calling` readers use `umaPick`.
4. **Tests:**
   - `save/migrations-v32.test.ts` (unmocked: `toV32` on raw worlds): A–E's 21, 13, 10, 0 and 34; the world's 78 Manuals
     and 78,000 Marks on top of the 5,000 banked; per-class rounding (C's 9,176 EXP → 10); each Uma's `classId` null,
     `classes` `{}`, `ranks.classes` `{}` and no `calling` in Tier 1's world; the Tier 2 world's 1:1 (14) with `classId`
     kept and the null class null; everything in the "Stays" row deep-equal to before (levels, EXP, craft, stars, gear,
     items, parties, targets, the Rift, `grant`, the world map and its open fight, the four other halls' seats and Bonds);
     the record exactly (every line, `left` = `manuals`, `traded` and `seen` false); a second `toV32` returns the world
     unchanged; `migrateWorld(v31, 31)` returns its input and `SAVE_SCHEMA_VERSION` is 31.
   - The merge, in the same file: HV19's example (the Bond 4 Hero stays; the Bond 10 Hero is the first Learner at Bond 10;
     ten places by Bond, the eleventh keeps her Bond with `healer-2`; the shared Learner once with a free second place);
     two Heroes at Bond 10 (the first seat's stays, the other a Learner at Bond 10); `paladin-1` with a Hero and
     `paladin-4` empty (`healer-1` is hers, her Learners kept in order); a pair with no Hero (no seat; Bonds still merged);
     an Uma's two Bonds to the higher by level, then EXP; `halls` lines for the displaced Hero and the unseated Learner
     only; the merge in the Tier 2 world too; no `paladin-*` or `cleric-*` key left on `heroes` or any `bonds`.
   - `save/save-v32.test.ts` (the switch mocked to 19 with `capsAt`): the v31 fixture through `toV32` (every world, still
     labelled 31) parses, and its two open v18 fights replay to their frozen ends; unmigrated it doesn't (`calling`,
     `paladin-2`); refused one by one: a Tier 0 `classId` or setup in the Tier 2 world, a Tier 0 track at 11, a bank of
     23,681, a Tier 1 track at 9 in Tier 1's world (accepted in Tier 2's), a Tier 1 `classId` she doesn't hold in Tier 1's
     world, a Tier 0 setup with two of one kind or with a line, `calling` on an Uma, a `cleric-3` Bond, a `classesV3` with
     `left` above `manuals`; a new save and a new unlock (a Tier 0 start, no `calling`) round-trip; `markClassesV3Seen`;
     `readManuals` counts `left` down and not below 0; settling the open world fight pays a v31 Brawler's class share to
     her Recruit and her Bond to `healer-2`. Unmocked, today's v31 saves parse and round-trip unchanged.
   - `save/classes-v3-trades.test.ts` (`capsAt(19)`, made-up outfits, never master data): B (Pace A, Late A, Power > Wit,
     best distance Medium, pick Spell Blade) moves Wood → Stone: her Forest job's remaining outputs and Craft EXP land, her queue drops, her row
     goes, her line reads `{ from: 'physical-hybrid', to: 'magical' }`; D (Pace A, Wit ≥ Power, no pick) moves Stone →
     Wood with no work to settle; the Uma whose trade stays keeps her running job; `traded` becomes true and a second run
     changes nothing; an Uma whose outfit is missing is untouched; a world with no record is untouched.
   - Every existing test passes; H126's, H128's and H129's replay tests live and at 19.
5. **Docs:** a D-row (fetch `main` first; the next free number) for this packet's decisions. classes-v3.md §8 and §13's
   save table, and halls-v2.md §7, gain "Built in H130 (D…), live from H134." `pnpm docs:update`: no diff.
6. **Check it locally** from the CJS build on a scratch copy of a real-shaped v31 save (two worlds, 30 Umas, open fights),
   never the owner's: `toV32` on each world in a Node script prints the refund per Uma and the merge lines (no names from
   the master data: outfit ids only); with a local, uncommitted switch (`caps.ts` 19, `version.ts` 32, `migrateWorld`
   chaining `toV32`) the API boots on it at 390×844 in a desktop browser, the open fights finish, and the next world fight
   starts on v19 with every Uma a Tier 0. Revert the switch; describe what you saw.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB) and this packet's change.
- [ ] Step 4's tests pass, with every replay test live and at 19.
- [ ] `SAVE_SCHEMA_VERSION` is 31 and `migrateWorld` doesn't call `toV32`.
- [ ] `docs/game/` is unchanged and `pnpm docs:update` leaves no diff; the D-row is logged; the design lines are in.
- [ ] Step 6's local check was done on a scratch save and described; the switch is not in the diff. Nothing from the
  original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and https://uma-rpg.web.app/api/health
  shows the commit in `build`.

## Deliver

- **Claude:** a branch `feat/h130-save-v32-class-reset` and one pull request, commit `feat(domain): save v32's class reset
  and the Healer Sanctum's merge, dark (H130)`; the body says why (written and tested, not chained; the refund's rule and
  the worked examples' numbers) and gives the main JS number. Fetch `main` before you push so the D-number is free. After
  CI passes, Claude merges it and watches the deploy. Nothing on screen changes.
- **Flag it done:** a `docs(handoff): H130 done (D…)` commit deletes this file, adds H130's Done row to
  `docs/handoff/README.md` with the commit, and sets H132 Ready (H133 and H134 when their other needs are done).
