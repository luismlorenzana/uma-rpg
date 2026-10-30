# H137 — Classes v3's class tree and promotion on today's Skills tab, as reusable sheets (inert until H134)

**uma-rpg · Claude · M · Needs: nothing (H126, H129, H130, H132 are on `main`) · Unblocks: H134 (the switch); H120 reuses its
sheets in profile v2's Class tab**

## Why

Classes v3 (D240) needs a screen to promote and reclass: a Tier 0 Uma at Class Rank 10 must promote, or she is stuck.
The design put that screen in profile v2's Class tab (H120), which tied the Classes v3 switch to the whole profile v2
chain (H117 → H118 → H119 → H120 → H123). The owner asked what the profile has to do with Classes v3 at all; the answer
was "only that placement", so **D252 decouples them**: this packet builds the class tree, the promotion sheet and the
Tier 0 tree on **today's** profile (the Skills tab), as standalone sheets and a pure view module that H120 later reuses
in the new Class tab. The switch (H134) then waits only on Classes v3's own packets, H133 and this one.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`. **The design:** `docs/design/classes-v3/classes-v3.md` §3 (the tree, CV1, CV8–CV11), §4
  (Tier 0, CV5–CV7), §14 (the UI: the class tree view, the promotion screen, CV32) and the previews
  `docs/design/classes-v3/previews/promotion.html` and `class-tree.html`. **The spec for the sheets** is H120's packet
  (`docs/handoff/tasks/H120-class-tab.md`): its "From the designs, exact" section for the Classes sheet, the promotion
  sheet and the Tier 0 tree, and its build decisions 3 (`class-view.ts`), 4 (the promotion's parent), 5–6 (the
  Exchange door and Back), 10 (the Tier 0 node sheet's wording), 12 (no green but Ready) and 15 (layout at 375). Build
  those parts here; leave H120's tab layout, equipped row, Limit line, weapon tiles and preset footer to H120.
- **What's on `main`** (all dark at engine v19): H126's `rpg/class-tree.ts` (`RPG_CLASS_PARENTS`, `RPG_CLASS_CHILDREN`,
  `rpgClassFamily`, `RPG_ROOT_NAME`, `rpgSuggestedPromotion`, `RPG_TIER0_SKILL`, `rpgTier0Power`, `rpgClassName` — the
  Tier 0 Mage `apprentice` shows as "Initiate", `rpgClassGate`, `rpgClassOpen`, `rpgClassClosedText`), `umaClassTree` and
  `umaHeldClasses` (root index; `RpgClassTile { classId, tier, state: on|available|ready|open|closed, rank, waiting,
  gate, suggested }`), `promoteUma` and `promotionPlan` (`save/battle.ts`; the plan carries `marks` past Rank 50),
  `chooseClass`; H129's `heroLimitHall`; H130's save v32; H132's Exchange route `/town/exchange/manual/:outfitId`
  (pushed with `{ back: true }`; closing returns with `location.state` kept) and its wordings in
  `apps/web/src/ui/rank-words.ts` (`classRankWord`, `tier0RankWord`, `waitingWord`). D244–D250 in `docs/decisions.md`.
- **Today's profile:** `apps/web/src/places/stable/OutfitProfile.tsx` (the Skills tab), `SkillsPage.tsx`, `SkillTree.tsx`,
  `ClassPicker.tsx`, `tree-view` usage, the template card; the Stable roster's upgrade marks (`album/rows.ts`,
  `save/upgrades.ts`). Find lines by name on today's `main`.
- **Copy:** profile v2's content rules C1–C10 (`docs/design/uma-profile-v2/proposal.md` §7). If H117's `copy.ts` has
  landed, put new wordings there with its copy test; if not, reuse `ui/rank-words.ts` and keep new strings in one
  module the copy test will absorb.

## Decisions made

1. **D252 (the main session, logged with this packet):** the promotion screen ships on today's profile; profile v2 is no
   longer a dependency of the Classes v3 switch. H120 reuses these sheets in its Class tab rather than rebuilding them.
