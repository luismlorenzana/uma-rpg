# S1 acceptance

The [S1 exit check](../slices/S1-hub.md#exit-check), split by who verified what.

## Verified by Claude (2026-10-10)

| Check | Result |
|---|---|
| Lint, tests (39) and production build | Pass locally and in CI |
| Deploy pipeline | Green on `76c7493`: image built with the GitHub Packages secret, Cloud Run `rpg-api`, Hosting |
| `/api/health` through Hosting | 200, build `76c7493` |
| `/api/save`, `/api/master/*` without a token | 401 |
| Shell, `sw.js`, manifest | Served `no-cache`; manifest "Uma RPG", standalone, 192/512 icons; Apple touch icon served |
| Master data access | Runtime account holds `roles/storage.objectViewer` on `gs://uma-platform-master-data`; channel `latest` → `d9bbb52a9cd7` |
| Firebase Auth | Google provider enabled; `uma-rpg.web.app` authorized |
| Local preview at 390×844 | First launch, all four Hub pages, Stable (270 outfits, art, search, profile with lazy unique skill), Scenario Gate, a placeholder place, Account |

## Owner, on the iPhone

Pending. Install https://uma-rpg.web.app from Safari (Share → Add to Home Screen), then run the exit check: sign in, name
the trainer (20 Unlock Tickets), switch pages by tab and swipe, open every place, browse the Stable, rename and reload,
and see the rename on a second browser.
