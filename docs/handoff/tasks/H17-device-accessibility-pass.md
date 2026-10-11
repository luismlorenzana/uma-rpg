# H17 — Device and accessibility pass

**Priority P3 · ChatGPT, then the owner on the iPhone · uma-rpg · M.**

## Why

Only phone layouts exist, and no pass has looked at performance or accessibility as a whole. The game is played for
hours on one iPhone as a Home Screen app, so slow screens, small targets and unlabeled controls cost every session.

## Context

- **Conventions** (`AGENTS.md`):
  - mobile first at 390×844, checked at 375×667;
  - 44 pt targets, safe areas, `h-dvh`;
  - every screen is a place.
- **Screens:** `apps/web/src/places/**`. Shared UI: `apps/web/src/ui/` (`BottomSheet`, buttons). Hub canvas:
  `apps/web/src/hub/`. Battle: `apps/web/src/battle/`.
- **Reduced motion:** the Hub and the battle scene already honor it (`reducedMotion`).

## Do

1. **Audit every place** at 375×667 and 390×844 with Lighthouse (mobile, Accessibility and Performance) and axe
   (`npx @axe-core/cli` against the dev server). Put a table of findings by screen in the pull request.
2. **Fix in code:**
   - missing accessible names (icon buttons, canvas hotspots, the weapon row on the fight screen);
   - focus order and visible focus in sheets;
   - contrast below WCAG AA on text;
   - targets under 44 pt;
   - live-region spam during fights (one polite update per action);
   - layout shifts on load;
   - long lists without virtualization where they exceed about 200 rows (Warehouse, cast pickers).
3. **Performance:**
   - profile a fight and the Stable on a 4× CPU-throttled profile;
   - fix the top re-render or long-task causes, with React DevTools Profiler numbers before and after.
4. **The owner's on-device checklist:** add a short "Device pass" section to `docs/testing/phone-check.md` (from H04).
   It covers:
   - VoiceOver on three screens;
   - Larger Text at the second-largest size;
   - Reduce Motion on;
   - Low Power Mode during a fight;
   - landscape lock;
   - a cold start offline.

## Done when

- The Lighthouse Accessibility score is 95 or more on the Hub, Stable, Skills, region map and fight screens.
- axe reports no serious or critical issue.
- `pnpm lint && pnpm test && pnpm build` pass.
- The pull request has the before and after tables.

## Deliver

A pull request on `fix/a11y-perf-pass`, titled `fix(web): device and accessibility pass (H17)`. The owner then runs the
on-device checklist.
