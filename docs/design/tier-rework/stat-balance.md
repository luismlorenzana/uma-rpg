# Stat Balance: the overall balancing pass, Tier 1 to Tier 3

> **For the owner's review (2026-10-24). Nothing here is built.** The Tier rework's **overall stat balancing pass**
> ([README §5](README.md#5-the-plan), step 5; [§2.5](README.md#25-the-stat-budget-sb1-working-rule-2026-10-23) SB1;
> [§9.5](README.md#95-simulation-items)'s simulation items), the step after the four approved standalone docs (Class
> D192, Weapon D193, Extra Stats D194, Profession D195). **It is an analytic model:** expected values from the game's
> formulas and the four docs' numbers; no fight is simulated. The final tuning by simulation happens at implementation,
> once engine v16 exists behind its switch. Calls are **SB1–SB18**, each with a recommendation ([§14](#14-decisions)).
> No open questions. *Updated 2026-10-25 after the owner's first look ("a lot of numbers … can we not fix them?"): a
> picture page for the three problems and their fixes, and **SB18**, the MP fix ([§7.2](#72-sb18-a-base-mp-regen-for-every-uma)).*
>
> **Start here: [the three problems and their fixes, in pictures](previews/balance-summary.html)** (one card each, a
> before/after chart, then what already holds).
>
> **What it found, in six lines** ([§0](#0-at-a-glance)):
> 1. **SB1 holds.** Every source keeps its share of every stat at each tier's Lv 50 within 2.3 points; the model
>    reproduces all eighteen approved Lv 50 sheets to the point.
> 2. **The Tier 2 and Tier 3 toolboxes outrun the foes.** On curve, a party fells a regular **1.46×** as fast as Tier 1
>    at Tier 2's Lv 50 and **1.85×** at Tier 3's; Z4's draft term (+15%) takes Tier 2 back to 1.19×, and Tier 3 has no
>    term. **Proposed:** Tier 2's term +27%, a Tier 3 term 1.08 → 1.48, bosses ×1.1 inside it, boss shields +1.
> 3. **Two accessory branches are nobody's best** (the Toll Bell, the Great Pendant); one step each fixes them.
> 4. **The hybrid mirror moves to the Summoner** (Prowess's split puts ATK on her Arms half, the presets put flat
>    offense on her Bow): her 70/30 falls to 57/43. **Proposed:** a hybrid's single-kind forms and Full moon go on her
>    lead half, and her Arms hand 0.56 → 0.48.
> 5. **Defense, the template, Skill Ranks and the damage stack's ceilings hold as written.**
> 6. **MP runs dry over a region** without the regen accessories: late in a region the party acts at **41–52%** of
>    today's power from Lv 30 (at Lv 50 the Mage and the Summoner cast deep in a third of a region's acts; today in all).
>    **Proposed (SB18):** a base MP regen for every Uma, a rule and never a pick: **0.8% of her max MP at the end of each
>    round for each skill depth she has open** (4% from Class Rank 40). Late-region power returns to **0.94–1.05×**
>    today's.
>
> **Pages** (full desktop, light and dark): [**the summary: three problems, three fixes**](previews/balance-summary.html)
> · [every stat sheet by source, every class, tier, level and build stage](previews/balance-sheets.html) · [damage per
> act, the foes, every check and every tuning before and after](previews/balance-damage.html).
>
> **Interfaces, not designed here:** the values themselves stay their owning docs' (README §3); this pass proposes
> changes as follow-ups ([§13](#13-if-approved-the-follow-ups-by-doc)). The Uma Templates pass (variance.md) takes §8's
> budget. Tier 3's world beyond its term is designed with Tier 3.

## The owner's points

| The owner's point | Answered in |
|---|---|
| "Stat growth across tiers mustn't drift out of balance" (SB1, 2026-10-23); docs write values as "T1 value × tier" so either choice is a one-line change, and **this pass sets the final numbers** | [§2](#2-sb1-every-source-keeps-its-share): SB1 holds within 2.3 points at every tier's Lv 50; its multipliers stay ×1 · ×1.8 · ×2.6 (SB1, SB2) |
| "The rate of progression is fine as it is: keep it" (the brief, 2026-10-22) | [§3](#3-the-damage-stack-and-the-foe-budget): the foes must keep pace with each tier's toolbox, so rounds a fight stay Tier 1's; the terms that do it (SB3–SB5) |
| "Tier 2 and Tier 3 feel too low impact" (the Extra Stats review, 2026-10-24) | [§3.4](#34-where-the-gain-comes-from): the four docs' Tier 2 tools add **+51%** to an on-curve act and Tier 3's **+88%**: they matter; the terms price them so the pace holds, and a player feels them as choices and tuned fronts (SB7) |
| Defensive accessories are unfun; leave defense to armor (the weapon review) | [§6](#6-defense-a-regulars-hit): armor alone keeps a regular's hit at 18.7% · 18.3% · 18.1% of a Brawler's HP (SB13) |
| "MP regen accessories are too broken; I would always wear one on every class" | [§7](#7-mp-after-the-regen-accessories): without them a party runs dry late in a region (SB14); **SB18** gives every class the regen he'd have worn, as a rule of the game, not a pick: late-region power back at today's within 6% |
| "This is the most difficult part to visualize for me, it's a lot of numbers. Why do we have those big issues, can we not fix them?" (2026-10-25) | [The summary page](previews/balance-summary.html): each problem in one sentence, why, its fix and one before/after chart. The three: later tiers outrun the foes (SB3–SB5), the hybrid mirror drifts (SB10–SB11), MP runs dry over a region (**SB18**, new) |
| "All accessories viable"; channel-neutral, parity checked per channel (the weapon review, D193's note) | [§4](#4-accessories-their-share-viability-and-parity): every form someone's best after two steps (SB8); every family within 0.4 points between a Brawler and a Mage at equal Attack share (SB9) |
| Uma uniqueness through accessories, about +5% (WP33) | [§8](#8-the-template-budget): the signature gives +4.3–6.1% at Lv 50, the matched affinity only +2–5% in the campaign (SB15) |
| Skill Ranks every 2 Class Ranks, balance-neutral (CP32) | [§9](#9-skill-ranks-neutrality): neutral on the balance party; +5% from Uma Lv 34 at a real player's pace (SB16) |
| The hybrids a mirror, 70/30 each way; Paladin against Cleric (CP1, CP9) | [§5](#5-the-mirrors) (SB10–SB12) |
| Shields grow with the answers a foe's list gets (CP8) | [§10](#10-shields-against-answers) (SB6) |
| No open questions; decide with a recommendation, log it | [§14](#14-decisions): SB1–SB18, each recommended |

## 0. At a glance

| # | Check (README §9.5, the reviews' flags) | Target | The model finds | Verdict | Call |
|---|---|---|---|---|---|
| 1 | **SB1:** each source's share of each stat at each tier's Lv 50 | Holds within a few points | Every stat within **2.3 points** T1 → T3 (MP and HP edge up 1.7–2.3: the level part's constants don't scale); lead offense rises **55 → 61 → 61%** by design (the weapon moons) | ✓ | SB1, SB2 |
| 2a | **The damage stack's ceilings** (WP31) | ×1.50 · ×2.16 · ×2.49 on one weak hit | ×1.495 · ×2.156 · ×2.493 (×1.58 · ×2.29 · ×2.64 with the affinity); flat on one kind 136 · 334 · 484 | ✓ as written | SB7 |
| 2b | **Fully built against the foe budget** | Rounds a fight within ±10% of Tier 1's at the same tier level (Z4's own target) | On curve a party fells a regular **1.46×** as fast at Tier 2's Lv 50, **1.85×** at Tier 3's; Z4's draft +15% leaves **1.19×**; bosses 1.57× and 2.04× | ✗ **outruns** | SB3, SB4, SB5 |
| 2c | The tuned peak (one kind, fully stacked) against the on-curve act | — | Peak ÷ average **1.32 · 1.60 · 1.84** | Rift fronts | SB7 |
| 3 | **Accessory branches' share** and every form's viability | 18–22% · 27–34%; every form best somewhere, none in over half | Shares **7–10 · 18–22 · 28–33%** ✓; **the Toll Bell and the Great Pendant are nobody's best** in Tiers 2–3; the Tier 1 Orb best in 13 of 24 cells (near-ties) | ✗ two forms | SB8, SB9 |
| 4a | **The hybrid mirror** on the new maps | Equal ±5%, 70/30 ± 5 each way | The mirror drifts **1–12%** toward the Summoner in Tier 1, **3–19%** in Tiers 2–3; her split falls to **57/43** (53/47 in Tier 3) | ✗ | SB10, SB11 |
| 4b | **Paladin against Cleric** | ±10% | Equal in Tier 1; Guardian vs Bishop **−6.5%** (mends −13%), Templar vs Oracle **+7%** | ✓ | SB12 |
| 5 | **Defense:** a regular's 100% hit | 18.7% for a Brawler (WP15) | **18.7 · 18.3 · 18.1%** at Lv 50; 16.9–18.7% across levels; every class 17–24% | ✓ | SB13 |
| 6 | **MP** after the regen accessories | The Springs test (10–12 of 12); late-region pace within ±10% of today's | One stage: never binds (5–19 deep casts a bar). A region: every class binds; the casters' late coverage **100% → 30–60%**; the party's late-region power **0.41–0.52× today's** from Lv 30. **With SB18: 0.94–1.05×**, coverage 57–100% | ✗ → ✓ with SB18 | SB14, **SB18** |
| 7 | **Template budget** | About +5% matched (U12) | Signature **+5.2–6.1 · 4.6–5.3 · 4.3–4.8%** at Lv 50; matched affinity **+2.1–4.7%**; both **7–11%** | ✓ signature alone | SB15 |
| 8 | **Skill Ranks' neutrality** | ×1.00 on average | Balance party **1.000** over Lv 1–50; a real player's pace **1.014** (×1.05 from Lv 34) | ✓ | SB16 |
| 9 | **Shields** against answers | Rounds to the first Break within ±0.5 of Tier 1's | Answers 2.47 · 2.0 · 2.30 (bosses 3.53 · 3.67) ✓; bosses Break **0.5 rounds sooner** in Tiers 2–3 (Duals add multi-hit partners) | ✗ bosses | SB6 |

**Every tuning, before and after** (the full table in [§11](#11-the-proposed-tunings-before-and-after)):

| Tuning | From → to | Before → after |
|---|---|---|
| **Tier 2's toolbox term** (Z4) | HP and DEF +15% → **+27%** by Lv 50; offense +10% kept | A Tier 2 party 1.09–1.22× Tier 1's speed → **1.03–1.11×** |
| **Tier 3's toolbox term** (new) | none → HP and DEF **×1.08 at Lv 1 rising to ×1.48**; offense +10% | 1.25–1.85× → **1.02–1.11×** |
| **Bosses in Tiers 2–3** | the term → **the term × 1.1** | 1.11–1.25× → **0.96–1.09×** |
| **Boss shields** (CP8) | 6 · 8 · 9 → **6 · 9 · 10** | Breaks 0.54 · 0.51 rounds sooner than Tier 1 → **0.41 · 0.39** |
| **Toll Bell** (WP21) | +0.02 → **+0.05 a grade** each ring | Best in 0 of 24 cells → **1** (the Brawler's long fights, 26.3% against the Great Bell's 24.5%) |
| **Great Pendant** (WP20) | 0.5 → **0.55** a kind (Tier 3 0.55 → **0.575**) | 0 cells → **4** (Tier 2), **1** (Tier 3) |
| **Hybrids' presets** (WP25, EP29) | single-kind forms and the Full moon on her **lone** half → on her **lead** half | Summoner 57/43 → **68/32**; Spell Blade Tier 3 62/38 → **71/29** |
| **Summoner's Arms hand** (CP9) | 0.56 → **0.48** | Tier 1 mirror 0.88–0.99 → **0.97–1.06** |
| **A base MP regen** (new rule, SB18) | none → **0.8% of max MP a round per skill depth open** (4% from Class Rank 40) | Late-region party power 0.41–0.90× today's → **0.94–1.05×**; Mage and Summoner coverage 30–37% → **67–80%** |

## 1. The model

### 1.1 What it computes

For each **class (6), tier (1–3), tier level (10, 20, 30, 40, 50) and build stage**, the script builds her stat sheet by
source and her **expected damage per act** on a representative foe of her tier and level, then the checks below.
The script is `model.py`, `analysis.py` and `checks2.py` in the session scratchpad (not in the repo), with `sb18.py`
for a region act by act (A14, SB18); every number on the three pages is its output.

| Stage | What she has |
|---|---|
| **Bare** | Her level and her class's lean only: G0 weapons (no Might, Base ×1.3), no armor, no Extra Stats, no accessories. From Tier 2 her class branch's focus is on (it is her class, not her build) |
| **On curve** | **The balance party's build** (`balance-party.ts`, the foes' yardstick): every grade her level allows (grade g at Lv 5g − 4), every Extra Stats node her level opens, the presets (WP25's accessory forms, EP29's weapon moons), branch 1 (the owner's defaults), WP §3.8's weapon branches from G5, no template |
| **Fully built** | On curve, plus **her template** (the signature accessory worn, +0.2 a level × tier; her moon: knack at Lv 16, lead on her calling channel's defense at Lv 36, from extra-stats §6.5's six invented Umas) and **every skill at Rank 5** (×1.05) |
| **Tuned ceiling** (check 2 only) | Fully built, then every flat source stacked on her best kind: a Great Orb and a Channel Pendant at the kind cap, a Full weapon moon, Onslaught on her first act |

### 1.2 The formulas

| Piece | The formula (code) |
|---|---|
| Core stats | `projectRpgStats`: round(base ÷ 5 + lifetime × 1.5 × (1 + growth)); the average Uma's base 110 each, growth +10% Speed, Stamina, Power (`balance-party.ts`) |
| HP · MP · ATK · M.ATK · DEF · M.DEF | (100 + 5 Stamina + 2 Power + Guts) × lean · (20 + 1.5 Wit) × lean · Speed × lean · Speed × lean · Power × lean · (Power + Wit) ÷ 2 × lean; the v2 leans (class-progression §2.2) |
| Build values | Armor WP15 · the Planet, Prowess (her class's split), Vigor, Guard (EP3–EP7, EP23) · Might, accessory forms and the kind cap (WP §3.1, §5.4, WP24) · weapon moons (EP24–EP25), all × 1 · × 1.8 · × 2.6, rounded per node or grade as the docs' tables |
| A hit | WP31's stack: offense² ÷ (offense + defense) × power × hand × Skill Rank × weak multiplier × focus × Insignia (`battleDamage`) |
| The act | Her Attack share by class (WP §5.7: Brawler 30%, Mage 20%, hybrids 25%, healers 12%) at power 1.0, the rest her deepest open skill (`RPG_SKILL_POWER` 1.6 · 2.2 · 2.9 · 3.7 · 4.6, Class Rank = her level as the balance party); a hybrid one Arms half and one Tome half at her hands, the Summoner's Tome half × 1.09 for her farewell; a healer at 0.5; a Bell's follow-up on her Attack |
| Her choice | Each half swings the weapon of hers that lands weak (the strongest if several); on a foe none answers, an even spread over her weapons |
| The foe | `rpgFoe` at her tier level: reference stat on lifetime level, HP (40 + 4.2 s) and defense 0.8 s × role × `rpgFoeTierBudget` with **EP16's × tier** on the build part; offense from `rpgFoeHitShare` × the offense budget |
| Weaknesses | Tier 1 foes weak to a twin set, weighted by the world's 48 signatures (CP5); from Tier 2 regulars weak to one kind, by role (strikers and guards their element, casters and skirmishers their Arm, each with its role's defenses), Tier 3 sub-bosses too; bosses keep their twins (CP6) |

### 1.3 Assumptions

| # | Assumption | Why, and what it moves |
|---|---|---|
| A1 | **Lifetime levels as the approved sheets read them** (50 × (tier − 1) + level); the code's `rpgLifetimeLevels` is one lower | Reproduces the docs' sheets exactly. The code's sheet is HP 13–18 and ATK 1–3 lower at Lv 50; no share moves more than **0.65 points** (SB2) |
| A2 | Class Rank = her Uma level (the balance party's); Skill Ranks at their window's average (×1.00) on curve, ×1.05 at Class Rank 48–50 and fully built | The foes are tuned on the balance party; a real player's faster Class Rank is §9's |
| A3 | Attack shares are the docs' fixed shares (WP §5.7) inside one fight | MP over a region is §7's |
| A4 | The foe is a regular of the average role (DEF and M.DEF × 0.975), by role for Tier 2–3 regulars | One representative foe; the simulation plays the regions |
| A5 | The unbroken halving (×0.5) is left out of "damage per act" | The same factor in every tier and stage: it cancels in every comparison; §10 measures the Break itself |
| A6 | "Acts to fell" = the foe's HP ÷ her damage per act, averaged over foes | An index of pace, not rounds: a party's rounds also depend on waves, overkill and shields |
| A7 | Campaign context: first acts of a wave 33%, damage on elites 30% (WP §5.7) | Prices Onslaught and the Insignias as the docs do |
| A8 | Tuned 75% on one kind (a hybrid her twin set), long fight Attacks × 1.7 and elites 100%, waves Attacks × 0.6 and every set in turn (WP §5.7) | The viability contexts, as written |
| A9 | A Toll Bell rings on her Attacks: about 2 in a campaign fight, 6 in a long one (Attack share × 5 or 12 rounds) | The docs assumed longer fights; at these counts the Toll Bell never wins (§4.2) |
| A10 | A region is 60 acts (twelve stages of about five rounds) with one Spring on the way (two bars) | tier2-world §7: MP carries across a region, a party uses its Spring about once a region |
| A11 | Chips: a weak act lands its weapon's hits (Greatsword, Axe, Fire, Ice 1; Katana, Dark 2; Lance, Lightning 2.5; Bow, Light 3), the Spell Blade's Arms half one more, an Attack 1 | §10's rounds-to-Break index; class-progression §3.2's shapes |
| A12 | Her template's knack from the six invented Umas (extra-stats §6.5): Tireless (Brawler, Cleric), Clever (Mage), Fleet (Spell Blade), Gritty (Summoner), Mighty (Paladin) | Fully built only |
| A13 | Today's kit for the comparisons (§3.9, §5.1, §7): `BALANCE_KIT_V2` (an Orb on her first weapon, her support), `onCurveStars` (four stats), today's armor (+2 a grade, offense ⌈g ÷ 2⌉) | The re-baseline and the mirror are measured as drift from today's |
| A14 | **A region act by act** (§7.2, SB18): twelve stages of five acts, a full bar at the start and the Spring before stage 7; Auto greedy (her deepest skill whenever her MP covers it, else an Attack); regen at the end of each round; today's Spring 1 MP a round a grade, the Siphon 0.8% a grade of her average act's magical damage. **Region power** = her acts' mean power (deepest skill's power, an Attack 1.0); **late region** = the last four stages'; the party is the default five | The pace a region plays at, stage by stage. Coverage reads 0–4 points under §7.1's two-bars figure (MP left in her bar when the Spring refills is lost) |

### 1.4 What it reproduces

The model is checked against every number it should match before it is trusted with the rest:

| Against | Result |
|---|---|
| The approved Lv 50 sheets (class-progression §9, weapon-progression §4.4, extra-stats §8.2): 18 class-tier rows × HP, MP, ATK, M.ATK, DEF, M.DEF and offense on three kinds | **All 162 numbers exact** (Brawler 1,477 · 213 · 192 · 116 · 207 · 182 · 260 …; Cleric Tier 3 835 · 796 · 668) |
| extra-stats §9's defensive table (a reference Uma, Tier 1, Lv 10–50) | **Exact** (bare 28.5 → 41.7%, Extra Stats only 26.8 → 28.8%, both 23.7 → 23.5%) |
| WP15's regular hit on a Brawler at Lv 50 | **18.7%** physical, 19.5% magical |
| WP31's ceilings | ×1.495 · ×2.156 · ×2.493 |
| WP12's coverage | Regulars **2.47 · 2.00 · 2.30**, bosses 2.47 · 3.53 · 3.67 with a Cleric; 2.66 · 2.03 · 2.30 and 3.49 · 3.90 with a Paladin |
| WP §5.8's accessory shares | 7–10% · 18–22% · 28–33% (the docs: 7–9 · 18–22 · 27–34) |
| The hybrids' split today (H63's 70/30) | Spell Blade 69–70% physical, Summoner 63–70% magical on today's maps |

### 1.5 What it can't see

Fight order, targets and overkill; Auto's choices beyond "the weak weapon"; statuses, mends and Barriers as hit
points saved; waves; the unbroken halving's length (A5); MP inside a fight beyond A14's greedy Auto. These are the simulation's
([§12](#12-what-the-fight-simulation-must-confirm)). The model's job is the shape: which tier, class or piece moves,
by about how much, and which knob answers it.

## 2. SB1: every source keeps its share

**Target** (README §2.5): the build keeps the same share of every stat at each tier's Lv 50. **The build's share at
Lv 50, on curve** (armor, Extra Stats and her accessories and weapon moons on offense; Tier 1 · 2 · 3, the drift):

| Class | HP | MP | ATK | M.ATK | DEF | M.DEF | Offense, lead kind |
|---|---|---|---|---|---|---|---|
| **Brawler** | 27.4 · 28.6 · 29.1 (+1.7) | 38.0 · 39.7 · 40.3 (+2.3) | 39.6 · 39.9 · 40.0 (+0.4) | 18.1 · 18.4 · 18.5 (+0.4) | 44.0 · 44.3 · 44.4 (+0.4) | 50.0 · 50.3 · 50.4 (+0.4) | 55.4 · 61.0 · 61.1 (+5.7) |
| **Mage** | 32.6 · 33.9 · 34.4 (+1.8) | 27.4 · 28.8 · 29.4 (+2.0) | 18.1 · 18.4 · 18.5 (+0.4) | 38.6 · 38.9 · 38.9 (+0.3) | 48.9 · 49.4 · 49.4 (+0.5) | 45.0 · 45.4 · 45.5 (+0.5) | 56.6 · 63.3 · 65.1 (+8.5) |
| **Spell Blade** | 30.3 · 31.6 · 32.0 (+1.7) | 32.8 · 34.4 · 35.0 (+2.2) | 36.6 · 37.2 · 37.1 (+0.5) | 23.1 · 22.9 · 23.3 (+0.2) | 46.4 · 46.7 · 46.8 (+0.4) | 47.4 · 47.7 · 47.8 (+0.4) | 56.2 · 59.8 · 62.4 (+6.2) |
| **Summoner** | 30.3 · 31.6 · 32.0 (+1.7) | 32.8 · 34.4 · 35.0 (+2.2) | 23.1 · 22.9 · 23.3 (+0.2) | 36.6 · 37.2 · 37.1 (+0.5) | 46.4 · 46.7 · 46.8 (+0.4) | 47.4 · 47.7 · 47.8 (+0.4) | 53.8 · 59.8 · 62.4 (+8.6) |
| **Paladin** | 30.3 · 31.6 · 32.0 (+1.7) | 27.4 · 28.8 · 29.4 (+2.0) | 40.0 · 40.3 · 40.4 (+0.4) | 24.3 · 24.6 · 24.5 (+0.2) | 42.9 · 43.3 · 43.2 (+0.3) | 47.4 · 47.7 · 47.8 (+0.4) | 59.1 · 64.7 · 64.9 (+5.8) |
| **Cleric** | 30.3 · 31.6 · 32.0 (+1.7) | 27.4 · 28.8 · 29.4 (+2.0) | 24.3 · 24.6 · 24.5 (+0.2) | 40.0 · 40.3 · 40.4 (+0.4) | 46.4 · 46.7 · 46.8 (+0.4) | 44.0 · 44.3 · 44.4 (+0.4) | 56.8 · 65.8 · 67.7 (+10.9) |

**Each source, a Brawler** (share of the stat at Lv 50, Tier 1 · 2 · 3): HP armor 10.2 · 10.6 · 10.8, the Planet 7.1 ·
7.5 · 7.6, Vigor 10.2 · 10.6 · 10.8; ATK armor 13.0 · 13.1 · 13.1, the Planet 10.9 · 11.1 · 11.1, Prowess 15.6 · 15.7 ·
15.8; DEF armor 19.3 · 19.5 · 19.5, the Planet 10.1 · 10.3 · 10.3, Guard 14.5 · 14.6 · 14.6. Every class on
[the sheets page](previews/balance-sheets.html#share).

- **It holds.** Every core stat of every class moves **at most 2.3 points** from Tier 1 to Tier 3; ATK, M.ATK, DEF and
  M.DEF **at most 0.5**. With flat values (the first round) the same shares fell 8.6–13.2 points.
- **Why HP and MP edge up 1.7–2.3 points:** their level parts carry constants that don't grow with the tier (HP's 100,
  MP's 20, the base stats' 22), so her level part grows a little slower than × 1.8 and × 2.6 and the build's share
  creeps up. It is a point a tier; no multiplier change is worth it.
- **Offense rises on purpose:** the weapon moons and the accessory branches are each tier's added depth (55 → 61 → 61%
  for a Brawler's lead kind; 57 → 66 → 68% for a Cleric's Light, where her Channel Pendant and a Full moon stack).
  §3 prices that depth.
- **Mid-tier, the later tiers' build is a smaller share** (a Brawler's DEF at Lv 10: 20.4% · 13.1% · 11.5%), because her
  level restarts high while her build restarts at G0. **The foes follow the same curve:** EP16's budget scales its build
  part by × tier × ref(ℓ) ÷ ref(L), the same factor, so the fight holds. SB1 is a Lv 50 rule by design; the sheets page
  draws every level.
- **The code's lifetime level** is one lower than the approved sheets' (A1): HP 13–18 and ATK 1–3 lower at Lv 50, shares
  within 0.65 points. The docs' sheets stand; the implementation's sheets read the code (SB2).

**Calls:** SB1 holds as the final rule, ×1 · ×1.8 · ×2.6 (SB1); this model is the pre-simulation yardstick (SB2).

## 3. The damage stack and the foe budget

### 3.1 The ceilings on one weak hit

WP31's steps 3 and 4 (weak multiplier × the percentages), the docs' figures reproduced, and what each fallback buys:

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **As written** (signature in the affinity's place) | **×1.495** (×1.3 × Insignia 1.15, a boss) | **×2.156** (Pure ×1.5 × focus 1.15 × Onslaught 1.25) | **×2.493** (Keen ×1.7 × 1.15 × Onslaught 1.275) |
| With the affinity kept as well | ×1.585 | ×2.286 | ×2.642 |
| Fallback 1: focus +10% | ×1.495 | ×2.062 | ×2.384 |
| Fallback 2: Insignias a step down (×0.8) | ×1.456 | ×2.070 | ×2.385 |
| Fallback 3: Keen ×1.6 | ×1.495 | ×2.156 | ×2.346 |
| All three | ×1.456 | ×1.980 | ×2.147 |
| Today | ×1.3 | — | — |

**Flat offense on one kind** (WP24, EP27): Might + the kind cap + a Full weapon moon = **136 · 334 · 484**, as the docs
say. With her stat and her signature, her best kind tops at **304 · 695 · 1,005** (a Brawler's Greatsword) against her
on-curve lead kind's **260 · 528 · 763**.

### 3.2 The tuned peak against the campaign's average

Her strongest act (fully built, tuned to her best kind, on a foe weak to it, her first act of a wave) against her
on-curve campaign act:

| Class | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Brawler | 1.27 (Greatsword 304) | 1.59 (Greatsword 695) | 1.80 (Greatsword 1,005) |
| Mage | 1.26 (Fire 309) | 1.65 (Ice 704) | 1.92 (Ice 1,019) |
| Spell Blade | 1.30 (Lance 295) | 1.63 (Lance 680) | 1.94 (Lance 982) |
| Summoner | 1.31 (Light 295) | 1.44 (Light 680) | 1.61 (Light 982) |
| Paladin | 1.42 (Greatsword 287) | 1.98 (Greatsword 665) | 2.18 (Greatsword 963) |
| Cleric | 1.46 (Light 287) | 1.69 (Ice 665) | 1.94 (Light 963) |
| **The party** (default five) | **1.32** | **1.60** | **1.84** |

The spread between a tuned peak and the campaign's average grows a tier at a time, as the docs designed (tuned forms,
Keen, Full moons). It is the Rift's to budget, where the guided builds are tuned (CP7): its Tier 2 and 3 fronts must price
a tuned party at about 1.6 and 1.8 times the campaign's act, not Tier 1's 1.3 (SB7).

### 3.3 The toolboxes against the foes

**The measure:** acts for one Uma to fell a regular (A6), on curve, against Tier 1 at the same tier level. Above 1 she
fells it faster than Tier 1 does: the build outruns the foes. The party is the default five with a Cleric.

| Tier · level | No term | **Z4's draft** (+15% HP and DEF, +10% offense) | **Proposed** (SB3, SB4) | Boss, no term | Boss, proposed | **Boss, proposed × 1.1** (SB5) | Fully built, proposed | Bare, proposed |
|---|---|---|---|---|---|---|---|---|
| Tier 2 · Lv 10 | 1.13 | 1.09 | **1.06** | 1.23 | 1.15 | **1.00** | 1.04 | 1.15 |
| Tier 2 · Lv 20 | 1.20 | 1.11 | **1.04** | 1.33 | 1.16 | **1.02** | 1.03 | 1.09 |
| Tier 2 · Lv 30 | 1.36 | 1.21 | **1.10** | 1.48 | 1.21 | **1.05** | 1.09 | 0.98 |
| Tier 2 · Lv 40 | 1.43 | 1.22 | **1.08** | 1.55 | 1.18 | **1.02** | 1.08 | 0.86 |
| Tier 2 · Lv 50 | **1.46** | **1.19** | **1.03** | 1.57 | 1.11 | **0.96** | 1.03 | 0.72 |
| Tier 3 · Lv 10 | 1.25 | (none) | **1.03** | 1.38 | 1.13 | **0.99** | 1.00 | 1.04 |
| Tier 3 · Lv 20 | 1.38 | | **1.02** | 1.50 | 1.12 | **0.98** | 1.01 | 0.96 |
| Tier 3 · Lv 30 | 1.63 | | **1.11** | 1.83 | 1.25 | **1.09** | 1.09 | 0.85 |
| Tier 3 · Lv 40 | 1.76 | | **1.10** | 1.96 | 1.22 | **1.06** | 1.08 | 0.71 |
| Tier 3 · Lv 50 | **1.85** | | **1.05** | 2.04 | 1.15 | **1.00** | 1.04 | 0.56 |

- **The finding:** each standalone doc priced its own Tier 2 and 3 pieces as "the tier's added depth, priced in its
  term" (CP §15, WP §13, EP §10), and Z4's draft term was sized for Tier 2's earlier tools (weapon arts, sets, advanced classes: +20–30% damage).
  Summed, the approved tools add far more: **+46% at Tier 2's Lv 50 and +85% at Tier 3's.** Z4's draft absorbs about
  half of Tier 2's; Tier 3 has no term yet.
- **Per class at Lv 50, no term:** Tier 2 1.37 (Paladin) to 1.52 (Summoner); Tier 3 1.77 (Spell Blade) to 1.95
  (Summoner).
- **Fully built** (template, Rank 5) lands within 10% of Tier 1's fully built in every tier with the proposed terms: a
  template and Skill Ranks add the same share in every tier.
- **Bare** falls behind faster in later tiers (0.72 at Tier 2's Lv 50, 0.56 at Tier 3's): the terms price a toolbox
  she doesn't have. The build matters more each tier, as the owner asked.

### 3.4 Where the gain comes from

**Three factors,** the party at each level: **S** (structural: the foes' HP carries a constant 40 that doesn't scale, so
a later tier's foe is a little softer for her level; it exists today, and Z3's simulation measured it inside 10%),
**N** (the narrowing: regulars weak to one kind from Tier 2, CP6) and **K** (the toolbox):

| Tier · level | S | N | **K, the toolbox** | In all | K by piece: focus · weapon branches · accessories · weapon moons |
|---|---|---|---|---|---|
| Tier 2 · Lv 10 | 1.03 | 0.94 | 1.17 | 1.13 | 1.12 · 1.00 · 1.00 · 1.03 |
| Tier 2 · Lv 30 | 1.04 | 0.94 | 1.39 | 1.36 | 1.12 · 1.05 · 1.08 · 1.10 |
| Tier 2 · Lv 50 | 1.03 | 0.94 | **1.51** | 1.46 | **1.12 · 1.05 · 1.13 · 1.14** |
| Tier 3 · Lv 10 | 1.04 | 0.94 | 1.28 | 1.25 | 1.12 · 1.05 · 1.04 · 1.05 |
| Tier 3 · Lv 30 | 1.07 | 0.94 | 1.63 | 1.63 | 1.12 · 1.10 · 1.15 · 1.15 |
| Tier 3 · Lv 50 | 1.05 | 0.94 | **1.88** | 1.85 | **1.12 · 1.10 · 1.25 · 1.23** |

- **Four pieces of about the same size:** the focus (+12%, from Tier 2's first level), the weapon branches (+5%, +10%
  with Keen and the second two-kind weapon), the accessory slots and branches (+13%, +25%), the weapon moons (+14%,
  +23%). Each doc's own number was right; together they compound.
- **Tier 3 starts strong:** its Uma arrives with her branches (Pure, Dual), three slots and the focus, so K is 1.28 at
  Lv 10. A Tier 3 term should start above 1 (SB4).

### 3.5 The fallback knobs, measured

What the docs' named knobs take off, the party at Lv 50 (acts against Tier 1; the term that would restore Tier 1):

| Knob | Tier 2 | Tier 3 |
|---|---|---|
| None | 1.47 (term ×1.30) | 1.87 (×1.53) |
| The focus +15% → +10% (CP39) | 1.42 (×1.27) | 1.80 (×1.50) |
| The Insignias a step down (×0.8) | 1.45 (×1.29) | 1.84 (×1.52) |
| Keen ×1.7 → ×1.6 (WP9) | 1.47 (×1.30) | 1.86 (×1.53) |
| The accessory branches × 0.8 together (WP §13) | 1.44 (×1.28) | 1.81 (×1.50) |
| **All four** | 1.37 (×1.24) | 1.71 (×1.44) |

**The knobs can't do it alone:** all four together take Tier 2's lead from 47% to 37% and Tier 3's from 87% to 71%,
and cost the owner the impact he asked for. **The terms are the right tool;** the knobs stay in reserve for the
simulation (SB7).

### 3.6 The proposed terms

One shape for both tiers, **Z4's own shape** (a factor on the foes' HP and defense and one on their offense, linear in
the tier level ℓ), sized to price the toolbox and the narrowing (K × N), leaving the structural S that Z3 accepted:

| | HP and DEF | Offense | Lv 10 · 20 · 30 · 40 · 50 (HP and DEF) |
|---|---|---|---|
| **Tier 2** (Z4, changed) | 1 + **0.27** (ℓ − 1) ÷ 49 (was 0.15) | 1 + 0.10 (ℓ − 1) ÷ 49 (kept) | 1.05 · 1.10 · 1.16 · 1.22 · **1.27** |
| **Tier 3** (new) | **1.08** + **0.40** (ℓ − 1) ÷ 49 | 1 + 0.10 (ℓ − 1) ÷ 49 | 1.15 · 1.24 · 1.32 · 1.40 · **1.48** |
| **Bosses, Tiers 2–3** | The tier's term × **1.1** | The tier's | — |

- **What it needs, measured:** to price K × N exactly, Tier 2 needs ×1.06 · 1.09 · 1.21 · 1.25 · 1.27 and Tier 3 ×1.14
  · 1.23 · 1.36 · 1.43 · 1.48 at Lv 10–50; to bring rounds all the way to Tier 1's, ×1.30 and ×1.53 at Lv 50. The
  two shapes sit within 0.05 of the need at every level.
- **The offense part stays +10%:** Z4 drafted it for sustain (set bonuses and the healers' passives); the sets are gone
  and the passives became the healers' focus (+15% on their mends and Barriers), the same size. Tier 3's masteries add
  sustain (Last Stand, Overflow) of the same order.
- **Bosses × 1.1:** a boss keeps her twins in every tier (CP6), so the narrowing that slows regulars never reaches her,
  and Pure and Keen land on her more often: on curve a party fells a Tier 2 boss 1.11–1.21× as fast as Tier 1 with the
  tier's term alone, 0.96–1.05× with the extra tenth.
- **With the terms the regulars land at 1.03–1.11** (the structural S included, which Z3's simulation accepted), the
  bosses at 0.96–1.09, the fully built at 1.00–1.09: inside Z4's ±10% band everywhere but Lv 30 (1.10 and 1.11), at its
  edge.

### 3.7 Tier 1 against today's kit (the re-baseline's build part)

README §9.5 item 1 re-baselines Tier 1 against today's table. The build part alone (the rework's sheet against today's
on-curve kit, the same three weapons and the same weaknesses, campaign act):

| Class | Lv 10 · 20 · 30 · 40 · 50 | With Skill Ranks at Lv 50 |
|---|---|---|
| Brawler, Mage, Spell Blade, Paladin, Cleric | 0.97–1.02 at every level | +4.5% to +7% |
| **Summoner** | 1.04 · 1.06 · 1.09 · 1.12 · **1.16** | +21% |

- **The new build matches today's within 2%** for five classes: armor, the Planet and the moons, and one accessory are
  worth what today's armor, stars, Orb and support were. The re-baseline's real movers are the weaknesses (twins, three
  weapons: about half the acts land weak, CP §15) and Skill Ranks (+5% at Lv 50).
- **The Summoner gains 16%:** Prowess puts ATK on her Arms half (+30, today 0) and her preset puts its Orb on her Bow.
  §5 answers it.

## 4. Accessories: their share, viability and parity

### 4.1 The share of her damage

The presets (WP25) against no accessory, on curve, campaign act (Lv 10 · 20 · 30 · 40 · 50):

| Class | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Brawler | 2.9 · 4.6 · 5.6 · 6.1 · **7.3** | 4.9 · 7.5 · 14.5 · 17.7 · **21.7** | 7.8 · 14.1 · 21.2 · 27.1 · **33.1** |
| Mage | 2.4 · 2.9 · 4.8 · 6.4 · **7.7** | 2.6 · 4.2 · 11.0 · 15.0 · **18.7** | 6.1 · 11.4 · 17.5 · 22.9 · **27.8** |
| Spell Blade | 2.7 · 3.4 · 5.7 · 7.5 · **9.0** | 2.2 · 4.3 · 11.5 · 15.7 · **19.5** | 4.4 · 9.9 · 17.4 · 24.8 · **29.7** |
| Summoner | 2.5 · 4.7 · 6.8 · 8.8 · **10.1** | 1.9 · 3.9 · 12.2 · 16.6 · **20.7** | 4.7 · 10.8 · 18.9 · 26.9 · **32.2** |
| Paladin | 2.9 · 3.5 · 5.9 · 7.7 · **9.2** | 3.1 · 5.0 · 12.5 · 16.2 · **18.4** | 4.6 · 10.0 · 16.9 · 23.9 · **28.4** |
| Cleric | 2.6 · 4.7 · 6.8 · 8.9 · **10.1** | 3.0 · 4.8 · 12.3 · 16.7 · **20.7** | 4.8 · 10.3 · 18.5 · 25.5 · **30.3** |

**The docs' 18–22% and 27–34% hold** (the model: 18.4–21.7% and 27.8–33.1%). Tier 2's branches arrive at the slots' G5
(Lv 21): the share jumps from 4–8% at Lv 20 to 11–15% at Lv 30. It is a third of §3.4's toolbox, priced in the terms.

### 4.2 Every form someone's best

WP §5.7's four contexts, every form alone at its best setting, at Lv 50; the best form of each class and context
(24 cells a tier):

| Tier | Best in (cells of 24) | Never best | Over half |
|---|---|---|---|
| **Tier 1** (base forms) | Orb 13 · Pendant 8 · Insignia 2 · Bell 1 | — | **Orb 13** (by one) |
| **Tier 2** (branches) | Twin Orb 7 · Great Orb 6 · Channel Pendant 4 · Great Insignia 3 · Great Bell 2 · Onslaught 2 | **Great Pendant, Toll Bell** | — |
| **Tier 3** (a step deeper) | Twin Orb 7 · Great Orb 6 · Onslaught 4 · Great Insignia 3 · Channel Pendant 2 · Great Bell 2 | **Great Pendant, Toll Bell** | — |
| **Tier 2, tuned** (SB8) | Great Orb 6 · Twin Orb 5 · **Great Pendant 4** · Great Insignia 3 · Channel Pendant 2 · Onslaught 2 · Great Bell 1 · **Toll Bell 1** | — | — |
| **Tier 3, tuned** | Great Orb 6 · Twin Orb 6 · Onslaught 4 · Great Insignia 3 · Channel Pendant 2 · **Great Pendant 1** · Great Bell 1 · **Toll Bell 1** | — | — |

- **The Toll Bell never wins** where fights are as long as they are. At G10 it rings 0.5, 0.7, 0.9 … up to 2.0; it beats
  the Great Bell's flat 1.4 only after 11 rings, a 22-round fight for a Brawler who Attacks half the time. A long fight
  rings about six times (A9): 1.0 on average. **Proposed: its step +0.02 → +0.05 a grade** (G10: 0.5, 1.0, 1.5, 2.0 …):
  six rings average 1.5, so it wins the Brawler's long fights in Tiers 2 and 3 (26.3% and 28.9% against the Great
  Bell's 24.5% and 26.0%) and loses the campaign's two-ring fights (5.8% against 10.8%), as WP21 means it to.
- **The Great Pendant is dominated by the Channel Pendant:** 0.5 on three kinds is 1.5 Orbs, 0.8 on two is 1.6; it wins
  only when her third kind carries more than about 37% of her damage, which no class's spread does. **Proposed: 0.5 →
  0.55 a kind in Tier 2, its Tier 3 step 0.55 → 0.575** (G10 +31 → +34, +49 → +51). It then wins the Spell Blade's
  and the Paladin's campaigns and waves (10.8% and 11.3% against the Channel Pendant's 9.8% and 11.0%), its WP §5.7
  role "left on all region long". At 0.6 in Tier 3 the Channel Pendant would lose everywhere; 0.575 keeps both.
- **The Tier 1 Orb is best in 13 of 24 cells**, one over WP §5.7's half: its tuned job (6 cells) and the Summoner's and
  the Cleric's spread (their damage leans on one kind), two of them near-ties (the Cleric's waves 9.2% against the
  Pendant's 9.0%, the Summoner's 9.9% against 9.2%). The docs' model had 12. **Kept;** the simulation's item 7 decides
  with the docs' knob (the Orb's per-grade values a step down) if it confirms 13.
- **The Brawler's Tier 1 preset** is the Bell (WP25); this model puts the Pendant 0.6 points ahead of it in the campaign
  (7.9% against 7.3%) where the docs' had the Bell 0.3 ahead. A near-tie either way; the Bell wins her long fights
  (17.3% against 7.9%). Kept.

### 4.3 Channel parity

The owner's note (D193): every family's best form worth the same to a Brawler as to a Mage, within ±1 point. Brawler
minus Mage, every context and tier:

| Family | As the classes play (Attack shares 30% and 20%) | At an equal Attack share |
|---|---|---|
| Pendant | −0.1 to +0.3 | −0.1 to +0.3 |
| Orb | 0.0 to +0.4 | 0.0 to +0.4 |
| Insignia | −0.1 to 0.0 | −0.1 to 0.0 |
| **Bell** | **+1.4 to +11.8** | **−0.2 to 0.0** |

**Channel-neutral by construction, confirmed.** The Bell's lead for the Brawler is her Attack share (she Attacks 30% of
her acts, a Mage 20%), not her channel: at an equal share the two are within 0.2 points. WP §5.7 already makes the Bell
"the Brawler's"; once the Siphon is gone a Mage Attacks more (§7) and the gap narrows. The parity rule reads at an equal
Attack share (SB9).

## 5. The mirrors

### 5.1 Spell Blade against Summoner

**Target** (CP9, XR5): equal damage a turn within ±5%, each 70/30 ± 5 her way, on the full maps; **the knob is the
hands, the Summoner's Arms hand first, never the map.** The model can't reproduce H63's absolute equality (its farewell
and areas are approximations), so it measures **drift**: the new maps' ratio against today's, level by level, today's
being where H63 left them equal. Spell Blade ÷ Summoner, on curve, campaign:

| | Lv 10 | 20 | 30 | 40 | 50 | Splits at Lv 50 (Spell Blade physical · Summoner magical) |
|---|---|---|---|---|---|---|
| **Today** (H63) | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 69% · 70% |
| **Tier 1, as written** | 0.99 | 0.94 | 0.92 | 0.90 | **0.88** | 71% · **57%** |
| Tier 2: Rune Knight ↔ Conjurer (the Ring mirror, CP40) | 0.91 | 0.87 | 0.86 | 0.84 | **0.82** | 65% · 53% |
| Tier 2: Blademaster ↔ Warlock (the Light/Dark mirror) | 0.97 | 0.94 | 0.92 | 0.90 | **0.88** | 67% · 56% |
| Tier 3: Rune Knight ↔ Conjurer | 0.92 | 0.88 | 0.85 | 0.83 | **0.81** | 62% · 54% |
| Tier 3: Blademaster ↔ Warlock | 0.97 | 0.93 | 0.90 | 0.88 | **0.86** | 63% · 53% |

**Why it moves, three causes:**
1. **Prowess's split is symmetric, today's maps weren't.** Today the Spell Blade's map held ATK and M.ATK stars and the
   Summoner's only M.ATK, which is why H63 raised her Arms hand to 0.56. Prowess gives the Summoner +30 ATK (9 Prowess,
   21 the Planet) and the Spell Blade M.ATK +30 instead of +52: the Summoner's Arms half gains, at a hand built for an
   Arms half with no stars. It grows with level, as the stars did.
2. **The presets stack flat offense on her lone half.** EP29's rule ("most-used: a hybrid's lone half, in every act") and
   WP25's single-kind forms put the Orb, the Great Orb and the Full weapon moon on the Summoner's Bow and the Spell
   Blade's Thunder Tome: the minor half. Her minor hand is 0.56 against the Spell Blade's 0.44, so the same flat
   offense is worth more to her; and **both hybrids drift toward 60/40** (Tier 3: 62/38 and 53/47).
3. **The Rune Knight's Katana is off her focus** (CP40: the default party's only Katana), so her Ring mirror, the
   Conjurer, boosts three weapons to her two: about 5% more in Tiers 2–3.

**Proposed** (SB10, SB11): **a hybrid's single-kind accessory forms and her Full weapon moon go on her lead half's
kinds** (her Twin Orb and Split moon may still span both halves), and **the Summoner's Arms hand 0.56 → 0.48**:

| | Lv 10 | 20 | 30 | 40 | 50 | Splits at Lv 50 |
|---|---|---|---|---|---|---|
| **Tier 1, tuned** | 1.06 | 1.01 | 0.99 | 0.98 | **0.97** | 71% · **68%** |
| Tier 2: Rune Knight ↔ Conjurer | 0.98 | 0.94 | 0.93 | 0.92 | 0.91 | 71% · 72% |
| Tier 2: Blademaster ↔ Warlock | 1.03 | 1.00 | 0.99 | 0.97 | **0.95** | 73% · 67% |
| Tier 3: Rune Knight ↔ Conjurer | 0.97 | 0.94 | 0.91 | 0.89 | 0.87 | 71% · 68% |
| Tier 3: Blademaster ↔ Warlock | 1.04 | 1.01 | 0.98 | 0.97 | **0.95** | 73% · 67% |

- **Tier 1 holds within +6/−3%** at every level and **both splits return to 70/30 ± 5 in every tier** (71/29, 67–72%
  magical).
- **The presets' cost:** the Summoner's act −4% (her Orb on her Light, not her Bow; Tiers 1 and 3), the Spell Blade's
  −2% in Tier 3: noise for the foe budget, which prices the presets.
- **What stays:** the Ring mirror in Tiers 2–3 (−7% to −13% at Lv 30–50) is the Rune Knight's off-focus Katana, a party
  duty CP40 kept. Its knob is the Rune Knight's three class skills (CP34, priced +10–20% in their context by Tier 2's
  simulation), not the hands, which would unbalance Tier 1.
- **Why not one hand alone:** at 0.44 the Tier 1 mirror spans +8% to −3%, and the Summoner's split stays 62/38: the
  presets are what holds the identity.

### 5.2 Paladin against Cleric

**Target** (CP9): sustain within ±10%. Mends and Barriers are a share of max HP × (1 + her ATK or M.ATK ÷ 300) × her
Skill Rank, and a healer's focus adds +15% on its group's mends and Barriers (CP39); no Might, accessory or weapon moon
reaches them (WP31). The leans and Prowess mirror (80/20 and 20/80), so in **Tier 1 they are equal** (heal scale 1.58 at
Lv 50 for both).

| Branch pair, Tiers 2–3 | Mends (her Light Tome) | Barriers (her Arms) | Both, half each |
|---|---|---|---|
| **Guardian (Ring) ÷ Bishop (Light/Dark)**, the defaults | **0.87** (Light is off the Guardian's focus) | 1.00 | **0.935** |
| Templar (Light/Dark) ÷ Oracle (Ring) | 1.15 | 1.00 | 1.070 |

**Inside ±10%; kept** (SB12). The asymmetry follows the focus: a Ring healer's mends come from her Light Tome, which is
Light/Dark. Their damage per act stays within 2–5% at every tier and level.

## 6. Defense: a regular's hit

**Target** (WP15): a regular's 100% hit takes about **18.7%** of an on-curve Brawler's HP at Lv 50 (the budget's nominal
28% on a bare reference Uma; armor's support-worth the margin). Physical, no evasion, on curve:

| Class | Tier 1, Lv 10 · 20 · 30 · 40 · 50 | Lv 50: Tier 1 · 2 · 3 (physical · magical) | With the proposed terms' offense, Lv 50: Tier 2 · 3 |
|---|---|---|---|
| **Brawler** | 17.6 · 16.9 · 16.9 · 17.6 · **18.7** | 18.7 · 19.5 \| 18.3 · 19.1 \| 18.1 · 18.9 | 20.4 · 20.1 |
| Mage | 23.0 · 21.7 · 21.2 · 21.9 · 23.0 | 23.0 · 22.4 \| 22.4 · 21.8 \| 22.2 · 21.6 | 24.9 · 24.6 |
| Spell Blade, Summoner | 20.5 · 19.5 · 19.2 · 19.9 · 21.0 | 21.0 · 21.1 \| 20.5 · 20.7 \| 20.3 · 20.4 | 22.8 · 22.5 |
| Paladin | 19.8 · 18.9 · 18.6 · 19.4 · 20.5 | 20.5 · 21.1 \| 20.0 · 20.7 \| 19.7 · 20.4 | 22.3 · 22.0 |
| Cleric | 20.5 · 19.5 · 19.2 · 19.9 · 21.0 | 21.0 · 20.6 \| 20.5 · 20.2 \| 20.3 · 19.9 | 22.8 · 22.5 |

- **It holds:** 18.7% at Tier 1's Lv 50 exactly, 18.3% and 18.1% in Tiers 2 and 3 (the docs: within 0.1; HP's
  constant 100 is the 0.4–0.6), 16.9–18.7% across Tier 1's levels. Feet armor's 12% evasion takes a further 12% off every
  hit.
- **The terms' offense part** (+10% by Lv 50) brings Tier 2 and 3 to **20.1–20.4%**, today's 20.0%: what Z4 prices is
  the sustain the healers' focus adds. Armor stays as drafted (SB13); its knob, if the re-baseline's survival lands
  outside, stays armor's HP a grade.

## 7. MP after the regen accessories

**Target** (README §9.5 item 5): the Springs test, a region on Auto clearing 10–12 of 12 with **no MP accessory** and
the map's +51 MP; and (SB18) **the region's pace**: the party's act power late in a region within ±10% of today's.

### 7.1 As written

**Deep casts a bar** (her pool ÷ her deepest skill's cost: 10 · 14 · 18 · 22 · 26 MP × her MP hand × the tier's ×1,
×1.7, ×2.4), and a region's coverage (A10: 60 acts, two bars):

| Class | Rework, Tier 1 Lv 10 → 50 | Today, with her regen | Rework Lv 50: Tier 1 · 2 · 3 | Region coverage, rework, Lv 10 → 50 | Today | Region power, rework ÷ today |
|---|---|---|---|---|---|---|
| Brawler | 4.9 · 5.5 · 6.0 · 6.6 · 8.2 | 4.6 → 5.8 (no regen) | 8.2 · 8.3 · 8.4 | 16 → 27% | 15 → 20% | 1.02 → **1.17** |
| **Mage** | 7.6 · 8.2 · 8.8 · 9.3 · 11.4 | 13 → **152** (Siphon) | 11.4 · 11.5 · 11.5 | 26 → 38% | 34 → **100%** from Lv 30 | 0.93 → **0.46–0.52** |
| Spell Blade | 6.1 · 6.6 · 7.2 · 7.7 · 9.5 | 5.7 → 7.2 (no regen) | 9.5 · 9.6 · 9.7 | 20 → 32% | 19 → 24% | 1.01 → **1.15** |
| **Summoner** | 6.1 · 6.6 · 7.2 · 7.7 · 9.5 | 9 → **74** (Siphon) | 9.5 · 9.6 · 9.7 | 20 → 32% | 24 → **100%** | 0.96 → **0.47** |
| Paladin | 12.7 · 13.7 · 14.7 · 15.6 · 19.0 | 12 → 15 (no regen) | 19.0 · 19.1 · 19.2 | 42 → 63% | 40 → 50% | 1.01 → **1.17** |
| **Cleric** | 12.7 · 13.7 · 14.7 · 15.6 · 19.0 | 26 → **54** (Spring) | 19.0 · 19.1 · 19.2 | 42 → 63% | 64 → **100%** | 0.85 → **0.71** |

- **In one stage MP never binds:** every class holds 5–19 deep casts against about five acts.
- **Over a region it binds every class now.** Today the Siphon (8% of magical damage) and the Spring (10 MP a round)
  made the Mage, the Summoner and the Cleric unbound from about Lv 30: a Mage's deep cast refunded more than it cost
  (WP §5.1 said so). Without them, their late region power (A10: skills while MP lasts, then Attacks) falls to about half
  today's (the Cleric's to two thirds); the three classes that wore no regen gain 15–17% (legs +10, Vigor +30, the Planet +21).
- **The party, act by act** (A14): its region power is **0.94 · 0.85 · 0.71 · 0.63 · 0.67×** today's at Lv 10–50,
  and in a region's last four stages **0.90 · 0.74 · 0.52 · 0.41 · 0.42×**: from Lv 30 the casters' bars are empty
  for the second half of each bar's run and everyone Attacks. That is pace, not only clears.
- **No pool knob answers it** (Tier 1, a Mage's deep casts a bar at Lv 50): as written 11.4; legs +3 → +4 a grade **11.8
  (+3%)**; Vigor's MP ×2 **12.5 (+10%)**; both 12.9. A bigger bar empties as surely; what the region lost is MP coming
  back. **SB14** re-ranked these knobs; **SB18** (below) is the fix.

### 7.2 SB18: a base MP regen for every Uma

**The rule (a rule of the game, in every fight, campaign and Rift; never an item, so never a pick):** at the end of each
round, **every Uma regains 0.8% of her max MP for each skill depth her class has open**, rounded, at least 1:

| Class Rank | 1 | 10 | 20 | 30 | 40+ |
|---|---|---|---|---|---|
| Depths open (the deepest skill's MP, before her hand and the tier) | 1 (10) | 2 (14) | 3 (18) | 4 (22) | 5 (26) |
| **Her MP back a round** | **0.8%** | **1.6%** | **2.4%** | **3.2%** | **4%** |

On the balance party (Class Rank = her level), a Mage at Tier 1 Lv 10 · 20 · 30 · 40 · 50: bar 107 · 148 · 194 · 243 ·
296, back a round **2 · 4 · 6 · 10 · 12** MP, against her deepest skill's 14 · 18 · 22 · 26 · 26.

- **Why a share of her max MP:** it is tier-free under SB1 (her bar and her skills' MP both grow × 1.7–1.8 and ×
  2.4–2.6), it follows her MP lean (a Mage's 1.3 bar gets back more than a Brawler's 0.8), and it is the game's own idiom
  (the Stayer's Second wind is 3% a round; Clarity 4% a stack).
- **Why it steps up with her depths:** her deepest skill costs 10 → 26 MP as her depths open, so the regen keeps the same
  share of what she casts; today's regen grew with its grade the same way. A flat share over-feeds the first levels or
  starves the last (the table below); a real player's faster Class Rank (§9) gets her regen with the skills that need it.
- **Where it lives:** engine v16's round-end step, the one the Spring Amulet used (`mpRegen`), set when the fight
  starts; the battle log's MP cue as today's. Her stat sheet shows it beside her MP ("MP 296 · +12 a round").

**The party, act by act** (A14; Tier 1, the default five, ÷ today's at the same level):

| Lv | 10 | 20 | 30 | 40 | 50 |
|---|---|---|---|---|---|
| Region power, as written | 0.94 | 0.85 | 0.71 | 0.63 | 0.67 |
| **Region power, SB18** | **1.04** | **1.06** | **1.01** | **1.01** | **1.06** |
| Late region (the last four stages), as written | 0.90 | 0.74 | 0.52 | 0.41 | 0.42 |
| **Late region, SB18** | **1.05** | **1.04** | **0.94** | **0.94** | **1.01** |

**Each class: a region's deep-cast coverage** (A14; Tier 1, Lv 10 · 20 · 30 · 40 · 50) and her region power against
today's at Lv 50:

| Class | Today (her support) | As written | **SB18** | Region power ÷ today, Lv 50: as written → SB18 |
|---|---|---|---|---|
| Brawler | 13 · 13 · 13 · 17 · 17% (Vampire) | 13 · 17 · 20 · 20 · 27% | **23 · 30 · 37 · 47 · 57%** | 1.22 → 1.90 |
| **Mage** | 33 · 57 · 100 · 100 · 100% (Siphon) | 23 · 27 · 27 · 30 · 37% | **37 · 43 · 57 · 67 · 80%** | 0.50 → **0.84** |
| Spell Blade | 17 · 17 · 20 · 20 · 23% (Vampire) | 20 · 20 · 23 · 23 · 30% | **27 · 37 · 43 · 53 · 67%** | 1.13 → 1.85 |
| **Summoner** | 23 · 33 · 53 · 87 · 100% (Siphon) | 20 · 20 · 23 · 23 · 30% | **27 · 37 · 43 · 53 · 67%** | 0.45 → **0.74** |
| Paladin | 40 · 40 · 40 · 40 · 50% (Thorn) | 40 · 43 · 47 · 50 · 60% | **60 · 77 · 93 · 100 · 100%** | 1.13 → 1.64 |
| **Cleric** | 63 · 77 · 83 · 90 · 100% (Spring) | 40 · 43 · 47 · 50 · 60% | **60 · 77 · 93 · 100 · 100%** | 0.69 → **1.00** |

- **The party is back on today's pace** at every level: region power 1.01–1.06×, late region 0.94–1.05×. The foes were
  tuned on today's regions, so no term moves (SB3–SB5 price the act, not MP).
- **The Cleric is whole (100%), the Mage and the Summoner get back two thirds of what they lost** (37 → 80%, 30 → 67%).
  **The brief's two targets can't both hold for a rule every Uma shares:** the Spell Blade and the Summoner have the same
  bar and the same costs (lean 1, hand 1), and so do the Paladin and the Cleric (lean 1.3, hand 0.6). Today's gap inside
  each pair was only the support the balance party wore (a Siphon or a Spring on one, Vampire or Thorn on the other: H60's
  equal-worth picks). Any rule for every Uma lifts both of a pair; a flat 6% a round puts the Mage at 100% and the party
  **15–32% above** today's.
- **Why the others' rise is right:** their own supports (lifesteal, Thorn) retired as well and armor gave back defense
  only; and the damage model and the foe terms (§3) already assume each class spends WP §5.7's share of her acts on
  skills (Brawler 70%, Mage 80%, hybrids 75%, healers 88%). At Lv 50 SB18 gives 57–100% (as written 27–60%), so the
  region plays near the act the terms are sized on. **Every class ends on one footing** (region power 3.0–4.6 at Lv 50,
  today 1.6–4.6), the owner's reason for retiring the always-pick.
- **One stage is unchanged:** her bar is the same (5–19 deep casts against about five acts). **No class stops spending
  MP:** a round gives back 33–46% of a deep cast for the four damage dealers and **76%** for a healer at depth 5 (77% in
  Tier 3, the most anywhere); casting deep every act her bar still falls 23–41% a stage at Lv 50 (a healer's 6%). A healer's
  depth 1–3 skills (6–10.8 MP) cost less than her round's 11.8, as today's Cleric's did with the Spring (10 a round);
  Auto casts her deepest.
- **The Spring still matters:** without it SB18's Lv 50 coverage falls to 45–63% for the four damage dealers.
- **Tiers 2 and 3:** at Lv 50 every class's coverage is Tier 1's within 3 points. Their first levels are MP-rich as
  written (A10's ×1.7 and ×2.4 are sized at Lv 50: the party's region power at Lv 10 is 1.10× and 1.14× Tier 1's);
  SB18 adds a little (1.14×, 1.20×), level again by Lv 40 (1.03×). The simulation's item 7 measures it.
- **The template's MP twists keep their worth:** Opening, Even pace and Second wind each still add 13–20 points of a
  region's coverage (as written 6–20; a Brawler 57 → 70–77%); a matched Mage reaches 100% with any of them. The Uma
  Templates pass prices them (U9, U12).
- **Its knob:** the share a depth, ±0.1% moving late-region power about ±5% (0.7%: 0.88–1.02×; 0.9%: 0.98–1.07×); then
  Vigor's MP rate, then legs; never an MP accessory, never the casters' MP lean.

**Shapes and the alternative, compared** (Tier 1, the party ÷ today, Lv 10 · 20 · 30 · 40 · 50):

| Option | Region power | Late region | Coverage at Lv 50 (Brawler · Mage · Spell Blade · Summoner · Paladin · Cleric) | One stage |
|---|---|---|---|---|
| As written | 0.94 · 0.85 · 0.71 · 0.63 · 0.67 | 0.90 · 0.74 · 0.52 · 0.41 · 0.42 | 27 · 37 · 30 · 30 · 60 · 60% | Unchanged |
| **SB18: 0.8% a round a depth** | **1.04 · 1.06 · 1.01 · 1.01 · 1.06** | **1.05 · 1.04 · 0.94 · 0.94 · 1.01** | **57 · 80 · 67 · 67 · 100 · 100%** | **Her bar unchanged; every deep cast still costs** |
| A flat 4% a round | 1.20 · 1.19 · 1.08 · 1.01 · 1.06 | 1.26 · 1.25 · 1.05 · 0.94 · 1.01 | The same as SB18 | Early levels 19–26% fast |
| A flat 3.5% a round | 1.17 · 1.15 · 1.04 · 0.98 · 1.03 | 1.22 · 1.19 · 0.99 · 0.88 · 0.95 | 53 · 73 · 63 · 63 · 100 · 100% | Early 15–22% fast, Lv 40 12% slow |
| +6 MP a round × tier | 1.34 · 1.25 · 1.04 · 0.92 · 0.94 | 1.47 · 1.32 · 0.97 · 0.80 · 0.82 | 47 · 60 · 53 · 53 · 100 · 100% | Flat MP buys most where skills are cheap: 47% fast at Lv 10 |
| **The alternative: a bigger pool,** the Mage's, the Summoner's and the Cleric's MP lean × 2 | 1.08 · 1.03 · 0.90 · 0.82 · 0.85 | 1.07 · 0.99 · 0.77 · 0.67 · 0.70 | 27 · 63 · 30 · 50 · 60 · 100% | A Mage holds 20 deep casts, a Cleric 33 (bars 513) |
| Their MP lean × 3 | 1.19 · 1.15 · 1.02 · 0.93 · 0.96 | 1.26 · 1.21 · 0.99 · 0.85 · 0.89 | 27 · 93 · 30 · 73 · 60 · 100% | 28 and 47 deep casts (bars 728): a stage never moves her bar |

- **The bigger pool loses on every count:** it can't hold the pace late in a region (a full bar still empties, and
  nothing comes back), it must be enormous to try (a Mage's lean 1.3 → 3.9, a 728 MP bar), it makes one stage
  meaningless for the three classes, and it splits the MP mirrors (the Spell Blade 30% against the Summoner 73%; the
  Paladin 60% against the Cleric 100%): the class gap SB14 warned of.
- **Recommended: SB18**, the regen for every Uma at 0.8% a round a depth.

## 8. The template budget

**Target** (U12): a matched Uma gains about +5% at most. The signature accessory (WP33: ATK and M.ATK +0.2 a level ×
tier, worn) on her on-curve campaign act, and the affinity (CP36: +6% on one twin set's hits) matched to the twin set
that carries most of her damage:

| Class | Signature at Lv 50: Tier 1 · 2 · 3 | Signature, Tier 1 Lv 10 → 50 | Affinity matched at Lv 50 (her set, its share of her damage) | Both at Lv 50 |
|---|---|---|---|---|
| Brawler | 5.6 · 4.6 · 4.3 | 4.9 · 5.9 · 6.0 · 5.8 · 5.6 | 2.1 · 2.5 · 2.5 (Fire, then Lightning; 34–42%) | 7.8 · 7.3 · 7.0 |
| Mage | 5.2 · 4.6 · 4.3 | 4.6 · 5.6 · 5.5 · 5.4 · 5.2 | 2.1 · 2.5 · 2.5 (Fire; 34–42%) | 7.3 · 7.2 · 6.9 |
| Spell Blade | 6.0 · 5.3 · 4.6 | 5.4 · 6.5 · 6.5 · 6.2 · 6.0 | 3.9 · 3.9 · 4.0 (Lightning; 64–67%) | 10.1 · 9.4 · 8.8 |
| Summoner | 6.1 · 5.3 · 4.6 | 5.5 · 6.7 · 6.6 · 6.4 · 6.1 | 4.3 · 4.3 · 4.7 (Light; 72–78%) | 10.7 · 9.9 · 9.5 |
| Paladin | 6.1 · 5.2 · 4.8 | 5.8 · 6.9 · 6.7 · 6.5 · 6.1 | 2.4 · 2.2 · 2.4 (Fire, then Ice; 37–40%) | 8.7 · 7.5 · 7.2 |
| Cleric | 6.0 · 5.3 · 4.8 | 5.7 · 6.7 · 6.6 · 6.3 · 6.0 | 3.2 · 3.9 · 4.4 (Ice, then Light; 53–73%) | 9.3 · 9.4 · 9.4 |

- **The signature lands on U12** (+4.3–6.1% at Lv 50, the docs' +4.2–6.2%). It eases a point by Tier 3 (the weapon
  moons and branches add flat offense faster than × tier) and peaks mid-tier (up to +6.9% at Lv 20, where her build is
  lighter). The rate that would hold +5.0% exactly, the six classes' mean, is **0.172 · 0.356 · 0.570** a level × 1: a
  different rate per tier against SB1's one multiplier, for a point. **Kept at +0.2 × tier** (SB15).
- **The matched affinity is +2–5%, not +5%,** because "matched" in the campaign still spreads her acts over the 48
  signatures: her best twin set carries 34–42% of a pure class's damage and 64–78% of a hybrid's. With the signature,
  7–11%: past U12. **The signature in the affinity's place (WP33) is confirmed**; her moon's lead on defense adds 0.
- **For the Uma Templates pass:** the measured budget above, by class and level, is on [the damage
  page](previews/balance-damage.html#template).

## 9. Skill Ranks' neutrality

**Target** (CP32): ranks ×0.95 · 0.975 · 1.00 · 1.025 · 1.05, one every 2 Class Ranks after a depth opens; balance-neutral
on average. Her deepest skill's rank multiplier, averaged over a tier's fights (about three a level, D97: uniform in
levels):

| Pace | Lv 1–33 | Lv 34–50 | Lv 1–50 | Every held skill, Lv 1–50 |
|---|---|---|---|---|
| **The balance party** (Class Rank = her level) | 0.994 | 1.012 | **1.000** | 1.027 |
| **A real player** (2E a win: Class Rank 20 at Lv 13, 30 at 20, 40 at 27, 50 at 34) | 0.996 | **1.050** | **1.014** | 1.034 |

- **Neutral where the foes are tuned:** the balance party averages ×1.000. A real player reaches Class Rank 50 at Uma
  Lv 34 and then holds every skill at Rank 5 (×1.05) for the tier's last sixteen levels and beyond: **+1.4% over a
  tier, +5% at its end**, as CP32 already says; the re-baseline at Lv 50 measures it.
- **The bigger gap is today's, not the ranks':** at a real pace her deepest depth opens far sooner than the balance
  party's (Lv 20: depth 4, power 3.7, against the balance party's 2.9; Lv 30: 4.6 against 3.7). Skill Ranks add 5% on top
  of a 25% mid-tier lead the foes have never priced. **Recommended** (SB16): keep the band; the v16 balance party reads
  Class Rank on the real pace (2E), so the re-baseline measures what players hold.

## 10. Shields against answers

**Target** (CP8, README §9.5 item 3): a shield grows with the answers its foe's list gets; rounds to the first Break
within ±0.5 of Tier 1's. **Answers** (the default party, best picks) reproduce WP12. **Rounds to the first Break** is an
index (A11): the shield ÷ the weak hits the answering members land a round.

| Foe (Cleric party) | Tier 1 · 2 · 3: shield | Answers | Shield per answer | Rounds to Break, index | Against Tier 1 |
|---|---|---|---|---|---|
| Regular | 2–3 · 3–4 · 3–4 | 2.47 · 2.00 · 2.30 | 1.01 · 1.75 · 1.52 | 0.68 · 0.96 · 0.86 | +0.28 · +0.18 ✓ |
| Sub-boss | 5 · 7 · 6 | 2.47 · 3.53 · 2.30 | 2.03 · 1.98 · 2.61 | 1.36 · 0.95 · 1.47 | −0.41 · +0.11 ✓ |
| **Boss** | 6 · 8 · 9 | 2.47 · 3.53 · 3.67 | 2.43 · 2.27 · 2.45 | 1.63 · **1.09 · 1.12** | **−0.54 · −0.51** ✗ |
| **Boss, proposed** (SB6) | 6 · **9 · 10** | the same | 2.43 · 2.55 · 2.72 | 1.63 · 1.22 · 1.24 | **−0.41 · −0.39** ✓ |

- **Answers hold, chips don't:** WP12 counted members who answer; it didn't count how many hits each lands. **The
  partner table points every Ring weapon at a Light/Dark kind** (Greatsword, Axe → Bow; Lance → Katana; Fire → Dark;
  Ice, Lightning → Light), and the Light/Dark kinds are the multi-hit ones (a Bow's or a Light Tome's three hits, a
  Katana's two). So a Tier 2 boss's new answers chip two or three a turn each, and her Break comes half a round sooner
  than Tier 1's: past the ±0.5 band. **+1 shield on Tier 2 and 3 bosses** puts them back inside (−0.41, −0.39; a
  Paladin party −0.18, −0.17).
- **Regulars and sub-bosses hold** with Z2's floor (regulars' +1) doing the work. With Break tips on every tree (CP19's
  Power-or-Break choice, the player's) every Break comes 0.3–0.7 rounds sooner: the tip's purpose, not a drift.
- The simulation sets the final numbers (README §9.5 item 3) with real fights; this index only says which way and how
  much.

## 11. The proposed tunings, before and after

| # | What | Owning call | From → to | Before | After |
|---|---|---|---|---|---|
| 1 | Tier 2's toolbox term | tier2-world Z4 (CP §15, WP §13, EP §10 point to it) | Foes' HP and DEF × (1 + **0.15** (ℓ − 1) ÷ 49) → × (1 + **0.27** (ℓ − 1) ÷ 49); offense +10% kept | A Tier 2 party fells regulars 1.09 · 1.11 · 1.21 · 1.22 · 1.19× as fast as Tier 1 (Lv 10–50) | **1.06 · 1.04 · 1.10 · 1.08 · 1.03×** |
| 2 | Tier 3's toolbox term | New (Tier 3's, EP §10's "its own") | None → × (**1.08 + 0.40** (ℓ − 1) ÷ 49) on HP and DEF; offense × (1 + 0.10 (ℓ − 1) ÷ 49) | 1.25 · 1.38 · 1.63 · 1.76 · 1.85× | **1.03 · 1.02 · 1.11 · 1.10 · 1.05×** |
| 3 | Bosses in Tiers 2–3 | The terms (SB3, SB4) | The tier's term → the term × 1.1 (HP and DEF) | 1.15 · 1.16 · 1.21 · 1.18 · 1.11× (Tier 2); up to 1.25× (Tier 3) | **1.00 · 1.02 · 1.05 · 1.02 · 0.96×**; Tier 3 0.98–1.09× |
| 4 | Boss shields | CP8 | 6 · 8 · 9 → **6 · 9 · 10** | Breaks 0.54 · 0.51 rounds sooner than Tier 1 | **0.41 · 0.39** sooner |
| 5 | The Toll Bell's ramp | WP21 | +0.02 a grade a ring → **+0.05** (first ring and top unchanged) | Best in 0 cells; the Brawler's long fight 22.6% against the Great Bell's 24.5% | **Best in 1 cell a tier**; 26.3% and 28.9% against 24.5% and 26.0% |
| 6 | The Great Pendant | WP20 | 0.5 a kind (Tier 3 0.55) → **0.55** (Tier 3 **0.575**); G10 +31 → +34, +49 → +51 | Best in 0 cells | **4 (Tier 2), 1 (Tier 3)**; no form over 6 of 24 |
| 7 | The hybrids' presets | WP25, EP29 | A hybrid's single-kind forms and Full moon on her lone half → **on her lead half** | Splits Tier 1 71/29 · 57/43; Tier 3 62/38 · 53/47 | **71/29 · 68/32; 71/29 · 67/33** |
| 8 | The Summoner's Arms hand | CP9 (XR5's knob) | 0.56 → **0.48** (1.14 → 1.06 a turn, her farewell on top) | Tier 1 mirror 0.99 → 0.88 (Lv 10 → 50) | **1.06 → 0.97** |
| 9 | MP's knob order | EP15, WP §5.9 | Legs, Vigor, the Flourish → **SB18's share a depth, Vigor's MP rate, legs, the Flourish**; the Springs test adds region pace against today's | Legs +1 a grade buys +3% casts | The regen's ±0.1% a depth moves late-region pace ±5% |
| 10 | The re-baseline's Class Rank | CP32, README §9.5 item 1 | The balance party's Class Rank = her level → **the real pace (2E)** | Skill Ranks' late +5% and the depth lead unmeasured | Measured where players are |
| 11 | **A base MP regen for every Uma** | New rule (SB18; CP §6.6, EP15, WP §5.9 point to it) | None → at each round's end **0.8% of her max MP for each skill depth open** (4% from Class Rank 40), rounded, at least 1 | The party's late-region power 0.90 · 0.74 · 0.52 · 0.41 · 0.42× today's (Lv 10–50); Mage 37%, Summoner 30%, Cleric 60% of a region cast deep | **1.05 · 1.04 · 0.94 · 0.94 · 1.01×**; Mage 80%, Summoner 67%, Cleric 100% |

**Not applied, measured and kept in reserve** (§3.5): the focus +10%, the Insignias a step down, Keen ×1.6, the accessory
branches × 0.8. **Kept as written:** SB1's multipliers, the stack's ceilings, armor, the signature's rate, Skill Ranks'
band, the Paladin and Cleric, the Tier 1 Orb, regulars' and sub-bosses' shields. **Not chosen for MP** (§7.2): a bigger
pool for the casters (their MP lean), a flat regen share, a flat MP a round.

## 12. What the fight simulation must confirm

At v16 (Tier 1) and v17 (Tier 2's toolbox), README §9.5's items with this pass's numbers as the expected results:

1. **The re-baseline** (item 1): Tier 1's build within 2% of today's for five classes, the Summoner's +16% gone with
   tunings 7 and 8; Skill Ranks +5% at Lv 50 on the real Class Rank pace (tuning 10).
2. **The mirror** (item 2): Tier 1 within ±5% and 70/30 ± 5 with tunings 7 and 8 (the model: +6% at Lv 10, −3% at
   Lv 50); the Summoner's Arms hand moves inside 0.46–0.50 if the simulation lands outside. Tier 2's Ring mirror (Rune
   Knight ↔ Conjurer, −6% to −9%) tuned by the Rune Knight's class skills.
3. **Shields** (item 3): rounds to the first Break within ±0.5 with bosses 6 · 9 · 10; the chip index says regulars and
   sub-bosses hold.
4. **The pace with the terms** (Z4's check, now Tier 3's too): rounds a fight within ±10% of Tier 1's at Lv 10–50 for
   regulars, elites and bosses with tunings 1–3. The model's edge: Tier 3 Lv 30 at 1.11.
5. **Accessories** (item 7): every form someone's best with tunings 5 and 6, none in over half its tier's cells; the
   Tier 1 Orb's 13 of 24 (step its values down only if confirmed).
6. **Defense** (item 6): 18.7% · 18.3% · 18.1% at Lv 50 without the terms' offense, about 20% with it.
7. **MP** (item 5): the Springs test with SB18's regen (tuning 11): clears 10–12 of 12, and the party's act power in a
   region's last four stages within ±10% of today's (the model: 0.94–1.05×); no class's deep cast refunded by a round
   (a healer's 76–77% the most); Tier 2 and 3's first levels' MP lead (1.14× and 1.20× Tier 1's at Lv 10). Knobs: the
   regen's share a depth, then Vigor's MP rate (tuning 9).
8. **Templates** (item 8): the signature +4.3–6.1% matched; the affinity retired with the Uma Templates pass.
9. **The stack whole** (weapon-research risk 3): a weak hit at ×1.50 · ×2.16 · ×2.49; the tuned peak 1.3 · 1.6 · 1.8
   times the campaign's act, priced by the Rift's fronts.

## 13. If approved: the follow-ups by doc

Each approved doc is edited only as a follow-up logged against its D-row ("Follow-up to the stat balancing, SBn"); no
call changes beyond the values below.

| Doc | Call · where | From → to |
|---|---|---|
| [README.md](README.md) | §2.5 SB1 | "working rule" → **decided** (SB1, stat-balance.md); "this pass sets the final numbers" → "set: ×1 · ×1.8 · ×2.6 stand" |
| | §2.1 frame, §2.2 "Shields (drafts)" row | Bosses 6 · 8 · 9 → **6 · 9 · 10** |
| | §2.2, new row | "**Toolbox term** (foes' HP and DEF · offense, by Lv 50): — · ×1.27 · ×1.08 → ×1.48 (bosses × 1.1) · +10%" |
| | §2.2 frame, the accessories line | "the ten defensive and MP supports retire" + "**MP comes back by a base regen every Uma has** (SB18)" |
| | **§9.1 engine v16**, new row | "**Base MP regen:** at the end of each round every ally regains 0.8% of her max MP for each skill depth her class has open (rounded, at least 1), in the round-end step the Spring Amulet used (`mpRegen`), set when the fight starts · SB18 · Rule" |
| | §9.2 engine v17 | Add the Tier 2 term's values (RPG_FOE_TUNING); §9.5 items 1–8 take §12's expected results |
| | §9.5 item 5 | "The Springs test with no MP accessory and +51 MP from the map" → "… **and SB18's base regen**: clears 10–12 of 12 and the last four stages' pace within ±10% of today's; knobs: the regen's share a depth, Vigor's MP rate, legs" |
| | §4, §5, §6, §10 | The pages row (the summary page first), step 5 done, the status row, a fifth review list: SB1–SB18 |
| [class-progression.md](class-progression.md) | **CP8** · §4.4 shields table, §15 | Bosses 6 · 8 · 9 → **6 · 9 · 10** (Breaks by chips: a Dual's partner adds multi-hit answers) |
| | **CP9** · §2.1 and §2.2 hands | The Summoner's hand: Arms 0.56 → **0.48** (Tome 0.58 kept; 1.14 → 1.06 a turn, her farewell on top) |
| | **CP32** · Skill Ranks, §15 | The re-baseline reads Class Rank on the real pace (2E), not Class Rank = Uma level |
| | §15 pacing | "priced in Tier 2's term (Z4)" → "Tier 2's term +27%, Tier 3's 1.08 → 1.48, bosses × 1.1 (SB3–SB5)" |
| | §6.6 "Skill MP by tier" (the MP rules beside the hands) | Add: "**MP back a round** (SB18): every Uma regains 0.8% of her max MP at the end of each round for each depth open (0.8 · 1.6 · 2.4 · 3.2 · 4% at Class Rank 1 · 10 · 20 · 30 · 40); tier-free under SB1. The hands' MP (×1, ×0.5 a half, ×0.6) unchanged" |
| [weapon-progression.md](weapon-progression.md) | **WP20** · §0 forms row, §5.3 tree, §5.4 table | Great Pendant 0.5 → **0.55** a kind (G10 +31 → **+34**); Tier 3 step 0.55 → **0.575** (+49 → **+51**) |
| | **WP21** · §0, §5.3, §5.4 Bells table, §5.5 | Toll Bell +0.02 → **+0.05** a grade each ring (G10: 0.5, +0.5 a ring, to 2.0; Tier 3 to 2.5) |
| | **WP25** · §5.8 both tables, "damage they add" | A hybrid's single-kind forms on her **lead** half: Summoner Tier 1 Orb Bow → **Light**; Tier 3 Great Orb Bow → **Light**; Spell Blade Tier 3 Great Orb Lightning → **Lance**; Blademaster Tier 3 Great Orb Dark → **Katana**; Conjurer Tiers 2–3 Great Orb Greatsword → **Fire** |
| | §5.7 viability tables | Re-run with WP20 and WP21's new values (this pass's §4.2) |
| | §4.3, §13 | The regular's hit with the terms' offense: about 20% in Tiers 2–3; the accessories' depth priced in the terms (SB3, SB4) |
| | **WP17** · §5.1's closing paragraph | "MP comes from her level, armor's legs and her template's MP twists" → "… **and a base regen every Uma has** (SB18): a rule, not an item, so neither a dead pick nor an always-pick" |
| | §5.9, §13's MP row | "What comes": add **the base regen** (0.8% of max MP a round a depth, 4% from Class Rank 40); "What the simulation checks": knobs **the regen's share, Vigor's MP rate, legs' MP a grade, the Flourish's twists**; pace against today's |
| [extra-stats-progression.md](extra-stats-progression.md) | **EP29** · §5.3 table | A hybrid's Full (and Tier 2's Split) on her **lead** half: Spell Blade Tier 2 Split **Lance + Katana**, Tier 3 Full **Lance**, Split Katana + Lightning; Summoner Tier 2 Split **Light + Dark**, Tier 3 Full **Light**, Split Dark + Bow; Blademaster Split **Katana + Bow**, Full **Katana**, Split Bow + Dark; Conjurer Split **Fire + Lightning**, Full **Fire**, Split Lightning + Greatsword |
| | §8.1–§8.2 offense columns | The hybrids' other kinds follow EP29 (their lead-kind column doesn't move) |
| | **EP4** · §16 row | "The Spring Amulet goes; the pool replaces regen for every Uma" → "… **the pool and a base regen for every Uma** (SB18) replace it" (Vigor's values unchanged) |
| | **EP15** · §9 "Sustain", §16 | "MP moves from regen to the pool" → "**MP: the pool, and a base regen for every Uma** (SB18)"; knobs: **SB18's share a depth first**, then Vigor's MP rate, then legs, the Flourish's twists the template's; the Springs test measures region pace against today's |
| | **EP16** · §10 | "Tier 2's term … now prices +12–16%" → the weapon moons are a quarter of Tier 2's toolbox (×1.14) and Tier 3's (×1.23), priced in **+27%** and **1.08 → 1.48** |
| [profession-progression.md](profession-progression.md) | — | **No change:** no tuning moves an item, a recipe or a count |
| [../tier2-world.md](../tier2-world.md) (history) | **Z4** | A note: superseded by SB3 (HP and DEF +27%, offense +10%) |
| | §7 (Z5) | A note: MP over a region now has SB18's base regen; Springs as they are |
| [variance.md](variance.md) (the Uma Templates pass's input) | U12 | The measured budget (§8): signature +4.3–6.1%, matched affinity +2.1–4.7%, both 7–11% |
| | U9 | The MP twists with SB18: each still adds 13–20 points of a region's coverage; a matched Mage reaches 100% (§7.2) |
| Pages | class-templates.html (hands), weapon-accessories.html (Toll Bell, Great Pendant, presets, viability; the retired supports' MP note), stars-maps.html and stars-grants.html (EP29's presets), class-weaknesses.html (shields), weapon-armor.html and classes-template-sheets.html (where MP comes from) | Redrawn to the values above |

## 14. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **SB1** The stat budget | **SB1 holds as the final rule:** every flat build value is its Tier 1 value × 1, × 1.8, × 2.6; shares and percentages stay. Every source keeps its share of every stat within 2.3 points at each tier's Lv 50 | Per-stat multipliers to flatten HP and MP's +2 points; flat values (the first round) | One number per tier; the drift is the level part's constants, a point a tier |
| **SB2** The model | **This analytic model is the pre-simulation yardstick:** it reproduces all 162 numbers of the approved Lv 50 sheets, extra-stats §9's table, WP15's 18.7%, WP31's ceilings and WP12's coverage. The docs' sheets read lifetime 50 × (tier − 1) + level; the implementation's read the code's (one lower: within 0.65 points) | Wait for the simulation; re-derive the docs' sheets from the code | The owner's step after the four reviews; a shape found now is cheaper than one found in v16 |
| **SB3** Tier 2's term | **Z4's term on HP and DEF +15% → +27% by Tier 2's Lv 50** (× (1 + 0.27 (ℓ − 1) ÷ 49)); offense +10% kept | Z4 as drafted (a party 19–22% faster than Tier 1 from Lv 30); the four fallback knobs instead (37% faster); a term to Tier 1 exactly (+30%) | The four docs' Tier 2 tools compound to +51% an act; the term keeps the owner's pace (±10%) and the tools' impact as choices |
| **SB4** Tier 3's term | **A Tier 3 term: foes' HP and DEF × (1.08 + 0.40 (ℓ − 1) ÷ 49), offense × (1 + 0.10 (ℓ − 1) ÷ 49)** | A linear term from 1 (under-prices Tier 3's first levels, where branches, three slots and the focus arrive whole); the knobs (71% faster) | Tier 3's tools add +88%; a Tier 3 Uma arrives already 28% stronger at Lv 10 |
| **SB5** Bosses | **Bosses in Tiers 2–3 carry their tier's term × 1.1** on HP and DEF | No boss factor (11–25% faster than Tier 1); a boss HP step (`bossHp`) per tier | Bosses keep their twins: the narrowing that slows regulars never reaches them, and Pure and Keen land more |
| **SB6** Boss shields | **CP8's bosses 6 · 8 · 9 → 6 · 9 · 10;** regulars and sub-bosses unchanged | Shields by answers only (Breaks 0.5 rounds sooner); +2 (back to Tier 1's exactly) | A Dual's partner is a multi-hit Light/Dark kind: answers hold but chips rise; +1 is the smallest step inside ±0.5 |
| **SB7** The stack and the Rift | **WP31's stack and ceilings kept (×1.50 · ×2.16 · ×2.49); no fallback applied.** The Rift's Tier 2 and 3 fronts budget the tuned party at about 1.6 and 1.8 times the campaign's act | Apply the focus +10% now (−5% of the toolbox; the owner asked for impact); cap the stack's product | The terms price the on-curve toolbox; the tuned spread is the Rift's, where builds are tuned |
| **SB8** Accessory viability | **The Toll Bell +0.02 → +0.05 a grade each ring; the Great Pendant 0.5 → 0.55 a kind (Tier 3 0.575).** The Tier 1 Orb kept (13 of 24 by near-ties) | The Toll Bell's top raised (it still needs 11 rings); the Channel Pendant down to 0.75; the Orb a step down now | WP §5.7's rule: every form someone's best, none in over half; both changes are one value each and leave the shares (18–22%, 28–33%) |
| **SB9** Channel parity | **Holds:** Pendants, Orbs and Insignias within 0.4 points between a Brawler and a Mage; the Bell within 0.2 at an equal Attack share. The parity rule reads at an equal Attack share | A Bell weaker for the Brawler | The Bell's lead is her Attack share (30% against 20%), WP §5.7's "the Brawler's" |
| **SB10** The hybrids' presets | **A hybrid's single-kind accessory forms and her Full weapon moon go on her lead half's kinds** (WP25, EP29); the Twin Orb and the Split moon may span both | Keep "most-used: her lone half" (both hybrids drift to 60/40 by Tier 3); change Prowess's split (XR5: never the map) | CP1's identity is 70/30; the presets were stacking on the 30. It costs the Summoner 4% and the Spell Blade 2% |
| **SB11** The Summoner's hand | **Her Arms hand 0.56 → 0.48** (CP9; her Tome hand 0.58 kept) | 0.44 alone (the split stays 62/38); 0.56 kept (the mirror 12% off at Lv 50) | H63 set 0.56 for an Arms half with no stars; Prowess gives her +30 ATK. With SB10: the Tier 1 mirror within +6/−3% |
| **SB12** Paladin and Cleric | **Kept:** equal in Tier 1; the Guardian 6.5% behind the Bishop (mends −13%), the Templar 7% ahead of the Oracle | The healer's focus on every mend and Barrier she casts | Inside CP9's ±10%; the asymmetry is the focus reading the mending weapon's kind |
| **SB13** Defense | **Armor kept (WP15):** a regular's hit 18.7% · 18.3% · 18.1% of a Brawler's HP at Lv 50, about 20% with the terms' offense | Armor's HP a grade +15 → +17 | Inside the docs' target; the knob stays armor's HP |
| **SB14** MP | *Changed 2026-10-25: the fix is SB18.* **No pool value changes; the knobs re-ranked: SB18's share a depth first, then Vigor's MP rate, then legs, the Flourish's twists the template's.** The Springs test measures region pace against today's (the last four stages within ±10%), as well as clears | Legs first (+3% casts); Vigor ×2–×3 as the fix (it can't hold late-region pace: a bigger bar empties as surely); an MP accessory back; the casters' MP hands (reopens a class gap) | No pool knob brings MP back; a regen for every Uma does (SB18). Vigor buys three times what legs do |
| **SB15** The template | **The signature stays +0.2 a level × tier** (+4.3–6.1% at Lv 50); **its place is the affinity's** (the matched affinity measures +2.1–4.7%, both 7–11%) | A rate per tier for +5.0% exactly (0.172 · 0.356 · 0.570); keep the affinity too | Inside U12's "about +5%" with SB1's one multiplier; both together pass the cap |
| **SB16** Skill Ranks | **The band ×0.95 → ×1.05 kept;** the re-baseline's balance party reads Class Rank on the real pace (2E) | Re-centre the band (×0.94 → ×1.04); keep Class Rank = Uma level in the simulation | Neutral on the balance party (1.000); a real player's +1.4% a tier and +5% at its end is CP32's, measured where she is |
| **SB17** The follow-ups | **On approval, §13's edits land in the four docs, the README and the pages as follow-ups logged against D192–D194** (D195 untouched); the simulation items take §12's expected results | Re-open the approved docs' calls | The owner's process: approved docs change only by logged follow-ups |
| **SB18** A base MP regen (new, 2026-10-25) | **Every Uma regains 0.8% of her max MP at the end of each round for each skill depth her class has open** (0.8 · 1.6 · 2.4 · 3.2 · 4% at Class Rank 1 · 10 · 20 · 30 · 40), rounded, at least 1; a rule in every fight, engine v16, never an item. The party's late-region power returns to **0.94–1.05×** today's (as written 0.41–0.90×); region coverage at Lv 50: Mage 80%, Summoner 67%, Cleric 100% (as written 37 · 30 · 60%), Brawler 57%, Spell Blade 67%, Paladin 100% | **A bigger pool for the casters** (their MP lean × 2–3: late region still 0.67–0.89× at Lv 40–50, bars of 513–728 make one stage meaningless, splits the MP mirrors); a flat share (4%: early levels 19–26% fast; 3.5%: Lv 40 12% slow); flat MP a round × tier (47% fast at Lv 10, 18% slow at Lv 50); a share sized to put the Mage at 100% (6%: the party 15–32% fast); an MP accessory back (the always-pick) | The owner would wear MP regen on every class: so every class has it, as a rule. Stepping with her depths keeps it a share of what she casts at every level; the party returns to today's pace, every class on one footing; one stage is unchanged and every deep cast still costs her MP |
