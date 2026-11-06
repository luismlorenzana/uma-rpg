# Gear in Tiers 2 and 3: weapon types, armor, the accessory tree and what a grade costs

> **Status: round 3 (the owner's class feedback), 2026-11-05. Nothing here is built.** One doc of [the Tier 2 and Tier 3
> set](README.md): calls **T2G1–T2G20** (round 1), **T2G21–T2G46** (round 2) and **T2G47–T2G63** (round 3), each with a
> status in [§9](#9-decisions). Round 2 answered **R2-6** (weapon types picked at Tier 2 promotion, then swapped) and
> **R2-7** (an accessory upgrading tree). Round 3 answers [the brief's §10.2](README.md#102-round-3s-owners) for gear:
> **weapons and presets for [classes](classes.md)' twenty Tier 2 and twenty-two Tier 3 classes** (T2C65–T2C101), **the
> crosses' new other-channel weapons**, **Arsenal's two two-kind weapons against the coverage bound**, and **Tier 3's
> weapon types picked at the Tier 3 promotion**. It sits on **Tier 1 as built** (engine v21, save v38); the manual
> ([classes](../../game/classes.md#weapons), [combat](../../game/combat.md#damage), [materials](../../game/materials.md#gear))
> is the game as it plays.
>
> **Numbers come from the live code** (`economy/grades.ts`, `economy/accessories.ts`, `rpg/campaign/weaknesses.ts`,
> `world/world.ts`), printed by throwaway tests that are not committed. **Coverage** is counted on the live weakness dealer
> over every region stage of each tier on today's honeycomb (2,880 stages a tier: about 12,180 regulars, 240 sub-bosses
> and 260 bosses), for **every mix of the owner's two parties** (each seat any child of its Tier 1 class: 144 mixes in
> Tier 2, 324 in Tier 3) and classes' named comps. **The accessory forms' worth** is measured on the balance harness
> (`world/balance-party.ts`, Auto, on curve at each tier's Lv 50, every region stage at that level, 4 seeds); round 3's
> new profiles (the single-hit crosses, the pure pair) are **proxies** on the live engine, since their kits are not built
> ([§4.8](#48-the-new-profiles-measured-t2g59-t2g60)). Round 2's numbers on the old 40-region shape are kept where round 3
> doesn't move them, and say so.
>
> **Names:** round 3 adds no gear name. Its labels ("As in Tier 2", "Arsenal · two two-kind weapons", "Pure ×3",
> "Keen ×3") were matched, case-insensitive and exact, against every string of uma-platform's `content/release/data/*.json`
> and the game's own string literals: no match. Round 2's names stand (T2G42). The classes' names, Pinpoint and Arsenal
> are classes.md's.
>
> **Pages** (desktop, light and dark): [gear by tier](previews/gear-tiers.html) ·
> [weapons for the forty-two: the Ascend sheet, partners, Suggested, coverage](previews/gear-weapons.html) ·
> [Arsenal and the coverage bound](previews/gear-arsenal.html) (new) ·
> [the accessory tree and what each form wins](previews/gear-accessories.html) ·
> [presets for the forty-two](previews/gear-presets.html) · [armor and what a grade costs](previews/gear-costs.html).

## 1. At a glance

**What round 3 adds to gear:** **forty-two classes' weapons** (their slots are classes'; a type is each class's slot
setting); **the crosses' other channel is now a one-foe kind** (the Spellfist's Fire Tome on ATK, the Battlemage's Katana
on M.ATK); **the pure variants' three weapons of one channel**; **Arsenal**, the Gladiator's and the Thaumaturge's two
two-kind weapons, which breaks the coverage bound as drafted and is **fixed in Tier 3's Suggested types**; **types picked
again at the Tier 3 promotion**, pre-filled with the new class's Suggested; and **presets for the forty-two**, the forms
re-checked on the harness. Round 2's types, items and accessory tree stand.

| | Tier 1 (as built) | Tier 2 | Tier 3 |
|---|---|---|---|
| **Classes and their slots** | 8; three slots by channel | **20**: 3 Arms (Berserker, Bladedancer, Marshal), 3 Tomes (Archmage, Spellweaver, Animist), 2 + 1 the other fourteen; the crosses' other channel on their stat | **22**: each her parent's slots, but the **Gladiator 3 Arms** and the **Thaumaturge 3 Tomes** |
| **A weapon's type** | None: one kind, weak ×1.3 | **Pure** (×1.30 → ×1.50 by grade) or **Dual** (+ its partner) | **Keen** (×1.50 → ×1.70), **Tempered** or **Evolved** (two kinds, ×1.30 → ×1.50) |
| **When she picks it** | — | **On the Ascend sheet**, Suggested pre-set; **swapped freely** after (one tap) | **On the Tier 3 Ascend sheet**: her Tier 3 class's preset and Suggested; "As in Tier 2" one tap (T2G57) |
| **Two-kind weapons in her slots** | 0 | **1** | **1; the Gladiator and the Thaumaturge 2** (Arsenal, T2G54) |
| **Suggested with no two-kind weapon** | — | 3 of 20 (Bladedancer, Enchanter, Marshal: Pure ×3) | 4 of 22 (Dervish, Starweaver, Imperator, Mythlord: Keen ×3) |
| **Answers a regular**, the owner's mixes, Suggested (Party 1 · Party 2) | 4.31 · 4.35 | **4.25 · 4.18** (144 mixes) | **4.22 · 4.25** (324 mixes; Arsenal as drafted 4.39 · 4.36) |
| **Sub-boss and boss answers inside the shields' pricing** (7 · 9) | — | **All 144 mixes** (as drafted 134) | **All 324** (as drafted 284) |
| **The crosses' other-channel weapon** | — | Spellfist **Fire Tome on ATK**; Battlemage **Katana on M.ATK** | The same on the Spellhammer and the Spellknight; the Gladiator and the Thaumaturge have none |
| **Might at G10** (code) | 68 | 122 | 177 |
| **Armor at G10** (code) | HP +150, DEF +40, M.DEF +40, MP +30, evasion 12%, offense +25 | HP +270, DEF +72 … offense +45 | HP +390, DEF +104 … offense +65 |
| **Armor's path** | Her class's half | Her Tier 1 ancestor's half; **no path** (the Lining carries the × 1.8) | The same |
| **Accessory slots · forms a family** | 3 · 1 (the base) | 3 · **4**: the base, two riders from G1, one more at G5 | 3 · **5**: + one more at G5, every rider stepped |
| **Three slots add, Lv 50** (her best set · the preset) | 11–13% (D266) | **18–25% · 15–23%** | **19.5–27% · 17–24%** |
| **Forms that are someone's best** | 4 of 4 | **9 of 9**; the most-won, Great, in 18 of 48 cells | **11 of 11**; Great in 17 of 48 |
| **★ signature at Lv 50** (code) | +5 | +9 | +13 |
| **A rank, two Umas** | 30 refined a line | 30 a branch, ten branches (T2P39) | The same |

**Round 3 in eight lines:**
1. **A type is her class's slot setting on all forty-two** (T2G47); slots, channels and the stat each hit reads are
   classes'. One two-kind weapon a class (T2G3), **two for the Gladiator and the Thaumaturge** (Arsenal, T2G54).
2. **The crosses' other channel is a one-foe kind** (T2G48): the Spellfist's **Fire Tome on ATK**, the Battlemage's
   **Katana on M.ATK**; one grade serves every reader (D289), its own channel's items raise it.
3. **The pure variants wear three weapons of one channel** (T2G49), her stat on every hit, her third slot her pair's
   second half; her stat's family counts on every hit.
4. **Suggested types follow one rule in both tiers** (T2G50): one two-kind weapon or none, searched over every mix of
   the owner's parties for the most kinds in two hands, **under the coverage bound** (T2G52).
5. **Arsenal breaks the bound as drafted** (T2G55): the Gladiator and the Thaumaturge answer every foe, so Tier 3's
   parties answer 4.39 · 4.36 (over Tier 1's 4.31 · 4.35) and 40 of 324 mixes pass the shields' pricing. **The fix is in
   Tier 3's Suggested:** the four pure Tier 3 lines go Keen ×3 (their kinds are the ones Arsenal doubles); every party
   back to 4.22 · 4.25, every mix inside the shields, **at almost no cost in breadth** (480 kinds in one hand over 324
   mixes against 476).
6. **Types are picked again at the Tier 3 promotion** (T2G57): the sheet pre-fills her Tier 3 class's preset and
   Suggested types, so the bound holds by default; "As in Tier 2" maps her own (Pure → Keen, Dual → Tempered).
7. **Presets for the forty-two** (T2G58): every one-stat class (the crosses, the pure variants, Arsenal) wears Great twice
   and an Orb; the one-foe pure pair's Orb is a Twofold Orb on her first two kinds; a Tier 3 class wears her parent's (the
   rules multiply, so they move no ranking), the keeper healers' Vow from Tier 3's G5.
8. **D266 holds with the new profiles** (T2G60), measured on harness proxies: Great becomes the most-won form (18 and 17
   of 48 cells), under half; every form is still someone's best.

**Round 2's design, standing** (T2G21–T2G46): a type is picked with her class and swaps free; the second item
(Whetstone or Reagent) raises the type, so Pure climbs ×1.30 → ×1.50 over Tier 2; armor keeps her half with no Tier 2
path; every accessory form is its family's base plus one rider, opened on rings at a slot's G1 and G5; Kindred is the
supports' form, the party's strongest only; Seeker, Finisher and Onset read weak hits, wounded foes and her first act,
Vow, Limit Orb and Apex (Tier 3) her heals, her Limit Breaks and bosses; shapes stay Extra Stats'.

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
- **Measured on the live dealer** (every region stage of a tier on today's honeycomb: 2,880 stages, about 12,180
  regulars, 240 sub-bosses and 260 bosses): the owner's parties answer a Tier 1 regular with **4.31 · 4.35** members
  (round 2's 40-region count: 4.32 · 4.35); a Tier 2 regular with **3.62 · 3.66** on today's code, since nothing widens
  her weapons yet.

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

Three sets: weapon-progression's WP1–WP34 (approved as D193, carried in round 1), round 1's own T2G1–T2G20 and round
2's T2G21–T2G46. A call the owner's requirements replace is **Superseded (Rn-m)**.

### 3.1 weapon-progression.md (WP1–WP34)

**8 kept · 14 kept, changed · 9 superseded · 3 broken** (each broken call fixed by a round-1 call; round 2 supersedes WP11
and moves WP6, WP9, WP19 and WP22–WP23; round 3 re-points WP8, WP9, WP12, WP14 and WP25 at its calls).

| Call | What it said (for Tiers 2 and 3) | Status | Why, and where it goes |
|---|---|---|---|
| **WP1** Who owns what | Weapons own kinds and the weak multiplier; trees shape; armor defense; accessories damage only | **Kept, changed** (D264, D266, R2-7) | Accessories hold two real stats (Pendant, Charm) that lift heals; round 2 adds one party reach (Kindred, T2G34) and one heal lean (Vow, T2G31); still no defensive form (WP17) |
| **WP2** One model for every piece | Own every slot at G0; one item raises one grade | **Kept** | Live since R2 (D218), every tier |
| **WP3** The gate | Grade g at Uma Lv 5g − 4 | **Kept** | Live; the accessory rings open on it (G1 and G5: Lv 1 and 21) |
| **WP4** SB1 | Flat × 1 · 1.8 · 2.6; shares unchanged | **Kept, changed** (D264, D266) | Flat: Might, armor (not Speed), every Pendant, Charm and Orb form, Kindred, the ★. Shares: weak multipliers, evasion, every Insignia form |
| **WP5** Tier 1 weapons | One kind, ×1.3 | **Kept** | Live |
| **WP6** Tier 2's branch | At G5, Pure (×1.5) or Dual (its fixed partner) | **Kept, changed** (R2-6) | Pure and Dual stand as Tier 2's two **types**; the G5 step goes: picked on the Ascend sheet, swapped freely (T2G21, T2G22) |
| **WP7** The second kind | A partner of its own channel and the other group; coverage only; every bonus reads a hit's own kind | **Kept, changed** (D264) | Stands. "Every bonus on a kind" is the Orb forms and Extra Stats' kind rows (T2E); Seeker reads the hit's own kind and its weak flag, Limit Orb a Limit Break's hit (T2G32) |
| **WP8** The two-kind cap | Tier 2 one, Tier 3 two | **Broken** (D235) → round 1's T2G3 | One in every later tier (§4.2); round 3's Arsenal gives two Tier 3 classes two (T2G54) |
| **WP9** Tier 3 | Pure → Keen or Tempered; Dual → Tempered or Evolved | **Kept, changed** (R2-6, R3-1) | Keen, Tempered and Evolved stand as Tier 3's types, picked at the Tier 3 promotion and swapped freely; with free swaps the lineage no longer gates anything (T2G28, T2G57) |
| **WP10** The Branch Gem | One item a tier | **Superseded** (D264) | Every line equal at 30 a rank; nothing is made for a type (T2G39) |
| **WP11** Re-forging, switching, promotion | A Branch Gem re-forges; branches carry, grades reset | **Superseded** (R2-6) | No re-forge: a type swaps free (T2G22). Promotion picks the types (T2G21); grades reset (D283) |
| **WP12** The coverage check | 48 signatures, twins weighted | **Broken** (D235, D240) → round 1's T2G2 | Re-derived on the live dealer; round 3 measures every mix of the owner's parties on the forty-two (T2G52–T2G55) |
| **WP13** Weapon groups | Ring and Light/Dark; every two-kind weapon bridges them | **Kept, changed** (D240, D264) | Groups are shapes (Ring = Heavy, Sweep, Scatter; Light/Dark = Double, Volley); every partner still crosses them |
| **WP14** Armor's shape | Five slots; per piece for the four between from Tier 2 | **Kept, changed** (D240, D264) | Her class's half in every tier, the per-piece choice retired (T2G8); a cross's and a pure variant's half is the stat every hit reads (T2G61) |
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
| **WP25** Presets | Per class and tier, both branches | **Superseded** (D263, D266, R2-2) | Forty-two classes, D266's rule by role and ring (T2G58) |
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

**8 kept · 6 kept, changed · 6 superseded.**

| Call | Round 1 | Status | Now |
|---|---|---|---|
| **T2G1** The partner table | The owner's six Ring rows; Bow → Greatsword, Katana → Axe, Light → Ice, Dark → Fire; Tier 3 rows | **Kept** | §4.3 |
| **T2G2** The coverage check | A later tier answers a regular no more than Tier 1, every kind in two hands | **Kept** | Stated per party (T2G52), measured on the forty-two (T2G53, T2G55) |
| **T2G3** Two-kind weapons | One in her slots, Tiers 2 and 3 | **Kept, changed (R3-2, R3-3)** | §4.2; the Gladiator and the Thaumaturge two (Arsenal, T2G54) |
| **T2G4** The branch item | The weapon's G5 Arms Gem or Tome Ink sets Pure or Dual; a re-forge is one more G5 item | **Superseded (R2-6)** | Types picked on the Ascend sheet (T2G21), swapped free (T2G22) |
| **T2G5** Whose branch | A branch belongs to the weapon kind | **Superseded (R2-6)** | A type is her class's slot setting; the grade stays the kind's (T2G23) |
| **T2G6** Suggested Duals | One a class, every kind in two hands | **Kept, changed** (R2-2, R3-4) | One or none a class, under the bound (T2G50) |
| **T2G7** Weak multipliers | Base and Dual ×1.3, Pure, Tempered, Evolved ×1.5, Keen ×1.7 | **Kept** | §4.1, §5.1 |
| **T2G8** Armor by tier | Tier 1 × tier, her class's half | **Kept, changed** (R2-3) | Her Tier 1 ancestor's half (T2G29, T2G61) |
| **T2G9** The accessory tree | A slot's G5 opens two branches a family | **Superseded (R2-7)** | The five-form tree, rings at a slot's G1 and G5 (T2G30) |
| **T2G10** Branch values | Great ×1.3, Twofold 1 + 1, Twofold Orb 1.4 × 2, Onset 1.5%; Tier 3 step | **Kept, changed** (R2-7) | Great and Twofold's values kept as base + rider, opened at G1; Twofold Orb and Onset re-priced as riders; the step from Tier 3's G1 (T2G31–T2G33) |
| **T2G11** Onset | Her first act each wave | **Kept** | T2G33 |
| **T2G12** ★ on any weapons | From a slot's G5 a Twofold form of her family | **Kept, changed** (R2-7) | From her first Tier 2 grade (T2G35) |
| **T2G13** Presets by tier | Great or Twofold by pure or hybrid | **Superseded (R2-2)** | Forty-two classes by role (T2G58) |
| **T2G14** The kind cap | Orb forms ≤ +68 · +122 · +177 | **Kept** | Seeker's and Limit Orb's riders inside it (T2G37) |
| **T2G15** One Insignia factor | Every Insignia slot whose condition holds adds into one | **Kept** | Finisher and Apex join it (T2G38) |
| **T2G16** What a rank costs | 30 a line, no new item | **Kept** | R2-9's second materials inside the 30 (T2G40) |
| **T2G17** Ascend | Grades reset; branches and forms carry | **Superseded (R2-6)** | Types re-picked at each promotion, preselected from her last; forms carry (T2G41) |
| **T2G18** Names | Great Charm, Twofold, Onset; retired Branch Gem and the rest | **Kept** | New names in T2G42 |
| **T2G19** Screens and art | Branch chip; rows from G5; no new art | **Superseded (R2-6, R2-7)** | The Ascend sheet's weapon step, type chips, the slot's tree (T2G43) |
| **T2G20** Save and engine | `branch`, `fork`, `form`, `kind2` | **Kept, changed** | `type` per class slot, the forms' ids (T2G44) |

### 3.3 Round 2 (T2G21–T2G46) in round 3

**17 kept · 5 kept, changed · 4 superseded.** Round 3's twenty and twenty-two classes replace round 2's sixteen, so the
calls that named the sixteen's kits move; the type, item and tree rules stand.

| Call | Round 2 | Status | Where it lands |
|---|---|---|---|
| T2G21–T2G24 | Types at promotion, the swap rule, whose type, Tier 2's types | **Kept** | Tier 3's pick is T2G57 |
| **T2G25** | The expanders' cross weapons (the Heavy twins; the Scatter twins as gear's alternative) | **Superseded (R3-2, R3-3)** | T2G48: the cross on a one-foe kind (the Spellfist's Fire, the Battlemage's Katana) |
| **T2G26** | Suggested types for the sixteen | **Superseded (R3-4)** | T2G50's rule, T2G51 (Tier 2), T2G56 (Tier 3) |
| **T2G27** | Coverage on the sixteen (4.17–4.32 a regular) | **Superseded (R3-2–R3-4)** | T2G52 (the bound, stated per party), T2G53 (Tier 2), T2G55 (Tier 3 and Arsenal) |
| T2G28 | Tier 3's types, pre-filled from Tier 2's (Pure → Keen, Dual → Tempered) | **Kept, changed (R3-1)** | The values stand; the pick moves to the Tier 3 promotion, pre-filled with her new class's Suggested (T2G57) |
| T2G29 | Armor: her class's half, no Tier 2 path | **Kept, changed (R3-6)** | Her Tier 1 ancestor's half on the forty-two (T2G61) |
| T2G30–T2G35 | The tree's shape, the four families' riders, Kindred, ★ by tier | **Kept** | Re-checked on the new profiles (T2G60) |
| **T2G36** | Presets for sixteen | **Superseded (R3-4)** | T2G58: presets for the forty-two |
| T2G37, T2G38 | The kind cap; one Insignia factor | **Kept** | Arsenal's partners carry no Orb, so the cap reads the same |
| T2G39, T2G40 | What types and forms cost; the second items | **Kept** | Arsenal's second two-kind weapon costs nothing |
| T2G41 | Ascend: types re-picked, pre-filled from her last | **Kept, changed (R3-1)** | Into Tier 3 pre-filled with her new class's Suggested; her last is "As in Tier 2" (T2G57) |
| T2G42 | Names | **Kept** | Round 3 adds no gear name |
| T2G43 | Screens and art | **Kept, changed (R3-1)** | Arsenal's two type chips; "As in Tier 2" on the Tier 3 sheet (§5.1) |
| T2G44 | Save and engine | **Kept, changed (R3-1, R3-6)** | T2G62: the two-kind cap read by class |
| T2G45 | The viability check | **Kept** | Re-run on the new profiles (T2G60) |
| T2G46 | No shapes on accessories | **Kept** | — |

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

### 4.2 The partner table, and one two-kind weapon (T2G1, T2G3)

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
twin set on both channels; every preset keeps a legal Dual (all forty-two's but the Bladedancer's, the Marshal's and the
Enchanter's, whose one legal Dual the search leaves off, §4.4); every kind is someone's partner. **Why one two-kind weapon:**
with none capped the owner's parties answer 4.85 · 4.79 of a regular (Tier 3 4.98), a Brawler or a Sorcerer her whole
channel.

| Limit | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Two-kind weapons in her three slots | 0 | **1** | **1**; the Gladiator and the Thaumaturge **2** (T2G54) |
| Kinds she holds, at most | 3 | 4 | 4; Arsenal 5 |
| A weak hit, at most (G10) | ×1.3 | ×1.5 | ×1.7 |
| Her slotted kinds | All different | All different, partners included | The same |

### 4.3 Weapons for the twenty (T2G47–T2G49)

**Slots, channels and the stat each hit reads are [classes](classes.md)' (§4.1, T2C66);** gear's part is that every one of
them takes a type per slot (T2G23 on twenty classes), and what a slot of another channel is. **T2G47:** each Tier 2 and
Tier 3 class keeps her own three weapons and their types, as each class keeps its own weapons today; the grade stays the
weapon kind's (D289); one two-kind weapon in her slots (T2G3), the Gladiator and the Thaumaturge two (T2G54).

| Class | Line | Slots (lead first) · channels | Every hit reads | Preset (T2C77) | Her armor half |
|---|---|---|---|---|---|
| Berserker | Keeper | 3 Arms | ATK | Greatsword, Axe, Lance | Physical |
| **Spellfist** | Cross | 2 Arms + **1 Tome on ATK** | ATK | Greatsword, Katana, **Fire Tome** | Physical |
| Archmage | Keeper | 3 Tomes | M.ATK | Fire, Blizzard, Thunder | Magical |
| **Battlemage** | Cross | 2 Tomes + **1 Arm on M.ATK** | M.ATK | Fire, Blizzard, **Katana** | Magical |
| Blademaster | Keeper | 2 Arms + 1 Tome | ATK · M.ATK | Katana, Axe, Thunder | Physical |
| Sentinel | Support | 2 Arms + 1 Tome | ATK · M.ATK | Katana, Greatsword, Light | Physical |
| **Bladedancer** | **Pure** | **3 Arms** (lead two + her second half) | ATK | Katana, Axe, **Bow** | Physical |
| Runeblade | Keeper | 2 Tomes + 1 Arm | M.ATK · ATK | Thunder, Blizzard, Katana | Magical |
| Enchanter | Support | 2 Tomes + 1 Arm | M.ATK · ATK | Light, Blizzard, Katana | Magical |
| **Spellweaver** | **Pure** | **3 Tomes** | M.ATK | Thunder, Blizzard, **Dark** | Magical |
| Warlord | Keeper | 2 Arms + 1 Tome | ATK · M.ATK | Bow, Axe, Dark | Physical |
| Druid | Support | 2 Arms + 1 Tome | ATK · M.ATK | Bow, Axe, Dark | Physical |
| **Marshal** | **Pure** | **3 Arms** | ATK | Bow, Axe, **Katana** | Physical |
| Invoker | Keeper | 2 Tomes + 1 Arm | M.ATK · ATK | Dark, Blizzard, Bow | Magical |
| Shaman | Support | 2 Tomes + 1 Arm | M.ATK · ATK | Dark, Blizzard, Bow | Magical |
| **Animist** | **Pure** | **3 Tomes** | M.ATK | Dark, Blizzard, **Thunder** | Magical |
| Guardian · Templar | Healers | 2 Arms + 1 Tome | ATK (heals from ATK) | Lance, Greatsword, Light | Physical |
| Bishop · Exorcist | Healers | 2 Tomes + 1 Arm | M.ATK (heals from M.ATK) | Light, Fire, Lance | Magical |

**T2G48: the crosses' other-channel weapons are one-foe kinds.** Round 3 reshapes the Spellfist and the Battlemage to
single big hits (classes T2C71–T2C73), so their other channel is a Heavy or a Double kind, not round 2's Scatter twin:

| | **Spellfist** (and the Spellhammer) | **Battlemage** (and the Spellknight) |
|---|---|---|
| **Her other-channel weapon** | **Fire Tome on ATK** (was the Thunder Tome): Heavy, one foe | **Katana on M.ATK** (was the Lance): Double, one foe |
| **Which kinds the slot takes** | **Any Tome**, every hit on ATK | **Any Arm**, every hit on M.ATK |
| **Might** | The Fire Tome's grade joins **ATK** on its hits: +122 at G10 in Tier 2, +177 in Tier 3 | The Katana's grade joins **M.ATK**: the same |
| **What raises it** | Its channel's items, as every Tome: Tome Ink and Tome Reagent (Vegetables, Herbs) | Arms Gem and Arms Whetstone (Metal, Rock) |
| **Its type** | Pure or Dual like any weapon; the Fire Tome's partners Dark (Tier 2), Light (Tier 3) | The Katana's Axe (Tier 2), Lance (Tier 3) |
| **Her offense on it, on curve at Lv 50** (classes §4.4, code) | 277 · 499 · 722 (Tiers 1 · 2 · 3) | 282 · 508 · 735 |
| **On the farm** | 200 Metal + 100 Vegetables refined a rank, like the Arms hybrids | 100 + 200, like the Tome hybrids |

- **One grade, every reader** (D289): a Fire Tome at G7 is G7 for the Archmage on M.ATK and the Spellfist on ATK. The
  Might row, the gate and the recipe don't change; only the stat it joins does. The damage sheet (D279) shows it on her
  ATK row ("Fire 412 (…)").
- **A hit of her other channel keeps its kind for everything else** (classes T2C35): defense, weakness, shields, locks,
  statuses and the Rift's ward read the kind's channel; her stat and the weapon's Might are her offense.
- **What the one-foe kit costs the party's kinds** is classes' (T2C94: 80 of 144 mixes hold all ten in hand, 92 on round
  2's Scatter twins); with Suggested types the owner's mixes hold all ten **108 of 144** (§4.5).

**T2G49: the pure variants wear three weapons of one channel.** The Bladedancer and the Marshal three Arms, the
Spellweaver and the Animist three Tomes (classes T2C68): her lead half from her first two weapons, her second half from
her third, every hit on her stat. Gear reads only what that makes her:
- **Any kind of her channel in any slot** (her third slot gives her second half whatever its kind).
- **Her stat's family counts on every hit:** a Pendant for the Bladedancer and the Marshal, a Charm for the Spellweaver
  and the Animist, as for the Berserker and the Archmage (T2C70); her armor half is her parent's, the stat she reads.
- **On the farm:** 300 Metal (or Vegetables) refined a rank and none of the other, like the Brawler (or the Sorcerer).

### 4.4 Suggested types for the twenty (T2G50, T2G51)

**T2G50: one rule for Suggested types in both tiers.** Her class's preset weapons (classes T2C77); **one two-kind weapon
or none** (Pure on all three); chosen across **every mix of the owner's two parties** (each seat any child of its Tier 1
class: 2 × 2 × 3 × 3 × 2 = 72 a party in Tier 2, 162 in Tier 3) for **the fewest kinds in one hand**, **under the
coverage bound** (T2G52); ties to the fewer answers. In Tier 2 round 2's keepers and battle healers keep round 1's Dual:
freeing them too reaches 248 kinds in one hand over the 144 mixes against 276, but moves six of their Duals and puts
C1's Katana in one hand. Tier 3's twenty-two are new classes, so every one is searched (§5.2). Round 2's rule (one Dual
a class, no bound) is the alternative; on the twenty it leaves 10 of 144 mixes past the bosses' shield pricing.

**T2G51: Tier 2's Suggested** (her answers alone: the share of Tier 2's regulars · sub-bosses · bosses she holds a weak
kind for; with no type, her three kinds alone):

| Class | Weapons (lead first) | **Tier 2, Suggested** | Answers alone | No type | Changed in round 3 |
|---|---|---|---|---|---|
| Berserker | Greatsword, Axe, Lance | **Dual Greatsword + Bow**, Pure, Pure | 0.91 · 0.90 · 0.92 | 0.76 | — |
| **Spellfist** | Greatsword, Katana, Fire (ATK) | Pure, **Dual Katana + Axe**, Pure | 0.86 · 0.83 · 0.88 | 0.74 | New kit |
| Archmage | Fire, Blizzard, Thunder | **Dual Fire + Dark**, Pure, Pure | 0.87 · 0.97 · 0.92 | 0.79 | — |
| **Battlemage** | Fire, Blizzard, Katana (M.ATK) | **Dual Fire + Dark**, Pure, Pure | 0.84 · 0.91 · 0.78 | 0.74 | New kit |
| Blademaster | Katana, Axe, Thunder | Pure, Pure, **Dual Thunder + Light** | 0.80 · 0.75 · 0.82 | 0.69 | — |
| Sentinel | Katana, Greatsword, Light | **Dual Katana + Axe**, Pure, Pure | 0.84 · 0.82 · 0.87 | 0.71 | — |
| **Bladedancer** | Katana, Axe, Bow | **Pure ×3** | 0.77 · 0.78 · 0.78 | 0.77 | New |
| Runeblade | Thunder, Blizzard, Katana | **Dual Thunder + Light**, Pure, Pure | 0.81 · 0.86 · 0.84 | 0.68 | — |
| **Enchanter** | Light, Blizzard, Katana | **Pure ×3** | 0.69 · 0.78 · 0.68 | 0.69 | Was Dual Katana + Axe |
| **Spellweaver** | Thunder, Blizzard, Dark | **Dual Thunder + Light**, Pure, Pure | 0.86 · 0.91 · 0.84 | 0.66 | New |
| Warlord | Bow, Axe, Dark | **Dual Bow + Greatsword**, Pure, Pure | 0.85 · 0.85 · 0.88 | 0.72 | — |
| **Druid** | Bow, Axe, Dark | **Dual Bow + Greatsword**, Pure, Pure | 0.85 · 0.85 · 0.88 | 0.72 | Was Dual Dark + Fire on round 2's Bow, Greatsword, Dark |
| **Marshal** | Bow, Axe, Katana | **Pure ×3** | 0.77 · 0.78 · 0.78 | 0.77 | New |
| Invoker · Shaman | Dark, Blizzard, Bow | **Dual Dark + Fire**, Pure, Pure | 0.84 · 0.90 · 0.73 | 0.67 | — |
| **Animist** | Dark, Blizzard, Thunder | Pure, **Dual Blizzard + Light**, Pure | 0.86 · 0.91 · 0.84 | 0.66 | New |
| Guardian · Templar | Lance, Greatsword, Light | **Dual Lance + Katana**, Pure, Pure | 0.86 · 0.86 · 0.88 | 0.71 | — |
| Bishop · Exorcist | Light, Fire, Lance | Pure, Pure, **Dual Lance + Katana** | 0.83 · 0.80 · 0.86 | 0.72 | — |

- **Why three Pure ×3:** the Bladedancer's and the Marshal's only legal Dual (Bow + Greatsword) adds a Greatsword their
  party already holds twice, and the Enchanter's (Katana + Axe) an Axe; the search keeps every kind in as many hands
  without them and under the bound. Pure is the damage pick (×1.5 on all three at G10), which suits a pure class.
- **Why the crosses' Duals sit on their lead channel:** the Spellfist's Katana + Axe brings back the Axe her one-foe kit
  dropped, the Battlemage's Fire + Dark a Dark the Sorcerer's line never held; a Dual on the cross slot would double
  what the other channel's keepers already hold.
- **What it costs her alone:** a Suggested two-kind weapon answers 80–91% of Tier 2's regulars alone (none 66–79%); a
  Pure ×3 class answers 69–77%, the party's two hands carrying the rest. Each type is on the sheet with what it answers;
  any legal pick is fine, and she swaps freely after.

### 4.5 Coverage: the bound, and the twenty (T2G52, T2G53)

**T2G52: the coverage bound, stated per party.** Round 1's T2G2 asked that a later tier answer a regular no more than
Tier 1, every kind in two hands where the presets allow. Round 3 states it on what the owner fields:
- **The regular bound:** for each of the owner's two parties, **the mean over every mix of its seats** (Suggested types)
  answers a regular no more than **its Tier 1 party does: 4.31 (Party 1) and 4.35 (Party 2)**, on today's honeycomb.
- **The shields' pricing holds for every mix:** sub-bosses 7 and bosses 9 are priced on answers (balance T2B7, CP8's
  rule: 6 × a ÷ 3.73 and 8 × a ÷ 3.77), so **no mix's sub-boss answers pass 4.66, nor its boss answers 4.48**.
- **Every kind in two hands** stays the search's aim (T2G50), never a promise: a mix can drop a kind, and the party hint
  names it (classes T2C94).

**T2G53: the twenty, measured** (the live dealer, Tier 2's 2,880 region stages; regular · sub-boss · boss):

| | Mixes | Regular, mean (range) | Sub-boss | Boss | Every kind in two hands | All ten held (in hand · with partners) |
|---|---|---|---|---|---|---|
| **Tier 1**, the owner's parties (no type) | 1 · 1 | **4.31 · 4.35** | 3.75 · 3.71 | 3.75 · 3.75 | — | 10 · 10 |
| Tier 1's kits on Tier 2's foes (no type) | 1 · 1 | 3.62 · 3.66 | 3.65 · 3.72 | 3.66 · 3.71 | — | — |
| **Party 1's mixes**, Suggested | 72 | **4.25** (4.17–4.34) | 4.35 (4.25–4.45) | 4.23 (4.05–4.44) | 4 | 36 · 48 |
| **Party 2's mixes**, Suggested | 72 | **4.18** (3.99–4.33) | 4.27 (4.10–4.42) | 4.24 (3.97–4.42) | 4 | 44 · 60 |
| *Round 2's rule on the twenty* (one Dual each, no bound) | 144 | *4.30 · 4.27* | — | *up to 4.58: 10 mixes past 4.48* | 10 | 80 · 108 (both parties) |

| Classes' comp | Members | Regular · sub-boss · boss | Kinds in two hands · in one hand |
|---|---|---|---|
| **C1** Tier 1-like (Party 1's keepers) | Berserker, Archmage, Blademaster, Invoker, Guardian | 4.28 · 4.37 · 4.28 | 10 · — |
| **C2** Tier 1-like (Party 2's keepers) | Berserker, Archmage, Runeblade, Warlord, Bishop | 4.28 · 4.36 · 4.42 | 10 · — |
| **C3** A Brawler with a Spellblade | **Spellfist**, Archmage, **Bladedancer**, Invoker, Guardian | 4.19 · 4.33 · 4.19 | 7 · Lance, Thunder, Light |
| **C3b** A Sorcerer with a Tome Spellblade | Berserker, **Battlemage**, **Spellweaver**, Warlord, Bishop | 4.30 · 4.36 · 4.28 | 9 · Thunder |
| **C4** A Spellblade with the Paladin | Berserker, Archmage, **Sentinel**, Invoker, **Templar** | 4.32 · 4.44 · 4.33 | 9 · Thunder |
| **C4b** A Tome Spellblade with the Cleric | Berserker, Archmage, **Enchanter**, Warlord, **Exorcist** | 4.16 · 4.29 · 4.25 | 9 · Thunder |
| **C5** Both swaps on one party | Spellfist, Archmage, Bladedancer, Shaman, Templar | 4.19 · 4.33 · 4.19 | 7 · Lance, Thunder, Light |
| **C6** All pure (Party 1) | Berserker, Archmage, Bladedancer, Animist, Guardian | 4.27 · 4.41 · 4.34 | 9 · Fire |
| **C6b** All pure (Party 2) | Berserker, Archmage, Spellweaver, Marshal, Bishop | 4.24 · 4.35 · 4.32 | 9 · Greatsword |
| **C7** All hybrid | Spellfist, Battlemage, Blademaster, Invoker, Guardian | 4.19 · 4.25 · 4.10 | 7 · Lance, Bow, Thunder |
| **C8** Both hybrids to support | Berserker, Archmage, Sentinel, Shaman, Guardian | 4.32 · 4.44 · 4.33 | 9 · Thunder |
| **C9** A Summoner to support | Berserker, Archmage, Runeblade, Druid, Bishop | 4.28 · 4.36 · 4.42 | 10 · — |
| **C10** Every member a cross or support | Spellfist, Battlemage, Sentinel, Shaman, Templar | 4.23 · 4.32 · 4.15 | 7 · Lance, Bow (Thunder not held) |

**What holds:** both parties' means sit under their Tier 1 party (4.25 against 4.31, 4.18 against 4.35); **every one of
the 144 mixes keeps its sub-boss and boss answers inside the shields' pricing** (at most 4.45 and 4.44); every named
comp answers 4.16–4.32 a regular, C4 and C8 0.01 over their Tier 1 party's 4.31, inside the means. **The Tier 1-like
comps keep every kind in two hands** (C1, C2, C9); the swap comps hold every kind but put one to three in one hand,
the price of single big hits (classes T2C94); C10 drops Thunder, which the party hint names. **What grows:** sub-bosses
and bosses gain about 15% over Tier 1's (3.71–3.75 → 4.23–4.35 on the means), which is why their shields go up one from
**Tier 2 Lv 1** (T2B7: sub-bosses 7, bosses 9): the types come with the promotion, not a G5. **What a diligent player
adds:** re-typing every stage lifts a party about 0.4 (round 2's 4.72 on C1), below what Tier 1's free kind swaps already
allow with every kind graded (5.00).

### 4.6 Armor (T2G29, T2G61)

**Tier 1's armor × 1.8, on her class's half, with no Tier 2 path** (code):

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Head DEF · Arms M.DEF | 7 | 14 | 22 | 29 | 36 | 43 | 50 | 58 | 65 | 72 |
| Body HP | 27 | 54 | 81 | 108 | 135 | 162 | 189 | 216 | 243 | 270 |
| Legs MP | 5 | 11 | 16 | 22 | 27 | 32 | 38 | 43 | 49 | 54 |
| Feet Speed (evasion) | 2 (1.2%) | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 (12%) |
| Offense a piece | 2 | 2 | 4 | 4 | 5 | 5 | 7 | 7 | 9 | 9 |

- **Her half, for the forty-two** (her Tier 1 ancestor's, classes §4.1; T2G61): **physical (ATK)** for the Brawler's,
  the Arms Spellblade's, the Arms Summoner's and the Paladin's lines (the Berserker, the Spellfist and their Tier 3
  children; the Blademaster, Sentinel, Bladedancer, Warlord, Druid, Marshal and theirs; the Guardian and the Templar and
  theirs, whose mends read it); **magical (M.ATK)** for the Sorcerer's, the Tome Spellblade's, the Tome Summoner's and the
  Cleric's. A cross's and a pure variant's armor reaches every hit she makes.
- **No Tier 2 path for armor.** Professions assumed a lining that adds each piece's offense to her other half too
  (T2P30). Measured on round 1's terms, a second half is +45 of her other stat at G10: about +5% damage for every hybrid
  and healer (the M.ATK half of three Twofold slots, 54, is worth 6.5% to the Arms Spellblade) and **nothing** for the
  eight one-stat Tier 2 classes (the Berserker, the Archmage, the two crosses, the four pure variants). That is a free
  accessory slot for twelve classes of twenty, against R2-11; and round 1 measured that splitting a piece's offense never
  pays (−0.8 to −2.2% a piece).
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

| Rider | Reaches | Suits (§6's classes; the new profiles in §4.8) | The owner's words |
|---|---|---|---|
| Great (Pendant, Charm) | More of her one stat | The one-stat classes: the Berserker and the Archmage, the crosses (one stat reaches both their channels), the pure variants, Arsenal; the healers' mends | — |
| Twofold (Pendant, Charm) | Her other stat | The hybrids, keepers and supporters, and her ★ on any weapons | "Dual ATK+MATK increase" |
| **Kindred** | Every Uma's hits, both stats, hits only | **The supports** (Sentinel, Enchanter, Druid, Shaman) and any healer | "support a bit" (R2-3) |
| Vow (Tier 3) | Her mends, Barriers and revives | **The keeper healers** | — |
| Great Orb | More on her one kind | A class leaning on one kind (the Summoners' lead, the Paladin's Lance) | — |
| Twofold Orb | A second kind of hers | Two-kind spreads (the Summoners, the Arms Spellblade), **the one-foe pure pair's lead two** | "multi-damage type increases" |
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
stands for the classes that keep it (§6): the Brawler's row is the Berserker's (and the Gladiator's), the hybrids' rows
their keepers' and (with a lower share) their supports', the healers' rows their keepers' and battle healers'. Round 3's
new profiles (the crosses, the pure pair) are §4.8's. These rows are round 2's, on the 40-region world.

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
  Onset 3. **Every form is someone's best; none wins more than a quarter of the cells** (D266's bar is half). Round 3's
  new profiles add 16 cells and make Great the most-won form, 18 of 48, still under half (§4.8).
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

### 4.8 The new profiles, measured (T2G59, T2G60)

Round 3 adds three kinds of hitter the tree was never priced on: **the single-hit cross** (one stat on every hit, one act
on one foe), **the pure pair** (one stat on both halves of a pair, three kinds of one channel) and **Arsenal** (one stat,
every kind of her channel). None is built, so each is a **proxy on the live engine** at Tier 2's Lv 50, her parent's
seat in the owner's party, on curve, three slots at G10 in each set, against the same Uma bare (§4.7's measure; 48
fights, 24 sub-bosses, 24 bosses, 4 seeds; Seeker's rider ≈ from her measured weak-hit share):

| Profile (its classes) | The proxy |
|---|---|
| **Single-hit cross, ATK** (Spellfist, Spellhammer) | A Brawler on Greatsword, Katana and a Bow on line B (Barrage): one-foe kinds on ATK, as classes' own single-target test |
| **Single-hit cross, M.ATK** (Battlemage, Spellknight) | A Sorcerer on Fire, Blizzard and Light (Double, one foe) |
| **Pure pair, one foe** (Bladedancer, Spellweaver; Dervish, Starweaver) | An Arms Spellblade on her preset with her M.ATK set to her ATK, so both halves read one stat; her parent's hands (0.72 + 0.44, the variant's 0.32 a little lower) |
| **Pure pair, area** (Marshal, Animist; Imperator, Mythlord) | An Arms Summoner the same way |
| **Arsenal** (Gladiator, Thaumaturge) | The Brawler's and the Sorcerer's own profile (round 2 measured them); her weak-hit share rises with every foe answered, priced on Seeker below |

**Her damage with each set, Tier 2 Lv 50** (the best set of each column in bold; the preset T2G58's):

| Set | Cross, ATK | Cross, M.ATK | Pure pair, one foe | Pure pair, area |
|---|---|---|---|---|
| Great ×3 | **21.0 · 22.0 · 21.8 · 21.4** | 21.8 · 24.1 · 18.6 · 21.6 | **20.1 · 22.7 · 20.9 · 20.9** | **22.1** · 22.1 · 23.1 · **22.3** |
| Great ×2 + Great Orb | 17.5 · 19.4 · 17.9 · 18.1 | 22.9 · 24.7 · 22.1 · **23.2** | 15.7 · 18.3 · 18.0 · 16.9 | 22.0 · 21.6 · **23.1** · 22.2 |
| Great ×2 + Twofold Orb | 16.9 · 18.7 · 17.3 · 17.5 | 21.9 · 23.4 · 20.6 · 21.9 | 17.1 · 19.2 · 18.6 · 18.0 | 20.8 · 20.7 · 21.7 · 21.0 |
| Great ×2 + Great Insignia | 13.6 · **23.8** · 19.7 · 17.7 | 13.7 · 26.4 · 18.4 · 18.1 | 13.2 · 22.0 · 19.6 · 17.0 | 15.2 · 22.0 · 22.2 · 18.6 |
| Great ×2 + Seeker ≈ | 17.6 · 19.8 · 18.0 · 18.3 | 22.1 · 24.1 · 21.0 · 22.3 | 17.1 · 18.3 · 18.6 · 17.8 | 21.4 · 21.0 · 22.4 · 21.5 |
| Great Orb ×2 + Great Insignia | 7.9 · 16.9 · 13.0 · 11.4 | 16.5 · **26.8** · 21.2 · 20.3 | 4.5 · 13.8 · 12.7 · 8.9 | 14.7 · **22.4** · 21.6 · 18.4 |
| Twofold Orb ×3 (on her lead two) | 9.6 · 10.8 · 9.9 · 10.0 | **23.5** · 21.9 · 21.0 · 22.5 | 10.5 · 13.1 · 14.1 · 12.0 | 18.1 · 18.1 · 20.7 · 18.8 |
| Twofold Orb ×3 (each kind) | 13.5 · 12.5 · 12.8 · 13.1 | 14.9 · 16.1 · 12.7 · 14.6 | 14.7 · 14.6 · 15.7 · 14.9 | 16.2 · 15.5 · 17.7 · 16.4 |
| Seeker ×3 ≈ | 12.9 · 12.7 · 13.2 · 12.9 | 23.0 · 23.3 · **22.2** · 22.9 | 8.8 · 11.2 · 12.5 · 10.3 | 19.6 · 18.9 · 21.2 · 19.8 |
| Great Orb ×3 (capped) | 10.1 · 10.9 · 10.5 · 10.4 | 21.4 · 21.4 · 21.3 · 21.4 | 6.2 · 9.4 · 9.9 · 7.9 | 18.1 · 18.4 · 20.8 · 18.9 |
| Great Insignia ×3 | 0 · 22.3 · 14.5 · 9.2 | 0 · 26.4 · 12.9 · 9.8 | 0 · 19.2 · 11.8 · 7.7 | 0 · 20.2 · 14.7 · 8.7 |
| Her weak-hit share (fights · sub · boss) | 62 · 67 · 61% | 64 · 67 · 67% | 58 · 43 · 53% | 43 · 37 · 37% |

Each cell is fights · sub-bosses · bosses · the mean (fights twice), % of her damage a turn.

**T2G59: what suits each profile.**

| Profile | Its forms | Why |
|---|---|---|
| **Single-hit cross** | **Great** on her stat; the Battlemage's Fire carries enough of her damage that a Great Orb, a Twofold Orb or a Seeker sits level with it | One stat on every hit, her other channel's too, so her stat's Great reaches all three kinds and her Twofold's other stat reaches nothing. Pinpoint multiplies every one-foe act alike, so it moves no ranking |
| **Pure pair, one foe** | **Great**; a **Twofold Orb on her first two kinds** for her Orb | Her damage spreads over three kinds (two lead weapons and her second half), so no one kind carries an Orb: the Twofold Orb beats the Great Orb by 1.1 points |
| **Pure pair, area** | **Great**; a **Great Orb** on her lead kind | Her lead summon's kind carries her area hits and its farewell: the Great Orb is level with a third Great |
| **Arsenal** | **Great**, as the Brawler and the Sorcerer (round 2: Great ×3 19.0 and 20.5%) | Every foe answered lifts her weak-hit share from about half to about two thirds: Seeker gains about 1.5 points, short of Great's lead (Seeker ×3 ≈ 11.5 against Great ×3 21.1 on the Brawler here) |
| **Tier 3's rules** | Her Tier 2 parent's | Momentum, Pinpoint doubled, Juggernaut, Resonance and Spellbind multiply her hits, so they move no form's rank; Menagerie's farewells are area (Extra Stats' axis, T2G46); **Overflow** turns a keeper healer's overheal into a Barrier, so Vow's heal lean (T2G31) gains a second use; the supports' twists keep Kindred their party pick |

**T2G60: D266's rule, re-checked.** Round 2's 32 cells a tier (eight Tier 1 profiles × four columns) and the four new
profiles' 16, by her damage (the party value of a self form is her gain × her share, so it ranks the same; Kindred,
measured, stays the supports' and the healers' party pick):

| Form, counted in each best set | Round 2's 32 cells | The new 16 | **All 48, Tier 2** |
|---|---|---|---|
| Great | 6 | 12 | **18** (37.5%) |
| Seeker ≈ | 8 | 1 | 9 |
| Great Orb | 5 | 4 | 9 |
| Great Insignia | 4 | 3 | 7 |
| Twofold Orb | 4 | 1 | 5 |
| Twofold, Finisher ≈, Onset ≈ | 5 · 5 · 3 | — | 5 · 5 · 3 |
| Kindred (party value) | 8 of the party cells | — (damage dealers never want it) | 8 |

**No form wins over half the cells; every form is still someone's best.** Great rises because every new profile reads
one stat on every hit, the condition Great was made for; the crosses' M.ATK side and the area pure pair keep the Orb
family and the Insignias in play. Onset and Finisher were not re-estimated on the proxies (round 2's parent shares
stand). **The presets add 18.0–23.2%** on the new profiles (round 2's eight: 15.2–22.2%), within a few points of each
best set and best in one column only (the Battlemage's mean), as D266 wants of a preset.

### 4.9 Presets for the twenty (T2G58)

**D266's rule, extended to the twenty:** her armor half's stat twice and an Orb, each slot in its best open form for her
role (T2G59); the ★ family first (T2G35); the Orb on `presetKind`'s kind of the preset's weapons (her first weapon's; a
Summoner's lead that twins her lone weapon). A preset spends nothing and moves no grade; it sets her weapons' Suggested
types (§4.4) too.

| Class | Line | Tier 2, a slot G1–G4 | Tier 2, a slot G5 on | Measured (her profile, Lv 50) |
|---|---|---|---|---|
| Berserker | Keeper | Great Pendant ×2, Great Orb (Greatsword) | the same | 15.2% (the Brawler's; best set 19.0%) |
| **Spellfist** | Cross | Great Pendant ×2, Great Orb (Greatsword) | the same | **18.1%** (best 21.4%) |
| Archmage | Keeper | Great Charm ×2, Great Orb (Fire) | the same | 19.1% (the Sorcerer's; best 20.5%) |
| **Battlemage** | Cross | Great Charm ×2, Great Orb (Fire) | the same | **23.2%** (the best mean) |
| Blademaster | Keeper | Twofold Pendant ×2, Great Orb (Katana) | the same | 18.6% (the Arms Spellblade's) |
| Sentinel | Support | Twofold Pendant ×2, Great Orb (Katana) | **Kindred Pendant**, Twofold Pendant, Great Orb | Kindred: +3.2–3.3% the party |
| **Bladedancer** | Pure | **Great Pendant ×2, Twofold Orb (Katana + Axe)** | the same | **18.0%** (best 20.9%) |
| Runeblade | Keeper | Twofold Charm ×2, Great Orb (Thunder) | the same | 17.8% (the Tome Spellblade's) |
| Enchanter | Support | Twofold Charm ×2, Great Orb (Light) | **Kindred Charm**, Twofold Charm, Great Orb | Kindred |
| **Spellweaver** | Pure | **Great Charm ×2, Twofold Orb (Thunder + Blizzard)** | the same | The Bladedancer's mirror |
| Warlord | Keeper | Twofold Pendant ×2, Great Orb (Bow) | the same | 17.5% (the Arms Summoner's) |
| Druid | Support | Twofold Pendant ×2, Great Orb (Bow) | **Kindred Pendant**, Twofold Pendant, Great Orb | Kindred |
| **Marshal** | Pure | **Great Pendant ×2, Great Orb (Bow)** | the same | **22.2%** (best 22.3%) |
| Invoker | Keeper | Twofold Charm ×2, Great Orb (Dark) | the same | 20.8% (the Tome Summoner's) |
| Shaman | Support | Twofold Charm ×2, Great Orb (Dark) | **Kindred Charm**, Twofold Charm, Great Orb | Kindred |
| **Animist** | Pure | **Great Charm ×2, Great Orb (Dark)** | the same | The Marshal's mirror |
| Guardian · Templar | Healers | Great Pendant ×2, Great Orb (Lance) | the same | 22.2% (the Paladin's) |
| Bishop · Exorcist | Healers | Great Charm ×2, Great Orb (Light) | the same | 18.5% (the Cleric's) |

- **Why these:** one stat for the classes that read one: the keepers of the pures, **the crosses** (one stat reaches both
  their channels) and **the pure variants**; Twofold for the two-stat hybrids; **the supports bear Kindred** from G5,
  the role R2-3 gives them; the healers Great (their mends read it); **the one-foe pure pair's Orb is a Twofold Orb**
  across her lead two (T2G59), the area pair's a Great Orb on her lead summon's kind.
- **Measured** (Tier 2 Lv 50, §4.7 and §4.8): the presets add 15.2–23.2% against 18.4–25.2% for each class's best set,
  and 12–17% for Tier 1's set at the same level. A support's preset gives the party +0.2–0.6 points over her keeper's at
  three quarters of her damage (§4.7).
- **Her ★ first** (T2G35): a Spellfist whose ★ is the Charm wears a Twofold Charm (+18 ATK, its M.ATK unread, her ★ +9)
  for one Great Pendant: 27 on her hits against 23.

### 4.10 The damage stack in Tier 2

| Step | Tier 2 adds |
|---|---|
| 1 Offense | Might × 1.8 (a cross's other-channel weapon's on her stat); the stat forms in ATK and M.ATK (real stats: heals read them); the Orb forms on a hit's own kind, Seeker's rider on a weak hit, under the kind cap; Kindred and the ★ (hits only); Extra Stats' kind rows beside them, its Area and Multi-hit after the Insignias (T2E) |
| 3 Weak | **The weapon's type by grade:** Pure ×1.30 → ×1.50, a Dual's own kind ×1.30 and its partner's ×1.10 → ×1.30; a Limit Break ×1.3 |
| 4 Insignias | Bases and riders in one factor: sub-bosses and bosses, her first act, a wounded foe |

**The ceiling of one weak hit from gear** (before statuses): Tier 1 ×1.3 × ×1.30 = **×1.69**; Tier 2 Pure ×1.5 × three
Onsets on a boss's first act ×1.48 = **×2.22** (round 1's ×2.18); Tier 3 Keen ×1.7 × three Apexes ×1.54 = **×2.62** (§5.3).

### 4.11 What a grade costs (T2G39, T2G40)

**Types and forms cost nothing; every Tier 2 grade takes its line's two items** ([professions](professions.md) T2P29,
round 2's farm), so a rank stays 30 refined a branch and a type or a form swaps without touching the farm:

| Piece | The grade's first item (its base) | The grade's second item (its Tier 2 part) | Refined a grade |
|---|---|---|---|
| An Arms weapon | Arms Gem (10 Ingots): Might, Tier 1's × 1.8 | **Arms Whetstone** (10 Blocks): its type (§4.1) | 10 + 10 |
| A Tome (a cross's too) | Tome Ink (10 cuts): Might | **Tome Reagent** (10 dried herbs): its type | 10 + 10 |
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

### 4.12 Screens (T2G43)

- **The Ascend sheet's weapons step** (progression's T2W19 and T2W39 own the sheet): three rows, a slot each, "Greatsword ·
  Dual + Bow", the partner's glyph in its kind's colour, Suggested chips; the kinds she covers ("Covers 4 kinds"); into
  Tier 3 an "As in Tier 2" chip, and on the Gladiator and the Thaumaturge two type chips ("Arsenal · two two-kind
  weapons").
- **The Gear tab's weapon tile** gains a type chip ("Pure", "Dual + Bow"); its sheet lists the slot's kinds, then the two
  types with what each answers, one tap each. The Upgrade row reads both items ("Arms Gem G6 · Whetstone G6").
- **An accessory tile's sheet** draws its family's tree: the base at the root, the riders opened by the slot's grade,
  greyed with their gate ("G5") until then, the worn one ringed; one tap wears a rider, as today's rows (D266). A Kindred
  tile adds "Party's strongest: yours" or "Party's strongest: the Shaman's".
- **The damage sheet** (D279) reads the same sources; "accessory" adds each rider's flat on that weapon's row (a Seeker's
  shows "on weak hits").
- **No new art** (lean assets): a type is a text chip and its partner's glyph; a rider is its family's icon with a chip.

## 5. Tier 3 in full

### 5.1 Weapon types, picked at the Tier 3 promotion (T2G28, T2G57)

| Type | Kinds | A weak hit G0 → G10 | The Whetstone or Reagent each grade |
|---|---|---|---|
| **Keen** | Its own | ×1.50 → **×1.70** | +0.02 |
| **Tempered** | Its own + its **Tier 2** partner | ×1.30 → **×1.50** on both | +0.02 on both |
| **Evolved** | Its own + its **Tier 3** partner | ×1.30 → **×1.50** on both | +0.02 on both |

- **Each tier starts where the last ended:** Keen at G0 is Tier 2's G10 Pure; a Tempered partner at G0 is a G10 Dual's.
  With free swaps the round-1 lineage (which Tier 2 type forks into which) gates nothing, so all three are open to every
  weapon (T2G28, kept).
- **T2G57: picked on the Tier 3 Ascend sheet** ([progression](progression.md) T2W37, T2W39). Tier 3 is a promotion
  (classes T2C65), so her page shows **her Tier 3 class's preset with its Suggested Tier 3 types** (§5.2), as the Tier 2
  sheet shows the Tier 2 class's: the coverage bound is held by the Suggested types (T2G55), so they are the default.
  **"As in Tier 2"** copies her Tier 2 parent's kinds as she left them and maps her types, **Pure → Keen, Dual →
  Tempered with the same partner**, one tap; it is offered where her slots match her parent's, every Tier 3 class but the
  Gladiator and the Thaumaturge, whose third slot changes channel. Round 2's "pre-filled from her last" (T2G41) becomes
  that chip. After arrival every type swaps free (T2G22).
- **Still one two-kind weapon in her slots, the Gladiator and the Thaumaturge two** (T2G54); Might × 2.6; grades reset at
  Ascend (D283).

### 5.2 Weapons for the twenty-two, and Arsenal (T2G54–T2G56)

**A Tier 3 class wears her Tier 2 parent's slots and preset** (classes T2C78), the Gladiator and the Thaumaturge
excepted: Arsenal gives them three weapons of their channel and two two-kind weapons.

**T2G54: Arsenal, in gear's terms.** The Gladiator's and the Thaumaturge's slots hold **up to two two-kind weapons**, an
exception to T2G3's one that reads by class (classes T2C85). Everything else is gear's rule: her three kinds all
different, both partners different from them and from each other (so she holds **five kinds, every kind of her
channel**); each type at its own rate (Keen ×1.70, Tempered and Evolved ×1.50 at G10); one grade a kind (D289); the kind
cap (T2G37) on the Orb family alone, since a partner carries no Orb. Her Suggested is classes' preset, one of the kits
that reach all five kinds with Keen on her third (the others, Tempered for Evolved, answer the same):

| | Weapon 1 | Weapon 2 | Weapon 3 | Kinds | Answers alone (regular · sub · boss) |
|---|---|---|---|---|---|
| **Gladiator** | Greatsword, **Evolved + Katana** | Axe, **Tempered + Bow** | Lance, Keen | All five Arms | **1.00 · 1.00 · 1.00** (Keen ×3: 0.76) |
| **Thaumaturge** | Fire, **Evolved + Light** | Blizzard, **Evolved + Dark** | Thunder, Keen | All five elements | **1.00 · 1.00 · 1.00** (Keen ×3: 0.79) |

Every Tier 2–3 foe is weak to at least one Arm and one element (the live dealer: regulars 1 + 2 or 2 + 1, sub-bosses and
bosses 2 + 1 or 1 + 2), so **an Arsenal class answers every foe**, against 0.80–0.91 for a Tier 3 class with one
two-kind weapon. Her weak hits land at ×1.50 on four kinds and ×1.70 on her third, so she trades a little on her best kind for
reach; her party Breaks a little sooner.

**T2G55: what Arsenal does to the coverage bound, and the fix.**

*As drafted* (classes' Arsenal; every other Tier 3 class on T2G50's rule without the bound, her parent's Dual carried as
Tempered or Evolved):

| Tier 3, the owner's mixes | Party 1 (162) | Party 2 (162) | The bound (T2G52) |
|---|---|---|---|
| Regular, mean over all mixes | **4.39** | **4.36** | ≤ 4.31 · ≤ 4.35: **over** |
| … mixes with no Arsenal class (72) | 4.31 | 4.29 | Under |
| … with one (72) | 4.43 | 4.40 | Over |
| … with both, the Gladiator and the Thaumaturge (18) | 4.54 (4.49–4.63) | 4.52 (4.46–4.61) | Over |
| Mixes past the shields' pricing (sub-boss > 4.66 or boss > 4.48) | 30 | 10 | **40 of 324: over** |
| Classes' T6 (all pure: Gladiator, Thaumaturge, Dervish, Mythlord, Bastion) | 4.63 · 4.71 · 4.68 | — | Prices sub-bosses 8 and bosses 10 |
| Classes' T3g (Gladiator, Astromancer, Bladelord, Hierarch, Bastion) | 4.41 · 4.44 · 4.33 | — | 0.10 over Party 1's 4.31 |

**It doesn't hold:** one Arsenal class adds about 0.1 to her party, two about 0.25, and the all-pure comp would price
Tier 3's shields a point up for every party.

*The fix (recommended):* **Tier 3's Suggested types follow T2G50's rule under the bound** (§5.2's table below). The search
keeps every Tier 3 class's single two-kind weapon where the mixes need it and **puts the four pure Tier 3 lines on Keen
×3** (the Dervish, the Starweaver, the Imperator, the Mythlord): their kinds are the ones an Arsenal class already
doubles, and Keen ×1.70 on all three is the pure damage pick.

| Tier 3, the owner's mixes, Suggested (fixed) | Party 1 (162) | Party 2 (162) |
|---|---|---|
| Regular, mean | **4.22** (under 4.31) | **4.25** (under 4.35) |
| … no Arsenal · one · both | 4.14 · 4.27 · 4.39 (4.25–4.48) | 4.17 · 4.29 · 4.42 (4.27–4.49) |
| Sub-boss · boss, mean | 4.28 · 4.18 | 4.30 · 4.21 |
| Mixes past the shields' pricing | **0** (sub-bosses at most 4.51, bosses 4.45) | **0** (4.49, 4.47) |
| Every kind in two hands | 20 | 32 |
| All ten held, in hand · with partners | 94 · 132 | 98 · **162** |
| Kinds in one hand, all 324 mixes | **480** (as drafted 476) | |

| Classes' comp (§6.8) | Members | Regular · sub-boss · boss | Kinds in two hands · in one hand |
|---|---|---|---|
| **T1** The keepers' line (C1's) | Ravager, Astromancer, Bladelord, Hierarch, Bastion | 4.23 · 4.30 · 4.18 | 9 · Bow |
| **T2** The keepers' line (C2's) | Ravager, Astromancer, Runelord, Overlord, Cardinal | 4.28 · 4.33 · 4.28 | 10 · — |
| **T3** A Brawler with a Spellblade | Spellhammer, Astromancer, Dervish, Hierarch, Bastion | 4.16 · 4.22 · 4.12 | 8 · Axe, Light |
| **T3g** The Gladiator beside the Bladelord | **Gladiator**, Astromancer, Bladelord, Hierarch, Bastion | 4.31 · 4.40 · 4.29 | 10 · — |
| **T3b** A Sorcerer with a Tome Spellblade | Ravager, Spellknight, Starweaver, Overlord, Cardinal | 4.10 · 4.22 · 4.00 | 8 · Thunder, Light |
| **T4** A Spellblade with the Paladin | Ravager, Astromancer, Herald, Hierarch, Inquisitor | 4.27 · 4.35 · 4.26 | 9 · Axe |
| **T4b** A Tome Spellblade with the Cleric | Ravager, Astromancer, Oracle, Overlord, Hierophant | 4.28 · 4.33 · 4.28 | 10 · — |
| **T6** All pure, every kind | **Gladiator, Thaumaturge**, Dervish, Mythlord, Bastion | 4.25 · 4.29 · 4.32 | 9 · Fire |
| **T8** A Tier 3 mix | Ravager, Spellknight, Bladelord, Soulcaller, Cardinal | 4.22 · 4.30 · 3.97 | 8 · Greatsword, Thunder |

**With the fix the bound holds in both parties, every one of the 324 mixes keeps the shields' pricing, and it costs
almost nothing in breadth** (480 kinds in one hand against 476; every kind in two hands in 52 mixes, as drafted; all
ten held with partners in 294 against 264). Mixes with both Arsenal classes still answer 4.39 and 4.42 on their own,
0.07–0.08 over their party's Tier 1 figure and inside the shields; the bound reads the party's mean, as T2G52 says.

*The alternatives:*
- **Arsenal's partners land weak but chip no shield:** the means fall to 4.24 · 4.21, but 8 mixes still pass the bosses'
  shields, and it cuts the Breaks classes gives her ("weak hits and Breaks on every foe", T2C83) and adds an exception to
  the partner rule (WP7).
- **One Arsenal class a party:** a party rule like one healer's; the one-Arsenal mixes still average 4.43 · 4.40, so it
  doesn't hold alone.
- **Tier 3's shields 8 · 10:** prices every party for the Arsenal comps (round 1's 10, which XR6 retired).

**T2G56: Tier 3's Suggested on the twenty-two** (every class searched, the Tier 3 classes being new; her answers alone,
regular · sub-boss · boss):

| Class (Tier 2 parent) | Weapons (lead first) | **Tier 3, Suggested** | Answers alone | Keen ×3 |
|---|---|---|---|---|
| Ravager (Berserker) | Greatsword, Axe, Lance | **Evolved Greatsword + Katana**, Keen, Keen | 0.91 · 0.89 · 0.89 | 0.76 |
| Spellhammer (Spellfist) | Greatsword, Katana, Fire (ATK) | Keen, **Evolved Katana + Lance**, Keen | 0.88 · 0.83 · 0.86 | 0.73 |
| **Gladiator** (Spellfist) | Greatsword, Axe, Lance | **Evolved Greatsword + Katana, Tempered Axe + Bow**, Keen | 1.00 · 1.00 · 1.00 | 0.76 |
| Astromancer (Archmage) | Fire, Blizzard, Thunder | **Tempered Fire + Dark**, Keen, Keen | 0.87 · 0.95 · 0.92 | 0.79 |
| Spellknight (Battlemage) | Fire, Blizzard, Katana (M.ATK) | **Tempered Fire + Dark**, Keen, Keen | 0.84 · 0.93 · 0.74 | 0.74 |
| **Thaumaturge** (Battlemage) | Fire, Blizzard, Thunder | **Evolved Fire + Light, Evolved Blizzard + Dark**, Keen | 1.00 · 1.00 · 1.00 | 0.79 |
| Bladelord (Blademaster) | Katana, Axe, Thunder | Keen, Keen, **Tempered Thunder + Light** | 0.80 · 0.79 · 0.78 | 0.69 |
| Herald (Sentinel) | Katana, Greatsword, Light | Keen, **Tempered Greatsword + Bow**, Keen | 0.84 · 0.84 · 0.86 | 0.71 |
| **Dervish** (Bladedancer) | Katana, Axe, Bow | **Keen ×3** | 0.77 · 0.78 · 0.74 | 0.77 |
| Runelord (Runeblade) | Thunder, Blizzard, Katana | **Tempered Thunder + Light**, Keen, Keen | 0.82 · 0.86 · 0.82 | 0.69 |
| Oracle (Enchanter) | Light, Blizzard, Katana | **Evolved Light + Thunder**, Keen, Keen | 0.82 · 0.86 · 0.82 | 0.70 |
| **Starweaver** (Spellweaver) | Thunder, Blizzard, Dark | **Keen ×3** | 0.67 · 0.77 · 0.72 | 0.67 |
| Overlord · Archdruid (Warlord, Druid) | Bow, Axe, Dark | **Tempered Bow + Greatsword**, Keen, Keen | 0.84 · 0.86 · 0.82 | 0.71 |
| **Imperator** (Marshal) | Bow, Axe, Katana | **Keen ×3** | 0.77 · 0.78 · 0.74 | 0.77 |
| Hierarch · Soulcaller (Invoker, Shaman) | Dark, Blizzard, Bow | **Tempered Dark + Fire**, Keen, Keen | 0.84 · 0.93 · 0.73 | 0.68 |
| **Mythlord** (Animist) | Dark, Blizzard, Thunder | **Keen ×3** | 0.67 · 0.77 · 0.72 | 0.67 |
| Bastion · Inquisitor (Guardian, Templar) | Lance, Greatsword, Light | Keen, Keen, **Evolved Light + Thunder** | 0.80 · 0.74 · 0.86 | 0.71 |
| Cardinal · Hierophant (Bishop, Exorcist) | Light, Fire, Lance | Keen, Keen, **Evolved Lance + Bow** | 0.83 · 0.77 · 0.83 | 0.71 |

- **Four Keen ×3, all four pure lines:** they are the classes whose party has an Arsenal class beside them in the
  all-pure comps, and Keen is their damage pick. Every other class keeps one two-kind weapon.
- **Tempered or Evolved by the mixes:** the search picks whichever partner leaves the fewest kinds in one hand; neither
  is better alone (both ×1.50 at G10).
- **"As in Tier 2"** (T2G57) maps a Tier 2 Dual to Tempered on the same slot, so a player who keeps her Tier 2 kit keeps
  her Tier 2 breadth; the Suggested kit is the one the bound was measured on.

### 5.3 Armor

Tier 1's × 2.6, her class's half, no path (the Lining carries the step): Head DEF · Arms M.DEF 10, 21, 31, 42, 52, 62,
73, 83, 94, **104**; Body HP 39, 78, 117, 156, 195, 234, 273, 312, 351, **390**; Legs MP 8, 16, 23, 31, 39, 47, 55, 62,
70, **78**; Feet Speed 2 a grade (12% at G10); offense a piece 3, 3, 5, 5, 8, 8, 10, 10, 13, **13**.

### 5.4 The accessory tree: the step and the third ring

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

**Measured at Tier 3's Lv 50** (round 2, §4.7's measure on the 40-region world, the step's values; Seeker, Onset, Finisher and Limit Orb estimated the same
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
- **The kind cap** is +177: three stepped Great Orbs (+219) cap there; a Limit Orb's rider and a Seeker's count when they
  land.


**The new profiles at Tier 3's Lv 50** (§4.8's proxies, the step's values; Apex measured as an Insignia on bosses; % of
her damage a turn, fights · sub-bosses · bosses · mean):

| Profile | Its best set by column | Great ×3 | The preset |
|---|---|---|---|
| **Single-hit cross, ATK** (Spellhammer) | Great ×3 in every column | 21.9 · 24.7 · 21.2 · **22.4** | Great ×2 + Great Orb 18.6 |
| **Single-hit cross, M.ATK** (Spellknight) | Seeker ×3 ≈ 23.5 · Great Orb ×2 + Great Insignia 28.8 · Seeker ×3 ≈ 25.9 · Seeker ×3 ≈ **24.7** | 23.1 | Great ×2 + Great Orb **24.0** |
| **Pure pair, one foe** (Dervish, Starweaver) | Great ×3 19.7 · Great ×2 + Great Insignia 25.3 · Great ×2 + Apex 21.0 · Great ×3 **20.9** | 20.9 | Great ×2 + Twofold Orb 17.9 |
| **Pure pair, area** (Imperator, Mythlord) | Great ×3 23.3 · Great Orb ×2 + Great Insignia 25.6 · Great ×2 + Apex 20.8 · Great ×3 **22.9** | 22.9 | Great ×2 + Great Orb 22.7 |
| **Arsenal** (Gladiator; the Brawler's profile) | Great ×3 18.7 · Great ×2 + Great Insignia 26.9 · Great ×2 + Apex 22.4 · Great ×3 **21.0** | 21.0 | Great ×2 + Great Orb 17.4 |

- **D266 at Tier 3** (T2G60): with the new 16 cells, **Great 17 of 48** (round 2's 6 and the new 11), Seeker 11, Great
  Insignia 6, Great Orb 6, Apex 5, Twofold Orb 4, Finisher 5, Limit Orb 3, Twofold 3, Onset 2, Kindred 7 of the party
  cells: **no form over half, every form someone's best**; Apex gains the pure pairs' boss cells.
- **Arsenal at Tier 3:** her weak-hit share on the Brawler's profile is 41–51%; answering every foe lifts it toward two
  thirds, worth about 1.5 points to Seeker ×3 (10.6 here), never near Great ×3 (21.0).
- **Three slots add 19.5–27% with her best set** at Tier 3's Lv 50, the presets 17–24%.

### 5.5 Presets and costs in Tier 3 (T2G58)

**A Tier 3 class wears her Tier 2 parent's preset** (weapons, Suggested Tier 3 types, accessory forms), but the Gladiator
and the Thaumaturge, whose weapons are their own (§5.2); the keeper healers' children take **Vow** from a slot's Tier 3
G5, which Overflow (T2C87) puts to a second use.

| Tier 3 class | Accessories, a slot G1–G4 | A slot G5 on | Weapons and Suggested types |
|---|---|---|---|
| Ravager | Great Pendant ×2, Great Orb (Greatsword) | the same | §5.2 |
| Spellhammer · **Gladiator** | Great Pendant ×2, Great Orb (Greatsword) | the same | §5.2; the Gladiator Arsenal's |
| Astromancer | Great Charm ×2, Great Orb (Fire) | the same | §5.2 |
| Spellknight · **Thaumaturge** | Great Charm ×2, Great Orb (Fire) | the same | §5.2; the Thaumaturge Arsenal's |
| Bladelord | Twofold Pendant ×2, Great Orb (Katana) | the same | §5.2 |
| Herald | Twofold Pendant ×2, Great Orb (Katana) | **Kindred Pendant**, Twofold Pendant, Great Orb | §5.2 |
| **Dervish** | Great Pendant ×2, **Twofold Orb (Katana + Axe)** | the same | Keen ×3 |
| Runelord | Twofold Charm ×2, Great Orb (Thunder) | the same | §5.2 |
| Oracle | Twofold Charm ×2, Great Orb (Light) | **Kindred Charm**, Twofold Charm, Great Orb | §5.2 |
| **Starweaver** | Great Charm ×2, **Twofold Orb (Thunder + Blizzard)** | the same | Keen ×3 |
| Overlord | Twofold Pendant ×2, Great Orb (Bow) | the same | §5.2 |
| Archdruid | Twofold Pendant ×2, Great Orb (Bow) | **Kindred Pendant**, Twofold Pendant, Great Orb | §5.2 |
| **Imperator** | Great Pendant ×2, Great Orb (Bow) | the same | Keen ×3 |
| Hierarch | Twofold Charm ×2, Great Orb (Dark) | the same | §5.2 |
| Soulcaller | Twofold Charm ×2, Great Orb (Dark) | **Kindred Charm**, Twofold Charm, Great Orb | §5.2 |
| **Mythlord** | Great Charm ×2, Great Orb (Dark) | the same | Keen ×3 |
| **Bastion** | Great Pendant ×2, Great Orb (Lance) | **Vow Pendant**, Great Pendant, Great Orb | §5.2 |
| Inquisitor | Great Pendant ×2, Great Orb (Lance) | the same | §5.2 |
| **Cardinal** | Great Charm ×2, Great Orb (Light) | **Vow Charm**, Great Charm, Great Orb | §5.2 |
| Hierophant | Great Charm ×2, Great Orb (Light) | the same | §5.2 |

- **Why a Tier 3 class wears her parent's:** her rule multiplies her hits or adds farewells and Barriers (T2G59), so no
  form changes rank; a preset that changed with the promotion would only move a tap.
- **Costs:** as Tier 2 (§4.11): every grade takes its line's two items; types and forms nothing; Arsenal's second
  two-kind weapon nothing.

## 6. Provides and assumes

**How the forty-two are priced here.** Coverage reads only each class's kinds, so it is exact on classes' presets. The
accessory forms are priced on a profile: round 2's eight Tier 1 profiles for the classes that keep one (a keeper, a
support with a lower share, a battle healer), and round 3's proxies for the three new kinds of hitter (§4.8):

| Class (round 3) | Assumed (classes.md owns) | Priced as |
|---|---|---|
| **Keepers, supports, healers** of both tiers | Their parent's slots, hands, weapons and armor half; their rule multiplies her hits or adds farewells, wards, mends | Their Tier 1 ancestor, measured (round 2): Momentum, Pinpoint doubled, Juggernaut, Resonance and Spellbind scale every self form alike |
| **Spellfist, Battlemage; Spellhammer, Spellknight** | 2 + 1 slots, every hit on her stat (the cross), one act, one-foe kinds, Pinpoint (T2C71–T2C73) | The single-hit cross proxies (§4.8) |
| **Bladedancer, Spellweaver, Marshal, Animist; Dervish, Starweaver, Imperator, Mythlord** | Three slots of one channel, the pure pair, every hit on her stat (T2C67, T2C68) | The pure-pair proxies (§4.8), her parent's hands |
| **Gladiator, Thaumaturge** | Three slots of one channel, two two-kind weapons (T2C85), hand ×1.05 | The Brawler's and the Sorcerer's profiles, her weak-hit share raised (§4.8, §5.4) |

| To or from | Provides (this doc's) | Assumes (theirs) | If not |
|---|---|---|---|
| **[T2C](classes.md) classes** | Types per class slot on the forty-two (T2G47); the crosses' other-channel weapons as gear reads them (T2G48); the pure variants' (T2G49); **Suggested types for the twenty and the twenty-two** (T2G51, T2G56); **Arsenal's two two-kind weapons, an exception to T2G3 by class, and its coverage fix in Tier 3's Suggested types** (T2G54, T2G55); armor's half (T2G61); presets' accessories (T2G58) | Classes' slots, presets (T2C77) and the Tier 3 classes' own presets (T2C85); one healer a party; a class switch is free and each class keeps its weapons; the party hint names a missing kind (T2C94) | A different cross or pure kit re-runs the Suggested search (§4.4, §5.2); the bound is checked on it |
| **[T2E](extra-stats.md) extra stats** | Accessories read **stats, kinds and conditions** (rank, timing, weak hits, wounded foes, bosses, Limit Breaks); the kind cap binds the Orb family only (T2G37); Kindred is a hits-only bonus beside the ★ | **Shapes (AoE, multi-hit) are Extra Stats' axis** (R2-8); Prowess all to her stat for the crosses and the pure classes (classes' provides) | If T2E adds a weak-hit or wounded percentage, it joins T2G38's one Insignia factor or halves |
| **[T2P](professions.md) professions** | Every Tier 2 grade takes both items (T2P29): Arms Whetstone and Tome Reagent raise a weapon's **type**; **Armor Lining carries armor's tier step**; Accessory Inlay raises the worn form's **rider**; no item a type or a form; **the Arms/Tome split by class** (a cross 2/1 or 1/2 as her slots, a pure variant 3/0 or 0/3, the Gladiator 3/0, the Thaumaturge 0/3) | Recipes 10 · 10 · 3 · 5 for both items; Craft Lv 5g − 4; Ascend gives both back | A path that needed its own item would come back against T2P39 |
| **[T2B](balance.md) balance** | Weak multipliers by type and grade (§4.1, §5.1); **coverage by party and by comp in both tiers, and the bound held on the Suggested types** (T2G52, T2G53, T2G55): every mix's sub-boss and boss answers inside the shields' pricing, so sub-bosses 7 and bosses 9 stand in Tiers 2 and 3; the riders' measured worth and estimates; the new profiles' forms (T2G59, T2G60) | Weaknesses v2's three kinds in Tiers 2 and 3 (live); the shields' rule (T2B7, CP8's); party value (R2-11); Tier 3's term; **the new kits as classes drafts them** (hands, Pinpoint, the pure pair, Arsenal's ×1.05), not yet measured by balance | If balance's measured kits change a profile's kind shares, §4.8's proxies re-run; if a rider tops half a class's cells, its knob in T2G31–T2G33 steps first |
| **[T2U](templates.md) templates** | Any form of her ★ family counts; from Tier 2 a Twofold form makes every ★ family pay on any weapons (T2G35), the one-stat classes included | The ★ at 0.1 a level × tier | — |
| **[T2W](progression.md) progression** | **The Tier 3 sheet's weapons page:** her Tier 3 class's preset and Suggested Tier 3 types, "As in Tier 2" a chip (T2G57; T2W39 aligned); Arsenal's two two-kind rows; types re-picked at each promotion, forms carry (T2G41); every tree open by a slot's G5 in Tier 2 and Tier 3 | Ascend as D283; the Tier 3 promotion (T2W37) | — |

## 7. Save and engine

Rough, not packets: Tier 2's toolbox release (T2W15: engine v22, save v39), Tier 3's (v23, v40).

| Change | Kind |
|---|---|
| Each class's slot gains `type?: 'pure' \| 'dual'` (Tier 2) or `'keen' \| 'tempered' \| 'evolved'` (Tier 3), on all forty-two classes; the partner is the table's, never stored; a missing type reads the class's Suggested | Save |
| **The two-kind cap read by class** (T2G62): 1, the Gladiator's and the Thaumaturge's 2; a save that holds two on another class is refused as today's one-Dual rule | Validation (Tier 3's stage, `t3Classes` v23) |
| An accessory slot's `form` widens: Pendant and Charm `great \| twofold \| kindred \| vow`, Orb `great \| twofold \| seeker \| limit` (+ `kind2` for a Twofold Orb), Insignia `great \| onset \| finisher \| apex`; a form above the slot's ring reads its base until the grade opens it | Save |
| A Tier 2 raise spends both items (professions' T2P29) | Save, the Gear tab |
| A weapon's weak multiplier by type and grade in place of `BATTLE_WEAK`; a two-kind weapon's partner on its hits (two weapons' on an Arsenal class) | **Engine** (`t2Gear`) |
| **A cross's other-channel hit:** her stat + that weapon's Might, its kind for everything else (classes T2C35) | **Engine** (`t2Classes`, classes' stage) |
| Great and Twofold riders, the Great Orb, the Twofold Orb, Great Insignia | **No engine:** frozen stats, `flat` and the Insignia value, as D264's slots |
| **Kindred:** the party's strongest, summed from one Uma's slots, added to every ally's hits-only bonus when the fight is built | **No engine:** frozen input beside the ★ (`signature`), validation widened |
| Vow: a heal-only stat | **Engine:** the mend's stat reads it |
| Onset, Finisher, Apex conditions; Seeker's and Limit Orb's flat on a weak or a Limit Break hit | **Engine:** five conditions at steps 1 and 4 |
| The kind cap over the Orb family; one Insignia factor | Where `flat` and the factor are summed |
| The Suggested types and presets of the forty-two (T2G51, T2G56, T2G58) | Data beside `RPG_WEAPON_PRESETS`; the Tier 3 sheet reads them (T2G57) |

## 8. Pacing

- **Types come with the promotion:** a Tier 2 weapon has its type from Lv 1, at Tier 1's ×1.3, growing +0.02 a grade to
  ×1.5 at Lv 46; Tier 3's from its own Ascend, Keen from ×1.5 to ×1.7. Nothing waits on a G5.
- **The tree opens on the grade gate:** its first ring with a slot's first grade (Lv 1), its second at G5 (Lv 21); Tier
  3's step from Lv 1, its third ring at G5 (Lv 21). Every slot's tree is whole by Lv 21 of its tier.
- **Arsenal costs nothing extra:** a type is free and her five kinds are three weapons' grades; her farm is the Brawler's
  or the Sorcerer's.
- **Making time** is professions' (T2P41: every grade takes two items, so a tier's farm doubles; the fighting party holds
  G10 on day 23.4, Tier 1's 23.0).
- **Gear's damage by tier** (measured, §4.7, §4.8, §5.4): three slots add 11–13% of an Uma's damage in Tier 1 (D266);
  her best set at Tier 2's Lv 50 adds 18–25%, the preset 15–23%; at Tier 3's 19.5–27% and 17–24%. That rise is the
  toolbox, priced in T2B's foe term.
- **Coverage doesn't speed fights:** answers stay at or under Tier 1's in both parties' means, and sub-boss and boss
  shields rise one with theirs.

## 9. Decisions

Every call, with the recommended answer. Round 3's first; rounds 1 and 2 keep their ids, and a call round 3 replaces says
**Superseded (R3-n)**.

### 9.1 Round 3 (T2G47–T2G63)

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **T2G47** Weapons for the forty-two | **Every Tier 2 and Tier 3 class takes a type per slot, her own three weapons each (T2G23 on the forty-two); slots, channels and the stat each hit reads are classes'; one two-kind weapon in her slots, the Gladiator and the Thaumaturge two** | A type on the kind (round 1's T2G5) | Each class keeps its own weapons; one grade serves every class |
| **T2G48** The crosses' other-channel weapons | **The Spellfist's Fire Tome on ATK and the Battlemage's Katana on M.ATK** (their Tier 3 children the same): any kind of the slot's channel, its grade's Might to her stat, its own channel's items raise it; one grade every reader. Supersedes T2G25 | Round 2's Scatter twins (Thunder, Lance) or Heavy twins (Fire, Greatsword) | Classes reshaped them to single big hits (R3-2, R3-3); the slot rule is unchanged, only the kind |
| **T2G49** The pure variants' weapons | **Three weapons of one channel, any kind in any slot (her third her second half); her stat's family on every hit; 300 refined of her channel a rank** | Her parent's 2 + 1 channels with the stat crossed (a cross by another name) | Classes' pure pair (T2C68): her family's feel, one channel |
| **T2G50** Suggested types' rule | **One two-kind weapon or none a class, searched over every mix of the owner's two parties for the fewest kinds in one hand, under the coverage bound (T2G52); Tier 2's keepers and battle healers keep round 1's Dual; every Tier 3 class searched.** Supersedes T2G26 | Round 2's one Dual a class, no bound (10 Tier 2 and 40 Tier 3 mixes past the shields); every keeper re-searched in Tier 2 (248 kinds in one hand against 276, six Duals moved, C1's Katana in one hand) | The bound is what lets the shields stay 7 · 9; the keepers' Duals are what balance measured |
| **T2G51** Tier 2's Suggested on the twenty | **§4.4's table: the Spellfist Dual Katana + Axe, the Battlemage Dual Fire + Dark, the Spellweaver Dual Thunder + Light, the Animist Dual Blizzard + Light, the Druid Dual Bow + Greatsword; the Bladedancer, the Marshal and the Enchanter Pure ×3; the rest round 2's** | Each Uma's best alone (her own answers, 0.80–0.91) | The rule on the 144 mixes: every party under Tier 1, every mix inside the shields |
| **T2G52** The coverage bound, per party | **For each of the owner's two parties, the mean over every mix of its seats answers a regular no more than its Tier 1 party (4.31 · 4.35); no mix's sub-boss or boss answers pass the shields' pricing (4.66 · 4.48 for 7 · 9); every kind in two hands the search's aim.** Amends T2G2 | Every mix under Tier 1 (fails on some mixes by up to 0.17, the dealer's spread); the named comps only | It reads what the owner fields, and the shields are the bound's mechanical edge |
| **T2G53** Coverage on the twenty | **Measured: Party 1's mixes 4.25 · 4.35 · 4.23, Party 2's 4.18 · 4.27 · 4.24 (regular · sub-boss · boss); all 144 inside the shields; classes' comps 4.16–4.32 a regular; C1, C2 and C9 every kind in two hands.** Supersedes T2G27 | — | The bound holds; the swap comps put one to three kinds in one hand, the price of single big hits |
| **T2G54** Arsenal in gear | **The Gladiator's and the Thaumaturge's slots hold up to two two-kind weapons (T2G3's exception, read by class); her three kinds and both partners all different, so all five of her channel; every other rule as any weapon's; Suggested Greatsword Evolved + Katana, Axe Tempered + Bow, Lance Keen; Fire Evolved + Light, Blizzard Evolved + Dark, Thunder Keen.** Amends T2G3 | A fourth slot; one two-kind weapon with a wider partner (classes' T2C85 alternatives) | Classes' "more varied physical weapons", in one number gear already has |
| **T2G55** Arsenal and the coverage bound | **As drafted it fails** (Tier 3's means 4.39 · 4.36 against 4.31 · 4.35; 40 of 324 mixes past the shields; the all-pure T6 4.63 · 4.71 · 4.68). **Fix: Tier 3's Suggested types under the bound (T2G50), which puts the four pure Tier 3 lines on Keen ×3:** means 4.22 · 4.25, no mix past the shields, T6 4.25, T3g 4.31; 480 kinds in one hand against 476 | Arsenal's partners land weak but chip nothing (4.24 · 4.21, 8 mixes past, cuts her Breaks); one Arsenal class a party (4.43 · 4.40 on its mixes: fails); Tier 3's shields 8 · 10 (every party pays) | The fix moves no rule and no class, only four defaults, and keeps the breadth |
| **T2G56** Tier 3's Suggested on the twenty-two | **§5.2's table: one Tempered or Evolved weapon a class, the Gladiator and the Thaumaturge two, the Dervish, the Starweaver, the Imperator and the Mythlord Keen ×3** | Her Tier 2 Dual mapped to Tempered on every class (round 2's pre-fill: over the bound with Arsenal) | T2G50's rule on the 324 mixes |
| **T2G57** Types at the Tier 3 promotion | **The Tier 3 sheet pre-fills her Tier 3 class's preset and Suggested Tier 3 types; "As in Tier 2" copies her parent's kinds and maps her types (Pure → Keen, Dual → Tempered, the same partner), offered where her slots match (not the Gladiator, the Thaumaturge); free swaps after.** Amends T2G28, T2G41 | Pre-filled from her last (round 2: default kits over the bound with Arsenal); Suggested with no chip | Tier 3 is a promotion into a new class; the bound lives in the defaults; her own kit is one tap |
| **T2G58** Presets for the forty-two | **§4.9 and §5.5: her stat twice and an Orb; Great for the one-stat classes (the pures' keepers, the crosses, the pure variants, Arsenal) and the healers, Twofold for the hybrid keepers and supports; the supports Kindred from a slot's G5; the one-foe pure pair's Orb a Twofold Orb on her lead two; a Tier 3 class her parent's, the keeper healers' children Vow from Tier 3's G5.** Supersedes T2G36 | Each class's best set (Great ×3 on most one-stat classes); a Great Orb on the pure pair too (1.1 points less) | D266's shape by role: 15–23% at Tier 2 Lv 50, 17–24% at Tier 3's, best in one column |
| **T2G59** The forms that suit the new profiles | **One stat on every hit takes Great (the crosses, the pure variants, Arsenal); the one-foe pure pair a Twofold Orb, the area pair a Great Orb; Tier 3's rules move no ranking (they multiply), but Overflow gives Vow a second use** | A form of their own for the new profiles (nothing the tree lacks) | Measured on the proxies (§4.8) |
| **T2G60** D266 re-checked | **On the harness with proxies at Tier 2 and Tier 3 Lv 50: Great the most-won form, 18 and 17 of 48 cells (under half); every form still someone's best; the presets 17.9–24.0% on the new profiles.** Confirms T2G45 | Wait for the built kits | The rule the owner set (D266) holds on every class we can play today |
| **T2G61** Armor for the forty-two | **Her Tier 1 ancestor's half on every Tier 2 and Tier 3 class** (a cross's and a pure variant's the stat every hit reads); no Tier 2 path; the Lining the tier step. Amends T2G29 | A half by her class's channels (a cross's other half: reaches nothing) | Leans and halves never change with a promotion (classes §4.1) |
| **T2G62** Save and engine (round 3) | **`type` per slot on forty-two classes; the two-kind cap read by class (1, the Gladiator and the Thaumaturge 2) in validation on Tier 3's stage; Suggested types and presets as data beside the presets.** Amends T2G44 | A per-class cap field in the save (derivable) | One table, read where validation already counts two-kind weapons |
| **T2G63** The previews (round 3) | **Six pages: tiers, weapons for the forty-two, Arsenal and the bound (new), the accessory tree with the new profiles, presets for the forty-two, armor and costs** | Arsenal inside the weapons page | The bound needed a page of its own to be read |

### 9.2 Round 2 (T2G21–T2G46)

Status in round 3 after each call's name ([§3.3](#33-round-2-t2g21t2g46-in-round-3)).

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **T2G21** Types at promotion · *Kept* | **On the Ascend sheet her new class's three weapons and each one's type, Suggested pre-set (T2W19); she arrives at G0 with them, and a type works from G0** | The type at a weapon's G5 (round 1's T2G4); a type item | The owner: "selected to their new weapon types on Tier 2 promotion" |
| **T2G22** The swap rule · *Kept* | **Free: one tap on the Gear tab, outside fights; no item, lock or cooldown; nothing on screen tailors a stage** | A re-type item (one grade's Whetstone); a swap only at camps | The owner's "easier to swap around"; a type has no grade of its own; tailoring a stage gives 4.72 answers, under Tier 1's 5.00 with every kind graded |
| **T2G23** Whose type · *Kept* | **Her class's slot setting; the grade stays the weapon kind's (D289)** | A type on the kind (round 1's T2G5) | Each class keeps its own weapons; one grade serves every class, each with its own type |
| **T2G24** Tier 2's types · *Kept* | **Pure ×1.30 → ×1.50 and Dual (its own kind ×1.30, its partner ×1.10 → ×1.30), +0.02 a grade from the Whetstone or Reagent; no plain weapon** | Fixed ×1.5 from G0; the partner at ×1.3 from G0 | T2P29's second item raises the path at every grade; G10 is round 1's values, so every Lv 50 measure holds |
| **T2G25** The expanders' cross weapons · *Superseded (R3-2, R3-3) by T2G48* | **Any kind of a slot's channel; a kind's grade gives its Might to the stat she reads (ATK for the Spellfist's Tome, M.ATK for the Battlemage's Arm); its own channel's items raise it; the kits are classes' (T2C54); gear's alternative for the cross-reference: the Scatter twins** | A cross weapon with its own grade; a cross weapon raised by her lead channel's items | One grade, every reader (D289); the Scatter twins keep every kind in two hands with both pures expanded (4.19), the Heavy twins don't (4.17) |
| **T2G26** Suggested types · *Superseded (R3-4) by T2G50, T2G51, T2G56* | **The table in §4.4 on classes' presets: one Dual a class, the rest Pure; the keepers round 1's; Spellfist Greatsword + Bow, Battlemage Fire + Dark, Sentinel and Enchanter Katana + Axe, Druid and Shaman Dark + Fire, the battle healers their keepers'; Tier 3 Evolved for the Archmage, the Spellblade keepers and the Druid, Tempered for the rest, Keen otherwise** | Each Uma's best alone | The fewest kinds in one hand over all 64 mixes of the owner's comps |
| **T2G27** Coverage · *Superseded (R3-2–R3-4) by T2G52, T2G53, T2G55* | **Measured on classes' comps: Tier 2 4.17–4.32 a regular (C1, C2 4.28 · 4.29 with every kind in two hands; the expander comps one to three kinds in one hand), Tier 3 4.14–4.38; sub-boss and boss shields +1 from Tier 2 Lv 1** | — | A later tier's regulars answered no more than Tier 1's; the types come with the promotion, so the breadth gate is Lv 1 |
| **T2G28** Tier 3's types · *Kept, changed (R3-1): T2G57* | **Keen ×1.50 → ×1.70, Tempered and Evolved ×1.30 → ×1.50 on both kinds; picked on the Tier 3 Ascend sheet, pre-filled (Pure → Keen, Dual → Tempered); swapped freely; no lineage** | Round 1's forks (Pure → Keen or Tempered) | With free swaps a lineage gates nothing; each tier starts where the last ended |
| **T2G29** Armor · *Kept, changed (R3-6): T2G61* | **Tier 1's × tier on her class's half (an expander's one stat); no Tier 2 path; the Armor Lining carries the rest of the × tier** | A lining to her other half (T2P30's assumption) | A second half is +5% for twelve classes, nothing for four (R2-11); professions' own fallback keeps Hides at 30 |
| **T2G30** The tree's shape · *Kept* | **Every form its family's base plus one rider (Kindred its whole row); rings at a slot's G1 and G5 in Tier 2, the step from G1 and a ring at G5 in Tier 3; a form is a free setting, one tap** | Rings at G4 and G8; a form that costs an item to open; bases dropped | The Inlay raises the worn rider from the first grade (T2P29); every tree whole by G5; one tap stays one tap (D266) |
| **T2G31** The stat family · *Kept* | **Great +0.3 (Tier 3 0.4) on her stat; Twofold +1 (1.1) on her other stat; Kindred her +1 shared, +0.2 on every Uma (no step); Vow (Tier 3, G5) +1 on her mends, Barriers, revives** | Kindred +0.3 (half the party cells); a heal-only Great | Measured: each someone's best; Vow lifts a keeper healer's mends ×1.13 against Great's ×1.09 |
| **T2G32** The Orb family · *Kept* | **Great Orb +0.6 (0.8) on her kind; Twofold Orb +0.8 (1.0) on a second kind; Seeker +0.4 (0.6) on any weak hit; Limit Orb (Tier 3, G5) +1.3 on her Limit Breaks' hits** | Seeker +0.6 (17 of 32 cells) or +0.3 (one); Twofold Orb at 1.4 + 1.4 (round 1); a one-kind weak Orb (best nowhere) | Measured and estimated: each someone's best, Seeker the highest at 8 |
| **T2G33** The Insignia family · *Kept* | **Great Insignia +0.3% (0.4%); Onset +0.6% (0.7%) on her first act each wave; Finisher +0.4% (0.6%) on foes below half HP; Apex (Tier 3, G5) +0.8% on bosses** | Onset at round 1's 1.5% alone (the healers' cells); Apex +1% (lifts the ceiling) | Each someone's best; the ceilings stay near round 1's |
| **T2G34** Kindred's reach · *Kept* | **Every Uma's hits, herself included, both stats, never a heal; the party takes its strongest Kindred, never the sum; frozen when the fight starts** | Added across Umas; to allies only; a real stat | Two supporters don't stack (the owner's fear); no engine rule |
| **T2G35** ★ by tier · *Kept* | **Any form of her ★ family counts; from her first Tier 2 grade her family's Twofold pays on any weapons, so her ★ goes first for everyone** | D266's exception in every tier | The Twofold form makes the exception's reason go away |
| **T2G36** Presets for sixteen · *Superseded (R3-4) by T2G58* | **Round 2's table: Great ×2 + Great Orb for the one-stat classes and the healers; Twofold ×2 + Great Orb for the hybrids; the supporters Kindred, Twofold, Great Orb from a slot's G5; the keeper healers Vow, Great, Great Orb from Tier 3's G5; her ★ first** | Each class's best set (a preset per fight); Tier 1's set (12–17%) | D266's shape by role: 15–22% at Tier 2 Lv 50, best nowhere |
| **T2G37** The kind cap · *Kept* | **The Orb family on one kind (every base, the Great and Twofold Orbs, Seeker's and Limit Orb's riders when they land) at most +68 · +122 · +177** | No cap; the cap on stats too | Binds only stacked Great Orbs; stats, Kindred and Extra Stats' kind rows outside |
| **T2G38** One Insignia factor · *Kept* | **Every Insignia slot whose condition holds adds into one factor, bases and riders alike** | Each form its own factor | Today's "slots added"; bounded at three slots (×1.48 · ×1.54) |
| **T2G39** What types and forms cost · *Kept* | **Nothing; a kind never raised is at G0** | A re-type or re-form item | The grade is the cost; trying is free |
| **T2G40** The second items (R2-9) · *Kept* | **Aligned with T2P29: every Tier 2 grade takes its line's two items; the Whetstone or Reagent raises the weapon's type, the Lining armor's tier step, the Inlay the worn rider** | The second item only on dual choices (idles a branch on every Pure pick) | Every branch's demand equal (T2P39); every swap free |
| **T2G41** Ascend · *Kept, changed (R3-1): T2G57* | **Grades reset and both items go home (D283); types re-picked at each promotion, pre-filled from her last; forms carry (Tier 2's open from Tier 3's G1)** | Types carry unasked (round 1's T2G17) | R2-6 picks at every promotion; nothing re-earned |
| **T2G42** Names · *Kept* | **New: Kindred Pendant, Kindred Charm, Seeker Orb, Finisher Insignia, Vow Pendant, Vow Charm, Limit Orb, Apex Insignia. Kept: Pure, Dual, Keen, Tempered, Evolved, partner, Great, Twofold, Onset. Checked: no master-data match** | "Honed" (a Tome Spellblade depth word); "Prism" (a master-data string) | One word, one meaning |
| **T2G43** Screens and art · *Kept, changed (R3-1)* | **The Ascend sheet's weapons rows; a type chip and its partner's glyph on the weapon tile; the accessory sheet draws its family's tree; Kindred's tile names the party's strongest; no new art** | New icons a form | Lean assets; one tap stays one tap |
| **T2G44** Save and engine · *Kept, changed: T2G62* | **`type` per class slot; the forms' ids per family and `kind2`; Tier 2's engine stage for types by grade, partners, Vow, Seeker, Onset, Finisher, Limit Orb and Apex; Kindred and the rest frozen stats** | — | D264's pattern for slots |
| **T2G45** The viability check · *Kept; re-run in T2G60* | **D266's rule on 32 cells a tier, by her damage and by party value; the estimated riders confirmed by the simulation with the rules built, each with its knob: Seeker +0.3, Onset +0.5%, Finisher +0.3%, Limit Orb +1.2, Apex +0.6%, Kindred +0.15** | Her damage alone (Kindred never counts) | R2-11's party value is how a support form is worth anything |
| **T2G46** No shapes on accessories · *Kept* | **AoE and multi-hit are Extra Stats' (R2-8); the accessory tree reads stats, kinds and conditions** | A Sweep or Volley Orb | Two systems on one condition stack too fast; kinds are the shapes' halves already |

### 9.3 Round 1's calls (T2G1–T2G20)

| Call | Round 1's recommendation | Status |
|---|---|---|
| T2G1 | The partner table | **Kept** |
| T2G2 | The coverage check | **Kept** (T2G52 states it per party) |
| T2G3 | One two-kind weapon in her slots, Tiers 2 and 3 | **Kept, changed (R3-2, R3-3)**: Arsenal's two (T2G54) |
| T2G4 | The weapon's G5 item sets its branch; a re-forge is one more G5 item | **Superseded (R2-6)** by T2G21, T2G22 |
| T2G5 | A branch belongs to the weapon kind | **Superseded (R2-6)** by T2G23 |
| T2G6 | Suggested Duals | **Kept, changed** (R2-2, R3-4): T2G50 |
| T2G7 | Weak multipliers ×1.3 · 1.5 · 1.7 | **Kept** (reached at G10, T2G24) |
| T2G8 | Armor Tier 1 × tier, her class's half | **Kept, changed** (R2-3): T2G29 |
| T2G9 | A slot's G5 opens two branches a family | **Superseded (R2-7)** by T2G30 |
| T2G10 | Branch values | **Kept, changed** (R2-7): T2G31–T2G33 |
| T2G11 | Onset: her first act each wave | **Kept** (its rider T2G33) |
| T2G12 | ★ on any weapons from a slot's G5 | **Kept, changed**: from G1 (T2G35) |
| T2G13 | Presets: Great or Twofold by pure or hybrid | **Superseded (R2-2)** by T2G36, then T2G58 |
| T2G14 | The kind cap on Orb forms | **Kept** (T2G37) |
| T2G15 | One Insignia factor | **Kept** (T2G38) |
| T2G16 | 30 refined a line a rank, no new item | **Kept** (T2G40: 30 a branch) |
| T2G17 | Branches and forms carry through Ascend | **Superseded (R2-6)** by T2G41 |
| T2G18 | Names | **Kept** (T2G42 adds) |
| T2G19 | Screens: a branch chip, rows from G5 | **Superseded (R2-6, R2-7)** by T2G43 |
| T2G20 | Save and engine | **Kept, changed**: T2G44 |

### 9.4 Where the owner may want to look first

| Call | Why it's worth his eye |
|---|---|
| **T2G55** Arsenal breaks the coverage bound, and the fix | As drafted the Gladiator and the Thaumaturge answer every foe, so Tier 3's parties answer more than Tier 1's and the all-pure comp would raise every boss's shield; the fix leaves Arsenal whole and moves four defaults (the pure Tier 3 lines on Keen ×3) |
| **T2G57** The Tier 3 sheet pre-fills the new class's Suggested, not her Tier 2 kit | The bound lives in the defaults; her own kit is the "As in Tier 2" chip |
| **T2G52** The bound, stated per party | Round 2 read it comp by comp and let C4 pass at 4.38; round 3 reads each party's mean over every mix it can field and holds every mix inside the shields |
| **T2G51** Three Tier 2 classes Suggested Pure ×3 | The Bladedancer's, the Marshal's and the Enchanter's one legal Dual only doubles a kind their party holds |
| **T2G60** Great becomes the most-won form | Every new profile reads one stat on every hit; still under half the cells, every form someone's best |
| **T2G48** The crosses' other channel is a one-foe kind | The Spellfist's Fire on ATK and the Battlemage's Katana on M.ATK (round 2: Thunder, Lance) |
| Round 2's: **T2G22** free type swaps, **T2G34** Kindred, **T2G29** armor with no path | Stand as round 2 asked him to look at them |

## 10. Previews

**Made** ([previews/](previews/)): [gear-tiers.html](previews/gear-tiers.html) (one Uma's Gear tab Tier 1 → 2 → 3 for any
of the forty-two, what opens when, every row at G10), [gear-weapons.html](previews/gear-weapons.html) (the Ascend sheet's
weapons step in both tiers, types by grade, the partner table, Suggested for the forty-two, coverage by party and by comp),
[gear-arsenal.html](previews/gear-arsenal.html) (**new:** Arsenal's five kinds, the bound as drafted and fixed, every mix by
its Arsenal count, the named comps), [gear-accessories.html](previews/gear-accessories.html) (the four families' trees,
rows by grade and tier, what each form wins by her damage and by party value, the new profiles and D266's cells),
[gear-presets.html](previews/gear-presets.html) (the forty-two presets by grade and tier), [gear-costs.html](previews/gear-costs.html)
(armor by tier and half, why armor has no path, what a grade takes).

**The old pages** ([tier-rework/previews/](../tier-rework/previews/)), unchanged from round 1's log: weapon-trees,
weapon-accessories, weapon-armor and weapon-materials are carried into the pages above; gear-weapon-tree, gear-loadout and
gear-crafting retired.
