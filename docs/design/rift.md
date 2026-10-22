# The Rift: the end-of-tier event and promotion

> **Approved 2026-10-21 (D161): every call as recommended; not built yet.**
> - The third of three linked docs, after [tiers](tiers.md) (what promotion does) and [classes v2](classes-v2.md) (the
>   classes the fronts are built around).
> - It replaces the parked Tier Finale (H23, Q6) and its Gauntlet, Raid and Siege options.
> - **Owner calls** are marked **R1**, **R2** and so on, with recommendations. [§12](#12-owner-calls) lists them all.
> - Numbers are drafts for the simulation.

## 1. What the owner asked for

- **A big event that runs long,** for Lv 50 Umas. Instead of EXP, it pays **achievements**, earned by clearing a great
  many fights that need **specific party compositions**.
- **Different compositions, or even different skill allocations,** before each group of fights:
  - **physical** fights, where foes are weak only to physical kinds (2 Brawler, 2 Spell Blade, a healer);
  - **magical** fights, where foes are weak only to elements (2 Mage, 2 Summoner, a healer);
  - **one foe with mixed weaknesses** that needs single-target damage (2 Brawler, 2 Mage, a healer);
  - **many foes with mixed weaknesses** that need areas and multi-hit (2 Spell Blade, 2 Summoner, a healer).
  The owner builds the parties; these are what the foes ask for.
- **Repeatable, farmable fights** for Class Ranks and equipment ranks, separate from the promotion fights.
- **Sign up four parties,** clear the whole event, and **promote all 20 Umas at once.**
- **Mostly bosses and sub-bosses,** a chance to see every one of them. **Cross-franchise,** led by the franchises with
  the most characters.

## 2. The reference: uma-racer's World Expeditions

uma-racer's Expeditions ([its 10-expeditions.md](https://github.com/luismlorenzana/uma-racer/blob/main/docs/rework/10-expeditions.md))
are each tier's finale.
- Each is one Uma's solo run: eight wins from a pool of foreign races.
- No EXP, and "promotion is the prize".
- Retries are free and unlimited, with a fresh seed each time.
- Its races live outside the normal catalogue, so they can't be farmed early.
- Promotion is a separate, confirmed action with no deadline.

| From the Expeditions | In the Rift |
|---|---|
| The tier's finale; promotion is the prize | **Kept** |
| Free, unlimited retries | **Kept** |
| Event fights live outside the normal world map | **Kept:** Rift fights are reached only from the Rift |
| Promotion is a separate, confirmed action | **Kept** |
| One Uma per run | **Changed:** 20 Umas per run, four parties |
| A pool of eight wins | **Changed:** four fronts built around party shapes, then a final |
| Not a farm; repeat wins pay less | **Changed:** the Rift's **Echoes** are a farm on purpose (ranks, not EXP) |

## 3. The name

**R1, what do we call it?**

| Option | Feel |
|---|---|
| **The Rift** (recommended) | Other worlds tear through: the cross-franchise bosses explain themselves. "The Tier 1 Rift", "seal the Iron front", "ascend" |
| Dimensional Invasion | The owner's working name: vivid, but long on a button |
| The Convergence | Worlds meeting; works for the final fight too |
| Crossover Front | Literal |

Promoting is **"Ascend"**, from "Ascend to Tier 2". "Expedition" stays uma-racer's word.

## 4. Shape

**Where:** the Battle page's **Tier Finale** place becomes **the Rift**, keeping its place id `tier-finale`. Its
building is new art (§10).

**When it opens:** when the tier world has **five Umas at Lv 50**. Its page then shows the four fronts and the Echoes.
A **run** needs **twenty Lv 50 Umas**.

**A run:**

1. **Sign up twenty Lv 50 Umas** (R2):
   - pick four parties whose members are all Lv 50, or pick twenty Umas directly;
   - the twenty are **the run's roster** until it ends;
   - between fights, the owner arranges them into any parties, and changes their classes, skills and gear as they
     like. That's the "different compositions and skill allocations" the owner asked for;
   - each fight is taken by one party of five drawn from the roster.
2. **Clear the four fronts**, in any order. Each is a chain of stages taken in order (§5).
3. **The Convergence:** once all four fronts are sealed, the final opens. It is four fights in a row, each a front's
   shape, each taken by a **different** party of the roster. All twenty Umas fight exactly once (§6).
4. **Ascend:** the run is won. The twenty can ascend together to Tier t+1, as [tiers](tiers.md) §5 says.

**Retries:**
- Every Rift fight can be retried freely, with no attempt count, cost or deadline.
- A retry draws a fresh seed with the same foes and weaknesses.
- HP and MP are full at the start of each front fight (R4).

**Built in H48 (D174):** the run rules in `save/rift.ts` (`@rpg/domain/rift`): opening, sign-up and an untouched run's
cancel, the roster lock, one open Rift fight a world beside the world map's, fronts and seals, the Convergence's
attempts, and Ascend ([tiers](tiers.md) §5). The manual's [Rift](../game/loops.md#the-rift) has the rules as played.

**Built in H50 (D175):** the page, `apps/web/src/places/rift/`, on the Battle page's `tier-finale` place, now "The Rift"
with uma-art's `rift` building, open once the world has five Lv 50 Umas (`placeOpen`). It has sign-up, the fronts'
chains and stage sheets, the Convergence's assignment, Echoes and Sweeps, the roster and Ascend. Its fights play on the
shared fight screen through a fight source, foes read by their face, and the result plays the achievement cut-in. The
Tier sheet's Rift line is live. The screens are in the manual's [sections](../game/sections.md#the-rift).

## 5. The four fronts

| Front | Foes | Weak to | Ward | Asks for | Today's party |
|---|---|---|---|---|---|
| **Iron** | Mixed formations, mostly sub-bosses and bosses | **1 Arms kind only** (H51; drafted 1–3) | Elements ×0.5, even when Broken | Physical damage that covers several Arms kinds, and multi-hit to chip shields | 2 Brawler, 2 Spell Blade, Paladin |
| **Arcane** | The same | **1–2 elements only** | Arms ×0.5 | Elemental coverage, areas against the guards | 2 Mage, 2 Summoner, Cleric |
| **Duel** | **One** boss a fight. She acts twice, three times at the champion. Shield 13–15 (H51; drafted 10–12) | 1–2 Arms **and** 1–2 elements | None | Single-target burst in both channels; locks broken by both | 2 Brawler, 2 Mage, a healer |
| **Horde** | **4–6 foes a wave**, three waves, each foe weak to its own Arms + element pair. Shields 3 | Mixed, per foe | None | Areas and multi-hit, so every foe is chipped | 2 Spell Blade, 2 Summoner, a healer |

**Ward (R5).** On the Iron and Arcane fronts, damage from the wrong channel is halved again, **on top of** the unbroken
halving. Off-composition parties can still win, slowly.
- This is a soft wall. A hard immunity would make the fronts puzzles with one answer.
- It's a foe trait in engine v14 (H44, D169), shipped ahead of classes v2 (engine v15, [classes v2](classes-v2.md) §8).

**Each front's stages** (R3, the length):

| Stages | Fight |
|---|---|
| 1–4 | A sub-boss with a key escort (H51; drafted two) |
| 5–8 | Two sub-bosses, or a boss with a sub-boss guard |
| 9–11 | A boss with a guard; three waves, the first two a lone foe each (H51; drafted trios) |
| 12 | **The front's champion:** two bosses from two different franchises, together |

That's 48 front fights and 4 in the Convergence: **52 fights a run, before retries.** Clearing stage 12 **seals** the
front.

**Levels:**
- Rift foes start at the tier's Lv 50 and climb, by stage, to Lv 50 + 10% offense and HP at the champion.
- The Convergence's fights are their champions' shapes at strength ×0.92, below the champions' ×1.1 (H51; drafted
  +10% again, ×1.21): an attempt must win all four in a row, so each is about 80–95% for the attempt to be a coin flip.
- Rift foes hit harder than the world's, by a share of offense per shape (H51), and Arcane's have ×1.5 HP and ×1.3
  offense over Iron's, since Arcane's casters clear the shared shape far faster than Iron's Arms today.
- The build budget assumes on-curve Lv 50 Umas, G10 gear and full Extra Stats.

**Locks:**
- Charged moves take locks only from the front's weakness kinds.
- On the Duel front, a lock set is always mixed: at least one Arms kind and one element.

**Built in H47 (D173):** shapes and numbers in `rift/fronts.ts`'s `RIFT_TUNING`, tuned in H51. Each stage's foes are in
the manual's [Rift's foes](../game/combat.md#the-rifts-foes). The Lv 55 Echo is the Lv 50 shape at ×1.22, since a tier
stops at Lv 50.

**Tuned in H51 (D176):** every number against §11 with the balance simulation (`rift/balance.test.ts`, `SIM=1`). The
measured results are in §11. The Duel's shields rose to 13–15 for [classes v2](classes-v2.md) §3.1's guard rail: today's
best single act removes 12 points, a Limit Break any Uma can learn.

**Classes v2 (H60, D186):** from engine v15 the generator reads `riftTuning(15)`, an override of `RIFT_TUNING` measured
with classes v2's parties (§11): Iron's and Arcane's shields double (a captain and a boss 16, her key guard 8, the elites
16, a boss's guard and the opening foes 12); Arcane's foes take ×1.2 HP and ×1.1 offense over Iron's (were ×1.5 and ×1.3);
each front may scale its own champion (Iron ×1.17 HP and offense, Arcane ×0.92 offense, the Horde ×1.05), and so its
Convergence fight; the Duel's boss ×1.1 HP and ×2.3 offense (were 1 and 1.65); the Horde's offense ×4.4 (4.6); the
Convergence at strength ×0.902 (`convergence` −0.18). Faces, ranks and counts are the same, so a run's faces don't move,
and a fight started on v14 keeps v14's foes. The guidance becomes v2's at the switch (`riftParty`, D178 point 5).

## 6. The Convergence

**Four fights in a row:** Iron, Arcane, Duel, Horde, each its front's champion at strength ×0.92, the champion's own
being ×1.1 (H51; drafted at the champion's strength plus 10%: with the champions at 60–70%, fewer than 6% of attempts
would be won).

**The owner assigns a party to each before starting.** Each party fights once, so all twenty Umas take part.

**Attempts:**
- One attempt is all four fights.
- A loss ends the attempt, and the next attempt starts from the first fight. There is no partial credit.
- HP and MP are full at each fight's start.

**The finale:** after the Horde fight, a last cut-in of every champion of the run. **The run is won.**

**Built in H52 (D177):** `apps/web/src/places/rift/RiftFinale.tsx`, played on the result of the win that wins the run,
before the achievement cut-ins. It shows every boss face of the four fronts' champions and the Convergence's four fights,
each once (14 with the locked packs), revealed one after another. The manual's
[sections](../game/sections.md#the-rift) has the screen.

## 7. Rewards: achievements, not EXP

**Front and Convergence fights pay no EXP, Laurels or Marks.** They pay achievements:

| Achievement | For | Kind |
|---|---|---|
| **Front seal** (×4) | Its champion | Required |
| **Rift conquered** | The Convergence | Required; unlocks Ascend |
| **Iron Will** | The Iron front with no magical damage dealt | Optional title |
| **Arcane Purity** | The Arcane front with no physical damage dealt | Optional title |
| **Untouched** | A front with no Uma knocked out | Optional title, one per front |
| **Swift Convergence** | The Convergence with every fight under 8 rounds | Optional title |
| **Bestiary** | Defeat every boss and sub-boss of the three packs, counted across every run and tier | Optional title |
| **Crossover** | A champion fight won by a party with all six classes represented across the roster | Optional title |

Crossover, for today's five classes: one party of five different classes wins a champion (H49, D172). With classes v2's
Paladin it reads "five different classes of the six".

With classes v2 a Spell Blade's and a Summoner's pair always deal both channels, so Iron Will and Arcane Purity need a
party without them: Brawlers on Iron, Mages on Arcane, and a healer kept to her Arms blows (Iron) or her Tome spells
(Arcane). They stay as harder titles (H60, D186).

Achievements are **account-level** ([tiers](tiers.md) §3): earned once, shown in the Account, with the date and the
run. Each Uma of a winning run keeps the run's shared achievements in her history.

**Promotion is the prize.** Ascending pays the new world its Ascension purse ([tiers](tiers.md) T5).

## 8. The Echoes: the repeatable farm

**What they are:** repeatable fights, one per front, in three difficulties (Lv 45, 50, 55). They're open whenever the
Rift is.

**Who:** any party whose members are all Lv 50 in this tier. No run is needed.

**What they pay:**
- **Class EXP** for the class she fights as, at 2× a stage's;
- **Weapon, Armor and Accessory Rank EXP** for what she wears, at 2×;
- past the caps, the existing Marks (D102);
- **no Uma EXP and no Laurels.**

**Why:** a Lv 50 Uma who switches class, say to Paladin for the Iron front, starts that class at Rank 1. Echoes are
where she catches up, outside the promotion fights. They're also the "Lv 50 content" that
[progression](progression.md) parked.

**Sweeps** clear an Echo already won, with Sweep Tickets, as with stages.

**R6, Echo availability:** recommendation: **all four, always.** The alternative is one front a day, rotating, which
adds pull but blocks a re-spec until the right day.

**Built in H48 (D174):** Echo pay is a regular stage's EXP at the Echo's level for her, times two on her Class, Weapon,
Armor and Accessory bars; Sweeps of a won Echo pay as wins, weapons even.

**The save** (in v23, [tiers](tiers.md) §4), on each tier world:
```
rift: {
  runs: [{
    id,
    roster: outfitId[20],
    startedAt,
    fronts: { iron | arcane | duel | horde: stagesCleared 0–12 },
    convergence: { attempts },
    wonAt?,
    ascendedAt?,
  }],
  echoes: { [front]: { [difficulty]: wonAt } },
}
```
Built in v23 (H37) with `null` for unset times and run ids `t<tier>-r<n>`. v24 (H46) adds the open Rift fight, the fight
count, each run's traces and open attempt, and the account's defeated faces (D171; the shape is in the
[manual](../game/architecture.md#the-save)).

Account: `achievements`. Each fight replays on its engine, as world fights do.

## 9. Faces: cross-franchise, bosses first

**The packs:** 135 bosses and 136 sub-bosses across the three locked packs ([enemy roster](enemy-roster.md)).

| Pack | Bosses | Sub-bosses |
|---|---|---|
| Azur Lane | 53 | 52 |
| NIKKE | 50 | 50 |
| PriConne | 32 | 34 |

**The Rift's picker pools by tier across the packs:**
- Azur Lane and NIKKE lead, and PriConne supports, in about 40 / 37 / 23 proportion of slots;
- a front champion pairs bosses from two different packs.

Today's `stageFaces` picks within one franchise per region, so this is new code.

**Seeing them all.**
- A run fills about 150 boss and sub-boss slots.
- The picker prefers faces this account **hasn't defeated yet**, so the Bestiary fills over two or three runs, and the
  owner meets every boss.
- Weaknesses come from the front, not the face.

**Built in H47 (D173):** one allocation per run walks its 52 fights in order and gives each slot a pack by a smooth
40 / 37 / 23 round-robin per face tier, then that pack's first face not yet used in the run, undefeated ones first. An
Echo allocates its one fight alone, with no preference. The starting shapes held 38 boss and 106 sub-boss slots a run,
so sub-bosses filled in two runs and bosses in four.

**Since H51 (D176):** a boss leads the last wave of every Horde fight (from stage 9 before), and Iron's and Arcane's
fights have one escort, one guard and lone opening foes. A run holds 46 boss and 64 sub-boss slots, so every boss and
every sub-boss has been met after three runs.

**Splashes and cut-ins** work as today: key, sub-boss and boss splashes, and the champion's red stripe.

## 10. What it needs

| Piece | Where | Size |
|---|---|---|
| The tier foundation and save v23 | [tiers](tiers.md) §8 | M |
| The ward, a third act and mixed locks (engine v14, H44) | `rpg/battle/` | M |
| Classes v2 (engine v15) | [classes v2](classes-v2.md) | L |
| **The Rift generator:** fronts, stage chains, champions, the Convergence, Echoes, the cross-franchise picker that prefers new faces, levels and locks | `packages/domain/src/rift/` | L |
| The run rules: sign-up, the roster lock, fights, seals, attempts, ascend (with [tiers](tiers.md) §5) | `save/rift.ts` | M |
| The Rift page: fronts and their chains, the Convergence assignment, Echoes, the run's roster, Ascend | `apps/web/src/places/rift/` | L |
| Achievements: rules, the Account's list, cut-ins on earning one | domain + web | M |
| **Art** (a ChatGPT packet, uma-art): the Rift building for the Battle page, four front crests, achievement badges in uma-art's `ui` atlas | uma-platform | M |
| The balance simulation: fronts by composition, Echo pacing | `rift/balance.test.ts` (H51), on `world/balance-party.ts` and `world/balance-play.ts` | M |

## 11. Balance targets

| Target | Value | Measured (H51, D176) |
|---|---|---|
| The right party, on-curve with the matching classes, first try on Auto | ≥ 80% a front stage; 60–70% a champion | Stages 1–4, 5–8, 9–11: Iron 96%, 98%, 87%; Arcane 100%, 100%, 99%; Duel 100%; Horde 98%, 91%, 94%. Champions: Iron 61%, Arcane 64%, Duel 68%, Horde 67% |
| The wrong party (all-magic on Iron, all-physical on Arcane) | ≤ 30% a stage, ≤ 10% a champion | On Arcane, Iron's party: 0–1% a stage, 0% the champion. On Iron, Arcane's party: 60%, 98%, 89% a stage (**missed**, below), 7% the champion |
| The Convergence, right parties | About 50% an attempt | 51% (49 of 96); its fights 76%, 91%, 79%, 99% |
| The Duel's guard rail ([classes v2](classes-v2.md) §3.1) | Every class's best single act < the Duel's lowest shield | 12 against 13 (shields 13–15; drafted 10–12, which 12 broke) |
| A run's length, at the owner's pace | About 2–3 weeks: 52 fights, the retries, and Echo time to raise new classes | About 58 fights on Auto: 52 for the 48 stages and 6 for the Convergence's two attempts, plus Echo time |
| Echo pacing | A Lv 50 Uma raises a fresh class to Rank 30 in about 40 Echo wins | 9 wins at Lv 50 and 55, 17 at Lv 45 (R6's 2×); Rank 50 in 20 and 40 (below) |
| Echoes, how hard (drafted in H51) | Lv 45 ≥ 80% with one Uma re-specced; Lv 50 ≥ 80% and Lv 55 about 50% on curve | Lv 45: 100% on every front. Lv 50: 99–100%. Lv 55: Iron 98%, Arcane 100%, Duel 100%, Horde 36% (below) |
| The Bestiary (§9) | Two or three runs | Three runs, for the bosses and the sub-bosses |

**How it was measured** (`rift/balance.test.ts`, `SIM=1`): each front's guided party (D168), on curve at Lv 50 (gear, Extra
Stats, an inherited Limit Break), first try on Auto, 96 fights a stage over three runs and 32 seeds. The wrong party
on Iron is Arcane's guided party, and Iron's on Arcane. Before H51 every guided party won every fight it was given, the
wrong ones nearly as often (Iron's wrong party 100% everywhere), the Convergence 96% of attempts, and a Limit Break
broke a Duel shield of 10 in one act.

**Skills move a champion by about 20 points.** The balance party equips each weapon's deepest core and side skill, and
Auto, which scores by power, swings the side skills' single heavy hits. A save fights with the game's default loadout
until the player picks (each weapon's two deepest cores, more hits to chip shields). With it the same parties win the
champions 91% (Iron), 46% (Arcane), 79% (Duel) and 84% (Horde), and 66% of Convergence attempts; the stages stay
93–100%. That is the skill allocation §1 asked to matter: multi-hit cores against Iron's shields, the casters' heavy
sides against Arcane's champions.

**Iron's wrong party, the one miss.** With today's five classes, Arcane's party isn't all-magic on Iron:
- its Summoners carry two Arms each and its Cleric three, and Auto, ward-aware, fights Iron with them;
- its Barriers and mends outlast Iron's one Cleric;
- its Mages hit hard enough that the ward's ×0.5 leaves them close to the Brawlers.

One Arms weakness a foe, one guard, lone opening foes and a champion shield of 16 widen the gap: stages 1–4 fall from
100% to 60%, and the champion from 100% to 7%. Every setting that pushed it under 30% a stage pushed Iron's own party
under 80% too. Classes v2 (the Spell Blade's 70/30 and multi-hit, the Paladin) is where Iron's own party gains; the
fronts are retuned then (D168).

**Echo pace and R6.** At 2× a stage, a fresh class reaches Rank 30 in 9 Lv 50 wins and Rank 50 in 20, not the drafted 40
to Rank 30. H51 keeps 2× (D176). The Rift's parties need re-specs: no Uma starts as a Spell Blade, and the Convergence
fields four of each class at once. At 2× a re-specced Uma opens every skill depth (Rank 40) in 14 Lv 50 wins, and a
party with one re-specced member wins the Lv 50 Echoes every time. A pay that met the draft (×0.45) would make Rank 40
take 59 wins, about the whole run's 58 fights for each re-spec. The one number the owner may still change is
`ECHO_RANK_PAY` in `save/rift.ts`: at 1×, Rank 30 takes 17 wins at Lv 50 and 33 at Lv 45.

**The Lv 55 Echo.** Lv 55 is the Lv 50 Echo at ×1.22, and it pays as Lv 50 (D174), so it's an optional hard step. One
multiplier can't put all four near 50%: Arcane's and the Duel's stage-8 shapes stay at 100% even at ×1.35, where Iron
falls to 22% and the Horde to 0%. It stays at ×1.22, five levels' worth.

### Classes v2 (engine v15, H60, D186)

The same tables with classes v2's guided parties (D178 point 5: Iron 2 Brawler, 2 Spell Blade, Paladin; Arcane 2 Mage,
2 Summoner, Cleric; Duel 2 Brawler, 2 Mage, Paladin; Horde 2 Spell Blade, 2 Summoner, Cleric) on curve at Lv 50 as v2
Umas (`balanceMember(…, { engine: 15 })`), first try on Auto, 96 fights a stage, on the v15 numbers of §5 and classes
v2's tuned classes ([classes v2](classes-v2.md) §9).

| Target | Value | Measured with classes v2 (H60, D186) |
|---|---|---|
| The right party | ≥ 80% a front stage; 60–70% a champion | Stages 1–4, 5–8, 9–11: Iron 100%, 100%, 95%; Arcane 91%, 99%, 96%; Duel 99%, 97%, 97%; Horde 100%, 88%, 98%. Champions: Iron 66%, Arcane 66%, Duel 61%, Horde 67% |
| The wrong party | ≤ 30% a stage, ≤ 10% a champion | On Arcane, Iron's party: 0%, 5%, 0% a stage, 0% the champion. On Iron, Arcane's party: 38%, 86%, 60% a stage (**missed**, below), 0% the champion |
| The Convergence, right parties | About 50% an attempt | 53% (51 of 96); its fights 100%, 100%, 53%, 100% |
| The Duel's guard rail | Every class's best single act < the Duel's lowest shield | 11 against 13: each class's own acts 5–11, the best Limit Break 12 (shields 13–15, unchanged) |
| A run's length | About 2–3 weeks | About 58 fights on Auto: 52 for the 48 stages and 7 for the Convergence's two attempts |
| Echoes, how hard | Lv 45 ≥ 80% re-specced; Lv 50 ≥ 80%, Lv 55 about 50% | Lv 45: 99–100%. Lv 50: 94–100%. Lv 55: Iron 100%, Arcane 43%, Duel 100%, Horde 34% (as H51's, one multiplier) |
| The Bestiary | Two or three runs | Three runs (unchanged) |

On v14's numbers, with classes v2 as H55–H58 built it (before H60's tuning), the v2 parties won Iron's and the Duel's
champions every time, Arcane's 17% and the Horde's 71% (24 fights each), and Arcane's party won Iron's stages 83%, 98% and
99% and its champion 21%: classes v2 made Iron's party far stronger (the Spell Blade's Arms half with its extra hit, the
Paladin) and Arcane's weaker at its champion (the Summoner heals no more).

**The healer of the Duel and the Horde** (D178 measured both): the Duel's champion with its Paladin 67%, with a Cleric
21%; the Horde's with its Cleric 67%, with a Paladin 71% but stage 8 96% to 83%. The guidance stays the Paladin on the
Duel and the Cleric on the Horde.

**The default loadout, for the record:** Iron 100%, 100%, 100%, champion 95%; Arcane 95%, 100%, 99%, 53%; Duel 100%, 98%,
95%, 61%; Horde 100%, 99%, 100%, 82%; the Convergence 60%.

**Iron's wrong party with classes v2, still the one miss.** Classes v2 widened the gap: Arcane's party now loses Iron's
champion every time and stages 1–4 more often than not, where on v14 it won 60% of them. Doubled shields favour the
multi-hit Spell Blades over casters who rarely hit Iron's one Arms weakness. It still wins stages 5–8 (two sub-bosses, or
a boss and her guard) 86% and 9–11 60%: the Mages' damage through the ward and the Cleric's mends carry the long fights.
Every setting that pushed those under 30% pushed Iron's own stages 9–11 under 80% (×1.5 HP: Iron's own 53% at 9–11 to
the wrong party's 58%; ×2: 4% to 14%), because the balance party's core-and-side loadout chips shields slowly. With the
game's default loadout Iron's party wins every Iron stage and 95% of the champions, so in play the gap is wider than the
table's.

## 12. Owner calls: decided 2026-10-21 (D161), all as recommended

| Call | Question | Recommendation |
|---|---|---|
| **R1** | The name | The Rift; promoting is "Ascend" |
| **R2** | Sign-up | Twenty Lv 50 Umas locked to the run as a roster, freely rearranged into parties between fights |
| **R3** | Length | Four fronts of 12 stages, plus the Convergence's 4: 52 fights |
| **R4** | Attrition | Full HP and MP every fight; no carry between fights, Convergence included |
| **R5** | Iron and Arcane walls | A soft ward: the wrong channel ×0.5 again. Not immunity |
| **R6** | Echoes | All four fronts always open, three difficulties; 2× class and gear rank EXP, no Uma EXP |
| **R7** | Who ascends | All twenty of a won run, together. To keep an Uma in this tier, don't sign her up |
| **R8** | Optional achievements | The eight in §7 as titles; only the four seals and "Rift conquered" gate Ascend |
| **R9** | Running again | Yes: a tier's next twenty Lv 50 Umas can run its Rift again. Achievements are kept; seals belong to a run |
