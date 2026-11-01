# Profile polish: Details and the star chart

> **From the owner's two screenshots, 2026-10-31; approved and built: H139, H140, H142 and H143 (D275–D278).** Art is ChatGPT's, so the
> chart shipped with vector crests, and [H141](../../handoff/tasks/H141-star-crests-art.md) draws the pixel art that
> [H144](../../handoff/tasks/H144-pin-star-art.md) pins (PP25, PP30). No rule, save or balance change: the fight, the jewels and every number stay as
> they are.

**Pages:** [Details](previews/details.html) · [Star chart](previews/star-chart.html). Both are live mocks with the light and dark
themes and both phone sizes; the chart's stars and bodies can be tapped.

## The owner's points

| The owner said | What this does | Packet |
|---|---|---|
| "split this one up a bit and have the raw stats somewhere hidden" | Details opens on damage; every raw number moves to **All stats**, one tap down in the same sheet | H140 |
| "final damage with parenthesis for the different damage sources" | One row a weapon: **86 (70 +8 +6 +2)** | H139, H140 |
| "the summarized 3 weapon type damages" | Her class's three weapons, always | H139 |
| "the ATK or MATK stat in different colors" | ATK orange, M.ATK blue, and a color for each source | H140 |
| "then the weapon might damage and then the accessory damage and then any additional value" | The parts in that order: stat, Might, accessory, ★ | H139 |
| "not sure if we removed Atk values from armors" | Not removed; now shown on its own: **armor 10** | H139, H140 |
| "use the weapon icons any visual info to keep this screen clean of text" | Kind glyphs instead of names, and a thin strip under each row | H140 |
| "pretty inexcusable elipsis not even well positioned" | The lopsided loop goes; every line is a true circle or a straight one, from a checked table | H142 |
| "proper iconography" | Five crests and eight stat marks in uma-art | H141 |
| "a real design for a constellation type diagram" | Each body draws its own figure on a night sky | H142 |
| "visual indicators with numbers" | Numerals on the stars, a count on each body, a value for every node in its sheet | H142, H143 |
| "clickable things" | Every star and every body opens a sheet | H142, H143 |

## 0. At a glance

| | Today | Proposed |
|---|---|---|
| **Details opens on** | 26 rows in two columns | Three damage rows, five stat tiles, All stats |
| **Details height in the mock, 390 wide** | 620 px | 436 px (a hybrid 460), no scroll at 375×667 |
| **Her damage per weapon** | Add it up yourself, from four rows | The first thing on the sheet |
| **Armor's offense** | Inside "gear 13" | "armor 10" beside "accessory 3" |
| **Source colors** | None, only ★ | Six, each at least 4.5:1 in both themes |
| **The map's lines** | An uneven loop, rings missing their nodes | Measured: stars on their ring within 0.05 units |
| **A label past its edge** | ★ Longblade past its ring | None, for the longest template name |
| **What a star says** | Nothing | Its numeral, the jewel's numeral |
| **What comes next** | A green dot, when a jewel is held | Lit lines, Next and Ready apart, a pulse on Ready |
| **A finished body** | Five filled circles | Its figure closes |
| **Icons** | None on the map or the totals | Five crests, eight marks |

## 1. The owner's questions, answered

- **Is damage always one of the ten kinds?** Yes. Every Uma hit runs `strike` in `rpg/battle/engine.ts`, one part a kind, so a row per
  weapon covers it. A Limit Break can land a kind she doesn't hold; those aren't rows.
- **Did armor lose its ATK?** No. Each piece adds 1–5 by grade, × tier, to ATK or M.ATK by her class's half. The screenshot's "gear 13" is
  armor 10 + Charm 3.
- **Why were the colors removed?** The old Battle tab drew gear in blue and Extra Stats in green, with a small legend. H119 (D265) moved
  the rows to Details as plain text, as the approved mock drew them (§3.3), and nobody weighed the loss: no decision mentions it. The
  green can't come back as it was: green is Ready's alone (UP23). ATK against M.ATK was never colored; this adds it.
