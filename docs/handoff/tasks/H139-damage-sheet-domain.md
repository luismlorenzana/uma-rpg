# H139 — Details v2: the damage numbers, proved equal to a fight's

**uma-rpg · Claude or ChatGPT · S · Needs: nothing · Unblocks: H140**

## Why

The owner wants to see what each of an Uma's three weapons hits with, split by source. Nothing computes that today: the sheet shows
ATK, M.ATK, three Might rows and three accessory rows, and leaves the sum to the player. The sheet's "gear" also lumps armor with Pendants
and Charms, so the owner couldn't tell whether armor still gave ATK (it does).

This packet adds the numbers and no pixels: `umaDamageSheet` in the domain, and armor and accessory apart on the sheet's rows. The numbers
must never drift from a fight, so a test builds a real fight and compares. H140 draws them.

No rule, save or balance change.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`.
- **The design:** [proposal.md](../../design/profile-polish/proposal.md) §1, §2 and PP3, PP5, PP7, PP8, PP9, PP14, PP15. The
  [Details page](../../design/profile-polish/previews/details.html) has the numbers worked out.
- **The manual:** [combat § Damage](../../game/combat.md#damage), step 1; [Her accessory and signature](../../game/combat.md#her-accessory-and-signature).
- **The code on `main` at `c885053`:**
  - `packages/domain/src/rpg/battle/engine.ts:375–389`: `battleDamage`, the sum this packet mirrors (`stat + might + signature + flat`);
    `:636–642`, `strike`: every Uma hit has a kind, and `battleChannel(part.kind)` picks the stat;
  - `packages/domain/src/save/sheet.ts`: `umaBattleSheet`, `SheetRow`, `coreV3`; a file apart from the battle rules so it ships in the Stable's
    lazy chunk (H57). Keep it so;
  - `packages/domain/src/save/battle.ts:291–299`, `umaPointParts`: `gear` is armor (`gradePoints`) + `accessoryOffense`; `:379–385`,
    `partyMembers`: what a fight is given;
  - `packages/domain/src/economy/accessories.ts`: `accessorySlotsParts` (`flat` by kind, `insignia.value` per mille), `accessoryOffense`
    (Pendant and Charm), `signatureBonus`, `signatureWorn`;
  - `packages/domain/src/rpg/campaign/run.ts:94`: how a member's parts reach the ally.

## Decisions made

1. **The sum is the engine's.** For each of `classOf(uma, classId).weapons`, in slot order: `kind = rpgWeaponKind(weapon)`,
   `stat` = ATK when `battleChannel(kind)` is physical, else M.ATK; `might` from `gradeMight`; `orb` from `accessorySlotsParts(...).flat[kind]`;
   `signature` from `signatureBonus` while `signatureWorn`. `total = stat + might + orb + signature`.
2. **The shape**, exported from `save/sheet.ts`:
   ```ts
   /** What makes up her ATK or M.ATK (D-row). */
   export interface OffenseStat { label: 'ATK' | 'M.ATK'; total: number; base: number; armor: number; accessory: number; stars: number; moon: number }
   /** One of her three weapons as it hits, the damage stack's step 1. */
   export interface WeaponDamage { weapon: RpgWeapon; kind: RpgDamageKind; stat: 'ATK' | 'M.ATK'; total: number; base: number; might: number; orb: number; signature: number }
   /** `stats`: the ones her weapons use, ATK first. `bosses`: her Insignias' percent, 0 with none. */
   export interface DamageSheet { weapons: WeaponDamage[]; stats: OffenseStat[]; bosses: number }
   export function umaDamageSheet(outfit: BattleOutfit, uma: OwnedUma, classId?: RpgClass, tier?: number, engine?: number): DamageSheet | null
   ```
3. **`null` for a non-graded Uma** (`!isGrades(uma.gear)`, the older engines' test shapes). H140 hides the section.
4. **`SheetRow` gains `accessory?: number`.** On ATK and M.ATK, `coreV3` sets it from `accessoryOffense`; `gear` stays the sum, so nothing that
   reads it moves, and armor is `gear - accessory`. Other rows have no accessory.
5. **A Pendant or a Charm stays inside the stat** (PP7): it's a real stat and heals read it. Only the Orb is the row's accessory part.
6. **An Orb on a kind she doesn't hold** counts on no row, though a Limit Break of that kind still uses it. A row is one of her three
   weapons, by the design.
7. **`bosses`** is `insignia.value / 10`, as a percent: three slots at G1, G3 and G1 read 5.

## Do

1. **`umaDamageSheet` and `SheetRow.accessory`** in `save/sheet.ts`, reusing `battleSheet`'s `base`, `parts`, `geared`, `boosted` and
   `sharedStats`, so no stat has a second formula. Split the shared lines into a helper if both functions need them.
2. **Tests,** a new `packages/domain/src/save/damage-sheet.test.ts`:
   - **The parity test, the point of this packet.** Across a Brawler, a Sorcerer, an Arms Spellblade, a Cleric and a Tier 0, in Tiers 1, 2 and 3,
     with a Charm, a Pendant, an Orb on a held kind, an Orb on an unheld kind, an Insignia, her signature worn and not, and G0 weapons:
     build the fight through the real path (`partyMembers`, then `rpgBeginRunBattle` or the entry `battle-v3.test.ts` uses) and assert
     every row's `total` equals `ally.stats.atk|matk + (ally.might?.[kind] ?? 0) + (ally.flat?.[kind] ?? 0) + (ally.signature ?? 0)`, read off the fight's
     ally. Then one `battleDamage` at power 1 on a Broken foe with 0 DEF and 0 M.DEF, no weakness, returns `total`.
   - Each `OffenseStat`: `base + armor + accessory + stars + moon === total`, and `total` equals the sheet's row.
   - The screenshot's Sorcerer: M.ATK 70, Might 8 each, a Fire Orb +6, a Charm +3, signature +2 gives 86, 80, 80, with `armor` 10 and `accessory` 3.
   - `stats` holds only the stats her weapons use: a Sorcerer M.ATK alone, a hybrid both, ATK first.
   - `null` for a v1 gear shape, and `umaBattleSheet`'s rows unchanged but for the new field.
3. **Docs:** in [combat § Damage](../../game/combat.md#damage), one line under step 1: "`umaDamageSheet` shows this sum on Details". `pnpm docs:update`.
4. **Log the D-row** (fetch `main` first): "H139: the damage numbers, proved equal to a fight's".

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Main JS unchanged: this code is in the Stable's chunk. Say the number.
- [ ] The parity test covers every case in step 2 and fails if the sum loses a source (try it: drop `signature`, see it fail, restore it).
- [ ] `pnpm docs:update` leaves no diff. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude:** commit to `main`, "feat(domain): the damage numbers, proved equal to a fight's (H139)".
- **ChatGPT:** a branch `feat/h139-damage-sheet` and a pull request with that title; merge it yourself when the checks and CI are green. Fetch
  `main` before you push so the D-number is free.
- **Flag it done:** delete this file, add a Done row in [README.md](../README.md) with the commit, and set H140 to Ready.
