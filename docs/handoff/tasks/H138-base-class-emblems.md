# H138 — Art: five new base class emblems (uma-art 2.18.0), and the pin

**uma-platform, then uma-rpg · ChatGPT draws, publishes and pins · S · Needs: nothing · Unblocks: nothing**

> **Where this lives:** the art and its pull request are in **uma-platform**. The packet sits in uma-rpg's
> `docs/handoff/tasks/` because uma-rpg asks for the art, as H54 and H127 did. The last step is a one-line pin in uma-rpg.

## Why

The owner, 2026-10-30: the base class icons are "very poor, completely disassociated from anything". H127 drew them on
purpose as plain hollow iron, wood and parchment outlines (CV33), so they carry no family colour and no family idea: an
axe on a pole, a thin sword, an empty shield, a small ring and a closed book.

D259 renamed the five after their families, the word in each hall's name: **Warrior, Spellblade, Healer, Summoner, Mage**.
The emblems should now say the same thing. CV33's "plain, outlined" rule no longer applies to these five.

## Context (read first)

- **uma-platform's house style:** `scripts/pixel-art/README.md` § "UI emblems and status badges" and § "Classes v3 (H127)";
  `packages/art/README.md` (the `ui` atlas line, and the table of the five at lines 257–261).
- **The emblems:** `scripts/pixel-art/src/ui/classes.ts`. `beginner()` draws today's five; replace it. `summoner()` and
  `spellblade()` draw the Tier 1 families, and the new emblems borrow from them. `ui/spec.ts` holds `TIER0`.
- **What to reuse:** `gear/symbols.ts`: `ELEMENTS` (each element's `color`, `ink` and 7×7 `glyph`), `elementGlyph`,
  `ARM_COLORS` (Greatsword `#f0922e`, Axe `#8466e8`, Lance `#46c05a`) and `armGlyph`. The Summoners' spirit is `#b6d2ea`
  with `#58628b` eyes. The Spellblades' violet is `#a28ac8`.
- **The guards that will need changing:** `src/classes-v3.test.ts` (the `TIER0` checks at 53–59, including the `holes`
  table, describe the old hollow forms), `ui/ui.test.ts`, and any baseline in `src/testing/legacy-*.json` that freezes the
  `ui` sheet at 2.16.0 or 2.17.0.
- **The labels:** `ui/build.ts:89` and `ui/classes-v3-preview.ts:8` print the old names on the preview sheets.
- **How uma-rpg draws them:** `apps/web/src/battle/pixel-icons.tsx`. `ClassEmblem` draws `class/<classId>` at native 24 px
  beside the full class name: on the class tree's tiles (dark and light states, 60 px tall), the profile, the Stable's
  cards, the party bars, the Exchange and the promotion sheet. No code changes when the frames change.
- **The lore:** uma-rpg `docs/design/classes-v3/halls-v2.md` §2.1, and `docs/game/heroes.md`.

## Decisions made

### Same ids, same place

**Redraw the five frames in place.** The ids stay class ids, so nothing in uma-rpg moves. This is a deliberate exception
to the "older pixels stay frozen" habit: only uma-rpg draws these five (check uma-racer's `origin/main` for `class/`, as
the local checkout may be on an old branch). **Every other frame and pixel stays exact**, and a test must prove it. The
sheet stays 120×164 with 45 frames.

| Frame (id stays) | Shows as | At | Family |
|---|---|---|---|
| `class/recruit` | **Warrior** | (0, 140) | Warrior Dojo: self-training |
| `class/duelist` | **Spellblade** | (24, 140) | Spellblade Salle: pacts with familiars that live in the blade |
| `class/acolyte` | **Healer** | (48, 140) | Healer Sanctum: a followed deity |
| `class/caller` | **Summoner** | (72, 140) | Summoner Circle: familiars, summoned |
| `class/apprentice` | **Mage** | (96, 140) | Mage Tower: self-study |

### What each one draws

The first four are the owner's ideas. The Healer's is ours: the owner left it open.

- **Warrior: three weapons.** A Greatsword up the middle, an Axe to the left and a Lance to the right, fanned from one
  point at the foot, each head in its `ARM_COLORS`. It's the Dojo's Triad Onslaught, "the three heavy Arms in one unbroken
  motion". It must not read as the Brawler's crossed pair.
- **Mage: the three elements.** Fire on top, Ice lower left, Lightning lower right, each its own colour and shape (the
  7×7 `elementGlyph`s fit), with a small spark or thin arc tying them together. It's the Tower's Triad Tempest. No book:
  that's the Sorcerer's.
- **Summoner: a tome and its familiar.** An open tome with the Summoners' pale spirit rising from its pages, the same
  silhouette as `summoner()`, so the family reads across the promotion. No rune ring: that's the Tier 1s'.
- **Spellblade: a weapon and its familiar.** An upright blade with the same small spirit perched on or curled around it,
  with a violet accent. No rune ring: that's the Tier 1s'.
- **Healer: a heart under a halo.** A pale rose-white heart with a gold halo above it, and small white wings only if they
  read at 24 px. The halo is the Sanctum's deity; the heart says healing to anyone. **No cross and no shield:** those are
  the Cleric's and the Paladin's, and a red cross is a protected emblem.

### The style

- **24×24**, light from the top left, the outline and contact shadow of the other emblems, transparent corners, on the
  shared kit. Colour is welcome: these should sit beside the Tier 1s as equals, not as grey placeholders.
- **Legible at native size on both a dark and a light tile.** Three items in 24 px is tight: simplify a weapon before
  shrinking it, and judge at 1×, not 4×.
- **Five different silhouettes,** and each different from its Tier 1 children.

## Do

1. Replace `beginner()` with the five drawings above.
2. Update the tests and baselines: the five may change, and every other frame must match 2.17.0 exactly.
3. Update the preview labels and the art README's rows to the new names, keeping the ids.
4. Review the sheet at 1×, 2× and 4× on white and dark, in the tree's order, beside the Tier 1 emblems.
5. Log **P78** in uma-platform's `docs/decisions.md`, add the changeset, merge and publish **uma-art 2.18.0**.
6. In uma-rpg, on a branch: pin `@luismlorenzana/uma-art` to `2.18.0` in `apps/web/package.json` and the lockfile. Log the
   next D-number (fetch `main` first), delete this packet and add a Done row to `docs/handoff/README.md` (D35). Merge it.

## Done when

- `pnpm` checks pass in uma-platform and uma-rpg.
- The `ui` sheet is 120×164 with 45 frames, and only the five frames above differ from 2.17.0.
- The Classes sheet (Stable → an Uma → Skills → the class button) shows the five new emblems in the Tier 0 row, and each
  reads at native size without its name.

## Deliver

- uma-platform: the art pull request and the published uma-art 2.18.0.
- uma-rpg: the pin pull request, which flags this packet done.
