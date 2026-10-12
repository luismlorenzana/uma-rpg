# H27 — Armor icons for D103: eight armor pieces

**Priority P2 · ChatGPT, then Claude wires uma-rpg · uma-platform · M.** After H03, H10 and H11 are merged (one
`@luismlorenzana/uma-art` release can carry all of them).

## Why

D103 replaced Garb, Leather, Mail, Plate, Rings and Charms with five armor slots, each physical or magical. Until the
eight new pieces have art, uma-rpg borrows the old rows (`apps/web/src/items/frames.ts`, `ARMOR_ART`): Helm and
Gauntlets draw as Plate, Cuirass as Mail, Greaves as Leather, Robe and Leggings as Garb, Circlet and Bracers as Charm.

## Do

1. Add eight rows to the gear atlas, grades 1–10 across like every row, ids `<piece>-g<grade>`:
   - **Physical:** `helm`, `cuirass`, `greaves`, `gauntlets`: metal and leather, the Arms half's colours (ores, hides).
   - **Magical:** `circlet`, `robe`, `leggings`, `bracers`: cloth, gems and bone, the Tome half's colours.
   - Keep the bottom-right 9×9 clear (the accent mark goes there), as `gear/build.ts` enforces.
2. Grades read apart at 1× the way H03's do: material changes at grades 4 and 7, trim and glow from 8.
3. Keep the old armor and accessory rows until uma-rpg stops using them; note them as retired in the changelog.

## Done when

- `pnpm art:draw` reproduces every PNG byte for byte; tests pass; a 2× preview sheet of the eight rows is in the PR.
- No original-game content.

## Deliver

A pull request on uma-platform `feat/armor-icons-d103`, titled `feat(art): armor icons for D103 (H27)`. Claude then
points `ARMOR_ART` at the new rows when the release is published.
