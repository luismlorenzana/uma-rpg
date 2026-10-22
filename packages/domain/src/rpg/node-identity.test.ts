import { describe, expect, it } from 'vitest'
import { RPG_NODES } from './catalog'
import { RPG_CLASSES, RPG_WEAPONS } from './kinds'
import { rpgNodeIdentity } from './node-identity'

describe('light skill identities (H16)', () => {
  it('matches every generated node and recognizes no extra class/weapon trees', () => {
    expect(RPG_NODES).toHaveLength(750) // six classes × ten trees × 15 (classes v2, live since H61)
    const ids = new Set(RPG_NODES.map((n) => n.id))
    for (const n of RPG_NODES) expect(rpgNodeIdentity(n.id)).toEqual({ id: n.id, tree: n.tree, classId: n.classId,
      weapon: n.weapon, depth: n.depth, variant: n.variant, cost: n.cost })
    for (const c of RPG_CLASSES) for (const w of RPG_WEAPONS) for (let d = 0; d <= 6; d++) for (const suffix of ['', 'a', 'b', 'c']) {
      const id = `${c}-${w}.${d}${suffix}`
      expect(!!rpgNodeIdentity(id), id).toBe(ids.has(id))
    }
    for (const id of ['', 'brawler-greatsword.01', 'brawler-greatsword.1a.extra', 'brawler-spear.1', 'mage-tome-flame.1', 'unknown-bow.1']) {
      expect(rpgNodeIdentity(id), id).toBeUndefined()
    }
  })
})
