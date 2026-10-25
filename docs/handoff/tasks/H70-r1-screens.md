# H70 — R1's screens, inert until the switch: the Skills tab as a tree with ranks, three weapons, the calling pick, the template with ★, weakness icons, MP "+n a round"

**uma-rpg · Either · L · Needs: H65, H66, H67, H68, H69 · Unblocks: H72; R2's H79, H80**

## Why

H64–H69 built R1's rules dark. The player meets them on screens that don't know them yet:
- **the Skills tab** still sells side skills for points across five weapons; R1's is a real tree a weapon (a trunk, one
  free fork, five rank pips a skill) over three slots, under her class's root (CP23);
- **the calling pick** (CP29) and **her template** (UT14) have no place on the Uma sheet, the Stable can't filter by them
  (UT15), and the Racing tab's "Learns fastest" is the retired start by style;
- **the Flourish** (★, UT6) and **the base MP regen** ("MP 296 · +12 a round", SB18) aren't on her sheet or in the fight's
  log;
- **foes** show their weaknesses as today's 2–5 icons; R1's are two, "Weak: [Lance] [Thunder]" (CP5);
- **the Rift** names its parties by class only; R1 hands each path a guided build of weapons in one tap (CP7).

This packet builds them so they follow the domain's live generation (and a fight's own version): the deployed game shows
**nothing new** until H72. You preview them with a local switch, never committed.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md` (player-facing text is short; 44 pt targets; 390×844 and 375×667; no explanations on a screen,
  a help button where one helps), `docs/change-protocol.md` (nothing here is uma-kit's: the profile frame's `chips` slot,
  the Stable's facets and `BottomSheet` take game content as data; if you find you need a kit change, stop and file a
  "Both apps:" request).
- [class-progression.md](../../design/tier-rework/class-progression.md) §6.1 (CP23), §6.2, §6.7 (the root), §8.2 (a
  Learner's Heroes as coverage), §10.2 (the calling card), §4 (weaknesses on a card); [uma-templates.md](../../design/tier-rework/uma-templates.md)
  §3.3 (the Flourish's lines), §5 (UT14's spots, UT15's facets), §6 (worked Umas); [stat-balance.md](../../design/tier-rework/stat-balance.md)
  §7.2 ("MP 296 · +12 a round"). The D-rows of H64–H69 (H64's decision 5: what the template shows in R1).
- The manual of today's screens: [sections.md](../../game/sections.md) § Stable, § Learning; [classes.md](../../game/classes.md).
- **The domain you read** (each answers by generation, defaulting to the live switch): H64 `rpgRework`, `rpgClassSlots`,
  `rpgPicksWeapons`, `RPG_WEAPON_SLOTS`; H65 `rpgTreeView`, `rpgSkillRank`, `rpgSkillRankNextAt`, `rpgSkillRankFactor`,
  `rpgSkillRankUps`, `RPG_BRANCH_B_NAME`, `rpgNodeSkill`; H66 `rpgAnsweredTwinSets`, `RiftFrontSpec.build`,
  `riftGuidedBuild`; H67 `umaTemplate`, `umaCallingPick`, `umaCallingPickBlock`, `umaFlourishActive`,
  `umaTemplateFacets`, the name and label tables; H68 `rpgBaseMpRegen`, `BATTLE_FLOURISH_*`; H69 `pickBranch`,
  `pickCalling`, `confirmCalling`, `OwnedUma.calling`.
- **The screens** (lines on `421eacd`):
  - `apps/web/src/places/stable/SkillsPage.tsx`: 1–6 the header; 63–71 the help sheet (points, five slots); 73–83 the
    class picker; 84–102 the weapon slots (a five-column grid); 103–106 Class Rank; 109–133 equipped skills and the points
    line (112); 135–183 the trees (all of the class's kinds, sides with Learn and Swap out); 193–227 `NodeCard`.
  - `places/stable/OutfitProfile.tsx`: 43–60 the tabs and their dots; 119–124 `ProfileFrame`'s `chips` (the rarity stars:
    the game's own content, shown for locked outfits too); 164–198 `Summary` (the class chip at 177); 226–293 `BattleTab`;
    297–317 `ClassChip` (the points pill at 313); 319–331 `SkillsTab`; 443–495 `RacingTab` ("What her aptitudes do here"
    472–478, reading `STYLE_CLASSES` and `DISTANCE_GEAR`).
  - `places/stable/GearCard.tsx` 40–47 (weapon rows over her weapons: three from v16 by themselves);
    `places/stable/WeaponSheet.tsx` 1–7 (the header: "five slots", fixed Brawler and Mage), 67–90.
  - `apps/web/src/album/rows.ts` 19–33 `STABLE_FACETS`, 58–84 `albumRows` (search 74, facets 75–77).
  - `battle/labels.tsx` 60–80 `extraHit`, `skillLine` (no word for `special`), 181–189 `WeaknessIcons` (elements, then
    weapons); `battle/FoeRow.tsx` 29–31 ("Shield 4 · weak [icons]"); `places/scenario-gate/FightScreen.tsx` 345 (a foe's
    icons in a fight) and 1–5 (its header: "her five weapons").
  - `battle/battle-view.ts` 147 (the `mp` cue's text), 154 (the `heal` cue's), 171–179 (cues into the HP and MP bars).
  - `places/scenario-gate/FightResult.tsx` 50–72 (each member's bars after a win).
  - `places/scenario-gate/ActiveParty.tsx` 53 (spare side points on the world map's party).
  - `places/rift/rift-view.ts` 38, 66, 85–105 (the guidance: `bestParty`, `suggestConvergence` by class);
    `places/rift/StageSheet.tsx`, `PartyPick.tsx`.
  - `places/halls/HallPage.tsx` 64–100 (a seat: its Limit Break, Hero and Learners).
  - `packages/domain/src/save/sheet.ts` 19–53 `umaBattleSheet` (the Sustain group at 48–50: `MP`, `MP Regen`).
  - `apps/web/src/save/game.ts`: 125–128 `unlock`, 161–162 `learn`, `unlearn`; the store's edit pattern for new actions.

## Decisions made

- **Inert until the switch.** Every R1 state reads `rpgRework('fight')` (the live default) or a fight's own version
  (`rpgRework('fight', state.engineVersion)`). Before H72 the game looks exactly as it does today; after it, an open v15
  fight still shows v15's foes and log.
- **The local switch** (to preview; **never commit it**), exactly H72's three lines: `rpg/battle/caps.ts`
  `BATTLE_ENGINE_VERSION = 16`; `save/save.ts` `SAVE_SCHEMA_VERSION = 27`; `save/migrations.ts` chains `toV27` after `toV26`
  (`version < 27`). Restart the API and the web; a scratch v26 save in your worktree's `apps/api/.data` migrates on load.
- **Helpers take an engine.** Each new pure helper on the web side takes `engine` (default live), so a test passes 16
  without mocking the domain (H59's pattern).
- **The Skills tab (v16)**, top to bottom:
  - **The root plate:** her emblem, class and hand ("Spell Blade · Arms ×0.72 + Tome ×0.44"); under it her **★ Flourish**
    line: as her calling "★ Late reserve · from round 3, 2% of her max HP a round, up to 4%" (Clean break "★ Clean break ·
    a Barrier of 4% of her max HP at the start"; Even pace "★ Even pace · 1% of her max HP a round, up to 4%"); in another
    class the same line dimmed with "No effect as Mage". The class picker (six) stays.
  - **Weapons:** three slot buttons (a three-column grid), each its kind, its piece's grade ("G3" or "Training") and, small,
    its path ("A" or "B"). Tapping one opens today's weapon sheet: every class now picks any kind of the slot's channel.
  - **Equipped · 4/7**, the chips and "Back to auto" as today; **no points line**.
  - **The tree:** three tabs, one per slot (her kind with its path glyph), and the open tree drawn from `rpgTreeView`:
    depths 1–2 in one column, the fork at depth 3 into two columns, A and B, down to depth 5, joined by lines. Her path is
    filled, the other branch dimmed, a closed depth faded with its gate ("Class Rank 20"). A held node shows **five rank
    pips** and "Rank 3 · next at Class Rank 14" ("Rank 5" at the top), its line (`skillLine` with its rank's factor and a
    Pierce's " · cuts through the shield") and Equip. A branch's header ("A" or "B · Combo", from `RPG_BRANCH_B_NAME`)
    opens a sheet with its three skills and **"Take branch B"** (free; her equipped skills follow); the held branch's sheet
    has no button. Nodes stay at least 44 pt tall; two columns fit at 375 pt.
  - **Pierce is approved** (D192; the main session's ruling, 2026-10-25): the Spell Blade's B line shows as any branch,
    "B · Pierce", never marked "proposed", whatever older class-progression wording or the preview pages say.
  - **The help sheet (v16):** "Each weapon in her three slots opens its tree. Depths open at Class Rank 1, 10, 20, 30 and
    40. At depth 3 the tree forks: branch A or B, free to swap. Every skill gains a rank every 2 Class Ranks, up to 5. Her
    Uma Level sets how many skills she can equip; until you pick, they are chosen for her."
- **The Gear tab:** three weapon rows by itself (it maps her weapons); the weapon sheet's header comment and its fixed-slot
  note follow `rpgPicksWeapons`. Armor and accessories as today (R1 is on today's gear).
- **The template chip and card (UT14, R1's spots):** the chip "★ Clever Spellwright" sits in `ProfileFrame`'s `chips` after
  the rarity stars, so locked outfits show it too, with a small dot while her calling can still be picked. It opens a
  `BottomSheet`, "Her template": the three readings with their sources ("Calling ← Pace A, Wit 102 ≥ Power 90", or
  "Calling ← picked" when she has a pick; "Stride ← Medium A"; "Knack ← Wit +20%"), then her Flourish's line with its
  state ("★ Even pace · as a Mage · on", or "· no effect as Brawler"). Nothing about the signature, her moon, the trade or
  the tip (R2, R4).
- **The calling pick card (CP29, §10.2):** on an owned Uma's sheet, above her class chip in `Summary`, while
  `umaCallingPick(outfit)` gives options and `calling.confirmed` is false: "Her calling · choose once", two class tiles
  (emblem, class, her template's name with that pick, "★ Even pace as a Mage"), the suggested one marked ("Suggested ·
  Power 96 over Wit 88"), the current pick selected, and **Confirm**; under it, small, "Her first win confirms it."
  Tapping a tile picks it (H69's `pickCalling`; at Lv 1 her class follows). Confirmed: the card is gone.
- **The Battle tab (sheet.ts, v16):** the Sustain group's MP row reads "296 · +12 a round" (the base regen plus any
  Spring's, from `rpgBaseMpRegen` and her worn accessories), the separate "MP Regen" row goes, and a "★ Flourish" row reads
  "Even pace · 1% a round, up to 4%" (as her calling) or "No effect as Brawler". `umaBattleSheet` takes the engine (live
  default) and reads her template; the old rows stay for v15.
- **The fight:** a `heal` cue labelled `Flourish` reads "★ +30 HP" in the log; Clean break's opening `cover` cue reads
  "★ Barrier 59" (her card already shows the Barrier). An `mp` cue reads as today.
- **The result sheet:** under each member's Class Rank bar, one line a skill that ranked up ("Cleave reached Rank 3"),
  from `rpgSkillRankUps` with her Class Rank before and after the win (v16 fights only).
- **Foes (CP5):** "Shield 4 · Weak: [icons]" with the Arm first, then the element (the twins' order; Twilight: Bow,
  Katana), on the stage sheets (`FoeRow`) and the fight's foe cards, by the generation (a fight's own version on the
  fight screen). The aria label stays "Weak to Lance, Lightning".
- **The Stable (UT15):** a **Template** filter group after RPG, from `umaTemplateFacets` (an owned Uma's pick counts):
  **Calling** (six, class labels), **Stride** (Dash, Middle, Stayer), **Knack** (Fleet, Mighty, Tireless, Gritty, Clever);
  and the template's name joins the search, so "Ironhide" finds every Ironhide. `STABLE_FACETS` becomes
  `stableFacets(engine)`, the live list the Stable reads. No Signature facet (R2's).
- **The Racing tab:** from v16 "What her aptitudes do here" becomes **"Her template"**: Calling ("Mage", note "Pace A ·
  Wit 102 ≥ Power 90" or "Picked"), Stride ("Middle", note "Medium A"), Knack ("Clever", note "Wit +20%"), Flourish
  ("Even pace", note "Active" or "No effect as Brawler"). The old two rows show only before v16; H72 deletes them with
  `STYLE_CLASSES`, `DISTANCE_GEAR` and `learningTime`.
- **Points retire on screen:** the class chip's points pill and the world map's spare points (`ActiveParty.tsx` 53) show
  nothing from v16 (H65 already zeroes `points`).
- **The Rift's guided builds (CP7):** where the Rift suggests a front's party (its stage sheet and party pick), each
  suggested member shows her build's three weapons as glyphs, and one button, **"Use the guided weapons"**, sets each
  member's class weapons to her build's (members matched to the build by class, in party order; `setClassWeapons` through
  a new store action; weapons are owned per kind, so it costs nothing). Shown only from v16.
- **The Halls (CP28, §8.2):** a seat card shows the twin sets its Limit Break answers ("Fire · Light"); when choosing a
  Learner, each candidate's row adds the sets the seat answers that her weapons miss ("Adds Light, Dark, Twilight"), from
  `rpgAnsweredTwinSets`. Only from v16.
- **Help sheets** that mention five weapons, side points or 2–5 weaknesses get v16 text chosen by `rpgRework('fight')`; v15
  text is unchanged. Grep `five`, `side`, `point` and `weak` in `places/` and `battle/`.
- **The manual** stays as it is (it describes the deployed game); H72 rewrites it. Note in your delivery every screen whose
  words H72 must carry into `sections.md`.
- **Main JS:** the Stable, profile, Halls, fight and Rift pages are lazy; `album/rows.ts` and `battle/labels.tsx` may sit
  in the main bundle: keep R1 strings in the lazy pages where you can. Say the number.

## Do

1. **The domain's screen helpers** (`save/sheet.ts`; `skillLine` in `battle/labels.tsx` with a rank factor and Pierce's
   words; `WeaknessIcons`' order) by generation.
2. **The Skills tab:** the root plate, three slots, the tree from `rpgTreeView`, pips, the branch sheet, the help text;
   store actions `pickBranch` (and remove `learn`/`unlearn` from the v16 path).
3. **The Uma sheet:** the template chip and card; the calling pick card with `pickCalling`/`confirmCalling` actions; the
   Battle tab's rows; the Racing tab's "Her template"; the points pill.
4. **The fight and the result:** the log's ★ lines; foes' "Weak:"; the result's rank-up lines.
5. **The Stable:** `stableFacets(engine)`, the facets and search in `albumRows`.
6. **The Rift and the Halls:** the guided weapons and their button; the seat lines.
7. **Tests:**
   - `places/stable/tree-view.test.tsx` (or a pure helper's test): a v16 Brawler at Class Rank 22 with her Lance on B
     shows three tabs, the Lance's B column filled, depth 4 faded "Class Rank 30", Sunder's pips at Rank 2 "next at Class
     Rank 24"; taking branch A sends `pickBranch(…, 'A')`.
   - `battle/labels.test.ts`: `WeaknessIcons` lists the Arm then the element from v16, today's order before; a Pierce line
     says it cuts through the shield; a Rank 5 skill's line shows ×1.05 its power.
   - `album/rows.test.ts`: `stableFacets(16)` has the Template group, `stableFacets(15)` is today's list; an invented
     Ironhide matches the search "ironhide"; an owned Uma with a Spell Blade pick counts as Spell Blade.
   - `save/sheet` cases (domain, `save/sheet-v16.test.ts`): a Class Rank 40 Mage with 296 MP and no Spring reads "296 · +12
     a round", with a G10 Spring "+22 a round"; the Flourish row on and off; v15's sheet unchanged.
   - The calling card's helper: options, the suggested mark and the confirmed state for invented Pace and Late Umas;
     no card for a Front runner.
   - `places/rift/rift-view.test.ts`: the guided weapons pair members to the build by class (two Brawlers: the first on
     defaults, the second on Bow, Katana, Axe for Iron) and only from v16.
   - Every existing web test passes unchanged.
8. **Check it locally** (your own ports; desktop browser; never the iOS Simulator), on a scratch v26 save from the CJS build
   with: a Pace Uma with Power over Wit (unconfirmed), a Brawler with side skills on her Lance and Greatsword trees, a
   Spell Blade, a Late Uma at Lv 1, and an open world-map fight:
   - **without** the local switch: every screen as today (five slots, sides and points, no template chip, today's
     weaknesses);
   - **with** it, at 390×844 and 375×667, light and dark: the Skills tab's tree (three tabs, the fork, pips, a branch swap
     moving an equipped skill), the Gear tab's three weapons, the template chip and card, the calling card (pick Mage on
     the Pace Uma: her name and Flourish change; at Lv 1 the Late Uma's class follows her pick), the Battle tab's "MP · +n a
     round" and ★ row, a v16 fight with a Late reserve heal and a Clean break Barrier in the log, "Weak:" with two icons,
     a won fight's rank-up line, the Stable's Template filters and "Ironhide"-style search on an invented name, the
     Racing tab's "Her template", the Rift's guided weapons button, a Hall seat's twin sets; the open v15 fight still
     plays as v15.
   - Describe what you saw. Say which screens touch the edges (the owner checks them on the phone after H72).
9. **Docs:** implementation.md §3: "Built: H70 (D…)". The D-row (fetch `main` first). `pnpm docs:update` leaves no diff.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 7 pass; the domain's replay fixtures stay green.
- [ ] `git diff` has no switch: `BATTLE_ENGINE_VERSION` 15, `SAVE_SCHEMA_VERSION` 26, `toV27` unchained.
- [ ] Both local checks in step 8 were done and described. Nothing from the original games in git; screenshots with
  original art stay local.
- [ ] `docs/game/` is unchanged and `pnpm docs:update` leaves no diff; the D-row is logged; the delivery lists the screens
  H72 must carry into the manual.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit; the live game looks as before.

## Deliver

- **A delegated worker (Claude or ChatGPT):** a pull request from `feat/h70-r1-screens` with one commit,
  `feat(web): R1's screens, inert until the switch (H70)`. H71 edits the domain's balance and Rift files at the same time
  (no web files): rebase if your domain edits (`save/sheet.ts`, `rift/fronts.ts`) meet. Fetch `main` before you push.
  Claude's main session reviews and merges it (ChatGPT may merge its own), then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H70 done (D…)` commit deletes this file, sets H70 to Done with a
  Done row (listing the screens for H72's `sections.md`), and sets H72 to Ready if H69 and H71 are done.
