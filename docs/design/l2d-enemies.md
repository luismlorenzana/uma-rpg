# NIKKE L2D enemies: source, reviewer and formats (D127)

A local, owner-only workflow, like the portrait authoring pass ([portrait-authoring.md](portrait-authoring.md) on its
branch). It downloads NIKKE's animated character models, lets the owner sort them into enemy roles, and renders the
three authoring formats from them. **Nothing here reaches the game, the bucket or git**: sources, votes and renders
live in the gitignored `content/l2d/`. Packing the results for the game is a later, separate task.

## 1. The source

nikke-db's viewer (`nikke-db.pages.dev/visualiser`, open source as `Nikke-db/nikke-db-vue`) plays the game's models
with **Spine** (Esoteric Software's skeletal animation). Its "L2D" label is loose: these aren't Live2D models. About
40% of the skeletons are Spine 4.0 and the rest 4.1; the two read differently, so each needs its own version of
Spine's runtime. What the viewer offers us:

- **The list**: `src/utils/json/l2d.json` in its repository, 745 entries with an id and English name. 623 are
  character models: 204 base characters (`c000`–`c799`), 163 outfits (`c123_01`, `c350_old`, and 13 treasure versions
  `favorite_<id>`), 77 collab entries (`c8xx`, `c8xxx`), 128 story characters (`c9xx`, `c9xxx`, faceless extras
  included), 15 bosses (named `Boss: …`) and 36 chibis (`smol_…`, `ce009_…`). The other 122 are event scenes, story
  illustrations and title cards.
- **Three poses per character**, each a skeleton, an atlas and one or two texture pages (2048², premultiplied
  alpha) under `nikke-db-legacy.pages.dev/l2d/<id>/`:
  - **Standing** (`<id>_00`): facing us, full body, idle loop about 2.7 s.
  - **Aim** (`aim/<id>_aim_00`): **from behind**, aiming down the field, idle loop 2 s.
  - **Cover** (`cover/<id>_cover_00`): crouched behind cover, turned **toward us** with her weapon, idle loop 2 s.

  Bosses, chibis and most story characters have only Standing.
- **A 128 px square face icon** per entry (`images/sprite/si_<id>_00_s.png`), bosses included.

A full character is 6–13 MB (Standing 3.5–6 MB, Aim and Cover 1–4 MB each). All 623 come to about 4 GB.

## 2. What we built (`scripts/l2d/`)

- **`pnpm l2d:download`** captures the list, keeps every character model (scenes, story illustrations and title
  cards aside; `--groups` narrows it) and downloads every face and pose, one request a second. It resumes, and fetches
  one whole character at a time, so whoever the reviewer shows has all her poses. The host answers a missing file with its web page and a
  200, so a pose that comes back as HTML counts as absent. Each entry gets a manifest with sizes and SHA-256s.
- **`pnpm l2d:review`** (http://127.0.0.1:5195) plays each character live with Spine's own WebGL runtime (the 4.0 or
  4.1 one, read from the skeleton's header): Standing,
  Aim and Cover, each on its idle loop. Five keys, saved at once to `content/l2d/tiers.json` with a history line each:
  **1 Exclude, 2 Regular, 3 Key enemy, 4 Sub-boss, 5 Boss** (the authoring pass's Regular, KeyEnemy, MiniBoss and
  FinalBoss, plus Exclude). It moves on after each vote. It also has Back, Skip and Undo, filters by role and group,
  and search.
- **Formats.** "Render this one" draws every format for the character on screen, comparisons included. "Render all
  with a role" works through every voted unit, skipping Exclude, and renders only what her role needs.

## 3. The formats

| Format | How | Size (one character) |
|---|---|---|
| **Face**, square | The viewer's own 128 px icon, as is | ~35 KB |
| **Vertical**, 2:3 | Standing, still frame, 600×900 WebP | ~70 KB |
| **Splash**, 16:9 | Aim (back) and Cover (front) side by side, still, 1280×720 WebP; Standing alone if she has no battle poses | ~110–125 KB |
| Vertical, animated (Sub-boss, Boss) | Standing's idle loop, 400×600, 12 fps | ~1 MB |
| Splash, animated (Sub-boss, Boss) | Aim + Cover idle loop, 720×405, 12 fps | ~0.95 MB |

Aim + Cover rather than Standing + Aim: they make the back-and-front pair the owner asked for. Their loops share a
2 s length, so the animated splash loops seamlessly. The tall, narrow Standing figure also left half of a 16:9 frame
empty.

### The options for motion, measured on the prototype (`c550_01`)

| Option | Size | Quality | Verdict |
|---|---|---|---|
| **A. Still WebP** (one frame) | 70–125 KB | Crisp, soft transparent edges | **Default for every unit** |
| **B. Animated WebP** | 0.64 MB at 640×360 10 fps; 0.95 MB at 720×405 12 fps; 2.4 MB at 960×540 15 fps | As crisp as A; plays in an `<img>` on iPhone (Safari 14+) | **Bosses only**: about 10× a still |
| C. GIF | 1.2 MB at 720×405 12 fps | 256 colours, hard 1-bit edges | No: larger than B and worse |
| D. Video with alpha (HEVC for Safari, VP9 WebM for Chrome) | Estimated 0.2–0.4 MB | Good | Later, if B's size hurts: needs an encoder (ffmpeg, or AVFoundation on the Mac) and two files per clip |
| E. Live Spine in the game | 5–13 MB a character, plus a 200 KB runtime | Full: idle, aim, reload, hit reactions | No: too heavy for a phone, and shipping Spine's runtime needs a paid Spine Editor license. Rendering locally doesn't |

The animated WebP is made with no encoder installed: the browser encodes each frame (`canvas.toBlob('image/webp')`)
and `webp-anim.mjs` wraps them in WebP's animation container. Each frame is a full picture, so there's room to shrink
B later by encoding only the part of each frame that moved.

## 4. Where things live

```text
content/l2d/                       gitignored
  roster.json                      the captured list, filtered, with groups
  sources/<id>/                    face.png, the poses' .skel/.atlas/.png as the host lays them out, manifest.json
  vendor/                          spine-webgl 4.0.31 and 4.1.56, gifenc 1.0.3, pinned by SHA-256
  tiers.json, tiers-history.jsonl  the owner's votes
  renders/<id>/                    full.webp, splash.webp, the animated pair, and compare-* for the options above
  download.log
```

## 5. Next

1. The owner votes the roster.
2. "Render all with a role" makes the stills, plus the animations for Sub-bosses and Bosses.
3. Wiring them into the game (a private NIKKE pack, as D81's) is a separate task when the owner asks.
