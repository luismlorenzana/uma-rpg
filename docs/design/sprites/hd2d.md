# HD-2D fights and landscape: research and recommendation

> **Status: 2026-11-06, research for the owner's review. Nothing is built.** The owner asked what a full HD-2D game would
> take, how Octopath's mobile game did it, and whether the game should now be played sideways. The sprites themselves
> are in [animation-spec.md](animation-spec.md). That spec holds either way. Visual page: [previews/sprites.html](previews/sprites.html).

## The short answer

- **Octopath's phone game is a native Unreal Engine 4 app.** Octopath Traveler: Champions of the Continent (Acquire)
  launched in Japan on 2020-10-28 and worldwide on 2022-07-27. It plays in landscape, with side-view fights of up to
  eight (four front, four back). Its console version, Octopath Traveler 0, came out on 2025-12-04 without the gacha.
  Nothing about it is a web game.
- **HD-2D is pixel sprites standing as flat cards in a real 3D scene.** The scene and its light sell the look: point
  lights that cast the characters' shadows, depth of field (tilt-shift), bloom, light shafts and fog, particles, and
  parallax.
- **We can build it in our own web app** by drawing the fight with **three.js** (3D in the browser, works in the iPhone's
  home-screen app). Phaser 4, which draws our fights today, is 2D only. No native engine: the game stays a single web app
  on your iPhone.
- **Landscape for fights, portrait for the rest.** iOS doesn't let a home-screen web app lock itself to landscape. So the
  fight screen turns itself: hold the phone sideways and the stage draws sideways, whether your rotation lock is on or
  off. The Hub, menus and lists stay portrait, and uma-kit (shared with uma-racer) doesn't change.
- **The cost is the 3D sets, not the code.** The renderer is a few packets; every biome then needs its own diorama. Square
  Enix's HD-2D producer Tomoya Asano has said HD-2D costs more than people think. So: prototype one biome and measure it
  on your iPhone before committing.

## 1. How HD-2D is made

Square Enix's Team Asano and Acquire made HD-2D for Octopath Traveler (2018) in Unreal Engine 4. Acquire's lead
programmer credits UE4 for letting a small team build it, and Asano says the look took about a month and a half to find.
Its parts, and what each would be for us:

| Part | What it does | In three.js | Cost |
|---|---|---|---|
| A 3D set (the diorama) | The ground, walls and props the fight stands in | Low-poly meshes with pixel-art textures, nearest-neighbour filtering; textures from uma-art's generator scripts (P35) | **High**: one per biome |
| Sprites as cards | The characters stay flat pixel art, always facing the camera | Quads with cutout transparency, so depth of field treats them as solid | Low |
| A fixed camera | A high three-quarter view of the diorama | An orthographic camera tilted down, so every sprite stays the same size (below) | Low |
| Point lights and shadows | Characters cast shadows on the set; spells flash light | Point lights and shadow maps. Each sprite casts its shadow through an invisible shape the size of its body, or through a soft blob | Medium (GPU) |
| Depth of field | The near and far bands of the scene blur | Built-in bokeh and tilt-shift passes (a two-pass blur) | Medium (GPU) |
| Bloom | Bright lights and spells glow | The built-in bloom pass | Medium (GPU) |
| Light shafts and fog | Haze and beams | Fog is built in; shafts are additive cards | Low |
| Particles | Spell sparks, dust | Instanced quads; our existing pixel impacts become cards | Medium (art) |
| Parallax | Far layers drift slower | Layered planes behind the set | Low |

What we couldn't confirm: how Octopath shades the sprites themselves. The sources describe the scene's light and the
characters' shadows, not sprite normal maps. So the prototype starts by tinting sprites with the nearest light's colour,
and normal maps stay a later option ([animation-spec.md](animation-spec.md) SA16).

**Pixel-perfect sprites:** a perspective camera scales a sprite by fractions as it moves away, and the pixels shimmer. An
orthographic camera tilted down keeps every sprite at one size, a whole number of device pixels: 4 on the iPhone, so a
64×64 cell is 85 pt square and the Uma about 69 pt tall. Depth of field gives the sense of depth instead. That's the call (HD4).

## 2. Octopath's phone game: what carries over

