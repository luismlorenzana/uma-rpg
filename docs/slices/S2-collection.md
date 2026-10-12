# S2 — Collection and parties

> **Status: building, 2026-10-10** (the owner approved building straight to deployment). Tasks:
> [docs/tasks/](../tasks/README.md). Design: game design §3 (collection), §6 (assignments), D40 (20 tickets),
> D41 (20 parties).

## Goal

Spend the 20 Unlock Tickets on the outfits you want, see your Umas, and build up to **20 parties of five**. Places get
**full pages**: tapping a place on the Hub still opens the quick-look panel, and a live place's **Enter** button opens
its own page.

## What the owner sees

### Places: quick look, then a full page (D43)

- Tapping a place opens the **quick-look panel** as today, with a short live summary. A live place adds an **Enter**
  button; places that aren't open yet keep their preview.
- **Enter** opens the place's **full page**: a header with ← Hub, the place name and its key counter, then the
  page's own content. Back returns to the Hub page you came from.
- URLs: the Hub page is `/:page`, the quick look is `/:page?peek=:placeId`, and a full page is
  `/:page/:placeId/*`, so a full page can be deep-linked and reloaded.
- The **Account** opens straight to its page from the account bar.

### Stable (full page)

- **Ownership:** All · Owned · Locked, with counts.
- **Search** by character or outfit name.
- **Filters** (a sheet with chips): rarity (1–3★); surface, distance and running style aptitude at **A or better**;
  real-horse sex; "new to you" (unlocked in the last day).
- **Sort:** release date (default, newest first), name, rarity, total base stats, Uma level.
- **Views:** grid (icons) or list (portrait, name, best aptitudes, level). Filters, sort and view are remembered on
  the device.
- Owned outfits show in full colour with their level (every Uma is Lv1 until battles arrive in S3). Locked ones are
  dimmed with a lock.
- **Profile** (`/town/stable/outfit/:id`): everything from S1, plus the Uma's state:
  - **Locked:** an **Unlock** button that names the cost ("Unlock · 1 Ticket · 19 left"). A confirmation step, then the
    unlock is final (D44). With no tickets, the button explains how to earn more (Shards from leveling, S3).
  - **Owned:** level and EXP (S3 fills them), unlock date, and the party she's in, with a link to it.
  - **What her aptitudes mean:** her best running style tells which class she learns fastest, her best distance which
    gear, and her best surface which profession (design §4.1).

### Party Hall (full page)

- **20 parties**, each a card with its name and five slots (Uma icon and level, or empty).
- **Edit a party** (`/town/party-hall/:n`): rename it (1–24 characters), then tap a slot to **add**, **swap** or
  **remove** an Uma. The picker lists owned Umas with search, showing which party each one is already in.
- **One party per Uma** (D46): adding an Uma who is in another party moves her, and the picker says so.
- **Busy** Umas (working at a site or training) show greyed out in their party (D16). Nothing can make an Uma busy until
  S4, so S2 builds the look and the rule only.

### Hub and Account

- The Stable's quick look shows owned / total, tickets left and the last Umas unlocked. The Party Hall's shows how many
  parties are full.
- The Account shows the real "Umas unlocked" count.

## Rules

- **Unlocking** spends exactly one ticket and adds the outfit to the tier world's roster at Lv1 (D44: final).
- **Shards → Tickets:** five Shards make one Ticket, converted automatically (D47). S2 adds the rule; S3 pays Shards.
- **Save v2** (D45): Tier 1 gains `umas` (owned outfits) and `parties` (20). Version-1 saves on a device migrate when
  the app updates. The server refuses a write that would replace a newer save version with an older one.

## Out of scope

Battles, levels above 1, classes, jobs and anything that makes an Uma busy, party roles and formation, Tier 2.

## Exit check (on the iPhone)

Historical check; releases use the [current phone script](../testing/phone-check.md).

1. The Stable's quick look shows the summary; **Enter** opens the full page. Filter to "Front A", sort by name, and
   switch to the list view.
2. Unlock three Umas: the account bar's tickets drop 20 → 17, and they show as owned.
3. In the Party Hall, name a party, put two Umas in it, then move one of them into another party.
4. Reload: everything is still there, and a desktop browser shows the same unlocks and parties.
