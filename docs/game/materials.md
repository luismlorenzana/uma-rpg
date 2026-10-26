# Materials, made items and gear

Everything an Uma gathers, processes or makes, and what it does. Lists are generated from `packages/domain/src/items/`
(`materials-id.ts`, `materials.ts`, `made.ts`) and `economy/` (`grades.ts`, `accessories.ts`, `planet.ts`). How the jobs
work is in [loops](loops.md#craft-level); the ten places in [sections](sections.md#wilds). This is Tier 1's economy as it
plays since H82 (R2, engine v17, save v28); the old game's eight families, crafted pieces and Star Gems live on only in
the save migration that converted them (`toV28`, [architecture](architecture.md#save-history)).

## Lines

Five lines, one a gathering profession, each in one Wilds place (PP7). Every tier has a **low** and a **high** type in
each line: a world holds its own tier's types and every tier's below (a Tier 2 world gathers Tier 1's and Tier 2's). A
low type opens at Craft Lv 1 and a high type at Craft Lv 26, in every tier (PP13).

<!-- live:families -->
| Line | Gathered by | Tier 1 (low · high) | Tier 2 | Tier 3 |
|---|---|---|---|---|
| Metal | Mining, the Mine | Copper Ore · Iron Ore | Gold Ore · Titanium Ore | Mythril Ore · Orichalcum Ore |
| Wood | Wood Chopping, the Forest | Pine Log · Cedar Log | Cherry Log · Ebony Log | Elderwood Log · Yggdrasil Branch |
| Vegetables | Farming, the Fields | Carrot · Cabbage | Bell Pepper · Asparagus | Golden Carrot · Emperor Pumpkin |
| Fish | Fishing, the Fishery | Carp · Sardine | Sea Bream · Tuna | Silverfin · Rainbow Koi |
| Stone | Hunting, the Monster Den | Quartz · Citrine | Sapphire · Diamond | Starstone · Philosopher's Stone |
<!-- /live -->

Every raw type processes one for one into its refined form at the Workbench, in a quarter of a gather's time. Made items
take refined materials only.

## Types by line

<!-- live:items -->
### Metal (Mining, the Mine)

| Tier | Band | Raw | Refined | Opens at Craft Lv |
|---|---|---|---|---|
| 1 | low | Copper Ore (`copper-ore`) | Copper Ingot (`copper-ingot`) | 1 |
| 1 | high | Iron Ore (`iron-ore`) | Iron Ingot (`iron-ingot`) | 26 |
| 2 | low | Gold Ore (`gold-ore`) | Gold Ingot (`gold-ingot`) | 1 |
| 2 | high | Titanium Ore (`titanium-ore`) | Titanium Ingot (`titanium-ingot`) | 26 |
| 3 | low | Mythril Ore (`mythril-ore`) | Mythril Ingot (`mythril-ingot`) | 1 |
| 3 | high | Orichalcum Ore (`orichalcum-ore`) | Orichalcum Ingot (`orichalcum-ingot`) | 26 |

### Wood (Wood Chopping, the Forest)

| Tier | Band | Raw | Refined | Opens at Craft Lv |
|---|---|---|---|---|
| 1 | low | Pine Log (`pine-log`) | Pine Plank (`pine-plank`) | 1 |
| 1 | high | Cedar Log (`cedar-log`) | Cedar Plank (`cedar-plank`) | 26 |
| 2 | low | Cherry Log (`cherry-log`) | Cherry Plank (`cherry-plank`) | 1 |
| 2 | high | Ebony Log (`ebony-log`) | Ebony Plank (`ebony-plank`) | 26 |
| 3 | low | Elderwood Log (`elderwood-log`) | Elderwood Plank (`elderwood-plank`) | 1 |
| 3 | high | Yggdrasil Branch (`yggdrasil-branch`) | Yggdrasil Plank (`yggdrasil-plank`) | 26 |

### Vegetables (Farming, the Fields)

| Tier | Band | Raw | Refined | Opens at Craft Lv |
|---|---|---|---|---|
| 1 | low | Carrot (`carrot`) | Chopped Carrot (`chopped-carrot`) | 1 |
| 1 | high | Cabbage (`cabbage`) | Shredded Cabbage (`shredded-cabbage`) | 26 |
| 2 | low | Bell Pepper (`bell-pepper`) | Sliced Bell Pepper (`sliced-bell-pepper`) | 1 |
| 2 | high | Asparagus (`asparagus`) | Trimmed Asparagus (`trimmed-asparagus`) | 26 |
| 3 | low | Golden Carrot (`golden-carrot`) | Golden Carrot Purée (`golden-carrot-puree`) | 1 |
| 3 | high | Emperor Pumpkin (`emperor-pumpkin`) | Pumpkin Purée (`pumpkin-puree`) | 26 |

### Fish (Fishing, the Fishery)

| Tier | Band | Raw | Refined | Opens at Craft Lv |
|---|---|---|---|---|
| 1 | low | Carp (`carp`) | Carp Fillet (`carp-fillet`) | 1 |
| 1 | high | Sardine (`sardine`) | Sardine Fillet (`sardine-fillet`) | 26 |
| 2 | low | Sea Bream (`sea-bream`) | Sea Bream Fillet (`sea-bream-fillet`) | 1 |
| 2 | high | Tuna (`tuna`) | Tuna Fillet (`tuna-fillet`) | 26 |
| 3 | low | Silverfin (`silverfin`) | Silverfin Fillet (`silverfin-fillet`) | 1 |
| 3 | high | Rainbow Koi (`rainbow-koi`) | Rainbow Koi Fillet (`rainbow-koi-fillet`) | 26 |

### Stone (Hunting, the Monster Den)

| Tier | Band | Raw | Refined | Opens at Craft Lv |
|---|---|---|---|---|
| 1 | low | Quartz (`quartz`) | Cut Quartz (`cut-quartz`) | 1 |
| 1 | high | Citrine (`citrine`) | Cut Citrine (`cut-citrine`) | 26 |
| 2 | low | Sapphire (`sapphire`) | Cut Sapphire (`cut-sapphire`) | 1 |
| 2 | high | Diamond (`diamond`) | Cut Diamond (`cut-diamond`) | 26 |
| 3 | low | Starstone (`starstone`) | Cut Starstone (`cut-starstone`) | 1 |
| 3 | high | Philosopher's Stone (`philosophers-stone`) | Cut Philosopher's Stone (`cut-philosophers-stone`) | 26 |
<!-- /live -->

## Made items

The four making places turn refined materials into what an Uma uses (PP10):
- **Weapon Gem** (the Forge): raises a weapon one grade.
- **Armor Fittings** (the Armorer): raise an armor slot one grade.
- **Accessory Setting** (the Charm Shop): raises her accessory slot one grade.
- **Planet and Moon Jewels** (the Lapidary): open her Extra Stats map's nodes ([loops](loops.md#extra-stats-and-gear)).

**One recipe an item, the same amounts in every tier** (PP10, PP11): a Weapon Gem 2 metal and 2 wood; Armor Fittings 1
vegetable and 1 fish in the low band (G1–G5), 1 metal, 1 wood and 1 stone in the high band (G6–G10); an Accessory Setting
12 refined, half vegetables and half fish; a Planet Jewel 3 each of stone, wood, vegetables and fish; a Moon Jewel 3 stone
on 1 metal.

**The ladder** (PP9) picks each refined type: a grade's band picks the low or the high type, and a later world moves the
top grade of each band onto its own pair. In a Tier 2 world G5 and G10 take Tier 2's types; in Tier 3 G4 and G9 take Tier
2's and G5 and G10 Tier 3's. The making places colour a grade by its material's tier (Tier 2 amber, Tier 3 violet).

A made item of grade g opens at Craft Lv 5g − 4. Making one takes a gather's time for each refined item in it (a Weapon
Gem 4, Armor Fittings 2 or 3, an Accessory Setting 12, a Planet Jewel 12, a Moon Jewel 4).

### Jewels

A jewel's grade is its node's: Planet n is grade 2n − 1, a moon's n grade 2n. A Moon Jewel opens node n of any moon,
picked when it's set; Moon Jewels II and IV also open her own moon's I and II.

<!-- live:gems -->
| Jewel | Id | Opens | Grade | Uma Lv | Recipe (Tier 1) |
|---|---|---|---|---|---|
| Planet Jewel I | `jewel-planet-1` | Planet I | 1 | 1 | 3× Cut Quartz, 3× Pine Plank, 3× Chopped Carrot, 3× Carp Fillet |
| Planet Jewel II | `jewel-planet-2` | Planet II | 3 | 11 | 3× Cut Quartz, 3× Pine Plank, 3× Chopped Carrot, 3× Carp Fillet |
| Planet Jewel III | `jewel-planet-3` | Planet III | 5 | 21 | 3× Cut Quartz, 3× Pine Plank, 3× Chopped Carrot, 3× Carp Fillet |
| Planet Jewel IV | `jewel-planet-4` | Planet IV | 7 | 31 | 3× Cut Citrine, 3× Cedar Plank, 3× Shredded Cabbage, 3× Sardine Fillet |
| Planet Jewel V | `jewel-planet-5` | Planet V | 9 | 41 | 3× Cut Citrine, 3× Cedar Plank, 3× Shredded Cabbage, 3× Sardine Fillet |
| Moon Jewel I | `jewel-moon-1` | node I of a moon | 2 | 6 | 3× Cut Quartz, Copper Ingot |
| Moon Jewel II | `jewel-moon-2` | node II of a moon; her moon's I | 4 | 16 | 3× Cut Quartz, Copper Ingot |
| Moon Jewel III | `jewel-moon-3` | node III of a moon | 6 | 26 | 3× Cut Citrine, Iron Ingot |
| Moon Jewel IV | `jewel-moon-4` | node IV of a moon; her moon's II | 8 | 36 | 3× Cut Citrine, Iron Ingot |
| Moon Jewel V | `jewel-moon-5` | node V of a moon | 10 | 46 | 3× Cut Citrine, Iron Ingot |
<!-- /live -->

## Gear

**Grades, not pieces** (WP2, WP3): every Uma has three weapon slots (her class's three weapons), five armor slots (head,
body, legs, arms, feet) and one accessory slot, each at a grade from G0 to G10. A made item of the next grade raises a
slot one grade; nothing is crafted, bound or worn, and gear has no ranks. Grade g opens at Uma Lv 5g − 4.

- **A weapon's Might:** its grade's value, added to the offense of hits made with that weapon, × the tier.
- **Armor:** each slot adds its stat (head DEF, body HP, legs MP, arms M.DEF, feet Speed) and ATK or M.ATK by her class's
  half: a physical class's armor gives ATK, a magical class's M.ATK. Switching class switches the half; the grades stay.
- **The accessory slot:** its grade, and a family and form she sets freely outside fights (WP19). The four families, from
  Tier 1, each in its base form: the **Pendant** (flat offense on her three weapons' kinds), the **Orb** (flat offense on
  one kind she sets), the **Bell** (a follow-up strike when her act includes an Attack) and the **Insignia** (more damage
  to sub-bosses and bosses). G0 does nothing.
- **Her signature** (WP33, UT7): her knack names one family; while she wears it, her ATK and M.ATK rise 0.2 a level ×
  the tier. The accessory sheet puts her family first, marked ★, and her standard preset wears it.

Each grade's icon comes from uma-art's gear rows (H28), the made items' from its items atlas (uma-art 2.13.0, H73).

<!-- live:gear -->
| Grade | Opens at Lv | Weapon Might (Tier 1 · 2 · 3) | Armor: offense a piece | Head DEF | Body HP | Legs MP | Arms M.DEF | Feet Speed |
|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 · 2 · 3 | 1 | 4 | 15 | 3 | 4 | 2 |
| 2 | 6 | 4 · 7 · 10 | 1 | 8 | 30 | 6 | 8 | 4 |
| 3 | 11 | 8 · 14 · 21 | 2 | 12 | 45 | 9 | 12 | 6 |
| 4 | 16 | 12 · 22 · 31 | 2 | 16 | 60 | 12 | 16 | 8 |
| 5 | 21 | 19 · 34 · 49 | 3 | 20 | 75 | 15 | 20 | 10 |
| 6 | 26 | 26 · 47 · 68 | 3 | 24 | 90 | 18 | 24 | 12 |
| 7 | 31 | 35 · 63 · 91 | 4 | 28 | 105 | 21 | 28 | 14 |
| 8 | 36 | 45 · 81 · 117 | 4 | 32 | 120 | 24 | 32 | 16 |
| 9 | 41 | 57 · 103 · 148 | 5 | 36 | 135 | 27 | 36 | 18 |
| 10 | 46 | 68 · 122 · 177 | 5 | 40 | 150 | 30 | 40 | 20 |

Each armor piece adds its offense to ATK on a physical Uma and to M.ATK on a magical one (her class's half), and its slot's stat. Armor's values × 1, 1.8, 2.6 in Tiers 1, 2 and 3 (Feet Speed doesn't scale).

What raises a slot one grade, in a Tier 1 world:

| Grade | Weapon Gem | Armor Fittings | Accessory Setting |
|---|---|---|---|
| 1 | 2× Copper Ingot, 2× Pine Plank | Chopped Carrot, Carp Fillet | 6× Chopped Carrot, 6× Carp Fillet |
| 2 | 2× Copper Ingot, 2× Pine Plank | Chopped Carrot, Carp Fillet | 6× Chopped Carrot, 6× Carp Fillet |
| 3 | 2× Copper Ingot, 2× Pine Plank | Chopped Carrot, Carp Fillet | 6× Chopped Carrot, 6× Carp Fillet |
| 4 | 2× Copper Ingot, 2× Pine Plank | Chopped Carrot, Carp Fillet | 6× Chopped Carrot, 6× Carp Fillet |
| 5 | 2× Copper Ingot, 2× Pine Plank | Chopped Carrot, Carp Fillet | 6× Chopped Carrot, 6× Carp Fillet |
| 6 | 2× Iron Ingot, 2× Cedar Plank | Iron Ingot, Cedar Plank, Cut Citrine | 6× Shredded Cabbage, 6× Sardine Fillet |
| 7 | 2× Iron Ingot, 2× Cedar Plank | Iron Ingot, Cedar Plank, Cut Citrine | 6× Shredded Cabbage, 6× Sardine Fillet |
| 8 | 2× Iron Ingot, 2× Cedar Plank | Iron Ingot, Cedar Plank, Cut Citrine | 6× Shredded Cabbage, 6× Sardine Fillet |
| 9 | 2× Iron Ingot, 2× Cedar Plank | Iron Ingot, Cedar Plank, Cut Citrine | 6× Shredded Cabbage, 6× Sardine Fillet |
| 10 | 2× Iron Ingot, 2× Cedar Plank | Iron Ingot, Cedar Plank, Cut Citrine | 6× Shredded Cabbage, 6× Sardine Fillet |

Accessory families (one slot, its family, form and kind a setting changed freely outside fights; the grade is the slot's):

| Family | Base form | G1 → G10 (Tier 1) |
|---|---|---|
| Pendant | Flat offense on each of her three weapons' kinds | 1, 1, 2, 2, 4, 5, 7, 9, 12, 14 |
| Orb | Flat offense on one kind she sets, one of her three weapons’ kinds | 1, 2, 3, 5, 8, 10, 14, 18, 23, 27 |
| Bell | When her act includes an Attack, her weapon of its kind strikes again at a share of an Attack | 0.1 a grade × her hand (1 at G10), every tier |
| Insignia | Her hits on sub-bosses and bosses hit harder | +1.5% a grade (+15% at G10), every tier |

Her signature: while she wears her knack's family, ATK and M.ATK +2 · +6 · +10 at Lv 10 · 30 · 50 (0.2 a level × the tier).
<!-- /live -->
