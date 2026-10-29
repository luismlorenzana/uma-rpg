# H133 — Halls v2: the Learning page's five halls and the Hall page (home class, shape, power, the new pairs)

**uma-rpg · ChatGPT · S–M · Needs: H129 (the twenty Limit Breaks in the domain), H128 (the twins re-paired by engine) ·
Unblocks: H134 (the switch), H135's pin (the Sanctum's own building)**

## Why

Halls v2 (D241) folds today's six class halls into **five, one per family**: the Warrior Dojo, the Mage Tower, the Spell
Blade Salle, the Summoner Circle and the **Healer Sanctum**, which takes the Paladin Bastion's and the Cleric Chapel's
seats (HV1, HV18). Each seat now names its **home class** and carries **its own power**, so the owner's order shows
whoever casts it (the Ultimates 2.9×, the tri attacks 2.5×, the pacts 1.9× at random), and the twin sets a seat answers
follow Classes v3's new pairs (Katana–Light, Bow–Dark). The player meets all of it on two screens: the Learning page,
where the halls stand, and the Hall page, where each seat's card says what its Limit Break is (HV21, HV25).

Inert until the switch (H134): the Learning page and the Hall page read the domain by generation, so the live game shows
today's six halls until H134 moves the engine to 19. Nothing here changes a rule: H129 has the twenty, H130 the merge.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`.
- **Halls v2** ([halls-v2.md](../../design/classes-v3/halls-v2.md), D241): §0 (the five halls and twenty seats), **§2.1
  (the halls: names, lore, home classes, place ids; the Warrior Dojo's name)**, **§2.3 (who sits; seat order; home
  classes)**, §3.1–§3.2 (power: the Limit Break's own × the class scale; the ladder), §4 (each hall's table: kinds,
  shape, hits, power, side effect), §5.2 (twin sets by hall, on the new pairs), §6 (Bonds and Learners unchanged), §7.1
  (the seat map: `healer-1` … `healer-4`), §9's "Web" line; **HV1, HV3, HV4, HV20, HV21, HV25**. The
  [halls page](../../design/classes-v3/previews/halls.html) draws every hall's lore and seats.
- **Classes v3** ([classes-v3.md](../../design/classes-v3/classes-v3.md), D240): §4.3 (the twins re-paired, and every
  reader: "A Hall's seat label … reads the new sets"), §15 (the seam with Halls v2); CV13.
- **The profile v2 proposal** ([proposal.md](../../design/uma-profile-v2/proposal.md), D239): §7.1–§7.2 (C1–C10; the
  wording list: Bond, Hero), §8.2 rows #47–#52 (H117's cleanup of this page: keep its wordings), §6.2's Halls row (H124's
  Profile button in the Hero and Learner sheets).
