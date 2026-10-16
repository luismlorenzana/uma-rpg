import gear from '@luismlorenzana/uma-art/gear/atlas.json'
import items from '@luismlorenzana/uma-art/items/atlas.json'
import { EQUIP_TYPES, gearId, GEMS, ITEM_FAMILIES, ITEMS } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { gearArt, iconFrame, SHEET_SIZE } from './frames'

describe('icon frames (P37–P38)', () => {
  it('finds every item, gear piece and Star Gem where the published indexes put it', () => {
    // The atlas also holds uma-racer's families; every item of this game is in it.
    for (const i of ITEMS) expect(items.frames[i.id as keyof typeof items.frames], i.id).toBeDefined()
    for (const f of ITEM_FAMILIES) for (const i of [...f.raw, ...f.refined]) expect(iconFrame(i.id), i.id).toMatchObject({ sheet: 'items', x: items.frames[i.id as keyof typeof items.frames]!.x, y: items.frames[i.id as keyof typeof items.frames]!.y })
    // A Star Gem borrows its grade's cut crystal, with its planets as a badge (D144).
    for (const g of GEMS) {
      const f = items.frames[`cut-${['quartz', 'amethyst', 'citrine', 'garnet', 'emerald', 'sapphire', 'ruby', 'diamond', 'starstone', 'philosophers-stone'][g.grade - 1]}` as keyof typeof items.frames]
      expect(iconFrame(g.id), g.id).toEqual({ sheet: 'items', x: f.x, y: f.y, planets: g.effects })
    }
    for (const t of EQUIP_TYPES) for (let g = 1; g <= 10; g++) {
      const art = gearArt(t)
      expect(art, `${t}: borrowed art is not allowed`).toEqual({ row: t })
      const f = gear.frames[`${t}-g${g}` as keyof typeof gear.frames]
      expect(f, `${t}: no art row ${art.row}`).toBeDefined()
      expect(iconFrame(gearId(t, g)), `${t}-g${g}`).toEqual({ sheet: 'gear', x: f.x, y: f.y, ...(art.kind ? { kind: art.kind } : {}) })
    }
    expect([items, gear].map((a) => ({ w: a.width, h: a.height }))).toEqual([SHEET_SIZE.items, SHEET_SIZE.gear])
  })
})
