# H166 — The switch: the honeycomb live (save v38)

**uma-rpg · ChatGPT or Claude · M · Needs: H162 (save v37 live), H163, H164, H165 · Unblocks: nothing**

## Why

H163–H165 built the honeycomb dark (D295). This packet turns it on:
- every continent becomes a honeycomb of 48 regions around its capital and six run seats;
- each region refills at its nearest of six Springs;
- every world has 24 parties;
- each region keeps who claimed and cleared it.

The pixel continent map goes.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [the manual](../../game/README.md), [the phone check](../../testing/phone-check.md).
- **The design:** [honeycomb.md](../../design/world-map/honeycomb.md), all of it.
- **The packets' Done rows** in [README.md](../README.md), with anything H163–H165 noted for the manual.
- **The last switch to copy:** H162 (capital runs live, save v37). The tests that pin the live version are in its
  diff, and they all move again.
- **Production save rules** (the 2026-10-30 incident, D292): this packet doesn't touch the production save by hand. The
  game migrates it on first load, and the server copies the stored v37 save to `saveBackups/{uid}-v37` on the first
  v38 write.

## Decisions made

1. **The bump:** `SAVE_SCHEMA_VERSION = 38`. `honeycombLive()` is now true everywhere.
2. **What goes:**
   - The pixel continent map: `continentLayout`, its continent markers and band labels in `map/layout.ts`, and
     `ContinentMap`'s `MapCanvas` branch. `MapCanvas` stays for the world view and a region's map.
   - `springForRegion` and `WorldSpring.row`, since a Spring is placed by the honeycomb.
   - The `honeycombLive()` and 20-party branches. `PARTY_COUNT` is 24, and the capital runs' open bound is 6.
3. **What stays:** the world view, a region's map of twelve stages, Map / List, and every region id and stage id of
   today. The eight new regions a continent are ordinary regions from now on.
4. **The owner's world on first load:** four empty parties are added, and `regionTeams` is empty.
   - Regions already completed show ✓ with no faces (HM6), and claimed ones show their arc with no faces.
   - The eight new regions of each continent start untouched.
   - Each Spring's recharge carries over by id, and the sixth starts ready.
5. **The manual:**
   - **[maps](../../game/maps.md):**
     - the Shape section rewritten for the honeycomb (the rings table from the design's §1);
     - the shape table: 48 regions, six Springs, the capital's seats;
     - Springs: six, each region at its nearest, eight each;
     - a hex's states.
   - **[sections](../../game/sections.md):**
     - the Scenario Gate's continent map: the hexes, the quick looks, zoom, Map / List;
     - the Party Hall: 24.
   - **[loops](../../game/loops.md):** Parties (24) and anything that says 20 parties.
   - **[architecture](../../game/architecture.md):** save v38 in the history, and the shape: `regionTeams`, 24 parties.
   - **The live tables:** `docs/render.ts`'s Regions row ("40 per continent in 10 rows of 4" becomes 48 on a honeycomb)
     and anything else that counts regions. Then `pnpm docs:update`.
6. **The phone check gains:**
   - the continent map opens fitted on the frontier;
   - pinch and − ⊙ + zoom;
   - a hex's quick look and Enter;
   - a Spring's Refill from its quick look;
   - the capital's quick look and a seat;
   - a stage won in a fresh region shows the claim's five faces, and its boss won shows the clear's;
   - the Party Hall shows 24.

## Do

1. The bump. Delete what decision 2 lists. Move the tests that pinned v37 as live to 38. Old-save tests keep their
   fixtures.
2. A scratch migration of a local save copy, never the production one. Run a field diff: a v37 save gains four empty
   parties a world and an empty `regionTeams`, and nothing else changes. `updatedAt` never moves.
3. The manual (decision 5), then `docs:update`, then the phone check (decision 6).
4. Look at it end to end on the local preview (`.claude/launch.json`'s `rpg-api` and `rpg-web`):
   - a migrated save opens on the honeycomb;
   - a fresh region's first stage win shows its claim, and its boss win its clear;
   - a Spring refills from its quick look;
   - a new region (`w1-x-1`) is entered and won;
   - the capital's seats show a won run;
   - the Party Hall shows 24.

   Check 390×844 and 375×667, light and dark. Screenshots stay local.
5. Log the D-row (fetch `main` first), and update [README.md](../README.md)'s status (save v38).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Give the main JS figure against the 230 KB budget.
- [ ] The scratch migration's diff shows only the four parties and `regionTeams`.
- [ ] Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.
- [ ] The owner has the phone check's new lines.

## Deliver

- **Claude:** commit to `main`: "feat: the honeycomb continent map live, save v38 (H166)".
- **ChatGPT:** a branch and a pull request with that title. Merge it yourself when the checks and CI are green. Fetch
  `main` before you push so the D-number is free.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
