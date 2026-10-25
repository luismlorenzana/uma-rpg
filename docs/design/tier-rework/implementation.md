# The Tier rework: implementation plan

> **2026-10-25, D198.** The six approved docs (D192–D197) become five live releases and 42 packets (H64–H105). The
> owner asked for "proper phasing to have full releases along the way", so this replaces the one Tier 1 switch of
> README §9 (XC11, XR10). Each release is built dark behind its own engine and save version and turned on by its own
> switch packet, the way classes v2 was (H53–H61). The packets are in [handoff/tasks/](../../handoff/tasks/) and indexed
> in [handoff/README.md](../../handoff/README.md). Anyone can take one: a Claude session, ChatGPT (an "Either" or
> "ChatGPT" packet), or this session's workers.

## 1. Five releases

| Release | What the player gets | Engine · save | Packets |
|---|---|---|---|
| **R1. Tier 1's fight** | Three weapons a class, set to the owner's defaults. Trees with no points: a trunk and one free fork. Skill Ranks every 2 Class Ranks. Foes weak to their twins (an Arm and its element). The calling pick. Her template's name, chip and Flourish (HP). The base MP regen. Pierce. The halls' two kinds and the Paladin's revive. **On today's gear.** | **v16 · v27** | H64–H72 |
| **R2. Tier 1's economy** | She owns every weapon, armor slot and accessory slot at G0, and one made item raises one a grade at Uma Lv 5g − 4 (ranks gone). Armor carries defense. One accessory slot holds the four families' base forms (Pendant, Orb, Bell, Insignia), and the supports retire. The signature accessory. The Planet and three moons, with her moon, opened by jewels (Star Gems gone). Ten professions in ten buildings, four slots each. The compensation: Craft Levels to 1, Speed Tickets for the time they took, and the first launch's sheet. New item icons. | **v17 · v28** | H73–H82 |
| **R3. Tier 2's weapons** | Pure or Dual at G5, with the Branch Gem. A second accessory slot and its branches (Great, Channel, Twin, Toll, Onslaught). The kind cap. The weapon moon (Full or Split). The secondary profession. | **v18 · v29** | H83–H90 |
| **R4. Tier 2's classes** | The class branches: the weapon-group focus, class skills, and the group names Heavy, Lite, Elemental and Arcane. Branch C and the Power or Break tip. Her signature tip. Tier 2's weaknesses by rank, boss shields 9 and Tier 2's term. | **v19 · v30** | H91–H97 |
| **R5. Tier 3** | Keen, Tempered and Evolved. The third accessory slot and its step. The second weapon moon. Depth 6 capstones, two branches held and the master slot. The six masteries. Boss shields 10 and Tier 3's term. | **v20 · v31** | H98–H105 |

**Why this cut.** R1 is the fight alone. Classes, trees, weaknesses, the calling and the Flourish run on today's gear
and balance on their own re-baseline. It is the smallest release that changes how Tier 1 plays, so the owner can test
it in action first. R2 moves as one release because every item a profession makes feeds the gear or the Observatory, and
its save change pays one compensation against one conversion table. Tier 2 splits into weapons (R3) and classes (R4).
Each half is one coherent toolbox, and its balance packet prices its half of Tier 2's term. R5 is Tier 3's whole
toolbox; its Rift still waits for the fifth scenario (tiers T9).

**Between releases** (SB1): a later tier's world plays whichever shape is live, × tier. After R1, Tier 2 and Tier 3
worlds have three weapons, Tier 1's trees and twin weaknesses, with today's gear. After R2, they also have Tier 1's
economy × 1.8 and × 2.6: Tier 2's material pairs by the ladder (PP9), one accessory slot and base forms only. After R3,
Tier 3 worlds have Tier 2's weapons and one weapon moon until R5. Each balance packet measures the later tiers' worlds
on the shape it ships.

## 2. Conventions every packet follows

- **One switch per release, one predicate per stage.** H64 adds a single `rpgRework(stage, engine)` beside `rpgV2` in
  `rpg/battle/caps.ts`, with `RPG_REWORK_ENGINE = { fight: 16, economy: 17, t2Weapons: 18, t2Classes: 19, t3: 20 }`.
  - A rule outside the engine takes `engine = BATTLE_ENGINE_VERSION`; the engine passes the fight's own version. This is
    classes v2's pattern (`caps.ts`'s header).
  - Rules that aren't fight rules, such as the professions, the places and the Warehouse, read the same predicate with
    the live default. One flip turns a release on everywhere.
