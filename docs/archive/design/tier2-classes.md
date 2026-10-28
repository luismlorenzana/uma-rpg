# Tier 2's advanced classes

> **Proposal, 2026-10-21, for the owner to decide; not built.**
> - One of five Tier 2 docs that follow [tiers](tiers.md) Option A (D159): this one (H39),
>   [weapon arts and armor sets](weapon-arts.md) (H40), [Extra Stats in Tier 2](extra-stats-tier2.md) (H41),
>   [the second profession](second-profession.md) (H42) and [Tier 2's world and its Rift](tier2-world.md) (H43).
> - It builds on [classes v2](classes-v2.md) (D160: six classes, engine v15, save v25) and [the Rift](../../design/rift.md) §4
>   (Ascend).
> - **Owner calls** are marked **A1**, **A2** and so on, each with a recommendation. [§11](#11-owner-calls) lists them
>   all.
> - Numbers are drafts for the simulation.

## 1. What the owner asked for

- **Tiers §1:** "Depth that grows by tier, not a different battle system per tier", with "class trees grow the way Fire
  Emblem's classes do".
- **Tiers §6, Option A** (approved, D159, T6), Tier 2's column:
  - **Classes:** "each base class branches into two advanced classes, chosen at promotion: twelve in all, each with one
    passive".
  - **Skill trees:** "the side forks (A/B) open, with side points. The advanced class's passive applies".
  - **Equipped skills:** "3, and +1 a Lv 5 step (10 at most, today's)".
  - **Limit Breaks:** "the same halls, plus Hero LB+ at Bond 10: the Limit Break gains its seat's extra effect".
- **Tiers §5:** "she picks her Tier 2 advanced class during the promotion", which [the Rift](../../design/rift.md) §4 calls Ascend.
- **T8** gave illustrative pairs and asked for a short design of each once T6 was approved:

  | Base | Advanced (T8's example) | Lean |
  |---|---|---|
  | Brawler | Warlord · Berserker | Break specialist · Axe area damage |
  | Mage | Sage · Sorcerer | Element ring combos · raw single target |
  | Spell Blade | Duelist · Rune Knight | Multi-hit physical · a larger magic share |
  | Summoner | Conjurer · Warlock | Area summons · Dark and Light curses |
  | Paladin | Templar · Guardian | Barrier-heavy · damage-taking guard |
  | Cleric | Bishop · Oracle | Party mends · buffs and cleanse |

**The Persona lesson.** uma-racer's weakness → One More → All-Out loops (its D261) were boring and were removed a day
later (D265); Octopath shields and Breaks have held up since. So a passive adds a tool to the toolbox. It never adds a
loop.

## 2. Today

### 2.1 The six classes, as classes v2 approves them

Engine v15, not built yet.

| Class | Slots | Armor | Hand: an act | Split (phys / mag) | Leans: HP, ATK, M.ATK, DEF, M.DEF, MP | Limit Break | Starts as |
|---|---|---|---|---|---|---|---|
| Brawler | 5 Arms | Physical | ×1 power, ×1 MP | 100 / 0 | 1.15, 1.1, 0.9, 1.1, 0.9, 0.8 | 2× | Front runners |
| Mage | 5 Tomes | Magical | ×1, ×1 | 0 / 100 | 0.9, 0.9, 1.15, 0.9, 1.1, 1.3 | 2.4× | Pace chasers |
| Spell Blade | 3 Arms + 2 Tomes | Physical | A pair: an Arms half ×0.68, landing as two hits, and a Tome half ×0.32 (H60); ×0.5 MP a half | 70 / 30 | 1, 1.1, 0.95, 1, 1, 1 | 2.2× | Never |
| Summoner | 3 Tomes + 2 Arms | Magical | A pair: a Tome summon ×0.58 that lingers (its farewell strike reaches every foe at ×0.3, ×0.4 Bonded, × 0.85) and an Arms summon ×0.32 (H60); ×0.5 MP a half | 30 / 70 | 1, 0.95, 1.1, 1, 1, 1.1 | 2.2× | End closers |
| Paladin | 3 Arms + 2 Tomes | Physical | ×0.5, ×0.6. Heals and shields from ATK | Half-hand damage | 1, 1, 0.8, 1.15, 1, 1.3 (assumed) | 1.5× | Late surgers whose Power beats their Wit |
| Cleric | 3 Tomes + 2 Arms | Magical | ×0.5, ×0.6. Heals and shields from M.ATK | Half-hand damage | 1, 0.8, 1, 1, 1.15, 1.3 | 1.5× | Other late surgers |

- **Heal retires** (C1): Guts feeds HP, and mends and Barriers scale with the healer's ATK or M.ATK.
- **One healer a party** (C8): every mend and Barrier share doubles (28–44% by depth, ×0.4 on every Uma), and a
  Barrier holds up to 60% of max HP.
- **The Paladin's leans** aren't set in classes v2. This doc assumes the Cleric's, mirrored, and follows v15's numbers
  once they're built.

### 2.2 The trees

- **One tree per class and weapon.** Brawler and Mage have 5; the four others have all 10, and the five weapons in her
  slots decide which are usable. After v15 that's **50 trees** (the Paladin adds 10).
- **Five depths,** each a **core** skill and two **sides,** A and B (a fork):
  - cores are free and open at Class Rank 1, 10, 20, 30 and 40;
  - sides open at Class Rank 5, 15, 25, 35 and 45 (`10d − 5`), and cost their depth in points;
  - **side points:** one a Class Rank, per class. Filling every fork of five trees costs 75, so a Rank 50 class fills
    two thirds;
  - swapping a side is free, and the points come back.
- **Node ids** are `<class>-<weapon>.<depth>[a|b]` (`node-identity.ts`). A learned node is a ref `{ tier, id }`, and
  `battleSkillFor` multiplies a skill's MP by `ref.tier`: a Tier 2 skill costs twice the MP.
- **Equipped slots:** 3 at Lv 1, and one more at Lv 10, 15, 20, 25, 30, 35 and 40 (10).
- **Unused:** `legacy` refs and `RPG_MAX_LEGACY_SLOTS = 2`, left from H23's skills carried from an earlier tier, which
  were never built.

### 2.3 Tier 1 after T7

- **Cores only:** five depths, one skill each, opened by Class Rank. No side forks and no side points.
- **Slots:** 3, then one more at Lv 10, 20, 30 and 40 (7).
- Umas who already have sides keep them until they promote.

### 2.4 The halls

- **Six halls × four seats = 24 Limit Breaks** after v15: the Brawler Dojo, Mage Tower, Spell Blade Salle, Summoner
  Circle, Cleric Chapel and Paladin Bastion.
- A Hero uses her seat's Limit Break at 100%. A Learner uses either Hero's at 50%, +5% a Bond Level (100% at Bond 10).
- A Hero earns Bond with her own seat (D112).
- The power is that of the class she fights as.
- Bonds reset on promotion, and a new tier's halls start empty (T4).

### 2.5 Built and approved

| | Engine | Save | Classes |
|---|---|---|---|
| **Built** | v14 (H44: the Rift's ward, a third act, mixed locks) | v23 (H37: achievements, tier history, the Rift's slot) | Five: Brawler, Mage, Spell Blade, Cleric, Summoner |
| **Approved, not built** | v15 ([classes v2](classes-v2.md)) | v25 | Six |
| **This doc** | v16 | The first after v25 | Twelve, in Tier 2 |

## 3. Rules every advanced class keeps

**Already decided** (not reopened here):
- **Classes:** in a Tier 2 world the classes are the twelve advanced classes. The base classes belong to Tier 1 (tiers
  §6).
- **Trees:** an advanced class uses its base class's trees, with the same node ids, learned as Tier 2 refs. There are no
  new trees. The A/B sides are Tier 2's new skills (tiers §6, "What it costs").
- **Halls:** the six halls of classes v2 stay, with 24 seats. Heroes and Learners work as they do now.
- **Promotion:** nothing carries from Tier 1 beyond [tiers](tiers.md) §5 (D159). Every class starts at Class Rank 1, and
  no skill carries.
- **Battle rules:** a weak hit chips one shield point. Breaks and Steel stay, and so do one act per Uma, intents, and
  charged moves with locks.

**A passive may change numbers, targets, hit counts or statuses.** It never:
- grants an extra act or a "one more";
- refunds the Limit gauge;
- lengthens a Break or skips Steel;
- removes more than one extra shield point from a foe in an act (a passive that reaches several foes may take one
  from each);
- adds a damage kind (weakness coverage stays a party puzzle, D160 §6.2);
- gives a Summoner-line class party support (D160): nothing she does mends, shields or buffs an Uma.

**Auto plays every passive.** Each class's rule is in §5. They live in `auto.ts`'s `score`, in `supportScore`, and in
the engine's `battleSupportValue`.

**On screen, a passive is one short sentence** (D95), on the class picker and her profile.

**Hero LB+ follows the same rules** (§7).

**Shared with H40.** [Weapon arts](weapon-arts.md) isn't on `main` as this is written. This doc assumes:
- one engine version, v16, for both docs;
- the new extra chips, from passives here and weapon arts there, share one cap: one extra shield point from a foe in an
  act, whatever the source. Today's Breaker charge and Shatter stay as they are;
- raises to the same number add. Where a weapon art and a passive both raise a hit count or a share, they add.

## 4. Promotion: base to advanced

### 4.1 The twelve

| Base | Advanced | Lean | Best front (draft) |
|---|---|---|---|
| Brawler | **Warlord** | Pays off after a Break | Duel |
| | **Berserker** | Axe areas that still hit hard | Iron |
| Mage | **Sage** | Element rotation | Arcane |
| | **Sorcerer** | Raw single target | Duel |
| Spell Blade | **Blademaster** (T8's Duelist, A4) | Chips shields | Iron |
| | **Rune Knight** | Her Tome half seeks weaknesses | Horde |
| Summoner | **Conjurer** | Bigger farewell areas | Horde |
| | **Warlock** | Curses that open foes to magic | Arcane |
| Paladin | **Templar** | Party Barriers | Horde |
| | **Guardian** | Guards as she strikes | Duel |
| Cleric | **Bishop** | Party mends | Horde |
| | **Oracle** | Longer buffs | Duel |

Each class's best front comes from its passive. The base's home front stays good for both of a pair: Iron for the
Brawler, Spell Blade and Paladin lines, and Arcane for the Mage, Summoner and Cleric lines.

### 4.2 The Ascend pick (A6)

When a won run ascends ([the Rift](../../design/rift.md) §4, [tiers](tiers.md) §5), each of the twenty is offered **the two
advanced classes of the class she fights as.** One is preselected by a stat rule per pair, like D160's
Paladin-or-Cleric start. Each rule follows the stat that feeds the lean the class raises (§5):

| She fights as | Preselected | Otherwise |
|---|---|---|
| Brawler | **Warlord** if her Speed ≥ her Stamina | Berserker |
| Mage | **Sage** if her Wit ≥ her Speed | Sorcerer |
| Spell Blade | **Blademaster** if her Power ≥ her Wit | Rune Knight |
| Summoner | **Conjurer** if her Power ≥ her Wit | Warlock |
| Paladin | **Templar** if her Speed ≥ her Stamina | Guardian |
| Cleric | **Bishop** if her Speed ≥ her Wit | Oracle |

Stats are her outfit's, as D160's start rule reads them; a tie goes to the first named.

**The Ascend sheet** lists the twenty, each with her two choices and one already picked. A tap swaps a pick. One
confirm ascends all twenty, so the owner can ascend with a single tap and change only the picks they care about.

**A6:** recommendation: **the two advanced classes of the class she fights as, one preselected by the stat rule above;
one confirm for all twenty.** With A1, a pick is only where she starts, so it needn't be agonised over.

### 4.3 Switching in Tier 2 (A1)

**A1:** recommendation: **free among all twelve,** as in Tier 1:
- each class keeps its own Class Rank, weapons, sides and loadout;
- switching costs nothing, and a new class starts at Class Rank 1;
- Tier 2's Echoes ([the Rift](../../design/rift.md) §8) are where a Lv 50 Uma raises a new class.

The Rift asks for different parties on different fronts, and a locked class would make that a roster problem instead
of a choice.

**Alternatives:**
- **Only the two of her Ascend base:** keeps her "line" but blocks a Mage from becoming a Templar. The Tier 2 Rift's
  shapes would then depend on which classes ascended.
- **Locked to her pick:** the Fire Emblem rule, but a wrong pick could never be undone.

### 4.4 What she arrives with

- **Her pick as her class,** at Class Rank 1 (every other class too), so depth 1's five cores.
- **Her class's default weapon spread** (its base's, `rpgDefaultWeapons`), all Training weapons.
- **Her class's armor kind** ([classes v2](classes-v2.md) §7) in all five slots, as Training pieces. No accessories.
- **The auto loadout:** three depth-1 cores at Lv 1.
- **Class Marks:** her banked EXP becomes the new world's Class Marks (T3), two Manuals at most: about Class Rank 10
  for one class.
- **No Limit Break** until she takes a seat or a Hero in the new world's halls (T4).

In a Tier 2 world `OwnedUma.classId` is never null: every Tier 2 Uma arrives by Ascend with a class picked. The
running-style start (`rpgDefaultClass`) stays Tier 1's.

### 4.5 Room for Tier 3

Each advanced class later grows into one master class (tiers §6). This doc leaves room and designs nothing:
- the class table (§8) takes a `tier: 3` row naming its `base` (for trees) and the advanced class it comes `from`;
- the passive is frozen apart from the class id (§8), so a master can keep hers and add a mechanic;
- Tier 3's depth 6 widens the node grammar's depth to 1–6, with the same ids for depths 1–5.

## 5. The twelve classes

**Every advanced class keeps its base's slots, armor kind, hand and damage split (A2).** That's what D160's mirrors and
the Rift's four party shapes rest on.

**Its leans move by 0.05 (or 0.1) from one stat to another.** The sum stays the base's, so the class budget doesn't
move. The hybrids' ATK and M.ATK leans don't move, so 70/30 holds.

**Limit Break power is the base's** (A8).

**Values.** "Where it applies" and "elsewhere" are the targets of §10: +8–15% of her class's value where the passive
applies, and no more than +5% elsewhere.

### 5.1 Brawler: Warlord · Berserker

**Tension: the Warlord and the Spell Blade line.** D160 made the Spell Blade line the physical shield breaker, so the
Warlord doesn't break shields. She pays off **after** the Break, and the Blademaster (§5.3) chips.

| | **Warlord** | **Berserker** |
|---|---|---|
| Lean | The Break's payoff | Axe areas that still hit hard |
| **Passive** | **Broken sub-bosses and bosses take +20% from her hits** | **Her Axe skills strike the foe she taps at full power;** the others still take the area share (0.55) |
| On screen | "Hits a Broken boss 20% harder." | "Her Axe hits her target at full power." |
| Where it applies | A Broken sub-boss or boss: a Brawler deals most of her damage in Break windows, so about +11% there | Three foes or more: each Axe cast gains 0.45 of a skill, a quarter more on a formation of three. About +12% of her damage there |
| Elsewhere | Regular foes, and standing shields: 0 | One foe: her Axe matches her Greatsword, so 0–5% |
| Leans (HP, ATK, M.ATK, DEF, M.DEF, MP) | 1.15, **1.15**, 0.9, **1.05**, 0.9, 0.8 | **1.2**, 1.1, 0.9, 1.1, **0.85**, 0.8 |
| Hand · Limit Break | ×1 · 2× | ×1 · 2× |
| Best front | **Duel:** one boss, often Broken | **Iron:** sub-bosses with escorts |
| Auto | `score` ×1.2 on a Broken sub-boss or boss. Auto already prefers Broken foes | `score` counts her Axe skill at full on the tapped foe and 0.55 on each other |

**The Horde stays the Horde party's.** The Berserker's gain is a fixed +0.45 a cast, so it shrinks as the field grows.
Her Axe also chips only Axe-weak foes, while a Horde foe is weak to its own Arm and element. So two Berserkers can't
replace the Horde party's Spell Blade-line pair (a target in §10).

### 5.2 Mage: Sage · Sorcerer

| | **Sage** | **Sorcerer** |
|---|---|---|
| Lean | Element rotation | Raw single target |
| **Passive** | **A spell whose element differs from her last spell's deals +15%** | **A foe alone on the field takes +15% from her spells** |
| On screen | "A new element each cast: +15%." | "+15% on a lone foe." |
| Where it applies | Formations whose foes have different weaknesses: she rotates, and most casts gain, about +12% | One foe: the Duel, and each wave's last foe, +15% |
| Elsewhere | One foe with one weak element: she mostly repeats it, so about +5% | Formations: only each wave's last foe, about +3% |
| Leans | 0.9, 0.9, 1.15, **0.85**, 1.1, **1.35** | **0.85**, 0.9, **1.2**, 0.9, 1.1, 1.3 |
| Hand · Limit Break | ×1 · 2.4× | ×1 · 2.4× |
| Best front | **Arcane:** mixed formations | **Duel** |
| Auto | `score` ×1.15 for a spell whose element differs from her last one's (the engine keeps her last element on her unit) | `score` ×1.15 when one foe stands. No choice changes; it keeps Auto's numbers right |

**Why a rotation, not the ring.** A strict Fire → Ice → Lightning order would fight the weakness play every fight
needs. "Any other element than last time" keeps the combo feel with no table to learn.

### 5.3 Spell Blade: Blademaster · Rune Knight

**Tension: the Rune Knight and the owner's 70/30** (D160). Recommendation: **keep 70/30.** A larger magic share would
blur her into the Summoner. Her identity goes in her Tome half instead, at a power that keeps her split within ±5.

| | **Blademaster** | **Rune Knight** |
|---|---|---|
| Lean | Chips shields | Her Tome half seeks weaknesses |
| **Passive** | **When her Arms half lands weak on a shielded foe, it removes one more shield point** (once an act) | **Her Tome half also strikes every other foe weak to its element, at 15% of its power** |
| On screen | "A weak blade chips one more shield point." | "Her spell also strikes every foe weak to it." |
| Where it applies | Arms-weak foes: on Iron, where her Tome half is never weak, 2 chips an act become 3. The party already chips most shields in a round or two, so the measure is the earlier Break's damage: about +10% on Iron | Several foes sharing an element weakness: each is chipped, and takes 0.04 of a turn. About +10% on the Horde, mostly in earlier Breaks |
| Elsewhere | Foes weak to no Arm she wields: 0 | One foe, or Arms-only weaknesses: 0 |
| Leans | 1, 1.1, 0.95, **1.05**, **0.95**, 1 | 1, 1.1, 0.95, **0.95**, **1.05**, 1 |
| Hand · Limit Break | v15's pair · 2.2× | v15's pair · 2.2× |
| Best front | **Iron** | **Horde** |
| Auto | An Arms half that lands weak on a shielded foe scores as one more hit | Her Tome half's `score` adds 0.15 of its power for each other living foe weak to its element |

**Her split.** The splash adds about 0.04 of a turn of magic a foe it reaches. On a Horde wave that's 1–2 foes an act,
so she stays at 65–70% physical. The simulation checks 70/30 ± 5 (§10).

### 5.4 Summoner: Conjurer · Warlock

**Tension: the Conjurer and the Summoner's areas.** The Conjurer *is* a Summoner, so her bigger areas strengthen the
Horde party; they don't compete with it.

**Tension: the Warlock and "the Summoner has no support"** (D160). Her curse makes a foe take more damage. That's
allowed. Nothing she does mends, shields or buffs an Uma, and Enfeeble stays the Paladin's (D160 §4).

| | **Conjurer** | **Warlock** |
|---|---|---|
| Lean | Bigger farewell areas | Curses that open foes to magic |
| **Passive** | **Her farewell strikes deal +20%** (×0.36 on every foe, ×0.48 Bonded) | **Her Light and Dark summons put Mind Break 1 on the foe they strike as they arrive** (+10% magical damage taken, 2 rounds) |
| On screen | "Her summons' farewells hit 20% harder." | "Light and Dark summons curse: Mind Break 1." |
| Where it applies | Three foes or more: +10% at three foes, +12% at five | A focused foe, with magic hitting her: about +12% of her value, counting the curse's whole worth to the party as hers |
| Elsewhere | One foe: +5% | Physical parties, and fights with no focus: under +5% |
| Leans | 1, 0.95, 1.1, **1.05**, **0.95**, 1.1 | 1, 0.95, 1.1, **0.95**, **1.05**, 1.1 |
| Hand · Limit Break | v15's pair · 2.2× | v15's pair · 2.2× |
| Best front | **Horde** | **Arcane:** a sub-boss with escorts, all-magic party |
| Auto | Nothing new to choose: every summon brings its farewell | A Light or Dark summon on a foe without Mind Break gets the status premium (+0.5) a Cleric's skill gets |

**The curse stays small.** It's one stack on one foe, and it doesn't stack past 1 from her. If the simulation finds it
over +15% on the Arcane front, it cuts the curse to one round.

**The mirrors** (classes v2 §3.2): each line has a home-front specialist and a Horde specialist, and they mirror
across the lines:
- **Blademaster ↔ Warlock:** the Iron and Arcane specialists;
- **Rune Knight ↔ Conjurer:** the Horde specialists.

Their leans mirror too: each moves 0.05 between DEF and M.DEF, the other way round from its mirror.

### 5.5 Paladin: Templar · Guardian

**Tension: the Guardian's guard.** Auto guards only as a fallback today, and a Guard spends her whole act. So the
Guardian doesn't need a Guard action. **She guards as part of her Arms blows,** and Auto already plays her blows.

| | **Templar** | **Guardian** |
|---|---|---|
| Lean | Party Barriers | Guards as she strikes |
| **Passive** | **Her Barriers on every Uma are 25% larger** (×0.5 of her single share, from ×0.4; her Blizzard spells ×0.44, from ×0.35) | **Her Arms blows also guard the Uma most threatened** until the round ends: single-target hits on that Uma land on the Guardian at half. The blow's Barrier goes on her instead |
| On screen | "Her party Barriers are 25% larger." | "Her blows guard the Uma most in danger." |
| Where it applies | Damage spread over the party: about +12% of her sustain on the Horde | A heavy single-target hitter: the Duel's boss acts two or three times, and the guard halves every hit aimed at the guarded Uma. About +12% |
| Elsewhere | One target hit at a time: under +5% | Area moves aren't guarded (they never are), so where most damage is area: under +5% |
| Leans | **0.95**, **1.05**, 0.8, 1.15, 1, 1.3 | **1.1**, 1, 0.8, 1.15, 1, **1.2** |
| Hand · Limit Break | ×0.5 · 1.5× | ×0.5 · 1.5× |
| Best front | **Horde,** and Iron as the Paladin's home | **Duel** |
| Auto | `battleSupportValue` reads her larger share, so she picks party Barriers when several Umas are threatened | Her blow's support value: half the single-target damage shown on the Uma it guards, plus the Barrier on herself |

**Not an extra act.** The blow is her act. The guard only changes where its Barrier lands: on her, while she takes the
guarded Uma's hits. When she is the most threatened herself, the blow just Barriers her. The guard lapses at the
round's end, as a Guard does.

### 5.6 Cleric: Bishop · Oracle

| | **Bishop** | **Oracle** |
|---|---|---|
| Lean | Party mends | Longer buffs |
| **Passive** | **Her mends on every Uma are 25% larger** (×0.5 of her single share, from ×0.4; Regen's repeats too) | **Her buffs on every Uma last 3 rounds, from 2** (Brave, Faith, Aegis, Breaker) |
| On screen | "Her party mends are 25% larger." | "Her buffs last a round longer." |
| Where it applies | Damage spread over the party: about +12% of her sustain on the Horde | Long fights against one boss: buffs stay up while she mends, about +12% on the Duel |
| Elsewhere | Under +5% | Short fights: under +5% |
| Leans | **0.95**, 0.8, **1.05**, 1, 1.15, 1.3 | **0.9**, 0.8, 1, 1, 1.15, **1.4** |
| Hand · Limit Break | ×0.5 · 1.5× | ×0.5 · 1.5× |
| Best front | **Horde,** and Arcane as the Cleric's home | **Duel** |
| Auto | `battleSupportValue` reads her larger share | Her buff spells' status premium is ×1.5, and she renews a buff only when it has a round left or none |

**The mirrors:** Templar ↔ Bishop (the same +25%, party Barriers and party mends) and Guardian ↔ Oracle (the Duel
specialists). Classes v2's ±10% on sustain applies to each mirror.

### 5.7 Names (A4)

Checked against every skill and summon name in `catalog.ts`, the Limit Breaks, the statuses, the foe roles, the halls
and the Rift's words:

| Clash | Where | Recommendation |
|---|---|---|
| **Berserker** (the class) | The Axe summon at depth 2 | Rename the summon **Marauder** (and its sides "Marauder Pack", "Bonded Marauder") |
| **Warlord** (the class) | The Axe summon at depth 5, "Jotun Warlord" | Rename the summon **Jotun King** |
| **Duelist** (T8) | The Rift's **Duel** front: she would serve Iron and the Horde, never the Duel | Rename the class **Blademaster** |
| **Paladin** (the v15 class), found by the same check | The Greatsword summon at depth 3 | Rename the summon **Knight Captain**, in the classes v2 build |

**Why rename summons, not classes.** The class names are the owner's (T8) and show on every screen. A summon is one
string in `SUMMONS`, and v15 already reworks those lines.

**Near misses kept:**
- **Rune Knight** and the Spell Blade's depth-1 "Rune" skills (Rune Cleave …): they're her own trees, so the echo
  helps.
- **Guardian** and the Guard action and foe role: her passive is a guard.
- **Sage** and Sagittarius.

**A4:** recommendation: **T8's names, with Duelist → Blademaster and the three summons renamed.**

### 5.8 The twelve at a glance (A5)

| Class | Base | Passive (on screen) | Best front | Limit Break |
|---|---|---|---|---|
| Warlord | Brawler | Hits a Broken boss 20% harder | Duel | 2× |
| Berserker | Brawler | Her Axe hits her target at full power | Iron | 2× |
| Sage | Mage | A new element each cast: +15% | Arcane | 2.4× |
| Sorcerer | Mage | +15% on a lone foe | Duel | 2.4× |
| Blademaster | Spell Blade | A weak blade chips one more shield point | Iron | 2.2× |
| Rune Knight | Spell Blade | Her spell also strikes every foe weak to it | Horde | 2.2× |
| Conjurer | Summoner | Her summons' farewells hit 20% harder | Horde | 2.2× |
| Warlock | Summoner | Light and Dark summons curse: Mind Break 1 | Arcane | 2.2× |
| Templar | Paladin | Her party Barriers are 25% larger | Horde | 1.5× |
| Guardian | Paladin | Her blows guard the Uma most in danger | Duel | 1.5× |
| Bishop | Cleric | Her party mends are 25% larger | Horde | 1.5× |
| Oracle | Cleric | Her buffs last a round longer | Duel | 1.5× |

**The class budgets,** written down as class-rework §11 does: each is its base's, plus its passive where it applies.

| Class | Budget a turn (Brawler's Attack = 1.0) |
|---|---|
| Warlord · Berserker | 1.0, ×1.2 on a Broken boss · 1.0, the tapped foe at 1.0 inside an Axe area |
| Sage · Sorcerer | 1.0, ×1.15 on a new element · 1.0, ×1.15 on a lone foe |
| Blademaster · Rune Knight | 0.9 (0.63 + 0.27), +1 chip on a weak Arms half · 0.9, +0.04 on each other foe weak to her Tome |
| Conjurer · Warlock | 0.9 and a farewell ×0.36 on every foe · 0.9 and a farewell ×0.3, plus Mind Break 1 |
| Templar · Guardian | 0.5 and support, party Barriers ×1.25 · 0.5 and support, a guard on her blows |
| Bishop · Oracle | 0.5 and support, party mends ×1.25 · 0.5 and support, buffs for 3 rounds |

**A5:** recommendation: **the twelve passives above, approved as one set.** The simulation tunes each number inside
§10's bands; it may not change what a passive does.

**A2:** recommendation: **leans within ±0.1 of the base's,** moved from one stat to another so the budget stays the
base's. Slots, armor kind and the hand split stay the base's, because D160's mirrors and the Rift's four party shapes
depend on them.

## 6. Skill trees in Tier 2

### 6.1 The side forks (A3)

**A3:** recommendation: **today's rules for every class:**
- sides open at Class Rank 5, 15, 25, 35 and 45;
- a side costs its depth;
- one point comes with each Class Rank (50 at Rank 50);
- one side of each fork, and swaps are free;
- no per-class side lists: an advanced class learns any side of its base's trees.

So both classes of a line share their base's side nodes, and each spends its own points: a Warlord and a Berserker can
build the same Brawler trees differently.

The rules are in the code today. Tier 1 turns them off (T7, not built yet), and Tier 2 keeps them on.

### 6.2 Equipped slots

As tiers §6 says, **today's rule:** 3 at Lv 1, and one more at Lv 10, 15, 20, 25, 30, 35 and 40, for 10. Tier 1's
gates become Lv 10, 20, 30 and 40 (7). `rpgActiveSlots` takes the tier.

### 6.3 Skill MP (A10)

**The target** (§10): on a full MP bar, an on-curve Tier 2 Lv 50 Uma casts within one skill of a Tier 1 Lv 50 Uma.

**Her MP bar grows ×1.7, not ×2.** For the reference Uma (`rpgReferenceStat`):
- Wit is 100 at Tier 1 Lv 50 and 179 at Tier 2 Lv 50;
- so her bar (20 + 1.5 × Wit, before her lean) goes from 170 to 289, ×1.70;
- the simulation's Uma (Wit growth 0) gives ×1.69.

**Today's ×tier fails the target.** Casts of a depth-5 skill on a full bar:

| Line | MP lean | An act's MP at depth 5 | Tier 1 Lv 50 | Tier 2, ×2 (today) | Tier 2, ×1.7 |
|---|---|---|---|---|---|
| Brawler | 0.8 | 26 | 5.2 | 4.4 (−0.8) | 5.3 |
| Mage | 1.3 | 26 | 8.5 | 7.2 (**−1.3**) | 8.5 |
| Spell Blade | 1 | 26 (13 a half) | 6.5 | 5.6 (−1.0) | 6.6 |
| Summoner | 1.1 | 26 (13 a half) | 7.2 | 6.1 (**−1.1**) | 7.2 |
| Paladin, Cleric | 1.3 | 16 | 13.8 | 11.8 (**−2.0**) | 13.9 |

**Dropping it** gives Tier 2 Umas about 70% more casts, which fails the other way.

**A10:** recommendation: **replace ×tier with the bar's own growth,** `1 + 0.7 × (tier − 1)`: ×1, ×1.7 and ×2.4 for
Tiers 1–3. Tier 3's bar grows ×2.4 by the same reckoning. The simulation sets the factor from the on-curve bar, flat
MP from Extra Stats and armor included. It ships in engine v16, and v6–v15 fights keep ×tier.

## 7. Limit Breaks

### 7.1 Hero LB+ (A7)

**What it is:** at Bond 10, a seat's Limit Break gains its **extra effect** (§7.2). It's one effect a seat, worth
+15–25% of that Limit Break, under §3's rules: it never refunds the gauge, adds no damage kind, and removes at most one
extra shield point from a foe.

**Who gets it.** Anyone at **Bond 10** with the seat:
- **a Hero,** with her own seat (the Bond she earns there, D112);
- **a Learner,** with that Hero's seat. At Bond 10 she already uses it at 100%, and LB+ adds the effect.

**Where:** Tier 2 and later worlds only. Bonds reset on promotion (T4), so a Tier 2 Uma earns her Bond 10 again, about
50 wins with one seat.

**A7:** recommendation: **anyone at Bond 10 with the seat: the Hero with her own seat, or a Learner with her Hero.
Tier 2 and later only, with the 24 effects of §7.2 as drafts.**

### 7.2 The 24 extra effects

The halls are classes v2's six (§5 there). "New" marks a seat classes v2 adds; its name comes with the v15 build.

| Hall | Seat | Limit Break (v15) | LB+ | Worth (draft) |
|---|---|---|---|---|
| Brawler Dojo | 1 | Arsenal Rush: a blow with every Arm, one foe | A sixth blow, at the same share, with the first Arm the foe is weak to | +20% |
| | 2 | Iaido Cleave: a Greatsword cleave, then two Katana draws | A third Katana draw | +25% |
| | 3 | Spear and Arrow Storm: eight Lance and Bow blows at random foes | Armor Break 1 on every foe it hits | ≈ +20% (the party's physical hits, 2 rounds) |
| | 4 | Earthsplitter: three Axe quakes on every foe | Its quakes reach each foe at 0.66 of their power, from 0.55 | +20% |
| Mage Tower | 1 | Elemental Cascade: a spell of every element, one foe | A sixth spell, at the same share, of the first element the foe is weak to | +20% |
| | 2 | Twilight Eclipse: one Light-and-Dark hit | Mind Break 1 on the foe before it lands | ≈ +20% (its hit, and the party's magic for 2 rounds) |
| | 3 | Trinity Storm: Fire, Ice and Lightning on one foe | A fourth spell at 0.2 of its power, of the first of its elements the foe is weak to (else Fire) | +20% |
| | 4 | Chaos Rain: twelve Light and Dark bolts at random foes | Mind Break 1 on every foe it hits | ≈ +20% |
| Spell Blade Salle | 1 | Sunfire Edge: three Greatsword-and-Fire cleaves, the last splashing | A fourth cleave | +23% |
| | 2 | Rimefang Waltz: six Katana-and-Ice cuts | A seventh cut | +17% |
| | 3 | Thunder Javelin: four Lance-and-Lightning throws at random foes | A fifth throw | +25% |
| | 4 | Eclipse Volley: a Bow-and-Light and a Bow-and-Dark volley on every foe | A third volley, of Bow, at half a volley's power | +25% |
| Summoner Circle | 1 | Cinder Wyrm: a Greatsword-and-Fire bite, then Fire breath on every foe | Its breath reaches each foe at 0.7 of its power, from 0.55 | +15–20% |
| | 2 | Frost Behemoth: two Axe-and-Ice stomps on every foe | Its stomps reach each foe at 0.66 of their power, from 0.55 | +20% |
| | 3 | Thunderbird: six Lance and Lightning dives at random foes | A seventh dive | +17% |
| | 4 | Moon Fox: eight strikes at random foes (v15) | A ninth strike, at twice a strike's share | +25% |
| Cleric Chapel | 1 | Choir of Angels: Light on every foe twice, then Aegis 2 on every Uma | Aegis 3, from 2 | ≈ +20% |
| | 2 | Legion of Demons: Hex on every foe, then eight Dark claws | Its claws drain: 30% of their damage heals the most hurt Uma | ≈ +20% |
| | 3 (new) | A Fire-and-Light mend on every Uma, with a Fire hit on every foe | Its mend repeats once at the round's end, at ×0.3 (Regen) | ≈ +20% |
| | 4 (new) | An Ice cleanse with a Barrier on every Uma | Its Barrier is 25% larger (to the 60% cap) | ≈ +20% |
| Paladin Bastion | 1 | Archangel's Verdict: a Greatsword-and-Light judgment, then Brave and Faith 2 on every Uma | Brave and Faith 3, from 2 | ≈ +25% |
| | 2 | Archdemon's Pact: Armor Break and Mind Break 3, then three Katana-and-Dark rends | A fourth rend | ≈ +20% |
| | 3 (new) | A Greatsword charge that Barriers every Uma | Armor Break 2 on the foe it charges | ≈ +20% |
| | 4 | Valkyrie Lances: four Lance hits at random foes, then revive the first fallen | A fifth Lance hit | ≈ +15% |

**The patterns:** one more hit of a kind it already deals; Armor Break or Mind Break, so a channel hits harder; a
wider area share; or, in the healer halls, a larger support. Each is one line under the seat in the hall, and Auto
needs no new rule: it fires the Limit Break as today, and the effect comes with it.

### 7.3 Limit Break power (A8)

**A8:** recommendation: **an advanced class's Limit Break power is its base's** (D160): Brawler line 2×, Mage line
2.4×, Spell Blade and Summoner lines 2.2×, Paladin and Cleric lines 1.5×. The passives and LB+ carry Tier 2's growth.
A second change to the same number would make the halls hard to read.

## 8. The build

**Code** (`packages/domain/src/rpg/`):
- **One class table** carrying `base` and `tier` for each id, and `rpgBaseClass(id)`:
  - the six base ids (v15) are `tier: 1`, their own base;
  - the twelve advanced ids are `tier: 2`: `warlord`, `berserker`, `sage`, `sorcerer`, `blademaster`, `runeknight`,
    `conjurer`, `warlock`, `templar`, `guardian`, `bishop`, `oracle`;
  - `kinds.ts` splits `RpgBaseClass` from `RpgClass`. `RpgTreeId`, `HeroLimitId` and `HERO_HALLS` stay on the base
    classes.
- **The per-class tables get the advanced classes:**
  - leans (`RPG_CLASS_STATS`): their own rows (§5);
  - slots, hand, default weapons, armor kind and Limit Break power (`RPG_CLASS_SLOTS`, `rpgHand`,
    `rpgDefaultWeapons`, `HERO_LIMIT_POWER`): the base's, through `rpgBaseClass`.
- **Node ids don't change.** `rpgClassWeapons`, `rpgClassTrees` and `rpgLearnBlock` read the base's trees. A Tier 2
  Warlord learns `brawler-greatsword.3a` as `{ tier: 2, id: 'brawler-greatsword.3a' }`.
- **Tier rules:** side forks and their points by tier (Tier 1 cores only, T7), and `rpgActiveSlots(tier, level)`.
- **LB+:** each `HeroLimit` gains its `plus` effect, and `heroLimitSkills` takes it.

**Engine v16**, the first after v15, shared with [weapon arts](weapon-arts.md) (H40):
- `BattleAlly.classId` may be an advanced id. It is validated by tier: base ids in Tier 1, advanced ids in Tier 2.
- **Frozen into `BattleAlly`:**
  - `passive`: her class's passive id. It's frozen apart from the class, so a Tier 3 master can carry one;
  - `heroBond`: a Hero's Bond with her own seat, for LB+. A Learner's is already in `inherits[].bond`.
- LB+ applies when the ally's tier is 2 or more and the Bond is 10.
- **New state:** the Sage's last element on her unit. The Guardian's guard uses `guardingFor`, which lapses at the
  round's end.
- **Skill MP:** the tier factor of A10.
- The passives live in `strike`, `chip`, `cast`, `resolveHalf`, `linger` and `support`, and Auto's rules in `auto.ts`
  (§5). Fights from v6–v15 replay on their own engines.

**Save:** the first version after v25, shared with the other Tier 2 docs when Tier 2 content is built:
- **class ids are per world.** A Tier 1 world accepts the six base ids, a Tier 2 world the twelve advanced ids, in
  `classId`, `classes` and `ranks.classes`;
- **validation goes by tier:** a loadout's weapons by its base's slots, its sides by its base's trees, as Tier 2 refs;
  `classId` is required in a Tier 2 world;
- Bonds and seats don't change: their keys are the base halls' seats;
- **no migration:** no Tier 2 world exists before the first Ascend.

**Screens** (`apps/web/src/`):
- **The class picker** (`places/stable/SkillsPage.tsx`): in a Tier 2 world, twelve classes in six pairs by line, each
  with its emblem and name. The picked class's passive line sits under the grid. Tier 1 keeps its six.
- **The Ascend sheet** (the Rift's page): the twenty, each with her two choices and one preselected; one confirm (§4.2).
- **The profile** (`places/stable/OutfitProfile.tsx`): her class chip, and the passive line on the Skills tab.
- **The halls** (`places/halls/HallPage.tsx`): in Tier 2 and later worlds, each seat shows its "LB+ at Bond 10" line,
  and a Hero or Learner at Bond 10 shows "LB+". The fight's Limit Break menu and cut-in name it "Arsenal Rush+".

**Art:** twelve class emblems, the `class/<id>` frames `ClassEmblem` draws (`battle/pixel-icons.tsx`):
- a uma-art request through uma-platform, a ChatGPT packet;
- until it ships, the base class's emblem stands in.

Nothing here changes what uma-kit draws. If a screen needs a kit change, it goes through the
[change protocol](../../change-protocol.md).

**Docs** (`docs/game/`), when built:
- `classes.md`: the twelve, their passives, the Ascend pick, sides and slots by tier;
- `skill-trees.md`: the tier note;
- `heroes.md`: LB+ and the 24 effects;
- `combat.md`: the passives, the Guardian's guard and skill MP;
- `loops.md` § Ranks: ranks per tier;
- `sections.md`: the class picker and the Ascend sheet;
- then `pnpm docs:update` for the live blocks.

**Legacy refs (A9):**
- **retire** `RpgProfile.legacy`, `RPG_MAX_LEGACY_SLOTS` and their branches in `rpgLearnedSkills` and
  `rpgUsableLoadout`;
- `BattleAlly.legacy` stays readable for v6–v15 fights (it was always empty) and leaves v16's input.

**A9:** recommendation: **no Tier 1 skill carries (D159). Retire the unused `legacy` refs in this build.**

## 9. Content size

| Piece | Count | Where | Size |
|---|---|---|---|
| Class entries: ids, base, tier, names, leans | 12 | `kinds.ts`, `rules.ts` | S |
| Passives: engine rules and Auto's scoring | 12 | `battle/engine.ts`, `battle/auto.ts` | M |
| LB+ effects: data and the plus step | 24 | `heroes.ts`, `battle/limit.ts` | M |
| Side nodes reused: 50 trees × 5 depths × A and B, after v15. Opened by tier; none new | 500 | `rules.ts` | S |
| New skills | 0: no passive needs one | — | — |
| Renames: three summons (§5.7) | 3 | `catalog.ts` | S |
| Class emblems: a ChatGPT uma-art packet | 12 | uma-platform | S–M |
| Engine v16: class ids by tier, the frozen passive and Hero Bond, skill MP | — | `rpg/battle/` | M |
| Save: class ids per world, validation by tier, the Ascend pick | — | `save/` (and `save/rift.ts`) | S–M |
| Screens: the class picker, the Ascend sheet, the profile, the halls' LB+ line, the Limit Break menu | 5 | `apps/web/src/` | M |
| The simulation: Tier 2 parties, passives on the four fronts, LB+ | — | `world/balance-party.ts`, `world/balance.test.ts` | M |
| The manual | 6 pages | `docs/game/` | S |

## 10. Balance targets

Drafts for the simulation (`SIM=1`).

**What they assume:** on-curve Tier 2 Umas (Class Rank equal to her level, gear of her level's grade, full Extra
Stats with [H41](extra-stats-tier2.md)'s ring, [H40](weapon-arts.md)'s weapon arts) against Tier 2's foes as
[H43](tier2-world.md) budgets them.

**Flag:** `rpgFoeBudget` runs on lifetime level, so today's Tier 2 foes assume a full Tier 1 Lv 50 build. An ascended
Uma arrives with Training gear, an empty map and Class Rank 1 ([tiers](tiers.md) §5). That gap is H43's, not this
doc's.

| Target | Value |
|---|---|
| A passive, where it applies | Worth +8–15% of her class's value there: damage per turn, chips per act, or sustain per fight. A chip passive is measured by the earlier Break's damage, and a curse counts its whole worth to the party |
| A passive, elsewhere | No more than +5% |
| The class budget | Each advanced class's damage budget is written down (§5.8), as class-rework §11 does for the base classes |
| The two of a pair | Each is the better pick of its pair on at least one of the four fronts, on Auto (§4.1's best fronts) |
| Mirrors (classes v2 §9) | Spell Blade line vs Summoner line damage per turn within ±5%, at 70/30 ± 5: Blademaster on Iron vs Warlock on Arcane, Rune Knight vs Conjurer on the Horde. Paladin line vs Cleric line sustain within ±10%: Templar vs Bishop, Guardian vs Oracle |
| One healer (classes v2 C8) | Each healer-line class keeps an on-curve party through a front boss, with no Uma falling twice |
| LB+ | Worth +15–25% of its Limit Break, and never refunds the gauge |
| Tier 2 MP | On a full MP bar, an on-curve Tier 2 Lv 50 Uma casts within one skill of a Tier 1 Lv 50 Uma (§6.3) |
| Tier 2 campaign | On-curve win rates within 3 points of Tier 1's table (combat balance §0) at matched levels. The toolbox's power is priced into Tier 2's build budget |
| **The Horde stays the Horde party's** (this doc) | The Horde party (2 Spell Blade line, 2 Summoner line, a healer) beats the same party with two Berserkers for its Spell Blade-line pair by at least 10 points of win rate |
| **Blademaster vs Warlord** (this doc), against shielded sub-bosses | The Blademaster Breaks one at least 1 round sooner; the Warlord deals at least 15% more after the Break |
| **The Rune Knight's split** (this doc) | 70/30 ± 5 against regular formations and the Horde |

## 11. Owner calls

| Call | Question | Recommendation |
|---|---|---|
| **A1** | Switching classes in Tier 2 | Free among all twelve, each with its own Class Rank, weapons and sides, as in Tier 1. (Alternatives: only the two of her Ascend base, or locked to her pick) |
| **A2** | What an advanced class changes besides its passive | Stat leans within ±0.1 of its base's, moved from one stat to another. Slots, armor kind and the hand split stay, because D160's mirrors and the Rift's four party shapes depend on them |
| **A3** | Side forks in Tier 2 | Today's rules for every class: sides open at Class Rank 5, 15 … 45, a side costs its depth, a point comes with each rank, swaps are free. No per-class side lists |
| **A4** | The twelve names | T8's names, with Duelist → **Blademaster** (the Rift's Duel front), and three summons renamed: Berserker → Marauder, Jotun Warlord → Jotun King, and Paladin → Knight Captain (with classes v2) |
| **A5** | The twelve passives | §5's set, approved as one call; the simulation tunes the numbers, not what they do |
| **A6** | The Ascend pick | The two advanced classes of the class she fights as, one preselected by §4.2's stat rule; one confirm for all twenty |
| **A7** | Who gets Hero LB+ | Anyone at Bond 10 with the seat: the Hero with her own seat, or a Learner with her Hero. Tier 2 and later only, with §7.2's 24 effects as drafts |
| **A8** | Limit Break power of an advanced class | Its base class's (D160) |
| **A9** | Tier 1 skills in Tier 2 | None carry (D159). Retire the unused `legacy` refs when building |
| **A10** | Skill MP in Tier 2 | Replace ×tier with the MP bar's growth, `1 + 0.7 × (tier − 1)`: ×1.7 in Tier 2 and ×2.4 in Tier 3, set by the simulation. Engine v16 |
