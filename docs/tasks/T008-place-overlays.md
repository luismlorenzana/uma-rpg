# T008 — Place overlays: Stable, Scenario Gate, Account and the placeholder

**Goal:** what opens when you tap a place. Three places are live in S1; every other place shows an honest preview.

## Build

**Generic placeholder** (`apps/web/src/places/PlacePreview.tsx`, the default for any place without its own overlay):
- Header with the place name and kind.
- The blurb.
- Its slots as empty Uma frames.
- The **"Opens in S#"** banner with the slice's one-line goal (from a small map of slice id → goal, kept beside the
  registry).
- A "What it will do" list drawn from the design: produces (for sites, the family and its first items' names), trains
  (halls and armories), or the feature (Exchange, Observatory…).

**Stable** (`/town/stable`):
- A virtualized grid of all 268 outfits (icon + short name), five per row on phones. Search by character or outfit
  name. A "Locked" overlay on every card. A header note: "15 Unlock Tickets · unlocking opens in S2".
- `/town/stable/outfit/:outfitId`: a read-only profile showing bust or portrait, name and character, rarity,
  aptitudes as grade chips grouped Surface / Distance / Style, base stats and growth rates (the five racing stats as
  imported), and the unique skill's name and description.
- States: loading (skeleton grid), no data offline (T005 message), unknown outfit id (back to the grid).

**Scenario Gate** (`/town/scenario-gate`):
- Tier 1's five chapters as cards: crest, name, level band, and "Battles open in S3".
- Tier 2 and Tier 3 as locked rows ("Promote an Uma to reach Tier 2").

**Account** (`/town/account`, from the account bar and the menu):
- Trainer name, editable inline (1–24 characters, saved through the T004 store, so it syncs).
- Tier world, account created date, Umas unlocked `0 / 268`, and the wallet.
- Master data release version and schema, app build id, and the update prompt when one is waiting.
- Sign out.

## Done when

- Component tests: placeholder content for a site, a hall and the Exchange; Stable search; profile mapping; trainer
  name validation.
- At 390×844 and 375×667: all three live overlays and three sample placeholders look right, with no horizontal
  scroll. Screenshots showing original game art never go in git. Keep them local and describe the results in the
  acceptance doc (T009).
- Opening an overlay never blocks the map. Closing it returns focus to the place that opened it.
