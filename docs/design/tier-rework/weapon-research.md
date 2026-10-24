# Weapon progression: research note

> **2026-10-24. Input to weapon-progression.md (step 3.2). Nothing here is built or decided.** The WR rows (§7) are
> recommendations for that doc. Context: [class-progression §3.5](class-progression.md#35-what-grows-on-her-three-weapons-tier-by-tier-cp33)
> (CP33), the first round's forms ([gear §4–§6](gear.md#41-weapons-the-first-fork)), [combat](../../game/combat.md#damage).
>
> **The owner's position:** Prism (three kinds on one weapon) is dropped, because it "could trivialize the weakness
> concept". The classes already split by shape (multi-hit, single target, area), so a weapon that adds more of the same
> shape makes little sense. The Dual angle is the one to grow in later tiers.

## 1. The answer

**Weapons grow only on the damage-kind axis, in two directions and no third.** At Tier 2's G5 each weapon becomes
**Pure** (one kind, weak hits ×1.5) or **Dual** (a second kind **of its own channel**, weak ×1.3). Pure is today's
"Specialized", renamed so it can't be read as a hit shape. The limit is set per Uma as well as per weapon: **her
slots hold one Dual in Tier 2 and two in Tier 3. The Brawler and the Mage keep one for good**, so no Uma ever holds all
five kinds of a channel. Tier 3 deepens instead of stacking: Pure → **Keen** (×1.7) or **Tempered** (a second kind,
both ×1.5), and Dual → **Tempered**. Tier 1 stays a straight G0 → G10 line. One number shows it doesn't trivialize.
With best picks, the default party answers a Tier 2 regular **2.0** times and a Tier 3 regular **2.3** times, against
**2.5** in Tier 1. Breadth grows as fast as foe weaknesses narrow, and never past Tier 1. Every turn-based game surveyed
keeps the thing that carries a weakness type single-typed, and gets breadth from carrying several of them. Where types
stack, the value is split, or the "hit anything" option gives up the weakness bonus.

## 2. Who owns what

**Classes and trees own HOW she hits; weapons own WHAT she hits with.**

| System | Owns | Never |
|---|---|---|
| **Class** | The channel split (Arms slots 3 · 0 · 2 · 1 · 2 · 1), the hand, the act's shape (the Spell Blade's extra hit, the Summoner's farewell, the healers' half hand), Limit power; the class branch (Tier 2), the mastery (Tier 3) | A kind |
| **Skill trees** | Each weapon's shape for her class: reach, hits, statuses, support, Break tips (CP15, CP19) | A kind (CP17) |
| **Weapons** | **Which kinds** she hits with (one; then two on one or two weapons), **how hard a weak hit lands** (×1.3 → ×1.5 → ×1.7), Might by grade × tier (SB1) | Shape, Breaks, the lock rule, a channel change |
| **Extra Stats** (Halo), **Orb** | Flat offense on one or two kinds she picks, on every hit of that kind, bound at +68 × tier together (X7) | A kind for weaknesses |
| **Uma Templates** | Affinity +6% on one twin set's hits (CP36); Flourish; signature tip | A kind |
| **Limit Breaks** (halls) | Reach to kinds outside her weapons, once a gauge (C3, §8.1) | — |

## 3. What other games do

