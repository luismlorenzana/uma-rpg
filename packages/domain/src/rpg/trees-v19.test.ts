// Classes v3's trees (H126; classes-v3.md §2.2, §3.4, §3.5; CV6, CV17): the Tome Spellblade's and the Arms Summoner's ten
// trees of eight line nodes each, the five Tier 0 classes' ten trees of one node, the node grammar by class shape, and a
// Tier 0's tree view at engine v19.
import { describe, expect, it } from 'vitest'
import { RPG_ALL_NODES, RPG_NODES, RPG_PIERCE_SCALE, RPG_SKILL_POWER, RPG_TOMEBLADE_DEPTHS, RPG_TOMEBLADE_SPELLS, rpgNode, rpgNodeSkill, rpgTreeNodes } from './catalog'
import { RPG_BRANCH_B, RPG_BRANCH_B_NAME, rpgBranchNode, rpgNodeIdentity, rpgNodeLine, rpgTreeOf, validRpgLines } from './node-identity'
import { isRpgTome, RPG_CLASSES, RPG_TIER0_CLASSES, RPG_WEAPONS, type RpgProfile } from './rules'
import { rpgSkillRankUps, rpgTreeView } from './tree-view'

const V18 = 18, V19 = 19

describe('the catalog with Classes v3 (H126)', () => {
  it('holds 960 nodes: 750 to v18, the two hybrids\' 160 and the Tier 0s\' 50; the live list stays 750', () => {
    expect(RPG_ALL_NODES).toHaveLength(960)
    expect(RPG_NODES).toHaveLength(750)
    expect(new Set(RPG_NODES.map((n) => n.classId))).toEqual(new Set(RPG_CLASSES))
    const of = (c: string) => RPG_ALL_NODES.filter((n) => n.classId === c)
    expect([of('tomeblade').length, of('armsummoner').length]).toEqual([80, 80])
    expect(RPG_TIER0_CLASSES.map((c) => of(c).length)).toEqual([10, 10, 10, 10, 10])
    expect(new Set(RPG_ALL_NODES.map((n) => n.id)).size).toBe(960)
    // Every id is the grammar's, and the grammar's identity is the node's.
    for (const n of RPG_ALL_NODES) expect(rpgNodeIdentity(n.id), n.id).toEqual({ id: n.id, tree: n.tree, classId: n.classId, weapon: n.weapon,
      depth: n.depth, variant: n.variant, cost: n.cost })
  })
})

