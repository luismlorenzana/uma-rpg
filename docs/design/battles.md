# Battles, chapters and leveling

> **Chapters and runs gave way to the world map (D72, [world/](world/README.md)).** The fight rules, rewards and
> builds below still hold; stages replace chapter nodes and one world-wide run replaces per-party runs.

> **Status: current (S3, 2026-10-10; D48–D53).** The fight rules themselves (hands, breaks, statuses, trees, Limit
> Breaks) are in [classes.md](classes.md), ported from uma-racer. This page covers what uma-rpg builds around them.
> Code: `packages/domain/src/rpg/` (engine, catalog, campaign) and `packages/domain/src/save/battle.ts` (the rules over
> the save).

## The loop

Unlock Umas (S2) → put five in a party → pick a chapter and a node → fight → every entrant earns EXP → levels give
skill points and, in Tier 1, a **Shard at Lv10, 20, 30, 40 and 50** → five Shards make an Unlock Ticket (D47) →
unlock more. Every win also pays **Laurels**, the currency the Exchange spends from S4.

## Chapters (D48)

One chapter per scenario of the tier, in release order: Tier 1 is URA Finale (Lv1–10), Unity Cup (11–20), Trackblazer
(21–30), Our Grand Concert (31–40) and Grand Masters (41–50). Chapters are **generated in code** from the scenario's
order; only the faces come from the private cast (D50).

| Stage | Levels | Nodes |
|---|---|---|
| Debut, Classic, Senior | +0–2, +3–5, +6–8 | Two rows of three fights (lanes lean to an element; the middle lane is mixed), a camp, a sub-boss with escorts |
| Finals | +9 | The last camp, then three authored routes, each a **vanguard** then a **champion** with authored escorts |

- A node opens when a node above it is won. Any node can be replayed; replays pay in full.
- Each of the fourteen authored Finals (uma-racer's, original names and lines) belongs to one release slot; a fifteenth
  scenario reuses the first until it gets its own.
- Every chapter is open from the start; its level band tells you when it's sensible.

## Runs: one per party per chapter (D52)

- A run remembers the nodes the party has won, the **MP each Uma carries** between fights (HP is always full at the
  start of a fight), and the **open fight**.
- **Camps** refill every member's MP.
- A fight needs a **full party of five**. A party fights **one fight at a time**, and its line-up is locked until the
  fight ends: nobody joins, leaves or moves to another party mid-fight.
- The open fight is stored as its frozen input (the party's stats, trees and equipped skills when it began, and the
  foes) plus **every action taken**. The state is replayed from them, so a fight survives a reload and continues on
  another device, and the save parser rejects a fight that doesn't replay cleanly.
- **Give up** closes the fight with no reward and MP as it was before; **back to the map** keeps it open.

## Rewards (D51)

| Win | EXP weight (share of one level at the foes' level; halved by D71) | Laurels (× tier) |
|---|---|---|
| Fight | 0.21 | 2 |
| Stage sub-boss | 0.14 | 5 |
| Finals vanguard | 0.075 | 6 |
| Finals champion | 0.10 | 10 |

- EXP scales **±10% per level of gap** between the Uma and the foes, from 10% to 200%, so new Umas catch up fast on
  cleared chapters. Every entrant earns it, knocked out or not. Level `L` needs `120 + 16L` EXP; Lv50 banks EXP for
  promotion (S8).
- **Pacing, as pinned by tests (D71):** clearing every node of each chapter ends at Lv 7, 15, 24, 33 and 43; one path
  per chapter ends at Lv 4, 10, 16, 22 and 28, and replays (paid up to double above her level) close the gap. Every win
  also drops tokens ([loop.md](loop.md)).
- Laurels are **draft numbers**: the pacing model before S4 sets them with the Exchange's prices.
- A loss pays nothing and costs nothing.

## Builds and skills (D49)

See [classes.md](classes.md) for the trees. In uma-rpg every Uma has six class builds, each with its own tree, its
own equipped skills and the full point budget (2 points a level up to Lv50, plus 5 as each depth opens: 125 at Lv50).
Depth d opens at class rank d and Uma Lv 1/10/20/30/40 (D77), so she has skills from Lv1; side skills at Lv 5/15/25/35/45
(D73). The profile's first tab, **Skills**, picks her class and weapon pair and shows both trees. Skill slots: 3 at Lv1, one more at Lv10, 15, 20, 25, 30, 35 and
40. A newly learned skill goes straight into a free slot; variants swap out for a refund, core skills are permanent.

## The rivals: PriConne's cast (D50)

The foes wear the faces of **Princess Connect! Re:Dive's playable characters**: 109 of them (the official character
list minus story-only characters). Names, colours and bust portraits are private content, never in git:
`node scripts/cast/import.mjs` builds `content/release/` from the captured list, `bash scripts/cast/publish.sh`
uploads it to `gs://uma-rpg-content`, and the API serves it at `/api/content/` to the signed-in owner only. Growing
the cast means capturing the list again and re-running both scripts; the chapters pick it up on the next load. Since
D76, D81 and D83 the faces follow the biome, three biomes a franchise: PriConne, **Azur Lane** (694 shipyard busts,
`import-azurlane.mjs`), **Last Origin** (full art and face icons, `import-lastorigin.mjs`, run by the owner), **NIKKE**
(full-body art, `import-nikke.mjs`), **Destiny Child** (full-body stills, `import-destinychild.mjs`) and
**Echocalypse** (D84); Forest alone draws from a mixed pool of five faces per pack. Busts and full-body art both fit the stage by their own shape; the
small round faces use a pack's face icons, or zoom onto the head of full-body art.
Costume variants aren't on the official site and are out of scope.

## Presentation (D53)

- **The stage is Phaser**, like the Hub: rivals stand as bust portraits on the top half, the party as chibis (idle
  pose, cheer pose on a win) below. The engine decides everything first; the stage then plays its events: lunges,
  hit flashes and shakes, element particles (fire, ice, lightning bolts, light, dark), weapon slashes, shield chips,
  a **BREAK** shatter with a camera shake, knockouts, heals, and a **Limit Break cut-in** with the Uma's bust on a
  dark band.
- **The DOM carries everything lasting**: tap targets, HP and MP bars, shields, weaknesses, intents, damage previews,
  commands and sheets. The canvas only draws effect text (damage numbers, WEAK, BREAK).
- Tap the stage to skip the playback. Reduced motion skips it entirely. An Uma without a chibi in the master data
  shows her outfit icon instead.
- Art stays lean (the owner, 2026-10-10): existing master-data art and official portraits plus a few procedural
  effects; no bespoke sprite sheets.
