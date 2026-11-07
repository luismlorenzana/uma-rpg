# One project, three apps: the cloud plan

> **Status: 2026-11-06, a plan for the owner's go. Nothing is created or changed yet.** The owner asked for the full
> infrastructure of **uma-rpg** (live), **uma-quest** (planned in [uma-quest/plan.md](../uma-quest/plan.md)) and
> **uma-farm** (the Wilds as their own app, sending one-way parcels to the games; talked through in chat on 2026-11-06)
> before planning the apps' bootstrap. This plan covers the infrastructure only. Each new app ends it as a placeholder that
> deploys through its own pipeline. The real bootstrap (the stack, sign-in, saves, the shell, the Home Screen app) is the
> next plan. It replaces the uma-quest plan's Q2 table and bill. The calls are IN1–IN26.
> Visual page: [previews/plan.html](previews/plan.html).

## The short answer

- **One GCP project, `uma-rpg`, holds all three apps.** Each app gets its own site, API, database, image repository,
  runtime account, deployer and deploy sign-in, and none of them can reach another app's. Four things are shared: the
  Google sign-in (one login for all three), the deploy pool, the $5 budget alert and the read-only master data bucket.
  uma-racer stays in its own project; it's on the same billing account, so it already shares Cloud Run's free tier.
- **uma-rpg goes first.** Today's audit found that it would see the newcomers: its runtime account can read and write every
  database in the project, and its deployer can deploy any service and push to any image repository. Its database also has
  neither delete protection nor point-in-time recovery. Step 1 fixes all of that on the live app, one change at a time,
  before anything new exists. Step 1 is worth doing even if the other two apps never come.
- **Then two repos, two clouds, two pipelines.** Each is proven by a placeholder deploy, and the farm's parcel link is proven
  end to end: uma-quest's server calls uma-farm's server with its own Google-signed token.
- **The bill:** under $1 a month added, most likely under 25 cents. The $5 alert stays.
- **Your part:** one sitting at the end of Step 2 and Step 3 (the GitHub package access and the Google sign-in entries), and
  a one-line go before Step 1, which changes uma-rpg's live project.

## What the audit found

Read-only, on 2026-11-06, with `CLOUDSDK_ACTIVE_CONFIG_NAME=default CLOUDSDK_CORE_PROJECT=uma-rpg`.

| # | Finding | Why it matters once three apps share the project | Fix (Step 1) |
|---|---|---|---|
| A1 | `rpg-api-runtime` holds `roles/datastore.user` on the whole project, with no condition | uma-rpg's API could read and write uma-quest's and uma-farm's saves | Condition it to `projects/uma-rpg/databases/(default)` (IN5) |
| A2 | `github-deployer` holds `run.admin` and `artifactregistry.writer` on the whole project | A push to uma-rpg's `main` could deploy over `quest-api` or `farm-api` | Grant them on `rpg-api` and the `rpg` repository only (IN6) |
| A3 | Hosting admin can't be narrowed: Firebase has no per-site role. uma-rpg's `firebase.json` names no site; it deploys the default one | Any of the three deployers could deploy any of the three sites | Every `firebase.json` names its site, and CI fails a deploy that names another (IN7) |
| A4 | Firestore `(default)`: delete protection off, point-in-time recovery off | One bad write (a migration bug, a hand edit) can't be undone | Both on: any minute of the last 7 days can be read back (IN9) |
| A5 | The default compute account holds Editor, and nothing runs as it (`rpg-api` runs as `rpg-api-runtime`, the push tick as `rpg-push-scheduler`, and Cloud Build is off) | An idle account with edit rights over three apps | Remove its Editor role (IN15) |
| A6 | Hosting keeps every version (`maxVersions` 999,999), and the project's 10 GB free storage is shared by every site | Three sites slowly fill it. Not urgent: uma-rpg's build is 4 MB | Keep the last 20 versions a site (IN11) |
| A7 | Nothing is labeled, so the bill can't tell the apps apart | One bill for three apps | Label everything that takes labels `app=rpg`, `quest` or `farm` (IN12) |

