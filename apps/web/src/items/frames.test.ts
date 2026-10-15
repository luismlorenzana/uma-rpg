import dishes from '@luismlorenzana/uma-art/dishes/atlas.json'
import gear from '@luismlorenzana/uma-art/gear/atlas.json'
import items from '@luismlorenzana/uma-art/items/atlas.json'
import { DISHES, EQUIP_TYPES, gearId, ITEM_FAMILIES, ITEMS } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { gearArt, iconFrame, SHEET_SIZE } from './frames'

describe('icon frames (P37–P38)', () => {
  it('finds every item, dish and gear piece where the published indexes put it', () => {
    expect(Object.keys(items.frames).sort()).toEqual(ITEMS.map((i) => i.id).sort())
    for (const f of ITEM_FAMILIES) for (const i of [...f.raw, ...f.refined]) expect(iconFrame(i.id), i.id).toMatchObject({ sheet: 'items', x: items.frames[i.id as keyof typeof items.frames]!.x, y: items.frames[i.id as keyof typeof items.frames]!.y })
    expect(Object.keys(dishes.frames)).toHaveLength(DISHES.length)
    for (const d of DISHES) {
      const f = dishes.frames[d.id as keyof typeof dishes.frames]
      expect(iconFrame(d.id), d.id).toEqual({ sheet: 'dishes', x: f.x, y: f.y })
    }
    for (const t of EQUIP_TYPES) for (let g = 1; g <= 10; g++) {
      const art = gearArt(t)
      expect(art, `${t}: borrowed art is not allowed`).toEqual({ row: t })
      const f = gear.frames[`${t}-g${g}` as keyof typeof gear.frames]
      expect(f, `${t}: no art row ${art.row}`).toBeDefined()
      expect(iconFrame(gearId(t, g)), `${t}-g${g}`).toEqual({ sheet: 'gear', x: f.x, y: f.y, ...(art.kind ? { kind: art.kind } : {}) })
    }
    expect([items, dishes, gear].map((a) => ({ w: a.width, h: a.height }))).toEqual([SHEET_SIZE.items, SHEET_SIZE.dishes, SHEET_SIZE.gear])
  })
})
