# uma-quest: the campaign

> **Status: 2026-11-06, the owner's direction, for review.** The owner wants uma-quest to play like a travelers RPG in
> the Octopath vein:
> - persisted towns on a world map, leading to level-suggested dungeons;
> - travelers picked from the five classes;
> - every character with her own full story;
> - every Uma in the shortlist playable from the start;
> - parties formed from a menu, whose lead decides the boss of a shared dungeon;
> - about five stories to out-level a band of content.
>
> Revised the same day at the owner's word: **each outfit is its own traveler**, 100 in all, and a character's outfits
> share her story. This page turns all of that into calls CM1–CM36. It replaces [plan.md](plan.md)'s NG2 and NG3, and its starting dungeon calls
> DN1, DN2, DN5 and DN10, and it reshapes Phases 3, 5 and 6, adding a Phase 7. We borrow the structure only: not
> Octopath's names, stories, map, job list, Path Actions, art or music.
> Visual page: [previews/campaign.html](previews/campaign.html).

## The short answer

- **The cast is 100 travelers, one for each of your selected outfits.** All of them are playable from the first minute,
  and nothing unlocks through play. Each has her own level, gear and story progress.
  - **Five Ways, exactly 20 each:** Warrior, Spellblade, Mage, Summoner, Healer.
- **A character's outfits share her story.** The 100 travelers come from 65 characters, so there are 65 stories of five
  chapters, one chapter for each band of ten levels.
  - Each outfit plays her character's story on her own progress, so 35 outfits replay a story that's already written.
  - A party is any five travelers, never two outfits of one character.
  - A chapter runs when its traveler leads.
  - A party's five chapter 1s take it through Lv 1–10 and out-level that band. Its five chapter 2s do the same for
    Lv 11–20, and so on: 25 chapters from Lv 1 to 50.
- **The world** has a Hub in the middle and five regions around it, one per Way. Each region has five zones going
  outward, one per band, and each zone has a persisted town and two dungeons: **25 towns and 50 dungeons.**
- **Stories share dungeons.** Every dungeon has its own resident boss. When the party's lead has a chapter set there, her
  chapter's boss takes the boss room instead.
- **The plots come from public-domain tales:** myths, legends, fairy tales and pre-1931 fantasy.
  - We don't use a modern RPG's stories, and we don't use Uma Musume's career scripts.
  - Her real racehorse's career gives the five beats.
  - Every line is written fresh.
  - Stories are private content and never go in git.
- **Townsfolk:** the 70 Umas whose outfits aren't in your selection.
- **Volume:** 325 chapters to write, 500 to play. They ship in **20 waves of five travelers**, one per Way, and each
  wave is a full run to Lv 50. After wave 1 the waves follow your tiers, SS, then A1, then A2, and the later waves are
  mostly replays. Wave 1 is Phases 5 and 6, and the other 19 waves are a new Phase 7.

## The numbers behind it

From your roster file (`uma-platform/content/authoring/uma-art-roster.json`, read only) and the local master release:

| | Count |
|---|---|
| Selected outfits, the travelers (SS 40, A1 40, A2 20) | **100**, exactly 20 a Way |
| Characters behind them, the stories | **65** |
| Characters with two or three selected outfits | 30, so 35 outfits replay a story |
| Characters whose outfits span two callings | 2; each outfit keeps her own Way |
| Umas with outfits but none selected, the townsfolk | **70** |
| Most parties at once (100 ÷ 5) | 20, every one able to have one of each Way |
| Chapters | 325 written (65 × 5), 500 played (100 × 5) |

## The calls

### Cast and parties

| Id | Call |
|---|---|
| CM1 | **A traveler is an outfit:** all 100 you selected, each her own Uma with her own level, gear, Way and story progress. Each is playable from the first minute; nothing unlocks through play. She joins the menu as soon as her sprites are done (DN1) |
| CM2 | **A character's outfits share her story:** it's written once (65 stories), and each of her outfits plays it on her own progress |
| CM3 | **The five Ways are the five callings, exactly 20 travelers each:** the Way of the Warrior, the Spellblade, the Mage, the Summoner and the Healer. A traveler's Way is her outfit's calling. The party menu has one tab for each Way |
| CM4 | **A party is any five travelers, never two outfits of one character,** since the stories treat them as the same Uma. Different parties can field her different outfits at once. The menu fills one of each Way by default and warns when there's no Healer, but it never forbids a mix. Up to 20 parties, every one able to have one of each Way |
| CM5 | Parties change at any town's inn, never in a dungeon or during a chapter. Travelers in no party stay at the Hub and work jobs (NG7's jobs stay) |
| CM6 | Each Uma levels on her own. An Uma below her party's average level earns double EXP until she reaches it |

### Stories

