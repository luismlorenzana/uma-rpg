# Tier 2 and Tier 3: the brief

> **Status: drafting, 2026-11-04.** The owner: "start working seriously in some Tier 2 docs that would greatly expand our
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

| Doc | Status |
|---|---|
| classes.md | Drafting |
| gear.md | Drafting |
| extra-stats.md | Drafting |
| professions.md | Drafting |
| balance.md | Drafting |
| templates.md | Drafting |
| progression.md | Drafting |

The old previews carried or retired, and the cross-reference's rows, land here.
