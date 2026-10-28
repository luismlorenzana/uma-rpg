# Weaknesses v2: every foe her own list, more on regulars, never fewer than three

> **Proposed 2026-10-28 (D235), for the owner's review.** The owner's request after playing R1 + R2; the main session's
> design and measurements. It replaces [class-progression](class-progression.md) §4.1's twins (CP5) and §4.2's narrowing
> (CP6) for the campaign; the Rift's fronts (CP7) stay. It is built in two packets: H115 (the rule and its balance, dark,
> engine v18) and H116 (the switch). Each packet cites the calls below by number (WK1…WK12).
> The review page: [weaknesses-v2.html](previews/weaknesses-v2.html).

## Why

The owner, with two fights on screen (Twilight Rift II: four foes all "Weak: Bow, Katana"; Meadow III: two foes both
"Weak: Axe, Ice"):
- "whenever I find combat stages like that, it feels horrible to fight those, as those enemies are weak to my least used
  weapons and they also have the exact same weakness";
- before R1 "the weaknesses seemed more organic, and there was also a progression: regular enemies would have more
  weaknesses and Elites, Sub-bosses and Bosses less, but the floor would always be 2 physical + 1 magic or 1 physical +
  2 magic. Overall it felt a lot more fun";
- review where today's state came from and the older version, then plan an improvement and rebalance it fully.

## 0. At a glance

| | Before R1 (v15) | Today (v16–v17, the twins) | **Proposed (v18)** |
|---|---|---|---|
| A regular | 2 random Arms + the ring's answer + 1 random element (4) | 1 Arm + 1 element, read from her element (2) | **2 Arms + 2 elements (4)** |
| An elite (sub-boss) | 2 random Arms + the ring's answer (3) | the same 2 | **3: 2 Arms + 1 element, or 1 Arm + 2 elements** |
| A boss | 1 random Arm + the ring's answer (**2**; 3 on a two-element boss) | the same 2 | **3, as an elite** |
| Light + Dark foes | 3 Arms, no element (a Mage has nothing) | Bow + Katana ("Twilight") | **2 Arms + 2 elements from Fire, Ice, Lightning** |
| Foes of one stage | each her own draw | **identical** in a one-element stage | **each her own: Arms and elements dealt from the stage's decks** |
| Shields | regular 2–3, elite 6, boss 8 | the same | **the same (measured, §5)** |

The owner's memory of v15 was right about regulars and elites. A one-element v15 boss had only one Arm and one
element; the proposal makes the floor of three real for every foe.

## 1. Where today's rule came from

