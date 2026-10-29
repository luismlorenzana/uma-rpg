// The weapon shapes on engine v19 (H128; classes-v3.md §4.1, §4.2; CV12, CV14), built dark: Katana and Light a double, Bow
// and Dark a volley (0.8 of the depth's power on the tapped foe, one splash hit at 0.35 on every other, +2 MP), the
// Brawler's Bow B Barrage, the Sorcerer's Light B Pierce and Dark B Barrage. Every v16–v18 def stays as it was: the digest
// below was taken on the catalog before this change.
import { createHash } from 'node:crypto'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  RPG_ALL_NODES, RPG_LINE_B_POWER_V16, RPG_LINE_B_POWER_V19, RPG_NODES, RPG_PIERCE_SCALE, RPG_SKILL_MP, RPG_SKILL_POWER, RPG_VOLLEY, RPG_VOLLEY_MP,
  rpgNode, rpgNodeSkill, rpgRankedSkill, type RpgHit, type RpgSkillDef,
} from './catalog'
import { RPG_BRANCH_B, RPG_BRANCH_B_NAME, rpgBranchBName, rpgBranchNode, rpgClassWeapons } from './node-identity'
import { isRpgTome, rpgClasses, RPG_WEAPONS, rpgIsTier0, type RpgClass, type RpgWeapon } from './kinds'

