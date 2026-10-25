// Tier 1's trees on engine v16 (H65, D201; class-progression.md §6.1, §6.2, §6.5, §6.10, §8.3; CP13–CP18, CP21–CP23,
// CP32, CP35, CP37, CP42, CP43), live since H72 (D210), so the live lists, names and summaries are v16's: a trunk and one
// free fork into line A or B, no points, Skill Ranks, Pierce, the Paladin's revive on her Light tree, the Summoner's
// renamed brutes and the halls' two kinds. (R1's packets ran it with the switch mocked to 16.)
import { describe, expect, it } from 'vitest'
import { BATTLE_ENGINE_VERSION } from './battle/caps'
import { RPG_LINE_B_POWER_V16, RPG_NODES, RPG_PIERCE_SCALE, RPG_SKILL_POWER, rpgNode, rpgNodeSkill, rpgTreeOf, rpgValkyrieOathNode } from './catalog'
import { HERO_LIMITS, heroLimit, heroLimitKinds } from './heroes'
import {
  RPG_ACTIVE_SLOT_GATES, RPG_ALL_CLASSES, RPG_BRANCH_B, RPG_BRANCH_B_NAME, RPG_MAX_ACTIVE_SLOTS, RPG_SKILL_RANK_FACTOR, rpgActiveSlots,
  rpgAutoLoadout, rpgBranchNode, rpgClassWeapons, rpgDefaultWeapons, rpgHeldSkills, rpgLearnedSkills, rpgNodeLine, rpgSkillRank,
  rpgSkillRankFactor, rpgSkillRankNextAt, rpgSwapBranchLoadout, rpgUsableLoadout, type RpgClass, type RpgLines, type RpgProfile,
  type RpgWeapon,
} from './rules'
import { rpgSkillRankUps, rpgTreeView } from './tree-view'

/** An invented Uma of a class on v16: her default weapons unless named, her Class Rank her level unless named. */
function uma(classId: RpgClass, level: number, o: { classRank?: number; lines?: RpgLines; weapons?: RpgWeapon[] } = {}): RpgProfile {
  return { outfitId: '101', baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 }, classId, weapons: o.weapons ?? rpgDefaultWeapons(classId, 16), tier: 1, level,
    exp: 0, tree: [], legacy: [], classRank: o.classRank ?? level, ...(o.lines ? { lines: o.lines } : {}) }
}
const ids = (refs: readonly { id: string }[]) => refs.map((r) => r.id)
const name = (id: string) => rpgNode(id)!.name

/** Branch B at depth 3 on all 50 trees, by §6.5's tables. */
const B_AT_3: Readonly<Record<RpgClass, Readonly<Partial<Record<RpgWeapon, string>>>>> = {
  brawler: { greatsword: 'Triple Sunder', axe: 'Headsman\'s Cyclone', lance: 'Skewer', bow: 'Rain of Arrows', katana: 'Flash Draw' },
  mage: { 'tome-fire': 'Firaga Wave', 'tome-ice': 'Blizzaga Spike', 'tome-lightning': 'Thundaga Bolt', 'tome-light': 'Luxaga Cascade', 'tome-dark': 'Noxaga Pierce' },
  spellblade: { greatsword: 'Piercing Mystic Cleave', axe: 'Piercing Mystic Hew', lance: 'Piercing Mystic Thrust', bow: 'Piercing Mystic Shot',
    katana: 'Piercing Mystic Draw', 'tome-fire': 'Piercing Mystic Brand', 'tome-ice': 'Piercing Mystic Rime', 'tome-lightning': 'Piercing Mystic Bolt',
    'tome-light': 'Piercing Mystic Ray', 'tome-dark': 'Piercing Mystic Shade' },
  summoner: { greatsword: 'Knight Captain Pack', axe: 'Axe Ogre Pack', lance: 'Lance Knight Pack', bow: 'Ranger Pack', katana: 'Kensei Pack',
    'tome-fire': 'Bonded Fire Drake', 'tome-ice': 'Bonded Ice Golem', 'tome-lightning': 'Bonded Storm Roc', 'tome-light': 'Bonded Seraph Choir',
    'tome-dark': 'Bonded Vampire Knight' },
  paladin: { greatsword: 'Heavy Rupture', axe: 'Heavy Maim', lance: 'Heavy Impale', bow: 'Heavy Fracture', katana: 'Heavy Hex',
    'tome-fire': 'Heavy Bravery', 'tome-ice': 'Heavy Bulwark', 'tome-lightning': 'Heavy Surge', 'tome-light': 'Valkyrie\'s Oath', 'tome-dark': 'Heavy Clarity' },
  cleric: { greatsword: 'Heavy Rupture', axe: 'Heavy Maim', lance: 'Heavy Impale', bow: 'Heavy Fracture', katana: 'Heavy Hex',
    'tome-fire': 'Heavy Bravery', 'tome-ice': 'Heavy Bulwark', 'tome-lightning': 'Heavy Surge', 'tome-light': 'Rebirth', 'tome-dark': 'Heavy Clarity' },
}
const TREES = RPG_ALL_CLASSES.flatMap((c) => rpgClassWeapons(c).map((w) => [c, w] as const))

