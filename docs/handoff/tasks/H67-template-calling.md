# H67 — The Uma Template and the calling (domain): the rule, the 90 names, the calling pick's rules, the start by calling (dark)

**uma-rpg · Either · M · Needs: H64 · Unblocks: H68 (with H64), H69 (with H65), H70**

## Why

[Uma Templates](../../design/tier-rework/uma-templates.md) (D197) makes each Uma a little unique **by one rule over her
racing profile**: three readings (her **calling**, **stride** and **knack**) name her template, "{knack word} {type}",
one of 90 ("Tireless Ironhide"), and feed five small pieces. Her calling is also her **fight type and starting class**,
with a **one-time pick** for Pace and Late Umas (CP29, CP30). R1 uses the calling, the name and the Flourish (H68); R2
adds her signature accessory and her moon; R4 her tip.

This packet writes the pure domain: the rule, the catalog of names, the pick's options and the start by calling. It
stores nothing (the pick's save field is H69's) and shows nothing (H70 draws it). The start by calling reads
`rpgRework('fight')` (H64), so the deployed game starts Umas as today until H72.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md` (nothing from the original games in git: no Uma, skill or character names, in code, tests or
  docs; use invented outfits). Then [uma-templates.md](../../design/tier-rework/uma-templates.md) in full, especially §2
  (UT2–UT5: what a template is, the rule, the pick, the catalog), §3.2–§3.3 (the calling, the Flourish's names), §3.8
  (UT12), §5 (UT15's facets), §6 (worked Umas), §9 (UT17), §13. And [class-progression.md](../../design/tier-rework/class-progression.md)
  §10 (CP29, CP30).
- H64's D-rows (the R1 build decisions, points 4–5: the calling from R1, its trade from R2; what the template shows in R1).
- **The code** (lines on `421eacd`):
  - `packages/domain/src/master/roster.ts` 5–24 `RosterOutfit` (`aptitudes` with `surface`, `distance`, `strategy`;
    `baseStats` at her starting stars; `growthRatePercents`; `rarity`), 47–50 `startingStats`.
  - `roster/aptitudes.ts` 7–12 `STYLE_CLASSES` (today's "Learns fastest"), 33–37 `best` (the best key of a grade group;
    ties keep the group's order).
  - `save/class.ts`: 13–18 `BattleOutfit` (`aptitudes: Pick<Aptitudes, 'strategy'>`), 20–21 `styleClass`, 23–30
    `StartingOutfit`, `startingClass` (v15: a Late surger with Power over Wit starts as a Paladin), 33–35 `activeClass`
    (`classId ?? styleClass(outfit)`).
  - `save/save.ts` 219–227 `startingArmorKinds`, `newOwnedUma` (writes `classId` only for a Paladin start); `save/rules.ts`
    64–80 `unlockUma`; `apps/web/src/save/game.ts` 125–128 `unlock` (passes `startingClass(outfit)`).
  - `rpg/battle/caps.ts`: `rpgRework` (H64). `rpg/battle/types.ts`: the battle types (the Flourish's type goes there).
  - Test fixtures that build a `BattleOutfit` by hand (they gain a `distance` group): `grep -rn "aptitudes:" packages`.

## Decisions made

**The approved calls this packet builds:**
- **UT2 — what a template is:** three readings of her racing profile and five pieces: her calling's effects, ★ the
  Flourish, ★ the signature accessory, ★ her moon, ★ the signature tip. Never a damage kind, a weapon bonus, a lean, a
  pace change, a party synergy or a malus.
- **UT3 — the rule, one pure function of master data by stable id**, never a list of Umas or names; reads
  `aptitudes.strategy`, `aptitudes.distance`, base stats at her starting stars and `growthRatePercents`; never surface,
  her skills, her name or her id:
  1. **Calling**, the first row that fits ("A" counts S as A; style ties go Front, Pace, Late, End; Power = Wit goes
     magical):

     | # | Her racing profile | Calling | The pick (CP29) |
     |---|---|---|---|
     | 1 | Best style Front | Brawler | — |
     | 2 | Wit ≥ Power, and A in two of Pace, Late, End | Summoner | — |
     | 3 | Best style End | Summoner | — |
     | 4 | Best style Pace, Power > Wit, best distance Sprint | Brawler | — |
     | 5 | Best style Pace, Power > Wit | Spell Blade | Spell Blade (pre-selected) or Mage |
     | 6 | Best style Pace, Wit ≥ Power | Mage | Mage (pre-selected) or Spell Blade |
     | 7 | Best style Late, Power > Wit | Paladin | Paladin (pre-selected) or Cleric |
     | 8 | Best style Late, Wit ≥ Power | Cleric | Cleric (pre-selected) or Paladin |

     "Best distance Sprint" (row 4) is the **shortest** distance at her best distance grade; the stride reads the
     **longest**. Then her pick, if she has one and it is one of her row's two.
  2. **Stride:** the longest distance at her best distance grade: Sprint or Mile **Dash**, Medium **Middle**, Long
     **Stayer**.
  3. **Knack:** her highest growth rate; ties: the higher base stat, then Speed, Stamina, Power, Guts, Wit. Speed
     **Fleet**, Power **Mighty**, Stamina **Tireless**, Guts **Gritty**, Wit **Clever**.
  4. **Template:** calling × stride → her **type**; knack → its **word**: "{word} {type}".
  5. **Family** (R2's signature accessory, computed now so R2 reads it): Fleet a Bell, Mighty an Orb, Tireless a Pendant,
     Gritty and Clever an Insignia.
- **UT5 — the catalog: 6 × 3 types, × 5 knacks, 90 templates:**

  | Calling | Dash | Middle | Stayer |
  |---|---|---|---|
  | Brawler | Charger | Bruiser | Ironhide |
  | Spell Blade | Flashblade | Spellfencer | Longblade |
  | Mage | Flarecaster | Spellwright | Starkeeper |
  | Summoner | Beckoner | Binder | Shepherd |
  | Paladin | Shieldrunner | Warden | Stalwart |
  | Cleric | Lamplighter | Mender | Pilgrim |

- **UT6's names (the Flourish by stride, H68 plays it):** Dash **Clean break**, Middle **Even pace**, Stayer **Late
  reserve**. **UT16:** these are the renamed words; use exactly them (two of variance.md's matched master-data skill
  names).
- **UT4, CP29, CP30 — the pick:** 163 of today's 270 outfits get it (102 Pace, 61 Late); the four signal rows stay fixed.
  Her Power against her Wit pre-selects (rows 5–8). The pick moves her calling, her type, the class her Flourish and (R4)
  tip work in, and (R2) her trade and her moon's node II; **never** her stride, knack or family. Once confirmed it never
  changes; she still switches class freely. If a master-data fix ever moves her out of a pick row, the rule's calling
  applies and a stored pick waits unused.
- **UT12 — what her class gates:** only the Flourish and the signature tip need her calling's class.
- **UT17 — nothing of the template is stored**; only the pick (H69's `OwnedUma.calling`).
- **The start by calling (CP29, CP §14):** new unlocks start in their calling (the pre-selection; the pick may move it at
  Lv 1, H69); owned Umas don't change. Today's counts by fight type: physical 61, physical hybrid 56, magical 46, magical
  hybrid 46, healer 61.

**This packet's decisions:**
- **One module:** `packages/domain/src/roster/template.ts`, pure, master data only, exported from the domain's index:
  - types `UmaStride` ('dash' | 'middle' | 'stayer'), `UmaKnack` ('fleet' | 'mighty' | 'tireless' | 'gritty' |
    'clever'), `UmaFamily` ('pendant' | 'orb' | 'bell' | 'insignia'), `UmaCalling` (`{ pick: RpgClass | null;
    confirmed: boolean }`, the save field's shape H69 stores) and `TemplateOutfit` (`aptitudes: Pick<Aptitudes,
    'strategy' | 'distance'>`, `baseStats`, `growthRatePercents`: a `RosterOutfit` fits);
  - `RpgFlourish` ('clean-break' | 'even-pace' | 'late-reserve') lives in `rpg/battle/types.ts` (the engine's input
    carries it, H68); the template imports the type;
  - `umaCallingRow(outfit)` (1–8), `umaCalling(outfit, pick?)`, `umaCallingPick(outfit)` (null for rows 1–4, else
    `{ options: [RpgClass, RpgClass], suggested: RpgClass, power: number, wit: number }`, `options[0]` the suggested),
    `umaStride`, `umaKnack`, and `umaTemplate(outfit, pick?)` → `{ calling, stride, knack, type, word, name, flourish,
    family, row }`;
  - the tables: `UMA_TYPE_NAMES`, `UMA_KNACK_WORDS`, `FLOURISH_NAMES`, `STRIDE_FLOURISH`, `KNACK_FAMILY`, and labels for
    the screens (`STRIDE_LABEL` Dash, Middle, Stayer; `KNACK_LABEL` Fleet …; `KNACK_STAT` speed …);
  - `umaFlourishActive(template, classId)`: her class is her calling's (UT12);
  - `umaTemplateFacets(outfit, pick?)` → `{ calling: RpgClass, stride, knack, name }`: what H70's Stable filter and search
    read (UT15). The web wiring is H70's.
- **`BattleOutfit.aptitudes` widens to `Pick<Aptitudes, 'strategy' | 'distance'>`.** A `RosterOutfit` already fits; the
  calling's row 4 and the stride read the distance, and H68's Flourish reads the template from a `BattleOutfit`. Hand-built
  test outfits gain a `distance` group.
- **`startingClass(outfit, engine)`** (`save/class.ts`): from v16 her calling (`umaCalling(outfit)`, the pre-selection);
  to v15 today's. `StartingOutfit` becomes `TemplateOutfit`'s fields it needs (strategy, distance, Power, Wit).
- **From v16 every new unlock writes her start as `classId`** (`newOwnedUma(now, startClass, engine)` and `unlockUma`),
  not only a Paladin start. Why: rows 2 and 4 name a class her best style doesn't (a Wit-led closer whose best style is
  Pace, a Pace sprinter), and `activeClass`'s null fallback (`styleClass`) stays for Umas unlocked before the switch, so no
  owned Uma changes class (UT17). Her armor kinds follow her start, as today.
- **The pick's rule, pure:** `umaCallingPickBlock(outfit, calling)` → why the pick can't change now, or null: "No pick for
  her" (rows 1–4), "Her calling is set" (confirmed). H69's save action (`pickCalling`) uses it; "refused while she works"
  is R2's (her trade arrives with the professions).
- **Names are checked against the master data, locally.** `roster/template-release.test.ts` runs only when
  `../uma-platform/content/release/data` exists (skipped in CI): no type, word, full template name or Flourish name equals a
  master-data skill name (case-insensitive), and the release's aggregate counts match §2.4 (fight types 61, 56, 46, 46, 61;
  163 pick-eligible, 102 Pace and 61 Late; 66 of 90 templates in use; strides 48, 118, 104; knacks 69, 69, 48, 43, 41).
  It prints counts only, never a name. If the release has moved since 2026-10-10, record its counts in the D-row instead
  of editing the doc.
- **Main JS:** `save/class.ts` is in the main bundle (the Hub reads an Uma's class, H62), so `roster/template.ts` joins
  it: keep it to the rule and its tables (well under a kilobyte gzip). Say the number.

## Do

1. **`rpg/battle/types.ts`:** the `RpgFlourish` type (no engine change here).
2. **`roster/template.ts`:** the module above, each export with a one-line comment; export it from the package index.
3. **`save/class.ts`, `save/save.ts`, `save/rules.ts`:** `BattleOutfit`'s distance, `startingClass` by generation,
   `newOwnedUma` and `unlockUma` writing the start from v16. The web's `unlock` already passes `startingClass(outfit)`
   with a `RosterOutfit`: no web change.
4. **Tests** (invented outfits only, as `RosterOutfit`-shaped literals; no names from master data):
   - `roster/template.test.ts`: each of the eight calling rows, and their edges: Front and Pace tied at A → Front (row 1);
     an S in Late counts as A for row 2; Power = Wit → Mage (row 6) and Cleric (row 8); a Pace sprinter (Sprint A, Mile A)
     with Power over Wit → Brawler (row 4) but with Mile A only → Spell Blade (row 5); strides (Medium A and Long A →
     Stayer; Sprint A only → Dash; Mile A only → Dash); knacks (a tie broken by the higher base stat, then by the order);
     the 90 names unique; `umaCallingPick` for rows 5–8 (options, suggested) and null for 1–4; a pick outside her options
     ignored; the pick moves calling, type, name and Flourish class but never stride, knack or family; `umaFlourishActive`.
   - The worked Umas of uma-templates §6 as fixtures (invented profiles, as written there, every grade not given there
     below A): §6.1's Uma A is a **Tireless
     Ironhide** and Uma G a **Fleet Ironhide**; §6.2's A–F are Tireless Ironhide, Fleet Flashblade, Clever Spellwright,
     Gritty Shepherd, Mighty Warden, Tireless Lamplighter, with their Flourishes and families; Uma C picking Spell Blade is
     a **Clever Spellfencer**, Uma E picking Cleric a **Mighty Mender**.
   - `save/starting-class-v16.test.ts` (the switch mocked to 16 with H64's `capsAt`): `startingClass` is the calling (a
     Wit-led closer whose best style is Pace → Summoner; a Pace sprinter with Power → Brawler; a Late Uma with Power over
     Wit → Paladin); `unlockUma` writes `classId` for every v16 start, with the start's armor; unmocked, today's starts
     are unchanged (`starting-class-v2.test.ts` passes untouched).
   - `roster/template-release.test.ts` as above (skipped without the release).
   - Every existing test passes (fixtures gain `distance` where the type asks).
5. **Docs:** implementation.md §3: "Built: H67 (D…)". The D-row (fetch `main` first). `pnpm docs:update` leaves no diff.
6. **Check it locally** (390×844, desktop browser, scratch save): unlock an Uma; she starts in her style's class as today
   (the switch is off). Run `roster/template-release.test.ts` against your local release and give its counts in the pull
   request.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 4 pass; the release check ran locally and its counts are in the pull request.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged.
- [ ] Nothing from the original games in git: no master-data name anywhere in the diff (`git diff` read through).
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **A delegated worker (Claude or ChatGPT):** a pull request from `feat/h67-template-calling` with one commit,
  `feat(domain): the Uma Template rule and the calling, dark (H67)`. H65 and H66 run beside it and share no files.
  Fetch `main` before you push so the D-number is free. Claude's main session reviews and merges it (ChatGPT may merge
  its own, logging its decisions), then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H67 done (D…)` commit deletes this file, sets H67 to Done with a
  Done row, and sets H68 to Ready, and H69 if H65 is done.
