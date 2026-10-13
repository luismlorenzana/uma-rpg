# H10 — Battle hit effects and Summoner familiars

**ChatGPT · uma-rpg · M.** The art is published; this is the game half.

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

## Do

1. **The art is published** in uma-art's `fx` family (`@luismlorenzana/uma-art`, already a dependency):
   `hit/<kind>-0…3`, a four-frame 32×32 impact per kind, and `familiar/<kind>-0…1`, a two-frame 32×32 idle familiar
   per kind.
2. **The game:**
   - Play `hit/<kind>` on each hit's target, in place of the procedural burst, keeping the damage numbers and the
     weak/break text.
   - Show each lingering summon as its familiar beside the Summoner, idling, and gone when it expires.
   - Keep the procedural effects as the fallback when the atlas isn't loaded, and under reduced motion show the last
     frame only.

## Done when

- In the browser: one fight per class shows its kinds' hits, and a Summoner shows her familiars come, linger and go.
- Battle speed (H02) at 4× still looks right.
- `pnpm lint && pnpm test && pnpm build` pass.

## Deliver

A pull request on `feat/battle-fx` in uma-rpg, with a short recording.