2. **Standalone sheets and one pure module:** `places/stable/class-view.ts` (pure, tested, on H126's data only — tiles,
   their states, the selected tile's footer action and its words, the promotion plan's lines, the Tier 0 tree's rows),
   `ClassesSheet.tsx` (the tree: three root columns Warrior · All-Rounder · Mage, the Tier 0 row above the Tier 1 row,
   every tile's state and rank, the selected tile's footer: Switch, Promote, or its closed reason; a Manuals row that
   pushes `/town/exchange/manual/:outfitId` with `{ back: true }` after replacing the profile's entry with
   `{ sheet: 'classes' }` so Back reopens it) and `PromotionSheet.tsx` (her Tier 0 at Rank 10: its children as tiles,
   "Suggested" on `rpgSuggestedPromotion`'s child, the EXP waiting, the before → after, one footer "Promote to …").
   No sheet opens another: Promote on a Ready tile swaps the Classes sheet for the promotion sheet, and the promotion
   sheet's "Classes ›" row swaps back.
3. **Where they open today:** on the Skills tab, from v19 the class name row opens `ClassesSheet` (it replaces
   `ClassPicker` at v19; at v18 `ClassPicker` stays exactly as it is). A Tier 0 at Rank 10 shows a Ready dot on the
   Skills tab (`ProfileTab.dot`) and the class row reads "Promote"; tapping it opens `PromotionSheet`.
4. **The Tier 0 tree on today's Skills tab:** from v19 a Tier 0 shows her one skill on each of her three weapons' trees
   (`RPG_TIER0_SKILL`, `rpgTier0Power`), its rank `R{n}/10` (her Class Rank), and no lines or fork; weapons are any kind
   in any slot (today's weapon sheet already lists by slot channel: at v19 a Tier 0's slots take both channels).
5. **The roster mark:** a Tier 0 at Rank 10 counts as "can upgrade" in the Stable (one reason, "Promote"), so the
   existing mark and filter find her (`save/upgrades.ts` by generation).
6. **Inert until H134:** every v19 branch reads the live switch; at engine 18 the screens are exactly today's. Tests run
   the v19 paths with the switch mocked (`capsAt(19)`, in `*.v19.test.*` files).

## Do

1. `class-view.ts` and its tests (every tile state; the footer's action and words per state; the promotion plan's lines;
   the Tier 0 tree's rows; the Suggested child; a closed tile's reason from `rpgClassClosedText`).
2. `ClassesSheet.tsx` and `PromotionSheet.tsx` with component tests (the swap between them; Promote calls `promoteUma`
   through the store; Switch calls `chooseClass`; the Manuals row's push and the replaced history state).
3. The Skills tab at v19: the class row opens `ClassesSheet` or (Ready) `PromotionSheet`; the Tier 0 tree; the Ready dot.
4. `save/upgrades.ts`'s Promote reason by generation, and the roster mark.
5. Docs: `docs/game/sections.md` § Stable's Skills tab gains the v19 rows under a "From the switch (H134)" line (as H132
   did for the Exchange); `classes-v3.md` §14 gains "Built in H137 (D…), on today's Skills tab; H120 moves it into the
   Class tab". `pnpm docs:update` leaves no diff.
6. Check it locally (below), then log the D-row.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; main JS gzip stated (219.44 KB on CI before; the sheets are in the
  Stable's lazy chunks; under +0.3 KB in the entry).
- [ ] At engine 18 the Skills tab, the class picker and the roster are exactly today's (tests and a look).
- [ ] With the switch set to 19 **locally only** (engine 19, save 32, `toV32` chained; reverted before committing) on a
  scratch save migrated by `toV32`: a Tier 0 at Rank 1 shows her one skill on three trees; read Class Manuals at the
  Exchange to Rank 10 (the door's Back reopens the Classes sheet); the Ready dot and "Promote" appear; promote to the
  Suggested child; her Tier 1 tree opens at Class Rank 10 with lines; the Classes sheet then shows the sibling as open;
  switch to it. At 390×844 and 375×667, light and dark; one sheet fits one screen.
- [ ] Nothing from the original games in git; deployed green and `https://uma-rpg.web.app/api/health` shows the commit.

## Deliver

- **Claude, as a delegated worker:** a branch `feat/h137-classes-v3-promotion` and a pull request; the main session reviews,
  merges and deploys. Take the next free D-number for this packet's decisions (fetch `main` first; D252 is the main
  session's decoupling).
- **Flag it done:** delete this file, add a Done row in `docs/handoff/README.md`, and set H134 Ready if H133 is done.
