# Classes v2: six classes, clear damage identities, accessories that specialize

> **Proposal, 2026-10-21, for the owner to decide.**
> - The second of three linked docs, with [tiers](tiers.md) and [the Rift](rift.md).
> - It's a combat change: a new engine version (v14), checked with the balance simulation before it ships. Fights from
>   v6–v13 replay as they were.
> - **Owner calls** are marked **C1**, **C2** and so on, with recommendations. [§10](#10-owner-calls) lists them all.
> - **Every number is a draft** until the simulation sets it.

## 1. What the owner asked for

| Class | The owner's direction |
|---|---|
| **Brawler** | Unchanged |
| **Mage** | Unchanged |
| **Spell Blade** | Mostly unchanged, but a damage class: **70% of her damage physical, 30% magical**. Full physical armor, a little **multi-hit** identity. 3 physical + 2 magical weapons |
| **Summoner** | **No support.** The inverse of the Spell Blade: **70% magical, 30% physical**. Full magical armor, a little **AoE** identity. 3 magical + 2 physical weapons |
| **Cleric** | The awkward fifth wheel today: physical, magical or a hybrid, and the hybrid is awkward. Take on the healing and shielding the Summoner drops. Perhaps **split it into a Paladin**, whose heals and shields come from ATK, **and a Cleric**, whose come from M.ATK. Otherwise the same, with equipment mirroring the Spell Blade and the Summoner |

**Also asked for:**
- rebalance the Limit Breaks and how Learners inherit them;
- rework the Orbs into **percentage damage to one kind** (2% steps), so an Uma can specialize;
- rethink the accessories for balance and for a meaningful choice;
- Mage and Summoner start in magic armor;
- equipment presets per class.

## 2. Today

| Class | Weapons | Armor | Damage | Support | Limit Break power |
|---|---|---|---|---|---|
| Brawler | 5 Arms (fixed) | Per Uma, physical by default | 100% physical | — | 2× |
| Mage | 5 Tomes (fixed) | Per Uma, physical by default | 100% magical | — | 2.4× |
| Spell Blade | 3 Arms + 2 Tomes | Per Uma | Every act is an Arms half and a Tome half, ×0.45 each: about **50/50** | — | 2× |
| Cleric | Any 5 | Per Uma | ×0.5 hand, one foe | Arms blows: a debuff and a Barrier. Tome spells: a buff, a mend and a cleanse. Rebirth | 1.5× |
| Summoner | 3 Tomes + 2 Arms | Per Uma | ×0.6 hand; a summon lingers and strikes again at ×0.3 | By line: Light mends, Blizzard Barriers, Dark drains, Greatsword Aegis, Axe Enfeeble, Lance revives | 1.8× |

**Notes on today's rules:**
- **Heals and Barriers** are a share of the target's max HP by depth (14–22%), × (1 + Heal ÷ 300). Heal comes from
  Guts × the class's heal lean. They use neither ATK nor M.ATK.
- **Armor** is per Uma: each of five slots physical or magical. A new Uma starts all-physical, whatever her class.
- **Orbs** add their kind to every hit, for weakness and lock checks only, with no damage of their own.
- **Who has area attacks today:** Brawler (Axe), Mage (Blizzard and some sides), and Summoner (Blizzard and Axe
  summons). Spell Blade and Cleric have none: their Axe and Blizzard skills hit one foe.

## 3. The six classes

| Class | Weapons | Armor | Damage | Identity | Support |
|---|---|---|---|---|---|
| **Brawler** | 5 Arms | Physical | 100 / 0 | Heavy single hits, Axe for areas | — |
| **Mage** | 5 Tomes | **Magical** | 0 / 100 | Elements, Blizzard for areas | — |
| **Spell Blade** | 3 Arms + 2 Tomes | Physical | **70 / 30** | **Multi-hit: a shield breaker** | — |
| **Summoner** | 3 Tomes + 2 Arms | **Magical** | **30 / 70** | **Areas: farewell strikes on every foe** | **None** |
| **Paladin** (new) | 3 Arms + 2 Tomes | Physical | Half-hand damage | Barriers and guarding | Heals and shields **from ATK** |
| **Cleric** | 3 Tomes + 2 Arms | **Magical** | Half-hand damage | Mends, cleanse and revive | Heals and shields **from M.ATK** |

Damage is shown as physical / magical, in percent.

**The mirrors the owner asked for:**
- Spell Blade ↔ Summoner: physical-led and magic-led damage hybrids;
- Paladin ↔ Cleric: physical-led and magic-led healers, on the same gear spreads as the damage hybrids;
- Brawler and Mage stay the pure ends.

**These fit the Rift's four party shapes** ([the Rift](rift.md) §5):

| Front | Party |
|---|---|
| Iron (physical weaknesses only) | 2 Brawler, 2 Spell Blade, Paladin |
| Arcane (magic weaknesses only) | 2 Mage, 2 Summoner, Cleric |
| Duel (one foe, mixed weaknesses) | 2 Brawler, 2 Mage, a healer |
| Horde (many foes, mixed weaknesses) | 2 Spell Blade, 2 Summoner, a healer |

### 3.1 Spell Blade: 70/30 and multi-hit

**The act stays a pair, reweighted:**
- the **Arms half** goes from ×0.45 to **×0.63**;
- the **Tome half** goes from ×0.45 to **×0.27**;
- 0.9 a turn in all, the same as today.

**Multi-hit: her Arms half lands as two hits,** each half its power.
- The total doesn't change, but each weak hit chips a shield point, so a Spell Blade chips **three points an act**:
  two Arms hits and one Tome hit.
- That makes her the physical front's shield breaker, the multi-hit identity the owner wanted.
- Her own skills already target one foe; they keep that.

**Stat leans:**
- ATK ×1.05 → **×1.1**, and M.ATK ×1.05 → **×0.95**.
- Her full physical armor adds ATK, not M.ATK, so the split leans further physical. The simulation tunes the two
  hands until a full fight on Auto lands at 70/30 ± 5.

**Her Limit Breaks** (the Spell Blade Salle) become multi-hit too: §5.

### 3.2 Summoner: no support, 70/30 magic, areas

**Every support effect leaves her summon lines:**
- Light's mend and its regen;
- Blizzard's Barrier;
- Dark's drain;
- Greatsword's Aegis;
- Axe's Enfeeble;
- Lance's revive.

They move to the Paladin and the Cleric (§4.3).

**Every line now strikes.** Each summon's arrival hit keeps its weapon's shape: Fire one foe, Blizzard every foe, and
so on.

**The area identity:** a lingering summon's **farewell strike reaches every foe**, at its linger share (×0.3, or ×0.4
when Bonded), the same per foe as today's single target. Every summon after the first therefore touches the whole field.

