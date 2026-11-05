# Gear in Tiers 2 and 3: weapon types, armor, the accessory tree and what a grade costs

> **Status: round 2 (the owner's requirements), 2026-11-05. Nothing here is built.** One doc of [the Tier 2 and Tier 3
> set](README.md): calls **T2G1–T2G20** (round 1, each with a status in [§3.2](#32-round-1-t2g1t2g20)) and
> **T2G21–T2G46** (round 2, [§9](#9-decisions)). It answers **R2-6** (weapon types picked at Tier 2 promotion, then swapped)
> and **R2-7** (an accessory upgrading tree), bound by R2-2–R2-5 (sixteen Tier 2 classes, a keeper and an expander from each
> Tier 1 class), R2-9 (two materials a line; [professions](professions.md)' T2P29) and R2-11 (party value). It sits on
> **Tier 1 as built** (engine v21, save v36); the manual ([classes](../../game/classes.md#weapons),
> [combat](../../game/combat.md#damage), [materials](../../game/materials.md#gear)) is the game as it plays.
>
> **Numbers come from the live code** (`economy/grades.ts`, `economy/accessories.ts`, `rpg/campaign/weaknesses.ts`,
> `world/world.ts`), printed by throwaway tests that are not committed. **Coverage** is counted on the live weakness dealer
> over every region stage of each tier (2,400 stages: about 10,100 regulars, 200 sub-bosses and 220 bosses a tier).
> **The accessory forms' worth** is measured on the balance harness (`world/balance-party.ts`, Auto, both owner parties on
> curve at Tier 2's and Tier 3's Lv 50, every region stage at that level, 4 seeds): each form as the frozen stat, `flat`,
> Insignia value or hits-only bonus it would put into a fight; the four riders that need a new engine rule (Seeker, Onset,
> Finisher, Limit Orb) are estimated from her measured share of the matching damage, marked ≈. The sixteen classes are
> priced on their Tier 1 parents' profiles ([§6](#6-provides-and-assumes)).
>
> **Names checked:** every new name (Kindred Pendant, Kindred Charm, Seeker Orb, Finisher Insignia, Vow Pendant, Vow Charm,
> Limit Orb, Apex Insignia, and the single words Kindred, Seeker, Finisher, Vow, Apex) was matched, case-insensitive and
> exact, against every string of uma-platform's `content/release/data/*.json` (10 files, 18,227 strings): no match; none is
> a skill, Limit Break, status or place name in the game. No Uma, character, skill, race or support-card name appears.
>
> **Pages** (desktop, light and dark): [gear by tier](previews/gear-tiers.html) ·
> [weapon types: the Ascend sheet, partners, coverage](previews/gear-weapons.html) ·
> [the accessory tree and what each form wins](previews/gear-accessories.html) ·
> [presets for the sixteen](previews/gear-presets.html) · [armor and what a grade costs](previews/gear-costs.html).

## 1. At a glance

**What round 2 adds to gear:** her weapons' **types are picked on the Ascend sheet** with her Tier 2 class and swap freely
after; the two **pure expanders' weapons cross channels** on one stat; every accessory family grows a **five-form tree**, a
base and four riders opening as the slot's grade rises; **presets for sixteen classes**; and from Tier 2 every grade takes
its line's **two items**, so types and forms swap without touching the farm.

| | Tier 1 (as built) | Tier 2 | Tier 3 |
|---|---|---|---|
| **A weapon's type** | None: one kind, weak ×1.3 | **Pure** (×1.30 → ×1.50 by grade) or **Dual** (+ its partner) | **Keen** (×1.50 → ×1.70), **Tempered** or **Evolved** (two kinds, ×1.30 → ×1.50) |
| **When she picks it** | — | **On the Ascend sheet**, Suggested pre-set; **swapped freely** after (one tap) | Again at the Tier 3 Ascend, pre-filled |
| **What a grade takes** | Arms Gem or Tome Ink | + an **Arms Whetstone** or **Tome Reagent**: the type's strength | The same |
| **Two-kind weapons in her slots** | 0 | **1** | **1** |
| **Answers a regular**, classes' comps (T2C63), Suggested | 4.32 · 4.35 | **4.28 · 4.29** (C1, C2); 4.17–4.32 the expander comps | **4.32 · 4.29**; 4.14–4.38 |
| **Every kind in two hands** | No (five held once) | **Yes** in the Tier 1-like comps; the expander comps one to three kinds in one hand (all ten held) | The same |
| **The pure expanders' cross weapons** (classes' T2C54) | — | Spellfist: Greatsword, Axe, **Fire on ATK**; Battlemage: Fire, Thunder, **Greatsword on M.ATK** | The same |
| **Might at G10** (code) | 68 | 122 | 177 |
| **Armor at G10** (code) | HP +150, DEF +40, M.DEF +40, MP +30, evasion 12%, offense +25 | HP +270, DEF +72 … offense +45 | HP +390, DEF +104 … offense +65 |
| **Armor's path** | Her class's half | The same; **no path** (the Lining carries the × 1.8) | The same |
| **Accessory slots** | 3 | 3 | 3 |
| **Forms a family has** | 1 (the base) | **4**: the base, two riders from G1, one more at G5 | **5**: + one more at G5, every rider stepped |
| **The tree's riders** | — | Great · Twofold (Pendant, Charm); Great · Twofold (Orb); Great · Onset (Insignia); then **Kindred**, **Seeker**, **Finisher** | + **Vow**, **Limit Orb**, **Apex** |
| **Three slots add, Lv 50** (her best set · the preset) | 11–13% (D266) | **18–25% · 15–22%** | **19.5–27% · 17–24%** |
| **Forms that are someone's best** (32 cells a tier) | 4 of 4 | **9 of 9**, none over 8 cells | **11 of 11** measured (Vow on heals), none over 9 |
| **★ signature at Lv 50** (code) | +5 | +9 | +13 |
| **A rank, two Umas** | 30 refined a line | 30 a branch, ten branches (T2P39) | The same |

**The design in twelve lines:**
1. **A type is picked with her class, on the Ascend sheet,** Suggested pre-set (progression's T2W19); afterwards one tap
   swaps it, free: the owner's "weapons it's easier to swap around".
2. **The second item raises the type:** an Arms Gem buys a grade's Might, an Arms Whetstone its type's strength (+0.02 on
   its weak multiplier), whatever type it wears. So Pure climbs ×1.30 → ×1.50 over Tier 2 and swapping costs nothing.
3. **A type is her class's slot setting; a grade stays the weapon kind's** (D289): one Fire Tome at G7 serves the
   Archmage on M.ATK and the Spellfist on ATK.
4. **The partner table and one two-kind weapon carry from round 1.** Every comp answers a regular at or under Tier 1's;
   the Tier 1-like comps keep every kind in two hands; re-typing every stage adds 0.4, below Tier 1's free kind swaps.
5. **The pure expanders' cross weapon** (classes' Heavy twins: the Spellfist's Fire Tome on ATK, the Battlemage's
   Greatsword on M.ATK) takes its kind's grade and Might and its own channel's items; one grade serves every reader.
6. **Armor keeps her class's half and gets no Tier 2 path:** a second half would hand twelve classes a free slot and four
   nothing. Its Lining carries the tier step.
7. **Every accessory form is its family's base plus one rider;** the Setting raises the base, the Inlay the rider.
8. **The tree opens on rings:** two riders with a slot's first Tier 2 grade, a third at G5, and in Tier 3 a step on all of
   them and a fourth at G5. Forms are settings: one tap, free.
9. **Kindred is the support form:** her slot's +1 shared by the party, +0.2 ATK and M.ATK a grade on every Uma's hits; the
   party takes its strongest, never the sum. It is the supporters' and the healers' best for the party.
10. **Seeker, Finisher and Onset** read weak hits, wounded foes and her first act; **Vow, Limit Orb and Apex** (Tier 3) her
    heals, her Limit Breaks and bosses. Shapes stay Extra Stats'.
11. **Every form is someone's best and none over a quarter of the cells,** by her damage (D266) or by party value (R2-11).
12. **Presets for sixteen:** her stat twice and an Orb in each slot's best form for her role; the supporters bear Kindred,
    the keeper healers Vow.

## 2. Tier 1 as built

The baseline every number below extends. No redesign here; the manual owns it.

### 2.1 Weapons

[classes § Weapons](../../game/classes.md#weapons), [combat § Damage](../../game/combat.md#damage).

- **Ten kinds, five shapes, five twin sets** (D240, CV12–CV13): Heavy (Greatsword, Fire), Sweep (Axe, Ice), Scatter
  (Lance, Lightning), Double (Katana, Light), Volley (Bow, Dark). The Bow and the Katana together are Twilight.
- **Three slots by channel:** a Brawler three Arms, a Sorcerer three Tomes, the Arms hybrids and the Paladin two Arms
  and a Tome, the Tome hybrids and the Cleric two Tomes and an Arm. **Swaps within a channel are free**, and a class she
  hasn't set up holds its preset.
- **Grades per weapon kind** (D289: "grades are per weapon kind, with no class lock"): G0–G10, raised by an Arms Gem
  (10 Ingots) or Tome Ink (10 vegetable cuts) of the grade it reaches, at Uma Lv 5g − 4. A grade serves every class
  that slots the weapon. No Weapon Rank.
- **Might** (`MIGHT_BY_GRADE`, × tier by `tierScaled`) joins her offense on that weapon's hits:

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Opens at Uma Lv | 1 | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 |
| **Tier 1** | 1 | 4 | 8 | 12 | 19 | 26 | 35 | 45 | 57 | 68 |
| **Tier 2** (× 1.8) | 2 | 7 | 14 | 22 | 34 | 47 | 63 | 81 | 103 | 122 |
| **Tier 3** (× 2.6) | 3 | 10 | 21 | 31 | 49 | 68 | 91 | 117 | 148 | 177 |

- **A weak hit is ×1.3** (`BATTLE_WEAK`), once, when the hit's kind is on the foe's list. The stage sheet shows every
  foe's list before Fight, and a stage always meets the same foes.
- **Presets** (D263, `RPG_WEAPON_PRESETS`), the owner's two parties: **Party 1** Brawler (Greatsword, Axe, Lance),
  Sorcerer (Fire, Blizzard, Thunder), Arms Spellblade (Katana, Axe, Thunder), Tome Summoner (Dark, Blizzard, Bow),
  Paladin (Lance, Greatsword, Light); **Party 2** the Brawler, the Sorcerer, Tome Spellblade (Thunder, Blizzard,
  Katana), Arms Summoner (Bow, Axe, Dark), Cleric (Light, Fire, Lance). Each party holds all ten kinds, five of them once.

### 2.2 Weaknesses v2, as the gear meets them

[combat § Weaknesses](../../game/combat.md#weaknesses-shields-and-breaks), `rpg/campaign/weaknesses.ts` (D235).

- **Tier 1:** a regular is weak to 2 Arms + 2 elements; a sub-boss or a boss to 3.
- **Tiers 2 and 3, live today: every rank to 3.** A regular leans to the channel her weaker defense guards: strikers and
  guards 1 Arm + 2 elements, casters and skirmishers 2 Arms + 1 element.
- **Arms come off a shuffled deck, elements lead with the ring's answer;** the lists read no twin, so which kinds a party
  holds matters, not which twin sets.
- **Measured on the live dealer** (every region stage of a tier: 2,400 stages, about 10,100 regulars, 200 sub-bosses
  and 220 bosses): the owner's parties answer a Tier 1 regular with 4.32 · 4.35 members; a Tier 2 regular with **3.64 ·
  3.69** on today's code, since nothing widens her weapons yet.

### 2.3 Armor

[materials § Gear](../../game/materials.md#gear), `armorValues` in `economy/grades.ts`. Five slots, each G0–G10, raised by
Armor Fittings (3 Planks). A slot adds its stat and offense to ATK or M.ATK by her class's half (a Tier 0's a third a
slot to each slot's channel). Everything × tier except Speed:

| A grade, Tier 1 | Head DEF | Body HP | Legs MP | Arms M.DEF | Feet Speed | Offense a piece |
|---|---|---|---|---|---|---|
| Per grade | +4 | +15 | +3 | +4 | +2 (1.2% evasion) | ⌈g ÷ 2⌉ |

### 2.4 Accessories

[combat § Her accessory](../../game/combat.md#her-accessory-and-signature), `economy/accessories.ts` (D264, D266).

- **Three slots in every tier**, each its own grade (Accessory Setting, 5 Fillets) and family, repeats allowed; G0 does
  nothing. One tap on a row of a slot's list wears it; a fight keeps the forms it started with.
- **Four families, linear rows:** **Pendant** +1 ATK a grade, **Charm** +1 M.ATK a grade (the Bell's id, retired into
  it), **Orb** +2 a grade on one of her three weapons' kinds, **Insignia** +1% a grade on sub-bosses and bosses, slots
  added. × 1.8 and × 2.6 by tier, the Insignia flat.
- **The Pendant and the Charm are real stats:** a healer's mends and an inherited Limit Break read them; the Orb, the
  Insignia and the ★ never heal.
- **★ Her signature** (UT7): her knack's family worn at G1 or more gives ATK and M.ATK +0.1 a level × tier, at least 1,
  on her hits (`signatureBonus`): +5, +9 and +13 at Lv 50 in Tiers 1, 2 and 3.
- **The preset** wears her armor half's stat twice and an Orb on `presetKind`'s kind; her ★ family first unless her
  weapons can't use it (a Pendant on three Tomes, a Charm on three Arms).
- **What wins in Tier 1** (D266): three of her stat on the Brawler, the Sorcerer, the Paladin and the Tome Spellblade;
  Orbs on the hybrids whose damage leans on one kind and on the Cleric; Insignias on sub-bosses. No mix best in over half
  the cases; every family someone's best.

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Pendant, Charm: Tier 1 · 2 · 3 | 1 · 2 · 3 | 2 · 4 · 5 | 3 · 5 · 8 | 4 · 7 · 10 | 5 · 9 · 13 | 6 · 11 · 16 | 7 · 13 · 18 | 8 · 14 · 21 | 9 · 16 · 23 | **10 · 18 · 26** |
| Orb: Tier 1 · 2 · 3 | 2 · 4 · 5 | 4 · 7 · 10 | 6 · 11 · 16 | 8 · 14 · 21 | 10 · 18 · 26 | 12 · 22 · 31 | 14 · 25 · 36 | 16 · 29 · 42 | 18 · 32 · 47 | **20 · 36 · 52** |
| Insignia, every tier | 1% | 2% | 3% | 4% | 5% | 6% | 7% | 8% | 9% | **10%** |

### 2.5 What a rank costs

[materials § What a rank takes](../../game/materials.md#what-a-rank-takes) (D264, D273). One rank of everything on two
Umas, one on three Arms and one on three Tomes, is **30 refined items on each of the five lines**: 3 Arms Gems × 10
(Metal), 3 Tome Ink × 10 (Vegetables), 5 Armor Fittings × 3 × 2 (Wood), 3 Accessory Settings × 5 × 2 (Fish), 3 jewels ×
5 × 2 (Stone). 8.0 h at each of a line's three places at Craft Lv 25. A maxed Uma takes 300 + 150 + 150 + 75 + 75
refined (753 h), each trade 20%. One recipe a grade in every world (FL9), the same fifty pairs (FL8).

### 2.6 Where gear sits in the damage stack

Today's ten steps ([combat § Damage](../../game/combat.md#damage), `battleDamage`): **1** offense (ATK or M.ATK, which
carry armor's offense, the Pendants and the Charms; + the Might of her weapon of the hit's kind + her Orbs on that kind +
her ★) · **2** offense² ÷ (offense + defense) × power · **3** weak ×1.3 · **4** her Insignias ×(1 + 1% a grade, slots
added) on a sub-boss or a boss · **5** statuses · **6** specials · **7** the unbroken ×0.5 · **8** the ward · **9**
evasion · **10** rounding. The whole stack by tier is [balance.md](balance.md)'s (T2B).

## 3. The old calls

Two sets: weapon-progression's WP1–WP34 (approved as D193, carried in round 1) and round 1's own T2G1–T2G20. A call the
owner's requirements replace is **Superseded (R2-n)**.

### 3.1 weapon-progression.md (WP1–WP34)

**8 kept · 14 kept, changed · 9 superseded · 3 broken** (each broken call fixed by a round-1 call; round 2 supersedes WP11
and moves WP6, WP9, WP19 and WP22–WP23).

| Call | What it said (for Tiers 2 and 3) | Status | Why, and where it goes |
|---|---|---|---|
| **WP1** Who owns what | Weapons own kinds and the weak multiplier; trees shape; armor defense; accessories damage only | **Kept, changed** (D264, D266, R2-7) | Accessories hold two real stats (Pendant, Charm) that lift heals; round 2 adds one party reach (Kindred, T2G34) and one heal lean (Vow, T2G31); still no defensive form (WP17) |
| **WP2** One model for every piece | Own every slot at G0; one item raises one grade | **Kept** | Live since R2 (D218), every tier |
| **WP3** The gate | Grade g at Uma Lv 5g − 4 | **Kept** | Live; the accessory rings open on it (G1 and G5: Lv 1 and 21) |
| **WP4** SB1 | Flat × 1 · 1.8 · 2.6; shares unchanged | **Kept, changed** (D264, D266) | Flat: Might, armor (not Speed), every Pendant, Charm and Orb form, Kindred, the ★. Shares: weak multipliers, evasion, every Insignia form |
| **WP5** Tier 1 weapons | One kind, ×1.3 | **Kept** | Live |
| **WP6** Tier 2's branch | At G5, Pure (×1.5) or Dual (its fixed partner) | **Kept, changed** (R2-6) | Pure and Dual stand as Tier 2's two **types**; the G5 step goes: picked on the Ascend sheet, swapped freely (T2G21, T2G22) |
| **WP7** The second kind | A partner of its own channel and the other group; coverage only; every bonus reads a hit's own kind | **Kept, changed** (D264) | Stands. "Every bonus on a kind" is the Orb forms and Extra Stats' kind rows (T2E); Seeker reads the hit's own kind and its weak flag, Limit Orb a Limit Break's hit (T2G32) |
| **WP8** The two-kind cap | Tier 2 one, Tier 3 two | **Broken** (D235) → round 1's T2G3 | One in every later tier (kept, §4.3) |
| **WP9** Tier 3 | Pure → Keen or Tempered; Dual → Tempered or Evolved | **Kept, changed** (R2-6) | Keen, Tempered and Evolved stand as Tier 3's types, picked at the Tier 3 Ascend and swapped freely; with free swaps the lineage (which Tier 2 type forks into which) no longer gates anything (T2G28) |
| **WP10** The Branch Gem | One item a tier | **Superseded** (D264) | Every line equal at 30 a rank; nothing is made for a type (T2G39) |
| **WP11** Re-forging, switching, promotion | A Branch Gem re-forges; branches carry, grades reset | **Superseded** (R2-6) | No re-forge: a type swaps free (T2G22). Promotion picks the types (T2G21); grades reset (D283) |
| **WP12** The coverage check | 48 signatures, twins weighted | **Broken** (D235, D240) → round 1's T2G2 | Re-derived on the live dealer; round 2 measures the sixteen classes' presets and the swapped comps (T2G27) |
| **WP13** Weapon groups | Ring and Light/Dark; every two-kind weapon bridges them | **Kept, changed** (D240, D264) | Groups are shapes (Ring = Heavy, Sweep, Scatter; Light/Dark = Double, Volley); every partner still crosses them |
| **WP14** Armor's shape | Five slots; per piece for the four between from Tier 2 | **Kept, changed** (D240, D264) | Her class's half in every tier, the per-piece choice retired (T2G8); the expanders' half is the stat they read for both channels (T2G29) |
| **WP15** Armor's values | DEF, M.DEF +4, HP +15, MP +3 a grade, evasion 1.2%, offense ⌈g ÷ 2⌉ | **Kept** | Live; §4.8 |
| **WP16** Sets | Stay dropped | **Kept** | No set bonus in the tree either |
| **WP17** Supports retire | All ten, every tier | **Kept** | No Barrier, regen, lifesteal or guard form returns; Vow only leans a stat to heals |
| **WP18** Four families, every tier | Base forms, two branches each from Tier 2 | **Kept, changed** (D264, R2-7) | Today's four (Pendant, Charm, Orb, Insignia), each now a five-form tree (T2G30) |
| **WP19** Slots and forms | 1 · 2 · 3 untyped slots; branches from a slot's G5 | **Superseded** (D264, R2-7) | Three slots every tier; the forms open on the tree's rings, G1 and G5 (T2G30) |
| **WP20** Pendants | Offense on her three kinds; Great Pendant, Channel Pendant | **Superseded** (D264, R2-7) | The Pendant is +ATK; its tree is Great, Twofold, Kindred, Vow (T2G31) |
| **WP21** Bells | A follow-up on her Attack | **Superseded** (D264 call 9) | Retired; its id reads Charm |
| **WP22** Orbs | Great Orb, Twin Orb | **Kept, changed** (D266, R2-7) | Great Orb and Twofold Orb (any two of her kinds), then Seeker and Limit Orb (T2G32) |
| **WP23** Insignias | Great Insignia, Onslaught | **Kept, changed** (D266, D261, R2-7) | Great Insignia and Onset (Triad Onslaught is a live Limit Break), then Finisher and Apex (T2G33) |
| **WP24** The kind cap | Flat on one kind ≤ a G10 Might × tier | **Kept, changed** (D264) | The Orb family only, Seeker's and Limit Orb's riders included (T2G37) |
| **WP25** Presets | Per class and tier, both branches | **Superseded** (D263, D266, R2-2) | Sixteen classes, D266's rule by role and ring (T2G36) |
| **WP26** Products and recipes | Weapon Gem, Branch Gem, Fittings, Setting | **Superseded** (D264, R2-9) | Arms Gem and Tome Ink 10, Fittings 3, Setting 5; from Tier 2 each takes its line's two materials (T2G40) |
| **WP27** The save | v27, v28 | **Superseded** (D218, D264) | §7 |
| **WP28** Names | Pure, Dual, Keen, Tempered, Evolved, partner; Branch Gem | **Kept, changed** (D261, D264) | The weapon words stand; new names in T2G42 |
| **WP29** Art | No new art | **Kept** | A type is a chip, a form its family's icon with a text chip (T2G43) |
| **WP30** Engine | v16, v17 | **Superseded** (D238) | §7 |
| **WP31** The damage stack | One order | **Kept, changed** (D264, D266, D282) | Today's ten steps; Tier 2's pieces in §4.11 |
| **WP32** The partner table | The owner's six, four authored | **Broken** (D240) → round 1's T2G1 | Kept (§4.3) |
| **WP33** The signature | Her knack's family, +0.2 a level × tier | **Kept, changed** (D264, D266) | 0.1 a level; any form of her family counts; from her first Tier 2 grade her Twofold form makes it pay on any weapons (T2G35) |
| **WP34** Accessory forms | A form is a setting, no item | **Kept** (R2-7) | The tree's forms are settings, one tap, free (T2G30) |

### 3.2 Round 1 (T2G1–T2G20)

**9 kept · 5 kept, changed · 6 superseded.**

| Call | Round 1 | Status | Now |
|---|---|---|---|
| **T2G1** The partner table | The owner's six Ring rows; Bow → Greatsword, Katana → Axe, Light → Ice, Dark → Fire; Tier 3 rows | **Kept** | §4.3 |
| **T2G2** The coverage check | A later tier answers a regular no more than Tier 1, every kind in two hands | **Kept** | Re-measured on the sixteen classes (T2G27) |
| **T2G3** Two-kind weapons | One in her slots, Tiers 2 and 3 | **Kept** | §4.3 |
| **T2G4** The branch item | The weapon's G5 Arms Gem or Tome Ink sets Pure or Dual; a re-forge is one more G5 item | **Superseded (R2-6)** | Types picked on the Ascend sheet (T2G21), swapped free (T2G22) |
| **T2G5** Whose branch | A branch belongs to the weapon kind | **Superseded (R2-6)** | A type is her class's slot setting; the grade stays the kind's (T2G23) |
| **T2G6** Suggested Duals | One a class, every kind in two hands | **Kept, changed** (R2-2) | Sixteen classes; the expanders' added (T2G26) |
| **T2G7** Weak multipliers | Base and Dual ×1.3, Pure, Tempered, Evolved ×1.5, Keen ×1.7 | **Kept** | §4.1, §5.1 |
| **T2G8** Armor by tier | Tier 1 × tier, her class's half | **Kept, changed** (R2-3) | The expanders' half (T2G29) |
| **T2G9** The accessory tree | A slot's G5 opens two branches a family | **Superseded (R2-7)** | The five-form tree, rings at a slot's G1 and G5 (T2G30) |
| **T2G10** Branch values | Great ×1.3, Twofold 1 + 1, Twofold Orb 1.4 × 2, Onset 1.5%; Tier 3 step | **Kept, changed** (R2-7) | Great and Twofold's values kept as base + rider, opened at G1; Twofold Orb and Onset re-priced as riders; the step from Tier 3's G1 (T2G31–T2G33) |
| **T2G11** Onset | Her first act each wave | **Kept** | T2G33 |
| **T2G12** ★ on any weapons | From a slot's G5 a Twofold form of her family | **Kept, changed** (R2-7) | From her first Tier 2 grade (T2G35) |
| **T2G13** Presets by tier | Great or Twofold by pure or hybrid | **Superseded (R2-2)** | Sixteen classes by role (T2G36) |
| **T2G14** The kind cap | Orb forms ≤ +68 · +122 · +177 | **Kept** | Seeker's and Limit Orb's riders inside it (T2G37) |
| **T2G15** One Insignia factor | Every Insignia slot whose condition holds adds into one | **Kept** | Finisher and Apex join it (T2G38) |
| **T2G16** What a rank costs | 30 a line, no new item | **Kept** | R2-9's second materials inside the 30 (T2G40) |
| **T2G17** Ascend | Grades reset; branches and forms carry | **Superseded (R2-6)** | Types re-picked at each promotion, preselected from her last; forms carry (T2G41) |
| **T2G18** Names | Great Charm, Twofold, Onset; retired Branch Gem and the rest | **Kept** | New names in T2G42 |
| **T2G19** Screens and art | Branch chip; rows from G5; no new art | **Superseded (R2-6, R2-7)** | The Ascend sheet's weapon step, type chips, the slot's tree (T2G43) |
| **T2G20** Save and engine | `branch`, `fork`, `form`, `kind2` | **Kept, changed** | `type` per class slot, the forms' ids (T2G44) |

## 4. Tier 2 in full

### 4.1 Weapon types: picked at promotion, swapped freely (T2G21–T2G24)

**The owner:** "I want for sure for them to be selected to their new weapon types on Tier 2 promotion, as weapons it's
easier to swap around."

- **On the Ascend sheet** ([progression](progression.md) T2W19): once she picks her Tier 2 class, her weapons step shows
  that class's three slots, each a weapon kind and its **Tier 2 type**, **Suggested** pre-set (§4.4). She may change any
  kind (any kind of the slot's channel, as today) and any type before Ascend; nothing is spent. She arrives with them at
  G0 (D283).
- **Afterwards a type swaps freely** (T2G22): on the Gear tab a weapon tile's sheet lists its types, and one tap wears
  one, outside fights, as a kind swap is free today. No item, no lock, no cooldown.
- **A type is her class's slot setting** (T2G23): each Tier 2 class she holds keeps its own three weapons and their types,
  as each class keeps its own weapons today. **The grade stays the kind's** (D289): a Fire Tome at G7 is G7 for the
  Archmage and the Spellfist alike, one Pure and one Dual if she likes.
- **Tier 2's two types** (T2G24; WP6 and T2G7's values): there is no plain Tier 1 weapon in a later tier, since Pure is the
  same weapon with harder weak hits.

| Type | Kinds on its hits | A weak hit at G0 → G10 | What the Whetstone or Reagent raises each grade |
|---|---|---|---|
| **Pure** | Its own | ×1.30 → **×1.50** | +0.02 on its weak hits |
| **Dual** | Its own + its **Tier 2 partner** (§4.2) | Its own kind ×1.30; its partner's ×1.10 → **×1.30** | +0.02 on its partner's weak hits |

- **The rule of the two items** ([professions](professions.md) T2P29): from Tier 2 every grade takes its line's two items
  of that grade. The **Arms Gem or Tome Ink** raises the weapon's **Might** (Tier 1's × 1.8, §2.1); the **Arms Whetstone
  or Tome Reagent** raises its **type**, whatever type it wears. So the strength is the grade's and the type is a choice:
  swapping costs nothing on the farm, and Tier 1's ×1.3 is where a Tier 2 weapon starts.
- **A partner** (WP7, kept): its hits carry both kinds for weaknesses and charged-move locks, one shield point and one
  lock a hit whichever kind matched, from G0; offense, Might, tree, shape and slot stay the weapon's own; every bonus on a
  kind (the Orb forms, Extra Stats' kind rows) reads the hit's own kind. A hit weak to both takes the larger multiplier.
- **One two-kind weapon in her slots** (T2G3, kept): she may own several Duals across her classes and swap; a slot that
  would make a second says why ("One two-kind weapon in her slots").

**Why free** (T2G22): the owner's words; a type has no grade of its own, so a cost would only tax trying. Tailoring is
already Tier 1's: with every kind graded, swapping kinds a stage lets Tier 1's Party 1 answer **5.00** of every regular's
five (measured below); free types let a Tier 2 party that re-types every stage reach 4.72, and the presets and Auto stay at
4.28. Nothing on the screens tailors for her: Suggested reads her class, never the stage.

### 4.2 The partner table, and one two-kind weapon (T2G1, T2G3: kept)

**Each weapon has two partners for life,** a Tier 2 one (a Dual's, a Tempered's) and a Tier 3 one (an Evolved's), both of
its own channel and of the other weapon group, so every two-kind weapon bridges Ring (Heavy, Sweep, Scatter) and
Light/Dark (Double, Volley).

| Weapon | Shape | **Tier 2 partner** | **Tier 3 partner** | Whose |
|---|---|---|---|---|
| Greatsword | Heavy | **Bow** | Katana | The owner's |
| Axe | Sweep | **Bow** | Katana | The owner's |
| Lance | Scatter | **Katana** | Bow | The owner's |
| Fire Tome | Heavy | **Dark** | Light | The owner's |
| Blizzard Tome | Sweep | **Light** | Dark | The owner's |
| Thunder Tome | Scatter | **Light** | Dark | The owner's |
| Bow | Volley | **Greatsword** | Lance | Round 1 (the twin sets on today's twins) |
| Katana | Double | **Axe** | Lance | Round 1 |
| Light Tome | Double | **Ice** | Lightning | Round 1 |
| Dark Tome | Volley | **Fire** | Lightning | Round 1 |

Round 1's reasons stand ([§3.2](#32-round-1-t2g1t2g20)): the owner's six by name; the authored four send a twin set into a
twin set on both channels; every preset keeps a legal Dual; every kind is someone's partner. **Why one two-kind weapon:**
with none capped the owner's parties answer 4.85 · 4.79 of a regular (Tier 3 4.98), a Brawler or a Sorcerer her whole
channel.

| Limit | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Two-kind weapons in her three slots | 0 | **1** | **1** |
| Kinds she holds, at most | 3 | 4 | 4 |
| A weak hit, at most (G10) | ×1.3 | ×1.5 | ×1.7 |
| Her slotted kinds | All different | All different, partners included | The same |

### 4.3 The expanders' cross-channel weapons (T2G25)

R2-3: the Brawler's expander (the owner's "Wild Magic Brawler", classes' **Spellfist**) wears magic weapons that "deal
damage based on ATK", and the Sorcerer's ("Blade wielding Sorcerer", the **Battlemage**) phys weapons on M.ATK. Her slots
and preset are [classes](classes.md)' (T2C33, T2C54); gear's part is what a cross weapon is:

| | Spellfist | Battlemage |
|---|---|---|
| **Slots** ([classes](classes.md) §4.1) | 2 Arms + 1 Tome, every hit on **ATK** | 2 Tomes + 1 Arm, every hit on **M.ATK** |
| **Preset** (T2C54) | Greatsword, Axe, **Fire Tome**: the Heavy twins, both on ATK | Fire, Thunder, **Greatsword**: the Heavy twins on M.ATK |
| **Which kinds** | Any Arm in her Arms slots, **any Tome** in her Tome slot | Any Tome, **any Arm** |
| **Might** | The kind's grade, joining **ATK** on that weapon's hits: a G10 Fire Tome is +122 in Tier 2 on her ATK | The kind's grade on **M.ATK**: a G10 Greatsword +122 on her M.ATK |
| **What raises it** | Its channel's items, as every Tome: Tome Ink and Tome Reagent (Vegetables) | Arms Gem and Arms Whetstone (Metal) |
| **Its type** | Pure or Dual like any weapon; the Fire Tome's partner is Dark | The Greatsword's partner is the Bow |
| **On the farm** | A 200 Metal + 100 Vegetables Uma, like the Arms hybrids | 100 + 200, like the Tome hybrids |

- **One grade, every reader** (D289): a weapon kind's grade gives its Might to whichever stat her class reads for that
  weapon's hits: the Archmage's Fire Tome adds to M.ATK, the Spellfist's to ATK. The Might row, the gate and the recipe
  don't change; only the stat it joins does. The damage sheet (D279) shows it on her ATK row ("Fire 412 (…)").
- **What it costs her alone:** a split kit answers fewer regulars than a full channel (72% of Tier 2's for either, against
  the Brawler's 76% and the Sorcerer's 81%), and her Dual gives most of it back: 87% and 80%. Her gain is the stat, not
  the coverage: one stat reaches both channels, so her armor, her Pendants or Charms and her Great forms lift every hit
  (§4.6, §4.7).
- **One cost of the Heavy twins** (measured, §4.5): with both pure expanders in a party, the Greatsword and Fire are held
  three times and the Lance and Blizzard once, and no Dual fills them; the party still answers 4.17 of a regular. **Gear's
  alternative for the cross-reference** (T2G25): the **Scatter twins** (Spellfist Greatsword, Axe, Thunder; Battlemage
  Fire, Blizzard, Lance) keep Tier 1's kinds in the party, answer 4.19 and keep every kind in two hands; of all 400 kits
  that keep the expander's lead, four do, and this pair answers most.

### 4.4 Suggested types for the sixteen (T2G26)

**The rule** (round 1's T2G6 on sixteen classes): her class's preset weapons ([classes](classes.md) T2C54); one two-kind
weapon, the Dual that leaves the fewest kinds in one hand across the owner's comps (all 64 keeper and expander mixes of his
two parties); the other two Pure. The keepers keep round 1's; a battle healer shares her keeper's weapons and types.

| Class | Weapons (lead first) | **Tier 2, Suggested** | **Tier 3, Suggested** (§5.1) |
|---|---|---|---|
| Berserker | Greatsword, Axe, Lance | **Dual Greatsword + Bow**, Pure Axe, Pure Lance | Tempered Greatsword + Bow, Keen, Keen |
| Spellfist | Greatsword, Axe, Fire (on ATK) | **Dual Greatsword + Bow**, Pure Axe, Pure Fire | Tempered Greatsword + Bow, Keen, Keen |
| Archmage | Fire, Blizzard, Thunder | **Dual Fire + Dark**, Pure, Pure | **Evolved Fire + Light**, Keen, Keen |
| Battlemage | Fire, Thunder, Greatsword (on M.ATK) | **Dual Fire + Dark**, Pure Thunder, Pure Greatsword | Tempered Fire + Dark, Keen, Keen |
| Blademaster | Katana, Axe, Thunder | Pure, Pure, **Dual Thunder + Light** | Keen, Keen, **Evolved Thunder + Dark** |
| Sentinel | Katana, Greatsword, Light | **Dual Katana + Axe**, Pure Greatsword, Pure Light | Tempered Katana + Axe, Keen, Keen |
| Runeblade | Thunder, Blizzard, Katana | **Dual Thunder + Light**, Pure, Pure | **Evolved Thunder + Dark**, Keen, Keen |
| Enchanter | Light, Blizzard, Katana | Pure Light, Pure Blizzard, **Dual Katana + Axe** | Keen, Keen, Tempered Katana + Axe |
| Warlord | Bow, Axe, Dark | **Dual Bow + Greatsword**, Pure, Pure | Tempered Bow + Greatsword, Keen, Keen |
| Druid | Bow, Greatsword, Dark | Pure Bow, Pure Greatsword, **Dual Dark + Fire** | Keen, Keen, **Evolved Dark + Lightning** |
| Invoker · Shaman | Dark, Blizzard, Bow | **Dual Dark + Fire**, Pure, Pure | Tempered Dark + Fire, Keen, Keen |
| Guardian · Templar | Lance, Greatsword, Light | **Dual Lance + Katana**, Pure, Pure | Tempered Lance + Katana, Keen, Keen |
| Bishop · Exorcist | Light, Fire, Lance | Pure, Pure, **Dual Lance + Katana** | Keen, Keen, Tempered Lance + Katana |

- **What it costs her alone:** a Suggested Dual answers 80–91% of Tier 2's regulars alone (none 68–81%); where another of
  her Duals answers more (the Battlemage's Thunder + Light 84%, the Exorcist's Light + Ice 86%), the party's two hands
  chose.
- **Pure buys +15% on its weak hits at G10** (×1.5 ÷ ×1.3); a Dual buys its partner's foes. Each is on the sheet with what
  it answers; any legal pick is fine, and she swaps freely after.

### 4.5 Coverage: weaknesses stay a puzzle (T2G27)

**The measure** (T2G2, kept): a party on its presets and Suggested types; for each foe the live dealer makes, how many
members hold a kind on her list (partners included), averaged over every region stage of the tier (2,400 stages: about
10,100 regulars, 200 sub-bosses, 220 bosses). **The bound:** a later tier's regulars answered no more than Tier 1's (4.32
· 4.35); every kind in two hands where the presets allow. The comps are [classes](classes.md)' (T2C63).

| Comp (T2C63) | Tier 2, no type | **Tier 2, Suggested**: a regular · sub-boss · boss | Kinds in one hand | **Tier 3, Suggested** | In one hand |
|---|---|---|---|---|---|
| **C1** Party 1's keepers (Berserker, Archmage, Blademaster, Invoker, Guardian) | 3.64 | **4.28** · 4.34 · 4.27 | **0** | **4.32** · 4.35 · 4.29 | 0 |
| **C2** Party 2's keepers (Berserker, Archmage, Runeblade, Warlord, Bishop) | 3.69 | **4.29** · 4.35 · 4.42 | **0** | **4.29** · 4.33 · 4.32 | 0 |
| **C3** both pures expanded (Spellfist, Battlemage + C1's three) | 3.51 | **4.17** · 4.08 · 4.16 | Lance, Blizzard | 4.14 · 4.03 · 4.10 | Lance, Blizzard, Light |
| **C4** Templar and Sentinel (Berserker, Archmage, Sentinel, Invoker, Templar) | 3.66 | **4.32** · 4.42 · 4.32 | Thunder | 4.38 · 4.48 · 4.35 | Thunder, Dark |
| **C4b** the same on Party 2 (Enchanter, Warlord, Exorcist) | 3.69 | **4.28** · 4.35 · 4.38 | Thunder | 4.32 · 4.34 · 4.31 | Thunder, Dark |
| **C5** a Summoner to support (Druid in C2) | 3.66 | **4.25** · 4.26 · 4.34 | Axe | 4.23 · 4.22 · 4.34 | Axe |
| **C6** both hybrids to support (Sentinel, Shaman in C1) | 3.66 | **4.32** · 4.42 · 4.32 | Thunder | 4.38 · 4.48 · 4.35 | Thunder, Dark |
| **C7** every member an expander | 3.54 | **4.21** · 4.16 · 4.22 | Lance, Blizzard, Thunder | 4.20 · 4.16 · 4.17 | Lance, Blizzard, Thunder |
| *C3 on gear's Scatter twins* (§4.3) | 3.51 | *4.19* · 4.24 · 4.10 | *0* | *4.19* · 4.20 · 4.09 | *0* |
| *C1, re-typed every stage (free)* | — | *4.72* | — | *4.82* | — |
| *C1, every legal two-kind weapon, no cap* | — | *4.85* | — | *4.98* | — |
| *Tier 1 (Party 1), every kind graded, kinds re-picked every stage* | *5.00* | — | — | — | — |

**What holds:** every comp answers a regular at or under Tier 1's 4.32–4.35 (4.17–4.32 in Tier 2). **Every kind in two
hands** holds for the Tier 1-like comps (C1, C2) in both tiers; the expander comps keep one to three kinds in one hand,
since classes' presets hold the Greatsword three or four times and one Dual each can't move the rest (a search over all
sixteen classes' Duals keeps two comps of eight whole at best). The kind is still held: classes' T2C54 keeps all ten in
every one of the 64 mixes. **What grows:** sub-bosses and bosses gain about 15% (3.71–3.77 → 4.03–4.48), so their
shields go up one from **Tier 2 Lv 1** (T2B7: sub-bosses 7, bosses 9), since the types come with the promotion, not a G5.
**What a diligent player adds:** re-typing every stage lifts a party about 0.4, below what Tier 1's free kind swaps
already allow with every kind graded.

### 4.6 Armor (T2G29)

**Tier 1's armor × 1.8, on her class's half, with no Tier 2 path** (code):

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Head DEF · Arms M.DEF | 7 | 14 | 22 | 29 | 36 | 43 | 50 | 58 | 65 | 72 |
| Body HP | 27 | 54 | 81 | 108 | 135 | 162 | 189 | 216 | 243 | 270 |
| Legs MP | 5 | 11 | 16 | 22 | 27 | 32 | 38 | 43 | 49 | 54 |
| Feet Speed (evasion) | 2 (1.2%) | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 (12%) |
| Offense a piece | 2 | 2 | 4 | 4 | 5 | 5 | 7 | 7 | 9 | 9 |

- **Her half, for the sixteen** (her parent's, classes' T2C36): ATK for the Berserker and the Spellfist (her Tome reads it
  too), the Blademaster, the Sentinel, the Warlord, the Druid, the Guardian and the Templar (their mends read it); M.ATK
  for the Archmage and the Battlemage, the Runeblade, the Enchanter, the Invoker, the Shaman, the Bishop and the Exorcist.
  A pure expander's armor reaches every hit she makes.
- **No Tier 2 path for armor.** Professions assumed a lining that adds each piece's offense to her other half too
  (T2P30). Measured on round 1's terms, a second half is +45 of her other stat at G10: about +5% damage for every hybrid
  and healer (the M.ATK half of three Twofold slots, 54, is worth 6.5% to the Arms Spellblade) and **nothing** for the
  four one-stat classes (the Berserker, the Spellfist, the Archmage, the Battlemage). That is a free accessory slot for twelve classes of sixteen,
  against R2-11; and round 1 measured that splitting a piece's offense never pays (−0.8 to −2.2% a piece).
- **So the Armor Lining carries armor's tier step** (professions' own fallback, T2P30): from Tier 2 a grade takes Armor
  Fittings and an Armor Lining; the Fittings raise Tier 1's values, the Lining the rest of the × 1.8 (and × 2.6). The
  Hides line keeps its 30 a rank; armor's numbers are exactly the table above.
- **Speed doesn't scale:** evasion stays 12% at G10 in every tier.

### 4.7 The accessory tree (T2G30–T2G35)

**The owner:** "Accessories I want to add some real complexity and have more of a upgrading tree for accessories, either
Dual ATK+MATK increase, multi-damage type increases, and so on."

#### The shape: a base and its riders (T2G30)

**Every form is its family's base plus one rider.** The base is the family's Tier 1 row × tier (Pendant +ATK, Charm
+M.ATK, Orb +2 on one of her kinds, Insignia +1% on sub-bosses and bosses); the **rider** is what the form adds and where.
From Tier 2 a slot's grade takes an Accessory Setting (the base) and an **Accessory Inlay** (the rider of whichever form
she wears, [professions](professions.md) T2P29). One form, **Kindred**, gives its whole row away to the party instead.

```text
             the base (Setting)           Tier 2, a slot's G1           Tier 2, a slot's G5          Tier 3, a slot's G5
Pendant ──── +1 ATK ──────────────────┬── Great Pendant  +0.3 ATK      ┌─ Kindred Pendant             ─ Vow Pendant
                                      └── Twofold Pendant +1 M.ATK ────┘  her +1 shared by the party:    +1 ATK on her mends,
                                                                         +0.2 ATK & M.ATK on every        Barriers, revives
                                                                         Uma's hits (herself too)        (off Great)
Charm ────── +1 M.ATK ────────────────    mirrored: Great Charm (+0.3 M.ATK), Twofold Charm (+1 ATK), Kindred Charm, Vow Charm
Orb ──────── +2 on one of her kinds ──┬── Great Orb      +0.6 on it    ┌─ Seeker Orb                  ─ Limit Orb
                                      └── Twofold Orb    +0.8 on a ────┘  +0.4 on any hit of hers        +1.3 on her Limit
                                                         second kind      that lands weak                 Breaks' hits (off Great)
Insignia ─── +1% on sub-bosses, bosses┬── Great Insignia +0.3% on them ┌─ Finisher Insignia           ─ Apex Insignia
                                      └── Onset Insignia +0.6% on her ─┘  +0.4% on foes below half HP    +0.8% on bosses
                                                         first act each wave                              (off Great)
                         a grade, × 1.8 in Tier 2 and × 2.6 in Tier 3 (flat values); Insignias' percentages the same in every tier
```

- **Rings by the slot's grade:** Tier 2's first ring (the Great form and its sibling) opens with her first Tier 2 grade
  (G1), the second (Kindred, Seeker, Finisher) at **G5**; Tier 3 adds its **step** on every rider from G1 and its third
  ring (Vow, Limit Orb, Apex) at **G5**. So every Inlay raises a worn rider from the first grade, and every tree is whole
  by a slot's G5 (Lv 21) in its tier.
- **A form is a setting** (WP34, kept): she wears any open form of a slot's family with one tap, outside fights, free;
  the slot's grade (both items) serves whichever she wears. Slots still take any family, repeats allowed. The bases stay
  on the list from Tier 2 as the tree's root, worn by no preset (a rider is free).
- **How the tree reads:** the first ring deepens (Great: more of the same) or widens (Twofold: the other stat, a second
  kind, a timing); the second ring reaches somewhere new (the party, weak hits, wounded foes); Tier 3 sharpens the Great
  side (heals, Limit Breaks, bosses).

| Rider | Reaches | Suits (§6's classes) | The owner's words |
|---|---|---|---|
| Great (Pendant, Charm) | More of her one stat | The one-stat classes: Berserker, Archmage, and the Spellfist and Battlemage (one stat reaches both their channels); the healers' mends | — |
| Twofold (Pendant, Charm) | Her other stat | The hybrids, keepers and supporters, and her ★ on any weapons | "Dual ATK+MATK increase" |
| **Kindred** | Every Uma's hits, both stats, hits only | **The supports** (Sentinel, Enchanter, Druid, Shaman) and any healer | "support a bit" (R2-3) |
| Vow (Tier 3) | Her mends, Barriers and revives | **The keeper healers** | — |
| Great Orb | More on her one kind | A class leaning on one kind (the Summoners' lead, the Paladin's Lance) | — |
| Twofold Orb | A second kind of hers | Two-kind spreads (the Summoners, the Arms Spellblade), **an expander's two channels** | "multi-damage type increases" |
| Seeker Orb | Any kind, when it lands weak | High-weak kits: the Sorcerer, the Spellblades, **the battle healers** | "and so on": a weakness |
| Limit Orb (Tier 3) | Her Limit Breaks | Hall-heavy fights, the healers on bosses | "and so on": the Halls |
| Great Insignia | Sub-bosses and bosses | Sub-boss fights | a rank of foe |
| Onset Insignia | Her first act each wave | Short fights and boss waves: the Spellblades, the Arms Summoner | "and so on": a timing |
| Finisher Insignia | Foes below half HP | Sub-bosses; **the battle healers** (they strike late) | "and so on": a foe's state |
| Apex Insignia (Tier 3) | Bosses | Boss fights | a rank of foe |

**By shape (AoE, multi-hit) is Extra Stats' axis** (T2G46; [extra stats](extra-stats.md), R2-8, the owner's own words there),
so no accessory reads a shape: two systems on one condition would stack too fast, and the Orb family already reads the
kinds, which are the shapes' halves.

#### Rows (a slot at G1 · G5 · G10, Tier 2)

| Form | Opens | Her stat | Her other stat | On a kind | Its condition |
|---|---|---|---|---|---|
| Pendant · Charm (the base) | Tier 1 | 2 · 9 · 18 | — | — | — |
| **Great Pendant · Charm** | G1 | 2 · 12 · **23** | — | — | — |
| **Twofold Pendant · Charm** | G1 | 2 · 9 · 18 | 2 · 9 · **18** | — | — |
| **Kindred Pendant · Charm** | G5 | — | — | — | **+2 · +4** ATK and M.ATK on every Uma's hits (G5 · G10) |
| Orb (the base) | Tier 1 | — | — | 4 · 18 · 36 | — |
| **Great Orb** | G1 | — | — | 5 · 23 · **47** | — |
| **Twofold Orb** | G1 | — | — | 4 · 18 · 36, and 1 · 7 · **14** on a second | — |
| **Seeker Orb** | G5 | — | — | 18 · 36 on her kind | +4 · **+7** on any weak hit |
| Insignia (the base) | Tier 1 | — | — | — | 1% · 5% · 10% on sub-bosses and bosses |
| **Great Insignia** | G1 | — | — | — | 1.3% · 6.5% · **13%** on them |
| **Onset Insignia** | G1 | — | — | — | the base, + 0.6% · 3% · **6%** on her first act each wave |
| **Finisher Insignia** | G5 | — | — | — | the base, + 2% · **4%** on foes below half HP |

Values are `tierScaled(rate × grade)`, as `accessorySlotValue` rounds today's rows; percentages in per mille, as
`INSIGNIA_SLOT_PERMILLE`. A Twofold Charm's "her stat" is M.ATK and its rider ATK.

#### Kindred: support from a slot (T2G34)

- **What it is:** her slot's whole +1 a grade, shared by the party's five: **+0.2 ATK and +0.2 M.ATK a grade on the hits
  of every Uma in her party, herself included** (+4 a slot at Tier 2's G10, +12 for three slots). On hits only, as her
  ★: never a mend, a Barrier or a stat.
- **The party takes its strongest Kindred, never the sum:** one Uma's slots add up, and the party's largest total is what
  every Uma takes. Two supporters don't stack, the owner's fear.
- **Frozen when the fight starts** (as the ★ is): a bearer who falls leaves it for the fight. No engine rule.
- **Measured** (§4.7's harness, three Kindreds, the healer's slots): **+3.2–3.3% to the party's damage a turn** (rounds
  −1.7 to −4.8%), the same whoever wears it. That is worth more than any self form to an Uma doing under about a sixth of the
  party's damage: both healers (their best self set gives the party +1.9–2.3%) and the supporters; it is worth less than
  the self forms to the damage dealers (+3.6–5.4%), so they never want it.
- **The exchange rate (R2-11):** a supporter who gives up her own forms for Kindred trades about her slots' damage for
  the same again spread over four others. For a supporter at three quarters of her keeper's damage, Kindred, Twofold and a
  Great Orb add 0.2–0.6 points of party damage over the keeper's set.

#### What each wins (measured, Tier 2 Lv 50)

**The measure** (D266's, round 1's): each class in her owner party on curve at Tier 2's Lv 50, her three slots at G10 in
one set, the others bare; her damage a turn against the same Uma with no accessory, on every region stage at that level
(40 fights, 20 sub-bosses, 20 bosses, 4 seeds). The mean weighs fights twice. Riders that freeze into a fight are
measured as stats, `flat`, the Insignia value or a hits-only bonus on every Uma; **Seeker, Onset and Finisher need a new
rule**, so they are her measured base plus the rider × her measured share of the matching damage (weak hits 35–74%,
first acts 34–55% in fights, wounded foes 29–66%), marked ≈. **Party value** (R2-11) is the party's damage a turn: a self
form's is her gain × her share of the party's damage, Kindred's measured. **Each row is a Tier 1 parent's profile** and
stands for her keeper and her expander (§6): the Brawler's row is the Berserker's and the Spellfist's, the hybrids' rows
their keepers' and (with a lower share) their supports', the healers' rows their keepers' and battle healers'.

| Class (party) | Regular fights | Sub-bosses | Bosses | **Mean** | Best for the party, if other | Preset (§4.8) |
|---|---|---|---|---|---|---|
| **Brawler** (1) | Great ×2 + Seeker ≈ 17.7% | Finisher ×3 ≈ 24.1% | Great ×3 19.9% | **Great ×3 19.0%** | — | 15.2% |
| **Sorcerer** (1) | Great ×3 20.1% | Great Insignia ×3 25.4% | Great ×3 19.9% | **Great ×3 20.5%** | — | 19.1% |
| **Arms Spellblade** (1) | Seeker ×3 ≈ 19.7% | Great Orb ×2 + Great Insignia 24.5% | Onset ×3 ≈ 18.1% | **Twofold ×3 19.1%** | — | 18.6% |
| **Tome Summoner** (1) | Twofold Orb ×3 26.4% | Great Orb ×2 + Great Insignia 25.4% | Great Orb ×2 + Great Insignia 22.8% | **Twofold Orb ×3 24.7%** | — | 20.8% |
| **Paladin** (1) | Seeker ×3 ≈ 25.6% | Finisher ×3 ≈ 27.6% | Seeker ×3 ≈ 27.1% | **Seeker ×3 ≈ 25.2%** | **Kindred ×3: +3.3% the party** (her best self set +2.3%) | 22.2% |
| **Tome Spellblade** (2) | Twofold ×2 + Seeker ≈ 21.0% | Finisher ×3 ≈ 23.4% | Twofold ×2 + Onset ≈ 17.8% | **Twofold + Great Orb ×2 18.4%** | — | 17.8% |
| **Arms Summoner** (2) | Twofold Orb ×3 22.6% | Finisher ×3 ≈ 20.1% | Onset ×3 ≈ 20.0% | **Twofold Orb ×3 20.1%** | — | 17.5% |
| **Cleric** (2) | Seeker ×3 ≈ 20.0% | Finisher ×3 ≈ 23.2% | Twofold + Great Orb ×2 23.8% | **Seeker ×3 ≈ 20.6%** | **Kindred ×3: +3.2% the party** (her best self set +1.9%) | 18.5% |

**What it shows (T2G45's check, D266's rule on 32 cells: eight classes × four columns, a form counted in each best
set):**
- **By her damage:** Seeker 8, Great 6, Twofold 5, Finisher 5, Great Orb 5, Twofold Orb 4, Great Insignia 4, Onset 3.
  **By party value:** Kindred 8, Great 6, Twofold Orb 4, Twofold 4, Great Insignia 4, Great Orb 4, Seeker 3, Finisher 3,
  Onset 3. **Every form is someone's best; none wins more than a quarter of the cells** (D266's bar is half).
- **Each family's riders split by who wears them:** Great for one stat, Twofold for two; the Great Orb and the Twofold
  Orb by how many kinds carry her; the Great Insignia on sub-bosses, Onset where first acts carry (the Spellblades' boss
  waves, the Arms Summoner), Finisher where she finishes (sub-bosses, the healers); Seeker where her hits land weak.
- **The rates were set on this measure** (T2G31–T2G33): Seeker at +0.6 took 17 of 32 cells and +0.3 one; Onset at its
  round-1 +1.5% on its own (no base) took the healers' cells; Kindred at +0.3 a grade (+5 a slot) took half the party
  cells. The estimated three are the simulation's to confirm with the rules built; each has a knob (§9).
- **Three slots add 18–25% of an Uma's damage with her best set** at Tier 2's Lv 50 (Tier 1's forms at that level 12–20%,
  D266's Tier 1 at Lv 50 11–13%); the presets 15–22%.

#### The rules around them (T2G35, T2G37, T2G38)

- **★ on any weapons (T2G35):** any form of her ★ family counts (a rider keeps its family). From her first Tier 2 grade a
  Twofold form of her ★ family gives both stats, so D266's exception ("unless her weapons can't use it") ends in Tier 2: a
  Brawler whose ★ is the Charm wears a Twofold Charm (+18 M.ATK, +18 ATK, her ★ +9) beside two Great Pendants.
- **The kind cap (T2G37):** the Orb family on one kind adds at most a G10 weapon's Might × tier, **+68 · +122 · +177**,
  counting every Orb base, the Great and Twofold Orbs and the Seeker's and Limit Orb's riders when they land. In Tier 2 it
  binds only three Great Orbs (+141 → +122) or two and another Orb base on the same kind; a player puts a Seeker's base on
  her second kind. Stats, Kindred and Extra Stats' kind rows (T2E6) sit outside.
- **One Insignia factor (T2G38):** every Insignia slot whose condition holds on a hit adds its percent into one factor,
  bases and riders alike: three Onsets on a boss's first act ×1.48; an Onset, a Finisher and a Great Insignia on a wounded
  boss's first act ×1.43.

### 4.8 Presets for the sixteen (T2G36)

**D266's rule extended:** her armor half's stat twice and an Orb, each slot in its best open form for her role; the ★ family
first (§4.7); the Great Orb on `presetKind`'s kind of the preset's weapons (her first weapon's, a Summoner's lead that
twins her lone weapon). A preset spends nothing and moves no grade; it sets her weapons' Suggested types (§4.4) too.

| Class | Tier 2, a slot G1–G4 | Tier 2, a slot G5 on | Tier 3, a slot G5 on |
|---|---|---|---|
| Berserker · Spellfist | Great Pendant, Great Pendant, Great Orb (Greatsword) | the same | the same |
| Archmage · Battlemage | Great Charm, Great Charm, Great Orb (Fire) | the same | the same |
| Blademaster | Twofold Pendant, Twofold Pendant, Great Orb (Katana) | the same | the same |
| **Sentinel** | Twofold Pendant ×2, Great Orb (Katana) | **Kindred Pendant**, Twofold Pendant, Great Orb | the same |
| Runeblade | Twofold Charm, Twofold Charm, Great Orb (Thunder) | the same | the same |
| **Enchanter** | Twofold Charm ×2, Great Orb (Light) | **Kindred Charm**, Twofold Charm, Great Orb | the same |
| Warlord | Twofold Pendant ×2, Great Orb (Bow) | the same | the same |
| **Druid** | Twofold Pendant ×2, Great Orb (Bow) | **Kindred Pendant**, Twofold Pendant, Great Orb | the same |
| Invoker | Twofold Charm ×2, Great Orb (Dark) | the same | the same |
| **Shaman** | Twofold Charm ×2, Great Orb (Dark) | **Kindred Charm**, Twofold Charm, Great Orb | the same |
| **Guardian** | Great Pendant ×2, Great Orb (Lance) | the same | **Vow Pendant**, Great Pendant, Great Orb |
| Templar | Great Pendant ×2, Great Orb (Lance) | the same | the same |
| **Bishop** | Great Charm ×2, Great Orb (Light) | the same | **Vow Charm**, Great Charm, Great Orb |
| Exorcist | Great Charm ×2, Great Orb (Light) | the same | the same |

- **Why these:** one stat for the classes that read one (an expander's one stat reaches both her channels; a healer's
  mends read it); Twofold for the two-stat hybrids; **the supporters bear Kindred** from G5, the role R2-3 gives them;
  **the keeper healers take Vow** in Tier 3, the battle healers keep Great (their best sets lean on Seeker and Finisher,
  which a preset, good everywhere and best nowhere (D266), doesn't chase).
- **Measured** (Tier 2 Lv 50, the table above): the presets add 15.2–22.2% against 18.4–25.2% for each class's best set,
  and 12–17% for Tier 1's set at the same level. The supporters' preset gives the party +0.2–0.6 points over the keeper's
  at three quarters of her damage (§4.7).

### 4.9 The damage stack in Tier 2

| Step | Tier 2 adds |
|---|---|
| 1 Offense | Might × 1.8; the stat forms in ATK and M.ATK (real stats: heals read them); the Orb forms on a hit's own kind, Seeker's rider on a weak hit, under the kind cap; Kindred and the ★ (hits only); Extra Stats' kind rows beside them, its Area and Multi-hit after the Insignias (T2E) |
| 3 Weak | **The weapon's type by grade:** Pure ×1.30 → ×1.50, a Dual's own kind ×1.30 and its partner's ×1.10 → ×1.30; a Limit Break ×1.3 |
| 4 Insignias | Bases and riders in one factor: sub-bosses and bosses, her first act, a wounded foe |

**The ceiling of one weak hit from gear** (before statuses): Tier 1 ×1.3 × ×1.30 = **×1.69**; Tier 2 Pure ×1.5 × three
Onsets on a boss's first act ×1.48 = **×2.22** (round 1's ×2.18); Tier 3 Keen ×1.7 × three Apexes ×1.54 = **×2.62** (§5.3).

### 4.10 What a grade costs (T2G39, T2G40)

**Types and forms cost nothing; every Tier 2 grade takes its line's two items** ([professions](professions.md) T2P29,
round 2's farm), so a rank stays 30 refined a branch and a type or a form swaps without touching the farm:

| Piece | The grade's first item (its base) | The grade's second item (its Tier 2 part) | Refined a grade |
|---|---|---|---|
| An Arms weapon | Arms Gem (10 Ingots): Might, Tier 1's × 1.8 | **Arms Whetstone** (10 Blocks): its type (§4.1) | 10 + 10 |
| A Tome (an expander's too) | Tome Ink (10 cuts): Might | **Tome Reagent** (10 dried herbs): its type | 10 + 10 |
| An armor slot | Armor Fittings (3 Planks): Tier 1's stat and offense | **Armor Lining** (3 leathers): the rest of the × 1.8 (§4.6) | 3 + 3 |
| An accessory slot | Accessory Setting (5 Fillets): its family's base row | **Accessory Inlay** (5 carvings): its form's rider (§4.7) | 5 + 5 |

| A rank, two Umas (3 Arms + 3 Tomes) | Metal · Rock | Vegetables · Herbs | Wood · Hides | Fish · Fossils |
|---|---|---|---|---|
| Refined | 30 · 30 | 30 · 30 | 30 · 30 | 30 · 30 |

- **A maxed Uma's gear** is 600 + 300 + 300 refined (weapons, armor, accessories), each line's two branches equal;
  professions owns the hours (T2P41).
- **A type, a form, a kind she swaps to:** nothing. A kind she has never raised is at G0 (a fourth or fifth kind, as
  today), so trying a new kind costs its grades; trying a type or a form never does.
- **Ascend** gives both items of every grade back to the old world's Warehouse (D283, T2P24).

### 4.11 Screens (T2G43)

- **The Ascend sheet's weapons step** (progression's T2W19 owns the sheet): three rows, a slot each, "Greatsword · Dual +
  Bow", the partner's glyph in its kind's colour, Suggested chips; the kinds she covers ("Covers 4 kinds").
- **The Gear tab's weapon tile** gains a type chip ("Pure", "Dual + Bow"); its sheet lists the slot's kinds, then the two
  types with what each answers, one tap each. The Upgrade row reads both items ("Arms Gem G6 · Whetstone G6").
- **An accessory tile's sheet** draws its family's tree: the base at the root, the riders opened by the slot's grade,
  greyed with their gate ("G5") until then, the worn one ringed; one tap wears a rider, as today's rows (D266). A Kindred
  tile adds "Party's strongest: yours" or "Party's strongest: the Shaman's".
- **The damage sheet** (D279) reads the same sources; "accessory" adds each rider's flat on that weapon's row (a Seeker's
  shows "on weak hits").
- **No new art** (lean assets): a type is a text chip and its partner's glyph; a rider is its family's icon with a chip.

## 5. Tier 3 in full

### 5.1 Weapon types (T2G28)

- **Picked again on the Tier 3 Ascend sheet,** pre-filled from her Tier 2 types (Pure → Keen, Dual → Tempered), Suggested
  per §4.4; swapped freely after, as in Tier 2. With free swaps the round-1 lineage (which Tier 2 branch forks into which)
  gates nothing, so all three are open to every weapon:

| Type | Kinds | A weak hit G0 → G10 | The Whetstone or Reagent each grade |
|---|---|---|---|
| **Keen** | Its own | ×1.50 → **×1.70** | +0.02 |
| **Tempered** | Its own + its **Tier 2** partner | ×1.30 → **×1.50** on both | +0.02 on both |
| **Evolved** | Its own + its **Tier 3** partner | ×1.30 → **×1.50** on both | +0.02 on both |

- **Each tier starts where the last ended:** Keen at G0 is Tier 2's G10 Pure; a Tempered partner at G0 is a G10 Dual's.
- **Still one two-kind weapon in her slots;** Might × 2.6; grades reset at Ascend (D283).
- **Coverage** (§4.5): the Suggested types answer 4.32 · 4.29 a regular with the keepers' weapons and 4.19 · 4.16 with
  both pures expanded, every kind in two hands; re-typed every stage 4.78–4.84.

### 5.2 Armor

Tier 1's × 2.6, her class's half, no path (the Lining carries the step): Head DEF · Arms M.DEF 10, 21, 31, 42, 52, 62,
73, 83, 94, **104**; Body HP 39, 78, 117, 156, 195, 234, 273, 312, 351, **390**; Legs MP 8, 16, 23, 31, 39, 47, 55, 62,
70, **78**; Feet Speed 2 a grade (12% at G10); offense a piece 3, 3, 5, 5, 8, 8, 10, 10, 13, **13**.

### 5.3 The accessory tree: the step and the third ring

**Every Tier 2 form is open from a slot's first Tier 3 grade with its step;** a slot's G5 opens Tier 3's ring, one rider
a family off its Great form. Forms carry through Ascend (XR5): a Tier 3 Uma came through Tier 2, so nothing is re-earned.

| Form (a slot at G1 · G5 · G10, Tier 3) | Its rider a grade (Tier 2 → Tier 3) | Her stat | Other | On a kind | Its condition |
|---|---|---|---|---|---|
| Great Pendant · Charm | 0.3 → **0.4** | 4 · 18 · **36** | — | — | — |
| Twofold Pendant · Charm | 1.0 → **1.1** | 3 · 13 · 26 | 3 · 14 · **29** | — | — |
| Kindred Pendant · Charm | 0.2 (no step: it already shares her whole slot) | — | — | — | +3 · **+5** on every Uma's hits (G5 · G10) |
| **Vow Pendant · Charm** (G5) | **+1.0 on her mends, Barriers, revives** | 13 · **26** (G5 · G10) | — | — | her heals read +13 · **+26** more |
| Great Orb | 0.6 → **0.8** | — | — | 7 · 36 · **73** | — |
| Twofold Orb | 0.8 → **1.0** on a second kind | — | — | 5 · 26 · 52, and 3 · 13 · **26** | — |
| Seeker Orb | 0.4 → **0.6** on her weak hits | — | — | 26 · 52 | +8 · **+16** on any weak hit |
| **Limit Orb** (G5) | **+1.3 on her Limit Breaks' hits** | — | — | 26 · 52 | +17 · **+34** on every Limit Break hit |
| Great Insignia | 0.3 → **0.4%** | — | — | — | 1.4% · 7% · **14%** on sub-bosses and bosses |
| Onset Insignia | 0.6 → **0.7%** | — | — | — | the base, + 0.7% · 3.5% · **7%** on her first act |
| Finisher Insignia | 0.4 → **0.6%** | — | — | — | the base, + 3% · **6%** on foes below half HP |
| **Apex Insignia** (G5) | **+0.8% on bosses** | — | — | — | the base, + 4% · **8%** on bosses |

**The step is each rider's Tier 3 row,** set on the measure below: about a third more on the Orb riders, a sixth on the
rest, Kindred none (at +0.25 it took half the party cells).

**Measured at Tier 3's Lv 50** (§4.7's measure, the step's values; Seeker, Onset, Finisher and Limit Orb estimated the same
way, ≈; Vow is a heal lean, priced on heals below):

| Class | Regular fights | Sub-bosses | Bosses | **Mean** | Best for the party, if other | Preset |
|---|---|---|---|---|---|---|
| Brawler | Great ×3 20.4% | Finisher ×3 ≈ 22.5% | Great ×2 + Apex 20.2% | **Great ×3 19.5%** | — | 17.2% |
| Sorcerer | Great ×2 + Seeker ≈ 22.4% | Great Insignia ×3 25.7% | Great ×2 + Seeker ≈ 22.3% | **Great ×3 22.0%** | — | 20.1% |
| Arms Spellblade | Twofold ×2 + Seeker ≈ 19.6% | Finisher ×3 ≈ 23.8% | Onset ×3 ≈ 20.2% | **Twofold ×2 + Seeker ≈ 19.6%** | — | 18.4% |
| Tome Summoner | Twofold Orb ×3 22.3% | Great Orb ×2 + Great Insignia 27.2% | Great Orb ×2 + Apex 24.5% | **Twofold Orb ×3 22.0%** | — | 19.2% |
| Paladin | Seeker ×3 ≈ 26.9% | Finisher ×3 ≈ 32.2% | Limit Orb ×3 ≈ 30.8% | **Limit Orb ×3 ≈ 27.0%** | Kindred ×3: +2.8% the party | 24.4% |
| Tome Spellblade | Twofold ×3 18.3% | Finisher ×3 ≈ 26.5% | Onset ×3 ≈ 19.8% | **Seeker ×3 ≈ 19.6%** | — | 18.1% |
| Arms Summoner | Twofold Orb ×3 23.5% | Great Orb ×2 + Great Insignia 27.4% | Great Orb ×2 + Apex 21.5% | **Twofold Orb ×3 23.3%** | — | 20.3% |
| Cleric | Seeker ×3 ≈ 23.3% | Finisher ×3 ≈ 28.3% | Limit Orb ×3 ≈ 26.1% | **Seeker ×3 ≈ 23.6%** | Kindred ×3: +3.5% the party | 20.2% |

- **Cells:** by her damage Seeker 8, Great 6, Finisher 5, Twofold Orb 4, Great Orb 4, Twofold 3, Great Insignia 3, Apex 3,
  Limit Orb 3, Onset 2; by party value Kindred 7, Great 6, Seeker 5, Twofold Orb 4, Finisher 4, Great Orb 4, Great
  Insignia 3, Apex 3, Twofold 2, Onset 2, Limit Orb 1. **Every form someone's best, none over 9 of 32.**
- **The third ring's niches:** Apex the boss fights of the one-kind leaners (with two Great Orbs) and the Brawler; Limit
  Orb the healers on bosses, where their Limit Breaks are 36–39% of their damage; Limit Orb's rider at +1.5 took 9 cells,
  at +1.2 one to three.
- **Vow (priced on heals):** at Tier 3's Lv 50 a Paladin's ATK is 451 before accessories; three Great Pendants (+108) lift
  her mends ×1.088 at T2C18's healing scale (÷ 780), three Vows (+78 on her hits, +156 read by her heals) ×1.127, for about
  seven tenths of the Great Pendants' damage. A keeper healer who heals first takes it; the battle healers don't.
- **Three slots add 19.5–27% with her best set** at Tier 3's Lv 50, the presets 17–24%.
- **The kind cap** is +177: three stepped Great Orbs (+219) cap there; a Limit Orb's rider and a Seeker's count when they
  land.

### 5.4 Presets and costs in Tier 3

- **Presets:** §4.8's table, the third column: the keeper healers' Vow from a slot's G5; the rest as Tier 2.
- **Costs:** as Tier 2 (§4.10): every grade takes its line's two items; types and forms nothing.

## 6. Provides and assumes

**How the sixteen classes are priced here.** [classes](classes.md) is writing them now; this doc assumes R2-2–R2-4's shape
and prices each on the Tier 1 class whose profile it keeps:

| Class (R2-2) | Assumed (classes.md owns) | Priced as |
|---|---|---|
| **Keepers** (Berserker, Archmage, Blademaster, Runeblade, Warlord, Invoker, Guardian, Bishop) | The parent's slots, hands, weapons and armor half; Momentum (the pures) or a sharpened kit | The parent, measured. Momentum multiplies her own hits, so it scales every self form alike and moves no ranking |
| **Spellfist · Battlemage** | 2 Arms + 1 Tome on ATK · 2 Tomes + 1 Arm on M.ATK; pure damage, ×1.05 hand (classes §4.1) | The Brawler and the Sorcerer: one stat for every hit, three kinds. Their Tome (Arm) on ATK (M.ATK) changes which kinds, not which stat; gear reads only the stat |
| **Sentinel · Enchanter · Druid · Shaman** | The parent's slots; supports with a lower hand (0.61 + 0.37 to 0.51 + 0.45), statuses, a Barrier or a mend | The parent's profile with her damage scaled down: her self forms' party value falls with her share, Kindred's doesn't (§4.7) |
| **Templar · Exorcist** | The parent's slots and weapons; ×0.6 hand, mends ×0.7; still the party's one healer | The Paladin and the Cleric (their weak, first-act and wounded shares are the healers': they strike late and finish) |

| To or from | Provides (this doc's) | Assumes (theirs) | If not |
|---|---|---|---|
| **[T2C](classes.md) classes** | Types per class slot (T2G23); Suggested types for sixteen (T2G26); the expanders' kits and their Might's stat (T2G25); armor's half (T2G29); presets' accessories (T2G36) | Sixteen classes as above; three slots by channel; one healer a party; a class switch is free and each class keeps its weapons | A different expander split (3 any channel) keeps every rule; its preset re-runs §4.5. A support class whose mend reads a stat takes that stat's Great or Vow form |
| **[T2E](extra-stats.md) extra stats** | Accessories read **stats, kinds and conditions** (rank, timing, weak hits, wounded foes, bosses, Limit Breaks); the kind cap binds the Orb family only (T2G37); Kindred is a hits-only bonus beside the ★ | **Shapes (AoE, multi-hit) are Extra Stats' axis** (R2-8, the owner's words there), so no accessory reads a shape; Extra Stats' percentages, if any, sit in their own factor | If T2E adds a weak-hit or wounded percentage, it joins T2G38's one Insignia factor or halves: two systems on one condition stack too fast |
| **[T2P](professions.md) professions** | Every Tier 2 grade takes both items (T2P29, aligned): Arms Whetstone and Tome Reagent raise a weapon's **type**; **Armor Lining carries armor's tier step** (armor has no path, T2G29: professions' fallback); Accessory Inlay raises the worn form's **rider**; no item a type or a form | Recipes 10 · 10 · 3 · 5 for both items; Craft Lv 5g − 4; Ascend gives both back | A path that needed its own item would come back against T2P39 |
| **[T2B](balance.md) balance** | Weak multipliers by type and grade (§4.1, §5.1); coverage by comp (§4.5); **the breadth gate is Tier 2 Lv 1** (types come with the promotion), so sub-boss and boss shields 7 · 9 from Tier 2 Lv 1; the riders' measured worth and estimates (§4.7, §5.3) for the simulation to confirm; Kindred's party value; the ceilings (§4.9) | Weaknesses v2's three kinds in Tiers 2 and 3 (live); Tier 2's foe term prices the toolbox; party value (R2-11) as this doc measures it (party damage a turn) | If the simulation finds a rider over half a class's cells, its knob in T2G31–T2G33 steps first |
| **[T2U](templates.md) templates** | Any form of her ★ family counts (a rider keeps its family); from Tier 2 a Twofold form makes every ★ family pay on any weapons (T2G35) | The ★ at 0.1 a level × tier | — |
| **[T2W](progression.md) progression** | The Ascend sheet's weapons step reads §4.4's Suggested types (T2W19, aligned); types re-picked each promotion, forms carry (T2G41); **every tree is open by a slot's G5** in Tier 2 and Tier 3, so Gear V (every slot G10) means every tree open (T2W's window assumption holds) | Ascend as D283 | — |

## 7. Save and engine

Rough, not packets: Tier 2's toolbox release (T2W15: engine v22, save v39).

| Change | Kind |
|---|---|
| Each class's slot gains `type?: 'pure' \| 'dual'` (Tier 2) or `'keen' \| 'tempered' \| 'evolved'` (Tier 3); the partner is the table's, never stored; a missing type reads the class's Suggested | Save |
| An accessory slot's `form` widens: Pendant and Charm `great \| twofold \| kindred \| vow`, Orb `great \| twofold \| seeker \| limit` (+ `kind2` for a Twofold Orb), Insignia `great \| onset \| finisher \| apex`; a form above the slot's ring reads its base until the grade opens it | Save |
| A Tier 2 raise spends both items (professions' T2P29) | Save, the Gear tab |
| A weapon's weak multiplier by type and grade in place of `BATTLE_WEAK`; a two-kind weapon's partner on its hits | **Engine** (`t2Gear`) |
| Great and Twofold riders, the Great Orb, the Twofold Orb, Great Insignia | **No engine:** frozen stats, `flat` and the Insignia value, as D264's slots |
| **Kindred:** the party's strongest, summed from one Uma's slots, added to every ally's hits-only bonus when the fight is built | **No engine:** frozen input beside the ★ (`signature`), validation widened |
| Vow: a heal-only stat | **Engine:** the mend's stat reads it |
| Onset, Finisher, Apex conditions; Seeker's and Limit Orb's flat on a weak or a Limit Break hit | **Engine:** five conditions at steps 1 and 4 |
| The kind cap over the Orb family; one Insignia factor | Where `flat` and the factor are summed |
| The one two-kind weapon rule; the forms' gates by tier | Validation |

## 8. Pacing

- **Types come with the promotion:** a Tier 2 weapon has its type from Lv 1, at Tier 1's ×1.3, growing +0.02 a grade to
  ×1.5 at Lv 46. Nothing waits on a G5.
- **The tree opens on the grade gate:** its first ring with a slot's first grade (Lv 1), its second at G5 (Lv 21); Tier
  3's step from Lv 1, its third ring at G5 (Lv 21). Every slot's tree is whole by Lv 21 of its tier.
- **Making time** is professions' (T2P41: every grade takes two items, so a tier's farm doubles; the fighting party holds
  G10 on day 23.4, Tier 1's 23.0).
- **Gear's damage by tier** (measured, §4.7 and §5.3): three slots add 11–13% of an Uma's damage in Tier 1 (D266); her
  best set at Tier 2's Lv 50 adds 18–25%, the preset 15–22%; at Tier 3's 19.5–27% and 17–24%. That rise is Tier 2's
  toolbox, priced in T2B's foe term.
- **Coverage doesn't speed fights:** answers stay at Tier 1's on the presets, and sub-boss and boss shields rise one with
  theirs.

## 9. Decisions

### 9.1 Round 2 (T2G21–T2G46)

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **T2G21** Types at promotion | **On the Ascend sheet her new class's three weapons and each one's type, Suggested pre-set (T2W19); she arrives at G0 with them, and a type works from G0** | The type at a weapon's G5 (round 1's T2G4); a type item | The owner: "selected to their new weapon types on Tier 2 promotion" |
| **T2G22** The swap rule | **Free: one tap on the Gear tab, outside fights; no item, lock or cooldown; nothing on screen tailors a stage** | A re-type item (one grade's Whetstone); a swap only at camps | The owner's "easier to swap around"; a type has no grade of its own; tailoring a stage gives 4.72 answers, under Tier 1's 5.00 with every kind graded |
| **T2G23** Whose type | **Her class's slot setting; the grade stays the weapon kind's (D289)** | A type on the kind (round 1's T2G5) | Each class keeps its own weapons; one grade serves every class, each with its own type |
| **T2G24** Tier 2's types | **Pure ×1.30 → ×1.50 and Dual (its own kind ×1.30, its partner ×1.10 → ×1.30), +0.02 a grade from the Whetstone or Reagent; no plain weapon** | Fixed ×1.5 from G0; the partner at ×1.3 from G0 | T2P29's second item raises the path at every grade; G10 is round 1's values, so every Lv 50 measure holds |
| **T2G25** The expanders' cross weapons | **Any kind of a slot's channel; a kind's grade gives its Might to the stat she reads (ATK for the Spellfist's Tome, M.ATK for the Battlemage's Arm); its own channel's items raise it; the kits are classes' (T2C54); gear's alternative for the cross-reference: the Scatter twins** | A cross weapon with its own grade; a cross weapon raised by her lead channel's items | One grade, every reader (D289); the Scatter twins keep every kind in two hands with both pures expanded (4.19), the Heavy twins don't (4.17) |
| **T2G26** Suggested types | **The table in §4.4 on classes' presets: one Dual a class, the rest Pure; the keepers round 1's; Spellfist Greatsword + Bow, Battlemage Fire + Dark, Sentinel and Enchanter Katana + Axe, Druid and Shaman Dark + Fire, the battle healers their keepers'; Tier 3 Evolved for the Archmage, the Spellblade keepers and the Druid, Tempered for the rest, Keen otherwise** | Each Uma's best alone | The fewest kinds in one hand over all 64 mixes of the owner's comps |
| **T2G27** Coverage | **Measured on classes' comps: Tier 2 4.17–4.32 a regular (C1, C2 4.28 · 4.29 with every kind in two hands; the expander comps one to three kinds in one hand), Tier 3 4.14–4.38; sub-boss and boss shields +1 from Tier 2 Lv 1** | — | A later tier's regulars answered no more than Tier 1's; the types come with the promotion, so the breadth gate is Lv 1 |
| **T2G28** Tier 3's types | **Keen ×1.50 → ×1.70, Tempered and Evolved ×1.30 → ×1.50 on both kinds; picked on the Tier 3 Ascend sheet, pre-filled (Pure → Keen, Dual → Tempered); swapped freely; no lineage** | Round 1's forks (Pure → Keen or Tempered) | With free swaps a lineage gates nothing; each tier starts where the last ended |
| **T2G29** Armor | **Tier 1's × tier on her class's half (an expander's one stat); no Tier 2 path; the Armor Lining carries the rest of the × tier** | A lining to her other half (T2P30's assumption) | A second half is +5% for twelve classes, nothing for four (R2-11); professions' own fallback keeps Hides at 30 |
| **T2G30** The tree's shape | **Every form its family's base plus one rider (Kindred its whole row); rings at a slot's G1 and G5 in Tier 2, the step from G1 and a ring at G5 in Tier 3; a form is a free setting, one tap** | Rings at G4 and G8; a form that costs an item to open; bases dropped | The Inlay raises the worn rider from the first grade (T2P29); every tree whole by G5; one tap stays one tap (D266) |
| **T2G31** The stat family | **Great +0.3 (Tier 3 0.4) on her stat; Twofold +1 (1.1) on her other stat; Kindred her +1 shared, +0.2 on every Uma (no step); Vow (Tier 3, G5) +1 on her mends, Barriers, revives** | Kindred +0.3 (half the party cells); a heal-only Great | Measured: each someone's best; Vow lifts a keeper healer's mends ×1.13 against Great's ×1.09 |
| **T2G32** The Orb family | **Great Orb +0.6 (0.8) on her kind; Twofold Orb +0.8 (1.0) on a second kind; Seeker +0.4 (0.6) on any weak hit; Limit Orb (Tier 3, G5) +1.3 on her Limit Breaks' hits** | Seeker +0.6 (17 of 32 cells) or +0.3 (one); Twofold Orb at 1.4 + 1.4 (round 1); a one-kind weak Orb (best nowhere) | Measured and estimated: each someone's best, Seeker the highest at 8 |
| **T2G33** The Insignia family | **Great Insignia +0.3% (0.4%); Onset +0.6% (0.7%) on her first act each wave; Finisher +0.4% (0.6%) on foes below half HP; Apex (Tier 3, G5) +0.8% on bosses** | Onset at round 1's 1.5% alone (the healers' cells); Apex +1% (lifts the ceiling) | Each someone's best; the ceilings stay near round 1's |
| **T2G34** Kindred's reach | **Every Uma's hits, herself included, both stats, never a heal; the party takes its strongest Kindred, never the sum; frozen when the fight starts** | Added across Umas; to allies only; a real stat | Two supporters don't stack (the owner's fear); no engine rule |
| **T2G35** ★ by tier | **Any form of her ★ family counts; from her first Tier 2 grade her family's Twofold pays on any weapons, so her ★ goes first for everyone** | D266's exception in every tier | The Twofold form makes the exception's reason go away |
| **T2G36** Presets for sixteen | **§4.8: Great ×2 + Great Orb for the one-stat classes and the healers; Twofold ×2 + Great Orb for the hybrids; the supporters Kindred, Twofold, Great Orb from a slot's G5; the keeper healers Vow, Great, Great Orb from Tier 3's G5; her ★ first** | Each class's best set (a preset per fight); Tier 1's set (12–17%) | D266's shape by role: 15–22% at Tier 2 Lv 50, best nowhere |
| **T2G37** The kind cap | **The Orb family on one kind (every base, the Great and Twofold Orbs, Seeker's and Limit Orb's riders when they land) at most +68 · +122 · +177** | No cap; the cap on stats too | Binds only stacked Great Orbs; stats, Kindred and Extra Stats' kind rows outside |
| **T2G38** One Insignia factor | **Every Insignia slot whose condition holds adds into one factor, bases and riders alike** | Each form its own factor | Today's "slots added"; bounded at three slots (×1.48 · ×1.54) |
| **T2G39** What types and forms cost | **Nothing; a kind never raised is at G0** | A re-type or re-form item | The grade is the cost; trying is free |
| **T2G40** The second items (R2-9) | **Aligned with T2P29: every Tier 2 grade takes its line's two items; the Whetstone or Reagent raises the weapon's type, the Lining armor's tier step, the Inlay the worn rider** | The second item only on dual choices (idles a branch on every Pure pick) | Every branch's demand equal (T2P39); every swap free |
| **T2G41** Ascend | **Grades reset and both items go home (D283); types re-picked at each promotion, pre-filled from her last; forms carry (Tier 2's open from Tier 3's G1)** | Types carry unasked (round 1's T2G17) | R2-6 picks at every promotion; nothing re-earned |
| **T2G42** Names | **New: Kindred Pendant, Kindred Charm, Seeker Orb, Finisher Insignia, Vow Pendant, Vow Charm, Limit Orb, Apex Insignia. Kept: Pure, Dual, Keen, Tempered, Evolved, partner, Great, Twofold, Onset. Checked: no master-data match** | "Honed" (a Tome Spellblade depth word); "Prism" (a master-data string) | One word, one meaning |
| **T2G43** Screens and art | **The Ascend sheet's weapons rows; a type chip and its partner's glyph on the weapon tile; the accessory sheet draws its family's tree; Kindred's tile names the party's strongest; no new art** | New icons a form | Lean assets; one tap stays one tap |
| **T2G44** Save and engine | **`type` per class slot; the forms' ids per family and `kind2`; Tier 2's engine stage for types by grade, partners, Vow, Seeker, Onset, Finisher, Limit Orb and Apex; Kindred and the rest frozen stats** | — | D264's pattern for slots |
| **T2G45** The viability check | **D266's rule on 32 cells a tier, by her damage and by party value; the estimated riders confirmed by the simulation with the rules built, each with its knob: Seeker +0.3, Onset +0.5%, Finisher +0.3%, Limit Orb +1.2, Apex +0.6%, Kindred +0.15** | Her damage alone (Kindred never counts) | R2-11's party value is how a support form is worth anything |
| **T2G46** No shapes on accessories | **AoE and multi-hit are Extra Stats' (R2-8); the accessory tree reads stats, kinds and conditions** | A Sweep or Volley Orb | Two systems on one condition stack too fast; kinds are the shapes' halves already |

### 9.2 Round 1's calls (T2G1–T2G20)

| Call | Round 1's recommendation | Status |
|---|---|---|
| T2G1 | The partner table | **Kept** |
| T2G2 | The coverage check | **Kept** (T2G27 re-measures it) |
| T2G3 | One two-kind weapon in her slots, Tiers 2 and 3 | **Kept** |
| T2G4 | The weapon's G5 item sets its branch; a re-forge is one more G5 item | **Superseded (R2-6)** by T2G21, T2G22 |
| T2G5 | A branch belongs to the weapon kind | **Superseded (R2-6)** by T2G23 |
| T2G6 | Suggested Duals | **Kept, changed** (R2-2): T2G26 |
| T2G7 | Weak multipliers ×1.3 · 1.5 · 1.7 | **Kept** (reached at G10, T2G24) |
| T2G8 | Armor Tier 1 × tier, her class's half | **Kept, changed** (R2-3): T2G29 |
| T2G9 | A slot's G5 opens two branches a family | **Superseded (R2-7)** by T2G30 |
| T2G10 | Branch values | **Kept, changed** (R2-7): T2G31–T2G33 |
| T2G11 | Onset: her first act each wave | **Kept** (its rider T2G33) |
| T2G12 | ★ on any weapons from a slot's G5 | **Kept, changed**: from G1 (T2G35) |
| T2G13 | Presets: Great or Twofold by pure or hybrid | **Superseded (R2-2)** by T2G36 |
| T2G14 | The kind cap on Orb forms | **Kept** (T2G37) |
| T2G15 | One Insignia factor | **Kept** (T2G38) |
| T2G16 | 30 refined a line a rank, no new item | **Kept** (T2G40: 30 a branch) |
| T2G17 | Branches and forms carry through Ascend | **Superseded (R2-6)** by T2G41 |
| T2G18 | Names | **Kept** (T2G42 adds) |
| T2G19 | Screens: a branch chip, rows from G5 | **Superseded (R2-6, R2-7)** by T2G43 |
| T2G20 | Save and engine | **Kept, changed**: T2G44 |

### 9.3 Where the owner may want to look first

1. **Free type swaps (T2G22).** A player who re-types every stage answers 0.4 more of a regular (4.72 against the
   presets' 4.28); Tier 1's free kind swaps already allow 5.00 with every kind graded. A re-type item is the alternative.
2. **Kindred (T2G31, T2G34): a support form on an accessory.** Her slot's +1 shared by the party, the party's strongest
   only. It is the one form whose value is the party's, measured as R2-11 asks; the healers find it worth more than their
   own forms.
3. **Armor with no Tier 2 path (T2G29).** Professions assumed a lining to her other half; it would hand the hybrids and
   healers a free slot and the one-stat classes nothing. The Lining carries the tier step instead, professions' fallback.
4. **The pure expanders' kits (T2G25, classes' T2C54).** Classes' Heavy twins (a Fire Tome on the Spellfist, a Greatsword
   on the Battlemage) leave the Lance and the Blizzard in one hand when both are in a party; gear's Scatter twins (a
   Thunder Tome, a Lance) keep two hands and answer 0.02 more. The cross-reference picks; gear's rules hold for either.
5. **Types grow by grade (T2G24).** A fresh Tier 2 weapon starts at Tier 1's ×1.3 and a Dual's partner at ×1.1; the full
   ×1.5 arrives at G10, as T2P29's second item pays for it.
6. **Estimated riders (T2G45).** Seeker, Onset, Finisher and Limit Orb are priced from measured shares; the simulation sets
   them with the rules built, and each has a knob.

## 10. Previews

**Made** ([previews/](previews/)): [gear-tiers.html](previews/gear-tiers.html) (one Uma's Gear tab Tier 1 → 2 → 3 for a
keeper or an expander, what opens when, every row at G10), [gear-weapons.html](previews/gear-weapons.html) (the Ascend
sheet's weapons step, types by grade, the partner table, Suggested for sixteen, coverage),
[gear-accessories.html](previews/gear-accessories.html) (the four families' trees, rows by grade and tier, what each form
wins by her damage and by party value), [gear-presets.html](previews/gear-presets.html) (the sixteen presets by grade
and tier), [gear-costs.html](previews/gear-costs.html) (armor by tier and half, why armor has no path, what a grade
takes). Round 1's four pages are rewritten in place; gear-presets is new.

**The old pages** ([tier-rework/previews/](../tier-rework/previews/)), unchanged from round 1's log: weapon-trees,
weapon-accessories, weapon-armor and weapon-materials are carried into the pages above; gear-weapon-tree, gear-loadout and
gear-crafting retired.