const V18 = 18, V19 = 19
const P = (d: number) => RPG_SKILL_POWER[d - 1]!
const MP = (d: number) => RPG_SKILL_MP[d - 1]!
const DEPTHS = [1, 2, 3, 4, 5] as const
const def = (id: string, v: number): RpgSkillDef => rpgNodeSkill(rpgNode(id)!, v)
const sum = (hits: readonly RpgHit[]) => hits.reduce((s, h) => s + h.power, 0)
/** Hits per depth on a tree's cores at an engine. */
const coreHits = (tree: string, v: number) => DEPTHS.map((d) => def(`${tree}.${d}`, v).hits.length)
/** A line B node's id at a depth. */
const lineB = (c: RpgClass, w: RpgWeapon, d: number) => rpgBranchNode(c, w, d, 'B')
const digest = (x: unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex')
/** The three moved B lines' factors (H131, D249: the Light Pierce 0.9 → 0.85, the Barrages 1). */
const BOW_B = RPG_LINE_B_POWER_V19.brawler!.bow!, LIGHT_B = RPG_LINE_B_POWER_V19.mage!['tome-light']!, DARK_B = RPG_LINE_B_POWER_V19.mage!['tome-dark']!

/** A volley at depth `d`: `n` hits sharing `RPG_VOLLEY.target` × `scale` × the depth's power on one foe, one splash hit at
 * `RPG_VOLLEY.splash` × it, `RPG_VOLLEY_MP` over `baseMp`. */
function expectVolley(x: RpgSkillDef, d: number, n: number, o: { scale?: number; baseMp?: number; label: string }) {
  const p = (o.scale ?? 1) * P(d)
  expect(x.target, o.label).toBe('one')
  expect(x.hits, o.label).toHaveLength(n)
  expect(sum(x.hits), o.label).toBeCloseTo(RPG_VOLLEY.target * p, 2)
  expect(x.splash?.power, o.label).toBeCloseTo(RPG_VOLLEY.splash * p, 3)
  expect(x.splash?.parts, o.label).toEqual([{ kind: x.primary, share: 1 }])
  expect(x.mp, o.label).toBe((o.baseMp ?? MP(d)) + RPG_VOLLEY_MP)
}

describe('the volley\'s numbers (CV12)', () => {
  it('reads one place: 0.8 on the tapped foe, 0.35 splash, 2 MP', () => {
    expect(RPG_VOLLEY).toEqual({ target: 0.8, splash: 0.35 })
    expect(RPG_VOLLEY_MP).toBe(2)
  })
})

describe('§4.2 at engine v19 against v18', () => {
  it('makes the Brawler\'s Bow a volley (1 · 1 · 2 · 2 · 3, Armor Break 2 at depth 5 on the tapped foe) and her Bow B Barrage, the old core', () => {
    expect(coreHits('brawler-bow', V18)).toEqual([2, 2, 4, 4, 6])
    expect(coreHits('brawler-bow', V19)).toEqual([1, 1, 2, 2, 3])
    for (const d of DEPTHS) {
      const x = def(`brawler-bow.${d}`, V19)
      expectVolley(x, d, [1, 1, 2, 2, 3][d - 1]!, { label: `bow ${d}` })
      expect(x.rider).toEqual(d === 5 ? { status: 'armor-break', stacks: 2, per: 'foe' } : undefined)
      expect(x.special).toBeUndefined()
    }
    for (const d of [3, 4, 5]) {
      expect(lineB('brawler', 'bow', d)).toBe(`brawler-bow.${d}b`)
      expect(def(`brawler-bow.${d}b`, V18).splash, 'v18 Rain').toBeDefined()
      // The old core at H131's tuned factor (D249).
      expect(def(`brawler-bow.${d}b`, V19)).toEqual(rpgRankedSkill(def(`brawler-bow.${d}`, V18), BOW_B))
      expect(def(`brawler-bow.${d}b`, V19)).toMatchObject({ target: 'one', mp: MP(d) })
      expect(def(`brawler-bow.${d}b`, V19).hits).toHaveLength([4, 4, 6][d - 3]!)
    }
    // Her Katana stays: a double, and Draw (Pierce) on her B.
    for (const id of ['brawler-katana.1', 'brawler-katana.5', 'brawler-katana.3a', 'brawler-katana.5a']) expect(def(id, V19)).toEqual(def(id, V18))
    expect(coreHits('brawler-katana', V19)).toEqual([2, 2, 2, 2, 2])
  })

  it('makes the Sorcerer\'s Light a double with Pierce on B, and her Dark a volley with Barrage on B', () => {
    expect(coreHits('mage-tome-light', V18)).toEqual([2, 2, 4, 4, 6])
    expect(coreHits('mage-tome-light', V19)).toEqual([2, 2, 2, 2, 2])
    for (const d of DEPTHS) {
      const x = def(`mage-tome-light.${d}`, V19)
      expect(x).toMatchObject({ target: 'one', mp: MP(d), primary: 'light' })
      expect(sum(x.hits)).toBeCloseTo(P(d), 2)
      expect([x.splash, x.special]).toEqual([undefined, d === 5 ? 'vs-broken' : undefined])
      // The Katana's twin: the same shape on the same depth.
      expect({ ...x, hits: x.hits.map((h) => h.power), primary: 'katana' }).toEqual({ ...def(`brawler-katana.${d}`, V19),
        hits: def(`brawler-katana.${d}`, V19).hits.map((h) => h.power) })
    }
    for (const d of [3, 4, 5]) {
      expect(lineB('mage', 'tome-light', d)).toBe(`mage-tome-light.${d}b`)
      const pierce = def(`mage-tome-light.${d}b`, V19)
      expect(pierce).toMatchObject({ target: 'one', mp: MP(d) + 2, special: 'pierce', primary: 'light' })
      expect(pierce.hits).toHaveLength(1)
      expect(pierce.hits[0]!.power).toBeCloseTo(RPG_PIERCE_SCALE * LIGHT_B * P(d), 3)
      expect(def(`mage-tome-light.${d}b`, V18).target).toBe('all')
    }
    expect(coreHits('mage-tome-dark', V18)).toEqual([2, 2, 2, 2, 2])
    expect(coreHits('mage-tome-dark', V19)).toEqual([1, 1, 2, 2, 3])
    for (const d of DEPTHS) {
      const x = def(`mage-tome-dark.${d}`, V19)
      expectVolley(x, d, [1, 1, 2, 2, 3][d - 1]!, { label: `nox ${d}` })
      expect([x.rider, x.special]).toEqual([undefined, d === 5 ? 'vs-wounded' : undefined])
    }
    for (const d of [3, 4, 5]) {
      expect(lineB('mage', 'tome-dark', d)).toBe(`mage-tome-dark.${d}a`)
      const barrage = def(`mage-tome-dark.${d}a`, V19)
      expect(barrage).toMatchObject({ target: 'one', mp: MP(d), primary: 'dark' })
      expect(barrage.hits).toHaveLength([4, 4, 6][d - 3]!)
      expect(sum(barrage.hits)).toBeCloseTo(DARK_B * P(d), 2)
      expect([barrage.splash, barrage.special]).toEqual([undefined, d === 5 ? 'vs-wounded' : undefined])
      // The Brawler's Bow B on Dark: the twins' B lines mirror, each at its own tuned factor (H131).
      const bow = def(`brawler-bow.${d}b`, V19)
      expect([barrage.target, barrage.mp, barrage.hits.length]).toEqual([bow.target, bow.mp, bow.hits.length])
      barrage.hits.forEach((h, k) => expect(h.power / DARK_B).toBeCloseTo(bow.hits[k]!.power / BOW_B, 3))
      expect(def(`mage-tome-dark.${d}a`, V18).special).toBe('pierce')
    }
  })

  it('lands one foe always for both Spellblades: Light 2 hits at every depth, Dark 2 · 2 · 3 · 3 · 4, the rest as v18', () => {
    for (const c of ['spellblade', 'tomeblade'] as const) {
      expect(coreHits(`${c}-tome-light`, V19)).toEqual([2, 2, 2, 2, 2])
      expect(coreHits(`${c}-tome-dark`, V19)).toEqual([2, 2, 3, 3, 4])
      expect(coreHits(`${c}-bow`, V19)).toEqual([2, 2, 3, 3, 4])
      expect(coreHits(`${c}-katana`, V19)).toEqual([2, 2, 2, 2, 2])
      for (const w of RPG_WEAPONS) for (const d of DEPTHS) {
        const x = def(`${c}-${w}.${d}`, V19)
        expect([x.target, x.splash], `${c} ${w} ${d}`).toEqual(['one', undefined])
        expect(sum(x.hits)).toBeCloseTo(P(d), 2)
      }
      expect([def(`${c}-tome-light.5`, V19).special, def(`${c}-tome-dark.5`, V19).special]).toEqual(['vs-broken', 'vs-wounded'])
    }
    expect(coreHits('spellblade-tome-light', V18)).toEqual([2, 2, 3, 3, 4])
    expect(coreHits('spellblade-tome-dark', V18)).toEqual([2, 2, 2, 2, 2])
    for (const w of RPG_WEAPONS.filter((x) => x !== 'tome-light' && x !== 'tome-dark')) {
      for (const d of DEPTHS) expect(def(`spellblade-${w}.${d}`, V19)).toEqual(def(`spellblade-${w}.${d}`, V18))
    }
  })

  it('makes both Summoners\' Bow and Dark summons volleys (the capstone on the tapped foe) and Light\'s doubles', () => {
    for (const c of ['summoner', 'armsummoner'] as const) {
      expect(coreHits(`${c}-bow`, V19)).toEqual([1, 1, 2, 2, 3])
      expect(coreHits(`${c}-tome-dark`, V19)).toEqual([1, 1, 2, 2, 3])
      expect(coreHits(`${c}-tome-light`, V19)).toEqual([2, 2, 2, 2, 2])
      for (const d of DEPTHS) {
        const bow = def(`${c}-bow.${d}`, V19), dark = def(`${c}-tome-dark.${d}`, V19), light = def(`${c}-tome-light.${d}`, V19)
        expectVolley(bow, d, [1, 1, 2, 2, 3][d - 1]!, { label: `${c} bow ${d}` })
        expectVolley(dark, d, [1, 1, 2, 2, 3][d - 1]!, { label: `${c} dark ${d}` })
        expect([bow.rider, dark.rider]).toEqual(d === 5 ? [{ status: 'armor-break', stacks: 2, per: 'foe' }, { status: 'enfeeble', stacks: 2, per: 'foe' }]
          : [undefined, undefined])
        expect([bow.summon, dark.summon, light.summon]).toEqual([{ linger: 0.3 }, { linger: 0.3 }, { linger: 0.3 }])
        expect(light).toMatchObject({ target: 'one', mp: MP(d) })
        expect(sum(light.hits)).toBeCloseTo(P(d), 2)
        expect(light.splash).toBeUndefined()
      }
    }
    expect(coreHits('summoner-bow', V18)).toEqual([2, 2, 3, 3, 4])
    expect(coreHits('summoner-tome-dark', V18)).toEqual([2, 2, 2, 2, 2])
    expect(coreHits('summoner-tome-light', V18)).toEqual([2, 2, 3, 3, 4])
    // The Katana and the other kinds' summons stay.
    for (const w of ['greatsword', 'axe', 'lance', 'katana', 'tome-fire', 'tome-ice', 'tome-lightning'] as const) {
      for (const d of DEPTHS) expect(def(`summoner-${w}.${d}`, V19)).toEqual(def(`summoner-${w}.${d}`, V18))
    }
  })

  it('puts the Pack\'s extra hit on the tapped foe, never the splash, both at ×0.95; Bonded lingers at 0.4 for 2 MP more', () => {
    for (const d of [3, 4, 5]) {
      // The Tome Summoner's Pack on her Arms (`a`), the Arms Summoner's on her Tomes (`a`).
      for (const id of [`summoner-bow.${d}a`, `armsummoner-tome-dark.${d}a`]) {
        const pack = def(id, V19)
        expectVolley(pack, d, [2, 2, 3, 3, 4][d - 1]!, { scale: 0.95, label: id })
      }
      expect(def(`summoner-bow.${d}a`, V19).hits).toHaveLength(def(`summoner-bow.${d}`, V19).hits.length + 1)
      const light = def(`armsummoner-tome-light.${d}a`, V19)
      expect(light.hits).toHaveLength(3)
      expect(sum(light.hits)).toBeCloseTo(0.95 * P(d), 2)
      // Bonded: the Tome Summoner's on her Tomes (`b`), the Arms Summoner's on her Arms (`b`).
      for (const [id, core] of [[`summoner-tome-dark.${d}b`, `summoner-tome-dark.${d}`], [`summoner-tome-light.${d}b`, `summoner-tome-light.${d}`],
        [`armsummoner-bow.${d}b`, `armsummoner-bow.${d}`]] as const) {
        const x = def(core, V19)
        expect(def(id, V19), id).toEqual({ ...x, summon: { linger: 0.4 }, mp: x.mp + 2 })
      }
    }
  })

  it('leaves the Paladin\'s and the Cleric\'s trees as they are', () => {
    for (const n of RPG_ALL_NODES.filter((x) => x.classId === 'paladin' || x.classId === 'cleric')) {
      expect(rpgNodeSkill(n, V19), n.id).toEqual(rpgNodeSkill(n, V18))
      expect(n.skill19).toBeUndefined()
    }
  })
})

describe('the B lines at v19 (CV14)', () => {
  it('moves the Sorcerer\'s Pierce from her Dark B to her Light B (0.85 since H131, D249); the Barrages stay at 1', () => {
    expect(RPG_LINE_B_POWER_V19).toEqual({ brawler: { lance: 0.95, katana: 0.9, bow: 1 }, mage: { 'tome-light': 0.85, 'tome-ice': 1.1, 'tome-dark': 1 } })
    expect(RPG_LINE_B_POWER_V16).toEqual({ brawler: { lance: 0.95, katana: 0.9 }, mage: { 'tome-dark': 0.9, 'tome-ice': 1.1 } })
    // The lines that kept their factor play v16's tuned def.
    for (const id of ['brawler-lance.4a', 'brawler-katana.4a', 'mage-tome-ice.4a']) expect(def(id, V19)).toEqual(def(id, V18))
  })

  it('names the lines by generation; the live table stays v18\'s', () => {
    expect([rpgBranchBName('brawler', 'bow', V19), rpgBranchBName('mage', 'tome-light', V19), rpgBranchBName('mage', 'tome-dark', V19)])
      .toEqual(['Barrage', 'Pierce', 'Barrage'])
    expect([rpgBranchBName('brawler', 'bow', V18), rpgBranchBName('mage', 'tome-light', V18), rpgBranchBName('mage', 'tome-dark')])
      .toEqual(['Rain', 'Cascade', 'Pierce'])
    expect([RPG_BRANCH_B_NAME.brawler.bow, RPG_BRANCH_B_NAME.mage['tome-light'], RPG_BRANCH_B_NAME.mage['tome-dark']]).toEqual(['Rain', 'Cascade', 'Pierce'])
    // Every other line keeps its name, and the side letters never move.
    for (const c of rpgClasses(V19)) for (const w of rpgClassWeapons(c)) {
      const moved = (c === 'brawler' && w === 'bow') || (c === 'mage' && (w === 'tome-light' || w === 'tome-dark'))
      if (!moved) expect(rpgBranchBName(c, w, V19), `${c} ${w}`).toBe(rpgBranchBName(c, w, V18))
    }
    expect([RPG_BRANCH_B.brawler.bow, RPG_BRANCH_B.mage['tome-light'], RPG_BRANCH_B.mage['tome-dark']]).toEqual(['b', 'b', 'a'])
    expect(rpgBranchBName('brawler', 'tome-fire', V19)).toBeUndefined()
  })

  it('puts Pierce on 66 line nodes at v19 (both Spellblades\' 30, the Brawler\'s Katana 3, the Sorcerer\'s Light 3); 36 at v18', () => {
    const pierced = (v: number) => rpgClasses(v).filter((c) => !rpgIsTier0(c)).flatMap((c) => rpgClassWeapons(c).flatMap((w) =>
      [3, 4, 5].map((d) => lineB(c, w, d)))).filter((id) => def(id, v).special === 'pierce')
    const by = (ids: string[]) => ids.reduce<Record<string, number>>((n, id) => { const k = id.split('.')[0]!.replace(/-.*/, ''); n[k] = (n[k] ?? 0) + 1; return n }, {})
    expect(pierced(V19)).toHaveLength(66)
    expect(by(pierced(V19))).toEqual({ brawler: 3, mage: 3, spellblade: 30, tomeblade: 30 })
    expect(pierced(V19).filter((id) => id.startsWith('brawler-') || id.startsWith('mage-')))
      .toEqual(['brawler-katana.3a', 'brawler-katana.4a', 'brawler-katana.5a', 'mage-tome-light.3b', 'mage-tome-light.4b', 'mage-tome-light.5b'])
    expect(pierced(V18)).toHaveLength(36)
    expect(by(pierced(V18))).toEqual({ brawler: 3, mage: 3, spellblade: 30 })
  })
})

describe('three generations on one id', () => {
  it('plays every v18 node\'s def at 16–18 as before H128 (the digest taken before step 2), and v6–v15\'s too', () => {
    expect(RPG_NODES).toHaveLength(750)
    const at = (v: number) => digest(RPG_NODES.map((n) => [n.id, rpgNodeSkill(n, v)]))
    for (const v of [16, 17, 18]) expect(at(v), `v${v}`).toBe('92b1d2f5e64504217a6f5acbedf14d48ea1305859268954b8e284fe1841d95ae')
    for (const v of [6, 14, 15]) expect(at(v), `v${v}`).toBe('d716ae0e768ef7e9e247ef7566e2edb730f1c095f3f95e98061e3bc7c752659e')
  })

  it('keeps `skill19` exactly where v19\'s def differs from v16–v18\'s, and none on the new hybrids', () => {
    const range = (tree: string, depths: readonly number[], letter = '') => depths.map((d) => `${tree}.${d}${letter}`)
    const expected = [
      ...range('brawler-bow', DEPTHS), ...range('brawler-bow', [3, 4, 5], 'b'),
      ...range('mage-tome-light', [3, 4, 5]), ...range('mage-tome-light', [3, 4, 5], 'b'),
      ...range('mage-tome-dark', DEPTHS), ...range('mage-tome-dark', [3, 4, 5], 'a'),
      ...range('summoner-bow', DEPTHS), ...range('summoner-bow', [3, 4, 5], 'a'),
      ...range('summoner-tome-light', [3, 4, 5]), ...range('summoner-tome-light', [3, 4, 5], 'b'),
      ...range('summoner-tome-dark', DEPTHS), ...range('summoner-tome-dark', [3, 4, 5], 'b'),
      ...range('spellblade-tome-light', [3, 4, 5]), ...range('spellblade-tome-dark', [3, 4, 5]),
    ].sort()
    const has = RPG_ALL_NODES.filter((n) => n.skill19)
    expect(has.map((n) => n.id).sort()).toEqual(expected)
    expect(has).toHaveLength(50)
    for (const n of has) {
      expect(n.skill19, n.id).not.toEqual(rpgNodeSkill(n, V18))
      expect(rpgNodeSkill(n, V19)).toBe(n.skill19)
    }
    // Every other node plays v18's def at v19.
    for (const n of RPG_ALL_NODES.filter((x) => !x.skill19)) expect(rpgNodeSkill(n, V19), n.id).toBe(rpgNodeSkill(n, V18))
    expect(RPG_ALL_NODES.filter((n) => (n.classId === 'tomeblade' || n.classId === 'armsummoner' || rpgIsTier0(n.classId)) && n.skill19)).toEqual([])
    // Each line B node that moved is on its tree's B side.
    for (const id of expected.filter((x) => /[ab]$/.test(x))) {
      const n = rpgNode(id)!
      expect(lineB(n.classId, n.weapon, n.depth), id).toBe(id)
    }
  })

  it('keeps the live names and summaries v18\'s', () => {
    expect(['brawler-bow.5', 'brawler-bow.3b', 'brawler-bow.5b', 'mage-tome-light.4b', 'mage-tome-dark.3a', 'mage-tome-dark.5a'].map((id) => rpgNode(id)!.name))
      .toEqual(['Starfall Barrage', 'Rain of Arrows', 'Starfall Rain', 'Luxaja Cascade', 'Noxaga Pierce', 'Void Pierce'])
    expect(rpgNode('mage-tome-dark.1')!.summary).toBe('one foe · 2 hits · 1.6')
    expect(isRpgTome('tome-dark')).toBe(true)
  })
})

describe('the names with the switch mocked to 19 (the live generation\'s, as names are presentation)', () => {
  afterEach(() => { vi.doUnmock('./battle/caps'); vi.resetModules() })

  it('names Starfall Volley, the Barrages and the Pierces, and the branches Barrage, Pierce, Barrage', async () => {
    vi.resetModules()
    vi.doMock('./battle/caps', async (orig) => (await import('./battle/caps-at.fixture')).capsAt(19, await orig()))
    const live = await import('./catalog')
    const ids = await import('./node-identity')
    const name = (id: string) => live.rpgNode(id)!.name
    expect(['brawler-bow.1', 'brawler-bow.4', 'brawler-bow.5'].map(name)).toEqual(['Twin Arrows', 'Arrow Storm', 'Starfall Volley'])
    expect([3, 4, 5].map((d) => name(`brawler-bow.${d}b`))).toEqual(['Quiver Barrage', 'Storm Barrage', 'Starfall Barrage'])
    expect([3, 4, 5].map((d) => name(`mage-tome-light.${d}b`))).toEqual(['Luxaga Pierce', 'Luxaja Pierce', 'Holy Pierce'])
    expect([3, 4, 5].map((d) => name(`mage-tome-dark.${d}a`))).toEqual(['Noxaga Barrage', 'Noxaja Barrage', 'Void Barrage'])
    // Every other name stays, the cores of Light and Dark among them.
    expect(['mage-tome-light.5', 'mage-tome-dark.5', 'summoner-bow.5', 'spellblade-tome-dark.5', 'brawler-katana.5a'].map(name))
      .toEqual(['Holy', 'Black Hole', 'Sagittarius', 'Celestial Shade', 'Final Draw'])
    expect([ids.RPG_BRANCH_B_NAME.brawler.bow, ids.RPG_BRANCH_B_NAME.mage['tome-light'], ids.RPG_BRANCH_B_NAME.mage['tome-dark']])
      .toEqual(['Barrage', 'Pierce', 'Barrage'])
    // The summaries are v19's, a volley's splash in them.
    expect(live.rpgNode('mage-tome-dark.1')!.summary).toBe('one foe · 1 hit · 1.28 · 0.56 on every other foe')
    expect(live.rpgNode('mage-tome-light.3')!.summary).toBe('one foe · 2 hits · 2.9')
  })
})
