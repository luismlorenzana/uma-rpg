# Combat balance: stats that count, damage you can answer

> **Status: built, 2026-10-15 (D140: §6.0; D141: §6.1–6.3, engine v12).** Written from the owner's notes of
> 2026-10-15:
> - a point of ATK doesn't feel worth the farm work behind it;
> - the profile hides stats such as HP Regen and MP Regen;
> - nothing mitigates or heals enemy damage, so a focused Uma stays hurt for the rest of the fight;
> - every class is a damage dealer.
>
> §1–§5 are the measurements and research on engine v11 that led here, kept as they were. **§0 is what was built**,
> including where the owner's review and the tuning changed the plan. The manual ([combat](../../game/combat.md),
> [classes](../../game/classes.md), [loops](../../game/loops.md)) is current.

## 0. As built

### The owner's review of the plan

| Note | What changed from §6–§8 |
|---|---|
| Lift "nothing in the thousands" | Lifted: foe HP and big hits may run into the thousands where the game needs it |
| Brawler stays pure physical offense | No party-wide Guard for her. Guard is unchanged for everyone |
| Brawler, Mage and Spell Blade are the offense classes | Unchanged |
| Cleric and Summoner are half offense, half healer or shielder | Cleric: her magic spells heal and her physical blows put up a Barrier. Summoner: each summon line has a job (heal, Barrier, drain, Aegis, Enfeeble, revive, or strike), and several lines were renamed for it |
| Might should grow with the grade, about 6% a step | First built as +6% a grade (D141); then, as the owner meant, fixed values bigger at later grades (D142, D143): 1, 4, 8, 12, 19, 26, 35, 45, 57, 68, each worth about 6% × g at the level its grade opens, and more when worn early |

### What tuning changed

- **A skill's Barrier lasts one round.** As Slay the Spire's Block, it guards against the moves shown, then lapses.
  When Barriers stacked, the Summoner's Ice summons soaked every hit.
