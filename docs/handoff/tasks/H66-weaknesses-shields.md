# H66 — Weaknesses and shields: every foe weak to her twins, Tier 1's shields, the coverage checks, the Rift's twins and guided builds (dark)

**uma-rpg · Claude · M · Needs: H64 · Unblocks: H71 (with H65, H68), H70**

## Why

Today a foe is weak to 2–5 kinds, half drawn at random, by five rules. With three weapons a class that can't work: an
Uma answers about half the foes, and the list can't be read. [Class Progression](../../design/tier-rework/class-progression.md)
§4 (D192) makes it one rule: **a Tier 1 foe is weak to her twins, the element that beats hers on the ring and its twin
Arm** (CP5), every foe and rank. Breaks come slower with fewer answers, so **shields drop**: sub-bosses 6 → 5, bosses 8 → 6
(CP8, SB6). The campaign is checked balanced on the owner's defaults by four coverage checks (CP4); the Rift draws its
Duel and Horde as twins and hands each path a **guided build**, the composition and every member's three weapons (CP7).

All of it is the foe generators' and the Rift's data: no engine change. It reads the live generation, so the deployed game
is unchanged until H72; tests and the balance pass ask for v16 explicitly.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`. [class-progression.md](../../design/tier-rework/class-progression.md) §2.3 (the guided
  builds), §3.2 (the defaults), §4.1 (twins), §4.3 (the Rift's fronts), §4.4 (locks and shields), §4.5 (the checks and their
  tables), §16 (CP4, CP5, CP7, CP8); [stat-balance.md](../../design/tier-rework/stat-balance.md) §10 and SB6;
  [rift.md](../../design/rift.md) §5 (the fronts) and D178 point 5 (classes v2's compositions, kept).
- H64's D-rows and `caps-at.fixture.ts`.
- **The code** (lines on `421eacd`):
  - `rpg/kinds.ts` 50–61: `RPG_KIND_PAIRS` (the twins: Greatsword and Fire, Axe and Ice, Lance and Lightning, Bow and Light,
    Katana and Dark), `rpgElementWeakness`.
  - `world/biomes.ts` 20–48: the 19 biomes' signatures (48, a pair's two leads half each) and `signatureWeaknesses`.
  - `world/world.ts`: 87–100 the formations' shields (regulars: solo 6, duo 4, trio 3, squad 2, swarm 1, escort 2 and its
    captain 5); 160–184 `regionChapter`; 196–262 `stageWaves` (199–208 today's weaknesses; 214–221 `foe`, whose `slot`
    picks her lead element at 216; 242 the sub-boss's shield, 249 the boss's).
  - `rpg/campaign/chapters.ts` 137–145 the chapters' weaknesses (the capitals' Finals reuse them through
    `world/capital.ts`), 146 regular shields, 175 the sub-boss's and the boss's; 188 `rpgCampaignChapter`.
  - `rpg/campaign/enemies.ts` 11–26 `RPG_FOE_TUNING` (shields at 24–25: regular 2 and 3, sub-boss 6, boss 8).
  - `world/capital.ts` 18–41 `capitalChapter`; `apps/web/src/battle/campaign.tsx` 44 (the web builds chapters live).
  - `rift/fronts.ts`: 12–19 `RiftFrontSpec`; 21–49 the guided classes by generation; 63–114 `RIFT_TUNING` (`weak` 106–113:
    Iron one Arm, Arcane two elements and one for a boss, the Duel two of each at stages 1–6 and one at 7–12); 116–121
    `RiftTuning`; 126–142 `RIFT_TUNING_V15`, `riftTuning`.
  - `rift/generate.ts` 73–101 `waveWeaknesses` (the Duel's independent draws 94–95, the Horde's 25 pairs 96–99), 115–157
    `riftFight`.
  - `world/tier1-foes.test.ts`: the Tier 1 foe digest. It reads the live generation, so it doesn't move here; H72 moves it
    on purpose.

## Decisions made

**The approved calls:**
- **CP5 — her twins.** A foe reads **her lead element** (a pair signature's lead alternates by slot, W3, as her `element`
  does): her answer is the element that beats it (`rpgElementWeakness`); if that answer is one of her own, she reads her
  second element instead. Her weaknesses are that **answer and its twin Arm**: `{ weapons: [arm], elements: [answer] }`.
  **Light and Dark together** answer to no element: she's weak to **the Bow and the Katana** ("Twilight"), `{ weapons:
  ['bow', 'katana'], elements: [] }`. Every foe, every rank: regulars, sub-bosses, bosses and the capitals' Finals. A
  foe's own element is never her weakness.
  - Worked: Fire → Lightning and the Lance; Ice → Fire and the Greatsword; Lightning → Ice and the Axe; Light → Dark and
    the Katana; Dark → Light and the Bow; Fire + Lightning → Ice either way; Ice + Light → Fire (lead Ice) or Dark (lead
    Light).
  - Over the world's 48 signatures the twin sets answer Fire 11, Ice 11, Lightning 9.5, Dark 8, Light 6.5, Twilight 2
    (checked against this rule: they reproduce exactly).
- **CP8 and SB6 — Tier 1's shields:** **sub-bosses 5, bosses 6**; regulars unchanged (the formations' 1–6, the chapters' 2
  and 3, guards and assistants 2). Locks as today: a charged move's 2–4 locks are drawn from her weaknesses, the Duel's
  mixed. Tier 2's and 3's own shields (9, 10) and their narrowing (CP6) are R4's: in R1 every tier's world plays these
  (implementation.md "Between releases").
- **CP4 — the campaign's four checks**, on the owner's defaults (H64) and the generator:
  1. the five fight types' defaults hold all ten kinds, with a Paladin or with a Cleric;
  2. the default party has at least two members who answer each Tier 1 twin set, with either healer (Cleric: Fire 2,
     Ice 3, Lightning 3, Light 2, Dark 2, Twilight 3; Paladin: 3, 3, 3, 2, 2, 2);
  3. the default party holds every single kind at least once (Cleric: Greatsword 1, Axe 1, Lance 2, Bow 2, Katana 1,
     Fire 1, Ice 2, Lightning 2, Light 2, Dark 1; Paladin: 2, 2, 2, 1, 1, 1, 1, 2, 2, 1);
  4. any class can answer any twin set with one pick (a kind of its channel in one slot).
  A member answers a twin set when she holds either kind (Twilight: the Bow or the Katana). On the default party a foe
  has **2.47** answers on average with a Cleric and **2.66** with a Paladin, weighted by the 48 signatures; one Uma on her
  defaults answers Brawler and Mage 66%, Paladin 59%, Spell Blade and Cleric 41%, Summoner 34%.
- **CP7 — the Rift, Tier 1.** Today's counts stay; the Duel and the Horde draw **twin sets**:
  - **Iron:** one Arm a foe (today's); **Arcane:** two elements a foe, one for a boss (today's).
  - **Duel:** the boss is weak to **two twin sets at stages 1–6, one at 7–12** (today's counts, drawn as sets: the sets'
    Arms and elements); her locks stay mixed (Arms, element, Arms …).
  - **Horde:** **each foe a twin set; a wave repeats none until all five are used**; a champion pair's partners take
    different sets first (as `draw` does for pairs today).
  - **Guided builds** (§2.3; compositions D178 point 5, unchanged; slot order lead channel first):

    | Front | Members and their three weapons |
    |---|---|
    | Iron | Brawler: Greatsword, Axe, Lance · Brawler: **Bow, Katana, Axe** · Spell Blade: Katana, Lance, Thunder Tome · Spell Blade: **Bow, Greatsword, Fire Tome** · Paladin: Greatsword, Axe, Light Tome |
    | Arcane | Mage, Mage, Summoner, Summoner, Cleric, all on their defaults |
    | Duel | Brawler: defaults · Brawler: **Bow, Katana, Lance** · Mage: defaults · Mage: **Light, Dark, Thunder Tomes** · Paladin: defaults |
    | Horde | Spell Blade: defaults · Spell Blade: **Greatsword, Axe, Fire Tome** · Summoner: defaults · Summoner: **Blizzard, Fire Tomes, Lance** · Cleric: defaults |

    The checks (§4.5): each build has at least two members who answer each of its Tier 1 foes (Iron every Arm ≥ 2:
    Greatsword 3, Axe 3, Lance 2, Bow 2, Katana 2; Arcane every element ≥ 2: Fire 2, Ice 3, Lightning 2, Light 3, Dark 2;
    the Duel's twin sets 3, 3, 4, 3, 2; the Horde's 2, 3, 2, 2, 2), and holds every single kind its later foes can ask for
    at least once (the Horde: Greatsword 1, Axe 1, Lance 2, Bow 2, Katana 1, Fire 2, Ice 2, Lightning 1, Light 2, Dark 1).

**This packet's decisions:**
- **The rule's home.** `rpg/kinds.ts` gains `RPG_TWIN_SETS` (Fire, Ice, Lightning, Light, Dark and Twilight, each its
  kinds), `rpgTwinArm(element)`, `rpgTwinsOf(signature, slot)` (the rule above, shaped as `BattleWeaknesses`) and
  `rpgAnsweredTwinSets(kinds)` (the sets a list of kinds answers: the checks here, and H70's seat line). Why `kinds.ts`:
  the world and the chapters both need it, and it is vocabulary (no cycle from `rpg/campaign` into `world`).
- **The generators take an engine.** `regionChapter(region, roster, engine = BATTLE_ENGINE_VERSION)` passes it to
  `stageWaves`; `rpgCampaignChapter(…, engine)` and `capitalChapter(…, engine)` the same. From v16 the weaknesses are the
  twins and the shields `rpgFoeShields(engine)`'s; to v15 byte for byte today's (a test compares whole chapters).
- **The shields' home.** `rpgFoeShields(engine)` in `rpg/campaign/enemies.ts`: `{ subBoss: 6, boss: 8 }` to v15
  (`RPG_FOE_TUNING`'s), `{ subBoss: 5, boss: 6 }` from v16 (`RPG_FOE_SHIELDS_V16`). H71 tunes the v16 values if the
  rounds to a Break miss.
- **The Rift by generation.** `riftTuning(16)` is `RIFT_TUNING_V16`: v15's numbers, its `weak.duel` drawn as `sets`
  ([2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1]); `waveWeaknesses(…, engine)` deals the Duel's sets and the Horde's five-set rotation
  from v16. `RiftTuning` gains the optional `weak.duel.sets`. H71 owns every other v16 Rift number.
- **The guided builds' home.** `rift/fronts.ts`: `riftGuidedBuild(front, engine)` → five `{ classId, weapons }`: v16 the
  table above; to v15 the guided classes on their own defaults. `RiftFrontSpec` gains `build`, the live one. The screen's
  one-tap use is H70's.
- **The coverage checks are a test**, run on every build (fast: the defaults, the biome table and every Tier 1 region's
  v16 chapter); they print nothing.
- **No engine change, no save change, nothing on screen.** `pnpm docs:update` leaves no diff: the `biomes`, `foe-scaling`,
  `region-sample` and `rift-fronts` blocks read the live generation (today's until H72; H72 rewrites them).

## Do

1. **`rpg/kinds.ts`:** the twin vocabulary and rule, each with a one-line comment.
2. **`rpg/campaign/enemies.ts`:** `rpgFoeShields`, `RPG_FOE_SHIELDS_V16`.
3. **`world/world.ts`, `rpg/campaign/chapters.ts`, `world/capital.ts`:** the `engine` argument, twins and shields from
   v16.
4. **`rift/fronts.ts`, `rift/generate.ts`:** `RIFT_TUNING_V16`, the twins' draws, `riftGuidedBuild`, `RiftFrontSpec.build`.
5. **Tests:**
   - `world/twins-v16.test.ts`: every worked case above; every foe of every Tier 1 region's v16 chapter (and of each
     capital's) has one Arm and its twin element, or the Bow and the Katana when her signature is Light + Dark, and never
     her own element; v16 sub-bosses 5 and bosses 6, regulars' shields unchanged; v15 chapters deep-equal today's
     (`regionChapter(r, roster, 15)` and the default before this packet: a snapshot taken first, or compare
     `regionChapter(r, roster)` on the live 15).
   - `world/coverage-v16.test.ts`: CP4's four checks with each healer (the tables above, exactly); the 48 signatures'
     twin sets (11, 11, 9.5, 8, 6.5, 2); the average answers 2.47 and 2.66 (±0.01); one Uma's answered shares (66, 66, 59,
     41, 41, 34%, ±1); CP7's per-front checks on `riftGuidedBuild(front, 16)` (the tables above); every build is legal
     (`validRpgWeapons(c, w, 16)`).
   - `rift/generate-v16.test.ts`: a Duel boss at stages 1–6 is weak to two sets' four kinds, at 7–12 to one set's two; a
     Horde wave of 6 deals five different sets before repeating one; Iron and Arcane draw as today; v15 fights deep-equal
     today's (`riftFight(ctx, ref, 15)`).
   - Both replay fixtures pass untouched.
6. **Docs:** implementation.md §3: "Built: H66 (D…)". The D-row (fetch `main` first). `pnpm docs:update` leaves no diff.
7. **Check it locally** (390×844, desktop browser, scratch save): a region's stage sheet and a fight show today's
   weaknesses and shields; the Rift's guidance as today.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 5 pass; v15 generation is byte for byte today's; both replay fixtures pass.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged.
- [ ] The local check in step 7 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h66-weaknesses-shields` with one commit,
  `feat(domain): twin weaknesses, Tier 1's shields and the Rift's guided builds on v16, dark (H66)`. H65 and H67 run
  beside it; `rpg/kinds.ts` may meet H65's edits: rebase on whichever lands first. Fetch `main` before you push. The main
  session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H66 done (D…)` commit deletes this file, sets H66 to Done with a
  Done row, and sets H71 to Ready if H65 and H68 are done.