**Hand:** the power hand goes from ×0.6 to **×0.7**. With no support, her turns are all damage.

**The split:**
- three Tome slots, magic armor (M.ATK up), and Arms summons from a lower ATK;
- stat leans: M.ATK ×1.1, ATK ×0.9;
- the target is 70/30 ± 5 on Auto.

### 3.3 Paladin and Cleric

They're the same class in two halves:
- **the same kit** as today's Cleric;
- different **slots, armor and scaling stat**;
- each takes half of the Summoner's old support.

**The kit, unchanged from today's Cleric:**
- **Arms blows:** a debuff on the foe hit, and a Barrier on the Uma the shown moves threaten most.
- **Tome spells:** a buff on every Uma, a mend on the most hurt, and a cleanse.
- **At depth 5** the Barrier and the mend reach every Uma.
- **Hand:** ×0.5 power, ×0.6 MP.

**Their spreads differ:**
- the **Paladin**, with **3 Arms**, gives more Barriers and debuffs;
- the **Cleric**, with **3 Tomes**, gives more mends, buffs and cleanses.

The split itself makes one a shielder and the other a healer.

**Scaling.** Heal, from Guts, retires from combat. Every mend, Barrier and revive is
`target's max HP × depth share × (1 + offense ÷ 300)`, where offense is the **Paladin's ATK** or the **Cleric's M.ATK**
(base, Extra Stats and armor; not weapon Might). An on-curve Lv 50 healer is about ×1.6, close to today's Heal-based
multiplier. The simulation sets the divisor.

**C1, where does Guts go?** It has no other combat use today. Recommendation: **into HP**,
`HP = 100 + 5 × Stamina + 2 × Power + 1 × Guts`. Outfits with high Guts get a little sturdier, and no stat is dead.

**Starting class.** A new Uma who would start as a Cleric today (her best style, Late surgers) starts as a **Paladin if
her Power beats her Wit**, else as a Cleric.

## 4. What the healers take over from the Summoner

| Summoner line (today) | Moves to | As |
|---|---|---|
| Blizzard: a Barrier on every Uma (×0.35) | **Paladin** | Her Blizzard Tome spells raise a Barrier on every Uma at that share, alongside their mend |
| Greatsword: Aegis on every Uma | **Paladin** | Her Greatsword blows give Aegis 1 to the Uma they Barrier (2 at depth 5) |
| Axe: Enfeeble every foe hit | **Paladin** | Her Axe blows Enfeeble **every** foe from depth 4. A Cleric's Axe stays one foe |
| Lance: Valkyries revive (depth 4–5) | **Paladin** | Her Lance tree's depth-4 side B becomes "Valkyrie's Oath": a revive at 25%, once per Uma per fight |
| Light: mends every Uma, and again each round while it lingers | **Cleric** | Her Light spells leave **Regen**: the mend repeats at ×0.3 at the round's end, for two rounds |
| Dark: drain, 30% of damage heals the most hurt | **Cleric** | Her Dark spells drain at 30% |

