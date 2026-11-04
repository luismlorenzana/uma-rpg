# Extra Stats in Tiers 2 and 3: the Planet, the moons and the weapon moons

> **Status: drafting, 2026-11-04. Nothing here is built.** One of the seven docs of [the Tier 2 and Tier 3 set](README.md),
> calls **T2E1–T2E20**, each with a recommendation; no open questions. It carries
> [extra-stats-progression.md](../tier-rework/extra-stats-progression.md) (EP1–EP29, D194) and the star chart's corner
> (profile polish's PP31, D277) onto **Tier 1 as it is built and live** (engine v21, save v36). The manual
> ([loops § Extra Stats](../../game/loops.md#extra-stats), [materials § Jewels](../../game/materials.md#jewels),
> [sections § Stable](../../game/sections.md#stable)) is the game as it plays.
>
> **Pages** (desktop, light and dark): [the chart at every tier](previews/extra-stats-chart.html) ·
> [Tier 1 → 2 → 3: nodes, ranks, grants](previews/extra-stats-tiers.html) ·
> [the weapon moons: Full or Split, presets, what they add](previews/extra-stats-weapon-moons.html).
>
> **Numbers come from the code** (`economy/planet.ts`, `economy/accessories.ts`, `economy/grades.ts`,
> `world/balance-party.ts`, `economy/professions-v4.sim.ts`, `places/observatory/star-chart.ts`), printed by a throwaway
> test that is not committed. **Names:** every name this doc uses for a new thing (weapon moon, Full, Split, outer orbit,
> crescent, steel, lavender) was checked against every string in uma-platform's master-data release
> (`content/release/data/*.json`, case-insensitive exact match): none matches. Umas are shown by role.

## 1. At a glance

Tier 1's map stays exactly as built in every tier, × 1.8 and × 2.6. **Tier 2 adds one weapon moon, Tier 3 a second**:
five nodes of flat offense on her hits of one kind (**Full**) or two (**Split**, 0.7 each). They sit on **the Planet's
ranks and share its jewels**, so every rank still sets three jewels and the Lapidary's work an Uma doesn't move.

| | Tier 1 (live) | Tier 2 | Tier 3 |
|---|---|---|---|
| **Bodies** | The Planet, Prowess, Vigor, Guard, ★ her moon | + **a weapon moon** | + **a second weapon moon** |
| **Nodes** | **22** (20 shared + her 2) | **27** | **32** |
| **A rank (one grade)** | **Three jewels**: odd ranks 3 Planet Jewels on the Planet, even ranks 1 Moon Jewel on each moon | Odd ranks: **the Planet 2, the weapon moon 1**; even the same | Odd ranks: **the Planet 1, each weapon moon 1** |
| **Jewels an Uma** | 30 (3 of each of the ten) | **30, the same ten** | **30, the same ten** |
| **Lapidary, refined an Uma** | 150 Stone, about 40 h a Stone place | **150, unchanged** | **150, unchanged** |
| **A stat with its moon, Lv 50** | +51 (HP +255) | +92 (HP +460) | +133 (HP +665) |
| **Weapon moons, Lv 50** | — | **Full +90** on one kind, or **Split +63** on each of two | + **Full +130** or **Split +91**, every kind different |
| **What the new bodies add to her act** (model, §4.9) | The core: +26–34% | **+11–15%** (+16–20% on its kinds' hits) | **+19–25%** on all three of her weapons |
| **Extra Stats' share of her damage** (model) | 21–25% | **31–33%** | **35–38%** |
| **On the chart** | 360 × 350, five bodies | + one crescent on an **outer orbit** below: 360 × 470 | + two on it: 360 × 500 |
| **Her window's Stars track** | 4 · 9 · 13 · 18 · 22 | **5 · 11 · 16 · 22 · 27** | **6 · 13 · 19 · 26 · 32** |
| **Her choices** | Which moon takes the next Moon Jewel (Set all decides) | + her weapon moon's kinds: Full or Split, one tap | + both moons' kinds, one tap |

## 2. Tier 1 as built

### 2.1 The map

The Planet and three moons, five nodes each, and her moon's two: **22 nodes**, every class the same
([loops](../../game/loops.md#extra-stats); `economy/planet.ts`). Every open node counts; nothing switches on.

| Body | Nodes | Grades · opens at | Points I–V (Tier 1) | Gives |
|---|---|---|---|---|
| **Planet** | 5 | 1, 3, 5, 7, 9 · Lv 1, 11, 21, 31, 41 | 1, 2, 4, 6, 8 | All six core stats (HP 5 a point) |
| **Prowess** | 5 | 2, 4, 6, 8, 10 · Lv 6, 16, 26, 36, 46 | 2, 4, 6, 8, 10 | ATK and M.ATK by her active class's split |
| **Vigor** | 5 | the same | the same | HP and MP |
| **Guard** | 5 | the same | the same | DEF and M.DEF |
| **★ Her moon** | 2 | with the third moon's II (Lv 16) and IV (Lv 36) | 4, 8 | I her knack's stat; II her calling's root (Warrior DEF, Mage M.DEF, All-Rounder half each) |

- **Prowess's split** (`PROWESS_SPLIT`): Brawler 100/0, Arms Spellblade 70/30, Arms Summoner 70/30, Paladin 80/20,
  Cleric 20/80, Tome Summoner 30/70, Tome Spellblade 30/70, Sorcerer 0/100; a Tier 0 a third a slot to its channel.
  Each node's larger share rounds half up, the rest to the smaller.
- **A point** (D104): +1 to its stat, HP +5, Speed 0.6% evasion, Limit 0.4 of the gauge. Speed and Limit come only from
  her moon (a Fleet or Gritty knack, 4 points in every tier).
- **Values × tier** (`tierScaled`, SB1): every node's Tier 1 points × 1.8 and × 2.6, rounded half up, **already live**:
  a Tier 2 world runs this map at Tier 2's values today.

### 2.2 Three jewels a rank (D264)

A rank is one grade. Every rank sets **three jewels**, which is what makes the Stone line equal to the other four.

| Rank (grade) | Lv | Jewels | Opens |
|---|---|---|---|
| 1, 3, 5, 7, 9 | 1, 11, 21, 31, 41 | **3 Planet Jewels** n | Planet n |
| 2, 4, 6, 8, 10 | 6, 16, 26, 36, 46 | **3 Moon Jewels** n, one a moon | Prowess n, Vigor n, Guard n; her moon I with the three moons' II, II with their IV |

- **Jewels:** Planet Jewel I–V (`jewel-planet-1`…`5`, grades 1, 3, 5, 7, 9) and Moon Jewel I–V (`jewel-moon-1`…`5`,
  grades 2, 4, 6, 8, 10), each **5 cut stones of its grade** at the Lapidary (FL9, D264), made from Craft Lv 5g − 4.
- **An Uma:** 3 of each of the ten, **30 jewels, 150 refined Stone items**: Wood's and Fish's 150, and what each weapon
  line averages over a roster split between Arms and Tomes ([materials](../../game/materials.md#what-a-maxed-uma-takes)).
  The ledger (`professions-v4.sim.ts`) gives every place **50.2 h** on one maxed Uma at Craft Lv 25's manual times
  (about 40 h at a place's ×1.25): 753 h in all, each trade 20%.

### 2.3 The Stars tab and the chart

Only on her profile's Stars tab ([sections](../../game/sections.md#stable); D269, D277, D278, D297). The Observatory is
gone: the Gallery stands in its place (D283, D288).

| Part | As built |
|---|---|
| **First row** | "Extra Stats · Open 13/22 · 2 ready", **Set all** while a jewel fits, the (i) |
| **The chart** | 360 × 350 on the night sky: the Planet at (180, 208) on a ring of 44; Prowess, Vigor and Guard on one orbit of 132 at −90°, 150°, 30° (spearhead, pentagon, shield); her moon's pair at (304, 62) beside a crescent. Stars clockwise from I, numerals the jewels'. Four states: Open, Ready (green dot, slow pulse), Next, Later. Crests are uma-art pixel art in 44 pt buttons (H144) |
| **The test** (`star-chart.test.ts`) | 22 nodes once, in map order; any two stars 44 pt apart at 375 wide (46.2 units); every star inside; the Planet's on its ring, the moons on one orbit; clockwise from the top; labels off the stars for the longest template name; crest buttons off their stars |
| **The totals** | Six cells with stat marks, then her moon's accent line ("★ Evasion +2.4% · DEF +8") |
| **A node's sheet** | A strip of the body's nodes; what it gives for her class; before → after from her battle sheet; its jewel ("Planet Jewel III ×3 · 4 held"); **Set**, or what stops it ("Guard II first", "Lv 41", the jewels held) |
| **Set all** | Every jewel that fits, one line each; Planet Jewels first; a Moon Jewel to the moon furthest behind, Prowess, Vigor, Guard on a tie; one save write |
| **The dot** | `upgrades.stars`: a jewel she can set now |

### 2.4 Where Extra Stats shows elsewhere

| Where | As built |
|---|---|
| **Her window** ([loops § Windows](../../game/loops.md#windows); D283, D289) | The Stars track: every node to I, II, III and IV (4, 9, 13, 18 open), then the whole map (22). The same counts in every tier today |
| **Ascend** ([loops § Ascend](../../game/loops.md#ascend)) | She arrives with an empty map; the jewels she set are gone |
| **Targets** (`save/targets.ts`) | Plan every core node at its jewel count |
| **Details** (D276, D279) | Every damage source on every weapon's row; stat rows split base, armor, accessory and Stars |
| **The foes** (`rpgFoeTierBudget`) | The build budget's part × the tier; the balance party's map is the core her level opens (`onCurveStars`) |

### 2.5 Beside it: the Orb, as built

The three accessory slots matter here because the weapon moons are the same kind of thing as an Orb
([combat](../../game/combat.md#her-accessory-and-signature); D264, D266):

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **One Orb at G10** (+2 a grade, linear) | +20 on its kind | +36 | +52 |
| **Three Orbs on one kind** | +60 | +108 | +156 |
| **Her weapon's Might, G10** | 68 | 122 | 177 |

**No kind cap is built.** The draft's cap (WP24, +68 × tier on one kind from accessory forms) was written for Great
Orbs and branch forms that never shipped; D264 and D266 made the rows linear and the slots three, so three slots bound
the Orbs on their own.

## 3. The approved drafts, call by call

### 3.1 EP1–EP29 and PP31

Every call of extra-stats-progression.md (D194), and the star chart's one call that names Tiers 2 and 3 (profile
polish PP31, D277; not profession-progression's PP).

| Call | What it said | Status | Why |
|---|---|---|---|
| **EP1** Tier 1's shape | The Planet and three moons, 20 nodes, every class; her moon's 2 beside | **Kept** | Live; the core of every tier |
| **EP2** The Planet | +1, +2, +4, +6, +8 to all six × tier, Lv 1–41 | **Kept** | Live |
| **EP3** A moon node | Its grade × tier; Guard both defenses; Prowess splits | **Kept** | Live |
| **EP4** Vigor, both pools | HP and MP; the pool and a base regen (SB18) | **Kept** | Live |
| **EP5** What opens a node | Its jewel, in order, at Uma Lv 5g − 4 | **Kept, changed** (D264) | Three jewels a rank: a Planet node three, a moon node one, her moon none. In Tiers 2 and 3 the Planet takes two and one (T2E2) |
| **EP6** What counts | Every open node; no active slots | **Kept** | Live |
| **EP7** Values across tiers | × 1, 1.8, 2.6 per node, half up; Prowess's rounding; a Split node 0.7 of the Full, rounded; shares don't scale | **Kept** | Live for the core (`tierScaled`); the Split rule stands (T2E3) |
| **EP8** Speed and Limit | Off the shared map in every tier | **Kept** | Live: only her Fleet and Gritty knacks |
| **EP9** The Halo | Retired, folded into the weapon moons | **Kept** | Never built |
| **EP10** Weapon moons and groups | Kinds, never a group; the picker lists her slotted kinds, then by group | **Kept, changed** (D264, D266) | A weapon moon's kinds are her three weapons', as an Orb's are; the list is one tap and has no "by group" tail (T2E4, T2E5) |
| **EP11** Valor | Retired | **Kept** | Never built |
| **EP12** Tier 3 | A second weapon moon; no class constellations | **Kept** | T2E1 |
| **EP13** The core across tiers | Rebuilt empty at promotion; tiers add weapon moons, never core nodes | **Kept** | Live as Ascend (D283): an empty map, the jewels gone |
| **EP14** Her moon | Two nodes, Lv 16 and 36 on Moon Jewels II and IV; node II her calling channel's defense; × tier | **Kept, changed** (D264, CV21) | No jewel: she opens with the three moons' II and IV; node II by her calling's root, an All-Rounder half each. Two nodes in every tier (T2E15) |
| **EP15** Defense and sustain | No new defensive values; MP pool and base regen | **Kept** | Live; the weapon moons add no defense |
| **EP16** The foe budget | Rates kept; the build part × tier; `onCurveStars` the core; weapon moons in each tier's toolbox term | **Kept** | The first three are live; the term is T2B's (T2E17) |
| **EP17** Jewel kinds | Planet Jewel I–V and Moon Jewel I–V in every tier, any moon's picked when set | **Kept, changed** (D264) | Still two kinds, ten items; a weapon moon takes **Planet** Jewels, not Moon Jewels, so a rank stays three (T2E2) |
| **EP18** Recipes | Moon Jewel 4 refined, Planet Jewel 12 of four lines; Lapidary 120 · 140 · 160 | **Superseded** (D264) | Every jewel is 5 cut stones of its grade (FL9); the Lapidary is 150 in every tier (T2E2) |
| **EP19** The Observatory | One page in every tier, the map in code, chips for the weapon moons | **Superseded** (D269, D277, D283) | Her Stars tab and the star chart; the Gallery took the Observatory's place (T2E9, T2E12) |
| **EP20** Targets and "can upgrade" | Plan every body, every class the same; a jewel she can set now | **Kept** | Live; Tiers 2 and 3 add the weapon moons at their counts (T2E18) |
| **EP21** Old maps and Star Gems | Deleted, compensated with tickets for time | **Kept** | Built in R2 (save v28); nothing left for Tiers 2 and 3 |
| **EP22** Names and art | The Planet; Prowess, Vigor, Guard; weapon moons named by kind, Full and Split; today's gem icons | **Kept, changed** (D277, D297) | The chart's crests are pixel art; a weapon moon needs one more crest (T2E10) and its label is its kinds (T2E11) |
| **EP23** Prowess | One offense moon split by class | **Kept, changed** (CV18, CV7) | Eight Tier 1 classes: the Arms Summoner 70/30 and the Tome Spellblade 30/70 mirror their pairs; a Tier 0 splits by slots (Tier 1 only). A class branch keeps its class's split (T2E20) |
| **EP24** Weapon moons | Five nodes on Moon Jewels I–V at Lv 6–46, +4, +7, +10, +13, +16 × tier | **Kept, changed** (D264) | Values kept; the nodes move to the Planet's ranks (Lv 1–41) and take one Planet Jewel each, so every rank stays three jewels (T2E2, T2E3) |
| **EP25** Full or Split | Full one kind; Split two at 0.7 | **Kept** | Re-measured on today's sheet: Split wins an even act, Full a lead-heavy one, break-even about 2.5× (§4.9) |
| **EP26** Tier 3's second moon | Full + Split serves three weapons; Full + Full two; no Split + Split | **Kept** | T2E5 |
| **EP27** Weapon moons and the kind cap | Outside the cap (+68 × tier), bounded by their size | **Kept, changed** | The cap was never built in Tier 1; T2G14 brings it back for the Orb forms from Tier 2, and the moons stay outside it with no cap of their own (T2E6, reconciled) |
| **EP28** Valor and Swiftness | Retired | **Kept** | Never built |
| **EP29** Weapon-moon presets | Tier 2 Split on her two most-used kinds; Tier 3 Full + Split; a hybrid's on her lead half; both class branches' sets | **Broken** | Written for six classes, their branches and Dual weapons; Classes v3 (D240) has eight classes, presets are the owner's two comps (D263) and the Orb's kind is `presetKind` (D266). T2E7 restates it on today's presets |
| **PP31** (profile polish) The chart's corner | The top-left corner stays empty: the weapon moons fit there | **Kept, changed** (D277) | The corner stays empty, but under D277's own tests (44 pt, labels inside) it holds one five-star body without room for a Split's label, and no second one. The weapon moons ride an outer orbit below (T2E9); the corner stays free (T2E19) |

**Counts:** Kept 18 · Kept, changed 8 · Superseded 2 · Broken 2 (EP27, EP29).

### 3.2 The old previews

| Old page (`tier-rework/previews/`) | Now |
|---|---|
| `stars-maps.html` (the map at every tier, every class, Full or Split, the Observatory) | **Carried** into [extra-stats-chart.html](previews/extra-stats-chart.html) (the live chart, Tiers 1–3) and [extra-stats-tiers.html](previews/extra-stats-tiers.html) (every node at every tier) |
| `stars-grants.html` (each tier's impact, sheets, the build share, Prowess by class, defense, the foe curve) | **Carried** into [extra-stats-weapon-moons.html](previews/extra-stats-weapon-moons.html) (impact, sheets) and [extra-stats-tiers.html](previews/extra-stats-tiers.html) (grants by class); defense and the foe curve go to T2B |
| `stars-jewels.html` (equal for every class, recipes, the Lapidary page) | **Carried** into [extra-stats-tiers.html](previews/extra-stats-tiers.html) (three a rank, the Lapidary's demand); its recipe options **retire** with EP18 (D264) |
| `stars-uma.html` (her moon: knacks, lead, six Umas, the budget) | **Carried** for her moon's values by tier into [extra-stats-tiers.html](previews/extra-stats-tiers.html); the template budget and the six Umas are T2U's |
| `extra-stats-budget.html`, `extra-stats-maps.html` (the first round, ES calls) | **Retired**: the archived first round's pages, superseded by EP's and now these |

## 4. Tier 2 in full

### 4.1 The map: 27 nodes

| Body | Nodes | Ranks · Lv | Jewels a node | I | II | III | IV | V | Lv 50 (Tier 2) |
|---|---|---|---|---|---|---|---|---|---|
| **Planet** | 5 | 1–9 odd · 1, 11, 21, 31, 41 | **2 Planet Jewels** | +2 | +4 | +7 | +11 | +14 | **+38** to each of six (HP +190) |
| **Weapon moon**, Full | 5 | the Planet's | **1 Planet Jewel** | +7 | +13 | +18 | +23 | +29 | **+90** on one kind |
| **Weapon moon**, Split | | | | +5 | +9 | +13 | +16 | +20 | **+63** on each of two |
| **Prowess** | 5 | 2–10 even · 6 … 46 | 1 Moon Jewel | +4 | +7 | +11 | +14 | +18 | **+54**, her class's split |
| **Vigor** | 5 | the same | 1 Moon Jewel | HP +20, MP +4 | HP +35, MP +7 | HP +55, MP +11 | HP +70, MP +14 | HP +90, MP +18 | **HP +270, MP +54** |
| **Guard** | 5 | the same | 1 Moon Jewel | +4 | +7 | +11 | +14 | +18 | **DEF, M.DEF +54** |
| **★ Her moon** | 2 | with the moons' II and IV | none | +7 knack | +14 root | | | | §4.10 |

### 4.2 Three jewels a rank: the Planet shares (T2E2)

| Rank (grade) | Lv | Jewels | Opens |
|---|---|---|---|
| 1 | 1 | 3 Planet Jewel I | Planet I (2), weapon moon I (1) |
| 2 | 6 | 3 Moon Jewel I | Prowess I, Vigor I, Guard I |
| 3 | 11 | 3 Planet Jewel II | Planet II (2), weapon moon II (1) |
| 4 | 16 | 3 Moon Jewel II | the moons' II, and her moon I with them |
| 5 · 7 · 9 | 21 · 31 · 41 | 3 Planet Jewels III · IV · V | Planet (2) and weapon moon (1) |
| 6 · 8 · 10 | 26 · 36 · 46 | 3 Moon Jewels III · IV · V | the three moons; her moon II with the IVs |

**Why the Planet shares, not a fourth jewel.** The draft (EP24) put the weapon moon on Moon Jewels, so every even rank
would set four. That breaks D264's "every line equal": a rank's Stone would no longer be 30 refined on two Umas, and no
whole recipe brings it back (15 Planet × 5 + 20 Moon × r = 150 needs r = 3.75).

| Rule | Jewels an Uma (T1 · T2 · T3) | Stone refined | Each Stone place, one maxed Uma | Stone's share of her 753 h |
|---|---|---|---|---|
| **The Planet shares its rank (T2E2)** | **30 · 30 · 30** | **150 · 150 · 150** | **50.2 h in every tier** | **20% in every tier** |
| The weapon moon on Moon Jewels (the draft) | 30 · 35 · 40 | 150 · 175 · 200 | 50.2 · 58.6 · 66.9 h | 20% · 22.6% · 25.0% (753 · 778 · 803 h) |
| The weapon moon takes no jewel (as her moon) | 30 · 30 · 30 | 150 | 50.2 h | 20%, but a body as big as the core's best opens by itself and the Planet keeps three |

The Planet gives the same in every tier whatever it costs, so two jewels a node in Tier 2 and one in Tier 3 move no
stat; the weapon moon is paid for with the jewel the Planet gives up. The ten items, their recipes and the Lapidary's
picker are Tier 1's.

### 4.3 The weapon moon (T2E3–T2E5)

- **What it is:** a moon of five nodes whose points are **flat offense on her hits of a kind**, added in the damage
  stack's step 1 beside her Might and her Orbs ([combat](../../game/combat.md#damage)): Attacks, skills, both halves of a
  hybrid's pair (each half its own kind), summons and Limit Breaks of that kind. **Never a heal** (mends read ATK or
  M.ATK alone), **never a kind**: weaknesses, shields and Breaks read only her weapons.
- **Its size (EP24 kept):** Full +4, +7, +10, +13, +16 × tier, **+50 × tier**: Tier 2 **+90** on one kind, what the
  whole Tier 1 map gives a stat × 1.8 (+92). A Split node is 0.7 of the Full one, rounded: **+63 on each of two**.
- **Full or Split (EP25 kept).** Full: one kind. Split: two different kinds, the same five nodes and jewels light both.
  On today's sheet (§4.9) Split wins when her damage spreads; Full wins when her Full kind deals more than **about 2.5
  times** her second kind (a tuned front, a long fight on one weakness).
- **Its kinds are her three weapons'**, as an Orb's are (D264): set from one list, free outside fights. A class switch
  that drops a kind leaves it **stale**: it gives nothing and its row says so ("No Bow in her slots"), like a stale Orb.
- **The list, one tap (D266's pattern):** her weapon moon's sheet has a Kinds row; it opens **six rows** for her three
  weapons: Full on each, Split on each pair. A tap wears the row, with no Set, and the sheet goes back to the node
  with its new values (one sheet at a time, as D278's strip):

  | Row (a Brawler: Greatsword, Axe, Lance) | Gives now (III open) | At V |
  |---|---|---|
  | Full · Greatsword | Greatsword +38 | +90 |
  | Full · Axe | Axe +38 | +90 |
  | Full · Lance | Lance +38 | +90 |
  | **Split · Greatsword + Axe** (her preset, ticked) | +27 each | +63 each |
  | Split · Greatsword + Lance | +27 each | +63 each |
  | Split · Axe + Lance | +27 each | +63 each |

### 4.4 No kind cap (T2E6)

The draft kept a kind cap for accessories and put the moons outside it (EP27). Tier 1 has no cap today; from Tier 2,
[gear](gear.md) T2G14 caps the **Orb forms** on one kind at a G10 weapon's Might × tier (+122 · +177), and the moons stay
outside it, as EP27 had them. The moons need no cap of their own: the most flat any one kind carries is three Orbs and a
Full moon, under a third of her offense on that kind (with three Great Orbs at T2G14's cap, about a third).

| A Brawler's Greatsword at Lv 50 | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Her preset (two Pendants, an Orb), no moon | 297 | 535 | 774 |
| Her preset and a Full moon on it | — | 625 | 904 |
| **Everything on one kind:** three Orbs and a Full moon | 317 (Orbs only) | **661** | **956** |
| Of it, flat on that kind (Orbs and moon) | 19% | **30%** | **30%** |

The stack is bounded by slot count and the moon's size: (60 + 50) × tier on one kind, nothing multiplies it, and the
engine's `flat` field allows 1,000. If T2G gives later accessories a cap, the weapon moons never count against it.

### 4.5 Presets (T2E7)

The Standard preset (D164, D263) sets her weapon moon with her weapons and accessories. **Tier 2: Split on her Orb's
kind (`presetKind`) and her other weapon of the same half**; Tier 3: Full on that kind and Split on her other two (§5.3).

| Class (preset weapons, D263) | Her Orb's kind | Tier 2 | Tier 3 |
|---|---|---|---|
| **Brawler** (Greatsword, Axe, Lance) | Greatsword | Split Greatsword + Axe | Full Greatsword · Split Axe + Lance |
| **Arms Spellblade** (Katana, Axe, Lightning) | Katana | Split Katana + Axe | Full Katana · Split Axe + Lightning |
| **Arms Summoner** (Bow, Axe, Dark) | Bow | Split Bow + Axe | Full Bow · Split Axe + Dark |
| **Paladin** (Lance, Greatsword, Light) | Lance | Split Lance + Greatsword | Full Lance · Split Greatsword + Light |
| **Cleric** (Light, Fire, Lance) | Light | Split Light + Fire | Full Light · Split Fire + Lance |
| **Tome Summoner** (Dark, Ice, Bow) | Dark | Split Dark + Ice | Full Dark · Split Ice + Bow |
| **Tome Spellblade** (Lightning, Ice, Katana) | Lightning | Split Lightning + Ice | Full Lightning · Split Ice + Katana |
| **Sorcerer** (Fire, Ice, Lightning) | Fire | Split Fire + Ice | Full Fire · Split Ice + Lightning |

- **Why her Orb's kind and its half:** in the model (§4.9) the Split on her lead half beats the Split on the two kinds
  her Orb leaves (Brawler 12.0% against 11.9%, the hybrids 14.5–15.2% against 11.7–12.9%): her lead half carries the
  larger hand. It is EP29's "most-used" read through D266's `presetKind`.
- **On Ascend** she arrives with the new tier's preset moons, the map empty. A later tier has no Tier 0, so every Uma
  has a Tier 1 class's preset there.

### 4.6 On the chart (T2E9–T2E11)

Tier 1's 22 stars never move. **The weapon moon rides an outer orbit below the core**, a faint arc of radius 172 around
the Planet, and the chart grows to **360 × 470**. [The chart page](previews/extra-stats-chart.html) draws it and runs
the live test's checks on it.

| Piece | Tier 2 |
|---|---|
| **Its figure** | A **crescent**: five stars on 240° of a circle of radius 48 round its crest, clockwise from I at the top, the blade's edge; the closing line V → I when full |
| **Where** | Crest at (180, 380), straight below the Planet; stars I (180, 332), II (221.6, 356), III (221.6, 404), IV (180, 428), V (138.4, 404) |
| **Its colour** | **Steel** `#c8d3e0` (the chart's sixth body colour; no green, PP23) |
| **Its crest** | A crescent blade, one new 24 px crest beside H141's five: an art packet for ChatGPT; a vector stand-in until it lands (as D277 call 4) |
| **Its label** | Its kinds and count, centred under it at (180, 458): "Greatsword 3/5", "Greatsword · Axe 3/5"; the longest pair, "Greatsword · Lightning 5/5", fits (83–277) |
| **The checks** | 27 stars, any two at least 46.2 units apart: the closest pair is still Tier 1's Guard I and V (46.4), a crescent's neighbours are 48 (45.7 pt), and its nearest other star is Guard V, 74.9 away; every star inside; the crest button 48 from its stars and 81 or more from any other body's; labels at their longest inside and off every star |
| **The page** | +120 units, about +119 px at 390 wide: Stars 1.14–1.18 screens becomes about 1.28–1.32 at 390 × 844, under its 1.4 |

### 4.7 The Stars tab (T2E12, T2E13)

| Part | Tier 2 |
|---|---|
| **First row** | "Extra Stats · Open 15/27 · 2 ready" |
| **The totals** | The six cells (the shared map's), her moon's accent line, then **the weapon moon's line in steel**: "Greatsword +27 · Axe +27" (Split) or "Greatsword +38" (Full) |
| **Its sheet** | "Weapon moon III"; the strip of five with their first numbers (+5 +9 +13 +16 +20 on a Split); "Split · Greatsword +13 · Axe +13"; before → after on each kind from her damage sheet (a Brawler at Lv 25: "Greatsword 291 → 304", then "Axe 273 → 286"); "Planet Jewel III ×1 · 4 held"; the **Kinds** row ("Split · Greatsword + Axe ›"); **Set**, or "Weapon moon II first", "Lv 21", the jewel held |
| **The Planet's sheet** | "Planet Jewel III ×2 · 4 held" |
| **Set all** | Its live rule, unchanged: each jewel to the body furthest behind among those it fits, map order on a tie (the Planet, then the weapon moon; Prowess, Vigor, Guard). With three Planet Jewels III: Planet III takes two, the weapon moon one. Lines: "Planet Jewel III ×2 → Planet III · +7 · all six", "Planet Jewel III → Weapon moon III · Greatsword +13 · Axe +13" |
| **The dot** | As built: a jewel she can set now |
| **Details** (D279) | The weapon moon's flat on each weapon's row, beside Might and the Orbs |

### 4.8 What it grants at Lv 50, by class (from the code)

The whole map, her moon apart (`mapPoints` on every core node, Tier 2):

| Class | Prowess split | ATK | M.ATK | Every class: HP · MP · DEF · M.DEF | Weapon moon (preset) |
|---|---|---|---|---|---|
| Brawler | 100/0 | +92 | +38 | **+460 · +92 · +92 · +92** | Greatsword, Axe +63 |
| Arms Spellblade | 70/30 | +77 | +53 | | Katana, Axe +63 |
| Arms Summoner | 70/30 | +77 | +53 | | Bow, Axe +63 |
| Paladin | 80/20 | +81 | +49 | | Lance, Greatsword +63 |
| Cleric | 20/80 | +49 | +81 | | Light, Fire +63 |
| Tome Summoner | 30/70 | +53 | +77 | | Dark, Ice +63 |
| Tome Spellblade | 30/70 | +53 | +77 | | Lightning, Ice +63 |
| Sorcerer | 0/100 | +38 | +92 | | Fire, Ice +63 |

Her offense on each of her three weapons at Tier 2's Lv 50 (the balance party's average outfit, on-curve G10, her
preset's accessories, the whole map, no template), then with her preset moon:

| Class | Weapon 1 | Weapon 2 | Weapon 3 |
|---|---|---|---|
| Brawler | Greatsword 535 → **598** | Axe 499 → **562** | Lance 499 |
| Arms Spellblade | Katana 520 → **583** | Axe 484 → **547** | Lightning 351 |
| Arms Summoner | Bow 520 → **583** | Axe 484 → **547** | Dark 351 |
| Paladin | Lance 505 → **568** | Greatsword 469 → **532** | Light 319 |
| Cleric | Light 505 → **568** | Fire 469 → **532** | Lance 319 |
| Tome Summoner | Dark 520 → **583** | Ice 484 → **547** | Bow 351 |
| Tome Spellblade | Lightning 520 → **583** | Ice 484 → **547** | Katana 351 |
| Sorcerer | Fire 544 → **607** | Ice 508 → **571** | Lightning 508 |

### 4.9 What it adds (the model; T2E17)

**The model**, a draft for T2B's simulation: a hit is offense² ÷ (offense + defense) (D141) against a regular striker at
the tier's Lv 50 (lifetime Lv 100: DEF 390, M.DEF 312); her act is her three weapons, evenly, each at her hand for its
half. Every number holds within 0.3 points from Tier 1 to Tier 3 (SB1 works), so one column serves all tiers.

| Class | The core (her act, map on ÷ off) | **Tier 2 preset: Split** | On its kinds' hits | Full on her Orb's kind | On its hits |
|---|---|---|---|---|---|
| Brawler | +33.5% | **+12.0%** | Greatsword +17.0%, Axe +18.5% | +8.7% | +24.4% |
| Arms Spellblade | +27.5% | **+15.2%** | Katana +17.6%, Axe +19.1% | +11.0% | +25.2% |
| Arms Summoner | +27.5% | **+14.5%** | Bow +17.6%, Axe +19.1% | +10.5% | +25.2% |
| Paladin | +30.1% | **+14.6%** | Lance +18.2%, Greatsword +19.9% | +10.6% | +26.1% |
| Cleric | +29.4% | **+14.7%** | Light +17.5%, Fire +19.1% | +10.6% | +25.0% |
| Tome Summoner | +26.8% | **+14.2%** | Dark +16.9%, Ice +18.4% | +10.3% | +24.2% |
| Tome Spellblade | +26.7% | **+14.9%** | Lightning +16.9%, Ice +18.4% | +10.8% | +24.2% |
| Sorcerer | +31.3% | **+11.3%** | Fire +16.0%, Ice +17.3% | +8.1% | +22.9% |

- **Tier 2 matters:** the weapon moon adds **+11–15%** to an even act, about half what Tier 1's whole map adds; the
  draft measured +12–16%. **Extra Stats' share of her damage** goes from 21–25% (Tier 1) to **31–33%**.
- **Full or Split:** Split wins the even act for every class. Full gives its kind about 1.4 times a Split kind's gain,
  so it wins once her Full kind deals more than about 2.5 times her second kind (`0.244 s > 0.170 s + 0.185 q` for the
  Brawler). Auto leans on her lead kind, so the real spread is T2B's to measure; the preset is Split until it says
  otherwise.
- **Where the foes follow:** EP16's tier term on foes' HP and DEF prices the weapon moons (T2B). The core is already in
  the build budget × tier.

### 4.10 Her moon in Tier 2 (T2E15)

Two nodes, the live rule × 1.8: node I opens with the three moons' II (Lv 16), node II with their IV (Lv 36), no jewel.
T2U owns what they hold; the values from the code:

| Node | Reads | Tier 1 | **Tier 2** | Tier 3 |
|---|---|---|---|---|
| I · Tireless | HP | +20 | **+35** | +50 |
| I · Clever | MP | +4 | **+7** | +10 |
| I · Mighty | DEF and M.DEF | +4 each | **+7 each** | +10 each |
| I · Fleet | evasion (4 Speed points) | +2.4% | **+2.4%** | +2.4% |
| I · Gritty | Limit start (4 points) | 1.6, a fight starts at 1 | **the same** | the same |
| II · a Warrior root | DEF | +8 | **+14** | +21 |
| II · a Mage root | M.DEF | +8 | **+14** | +21 |
| II · an All-Rounder root | DEF / M.DEF | +4 / +4 | **+7 / +7** | +10 / +11 |

On the chart she keeps her place at the top right (304, 62) in every tier.

## 5. Tier 3 in full

### 5.1 The map: 32 nodes

| Body | Nodes | Jewels a node | I | II | III | IV | V | Lv 50 (Tier 3) |
|---|---|---|---|---|---|---|---|---|
| **Planet** | 5 | **1 Planet Jewel** | +3 | +5 | +10 | +16 | +21 | **+55** to each of six (HP +275) |
| **Weapon moon 1**, Full | 5 | 1 Planet Jewel | +10 | +18 | +26 | +34 | +42 | **+130** on one kind |
| **Weapon moon 2**, Full or Split | 5 | 1 Planet Jewel | Split +7 | +13 | +18 | +24 | +29 | **+91** on each of two (or a second Full +130) |
| **Prowess** | 5 | 1 Moon Jewel | +5 | +10 | +16 | +21 | +26 | **+78**, her split |
| **Vigor** | 5 | 1 Moon Jewel | HP +25, MP +5 | HP +50, MP +10 | HP +80, MP +16 | HP +105, MP +21 | HP +130, MP +26 | **HP +390, MP +78** |
| **Guard** | 5 | 1 Moon Jewel | +5 | +10 | +16 | +21 | +26 | **DEF, M.DEF +78** |
| **★ Her moon** | 2 | none | +10 knack | +21 root | | | | §4.10 |

### 5.2 Ranks

Every odd rank sets **one Planet Jewel on each of the Planet, weapon moon 1 and weapon moon 2**; every even rank one
Moon Jewel on each moon. Thirty jewels, the same ten, 150 refined: the Lapidary's work is Tier 1's.

### 5.3 The second weapon moon (EP26 kept; T2E5)

| Her two weapon moons | Kinds served | Lv 50 (Tier 3) | Her act (model) |
|---|---|---|---|
| **Full + Split** (the preset) | **All three of her weapons** | +130 on one, +91 on each of the other two | **+19.3–24.7%** |
| Full + Full | Two | +130 on each | +16.1–21.9% |
| Split + Split | — | Not offered: she slots three kinds, so a fourth would never hit | — |

- **Every kind different. Weapon moon 1 is always the Full one;** the list is one tap for both moons, six rows for her
  three weapons: three Full + Split (each Full kind, the Split on the other two) and three Full + Full.
- Full + Split beats Full + Full for every class in the model: Brawler 20.5% against 17.2%, Arms Spellblade 23.1% · 21.9%,
  Arms Summoner 23.3% · 20.8%, Paladin 24.7% · 21.0%, Cleric 24.0% · 21.0%, Tome Summoner 22.7% · 20.4%, Tome
  Spellblade 22.4% · 21.4%, Sorcerer 19.3% · 16.1%.
- **Extra Stats' share of her damage** reaches **35–38%** (the draft: 34–38%).

### 5.4 On the chart

Both weapon moons ride one outer orbit of radius 220, at 90° ± 22°; the chart is **360 × 500**.

| Piece | Weapon moon 1 (steel) | Weapon moon 2 (lavender `#b3a6ff`) |
|---|---|---|
| **Crest** | (97.6, 412) | (262.4, 412) |
| **Stars I–V** | (97.6, 364), (139.2, 388), (139.2, 436), (97.6, 460), (56, 436) | (262.4, 364), (304, 388), (304, 436), (262.4, 460), (220.8, 436) |
| **Label** | From the left edge at (8, 490) | To the right edge at (352, 490) |

A Split label and a Full one fit side by side at the longest (8–201 and 248–352); two Splits never meet. The closest
pair across bodies is weapon moon 2's I and Guard IV, 49.6 units (47.3 pt at 375 wide). The page grows +150 units: about 1.32–1.36
screens at 390 × 844, under 1.4.

### 5.5 What it grants at Lv 50

| Class | ATK | M.ATK | Every class: HP · MP · DEF · M.DEF | Weapon moons (preset) |
|---|---|---|---|---|
| Brawler | +133 | +55 | **+665 · +133 · +133 · +133** | Greatsword +130; Axe, Lance +91 |
| Arms Spellblade | +110 | +78 | | Katana +130; Axe, Lightning +91 |
| Arms Summoner | +110 | +78 | | Bow +130; Axe, Dark +91 |
| Paladin | +118 | +70 | | Lance +130; Greatsword, Light +91 |
| Cleric | +70 | +118 | | Light +130; Fire, Lance +91 |
| Tome Summoner | +78 | +110 | | Dark +130; Ice, Bow +91 |
| Tome Spellblade | +78 | +110 | | Lightning +130; Ice, Katana +91 |
| Sorcerer | +55 | +133 | | Fire +130; Ice, Lightning +91 |

Her offense at Tier 3's Lv 50, then with her preset moons:

| Class | Weapon 1 (Full) | Weapon 2 (Split) | Weapon 3 (Split) |
|---|---|---|---|
| Brawler | Greatsword 774 → **904** | Axe 722 → **813** | Lance 722 → **813** |
| Arms Spellblade | Katana 751 → **881** | Axe 699 → **790** | Lightning 510 → **601** |
| Arms Summoner | Bow 751 → **881** | Axe 699 → **790** | Dark 510 → **601** |
| Paladin | Lance 732 → **862** | Greatsword 680 → **771** | Light 461 → **552** |
| Cleric | Light 732 → **862** | Fire 680 → **771** | Lance 461 → **552** |
| Tome Summoner | Dark 751 → **881** | Ice 699 → **790** | Bow 510 → **601** |
| Tome Spellblade | Lightning 751 → **881** | Ice 699 → **790** | Katana 510 → **601** |
| Sorcerer | Fire 787 → **917** | Ice 735 → **826** | Lightning 735 → **826** |

Her moon in Tier 3 is §4.10's last column. Tier 3 gets a Rift ([progression](progression.md) T2W4), so her window there is 36 steps; the Stars track
counts 6 · 13 · 19 · 26 · 32.

## 6. Provides and assumes

| Doc | T2E provides | T2E assumes |
|---|---|---|
| **T2C** classes | Prowess's split for the eight classes in every tier (§2.1); a class branch keeps its class's split (T2E20); the weapon moons read each hit's own kind, so branches and focus need nothing from the map | Eight Tier 1 classes, three weapon slots, ten kinds; a class switch is free; hands as live. If a branch changes a class's Arms-to-Tome make-up, T2C names its split |
| **T2G** gear | The weapon moons stack in step 1 beside Might and Orbs; **no kind cap** (T2E6); the Standard preset sets the moons with the accessories (T2E7); Details shows the moon on each weapon's row | The Orb family stays in Tiers 2 and 3 at +2 a grade × tier on one of her weapons' kinds; three slots; Might ×1.8 and ×2.6. If T2G adds a cap for later forms, the moons stay outside it |
| **T2P** professions | **The Lapidary's demand an Uma is the same in every tier:** 3 of each of the ten jewels, 30 jewels, 150 refined Stone, 50.2 h at each Stone place (T2E2); every line stays equal | A jewel is 5 refined Stone items of its grade in every world (FL9, D264), made from Craft Lv 5g − 4; if Tier 2 brings new Stone items, the jewel at each grade takes the tier's item, the count unchanged |
| **T2B** balance | The model's numbers (§4.9, §5.3): Tier 2 +11–15% an even act, Tier 3 +19–25%, the share 21–25% → 31–33% → 35–38%; the break-even for Full (about 2.5×); the stack's bound (30% of a kind's offense) | T2B's simulation re-measures Full against Split and the presets on Auto, and prices the weapon moons in the tiers' foe term (EP16), the core staying in the build budget |
| **T2U** templates | Her moon's slot: two nodes in every tier, opened with the three moons' II and IV, no jewel, × tier, at the chart's top right (T2E15) | What node I and II hold (her knack, her calling's root) and whether Fleet and Gritty stay flat |
| **T2W** progression | Ascend: an empty map, the moons at the new tier's preset; **the Stars track by tier:** 4 · 9 · 13 · 18 · 22, 5 · 11 · 16 · 22 · 27, 6 · 13 · 19 · 26 · 32, the step ids unchanged (T2E14) | One Uma, one tier; Ascend as built (D283); a later world has every Tier 1 class from Class Rank 1 |

## 7. Save and engine

| Part | What would change, roughly |
|---|---|
| **Save** (a version after v38) | `OwnedUma.stars.moons`, reserved empty since v28, holds `{ mode: 'full' \| 'split', kinds }`: none in Tier 1, one in Tier 2, two in Tier 3; strict: kinds of her weapons' set, a Full one kind, a Split two, every kind different, at most one Split, weapon moon 1 Full. Node ids `weapon-moon-1:1`–`5` (Tiers 2–3) and `weapon-moon-2:1`–`5` (Tier 3), refused elsewhere |
| **Its migration** | In every Tier 2 or 3 world, each Uma's moons take her class's preset, and **weapon moon n opens wherever Planet n is open**: the Planet's third jewel paid for it (Tier 2: 2 + 1; Tier 3: 1 + 1 + 1). No jewel is minted or lost; the stock is unchanged |
| **Domain** | `planet.ts`: the bodies by tier; `nodeJewelCount(id, tier)` (the Planet 3 · 2 · 1, everything else 1); a weapon moon's grade is the Planet's; its points by mode. `jewelBlock`, `jewelNodes`, Set all, targets and the dot read the tier's map with no new rule. `onCurveStars` stays the core |
| **The fight** | **No engine bump.** The moons' points join `flat` by kind beside the Orbs', frozen in the input (D264 call 13, D266 call 11); `flat` allows 0–1,000 a kind, and Tier 3's most is 286 |
| **Web** | `star-chart.ts`: a table per tier, Tier 1's untouched, `CHART_H` 350 · 470 · 500, the test per tier; the crescent body and its crest button; the weapon moons' totals line; `NodeSheet` gains the Kinds row and its one-tap list; Details reads the moon on each weapon's row |
| **Art** | One 24 px crest (the crescent blade) in uma-art's UI atlas: ChatGPT's art packet and release; the consumer packet pins it. A vector stand-in first |
| **Windows** | `rpg/windows.ts` reads the tier's map for the Stars track; the record (36 day codes) is unchanged |

## 8. Pacing

| Lv (in the tier) | 1 | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 |
|---|---|---|---|---|---|---|---|---|---|---|
| Opens | Planet I, **weapon moons I** | Moons I | Planet II, **weapon moons II** | Moons II, her moon I | Planet III, **III** | Moons III | Planet IV, **IV** | Moons IV, her moon II | Planet V, **V** | Moons V |
| **Tier 2**, a stat with its moon | +2 | +6 | +10 | +17 | +24 | +35 | +46 | +60 | +74 | **+92** |
| Tier 2 weapon moon, Full · Split | +7 · +5 | +7 · +5 | +20 · +14 | +20 · +14 | +38 · +27 | +38 · +27 | +61 · +43 | +61 · +43 | **+90 · +63** | +90 · +63 |
| **Tier 3**, a stat with its moon | +3 | +8 | +13 | +23 | +33 | +49 | +65 | +86 | +107 | **+133** |
| Tier 3 weapon moon, Full · Split | +10 · +7 | +10 · +7 | +28 · +20 | +28 · +20 | +54 · +38 | +54 · +38 | +88 · +62 | +88 · +62 | **+130 · +91** | +130 · +91 |

- **Something opens every five levels** in every tier, the weapon moons with the Planet; a new Tier 2 Uma's first rank
  (three Planet Jewels I) already lights her weapon moon at Lv 1. The weapon moons finish at Lv 41, five levels before
  the moons.
- **The farm doesn't slow:** an Uma's map takes 30 jewels and 150 refined Stone in every tier, about 40 h at each Stone
  place at Craft Lv 25 (50.2 h by the ledger's manual times), the same as every other place. A new world's crafters
  start at Craft Lv 1 (Ascend); that pace is T2P's.
- **Her window:** the Stars track asks 5 more nodes in Tier 2 and 10 more in Tier 3; its steps still land at ranks 2,
  4, 6, 8 and 10 (Lv 6, 16, 26, 36, 46), as in Tier 1.
- **The foes** follow through T2B's term; the core's share holds by SB1 (§4.9: the core +26–34% of an act at every tier).

## 9. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **T2E1** The tiers' maps | **Tier 1's 22 nodes in every tier at × 1.8 and × 2.6 (live); Tier 2 adds one weapon moon (27), Tier 3 a second (32).** Nothing else is added to the core | A larger core in later tiers; a third weapon moon in Tier 3 | EP12, EP13, EP26 kept; the owner's "matter as much as Tier 1's map" is met by the moons (§4.9) |
| **T2E2** Jewels a rank | **Three in every tier. The weapon moons sit on the Planet's ranks (Lv 1, 11, 21, 31, 41) and take one Planet Jewel each; the Planet takes 3 · 2 · 1 by tier.** The Lapidary's demand an Uma is unchanged: 30 jewels, 150 refined, 50.2 h a Stone place | The draft's Moon Jewels (four on even ranks: Stone 22.6% and 25% of an Uma, no whole recipe restores it); no jewel, as her moon (a big body opening by itself) | D264's every line equal holds in every tier; no new item, recipe, icon or picker row |
| **T2E3** A weapon moon's size | **Full +4, +7, +10, +13, +16 × tier (Tier 2 +90, Tier 3 +130); Split 0.7 a node, rounded (+63, +91 each)** | +30 × tier (a moon's: under three Orbs); +60 × tier | EP24, EP25 kept; +11–15% and +19–25% an act, near the draft's 12–16% and 21–23% |
| **T2E4** Its kinds | **One of her three weapons' kinds, set like an Orb's (D264); a dropped kind is stale, gives nothing and says so; no group moon** | Any of the ten (a kind she can't hit); a weapon group (+90 on several kinds) | One rule with the Orb; EP10's no-group kept |
| **T2E5** The kinds list | **One tap, D266's pattern: six rows a tier. Tier 2: Full on each weapon, Split on each pair. Tier 3: three Full + Split, three Full + Full, setting both moons; weapon moon 1 is the Full one; Split + Split not offered** | Mode and kinds as two pickers; a Set button | The owner's "really wonky" three-slot screen was fixed by one tap; six rows hold every legal setting |
| **T2E6** The kind cap | **None: the moons stack with Might and the Orbs. The most on one kind is three Orbs and a Full moon, (60 + 50) × tier, 30% of her offense on it** | EP27's cap for accessories with the moons outside it; one cap (68 + 50) × tier on everything | No cap is built and three linear slots already bound the Orbs; a cap would only add a rule. T2G may cap later forms; the moons never count |
| **T2E7** Presets | **Tier 2: Split on her Orb's kind (`presetKind`) and her other weapon of the same half. Tier 3: Full on that kind, Split on her other two.** Set by the Standard preset and on Ascend | Full on her Orb's kind in Tier 2; Split on the two kinds the Orb leaves | Best in the model for every class (§4.5, §4.9); EP29's rule on today's presets |
| **T2E8** Into the fight | **The moons' points join `flat` by kind with the Orbs', frozen in the fight's input; no engine bump; never a heal, never a kind** | A field of their own (an engine stage for nothing the fight needs) | D264 and D266 shipped the slots the same way |
| **T2E9** Where they sit | **On an outer orbit below the core; Tier 1's 22 stars never move. Tier 2: one at (180, 380) on radius 172, chart 360 × 470. Tier 3: two at 90° ± 22° on radius 220, 360 × 500.** The live test's checks per tier | PP31's top-left corner (one body, no room for a Split's label, none for Tier 3's second); the orbit's own gaps (cramped labels, a moved Tier 1) | Passes every check of `star-chart.test.ts` with room for every label; the page stays under 1.4 screens |
| **T2E10** Figure, colour, crest | **A crescent: five stars on 240° of a circle of 48 round its crest, clockwise from I. Steel `#c8d3e0` (weapon moon 1), lavender `#b3a6ff` (weapon moon 2). One crescent-blade crest, ChatGPT's art; a vector stand-in first** | The kind's gear icon as the crest; one colour for both | A figure says what a body does (PP18); a colour a body (PP23); art is ChatGPT's |
| **T2E11** Its label | **Its kinds and count: "Greatsword 3/5", "Greatsword · Axe 3/5"; Tier 2 centred under it, Tier 3 from the left and right edges** | "Weapon moon 3/5" with the kinds only in the sheet | The chart says which kinds without a tap; the longest pair fits |
| **T2E12** The Stars tab | **"Open n/27" · "/32"; a weapon moons' line in steel under her moon's; its sheet with the strip, its kinds' values, before → after on each kind, "Planet Jewel III ×1", the Kinds row; the Planet's sheet "×2" · "×1"** | A separate weapon-moons tab | One tab, one sheet kind, as D269 and D278 built |
| **T2E13** Set all | **Its live rule, unchanged: the body furthest behind among those a jewel fits, map order on a tie (the Planet, the weapon moons, then Prowess, Vigor, Guard)** | Weapon moons first (a jewel can sit idle waiting for the Planet's pair) | No new rule; it sets every jewel that fits |
| **T2E14** The window's Stars track | **Reads the tier's map: Tier 2 5 · 11 · 16 · 22 · 27, Tier 3 6 · 13 · 19 · 26 · 32; the steps and the record unchanged** | Tier 1's counts in every tier (the weapon moons skipped) | "The whole map" means the whole map; no save change |
| **T2E15** Her moon | **Two nodes in every tier, opened with the three moons' II and IV, no jewel, × tier (Fleet and Gritty flat); top right on the chart.** T2U owns what they hold | A growing moon by tier | EP14 kept as D264 and CV21 left it |
| **T2E16** The save | **A version after v38 fills `stars.moons` (one, two); weapon-moon ids by tier; the migration sets her preset and opens weapon moon n wherever Planet n is open** | Close every weapon moon and refund a Planet Jewel a node | The third jewel was spent: the migration gives back exactly what it paid for |
| **T2E17** The numbers for T2B | **This doc's model (§4.9, §5.3) is T2B's input; its simulation replaces it and prices the moons in the tiers' foe term (EP16)** | Fix the values here | One owner for balance |
| **T2E18** Targets and the dot | **Targets plan the tier's nodes at their counts (the Planet 3 · 2 · 1); the dot is a jewel she can set now, as built** | — | EP20 kept |
| **T2E19** The corner | **The top-left corner stays free in every tier**, for a later body | Fill it with the weapon moon | A seam for the owner's coming requirements (below) |
| **T2E20** Prowess for later classes | **A class branch splits Prowess as its class does; a branch that changes the class's Arms-to-Tome make-up takes its own split, named by T2C** | Split by slots (a third a slot, as a Tier 0) | Every Tier 1 split is the owner's number, not a slot count (70/30, 80/20) |

### Where the owner's coming requirements would most likely land

| Seam | What it would move | Held by |
|---|---|---|
| **The weapon moons' size and the Split's 0.7** | How much Tiers 2 and 3 feel; one number each | T2E3, T2B's sim |
| **Three jewels a rank** | A deeper later-tier map costs more Lapidary only if every line grows with it (D264) | T2E2, T2P |
| **The free corner and the outer orbit** | Room for a new body: a class-branch moon, a capital's or a window's reward, a defensive counterpart to the weapon moons | T2E9, T2E19 |
| **Her moon's depth** | "More uniqueness" lands on her moon or the signature, two nodes today | T2E15, T2U |
| **Offense only** | Tiers 2 and 3 add no defense to the map; a defensive later body would need the foe budget's offense to follow | T2E1, T2B |
| **A fourth weapon slot** | Three kinds make Full + Split cover all three; a fourth would ask for a third moon or Split + Split | T2E5, T2C, T2G |
