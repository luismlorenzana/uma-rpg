# Classes v2: six classes, clear damage identities, accessories that specialize

> **Approved 2026-10-21 (D160), with three owner changes; not built yet.** The changes:
> - the Summoner is the Spell Blade's mirror (§3.2);
> - the one healer in a party heals and shields at twice today's shares (§3.3);
> - accessories are one damage slot and one support slot, with flat Orbs (§6).
>
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

**Multi-hit: her Arms half gains one extra hit** (clarified 2026-10-21 after H40's review).
- The extra hit is added to the half as a whole, not to each of its hits. Its power is split evenly across all of
  them, so the total doesn't change:
  - **an Attack** (one hit) lands as two, each half its power;
  - **a skill of n hits** lands as n + 1;
  - a Bow skill's 6 hits at depth 5 become 7, not 12.
- **Each weak hit chips a shield point.** With an Attack, a Spell Blade chips **three points an act**: two Arms hits
  and one Tome hit.
- That makes her the physical front's shield breaker, the multi-hit identity the owner wanted.
- Her own skills already target one foe; they keep that.
- **The guard rail, for every class:**
  - no single Uma should Break a Duel boss (shield 10–12) in one act;
  - the v14 simulation checks every class's best single act, with weapon arts and passives under their shared cap, the
    Summoner's first ([weapon arts](weapon-arts.md) §6);
  - if one reaches the shield, the Duel shield rises, not the class's identity.

**Stat leans:**
- ATK ×1.05 → **×1.1**, and M.ATK ×1.05 → **×0.95**.
- Her full physical armor adds ATK, not M.ATK, so the split leans further physical. The simulation tunes the two
  hands until a full fight on Auto lands at 70/30 ± 5.

**Her Limit Breaks** (the Spell Blade Salle) become multi-hit too: §5.

### 3.2 Summoner: the Spell Blade's mirror (owner, 2026-10-21)

The Summoner is the Spell Blade turned inside out: same turn, same numbers, the other channel leading, and the area
identity where the Spell Blade has multi-hit. They balance as a pair.

| | Spell Blade | Summoner |
|---|---|---|
| Slots | 3 Arms + 2 Tomes | 3 Tomes + 2 Arms |
| Armor | Physical | Magical |
| An act | A pair: **Arms half ×0.63** + **Tome half ×0.27** | A pair: **Tome summon ×0.63** + **Arms summon ×0.27** |
| MP | The halves' sum, ×0.5 a half | The same |
| Split | 70% physical / 30% magical | 70% magical / 30% physical |
| Stat leans | ATK ×1.1, M.ATK ×0.95 | M.ATK ×1.1, ATK ×0.95 |
| Identity | **Multi-hit:** her Arms half gains one extra hit (an Attack lands as two: 3 shield chips an act) | **Areas:** her Tome summon **lingers**, and its farewell strike reaches **every foe** at ×0.3 (×0.4 Bonded) when her next pair comes |
| Limit Break power | 2.2× | 2.2× |
| Her hall's Limit Breaks | Multi-hit | Areas |
| Support | None | **None** |

**The Summoner loses all support.** Light's mend, Blizzard's Barrier, Dark's drain, Greatsword's Aegis, Axe's
Enfeeble and Lance's revive leave her lines, and move to the Paladin and the Cleric (§4). Every line now strikes. Its
summons keep their weapon's shape on arrival.

**The farewell is one strike on each foe,** whatever the summon's hit count (clarified 2026-10-21 after H40's review).
A five-hit Light summon arrives with five hits on its target. Its farewell is one strike on each foe at the linger
share, not five.

**Only the Tome half lingers.** The Arms summon strikes once and leaves. The pair then mirrors the Spell Blade's
exactly:
- the leading half carries the identity;
- the trailing half is a plain hit of the other channel.

**Balance as a pair.**
- On a single shielded foe, the Spell Blade's three chips an act Break sooner.
- Against three or more foes, the Summoner's farewell strikes touch the whole field.
- **Over a whole fight, their damage per turn stays within ±5% of each other** (§9).

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

**One healer a party: twice the shares (owner, 2026-10-21).**
- Today a party could carry a Cleric *and* a Summoner sharing support. In v2 a party has **one** Paladin or Cleric,
  so her mends and Barriers carry the whole party.
- **Every mend and Barrier share doubles:**
  - one Uma: 28%, 32%, 36%, 40%, 44% by depth;
  - every Uma: still ×0.4 of that, so 11–18%.
- **The Barrier cap** rises from 40% to **60%** of max HP, so a doubled Barrier isn't wasted.
- **What stays the same:** revives (25%), the cleanse (one status), and her damage hand (×0.5).
- The simulation checks the doubled numbers against foe damage (§9): one healer must keep an on-curve party through a
  front's boss without an Uma falling more than once.

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
| Summoner | 1.8× → **2.2×**, the Spell Blade's mirror |
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

