# T011 — Save v2: roster and parties

**Goal:** the save holds owned Umas and 20 parties, with the rules for unlocking and party edits in `@rpg/domain`.

## Build

```ts
interface OwnedUma { unlockedAt: string; level: number; exp: number }          // level 1, exp 0 in S2
interface Party { name: string; slots: (string | null)[] }                       // 5 slots of outfit ids
interface TierWorld { createdAt; wallet; umas: Record<string, OwnedUma>; parties: Party[] }  // 20 parties
```

- `schemaVersion: 2`. `parseSave` accepts v1 and migrates it (empty `umas`, 20 parties named "Party 1"…"Party 20");
  everything it returns is v2. Strict as before: unknown keys, bad counts, out-of-range levels, party count ≠ 20, slot
  arrays ≠ 5, an Uma in two parties or in a slot without being owned: all rejected.
- Rules (pure, each returns a new save or throws `SaveRuleError` with a reason):
  - `unlockUma(save, outfitId, now)`: needs a ticket, not already owned; spends 1, adds Lv1.
  - `setPartySlot(save, partyIndex, slot, outfitId | null)`: owned only; if she's in another party (or another slot of
    this one), she moves; returns the save.
  - `renameParty(save, index, name)`: 1–24 characters after trimming.
  - `addShards(wallet, n)`: five Shards become one Ticket automatically (D47).
  - `partyOf(save, outfitId)` and `isBusy(save, outfitId)` (always false until S4 adds assignments).
- The API: a `PUT` whose raw `schemaVersion` is lower than the stored one gets **409** with the stored envelope, so an
  old installed app can't overwrite a newer save (D45). The web app adopts it after updating.

## Done when

Domain tests cover the migration, every rule and its errors, and the parser's new rejections; the API test covers the
downgrade 409. The web store exposes `unlock`, `setSlot`, `renameParty` actions that commit like `renameAccount`.