- **Dark until the switch.** A release's packets merge and deploy with the live game unchanged. The switch packet does
  three things in one commit: flips `BATTLE_ENGINE_VERSION`, flips `SAVE_SCHEMA_VERSION`, and chains that release's
  `toV27`…`toV31`. Until then, each migration is written and tested but not chained, as H58's `toV25` was.
- **Replays pinned.** Older fights replay on their own engine. Each foundation packet freezes a fixture of the previous
  engine's fights and asserts they replay byte for byte under the new generation, as H53's `v14-replays` tests did.
- **Screens inert until the switch.** New screens read the live predicate, so they show nothing new until the flip.
  Tests exercise them with the switch mocked on.
- **Balance is measured, not guessed.** Each release has one balance packet. It runs README §9.5's simulation items
  with stat-balance §12's expected results and tunes only the knobs the docs name, in their order. It writes the
  measured numbers into the docs.
- **D-rows.** A packet logs its own decisions as one D-row when it lands. Fetch `main` first for the number. Each
  foundation packet (H64, H74, H83, H91, H98) first logs its release's build decisions as one D-row.
- **"Built" lines.** A dark packet records itself in one place. R1's and R2's packets add "Built: H6x (D…)" under
  their release's table here (§3). R3–R5's packets add "Built in H… (D…), live from H…" to the design sections they
  build. Each switch packet turns its release's lines into "Live".
- **Names that cross releases.** A tree's A/B/C pick is its **line** (`lines` on the profile, the input and the
  loadout, R1). A weapon's Pure or Dual (and Keen, Tempered, Evolved) is its **branch** (`branches`, R3). A class's
  focus branch is its **class branch** (`classBranch`, R4). The test mock for the switch is H64's `capsAt`.
- **Done.** The packet file is deleted in the commit that finishes it (D35). Its row moves to Done in the handoff
  index.
- **The house rules** (CLAUDE.md, AGENTS.md):
  - Nothing from the original games in git: no names, skills or art.
  - Main JS ≤ 230 KB gzip (201 today).
  - Run `pnpm docs:update` after rule changes. The switch packets rewrite the manual (`docs/game/`).
  - Local checks run in a desktop browser at 390×844 on a scratch save, never the iOS Simulator.
  - Every push to `main` deploys; watch it green.
  - Delegated workers use a branch and a pull request. ChatGPT may merge its own.
- **The kit and the art.**
  - Nothing here needs an uma-kit change. The rework's screens are uma-rpg's own: the Stable's facets, place pages,
    the Observatory, the Skills tab and the sheets on the kit's existing `Sheet`. If a packet finds it does need one, it
    stops and files a "Both apps:" request in uma-platform (change-protocol.md).
  - New art is one ChatGPT packet (H73) in uma-platform. Claude publishes the uma-art release; R2's switch pins it.

## 3. The packets

**R1. Tier 1's fight (engine v16, save v27)**

| Id | Task | Who | Size | Needs |
|---|---|---|---|---|
| H64 | Engine v16 foundation: the rework's switch (`rpgRework`), three weapon slots by channel, the owner's defaults, equippable kinds; v15 replays pinned; logs the build decisions | Claude | M | — |
| H65 | Trees v16: no points, the trunk and one fork, branches A and B, Pierce, equipped slots, Skill Ranks frozen into a fight's input; the halls' two kinds and the Paladin's revive | Claude | L | H64 |
| H66 | Weaknesses and shields: every foe's twins by kind, Tier 1's shields, the coverage script, the Rift's fronts and guided builds on three weapons | Claude | M | H64 |
| H67 | The template and the calling (domain): `umaTemplate`, the 90-template catalog and names, the calling pick's rules and the start by calling, the Stable's Template facets | Either | M | H64 |
| H68 | Engine v16 rules: the base MP regen and the Flourish (Clean break, Even pace, Late reserve) as her calling | Claude | M | H64, H67 |
| H69 | Save v27 (dark): five weapons to three, learned sides to picks, the loadout pruned, `legacy` retired, `OwnedUma.calling`; `toV27` written, not chained | Claude | M | H65, H67 |
| H70 | R1's screens (inert): the Skills tab as a tree with ranks, the Gear tab's three weapons, the calling pick card, the template chip and card with ★, the Stable's Template filter, foes' weakness icons, MP "+n a round" | Either | L | H65, H66, H67, H68, H69 |
| H71 | R1's balance (dark): the re-baseline on today's gear, the mirror (the Summoner's Arms hand 0.48), weaknesses and shields, branches and Pierce, MP with the regen; the Rift's Tier 1 fronts; Tier 2 and 3 worlds on R1's shape | Claude | L | H65, H66, H68 |
| H72 | R1's switch: engine v16 and save v27 live; the manual rewritten | Claude | M | H69, H70, H71 |

Waves: 1) H64 → 2) H65, H66, H67 → 3) H68, H69 → 4) H70, H71 → 5) H72.