### 6.1 One damage slot, one support slot (owner, 2026-10-21)

The owner's aim: balance should make an Uma pick **one damage accessory and one support accessory**. The slots now say
so:

| Slot | Holds | Choices |
|---|---|---|
| **Damage** | One Orb | 5 Arms Orbs, 5 Elemental Orbs |
| **Support** | One Talisman or Amulet | 5 Talismans (physical), 5 Amulets (magical) |

All twenty types stay. Accessory Ranks stay four kinds: Arms Orb, Elemental Orb, Talisman, Amulet.

### 6.2 Orbs: flat damage to one kind

- **New: an Orb adds half its grade's weapon Might** to the offense of hits of its kind:

  | Grade | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
  |---|---|---|---|---|---|---|---|---|---|---|
  | Offense added | 1 | 2 | 4 | 6 | 10 | 13 | 18 | 23 | 29 | 34 |

  It's flat, like weapons. It goes through the same `offense² ÷ (offense + defense)` formula, so it's worth about **+18%
  on that kind's hits at Lv 50**, and less early.
- **Why flat, not a percentage:** it scales the way weapons do, by grade and level. It doesn't multiply with every other
  bonus, so the balance stays readable. A G10 Orb is worth about half a G10 weapon on its own kind.
- **Gone:** an Orb no longer adds its kind to hits for weaknesses or locks. Weakness coverage then comes only from
  weapons and inherited Limit Breaks (C3), so a party has to be *built* for a front.
- **One Orb only:** with one damage slot, an Uma specializes in **one** kind. That's the choice: her best weapon's
  kind, or the kind her front's foes are weak to.

### 6.3 The support accessories

They take the support slot. Their values are rebalanced so each is a real choice for some Uma.

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

**The rule the simulation enforces:** among the ten support accessories, none at G10 is worth less than 60% of the
best, measured as its effect on a front's win rate on Auto. The values in the table are the starting point.

**C5, slots by tier:** one damage and one support in Tiers 1 and 2. [Tiers](tiers.md) Option A adds a third slot in
Tier 3; it's designed with Tier 3.

## 7. Quality of life

- **Starting armor by class:** a new Uma's five armor slots start in her class's armor. Magical for Mage, Summoner and
  Cleric, physical for the rest. Existing Umas keep theirs. This needs nothing else and can ship now.
- **Equipment presets.** Each class gets a **standard preset**: its default weapon spread, its armor kind in all five
  slots, and a suggested Orb and support accessory. On her profile, "Use the standard preset" applies the weapons and armor
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

- **Engine v14** carries:
  - the new hands: the Spell Blade's double Arms hit, and the Summoner's mirrored pair and farewell areas;
  - the healers' ATK and M.ATK scaling, their doubled shares and the 60% Barrier cap, and their new effects;
  - flat Orbs in a typed damage slot;
  - Guts into HP (C1);
  - the Rift's ward trait ([the Rift](rift.md) §5).
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
| Spell Blade vs Summoner, damage per turn over a whole fight | Within ±5% (the mirror) |
| One healer, doubled shares | Keeps an on-curve party through a front boss with no Uma falling twice |
| Spell Blade vs Brawler, against shielded single foes | Spell Blade Breaks a sub-boss at least 1 round sooner; Brawler deals ≥ 10% more after the Break |
| Summoner vs Mage's Blizzard, against 3+ foes | Summoner ≥ Mage over a whole wave, by the farewell strikes |
| Today's campaign, on-curve party of each shape | Win rates within 3 points of v13 (no campaign rebalance) |
| The Rift's fronts | Set in [the Rift](rift.md) §11 |

## 10. Owner calls: decided 2026-10-21 (D160)

| Call | Decision |
|---|---|
| **C1** | Guts feeds HP: +1 HP a point |
| **C2** | The Paladin's hall is the Paladin Bastion |
| **C3** | Inherited Limit Breaks use the higher of her ATK and M.ATK; kinds still decide weaknesses |
| **C4** | **Changed by the owner:** Orbs are flat, half a weapon's Might at their grade (§6.2), not a percentage |
| **C5** | One damage slot and one support slot in Tiers 1–2; a third slot comes with Tier 3 |
| **C6** | One standard preset per class, applied on tap |
| **C7** | The Cleric splits into Paladin and Cleric |
| **C8** | **The owner's:** one healer a party, so mend and Barrier shares double and the Barrier cap is 60% (§3.3) |
| **C9** | **The owner's:** the Summoner mirrors the Spell Blade, as a pair with the Tome summon leading (§3.2) |
| **C10** | **The owner's:** accessory slots are typed, one damage (an Orb) and one support (a Talisman or Amulet) (§6.1) |
