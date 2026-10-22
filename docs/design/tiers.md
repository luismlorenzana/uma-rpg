# Tiers: separate worlds, promotion, and what each tier adds

> **Approved 2026-10-21 (D159): every call as recommended; not built yet.**
> - This is the first of three linked design docs. The others are [classes v2](classes-v2.md) and
>   [the Rift](rift.md), the end-of-tier event.
> - It replaces H24's planned `tiers.md`, and settles the Tier Finale questions Q6 and Q7 when the owner approves it.
> - **Owner calls** are marked **T1**, **T2** and so on, each with a recommendation. Nothing here is built until the
>   owner decides. [§9](#9-owner-calls) lists every call.

## 1. What the owner asked for

- **A marked separation between tiers.** An Uma promoted to Tier 2 no longer "exists" in Tier 1: she is in no Tier 1
  list or picker.
- **A Tier shifter** at the top of the map. Each tier is "a completely different app instance", with its own Stable,
  Wilds and every other place.
- **Depth that grows by tier, not a different battle system per tier.** The Persona-style experiment failed: every
  fight became weakness skills into All-Out Attacks. Instead:
  - Tier 1 is simplified;
  - class trees grow the way Fire Emblem's classes do;
  - weapons are streamlined first and gain trees later;
  - Extra Stats gain element and weapon-kind specialization after Tier 1.
- **Promotion** comes from a big end-of-tier event that promotes all 20 Umas of four parties at once ([the Rift](rift.md)).

## 2. What exists today

The save is already built for this. Only the app treats Tier 1 as the only tier.

| Piece | Today | Source |
|---|---|---|
| The save | `Save.tierWorlds: Record<tier, TierWorld>`. Each world has its own Umas, parties, wallet (Uma Tickets, Shards, Laurels, Speed and Sweep Tickets, Marks), items, buildings, work, gems, gear, targets and Hall seats. `OwnedUma` has no tier field: her tier is the world she's in | `save/save.ts`, schema v22 |
| Rules | Every mutation takes `tier = TIER_ONE`, and no caller passes another | `save/rules.ts`, `battle.ts`, `work.ts`, `forge.ts`, `heroes.ts`, `observatory.ts`, `exchange.ts`, `notify.ts` |
| Tier-aware already | Lifetime level `50 × (tier − 1) + level` drives stats, EXP and foe levels. Laurels scale with the chapter's tier, and `chapterFor(order)` gives tier ⌈order ÷ 5⌉ | `rpg/rules.ts`, `master/roster.ts` |
| Hard-coded to Tier 1 | `useWorld()` reads `tierWorlds['1']`. So do the top bar's chips, the Account's wallet, the world map's five continents and the push tick | `apps/web/src/save/game.ts`, `hub/Bars.tsx`, `places/account/`, `battle/campaign.tsx`, `apps/api/src/push/` |
| Design | **D2:** a tier is five scenarios, Lv 1–50. **D3:** promotion *moves* one Uma, and the old world stays playable. **D5:** unlocks exist in Tier 1 only. **D15:** what resets. **D72:** a tier is five continents | [game-design.md](game-design.md) §2 |
| Master data | Tiers 1–3 exist. Tier 3 has four scenarios so far (Q8) | — |

**uma-racer's model, for reference** (its `docs/game/04-tiers-and-promotion.md`):
- "One Uma, one tier", with no copy left behind.
- Promotion is a separate, confirmed action with no deadline.
- On promotion everything on the Uma resets, and everything the account owns carries over.
- uma-racer keeps all tiers in one Stable with tier chips.

**uma-rpg goes further, by the owner's call:** each tier is its own world with its own economy.

## 3. One Uma, one tier, one world

**The rule:** an Uma lives in exactly one tier world. Promotion moves her: she leaves every list, picker, party, seat,
target and job of her old tier, and appears only in the new one.

**Per world** (each tier has its own):
- the Stable (only Umas in this tier), parties, the active party, the world map's progress and Springs;
- the Wilds: building levels, work, stock;
- the Warehouse, gear and Star Gems;
- the wallet: Laurels, Uma Tickets and Shards (Tier 1 only, D5), Speed and Sweep Tickets, Marks;
- the Halls of Heroes' seats, targets, and the Rift's runs.

**Per account** (the same in every tier):
- the trainer's name, appearance and notification settings;
- **achievements and titles** (new, from [the Rift](rift.md));
- each Uma's **tier history**: when she promoted, with which party, and the Rift achievements she shared.

**T1, should anything else carry across tiers?** Recommendation: **no.** The owner asked for a marked separation, and
a fresh economy per tier is what makes Tier 2 feel new. The one bridge is the Ascension purse below (T5).

## 4. How it's built

**The active tier.**
- One `activeTier` in the store, remembered on the device (`rpg.tier`).
- The app opens on the highest tier that has Umas. After that it opens on the last tier viewed.

**A different app instance.**
- The shell renders under `key={activeTier}`.
- Switching tiers unmounts and remounts every screen, the Hub's Phaser scene and every cache keyed by world.
- Nothing from one tier's screens survives into another's.

**Every screen reads the active tier:**
- `useWorld()` returns `tierWorlds[activeTier]`, and every action passes `activeTier` to the domain, which already
  takes it;
- the world map shows the active tier's five continents (ids `w6`–`w10` for Tier 2), and the top bar its wallet;
- the Account shows one wallet per tier.

**Routes don't change.**
- A link carries `?tier=` only when it comes from outside: a push notification about Tier 2's Wilds opens
  `/wilds?tier=2`.
- The boot switches tiers, then drops the param.

**The API.**
- The push tick reads every tier world; each notification names its tier and links with `?tier=`.
- Strict parsing already accepts any tier key.

**The Tier shifter.**
- The tier crest on the top bar's disc becomes a button. It opens a sheet with one card per tier:
  - its crest and name;
  - its Uma count;
  - its Rift's state;
  - a lock and "Promote Umas through the Tier n Rift" on a tier that doesn't exist yet.
- Picking a tier fades the frame, remounts the shell and lands on that tier's Town Hall.
- The disc is uma-kit's `AccountBar`, so this is a small kit option (`tier: { value, onOpen }`) that uma-racer leaves
  off. Under the [change protocol](../change-protocol.md) it ships as a uma-platform release.

**T2, a look per tier?** Recommendation: **yes, a light one.** The theme stays the same; each tier tints the Hub's
palette and the frame's accent:
- Tier 1 day (today);
- Tier 2 dusk (amber);
- Tier 3 night (violet).

The owner should know at a glance which world they're in.

**The save.** v23 adds:
- `account.achievements`: ids with the date each was earned;
- `account.history`: per outfit, `{ tier, at, run }` entries;
- each world's `rift` state (see [the Rift](rift.md) §8).

Older saves migrate with all three empty. A second tier world is created at its first promotion, with the defaults of
`newTierWorld` and no Uma Tickets (D5).

## 5. Promotion: what moves, what resets, what stays

Promotion is a confirmed action on the Rift's page for the Umas of a won run ([the Rift](rift.md) §4). It runs in one
save transaction.

| Piece | On promotion | Why |
|---|---|---|
| **Her place in Tier t** | Removed from the world's Umas, parties, active party, Hall seats (as a Hero or a Learner), targets and work. She must be free, so a running job blocks it | "She doesn't exist in Tier 1" |
| **Uma Level** | Lv 1 in Tier t+1, with lifetime-level stats (Tier 2 Lv 1 = lifetime 51) | D15 |
| **Banked EXP past Lv 50** | **T3:** recommendation: converts to Class Marks in the new world, 1 Mark per 10 EXP, capped at 2,000. That's two Manuals, so her first class rank-ups come quicker | It gives the banked EXP a use, as H23 wanted, without carrying power over |
| **Class, ranks, skills** | Class Rank 1 in every class, and weapon, armor and accessory ranks 1. Under Option A (§6) she picks her Tier 2 advanced class during the promotion | D15 |
| **Gear she wears** | Back to the old world's stock, so the Umas still in Tier t can wear it. She arrives with Training weapons and armor and no accessories | D15: "items and gear stay in the old world" |
| **Extra Stats** | Her map starts empty. The gems stay in the old world's stock | D15 |
| **Bonds and Hero seats** | **T4:** recommendation: Bonds reset. The new tier's halls start empty, and Bonds are earned again there. Her old seat empties, and its Learners stay seated if someone takes it | The halls are per world, and carrying Bonds would carry Limit Breaks across |
| **Work** | Must be free | The work engine has no cross-world rows |
| **Her account history** | Gains a `{ tier: t+1, at, run }` entry, and she keeps the run's shared achievements | A record of the climb |

**T5, an Ascension purse for the new world?** A new world starts with:
- level-1 buildings;
- an empty Warehouse;
- no Laurels;
- Umas that only have Training gear.

Recommendation: **yes.** Each promoted Uma pays into the new world's wallet:
- 1,000 Laurels and 5 Speed Tickets;
- a full run of 20 Umas pays 20,000 Laurels and 100 Speed Tickets.

That's enough for the first Exchange purchases and upgrades. Every number is a draft for the pacing simulation.

**Tier 1 after a run.** It stays fully playable with the Umas that weren't promoted, and new Umas are still unlocked
there (D5). A tier's Rift can be run again by its next 20 Lv 50 Umas.

## 6. What each tier adds: depth, not a new battle system

**The lesson.**
- uma-rpg's predecessor tried Persona's "Down → One More → All-Out Attack" (uma-racer D261), and removed it within a
  day (D265): weakness loops were boring, and boss shields had no strategy.
- The Octopath-style shields and Breaks have held up since.
- So every tier keeps the same battle rules. What grows is the **toolbox**: how many choices a class, a weapon and the
  Extra Stats map offer.

### Option A: a growing toolbox, recommended

| | Tier 1, Apprentice | Tier 2, Adept | Tier 3, Master |
|---|---|---|---|
| **Classes** | The six base classes ([classes v2](classes-v2.md)): Brawler, Mage, Spell Blade, Summoner, Paladin, Cleric | **Fire Emblem–style promotion:** each base class branches into two advanced classes, chosen at promotion: twelve in all, each with one passive | **A master class** per advanced class, with one signature mechanic. Its own doc when Tier 2 is played |
| **Skill trees** | **Cores only:** five depths, one skill each, opened by Class Rank. No side forks and no side points | **The side forks (A/B) open,** with side points. The advanced class's passive applies | One extra depth, 6, per tree, and the master's mechanic |
| **Equipped skills** | 3, and +1 at Lv 10, 20, 30 and 40 (7 at most) | 3, and +1 a Lv 5 step (10 at most, today's) | 10, and one master slot |
| **Weapons** | Crafted grades 1–10 with Might. **Nothing else:** a weapon is its tree and its Might | **Weapon arts:** each weapon kind gets a small three-node tree, opened by Weapon Rank, that changes its shape (one more hit, a wider area share, Break +1 shield) | **Awakening:** a grade-10 weapon takes one awakened effect, crafted at the Forge |
| **Armor** | Physical or magical per slot, grades 1–10 (today) | The same, plus **set bonuses** for a full physical or full magical suit | Unchanged |
| **Accessories** | Two slots. **Orbs are +% damage of their kind** ([classes v2](classes-v2.md) §6) | The same | A third slot |
| **Extra Stats** | The eight stat planets, 100 nodes (today) | **An outer ring:** one node pair per damage kind (+% damage of that weapon kind or element), so an Uma can specialize, opened with Tier 2 Star Gems | **Class constellations:** a few nodes per master class |
| **Limit Breaks** | The Halls of Heroes (today) | The same halls, plus Hero LB+ at Bond 10: the Limit Break gains its seat's extra effect | Unchanged |
| **Professions** | Craft Level (today) | **A second vertical** (Q7), with its own families feeding the weapon arts and set bonuses | Its own doc |
| **The Rift** | Tier 1's ([the Rift](rift.md)) | Tier 2's: harder fronts that test weapon arts and the outer ring | Tier 3's |

The Extra Stats outer ring is designed in [Extra Stats in Tier 2](extra-stats-tier2.md) (H41, calls X1–X8).

The second vertical is designed in [the second profession](second-profession.md) (H42, calls V1–V8).

Weapon arts and set bonuses are designed in [weapon arts and armor sets](weapon-arts.md) (H40, calls E1–E9).

Tier 2's continents, foe budget, rewards and Rift fronts are designed in [Tier 2's world and its Rift](tier2-world.md)
(H43, calls Z1–Z10).

**What it costs.** Tier 1's simplification reuses today's content: the cores already exist. The side forks become
Tier 2 content instead of being thrown away. New content is:
- the twelve advanced classes and their passives;
- the weapon arts (10 kinds × 3 nodes);
- the outer ring;
- Tier 3, later.

### Option B: the same toolbox, bigger numbers

- Tier 1 stays exactly as it is.
- Tiers 2 and 3 add only the Extra Stats outer ring and weapon arts, with no class promotion.
- Cheaper, but tiers feel alike, which is the owner's complaint.

### Option C: a different battle system per tier (rejected)

That's what the Persona experiment tried, and why it failed.

**T6, which depth model?** Recommendation: **Option A.**

**T7, simplify Tier 1 now, or only for Umas who haven't started yet?** Tier 1's side skills are in use today: the
owner's Umas have spent side points.
- **Now:** existing Tier 1 Umas keep their chosen sides until they promote, and Tier 1's rules hide forks only for
  Umas who have none. That's a compatibility rule, at no cost.
- **Recommendation:** simplify now with that rule, so Tier 1 means one thing and the Rift's fronts are designed
  against it.

**T8, the twelve advanced classes.** Illustrative pairs only; each needs its own short design when T6 is approved:

| Base | Advanced (example) | Lean |
|---|---|---|
| Brawler | Warlord · Berserker | Break specialist · Axe area damage |
| Mage | Sage · Sorcerer | Element ring combos · raw single target |
| Spell Blade | Duelist · Rune Knight | Multi-hit physical · a larger magic share |
| Summoner | Conjurer · Warlock | Area summons · Dark and Light curses |
| Paladin | Templar · Guardian | Barrier-heavy · damage-taking guard |
| Cleric | Bishop · Oracle | Party mends · buffs and cleanse |

Designed in [Tier 2's advanced classes](tier2-classes.md) (H39, calls A1–A10).

## 7. Tier 3 and Q8

Tier 3 has four scenarios in master data today.

**T9:** recommendation: keep Q8's proposal.
- A partial tier opens the continents it has.
- Its Rift opens when its fifth scenario ships.

Until then, Tier 3 Umas play its four continents, and nobody leaves Tier 3.

## 8. Building order (once approved)

1. **The tier foundation** (needs nothing from the other docs):
   - `activeTier`, the remount and every screen on the active world;
   - the push tick across tiers, and `?tier=` links;
   - the Tier shifter (with a kit option), with Tiers 2 and 3 locked.
2. **Save v23:** account achievements and history, and the Rift state slot.
3. **[Classes v2](classes-v2.md)** (engine v14).
4. **[The Rift](rift.md)** and promotion (§5).
5. **Tier 2's content** (Option A), as its own docs: advanced classes, weapon arts, the outer ring, the second vertical.

Items 1 and 2 can start as soon as T1, T2 and T5 are decided. Items 3 and 4 follow their own docs.

## 9. Owner calls: decided 2026-10-21 (D159), all as recommended

| Call | Question | Recommendation |
|---|---|---|
| **T1** | Anything else shared across tiers? | No: only the account, achievements and history |
| **T2** | A tint per tier? | Yes: Tier 1 day, Tier 2 dusk, Tier 3 night |
| **T3** | Banked EXP past Lv 50 on promotion? | Class Marks in the new world, 1 per 10 EXP, capped at 2,000 |
| **T4** | Bonds and Hero seats on promotion? | Bonds reset; the old seat empties |
| **T5** | An Ascension purse for the new world? | Yes: 1,000 Laurels and 5 Speed Tickets per promoted Uma (draft numbers) |
| **T6** | Depth model? | Option A, a growing toolbox |
| **T7** | Simplify Tier 1 now? | Yes, with existing side skills kept until promotion |
| **T8** | The twelve advanced classes? | The table above as a starting point; each gets a short design after T6 |
| **T9** | A partial Tier 3? | Open its four continents; its Rift waits for the fifth |
