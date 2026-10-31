# Combat

How a fight works today, on **engine v20**. It is Tier 1's fight from the Tier rework (engine v16, D210:
[class progression](../design/tier-rework/class-progression.md)), its economy (engine v17, D218:
[weapon progression](../design/tier-rework/weapon-progression.md) and
[Extra Stats progression](../design/tier-rework/extra-stats-progression.md)),
[weaknesses v2](../design/tier-rework/weaknesses-v2.md) (engine v18, D235–D237), and
[Classes v3](../design/classes-v3/classes-v3.md) with [Halls v2](../design/classes-v3/halls-v2.md) (engine v19, D240,
D241). Engine v19 brings the thirteen classes and Tier 0, the hands' lead half, the volley and the double, the re-paired
twins (Katana–Light, Bow–Dark), the Brawler's and the Sorcerer's new B lines, the Halls' Limit Breaks with their own
power, and the Rift's builds by family; every other battle rule is v18's. Engine v20 (D261) only trims the Halls to sixteen
Limit Breaks. A fight started on an older engine (v6–v19) replays and settles on that engine's own rules: fights from v19
replay with the twenty, and fights from v18 and before with six classes and the 24 Limit Breaks.

Every number below comes from the code. The tables between `live` markers are generated (see
[README](README.md#how-these-docs-stay-true)); the rest is written by hand and checked against the engine.

Code: `packages/domain/src/rpg/battle/` (`engine.ts` the reducer, `skills.ts` its constants and skill lookup, `limit.ts`,
`auto.ts`, `types.ts`, and `caps.ts`, which holds `BATTLE_ENGINE_VERSION`), the class rules in `rpg/rules.ts` and
`rpg/class-tree.ts`, the skills in `rpg/catalog.ts`, the Limit Breaks in `rpg/heroes.ts`, foes in
`rpg/campaign/enemies.ts` and their weaknesses in `rpg/campaign/weaknesses.ts`, stages in `world/world.ts`
([maps](maps.md)), the Rift's fights in `rift/` (`fronts.ts`, `generate.ts`, `picker.ts`). The screen is
`apps/web/src/places/scenario-gate/FightScreen.tsx`, which the world map and the Rift share through a fight source
(`battle/fight-source.ts`, H50).

## A fight at a glance

- **Five Umas against 1–8 foes**, in **1–3 waves**. The five are the active party ([sections](sections.md#scenario-gate)).
- **Every fight starts at full HP.** On the world map **MP carries** from stage to stage and refills at Springs
  ([maps](maps.md)); a Rift fight starts at full MP.
- **Rounds.** Each round:
  1. The foes' intents are shown: each foe's move and target, and for a damaging move about what it will deal to
     its target (the most it deals to anyone, for a move on everyone), before Barriers and guards (D140).
  2. Each living Uma acts **once**, in any order the player picks.
  3. When all have acted, the foes act in initiative order. A foe that **acts twice** takes her second move after every
     foe's first; a Rift Duel champion who **acts three times** takes her third after every second.
  4. The round ends, in this order: guards lapse; a Broken foe whose two rounds are up stands back up; Burn ticks;
     statuses count down; each standing Uma's Flourish mends and she regains MP ([below](#sustain-mp-and-the-flourish));
     skill Barriers lapse; each Cleric's Regen mends.
- **Win:** every foe of the last wave falls. **Lose:** every Uma falls, or the fight runs past 40 rounds a wave (120 for
  a three-wave stage).
- **Deterministic.** A fight is its frozen input plus the actions taken (D52), so it replays identically. Random targets
  are seeded by the fight, the round, the actor and the hit. Every action is saved, so a fight survives a reload and
  resumes on another device.
- **Waves.** When a wave falls and another waits, the round ends at once, without its round-end steps. The next wave
  steps in at the start of a fresh round, so everyone acts again. The party keeps its HP, MP, statuses, Barriers, Limit
  charge, lingering summons and Regens; guards lapse, Rallies are lost, and every Uma standing recovers 10% of her max HP
  (a breather).
- **Auto and speed.** Auto plays each Uma's turn with the same policy the balance simulation uses (`autoAction`):
  - a ready Limit Break first (a Hero's own, a Learner's from her highest Bond), on the foe it scores best on;
  - otherwise the best affordable skill or Attack, weighing weaknesses, how many foes it reaches and a standing
    shield; against a Rift foe's ward the warded channel counts for less;
  - a healer's support counts too: a mend for the hurt, a Barrier for the threatened, a revive for the fallen (a support
    that uses its whole share is worth 1.5 casts of its depth's damage);
  - a volley counts its splash on every other standing foe too;
  - a Spellblade or a Summoner picks her best lead half, then her best other half with the MP left;
  - if the engine refuses the pick, an Attack with her first weapon, then a Guard.

  Any tap hands control back, and so does a failed action. Speed plays the animations at 1×, 2× or 4×.

## Battle scenery

Each region's fight has its biome's sky, a repeating pixel-art horizon and a tiled ground floor. Capitals use Ancient
Ruins. The lower party band and foe info panels stay dark for readable bars and numbers. The scene stamps the terrain
once per size, not per animation frame; if the art is unavailable, the gradient remains.

The party stands below as busts in spaced, bordered cards with solid dark backgrounds, fitted without stretching
and anchored at the bottom. They breathe gently while idle and make one small hop with a brief glow on a win.
Reduced motion turns these animations off; missing busts use the outfit icon. Chibis stay on the Town Hall plaza, never
in fights (SB5).

Hits use a four-pose pixel impact for their damage kind. Lingering summons have small, two-pose familiars beside
their owner, replaced by the next summon and removed when she falls. Effects follow the scene clock at 1×, 2× or 4×,
including later waves. Reduced motion shows a still final impact and no familiar idle; missing art uses the procedural
fallback.

## The actions

| Action | What it does |
|---|---|
| **Attack** | One hit of one of her three weapons' kind at power 1.0 × her hand, on the tapped foe. Free |
| **Skill** | One of her equipped skills: its MP, its hits, its shape ([skill trees](skill-trees.md)) |
| **Guard** | Covers another Uma until the end of the round: a foe's single-target hit aimed at her lands on the guard at half damage |
| **Limit Break** | With a full gauge, for a Hero or a Learner only: her seat's or one of her Heroes', at no MP, as her act ([below](#limit-breaks)) |

**The Limit gauge** fills to 12: +4 for an act with a skill in it, +2 for an act of Attacks only. A Guard and a Limit
Break add nothing; Limit points give a head start.

**Her hand** scales the power of every skill and Attack she makes, by the half it belongs to (Arms or Tome), and her
skills' MP ([classes](classes.md)). A skill costs its own MP × her MP hand, rounded and at least 1, × the tier it
belongs to.

Class rules change the act ([classes](classes.md)). A pair class's hand has a **lead half** (D245), the larger, which
resolves first whatever order the halves were picked in:

| Class | An act | Hands, the lead first | MP |
|---|---|---|---|
| A Tier 0 | One skill or Attack | ×1 | ×1 |
| Brawler, Sorcerer | One skill or Attack | ×1 | ×1 |
| Arms Spellblade | A pair, the Arms half first, with the extra hit | Arms ×0.72, Tome ×0.44 | ×0.5 a half |
| Tome Spellblade | A pair, the Tome half first, with the extra hit | Tome ×0.72, Arms ×0.48 | ×0.5 a half |
| Arms Summoner | A pair, the Arms summon first, lingering | Arms ×0.57, Tome ×0.46 | ×0.5 a half |
| Tome Summoner | A pair, the Tome summon first, lingering | Tome ×0.57, Arms ×0.5 | ×0.5 a half |
| Paladin, Cleric | One skill or Attack | ×0.5 | ×0.6 |

- **A Tier 0:** one skill or one Attack an act, at ×1. Her skill is one hit on one foe at her Class Rank's power, 10 MP.
- **Brawler and Sorcerer:** one skill or one Attack an act, at her hand ×1.0.
- **The Spellblades:** every act is a pair, one Arms half (an Attack or an Arms skill) and one Tome half (an Attack or a
  Tome skill), and the MP is the sum of the halves. **Her lead half lands one extra hit:** its power is spread over one
  more hit, so an Attack lands as two hits at half power and an n-hit skill as n + 1, the total unchanged. Each weak hit
  chips a shield point, so with an Attack in each half she chips three an act. The Arms Spellblade leads with her Arms,
  the Tome Spellblade with her Tomes.
- **The Summoners:** every act is a pair too, an Arms summon and a Tome summon (an Attack can be either half). Her **lead
  summon lingers**: the Arms Summoner's Arms one, the Tome Summoner's Tome one. When her next pair comes, before either
  half, it strikes **every living foe** once in farewell, one hit of its kind at its linger share (0.3, or 0.4 on her
  lead trees' line B, Bonded) × its hits' power × `BATTLE_FAREWELL_FACTOR` (0.1), then leaves. The farewell can't be
  intercepted, and a weak one chips a shield. Her other half's summon or an Attack leaves nothing. Limit Breaks, Guards
  and new waves keep the lingering summon; if she falls, it leaves with her. Her skills carry no support.
- **Paladin and Cleric:** the healers, one skill or Attack an act at ×0.5. Their Arms skills put a debuff on the tapped
  foe and a **Barrier** on the Uma the shown moves threaten most; their Tome skills put a buff on every Uma, **mend** the
  most hurt and **cleanse** one foe status from each. At depth 5 the debuff reaches every foe, and the Barrier and the
  mend every Uma. See [Support](#support).

## Damage

Every hit an Uma makes, a skill's, an Attack's, a farewell's or a Limit Break's, takes the same steps (WP31,
the damage stack, `battleDamage`). For each part of each hit:

1. **Offense:** her ATK for an Arms kind, her M.ATK for an element (a Learner's inherited Limit Break hits with the higher
   of the two), plus:
   - the **Might** of her weapon of the hit's kind: 1, 4, 8, 12, 19, 26, 35, 45, 57, 68 at G1–G10 in Tier 1, ×1.8 and
     ×2.6 in Tiers 2 and 3 ([materials](materials.md#gear));
   - her **accessory's flat offense** on the hit's kind, and her **signature** while she wears her knack's family
     ([below](#her-accessory-and-signature)).
2. **The hit:** `offense² ÷ (offense + defense) × power` (D141). Defense is the target's DEF against an Arms kind and
   M.DEF against an element. The same ratio gives the same share at every level, and it is never zero. Power is the
   hit's share of its skill (an Attack 1.0) × her hand for its half (a pair's lead half the larger,
   [above](#the-actions)) × her **Skill Rank**, ×0.95 to ×1.05 ([classes](classes.md#skills-depths-lines-and-ranks));
   Attacks and Limit Breaks don't rank, and a Tier 0's skill takes her Class Rank's power instead. A volley's hits on the
   tapped foe share 0.8 of its power and its splash hit on each other foe is 0.35 (for 2 MP more than the depth's); a
   double's two hits on one foe each carry half. A farewell's and a Limit
   Break's power are their own (above, [below](#her-accessory-and-signature) and [below](#limit-breaks)).
3. **Weak:** ×1.3 when the hit's kind is on the foe's list ([below](#weaknesses-shields-and-breaks)), or it's Light or
   Dark against a Hexed foe.
4. **Her Insignias:** ×(1 + 1% a grade, slots added) on a sub-boss or a boss.
5. **Statuses** ([below](#statuses)), each its own factor: the attacker's Brave or Faith (+10% a stack, by channel),
   Power-up (+15%), Weaken (−15%) and Enfeeble (−10%); the target's Armor Break or Mind Break (+10%, by channel), Shock
   and Mark (+10%), Ward (−15%) and Aegis (−10%).
6. **Specials:** `vs-broken` ×1.3 on a Broken foe, `vs-wounded` ×1.3 on a foe below half HP. A volley's special and
   rider land on the tapped foe; its splash is plain: no special, and no rider on a foe only the splash struck.
7. **Unbroken foes take ×0.5.** Breaking them is how damage lands. `pierce` skips this step: both Spellblades' line B,
   the Brawler's Katana B and the Sorcerer's Light B, each one hit at ×1.15 of its depth's power (×1.035 the Brawler's,
   about ×0.98 the Sorcerer's, after their lines' factors).
8. **The ward:** a Rift foe takes ×0.5 again from the channel she wards, Broken or not, `pierce` or not
   ([below](#weaknesses-shields-and-breaks)).
9. **Evasion:** an Uma takes less by her evasion, 0.6% a Speed point (from her feet armor and Extra Stats), 50% at most.
10. Rounded, and at least 1.

A foe's hit on an Uma takes steps 1 (the foe's ATK or M.ATK alone, by the move's channel), 2, 5, 9 and 10, at the
move's power.

- **Guards:** a guard who intercepts a hit takes half of it, at least 1. An Uma's Guard covers one Uma from foes'
  single-target moves (never a move on everyone). A foe guard covers the foe with the lowest share of HP until the foes'
  next turn: an Uma's one-foe skills and Attacks on her land on the guard, and a weak one chips the guard's shield.
- **Barriers:** a foe's hit spends her Barrier first (a healer's, or her Flourish's), then her HP.

Where the stats come from (`projectRpgStats` in `rpg/rules.ts`):

| Stat | From the outfit's projected stats (base ÷ 5 + 1.5 × (1 + growth) per level) | Then |
|---|---|---|
| HP | 100 + 5 × Stamina + 2 × Power + Guts | × class lean, + armor and Extra Stats |
| MP | 20 + 1.5 × Wit | × class lean, … |
| ATK / MATK | Speed | × class lean, … |
| DEF | Power | × class lean, … |
| MDEF | (Power + Wit) ÷ 2 | × class lean, … |
| Initiative | Stamina | Foes act by initiative; Umas act in the order you choose |
| Healing scale | A Paladin's ATK, a Cleric's M.ATK; anyone else's higher | Her mends, Barriers and revives ×(1 + it ÷ 300) |

A Tier 0 has no class lean (×1 on all six).

Her armor and Extra Stats add flat points on top ([materials](materials.md#gear), [loops](loops.md#extra-stats-and-gear)):
a point is +1 to its stat (+5 for HP), a Speed point 0.6% evasion and a Limit point 0.4 of a head start on the gauge,
rounded down. The healing scale reads her stats with those points, never Might, her accessory or her signature.

### Where damage comes from

Measured on the balance simulation's on-curve Brawler at each level (D142, D143), on her Greatsword hits, with the live
stack. Offense adds up; a hit doesn't, since it is offense² ÷ (offense + defense), so each source is shown as what her hit
loses without it (the others kept), and all three against her level stat alone. Skill depth, opened by Class Rank,
multiplies whatever offense she has.

<!-- live:damage-sources -->
| Level | Gear grade, skill depth | Uma stats (level) | Extra Stats | Weapon Might | Armor | Offense | Hit without Extra Stats | Hit without the weapon | Hit without armor | All three vs her stats alone | Skill depth vs depth 1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Lv 1 | G1, 1 | 24 (73%) | 1 (3%) | 1 (3%) | 7 (21%) | 33 | −4% | −4% | −28% | ×1.56 | ×1.00 |
| Lv 10 | G2, 2 | 41 (72%) | 3 (5%) | 4 (7%) | 9 (16%) | 57 | −7% | −9% | −21% | ×1.58 | ×1.38 |
| Lv 25 | G5, 3 | 68 (54%) | 13 (10%) | 19 (15%) | 25 (20%) | 125 | −14% | −20% | −26% | ×2.38 | ×1.81 |
| Lv 40 | G8, 5 | 95 (45%) | 33 (16%) | 45 (22%) | 36 (17%) | 209 | −22% | −29% | −24% | ×3.26 | ×2.87 |
| Lv 50 | G10, 5 | 113 (41%) | 51 (18%) | 68 (25%) | 45 (16%) | 277 | −26% | −34% | −23% | ×4.01 | ×2.87 |

A regular foe's 100% physical hit, as a share of her HP:

| Level | Uma stats only | + Extra Stats (HP, DEF) | + armor (HP, DEF) | All (on curve) |
|---|---|---|---|---|
| Lv 1 | 16% | 15% | 14% | 14% |
| Lv 10 | 22% | 21% | 19% | 18% |
| Lv 25 | 23% | 20% | 20% | 17% |
| Lv 40 | 27% | 21% | 22% | 18% |
| Lv 50 | 31% | 23% | 25% | 19% |

The Brawler leans ATK ×1.1 and DEF ×1.1; her map is the core her level opens, Prowess all to ATK; her armor is the physical half. Her preset's Bell adds a follow-up Attack rather than offense; a Pendant or an Orb would add its flat offense on her kinds, and her signature +0.1 a level while she wears her knack's family.
<!-- /live -->

## Her accessory and signature

Three accessory slots in every tier, each with its own grade and one of four families' base forms, repeats allowed (D264,
was one; [materials](materials.md#gear)). A slot at G0 or without a family does nothing. Every value is linear, so every raise
counts (D266). Tier 1's, one slot:

| Family | In a fight | A grade · G10 |
|---|---|---|
| **Pendant** | +ATK, a real stat: it counts on every Arms hit, a Paladin's mends and an inherited Limit Break | +1 · +10 |
| **Charm** | +M.ATK, the same way | +1 · +10 |
| **Orb** | Flat offense on its one kind, which must be one of her weapons' when she sets it; it counts on any hit of that kind, a Limit Break's too | +2 · +20 |
| **Insignia** | Her hits on sub-bosses and bosses ×(1 + 1% a grade) | +1% · ×1.10 |

Slots add up: three G10 Orbs on one kind are +60 and three G10 Insignias ×1.30. The Pendant, the Charm and the Orb are ×1.8 in
Tier 2 and ×2.6 in Tier 3; the Insignia is the same in every tier.

**What wins (D266, measured on Auto at Lv 50):** three of her stat on the Brawler, the Sorcerer, the Paladin and the Tome
Spellblade; Orbs on the hybrids whose damage leans on one kind and on the Cleric; Insignias on sub-bosses. No mix wins more than
half the cases. The preset (her stat twice and an Orb) is a good all-round set in every class, not the best in any one fight.

- **A fight already open** keeps what it started with, a Bell's follow-up hit too: only fights started before D264 have one.
- **The Insignia** reads the foe's rank, not her face: the Rift Horde's boss-faced leaders are regulars, so it skips them.
- **Her signature** (WP33, UT7, D266): while one of her slots holds her knack's family at G1 or above, she adds 0.1 a level
  × the tier's multiplier (×1, ×1.8, ×2.6), at least 1, to her ATK and M.ATK on her hits: +5 at Tier 1 Lv 50
  ([classes](classes.md#her-calling-and-her-template)).
- **Only the Pendant and the Charm heal:** they are real stats. Mends, Barriers and revives read her ATK or M.ATK without an
  Orb, an Insignia or her signature.

## Weaknesses, shields and Breaks

- **Weaknesses v2** (engine v18, WK1–WK10, `rpg/campaign/weaknesses.ts`) gives every world foe her own list, fixed when
  her stage is made. It covers the regions, the capitals' Finals and the scenario chapters; the Rift draws its own
  ([below](#the-rifts-foes)).
  - **Tier 1:** a regular-rank foe (Key enemies, guards and escorts too) is weak to **2 Arms + 2 elements**. A sub-boss
    or a boss is weak to **3**: 2 Arms + 1 element, or 1 Arm + 2 elements, by the stage's seed.
  - **Tiers 2 and 3:** every rank is weak to **3**. A regular leans to the channel her weaker defense guards: strikers
    and guards 1 Arm + 2 elements, casters and skirmishers 2 Arms + 1 element. Sub-bosses and bosses split by seed.
  - **Elements:** the ring's answer to her lead element comes first, then a two-element foe's answer to her second; never
    one of her own. The rest come from the stage's element deck. A Light + Dark foe answers to neither, so hers come from
    Fire, Ice and Lightning only.
  - **Arms:** dealt from the stage's Arms deck in slot order, across its waves. A foe never holds an Arm twice, nor the
    previous foe's Arms again when another card fits, and the deck is reshuffled when it runs out, so the five Arms come
    round before one repeats. Dealt elements follow the same rule.
  - **Fixed per stage:** the stage sheet shows the lists before Fight, and every visit and Sweep meets the same foes.
    Every world foe answers to both channels.
  - **On screen:** the stage sheet reads `Shield n · Weak:` and the icons. A fight's foe card shows the shield and up to
    four 12 px icons, Arms first, each in its kind's color (D234), with no visible "Weak:"; a screen reader still hears
    "weak to …".
- Every foe has a **shield**. In the world it goes by formation (1–6; an escort's captain 5 and her guards 2), an elite's
  Keys and a boss's guards 2, a capital's escorts 3, sub-bosses 6 and bosses 8 ([maps](maps.md#a-stages-foes)); the
  Rift's go by front (below). **Each weak hit removes one point.** A Breaker charge makes a weak hit remove two, and
  Shatter removes points directly.
- At zero the foe **Breaks**. She loses this round's and the next round's action, and takes full damage (×2 compared to
  unbroken). The Break also strips her buffs (Power-up, Ward), cancels a charged move and gives back the party's Rally
  from her. At the end of the second round she stands back up with her shield full, **Steeled**: her shield can't be
  chipped until she has made a move, so a party can't hold her down Break after Break. Her shield badge shows it.
- **The ward (the Rift):** an Iron or Arcane front foe wards one channel, elements on the Iron front and Arms kinds on the
  Arcane ([the Rift](../design/rift.md) §5). An Uma's hit of the warded channel deals ×0.5 again, on top of the unbroken
  halving: a quarter of a Broken hit while her shield stands, and still half once she's Broken. `pierce` skips the
  unbroken halving, not the ward. Foes' hits are never warded. Auto weighs it: a skill or Attack loses half the share of
  its power in the warded channel, so the party reaches for the other channel first. It's a trait of the foe, not the
  Ward status below. On screen (H50): a warded foe carries her front's crest beside her element (Iron's for elements,
  Arcane's for Arms), the hit line reads "· warded", and foe lists show "Wards Tomes" or "Wards Arms".
- Elements beat each other in a ring and a pair: **Fire > Ice > Lightning > Fire**, and **Light ⇄ Dark**. The ring leads
  a world foe's element list; the rest of her list is dealt.
- **The twins** pair each Arm with an element: Greatsword–Fire, Axe–Ice, Lance–Lightning and, from engine v19,
  **Katana–Light** and **Bow–Dark** (Bow–Light and Katana–Dark before; CV13). The Rift's Duel and Horde draw their
  weaknesses by twin set ([below](#the-rifts-foes)), and a Hall seat answers by them; weaknesses v2 reads no twin, so the
  world's lists didn't move.

## Statuses

| Status | Who puts it on | Effect per stack (cap 3, 2 rounds unless stated) |
|---|---|---|
| Armor Break | Paladin and Cleric Greatsword skills; riders on Arms skills (below) | +10% physical damage taken |
| Mind Break | Paladin and Cleric Lance skills | +10% magical damage taken |
| Enfeeble | Paladin and Cleric Axe skills (a Paladin's on every foe from depth 4); Ice riders and the Summoners' Dark | −10% damage dealt |
| Shatter | Paladin and Cleric Bow skills | Removes a shield point a stack, at once |
| Hex | Paladin and Cleric Katana skills | Weak to Light and Dark while it lasts (one stack) |
| Shock | Lightning riders | +10% damage taken |
| Burn | Fire riders, on foes; a champion's phase-two storm when it is Fire, on every Uma | Loses 4% of max HP at the end of each round |
| Brave | Paladin and Cleric Fire Tome skills, on every Uma | +10% physical damage dealt |
| Faith | Paladin and Cleric Light Tome skills, on every Uma | +10% magical damage dealt |
| Aegis | Paladin and Cleric Blizzard Tome skills, on every Uma; a Paladin's Greatsword blows, 1 on each Uma their Barrier reaches | −10% damage taken |
| Breaker | Paladin and Cleric Thunder Tome skills, on every Uma | A charge: her next weak hit removes two shield points |
| Clarity | Paladin and Cleric Dark Tome skills, on every Uma | Restores 4% of max MP a stack, at once |
| Mark | Foes: a skirmisher's cut | +10% damage taken |
| Weaken | Foes: a caster's Hex | −15% damage dealt |
| Power-up | Foes: a captain's Rally, on herself | +15% damage dealt |
| Ward | Foes: a champion's guard up, on herself | −15% damage taken |

- **A healer's statuses** come 1, 1, 2, 2 and 3 stacks at depths 1–5. Her line A (Lasting) makes them last 3 rounds;
  her line B (Heavy) adds a stack. A debuff lands on the tapped foe, on every foe at depth 5 (a Paladin's Enfeeble from
  depth 4); a buff on every Uma.
- **Riders and specials** sit on depth-5 skills ([skill trees](skill-trees.md) list them): the Brawler's, the
  Sorcerer's and both Spellblades' line A, both Summoners' lines, and the two Barrages. Fire puts Burn on the foes it
  hits, Ice Enfeeble, Lightning Shock, and every Arm but the Katana Armor Break. The Katana and Light deal ×1.3 to a
  Broken foe instead, and Dark ×1.3 to a foe below half HP; the Summoners' Dark puts on Enfeeble, and their Light has
  none. A volley's lands on the tapped foe only. A Tier 0's skill has none.
- A status adds up to 3 stacks and its rounds refresh to the longer. Statuses count down at the round's end.

Battle badges show the published status glyph and its stack count, with the full name in the accessible label.
Statuses without glyphs (including Burn and foes' Power-up) keep text badges. Skill descriptions keep full names
beside decorative glyphs; Shatter and Clarity act immediately, so they do not create lingering badges.

## Support

The party's defensive half is its one healer, a Paladin or a Cleric (classes v2's one healer, doubled shares). Every
other class deals damage only, a Tier 0 too (the Tier 0 Healer heals only once she promotes), and no Limit Break mends from engine v19. Every
support comes after the skill's hits.

| Support | Who | What it does |
|---|---|---|
| **Mend** | Paladin and Cleric Tome skills (the most hurt Uma; every Uma at depth 5) | Heals a share of the target's max HP by depth: 28%, 32%, 36%, 40%, 44%; on every Uma ×0.4 |
| **Barrier** | Paladin and Cleric Arms skills (the Uma the shown moves threaten most; every Uma at depth 5); a Paladin's Blizzard spells (every Uma, at half the share, ×0.4) | Absorbs any damage first, the same shares, until the end of the round. Cap 60% of max HP |
| **Cleanse** | Paladin and Cleric Tome skills | Removes one foe-made status (Burn, Mark, Weaken) from each Uma |
| **Revive** | The Cleric's Rebirth and the Paladin's Valkyrie's Oath, both their Light tree's depth-3 B | Raises the first fallen Uma at 25% of her max HP, once per Uma a fight |
| **Regen** | Cleric Light spells | Her spell's mend again at ×0.2, at the end of its round and of the next ("Regen" on screen). Her next Light spell replaces it; it ends if she falls |
| **Drain** | Cleric Dark spells | 30% of the damage its hits deal heals the most hurt Uma |
| **Aegis** | Paladin Greatsword blows | Aegis 1 on each Uma their Barrier reaches |

- **Her shares rank:** a mend's and a Barrier's share take her Skill Rank's ×0.95 to ×1.05, as power does.
- **Her healing scale:** every mend, Barrier and revive ×(1 + offense ÷ 300), offense being a Paladin's ATK and a
  Cleric's M.ATK (anyone else's higher, for a v15–v18 Limit Break's). An on-curve Lv 50 healer is about ×1.6. Her
  battle sheet shows it ("Mends ×1.62 (from ATK)"). A Drain doesn't take it.
- **One healer a party:** a party with two Paladins or Clerics, or one of each, can't start a fight; a Tier 0 never
  counts ([classes](classes.md#the-class-tree)).
- **Rally:** 30% of the last foe hit an Uma took (after Barriers) shows grey on her HP bar. If the party Breaks or
  defeats that foe before the foe moves again, the Uma wins it back.

## Sustain: MP and the Flourish

- **The base MP regen** (SB18, D204, D215): at each round's end every Uma standing regains 1% of her max MP for each skill
  depth her Class Rank opens, five at most (5% from Class Rank 40), rounded, at least 1, one cue ("+15 MP"); a Tier 0's
  is depth 1's, 1%. A Class Rank 40 Sorcerer with 296 MP regains 15 a round; her Details sheet reads "MP 296 · +15 a
  round". It never takes her past her max. A Clarity restores MP at once; between fights, Springs refill it
  ([maps](maps.md)).
- **The Flourish** (UT6, D204, CV21): while she fights as any class of her calling's family (her Tier 0 and its
  children), her template gives her 4% of her max HP a fight, in her stride's shape
  ([classes](classes.md#her-calling-and-her-template)): **Clean break** a Barrier of 4% at
  the start, which lapses at round 1's end; **Even pace** 1% at each round's end; **Late reserve** 2% at each round's
  end from round 3, each up to 4%. No healing scale, it never overheals, and a fallen Uma gets none; once a fight, not
  each wave. The log reads "{her name} ★ +30 HP" or "{her name}: ★ Barrier 37".

## Charged moves

Captains and champions carry a charged move (D141): the captain's Execution (on the weakest) and Cataclysm (everyone,
below half HP), the champion's Cataclysm and Apocalypse (below half HP). That is every sub-boss and boss, and the Rift
Horde's leaders, who are regulars in a captain's or a champion's role.

- **Announced a round early:** her intent reads "Charging: …" and her panel shows its **locks**, two to four kinds
  drawn by the fight's seed from her weaknesses (a kind can come up twice). The splash cuts in as she gathers.
- **Locks:** every hit of a lock's kind breaks one. The move lands the next round at its power × the locks left ÷ all of
  them.
- **Cancelled** when every lock breaks, when she is Broken or when she falls; the splash cuts in again with
  "Cancelled!".
- She doesn't charge two rounds running, and a foe that acts twice (or three times) charges only with her first move.
- **Mixed locks (the Rift's Duel):** weak to an Arms kind and an element, her locks alternate, an Arms kind first (Arms,
  element, Arms, …), so a set always needs both channels. Weak to one channel only, she draws as any foe.

## Limit Breaks

From engine v19 (Halls v2, D241, HV5) **a Limit Break carries its own power**: at 100% it is worth that power (×1.9 to
×2.9, each seat's in [Halls of Heroes](heroes.md#the-sixteen-limit-breaks)) × the scale of the class she casts it as × her
open depth's single-target power (a Tier 0's skill power at her Class Rank), shared among its hits; every-foe hits take
the area share (0.55 a foe) and random hits ×1.05, as skills do. The scale is H131's (D249): 1 for a Tier 0, 0.95 for the
six Tier 1 damage classes and 0.8 for the Paladin and the Cleric, so a healer on a Healer Sanctum seat lands 1.6×.

- **Its shapes are the weapons':** a Katana or Light strike is a double, two hits on its foe at half the strike's share
  each, and a double at random foes lands both on the same drawn foe; a volley cast puts 0.8 of its share on her foe and
  a 0.35 splash on every other.
- **At most 10 hits on one foe** a cast (Firefly Pact and Wisp Pact reach it).
- **No support:** no Limit Break mends, Barriers, cleanses or revives. The Healer Sanctum's four carry one stack for two
  rounds: a blessing on every ally after the hits (Brave 1, Faith 1), or a curse on the foe before them (Armor Break 1,
  Mind Break 1), so the cast feels it. A Learner's cast lands its stack whole.

<!-- live:limits -->
**Limit Breaks come only from the Halls of Heroes** (D112, engine v10). A Hero always uses her seat's, at 100%; a Learner uses either of her Heroes', at 50% plus 5% a Bond Level (100% at Bond 10), her inherited hits at the higher of her ATK and M.ATK while their kinds still decide weaknesses and locks (v15, C3). An Uma who is neither has none, and her gauge has nothing to spend. **A Limit Break's power is its own (the [Halls of Heroes](heroes.md) list each seat's) × her class's scale below × her open depth's power** (Halls v2, engine v19), and it never lands more than 10 hits on one foe in one cast:

| Class | Limit Break scale |
|---|---|
| Warrior | ×1 |
| Spellblade | ×1 |
| Healer | ×1 |
| Summoner | ×1 |
| Mage | ×1 |
| Brawler | ×0.95 |
| Arms Spellblade | ×0.95 |
| Arms Summoner | ×0.95 |
| Paladin | ×0.8 |
| Cleric | ×0.8 |
| Tome Summoner | ×0.95 |
| Tome Spellblade | ×0.95 |
| Sorcerer | ×0.95 |

In fights from v15–v18, a Limit Break that mends or raises a Barrier does it at 66% of each Uma's max HP ×0.4, × her healing scale and the cast's strength; its cleanse and its revive land at any strength. The gauge fills to 12: +2 for an Attack, +4 for a skill. A Limit Break costs no MP and takes her turn. Limit Breaks don't rank: their power follows her open depth, never her Skill Ranks. Fights from engines v15–v18 replay with six halls' 24 Limit Breaks, each worth her class's own power at 100% (Brawler 2×, Mage 2.4×, Spell Blade 2.2×, Cleric 1.5×, Summoner 2.2×, Paladin 1.5×); from v16 Rampart Charge charges with an Axe and Choir of Angels strikes with Light, then Lightning (CP35); fights from v15 replay with Rampart Charge's Greatsword and Choir of Angels' Light twice. Fights from engines v10–v14 replay with five halls' twenty: the Cleric Chapel's seats 3 and 4 Archangel’s Verdict and Archdemon’s Pact, Sunfire Edge in one cleave, Moon Fox on one foe, the Spell Blade at 2× and the Summoner at 1.8×, and a Learner's hits at each kind's own offense. Fights from engines v6–v9 replay with the classes' retired Limit Breaks: Brawler Twin Strike: one equipped skill cast twice at full power, or two Attacks with a weapon; Mage Prismatic Nova: a hit of each of the five elements, 2.4× her open depth's power in all; Spell Blade Twin Arts: an Arms skill and a Tome skill, both at full power (no half); Cleric Divine Patrons: a hit with each of her five weapons (1.5× in all), each status at 3 stacks; Summoner Grand Summon: one summon at twice her strength that lingers at twice its share.
<!-- /live -->

The block's line on a mend or a Barrier is the 24's, for fights from engines v15–v18. The sixteen Limit Breaks
themselves, and how Heroes and Learners earn them, are in [Halls of Heroes](heroes.md).

## Foes

Foes come from the stage generator ([maps](maps.md#a-stages-foes)). Each has a role, a rank (regular, sub-boss or boss),
one or two elements, a weakness list and a shield.

<!-- live:foe-roles -->
| Role | Moves | Below 50% HP |
|---|---|---|
| Striker | Strike the front (damage, 100%, front); Flame blow (damage, 130%, seeded) | — |
| Caster | Flame bolt at the weakest (damage, 110%, lowest-hp); Hex: weaken (debuff, seeded) | — |
| Guard | Shield bash (damage, 80%, front); Guard an ally (guard, ally) | — |
| Skirmisher | Flame cut + mark (damage, 90%, seeded); Strike the front (damage, 100%, front) | — |
| Captain | Flame smash (damage, 150%, front); Rally: power up (buff, self); Flame sweep (all) (damage, 55%, all); Flame execution (damage, 260%, lowest-hp, charged, 2 locks) | Flame storm (all) (damage, 75%, all); Crush the weakest (damage, 190%, lowest-hp); Flame cataclysm (all) (damage, 130%, all, charged, 3 locks) |
| Champion | Flame smash (damage, 160%, front); Flame sweep (all) (damage, 60%, all); Ward: guard up (buff, self); Flame cataclysm (all) (damage, 130%, all, charged, 3 locks) | Flame storm (all) (damage, 85%, all); Crush the weakest (damage, 210%, lowest-hp); Flame lance (damage, 170%, front); Flame apocalypse (all) (damage, 170%, all, charged, 4 locks) |

Shown with Fire; a foe uses her own element, and a dual-element foe her second element for her second elemental move.
<!-- /live -->

- **Targets:** "front" is the first standing Uma in party order, "the weakest" the one with the lowest share of HP,
  "seeded" one drawn by the fight's seed, "all" every Uma. A move on everyone can't be guarded.
- **Phase two:** captains and champions change tactics below 50% HP; a charged move she is gathering or landing carries
  over.
- **Acting twice:** a lone elite (the `solo` formation) always; from tier Lv 10 a lone region boss and an elite's
  sub-boss (D141). The Rift's Duel champion **acts three times** a round: her second move comes with every foe's second
  and her third after them all, and neither starts a charge.
- **Levels:** a foe's level is lifetime (Tier 2 Lv 1 is 51), and so is the reference stat her HP and defense grow from,
  but the build budget, the hit-share ramp and the world's per-level HP step restart at each tier's Lv 1, as a freshly
  ascended party's build does (D170). From engine v17 the budget's build part is × the tier's multiplier (EP16).
- **Faces** come from the region's franchise and each slot's tier, from a private file; see [maps](maps.md#faces).

Their numbers (`rpgFoe`; the world's steps in `world/world.ts`):

<!-- live:foe-scaling -->
| Setting | Value |
|---|---|
| HP | (40 + 4.2 × reference stat) × role × rank; the reference stat is an average Uma's at the foe's lifetime level |
| Offense | Set so a 100% hit takes a share of an average Uma's HP at her level (20% at tier Lv 1, 28% from tier Lv 10), × the offense budget, × role |
| Sub-boss and boss HP | ×3.5 and ×5.5, times the party's reachable skill depth |
| Build budget | What a built party's gear and Extra Stats call for, by tier level ℓ: HP and defense ×(1 + 0.035 × (ℓ − 1)² ÷ 49), ×2.72 at Lv 50; offense ×1.49 at Lv 50. It restarts at each tier's Lv 1, and its build part is × the tier's multiplier (×1.8 Tier 2, ×2.6 Tier 3; EP16): ×2.72 HP and defense, ×1.49 offense at Tier 2 Lv 50, ×2.72 and ×1.49 at Tier 3 Lv 50 |
| World: regular foes | +3.5% HP per tier level |
| World: elites | +0% HP per tier level |
| World: region bosses | ×0.5 a champion's HP |
| Acting twice | From tier Lv 10: a lone region boss and an elite's sub-boss; a lone elite always |
| Formations | A foe's offense is the square root of her HP share against a pair's foe, at most a full foe's |
| Shields | Regular 2 (by formation), sub-boss 6, boss 8 |
| Weaknesses | Engine v18: a Tier 1 regular (including Keys and guards) gets 2 Arms + 2 elements; a sub-boss or boss gets 3 kinds, split 2 + 1. Each stage deals its Arms and element decks across foes, the ring answer first; Light + Dark draws Fire, Ice and Lightning. The Rift keeps its twin draws |
<!-- /live -->

### Splash cut-ins

Key enemies, Sub-bosses and Bosses have a 16:9 splash (D135). It cuts in across the rivals' half of the stage:
- on her first move of each round;
- when she's broken, after the BREAK;
- when she changes tactics at half HP;
- when she's defeated, fading to grey.

Each cut-in shows her art sweeping in from the right, a stripe in her tier's colour (Key enemies teal, Sub-bosses
violet, Bosses red) and a caption: her move, BREAK!, Changes tactics! or DEFEATED. It holds for about 1.5 s,
zooming in slowly; 2× and 4× shorten it to about 1.1 s and 0.75 s.
- **Skipping:** tapping the stage skips it, like any playback, and the speed setting shortens it.
- **Reduced motion:** with reduced motion on, cut-ins don't play.
- **Regulars:** Regular foes have no splash.

The engine announces each foe move with a `move` cue. Cues are presentation only and never saved, so fights replay
unchanged.

## The Rift's foes

The Rift's fights are generated and none is on the world map ([the Rift](../design/rift.md) §5–§9, D173). A run has
four fronts of twelve stages and the Convergence's four fights; the twelve Echoes stand apart. Each fight is built from
its front, its stage and the run, on the tuning of the engine it starts on (`riftTuning`: R2's since engine v17, H81;
weaknesses v2 left the Rift as it was, WK9). A retry meets the same foes, weaknesses and faces with a fresh seed.

**The fronts.** Weaknesses come from the front, never the face, so a charged move's locks are always the front's kinds.
- **Iron:** weak to one Arms kind a foe. Its foes **ward** elements: an Uma's magical hits deal ×0.5 again, Broken or
  not.
- **Arcane:** weak to elements only (two for a regular, one for a sub-boss or a boss), warding Arms.
- **Duel:** one boss weak to twin sets, each an Arm and its element (Greatsword + Fire, Axe + Ice, Lance + Lightning,
  Katana + Light, Bow + Dark; Bow + Light and Katana + Dark on engine v18 and before): two at stages 1–6, one at 7–12, so
  to both channels. She acts twice, three times at the
  champion, and her lock sets are mixed.
- **Horde:** three waves of 4 to 6 foes, every one regular rank, each weak to one twin set dealt from a deck of the five,
  so a wave repeats none until all five are used.
- A champion pair's two bosses take kinds the other lacks first. Each foe carries one element, the one her moves carry,
  and it is one she isn't weak to.
- **The Duel's guard rail** (H51, D176, H71, D218, H131): no single act Breaks a Duel boss. Each class's best own act
  removes at most 10 shield points (every node of every line at Class Rank 50 and Skill Rank 5: the Summoners 10, the
  Spellblades 9, a Tier 0 1–2), and the best Limit Break 10 (Firefly Pact, Wisp Pact; no cast lands more than 10 hits on
  one foe), so her shields start at 13. Measured on engine v19 (D249); on engines v16–v18 the best Limit Break was 12
  (Chaos Rain).
- **The guided builds** (CP7, CV23): each front's guidance is a build, its five classes and every member's three
  weapons, set in one tap on the stage sheet ([sections](sections.md#the-rift)). From engine v19 each front's build is a
  family: Iron the Warrior side, Arcane the Mage side, the Duel the Spellblades, the Horde the Summoners, so a run's
  twenty hold all eight Tier 1 classes. The Duel suits the Spellblades (a mixed lock set alternates an Arm and an element,
  and every pair act lands one of each), the Horde the Summoners (every act leaves a farewell on every foe). Its foes are
  tuned for those builds (H71, H81, H131: [the Rift](../design/rift.md) §11).
- **On screen she reads as her face** (H50): a boss- or sub-boss-faced foe stands at that size on the stage and is
  tagged Boss or Elite in lists, whatever her rank, so the Horde's regular-rank leaders still look like leaders. A
  champion who acts three times says so ("Acts three times").

<!-- live:rift-fronts -->
| Front | Weak to | Ward | Stages 1–4 | 5–8 | 9–11 | Champion (12) | Guided build |
|---|---|---|---|---|---|---|---|
| Iron | Arms only: 1 for a key, regular, sub-boss or boss; a champion pair's differ | Elements ×0.5 | A sub-boss (acts 2, shield 16) + a key guard (shield 8) | 5, 7: 2 sub-bosses (shield 16); 6, 8: a boss (acts 2, shield 16) + a sub-boss-faced guard (shield 12) | Waves 1–2: a sub-boss-faced foe (shield 12); wave 3: a boss (acts 2, shield 16) + a sub-boss-faced guard (shield 12) | 2 bosses from two packs (shield 16) | Brawler, Brawler (Bow, Katana, Axe), Arms Spellblade, Arms Summoner, Paladin |
| Arcane | Elements only: 2 for a key or regular, 1 for a sub-boss or boss; a champion pair's differ | Arms ×0.5 | A sub-boss (acts 2, shield 16) + a key guard (shield 8) | 5, 7: 2 sub-bosses (shield 16); 6, 8: a boss (acts 2, shield 16) + a sub-boss-faced guard (shield 12) | Waves 1–2: a sub-boss-faced foe (shield 12); wave 3: a boss (acts 2, shield 16) + a sub-boss-faced guard (shield 12) | 2 bosses from two packs (shield 16) | Sorcerer, Sorcerer (Light Tome, Dark Tome, Fire Tome), Tome Spellblade, Tome Summoner, Cleric |
| Duel | Twin sets (2 at stages 1–6, 1 at stages 7–12); locks mixed | — | A boss (acts 2, shield 13) | A boss (acts 2, shield 14) | A boss (acts 2, shield 15) | A boss (acts 3, shield 15) | Arms Spellblade, Arms Spellblade (Bow, Greatsword, Fire Tome), Tome Spellblade, Tome Spellblade (Dark Tome, Blizzard Tome, Axe), Paladin |
| Horde | One twin set each; a wave repeats none until all five are used | — | Waves 1–2: a sub-boss-faced leader (shield 6) + 3 key foes (shield 3); wave 3: a boss-faced leader (shield 6) + 3 key foes (shield 3) | Waves 1–2: a sub-boss-faced leader (shield 6) + 4 key foes (shield 3); wave 3: a boss-faced leader (shield 6) + 4 key foes (shield 3) | Waves 1–2: a sub-boss-faced leader (shield 6) + 5 key foes (shield 3); wave 3: a boss-faced leader (shield 6) + 5 key foes (shield 3) | Waves 1–2: a sub-boss-faced leader (shield 6) + 5 key foes (shield 3); wave 3: 2 boss-faced leaders from two packs (shield 6) + 4 key foes (shield 3) | Arms Summoner, Arms Summoner (Lance, Greatsword, Thunder Tome), Tome Summoner, Tome Summoner (Fire Tome, Thunder Tome, Katana), Cleric |

Front and Convergence foes stand at tier Lv 50. Strength multiplies HP, ATK and M.ATK: stage n ×(1 + 0.1 × (n − 1) ÷ 11), ×1.1 at the champion; a Convergence fight is its front's champion at ×0.99. An Echo is its front's stage 8 at tier Lv 45 or 50 (×1); Lv 55 is the Lv 50 one at ×1.22. Sub-bosses and bosses take the party's reachable skill depth, regular foes the world's regular-foe HP step; every Horde foe is regular rank. Rift foes hit harder than the world's: offense ×1.8 at stages 1–4, ×2 for stages 5 and 7's sub-bosses, ×1.3 for a boss and her guard, ×1.2 for an opening foe, ×2.2 for a champion, ×2.3 on the Duel (her HP ×1.3) and ×4.4 on the Horde. Iron's foes have ×0.88 HP and ×1.6 offense, Arcane's ×1.6 HP and ×1.2 offense. Champions, and so the Convergence's fights, scale again by front: Iron ×1.13 HP and ×1.08 offense, Arcane ×1.01 HP and ×0.94 offense, Duel ×1 HP and offense, Horde ×1.25 HP and offense. A run's 52 fights hold 46 boss, 64 sub-boss and 165 key face slots.
<!-- /live -->

Iron and Arcane share one shape and each scales it (`riftTuning`'s `scale`, engine v19's `RIFT_TUNING_V19`): Iron ×0.88
HP and ×1.6 offense (×1 HP before v19), Arcane ×1.6 HP and ×1.2 offense. The line above names Arcane's scale alone, so
Arcane's foes have about 1.8 times Iron's HP and hit about three quarters as hard, not harder.

**Levels.** The level a Rift fight shows is a tier level: 50 for the fronts and the Convergence, and 45, 50 or 55 for an
Echo. Its foes' own levels are lifetime (Tier 2's Lv 50 is 100). A tier stops at Lv 50, so the Lv 55 Echo is the Lv 50
one made stronger.

**The Convergence and the Echoes.** Convergence fight i is front i's champion (Iron, Arcane, Duel, Horde), stronger
again, with its own faces and weaknesses. An Echo is its front's stage 8 at its level; Echoes don't belong to a run.

**Faces** come from all three packs, one allocation per run (`rift/picker.ts`):
- Azur Lane, NIKKE and PriConne take about 40 / 37 / 23 of each face tier's slots, by a smooth round-robin;
- faces the account hadn't defeated when the run started come first (`account.defeated`, Rift fights only, D171);
- no face repeats in a run while unused ones of its tier remain, and never within a fight;
- a champion pair's two bosses come from two packs;
- an Echo's faces are its own and never move as the Bestiary fills.

## Rewards

A win pays every entrant, including those knocked out: EXP, Laurels, Class Rank EXP, Bond EXP for Heroes and Learners
([Halls of Heroes](heroes.md)), and Uma Shards at milestone levels. A loss or giving up pays nothing and leaves MP as it
was before the fight. Numbers are in [loops](loops.md#laurels-and-exp).

## Constants

The table lists older engines' constants too, for replays. Every row plays today except those marked "before v12" or
"v12–v14", `BATTLE_BARRIER_PERCENT` (summons' Barriers, to v14), `RPG_BASE_MP_REGEN` (v16's 0.9%, which
`RPG_BASE_MP_REGEN_V17` replaces) and `HERO_LIMIT_SUPPORT_SHARE` (the 24's support, v15–v18). Three rows read wider from
engine v19: `BATTLE_FAREWELL_FACTOR` is a Summoner's lead summon's farewell (the Arms Summoner's Arms one),
`RPG_PIERCE_SCALE` serves both Spellblades, the Brawler's Katana B and the Sorcerer's Light B, and the Flourish works as
any class of her calling's family.

Engine v19's own numbers: the volley's `RPG_VOLLEY` (the tapped foe 0.8, the splash 0.35) and `RPG_VOLLEY_MP` (+2);
Tier 0's `RPG_TIER0_POWER` (1.60 → 2.31, the draft × `RPG_TIER0_POWER_FACTOR` 1.05), `RPG_TIER0_MP` (10),
`RPG_TIER0_MAX_RANK` (10) and `RPG_TIER0_BANK` (23,680) ([classes](classes.md#tier-0-and-promotion)); the Limit Break
scales `HERO_LIMIT_SCALE` and `HERO_LIMIT_MAX_HITS` (10) ([above](#limit-breaks)).

<!-- live:battle-constants -->
| Constant | Value | Meaning |
|---|---|---|
| `BATTLE_WEAK` | 1.3 | Damage multiplier of a weak hit |
| `BATTLE_UNBROKEN_FACTOR` | 0.5 | Damage a foe takes while its shield stands |
| `BATTLE_WARD_FACTOR` | 0.5 | v14: damage a Rift foe takes from the channel she wards, on top of the unbroken halving |
| `BATTLE_DEFENSE_SHARE` | 0.5 | Before v12: share of defense subtracted from offense |
| `BATTLE_MIN_OFFENSE_SHARE` | 0.2 | Before v12: a hit keeps at least this share of offense |
| `BATTLE_GUARD_FACTOR` | 0.5 | Damage a guarding ally takes for the one she covers |
| `BATTLE_BREAK_ROUNDS` | 2 | Rounds a Break lasts (the foe loses its actions) |
| `BATTLE_MAX_ROUNDS` | 40 | Round cap per wave; past it the fight is lost |
| `BATTLE_STATUS_TURNS` | 2 | Default rounds a status lasts |
| `BATTLE_STATUS_STACK_CAP` | 3 | Stacks a status can reach |
| `BATTLE_STATUS_STEP` | 0.1 | Per stack: Cleric statuses, Mark, Shock |
| `BATTLE_FOE_STATUS_STEP` | 0.15 | Per stack: foes' Weaken, Slow, Power-up, Ward |
| `BATTLE_BURN_PERCENT` | 0.04 | Max HP lost per Burn stack at the end of a round |
| `BATTLE_CLARITY_PERCENT` | 0.04 | Max MP restored per Clarity stack |
| `BATTLE_BARRIER_PERCENT` | 0.08 | Barrier per stack of a summon's rider, as a share of max HP |
| `BATTLE_BARRIER_CAP` | 0.3 | Before v12: Barrier cap, as a share of max HP |
| `BATTLE_COVER_CAP` | 0.4 | v12–v14: a skill Barrier's cap, as a share of max HP; it lasts the round |
| `BATTLE_COVER_CAP_V15` | 0.6 | v15: the same cap, for one healer's doubled Barriers |
| `RPG_SUPPORT_SHARE` | 0.14, 0.16, 0.18, 0.2, 0.22 | v12–v14: a mend's or Barrier's share of the target's max HP, by depth |
| `RPG_SUPPORT_SHARE_V15` | 0.28, 0.32, 0.36, 0.4, 0.44 | v15: the same shares for the Paladin and the Cleric, doubled (one healer a party) |
| `RPG_SUPPORT_ALL` | 0.4 | v12: that share on every Uma, at depth 5, for summons (to v14) and Limit Breaks (v15) |
| `BATTLE_HEAL_SCALE` | 300 | v12–v14: her Heal raises mends and Barriers ×(1 + Heal ÷ this) |
| `BATTLE_HEAL_OFFENSE_SCALE` | 300 | v15: mends, Barriers and revives ×(1 + offense ÷ this): a Paladin's ATK, a Cleric's M.ATK, anyone else's higher |
| `BATTLE_REVIVE_SHARE` | 0.25 | v12: a revive's share of max HP, before her healing scale |
| `RPG_PALADIN_SHIELD_SHARE` | 0.5 | v15: a Paladin's Blizzard spell also Barriers every Uma at this share of its share (×0.4 on every Uma) |
| `RPG_PALADIN_AEGIS` | 1 | v15: Aegis stacks a Paladin's Greatsword blow gives each Uma her Barrier reaches |
| `BATTLE_REGEN_SHARE` | 0.2 | v15: a Cleric's Regen mends this share of her Light spell's mend |
| `BATTLE_REGEN_ROUNDS` | 2 | v15: the round ends a Regen mends at: the spell's round and the next |
| `BATTLE_FAREWELL_FACTOR` | 0.1 | v15: a lingering summon's farewell strike on each foe (from v19 her lead half's: the Tome Summoner's Tome, the Arms Summoner's Arms), × its linger share × its hits' power |
| `HERO_LIMIT_SUPPORT_SHARE` | 0.66 | v15: a hall Limit Break's mend or Barrier, as a share of max HP, ×0.4 on every Uma |
| `BATTLE_RALLY_SHARE` | 0.3 | v12: share of a foe hit she can Rally back |
| `BATTLE_BREATHER` | 0.1 | v12: share of max HP every Uma recovers when a new wave enters |
| `BATTLE_LIMIT_MAX` | 12 | Limit Break gauge |
| `RPG_SKILL_RANK_FACTOR` | 0.95, 0.975, 1, 1.025, 1.05 | v16: a skill's power at Skill Ranks 1–5, a rank every 2 Class Ranks from its depth's gate; a healer's mend and Barrier shares too |
| `RPG_PIERCE_SCALE` | 1.15 | v16: a Pierce hit's power (from v19 the Spellblades' B lines, the Brawler's Katana B, the Sorcerer's Light B); it ignores the unbroken halving |
| `RPG_VOLLEY` | 0.8 + 0.35 | v19: a Bow or Dark volley's share of the depth's power on the tapped foe, then one plain splash hit on every other foe |
| `RPG_VOLLEY_MP` | 2 | v19: a volley's extra MP |
| `HERO_LIMIT_MAX_HITS` | 10 | v19: the most hits a Limit Break lands on one foe in one cast |
| `RPG_BASE_MP_REGEN` | 0.009 | v16: every Uma regains this share of her max MP at each round's end for each skill depth her Class Rank opens, at least 1, beside a Spring's |
| `RPG_BASE_MP_REGEN_DEPTHS` | 5 | v16: the depths the base MP regen counts, at most (4.5% from Class Rank 40) |
| `BATTLE_FLOURISH_SHARE` | 0.04 | v16: her Flourish gives this share of her max HP a fight, while she fights as her calling's class (from v19 any class of her Tier 0's family) |
| `BATTLE_FLOURISH_RATE` | Even pace 0.01, Late reserve 0.02 | v16: the share of her max HP those two Flourishes mend at a round's end |
| `BATTLE_FLOURISH_FROM` | 3 | v16: the first round whose end Late reserve mends at |
| `RPG_BASE_MP_REGEN_V17` | 0.01 | v17: the base MP regen a depth (5% from Class Rank 40) |
| `BELL_PERMILLE_PER_GRADE` | 100 | v17–v20: a Bell's follow-up, per mille of an Attack a grade, × her hand; only fights already open, D264 |
| `INSIGNIA_SLOT_PERMILLE` | 10 | an Insignia slot's extra damage on sub-bosses and bosses, per mille a grade (D264) |
| Signature | 0.1 a level × tier | v17: her ATK and M.ATK while she wears her knack's family |
<!-- /live -->