Built (dark, live from H72): H64 (D199, D200), H66 (D202), H67 (D203).

**R2. Tier 1's economy (engine v17, save v28)**

| Id | Task | Who | Size | Needs |
|---|---|---|---|---|
| H73 | **Art** (uma-platform): Weapon Gem, Armor Fittings and Accessory Setting icon rows (G1–G10 each) and the Branch Gem; Claude publishes uma-art | ChatGPT | M | — |
| H74 | Engine v17 foundation and the gear model: grades per weapon kind, armor slot and accessory slot from G0; the Uma Lv 5g − 4 gate; values × tier; armor's values; weapon, armor and accessory ranks and Gear Marks retired in the rules | Claude | L | H64 |
| H75 | Accessories v3 (dark): the four families' base forms, the Bell's follow-up and the Insignia's rule, the damage stack's order, one slot, the supports retired, the signature accessory, the presets | Claude | L | H67, H74 |
| H76 | Extra Stats v3 (dark): the Planet, Prowess by class, Vigor and Guard; her moon; jewels and gates; the foe budget's on-curve map; Star Gems retired | Claude | M | H67, H74 |
| H77 | Professions v3 (dark): ten places with four slots, the five lines' catalog for every tier, the ladder, every recipe and made-item id, jobs and gates, the trade by calling, the open shop, the Exchange; facilities and upgrades retired | Claude | L | H64 |
| H78 | Save v28 (dark) and the compensation: work settled, gear to grades, ranks and Manuals gone, Gear Marks to Class Marks, the new map, Star Gems gone, items to the 20 types, places and Laurels back, Craft Levels to 1, the Speed Ticket grant with its floor, `TierWorld.grant` | Claude | L | H69, H74, H75, H76, H77 |
| H79 | R2's screens: gear and stars (inert): the Gear tab by grade, the accessory picker, ★ signature, the targets planner, "Can upgrade", the Observatory with her moon, the Stable's Signature facet; pins uma-art 2.13.0 (whichever of H79 and H80 lands first) | Either | L | H70, H73, H75, H76, H78 |
| H80 | R2's screens: the Wilds and the first launch (inert): the ten place pages and quick looks, the Workbench, the making places, the Warehouse, the Exchange, the Trade filter, "The Wilds are rebuilt" and its Account row, "Finish all" | Either | L | H70, H73, H77, H78 |
| H81 | R2's balance (dark): the full Tier 1 re-baseline, accessory viability, MP, defense, five matched templates, Tier 2 and 3 worlds on Tier 1's shape × tier; the profession pacing simulation | Claude | L | H71, H75, H76, H77 |
| H82 | R2's switch: v16's replays frozen first, then engine v17 and save v28 live; the first launch checked on a full-shaped save; the manual rewritten | Claude | M | H72, H78, H79, H80, H81 |

Waves: H73 can start now. 1) H74, H77 after H64 (they run beside R1's waves 2–4) → 2) H75, H76 after H67 → 3) H78,
then H81 after H71 → 4) H79, H80 after H70 → 5) H82 after H72.

**R3. Tier 2's weapons (engine v18, save v29)**

