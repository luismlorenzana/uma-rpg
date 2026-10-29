// Save v32's strict parse and rules (H130; classes-v3.md §8, §13, §14.3; halls-v2.md §7.3), with the switch mocked to 19
// (the classes stage live): the v31 save through `toV32` parses and its two open v18 fights replay to their frozen ends;
// unmigrated it doesn't; v32's rules are refused one by one; a new save and a new unlock round-trip; the sheet's `seen`,
// "Her share" counting down, and the open world fight settling after the reset. (Unmocked, today's v31 saves parse and
// round-trip unchanged: `migrations-v32.test.ts`.)
import { describe, expect, it, vi } from 'vitest'
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/caps'
import { HERO_LIMIT_IDS } from '../rpg/hero-id'
import { RPG_TIER0_BANK } from '../rpg/rules'
import { replayV18 } from '../rpg/battle/v18-replays.fixture'
import { actInFight, startingClass, type BattleOutfit, type FightResult } from './battle'
import { readManuals } from './exchange'
import { toV32 } from './migrations'
import { markClassesV3Seen, unlockUma, worldOf } from './rules'
import { newSave, parseSave, SAVE_SCHEMA_VERSION, type Save } from './save'
import { UMA, v18Replay, V31_RIFT_FIGHT, V31_T, V31_WORLD_FIGHT, v31Save, v31WorldChapter } from './v31.fixture'

vi.mock('../rpg/battle/caps', async (orig) => (await import('../rpg/battle/caps-at.fixture')).capsAt(19, await orig()))

type Raw = Record<string, unknown>
type RawUma = Raw & { ranks: { classes: Raw }; classes: Raw; bonds: Raw }
type RawWorld = Raw & { umas: Record<string, RawUma>; classesV3: Raw & { umas: Record<string, Raw> } }
const NOW = '2026-10-29T12:00:00.000Z'
/** The v31 save with every world through `toV32`, still labelled 31 (H134 bumps it), and `change` on its worlds. */
function v32Save(change: (worlds: { '1': RawWorld; '2': RawWorld }) => void = () => {}): Raw {
  const save = JSON.parse(JSON.stringify(v31Save())) as Raw & { tierWorlds: Record<string, Raw> }
  const tierWorlds = Object.fromEntries(Object.entries(save.tierWorlds).map(([k, w]) => [k, toV32(w, Number(k))]))
  change(tierWorlds as { '1': RawWorld; '2': RawWorld })
  return JSON.parse(JSON.stringify({ ...save, tierWorlds })) as Raw
}
const parsed = (): Save => parseSave(v32Save())

