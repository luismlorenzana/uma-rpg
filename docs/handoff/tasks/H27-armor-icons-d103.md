# H27 — Armor icons for D103: eight armor pieces

**Priority P2 · ChatGPT, then Claude wires uma-rpg · uma-platform · M.** Ready: H03, H06, H10 and H11 are merged and
released as `@luismlorenzana/uma-art` 2.0.0 (uma-platform `main`, 2026-10-12), and uma-rpg already uses 2.0.0.

## Why

D103 replaced Garb, Leather, Mail, Plate, Rings and Charms with five armor slots, each physical or magical. Until the
eight new pieces have art, uma-rpg borrows the old rows (`apps/web/src/items/frames.ts`, `ARMOR_ART`): Helm and
Gauntlets draw as Plate, Cuirass as Mail, Greaves as Leather, Robe and Leggings as Garb, Circlet and Bracers as Charm.
The accessory slot's Orbs already have their own rows in 2.0.0, so these eight are the only gear without art.

## Do

1. Append eight rows to the gear atlas after `orb-dark` (rows 26–33, sheet 320×1088), grades 1–10 across like every
   row, ids `<piece>-g<grade>`. Appending keeps every 2.0.0 position, so the changeset is **minor**:
   - **Physical:** `helm`, `cuirass`, `greaves`, `gauntlets`: metal and leather, the Arms half's colours (ores, hides).
   - **Magical:** `circlet`, `robe`, `leggings`, `bracers`: cloth, gems and bone, the Tome half's colours.
   - Keep the bottom-right 9×9 clear (the accent mark goes there), as `gear/build.ts` enforces.
2. Grades read apart at 1× the way H03's do: material changes at grades 4 and 7, trim and glow from 8.
3. Keep the old armor and accessory rows (garb, leather, mail, plate, ring, charm) until uma-rpg stops using them; note
   them as retired in the changeset.
4. Pieces of one slot read as a pair at a glance: Helm and Circlet both sit on a head, Cuirass and Robe on a body, and
   so on, so the physical and magical kinds of a slot are told apart by material, not by shape alone.

## Done when

- `pnpm art:draw` reproduces every PNG byte for byte; `pnpm lint && pnpm test && pnpm build` pass; a 2× preview sheet
  of the eight rows, next to the old armor rows, is in the PR.
- The gear index lists all 34 rows; the first 26 are unchanged byte for byte.
- No original-game content.

## Deliver

A pull request on uma-platform `feat/armor-icons-d103`, from `main`, titled `feat(art): armor icons for D103 (H27)`,
with a minor changeset and no version bump. Claude reviews, merges, releases it and points `ARMOR_ART` at the new rows.
