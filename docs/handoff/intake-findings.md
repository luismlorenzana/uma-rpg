# Tier 1 intake: what the code audit found

> **2026-10-28 (D238).** Five workers rewrote the manual against the live code (engine v18, save v31) and listed every
> place where the code contradicts a decision, shows stale text, or looks wrong. Nothing here is fixed yet: this is
> input to Tier 1 hardening's plan, beside the owner's playtest feedback. Ids (F1…) are for triage; file and line are on
> `main` as of 2026-10-28.

## Bugs: wrong behavior a player can hit

| Id | What | Where |
|---|---|---|
| F1 | **Hex never stacks.** It is added 1 at a time and capped at 1, so its "above 1" bonus can never fire: the healers' Katana Heavy line costs more MP for the same effect as line A | `rpg/battle/engine.ts:987` (cap), `:395` (bonus) |
| F2 | **A stale Orb isn't inert.** An Orb left on a kind she no longer slots still adds its flat offense to Limit Break hits of that kind; D223 and the Equip card say it does nothing | `economy/accessories.ts:63` |
| F3 | **The Work tab's "10 gathered in …" uses the old gather time** (v1's `itemMinutes`, no ×1.25): "7h 13m" at Craft Lv 30 where the Mine's ×10 reads "3h 52m" | `apps/web/src/places/stable/OutfitProfile.tsx:451` |
| F4 | **A Rift fight draws over the bars.** The shell's full screen covers only world-map fights; the bars stay mounted under a Rift fight and the grant sheet's automatic opening isn't held back during it | `apps/web/src/hub/Shell.tsx:27` |
| F5 | The Gear tab's "Extra Stats" link goes to `/town/observatory/:id`; the Observatory is on the Learning page (it works only through a redirect) | `places/stable/GearCardV3.tsx:254` |

## Stale text on screen