describe('Tier 1’s trees on engine v16, the switch at 16 (H65)', () => {
  it('runs with the Tier rework’s fight live: seven equipped slots at most', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(16)
    expect(RPG_ACTIVE_SLOT_GATES).toEqual([10, 20, 30, 40])
    expect(RPG_MAX_ACTIVE_SLOTS).toBe(7)
    expect(RPG_NODES).toHaveLength(750)
  })

  it('takes branch B from §6.5: every tree’s B line at depth 3, and the spot checks at depth 5', () => {
    expect(TREES).toHaveLength(50)
    for (const [c, w] of TREES) {
      const id = rpgBranchNode(c, w, 3, 'B')
      expect(id, `${c} ${w}`).toBe(`${rpgTreeOf(c, w)}.3${RPG_BRANCH_B[c][w]}`)
      expect(name(id), id).toBe(B_AT_3[c][w])
      expect(rpgBranchNode(c, w, 3, 'A'), id).toBe(`${rpgTreeOf(c, w)}.3`)
    }
    expect(name(rpgBranchNode('brawler', 'greatsword', 5, 'B'))).toBe('Meteor Combo')
    expect(name(rpgBranchNode('brawler', 'lance', 5, 'B'))).toBe('Gungnir')
    expect(name(rpgBranchNode('mage', 'tome-light', 5, 'B'))).toBe('Holy Cascade')
    expect(name(rpgBranchNode('summoner', 'tome-fire', 5, 'B'))).toBe('Bonded Phoenix')
    expect(name(rpgBranchNode('summoner', 'bow', 5, 'B'))).toBe('Sagittarius Pack')
    // The lines' names for the branch sheet.
    expect([RPG_BRANCH_B_NAME.brawler.greatsword, RPG_BRANCH_B_NAME.brawler.lance, RPG_BRANCH_B_NAME.mage['tome-dark'],
      RPG_BRANCH_B_NAME.spellblade.bow, RPG_BRANCH_B_NAME.summoner['tome-ice'], RPG_BRANCH_B_NAME.summoner.axe, RPG_BRANCH_B_NAME.cleric.katana])
      .toEqual(['Combo', 'Impale', 'Pierce', 'Pierce', 'Bonded', 'Pack', 'Heavy'])
    // The trunk is the same on either line; a tree her class lacks has no node.
    expect([rpgBranchNode('mage', 'tome-ice', 2, 'B'), rpgBranchNode('mage', 'tome-ice', 1, 'A')]).toEqual(['mage-tome-ice.2', 'mage-tome-ice.1'])
    expect(() => rpgBranchNode('brawler', 'tome-fire', 3, 'B')).toThrow(RangeError)
    expect(() => rpgBranchNode('brawler', 'greatsword', 6, 'A')).toThrow(RangeError)
    expect([rpgNodeLine('brawler-lance.2'), rpgNodeLine('brawler-lance.3'), rpgNodeLine('brawler-lance.3a'), rpgNodeLine('brawler-lance.3b'),
      rpgNodeLine('brawler-lance.2a')]).toEqual(['trunk', 'A', 'B', null, null])
  })

  it('gives every one of the 50 trees a full v16 tree: 8 nodes, real content at every depth (CP43)', () => {
    const all = new Set<string>()
    for (const [c, w] of TREES) {
      const tree = [1, 2].map((d) => rpgBranchNode(c, w, d, 'A'))
        .concat([3, 4, 5].map((d) => rpgBranchNode(c, w, d, 'A')), [3, 4, 5].map((d) => rpgBranchNode(c, w, d, 'B')))
      expect(new Set(tree).size, `${c} ${w}`).toBe(8)
      for (const id of tree) {
        const def = rpgNodeSkill(rpgNode(id)!, 16)
        expect(def.hits.length > 0 || !!def.status || !!def.support15, id).toBe(true)
        expect(def.hits.every((h) => h.power > 0), id).toBe(true)
        all.add(id)
      }
    }
    expect(all.size).toBe(400)
  })

  it('makes the Spell Blade’s B Pierce on its 30 ids, in v16 only: one hit at ×1.15 that pierces, +2 MP (CP42)', () => {
    let count = 0
    for (const w of rpgClassWeapons('spellblade')) for (const d of [3, 4, 5]) {
      const node = rpgNode(`spellblade-${w}.${d}b`)!
      const v16 = rpgNodeSkill(node, 16), v15 = rpgNodeSkill(node, 15)
      expect(v16).toMatchObject({ target: 'one', special: 'pierce', mp: v15.mp })
      expect(v16.hits).toHaveLength(1)
      expect(v16.hits[0]!.power).toBeCloseTo(RPG_PIERCE_SCALE * RPG_SKILL_POWER[d - 1]!, 3)
      // v15's Flurry stays on `skill` for its fights: one more hit than the core, no pierce.
      expect(v15).toBe(node.skill)
      expect(v15.special).toBeUndefined()
      expect(v15.hits.length).toBe(rpgNode(`spellblade-${w}.${d}`)!.skill.hits.length + 1)
      count++
    }
    expect(count).toBe(30)
    expect([3, 4, 5].map((d) => rpgNodeSkill(rpgNode(`spellblade-katana.${d}b`)!, 16).hits[0]!.power)).toEqual([3.335, 4.255, 5.29])
    // 44 nodes play new data in v16: Pierce's 30, the Paladin's two, and four B lines' tuned power (H71, D207).
    expect(RPG_NODES.filter((n) => n.skill16)).toHaveLength(44)
    const lines = ['brawler-lance', 'brawler-katana', 'mage-tome-ice', 'mage-tome-dark'].flatMap((t) => [3, 4, 5].map((d) => `${t}.${d}a`))
    expect(RPG_NODES.filter((n) => n.skill16).map((n) => n.id).filter((id) => !id.startsWith('spellblade-')).sort())
      .toEqual(['paladin-lance.4b', 'paladin-tome-light.3b', ...lines].sort())
  })

  it('plays a tuned B line at its v16 power (H71: `RPG_LINE_B_POWER_V16`), its MP, hits and statuses as v15’s', () => {
    for (const [classId, byWeapon] of Object.entries(RPG_LINE_B_POWER_V16)) {
      for (const [weapon, factor] of Object.entries(byWeapon)) {
        for (const d of [3, 4, 5]) {
          const node = rpgNode(rpgBranchNode(classId as RpgClass, weapon as RpgWeapon, d, 'B'))!
          const [v15, v16] = [rpgNodeSkill(node, 15), rpgNodeSkill(node, 16)]
          expect(v15).toBe(node.skill)
          expect(v16.hits.map((h) => h.power)).toEqual(v15.hits.map((h) => h.power * factor!))
          expect({ ...v16, hits: v15.hits }).toEqual(v15)
        }
        // Depths 1–2 (the trunk) and the A line never move.
        for (const d of [1, 2, 3, 4, 5]) {
          const core = rpgNode(`${classId}-${weapon}.${d}`)!
          expect(rpgNodeSkill(core, 16)).toBe(core.skill)
        }
      }
    }
    expect(RPG_LINE_B_POWER_V16).toEqual({ brawler: { lance: 0.95, katana: 0.9 }, mage: { 'tome-dark': 0.9, 'tome-ice': 1.1 } })
  })

  it('names v16’s nodes: Pierce, Valkyrie’s Oath on the Light tree, Heavy Transfix, the Marauder and the Jotun King (CP21, CP37)', () => {
    expect(name('spellblade-greatsword.3b')).toBe('Piercing Mystic Cleave')
    expect(name('spellblade-tome-dark.5b')).toBe('Piercing Celestial Shade')
    expect(rpgNode('spellblade-greatsword.3b')!.summary).toBe('one foe · 1 hit · 3.335')
    expect(name('paladin-tome-light.3b')).toBe('Valkyrie\'s Oath')
    expect(name('paladin-lance.4b')).toBe('Heavy Transfix')
    expect(rpgNode('paladin-tome-light.3b')!.summary).toContain('revives the fallen')
    expect(rpgNode('paladin-lance.4b')!.summary).not.toContain('revives')
    expect([rpgValkyrieOathNode(), rpgValkyrieOathNode(15)]).toEqual(['paladin-tome-light.3b', 'paladin-lance.4b'])
    expect(rpgNodeSkill(rpgNode('paladin-tome-light.3b')!, 16).support15?.revive).toBe(true)
    expect(rpgNodeSkill(rpgNode('paladin-tome-light.3b')!, 15).support15?.revive).toBeUndefined()
    expect(rpgNodeSkill(rpgNode('paladin-lance.4b')!, 16).support15?.revive).toBeUndefined()
    expect(rpgNodeSkill(rpgNode('paladin-lance.4b')!, 15).support15?.revive).toBe(true)
    expect(['summoner-axe.2', 'summoner-axe.5', 'summoner-axe.2a', 'summoner-axe.5b'].map(name))
      .toEqual(['Marauder', 'Jotun King', 'Marauder Pack', 'Bonded Jotun King'])
  })

  it('changes the halls’ two kinds live: Rampart Charge with an Axe, Choir of Angels Light then Lightning (CP35)', () => {
    expect(HERO_LIMITS).toHaveLength(24)
    expect(heroLimit('paladin-3')).toMatchObject({ name: 'Rampart Charge', blurb: 'One Axe charge on one foe, then a Barrier on every ally' })
    expect(heroLimitKinds(heroLimit('paladin-3'))).toEqual(['axe'])
    expect(heroLimit('cleric-1').blurb).toBe('Light on every foe, then Lightning on every foe, then Aegis 2 on every ally')
    expect(heroLimitKinds(heroLimit('cleric-1'))).toEqual(['light', 'lightning'])
    expect(HERO_LIMITS.map((l) => l.id).slice(0, 4)).toEqual(['brawler-1', 'brawler-2', 'brawler-3', 'brawler-4'])
  })

  it('holds the trunk and her line at every open depth, no points: Class Rank 1, 10, 25 and 40, on A and on B', () => {
    expect(ids(rpgHeldSkills(uma('brawler', 1)))).toEqual(['brawler-greatsword.1', 'brawler-axe.1', 'brawler-lance.1'])
    expect(rpgHeldSkills(uma('brawler', 10))).toHaveLength(6)
    expect(ids(rpgHeldSkills(uma('brawler', 25))).slice(6)).toEqual(['brawler-greatsword.3', 'brawler-axe.3', 'brawler-lance.3'])
    expect(ids(rpgHeldSkills(uma('brawler', 25, { lines: { lance: 'B' } }))).slice(6)).toEqual(['brawler-greatsword.3', 'brawler-axe.3', 'brawler-lance.3a'])
    // A line below its fork changes nothing: at Class Rank 10 the trunk is all she holds.
    expect(rpgHeldSkills(uma('brawler', 10, { lines: { lance: 'B' } }))).toEqual(rpgHeldSkills(uma('brawler', 10)))
    const b = rpgHeldSkills(uma('brawler', 40, { lines: { greatsword: 'B' } }))
    expect(b).toHaveLength(15)
    expect(ids(b).filter((id) => id.startsWith('brawler-greatsword.'))).toEqual(['brawler-greatsword.1', 'brawler-greatsword.2', 'brawler-greatsword.3b',
      'brawler-greatsword.4b', 'brawler-greatsword.5b'])
    expect(b.every((r) => r.tier === 1)).toBe(true)
    // Side skills and legacy refs count for nothing from v16; to v15 she knows what she learned.
    const sided = { ...uma('brawler', 40), tree: [{ tier: 1, id: 'brawler-axe.1a' }], legacy: [{ tier: 1, id: 'brawler-bow.5' }] }
    expect(rpgLearnedSkills(sided)).toEqual(rpgHeldSkills(uma('brawler', 40)))
    expect(ids(rpgLearnedSkills(sided, 15))).toEqual(expect.arrayContaining(['brawler-axe.1a', 'brawler-bow.5']))
  })

  it('ranks a skill every 2 Class Ranks from its gate, ×0.95 to ×1.05 (CP32)', () => {
    expect([1, 3, 9, 50].map((cr) => rpgSkillRank(1, cr))).toEqual([1, 2, 5, 5])
    expect([19, 20, 21, 22, 28].map((cr) => rpgSkillRank(3, cr))).toEqual([0, 1, 1, 2, 5])
    expect([39, 40, 48].map((cr) => rpgSkillRank(5, cr))).toEqual([0, 1, 5])
    expect([rpgSkillRankNextAt(1, 1), rpgSkillRankNextAt(3, 19), rpgSkillRankNextAt(3, 21), rpgSkillRankNextAt(3, 26), rpgSkillRankNextAt(3, 28)])
      .toEqual([3, 20, 22, 28, null])
    expect(RPG_SKILL_RANK_FACTOR).toEqual([0.95, 0.975, 1, 1.025, 1.05])
    expect([40, 42, 44, 46, 48].map((cr) => rpgSkillRankFactor(5, cr))).toEqual([0.95, 0.975, 1, 1.025, 1.05])
    expect([rpgSkillRankFactor(5, 39), rpgSkillRankFactor(5, 48, 15)]).toEqual([1, 1])
    // A depth's Rank 5 never reaches the next depth's Rank 1, so a deeper skill is always the stronger.
    for (let d = 1; d < 5; d++) expect(RPG_SKILL_POWER[d - 1]! * 1.05).toBeLessThan(RPG_SKILL_POWER[d]! * 0.95)
  })

  it('equips three skills at Lv 1, one more at Lv 10, 20, 30 and 40: seven (CP22); ten to v15', () => {
    expect([1, 9, 10, 19, 20, 30, 40, 50].map((lv) => rpgActiveSlots(lv))).toEqual([3, 3, 4, 4, 5, 6, 7, 7])
    expect([1, 10, 40].map((lv) => rpgActiveSlots(lv, 15))).toEqual([3, 4, 10])
  })

  it('auto-equips each weapon’s deepest held skill in turn, a Spell Blade’s Arms and Tome alternating', () => {
    expect(ids(rpgAutoLoadout(uma('spellblade', 40)))).toEqual(['spellblade-katana.5', 'spellblade-tome-lightning.5', 'spellblade-lance.5',
      'spellblade-katana.4', 'spellblade-tome-lightning.4', 'spellblade-lance.4', 'spellblade-katana.3'])
    expect(ids(rpgAutoLoadout(uma('spellblade', 1)))).toEqual(['spellblade-katana.1', 'spellblade-tome-lightning.1', 'spellblade-lance.1'])
    // On B her line's nodes; a Summoner, Tome-led, alternates the other way.
    expect(ids(rpgAutoLoadout(uma('spellblade', 30, { lines: { katana: 'B', 'tome-lightning': 'B' } }))).slice(0, 2))
      .toEqual(['spellblade-katana.4b', 'spellblade-tome-lightning.4b'])
    expect(ids(rpgAutoLoadout(uma('summoner', 20))).slice(0, 3)).toEqual(['summoner-tome-dark.3', 'summoner-bow.3', 'summoner-tome-light.3'])
    // A kept loadout drops what she no longer holds and what overflows her slots.
    const p = uma('brawler', 30)
    expect(ids(rpgUsableLoadout(p, ['brawler-greatsword.3b', 'brawler-greatsword.3', 'brawler-axe.1', 'brawler-bow.1', 'brawler-axe.1a',
      'brawler-axe.4', 'brawler-lance.4', 'brawler-lance.3', 'brawler-lance.2', 'brawler-lance.1'].map((id) => ({ tier: 1, id })))))
      .toEqual(['brawler-greatsword.3', 'brawler-axe.1', 'brawler-axe.4', 'brawler-lance.4', 'brawler-lance.3', 'brawler-lance.2'])
  })

  it('swaps a tree’s line with her equipped skills following, in place: Rend becomes Rending Combo (CP23)', () => {
    const loadout = ['brawler-greatsword.4', 'brawler-axe.5', 'brawler-greatsword.2', 'brawler-greatsword.5']
    const b = rpgSwapBranchLoadout(loadout, 'brawler', 'greatsword', 'B')
    expect(b).toEqual(['brawler-greatsword.4b', 'brawler-axe.5', 'brawler-greatsword.2', 'brawler-greatsword.5b'])
    expect([name(loadout[0]!), name(b[0]!)]).toEqual(['Rend', 'Rending Combo'])
    expect(rpgSwapBranchLoadout(b, 'brawler', 'greatsword', 'A')).toEqual(loadout)
    expect(rpgSwapBranchLoadout(loadout, 'brawler', 'greatsword', 'A')).toEqual(loadout)
    // The Lance's B is the catalog's side A; another tree's nodes stay; one id never twice.
    expect(rpgSwapBranchLoadout(['brawler-lance.3', 'brawler-greatsword.3'], 'brawler', 'lance', 'B')).toEqual(['brawler-lance.3a', 'brawler-greatsword.3'])
    expect(rpgSwapBranchLoadout(['brawler-greatsword.3', 'brawler-greatsword.3b'], 'brawler', 'greatsword', 'B')).toEqual(['brawler-greatsword.3b'])
  })

  it('draws a Class Rank 22 Brawler with her Lance on B as three trees of eight nodes', () => {
    const p = uma('brawler', 22, { lines: { lance: 'B' } })
    const loadout = rpgAutoLoadout(p)
    expect(ids(loadout)).toEqual(['brawler-greatsword.3', 'brawler-axe.3', 'brawler-lance.3a', 'brawler-greatsword.2', 'brawler-axe.2'])
    const view = rpgTreeView(p, loadout)!
    expect(view.root).toEqual({ classId: 'brawler', hand: expect.objectContaining({ power: 1, pair: false }) })
    expect(view.trees.map((t) => [t.weapon, t.branch, t.bName])).toEqual([['greatsword', 'A', 'Combo'], ['axe', 'A', 'Reap'], ['lance', 'B', 'Impale']])
    const lance = view.trees[2]!
    expect(lance.tree).toBe('brawler-lance')
    expect(lance.nodes.map((n) => [n.id, n.name, n.line, n.held, n.open, n.gate, n.rank, n.nextRankAt, n.equipped])).toEqual([
      ['brawler-lance.1', 'Thrust Flurry', 'trunk', true, true, 1, 5, null, false],
      ['brawler-lance.2', 'Lance Barrage', 'trunk', true, true, 10, 5, null, false],
      ['brawler-lance.3', 'Spiral Barrage', 'A', false, true, 20, 2, 24, false],
      ['brawler-lance.4', 'Dragon Dive', 'A', false, false, 30, 0, 30, false],
      ['brawler-lance.5', 'Heaven\'s Rain', 'A', false, false, 40, 0, 40, false],
      ['brawler-lance.3a', 'Skewer', 'B', true, true, 20, 2, 24, true],
      ['brawler-lance.4a', 'Dragon Fang', 'B', false, false, 30, 0, 30, false],
      ['brawler-lance.5a', 'Gungnir', 'B', false, false, 40, 0, 40, false],
    ])
    expect(view.trees[0]!.nodes.filter((n) => n.held).map((n) => n.id)).toEqual(['brawler-greatsword.1', 'brawler-greatsword.2', 'brawler-greatsword.3'])
    expect(rpgTreeView(p, loadout, 15)).toBeNull()
  })

  it('names the skills a Class Rank up ranks up, and the depth it opens', () => {
    const p = uma('brawler', 30, { lines: { lance: 'B' } })
    expect(rpgSkillRankUps(p, 21, 22)).toEqual([
      { id: 'brawler-greatsword.3', name: 'Sunder', depth: 3, rank: 2, opened: false },
      { id: 'brawler-axe.3', name: 'Cyclone', depth: 3, rank: 2, opened: false },
      { id: 'brawler-lance.3a', name: 'Skewer', depth: 3, rank: 2, opened: false },
    ])
    expect(rpgSkillRankUps(p, 19, 20).map((u) => [u.id, u.rank, u.opened])).toEqual([
      ['brawler-greatsword.3', 1, true], ['brawler-axe.3', 1, true], ['brawler-lance.3a', 1, true],
    ])
    expect(rpgSkillRankUps(p, 22, 23)).toEqual([])
    expect(rpgSkillRankUps(p, 3, 5).map((u) => u.rank)).toEqual([3, 3, 3])
    expect(rpgSkillRankUps(p, 21, 22, 15)).toEqual([])
  })
})
