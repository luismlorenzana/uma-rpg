# H34 — "Can upgrade" badges

**uma-rpg · Either · M · Needs: nothing · Unblocks: nothing**

## Why

The owner wants to see which Umas can be made stronger right now, and where:
- a better weapon, armor piece or accessory she can wear;
- skill points she can spend;
- Extra Stats she can grant.

Today only two hints exist: the profile's class chip shows "N pts", and the Skills page says how many points are left.
The Observatory lists the gems she can set, but only once you open it on her. Nothing on the Stable says which Umas
can upgrade. This is classes v2 §7 ("Can upgrade" highlights, D160), which ships now on its own.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, `docs/change-protocol.md`, and uma-platform's master prompt
  (`docs/handoff/master-prompt.md`). Checks are local only: the repo's checks and the dev server in a desktop browser
  at phone width. Never the iOS Simulator (uma-platform P60).
- **Design:** `docs/design/classes-v2.md` §7. D159 (tiers), D160 (classes v2) and D161 (the Rift) at the end of
  `docs/decisions.md`. None of them is built yet.
- **Manual:**
  - `docs/game/sections.md` § Stable (the roster, the profile, the Skills page) and § Observatory;
  - `docs/game/loops.md` § Ranks and § Extra Stats and gear (D119: in-order binding; active nodes 5 + ⌊level ÷ 2⌋);
  - `docs/game/materials.md` § Gear;
  - `docs/game/classes.md` § Skills: depths, points and slots (one side point per Class Rank, per class).
- **Gear rules** (`packages/domain/src/save/forge.ts`, `economy/gear.ts`, `economy/gear-id.ts`, `economy/ranks.ts`):
  - `uma.gear.equipped` is keyed by weapon type (one piece per weapon), armor slot and accessory slot (D124);
  - `boundGrade(uma, type)` is the best grade she has bound on a track; Training is 0;
  - `equipBlock(uma, id)` says why she can't wear a piece:
    - her rank (`gearLevel`) must be at least its grade;
    - a stock piece must be exactly `boundGrade + 1` (D119);
  - `gearChoices` is what a slot's sheet lists;
  - `slotKind(uma.gear, slot)` is the armor kind a slot holds now;
  - `gearId(type, grade)` builds `<type>-g<grade>`;
  - `world.gear` is the shared stock of unbound pieces.
- **Target planning** (`save/targets.ts`): its `gearTypes` uses the same tracks this packet counts. It takes the class
  from a callback, `activeClassOf`, because the domain has no master data. `activeClass(outfit, uma)` lives in
  `save/battle.ts`; `classOf(uma, classId)` gives a class's weapons and learned sides.
- **Points** (`packages/domain/src/rpg/rules.ts`, `rpg/node-identity.ts`):
  - `rpgTreePointsEarned(classRank)` and `rpgTreePointsSpent(tree)`;
  - `rpgLearnBlock(profile, id)`: a side opens at Class Rank 5, 15 … 45 (`rpgSideNodeLevel`), costs its depth, and
    one fork side only;
  - `rpgProfileTrees({ classId, weapons })`: the trees of her five weapons;
  - side ids are `<class>-<weapon>.<depth><a|b>`.

  A side can't be learned at Class Ranks 1–4, though points are earned from rank 1.
- **Stars** (`economy/stars.ts`, `save/observatory.ts`, `economy/pacing.ts`):
  - `gemIdentity`, `gemNodes`, `nodeGrade` and `GEM_IDENTITIES`;
  - `gemBlock` / `nodeFromGem`: a gem opens the node of its own grade once every lower node of its track is open;
  - `activeNodeSlots(level)`;
  - `world.gems` is the stock;
  - `setGem` switches the new node on when a slot is free.

  The Observatory's Set list (`apps/web/src/places/observatory/ObservatoryPage.tsx`, `settable`) filters
  `world.gems` with `nodeFromGem`.
- **The Stable** (`apps/web/src/places/stable/StablePage.tsx`):
  - `Roster` renders the kit's `AlbumChrome` and `AlbumGrid`;
  - its rows come from `albumRows` in `apps/web/src/album/rows.ts`, inside one `useMemo` that reruns every 30 s
    (`useNow`);
  - **all four corners are used today:** class top left (`ClassEmblem`), working top right ("W"), target bottom left
    (`TargetIcon`) and **New bottom right** (the manual forgets New);
  - the Filters sheet has boolean facets already (`new`, `free`).

  `albumRows` is also called, unmemoized, by the Observatory, Party Hall, Halls, Exchange, Featured, StablePeek and
  FacilityPage.