| Game | Mechanism | Lesson for uma-rpg |
|---|---|---|
| **Octopath Traveler I, II** | Weakness types are weapon types and elements. Each weak hit takes a shield point; a Break skips turns and raises damage taken; Boost adds hits. A weapon is one type and a stat line. Breadth comes from a traveler's weapon types plus a secondary job; elements come from skills and items. Some bosses reshuffle weaknesses by phase | The proven core is single-typed weapons, with breadth from what she carries. Octopath keeps high coverage interesting with tempo (Boost, Break timing). uma-rpg has visible weaknesses and Auto, so coverage itself must stay scarce |
| **Fire Emblem** (series, Heroes, Engage) | One type a weapon; ranks gate which weapons a unit wields. The triangle and effective weapons (bows on fliers) reward the matchup, often with a drawback. Heroes' refines pick one upgrade per weapon, redone at a cost. Engage turns triangle advantage into a Break (no counter) | Depth on a matchup is a multiplier (Pure). One committed upgrade per weapon, re-pickable, is G5 plus re-forging (GE13). Types stay single |
| **Monster Hunter** | Upgrade trees branch from base lines into monster weapons, most with one element; hunters bring the right weapon per monster. Two-type dual blades split the value between the blades. Wilds' crafted weapons take their element from matching parts | Branch once and commit. A two-type item pays each type at a discount. Breadth means owning several weapons and swapping, which uma-rpg's free swaps already allow |
| **Bravely Default; FF V** | The job sets weapon aptitude (how well, not which type). The Spell Fencer (FFV: the Mystic Knight) puts an element on her weapon for several turns, for MP | Temporary reach belongs to a job's action. uma-rpg has it already as Limit Breaks, once a gauge, so weapons needn't imbue |
| **Granblue Fantasy** | Every foe, ally and weapon has one element. Fighting on-element gives a large damage bonus and cuts damage taken. Players build a full weapon grid per element | Deep specialization works where per-fight builds are expected, as in the Rift's guided builds (CP7). It is costly, so it suits depth, not breadth |
| **Genshin Impact** | The element is the character's; a weapon is a type, stats and a passive. Infusions come from character skills (a field that turns melee hits Cryo) | Whoever owns the element, the other side stays a stat line. uma-rpg puts kinds on weapons (GE4), so classes and templates must never add one |
| **Xenoblade Chronicles 2** | A Driver carries three Blades, each with one element and one weapon class. Switching Blades in battle chains elemental combos. The Break → Topple → Launch → Smash chain belongs to roles | Three single-element slots are enough for a deep system. The Break chain is the role's, not the element carrier's |
| **Persona, SMT** | Affinities belong to the persona or demon, and a weak hit earns an extra turn. Almighty goes through every affinity but never hits weak. Boost and Amp passives deepen one element | An "any kind" option must give up the weakness payoff. Depth on one kind is a passive that sits beside breadth |
| **Etrian Odyssey** | Support classes put an element on an ally's attacks for a few turns (the Sovereign's Arms skills, in Etrian Mystery Dungeon). Landsknecht chasers follow up allies' elemental hits | Elemental reach is a party role. uma-rpg's healers already do this: Hex makes a foe weak to Light and Dark |
| **Path of Exile** | Conversion replaces one damage type with another; "gained as extra" keeps the original and adds a type. PoE1 forced a one-way conversion order | There are two models: replace (conversion) or add (Dual). Adding needs explicit caps. Replacing is pointless when weapons swap freely. Both are too heavy for a phone game |
| **Sea of Stars** | Enemy casts carry locks by damage type: break some to weaken the cast, all to cancel it. Each character has fixed types; a combat resource adds her element to one attack | This is the charged-move lock puzzle. Keep lock reach scarce and a party job. A branch that lets one Uma break every lock kills the puzzle |