| Id | Task | Who | Size | Needs |
|---|---|---|---|---|
| H83 | Engine v18 foundation and weapon branches: Pure or Dual at G5, the partner table, a weak multiplier per weapon, the two-kind cap, the Branch Gem and re-forging, the coverage script; armor halves per piece for the four between classes (WP14) | Claude | L | H82 |
| H84 | Accessories, Tier 2: the second slot, one of each family, the five branches, the kind cap, Tier 2's presets | Claude | M | H83 |
| H85 | The weapon moon: Full or Split, its jewels and gates, outside the kind cap, the presets | Claude | M | H83 |
| H86 | The secondary profession: any other profession's base work from Tier 2, the main trade's own pair, the picker's order | Either | M | H82 |
| H87 | Save v29 (dark): a branch per weapon kind, the second accessory slot and its form, the Branch Gem shelf, `weapon-moon-1` and `stars.moons`, `OwnedUma.secondary` | Claude | M | H83, H84, H85, H86 |
| H88 | R3's screens (inert): the G5 branch pick and its partner, accessory branches, the weapon moon on the Observatory, the secondary on the Work tab and place pages, targets and "Can upgrade" | Either | L | H87 |
| H89 | R3's balance (dark): Pure against Dual, coverage, Full against Split, every branch someone's best, Tier 2's shields (bosses 9) and most of its term on HP and DEF, the Rift's Tier 2 fronts, a Tier 2 run of twenty with the secondary | Claude | L | H83, H84, H85, H86 |
| H90 | R3's switch: engine v18 and save v29 live; the manual | Claude | M | H87, H88, H89 |

Waves: 1) H83, H86 → 2) H84, H85 → 3) H87, H89 → 4) H88 → 5) H90. **Tier 2's shields move here from R4:** the Duals
arrive while weaknesses are still twins, so H89 sets bosses 9 (SB6), sub-bosses 7 and regulars Tier 1's + 1 by CP8's
rule, and carries most of SB3's HP and DEF (R3's tools are about ×1.35 an act); R4's H93 writes the rest of the term
(HP and DEF to +27%, offense +10%, bosses × 1.1) and H96 tunes it.

**R4. Tier 2's classes (engine v19, save v30)**

| Id | Task | Who | Size | Needs |
|---|---|---|---|---|
| H91 | Engine v19 foundation and the class branches: the focus in the damage stack, the groups (Heavy, Lite, Elemental, Arcane), default and reverse sets, class skills through a focus slot, Frenzy, guards as skills, branch 1 preselected, branch 2's presets, Tier 2's skill MP ×1.7 | Claude | L | H90 |
| H92 | Trees, Tier 2: branch C (Sweep, Hunt, Focused, Mighty, Wide), the Power or Break tip, the signature tip (Quickstep, Spillover, Long guard), ten equipped slots, LB+ at Bond 10 | Claude | L | H91 |
| H93 | Weaknesses by rank and Tier 2's term: Tier 2's lists, the rest of the term (HP and DEF to +27%, offense +10%, bosses × 1.1; the shields are R3's), the Rift's Tier 2 fronts, the pairings check | Claude | M | H91 |
| H94 | Save v30 (dark): a class branch per class, branch C and tip picks | Claude | S–M | H91, H92 |
| H95 | R4's screens (inert): the class tree on the Skills tab, the branch pick, branch C and the tips, ★ signature tip, the focus on the Battle tab, the group names on chips | Either | L | H93, H94 |
| H96 | R4's balance (dark): each class's two branches, the focus in its regions, the damage stack on one weak hit, the Tier 2 mirror, the pace with the term | Claude | L | H92, H93 |
| H97 | R4's switch: engine v19 and save v30 live; the manual | Claude | M | H94, H95, H96 |

Waves: 1) H91 → 2) H92, H93 → 3) H94, H96 → 4) H95 → 5) H97.

**R5. Tier 3 (engine v20, save v31)**

| Id | Task | Who | Size | Needs |
|---|---|---|---|---|
| H98 | Engine v20 foundation and Tier 3's weapons: Keen, Tempered, Evolved, the Tier 3 partners, two two-kind weapons (the Brawler and the Mage one), re-forging | Claude | L | H97 |
| H99 | Accessories, Tier 3, and the second weapon moon: the third slot, the branches' step, Tier 3's presets; weapon moon 2 and its presets | Claude | M | H98 |
| H100 | Trees, Tier 3, and the masteries: depth 6 capstones, two branches held, the master slot, the branch capstones and the six masteries | Claude | L | H98 |
| H101 | Weaknesses and Tier 3's term: Tier 3's lists, boss shields 10, the term and bosses × 1.1; the secondary reaches Tier 2's work | Claude | M | H98 |
| H102 | Save v31 (dark): two held branches, the master slot, Tier 3's weapon branches, the third slot, `weapon-moon-2` | Claude | M | H99, H100 |
| H103 | R5's screens (inert): Tier 3's branch picks, the third slot, the second weapon moon, capstones, two branches held, the master slot, the mastery on the root | Either | L | H102 |
| H104 | R5's balance (dark): the masteries, Keen against Tempered against Evolved, the stack's ceiling, the pace with Tier 3's term | Claude | L | H99, H100, H101 |
| H105 | R5's switch: engine v20 and save v31 live; the manual | Claude | M | H102, H103, H104 |