| Date | Step |
|---|---|
| 2026-10-11 | The world map's first weaknesses (D66, D72, D91): a seeded set of Arms per foe and the ring's answers, with a pair rule for two-element foes. Light + Dark foes "break on weapons alone" |
| 2026-10-22 | The owner asked whether bosses should be weak to types rather than weapons, and to split physical and magical (class-progression's owner points) |
| 2026-10-24 | The owner asked to **rework Tier 1's weaknesses**; the main session proposed **twins** (CP5): a foe is weak to the element that beats hers and its twin Arm, every rank, one rule. Approved with the doc (D192) |
| 2026-10-25 | Built dark in H66 (D202), shields measured in H71 (D207: 6 and 8 kept), live with R1 in H72 (D210) |

**Why twins looked right on paper** (CP5): the Arm is read from the element, so one ring teaches both channels; both
channels answer every foe; a hybrid on a twin set (the Spell Blade's Lance and Thunder Tome) lands both halves weak. The
doc counted the answers across the world's 48 signatures and found every twin set held by two or more default members.

**What the paper didn't show:** the counts were per signature, not per stage. A stage's foes share its signature, so
they share the list, and two kinds over a three-weapon party leave half the party with nothing to break.

## 2. What it does in play (measured)

Tier 1's 2,400 region stages (200 regions × 12; the capitals and scenario chapters follow the same rule), each foe's list against the default party (Brawler
Greatsword · Axe · Lance; Mage Fire · Blizzard · Thunder; Spell Blade Katana · Lance · Thunder; Cleric Light · Blizzard ·
Bow; Summoner Dark · Light · Bow). A member "answers" a foe when she holds one of its kinds.

| | v15 | Today (twins) | Proposed |
|---|---|---|---|
| Kinds a foe: regular · elite · boss | 3.95 · 3.21 · 2.52 | 2 · 2 · 2 | **4 · 3 · 3** |
| Members answering a regular (of 5) | 4.37 (min 2) | 2.44 (min 2) | **4.40 (min 3)** |
| … an elite | 3.75 | 2.58 | **3.73 (min 2)** |
| … a boss | 3.29 | 2.56 | **3.70 (min 2)** |
| Stages where every foe has the same list | 1% | **52%** | **0%** |
| Neighbouring foes in a wave with the same whole list | 5% | **68%** | **0%** |
| Stages where a member has no weak target at all | 15% | **89%** (1.76 members a stage) | **5%** (only solo and duo regulars) |
| Foes each class can hit weak: Brawler · Mage · Spell Blade · Cleric · Summoner | 89 · 95 · 80 · 80 · 90% | 65 · 65 · **35** · 45 · **35%** | **89 · 100 · 80 · 80 · 89%** |
| With a Paladin for the Cleric: Paladin's share; idle stages | — | 65%; 83% | **82%; 4%** |

Today the Spell Blade and the Summoner can hit only a third of Tier 1's foes weak, and in nine stages of ten someone
spends the fight at the unbroken ×0.5. That is the "least used weapons" feeling: the stage asks for two kinds, and
whoever doesn't hold them sits it out.

## 3. The older version, exactly (v15, still in `world/world.ts` for old fights)

- **Arms:** five shuffled by the foe's own seed; a regular and an elite take 2, a boss 1; a Light + Dark foe 3.
- **Elements:** the ring's answers to her elements, never her own; a regular with exactly one answer gets one more
  element at random.
- **Light + Dark** answer to no element, so those foes had Arms only, and a Mage had nothing to break in the Twilight Rift.
- What made it feel organic: every foe drew her own Arms, so neighbours rarely matched (1% of stages).
- What it got wrong: a one-element boss at 1 + 1, the Mage shut out of Light + Dark stages, and Arms that could repeat
  down a whole wave by chance.

## 4. The rule (WK1–WK4)

- **WK1 · Lists by rank.** A **regular** (and the regular-rank foes beside elites and bosses: Keys and guards) is weak to
  **4 kinds: 2 Arms and 2 elements**. A **sub-boss** and a **boss** are weak to **3: 2 Arms and 1 element, or 1 Arm and
  2 elements**, the split seeded per foe. Every foe answers to both channels.
- **WK2 · The ring leads the elements.** Her first element is the one that beats her lead element on the ring (Fire >
  Ice > Lightning > Fire; Light ⇄ Dark), or her second's when the first is her own; a two-element foe's second answer
  comes next; the rest are dealt from the stage's element deck, never her own. A **Light + Dark** foe has no ring answer,
  so her elements are dealt from **Fire, Ice and Lightning**: the Twilight Rift now answers to a Mage. The region keeps
  its theme: a Volcano's foes are still weak to Lightning, then to one more.
- **WK3 · The Arms come from the stage's deck.** The five Arms are shuffled by the stage's seed and dealt in slot order
  across its waves, two (or one) a foe, reshuffled when the deck runs out. A foe never holds an Arm twice, nor the previous
  foe's Arms again, so a wave sees every Arm before one repeats and no two neighbours match. The drawn elements come from
  an element deck the same way (a foe's drawn elements don't repeat the previous foe's when another one fits).
- **WK4 · Fixed per stage.** Everything is seeded by the stage's id and the foe's slot, so the stage sheet shows the lists
  before Fight, and every visit and Sweep meets the same foes.

**The two stages from the screenshots,** today → proposed (the Arms first, then the elements):

| Stage | Foe | Today | Proposed |
|---|---|---|---|
| Twilight Rift, squad (Light + Dark) | 4 regulars | Bow, Katana × 4 (3 members answer each) | Greatsword, Katana, Ice, Lightning · Bow, Axe, Fire, Lightning · Lance, Katana, Fire, Ice · Lance, Greatsword, Ice, Lightning (4–5 answer each) |
| Meadow, pair (Lightning) | 2 regulars | Axe, Ice × 2 (3 answer) | Greatsword, Lance, Ice, Dark · Axe, Katana, Ice, Fire (5 and 4) |
| Forest elite (Dark) | sub-boss · 2 Keys | Bow, Light × 3 (2 answer) | Katana, Light, Lightning · Lance, Bow, Light, Fire · Axe, Greatsword, Light, Ice (4, 5, 4) |

A two-element stage's regulars keep both ring answers as their elements (a Volcano's Fire + Dark squad: Lightning and
Light on all four), so the region's theme reads at a glance, and their Arms differ foe to foe.

The review page has these and a Volcano squad and a Coast boss in full, with who in the party answers each foe.

## 5. The rebalance (WK5–WK6)

Measured with the R2 simulation (`world/balance-v17.test.ts`'s party and harness): engine v17, the five-class party on
curve, first try on Auto, every Tier 1 stage at the level, 8 seeds. Only the weakness lists change between columns.

| Tier level | Regular: rounds · first Break | Elite | Boss |
|---|---|---|---|
| **Lv 10** v15 / today / **proposed** | 4.3 · 1.5 / 4.8 · 1.7 / **4.3 · 1.5** | 4.9 · 2.5 / 5.3 · 3.1 / **4.9 · 2.8** | 7.9 · 3.2 / 8.3 · 3.0 / **7.6 · 2.8** |
| **Lv 20** | 3.4 · 1.3 / 3.8 · 1.4 / **3.4 · 1.3** | 4.0 · 2.1 / 4.3 · 2.6 / **4.0 · 2.5** | 6.2 · 2.5 / 6.8 · 2.4 / **6.0 · 2.7** |
| **Lv 30** | 3.1 · 1.0 / 3.2 · 1.0 / **3.0 · 1.0** | 3.2 · 1.7 / 3.4 · 1.3 / **3.1 · 1.8** | 5.2 · 2.0 / 5.6 · 2.0 / **5.3 · 2.0** |
| **Lv 40** | 3.4 · 1.1 / 3.9 · 1.1 / **3.5 · 1.1** | 4.0 · 1.7 / 4.3 · 1.3 / **4.0 · 2.0** | 6.3 · 2.4 / 6.7 · 2.4 / **6.5 · 2.2** |
| **Lv 50** | 4.2 · 1.2 / 4.8 · 1.1 / **4.1 · 1.2** | 5.6 · 2.0 / 6.3 · 1.4 / **5.6 · 1.9** | 8.1 · 2.6 / 8.4 · 2.5 / **7.9 · 2.6** |

- Win rates are 100% on curve in every column, as today.
- **Fights return to v15's pace:** rounds within ±0.3 of v15's everywhere, about 10% shorter than today's. The first
  Break comes within ±0.4 of v15's (H71's own target was ±0.5 of v15).
- **More foes break:** a boss broke in 74–99% of today's fights and 92–100% of the proposal's; regulars 81–99% → 95–100%.
- **Every class lands more of its damage:** a turn at Lv 10 · 30 · 50, today → proposed: Brawler 60 · 421 · 746 → 64 ·
  457 · 814; Mage 77 · 503 · 908 → 82 · 528 · 967; Spell Blade 56 · 385 · 777 → 65 · 443 · 935; Cleric 26 · 151 · 358 →
  30 · 179 · 404; Summoner 58 · 403 · 746 → 71 · 398 · 836. Every class is within 6% of v15's; the hybrids gain most.
- **Charged moves:** cancelled 57–74% of the time, as before (59–69% on v15, 64–71% today).

So:
- **WK5 · Shields stay:** regulars 2–3 by formation, sub-bosses 6, bosses 8 (`RPG_FOE_SHIELDS_V16`), the capitals' Finals
  as they are. Raising them (+1 / 7 / 9 and +1 / 8 / 10 were tried) moves rounds by 0.1–0.3 and Breaks by 0.1–0.3, and
  buys nothing the owner asked for.
- **WK6 · Locks stay:** a charged move's 2–4 locks are drawn from her list. A longer list spreads them over more members.

H115 re-runs R2's delivery tables on the v18 generation (32 seeds, the Paladin party, the region runs with MP carried,
the Tier 2 and 3 worlds) before anything turns on.

## 6. Screens (WK7)

- **WK7 · Icons only on a fight's foe card.** Four icons and the shield badge fit a quarter-width card (about 84 px of
  95), the word "Weak:" doesn't, so the fight card drops it (VoiceOver still reads "weak to …"). The stage sheet's foe
  rows keep "Shield 3 · Weak:" and the icons. Arms first, then elements, each in its kind's color (D234).

