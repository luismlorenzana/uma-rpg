# H39 — Doc: Tier 2's advanced classes

**uma-rpg · Claude · M · Needs: nothing · Unblocks: Tier 2 content (built after the doc is approved)**

## Why

- The owner approved [tiers](../../design/tiers.md) Option A (D159, T6): depth grows by tier, and every tier keeps the
  same battle system. In Tier 2 the classes promote Fire Emblem–style. Each of the six base classes (Brawler, Mage, Spell
  Blade, Summoner, Paladin, Cleric) branches into two advanced classes, chosen at promotion. That makes twelve, each with
  one passive. T8 gave illustrative pairs and asked for a short design of each once T6 was approved. This doc is that
  design.
- The same Option A table puts three more pieces in this doc:
  - Tier 2 opens the side forks (A/B) with side points;
  - **Hero LB+ at Bond 10:** "the Limit Break gains its seat's extra effect";
  - the class pick during Ascend ([tiers](../../design/tiers.md) §5, [the Rift](../../design/rift.md) §4).
- **The limit on all of it is the Persona lesson.** uma-racer's weakness → All-Out loops (D261) were boring and were
  removed a day later (D265). Octopath shields and Breaks have held up since. A passive adds to the toolbox. It never adds
  a loop.

## Context (read first)

- `CLAUDE.md` and `AGENTS.md`.
- **The approved designs this doc extends.** Copy their style: a status block, what the owner asked, today, proposal
  sections with tables, numbered owner calls each with a recommendation, and a final owner-calls table.
  - `docs/design/tiers.md`: all of it, especially §5 (what promotion resets), §6 (the Option A table, T7, T8) and §8.
  - `docs/design/classes-v2.md`: all of it. It covers the six classes and their mirrors, §3.3 (one healer a party, with
    doubled shares), §5 (six halls and 24 Limit Breaks), §8 (engine v14, save v24) and §9 (the targets).
  - `docs/design/rift.md`: §4 (Ascend), §5 (the four fronts and their party shapes), §8 (Echoes) and §11.
  - D159–D161 at the end of `docs/decisions.md`. Also read D15, D86, D102, D106 and D112.
- **The manual as built.** Engine v13 with five classes. Classes v2 is approved but not built.
  - `docs/game/classes.md`: hands, leans, slots, depths, side rules and ranks.
  - `docs/game/skill-trees.md`: every node. It's generated from `catalog.ts`.
  - `docs/game/heroes.md`: halls, Bonds and Learners.
  - `docs/game/combat.md`: shields, Breaks, Steel, statuses, support, charged moves and Auto.
  - `docs/game/loops.md` § Ranks.
- **Code** (`packages/domain/src/`):
  - `rpg/kinds.ts`: `RPG_CLASSES` and `RpgTreeId`.
  - `rpg/node-identity.ts`: the node id grammar, and side skills gated at Class Rank `10d − 5`.
  - `rpg/rules.ts`: `RPG_CLASS_SLOTS`, `RPG_CLASS_STATS`, `rpgHand`, `rpgDefaultClass`, the depth gates, side points
    and `rpgActiveSlots`. It also has the unused `legacy` refs and `RPG_MAX_LEGACY_SLOTS`, left from H23's unbuilt
    legacy skills.
  - `rpg/catalog.ts`: trees built by rule, and the summon names in `SUMMONS`.
  - `rpg/heroes.ts`: `HERO_LIMIT_POWER`, `LIMITS` and `heroLimitSkills`.
  - `rpg/hero-id.ts`: the Bond numbers and `HERO_HALLS`.
  - `rpg/battle/limit.ts` (`heroPlan`) and `battle/skills.ts`. In `battleSkillFor`, skill MP is multiplied by
    `ref.tier`, so a Tier 2 skill costs twice the MP.
  - `rpg/battle/engine.ts`: `strike`, `chip`, `cast`, `resolveHalf` and `linger`.
  - `rpg/battle/auto.ts`: Auto. The simulation plays Auto, and Auto guards only as a fallback.
  - `rpg/battle/types.ts`: `BattleAlly` and `BattleInherit`.
  - `save/save.ts` (`OwnedUma.classes`, `ranks`, `bonds`), `save/battle.ts` (`umaProfile`, `startFight`) and
    `economy/ranks.ts`.
  - `rpg/campaign/enemies.ts`: `rpgFoeBudget`. It runs on lifetime level, so Tier 2 foes assume a full Tier 1 Lv 50
    build. A promoted Uma arrives with Training gear and an empty map (D159 §5). Don't solve that here. State what your
    targets assume, and flag it.
  - `world/balance-party.ts` and `world/balance.test.ts`: the balance simulation (`SIM=1`).
  - Web: `apps/web/src/places/stable/SkillsPage.tsx`, `OutfitProfile.tsx`, `battle/pixel-icons.tsx` (`ClassEmblem`)
    and `places/halls/HallPage.tsx`.
