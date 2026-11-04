# Tier 2 and Tier 3: the brief

> **Status: drafted and cross-referenced, 2026-11-04; the owner's requirements next.** The owner: "start working seriously in some Tier 2 docs that would greatly expand our
> current Tier 1 state, basically all the work you authored so far with all the html docs and samples, but update it to
> current Tier 1 state and then I will give you some heavy requirements." This folder is that set: the Tier rework's
> approved Tier 2 and Tier 3 drafts ([tier-rework/](../tier-rework/README.md), D192–D197, D235), carried forward onto
> **Tier 1 as it is built and live** (engine v21, save v36), so the owner's requirements land on current ground. Nothing
> here is built; the manual ([docs/game/](../../game/README.md)) is the game as it plays.

## 1. What this folder is

- **One doc per system**, each with its own previews (desktop pages) and its own call ids. Every doc starts from Tier 1
  as built, carries each old Tier 2/3 call forward with a status, and adds the calls the carry-over needs.
- **The old drafts stay where they are** until this set is reviewed; then `tier-rework/` moves to the archive, its links
  kept, as D238 did for the rest.
- **The owner's heavy requirements come next.** These docs are the baseline they change: where a doc meets a choice,
  it decides with a recommendation and logs it, so nothing waits on a question.

| Doc | Ids | What it covers | Absorbs |
|---|---|---|---|
| [classes.md](classes.md) | T2C | The eight Tier 1 classes in Tiers 2 and 3: class branches, focus, masteries, trees past depth 5, Class Rank, the Halls and Limit Breaks by tier, presets, buffs and debuffs by tier, skill names for new skills | class-progression.md (CP), classes-v3.md's Tier 2/3 parts (CV), halls-v2.md (HV), reclass.md (RC), skill-names.md (SN) |
| [gear.md](gear.md) | T2G | Weapons (grades, Might, branches, partners), armor, the three accessory slots and their families by tier, what a rank costs | weapon-progression.md (WP) |
| [extra-stats.md](extra-stats.md) | T2E | The Planet, the moons and her moon in Tiers 2 and 3: the weapon moons, jewels by tier, the star chart | extra-stats-progression.md (EP) |
| [professions.md](professions.md) | T2P | The farm in Tiers 2 and 3: the five lines and fifteen places, materials by tier, the secondary profession, Craft Levels, the Exchange, demand against supply | profession-progression.md (PP), farm-by-line.md (FL) |
| [balance.md](balance.md) | T2B | Every source's share by tier, the damage stack, the foe budget, weaknesses and shields by tier, statuses, MP, Limit Breaks, what the fight simulation must confirm | stat-balance.md (SB), weaknesses-v2.md (WK), the combat pass (D282) |
| [templates.md](templates.md) | T2U | Her uniqueness by tier: calling, Flourish, signature accessory, her moon, the signature tip | uma-templates.md (UT) |
| [progression.md](progression.md) | T2W | A Tier 2 run end to end: Ascend, what restarts and what carries, the world and its continents, capitals, the Rift, Trials, Drills, windows, Laurels and pacing by tier | tiers.md (archived), collections.md (CO), capitals.md (CA), honeycomb.md (HM), rift.md, pacing.md |

## 2. Tier 1 as built: the frame every doc starts from

Every number below is live (engine v21, save v36) and owned by the manual page linked. A doc that needs more reads the
manual and the code (`packages/domain/src`), never the old drafts, for Tier 1.

- **Classes** ([classes](../../game/classes.md)): five **Tier 0** classes (Warrior, Spellblade, Healer, Summoner, Mage;
  ids `recruit`, `duelist`, `acolyte`, `caller`, `apprentice`) promote at Class Rank 10 into eight **Tier 1** classes:
  **Brawler** (3 Arms), **Sorcerer** (3 Tomes, id `mage`), **Arms Spellblade** and **Arms Summoner** (2 Arms + 1 Tome),
  **Tome Spellblade** and **Tome Summoner** (2 Tomes + 1 Arm), **Paladin** (2 Arms + 1 Tome) and **Cleric** (2 Tomes + 1
  Arm). Roots Warrior · All-Rounder · Mage. Every Tier 0 promotes into three or four classes, kin included (D290, D291).
  The calling is her running style (no pick); one healer a party; a Tier 0 is no healer. **Tier 0 exists only in Tier
  1's world** (CV10): a later world has every Tier 1 class open from Class Rank 1.