- **The kit, pinned at 0.9.1** (uma-platform `packages/kit/src`):
  - `album/art.tsx`: `FaceTile`'s `FaceTileBadges` takes any `ReactNode` per corner, so the tile needs **no kit
    change**;
  - `album/AlbumChrome.tsx`: its `presets` prop draws "Quick picks" chips in the Filters sheet. The Stable passes none
    today;
  - `places/ProfileFrame.tsx`: `ProfileTab` is `{ key, label: string }`, so a tab can't show a badge. **This needs a
    kit change** (Do 1);
  - `ui/icons`: `LevelUpIcon`, a double up-chevron;
  - `shell/BottomBar.tsx`: badges in `bg-success` with `text-ink-on-dark`, the kit's "ready" look.

  uma-platform's main is at kit 0.10.0, whose only change is `TargetsStrip`'s optional `grade`; uma-racer's
  `Profile.tsx` uses `ProfileFrame`.
- **The profile** (`apps/web/src/places/stable/`):
  - `OutfitProfile.tsx`: `TABS`/`TAB_LABEL`, the `ProfileFrame` call (`tabs=…`), `ClassChip` (the "N pts" pill, from
    the raw unspent points), and `GearTab` (the Extra Stats button: "a/b active · n/100 · map ›");
  - `GearCard.tsx`: its rows for weapons, armor and accessories;
  - `SkillsPage.tsx`: the weapon slot buttons and "N points for side skills".
- **The save hook:** `useWorld()` in `apps/web/src/save/game.ts`. Every save change makes a new `TierWorld` object
  (rules return new worlds), so the object itself is the revision.

## Decisions made

- **Actionable now only.** A badge means one tap fixes it: a piece or a gem in stock, or points or a slot she already
  has. What could be crafted doesn't count. Targets already plan crafting (D100).
- **Gear: which slots count.**
  - Her active class's five weapons.
  - Each armor slot's current kind.
  - Each filled accessory slot's type.

  Picking another weapon or the other armor kind is a build choice, not an upgrade, so it doesn't count.
- **Gear: an empty accessory slot counts** when an accessory type she can wear there is ready: in stock, or in her
  locker, and not the other slot's type. Filling an empty slot is pure gain. With two empty slots, the count is at most
  the number of such types.
- **Gear: what "better" means** is the D119 rule the sheets use. Either:
  - the stock holds the next grade (`boundGrade + 1`) and her rank allows it; or
  - she has her own piece above the one she wears.

  Each slot counts once.
- **Points:**
  - Her active class only, and only the trees of her five weapons.
  - The count is her unspent points, and only when a side skill there can be learned now (`rpgLearnBlock` is null).
    Otherwise it's 0.
  - Other classes' points do nothing until she switches, and points before Class Rank 5 buy nothing.
- **Extra Stats:** stars = gems + free nodes.
  - Gems: the gem kinds in stock she can set now. This is the Observatory's Set rule.
  - Free nodes: free active slots, up to her open nodes that are off.
  - Swapping a weak active node for a stronger one is a choice, so it isn't counted.
- **One pure domain selector**, `upgradesFor(world, outfitId, classId, tier = 1)`, in a new
  `packages/domain/src/save/upgrades.ts`. The caller passes the class, as `targetPlan` does, so the domain needs no
  master data. Its return type:

  ```ts
  export interface UmaUpgrades {
    /** Slots that can take a better piece now: a weapon type of her five, an armor slot or an accessory slot. */
    gearSlots: GearSlot[]
    gear: number       // gearSlots.length
    points: number     // her active class's unspent side points, or 0 when no side skill can be learned now
    gems: number       // Star Gem kinds in stock she can set now
    freeNodes: number  // open nodes she could switch on now
    stars: number      // gems + freeNodes
    any: boolean
  }
  ```

  It returns null for an Uma who isn't owned.
- **Cheap by construction.** No call scans the whole stock per slot.
  - Gear checks look up `world.gear[gearId(type, best + 1)]`.
  - Gem checks use a `Set` of her open nodes.
  - Tests prove both match `gearChoices` + `equipBlock` and `nodeFromGem`, so there is still one rule.