- **The code on `main` at `b9ce7c5`** (H117 and H124 change the Hall page: re-read it). Paths under `apps/web/src/` unless
  marked:
  - `packages/domain/src/hub/places.ts`: `hall() :170–174` (blurb and details), `OBSERVATORY :176–180`, **`learningPlaces
    :185–205`** (v1 five halls; v2 six, the Paladin Bastion with `frame: 'knights-bastion'`, mirrors across the trunk
    road), `PLACES :271`; its tests `hub/places.test.ts`, `places-v3.test.ts`;
  - `places/halls/HallPage.tsx`: the title `:52` (`{class} Hall of Heroes`), the (i) `:53–62`, the seat card `:67–118`
    (`Seat {n} · Limit Break`, the name, `LimitKinds`, "Answers …" `:82–85`, the blurb `:86`, the Hero or "No Hero
    yet"), the pickers and "Adds …" `:120–137`, the Hero and Learner sheets `:139–184`, `HallPeek :189–211`;
  - `places/halls/hall-view.ts` (`TWIN_SET_LABEL`, `seatTwinSets`, `learnerAdds`) and `hall-view.test.ts`;
  - `places/registry.tsx :65–68` (every hall in `HERO_HALLS` gets the Hall page); `hub/HubScreen.tsx` (`PlaceRoute
    :43–52`: an unknown place falls back to its page; `pipsOf :58–68`: a hall's four Heroes as pips, by `hallClass` and
    `heroLimitClass`; the building `place.frame ?? place.id`, `:126`);
  - the domain: `rpg/hero-id.ts` (`HERO_HALLS :31`, `hallClass :35`, `heroLimitClass :17`), `rpg/heroes.ts`
    (`heroLimitsOf`, `heroLimitKinds`, `heroLimitPower`), `rpg/kinds.ts` (`rpgAnsweredTwinSets`, the pairs).
- **The packets this builds on** ([tasks/](.), each one's "Names other packets read"; **where their merged code differs
  from a name below, the code wins**):
  - **H129:** the hall type `HeroHall` (`brawler`, `mage`, `spellblade`, `summoner`, `healer` from v19) and its table
    (place ids, the names this packet shows, the seats' home classes); `heroHalls(engine)`, `HERO_HALL_PLACES`,
    `hallOfPlace(placeId)`, `heroLimitsOfHall(hall, engine)` (seat order), `heroLimitHall(id)`, **`heroSeatHome(id,
    engine)`**; `HeroLimit.power` (the Limit Break's own), `.lore` (the design's italic line, "for H133's card"),
    `.hall`; `HeroHit.double`, `HeroCast.volley`, a cast's `target` (`one`, `all`, `random`) and its statuses;
    `heroLimitScale`. **"Kept for the live web until H133: `HERO_HALLS`, `hallClass`, `heroLimitsOf(classId)` and
    `heroLimitClass(id)`; H133 moves the pages and the registry to the hall-based names, and H134 drops the old ones."**
  - **H128:** `rpgAnsweredTwinSets(kinds, engine)` and `rpgTwinSets(engine)` by engine (v19: Katana–Light, Bow–Dark;
    Twilight stays Bow and Katana): "Answers" and "Adds" read them at the live default.
  - **H126:** `rpgRework('classes')`, `rpgClassName(classId, engine)`. H130 (the merge moves Heroes and Bonds into
    `healer-*`); **H132** (the one-time sheet carries Halls v2's merge line, not this packet); **H135** (optional: the
    Sanctum's own building; it removes this packet's frame override when it lands).
- **The manual:** [sections § Learning and § Halls of Heroes](../../game/sections.md#learning) (the places table is
  generated from `learningPlaces`), [heroes](../../game/heroes.md) (H134 rewrites it; this packet doesn't).

## Decisions made

### From the design, exact

**The Learning page from engine v19** (HV21; `learningPlaces`' third generation):

| Place | Id | At | Building |
|---|---|---|---|
| **Warrior Dojo** | `brawler-dojo` (kept; the name changes) | 0.24, 0.10 | its own |
| **Mage Tower** | `mage-tower` | 0.76, 0.11 | its own |
| **Spell Blade Salle** | `spell-blade-salle` | 0.22, 0.33 | its own |
| **Summoner Circle** | `summoner-circle` | 0.78, 0.33 | its own |
| **Healer Sanctum** | `healer-sanctum` (new) | 0.50, 0.56 | `frame: 'knights-bastion'` until H135 |
| Observatory | `observatory` | 0.50, 0.84 | its own |

Physical-led halls on the left, magic-led on the right, the Sanctum in the middle, the Observatory under it. The Paladin
Bastion and the Cleric Chapel leave the page.

**The seat card from v19** (HV25, §9's Web line): `Seat 1 · Brawler` (its home class), the name, the kind marks, **its
shape and power** (`One foe · 1 hit · ×2.9`), the twin sets it answers on the new pairs (`Answers Fire`), its line of
lore (H129's), the Hero's name or `No Hero yet`, then the Learners as today. The Learner picker's `Adds Light, Dark`
reads the new pairs. Heroes, Learners, Bonds and the sheets are unchanged (HV22).

### Build decisions (log them in the D-row)

1. **`learningPlaces(engine)` gains its third generation** behind H126's `classes` stage of `rpgRework` (the stage H129
   and H130 ride, CV31, HV24), in `hub/places.ts`. Each hall's blurb is its lore, then today's tail: "The Warrior Dojo:
   power from self-training. Four Heroes, each with her own Limit Break, and their Learners." (the Mage Tower
   "self-study", the Spell Blade Salle "pacts with familiars", the Summoner Circle "familiars, summoned", the Healer
   Sanctum "a followed deity"). Its details: the home classes (`Home: Brawler`; `Home: Arms Spellblade 1–2, Tome
   Spellblade 3–4`), then today's two lines. v15–v18's lists stay byte for byte.
2. **Old hall links** (`/learning/paladin-bastion`, `/learning/cleric-chapel`) land on `/learning/healer-sanctum` from
   v19, keeping the rest of the path and the navigation state (an alias read in `PlaceRoute` before its fallback), so
   old bookmarks and an Inheritance row read before the switch don't drop to the page.
3. **Every web reader moves to the hall-based names** (H129's hand-off): `registry.tsx` registers the Hall page for
   `heroHalls()`' places (`HERO_HALL_PLACES`); `HubScreen`'s `pipsOf` takes a hall's seats from
   `heroLimitsOfHall(hallOfPlace(place.id))`; the Hall page reads `hallOfPlace` and `heroLimitsOfHall`. If H120 hasn't
   landed, the profile's Inheritance card (`OutfitProfile.tsx`, its hall link) moves too, so H134 can drop
   `HERO_HALLS`, `hallClass`, `heroLimitsOf` and `heroLimitClass` with no reader left.
4. **The Hall page** is one component for both generations: its title is the place's name (`Warrior Dojo`; v18's
   `Brawler Hall of Heroes` stays as today until the switch); the seat card's v19 lines come from
   **`hall-view.ts`'s `seatCard(limit, engine)`**: the home class (`rpgClassName(heroSeatHome(limit.id))`), the shape
   words, the power words, the side effect, and **`limit.lore` in place of `limit.blurb`** (H129's blurb describes the
   shape, which the shape line already says: C5). On v18 `seatCard` returns today's card (no home, no shape line, the
   blurb), so nothing shows before the switch.
5. **The shape words** come from H129's Limit Break data, never from its name:

   | Shape | Words | Example |
   |---|---|---|
   | One foe | `One foe · {n} hit(s)` | One foe · 1 hit (Ten Thousand Swings); One foe · 6 hits (Echo Draw: 3 draws × 2) |
   | Every foe | `Every foe · {n} hits` | Every foe · 3 hits (the Summoner Circle) |
   | Random | `Random · {n} hits` | Random · 8 hits (Shrike Pact) |
   | Volley | `Volley · {a} + {b} a foe` | Volley · 4 + 2 a foe (Hundred-Arrow Rain) |

   A `double` hit counts as two; a volley's `{a}` is its hits on the tapped foe over all its `volley` casts and `{b}` its
   splash hits on each other foe (Hundred-Arrow Rain: two casts of 2 + 1 → `4 + 2 a foe`). Then ` · ×{power}` (the seat's own: `×2.9`, `×2.5`, `×2.2`, `×1.9`, `×2.0`) and, for a healer seat, its stack: `·
   Brave 1`, `· Armor Break 1`, `· Faith 1`, `· Mind Break 1`. The power is the Limit Break's own, not her class's
   scale (a seat has no caster; the profile's Limit sheet shows her scale, H120).
6. **Words** (C3): `Seat {n} · {class}`, the shape words, `×{p}` (shared with H120's Limit power: whichever packet lands
   first adds it to `copy.ts`; the second reuses it), the statuses' names as the fight shows them. H117's wordings on this
   page (#47–#52) stay.
7. **The (i)** on v19, one rule a line: "Five halls, one per family; any Uma sits in any seat." · "A Hero casts her
   seat's Limit Break at full strength." · "Its power is the seat's (×1.9 to ×2.9), × her class's scale (a Paladin's or
   a Cleric's ×0.75), × her deepest skill." · "Up to 10 Learners a Hero, 2 Heroes a Learner, at 50% + 5% a Bond Level." ·
   "A won fight raises each Bond: a stage 2, an elite or a boss 3, 12 a level." · "A Bond stays when she leaves."
   Check each number against H129's rules before writing it.
8. **The merge line belongs to H132** (the one-time sheet, its only owner); this packet shows the merged hall as it
   stands, nothing about how it formed.
9. **No green but Ready:** the seat card adds no colour; the power is ink, the home class faint.
10. **Bundle:** `learningPlaces` and `PlaceRoute` are in the main bundle (a handful of strings and one alias map); the
    Hall page and `hall-view.ts` are lazy. Expected main JS change: under +0.2 KB; say the number.
11. **Your ports:** API 8094, web 5187 (H120 8092/5185, H132 8093/5186, H123 8095/5188, H121–H124 8091/5184).

## Do

1. **`learningPlaces`' v19 generation** (decision 1) and its tests in `hub/places.test.ts`.
2. **The alias** for the old hall ids (decision 2), **the registry and the pips** (decision 3).
3. **`hall-view.ts`'s `seatCard`** (decisions 4, 5) and the Hall page's v19 title, seat card and (i) (decision 7); the
   words in `copy.ts` (decision 6).
4. **Tests:**
   - `packages/domain/src/hub/places.test.ts`: `learningPlaces(19)` lists the five halls and the Observatory in the
     table's order with their ids, names, positions and the Sanctum's frame; no `paladin-bastion` or `cleric-chapel`;
     `learningPlaces(18)` unchanged (the six, byte for byte).
   - `places/halls/hall-view.v19.test.ts` (the switch mocked to 19 with `capsAt`, as H70's `tree-view.test.tsx` mocks
     it from the web): `seatCard` for `brawler-2` (`Seat 2 · Brawler`, `One foe · 1 hit · ×2.9`), `brawler-3` (`One foe
     · 6 hits · ×2.2`), `mage-4` (`Volley · 4 + 2 a foe · ×2.2`), `spellblade-3` (`Seat 3 · Tome Spellblade`, `Random ·
     8 hits · ×1.9`), `summoner-1` (`Seat 1 · Arms Summoner`, `Every foe · 3 hits · ×2.2`), `healer-1` (`Seat 1 ·
     Paladin`, `One foe · 4 hits · ×2.0 · Brave 1`), `healer-4` (`Seat 4 · Cleric`, `… · Mind Break 1`); `seatTwinSets`
     on the new pairs (Echo Draw's Katana answers Light and Twilight; Hundred-Arrow Rain's Bow answers Dark and Twilight);
     `learnerAdds` for a Brawler's defaults under Wisp Pact (Light, Twilight).
   - `places/halls/hall-view.test.ts` (live): today's cases unchanged; `seatCard` on v18 adds nothing.
   - A route test (`MemoryRouter`, mocked to 19): `/learning/healer-sanctum` shows `Healer Sanctum` and four seats;
     `/learning/paladin-bastion` lands on `/learning/healer-sanctum`; unmocked, `/learning/paladin-bastion` shows the
     Paladin Bastion as today.
   - H117's copy test still passes (add `HallPage.tsx` to its JSX list if H117 hasn't).
5. **Check it locally** in a desktop browser at 390×844 and 375×667, light and dark, never the iOS Simulator, on your
   own ports (API `AUTH_MODE=disabled PORT=8094 LOCAL_SAVE_FILE=.data/scratch-h133.json`, web on 5187 with
   `API_PROXY_TARGET=http://localhost:8094`), on a scratch save with Heroes and Learners in several halls, two Paladin
   Bastion Heroes among them: today's six halls live. Then **flip the switch locally** (H134's three lines, H126
   decision 6: `caps.ts` 19, `version.ts` 32, `migrateWorld` chaining `toV32`), restart, let the save migrate: the Learning page's five buildings (with `?canvas`
   to see the map; the preview pane can't screenshot WebGL), each Hall page, a seat card per shape, the Healer Sanctum's
   merged seats, an old Paladin Bastion link. Seat cards don't clip at 375 (the shape line wraps under the name, never
   truncates). **Revert the flip before you commit.**
6. **Docs:** sections.md § Learning (`pnpm docs:update` regenerates the places table; the v19 halls appear under a "From
   the switch (H134)" line if the generator lists one generation) and § Halls of Heroes (the seat card's v19 lines, the
   title, the alias); `pnpm docs:update`.
7. **Log the D-row** (fetch `main` first): "H133: Halls v2's Learning page and Hall page", decisions 1–11.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB) and this packet's change
  (under +0.2 KB expected).
- [ ] The tests in step 4 pass, the v19 ones with the switch mocked; the copy test passes.
- [ ] On the live engine the Learning page and every Hall page are as before (the live tests and the local check say
  so).
- [ ] `pnpm docs:update` leaves no diff; the manual describes both generations.
- [ ] The local check in step 5 was done at both sizes, light and dark, on a scratch save, on both generations, and
  described; the flip is reverted. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and
  https://uma-rpg.web.app/api/health shows the merge commit.

## Deliver

- **ChatGPT:** a branch `feat/h133-halls-v2-pages` in a worktree outside `~/workspace` (AGENTS.md), and a pull request,
  "feat(web): Halls v2's Learning page and Hall page, inert until the switch (H133)", the body saying why (D241 HV1,
  HV21, HV25). Fetch `main` before you push so the D-number is free. Merge it yourself when the checks and CI are green,
  and watch the deploy (rerun the web job on Vitest's `Timeout calling "onTaskUpdate"`).
- **Flag it done:** delete this file, add a Done row in [README.md](../README.md) with the merge commit, and note on
  H135's row that the Sanctum's `frame: 'knights-bastion'` is in `learningPlaces` for it to remove.

## Notes from the main session (2026-10-29)

- **The Sanctum's art (owner, 2026-10-29):** if H135's uma-art release is out, pin it in `apps/web/package.json` and draw the Sanctum's own `healer-sanctum` frame instead of `knights-bastion`; if not, keep the borrowed frame and a later packet pins it.