## 7. Later tiers and the Rift (WK8–WK10)

- **WK8 · Tiers 2 and 3** (replaces CP6's narrowing to one kind): every rank at the floor, **3 kinds**. A regular's split
  follows her weaker defense, so regions still lean as CP6 wanted: strikers and guards (M.DEF lower) **1 Arm + 2
  elements**, casters and skirmishers **2 Arms + 1 element**; sub-bosses and bosses by seed. Shields grow with the
  answers a list gets (CP8's rule), set by R4's and R5's balance packets (H96, H104), which re-read this section.
- **WK9 · The Rift doesn't change.** Its fronts draw by front (CP7: Iron one Arm a foe, Arcane two elements, the Duel's
  and the Horde's twin sets), because the Rift is where specialized parties come in. The twins stay as a vocabulary
  there, in the colors (D234) and in Hex.
- **WK10 · Every campaign generator uses the rule:** the regions, the capitals' Finals and the scenario chapters, through
  one helper.

## 8. Versions and checks (WK11–WK12)

- **WK11 · Engine v18 is the weakness rework.** Only the foes' generation changes (no battle rule), keyed by engine as
  every rule is: `RPG_REWORK_ENGINE` gains `weak: 18`, and R3, R4 and R5 move to **engines v19, v20 and v21**
  (implementation.md, the handoff index, their packets). An open v17 fight keeps its foes; v17's fights replay as they
  were, and v17's generation is frozen by digest.
- **WK12 · The checks** (replace CP4's twin checks), on the generator before any fight, with either healer:
  1. every Tier 1 foe answers to both channels and to two default members or more;
  2. no stage of two foes or more gives every foe the same list;
  3. every default member hits 75% of Tier 1's foes weak or more;
  4. the simulation: rounds and the first Break within ±0.5 of v15's at Lv 10–50, on-curve win rates unchanged.

## 9. Alternatives considered

| Model | Why not |
|---|---|
| Keep the twins, add a second twin set | Still identical down a one-element stage; four kinds in two fixed pairs |
| v15 as it was | A one-element boss at 1 + 1, a Mage shut out of Light + Dark, repeats by chance |
| Weaknesses by role | Readable, but a region's foes share roles, so they share lists again |
| Five or more kinds a regular | Breaks become automatic and the shield game flattens; four already answers 4.4 of 5 members |
| Raise shields with the answers | Measured (§5): 0.1–0.3 rounds for nothing the owner asked for |

## 10. Packets

| Id | Task | Who | Size | Needs |
|---|---|---|---|---|
| H115 | **The rule and its balance, dark** (engine v18's generation): WK1–WK4 in one helper for regions, capitals and scenario chapters; shields and locks unchanged; v17's generation frozen; the WK12 checks; R2's delivery tables on v18 | Claude | M | — |
| H116 | **The switch:** engine v18 live, v17's replays frozen; the fight card's icons (WK7); the manual; R3–R5 on engines v19–v21; deploy | Claude | M | H115 |
