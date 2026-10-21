# H40 — Doc: weapon arts and armor sets

**uma-rpg · Claude · M · Needs: nothing · Unblocks: Tier 2 content (built after the doc is approved)**

## Why

- The owner approved [tiers](../../design/tiers.md) Option A (D159, T6): weapons are streamlined first and gain trees
  later.
  - **Tier 1:** a weapon is its tree and its Might, nothing else.
  - **Tier 2, weapon arts:** each weapon kind gets "a small three-node tree, opened by Weapon Rank, that changes its
    shape (one more hit, a wider area share, Break +1 shield)".
  - **Tier 2, armor:** set bonuses for a full physical or a full magical suit.
  - **Tier 3:** awakening.

  tiers.md §8, item 5, asks for these as their own doc. This is that doc.
- **The same table adds two links:**
  - the second profession vertical (Q7) "feeds the weapon arts and set bonuses";
  - Tier 2's Rift has "harder fronts that test weapon arts".
- **The limit on all of it is the Persona lesson.** uma-racer's weakness → All-Out loops (D261) were removed a day later
  (D265). An art changes a weapon's shape inside the Octopath rules of shields and Breaks. It never adds an act or a
  loop.

## Context (read first)

- `CLAUDE.md` and `AGENTS.md`.
- **The approved designs this doc extends.** Copy their style: a status block, what the owner asked, today, proposal
  sections with tables, numbered owner calls each with a recommendation, and a final owner-calls table.
  - `docs/design/tiers.md`: §1, §5 (ranks reset at promotion) and §6. In the Option A table, read the Weapons, Armor,
    Accessories, Extra Stats, Professions and Rift rows.
  - `docs/design/classes-v2.md`:
    - §3.1, the Spell Blade's Arms half lands as two hits;
    - §3.2, the Summoner's lingering Tome summon, whose farewell strike reaches every foe;
    - §3.3, the healers' single-target blows;
    - §6, typed accessory slots and flat Orbs;
    - §7, starting armor by class;
    - §8, engine v14, and §9, the targets.
  - `docs/design/rift.md` §5, the fronts:
    - weaknesses, and the ward on Iron and Arcane;
    - the Duel's boss with shield 10–12, who acts twice or three times;
    - the Horde's waves of 4–6 foes with shields 3–4.

    Also read §11, the targets.
  - D159–D161 at the end of `docs/decisions.md`. Also read D98, D102, D104, D119, D124, D141 and D142.
- **The manual as built.** Engine v13. Classes v2 is approved but not built.
  - `docs/game/classes.md`: weapons, shapes, slots and ranks.
  - `docs/game/skill-trees.md`: each class's hits and shapes per weapon.
  - `docs/game/combat.md`: the damage steps, the 0.55 area share and the 1.05 random bonus, weak hits, shields, Breaks,
    Steel, Breaker and Shatter, charged moves and locks.
  - `docs/game/materials.md` § Gear: Might, armor, accessories and recipes.
  - `docs/game/loops.md` § Ranks (Weapon Rank 1–10, shared by every class) and § Extra Stats and gear.
- **Code** (`packages/domain/src/`):
  - `rpg/kinds.ts`: the ten weapons and kinds, and `RPG_KIND_PAIRS`.
  - `rpg/catalog.ts`: `RPG_AOE_SHARE`, `RPG_RANDOM_BONUS`, `pure`, `BLADE_HITS`, `summon` and each class's tree rules.
    The area share is baked into skill powers here.
  - `rpg/rules.ts`: `rpgHand`.
  - `rpg/battle/engine.ts`: `battleDamage` (where Might adds to offense), `strike`, `chip`, `cast`, `resolveHalf`,
    `linger` and `popLocks`.
  - `rpg/battle/skills.ts`, `battle/auto.ts` (`score`) and `battle/types.ts` (`BattleAlly.might`, `orbs`).
  - `economy/gear.ts`: `MIGHT_BY_GRADE`, `armorOffense`, `equippedMight`, `equippedPoints` and `CHARM_PER_GRADE`.
  - `economy/ranks.ts`: `GEAR_MAX_RANK`, `gearExpToNext`, `weaponExpShares`, `ARMOR_SLOTS` and `isMagicalArmor`.
  - `economy/gear-id.ts`.
  - `save/save.ts` (`UmaGear`, `ranks`) and `save/battle.ts` (`holdWeapon`, `startFight`).
  - `rpg/campaign/enemies.ts`: `rpgFoeBudget`. It runs on lifetime level, so Tier 2 foes assume a full Tier 1 Lv 50
    build. A promoted Uma arrives with Training gear (D159 §5). Don't solve that here. State what your targets assume,
    and flag it.
  - `world/balance-party.ts` and `world/balance.test.ts`: the balance simulation (`SIM=1`).
  - Web: `apps/web/src/places/stable/WeaponSheet.tsx`, `GearCard.tsx` and `OutfitProfile.tsx`.
