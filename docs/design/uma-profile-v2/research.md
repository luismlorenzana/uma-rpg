# Uma profile v2: the research

> **Research, 2026-10-28. Not a design.** This page answers the owner's ask for the Uma profile rework: "in a meaningful
> way, having consistency", and "do some research on UX patterns and how other games do this, do not approach this
> willy-nilly". It covers how seventeen games build one character's screen, what platform and UX guidance says about
> the same problem on a phone, and the anti-patterns to avoid. [audit.md](audit.md) describes today's screen. The
> main session's proposal builds on both.
>
> **How to read the sources.** Every claim about a game links its source. **†** marks a fact seen only in a
> search-result summary, because the page itself could not be opened. **Unverified** marks the few facts that rest on
> general knowledge. The limits are in [§6](#6-method-and-limits). No images from these games are stored in this repo,
> and no character, outfit, skill or scenario names from the original game appear here.

## The owner's points

| The owner's point | Answered in |
|---|---|
| Display-only tabs (Battle, Racing) sit next to tabs where you change things (Skills, Gear) | [§2.1](#21-three-families), [§3.3](#33-viewing-and-changing), [§5.3](#53-where-each-system-could-live) |
| Extra Stats live on the Observatory, outside the profile, while gear is inside it | [§2.4](#24-what-developers-changed-later), [§5.3](#53-where-each-system-could-live) |
| The Work tab is nearly useless | [§2.1](#21-three-families) (jobs live at the workplace), [§5.3](#53-where-each-system-could-live) |
| Keep "infinite tabs", or split the profile into pages depending on where he comes from? | [§3.1](#31-tabs-segmented-controls-and-hubs), [§3.6](#36-opening-in-context), [§5.2](#52-structure-options), [§5.4](#54-one-profile-many-doors) |
| Research, not "willy-nilly" | [§2](#2-how-games-build-one-characters-screen) (17 games), [§3](#3-general-guidance-for-phones) (Apple, Google, NN/g), [§4](#4-anti-patterns) |

## 0. At a glance

Ten patterns that carry over to this game:

| # | Pattern | Seen in | What it means for the Uma profile |
|---|---|---|---|
| P1 | **One character, one home.** Each game has one screen that holds everything about one character. Where a game split her systems across menus, later patches linked them back or moved them onto her screen. | FGO 2025, FEH 4.0.0 → 10.8.0, Pokémon SV 1.2.0 | Extra Stats move into her profile. The Observatory becomes a way in. |
| P2 | **One tab per system. Each tab both shows and changes its system.** Read-only facts sit in a header or a details overlay, not in a tab of their own. | Genshin, Star Rail, ZZZ, Wuthering Waves, Blue Archive, PriConne | Battle and Racing stop being tabs of their own. |
| P3 | **Spending sits with the thing it raises.** One button opens a focused screen that shows the before and after. | Genshin, ZZZ, FEH merge, Azur Lane | Each raise stays beside its slot and shows Now → Next. |
| P4 | **Few tabs, fixed in place, named with one-word nouns.** New features become buttons inside a tab, not more tabs. | Apple, NN/g; Wuthering Waves loadouts, Genshin Fast Equip | Four or five tabs at most, and no scrolling tab strip. |
| P5 | **One profile, many doors.** Other screens open the same profile on the matching tab, and Back returns to where you came from. No surveyed game builds a different character page for each origin. | FGO 2025, ZZZ "Return to Upgrading", Star Rail 2.2; Android's deep-link rule | One route per tab. The Party Hall, the Observatory and the Wilds each open her on the tab that fits. |
| P6 | **Jobs are run at the workplace, not on the character.** Her screen shows at most what she is doing and her work stat. | Arknights Base, Blue Archive Cafe, Azur Lane commissions, NIKKE Outpost | The Work tab shrinks to a status line, and her trade joins her identity. |
| P7 | **Next and previous character without leaving the tab.** | Pokémon summary, Persona 5's Equip | Swipe or arrows move through the list she was opened from. |
| P8 | **Batch and one-tap actions.** Games that lacked them added them later. | Genshin 4.3, Star Rail 4.4, PriConne 2021, NIKKE 2025, FEH Auto-Learn, Azur Lane's Fill | "Raise all ready" and "Set all jewels", for dozens of working Umas. |
| P9 | **Readiness is one quiet mark plus a filter, not a badge on everything.** | AFK Arena 1.28, NIKKE, Arknights' new-items filter | Keep one green mark, and have it lead to the exact slot. |
| P10 | **A label and a number. The full sentence only when asked.** | Star Rail 2.5's simple/full text switch; Apple and NN/g on writing | "Fire +1", not "This is a +1 bonus to fire damage when equipped". |

**Where the evidence leans** (a reading of the research, not a design; [§5.7](#57-where-the-evidence-leans)):
- Keep one profile and open it on the right tab. Don't build a separate page for each origin.
- Use four or five tabs, each one a system you can change, with facts in the header or a details sheet.
- Bring Extra Stats in.
- Reduce Work to a status line.
- Add next and previous Uma.

## 1. The question

Today's profile, as [sections.md § Stable](../../game/sections.md#stable) describes it. [audit.md](audit.md) has the full
inventory.

| Surface | What it holds | Changes things? | Also elsewhere |
|---|---|---|---|
| Header | Bust, name, level, rarity, template chip (opens her template sheet), target, EXP, and a row for class, Craft Level and Party or Work | Target; the one-time calling pick | Template also on Racing |
| Skills tab | Class, three trees, equipped skills, Inheritance, Class Ranks | Yes: class, branch, equip, weapon per slot | Weapon grades are raised on Gear |
| Battle tab | Stats in four groups, then the five core stats | No | — |
| Gear › Equip | Preset, loadout, accessory family | Yes | Weapons are also set on Skills |
| Gear › Upgrade | Grades, and an Extra Stats summary | Yes, spends | Jewels are set on the Observatory |
| Work tab | Her job, trade, Craft EXP | No (opens her place) | Jobs are run on Wilds pages |
| Racing tab | Aptitudes, template, racing stats | No | Template also in the header chip |
| Observatory (a separate page) | Her Extra Stats map and jewels | Yes, spends | Summary on Gear › Upgrade |

The owner's four complaints map onto this table:
- Two tabs only display.
- One system (Extra Stats) is split between a tab and another page.
- One tab (Work) mirrors a place that holds the real controls.
- The tab count grows with every system.

## 2. How games build one character's screen

### 2.1 Three families

| Family | How it works | Games | Strength | Cost |
|---|---|---|---|---|
| **A. Character first, tabs** | Pick a character, then a tab per system. Each tab shows its system and holds the buttons that change it. | Genshin, Star Rail, ZZZ, Wuthering Waves, Blue Archive, PriConne, Azur Lane, NIKKE, AFK Arena | Everything about her is in one place, and the tab keeps its context. | Tabs multiply as systems are added. |
| **B. Character first, hub** | One overview card. Each block or button opens a full page for one system. | Arknights, Octopath: Champions of the Continent, FEH (its profile since 10.8.0) | Each system gets room, and the overview is easy to scan. | One more tap for every system. |
| **C. System first** | Pick the system (Enhance, Equip, Skills), then the character. | FGO, the original game (Umamusume: Pretty Derby), Persona 5, Octopath Traveler II, FEH's Allies menu | Suits batch work across many characters. | Her picture is scattered, so games add links back to the character. |

Two things hold across every family:
- **Jobs and idle work never live on the character screen.** Arknights runs jobs in its Base. Blue Archive raises bond in
  the Cafe. Azur Lane runs commissions and skill training from base menus. NIKKE uses the Outpost. Her screen shows at
  most the related stat (sources in [§2.2](#22-the-comparison)).
- **Roster-wide levelling moved out of the character.** NIKKE's Synchro Device, AFK Arena's Resonating Crystal and AFK
  Journey's Resonating Hall set levels for many characters at once from a separate building.

### 2.2 The comparison

| Game | Sections (count) | Where you view | Where you change | Where you spend | Ways in | Notes |
|---|---|---|---|---|---|---|
| **Genshin Impact** | Attributes, Weapons, Artifacts, Constellation, Talents, Profile (6) ([Fextralife](https://genshinimpact.wiki.fextralife.com/Playable+Characters)) | Each tab, plus a details overlay for full stats ([Game Rant](https://gamerant.com/genshin-impact-every-stat-explained-guide/)) | Weapon and artifacts on their tabs | Level Up and Ascend open screens from the Attributes tab ([Fextralife](https://genshinimpact.wiki.fextralife.com/Playable+Characters), [Android Central](https://androidcentral.com/genshin-impact-level-guide-how-level-characters-weapons-and-items)†) | The character menu, with a roster strip; party members stay visible under a filter ([Game8](https://game8.co/games/Genshin-Impact/archives/462480)) | Loadouts were added inside Artifacts (4.4, 5.7) |
| **Honkai: Star Rail** | Details, Light Cone, Relics, Traces, Eidolons (5; names partly unverified; [ONE Esports](https://www.oneesports.gg/gaming/honkai-star-rail-guide-genshin-players)) | Each tab, with a simple/full text switch since 2.5 ([MP1st](https://mp1st.com/?p=267961)) | A separate Relic Switch screen ([MP1st](https://mp1st.com/?p=267961)) | Level and Superimpose sub-tabs on Light Cone ([ONE Esports](https://www.oneesports.gg/gaming/honkai-star-rail-guide-genshin-players)) | The character menu. Lore lives in a separate Data Bank ([A Little Bit Human](https://alittlebithuman.com/how-to-find-character-voice-lines-in-honkai-star-rail/)) | Since 2.2 a recommended Trace jumps you to that node ([wiki](https://honkai-star-rail.fandom.com/wiki/Version/2.2)†) |
| **Zenless Zone Zero** | Base stats, Skills, Equipment, plus a Mindscape Cinema button ([Siliconera](https://www.siliconera.com/?p=1041197), [Game8](https://game8.co/games/Zenless-Zone-Zero/archives/460728)) | A Basic Stats button opens full stats ([Game8](https://game8.co/games/Zenless-Zone-Zero/archives/439279)) | The Agent Equipment screen: W-Engine and six discs ([MP1st](https://mp1st.com/?p=269355)) | The Level Up and Promotion page and the Skill Enhancement screen ([Siliconera](https://www.siliconera.com/?p=1041197), [MP1st](https://mp1st.com/?p=269355)) | The Agents page | Since 1.1 a missing material links to where it drops, then "Return to Upgrading" ([MP1st](https://mp1st.com/?p=265411)) |
| **Wuthering Waves** | Overview, Weapon, Echoes, Fortes, Resonance Chain, in a left icon column (Weapon's name unverified; [Game8](https://game8.co/games/Wuthering-Waves/archives/455396), [Game8](https://game8.co/games/Wuthering-Waves/archives/492671)) | Overview | Each tab | Screens opened from each tab | The Resonator menu | The 2.1 Loadout button sits inside Echoes ([Game8](https://game8.co/games/Wuthering-Waves/archives/499800)). The 2.7 planner is opened from the same menu ([Gematsu](https://www.gematsu.com/2025/09/wuthering-waves-version-2-7-update-dawn-breaks-on-dark-tides-launches-october-9)) |
| **The original game** (Umamusume: Pretty Derby) | No single hub. Enhance holds one tile per system ([Game8](https://game8.co/games/Umamusume-Pretty-Derby/archives/537918), [Game8](https://game8.co/games/Umamusume-Pretty-Derby/archives/541048), [Game8](https://game8.co/games/Umamusume-Pretty-Derby/archives/541847)) | Read-only detail pages, opened from many lists ([Game8](https://game8.co/games/Umamusume-Pretty-Derby/archives/541847)) | — | Each Enhance tile is a list, then a spend screen | Home's Enhance tab. Deck Select can also level cards ([Game8](https://game8.co/games/Umamusume-Pretty-Derby/archives/536168)) | The Japanese server removed support card levels in October 2025 ([Siliconera](https://www.siliconera.com/support-cards-will-no-longer-have-levels-in-umamusume-pretty-derby-jp/)) |
| **Arknights** | A Character Details card with blocks: level and promotion, skills, modules, potential, trust, files ([wiki.gg](https://arknights.wiki.gg/wiki/Operator)) | The card | The active skill is picked in the operator or squad menu ([wiki.gg](https://arknights.wiki.gg/wiki/Skill)) | Each block opens its own menu. Skill mastery happens in the Base's Training Room ([wiki.gg](https://arknights.wiki.gg/wiki/Skill)) | Operator Management, Squads; a filter shows what's new ([wiki.gg](https://arknights.wiki.gg/wiki/User_interface)) | Jobs are set only in the Base, with presets, one-tap refill and a lock ([wiki.gg](https://arknights.wiki.gg/wiki/Gameplay_and_Base_Changes)) |
| **Fire Emblem Heroes** | A hero profile with three configurable buttons (10.8.0). The Allies menu groups Ally Growth, Change Equipment and Interact ([Perfectly Nintendo](https://www.perfectly-nintendo.com/?p=328159)) | The profile | Skills on the profile since 4.0.0 ([APKMirror](https://www.apkmirror.com/apk/nintendo-co-ltd/fire-emblem-heroes/fire-emblem-heroes-4-0-0-release/)) | Merge and Inherit stay in the menu, with a Before/After preview ([Game8](https://game8.co/games/fire-emblem-heroes/archives/295530)) | The Allies menu, Edit Teams. Skill sets apply to whole teams (2.8.0; [Perfectly Nintendo](https://www.perfectly-nintendo.com/?p=344692)) | Moved from system first to character first over seven years |
| **Octopath: Champions of the Continent** | A status screen with one button per system: Level Up, Learn Skills (the Job Board), Equipment, Limit Break, Awakening, Final Class Board ([FandomSpot](https://www.fandomspot.com/octopath-traveler-cotc-beginners-guide/)) | The status screen | The Equipment page | Each page spends its own resource | Party menu, then the traveler, then status ([Gameranbu](https://gameranbu.jp/octopathtravelersp/e9b49ac8fe199dbc7ab0)) | Each system is a full page |
| **Blue Archive** | Basic Info, Level Up, Unlock Mystic (3) ([gameplay.tips](https://gameplay.tips/guides/blue-archive-student-growth-guide.html)) | Basic Info | Gear is equipped on Basic Info | The Level Up tab; skill growth inside Basic Info; tapping a material shows where to get it | Students, from the lobby | Bond is earned outside her screen, in the Cafe and Schedule ([wiki](https://bluearchive.wiki/wiki/Affection)) |
| **Princess Connect! Re:Dive** | Tabs for equipment and rank, skills, special equipment, talent flowering, memory pieces ([LevelWinner](https://www.levelwinner.com/princess-connect-re-dive-beginners-guide-tips-tricks-strategies/), [PriConne Library](https://www.priconnelibrary.com/2021/05/new-update-on-character-enhancement.html)) | Each tab | Six gear slots on the main tab | Inline buttons; auto-enhance; bulk buttons since 2021 ([PriConne Library](https://www.priconnelibrary.com/2021/05/new-update-on-character-enhancement.html)) | Characters, from the footer; the list includes characters not yet owned | "How to obtain" on every item ([LevelWinner](https://www.levelwinner.com/princess-connect-re-dive-beginners-guide-tips-tricks-strategies/)) |
| **Fate/Grand Order** | Formation (the Servant list) and Enhance (Servant, Ascension, Skill, Noble Phantasm, Palingenesis…) are separate menus ([Samurai Gamers](https://samurai-gamers.com/?p=100847), [GamePress](http://fgo.gamepress.gg/leveling-and-upgrades)) | Servant Details, mostly read-only | — | All in Enhance, system first | Party setup. Since March 2025 its Details screen links to every enhancement screen, each shown only when possible ([notice](https://webview.fate-go.us/2025/0325_gameupdate_notice/)) | The split costs trips, and has been patched since 2018 |
| **Azur Lane** | A ship page with a left rail: Info, Enhance, Limit Break, Gear, Retrofit (when she has one), Archive ([wiki](https://azurlane.koumakan.jp/wiki/Dockyard)†) | Info | Gear | Enhance ("Fill" picks the feed for you) and Limit Break on the rail ([GachaZone](https://gachazone.com/azur-lane-progress-guide/)) | The Dock | Skills are trained in the Academy and commissions run from base menus ([wiki](https://azurlane.koumakan.jp/wiki/Skills)†) |
| **NIKKE** | A profile with level and limit break, a Skill tab, gear, cube and doll ([nikke.gg](https://nikke.gg/profile-and-leveling-guide/), [nikke.gg](https://nikke.gg/october-30-update-patch-notes)) | The profile | Gear, with Quick Equip ([nikke.gg](https://nikke.gg/equipment/)†) | On the profile. The Synchro Device in the Outpost levels many Nikkes at once ([nikke.gg](https://nikke.gg/profile-and-leveling-guide/)) | The NIKKE tab's roster | 2025 brought batch limit breaks, one-tap upgrades and 25 Synchro slots ([nikke.gg](https://nikke.gg/september-24-patch-notes)) |
| **AFK Arena** | Hero Details: level, gear and Signature Item, an Engrave tab ([afk.guide](https://afk.guide/eternal-engravings/)) | Hero Details | Gear | Hero Details. The Crystal and the furniture are separate buildings ([afk.guide](https://afk.guide/resonating-crystal/)) | Heroes | 1.28 moved the red marks into a recommendation page ([afk.guide](https://afk.guide/?p=1647)) |
| **Pokémon** (main series) | Summary pages, one of them Moves and Stats in Scarlet/Violet ([Game8](https://game8.co/games/Pokemon-Scarlet-Violet/archives/397583)) | The summary, from the party, the boxes and battle; battle shows less ([Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Summary)†) | Since Scarlet/Violet 1.2.0: nickname, held item, moves and TMs on the summary ([Nintendo Life](https://www.nintendolife.com/news/2023/02/pokemon-scarlet-and-violet-version-1-2-0-is-now-live-here-are-the-updated-patch-notes)) | — | Party, boxes, battle | Up and down change the Pokémon, left and right the page ([Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Summary)†) |
| **Persona 5** | A pause menu by system: Skill, Item, Equip, Persona and more (full list unverified) | Stats | Equip: pick the character, then the slot; L1/R1 move to the next ([Pro Game Guides](https://progameguides.com/persona/how-to-unlock-all-outfits-in-persona-5-royal/)†) | — | The pause menu | Praised for style that stays clear; criticised for motion that slows reading (see [§2.5](#25-what-players-and-reviewers-say)) |
| **Octopath Traveler II** | A menu by system: Skills, Jobs… ([Game8](https://game8.co/games/Octopath-Traveler-2/archives/405497), [Twinfinite](https://twinfinite.net/?p=911041)†) | — | Pick the system, then the traveler | — | The menu | The first game's demo drew complaints about its menus, fixed for release ([Siliconera](https://www.siliconera.com/square-enix-project-octopath-travelers-fixes-adjustments-made-fan-feedback/)) |

### 2.3 Game by game

- **Genshin Impact.** The archetype of family A: a roster strip across the top and six tabs per character.
  - Each tab shows its system and holds its button. Level Up and Ascend live on Attributes, with a list of missing
    materials and where to get them ([Fextralife](https://genshinimpact.wiki.fextralife.com/Playable+Characters)).
  - Full stats open in a details overlay grouped into base, advanced and elemental
    ([Game Rant](https://gamerant.com/genshin-impact-every-stat-explained-guide/)).
  - Outfits are a button beside Level Up, not a tab ([Fextralife](https://genshinimpact.wiki.fextralife.com/Outfits)).
  - Lore is the sixth tab, Profile.
  - Later versions added helpers inside the existing tabs:
    - 4.3: one tap levels to the next ascension cap, and the before/after values moved onto the screen instead of a
      pop-up ([Sportskeeda](https://www.sportskeeda.com/esports/5-new-genshin-impact-4-3-features-revealed-developer-notes)†).
    - 4.4: Fast Equip ([Gaming on Phone](https://gamingonphone.com/news/genshin-impact-4-4-update-developers-discussion-talks-about-fast-equip-artifacts-serenitea-pot-optimizations)).
    - 5.7: saved loadouts ([Siliconera](https://www.siliconera.com/genshin-impact-artifact-custom-loadouts-arrive-in-5-7/)).
- **Honkai: Star Rail.** Same family, five tabs. Two differences matter here:
  - Lore moved out to a separate Data Bank, so every tab is about the build
    ([A Little Bit Human](https://alittlebithuman.com/how-to-find-character-voice-lines-in-honkai-star-rail/)).
  - Since 2.5, ability text switches between a simple and a full description
    ([MP1st](https://mp1st.com/?p=267961)).
- **Zenless Zone Zero.** Three areas plus a button. Two habits fit this game:
  - Full stats are one button away, not a tab ([Game8](https://game8.co/games/Zenless-Zone-Zero/archives/439279)).
  - A missing material leads to where it drops and back to the upgrade with "Return to Upgrading"
    ([MP1st](https://mp1st.com/?p=265411)).
- **Wuthering Waves.** It follows Genshin's structure closely; a launch review says its UI was taken almost wholesale from Genshin
  ([Anime Corner](https://animecorner.me/wuthering-waves-review-genshin-like/)). Every system added since landed as a
  button inside an existing tab or menu:
  - loadouts inside Echoes ([Game8](https://game8.co/games/Wuthering-Waves/archives/499800));
  - a planner opened from the Resonator menu ([Gematsu](https://www.gematsu.com/2025/09/wuthering-waves-version-2-7-update-dawn-breaks-on-dark-tides-launches-october-9)).
- **The original game.** System first.
  - Enhance holds one tile per kind of spending: potential, star unlock, support card level and limit break, the
    veteran list ([Game8](https://game8.co/games/Umamusume-Pretty-Derby/archives/537918),
    [Game8](https://game8.co/games/Umamusume-Pretty-Derby/archives/541847),
    [Game8](https://game8.co/games/Umamusume-Pretty-Derby/archives/537103)).
  - Detail pages are read-only and can be opened from many lists.
  - Outfits and profiles live under Home and the Archive ([Game8](https://game8.co/games/Umamusume-Pretty-Derby/archives/541048)).
  - In October 2025 the Japanese server removed support card levels, and a whole spending screen with them
    ([Siliconera](https://www.siliconera.com/support-cards-will-no-longer-have-levels-in-umamusume-pretty-derby-jp/)).
- **Arknights.** Family B: one card, and each block opens its own menu.
  - The card holds almost every operator option ([wiki.gg](https://arknights.wiki.gg/wiki/User_interface)).
  - The card is not where jobs happen. Mastery is trained in the Base's Training Room
    ([wiki.gg](https://arknights.wiki.gg/wiki/Skill)), and base posts are set in the Base.
  - Its answer to the chore of moving many workers was per-facility presets, one-tap refill and a lock, all in the Base
    ([wiki.gg](https://arknights.wiki.gg/wiki/Gameplay_and_Base_Changes)).
- **Fire Emblem Heroes.** The clearest drift from system first to character first:
  - 4.0.0: skills could be learned and changed from the hero's profile
    ([APKMirror](https://www.apkmirror.com/apk/nintendo-co-ltd/fire-emblem-heroes/fire-emblem-heroes-4-0-0-release/)).
  - 10.8.0: the profile's three buttons became configurable, with an Enhance button that opens five actions
    ([Perfectly Nintendo](https://www.perfectly-nintendo.com/fire-emblem-heroes-software-updates)).
  - Actions that consume another hero (merge, inherit) stayed in the menu and show a Before/After preview
    ([Game8](https://game8.co/games/fire-emblem-heroes/archives/295530)).
- **Octopath: Champions of the Continent.** Family B taken to the end: a status screen whose buttons each open a full
  page (level, Job Board, equipment, limit break, awakening, class board), each spending its own resource
  ([FandomSpot](https://www.fandomspot.com/octopath-traveler-cotc-beginners-guide/)).
- **Blue Archive.** Three tabs ([gameplay.tips](https://gameplay.tips/guides/blue-archive-student-growth-guide.html)):
  - Basic Info both shows her and opens skill growth and gear.
  - Level Up spends.
  - Unlock Mystic raises stars.
  - Bond is earned elsewhere, in the Cafe ([wiki](https://bluearchive.wiki/wiki/Cafe)).
- **Princess Connect! Re:Dive.** Tabs where each tab is its own spending surface.
  - It added auto-enhance, then bulk "do several at once" buttons at the same cost as by hand
    ([PriConne Library](https://www.priconnelibrary.com/2021/05/new-update-on-character-enhancement.html)).
  - Its trap: guides warn that refining gear before a rank-up is wasted, because the rank-up consumes the gear
    ([TouchTapPlay](https://www.touchtapplay.com/how-to-quickly-increase-rank-in-princess-connect-re-dive/)†). That is
    an inline spend with no preview of the loss.
- **Fate/Grand Order.** Family C, and the case study in what that split costs:
  - The Servant list and the Enhance menu are separate ([Samurai Gamers](https://samurai-gamers.com/?p=100847)).
  - From 2018 on, patches added filters, shortcuts and links from Servant Details ([GamePress](https://fgo.gamepress.gg/camelot-qol-updates),
    [notice 2019](https://webview.fate-go.us/2019/0420_gameupdate_notice/)).
  - In March 2025 the Details screen opened from party setup gained a direct link to every enhancement screen, shown
    only when that action is possible ([notice](https://webview.fate-go.us/2025/0325_gameupdate_notice/)).
- **Azur Lane.** Family A, with the tabs as a left rail on the ship page:
  - Enhance, Limit Break, Gear and Retrofit are on the rail ([GachaZone](https://gachazone.com/azur-lane-progress-guide/)).
  - Skill training and commissions are timed jobs in base menus ([wiki](https://azurlane.koumakan.jp/wiki/Expeditions)†).
- **NIKKE.** Per-unit spending sits on the profile; levelling across the roster sits in the Outpost's Synchro Device.
  - Its developers called the device's slot limits and fiddly steps a long-standing drawback
    ([nikke.gg](https://nikke.gg/september-2025-developers-note/)).
  - They answered with batch and one-tap actions ([nikke.gg](https://nikke.gg/september-24-patch-notes),
    [nikke.gg](https://nikke.gg/july-2025-developers-note/)).
- **AFK Arena and AFK Journey.**
  - AFK Arena keeps per-hero spending on Hero Details, with roster-wide systems in separate buildings
    ([afk.guide](https://afk.guide/resonating-crystal/)).
  - AFK Journey goes further and moves level and gear off the hero altogether: five heroes are levelled and everyone
    else follows ([ESTNN](https://estnn.com/how-to-level-up-heroes-in-afk-journey-complete-guide),
    [GGRecon](https://ggrecon.com/guides/afk-journey-forge-equipment)).
- **Pokémon.** One summary screen, three ways in: party, boxes and battle, with battle showing less. Up and down change
  the Pokémon; left and right change the page ([Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Summary)†).
  - Scarlet/Violet 1.2.0 moved the small edits onto the summary itself: nickname, held item, moves, TMs
    ([Nintendo Life](https://www.nintendolife.com/news/2023/02/pokemon-scarlet-and-violet-version-1-2-0-is-now-live-here-are-the-updated-patch-notes)).
- **Persona 5 and Octopath Traveler II.** Console menus, system first.
  - Persona 5's Equip picks the character, then the slot, and the shoulder buttons step to the next character
    ([Pro Game Guides](https://progameguides.com/persona/how-to-unlock-all-outfits-in-persona-5-royal/)†).
  - Its director describes every menu as custom-built, and early versions as hard to read until iterated
    ([Kotaku](https://kotaku.com/metaphor-refantazio-persona-5-menu-ui-hashino-1851667088)).

### 2.4 What developers changed later

Patches that reshape a screen are the strongest evidence of what annoyed players. Their direction is consistent:

| Game | Version | Change | Direction |
|---|---|---|---|
| Fire Emblem Heroes | 4.0.0; 10.8.0 | Skills learned and changed from the profile; configurable Enhance buttons on the profile ([APKMirror](https://www.apkmirror.com/apk/nintendo-co-ltd/fire-emblem-heroes/fire-emblem-heroes-4-0-0-release/), [Perfectly Nintendo](https://www.perfectly-nintendo.com/fire-emblem-heroes-software-updates)) | Toward one home for the character |
| Fate/Grand Order | March 2025 | Details from party setup link to every enhancement screen, shown only when possible ([notice](https://webview.fate-go.us/2025/0325_gameupdate_notice/)) | Toward one home; the door depends on context |
| Pokémon Scarlet/Violet | 1.2.0 | Nickname, item, moves and TMs editable on the summary ([Nintendo Life](https://www.nintendolife.com/news/2023/02/pokemon-scarlet-and-violet-version-1-2-0-is-now-live-here-are-the-updated-patch-notes)) | Small edits move onto the view screen |
| Genshin Impact | 4.3; 4.4; 5.7 | One tap to the next cap, before/after shown on the screen instead of a pop-up†; Fast Equip; loadouts, all inside existing tabs | Batch actions, fewer pop-ups, no new tabs |
| Honkai: Star Rail | 2.2; 2.5; 4.4 | A recommendation jumps to its Trace†; a simple/full text switch; quick level up ([MP1st](https://mp1st.com/?p=267961), [Siliconera](https://www.siliconera.com/honkai-star-rail-getting-character-and-light-cone-quick-level-up/)) | Short text by default; fewer taps |
| Zenless Zone Zero | 1.1 | Material → where it drops → "Return to Upgrading" ([MP1st](https://mp1st.com/?p=265411)) | A round trip that comes back to the same spot |
| Wuthering Waves | 2.1; 2.7 | Loadouts inside Echoes; a planner inside the menu ([Game8](https://game8.co/games/Wuthering-Waves/archives/499800), [Gematsu](https://www.gematsu.com/2025/09/wuthering-waves-version-2-7-update-dawn-breaks-on-dark-tides-launches-october-9)) | New features as buttons, not tabs |
| AFK Arena | 1.28 | Red marks moved off the Heroes page into a recommendation page ([afk.guide](https://afk.guide/?p=1647)) | Fewer badges |
| NIKKE | 2025 | Batch limit breaks, one-tap upgrades, 25 Synchro slots ([nikke.gg](https://nikke.gg/september-24-patch-notes)) | Batch actions for big rosters |
| Princess Connect! Re:Dive | May 2021 | Bulk buttons at the same cost as by hand ([PriConne Library](https://www.priconnelibrary.com/2021/05/new-update-on-character-enhancement.html)) | Batch actions |
| Arknights | Base revamp | Per-facility presets, one-tap refill and a lock for job assignment ([wiki.gg](https://arknights.wiki.gg/wiki/Gameplay_and_Base_Changes)) | Jobs managed at the workplace, in bulk |
| The original game (Japanese server) | October 2025 | Support card levels removed, and the screen for them ([Siliconera](https://www.siliconera.com/support-cards-will-no-longer-have-levels-in-umamusume-pretty-derby-jp/)) | Fewer spending screens |
| Fire Emblem Heroes | 3.3.0 | Sacred Seal menu regrouped by slot after complaints that it was hard to read ([Perfectly Nintendo](https://www.perfectly-nintendo.com/fire-emblem-heroes-ver-3-3-0-all-you-need-to-know-inherit-skill-anima-and-dark-mythic-heroes-sacred-seals-more/), [Siliconera](https://www.siliconera.com/2019/03/01/fire-emblem-heroes-march-update-strengthens-skill-inheritance-and-adds-new-weapons/)†) | Group by what you look for |

### 2.5 What players and reviewers say

| Game | What they say | Source | Lesson |
|---|---|---|---|
| Genshin Impact | Loadouts leave the weapon out, so it is still swapped by hand | [Pocket Tactics](https://www.pockettactics.com/genshin-impact/artifact-loadouts) | A shortcut that covers half a job still leaves the chore |
| Genshin vs Star Rail | Genshin players were annoyed that Star Rail had auto material fill first | [inkl](https://inkl.com/news/genshin-impact-players-in-shambles-as-honkai-star-rail-beats-them-to-features-they-ve-wanted-for-years)† | Players expect batch spending |
| Zenless Zone Zero | With no loadouts, every build swap is a mental chore | [ComicBook](https://comicbook.com/gaming/news/zzz-zenless-zone-zero-loadout-system-need) | Presets matter when one character serves several roles |
| Arknights | English showed skill names on the card, then reverted because long names overflowed | [wiki.gg](https://arknights.wiki.gg/wiki/Operators_Pages_Changes) | A card must budget for long labels; names belong in the detail |
| Fire Emblem Heroes | Players found the seal menu hard to read; it was regrouped | [Siliconera](https://www.siliconera.com/2019/03/01/fire-emblem-heroes-march-update-strengthens-skill-inheritance-and-adds-new-weapons/)† | Group by slot, the way people look |
| NIKKE (developers) | The Synchro Device's slot limits and fiddly steps were a long-standing drawback | [nikke.gg](https://nikke.gg/september-2025-developers-note/) | Roster-wide tools must scale to the whole roster |
| AFK Arena (developers) | Too many red marks cluttered the Heroes page | [afk.guide](https://afk.guide/?p=1647) | Badges lose meaning when everything has one |
| Azur Lane | A review calls the UI snappy and uncluttered with over 600 ships | [TapTap](https://www.taptap.io/tw/post/10565109)† | A rail of a few fixed sections scales to a huge roster |
| Persona 5 | Praised as stylish yet simple and functional; criticised for motion that makes descriptions hard to read | [Siliconera](https://www.siliconera.com/?p=1007130), [Kotaku](https://kotaku.com/persona-5-menus-make-everything-better-1794216056), [Prototypr](https://blog.prototypr.io/the-video-game-user-experience-awards-9d63afda9f5c)† | Style is fine if reading stays fast |
| Octopath Traveler | Demo players found the help text too small and the menu not smooth; fixes were promised | [Siliconera](https://www.siliconera.com/square-enix-project-octopath-travelers-fixes-adjustments-made-fan-feedback/) | Legibility comes before decoration |
| Octopath: Champions | Called grindy, with automated hunts as the main relief | [Boss Rush](https://bossrush.net/2023/07/game-review-octopath-traveler-champions-of-the-continent/) | Automation is the convenience players notice |

## 3. General guidance for phones

### 3.1 Tabs, segmented controls and hubs

- **Tab bars are for top-level sections of the app, and for navigation, not actions.** They should stay visible and keep
  each section's state ([Apple, Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)).
  - In this game the kit's bottom bar is the tab bar. The profile's tabs are in-page switches, so the next rule applies
    to them.
- **Segmented controls switch between closely related views inside one screen** ([Apple, Segmented
  controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls)):
  - about five segments on iPhone;
  - nouns for labels, all text or all icons;
  - never for unrelated sections;
  - never mixing actions and selections in one control.
- **Tab views:** avoid more than six tabs, and each pane's controls should affect only that pane
  ([Apple, Tab views](https://developer.apple.com/design/human-interface-guidelines/tab-views)).
- **NN/g on tabs** ([Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/)):
  - use tabs for alternate views of related content;
  - avoid them when people must compare across tabs;
  - fewer is better, because overflowing tabs hide;
  - open on the most-used tab;
  - keep labels to one or two words;
  - don't mix in-page tabs with tabs that navigate elsewhere;
  - on mobile, consider accordions.
- **Material:** tabs organise content across screens and data sets. Primary tabs sit under the app bar, secondary tabs
  inside a content area, and scrollable tabs keep some off-screen
  ([Material Components, Tabs](https://github.com/material-components/material-components-android/blob/master/docs/components/Tabs.md)).
- **A hub page** that lists every destination suits task-based use, where a visit goes down one branch. It costs one
  extra step for each move and spends space on navigation instead of content
  ([NN/g, mobile navigation patterns](https://www.nngroup.com/articles/mobile-navigation-patterns/)).

| Pattern | Fits when | Costs | Games |
|---|---|---|---|
| In-page tabs (segmented) | Four or five sibling systems, frequent switching, the same shape in each | Tabs multiply as systems are added; more than five hide | Family A |
| Hub with entries | Each system needs a full page, and a visit usually goes to one system | One more tap each way | Family B |
| System-first page | The same task repeated across many characters | Her picture is scattered; needs links back | Family C |

### 3.2 Progressive disclosure

- **Show the few most important options first, and the rest on request.** The trigger must be visible and must say what
  it reveals. More than two levels usually tests poorly
  ([NN/g, Progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/)).
- **Apple applies the same idea to layout:** hide secondary detail until asked, and keep the most-used controls on top
  ([Layout](https://developer.apple.com/design/human-interface-guidelines/layout),
  [Disclosure controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls)).
- **For the profile:** the profile is level one and a sheet is level two. A sheet that opens another sheet is a third
  level, and it also breaks the one-sheet rule in [§3.4](#34-sheets-and-pushed-pages).

### 3.3 Viewing and changing

- **A mode is a state where the same input does something different.** Modes cause slips unless the active mode is
  obvious, with at least two cues. Different views of the same data are not modes
  ([NN/g, Modes](https://www.nngroup.com/articles/modes/)).
- **The surveyed games draw the line at spending, not at editing:**
  - Equipping or swapping is a tap on the tab (Genshin, Blue Archive).
  - Spending goes through a button and a screen that shows the result, and for irreversible actions a Before/After
    ([FEH merge](https://game8.co/games/fire-emblem-heroes/archives/295530), [Genshin
    4.3](https://www.sportskeeda.com/esports/5-new-genshin-impact-4-3-features-revealed-developer-notes)†).
  - No surveyed character screen uses a global view/edit toggle (unverified as an absolute; none was found).
- **Pokémon moved small edits onto the summary** in 1.2.0 instead of keeping a read-only summary and edit menus
  elsewhere ([Nintendo Life](https://www.nintendolife.com/news/2023/02/pokemon-scarlet-and-violet-version-1-2-0-is-now-live-here-are-the-updated-patch-notes)).
- **Apple keeps modal presentation for a narrow, self-contained task** with an obvious way out, so modals don't become an
  app within the app ([Modality](https://developer.apple.com/design/human-interface-guidelines/modality)).

**For the profile:** there is no case for an edit mode. The useful split is:

| Kind of change | Examples | How it works |
|---|---|---|
| Free and reversible | Class, branch, equip, accessory family | Inline, one tap |
| Spending | Grades, jewels | One button, Now → Next, cost shown |
| One-time | The calling pick | Confirm with what changes |

### 3.4 Sheets and pushed pages

- **Bottom sheets suit short tasks tied to their context** ([NN/g, Bottom sheets](https://www.nngroup.com/articles/bottom-sheet/)):
  - not long or complex content, and not page-to-page flows;
  - never stacked;
  - always with a visible Close;
  - Back should close them.
- **Apple** ([Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)):
  - a sheet is for a scoped task;
  - only one at a time, so close the first before opening a second;
  - a medium detent lets content be disclosed progressively;
  - use a full-screen view for multistep or in-depth work.
- **Material:** modal bottom sheets replace inline menus and simple dialogs on mobile
  ([Material Components, Bottom sheets](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomSheet.md)).
- **For the profile:**
  - A node, a slot, a jewel or a family goes in a sheet.
  - A whole system (a tree, the Extra Stats map, the gear grid) goes in a tab or a page.
  - A sheet never opens a sheet.

### 3.5 Density and glanceability

- **Users scan.** In NN/g's study, compared with the promotional version, concise text scored 58% higher on measured
  usability, scannable text 47% and objective text 27%; all three together scored 124% higher
  ([NN/g, Concise, scannable, objective](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/)).
- **People read about a fifth of the words on a page**
  ([NN/g, Rewriting for brevity](https://www.nngroup.com/articles/rewriting-content-brevity/)).
- **Interaction cost** is every tap, scroll, wait and thing to remember. A key cut is to avoid making people carry facts
  from one screen to another ([NN/g, Interaction cost](https://www.nngroup.com/articles/interaction-cost-definition/)).
- **Recognition beats recall.** Show the options and keep relevant state visible across screens
  ([NN/g, Recognition and recall](https://www.nngroup.com/articles/recognition-and-recall/)).
- **Content that doesn't support the task competes with content that does**
  ([NN/g, Aesthetic and minimalist design](https://www.nngroup.com/articles/aesthetic-minimalist-design/)).
- **Apple on layout:** most important first, related things grouped, and dense rows tested at large text sizes
  ([Layout](https://developer.apple.com/design/human-interface-guidelines/layout)).
- **Icons:** few are understood everywhere, so pair them with visible labels, and don't rely on hover
  ([NN/g, Icon usability](https://www.nngroup.com/articles/icon-usability/)).
  - This qualifies today's rule "icons choose; sheets explain" ([profile-ux.md](../profile-ux.md)). Icons work for
    choices the player repeats and learns: weapons, accessory families, skill kinds. A one-off state needs a word.
- **Indicators** (badges, marks) are passive and contextual. Each one should earn its place, because too many become
  clutter ([NN/g, Indicators](https://www.nngroup.com/articles/indicators-validations-notifications/)). Apple keeps
  badges for critical information ([Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)).
  AFK Arena's 1.28 is the game version of this ([afk.guide](https://afk.guide/?p=1647)).

### 3.6 Opening in context

- **A deep link should leave a realistic back stack**, as if the user had navigated there by hand. Back then returns
  through the app's own screens ([Android, Principles of navigation](https://developer.android.com/guide/navigation/principles)).
- **Each tab keeps its own navigation state** ([Apple, Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)).
- **Games open the same character screen at the place the door implies:**
  - FGO links from party setup to the enhancement screen that is possible now
    ([notice](https://webview.fate-go.us/2025/0325_gameupdate_notice/));
  - ZZZ returns from a material's source to the upgrade ([MP1st](https://mp1st.com/?p=265411));
  - Star Rail jumps from a recommendation to its Trace ([wiki](https://honkai-star-rail.fandom.com/wiki/Version/2.2)†);
  - Pokémon opens one summary from the party, the boxes and battle, and battle shows a reduced read-only version
    ([Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Summary)†).
- **None of them builds a different character page per origin.** The difference is which tab or sub-screen opens first,
  and what Back returns to.

### 3.7 Consistent controls

- **Internal consistency:** the same patterns throughout a product, kept up with reviews and audits, because
  inconsistency builds up over time ([NN/g, Consistency and standards](https://www.nngroup.com/articles/consistency-and-standards/)).
- **One control does one kind of thing.** Segments hold the same kind of content, and action segments never mix with
  selection segments ([Apple, Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls)).
  In-page tabs never mix with tabs that navigate away ([NN/g](https://www.nngroup.com/articles/tabs-used-right/)).
- **A pane's controls act only on that pane** ([Apple, Tab views](https://developer.apple.com/design/human-interface-guidelines/tab-views)).
- **For the profile, one shape on every tab:**
  1. a summary line for the system;
  2. the system itself;
  3. a tap opens the item's sheet;
  4. the sheet has one primary action.

## 4. Anti-patterns

| Anti-pattern | Why it hurts | Source | Example in a game |
|---|---|---|---|
| **A sentence where a label and a number would do** | People scan; every extra word is skipped and slows the scan | [Apple, Writing](https://developer.apple.com/design/human-interface-guidelines/writing); [NN/g, Brevity](https://www.nngroup.com/articles/rewriting-content-brevity/); [NN/g, Concise](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/) | Star Rail made simple text the switchable default ([MP1st](https://mp1st.com/?p=267961)) |
| **A tooltip or help line that repeats the label** | Clutter with no new information | [NN/g, Tooltips](https://www.nngroup.com/articles/tooltip-guidelines/) | — |
| **Display-only tabs beside tabs that change things** | Two kinds of tab behind one control; people can't predict what a tab does | [NN/g, Tabs](https://www.nngroup.com/articles/tabs-used-right/); [Apple, Tab views](https://developer.apple.com/design/human-interface-guidelines/tab-views) | Genshin's and ZZZ's full stats are an overlay or a button, not a tab |
| **One system split across two places** | People carry facts between screens and make round trips | [NN/g, Interaction cost](https://www.nngroup.com/articles/interaction-cost-definition/) | FGO patched links from 2018 to 2025; FEH moved actions onto the profile |
| **A new tab for every new system** | Past about five, tabs hide or scroll and get missed | [Apple, Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls); [NN/g, Tabs](https://www.nngroup.com/articles/tabs-used-right/) | Wuthering Waves and Genshin added buttons inside existing tabs instead |
| **A different page per origin** | The same character looks different by route; people relearn her | [NN/g, Consistency](https://www.nngroup.com/articles/consistency-and-standards/); [Android, deep links](https://developer.android.com/guide/navigation/principles) | None of the 17 games does it |
| **Tabs that disappear depending on state** | People lose their place; better to show the tab and say why it's empty | [Apple, Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) | — |
| **A sheet on top of a sheet** | People lose track, and can't tell whether Close shuts one or all | [NN/g, Bottom sheets](https://www.nngroup.com/articles/bottom-sheet/); [Apple, Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) | — |
| **A pop-up for every step** | Interrupts a repeated task | [Apple, Modality](https://developer.apple.com/design/human-interface-guidelines/modality) | Genshin 4.3 moved before/after onto the screen ([Sportskeeda](https://www.sportskeeda.com/esports/5-new-genshin-impact-4-3-features-revealed-developer-notes)†) |
| **A badge on everything** | Marks stop meaning anything | [NN/g, Indicators](https://www.nngroup.com/articles/indicators-validations-notifications/) | AFK Arena 1.28 ([afk.guide](https://afk.guide/?p=1647)) |
| **A hidden edit mode** | Mode slips: the same tap does different things | [NN/g, Modes](https://www.nngroup.com/articles/modes/) | — |
| **Icon-only controls for rare things** | Few icons are understood without a word | [NN/g, Icon usability](https://www.nngroup.com/articles/icon-usability/) | Arknights' card budgets for labels the other way: names in the detail ([wiki.gg](https://arknights.wiki.gg/wiki/Operators_Pages_Changes)) |
| **A spend that silently destroys something** | People lose resources they didn't expect to | [Apple, Modality](https://developer.apple.com/design/human-interface-guidelines/modality) (explain what will be lost) | PriConne rank-up consumes refined gear ([TouchTapPlay](https://www.touchtapplay.com/how-to-quickly-increase-rank-in-princess-connect-re-dive/)†); FEH shows Before/After |

### 4.1 Copy: from sentence to label

The writing rules behind this table:
- Every word must earn its place.
- Describe what a thing does when it is on, and let people infer the opposite.
- Possessives that add nothing go: "Favorites", not "Your Favorites"
  ([Apple, Writing](https://developer.apple.com/design/human-interface-guidelines/writing)).
- Before keeping a line, ask whether the reader needs it to understand
  ([NN/g, Brevity](https://www.nngroup.com/articles/rewriting-content-brevity/)).

The rows below are illustrative patterns, not today's strings; [audit.md § 4](audit.md#4-copy-inventory-and-the-slop-list) lists those.

| Sentence | Label and number | The full words live in |
|---|---|---|
| This is a +1 bonus to fire damage when equipped | Fire +1 | Nowhere: the label is complete |
| She regains 13 MP at the start of every round | MP 296 · +13/round | The (i) for MP |
| You can raise this slot now because you have the item | ● G3 → G4 | The raise button's cost line |
| Grades are raised on the other tab | Raise › (a link) | — |
| Her Flourish has no effect while she is a Brawler | ★ Even pace · off (dimmed) | The template sheet |
| This node opens when you set a jewel of its grade | Needs Planet Jewel III | The node's sheet |

In this game "her" carries voice, so dropping it is a judgement call. Apple's rule only says to cut it where it adds
nothing.

## 5. What this suggests for the Uma profile

These are options, not a design. The proposal chooses.

### 5.1 What makes this game different

- **Many owned, few fighting.** Dozens to hundreds of Umas are owned, five fight, and dozens work. Most visits to a
  profile are quick: check her, raise one thing, move on. Deep build sessions are for the party's five. The roster and
  batch tools matter as much as the profile.
- **A phone and the kit's frame.** The bottom bar is the app's tab bar, so the profile's tabs are an in-page switch.
  Segmented-control rules apply: about five, nouns, one kind of content.
- **Many systems:**
  - class and its rank;
  - three trees;
  - eight gear slots (three weapons, five armor) plus the accessory and its family;
  - Extra Stats;
  - her template;
  - her trade and Craft Level;
  - Bonds and Hall seats;
  - racing aptitudes.
- **Three kinds of change:**
  - free (class, branch, equip, family);
  - spending (grades, jewels);
  - one-time (the calling pick).

### 5.2 Structure options

**Option A: a header and four system tabs (family A).**

```
┌──────────────────────────────────────────────┐
│ bust  Name · title   Lv 50   ★ template   ◎  │
│ Mage R40 · Craft 30 · Party 1      Stats ›   │  ← status row; stats open a details sheet
├──────────────────────────────────────────────┤
│  Skills │  Gear  │ Extra Stats │  About      │  ← four nouns, fixed
├──────────────────────────────────────────────┤
│ the tab's system: shows it and changes it    │
│ tap an item → its sheet → one action         │
└──────────────────────────────────────────────┘
```

**Option B: an overview hub with full pages (family B).**

```
┌──────────────────────────────────────────────┐
│ bust  Name · title   Lv 50   ★ template   ◎  │
│ Mage R40 · Craft 30 · Party 1                │
├──────────────────────────────────────────────┤
│ Skills       5/7 equipped · Lance B          ›│
│ Gear         G3–G4 · ● 2 raises ready        ›│
│ Extra Stats  8/22 open · ● 3 to set          ›│
│ Work         Mine · Copper Ore · 1h 20m      ›│  ← opens her place
│ About        template · aptitudes · Bonds    ›│
└──────────────────────────────────────────────┘
```

**Option C: A or B, plus a system-first "ready to raise" page (family C as a complement).** A roster-level page lists
every Uma with a raise or jewel ready. It steps through them with next and previous, using the same Gear and Extra Stats
components as the profile. The Stable's Can upgrade filter is its seed.

**Option D: keep adding tabs** (today plus Extra Stats as a sixth). This is the "infinite tabs" path, kept here for
comparison.

| | A: header + tabs | B: hub + pages | C: + ready page | D: more tabs |
|---|---|---|---|---|
| Taps to the common task (check her, raise one thing) | 1–2 | 2–3 | 1 per Uma, in a run | 1–2 |
| Switching between systems | One tap, in place | Back, then in | — | One tap, if the tab is visible |
| Fits a phone | Yes, at four or five tabs | Yes; each page has full room | Yes | No: over five tabs, some scroll or hide |
| Fits many Umas | With next/previous | With next/previous on each page | Best: built for runs | With next/previous |
| Consistency | One shape per tab | One shape per page | Reuses the same components | Tab shapes drift |
| Evidence | Genshin, Star Rail, ZZZ, Wuthering Waves, Blue Archive, Azur Lane | Arknights, Octopath: Champions, FEH 10.8.0 | The original game's Enhance, FGO's Enhance, NIKKE's Synchro | Against: Apple, NN/g, Wuthering Waves' and Genshin's habit of adding buttons instead |
| Risk | Tabs creep back past five | An extra tap for every system | Two ways to do the same raise (one component keeps them equal) | The owner's complaint, repeated |

### 5.3 Where each system could live

| System | Today | What games do | Options |
|---|---|---|---|
| **Battle stats** | A tab | A details overlay or button (Genshin, ZZZ), or numbers on the card (Arknights) | (a) A details sheet from the header's status row. (b) The top of an Overview page in option B. (c) A stat summary on Gear, where they change |
| **Skills** (class, trees, equipped) | A tab | A tab of its own everywhere (Star Rail Traces, Genshin Talents, ZZZ Skills) | Stays a tab or page. Inheritance stays with it (it changes fights) or moves to About |
| **Gear** (Equip and Upgrade) | A tab with two views | One tab with sub-views (Star Rail's level/Superimpose sub-tabs) or spend inline on each slot (Azur Lane, NIKKE) | (a) Keep the two views as a segmented control inside Gear. (b) One list where each slot shows its grade and its raise |
| **Extra Stats** | The Observatory, plus a summary on Gear › Upgrade | Per-character progression lives inside the hub (Star Rail Eidolons and Traces, Genshin Constellation, AFK Arena's Engrave tab). Only timed or roster-wide systems sit outside (Arknights' Training Room, NIKKE's Synchro) | (a) Its own tab or page in the profile. (b) A section of Gear, since jewels are made items like grades. Either way the Observatory becomes a door: it picks an Uma and opens her Extra Stats, or shows the same component |
| **Template** (calling, stride, knack, Flourish, signature, moon) | Header chip sheet, the Racing tab and a Flourish line on Skills | Identity in a header or Profile tab (Genshin), lore outside (Star Rail's Data Bank) | One home (the chip's sheet or About). Each piece also shows where it acts: Flourish on Skills, signature on the accessory, moon on Extra Stats |
| **Racing** (aptitudes, racing stats, racing skill) | A tab | Read-only identity: a Profile tab (Genshin) or outside (Star Rail) | Part of About, or of the template sheet. Her best aptitudes already show on the roster |
| **Work** (job, trade, Craft Level) | A tab | Jobs are managed at the workplace, and the character shows at most a status (Arknights, Blue Archive, Azur Lane, NIKKE) | The header's status row opens her place, as today. Trade and Craft Level sit in the header or About. The tab goes |
| **Bonds and Hall seats** | On Skills, under Inheritance | Bond earned outside, shown on the character (Blue Archive) | Stays with Skills, or moves to About. A Hall seat opens her profile |
| **Calling pick** | A card under the header until confirmed | One-time choices show a preview of what changes (FEH merge) | Keep the card; its confirm shows class, trade and Flourish before → after |

### 5.4 One profile, many doors

One route per tab (or page), for example `/town/stable/outfit/:id/:tab`. Each door opens the tab it implies, and Back
returns to the door ([Android's rule](https://developer.android.com/guide/navigation/principles); FGO 2025, ZZZ 1.1).
Today two of these exist: `outfit/:id` and `outfit/:id/skills`.

| Door | Opens on | Back returns to |
|---|---|---|
| The Stable's roster | The last tab used on this device | The roster, at the same scroll and filter |
| The Stable, from a green mark or the Can upgrade filter | Gear (or Extra Stats), with the ready slot's sheet open | The roster |
| The Party Hall, "View profile" | Skills | The party editor |
| The world map's party bar | Skills | The map |
| The Observatory | Extra Stats | The Observatory's picker |
| A Wilds place, a working Uma | Her status, or the last tab | The place |
| A Hall seat | Skills, at Inheritance | The hall |
| The plaza's "Profile" | The last tab | The plaza |

When the door names a tab, the door wins. When it doesn't, the remembered tab wins. That matches how Apple keeps each
section's state and how FGO picks the link that fits.

### 5.5 Moving across many Umas

- **Next and previous inside the same tab**, across the list she was opened from (Pokémon, Persona 5). That means party
  order from the Party Hall and the current sort and filter from the Stable. Raising three Umas' gear becomes three
  swipes on Gear, not three trips through the roster.
- **Batch actions on her own screen:**
  - "Raise all ready" (Genshin 4.3, Star Rail 4.4, PriConne 2021);
  - "Set all jewels" (NIKKE's one-tap upgrade);
  - the Gear sheet already has a multi-grade "Up to G6".
- **Batch actions across Umas:** option C's ready page, and presets where a role repeats (Arknights' base presets, FEH
  skill sets applied to a team).
- **Filters as a way in:** the Stable's Can upgrade filter is this game's version of Arknights' new-items filter and
  AFK Arena's recommendation page.

### 5.6 Copy

- **A label and a number on the screen.** The sentence goes in the item's sheet or the (i) ([§4.1](#41-copy-from-sentence-to-label)).
- **Skill and node text, simple by default and full in the sheet.** This is Star Rail 2.5's switch, made structural.
- **One wording per fact across tabs and sheets** ([Apple, Writing](https://developer.apple.com/design/human-interface-guidelines/writing):
  keep a shared list of terms). [audit.md § 4.2](audit.md#42-one-fact-many-wordings) counts where today's facts have
  several wordings.

### 5.7 Where the evidence leans

A reading of the research, for the proposal to accept or overrule:

1. **One profile, many doors** (P1, P5). Every surveyed game converges here, and FGO and FEH spent years patching the
   alternative. Separate pages per origin have no precedent in the survey.
2. **Four or five fixed tabs, each a system you can change** (P2, P4). Battle and Racing stop being tabs. Their facts go
   to the header, a details sheet and About.
3. **Extra Stats come into the profile** (P1). The Observatory stays as a door and a picker.
4. **Work becomes a status line** (P6). The Wilds keep the controls.
5. **Next and previous Uma, and batch raises** (P7, P8). These matter more here than in a game where one character is
   the whole team.
6. **Option A or B is the real choice.** A is fewer taps; B gives each system room and a glanceable overview. Option C
   is an add-on to either, not an alternative.

## 6. Method and limits

**How the survey was done** (2026-10-28):
- Three parallel survey passes covered the seventeen games.
- One pass read the platform and UX guidance (Apple's Human Interface Guidelines, Material Components, Android's
  navigation principles, Nielsen Norman Group).
- Patch notes and developer notes that changed a character screen were sought on purpose. They are treated as the
  strongest evidence of what annoyed players.

**Limits:**
- **Reddit could not be reached.** Nor could Fandom, Bulbapedia, Prydwen, Game UI Database and some others, which
  refused automated reading. Player feedback therefore comes from press, reviews and developer notes rather than forum
  threads. Fandom and Bulbapedia facts are marked † where only the search summary was seen.
- **The web-search budget ran out** near the end. Some details are unverified and marked so:
  - Star Rail's and Wuthering Waves' exact tab names;
  - Persona 5's full menu list;
  - for most games, whether the screen swipes to the next character and remembers the last tab.
- **Material Design's own site renders only with JavaScript.** Its component guidance is cited from Material Components'
  documentation on GitHub.
- **Spot checks.** The load-bearing claims were re-opened and confirmed at the source: FGO's 2025 notice, FEH 4.0.0 and
  10.8.0, Pokémon 1.2.0, AFK Arena 1.28, Star Rail 2.5, Arknights' skills and base changes, Blue Archive's tabs, and
  Octopath's demo feedback.
- **This page holds links only.** No images from these games are stored here, and no character, outfit, skill or
  scenario names from the original game appear.
