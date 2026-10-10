# T013 — Party Hall page

**Goal:** 20 parties of five, edited with one Uma per party (D46).

## Build

- `apps/web/src/places/party-hall/`: `PartyHallPeek` (parties full / 20, Enter), `PartyHallPage` (20 cards: name, five
  slot icons with level, "Edit"), and `PartyEditor` at `/town/party-hall/:n` (rename, five slots).
- Slot actions: tap an empty slot → **picker** sheet (owned Umas, search, each row shows "in Party 3" when she's
  elsewhere: picking moves her); tap a filled slot → **Swap** (picker) or **Remove**.
- Busy members render greyed with a "Busy" tag (rule from T011; none until S4).
- With no owned Umas, the page points to the Stable.

## Done when

A component test for add → move → remove; rename validation; the page at both phone sizes.
