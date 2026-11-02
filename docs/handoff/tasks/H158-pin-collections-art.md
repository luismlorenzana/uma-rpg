# H158 — Pin uma-art 2.20.0: the Gallery, Trials and Drills buildings

**uma-rpg · Claude or ChatGPT · S · Needs: H156 (uma-art 2.20.0 published), H157 · Unblocks: nothing**

## Why

The three collections places stand in borrowed buildings (`cleric-chapel`, `knights-bastion`, `gym`) until their own art
lands (D283, CO31). H156 draws them; this packet pins the release and points each place at its frame. It's the last step
of the collections series' first phase.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`.
- H156's release; `apps/web/package.json`'s uma-art pin.
- `packages/domain/src/hub/places.ts`: the `gallery`, `trials` and `drills` places and their `frame`; its tests.
- If H144 (uma-art 2.19.0) hasn't landed, this pin carries its frames too: check that H144's swap is done, or do both.

## Decisions made

1. `gallery` → frame `gallery`, `trials` → `trials`, `drills` → `drill-yard`. Nothing else changes.

## Do

1. Pin `@luismlorenzana/uma-art` 2.20.0: `NODE_AUTH_TOKEN=$(gh auth token) pnpm install`.
2. Set the three frames; the places' tests.
3. Look at the Learning and Battle pages with `?canvas` at 390×844 and 375×667, light and dark.
4. Log the D-row (fetch `main` first).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass.
- [ ] The three places draw their own buildings.
- [ ] Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.

## Deliver

- **Claude:** commit to `main`, "feat(web): the collections places' own buildings (H158)".
- **ChatGPT:** a branch and a pull request with that title; merge it yourself when the checks and CI are green. Fetch
  `main` before you push so the D-number is free.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
