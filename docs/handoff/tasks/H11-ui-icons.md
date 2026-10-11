# H11 — Class emblems and status icons

**Priority P2 · ChatGPT · uma-platform, then uma-rpg · S.** After H01 passes.

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
- **The atlas pipeline:** uma-platform `scripts/pixel-art`; house style from H01.

## Do

1. **Art:** a `ui` family in uma-art (`packages/art/ui/atlas.{png,json}`, preview, a minor changeset).
   - **`class/<class>`**, 24×24:

     | Class | Emblem |
     |---|---|
     | Brawler | Crossed greatsword and axe |
     | Mage | An open tome with a star |
     | Spell Blade | A sword through a rune circle |
     | Cleric | A sun halo over a shield |
     | Summoner | A summoning circle with a small spirit |

   - **`status/<key>`**, 12×12, readable at 1×. Debuffs on a red-violet badge, buffs on a gold-teal one:

     | Status | Glyph |
     |---|---|
     | Armor Break | A cracked shield |
     | Mind Break | A cracked gem |
     | Enfeeble | A down arrow on an arm |
     | Shatter | Splinters |
     | Hex | An eye |
     | Brave | A sword up |
     | Faith | A star up |
     | Aegis | A shield glow |
     | Breaker | A fist and spark |
     | Clarity | A droplet |

2. **The game:**
   - The class emblem goes beside the class name in the class picker, chip and party bar.
   - Status icons with their stack count replace the text chips in battle. The full name stays in each one's
     accessible label and in the skill line text.

## Done when

- The ui build checks ids and sizes and is byte-identical across runs.
- In the browser at 375 px, the emblems and status icons are crisp (whole-pixel scale) and the labels stay accessible.
- `pnpm lint && pnpm test && pnpm build` pass in both repos.

## Deliver

Pull requests `feat/ui-icons-art` (uma-platform) and `feat/ui-icons` (uma-rpg), with screenshots.
