# H49 — Achievements: the catalog, how each is earned, the Account's list and the cut-in

**uma-rpg · Either · M · Needs: H46 (save v24 and the hook's contract) · Unblocks: H50 (the Rift page shows badges and the cut-in)**

## Why

The Rift pays achievements instead of EXP ([the Rift](../../design/rift.md) §7, R8): four seals and "Rift conquered"
gate Ascend, and the rest are titles. They're account-level ([tiers](../../design/tiers.md) §3), earned once, shown in
the Account with the date and the run. uma-art 2.11.0 already draws them (uma-platform P66, H38): eleven 24 px badges
and four 16 px front crests in the `ui` atlas.

H46 fixed the catalog's ids and shipped the hook's contract, `achievementsEarned(win, held)`, as a stub that earns
nothing. This packet writes its rules, the catalog's words and art, the Account's list, and the cut-in a fight result
shows when one is earned. H48 calls the hook when it settles a won Rift fight, and H50 shows the cut-in. This packet can
be built beside H47 and H48: it touches none of their files.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md) (the Account frame is the kit's; this packet
  fills its `sections` slot and needs no kit change). Then [rift.md](../../design/rift.md) §7 and §12 (R8),
  [tiers.md](../../design/tiers.md) §3, and the D-rows of H44 (umbrella), H46 and D163 in [decisions.md](../../decisions.md).
- The manual: [sections.md](../../game/sections.md) § Account; [loops.md](../../game/loops.md).
- **H46's ids** (`packages/domain/src/rift/state.ts`): `RIFT_TIERS` `[1, 2]`, `RIFT_TITLES`, `sealId(tier, front)`
  (`t1-seal-iron` …), `conqueredId(tier)` (`t1-rift-conquered`), `ACHIEVEMENT_IDS` (catalog order: Tier 1's four seals
  and conquered, Tier 2's, then the nine titles), `isAchievementId`; `RiftRun.traces` (`physical | magical | ko` by
  front), `RiftFightRef`, `Account.achievements` (`{ <id>: { at, run | null } }`) and `Account.defeated`.
