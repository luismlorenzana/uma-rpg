# The enemy roster: three franchises, four tiers, splash cut-ins (D135)

The fight content was re-authored from three locked franchise packs:
- **PriConne and Azur Lane**, from the owner's portrait authoring pass (D123, D128–D133);
- **NIKKE**, from its animated models (D127, D134).

The local authoring tools that made them are retired, and their downloaded and rendered images are off the machine
(D136, D137): the published release in the bucket is what the game uses.

The owner sorted every unit into a tier: **Regular, Key enemy, Sub-boss or Boss**. This note covers how those units
reach the game and where they appear. The rules live in `packages/domain/src/world/roster.ts` and `world.ts`; the
manual pages are [maps](../game/maps.md#faces) and [combat](../game/combat.md#splash-cut-ins).

| Franchise | Regular | Key enemy | Sub-boss | Boss | Units |
|---|---|---|---|---|---|
| PriConne | 44 | 70 | 34 | 32 | 180 |
| Azur Lane | 174 | 65 | 52 | 53 | 344 |
| NIKKE | 70 | 60 | 50 | 50 | 230 |

## 1. The pipeline

1. **Lock** each franchise's images as a bundle in `content/authoring/exports/`, named by a pointer file
   (`latest.json`, `latest-nikke.json`), with a completion marker and a hash for every file. A new franchise or a
   re-authored one comes in the same way.
2. **`pnpm enemies:release`** reads the bundles through their pointers (`latest.json`, `latest-nikke.json`), checking
   every hash. It re-encodes each unit for the phone into the gitignored `content/enemies-release/`:

   | Image | Size | Notes |
   |---|---|---|
   | `face` | 128 px square | Azur Lane's 3:4 busts are cut square from the top, never upscaled |
   | `art` | up to 480×720 | The 2:3 vertical the battle stage shows |
   | `splash` | up to 1280×720 | Key enemies, Sub-bosses and Bosses only |

   - **Format:** WebP with transparency kept, named `enemies/<unit>-<role>.<hash8>.webp`.
   - **The list:** `enemies.json` (schema 2) has each unit's id, franchise, tier, name, colour and images, sorted by
     franchise and id.
   - **Size:** 754 units in 1,974 files, about 105 MB. The locked PNGs are 813 MB.
3. **`pnpm enemies:publish`** uploads the images, then the list, to `gs://uma-rpg-content`:
   - images get `private, max-age=31536000, immutable`; the list gets `no-cache`;
   - gcloud is scoped to `uma-rpg`, and the account is never changed.
4. **The API** serves only `enemies.json` and those image names, behind sign-in. **The web** loads the list once a
   session, and the service worker caches the images.

### On this machine (D137)

Only `content/enemies-release/enemies.json` and the authoring records (votes, tiers, crop rectangles, manifests) stay
local. The locked PNG bundles and the release's WebPs went to the macOS Trash after the upload, with a recovery list in
`content/authoring/maintenance/`. Local dev therefore shows the map and fights without enemy images. To rebuild or
republish, put the bundles back from the Trash (or lock new ones), then run `pnpm enemies:release` and
`pnpm enemies:publish`.

## 2. Regions by franchise

A region's franchise goes by level, not biome, so each franchise owns whole stretches of the climb:
- **Continent 1 (Lv 1–10):** PriConne, the smallest roster, only at the lowest levels.
- **Continents 2–4:** Azur Lane in each continent's first five levels, NIKKE in its last five.
- **Continent 5:** Azur Lane.

That's 40, 100 and 60 regions for 180, 344 and 230 units. Later tiers keep the Azur Lane–NIKKE alternation.

Each capital's Finals take a franchise of their own: PriConne, Azur Lane, NIKKE, Azur Lane, NIKKE.

## 3. Fights by tier

| Stage | Faces |
|---|---|
| Regular stages (1–10) | Regular units |
| Elite (11) | A Sub-boss with two **Key enemy** assistants (guards at 0.8 of a regular foe's HP, shield 2). With help beside her, she acts once a round below Lv 10 and twice from Lv 10 (D141) |
| Boss (12) | Two opening waves of Sub-bosses (at regular strength, as before), then a Boss with two Sub-boss guards |
| Twin boss | On each continent's top row (row 10, its highest level), the boss's wave has two Bosses, each with 55% of one Boss's HP, and one Sub-boss guard |
| Capital Finals | Vanguard: a Sub-boss with Key enemy minions. Champion: a Boss with Sub-boss minions |

- **Picking:** a stage picks each face by hash from its franchise's units of that tier, sorted by id, so the list's
  order never matters. It doesn't repeat a face within the stage while others remain.
- **Empty tiers:** a tier with no units borrows, in order, the same tier from another franchise, any tier of its own,
  then anyone. With no roster at all, a foe has no face.
- **Saves:** a fight in progress keeps its frozen faces.

### Balance

The world simulation (`SIM=1 npx vitest run src/world/balance.test.ts`) was run before and after. It still plays engine
v8, with class Limit Breaks that live fights no longer have (D112). On v11 these stages win less often; see
[combat balance](combat-balance.md#2-what-we-measured).
- **Elites, first try** (two Key enemies beside a captain who still acted twice): win rates fell from 100% to 40–100%,
  often below the Bosses'.
- **Elites, with the captain acting once:** 95–100% wins with 60–93% of the party's HP left, over 5–12 rounds rather
  than 4–8. Elites are now a real fight but still easier than Bosses.
- **Bosses** with twin-boss rows: unchanged, at 70–100%.
- **Regular stages** and the runs of stages in a row: unchanged.

## 4. Splash cut-ins

The engine now sends a `move` cue as each foe makes her move, named as its intent was. Cues are presentation only:
they're never saved, and state hashes ignore them, so open fights replay unchanged.

A foe with a splash cuts in across the rivals' half, above their name panels:
- on her **first move each round**;
- after her **BREAK**;
- at **phase two**;
- on her **defeat**, fading to grey.

Each cut-in sweeps in from the right with a stripe in her tier's colour (Key teal, Sub-boss violet, Boss red) and a
caption, and holds for about 1.5 s, zooming in slowly (0.7 s before 2026-10-16). Tapping skips it; the speed setting
shortens it by its square root only (about 1.1 s at 2×, 0.75 s at 4×); with reduced motion it doesn't play.
Bosses and Sub-bosses show it most, and Key enemies in elites show it too, so splashes come up often but never more
than once per foe per round for moves.

## 5. Cost

All of it fits the free tier.

| Resource | Use | Free tier |
|---|---|---|
| Cloud Storage, Standard, us-central1 | ~105 MB, down from ~301 MB before the wipe | 5 GB-months |
| Storage reads (Class B) | One per image a session first needs, then the service worker's cache | 50,000 a month |
| Cloud Run egress | What the owner's devices download: at most ~105 MB once per device | 1 GB a month (North America) |