describe('save v32\'s parse (H130), the classes stage live', () => {
  it('runs with the classes stage live in this file, the schema still 31', () => {
    expect([BATTLE_ENGINE_VERSION, rpgRework('classes'), SAVE_SCHEMA_VERSION]).toEqual([19, true, 31])
  })

  it('parses the v31 save through toV32, round-trips it, and its two open v18 fights replay to their frozen ends', () => {
    const save = parsed()
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    const world = save.tierWorlds['1']!
    expect(world.classesV3).toMatchObject({ manuals: 78, marks: 78_000, traded: false, seen: false })
    expect(world.umas[UMA.A]).toMatchObject({ classId: null, classes: {}, ranks: { classes: {} } })
    expect(save.tierWorlds['2']!.umas['200']!.classId).toBe('brawler')
    for (const [battle, spec] of [[world.world.run.battle!, V31_WORLD_FIGHT], [world.rift.battle!, V31_RIFT_FIGHT]] as const) {
      expect(battle.input.version).toBe(18)
      const frozen = v18Replay(spec.name)
      expect(replayV18(battle.input, [...battle.actions, ...frozen.actions.slice(spec.actions)])).toMatchObject({ outcome: frozen.outcome, hash: frozen.hash })
    }
  })

  it('refuses the same save unmigrated: her calling pick, then a Paladin seat', () => {
    const v31 = JSON.parse(JSON.stringify(v31Save())) as { tierWorlds: Record<string, RawWorld> }
    expect(() => parseSave(v31)).toThrow(/umas\.100: unknown keys calling/)
    for (const world of Object.values(v31.tierWorlds)) for (const uma of Object.values(world.umas)) delete uma.calling
    expect(() => parseSave(v31)).toThrow(/umas\.100\.bonds\.paladin-2: not a Hero seat/)
  })

  it('refuses each of v32\'s rules broken', () => {
    const refused = (change: (worlds: { '1': RawWorld; '2': RawWorld }) => void, message: RegExp) => expect(() => parseSave(v32Save(change))).toThrow(message)
    const tier0 = { weapons: ['axe', 'bow', 'tome-fire'], lines: {}, loadout: null }
    // No Tier 0 in a later world: a class or a setup.
    refused((w) => { w['2'].umas['200']!.classId = 'recruit' }, /tierWorlds\.2\.umas\.200\.classId: expected null or a class/)
    refused((w) => { w['2'].umas['200']!.classes = { recruit: tier0 } }, /tierWorlds\.2\.umas\.200\.classes: unknown keys recruit/)
    refused((w) => { w['2'].umas['200']!.ranks.classes = { recruit: { rank: 2, exp: 0 } } }, /tierWorlds\.2\.umas\.200\.ranks\.classes: unknown keys recruit/)
    // A Tier 0's track: Ranks 1–10, and at 10 its bank.
    refused((w) => { w['1'].umas[UMA.A]!.ranks.classes = { recruit: { rank: 11, exp: 0 } } }, /classes\.recruit\.rank: expected 1–10/)
    refused((w) => { w['1'].umas[UMA.A]!.ranks.classes = { recruit: { rank: 10, exp: RPG_TIER0_BANK + 1 } } }, /classes\.recruit\.exp: expected at most 23680 waiting/)
    refused((w) => { w['1'].umas[UMA.A]!.ranks.classes = { recruit: { rank: 3, exp: 2 * (120 + 16 * 3) } } }, /classes\.recruit\.exp: more than the rank needs/)
    // A Tier 1 class is held from Rank 10 in Tier 1's world; she fights only as a class she holds.
    refused((w) => { w['1'].umas[UMA.A]!.ranks.classes = { brawler: { rank: 9, exp: 0 } } }, /classes\.brawler\.rank: a Tier 1 class is held from Rank 10/)
    refused((w) => { w['1'].umas[UMA.A]!.classId = 'brawler' }, /umas\.100\.classId: not a class she may fight as here: Opens with Recruit R10/)
    // A Tier 0 setup: three different weapons, no line.
    refused((w) => { w['1'].umas[UMA.A]!.classes = { recruit: { ...tier0, weapons: ['axe', 'axe', 'bow'] } } }, /classes\.recruit\.weapons: duplicate ids/)
    refused((w) => { w['1'].umas[UMA.A]!.classes = { recruit: { ...tier0, lines: { axe: 'B' } } } }, /classes\.recruit\.lines: a Tier 0 has no lines/)
    refused((w) => { w['1'].umas[UMA.A]!.classes = { recruit: { ...tier0, loadout: ['recruit-lance.1'] } } }, /classes\.recruit\.loadout/)
    // No calling pick; seats by Halls v2's ids.
    refused((w) => { w['1'].umas[UMA.A]!.calling = { pick: null, confirmed: true } }, /umas\.100: unknown keys calling/)
    refused((w) => { w['1'].umas[UMA.A]!.bonds['cleric-3'] = { level: 1, exp: 0 } }, /umas\.100\.bonds\.cleric-3: not a Hero seat/)
    refused((w) => { (w['1'].heroes as Raw)['paladin-4'] = { hero: '125', learners: [] } }, /heroes\.paladin-4: not a Hero seat/)
    // The record: her share's rest never above it; its sums.
    refused((w) => { w['1'].classesV3.umas[UMA.A]!.left = 22 }, /classesV3\.umas\.100\.left: more than her share/)
    refused((w) => { w['1'].classesV3.marks = 77_000 }, /classesV3\.marks: expected its Manuals × 1,000/)
    refused((w) => { w['1'].classesV3.umas[UMA.A]!.trade = { from: 'physical', to: 'physical' } }, /classesV3\.umas\.100\.trade: a trade that moved/)
    refused((w) => { (w['1'].classesV3.halls as Raw[])[0]!.to = 'healer-1' }, /classesV3\.halls\.0\.to: expected healer-2/)
  })

  it('accepts what v32 allows: a Tier 1 class at Rank 9 in a later world, a Tier 0 at Rank 10 with EXP waiting, and its setup', () => {
    const save = parseSave(v32Save((w) => {
      w['2'].umas['200']!.ranks.classes = { brawler: { rank: 9, exp: 0 } }
      w['1'].umas[UMA.A]!.ranks.classes = { recruit: { rank: 10, exp: RPG_TIER0_BANK }, brawler: { rank: 12, exp: 5 } }
      w['1'].umas[UMA.A]!.classId = 'brawler'
      w['1'].umas[UMA.A]!.classes = { recruit: { weapons: ['axe', 'bow', 'tome-fire'], lines: {}, loadout: ['recruit-bow.1'] } }
      w['1'].umas[UMA.D]!.classId = 'caller'
    }))
    expect(save.tierWorlds['1']!.umas[UMA.A]).toMatchObject({ classId: 'brawler', ranks: { classes: { recruit: { rank: 10, exp: RPG_TIER0_BANK } } } })
  })

  it('starts a new save and a new unlock with no calling pick, in her Tier 0, and both round-trip', () => {
    const late: BattleOutfit = { outfitId: '301', baseStats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 110 },
      growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 10 },
      aptitudes: { strategy: { front: 'B', pace: 'B', late: 'A', end: 'B' }, distance: { sprint: 'B', mile: 'B', medium: 'A', long: 'B' } } }
    const save = unlockUma(newSave('Luis', NOW), '301', NOW, '1', startingClass(late))
    const uma = worldOf(save).umas['301']!
    expect(uma.classId).toBe('acolyte')
    expect('calling' in uma).toBe(false)
    expect(save.tierWorlds['1']!.classesV3).toBeUndefined()
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })
})

