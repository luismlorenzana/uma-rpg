# uma-quest: the plan

> **Status: 2026-11-06, a plan for the owner's go. Nothing is created yet.** The owner decided to split the HD-2D
> initiative into its own game, **uma-quest**, rather than rebuild uma-rpg: a new 3D engine, an authored story campaign
> with several parties on their own quests instead of gacha and collection, consumable items beside the crafting, the
> dungeon approach with new leveling and balance, and one long run to level 50. To avoid a new GCP project, the game
> lives in the existing `uma-rpg` project with its own site, API, database and deploy access. This page is the order of
> work: the infrastructure first, then the engine, the slice and the design. It moves into the new repo in Phase 1.
> Visual page: [previews/plan.html](previews/plan.html).
>
> **Later on 2026-11-06 the campaign was reshaped as a travelers RPG** in [campaign.md](campaign.md) (CM1–CM36): 100
> travelers, one per selected outfit, sharing 65 five-chapter stories, persisted towns, shared dungeons whose boss follows the lead, and waves
> of five travelers. NG2, NG3, NG7, DN1, DN2, DN5 and DN10 below are revised by it, and Phases 3, 5 and 6 changed, with
> a new Phase 7.

## The short answer

- **Phase 0 (docs):** the platform logs the fourth game and three.js; uma-rpg is frozen, still live.
- **Phase 1 (infrastructure):** the public repo `luismlorenzana/uma-quest`, then its cloud inside the `uma-rpg` project.
  It ends with a "hello" uma-quest on your iPhone's Home Screen: signed in, a save synced, uma-rpg untouched.
- **Phase 2 (the engine):** three.js, the sideways stage, the camera, pixel-exact sprites, the tile-built 3D world and
  the stick, with stand-in art, measured on your iPhone.
- **Phase 3 (the slice):** one generated dungeon in one biome, five Umas in single file, random battles cutting to a
  3D fight on uma-rpg's copied fight engine, HP carrying, a mini-boss, a Spring and a waystone; then one town and one
  stand-in chapter that ends in that dungeon with its own boss. You play it and we measure it.
- **Phase 4 (the design spec)** runs beside Phases 2 and 3 and is finished with the slice's numbers. **Phase 5** is band
  1 with wave 1's five chapter 1s, **Phase 6** the run to level 50 for wave 1, and **Phase 7** the other twelve waves of
  travelers ([campaign.md](campaign.md)).
- **You do two things:** four clicks on GitHub when the repo exists, and one Cloud console form when the sign-in is set
  up. Everything else is mine, or ChatGPT's for the art.

## The calls

The new repo's decision log starts from these (NG1–NG12 were proposed in chat; NG1 and NG9 are revised here).

