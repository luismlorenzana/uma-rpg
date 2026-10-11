import dishes from '@luismlorenzana/uma-art/dishes/atlas.json'
import gear from '@luismlorenzana/uma-art/gear/atlas.json'
import items from '@luismlorenzana/uma-art/items/atlas.json'
import { DISHES, EQUIP_TYPES, gearId, ITEM_EFFECTS, ITEM_FAMILIES, ITEMS } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { ACCENT_COLOR, gearArt, iconFrame, SHEET_SIZE } from './frames'

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
      const f = gear.frames[`${art.row}-g${g}` as keyof typeof gear.frames]
      expect(iconFrame(gearId(t, g, 'atk')), `${t}-g${g}`).toEqual({ sheet: 'gear', x: f.x, y: f.y, accent: 'atk', ...(art.kind ? { kind: art.kind } : {}) })
    }
    expect([items, dishes, gear].map((a) => ({ w: a.width, h: a.height }))).toEqual([SHEET_SIZE.items, SHEET_SIZE.dishes, SHEET_SIZE.gear])
    expect(Object.keys(ACCENT_COLOR).sort()).toEqual([...ITEM_EFFECTS].sort())
  })
})