Rebirth stays the Cleric's. Each healer now has one revive.

## 5. Limit Breaks and inheritance

**A sixth hall:**
- the Paladin gets a Hall of Heroes, the **Paladin Bastion** (C2: the name);
- six halls × 4 seats = **24 Limit Breaks**.

**Re-homed and new:**

| Hall | Seats | Change |
|---|---|---|
| Brawler Dojo | Unchanged | — |
| Mage Tower | Unchanged | — |
| Spell Blade Salle | Multi-hit | Sunfire Edge becomes **three** Greatsword-and-Fire cleaves (its splash stays on the last). The others already hit several times |
| Summoner Circle | Areas | Moon Fox (8 hits on one foe) becomes 8 strikes on **random** foes. Cinder Wyrm and Frost Behemoth already reach every foe; Thunderbird stays random |
| Cleric Chapel | Tome-led | Keeps Choir of Angels and Legion of Demons. Seats 3–4 get two new Tome-led Limit Breaks: a Fire-and-Light mend on every Uma with a Fire hit on every foe; and an Ice cleanse with a Barrier on every Uma |
| **Paladin Bastion** | Arms-led | Takes Archangel's Verdict (Greatsword and Light) and Archdemon's Pact (Katana and Dark) from the Chapel. Two new seats: a Greatsword charge that Barriers every Uma; and Valkyrie Lances (four Lance hits at random foes, then revive the first fallen) |

**Moving seats.** The Chapel's seats 3 and 4 become the Bastion's seats 1 and 2. Their Heroes, Learners and Bonds move
with them, so nobody's progress is lost.

**Limit Break power at 100%:**

| Class | Power |
|---|---|
| Brawler | 2× |
| Mage | 2.4× |
| Spell Blade | 2× → **2.2×** |
| Summoner | 1.8× → **2×**, because her support is gone |
| Paladin | 1.5× |
| Cleric | 1.5× |

**Inheritance, which the code calls a Learner's parents:**
- **Today:** an inherited Limit Break hits with the offense of each hit's kind. A Mage who learns a Brawler's Arsenal
  Rush swings it with her low ATK, so most cross-class inheritance is weak, and the useful choice is "a parent of my
  own channel".
- **C3:** recommendation: **inherited hits use the higher of her ATK and M.ATK.** The kinds still decide weaknesses and
  locks. Inheritance then becomes about **weakness coverage**: a Mage can carry an Arms Limit Break to Break a
  physical-weak boss on the Iron front. That's the composition puzzle the Rift wants.
- **Strength:** 50% at Bond 0, +5% a level, 100% at Bond 10. It stays as it is: Bonds already pace well (two Heroes
  fully bonded by about Lv 23).

## 6. Accessories

### 6.1 Orbs: +% damage to one kind

- **New:** an Orb adds **+2% damage a grade** to hits of its kind: a G10 Fire Orb is +20% to Fire hits. It applies
  after the weakness multiplier and before statuses.
- **Gone:** an Orb no longer adds its kind to hits for weaknesses or locks.
- **Why:** weakness coverage then comes only from weapons, and from inherited Limit Breaks (C3). A party has to be
  *built* for a front, which is what the owner wants the Rift to ask.
- **Specializing:** two Orbs of two kinds, such as Fire and Lightning, make a two-element specialist. Two Orbs of the
  same kind stay disallowed: the slots already require different types.

**C4, Orb steps:** recommendation: **2% a grade**, the owner's suggestion, so +20% at G10. The simulation checks that a
G10 Orb is worth about a grade of weapon Might on that kind, and no more.

### 6.2 The other ten

The owner asked for twenty accessory types, and they stay twenty. What changes is their value and their role.