- **History:**
  - `docs/design/class-rework.md` §1–3, and §11 (one budget per class, written down);
  - `docs/design/combat-balance.md` §0 and §3–5;
  - uma-racer's D261 and D265, read with `git -C ../uma-racer show origin/main:docs/decisions.md`. The local checkout
    may sit on an old branch.
- **H40's doc** is `docs/design/weapon-arts.md`. If it exists when you start, read it, and keep the engine version, the
  chip cap and the stacking rules the same as its. If it doesn't exist yet, say in one line what you assume.

## The doc to write

`docs/design/tier2-classes.md`, titled **"Tier 2's advanced classes"**.
- **Style:** the house style above. Plain short sentences.
- **Owner calls:** marked **A1**, **A2** and so on inline, each with a recommendation. The owner prefers no open
  questions, so every call needs one.
- **Numbers:** every number is a draft for the simulation.

**Already decided. State these; don't reopen them:**
- **Classes:** in a Tier 2 world the classes are the twelve advanced classes. The base classes belong to Tier 1
  (tiers.md §6).
- **Trees:** an advanced class uses its base class's trees, with the same node ids, learned as Tier 2 refs. There are no
  new trees. The A/B sides are Tier 2's new skills (tiers.md §6, "What it costs").
- **Halls:** the six halls of classes v2 stay, with 24 seats. Heroes and Learners work as they do now.
- **Promotion:** nothing carries from Tier 1 beyond D159 §5: every class starts at Class Rank 1, and no skill carries.
- **Battle rules:** these stay. A weak hit chips one shield point. Breaks and Steel stay, and so do one act per Uma,
  intents, and charged moves with locks.

**Sections, in order:**
1. **What the owner asked for.** The lines from tiers.md §1 and §6, T8's table, and the Persona lesson in two lines.
2. **Today.**
   - The six classes as classes v2 approves them: slots, armor, hand, damage split, leans, Limit Break power and
     starting rule.
   - The tree rules: depths and their gates, side costs and side points.
   - T7's cores-only Tier 1, and the halls.
   - Say what's built (v13, five classes) and what's approved but not built (v14).
3. **Rules every advanced class keeps.** A short list. A passive may change numbers, targets, hit counts or statuses.
   It never:
   - grants an extra act or a "one more";
   - refunds the Limit gauge;
   - lengthens a Break or skips Steel;
   - removes more than one extra shield point an act;
   - adds a damage kind (weakness coverage stays a party puzzle, D160 §6.2);
   - gives a Summoner-line class party support (D160).

   Auto must play every passive: say how `auto.ts` scores it. On screen, a passive is one short sentence (D95).