- **History:**
  - `docs/design/class-rework.md` §1–3 and §11;
  - `docs/design/combat-balance.md` §0 and §3–5;
  - uma-racer's D261 and D265, read with `git -C ../uma-racer show origin/main:docs/decisions.md`.
- **H39's doc** is `docs/design/tier2-classes.md`. If it exists when you start, read it, and use the same engine version
  and chip cap. If it doesn't exist yet, assume both land in engine v15, and say so.

## The doc to write

`docs/design/weapon-arts.md`, titled **"Weapon arts and armor sets"**.
- **Style:** the house style above. Plain short sentences.
- **Owner calls:** marked **E1**, **E2** and so on inline, each with a recommendation.
- **Numbers:** every number is a draft for the simulation.

**Already decided. State these; don't reopen them:**
- **Where:** arts and set bonuses exist in Tier 2 and later worlds only. Tier 1 weapons stay a tree and its Might
  (D159).
- **Per weapon, not per class:** Weapon Rank is already shared by every class, so an art works in every class that
  wields its weapon.
- **What an art changes:** shape only, meaning hits, targets, area share, shield chips and splash. It never adds:
  - a % damage bonus (that's the outer ring's job);
  - flat offense (that's Might and the Orbs);
  - a damage kind (weakness coverage stays a party puzzle, D160 §6.2);
  - an act.
- **Ranks:** Weapon Ranks stay 1–10 and reset at promotion (D159 §5).
- **Tier 3's awakening:** named only, as later.

**Sections, in order:**
1. **What the owner asked for.**
2. **Today.**
   - The ten weapons and their shapes by class, in a table.
   - Might by grade.
   - Weapon Rank and its curve. Used every fight, rank 4 comes at about Lv 16 and rank 8 at about Lv 36. Echoes pay
     double.
   - Armor: five slots, each physical or magical, and what each piece gives.
   - Accessories after classes v2.
   - The outer ring as approved.
   - What's built (v13) and what's approved but not built (v14).
3. **One job per lever.** A table of Tier 2's levers, so no two do the same thing:
   - Might: flat offense, by grade;
   - Orbs: flat offense to one kind;
   - the outer ring: % damage by kind;
   - arts: shape;
   - set bonuses: sustain (E8);
   - advanced class passives (H39).
4. **The art tree.** It covers:
   - its shape (E1), its gates (E2), and choosing and swapping (E3);
   - what a node costs (E4);
   - what an art touches (E5), and the chip cap (E6).

   The grammar: a free core that sharpens the weapon's own shape, and a fork, with A for damage and B for Breaks.
5. **The thirty nodes (E7).** One table per weapon, with its core, A and B. For each node, give:
   - its effect, in one line;
   - its numbers: hits, the change in total power, area share, chips and splash;
   - its MP change (recommend none).

   Start from tiers.md's three examples. Every weapon needs at least one node that matters for each class that wields
   it. An every-foe art does nothing for single-target skills, so check against:
   - the Spell Blade's single-target halves, which D160 keeps;
   - the Summoner's pairs;
   - the Paladin's and Cleric's single-target blows.
6. **Interactions.** Settle each of these:
   - **The Spell Blade's double Arms hit** (D160 §3.1). An art's extra hit stacks once and is never doubled. Give her
     chips per act with each Arms art.
   - **The Summoner's farewell strike.** Recommend that arts touch only the arrival, so classes v2's target of Summoner
     against the Mage's Blizzard still holds.
   - **The healers' blows.**
   - **Flat Orbs.** An extra hit is a hit of its kind, so no special rule is needed.
   - **Might.**
   - **Limit Breaks:** no arts.
   - **Breaker and Shatter, and Steel.**
   - **Charged-move locks.** An extra hit of a lock's kind breaks a lock, as any hit does.
   - **H39's passives.**
7. **Armor set bonuses (E8, E9).**
   - A full suit is five crafted pieces of one half. Training pieces don't count.
   - Steps go by the suit's lowest grade.
   - Give the two effects and their numbers, and where they show (the Gear tab).
   - A mixed suit gets no bonus.
8. **The Rift.** A table of each front against the arts that serve it:
   - Iron: Break forks on Arms;
   - Arcane: forks on Tomes;
   - Duel: single-target Break and burst;
   - Horde: area cores.

   Tier 1's Rift has no arts. List what Tier 2's Rift should test, as requirements only: its fronts get their own doc.
9. **Tier 3.** Awakening, named in one paragraph, with nothing designed.
10. **The build.**
    - **Engine v15.** Say what freezes into `BattleAlly`: the active arts and the set step. Say where each applies:
      - hit count and area share in `battleSkillFor` or `cast`;
      - chips in `strike` and `chip`, counted per act across a Spell Blade's or a Summoner's pair.

      The area share is baked into catalog powers through `RPG_AOE_SHARE`. So a wider share scales those hits by
      (new share ÷ 0.55).
    - **Auto:** how `auto.ts` scores an art.
    - **Save:** the first version after v24 and after H39's, per Uma per world. It stores the learned nodes and the fork
      side picked for each weapon.
    - **The second vertical's hook.** A demand table: the items each node and each set step take, per Uma and for a
      twenty-Uma run. The second vertical's own doc sizes its output against it.
    - **Screens:** `WeaponSheet.tsx` gains an Art row, and the Gear tab shows the set step. Anything uma-kit draws goes
      through `docs/change-protocol.md`.
    - **Art:** none needed. Text and the existing weapon icons do.
    - **Docs:** the manual pages to update when it's built.
11. **Content size.** A table:
    - thirty nodes and two set bonuses;
    - the engine, save and Auto work;
    - two screens;
    - the demand table.

    Size each piece S, M or L, as rift.md §10 does.
12. **Balance targets** for the simulation (`SIM=1`): the table below.
13. **Owner calls:** the final table.

**Owner calls to raise.** Each one carries this recommendation. If you argue for another, give the reason in the doc.

| Call | Question | Recommendation |
|---|---|---|
| **E1** | The art tree's shape | A free core and an A/B fork, like one depth of a skill tree. Alternatives: a chain of three that all stack, or three nodes with one active |
| **E2** | Gates | The core at Weapon Rank 4; the fork at Weapon Rank 8 |
| **E3** | Choosing and swapping | Per weapon, shared by every class. The fork side swaps freely outside a fight, as side skills do |
| **E4** | What learning a node costs | Weapon Rank opens it. Each node is learned once per Uma, for second-vertical items (placeholder grades), so the second vertical feeds the arts as tiers.md says. Swapping is free |
| **E5** | What an art touches | Attacks and skills made with that weapon, in any class, and a summon's arrival. Not farewell strikes, Limit Breaks or Orbs |
| **E6** | The cap on Break arts | Arts remove at most one extra shield point per Uma per act. Steel is unchanged |
| **E7** | The thirty nodes | The doc's set, approved as one call |
| **E8** | Set bonuses | One per half, in three steps by the suit's lowest grade (4, 7, 10). Sustain, not damage. Start from: a physical suit gives max HP +4/7/10%, a magical suit cuts skill MP by 5/10/15% |
| **E9** | What a set step costs | Each step is activated once per Uma, for one second-vertical item |

**Numbers to draft for the simulation:**
- the gates;
- each node's numbers, for all thirty;
- the chip cap;
- the set steps and their values;
- the items per node and per step (placeholders);
- Auto's scoring weights for arts.

**Balance targets (drafts):**

| Target | Value |
|---|---|
| A core, in its weapon's own shape | +5–10% of that weapon's value: damage per act, or chips per act |
| Fork sides | Each side of every fork is the better pick on at least one Rift front, on Auto |
| Duel boss (shield 10–12) | An on-curve Tier 2 party with every Break art still needs at least two rounds to Break her. No single Uma Breaks her in one act |
| Horde wave (4–6 foes, shields 3–4) | No single on-curve Uma Breaks every foe of a wave in one act |
| Classes v2's targets, with arts on | Spell Blade 70/30 ± 5. Spell Blade vs Summoner damage per turn within ±5%. Summoner ≥ the Mage's Blizzard against three or more foes |
| Set bonuses | Each worth 60–100% of a G10 support accessory's effect on a front's win rate, on Auto |
| Tier 2 campaign | On-curve win rates within 3 points of Tier 1's at matched levels. Arts and set bonuses are priced into Tier 2's build budget, alongside H39 and the outer ring |

**Out of scope:**
- advanced classes and their passives (H39's doc);
- the outer ring;
- the second vertical's families, recipes and facilities (only the demand table goes here);
- the design of Tier 3's awakening;
- accessories (classes v2 settled them; a third slot is Tier 3's);
- Tier 2's Rift fronts;
- any code, art or manual change.

## Done when

- [ ] `docs/design/weapon-arts.md` exists in the house style. It has every section above, calls E1–E9 each with a
      recommendation, and the owner-calls table.
- [ ] `docs/design/tiers.md` §6 links to it, for example after the Option A table: "Weapon arts and set bonuses are
      designed in [weapon arts](weapon-arts.md)".
- [ ] `docs/open-questions.md` has a new row, with the next free Q number, that lists E1–E9 and links the doc. Fetch
      `main` first so the number doesn't collide.
- [ ] No code changed, and `pnpm lint && pnpm test` still pass.

## Deliver

- Commit to `main`: `docs(design): weapon arts and armor sets (H40)`. Docs-only pushes run no deploy.
- Flag it done in the same commit: delete this packet, and add a Done row to `docs/handoff/README.md`.
- The owner then decides the calls. A later session logs the D-decision and folds the answers into the doc.
