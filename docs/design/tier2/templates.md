# Uma Templates in Tiers 2 and 3

> **Status: drafting, 2026-11-04. Nothing here is built.** One doc of the Tier 2 set ([README](README.md)): her
> uniqueness (calling, ★ Flourish, ★ signature accessory, ★ her moon, ★ signature tip) carried from the approved Uma
> Templates pass ([uma-templates.md](../tier-rework/uma-templates.md), UT1–UT20, D197) onto Tier 1 as it is built (engine
> v21, save v36). Calls are **T2U1–T2U20**, each with a recommendation ([§9](#9-decisions)). No open questions. The
> manual owns Tier 1 ([classes § Her calling](../../game/classes.md#her-calling-and-her-template)); this doc owns Tiers 2
> and 3.
>
> **The owner's frame:** "Uma template is more of an optional thing" (D274). So this doc keeps the template small: it adds
> **one piece in Tier 2 (the ★ signature tip)**, scales the rest by the tier, and grows no system of its own.
>
> **Pages** (desktop, light and dark; every Uma on them is made up):
> [**her template by tier**: the five pieces Tier 1 → 2 → 3, the calling with no Tier 0, the budget measured, every old call's status](previews/templates-tiers.html) ·
> [**the signature tip**: where it sits on a Tier 2 tree, her lead weapon by class, the three tips on today's shapes, Tier 3, how it shows](previews/templates-tip.html) ·
> [**the Umas**: two front runners Tier 1 to 3, one Uma per calling, the catalog of 75 and its families](previews/templates-umas.html).

## 1. At a glance

**What Tiers 2 and 3 add: one piece, the ★ signature tip. Everything else is Tier 1's, by the tier.** Four of her five
pieces already play in a Tier 2 or 3 world today (the README's "Tier 1's rules × tier"); only the tip waits for Tier 2's
trees ([classes.md](classes.md), T2C).

| Piece | Read from | Works | Tier 1 (live) | Tier 2 | Tier 3 |
|---|---|---|---|---|---|
| **Her calling** | Her best running styles | Always | Her Tier 0, her family, her trade, her moon's root | **A family, not a class:** no Tier 0 in the world; she arrives as her class or her suggested promotion (T2U3) | The same |
| **★ Flourish** | Her stride | As her family | 4% of her max HP a fight (a Brawler at Lv 50: **58 HP**) | 4% (**101**) | 4% (**144**) |
| **★ Signature** | Her knack (the family) | Any class, while one slot wears her family at G1+ | ATK and M.ATK +0.1 a level: **+5** at Lv 50 | × 1.8: **+9** | × 2.6: **+13** |
| **★ Her moon I** | Her knack | Any class | +4 points (HP +20, MP +4, DEF and M.DEF +4, 2.4% evasion, or a Limit start of 1) | +7 points (HP +35) | +10 points (HP +50) |
| **★ Her moon II** | Her calling's root | Any class | DEF +8, M.DEF +8, or +4 and +4 | +14 (7 + 7) | +21 (10 + 11) |
| **★ Signature tip** | Her stride, on her lead weapon's tree | As her family | — | **A third option at her lead tree's tip fork** beside Power and Break (Class Rank 40, about Lv 27): Quickstep, Spillover or Long guard | **At both tip forks** of that tree (two lines held), capstones too |

**The budget, measured on engine v21** (both of the owner's parties, on curve, every region stage;
[§4.8](#48-the-budget-t2u14)): the ★ signature adds **about +2% damage a turn at Lv 50 in every tier** (+1.0 to +3.6%
in Tier 1, +0.5 to +3.3% in Tier 2, +1.3 to +3.4% in Tier 3); matched, with her family swapped into her preset, **+1.2 ·
+1.3 · +1.5%** on average; a matched party takes **4–6% less** from Lv 30; the Flourish mends 0.1–0.9% of her max HP a
fight; wins and pace don't move. The drafts aimed at "about +5%" (UT13); since D266 halved the rate the template sits
under it, and this doc keeps it there.

**What this doc decides, in six lines:**
1. **Her calling outlives the Tier 0** (T2U3, T2U4): in a later world it is a family (Warrior, Spellblade, Healer,
   Summoner, Mage) that names her type, trade, moon root and the classes her Flourish and tip work in.
2. **Nothing grows but by the tier** (T2U5, T2U6, T2U8): the Flourish stays a 4% share, the signature and her moon × 1.8
   and × 2.6, her moon still two nodes with no jewel.
3. **The tip sits on her lead weapon's tree** (T2U9, T2U10): the weapon in her first slot, always her lead channel, at
   depth 5's fork beside Power and Break, on whichever line she holds; the class branches never move it.
4. **The three tips are re-cut on today's shapes** (T2U11): Quickstep (two more hits on her target), Spillover (the
   volley's splash), Long guard (a Barrier on herself).
5. **The budget stays small** (T2U14, T2U15): the measured edge is the target, "about +5%" its ceiling; the dial stays
   the signature's rate.
6. **Save and engine** (T2U17, T2U18): one more value of the tip fork's stored pick; the tips are data on rules that
   exist.

## 2. Tier 1 as built

The baseline, live on engine v21 and save v36. Every number is the code's; the rules are the manual's
([classes § Her calling](../../game/classes.md#her-calling-and-her-template), [combat § Her accessory](../../game/combat.md#her-accessory-and-signature),
[combat § Sustain](../../game/combat.md#sustain-mp-and-the-flourish), [loops § Extra Stats](../../game/loops.md#extra-stats),
[sections § Template tab](../../game/sections.md#stable)). Code: `roster/template.ts`, `economy/accessories.ts`
(`signatureBonus`, `signatureWorn`), `economy/planet.ts` (`moonChannel`, `mapPoints`, `withHerMoon`), `save/presets.ts`
(`weaponPreset`).

### 2.1 The readings and the catalog

| Reading | From | Gives |
|---|---|---|
| **Calling** | Her best running styles (every style at her top grade), nothing else (CV19) | Her Tier 0: Front among them → **Warrior** (47 of 270 outfits); Pace alone → **Spellblade** (72); Pace with Late or End → **Mage** (72); End among them → **Summoner** (33); Late alone → **Healer** (46) |
| **Stride** | The longest distance at her best distance grade | Sprint or Mile → **Dash**; Medium → **Middle**; Long → **Stayer** |
| **Knack** | Her top growth rate; ties to the higher base stat, then Speed, Stamina, Power, Guts, Wit | Speed **Fleet**, Power **Mighty**, Stamina **Tireless**, Guts **Gritty**, Wit **Clever** |

**"{knack word} {type}", one of 75** (5 callings × 3 strides × 5 knacks; CV21). On the census (the 270 outfits the
design reads, counts only): **60 in use, the largest 13 Umas, the median 4, 8 alone.** The release now holds 272 (61
in use).

| Calling | Dash | Middle | Stayer | Umas by stride | Moon II |
|---|---|---|---|---|---|
| Warrior | Charger | Bruiser | Ironhide | 12 · 20 · 15 | DEF |
| Spellblade | Flashblade | Spellfencer | Longblade | 17 · 31 · 24 | DEF and M.DEF, half each |
| Mage | Flarecaster | Spellwright | Starkeeper | 8 · 38 · 26 | M.DEF |
| Summoner | Beckoner | Binder | Shepherd | 3 · 10 · 20 | DEF and M.DEF, half each |
| Healer | Lamplighter | Mender | Pilgrim | 8 · 19 · 19 | DEF and M.DEF, half each |

### 2.2 The four pieces that play

| Piece | Rule (live) | Tier 1 numbers |
|---|---|---|
| **★ Flourish** | While she fights as any class of her calling's family (her Tier 0 and its own children; a kin class is outside): 4% of her max HP a fight, in her stride's shape. **Clean break** a Barrier of 4% at the start (lapses at round 1's end); **Even pace** 1% at each round's end; **Late reserve** 2% at each round's end from round 3; each up to 4%. Never overheals; a fallen Uma gets none; once a fight | Lv 50 on curve: Brawler **58 HP**, Sorcerer 49, the six between 53 |
| **★ Signature** | Her knack names a family: Fleet the **Charm**, Mighty the **Orb**, Tireless the **Pendant**, Gritty and Clever the **Insignia**. While one of her three slots holds it at G1+: ATK and M.ATK + 0.1 a level × tier, at least 1, on her hits, any class. Never on mends or Barriers | **+1 · +2 · +3 · +4 · +5** at Lv 10 · 20 · 30 · 40 · 50 |
| **★ Her moon** | Two nodes beside her map, **no jewel:** node I opens with the third moon's node II (Lv 16 at the earliest), node II with the third moon's node IV (Lv 36). Both count in any class | I: +4 points to her knack's stat (Tireless HP +20, Clever MP +4, Mighty DEF and M.DEF +4 each, Fleet 4 Speed points = 2.4% evasion, Gritty 4 Limit points = a starting charge of 1). II: +8 to her calling's root's defense (Warrior DEF, Mage M.DEF, the three All-Rounders +4 and +4) |
| **Her trade** | Her calling names one material line's three places; a class switch or a promotion never moves it | Warrior Metal, Spellblade Wood, Healer Vegetables, Summoner Fish, Mage Stone |

**Her family** ([classes § Tier 0](../../game/classes.md#tier-0-and-promotion), `rpgClassFamily`):

| Calling | Her family (the Flourish works as) | Kin she can promote into (no Flourish) |
|---|---|---|
| Warrior | Warrior, **Brawler, Arms Spellblade, Arms Summoner** | — |
| Spellblade | Spellblade, **Arms Spellblade, Tome Spellblade** | Arms Summoner, Paladin |
| Healer | Healer, **Paladin, Cleric** | Arms Spellblade, Tome Summoner |
| Summoner | Summoner, **Arms Summoner, Tome Summoner** | Tome Spellblade, Cleric |
| Mage | Mage, **Sorcerer, Tome Spellblade, Tome Summoner** | — |

### 2.3 Her signature against her slots (D266)

- **The ★ is worth half a slot of her stat at every level:** an on-curve slot is G⌊(level + 4) ÷ 5⌋, a Pendant +1 a grade,
  so at Lv 50 a G10 Pendant is +10 ATK and her ★ +5.
- **Her preset puts her family first only when her weapons can use it** (D266 call 7, `weaponPreset`): a Pendant needs
  an Arm, a Charm a Tome. So **a Charm on a Brawler and a Pendant on a Sorcerer stay out**, and her ★ is off there by
  default. On the census that is **23 of 47 Warrior callings** (Fleet) as a Brawler and **12 of 72 Mage callings**
  (Tireless) as a Sorcerer: 35 Umas, 13%. Every other class holds both channels, so every family fits.

| Calling | Charm (Fleet) | Insignia (Gritty, Clever) | Orb (Mighty) | Pendant (Tireless) |
|---|---|---|---|---|
| Warrior (47) | **23** (off as a Brawler) | 16 | 2 | 6 |
| Spellblade (72) | 14 | 27 | 17 | 14 |
| Mage (72) | 17 | 23 | 20 | **12** (off as a Sorcerer) |
| Summoner (33) | 7 | 3 | 16 | 7 |
| Healer (46) | 8 | 15 | 14 | 9 |
| **All 270** | **69** | **84** | **69** | **48** |

### 2.4 How it shows, and what it isn't

- **The Template tab** (D270): her name, the three readings, her calling and trade, and one ★ row a piece (Flourish,
  Signature, Moon I, Moon II), each with its number, its state and the sheet where it changes. **No dot** (D274): wearing
  her ★ is her choice. The Stable filters by calling, stride, knack, signature and trade.
- **What a template never does** (UT2 kept): add a damage kind, a lean, a hand or a rule; sit on a weapon; speed EXP,
  ranks or jobs; give a party synergy; take anything away. **The foes are priced without it** (the balance party has
  none).
- **Ascend** ([loops § Ascend](../../game/loops.md#ascend)): she keeps her class and her accessory slots' families and
  kinds; her map empties (her moon with it); an Uma who ascends as a Tier 0 arrives as her suggested promotion.

## 3. The approved drafts, call by call

### 3.1 UT1–UT20

| Call | As approved (D197) | Status | Why, and where it goes |
|---|---|---|---|
| **UT1** This doc | uma-templates.md is the one home for Uma uniqueness | **Kept, changed** | D238 split the homes: the manual owns Tier 1 as built, this doc Tiers 2 and 3 (T2U1) |
| **UT2** What a template is | Three readings feeding five pieces, the same in every tier; never a kind, a weapon bonus, a lean, pace, a synergy or a malus | **Kept, changed** | D240 (CV19, CV21): the calling is her Tier 0, with no pick; the five pieces and the "never" list stand (T2U2) |
| **UT3** The rule | One pure function by stable id; U4's eight calling rows, U5's stride, U6's knack | **Kept, changed** | D240 (CV19): five rows by her best styles alone, no Power, Wit or distance; stride and knack as written |
| **UT4** The calling pick | Pace Spell Blade or Mage, Late Paladin or Cleric, once | **Superseded** | D240 (CV19: the promotion is the pick); D247 (save v32 drops it); D257 (the card retires) |
| **UT5** The catalog | 6 × 3 × 5 = 90 templates, 63 in use | **Kept, changed** | D240 (CV21): 5 × 3 × 5 = 75, 60 in use; the Healer's types are the old Cleric's three (Lamplighter, Mender, Pilgrim) |
| **UT6** The Flourish | 4% of her max HP a fight in her stride's shape, as her calling | **Kept, changed** | D240 (CV21): as any class of her family. In Tiers 2 and 3 the same share (T2U5) |
| **UT7** The signature's family | By knack: Fleet Bell, Mighty Orb, Tireless Pendant, Gritty and Clever Insignia; +0.2 a level × tier | **Kept, changed** | D264 (the Bell retires into the Charm, so Fleet names the Charm); D266 (0.1 a level, at least 1: +5 · +9 · +13). By tier: T2U6 |
| **UT8** Presets | Her preset wears her family, in the slot that adds least | **Kept, changed** | D264 (three slots, her ★ family first) and D266 (only when her weapons can use it). By tier: T2U7 |
| **UT9** The signature tip | Her lead weapon's tree, a third option at its tip fork from Tier 2, both forks in Tier 3; Quickstep, Spillover, Long guard; as her calling | **Broken** | Written for six classes: its lead-weapon table names the six and their Tier 2 branches (Berserker … Oracle), Spillover reuses "the Bow B's splash" (the Bow's line B is Barrage since CV14, the Bow a volley since CV12), and "as her calling" is now her family (CV21). Fixed by T2U9–T2U13 |
| **UT10** Her moon | Node I +4 × tier on her knack's stat (Lv 16, Moon Jewel II); node II +8 × tier on her calling channel's defense (Lv 36, Moon Jewel IV) | **Kept, changed** | D264 (call 6: no jewel, opens with the third moon's II and IV); D240 (CV21: node II by her calling's root, +4 and +4 for an All-Rounder). By tier: T2U8 |
| **UT11** The affinity | Retired, never built | **Kept** | Nothing to carry |
| **UT12** What her class gates | Only the Flourish and the tip need her calling's class | **Kept, changed** | D240 (CV21): her family, not one class. Tiers 2 and 3: T2U4 |
| **UT13** The budget | Damage +4.3–6.1% (the signature alone, one slot, +0.2 a level); defense +4.7% plus her knack; pace 0 | **Broken** | Written for a one-slot Tier 1 at +0.2 a level: D264's three slots and D266's +0.1 make the signature half a slot of her stat, and its numbers no longer hold. Re-measured on engine v21 by T2U14 |
| **UT14** How it shows | A ★ in every place: the template chip and card, the calling pick card, the Skills root, the Observatory, the Gear tab, the Battle tab, the Racing tab, the party chip | **Superseded** | D239 and D265 (the profile's four tabs, no chip in the header), D270 (the Template tab, one ★ row a piece with its sheet), D274 (no dot). The ★ grammar survives inside them; Tiers 2 and 3 add one row (T2U16) |
| **UT15** The Stable | A Template filter group: Calling, Stride, Knack, Signature, and the name in search | **Kept, changed** | D257 (Calling by the five Tier 0s); a Trade group beside it. Unchanged by tier |
| **UT16** Names | Clean break, Late reserve, Quickstep, Spillover, Long guard; Even pace kept | **Kept** | Re-checked against today's release: no match (T2U19) |
| **UT17** Save | Only the calling pick stored; her moon's ids; the tip pick | **Kept, changed** | D247 (save v32 drops the pick: nothing about the template is stored); D264 (her moon's ids written by the moons' jewels). The tip pick stands (T2U17) |
| **UT18** Engine | v16 the Flourish, v16–v17 the signature and her moon, v17 the tips | **Kept, changed** | The Tier 1 pieces shipped (v16, v17); the tips wait for Tier 2's class engine, after v21 (T2U18) |
| **UT19** Professions and the party | Her calling names her trade; no party synergy | **Kept, changed** | D240 (CV20): one trade a Tier 0, 1:1. In Tiers 2 and 3: T2U20 |
| **UT20** Enough for now | Five pieces; the dial is the signature's rate | **Kept, changed** | D266 turned the dial down (0.2 → 0.1 a level). Still five pieces and one dial (T2U2, T2U15) |

**Counts:** Kept **2** (UT11, UT16) · Kept, changed **14** · Superseded **2** (UT4, UT14) · Broken **2** (UT9, UT13).

### 3.2 Other docs' calls that touch the template

Owned by the doc named; listed here so the cross-reference pass sees one reading.

| Call | Owner | Status here | Why |
|---|---|---|---|
| **CP24** Template-only slots (the root's Flourish, the tip on her lead weapon's tree) | classes.md (T2C) | Kept, changed | CV21: her family. The slot is T2C's; its content this doc's (T2U9–T2U13) |
| **CP29, CP30** The calling pick and what it sets | classes.md (T2C) | Superseded | D240 (CV19) |
| **CP36** The affinity | classes.md (T2C) | Kept (retired) | UT11 |
| **WP33** The signature accessory | gear.md (T2G) | Kept, changed | D264 (Charm), D266 (0.1 a level); by tier T2U6 |
| **EP14** Her moon | extra-stats.md (T2E) | Kept, changed | D264 (no jewel), CV21 (by root); by tier T2U8 |
| **SB15** The template's budget | balance.md (T2B) | Broken | D266 halved the rate; re-measured by T2U14 |
| **XR12** Her moon's jewels (2 Moon Jewels a tier) | professions.md (T2P), extra-stats.md (T2E) | Superseded | D264 call 6: her moon takes no jewel, so the template adds nothing to demand |
| **PP2** The trade | professions.md (T2P) | Kept, changed | CV20: by Tier 0; by tier T2U20 |
| **CV21** Templates in Classes v3 (and "the tip, as any class of her family") | This doc | Kept | Live (D257); its Tier 2 line is T2U9's gate |

## 4. Tier 2 in full

### 4.1 Her calling with no Tier 0 (T2U3)

**A Tier 2 world has no Tier 0** (CV10): every Tier 1 class is open from Class Rank 1, and there is no promotion. Her
calling doesn't move: it is her racing profile's. It stops being a class she can fight as and **stays her family's
name**, the word the halls already carry (the Warrior Dojo, the Mage Tower).

| | Tier 1's world | Tier 2's and 3's worlds |
|---|---|---|
| Her calling is | Her Tier 0 (a class, Class Rank 1–10) | Her family: the same word, no class |
| A new Uma starts as | Her calling's Tier 0, Class Rank 1 | Her calling's suggested promotion, Class Rank 1 (as built: the Warrior a Brawler, the Mage a Sorcerer; Power over Wit the Arms child or the Paladin, else the Tome child or the Cleric) |
| She arrives at Ascend as | — | Her class; from a Tier 0 her suggested promotion (as built) |
| It names | Her type, trade, moon II's root, her family | **The same four** |
| Her Template tab | "Calling · Warrior · fixed"; the Flourish's chips start with the Tier 0 | "Calling · Warrior · fixed"; the chips are her family's Tier 1 classes only (D270 call 8, as built) |

**What uniqueness means without a Tier 0:** the same template, read the same way, giving the same pieces. The Tier 0
was where she started, never what made her unique; in a later world her family is two or three Tier 1 classes instead
of a Tier 0 and its children.

### 4.2 Her family in a later world (T2U4)

| Calling | Her family in Tiers 2 and 3 | Outside it (no Flourish, no ★ tip) |
|---|---|---|
| Warrior | Brawler, Arms Spellblade, Arms Summoner | The other five |
| Spellblade | Arms Spellblade, Tome Spellblade | The other six (Arms Summoner and Paladin, her kin, included) |
| Healer | Paladin, Cleric | The other six |
| Summoner | Arms Summoner, Tome Summoner | The other six |
| Mage | Sorcerer, Tome Spellblade, Tome Summoner | The other five |

- **Kin stays outside** although every class is open: kin was a promotion convenience (D290), and the manual already
  says a kin class is "outside her Flourish's family". The gate is `rpgClassFamily` minus the Tier 0, unchanged.
- **A class branch (T2C) is not a class:** her Flourish and her tip work in either branch of a family class.

### 4.3 The ★ Flourish (T2U5)

**The same 4% share in every tier.** Her HP grows by the tier, so the Flourish grows with it; nothing to rescale.

| At Lv 50, on curve | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Brawler (max HP 1,460 · 2,531 · 3,610) | **58** | **101** | **144** |
| Sorcerer (1,230 · 2,139 · 3,055) | 49 | 86 | 122 |
| The six between (1,322 · 2,296 · 3,277) | 53 | 92 | 131 |

- **Shapes unchanged:** Clean break, Even pace, Late reserve, each up to 4% a fight.
- **What it mends in play:** the measured fights at Lv 50 mend **0.1–0.9% of her max HP a fight** in every tier
  ([§4.8](#48-the-budget-t2u14)): the 4% is a cap a hard fight reaches, not a rate.

### 4.4 The ★ signature (T2U6, T2U7)

**0.1 a level × the tier, at least 1, while one slot wears her family at G1+.** Live in every tier today
(`signatureBonus(level, tier)`).

| Her level | 1 | 10 | 20 | 30 | 40 | 50 |
|---|---|---|---|---|---|---|
| Tier 1 (×1) | +1 | +1 | +2 | +3 | +4 | **+5** |
| Tier 2 (×1.8) | +1 | +2 | +4 | +5 | +7 | **+9** |
| Tier 3 (×2.6) | +1 | +3 | +5 | +8 | +10 | **+13** |

- **Still half a slot of her stat in every tier:** a slot's Pendant or Charm row is × 1.8 and × 2.6 too (D266), so a
  G10 Pendant at Tier 2's Lv 50 is +18 against her ★ +9. The trade-off of §2.3 holds unchanged.
- **Any form of her family counts** (T2G's forms and branches from Tier 2): a Great Pendant is a Pendant. One ★
  however many slots hold her family.
- **Her preset** (T2U7): her family first only when her weapons can use it, in her family's best form for her class
  (T2G's preset). The 35 Umas whose family their pure class can't use keep the rule: the template is optional, and
  their ★ works in the family's hybrid classes.

### 4.5 ★ Her moon (T2U8)

**Two nodes, no jewel, × the tier.** They open with the shared moons (Prowess, Vigor, Guard), never with Tier 2's
weapon moon (T2E).

| Node | Opens | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| **I** Tireless | With the third moon's node II (Lv 16 at the earliest) | HP +20 | HP +35 | HP +50 |
| **I** Clever | | MP +4 | MP +7 | MP +10 |
| **I** Mighty | | DEF and M.DEF +4 each | +7 each | +10 each |
| **I** Fleet | | 2.4% evasion | 2.4% | 2.4% (a share) |
| **I** Gritty | | A Limit start of 1 | 1 | 1 (a share) |
| **II** Warrior | With the third moon's node IV (Lv 36) | DEF +8 | DEF +14 | DEF +21 |
| **II** Mage | | M.DEF +8 | M.DEF +14 | M.DEF +21 |
| **II** Spellblade, Summoner, Healer | | DEF +4 · M.DEF +4 | +7 · +7 | DEF +10 · M.DEF +11 |

- **Node II is the same share every tier:** a Brawler's DEF 204 · 368 · 532 at Lv 50 takes +8 · +14 · +21, **3.9 · 3.8 ·
  3.9%**; a Sorcerer's M.DEF 200 · 360 · 520, 4.0 · 3.9 · 4.0%.
- **At Ascend** her map empties and her moon with it; it reopens as her shared moons do.

### 4.6 The ★ signature tip: where it sits (T2U9, T2U10, T2U12)

**On her lead weapon's tree, at depth 5's tip fork, a third option beside Power and Break.** Tier 2's trees (T2C,
carrying CP19) give every tree a third line (C) at the fork and make each line's depth-5 tip a pick: **Power** (the Tier
1 tip) or **Break** (its first weak hit on a foe removes one more shield point). On her lead tree, as a class of her
family, the fork offers her stride's ★ tip too.

```
 Her lead weapon's tree, Tier 2 (her first slot)

 depth 1 ── depth 2 ──┬── A  3 ── 4 ── 5 ─┬─ Power
   (trunk)            │                   ├─ Break
                      │                   └─ ★ her tip (Quickstep · Spillover · Long guard)
                      ├── B  3 ── 4 ── 5 ─┬─ Power · Break · ★
                      └── C  3 ── 4 ── 5 ─┬─ Power · Break · ★
                         (she holds one line; the ★ is on the tip of the one she holds)

 Her other two trees: Power · Break only.   Her class tree (branch, focus, class skills): no ★.
```

| Question | Answer |
|---|---|
| Which tree | **Her first slot's.** Slots go by channel, her lead channel first, so it is always a weapon of her lead half; she chooses which of that channel's weapons sits first |
| Which depth | Depth 5, the tip, from Class Rank 40 (about Uma Lv 27 in a Tier 2 world, where she starts at Rank 1) |
| Which line | The one she holds (A, B or C): the ★ is an option of that line's tip fork |
| The class branches (T2C) | **They never move it.** A branch changes her set (its preset) and with it, if she takes the set, her first slot; the tip follows her first slot, never the branch. Her class tree's skills take no ★ |
| The focus (T2C) | Rides it as any skill: if her lead weapon is in her branch's focus group, its +15% applies to the ★ tip as to Power |
| Gate | Only as a class of her family (T2U4). Elsewhere the fork offers Power and Break only |
| If she reorders her slots | The ★ follows her first slot. A ★ pick on a tree that stops being first, or in a class outside her family, plays as Power and waits; it returns when that tree is first again (T2U12) |

**Her lead weapon, by class** (T2U10; the class presets' first slots, D263, `RPG_WEAPON_PRESETS`):

| Class | Her preset (lead first) | Her lead tree | Its tip today (line A) | Line B's tip |
|---|---|---|---|---|
| Brawler | Greatsword, Axe, Lance | **Greatsword** | One foe, 3 hits | Combo: 4 hits |
| Sorcerer | Fire, Blizzard, Thunder | **Fire Tome** | One foe, 1 hit | Wave: every foe |
| Arms Spellblade | Katana, Axe, Thunder | **Katana** | One foe, 2 hits (+1 familiar), Armor Break | Pierce: 1 hit (+1) |
| Tome Spellblade | Thunder, Blizzard, Katana | **Thunder Tome** | One foe, 3 hits (+1 familiar) | Pierce: 1 hit (+1) |
| Arms Summoner | Bow, Axe, Dark | **Bow** | A volley: one foe 3 hits, a splash on every other, lingers | Oath: lingers at 0.4 |
| Tome Summoner | Dark, Blizzard, Bow | **Dark Tome** | A volley: one foe 3 hits, a splash on every other, lingers | Oath: lingers at 0.4 |
| Paladin | Lance, Greatsword, Light | **Lance** | One foe, 1 hit; Mind Break on every foe; Barrier 44% on every ally | Surge: one more stack |
| Cleric | Light, Fire, Lance | **Light Tome** | One foe, 1 hit; Brave and Faith on every ally; heals every ally 44% | Surge: a mend 15% larger |

In a class branch she takes her branch's set (T2C, carrying CP40); its first slot is her lead tree then. No class leads
with a sweep (Axe, Blizzard) on its preset; a Brawler who puts her Axe first can.

### 4.7 The three tips, on today's shapes (T2U11)

**Sidegrades** (CP15: reach, hits or support, never power alone), each an engine rule that already exists. Drafts for
Tier 2's simulation (T2B), priced against Power on the same tip.

| Stride | ★ Tip | What it does, on the tip of the line she holds | MP | The rule it reuses |
|---|---|---|---|---|
| **Dash** | **Quickstep** | **Two more hits on her target, the same total power.** Each weak hit chips a shield, so up to two more chips a cast on one foe (Break: one) | The tip's | A Spellblade's extra hit (power spread over more hits) |
| **Middle** | **Spillover** | **The volley's splash:** one more hit at 0.35 of the depth's power on every foe but her target. On a volley tip, a second splash | +2 | The volley (CV12) |
| **Stayer** | **Long guard** | **A Barrier on herself, 10% of her max HP,** until the round's end, after the tip's hits (under the 60% cap; no healing scale) | +2 | The Barrier, with herself as the target |

- **On a pair class's half:** a Spellblade's lead half keeps her familiar's extra hit (Quickstep's two come on top); a
  Summoner's lead summon lingers as before, and its farewell reads the tip's power, which Spillover's splash doesn't
  change.
- **On a healer:** the tip's strike takes it; her mend or Barrier is the tip's own. Long guard adds her own Barrier
  beside the depth-5 Barrier the Paladin's Arms give every ally.
- **The knobs, if the simulation finds one hot:** Quickstep one more hit instead of two; Spillover's splash 0.35 → 0.2
  on a tip that already strikes every foe; Long guard 10% → 8%. Never the foes.

### 4.8 The budget (T2U14)

**Measured on engine v21** (a scratch run of the balance harness, `balanceMember` with a template; 6 seeds; both of the
owner's parties, D263; every region stage at the level; Auto). A gain is damage a turn over the same party with no
template; "matched" is her family's class with her knack's family (`weaponPreset`'s ★ first), her moon and an Even pace
Flourish.

- **★ alone:** her ★ added to her class's own preset (as if her family were already in it: an Orb, or her armor half's
  stat). **Matched by family:** all five matched, each with that family's knack and her family's class, her preset
  rebuilt with the ★ first (`weaponPreset`); the mean of the ten class cells of the two parties. Regular fights weigh
  twice, sub-bosses and bosses once (`balance-v20`'s mean). Noise about ±0.5 points (a 2-seed re-run of Tier 1's Lv 50
  moved cells up to 0.7).

| Tier · Lv | Her ★ | ★ alone (range · mean) | Matched: Pendant · Charm · Orb · Insignia | Matched, every family (range · mean) | Party damage taken | Rounds (★ alone) |
|---|---|---|---|---|---|---|
| 1 · 10 | +1 | +1.0 to +3.1 · **+2.0** | +1.3 · +1.0 · +2.0 · −1.0 | −2.2 to +3.4 · +0.8 | −1.7% (her moon not open) | 4.86 → 4.79 · 4.89 → 4.79 |
| 1 · 30 | +3 | +0.6 to +4.6 · **+2.2** | +1.1 · +1.6 · +2.2 · −0.3 | −2.4 to +4.6 · +1.2 | −4.1% | 3.46 → 3.42 · 3.49 → 3.43 |
| 1 · 50 | +5 | +1.0 to +3.6 · **+2.1** | +1.1 · +1.0 · +2.1 · +0.6 | −1.9 to +3.6 · +1.2 | −4.4% | 5.16 → 5.04 · 4.99 → 4.95 |
| 2 · 10 | +2 | +0.7 to +2.1 · **+1.4** | +0.9 · +0.7 · +1.4 · −0.6 | −1.9 to +2.3 · +0.6 | −0.6% (not open) | 4.92 → 4.88 · 5.01 → 4.98 |
| 2 · 30 | +5 | +1.1 to +1.8 · **+1.5** | +1.0 · +0.8 · +1.5 · −0.4 | −2.5 to +2.2 · +0.7 | −5.5% | 3.52 → 3.49 · 3.48 → 3.43 |
| 2 · 50 | +9 | +0.5 to +3.3 · **+2.1** | +1.3 · +1.1 · +2.1 · +0.7 | −1.6 to +3.3 · +1.3 | −4.5% | 5.21 → 5.11 · 4.94 → 4.85 |
| 3 · 10 | +3 | +0.4 to +2.0 · **+1.3** | +0.9 · +0.8 · +1.3 · +0.1 | −1.1 to +2.1 · +0.8 | +0.2% (not open) | 4.77 → 4.73 · 4.93 → 4.88 |
| 3 · 30 | +8 | +1.4 to +2.4 · **+1.6** | +1.1 · +0.8 · +1.6 · +0.1 | −2.8 to +2.4 · +0.9 | −4.3% | 3.59 → 3.55 · 3.53 → 3.51 |
| 3 · 50 | +13 | +1.3 to +3.4 · **+2.4** | +1.3 · +1.3 · +2.4 · +1.1 | −1.3 to +3.5 · +1.5 | −5.7% | 5.16 → 5.10 · 4.89 → 4.81 |

Every fight won in every cell, with templates and without: five matched Umas are 0 points off the template-less
party's win rate, 1–2% fewer rounds. The Flourish mended **0.15–0.75% · 0.14–0.71% · 0.12–0.86%** of her max HP a fight
at Lv 50 in Tiers 1 · 2 · 3.

- **Damage is the signature alone,** and it is small: half a slot of her stat, about +2% in every tier because the ★
  and the slots both scale × tier. **The family swap moves it either way:** an Orb, or a Pendant or Charm that is
  already her stat, makes the ★ free (matched = ★ alone); an Insignia takes a stat slot and pays only on sub-bosses and
  bosses (−1.0 to +1.1 on the world's mix); a family her weapons can't use stays out (§2.3). **The lowest cell is the
  Fleet Paladin** (a Charm in place of a Pendant): −0.9 to −2.8 at every level, a choice the preset makes for up to 8 Umas (the Fleet Healers)
  (T2U7).
- **Defense:** a matched party takes 4–6% less from Lv 30, once her moon is open (0 at Lv 10, before node I's Lv 16);
  node II is 3.8–4.0% of her defense; node I adds 0–2.4% (Fleet's evasion the most); the Flourish is the hard fight's
  4% cap.
- **Pace:** 0. No piece touches MP; Clever's +4 · +7 · +10 MP changes no coverage.
- **The ★ tip** (Tier 2) is a sidegrade: the simulation checks it within 3 points of Power on her lead tree (T2B).
- **Recommendation:** keep these sizes. The drafts' "about +5%" (U12, UT13) stays the ceiling, not a target; D266 and
  D274 already chose a smaller, optional template. The foes stay priced without templates.

### 4.9 How it shows (T2U16)

| Where | Tier 2 adds |
|---|---|
| **The Template tab** | A fifth ★ row: **★ Tip** "Quickstep · Greatsword tree": **Picked**, **Not picked**, "R40 first" before depth 5 opens, or faint "Off · as Sorcerer" outside her family. It opens the Class tab's tip node on her lead tree. No dot (D274) |
| **The Class tab** | Her lead tree's tip fork shows three options, the ★ one in the accent and dashed until picked: "Power · Break · ★ Quickstep". The tree's (i) says "★ Her signature tip: her first slot's tree" |
| **The Battle tab and the log** | The tip's hits as any skill's; Long guard's Barrier "★ Barrier 253" (a Brawler at Tier 2's Lv 50); Spillover's splash on the hit line |
| **The Stable** | Nothing new: the tip follows her stride, which the Stride facet already filters |

### 4.10 Two front runners, and one Uma per calling, in Tier 2

Every Uma here is made up. Drawn Tier 1 → 3 on [the Umas page](previews/templates-umas.html).

| | **Uma A** | **Uma G** |
|---|---|---|
| Profile | Front A; Medium A, Long A; Stamina +20% | Front A, Pace A; Long A; Speed, Power, Wit +10%, Speed her highest base |
| Template | **Tireless Ironhide** (Warrior · Stayer · Tireless) | **Fleet Ironhide** (Warrior · Stayer · Fleet) |
| Tier 2 class | Brawler (her family: Brawler, Arms Spellblade, Arms Summoner) | Arms Spellblade |
| ★ Flourish | Late reserve, up to 101 HP at Lv 50 | Late reserve, up to 92 HP |
| ★ Signature | **Pendant**, in her Brawler preset already: +9 at Lv 50, free | **Charm**: off as a Brawler (three Arms); on as an Arms Spellblade (her Thunder Tome uses it): +9 |
| ★ Moon | I HP +35 · II DEF +14 | I 2.4% evasion · II DEF +14 |
| ★ Tip | **Long guard** on her Greatsword tree | **Long guard** on her Katana tree |
| Trade | Metal | Metal |

| Uma (made up) | Template | Tier 2 class | ★ Flourish | ★ Signature (Lv 50) | ★ Moon I · II | ★ Tip, her lead tree |
|---|---|---|---|---|---|---|
| **A** Front A, Long A, Stamina growth | Tireless Ironhide | Brawler | Late reserve | Pendant +9 | HP +35 · DEF +14 | Long guard · Greatsword |
| **B** Pace A alone, Mile A, Speed growth | Fleet Flashblade | Arms Spellblade | Clean break | Charm +9 | 2.4% evasion · DEF +7, M.DEF +7 | Quickstep · Katana |
| **C** Pace A + Late A, Medium A, Wit growth | Clever Spellwright | Sorcerer | Even pace | Insignia +9 | MP +7 · M.DEF +14 | Spillover · Fire Tome |
| **D** End A, Long A, Guts growth | Gritty Shepherd | Tome Summoner | Late reserve | Insignia +9 | A Limit start of 1 · DEF +7, M.DEF +7 | Long guard · Dark Tome |
| **E** Late A alone, Medium A, Power growth | Mighty Mender | Paladin | Even pace | Orb +9 | DEF and M.DEF +7 · DEF +7, M.DEF +7 | Spillover · Lance |

## 5. Tier 3 in full

**The same pieces × 2.6, and the tip on both of her lead tree's held lines.** Tier 3's trees (T2C, carrying CP20) let
her hold two of a tree's three lines, each with its own tip pick; at Class Rank 50 the crown plays every held capstone at
5.6, keeping its name and its tip (T2C19, T2C20; there is no depth-6 node).

| Piece | Tier 3 |
|---|---|
| Calling | A family, as in Tier 2 (T2U3, T2U4) |
| ★ Flourish | 4% of her max HP a fight: a Brawler 144 HP, a Sorcerer 122, the six between 131 at Lv 50 |
| ★ Signature | +0.26 a level: **+13** at Lv 50; still half a G10 slot of her stat (+26) |
| ★ Her moon | I +10 points (HP +50, MP +10, DEF and M.DEF +10 each; Fleet and Gritty their shares) · II DEF +21, M.DEF +21, or DEF +10 and M.DEF +11 |
| ★ Signature tip | **At both tip forks of her lead tree** (T2U13): the same ★ on each held line. A capstone built on a ★ tip keeps its ★ effect (Quickstep's two hits, Spillover's splash, Long guard's Barrier), as T2C's capstone keeps its tip's pick. The master slot (CP22) may hold that capstone like any other. No ★ on her other two trees |
| Budget | Measured in §4.8; the tip's check as Tier 2's (within 3 points of Power, T2B) |

```
 Her lead weapon's tree, Tier 3

 depth 1 ── depth 2 ──┬── A  3 ── 4 ── 5 ─[Power · Break · ★]── 6  capstone (keeps its tip's pick)   held
                      ├── B  3 ── 4 ── 5 ─[Power · Break · ★]── 6  capstone                          held
                      └── C  3 ── 4 ── 5 ─ … (not held)
```

The Umas of §4.10 in Tier 3: Uma A's Pendant +13, HP +50, DEF +21, Long guard on both of her Greatsword tree's held
lines; Uma G's Charm +13 (as an Arms Spellblade), 2.4% evasion, DEF +21, Long guard on both of her Katana tree's.

## 6. Provides and assumes

### 6.1 Provides

| To | What | Calls |
|---|---|---|
| **classes.md (T2C)** | The ★ tip's anchor (her first slot's tree, depth 5's fork, the line she holds; the class branches don't move it), its content (Quickstep, Spillover, Long guard), the Tier 3 rule (both held lines, capstones keep it); the family gate in a later world (her Tier 0's own children, kin outside); the tip pick's third value | T2U4, T2U9–T2U13, T2U17 |
| **gear.md (T2G)** | The signature reads any form or branch of her family at G1+, × tier; her preset's ★ family first only when her weapons can use it, in its best form for her class | T2U6, T2U7 |
| **extra-stats.md (T2E)** | Her moon by tier: two nodes, no jewel, opening with the shared moons' II and IV (never the weapon moons); its values × 1.8 and × 2.6, Fleet's and Gritty's shares flat | T2U8 |
| **professions.md (T2P)** | Her trade by calling in every tier; the template adds no demand (her moon takes no jewel since D264, so XR12's two Moon Jewels a tier retire) and nothing to the secondary profession | T2U20 |
| **balance.md (T2B)** | The template's measured budget by tier; the checks: five matched Umas within 3 points of the template-less party's win rate and rounds, the ★ tip within 3 points of Power on her lead tree; the foes priced without templates; the dial (the signature's rate) | T2U14, T2U15 |
| **progression.md (T2W)** | At Ascend she keeps her class and her slots' families (as built); a later world's new Uma starts as her suggested promotion; the tip arrives with Class Rank 40 | T2U3, §8 |

### 6.2 Assumes

| From | What | If not |
|---|---|---|
| **T2C** (classes) | CP19 carried: from Tier 2 a third line (C) at each tree's fork and **a pick at each line's depth-5 tip, Power or Break**; CP20 carried: in Tier 3 two lines held, each with its tip pick, and at Class Rank 50 the crown, which plays each held capstone at 5.6 and keeps its tip (T2C20; no depth-6 node); class branches with a set each (CP40 for eight classes); slots by channel, her lead channel first; the family and kin unchanged | **No tip fork:** the ★ tip becomes the depth-5 node's alternative on her lead tree's held line, swapped like a line (one pick, Power or ★). **No capstones:** Tier 3 is both held lines' tips only. "Power", the fork's draft option, equals a master-data string (the stat's name, a plain word of the kind D298 kept); its name is T2C's |
| **T2G** (gear) | Three accessory slots in every tier (D264); the four families keep their names with forms or branches from Tier 2; the preset rule of D266 carried; the signature a stat outside any kind cap | If a family splits into new families, the ★ follows the one her knack's family becomes |
| **T2E** (extra stats) | Her moon stays two nodes beside the shared Planet and moons; Tier 2's weapon moon is a separate body; × 1.8 and × 2.6 | If the weapon moon becomes the third moon's gate, her moon still opens with the three shared moons' II and IV |
| **T2P** (professions) | Her primary trade stays her calling's line; a secondary profession is her own pick | — |
| **T2B** (balance) | SB1's multipliers; shares don't scale; the balance party has no template | — |
| **T2W** (progression) | A Tier 2 world's Lv 1 is lifetime 51; she starts at Class Rank 1; the class EXP pace is Tier 1's (Class Rank 40 at about Uma Lv 27 from Rank 1) | If the pace changes, the tip arrives with Class Rank 40 whenever that is |

### 6.3 The seams

Where a new requirement would land on this doc, and the one place it changes:

| If the owner wants | It lands on | What moves |
|---|---|---|
| A stronger edge | T2U15, the dial | The signature's rate (0.1 → 0.2 a level is about +4%); nothing else |
| New classes in Tier 2 (or classes that replace the eight) | T2U4, her family | The calling → family table; the Flourish's and the tip's gate follow it |
| A calling chosen again in a later world (no Tier 0 to read it from) | T2U3 | One stored pick, the first template field the save would hold |
| New accessory families or forms (T2G) | T2U6, T2U7 | The knack → family table; the preset's ★ rule |
| A different Tier 2 tree (no tip fork, no line C) | T2U9, T2U13 | Only the tip's slot: "depth 5 of her lead tree"; its content stands |
| The Umas whose ★ their pure class can't use (35, and 8 Fleet Paladins) | T2U7 | A mirror rule (a Charm's ★ counts on a Pendant and back) |
| More templates (a fourth reading) | UT5, kept | The catalog; every piece still reads one of the three |

## 7. Save and engine

### 7.1 Save (T2U17)

| Data | What happens |
|---|---|
| Her template (calling, stride, knack, type, family) | **Nothing stored**, as built: `umaTemplate(outfit)` each time |
| The Flourish, the signature | Nothing: on by rule, read from her class and her slots |
| Her moon | `template:1`, `template:2` in each world's `stars.open`, written when the shared moons' jewels open them (as built, D264) |
| **The ★ tip** | **One more value of T2C's tip pick** (`power` · `break` · `signature`), stored per class, tree and line like every pick, default Power. A ★ pick on a tree that isn't her first, or outside her family, plays as Power and stays stored |
| Migration | None; no compensation |

Rough version: with Tier 2's classes' save (T2C's), not its own.

### 7.2 Engine (T2U18)

| Change | Kind |
|---|---|
| The ★ tips: Quickstep (her target's hits + 2, the same total), Spillover (the volley's splash), Long guard (a Barrier with herself as the target) | Data on rules that exist; the self-target is the one new step |
| The signature, her moon, the Flourish by tier | **None:** already × tier in the live engine (`signatureBonus`, `nodePoints`, a share) |

Rough stage: Tier 2's class engine (T2C's), after v21. Older fights replay on their own engine.

## 8. Pacing

**The template takes no time.** No EXP, rank, Laurel, ticket, job or amount moves.

| Piece | When she has it in a Tier 2 or 3 world |
|---|---|
| ★ Flourish | From her first fight, as a class of her family |
| ★ Signature | From her first Accessory Setting in her family's slot (G1, Lv 1) |
| ★ Her moon | With her shared moons' II and IV (Lv 16 and 36 at the earliest) |
| ★ Signature tip | With Class Rank 40 on her class (about Uma Lv 27 from Rank 1, on T2W's pace) |

## 9. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **T2U1** This doc | **This doc owns Uma uniqueness in Tiers 2 and 3** and the template's budget; the manual owns Tier 1 as built; UT1–UT20 carry here with a status (§3); uma-templates.md goes to the archive with the set | Keep uma-templates.md as the owner; fold each piece into its system's doc | D238's split: the manual for the game as built, one design doc per system for what comes |
| **T2U2** The pieces | **Five pieces, no sixth:** her calling, the ★ Flourish, the ★ signature, ★ her moon and, from Tier 2, the ★ signature tip; UT2's "never" list kept | A new piece in Tier 3; a template branch on every tree | The owner: optional; UT20's "enough for now" |
| **T2U3** Her calling in a later world | **The Tier 0's word stays her calling as a family name:** it names her type, trade, moon II's root and her family; a new Uma starts as her suggested promotion at Class Rank 1; she arrives at Ascend as her class (from a Tier 0 her suggested promotion), as built | Re-read her calling as a Tier 1 class in a later world; drop the calling there | One template in every tier (UT2); the halls already carry the family words; nothing to migrate |
| **T2U4** Her family in a later world | **Her Tier 0's own Tier 1 children:** Warrior 3, Spellblade 2, Healer 2, Summoner 2, Mage 3; kin outside; a class branch is not a class | Kin in the family once every class is open; every class | Kin was a promotion convenience (D290); the live gate (`rpgClassFamily`) needs no change |
| **T2U5** The Flourish by tier | **4% of her max HP a fight in every tier**, the same three shapes; her HP carries the tier (a Brawler 58 · 101 · 144 HP at Lv 50) | A bigger share by tier (5%, 6%); a new shape in Tier 3 | A share holds under SB1; it mends 0.1–0.9% a fight in play, so a bigger cap changes little |
| **T2U6** The signature by tier | **0.1 a level × 1.8 and × 2.6, at least 1: +9 and +13 at Lv 50**; any form or branch of her family at G1+; one ★ however many slots | A Tier 2 rate of its own; per-form values | Live today; still half a slot of her stat in every tier |
| **T2U7** Her preset's ★ | **D266's rule below a slot's G5; from a slot's G5 her family's Twofold form gives both stats ([gear](gear.md) T2G12), so her ★ goes first for everyone (reconciled):** below G5, her family first only when her weapons can use it, in its best form for her class (T2G); the 35 Umas whose family their pure class can't use (23 Fleet Warriors as a Brawler, 12 Tireless Mages as a Sorcerer) keep the rule, and so does the Fleet Paladin's Charm (−0.9 to −2.8% damage, up to 8 Umas) | Let a Charm's ★ count on a Pendant and back (her family's mirror) for them; keep a healer's stat twice; force her family into every preset | Optional (D274); their ★ works in their family's hybrids; the costs sit inside the noise but one; the mirror is the seam if the owner wants more |
| **T2U8** Her moon by tier | **Two nodes, no jewel, × tier:** I +4 · +7 · +10 points on her knack's stat (Fleet and Gritty shares flat), II +8 · +14 · +21 on her calling's root (All-Rounder ⌊÷ 2⌋ DEF, the rest M.DEF); opening with the shared moons' II and IV, never the weapon moon | A third node in Tier 3; a moon that grows each tier; her moon tied to the weapon moon | Live today; small, one rule; node II stays 3.8–4.0% of her defense |
| **T2U9** The tip's anchor | **Her lead weapon's tree (her first slot, always her lead channel), depth 5's tip fork, a third option beside Power and Break, on the line she holds;** the class branches never move it; never on her class tree | Every tree; the class tree; her branch's focus weapon; a tree she picks | One place, a tree she always uses, no weapon nudge (UT9's reason holds) |
| **T2U10** Her lead weapon | **Her class preset's first slot** (D263): Brawler Greatsword, Sorcerer Fire Tome, Arms Spellblade Katana, Tome Spellblade Thunder Tome, Arms Summoner Bow, Tome Summoner Dark Tome, Paladin Lance, Cleric Light Tome; in a class branch its set's first (T2C); she may put another lead-channel weapon first | A fixed weapon per template; her highest-grade weapon | Her preset is what one tap dresses; slots already put the lead channel first |
| **T2U11** The three tips | **Re-cut on today's shapes:** Quickstep (Dash) two more hits on her target at the same total; Spillover (Middle) the volley's splash, 0.35 on every foe but her target, +2 MP; Long guard (Stayer) a Barrier on herself of 10% of her max HP until the round's end, +2 MP; sidegrades for Tier 2's simulation | UT9's text as written (the Bow's old splash, ×0.3, +4 MP); new effects | Each rule exists in the engine today; the volley is the game's splash since CV12 |
| **T2U12** Reordering | **The ★ follows her first slot;** a ★ pick on a tree that stops being first, or outside her family, plays as Power and waits, and returns when it is first again | Reset it to Power; lock her first slot once picked | Slot order stays free (it is today); nothing lost to a swap |
| **T2U13** Tier 3 | **The ★ at both tip forks of her lead tree** (two lines held); a capstone built on a ★ tip keeps its ★ effect; the master slot may hold it; no ★ on her other two trees | A ★ on every held tree; a stronger Tier 3 tip | UT9's Tier 3 rule on T2C's capstones; the same one place |
| **T2U14** The budget | **The measured sizes stand:** the ★ adds about +2% damage a turn at Lv 50 in every tier (+1.0–3.6 · +0.5–3.3 · +1.3–3.4%); matched with her family's swap +1.2 · +1.3 · +1.5% on average; a matched party takes 4–6% less from Lv 30; the Flourish mends 0.1–0.9% of her max HP a fight (4% its cap); node II 3.8–4.0% of her defense; wins and pace unchanged; the tip within 3 points of Power; "about +5%" is the ceiling, not a target; the foes priced without templates | Restore +5% (the signature at +0.2 a level); price the foes with templates | D266 and D274 chose a smaller, optional template; the tier scaling keeps one budget for every tier |
| **T2U15** The dial | **Unchanged: the signature's rate a level** (0.1 now, about +2%; 0.2 about +4% if the owner wants a stronger edge), never a new piece and never the foes; the tips' knobs (§4.7) only if the simulation finds one hot | A bigger moon; a bigger Flourish | One number, already in the fight's input (UT20) |
| **T2U16** How it shows | **One more ★ row on the Template tab** (★ Tip: Picked, Not picked, "R40 first", "Off · as Sorcerer"), opening the Class tab's tip node; the fork draws "Power · Break · ★ Quickstep", the ★ dashed until picked; no dot; the Stable unchanged | A dot while the ★ tip is unpicked; a tip facet | D270's grammar (a number, a state, the sheet where it changes); D274's no dot |
| **T2U17** Save | **Nothing about the template stored;** the ★ tip is a third value of T2C's tip pick (default Power); her moon's ids as built; no migration | A template id written at unlock; a separate signature-tip field | Derived from master data (U13 kept); one pick shape for every tip |
| **T2U18** Engine | **The tips are data on rules that exist** (spread hits, the volley's splash, a Barrier, with a self-target the one new step), in Tier 2's class engine; the other pieces need nothing (already × tier) | An engine stage of its own | Smallest change; replays keep their own engine |
| **T2U19** Names | **Quickstep, Spillover and Long guard kept; no new name coined.** Every template word (the 15 types, the 5 knack words, the 3 Flourishes, the 3 tips) checked against every string of today's master-data release (10 files, 18,227 strings, case-insensitive exact match): no match | Rename the tips | Nothing from the original games; the old names already passed UT16's check |
| **T2U20** Professions and the party | **Her calling names her primary trade in every tier (CV20); nothing to the secondary profession (T2P), no Craft bonus, no party synergy** | Craft EXP in her trade; matching strides in a party | Every Uma of a level finishes together; a template is hers, a party's shape the classes' |

## 10. The previews

| Page | What it shows |
|---|---|
| [templates-tiers.html](previews/templates-tiers.html) | The five pieces Tier 1 → 2 → 3 with their numbers; the calling with no Tier 0 (her family by tier); the signature by level and tier against a slot; her moon by tier; the budget measured; every old call's status |
| [templates-tip.html](previews/templates-tip.html) | The Tier 2 tree with the ★ at her lead tree's fork; her lead weapon by class; the three tips drawn on a formation against Power and Break; Tier 3's two held lines and capstones; the Class tab's fork and the Template tab's ★ Tip row |
| [templates-umas.html](previews/templates-umas.html) | Two front runners Tier 1 to 3; one Uma per calling; the catalog of 75 by calling and stride with today's counts; the families by calling, with the 35 Umas whose family their pure class can't use |

**The old pages, carried or retired** (for the README's §7 log):

| Old page (tier-rework/previews/) | Now |
|---|---|
| uma-templates.html (the rule, 90 templates, the roster, two of one kind, the calling pick) | **Carried** into templates-umas.html at 75 templates and the styles-only rule; its calling-pick section **retired** (CV19) |
| uma-gives.html (every piece by tier, the Flourish's MP re-check, the family, the tip, her moon, the budget) | **Carried** into templates-tiers.html (re-measured) and templates-tip.html (the tip); the MP re-check **retired** (settled by UT6, live) |
| uma-profile.html (the Uma sheet, the calling pick, the Skills tab, the Observatory, the Gear tab at each tier) | **Retired:** the live Template tab replaced it (D270); its Tier 2 and 3 marks are carried into templates-tip.html's tab mocks |
| uma-compare.html (two front runners, one Uma per calling) | **Carried** into templates-umas.html |
| class-templates.html (the class template sheet per class and tier, the focus, weapons, the affinity) | Its **#affinity** section **retired** (UT11); the rest is class design, carried or retired by classes.md (T2C) |
| classes-template-sheets.html (class template sheets, Spell Blade Tier 1–3, all six, counts) | Class design, not Uma templates: classes.md's (T2C) to carry or retire |
| variance-templates.html, variance-two-umas.html, variance-profile.html | **Retired:** the first round (U1–U16), superseded by the uma-*.html pages on 2026-10-25; history |
