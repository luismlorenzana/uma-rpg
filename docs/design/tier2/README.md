# Tier 2 and Tier 3: the brief

> **Status: round 2 (the owner's requirements) drafted, measured and cross-referenced, 2026-11-05; for the owner's review.** The owner: "start working seriously in some Tier 2 docs that would greatly expand our
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

**2026-11-05: round 2 drafted, measured and cross-referenced; ready for the owner's review.** Round 1 (2026-11-04)
carried the old drafts onto Tier 1; round 2 is the owner's requirements (§9).

| Doc | Current calls | Superseded by round 2 | Pages |
|---|---|---|---|
| [classes.md](classes.md) | 57 | — | [tiers](previews/classes-tiers.html) · [the sixteen](previews/classes-branches.html) · [trees](previews/classes-trees.html) · [comps](previews/classes-comps.html) · [promotion](previews/classes-promotion.html) |
| [gear.md](gear.md) | 26 | — | [tiers](previews/gear-tiers.html) · [weapons](previews/gear-weapons.html) · [accessories](previews/gear-accessories.html) · [costs](previews/gear-costs.html) · [presets](previews/gear-presets.html) |
| [extra-stats.md](extra-stats.md) | 42 | 11 | [chart](previews/extra-stats-chart.html) · [tiers](previews/extra-stats-tiers.html) · [branches](previews/extra-stats-branches.html) · [kind rows](previews/extra-stats-weapon-moons.html) |
| [professions.md](professions.md) | 38 | 7 | [tiers](previews/professions-tiers.html) · [branches](previews/professions-branches.html) · [times](previews/professions-times.html) · [demand](previews/professions-demand.html) · [three professions](previews/professions-secondary.html) |
| [balance.md](balance.md) | 43 | 1 | [tiers](previews/balance-tiers.html) · [the guardrail](previews/balance-sim.html) · [comps](previews/balance-comps.html) · [stress](previews/balance-stress.html) · [calls](previews/balance-calls.html) |
| [templates.md](templates.md) | 22 | 5 | [tiers](previews/templates-tiers.html) · [tip](previews/templates-tip.html) · [Umas](previews/templates-umas.html) |
| [progression.md](progression.md) | 29 | 3 | [tiers](previews/progression-tiers.html) · [world](previews/progression-world.html) · [run](previews/progression-run.html) · [the Ascend sheet](previews/progression-ascend.html) · [windows](previews/progression-windows.html) |

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
| XR14 | Balance's knobs against classes' drafted kits (the supports +18 to +50%, the Battlemage short) | **Balance's values** in classes: Momentum 6%, the cross Spellfist ×1.05 · Battlemage ×1.3, supports' statuses 1·1·1·2·2 topped up and their hands 0.95 · 0.8 · 0.95 · 1, the Spellblade and Summoner keepers' hands +0.03 a half: 34 of 36 cells in the band | classes T2C34–T2C39, T2C45 ← T2B24–T2B29 |
| XR15 | Tier 2's pace: ready about day 33.5, or professions' doubled farm | **The doubled farm:** a first cohort of twenty working for itself fills its windows in about 63.6 days; the fighting party holds G10 on day 23.4 (Tier 1 23.0); forty at work, 31.8 | progression T2W12, T2W32 ← T2P40, T2P41 |
| XR16 | The classes open to her: fixed at the Ascend, or widened | **Classes' door** widens them: a held Tier 2 class at Class Rank 20 opens her parent's reclass neighbours' children | progression T2W17 ← T2C48 |
| XR17 | The window's Craft step: her best profession at Lv 50, or the sum of three | **The sum to 60**, so the step reads all three professions | professions T2P42 ← T2W26 |
| XR18 | Armor's Tier 2 path (a lining to her other half) | **None:** the Armor Lining carries the armor's tier step | professions T2P30 ← gear T2G29 |
| XR19 | Tier 3 bosses' shields 10 | **9 in Tiers 2 and 3, sub-bosses 7, from Lv 1** (one two-kind weapon, types from the promotion) | progression ← balance T2B7, gear T2G27 |
| XR20 | The cross-wielders' kits: classes' Heavy twins or gear's Scatter twins | **The Scatter twins** (Spellfist Greatsword, Axe, Thunder; Battlemage Fire, Blizzard, Lance): every kind in two hands in C3; Thunder missing in 8 of the 64 mixes, named by the party hint | classes T2C54 ← balance T2B35, gear T2G25 |
| XR21 | The Stars track's node count | **22 in every tier:** round 1's weapon moon became Prowess's kind rows | progression ← extra stats T2E27 |

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

257 current calls, by doc, with the recommended answer. Each doc's Decisions table has the alternatives and the reasons, and lists the round-1 calls round 2 superseded.

### Classes ([classes.md](classes.md))

| Id | Call | Recommended |
|---|---|---|
| T2C2 | What a Tier 0 means later | None exists in a later world; a Tier 0 at her Ascend arrives as her Suggested Tier 2 class (T2C50); her calling still names her family, trade and template |
| T2C3 | Class Rank by tier | 1–50, gates 1 · 10 · 20 · 30 · 40, 50 the crown in Tier 3; Ranks 1–10 one shared ladder of 3,600 raising every class she holds (XR1), then each alone; depths at Lv 10 · 16 · 22 · 29, Rank 50 at Lv 36; two classes to Rank 50 a … |
| T2C4 | The words Ring and Light/Dark | Kept as words for where statuses ride: the Ring weapons carry the healers' every-skill statuses, the Light/Dark weapons the paths and the supports'; no focus |
| T2C5 | The groups' names (the owner's call) | "Ring" and "Light/Dark", against the owner's Heavy · Lite · Elemental · Arcane (Heavy is a shape, Arcane a Rift front); listed for the owner |
| T2C11 | The class line | One a Tier 2 class, mirrors share; her fourth tree at Class Rank 20 · 30 · 40, cast through any of her weapons (Auto: the weak one), the depth table's power and MP, Skill Ranks |
| T2C12 | The ten lines | Re-homed on the sixteen (T2C52) |
| T2C13 | Statuses on the class lines | By her class's level: none, a path's 1 · 1 · 2, a support's or healer's 2 · 2 · 3, a Guardian's or Bishop's 3 · 3 · 3; a support's topped up and her Brave and Faith on her ward, as her trees' (follows T2B24, cross-reference) |
| T2C14 | Line C | Joins the fork at depth 3 by family, on her parent's trees: Rout, Havoc, Tremor, Hail, Fork; Kindle, Sleet, Peal, Beam, Gloom; Swath, Strafe; Hunt, Maul; Psalm |
| T2C15 | The tip fork | Every capstone forks Power or Break: the first weak hit on each foe removes one more shield point, once an act |
| T2C16 | Equipped slots | Tier 2: one more at Lv 10, 15, 20, 25, 30, 35, 40 (10 at Lv 40); Tier 3: 10 and the master slot |
| T2C17 | Skill MP by tier | ×1.7 and ×2.4 in place of ×tier |
| T2C18 | The healing scale by tier | ×(1 + offense ÷ (300 × the tier's multiplier)): ×1.64 at every tier's Lv 50; the supports' Barrier and mend take it |
| T2C19 | Two lines held | Tier 3: two of a tree's three (default A and B), each with its tip; Auto between them |
| T2C20 | Depth 6 | A crown: at Class Rank 50 in Tier 3 every held capstone plays 5.6 whole, +4 MP, one more stack; its name kept |
| T2C21 | MP back a round | A sixth step, 6%, with Tier 3's crown |
| T2C22 | Masteries | Five, by hall family, at Class Rank 50 in Tier 3: Juggernaut, Resonance, Spellbind, Menagerie, Overflow (T2C58) |
| T2C23 | The Halls by tier | The same sixteen seats in every world; home classes the Tier 1 home class's children; scales by parent; LB+ +20% at Bond 10 |
| T2C25 | Presets by tier | One a Tier 2 class (T2C54), setting her three accessory slots by D266's rule and gear's forms; a switch offers, never forces |
| T2C26 | The party screen's hint | Re-homed: T2C63 |
| T2C27 | Names, round 1 | Kept: round 1's 252 checked; round 2's in T2C59 |
| T2C28 | The save | T2C60 |
| T2C29 | The engine | T2C61 |
| T2C30 | The old previews | Three pages carry class-overview, class-templates and class-trees; the rest retire (§10) |
| T2C31 | The classes in Tier 2 | Sixteen: a Keeper and an Expander from each Tier 1 class (R2-2). A Tier 2 world plays only them; the Tier 1 classes stay in Tier 1's world, as the Tier 0s do |
| T2C32 | Their names | Berserker · Spellfist; Archmage · Battlemage; Blademaster · Sentinel; Runeblade · Enchanter; Warlord · Druid; Invoker · Shaman; Guardian · Templar; Bishop · Exorcist (checked, §11) |
| T2C33 | What a Tier 2 class keeps | Her parent's three slots' count, lean, armor half, trees, family, hall, Limit Break scale and one act a turn; one rule changes her |
| T2C34 | The self-buff | Momentum, the pure keepers': +6% a stack on her own hits, a stack after each of her turns, 3 at most (+18%), the fight long, lost when she falls; never a party buff; Auto unchanged. Worth +11.3% of her damage at Lv 50 (+9.1% … |
| T2C35 | The pure expanders | Spellfist two Arms and a Tome, Battlemage two Tomes and an Arm; every hit reads her stat; a hit keeps its kind's channel for defense, weakness, statuses and the ward; hands the Spellfist ×1.05, the Battlemage ×1.3 (measured +6.5 … |
| T2C36 | Their gear | Her parent's armor half; her stat's accessory (Pendant, Charm) counts on every hit; Prowess all to her stat; her other channel's weapon grades with its own items |
| T2C37 | The Spellblade keepers | Blademaster and Runeblade: her familiar's extra hit on both halves (the same total), and it pierces; hands +0.03 a half: 0.75 + 0.47 and 0.75 + 0.51 (lead first) (measured +9.0 · +4.5 · +3.6% and +6.8 · +2.3 · +2.8%). Amended by … |
| T2C38 | The Summoner keepers | Warlord and Invoker: both summons linger, two farewells at her next pair; hands +0.03 a half: 0.60 + 0.49 and 0.60 + 0.53 (lead first) (measured +8.6 · +2.0 · +6.8% and +8.6 · +3.6 · +3.0%). Amended by T2B29 (cross-reference) |
| T2C39 | The support expanders' kit | Hands of her parent's: the Sentinel ×0.95 (0.68 + 0.42), the Enchanter ×0.8 (0.58 + 0.38), the Druid ×0.95 (0.54 + 0.44), the Shaman ×1 (0.57 + 0.5); every skill of her Katana, Bow, Light and Dark trees carries its status at 1 · … |
| T2C40 | The Spellblade supports' Barrier | After each skill act, a Barrier on the most threatened: a third of the healers' share at her act's depth (9–15%), × her healing scale |
| T2C41 | The Summoner supports' mend | Her farewell mends every Uma a tenth of the healers' mend share at its depth (2.8–4.4%), × her healing scale; no Rescue, cleanse or revive |
| T2C42 | Supports and the one-healer rule | They are no healer: a support beside a healer is legal, two healers still are not; a party with no healer is legal too: one healer a party is a ceiling, not a floor (T2B39, cross-reference) |
| T2C43 | The healer keepers | Guardian and Bishop: every status she lands one stack more, to 3 (2 · 2 · 3 · 3 · 3; path 3 · 3 · 3); Surge gives ×1.15 where her status is at 3. Worth +0 to +6% on curve; the attrition pick, ahead of her battle healer in fights … |
| T2C44 | The battle healers | Templar and Exorcist: power ×0.6, MP ×0.7, mends and Barriers ×0.7 the shares (Rescue and the revive kept), Tier 1's statuses; still the one healer. Measured +12.1 · +9.7 · +5.7% and +15.9 · +6.9 · +7.3% on curve, behind the … |
| T2C45 | Statuses by class | Four levels: none (the four pures), a path (the hybrid keepers), support (the hybrids' expanders, new: 1 · 1 · 1 · 2 · 2, topped up to its stacks, Brave and Faith on her ward), widely (the healers, the keepers +1); five statuses, … |
| T2C46 | The Tier 2 promotion | On her Ascend she picks among both children of every Tier 1 class she holds at Class Rank 50 (at least 6); Suggested: her ascending class's keeper, else her family's own Rank 50 class's keeper with the most Class EXP |
| T2C47 | Switching and Class Rank | Every open class held from arrival at Class Rank 1; switch free outside fights; each its own Class Rank; XR1's shared ladder raises all to 10 |
| T2C48 | Opening more in Tier 2 | The door: a held Tier 2 class at Class Rank 20 opens the children of her parent's reclass neighbours (D290, D291's map), about the Tier 1 door's 3,600 Class EXP |
| T2C49 | Kin and the Flourish in Tier 2 | Her family is the Tier 2 children of her calling's own Tier 1 classes (Warrior and Mage 6, the others 4); a kin parent's child is never Suggested and outside her Flourish |
| T2C50 | A Tier 0 at her Ascend | Arrives as the Suggested rule's class (Class V guarantees three Tier 1 classes at Rank 50) |
| T2C51 | Whose trees | A Tier 2 class plays her parent's trees; the Spellfist's Tomes the Sorcerer's, the Battlemage's Arms the Brawler's; no new tree or skill name |
| T2C52 | The class lines | Round 1's ten on the sixteen, mirrors sharing: Rampage (Berserker), Conquest (Spellfist), Nebula (Archmage), Quasar (Battlemage), Sigil (Spellblade keepers), Bane (Spellblade supports), Griffin (Summoner keepers), Wraith … |
| T2C53 | Line C on the sixteen | Her parent's tree's C; the healers' Psalm kept (reach every Uma from depth 3) |
| T2C54 | Presets | Keepers wear their parent's; the Spellfist Greatsword, Axe, Thunder and the Battlemage Fire, Blizzard, Lance (gear's Scatter twins, T2G25); Sentinel Katana, Greatsword, Light; Enchanter Light, Blizzard, Katana; the Druid her … |
| T2C55 | Limit Break scale | Her parent's: ×0.95 the twelve damage and support classes, ×0.8 the four healers. Confirmed by balance (cross-reference) |
| T2C56 | Party value | Measured on the harness (T2B21): V = D + S in BT a round; D her damage a round of the fight, S what the other four lose when her statuses, mends, wards and keeper twist are off; a class's gain the party's damage a round with her … |
| T2C57 | Tier 3 | No new class: the sixteen deepen (two lines, crowns, the master slot, the mastery); every Tier 2 class she held is open there; the door as Tier 2's |
| T2C58 | Masteries on the sixteen | By hall family, the same for both children of every parent; Menagerie's two pairs carry a support's mend twice; Overflow on all four healer classes. Measured as drafted: the crowns and masteries +17% at Tier 3 Lv 50, every comp … |
| T2C59 | Round 2's names | Checked against every master-data string and the game's own: clear (§11); Crusader, Fervor, Ranger, Archon, Mystic, Warden, Vanguard, Champion refused |
| T2C60 | The save | Sixteen class ids with their parent; `open` on a later-tier profile; per held class Tier 1's record plus line C, tips, Tier 3's held lines and the master slot; Momentum is fight state; an Uma already in a later world becomes her … |
| T2C61 | The engine | One stage, `t2Classes`, after v21: the sixteen kits, Momentum, class lines, line C, Break tips, crowns, masteries, LB+, MP ×1.7 · ×2.4, the healing divisor |
| T2C62 | The previews | Five pages: tiers, the sixteen, trees, comps (new; the measured comps beside the model), promotion (new) |
| T2C63 | The comps and the party hint | Eight comps (and Party 2's C4b), C1 and C2 the reference, measured by balance: every Tier 2 comp +1.7 to +9.3% over its Tier 1 party at Lv 10 · 30 · 50, C8 +9.9 · +6.9 · +24.6% in Tier 3 (§5.3); the party screen names an open … |
| T2C64 | Where the band is read | On curve at Tier 2 Lv 10, 30 and 50: each of the twelve damage and support classes' gain within ±5 points of the twelve's mean gain at that level (measured at the knobs +7.0 · +3.9 · +3.2%; 34 of 36 cells in; the Sentinel's Lv 10 … |

### Gear ([gear.md](gear.md))

| Id | Call | Recommended |
|---|---|---|
| T2G21 | Types at promotion | On the Ascend sheet her new class's three weapons and each one's type, Suggested pre-set (T2W19); she arrives at G0 with them, and a type works from G0 |
| T2G22 | The swap rule | Free: one tap on the Gear tab, outside fights; no item, lock or cooldown; nothing on screen tailors a stage |
| T2G23 | Whose type | Her class's slot setting; the grade stays the weapon kind's (D289) |
| T2G24 | Tier 2's types | Pure ×1.30 → ×1.50 and Dual (its own kind ×1.30, its partner ×1.10 → ×1.30), +0.02 a grade from the Whetstone or Reagent; no plain weapon |
| T2G25 | The expanders' cross weapons | Any kind of a slot's channel; a kind's grade gives its Might to the stat she reads (ATK for the Spellfist's Tome, M.ATK for the Battlemage's Arm); its own channel's items raise it; the kits are classes' (T2C54); gear's … |
| T2G26 | Suggested types | The table in §4.4 on classes' presets: one Dual a class, the rest Pure; the keepers round 1's; Spellfist Greatsword + Bow, Battlemage Fire + Dark, Sentinel and Enchanter Katana + Axe, Druid and Shaman Dark + Fire, the battle … |
| T2G27 | Coverage | Measured on classes' comps: Tier 2 4.17–4.32 a regular (C1, C2 4.28 · 4.29 with every kind in two hands; the expander comps one to three kinds in one hand), Tier 3 4.14–4.38; sub-boss and boss shields +1 from Tier 2 Lv 1 |
| T2G28 | Tier 3's types | Keen ×1.50 → ×1.70, Tempered and Evolved ×1.30 → ×1.50 on both kinds; picked on the Tier 3 Ascend sheet, pre-filled (Pure → Keen, Dual → Tempered); swapped freely; no lineage |
| T2G29 | Armor | Tier 1's × tier on her class's half (an expander's one stat); no Tier 2 path; the Armor Lining carries the rest of the × tier |
| T2G30 | The tree's shape | Every form its family's base plus one rider (Kindred its whole row); rings at a slot's G1 and G5 in Tier 2, the step from G1 and a ring at G5 in Tier 3; a form is a free setting, one tap |
| T2G31 | The stat family | Great +0.3 (Tier 3 0.4) on her stat; Twofold +1 (1.1) on her other stat; Kindred her +1 shared, +0.2 on every Uma (no step); Vow (Tier 3, G5) +1 on her mends, Barriers, revives |
| T2G32 | The Orb family | Great Orb +0.6 (0.8) on her kind; Twofold Orb +0.8 (1.0) on a second kind; Seeker +0.4 (0.6) on any weak hit; Limit Orb (Tier 3, G5) +1.3 on her Limit Breaks' hits |
| T2G33 | The Insignia family | Great Insignia +0.3% (0.4%); Onset +0.6% (0.7%) on her first act each wave; Finisher +0.4% (0.6%) on foes below half HP; Apex (Tier 3, G5) +0.8% on bosses |
| T2G34 | Kindred's reach | Every Uma's hits, herself included, both stats, never a heal; the party takes its strongest Kindred, never the sum; frozen when the fight starts |
| T2G35 | ★ by tier | Any form of her ★ family counts; from her first Tier 2 grade her family's Twofold pays on any weapons, so her ★ goes first for everyone |
| T2G36 | Presets for sixteen | §4.8: Great ×2 + Great Orb for the one-stat classes and the healers; Twofold ×2 + Great Orb for the hybrids; the supporters Kindred, Twofold, Great Orb from a slot's G5; the keeper healers Vow, Great, Great Orb from Tier 3's G5; … |
| T2G37 | The kind cap | The Orb family on one kind (every base, the Great and Twofold Orbs, Seeker's and Limit Orb's riders when they land) at most +68 · +122 · +177 |
| T2G38 | One Insignia factor | Every Insignia slot whose condition holds adds into one factor, bases and riders alike |
| T2G39 | What types and forms cost | Nothing; a kind never raised is at G0 |
| T2G40 | The second items (R2-9) | Aligned with T2P29: every Tier 2 grade takes its line's two items; the Whetstone or Reagent raises the weapon's type, the Lining armor's tier step, the Inlay the worn rider |
| T2G41 | Ascend | Grades reset and both items go home (D283); types re-picked at each promotion, pre-filled from her last; forms carry (Tier 2's open from Tier 3's G1) |
| T2G42 | Names | New: Kindred Pendant, Kindred Charm, Seeker Orb, Finisher Insignia, Vow Pendant, Vow Charm, Limit Orb, Apex Insignia. Kept: Pure, Dual, Keen, Tempered, Evolved, partner, Great, Twofold, Onset. Checked: no master-data match |
| T2G43 | Screens and art | The Ascend sheet's weapons rows; a type chip and its partner's glyph on the weapon tile; the accessory sheet draws its family's tree; Kindred's tile names the party's strongest; no new art |
| T2G44 | Save and engine | `type` per class slot; the forms' ids per family and `kind2`; Tier 2's engine stage for types by grade, partners, Vow, Seeker, Onset, Finisher, Limit Orb and Apex; Kindred and the rest frozen stats |
| T2G45 | The viability check | D266's rule on 32 cells a tier, by her damage and by party value; the estimated riders confirmed by the simulation with the rules built, each with its knob: Seeker +0.3, Onset +0.5%, Finisher +0.3%, Limit Orb +1.2, Apex +0.6%, … |
| T2G46 | No shapes on accessories | AoE and multi-hit are Extra Stats' (R2-8); the accessory tree reads stats, kinds and conditions |

### Extra Stats ([extra-stats.md](extra-stats.md))

| Id | Call | Recommended |
|---|---|---|
| T2E4 | Its kinds | Kept, changed (R2-8): one of her three weapons' kinds, on Prowess's kind rows, node by node; stale when dropped |
| T2E6 | The kind cap | Kept: none for the kind rows; Orb forms under T2G14 |
| T2E8 | Into the fight | Kept: the kind rows' points join `flat` |
| T2E13 | Set all | Kept: its live rule for jewels; T2E40 adds Stardust |
| T2E14 | The window's Stars track | Kept, changed (R2-8): the tier's whole map, now 22; T2E43 |
| T2E15 | Her moon | Kept: two nodes, no jewel, × tier; T2E28 |
| T2E17 | The numbers for T2B | Kept, changed: the harness's numbers (§4.6, §4.7) are T2B's input; its simulation with the rules built replaces them |
| T2E18 | Targets and the dot | Kept, changed (R2-9): targets plan jewels and Stardust; the dot is a jewel or a Stardust she can set now; a branch raises neither |
| T2E19 | The corner | Kept: free in every tier |
| T2E21 | A node's three steps | Unlocking: its jewels, in order, three a rank, as Tier 1 (an open node gives Tier 1's gift); slotting, from Tier 2: one Stardust of its grade a jewel, once; choosing: any branch of its list, any time outside a fight, free, set in … |
| T2E22 | One lane a body | A branch re-spends its own body's gift inside its purpose (the core, offense, pools and sustain, defense); none turns defense into offense or back |
| T2E23 | The Planet's list | All six (default) · DEF and M.DEF · HP and MP: ATK and M.ATK stay on every row; the doubled pair takes twice the node's points, the other pair none |
| T2E24 | Prowess's list | Offense (default, her split) · Area +1.5% a point · Multi-hit +0.6% a point (+45% and +18% at five nodes) · Full and Split (T2E27); grouped Her stat · Her shapes · Her kinds; no channel row, no both-shapes row |
| T2E25 | Vigor's list | HP and MP (default) · HP (twice) · MP (twice) · MP back (a fifteenth of a % a point, +2.0% at five) · Life steal (0.1% a point, 3% at five) |
| T2E26 | Guard's list | DEF and M.DEF (default) · DEF (twice) · M.DEF (twice) · Area guard −0.4% a point (−12% at five) |
| T2E27 | The weapon moon | Becomes Prowess's kind rows: Full, 1.5 × the node's points on one of her three kinds; Split, 0.7 of that on each of a pair; node by node. The map stays 22 in every tier |
| T2E28 | Her moon | No branch, no jewel, no Stardust; its sheet has no Branch row |
| T2E29 | Area and Multi-hit | By the hit's cast: area = a cast on every foe (a Sweep, a splash, a farewell); multi-hit = two or more hits on its foe or random foes (her familiar's hit included); one or the other, never both; step 4b after the Insignias; Limit … |
| T2E30 | Life steal | After step 10, her share of each hit's damage (no overkill), rounded down, at most her missing HP; both channels; every hit she deals, Limit Breaks and farewells included; not a mend |
| T2E31 | MP back | At each round's end with the base regen: her bar × the share, frozen at the fight's start as flat MP a round (v11's `mpRegen` re-admitted) |
| T2E32 | Area guard | On a foe's every-Uma move, her hit × (1 − the share) at step 9, after evasion; both channels |
| T2E33 | Caps | One factor a kind, every source summed: Area ≤ +60%, Multi-hit ≤ +24%, Life steal ≤ 4%, MP back ≤ +3% of her bar beside the base regen, Area guard ≤ 16% |
| T2E34 | Values by tier | Flat branches × 1.8 and × 2.6 (a doubled pair at twice the node's rounded points; Split and Trio rounded from the Full node); percent branches the same in every tier |
| T2E35 | Viability | Measured on the harness (§4.6): every branch someone's best, none everyone's, none over half: Offense 12 of 24 cases (the healers' six by their mends), Multi-hit 6, Split 4, Area 2; T2B re-measures with the rules built |
| T2E36 | The hybrids' lift | Accept it: at her best branch Prowess is worth 13.0–17.5% to every damage class (a hybrid's split gave 9.8–10.9%); T2B checks the mirrors and the party value bands with it |
| T2E37 | Presets for the sixteen | The preset sets every node: Prowess by her kit (Offense for the Berserker, Spellfist, Archmage, Battlemage and the four healers; Multi-hit for the Blademaster, Runeblade, Sentinel and Enchanter; Area for the Warlord, Invoker, … |
| T2E38 | The kind rows' order | Her kinds by her kit's damage, her top pair's Split first (Full first when her top kind deals over 2⅓ times her second: the Paladin's Lance); T2B prints each class's order and the preset table stores it |
| T2E39 | The Stars tab | A Branch row and a Stardust line on every node's sheet (not her moon's), a grouped one-tap list with "Wear on every {body} node"; the totals' kinds and branch lines; a Branches sheet with her preset and Tier 1's gifts; a diamond … |
| T2E40 | Set all | Jewels by its live rule, then every Stardust that fits an open node; each line names the branch |
| T2E41 | Whose branches | Hers, not her class's: one set an Uma; a class switch keeps them (a stale kind gives nothing and says so); they carry on Ascend by node id, the map and its Stardust emptied |
| T2E42 | Stone's two materials | Aligned with T2P30: 30 jewels (cut stones) and, from Tier 2, 30 Stardust (Fungi powders) an Uma, three of each a rank; her moon neither; no swap costs an item |
| T2E43 | The window's Stars track | Counts open nodes, 4 · 9 · 13 · 18 · 22 in every tier; never a branch or a Stardust (T2W24) |
| T2E44 | Tier 3 | × 2.6 and one new row, Prowess's Trio (half of Full on each of her three kinds); every other list Tier 2's |
| T2E45 | Prowess for the sixteen classes | A Keeper keeps her parent's split; the Spellfist 100/0 and the Battlemage 0/100 (everything on her own stat, T2C36); the Sentinel, Enchanter, Druid, Shaman, Templar and Exorcist their parent's |
| T2E46 | The save | `stars.picks` (node → branch, defaults never stored) and `stars.slotted` (nodes with their Stardust), Tier 2 and 3 worlds only; `stars.moons` retires; no migration |
| T2E47 | The engine | At Tier 2's engine (v22): `area`, `multi` (step 4b), `lifesteal` on both channels, `mpRegen` re-admitted, `areaGuard` (step 9); flat and kind branches as frozen stats and `flat` |
| T2E48 | Names | All six, DEF and M.DEF, HP and MP, Offense, Area, Multi-hit, Full, Split, Trio, HP, MP, MP back, Life steal, DEF, M.DEF, Area guard, Branch, Branches, Her stat, Her shapes, Her kinds, Her preset, Tier 1's gifts: none matches a … |
| T2E49 | The chart's marks | A white diamond at a star's lower right when its branch isn't the body's default; the chart's table untouched in every tier |
| T2E27 | The weapon moon becomes a pick | It drops round 1's Tier 2 body (+11.8–15.2% of her damage on top of the map) and Tier 3's second moon, both his approved D194 model ("each tier's new bodies should matter"). As picks they compete with Prowess's other rows and add … |
| T2E36 | The hybrids' lift | Slotting raises the hybrids' Prowess from about 10% to 13–15% of their damage, toward the pure classes' 16–18%: the one place slotting adds power, and it moves the pure-to-hybrid ratio by about 4 points |
| T2E25 | MP back at 2.0% | MP binds hard once fights chain (the Sorcerer Attacks on 35% of her acts over 12 stages); MP back at 3% would be every caster's pick. 2.0% ties MP over 12 stages |
| T2E21 | An open node gives its gift until slotted | Stardust slots, it doesn't open, so a slow Fungi line costs choice, never stats |

### Professions ([professions.md](professions.md))

| Id | Call | Recommended |
|---|---|---|
| T2P27 | Ten branches | From Tier 2 each line has two materials: Metal · Rock (stones), Vegetables · Herbs (herbs-spices), Wood · Hides (hides-scales), Fish · Fossils (bones-horns), Stone · Fungi (mushrooms), the second from an unused uma-art family; … |
| T2P28 | The second made items | Arms Whetstone (10 Blocks), Tome Reagent (10 dried herbs), Armor Lining (3 leathers), Accessory Inlay (5 carvings), Stardust (5 powders), G1–G10 each, made at the line's making place; each on its first item's recipe size |
| T2P29 | A grade takes both | From Tier 2 every grade of every piece takes its line's two items of that grade: the first raises its base (Tier 1's value × tier), the second its Tier 2 path; one tap spends both; a path swaps freely, no item tied to a path |
| T2P30 | What each feeds | Whetstone and Reagent: a weapon's Tier 2 type by its channel (Pure, Dual and partner, cross-channel); Lining: armor's tier step (gear's T2G29: armor has no Tier 2 path; reconciled, XR18); Inlay: the accessory tree's forms; … |
| T2P31 | A profession a branch | Ten professions in a Tier 2 or 3 world, each its own Craft Level 1–50 on Tier 1's curve (88,200 EXP) and gates (5g − 4); Tier 1 keeps one Craft Level |
| T2P32 | The EXP rule | A job pays 2 EXP a job-minute to the profession of the material it gathers, processes or makes, nothing to her other two; her speed and gates on it are that profession's |
| T2P33 | Three professions | Her trade's two branches (her calling's line, fixed) and one sub-profession, in Tier 2 and 3 worlds; none in Tier 1 |
| T2P34 | The sub-profession | One branch of another line (any of the eight outside her trade), at its three places, every grade her level in it opens; no reserve |
| T2P35 | Picking and changing it | On her Template tab's trade row: free, any time she isn't working at it; the profession she leaves keeps its level; cleared on Ascend |
| T2P36 | Suggested | The branch with the fewest hands for its work: its trade's Umas counted half plus its sub-professions, over a full window's refined from it (the weapon lines' four branches 250, the other six 150); ties by the Wilds' order |
| T2P37 | Places hold both branches | Fifteen places, no new place or building: each gathers, processes or makes both its line's branches; its second job named (Quarrying, Masonry, Whetstone Crafting; Herb Picking, Drying, Reagent Crafting; Trapping, Tanning, Lining … |
| T2P38 | Eight slots a place | Eight a place in Tier 2 and 3 worlds, either branch, ×1.25, no upgrades (120): slots bind above 91 Umas on full windows, 120 on maxed; a 24-party world's full windows in Tier 1's 83.7 days |
| T2P39 | The ten-branch rule | One rank on two Umas (3 Arms + 3 Tomes) is 30 refined on each of the ten branches: 8h 02m a branch at each of its places and 16h 04m a place at Craft Lv 25; any new piece fits inside its branch's 30 or adds the same to all ten |
| T2P40 | Amounts in Tiers 2 and 3 | A maxed Uma 280 items · 1,500 refined · 1,506 job-hours (50.2 slot-days); a full window 320 · 1,900 · 1,908 (63.6); 150 a branch (250 on the weapon lines' four on a full window); Tier 1 as built |
| T2P41 | Tier 2's pace | The doubling: the fighting party holds G10 on day 23.4 (Tier 1 23.0); a run of twenty working for itself 63.6 days for full windows (50.2 maxed); forty make twenty in 31.8; a full world 83.7, Tier 1's. Progression's T2W12 reads … |
| T2P42 | The Craft track (for T2W, R2-10) | Progression's T2W26: her three Craft Levels add up to 12 · 24 · 36 · 48 · 60 (Craft V 24.9 days with an even split, 27.8 a specialist, against Tier 1's 24.5), so the track reads all three professions (reconciled, XR17) |
| T2P43 | The Warehouse and icons | Shelves by line, both branches on each; Made items gains the five second items after their first; the second materials wear uma-art's own rows, the second items borrow unused rows (tonic vials, two gems rows, the retired … |
| T2P44 | Names | Rock, Herbs, Hides, Fossils, Fungi; the fifteen second jobs; Arms Whetstone, Tome Reagent, Armor Lining, Accessory Inlay, Stardust; "Sub-profession" and "Tier 2 path", never "Sub" or "Path" alone: all checked against every … |
| T2P45 | Save and engine | `OwnedUma.crafts` by branch and `OwnedUma.sub` in Tier 2 and 3 worlds at Tier 2's toolbox save; a world's existing `craft` migrates to her trade's first branch; 150 ids; places' branches and eight slots by tier; no battle engine … |
| T2P1 | The five-line rule | Kept, changed (R2-9) |
| T2P4 | Recipes by tier | Kept, changed (R2-9) |
| T2P7 | The weapon moon's cost | Kept, changed (R2-8) |
| T2P8 | Steps by tier | Kept |
| T2P9 | Craft Level by tier | Kept, changed (R2-9) |
| T2P10 | Sizes by tier | Kept |
| T2P11 | Places and slots | Kept, changed (R2-9) |
| T2P14 | The pick | Kept, changed (R2-9) |
| T2P15 | Suggested | Kept, changed (R2-9) |
| T2P16 | Pickers and words | Kept, changed (R2-9) |
| T2P17 | The open shop | Kept, changed (R2-9) |
| T2P18 | The Exchange by tier | Kept, changed (R2-9) |
| T2P19 | Tickets by tier | Kept |
| T2P20 | Drills and the farm | Kept |
| T2P21 | Two yardsticks | Kept, changed (R2-9) |
| T2P22 | The full window's weapon work | Kept, changed (R2-9) |
| T2P23 | Tier 3 | Kept, changed (R2-9) |
| T2P24 | Ascend and the farm | Kept, changed (R2-9) |
| T2P26 | The ledger | Kept, changed (R2-9) |

### Balance ([balance.md](balance.md))

| Id | Call | Recommended |
|---|---|---|
| T2B1 | Every source keeps its share | Every flat value ×1.8 and ×2.6, round 2's included (Great, Twofold and Kindred forms, Extra Stats' kind rows); every percentage unscaled, round 2's included (a type's weak multiplier, Insignia riders, Area, Multi-hit, Life steal, … |
| T2B2 | The yardstick is the engine | Every Tier 2–3 number on the harness; this round measured the sixteen on a fork of engine v21 (T2B20), the build re-measures on its own stage (`balance-t2.test.ts`) |
| T2B3 | A later tier's Class Rank pace | Ranks 1–10 one shared ladder of 3,600 raising every class she holds; depths at Lv 10 · 16 · 22 · 29 (T2C47) |
| T2B4 | Tier 2's term | Re-sized on the measured toolbox (T2B36): foes' HP and DEF × (1.06 + 0.04 (ℓ − 1) ÷ 49), 1.06 → 1.10, offense +10% by Lv 50 |
| T2B5 | Tier 3's term | Foes' HP and DEF × 1.10 → 1.12 by Lv 35, rising to 1.26 by Lv 40 (the crowns) and flat after, offense +10% by Lv 50 (T2B36) |
| T2B6 | Bosses | The term × 1.1 on bosses' HP and DEF in Tiers 2–3 |
| T2B7 | Shields by answers | Sub-bosses 7 and bosses 9 from Tier 2 Lv 1, and 7 and 9 in Tier 3 (round 1's 10 counted two two-kind weapons; XR6 kept one); regulars by formation; Keys, guards and escorts as Tier 1 |
| T2B9 | The Rift by tier | Draws by front; the Duel's shields the best act's or Limit Break's chips + 3, re-counted on the sixteen: at least 14 (T2B38) |
| T2B10 | Skill MP by tier | ×1.7 in Tier 2, ×2.4 in Tier 3; every Tier 2–3 number here was measured with it |
| T2B11 | The base regen | 1% of her bar a depth, five at most; a sixth step with Tier 3's crown |
| T2B12 | Statuses | +10% a stack (foes' 15%), cap 3, two rounds; four levels of access (T2C45) with the support level's rule (T2B24); Momentum is no status: a factor of its own at step 5 |
| T2B13 | Limit Breaks | Tier-free: power × scale × open depth's power, at most 10 hits on one foe, gauge 12 |
| T2B14 | The damage stack | No focus; step 1 her stat (a cross reads one), forms, Kindred and kind rows; step 3 her type's weak multiplier by grade; step 4 Insignias with riders; step 4b Area and Multi-hit; step 5 statuses and Momentum; ceiling on one weak … |
| T2B15 | Defense | Armor as it is; a regular's 100% hit 19.0 · 18.4 · 18.2%, about 21% with the terms' offense |
| T2B16 | The mirrors | Mirrored Tier 2 classes within 5 points of gain of each other at every level (§4.9); the Arms and Tome splits 70/30 ± 5 as Tier 1 |
| T2B17 | The healers | Guardian ÷ Bishop and Templar ÷ Exorcist within ±10% of mends and absorbed Barriers; keeper against battle healer on the stress check (T2B23) |
| T2B18 | The simulation's checklist | Round 1's thirteen checks plus the guardrail's three (T2B22, T2B23, T2B34), §4.15 |
| T2B19 | Accessory viability by tier | D266's rule for every Tier 2–3 form; gear's T2G35 holds it; Kindred counts as party value (T2B32) |
| T2B20 | How the sixteen were measured | Their rules on a scratch fork of engine v21 and its Auto, the live harness building every Uma (gear, Extra Stats, Learner, Class Rank pace), Tier 2's MP and healing divisor, gear's Suggested types and forms (T2G26, T2G36) and … |
| T2B21 | Party value on the harness (amends T2C56) | V = D + S: D her damage a round of the fight in BT (an on-curve Brawler's at the same tier, level and kind of fight), S what the other four lose when her statuses, mends, wards and keeper twist are off; a class's gain is the … |
| T2B22 | The band (amends T2C64) | On curve at Tier 2 Lv 10, 30 and 50: each of the twelve damage and support classes' gain within ±5 points of the twelve's mean gain at that level; the four healers on the stress check (T2B23) |
| T2B23 | The stress check: the attrition check | Each region's elite, its boss's first wave and its boss as one fight (three waves, HP and MP carried, the 10% breather), foes' offense ×2, ×2.6, ×3.2 and ×4, at Tier 2 Lv 30 and 50 and Tier 3 Lv 50, 16 seeds; read wins, KOs, HP … |
| T2B24 | The support level's rule (amends T2C39, T2C45) | Every skill of her Katana, Bow, Light and Dark trees carries its status at 1 · 1 · 1 · 2 · 2 by depth, topped up to its stacks, never built past them; her Brave and Faith land on the Uma she wards (her Barrier's target; the … |
| T2B25 | The supports' hands (amends T2C39, T2C54) | Sentinel ×0.95, Enchanter ×0.8, Druid ×0.95, Shaman ×1 of her parent's hands; the Druid's preset Bow, Axe, Dark (her parent's; the Greatsword cost her the Axe's sweep and the Area branch) |
| T2B26 | Momentum's step (amends T2C34) | 6% a stack, a stack a turn, three at most (+18%) |
| T2B27 | The cross (amends T2C35, T2C54) | Spellfist ×1.05, Battlemage ×1.3; presets the Scatter twins (Spellfist Greatsword, Axe, Thunder; Battlemage Fire, Blizzard, Lance), gear's T2G25 alternative |
| T2B28 | The Spellblade keepers (amends T2C37) | Her familiar's hit on both halves and it pierces (skips the unbroken halving); hands +0.03 a half (Blademaster 0.75 + 0.47, Runeblade 0.51 + 0.75) |
| T2B29 | The Summoner keepers (amends T2C38) | Both summons linger; hands +0.03 a half (Warlord 0.60 + 0.49, Invoker 0.53 + 0.60) |
| T2B30 | The healer keepers (confirms T2C43) | One stack more, as classes drafted: worth +0 to +6% on curve (stacks build to 3 anyway), so the keeper is the attrition pick: ahead of her battle healer from ×3.2 (T2B23) |
| T2B31 | The battle healers (confirms T2C44) | ×0.6 power, ×0.7 MP, ×0.7 mends and Barriers: +6 to +16% on curve, behind the keeper from ×3.2 |
| T2B32 | Kindred is support value (with T2G34) | The party measure counts it: the supports' presets wear it from a slot's G5, one Uma's total, the party's largest |
| T2B33 | The knob order | (1) a support's status rule, (2) the supports' hands, (3) Momentum's step, (4) the cross hands, (5) the hybrid keepers' hands, (6) the battle healers' shares then power, (7) the healer keepers' twist; one at a time, re-measured … |
| T2B34 | The comps measured (R2-12) | C1–C8 on the harness at Tier 2 Lv 10, 30, 50 (C8 in Tier 3): every comp +1.7 to +9.3% over its Tier 1 party; table in §4.7 |
| T2B35 | C3's weapons (answers T2G25) | The Scatter twins (T2B27): every kind in two hands in C3, the party as fast or faster (+1.9, +3.2 and −0.9% at Lv 10, 30 and 50); the cost, Thunder missing from 8 of the 64 keeper and expander mixes (the Berserker with the … |
| T2B36 | The toolbox term, re-sized (amends T2B4, T2B5) | Tier 2: foes' HP and DEF × (1.06 + 0.04 (ℓ − 1) ÷ 49), 1.06 → 1.10; Tier 3: × 1.10 → 1.12 by Lv 35, rising to × 1.26 by Lv 40 (the crowns, Class Rank 50 at Lv 36) and flat after; offense +10% by Lv 50 and bosses × 1.1 kept; … |
| T2B37 | Tier 3 measured | C8 with the crown and the masteries is 4.98 BT a round at Tier 3 Lv 50, +25% over Tier 1's parties there and +17% over itself uncrowned (C1 crowned 4.82); masteries as classes drafted them (Juggernaut ×0.6, Resonance 30%, … |
| T2B38 | The Duel's rail on the sixteen (amends T2B9) | The keepers' twists add a chip: the Warlord's and Invoker's second farewell (11 on a lone champion), the Blademaster's and Runeblade's second familiar (10); the Duel's shields at least 14 |
| T2B39 | A healerless party (a finding) | Two supports carry a party with no healer through the attrition check (×2.6 every fight won); with T2B24's ladder a keeper healer's party stays ahead at ×4; the one-healer rule stays a ceiling, not a floor |
| T2B40 | The previews | Five pages: tiers, the guardrail, the comps, the stress check, every call |
| T2B24 | The support level's rule | The biggest finding: as drafted, the Spellblades' supports were worth +18 to +50% (Brave and Faith on every Uma every act, built to three). The fix changes what a support's status is: one or two stacks topped up, Brave and Faith … |
| T2B23 | The stress check | The answer to "become useless": every healer and support is the better pick somewhere, measured; the four bands keep it so |
| T2B39 | A healerless party | Two supports carry a party with no healer through hard attrition; a keeper healer's party stays ahead at the hardest. If he wants healers mandatory, this is the seam |
| T2B22 | The band's two misses | The Sentinel at Lv 10 and 30, recommended to accept and re-read with the class lines |

### Templates ([templates.md](templates.md))

| Id | Call | Recommended |
|---|---|---|
| T2U1 | This doc | This doc owns Uma uniqueness in Tiers 2 and 3 and the template's budget; the manual owns Tier 1 as built; UT1–UT20 carry here with a status (§3); uma-templates.md goes to the archive with the set |
| T2U2 | The pieces | Five pieces, no sixth: her calling, the ★ Flourish, the ★ signature, ★ her moon and, from Tier 2, the ★ signature tip; UT2's "never" list kept |
| T2U5 | The Flourish by tier | 4% of her max HP a fight in every tier, the same three shapes; her HP carries the tier (a Brawler 58 · 101 · 144 HP at Lv 50) |
| T2U6 | The signature by tier | 0.1 a level × 1.8 and × 2.6, at least 1: +9 and +13 at Lv 50; any form or branch of her family at G1+; one ★ however many slots |
| T2U8 | Her moon by tier | Two nodes, no jewel, × tier: I +4 · +7 · +10 points on her knack's stat (Fleet and Gritty shares flat), II +8 · +14 · +21 on her calling's root (All-Rounder ⌊÷ 2⌋ DEF, the rest M.DEF); opening with the shared moons' II and IV, … |
| T2U9 | The tip's anchor | Her lead weapon's tree (her first slot, always her lead channel), depth 5's tip fork, a third option beside Power and Break, on the line she holds; keeper or expander never moves it; never on her class tree |
| T2U11 | The three tips | Re-cut on today's shapes: Quickstep (Dash) two more hits on her target at the same total; Spillover (Middle) the volley's splash, 0.35 on every foe but her target, +2 MP; Long guard (Stayer) a Barrier on herself of 10% of her max … |
| T2U12 | Reordering | The ★ follows her first slot; a ★ pick on a tree that stops being first, or outside her family, plays as Power and waits, and returns when it is first again |
| T2U13 | Tier 3 | The ★ at both tip forks of her lead tree (two lines held); a capstone built on a ★ tip keeps its ★ effect; the master slot may hold it; no ★ on her other two trees |
| T2U14 | The budget | The measured sizes stand: the ★ adds about +2% damage a turn at Lv 50 in every tier (+1.0–3.6 · +0.5–3.3 · +1.3–3.4%); matched with her family's swap +1.2 · +1.3 · +1.5% on average; a matched party takes 4–6% less from Lv 30; the … |
| T2U15 | The dial | Unchanged: the signature's rate a level (0.1 now, about +2%; 0.2 about +4% if the owner wants a stronger edge), never a new piece and never the foes; the tips' knobs (§4.7) only if the simulation finds one hot |
| T2U16 | How it shows | One more ★ row on the Template tab (★ Tip: Picked, Not picked, "R40 first", "Off · as Sorcerer"), opening the Class tab's tip node; the fork draws "Power · Break · ★ Quickstep", the ★ dashed until picked; no dot; the Stable … |
| T2U17 | Save | Nothing about the template stored; the ★ tip is a third value of T2C's tip pick (default Power); her moon's ids as built; no migration |
| T2U18 | Engine | The tips are data on rules that exist (spread hits, the volley's splash, a Barrier, with a self-target the one new step), in Tier 2's class engine; the other pieces need nothing (already × tier) |
| T2U19 | Names | Quickstep, Spillover and Long guard kept; no new name coined. Every template word (the 15 types, the 5 knack words, the 3 Flourishes, the 3 tips) checked against every string of today's master-data release (10 files, 18,227 … |
| T2U21 | Her family on the sixteen | Both children of each Tier 1 class of her family: Warrior 6, Mage 6, Spellblade, Summoner and Healer 4 each; keeper and expander equal; kin's children outside; read through each Tier 2 class's parent |
| T2U22 | Her preset's ★ | Her family first when her hits read its stat (a Pendant an ATK hitter's, a Charm an M.ATK hitter's, so the Brawler's and the Sorcerer's expanders read as their parents), in its best form; first for everyone once her family's dual … |
| T2U23 | Her lead weapon on the sixteen | Her class's preset first slot: keepers as their parents (Greatsword, Fire Tome, Katana, Thunder Tome, Bow, Dark Tome, Lance, Light Tome), expanders by classes.md's presets (assumed the same leads); the tip follows her first slot … |
| T2U24 | The tip on the support and battle-healer classes | On her lead tree's held line, a striking tree in every class (every capstone strikes); never on a support line; a capstone that doesn't strike plays the ★ as Power ("★ Tip · on a strike line"); the three tips unchanged; never a … |
| T2U25 | Her arrival in a later world | She arrives as the Tier 2 class she picks on the Ascend sheet (Suggested her class's keeper, progression T2W18); no new Uma in a later world (live); her calling stays her family's name; her pick never moves her template |
| T2U26 | Her moon and the stat picks | Her moon's two nodes keep their template stat, no pick list (R2-8's picks are the shared bodies'); if extra-stats.md gives her moon a list, the template stat is its first entry and her default |
| T2U27 | Her calling and three professions | Her calling names her line, both its professions (R2-9); nothing to the sub-profession (her own pick), no Craft bonus, no party synergy |

### Progression ([progression.md](progression.md))

| Id | Call | Recommended |
|---|---|---|
| T2W1 | The Tier 2 world's shape | Tier 1's on continents 6–10, with capitals v2 and the honeycomb live first: 48 regions, 24 parties, six Springs, six capital runs a continent; no Tier 2 world packet before H162 and H166 |
| T2W2 | Continent leans by tier | Tier 2 Jungle, Sky Isles, Glacier, Volcano, Underworld (Z1); Tier 3 Swamp, Highlands, Geyser Basin, Storm Peaks, Ancient Ruins; a tier's leans change only while no world of it holds a won stage |
| T2W3 | Face packs by tier | Tier 1's totals, arranged anew each tier: Tier 2 Z7's (the middle pack opens it, the small returns twice, the large closes it); Tier 3 a third (the small holds `w13` whole) |
| T2W4 | Does Tier 3 get a Rift | Yes: the same shape at T3 Lv 50, its own seals and Rift Conquered · Tier 3, the Rift step (every board 36), Trials with it; nobody ascends from it while Tier 3 is the top tier: a full Tier 3 window is the end of her collection, … |
| T2W6 | Trials and Drills by tier | Unchanged in every tier: Trials at the tier's Lv 45, 50, 55, opening with its Rift; Drills at its Lv 10–50, 2–6 Logs, ten runs a day banked to thirty, opening with its first map win; Logs and Marks stay in their world |
| T2W9 | Ascending into an empty world | The Ascend sheet says when the new world would hold fewer than five ("3 of 5 to fight in Tier 2"); no rule change |
| T2W10 | Prices by tier | Speed and Sweep Tickets × tier (20 · 30 in Tier 2, 30 · 45 in Tier 3) and the purse's Laurels × the tier she arrives in (2,000, 3,000), so a Laurel buys the same time in every tier; Marks, Manuals and Logs untiered |
| T2W11 | When the toolbox opens | No new gates: every Tier 2 and 3 addition opens on its system's gate (the Ascend sheet, Class Rank, a grade's levels, a node's jewel and level) |
| T2W12 | A run's pacing target | Tier 1's time for the fighting party (G10 by day 23.4) and for a world of forty at work (twenty windows in 31.8); a first cohort of twenty working for itself takes about twice that (63.6 days), round 2's deeper farm (XR15); … |
| T2W13 | The fifteenth scenario's capital | Its own four authored Finals routes (original names, checked against the release), with Tier 3's world packets |
| T2W14 | A sixteenth scenario | Tier 4 stays closed: it shows "Tier 4 locked" and joins no world until the owner opens Tier 4; Tier 3's Rift step completes her window only |
| T2W15 | The version plan | The worlds first on today's engine (leans, packs, prices, Tier 3's Rift), then the toolbox as one release a tier: Tier 2 at engine v22 and save v39 (the Ascend sheet's pages and the board's rules with it), Tier 3 at v23 and v40, … |
| T2W16 | Where promotion happens | On the Gallery's Ascend sheet, two pages, every pick pre-filled: who goes (by party, a summary row per Uma), then her page (class, weapons and types, sub-profession); one tap ascends with the defaults; nothing opens over the sheet |
| T2W17 | The classes open to her | Both children of every Tier 1 class she has at Class Rank 50 when she ascends: 6 to 16, read before she leaves and written to the new world; widened in the tier only by classes' door (T2C48: a held Tier 2 class at Class Rank 20 … |
| T2W18 | Her Suggested Tier 2 class | The keeper of the class she fights as when it is at R50, else of her highest R50 class (ties: her family's, then the tree's order); the expander one tap beside it |
| T2W19 | Her weapons at promotion | Her picked class's preset, each weapon's Tier 2 type gear's Suggested, set on the sheet; a slot offers its channel's kinds, an expander's cross slot included; swaps later as gear rules; Tier 2 → 3 pre-filled with hers; no G5 gate |
| T2W20 | Her sub-profession at promotion | On her page, pre-picked with professions' Suggested, her line's two shown fixed; changeable there or later |
| T2W21 | What she keeps, picks and restarts | Picks are settings, set or confirmed on the sheet; progress restarts: kept her calling, line, template, windows, history, accessory families and kinds; picked her class, weapons and types, sub-profession; from Tier 2 her forms … |
| T2W22 | A party ascending together | Grouped by party, moves with its name; a check line from the picks ("One healer · 10 of 10 kinds · damage 3 · support 1 · heal 1"), two healers a warning, never a block; "Suggested for all" resets the group |
| T2W23 | Umas already in a Tier 2 world at its switch | Each opens both children of the class she fights as and of every Tier 1 class she has at R50 there, and becomes her class's keeper at its Class Rank; others at Rank 1; Suggested types and sub-profession; a "New: Tier 2 classes" … |
| T2W24 | The Tier 2 board | One board, 36 steps, the same seven tracks and the Rift and the same record positions; Class, Craft and Stars re-read the new systems; Gear and Weapons read grades whatever form or type; World a won capital run; no track added |
| T2W25 | The Class track from Tier 2 | R10 · R30 · R50 on her best Tier 2 class; IV a Tier 2 class and its sibling at R50; V three Tier 2 classes at R50, any; Tier 1's pace; "Pair at R50" |
| T2W26 | The Craft track from Tier 2 | Her three Craft Levels add up to 12 · 24 · 36 · 48 · 60: any split; Craft V 24.9 (even) to 27.8 days (a specialist) against Tier 1's 24.5; "Crafts 36"; the dial 56 |
| T2W27 | Progress, never a choice | A step reads progress only; a choice counts only as breadth any option meets equally (a sibling pair, three classes, five weapons, three Crafts); no step names a class, type, form, stat or profession; a choice celebrated is … |
| T2W28 | The record and the art | No new position, no rebake: every tier keeps the 36 ids and positions; each id's rule is the tier's (read by tier from Tier 2's switch); `windowNext` and the tiles gain "Pair R41/50" and "Crafts 29/36"; the pane map lights 36 as … |
| T2W29 | The Tier 3 board | Tier 2's board at Tier 3's numbers, 36 with its Rift: Class on Tier 3's classes (R50 also her crown, if classes keeps it there), Crafts to 60, the Tier 3 map, continents 11–15 |
| T2W30 | The Rift's guidance and tests on the sixteen | The guidance names the Tier 1 class and either child fits (the keeper Suggested in Use the guided weapons); the fronts' tests ask for round 2's tools (Pure types and self-buffs on Iron, a Dual's partner and kind picks on Arcane, … |
| T2W31 | Ascend into Tier 3 | The same sheet, pre-filled with her Tier 2 picks: her class (her open set carrying, assumed; Tier 3's options if classes gives one), weapons and types, sub-profession; forms and picks kept as settings; 3,000 Laurels |
| T2W32 | A Tier 2 run with round 2 | A first cohort of twenty working for itself: full windows in about 63.6 days (sub-professions pooled; 111.6 without), since round 2's farm doubles a full window (T2P40–T2P41); forty at work: 31.8, the Rift binding at 33.5 (37.6 … |

## 9. Round 2: the owner's requirements (2026-11-04)

The owner, after reading the set:

> - currently I've started introducing some slight variety to my parties with Arms and Tome summoners and spellblades as
>   well as with clerics and paladins, however, I'm really scared of doing too extreme variants that may become hard to
>   balance which is something very common in other games that add things like healers or buffers or hybrid dps and they
>   become useless overall.
> - I consider Tier 1 in it's current state in a "nice", "balanced-enough" state, so I want to try the more broad-reaching
>   things in Tier 2 and later in Tier 3.
> - Starting with classes, I definitely want to add at least 2 more Key Classes to evolve into, for each class, 1 class
>   will keep most of it's identity, while the second branch will expand the class, for balance I will swap back and
>   forth between each one, here is some baseline example.
>   - Brawler → True Brawler: remains full physical and we add a self-buff mechanic. → Wild Magic Brawler: gets the
>     chance to wear dual phys and magic weapons where magic weapons deal damage based on ATK.
>   - Sorcerer → True Sorcerer: remains full magical and we add a self-buff mechanic. → Blade wielding Sorcerer: gets the
>     chance to wear dual magic and phys weapons, where phys weapons deal damage based on MATK.
>   - All other classes you'll have to cover, suggest further specializations, make supporters that deal a bit more
>     damage, while having spellblades and summoners that support a bit.
> - With the above I will be able to make either party comps that will look pretty similar to Tier 1 comps, or parties
>   where I will swap both Brawler and Sorc, or parties where I will swap Paladin for dps and then spellblade to support
>   so they balance each other. I would like you to include multiple party comps with proposed new classes and the
>   overall party capabilities, how many weapons, pure damage capability vs supporting and healing capabilities.
> - I want the new class to be selected on Tier 2 promotion.
> - Then Weapons, I want for sure for them to be selected to their new weapon types on Tier 2 promotion, as weapons it's
>   easier to swap around.
> - Accessories I want to add some real complexity and have more of a upgrading tree for accessories, either Dual
>   ATK+MATK increase, multi-damage type increases, and so on.
> - Extra stats I want to get out there where unlocking the moon is one thing but then maybe slotting the actual extra
>   stat per moon is something else, can we have moons boosting AoE damage and multi-hit damage in different
>   proportions? different damage types? a little mp recovery here and there, a little life steal here and there? I craft
>   and unlock the Sun and the moons but then in Tier 2 I have branches for every stat granted that I can select and swap
>   freely.
> - Finally professions, this I also want to increase greatly, in Tier 2 to at least every farming type having 2 types of
>   materials being farmed and processed and finally crafted, these will feed every dual path we have on the other
>   systems. I want Umas to gain Exp differently for each branch, but then I also want an Uma to be able to pick a
>   sub-profession from another branch entirely, so each Uma would have the ability to farm and level 3 total
>   professions now.
> - If you haven't looked at the Uma Stained glass achievement mechanics, now would be a good time for it.

### 9.1 How round 2 reads the requirements (the main session's calls; each doc may refine, never contradict)

| Id | Call |
|---|---|
| R2-1 | **Tier 1 stays as built.** Everything below is Tier 2 and up; Tier 3 deepens what Tier 2 opens. |
| R2-2 | **Sixteen Tier 2 classes, two from each Tier 1 class:** a **Keeper**, who keeps her parent's identity, and an **Expander**, who widens it. They replace round 1's class branches (focus, reverse set): each round-1 call they replace is marked Superseded (by R2-2), and what still fits (the class line, line C, tips, equipped slots, MP, the crown, masteries) is re-homed on the sixteen. |
| R2-3 | **The expanders, by family:** the **Brawler** and the **Sorcerer** expand into the other channel on their own stat (the owner's Wild Magic Brawler: her Tomes deal damage on ATK; the Blade Sorcerer: her Arms on M.ATK), still pure damage. The **Spellblades and Summoners** expand into support: a little of the healers' kit (wider buffs and debuffs, a ward or a small mend), less damage. The **Paladin and the Cleric** expand into damage: a battle healer, more damage, less healing, still the party's one healer. |
| R2-4 | **The keepers:** the Brawler's and the Sorcerer's add a **self-buff mechanic** (their own stacking power, never a party buff); the hybrids' and the healers' sharpen what Tier 1 gave them. Names are the classes doc's, checked against master data; the owner's are working titles ("True Brawler", "Wild Magic Brawler", "Blade wielding Sorcerer"). |
| R2-5 | **Tier 2 promotion is the Ascend.** On her Ascend into Tier 2 she picks her Tier 2 class: one of the two children of a Tier 1 class she brought to Class Rank 50 (Class V already asks three). She can switch later among the Tier 2 classes open to her, each on its own Class Rank, as Tier 1's held classes work, so the owner can "swap back and forth". |
| R2-6 | **Weapon types are picked at the same promotion:** her new class's three slots and each weapon's Tier 2 type (round 1's Pure or Dual and its partner, or what gear makes of it) are set on the Ascend sheet, then swap freely or cheaply ("weapons it's easier to swap around"). Round 1's "a weapon's G5 picks its branch" is Superseded (by R2-6). |
| R2-7 | **Accessories get an upgrading tree** in Tier 2: per slot, a family's tree of forms that unlock as the slot's grade rises (dual ATK + M.ATK, several damage kinds, by shape, and so on), each form held to D266's viability rule (no form best in over half the cases, every form someone's best). Round 1's two forms a family grow into the tree. |
| R2-8 | **Extra Stats split unlocking from slotting.** Jewels (crafted) still open the Sun (the Planet) and the moons' nodes; from Tier 2 **every open node takes a stat she picks** from its body's branch list and swaps freely: core stats, AoE and multi-hit damage (in different proportions), a damage kind or channel, a little MP back, a little life steal. Round 1's weapon moon becomes one of those choices or a body of its own, as the doc decides. |
| R2-9 | **Professions: two materials a line from Tier 2,** each gathered, processed and crafted, each its own profession with its own EXP and Craft Level; the second material feeds the dual paths in the other systems (Dual weapons, dual accessory forms, Extra Stats branches). **Three professions an Uma:** her line's two plus one sub-profession from another line (replacing round 1's secondary). No new building art unless the doc shows the fifteen places can't hold it. |
| R2-10 | **The windows (stained glass) grow with Tier 2:** the board's tracks read the new systems (Tier 2 classes, weapon types, the accessory tree, Extra Stats branches, three professions), its step count and pacing kept close to Tier 1's 36. |
| R2-11 | **The balance guardrail (the owner's fear):** every class, keeper or expander, is worth the same to a party within a band, measured as **party value**: her own damage plus the damage her buffs and debuffs add to others plus the damage her mends and wards save, on the harness. Expanders trade damage for support (or back) at one exchange rate, so no variant is "useless overall". Tier 1-like comps, swapped-pure comps and swapped-support comps all fight within the same band. |
| R2-12 | **Party comps:** the classes doc shows at least six comps (Tier 1-like, both pures swapped, healer to damage with a Spellblade to support, a Summoner support comp, a double-expander comp, a Tier 3 comp), each with its weapons covered, damage share, support share and healing; balance measures them. |

### 9.2 Round 2's owners

Ids continue in each doc (T2C31…, T2G21…, T2E21…, T2P27…, T2B20…, T2U21…, T2W16…); a round-1 call a requirement
replaces is marked **Superseded (R2-n)** in its doc's Decisions table, and the doc is rewritten to read as one design.

| Doc | Round 2 |
|---|---|
| classes.md | R2-2–R2-5, R2-12: the sixteen classes, their kits, slots and channels, promotion and switching, the comps |
| gear.md | R2-6, R2-7: weapon types at promotion, the accessory tree |
| extra-stats.md | R2-8: unlocking and slotting, the branch lists |
| professions.md | R2-9: two materials a line, three professions an Uma |
| balance.md | R2-11, R2-12: party value, the guardrail bands, the comps measured |
| progression.md | R2-5's promotion flow on the Ascend sheet, R2-10's windows, and templates.md's touch-ups for the new classes |

## 10. Round 3: the owner's feedback on classes (2026-11-05)

The owner, after round 2:

> ok, I have my first set of feedback that is mostly focused on the Tier 3 Classes and may need some rework on Class
> Distribution:
> - basically, I want Brawlers and Fighters to offer Tier 3 promotions as follows:
>   - Brawler:
>     - at Tier 2 -> 1 line pure physical weapons, self-buffs for more damage.
>     - at Tier 2 -> 1 line that looks slightly like an arms spellblade in terms of damage distribution, but more focused
>       on single hit damage and minor multi-hits and with the capability of their tome weapon do phys based damage.
>     - at Tier 3 -> 1 line remains for the pure physical and there always should be an actual class promotion and a
>       new name and so on, then, an additional branch for the spellblade like variant where 1 remains as the one you
>       authored in Tier 2 but with higher ceiling or buffs, and then another one that pure phys dps weapons but more
>       varied phys weapons.
>   - Sorcerer:
>     - at Tier 2 -> 1 line pure tome weapons, self-buffs for more damage.
>     - at Tier 2 -> 1 line that looks slightly like a tome summoner in terms of weapon equipment but more focused on
>       single hit damage and with the capability of their phys weapon do magic based damage.
>     - at Tier 3 -> same as Brawler but for Sorcerer.
> - then, I want Spellblades and summoners to offer maybe a pure elemental or pure physical variants either at Tier 2 or
>   at Tier 3 where it fits best, so I would normally swap both classes at the same time the Brawler with a spellblade,
>   or the spellblade with the paladin, that way I'll make my parties balanced.

### 10.1 How round 3 reads it (the main session's calls; each doc may refine, never contradict)

| Id | Call |
|---|---|
| R3-1 | **Tier 3 is always a promotion:** every Tier 2 class promotes into at least one Tier 3 class with a new name, picked on the Tier 3 Ascend sheet as Tier 2's are (T2W16). Round 2's "Tier 3 adds no class" (T2C57) is Superseded (R3-1); the crown, two lines held, the master slot and the masteries are re-homed as Tier 3 classes' features or retired, the classes doc's call. |
| R3-2 | **The Brawler's line, in the owner's words.** Tier 2: the **Berserker** (pure physical, Momentum) stays; the **Spellfist** is reshaped to "an Arms Spellblade's damage distribution" (two Arms and a Tome, her Tome on ATK) **focused on single-hit damage with minor multi-hits**. Tier 3: the Berserker promotes into **one pure-physical class** (a higher ceiling); the Spellfist into **two**: her own Tier 3 (the same kit, a higher ceiling or buffs) and **a pure-physical class with more varied physical weapons**. |
| R3-3 | **The Sorcerer's line mirrors it:** the **Archmage** (pure Tomes, Momentum); the **Battlemage** reshaped to the Tome Summoner's weapon equipment (two Tomes and an Arm, her Arm on M.ATK) focused on single-hit damage; Tier 3 the same three. "Brawlers and Fighters" reads as Brawlers and Sorcerers, the two the owner's bullets name. |
| R3-4 | **Spellblades and Summoners gain a pure variant at Tier 2** (the owner: "either at Tier 2 or at Tier 3 where it fits best"; Tier 2, so the owner's swap of a Brawler with a Spellblade works as soon as the Spellfist does): the Arms Spellblade's and the Arms Summoner's are **pure physical**, the Tome Spellblade's and the Tome Summoner's **pure elemental**, each keeping her family's feel (a Spellblade's multi-hit on one foe, a Summoner's area and lingering summons). Their keeper and support children stay: three Tier 2 children each. Tier 3: each of the three promotes into one. The alternative, the pure variant at Tier 3 splitting from the keeper, is listed. |
| R3-5 | **The healers:** the keeper and the battle healer each promote into one Tier 3 class. |
| R3-6 | **Counts:** Tier 2 has **20** classes (the Brawler and the Sorcerer two each, the four hybrids three each, the healers two each); Tier 3 has **22** (the Brawler and the Sorcerer three each, the hybrids three each, the healers two each). |
| R3-7 | **The owner's swaps** are the comps' spine: **a Brawler with a Spellblade** (the Brawler to her Spellfist, the Arms Spellblade to her pure-physical variant) and **a Spellblade with the Paladin** (the Spellblade to her support, the Paladin to her battle healer), with their mirrors, in Tier 2 and in Tier 3; each keeps the party inside the band. |
| R3-8 | **The guardrail holds** (R2-11): every Tier 2 and Tier 3 class inside the party-value band, measured on the harness fork; Tier 3's promotions take over the crown's measured budget (+17%). |
| R3-9 | **Names:** new names for the four Tier 2 pure variants and the 22 Tier 3 classes, D298's grammar for any new skill, every name checked against master data and the game's own strings. |

### 10.2 Round 3's owners

Ids continue in each doc (T2C65…, T2B41…, T2G47…, T2W33…, T2E50…, T2P46…, T2U28…).

| Order | Doc | Round 3 |
|---|---|---|
| 1 | classes.md | R3-1–R3-7, R3-9: the twenty Tier 2 and twenty-two Tier 3 classes, their kits, the Tier 3 promotion, the comps |
| 2 | balance.md | R3-8: the new classes measured, the band, the stress check |
| 2 | gear.md, progression.md | Weapons and presets for the new classes; the Tier 3 promotion on the Ascend sheet; the windows' Class track by tier |
| 2 | extra-stats.md, professions.md, templates.md | Presets, Prowess splits, demand by class, families: touch-ups |
