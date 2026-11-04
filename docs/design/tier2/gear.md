# Gear in Tiers 2 and 3: weapons, armor, accessories and what a rank costs

> **Status: drafting, 2026-11-04. Nothing here is built.** One doc of [the Tier 2 and Tier 3 set](README.md) (calls
> **T2G1–T2G20**, [§9](#9-decisions)). It carries [weapon-progression.md](../tier-rework/weapon-progression.md)
> (WP1–WP34, approved as D193) onto **Tier 1 as built** (engine v21, save v36): three accessory slots in every tier with
> today's four families (D264, D266), the re-paired twins and the five shapes (D240), weaknesses v2 (D235), the owner's
> presets (D263), every line equal (D264). The manual ([classes](../../game/classes.md#weapons),
> [combat](../../game/combat.md#damage), [materials](../../game/materials.md#gear)) is the game as it plays; this doc
> only says what Tiers 2 and 3 add.
>
> **Numbers come from the live code** (`packages/domain/src`: `economy/grades.ts`, `economy/accessories.ts`,
> `items/made-v4.ts`, `rpg/kinds.ts`, `rpg/rules.ts`, `rpg/campaign/weaknesses.ts`, `world/world.ts`), printed by
> throwaway tests that are not committed. **Coverage** is counted on the live weakness dealer over every region stage of
> each tier (2,400 stages, about 10,100 regulars, 200 sub-bosses and 220 bosses a tier). **The accessory branches' worth**
> is measured on the balance harness (`world/balance-party.ts`: Auto, both owner parties on curve at Tier 2's and Tier
> 3's Lv 50, 80 stages × 4 seeds), each branch emulated as the frozen stats, `flat` or Insignia value it would put into a
> fight; Onset, the one branch that needs a new engine rule, is estimated from her measured first-act share.
>
> **Names checked:** every new name here (Great Charm, Twofold Pendant, Twofold Charm, Twofold Orb, Onset Insignia, and
> every "Pure / Dual / Keen / Tempered / Evolved + kind" label) was matched, case-insensitive and exact, against every
> string of uma-platform's `content/release/data/*.json` (18,227 strings): no match. No Uma, character, skill, race or
> support-card name appears; Umas are shown by class or role.
>
> **Pages** (desktop, light and dark): [gear by tier](previews/gear-tiers.html) ·
> [weapons: trees, partners and coverage](previews/gear-weapons.html) ·
> [accessories: the families' branches and what they win](previews/gear-accessories.html) ·
> [armor and what a rank costs](previews/gear-costs.html).

## 1. At a glance

**What Tiers 2 and 3 add to gear:** a weapon picks a branch at its G5 (Pure or Dual in Tier 2, a second fork in Tier 3);
an accessory slot's G5 opens its family's two branches (Tier 2) and their step (Tier 3); everything flat is × 1.8 and
× 2.6. Armor and what a rank costs don't change shape.

| | Tier 1 (as built) | Tier 2 | Tier 3 |
|---|---|---|---|
| **Weapon grades** | G0–G10 per weapon kind, any class's | The same | The same |
| **Might at G10** (code) | 68 | 122 | 177 |
| **A weapon's branch** | None: one kind, weak ×1.3 | At G5: **Pure** (weak ×1.5) or **Dual** (+ its fixed partner, ×1.3) | At G5: Pure → **Keen** (×1.7) or **Tempered** (+ its Tier 2 partner, ×1.5 on both); Dual → **Tempered** or **Evolved** (+ its Tier 3 partner, ×1.5 on both) |
| **What takes the branch** | — | The weapon's own **G5 Arms Gem or Tome Ink** (no Branch Gem, T2G4) | The same |
| **Two-kind weapons in her slots** | 0 | **1** | **1** (was 2 for the six between, T2G3) |
| **Answers a regular**, the owner's two parties (T2G2) | 4.32 · 4.35 | 3.64 · 3.69 with no branch → **4.28 · 4.29** with the suggested Duals | **4.32 · 4.29** |
| **Every kind in two hands** | No: five kinds held once in each party | **Yes**, with the suggested Duals | **Yes** |
| **Armor at G10** (code) | HP +150, DEF +40, M.DEF +40, MP +30, Speed +20 (12% evasion), offense +25 | HP +270, DEF +72, M.DEF +72, MP +54, Speed +20, offense +45 | HP +390, DEF +104, M.DEF +104, MP +78, Speed +20, offense +65 |
| **Armor's half** | Her class's | Her class's (the per-piece choice retires, T2G8) | Her class's |
| **Accessory slots** | 3 | 3 | 3 |
| **Forms a slot wears** | Pendant · Charm · Orb · Insignia | + two branches a family from the slot's G5 | The branches a step deeper from the slot's G5 |
| **A G10 slot** | Pendant/Charm +10 · Orb +20 · Insignia +10% | Great Pendant/Charm **+23** · Twofold **+18 ATK and +18 M.ATK** · Great Orb **+47** · Twofold Orb **+25 on each of two** · Great Insignia **+13%** · Onset **+15%** | Great **+36** · Twofold **+29 each** · Great Orb **+73** · Twofold Orb **+42 each** · Great Insignia **+14%** · Onset **+16%** |
| **★ signature at Lv 50** (code) | +5 | +9 | +13 |
| **A rank of everything, two Umas** | 30 refined a line | 30 | 30 |
| **Made items** | Arms Gem, Tome Ink, Armor Fittings, Accessory Setting | The same four, **no new item** | The same |

**The design in ten lines:**
1. Tier 1's gear model stands in every tier: a slot holds a grade, one made item raises it one grade at Uma Lv 5g − 4.
2. **A weapon's branch rides its G5 item:** the Arms Gem G5 or Tome Ink G5 that raises it to G5 also sets Pure or Dual.
   No Branch Gem, so every line stays equal (D264).
3. **The partner table keeps the owner's six Ring rows by name;** the four Light/Dark rows follow the old twin logic on
   today's twins (their Tome rows swap: Light → Ice, Dark → Fire). Tier 3's rows are the old ones.
4. **One two-kind weapon in every later tier.** Weaknesses v2 narrows once, from Tier 1 to Tier 2, so breadth grows once.
5. **Coverage stays at Tier 1's:** 4.28–4.32 answers a regular in Tiers 2 and 3 against Tier 1's 4.32–4.35, every kind
   in two hands. Bosses and sub-bosses gain about 15%, so their shields go up one (provided to T2B).
6. **Armor is Tier 1's × tier, on her class's half.** Splitting a hybrid's pieces never paid in the measure.
7. **Each family branches in two at a slot's G5:** a **Great** form (the same reach, ×1.3) and one that changes its reach:
   **Twofold** for the Pendant and the Charm (both channels), **Twofold Orb** (two of her kinds), **Onset** for the
   Insignia (her first act each wave). Tier 3 takes each a step deeper.
8. **Each branch is someone's best** in the measure, and none wins more than a third of the cells.
9. **From Tier 2 every ★ family pays on any weapons:** a Twofold Pendant or Charm gives both stats, so a Brawler with a
   Charm signature can wear it.
10. **A rank costs 30 refined a line in every tier;** a re-forge is one more G5 item.

## 2. Tier 1 as built

The baseline every number below extends. No redesign here.

### 2.1 Weapons

[classes § Weapons](../../game/classes.md#weapons), [combat § Damage](../../game/combat.md#damage).

- **Ten kinds, five shapes, five twin sets** (D240, CV12–CV13): Heavy (Greatsword, Fire), Sweep (Axe, Ice), Scatter
  (Lance, Lightning), Double (Katana, Light), Volley (Bow, Dark). Each twin set is one shape; the Bow and the Katana
  together are Twilight. Engine v18 and before paired the Bow with Light and the Katana with Dark.
- **Three slots by channel:** a Brawler three Arms, a Sorcerer three Tomes, the Arms hybrids and the Paladin two Arms
  and a Tome, the Tome hybrids and the Cleric two Tomes and an Arm.
- **Grades per weapon kind** (D289: "grades are per weapon kind, with no class lock"): G0–G10, raised by an Arms Gem
  (10 Ingots) or Tome Ink (10 vegetable cuts) of the grade it reaches, at Uma Lv 5g − 4. A grade serves every class
  that slots the weapon. No Weapon Rank.
- **Might** (`MIGHT_BY_GRADE`, × tier by `tierScaled`), joining her offense on that weapon's hits:

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Opens at Uma Lv | 1 | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 |
| **Tier 1** | 1 | 4 | 8 | 12 | 19 | 26 | 35 | 45 | 57 | 68 |
| **Tier 2** (× 1.8) | 2 | 7 | 14 | 22 | 34 | 47 | 63 | 81 | 103 | 122 |
| **Tier 3** (× 2.6) | 3 | 10 | 21 | 31 | 49 | 68 | 91 | 117 | 148 | 177 |

- **A weak hit is ×1.3** (`BATTLE_WEAK`), once, when the hit's kind is on the foe's list.
- **Presets** (D263, `RPG_WEAPON_PRESETS`), the owner's two parties: **Party 1** Brawler (Greatsword, Axe, Lance),
  Sorcerer (Fire, Blizzard, Thunder), Arms Spellblade (Katana, Axe, Thunder), Tome Summoner (Dark, Blizzard, Bow),
  Paladin (Lance, Greatsword, Light); **Party 2** the Brawler, the Sorcerer, Tome Spellblade (Thunder, Blizzard, Katana),
  Arms Summoner (Bow, Axe, Dark), Cleric (Light, Fire, Lance). Each party holds all ten kinds, five of them once.

### 2.2 Weaknesses v2, as the gear meets them

[combat § Weaknesses](../../game/combat.md#weaknesses-shields-and-breaks), `rpg/campaign/weaknesses.ts` (D235).

- **Tier 1:** a regular is weak to 2 Arms + 2 elements; a sub-boss or a boss to 3.
- **Tiers 2 and 3: every rank to 3.** A regular leans to the channel her weaker defense guards: strikers and guards 1 Arm
  + 2 elements, casters and skirmishers 2 Arms + 1 element (measured: 45% and 55% of Tier 2's regulars).
- **Arms come off a shuffled deck, elements lead with the ring's answer;** the world's lists read no twin. So which kinds
  a party holds matters, not which twin sets.

How often each kind is on a list (measured, every region stage):

| Kind | Greatsword | Axe | Lance | Bow | Katana | Fire | Ice | Lightning | Light | Dark |
|---|---|---|---|---|---|---|---|---|---|---|
| Tier 1 regulars | 40% | 40% | 40% | 40% | 40% | 45% | 39% | 33% | 45% | 39% |
| Tier 2 regulars | 31% | 31% | 31% | 31% | 31% | 35% | 31% | 26% | 29% | 25% |
| Tier 2 bosses | 40% | 30% | 33% | 25% | 38% | 28% | 24% | 39% | 22% | 22% |

### 2.3 Armor

[materials § Gear](../../game/materials.md#gear), `armorValues` in `economy/grades.ts`. Five slots, each G0–G10, raised
by Armor Fittings (3 Planks). A slot adds its stat and offense to ATK or M.ATK by her class's half (a Tier 0's a third
a slot to each slot's channel). Everything × tier except Speed:

| A grade, Tier 1 | Head DEF | Body HP | Legs MP | Arms M.DEF | Feet Speed | Offense a piece |
|---|---|---|---|---|---|---|
| Per grade | +4 | +15 | +3 | +4 | +2 (1.2% evasion) | ⌈g ÷ 2⌉ |

### 2.4 Accessories

[combat § Her accessory](../../game/combat.md#her-accessory-and-signature), `economy/accessories.ts` (D264, D266).

- **Three slots in every tier**, each its own grade (Accessory Setting, 5 Fillets) and family, repeats allowed; G0 does
  nothing. One tap on a row of a slot's list wears it.
- **Four families, linear rows:** **Pendant** +1 ATK a grade, **Charm** +1 M.ATK a grade (the Bell's id, retired into
  it), **Orb** +2 a grade on one of her three weapons' kinds, **Insignia** +1% a grade on sub-bosses and bosses, slots
  added. × 1.8 and × 2.6 by tier, the Insignia flat.
- **The Pendant and the Charm are real stats:** a healer's mends and an inherited Limit Break read them; the Orb, the
  Insignia and the ★ never heal.
- **★ Her signature** (UT7): her knack's family worn at G1 or more gives ATK and M.ATK +0.1 a level × tier, at least 1
  (`signatureBonus`): +5, +9 and +13 at Lv 50 in Tiers 1, 2 and 3.
- **The preset** wears her armor half's stat twice and an Orb on `presetKind`'s kind; her ★ family first unless her
  weapons can't use it (a Pendant on three Tomes, a Charm on three Arms).
- **What wins in Tier 1** (D266): three of her stat on the Brawler, the Sorcerer, the Paladin and the Tome Spellblade;
  Orbs on the hybrids whose damage leans on one kind and on the Cleric; Insignias on sub-bosses.

Every row by tier, from the code (a slot at each grade):

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Pendant, Charm: Tier 1 · 2 · 3 | 1 · 2 · 3 | 2 · 4 · 5 | 3 · 5 · 8 | 4 · 7 · 10 | 5 · 9 · 13 | 6 · 11 · 16 | 7 · 13 · 18 | 8 · 14 · 21 | 9 · 16 · 23 | **10 · 18 · 26** |
| Orb: Tier 1 · 2 · 3 | 2 · 4 · 5 | 4 · 7 · 10 | 6 · 11 · 16 | 8 · 14 · 21 | 10 · 18 · 26 | 12 · 22 · 31 | 14 · 25 · 36 | 16 · 29 · 42 | 18 · 32 · 47 | **20 · 36 · 52** |
| Insignia, every tier | 1% | 2% | 3% | 4% | 5% | 6% | 7% | 8% | 9% | **10%** |

### 2.5 What a rank costs

[materials § What a rank takes](../../game/materials.md#what-a-rank-takes) (D264, D273). One rank of everything on two
Umas, one on three Arms and one on three Tomes, is **30 refined items on each of the five lines**: 3 Arms Gems × 10
(Metal), 3 Tome Ink × 10 (Vegetables), 5 Armor Fittings × 3 × 2 (Wood), 3 Accessory Settings × 5 × 2 (Fish), 3 jewels ×
5 × 2 (Stone). 8.0 h at each of a line's three places at Craft Lv 25; a 30-step job 9h 36m at Craft Lv 1, 8h 2m at
Lv 25 (D273). A maxed Uma takes 300 + 150 + 150 + 75 + 75 refined (753 h), each trade 20%. One recipe a grade in every
world (FL9), the same fifty pairs (FL8).

### 2.6 Where gear sits in the damage stack

Today's ten steps ([combat § Damage](../../game/combat.md#damage), `battleDamage`): **1** offense (ATK or M.ATK, which
carry armor's offense, the Pendants and the Charms; + the Might of her weapon of the hit's kind + her Orbs on that kind +
her ★) · **2** offense² ÷ (offense + defense) × power · **3** weak ×1.3 · **4** her Insignias ×(1 + 1% a grade, slots
added) on a sub-boss or a boss · **5** statuses · **6** specials · **7** the unbroken ×0.5 · **8** the ward · **9**
evasion · **10** rounding. The whole stack by tier is [balance.md](balance.md)'s (T2B); §4.8 says where Tier 2's gear
pieces sit.

## 3. The approved drafts, call by call

Every WP call, its Tier 2 and 3 reach and where it stands on today's Tier 1. **8 kept · 15 kept, changed ·
7 superseded · 4 broken** (WP8, WP12, WP20, WP32).

| Call | What it said (for Tiers 2 and 3) | Status | Why, and where it goes |
|---|---|---|---|
| **WP1** Who owns what | Weapons own kinds and the weak multiplier; trees shape; armor defense; accessories damage only; no uniqueness on weapons | **Kept, changed** (D264, D266) | The split stands. Accessories now include two real stats, the Pendant (ATK) and the Charm (M.ATK), which also lift a healer's mends; the Bell is gone; the weapon moons are [T2E](extra-stats.md)'s |
| **WP2** One model for every piece | Own every slot at G0; one item raises one grade; the slot holds the grade | **Kept** | Live since R2 (D218), the same in every tier |
| **WP3** The gate | Grade g at Uma Lv 5g − 4; gear ranks retired | **Kept** | Live |
| **WP4** SB1 | Flat values × 1 · 1.8 · 2.6; shares unchanged | **Kept, changed** (D264, D266) | Flat: Might, armor (not Speed), the Pendant, Charm and Orb rows and their branches, the ★ at 0.1 a level. Shares: weak multipliers, evasion, Insignias. The Bell's share goes with it |
| **WP5** Tier 1 weapons | A straight line, one kind, ×1.3 | **Kept** | Live; its item is the Arms Gem or Tome Ink (FL4) |
| **WP6** Tier 2's branch | At G5, Pure (×1.5) or Dual (its fixed partner), no third | **Kept, changed** (D264) | Stands; the G5 step is the weapon's own G5 item, not a Branch Gem (**T2G4**) |
| **WP7** The second kind | A partner of its own channel and the other group; coverage only; every bonus reads a hit's own kind; slotted kinds all different, partners included | **Kept, changed** (D264) | Stands. "Every bonus on a kind" is now the Orb forms and the weapon moons: the Pendant and the Charm are stats and read no kind (**T2G5**) |
| **WP8** The two-kind cap | Tier 2 one, Tier 3 two, the Brawler and the Mage one | **Broken** (D235) | Tier 3's second was for Tier 3's narrowing (CP6). Weaknesses v2 gives Tiers 2 and 3 the same three kinds, and a second lifts Tier 3 to 4.60–4.64 answers, past Tier 1's 4.32–4.35. **T2G3**: one in every later tier |
| **WP9** Tier 3 | Pure → Keen ×1.7 or Tempered; Dual → Tempered or Evolved; Base → Pure or Dual | **Kept** | Stands as the owner approved it (§5.1) |
| **WP10** The Branch Gem | One item a tier, 4 refined, made at the Forge | **Superseded** (D264; FL4) | Two weapon lines now (Arms Gems, Tome Ink) at 10 refined, every line equal; a Branch Gem breaks both. **T2G4** |
| **WP11** Re-forging, switching, promotion | A Branch Gem re-forges within a line; a switch costs unraised weapons; branches carry, grades reset | **Kept, changed** (D264, D283) | A re-forge is one more G5 item of the weapon's line (10 refined); Ascend is D283's (**T2G17**) |
| **WP12** The coverage check | Answers a regular on 48 signatures, twins weighted, never over Tier 1's 2.47 | **Broken** (D235, D240) | The world deals each foe her own list and the twins re-paired. **T2G2** re-derives it on the live dealer |
| **WP13** Weapon groups | Ring and Light/Dark; every two-kind weapon bridges them; the group Pendants retire into slot-reading forms | **Kept, changed** (D240, D264) | On today's twins the groups are shapes: Ring = Heavy, Sweep, Scatter; Light/Dark = Double, Volley. Partners still cross them. The Pendant part is superseded (a Pendant is ATK). Any focus is [T2C](classes.md)'s |
| **WP14** Armor's shape | Five slots; the half sets the piece and its offense; per piece for the four between from Tier 2 | **Kept, changed** (D240, D264) | Her class's half in every tier; the per-piece choice retires (**T2G8**): the Pendant and the Charm already split offense, and a split armor never paid |
| **WP15** Armor's values | DEF, M.DEF +4, HP +15, MP +3 a grade, evasion 1.2%, offense ⌈g ÷ 2⌉; × tier but evasion | **Kept** | Live (R2); §4.6 has the rows |
| **WP16** Sets | Stay dropped | **Kept** | — |
| **WP17** Supports retire | All ten, every tier; MP by a base regen | **Kept** | Live (the regen 0.9% a depth, D207) |
| **WP18** Four families, every tier | Pendant, Orb, Bell, Insignia; base forms, two branches each from Tier 2 | **Kept, changed** (D264) | Today's four are Pendant, Charm, Orb, Insignia; the branch shape is carried in **T2G9** |
| **WP19** Slots and forms | 1 · 2 · 3 untyped slots, one of each family; branches from a slot's G5 | **Superseded** (D264) | Three slots in every tier, repeats allowed. Its "branches at a slot's G5, the step in Tier 3" lives on in **T2G9** |
| **WP20** Pendants | Flat offense on her three kinds; Great Pendant, Channel Pendant | **Broken** (D264, D266) | The Pendant is +ATK, not offense on kinds; both branches were written for the old one. **T2G9**: Great Pendant, Twofold Pendant |
| **WP21** Bells | A follow-up on her Attack; Great Bell, Toll Bell | **Superseded** (D264 call 9) | The Bell retired ("Dual Weapons cover the inverse later"); its id reads Charm |
| **WP22** Orbs | Half a weapon's Might on one kind; Great Orb, Twin Orb (a twin set) | **Kept, changed** (D263, D266) | +2 a grade on one of her kinds (D223). The Great Orb stays; the Twin Orb becomes the **Twofold Orb**, any two of her kinds: today's presets hold a twin set only in the Summoners' (**T2G9**) |
| **WP23** Insignias | +1.5% a grade on sub-bosses and bosses; Great Insignia, Onslaught | **Kept, changed** (D266, D261) | +1% a grade, slots added. Great Insignia re-based; Onslaught renamed **Onset**, since Triad Onslaught is a live Limit Break (**T2G10**, **T2G11**) |
| **WP24** The kind cap | Flat on one kind from the Pendant and Orb forms ≤ a G10 Might × tier | **Kept, changed** (D264) | Binds the Orb forms only, +68 · +122 · +177 (**T2G14**) |
| **WP25** Presets | Per class and tier, both class branches | **Superseded** (D263, D266) | Weapons are the owner's parties; accessories her stat twice and an Orb. Tiers 2 and 3: **T2G13** |
| **WP26** Products and recipes | Weapon Gem, Branch Gem, Fittings, Setting; 365 refined a tier | **Superseded** (D264; FL9) | Arms Gem and Tome Ink 10, Fittings 3, Setting 5, one recipe a grade in every world. **T2G16** |
| **WP27** The save | v27 and v28's shapes | **Superseded** (D218, D264) | Tier 1's is built (v28, v34). Tiers 2 and 3: [§7](#7-save-and-engine), **T2G20** |
| **WP28** Names | Pure, Dual, Keen, Tempered, Evolved, partner; the forms; Branch Gem | **Kept, changed** (D261, D264) | The weapon words stand. Retired: Branch Gem, Channel Pendant, Twin Orb, Great Bell, Toll Bell, Onslaught. New: **T2G18** |
| **WP29** Art | No new art; a branch shows its family's icon | **Kept, changed** (D264) | The Charm wears the Bell row's icon; no Branch Gem icon (**T2G19**) |
| **WP30** Engine | v16, v17 and Tier 3's rows | **Superseded** (D238) | R3–R5 removed; Tier 2's rules take the engine after v21 ([§7](#7-save-and-engine)) |
| **WP31** The damage stack | One order: offense, the hit, weak, percentages, the rest | **Kept, changed** (D264, D266, D282) | Today's ten steps (§2.6); the Insignia is step 4, slots added; no Bell. Tier 2's pieces in §4.8; the whole stack is T2B's |
| **WP32** The partner table | The owner's six, four authored on twin logic, Tier 3's rows | **Broken** (D240) | Its reasons named the old twins (Bow–Light, Katana–Dark) and CP5's weighting. **T2G1**: the owner's six kept, the Tome rows swap |
| **WP33** The signature | Her knack's family, +0.2 a level × tier | **Kept, changed** (D264, D266) | Fleet's family is the Charm; 0.1 a level; the ★ by tier is [T2U](templates.md)'s. From Tier 2 a Twofold form makes every family usable (**T2G12**) |
| **WP34** Accessory forms | A branch is a form, a setting the slot's G5 opens, no item | **Kept** | Stands; Settings are 30 an Uma in every tier (D264) |

## 4. Tier 2 in full

### 4.1 Weapons: the branch at G5 (T2G4, T2G5)

- **Grades G0–G10, Might × 1.8** (§2.1's row). G1–G4 as Tier 1: one kind, weak ×1.3.
- **At G5 the weapon takes a branch.** Its G5 item, an **Arms Gem G5** (10 Cobalt Ingots) for an Arm or **Tome Ink G5**
  (10 Tomato Purée) for a Tome, raises it to G5 **and sets the branch** she picks on the raise sheet:

| Branch | What it is | A weak hit | Kinds | On her tile |
|---|---|---|---|---|
| **Pure** | Harder weak hits on its own kind | **×1.5** | 1 | "Pure Lance" |
| **Dual** | **Its fixed Tier 2 partner** (§4.2): coverage only | ×1.3 | 2 | "Dual Lance + Katana" |

- **G6–G10** continue on that line's items with Tier 2's Might.
- **A re-forge** (Pure ↔ Dual) takes one more G5 item of the weapon's line; the grade stays.
- **The partner, exactly** (WP7, kept): its hits carry both kinds for weaknesses and charged-move locks, one shield point
  and one lock a hit whichever kind matched; offense, Might, tree, shape and slot stay the weapon's own; every bonus on a
  kind (the Orb forms, the weapon moons) reads the hit's own kind, its first.
- **A branch belongs to the weapon kind** (T2G5), as its grade does: a Dual Lance is a Dual Lance for the Brawler, the
  Paladin and the Cleric who slot it. The cap (§4.3) is a loadout rule of her active class.
- **The shape stays the weapon's:** a Dual's partner adds a kind to its hits, never a hit. So the shape decides how many
  foes a weak Dual chips: a Volley (Bow, Dark) and a Sweep (Axe, Ice) strike every foe, a Scatter (Lance, Lightning) many
  hits, a Heavy or a Double one foe.

### 4.2 The partner table (T2G1)

**Each weapon has two partners for life,** a Tier 2 one (a Dual's, a Tempered's) and a Tier 3 one (an Evolved's), both
of its own channel and of the other weapon group.

| Weapon | Shape | **Tier 2 partner** | **Tier 3 partner** | Whose |
|---|---|---|---|---|
| Greatsword | Heavy | **Bow** | Katana | The owner's |
| Axe | Sweep | **Bow** | Katana | The owner's |
| Lance | Scatter | **Katana** | Bow | The owner's |
| Fire Tome | Heavy | **Dark** | Light | The owner's |
| Blizzard Tome (Ice) | Sweep | **Light** | Dark | The owner's |
| Thunder Tome (Lightning) | Scatter | **Light** | Dark | The owner's |
| Bow | Volley | **Greatsword** | Lance | Authored, kept from WP32 |
| Katana | Double | **Axe** | Lance | Authored, kept from WP32 |
| Light Tome | Double | **Ice** (was Fire) | Lightning | Authored, **changed** |
| Dark Tome | Volley | **Fire** (was Ice) | Lightning | Authored, **changed** |

**Why, row by row:**
- **The owner's six stand by name.** He named them before the twins re-paired; they were never twin-matched (one of three
  sets matched on the old twins, two of three on today's), and they stay legal and full-coverage on today's presets.
- **The authored four keep WP32's rule, "a twin set Duals into a twin set, both channels",** on today's twins. The old
  rows sent the Bow + Light set to the Fire set and the Katana + Dark set to the Ice set; today the Bow's twin is Dark and
  the Katana's is Light, so the Arms rows stay and the Tome rows swap: **the Dark set (Bow, Dark) → the Fire set; the
  Light set (Katana, Light) → the Ice set.** A Summoner, who holds the Bow and Dark in both parties, lands both halves
  weak on the same new foes.
- **Read by shape, the table is now almost all twin-to-twin:** Heavy ↔ Volley (Greatsword ↔ Bow, Fire ↔ Dark), Scatter →
  Double (Lance → Katana, Lightning → Light), Double → Sweep (Katana → Axe, Light → Ice). Only the owner's Sweep row
  splits (Axe → Bow, Ice → Light).
- **Tier 3 unchanged:** the Ring six turn to "the other sub weapon" (the owner's rule); the Light/Dark four all turn to
  the Lightning set (Bow, Katana → Lance; Light, Dark → Lightning), the one Ring set no Tier 2 reverse row reaches.
- **Every kind is someone's partner** across both tiers: the Light/Dark kinds three times each, the Lance and Lightning
  twice, the other Ring kinds once.
- **No set is locked out:** every preset, default and Rift guided build keeps at least one legal Dual (§4.3). The two
  mirrors (Greatsword ↔ Bow, Fire ↔ Dark) lock only two Rift builds' pairs, and each keeps another Dual.

**Alternatives measured** (all 1,296 tables that keep the owner's six, §4.4's measure): coverage barely moves, 4.33–4.39
answers a regular in Tier 2 with best picks, because the dealer reads kinds, not twins. What separates them is legality
and two holders a kind: WP32's rows by name also pass, but split both Light/Dark sets on today's twins; "Light set →
Lightning set, Dark set → Ice set" and "Light set → Ice set, Dark set → Lightning set" leave a kind with one holder in a
party; full mirrors (Bow → Greatsword, Dark → Fire, Katana → Lance, Light → Lightning) leave the defaults' Spellblades one
legal Dual each.

### 4.3 One two-kind weapon in her slots (T2G3)

| Limit | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Two-kind weapons in her three slots | 0 | **1** | **1** |
| Kinds she holds, at most | 3 | 4 | 4 |
| One channel's kinds, at most | 3 | 4 (never all five) | 4 |
| A weak hit, at most | ×1.3 | ×1.5 | ×1.7 |
| Her slotted kinds | All different | All different, partners included | The same |

- **A loadout rule, not ownership:** she may own several Dual weapons and swap between fights; a blocked slot says why
  ("One two-kind weapon in her slots").
- **Why one:** with no count cap the parties answer 4.85 · 4.79 of a regular, and a Brawler or a Sorcerer holds her whole
  channel (100% of regulars). With one, 4.28–4.39.

**Legal Tier 2 Duals on every set** (a partner she already slots is illegal):

| Class | Preset | Default (until she picks) | Rift guided build |
|---|---|---|---|
| Brawler | Greatsword + Bow, Axe + Bow, Lance + Katana | The same | (Bow, Katana, Axe) Bow + Greatsword |
| Sorcerer | Fire + Dark, Ice + Light, Lightning + Light | The same | (Light, Dark, Fire) Light + Ice |
| Arms Spellblade | Axe + Bow, Thunder + Light | (Katana, Lance, Thunder) Katana + Axe, Thunder + Light | (Bow, Greatsword, Fire) Fire + Dark |
| Tome Spellblade | Thunder + Light, Ice + Light, Katana + Axe | (Light, Thunder, Katana) Light + Ice, Katana + Axe | (Dark, Blizzard, Axe) all three |
| Arms Summoner | Bow + Greatsword, Dark + Fire | The same | (Lance, Greatsword, Thunder) all three |
| Tome Summoner | Dark + Fire, Ice + Light, Bow + Greatsword | (Dark, Blizzard, Axe) all three | (Fire, Thunder, Katana) all three |
| Paladin | Lance + Katana, Greatsword + Bow, Light + Ice | (Greatsword, Axe, Light) all three | — |
| Cleric | Light + Ice, Fire + Dark, Lance + Katana | (Light, Blizzard, Bow) Bow + Greatsword | — |

### 4.4 Coverage: weaknesses stay a puzzle (T2G2)

**The measure:** the owner's two parties on their presets; for each foe the live dealer makes, how many members hold a
kind on her list; averaged by rank over every region stage of the tier. **The bound:** a later tier's regulars are
answered no more than Tier 1's, within 0.1 with each member's best pick; every kind in two hands from Tier 2.

| Build | Answers a regular, Party 1 · 2 | A sub-boss | A boss | Kinds held once |
|---|---|---|---|---|
| **Tier 1, presets** | **4.32 · 4.35** | 3.75 · 3.71 | 3.77 · 3.77 | 5 in each party |
| Tier 2, no branch | 3.64 · 3.69 | 3.62 · 3.71 | 3.70 · 3.74 | 5 |
| **Tier 2, the suggested Duals** (§4.5) | **4.28 · 4.29** | 4.34 · 4.35 | 4.27 · 4.42 | **0** |
| Tier 2, each member's best Dual | 4.39 · 4.38 | 4.38 · 4.35 | 4.32 · 4.38 | 1 · 2 |
| Tier 2, every legal Dual (no count cap) | 4.85 · 4.79 | 4.86 · 4.80 | 4.80 · 4.75 | 0 |
| Tier 3, no branch | 3.63 · 3.67 | 3.69 · 3.71 | 3.73 · 3.76 | 5 |
| **Tier 3, one two-kind weapon, suggested** (§5.1) | **4.32 · 4.29** | 4.35 · 4.33 | 4.29 · 4.32 | **0** |
| Tier 3, the old cap (two for the six between) | 4.64 · 4.60 | 4.63 · 4.64 | 4.58 · 4.58 | 1 · 1 |
| *Tier 3, two, if Tier 3's regulars were weak to two* | *3.92 · 3.71* | — | — | — |

**What holds:** Tiers 2 and 3 stay at Tier 1's 4.3 answers a regular, and every kind is in two hands. **What grows:**
sub-bosses and bosses, weak to three in every tier, gain about 15% of answers (3.71–3.77 → 4.27–4.42), so **their shields
go up one to hold a shield per answer** (sub-bosses 6 → 7, bosses 8 → 9; provided to T2B). Regulars' formation shields
hold.

**One Uma alone** (share of a tier's regulars she answers):

| Class (preset) | Tier 1 | Tier 2, no branch | Tier 2, each legal Dual | Tier 3, the suggested weapon Evolved |
|---|---|---|---|---|
| Brawler (Greatsword, Axe, Lance) | 89% | 76% | **91%** with any of her three | 91% |
| Sorcerer (Fire, Ice, Lightning) | 100% | 81% | Fire + Dark **87%** · Ice + Light 93% · Lightning + Light 93% | Fire + Light 93% |
| Arms Spellblade (Katana, Axe, Thunder) | 79% | 69% | Axe + Bow 85% · Thunder + Light **80%** | Thunder + Dark 78% |
| Tome Spellblade (Thunder, Ice, Katana) | 80% | 70% | Thunder + Light **82%** · Ice + Light 82% · Katana + Axe 82% | Thunder + Dark 79% |
| Arms Summoner (Bow, Axe, Dark) | 83% | 71% | Bow + Greatsword **85%** · Dark + Fire 83% | Bow + Lance 85% |
| Tome Summoner (Dark, Ice, Bow) | 79% | 68% | Dark + Fire **84%** · Ice + Light 84% · Bow + Greatsword 80% | Dark + Lightning 79% |
| Paladin (Lance, Greatsword, Light) | 84% | 71% | Lance + Katana **86%** · Greatsword + Bow 84% · Light + Ice 82% | Lance + Bow 84% |
| Cleric (Light, Fire, Lance) | 83% | 71% | Light + Ice 86% · Fire + Dark 84% · Lance + Katana **83%** | Lance + Bow 83% |

In bold, the suggested Dual (§4.5). Tier 2 takes 11–19 points off every Uma (three kinds on a list, not four); her
Dual gives back 9–15.

### 4.5 The suggested Duals (T2G6)

The G5 raise sheet lists her legal Duals with what each answers and marks one **Suggested**: the one that puts every
kind in two hands in both owner parties. It is the same class by class in either party:

| Class | Suggested Tier 2 Dual | Shape of the Dual | The kind it fills |
|---|---|---|---|
| Brawler | Greatsword + Bow | Heavy | The Bow (held once in both parties) |
| Sorcerer | Fire + Dark | Heavy | Dark |
| Arms Spellblade · Tome Spellblade | Thunder + Light | Scatter | Light |
| Arms Summoner | Bow + Greatsword | Volley | The Greatsword (Party 2's one holder) |
| Tome Summoner | Dark + Fire | Volley | Fire (Party 1's one holder) |
| Paladin · Cleric | Lance + Katana | Scatter | The Katana |

- **The rest go Pure.** A Tier 2 Uma holds one Dual and two Pure weapons once all three are G5.
- **What it costs her alone:** the Sorcerer 6 points (87% against Ice + Light's 93%), the Arms Spellblade 5, the Cleric
  3; the others none. The party gains every kind twice for 0.1 answers a regular (4.28 against 4.39).
- **Pure buys +15% on that weapon's weak hits** (×1.5 ÷ ×1.3); Dual buys her partner's foes. Each is shown on the sheet;
  any legal pick is fine.

### 4.6 Armor (T2G8)

**Tier 1's armor × 1.8, on her class's half** (code):

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Head DEF · Arms M.DEF | 7 | 14 | 22 | 29 | 36 | 43 | 50 | 58 | 65 | 72 |
| Body HP | 27 | 54 | 81 | 108 | 135 | 162 | 189 | 216 | 243 | 270 |
| Legs MP | 5 | 11 | 16 | 22 | 27 | 32 | 38 | 43 | 49 | 54 |
| Feet Speed (evasion) | 2 (1.2%) | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 (12%) |
| Offense a piece | 2 | 2 | 4 | 4 | 5 | 5 | 7 | 7 | 9 | 9 |

- **Her class's half in every tier.** WP14's per-piece choice for the classes between (a hybrid putting some pieces'
  offense on her other half) retires. Measured at Tier 2's Lv 50 (each class in her party on curve, the pieces' 9
  offense moved to the other half): **every hybrid and healer loses 0.8–2.2% of her damage a piece moved** (5 pieces:
  −3.9% to −10.6%), and no heal rises past noise. Offense² ÷ (offense + defense) rewards one channel's offense over two,
  and D264's Pendant and Charm already let a hybrid add the other half's stat from a slot.
- **Speed doesn't scale:** evasion stays 12% at G10 in every tier.

### 4.7 Accessories (T2G9–T2G15)

#### The tree

**A slot's G5 opens its family's two branches** in Tier 2: a **Great** form, the same reach a step harder (Pure's way),
and a form that changes what it reaches (Dual's way). A form is a setting (WP34): nothing is made for it, the slot's
grade serves every form its grade has opened, and one tap changes it outside a fight. Slots still take any family,
repeats allowed.

```text
            Tier 1, base (G1 on)          Tier 2, branches (a slot's G5 on)                    Tier 3, the step (G5 on)
Pendant ── +1 ATK a grade ───────────┬─ Great Pendant    +1.3 ATK a grade                ──►  +1.4
                                     └─ Twofold Pendant  +1 ATK and +1 M.ATK a grade     ──►  +1.1 each
Charm ──── +1 M.ATK a grade ─────────┬─ Great Charm      +1.3 M.ATK a grade              ──►  +1.4
                                     └─ Twofold Charm    +1 ATK and +1 M.ATK a grade     ──►  +1.1 each
Orb ────── +2 on one of her kinds ───┬─ Great Orb        +2.6 on one of her kinds        ──►  +2.8
                                     └─ Twofold Orb      +1.4 on each of two of her kinds ─►  +1.6 each
Insignia ─ +1% on sub-bosses, bosses ┬─ Great Insignia   +1.3% a grade on them           ──►  +1.4%
                                     └─ Onset Insignia   +1.5% a grade, her first act each wave ─►  +1.6%
                                                         (flat values × 1.8 in Tier 2, × 2.6 in Tier 3; percentages flat)
```

- **Great** keeps the base's reach and adds 30%.
- **Twofold Pendant and Twofold Charm** are a Pendant and a Charm in one slot: both stats at the base rate. They are the
  same values; the family differs, which is what her ★ reads (T2G12). The pair is the families' mirror (the owner's
  symmetry note: a physical and a magical class get the same options).
- **Twofold Orb** sets two of her three weapons' kinds (a list row for each pair), +1.4 on each: 2.8 a grade in all
  against the Great Orb's 2.6 on one. It replaces WP22's Twin Orb, which read a twin set: today only the Summoners' presets
  hold one.
- **Onset Insignia** (WP23's Onslaught, renamed): her first act in each wave hits harder. It reads timing, not rank, so
  it pays on regulars, where the Great Insignia never does.
- **A branch beats its own base everywhere,** so from a slot's G5 the bases leave the race; they stay on the list.

#### Rows by grade (a slot; Tier 2 from G5)

| Form | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|
| Pendant, Charm (base) | 9 | 11 | 13 | 14 | 16 | 18 |
| **Great Pendant, Great Charm** | 12 | 14 | 16 | 19 | 21 | **23** |
| **Twofold Pendant, Twofold Charm** (ATK and M.ATK each) | 9 | 11 | 13 | 14 | 16 | **18** |
| Orb (base) | 18 | 22 | 25 | 29 | 32 | 36 |
| **Great Orb** | 23 | 28 | 33 | 37 | 42 | **47** |
| **Twofold Orb** (each of two kinds) | 13 | 15 | 18 | 20 | 23 | **25** |
| Insignia (base) | 5% | 6% | 7% | 8% | 9% | 10% |
| **Great Insignia** (sub-bosses, bosses) | 6.5% | 7.8% | 9.1% | 10.4% | 11.7% | **13%** |
| **Onset Insignia** (her first act each wave) | 7.5% | 9% | 10.5% | 12% | 13.5% | **15%** |

Values are `tierScaled(rate × grade)`, as `accessorySlotValue` rounds today's rows; Insignias in per mille (13 and 15 a
grade), as `INSIGNIA_SLOT_PERMILLE`.

#### What each wins (measured, Tier 2 Lv 50)

**The measure:** each class in her owner party on curve at Tier 2's Lv 50, her three slots at G10 in one set, the others
bare; her damage a turn against the same Uma with no accessory (D266's measure), on every region stage at that level (40
regular fights, 20 sub-bosses, 20 bosses, 4 seeds each). The mean weighs regular fights twice. The branches are emulated
as the stats, `flat` or Insignia value they freeze into the fight. **Onset** needs a new rule, so its row is an estimate:
three Onsets (+45%) × her measured share of damage dealt on her first act each wave (34–54% in regular fights, 10–23% on
sub-bosses, 32–47% on bosses), marked ≈.

| Class (party) | Regular fights | Sub-bosses | Bosses | Mean | The preset (T2G13) |
|---|---|---|---|---|---|
| **Brawler** | Great Pendant ×3 **17.5%** | Great Insignia ×3 **24.0%** | Great Pendant ×3 **19.8%** | Great Pendant ×3 **18.8%** | 15.2% |
| **Sorcerer** | Great Charm ×3 **20.1%** | Great Insignia ×3 **25.4%** | Great Charm ×3 **19.9%** | Great Charm ×3 **20.5%** | 18.1% |
| **Arms Spellblade** | Twofold ×3 **19.0%** (Onset ≈ 18.5%) | Great Insignia ×3 **24.1%** | **Onset ×3 ≈ 18.5%** (Twofold ×3 15.6%) | Twofold ×3 **19.2%** | 16.4% |
| **Tome Spellblade** | Twofold ×2, Twofold Orb (Thunder + Katana) **19.7%** | Great Insignia ×3 **23.3%** | **Onset ×3 ≈ 18.5%** (Twofold ×3 16.7%) | Twofold ×3 **18.3%** | 16.7% |
| **Arms Summoner** | **Onset ×3 ≈ 24.3%** (Great Orb ×2, Twofold 21.7%) | Great Insignia ×3 **17.6%** | **Onset ×3 ≈ 20.7%** (Great Orb ×2, Twofold 17.1%) | Onset ×3 ≈ 19.7% (Great Orb ×2, Twofold **19.5%**) | 17.6% |
| **Tome Summoner** | Great Orb ×2, Twofold **25.2%** | Great Orb ×2, Twofold **22.5%** (Great Insignia 22.4%) | Great Orb ×2, Great Charm **21.8%** | Great Orb ×2, Twofold **23.6%** | 20.8% |
| **Paladin** | Great Orb ×2, Great Pendant **24.4%** | Great Insignia ×3 **26.4%** | Great Orb ×2, Great Pendant **26.5%** | Great Orb ×2, Great Pendant **24.5%** | 22.2% |
| **Cleric** | Onset ×3 ≈ 19.8% (Twofold ×2, Twofold Orb 19.3%) | Great Insignia ×3 **20.7%** (Twofold ×2, Twofold Orb 20.7%) | Twofold ×2, Great Orb **23.8%** | Twofold ×2, Twofold Orb (Light + Lance) **20.3%** | 18.5% |

The Great Orb sits on the preset's Orb kind (her first weapon's, or a hybrid's lead kind that twins her lone weapon).
Tier 1's forms at the same level win 12.7–20.2% (their best set), the preset's Tier 1 set 11.6–16.9%.

**What it shows:**
- **Every branch is someone's best,** none in more than a third of the 32 cells (eight classes × four columns; a cell
  counts every form in its best set): the Great stat forms 10 (the pure classes, the Paladin), Twofold 10 (the
  Spellblades, the Tome Summoner, the Cleric), the Great Orb 8 (the Tome Summoner, the Paladin, the Cleric's bosses), the
  Great Insignia 7 (sub-bosses, as Tier 1's Insignia), Onset 6 by estimate (the Arms Summoner's short fights and boss
  waves, the Spellblades' bosses), the Twofold Orb 3 (the Tome Spellblade's fights, the Cleric).
- **Great for a pure class, Twofold for a hybrid:** as Pure deepens a weapon and Dual widens it. The Paladin keeps the
  Great Pendant (her Barriers and mends read ATK).
- **The Twofold Orb at +1.6 each** (WP22's Twin Orb share) won five classes of eight; at +1.4 it wins where a hybrid's two
  most-used kinds are one a half. **Twofold at +0.8 each** won nowhere; at +1 each it is a Pendant and a Charm in one slot.
- **Onset is the one value the simulation must set** with the rule built (T2B): placed at the edge of the hybrids'
  best in short fights, it steps down first (to +1.2%) if it wins more than half of any class's cells.
- **Each Great form beats its base everywhere** (×1.3 on the same reach), so from a slot's G5 the bases leave the race.

#### The rules around them

- **The kind cap (T2G14):** Orb forms on one kind add at most a G10 weapon's Might × tier, **+68 · +122 · +177**. Tier 1
  never reaches it (three Orbs +60). In Tier 2 it binds only two Great Orbs and a third Orb form on one kind (+130 or
  +141 → +122). The Pendant and the Charm are stats and sit outside it, as the weapon moons do (T2E).
- **One Insignia factor (T2G15):** every Insignia slot whose condition holds on a hit adds its percent into one factor,
  as slots add today: three Great Insignias ×1.39 on a boss; an Onset and two Great Insignias ×1.41 on her first act
  against a boss.
- **★ on any weapons (T2G12):** from a slot's G5, a Twofold form of her ★ family gives both stats, so the D266 exception
  ("unless her weapons can't use it") ends there: a Brawler whose ★ is the Charm wears a Twofold Charm, +18 ATK and her
  ★ +9, against a Great Pendant's +23. Below G5 the Tier 1 rule holds.
- **Twofold Orb's kinds** are two of her active class's three weapons' own kinds, never a partner (a partner kind is no
  hit's own kind, so an Orb on it would add nothing; this also settles D219's note "a Dual's partner kind from R3").

#### Presets (T2G13)

**Tier 1's shape in each slot's best opened form.** The preset still spends nothing and moves no grade; it never sets a
weapon's branch (that costs an item).

| Slot's grade | A pure class (Brawler, Sorcerer) and a healer (Paladin, Cleric) | A hybrid (both Spellblades, both Summoners) |
|---|---|---|
| G1–G4 (or Tier 1) | Her stat, her stat, Orb (D266) | The same |
| **G5 on, Tier 2 and 3** | **Great stat, Great stat, Great Orb** | **Twofold, Twofold, Great Orb** |

- **Her ★ family first,** in the place of one of its own or slot 1; from a slot's G5 always, since a Twofold form of her
  family gives both stats (T2G12). A Brawler with a Charm ★: Twofold Charm, Great Pendant, Great Orb.
- **The Great Orb** on `presetKind`'s kind, as today.
- **Measured** (the table above): the preset adds 15.2–22.2% at Tier 2's Lv 50, against 11.6–16.9% for Tier 1's set at
  the same level and 18.3–24.5% for each class's best set. A good all-round set, not the best in any one fight (D266).
- **Why the healers keep Great:** their mends and Barriers read their own stat, so the Great form lifts the heal too; the
  Cleric's damage would gain a point with Twofold, her heal would lose a fifth of the slot.

### 4.8 The damage stack in Tier 2

Tier 2's gear pieces in today's steps (§2.6); the whole stack, statuses and any class focus are T2B's and T2C's:

| Step | Tier 2 adds |
|---|---|
| 1 Offense | Might × 1.8; Great, Twofold forms in her ATK and M.ATK (real stats); Great Orb and Twofold Orb on a hit's own kind, under the kind cap; the ★ +9 at Lv 50; the weapon moons beside them (T2E) |
| 3 Weak | **The weapon's multiplier:** Pure ×1.5, Dual ×1.3 when either of its kinds is on the list; a Limit Break ×1.3 |
| 4 Insignias | Great Insignia on sub-bosses and bosses, Onset on her first act each wave, one factor (T2G15) |

**The ceiling of one weak hit from gear** (before statuses and any focus): Tier 1 ×1.3 × three Insignias ×1.30 =
**×1.69**; Tier 2 Pure ×1.5 × three Great Insignias ×1.39 = **×2.09** on a boss, or × three Onsets ×1.45 = **×2.18** on
her first act; Tier 3 Keen ×1.7 × ×1.42 = **×2.41**, or × three Onsets ×1.48 = **×2.52**.

### 4.9 What a rank costs (T2G16)

**Unchanged: 30 refined items a line a rank, on two Umas, in every tier.** The branch rides the G5 item (T2G4) and forms
need no item (WP34), so Tier 2 adds nothing to make:

| Line (made item) | Uma on 3 Arms | Uma on 3 Tomes | Both | Tier 2 adds |
|---|---|---|---|---|
| Metal (3 Arms Gems × 10) | 30 | 0 | 30 | The G5 gem carries Pure or Dual |
| Vegetables (3 Tome Ink × 10) | 0 | 30 | 30 | The same |
| Wood (5 Armor Fittings × 3) | 15 | 15 | 30 | — |
| Fish (3 Accessory Settings × 5) | 15 | 15 | 30 | The G5 Setting opens the branches |
| Stone (3 jewels × 5) | 15 | 15 | 30 | T2E's (assumed three jewels a rank) |

- **A maxed Uma** is the same in every tier: 300 + 150 + 150 refined of gear (weapons, armor, accessories) and 150 of
  jewels (753 h at Craft Lv 25); professions' hours by tier are [T2P](professions.md)'s.
- **Outside a rank:** a re-forge, one G5 item (10 refined of its line, 2h 40m at each of its three places at Craft Lv
  25); a class switch's unraised weapons, as today.

### 4.10 Screens (T2G19)

- **The Gear tab's weapon tiles** gain a branch chip: "Pure", "Dual + Katana" (the partner's glyph in its kind's
  color). The Upgrade sheet at G4 → G5 lists Pure and each legal Dual with the regulars it answers, Suggested first.
- **An accessory tile's list** gains its family's two branch rows once the slot is G5 ("Great Pendant · +23",
  "Twofold Pendant · +18 ATK · +18 M.ATK"); a Twofold Orb a row for each pair of her weapons. One tap wears a row, as
  today.
- **The damage sheet** (D279) reads the same sources: "accessory" is her Pendant, Charm and Twofold forms plus her Orb
  forms on that kind.
- **No new art** (lean assets): a branch is its family's icon with a text chip; a Dual is the weapon's art with its
  partner's glyph.

## 5. Tier 3 in full

### 5.1 Weapons

- **Might × 2.6** (§2.1's row). **Branches carry through Ascend; grades reset to G0** and the used items go back to the
  old world's Warehouse (D283). At G1–G4 a weapon holds its Tier 2 branch at Tier 3's Might.
- **At G5 both lines fork again** (WP9, kept), on the same G5 item:

| Arrives as | The G5 item makes | What it is | A weak hit | Kinds |
|---|---|---|---|---|
| **Pure** | **Keen** | Its weak hits harder still | **×1.7** | 1 |
| **Pure** | **Tempered** | + its Tier 2 partner, Pure's multiplier on both | ×1.5 on both | 2 |
| **Dual** | **Tempered** | Keeps its partner, both harder | ×1.5 on both | 2 |
| **Dual** | **Evolved** | Its partner turns to its **Tier 3 partner**, both harder | ×1.5 on both | 2 |
| **Base** (never G5 in Tier 2) | **Pure** or **Dual** | The Tier 2 step, a tier late | ×1.5 · ×1.3 | 1 · 2 |

- **Still one two-kind weapon in her slots** (T2G3): her Dual line Tempers or Evolves, her Pure lines go Keen. A Pure
  line may Temper only if no other two-kind weapon is slotted.
- **A re-forge** stays within its line (Keen ↔ Tempered from Pure, Tempered ↔ Evolved from Dual), one G5 item.
- **The suggested fork** (every kind in two hands in both parties, §4.4: 4.32 · 4.29 answers a regular):

| Class | Tier 3 two-kind weapon | Her other two |
|---|---|---|
| Brawler | Tempered Greatsword + Bow | Keen Axe, Keen Lance |
| Sorcerer | **Evolved Fire + Light** | Keen Blizzard, Keen Thunder |
| Arms Spellblade | **Evolved Thunder + Dark** | Keen Katana, Keen Axe |
| Tome Spellblade | **Evolved Thunder + Dark** | Keen Blizzard, Keen Katana |
| Arms Summoner | Tempered Bow + Greatsword | Keen Axe, Keen Dark |
| Tome Summoner | Tempered Dark + Fire | Keen Blizzard, Keen Bow |
| Paladin · Cleric | Tempered Lance + Katana | Keen on the other two |

### 5.2 Armor

Tier 1's × 2.6, her class's half (code): Head DEF · Arms M.DEF 10, 21, 31, 42, 52, 62, 73, 83, 94, **104**; Body HP 39,
78, 117, 156, 195, 234, 273, 312, 351, **390**; Legs MP 8, 16, 23, 31, 39, 47, 55, 62, 70, **78**; Feet Speed 2 a grade
(12% at G10); offense a piece 3, 3, 5, 5, 8, 8, 10, 10, 13, **13**.

### 5.3 Accessories: the step

**At a slot's G5 in Tier 3, each branch takes its step;** below G5 a branch she knows works at its Tier 2 rate, × 2.6
(forms stay known through Ascend, WP34; she keeps her slots' families, D283):

| Form | G1–G4 (Tier 2 rate) | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|
| Pendant, Charm (base) | 3 · 5 · 8 · 10 | 13 | 16 | 18 | 21 | 23 | 26 |
| **Great Pendant, Great Charm** (1.4) | 3 · 7 · 10 · 14 | 18 | 22 | 25 | 29 | 33 | **36** |
| **Twofold** (1.1 each) | 3 · 5 · 8 · 10 | 14 | 17 | 20 | 23 | 26 | **29** |
| Orb (base) | 5 · 10 · 16 · 21 | 26 | 31 | 36 | 42 | 47 | 52 |
| **Great Orb** (2.8) | 7 · 14 · 20 · 27 | 36 | 44 | 51 | 58 | 66 | **73** |
| **Twofold Orb** (1.6 each) | 4 · 7 · 11 · 15 | 21 | 25 | 29 | 33 | 37 | **42** |
| **Great Insignia** (1.4%) | 1.3% → 5.2% | 7% | 8.4% | 9.8% | 11.2% | 12.6% | **14%** |
| **Onset Insignia** (1.6%) | 1.5% → 6% | 8% | 9.6% | 11.2% | 12.8% | 14.4% | **16%** |

- **The step is one rule:** +0.1 a grade on every branch, +0.2 on the two Orb forms (whose base is twice), +0.1% on the
  two Insignias. It is the one share that rises with a tier, as Keen's ×1.7 does for weapons.
- **The kind cap** is +177: three stepped Great Orbs (+219), or two and a Twofold Orb (+188), cap there.

**Measured at Tier 3's Lv 50** (§4.7's measure, the step's values, Onset estimated the same way):

| Class | Her best set, mean | Regular fights | Sub-bosses | Bosses | The preset |
|---|---|---|---|---|---|
| Brawler | Great Pendant ×3 **19.6%** | Great Pendant ×3 20.4% | Great Insignia ×3 21.9% | Great Pendant ×3 19.3% | 17.1% |
| Sorcerer | Great Charm ×3 **22.0%** | Great Charm ×3 22.3% | Great Insignia ×3 25.7% | Great Charm ×3 21.7% | 19.5% |
| Arms Spellblade | Twofold Orb ×3 (Axe + Thunder) **19.9%** | Onset ≈ 20.2% (Twofold Orb 20.0%) | Great Insignia ×3 22.4% | Onset ≈ 20.6% (Twofold Orb 19.8%) | 17.2% |
| Tome Spellblade | Twofold ×3 **19.5%** | Onset ≈ 20.2% (Twofold ×3 19.7%) | Great Insignia ×3 26.3% | Onset ≈ 21.6% (Twofold ×3 17.5%) | 17.3% |
| Arms Summoner | Twofold Orb ×3 (Bow + Dark) **23.6%** | Onset ≈ 26.4% (Twofold Orb 24.5%) | Twofold Orb ×3 26.5% | Onset ≈ 22.6% (Great Orb ×2, Twofold 20.6%) | 21.3% |
| Tome Summoner | Twofold Orb ×3 (Dark + Bow) **22.6%** | Onset ≈ 24.5% (Twofold Orb 23.9%) | Great Insignia ×3 24.5% | Great Orb ×2, Great Charm 21.2% | 20.2% |
| Paladin | Great Orb ×2, Great Pendant **26.1%** | Great Orb ×2, Great Pendant 26.2% | Great Insignia ×3 29.5% | Great Orb ×2, Great Pendant 26.1% | 24.4% |
| Cleric | Twofold ×2, Twofold Orb **22.5%** | Onset ≈ 22.6% (Twofold ×3 22.2%) | Great Insignia ×3 24.5% | Twofold ×3 24.2% | 20.2% |

- **Every branch is still someone's best,** none in more than a third: the Great stat forms 10, Onset 8 (estimated), the
  Great Insignia 7, the Twofold Orb 5, the Great Orb 4, Twofold 3. The step gives the Twofold Orb +0.2 (it won only one
  cell at +1.5), so the hybrids' pair of kinds stays a real pick.
- **Onset's estimate leads the hybrids' regular fights and bosses** in Tier 3 (their first acts are 42–55% of their
  damage): the simulation confirms it first, and its step (+1.6%) is the first knob, back to +1.5%.
- **Three slots add 19.5–26.1%** of an Uma's damage with her best set at Tier 3's Lv 50, the preset 17.1–24.4%.

### 5.4 What a rank costs

The same as Tier 2 (§4.9): 30 refined a line a rank; the G5 item takes Keen, Tempered or Evolved.

## 6. Provides and assumes

| To or from | Provides (this doc's) | Assumes (theirs) | If not |
|---|---|---|---|
| **[T2C](classes.md) classes** | The partner table (T2G1); one two-kind weapon (T2G3); branches per weapon kind, the cap a loadout rule (T2G5); suggested Duals (T2G6); weapon groups read as shapes (Ring: Heavy, Sweep, Scatter; Light/Dark: Double, Volley), every Dual bridging them | The eight Tier 1 classes keep their slots, hands and presets in Tiers 2 and 3 (CV10, D263); any class branch or focus reads a hit's own kind (WP13) and changes no slot | A new set (a reverse set, CP40) re-runs §4.3's legal Duals and §4.4's coverage; a focus on a partner kind would double a bonus |
| **[T2E](extra-stats.md) extra stats** | The kind cap binds the Orb forms only (T2G14); every flat bonus reads a hit's own kind | Three jewels a rank (D264); the weapon moons, if any, sit outside the kind cap and read a hit's own kind | More jewels a rank break the Stone line's 30 (T2G16); moons under the cap raise it to (68 + the moon) × tier |
| **[T2P](professions.md) professions** | **No new made item** in Tiers 2 and 3 (T2G4: the G5 item takes the branch; forms need none); a rank 30 refined a line; extra demand: a re-forge, one G5 item; the placeholder `branch-gem` line retires | The same fifty pairs in every world (FL8) and one recipe a grade (FL9); Craft Levels reset at Ascend | Tier 2 materials change which refined item fills a grade, not how many (§4.9 holds) |
| **[T2B](balance.md) balance** | Weak multipliers ×1.3 · 1.5 · 1.7; coverage by rank (§4.4); **sub-boss shields 7 and boss shields 9 in Tiers 2 and 3** to hold Tier 1's shield per answer; the branch rows and their measured worth (§4.7); Onset's estimate, for the simulation to confirm; the gear ceiling ×2.09 · ×2.52 (§4.8); armor × tier | **Weaknesses v2's every rank 3 in Tiers 2 and 3 (WK8)**; Tier 2's foe terms price the branches' added damage | If T2B narrows Tier 3's lists (regulars weak to two), T2G3's alternative holds: the owner's two for the six between (3.71–3.92 answers, under Tier 1's) |
| **[T2U](templates.md) templates** | Twofold forms make every ★ family usable on any weapons from a slot's G5 (T2G12); the preset's ★ rule by tier (T2G13); the ★ rows from the code (+9 · +13 at Lv 50) | The ★ stays her knack's family at 0.1 a level × tier (D266) | A ★ per form would pin her branch (WP33's reason) |
| **[T2W](progression.md) progression** | Ascend: grades reset, branches and forms carry, items go home (T2G17); a later window's Weapons track could read a branch ("a Keen weapon at G10") | Ascend as D283; windows by tier are T2W's | — |

## 7. Save and engine

Rough, not packets. The version is whatever follows the dark saves (v37, v38) when Tier 2 is built.

| Change | Kind |
|---|---|
| A weapon kind's record `{ grade }` gains `branch?: 'pure' \| 'dual'` (Tier 2's, carried) and `fork?: 'keen' \| 'tempered' \| 'evolved'` (Tier 3's). No partner stored: it's the table's | Save |
| An accessory slot's `form: 'base'` gains `'great' \| 'twofold' \| 'onset'`; a Twofold Orb's second kind `kind2` | Save |
| The placeholder Branch Gem leaves the made lines (`items/made-id.ts`, `made-v4.ts`'s qty 7, `places-v4.ts`, `stock-id.ts`, `work/kinds-v4/make.ts`); `RPG_REWORK_ENGINE.t2Weapons` gets its engine | Data, one migration if any world holds the id (none can: it was never made) |
| A weapon's weak multiplier in place of `BATTLE_WEAK`; a Dual's, Tempered's or Evolved's partner on its hits for weaknesses and locks | **Engine** (the stage after v21) |
| The one two-kind weapon rule; the forms' validation (`validAccessory`) | Validation |
| Great and Twofold stat forms, Great Orb and Twofold Orb | **No engine**: frozen stats and `flat`, as D264's slots |
| Great Insignia | No engine: the Insignia value a slot |
| **Onset Insignia** (her first act each wave) | **Engine**: one rule |
| The kind cap on Orb forms | Where `flat` is summed (`accessorySlotsParts`) |

## 8. Pacing

- **The gate is Tier 1's:** grade g at Lv 5g − 4 in her tier, so the branch arrives at Lv 21 of each tier and the step at
  Lv 21 of Tier 3. Nothing gates on a new bar.
- **Making time per rank is Tier 1's** (30 refined a line, 8.0 h a place at Craft Lv 25), but her crafters restart at
  Craft Lv 1 on Ascend (a 30-step job 9h 36m, D273), so a tier's first ranks run slower: T2P owns the hours.
- **Gear's damage by tier** (measured, §4.7): three slots add 11–13% of an Uma's damage in Tier 1 (D266, with the ★
  14%); at Tier 2's Lv 50 Tier 1's forms add 12.7–20.2% (her best set) and the branches 18.3–24.5% (the preset
  15.2–22.2%). That rise, about +5 points, is Tier 2's toolbox, priced in T2B's foe term.
- **Coverage doesn't speed fights:** answers stay at Tier 1's (§4.4), so Breaks come as often per answer; sub-boss and
  boss shields go up one with their answers.
- **A re-forge is cheap** (10 refined, a third of one rank's line), so a wrong Pure or Dual costs little.

## 9. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **T2G1** The partner table | **The owner's six Ring rows by name; authored Tier 2: Bow → Greatsword, Katana → Axe, Light → Ice, Dark → Fire; Tier 3: Ring "the other sub weapon", Bow, Katana → Lance, Light, Dark → Lightning** | WP32's rows by name (twin-split on today's twins); mirrors (leave defaults one legal Dual); Light set → Lightning set (a kind left with one holder) | WP32's own rule on today's twins: twin set to twin set, both channels; every set keeps a legal Dual; every kind in two hands |
| **T2G2** The coverage check | **Measured on the live dealer and the owner's two parties: a later tier's regulars answered no more than Tier 1's (within 0.1 with best picks), every kind in two hands from Tier 2** | WP12's 48 signatures and twins | The world deals lists, not twins; one number keeps "trivializes" measurable |
| **T2G3** Two-kind weapons | **One in her slots in Tiers 2 and 3, every class** | The owner's two in Tier 3 for the six between (4.60–4.64 answers, past Tier 1; right only if Tier 3's lists narrow) | Weaknesses v2 narrows once (Tier 1 → 2), so breadth grows once; Tier 3 deepens (Keen, Tempered, Evolved) |
| **T2G4** The branch item | **No Branch Gem: the weapon's G5 Arms Gem or Tome Ink sets the branch; a re-forge is one more G5 item; the placeholder line retires** | A Branch Gem a line (two new items, two icons, unequal lines) | Every line stays at 30 a rank (D264); nothing new to make or learn |
| **T2G5** Whose branch | **A branch belongs to the weapon kind, as its grade (D289); the cap is a loadout rule of her active class** | A branch per class | One weapon reads the same in every class; nothing to re-pick on a switch |
| **T2G6** Suggested Duals | **Brawler Greatsword + Bow, Sorcerer Fire + Dark, both Spellblades Thunder + Light, Arms Summoner Bow + Greatsword, Tome Summoner Dark + Fire, Paladin and Cleric Lance + Katana; Tier 3: the Sorcerer's and Spellblades' Evolve, the rest Temper, her other two Keen** | Each Uma's best alone (4.39 answers, two kinds left with one holder) | Every kind in two hands in both owner parties, for 0.1 answers |
| **T2G7** Weak multipliers | **Base and Dual ×1.3, Pure, Tempered, Evolved ×1.5, Keen ×1.7, a Limit Break ×1.3** (WP6, WP9 kept) | — | The owner's approved values; a share, the same at every tier |
| **T2G8** Armor by tier | **Tier 1's rows × tier (Speed unscaled), her class's half in every tier; the per-piece half retires** | Per piece for the six between (WP14) | Measured: a split costs 0.8–2.2% of her damage a piece, never pays; one fewer choice |
| **T2G9** The accessory tree | **A slot's G5 opens two branches a family: Great Pendant · Twofold Pendant; Great Charm · Twofold Charm; Great Orb · Twofold Orb; Great Insignia · Onset Insignia; Tier 3's G5 their step; forms are settings (WP34)** | No branches (Tier 1's × tier); branches by tier, not grade; a committed branch item | The owner's "branching paths similar to weapons" on today's four families; one tap stays one tap |
| **T2G10** Branch values | **Tier 2: Great ×1.3 (+1.3 a grade; Orb +2.6; Insignia +1.3%); Twofold +1 ATK and +1 M.ATK; Twofold Orb +1.4 on each of two; Onset +1.5% a grade. Tier 3 step: +0.1 a grade on each (+0.2 on the Orb forms, +0.1% on the Insignias): +1.4 · +1.1 · +2.8 · +1.6 · +1.4% · +1.6%. Onset is the simulation's to confirm; its knob +1.2%** | Twofold at 0.8 (nobody's best); Twofold Orb at 1.6 in Tier 2 (best for five classes of eight) | Measured: each branch someone's best, none in over a third of the cells (§4.7, §5.3) |
| **T2G11** Onset | **The Insignia's timing branch is Onset Insignia: her first act in each wave** | Keep "Onslaught" | Triad Onslaught is a live Limit Break (D241, D261): one word, one meaning |
| **T2G12** ★ on any weapons | **From a slot's G5 her ★ family always pays: a Twofold Pendant or Charm gives both stats, so the preset puts her ★ family first on any weapons** | Keep D266's exception in every tier | The Twofold forms make the exception's reason go away |
| **T2G13** Presets by tier | **From a slot's G5: Great stat, Great stat, Great Orb for the pure classes and the healers; Twofold, Twofold, Great Orb for the four hybrids; her ★ family first; below G5 Tier 1's** | Tier 1's set in every tier (11.6–16.9%); each class's best set (a preset per fight) | Measured 15.2–22.2% at Tier 2's Lv 50; one rule, D266's shape; the healers' Great form lifts their heals |
| **T2G14** The kind cap | **Orb forms on one kind add at most a G10 weapon's Might × tier (+68 · +122 · +177); the Pendant, Charm and weapon moons sit outside** | No cap; the cap on stats too | Keeps flat on one kind bounded; binds only stacked Great Orbs |
| **T2G15** One Insignia factor | **Every Insignia slot whose condition holds adds into one factor** | Each form its own factor | Today's "slots added"; bounded at three slots |
| **T2G16** What a rank costs | **30 refined a line a rank, two Umas, in every tier; no new item; a maxed Uma 753 h at Craft Lv 25 in every tier** | Tier materials or a Branch Gem raising a line | D264's equal lines hold by construction |
| **T2G17** Ascend | **Grades reset, used items go home (D283); weapon branches and accessory forms carry; at G1–G4 a carried branch works at its Tier 2 rate** | Branches reset with grades | The owner's WP11 and WP34, on D283's Ascend |
| **T2G18** Names | **Kept: Pure, Dual, Keen, Tempered, Evolved, partner, Great. New: Great Charm, Twofold Pendant, Twofold Charm, Twofold Orb, Onset Insignia. Retired: Branch Gem, Channel Pendant, Twin Orb, Great Bell, Toll Bell, Onslaught** (checked against master data: no match) | "Twin Orb" for two kinds (reads as a twin set) | One word, one meaning |
| **T2G19** Screens and art | **No new art: a branch chip on the weapon tile and its partner's glyph; branch rows on an accessory slot's list from G5; Suggested first on the G5 sheet** | New icons a form | Lean assets; one tap stays one tap (D266) |
| **T2G20** Save and engine | **Per weapon kind `branch` and `fork`; per slot `form` and `kind2`; the engine stage after v21 for the weak multiplier, partners and Onset; everything else frozen stats** | — | The smallest change: D264's pattern for slots |

## 10. Previews

**Made** ([previews/](previews/)): [gear-tiers.html](previews/gear-tiers.html) (the Tier 1 → 2 → 3 picture: the Gear
tab by tier, every row by tier), [gear-weapons.html](previews/gear-weapons.html) (the tree, the partner map, legal Duals,
coverage, the suggested Duals), [gear-accessories.html](previews/gear-accessories.html) (the four families' trees, rows
by grade, the measured wins, the ★), [gear-costs.html](previews/gear-costs.html) (armor by tier, the split measure, what a
rank costs).

**The old pages** ([tier-rework/previews/](../tier-rework/previews/)), for the README's log:

| Old page | Now |
|---|---|
| weapon-trees.html | **Carried** into gear-weapons.html (the tree viewer, partner map, coverage, holders, builds), on today's twins and dealer |
| weapon-accessories.html | **Carried** into gear-accessories.html, on today's four families; its Bell, Channel Pendant and Twin Orb panels retire |
| weapon-armor.html | **Carried** into gear-costs.html (armor by tier); its defensive budget is live (D215) and T2B's |
| weapon-materials.html | **Carried** into gear-costs.html (what a rank costs); its ladder of tier pairs and 365 refined retire (FL8, FL9, D264) |
| gear-weapon-tree.html, gear-loadout.html, gear-crafting.html | **Retired:** the first round's (gear.md, archived), already history in the old README; their content is in the pages above |
