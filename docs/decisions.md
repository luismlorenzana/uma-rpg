# Decisions Log — uma-rpg

Game decisions for uma-rpg. Cross-game decisions (`P#`) are in uma-platform `docs/decisions.md`.
Newest entries at the bottom. To reverse a decision, add a new entry that supersedes it instead of editing history.

| # | Date | Decision | Why / Notes |
|---|---|---|---|
| D1 | 2026-10-10 | uma-rpg is a standalone game with its own loop and goals, no longer a token source for uma-racer | Owner; P2, P3 |
| D2 | 2026-10-10 | **Tiers:** each tier is five scenarios in original release order and Uma Levels 1–50 (ten levels per chapter). Tiers 1–3 exist now; the next released scenario completes Tier 3 | Owner |
| D3 | 2026-10-10 | **Tier worlds:** promotion moves one Uma to the next tier at Lv1, where her progression starts over. The old tier keeps everything else (other Umas, facility levels, items) and stays playable. Each tier gets its own mechanics | Owner |
| D4 | 2026-10-10 | Every tier ends with a big **Tier Finale** event (harder fights or party switching). Its form for uma-rpg is still open | Owner |
| D5 | 2026-10-10 | **Collection (Tier 1 only):** start with no Umas and 15 Unlock Tickets; each Uma earns 1 Shard at Lv 10/20/30/40/50; 5 Shards = 1 Ticket. Later tiers have no unlocks | Owner |
| D6 | 2026-10-10 | **Difficulty** is gentle and linear across scenarios: foes grow like Uma stats and skill damage. Scenarios differ by enemy flavor, not difficulty. The Tier Finale is where difficulty rises | Owner. Today's regular/sub-boss/boss sets are the base |
| D7 | 2026-10-10 | **Professions:** besides Uma Level, every Uma has Farming & Cooking (1–50) and Gathering & Crafting (1–50). A third vertical may come later | Owner |
| D8 | 2026-10-10 | **Items:** symmetric raw families of ten (Tier 0), 1 → 1 refining recipes, then varied cooking and crafting recipes. Cooking is authored from scratch, not ported from uma-racer's Farm | Owner |
| D9 | 2026-10-10 | **Extra Stats:** meals unlock Extra Stat slots, which are assigned freely to RPG combat stats, with a cap | Owner. Structure proposed in design §10 |
| D10 | 2026-10-10 | **Equipment** is a new system mirroring farming: gathering → simple crafting → equipment crafting, very varied. Every Uma can equip anything | Owner. Will need a rebalance |
| D11 | 2026-10-10 | **Classes are free:** every Uma can use and switch to any class. A class at proficiency rank 1 learns no skills | Owner |
| D12 | 2026-10-10 | **Training facilities** take 2–3 Umas to raise class proficiency and weapon/armor mastery. Running-style aptitude sets class speed and distance aptitude sets equipment speed: A takes 50% of the time, G 100% | Owner |
| D13 | 2026-10-10 | **Home is a huge Hub map** of passive facilities | Owner |
| D14 | 2026-10-10 | An Unlock Ticket unlocks one **outfit** (268 today) | Owner (Q1). Stats and aptitudes differ per outfit |
| D15 | 2026-10-10 | On promotion, the Uma's profession levels, class proficiency, equipment mastery and Extra Stats **start over** in the new tier; only her stat growth carries, through lifetime level | Owner (Q2) |
| D16 | 2026-10-10 | Umas stay in their party permanently. A member busy at a facility or site **shows greyed out** in her party | Owner (Q3). Proposed: a party with a greyed-out member can't fight until she's recalled |
| D17 | 2026-10-10 | **Extra Stats:** an Uma assigns **at most N of her unlocked slots**. Claude sets N and all values in the balance pass | Owner (Q4). Proposed N = 1 + ⌊level / 10⌋ |
| D18 | 2026-10-10 | **Item depth:** every produce type has its own Hub site and its own effect. No families of near-identical items | Owner (Q5): uma-racer's five milks and five fruits were too shallow |
| D19 | 2026-10-10 | **Three steps only:** raw → refined (1 → 1) → cooked or crafted. No packaging step | Owner (Q5): uma-racer's packaging tier is folded into cooking |
| D20 | 2026-10-10 | **Parity:** there are as many material types as ingredient types, and cooking and crafting take equal time, so an Uma's time splits evenly between them | Owner (Q5) |
| D21 | 2026-10-10 | **The Hub has four pages**, swapped freely: Farmlands, Wilds, Learning District (several class hubs and weapon hubs) and Town (roster, parties, scenarios, inventory and more) | Owner |
| D22 | 2026-10-10 | Each Hub place shows **tiny icons of its assigned Umas**, and tapping it opens a **side overlay** previewing them | Owner |
| D23 | 2026-10-10 | **Extra Stats** use small increments and many slots, on uma-racer's Sun-and-planets model | Owner. Proposed: 8 planets × 10 moons, 16 bridges, 4 Sun nodes; N = 5 + ⌊level / 2⌋ active |
| D24 | 2026-10-10 | Item grades 9–10 are **legendary** in every family, and their icons carry glints | Claude: one visual rule for the top of every ladder |
| D25 | 2026-10-10 | Item icons are generated from code by `tools/pixel-art` (32×32, selective outline, hue-shifted ramps, top-left light). They live in uma-rpg until a second game needs them, then move to `uma-platform/assets/` | Claude. A deliberate exception to P15 while uma-platform's Phase 0 is in flight; P11's extract-on-second-use applies |
| D26 | 2026-10-10 | The pixel-art generator and icons **moved to uma-platform** (`scripts/pixel-art` → `assets/`), superseding D25. The item catalog stays here as game design | uma-platform Phase 0 finished, so P15 applies (uma-platform P35) |
| D27 | 2026-10-10 | **Battles drop Laurels**, a global currency, not raw items. The Exchange sells raw items (stocked by chapter reached: the soft scenario link), Rush Tickets (finish a farm job now) and Sweep Tickets (complete a cleared regular fight now) | Owner. The more you play, the more you choose which single area to push. Proposed: Sweep pays EXP but no Laurels; Rush doesn't apply to training |
| D28 | 2026-10-10 | **Gear binds on equip**: an equipped piece belongs to that Uma permanently, so a fresh Uma must craft her own | Owner. Proposed: she swaps freely among her own bound pieces, so class switches stay free |
| D29 | 2026-10-10 | **No Uma Level gate on gear**: mastery rank is the only requirement to equip | Owner |
| D30 | 2026-10-10 | **The Hub is the first slice.** S1 builds the foundation and the four-page Hub, with all 36 places visible, the account bar and the global menu; collection, battles and the passive layer follow (S2–S8) | Owner: fitting features into a Hub built later would be awkward |
| D31 | 2026-10-10 | **Every screen is a place.** Routes are `/:page/:placeId/*` only (plus `/sign-in`); the Account is a hidden Town place. No other top-level routes | Follows D30: features slot into places, never into global routes |
| D32 | 2026-10-10 | **S1 save sync is one snapshot document per account** with a revision (409 on a stale write; a dirty local save keeps the newer `account.updatedAt`). One Dexie row on the device, one Firestore doc per account | Single owner, mostly one device. Far simpler than uma-racer's per-entity outbox; it lives in one module so a later slice can replace it |
| D33 | 2026-10-10 | **One place registry** (`@rpg/domain` `hub/places.ts`) drives the map, hit targets, menu and routes. Canvas text is avoided: names, pips and badges are DOM buttons over the Phaser map | One source of truth; crisp, accessible labels |
| D34 | 2026-10-10 | Package scope `@rpg/*`; local dev on web :5174 and API :8081, so it runs beside uma-racer | |
| D35 | 2026-10-10 | **Specs, then tasks.** Right before a slice starts, Claude writes its spec (`docs/slices/`) and implementable tasks (`docs/tasks/`); the owner reviews both; a task file is deleted in the commit that finishes it | Owner asked for slice specs and technical task write-ups; just-in-time keeps later slices informed by earlier ones |