- **Memoized per world.** `apps/web/src/album/upgrades.ts` keeps a `WeakMap<TierWorld, Map<outfitId, UmaUpgrades |
  null>>`, filled per Uma on first ask.
  - The Stable fills it for every owned Uma; the profile fills one Uma.
  - `albumRows` stays as it is, so pickers and quick looks pay nothing.
  - The 30-second `useNow` rerun hits the cache.
- **The Stable tile:**
  - a green disc in the bottom-right corner (`bg-success`, `text-ink-on-dark`, `ring-2 ring-panel`, 16 px) with the
    kit's `LevelUpIcon`, named "Can upgrade";
  - New keeps the corner while an outfit is unseen. New clears on the first open, and only owned Umas get the disc;
  - same in all three views. No kit change: corners take any node.
- **Green, not gold.** Gold already means New and target, and green is the kit's "ready" badge.
- **A filter and a quick pick:**
  - a boolean facet `upgrade`, "Can upgrade", in the RPG group;
  - a "Can upgrade" chip in the Filters sheet's quick picks (`presets`), which turns that facet on;
  - saved views keep it like any facet.
- **The profile:**
  - **Tabs:** a green dot on **Skills** when `points > 0`, and on **Gear** when `gear > 0` or `stars > 0`. Extra
    Stats is reached from the Gear tab. This needs `ProfileTab.dot` in the kit.
  - **The class chip:** its "N pts" pill shows `points` from the selector, in green, so it only shows when a side
    skill can be learned.
  - **The Gear tab:**
    - each row in `gearSlots` gets a small green `LevelUpIcon` at its right;
    - the Extra Stats entry gets a green pill: "N to set", "N free", or both joined by " · ".
  - **The Skills page:** its weapon slots in `gearSlots` get the same mark.
  - The Skills page's "N points for side skills" line and the Observatory stay as they are.
- **The kit change is a dot, not a count.** The new fields are `ProfileTab.dot?: boolean` and
  `ProfileTab.dotLabel?: string`, the tab's accessible name while the dot shows.
  - Five tabs share about 70 pt each on a phone, so a dot keeps every label whole. Counts live inside the tab.
  - It's optional, so uma-racer looks the same and keeps its pin.
  - It ships in the next kit minor: 0.11.0 if 0.10.0 is still the latest.
- **In-app only:** no push notification, no Hub pip, no bottom-bar badge and no count on the Stable's quick look.
  With one shared stock, most Umas light up at once, so the Stable's filter is the list.
- **Words:** "Can upgrade", "N pts", "N to set", "N free". Accessible tab names are "Skills, can upgrade" and "Gear,
  can upgrade". No help text: the marks sit on the thing to tap.
- **Later designs fit without a rework:**
  - D159's Tier 1 with core skills only will read 0 points through `rpgLearnBlock`;
  - D160's typed accessory slots will narrow the empty-slot rule to the slot's own type (an Orb, or a Talisman or
    Amulet).

## Do

1. **Both apps (uma-platform first):** a dot on profile tabs.
   - In `packages/kit/src/places/ProfileFrame.tsx`, add `readonly dot?: boolean` and `readonly dotLabel?: string` to
     `ProfileTab`.
   - The tab button holds its label in a truncating span. When `dot` is set, a 6 px `bg-success` dot follows it
     (`aria-hidden`, `shrink-0`), and the button's `aria-label` is `dotLabel`. The 44 pt height and today's look
     without a dot don't change.
   - Add a case to `places/frames.test.tsx`: "draws a tab's dot and names it by dotLabel; no dot by default".
   - Update the `ProfileFrame` line in `packages/kit/README.md`.
   - Add a minor changeset: "`ProfileFrame`: a tab can show a small green dot (`dot`), named by `dotLabel`. Tabs
     without it draw as before."
   - Log a P-decision in uma-platform's `docs/decisions.md` (next free; P66 today).
   - Before releasing:
     - copy the build into uma-rpg, as the master prompt says, and look at the dot;
     - run uma-racer's `pnpm lint && pnpm test` on the same build. Racer passes no dot, so it should show no change.
   - Release by uma-platform's queue README, § "Releases while packets run in parallel". Wait until
     `gh api /user/packages/npm/uma-kit/versions --jq '.[].name'` lists the version.
