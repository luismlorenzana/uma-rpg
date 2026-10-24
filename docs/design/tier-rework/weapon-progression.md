# Weapon Progression: weapons, armor, accessories and what they cost, Tier 1 to Tier 3

> **Authored 2026-10-24. Nothing here is built.** The second standalone doc of the Tier rework
> ([README §5](README.md#5-cross-reference-then-review), step 3.2). It absorbs [gear.md](gear.md), which stays as history,
> and adopts the research note's direction ([weapon-research.md](weapon-research.md), WR1–WR6). Calls are **WP1–WP30**,
> each with a recommendation ([§14](#14-decisions)); [§15](#15-the-first-rounds-calls-mapped) maps every GE and WR call.
> No open questions.
>
> **The owner's direction, 2026-10-24, designed within:**
> - **Weapons** own which kinds she hits with and how hard a weak hit lands, never a hit shape. Tier 1 is a straight
>   line; Tier 2's G5 is **Pure** (weak ×1.5) or **Dual** (a second kind of the weapon's own channel); one Dual in her
>   slots in Tier 2, two in Tier 3, one for good for the Brawler and the Mage; Tier 3 deepens: Pure → **Keen** (×1.7) or
>   **Tempered** (a second kind, both ×1.5), Dual → Tempered. No third branch; no Prism.
> - **Accessories** are redesigned: the defensive Talismans and Amulets and the MP accessories go; every accessory is
>   damage-oriented; the Orbs stay; a follow-up set joins (one extra hit on her Attack); multi-element first, focused
>   damage later; 1 · 2 · 3 slots by tier.
> - **Armor carries all defense**, valued so the defensive budget the foes expect still holds. Armor sets stay dropped.
> - **Class specializations** become weapon-group focus (class-progression's pass 3): this doc stays compatible and
>   designs none.
>
> **Values** follow SB1 ([README §2.5](README.md#25-the-stat-budget-sb1-working-rule-2026-10-23)): every flat build value
> is its Tier 1 value × 1, × 1.8 or × 2.6. Shares (a weak multiplier, evasion, a follow-up's power, a percentage) stay
> the same in every tier.
>
> **Pages** (full desktop, light and dark): [the weapon tree viewer](previews/weapon-trees.html) ·
> [armor and the defensive budget](previews/weapon-armor.html) · [the accessory catalog and its
> viability](previews/weapon-accessories.html) · [every recipe and one Uma's totals](previews/weapon-materials.html).
>
> **Interfaces, not designed here:** class slots, defaults and specializations ([class-progression.md](class-progression.md),
> whose pass 3 rewrites the specializations); the Halo and the jewels (extra-stats-progression.md); material supply, the
> places and the amounts (profession-progression.md, which reads [§6.4](#64-the-interface-for-profession-progression)'s
> recipe table); Uma Templates (a later pass).

## The owner's points

| The owner's point | Answered in |
|---|---|
| A standalone, detailed doc for weapons, armor and accessories, with their material requirements | This doc; [§3](#3-weapons), [§4](#4-armor), [§5](#5-accessories), [§6](#6-crafting-and-materials) |
| Weapons own which kinds she hits with and how hard a weak hit lands, never a hit shape | [§2.1](#21-who-owns-what-wp1), WP1 |
| Tier 1: a straight line G0 → G10, one kind | [§3.1](#31-tier-1-a-straight-line-wp5) |
| Tier 2 at G5: Pure (×1.5) or Dual (a second kind of its own channel) | [§3.2](#32-tier-2-pure-or-dual-at-g5-wp6-wp7) |
| One Dual per Uma in Tier 2, two in Tier 3, one for good for the Brawler and the Mage | [§3.4](#34-the-limits-wp8) |
| Tier 3 deepens: Pure → Keen (×1.7) or Tempered; Dual → Tempered. No third branch, no Prism | [§3.3](#33-tier-3-the-branch-deepens-wp9), WP6 |
| The full weapon tree per tier, with the coverage numbers that prove weaknesses aren't trivialized | [§3.5](#35-the-full-tree-drawn), [§3.6](#36-coverage-weaknesses-stay-a-puzzle-wp12); [the tree viewer](previews/weapon-trees.html) |
| "Defensive accessories are just unfun … let's leave defense balancing to armors" | [§5.1](#51-what-retires-and-why-wp17) drops all ten; [§4.3](#43-the-defensive-budget-wp15) moves their worth into armor |
| "MP regen accessories are too broken; I would always wear one on every class" | [§5.1](#51-what-retires-and-why-wp17) drops them; [§5.9](#59-mp-after-the-mp-accessories) says where MP comes from |
| Refocus accessories on damage; make them all viable; keep the extra elemental and physical damage ones | [§5.2–§5.4](#52-four-families-wp18): Pendants, Bells, Orbs (kept), Insignias; [§5.7](#57-viability-every-accessory-a-real-choice), the viability analysis |
| A set that adds one follow-up attack on auto attacks only, for any weapon type or Tome type | **Bells** ([§5.5](#55-the-bell-one-follow-up-on-her-attack-wp21)): ten, one a kind; its power, and its kind counts for weaknesses and locks but never adds a kind |
| 1 · 2 · 3 slots by tier is fine; multi-element early in Tier 1, more damage-focused later; Tier 1's maybe the more game-changing | [§5.3](#53-slots-and-unlocks-by-tier-wp19): Pendants and Bells in Tier 1, Orbs in Tier 2, Insignias in Tier 3 |
| Armor carries all defense: values per slot, grade and tier (HP, DEF, M.DEF, MP, evasion; the halves), under SB1 | [§4.1–§4.4](#41-slots-and-halves-wp14); [the armor page](previews/weapon-armor.html) |
| Armor sets stay dropped | [§4.5](#45-no-sets-wp16) |
| Specializations as weapon-group focus: stay compatible | [§3.9](#39-weapon-groups-and-everything-that-reads-a-kind-wp13): every bonus reads a hit's own kind; a Pendant per group |
| Weapon trees and material requirements | [§6.2](#62-every-recipe-by-grade-and-tier) every recipe by grade and tier, [§6.3](#63-one-umas-totals-per-tier) one Uma's totals; [the materials page](previews/weapon-materials.html) |
| (First round) base weapons at G0; crafting makes improvement gems | [§2.2](#22-one-rule-for-every-piece-wp2-wp3), kept from gear.md GE1 |
| (First round) do weapons carry element or physical properties, or the trees? | [§2.1](#21-who-owns-what-wp1): weapons carry kinds; trees carry shape |

## 0. At a glance

| | Today (every tier) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| **Weapon slots** | 5 | 3, by her class's Arms count | 3 | 3 |
| **A weapon** | A crafted piece, bound for good; Weapon Rank gates it | She owns all ten at **G0**; a **Weapon Gem** raises one a grade | The same; **G5 takes a Branch Gem** | The same |
| **Might (G10)** | 68 | 68 | 122 (× 1.8) | 177 (× 2.6) |
| **Weapon branch** | — | **Base:** one kind | At G5: **Pure** (weak ×1.5) or **Dual** (+ a kind of its channel) | Pure → **Keen** (×1.7) or **Tempered** (+ a kind, both ×1.5); Dual → **Tempered**; Base → Pure or Dual |
| **Two-kind weapons in her slots** | — | 0 | **1** | **2**; the Brawler and the Mage **1** |
| **A weak hit, at most** | ×1.3 | ×1.3 | ×1.5 | ×1.7 |
| **Kinds an Uma holds, at most** | 5 | 3 | 4 | 5; the Brawler and the Mage 4 |
| **Answers a regular foe** (the default party) | Nearly all | **2.47** (twins) | **2.0** (one kind) | **2.34** (one kind) |
| **Armor** | 5 pieces, a half each, Armor Rank | 5 slots at G0, **her class's half**; **Armor Fittings** raise a slot | 5; the four between **per piece** | The same |
| **Armor at G10** | HP +100, DEF +20, M.DEF +20, MP +20, evasion 12%, offense +25 | **HP +150, DEF +40, M.DEF +40, MP +30**, evasion 12%, offense +25 | × 1.8 (HP +270, DEF +72 …); evasion 12% | × 2.6 (HP +390, DEF +104 …); evasion 12% |
| **A regular's 100% hit** (on-curve Brawler, Lv 50) | 20.0% of her HP (17.0% with an Iron Talisman) | **18.7%**, armor alone | 18.7% | 18.6% |
| **Accessory slots** | 2 typed: Damage (Orb), Support (Talisman, Amulet) | **1** | **2** | **3** |
| **Families she can wear** (one of each) | Orbs; 10 defensive supports | **Pendants** (multi-kind) · **Bells** (a follow-up on her Attack) | + **Orbs** (one kind) | + **Insignias** (timing) |
| **Accessory at G10** | Orb +34 on one kind; a support | Pendant +14 on three kinds or +20 on two · Bell: a hit at 1.0 | + Orb +61 on one kind | + Onslaught +20% (first act a wave) or Slayer +15% (sub-bosses, bosses) |
| **Defensive or MP accessories** | 10 | **None** | None | None |
| **Crafted items** | 40 gear types × 10 grades | **Weapon Gem, Armor Fittings, Accessory Setting**, G1–G10 | + **Branch Gem** (G5) | The same |
| **One Uma's gear, refined items** | 240 | **365** (90 items) | 380 (100) | 380 (110) |
| **One Uma in all, with jewels** | 472 | 485 (493 with her moon) | 510 (518) | 520 (528) |
| **Gear gate** | 24 rank bars | Uma Lv 5g − 4 | The same | The same |

**The design in eight lines:**
1. She owns every weapon, armor slot and accessory slot at G0; one crafted item raises one a grade, at Uma Lv 5g − 4.
2. **Weapons carry kinds and the weak multiplier, nothing else.** Tier 1 is a line; Tier 2 forks once at G5; Tier 3
   deepens the fork. Never three kinds on a weapon, never a whole channel on an Uma.
3. **Coverage stays at or under Tier 1's** at every tier (2.47 → 2.0 → 2.34 answers a regular), the bound that keeps
   weaknesses a puzzle.
4. **Armor carries all defense:** its HP, DEF and M.DEF grow by about one support's worth, so a regular's hit takes
   18.7% of her HP instead of 20%, and the foes' budget holds.
5. **Every accessory deals damage.** Pendants spread flat offense over two or three kinds; Bells add one hit to her
   Attack; Orbs focus one kind; Insignias pay on timing. One of each family at most.
6. **Each family wins somewhere:** Pendants when she leaves one on all region long, Orbs when she tunes to a front,
   Bells when MP runs dry, Insignias on waves or bosses (§5.7).
7. **Four items to craft**, one recipe each a grade band; one Uma's gear stays at 365 · 380 · 380 refined.
8. Everything flat scales by × 1, × 1.8, × 2.6; everything that is a share stays.

## 1. Today

Manual: [classes](../../game/classes.md#weapons), [combat](../../game/combat.md#damage),
[materials](../../game/materials.md#gear), [loops](../../game/loops.md#extra-stats-and-gear). Code:
`packages/domain/src/economy/` (`gear.ts`, `gear-id.ts`, `ranks.ts`), `save/forge.ts`, `world/balance-party.ts`.

| Piece | Today |
|---|---|
| **Weapons** | Five slots a class; ten kinds. A Training weapon (G0) of each. Crafted pieces G1–G10 add **Might** to their own hits: 1, 4, 8, 12, 19, 26, 35, 45, 57, 68 (`MIGHT_BY_GRADE`), about 6% × g at the level the grade opens. A weak hit is ×1.3 (`BATTLE_WEAK`) |
| **Weapon Rank** | 1–10 per weapon, from wins (5E over her five weapons, double for the ones she used); grade g worn at rank g, about Lv 5g − 4 |
| **Armor** | Five slots (head, body, legs, arms, feet), each its physical or magical piece: ten kinds, G1–G10, an Armor Rank each. A piece gives ATK or M.ATK ⌈g ÷ 2⌉ and its slot's stat +2g: head DEF, body HP (+5 a point), legs MP, arms M.DEF, feet Speed (0.6% evasion a point) |
| **Accessories** | Two typed slots (C10): **Damage**, an Orb: half a weapon's Might on its kind's hits (+34 at G10); **Support**, one of five Talismans (Vital regen 1% HP a grade, Vampire 2% lifesteal, Bulwark 2% shield, Iron 1.5% physical cut, Thorn 5% returned) or five Amulets (Spring 1 MP a round a grade, Siphon 0.8% of magical damage as MP, Veil 2% shield, Ward 1.5% magical cut, Mirror 5% returned) |
| **The balance party** | Wears an Orb of her first weapon and Vampire (Brawler, Spell Blade), Siphon (Mage, Summoner), Spring (Cleric) or Thorn (Paladin): H60 priced every support at about the same win-rate gain |
| **Crafting** | The Forge: 40 types × 10 grades; two refined items a piece, the pair rotating with the grade (D139); Craft Lv 5g − 4 |
| **Wearing** | Binding from stock is for good, in order (D119); rank EXP past 10 banks as Gear Marks, which buy Manuals |
| **One Uma, fully geared** | 120 pieces, 240 refined items (472 with her Star Gems) |
| **The first round** | [gear.md](gear.md): grades owned at G0, raised by gems, fittings and settings; Dual or Pure at Tier 2's G5, Prism, Tempered or Keen at Tier 3's; a Support slot in Tier 1, an Orb in Tier 2, a second Support in Tier 3; today's armor numbers |

## 2. The model

### 2.1 Who owns what (WP1)

**Weapons own what she hits with; classes and trees own how; armor owns defense; accessories add damage.**

| System | Owns | Never |
|---|---|---|
| **Weapons** | **Which kinds** she hits with (one; from Tier 2 two on one or two weapons), **how hard a weak hit lands** (×1.3 → ×1.5 → ×1.7), Might by grade × tier | A hit's shape, Breaks, locks rules, a channel change |
| **Class** (class-progression) | The channel split (Arms slots 3 · 0 · 2 · 1 · 2 · 1), the hand, the act's shape, Limit power, the class branch and mastery | A kind |
| **Skill trees** | Each weapon's shape for her class: reach, hits, statuses, support, Break tips | A kind (CP17) |
| **Armor** | **Every defensive stat:** HP, DEF, M.DEF, MP, evasion; a little offense on her half | A kind; any effect beyond stats |
| **Accessories** | **Damage only:** flat offense on kinds (Pendants, Orbs), one follow-up hit of a kind she holds (Bells), a percentage by timing (Insignias) | A kind she doesn't hold; defense; MP; the weak multiplier; Breaks |
| **Extra Stats** (the Halo) | Flat offense on one kind (two in Tier 3), under the kind cap with the accessories ([§5.6](#56-the-kind-cap-wp24)) | A kind for weaknesses |
| **Uma Templates** | The affinity, +6% on one twin set's hits (CP36) | A kind |
| **Limit Breaks** | Reach to kinds outside her weapons, once a gauge (C3) | — |

### 2.2 One rule for every piece (WP2, WP3)

- **She owns her gear at G0:** one weapon of each of the ten kinds, five armor slots and her tier's accessory slots, no
  stats at G0. Nothing is crafted as a piece, bound, kept in a locker or sold.
- **One crafted item raises one slot one grade:** a **Weapon Gem** a weapon, a **Branch Gem** a weapon's G5 step from
  Tier 2, **Armor Fittings** an armor slot, an **Accessory Setting** an accessory slot. G0 → G1 → … → G10, used up.
- **Her Uma Level gates the grade:** grade g at Lv 5g − 4 in her tier (G1 Lv 1, G5 Lv 21, G10 Lv 46), the Craft Level
  gate's numbers. Weapon, Armor and Accessory Ranks retire, with Gear Marks (to Class Marks) and the gear Manuals.
- **The slot holds the grade; what fills it swaps freely:** a weapon's grade sits on its kind (shared by every class
  that slots it), an armor slot's on the slot (either half), an accessory slot's on the slot (any type of an unlocked
  family). Changing half or accessory type never loses a grade.

| Grade | G0 | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Uma Lv to wear · Craft Lv to make | — | 1 | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 |
| Materials | — | low | low | low | low | low | high | high | high | high | high |

### 2.3 What SB1 scales (WP4)

| Scales × 1 · × 1.8 · × 2.6 (flat) | Stays the same in every tier (a share) |
|---|---|
| Weapon Might; armor's HP, DEF, M.DEF, MP and offense; Pendant and Orb offense; the kind cap; the Halo | A weak multiplier (×1.3, ×1.5, ×1.7); evasion (1.2% a feet grade); a Bell's power (0.1 a grade, × her hand); an Insignia's percentage |

**Why:** the build keeps the same share of every stat at each tier's Lv 50 (README §2.5); a share already does. The
first round's GE3 (flat Might in every tier) is replaced.

## 3. Weapons

### 3.1 Tier 1: a straight line (WP5)

- **Three slots by channel** (CP2): any kind of the slot's channel, three different kinds. The class's defaults (CP3)
  are where a new class starts.
- **G0 is the Training weapon:** it opens its tree and adds no Might. A Weapon Gem of grade g raises it from g − 1.
- **One kind, weak ×1.3, its grade's Might.** No choice beyond which weapon sits in a slot.
- **Upgrading** on the weapon's sheet: "G4 → G5 · 1 Weapon Gem G5", once the Warehouse holds it and she is Lv 21; "Up
  to G7" climbs several grades and lists the gems first.

**Might by grade and tier** (her hits with that weapon add it to her offense):

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Tier 1** (× 1) | 1 | 4 | 8 | 12 | 19 | 26 | 35 | 45 | 57 | 68 |
| **Tier 2** (× 1.8) | 2 | 7 | 14 | 22 | 34 | 47 | 63 | 81 | 103 | 122 |
| **Tier 3** (× 2.6) | 3 | 10 | 21 | 31 | 49 | 68 | 91 | 117 | 148 | 177 |

### 3.2 Tier 2: Pure or Dual at G5 (WP6, WP7)

**At G5 the weapon takes a branch.** The G5 step takes a **Branch Gem** instead of a Weapon Gem; she picks the branch
when she uses it (and, for a Dual, its second kind). G6–G10 continue on Weapon Gems with the tier's Might.

| Branch | What it is | A weak hit | Kinds | Shown as |
|---|---|---|---|---|
| **Pure** (the owner's "Specialized", renamed so it can't read as a hit shape) | Harder weak hits on its own kind | **×1.5** | 1 | "Pure Greatsword" |
| **Dual** | **A second kind of its own channel:** an Arm adds an Arm, a Tome an element. Coverage only | ×1.3 | 2 | "Dual Axe + Katana" |

**The second kind, exactly:**
- **Its hits carry both kinds for weaknesses and charged-move locks.** A weak hit removes one shield point and breaks
  one lock, whichever of its kinds matched (never two for one hit): one meaning of "weak".
- **It is coverage, never a bonus:** the hit keeps the weapon's channel, offense, Might, tree and slot. Every bonus on a
  kind reads the hit's **own kind** (its first): Orbs, Pendants, the Halo, the affinity, a Bell, a group bonus
  ([§3.9](#39-weapon-groups-and-everything-that-reads-a-kind-wp13)).
- **Of its own channel, so it counts in every class** that slots it: a Dual Axe + Katana is the same weapon for a
  Brawler, a Spell Blade or a Cleric. The first round's class check (GE7: "Fire: not as a Brawler") retires.
- **Four options a weapon:** the four other kinds of its channel. A Greatsword may add an Axe, a Lance, a Bow or a
  Katana; a Fire Tome Ice, Lightning, Light or Dark.

**Why no third branch** (WR2): the kind axis has two directions, more kinds or harder weak hits. Every third candidate
the research weighed (Break, lock, executioner, attunement, conversion, imbue) duplicates a tree's or a class's job or
trivializes weaknesses ([weapon-research §4](weapon-research.md#4-the-options)).

### 3.3 Tier 3: the branch deepens (WP9)

**Branches carry at promotion; grades reset.** At Tier 3's G5, each weapon takes the step its Tier 2 branch allows:

| Arrives as | Branch Gem makes | What it is | A weak hit | Kinds |
|---|---|---|---|---|
| **Pure** | **Keen** | Its weak hits harder still | **×1.7** | 1 |
| **Pure** | **Tempered** | A second kind of its channel, picked now, and Pure's multiplier | ×1.5 on both | 2 |
| **Dual** | **Tempered** | Its two kinds, both harder | ×1.5 on both | 2 |
| **Base** (never branched) | **Pure** or **Dual** | The Tier 2 step, a tier late | ×1.5 · ×1.3 | 1 · 2 |

- **A Pure keeps both doors open** (Keen or Tempered); a Dual commits to Tempered. The weapon sheet says so in Tier 2:
  "Pure: Keen or Tempered in Tier 3 · Dual: Tempered".
- **A weak hit is never above ×1.7**, and no weapon ever holds three kinds.
- **What Tier 3 adds instead of stacking:** a higher multiplier on every weapon, and, for the four between only, a
  second two-kind weapon, which answers Tier 3's own narrowing (sub-bosses drop to one kind, CP6).

### 3.4 The limits (WP8)

| Limit | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Two-kind weapons in her three slots** | 0 | **1** | **2**; the Brawler and the Mage **1** |
| **Kinds she holds, at most** | 3 | 4 | 5; the Brawler and the Mage 4 |
| **One channel's kinds, at most** | 3 | 4 | **4: never all five** |
| **A weak hit, at most** | ×1.3 | ×1.5 | ×1.7 |
| **Her slotted kinds** | All different | All different, second kinds included | The same |

- **The cap is a loadout rule, not an ownership rule:** she may own several two-kind weapons and swap between fights; the
  slots hold the cap. A blocked slot says why: "One two-kind weapon in her slots in Tier 2".
- **Why the Brawler and the Mage stay at one:** with two they could hold four of their channel's five kinds and answer
  every boss of it; the four between already split their slots across both channels, so a second two-kind weapon still
  leaves each channel short.

### 3.5 The full tree, drawn

Every kind follows the same tree. [The tree viewer](previews/weapon-trees.html) draws it per kind and tier, every grade
with its Might, gate and item, the four second-kind options with what each answers, and the caps.

```text
Tier 1  Base ── G1 ── G2 ── … ── G10                          one kind · weak ×1.3 · Might 1 → 68
                                                               (branch carries, grades reset)
Tier 2  Base ── G1 … G4 ── G5 ─┬─ Pure ── G6 … G10              one kind · weak ×1.5 · Might 2 → 122
                    Branch Gem └─ Dual ── G6 … G10              + a kind of its channel · weak ×1.3
                                                               [her slots: one two-kind weapon]
Tier 3  Pure ── G1 … G4 ── G5 ─┬─ Keen ───── G6 … G10           one kind · weak ×1.7 · Might 3 → 177
                               └─ Tempered ─ G6 … G10           + a kind of its channel · both ×1.5
        Dual ── G1 … G4 ── G5 ─── Tempered ─ G6 … G10           its two kinds · both ×1.5
        Base ── G1 … G4 ── G5 ─┬─ Pure ───── G6 … G10           the Tier 2 step, a tier late
                               └─ Dual ───── G6 … G10
                                                               [her slots: two two-kind weapons;
                                                                the Brawler and the Mage one]
```

| Branch | Tier | Kinds | A weak hit | Example |
|---|---|---|---|---|
| Base | 1 on | 1 | ×1.3 | Greatsword |
| Pure | 2 on | 1 | ×1.5 | Pure Lance |
| Dual | 2 on | 2, one channel | ×1.3 | Dual Axe + Katana |
| Keen | 3 | 1 | ×1.7 | Keen Lance |
| Tempered | 3 | 2, one channel | ×1.5 on both | Tempered Axe + Katana |

### 3.6 Coverage: weaknesses stay a puzzle (WP12)

**The measure** (WR6): on the campaign's default party (Brawler, Mage, Spell Blade, Summoner and a healer on CP3's
defaults), how many members answer a foe, weighted by the world's 48 signatures (CP5). Tier 1 foes are weak to a twin
set; from Tier 2 regulars are weak to one kind of it (by role, CP6); bosses keep their twins in every tier. **The rule:
answers per regular never exceed Tier 1's at any tier**, and no Uma ever holds a whole channel.

| Build | Answers a regular · with a Cleric | With a Paladin | A boss (twins), Cleric |
|---|---|---|---|
| **Tier 1, defaults** | **2.47** | 2.66 | 2.47 |
| Tiers 2–3 with no branches | 1.47 | 1.49 | 2.47 |
| **Tier 2: one Dual each, best picks** | **2.00** | 2.00 | 3.30 |
| **Tier 3: a second for the four between** | **2.34** | 2.33 | 3.76 |
| Own channel, no count cap, never all five of a channel | 2.69 | — | — |
| Free Duals (the first round's GE7), or no caps at all | 2.84 | — | — |

**With best picks every kind has two holders from Tier 2:** the default party's single kinds sit at one holder for
Greatsword, Axe, Katana, Fire and Dark (Cleric) or Bow, Katana, Fire, Ice and Dark (Paladin), and five members each add
one. Breadth grows exactly as fast as regulars narrow, and stays under Tier 1's.

| Kind (Cleric party) | Greatsword | Axe | Lance | Bow | Katana | Fire | Ice | Lightning | Light | Dark |
|---|---|---|---|---|---|---|---|---|---|---|
| Holders, Tier 1 | 1 | 1 | 2 | 2 | 1 | 1 | 2 | 2 | 2 | 1 |
| Holders, Tier 2 (recommended picks) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| Holders, Tier 3 | 3 | 2 | 2 | 2 | 2 | 3 | 3 | 2 | 2 | 2 |

**One Uma alone** (share of signatures she answers):

| Class | Tier 1 regular (twins) | Tier 2 regular (one kind), no branch → one Dual | Tier 3 regular, two-kind weapons | A boss, Tier 2 |
|---|---|---|---|---|
| Brawler | 66% | 33% → 43% | 43% (one, for good) | 86% |
| Mage | 66% | 33% → 41% | 41% | 82% |
| Spell Blade | 41% | 30% → 42% | 53% | 64% |
| Summoner | 34% | 24% → 35% | 47% | 57% |
| Paladin | 59% | 30% → 41% | 52% | 59% |
| Cleric | 41% | 27% → 39% | 50% | 41% |

**Bosses gain answers** (2.47 → 3.30 → 3.76): they keep both twins while every Uma adds a kind. That is the one place
branches widen reach past Tier 1, so **boss shields scale with it**: rounds to the first Break hold within ±0.5 of Tier
1's when a boss's shield grows with her answers (the draft: 6 → 8 → 9, Z2's +1 included; class-progression owns
shields, the simulation sets them). A boss's charged-move locks stay drawn from her twins (CP8); a pure class still
breaks only her own channel's locks.

**Assumptions** (the research's): the 48 signatures weighted as CP5; half of each twin set's regulars weak to its Arm
(by role); Twilight regulars split between the Bow and the Katana; a member answers a foe once. Regions lean (7
Arm-weak biomes, 5 element-weak), so per-region figures differ; the simulation runs them per region.

### 3.7 Pure or Dual: what each buys

| | Pure (Tier 2) | Dual (Tier 2) | Keen (Tier 3) | Tempered (Tier 3) |
|---|---|---|---|---|
| **Buys** | +15% on that weapon's weak hits (×1.5 ÷ ×1.3) | A kind: about one regular in ten more answered (5–5.5 of 48 signatures), each such hit weak and chipping | +13% more on weak hits (×1.7 ÷ ×1.5) | Pure's harder hits on two kinds |
| **Worth most** | Focused fronts where her kind is the weakness: the Rift's guided builds, a region she farms | The campaign's mixed regions; bosses (their twins) | The same, deeper | Breadth and depth, for the four between |
| **A Brawler's Axe, Tier 2 campaign** | +1.8% of her damage (11.5% of regulars weak to the Axe) | +3.1% of her damage (the Katana's 10.4% of regulars), plus their chips | — | — |

- **The cap forces a mix:** one Dual, so at least two Pure (or Base) weapons a Tier 2 Uma. Dual wins the campaign
  slot-for-slot; Pure wins the Rift's fronts, where the guided build already brings the right kind (CP7).
- **The simulation prices the pair** (WR6): a Dual and a Pure within ±10% of each other's worth across the campaign
  and the Rift together. If Dual proves too strong, the fallbacks in order: Tier 3 back to one two-kind weapon for
  everyone, then Dual from Tier 3 only, then no branches.

### 3.8 Every class's three weapons, by tier

Recommended picks for the campaign's default party (they put every kind in two hands from Tier 2); the Rift's guided
builds re-spec on top, as CP7 does. Any pick within the limits is legal.

| Class | Tier 1 (CP3) | Tier 2 | Tier 3 |
|---|---|---|---|
| **Brawler** | Greatsword · Axe · Lance | Pure Greatsword · **Dual Axe + Katana** · Pure Lance | Keen Greatsword · **Tempered Axe + Katana** · Keen Lance |
| **Mage** | Fire · Blizzard · Thunder | Pure Fire · **Dual Blizzard + Dark** · Pure Thunder | Keen Fire · **Tempered Blizzard + Dark** · Keen Thunder |
| **Spell Blade** | Katana · Lance · Thunder | **Dual Katana + Greatsword** · Pure Lance · Pure Thunder | **Tempered Katana + Greatsword** · Keen Lance · **Tempered Thunder + Ice** |
| **Summoner** | Dark · Light · Bow | Pure Dark · **Dual Light + Fire** · Pure Bow | Keen Dark · **Tempered Light + Fire** · **Tempered Bow + Greatsword** |
| **Cleric** | Light · Blizzard · Bow | Pure Light · Pure Blizzard · **Dual Bow + Axe** | Keen Light · **Tempered Blizzard + Fire** · **Tempered Bow + Axe** |
| **Paladin** (in her party the Spell Blade's Dual takes the **Bow**, Katana + Bow, and the Summoner's Tier 3 Bow adds the **Axe**) | Greatsword · Axe · Light | Pure Greatsword · Pure Axe · **Dual Light + Ice** | **Tempered Greatsword + Katana** · Keen Axe · **Tempered Light + Ice** |

The [tree viewer](previews/weapon-trees.html#builds) draws all six with what each answers, both healers.

### 3.9 Weapon groups, and everything that reads a kind (WP13)

class-progression's pass 3 rewrites the Tier 2 specializations as **weapon-group focus**: Arms **main** (Greatsword,
Axe, Lance) or **secondary** (Bow, Katana); Tomes **elemental** (Fire, Ice, Lightning) or **arcane** (Light, Dark). This
doc stays compatible with any version of it:

- **One reading rule:** every bonus on a kind or a group reads **a hit's own kind** (its weapon's first kind): a group
  focus, an Orb, a Pendant, the Halo, the affinity (CP36). A Dual's or Tempered's second kind decides only weaknesses and
  locks. So a Dual never doubles a bonus, and a group focus can't be stacked through a second kind.
- **Duals may bridge groups:** an Axe + Katana is a main-group weapon (its own kind) that answers a secondary kind. A
  Brawler focused on the main group keeps her focus on every hit of it and still reaches the Katana's foes; one focused
  on the secondary group may Dual a Bow + Lance the other way.
- **A Pendant per group** ([§5.4](#54-the-catalog-every-accessory)): Main Arms, Secondary Arms, Elemental, Arcane. Whichever
  way a class's branch points, there is a Pendant for it; the twin Pendants serve the hybrids, whose sets cross channels.
- **Nothing here depends on which group a branch picks.** If pass 3 renames the groups, the four Pendants follow.

### 3.10 Re-forging, a class switch and promotion (WP11)

- **Re-forging:** another Branch Gem of the tier changes a weapon's branch within its options, or a Dual's or
  Tempered's second kind. The grade stays.
- **A class switch** costs only the new class's weapons she hasn't raised (XR6): up to 30 Weapon Gems in Tier 1 (120
  refined), up to 27 Weapon Gems and 3 Branch Gems from Tier 2 (135). Armor and accessory grades sit on the slot.
- **Promotion:** branches carry, every grade resets to G0, and items she used return to the old world's Warehouse (D15,
  GE14 kept). A new tier is the free moment to change which three kinds she slots.
- **Class skills** (CP34) cast through a weapon carry its kinds, Might, branch multiplier and bonuses. **Limit Breaks**
  carry their own kinds at ×1.3 (no weapon's branch), and take the Orb's and Pendants' offense on their kinds, as today.

## 4. Armor

### 4.1 Slots and halves (WP14)

- **Five slots:** head, body, legs, arms, feet. **The slot holds the grade;** one Armor Fittings item of grade g raises
  any slot from g − 1.
- **The half sets two things only: the piece she shows and the offense it adds** (ATK physical, M.ATK magical,
  ⌈g ÷ 2⌉ a piece × tier). **Every defensive stat is the slot's, the same on either half,** so changing half never
  trades defense.
- **Tier 1: her class's half.** Brawler, Spell Blade and Paladin physical; Mage, Summoner and Cleric magical. Switching
  class switches the half; the grades stay.
- **From Tier 2 the four between pick a half per piece** (a Spell Blade in four physical pieces and a magical Robe for
  her Tome half). The Brawler stays physical, the Mage magical.

| Slot | Physical piece | Magical piece | Its stat |
|---|---|---|---|
| Head | Helm | Circlet | DEF |
| Body | Cuirass | Robe | HP |
| Legs | Greaves | Leggings | MP |
| Arms | Gauntlets | Bracers | M.DEF |
| Feet | Boots | Slippers | Evasion (Speed) |

### 4.2 Values by slot, grade and tier

**Tier 1** (today's in brackets): DEF and M.DEF **+4 a grade** (2), HP **+15 a grade** (10), MP **+3 a grade** (2),
evasion 1.2% a grade (the same), offense ⌈g ÷ 2⌉ a piece (the same).

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Head:** DEF | 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32 | 36 | 40 |
| **Body:** HP | 15 | 30 | 45 | 60 | 75 | 90 | 105 | 120 | 135 | 150 |
| **Legs:** MP | 3 | 6 | 9 | 12 | 15 | 18 | 21 | 24 | 27 | 30 |
| **Arms:** M.DEF | 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32 | 36 | 40 |
| **Feet:** evasion | 1.2% | 2.4% | 3.6% | 4.8% | 6.0% | 7.2% | 8.4% | 9.6% | 10.8% | 12.0% |
| **Each piece:** ATK or M.ATK | 1 | 1 | 2 | 2 | 3 | 3 | 4 | 4 | 5 | 5 |

**Tier 2** (× 1.8):

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Head: DEF · Arms: M.DEF | 7 | 14 | 22 | 29 | 36 | 43 | 50 | 58 | 65 | 72 |
| Body: HP | 27 | 54 | 81 | 108 | 135 | 162 | 189 | 216 | 243 | 270 |
| Legs: MP | 5 | 11 | 16 | 22 | 27 | 32 | 38 | 43 | 49 | 54 |
| Feet: evasion | 1.2% | 2.4% | 3.6% | 4.8% | 6.0% | 7.2% | 8.4% | 9.6% | 10.8% | 12.0% |
| Each piece: offense | 2 | 2 | 4 | 4 | 5 | 5 | 7 | 7 | 9 | 9 |

**Tier 3** (× 2.6):

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Head: DEF · Arms: M.DEF | 10 | 21 | 31 | 42 | 52 | 62 | 73 | 83 | 94 | 104 |
| Body: HP | 39 | 78 | 117 | 156 | 195 | 234 | 273 | 312 | 351 | 390 |
| Legs: MP | 8 | 16 | 23 | 31 | 39 | 47 | 55 | 62 | 70 | 78 |
| Feet: evasion | 1.2% | 2.4% | 3.6% | 4.8% | 6.0% | 7.2% | 8.4% | 9.6% | 10.8% | 12.0% |
| Each piece: offense | 3 | 3 | 5 | 5 | 8 | 8 | 10 | 10 | 13 | 13 |

**The suit at G10:** Tier 1 HP +150, DEF +40, M.DEF +40, MP +30, evasion 12%, offense +25 on her half; Tier 2 HP +270,
DEF +72, M.DEF +72, MP +54, offense +45; Tier 3 HP +390, DEF +104, M.DEF +104, MP +78, offense +65. Evasion stays 12%
(18% in Tier 3 with the Swiftness moon), since a share doesn't scale.

### 4.3 The defensive budget (WP15)

**The yardstick.** The foes' offense budget (`rpgFoeTierBudget`) was tuned against a built party: armor, Extra Stats and
a Support accessory, which H60 priced at about the same win-rate gain whichever she wore. With the supports gone, **armor
takes one support's worth.** One support is measured as the Iron Talisman at G10 (a 15% cut on physical damage: a
regular's 100% hit from 20% to 17% of an on-curve Brawler's HP); spread over both channels, since armor guards both and
a support guarded one, that is **about 20% → 18.5% on each**. Armor's increment, +50 HP, +20 DEF, +20 M.DEF (and +10 MP),
lands at 18.7%.

**A regular's 100% hit, as a share of her HP, at each tier's Lv 50** (fully built, SB1; the foe's offense set so
today's on-curve Brawler takes 20%):

| Class | Physical: today's armor | + an Iron Talisman | **New armor** | Magical: today's armor | + a Ward Amulet | **New armor** |
|---|---|---|---|---|---|---|
| Brawler | 20.0% | 17.0% | **18.7%** | 20.9% | 17.7% | **19.5%** |
| Mage | 24.8% | 21.1% | **23.0%** | 24.1% | 20.5% | **22.4%** |
| Spell Blade | 22.6% | 19.2% | **21.0%** | 22.7% | 19.3% | **21.2%** |
| Summoner | 22.6% | 19.2% | **21.0%** | 22.7% | 19.3% | **21.2%** |
| Paladin | 22.0% | 18.7% | **20.5%** | 22.7% | 19.3% | **21.2%** |
| Cleric | 22.6% | 19.2% | **21.0%** | 22.2% | 18.8% | **20.7%** |

Tier 1 shown; **Tiers 2 and 3 land within 0.1 point of it for every class** (the Brawler 18.7% and 18.6%), because
armor, Extra Stats and the foes' budget all move by the same multiplier. Every class gains 1.3–1.8 points on both
channels: half of what a one-channel support gave on its channel, on both, with nothing to pick.

- **Why not more:** a full support's cut on both channels (17%) would be a support and a half, and the foes' offense
  budget would have to rise to match. **Why not less:** the on-curve party loses its supports' sustain (Vampire's
  lifesteal, the MP regen) and needs it back somewhere the owner never has to choose.
- **What the simulation checks** (README §9.5 item 1): the on-curve party, with new armor and its Tier 1 accessory
  preset, wins every Tier 1 stage within 3 points of today's table. If survival lands outside, armor's per-grade HP is
  the knob (+15 a grade), not the foes.

### 4.4 Her sheet at Lv 50

class-progression §9's sheets with the new armor (fully built, SB1):

| Class | Tier | HP | DEF | M.DEF | MP |
|---|---|---|---|---|---|
| **Brawler** | 1 · 2 · 3 | 1,477 · 2,547 · 3,626 | 207 · 370 · 534 | 182 · 326 · 470 | 183 · 314 · 445 |
| **Mage** | 1 · 2 · 3 | 1,244 · 2,152 · 3,066 | 186 · 332 · 480 | 202 · 361 · 521 | 266 · 453 · 641 |
| **Spell Blade** | 1 · 2 · 3 | 1,337 · 2,310 · 3,290 | 196 · 351 · 507 | 192 · 344 · 496 | 217 · 370 · 524 |
| **Summoner** | 1 · 2 · 3 | 1,337 · 2,310 · 3,290 | 196 · 351 · 507 | 192 · 344 · 496 | 217 · 370 · 524 |
| **Paladin** | 1 · 2 · 3 | 1,337 · 2,310 · 3,290 | 212 · 379 · 548 | 192 · 344 · 496 | 266 · 453 · 641 |
| **Cleric** | 1 · 2 · 3 | 1,337 · 2,310 · 3,290 | 196 · 351 · 507 | 207 · 370 · 534 | 266 · 453 · 641 |

Against class-progression §9: HP +50 · +90 · +130, DEF and M.DEF +20 · +36 · +52, MP +10 · +18 · +26. Armor's share
of her HP holds at about a tenth in every tier (Brawler: 150 of 1,477, 10.2%; 390 of 3,626, 10.8%). The [armor page](previews/weapon-armor.html) draws
every class's sheet and the budget.

### 4.5 No sets (WP16)

Armor sets stay dropped (GE10): no set steps, no suit's lowest grade to track, no Lore Seals. Armor's job is defense and
a little offense; depth comes from weapons, trees, accessories and Extra Stats.

## 5. Accessories

### 5.1 What retires, and why (WP17)

**All ten supports retire, in every tier:**

| Retired | What it did (G10) | Why |
|---|---|---|
| Iron Talisman, Ward Amulet | Cut physical or magical damage taken 15% | The owner: "I will never pick the DEF or M.DEF accessories as opposed to some damage"; armor carries the worth (§4.3) |
| Bulwark Talisman, Veil Amulet | A shield of 20% of her max HP against one channel, from the fight's start | The same |
| Thorn Talisman, Mirror Amulet | Return 50% of one channel's damage taken | Damage only when hit: defense dressed as offense |
| Vital Talisman | Regen 10% of max HP a round | Defensive sustain; one healer a party already mends (C8) |
| Vampire Talisman | Heal 20% of the physical damage she deals | Sustain, not damage; the healer's job |
| **Spring Amulet** | 10 MP a round | The owner: "MP regen accessories are too broken; I would always wear one on every class" |
| **Siphon Amulet** | 8% of her magical damage back as MP | The same: at G10 a Mage's deep cast refunds more MP than it costs |

Redesigning the MP accessories out of the always-pick zone was weighed (a fraction of today's, or only between waves):
any MP regen competes with damage on a different axis, and a small one is a dead pick while a large one is always worn.
**MP comes from her level, armor's legs and her template's MP twists** ([§5.9](#59-mp-after-the-mp-accessories)).

### 5.2 Four families (WP18)

| Family | What it does | Tier | Members | Its place |
|---|---|---|---|---|
| **Pendant** | Flat offense on **two or three kinds** (a group or a twin set) | 1 | 9 | Breadth: she leaves it on all region long |
| **Bell** | When she Attacks, **her weapon of its kind strikes once more** | 1 | 10, one a kind | The free action made worth taking: MP-starved fights, extra chips |
| **Orb** (today's) | Flat offense on **one kind** | 2 | 10, one a kind | Depth: tuned to a front or a region |
| **Insignia** | A percentage **by timing**: her first act each wave, or her hits on sub-bosses and bosses | 3 | 2 | Waves of regulars; long boss fights |

All four add damage and nothing else; none adds a kind she doesn't hold, touches the weak multiplier or Breaks.

### 5.3 Slots and unlocks by tier (WP19)

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Slots** | 1 | 2 | 3 |
| **Families unlocked** | **Pendants, Bells** | + **Orbs** | + **Insignias** |
| **Choices** | One of two families | Two of three | Three of four |

- **One accessory of each family at most** (today's "two different types", kept as a family rule). Every tier keeps a
  real choice of family, and nothing stacks two of one kind of effect.
- **Slots are untyped:** the Damage and Support slots retire with the supports. The slot holds the grade; the type
  swaps freely among the unlocked families' members, outside fights.
- **The owner's shape:** multi-element first (Pendants in Tier 1), the game-changer in Tier 1 too (the Bell: her free
  Attack chips twice), focused damage later (the Orb in Tier 2, Insignias in Tier 3).
- **G0 does nothing;** an Accessory Setting raises the slot as before.

### 5.4 The catalog, every accessory

**Pendants (Tier 1 on): flat offense on each of its kinds' hits.** Each Pendant spreads **1.2 Orbs of offense** over its
kinds: a three-kind Pendant gives 0.4 of an Orb on each, a two-kind 0.6.

| Pendant | Its kinds | Serves |
|---|---|---|
| **Main Arms Pendant** | Greatsword, Axe, Lance | The Brawler's defaults; the Paladin's two Arms; pass 3's main group |
| **Secondary Arms Pendant** | Bow, Katana | Pass 3's secondary group; Rift builds with the Bow and the Katana |
| **Elemental Pendant** | Fire, Ice, Lightning | The Mage's defaults; pass 3's elemental group |
| **Arcane Pendant** | Light, Dark | The Summoner's two Tomes; pass 3's arcane group |
| **Fire Twin Pendant** | Greatsword, Fire | A hybrid or healer holding the Fire twins |
| **Ice Twin Pendant** | Axe, Ice | The Ice twins |
| **Lightning Twin Pendant** | Lance, Lightning | The Spell Blade's defaults (Lance and Thunder): both halves |
| **Light Twin Pendant** | Bow, Light | The Cleric's and the Summoner's Bow and Light |
| **Dark Twin Pendant** | Katana, Dark | The Dark twins |

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Three-kind Pendant, each kind: Tier 1 · 2 · 3 | 1 · 2 · 3 | 1 · 2 · 3 | 2 · 4 · 5 | 2 · 4 · 5 | 4 · 7 · 10 | 5 · 9 · 13 | 7 · 13 · 18 | 9 · 16 · 23 | 12 · 22 · 31 | **14 · 25 · 36** |
| Two-kind Pendant, each kind: Tier 1 · 2 · 3 | 1 · 2 · 3 | 1 · 2 · 3 | 2 · 4 · 5 | 4 · 7 · 10 | 6 · 11 · 16 | 8 · 14 · 21 | 11 · 20 · 29 | 14 · 25 · 36 | 17 · 31 · 44 | **20 · 36 · 52** |

**Bells (Tier 1 on): one follow-up hit on her Attack**, ten, one a kind: Greatsword Bell, Axe Bell, Lance Bell, Bow
Bell, Katana Bell, Fire Bell, Ice Bell, Lightning Bell, Light Bell, Dark Bell ([§5.5](#55-the-bell-one-follow-up-on-her-attack-wp21)).

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| The follow-up's power (an Attack is 1.0), × her hand, every tier | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | **1.0** |

**Orbs (Tier 2 on): flat offense on one kind's hits**, today's ten (Greatsword Orb … Dark Orb), half a weapon's Might.

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Tier 1 value (reference) | 1 | 2 | 4 | 6 | 10 | 13 | 18 | 23 | 29 | 34 |
| **Tier 2** (× 1.8) | 2 | 4 | 7 | 11 | 18 | 23 | 32 | 41 | 52 | **61** |
| **Tier 3** (× 2.6) | 3 | 5 | 10 | 16 | 26 | 34 | 47 | 60 | 75 | **88** |

**Insignias (Tier 3): a percentage by timing.**

| Insignia | What it does | G1 → G10 |
|---|---|---|
| **Onslaught Insignia** | Her first act in each wave deals more damage | +2% a grade: **+20%** |
| **Slayer Insignia** | Her hits on a sub-boss or a boss deal more damage (by rank: the Horde's regular-rank leaders don't count) | +1.5% a grade: **+15%** |

**What each Pendant and Orb adds reaches every hit of its kinds**, her Attacks, skills, a Bell's follow-up and a Limit
Break's hits of those kinds (today's Orb path), and reads a hit's own kind (§3.9).

### 5.5 The Bell: one follow-up on her Attack (WP21)

The owner's set: "one single follow-up attack on auto attacks only, for any weapon type or Tome type".

- **When:** her act includes an **Attack** (the free action: a Brawler's Attack, either half of a hybrid's pair, a
  healer's Attack). Never on a skill, a Guard or a Limit Break. Once an act.
- **What:** **her weapon of the Bell's kind strikes once** at the Bell's power (0.1 a grade, 1.0 at G10) × her hand for
  that kind's channel (Brawler and Mage ×1; Spell Blade Arms ×0.72, Tome ×0.44; Summoner Arms ×0.56, Tome ×0.58; healers
  ×0.5). One hit, never split (no Spell Blade extra hit), on the foe her Attack struck, or a random living foe if that one
  fell (seeded, as the Lance's random hits are).
- **It is a hit of that weapon:** its channel and offense, its Might, its kinds (a Dual's second too), its branch's weak
  multiplier, and the Pendant, Orb and Halo on its kind. It adds nothing to the Limit gauge.
- **Its kind counts for weaknesses and locks:** a weak follow-up removes a shield point and breaks a lock, like any weak
  hit. **But the Bell's kind must be one she holds:** the own kind of one of her three slotted weapons. A Bell of a kind
  she doesn't slot does nothing ("No Fire Tome in her slots"). **So a Bell adds hits, never a kind:** Tier 1's 2.47
  answers a regular don't move.
- **Why it counts:** a follow-up that couldn't chip would split "weak" in two meanings (the research rejected that for
  Duals). Why only her kinds: with any kind of her channel, each Uma would hold a fourth kind on her Attack, and the
  party would answer about 3.2 of a Tier 1 regular's twins instead of 2.47: the trivializing the owner ruled out with
  Prism.
- **What makes it game-changing in Tier 1:** her free Attack chips twice when the Bell's kind is weak too (a Brawler on an
  Ice foe with a Greatsword Bell: Greatsword Attack and Greatsword follow-up, two chips; a Spell Blade on her twin set:
  two blade hits, a spell, and a Lightning Bell's follow-up, four). Breaks are where damage lands (unbroken foes take
  ×0.5).

| Class | Chips a weak Attack act, without · with a Bell | The Bell's value in damage (model, §5.7) |
|---|---|---|
| Brawler, Mage | 1 · 2 | Campaign 7.5% · 4.5%; long fights 18.1% · 9.9% |
| Spell Blade | 3 (two blade hits, one spell) · 4 | 3.9%; long fights 8.4% |
| Summoner | 2 · 3 | 2.9%; 6.3% |
| Paladin, Cleric | 1 · 2 | 2.6–2.7%; 5.2% |

### 5.6 The kind cap (WP24)

**Flat offense on one kind from accessories and the Halo stops at a G10 weapon's Might × tier: +68, +122, +177.** It
extends extra-stats-tier2's X7 bound (the Orb and the ring together ≤ a G10 weapon's Might) to Pendants.

- Tier 1 never reaches it (a Pendant is at most +20 a kind, and there is no Halo or Orb).
- Tier 2: an Orb (+61) and the Halo's two nodes (+61) on one kind fill it exactly; a Pendant adds there nothing, so she
  points the Pendant at her other kinds, or the Halo at another kind. The sheet shows "Greatsword: +122 (capped)".
- Percentages (affinity, Insignias) and the weak multiplier sit outside the cap; each is bounded on its own (+6%, +20%
  for one act a wave, +15% on elites, ×1.7).

### 5.7 Viability: every accessory a real choice

**The question:** is each family the best somewhere, and close enough elsewhere to be a choice? **The model** (drafts for
the simulation; every number on the [accessories page](previews/weapon-accessories.html#viability)): Tier 1 values at
G10 and Lv 50 (every family keeps its share in later tiers under SB1), on the owner's defaults; a flat point is worth its
place in `offense² ÷ (offense + defense)` (foe defense about 190, so +34 on her lead kind is +18%); her damage split by
kind from the 48 signatures (she swings her weak weapon when she holds one); her Attack share of acts by her MP (Brawler
30%, Mage 20%, hybrids 25%, healers 12%); a skill averages 4.7 single-target units at Lv 50. Four contexts:

| Context | Her kinds | Attacks | First acts of a wave | Damage on elites |
|---|---|---|---|---|
| **Campaign, set and forget** (one accessory all region long) | Split by the 48 signatures | × 1 | 33% | 30% |
| **Tuned** (she swaps for a region or a Rift front) | 75% on her best kind | × 1 | 33% | 30% |
| **Long fight** (a boss, the Duel; MP runs dry) | 75% on her best kind | × 1.7 | 8% | 100% |
| **Waves of regulars** (the Horde) | 50% on her best kind | × 0.6 | 40% | 0% |

**Damage gained by the best member of each family:**

| Class | Context | **Pendant** | **Bell** | **Orb** (T2+) | **Onslaught** (T3) | **Slayer** (T3) |
|---|---|---|---|---|---|---|
| **Brawler** | Campaign | 7.4% Main Arms | **7.5%** Greatsword | 6.3% | 6.6% | 4.5% |
| | Tuned | 8.0% Fire Twin | 8.4% | **13.7%** Greatsword | 6.6% | 4.5% |
| | Long fight | 8.0% | **18.1%** | 13.7% | 1.6% | 15.0% |
| | Waves | 7.4% | 4.5% | **9.1%** | 8.0% | 0% |
| **Mage** | Campaign | **7.3%** Elemental | 4.5% Fire | 6.1% | 6.6% | 4.5% |
| | Tuned | 7.8% | 5.1% | **13.4%** Fire | 6.6% | 4.5% |
| | Long fight | 7.8% | 9.9% | 13.4% | 1.6% | **15.0%** |
| | Waves | 7.3% | 2.8% | **8.9%** | 8.0% | 0% |
| **Spell Blade** | Campaign | **7.3%** Lightning Twin | 3.9% Katana | 6.9% | 6.6% | 4.5% |
| | Tuned | 9.4% | 4.1% | **13.7%** Katana | 6.6% | 4.5% |
| | Long fight | 9.4% | 8.4% | 13.7% | 1.6% | **15.0%** |
| | Waves | 8.2% | 2.2% | **9.1%** | 8.0% | 0% |
| **Summoner** | Campaign | **7.5%** Arcane | 2.9% Dark | 6.6% | 6.6% | 4.5% |
| | Tuned | 9.4% | 3.1% | **13.7%** Dark | 6.6% | 4.5% |
| | Long fight | 9.4% | 6.3% | 13.7% | 1.6% | **15.0%** |
| | Waves | 8.2% | 1.7% | **9.1%** | 8.0% | 0% |
| **Paladin** | Campaign | 5.7% Main Arms | 2.6% | **7.0%** Greatsword | 6.6% | 4.5% |
| | Tuned | 8.4% Arcane | 2.8% | **14.4%** | 6.6% | 4.5% |
| | Long fight | 8.4% | 5.2% | 14.4% | 1.6% | **15.0%** |
| | Waves | 6.1% | 1.6% | **9.6%** | 8.0% | 0% |
| **Cleric** | Campaign | 6.4% Light Twin | 2.7% | **8.2%** Blizzard | 6.6% | 4.5% |
| | Tuned | 9.6% | 2.8% | **14.4%** Light | 6.6% | 4.5% |
| | Long fight | 9.6% | 5.2% | 14.4% | 1.6% | **15.0%** |
| | Waves | 7.9% | 1.6% | **9.6%** | 8.0% | 0% |

**What it shows:**
- **Every family is someone's best:** Pendants in the campaign left alone (four classes), the Bell for the Brawler in the
  campaign and in long fights, the Orb when she tunes and on waves, Slayer on bosses, Onslaught close behind on waves.
- **No family dominates:** in the campaign left alone the Pendant, the Orb and Onslaught sit within 6.1–7.5% for the
  four damage classes (and the Bell with them for the Brawler); the Orb leads when tuned by half again or more, which is
  the work it asks (a swap a region). Tier 1's two families split the classes: the Bell for the Brawler, Pendants for
  the rest.
- **The Bell is a niche on purpose for the healers and the Summoner** (their acts are skills, their hands small): it is
  the Brawler's and the Mage's MP answer and a hybrid's Break tool (chips aren't in these damage numbers).
- **By level** (Tier 1, a Brawler, campaign): the Bell leads from Lv 6 to Lv 31 (+4.4–6.8% against the Pendant's
  3.2–6.5%, when MP is tightest and her Attack share highest), the Pendant from G8 on (+7.1–8.2% against 5.9–7.4%), and
  they tie at Lv 50. A real choice that moves through the tier; the page draws it.
- **Combinations** add (one of each family): a Tier 2 Brawler on the campaign wears a Greatsword Bell and a Greatsword
  Orb; a Tier 3 Summoner an Arcane Pendant, a Dark Orb and an Onslaught Insignia (§5.8).

**The simulation checks** (README §9.5): each family's best member within ±25% of the best family in at least two of the
four contexts for at least two classes; if one family wins everywhere, its per-grade values come down first.

### 5.8 Presets per class and tier (WP25)

The standard preset (D164) dresses her slots with these, the ones the simulation plays (§5.7's campaign picks):

| Class | Tier 1 | Tier 2 adds | Tier 3 adds |
|---|---|---|---|
| Brawler | **Greatsword Bell** | Greatsword Orb | Main Arms Pendant |
| Mage | **Elemental Pendant** | Fire Orb | Onslaught Insignia |
| Spell Blade | **Lightning Twin Pendant** | Katana Orb | Onslaught Insignia |
| Summoner | **Arcane Pendant** | Dark Orb | Onslaught Insignia |
| Paladin | **Main Arms Pendant** | Greatsword Orb | Onslaught Insignia |
| Cleric | **Light Twin Pendant** | Light Orb | Onslaught Insignia |

The Orb is her first slot's kind (CP11 kept). With the Halo on the same kind, the kind cap ([§5.6](#56-the-kind-cap-wp24))
makes a Pendant on that kind add nothing: the Brawler's Tier 3 Pendant still pays on her Axe and Lance.

### 5.9 MP after the MP accessories

- **What goes:** the Spring (10 MP a round) and the Siphon (8% of magical damage) on the balance party's Mage, Summoner
  and Cleric. Today a region on Auto ends with 4–10% of its MP through Lv 35 and 26–31% at Lv 45–50
  ([tier2-world §7](../tier2-world.md)); without them the magical classes end it drier.
- **What comes:** armor's legs at +3 a grade (+30 at G10, +10 over today's), the template's MP twists (U9: Opening, Even
  pace, Second wind), and the Bell, which makes her free Attack worth taking when the bar is empty.
- **What the simulation checks:** the Springs test (README §9.5 item 5) with no MP accessory: a region on Auto still
  clears 10–12 of 12 stages in a row, as today. If not, the knob is legs' MP a grade (+3 → +4), then the Flourish's
  twists; never an MP accessory.

## 6. Crafting and materials

### 6.1 What is made (WP26)

| Item | Made at (profession) | Grades | Raises | Per Uma: Tier 1 · 2 · 3 |
|---|---|---|---|---|
| **Weapon Gem** | Forge (Weapon Crafting) | G1–G10 (no G5 from Tier 2) | One weapon one grade | 30 · 27 · 27 |
| **Branch Gem** | Forge | G5, Tiers 2 and 3 | A weapon's G5 step: its branch, picked when used | — · 3 · 3 |
| **Armor Fittings** | Armorer (Armor Crafting) | G1–G10 | One armor slot one grade, either half | 50 · 50 · 50 |
| **Accessory Setting** | Charm Shop (Accessory Crafting) | G1–G10 | One accessory slot one grade, any type | 10 · 20 · 30 |

- **One Branch Gem, not one gem per branch** (WP10): the crafter only decides how many, as with Moon Jewels (ES7); the
  branch (and a second kind) is picked at the G5 step. The first round's five fork gems (Dual, Pure, Prism, Tempered,
  Keen) become one product line, and the Prism Gem retires with Prism.
- **Gates:** grade g made at Craft Lv 5g − 4 and worn at Uma Lv 5g − 4; a Branch Gem is grade 5 (Craft Lv 21).
- **Every tier makes its own,** from its own world's materials (one Warehouse a world).

### 6.2 Every recipe, by grade and tier

Material names are [professions.md](professions.md)' (§0.3, §5.2), every one an existing item id and icon: the **low**
type of a pair goes into grades 1–5, the **high** into 6–10. These are the interface as briefed (professions.md's fixed
sets); **profession-progression.md owns the final recipes, materials and amounts** ([§6.4](#64-the-interface-for-profession-progression)).

**Tier 1:**

| Item | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Weapon Gem** (4) | 2 Copper Ingot, 2 Pine Plank | ← | ← | ← | ← | 2 Iron Ingot, 2 Oak Plank | ← | ← | ← | ← |
| **Armor Fittings** (2 · 3) | 1 Linen, 1 Shell Carving | ← | ← | ← | ← | 1 Iron Ingot, 1 Oak Plank, 1 Cut Garnet | ← | ← | ← | ← |
| **Accessory Setting** (12) | 6 Linen, 6 Shell Carving | ← | ← | ← | ← | 6 Cotton Cloth, 6 Ammonite Carving | ← | ← | ← | ← |

**Tier 2:** base items keep Tier 1's recipes (professions' rule: the tier's new pair goes into the tier's new pieces
only); the Setting resizes to 6 for two slots; the Branch Gem joins at G5.

| Item | G1–G4 | G5 | G6–G10 |
|---|---|---|---|
| **Weapon Gem** (4) | 2 Copper Ingot, 2 Pine Plank | — (the Branch Gem) | 2 Iron Ingot, 2 Oak Plank |
| **Branch Gem** (9) | — | 2 Copper Ingot, 2 Pine Plank, **1 Silver Ingot, 1 Cedar Plank, 1 Wool Cloth, 1 Trilobite Carving, 1 Cut Sapphire** | — |
| **Armor Fittings** (2 · 3) | 1 Linen, 1 Shell Carving (G1–G5) | ← | 1 Iron Ingot, 1 Oak Plank, 1 Cut Garnet |
| **Accessory Setting** (6) | 3 Linen, 3 Shell Carving (G1–G5) | ← | 3 Cotton Cloth, 3 Ammonite Carving |

**Tier 3:** as Tier 2; the Setting is 4 for three slots; the Branch Gem takes the Tier 3 pairs' low types.

| Item | G1–G4 | G5 | G6–G10 |
|---|---|---|---|
| **Weapon Gem** (4) | 2 Copper Ingot, 2 Pine Plank | — | 2 Iron Ingot, 2 Oak Plank |
| **Branch Gem** (9) | — | 2 Copper Ingot, 2 Pine Plank, **1 Titanium Ingot, 1 Ebony Plank, 1 Moonsilk, 1 Aether Infusion, 1 Cut Starstone** | — |
| **Armor Fittings** (2 · 3) | 1 Linen, 1 Shell Carving (G1–G5) | ← | 1 Iron Ingot, 1 Oak Plank, 1 Cut Garnet |
| **Accessory Setting** (4) | 2 Linen, 2 Shell Carving (G1–G5) | ← | 2 Cotton Cloth, 2 Ammonite Carving |

**Easy to say:** weapons are ingots and planks; light armor cloth and shell, heavy armor iron, oak and a garnet;
settings cloth and shell; a Branch Gem a G5 Weapon Gem and one of each of the tier's new materials.

### 6.3 One Uma's totals per tier

**Pieces and refined items, one Uma, one class, fully geared:**

| Item | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Weapon Gems | 30 · 120 | 27 · 108 | 27 · 108 |
| Branch Gems | — | 3 · 27 | 3 · 27 |
| Armor Fittings | 50 · 125 | 50 · 125 | 50 · 125 |
| Accessory Settings | 10 · 120 | 20 · 120 | 30 · 120 |
| **Gear** | **90 · 365** | **100 · 380** | **110 · 380** |
| Jewels (extra-stats-progression's: Planet, Moon, Halo) | 25 · 120 | 29 · 130 | 33 · 140 |
| **One Uma** | **115 · 485** | **129 · 510** | **143 · 520** |
| + her moon (2 Moon Jewels) | 8 → 493 | 8 → 518 | 8 → 528 |

**Gear by material** (refined; a raw item each):

| Material (profession) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Copper Ingot (Mining) | 30 | 30 | 30 |
| Iron Ingot (Mining) | 55 | 55 | 55 |
| Pine Plank (Wood Chopping) | 30 | 30 | 30 |
| Oak Plank (Wood Chopping) | 55 | 55 | 55 |
| Linen (Farming) | 55 | 55 | 55 |
| Cotton Cloth (Farming) | 30 | 30 | 30 |
| Shell Carving (Fishing) | 55 | 55 | 55 |
| Ammonite Carving (Fishing) | 30 | 30 | 30 |
| Cut Garnet (Hunting) | 25 | 25 | 25 |
| The tier's pair, low types: one each of five | — | 3 each (Silver, Cedar, Wool, Trilobite, Sapphire) | 3 each (Titanium, Ebony, Moonsilk, Aether, Starstone) |
| **Gear in all** | **365** | **380** | **380** |

**By profession** (gear · with the jewels): Tier 1 Mining 85 · 105, Wood Chopping 85 · 95, Farming 85 · 95, Fishing
85 · 95, Hunting 25 · 95. Tiers 2 and 3: 88 each for the first four and 28 for Hunting, before the jewels. Hunting's
stones go mostly to jewels, so its trade carries the Lapidary's work, as professions.md drew.

- **Unchanged from the cross-reference** (XR1, README §2.3): the counts (30 · 50 · 10 and 27 + 3 · 50 · 20 · 30) and
  sizes are the same, so the Uma's totals hold at 485 · 510 · 520 and 822 · 864 · 881 hours (835 · 878 · 895 with her
  moon). Nothing in the redesign (armor's values, the families) changes what she crafts.
- **Outside the totals:** a second class's unraised weapons (up to 120 refined in Tier 1, 135 from Tier 2); a re-forge,
  one Branch Gem (9).

### 6.4 The interface for profession-progression

profession-progression.md, written in parallel, owns supply, places and amounts; **it reads this table** and may resize
any row. If it does, the **pieces** (what she needs) stay and the **refined per piece** moves, and the Uma's total stays
within PR10's tenth more a tier.

| Item id (draft) | Tier | Grades | Pieces a Uma | Refined each | Low band (G1–G5) | High band (G6–G10) |
|---|---|---|---|---|---|---|
| `weapon-gem-g{1–10}` | 1 | 1–10 | 30 | 4 | 2 `copper-ingot`, 2 `pine-plank` | 2 `iron-ingot`, 2 `oak-plank` |
| `weapon-gem-g{1–4, 6–10}` | 2, 3 | not 5 | 27 | 4 | as Tier 1 | as Tier 1 |
| `branch-gem` | 2 | 5 | 3 | 9 | 2 `copper-ingot`, 2 `pine-plank`, 1 each `silver-ingot`, `cedar-plank`, `wool-cloth`, `trilobite-carving`, `cut-sapphire` | — |
| `branch-gem` | 3 | 5 | 3 | 9 | 2 `copper-ingot`, 2 `pine-plank`, 1 each `titanium-ingot`, `ebony-plank`, `moonsilk`, `aether-infusion`, `cut-starstone` | — |
| `armor-fittings-g{1–10}` | 1–3 | 1–10 | 50 | 2 · 3 | 1 `linen`, 1 `shell-carving` | 1 `iron-ingot`, 1 `oak-plank`, 1 `cut-garnet` |
| `accessory-setting-g{1–10}` | 1 | 1–10 | 10 | 12 | 6 `linen`, 6 `shell-carving` | 6 `cotton-cloth`, 6 `ammonite-carving` |
| `accessory-setting-g{1–10}` | 2 | 1–10 | 20 | 6 | 3 · 3 | 3 · 3 |
| `accessory-setting-g{1–10}` | 3 | 1–10 | 30 | 4 | 2 · 2 | 2 · 2 |

**Make time** stays professions' PR9: one gather's time per refined item in the piece (a Branch Gem 9 gathers).

**What this doc fixes and what it leaves to profession-progression.md:**

| This doc owns (stands whatever the recipes) | profession-progression.md owns (may replace the table above) |
|---|---|
| The four products and what each raises; **one Branch Gem item a tier**, the branch picked when it is used (WP10), not a Pure, Dual, Keen or Tempered Gem each | Which material types fill each grade, and how many refined a piece |
| Pieces per Uma: 30 · 50 · 10 (Tier 1); 27 + 3 · 50 · 20 (Tier 2); 27 + 3 · 50 · 30 (Tier 3); the grade gates | The tier's pairs (their names and ids) and where a tier's new pair enters (the G5 step only, as here, or a grade ladder) |
| The extra demand: a class switch, a re-forge (one Branch Gem) | Supply, places, slots, hours |

As drafted in parallel (2026-10-24), profession-progression.md already moves two things: a tier's new pair enters base
items at fixed grades (G5 and G10; in Tier 3 G4 and G9 take Tier 2's), and the branch gem is the G5 Weapon Gem in its
tier's metal and wood (4 refined, not 9), for 503 · 521 refined an Uma in Tiers 2 and 3. **Where the two differ, its
amounts and materials win;** this doc's pieces and its one Branch Gem stand.

## 7. What a Tier 1 player handles

| Per Uma, Tier 1 | Today | Proposed |
|---|---|---|
| Gear slots in a class | 12: 5 weapons, 5 armor, 2 accessories | **9:** 3, 5, 1 |
| Gear rank bars · currencies | 24 · Gear Marks, Weapon and Armor Manuals | **0 · none** |
| Items the stations make | 400 (40 types × 10 grades) | **30:** 3 lines × 10 grades |
| Items to max her loadout | 120 pieces, each bound in order | **90 upgrades:** 30 gems, 50 fittings, 10 settings |
| Weapon choices | A weapon per slot (four classes) | A weapon per slot; **no branch** |
| Armor choices | A half × 5 slots | **None:** her class's half |
| Accessory choices | An Orb's kind (10) and a support (10): 100 pairs | **One of 19:** 9 Pendants, 10 Bells; the sheet lists first the 6–8 that touch her three weapons |
| Rules to learn | Binding for good, in-order binding, rank gates, Training pieces, typed slots, locker vs stock, ten support effects | **One:** an item raises a slot one grade, up to Lv 5g − 4; and "a Bell needs its weapon in her slots" |

## 8. Screens

- **The Gear tab:** three weapon rows (kind, branch, grade, Might, weak multiplier: "Dual Axe + Katana · G7 · Might 63 ·
  weak ×1.3"), five armor slots (half, grade, the slot's stat), one to three accessory rows (family, member, grade, what
  it adds: "Greatsword Bell · G6 · her Attack, then her Greatsword at 0.6"). Each row has its Upgrade pill.
- **The weapon sheet** draws its own branch line (the viewer's tree, one kind) with the next step and its item; at G4 in
  Tier 2 the G5 step offers Pure or Dual and the four second kinds, each with what it answers ("+ Katana: the Dark
  twins and Twilight; Tier 2 Katana-weak regulars").
- **The accessory sheet** lists her tier's families, one of each at most, the members touching her weapons first, each
  with its value at her grade; a capped kind reads "(capped)".
- **The targets planner** (D100) lists every grade above her current one on her class's three weapons, five slots and
  accessory slots, a Branch Gem at G5 from Tier 2; an unchosen branch plans nothing until picked.
- **No new art** (lean assets): weapons and armor keep today's per-grade icons; Orbs keep their rows; Pendants draw the
  retired Charm row, Insignias the retired Ring row, Bells the five Talisman rows (Arms kinds) and the five Amulet rows
  (Tome kinds), each with its kind's chip. The item icons (Weapon Gem, Branch Gem, Armor Fittings, Accessory Setting)
  are the art request gear.md already listed, with one Branch Gem icon in place of five fork gems.

## 9. Provides

| To | What |
|---|---|
| **README §2** | The frame rows for gear: Might × tier; branches Pure, Dual, Keen, Tempered, no third; two-kind cap 0 · 1 · 2 (Brawler, Mage 1); armor at G10 HP +150, DEF +40, M.DEF +40, MP +30 × tier; accessories 1 · 2 · 3 untyped, one of each family (Pendants, Bells; Orbs; Insignias); gear 365 · 380 · 380. **Glossary:** "Orb · Support" → **"Pendant · Bell · Orb · Insignia: the four accessory families"**; "Gem" → **Weapon Gem and Branch Gem** (the fork gems and the Prism Gem retire); "Weapon branch" → **Pure, Dual (Tier 2), Keen, Tempered (Tier 3)**, "Specialized" retires; "Support" retires as a slot word |
| **class-progression.md** | **CP10's accessory row:** 1 · 2 · 3 slots, one of each family (Pendant or Bell; + Orb; + Insignia). **CP11's presets:** §5.8. **§3.3, §3.5, §6.1, §11:** branches are Pure or Dual (not "Specialized or a third"); a Dual's second kind is **of its own channel and counts in every class** (WR3; GE7's class check retires). **§9's sheets:** armor's new values (HP +50, DEF and M.DEF +20, MP +10 × tier). **CP8:** boss shields scale with their answers (draft 6 → 8 → 9). **Pass 3:** every group bonus reads a hit's own kind; a Pendant per group (§3.9) |
| **extra-stats-progression.md** | The kind cap (§5.6): Orbs, Pendants and the Halo together at most +68 × tier on one kind. Evasion on feet armor stays 1.2% a grade in every tier (a share). Armor now carries every defense, so the Guard and Vigor moons' values don't need to cover a support |
| **profession-progression.md** | §6.4's table: four products, their recipes by band and tier, pieces per Uma (30 · 50 · 10; 27 + 3 · 50 · 20; 27 + 3 · 50 · 30), refined 365 · 380 · 380; one Branch Gem line instead of five fork gems |
| **The world and the Rift** (balance) | The foes' offense budget holds with the new armor (§4.3); boss shields by answers (§3.6); the Tier 1 re-baseline plays the presets of §5.8 |
| **Uma Templates pass** | The affinity reads a hit's own kind (a Dual's second never earns it); no template piece in gear |
| **Screens** | §8: the Gear tab, the weapon and accessory sheets, the planner |

## 10. Assumes

| From | Assumed | If not |
|---|---|---|
| The owner (2026-10-24) | The weapon direction (research WR1–WR6), the accessory redesign, armor carrying defense, Prism dropped | — |
| class-progression.md | Three slots by channel (CP2); the defaults (CP3); foes' twins in Tier 1 and narrowing by rank (CP5, CP6); class skills cast through a weapon (CP34); the affinity (CP36); presets name the Orb of her first slot (CP11) | Coverage numbers (§3.6) re-run on the new defaults |
| class-progression pass 3 | Specializations as weapon-group focus over the four groups named in §3.9 | The four group Pendants follow the new groups |
| extra-stats-progression.md | The Halo: flat offense on one kind (+10 → +34 × tier), a second kind in Tier 3; Swiftness +3%, +6% evasion | The kind cap reads whatever the Halo gives |
| profession-progression.md | The material catalog per tier (professions.md §0.3), the low and high bands, PR9's make time | It resizes §6.4's rows; pieces stay |
| The simulation | Prices Pure against Dual (§3.7), the Bell's power and the Attack shares (§5.7), the defensive budget (§4.3), the Springs test without MP accessories (§5.9), boss shields with Duals (§3.6) | The fallbacks named in each |

## 11. Save impact

**For the refund** (the owner's lean: every raw material back, recrafted by hand; README §9.4).

**Save v26 (Tier 1, one migration, every world):**

| Save data | Today | After | Refund |
|---|---|---|---|
| `world.gear` (crafted pieces in stock: weapons, armor, Orbs, Talismans, Amulets) | Ids `<type>-g<grade>` | **Deleted** | Each piece's 2 refined items as their 2 raw items (today's ids), then converted by professions' table (PR14) |
| `uma.gear.locker`, `uma.gear.equipped` (bound pieces) | Her pieces | **Deleted;** every weapon kind, armor slot and her one accessory slot at G0 | The same, per piece |
| `uma.gear.kinds` (armor kind per slot) | Ten kinds | **Becomes each slot's half** (used from Tier 2 by the four between); Tier 1 shows her class's | — |
| Accessory slots `accessory-1` (Damage), `accessory-2` (Support) | Typed | **Replaced:** `accessories: [{ grade: 0, type }]`, one slot, its type her class's Tier 1 preset (§5.8) | As pieces |
| Accessory types | 10 Orbs, 5 Talismans, 5 Amulets | **The ten supports retire;** Orbs return in Tier 2; Pendants and Bells are new types | — |
| Forge jobs (`craft` rows) | Gear outputs | Finished outputs collected, then refunded as pieces; unfinished inputs returned | As Recall does |
| `uma.ranks.weapons`, `armors`, `accessories` | 24 tracks | **Deleted** | None: her Uma Level is the gate |
| `wallet.gearMarks` | Banked gear EXP | **Class Marks, one for one** | — |
| Exchange: Weapon and Armor Manuals | Spend Gear Marks | **Removed;** Class Manuals stay | — |
| The Warehouse | Gear stock | **New shelves:** Weapon Gems, Armor Fittings, Accessory Settings G1–G10 | — |
| Stored fights | Frozen inputs | **Unchanged:** v6–v15 replay on their own engines with today's gear | — |

**Volume:** a fully geared Lv 50 Uma holds 120 pieces: **240 raw items come back** against the 365 her new gear asks; with
her Star Gems' refund (about 232) about 472 against 485 (493 with her moon). The refund rebuilds her, by hand.

**Save v27 (Tier 2):** per weapon kind `{ grade, branch?: 'pure' | 'dual', second?: kind }`; a second accessory slot; Orb
types; the Warehouse's Branch Gem shelf. **Tier 3's save** (with Tier 3's version): `branch: 'keen' | 'tempered'`, a
Tempered's added kind; a third slot; Insignia types.

**Converted, not refunded:** items in stock and work in progress (professions' PR14). **Nothing in branches, Pendants,
Bells or Insignias needs a refund:** they are new.

## 12. Engine

| Change | Version | Kind |
|---|---|---|
| Armor's new values per slot (DEF, M.DEF +4 a grade; HP +15; MP +3), × tier | v16 | Data (`ARMOR_DEFENSE_PER_GRADE` becomes a slot table) |
| Might × tier, armor offense × tier, accessory values × tier (SB1) | v16 | Data; the foes' build budget moves to the same multiplier (README §2.5) |
| The ten supports retire: an input check refuses them in v16 fights | v16 | Validation; v6–v15 keep them |
| One accessory in Tier 1, a Pendant or a Bell | v16 | Validation |
| **Pendants:** flat offense on two or three kinds | v16 | **Data:** the v15 Orb path (`orbMight`) already takes a map of kinds |
| **Bells:** after an Attack, one hit of her weapon of its kind at 0.1 a grade × her hand; counts for weaknesses and locks; no gauge; once an act; the same or a random target | v16 | **Rule**; Auto weighs an Attack with its follow-up |
| Weapon branches: a weak multiplier per weapon in place of `BATTLE_WEAK`; a hit's second kind for weaknesses and locks | v17 | Rule |
| The two-kind cap; one accessory of each family; the second slot; Orbs return | v17 | Validation, data |
| The kind cap: flat kind offense from Orbs, Pendants and the Halo at most a G10 Might × tier | v17 | Rule |
| Keen (×1.7), Tempered (two kinds at ×1.5); Insignias (Onslaught: first act a wave; Slayer: sub-boss or boss rank); the third slot | Tier 3's version | Data on v17's rules; two rules |

## 13. Pacing

The time to level, the EXP and rewards per fight and the time to gear an Uma on curve keep today's order (README §2):

| | Today | After | How it holds |
|---|---|---|---|
| **Crafting to gear one Uma** | 120 pieces, 240 refined (472 with Star Gems) | 90 · 100 · 110 items, 365 · 380 · 380 refined (485 · 510 · 520 with jewels) | Professions' recipes (XR1), unchanged here |
| **When a grade is worn** | Rank g, about Lv 5g − 4 for a weapon used every fight | Lv 5g − 4 | The same gate, by level |
| **EXP per win** | Uma E, Class 2E, weapons 5E, armor E a kind, accessories E a kind | Uma E, Class 2E | Gear EXP fed only ranks and Gear Marks |
| **Weapon power on curve** | Might by grade | Might × tier | SB1: a weapon's share holds at every tier's Lv 50 |
| **Defense on curve** | Armor, Extra Stats, a support | Armor (one support's worth more), Extra Stats | A regular's hit 18.7% of her HP against today's 20%; the foes' offense budget unchanged (§4.3) |
| **Accessory damage on curve** | An Orb on her lead kind (−4% at Lv 1 to −16% at Lv 50 on that kind's hits) and a support | Tier 1: one Pendant or Bell (+7% or so of all her damage); Tier 2 + an Orb; Tier 3 + an Insignia | The Tier 1 re-baseline plays §5.8's presets; the difference from today's Orb goes through the foe budget, as the first round planned for the Orb alone |
| **MP** | The Spring and the Siphon on the balance party's casters | Legs +30 at G10, the template's twists, the Bell | The Springs test re-run (§5.9) |
| **Tier 2's toolbox** | Weapon arts (+6–10% of party damage) and sets, Z4's draft term | Branches, the Orb, the second slot | The simulation prices them in Z4's one term (XR15); Tier 3's in its own |
| **A newly slotted weapon** | Needs its rank | Any grade her level allows, if the stock has the gems | Class switching and the Rift's guided builds get cheaper |

## 14. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **WP1** Who owns what | **Weapons own which kinds and how hard a weak hit lands; classes and trees own shape; armor owns defense; accessories add damage only; nothing else adds a kind** (§2.1) | Weapon arts' shape effects (E1); kinds in trees | The owner's line (WR1); no two systems grow the same thing |
| **WP2** One model for every piece | She owns every weapon, armor slot and accessory slot at G0; one crafted item raises one a grade; the slot holds the grade, the type swaps freely (GE1 kept) | Crafted pieces for armor and accessories | One rule; class switches and half changes never lose a grade |
| **WP3** The gate | Grade g at Uma Lv 5g − 4; weapon, armor and accessory ranks retire with Gear Marks (to Class Marks) and gear Manuals (GE2 kept) | Ranks plus gems; no gate | Today's pace, 24 fewer bars |
| **WP4** SB1 | Flat values × 1, × 1.8, × 2.6 (Might, armor, Pendants, Orbs, the kind cap); shares unchanged (weak multipliers, evasion, a Bell's power, Insignias) | Flat Might in every tier (GE3) | The build's share holds at each tier's Lv 50 (README §2.5) |
| **WP5** Tier 1 weapons | A straight line G0 → G10, one kind, weak ×1.3 (GE5 kept) | A Tier 1 branch | The owner's: Tier 1 has none |
| **WP6** Tier 2's branch | At G5, **Pure** (weak ×1.5; renamed from "Specialized") or **Dual** (a second kind); **no third branch** | A third from the research's list (Break, lock, executioner, attunement, conversion, imbue) | Two directions on the kind axis; every third duplicates a tree's or class's job or trivializes (WR2) |
| **WP7** The second kind | **Of the weapon's own channel; coverage only** (weaknesses and locks, one chip a hit); every bonus reads the hit's own kind; counts in every class | GE7 (any kind, counted by class); twin only | The class keeps the channel split; a shared weapon reads the same everywhere; no bonus doubles (WR3) |
| **WP8** The two-kind cap | **Tier 2 one; Tier 3 two; the Brawler and the Mage one for good;** slotted kinds all different; a loadout rule | No count cap (2.69 answers); one in every tier | Breadth grows as weaknesses narrow, never past Tier 1; no Uma holds a channel (WR4) |
| **WP9** Tier 3 | Pure → **Keen** (×1.7) or **Tempered** (+ a kind, both ×1.5); Dual → **Tempered**; Base → Pure or Dual; a weak hit at most ×1.7 | A third kind (Prism, dropped); no Tier 3 step | Depth by multiplier is SB1-neutral (WR5) |
| **WP10** The Branch Gem | **One item a tier**, the branch (and second kind) picked when used; the first round's five fork gems become one line, the Prism Gem retires | A gem per branch (Pure, Dual, Keen, Tempered Gems) | The crafter decides only how many, as with Moon Jewels; one product line, one icon |
| **WP11** Re-forging, switching, promotion | Another Branch Gem changes a branch within its lineage or a second kind, the grade stays; a class switch costs only unraised weapons; branches carry, grades reset, used items return to the old world (GE13, GE14 kept) | Branches locked; free re-forging | A wrong pick costs one gem, not a tier; Pure keeps Tier 3's doors open |
| **WP12** The coverage check | A script beside CP4's: with best picks the default party's answers per regular stay at or under Tier 1's in every tier (2.47 · 2.0 · 2.34 with a Cleric; 2.66 · 2.0 · 2.33 with a Paladin); boss shields grow with their answers (draft 6 → 8 → 9); fallbacks named (§3.7) | Price by feel | One number makes "trivializes" measurable (WR6) |
| **WP13** Weapon groups | Every group, kind and template bonus reads **a hit's own kind**; Duals may bridge groups; a Pendant per group | Second kinds earn group bonuses | Compatible with any pass-3 version; no stacking through a second kind |
| **WP14** Armor's shape | Five slots, the slot holds the grade; **the half sets only the piece shown and its offense;** every defensive stat is the slot's; her class's half in Tier 1, per piece for the four between from Tier 2 | Halves that trade DEF for M.DEF; ten kinds of piece | Changing half never trades defense; one table to learn |
| **WP15** Armor's values | Per grade, Tier 1: **DEF +4, M.DEF +4, HP +15, MP +3**, evasion 1.2%, offense ⌈g ÷ 2⌉ a piece; × tier except evasion. **One support's worth moves in:** a regular's hit 20% → 18.7% of an on-curve Brawler's HP, every class 1.3–1.8 points better, every tier | Today's values (defense falls a support's worth); a full support on both channels (17%: the foes' budget would rise) | The defensive budget the foes expect holds with nothing to pick |
| **WP16** Sets | Stay dropped (GE10) | Weapon arts' E8, E9 | The rework's trigger |
| **WP17** Supports retire | **All ten Talismans and Amulets, in every tier:** the cuts, shields, returns, regen, lifesteal and both MP accessories | Keep a few; redesign MP regen smaller | The owner: defensive ones are never picked over damage; MP regen is always picked; a small MP regen is a dead pick |
| **WP18** Four families | **Pendants** (two or three kinds), **Bells** (a follow-up on her Attack), **Orbs** (one kind), **Insignias** (timing); damage only | Orbs alone; % damage on a kind (stacks with the affinity); Break or weak-hit accessories (weapons' and trees' jobs) | Each wins a different context (§5.7); none touches kinds, weaknesses or Breaks |
| **WP19** Slots and unlocks | Slots 1 · 2 · 3, **untyped, one accessory of each family**; Pendants and Bells in Tier 1, Orbs in Tier 2, Insignias in Tier 3 | Typed slots by tier (no family choice later); two of a family | The owner's "multi-element early, damage-focused later"; a family choice in every tier |
| **WP20** Pendants | Nine (four groups, five twin sets); **1.2 Orbs of offense spread over their kinds:** 0.4 an Orb each on three kinds (+14 at G10), 0.6 on two (+20); × tier | Pendants on all five of a channel; equal per-kind values | Breadth costs depth: left on all region long it beats an Orb, tuned it trails |
| **WP21** Bells | Ten, one a kind. On her Attack, **her weapon of its kind strikes once more at 0.1 a grade (1.0 at G10) × her hand**; one hit of that weapon; **its kind counts for weaknesses and locks; it must be a kind she holds**; no gauge; once an act | Any kind of her channel (adds a kind: 3.2 answers); a follow-up that can't chip (two meanings of weak); a kindless echo of the Attack | The owner's set; it adds hits and chips, never a kind; MP-starved fights and the Brawler's pick |
| **WP22** Orbs | Today's ten, **half a weapon's Might × tier**, from Tier 2 | Orbs in Tier 1 | The owner keeps them; focused damage comes later |
| **WP23** Insignias | **Onslaught** (her first act each wave +2% a grade, +20%) and **Slayer** (hits on sub-bosses and bosses +1.5% a grade, +15%), Tier 3 | No fourth family (Tier 3 would wear one of each, no choice); vs Broken (the Warlord's and trees' job) | Two contexts the others don't cover; a choice in Tier 3 |
| **WP24** The kind cap | **Flat offense on one kind from Orbs, Pendants and the Halo at most a G10 Might × tier** (+68, +122, +177) | No cap; one source a kind | X7's bound extended; the kind-focus stack stays bounded |
| **WP25** Presets | §5.8: Tier 1 Greatsword Bell (Brawler), Elemental Pendant (Mage), Lightning Twin, Arcane, Main Arms, Light Twin Pendants; Tier 2 + the Orb of her first slot; Tier 3 + Main Arms Pendant (Brawler) or the Onslaught Insignia | One family for every class | The model's campaign picks; the simulation plays them |
| **WP26** Products and recipes | **Weapon Gem, Branch Gem, Armor Fittings, Accessory Setting;** the pieces per Uma are this doc's (§6.3); the recipes are professions.md's by band (§6.2), the Branch Gem a G5 Weapon Gem + one of each of the tier's pairs' low types, 365 · 380 · 380 refined; **profession-progression.md owns the final recipes and amounts** (§6.4; its draft's tier ladder and 4-refined branch gem replace them where they differ) | Recipes per family; per-grade amounts that grow | One recipe a band, a fifth of the work a trade (PR8); nothing in the redesign changes what she crafts |
| **WP27** The save | v26 deletes every crafted piece and gear rank, refunds each piece's raw items, recalls Forge jobs, Gear Marks → Class Marks, the ten supports retire, one accessory slot at G0 with her preset's type; v27 branches and the second slot; Tier 3's with its version | Convert her best grade per track, no refund | The owner's lean: every raw item back, recrafted by hand (GE15) |
| **WP28** Names | "Grade" G0–G10 (GE16); **Pure, Dual, Keen, Tempered**; **Branch Gem**; **Pendant, Bell, Orb, Insignia**; Onslaught, Slayer | "Specialized"; Band, Chaser, Echo, Crest, Vanguard (taken: level bands, Pace chasers, the Rift's Echoes and crests, the Finals' vanguards) | One word, one meaning (README §2.4) |
| **WP29** Art | **No new art:** Pendants the retired Charm row, Insignias the retired Ring row, Bells the Talisman and Amulet rows with a kind chip, Orbs theirs; the item icons are gear.md's request with one Branch Gem icon | New rows for each family | Lean assets; every row already exists |
| **WP30** Engine | v16: armor values, SB1 data, supports retire, Pendants (data), Bells (rule); v17: branches, the second kind, caps, Orbs, the kind cap; Tier 3's: Keen, Tempered, Insignias | Bells in v17 | Tier 1's accessory must exist in Tier 1's engine |

## 15. The first round's calls, mapped

| Old | Now | | Old | Now |
|---|---|---|---|---|
| GE1 own at G0, an item a grade | WP2 (kept) | | GE9 armor | **WP14, WP15** (halves set offense only; new values) |
| GE2 the gate | WP3 (kept) | | GE10 sets dropped | WP16 (kept) |
| GE3 flat Might | **WP4** (× tier) | | GE11 Support, + Orb, + Support | **WP17–WP19** (supports retire; four families; untyped slots) |
| GE4 weapons carry kinds | WP1 (kept) | | GE12 what crafting makes | **WP10, WP26** (one Branch Gem) |
| GE5 Tier 1 a line | WP5 (kept) | | GE13 changing a form | WP11 (kept) |
| GE6 Dual or Pure | **WP6** (no third; Pure named) | | GE14 promotion | WP11 (kept) |
| GE7 the channel rule | **WP7** (own channel, every class) | | GE15 the save | WP27 (+ supports) |
| GE8 Prism, Tempered, Keen | **WP9** (Prism dropped) | | GE16 "grade" | WP28 (kept) |
| WR1 who owns what | WP1 | | WR4 the cap | WP8 |
| WR2 two branches | WP6 | | WR5 Tier 3 deepens | WP9 |
| WR3 own channel | WP7 | | WR6 the check | WP12 |

In bold, the calls the owner's 2026-10-23 and 2026-10-24 direction replaced.