describe('the two new hybrids\' trees (CV17)', () => {
  it('give each tree its eight line nodes: the trunk, line A\'s cores and line B\'s side, B on the mirrored letters', () => {
    for (const c of ['tomeblade', 'armsummoner'] as const) for (const w of RPG_WEAPONS) {
      const letter = c === 'tomeblade' || !isRpgTome(w) ? 'b' : 'a'
      expect(RPG_BRANCH_B[c][w], `${c} ${w}`).toBe(letter)
      const tree = rpgTreeOf(c, w)
      expect(rpgTreeNodes(tree).map((n) => n.id)).toEqual([1, 2, 3, 4, 5].map((d) => `${tree}.${d}`).concat([3, 4, 5].map((d) => `${tree}.${d}${letter}`)))
      expect([3, 4, 5].map((d) => rpgNodeLine(`${tree}.${d}${letter}`))).toEqual(['B', 'B', 'B'])
      expect([1, 2, 3].map((d) => rpgNodeLine(`${tree}.${d}`))).toEqual(['trunk', 'trunk', 'A'])
      expect(rpgBranchNode(c, w, 4, 'B')).toBe(`${tree}.4${letter}`)
    }
    expect(RPG_BRANCH_B_NAME.tomeblade['tome-light']).toBe('Pierce')
    expect([RPG_BRANCH_B_NAME.armsummoner.axe, RPG_BRANCH_B_NAME.armsummoner['tome-dark']]).toEqual(['Bonded', 'Pack'])
  })

  it('names the Tome Spellblade\'s skills her own way: a blade word a depth, a spell word on her Tomes, the blade nouns on her Arms', () => {
    expect(RPG_TOMEBLADE_DEPTHS).toEqual(['Edged', 'Honed', 'Whetted', 'Gleaming', 'Sovereign'])
    expect(RPG_TOMEBLADE_SPELLS).toEqual({ fire: 'Pyre', ice: 'Frost', lightning: 'Volt', light: 'Lumen', dark: 'Umbra' })
    expect(rpgTreeNodes('tomeblade-tome-lightning').map((n) => n.name)).toEqual(['Edged Volt', 'Honed Volt', 'Whetted Volt', 'Gleaming Volt',
      'Sovereign Volt', 'Piercing Whetted Volt', 'Piercing Gleaming Volt', 'Piercing Sovereign Volt'])
    expect(rpgTreeNodes('tomeblade-katana').map((n) => n.name).slice(0, 2)).toEqual(['Edged Draw', 'Honed Draw'])
    expect(rpgNode('tomeblade-tome-dark.5')!.name).toBe('Sovereign Umbra')
  })

  it('plays the Spell Blade\'s rule on her trees, and Pierce on line B', () => {
    for (const w of RPG_WEAPONS) for (let d = 1; d <= 5; d++) {
      const mine = rpgNodeSkill(rpgNode(`tomeblade-${w}.${d}`)!, V19), blade = rpgNodeSkill(rpgNode(`spellblade-${w}.${d}`)!, V19)
      expect(mine, `${w}.${d}`).toEqual(blade)
    }
    for (const w of RPG_WEAPONS) for (const d of [3, 4, 5]) {
      const b = rpgNodeSkill(rpgNode(`tomeblade-${w}.${d}b`)!, V19)
      expect(b, `${w}.${d}b`).toEqual(rpgNodeSkill(rpgNode(`spellblade-${w}.${d}b`)!, V19))
      expect(b.special).toBe('pierce')
      expect(b.hits).toHaveLength(1)
      expect(b.hits[0]!.power).toBeCloseTo(RPG_PIERCE_SCALE * RPG_SKILL_POWER[d - 1]!, 3)
      expect(b.mp).toBe(6 + 4 * d + 2)
    }
  })

  it('casts the Summoner\'s summons on the Arms Summoner\'s trees, Bonded on her Arms and Pack on her Tomes', () => {
    expect(rpgNode('armsummoner-axe.3b')!.name).toBe('Bonded Axe Ogre')
    expect(rpgNode('armsummoner-tome-dark.3a')!.name).toBe('Vampire Knight Pack')
    // Her summons are the Tome Summoner's as v19 plays them (H128: the Bow's and Dark's volleys, Light's doubles).
    for (const w of RPG_WEAPONS) for (let d = 1; d <= 5; d++) {
      expect(rpgNode(`armsummoner-${w}.${d}`)!.skill, `${w}.${d}`).toEqual(rpgNodeSkill(rpgNode(`summoner-${w}.${d}`)!, V19))
      expect(rpgNode(`armsummoner-${w}.${d}`)!.name).toBe(rpgNode(`summoner-${w}.${d}`)!.name)
    }
    // Her lines mirror the Tome Summoner's: Bonded (`b`, linger 0.4, +2 MP) where hers is Pack, Pack (`a`) where hers is Bonded.
    for (const d of [3, 4, 5]) {
      const core = rpgNode(`armsummoner-bow.${d}`)!.skill
      expect(rpgNode(`armsummoner-bow.${d}b`)!.skill).toEqual({ ...core, summon: { linger: 0.4 }, mp: core.mp + 2 })
      expect(rpgNode(`armsummoner-axe.${d}b`)!.skill).toEqual(rpgNode(`summoner-axe.${d}b`)!.skill)
      expect(rpgNode(`armsummoner-tome-fire.${d}a`)!.skill).toEqual(rpgNode(`summoner-tome-fire.${d}a`)!.skill)
      expect(rpgNode(`armsummoner-tome-dark.${d}b`)).toBeUndefined()
    }
  })
})