| Id | Call |
|---|---|
| NG1 | The name is **uma-quest**: a **public** repo `luismlorenzana/uma-quest`, like uma-rpg and uma-platform. Public repos run GitHub Actions free, and no original-game content goes in git anyway |
| NG2 | *Revised by [campaign.md](campaign.md) CM1–CM13 and CM32:* all 100 selected outfits are travelers, playable from the start; a character's outfits share her story of five chapters, one per ten levels; no tickets or gacha; stories ship in waves of five |
| NG3 | *Revised by CM16:* stories are private content in `gs://uma-quest-content`; git holds the script format, the tale skeletons and a stand-in chapter. Names and art come from master data at run time |
| NG4 | One climb from Lv 1 to 50: no tiers, no Ascend |
| NG5 | three.js draws towns, dungeons and fights; no Phaser. Menus are uma-kit's React screens over the canvas |
| NG6 | Landscape throughout, on the turned stage (iOS can't lock a web app's orientation). uma-kit's landscape layout comes from a platform kit release, never a fork |
| NG7 | The loop is town → chapter → dungeon → the lead's boss (CM10). Umas in no party work jobs on `uma-work`; consumables become a main crafting output beside gear |
| NG8 | A fresh save v1, local first (Dexie), synced through `uma-server`. Nothing carries over from uma-rpg (P4) |
| NG9 | **The cloud lives in the `uma-rpg` GCP project** (revised from "its own project"): its own Hosting site, Cloud Run service, Firestore database and deploy identity |
| NG10 | The dungeon calls DN1–DN28 ([below](#the-starting-dungeon-calls)) are the starting design, without DN1's Party Hall change and DN19's migration; DN1, DN2, DN5 and DN10 are revised by campaign.md |
| NG11 | uma-platform logs P87 (the fourth game, sharing the `uma-rpg` project, amending P2 and P13) and P88 (three.js for uma-quest, amending P14), and a roadmap row |
| NG12 | The order: Phase 0, then infrastructure, the engine and the slice; the design spec alongside |
| NG13 | uma-rpg is **frozen, still live**: production stays up and gets bug fixes only. Its CLAUDE.md, README and handoff queue say so |
| NG14 | uma-quest numbers packets Q1, Q2 … and decisions from D1. uma-rpg's H168 (the sprite sample) moves across as Q3, with the walking directions added and the Summoner in her selected outfit 100703 (CM34) |
| NG15 | **Isolation inside the shared project:** quest-api's account can reach only the `quest` database; the deployer only its own service, image repository and runtime account; every Hosting deploy names its site |
| NG16 | Local ports: quest-api on :8091 and quest-web on :5184, beside uma-rpg's :8081 and :5174, so both can run at once |
| NG17 | Main JS ≤ 180 KB gzip, the platform's rule. three.js and every scene load on demand |
| NG18 | Every push to `main` checks and deploys, as in uma-rpg, so you play each step at `uma-quest.web.app` |

## Phase 0: decisions and the move (Claude, docs, S)

1. **uma-platform:** P87 and P88 in `decisions.md`; the games table in `architecture.md` (uma-quest, its project, and
   three.js beside Phaser); a roadmap row for uma-quest; the landscape kit layout noted as a future "Both apps" style
   request (here a third app).
2. **uma-rpg:** frozen in CLAUDE.md, the README and the handoff README; H168 marked "moves to uma-quest as Q3". The
   sprite spec and the HD-2D research stay here until Phase 1 copies them across, then leave a pointer.

**Exit:** both logs pushed.

## Phase 1: the repo and the infrastructure (Claude, M + M)

### Q1: the repo

1. Create the public repo `luismlorenzana/uma-quest`, with the same protection and settings as uma-rpg.
2. **Scaffold from uma-rpg's stack** (P13's stack as uma-rpg runs it): pnpm 10 and turbo; `apps/web` (Vite, React 19,
   Tailwind, Zustand, Dexie, the PWA plugin, uma-kit's shell, auth and content), `apps/api` (NestJS, uma-server's auth
   guard and content proxy, the save service) and `packages/domain`. Names `@quest/web`, `@quest/api`, `@quest/domain`.
   TypeScript strict with `noUncheckedIndexedAccess`; Vitest beside the code.
3. **Copied checks:** the main-JS size check (≤ 180 KB) and the private-content check, so no master data, names or
   art reach git.
4. **Local running:** `.claude/launch.json` with `quest-api` (:8091) and `quest-web` (:5184); master data from
   `../uma-platform/content/release`, as uma-rpg does.
5. **Docs:** README, CLAUDE.md, AGENTS.md; `docs/decisions.md` from D1 (NG1–NG18); `docs/game/` (the manual, empty
   until there are rules); `docs/handoff/` (the Q queue, H168 moved in as Q3 with the walking directions);
   `docs/design/` (this plan, the sprite spec, the HD-2D research, the dungeon calls); `docs/technical/infrastructure.md`.
6. **CI:** lint, test and build on pull requests and `main`. Deploys stay off until Q2.

**Your step:** on GitHub, for each of `uma-data`, `uma-kit`, `uma-work` and `uma-server`: Package settings → **Manage
Actions access** → add `uma-quest` with **Read**. GitHub has no API for it.

**Exit:** CI green on `main`; the app runs locally.

### Q2: the cloud, inside the `uma-rpg` project

One idempotent script, `infra/bootstrap.sh`, every command scoped with
`CLOUDSDK_ACTIVE_CONFIG_NAME=default CLOUDSDK_CORE_PROJECT=uma-rpg`; the active gcloud account is never changed.

| # | Piece | Value | Shared with uma-rpg? |
|---|---|---|---|
| 1 | Firestore database | `quest`, Native, `us-central1`, delete protection on. `saves/{uid}` and `saveRescues/{uid}` inside it | No: uma-rpg's saves stay in `(default)` |
| 2 | Runtime account | `quest-api-runtime`: `datastore.user` with an IAM condition on `projects/uma-rpg/databases/quest`; read-only on `gs://uma-platform-master-data` | No |
| 3 | Image repository | Artifact Registry `quest`, keeping the last 3 images | No |
| 4 | API | Cloud Run `quest-api`, `us-central1`, min 0 and max 1 instances, 512 MiB, 1 CPU | No |
| 5 | Deployer | `quest-deploy`: writer on the `quest` images only, admin of the `quest-api` service only, user of `quest-api-runtime` only, and Hosting admin (Hosting has no per-site role, so the workflow deploys `hosting:uma-quest` by name and CI checks `firebase.json` names that site) | No |
| 6 | Deploy sign-in | A Workload Identity provider `uma-quest` in the existing `github-actions` pool, `main` of `luismlorenzana/uma-quest` only | The pool; uma-rpg's provider is untouched |
| 7 | Website | Hosting site `uma-quest` → `https://uma-quest.web.app` (the name is free today; `uma-quest-lm` if it's gone), `/api/**` rewritten to `quest-api` | The project only |
| 8 | Firebase web app | A second web app, `uma-quest`, its public config in `apps/web/.env.production` | The project only |
| 9 | Sign-in | The same Google sign-in and the same allowed email; `uma-quest.web.app` added to Auth's authorized domains | **Yes**, one login for both games |
| 10 | Budget | The existing $5 alert on the project, now covering both | **Yes** |
| 11 | Private stories | Bucket `gs://uma-quest-content`, `us-central1`, uniform access, public access prevented, object versioning on; `quest-api-runtime` reads it (CM16) | No: uma-rpg's enemies stay in `gs://uma-rpg-content` |

**Your step:** Cloud console → APIs & Services → Credentials → "Web client (auto created by Google Service)" → add
`https://uma-quest.web.app/__/auth/handler` under **Authorized redirect URIs** and `https://uma-quest.web.app` under
**JavaScript origins**, as you did for uma-rpg. Without it, Google refuses the sign-in redirect inside the Home Screen
app.

Then:
- **Repository variables:** `GCP_PROJECT_ID=uma-rpg`, `WIF_PROVIDER`, `ALLOWED_EMAIL`, `MASTER_BUCKET`,
  `FIRESTORE_DATABASE=quest`, `HOSTING_SITE=uma-quest`, `DEPLOY_ENABLED=true`.
- **The deploy workflow**, adapted from uma-rpg's: build and deploy the API image, build and deploy the web app to its
  site, then verify: `/api/health` answers, `/api/save` answers 401, and the shell is served `no-cache`.
- **The hello app:** sign in with Google, a save v1 holding only its account round-trips (Dexie and the server), the
  **Update ready · Restart** prompt, installable on the Home Screen.
- **Checks after:** uma-rpg's site, its `/api/health` and its `/api/save` 401 unchanged; `quest-api` refused on the
  `(default)` database; the budget alert lists the project.
- **`docs/technical/infrastructure.md`** with every value, and uma-rpg's production-save rules copied in from day one.

**Exit:** uma-quest on your iPhone's Home Screen, signed in, its save synced, uma-rpg untouched.

### What the cloud adds to the bill

| Added to the `uma-rpg` project | Free tier | At one player |
|---|---|---|
| Hosting site | Shares the project's 10 GB stored and 360 MB a day | $0 |
| Cloud Run `quest-api` | Shares 2M requests and 180k vCPU-seconds a month | $0 |
| Firestore database `quest` | None: Google's free quota covers only one database a project, here uma-rpg's `(default)` | A few cents a month |
| Artifact Registry `quest` | Shares the 0.5 GB | $0, cents if old images pile up |
| Bucket `gs://uma-quest-content` | Shares the 5 GB of US storage | $0: the stories are a few MB |
| Art and master data | uma-platform's existing private bucket | A few MB more |

Sources: [Firestore pricing](https://cloud.google.com/firestore/pricing),
[Firebase Hosting FAQ](https://firebase.google.com/docs/hosting/faq-and-troubleshooting) (up to 36 sites a project),
[Firestore multiple databases](https://cloud.google.com/blog/products/databases/firestore-multiple-databases-is-now-generally-available/)
(IAM conditions by database), [GitHub Packages permissions](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages)
(Actions access is set in the web UI).

## Phase 2: the engine (Claude, L)

Stand-in art throughout: coloured blocks and a stand-in Uma drawn to the sprite spec's cell and anchors.

- **Q4, the stage:** three.js (0.187 today, pinned when the packet starts), loaded on demand. The turned stage: the
  scene always draws landscape, and in portrait it turns itself, with touches mapped through the turn and the safe areas
  kept. An orthographic camera tilted down that follows the leader; sprites at whole device pixels (4 px a sprite pixel
  on your iPhone). The floating stick on the left half, Interact and Dash on the right, the keyboard on a desktop.
  Battery saver on by default on a phone: 30 fps, no blur or glow. uma-kit's React screens drawn over the canvas.
- **Q5, the world builder and the kit format:** code builds the 3D world from tiles in a 2D kit atlas (floors, walls,
  edges, stairs) plus flat sprite props (trees, rocks, torches, chests); light painted into the kit, a few live lights
  near you, fog, and optional tilt-shift and bloom. The same builder makes towns from a town kit. The **kit spec**, so
  ChatGPT can draw a biome kit and a town kit as 2D art.
- **Q6, sprites in the engine:** the spec's atlas loader, the face layer and its blinks, the leader and four followers in
  single file, scene-light tint and soft shadows. It runs the stand-in, then Q3's real output once you approve it.

**Exit:** a test room on your iPhone at a steady frame rate, with the battery drain per ten minutes, load time and chunk
size written down.

**Art beside it (ChatGPT):** Q3, the sprite sample, can start any time. Q7, the first biome kit, starts once Q5's kit
spec exists.

## Phase 3: the slice (Claude, L)

- **Q8, the fight engine:** uma-rpg's `packages/domain/src/rpg/battle` copied at a recorded commit with its tests, with the
  class and skill-tree rules it needs. Then uma-quest's first rule changes: fights start with carried HP and downed Umas
  (DN12), and heals can be cast outside fights (DN13).
- **Q9, the fight screen:** the biome's battle set from the kit, five Umas against the foes, every fight event drawn with
  the spec's actions and timings.
- **Q10, the dungeon generator:** one biome's room designs, five floors, reachability checked, the same seed always the
  same layout (DN6).
- **Q11, the dungeon screen:** random battles with the danger meter (DN7, DN8), the mini-boss and boss standing visible
  (DN9), the Spring and waystones (DN15, DN16), chests, auto-explore (DN26), a run saved without its position (DN18).
- **Q12, the town and the story runner:** one kit-built town with an inn, a shop and a few townsfolk walking; the scene
  runner (CM17: lines, portraits, emotes, camera beats, flags); the world map screen with the town and the dungeon
  (CM24); one stand-in chapter whose boss takes the dungeon's boss room (CM26).
- **Q13, measured:** you play it at `uma-quest.web.app`. We write down minutes and fights a floor, minutes a chapter,
  frame rate, battery and load times, and they set the design's numbers.

## Phase 4: the design spec (Claude, docs, M)

Starts beside Phase 2; finished with the slice's numbers. In `docs/design/`, with preview pages at
[class-progression.md](../tier-rework/class-progression.md)'s standard:
- the campaign: [campaign.md](campaign.md) settled with the slice's numbers, the world map's 25 zones and their biomes,
  and wave 1's five story bibles for your read;
- growth: the EXP curve to 50, Job Points (DN11), the classes (from Classes v3 and the Tier 2 work);
- dungeons: the DN calls settled, the generator's rules, the hand-made capitals;
- economy and crafting: consumables, the workbench, weapon materials (DN20, DN21), jobs;
- save v1's shape, and the screens: town, menus, party, quest log;
- the queue of packets for Phase 5.

## Phases 5, 6 and 7

- **Phase 5, band 1 (XL):** the Hub and the five inner towns, band 1's ten dungeons and their resident bosses, the party
  menu, the quest log, wave 1's five chapter 1s, consumables and crafting, jobs, sync. Art: wave 1's sprites, then every
  traveler as she's drawn, band 1's townsfolk, kits and bestiary.
- **Phase 6, to level 50 (XL):** bands 2–5 (20 towns, 40 dungeons, the five hand-made ones), wave 1's chapters 2–5, the
  balance across the whole run.
- **Phase 7, the cast (ongoing):** waves 2–20, five travelers a wave in your tier order, each a full run of 25 chapters.
  A wave writes only the characters not yet written, and you read its bibles before its chapters are written.

## Risks

| Risk | What keeps it small |
|---|---|
| A project-wide mistake hits both games | Separate service accounts and databases; scripted, idempotent setup; never delete the `uma-rpg` project, even if uma-rpg is retired |
| A uma-quest Hosting deploy lands on uma-rpg's site | The deploy names `hosting:uma-quest`, and CI fails if `firebase.json` doesn't name that site |
| WebGL on the iPhone is too slow or drains the battery | Phase 2 measures it on a test room before any content is made |
| The art volume (100 travelers at about 110 frames, 70 townsfolk, 16 kits, a bestiary) | Q3 and the slice set a production minimum; travelers drawn in your tier order; bosses share bodies (CM27) |
| The writing volume (325 chapters, about 650,000 words) | Waves of five, each a full run; one wave's bibles read before its chapters are written (CM18, CM32) |
| uma-kit has no landscape layout | A kit request to uma-platform during Phase 2; the slice can draw its few menus itself until then |

## The starting dungeon calls

Proposed in chat for uma-rpg on 2026-11-06 and carried here as uma-quest's starting design (NG10). Phase 4 settles them.

| Id | Call |
|---|---|
| DN1 | Only Umas with sprites fight. *Revised by CM1 and CM2: the 100 outfits are the travelers, a character's outfits sharing her story. The Party Hall change is moot here* |
| DN2 | *Revised by CM19, CM20 and CM25:* 25 zones of a town and two dungeons, ten dungeons a band, each at one suggested level |
| DN3 | Any party may walk any dungeon; no cap |
| DN4 | The first party to clear a dungeon claims it; every Uma who clears it joins its register, and her profile shows her path |
| DN5 | *Revised by CM29:* one hand-made dungeon in each region's outer zone; the rest are generated |
| DN6 | Other dungeons are generated from fixed seeds, from 15–25 room designs a biome, with every room reachable |
| DN7 | Random battles with a visible danger meter; each fight's foes come from the dungeon's seed and the fight's number |
| DN8 | An Encounters setting: normal or half |
| DN9 | Only mini-bosses and bosses stand visible on the field |
| DN10 | *Revised by CM30:* a party's five chapters and their dungeons take it through a band, about two levels a chapter |
| DN11 | Job Points: wins pay each Uma into her own pool, spent on any class she holds or can open |
| DN12 | In dungeons HP and MP carry between fights, and a downed Uma stays down until revived |
| DN13 | Heals and revives can be cast outside fights for their MP |
| DN14 | Field items from the Farm's surplus: a tonic, a party meal and a revive; no MP item |
| DN15 | Springs at the entrance and floor 3, each recharging in 2 h separately for each party |
| DN16 | A wipe returns the party to its last waystone, restored, keeping what it found |
| DN17 | One open dungeon run a party, several parties inside at once, one open fight in the world |
| DN18 | A run saves its floor, waystone, each Uma's HP, MP and state, chests, rooms seen and fight count; never its position |
| DN19 | *Moot here: uma-rpg's live-world migration* |
| DN20 | Weapons gated by dungeon materials, not by level |
| DN21 | A continent's ten dungeons pair with the ten weapon kinds; mini-bosses and bosses drop their grades' materials |
| DN22 | Chests per party; the map of rooms seen shared by the dungeon |
| DN23 | Pay goes by foe level; first-clear and replay bonuses move to bosses and chests; Sweeps resolve a cleared floor's fights |
| DN24 | All five walk single file, the others in the leader's footsteps |
| DN25 | Every fighting Uma needs walking frames in three new directions, never mirrored |
| DN26 | A floating stick, Interact and Dash; Auto-explore stops at mini-bosses, bosses, low HP or a fully explored floor |
| DN27 | Battery saver on by default on phones; the 3D engine loads only when needed |
| DN28 | A biome kit is 2D art; code builds the 3D shapes from its tiles |
