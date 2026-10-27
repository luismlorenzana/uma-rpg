# H95 — R4's screens, inert until the switch: the class tree, the branch pick, branch C and the tips, the focus

**uma-rpg · Either · L · Needs: H94, H93 (and through them H91, H92) · Unblocks: H97**

> **Versions re-planned by D221, D224 and D230 (2026-10-27):** saves v29 (tickets-only grant), v30 (the farm by line) and
> v31 (the Wilds' trios, H114) are taken and live. Read this packet's save v29 as **v32**, v30 as **v33** and v31 as
> **v34**; engines unchanged. Materials, recipes and the three-place rows are the farm by line's
> ([farm-by-line.md](../../design/tier-rework/farm-by-line.md)): re-read them before any step that names R2's pairs, the
> ladder or a cross-line recipe.

## Why

H91–H94 built Tier 2's classes dark: the class branches and their focus, the 36 class skills, branch C, the Power or
Break tip and the signature tip, ten slots, LB+, and save v30 to hold the picks. The player meets them on screens that
don't know them yet. The owner's ask was visibility ("feels like almost nothing changes", CP26): flipping a branch must
show a new focus, a new set and three new skills; the focus must be marked where it pays; her signature tip must carry
its ★ (UT14).

This packet builds them so they follow the live engine and save (and a fight's own version), which means the deployed
game shows **nothing new** until H97 flips the switch. You preview them with the local switch, never committed.

## Context (read first)

Code pointers are by file and function: Releases 1–3 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md` (player-facing text is short; no paragraphs on a screen, explanations behind an (i) help
  button; 44 pt targets; 390×844 and 375×667; main JS ≤ 230 KB gzip), [change-protocol.md](../../change-protocol.md)
  (nothing here is drawn by uma-kit: tabs, sheets and chips take values; if you find you need a kit change, stop and file
  a "Both apps:" request in uma-platform).
- **The design:**
  - [class-progression.md](../../design/tier-rework/class-progression.md) §6.1 (CP23: the Skills tab as a real tree,
    rank pips, "Cleave · Rank 3 · next at Class Rank 14"), §6.3, **§6.7** (the root plate per tier), **§7.2** (the
    branch tables; "Use the Light/Dark set: Bow, Katana, Axe"; the focus mark), §12's "The Skills tab and the Uma sheet"
    and "The party screen (Tier 2)" rows (CP41's hint).
  - [uma-templates.md](../../design/tier-rework/uma-templates.md) §3.5 (the signature tip), **§5 (UT14: the Skills
    tab's tip fork, ★ drawn dashed until picked; the template card's "Tip · Spillover · Fire Tome tree" line; the Battle
    tab)**, §3.8 (only as her calling).
  - [tier2-classes.md](../../design/tier2-classes.md) §7 (LB+: "each is one line under the seat in the hall"; the
    cut-in names it "Arsenal Rush+").
- **The D-rows of H91–H94** (H91's first row: R4's build decisions, the group names and their two clashes) and each
  packet's "Decisions made". The words this packet uses come from there.
- **The domain you read** (all engine- or tier-aware, defaulting to the live switch): H91's `RPG_WEAPON_GROUPS`,
  `rpgWeaponGroup`, `rpgFocusKinds`, `RPG_CLASS_BRANCHES`, `rpgBranchFocus`, `rpgBranchSet`, `BATTLE_FOCUS_BONUS`,
  `classPreset(…, branch)`; H65's tree model `rpgTreeView(profile, loadout, engine)` (`rpg/tree-view.ts`: one entry a
  slot, nodes with line, held, open, gate, rank, next rank) and H92's C line (`RPG_BRANCH_C_NAME`), `rpgActiveSlots`, the
  `plus` on each `HeroLimit`; H93's
  `rpgPartyMissing`; H94's `setClassBranch`, `wearClassPreset(…, branch)`, R1's line setter with `'c'`, `setTip`, and
  the sheet (`umaBattleSheet`).
- **The screens:**
  - `apps/web/src/places/stable/`: `SkillsPage.tsx` (R1's tree view: the root plate, weapon tabs, nodes with pips,
    `NodeCard`), `OutfitProfile.tsx` (`BattleTab`, `ClassChip`, `SkillsTab`, the template card from R1), `GearCard.tsx`,
    `WeaponSheet.tsx`, `PresetButton.tsx`.
  - `apps/web/src/battle/labels.tsx` (`WEAPON_LABEL`, `CLASS_LABEL`, `skillLine`, `STATUS_LABEL`, `kindLabel`; it is in
    the main bundle), `battle/battle-view.ts` (`skillChoices`, `pairing`, `actionFor`, `previewTarget`,
    `limitOptions`, `describeCue`), `places/scenario-gate/FightScreen.tsx`.
  - `apps/web/src/places/halls/HallPage.tsx` (seats, Heroes, Learners, Bonds).
  - `apps/web/src/places/party-hall/PartyHallPage.tsx` and `healer-note.ts` (the pattern for a party's note).
  - `apps/web/src/places/rift/` (`rift-view.ts`'s `bestParty`, `suggestConvergence`; the stage sheet's guidance).
  - `apps/web/src/save/game.ts` (the web's actions over the domain's setters).

## Decisions made

- **Inert until the switch.** Every new state reads the live engine and save (`rpgRework('t2Classes')`), the world's
  tier, or a fight's own `engineVersion`. Before H97 the game looks exactly as it does today; an open v18 fight after
  the switch shows no class skills.
- **The local switch** (to preview; **never commit it**), exactly H97's change: `caps.ts` `BATTLE_ENGINE_VERSION = 19`;
  `save.ts` `SAVE_SCHEMA_VERSION = 30`; `migrations.ts` chains `toV30` after `toV29`. Restart the API and the web; a
  scratch v29 save in your worktree's `apps/api/.data` migrates on load.
- **The words** (the owner's names, H91):
  - a group alone: "Heavy Arms", "Lite Arms", "Elemental Tomes", "Arcane Tomes";
  - **the focus label:** a pure class her one group ("Heavy Arms", "Arcane Tomes"); the four between both
    ("Heavy and Elemental", "Lite and Arcane"); with the bonus: "Heavy and Elemental · +15%" (from
    `BATTLE_FOCUS_BONUS`);
  - **chips** carry one group word, her lead channel's ("Spell Blade · Rune Knight · Heavy", "Cleric · Bishop ·
    Arcane", "Mage · Sage · Elemental"). **Why:** a chip must fit at 390 pt, the lead channel is her first slot's, and
    the plate spells the focus in full;
  - each weapon row (Gear tab) and weapon tab (Skills tab) shows its own kind's group word under its name;
  - tips: "Power", "Break", and her signature's own name with ★ ("★ Quickstep"); a Break tip's skill reads
    "{tip} · Break" ("Meteor Strike · Break");
  - LB+: "{Limit Break}+" ("Arsenal Rush+").
  No "Ring" or "Light/Dark" anywhere. "Arcane" always with its noun, so it never reads as the Rift's front.
- **The tree model stays the domain's** (H65's pattern: the web draws, the domain decides). `rpgTreeView` (`rpg/tree-view.ts`)
  gains, from tier 2 at v19 and with the engine argument: her class tree (her branch, its focus and its three nodes with
  gate, rank and next rank), the C line among each tree's lines, each held tip's options (Power, Break, and ★ her stride's
  tip only on `weapons[0]` as her calling's class, `umaTemplate` passed in), the picked tip, and each tree's focus mark.
  Tested in the domain, so the web stays thin and a ChatGPT worker needs no engine knowledge.
- **The Skills tab, tier 2 on** (CP23, §6.7, UT14), R1's tree grown:
  - **The root plate** gains her class branch: two tiles, branch 1 then 2, each its name and focus label, the held one
    marked. Tapping the other opens a sheet: the branch's name, its focus label, its three class skills with their Class
    Ranks ("Rallying Roar · 20"), and two buttons: **Switch** (`setClassBranch`) and **Switch and use the set** with the
    set's three weapons ("Bow · Katana · Axe"; `setClassBranch` then `wearClassPreset(…, branch)`). Free, instant,
    refused only where the domain refuses (an open fight).
  - **Her class tree** sits beside the three weapon tabs as a fourth tab, "Class" (her branch's name under it): its three
    nodes at Class Rank 20, 30, 40 with five rank pips each and "next at Class Rank n", locked depths faded with their
    Class Rank, each node's line from `skillLine` (a class skill names what it casts through: "through a Heavy Arm").
  - **The fork** shows C beside A and B from tier 2.
  - **The tip fork** at depth 5: Power · Break, and on **her first slot's tree, as her calling, ★ her signature** drawn
    dashed until picked (UT14). As another class the option isn't offered (UT12); nothing explains its absence on
    screen (the template card says "No effect as Mage", as R1 built it).
  - **The focus mark** on her focus trees' tabs and headers: "Heavy Arms · +15%".
  - **Ten equipped slots** where `rpgActiveSlots` gives them.
- **The template card** (R1's): its tip line reads live, "★ Tip · Spillover · Fire Tome tree", "· not picked" until she
  picks it, and is hidden in tier 1.
- **The Battle tab** (`BattleTab`): a "Focus" row with the focus label and +15%; each offense row of a focus kind
  marked +15%; "★ Quickstep · Greatsword tree" when her signature tip is picked and live; her LB+ when she holds one at
  Bond 10 ("Arsenal Rush+"). Numbers come from the sheet (`umaBattleSheet`), never recomputed.
- **The fight screen** reads the fight's version (`state.engineVersion`):
  - a class skill shows in her skill list with the weapon it casts through; the default is the focus weapon that lands
    weak on the tapped foe, else her first focus weapon of its channel (Auto's rule); when she holds two of that
    channel, a small toggle picks the other; the action carries `via`; utility class skills have none;
  - the preview and cue text name the new pieces: "Frenzy", "Guarding <Uma>", "Braced" for Rune Guard's cut, "Barrier
    +N" on herself, "{tip} · Break", "Arsenal Rush+" in the Limit Break menu and its cut-in;
  - no new stage animation: the new hits are ordinary hit cues.
- **The halls** (`HallPage`): in a tier 2 or later world, each seat shows one line under it, "LB+ at Bond 10: <its
  effect in a few words>" (tier2-classes §7.2), and a Hero or Learner at Bond 10 carries an "LB+" mark. Nothing in
  tier 1.
- **The Party Hall** (CP41): a tier 2 party whose weapons miss a kind carries a note in the warning colour, text not an
  icon alone: "No Bow in this party" (one line per missing kind, two at most, else "Missing 3 kinds"), from H93's
  `rpgPartyMissing`; an (i) sheet lists which branches' sets hold each missing kind ("Bow: a Warlord, a Blademaster, a
  Warlock, a Templar or a Bishop"). It never blocks a pick, a class or a fight. A `kinds-note.ts` beside
  `healer-note.ts`.
- **The Rift:** the guidance names each guided member's branch from tier 2 ("Brawler · Warlord"); where R1's guided
  build re-specs a member in one tap, in tier 2 that tap also sets her branch (`setClassBranch`). The suggestions
  (`bestParty`, `suggestConvergence`) are unchanged.
- **The weapon moon's picker** (H88's, on the Observatory; H85: "R4 orders them by her class branch's groups"): from
  tier 2 at v19 her three slotted kinds first, then her focus's other kinds, then the rest.
- **Help sheets** ((i), short): the focus, the class skills, branch C and the tips, the signature tip, LB+. Text chosen
  by the live predicate; tier 1's sheets are unchanged.
- **The manual** stays as it is (it describes the deployed game); H97 rewrites it from what you built. Note in your
  delivery each screen whose words H97 must carry into `sections.md`.
- **Main JS:** the Stable, Halls, Party Hall, fight and Rift pages are lazy; `labels.tsx` is in the main bundle, so keep
  the new label tables small (or in the lazy pages) and say the number.

## Do

1. **Labels** (`battle/labels.tsx`): group, focus and chip words, tip names, LB+ names, class-skill lines.
2. **The tree model** (`rpg/tree-view.ts`) as decided.
3. **The Skills tab and the profile** (`SkillsPage.tsx`, `OutfitProfile.tsx`): the plate's branch tiles and sheet,
   the Class tab, C on the fork, the tip fork with ★, the focus marks, ten slots, the template card's tip line, the
   Battle tab's rows, `ClassChip`, the Gear tab's group words.
4. **The fight** (`battle-view.ts`, `FightScreen.tsx`): class skills with `via`, the new cue text, LB+ names.
5. **The halls, the Party Hall and the Rift** as decided.
6. **Help sheets.**
7. **Tests:**
   - `battle/labels.test.ts`: the focus label for each of the twelve branches (a Berserker's "Heavy Arms", a Sorcerer's
     "Arcane Tomes", a Rune Knight's "Heavy and Elemental", a Bishop's "Lite and Arcane"); the chip word by lead channel
     for all twelve; "Meteor Strike · Break"; "★ Quickstep"; "Arsenal Rush+"; no label contains "Ring" or "Light/Dark".
   - `rpg/tree-view-v19.test.ts` (the domain): nothing new in tier 1 or at v18; at v19 in tier 2 her branch's three
     class nodes at Class Rank 20, 30, 40, a Class Rank 34 Uma's at Ranks 5, 3 and locked; both branches with their
     focus and set (the Warlord's Bow, Katana, Axe); C among the lines; Power and Break on every held tip; ★ her
     stride's tip only on `weapons[0]` as her calling's class; the focus mark on her focus trees only.
   - `places/stable/` (the drawing): the plate's tiles and the switch sheet render from a tree-view fixture; the tip
     fork draws ★ dashed until picked.
   - `battle/battle-view.test.ts`: on a v19 state, `skillChoices` include her class skills with their `via` options
     (her focus weapons of the channel; any weapon of it when she holds none); the default `via` lands weak on the
     target; `actionFor` builds an action the engine accepts; `limitOptions` names LB+ at Bond 10; a v18 state is
     unchanged.
   - `places/party-hall/kinds-note.test.ts`: a tier 2 party of a Berserker, a Rune Knight, a Sorcerer, a Conjurer and a
     Guardian reads "No Bow in this party"; with a Bishop for the Guardian, no note; three missing kinds read "Missing 3
     kinds"; tier 1, or the live game before the switch, no note.
   - `places/halls/lb-plus.test.ts` (a pure helper): each seat's LB+ line in tier 2 at v19; none in tier 1.
   - Every existing web test passes unchanged; the domain's replay tests stay green.
8. **Check it locally** (your own ports; a desktop browser; never the iOS Simulator), on a scratch v29 save with a Tier 2
   world holding: a Class Rank 34 Brawler whose calling is Brawler (Dash stride) with a Hero at Bond 10, a Spell Blade, a
   Cleric, the no-Bow party above, a Rift run signed up:
   - **without** the local switch: every screen as today;
   - **with** it, at 390×844 and 375×667, light and dark: the plate's tiles, the switch sheet and "Switch and use the
     set" (her Gear tab then shows the reverse set), the Class tab and its pips, C on a fork, the tip fork with ★
     Quickstep dashed on her Greatsword tree and absent once she switches to Mage, the focus marks, the template card's
     tip line, the Battle tab's focus and ★ rows, the chips and the Gear tab's group words; a v19 Tier 2 fight on Auto
     and by hand, casting a class skill through a picked focus weapon, a Break tip's double chip, Frenzy's and Vigil's
     text and an LB+ cut-in; a hall's LB+ lines; the Party Hall's note and its (i); the Rift's guidance with branches.
   - Describe what you saw. Say which screens touch the edges (the owner checks them on the phone after H97).

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (of 230 KB).
- [ ] The tests in step 7 pass; the domain's replay tests stay green.
- [ ] `git diff` has no switch: `BATTLE_ENGINE_VERSION` 18, `SAVE_SCHEMA_VERSION` 29, `toV30` unchained.
- [ ] Both local checks in step 8 were done and described. Nothing from the original games in git; screenshots with
  original art stay local.
- [ ] `docs/game/` is unchanged and `pnpm docs:update` leaves no diff; the D-row is logged; class-progression §6.7 and
  §7.2 gain "Screens built in H95 (D…), live from H97."
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`; the live game looks as before.

## Deliver

- **A delegated worker (Claude or ChatGPT):** a pull request from `feat/h95-r4-screens` with one commit,
  `feat(web): R4's screens, the class branches and the tips, inert until the switch (H95)`. Fetch `main` before you push
  so the D-number is free. Claude's main session reviews and merges it (ChatGPT may merge its own, logging its
  decisions), then watches the deploy. The delivery lists the words H97 carries into `sections.md`.
- **Flag it done:** after the merge, a `docs(handoff): H95 done (D…)` commit deletes this file, sets H95 to Done with a
  Done row, and sets H97 to Ready if H96 is done.