Already right, and kept: the deploy sign-in is limited to `main` of `luismlorenzana/uma-rpg`; the deployer can act only as
`rpg-api-runtime`; the push scheduler signs its calls; images keep the last 3; the private bucket blocks public access; the
budget alerts at $1 and $5 and covers the whole project, so it covers all three apps with no change.

## The calls

| Id | Call |
|---|---|
| IN1 | One GCP project, `uma-rpg`, for uma-rpg, uma-quest and uma-farm. uma-racer stays in project `uma-racer`, on the same billing account |
| IN2 | Never shared between apps: Hosting site, Firebase web app, Cloud Run API, runtime account, Firestore database, image repository, deployer, deploy sign-in provider, and a private bucket where the app has private content |
| IN3 | Shared: Firebase Auth with Google sign-in and the one allowed email (one login for all three), the `github-actions` pool, the $5 budget alert, the project's enabled APIs, and read-only access to uma-platform's master data bucket |
| IN4 | Names: `<app>-api`, `<app>-api-runtime`, `<app>-deploy`, database `<app>`, image repository `<app>`, site and deploy provider `uma-<app>`. uma-rpg keeps its live names (`(default)`, `github-deployer`, `rpg`, site `uma-rpg`) |
| IN5 | A runtime account reaches only its own database: `datastore.user` with the IAM condition `resource.name == "projects/uma-rpg/databases/<db>"`. uma-rpg's gets its condition first, on `(default)` |
| IN6 | A deployer reaches only its own app: Artifact Registry writer on its repository, Cloud Run admin on its service, service account user on its runtime account. uma-rpg's is narrowed from project-wide |
| IN7 | Hosting admin stays project-wide, since Firebase has no per-site role: each `firebase.json` names its site, the workflow deploys `hosting:<site>`, and CI fails when the two differ |
| IN8 | The bootstrap creates each new API with Google's sample image, so a deployer never needs project-wide Cloud Run rights; the first real deploy replaces the image |
| IN9 | Every database: Firestore Native, `us-central1`, delete protection on, point-in-time recovery on (7 days). No scheduled backups: a bad write is noticed within a week |
| IN10 | Every API: `us-central1`, min 0 and max 1 instances, 512 MiB, 1 CPU, public at the edge (Hosting's rewrite needs it). Every route sits behind the owner guard except health and the farm's post routes, which check their own tokens (IN18) |
| IN11 | Image repositories keep the last 3 images; each Hosting site keeps its last 20 versions |
| IN12 | Every resource that takes labels carries `app=rpg`, `app=quest` or `app=farm`, so the bill splits by app |
| IN13 | Sign-in: one Firebase web app per site. Each site's domain goes into Auth's authorized domains (Claude, through the API) and into the OAuth client's redirect URIs and JavaScript origins (your step: the console has no API for it) |
| IN14 | New repos are public, like uma-rpg and uma-racer, for free Actions minutes: `luismlorenzana/uma-quest` and `luismlorenzana/uma-farm`. Each has the private-content check from its first commit |
| IN15 | Each repo owns an idempotent `infra/bootstrap.sh`, every command scoped with `CLOUDSDK_ACTIVE_CONFIG_NAME=default CLOUDSDK_CORE_PROJECT=uma-rpg`; the active gcloud account is never changed. Project-wide pieces (A5, the authorized domains) are touched only in uma-rpg's Step 1 and by the bootstrap's add-only calls |
| IN16 | Private content: uma-rpg keeps `gs://uma-rpg-content`; uma-quest gets `gs://uma-quest-content` with object versioning (CM16); uma-farm needs none (its art is uma-art's, its Umas come through master data) |
| IN17 | Push: uma-rpg keeps its own. uma-farm gets `farm-vapid`, `farm-push-scheduler` and a five-minute `farm-push-tick`, created **paused** until its push route ships. uma-quest gets none: its timed work moves to the farm |
| IN18 | Parcels: `farm-api` accepts `/api/post/*` only with a Google ID token whose audience is its own URL and whose account is on its list (`quest-api-runtime` now; `rpg-api-runtime` and `racer-api-runtime` when they receive). No IAM grant and no keys: every Cloud Run service can mint a token for its own account |
| IN19 | Receivers get the repository variable `FARM_API_URL`. uma-rpg gets it only when its receiver is built, since it's frozen otherwise |
| IN20 | Proof, for each new app: a placeholder deploys (a page; `/api/health`; `/api/save` answering 401 through uma-server's guard; installs of all five packages). uma-quest's placeholder calls the farm's ping with its own token |
| IN21 | Isolation is tested, not assumed: after each step, Policy Troubleshooter checks every runtime account against every database and every deployer against every service and image repository, expecting a grant on its own and a refusal on the others |
| IN22 | Local ports: uma-rpg 8081 and 5174 (as today), uma-quest 8091 and 5184, uma-farm 8101 and 5194 |
| IN23 | uma-rpg's changes go first, as packet H169, each verified on the live app before the next, with the previous binding one command away |
| IN24 | Platform logs take the next free P-numbers when written (P88 onward today). P86 and P87 went to art releases on 2026-11-04 and 2026-11-05, so the uma-quest plan stops naming numbers. Three decisions: three apps in one project (amends P2 and P13), uma-farm and one-way parcels (amends P3), three.js for uma-quest (amends P14) |
| IN25 | Docs: each repo's `docs/technical/infrastructure.md` holds every value; uma-rpg's lists the project's other two apps; uma-platform's architecture §1 (repos) and §6 (master bucket readers) |
| IN26 | This plan replaces the uma-quest plan's Q2 table and bill. Its Q1 and Q2 become infrastructure only; the scaffold and the hello app move to the bootstrap plan |

## The inventory

Live is what runs today; **new** is created by this plan; *changed* is live and changed in Step 1.

| Piece | uma-rpg (live) | uma-quest (new) | uma-farm (new) |
|---|---|---|---|
| Repo | `luismlorenzana/uma-rpg`, public | **`luismlorenzana/uma-quest`**, public | **`luismlorenzana/uma-farm`**, public |
| Website | `uma-rpg.web.app`, the default site, *now named in `firebase.json`*, *20 versions* | **`uma-quest.web.app`** (free today; `uma-quest-lm` if it's gone) | **`uma-farm.web.app`** (free today; `uma-farm-lm` if it's gone) |
| Firebase web app | Uma RPG web | **Uma Quest web** | **Uma Farm web** |
| API | Cloud Run `rpg-api` | **`quest-api`** | **`farm-api`** |
| Runtime account | `rpg-api-runtime`, *its Firestore role conditioned to `(default)`* | **`quest-api-runtime`** | **`farm-api-runtime`** |
| Database | `(default)`: `saves`, `saveRescues`, `push`; *delete protection and recovery on* | **`quest`**: `saves`, `saveRescues` | **`farm`**: `saves`, `saveRescues`, `parcels`, `push` |
| Images | `rpg`, last 3 | **`quest`**, last 3 | **`farm`**, last 3 |
| Deployer | `github-deployer`, *narrowed to its own service and images* | **`quest-deploy`** | **`farm-deploy`** |
| Deploy sign-in | Provider `uma-rpg`, `main` only | **Provider `uma-quest`**, `main` only | **Provider `uma-farm`**, `main` only |
| Master data | Reads `gs://uma-platform-master-data` | **Reads it** | **Reads it** |
| Private content | `gs://uma-rpg-content` (enemies) | **`gs://uma-quest-content`** (stories), versioned | None |
| Push | `rpg-vapid`, `rpg-push-scheduler`, `rpg-push-tick` | None | **`farm-vapid`, `farm-push-scheduler`, `farm-push-tick` (paused)** |
| Parcels | Receiver later (`FARM_API_URL`) | **Receiver** (`FARM_API_URL`) | **Sender**: `parcels`, `/api/post/*`, `POST_CALLERS` |
| Label | *`app=rpg`* | **`app=quest`** | **`app=farm`** |
| Local ports | API 8081, web 5174 | API 8091, web 5184 | API 8101, web 5194 |
| Shared by all three | Firebase Auth (Google sign-in, one allowed email), the `github-actions` pool, the $5 budget, the project's APIs | | |

**Repository variables** for each new repo: `GCP_PROJECT_ID=uma-rpg`, `WIF_PROVIDER`, `DEPLOY_SA`, `ALLOWED_EMAIL`,
`MASTER_BUCKET`, `FIRESTORE_DATABASE`, `HOSTING_SITE`, `DEPLOY_ENABLED`. Then:
- uma-quest adds `CONTENT_BUCKET` and `FARM_API_URL`;
- uma-farm adds `PUSH_AUDIENCE` and `POST_CALLERS`.

The bootstrap prints them all; Claude sets them with `gh variable set`.

## Who can reach what

The matrix Step 4 checks (IN21). ✓ is granted; everything else must come back refused.

| Account | `(default)` | `quest` | `farm` | `rpg-api` | `quest-api` | `farm-api` | Images |
|---|---|---|---|---|---|---|---|
| `rpg-api-runtime` | ✓ read/write | ✗ | ✗ | runs as | | | |
| `quest-api-runtime` | ✗ | ✓ read/write | ✗ | | runs as | `/api/post` by token | |
| `farm-api-runtime` | ✗ | ✗ | ✓ read/write | | | runs as | |
| `github-deployer` | | | | ✓ deploy | ✗ | ✗ | `rpg` only |
| `quest-deploy` | | | | ✗ | ✓ deploy | ✗ | `quest` only |
| `farm-deploy` | | | | ✗ | ✗ | ✓ deploy | `farm` only |

Sites are the one exception (IN7): every deployer may deploy any site, so each workflow names its own and CI refuses the
others.

## The order of work

### Step 0: the logs (Claude, docs, S)

1. **uma-platform:** three P-decisions, at the next free numbers (IN24): three apps in one project, uma-farm with its one-way
   parcels, and three.js for uma-quest. Also the games table in `architecture.md` §1 (uma-quest, uma-farm, their project),
   the master bucket's readers in §6, and roadmap rows for both.
2. **uma-rpg:** a D-decision for hosting the other two apps and Step 1's hardening, at the next free number (D308 today),
   and H169 in the handoff queue.

**Exit:** both logs pushed.

### Step 1: uma-rpg hardened, H169 (Claude, S)

On the live project, after your go, one change at a time, each checked before the next:

1. **Name the site.** `firebase.json` gets `"site": "uma-rpg"`, the workflow deploys `hosting:uma-rpg`, and a CI check
   compares the two. A manual run of the deploy passes (A3).
2. **Labels:** `app=rpg` on `rpg-api`, the `rpg` images and `gs://uma-rpg-content` (A7).
3. **The database:** delete protection and point-in-time recovery on `(default)` (A4).
4. **The runtime account:**
   - Add the binding conditioned to `(default)` (A1), and confirm in Policy Troubleshooter that it grants `(default)`.
   - Then remove the unconditioned binding.
   - The push tick reads `(default)` every five minutes, so its next run (a 200 in `rpg-api`'s logs) proves the saves
     still work, without you doing anything.
5. **The deployer:**
   - Add Cloud Run admin on `rpg-api` and Artifact Registry writer on `rpg`, then remove the project-wide grants (A2).
   - A manual run of the deploy passes: image, Cloud Run, Hosting and every check.
6. **The idle account:** remove the default compute account's Editor role (A5).
7. **Hosting:** keep the last 20 versions of `uma-rpg` (A6).

**Rollback:** each change records the binding it replaced in the packet, one command to restore.

**Checks after:** the site, `/api/health`, `/api/save` 401 and the push tick unchanged. Policy Troubleshooter shows
`rpg-api-runtime` granted on `(default)` and `github-deployer` refused project-wide.

**Exit:** uma-rpg plays exactly as before, now holding only its own pieces.

### Step 2: the repos, Q1 and F1 (Claude, S each)

1. Create the public repos `luismlorenzana/uma-quest` and `luismlorenzana/uma-farm`, with uma-rpg's settings (squash merges,
   issues on, wiki off, no branch rules).
2. **The placeholder** in each: a pnpm workspace with:
   - `apps/web`: one static page;
   - `apps/api`: NestJS with uma-server's guard, `/api/health` and `/api/save` answering 401;
   - farm: `/api/post/ping`;
   - quest: `/api/farm-check`.

   It depends on all five packages (`uma-data`, `uma-kit`, `uma-work`, `uma-server`, `uma-art`), so CI proves the package
   access.
3. **Checks from the first commit:** lint, test and build; the private-content check; the site-name check (IN7). Deploys
   stay off (`DEPLOY_ENABLED` unset).
4. **Docs:** README, CLAUDE.md, AGENTS.md, `docs/decisions.md` from D1, and `docs/technical/infrastructure.md`.

**Your step:** on GitHub, for each of `uma-data`, `uma-kit`, `uma-work`, `uma-server` and `uma-art`, open Package
settings → **Manage Actions access** → add `uma-quest` and `uma-farm` with **Read**. That's ten entries; GitHub has no API
for it.

**Exit:** CI green on both `main`s.

### Step 3: the clouds, Q2 and F2 (Claude, S each)

Each repo's `infra/bootstrap.sh` (IN15) creates, in order:

| # | Piece | uma-quest | uma-farm |
|---|---|---|---|
| 1 | Database: Native, `us-central1`, delete protection, recovery | `quest` | `farm` |
| 2 | Runtime account: `datastore.user` on its database only; reader of `gs://uma-platform-master-data` (granted in `uma-platform-lm`) | `quest-api-runtime`, also reader of its content bucket | `farm-api-runtime` |
| 3 | Image repository, keeping the last 3 | `quest` | `farm` |
| 4 | API from Google's sample image (IN8): runtime account, sizing (IN10), public invoker, label | `quest-api` | `farm-api` |
| 5 | Deployer: writer on its images, admin of its service, user of its runtime account, Hosting admin, the two service-usage roles | `quest-deploy` | `farm-deploy` |
| 6 | Deploy sign-in: a provider in `github-actions`, `main` of its repo only, allowed to act as its deployer | `uma-quest` | `uma-farm` |
| 7 | Site (20 versions), Firebase web app, and its domain added to Auth's authorized domains | `uma-quest` | `uma-farm` |
| 8 | Its own extras | `gs://uma-quest-content`: `us-central1`, uniform access, public access prevented, versioning | `farm-vapid`, `farm-push-scheduler`, `farm-push-tick` paused (IN17) |
| 9 | Prints the repository variables | ✓ | ✓ |

**Your step:** open Cloud console → APIs & Services → Credentials → "Web client (auto created by Google Service)", the same
client as for uma-rpg. Add:
- `https://uma-quest.web.app/__/auth/handler` and `https://uma-farm.web.app/__/auth/handler` under **Authorized redirect URIs**;
- `https://uma-quest.web.app` and `https://uma-farm.web.app` under **Authorized JavaScript origins**.

Without them, Google refuses the sign-in redirect inside the Home Screen app. Sign-in arrives in the bootstrap plan, but
doing it now keeps all your steps in one sitting.

**Exit:** every piece exists; uma-rpg's checks are unchanged.

### Step 4: pipelines and proof (Claude, S)

1. **The deploy workflows:** adapted from uma-rpg's, with `firebase deploy --only hosting:<site>`. They build and deploy
   the API image, then the page.
2. **Repository variables** set; `DEPLOY_ENABLED=true`; a push to each `main` deploys.
3. **Checks in each workflow:** `/api/health` answers directly and through the site's rewrite; `/api/save` answers 401;
   the page is served `no-cache`.
4. **The parcel link** (IN18, IN20):
   - quest's `/api/farm-check` mints a token for `farm-api` and calls `/api/post/ping`, which answers ok;
   - the ping refuses no token, the wrong audience and an account off its list (its tests).
5. **The isolation matrix** (IN21), every cell checked with Policy Troubleshooter.
6. **Docs:** each repo's infrastructure page with every value; uma-rpg's lists the project's other apps; uma-platform's
   §6 lists the new readers.

**Exit:** three sites live, two of them placeholders; every matrix cell as expected; uma-rpg unchanged; the bill unchanged
within cents.

## What the cloud adds to the bill

| Added to the `uma-rpg` project | Free tier | At one player |
|---|---|---|
| Recovery on `(default)` (Step 1) | None | Under a cent: the saves are a few MB |
| Firestore `quest` and `farm` | None: the free quota covers only `(default)` | A few cents a month each |
| Recovery on `quest` and `farm` | None | Under a cent |
| Cloud Run `quest-api`, `farm-api` | Shared across the billing account: 2M requests and 180k vCPU-seconds a month | $0 |
| Two Hosting sites | Shared across the project: 10 GB stored, 360 MB a day | $0 |
| Images `quest`, `farm` | 0.5 GB, with `rpg` (94 MB) and the racer's (101 MB) | $0; a cent if they pass 0.5 GB |
| `gs://uma-quest-content` | 5 GB of US storage | $0: a few MB of stories |
| `farm-push-tick` | 3 jobs free per billing account; 1 used today (`rpg-push-tick`) | $0 |
| `farm-vapid` | 6 secret versions free per billing account; 1 used today | $0 |
| Parcel calls between servers | Inside Cloud Run's free requests | $0 |
| **Total** | | **Under $1 a month, most likely under 25 cents.** The $5 alert (emails at $1 and $5) covers all three apps |

Sources: [Firestore pricing](https://cloud.google.com/firestore/pricing),
[point-in-time recovery](https://firebase.google.com/docs/firestore/pitr) (billed by database size, no free tier),
[Cloud Run pricing](https://cloud.google.com/run/pricing) (free tier per billing account),
[Cloud Scheduler pricing](https://cloud.google.com/scheduler/pricing) (3 free jobs per billing account),
[Firebase Hosting multisites](https://firebase.google.com/docs/hosting/multisites),
[Firestore access with IAM conditions](https://firebase.google.com/docs/firestore/enterprise/connect) (`resource.name` on
the database).

## Risks

| Risk | Handling |
|---|---|
| Narrowing uma-rpg's live permissions breaks its saves or its deploys | One change at a time; the push tick proves Firestore access within five minutes and a manual deploy proves the deployer; each old binding is one command away |
| An IAM condition on a Native-mode database behaves differently from the documented one | Policy Troubleshooter confirms the grant before the old binding goes; the push tick confirms it live |
| Hosting admin is project-wide | IN7: each workflow names its site, and CI refuses another |
| The placeholders' public routes (`/api/farm-check`, `/api/post/ping`) | They answer only "ok" or "refused" and touch no data; the bootstrap plan replaces them |
| A site name gets taken before Step 3 | Fall back to `-lm`, as uma-platform's project did (P34) |

## Next: the bootstrap plan

Once this plan's exit holds, the bootstrap plan takes the two placeholders to real apps. That covers:
- the stack from uma-rpg (React, Vite, Tailwind, Zustand and Dexie, NestJS, uma-kit's shell);
- Google sign-in and a synced save v1;
- the update prompt and the Home Screen install;
- local running on the ports above;
- farm only: its push and the real parcel routes.

uma-rpg is already built; it gets only its parcel receiver, when you want one.