Waves: 1) H98 → 2) H99, H100, H101 → 3) H102, H104 → 4) H103 → 5) H105.

**Detail by release.** R1 and R2's packets name files and lines on today's `main`, and are ready to dispatch. R3–R5's
packets carry their full scope, decisions and checks, but point at code by file and function, since R1 and R2 move the
lines. Whoever takes one re-reads the code first.

## 4. Every decision, by packet

Calls not listed are frame or history: SB2 (the model), SB17 (the follow-ups), WP27 and PP18 (superseded), UT1 (this
doc's owner) and UT11 (the affinity, never built).

| Doc | R1 | R2 | R3 | R4 | R5 |
|---|---|---|---|---|---|
| **Class** (D192) | CP1, CP2, CP3, CP12 (H64); CP13–CP18, CP21, CP22 (Tier 1), CP23, CP24 (the root), CP25, CP28, CP32, CP35, CP37, CP42, CP43 (H65, H70); CP4, CP5, CP7, CP8 (Tier 1) (H66); CP29, CP30 (H67, H69, H70); CP9 (H71); CP31 (v27's part, H69); CP10, CP11 (weapons) | CP10, CP11 (accessories) (H75) | CP33 (H83); CP8 (Tier 2) (H89) | CP6 (Tier 2), CP41 (H93); CP19, CP22 (Tier 2) (H92); CP26, CP34, CP38–CP40 (H91); CP31 (v30's part) | CP6 (Tier 3), CP8 (Tier 3) (H101); CP20, CP22 (Tier 3), CP27 (H100) |
| **Weapon** (D193) | — | WP1–WP5, WP14 (her class's half), WP15, WP16, WP26, WP28, WP29 (H74, H73); WP17–WP23 (base forms), WP25 (Tier 1), WP31, WP33 (H75) | WP6–WP8, WP10–WP12, WP14 (halves per piece), WP32 (H83); WP19 (second slot), WP20–WP24, WP25 (Tier 2), WP34 (H84); WP13 (H83, H85) | — | WP9, WP8 (Tier 3) (H98); WP19 (third slot), WP25 (Tier 3), WP34 (step) (H99) |
| **Extra Stats** (D194) | — | EP1–EP8, EP13–EP23 (H76; EP19, EP20 on screen in H79; EP21 in H78) | EP10, EP24, EP25, EP27, EP29 (Tier 2) (H85) | — | EP12, EP26, EP29 (Tier 3) (H99) |
| **Profession** (D195) | — | PP1–PP13, PP16, PP17, PP23 (H77); PP19, PP20, PP24, PP25 (H78, H80); PP21, PP22 (H80) | PP14, PP15 (H86) | — | PP14 (Tier 3's reach) (H101) |
| **Stat balance** (D196) | SB6 (Tier 1), SB11, SB16, SB18 (H68, H71); SB1 (H64) | SB1, SB13 (H74); SB9, SB10, SB14, SB15 (H75, H81) | SB3 (most of HP and DEF), SB6 (9), SB7, SB8 (H84, H89) | SB3 (the rest), SB5 (H93, H96) | SB4, SB5, SB6 (10), SB8 (Tier 3) (H99, H101, H104) |
| **Uma Templates** (D197) | UT2–UT6, UT12, UT14 (the chip, card and Flourish), UT15 (Calling, Stride, Knack), UT16, UT17, UT18 (the Flourish) (H67, H68, H70) | UT7, UT8, UT10, UT13, UT14 (the signature, her moon), UT15 (Signature), UT18 (the signature), UT19 (H75, H76, H77, H79, H81) | — | UT9, UT18 (the tips) (H92, H95) | UT20 (the dial, if the owner asks after playing) |

## 5. What each release asks of the owner

Each switch packet ends with a release the owner checks on the phone ([phone-check.md](../../testing/phone-check.md)).
Nothing in the build waits on him. The calls are made, and each packet records what it decides. **R2's first launch is
the one irreversible moment:** v28 resets Craft Levels and pays the grant. Its switch packet runs the migration on a
scratch copy of a full-shaped save first and attaches the sheet's numbers to its pull request.
