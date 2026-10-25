# H80 — R2's screens, the Wilds and the first launch (inert): ten place pages, the Workbench, the making places, the Warehouse, the Exchange, the Trade filter, "The Wilds are rebuilt", "Finish all"

**uma-rpg · Either · L · Needs: R1's H70, H73, H77, H78 · Unblocks: H82**

## Why

H77 and H78 built R2's professions and the compensation dark. The player meets them here:
- **the Wilds** become **ten places in existing buildings**, four slots each, no upgrades; each page gathers, processes or
  makes by its profession, and **her trade** decides where she works (the open shop when a world lacks one);
- **the Warehouse** holds the five lines' materials and **the made items** (Weapon Gems, Armor Fittings, Accessory
  Settings, Planet and Moon Jewels); **the Exchange** sells raw types by pair, priced × tier;
- **the first launch** after the update shows once per world the sheet **"The Wilds are rebuilt"**: the Speed Tickets the
  grant paid, what went and what came back, Uma by Uma; the Account keeps a row that reopens it; **"Finish all"** on a
  place page spends tickets on every running job at once;
- **the Stable** gains a **Trade** filter, and the calling pick card and template card name her trade.

This packet builds them so they follow the live stage and the save's shape, which means the deployed game shows
**nothing new** until H82. You preview them with the local switch, never committed.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md` (player text short; 44 pt targets; 390×844 and 375×667; explanations behind the (i), D95),
  [change-protocol.md](../../change-protocol.md) (the Hub map takes places and frames as data; the kit's work rows, sheets,
  shelves and Account frame take this game's content: **no kit change**; if one is needed, stop and file "Both apps:").
- **R2's build decisions** (H74's first D-row: point 8 the trade's resolver, point 10 the art pin, point 14 the local
  switch), the D-rows of H77 and H78, and **R1's H70** (the calling pick card, the template card) and H67 (`umaTemplate`).
- The design: [profession-progression.md](../../design/tier-rework/profession-progression.md) **§4** (§4.1 places, §4.2
  the map and each tier's look, **§4.3 who takes a slot**, **§4.4 the place pages**), §5.2 (times), §7.5 (around the
  places: the Exchange, the Warehouse, targets, the profile's Work line, the Stable's Trade filter), **§10** (the
  Exchange), **§14.6 (the first launch's sheet, word for word)**, PP16, PP21, PP22, PP25; [uma-templates.md](../../design/tier-rework/uma-templates.md)
  §2.3 (the pick card's trade rows), §5 (the template card's "Trade" line); the previews `previews/prof-map.html`,
  `previews/prof-grant.html`.
- **The domain you read** (H77, H78; H79's planner): `wildsPlaces`, `PLACES_V3`, `placeSpecV3`, `workPlace`, `TRADES`,
  `tradeOfCalling`, `tradeProfessions`, `openShop`, `liveWorkEnv`, the work operations' `context.tradeOf`,
  `materialIdentity`, `items/materials.ts` (names, art), `madeName`, `madeRecipe`, `ladderTier`, `stockedTypes`,
  `rawPriceV3`, `sellPrice`, `callingPickBlock`; `TierGrant`, `markGrantSeen`; H79's `facilityTargets` v3 and icon table.
- **The code** (lines on `421eacd`):
  - `apps/web/src/places/work/FacilityPage.tsx` (all: `describe` 33–41, `RpgWorkProvider` 46–91, `FacilityBody` 104–190,
    the pickers 200–431, `FacilityPeek` 439–478); `places/registry.tsx` 56–62 (`FACILITIES` → the shared page).
  - `places/warehouse/WarehousePage.tsx` (all), `places/exchange/ExchangePage.tsx` (all), `places/account/AccountPage.tsx`
    (all: the kit's `AccountFrame`, its `sections` and `info`).
  - `hub/HubScreen.tsx` (places and frames from the domain), the router's place lookup (`placeOnPage`).
  - `album/rows.ts` and H70's `stableFacets(engine)` (the Stable's live facet list); `places/stable/OutfitProfile.tsx` (where the profile shows Craft Level today).
  - `save/game.ts` 237–331 (the work actions: `startWork`, `queueWork`, `editWorkQueue`, `repeatWork`, `restartWork`,
    `finishWorker`, `upgrade`; `buyItem`, `sell`; `useWorld`).
  - uma-kit's `work` subpath (`FacilityHeader`, `JobSheet`, `SlotRow`, `TargetsStrip`, `PeekRow`), `places` subpath
    (`ShelfView`, `ExchangeRows`, `AccountPage`), the shell's sheets (`ui/BottomSheet.tsx`).

## Decisions made

- **Inert until the switch.** Every v3 state reads `rpgRework('economy')` (live) or the save's v28 shape. Before H82 the
  game looks exactly as it does today. **The local switch** (never commit it), exactly H82's: `caps.ts`
  `BATTLE_ENGINE_VERSION = 17`, `save.ts` `SAVE_SCHEMA_VERSION = 28`, `migrations.ts` chaining `toV28`.
- **uma-art 2.13.0 and the icon table:** if H79 hasn't merged, pin it and write `items/frames.ts`' v3 table exactly as
  H79's packet decides (materials by their art family and grade; made items on H73's rows 34–37; Planet Jewels on
  `gem-sun-4, -4, -6, -8, -10`; Moon Jewels on `gem-limit-2 … -10`; accessory families on the Charm, Ring, Orb, Talisman
  and Amulet rows); whichever lands second rebases.
- **The trade comes from master data** (R2's build decision 8): `save/game.ts` builds `tradeOf(outfitId)` once per world
  from the master roster, `tradeOfCalling(umaTemplate(outfit, uma.calling?.pick ?? undefined).calling)` (null for an outfit master data
  lacks), and passes `{ tradeOf }` to every work action the player starts (start, queue, repeat, restart) and to
  `planJob`.
- **The Hub's Wilds:** `wildsPlaces` draws the ten on their frames with four pips (no kit change: `Place.frame` and pips
  exist). Check at 390×844 that no name overlaps a road or a neighbour. **A link to a removed place** (`ley-spring`,
  `crystal-cavern`, `quarry`, `meadow`, `fossil-dig`) opens the Wilds page. `registry.tsx` maps the live work places
  (v1's `FACILITIES` or v3's `PLACES_V3`) to the shared page.
- **The place pages** (PP §4.4, one shared page by `placeSpecV3`):
  - **Header:** "Mine · Mining · 4 slots · ×1.25", no Upgrade; **"Open shop: no Brawler in this world"** when
    `openShop` holds; **"Finish all · 14 Speed Tickets"** when two or more of its slots are running.
  - **A gathering place's What step:** its types as tiles in tier rows, base low then base high ("From Craft Lv 26" on the
    high type until then), then Tier 2's row (Tier 2+ worlds) and Tier 3's. No "Main trade" chip in R2 (that marks the
    secondary's limit, R3's).
  - **The Workbench:** five columns, one a line; a row per tier and band; batches ×1, 4, 8, 20, 40.
  - **The Forge, the Armorer, the Charm Shop:** ten grade chips, **each coloured by its material's tier** (the ladder:
    in a Tier 2 world G5 and G10 in Tier 2's colour; in Tier 3 G4 and G9 in Tier 2's, G5 and G10 in Tier 3's; Tier 2's
    amber and Tier 3's violet are the tier tints H36 made), and the chosen grade's recipe card (icons and counts from
    `madeRecipe`). No Branch Gem in R2.
  - **The Lapidary:** one row a kind, Planet I–V and Moon I–V, grade chips in their material's tier colour.
  - **Who (the picker):** her trade's Umas first, then the rest greyed with **"Another trade"**, unless the open shop
    holds (everyone in the first group); the kit's picker shows the reason (`lockedReason`).
  - **The targets strip** reads H79's `facilityTargets(plan, placeId)` (until H79 lands it shows v1's lines, which no v3
    place matches: nothing; say so in your delivery if H79 hadn't landed).
  - **Quick looks** (`FacilityPeek`): a gathering place's type icons (2 · 4 · 6 by tier), a making place's line G1–G10,
    the open shop's line, its four slots' rows.
- **"Finish all"** (PP25): `finishAllCost(world, placeId, now, tier)` and `finishAllAt(save, placeId, now, tier)` in
  `save/work.ts` (uma-work's `finish` over the place's running entries, each ⌈remaining ÷ 30 minutes⌉, queues starting at
  once); a confirm names the total ("Finish 3 jobs for 14 Speed Tickets?"); short tickets refuse ("Needs 14 Speed
  Tickets"). No kit change: the button is this page's own, under the kit's header if the header takes no extra action.
- **The Warehouse** (v3): two shelves, **Materials** (by profession, raw then refined, a tier row each, names from
  `items/materials.ts`) and **Made items** (Weapon Gems, Armor Fittings and Accessory Settings by grade, then Planet and
  Moon Jewels I–V); the header "120 materials · 35 made items"; a sheet's details ("Tier 1 · high · raw · Refines into Iron
  Ingot", "Grade 5 · Raises a weapon one grade", "Opens Planet III"); sell prices H77's. Grade chips filter the made items;
  a material shows its tier and band in its row, never as a grade (no kit change: give materials the grade the shelf
  needs so "Every grade" holds them, if `ShelfView` can't hide its chips for one shelf).
- **The Exchange** (v3): raw types by line, the tier's pairs as `stockedTypes` gives them, priced `rawPriceV3`; a locked
  row reads "After a win on continent 3"; Speed and Sweep Tickets as today; **Class Manuals only** (the gear Manual rows
  go, H74).
- **The Stable's Trade filter** (PP21): a **Trade** group, five values ("Mine · Forge" …) with each trade's head count in
  the world, on locked outfits too, from `tradeOfCalling(umaTemplate(…).calling)`. H79 adds Signature to the same list:
  rebase on whichever lands first.
- **Her trade on the profile and the cards:** the profile's Craft line reads "Craft Lv 23 · Forest · Armorer"; the
  template card's line "Trade · Monster Den · Lapidary" (UT14); the calling pick card (R1's H70) names each choice's
  trade with its head count in her world ("Forest · Armorer · 8 Umas"), and the pick is refused while she works
  (`callingPickBlock`, "Finish her work first"; wire it here if H77 couldn't).
- **"The Wilds are rebuilt"** (PP25, §14.6, word for word; the shell's sheet, no kit change):
  - **When:** the first time a world opens after the update with a `grant` that isn't `seen`: Tier 1's at launch, a Tier
    2 world's when the player switches to it. Once per world.
  - **Lead:** "Ten professions, each in its own place. Every Uma starts again at Craft Lv 1, and the time they worked
    comes back as Speed Tickets."
  - **The grant, large:** "+63,800 Speed Tickets"; under it "31,900 hours of work: every gather, refine, craft and cut
    your Umas did" (hours = tickets ÷ 2).
  - **What went:** "5,400 gear pieces · 2,500 Star Gems · 22 facility upgrades. Their making is in those hours."
  - **What came back:** "7,150 Laurels · 66 refined items · your Warehouse's 2,000 items, now the new materials (Ores →
    Copper and Iron …)".
  - **What stays:** "Uma Levels, classes and Class Ranks, Laurels, every ticket you had".
  - **By Uma:** her face, name and trade, "Craft Lv 50 → 1 · 1,470", sorted by tickets; a banked Uma "1,970 (30,000 EXP
    past Lv 50)"; the floor's line when it pays, "Pieces whose makers have left this world · +22,553". An outfit master
    data lacks shows "An Uma".
  - **Footer:** "A ticket takes 30 minutes off a running job: Finish on a job, or Finish all on a place."
  - **Buttons:** **To the Wilds** (marks it seen, opens the Wilds page) and **Later** (marks it seen, closes). Both mark
    it seen: PP25 shows it once per world, and the Account reopens it.
  - A part whose numbers are all zero is left out (a fresh player's upgrades).
- **The Account's row:** "The Tier rework's grant · 63,800 Speed Tickets", which reopens the sheet, among the Account's
  sections (this game's content); only for a world with a grant.
- **The top bar's Speed chip** shows the new count with separators as Laurels are; if the kit's chip can't, stop and file
  "Both apps:" (PP §14.6 says no kit change is needed: check it).
- **The manual** stays (H82 rewrites it): list in your delivery every screen's words H82 must carry into `sections.md`
  and `loops.md`.
- **Main JS:** the place pages, the Warehouse, the Exchange and the grant's sheet are lazy; the shell's check (`grant &&
  !grant.seen`) is a tiny selector. Say the number.

## Do

1. The icon table and the pin (if H79 hasn't); the trade resolver in `save/game.ts`.
2. **The places:** the registry, the stale-link fallback, `FacilityPage`'s v3 header, pickers, recipe cards, Who order,
   quick looks; `finishAllCost`/`finishAllAt` in `save/work.ts` with its action.
3. **The Warehouse, the Exchange, the Stable's Trade facet, the profile's and the cards' trade lines.**
4. **The grant's sheet** (`grant/GrantSheet.tsx`, lazy, with a pure `grantLines(grant, names)` helper) and the Account's
   row; `markGrantSeen` through a `game.ts` action.
5. **Tests:**
   - `packages/domain/src/save/work-finish-all.test.ts` (mocked to 17): three running entries cost the sum of their
     ⌈remaining ÷ 30 min⌉; finishing spends exactly that and starts each queue; with fewer tickets it refuses; with one
     running entry the cost is null (no button).
   - `apps/web` pure helpers, each with a test: `place-view` (a gathering place's tiles by world tier and band; the
     Workbench's grid; the making places' grade-chip tiers in Tiers 1–3 by the ladder; the Who groups with "Another trade"
     and the open shop); `warehouse-shelves` (v3 shelves and order; v1 unchanged); `exchange-rows` (stocked and locked
     rows, prices × tier); `grantLines` (the fully built roster's numbers in §14.6's words, zero parts dropped, Umas
     sorted by tickets, the banked and floor lines); the Stable's Trade facet counts.
   - Every existing web and domain test passes unchanged.
6. **Check it locally** (your own ports; a desktop browser; never the iOS Simulator), on a scratch v27 save from the CJS
   build with Craft Levels, a running job, facility upgrades, crafted gear and Star Gems (a small fully built world, as
   H78's `fullRoster()` builder makes):
   - **without** the local switch: the Wilds, the Warehouse, the Exchange and the Account as today;
   - **with** it, at 390×844 and 375×667, light and dark: the sheet appears once with the grant (check its numbers against
     H78's `toV28` on the same save), Later closes it, the Account's row reopens it; the Wilds' ten places; each page's
     What step; a gather, a process and a make chained; "Another trade" for a wrong Uma, and the open shop in a world
     without one trade; Finish all; the Warehouse's shelves; buying at the Exchange; the Trade filter; switching to a Tier
     2 world shows its own sheet once. Describe what you saw; screenshots with original art stay local. Say which screens
     touch the screen's edges (the sheet, the Wilds page).

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 5 pass; the domain's replay tests stay green.
- [ ] `git diff` has no switch: `BATTLE_ENGINE_VERSION`, `SAVE_SCHEMA_VERSION` and the chain are as they were.
- [ ] Both local checks in step 6 were done and described. Nothing from the original games in git.
- [ ] `docs/game/` is unchanged and `pnpm docs:update` leaves no diff; the D-row is logged; implementation.md §3 has
  "Built: H80 (D…)".
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit; the live game looks as before.

## Deliver

- **A delegated worker (Claude or ChatGPT):** a pull request from `feat/h80-screens-wilds-first-launch` with one commit,
  `feat(web): R2's Wilds, Warehouse, Exchange and first-launch screens, inert until the switch (H80)`. H79 runs at the
  same time (the icon table, the uma-art pin, the Stable's facet list): rebase on whichever lands first. Fetch `main`
  before you push. Claude's main session reviews it (ChatGPT may merge its own, per CLAUDE.md), then the deploy is
  watched.
- **Flag it done:** after the merge, a `docs(handoff): H80 done (D…)` commit deletes this file, sets H80 to Done with a
  Done row (listing the words H82 carries into the manual), and sets H82 to Ready if its other needs are done.