describe('save v32\'s rules (H130)', () => {
  it('marks the sheet seen once per world (markClassesV3Seen)', () => {
    const save = parsed()
    const seen = markClassesV3Seen(save, '1', NOW)
    expect(seen.tierWorlds['1']!.classesV3!.seen).toBe(true)
    expect(seen.tierWorlds['2']!.classesV3!.seen).toBe(false)
    expect(markClassesV3Seen(seen, '1', NOW)).toBe(seen)
    expect(markClassesV3Seen(newSave('Luis', NOW), '1', NOW).tierWorlds['1']!.classesV3).toBeUndefined()
  })

  it('counts "Her share" down as she reads Class Manuals, whichever class, and never below 0', () => {
    let save = readManuals(parsed(), UMA.A, { kind: 'class', id: 'recruit' }, 5, NOW, '1')
    expect(worldOf(save).classesV3!.umas[UMA.A]).toMatchObject({ manuals: 21, left: 16 })
    save = readManuals(save, UMA.A, { kind: 'class', id: 'acolyte' }, 20, NOW, '1')
    expect(worldOf(save).classesV3!.umas[UMA.A]).toMatchObject({ manuals: 21, left: 0 })
    expect(worldOf(save).umas[UMA.A]!.ranks.classes).toEqual({ recruit: { rank: 10, exp: 1400 }, acolyte: { rank: 10, exp: 16_400 } })
    // D's share is 0: her line stays as it is.
    const d = readManuals(save, UMA.D, { kind: 'class', id: 'duelist' }, 1, NOW, '1')
    expect(worldOf(d).classesV3!.umas[UMA.D]).toBe(worldOf(save).classesV3!.umas[UMA.D])
    expect(worldOf(d).wallet.classMarks).toBe(83_000 - 26_000)
  })

  /** The open world fight played to its frozen end, after the reset. */
  function finishWorldFight(): { save: Save; result: FightResult } {
    let save = parsed()
    const frozen = v18Replay(V31_WORLD_FIGHT.name)
    let result: FightResult | null = null
    for (const action of frozen.actions.slice(V31_WORLD_FIGHT.actions)) {
      const step = actInFight(save, v31WorldChapter(), action, V31_T[2], '1')
      save = step.save
      result = step.result ?? result
    }
    return { save, result: result! }
  }

  it('settles the open v18 fight after the reset: each v31 class\'s share goes to its family\'s Tier 0', () => {
    const { save, result } = finishWorldFight()
    expect(result.outcome).toBe('victory')
    const classShare = (id: string) => result.members.find((m) => m.outfitId === id)!.ranks.find((r) => r.ref.kind === 'class')!.ref
    expect([UMA.A, UMA.G, UMA.B, UMA.C, UMA.E].map((id) => classShare(id))).toEqual([
      { kind: 'class', id: 'recruit' }, { kind: 'class', id: 'apprentice' }, { kind: 'class', id: 'duelist' }, { kind: 'class', id: 'acolyte' },
      { kind: 'class', id: 'caller' },
    ])
    const a = worldOf(save).umas[UMA.A]!
    expect(Object.keys(a.ranks.classes)).toEqual(['recruit'])
    expect(a.bonds['brawler-1']!.exp).toBeGreaterThan(4)
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })

  it('pays the Brawler\'s Bond to healer-2, her merged seat (H129\'s seats)', () => {
    expect(HERO_LIMIT_IDS).toContain('healer-2')
    expect(worldOf(parsed()).umas[UMA.A]!.bonds['healer-2']).toEqual({ level: 8, exp: 0 })
    const { save, result } = finishWorldFight()
    // A boss stage's Bond EXP (3) toward each of her two seats: the merged healer-2 and brawler-1.
    expect(result.members.find((m) => m.outfitId === UMA.A)!.bonds.map((b) => [b.limit, b.exp])).toEqual([['brawler-1', 3], ['healer-2', 3]])
    expect(worldOf(save).umas[UMA.A]!.bonds['healer-2']).toEqual({ level: 8, exp: 3 })
  })
})
