# Uma Variance: Uma Templates

> **Fan-out draft, 2026-10-22. Nothing here is built.** One category of [the Tier rework](README.md), reviewed last.
> Calls **U1–U16**, each with a recommendation ([§15](#15-decisions)). No open questions. It fills the slots
> [skill-trees.md](skill-trees.md) (SK11) and [extra-stats.md](extra-stats.md) (ES12) left for it.

Previews: [the catalog](previews/variance-templates.html) · [two front runners, long distance](previews/variance-two-umas.html) ·
[her profile at Tier 1, 2 and 3](previews/variance-profile.html).

## 1. The owner's points

| The owner's point | Answered in |
|---|---|
| Maybe in this rework, maybe not | [§9 Fit](#9-fit-what-ships-when) (U1) |
| Not the original's uniqueness: no fixed gold skills, no unique skill | [§3](#3-the-proposal-in-short) (U7) |
| Variance authored on a template basis: one **Uma Template** each, not a class template | [§3](#3-the-proposal-in-short), [§4](#4-the-catalog) |
| Assigned from her original racing profile | [§5 The rule](#5-the-assignment-rule) |
| Many templates, so even two front-running long-distance Umas differ slightly | [§4](#4-the-catalog), [§5.1 worked example](#51-worked-example) |
| A front runner might get Brawler bonuses, or physical-only Extra Stat nodes; as a Mage she wouldn't benefit | [§3](#3-the-proposal-in-short): each node's scope |
| Template-only nodes in the skill trees and Extra Stats | [§7](#7-skill-trees-the-flourish-and-the-signature-tip), [§8](#8-extra-stats-her-moon) |
| (Brief) a profession affinity? | [§3](#3-the-proposal-in-short) (U11) |
| (Brief) how the player sees it | [§10](#10-how-the-player-sees-it) |
| (Brief) save impact, balance and pacing | [§13](#13-save-impact), [§14](#14-balance-and-pacing) |

## 2. Today

What an Uma's racing profile does in play ([classes](../../game/classes.md#the-six-classes), [loops](../../game/loops.md)):

- **Running style** picks her **starting class** (`save/class.ts` `startingClass`, D162): Front → Brawler, Pace → Mage,
  Late → Paladin if her base Power beats her Wit, else Cleric (D180), End → Summoner. Spell Blade is never a start. An
  Uma who never picked a class fights as her style's (`styleClass`).
- **Base stats and growth rates** make her RPG stats (`rpg/rules.ts` `projectRpgStats`): each is base ÷ 5 + lifetime
  levels × 1.5 × (1 + growth). Speed feeds ATK and M.ATK, Stamina HP and initiative, Power HP, DEF and M.DEF, Guts HP,
  Wit MP and M.DEF. That's real variance already, but nobody reads it as identity.
- **Distance and surface do nothing.** D102 retired training and D139 aptitude-timed jobs. The Racing tab's "Learns
  fastest" and "Masters fastest" rows (`STYLE_CLASSES`, `DISTANCE_GEAR` in `roster/aptitudes.ts`) and `learningTime`
  are leftovers; [game-design §4.1](../game-design.md#41-aptitudes-set-learning-speed) is stale.
- **Unique skill:** its text on the Racing tab, nothing in play.
- [Q10](../../open-questions.md) sketched distance as a hard limit and the original's skills as passives. This doc
  replaces that sketch (U7).

Master data by outfit id (uma-platform `Outfit`): `aptitudes` (surface turf/dirt, distance sprint–long, strategy
front–end, grades S–G), base stats per star (`stats.starN`), `growthRatePercents`, `skills`.

## 3. The proposal in short

An **Uma Template** is three readings of her racing profile and a few template-only nodes. It's ours: named in our
words, assigned by one rule, the same for her in every tier.

| Reading | From | Decides |
|---|---|---|
| **Calling** | Her best running style, with base Power vs Wit ([§5](#5-the-assignment-rule)) | One class and so one fight type: her start, her trade ([professions.md](professions.md) PR1), where her Flourish and tip work, and her moon's **lead** stat (ATK or M.ATK, her calling's channel) |
| **Stride** | The longest distance she runs at her best grade | Her Flourish's MP twist and her signature weapon kind |
| **Knack** | Her top growth rate | Her moon's **knack** stat |

| Template-only node | Where | Works | The owner's example |
|---|---|---|---|
| **Flourish** | Skill trees: the root's template slot, every tier | **Only as her calling** | "Brawler bonuses" |
| **Signature tip** | Skill trees, Tier 2 on: a third option at the tip fork of her signature kind's tree | Only as her calling | — |
| **Moon, lead** | Extra Stats: her template moon, node II | In any class that hits (or mends) through that channel | "Extra Stat nodes only for physical attack" |
| **Moon, knack** | Her template moon, node I | In every class | — |

A Brawler-calling front runner who runs as a Mage keeps only her knack node: no Flourish, and her ATK node reads "No
effect as Mage". She still plays a full Mage.

**What a template never does:** add damage outside her moon's lead node, change a stat or class lean, speed EXP or
ranks, change how a profession works, give a party synergy, or read the original's skills. It is never a malus. Its
only profession link is the one professions.md asked for: her calling's fight type names her trade.

## 4. The catalog

**6 callings × 3 strides = 18 authored types; × 5 knacks = 90 templates**, each named "{knack word} {type}":
"Tireless Ironhide". Today's 270 outfits (master data release of 2026-10-10) use 66 of the 90; the largest holds 14
Umas, the median 3. The 15 front-running stayers spread over four templates.

| Calling | Fight type | Lead stat | Leads with | Dash | Middle | Stayer | Umas today |
|---|---|---|---|---|---|---|---|
| Brawler | Physical | ATK | Arms | Charger | Bruiser | Ironhide | 61 |
| Spell Blade | Physical hybrid | ATK | Arms | Flashblade | Spellfencer | Longblade | 56 |
| Mage | Magical | M.ATK | Tomes | Flarecaster | Spellwright | Starkeeper | 46 |
| Summoner | Magical hybrid | M.ATK | Tomes | Beckoner | Binder | Shepherd | 46 |
| Paladin | Healer | ATK | Arms | Shieldrunner | Warden | Stalwart | 48 |
| Cleric | Healer | M.ATK | Tomes | Lamplighter | Mender | Pilgrim | 13 |

| Stride | Flourish: her MP twist, as her calling | Signature kind (Arms · Tome) | Signature tip, Tier 2 on |
|---|---|---|---|
| **Dash** | **Opening:** her first skill each fight costs no MP | Katana · Dark Tome | **Breakaway:** two more hits, the same total |
| **Middle** | **Even pace:** her skills cost 25% less MP | Greatsword · Fire Tome | **Spread:** and a splash on every other foe |
| **Stayer** | **Second wind:** from the fight's third round, she regains 3% of her max MP a round | Bow · Light Tome | **Long haul:** and a Barrier on herself |

The signature kinds are the shape pairs (Katana and Dark strike twice, Greatsword and Fire hit one foe hard, Bow and
Light hit one foe many times), on her calling's leading half. Tip numbers are the trees' to set under SK3.

| Knack (top growth) | Word | Knack node: +4 points to | What +4 is |
|---|---|---|---|
| Speed | Fleet | Speed | +2.4% evasion |
| Stamina | Tireless | HP | +20 HP |
| Power | Mighty | DEF and M.DEF, each (as Guard) | +4 each |
| Guts | Gritty | Limit | 1.6 of the gauge's 12 |
| Wit | Clever | MP | +4 MP |

## 5. The assignment rule

One pure function of the outfit's master data, read by id (`umaTemplate(outfit)`). No list of Umas, no names.

| Step | Reads | Rule | Ties |
|---|---|---|---|
| 1. Calling | `aptitudes.strategy`, `aptitudes.distance`; base stats at her starting stars | The first row that fits, below | Styles: Front, Pace, Late, End (today's order); Power = Wit goes magical (today's) |
| 2. Stride | `aptitudes.distance` | The longest distance at her best grade. Sprint or Mile → **Dash**, Medium → **Middle**, Long → **Stayer** | None: the longest wins |
| 3. Knack | `growthRatePercents`; base stats | Her highest growth rate | Higher base stat, then Speed, Stamina, Power, Guts, Wit |
| 4. Template | — | Calling × Stride → type; Knack → word | — |

**The calling, row by row** (the first that fits):

| Her racing profile | Calling | Umas today | Why |
|---|---|---|---|
| Best style Front | **Brawler** | 47 | The owner's example: a front runner leads with her fists |
| Wit ≥ Power, and A in two of Pace, Late, End | **Summoner** | 33 | A closer whose magic lingers to the end, as a summon does |
| Best style End | **Summoner** | 13 | The closer |
| Best style Pace, Power > Wit, best distance Sprint | **Brawler** | 14 | A sprinter runs like a front runner |
| Best style Pace, Power > Wit | **Spell Blade** | 56 | Today's Pace pair, physical side |
| Best style Pace, Wit ≥ Power | **Mage** | 46 | Today's start |
| Best style Late, Power > Wit | **Paladin** | 48 | D180 |
| Best style Late, Wit ≥ Power | **Cleric** | 13 | D180 |

"Best distance Sprint" is the shortest at her best grade. **By fight type** (her trade, PR1): physical 61, physical
hybrid 56, magical 46, magical hybrid 46, healer 61, so 22.6 / 20.7 / 17.0 / 17.0 / 22.6%: about a fifth each, against
today's starts' 17 / 0 / 53 / 5 / 24%. Strides: 48 Dash, 118 Middle, 104 Stayer. Not read: surface (turf for 94%), the
outfit's skills, the outfit id (U6, U7).

### 5.1 Worked example

Two invented front runners, long distance, turf A ([preview](previews/variance-two-umas.html)):

| | Uma A | Uma B |
|---|---|---|
| Style | Front A, Pace C | Front A, Pace A |
| Distance | Medium A, Long A | Medium B, Long A |
| Surface | Turf A | Turf A |
| Base stats (Spd, Sta, Pow, Gut, Wit) | 92, 104, 88, 80, 86 | 106, 84, 90, 82, 88 |
| Growth | Stamina +20%, Guts +10% | Speed, Power, Wit +10% each |
| 1. Calling | Front → Brawler | Front and Pace tie → Front → Brawler |
| 2. Stride | Medium and Long both A → Long → Stayer | Long A → Stayer |
| 3. Knack | Stamina (+20%) | Three tie at +10% → highest base, Speed 106 |
| **Template** | **Tireless Ironhide** | **Fleet Ironhide** |
| Flourish, as a Brawler | Second wind | The same |
| Moon | I: HP +20 (Lv 16) · II: ATK +8 (Lv 36) | I: evasion +2.4% (Lv 16) · II: ATK +8 (Lv 36) |
| Tier 2 tip | Long haul, on her Brawler Bow tree | The same |
| As a Mage | Her HP node only | Her evasion node only |

The same calling and stride give the same Flourish and tip; the knack splits them. A third front runner at Mile with
Speed growth is a **Fleet Charger**: Opening, and a Katana tip in Tier 2.

## 6. Per tier

The template never changes: the same name, calling, stride and knack in every tier. Each tier rebuilds her nodes with
that tier's trees and gems (promotion resets both, [tiers](../tiers.md#5-promotion-what-moves-what-resets-what-stays)).

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Calling | Her start; a star on the class picker | Her calling and the classes that grow from it | The same |
| Flourish | At the root, on as her calling | The same | The same |
| Signature tip | — | **New:** a third option at the tip fork of her signature kind's tree | At both tip forks of that tree (she holds two branches) |
| Her moon | I knack +4 (Lv 16), II lead +8 (Lv 36) | The same, Tier 2's gems | The same, Tier 3's gems |
| Matched damage | About +5% at most | The same (the tip is a sidegrade) | The same |

## 7. Skill trees: the Flourish and the signature tip

**The Flourish** fills [skill-trees.md](skill-trees.md#6-slots-for-other-categories)'s root template slot:
- **What:** one class-wide passive, her stride's MP twist ([§4](#4-the-catalog)). Named by type: "Ironhide · Second wind".
- **When:** on while she fights as her calling (and its later-tier classes). Free, no pick, every tier.
- **Why MP:** it changes how often she can cast, not how hard a cast hits, so the foe budget doesn't see it. It echoes
  racing stamina: a dash spends early, a stayer has some left at the end.

**The signature tip** fills the template tip slot, Tier 2 on:
- **Where:** the tip fork of her calling's tree of her signature kind; a third option beside Power and Break. In Tier 3,
  at both tip forks of that tree. Free, exclusive, swapped freely like any pick.
- **What:** a sidegrade by stride ([§4](#4-the-catalog)) that changes reach, hits or support, never just power (SK3).
- She uses it only with her signature weapon in a slot. With three slots and any three weapons allowed, that's her
  choice.

## 8. Extra Stats: her moon

It fills [extra-stats.md](extra-stats.md#the-template-moon)'s template moon (ES12), with two nodes each tier:

| Node | Opens | Gives | Gem | Counts |
|---|---|---|---|---|
| **I, knack** | Lv 16 | +4 points to her knack's stat | Moon Gem II | In every class |
| **II, lead** | Lv 36 | +8 to ATK or M.ATK, her calling's channel | Moon Gem IV | In any class that hits (or mends) with it |

- Named after her template ("Ironhide's moon"), drawn with a star on its own small orbit.
- A node her class can't use stays open and reads "No effect as Mage", as a shared moon her class doesn't use does.
- +12 points a tier in all, ES12's cap.

## 9. Fit: what ships when

It fits now, as Variance's own packets after Extra Stats and Skill trees land. The first piece needs no balance work.

| Part | When | Needs |
|---|---|---|
| The rule (`umaTemplate`, a pure function) | With Professions' packet if that ships first, since PR1 reads her fight type from it | Nothing |
| The catalog, the profile's template, the Stable's Calling filter | First Variance packet | Nothing: no engine or save change |
| New Umas start in their calling | Same packet | classes.md's call (U8) |
| Her moon, every tier | After Extra Stats' map ships | ES12's slot; points freeze at a fight's start, so no engine change |
| The Flourish, every tier | After Skill trees' Tier 1 trees ship | SK11's root slot; the three MP twists in the rework's engine version |
| The signature tip | With Tier 2's trees | SK11's tip slot, SK3's tip numbers |

## 10. How the player sees it

- **Profile header:** a template chip after the class chip, "★ Tireless Ironhide". It opens the template sheet.
- **Racing tab:** "What her aptitudes do here" becomes **Her template**: the three readings with their source grades
  (Calling ← Front A; Stride ← Long A; Knack ← Stamina +20%), then each node with its scope, "Active" or "No effect as
  Mage". A locked outfit shows it too, so it helps pick an unlock.
- **Skills page:** a small star on her calling's class tile; the root plate's template line ("★ Second wind · from round
  3, 3% MP a round"); in Tier 2, a starred third option at her signature tree's tip fork.
- **Extra Stats:** her moon, starred, with her template's name.
- **Battle tab:** her moon's points join the green Extra Stats bracket; Sustain lists her Flourish.
- **Skill chips:** "0 MP" on Opening's first skill, the cut cost under Even pace.
- **Stable:** a **Calling** facet in Filters, for building parties. It's uma-rpg's own facet list (`STABLE_FACETS`),
  no kit change.

## 11. Provides

| To | What |
|---|---|
| [skill-trees.md](skill-trees.md) | **The root template slot's content:** the Flourish, three MP twists (Opening, Even pace, Second wind), on as her calling, every tier. **The template tip's content,** Tier 2 on: one sidegrade by stride (Breakaway, Spread, Long haul) at the tip fork of her calling's tree of her signature kind, by stride and leading half (Katana · Dark, Greatsword · Fire, Bow · Light) |
| [extra-stats.md](extra-stats.md) | **The template moon's content:** node I her knack (+4 to evasion, HP, DEF and M.DEF, Limit or MP), counting in every class; node II her lead (+8 ATK or M.ATK), counting in the classes of that channel. Ids `template:1–2` |
| [classes.md](classes.md) | **A calling per Uma** (one of six), by [§5](#5-the-assignment-rule)'s rule. Recommend new Umas start in it (CL13, D162/D180 extended): besides a Pace chaser with Power over Wit starting as a Spell Blade, a Pace sprinter with Power over Wit starts as a Brawler and a Wit-led closer (A in two of Pace, Late, End) as a Summoner. A star on the picker. A row for "what class selection affects": her Flourish and tip work only in her calling; her moon's lead only in classes of its channel |
| [professions.md](professions.md) | **Her fight type**, her calling's, for PR1's trade: physical 61, physical hybrid 56, magical 46, magical hybrid 46, healer 61 Umas today (22.6 / 20.7 / 17.0 / 17.0 / 22.6%). Nothing else: no speed, yield or level effect. Demand: one Moon Gem II and one Moon Gem IV an Uma per tier, as ES12 counts |
| [gear.md](gear.md) | Nothing. The signature kind is a tree she may slot, not an item |
| Cross-reference | Rows for `character-tiers.html` and `progression.html`: Tier 1 "Template: calling star, Flourish, moon (2 nodes)"; Tier 2 "+ signature tip"; Tier 3 "tip at both forks" |

## 12. Assumes

| From | What | If not |
|---|---|---|
| [classes.md](classes.md) | Six classes, their channels and leading halves (brief §2) | — |
| [classes.md](classes.md) | New Umas start in their calling (U8; CL13 adopts the Spell Blade part) | The calling shows apart from the start, and an Uma may start in a class that isn't her calling |
| [professions.md](professions.md) | PR1 takes her trade from her calling's fight type. Its 18–22% target is met within a point and a half (17.0–22.6%), where starting classes give 0–53% | Professions' own fallback rule names the trade; the calling stays as it is |
| [skill-trees.md](skill-trees.md) | SK11's two slots as written: the root's free class-wide node every tier, and a free third option at one tip fork from Tier 2 | — |
| [extra-stats.md](extra-stats.md) | ES12's moon (Lv 16 +4, Lv 36 +8, Moon Gems II and IV), **with one change: its two nodes name two stats with two scopes** (I her knack in every class, II her lead in her channel's classes), not one stat for the template's classes | One stat: node I gives her lead too, and the knack moves to the Flourish's name only, so two front-running stayers would no longer differ in play |
| [extra-stats.md](extra-stats.md) | Node I may give evasion or Limit in Tier 1, though ES6 keeps them off the shared map (the engine and the Battle tab have both) | Fleet takes ATK and M.ATK +2 each; Gritty takes HP +20 |
| [gear.md](gear.md) | Any three weapons fit a class's slots within its Arms and Tome split, so she can slot her signature kind | The tip falls back to her calling's first default weapon |
| [README §2](README.md#2-the-shared-frame-every-doc-starts-from) | Tiers 1–3, six classes, five fight types, master data by stable id | — |

## 13. Save impact

- **The template:** derived each time, never stored (like `styleClass`).
- **Her moon:** ES12's ids, `template:1–2`, in each world's `stars.open`; promotion empties them with the map. If her
  template ever changed (a master data fix), the open nodes stay open and give the new stats.
- **The Flourish:** no field: it's on by rule while she's her calling.
- **The signature tip:** a pick stored like every tip pick (skill-trees' save), default Power.
- **Starting class:** a new unlock whose calling differs from her style's class has it written as her class, as a
  Paladin start is (D180). Owned Umas don't change.
- **Engine:** the three MP twists need the rework's engine version; older fights replay at their own.
- **Deleted or converted:** nothing; no refund. Code retired: `STYLE_CLASSES`, `DISTANCE_GEAR`, `learningTime`.

## 14. Balance and pacing

- **The budget:** in her calling, a template adds **about +5% at most** to her damage or healing, at every level band of
  every tier, and all of it is her moon's lead node (+8 offense: about 4% of an on-curve Lv 36 Brawler's offense, 3% at
  Lv 50; damage grows a little faster than offense). The Flourish adds MP, not power: about one skill's MP a regular
  fight, more for a stayer in a long one. The tip is a sidegrade (SK3). The knack alone, in any class, is +4 points.
  Never below zero.
- **Inside the existing budgets:** the foe budget prices an on-curve Uma with **no** template, and extra-stats prices the
  moon outside it (ES12, +12 points a tier). An Uma outside her calling *is* that on-curve Uma, plus her knack. So
  fights don't change for an Uma on curve; a matched Uma has a small edge, about one weapon grade's (Might is +6% a
  grade on its hits): it tips a choice, it never forces one.
- **The check** (the simulation, `SIM=1`): each party shape again with five matched Umas. Targets: campaign win rates
  within 3 points of the template-less party (classes v2's band, [§9](../classes-v2.md#9-balance-targets-the-simulation-sim1));
  the Rift's fronts inside [rift.md §11](../rift.md)'s bands; the hybrids' mirror within ±5% with both matched; the
  Springs test with dry-MP input for the three twists. The twists' numbers are tuned there, never the foes.
- **Pacing:** no change to EXP, ranks, Laurels, tickets or any job's time ([pacing](../pacing.md)). Jewel Crafting
  makes two more Moon Gems an Uma per tier, as ES12 already counts.

## 15. Decisions

| Call | Recommendation | Alternatives | Why |
|---|---|---|---|
| **U1** Fit | In the rework, as Variance's own packets after Extra Stats and Skill trees; the display first | Defer it all; the moon only | Both docs left a slot; filling it now costs little, a second layout pass later costs more |
| **U2** What a template is | Three readings (calling, stride, knack) filling the two docs' slots: a Flourish, a signature tip from Tier 2, a moon of two nodes | A flat passive ("+5% as Brawler"); class lean nudges | The owner's examples are nodes; nodes show what they do and where they count |
| **U3** How many | 18 types × 5 knacks = 90; 66 in use today, the largest 14 | 30 hand-named; four strides (120) | Same-style, same-distance Umas differ (15 front-running stayers, four templates); authored as three small tables |
| **U4** Calling | [§5](#5-the-assignment-rule)'s eight rows: today's style rule and D180, plus Pace sprinters with Power → Brawler and Wit-led closers → Summoner | Today's starting classes (0–53% a fight type); professions' fallback (no Cleric callings) | Every class gets a calling, each row has a racing reason, and the fight types land at 17–23%, as PR1 needs |
| **U5** Stride | The longest distance at her best grade: Dash, Middle, Stayer | Today's `best()` (3 stayers in all); four strides | Reads "how far she runs best"; spreads 48 / 118 / 104 |
| **U6** Knack | Top growth rate; ties by base stat, then Speed … Wit | Top base stat; an outfit-id hash | Base stats follow the calling (35 of 56 Spell Blades top in Power); growth spreads; a hash can't be explained on her profile |
| **U7** Not read | Surface, the outfit's skills, her name and id | Dirt as a flavor; the unique skill's effect type picks the twist | Turf is 94%; the skills are the uniqueness the owner declined. Supersedes Q10's sketch |
| **U8** Start | New unlocks start in their calling (Spell Blade becomes a start; Pace sprinters with Power start as Brawlers, Wit-led closers as Summoners) | Keep D162/D180 and show the calling apart | One signal, not two; owned Umas unchanged |
| **U9** Flourish | The root slot: an MP twist by stride, on as her calling, every tier | A damage twist (+% from round 3); a twist on one weapon's tree | MP is outside the foe budget and shows on every skill chip; class-wide needs no weapon |
| **U10** Moon | ES12's two nodes: I knack (+4, every class), II lead (+8, her channel) | One stat for both, in the template's classes (ES12 as written) | Keeps the owner's "physical-only" node and still splits same-calling Umas by knack |
| **U11** Professions | Only PR1's link: her calling's fight type names her trade. No speed, yield or level effect | Craft EXP +10% in her trade; +1 item a job | D139: every Uma of a level finishes together; professions.md is rebalancing demand |
| **U12** Strength | About +5% damage at most when matched, all from the lead node; MP from the Flourish; never negative | Zero-sum trades (+ here, − there) | Matters, never forces; off the curve the foe budget prices |
| **U13** Stored? | Derived each time; ES12's positional ids | A template id written at unlock | No migration; tuning the rule reaches everyone |
| **U14** Names | "{knack word} {type}", our own words | Numbers ("Template 17") | Readable; nothing from the original games |
| **U15** Party synergy | None | Bonuses for matching strides | A template is the Uma's; party shape stays the classes' job |
| **U16** Signature tip | Tier 2 on, a sidegrade by stride at her signature kind's tip fork (Katana · Dark, Greatsword · Fire, Bow · Light) | None; a tip on every tree | Tier 2 adds depth where the trees do; one tree keeps it a signature |
