# H68 — Engine v16 rules: the base MP regen, and the Flourish as her calling (dark)

**uma-rpg · Claude · M · Needs: H64, H67 · Unblocks: H71 (with H65, H66), H70**

## Why

Two engine rules land with R1's fight:
- **The base MP regen (SB18, D196).** Without the MP accessories a party runs dry late in a region. From v16 **every Uma
  regains 0.8% of her max MP at the end of each round for each skill depth her class has open** (4% from Class Rank 40),
  a rule in every fight, never an item. R1 still has today's supports, so a Spring Amulet stacks with it until R2 retires
  them (H64's build decision 3).
- **The Flourish (UT6, D197).** Her template's root node, reshaped from MP to **HP**: 4% of her max HP a fight, in her
  stride's shape (**Clean break**, a Barrier at the start; **Even pace**, 1% a round; **Late reserve**, 2% a round from
  round 3), only while she fights as her calling's class.

Both are engine v16 rules behind the fight's version, so v6–v15 fights and the deployed game don't move until H72.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`. [stat-balance.md](../../design/tier-rework/stat-balance.md) §7.2 and SB18 (the rule, its table,
  "Where it lives"); [uma-templates.md](../../design/tier-rework/uma-templates.md) §3.3 (UT6: the re-check and the three
  shapes, "Not a heal skill"), §3.8 (UT12), §10 (UT18); [class-progression.md](../../design/tier-rework/class-progression.md)
  §6.6 ("MP back a round"). The [README](../../design/tier-rework/README.md) §9.1 still names "the Flourish's three MP
  twists": uma-templates wins (UT6, HP).
- H64's D-rows (decision 3: the stack with the Spring); H67's `roster/template.ts` (`umaTemplate`, `umaFlourishActive`,
  `RpgFlourish` in `rpg/battle/types.ts`); H64's `caps-at.fixture.ts`.
- **The code** (lines on `421eacd`):
  - `rpg/battle/caps.ts` 1–34: constants the profile reads without the engine (`BATTLE_HEAL_SCALE`, `BATTLE_REGEN_ROUNDS`).
  - `rpg/rules.ts` 285–291 `rpgDepthBlock`, `rpgOpenDepth` (depths open at Class Rank 1, 10, 20, 30, 40).
  - `rpg/battle/types.ts` 16–69 `BattleAlly` (`mpRegen` 49–50, the Spring's; `regen` 42–43, armor's), 128–159 `BattleUnit`
    (`cover` 150: a skill Barrier, any damage, lapsing at its round's end).
  - `rpg/battle/engine.ts`: 117–135 `validAlly`; 283–297 `createBattle` (the units at 286–291, the opening cues at 296);
    402–413 `heal`, `cover`; 610–618 `harm` (a cover absorbs first); 646–667 `nextWave` (the breather; units kept); 747–788
    the round's end (769 statuses decay, 770–773 armor's Regen, 774–776 the Spring's `mpRegen` and its `mp` cue, 781 every
    cover lapses, 782 Regen).
  - `rpg/battle/skills.ts` 53–57 `battleClassRank` (her Class Rank in any version).
  - `save/battle.ts` 222–235 `partyMembers` (outfits in hand); `rpg/campaign/run.ts` 33–39 `RpgPartyMember`, 60–80
    `rpgPartyAllies` (what enters the input), 82–99 `rpgBeginRunBattle`; `save/rift.ts` 207–228 `startRiftFight` (the Rift
    builds its allies the same way).
  - `economy/gear.ts` 88–97: the Spring is 1 MP a round a grade (10 at G10).

## Decisions made

**The approved calls:**
- **SB18:** at the end of each round every Uma standing regains **0.8% of her max MP × the skill depths her class has open**
  (0.8 · 1.6 · 2.4 · 3.2 · 4% at Class Rank 1 · 10 · 20 · 30 · 40), **rounded, at least 1**, never above her max. In the
  round-end step the Spring Amulet's `mpRegen` uses, the battle log's `mp` cue as today's. Worked: a Tier 1 Mage at Lv 50
  with 296 MP at Class Rank 40 regains 12 a round ("MP 296 · +12 a round" on her sheet, H70).
- **UT6, the Flourish**, as her calling only (UT12), every tier, **4% of her max HP a fight**:

  | Stride | Flourish | What it does |
  |---|---|---|
  | Dash | **Clean break** | When the fight starts, a **Barrier of 4% of her max HP**; it absorbs any damage first and lapses at round 1's end, as every skill Barrier |
  | Middle | **Even pace** | At the end of each round she recovers **1% of her max HP**, up to 4% a fight |
  | Stayer | **Late reserve** | From the end of round 3 she recovers **2% of her max HP** a round, up to 4% a fight |

  Not a heal skill: no healing scale, focus or Auto weighting; it never overheals, a fallen Uma gets none; once a fight (a
  stage), not each wave; the breather between waves stays as it is. Set from her calling and class when the fight starts
  and frozen into the input (UT18).

**This packet's decisions:**
- **At most five depths count (the main session's ruling, 2026-10-25).** The regen counts the skill depths her class has
  open **up to five (4%)**: the approved text is "4% from Class Rank 40", and Tier 3's depth 6 (R5, Class Rank 50) doesn't
  raise it. `RPG_BASE_MP_REGEN_DEPTHS = 5` beside the share.
- **The regen has no input field.** `RPG_BASE_MP_REGEN = 0.008` in `caps.ts` (the sheet reads it without the engine) and
  `rpgBaseMpRegen(maxMp, classRank, engine)` in `rules.ts`:
  `Math.max(1, Math.round(maxMp × 0.008 × Math.min(RPG_BASE_MP_REGEN_DEPTHS, rpgOpenDepth(classRank))))` from v16, 0
  before. The engine reads it from the frozen input (`ally.stats.mp`, `battleClassRank(ally)`) with the fight's
  version, so it is set when the fight starts and fixed through it. Why: one formula for the engine and the sheet, and
  the input's `mpRegen` stays the Spring's alone.
- **The stack.** The round-end MP is `(ally.mpRegen ?? 0) + rpgBaseMpRegen(…)`, one `mp` cue, capped at her max MP. A
  Siphon's steal is unchanged. In R1 a Spring-wearing healer can be refunded a deep cast by a round; that is the
  supports' doing, today's already, and H71 measures it; R2 retires the supports.
- **The Flourish in the input:** `BattleAlly.flourish?: RpgFlourish`, v16 only (refused before v16: `Invalid battle ally`;
  one of the three values). The game sets it when she fights as her calling's class. Constants in `caps.ts`:
  `BATTLE_FLOURISH_SHARE = 0.04`, `BATTLE_FLOURISH_RATE = { 'even-pace': 0.01, 'late-reserve': 0.02 }`,
  `BATTLE_FLOURISH_FROM = 3`.
- **Clean break in the engine:** in `createBattle`, from v16, an ally with `clean-break` starts with
  `cover = Math.round(hp × 0.04)`, and a `cover` cue (her own, label `Flourish`) comes before the opening intents. The
  v12 round-end lapse ends it at round 1's end; `harm` already spends a cover first.
- **Even pace and Late reserve in the engine:** `BattleUnit.flourish?: number`, the HP her Flourish can still give this
  fight, set in `createBattle` to `Math.round(hp × 0.04)` from v16 (absent otherwise, so older states hash as before). At
  each round's end, for a living ally, after armor's Regen: Even pace every round, Late reserve when `round ≥ 3`, she
  heals `min(Math.round(hp × rate), flourish left, max HP − HP)`, the left shrinks by what she healed, and a `heal` cue
  (label `Flourish`) is pushed when she healed any. Full HP heals nothing and keeps the budget. Waves keep her unit, so
  the budget is the fight's.
- **Order at a round's end (v16):** statuses decay → armor's Regen → the Flourish → MP (the Spring and the base regen) →
  covers lapse → Regen (the Cleric's), as today otherwise.
- **The game's side.** `umaFlourish(outfit, uma, classId, pick)` (`save/battle.ts`): her template's Flourish when
  `umaFlourishActive(umaTemplate(outfit, pick), classId)`, else none. `RpgPartyMember.flourish?` carries it from
  `partyMembers` and `rpgPartyAllies` puts it in the input from v16. **The pick:** `OwnedUma.calling` arrives with H69,
  so this packet passes `null` (the rule's calling) and H69 swaps in `uma.calling.pick` (one line, named in its packet).
  The world map and the Rift both build allies through `partyMembers`, so both get it.
- **The balance party has no template** (no Flourish): the foes are priced without templates (UT13). H71 plays it so.
- **No screen, no save change.** The sheet's "+12 a round" and the ★ lines are H70's. `pnpm docs:update` leaves no diff.

## Do

1. **`rpg/battle/caps.ts`, `rpg/rules.ts`:** the constants and `rpgBaseMpRegen`, each with a one-line comment.
2. **The engine** (`types.ts`, `engine.ts`): `BattleAlly.flourish` and its validation; `BattleUnit.flourish`; Clean
   break in `createBattle`; the round-end order above; the base regen added to the Spring's.
3. **`save/battle.ts`, `rpg/campaign/run.ts`:** `umaFlourish`, `RpgPartyMember.flourish`, the input field from v16.
4. **Tests:**
   - `rpg/battle/mp-regen-v16.test.ts` (explicit inputs): a v16 Mage with 296 max MP at Class Rank 40, below her max,
     gains 12 at a round's end; at Class Rank 1 she gains 2 (296 × 0.008 = 2.4 → 2), at Class Rank 9 also 2, at 10 she gains
     5 (4.7 → 5); a 50-MP Uma at Class Rank 1 gains 1 (0.4 rounds to 0: at least 1); at Class Rank 50 she gains the same
     12 as at 40 (five depths at most); with a G10 Spring (`mpRegen` 10) she gains 22;
     never past her max; a fallen Uma gains nothing; the same Uma in a v15 input gains only the Spring's.
   - `rpg/battle/flourish-v16.test.ts`: Clean break starts with a cover of 4% of max HP (and its cue), absorbs a foe's
     hit, and is gone after round 1; Even pace heals 1% at each round's end while hurt, at most 4% in a fight, nothing at
     full HP, nothing once she has fallen; Late reserve heals nothing at the end of rounds 1 and 2, then 2% a round, at most
     4%; a three-wave stage gives at most 4% in all; `flourish` in a v15 input throws `Invalid battle ally`.
   - `save/flourish-v16.test.ts` (the switch mocked to 16 with `capsAt`): `partyMembers` sends an invented Middle-stride
     Mage-calling Uma's `even-pace` when she fights as a Mage and nothing when she fights as a Brawler; a world fight's
     input carries it, a Rift fight's too.
   - Both replay fixtures pass live and mocked to 16, untouched.
5. **Docs:** implementation.md §3: "Built: H68 (D…)". The D-row (fetch `main` first). `pnpm docs:update` leaves no diff.
6. **Check it locally** (390×844, desktop browser, scratch save): a world-map fight on Auto as before, its input at
   `"version": 15` with no `flourish`.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 4 pass; both replay fixtures pass live and mocked to 16.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged.
- [ ] The local check in step 6 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h68-mp-regen-flourish` with one commit,
  `feat(domain): the base MP regen and the Flourish on engine v16, dark (H68)`. H69 edits other functions of
  `save/battle.ts` at the same time: rebase on whichever lands first. Fetch `main` before you push. The main session
  reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H68 done (D…)` commit deletes this file, sets H68 to Done with a
  Done row, and sets H71 to Ready if H65 and H66 are done.