4. **Promotion: base to advanced.**
   - The table mapping six base classes to twelve advanced ones.
   - **The Ascend pick (A6):** she's offered the two advanced classes of the class she fights as. One is preselected by
     a stat rule per pair, like D160's Paladin-or-Cleric start, so twenty Umas ascend with one confirm and optional
     changes.
   - **Switching in Tier 2 (A1).**
   - **What she arrives with:** Class Rank 1, the class's default weapon spread in Training weapons, its armor kind
     (classes v2 §7) and the auto loadout.
   - **Room for Tier 3:** each advanced class later grows into one master class (tiers.md §6). Leave room for it, but
     design nothing.
5. **The twelve classes.** One subsection per base class. For each advanced class, give:
   - name and lean;
   - its passive, in one sentence, with its numbers;
   - stat leans, and its hand if it changes;
   - Limit Break power;
   - the Rift front it serves best;
   - Auto's rule for it.

   End with a summary table. Start from T8's pairs, and settle each of these tensions in a line:
   - **Warlord ("Break specialist") vs the Spell Blade line,** which D160 made the physical shield breaker. Give them
     different jobs: for example, the Warlord pays off after a Break, and the Duelist chips.
   - **Berserker (Axe areas) and Conjurer (area summons) vs the Summoner's area identity.** The Horde party (2 Spell
     Blade, 2 Summoner, a healer) must stay the best Horde party.
   - **Rune Knight ("a larger magic share") vs the owner's 70/30 split** (D160). Recommend keeping 70/30, and put her
     identity in her Tome half instead.
   - **Warlock ("Dark and Light curses") vs "the Summoner has no support"** (D160). A curse that makes foes take more
     damage is fine. Nothing may mend, shield or buff Umas.
   - **Guardian (a guard that takes damage).** Today Auto guards only as a fallback, so give Auto a guard rule, or
     choose another mechanic.
   - **Names:** check all twelve against the skill and summon names in `catalog.ts`. "Berserker" is a Summoner Axe
     summon and "Jotun Warlord" is another. Rename one side of each clash.
6. **Skill trees in Tier 2.**
   - The side forks open (A3): their gates, costs and points.
   - The equipped slots from tiers.md §6: 3, then +1 every 5 levels, up to 10.
   - Skill MP × tier: keep it or drop it, by the MP target below.
7. **Limit Breaks.**
   - **Hero LB+ at Bond 10 (A7):** who gets it.
   - **All 24 seats' extra effects, in one table.** Use the six halls of classes v2 §5, not today's 20. Each seat gets
     one effect, worth +15–25% of its Limit Break.
   - **Limit Break power per advanced class (A8).**
   - LB+ exists only in Tier 2 and later worlds.
8. **The build.**
   - **Code:** one class table carrying `base` and `tier`, plus `rpgBaseClass`. The per-class tables (hand, leans,
     slots, Limit Break power) get the advanced classes. Node ids don't change.
   - **Engine v15,** the first after v14. Say what freezes into `BattleAlly`: the passive, and a Hero's own Bond for
     LB+.
   - **Save:** the first version after v24. Class ids are per world, and validation goes by tier.
   - **Screens:** the class picker, the Ascend sheet, the profile, and the halls' LB+ line.
   - **Art:** twelve class emblems, as a uma-art request through uma-platform. The base class's emblem stands in until
     then. Anything uma-kit draws goes through `docs/change-protocol.md`.
   - **Docs:** the manual pages to update when it's built.
   - **Legacy refs:** retire `legacy` (A9).
9. **Content size.** A table covering:
   - twelve class entries and twelve passives;
   - 24 LB+ effects;
   - the side nodes reused (count them, after classes v2);
   - new skills: zero, or list any that a passive needs;
   - the emblems;
   - the engine and save work, and the screens.

   Size each piece S, M or L, as rift.md §10 does.
10. **Balance targets** for the simulation (`SIM=1`): the table below.
11. **Owner calls:** the final table.

**Owner calls to raise.** Each one carries this recommendation. If you argue for another, give the reason in the doc.

