import { describe, expect, it } from 'vitest'
import { accessoryFits, ACCESSORY_TYPES, EQUIP_TYPES, gearId, gearIdentity, isOrb, isAccessory, type EquipType, type GearSlot } from '../economy/gear-id'
import { ACCESSORY_KINDS, ACCESSORY_SLOTS, ARMOR_KINDS, ARMOR_SLOT_KINDS, ARMOR_SLOTS, newRanks, WEAPON_TYPES, type ArmorKind, type Ranks } from '../economy/ranks'
import { GEM_IDENTITIES, STAR_NODES } from '../economy/stars'
import { rpgDefaultWeapons, rpgProfileTrees, type RpgClass } from '../rpg/rules'
import { classOf } from './battle'
import { equipBlock, gearChoices } from './forge'
import { nodeFromGem } from './observatory'
import { newOwnedUma, newTierWorld, slotKind, type OwnedUma, type TierWorld } from './save'
import { upgradesFor } from './upgrades'

const NOW = '2026-10-21T12:00:00.000Z'
/** One invented Brawler, '101', in a fresh world with this stock. */
function world(uma: Partial<OwnedUma> = {}, gear: Record<string, number> = {}, gems: Record<string, number> = {}): TierWorld {
  return { ...newTierWorld(NOW, 0), gear, gems, umas: { '101': { ...newOwnedUma(NOW, 'brawler'), ...uma } } }
}
const ranks = (set: { weapons?: Record<string, number>; armors?: Record<string, number>; accessories?: Record<string, number>; classes?: Record<string, number> }): Ranks => {
  const r = newRanks()
  const tracks = (m: Record<string, number> = {}) => Object.fromEntries(Object.entries(m).map(([k, rank]) => [k, { rank, exp: 0 }]))
  return { ...r, weapons: tracks(set.weapons), armors: tracks(set.armors), accessories: tracks(set.accessories), classes: tracks(set.classes) }
}
const gearOf = (locker: string[], equipped: Partial<Record<GearSlot, string>> = {}, kinds: Partial<Record<string, ArmorKind>> = {}): OwnedUma['gear'] =>
  ({ locker: [...new Set([...locker, ...Object.values(equipped) as string[]])], equipped, kinds: { ...newOwnedUma(NOW, 'brawler').gear.kinds, ...kinds } })
const up = (w: TierWorld, classId: RpgClass = 'brawler') => upgradesFor(w, '101', classId)!