**What they agree on:**
- **One type per carrier; breadth from carrying several.** Prism-like stacking shows up only in loot-number games (PoE)
  or with the value split (Monster Hunter's dual blades).
- **Universal or temporary reach costs something:** an action and MP, a gauge, or the weakness bonus itself. In
  uma-rpg that is the Limit Breaks.
- **Depth on one type is a multiplier:** Boost and Amp, the triangle, on-element. In uma-rpg that is Pure.
- **Upgrade trees commit once, with a paid re-pick:** Monster Hunter's trees, Heroes' refines. In uma-rpg that is G5
  plus re-forging.

## 4. The options

Judged on the default party: Brawler, Mage, Spell Blade, Summoner and Cleric, on the owner's defaults (CP3). Tier 2
regulars are weak to one kind of their Tier 1 twin set, chosen by role (CP6).

| Option | What it is | Trivializes weaknesses? | Duplicates a class's shape? | Bounded T1–T3? | Fits 3 slots and SB1? | Verdict |
|---|---|---|---|---|---|---|
| **Dual, own channel, capped** | Adds a kind of its own channel. One Dual in her slots (T2), two (T3), the Brawler and the Mage one | **No:** 2.0 (T2) and 2.3 (T3) answers a regular, against 2.5 in Tier 1; a channel is never complete | No | **Yes:** an Uma holds 4 kinds, then 5 at most | **Yes.** The extra kind counts in every class, so GE7's class check retires | **Recommended** |
| **Pure** (kind depth; was "Specialized") | Its weak hits ×1.5, then ×1.7 | **No:** a deeper payoff, no new answers | No, though "Specialized" reads as shape, hence the rename | **Yes:** a weak hit never above ×1.7 | **Yes:** a multiplier keeps its share at every tier (SB1-neutral) | **Recommended** |
| Dual, free (first round, GE7) | Adds any kind her class wields | **Yes,** uncapped. Three Duals put all five kinds of a channel on a Brawler or Mage, who then answers every boss; ≈2.8 answers a regular | No | No: 6 kinds an Uma by Tier 2 | A shared weapon counts differently by class ("Fire: not as a Brawler") | No |
| Dual, twin only | Adds its own twin (Greatsword + Fire) | No. It never adds a twin set, so it stays at 2.4, Tier 1's count by construction | No, but it copies the hybrids' twin-holding, which is a class job | Yes | Under GE7 it does nothing for the Brawler and the Mage. Counting it for them breaks "Brawler physical only", and it rules out the owner's Fire + Dark | Runner-up |
| Dual, own channel, no count cap | As recommended, with every weapon allowed to be Dual | Partly: 2.67 even when the Brawler and the Mage are held to four kinds. Without that limit a pure class completes her channel with two Duals (≈2.8) | No | Weak | Yes | No |
| Dual, weaker second kind | The second kind pays less, or doesn't chip (Monster Hunter's split) | Less | No | Yes | It splits "weak" into two meanings; today a weak hit always chips | No |
| Conversion | The weapon's kind changes, e.g. to its twin | No: still one kind | No, but it unhooks a tree's shape from its kind (the owner's "small variety") | Yes | A free swap does the same, since she owns all ten. Crossing channels breaks the 70/30 | No |
| Attunement | A second kind picked per fight or per front | **Yes:** weaknesses show on the card before the fight | No | Per weapon only | Adds a step before every fight | No |
| Imbues | A consumable or per-fight kind | **Yes,** while stocked | No; an in-fight imbue is an act, which is a class skill's job | Needs an item line and caps | A new Forge line, and it duplicates the Limit Breaks' reach | No |
| Break-centric | Its weak hits chip one more point | Speeds Breaks for anyone | **Yes:** the trees' Break tip, the Spell Blade's extra hit, the Blademaster | Under E6's cap | Yes | No: Breaks keep one home |
| Lock-centric | Its hits break two locks, or its twin's locks too | One Uma cancels charged moves alone | Partly: "more from one weak hit" is the Breaker status's job | Yes | Yes, but narrow (charged moves only) | No |
| Executioner | More damage on a Broken foe | No | **Yes:** the Warlord's passive, Katana and Light D5, the Brawler's mastery | Yes | Yes | No: off the kind axis |
| Bane (Fire Emblem's "effective") | Weak hits against a foe element or role | Like a Dual | No | Needs caps | Harder to read than a second kind icon | No: a Dual by another name |
| No branches | Weapons are Might lines; breadth from slots, swaps, Limit Breaks | No | No | Yes | Yes | **Fallback.** It leaves the Tier 2–3 narrowing unanswered and drops the owner's multi-type weapons |
| Prism | Three kinds | Yes (owner) | No | No | — | Dropped by the owner |

**The numbers behind "trivializes".** The best picks fill the kinds the party holds least.

| Build | Answers a regular foe (party) | Bosses the Brawler answers |
|---|---|---|
| Tier 1, defaults (CP4) | 2.47 | 66% |
| Tiers 2–3, no branches | 1.47 | 66% |
| **Recommended, Tier 2:** one Dual each | **2.0** | 86% |
| **Recommended, Tier 3:** two for the four between | **2.34** | 86% |
| Twin only, counted in every class | 2.43 | 66% |
| Own channel, no count cap, never all five of a channel | 2.67 | 86% |
| Free Dual, or own channel with no caps at all | ≈2.8 | 100% |

Assumptions: the 48 signatures are weighted as in CP5. Half of each twin set's regulars are weak to its Arm (by role).
Twilight regulars split between Bow and Katana. A member answers a foe once. Regions lean (7 Arm-weak biomes, 5
element-weak), so per-region figures differ; the simulation runs them per region.

## 5. The recommended tier shape

```text
Tier 1  Base ── G1 … G10                                one kind · weak ×1.3
                                                        (branch carries, grades reset)
Tier 2  Base ── G1 … G4 ── G5 ─┬─ Pure ── G6 … G10      one kind · weak ×1.5
                               └─ Dual ── G6 … G10      + a kind of its channel · weak ×1.3
                                                        [her slots: one Dual]
Tier 3  Pure ── G1 … G4 ── G5 ─┬─ Keen ──── … G10       one kind · weak ×1.7
                               └─ Tempered ─ … G10      + a kind of its channel · both ×1.5
        Dual ── G1 … G4 ── G5 ─── Tempered ─ … G10      its two kinds · both ×1.5
        Base ── G1 … G4 ── G5 ─┬─ Pure / Dual           the Tier 2 step, a tier late
                                                        [her slots: two two-kind weapons;
                                                         Brawler and Mage: one]
```

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Foes weak to** (CP6) | Twins: 2 | Regulars 1; sub-bosses, bosses 2 | Regulars, sub-bosses 1; bosses 2 |
| **Kinds an Uma, at most** | 3 | 4 | Brawler, Mage 4 (two Keen); the four between 5 |
| **A weak hit, at most** | ×1.3 | ×1.5 | ×1.7 |
| **Answers a regular** (party, best picks) | 2.47 | 2.0 | 2.34 |
| **Example: Brawler** | Greatsword, Axe, Lance | Pure Greatsword, **Dual Axe + Katana**, Pure Lance | Keen Greatsword, Tempered Axe + Katana, Keen Lance |
| **Example: Spell Blade** | Katana, Lance, Thunder | **Dual Katana + Bow**, Pure Lance, Pure Thunder | Tempered Katana + Bow, Keen Lance, **Tempered Thunder + Fire** |

**What Tier 3 deepens instead of stacking:** the weak multiplier on every weapon (×1.5 → ×1.7 or ×1.5 on two kinds),
plus, for the four between only, a second two-kind weapon. That second Dual answers Tier 3's own narrowing (sub-bosses
drop to one kind). No weapon ever holds three kinds, and no Uma ever holds a whole channel. The rules carried over
from the first round still apply. The hit keeps its channel, offense and tree. A weak hit removes one shield point and
breaks one lock, whichever of its kinds matched. No branch touches Breaks. Another fork gem re-forges, and the grade
stays (GE13).

## 6. Risks

1. **Dual outvalues Pure.** A second kind buys chips, locks and ×1.3 on new foes; Pure buys +15% on weak hits she
   already lands. The cap forces a mix, two or three Pure weapons per Uma. The simulation prices the pair at equal
   worth in context: Dual for the campaign's mixed waves, Pure for the Rift's planned fronts.
2. **Bosses.** A pure class with one Dual answers 86% of bosses, against 66% in Tier 1. She still breaks only her own
   channel's locks. README §9.5 item 3 ("no single Uma Breaks a Duel boss in one act") must re-run with Duals.
3. **The kind-focus stack.** Keen ×1.7, Orb, Halo and affinity can all sit on one kind. The bounds: a weak hit
   at most ×1.7; Orb + Halo at most +68 × tier; the affinity sits outside the weak multiplier. Simulate the full stack.
4. **The cap is a loadout rule.** The Gear tab must explain a blocked slot ("One two-kind weapon in her slots in Tier
   2"). Owning several Duals and swapping between fights is allowed: breadth across fights costs gems, as owning more
   weapons does today.
5. **The drafts already drawn break it.** class-progression §3.5's Brawler (Dual Axe + Katana, Dual Lance + Bow) holds
   all five Arms in Tier 2, which is the Prism problem one tier early. The templates page draws cross-channel Duals (a
   Spell Blade's Katana + Dark). Both are redrawn with weapon-progression.md.
6. **Own-channel reverses a first-round row.** GE7's cross-channel case and CP12's "any of the ten" column change.
   The change is small, but the owner should see it named.
7. **Outside this doc:** the owner's "a multi-hit class with more multi-hit" also describes the Spell Blade's tree
   branch B (Flurry: one more hit). That one is class-progression's to revisit.

## 7. Decisions for weapon-progression.md

| Call | Recommendation | Alternatives | Why |
|---|---|---|---|
| **WR1** Who owns what | Weapons own which kinds she hits with and how hard a weak hit lands. Classes own the channel split and the act's shape. Trees own each weapon's shape and the Break tips. The Orb, the Halo and the template add offense or a % on a kind, never a kind (§2) | Weapons with shape effects (weapon arts, E1) | The owner's line. No two systems grow the same thing |
| **WR2** Two branches, no third | Tier 2's G5: **Pure** (renamed from Specialized) or **Dual**. No third branch | A third from §4 (Executioner, Break, lock, attunement, conversion, imbue) | The kind axis has two directions: more kinds, or harder weak hits. Every third candidate duplicates a tree or class job, or trivializes |
| **WR3** A Dual's second kind | **Of the weapon's own channel:** an Arm adds an Arm, a Tome an element. It counts in every class that slots the weapon; the hit keeps its channel | GE7 as drafted (any kind, counted by class); twin only | The class keeps the channel split (its Arms count). A shared weapon reads the same in every class. The owner's Fire + Dark fits |
| **WR4** Two-kind weapons in her slots | **Tier 2 one; Tier 3 two; the Brawler and the Mage one for good** (never all five kinds of a channel). Her slotted kinds are all different | No count cap (2.7–2.8 answers, and a pure class completes her channel); one in every tier | Breadth grows as weaknesses narrow and never past Tier 1's answers. It matches the owner's "expand the Dual in later tiers" |
| **WR5** Tier 3 deepens | At Tier 3's G5, Pure → **Keen** (×1.7) or **Tempered** (+ a kind of its channel, both ×1.5, within WR4); Dual → Tempered. A weapon that never branched takes the Tier 2 step late. A weak hit is at most ×1.7. Branches carry and grades reset (GE14). Fork gems: Pure, Dual, Keen, Tempered; the Prism Gem retires; still three a tier per Uma | A third kind per weapon (Prism, dropped); no Tier 3 step | Depth by multiplier is SB1-neutral and touches no other system |
| **WR6** The check | A script beside CP4's: with best picks, the default party's answers per regular stay at or below Tier 1's in every tier (draft 2.0 and 2.34 against 2.47), and no Uma Breaks a Duel boss alone. If the simulation finds Dual too strong, the fallbacks in order: Tier 3 back to one Dual, then Dual from Tier 3 only, then no branches | Price by feel | One number makes "trivializes" measurable before any fight |

## Sources

Summarized in our own words, with the well-known mechanics from general knowledge.
[Octopath battle system (Gamer Guides)](https://www.gamerguides.com/octopath-traveler/guide/introduction/game-mechanics/battle-system) ·
[Octopath Traveler 2 combat (Vulkk)](https://vulkk.com/2023/02/24/how-combat-works-in-octopath-traveler-2-beginners-guide/) ·
[Fire Emblem Heroes weapon refinery (FEH Wiki)](https://feheroes.fandom.com/wiki/Weapon_Refinery) ·
[Fire Emblem Engage's Break (TechRaptor)](https://techraptor.net/gaming/news/new-fire-emblem-engage-break-mechanic-stops-counter-attacks) ·
[Effective weapons (LP Archive, Radiant Dawn)](https://lparchive.org/Fire-Emblem-Radiant-Dawn/Update%2007) ·
[Monster Hunter World dual blades (Steam discussion)](https://steamcommunity.com/app/582010/discussions/0/3047234112545400057) ·
[Monster Hunter Wilds Artian weapons (Deltia's Gaming)](https://deltiasgaming.com/?p=146289) ·
[Spell Fencer (Bravely Default Wiki)](https://bravelydefault.fandom.com/wiki/Spell_Fencer_(Bravely_Default)) ·
[Element (Granblue Fantasy Wiki)](https://gbf.wiki/Element) ·
[Chongyun (Icy Veins)](https://www.icy-veins.com/genshin-impact/chongyun-profile-talents-constellations) ·
[Xenoblade Chronicles 2 (Wikipedia)](https://en.wikipedia.org/wiki/Xenoblade_Chronicles_2) ·
[Exploiting weaknesses in Persona 5 (SuperCheats)](https://www.supercheats.com/persona-5/walkthrough/exploiting-weaknesses) ·
[Fire Arms (Mystery Dungeon Wiki)](https://mysterydungeonwiki.com/wiki/Draft:Etrian_1:Fire_Arms) ·
[Landsknecht (Giant Bomb)](https://giantbomb.com/wiki/Concepts/Landsknecht) ·
[Damage conversion (PoE Wiki)](https://www.poewiki.net/wiki/Damage_conversion) ·
[Convert (PoE2 Wiki)](https://www.poe2wiki.net/wiki/Convert) ·
[Combat (Sea of Stars Wiki)](https://seaofstars.fandom.com/wiki/Combat)