- **H46's contract** (`packages/domain/src/rift/achievements.ts`): `RiftWin { tier, ref, run, attemptRounds, state,
  defeated, roster }`, `AchievementGrant { id, run }`, `achievementsEarned(win, held)`. Keep these names and shapes:
  H48 calls them.
- **The art** (uma-platform `packages/art/README.md` § The Rift, uma-art 2.11.0): `ui` frames `front/iron`,
  `front/arcane`, `front/duel`, `front/horde` (16×16) and `achievement/seal-iron`, `seal-arcane`, `seal-duel`,
  `seal-horde`, `rift-conquered`, `iron-will`, `arcane-purity`, `untouched`, `swift-convergence`, `bestiary`,
  `crossover` (24×24). Untouched is one badge for all four fronts: show the front's crest beside it. Draw at native size
  or a whole-number scale; no tints.
- **The web:** `apps/web/package.json` pins `@luismlorenzana/uma-art` **2.9.0**; `main.tsx` passes the `ui` atlas to the
  kit (`KitArtProvider`), so the kit's `UiMark` draws any frame of the pinned atlas at scale 1 or 2.
  `apps/web/src/battle/pixel-icons.tsx` has the game's own `PixelIcon` (native size only) for class emblems and
  statuses. `apps/web/src/places/account/AccountPage.tsx` renders the kit's `AccountPage` frame, whose
  `sections?: ReactNode` slot draws between notifications and info. `useReducedMotionSetting` comes from
  `@luismlorenzana/uma-kit/ui`.
- **The roster:** `RosterMember.tier` (`regular | key | subboss | boss`) in `packages/domain/src/world/roster.ts`; the
  web's cast (`apps/web/src/content/cast.ts`) are `RosterMember`s.

## Decisions made

**The catalog** (`rift/achievements.ts`), in `ACHIEVEMENT_IDS` order:

```ts
export interface AchievementDef {
  id: AchievementId
  kind: 'seal' | 'conquered' | 'title'
  /** The tier a seal or "Rift conquered" belongs to; null for a title. */
  tier: number | null
  /** The front a seal or Untouched names; null otherwise. */
  front: RiftFront | null
  name: string
  /** One short line: how it's earned. */
  how: string
  /** Its uma-art `ui` frame. */
  badge: string
}
export const ACHIEVEMENTS: readonly AchievementDef[]
export function achievementDef(id: string): AchievementDef | undefined
```

| Id | Name | How | Badge |
|---|---|---|---|
| `t<n>-seal-<front>` | Iron Seal (Arcane, Duel, Horde) | Win the Iron front's champion | `achievement/seal-<front>` |
| `t<n>-rift-conquered` | Rift Conquered | Win the Convergence | `achievement/rift-conquered` |
| `iron-will` | Iron Will | Seal Iron with no magic dealt | `achievement/iron-will` |
| `arcane-purity` | Arcane Purity | Seal Arcane with no physical damage | `achievement/arcane-purity` |
| `untouched-<front>` | Untouched · Iron (…) | Seal Iron with no Uma knocked out | `achievement/untouched` + the front's crest |
| `swift-convergence` | Swift Convergence | Win the Convergence, every fight under 8 rounds | `achievement/swift-convergence` |
| `bestiary` | Bestiary | Defeat every boss and sub-boss | `achievement/bestiary` |
| `crossover` | Crossover | Win a champion with five classes in one party | `achievement/crossover` |

The list shows a seal or "Rift Conquered" with its tier: "Iron Seal · Tier 1".

**The rules** (`achievementsEarned`), for a won fight, skipping any id already in `held`, in catalog order:
- **Seal:** a front fight at stage 12 → `sealId(tier, front)`, run `run.id`.
- **Rift Conquered:** Convergence fight 3 (its win set `run.wonAt`) → `conqueredId(tier)`.
- **Iron Will:** Iron's stage 12, and `run.traces.iron` has no `magical`. **Arcane Purity:** Arcane's stage 12 and no
  `physical`. Both count the front's every won fight in this run, as H48 records them.
- **Untouched · front:** that front's stage 12, and its traces have no `ko`.
- **Swift Convergence:** Convergence fight 3, and all four of `attemptRounds` are under 8.
- **Bestiary:** every roster member whose tier is `boss` or `subboss` is in `defeated` (a roster with none earns
  nothing); run `null` (D163: earned across runs and tiers).
- **Crossover, redefined for five classes.** rift.md §7 has "a champion fight won by a party with all six classes
  represented across the roster". With today's five classes the guided parties already field all five across a roster
  (H44's D-row, point 2), so a roster-wide count would be earned by the first champion of every run. It becomes: **a
  champion fight (a front's stage 12 or any Convergence fight) won by one party of five different classes.** When
  classes v2 adds the Paladin it reads "five different classes of the six". Log the change in this packet's D-row and
  in rift.md §7.
- A title is earned once per account, in any tier; its `run` is the run it came from.

**The Account's list** (`apps/web/src/achievements/AchievementList.tsx`, in the kit frame's `sections` slot):
- a kit `Panel` headed "Achievements" with "n of N", N counting what's shown;
- shown: Tier 1's seals and "Rift Conquered", Tier n's for every other world the save has, and the nine titles;
- earned rows first, newest first: the badge (24 pt; Untouched with its 16 pt crest beside it), the name, and "21 Oct
  · Tier 1 run 2" (from the run id; "21 Oct" alone for the Bestiary);
- then the rest in catalog order: the badge at 40% opacity, the name, and its `how` line. No other text.
- Badges are decorative (`aria-hidden`); each row's text names it.

**The cut-in** (`apps/web/src/achievements/AchievementCutIn.tsx`):
`AchievementCutIn({ grants, onDone }: { grants: readonly AchievementGrant[]; onDone: () => void })`:
- a dark full-screen layer (`fixed inset-0 z-50`, `data-theme="dark"`), one grant at a time: the badge at 4× (96 pt),
  "Achievement" in small caps above the name, the `how` line, and a "Continue" button (44 pt);
- the badge scales in and the card fades in over about 300 ms; each grant stays until tapped, and after the last
  `onDone` runs;
- under reduced motion nothing animates;
- `role="dialog"`, `aria-modal="true"`, labelled "Achievement earned: <name>"; focus goes to Continue.
- H50 shows it over a Rift fight's result when `result.earned` isn't empty.

**The art pin:** this packet pins **uma-art 2.11.0** (H50 relies on it). It's append-only: every older frame keeps its
place and pixels, and the Hub's `tier-finale` still draws its old frame until H50 points it at `rift`. `PixelIcon` gains
a `scale?: 1 | 2 | 4` prop (width, height, background size and position times the scale, still pixelated), and
`pixel-icons.tsx` exports:
- `FrontCrest({ front, scale })`: `front/<front>`, `role="img"`, labelled "Iron front";
- `AchievementBadge({ id, scale, dim })`: the catalog's badge, `aria-hidden`.

## Do

1. **Domain:** the catalog and the rules in `rift/achievements.ts` (replacing the stub's body, keeping its signature).
   Tests in `rift/achievements.test.ts` build `RiftWin`s by hand (a `RiftRun` literal, a `BattleState` from
   `createBattle` with `outcome: 'victory'` and `round` set, a synthetic roster):
   - each achievement is earned exactly when its rule holds, and not otherwise: a seal at stage 11 earns nothing; Iron
     Will with `magical` in Iron's traces doesn't; Untouched with `ko` doesn't; Swift Convergence with a round of 8
     doesn't; the Bestiary with one sub-boss missing doesn't; Crossover with four classes doesn't, and at stage 5 doesn't;
   - one win can earn several (Iron's champion: the seal, Iron Will, Untouched · Iron and Crossover), in catalog order;
   - nothing in `held` is earned again; a Tier 2 seal is `t2-seal-iron`; titles carry the run id and the Bestiary `null`;
   - every catalog entry's `badge` is a frame of uma-art 2.11.0's `ui/atlas.json`, and every id in `ACHIEVEMENT_IDS`
     has exactly one entry.
2. **Pin uma-art 2.11.0:** `apps/web/package.json`, then `NODE_AUTH_TOKEN=$(gh auth token) pnpm install` for the lockfile.
   Check `apps/web/src/items/frames.ts` and `pixel-icons.test.tsx` still pass on the bigger `ui` sheet.
3. **`battle/pixel-icons.tsx`:** the `scale` prop, `FrontCrest` and `AchievementBadge`, with cases in
   `pixel-icons.test.tsx` (a crest's frame and label; a badge at 4× has 96 px and a scaled background).
4. **`achievements/AchievementList.tsx`** and **`AchievementCutIn.tsx`**, with tests:
   - the list on a fresh save shows 14 rows (Tier 1's five and the nine titles), none earned; with a Tier 2 world, 19;
     an earned seal moves to the top with its date and "Tier 1 run 1";
   - the cut-in steps through two grants on Continue and calls `onDone` once; under reduced motion it renders without
     animation.
5. **`places/account/AccountPage.tsx`:** `sections={<AchievementList save={save} />}`.
6. **Docs:**
   - **`loops.md`:** an `## Achievements` section (after H48's `## The Rift` if it's there; else where it fits): what
     they are, account-level, earned once, what gates Ascend; a live block `achievements` rendered in `docs/render.ts`
     from `ACHIEVEMENTS` (Name · How · Kind).
   - **`sections.md`** § Account: an "Achievements" bullet.
   - **`rift.md`** §7: under the table, "Crossover, for today's five classes: one party of five different classes wins
     a champion (H49, D…)".
   - Run `pnpm docs:update` (the `dependencies` block picks up uma-art 2.11.0). Log the D-decision (fetch `main` first;
     the next free number).
