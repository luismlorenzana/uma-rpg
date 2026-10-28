# S7 — Forge and equipment

> **Status: built and deploying, 2026-10-10.** Design: [forge.md](../../design/forge.md), game design §7, D59.

## Goal

Craft gear from refined materials, bind it to Umas, and feel it in battle; foes later in the tier expect it.

## What the owner sees

- **The Forge** (Wilds) opens: pick an Uma, then a type, a grade (her Gathering & Crafting level opens them) and an
  accent; the materials and how many the Warehouse covers show before **Start**. Gear lands on the Warehouse's
  **Gear** shelf.
- **Profiles** get a **Gear** card: her build's weapon slots, armor and accessory. Tapping a slot lists her own pieces
  and the stock (marked **binds**); mastery gates show on the pieces she can't wear yet. The card totals her gear and
  Extra Stats bonuses.
- Fights use what she wears.

## Exit check

Historical check; releases use the [current phone script](../../../testing/phone-check.md).

Craft a grade-1 weapon for an Uma's build and a garb, equip both (binding them), win a fight with her, and check that
a grade-2 piece asks for mastery rank 2.
