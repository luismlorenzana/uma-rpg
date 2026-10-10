# pixel-art

Generates uma-rpg's original pixel art from code: no dependencies, no hand-edited image files.

```bash
node tools/pixel-art/src/build.ts
```

It writes 32×32 icons to `art/items/<family>/<id>.png`, plus `art/previews/items.png` (a 4× contact sheet) and
`art/previews/items.html` (named cards at 4× and 1×). Node 23.6+ runs the TypeScript directly; imports carry `.ts`.

## How an icon is made

| Module | Does |
|---|---|
| `color.ts` | Six-tone ramps (outline, deep shadow, shadow, base, light, highlight). Shadows turn cool and highlights warm |
| `shape.ts` | Masks (ellipse, circle, polygon, union, subtract). `shadeDome` lights any silhouette like a sphere from a distance transform; `cutStone` + `shadeFacets` shade cut objects facet by facet |
| `sprite.ts` | The 32×32 grid of (ramp, tone) cells. Rendering adds the drop shadow, a selective outline (each edge takes the darkest tone of what it borders) and glints |
| `rng.ts` | Seeded randomness, so every run draws the same pixels |
| `items/*.ts` | One painter per item, in catalog order ([docs/design/items.md](../../docs/design/items.md)) |

**Shared rules:** light comes from the top left; every object has a 1 px outline and a soft shadow; legendary grades
(9–10) get glints.

Per P15 this belongs in `uma-platform/assets/`. It lives here until a second game needs it (D25).