2. **The selector.** Write `packages/domain/src/save/upgrades.ts` with `UmaUpgrades` and `upgradesFor` as decided, and
   export it from `packages/domain/src/index.ts`.
   - **Gear, per slot.**
     - `worn` is the grade of the piece in the slot (0 for Training or empty; for armor, only a piece of
       `slotKind`).
     - The slot counts when either holds:
       - `boundGrade(uma, type) > worn`;
       - `boundGrade + 1 ≤ gearLevel(uma.ranks, type)` and `world.gear[gearId(type, boundGrade + 1)] > 0`.
     - For an empty accessory slot, check every type in `ACCESSORY_TYPES` except the other slot's type with
       `worn = 0`.
   - **Points.**
     - Build the learner as `{ classId, tier, classRank: classRankOf(uma.ranks, classId), tree: classOf(uma,
       classId).tree.map(id => ({ tier, id })) }`.
     - `unspent = rpgTreePointsEarned − rpgTreePointsSpent`.
     - Walk `rpgProfileTrees` × depths 1–5 (only depths ≤ `unspent`) × a/b. Stop at the first id where `rpgLearnBlock`
       is null.
     - `points` is `unspent` if one was found, else 0.
   - **Stars.**
     - `open = new Set(uma.stars.unlocked)`.
     - A gem in stock counts when the first node of `gemNodes(identity)` that isn't in `open` has the gem's grade.
     - `freeNodes = max(0, min(activeNodeSlots(level) − active, unlocked − active))`.
   - Add `upgrades.ts` to the `save/` row of `docs/game/architecture.md`.
3. **Domain tests:** `packages/domain/src/save/upgrades.test.ts`.
   - "counts a weapon slot when the next grade is in stock and her Weapon Rank allows it".
   - "skips stock above her rank, two grades ahead, or of a weapon outside her five".
   - "counts her own better piece she isn't wearing".
   - "counts armor only of the kind each slot holds".
   - "counts an empty accessory slot she can fill, never with the other slot's type".
   - "agrees with each slot sheet's enabled choices (`gearChoices` + `equipBlock`)": over a mixed stock, a slot is in
     `gearSlots` exactly when its sheet offers an enabled piece above the worn one.
   - "counts points only when a side skill can be learned now": 0 at Class Rank 1–4, 0 when every open fork is taken,
     and other classes' points ignored.
   - "counts settable gem kinds and free active slots, agreeing with `nodeFromGem` for all 100 gems".
   - "returns null for an Uma not owned; a fresh Uma with an empty stock has nothing".
   - "computes 268 Umas against a full stock in under 100 ms". The stock holds all 400 pieces and 100 gems. This
     generous guard catches an O(stock) scan per slot.
4. **Memo and rows:** write `apps/web/src/album/upgrades.ts`.
   - `umaUpgrades(world, outfit)` uses the per-world WeakMap and `activeClass(outfit, uma)`.
   - `withUpgrades(rows, world)` adds `upgrades: UmaUpgrades | null` and `facets.upgrade: boolean` to `RpgUmaRow`s.
     `albumRows` gives `upgrades: null` and `upgrade: false`.
   - In `rows.ts`, add the facet to `STABLE_FACETS` and export
     `STABLE_PRESETS = [{ key: 'upgrade', label: 'Can upgrade', apply: q => ({ ...q, filters: { ...q.filters,
     upgrade: true } }) }]`.
   - Tests, `apps/web/src/album/upgrades.test.ts`:
     - "caches per world: the same world returns the same object; a new world recomputes";
     - "withUpgrades sets the facet, and the Can upgrade preset keeps only those Umas".
5. **Pin the kit** in `apps/web/package.json` to the released version and run
   `NODE_AUTH_TOKEN=$(gh auth token) pnpm install`. 0.10.0's optional `TargetsStrip` grade comes along unused.
6. **The mark:** `apps/web/src/ui/UpgradeMark.tsx`, the green disc with `LevelUpIcon`, `role="img"`,
   `aria-label="Can upgrade"`, and a `size` prop (16 on tiles, 18 on gear rows, 14 on weapon slots).
7. **The Stable** (`StablePage.tsx`):
   - in the same `useMemo`, use `withUpgrades(albumRows(…), world)`;
   - `bottomRight` shows New when `row.isNew`, else `<UpgradeMark />` when `row.upgrades?.any`;
   - pass `presets={STABLE_PRESETS}` to `AlbumChrome`.