describe('can upgrade (H34)', () => {
  it('counts a weapon slot when the next grade is in stock and her Weapon Rank allows it', () => {
    expect(up(world({}, { 'greatsword-g1': 1 }))).toMatchObject({ gearSlots: ['greatsword'], gear: 1, any: true })
    const wearsG1 = { gear: gearOf([], { greatsword: 'greatsword-g1' }) }
    expect(up(world(wearsG1, { 'greatsword-g2': 2 })).gear).toBe(0)
    expect(up(world({ ...wearsG1, ranks: ranks({ weapons: { greatsword: 2 } }) }, { 'greatsword-g2': 2 })).gearSlots).toEqual(['greatsword'])
  })

  it('skips stock above her rank, two grades ahead, or of a weapon outside her five', () => {
    expect(up(world({}, { 'greatsword-g2': 1 })).gear).toBe(0)
    expect(up(world({ ranks: ranks({ weapons: { axe: 3 } }) }, { 'axe-g3': 1 })).gear).toBe(0)
    expect(up(world({ gear: gearOf([], { lance: 'lance-g1' }) }, { 'lance-g2': 1 })).gear).toBe(0)
    expect(up(world({}, { 'tome-fire-g1': 3 })).gear).toBe(0)
    expect(up(world({}, { 'tome-fire-g1': 3 }), 'mage').gearSlots).toEqual(['tome-fire'])
    expect(up(world({}, { 'greatsword-g1': 0 })).gear).toBe(0)
  })

  it('counts her own better piece she isn\'t wearing', () => {
    const r = ranks({ weapons: { bow: 2 } })
    expect(up(world({ ranks: r, gear: gearOf(['bow-g2'], { bow: 'bow-g1' }) })).gearSlots).toEqual(['bow'])
    expect(up(world({ ranks: r, gear: gearOf(['bow-g1', 'bow-g2']) })).gearSlots).toEqual(['bow'])
    expect(up(world({ ranks: r, gear: gearOf(['bow-g1'], { bow: 'bow-g2' }) })).gear).toBe(0)
  })

  it('counts armor only of the kind each slot holds', () => {
    expect(slotKind(newOwnedUma(NOW, 'brawler').gear, 'head')).toBe('helm')
    expect(up(world({}, { 'helm-g1': 1, 'circlet-g1': 1, 'robe-g1': 1 })).gearSlots).toEqual(['head'])
    expect(up(world({ gear: gearOf([], {}, { head: 'circlet', body: 'robe' }) }, { 'helm-g1': 1, 'circlet-g1': 1, 'robe-g1': 1 })).gearSlots).toEqual(['head', 'body'])
    expect(up(world({ gear: gearOf([], {}, { head: 'circlet' }) }, { 'helm-g1': 1 })).gear).toBe(0)
    // A G1 helm she owns but took off for the circlet's Training piece is the other kind: not counted.
    expect(up(world({ gear: gearOf(['helm-g1'], {}, { head: 'circlet' }) })).gear).toBe(0)
  })

  it('counts an empty accessory slot she can fill with its type: an Orb the Damage slot, a support the Support slot (C10)', () => {
    expect(up(world({}, { 'talisman-vital-g1': 4 })).gearSlots).toEqual(['accessory-2'])
    expect(up(world({}, { 'talisman-vital-g1': 1, 'amulet-spring-g1': 1 })).gearSlots).toEqual(['accessory-2'])
    expect(up(world({}, { 'talisman-vital-g1': 1, 'orb-fire-g1': 1 })).gearSlots).toEqual(['accessory-1', 'accessory-2'])
    const vital = gearOf([], { 'accessory-2': 'talisman-vital-g1' })
    expect(up(world({ gear: vital }, { 'talisman-vital-g1': 1, 'talisman-vital-g2': 1 })).gear).toBe(0)
    expect(up(world({ gear: vital, ranks: ranks({ accessories: { talisman: 2 } }) }, { 'talisman-vital-g2': 1 })).gearSlots).toEqual(['accessory-2'])
    expect(up(world({ gear: gearOf(['orb-fire-g1'], { 'accessory-2': 'talisman-vital-g1' }) })).gearSlots).toEqual(['accessory-1'])
    expect(up(world({ gear: gearOf([], { 'accessory-2': 'talisman-vital-g1' }) }, { 'orb-axe-g2': 1 })).gear).toBe(0)
  })

  it('agrees with each slot sheet\'s enabled choices (gearChoices + equipBlock)', () => {
    let seed = 7
    const rand = (n: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n }
    const pick = <T,>(xs: readonly T[]) => xs[rand(xs.length)]!
    const grade = (id: string) => gearIdentity(id)!.grade
    for (let trial = 0; trial < 300; trial++) {
      const stock: Record<string, number> = {}
      for (let i = 0; i < 60; i++) stock[gearId(pick(EQUIP_TYPES), 1 + rand(10))] = rand(3)
      const rank = (keys: readonly string[]) => Object.fromEntries(keys.map((k) => [k, 1 + rand(10)]))
      const r = ranks({ weapons: rank(WEAPON_TYPES), armors: rank(ARMOR_KINDS), accessories: rank(ACCESSORY_KINDS) })
      const locker = Array.from({ length: rand(20) }, () => gearId(pick(EQUIP_TYPES), 1 + rand(10)))
      const kinds = Object.fromEntries(ARMOR_SLOTS.map((s) => [s, pick(ARMOR_SLOT_KINDS[s])]))
      const equipped: Partial<Record<GearSlot, string>> = {}
      for (const id of locker) {
        const { type } = gearIdentity(id)!
        if ((WEAPON_TYPES as readonly string[]).includes(type) && rand(2)) equipped[type as GearSlot] = id
        const slot = ARMOR_SLOTS.find((s) => kinds[s] === type)
        if (slot && rand(2)) equipped[slot] = id
      }
      // Classes v2's typed slots: an Orb in accessory 1, a Talisman or an Amulet in accessory 2.
      const accessories = locker.filter((id) => isAccessory(gearIdentity(id)!.type))
      const orb = accessories.find((id) => isOrb(gearIdentity(id)!.type)), support = accessories.find((id) => !isOrb(gearIdentity(id)!.type))
      if (orb && rand(2)) equipped['accessory-1'] = orb
      if (support && rand(2)) equipped['accessory-2'] = support
      const w = world({ ranks: r, gear: gearOf(locker, equipped, kinds) }, stock)
      const uma = w.umas['101']!
      const worn = (slot: GearSlot) => (uma.gear.equipped[slot] ? grade(uma.gear.equipped[slot]!) : 0)
      const ready = (match: (type: EquipType) => boolean, above: number) =>
        gearChoices(uma, w.gear, (p) => match(p.type)).some((c) => !equipBlock(uma, c.id) && grade(c.id) > above)
      const expected: GearSlot[] = classOf(uma, 'brawler').weapons.filter((t) => ready((p) => p === t, worn(t)))
      for (const slot of ARMOR_SLOTS) if (ready((p) => p === slotKind(uma.gear, slot), worn(slot))) expected.push(slot)
      const typeIn = (slot: GearSlot) => (uma.gear.equipped[slot] ? gearIdentity(uma.gear.equipped[slot]!)!.type : undefined)
      for (const slot of ACCESSORY_SLOTS) {
        const type = typeIn(slot)
        if (type ? ready((p) => p === type, worn(slot)) : ACCESSORY_TYPES.some((t) => accessoryFits(slot, t) && ready((p) => p === t, 0))) expected.push(slot)
      }
      expect(up(w).gearSlots, `trial ${trial}`).toEqual(expected)
    }
  })

  it('counts points only when a side skill can be learned now', () => {
    const at = (classes: Record<string, number>, tree: string[] = []) =>
      world({ ranks: ranks({ classes }), classes: { brawler: { weapons: rpgDefaultWeapons('brawler'), tree, loadout: null } } })
    for (const rank of [1, 2, 3, 4]) expect(up(at({ brawler: rank })).points, `Class Rank ${rank}`).toBe(0)
    expect(up(at({ brawler: 5 })).points).toBe(5)
    const trees = rpgProfileTrees({ classId: 'brawler', weapons: rpgDefaultWeapons('brawler') })
    const firstSides = trees.map((t) => `${t}.1a`)
    expect(up(at({ brawler: 9 }, firstSides.slice(0, 4))).points).toBe(5)
    expect(up(at({ brawler: 9 }, firstSides))).toMatchObject({ points: 0, any: false })
    expect(up(at({ brawler: 15 }, firstSides)).points).toBe(10)
    expect(up(at({ brawler: 1, mage: 20 })).points).toBe(0)
    expect(up(at({ brawler: 1, mage: 20 }), 'mage').points).toBe(20)
  })

  it('counts no points from engine v16, where nothing costs points (H65, CP14)', () => {
    const w = world({ ranks: ranks({ classes: { brawler: 15 } }), classes: { brawler: { weapons: rpgDefaultWeapons('brawler', 16), tree: [], loadout: null } } })
    expect(upgradesFor(w, '101', 'brawler', 1, 15)!.points).toBe(15)
    expect(upgradesFor(w, '101', 'brawler', 1, 16)).toMatchObject({ points: 0, any: false })
  })

  it('counts settable gem kinds and free active slots, agreeing with nodeFromGem for all 100 gems', () => {
    const all = Object.fromEntries(GEM_IDENTITIES.map((g) => [g.id, 1]))
    let seed = 3
    const rand = (n: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n }
    for (let trial = 0; trial < 50; trial++) {
      const unlocked = STAR_NODES.filter(() => rand(4) === 0)
      const active = unlocked.slice(0, rand(unlocked.length + 1))
      const level = 1 + rand(50)
      const w = world({ level, stars: { unlocked, active } }, {}, all)
      const uma = w.umas['101']!
      const u = up(w)
      expect(u.gems).toBe(GEM_IDENTITIES.filter((g) => nodeFromGem(uma, g.id)).length)
      expect(u.freeNodes).toBe(Math.max(0, Math.min(5 + Math.floor(level / 2) - active.length, unlocked.length - active.length)))
      expect(u.stars).toBe(u.gems + u.freeNodes)
    }
    expect(up(world({}, {}, { 'gem-hp-1': 1, 'gem-hp-2': 1, 'gem-sun-6': 1 }))).toMatchObject({ gems: 1, freeNodes: 0, stars: 1, any: true })
    expect(up(world({ level: 10, stars: { unlocked: ['moon:hp:1', 'moon:hp:2', 'moon:atk:1'], active: ['moon:hp:1'] } }))).toMatchObject({ gems: 0, freeNodes: 2, stars: 2 })
    expect(up(world({ level: 1, stars: { unlocked: STAR_NODES.slice(0, 8), active: STAR_NODES.slice(0, 5) } })).freeNodes).toBe(0)
  })

  it('returns null for an Uma not owned; a fresh Uma with an empty stock has nothing', () => {
    expect(upgradesFor(world(), '999', 'brawler')).toBeNull()
    expect(up(world())).toEqual({ gearSlots: [], gear: 0, points: 0, gems: 0, freeNodes: 0, stars: 0, any: false })
  })

  // A guard against an accidental quadratic blowup, not a micro-benchmark: about 20 ms locally, and shared CI runners can be
  // several times slower (104 ms once against the old 100 ms bound).
  it('computes 268 Umas against a full stock in well under half a second', () => {
    const gear = Object.fromEntries(EQUIP_TYPES.flatMap((t) => Array.from({ length: 10 }, (_, g) => [gearId(t, g + 1), 2])))
    const gems = Object.fromEntries(GEM_IDENTITIES.map((g) => [g.id, 2]))
    expect(Object.keys(gear)).toHaveLength(400)
    const umas: Record<string, OwnedUma> = {}
    for (let i = 0; i < 268; i++) {
      const own = EQUIP_TYPES.slice(0, i % 40).map((t) => gearId(t, 1 + (i % 3)))
      umas[String(1000 + i)] = { ...newOwnedUma(NOW, 'brawler'), level: 1 + (i % 50), ranks: ranks({ classes: { brawler: 1 + (i % 50) }, weapons: { greatsword: 5 } }),
        gear: gearOf(own), stars: { unlocked: STAR_NODES.slice(0, i % 100), active: [] } }
    }
    const w: TierWorld = { ...newTierWorld(NOW, 0), gear, gems, umas }
    const start = performance.now()
    let marked = 0
    for (const id of Object.keys(umas)) if (upgradesFor(w, id, 'brawler')!.any) marked++
    expect(performance.now() - start).toBeLessThan(400)
    expect(marked).toBe(268)
  })
})
