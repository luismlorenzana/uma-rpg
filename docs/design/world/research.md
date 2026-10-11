# How other games do it

> **Status: research for the [world map proposal](README.md), 2026-10-10.** From general knowledge of these games plus
> a few sources (linked). Details of live games change; what matters here is the pattern each one shows.

## The pattern we want

A big map of themed areas, many short stages per area, a party you can change freely, and areas that push you toward
different parties through their enemies. Several well-known games do pieces of this.

| Game | World structure | Stages | Party | Variety levers | What we take |
|---|---|---|---|---|---|
| **Summoners War** | A world map of themed scenario areas: forests, volcano, ice mountain, ruins, desert | Twenty areas, each with six stages plus a seventh with a boss; every stage is **three rounds** of monsters; Normal, Hard and Hell versions ([wiki](https://summonerswar.fandom.com/wiki/Scenario)) | Any team, any time | Each area leans to some elements ([guide](https://www.ludo.guide/guide/summoners-war/walkthrough/world-map-scenario-stages-overview)); one area became the classic EXP farm ([guide](https://playerassist.com/newbie-summoners-war-general-leveling-guide/)) | **Stage = up to three waves**; a region ends in a boss stage; some regions become favorite farms, and that's fine |
| **Final Fantasy Record Keeper** | One "realm" per Final Fantasy game, each a set of dungeons of several stages | Hundreds over its life, added in events | Any team; characters get a boost in their **home realm's** stages ([TV Tropes](https://www.tvtropes.org/pmwiki/pmwiki.php/VideoGame/FinalFantasyRecordKeeper)) | The realm sets the enemies and their look | **Franchise realms** ([themes.md](themes.md)) and the **home ground** bonus |
| **Pokémon** | Routes and areas, each with its own wild encounters; gyms built around one type | Dozens of areas | Six of your choice, swapped any time | Type-themed areas and trainers; teams of 1–6 foes | **Biome-locked rosters**; type pressure makes you rotate who you bring |
| **Octopath Traveler (I, II)** | Regions with a recommended danger level | Many small areas | II lets you change the party in town | Shields and breaks (our engine's ancestor); groups from one large foe to several small ones | **Level windows per region**; **solo elites with big shields** next to small groups |
| **Kingdom Hearts** | Worlds, each from a different franchise (Disney films) | A few areas per world | Fixed | Each world's own enemies, look and rules | A precedent for **franchise regions** inside one game |
| **Etrian Odyssey** | A labyrinth in strata, each stratum a biome of several floors | 20–30 floors | Free, from a guild roster | Biome sets the enemies; visible elite foes you can avoid | **Biome bands** and **elite stages** you can skip and come back to |
| **Dragon Quest** (and *Monsters*) | Regions with their own monster lists | — | — | The same monster in new colors with new spells | **Recolored families**: one sprite per family, one palette per element |
| **Brave Frontier** | Lands of Grand Gaia, each a set of quest zones, opening in sequence ([wiki](https://bravefrontierglobal.fandom.com/wiki/Quests)) | Hundreds | Free | Land-specific bosses | **Continents as lands**, each with its own identity |
| **Minecraft** | Biomes placed by temperature and humidity | — | — | Biome sets terrain and mobs | **Biomes from axes**: heat, storm and aura pick a region's elements ([regions.md](regions.md)) |

## What the pattern says

1. **Many short stages beat few long ones** on a phone. Summoners War's three-round stage is the right size: a minute
   or two, with a little attrition.
2. **Areas need a personality you can read at a glance.** Every game above signals what lives in an area through its
   look (biome) and a short enemy list. Players then build teams for areas, which is exactly the mix-and-match you
   want.
3. **Free parties need content that meets them.** Games with free teams solve repetition one of two ways: lots of
   content at every level (Summoners War's twenty areas × three difficulties), or catch-up rules that make old content
   useful to new characters. We do both: level windows with scaling, and the existing EXP gap bonus.
4. **Elites and swarms are the cheapest variety.** One big foe with many shields plays nothing like eight small ones,
   and it needs no new art.
5. **Recoloring is a classic, respectable shortcut** (Dragon Quest, Pokémon's regional forms): one shape, many
   palettes. It fits the lean-art rule.
6. **Franchise worlds work when each keeps its own flavor inside shared rules** (Kingdom Hearts, Record Keeper). Our
   five elements map well onto other franchises' common elements, so franchise realms wouldn't need new battle rules.

## What we don't copy

- **Stamina or energy timers**: uma-rpg has no paywall to pace; the jobs already pace the day.
- **Hard and Hell copies of every stage**: level windows plus scaling give fresh fights without tripling the map.
  A later "hard" variant could still come back as a challenge tier.
- **Daily rotating dungeons**: they suit live-service games, not a personal one.
