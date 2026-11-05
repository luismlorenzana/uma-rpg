# The world map

Where the fights are: a tier's world of five continents, each a honeycomb of 48 biome regions and a capital, each region a
climb of five levels in twelve stages (D66, D71, D72, D91, D97). Everything is generated from fixed seeds, so ids and
contents never move under a save. Lists here are generated from `packages/domain/src/world/` (`world.ts`, `biomes.ts`,
`capital.ts`, `roster.ts`); a stage's foes come from `rpg/campaign/enemies.ts` and their weaknesses from
`rpg/campaign/weaknesses.ts`.

The screens are in [sections](sections.md#scenario-gate), the fights in [combat](combat.md). The Rift's fights are
generated apart and aren't on the map ([combat](combat.md#the-rifts-foes)).

The World and Region screens use pixel maps; a continent uses an SVG honeycomb (D295, H166). **Map / List** in the
sticky header remembers this device's choice. The continent opens fitted, keeping the frontier in view; pinch or
**− ⊙ +** zooms from fit to 3× and drag pans without moving the page. Regions open at the lowest uncleared stage.
Stages are compact 2×2-tile buildings: square chess towers, an elite tower and a boss castle. The route snakes across
three columns: 1–2–3, then 6–5–4, 7–8–9, and 12–11–10 at the top. Each stage rises slightly within its row.
Cleared buildings turn completely gray; colored buildings remain to clear, with a ring around the next stage.
Tapping still opens the same rival sheet. The larger 4×4 structures remain in the art package for other uses.
Springs refill MP, and the capital opens its runs. A region shows its nearest honeycomb Spring at
the start of its road and as **Spring · MP** in the header. It shares that Spring's two-hour recharge, not a new charge.

## Shape

| From the centre | Hexes | Contents |
|---|---|---|
| Centre | 1 | Capital |
| Ring 1 | 6 | Run seats: newest wins, then open runs |
| Ring 2 | 12 | Rows 10, 9 and 8: the last five levels; row 10 has twin bosses |
| Ring 3 | 18 | Six Springs at the corners, rows 7 and 6 and four new higher-level regions |
| Ring 4, the shore | 24 | Rows 1–5 and four new lower-level regions |

Every hex has a biome colour/glyph, name and levels. An untouched region is muted; a claimed region has its progress
arc and the first winning five, small. A boss clear gives a gold rim, ✓ and the first clearing five, larger in gold
rings. Old progress has no invented faces. Fitted teams are coloured dots; from 1.6× they use album faces. A region's
quick look shows its claim/clear dates and teams, the next stage and **Enter**. Springs show Ready or their recharge;
their quick look lists the eight regions served and **Refill**. Equal-distance regions use the next Spring clockwise.
Capital seats keep every open run, dropping the oldest shown wins when needed; the capital quick look keeps all six
recent wins and every open run, with their signed faces and **Open capital**.

<!-- live:world -->
| Setting | Value |
|---|---|
| Continents | 5 per tier, one per scenario, 10 levels each |
| Regions | 48 per continent on a honeycomb, each climbing 5 levels: 24 in its first five on the shore, 24 in its last five inside. Every biome at least twice; the first is a Meadow |
| Stages | 12 per region: 10 regular climbing its levels two at a time, then an elite (11) and the boss (12) at its top level |
| Springs | 6 per continent, each nearest to eight regions; recharge 2 h |
| Capitals | 6 run seats; runs of 4 full parties: 3 generals a lane, then 4 finals; 16 fights at the continent's top level |
| Waves pay | ×1.5 |
<!-- /live -->

- **A region is a climb (D97).** Its ten regular stages rise two at a time through its five levels, about three fights
  a level, and its elite and boss wait at the top. A party that walks in at the first level meets them at the last
  (Lv 5, Lv 10 …) and leaves a little short of the next region's first level; a replay tops it up.
- **Two regions a party.** Twenty-four regions climb the continent's first five levels and twenty-four its last five,
  so each of the 24 parties can take its own pair. The original forty region/stage ids stay; the eight additions have
  ids `w1-x-1` … `w1-x-8` (and the corresponding continent prefix).
- **Everything is open from the start.** Inside a region, stages open in order; any cleared stage can be replayed for a
  quarter of its first-clear rewards, or swept with a Sweep Ticket (regular stages only).
- **Progress belongs to the world**, not to a party: one world-wide record of wins per stage, MP per Uma, and one open
  fight at a time.
- **Six Springs** each serve their nearest eight regions, refill the active party's MP and recharge for two hours.
- Each continent's **capital** (Lv 10 of its band) holds runs of four full parties ([below](#capitals)).

## Biomes

Nineteen biomes. Each sets the **element signatures** its foes carry, its **formation** lean and its foe **roles**.

<!-- live:biomes -->
| Biome | Id | Signatures (ring lead) | Formations | Roles |
|---|---|---|---|---|
| Meadow | `meadow` | fire (Lightning); ice (Fire); lightning (Ice) | squad, duo, trio | striker, caster, skirmisher, guard |
| Forest | `forest` | lightning (Ice); light (Dark); dark (Light) | squad, trio, swarm | skirmisher, striker |
| Coast | `coast` | ice+lightning (Fire); ice (Fire); lightning (Ice) | trio, squad | caster, skirmisher |
| Swamp | `swamp` | lightning+dark (Ice / Light); dark (Light) | squad, trio | caster, skirmisher |
| Jungle | `jungle` | fire+lightning (Ice); lightning (Ice) | swarm, squad | skirmisher, striker |
| Desert | `desert` | fire+light (Lightning / Dark); fire (Lightning); light (Dark) | trio, duo | guard, striker |
| Canyon | `canyon` | fire (Lightning); lightning (Ice); fire+lightning (Ice) | duo, solo, trio | striker |
| Volcano | `volcano` | fire+dark (Lightning / Light); fire+light (Lightning / Dark); fire (Lightning) | solo, duo | striker, caster |
| Geyser Basin | `geyser` | fire+ice (Lightning); ice (Fire); fire (Lightning) | trio, squad | caster |
| Tundra | `tundra` | ice (Fire); ice+dark (Fire / Light) | squad, trio | guard, striker |
| Glacier | `glacier` | ice+light (Fire / Dark); ice (Fire) | solo, duo | guard |
| Storm Peaks | `peaks` | ice+lightning (Fire); lightning (Ice) | trio, squad | skirmisher |
| Highlands | `highlands` | lightning+light (Ice / Dark); light (Dark) | duo, trio | caster |
| Sky Isles | `sky` | fire+light (Lightning / Dark); ice+light (Fire / Dark); lightning+light (Ice / Dark) | trio, duo | caster |
| Underworld | `underworld` | fire+dark (Lightning / Light); ice+dark (Fire / Light); lightning+dark (Ice / Light) | swarm, squad | striker, caster, skirmisher |
| Haunted Moor | `moor` | dark (Light); ice+dark (Fire / Light) | swarm, squad | skirmisher, caster |
| Crystal Caverns | `crystal` | ice+light (Fire / Dark); light (Dark) | squad, trio | guard, caster |
| Ancient Ruins | `ruins` | light+dark (Fire / Ice / Lightning dealt); fire (Lightning); ice (Fire); lightning (Ice) | escort, trio | guard |
| Twilight Rift | `rift` | light+dark (Fire / Ice / Lightning dealt) | solo | striker, caster |

The ring lead is only the first element answer. Engine v18 deals the rest of each foe's Arms and elements from the stage decks, so neighbours differ.
<!-- /live -->

### Element signatures

A signature is one element, or a pair that each foe carries both of. It sets her own elements, the ones her moves
carry, and through them the first element of her weakness list: the ring's answer, on **Fire > Ice > Lightning > Fire**
and **Light ⇄ Dark** (a Volcano's foes are weak to Lightning first). The stage deals the rest of her elements and her
Arms ([below](#a-stages-foes)), so neighbouring foes differ while the stage stays fixed. A pair leads with each of its
answers that isn't one of its own. A **light+dark** foe has no ring answer outside her pair, so her elements are dealt
from Fire, Ice and Lightning.

## A stage's foes

How a region's stage makes its foes (`stageWaves` in `world/world.ts`):

- **Count and HP:** a stage's formation sets how many foes stand and the HP they share, in regular foes' HP
  ([formations](#formations-and-waves)); a stage in waves gives each wave a share of it.
- **Rank:** every foe of a regular stage is regular rank. The elite (stage 11) is a sub-boss with two Key enemy guards;
  the boss (stage 12) is two opening waves of regular-rank foes, then a boss (two on a continent's top row) with
  sub-boss-faced guards.
- **Role:** each formation foe's is drawn by the stage's seed from her biome's roles; an escort's leader is a striker,
  and her guards, the elite's Keys and the boss's guards are guards. The elite's sub-boss is a captain, the boss a
  champion ([combat](combat.md#foes)).
- **Elements:** from the stage's signature. A pair signature gives every foe both, the lead alternating slot by slot
  across the stage (Fire + Dark, then Dark + Fire, …), and her second element carries her second elemental move.
- **Weaknesses** (engine v18, weaknesses v2, D235–D237): one dealer a stage hands out each foe's list in slot order
  across its waves, from an Arms deck and an element deck shuffled by the stage's id. In Tier 1 a regular-rank foe (Keys
  and guards too) is weak to 2 Arms + 2 elements, a sub-boss or a boss to 3 (2 + 1 or 1 + 2 by seed); in Tiers 2 and 3
  every rank to 3, a regular by her role. Her elements lead with the ring's answer to her own; a foe never holds the
  previous foe's Arms again while another card fits, so neighbours differ. The full rule is in
  [combat](combat.md#weaknesses-shields-and-breaks).
- **Shields:** by formation ([below](#formations-and-waves)); an elite's Key guards and a boss's guards 2, the sub-boss
  6 and the boss 8.
- **Acting twice:** a lone elite (`solo`) always; the elite's sub-boss and a lone boss from tier Lv 10 (D141).
- **Strength:** each foe is `rpgFoe`'s for her role, rank and level ([combat](combat.md#foes)), × her share of the
  formation's HP and the wave's; a regular foe gains 3.5% HP a tier level, and a region boss has half a champion's HP. A
  formation foe's offense is the square root of her HP share against a pair's foe, at most a full foe's.
- **Faces:** below.

### Faces

Foes wear the faces of three private franchise packs (D135): PriConne, Azur Lane and NIKKE. The owner sorted every unit
into a tier: Regular, Key enemy, Sub-boss or Boss. A region's franchise goes by level, not biome (`bandFranchise`),
roughly in proportion to the packs' rosters: PriConne holds the first continent and Azur Lane the fifth, and on the
second to the fourth Azur Lane takes the first five levels and NIKKE the last five. A capital's Finals take PriConne on
the first continent, then Azur Lane on the even ones and NIKKE on the odd.

<!-- live:faces -->
| Continent | Rows 1–5 | Rows 6–10 | Capital |
|---|---|---|---|
| w1 | PriConne (Lv 1–5) | PriConne (Lv 6–10) | PriConne |
| w2 | Azur Lane (Lv 11–15) | NIKKE (Lv 16–20) | Azur Lane |
| w3 | Azur Lane (Lv 21–25) | NIKKE (Lv 26–30) | NIKKE |
| w4 | Azur Lane (Lv 31–35) | NIKKE (Lv 36–40) | Azur Lane |
| w5 | Azur Lane (Lv 41–45) | Azur Lane (Lv 46–50) | NIKKE |

| Franchise | Regions |
|---|---|
| PriConne | 48 |
| Azur Lane | 120 |
| NIKKE | 72 |
<!-- /live -->

Within a region, faces go by tier:

| Stage | Faces |
|---|---|
| Regular stages (1–10) | Regular units |
| Elite (11) | A Sub-boss with two Key enemy assistants |
| Boss (12) | Sub-bosses in the two opening waves, then a Boss with two Sub-boss guards. On a continent's top row (row 10), two Bosses and one Sub-boss guard |
| Capital runs | General: a Sub-boss with Key minions. Final: three Keys, then a Boss with Sub-boss minions |

- **Picking:** a stage picks each face by hash from its franchise's units of that tier, sorted by id, and never repeats a
  face within the stage.
- **Empty tiers:** a tier with no units borrows the same tier from another franchise, then any tier of its own.
- **Storage:** the units live only in the gitignored `content/` and the private bucket
  ([architecture](architecture.md#private-content)).

Every unit has three images:
- a square **face** for the round icons on the region screens;
- a 2:3 **vertical**, which is what the battle stage shows;
- for Key enemies, Sub-bosses and Bosses, a 16:9 **splash**. It cuts in during a fight ([combat](combat.md#splash-cut-ins)).

## Formations and waves

<!-- live:formations -->
| Template | Foes | HP shared (regular foes) | Shield each | Notes |
|---|---|---|---|---|
| Lone elite (`solo`) | 1 | 3.5 | 6 | Acts twice a round |
| Pair (`duo`) | 2 | 3.6 | 4 | — |
| Trio (`trio`) | 3 | 3.6 | 3 | — |
| Squad (`squad`) | 4–5 | 4 | 2 | — |
| Swarm (`swarm`) | 6–8 | 3.6 | 1 | Two rows on the stage |
| Escort (`escort`) | 3–5 | captain 2.5, guards 0.8 each | captain 5, guards 2 | — |

| Stage | Waves | HP per wave |
|---|---|---|
| Stage 8 | 2 | ×0.75 |
| Stage 9 | 2 | ×0.75 |
| Boss (stage 12) | 3 | ×0.3, ×0.3, then the champion's wave in full |
<!-- /live -->

A region's twelve stages (`stagePlan`):
- **Levels:** stages 1–10 climb two at a time (1, 1, 2, 2 … 5, 5 in a Lv 1–5 region); the elite and the boss are at its
  top level.
- **1–2:** teaching pairs, on the biome's first and second signatures.
- **3–10:** the biome's formation × signature combinations in a seeded order, a formation never twice in a row while
  another is left. Stage 7 is a crowd (a swarm, or a squad where the biome has none), 8–9 come in two waves (the second
  in another of the biome's formations, on its next signature), and 10 is the biome's own formation on its first
  signature.
- **11:** the elite, on the biome's last signature: a captain with two Key enemy guards (0.8 of a regular foe's HP,
  shield 2 each). She acts once a round below tier Lv 10 and twice from tier Lv 10 (D135, D141, D170), and carries a
  charged move ([combat](combat.md#charged-moves)).
- **12:** the boss, on the biome's first signature: two opening waves at 0.3 of a stage's HP each (the biome's own
  formation, then a trio, each on a later signature), then a champion and her two guards (0.8 of a regular foe's HP,
  shield 2); from tier Lv 10 a lone champion acts twice (D141). On a continent's top row (row 10) it's two champions,
  each with 55% of one champion's HP, acting once, and one guard (D135).

A stage in waves pays 1.5× EXP and Laurels.

### Example region

<!-- live:region-sample -->
Volcano `w1-4-2`, Lv 1–5:

| Stage | Level | Kind | Name | Signature | Foes per wave | Notes |
|---|---|---|---|---|---|---|
| 1 | 1 | fight | Pair | fire + dark | 2 | dual element |
| 2 | 1 | fight | Pair | fire + light | 2 | dual element |
| 3 | 2 | fight | Lone elite | fire | 1 | acts twice |
| 4 | 2 | fight | Pair | fire + light | 2 | dual element |
| 5 | 3 | fight | Lone elite | fire + dark | 1 | acts twice, dual element |
| 6 | 3 | fight | Pair | fire | 2 | — |
| 7 | 4 | fight | Squad | fire + dark | 5 | dual element |
| 8 | 4 | fight | Pair | fire + dark | 2 + 1 | dual element, acts twice |
| 9 | 5 | fight | Lone elite | fire + light | 1 + 2 | acts twice, dual element |
| 10 | 5 | fight | Lone elite | fire + dark | 1 | acts twice, dual element |
| 11 | 5 | sub-boss | Elite | fire | 3 | sub-boss |
| 12 | 5 | boss | Volcano boss | fire + dark | 1 + 3 + 3 | acts twice, dual element, boss |
<!-- /live -->

## Capitals

Each continent's capital (`world/capital.ts`, `save/capital.ts`; save v37, H162) holds **runs** at the continent's top
level: Lv 10, 20, 30, 40 or 50 of its tier. Start one by assigning four full Party Hall parties to four lanes, twenty
different Umas. There is no level gate. The run keeps those five per lane even if the Party Hall changes; their builds
can change between fights. An Uma can join only one open run, and cannot ascend until it ends. Up to six runs can be
open across the world's capitals.

- **Generals:** each lane walks three in order, with its own party. A general is a Sub-boss (shield 6) with two regular
  escorts (shield 3), wearing Key faces. Generals I and III lead with the lane's first element, II with its second.
- **The Final:** all twelve generals must fall first. Four final bosses then open, one per lane, fought by that lane's
  party in any order. Each has two waves: three Key-faced regulars, then a Boss (shield 8) with two Sub-boss-faced
  regular escorts (shield 3). All four finals won ends the run and lights **World n** for all twenty.
- **Foes:** four authored lanes a scenario, each with its line, two elements and escort roles. They use the chapter
  generator's tuning and weaknesses v2, without a region's regular-foe HP step or a region boss's half. Mechanics are
  fixed for a capital and lane; faces come fresh from its franchise each run, fixed for its run id.
- **Fights:** HP and MP start full; the world's carried MP stays unchanged. One healer at most per party, free retries,
  and no Sweeps. A run fight occupies the world's existing open-fight slot. A loss advances and pays nothing.
- **Pay:** generals pay half a sub-boss's EXP; finals the usual two-wave boss EXP. Her first run pays full until her
  World n step is lit; later runs of that continent pay her a quarter. Class EXP is twice her Uma EXP; Laurels, Marks,
  Bonds and Tier 1 Shards use the usual payment rules. Three generals and a final add about 1.3 levels at their level.
- **Abandon:** loses run progress and frees the twenty; nothing is refunded or spent. Finish its own open fight first.

The old three-route capital's wins remain inert in the save. An old open capital fight resumes from its frozen input
and settles as a removed regular stage at its foes' level. Existing lit World steps keep their dates.

## Continents

Continents are numbered by release order. In the game each takes its scenario's name from master data; those names
aren't listed here. Each continent leans to one biome, which it holds an extra copy of. The tables retain the original
region ids and list the eight additions after them, with each region's nearest Spring on the honeycomb.

<!-- live:continents -->
### Continent 1 (`w1`), Lv 1–10, leaning forest

| Region | Biome | Levels | Nearest Spring |
|---|---|---|---|
| `w1-1-1` | Meadow | Lv 1–5 | `w1-spring5` |
| `w1-1-2` | Sky Isles | Lv 1–5 | `w1-spring5` |
| `w1-1-3` | Underworld | Lv 1–5 | `w1-spring5` |
| `w1-1-4` | Storm Peaks | Lv 1–5 | `w1-spring4` |
| `w1-2-1` | Highlands | Lv 1–5 | `w1-spring4` |
| `w1-2-2` | Ancient Ruins | Lv 1–5 | `w1-spring4` |
| `w1-2-3` | Twilight Rift | Lv 1–5 | `w1-spring4` |
| `w1-2-4` | Haunted Moor | Lv 1–5 | `w1-spring3` |
| `w1-3-1` | Crystal Caverns | Lv 1–5 | `w1-spring3` |
| `w1-3-2` | Meadow II | Lv 1–5 | `w1-spring3` |
| `w1-3-3` | Forest | Lv 1–5 | `w1-spring2` |
| `w1-3-4` | Forest II | Lv 1–5 | `w1-spring2` |
| `w1-4-1` | Geyser Basin | Lv 1–5 | `w1-spring2` |
| `w1-4-2` | Volcano | Lv 1–5 | `w1-spring1` |
| `w1-4-3` | Crystal Caverns II | Lv 1–5 | `w1-spring1` |
| `w1-4-4` | Canyon | Lv 1–5 | `w1-spring1` |
| `w1-5-1` | Ancient Ruins II | Lv 1–5 | `w1-spring1` |
| `w1-5-2` | Storm Peaks II | Lv 1–5 | `w1-spring6` |
| `w1-5-3` | Desert | Lv 1–5 | `w1-spring6` |
| `w1-5-4` | Twilight Rift II | Lv 1–5 | `w1-spring6` |
| `w1-6-1` | Glacier | Lv 6–10 | `w1-spring5` |
| `w1-6-2` | Jungle | Lv 6–10 | `w1-spring4` |
| `w1-6-3` | Meadow III | Lv 6–10 | `w1-spring4` |
| `w1-6-4` | Tundra | Lv 6–10 | `w1-spring3` |
| `w1-7-1` | Swamp | Lv 6–10 | `w1-spring2` |
| `w1-7-2` | Highlands II | Lv 6–10 | `w1-spring1` |
| `w1-7-3` | Geyser Basin II | Lv 6–10 | `w1-spring1` |
| `w1-7-4` | Coast | Lv 6–10 | `w1-spring6` |
| `w1-8-1` | Sky Isles II | Lv 6–10 | `w1-spring4` |
| `w1-8-2` | Volcano II | Lv 6–10 | `w1-spring4` |
| `w1-8-3` | Forest III | Lv 6–10 | `w1-spring3` |
| `w1-8-4` | Underworld II | Lv 6–10 | `w1-spring3` |
| `w1-9-1` | Canyon II | Lv 6–10 | `w1-spring6` |
| `w1-9-2` | Haunted Moor II | Lv 6–10 | `w1-spring6` |
| `w1-9-3` | Desert II | Lv 6–10 | `w1-spring5` |
| `w1-9-4` | Jungle II | Lv 6–10 | `w1-spring5` |
| `w1-10-1` | Swamp II | Lv 6–10 | `w1-spring2` |
| `w1-10-2` | Coast II | Lv 6–10 | `w1-spring2` |
| `w1-10-3` | Glacier II | Lv 6–10 | `w1-spring1` |
| `w1-10-4` | Tundra II | Lv 6–10 | `w1-spring1` |
| `w1-x-1` | Highlands III | Lv 1–5 | `w1-spring2` |
| `w1-x-2` | Sky Isles III | Lv 1–5 | `w1-spring3` |
| `w1-x-3` | Underworld III | Lv 1–5 | `w1-spring5` |
| `w1-x-4` | Haunted Moor III | Lv 1–5 | `w1-spring6` |
| `w1-x-5` | Crystal Caverns III | Lv 6–10 | `w1-spring5` |
| `w1-x-6` | Ancient Ruins III | Lv 6–10 | `w1-spring6` |
| `w1-x-7` | Twilight Rift III | Lv 6–10 | `w1-spring2` |
| `w1-x-8` | Swamp III | Lv 6–10 | `w1-spring3` |

### Continent 2 (`w2`), Lv 11–20, leaning coast

| Region | Biome | Levels | Nearest Spring |
|---|---|---|---|
| `w2-1-1` | Meadow | Lv 11–15 | `w2-spring5` |
| `w2-1-2` | Coast | Lv 11–15 | `w2-spring5` |
| `w2-1-3` | Swamp | Lv 11–15 | `w2-spring5` |
| `w2-1-4` | Jungle | Lv 11–15 | `w2-spring4` |
| `w2-2-1` | Desert | Lv 11–15 | `w2-spring4` |
| `w2-2-2` | Haunted Moor | Lv 11–15 | `w2-spring4` |
| `w2-2-3` | Canyon | Lv 11–15 | `w2-spring4` |
| `w2-2-4` | Underworld | Lv 11–15 | `w2-spring3` |
| `w2-3-1` | Volcano | Lv 11–15 | `w2-spring3` |
| `w2-3-2` | Sky Isles | Lv 11–15 | `w2-spring3` |
| `w2-3-3` | Geyser Basin | Lv 11–15 | `w2-spring2` |
| `w2-3-4` | Highlands | Lv 11–15 | `w2-spring2` |
| `w2-4-1` | Tundra | Lv 11–15 | `w2-spring2` |
| `w2-4-2` | Meadow II | Lv 11–15 | `w2-spring1` |
| `w2-4-3` | Glacier | Lv 11–15 | `w2-spring1` |
| `w2-4-4` | Twilight Rift | Lv 11–15 | `w2-spring1` |
| `w2-5-1` | Storm Peaks | Lv 11–15 | `w2-spring1` |
| `w2-5-2` | Ancient Ruins | Lv 11–15 | `w2-spring6` |
| `w2-5-3` | Crystal Caverns | Lv 11–15 | `w2-spring6` |
| `w2-5-4` | Coast II | Lv 11–15 | `w2-spring6` |
| `w2-6-1` | Forest | Lv 16–20 | `w2-spring5` |
| `w2-6-2` | Meadow III | Lv 16–20 | `w2-spring4` |
| `w2-6-3` | Highlands II | Lv 16–20 | `w2-spring4` |
| `w2-6-4` | Storm Peaks II | Lv 16–20 | `w2-spring3` |
| `w2-7-1` | Underworld II | Lv 16–20 | `w2-spring2` |
| `w2-7-2` | Sky Isles II | Lv 16–20 | `w2-spring1` |
| `w2-7-3` | Crystal Caverns II | Lv 16–20 | `w2-spring1` |
| `w2-7-4` | Haunted Moor II | Lv 16–20 | `w2-spring6` |
| `w2-8-1` | Twilight Rift II | Lv 16–20 | `w2-spring4` |
| `w2-8-2` | Ancient Ruins II | Lv 16–20 | `w2-spring4` |
| `w2-8-3` | Swamp II | Lv 16–20 | `w2-spring3` |
| `w2-8-4` | Jungle II | Lv 16–20 | `w2-spring3` |
| `w2-9-1` | Forest II | Lv 16–20 | `w2-spring6` |
| `w2-9-2` | Coast III | Lv 16–20 | `w2-spring6` |
| `w2-9-3` | Volcano II | Lv 16–20 | `w2-spring5` |
| `w2-9-4` | Geyser Basin II | Lv 16–20 | `w2-spring5` |
| `w2-10-1` | Desert II | Lv 16–20 | `w2-spring2` |
| `w2-10-2` | Canyon II | Lv 16–20 | `w2-spring2` |
| `w2-10-3` | Tundra II | Lv 16–20 | `w2-spring1` |
| `w2-10-4` | Glacier II | Lv 16–20 | `w2-spring1` |
| `w2-x-1` | Ancient Ruins III | Lv 11–15 | `w2-spring2` |
| `w2-x-2` | Crystal Caverns III | Lv 11–15 | `w2-spring3` |
| `w2-x-3` | Twilight Rift III | Lv 11–15 | `w2-spring5` |
| `w2-x-4` | Sky Isles III | Lv 11–15 | `w2-spring6` |
| `w2-x-5` | Highlands III | Lv 16–20 | `w2-spring5` |
| `w2-x-6` | Haunted Moor III | Lv 16–20 | `w2-spring6` |
| `w2-x-7` | Underworld III | Lv 16–20 | `w2-spring2` |
| `w2-x-8` | Glacier III | Lv 16–20 | `w2-spring3` |

### Continent 3 (`w3`), Lv 21–30, leaning desert

| Region | Biome | Levels | Nearest Spring |
|---|---|---|---|
| `w3-1-1` | Meadow | Lv 21–25 | `w3-spring5` |
| `w3-1-2` | Glacier | Lv 21–25 | `w3-spring5` |
| `w3-1-3` | Tundra | Lv 21–25 | `w3-spring5` |
| `w3-1-4` | Canyon | Lv 21–25 | `w3-spring4` |
| `w3-2-1` | Desert | Lv 21–25 | `w3-spring4` |
| `w3-2-2` | Geyser Basin | Lv 21–25 | `w3-spring4` |
| `w3-2-3` | Volcano | Lv 21–25 | `w3-spring4` |
| `w3-2-4` | Coast | Lv 21–25 | `w3-spring3` |
| `w3-3-1` | Storm Peaks | Lv 21–25 | `w3-spring3` |
| `w3-3-2` | Forest | Lv 21–25 | `w3-spring3` |
| `w3-3-3` | Glacier II | Lv 21–25 | `w3-spring2` |
| `w3-3-4` | Jungle | Lv 21–25 | `w3-spring2` |
| `w3-4-1` | Swamp | Lv 21–25 | `w3-spring2` |
| `w3-4-2` | Volcano II | Lv 21–25 | `w3-spring1` |
| `w3-4-3` | Canyon II | Lv 21–25 | `w3-spring1` |
| `w3-4-4` | Tundra II | Lv 21–25 | `w3-spring1` |
| `w3-5-1` | Geyser Basin II | Lv 21–25 | `w3-spring1` |
| `w3-5-2` | Swamp II | Lv 21–25 | `w3-spring6` |
| `w3-5-3` | Coast II | Lv 21–25 | `w3-spring6` |
| `w3-5-4` | Desert II | Lv 21–25 | `w3-spring6` |
| `w3-6-1` | Jungle II | Lv 26–30 | `w3-spring5` |
| `w3-6-2` | Haunted Moor | Lv 26–30 | `w3-spring4` |
| `w3-6-3` | Crystal Caverns | Lv 26–30 | `w3-spring4` |
| `w3-6-4` | Ancient Ruins | Lv 26–30 | `w3-spring3` |
| `w3-7-1` | Twilight Rift | Lv 26–30 | `w3-spring2` |
| `w3-7-2` | Storm Peaks II | Lv 26–30 | `w3-spring1` |
| `w3-7-3` | Highlands | Lv 26–30 | `w3-spring1` |
| `w3-7-4` | Sky Isles | Lv 26–30 | `w3-spring6` |
| `w3-8-1` | Underworld | Lv 26–30 | `w3-spring4` |
| `w3-8-2` | Desert III | Lv 26–30 | `w3-spring4` |
| `w3-8-3` | Meadow II | Lv 26–30 | `w3-spring3` |
| `w3-8-4` | Forest II | Lv 26–30 | `w3-spring3` |
| `w3-9-1` | Underworld II | Lv 26–30 | `w3-spring6` |
| `w3-9-2` | Haunted Moor II | Lv 26–30 | `w3-spring6` |
| `w3-9-3` | Highlands II | Lv 26–30 | `w3-spring5` |
| `w3-9-4` | Sky Isles II | Lv 26–30 | `w3-spring5` |
| `w3-10-1` | Twilight Rift II | Lv 26–30 | `w3-spring2` |
| `w3-10-2` | Meadow III | Lv 26–30 | `w3-spring2` |
| `w3-10-3` | Crystal Caverns II | Lv 26–30 | `w3-spring1` |
| `w3-10-4` | Ancient Ruins II | Lv 26–30 | `w3-spring1` |
| `w3-x-1` | Twilight Rift III | Lv 21–25 | `w3-spring2` |
| `w3-x-2` | Crystal Caverns III | Lv 21–25 | `w3-spring3` |
| `w3-x-3` | Ancient Ruins III | Lv 21–25 | `w3-spring5` |
| `w3-x-4` | Underworld III | Lv 21–25 | `w3-spring6` |
| `w3-x-5` | Haunted Moor III | Lv 26–30 | `w3-spring5` |
| `w3-x-6` | Highlands III | Lv 26–30 | `w3-spring6` |
| `w3-x-7` | Sky Isles III | Lv 26–30 | `w3-spring2` |
| `w3-x-8` | Storm Peaks III | Lv 26–30 | `w3-spring3` |

### Continent 4 (`w4`), Lv 31–40, leaning tundra

| Region | Biome | Levels | Nearest Spring |
|---|---|---|---|
| `w4-1-1` | Meadow | Lv 31–35 | `w4-spring5` |
| `w4-1-2` | Forest | Lv 31–35 | `w4-spring5` |
| `w4-1-3` | Coast | Lv 31–35 | `w4-spring5` |
| `w4-1-4` | Swamp | Lv 31–35 | `w4-spring4` |
| `w4-2-1` | Jungle | Lv 31–35 | `w4-spring4` |
| `w4-2-2` | Desert | Lv 31–35 | `w4-spring4` |
| `w4-2-3` | Canyon | Lv 31–35 | `w4-spring4` |
| `w4-2-4` | Volcano | Lv 31–35 | `w4-spring3` |
| `w4-3-1` | Geyser Basin | Lv 31–35 | `w4-spring3` |
| `w4-3-2` | Tundra | Lv 31–35 | `w4-spring3` |
| `w4-3-3` | Glacier | Lv 31–35 | `w4-spring2` |
| `w4-3-4` | Underworld | Lv 31–35 | `w4-spring2` |
| `w4-4-1` | Sky Isles | Lv 31–35 | `w4-spring2` |
| `w4-4-2` | Highlands | Lv 31–35 | `w4-spring1` |
| `w4-4-3` | Storm Peaks | Lv 31–35 | `w4-spring1` |
| `w4-4-4` | Geyser Basin II | Lv 31–35 | `w4-spring1` |
| `w4-5-1` | Twilight Rift | Lv 31–35 | `w4-spring1` |
| `w4-5-2` | Tundra II | Lv 31–35 | `w4-spring6` |
| `w4-5-3` | Ancient Ruins | Lv 31–35 | `w4-spring6` |
| `w4-5-4` | Canyon II | Lv 31–35 | `w4-spring6` |
| `w4-6-1` | Crystal Caverns | Lv 36–40 | `w4-spring5` |
| `w4-6-2` | Volcano II | Lv 36–40 | `w4-spring4` |
| `w4-6-3` | Haunted Moor | Lv 36–40 | `w4-spring4` |
| `w4-6-4` | Jungle II | Lv 36–40 | `w4-spring3` |
| `w4-7-1` | Tundra III | Lv 36–40 | `w4-spring2` |
| `w4-7-2` | Desert II | Lv 36–40 | `w4-spring1` |
| `w4-7-3` | Coast II | Lv 36–40 | `w4-spring1` |
| `w4-7-4` | Forest II | Lv 36–40 | `w4-spring6` |
| `w4-8-1` | Swamp II | Lv 36–40 | `w4-spring4` |
| `w4-8-2` | Meadow II | Lv 36–40 | `w4-spring4` |
| `w4-8-3` | Sky Isles II | Lv 36–40 | `w4-spring3` |
| `w4-8-4` | Highlands II | Lv 36–40 | `w4-spring3` |
| `w4-9-1` | Haunted Moor II | Lv 36–40 | `w4-spring6` |
| `w4-9-2` | Glacier II | Lv 36–40 | `w4-spring6` |
| `w4-9-3` | Underworld II | Lv 36–40 | `w4-spring5` |
| `w4-9-4` | Storm Peaks II | Lv 36–40 | `w4-spring5` |
| `w4-10-1` | Ancient Ruins II | Lv 36–40 | `w4-spring2` |
| `w4-10-2` | Crystal Caverns II | Lv 36–40 | `w4-spring2` |
| `w4-10-3` | Meadow III | Lv 36–40 | `w4-spring1` |
| `w4-10-4` | Twilight Rift II | Lv 36–40 | `w4-spring1` |
| `w4-x-1` | Haunted Moor III | Lv 31–35 | `w4-spring2` |
| `w4-x-2` | Underworld III | Lv 31–35 | `w4-spring3` |
| `w4-x-3` | Sky Isles III | Lv 31–35 | `w4-spring5` |
| `w4-x-4` | Highlands III | Lv 31–35 | `w4-spring6` |
| `w4-x-5` | Twilight Rift III | Lv 36–40 | `w4-spring5` |
| `w4-x-6` | Ancient Ruins III | Lv 36–40 | `w4-spring6` |
| `w4-x-7` | Crystal Caverns III | Lv 36–40 | `w4-spring2` |
| `w4-x-8` | Glacier III | Lv 36–40 | `w4-spring3` |

### Continent 5 (`w5`), Lv 41–50, leaning moor

| Region | Biome | Levels | Nearest Spring |
|---|---|---|---|
| `w5-1-1` | Meadow | Lv 41–45 | `w5-spring5` |
| `w5-1-2` | Haunted Moor | Lv 41–45 | `w5-spring5` |
| `w5-1-3` | Highlands | Lv 41–45 | `w5-spring5` |
| `w5-1-4` | Sky Isles | Lv 41–45 | `w5-spring4` |
| `w5-2-1` | Underworld | Lv 41–45 | `w5-spring4` |
| `w5-2-2` | Haunted Moor II | Lv 41–45 | `w5-spring4` |
| `w5-2-3` | Crystal Caverns | Lv 41–45 | `w5-spring4` |
| `w5-2-4` | Ancient Ruins | Lv 41–45 | `w5-spring3` |
| `w5-3-1` | Twilight Rift | Lv 41–45 | `w5-spring3` |
| `w5-3-2` | Meadow II | Lv 41–45 | `w5-spring3` |
| `w5-3-3` | Glacier | Lv 41–45 | `w5-spring2` |
| `w5-3-4` | Tundra | Lv 41–45 | `w5-spring2` |
| `w5-4-1` | Jungle | Lv 41–45 | `w5-spring2` |
| `w5-4-2` | Swamp | Lv 41–45 | `w5-spring1` |
| `w5-4-3` | Storm Peaks | Lv 41–45 | `w5-spring1` |
| `w5-4-4` | Coast | Lv 41–45 | `w5-spring1` |
| `w5-5-1` | Glacier II | Lv 41–45 | `w5-spring1` |
| `w5-5-2` | Forest | Lv 41–45 | `w5-spring6` |
| `w5-5-3` | Geyser Basin | Lv 41–45 | `w5-spring6` |
| `w5-5-4` | Volcano | Lv 41–45 | `w5-spring6` |
| `w5-6-1` | Canyon | Lv 46–50 | `w5-spring5` |
| `w5-6-2` | Desert | Lv 46–50 | `w5-spring4` |
| `w5-6-3` | Desert II | Lv 46–50 | `w5-spring4` |
| `w5-6-4` | Jungle II | Lv 46–50 | `w5-spring3` |
| `w5-7-1` | Meadow III | Lv 46–50 | `w5-spring2` |
| `w5-7-2` | Swamp II | Lv 46–50 | `w5-spring1` |
| `w5-7-3` | Forest II | Lv 46–50 | `w5-spring1` |
| `w5-7-4` | Coast II | Lv 46–50 | `w5-spring6` |
| `w5-8-1` | Ancient Ruins II | Lv 46–50 | `w5-spring4` |
| `w5-8-2` | Tundra II | Lv 46–50 | `w5-spring4` |
| `w5-8-3` | Twilight Rift II | Lv 46–50 | `w5-spring3` |
| `w5-8-4` | Geyser Basin II | Lv 46–50 | `w5-spring3` |
| `w5-9-1` | Haunted Moor III | Lv 46–50 | `w5-spring6` |
| `w5-9-2` | Volcano II | Lv 46–50 | `w5-spring6` |
| `w5-9-3` | Crystal Caverns II | Lv 46–50 | `w5-spring5` |
| `w5-9-4` | Canyon II | Lv 46–50 | `w5-spring5` |
| `w5-10-1` | Sky Isles II | Lv 46–50 | `w5-spring2` |
| `w5-10-2` | Underworld II | Lv 46–50 | `w5-spring2` |
| `w5-10-3` | Storm Peaks II | Lv 46–50 | `w5-spring1` |
| `w5-10-4` | Highlands II | Lv 46–50 | `w5-spring1` |
| `w5-x-1` | Glacier III | Lv 41–45 | `w5-spring2` |
| `w5-x-2` | Tundra III | Lv 41–45 | `w5-spring3` |
| `w5-x-3` | Canyon III | Lv 41–45 | `w5-spring5` |
| `w5-x-4` | Desert III | Lv 41–45 | `w5-spring6` |
| `w5-x-5` | Geyser Basin III | Lv 46–50 | `w5-spring5` |
| `w5-x-6` | Volcano III | Lv 46–50 | `w5-spring6` |
| `w5-x-7` | Coast III | Lv 46–50 | `w5-spring2` |
| `w5-x-8` | Forest III | Lv 46–50 | `w5-spring3` |
<!-- /live -->
