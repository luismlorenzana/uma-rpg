# H156 — Art: three buildings, the Gallery, Trials and Drills (uma-art 2.20.0)

**uma-platform · ChatGPT draws and publishes · S · Needs: H141's uma-art 2.19.0 published first · Unblocks: H158 (pins
it)**

> **Where this lives:** the work and its pull request are in **uma-platform**; the packet sits in uma-rpg's
> `docs/handoff/tasks/` because uma-rpg asks for the art, as H135 did for the Healer Sanctum.

## Why

The collections design (D283) adds three places to the Hub. Until this art lands they stand in existing, unused uma-art
buildings (`cleric-chapel`, `knights-bastion`, `gym`). Lean assets: three buildings on the existing kit, nothing else.

## Context (read first)

- **The design:** uma-rpg [collections.md](../../design/collections/collections.md) §7.3 and §7.5; the
  [content page](../../design/collections/previews/content.html) has the Battle page's four places.
- **uma-platform's house style** (`scripts/pixel-art/README.md`): light from the top left, a 1 px outline and a soft
  shadow on every object; § "The Healer Sanctum (H135)" and § "Wilds trios (H113)" for how a building is appended.
- **The buildings:** `scripts/pixel-art/src/buildings/` (`kit.ts`, `places.ts`, `sanctum.ts` as the newest model,
  `sanctum.test.ts`, `legacy-*.json`). The sheet is **288×432, 51 frames** at uma-art 2.18.0; 48 px kit, ground line 44.
  Published frames never move; new ones are appended.
- **Where they stand:** the Gallery on the Learning page under the Healer Sanctum (0.5, 0.84), where the Observatory
  stood; Trials (0.2, 0.52) and Drills (0.8, 0.52) on the Battle page, between the Scenario Gate and the Rift's dark
  building.
- **Versions:** H141 publishes uma-art **2.19.0** (star crests and stat marks). This packet is **2.20.0**; if H141
  hasn't shipped yet, wait for it, so the versions keep their order. Take uma-platform's next decision number (fetch
  `main`).

## Decisions made

### The frames

| Frame | Place | Motif | Reads as |
|---|---|---|---|
| `gallery` | The Gallery | A small stone chapel with a tall **rose window** in its front gable, the window's glass in bright jewel tones, a door below | Where the windows hang |
| `trials` | Trials | An open **proving ring**: a low round wall, two banners, a weapon rack at its gate | Where ranks are earned |
| `drill-yard` | Drills | A **training yard**: a timber shed with two straw dummies, a stack of logs (wooden logs, a nod to the Training Logs), a hanging bell for the day's turn | A place you return to every day |

- Same footprint and ground line as the halls; no smoke; any glow at alpha 65 and two pixels clear of every edge, as
  the Sanctum's.
- Each must differ from its neighbours' silhouettes by at least 25%, as `sanctum.test.ts` checks.

### The rest

- Appended after the 51 frames; a legacy freeze of every older frame record and cutout, as H135 did.
- A comparison preview: the three beside the Healer Sanctum, the Scenario Gate and the Rift at 2×.

## Do

1. The three painters, appended; the legacy freeze; tests as `sanctum.test.ts`.
2. The preview; look at the three at 1× and 2×.
3. Release uma-art 2.20.0; log the decision.

## Done when

- [ ] uma-platform's checks pass; every older frame byte for byte the same.
- [ ] uma-art 2.20.0 published.
- [ ] Nothing from the original games in git.

## Deliver

- **ChatGPT:** a branch and a pull request in uma-platform, "feat(art): the Gallery, Trials and Drills buildings (H156)";
  merge it yourself when the checks and CI are green, then publish 2.20.0.
- **Flag it done:** delete this file and add a Done row in uma-rpg's [README.md](../README.md) with the commit and the
  release.
