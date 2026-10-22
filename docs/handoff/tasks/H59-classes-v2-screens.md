# H59 — The classes v2 screens, inert until the switch: the Paladin, the Bastion, typed slots, the Summoner's pair, one healer

**uma-rpg · Either · L · Needs: H54, H55, H56, H57, H58 · Unblocks: H61**

## Why

H53–H58 built classes v2's rules dark. The player meets them on screens that don't know them yet:
- the **Paladin** in the class picker, her emblem, her trees, her preset;
- the **Paladin Bastion** on the Learning page and its four Limit Breaks, and the Chapel's two new ones;
- the **Damage** and **Support** accessory slots and flat Orbs on the Gear tab and the battle sheet;
- the **Summoner's pair** on the fight screen, her farewell and the Cleric's Regen in the fight's text;
- **one healer a party** where parties are built and fights begin.

This packet builds them so they follow the domain's live generation (and a fight's own version), which means the
deployed game shows **nothing new** until H61 flips the switch. You preview them with a local switch, never committed.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md` (player-facing text is short; 44 pt targets; 390×844 and 375×667), `docs/change-protocol.md`
  (nothing uma-kit draws changes here: the Hub map takes places and frames as data).
- [classes-v2.md](../../design/classes-v2.md) §3–§7, the D-rows of H53–H58 (the build decisions: the Learning layout, the
  Bastion on `knights-bastion`, one healer), and each of those packets' "Decisions made" for the exact rules and names.
- The manual of today's screens: [sections.md](../../game/sections.md) § Learning (line 59, 144), § Stable, § Party Hall;
  [classes.md](../../game/classes.md).
- **The domain you read** (all generation-aware, defaulting to the live switch): `RPG_CLASSES`, `rpgHand(profile,
  engine)`, `rpgClassSlots`, `CLASS_PRESET_*`/`classPreset`, `ACCESSORY_SLOT_LABEL`, `accessorySlotFor`,
  `accessoryFits`, `accessoryEffects`, `umaBattleSheet`, `heroLimitFor(id, version)` and the live `heroLimitsOf`,
  `battleExtraHit`, `healerBlock`, `STYLE_CLASSES`, `rpgV2`.
- **The screens** (lines on `c8d0cea`):
  - `packages/domain/src/hub/places.ts` 127–146: `hall()` and `LEARNING` (Brawler (0.24, 0.1), Mage (0.76, 0.11), Spell
    Blade (0.22, 0.33), Cleric (0.78, 0.33), Summoner (0.5, 0.56), Observatory (0.5, 0.84)); `Place.frame` 51–52.
  - `apps/web/src/hub/HubScreen.tsx` 115 (`frame: place.frame ?? place.id`); `places/registry.tsx` 65–68 (every
    `HERO_HALLS` place gets the Hall page; H53 added `paladin-bastion`).
  - `apps/web/src/battle/labels.tsx`: 15–22 `CLASS_LABEL`, `CLASS_BLURB`; 39–48 `skillLine` (one `hand.power` for both
    halves, `skill.support`); 109–118 `supportText`.
  - `apps/web/src/battle/pixel-icons.tsx` 22–24 `ClassEmblem` (`class/<id>`; the frame comes with uma-art 2.12.0, H54).
  - `apps/web/src/battle/battle-view.ts`: 27–42 `Pair`, `pairOf`, `pairMode`, `halfIsTome` (Arms half first); 81–106 the
    Limit Break options (`heroLimit(limit)`, live); 130–140 cue text (`summon`: "… strikes again"; `heal` with a label).
  - `apps/web/src/places/scenario-gate/FightScreen.tsx` 170–185: `paired = ally?.classId === 'spellblade'`.
  - `apps/web/src/battle/scene/BattleScene.ts` 341–351 (the `summon` and `heal` cues on the stage).
  - `apps/web/src/places/stable/`: `SkillsPage.tsx` 73 (the class picker), `GearCard.tsx` 63 (accessory rows by
    `ACCESSORY_SLOT_LABEL`), `WeaponSheet.tsx` 175–200 (the accessory sheet: every type of a kind except the other
    slot's), `OutfitProfile.tsx` (322 class ranks, 472 "Learns fastest", the battle sheet), `PresetButton.tsx`.
  - `apps/web/src/places/party-hall/PartyHallPage.tsx` (the list and the editor; `view.roster` has the outfits).
  - `apps/web/src/places/scenario-gate/ScenarioGatePage.tsx` (where the world map's fight starts).
  - `apps/web/src/places/rift/`: `rift-view.ts` (`bestParty`, `suggestConvergence`, by `RIFT_FRONT_SPECS`' guidance),
    `StageSheet.tsx`, `EchoSheet.tsx`, `ConvergenceView.tsx` (they print the domain's block strings; H58 passed
    `outfits`).
  - `apps/web/src/places/halls/HallPage.tsx` (one page for every hall, by `hallClass`).
  - `apps/web/package.json` 15: `@luismlorenzana/uma-art` 2.11.0.

## Decisions made

- **Inert until the switch.** Every new screen state comes from the domain's live generation (`RPG_CLASSES`, the live
  tables) or from a fight's own `engineVersion`. No screen tests `BATTLE_ENGINE_VERSION` itself except through `rpgV2()`.
  Before H61 the game looks exactly as it does today; an open v14 fight after the switch still shows a one-half Summoner.
- **The local switch** (to preview; **never commit it**), exactly H61's change:
  1. `packages/domain/src/rpg/battle/caps.ts`: `BATTLE_ENGINE_VERSION = 15`;
  2. `packages/domain/src/save/save.ts`: `SAVE_SCHEMA_VERSION = 25`;
  3. `packages/domain/src/save/migrations.ts`: chain `toV25` after `toV24` (`version < 25`).
  Restart the API and the web; a scratch v24 save in your worktree's `apps/api/.data` migrates on load.
- **uma-art 2.12.0** (H54's release; the version H54 reports): pin it. `ClassEmblem` then draws `class/paladin`.
- **Class order:** lists keep `RPG_CLASSES`' order, Paladin last (moving five classes' order in every list for one
  addition isn't worth it; the Learning page pairs the mirrors instead).
- **The Learning page (v2)**, in `hub/places.ts` by the live generation (physical left, magical right, the mirrors
  across; the trunk road between):

  | Row | Left | Right |
  |---|---|---|
  | 1 | Brawler Dojo (0.24, 0.1) | Mage Tower (0.76, 0.11) |
  | 2 | Spell Blade Salle (0.22, 0.33) | Summoner Circle (0.78, 0.33) |
  | 3 | **Paladin Bastion** (0.24, 0.56) | Cleric Chapel (0.76, 0.56) |
  | 4 | Observatory (0.5, 0.84) | |

  The Bastion is `hall('paladin-bastion', 'Paladin Bastion', 'Paladin', …)` with `frame: 'knights-bastion'`. In v1
  the list is today's, byte for byte. Export the list builder with a generation argument so a test covers v2.
- **Class blurbs (v2)**, one line each, by the live generation:
  - Brawler: "Five Arms, one heavy act a turn."
  - Mage: "Five Tomes, one full cast a turn."
  - Spell Blade: "Three Arms and two Tomes: a blade and a spell each turn, the blade striking twice."
  - Summoner: "Three Tomes and two Arms: a Tome summon that lingers and strikes every foe as it leaves, and an Arms
    summon."
  - Paladin: "Three Arms and two Tomes: Barriers and Aegis on the party, from her ATK."
  - Cleric: "Three Tomes and two Arms: mends, Regen and cleanses for the party, from her M.ATK."
  v1 keeps today's five.
- **Skill lines (v2):** each half's power from `hand.arms` or `hand.tome`; a Spell Blade's Arms skill shows its n + 1 hits
  (`battleExtraHit`); a Summoner's Tome summon says "lingers, then strikes every foe", an Arms summon "strikes once";
  supports read the generation's field (`support15` from v2) and name its new parts ("Barrier on every ally", "Aegis on
  the Barriered", "Regen 2 rounds", "drains 30%").
- **The fight screen** reads the fight's version: `paired` is `rpgHand(ally, state.engineVersion).pair`, so a v15
  Summoner picks a pair like a Spell Blade, **her Tome half first** (the leading half shows first, as the engine resolves
  it); Limit Break options come from `heroLimitFor(id, state.engineVersion)`. Cue text: a v15 `summon` cue reads
  "<Uma>'s <summon> strikes every foe" (v14's "strikes again" stays for v14 fights); a "Regen" heal reads "+N HP ·
  Regen" (already generic). No new stage animation: the farewell's hits are ordinary hit cues.
- **The Gear tab (v2):** the two accessory rows read "Damage" and "Support" (the live label); each sheet lists only the
  types `accessoryFits` allows; an Orb's line reads "+34 Fire offense" (from `accessoryEffects`); Accessory Ranks are
  unchanged. v1 is today's.
- **One healer, where parties are built:** the Party Hall's list card and editor show a small "One healer a party" note
  (the warning colour, text, not an icon alone) when `healerBlock` says so; the world map's fight button is disabled with
  that reason; the Rift's sheets already print the domain's block. Picking an Uma or switching her class is never
  blocked. The Rift's suggestions (`bestParty`, `suggestConvergence`) never propose two healers.
- **Help sheets** that describe classes, Orbs or accessories get v2 text chosen by `rpgV2()`; v1 text is unchanged.
- **The manual** stays as it is (it describes the deployed game); H61 rewrites it from what you built. Note in your
  delivery each screen whose words H61 must carry into `sections.md`.
- **Main JS:** `hub/places.ts` and anything `labels.tsx` brings are in the main bundle; the Stable, Halls, Party Hall,
  fight and Rift pages are lazy. Keep v2 strings in the lazy pages where you can; say the number.

## Do

1. Pin uma-art 2.12.0; `pnpm install`.
2. `hub/places.ts`: the generation-aware Learning list as decided, with a test in `hub/places.test.ts` (v1 equals today's
   list; v2 has six halls at those spots, the Bastion's frame `knights-bastion`, every place still on its page).
3. `battle/labels.tsx`: blurbs and skill and support lines by generation.
4. `battle/battle-view.ts` and `FightScreen.tsx`: the Summoner's pair, the Limit Break options and the cue text by the
   fight's version.
5. Stable: the accessory sheet's filter and lines; check the picker, the Paladin's trees, "Learns fastest", the preset
   and the battle sheet under the local switch (most follow the domain unchanged).
6. Party Hall, the world map's fight button, the Rift's suggestions: one healer.
7. Help sheets: v2 text by `rpgV2()`.
8. **Tests:**
   - `battle/battle-view.test.ts`: on a v15 state (an input with `version: 15`, which the engine accepts), a Summoner's
     `pairOf` leads with a Tome half and builds an action the engine accepts; a v14 state keeps her single half; Limit
     Break options read the fight's table (`cleric-3` is Archangel's Verdict in a v14 fight, Dawn Hymn in a v15 one);
   - `battle/labels` cases with an explicit generation: a Spell Blade's v2 Arms line counts n + 1 hits at ×0.63; a v2
     Summoner's Tome line says it lingers and strikes every foe; v1 lines equal today's;
   - the accessory sheet's choices (extract the pure helper with an `engine` argument): v2 Damage lists only Orbs, v2
     Support only Talismans and Amulets, v1 as today;
   - the Party Hall's note from `healerBlock` (the helper, mocked to v15 if needed: see `save/rift-hook.test.ts`);
   - `battle/pixel-icons.test.tsx`: `class/paladin` exists in the pinned atlas at 24×24;
   - every existing web test passes unchanged.
9. **Check it locally** (your own ports; desktop browser; never the iOS Simulator), on a scratch v24 save from the CJS
   build with: a Late-style Cleric Hero in the Chapel's seat 3 with Learners, a party of two Clerics, an Uma wearing two
   Orbs, a Summoner and a Spell Blade in a full party:
   - **without** the local switch: every screen as today (five halls, "Accessory 1/2", a one-half Summoner);
   - **with** it, at 390×844 and 375×667, light and dark: the Learning page's six halls (no overlap with the road, names
     readable), the Bastion's page and its four Limit Breaks (Archangel's Verdict's Hero moved there), the Chapel's new
     seats 3–4; the Stable's picker with the Paladin and a crisp emblem; a Paladin's trees with Valkyrie's Oath; Gear's
     Damage and Support rows and sheets, the preset; the Party Hall's note on the two-Cleric party, fixed by switching one
     to Paladin; a v15 world-map fight on Auto and by hand with the Summoner's pair, the farewell's text, a Spell Blade's
     double Arms hit and a Cleric's Regen; the Rift's guidance with a Paladin.
   - Describe what you saw. Say which screens touch the edges (the owner checks them on the phone after H61).

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 8 pass; the domain's v14 replay tests stay green.
- [ ] `git diff` has no switch: `BATTLE_ENGINE_VERSION` 14, `SAVE_SCHEMA_VERSION` 24, `toV25` unchained.
- [ ] Both local checks in step 9 were done and described. Nothing from the original games in git; screenshots with
  original art stay local.
- [ ] `docs/game/` is unchanged and `pnpm docs:update` leaves no diff; the D-decision is logged; classes-v2 §7 gains
  "Screens built in H59 (D…), live from H61."
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit; the live game looks as before.

## Deliver

- **A delegated worker (Claude or ChatGPT):** a pull request from `feat/h59-classes-v2-screens` with one commit,
  `feat(web): the classes v2 screens, inert until the switch (H59)`. H60 edits the domain's balance and Rift files at
  the same time (no web files): rebase if your domain edits (`hub/places.ts`) meet. Fetch `main` before you push.
  Claude's main session reviews and merges it (ChatGPT may merge its own), then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H59 done (D…)` commit deletes this file, sets H59 to Done with a
  Done row, and sets H61 to Ready if H60 is done.
