# H20 — Key bosses' faces

**Claude, then the owner · uma-rpg · S.** The owner asked for it (D76). Private content: the faces live only in the gitignored packs
and the private bucket.

## Why

Region bosses and elites draw a face from their biome's franchise pack by a seeded pick (D76, D81). The owner wants to
choose the faces of key bosses: a franchise's well-known characters as its biomes' bosses.

## Context

- **Packs:** `content/release/<franchise>/cast.json` (gitignored), published to `gs://uma-rpg-content/<franchise>/`
  and served at `/api/content/` behind auth.
- **Faces:** `world/world.ts` (`facesFor`, `poolOf`) and `rpg/campaign/enemies.ts`.
- **Import scripts:** `scripts/cast/*.mjs` and `pack.mjs`'s `writePack`.

## Do

1. **Claude** adds an optional `bosses` map to a pack (`content/overrides/<franchise>-bosses.json`, private), keyed by
   biome and then by stage kind (`boss` or `sub-boss`), each a list of member slugs.
   - `writePack` folds it into `cast.json`.
   - The world picks from that list first, seeded by the region id, and falls back to today's pick.
   - Tests use synthetic packs.
2. **Claude** writes a helper, `node scripts/cast/list-members.mjs <franchise>`, that prints slugs and names, so the
   owner can choose.
3. **The owner** fills the override files: a few names per biome is enough.
4. **Claude** republishes the packs.

## Done when

- A boss in a biome with an override wears one of the chosen faces.
- Others are unchanged.
- Nothing private is in git.

## Deliver

A direct push per CLAUDE.md, then a two-line how-to for the owner.