- **Hands and leans:** the hybrids' halves (Arms Spellblade 0.72 + 0.44, Tome Spellblade 0.72 + 0.48, Arms Summoner
  0.57 + 0.46, Tome Summoner 0.57 + 0.5), the healers ×0.5 for 0.6 of the MP; stat leans and Limit Break scales (×0.95
  the damage classes, ×0.8 the healers, ×1 a Tier 0) in the [classes table](../../game/classes.md#the-class-tree).
- **Trees** ([skill trees](../../game/skill-trees.md)): one per weapon slot, depths 1–5 opening at Class Rank 1, 10, 20,
  30, 40; a trunk at depths 1–2, line A and line B from depth 3, free and exclusive; Skill Ranks 1–5; equipped slots 3
  → 7 by Uma level. **Names** follow one grammar (D298): a word a tree, Greater · Grand · Supreme, a capstone, line B as
  line A's name with its word.
- **Weapons** ([classes § Weapons](../../game/classes.md#weapons)): ten kinds in five shapes (Heavy Greatsword and Fire,
  Sweep Axe and Ice, Scatter Lance and Lightning, Double Katana and Light, Volley Bow and Dark); twins re-paired at v19
  (Katana–Light, Bow–Dark; Twilight Bow + Katana). Grades G0–G10 per weapon kind, not per class; Might 1 … 68 at G1–G10
  in Tier 1, ×1.8 and ×2.6. No Weapon Rank. **Presets** follow the owner's two party comps (D263).
- **Buffs and debuffs, three levels** (D282): none on Brawlers and Sorcerers; a path (line A of a secondary weapon from
  depth 3) on Spellblades and Summoners; every Greatsword, Lance and Fire skill on Paladins and Clerics, who share every
  number. Statuses: Armor Break, Mind Break, Enfeeble, Brave and Faith. Aegis, Breaker, Clarity, Hex and Shatter are
  retired. Foes don't guard (covering is pinned for special boss fights).
- **Armor** ([materials § Gear](../../game/materials.md#gear)): five slots, each G0–G10; its slot's stat and its offense
  to ATK or M.ATK by her class's half; ×1, 1.8, 2.6 by tier.
- **Accessories** ([combat § Her accessory](../../game/combat.md#her-accessory-and-signature)): **three slots in every
  tier** (D264), each its own grade (G0–G10) and family: **Pendant** +ATK, **Charm** +M.ATK (the Bell retired into it),
  **Orb** offense on one kind, **Insignia** a percentage on sub-bosses and bosses. Rows linear (D266): +1, +1, +2 a
  grade, +1%; ×1.8 and ×2.6 (the Insignia flat). Her ★ signature 0.1 a level × tier. Presets wear her armor half's stat
  twice and an Orb. One tap on the Gear tab.
- **Extra Stats** ([loops § Extra Stats](../../game/loops.md#extra-stats)): the Planet and three moons (Prowess, Vigor,
  Guard), five nodes each, and **her moon** (two nodes, no jewel: they open with the third moon's II and IV): 22 nodes.
  **Three jewels a rank** (D264): a Planet node takes three Planet Jewels, a moon node one Moon Jewel. ×1.8 and ×2.6 by
  tier. Only on her Stars tab; the star chart (D277).
- **Professions** ([materials](../../game/materials.md)): five lines, each a trio of places (gather → process → craft),
  fifteen places: Metal (Mine, Mine Workbench, Weapon Forge), Vegetables (Fields, Fields Workbench, Tome Forge), Wood
  (Forest, Forest Workbench, Armorer), Fish (Fishery, Fishery Workbench, Charm Forge), Stone (Monster Den, Den
  Workbench, Lapidary). **Every line equal** (D264): one rank of everything on two Umas (3 Arms + 3 Tomes) is 30
  refined items a line, 8.0 h at each place at Craft Lv 25; steps 16–24 min; the longest batch 8h 2m at every forge
  (D273). A maxed Uma is 753 h, each trade 20%.
- **Weaknesses** ([combat § Weaknesses](../../game/combat.md#weaknesses-shields-and-breaks)): weaknesses v2 (D235):
  Tier 1 regulars 2 Arms + 2 elements, sub-bosses and bosses 3; Tiers 2 and 3 every rank 3, a regular leaning to the
  channel her weaker defense guards. Shields by formation 1–6, sub-bosses 6, bosses 8; a Break costs two rounds, ×2,
  then Steeled.
- **Halls** ([heroes](../../game/heroes.md)): five halls by family, **sixteen** Limit Breaks (D261: Dojo and Tower two
  seats each, Salle and Circle four, the Healer Sanctum four), Heroes and Learners by Bond.
- **Uma Templates** ([classes § Her calling](../../game/classes.md#her-calling-and-her-template)): calling by running
  style, the ★ Flourish by family, the ★ signature accessory, her moon, all optional (no dot, D274).
- **Collections** ([loops § Windows](../../game/loops.md#windows)): every Uma's window a tier, 36 steps (35 in Tier 3),
  latched for good; the Gallery; Trials; Drills paying Training Logs.
- **The world** ([maps](../../game/maps.md)): five continents a tier, Lv 1–10 … 41–50 (Tier 2's are `w6`–`w10`), each
  with regions and a capital; foe levels are lifetime (Tier 2 Lv 1 is 51). **Built dark:** capitals as runs of four
  parties (capitals v2, save v37) and the continent as a 48-region honeycomb for 24 parties (save v38).

## 3. The tier model as it plays

- **Three tiers, 50 levels each.** One Uma lives in one tier. **Ascend** is one Uma at a time once her window is full,
  Rift step included (D283): she arrives at Lv 1, Class Rank 1 everywhere, every grade G0, an empty Extra Stats map,
  Craft Lv 1, no Bonds; she keeps her class and her accessory slots' families; a Tier 0 arrives as her suggested
  promotion ([loops § Ascend](../../game/loops.md#ascend)).
- **Tier multipliers (SB1):** ×1 · ×1.8 · ×2.6 on gear, Extra Stats and the signature; the Insignia's percentage is the
  same in every tier. Laurels pay × tier.
- **Today a Tier 2 or 3 world runs Tier 1's rules × tier.** None of the Tier 2/3 drafts (class branches, weapon
  branches, the weapon moons, the secondary profession, new material pairs) is built. Tier 3 has no Rift yet.

## 4. How a doc reads

1. **At a glance:** one screen, what Tiers 2 and 3 add, a table of the headline numbers by tier.
2. **Tier 1 as built:** the baseline this system extends, with its numbers and links to the manual. No redesign here.
3. **The approved drafts, call by call:** every old call that touches Tiers 2 or 3 (CP, WP, EP, PP, FL, SB, UT, WK, CV,
   HV, CO, CA, HM…), one row each, with a status and why:
   - **Kept:** stands as written on today's Tier 1.
   - **Kept, changed:** stands with a change Tier 1's iterations force (name the decision, D238–D298).
   - **Superseded:** a Tier 1 decision replaced it (name it).
   - **Broken:** written for a Tier 1 that no longer exists; the doc's new call fixes it.
4. **Tier 2 in full** and **Tier 3 in full:** the updated design, with numbers.
5. **Provides and assumes:** what other docs in this set read from this one, and what it reads from them, by call id.
6. **Save and engine:** what would change, roughly (a later save version, an engine stage), not packets.
7. **Pacing,** where the system takes time.
8. **Decisions:** every new call (T2C1, T2C2…), one line each, with the recommended answer. The owner reviews them all,
   not highlights.

Quality: [class-progression.md](../tier-rework/class-progression.md) is the bar: clear, visual, full depth. Tables over
prose; short sentences; numbers from the code wherever the code has them.

## 5. The previews

- Desktop pages, self-contained HTML, from [`_template.html`](../tier-rework/previews/_template.html) (kit colours,
  light and dark), in [previews/](previews/), named by doc (`classes-*.html`, `gear-*.html` …). Two to four pages a
  doc: the Tier 1 → 2 → 3 picture of the system, and the pages its review needs.
- **No original-game content:** no Uma, character, skill, race or support-card names. Show Umas by role ("a Pace Uma",
  "Uma A") or invented labels; check every new name against the master-data release (`content/release/data` in
  uma-platform) for an exact match before using it.
- Numbers come from the live code where it has them (a throwaway test printing a table is fine; delete it after).
- Each old preview in `tier-rework/previews/` is either carried into a new page or listed in §7 as retired, with why.

## 6. Review order

The owner reviews **classes → gear → extra stats → professions → balance → templates → progression**, one at a time,
with every call listed. A cross-reference pass reconciles the seven before review: shared numbers agree, ids cited
across docs exist, every old call has one owner.

## 7. Status and cross-reference log

**2026-11-04: all seven drafted and cross-referenced; ready for the owner's requirements and review.**

| Doc | Calls | Old calls carried (kept · kept, changed · superseded · broken) | Previews |
|---|---|---|---|
| [classes.md](classes.md) | T2C1–T2C30 | 95: 46 · 25 · 21 · 3 | [tiers](previews/classes-tiers.html) · [branches](previews/classes-branches.html) · [trees](previews/classes-trees.html) |
| [gear.md](gear.md) | T2G1–T2G20 | 34: 8 · 15 · 7 · 4 | [tiers](previews/gear-tiers.html) · [weapons](previews/gear-weapons.html) · [accessories](previews/gear-accessories.html) · [costs](previews/gear-costs.html) |
| [extra-stats.md](extra-stats.md) | T2E1–T2E20 | 30: 18 · 9 · 2 · 1 | [chart](previews/extra-stats-chart.html) · [tiers](previews/extra-stats-tiers.html) · [weapon moons](previews/extra-stats-weapon-moons.html) |
| [professions.md](professions.md) | T2P1–T2P26 | 59: 23 · 19 · 15 · 2 | [tiers](previews/professions-tiers.html) · [times](previews/professions-times.html) · [demand](previews/professions-demand.html) · [secondary](previews/professions-secondary.html) |
| [balance.md](balance.md) | T2B1–T2B19 | 42: 22 · 10 · 7 · 3 | [tiers](previews/balance-tiers.html) · [simulation](previews/balance-sim.html) · [calls](previews/balance-calls.html) |
| [templates.md](templates.md) | T2U1–T2U20 | 20: 2 · 14 · 2 · 2 | [tiers](previews/templates-tiers.html) · [tip](previews/templates-tip.html) · [Umas](previews/templates-umas.html) |
| [progression.md](progression.md) | T2W1–T2W15 | 103: 77 · 15 · 6 · 5 | [tiers](previews/progression-tiers.html) · [world](previews/progression-world.html) · [run](previews/progression-run.html) |

### 7.1 The cross-reference (XR, 2026-11-04)

Where two drafts assumed different things of each other, one rule now holds in both:

| Id | Where they differed | The rule now | Docs changed |
|---|---|---|---|
| XR1 | A later tier's Class Rank pace: each class from Rank 1 (depths at Lv 7 · 13 · 20 · 27) or the Tier 0 ladder's cost a class (two classes no longer reach Rank 50) | **Ranks 1–10 one shared ladder** of 3,600 Class EXP raising every class she holds, then each class alone: depths at Tier 1's Lv 10 · 16 · 22 · 29, two classes to Rank 50 a campaign | T2C3, T2B3 |
| XR2 | Speed and Sweep Tickets flat or × tier | **× tier** (20 · 30, 30 · 45), so a Laurel buys the same time as it buys the same raw items | T2P19 ← T2W10 |
| XR3 | A Branch Gem for weapon branches | **None:** the weapon's own G5 Arms Gem or Tome Ink sets it | T2W's tables ← T2G4, T2P5 |
| XR4 | The weapon moons on Moon Jewels at Lv 6–46 | **One Planet Jewel each on the Planet's ranks** (the Planet takes one fewer), so the map stays 30 jewels and no Stone is added | T2W's tables ← T2E2, T2P7 |
| XR5 | Ascend: weapon branches and accessory forms reset with their grades, or carry | **They carry** (the owner's WP11 and WP34); at G1–G4 a carried branch works at its Tier 2 rate | T2W8 ← T2G17 |
| XR6 | Tier 3's two-kind weapons: two (the Brawler and the Sorcerer one), or one | **One in every tier**: two lift Tier 3's answers above Tier 1's | T2B's tables ← T2G3 |
| XR7 | Tier 3's depth 6 | **No depth-6 node**: the crown plays every held capstone at 5.6, keeping its name and tip | T2U, T2W ← T2C20 |
| XR8 | The MP regen: five steps at most, or a sixth in Tier 3 | **A sixth step (6%) with Tier 3's crown**, paying for the crown's +4 MP | T2B11 ← T2C21 |
| XR9 | Tier 3's Rift | **Tier 3 gets one** (36-step windows in every tier) | T2C, T2E, T2B ← T2W4 |
| XR10 | The kind cap | **Orb forms only, from Tier 2** (+122 · +177); the weapon moons stay outside it with no cap of their own | T2E6, EP27 ← T2G14 |
| XR11 | Presets' ★ past a slot's G5 | **From G5 the ★ goes first for everyone** in its Twofold form; D266's exception stays below G5 | T2U7, T2C25 ← T2G12, T2G13 |
| XR12 | The secondary's material pairs | **No tier pairs**: the same fifty in every tier; a secondary works G1–G8, G9–G10 stay the trade's | T2W's tables ← T2P3, T2P13 |
| XR13 | The healing divisor × tier (T2C18) | Balance's healer checks confirm it with T2B10's skill MP | T2B's assumptions |

**Two findings on Tier 1 as built** (no change made; for the owner):
- **A full window costs more than a maxed Uma** ([professions](professions.md), T2P21–T2P22): the window's Weapons track
  (five weapons at G10, D289) makes an ascending Uma 950 refined items, Metal and Vegetables 250 each against 150 on the
  other lines, so D264's "every line equal" holds for a maxed Uma but not for a full window. Arms Gem and Tome Ink at 6
  would even it (5 × 6 = 3 × 10); professions leaves Tier 1 as built and lets the secondary carry it in Tier 2.
- **The farm ledger's roster split is stale** (`professions-v4.sim.ts`, D220's split): today's callings give 1.00 maxed
  Umas a day, not 1.39.

**One call against the owner's words:** [classes](classes.md) T2C5 retires the owner's group names (Heavy · Lite ·
Elemental · Arcane) for **Ring** and **Light/Dark**, because Heavy is now a weapon shape and Arcane a Rift front. It's
listed so the owner decides it, not as settled.

### 7.2 The old previews

Every page in [tier-rework/previews/](../tier-rework/previews/) is carried into a new page or retired (`_template.html`
stays the template):

| Old page | Now |
|---|---|
| class-overview, class-templates, class-trees | Carried into classes-tiers, classes-branches, classes-trees (class-templates' affinity section retired, T2U) |
| class-weaknesses, weaknesses-v2 | Retired; their by-tier rows are in balance-tiers |
| classes-composition, classes-strikes, classes-template-sheets, classes-trees, skills-all-classes-t1, skills-profile, skills-trees-by-tier | Retired (the first round, or Tier 1 as built) |
| weapon-trees, weapon-accessories, weapon-armor, weapon-materials | Carried into gear-weapons, gear-accessories, gear-costs |
| gear-weapon-tree, gear-loadout | Retired (the first round) |
| gear-crafting | Its recipes carried into professions-times; the rest retired |
| stars-maps, stars-grants, stars-jewels, stars-uma | Carried into extra-stats-chart and extra-stats-tiers (stars-uma's budget and six Umas into templates-umas) |
| extra-stats-budget, extra-stats-maps | Retired (the first round) |
| prof-map, prof-materials, prof-flow, prof-demand | Carried into professions-tiers, professions-times, professions-demand |
| prof-grant, professions-map, professions-flow, professions-demand | Retired (R2's grant, built; the first round) |
| balance-summary, balance-sheets, stats-by-tier, balance-damage | Carried into balance-tiers and balance-sim (balance-damage's viability section retired) |
| uma-templates, uma-gives, uma-compare | Carried into templates-tiers and templates-umas (the calling pick and the MP re-check retired) |
| uma-profile, variance-profile, variance-templates, variance-two-umas | Retired |
| progression, character-tiers | Carried into progression-tiers and progression-run (the five releases and the stat cells retired) |

## 8. Every call

150 calls, by doc, with the recommended answer (each doc's Decisions table has the alternatives and reasons).

### Classes ([classes.md](classes.md))

| Id | Call | Recommended |
|---|---|---|
| T2C1 | The classes in Tiers 2 and 3 | The eight Tier 1 classes, no new class, lean or hand; every one open from Class Rank 1; no Tier 0 (CV10) |
| T2C2 | What a Tier 0 means later | None exists. A Tier 0 ascends as her suggested promotion; her calling still names her Flourish's family (its own Tier 1 classes, never kin), her trade and her template |
| T2C3 | Class Rank by tier | 1–50, gates 1 · 10 · 20 · 30 · 40, 50 the crown in Tier 3; Ranks 1–10 one shared ladder of 3,600 (the Tier 0's) raising every class she holds, then each class on its own; Class Rank 20 · 30 · 40 · 50 at Lv 16 · 22 · 29 · 36, as … |
| T2C4 | The weapon groups on today's twins | Ring (Greatsword, Axe, Lance · Fire, Ice, Lightning) and Light/Dark (Katana, Bow · Light, Dark), unchanged by v19: each twin set stays inside its group; Light/Dark is D282's secondary weapons and the doubles and volleys |
| T2C5 | The groups' names | One word a group, both channels: "Ring" and "Light/Dark"; the owner's Heavy · Lite · Elemental · Arcane retire (Heavy is a shape, D246, D298 SN6; Arcane a Rift front) |
| T2C6 | Branches for eight classes | By family: ten branches, two a family; mirrored classes share theirs (names, line, crown, mastery), each with her own hand |
| T2C7 | Branch names | Berserker · Warlord; Sage · Augur; Rune Knight · Blademaster; Invoker · Warlock; Guardian · Templar. Augur for the Mage's old "Sorcerer" (now a class, D240); Invoker for "Conjurer" (a master-data skill name); Bishop and Oracle … |
| T2C8 | Branch 1 | Her standard preset's group (two of its three kinds): Ring for six classes, Light/Dark for both Summoners; Ascend preselects it |
| T2C9 | The reverse sets | Brawler Bow, Katana, Greatsword; Sorcerer Light, Dark, Fire; Arms Spellblade Katana, Bow, Dark; Tome Spellblade Light, Dark, Katana; Arms Summoner Axe, Lance, Blizzard; Tome Summoner Blizzard, Thunder, Axe; Paladin Katana, Bow, … |
| T2C10 | The focus | +15% on hits of her group's kinds, a hit's own kind; healers' mends and Barriers from them +15%; on from Class Rank 1; labelled "Ring +15%" (CP39) |
| T2C11 | The class line | One line a branch, her fourth tree, at Class Rank 20 · 30 · 40, cast through a focus weapon (her pair for a hybrid), the depth table's power and MP, Skill Ranks, named "Grand {word}", "Supreme {word}", its capstone; a tile on the … |
| T2C12 | The ten lines | The table in §4.6: Rampage · Skybreaker, Conquest · Sundown, Nebula · Starburst, Quasar · Event Horizon, Sigil · Rune Edge, Bane · Penumbra Edge, Griffin · Kraken, Wraith · Banshee, Edict · Covenant, Solace · Absolution |
| T2C13 | Statuses on the class lines | D282's levels: none for the Brawler and the Sorcerer; the path's 1 · 1 · 2 through a Light/Dark weapon for the hybrids; 2 · 2 · 3 for the healers |
| T2C14 | Line C | Joins the fork at depth 3 by family: the Brawler and the Sorcerer by tree (Rout, Havoc, Tremor, Hail, Fork; Kindle, Sleet, Peal, Beam, Gloom); the Spellblades Swath and Strafe, the Summoners Hunt and Maul, by her half; the … |
| T2C15 | The tip fork | Every line's capstone forks Power or Break: the first weak hit on each foe removes one more shield point, once an act; the only extra chip since Breaker and Shatter retired |
| T2C16 | Equipped slots | Tier 2: one more at Lv 10, 15, 20, 25, 30, 35, 40 (10 at Lv 40); Tier 3: 10 and the master slot at Class Rank 50 |
| T2C17 | Skill MP by tier | ×1.7 and ×2.4 in place of ×tier (A10, measured: the bar grows ×1.72 and ×2.45; casts within 0.3 of Tier 1's for the damage classes, within 1 for the healers) |
| T2C18 | The healing scale by tier | ×(1 + offense ÷ (300 × the tier's multiplier)): 300 · 540 · 780, so an on-curve healer is ×1.64 at every tier's Lv 50 (today 1.64 · 2.16 · 2.68) |
| T2C19 | Two lines held | Tier 3: two of a tree's three lines held (default A and B), each with its tip; Auto picks between them (CP20) |
| T2C20 | Depth 6 | A crown, not a node: at Class Rank 50 in Tier 3 every capstone she holds (her held lines' and her class line's) plays 5.6 whole, +4 MP, one more stack to the cap; its name kept, crowned; her Limit Break reads 5.6 |
| T2C21 | MP back a round | A sixth step with the crown: 6% from Class Rank 50 in Tier 3 |
| T2C22 | Masteries | Five, by family, at Class Rank 50 with the class line's crown: Juggernaut, Resonance, Spellbind, Menagerie, Overflow; Last Stand retires (one healer kit); "Unstoppable" is a master-data skill name |
| T2C23 | The Halls by tier | The same sixteen seats in every world, no new seat; seats and Bonds per world; LB+ +20% at Bond 10 from Tier 2; scales ×0.95 and ×0.8 |
| T2C24 | Buffs and debuffs by tier | D282's three levels hold in every tier; five statuses, +10% a stack, cap 3; no retired status returns; a crown adds one stack |
| T2C25 | Presets by tier | Two a class (branch 1's and branch 2's), each setting her three accessory slots by D266's rule on its weapons, and from a slot's G5 by gear's T2G13 (Great or Twofold forms); a swap offers, never forces |
| T2C26 | The party screen's hint | When a mix drops a kind, name the member whose other set holds it ("No Bow: the Paladin's Light/Dark set holds one"); flip the healer with the magic pair |
| T2C27 | New names | D298's grammar; every one of the 252 new names checked against every master-data string (all ten release files, case-insensitive, exact): no match; none over three words or 21 characters (the longest, Supreme Crescent Fork, 21); … |
| T2C28 | The save | Store her branch per class, line C, the tip, Tier 3's two held lines and the master slot; derive the rest (§7) |
| T2C29 | The engine | One stage, `t2Classes`, at the next free engine; older fights keep ×tier MP and ÷ 300 |
| T2C30 | The old previews | Three pages carry class-overview, class-templates and class-trees; class-weaknesses and the first round's seven retire (§9) |

### Gear ([gear.md](gear.md))

| Id | Call | Recommended |
|---|---|---|
| T2G1 | The partner table | The owner's six Ring rows by name; authored Tier 2: Bow → Greatsword, Katana → Axe, Light → Ice, Dark → Fire; Tier 3: Ring "the other sub weapon", Bow, Katana → Lance, Light, Dark → Lightning |
| T2G2 | The coverage check | Measured on the live dealer and the owner's two parties: a later tier's regulars answered no more than Tier 1's (within 0.1 with best picks), every kind in two hands from Tier 2 |
| T2G3 | Two-kind weapons | One in her slots in Tiers 2 and 3, every class |
| T2G4 | The branch item | No Branch Gem: the weapon's G5 Arms Gem or Tome Ink sets the branch; a re-forge is one more G5 item; the placeholder line retires |
| T2G5 | Whose branch | A branch belongs to the weapon kind, as its grade (D289); the cap is a loadout rule of her active class |
| T2G6 | Suggested Duals | Brawler Greatsword + Bow, Sorcerer Fire + Dark, both Spellblades Thunder + Light, Arms Summoner Bow + Greatsword, Tome Summoner Dark + Fire, Paladin and Cleric Lance + Katana; Tier 3: the Sorcerer's and Spellblades' Evolve, the … |
| T2G7 | Weak multipliers | Base and Dual ×1.3, Pure, Tempered, Evolved ×1.5, Keen ×1.7, a Limit Break ×1.3 (WP6, WP9 kept) |
| T2G8 | Armor by tier | Tier 1's rows × tier (Speed unscaled), her class's half in every tier; the per-piece half retires |
| T2G9 | The accessory tree | A slot's G5 opens two branches a family: Great Pendant · Twofold Pendant; Great Charm · Twofold Charm; Great Orb · Twofold Orb; Great Insignia · Onset Insignia; Tier 3's G5 their step; forms are settings (WP34) |
| T2G10 | Branch values | Tier 2: Great ×1.3 (+1.3 a grade; Orb +2.6; Insignia +1.3%); Twofold +1 ATK and +1 M.ATK; Twofold Orb +1.4 on each of two; Onset +1.5% a grade. Tier 3 step: +0.1 a grade on each (+0.2 on the Orb forms, +0.1% on the Insignias): … |
| T2G11 | Onset | The Insignia's timing branch is Onset Insignia: her first act in each wave |
| T2G12 | ★ on any weapons | From a slot's G5 her ★ family always pays: a Twofold Pendant or Charm gives both stats, so the preset puts her ★ family first on any weapons |
| T2G13 | Presets by tier | From a slot's G5: Great stat, Great stat, Great Orb for the pure classes and the healers; Twofold, Twofold, Great Orb for the four hybrids; her ★ family first; below G5 Tier 1's |
| T2G14 | The kind cap | Orb forms on one kind add at most a G10 weapon's Might × tier (+68 · +122 · +177); the Pendant, Charm and weapon moons sit outside |
| T2G15 | One Insignia factor | Every Insignia slot whose condition holds adds into one factor |
| T2G16 | What a rank costs | 30 refined a line a rank, two Umas, in every tier; no new item; a maxed Uma 753 h at Craft Lv 25 in every tier |
| T2G17 | Ascend | Grades reset, used items go home (D283); weapon branches and accessory forms carry; at G1–G4 a carried branch works at its Tier 2 rate |
| T2G18 | Names | Kept: Pure, Dual, Keen, Tempered, Evolved, partner, Great. New: Great Charm, Twofold Pendant, Twofold Charm, Twofold Orb, Onset Insignia. Retired: Branch Gem, Channel Pendant, Twin Orb, Great Bell, Toll Bell, Onslaught (checked … |
| T2G19 | Screens and art | No new art: a branch chip on the weapon tile and its partner's glyph; branch rows on an accessory slot's list from G5; Suggested first on the G5 sheet |
| T2G20 | Save and engine | Per weapon kind `branch` and `fork`; per slot `form` and `kind2`; the engine stage after v21 for the weak multiplier, partners and Onset; everything else frozen stats |

### Extra Stats ([extra-stats.md](extra-stats.md))

| Id | Call | Recommended |
|---|---|---|
| T2E1 | The tiers' maps | Tier 1's 22 nodes in every tier at × 1.8 and × 2.6 (live); Tier 2 adds one weapon moon (27), Tier 3 a second (32). Nothing else is added to the core |
| T2E2 | Jewels a rank | Three in every tier. The weapon moons sit on the Planet's ranks (Lv 1, 11, 21, 31, 41) and take one Planet Jewel each; the Planet takes 3 · 2 · 1 by tier. The Lapidary's demand an Uma is unchanged: 30 jewels, 150 refined, 50.2 h … |
| T2E3 | A weapon moon's size | Full +4, +7, +10, +13, +16 × tier (Tier 2 +90, Tier 3 +130); Split 0.7 a node, rounded (+63, +91 each) |
| T2E4 | Its kinds | One of her three weapons' kinds, set like an Orb's (D264); a dropped kind is stale, gives nothing and says so; no group moon |
| T2E5 | The kinds list | One tap, D266's pattern: six rows a tier. Tier 2: Full on each weapon, Split on each pair. Tier 3: three Full + Split, three Full + Full, setting both moons; weapon moon 1 is the Full one; Split + Split not offered |
| T2E6 | The kind cap | None: the moons stack with Might and the Orbs. The most on one kind is three Orbs and a Full moon, (60 + 50) × tier, 30% of her offense on it |
| T2E7 | Presets | Tier 2: Split on her Orb's kind (`presetKind`) and her other weapon of the same half. Tier 3: Full on that kind, Split on her other two. Set by the Standard preset and on Ascend |
| T2E8 | Into the fight | The moons' points join `flat` by kind with the Orbs', frozen in the fight's input; no engine bump; never a heal, never a kind |
| T2E9 | Where they sit | On an outer orbit below the core; Tier 1's 22 stars never move. Tier 2: one at (180, 380) on radius 172, chart 360 × 470. Tier 3: two at 90° ± 22° on radius 220, 360 × 500. The live test's checks per tier |
| T2E10 | Figure, colour, crest | A crescent: five stars on 240° of a circle of 48 round its crest, clockwise from I. Steel `#c8d3e0` (weapon moon 1), lavender `#b3a6ff` (weapon moon 2). One crescent-blade crest, ChatGPT's art; a vector stand-in first |
| T2E11 | Its label | Its kinds and count: "Greatsword 3/5", "Greatsword · Axe 3/5"; Tier 2 centred under it, Tier 3 from the left and right edges |
| T2E12 | The Stars tab | "Open n/27" · "/32"; a weapon moons' line in steel under her moon's; its sheet with the strip, its kinds' values, before → after on each kind, "Planet Jewel III ×1", the Kinds row; the Planet's sheet "×2" · "×1" |
| T2E13 | Set all | Its live rule, unchanged: the body furthest behind among those a jewel fits, map order on a tie (the Planet, the weapon moons, then Prowess, Vigor, Guard) |
| T2E14 | The window's Stars track | Reads the tier's map: Tier 2 5 · 11 · 16 · 22 · 27, Tier 3 6 · 13 · 19 · 26 · 32; the steps and the record unchanged |
| T2E15 | Her moon | Two nodes in every tier, opened with the three moons' II and IV, no jewel, × tier (Fleet and Gritty flat); top right on the chart. T2U owns what they hold |
| T2E16 | The save | A version after v38 fills `stars.moons` (one, two); weapon-moon ids by tier; the migration sets her preset and opens weapon moon n wherever Planet n is open |
| T2E17 | The numbers for T2B | This doc's model (§4.9, §5.3) is T2B's input; its simulation replaces it and prices the moons in the tiers' foe term (EP16) |
| T2E18 | Targets and the dot | Targets plan the tier's nodes at their counts (the Planet 3 · 2 · 1); the dot is a jewel she can set now, as built |
| T2E19 | The corner | The top-left corner stays free in every tier, for a later body |
| T2E20 | Prowess for later classes | A class branch splits Prowess as its class does; a branch that changes the class's Arms-to-Tome make-up takes its own split, named by T2C |

### Professions ([professions.md](professions.md))

| Id | Call | Recommended |
|---|---|---|
| T2P1 | The five-line rule | One rank on two Umas (3 Arms + 3 Tomes) is 30 refined on each line in Tiers 2 and 3, as D264 made Tier 1; any tier's new piece fits inside its line's 30 or adds the same to all five |
| T2P2 | Amounts by tier | Recipes, counts, steps and sizes don't scale: a maxed Uma 140 items, 750 refined, 753 job-hours in every tier; only what an item raises scales (×1.8, ×2.6) |
| T2P3 | Materials by tier | The same fifty pairs, G1–G10, in every world (FL8); no tier pairs, no ladder |
| T2P4 | Recipes by tier | Arms Gem and Tome Ink 10, Armor Fittings 3, Accessory Setting 5, Planet and Moon Jewels 5, each of its own grade, in every tier |
| T2P5 | Weapon branches | No Branch Gem: the weapon's G5 Arms Gem or Tome Ink picks its branch when used; a re-forge takes one more G5 item of its line; `branch-gem` retires. If T2G keeps an item, it costs exactly its G5 item at its weapon's forge |
| T2P6 | Accessory branches | No item (WP34): Settings stay 5 Fillets a grade |
| T2P7 | The weapon moon's cost | The farm asks T2E to open a weapon moon's nodes with the core moons' nodes, as her moon's open (D264 call 6), so a rank still sets three jewels |
| T2P8 | Steps by tier | 24 → 16 minutes by Craft Level, ×1.25 at every place, one step a gather, a process or a refined item in a make, in every tier |
| T2P9 | Craft Level by tier | Restarts at Lv 1 on Ascend; the same curve (88,200 EXP to Lv 50, 24.5 days nonstop) and gates (5g − 4); Craft V at Lv 50 in each tier's window |
| T2P10 | Sizes by tier | D273's rule in every tier: gather or process ×1–×30, makes to 30 steps, every forge's longest job 9h 36m · 8h 02m · 6h 24m at Craft Lv 1 · 25 · 50; three queued |
| T2P11 | Places and slots | Fifteen places, four slots each, ×1.25, no upgrades, the same map with the tier's tint; no new building art |
| T2P12 | The secondary | From Tier 2, each Uma may hold one secondary line, all three of its places |
| T2P13 | The top stays her trade's | G9 and G10 of every line are her trade's alone; a secondary works G1–G8, in Tiers 2 and 3 |
| T2P14 | The pick | On her Template tab's calling-and-trade row, a sheet of four lines; free, any time she isn't working at one of its places; none in Tier 1; cleared on Ascend |
| T2P15 | Suggested | The sheet marks the line with the fewest hands for its work: trade Umas plus secondaries, over a full window's refined from it (Metal and Vegetables 250, the rest 150); ties by the Wilds' order |
| T2P16 | Pickers and words | Who lists "Her trade", then "Secondary", then the rest greyed "Another trade"; a G9 or G10 job greys secondaries "Main trade only"; targets offer the trade first; the Stable gains a Secondary facet |
| T2P17 | The open shop with secondaries | A line with no Uma of its trade opens every grade to everyone; once one arrives, G9 and G10 are hers |
| T2P18 | The Exchange by tier | Raw only; G1–G5 20 × tier after the tier's first win, G6–G10 53 × tier after a win on its continent 3 (continents 8 and 13); selling × tier |
| T2P19 | Tickets by tier | Speed and Sweep Tickets × tier (20 · 30, 30 · 45), as T2W10; Class Manual 1,000 Class Marks in every tier (reconciled) |
| T2P20 | Drills and the farm | Drills pay no Craft EXP in any tier (T2W owns Drills) |
| T2P21 | Two yardsticks | Report a maxed Uma (750 refined, every line 150) and a full window (950, the weapon lines 250 on a roster's average); the full window is the ascend number |
| T2P22 | The full window's weapon work | In Tiers 2 and 3 the secondary carries it; recipes stay. Tier 1 stays as built (forty at today's callings: 0.84 full windows a day, Metal and Vegetables binding; a seam, below) |
| T2P23 | Tier 3 | Tier 3 runs Tier 2's farm: the same secondary (G1–G8), no second secondary, no materials of its own |
| T2P24 | Ascend and the farm | She arrives at Craft Lv 1 with no secondary; the made items her grades used go back to the old world's Warehouse, her jewels are gone (as live) |
| T2P25 | Save and engine | One optional field, `OwnedUma.secondary`, in Tier 2 and 3 worlds at Tier 2's toolbox save; the work gate reads it; no battle engine change, no migration |
| T2P26 | The ledger | `professions-v4.sim.ts` gains the full window, today's callings' split and a secondary roster when Tier 2 is built |

### Balance ([balance.md](balance.md))

| Id | Call | Recommended |
|---|---|---|
| T2B1 | Every source keeps its share | Every flat value (armor, Might, Pendant, Charm, Orb, Extra Stats, ★ and every new Tier 2–3 flat source) is Tier 1's × 1.8 and × 2.6; percentages stay; a new source joins §2.2's table before it ships |
| T2B2 | The yardstick is the engine | Every Tier 2–3 number is measured on the harness (`balance-t2.test.ts`); an analytic estimate only sizes a knob |
| T2B3 | A later tier's Class Rank pace | Ranks 1–10 in a later world are one shared ladder of the Tier 0's Class EXP (3,600) raising every class she holds, so depths open at Lv 10 · 16 · 22 · 29 in every tier (T2C3, reconciled) |
| T2B4 | Tier 2's term | Foes' HP and DEF × (1.08 + 0.20 (ℓ − 1) ÷ 49), offense × (1 + 0.10 (ℓ − 1) ÷ 49); provisional until §4.9 sets it |
| T2B5 | Tier 3's term | × (1.12 + 0.30 (ℓ − 1) ÷ 49), offense +10% by Lv 50; provisional |
| T2B6 | Bosses | The term × 1.1 on bosses' HP and DEF in Tiers 2–3 |
| T2B7 | Shields by answers | Regulars by formation in every tier; sub-bosses 6 · 7 · 7 and bosses 8 · 9 · 10, the steps from the breadth gate; Keys, guards and escorts as Tier 1's; Tier 1's in every tier if there is no two-kind weapon |
| T2B8 | Weaknesses in Tiers 2–3 | WK8's three kinds by role from the breadth gate, Tier 1's 2 + 2 before it (Tier 2 Lv 1–20); without T2G's two-kind weapon, 2 + 2 in every tier; WK12's checks in every tier plus ≤ 10% idle stages at every level |
| T2B9 | The Rift by tier | Draws by front in every tier; a Tier 2 front takes the world's term and `RIFT_TUNING_V19`'s scales; the Duel's shields are the best act's or Limit Break's chips + 3, at least 13, re-counted on T2C's trees; Tier 3's Rift, if T2W … |
| T2B10 | Skill MP by tier | × 1.7 in Tier 2 and × 2.4 in Tier 3 (round(round(MP × hand) × factor), at least 1), at the engine stage; the code's × tier goes |
| T2B11 | The base regen | 1% of her bar a depth, five at most in Tiers 1 and 2; Tier 3's crown adds a sixth step, 6% (T2C21, reconciled) |
| T2B12 | Statuses | Tier-free: +10% a stack (foes' 15%), cap 3, two rounds, Burn 4%; any new status keeps the step and the cap; D282's three levels carry unless T2C widens them |
| T2B13 | Limit Breaks | Tier-free: power × scale × open depth's power, at most 10 hits on one foe, gauge 12; the Bond restart priced by the harness's ramp |
| T2B14 | The damage stack | WP31's steps; Tier 2–3 multipliers land in steps 3–4; ceilings on one weak hit ×1.69 · ×2.24 · ×2.54 before statuses; no cap |
| T2B15 | Defense | Armor as it is: a regular's 100% hit 19.0 · 18.4 · 18.2% at Lv 50, about 21% with the terms' offense; armor's HP a grade the knob |
| T2B16 | The mirrors | Classes v3's bands carry into every tier (Arms ÷ Tome ±5%, Spellblades ÷ Summoners 90–110%, 70/30 ± 5); the hands first, then T2C's class skills; no hand moves for Tiers 2–3 before the toolbox is measured |
| T2B17 | The healers | Paladin ÷ Cleric within ±10% in every tier (today 99–106%); T2C's healer branches keep one shared kit |
| T2B18 | The simulation's checklist | §4.9's thirteen checks, bands and knobs, against the Tier 1 reference row |
| T2B19 | Accessory viability by tier | D266's rule for every Tier 2–3 form: no mix best in over half the cases, every family someone's best, re-run at Tier 2 and 3 Lv 50; parity holds by construction (Pendant and Charm mirror) |

### Templates ([templates.md](templates.md))

| Id | Call | Recommended |
|---|---|---|
| T2U1 | This doc | This doc owns Uma uniqueness in Tiers 2 and 3 and the template's budget; the manual owns Tier 1 as built; UT1–UT20 carry here with a status (§3); uma-templates.md goes to the archive with the set |
| T2U2 | The pieces | Five pieces, no sixth: her calling, the ★ Flourish, the ★ signature, ★ her moon and, from Tier 2, the ★ signature tip; UT2's "never" list kept |
| T2U3 | Her calling in a later world | The Tier 0's word stays her calling as a family name: it names her type, trade, moon II's root and her family; a new Uma starts as her suggested promotion at Class Rank 1; she arrives at Ascend as her class (from a Tier 0 her … |
| T2U4 | Her family in a later world | Her Tier 0's own Tier 1 children: Warrior 3, Spellblade 2, Healer 2, Summoner 2, Mage 3; kin outside; a class branch is not a class |
| T2U5 | The Flourish by tier | 4% of her max HP a fight in every tier, the same three shapes; her HP carries the tier (a Brawler 58 · 101 · 144 HP at Lv 50) |
| T2U6 | The signature by tier | 0.1 a level × 1.8 and × 2.6, at least 1: +9 and +13 at Lv 50; any form or branch of her family at G1+; one ★ however many slots |
| T2U7 | Her preset's ★ | D266's rule below a slot's G5; from a slot's G5 her family's Twofold form gives both stats ([gear](gear.md) T2G12), so her ★ goes first for everyone (reconciled): below G5, her family first only when her weapons can use it, in … |
| T2U8 | Her moon by tier | Two nodes, no jewel, × tier: I +4 · +7 · +10 points on her knack's stat (Fleet and Gritty shares flat), II +8 · +14 · +21 on her calling's root (All-Rounder ⌊÷ 2⌋ DEF, the rest M.DEF); opening with the shared moons' II and IV, … |
| T2U9 | The tip's anchor | Her lead weapon's tree (her first slot, always her lead channel), depth 5's tip fork, a third option beside Power and Break, on the line she holds; the class branches never move it; never on her class tree |
| T2U10 | Her lead weapon | Her class preset's first slot (D263): Brawler Greatsword, Sorcerer Fire Tome, Arms Spellblade Katana, Tome Spellblade Thunder Tome, Arms Summoner Bow, Tome Summoner Dark Tome, Paladin Lance, Cleric Light Tome; in a class branch … |
| T2U11 | The three tips | Re-cut on today's shapes: Quickstep (Dash) two more hits on her target at the same total; Spillover (Middle) the volley's splash, 0.35 on every foe but her target, +2 MP; Long guard (Stayer) a Barrier on herself of 10% of her max … |
| T2U12 | Reordering | The ★ follows her first slot; a ★ pick on a tree that stops being first, or outside her family, plays as Power and waits, and returns when it is first again |
| T2U13 | Tier 3 | The ★ at both tip forks of her lead tree (two lines held); a capstone built on a ★ tip keeps its ★ effect; the master slot may hold it; no ★ on her other two trees |
| T2U14 | The budget | The measured sizes stand: the ★ adds about +2% damage a turn at Lv 50 in every tier (+1.0–3.6 · +0.5–3.3 · +1.3–3.4%); matched with her family's swap +1.2 · +1.3 · +1.5% on average; a matched party takes 4–6% less from Lv 30; the … |
| T2U15 | The dial | Unchanged: the signature's rate a level (0.1 now, about +2%; 0.2 about +4% if the owner wants a stronger edge), never a new piece and never the foes; the tips' knobs (§4.7) only if the simulation finds one hot |
| T2U16 | How it shows | One more ★ row on the Template tab (★ Tip: Picked, Not picked, "R40 first", "Off · as Sorcerer"), opening the Class tab's tip node; the fork draws "Power · Break · ★ Quickstep", the ★ dashed until picked; no dot; the Stable … |
| T2U17 | Save | Nothing about the template stored; the ★ tip is a third value of T2C's tip pick (default Power); her moon's ids as built; no migration |
| T2U18 | Engine | The tips are data on rules that exist (spread hits, the volley's splash, a Barrier, with a self-target the one new step), in Tier 2's class engine; the other pieces need nothing (already × tier) |
| T2U19 | Names | Quickstep, Spillover and Long guard kept; no new name coined. Every template word (the 15 types, the 5 knack words, the 3 Flourishes, the 3 tips) checked against every string of today's master-data release (10 files, 18,227 … |
| T2U20 | Professions and the party | Her calling names her primary trade in every tier (CV20); nothing to the secondary profession (T2P), no Craft bonus, no party synergy |

### Progression ([progression.md](progression.md))

| Id | Call | Recommended |
|---|---|---|
| T2W1 | The Tier 2 world's shape | Tier 1's on continents 6–10, with capitals v2 and the honeycomb live first: 48 regions, 24 parties, six Springs, six capital runs a continent; no Tier 2 world packet before H162 and H166 |
| T2W2 | Continent leans by tier | Tier 2 Jungle, Sky Isles, Glacier, Volcano, Underworld (Z1); Tier 3 Swamp, Highlands, Geyser Basin, Storm Peaks, Ancient Ruins; a tier's leans change only while no world of it holds a won stage |
| T2W3 | Face packs by tier | Tier 1's totals, arranged anew each tier: Tier 2 Z7's (the middle pack opens it, the small returns twice, the large closes it); Tier 3 a third (the small holds `w13` whole) |
| T2W4 | Does Tier 3 get a Rift | Yes: the same shape at T3 Lv 50, its own seals and Rift Conquered · Tier 3, the Rift step (every board 36), Trials with it; nobody ascends from it while Tier 3 is the top tier: a full Tier 3 window is the end of her collection, … |
| T2W5 | The Rift's fronts in Tiers 2 and 3 | Z9's one added test a front, re-aimed at today's toolbox (Iron shields +2 and one or two Arms; Arcane one element a foe, leaders and guards apart; the Duel's boss three acts from stage 9; the Horde five to seven a wave); Tier 3 … |
| T2W6 | Trials and Drills by tier | Unchanged in every tier: Trials at the tier's Lv 45, 50, 55, opening with its Rift; Drills at its Lv 10–50, 2–6 Logs, ten runs a day banked to thirty, opening with its first map win; Logs and Marks stay in their world |
| T2W7 | Windows by tier | One board, 36 steps in every tier; Class I a Tier 1 class at R10 from Tier 2; World n a won capital run; the Stars steps count the tier's whole map, weapon moons included (Tier 2: 5 · 11 · 16 · 22 · 27; Tier 3: 6 · 13 · 19 · 26 · … |
| T2W8 | Ascend with a toolbox | Settings carry, progress restarts: her class and its class branch, her accessory families, kinds and forms, her weapon branches (with T2G17: at G1–G4 a carried branch works at its Tier 2 rate) and her weapon moon's setting carry; … |
| T2W9 | Ascending into an empty world | The Ascend sheet says when the new world would hold fewer than five ("3 of 5 to fight in Tier 2"); no rule change |
| T2W10 | Prices by tier | Speed and Sweep Tickets × tier (20 · 30 in Tier 2, 30 · 45 in Tier 3) and the purse's Laurels × the tier she arrives in (2,000, 3,000), so a Laurel buys the same time in every tier; Marks, Manuals and Logs untiered |
| T2W11 | When the toolbox opens | No new gates: every Tier 2 and 3 addition opens on its system's gate (Class Rank, a grade's levels, a node's jewel and level) |
| T2W12 | A run's pacing target | Tier 1's time, her Craft the clock: a party's windows in about 32 days nonstop (40 at 80%), a first run of twenty in about 32 with the secondary, a 24-party world's Wilds in about 64; fights about 130 wins a party; T2P meets the … |
| T2W13 | The fifteenth scenario's capital | Its own four authored Finals routes (original names, checked against the release), with Tier 3's world packets |
| T2W14 | A sixteenth scenario | Tier 4 stays closed: it shows "Tier 4 locked" and joins no world until the owner opens Tier 4; Tier 3's Rift step completes her window only |
| T2W15 | The version plan | The worlds first on today's engine (leans, packs, prices, Tier 3's Rift), then the toolbox as one release a tier: Tier 2 at engine v22 and save v39, Tier 3 at v23 and v40, each dark behind its switch |