- **Why didn't the text cleanup fix this?** H117 (D258) turned sentences into labels and numbers, and D239 kept every row. "Might · Fire
  Tome +8" passes that test. The fault here is too many rows, not too many words.

## 2. Details

[The page](previews/details.html). The sum is the engine's own (`battleDamage`, `rpg/battle/engine.ts:389`):

```
offense = her ATK or M.ATK + the weapon's Might + her Orbs on that kind + her signature
```

So each row reads **total (stat +Might +accessory +★)**. The screenshot's Sorcerer:

| Row | M.ATK | Might | Orb | ★ | Total |
|---|---|---|---|---|---|
| Fire | 70 | 8 | 6 | 2 | **86** |
| Blizzard | 70 | 8 | | 2 | **80** |
| Thunder | 70 | 8 | | 2 | **80** |

A Pendant or a Charm is a real stat: heals read it, so the engine holds it inside ATK or M.ATK. It can't be a part of the row without
counting twice. The line under the rows opens the stat instead:

```
M.ATK 70 · base 52 · armor 10 · accessory 3 · Stars 5
```

**It is not the hit you see in a fight.** A hit is that number² ÷ (that number + the foe's DEF) × the skill's power × weakness and the
rest. It is the number you can raise, which is what the owner asked to see. "How stats add up" says so.

## 3. The star chart

[The page](previews/star-chart.html).

**The figures.** A true circle of radius 132 around the Planet carries the three moons, 120° apart. Each moon draws five stars into a
figure, clockwise from I at the top: **Prowess a spearhead, Vigor a pentagon, Guard a shield.** The Planet's five sit on a true ring of
radius 44, and her moon is a pair beside a crescent. Every coordinate is in `places/observatory/star-chart.ts`, and its test holds them.

**The states.** Colour says which body, fill says how far along:

| State | Means | Draws |
|---|---|---|
| **Open** | Set | Filled, with a soft glow; the line to it lit |
| **Ready** | A held jewel opens it now | Ring, green dot, a slow pulse |
| **Next** | Next in line; a level or a jewel is missing | Ring |
| **Later** | Behind the next one | Dim ring |

**The numerals are the jewels' numerals.** A Moon Jewel III opens a III on any moon, and the gates say "Guard II first", so a star says
which jewel it wants. Its value lives in the sheet, where Vigor's "HP +10 · MP +2" fits.

**The sheet.** A star opens its sheet, as now. Above what it gives, the sheet gains a strip of the body's nodes, each with its value, and
a tap on the strip moves to that node. A tap on a body opens the sheet on its next node. So there is one sheet, not two.

## 4. Decisions

The owner prefers no open questions, so each is decided, with the reason.

### Details

| Id | Decision | Why |
|---|---|---|
| PP1 | Details opens on Damage and Stats; **All stats** swaps the same sheet's content, with ‹ Details to return | A sheet never opens a sheet (G4) |
| PP2 | Details always opens on its first page | The page you came for, every time |
| PP3 | One row a weapon, her class's three in slot order | Every hit is one of them |
| PP4 | A kind's glyph (`KindMark`), no name; the name is its label for screen readers | The owner's request; a flame, a snowflake and a bolt differ by shape, which three colored books wouldn't |
| PP5 | The row reads **total (stat +Might +accessory +★)**, zero parts dropped, the stat always shown | The owner's order, and the engine's sum |
| PP6 | Named **Damage**, not Offense | The owner's word; "How stats add up" says it comes before the skill and the foe |
| PP7 | A row's accessory part is her Orbs; a Pendant or a Charm counts inside the stat, and the line below shows it as "accessory" | The engine holds them there, and a row must add up |
| PP8 | One line per stat she uses: `M.ATK 70 · base 52 · armor 10 · accessory 3 · Stars 5`, then `★ n` for her moon | Where armor shows; a Sorcerer's unused ATK stays in All stats |
| PP9 | The Insignia is a chip beside the title, **Bosses +3%**, only when she has one | It multiplies, so it can't be a part |
| PP10 | A 4 px stacked strip under each row, one scale across her three, 2 px gaps | The sources at a glance, with no more text |
| PP11 | Six fixed colors as `--src-*` tokens: ATK, M.ATK, Might, accessory, ★, Stars. Might is a neutral steel | Worst adjacent pair ΔE 12 under simulated colour blindness; every one at least 4.5:1 as 11 px text in both themes |
| PP12 | A **Stats** block of five tiles: HP, MP, DEF, M.DEF, Evasion; a healer adds **Mends** | The next question after damage, as final numbers only |
| PP13 | All stats is one column and holds everything: every `umaBattleSheet` row, 0 included, Core, Work, Since, How stats add up | Nothing is lost; one column ends the wrapped rows |
| PP14 | "gear" splits into **armor** and **accessory** everywhere it shows | The owner couldn't see armor |
| PP15 | A non-graded Uma has no Damage section | Only the older engines' test shapes |

### The star chart

| Id | Decision | Why |
|---|---|---|
| PP16 | The chart sits on the night sky in both themes (`--color-stage`) | It's a sky, and the fights set the precedent |
| PP17 | One orbit, a true circle of radius 132 centred on the Planet, faint and cut around the moons | The owner's fault: the old loop was three arcs forced through uneven points |
| PP18 | Three figures: spearhead, pentagon, shield; a true ring for the Planet; a pair for her moon. Clockwise from I | A silhouette says what the body does; one rule for the order |
| PP19 | Coordinates come from one table, with tests: stars apart by at least 46.2 units, on their rings, inside the chart | "Not even well positioned" should fail a test |
| PP20 | Stars carry numerals, not values | The jewels are numbered, and values don't fit |
| PP21 | Four states; green is Ready's alone; only Ready moves, and not under reduced motion | UP23; one thing asks for attention |
| PP22 | Lines light from star to star; the closing line only when a body is full | The order shows, and finishing a body shows too |
| PP23 | A color for each body: gold, ember, rose, sky and orchid | A chart should be readable at a glance; no green |
| PP24 | Each body's label holds its name and count; ★ her moon's label runs from the right edge | Any template name fits |
| PP25 | Crests sit over the SVG in HTML buttons: vector until H144 pins the pixel art, at whole pixels | The viewBox scale would blur pixel art, and a button is a real 44 pt target |
| PP26 | A tap on a body opens the sheet on its next node, or its last when full | One sheet, no new kind |
| PP27 | The node sheet gains a strip of its body's nodes, each with the first number of its value | Every value of a body in one place |
| PP28 | The six totals and the ★ line stay, with stat marks | The owner didn't ask to lose them |
| PP29 | Details' tiles wear the same marks | One icon set |
| PP30 | Five 24 px crests and eight 16 px marks, in uma-art's `ui` atlas; ChatGPT draws and publishes; H144 pins, and vector stand-ins carry the game until then | Art is ChatGPT's end to end, and the chart shouldn't wait on it |
| PP31 | The top-left corner stays empty | Tier 2 and Tier 3's weapon moons fit there, whenever they're built; nothing is built for them now |

## 5. The packets

| Id | What | Who | Size | Needs |
|---|---|---|---|---|
| H139 | The damage numbers, proved equal to a fight's | Claude | S | — |
| H140 | Details: damage first, All stats a tap down | Claude | M | H139 |
| [H141](../../handoff/tasks/H141-star-crests-art.md) | Art: five crests and eight stat marks | ChatGPT draws and publishes | S | — |
| H142 | The star chart, with vector crests | Claude | M | — |
| H143 | A body's sheet, its strip and the stat marks | Claude | S | H140, H142 |
| [H144](../../handoff/tasks/H144-pin-star-art.md) | Pin uma-art 2.19.0: pixel crests and marks | Claude or ChatGPT | S | H141 |

H143 joins Details and the chart. H144 follows the art.