| Octopath: Champions of the Continent | For uma-rpg |
|---|---|
| Native UE4 app on iOS and Android | No: we stay one web app (HD6) |
| Landscape | Yes, for fights (HD3) |
| Side view: the party on the right facing left, foes on the left | Yes. The sprite spec already faces left |
| Up to eight in a fight, four front and four back, swapped during the fight | No: our party is five and the rules don't change. Five fit in two staggered columns |
| Touch controls (tap and swipe) | Our DOM controls, laid out for thumbs in landscape |
| Became a console game (Octopath Traveler 0, 2025) without the gacha | — |

## 3. What it would take for uma-rpg

### 3.1 The renderer: three.js for the fight

- **The fight scene moves from Phaser 4 to three.js.** The Hub stays in Phaser 4. One canvas engine alive at a time still
  holds: the Hub's scene pauses while a fight plays, as today.
- **Same contract as now:**
  - the rules produce the fight's events, and the scene only plays them back;
  - lasting numbers and controls stay in the DOM over the canvas;
  - animations run on elapsed time and follow 1×/2×/4× and Skip.
- **Download size:** three.js loads with the fight, not with the game's first screen, so the 180 KB main-bundle budget
  isn't affected. The prototype measures the fight chunk's size.
- **Performance budget:**
  - 60 fps target, 30 fps floor, on your iPhone in the home-screen app;
  - depth of field and bloom drawn at half resolution;
  - paused when the app is hidden;
  - a ten-minute auto-battle run to check heat and battery.
- **Platform rule:** uma-platform's P14 makes Phaser 4 the choice for new canvas scenes. Moving uma-rpg's fights to
  three.js is a uma-platform decision, logged there (HD2).

### 3.2 Landscape: the turned stage