- **Steel after a Break.** The party acts before any foe, so a strong party could Break a foe, hold her down two rounds
  and Break her again before she moved: one elite died without acting once. Now a foe back up from a Break is Steeled
  (her shield can't be chipped) until she has made a move.
- **Foe curve:**
  - **Offense:** set from the share of HP a 100% hit takes on an average Uma of her level. It ramps from 20% at Lv1 to
    28% from Lv10, so a fresh party's first fights stay gentle.
  - **Build budget:** a curve on the square of the level, so it barely moves early (gear grade 1–2) and grows late
    (grade-10 Might, high-grade nodes). It reaches ×2.7 HP and ×1.5 offense at Lv50.
  - **Elites' leaders and lone bosses act twice from Lv10.** Since D135 the elite's leader had acted once.
  - **HP:** elites ×3.5 (was 4.5) and bosses ×5.5 (was 6.5); elites no longer gain extra HP each level.
- **Support sizes:** a mend or Barrier takes 14–22% of the target's max HP by depth, and ×0.4 on every Uma. Summons
  heal at half that and shield at 35%. Only healing repeats while a summon lingers.

### The simulation as built

Five Umas at the stage's level, Class Rank equal to it, the shared Auto policy.
- **Bare:** no gear, no Extra Stats, no Heroes.
- **Geared:** gear of the grade her level opens and an inherited Limit Break.
- **On curve:** geared, plus every Extra Stats node her level allows.

Each cell gives the win rate, the HP the party ends with, and in brackets how low any Uma fell.

| Level | Party | Regular | Elite | Boss |
|---|---|---|---|---|
| 5 | bare | 100%, 96% (81%) | 100%, 86% (67%) | 90%, 57% (34%) |
| 5 | geared | 100%, 98% (86%) | 100%, 90% (76%) | 100%, 84% (70%) |
| 15 | bare | 100%, 98% (81%) | 55%, 28% (8%) | 5% |
| 15 | geared | 100%, 99% (91%) | 100%, 82% (44%) | 100%, 80% (56%) |
| 25 | geared | 100%, 99% (93%) | 100%, 89% (59%) | 100%, 89% (70%) |
| 40 | geared | 100%, 100% (97%) | 100%, 97% (68%) | 100%, 98% (77%) |
| 50 | geared | 100%, 100% (83%) | 100%, 88% (38%) | 100%, 90% (37%) |
| 50 | on curve | 100%, 100% (94%) | 100%, 99% (78%) | 100%, 98% (73%) |

- **Built parties** win everything. Elites and bosses push their weakest Uma well down; regular stages are quick.
- **A party with no gear** clears regular stages through Lv25. It needs gear for elites from Lv15 and bosses from Lv10.
- **Players beat Auto:** Auto plays greedily, so a player's own results run better.

The owner's play sets the next pass: the share a hit takes (`hitShare`), the build budget, and the support shares
are each one number.

## 1. The short answer

- **A grade-10 weapon at Lv1 doesn't one-shot anything, but it does trivialize Lv1–5.** A Lv1 party with a G10 weapon in
  every slot beat the whole first region, elite and boss included, in about 3 rounds a fight instead of 10. Not one of its
  320 hits killed a full-HP foe outright: unbroken foes take half damage, and Breaks take a round to land. A G10 weapon is
  worth ×3.6 damage at Lv1, but only ×1.6 at Lv50.
- **The real problem is that most points are worth almost nothing.**
  - **ATK:** +1 is +6% damage at Lv1 and +1.4% at Lv50.
  - **DEF:** +1 is about 0.1% less damage taken at Lv50. Foes' offense is five to six times an Uma's DEF, so her whole
    DEF stat removes 9% of a hit.
  - **Accessories:** a grade-10 Talisman or Amulet is worth 1–10%.
- **Foe hits outgrow Uma HP.** A regular foe's plain hit takes 18% of a Brawler's HP at Lv1 and 58% at Lv50 (24% and
  75% for a Mage).
  - **No healing:** nothing heals, by the D86 request ("no healing for now").
  - **Guard:** Auto never uses it, and it only covers one Uma from single-target moves.
  - **Focus:** in small fights one Uma often takes 80–100% of the damage, because "front" moves always aim at the first Uma
    standing.
- **The balance simulation measures a game that no longer exists.**
  - It still runs engine v8, where every Uma had her class's Limit Break; since D112 only Heroes and Learners have one.
  - On v11, regions' bosses are won 40–75% of the time, not the 80–100% it reports.
  - D135's elite and boss numbers came from the v8 run.
- **Guts does nothing in a fight.** It becomes `dexterity`, which no rule reads.
- **Numbers have crept into the thousands.** At Lv50 regular foes have up to 3,982 HP and elite captains 10,101, twice
  the region's boss. The rule was "nothing in the thousands except big boss HP" ([progression](progression.md#goals)).

**Recommendation: no combat rewrite.** Keep Break, intents and one act per Uma. Then, in order:
1. Show and measure everything (§6.0).
2. Re-fit the numbers so points and DEF count (§6.1). This is the one real rework.
3. Give the party a defensive half without new classes (§6.2).
4. Let foes do more, with every move answerable, many of them through Break (§6.3).

## 2. What we measured

### Stats by level

| Level | Brawler HP / ATK / DEF | Regular foe HP | Top foe offense | Elite captain HP | Region boss HP |
|---|---|---|---|---|---|
| 1 | 292 / 24 / 24 | 191–310 | 73 | — | — |
| 5 | — | 56–634 | 102 | 745 | 517 |
| 10 | 413 / 41 / 41 | 83–1,151 | 142 | 944 | 626 |
| 25 | 614 / 68 / 68 | 186–2,576 | 309 | 3,115 | 1,815 |
| 50 | 944 / 113 / 113 | 384–3,982 | 744 | 10,101 | 4,896 |

The elite's captain has more HP than the region's boss at every level (×1.4 at Lv5, ×2 at Lv50). Elites keep
`subBossHp 4.5` and +1% a level; bosses get half of `bossHp 6.5`.

### What a point buys

A depth-matched single-target Greatsword skill from a Brawler, on an unbroken foe of a pair (a Break doubles it):

| Level | Bare | +1 ATK | G1 weapon (+4) | G10 weapon (+40) | Every ATK source maxed (+77) |
|---|---|---|---|---|---|
| 1 | 16 | 17 (+6%) | 20 | 57 (×3.6) | 96 (×6) |
| 10 | 28 | 29 (+4%) | 32 | 72 (×2.6) | 113 (×4) |
| 25 | 90 | 92 (+2%) | 98 | 166 (×1.8) | 236 (×2.6) |
| 50 | 212 | 215 (+1.4%) | 224 | 332 (×1.6) | 443 (×2.1) |

Defense, at Lv50 against a regular foe's 100% hit of 544 on a Brawler:

| Source, grade 10 | What it does |
|---|---|
| Her own 113 DEF | Removes 57 of about 600 (9%) |
| Helm (+10 DEF) and every DEF Extra Stat (~+12) | 11 more (2%) |
| Vital Talisman | 10 HP a round (1% of her HP) |
| Bulwark Talisman | A 50-point Barrier, once (9% of one hit) |
| Iron Talisman | 5% less physical damage |
| Vampire Talisman | 5% of the physical damage she deals: 11–22 HP a hit |
| Spring Amulet | 5 MP a round; a depth-5 full turn costs 26 |

### Foe hits

A regular foe's 100% physical hit, as a share of the target's HP:

| Level | On a Brawler | On a Mage |
|---|---|---|
| 1 | 54 (18%) | 56 (24%) |
| 10 | 54 (13%) | 58 (18%) |
| 25 | 177 (29%) | 183 (38%) |
| 50 | 544 (58%) | 554 (75%) |

A boss's Crush (210%, at the weakest Uma) takes about 96% of a Lv50 Mage's HP. Why:
- **Foe offense** starts at three times the reference stat, and an Uma's DEF at one.
- **World tuning** adds +2% a level for regular foes, and the gear budget +0.35% a level on top.
- **Umas grow linearly,** at about 1.5 stat a level.

### Fights on Auto, engine v11

Five Umas at the stage's level, on-time Class Rank with side skills, no gear. "Lowest" is the lowest any Uma's HP fell.
"Focus" is the share of all damage the most-hit Uma took.

| Level | Pair | Trio | Squad | Swarm | Escort | Elite | Boss |
|---|---|---|---|---|---|---|---|
| 5 | 100%; lowest 28%, focus 90% | 100%; 30%, 83% | 92%; 43%, 67% | 100%; 30%, 54% | 100%; 9%, 69% | 90% | **50%**, 3.2 KOs |
| 20 | 100%; 66%, 50% | 100%; 42%, 93% | 100%; 50%, 70% | 86%; 47%, 49% | **50%**; 0%, 33% | 95% | **40%**, 3.4 KOs |
| 30 | 100%; 72%, 50% | 89%; 28%, 81% | 90%; 34%, 61% | 100%; 30%, 52% | **50%**; 0%, 30% | 95% | **40%**, 3.4 KOs |
| 50 | 100%; 36%, 80% | 100%; 19%, 89% | 100%; 41%, 66% | 100%; 44%, 51% | 100%; 1%, 100% | **50%**, 2.6 KOs | 75% |

The same fights on engine v8 (the simulation's version, with class Limit Breaks):

| Level | Bosses, v8 | Bosses, v11 | Elites, v8 | Elites, v11 |
|---|---|---|---|---|
| 5 | 80% | 50% | 100% | 90% |
| 20 | 100% | 40% | 100% | 95% |
| 30 | 95% | 40% | 100% | 95% |
| 50 | 95% | 75% | 100% | 50% |

Swarms aren't the worst on Auto, because area skills kill them in 3–4 rounds. In hand play they hurt for a reason the
numbers show:
- **Split HP, full damage:** a swarm splits about 3.6 regular foes' HP over six to eight foes, but each keeps a full
  foe's offense.
- **Many hits:** that's six to eight full hits a round against a pair's two.
- **Focused:** "front" and "the weakest" moves pile them onto one Uma, and nothing gives that HP back.

### Grade 10 at Lv1

Five Lv1 Umas against the first region (stages Lv1–5, elite and boss at Lv5):

| Party | Won | Rounds a fight | Elite | Boss | Hits that killed a full-HP foe outright |
|---|---|---|---|---|---|
| Bare | 10 of 12 | 10.1 | Lost after 22 rounds | Lost | 0 of 1,007 |
| G10 weapon in every slot | 12 of 12 | 3.1 | 5 rounds, 68% HP left | 6 rounds, 92% left | 0 of 320 |
| G10 everything | 12 of 12 | 2.6 | 3 rounds, 83% left | 6 rounds, 95% left | 3 of 220 |

In play this needs Weapon Rank 10 and grades 1–9 bound first (D119). Only Manuals bought with banked Marks make it
possible, in a later campaign. A powerful new Uma is a fair reward for that, so the gates stay as they are.

## 3. Why

1. **Defense is on the wrong scale.** Damage is `max(0.2 × offense, offense − 0.5 × defense)`. Foes' offense is 3–6×
   an Uma's DEF, so DEF removes 8–18% and each point is noise. Fire Emblem's subtraction works because attack and
   defense live on one scale ([§4](#4-how-other-games-do-it)).
2. **Foe curves stack and Uma curves don't.**
   - **Foes multiply:** reference stat × 3 × role × budget (+0.35% a level) × world (+2% offense, +3.5% HP a level).
   - **Umas grow linearly,** so the gap widens every level.
3. **Flat bonuses on a growing base.**
   - **Extra Stats:** a node gives +1 whatever its grade.
   - **Accessories:** a Talisman's Regen and Barrier are flat. Lv1's meaningful +5 is Lv50's rounding error.
   - **Payoff:** since D139 every grade takes the same farm time, so a higher grade's payoff has to come from its value.
4. **There's no defensive kit.**
   - **Mitigation:** none of it heals:
     - Aegis (−10% a stack);
     - one Barrier capstone;
     - Guard (one Uma, single-target moves only, never used by Auto);
     - accessories worth a few percent.
   - **Recovery:** there's no revive or cleanse.
   - **The only answer is killing faster.**
5. **Focus fire by construction.** "Front" means the first Uma standing; casters and Crush aim at the weakest. Damage is
   permanent for the fight and carries through its waves.
6. **Formations share HP, not offense.** A swarm is 3.5× a pair's damage a round, a squad 2.25×.
7. **The measuring tool is stale.** The sim runs v8, gives gear as a percentage rather than D104's flat adds, and has no
   Heroes. Tuning against it tunes a different game.

## 4. How other games do it

| Game | What it does | What it solves | For us |
|---|---|---|---|
| **Octopath Traveler I–II** | Shields and weakness hits, Break skips the foe's turn, dedicated healers, a visible turn order | Break is the answer to danger; healers recover the gap a Break buys | Our engine already is this, minus the healers. Keep Break; add healing |
| **Honkai: Star Rail** | Toughness bars broken by matching elements; roles by Path (damage, support, sustain), usually exactly one sustain slot (a healer *or* a shielder) | A team needs one sustain, not three. Breaks delay the foe | Tune for one sustain-capable Uma: fights winnable without, comfortable with |
| **Sea of Stars** | A charging foe shows **locks**, damage-type icons. Hitting them weakens the spell, and breaking all of them cancels it | Big enemy moves are telegraphed *and* answerable through the weakness system | The best fit: locks are just our weakness kinds on a charge (§6.3) |
| **Slay the Spire** | Each foe's intent shows its exact damage. Block absorbs it and expires at the start of your next turn | Every turn is a small puzzle: how much damage can I prevent? | We show move and target; add the number. Barriers are our Block |
| **Into the Breach** | Every attack is telegraphed; the player pushes, blocks or redirects it | Damage is your fault, never luck | Guard and Provoke redirect; Break cancels |
| **Darkest Dungeon** | Guard moves an ally's damage onto the guard and raises the guard's protection; healers heal small but targeted | Focus fire has a counter that costs a turn | Brawler's Guard covers the party (§6.2) |
| **Fire Emblem** | Attack − Defense with stats under ~60 | Every point is a point of damage | Subtraction works only if foe offense and Uma DEF share a scale |
| **Ratio armor** (`100 / (100 + armor)`, RPG Maker, MOBAs) | Each point of defense adds the same effective HP; never immune | Defense keeps its value at every level | Our formula candidate (§6.1) |
| **Bloodborne** | Recently lost HP shows orange and can be won back by striking within a few seconds | Damage taken becomes an invitation to strike back | **Rally**: break the foe who hurt you to win back part of it (§6.3) |
| **Umamusume** | Recovery skills restore Stamina mid-race | Recovery is part of the source's own racing | Theme for the heals' names and Guts |

## 5. Keep, change, add

**Keep:**
- **Break** (shields, weaknesses, a Break skipping the foe's next moves). It already cancels a foe's shown move.
- **Turns:** intents before the party acts, one act per Uma, deterministic replay.
- **Roster:** five classes, ten weapons, forty trees, a party of five.
- **Numbers:** small and linear, and the four progression bars.
- **Gear:** Might per weapon; in-order binding and rank gates.

**Change:**
- **The formula:** the damage formula's defense term.
- **The foe curve:** set foes from a target share of Uma HP.
- **Bonuses:** grade-valued Extra Stats; stronger armor stats and accessories.
- **Formations:** split offense like HP.
- **The simulation:** run it on the engine as built.

**Add:**
- **The stat sheet:** a full one, and damage numbers on intents.
- **Sustain:**
  - Cleric healing, cleanse and revive;
  - a party-wide Guard for the Brawler;
  - Summoner barriers;
  - a use for Guts.
- **Foe moves:** charged moves with locks, Break stripping foe buffs, and Rally.

## 6. The plan

Each phase ships on its own and is checked with the simulation before the next. Phases 1–3 each take a new engine
version; earlier fights replay as they were. No save migration is needed: points, accessory effects and foes are
computed when a fight starts and frozen into it.

### 6.0 See it (no balance change)

- **A full stat sheet** on the profile's Battle tab. Every stat always has a row, 0 included, grouped:
  - **Offense:** ATK, M.ATK, Might per weapon.
  - **Defense:** DEF, M.DEF, Evasion, physical and magical damage cut, Barrier, Veil.
  - **Sustain:** HP, HP Regen, Lifesteal, MP, MP Regen, MP Steal.
  - **Other:** Thorns, Mirror, Limit head start, Orb kinds.

  Each row keeps its level / gear / Extra Stats split. Today HP Regen and MP Regen appear only as an accessory's line.
- **Damage numbers on intents:** "Flame smash → Kitasan, about 180", from the same `battleDamage` previews use.
- **The simulation as built:**
  - **Engine:** v11.
  - **Gear:** on-curve flat adds — weapon and armor grade ⌈level ÷ 5⌉, Extra Stats nodes by level.
  - **Heroes:** one Hero per party and Learners at the expected Bond.
  - **New columns:** lowest Uma HP, KOs and focus.

  Its v11 numbers (§2) become the baseline, and D135's elite tuning gets re-checked against it.

### 6.1 Numbers that count (the rework)

**Targets**, fitted with the simulation:

| Measure | Today (Lv1 → Lv50) | Target |
|---|---|---|
| A regular foe's 100% hit | 18% → 58% of a Brawler's HP; 24% → 75% of a Mage's | 12–18% at every level; 25–35% for a captain's or champion's big move |
| What her DEF removes from a hit at her level | 18% → 9% | About a third; about half with a full defensive build |
| The newest node or grade | +6% → +1.4% damage | A steady 3–5% at every level |
| Regular foe HP at Lv50 | up to 3,982 | ≤ 999 |
| Elite captain | 2× the region's boss | Below the region's boss |
| Region boss HP | 4,896 | ≤ about 6,000: the one thing in the thousands |
| Biggest Uma hit at Lv50, all stacked | about 1,150 | ≤ 999 |
| Wins, on-curve party, no sustain Uma | bosses 40–75% | Regular ≥ 95%, elite about 90%, boss 70–85%; higher with one |

**The formula:** `damage = power × offense² ÷ (offense + defense)`, in place of the subtraction.
- **What it does:** the same ratio of offense to defense gives the same share at every level. It is never zero, so the
  0.2 floor goes.
- **Balance:** +10% DEF is about 5% less taken; +10% ATK about 15% more dealt.
- **Uma damage:** stays within about 10% of today's. 113 ATK against a Lv50 foe's 88 DEF gives 64 against today's 69;
  Lv1 gives 13 against 14.
- **Taken damage:** what changes is set by the foe re-fit below.
- **Rejected:** keeping the subtraction with lower foe offense. Its 0.2 floor makes DEF either everything or nothing
  near the edges, which matters once Extra Stats grow.

**The foe curve in one place:**
- **Offense:** from the Uma DEF expected at the foe's level, × role, × a threat factor that lands the target hit share.
  It replaces the reference stat × 3 × budget × world multipliers.
- **HP:** from the party damage expected at that level, so regular stages still last about 4–6 rounds.
- **Elites:** their HP drops below bosses'.

**Bonuses that grow with their grade:**
- **Extra Stats:** a grade-g node gives **g points** (a moon g to its stat, a bridge g ÷ 2 to each, a Sun g ÷ 8 to all).
  A full track is +55 rather than +10. Active nodes stay `5 + ⌊level ÷ 2⌋`, so a Lv50 Uma chooses about three full
  tracks: her build. The 1 HP = 5 points rate is re-fitted.
- **Armor:** its slot's defensive stat becomes +2g (a G10 helm is +20 DEF).
- **Accessories,** as shares of her own numbers so they scale with level:

  | Accessory | Today, a grade | Proposed, a grade | Grade 10 |
  |---|---|---|---|
  | Vital Talisman (Regen) | 1 HP a round | 0.5% of max HP a round | 5% |
  | Vampire Talisman | 0.5% of physical dealt | 2% | 20% |
  | Bulwark Talisman / Veil Amulet | Barrier / Veil of 5 | 2% of max HP | 20% |
  | Iron Talisman / Ward Amulet | 0.5% less taken | 1.5% | 15% |
  | Thorn Talisman / Mirror Amulet | 1% returned | 3% | 30% |
  | Spring Amulet | ⌈g ÷ 2⌉ MP a round | 1 MP a grade | 10 |
  | Siphon Amulet | 0.2% of magical dealt as MP | 0.5% | 5% |

**Formations split offense too.** Each foe's offense takes the square root of her HP share against a pair's foe.
- **Each foe:** a swarm foe hits at about half strength.
- **A round's total:** a swarm deals about 1.85× a pair's damage, a squad 1.6×, a trio 1.2×.
- **Counters:** small hits are what Barriers and Guard handle best.

### 6.2 A defensive half (no new classes)

Every class still deals damage. One sustain-capable Uma makes fights comfortable, and none is required.

| Who | What | Notes |
|---|---|---|
| **Cleric** | Each Tome skill also **mends**: it heals the most-hurt Uma, and every Uma at depth 5. It also **cleanses** one foe status from each Uma it blesses (Burn, Mark, Weaken, Slow) | Lifts D86's "no healing for now". Her blows still debuff, her spells still bless; now they heal too. A depth-matched mend is about 20–30% of an average Uma's HP, one to two foe hits |
| **Cleric** | **Rebirth:** the Light tree's depth-3 side B (in place of Heavy). It revives a fallen Uma at 25% HP, once per Uma per fight | Her only revive; it costs a side point and a turn |
| **Brawler** | Her **Guard covers the whole party** from single-target moves, at half damage on her own DEF (other classes still cover one Uma) | The tank turn: she gives up her damage for the round. Her HP and DEF leans already fit |
| **Summoner** | Each **summon** gives every Uma a Barrier stack (8% of max HP, cap 30%, the existing rider) | Her familiars shield the party; it pairs with formations' smaller hits |
| **Mage, Spell Blade** | Unchanged: they answer danger by Breaking | Spell Blade's two kinds an act make her the best lock breaker (§6.3) |
| **Guts** | A battle stat at last: **Heal**, from Guts like ATK from Speed, × the class lean (Cleric highest). Mends and Rebirth scale with it | Today Guts does nothing in a fight |
| **Waves** | Every Uma recovers 10% of her max HP when the next wave enters | Swarms and boss stages come in waves, and HP carries between them |
| **Auto** | Guards when a shown intent would knock an Uma out or leave her under 25%, and mends the most-hurt Uma below half | Auto is also the simulator's player, so tuning assumes it |

### 6.3 Foes that do more, every move answerable

Because the party can now answer, foes can act more often, with each move smaller (the totals stay inside §6.1's
targets). Every move kind has a counter:

| Foe move | Answer |
|---|---|
| Damage on one Uma | Guard (Brawler: the whole party), Barriers, mends |
| Damage on everyone | Barriers, Aegis, mends, Breaking the caster first |
| A status (Burn, Mark, Weaken, Slow) | Cleric cleanse |
| A buff on herself (Rally: Power-up, Ward) | **A Break strips her buffs** |
| **A charged move** (new) | Its locks, or a Break |
| Damage already taken | **Rally** (below), mends |

- **Charged moves with locks** (Sea of Stars):
  - **Who:** a Sub-boss captain and a Boss each have one. Phase two brings a stronger one.
  - **Announcing:** the foe shows "Charging: Flame storm" a round early with two to four **locks**: kinds drawn from her
    weaknesses.
  - **Breaking locks:** a hit of a lock's kind breaks it, and an Orb's kind counts, as it does for weaknesses.
  - **Firing:** next round the move fires at its power × the share of locks left. Breaking every lock, or Breaking
    her, cancels it.
  - **The splash:** her cut-in plays on the charge and again on "Cancelled!". This is where the splash art earns its keep.
- **More acts:**
  - **Bosses** act twice (one move may be the charge).
  - **Key enemies** and guards gain Guard moves.
  - **Swarms** keep their numbers with smaller hits (§6.1).
- **Rally** (Bloodborne, later in the phase):
  - **The grey part:** 30% of each foe hit shows as grey on her HP bar.
  - **Winning it back:** if the party Breaks or defeats the foe who dealt it before that foe acts again, it returns.
  - **Otherwise** it fades.
  - **Only the last hit counts,** so the rule stays one line, and Break becomes a heal as well as a damage window.

### 6.4 Sizes and order

| Phase | Engine | Size | Touches |
|---|---|---|---|
| 6.0 | — | S–M | Profile Battle tab, intent labels, `balance.test.ts` |
| 6.1 | v12 | M–L | `battleDamage`, `rpg/campaign/enemies.ts`, `world/world.ts` tuning, Extra Stats points, gear and accessory effects, every balance doc |
| 6.2 | v13 | M | Cleric and Summoner skill riders, one tree side, Brawler Guard, Heal stat, wave recovery, Auto |
| 6.3 | v13 or v14 | M–L | Foe kits, charge and lock state, Break stripping buffs, Rally, cut-in captions, lock icons |

## 7. Does it need a big rework?

**One:** §6.1.
- **What it changes:** every foe is re-fitted and every point's worth changes.
- **What it touches:** one formula, the foe tuning and the points tables.
- **What it doesn't:** classes, trees, the map, saves.

The rest adds rules on top of what exists.

Raising bonuses alone would just make fights easier, and DEF would stay worthless while foe offense is 5× it. So the
increases come only with the re-fit.

## 8. Decided here (the owner can overturn any; §0 records what the owner's review changed)

1. **Kept:** Break, intents, one act per Uma, five classes, ten weapons, the progression bars, small linear numbers,
   the in-order gear gates.
2. **The formula** becomes `offense² ÷ (offense + defense)`, in a new engine version.
3. **Foe numbers:**
   - offense comes from a target share of Uma HP (12–18% a regular hit);
   - regular foes stay under 1,000 HP;
   - elites sit below their boss;
   - only bosses reach the thousands;
   - an Uma's biggest hit stays under 1,000.
4. **Extra Stats:** a grade-g node is worth g points.
5. **Gear:** armor's slot stat is +2g; accessories become shares of her own numbers at about 3× today's worth.
6. **Formations:** split offense by the square root of each foe's HP share.
7. **Healing returns:**
   - the Cleric's Tome skills mend and cleanse;
   - Rebirth is her one revive;
   - a new Heal stat comes from Guts.
8. **Guard:** a Brawler's Guard covers the party; summons give a party Barrier; Umas recover 10% between waves.
9. **Foe moves:** charged moves with locks for captains and bosses; a Break strips foe buffs; Rally comes after them.
10. **The simulation** measures the game as built before any number is retuned (§6.0 first).

## Sources

- Sea of Stars locks: [Combat, Sea of Stars wiki](https://seaofstars.fandom.com/wiki/Combat).
- Honkai: Star Rail:
  - [Combat basics, Icy Veins](https://www.icy-veins.com/honkai-star-rail/combat-basics);
  - [Team building, Prydwen](https://prydwen.gg/star-rail/guides/team-building);
  - [Paths explained, Push Square](https://www.pushsquare.com/guides/honkai-star-rail-all-path-types-explained-and-best-team-compositions).
- Octopath Traveler II: [Break and Boost guide, Destructoid](https://www.destructoid.com/break-and-boost-system-guide-octopath-traveler-2/),
  [combat guide, Vulkk](https://vulkk.com/2023/02/24/how-combat-works-in-octopath-traveler-2-beginners-guide/).
- Slay the Spire intents: [How to read enemy intent](https://sts2.untapped.gg/guides/how-to-read-enemy-intent),
  [review, LessWrong](https://www.lesswrong.com/posts/MEimkSwwuRgiPaZaY/review-slay-the-spire).
- Into the Breach: [Road to the IGF, Game Developer](https://gamedeveloper.com/game-platforms/road-to-the-igf-subset-games-i-into-the-breach-i-),
  [review, Nintendo Life](https://nintendolife.com/reviews/switch-eshop/into_the_breach).
- Darkest Dungeon Guard: [Guard, Darkest Dungeon wiki](https://darkestdungeon.wiki.gg/wiki/Guard).
- Fire Emblem damage: [Atk, Fire Emblem Wiki](https://www.fireemblemwiki.org/wiki/Atk).
- Ratio armor: [Armor Scaling (YEP)](https://yanfly.moe/wiki/Armor_Scaling_(YEP)).
- Bloodborne Rally: [Rally, Bloodborne wiki](https://bloodborne.wiki.fextralife.com/Rally).
