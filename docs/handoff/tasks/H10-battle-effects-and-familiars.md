# H10 — Battle hit effects and Summoner familiars

**Priority P2 · ChatGPT · uma-platform, then uma-rpg · M.** After H01 passes.

## Why

Battle effects are procedural circles and particles, and a Summoner's lingering summons have no body at all. D86 made
ten damage kinds and summons that stay on the field and strike again. Pixel hits per kind and a small familiar per kind
make the classes read at a glance.

## Context

- **Kinds** (uma-rpg `packages/domain/src/rpg/kinds.ts`, `RPG_DAMAGE_KINDS`): `greatsword`, `axe`, `lance`, `bow`,
  `katana` (Arms) and `fire`, `ice`, `lightning`, `light`, `dark` (elements).
- **Shapes per kind** (D86, `docs/design/class-rework.md`):
  - Greatsword and Fire: one foe, heavy.
  - Axe and Ice: every foe.
  - Lance and Lightning: random foes.
  - Bow and Light: one foe, many hits.
  - Katana and Dark: double.
- **Element colors** (`apps/web/src/battle/labels.tsx`): fire `#ff8a5c`, ice `#8fd3ff`, lightning `#ffd84d`, light
  `#fff2b0`, dark `#c79bff`.
- **The stage:** `apps/web/src/battle/scene/BattleScene.ts`. Its cues come from the engine: hit, weak, break, limit,
  `summon`, … (`describeCue` in `battle/battle-view.ts`). The summons live in `state.summons` (`BattleSummon`) with
  their kind and lingering power.
- **The atlas pipeline:** uma-platform `scripts/pixel-art`. H01 shows the house style.

## Do

1. **Art:** a new `fx` family in uma-art (`packages/art/fx/atlas.{png,json}`, preview `assets/previews/fx.png`, a minor
   changeset):
   - **`hit/<kind>-0…3`:** a four-frame impact per kind, 32×32.

     | Kind | Impact |
     |---|---|
     | Greatsword | A heavy crescent |
     | Axe | A cleaving arc |
     | Lance | A thrust spark |
     | Bow | An arrow burst |
     | Katana | A thin double slash |
     | Fire | A flame burst |
     | Ice | Shards |
     | Lightning | A forked bolt |
     | Light | A radiant star |
     | Dark | A violet implosion |

   - **`familiar/<kind>-0…1`:** a two-frame idle familiar per kind, 32×32.
     - Elements: a fire salamander, an ice wisp, a thunder hawk, a light sprite, a shadow cat.
     - Arms: a spectral blade, axe, lance, bow or katana floating with a soft glow.

     Outlined and shaded in the house style.
2. **The game:**
   - Play `hit/<kind>` on each hit's target, in place of the procedural burst, keeping the damage numbers and the
     weak/break text.
   - Show each lingering summon as its familiar beside the Summoner, idling, and gone when it expires.
   - Keep the procedural effects as the fallback when the atlas isn't loaded, and under reduced motion show the last
     frame only.

## Done when

- The fx build checks every frame id and size, and is byte-identical across runs.
- In the browser: one fight per class shows its kinds' hits, and a Summoner shows her familiars come, linger and go.
- Battle speed (H02) at 4× still looks right.
- `pnpm lint && pnpm test && pnpm build` pass in both repos.

## Deliver

Pull requests `feat/fx-art` (uma-platform, with `fx.png`) and `feat/battle-fx` (uma-rpg, with a short recording).