| Id | Call |
|---|---|
| CM7 | **Every traveler has her own story of five chapters.** Chapter N is suggested for band N, which is Lv 10N−9 to 10N. Stories are linear, with no branches |
| CM8 | A chapter runs only when its traveler leads the party. The quest log lists each member's next chapter with its town and suggested level |
| CM9 | **Levels are suggested, never locked.** Her chapter N+1 waits only for her chapter N |
| CM10 | **A chapter:** opening scenes in a town, then one dungeon with her chapter's boss at the bottom, then closing scenes back in town. 20–40 minutes; the slice measures it |
| CM11 | Scenes speak with the story's own cast. In the first build, the other party members stay silent: no party banter |
| CM12 | Travelers appear in each other's stories as rivals and friends, in their character's best-ranked outfit. The 70 Umas outside your selection are the townsfolk, plus a few original generic sprites |
| CM13 | **No traveler dies or is maimed in her story.** A real horse's fatal or career-ending injury becomes a trial she survives |

### Where the stories come from

| Id | Call |
|---|---|
| CM14 | **Plots come from public-domain tales** ([the catalog](#the-tale-catalog)): myths, legends, fairy tales, and fantasy published before 1931 by authors dead more than 70 years. We take the plot only and write every line fresh. Never a modern game's or book's story, and never Uma Musume's career or event scripts |
| CM15 | **Her real racehorse's career gives the beats:** chapter 1 the debut, 2 the first crown, 3 the rival, 4 the setback, 5 the legacy race. Master data has each horse's record and years; the details are checked against public racing records when her bible is written |
| CM16 | **Stories are private content** (replaces NG3). The bibles and scripts live in uma-quest's gitignored `content/` folder and ship through a private bucket `gs://uma-quest-content` with object versioning, which also keeps every published version. Git holds the script format, the tale skeletons (no Umas) and a test chapter with a stand-in cast |
| CM17 | **The script format is scenes as data:** speaker id, line, emote, camera beat, walk-to and flag changes. The speaker's portrait comes from master data's existing art beside the text box. No voices; English |
| CM18 | **Claude writes each wave's five bibles first:** each with its tale, career beats, home town, five chapter goals, rival and bosses. You read the bibles before the chapters are written, then play the chapters |

### The world

| Id | Call |
|---|---|
| CM19 | **The world map:** the Hub at the centre, and five regions around it as wedges, one per Way. Each region has five zones running outward, one per band |
| CM20 | **Each zone has one town and two dungeons,** in one biome. That makes 25 towns and 50 dungeons, ten dungeons a band, so DN21's pairing with the ten weapon kinds holds in every band. The five zones of a band are five different biomes |
| CM21 | **Towns are built by hand from kits, and they're permanent places.** A chapter stages what it needs while it plays (a broken bridge, who stands where) and leaves no lasting change. So chapters can be played in any order, and an outfit replaying her character's story finds the town as the story expects |
| CM22 | **Each town has** an inn (rest, party changes), a shop (consumables, gear), townsfolk and the chapters that start there. The Hub is a town too, and adds the jobs, the workbench and storage |
| CM23 | Chapter 1 starts in her Way's inner town. Later chapters go wherever her story goes, so a party's five chapter 1s tour all five regions |
| CM24 | **The world map is a screen, not a walked field.** Tap a town or dungeon next to one you've reached to travel there; places you've reached are one tap away. Fights happen in dungeons |

### Dungeons and bosses

| Id | Call |
|---|---|
| CM25 | **A band's ten dungeons are suggested at one level each**, covering all ten of its levels. A zone's two are an easier and a harder one: in band 1 the Warrior zone has Lv 1 and 6, the Spellblade zone Lv 2 and 7, and so on |
| CM26 | **Every dungeon has a resident boss.** When the lead's chapter is set there, her chapter's boss takes the boss room for that run. The drops are the dungeon's either way (DN21) |
| CM27 | **Each chapter has its own boss,** 325 in all, each with its own name, skills, fight script and colours. About half are rival Umas, other travelers with their escorts, on their own sprites. The other half are monsters built on a shared bestiary of about six large bodies a band |
| CM28 | **A rival can't fight her own party.** While any of the rival's outfits travels with the lead, the chapter waits, and the quest log says who has to leave. As a boss she wears her best-ranked outfit |
| CM29 | **Five dungeons are made by hand,** one in each region's outer zone (DN5). The other 45 are generated (DN6) |

### Growth

| Id | Call |
|---|---|
| CM30 | **The out-level rule** (replaces DN10): a party's five chapter Ns and their dungeons take it through band N, about two levels a chapter. After all five it is past the band's hardest dungeon and ready for chapter N+1. Phase 4 sets the curve from the slice's numbers |
| CM31 | **A full run is 25 chapters, from Lv 1 to 50.** Each new party walks the same 50 dungeons, meeting its own leads' bosses |

### Production

| Id | Call |
|---|---|
| CM32 | **Stories ship in waves of five travelers,** one per Way, each a full run of 25 chapters: 20 waves. A wave writes only the characters not yet written. After wave 1 the waves follow your tiers: waves 2–8 are the SS outfits (35 new stories), 9–16 the A1 outfits (17 new), 17–20 the A2 outfits (8 new) |
| CM33 | **Wave 1, by default:** Warrior 106801 and Summoner 100703, the two Umas Q3 draws, then the first SS of the other three callings in your roster file: Spellblade 113301, Mage 112901 and Healer 111801. Swap any of them by saying so |
| CM34 | **Q3 draws the Summoner in outfit 100703,** her one selected outfit (A1). H168 named 100701, which you tiered F |
| CM35 | **The plan changes** ([plan.md](plan.md)): Phase 3 adds a town and the story runner as Q12, and the measured play becomes Q13. Phase 5 becomes band 1 with wave 1's chapter 1s, Phase 6 bands 2–5 with wave 1's chapters 2–5, and a new Phase 7 runs waves 2–20. Q2 adds the stories bucket |
| CM36 | **Only the structure comes from Octopath:** travelers, chapters, towns and suggested levels. Not its names, stories, map, job list, Path Actions, art or music |

## How a chapter plays

1. **In a town**, the party's lead has a chapter waiting (the quest log shows it with its suggested level). Talking to its
   marker starts the opening scenes.
2. **The scenes** play on the town's stage: the speakers walk, emote and talk, with portraits by the text box.
3. **The party travels** on the world map to the chapter's dungeon.
4. **The dungeon** plays as in the DN calls: random battles, Springs, waystones, HP carried.
5. **The boss room** holds her chapter's boss: a rival Uma with escorts, or a monster with its own fight script. The
   dungeon's resident boss is there on any other run.
6. **The closing scenes** play back in town. Story flags change the town, and her next chapter appears in the next band.

## The five beats

Each story fits a public-domain tale's shape over her real career:

| Chapter | Band | From her career | From the tale |
|---|---|---|---|
| 1 | Lv 1–10 | The debut | The call: she leaves home |
| 2 | Lv 11–20 | The first crown | The first great deed |
| 3 | Lv 21–30 | The rival | The rival met, or the friend turned rival |
| 4 | Lv 31–40 | The setback | The fall: an injury, a defeat, a curse |
| 5 | Lv 41–50 | The legacy race | The return and the last deed |

For example, take a career of three broken legs and a comeback win after a year away, set over *Ivanhoe*:

1. The squire's first tournament.
2. The crown at the great joust.
3. The rival knight.
4. Struck down, and sent into exile.
5. She returns in disguise and wins the last tournament.

## The tale catalog

We use these plots only. Each source is anonymous and old, or by an author who died more than 70 years ago, and was
published before 1931. Translations made after 1930 are never quoted.

| Family | Tale | Source | Shape | Fits a career of… |
|---|---|---|---|---|
| Return | The Odyssey | Homer, c. 8th c. BC | The long way home, then winning back her place | A comeback after a long absence |
| Return | Ivanhoe | Walter Scott, 1819 | A disinherited knight returns in disguise and wins the tournament | The comeback win |
| Rise | Dick Whittington | English folk tale, 1605 | A poor country youth goes to the capital and rises | A local-track star who conquers the centre |
| Rise | Issun-bōshi | Otogizōshi, 17th c. | The tiny one goes to the capital and beats an oni | The small Uma no one believed in |
| Rise | The Ugly Duckling | H. C. Andersen, 1843 | The overlooked one finds she's a swan | The late bloomer |
| Rivalry | The Song of Roland | c. 1100 | Two sworn companions, one brave and one wise, at the pass | A lifelong rival and friend |
| Rivalry | Sir Gawain and the Green Knight | Late 14th c. | A challenge accepted, and answered a year later | A rematch a year on |
| Rivalry | The race across the Uji River | The Tale of the Heike, 13th c. | Two warriors race their horses to be first across | A famous head-to-head |
| Journey | Journey to the West | Wu Cheng'en, 1592 | A long pilgrimage with odd companions and 81 trials | The stayer, the long campaign |
| Journey | The Voyages of Sinbad | One Thousand and One Nights | Seven voyages, seven returns | An Uma who raced abroad |
| Journey | The Argonauts | Apollonius of Rhodes, 3rd c. BC | A crew sails for the Golden Fleece | An expedition overseas |
| Journey | The Wonderful Wizard of Oz | L. Frank Baum, 1900 | A road of companions who each lack something | Found family |
| Journey | The Well at the World's End | William Morris, 1896 | A youngest child's long quest for the well | The long-distance dreamer |
| Journey | The Snow Queen | H. C. Andersen, 1844 | Seven stories on the road to bring a friend back | Running for a friend |
| Trickster | Reynard the Fox | 12th–13th c. | The trickster who out-talks kings | The eccentric genius |
| Trickster | Puss in Boots | Charles Perrault, 1697 | Wit wins a kingdom | The showman |
| Burden | The Six Swans | Brothers Grimm, 1812 | Silent years of work to break a curse | The Uma cast as the villain for beating a favourite |
| Burden | Tristan and Iseult | 12th c. | Loyalty torn between two crowns | Torn between her stable and her heart |
| Burden | The Water of Life | Brothers Grimm, 1812 | Three siblings ride for a cure; the kind one succeeds | Running for someone else |
| Crown | Le Morte d'Arthur | Thomas Malory, 1485 | The rightful ruler draws the sword, then must hold the realm | The dominant champion |
| Crown | Rostam's Seven Labours | Ferdowsi, Shahnameh, c. 1010 | Seven trials on one road | A run of great wins |
| Speed | Atalanta | Ovid, Metamorphoses, 8 AD | The fastest runner, who races every suitor | The front-runner |
| Speed | Rhiannon | The Mabinogion, Guest's translation, 1838–45 | The rider no one can catch, however they chase | The untouchable leader |
| Speed | The Curse of Macha | The Ulster Cycle | She races the king's horses and wins, at a price | The race run through pain |
| Speed | The Tortoise and the Hare | Aesop | Steady beats fast | The late closer |
| House | The Völsunga saga | 13th c. | A great line, a reforged sword, a dragon | The daughter of a famous family |
| Trial | The Tale of the Bamboo Cutter | 10th c. | Five impossible tasks | Five chapters, five trials |
| Trial | The Golden Bird | Brothers Grimm, 1812 | A quest with a fox whose advice she keeps ignoring | The stubborn one |

Several travelers can share a tale family. No two use the same tale.

## The volume

| | A wave | The full cast |
|---|---|---|
| Story bibles | 5 or fewer | 65 |
| Chapters written | up to 25 | 325 |
| Chapters played | 25 | 500 |
| Words, at about 2,000 a chapter (the slice checks it) | up to ~50,000 | ~650,000 |
| Chapter bosses | up to 25 | 325 |
| Resident bosses | the band's dungeons | 50 |
| Towns, plus the Hub | the band's 5 | 25 |

| Art (ChatGPT's) | Count | What it is |
|---|---|---|
| Traveler sprites | 100, in your tier order: SS, A1, A2 | The full fight set and walking, about 110 frames each ([animation-spec.md](../sprites/animation-spec.md)) |
| Townsfolk sprites | 70 Umas, plus about 10 original generic sprites | Idle and walking only, roughly a third of a fighter's frames |
| Bestiary | About 30 large boss bodies, plus each biome's common foes | Bosses share bodies; colours and skills make each one its own |
| Kits | 11 biome kits and 5 town kits, one per region's style | 2D art built into 3D by code (DN28) |
| Portraits | None new | Master data's existing portraits |

## What changes in the plan

[plan.md](plan.md) is updated with these:

| Was | Now |
|---|---|
| NG2: several parties on quest lines; Umas join through the story; four lines first | CM1–CM13 and CM32: 100 travelers all playable from the start, a character's outfits sharing her story, shipped in waves |
| NG3: story scripts in git, naming Umas by id | CM16: stories are private content in a bucket; git holds the format and a stand-in chapter |
| NG7: quest → dungeon → fight | Town → chapter → dungeon → the lead's boss; jobs and consumables stay |
| DN1: parties from the 100 outfits | CM1, CM2: the 100 outfits are the travelers; a character's outfits share her story |
| DN2: ten dungeons a continent, one biome over ten levels | CM19, CM20, CM25: 25 zones, ten dungeons a band, one suggested level each |
| DN5: capitals are the hand-made dungeons | CM29: one hand-made dungeon in each region's outer zone |
| DN10: one walk takes a party through a dungeon's ten levels | CM30: five chapters a band, about two levels a chapter |
| Phase 3: Q8–Q12 | Adds Q12, a town and the story runner; the measured play becomes Q13 |
| Phase 5: the first chapter, four quest lines | Band 1, wave 1's chapter 1s, the party menu, the inner towns |
| Phase 6: chapters 2–5 | Bands 2–5 and wave 1's chapters 2–5 |
| — | Phase 7: waves 2–20 |

Phases 0–2 stay as they are, apart from Q5's world builder also building towns, and Q2 adding the private stories
bucket ($0: it shares the free 5 GB).
