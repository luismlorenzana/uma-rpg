# H151 — Both apps: `ProfileFrame`'s companion square (uma-kit 0.17.0)

**uma-platform · Claude or ChatGPT · S · Needs: nothing · Unblocks: H155 (puts the window in it)**

> **Where this lives:** the work and its pull request are in **uma-platform** (`packages/kit`), as a "Both apps:" change
> ([change-protocol.md](../../change-protocol.md)); the packet sits here because uma-rpg asks for it, as H118 did.

## Why

The owner (D283, CO35): an Uma's stained-glass window stands **beside** her bust in her profile, not in its place. The
profile's header is uma-kit's `ProfileFrame`, whose `portrait` slot holds one square. This packet gives it an optional
second square, `companion`, beside the portrait. uma-racer passes nothing and draws exactly as today.

## Context (read first)

- uma-platform `CLAUDE.md`, `AGENTS.md`, `docs/change-protocol.md`.
- `packages/kit/src/places/ProfileFrame.tsx` and its tests: `portrait`, `size` (`compact` is a 64 px portrait and three
  small text rows; `regular` the original header), `locked`, `corner`.
- **The model:** H118 (kit `5662009`, [platform #62](https://github.com/luismlorenzana/uma-platform/pull/62)): the compact
  frame, its frozen default markup and the native size checks.
- **How uma-rpg will use it:** collections.md [§7.1](../../design/collections/collections.md#71-her-window-beside-her-bust);
  the [screens page](../../design/collections/previews/screens.html), phone 1.
- Versions: uma-kit **0.16.0** in both games; uma-platform's last decision is **P83** (P80 stays reserved for H141; H150
  takes P84).

## Decisions made

1. **The prop:** `companion?: ReactNode`. Absent, the frame's markup is byte for byte today's, in both sizes.
2. **Where:** right of the portrait, 8 px between, the **same box** as the portrait (64 px in `compact`, the regular
   portrait's size in `regular`), the same radius and clipping. The text rows start after it.
3. **Locked:** the companion isn't drawn while `locked` (a locked outfit has no progress to show).
4. **It's the game's content:** the kit draws the box; a tap target, a badge and an `aria-label` are the game's. The box
   gives its child the full 64 px, so a button inside it is a 44 pt target.
5. **Narrow screens:** at 375 pt the name and title truncate as they do today; nothing wraps under the squares.
6. **uma-kit 0.17.0,** a minor: something you can see, opt-in.

## Do

1. Add `companion` to `ProfileFrameProps` and draw it; document it in the kit's README.
2. Tests: absent → markup identical to 0.16.0's (snapshot both sizes); present → drawn, the same size as the portrait,
   hidden when locked.
3. Check both games against the linked kit: their checks pass; uma-racer's profile unchanged; in uma-rpg's local preview
   a stand-in companion (any 64 px square) at 390×844 and 375×667, light and dark.
4. Release 0.17.0; log P85. uma-racer can stay on 0.16.0 (nothing changes for it) until its session takes a kit release;
   uma-rpg's pin is H155's.

## Done when

- [ ] uma-platform's checks pass; the default-markup snapshot unchanged.
- [ ] Both games' checks pass against the linked kit.
- [ ] uma-kit 0.17.0 published.
- [ ] Nothing from the original games in git.

## Deliver

- **Claude:** commit to uma-platform `main`, "feat(kit): ProfileFrame's companion square (H151)", and the release.
- **ChatGPT:** a branch and a pull request in uma-platform with that title; merge it yourself when the checks and CI are
  green, then publish. Fetch `main` first so P85 is free.
- **Flag it done:** delete this file and add a Done row in uma-rpg's [README.md](../README.md) with the commit and the
  release.
