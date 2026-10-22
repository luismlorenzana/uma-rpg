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

## 5. The four fronts

| Front | Foes | Weak to | Ward | Asks for | Today's party |
|---|---|---|---|---|---|
| **Iron** | Mixed formations, mostly sub-bosses and bosses | **1–3 Arms kinds only** | Elements ×0.5, even when Broken | Physical damage that covers several Arms kinds, and multi-hit to chip shields | 2 Brawler, 2 Spell Blade, Paladin |
| **Arcane** | The same | **1–2 elements only** | Arms ×0.5 | Elemental coverage, areas against the guards | 2 Mage, 2 Summoner, Cleric |
| **Duel** | **One** boss a fight. She acts twice, three times at the champion. Shield 10–12 | 1–2 Arms **and** 1–2 elements | None | Single-target burst in both channels; locks broken by both | 2 Brawler, 2 Mage, a healer |
| **Horde** | **4–6 foes a wave**, three waves, each foe weak to its own Arms + element pair. Shields 3–4 | Mixed, per foe | None | Areas and multi-hit, so every foe is chipped | 2 Spell Blade, 2 Summoner, a healer |

**Ward (R5).** On the Iron and Arcane fronts, damage from the wrong channel is halved again, **on top of** the unbroken
halving. Off-composition parties can still win, slowly.
- This is a soft wall. A hard immunity would make the fronts puzzles with one answer.
- It's a foe trait in engine v14 (H44, D169), shipped ahead of classes v2 (engine v15, [classes v2](classes-v2.md) §8).

**Each front's stages** (R3, the length):

| Stages | Fight |
|---|---|
| 1–4 | A sub-boss with two key escorts |
| 5–8 | Two sub-bosses, or a boss with sub-boss guards |
| 9–11 | A boss with guards; three waves |
| 12 | **The front's champion:** two bosses from two different franchises, together |

That's 48 front fights and 4 in the Convergence: **52 fights a run, before retries.** Clearing stage 12 **seals** the
front.

**Levels:**
- Rift foes start at the tier's Lv 50 and climb, by stage, to Lv 50 + 10% offense and HP at the champion.
- The Convergence adds 10% again.
- The build budget assumes on-curve Lv 50 Umas, G10 gear and full Extra Stats.

**Locks:**
- Charged moves take locks only from the front's weakness kinds.
- On the Duel front, a lock set is always mixed: at least one Arms kind and one element.

## 6. The Convergence

**Four fights in a row:** Iron, Arcane, Duel, Horde, at their champion's strength plus 10%.

**The owner assigns a party to each before starting.** Each party fights once, so all twenty Umas take part.

**Attempts:**
- One attempt is all four fights.
- A loss ends the attempt, and the next attempt starts from the first fight. There is no partial credit.
- HP and MP are full at each fight's start.

**The finale:** after the Horde fight, a last cut-in of every champion of the run. **The run is won.**

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
| The balance simulation: fronts by composition, Echo pacing | `world/balance` | M |

## 11. Balance targets

| Target | Value |
|---|---|
| The right party, on-curve with the matching classes, first try on Auto | ≥ 80% a front stage; 60–70% a champion |
| The wrong party (all-magic on Iron, all-physical on Arcane) | ≤ 30% a stage, ≤ 10% a champion |
| The Convergence, right parties | About 50% an attempt |
| A run's length, at the owner's pace | About 2–3 weeks: 52 fights, the retries, and Echo time to raise new classes |
| Echo pacing | A Lv 50 Uma raises a fresh class to Rank 30 in about 40 Echo wins |

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
