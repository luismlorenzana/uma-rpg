import gear from '@luismlorenzana/uma-art/gear/atlas.json'
import gems from '@luismlorenzana/uma-art/gems/atlas.json'
import items from '@luismlorenzana/uma-art/items/atlas.json'
import {
  EQUIP_TYPES, gearId, GEM_IDENTITIES, GEMS, ITEM_FAMILIES, ITEMS, LINE_ITEMS, MADE_IDENTITIES,
  type AccessorySlotState,
} from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { accessoryIconId, gearArt, iconFrame, SHEET_SIZE } from './frames'

describe('icon frames (P37–P38)', () => {
  it('finds every item, gear piece and Star Gem where the published indexes put it', () => {
    // The atlas also holds uma-racer's families; every item of this game is in it.
    for (const i of ITEMS) expect(items.frames[i.id as keyof typeof items.frames], i.id).toBeDefined()
    for (const f of ITEM_FAMILIES) for (const i of [...f.raw, ...f.refined]) expect(iconFrame(i.id), i.id).toMatchObject({ sheet: 'items', x: items.frames[i.id as keyof typeof items.frames]!.x, y: items.frames[i.id as keyof typeof items.frames]!.y })
    expect(Object.keys(gems.frames)).toEqual(GEM_IDENTITIES.map(g => g.id))
    expect(GEMS).toHaveLength(100)
    for (const g of GEMS) {
      const f = gems.frames[g.id as keyof typeof gems.frames]
      expect(f, g.id).toMatchObject({ w: 32, h: 32, name: g.name, kind: g.kind, grade: g.grade, effects: g.effects })
      expect(iconFrame(g.id), g.id).toEqual({ sheet: 'gems', x: f.x, y: f.y })
    }
    for (const t of EQUIP_TYPES) for (let g = 1; g <= 10; g++) {
      const art = gearArt(t)
      // Every type its own row; the Arms their colored one (D234).
      const own = ['greatsword', 'axe', 'lance', 'bow', 'katana'].includes(t) ? `${t}-hue` : t
      expect(art, `${t}: borrowed art is not allowed`).toEqual({ row: own })
      const f = gear.frames[`${own}-g${g}` as keyof typeof gear.frames]
      expect(f, `${t}: no art row ${art.row}`).toBeDefined()
      expect(iconFrame(gearId(t, g)), `${t}-g${g}`).toEqual({ sheet: 'gear', x: f.x, y: f.y, ...(art.kind ? { kind: art.kind } : {}) })
    }
    expect([items, gear, gems].map((a) => ({ w: a.width, h: a.height }))).toEqual([SHEET_SIZE.items, SHEET_SIZE.gear, SHEET_SIZE.gems])
    expect(iconFrame('gem-unknown-1')).toBeNull()
  })

  it('finds every material, made item, jewel and accessory form', () => {
    for (const made of MADE_IDENTITIES.filter((m) => !m.line.startsWith('jewel-') && m.line !== 'tome-ink')) {
      const frame = items.frames[made.id as keyof typeof items.frames]
      expect(frame, made.id).toBeDefined()
      expect(iconFrame(made.id), made.id).toEqual({ sheet: 'items', x: frame!.x, y: frame!.y })
    }
    // The hundred line items (FL15): each at its own frame in uma-art's atlas.
    for (const m of LINE_ITEMS) {
      const frame = items.frames[m.id as keyof typeof items.frames]
      expect(frame, m.id).toBeDefined()
      expect(iconFrame(m.id), m.id).toEqual({ sheet: 'items', x: frame!.x, y: frame!.y })
    }
    // Tome Ink (the farm by line, FL15) borrows the essences' refined row, the infusion bottles, at its grade.
    const infusions = ITEM_FAMILIES.find((f) => f.id === 'essences')!.refined
    for (const made of MADE_IDENTITIES.filter((m) => m.line === 'tome-ink')) {
      const frame = items.frames[infusions[made.grade - 1]!.id as keyof typeof items.frames]
      expect(iconFrame(made.id), made.id).toEqual({ sheet: 'items', x: frame.x, y: frame.y })
    }
    const jewelArt = {
      'jewel-planet-1': 'gem-sun-4', 'jewel-planet-2': 'gem-sun-4', 'jewel-planet-3': 'gem-sun-6',
      'jewel-planet-4': 'gem-sun-8', 'jewel-planet-5': 'gem-sun-10',
      'jewel-moon-1': 'gem-limit-2', 'jewel-moon-2': 'gem-limit-4', 'jewel-moon-3': 'gem-limit-6',
      'jewel-moon-4': 'gem-limit-8', 'jewel-moon-5': 'gem-limit-10',
    } as const
    for (const [id, art] of Object.entries(jewelArt)) {
      const frame = gems.frames[art]
      expect(iconFrame(id), id).toEqual({ sheet: 'gems', x: frame.x, y: frame.y })
    }

    const slot = (family: AccessorySlotState['family'], grade: number, kind?: AccessorySlotState['kind']): AccessorySlotState =>
      ({ family, grade, form: 'base', ...(kind ? { kind } : {}) })
    const bellRows = { greatsword: 'talisman-vital', axe: 'talisman-vampire', lance: 'talisman-bulwark', bow: 'talisman-iron', katana: 'talisman-thorn',
      fire: 'amulet-spring', ice: 'amulet-siphon', lightning: 'amulet-veil', light: 'amulet-ward', dark: 'amulet-mirror' } as const
    for (let grade = 1; grade <= 10; grade++) {
      const forms = [slot('pendant', grade), slot('insignia', grade),
        ...Object.keys(bellRows).map(kind => slot('orb', grade, kind as AccessorySlotState['kind'])),
        ...Object.keys(bellRows).map(kind => slot('bell', grade, kind as AccessorySlotState['kind']))]
      for (const state of forms) {
        const row = state.family === 'pendant' ? 'charm' : state.family === 'insignia' ? 'ring'
          : state.family === 'orb' ? (state.kind!.match(/^(greatsword|axe|lance|bow|katana)$/) ? `orb-${state.kind}-hue` : `orb-${state.kind}`) : bellRows[state.kind!]
        const frame = gear.frames[`${row}-g${grade}` as keyof typeof gear.frames]!
        expect(iconFrame(accessoryIconId(state))).toEqual({ sheet: 'gear', x: frame.x, y: frame.y,
          ...('kind' in state && state.kind ? { kind: state.kind } : {}) })
      }
    }
    expect(iconFrame(accessoryIconId(slot(null, 0)))).toBeNull()
  })
})
