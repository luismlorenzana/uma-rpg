# H168 — Art: the Uma sprite baseline sample (two Umas, the full animation spec)

**uma-platform's private `content/` · ChatGPT draws · L · Needs: — · Unblocks: the HD-2D fight prototype and the
production minimum**

> **Where this lives:** the work stays in **uma-platform's ignored `content/review/sprite-baseline/`**. Nothing goes in
> git there, and there's no release. The packet sits in uma-rpg's `docs/handoff/tasks/` because uma-rpg asks for the art.
> The only commit is the small uma-rpg one that flags it done (Deliver).

## Why

ChatGPT's study (`uma-platform/content/review/party-dash-sprite-study/`, 2026-11-06) showed three things:
- the Umas stay recognizable as small pixel sprites;
- its export works;
- one blink and one unarmed strike aren't enough for a fight.

The owner wants the full set defined and proven on a small sample before any rollout. The fight may also move to an HD-2D
landscape stage ([hd2d.md](../../design/sprites/hd2d.md)). This spec works for both, since both are side views with the
party facing left.

## Context (read first)

- **The spec:** [animation-spec.md](../../design/sprites/animation-spec.md), all of it. Its calls SA1–SA23 are this
  packet's decisions. The [visual page](../../design/sprites/previews/sprites.html) draws the cell, the anchors, the
  catalog's timings, the face layer and the landscape frame.
- **The study:** its README (findings and drift), `prompts.json`, `prompt-corrections.json` and `build.cjs`, the
  starting point for the export. Its own defects the spec's checks now catch:
  - Almond Eye's head grows and her legs shorten in the strike, and her legs smear in strike frames 2–3;
  - Gold Ship faces right in her idle and left in her strike, and her cap emblem changes between the rows.
- **Inputs:** the master-data release in `uma-platform/content/release/`:
  - `outfit-chibis` (`<id>-a`, `<id>-b`), `outfit-busts` and `outfit-portraits` for 106801 and 100701;
  - the art index (`data/art.<hash>.json`) gives their paths.

  The Party Dash reference the study used remains a style guide only. Never copy its frames.
- **The game's side,** so you know what each frame is for: the spec's §7 maps every fight event to an action. Battle
  backdrops for the viewer are in `@luismlorenzana/uma-art` (`world/atlas.json`, the `backdrop/<biome>` and
  `ground/<biome>-<n>` frames).

## Decisions made

All in the spec. In short:
- **Two Umas:** 106801 Kitasan Black and 100701 Gold Ship.
- **The cell:** 64×64, the Uma about 52 px tall, ground line y = 60, centred on x = 32, three-quarter view to the left,
  never mirrored.
- **The face:** eyes and mouth as six patches on head-locked frames. The game runs the blinks.
- **Twelve fight actions plus `walk` and a turnaround:** 62 body frames for each Uma, with set frame times and events.
- **Anchors in every frame**, so the four placeholder held items (greatsword, lance, bow, tome) sit in her hands.
- **Style:** 32 colours for each Uma, light from the top front-left, binary alpha, no shadow, glow or floor.
- **Checks:** ten automatic checks, and a failure means redraw. The key frame and turnaround are approved before
  anything else is drawn.

How you generate is your call: the study's 8× grid worked, and edit prompts fixed its errors. The native result is what
must meet the spec. Pixel fixes by hand or by script are allowed, and they're counted in the findings.

## Do

1. Copy the inputs into `inputs/`.
2. **For each Uma: the key frame (idle 0), the turnaround and the identity checklist.** Put them in a small review page
   and **stop for the owner's approval.** Redraw until he approves.
3. Every other action in §6.1 and §6.2, drawn against the approved key frame.
4. The face box, the head box and the six patches (§4).
5. The four held placeholders (§8).
6. `export.cjs`: native sheets, palettes, atlases (§13), GIFs and `checks.json`. Fix or redraw until all ten checks pass.
7. The viewer page (§12.3), with the 844×390 landscape phone frame at the phone's scale.
8. The README with the findings (§12.4): generations and rejections per action, hand fixes, minutes per Uma, check
   failures, and which of `hurt`, `victory` and `limit` end head-locked.
9. Show the owner the viewer. Make the changes he asks for, and fold them into the findings.

## Done when

- [ ] The owner approved both key frames and turnarounds, then the full set in the viewer.
- [ ] All ten checks pass for both Umas, and a second export is byte for byte the same.
- [ ] Every held placeholder sits in her hands in every frame, from the anchors alone.
- [ ] The findings carry real numbers.
- [ ] `git status` in uma-platform and uma-rpg shows nothing from `content/`, and no character image anywhere in git.

## Deliver

- **No pull request in uma-platform:** the sample is private.
- **Flag it done:** a branch and a pull request in uma-rpg, "docs(handoff): close H168, the sprite baseline sample".
  It does three things:
  - deletes this file;
  - adds a Done row in [README.md](../README.md) with the folder path and a two-line summary of the findings;
  - logs uma-rpg's next decision number (fetch `main` first) with what the sample decided.

  Merge it yourself when CI is green.