7. **Check it locally** (`.claude/launch.json`: `rpg-api` :8081, `rpg-web` :5174, or your own ports per the master
   prompt), at 390×844 and 375×667, light and dark, in a desktop browser, never the iOS Simulator:
   - the Account shows the Achievements panel under Notifications, fourteen rows, every badge crisp at 1×;
   - with a scratch save holding `t1-seal-iron` and `bestiary` (copy `apps/api/.data/save.json` aside, edit
     `account.achievements` with a run id that exists or `null`, raise `revision`, restart the API, clear site data),
     the two rows lead with their dates; put the save back after;
   - the cut-in: render it once locally over the Account with two grants (a temporary edit you don't commit) and check
     the 4× badge, Continue, and reduced motion.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. The bigger `ui` atlas JSON is in the main bundle: say the main JS
  number (230 KB budget, about 224 KB now; expect well under 1 KB more).
- [ ] The tests in steps 1, 3 and 4 pass.
- [ ] **With H48:** if H48 is on `main`, an integration test in `save/rift.test.ts` seals Iron through `actInRiftFight`
  and earns `t1-seal-iron`; otherwise H48 adds it.
- [ ] The local check in step 7 was done at both widths and both appearances, and described.
- [ ] `docs/game/` and `rift.md` are in step, `pnpm docs:update` leaves no diff, and the D-decision is logged.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude:** commit to `main` as `feat: achievements, the Account's list and the cut-in (H49)`, push, and watch the
  deploy.
- **ChatGPT:** branch `feat/h49-achievements`, one pull request; merge it yourself once checks and CI are green (fetch
  `main` first for the D-number).
- Nothing at the screen's edges changes; say so.
- **Flag it done:** delete this file, set H49's State to Done in `docs/handoff/README.md`, and add a Done row with the
  commit.
