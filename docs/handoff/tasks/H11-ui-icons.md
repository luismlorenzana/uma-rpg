# H11 — Class emblems and status icons

**ChatGPT · uma-rpg · S.** The art is published; this is the game half.

## Why

The owner changes classes and weapons constantly (D86), and the class is shown only as a word. The Cleric's ten
statuses show as text chips in battle. Small pixel emblems make both scannable.

## Context

- **Classes** (`packages/domain/src/rpg/rules.ts`, `RpgClass`): `brawler`, `mage`, `spellblade`, `cleric`, `summoner`.
  Their one-line blurbs are `CLASS_BLURB` in `apps/web/src/battle/labels.tsx`.
- **Statuses** (`STATUS_LABEL` in the same file):
  - Debuffs from Arms: `armor-break`, `mind-break`, `enfeeble`, `shatter`, `hex`.
  - Buffs from Tomes: `brave`, `faith`, `aegis`, `breaker`, `clarity`.
- **Where they show:**
  - the class chip and picker in `apps/web/src/places/stable/SkillsPage.tsx` and `OutfitProfile.tsx`;
  - the party bar in `scenario-gate/ActiveParty.tsx`;
  - status chips on the fight screen (`FightScreen.tsx`) and in skill lines (`skillLine` in `labels.tsx`).

## Do

1. **The art is published** in uma-art's `ui` family: `class/<class>` (24×24 emblems) and `status/<key>` (12×12
   glyphs, debuffs on a red-violet badge, buffs on a gold-teal one).
2. **The game:**
   - The class emblem goes beside the class name in the class picker, chip and party bar.
   - Status icons with their stack count replace the text chips in battle. The full name stays in each one's
     accessible label and in the skill line text.

## Done when

- In the browser at 375 px, the emblems and status icons are crisp (whole-pixel scale) and the labels stay accessible.
- `pnpm lint && pnpm test && pnpm build` pass.

## Deliver

A pull request on `feat/ui-icons` in uma-rpg, with screenshots.