describe('Tier 0\'s trees (CV6)', () => {
  it('gives each of her ten weapons one node: her skill, one foe, one hit of its kind at power 1, 10 MP', () => {
    for (const c of RPG_TIER0_CLASSES) for (const w of RPG_WEAPONS) {
      const n = rpgNode(`${c}-${w}.1`)!
      expect(rpgTreeNodes(rpgTreeOf(c, w))).toEqual([n])
      expect(n.skill, n.id).toEqual({ target: 'one', hits: [{ power: 1, parts: [{ kind: n.skill.primary, share: 1 }] }], mp: 10, primary: n.skill.primary })
      expect([n.depth, n.variant, n.skill.rider, n.skill.special, n.skill.status, n.skill.support15]).toEqual([1, null, undefined, undefined, undefined, undefined])
      expect(rpgBranchNode(c, w, 1, 'A')).toBe(n.id)
    }
    expect(['recruit', 'apprentice', 'duelist', 'caller', 'acolyte'].map((c) => rpgNode(`${c}-greatsword.1`)!.name))
      .toEqual(['Drill Strike', 'Primer', 'Feint', 'Beckon', 'Vigil'])
    expect(rpgNode('recruit-tome-fire.1')!.skill.primary).toBe('fire')
    expect(() => rpgBranchNode('recruit', 'axe', 2, 'A')).toThrow()
  })

  it('refuses every id outside a class\'s shape: a hybrid\'s side off her line, a Tier 0\'s depth 2 or side', () => {
    for (const id of ['tomeblade-tome-light.3a', 'armsummoner-bow.3a', 'armsummoner-tome-fire.3b', 'tomeblade-axe.1b', 'armsummoner-axe.2b',
      'recruit-greatsword.2', 'recruit-greatsword.1a', 'acolyte-tome-dark.5', 'caller-bow.1b']) expect(rpgNodeIdentity(id), id).toBeUndefined()
    for (const id of ['tomeblade-tome-light.3b', 'armsummoner-bow.3b', 'armsummoner-tome-fire.3a', 'recruit-greatsword.1', 'acolyte-tome-dark.1']) {
      expect(rpgNodeIdentity(id), id).toBeDefined()
    }
    // A Tier 0 has no fork: only no lines at all.
    expect([validRpgLines({}, ['bow'], 'recruit'), validRpgLines({ bow: 'B' }, ['bow'], 'recruit'), validRpgLines({ bow: 'B' }, ['bow'], 'brawler')])
      .toEqual([true, false, true])
  })

  const recruit = (classRank: number): RpgProfile => ({ outfitId: '1', baseStats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100 },
    growthRates: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 }, classId: 'recruit', weapons: ['greatsword', 'bow', 'tome-fire'], tier: 1, level: 7,
    exp: 0, tree: [], legacy: [], classRank, lines: {} })

  it('draws a Tier 0\'s trees as one node each, ranked by her Class Rank to 10', () => {
    const view = rpgTreeView(recruit(7), [{ tier: 1, id: 'recruit-bow.1' }], V19)!
    expect(view.root).toEqual({ classId: 'recruit', tier: 0, hand: expect.objectContaining({ arms: 1, tome: 1, pair: false }) })
    expect(view.trees.map((t) => [t.weapon, t.branch, t.bName, t.nodes.length])).toEqual([['greatsword', 'A', '', 1], ['bow', 'A', '', 1], ['tome-fire', 'A', '', 1]])
    expect(view.trees.map((t) => t.nodes[0])).toEqual([
      { id: 'recruit-greatsword.1', name: 'Drill Strike', depth: 1, line: 'trunk', held: true, open: true, gate: 1, rank: 7, nextRankAt: 8, equipped: false },
      { id: 'recruit-bow.1', name: 'Drill Strike', depth: 1, line: 'trunk', held: true, open: true, gate: 1, rank: 7, nextRankAt: 8, equipped: true },
      { id: 'recruit-tome-fire.1', name: 'Drill Strike', depth: 1, line: 'trunk', held: true, open: true, gate: 1, rank: 7, nextRankAt: 8, equipped: false },
    ])
    expect(rpgTreeView(recruit(10), [], V19)!.trees[0]!.nodes[0]).toMatchObject({ rank: 10, nextRankAt: null })
    // A Tier 1 class's tree stays the trunk and two lines, its root Tier 1.
    expect(rpgTreeView({ ...recruit(10), classId: 'tomeblade', weapons: ['tome-light', 'tome-lightning', 'katana'] }, [], V19)!.root.tier).toBe(1)
  })

  it('reports her three nodes at each new Class Rank to 10, and nothing past it', () => {
    expect(rpgSkillRankUps(recruit(1), 3, 5, V19)).toEqual(['greatsword', 'bow', 'tome-fire'].map((w) =>
      ({ id: `recruit-${w}.1`, name: 'Drill Strike', depth: 1, rank: 5, opened: false })))
    expect(rpgSkillRankUps(recruit(1), 10, 12, V19)).toEqual([])
    expect(rpgSkillRankUps(recruit(1), 9, 14, V19).map((u) => u.rank)).toEqual([10, 10, 10])
    // Before v19 nothing is a Tier 0.
    expect(rpgTreeView({ ...recruit(10), classId: 'brawler', weapons: ['greatsword', 'axe', 'lance'] }, [], V18)!.root.tier).toBe(1)
  })
})
