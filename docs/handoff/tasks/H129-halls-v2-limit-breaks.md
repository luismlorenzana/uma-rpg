# H129 — Halls v2 in the domain: five halls, twenty Limit Breaks with their own power, engine v19 (dark)

**uma-rpg · Claude · M · Needs: H126, H128 · Unblocks: H130, H131, H133 (and H134)**

## Why

Halls v2 (D241, [halls-v2.md](../../design/classes-v3/halls-v2.md)) rebuilds the Halls of Heroes on Classes v3's tree:
**five halls, one per family** (the Warrior Dojo, the Mage Tower, the Spell Blade Salle, the Summoner Circle and the Healer
Sanctum), **four seats each, twenty Limit Breaks**, and **each Limit Break carries its own power** so the owner's order
holds whoever casts it (the Ultimates 2.9×, the tri attacks 2.5×, the rest 2.2×, the pacts 1.9× at random, the healers'
2.0× with one stack), × her class's scale (the Paladin and the Cleric 0.75) × her open depth's power. It rides Classes v3's
engine v19 and save v32 (HV24).

This packet builds the halls' ids by generation, the twenty, the scale, the two shapes Limit Breaks need (a volley cast and
a double struck at random foes), and the hit cap, dark. The save's merge of the healer seats is H130's; the Learning and
Hall pages are H133's; the balance is H131's.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`; D240, D241 and H126's and H128's D-rows in [decisions.md](../../decisions.md).
- **The design, in full:** [halls-v2.md](../../design/classes-v3/halls-v2.md) §0 (the twenty), §2 (HV1–HV4), §3 (HV5–HV7: the
  formula, the ladder, the damage order and its checks), §4 (every Limit Break's card), §5 (HV17, coverage), §6 (HV22,
  HV23), §7.3 (save v32's seat ids, which H130 writes), §8, §9, §10, §11 HV-A; the preview
  [halls.html](../../design/classes-v3/previews/halls.html). [classes-v3.md](../../design/classes-v3/classes-v3.md) §15 (the
  seam) and §4.1 (the volley).
- **The manual:** `docs/game/heroes.md`, `combat.md` (Limit Breaks).
- **H126 and H128** (merged): the 13 classes, `rpgOpenPower` (a Tier 0's open power is her skill's at her rank), H126's
  v18 fixture (Hero and Learner casts from `paladin-*` and `cleric-*` seats); `RPG_VOLLEY`, `rpgAnsweredTwinSets(kinds,
  engine)` and the plain splash from v19.
- **The code** (line numbers on `main` at `b9ce7c5`; H126 and H128 move some, re-read them):
  - `rpg/hero-id.ts`: `HeroLimitId` (:7, `${RpgClass}-n`), `ALL_HERO_LIMIT_IDS` (:10), `HERO_LIMIT_IDS` (:12),
    `isHeroLimitId` (:15), `heroLimitClass` (:17), `HERO_HALLS` (:31), `hallClass` (:35).
  - `rpg/heroes.ts` (a lazy chunk): `POWER_V1`/`POWER_V2`/`HERO_LIMIT_POWER` (:17–:20), `HeroHit` (:26, two kinds fuse),
    `HeroCast` (:32), `HeroLimit` (:39), the 20 of v1 (:46), v15's (:103), v16's two changes (:124), `byVersion` (:129),
    `HERO_LIMITS`/`heroLimit`/`heroLimitFor`/`heroLimitPower`/`heroLimitsOf`/`heroLimitKinds` (:133–:147),
    `heroLimitSkills` (:153: every-foe hits and splashes at `RPG_AOE_SHARE`, random hits ×`RPG_RANDOM_BONUS`).
  - `rpg/battle/limit.ts`: `heroPlan` (:34, power = `heroLimitPower(classId)` × `level`), `battleLimitPlan` (:48).
  - `rpg/battle/engine.ts`: `validHeroes` (:188 area; seats by generation), the Limit Break branch of
    `applyBattleAction` (:1109–:1125), `cast()`'s random hits (:929–:942, `randomFoe` :904) and its status.
  - `rpg/catalog.ts` `RpgHit` (:29).
  - Readers of the ids: `save/heroes.ts` (`HERO_LIMIT_IDS`, the live seats), `save/save.ts` `parseBonds`/`parseHeroes`
    (:733, :749, `isHeroLimitId` live), `rift/balance-sim.ts` (`limitRail` with `HERO_LIMIT_IDS` :202 and
    `ALL_HERO_LIMIT_IDS` :269, :334), `docs/render.ts` (:33–:34, :242–:273, the live tables), and the web
    (`places/halls/HallPage.tsx`, `hall-view.ts`, `hub/HubScreen.tsx:63–:65`, `places/stable/OutfitProfile.tsx:346–:360`,
    `places/registry.tsx:69`: `HERO_HALLS`, `hallClass`, `heroLimitClass`, `heroLimitsOf`).
  - `hub/places.ts` `learningPlaces` (:185): H133's.

## Decisions made

### The design's calls (exact values)

**HV1, HV3, HV20, HV21: the halls and seats.** A seat's id is `${hall}-${n}`; four halls keep their ids, the Healer
Sanctum is new:

| Hall id | Place id | Name (H133 shows it) | Seats 1–2 home | Seats 3–4 home |
|---|---|---|---|---|
| `brawler` | `brawler-dojo` (kept) | Warrior Dojo | `brawler` | `brawler` |
| `mage` | `mage-tower` (kept) | Mage Tower | `mage` | `mage` |
| `spellblade` | `spell-blade-salle` (kept) | Spell Blade Salle | `spellblade` | `tomeblade` |
| `summoner` | `summoner-circle` (kept) | Summoner Circle | `armsummoner` | `summoner` |
| `healer` | `healer-sanctum` (new; wears `knights-bastion` until H135) | Healer Sanctum | `paladin` | `cleric` |

No Tier 0 hall; any Uma sits in any seat (HV4). The Paladin Bastion (`paladin`, `paladin-bastion`) and the Cleric Chapel
(`cleric`, `cleric-chapel`) stay as engines v15–v18's halls for their replays.

**HV5–HV16: the twenty.** Power is the Limit Break's own; "share" is of that power; a **double** strikes twice at half its
share, the second hit on the same foe; a **volley** cast strikes its hits on the tapped foe at `RPG_VOLLEY.target` (0.8) of
their share and one splash hit on every other foe at `RPG_VOLLEY.splash` (0.35) of its share; `all` hits strike every foe at
the area share (0.55); `random` hits ×1.05.

| Seat | Name | Target | Hits in order (kind share; d = a double) | Power | Status |
|---|---|---|---|---|---|
| `brawler-1` | Triad Onslaught | one | Greatsword ⅓, Axe ⅓, Lance ⅓ | 2.5 | — |
| `brawler-2` | Ten Thousand Swings | one | Greatsword 1 | 2.9 | — |
| `brawler-3` | Echo Draw | one | Katana ⅓ d, Katana ⅓ d, Katana ⅓ d (6 hits) | 2.2 | — |
| `brawler-4` | Hundred-Arrow Rain | two volley casts, ½ each | each: Bow ¼, Bow ¼ on her foe; splash Bow ½ | 2.2 | — |
| `mage-1` | Triad Tempest | one | Fire ⅓, Ice ⅓, Lightning ⅓ | 2.5 | — |
| `mage-2` | Ten Thousand Candles | one | Fire 1 | 2.9 | — |
| `mage-3` | Echo Ray | one | Light ⅓ d × 3 (6 hits) | 2.2 | — |
| `mage-4` | Hundred-Shadow Rain | two volley casts, ½ each | each: Dark ¼, Dark ¼; splash Dark ½ | 2.2 | — |
| `spellblade-1` | Shrike Pact | random | Katana 0.2 d, Lance 0.2, Katana 0.2 d, Lance 0.2, Katana 0.2 d (8 hits) | 1.9 | — |
| `spellblade-2` | Firefly Pact | random | Katana 0.2 d, Light 0.2 d, Katana 0.2 d, Light 0.2 d, Katana 0.2 d (10 hits) | 1.9 | — |
| `spellblade-3` | Storm Heron Pact | random | Light 0.2 d, Lightning 0.2, Light 0.2 d, Lightning 0.2, Light 0.2 d (8 hits) | 1.9 | — |
| `spellblade-4` | Wisp Pact | random | Light 0.2 d, Katana 0.2 d, Light 0.2 d, Katana 0.2 d, Light 0.2 d (10 hits) | 1.9 | — |
| `summoner-1` | Centaur Warband | all | Axe ⅓, Bow ⅓, Axe ⅓ | 2.2 | — |
| `summoner-2` | Gargoyle Flock | all | Axe ⅓, Dark ⅓, Axe ⅓ | 2.2 | — |
| `summoner-3` | Frostshade Wyrm | all | Dark ⅓, Ice ⅓, Dark ⅓ | 2.2 | — |
| `summoner-4` | Night Colossus | all | Dark ⅓, Axe ⅓, Dark ⅓ | 2.2 | — |
| `healer-1` | Archangel's Judgment | one | Lance 0.3, Lance 0.3, Light 0.4 d (4 hits) | 2.0 | then Brave 1, 2 rounds, every ally |
| `healer-2` | Archdemon's Toll | one | first Armor Break 1 on the foe, 2 rounds; then Axe 0.3, Axe 0.3, Dark 0.2, Dark 0.2 | 2.0 | (before) |
| `healer-3` | Seraph's Pyre | one | Fire 0.3, Fire 0.3, Greatsword 0.2, Greatsword 0.2 | 2.0 | then Faith 1, 2 rounds, every ally |
| `healer-4` | Thunder Fiend's Barrage | one | first Mind Break 1 on the foe, 2 rounds; then Lightning 0.3, Lightning 0.3, Bow 0.2, Bow 0.2 | 2.0 | (before) |

No seat has support (no mend, Barrier, cleanse or revive). At most **10 hits on one foe** a cast (HV15). The names and the
deities were checked against the release by the design (HV16) and re-checked 2026-10-29: 0 exact, 0 as a word inside.

**HV5, the power:** damage at 100% = **the Limit Break's power × her class's scale × her open depth's power**, then the
damage stack as for any hit. **Scale: 1 for every class but `paladin` and `cleric`, 0.75 for those two** (a Tier 0 is 1).
Her open depth's power is H126's `rpgOpenPower` (a Tier 0's skill at her Class Rank, 1.52 → 2.20). Strength (100% a Hero,
50% + 5% a Bond Level a Learner), no Skill Rank, no MP, the gauge, Auto and every Hero and Learner rule are unchanged (HV22).
**LB+ (HV23) is Tier 2's and is not built.**

**§3.3's numbers, as the data must give them** (100%, scale 1, × her open power, before stats; "weak" ×1.3 per weak hit):
Ten Thousand Swings and Candles 2.90 on one foe, 3.77 weak; Triad Onslaught and Tempest 2.50, 3.00 on two weaknesses;
Echo Draw and Ray 2.20; Archangel's Judgment and Seraph's Pyre 2.00; Archdemon's Toll and Thunder Fiend's Barrage 2.00
(2.12 with their own curse, in a fight); the pacts 1.995 on any number of foes; the volleys 1.76 on one foe, 3.30 on three,
4.84 on five; the Circle 1.21 a foe, 3.63 on three, 6.05 on five.

### This packet's decisions

- **A hall is its own type** (HV20): `HeroHall = 'brawler' | 'mage' | 'spellblade' | 'cleric' | 'summoner' | 'paladin' |
  'healer'`, and ``HeroLimitId = `${HeroHall}-${1 | 2 | 3 | 4}` ``, no longer a class (H126's `RpgClass` grew to thirteen).
- **Ids by generation:** `heroHalls(engine)` (classes v1's five, v15–v18's six, v19's five) and `heroLimitIds(engine)`
  (20, 24, 20); `ALL_HERO_LIMIT_IDS` is every generation's **28**; `HERO_LIMIT_IDS` the live one's;
  `isHeroLimitId(id, engine)` by generation, so from v19 `healer-*` is a seat and `paladin-*`/`cleric-*` are not (the
  save's parse and the engine's `validHeroes` follow without change).
- **Seats and their homes:** `heroLimitHall(id)` (its prefix), `heroSeatHome(id, engine): RpgClass` (the table above from
  v19; the hall's class before), `HERO_HALL_PLACES: Record<HeroHall, string>` and `hallOfPlace(placeId)`,
  `heroLimitsOfHall(hall, engine)` in seat order. **Kept for the live web until H133:** `HERO_HALLS`, `hallClass`,
  `heroLimitsOf(classId)` and `heroLimitClass(id)` (now `heroSeatHome(id)` at the live engine); H133 moves the pages and the
  registry to the hall-based names, and H134 drops the old ones.
- **`HeroLimit` gains** `hall: HeroHall`, `power?: number` (v19's twenty only: the Limit Break's own) and `lore?: string`
  (the design's italic line, for H133's card); `classId` stays and means its home class. `blurb` describes the shape in
  today's style ("Three draws on one foe, each Katana cut twice").
- **Two cast shapes in the data, no fused hits from v19:** `HeroHit.double?: true` (two hits at half its share, the second
  on the same foe) and `HeroCast.volley?: true` (its hits at `RPG_VOLLEY.target` of their share on the tapped foe, its
  `splash` at `RPG_VOLLEY.splash` of its share on every other foe, instead of the area share). `heroLimitSkills` expands
  them into skill defs: a double's second hit carries `follow: true`. Older Limit Breaks have neither, so v10–v18's casts
  build exactly as today.
- **A random double's second hit follows its first (HV-A's engine addition):** `RpgHit.follow?: true`, read by `cast()`
  from v19 on random hits: the hit aims at the foe the previous hit aimed at if she still stands, else it draws as any
  random hit (by its own index, so no other draw moves). On `one` and `all` casts it changes nothing. Engines before v19
  never see it (the twenty are v19's).
- **The class scale:** `heroLimitScale(classId, engine)` (1, or 0.75 for the Paladin and the Cleric, from v19);
  `HERO_LIMIT_SCALE` the v19 table for the screens and the manual. `heroLimitPower(classId, version)` stays for v10–v18.
  From v19 `heroPlan` multiplies `limit.power × heroLimitScale(ally.classId, version) × level` (the level being H126's
  `rpgOpenPower`). H126's interim `POWER_V2` rows for the seven new classes are never read from v19.
- **The cap is a constant and a test:** `HERO_LIMIT_MAX_HITS = 10`, asserted over the twenty (hits on one foe a cast: the
  tapped foe's, a lone foe's for random casts, a foe's for `all` casts); `rift/balance-sim.ts`'s rail reads it in H131.
- **The balance simulation compiles on the generation's seats:** `limitRail`'s callers pass `heroLimitIds(engine)`
  instead of `HERO_LIMIT_IDS`/`ALL_HERO_LIMIT_IDS`, so v15–v18 rails are unchanged and H131 measures v19's twenty.
- **No save change** (H130 merges the healer seats), **nothing on screen**, `pnpm docs:update` no diff (the manual's hall
  tables read the live 24).
- **Main JS:** the hall ids and places sit in `hero-id.ts` (main, a few hundred bytes); the twenty in the lazy `heroes.ts`.
  Expect under +0.3 KB gzip.

## Names other packets read

| Name | Where | Shape |
|---|---|---|
| `HeroHall`, `HERO_HALL_PLACES`, `heroHalls(engine)`, `hallOfPlace(placeId)` | `rpg/hero-id.ts` | as decided |
| `HeroLimitId`, `heroLimitIds(engine)`, `ALL_HERO_LIMIT_IDS` (28), `isHeroLimitId(id, engine)` | `rpg/hero-id.ts` | `${HeroHall}-${1..4}` |
| `heroLimitHall(id)`, `heroSeatHome(id, engine)` | `rpg/hero-id.ts` | `HeroHall`, `RpgClass` |
| `HeroLimit.hall`, `.power`, `.lore`; `HeroHit.double`; `HeroCast.volley` | `rpg/heroes.ts` | as decided |
| `heroLimitsOfHall(hall, engine)`, `heroLimitScale(classId, engine)`, `HERO_LIMIT_SCALE`, `HERO_LIMIT_MAX_HITS` | `rpg/heroes.ts` | — |
| `RpgHit.follow` | `rpg/catalog.ts` | `true` on a random double's second hit |

## Do

1. **`rpg/hero-id.ts`:** the hall type, the ids and halls by generation, homes, places, `isHeroLimitId` by generation; the
   kept live names. Fix the tests that count 24 seats of every generation (`rules-v2.test.ts:132` to 28; the v14–v18
   replay tests' `HERO_LIMIT_IDS` counts stay, the live generation being 24).
2. **`rpg/heroes.ts`:** `BY_V19` with the twenty (power, kinds, hits, doubles, volleys, statuses, blurbs, lore, home and
   hall), `byVersion` from v19, `heroLimitScale`, `HERO_LIMIT_SCALE`, `heroLimitsOfHall`, `HERO_LIMIT_MAX_HITS`;
   `heroLimitSkills` expands doubles and volleys. The twenty's literals read the design's §4 tables, not the catalog.
3. **The engine and the plan:** `RpgHit.follow` and its reading in `cast()` from v19; `heroPlan`'s v19 power. Every rules
   call passes the fight's version.
4. **`rift/balance-sim.ts`:** `heroLimitIds(engine)` in `limitRail`'s three callers.
5. **Tests:**
   - `rpg/halls-v19.test.ts`: the ids at 14, 18 and 19 and the 28 of every generation; `isHeroLimitId` refusing
     `healer-1` at 18 and `paladin-1` at 19; each seat's hall, home at 19, kinds in lead order (`heroLimitKinds`), hit
     count, shares, shape, status and its place before or after the hits, power, against the table above; the scale; every
     Limit Break within `HERO_LIMIT_MAX_HITS` on one foe; §3.3's numbers above computed from `heroLimitSkills` (one, three
     and five foes; weak at ×1.3 a weak hit) within 0.01; §3.4's order (the Ultimate first on one foe unweak; a tri on two
     weaknesses the Ultimate's foe lacks 3.00 > 2.90; on its own weakness the Ultimate's 3.77 above every other Limit
     Break's best; a pact's best on one foe, 2.59, under every single-target seat's best, Archangel's and Seraph's 2.60 the
     next; the Circle first from three foes); §5.1's kind counts (seats
     3 · 5 · 3 · 3 · 4 · 3 · 2 · 3 · 5 · 5 for Greatsword … Dark, every kind in two halls or more, 36 kind slots); §5.2's
     sets on v19's twins (Fire 5, Ice 7, Lightning 6, Light 7, Dark 8, Twilight 7); **§5.3's pairs** on each Tier 1
     class's v19 defaults, the 190 two-seat picks that answer every twin set her weapons miss: Brawler 56, Sorcerer 56,
     Arms Spellblade 31, Tome Spellblade 31, Arms Summoner 23, Tome Summoner 23, Paladin 54, Cleric 49 (checked against
     the design's seat list while this packet was written).
   - `rpg/battle/halls-v19-engine.test.ts` (inputs `version: 19`, fixed seeds): a Hero's Ten Thousand Swings is one hit
     worth 2.9 × her open power; the same Limit Break from a Paladin Hero × 0.75; a Recruit Hero at Class Rank 4 casts on
     1.75; Firefly Pact on three foes lands its ten hits in five pairs, each pair on one foe, and on a lone foe all ten on
     her; Hundred-Arrow Rain on three foes lands four hits on the tapped foe and two splash hits on each other; Archdemon's
     Toll's Armor Break cue comes before its first hit and Archangel's Judgment's Brave after its last, on every ally; a
     Learner at Bond 0 casts at 50% and lands the whole stack; no cue from a v19 seat mends, shields or revives; a v19 input
     refuses `paladin-1` and a v18 input refuses `healer-1`.
   - H126's v18 replay tests (live and at 19; their Paladin and Cleric seats replay on v18's Limit Breaks) and every
     earlier replay test pass unchanged; the Rift balance tests (old engines) pass.
6. **No rules call inside `rpg/battle/` relies on a default `engine`.**
7. **Docs:** a D-row (fetch `main` first; the next free number) for this packet's decisions. halls-v2.md §2, §3, §4 and §7.3's
   seat-id row gain "Built in H129 (D…), live from H134." `pnpm docs:update`: no diff.
8. **Check it locally** at 390×844 on a scratch save from the CJS build: the Learning page, a Hall page with a Hero and
   Learners, a world stage where a Hero casts her Limit Break on Auto: all as before (`"version": 18`).

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB) and this packet's change.
- [ ] Step 5's tests pass, with every replay test live and at 19.
- [ ] No rules call inside `rpg/battle/` relies on a default `engine`.
- [ ] `docs/game/` is unchanged and `pnpm docs:update` leaves no diff; the D-row is logged; the design lines are in.
- [ ] Step 8's local check was done and described. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and https://uma-rpg.web.app/api/health
  shows the commit in `build`.

## Deliver

- **Claude:** a branch `feat/h129-halls-v2-domain` and one pull request, commit `feat(domain): Halls v2's twenty Limit
  Breaks on engine v19, dark (H129)`; the body says why and gives the main JS number. Fetch `main` before you push so the
  D-number is free. After CI passes, Claude merges it and watches the deploy.
- **Flag it done:** a `docs(handoff): H129 done (D…)` commit deletes this file, adds H129's Done row to
  `docs/handoff/README.md` with the commit, and sets H130 Ready (H131 and H133 when their other needs are done).