| Accessory | Today (per grade) | At G10 | Role after v2 | Change |
|---|---|---|---|---|
| Vital Talisman | 0.5% max HP regen a round | 5% | Sustain for tanks | 0.6% → 6% |
| Vampire Talisman | Lifesteal 2% of physical damage | 20% | Brawler and Spell Blade sustain | — |
| Bulwark Talisman | A physical shield, 2% max HP | 20% | Opening shield | — |
| Iron Talisman | A physical damage cut, 1.5% | 15% | Iron front | — |
| Thorn Talisman | Physical damage returned, 3% | 30% | Paladin, guarding | Also returns guarded hits |
| Spring Amulet | +1 MP a round | 10 | Caster sustain | — |
| Siphon Amulet | MP from magical damage, 0.5% | 5% | Mage and Summoner sustain | 0.8% → 8% (too weak today) |
| Veil Amulet | A magical shield, 2% max HP | 20% | Opening shield | — |
| Ward Amulet | A magical damage cut, 1.5% | 15% | Arcane front | — |
| Mirror Amulet | Magical damage returned, 3% | 30% | Cleric, Arcane front | — |

**The rule the simulation enforces:** in each family (offense Orbs, physical defense, magical defense), no accessory
at G10 is worth less than 60% of the best one, measured as each one's effect on a front's win rate on Auto. The values
in the table are the starting point.

**C5, accessory slots:** recommendation: **two in Tier 1**, as now. [Tiers](tiers.md) Option A adds a third in Tier 3.

## 7. Quality of life

- **Starting armor by class:** a new Uma's five armor slots start in her class's armor. Magical for Mage, Summoner and
  Cleric, physical for the rest. Existing Umas keep theirs. This needs nothing else and can ship now.
- **Equipment presets.** Each class gets a **standard preset**: its default weapon spread, its armor kind in all five
  slots, and two suggested accessory types. On her profile, "Use the standard preset" applies the weapons and armor
  kinds she can wear, plus the best crafted pieces in stock she's ranked for.
  - **C6:** recommendation: **one standard preset per class, applied on tap.** Custom saved presets can come later if
    the owner wants them.
  - It ships now for five classes and grows to six with v2.
- **"Can upgrade" highlights.** A badge on the Stable tile and the profile when an Uma:
  - has unspent side points;
  - can wear a better weapon, armor piece or accessory in stock;
  - has an Extra Stats gem she can set, or a free active node.

  This is independent of v2 and can ship now.

## 8. Engine v14 and the save

- **Engine v14** carries the new hands, the Spell Blade's double Arms hit, the Summoner's farewell areas, the
  healers' scaling and new effects, Orbs as % damage, and Guts into HP (C1).
- **Old fights replay:** v6–v13 fights, including an open one at migration, replay on their own engine.
- **Save (v24, after the tiers doc's v23):**
  - the class id `cleric` stays the Cleric, and `paladin` is new;
  - **every Uma's Cleric progress is copied to the Paladin:** the same Class Rank, the same trees learned, a loadout
    re-picked from her Arms skills. Nobody loses progress;
  - a Cleric's weapon slots move from "any five" to 3 Tomes + 2 Arms, keeping the ones she had where they fit and
    filling the rest from the defaults; the Paladin's are set the other way round;
  - Summoner loadouts are unchanged, since the same skills now only strike;
  - the Chapel's seats 3–4 become the Bastion's seats 1–2, with their Heroes, Learners and Bonds.
- **Docs:** the manual's classes, combat, heroes and skill trees pages, and the live blocks.

## 9. Balance targets (the simulation, `SIM=1`)

| Target | Value |
|---|---|
| Spell Blade's damage, on Auto, against regular formations | 70% physical ± 5 |
| Summoner's damage, on Auto | 70% magical ± 5 |
| Paladin vs Cleric: healing plus Barrier absorbed per fight, on curve | Within ±10% of each other |
| Spell Blade vs Brawler, against shielded single foes | Spell Blade Breaks a sub-boss at least 1 round sooner; Brawler deals ≥ 10% more after the Break |
| Summoner vs Mage's Blizzard, against 3+ foes | Summoner ≥ Mage over a whole wave, by the farewell strikes |
| Today's campaign, on-curve party of each shape | Win rates within 3 points of v13 (no campaign rebalance) |
| The Rift's fronts | Set in [the Rift](rift.md) §11 |

## 10. Owner calls

| Call | Question | Recommendation |
|---|---|---|
| **C1** | Where Guts goes once Heal retires | Into HP: +1 HP a point |
| **C2** | The Paladin's hall name | The Paladin Bastion |
| **C3** | Inherited Limit Breaks' offense | The higher of her ATK and M.ATK; kinds still decide weaknesses |
| **C4** | Orb steps | 2% a grade, +20% at G10 |
| **C5** | Accessory slots | Two in Tier 1; a third in Tier 3 |
| **C6** | Presets | One standard preset per class, applied on tap |
| **C7** | Split the Cleric into Paladin and Cleric | **Yes**: it solves the hybrid problem, mirrors the damage hybrids, and gives the Rift's physical and magical fronts each a healer |
