# Classes and skill trees

> **Status: D86 replaces the ported uma-racer design.** The old six builds, two-action hands, staves, Ultima and
> blessing tree are retired. Git history keeps the original tables; they are not current rules.
> [The Class Sheet](class-rework.md) records the rework's intent. The generated
> [classes manual](../game/classes.md) and [forty skill trees](../game/skill-trees.md) describe the code (D92).

## Classes

Five free classes, five weapon slots each, one action per turn (D86). Brawler and Mage use fixed five-weapon sets;
Summoner, Spell Blade and Cleric choose within their class's slot pattern.
Switching keeps every class's own learned sides and loadout, and costs nothing outside a fight (D49, D86).

A Spell Blade pairs an Arms half and a Tome half. A Summoner's summon lingers and acts again when she next summons.
A Cleric attaches debuffs to Arms skills and buffs to Tome skills; the retired healing/blessing tree does not return
(D86). Exact target patterns and riders belong to the class-specific generated tree rows, not a generic weapon summary.

## Learning and equipment

Class rank 1 already gives depth-1 cores. Higher depths need both rank and Uma Level, at Lv1/10/20/30/40 (D77).
Cores are free; sides open at Lv5/15/25/35/45 and cost their depth, one side per fork (D73, D86).
Each class gets one side point per Uma Level, up to fifty. Forgetting a side refunds it; switching class preserves
each class's separate budget. Skill slots grow from three to ten (D86, `rpgActiveSlots`).

Class ranks stop at five and spend Promotion Tokens. Weapon, Armor and Accessory Levels stop at ten and spend
Mastery Tokens (D77, D94). The halls, aptitude mapping and timers are in
[training](../game/loops.md#training), with intent in [the core loop](loop.md).

## Combat reference

[Combat](../game/combat.md) owns damage, statuses, shields, Breaks, turns and Limit Breaks.
[Battles](battles.md) explains world-run persistence and rewards.
There is no enrollment class lock, per-type mastery, paid core learning, free Familiar action or chapter camp loop.
Legacy battle fields remain only where engine v6 replay needs them (D91); they are not player-facing features.