8. **The profile** (`OutfitProfile.tsx`, `GearCard.tsx`, `SkillsPage.tsx`):
   - compute `umaUpgrades(world, outfit)` once in `OutfitProfile`;
   - tabs:
     - `skills` gets `dot: points > 0`;
     - `gear` gets `dot: gear > 0 || stars > 0`;
     - each with its `dotLabel`;
   - `ClassChip` takes `points` from the selector and turns the pill `bg-success text-ink-on-dark`;
   - `GearTab`'s Extra Stats button gets the pill;
   - `GearCard` rows and the Skills page's weapon slots in `gearSlots` get `UpgradeMark`. `SkillsPage` calls
     `umaUpgrades` itself, since `SkillsRoute` renders it too.
9. **Web tests.**
   - Add to `apps/web/src/album/adoption.test.tsx`: "marks an Uma who can upgrade on the Stable tile, and the Can
     upgrade quick pick shows only her". Every fixture Uma is a Brawler, so a stock Greatsword would mark them all.
     Give only 81001 Brawler Class Rank 5 instead, which lets her learn a depth-1 side.
   - New `apps/web/src/places/stable/OutfitProfile.test.tsx`: "shows the Gear and Skills dots, the gear row marks
     and the Extra Stats count, and drops them once used". Use the same mocks as the adoption test, plus
     `useArtUrl` mocked to null.
10. **Docs.**
    - `docs/game/sections.md` § Stable:
      - roster Filters: add "can upgrade", and say it's also a quick pick;
      - corner badges: "class top left, working top right, target bottom left, and bottom right New, or a green mark
        when she can upgrade";
      - a **Can upgrade** bullet saying in three short lines what counts (gear, points, Extra Stats, in stock now);
      - the profile's tab dots, class chip, gear row marks and Extra Stats count.
    - `docs/design/classes-v2.md` §7: mark the "Can upgrade" bullet "Built (H34, D-number)".
    - Run `pnpm docs:update`.
    - Fetch `main` and log the D-decision with the next free number (D162 today). In it: what counts, where it shows,
      the kit version, and "in-app only".
11. **Local check** (below), then deliver.

## Done when

- [ ] uma-kit's next minor is published with `ProfileTab.dot` and `dotLabel`. Its frame test passes, uma-racer's
      checks pass on it, and the P-decision is in.
- [ ] uma-rpg pins it. `pnpm lint && pnpm test && pnpm build` pass, and the main JS is under 230 KB gzip.
- [ ] These tests pass:
  - the ten cases in `packages/domain/src/save/upgrades.test.ts`;
  - the two in `apps/web/src/album/upgrades.test.ts`;
  - the new Stable case in `adoption.test.tsx`;
  - `OutfitProfile.test.tsx`.
- [ ] **Local check** in the dev server, in a desktop browser at 390×844 and 375×667, in light and dark.
  - **Setup:** use a scratch save (`LOCAL_SAVE_FILE` outside the repo) with stock seeded by editing the JSON while the
    API is stopped.
  - **The Stable:**
    - an Uma with a wearable piece, a settable gem or a learnable side shows the green mark bottom right;
    - an unseen outfit still shows New;
    - Filters → Quick picks → Can upgrade lists only marked Umas, and the facet's count matches.
  - **Her profile:**
    - the Skills and Gear dots, the gear row marks, the green "N pts" and the "N to set · N free" pill all show;
    - after equipping the piece, setting the gem and learning the side, each one goes, and so does the tile mark;
    - all five tab labels stay whole at 375 wide.
  - **Smoothness:** scrolling the Stable with 50 or more owned Umas, in all three views, has no visible hitch. After a
    save change, the browser's Performance panel shows the Stable's rows pass under 16 ms.
  - Nothing touches the screen's edges.
- [ ] The manual, `docs:update` and the D-decision are in.
- [ ] The deploy is green, and `https://uma-rpg.web.app/api/health` shows the commit.

## Deliver

- **The kit (uma-platform):**
  - Claude: commit to `main` as `feat(kit): a ready dot on profile tabs`, then the release commit
    (`chore(release): uma-kit 0.11.0`, or the version it gets).
  - ChatGPT: branch `h34-profile-tab-dot`, a pull request with that title, merged after green CI, then released.
- **The game (uma-rpg):**
  - Claude: commit to `main` as `feat: can-upgrade badges on the Stable and the Uma profile (H34)`.
  - ChatGPT: branch `h34-upgrade-badges`, a pull request with that title, merged after green CI.
- **Flag it done:**
  - delete this file;
  - add a Done row to `docs/handoff/README.md` with the commit;
  - set H34 to Done in uma-platform's queue, if it's listed there.
