# S1 — Hub and foundation

> **D144 (2026-10-16):** the Farmlands page is gone; the Hub has three pages ([after the farm](../design/after-the-farm.md)).

> **Status: spec for owner review, 2026-10-10.** Tasks: [docs/tasks/](../tasks/README.md). Design: game design §9
> (Hub), §2 (tier worlds), §3 (collection).

## Goal

Open the app on the iPhone, sign in, and land on the **Hub**. All four pages work, **every place is visible and
tappable**, the account bar shows who you are and what you own, and a global menu reaches everything. There's no
gameplay yet. Each place that comes later says what it will do and which slice opens it. Real data shows wherever it
already exists: all 268 Umas from master data, and Tier 1's chapters.

## What the owner sees

### Sign-in and first launch

- A signed-out screen with the game name and **Sign in with Google**. Only the owner's email gets in (allowlist),
  exactly as in uma-racer.
- The first launch creates the account: you pick a **trainer name** (default "Trainer"), and the game creates the
  **Tier 1 world** with its wallet: **20 Unlock Tickets**, 0 Shards, 0 Laurels.
- Later launches open straight onto the Hub, from the device's save, with no waiting on the network.

### The Hub screen (390×844 portrait, safe areas respected)

```text
┌──────────────────────────────────────┐
│ Trainer · Tier 1      🎟15  ✦0  ❦0  │  ← account bar (tap → Account)
├──────────────────────────────────────┤
│                                      │
│   page map: every place on screen    │  ← Phaser map + tappable places
│   at once, no scrolling              │
│                                      │
├──────────────────────────────────────┤
│ Farmlands  Wilds  Learning  Town  ☰  │  ← page tabs + global menu
└──────────────────────────────────────┘
```

- **Account bar:** trainer name, the tier world chip ("Tier 1"), then the wallet: Unlock Tickets, Shards and Laurels,
  each with its icon. Tapping it opens **Account**.
- **Page tabs:** Farmlands, Wilds, Learning, Town. A horizontal swipe on the map also changes page. The app remembers
  the last page on the device.
- **Each page fits one screen.** All of its places are visible at once, laid out on a placeholder map: ground tiles
  in the page's palette (green Farmlands, rocky Wilds, stone Learning District, warm Town), with a simple building or
  plot per place. Gentle ambient motion (water shimmer, swaying crops) makes it feel alive; reduced motion turns it off.
- **Each place shows:** its name, its kind of building, **Uma slot pips** (empty for now: where assigned Umas' icons
  will sit) and, if it isn't live yet, a small "S4"-style badge for the slice that opens it.

### The 36 places

| Page | Places |
|---|---|
| Farmlands (10) | Fields, Orchard, Fishery, Herb Garden, Vegetable Garden, Mushroom Cave, Sugar Grove, Nut Grove, Pantry, Kitchen |
| Wilds (10) | Monster Den, Ley Spring, Mine, Crystal Cavern, Quarry, Meadow, Forest, Fossil Dig, Workbench, Forge |
| Learning District (9) | Brawler Dojo, Mage Tower, Spell Blade Salle, Cleric Chapel, Summoner Circle, Ranger's Lodge, Lancer's Barracks, Arcane Armory, Knight's Bastion |
| Town (7) | Stable, Party Hall, Scenario Gate, Warehouse, Exchange, Observatory, Tier Finale |

Farmlands and Wilds use the same layout, site for site (each farming site sits where its mirrored gathering site is).

### Tapping a place

A **side overlay** slides in from the right (most of the screen width, the Hub still peeking behind). Close it with
✕, a swipe right, a tap on the Hub, or the back gesture. The URL names the place (`/town/stable`), so back and
reload work.

**Every place's overlay** shows its name, what it is for (one or two lines from the design), its slots, and either its
live content or **"Opens in S#"** with a short preview of what it will do.

**Live in S1:**

- **Stable:** browse all **268 outfits**. A grid of Uma icons with search by name, every outfit shown as **locked**,
  and the note "20 Unlock Tickets · unlocking opens in S2". Tapping an outfit shows a read-only profile: portrait,
  name and character, rarity, aptitudes (surface, distance, running style), base stats, growth rates and unique skill.
- **Scenario Gate:** the **Tier 1 chapters** in order (URA Finale → Grand Masters) with crest, name and level band
  (1–10 … 41–50). Tier 2 and Tier 3 are listed as locked. Tapping a chapter says "Battles open in S3".
- **Account** (from the account bar or the menu): trainer name (editable), tier world, account created date, Umas
  unlocked 0/268, the wallet, master data release version, app build, and sign out. If a new build is ready, it shows
  the update prompt.

### Global menu (☰)

A sheet listing **every place grouped by page**. Tapping one jumps to its page and opens it. Below that: Account and
the Guide (placeholder: "the guide arrives with S3").

### Offline and updates

- An installed Home Screen app. The app shell and the master data it has already loaded work offline.
- The save lives on the device and syncs to the cloud in the background. A second browser signed in as the owner sees
  the same trainer name and wallet.
- A new deploy shows **Update ready — Restart**, as uma-racer does.

## Out of scope

Unlocking Umas, parties, battles, jobs, items, Laurel spending, Tier 2 and 3 worlds (only the chip and the locked
chapter rows), Hub art beyond placeholders, and pan or zoom (each page fits the screen).

## Exit check

On the owner's iPhone, from the Home Screen:

1. Sign in, name the trainer, and land on Farmlands with 20 Unlock Tickets in the account bar.
2. Switch through all four pages by tab and by swipe. Every place is visible without scrolling, and each one opens
   its overlay.
3. The Stable shows 268 outfits with art. Search works, and a profile opens.
4. The Scenario Gate lists Tier 1's five chapters.
5. Rename the trainer, reload, and the name stays. A desktop browser signed in as the owner shows the new name.
6. The deploy pipeline is green. `/api/health` returns 200, and the save endpoint returns 401 without a token.
