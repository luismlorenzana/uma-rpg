# S3 — Battles and leveling

> **Status: built and deploying, 2026-10-10** (the owner approved building straight to deployment). Tasks:
> [docs/tasks/](../tasks/README.md). Design: [battles.md](../../design/battles.md), [classes.md](../../design/classes.md),
> D48–D53.

## Goal

The core loop: **unlock, fight, level, earn Shards, unlock more.** uma-racer's battle engine comes over unchanged;
around it, uma-rpg gets ten-level chapters, free class builds, a Phaser battle stage with effects, and PriConne's cast
as the rivals.

## What the owner sees

### Scenario Gate (full page)

- **Chapters:** Tier 1's five, each with its level band, how many nodes a party has won, and **Cleared** or **Fight
  open** badges. Later tiers stay locked. The header counts **Laurels**.
- **Chapter map** (`/town/scenario-gate/:chapterId`): pick one of your full parties; the party's five show with their
  levels (a dot marks Umas with skill points to spend, and tapping one opens her skills). The map runs top to bottom:
  camps, fights, sub-bosses with their rival's face, and the Finals' three routes. Tapping a node shows its rivals
  (face, element, shield, weaknesses) and **Fight**, or **Rest** at a camp. A party with an open fight sees
  **Resume the fight**.
- **Fight** (`/town/scenario-gate/:chapterId/fight/:party`): the battle stage (rivals on top, the party's chibis
  below) with each rival's HP, shield, weaknesses and next move, and each Uma's HP and MP. Tap a rival to attack with
  the highlighted Uma, or pick **Skills** first; **Guard** protects an ally. Damage previews show on the rivals.
  Every action plays its effects; a full Limit Break bar adds an **LB** button. The menu offers **back to the map**
  (the fight stays open) or **give up**.
- **Result:** Victory or Defeated, rounds, Laurels, Shards and any Ticket they made, and each Uma's EXP, level-ups
  and new skill points. **Fight again** or **back to the map**.

### Stable

- An owned Uma's profile shows her **EXP bar** and a **Class & skills** card: the build she fights as, skills
  equipped, and points to spend.
- **Skills** (`/town/stable/outfit/:id/skills`): six class builds (switch freely: "Fight as …"), the build's two
  trees with every open node (learn, equip, swap a variant out for a refund), the equipped list, and the Summoner's
  Familiar form.

## Exit check

Historical check; releases use the [current phone script](../../../testing/phone-check.md).

On the iPhone, after **Update ready — Restart**:

1. With a full party, open the first continent, spend skill points on two Umas, and win a fight: the effects play, the result
   pays EXP and Laurels, and the node turns gold with the nodes below it open.
2. Close the app mid-fight and reopen it: **Resume the fight** continues from the same action.
3. Rest at a camp, and lose or give up a fight: nothing is lost.
4. Level an Uma to Lv10 (replays help): she earns a Shard.
