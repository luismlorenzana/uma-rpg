# H28 — Icons for D124: Boots, Slippers, Talismans and Amulets

**Priority: now · ChatGPT · uma-platform, then uma-rpg · M.** Ready: D124 is built and live with borrowed art.

## Why

D124 added twelve gear types that have no art of their own yet. uma-rpg borrows rows from the gear atlas
(`apps/web/src/items/frames.ts`, `gearArt`):
- **Boots** draw as Greaves and **Slippers** as Leggings.
- The five **Talismans** draw as the retired Charm row and the five **Amulets** as the Ring row, so the five of each
  kind look the same.

## Do

1. **uma-platform:** append twelve rows to the gear atlas after `slippers`' place in the order below, each with grades
   1–10 across. Ids are `<type>-g<grade>`, and appending keeps every 2.4.0 position, so the changeset is **minor**.
   - `boots`: plated sabatons (physical, Arms colours). `slippers`: cloth shoes with gem trim (magical, Arcana colours).
     Each pairs with its slot's twin the way Helm pairs with Circlet: the same footprint, a different material.
   - **Talismans** (physical defense, metal and stone, Arms colours), one silhouette each:
     - `talisman-vital`: a heart;
     - `talisman-vampire`: a fang;
     - `talisman-bulwark`: a tower shield;
     - `talisman-iron`: an anvil or iron ring;
     - `talisman-thorn`: a thorned vine.
   - **Amulets** (magical defense, gem and cloth, Arcana colours), one silhouette each:
     - `amulet-spring`: a droplet;
     - `amulet-siphon`: a swirl;
     - `amulet-veil`: a veiled crescent;
     - `amulet-ward`: a rune circle;
     - `amulet-mirror`: a hand mirror.
   - **Grades** read apart at 1× as in H03 and H27: material changes at grades 4 and 7, trim and glow from 8.
   - **The corner:** keep the bottom-right 9×9 clear (`gear/build.ts` enforces it).
2. **Release and pin:** publish the minor uma-art release and pin it in uma-rpg.
3. **uma-rpg:** point `gearArt` at the new rows and drop the borrowed mapping. `frames.test.ts` checks every type
   against the published index.

## Done when

- `pnpm art:draw` reproduces every PNG byte for byte, and both repos' `pnpm lint && pnpm test && pnpm build` pass.
- A 2× preview sheet of the twelve rows is in the uma-platform PR.
- No original-game content.

## Deliver

- **uma-platform:** a pull request on `feat/gear-icons-d124`, titled `feat(art): boots, slippers, talismans and amulets
  (H28)`, with a minor changeset.
- **uma-rpg:** a pull request on `feat/gear-icons-d124` that bumps uma-art and wires `gearArt`.

Each merges itself after green CI (D120) and logs its decision with the next free number (fetch `main` first).
