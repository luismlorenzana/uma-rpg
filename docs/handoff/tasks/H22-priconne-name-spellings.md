# H22 — PriConne name spellings

**Priority P3 · the owner, then Claude · uma-rpg · XS.** Private content.

## Why

PriConne foes' English names come from the source site's slugs plus a few fixes (`scripts/cast/import.mjs`). Some read
oddly, and the owner knows the proper spellings.

## Do

1. **Claude** prints every PriConne cast name with its slug from `content/release/cast.json` into a private file the
   owner can edit: `content/overrides/priconne-names.tsv`, gitignored.
2. **The owner** corrects the names they care about. Costume variants stay out of scope.
3. **Claude** makes `import.mjs` read the overrides, re-imports and republishes (`bash scripts/cast/publish.sh`), then
   checks a few in the region sheets.

## Done when

The corrected names show in the game, and nothing private is in git.
