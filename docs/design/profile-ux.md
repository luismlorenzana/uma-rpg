# Uma profile UX

**Status:** built (D229). This page is the visual and interaction contract for the Stable's Uma profile.

## Goal

The profile is a control surface, not a manual. It should show the Uma and the state that matters now, keep every
action comfortably tappable, and disclose rules only when the player asks for them. Scrolling is for additional
information, not padding or repeated explanations.

## Research and adaptation

- [Diablo IV's skill system](https://news.blizzard.com/en-us/article/23938756/make-sanctuary-yoursplay-your-way-in-diablo-iv)
  uses connected nodes to show progression and distinct node states to show the build. Its developers explicitly
  prioritize contextual connections between skills. We keep those connections and state cues, but not its desktop
  scale.
- [Diablo IV's earlier tree breakdown](https://news.blizzard.com/en-us/article/23529210/diablo-iv-quarterly-updateseptember-2020)
  separates the node's identity from its detail: shape, icon and connection carry the overview; the full effect is
  secondary. Our nodes use the skill's kind marks, path ring and rank badge; a tap opens the exact words and action.
- [Path of Exile added zoom to its passive tree](https://www.pathofexile.com/forum/view-thread/11455) because that tree
  is enormous. This profile has five depths and one fork, so it stays fixed and readable: no pan, zoom or miniature
  map on a phone.
- Last Epoch's node-detail overlay was treated as a bug when it opened over the tree without being asked
  ([developer response](https://forum.lastepoch.com/t/remove-skill-tooltip-from-instantly-showing-upon-opening-skill-tree/52737)).
  Our detail sheet opens only from a deliberate tap and closes without changing the tree's position.

These are interaction references, not visual references. The profile keeps this game's type, colors, pixel marks and
original UI.

## Rules

1. **Overview first.** The identity header carries only portrait, name, title, level, rarity/template and the target
   icon. EXP is one thin line. Class, Craft Level and current Party/Work state share one row.
2. **Actions are 44 pt; facts are not cards by default.** A button, tab or node has at least a 44 pt hit area. Static
   labels and values use compact rows, grids or badges without artificial touch padding.
3. **Icons choose; sheets explain.** Repeated choices use their established pixel icons. The visible screen names the
   selected thing once; accessible names remain complete. Help owns general rules, and a selected item's sheet or
   detail area owns its exact effect.
4. **One selection, one action.** A family or tree is picked in one compact row. Only that selection's detail and one
   primary action appear below it. The screen never repeats an Equip button and a paragraph for every alternative.
5. **State has one visual language.** Accent fill is selected; an accent ring is held/equipped; raised is available;
   low contrast is another path; faded plus a gate badge is closed; a small green mark means something can improve.
6. **Structure must be visible.** A skill tree is connected icon nodes: two trunk nodes, one fork, two branches. Node
   cards and prose lists are not a tree. Each branch choice is a square node the same size as a circular skill node.
   Rank, equipped state and gates stay visible on the node; the full name, line and Equip action live in its sheet.
7. **Density is consistent across tabs.** Sections use the same small heading, 8 pt internal padding and 8 pt vertical
   rhythm. Battle facts use three columns. Work and Racing keep their information, but do not promote
   static facts into oversized cards.

## Screen contract

- **Header:** icon-only Target control; EXP; Class, Craft and Party/Work in one row.
- **Skills:** one row for the selected class and three weapon trees. Class opens its picker. A weapon selects its tree;
  Change opens the weapon sheet. Equipped skills are seven compact slots. Tapping a tree node opens its detail sheet.
- **Battle:** the class summary remains an action; stat groups are compact three-column facts; help holds the formula.
- **Gear / Equip:** preset is one row; three weapon icons and five armor icons are one loadout grid; the four accessory
  families share one row. Only the selected family shows its effect, kind choices and one Equip action.
- **Gear / Upgrade:** spending remains explicit. It may be denser, but blockers and costs stay beside the affected slot.
- **Work and Racing:** keep all current rules and data in compact sections. No rule or save behavior changes.

## Phone checks

Check at 390×844 and 375×667, light and dark. In particular:

- target marks remain readable over every portrait;
- every interactive icon has a 44 pt hit area and an accessible name;
- the summary is one row and never clips long party or class names;
- all four accessory families and the class plus three trees fit without horizontal scrolling;
- the tree's connectors remain aligned for short and long localized names because names are in sheets, not nodes;
- bottom sheets fit above the native bar and do not change the underlying selection when dismissed.