| Id | What | Where |
|---|---|---|
| F6 | The Observatory's place text: "a Sun, eight planets and their moons", "100 nodes", "Star Gems open nodes" (its quick look, its (i), the Hub and the manual's places table) | `packages/domain/src/hub/places.ts:178–179` |
| F7 | "The Wilds are rebuilt" opens with "Ten professions, each in its own place" (fifteen since v31); its stock line can't show after v29 | `apps/web/src/grant/grant-lines.ts:24`, `:46` |
| F8 | The Battle tab's (i) describes R1's two typed slots (an Orb in Damage, a Talisman or Amulet in Support) and "active Extra Stats" | `OutfitProfile.tsx:267–269` |
| F9 | The Gear → Upgrade "Grades" (i) names the Forge, the Workbench, the Armorer and the Charm Shop (now the Weapon Forge, the Tome Forge, the Armorer and the Charm Forge) | `GearCardV3.tsx:238` |
| F10 | The Notifications card says "Work and training done" (training is gone) | `apps/web/src/push/NotificationsCard.tsx:35` |
| F11 | The Skills tab says "branch" ("Take branch B", "Her branch", its help); the code and the manual say "line" (branch is R3's word for weapon forks, D201) | `places/stable/SkillTree.tsx:100` and its labels |
| F12 | Gritty's moon node shows "Limit +1.6"; a fight applies 1 (the gauge is whole; D213, D215) | `places/observatory/ObservatoryPage.tsx:198`, `places/stable/template-view.ts:103` |
| F13 | Every weapon grade line ends "· weak ×1.3", even at G0 ("Might 0 · weak ×1.3"): it's the fixed weak multiplier, not the grade's | `places/stable/gear-v3.ts:30`, `GearCardV3.tsx:52` |
| F14 | The Accessory (i) says "a Pendant adds all three kinds" (reads oddly) | `GearCardV3.tsx:201` |
| F15 | An empty armor slot on the Equip view shows "G0" twice (placeholder and badge) | `GearCardV3.tsx:37` and `EquipView` |
| F16 | Laurels without separators ("50000") on the Exchange and the Laurels counter; the top bar shows "50,000" | `places/exchange/ExchangePage.tsx:59`, `places/scenario-gate/LaurelCounter.tsx:9` |
| F17 | Place details no screen reads, all stale: the Exchange "by pair", the Rift "gear ranks", "the ten places", `SLICE_GOALS` | `hub/places.ts:27–29`, `:162`, `:227`, `:242`, `:266` |

## The manual's generated lists that render retired rules

The manual describes these correctly in hand-written notes, but each generated block below reads an old rule from
`packages/domain/src/docs/render.ts` and needs its renderer fixed.

| Id | Block | What's wrong |
|---|---|---|
| F18 | `rift-rules` (:738, shown in loops.md) | Echo pay "Class, Weapon, Armor and Accessory Rank EXP": only Class Rank exists since R2 |
| F19 | `weapons` (:93) | Katana and Dark "Twice: the foe and one other": no live skill hits another foe (one foe twice); the shape-per-kind claim doesn't hold for the Spell Blade or the healers |
| F20 | `classes` (:141, :150) | "Starting armor" column (armor's offense follows her class since R2); the farewell printed as 0.3 (Bonded lingers at 0.4) |
| F21 | `skill-trees` (:222, `catalog.ts:118` `describe()`) | Leaves out depth-5 riders, the ×1.3 specials, Pierce, Reap's extra hit and Rain's splash; prints "lingers at 0.3" on Arms summons (none linger since v15) and 4 Heavy stacks (the cap is 3) |
| F22 | `foe-scaling` (:393–394) | "Shields: Regular 2" (world formations give 1–6, capital escorts 3); a hand-written weaknesses row (sub-bosses 2+1 only, no Tiers 2–3, "the Rift keeps its twin draws") |
| F23 | `rift-fronts` (:721) | "Arcane ×1.6 HP and ×1.2 offense over Iron's": Iron's own offense is ×1.6, so Arcane hits ×0.75 as hard as Iron |
| F24 | `battle-constants` (:279–326) | Replay-only rows mixed with live ones; `BATTLE_BARRIER_PERCENT` unversioned; the regen "beside a Spring's" (Springs retired); `BATTLE_STATUS_STEP` "Cleric statuses" |
| F25 | `limits` (:234–255), `presets` | Mostly history of retired Limit Breaks; the presets' "Armor" column (presets don't set armor under grades) |
| F26 | Made-item sell price (:513) | "6 + 6 × its grade" typed by hand, and inlined again in `save/exchange.ts` `sellPriceV3` |

## Balance and design questions

| Id | What |
|---|---|
| F27 | **Heavy is weak on most trees:** with the 3-stack cap, Heavy at depths 3–4 already equals line A's depth 5; it pays only on Shatter (shield chips) and Clarity (MP) |
| F28 | **Sweeps below Lv 41 lose Laurels:** a Sweep Ticket costs 15, a Tier 1 regular stage pays 8 (12 with waves) |
| F29 | **Capital Finals foes use the old chapter generator:** a capital champion has twice a region boss's HP, escorts get no world HP step, no capital foe acts twice |
| F30 | The Insignia reads rank, so it skips the Horde's boss-faced leaders (regular rank) |
| F31 | Fire riders Burn bosses at 4% of their max HP a stack |
| F32 | Tier 2 skirmishers have equal DEF and M.DEF, yet weaknesses v2 (WK8) files them under 2 Arms + 1 element |
| F33 | The defaults' twin-set rationale (CP3) predates weaknesses v2: twins now drive only the Rift, the Hall labels and preset kinds |
| F34 | Equipped skills show one slot per slot her level gives (3 to 7); the profile design says seven |
| F35 | v18 changed one battle rule (the Summoner's Tome hand 0.58 → 0.62), though `rpg/battle/types.ts:12` and weaknesses-v2 WK11 say it changes none |

## Bundle size

| Id | What |
|---|---|
| F36 | **Main JS is 223.46 KB of 230.** The save's whole migration chain loads at boot (`save/save.ts:56` imports `migrateWorld` and `toV26` statically, cancelling the lazy import at `:1337`), and the v1 economy's names and recipes (`economy/gear.ts`, `items/families.ts`) ride in the entry too. Dexie's 32.49 KB chunk also loads on every boot (≈256 KB in all; known since H16). **Done in H136 (D242)** for the migration chain and the v1 names: main JS 214.42 KB, guarded by `scripts/check-size.mjs`; Dexie's boot chunk stays |

## Dead code and stale comments

| Id | What |
|---|---|
| F37 | **The v1 economy in the domain** (kept by D218 for tests at engine 16): `fillRanks`' v1 branch (`gearMarks` always 0 on results), the v1 Exchange (`stockedGrades`, `buyRawItem`, `sellPrice`), the forge's v1 equip and bind, the Observatory's Star Gems, the v1 targets and upgrades, the v1 pacing constants (`toV28`'s floor still reads `itemMinutes`), `pickCalling`'s armor move. Decide whether to keep it for tests or remove it |
| F38 | **Dead web code:** the facility pages' v1 body and pickers, the Exchange's raw items, Manuals and Gear Marks, the v1 Observatory map and its store actions (`setStarGem`, `activate`, `upgrade`), Training badges and help in the Skills tab, the preset's "Binds to her for good" sheet, Gear Marks and Weapon/Armor/Accessory Rank cells on both result screens, `ScenarioGatePeek`, every `rpgRework('economy')` branch with the live default (always true at v18) |
| F39 | **Dead engine paths:** Slow is never applied by any foe move but still read and labelled; `RpgHand.linger` unused since v15 |
| F40 | **Stale comments:** step times and place names since the trios (`work/kinds-v4/*`, `items/made*.ts`, `save/work.ts`, `work/env-v3.ts`), the Branch Gem's engine (says v18; R3's stage is 19), the regen's figures (`rules.ts:364`, `caps.ts:60`), retired ranks, Orbs and supports in headers (`economy/ranks.ts:2`, `save/battle.ts`, `PresetButton.tsx`, `OutfitProfile.tsx`, `save/heroes.ts:1`), `save/save.ts` (v30, targets "up to five"), `skills.ts:1`, `engine.ts:3–5`, `FoeRow.tsx:3`, a dangling `#release-runbook` link in `app/build.ts:1` |
| F41 | **Decision numbers that aren't in this repo** (uma-racer's numbering): D265 (`kinds.ts:100`, `battle/skills.ts:26`) and D311 (`heroes.ts:14`, `battle/limit.ts:1`, `engine.ts:2`, `:1110`, `battle/types.ts:2`, `:187`, `:234`) |
| F42 | **An achievement's title equals a master-data skill name:** "Iron Will" (the Rift's title for sealing Iron with no magic dealt; its badge id `iron-will`). Rename it as the Uma Templates pass renamed two Flourish names (UT16) | `rift/achievements.ts`, the manual's achievement list |