| Call | Question | Recommendation |
|---|---|---|
| **A1** | Switching classes in Tier 2 | Free among all twelve, each with its own Class Rank, weapons and sides, as in Tier 1. Alternatives: only the two of her Ascend base, or locked to her pick |
| **A2** | What an advanced class changes besides its passive | Stat leans within ±0.1 of its base's. Slots, armor kind and the hand split stay, because D160's mirrors and the Rift's four party shapes depend on them |
| **A3** | Side forks in Tier 2 | Today's rules for every class: sides open at Class Rank 5, 15 … 45, a side costs its depth, a point comes with each rank, swaps are free. No per-class side lists |
| **A4** | The twelve names | T8's names, with each clash renamed |
| **A5** | The twelve passives | The doc's set, approved as one call |
| **A6** | The Ascend pick | The two advanced classes of the class she fights as, one preselected by a stat rule; one confirm for all twenty |
| **A7** | Who gets Hero LB+ | Anyone at Bond 10 with the seat: the Hero with her own seat, or a Learner with her Hero. Tier 2 and later only |
| **A8** | Limit Break power of an advanced class | Its base class's (D160) |
| **A9** | Tier 1 skills in Tier 2 | None carry (D159). Retire the unused `legacy` refs when building |

**Numbers to draft for the simulation:**
- for each advanced class: its leans (HP, ATK, M.ATK, DEF, M.DEF, MP), its hand (power, MP, split) and its Limit Break
  power;
- each passive's numbers;
- the side gates, costs and points, or "unchanged";
- each LB+ effect's numbers;
- the Ascend preselect rule for each pair;
- the skill MP tier factor.

**Balance targets (drafts):**

| Target | Value |
|---|---|
| A passive, where it applies | Worth +8–15% of her class's value there: damage per turn, chips per act, or sustain per fight |
| A passive, elsewhere | No more than +5% |
| The class budget | Each advanced class's damage budget is written down, as class-rework §11 does for the base classes |
| The two of a pair | Each is the better pick of its pair on at least one of the four fronts, on Auto |
| Mirrors (classes v2 §9) | Spell Blade line vs Summoner line damage per turn within ±5%, at 70/30 ± 5. Paladin line vs Cleric line sustain within ±10% |
| One healer (classes v2 C8) | Each healer-line class keeps an on-curve party through a front boss, with no Uma falling twice |
| LB+ | Worth +15–25% of its Limit Break, and never refunds the gauge |
| Tier 2 MP | On a full MP bar, an on-curve Tier 2 Lv 50 Uma casts within one skill of a Tier 1 Lv 50 Uma |
| Tier 2 campaign | On-curve win rates within 3 points of Tier 1's table (combat balance §0) at matched levels. The toolbox's power is priced into Tier 2's build budget |

**Out of scope:**
- weapon arts and armor set bonuses (H40's doc);
- the Extra Stats outer ring, and the second profession vertical (their own docs);
- Tier 3's master classes;
- Tier 2's continents, foes and Rift fronts;
- the tier foundation, and the rest of Ascend (tiers.md §4–5, rift.md);
- any code, art or manual change.

## Done when

- [ ] `docs/design/tier2-classes.md` exists in the house style. It has every section above, calls A1–A9 each with a
      recommendation, and the owner-calls table.
- [ ] `docs/design/tiers.md` §6 links to it, for example under T8: "Designed in
      [Tier 2's advanced classes](tier2-classes.md)".
- [ ] `docs/open-questions.md` has a new row, with the next free Q number, that lists A1–A9 and links the doc. Fetch
      `main` first so the number doesn't collide.
- [ ] No code changed, and `pnpm lint && pnpm test` still pass.

## Deliver

- Commit to `main`: `docs(design): tier 2's advanced classes (H39)`. Docs-only pushes run no deploy.
- Flag it done in the same commit: delete this packet, and add a Done row to `docs/handoff/README.md`.
- The owner then decides the calls. A later session logs the D-decision and folds the answers into the doc.
