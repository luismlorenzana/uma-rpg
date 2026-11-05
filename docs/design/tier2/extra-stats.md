# Extra Stats in Tiers 2 and 3: unlocking, slotting and the branch lists

> **Status: round 2, the owner's requirements (R2-8), 2026-11-05. Nothing here is built.** One of the seven docs of
> [the Tier 2 and Tier 3 set](README.md), calls **T2E1–T2E49**, each with a recommendation; no open questions. Round 1
> (T2E1–T2E20) carried [extra-stats-progression.md](../tier-rework/extra-stats-progression.md) (EP1–EP29, D194) and the
> star chart's corner (PP31, D277) onto **Tier 1 as built** (engine v21, save v36); round 2 (T2E21–T2E49) answers the
> owner's requirement below and rewrites the doc as one design. The manual ([loops § Extra Stats](../../game/loops.md#extra-stats),
> [materials § Jewels](../../game/materials.md#jewels), [sections § Stable](../../game/sections.md#stable)) is the game as it plays.
>
> **The owner (round 2):** "Extra stats I want to get out there where unlocking the moon is one thing but then maybe
> slotting the actual extra stat per moon is something else, can we have moons boosting AoE damage and multi-hit damage
> in different proportions? different damage types? a little mp recovery here and there, a little life steal here and
> there? I craft and unlock the Sun and the moons but then in Tier 2 I have branches for every stat granted that I can
> select and swap freely."
>
> **Aligned with the round-2 drafts beside it:** [professions](professions.md) (T2P27–T2P30: Stone's second material,
> Fungi, makes **Stardust** G1–G10, and one Stardust a jewel slots a node's branch, once) and [progression](progression.md)
> (T2W24: the Stars track reads open nodes, never a node's stat; the map stays 22 if the weapon moon becomes a pick). Round
> 1's weapon moon **becomes Prowess's kind rows** (T2E27), so the map is 22 nodes in every tier.
>
> **Pages** (desktop, light and dark): [the chart with branches: a node's list, Stardust, Set all, presets](previews/extra-stats-chart.html) ·
> [every branch by node and tier, jewels and Stardust](previews/extra-stats-tiers.html) ·
> [the branch lists, the new rules and what each is worth](previews/extra-stats-branches.html) ·
> [the weapon moon as a pick: Prowess's kind rows, measured](previews/extra-stats-weapon-moons.html).
>
> **Numbers come from the code** (`economy/planet.ts`, `economy/grades.ts`, `places/observatory/star-chart.ts`) and from
> the live balance harness (`world/balance-party.ts`, `balance-play.ts`; engine v21; the owner's two parties at their
> presets, D263; on curve; Auto; 8 seeds a stage; only the measured Uma changes, D266's way), printed by throwaway tests
> that are not committed. A Tier 2 world plays Tier 1's rules × tier today, so "Tier 2 Lv 50" is continent 10's stages
> with the party at Tier 2's values. **Names:** every new name here was checked against every string of uma-platform's
> master-data release (10 files, 20,500 distinct strings, case-insensitive, exact): none matches (T2E48).

## 1. At a glance

**Three steps a node, two crafted.** **Unlocking:** her jewels open the Planet's and the moons' nodes in order, three
jewels a rank, as Tier 1, and an open node gives Tier 1's gift. **Slotting (from Tier 2):** one **Stardust** a jewel,
once, slots the node. **Choosing:** a slotted node wears any **branch** of its body's list, swapped freely, at no cost.
Tier 1 has no branches (R2-1).

**One lane a body** (T2E22): a branch re-spends its own body's gift inside its purpose, so no pick turns defense into
offense or back, and the build budget the foes are priced on (T2B1) holds whatever she slots.

| Body | Tier 1's gift (the default) | Tier 2 branches | Lane |
|---|---|---|---|
| **Planet** (the Sun) | All six | **All six** · **DEF and M.DEF** · **HP and MP** (ATK and M.ATK stay on every row; the doubled pair takes the other's points) | The core |
| **Prowess** | Offense, by her class's split | **Offense** · **Area** (+1.5% a point on her area hits) · **Multi-hit** (+0.6% a point on her multi-hit hits) · **Full** (1.5 × the points on one of her kinds) · **Split** (0.7 of Full on each of two); Tier 3 adds **Trio** (half of Full on all three) | Offense |
| **Vigor** | HP and MP | **HP and MP** · **HP** · **MP** · **MP back** (a fifteenth of a % of her bar a round a point) · **Life steal** (0.1% of her damage a point) | Pools and sustain |
| **Guard** | DEF and M.DEF | **DEF and M.DEF** · **DEF** · **M.DEF** · **Area guard** (−0.4% a point on foes' every-Uma moves) | Defense |
| **★ Her moon** | Her template's two nodes | **No branch, no jewel, no Stardust:** her template is read, never picked (T2U8) | Her uniqueness |

*A point* is a node's Tier 1 points: 2, 4, 6, 8, 10 on a moon, so Prowess V's Area is +15%.

| | Tier 1 (live) | Tier 2 | Tier 3 |
|---|---|---|---|
| **Nodes** | 22 | **22** | **22** |
| **An Uma's map** | 30 jewels | **30 jewels + 30 Stardust** (one a jewel) | the same |
| **Nodes that take a branch** | none | **20 of 22** (her moon's two never) | 20 of 22 |
| **Flat branches** | — | × 1.8 | × 2.6 |
| **Percent branches** | — | Area +45%, Multi-hit +18%, MP back +2.0%, Life steal 3%, Area guard −12% at five nodes | **the same** (percentages don't scale, SB1) |
| **Prowess, Lv 50** (harness, her damage) | her split | her split 9.8–17.5%; **at her best branch 13.0–17.5%**: Offense for the pure classes and healers, Multi-hit for the Spellblades, Area or a kind row for the Summoners | the same winners; Trio for an even kit |
| **Her window's Stars track** | 4 · 9 · 13 · 18 · 22 | **4 · 9 · 13 · 18 · 22**, open nodes only (T2W24) | the same |
| **Stone's work, an Uma** | 150 cut stones | 150 cut stones + **150 Fungi powders** (T2P30) | the same |

## 2. Tier 1 as built

### 2.1 The map

The Planet and three moons, five nodes each, and her moon's two: **22 nodes**, every class the same
([loops](../../game/loops.md#extra-stats); `economy/planet.ts`). Every open node counts; nothing switches on.

| Body | Nodes | Grades · opens at | Points I–V (Tier 1) | Gives |
|---|---|---|---|---|
| **Planet** | 5 | 1, 3, 5, 7, 9 · Lv 1, 11, 21, 31, 41 | 1, 2, 4, 6, 8 | All six core stats (HP 5 a point) |
| **Prowess** | 5 | 2, 4, 6, 8, 10 · Lv 6, 16, 26, 36, 46 | 2, 4, 6, 8, 10 | ATK and M.ATK by her active class's split |
| **Vigor** | 5 | the same | the same | HP and MP |
| **Guard** | 5 | the same | the same | DEF and M.DEF |
| **★ Her moon** | 2 | with the third moon's II (Lv 16) and IV (Lv 36) | 4, 8 | I her knack's stat; II her calling's root (Warrior DEF, Mage M.DEF, All-Rounder half each) |

- **Prowess's split** (`PROWESS_SPLIT`): Brawler 100/0, Arms Spellblade 70/30, Arms Summoner 70/30, Paladin 80/20,
  Cleric 20/80, Tome Summoner 30/70, Tome Spellblade 30/70, Sorcerer 0/100; a Tier 0 a third a slot to its channel.
- **A point** (D104): +1 to its stat, HP +5, Speed 0.6% evasion, Limit 0.4 of the gauge. Speed and Limit come only from
  her moon (a Fleet or Gritty knack).
- **Values × tier** (`tierScaled`, SB1): every node's Tier 1 points × 1.8 and × 2.6, rounded half up, already live.

### 2.2 Three jewels a rank (D264)

| Rank (grade) | Lv | Jewels | Opens |
|---|---|---|---|
| 1, 3, 5, 7, 9 | 1, 11, 21, 31, 41 | **3 Planet Jewels** n | Planet n |
| 2, 4, 6, 8, 10 | 6, 16, 26, 36, 46 | **3 Moon Jewels** n, one a moon | Prowess n, Vigor n, Guard n; her moon I with the three moons' II, II with their IV |

Each jewel is **5 cut stones of its grade** at the Lapidary (FL9, D264). An Uma: 3 of each of the ten, **30 jewels, 150
refined Stone items**, 50.2 h at each Stone place at Craft Lv 25's manual times (`professions-v4.sim.ts`).

### 2.3 The Stars tab and the chart

Only on her profile's Stars tab ([sections](../../game/sections.md#stable); D269, D277, D278).

| Part | As built |
|---|---|
| **First row** | "Extra Stats · Open 13/22 · 2 ready", **Set all** while a jewel fits, the (i) |
| **The chart** | 360 × 350 on the night sky: the Planet at (180, 208) on a ring of 44; Prowess, Vigor and Guard on one orbit of 132; her moon's pair at (304, 62). Four states: Open, Ready (green dot, slow pulse), Next, Later |
| **The test** (`star-chart.test.ts`) | 22 nodes once, in map order; any two stars 44 pt apart at 375 wide (46.2 units); every star inside; the Planet's on its ring, the moons on one orbit; clockwise from the top; labels off the stars; crest buttons off their stars |
| **The totals** | Six cells with stat marks, then her moon's accent line ("★ Evasion +2.4% · DEF +8") |
| **A node's sheet** | A strip of the body's nodes; what it gives; before → after from her battle sheet; its jewel; **Set**, or what stops it |
| **Set all** | Every jewel that fits, one line each; Planet Jewels first; a Moon Jewel to the moon furthest behind; one save write |

### 2.4 The fight, as built

Where a branch would land ([combat § Damage](../../game/combat.md#damage), `battleDamage`): offense (stat + Might + an Orb's
flat + her ★) → `offense² ÷ (offense + defense) × power` → weak ×1.3 → Insignias → statuses → specials → unbroken ×0.5 →
the Rift's ward → evasion → rounded. **The shapes** ([classes § Weapons](../../game/classes.md#weapons)): Heavy (Greatsword
1 · 1 · 2 · 2 · 3 hits by depth, Fire one), Sweep (every foe ×0.55), Scatter (random foes, many hits ×1.05), Double (two
hits), Volley (0.8 on the tapped foe in 1 · 1 · 2 · 2 · 3 hits, a 0.35 splash on every other). Both Spellblades' skills
strike one foe, and her lead half lands one extra hit; a Summoner's lingering summon strikes every foe in farewell; the
healers' skills strike one foe once. **MP:** 1% of her bar back a round a depth, 5% at most (`rpgBaseMpRegen`).

## 3. The calls before this round

### 3.1 EP1–EP29 and PP31

| Call | What it said | Status | Why |
|---|---|---|---|
| **EP1** Tier 1's shape | The Planet and three moons, 20 nodes, every class; her moon's 2 beside | **Kept** | Live; the map of every tier |
| **EP2** The Planet | +1, +2, +4, +6, +8 to all six × tier | **Kept** | The Planet's default branch (T2E23) |
| **EP3** A moon node | Its grade × tier; Guard both defenses; Prowess splits | **Kept** | Each moon's default branch |
| **EP4** Vigor, both pools | HP and MP; the base regen | **Kept** | Vigor's default branch |
| **EP5** What opens a node | Its jewel, in order, at Uma Lv 5g − 4 | **Kept, changed** (D264, R2-9) | Three jewels a rank in every tier; from Tier 2 one Stardust a jewel slots it (T2E21) |
| **EP6** What counts | Every open node; no active slots | **Kept, changed** (R2-8) | Every open node counts, slotted ones with the branch she wears; a branch is a setting, not a slot to fill (T2E21) |
| **EP7** Values across tiers | × 1, 1.8, 2.6 a node, half up; a Split 0.7 | **Kept** | Flat branches × tier; percent branches flat (T2E34) |
| **EP8** Speed and Limit | Off the shared map in every tier | **Kept** | No branch reaches them; her knack's alone |
| **EP9** The Halo | Retired into the weapon moons | **Kept** | Never built |
| **EP10** Weapon moons and groups | Kinds, never a group | **Kept, changed** (D264, D266, R2-8) | Her three weapons' kinds, as Prowess's kind rows (T2E27) |
| **EP11** Valor | Retired | **Kept** | Never built |
| **EP12** Tier 3 | A second weapon moon | **Superseded (R2-8)** | No weapon moon; Tier 3's depth is the Trio row, all three of her kinds (T2E44) |
| **EP13** The core across tiers | Rebuilt empty at promotion; tiers add no core nodes | **Kept** | Live as Ascend (D283); branches carry (T2E41) |
| **EP14** Her moon | Two nodes; node II her calling's channel; × tier | **Kept, changed** (D264, CV21) | No jewel; by her calling's root; no branch and no Stardust (T2E28) |
| **EP15** Defense and sustain | No new defensive values | **Kept, changed** (R2-8) | No new defensive budget: Guard's and Vigor's branches re-spend their own points (T2E22) |
| **EP16** The foe budget | Rates kept; the build part × tier; weapon moons in the tier's term | **Kept, changed** (R2-8) | The core in the budget × tier; no weapon moon to price; T2B prices the best-pick gain (T2E35) |
| **EP17** Jewel kinds | Planet and Moon Jewels I–V in every tier | **Kept, changed** (D264, R2-9) | The same ten; from Tier 2 Stardust G1–G10 beside them (T2E42) |
| **EP18** Recipes | Moon Jewel 4, Planet Jewel 12 | **Superseded** (D264) | Every jewel 5 refined of its grade |
| **EP19** The Observatory | One page in every tier | **Superseded** (D269, D277, D283) | Her Stars tab and the star chart |
| **EP20** Targets and "can upgrade" | Plan every body; a jewel she can set now | **Kept** | T2E18: a jewel or a Stardust she can set now |
| **EP21** Old maps and Star Gems | Deleted, compensated | **Kept** | Done in R2 |
| **EP22** Names and art | The Planet, Prowess, Vigor, Guard; weapon moons by kind | **Kept, changed** (D277, D297, R2-8) | Pixel-art crests as built; no new body, so no new crest; branches draw a vector mark (T2E49) |
| **EP23** Prowess | One offense moon split by class | **Kept, changed** (CV18, CV7, R2-2) | The sixteen Tier 2 classes' splits (T2E45) |
| **EP24** Weapon moons | A moon of five nodes, +4 … +16 × tier on a kind | **Superseded (R2-8)** | Prowess's Full and Split rows, re-spending Prowess's points (T2E27) |
| **EP25** Full or Split | Full one kind; Split two at 0.7 | **Kept, changed** (R2-8) | Prowess's rows, node by node; re-measured on the harness (§4.7) |
| **EP26** Tier 3's second moon | Full + Split serves three weapons | **Superseded (R2-8)** | The Trio row serves her three weapons in Tier 3 (T2E44) |
| **EP27** Weapon moons and the kind cap | Outside the cap | **Kept, changed** (T2G14, R2-8) | The kind rows sit outside T2G14's cap on Orb forms (T2E6) |
| **EP28** Valor and Swiftness | Retired | **Kept** | Never built |
| **EP29** Weapon-moon presets | Split on her two most-used kinds | **Broken**, now fixed | Round 1 read it through `presetKind` (T2E7); the harness shows her most-used kinds aren't her Orb's (§4.7); the kind rows list her top pair first (T2E38) |
| **PP31** The chart's corner | The top-left corner empty for the weapon moons | **Kept** | No new body; the corner stays free (T2E19) |

**Counts:** Kept 13 · Kept, changed 11 · Superseded 5 (EP12, EP24, EP26 by R2-8; EP18, EP19 earlier) · Broken 1 (EP29,
now fixed).

### 3.2 Round 1's calls (T2E1–T2E20)

| Call | Round 1 | Status | Now |
|---|---|---|---|
| **T2E1** The tiers' maps | 22 · 27 · 32 nodes | **Superseded (R2-8)** | 22 in every tier; the weapon moon is a pick (T2E27) |
| **T2E2** Jewels a rank | Three; the Planet 3 · 2 · 1 by tier beside the weapon moons | **Superseded (R2-8)** | Tier 1's rule in every tier: the Planet three a node, a moon one; one Stardust a jewel from Tier 2 (T2E21) |
| **T2E3** A weapon moon's size | Full +4 … +16 × tier; Split 0.7 | **Superseded (R2-8)** | The kind rows' values (T2E27) |
| **T2E4** Its kinds | One of her three weapons'; stale when dropped | **Kept, changed (R2-8)** | On Prowess's kind rows, node by node (T2E27, T2E41) |
| **T2E5** The kinds list | Six rows for the whole moon | **Superseded (R2-8)** | Every node's branch list (T2E24, T2E39) |
| **T2E6** The kind cap | None for the moons | **Kept** | The kind rows sit outside T2G14's cap (§4.7) |
| **T2E7** Presets | Split on `presetKind`'s kind | **Superseded (R2-8)** | T2E37, T2E38 |
| **T2E8** Into the fight | The moons' points join `flat` | **Kept** | The kind rows' points join `flat` (§7) |
| **T2E9** Where they sit | An outer orbit; 360 × 470 · 500 | **Superseded (R2-8)** | No new body: the chart is Tier 1's, 360 × 350, in every tier |
| **T2E10** Figure, colour, crest | A crescent; steel, lavender | **Superseded (R2-8)** | No body to draw; no art packet |
| **T2E11** Its label | "Greatsword · Axe 3/5" | **Superseded (R2-8)** | No weapon moon label |
| **T2E12** The Stars tab | Open n/27; the Kinds row | **Superseded (R2-8)** | The Branch row on every node (T2E39) |
| **T2E13** Set all | The live rule | **Kept** | It sets jewels, then Stardust (T2E40) |
| **T2E14** The window's Stars track | The tier's whole map | **Kept, changed (R2-8)** | The map is 22: 4 · 9 · 13 · 18 · 22 in every tier, open nodes only (T2E43) |
| **T2E15** Her moon | Two nodes, no jewel, × tier | **Kept** | T2E28 |
| **T2E16** The save | `stars.moons` holds the moons' modes | **Superseded (R2-8)** | `stars.picks` and `stars.slotted` (T2E46) |
| **T2E17** The numbers for T2B | This doc's model | **Kept, changed** | The harness's numbers (§4.6, §4.7); T2B re-measures with the rules built |
| **T2E18** Targets and the dot | Plan nodes; the dot a jewel she can set now | **Kept, changed (R2-9)** | A jewel or a Stardust she can set now; a branch raises neither |
| **T2E19** The corner | Free in every tier | **Kept** | |
| **T2E20** Prowess for later classes | A class branch keeps its class's split | **Superseded (R2-2)** | Sixteen Tier 2 classes (T2E45) |

**Counts:** Kept 5 · Kept, changed 4 · Superseded 11 (R2-8 ten, R2-2 one).

### 3.3 The old previews

| Page | Now |
|---|---|
| `tier-rework/previews/stars-maps.html`, `stars-grants.html`, `stars-jewels.html`, `stars-uma.html` | Carried in round 1; their content lives on in the four pages below |
| `extra-stats-budget.html`, `extra-stats-maps.html` (the first round) | Retired |
| Round 1's `extra-stats-chart.html`, `extra-stats-tiers.html`, `extra-stats-weapon-moons.html` | **Rewritten** for branches (the outer orbit and the crescents retire); **`extra-stats-branches.html` is new** (§9) |

## 4. Tier 2 in full

### 4.1 The three steps of a node (T2E21)

| | Unlocking | Slotting | Choosing |
|---|---|---|---|
| **What** | The node opens: it gives its body's default, Tier 1's gift × 1.8 | The node may wear any branch of its list | Which branch it wears |
| **Costs** | Its jewels: the Planet's node three Planet Jewels, a moon's one Moon Jewel, in order, at its level (as Tier 1) | **One Stardust of the node's grade a jewel:** the Planet's node three, a moon's one ([professions](professions.md) T2P30) | Nothing |
| **When** | Once a tier | Once a tier, any time after it opens | Any time outside a fight, any node, slotted or not: an unslotted node holds her pick and wears it once slotted |
| **Undo** | Never (Ascend empties the map) | Never | Always: swap freely |
| **Her moon** | No jewel (it opens with the three moons' II and IV) | Never: no branch | — |
| **Tier 1** | As built | **None** (R2-1) | None |

**Why three steps:** the owner's own sentence, "unlocking the moon is one thing but then … slotting the actual extra
stat … is something else … I craft and unlock the Sun and the moons but then … select and swap freely". Both crafted
steps feed the farm (Stone's two materials, R2-9); the choice is free. An open node never waits on Fungi: unslotted, it
still gives its gift, so a slow second line costs choice, never stats.

### 4.2 The map and its items, an Uma

| Body | Nodes | Ranks · Lv | A node's jewels | A node's Stardust | Tier 2 points I–V |
|---|---|---|---|---|---|
| **Planet** | 5 | odd · 1, 11, 21, 31, 41 | 3 Planet Jewels | 3, grades 1, 3, 5, 7, 9 | 2 · 4 · 7 · 11 · 14 |
| **Prowess · Vigor · Guard** | 15 | even · 6 … 46 | 1 Moon Jewel | 1, grades 2, 4, 6, 8, 10 | 4 · 7 · 11 · 14 · 18 |
| **★ Her moon** | 2 | with the moons' II and IV | none | none | 7 · 14 |
| **An Uma** | **22** | | **30** (15 + 15) | **30** | |

Every rank sets **three jewels and three Stardust** of its grade (T2P7 as professions reads it), so Stone's and Fungi's
work are equal (150 refined each an Uma) and no rank jumps.

### 4.3 One lane a body (T2E22)

| Lane | Bodies | What a branch may move | What it never does |
|---|---|---|---|
| **The core** | Planet | Its four non-offense points between defenses and pools | Touch ATK and M.ATK (they stay on every row) |
| **Offense** | Prowess | Her offense between her split, her shapes and her kinds | Add defense or sustain |
| **Pools and sustain** | Vigor | HP, MP, MP back, life steal | Add offense or defense |
| **Defense** | Guard | DEF, M.DEF, the area guard | Add offense or sustain |

**Why:** the foes are priced on her build's points (EP16, T2B1). Inside a lane a pick only changes **where** a budget
lands, so slotting needs no new foe knob; balance prices one thing, the best-pick gain (§4.6). A lane-crossing row (the
Planet turning its defenses into offense) would hand the back line free damage: on curve she takes 1.6–2.2% of her HP a
fight (§4.6), so she would always cash her defenses in.

### 4.4 The branch lists (T2E23–T2E27)

Each node's value by its numeral; **flat values are Tier 2's** (× 1.8; Tier 3's in §5.2), **percentages are the same in
every tier**. A doubled pair takes **twice the node's points** (2 × its rounded value), so a row never makes or loses a
point.

#### The Planet (T2E23)

| Branch | I | II | III | IV | V | Five nodes | For |
|---|---|---|---|---|---|---|---|
| **All six** (default) | +2 each | +4 | +7 | +11 | +14 | **+38 each, HP +190** | Everyone; the all-rounder |
| **DEF and M.DEF** | ATK, M.ATK +2 · DEF, M.DEF +4 | +4 · +8 | +7 · +14 | +11 · +22 | +14 · +28 | ATK, M.ATK +38 · **DEF, M.DEF +76** | Whoever takes the hits: her guard, a boss's target, the Rift |
| **HP and MP** | ATK, M.ATK +2 · HP +20, MP +4 | +4 · +40, +8 | +7 · +70, +14 | +11 · +110, +22 | +14 · +140, +28 | ATK, M.ATK +38 · **HP +380, MP +76** | Long chains (MP) and bursts (HP) |

#### Prowess (T2E24, T2E27)

| Branch | I | II | III | IV | V | Five nodes | Reads |
|---|---|---|---|---|---|---|---|
| **Offense** (default) | +4 | +7 | +11 | +14 | +18 | **+54**, her class's split | Every hit, and a healer's mends and Barriers (her stat) |
| **Area** | +3% | +6% | +9% | +12% | +15% | **+45%** on her area hits | Sweeps, a volley's splash, a summon's farewell (T2E29) |
| **Multi-hit** | +1.2% | +2.4% | +3.6% | +4.8% | +6% | **+18%** on her multi-hit hits | Scatters, Doubles, a deep Heavy or volley, a Spellblade's lead half (T2E29) |
| **Full · a kind** (a row for each of her three weapons) | +5 | +11 | +16 | +22 | +27 | **+81** on that kind | Every hit of that kind, Limit Breaks included, never a heal (as an Orb) |
| **Split · a pair** (a row for each pair) | +4 each | +8 | +11 | +15 | +19 | **+57** on each of the two | The same, on two kinds |

- **Different proportions** (the owner's ask): Area pays **1.5% a point**, Multi-hit **0.6%**, five to two, because a
  kit's area hits are rarer: 22–31% of a damage class's damage against 30–82% multi-hit (§4.6).
- **Different damage types** (the owner's ask; round 1's weapon moon as a pick): **Full** puts **1.5 × the node's
  points** on one kind (3, 6, 9, 12, 15 at Tier 1's scale, × 1.8), **Split** 0.7 of that on each of two, rounded from the
  Full node. 1.5 rather than the Orb's 2: at 2 the kind rows beat every hybrid's and Summoner's other rows (§4.7).
- **No channel row and no both-shapes row.** "ATK only" or "M.ATK only" beats a hybrid's split for every hybrid (her
  damage leans to her lead channel, so the corner wins a linear trade) and would end the owner's splits (70/30, 80/20).
  An "Area and Multi-hit" row at 0.7 each takes every Summoner case from Area; at 0.6 it splits them: a row for no new
  kind of player.
- **The list is long** (nine rows in Tier 2: Offense, Area, Multi-hit, three Full, three Split), so the sheet groups it
  under three small headers, **Her stat · Her shapes · Her kinds**, her top pair's Split first in its group (T2E38).

#### Vigor (T2E25)

| Branch | I | II | III | IV | V | Five nodes | For |
|---|---|---|---|---|---|---|---|
| **HP and MP** (default) | HP +20, MP +4 | +35, +7 | +55, +11 | +70, +14 | +90, +18 | **HP +270, MP +54** | The all-rounder |
| **HP** | +40 | +70 | +110 | +140 | +180 | **HP +540** | The Uma who would fall: a front-liner in a Duel, a push under the curve |
| **MP** | +8 | +14 | +22 | +28 | +36 | **MP +108** | Short sessions from a Spring; bosses on a full bar |
| **MP back** | +0.1% | +0.3% | +0.4% | +0.5% | +0.7% | **+2.0% of her bar a round** | Long sessions between Springs |
| **Life steal** | 0.2% | 0.4% | 0.6% | 0.8% | 1.0% | **3% of her damage** | A heavy hitter who is hit: the front line's long fights |

MP back is **a fifteenth of a percent a point**, each node rounded to a tenth; life steal **0.1% a point**: "a little MP
recovery here and there, a little life steal here and there".

#### Guard (T2E26)

| Branch | I | II | III | IV | V | Five nodes | For |
|---|---|---|---|---|---|---|---|
| **DEF and M.DEF** (default) | +4 each | +7 | +11 | +14 | +18 | **+54 each** | The all-rounder |
| **DEF** | +8 | +14 | +22 | +28 | +36 | **DEF +108** | The physical front line (the Brawler takes 83% physical) |
| **M.DEF** | +8 | +14 | +22 | +28 | +36 | **M.DEF +108** | The back line against casters (their area moves are magical) |
| **Area guard** | −0.8% | −1.6% | −2.4% | −3.2% | −4% | **−12%** on foes' every-Uma moves | The back line against area moves of both channels |

### 4.5 The new stat kinds: the rules (T2E29–T2E33)

| Kind | What it multiplies | Where | Rules | In the engine today |
|---|---|---|---|---|
| **Area** | Her **area hits**: every hit of a cast that strikes every foe standing (a Sweep's hits, a volley's splash, a summon's farewell) | **Step 4b**, after the Insignias, before statuses: × (1 + Area) | By the cast, not the foes standing: a Sweep on a lone boss still reads it (its ×0.55 already prices him) | **New.** The shapes exist (`target: 'all'`, `splash`, the farewell); no factor reads them |
| **Multi-hit** | Her **multi-hit hits**: every hit of a cast that lands two or more hits on its foe or aims at random foes (a Scatter, a Double, a Greatsword or a volley's tapped hits from depth 3, a Spellblade's lead half, her familiar's hit included) | **Step 4b**, × (1 + Multi-hit) | A hit is area, multi-hit or single, never two: an every-foe cast is area however many hits it has | **New.** No rule reads a cast's hit count |
| **Single** (no branch) | A one-hit cast on one foe, an Attack (a Spellblade's lead Attack is two hits: multi-hit), a healer's skill, a Tier 0's skill | — | Read by Offense and the kind rows | — |
| *Neither* | Limit Breaks (her own or inherited), mends, Barriers, Brave and Faith | — | A Limit Break's power is the Halls' (HV15's 10-hit rail), so no shape touches it; heals read ATK or M.ATK alone | — |
| **Full, Split, Trio** | Flat offense on her hits of the kind, step 1, beside Might and the Orbs | **Step 1** | Every hit whose own kind it is, Limit Breaks included (as an Orb, D264); never a heal, never a weakness | **Built:** `flat` by kind (D264, D266); no engine change |
| **Life steal** | The damage each of her hits deals, **after step 10**, the foe's HP before the hit at most (no overkill) | Heals her by Life steal × that, rounded down, at most her missing HP; one cue a hit ("Life steal +12") | Every hit she deals, both channels, Limit Breaks and farewells included. **Not a mend:** no healing scale, no Rally, never revives, never her healer's | **Built for one channel:** v11's `lifesteal` (per mille, physical only, the Vampire Talisman), refused from v17 (D209); widened to both channels |
| **MP back** | Her bar (`stats.mp`) | At each round's end, with the base regen, one cue, never past her max | Frozen at the fight's start as flat MP a round: round(bar × MP back), at least 1 when set | **Built:** v11's `mpRegen` (flat MP a round, the Spring Amulet), refused from v17, already added beside `rpgBaseMpRegen` at a round's end; re-admitted |
| **Area guard** | A hit she takes from a foe's **every-Uma move** (`target: 'all'`) | **Step 9**, after evasion: × (1 − Area guard) | Both channels; never a single-target move; a guard's intercepted half is single-target | **Half built:** the engine passes `area` for foes' every-Uma moves; v11's per-channel cuts (`guard`, `resist`) were refused from v17; the area cut is new |

**One factor a kind, every source summed (T2E33).** Like the Insignias (T2G15), every source of a kind adds into one
number before it multiplies: Extra Stats today, an accessory form tomorrow if [gear](gear.md)'s tree gives one "by
shape" (R2-7). **Caps on the sum:** Area **+60%**, Multi-hit **+24%**, Life steal **4%**, MP back **+3% of her bar** on top
of the base regen, Area guard **16%**. Each sits about a third above what Extra Stats reaches alone (+45%, +18%, 3%,
+2.0%, 12%; MP back rounded to a whole percent, where 3% made it every caster's pick, §4.6), so it binds only stacking
across systems, as the kind cap binds only stacked Great Orbs (T2G14).

### 4.6 What each is worth, and the viability check (T2E34–T2E36)

**The measure:** each class in her owner party at Tier 2 Lv 50 on curve, only her Uma changed, 8 seeds of every stage at
that level (40 regular fights, 20 sub-bosses, 20 bosses); a mean weighs regular fights twice (D266). **Offense** is
measured (her Prowess taken off her ATK and M.ATK); **the kind rows** are measured flat on her kinds (§4.7); **Area and
Multi-hit** are her measured share of damage in those hits × the rate: a percent on a set of hits scales them exactly
(overkill aside), so this emulates the rule before it is built.

**Her damage by shape** (Tier 2 Lv 50; Tier 3 within 4 points; Tier 2 Lv 30 the same order, fewer Limit Breaks):

| Class | Area | Multi-hit | Single | Limit Breaks | Her kinds, most first |
|---|---|---|---|---|---|
| Brawler | 23.1% | 51.5% | 0% | 25.4% | Lance 49% · Axe 29% · Greatsword 22% |
| Sorcerer | 22.4% | 29.6% | 23.7% | 24.2% | Lightning 39% · Fire 32% · Ice 29% |
| Arms Spellblade | 0% | 81.8% | 0% | 18.2% | Axe 53% · Lightning 28% · Katana 19% |
| Tome Spellblade | 0% | 81.6% | 0% | 18.4% | Ice 51% · Lightning 27% · Katana 22% |
| Arms Summoner | 30.9% | 52.0% | 0% | 17.0% | Bow 61% · Dark 30% · Axe 9% |
| Tome Summoner | 28.9% | 49.5% | 0% | 21.6% | Dark 62% · Bow 31% · Ice 8% |
| Paladin | 0% | 0% | 74.9% | 25.1% | Lance 65% · Greatsword 25% · Light 10% |
| Cleric | 0% | 0% | 78.5% | 21.5% | Light 45% · Lance 29% · Fire 26% |

**Prowess's branches at five nodes** (her damage a turn; the best in bold):

| Class | Offense (measured) | Area +45% | Multi-hit +18% | Her best kind row (§4.7) | Best by fight: regular · sub-boss · boss |
|---|---|---|---|---|---|
| Brawler | **17.5%** | 10.4% (16.6% in regular fights) | 9.3% | Split 10.9% | Offense ×3 |
| Sorcerer | **16.5%** | 10.1% | 5.3% | Split 11.6% | Offense ×3 |
| Arms Spellblade | 10.2% | — | **14.7%** | Split 12.0% | Multi-hit ×3 |
| Tome Spellblade | 10.0% | — | **14.7%** | Split 10.7% | Multi-hit ×3 |
| Arms Summoner | 10.9% | **13.9%** | 9.4% | Split **13.8%** | Area · Split · Split |
| Tome Summoner | 9.8% | **13.0%** | 8.9% | Split 12.6% | Area · Split · Split |
| Paladin | **13.2%** + her mends | — | — | Full 13.1% | Offense ×3 (Full wins her sub-bosses' damage, not her mends) |
| Cleric | **12.6%** + her mends | — | — | Split 13.6% | Offense ×3 (Split wins two of her damage cases, not her mends) |

- **Every branch is someone's best and none is everyone's:** of 24 cases Offense wins 12 (the pure classes' six and the
  healers' six, whose mends read it), Multi-hit 6, Split 4, Area 2. No row wins over half (D266's rule). The Brawler's
  regular fights are the closest call (Offense 17.7% · Area 16.6%). At Tier 3 Lv 50 the same rows win.
- **The hybrids' lift (T2E36):** Prowess at her split is worth 9.8–10.9% to a hybrid and 16.5–17.5% to a pure class,
  because a split leaves a third of the points on the channel her other half reads. At her best branch it is **13.0–17.5%
  for every damage class**: slotting closes more than half that gap, +3.0 to +4.7 points of a hybrid's damage. It is the
  only power slotting adds, and T2B measures the mirrors with it (§6).
- **Healers:** no shape reaches their skills, so Offense is theirs (it lifts their mends); a battle healer whose skills
  gain shapes (R2-3) reads the same rule and T2B re-measures her.

**Vigor and Guard.** On curve nobody falls (her lowest HP 87–99% a fight), so HP's worth is insurance the harness can't
show; MP is what binds once fights chain. Defense measured as damage taken a fight:

| Class | Taken a fight (share of HP) | Area moves' share · physical share | Guard as built cuts | DEF ×2 | M.DEF ×2 | Area guard −12% | Life steal 3% heals a fight |
|---|---|---|---|---|---|---|---|
| Brawler (front) | 186 (7.3%) | 12% · 83% | 3.6% | **5.5%** | 3.1% | 1.4% | 90 (48% of it) |
| Sorcerer | 37 (1.7%) | ~95%* · 51% | 5.7% | 0.4% | **12.3%** | ≈11.4% | 33 |
| Arms Spellblade · Tome Summoner | 39 (1.7%) | ~95%* · 51% | 7.6% | 1.0–1.1% | **11.7%** | ≈11.4% | 30 |
| Paladin | 40 (1.7%) | ~95%* · 50% | 8.5% | 0% | **11.3%** | ≈11.4% | 17 |
| Tome Spellblade · Arms Summoner · Cleric | 45–50 (2.0–2.2%) | ~95%* · 51–52% | 4.6–8.9% | 0.8–2.2% | **8.5–12.1%** | ≈11.4% | 18–34 |

\* The back line takes almost nothing in regular fights; in sub-boss and boss fights 86–100% of it is foes' every-Uma
moves, today nearly all magical. So **DEF** is the front line's, **M.DEF** and **Area guard** tie for the back line (Area
guard wins where area moves mix channels, the Rift's fronts), and the default is the all-rounder.

**MP in a chain** (12 stages back to back, MP carried, no Spring; her damage a turn against the default):

| Class (bar) | HP and MP | HP | MP | MP back +3% | MP back +1.5% | Attacks for want of MP |
|---|---|---|---|---|---|---|
| Brawler (367) | 889 | −8% | **+9%** | +15% | +2% | 43% of her acts |
| Sorcerer (505) | 1,260 | −8% | +7% | **+20%** | +4% | 35% (7% with MP back +3%) |
| Spellblades (423) | 1,182 · 1,233 | −9 to −11% | +6% | +13% | +2–3% | 5% |
| Summoners (423) | 1,226 · 1,213 | −12 to −13% | +6–8% | +12% | +5–6% | 3–4% |
| Healers (505) | 896 · 792 | 0% | 0% | 0% | 0% | none: 66–71% of the bar left |

At 3% MP back beat MP ×2 everywhere (MP ×2 would be nobody's best); at 1.5% it lost everywhere in 12 stages. **At 2.0%
the two tie over 12 stages** (interpolated): MP ×2 wins a short session from a Spring, MP back a long one, and Springs are
five a continent on a two-hour recharge, so both are real. **Life steal 3%** heals the front line about what it gives up
in a boss fight: the Brawler deals 11,829 there and takes 285, so it heals up to 285 against the default's 270 HP.

### 4.7 The weapon moon as a pick: the kind rows, measured (T2E27, T2E38)

The harness measured every Full and Split on each class's three kinds at Tier 2 Lv 50 at round 1's sizes (Full +90,
Split +63 each); the kind rows' sizes (+81, +57) scale them by 0.9. The [weapon moons page](previews/extra-stats-weapon-moons.html)
has every pick by fight.

| Class | Round 1's preset (Split on `presetKind` + its half) | Full on `presetKind` | **Her best pick, +90 / +63** | **As a kind row, +81 / +57** | Her top pair (the list's first Split) |
|---|---|---|---|---|---|
| Brawler | Split Greatsword + Axe 7.6% | Greatsword 5.4% | Split Greatsword + Lance 12.0% | 10.9% | Lance + Axe (11.9% → 10.8%) |
| Sorcerer | Split Fire + Ice 10.2% | Fire 8.4% | Split Fire + Lightning 12.8% | 11.6% | Lightning + Fire |
| Arms Spellblade | Split Katana + Axe 11.7% | Katana 7.0% | Split Axe + Lightning 13.3% | 12.0% | Axe + Lightning |
| Tome Spellblade | Split Lightning + Ice 11.8% | Lightning 7.3% | Split Lightning + Ice 11.8% | 10.7% | Ice + Lightning |
| Arms Summoner | Split Bow + Axe 12.2% | Bow 12.2% | Split Bow + Dark 15.2% | 13.8% | Bow + Dark |
| Tome Summoner | Split Dark + Ice 10.1% | Dark 12.3% | Split Dark + Bow 13.9% | 12.6% | Dark + Bow |
| Paladin | Split Lance + Greatsword 14.0% | Lance 14.6% | Full Lance 14.6% (Split Lance + Light 14.4%) | 13.1% | Lance (Full) |
| Cleric | Split Light + Fire 12.4% | Light 11.0% | Split Light + Lance 15.0% | 13.6% | Light + Lance |

- **Split wins when her two top kinds are close; Full when her top kind deals over about 2⅓ times her second** (EP25's
  rule, measured): the Paladin's Lance (65% against 25%). A Split wins 7 of 8 classes.
- **Her Orb's kind is not her top kind** for four classes (the Brawler's Lance, both Spellblades' Axe and Ice; the
  Summoners' second is the volley twin, not the sweep), so the list orders her kinds by her kit's damage (T2E38).
- **As a re-spend of Prowess** the kind rows beat Offense only where Offense is weak: the Summoners' sub-bosses and
  bosses, and the healers' damage. That is the lane rule at work (T2E22): round 1's weapon moon added +11.8–15.2% on top of
  the map; as a pick it adds nothing to the budget and only competes.
- **No kind cap** (T2E6 kept): the most on one kind is three Orb forms and five Full nodes, under the engine's 1,000.

### 4.8 Presets for the sixteen classes (T2E37, T2E38)

The Standard preset (D263, Class tab footer) sets her weapons, her accessory slots and, from Tier 2, **every node's
branch**. A preset is a good all-round set, not the best in any one fight (D266): it keeps the Planet's, Vigor's and
Guard's defaults (the all-rounders, and HP for the fights the harness can't show) and slots Prowess, whose best is clear
from her kit.

| Tier 2 class ([classes](classes.md) T2C31–T2C64: Keeper · Expander) | Prowess, all five nodes | Why | Planet · Vigor · Guard |
|---|---|---|---|
| **Berserker** (the Brawler's Keeper, Momentum) | Offense | Pure physical; Momentum is a status (step 5) | Defaults |
| **Spellfist** (the Brawler's Expander: her Tome hits on ATK) | Offense, all to ATK | Every hit reads ATK | Defaults |
| **Archmage** (the Sorcerer's Keeper, Momentum) | Offense | Pure magical | Defaults |
| **Battlemage** (the Sorcerer's Expander: her Arm hits on M.ATK) | Offense, all to M.ATK | Every hit reads M.ATK | Defaults |
| **Blademaster · Runeblade** (the Spellblades' Keepers: the extra hit on both halves) | Multi-hit | Both halves land as multi-hits now, more than the 82% measured | Defaults |
| **Sentinel · Enchanter** (the Spellblades' Expanders: support, a Barrier each act) | Multi-hit | Her pair's lead half still lands its extra hit | Defaults |
| **Warlord · Invoker** (the Summoners' Keepers: both summons farewell) | Area (Split on her top pair wins her sub-bosses and bosses) | Two farewells an act raise her area share above the 29–31% measured | Defaults |
| **Druid · Shaman** (the Summoners' Expanders: support, the farewell mends) | Area | Her farewells and volleys' splashes | Defaults |
| **Guardian · Bishop** (the healers' Keepers) | Offense | Her mends and Barriers read it | Defaults |
| **Templar · Exorcist** (the healers' Expanders, battle healers) | Offense | The same, at ×0.6 power and ×0.7 mends | Defaults |

- **Her top pair** (T2E38) is her kit's damage order, which T2B prints for each class's preset weapons on the harness and
  the preset table stores (as `presetKind` stores the Orb's today). A Keeper wears her parent's weapons, so her order is
  the parent's (§4.7); an Expander's comes with [classes](classes.md)' preset weapons.
- **Tier 3** keeps the same rows; Trio is no preset's (it ties Split for even kits, §5.3).
- **The Branches sheet** (T2E39) also sets "Tier 1's gifts" on every node in one tap.

### 4.9 The Stars tab with branches (T2E39, T2E40, T2E49)

| Part | Tier 2 |
|---|---|
| **First row** | As built: "Extra Stats · Open 15/22 · 3 ready", **Set all**, the (i), which adds: "A jewel opens a node; a Stardust a jewel slots it; then its branch swaps free" |
| **The chart** | **Tier 1's, star for star, 360 × 350 in every tier** (no new body). **A star whose branch isn't its body's default carries a small white diamond at its lower right**, inside its 44 pt target (no text: nothing under 11 px, D269). An open, unslotted star keeps its Ready dot while a Stardust for it is held |
| **The totals** | The six cells (every flat branch summed), her moon's ★ line, **a kinds line** ("Lance +27 · Axe +27") when a kind row is worn, then **a branch line** of the percent branches ("Area +18% · MP back +0.8% · Life steal 0.6%") |
| **Branches ›** | A row under the totals opening one sheet: each body with its picks as chips ("Prowess · Area ×3 · Offense ×2"), then two one-tap rows, **Her preset** ("Brawler Keeper") and **Tier 1's gifts**, each setting every node at once |
| **A node's sheet** | As built (the strip, what it gives, before → after, the jewel, Set), plus a **Branch row** under the value: "Branch · Area +9% ›", and its Stardust line ("Stardust G6 ×1 · 4 held"). **Set** sets whichever step is next: the jewels, then the Stardust; an unslotted open node reads "Gives Tier 1's gift until slotted". A percent branch shows the hits it reads: "Area hits +9% · Sweeps, splashes, farewells" |
| **The branch list** | D266's one-tap list under three headers (Prowess: Her stat · Her shapes · Her kinds): a row a branch with this node's value and its "for" line; the worn one ticked; **a tap wears it and the sheet returns to the node** (D278: one sheet, never stacked). Its footer: **"Wear on every Prowess node"**, one more tap |
| **Set all** (T2E40) | Its live rule for jewels (each jewel to the body furthest behind, map order on a tie), then **every Stardust that fits an open node**, one line each: "Planet Jewel III ×3 → Planet III · +7 · all six", "Stardust G6 → Prowess III · Area +9%" |
| **The dot** | A jewel or a Stardust she can set now. A branch never raises it: a free setting is never a nag (D274) |
| **Details** (D279) | The kind rows' flat on each weapon's row; the percent branches on one line under the stat rows |

### 4.10 Her moon (T2E28)

Two nodes, no jewel, × tier (T2U8): node I opens with the three moons' II (Lv 16), node II with their IV (Lv 36); I
+7 points on her knack's stat (Fleet's 2.4% evasion and Gritty's start of 1 flat), II +14 on her calling's root. **It
takes no branch and no Stardust:** her template is read from her racing profile, never picked (D247, D274), and her moon
is the one body no two Umas share. Its sheet has no Branch row.

### 4.11 Stone's two materials (T2E42)

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Planet Jewels, Moon Jewels an Uma** | 15 · 15 | 15 · 15 | 15 · 15 |
| **Stardust an Uma** (one a jewel, its grade) | — | **30** (15 for the Planet's nodes at grades 1–9, 15 for the moons' at 2–10) | 30 |
| **Refined, an Uma** | 150 cut stones | **150 cut stones + 150 Fungi powders** | the same |

- **Aligned with [professions](professions.md) T2P30:** Stardust G1–G10, 5 powders of its grade, made at the Lapidary
  (Stardust Crafting); one Stardust a jewel slots the node's branch, once; her moon takes neither. Every rank sets three
  jewels and three Stardust, so Stone and Fungi each do 30 refined a rank on two Umas (T2P39's rule).
- **No swap costs anything.** The owner's "select and swap freely": the Stardust slots the node, not one branch, so a
  swap is a tap.
- **This replaces this doc's earlier draft** (Moon Jewels from the second material): professions' Stardust says "the
  jewel unlocks, the Stardust slots", which is the owner's sentence in items.

### 4.12 The window's Stars track (T2E43)

The track counts **open nodes**, the crafted part, never a node's branch ([progression](progression.md) T2W24): every
node to I, II, III and IV, then the whole map, **4 · 9 · 13 · 18 · 22** in every tier, as Tier 1. **Branches add no step:**
a step is earned (CO2), and a free tap earns nothing. Slotting (the Stardust) is crafted but reads nowhere on the board:
counting it would make Stars ten steps of one system; progression owns the board (R2-10).

## 5. Tier 3 in full (T2E44)

### 5.1 The map

The same 22 nodes, three jewels a rank and one Stardust a jewel; × 2.6. **Tier 3 deepens Tier 2 with one row**, Prowess's
**Trio**, serving all three of her weapons (EP26's aim, now a pick); every other list is Tier 2's, the percentages the same.

### 5.2 Tier 3's flat values

| Branch | I | II | III | IV | V | Five nodes |
|---|---|---|---|---|---|---|
| Planet · All six | +3 each | +5 | +10 | +16 | +21 | +55 each, HP +275 |
| Planet · DEF and M.DEF | ATK, M.ATK +3 · +6 | +5 · +10 | +10 · +20 | +16 · +32 | +21 · +42 | +55 · **DEF, M.DEF +110** |
| Planet · HP and MP | ATK, M.ATK +3 · HP +30, MP +6 | +5 · +50, +10 | +10 · +100, +20 | +16 · +160, +32 | +21 · +210, +42 | +55 · **HP +550, MP +110** |
| Prowess · Offense | +5 | +10 | +16 | +21 | +26 | +78, her split |
| Prowess · Full | +8 | +16 | +23 | +31 | +39 | +117 on one kind |
| Prowess · Split, each | +6 | +11 | +16 | +22 | +27 | +82 on each of two |
| **Prowess · Trio, each** | +4 | +8 | +12 | +16 | +20 | **+60 on each of her three** |
| Vigor · HP and MP | HP +25, MP +5 | +50, +10 | +80, +16 | +105, +21 | +130, +26 | HP +390, MP +78 |
| Vigor · HP | +50 | +100 | +160 | +210 | +260 | HP +780 |
| Vigor · MP | +10 | +20 | +32 | +42 | +52 | MP +156 |
| Guard · DEF and M.DEF | +5 each | +10 | +16 | +21 | +26 | +78 each |
| Guard · DEF, or M.DEF | +10 | +20 | +32 | +42 | +52 | +156 |

Area, Multi-hit, MP back, Life steal and Area guard are §4.4's in Tier 3 too: the harness gives the same shares at Tier 3
Lv 50 (within 4 points) and the same winners (Offense 15.3–15.4% for the pure classes, 11.6–12.2% the healers).

### 5.3 Trio

**Half of the node's Full on each of her three kinds**, rounded from the Full node (1.5 of Full in all, against Split's
1.4). Estimated from the Tier 2 picks (a flat on a kind scales linearly): Trio **ties** Split for an even kit (the
Sorcerer 12.6% against 12.8%, the Tome Spellblade 11.8% against 11.8%) and **wins** the Arms Spellblade's boss fights
(13.7% against 13.6%); it loses wherever two kinds carry her (the Summoners, the Paladin). It is the even kit's row, and
no preset's.

## 6. Provides and assumes

| Doc | T2E provides | T2E assumes |
|---|---|---|
| **[classes](classes.md)** (R2-2–R2-5) | The shapes' rule reads each hit's cast, so the sixteen classes need nothing from the map; Prowess's splits for the sixteen (T2E45, the Spellfist all to ATK and the Battlemage all to M.ATK, as T2C36 reads it); presets by kit (T2E37) | **Aligned with T2C31–T2C64:** Keepers on their parent's preset weapons and split; Momentum (the Berserker's and the Archmage's self-buff) a status at step 5, so it multiplies Area and Multi-hit and never stacks into them; the Blademaster's and Runeblade's extra hit on both halves (more multi-hit), the Warlord's and Invoker's two farewells (more area); the supports' Barrier and the Druid's and Shaman's farewell mends read ATK or M.ATK (no shape); the battle healers keep one-foe skills. T2C's note that MP back and life steal suit the supports and battle healers stands: both are on Vigor's list, and the preset leaves Vigor at its gift until T2B measures their MP. No branch adds a status or a heal |
| **[gear](gear.md)** (R2-6, R2-7) | One factor a kind summed over every source, with its cap (T2E33): an accessory form "by shape" adds into Area or Multi-hit; the kind rows outside the kind cap (T2E6) | Weapon types set at promotion; three accessory slots with a tree; Might × tier |
| **[professions](professions.md)** (R2-9) | Stone's demand an Uma in every tier: 30 jewels (150 cut stones) and, from Tier 2, 30 Stardust (150 Fungi powders), three of each a rank; her moon neither; no swap costs an item (T2E42) | **Aligned with T2P27–T2P30:** Fungi → Stardust G1–G10, 5 powders each, one a jewel, slotting the node once |
| **[balance](balance.md)** (R2-11, R2-12) | The lanes (T2E22): slotting moves no budget; **no weapon moon**, so the toolbox term drops round 1's weapon-moon piece (1.05 · 1.15 · 1.23); the measured shares, branch worths and winners (§4.6, §4.7); the hybrids' lift (T2E36); the caps (T2E33) | T2B re-measures with the rules built: the best-pick gain in the party value bands, the rates against the sixteen kits, MP back on chains and the Rift |
| **[templates](templates.md)** | Her moon takes no branch and no Stardust; its place on the chart (T2E28) | T2U8: two nodes, no jewel, × tier |
| **[progression](progression.md)** (R2-5, R2-10) | **Aligned with T2W24:** the map is 22 in every tier, the Stars track 4 · 9 · 13 · 18 · 22, open nodes only, never a branch or a Stardust; branches carry on Ascend as settings, the map empties (T2E41, T2E43) | One Uma, one tier; settings carry, progress restarts |

## 7. Save and engine

| Part | What would change, roughly |
|---|---|
| **Save** (Tier 2's toolbox save, v39 in T2W15) | `OwnedUma.stars` gains, in Tier 2 and 3 worlds only, **`picks?: Record<nodeId, branchId>`** (a default never stored) and **`slotted?: string[]`** (nodes whose Stardust is set; each must be open). Branch ids: `planet` `six` · `defenses` · `pools`; `prowess` `offense` · `area` · `multi` · `full:<kind>` · `split:<kind>+<kind>` · `trio` (Tier 3); `vigor` `hp-mp` · `hp` · `mp` · `mp-back` · `life-steal`; `guard` `def-mdef` · `def` · `mdef` · `area-guard`. Strict: a branch on its body's list, kinds among the ten (a kind she doesn't slot is kept, stale: it gives nothing and says so). A pick on an unslotted node is kept and waits. `stars.moons` (reserved empty since v28) retires. **No migration:** no Uma has a pick or a Stardust, and an unslotted node gives Tier 1's gift |
| **Domain** | `planet.ts`: the lists by body; `branchPoints(id, pick, classId, tier)` beside `nodePoints`; `mapPoints` reads a slotted node's pick for the flat ones and her kinds' flat; `mapShares(open, slotted, picks)` for the percent ones (each summed and capped). `setJewel` gains `setStardust` (one of the node's grade a jewel, the node open); Set all's plan both; the dot both |
| **The fight** (Tier 2's engine, v22 in T2W15) | `BattleAlly` gains `area` and `multi` (per mille, ≤ 600 and 240) read at step 4b by the hit's cast; `lifesteal` re-admitted (per mille, ≤ 40) on both channels; `mpRegen` re-admitted (flat MP a round, frozen from her bar, ≤ 3% of it); `areaGuard` (per mille, ≤ 160) read at step 9 on `area` moves. Flat branches freeze into `stats` and `flat`, as D264's slots. Older fights replay unchanged |
| **Web** | `NodeSheet` gains the Branch row, its grouped one-tap list (D266's pattern, `AccessorySheet`'s list) and the Stardust step; `star-chart.ts` the diamond mark (its test adds "marks inside their star's target"); `StarsPanel` the kinds and branch lines and the Branches sheet; Details the branch line. **The chart's table and test are untouched** |
| **Art** | None: the diamond is a vector mark; round 1's crescent-blade crest retires unmade. Stardust's icon is professions' (an unused gems-atlas row) |
| **Windows** | None: `rpg/windows.ts` counts open nodes as today |

## 8. Pacing

| Lv (in the tier) | 1 | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 |
|---|---|---|---|---|---|---|---|---|---|---|
| Opens (a jewel) and slots (a Stardust) | Planet I | Moons I | Planet II | Moons II, her moon I | Planet III | Moons III | Planet IV | Moons IV, her moon II | Planet V | Moons V |
| Prowess's Area, every node on it | — | +3% | +3% | +9% | +9% | +18% | +18% | +30% | +30% | **+45%** |
| Vigor's MP back, every node on it | — | +0.1% | +0.1% | +0.4% | +0.4% | +0.8% | +0.8% | +1.3% | +1.3% | **+2.0%** |

- **Choosing costs no time;** slotting runs on Fungi as unlocking runs on Stone: 30 of each an Uma, about 40 h at each
  Stone place and each Fungi job at Craft Lv 25 (professions' table). An open node never waits on Fungi: it gives its
  gift until slotted.
- **Percent branches grow as the flat ones do**, node by node: a Tier 2 Uma at Lv 26 with Area on Prowess I–III has +18%
  where Offense would give +22 ATK. Measured at Tier 2 Lv 30, the same rows win (the Spellblades' Multi-hit 6.5% against
  Offense 5.5%; the Summoners' Area and Offense level at 5.4–5.7%; the pure classes' Offense 9.7–10.9%).

## 9. Previews

| Page | Shows |
|---|---|
| [extra-stats-chart.html](previews/extra-stats-chart.html) | The live chart in Tiers 1, 2 and 3 (one table, 22 stars); a phone at 390 × 844 and 375 × 667 playing the rules: a node's sheet with its Branch row and Stardust, the grouped one-tap list, "Wear on every node", the diamond marks, the totals' kinds and branch lines, the Branches sheet (her preset, Tier 1's gifts), Set all with Stardust; the live test's checks plus the marks' |
| [extra-stats-tiers.html](previews/extra-stats-tiers.html) | Every branch's value node by node in Tiers 2 and 3; three jewels and three Stardust a rank; Stone's and Fungi's demand; the Stars track |
| [extra-stats-branches.html](previews/extra-stats-branches.html) | The three steps of a node; the lanes; each body's list; the new kinds' rules in the damage stack and which exist in the engine; the harness's shares and winners by class and fight; Vigor and Guard measured; MP in a chain; presets for the sixteen classes |
| [extra-stats-weapon-moons.html](previews/extra-stats-weapon-moons.html) | Round 1's weapon moon as a pick: every Full and Split measured by fight, her kit's kinds against her Orb's, the kind rows against Prowess's other rows, Tier 3's Trio |

## 10. Decisions

Round 1's calls keep their ids and rows below with their status; round 2's are T2E21–T2E49.

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **T2E1** The tiers' maps | **Superseded (R2-8)** by T2E27: 22 nodes in every tier | 27 · 32 with weapon moons | The weapon moon is a pick |
| **T2E2** Jewels a rank | **Superseded (R2-8)** by T2E21: Tier 1's rule in every tier (the Planet three a node), one Stardust a jewel from Tier 2 | The Planet sharing its rank | No new body to pay for |
| **T2E3** A weapon moon's size | **Superseded (R2-8)** by T2E27's kind rows | — | |
| **T2E4** Its kinds | **Kept, changed (R2-8):** one of her three weapons' kinds, on Prowess's kind rows, node by node; stale when dropped | Any of the ten; a group | One rule with the Orb |
| **T2E5** The kinds list | **Superseded (R2-8)** by T2E24 and T2E39 | — | Every node's own list |
| **T2E6** The kind cap | **Kept:** none for the kind rows; Orb forms under T2G14 | One cap on everything | Bounded by slots and nodes |
| **T2E7** Presets | **Superseded (R2-8)** by T2E37 and T2E38 | — | Her Orb's kind isn't her top kind (§4.7) |
| **T2E8** Into the fight | **Kept:** the kind rows' points join `flat` | A field of their own | D264's slots shipped so |
| **T2E9** Where they sit | **Superseded (R2-8):** no new body; the chart is Tier 1's in every tier | An outer orbit | |
| **T2E10** Figure, colour, crest | **Superseded (R2-8):** no body, no crest | — | One art packet fewer |
| **T2E11** Its label | **Superseded (R2-8)** | — | |
| **T2E12** The Stars tab | **Superseded (R2-8)** by T2E39 | — | The Kinds row becomes every node's Branch row |
| **T2E13** Set all | **Kept:** its live rule for jewels; T2E40 adds Stardust | Weapon moons first | No new rule |
| **T2E14** The window's Stars track | **Kept, changed (R2-8):** the tier's whole map, now 22; T2E43 | — | "The whole map" means it |
| **T2E15** Her moon | **Kept:** two nodes, no jewel, × tier; T2E28 | A growing moon | EP14 |
| **T2E16** The save | **Superseded (R2-8)** by T2E46 | — | Picks and slots node by node |
| **T2E17** The numbers for T2B | **Kept, changed:** the harness's numbers (§4.6, §4.7) are T2B's input; its simulation with the rules built replaces them | Fix values here | One owner for balance |
| **T2E18** Targets and the dot | **Kept, changed (R2-9):** targets plan jewels and Stardust; the dot is a jewel or a Stardust she can set now; a branch raises neither | A dot for a default branch | A free setting never nags |
| **T2E19** The corner | **Kept:** free in every tier | Fill it | A seam for later |
| **T2E20** Prowess for later classes | **Superseded (R2-2)** by T2E45 | — | Sixteen classes, not branches |
| **T2E21** A node's three steps | **Unlocking: its jewels, in order, three a rank, as Tier 1 (an open node gives Tier 1's gift); slotting, from Tier 2: one Stardust of its grade a jewel, once; choosing: any branch of its list, any time outside a fight, free, set in advance on an unslotted node; none in Tier 1** | Slotting free (no second item); one Stardust a node; a branch that costs an item to change | The owner's sentence, step by step; professions' T2P30; an open node never waits on Fungi |
| **T2E22** One lane a body | **A branch re-spends its own body's gift inside its purpose (the core, offense, pools and sustain, defense); none turns defense into offense or back** | Free re-spending across the map | The foes are priced on the budget (T2B1); a lane-crossing row would let the back line, hit for 2% of her HP a fight, cash its defenses into damage |
| **T2E23** The Planet's list | **All six (default) · DEF and M.DEF · HP and MP: ATK and M.ATK stay on every row; the doubled pair takes twice the node's points, the other pair none** | An offense row; Speed or Limit rows (EP8) | Keeps the Sun's offense fixed (T2E22); the owner found evasion "does nothing" (EP8) |
| **T2E24** Prowess's list | **Offense (default, her split) · Area +1.5% a point · Multi-hit +0.6% a point (+45% and +18% at five nodes) · Full and Split (T2E27); grouped Her stat · Her shapes · Her kinds; no channel row, no both-shapes row** | A channel row (beats every hybrid's split); one rate for both shapes; a both row at 0.7 (takes Area's every case) | The owner's "AoE and multi-hit in different proportions" and "different damage types"; each row someone's best (§4.6) |
| **T2E25** Vigor's list | **HP and MP (default) · HP (twice) · MP (twice) · MP back (a fifteenth of a % a point, +2.0% at five) · Life steal (0.1% a point, 3% at five)** | MP back at 3% (beats MP everywhere) or 1.5% (loses everywhere in 12 stages); life steal at 5% | The owner's "a little MP recovery, a little life steal"; MP back ties MP over 12 stages |
| **T2E26** Guard's list | **DEF and M.DEF (default) · DEF (twice) · M.DEF (twice) · Area guard −0.4% a point (−12% at five)** | A starting Barrier (the Clean break Flourish's, her template's); a single-target cut | DEF the front's, M.DEF and Area guard the back line's (§4.6); a Barrier would dilute a template piece |
| **T2E27** The weapon moon | **Becomes Prowess's kind rows: Full, 1.5 × the node's points on one of her three kinds; Split, 0.7 of that on each of a pair; node by node. The map stays 22 in every tier** | Keep it a body (27 · 32 nodes, +11.8–15.2% on top of the map, the Planet sharing its rank, a crest and an outer orbit); the Orb's 2× (the kind rows would beat the hybrids' other rows) | The owner's round 2 asks for picks on "the Sun and the moons"; progression (T2W24) and professions (T2P7) assume it; it keeps the guardrail's one budget (R2-11) and the chart, jewels and windows as built |
| **T2E28** Her moon | **No branch, no jewel, no Stardust; its sheet has no Branch row** | Picks among her template's readings | Her moon is the one body no two Umas share (T2U8, D274) |
| **T2E29** Area and Multi-hit | **By the hit's cast: area = a cast on every foe (a Sweep, a splash, a farewell); multi-hit = two or more hits on its foe or random foes (her familiar's hit included); one or the other, never both; step 4b after the Insignias; Limit Breaks and heals read neither** | By the foes standing; Limit Breaks included | A cast's shape is fixed and on its sheet; Limit Breaks are the Halls' budget (HV15) |
| **T2E30** Life steal | **After step 10, her share of each hit's damage (no overkill), rounded down, at most her missing HP; both channels; every hit she deals, Limit Breaks and farewells included; not a mend** | Physical only (v11's); her Attacks only | One rule a player can read; never the healer's job |
| **T2E31** MP back | **At each round's end with the base regen: her bar × the share, frozen at the fight's start as flat MP a round (v11's `mpRegen` re-admitted)** | A share of MP spent; MP at a fight's end | Reuses a built rule and cue |
| **T2E32** Area guard | **On a foe's every-Uma move, her hit × (1 − the share) at step 9, after evasion; both channels** | A cut on all hits (v11's per channel) | Reads the flag the engine already passes |
| **T2E33** Caps | **One factor a kind, every source summed: Area ≤ +60%, Multi-hit ≤ +24%, Life steal ≤ 4%, MP back ≤ +3% of her bar beside the base regen, Area guard ≤ 16%** | No cap; a cap per source | About a third above Extra Stats alone: binds only stacking across systems (as T2G14) |
| **T2E34** Values by tier | **Flat branches × 1.8 and × 2.6 (a doubled pair at twice the node's rounded points; Split and Trio rounded from the Full node); percent branches the same in every tier** | Percentages × tier | SB1: the same share in every tier; measured, Tier 3's shares within 4 points of Tier 2's |
| **T2E35** Viability | **Measured on the harness (§4.6): every branch someone's best, none everyone's, none over half: Offense 12 of 24 cases (the healers' six by their mends), Multi-hit 6, Split 4, Area 2; T2B re-measures with the rules built** | Tune Area up to win the Brawler's regular fights (it lifts the Summoners past the pure classes) | D266's idea; the healers' mends read Offense |
| **T2E36** The hybrids' lift | **Accept it: at her best branch Prowess is worth 13.0–17.5% to every damage class (a hybrid's split gave 9.8–10.9%); T2B checks the mirrors and the party value bands with it** | Rates that keep a hybrid's best at her split's worth | The only power slotting adds; it narrows a gap rather than opening one; R2-11's bands are T2B's to hold |
| **T2E37** Presets for the sixteen | **The preset sets every node: Prowess by her kit (Offense for the Berserker, Spellfist, Archmage, Battlemage and the four healers; Multi-hit for the Blademaster, Runeblade, Sentinel and Enchanter; Area for the Warlord, Invoker, Druid and Shaman), the Planet, Vigor and Guard at their defaults** | Presets on every body's measured best (MP for every damage class); the Summoners on Split | A good all-round set (D266): HP stays for the fights the harness can't show; Area wins the Summoners' most common fights |
| **T2E38** The kind rows' order | **Her kinds by her kit's damage, her top pair's Split first (Full first when her top kind deals over 2⅓ times her second: the Paladin's Lance); T2B prints each class's order and the preset table stores it** | Her weapons' slot order; `presetKind` | Her Orb's kind isn't her top kind for four classes (§4.7) |
| **T2E39** The Stars tab | **A Branch row and a Stardust line on every node's sheet (not her moon's), a grouped one-tap list with "Wear on every {body} node"; the totals' kinds and branch lines; a Branches sheet with her preset and Tier 1's gifts; a diamond on a star with a non-default branch** | A separate Branches tab; picks on the chart by long-press | One tab, one sheet kind (D269, D278); the chart stays a map |
| **T2E40** Set all | **Jewels by its live rule, then every Stardust that fits an open node; each line names the branch** | Stardust first; Set all choosing branches | Unlocking, slotting and choosing stay three layers |
| **T2E41** Whose branches | **Hers, not her class's: one set an Uma; a class switch keeps them (a stale kind gives nothing and says so); they carry on Ascend by node id, the map and its Stardust emptied** | One set a class (16 × 20 picks to keep) | As her accessory families carry (D283); the preset rewrites them in one tap |
| **T2E42** Stone's two materials | **Aligned with T2P30: 30 jewels (cut stones) and, from Tier 2, 30 Stardust (Fungi powders) an Uma, three of each a rank; her moon neither; no swap costs an item** | This doc's first draft (Moon Jewels from the second material); Stardust a node (Fungi 100 an Uma) | Professions' rule is the owner's "unlock … then slot" in items, and keeps Stone and Fungi at 30 a rank |
| **T2E43** The window's Stars track | **Counts open nodes, 4 · 9 · 13 · 18 · 22 in every tier; never a branch or a Stardust (T2W24)** | A step for slotted or picked nodes | A step is earned; a tap isn't; Stars stays one track |
| **T2E44** Tier 3 | **× 2.6 and one new row, Prowess's Trio (half of Full on each of her three kinds); every other list Tier 2's** | A second weapon moon (EP26); a new row on every list | R2-1: Tier 3 deepens Tier 2; Trio is EP26's "all three weapon types" as a pick |
| **T2E45** Prowess for the sixteen classes | **A Keeper keeps her parent's split; the Spellfist 100/0 and the Battlemage 0/100 (everything on her own stat, T2C36); the Sentinel, Enchanter, Druid, Shaman, Templar and Exorcist their parent's** | A split by slots | Every Tier 1 split is the owner's number |
| **T2E46** The save | **`stars.picks` (node → branch, defaults never stored) and `stars.slotted` (nodes with their Stardust), Tier 2 and 3 worlds only; `stars.moons` retires; no migration** | Store every node; one pick a body | An unslotted node is today's map |
| **T2E47** The engine | **At Tier 2's engine (v22): `area`, `multi` (step 4b), `lifesteal` on both channels, `mpRegen` re-admitted, `areaGuard` (step 9); flat and kind branches as frozen stats and `flat`** | New fields for the flat branches too | Two of five rules are built; flat ones need nothing |
| **T2E48** Names | **All six, DEF and M.DEF, HP and MP, Offense, Area, Multi-hit, Full, Split, Trio, HP, MP, MP back, Life steal, DEF, M.DEF, Area guard, Branch, Branches, Her stat, Her shapes, Her kinds, Her preset, Tier 1's gifts: none matches a master-data string (Stardust is professions', checked there)** | Coined words (Bulwark is an old engine cue label) | Plain words say what a row does; the owner's own ("AoE", "multi-hit", "life steal") |
| **T2E49** The chart's marks | **A white diamond at a star's lower right when its branch isn't the body's default; the chart's table untouched in every tier** | A letter on the star (under 11 px); colour fills | D277's geometry and test stand; the page checks the marks stay inside their targets |

### Where the owner may want to look first

| Call | Why it's worth his eye |
|---|---|
| **T2E27** The weapon moon becomes a pick | It drops round 1's Tier 2 body (+11.8–15.2% of her damage on top of the map) and Tier 3's second moon, both his approved D194 model ("each tier's new bodies should matter"). As picks they compete with Prowess's other rows and add no budget, which is the guardrail he asked for, and it keeps the chart, jewels and windows as built. If he wants Tiers 2 and 3 to add Extra Stats power, round 1's body is the seam |
| **T2E36** The hybrids' lift | Slotting raises the hybrids' Prowess from about 10% to 13–15% of their damage, toward the pure classes' 16–18%: the one place slotting adds power, and it moves the pure-to-hybrid ratio by about 4 points |
| **T2E22, T2E23** No lane crossing | The Planet has no offense row: a back-liner can't trade her defenses for damage. If he wants glass cannons, this is the seam |
| **T2E25** MP back at 2.0% | MP binds hard once fights chain (the Sorcerer Attacks on 35% of her acts over 12 stages); MP back at 3% would be every caster's pick. 2.0% ties MP over 12 stages |
| **T2E21** An open node gives its gift until slotted | Stardust slots, it doesn't open, so a slow Fungi line costs choice, never stats |