What iOS allows a home-screen web app (firt.dev's iOS PWA notes, updated 2026-10-13, cover iOS 26):
- the manifest's `orientation` is **not supported**;
- the Screen Orientation API is **partial** (since 16.4), so we can't count on locking;
- `fullscreen` display isn't supported; `standalone` is.

| Option | How | Problems |
|---|---|---|
| A. The whole game in landscape | Every screen and uma-kit, for both games | The biggest rework there is, and iOS still can't lock it: portrait users need a "turn your phone" screen everywhere |
| B. Real rotation for fights only | The app stays portrait; a fight asks you to turn the phone and iOS rotates the app | Needs the rotation lock off, and every other screen must survive being turned |
| **C. The turned stage** | The fight screen draws itself turned 90° while iOS still thinks the phone is upright. If iOS has rotated (lock off), it draws upright instead | The status bar and home bar sit on the short edges. Taps on the canvas need our own mapping through the turn (the DOM handles its own) |

**Recommended: C (HD3).** It works with the rotation lock on or off, and no other screen changes. Entering a fight shows a
one-time "turn your phone" hint. Leaving goes back to portrait.

The landscape stage, 844×390 pt on your iPhone:
- the foes take the left ~55% and the party the right ~45%;
- the party stands in two staggered columns: three at the back, two in front;
- at 4 device px a sprite pixel, each cell is 85 pt square (the Uma about 69 pt tall), so three staggered rows take
  about 255 pt;
- HP, MP and the Limit gauge sit in a compact party strip, with commands along the bottom-right edge, in thumb reach.

The page's [landscape section](previews/sprites.html#landscape) draws it.

### 3.3 The art the sets need

- **Twelve sets:** the eleven biomes plus Ancient Ruins for capitals. Each is a ground, six to twelve props, a backdrop
  and a light setup.
- Sets are original art, so they're uma-art packets for ChatGPT, built from generator scripts like everything in uma-art.
  The prototype starts from the existing world-atlas props as cards.
- **Foes:** the PriConne enemy art stays as flat cards, since it's 2D already. Their splashes and cut-ins stay DOM overlays.
- **Effects:** today's four-pose pixel impacts become cards, with a short point-light flash.

### 3.4 HD-2D fights, or a full HD-2D game

| | HD-2D fights (recommended next) | A full HD-2D game (Octopath-style) |
|---|---|---|
| What | The fight screen becomes a lit diorama in landscape | Walkable towns, fields and dungeons too |
| New code | The three.js fight scene and the turned stage | Movement, collisions, encounters, NPCs, map authoring, cutscenes: a new way to play |
| New art | Twelve sets; sprites per [animation-spec.md](animation-spec.md) | Every town and field as a set; walk and run in four directions for every Uma who walks |
| Game design | None: the same rules and screens | A design pass first: where exploration fits a game built on menus, the Hub and Umas working in parallel |

**Recommended: HD-2D fights only, for now (HD7).** Exploration is a design question before it's a technical one.

## 4. The plan

| Phase | What | Who | Gate |
|---|---|---|---|
| 1 | **Sprite baseline sample** ([H168](../../handoff/tasks/H168-sprite-baseline.md)): two Umas, the full spec, in a private viewer | ChatGPT | You approve the key frames, then the full set |
| 2 | **HD-2D fight prototype:** three.js, one biome set (placeholder geometry plus world props), the baseline sprites, placeholder foes, the turned stage, depth of field, bloom, one point light with shadows, and an fps and battery readout. On a dev-only route | Claude | Look, fps, battery and effort, measured on your iPhone |
| 3 | If it's a go: the fight scene moves to three.js (event playback, landscape DOM overlay), sets arrive one biome at a time, sprites roll out party by party | Claude for code, ChatGPT for art | Per packet |
| 4 | Later, only if designed: exploration | — | A design doc |

The portrait side-view rebuild (SP2 in the first proposal) is dropped. The fight stage gets rebuilt once, in the
prototype's form (HD8).

## 5. Calls

| Id | Call |
|---|---|
| HD1 | Fights become HD-2D; the Hub, menus and lists stay as they are |
| HD2 | three.js draws the fight; Phaser 4 keeps the Hub; uma-platform logs the change to P14 |
| HD3 | Landscape through the turned stage: the fight draws itself sideways while iOS stays portrait, and upright if iOS has rotated |
| HD4 | An orthographic camera tilted down; every sprite at a whole number of device pixels (4 on the iPhone); depth of field gives the depth |
| HD5 | Prototype one biome first; the gate is look, fps (60 target, 30 floor), battery over ten minutes, and effort |
| HD6 | No native engine (Unity, Unreal, Godot): the game stays one web app on the iPhone |
| HD7 | A full HD-2D game with exploration waits for a design pass |
| HD8 | The portrait side-view rebuild (SP2) is dropped; the stage is rebuilt once, as the prototype |
| HD9 | Twelve sets (eleven biomes and Ancient Ruins), uma-art packets for ChatGPT from generator scripts |
| HD10 | Sprites are tinted by the scene's light first; normal maps only if the prototype shows they're needed |

## Sources

- [HD-2D](https://en.wikipedia.org/wiki/HD-2D) (Wikipedia): the technique, Team Asano and Acquire, the month and a half,
  the cost remark, the trademarks.
- [Octopath Traveler: Champions of the Continent](https://en.wikipedia.org/wiki/Octopath_Traveler:_Champions_of_the_Continent)
  (Wikipedia): developer, UE4, dates, eight in a fight, Octopath Traveler 0.
- [Octopath Traveler's HD-2D art style](https://www.unrealengine.com/en-US/spotlights/octopath-traveler-s-hd-2d-art-style-and-story-make-for-a-jrpg-dream-come-true)
  (Unreal Engine spotlight, 2019): UE4 and the small team; point lights that cast shadows with the effects (read
  through search excerpts; the page refused a direct read).
- [Octopath Traveler 0: how to attack from the back row](https://www.rpgsite.net/guide/19082-octopath-traveler-0-how-to-attack-from-back-row)
  (RPG Site) and [Champions of the Continent review](https://bossrush.net/2023/07/30/game-review-octopath-traveler-champions-of-the-continent/)
  (Boss Rush): front and back rows.
- [iOS PWA Compatibility](https://firt.dev/notes/pwa-ios/) (firt.dev, updated 2026-10-13, iOS 26): orientation, display
  modes.
- [three.js tilt-shift shaders](https://threejs.org/docs/pages/module-VerticalTiltShiftShader.html): the blur pass.
- [Top-down character sprites](https://www.slynyrd.com/blog/2019/10/21/pixelblog-22-top-down-character-sprites)
  (Slynyrd): four directions serving eight-way movement, for later field sprites.
- Not from a source: the landscape claim about Champions of the Continent comes from its gameplay, not from the pages above.
