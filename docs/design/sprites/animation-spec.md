# Uma sprites: the animation spec (baseline sample)

> **Status: 2026-11-06, the requirement for ChatGPT's baseline sample ([H168](../../handoff/tasks/H168-sprite-baseline.md)).**
> It follows ChatGPT's first study (`uma-platform/content/review/party-dash-sprite-study/`, private). It holds for the
> stage as it is today and for the HD-2D landscape fight in [hd2d.md](hd2d.md), since both are side views with the party
> facing left. Visual page: [previews/sprites.html](previews/sprites.html).
>
> **What changes from the study:** the cell grows to 64×64 (the Uma stays the study's 48×64 size, about 52 px tall). The
> face becomes its own layer on poses whose head doesn't move. Weapons become their own layer, placed from anchors in
> each frame. The single strike becomes the full fight set, plus walk, run and a turnaround. Every frame records anchors
> and events, so the game plays it in sync with the fight.

## 1. What the baseline sample is for

Two Umas, every animation in this spec, built to the production format. The aim is to prove the spec and measure what it
costs, not to fill the roster.

| Uma | Outfit | Why |
|---|---|---|
| Kitasan Black | 106801 | The study's cleanest. Shows what the spec gives when the drawing goes well |
| Gold Ship | 100701 | The hardest: long hair, a cap, ornaments on one side only, and two errors in the study. Tests the identity lock |

The sample answers four questions:
- Does the face layer work?
- Do weapons sit right from the anchors?
- Does every action read at phone size?
- How much drawing and correcting does one Uma take? (§12 asks for those numbers.)

## 2. The cell

- **64×64 native pixels a frame**, transparent. This applies to every frame of every action.
- **The Uma is the study's 48×64 size:** about 52 px tall standing, ears and shoes included, and about three heads tall
  without the ears. The wider cell gives room for a fallen Uma lying flat, a lunge, a victory pose and flowing hair.
- **The ground line is y = 60** (rows 61–63 stay empty). A standing Uma is centred on x = 32. The game places every
  frame by the point (32, 60), so her feet must stay on it in every frame where she stands.
- **A clear border:** no pixel in the outermost row or column. A fallen Uma is at most 60 px wide.
- **One facing, never mirrored:** her battle facing is three-quarter view turned to image-left (the study's view).
  Ornaments sit on one side, so the game never flips an Uma. Directions she needs later are drawn separately (§6.3).

## 3. Layers

From back to front:

| Layer | Who draws it | What it is |
|---|---|---|
| Shadow | The game | An ellipse under her feet, or a cast shadow in HD-2D |
| Held item behind | ChatGPT (placeholders in the sample) | Her weapon or tome, on frames where it passes behind her |
| **Body** | ChatGPT | The frame itself, including her default face |
| **Face patch** | ChatGPT | An expression stamped over the face, on head-locked frames only (§4) |
| Held item in front | ChatGPT (placeholders in the sample) | Her weapon or tome, on frames where it's in front |
| Effects | The game | Impacts, spells, damage numbers, light |

The body never includes a held item, a shadow, a floor, a glow or an effect.

## 4. The face layer

**Yes, split the face out, but only the eyes and mouth, and only on head-locked frames.** At this size a face is about
14×9 pixels. A full head layer pasted onto every body would cost more than it saves.

- **The key frame** is idle frame 0. Its **head box** is the rectangle around her head, ears and front hair. Inside it,
  the **face box** covers both eyes and the mouth. ChatGPT records both boxes in the atlas.
- **A head-locked frame** shows the key frame's head at the same angle, only moved. The body below may change. In such a
  frame the head box must match the key frame pixel for pixel. Outside the face box, at most 6 pixels may differ (a hair
  tip, a hand passing in front). A check enforces this (§10). The lock also stops the size drift the study had, where
  Almond Eye's head grew in the strike row.
- **Face patches** are full copies of the face box, each drawn on the key frame's face. The game stamps one at the frame's
  head offset:

| Patch | Looks like | Used for |
|---|---|---|
| (none) | The face drawn in the body frame | Default |
| `blink-half` | Lids half down | Blinks |
| `blink-closed` | Lids shut | Blinks |
| `focus` | Narrowed eyes, mouth set | Attacks, casts, guard, running |
| `pain` | Eyes squeezed, mouth open | Hurt |
| `joy` | Happy closed arcs, open smile | Victory |
| `shout` | Eyes wide, mouth open | Limit Break |

- **The game runs the blinks,** so a blink isn't a body frame anymore. Every 2.4–5 s at random she blinks: half for
  60 ms, closed for 100 ms, half for 60 ms. One blink in seven is a double. Blinks happen only on head-locked frames
  with no expression patch showing.
- **Free frames** (the head turns or tilts: swings, the fall, victory) are drawn with their own face, and the game
  stamps nothing on them.

## 5. Anchors and events

Every frame is listed in the atlas with these fields, in native pixels inside its cell:

| Field | On which frames | What it is |
|---|---|---|
| `head` {x, y} | Head-locked | The top-left corner of the head box in this frame. The face patch goes at the same offset |
| `grip` {x, y, angle} | Any frame that shows a held item | Her front hand's grip point, and the direction the item points: 0 = forward (image-left), 90 = up, 180 = back, 270 = down |
| `off` {x, y} | Frames that show a tome, bow string or off-hand | Her back hand |
| `hold` | Every frame | `front`, `back` or `none`: where the held item draws in this frame |
| `hit` {x, y} | Every frame (defaults to idle's) | Where blows aimed at her land: the centre of her body |
| `cast` {x, y} | Cast and Limit frames | Where her spell starts: the raised hand or the tome |
| `air` | Hop frames | True when her feet leave the ground line (the foot check skips her) |

Every action also lists its **events** (frame numbers count from 0):
- `impact`: the frame where her hit lands. The game shows the impact and the damage number on it.
- `release`: the frame where an arrow, spell or Limit Break leaves her.
- `hold` [from, to]: frames the game loops while it waits (a spell charging, a guard held, lying down, the victory pose).
- `repeat` [from, to]: frames the game replays once for each extra hit when one act lands several.

## 6. The catalog

Times are milliseconds at 1×, the defaults the atlas carries. The game scales them with 1×/2×/4× and Skip. "Locked"
means head-locked (§4).

### 6.1 Fight (all in the baseline sample)

| Action | Frames | Frame times | Plays | Head | Face | Held | Events | The game plays it for |
|---|---|---|---|---|---|---|---|---|
| `idle` | 4 | 220 · 180 · 220 · 180 | Loop | Locked | Blinks | At rest, `back` | — | Standing between acts. Breathing, with a one-pixel hair and tail sway |
| `run` | 6 | 75 each | Loop | Locked | `focus` | At rest | — | Running in at the fight's start, stepping in to a melee target |
| `hop` | 2 | 90 · 160 | Once | Free | Own | At rest | Frame 1 `air` | Hopping back to her place after a melee act, still facing the foes |
| `swing` | 6 | 160 · 90 · 60 · 140 · 120 · 160 | Once | Free | Own | `front`, rotating | `impact` 3, `repeat` [2, 3] | Attacks and Arms skills with a greatsword, axe or katana: two frames winding up, the swing, the impact, follow-through, recovery |
| `thrust` | 5 | 150 · 80 · 140 · 120 · 150 | Once | Free | Own | `front` | `impact` 2, `repeat` [1, 2] | The same with a lance |
| `shoot` | 5 | 150 · 200 · 60 · 120 · 150 | Once | Locked | `focus` | Bow `front`, string at `off` | `release` 2 | The same with a bow; the arrow and its impact are the game's |
| `cast` | 6 | 140 · 140 · 160 · 160 · 90 · 180 | Once | Locked | `focus` | Tome open at `off` | `hold` [2, 3], `release` 4 | Tome skills, heals, Barriers, buffs, debuffs and summons |
| `guard` | 3 | 120 · 400 · 140 | Once | Locked | `focus` | `front`, braced | `hold` [1, 1] | Guard: she steps in front of the Uma she covers and braces until the round ends |
| `hurt` | 2 | 90 · 200 | Once | Free | `pain` (patch) | `none` | — | Taking a hit. A weak hit adds a knockback and a white flash (the game's) |
| `down` | 3 | 120 · 140 · 600 | Once | Free | Own, eyes shut | `none` | `hold` [2, 2] | A KO: staggers, falls, lies still. A revive plays it backwards, then idle |
| `victory` | 6 | 140 · 140 · 160 · 160 · 400 · 400 | Once | Free, turns toward the viewer | `joy` (patch, if her head ends locked) | Raised or shouldered | `hold` [4, 5] | The win |
| `limit` | 4 | 160 · 160 · 90 · 500 | Once | Free | `shout` (patch, if her head ends locked) | Raised | `release` 2, `hold` [3, 3] | Her Limit Break, just before the bust cut-in |

**`hurt` can use a patch even though its head is free:** frame 1 reuses the key frame's head when the flinch only moves it.
ChatGPT says per Uma which of `hurt`, `victory` and `limit` end head-locked, and the atlas says so per frame.

### 6.2 Movement (in the baseline sample, battle facing only)

| Action | Frames | Frame times | Plays | Head | Face | Held | For |
|---|---|---|---|---|---|---|---|
| `walk` | 6 | 110 each | Loop | Locked | Blinks | At rest | Walking on and off the stage, and to the Uma she guards when there's time |
| `turnaround` | 4 stills | — | — | — | — | None | Front, back, left and right standing. Her reference sheet, drawn with the key frame, and the start of later directions |

### 6.3 Later (not in the sample)

| What | Frames | Waits on |
|---|---|---|
| Walk and run facing front, back and right | 6 + 6 a direction | A field or Hub where Umas move ([hd2d.md](hd2d.md) §3.4) |
| `weary`: low-HP idle, with a `weary` patch | 4 | Playtest of the fights |
| A katana's own iai draw, an axe's overhead | 6 each | The production minimum (§11) |
| Work animations for the Wilds (mining, crafting, cooking) | 4 each | The Hub showing Umas at work |
| Cheer and emotes | 4 each | A use in the Hub or results |

## 7. How the game plays them

This is the game's side. It's written here so ChatGPT knows what each frame is for.

| Fight event | What she does |
|---|---|
| Fight start | `run` in from the right, settle into `idle` |
| Her hit, with a greatsword, axe or katana | `run` to the target's stand-off point, `swing`, `hop` back |
| Her hit with a lance | The same with `thrust` |
| Her hit with a bow | `shoot` in place |
| Her hit with a tome element, or a status move | `cast` in place |
| A heal, Barrier, summon, buff or debuff | `cast` in place |
| A Spellblade's act (two halves) | The lead half's action, then the other half's, after one step-in if the lead is melee |
| Several hits in one act | The action's `repeat` frames, once for each extra hit |
| Guard | `walk` (or `run` at 2× and up) to the covered Uma, `guard` held until the round ends, then back |
| A hit on her | `hurt`, with the `pain` patch |
| A KO | `down`, lying until revived |
| A revive | `down` backwards, then `idle` |
| A Limit Break | `limit`, then the existing bust cut-in |
| Victory | `victory`, holding its last two frames |
| Reduced motion | The key frame stays still. An action shows its `impact` or `release` frame for 300 ms. No runs or hops: she stays in place |

## 8. Held items in the sample

The real weapons are original art, so they'll be uma-art later (ChatGPT's, in git). For the sample, ChatGPT draws four
**placeholders**, shared by both Umas and kept with the sample:
- a greatsword;
- a lance;
- a bow, relaxed and drawn;
- a tome, closed and open.

Each is a 32×32 cell with its own grip point and points image-left at angle 0. The viewer draws them from the anchors.
The sample passes if they sit in her hands in every frame without redrawing her.

## 9. Style

- **Palette:** at most **32 colours a Uma** across every action and patch, as one shared palette, plus transparent.
- **Shading:** three or four tones a material, shifted in hue. Light comes from the top front-left, as in uma-art's house
  style. Keep the shading moderate, so the HD-2D scene's lights can tint her later.
- **Outline:** a one-pixel selective outline in a darker hue of the colour it borders, never pure black. Her outer
  silhouette is always closed.
- **Edges:** alpha is 0 or 255 only. No anti-aliasing into the transparency, no dithered gradients, no glow, no shadow,
  no floor.
- **Proportions and identity:** the study's look, about three heads tall without the ears, with Party Dash as the style
  guide only. Never copy frames from it.
- **Not in the sample:** normal maps or lighting layers. [hd2d.md](hd2d.md) tests lighting on the sprites as they are.

## 10. Checks (automatic; a failure means a redraw or a fix)

| # | Check |
|---|---|
| 1 | Every frame is 64×64; every sheet's grid is exact |
| 2 | Alpha is 0 or 255 only |
| 3 | No opaque pixel on the outer edge of a cell |
| 4 | Feet: the lowest opaque row of every frame not marked `air` is 60 |
| 5 | At most 32 colours across all of one Uma's sheets and patches |
| 6 | **Head lock:** head-locked frames match the key frame's head box, with at most 6 differing pixels outside the face box |
| 7 | **Height:** a standing frame's top row is within 2 px of the key frame's |
| 8 | **Specks:** no detached opaque cluster smaller than 4 pixels |
| 9 | Each action has its listed frame count; every anchor is inside its cell; every event points at a real frame |
| 10 | A second export is byte for byte the same |

Checks 6–8 would have caught the study's Almond Eye. The report goes in `checks.json`, by Uma, action and frame.

## 11. The production minimum (decided after the sample)

The full sample is **62 body frames a Uma**. The production minimum for the roster rollout is chosen from the sample's
costs. The proposal is 35 frames: `idle`, `run`, `hop`, `swing`, `cast`, `hurt`, `down` and `victory`. A lance falls
back to `swing`, a bow to `cast`, Guard to `idle`, and a Limit Break to `victory`'s first frames. The sample's numbers
decide whether `thrust`, `shoot`, `guard` and `limit` join it.

## 12. Review and identity

1. **The key frame first.** For each Uma, ChatGPT draws the key frame and the turnaround and fills in the identity
   checklist. The owner approves them before any other action is drawn. Everything after is drawn against the key frame.
2. **The identity checklist** names her ears (any covers or ornaments, and on which ear), hair (colour, marks, bangs,
   length), eye colour, headwear, every ornament and **which side it sits on in the battle facing**, outfit (colours,
   skirt, jacket, belt), legwear and shoes, and tail.
3. **The viewer page,** like the study's:
   - every action looping, with play/pause, frame stepping and 1×/2×/4×;
   - toggles for the anchors (foot, head box, face box, grip with its angle, off-hand, hit, cast), the face layer, the
     expression patches, blinks and the held items;
   - backgrounds: dark, light, and one of the game's battle backdrops;
   - a five-wide formation (the two Umas repeated) facing three placeholder foes, inside an 844×390 landscape phone
     frame with its safe areas, at the phone's scale (4 device px a sprite pixel: a cell is 85 pt square, the Uma about
     69 pt tall);
   - the turnaround and the identity checklist beside each Uma.
4. **The findings** in the sample's README:
   - for each action, how many generations it took and how many were rejected;
   - which frames needed a pixel fix by hand;
   - minutes per Uma;
   - what failed the checks;
   - which of `hurt`, `victory` and `limit` end head-locked.

   These numbers set the production minimum (§11) and the rollout's size.

## 13. Deliverables, and where they live

All in **`uma-platform/content/review/sprite-baseline/`**, which git ignores. The sprites come from the game's chibis and
busts, so they're private content, never git, never uma-art.

```text
sprite-baseline/
  README.md            how it was made, the findings (§12.4)
  index.html           the viewer (§12.3)
  inputs/              the chibis, busts and the style reference used
  generated/           every raw generation, kept, rejected ones included
  sheets/<uma>/<action>.png   native 64×64 cells, one row per action
  sheets/<uma>/faces.png      the face patches, each the size of the face box
  sheets/<uma>/palette.png
  atlas/<uma>.json     the atlas (below)
  held/                the four placeholders and their atlas
  previews/            GIFs of every action at 4×
  checks.json          §10
  identity/<uma>.md    the checklist
  prompts.json, corrections.json
  export.cjs           the deterministic export (the study's build.cjs, extended)
```

The atlas, one per Uma (a shortened example):

```json
{
  "version": 1, "outfit": 106801, "cell": 64, "foot": { "x": 32, "y": 60 },
  "headBox": { "x": 18, "y": 6, "w": 26, "h": 24 }, "faceBox": { "x": 22, "y": 17, "w": 14, "h": 9 },
  "faces": { "blink-half": { "x": 0, "y": 0 }, "blink-closed": { "x": 14, "y": 0 }, "focus": { "x": 28, "y": 0 } },
  "actions": {
    "swing": {
      "sheet": "sheets/106801/swing.png", "loop": false,
      "events": { "impact": 3, "repeat": [2, 3] },
      "frames": [
        { "x": 0, "y": 0, "ms": 160, "hold": "back", "grip": { "x": 40, "y": 30, "angle": 150 }, "hit": { "x": 31, "y": 38 } }
      ]
    }
  }
}
```

## 14. Calls

| Id | Call |
|---|---|
| SA1 | The baseline sample is two Umas, 106801 and 100701, in the full spec: the cleanest and the hardest |
| SA2 | A 64×64 cell, the Uma at the study's 48×64 size (about 52 px), ground line y = 60, centred on x = 32 (replaces SP3's 48×64 cell) |
| SA3 | One facing, three-quarter to image-left; an Uma is never mirrored |
| SA4 | Six layers: shadow and effects are the game's; body, face patch and held items are drawn |
| SA5 | The face splits out as eyes and mouth only, on head-locked frames, as full face-box patches |
| SA6 | The head lock (6 px tolerance) doubles as the identity and size check |
| SA7 | Six patches: `blink-half`, `blink-closed`, `focus`, `pain`, `joy`, `shout` |
| SA8 | The game runs blinks (every 2.4–5 s, 60/100/60 ms, one in seven doubled); blinks are not body frames |
| SA9 | Anchors in every frame: `head`, `grip` with an angle, `off`, `hold`, `hit`, `cast`, `air` |
| SA10 | Events per action: `impact`, `release`, `hold`, `repeat`; the damage number lands on `impact` |
| SA11 | Twelve fight actions: `idle`, `run`, `hop`, `swing`, `thrust`, `shoot`, `cast`, `guard`, `hurt`, `down`, `victory`, `limit` |
| SA12 | Movement in the sample: `walk` in the battle facing and a four-way `turnaround`; other directions wait for a field |
| SA13 | Melee runs in, acts and hops back facing the foes; ranged and casts act in place |
| SA14 | Weapons are a separate layer placed from `grip` and `hold`; four placeholders in the sample; the real ones are uma-art later |
| SA15 | A Uma's palette is at most 32 colours across everything, with moderate shading lit from the top front-left |
| SA16 | No normal maps or lighting layers in the sample |
| SA17 | Ten automatic checks; failures are redrawn |
| SA18 | Review: the owner approves the key frame and turnaround first, with a per-Uma identity checklist naming each ornament's side |
| SA19 | The viewer page shows everything in an 844×390 landscape phone frame at the phone's scale (an 85 pt cell) |
| SA20 | The findings report generations, rejections, hand fixes and minutes per Uma |
| SA21 | The production minimum is set after the sample; proposed 35 frames (§11) |
| SA22 | Everything lives in `uma-platform/content/review/sprite-baseline/`: private, never git, never uma-art |
| SA23 | Reduced motion: the key frame still, an action's key frame for 300 ms, no runs or hops |
