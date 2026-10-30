// Classes v3's save rules, live since H134 (H126; classes-v3.md §2.6, §7, §8.7, §14; CV8–CV11, CV19, CV30): choosing and
// promoting, the waiting EXP and its bank, Manuals, the class tree the screens draw, the promotion plan, a null class by
// world, the calling pick's retirement and Ascend; and the same reads at engine 18, which v18's open fights and replays
// keep (folded from `classes-v19-live.test.ts`). Invented outfits only.
import { describe, expect, it } from 'vitest'
import { rpgClasses } from '../rpg/kinds'
import { RPG_TIER0_BANK, rpgClassGate, rpgClassName, type RpgClass } from '../rpg/rules'
import { autoAction } from '../rpg/battle/auto'
import { rpgRunBattleStep } from '../rpg/campaign/run'
import { regionChapter, worldContinent } from '../world/world'
import {
  actInFight, activeClass, callingConfirmed, chooseClass, confirmCalling, fillRanks, openFightOf, partyMembers, pickCalling, promoteUma, promotionPlan,
  startFight, startingClass, type BattleOutfit,
} from './battle'
import { umaHeldClasses } from './class'
import { umaClassTree } from './class-tiles'
import { manualBlock, readManuals } from './exchange'
import { ascend, signUpRift } from './rift'
import { riftWorldSave, T as RT, TWENTY } from './rift-rules.fixture'
import { SaveRuleError, setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, type OwnedUma, type Save, type TierWorld } from './save'

const T = (n: number) => new Date(Date.parse('2026-10-29T12:00:00.000Z') + n * 1000).toISOString()
type Style = 'front' | 'pace' | 'late' | 'end'
/** An invented outfit: A in her styles, B elsewhere; Power over Wit unless `wit`. */
const outfit = (id: string, styles: Style[], wit = false): BattleOutfit => ({
  outfitId: id, baseStats: { speed: 110, stamina: 110, power: wit ? 90 : 110, guts: 110, wit: wit ? 110 : 90 },
  growthRatePercents: { speed: 10, stamina: 10, power: 10, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'B', pace: 'B', late: 'B', end: 'B', ...Object.fromEntries(styles.map((s) => [s, 'A'])) },
    distance: { sprint: 'B', mile: 'B', medium: 'A', long: 'B' } },
})
const FRONT = outfit('101', ['front']), PACE = outfit('102', ['pace'], true), LATE = outfit('103', ['late']), END = outfit('104', ['end'], true)
const PACE_LATE = outfit('105', ['pace', 'late'])
const OUTFITS = new Map([FRONT, PACE, LATE, END, PACE_LATE].map((o) => [o.outfitId, o]))

/** The five unlocked as the game unlocks them (her start written as her class). */
const unlocked = (): Save => [...OUTFITS.values()].reduce((s, o) => unlockUma(s, o.outfitId, T(0), '1', startingClass(o)), newSave('Luis', T(0)))
const edit = (save: Save, fn: (w: TierWorld) => TierWorld): Save => ({ ...save, tierWorlds: { ...save.tierWorlds, '1': fn(worldOf(save)) } })
const editUma = (save: Save, id: string, fn: (u: OwnedUma) => OwnedUma): Save => edit(save, (w) => ({ ...w, umas: { ...w.umas, [id]: fn(w.umas[id]!) } }))
const track = (save: Save, id: string, classId: RpgClass, rank: number, exp = 0): Save =>
  editUma(save, id, (u) => ({ ...u, ranks: { ...u.ranks, classes: { ...u.ranks.classes, [classId]: { rank, exp } } } }))
const marks = (save: Save, classMarks: number): Save => edit(save, (w) => ({ ...w, wallet: { ...w.wallet, classMarks } }))
const her = (save: Save, id = '101') => worldOf(save).umas[id]!
const message = (fn: () => unknown): string | null => {
  try { fn(); return null } catch (err) { return err instanceof SaveRuleError ? err.message : String(err) }
}

describe('the start and the switch (CV9, CV10, CV19)', () => {
  it('starts each Uma in her calling\'s Tier 0, and reads a null class by her world', () => {
    const save = unlocked()
    expect(['101', '102', '103', '104', '105'].map((id) => her(save, id).classId)).toEqual(['recruit', 'duelist', 'acolyte', 'caller', 'apprentice'])
    const blank = { classId: null }
    expect([FRONT, PACE, LATE, END, PACE_LATE].map((o) => activeClass(o, blank, 1))).toEqual(['recruit', 'duelist', 'acolyte', 'caller', 'apprentice'])
    // A Tier 2 world has no Tier 0: her suggested promotion (the Pace and End Umas' Wit over Power: the Tome children).
    expect([FRONT, PACE, LATE, END, PACE_LATE].map((o) => activeClass(o, blank, 2))).toEqual(['brawler', 'tomeblade', 'paladin', 'summoner', 'mage'])
    expect(startingClass(LATE, 19, 3)).toBe('paladin')
  })

  it('switches freely to any Tier 0 at Rank 1, and refuses a closed Tier 1 class with its gate', () => {
    let save = unlocked()
    for (const c of ['caller', 'apprentice', 'duelist', 'acolyte', 'recruit'] as const) {
      save = chooseClass(save, '101', c, T(1))
      expect(her(save).classId).toBe(c)
    }
    expect(message(() => chooseClass(save, '101', 'armsummoner', T(2)))).toBe('Opens with Warrior R10 or Summoner R10')
    expect(message(() => chooseClass(save, '101', 'mage', T(2)))).toBe('Opens with Mage R10')
    expect(message(() => chooseClass(track(save, '101', 'recruit', 10), '101', 'brawler', T(2)))).toBe('Promote from Warrior')
    expect(umaHeldClasses(her(save))).toEqual(['recruit', 'duelist', 'acolyte', 'caller', 'apprentice'])
    expect(umaHeldClasses(her(track(save, '101', 'mage', 12)))).toEqual(['recruit', 'duelist', 'acolyte', 'caller', 'apprentice', 'mage'])
    expect(umaHeldClasses(her(save), 2)).toEqual(['brawler', 'spellblade', 'armsummoner', 'paladin', 'cleric', 'summoner', 'tomeblade', 'mage'])
  })

  it('retires the calling pick: refused, nothing to confirm, a win confirms nothing', () => {
    const save = unlocked()
    expect(message(() => pickCalling(save, PACE_LATE, 'spellblade', T(1)))).toBe('No pick for her')
    expect(confirmCalling(save, '105', T(1))).toBe(save)
    expect(callingConfirmed(her(save, '105'))).toBe(her(save, '105'))
  })
})

describe('promotion (CV8, §2.6)', () => {
  it('opens the child at Rank 10 with the waiting EXP, keeps her Tier 0 at 10 with none, and she fights as the child', () => {
    const ready = track(unlocked(), '101', 'recruit', 10, 400)
    expect(promotionPlan(her(ready), 'recruit', 'brawler')).toEqual({ from: 'recruit', to: 'brawler', opens: 10, waiting: 400, after: { rank: 11, exp: 120 },
      depths: 2, skills: 6, marks: 0, block: null })
    const brawler = promoteUma(ready, '101', 'recruit', 'brawler', T(1))
    expect(her(brawler).ranks.classes).toEqual({ recruit: { rank: 10, exp: 0 }, brawler: { rank: 11, exp: 120 } })
    expect(her(brawler).classId).toBe('brawler')
    expect(activeClass(FRONT, her(brawler))).toBe('brawler')
    // A sibling later, free, with whatever waits then (nothing).
    const arms = promoteUma(brawler, '101', 'recruit', 'armsummoner', T(2))
    expect(her(arms).ranks.classes).toEqual({ recruit: { rank: 10, exp: 0 }, brawler: { rank: 11, exp: 120 }, armsummoner: { rank: 10, exp: 0 } })
    expect(her(arms).classId).toBe('armsummoner')
    // Promotions are hers for good: she switches back free.
    expect(her(chooseClass(arms, '101', 'brawler', T(3))).classId).toBe('brawler')
    // Never her calling or trade.
    expect(her(arms).calling).toEqual(her(ready).calling)
  })

  it('refuses outside her Tier 0\'s children, below Rank 10, a class she holds, and outside Tier 1\'s world', () => {
    const save = unlocked()
    expect(message(() => promoteUma(save, '101', 'recruit', 'brawler', T(1)))).toBe('Needs Warrior R10')
    const ready = track(save, '101', 'recruit', 10)
    expect(message(() => promoteUma(ready, '101', 'recruit', 'cleric', T(1)))).toBe('Not one of her Tier 0’s children')
    expect(message(() => promoteUma(ready, '101', 'recruit', 'duelist', T(1)))).toBe('Not one of her Tier 0’s children')
    expect(message(() => promoteUma(track(ready, '101', 'brawler', 14), '101', 'recruit', 'brawler', T(1)))).toBe('Already hers')
    expect(promotionPlan(her(ready), 'recruit', 'brawler', 2).block).toBe('Tier 0 is Tier 1’s')
    expect(promotionPlan(her(ready), 'duelist', 'tomeblade').block).toBe('Needs Spellblade R10')
  })

  it('rebuilds §8.7\'s Uma A: 16 Manuals on Warrior, then the Brawler at R35', () => {
    const save = marks(unlocked(), 21_000)
    const read = readManuals(save, '101', { kind: 'class', id: 'recruit' }, 16, T(1))
    expect(her(read).ranks.classes.recruit).toEqual({ rank: 10, exp: 12_400 })
    expect(worldOf(read).wallet.classMarks).toBe(5_000)
    const brawler = promoteUma(read, '101', 'recruit', 'brawler', T(2))
    expect(her(brawler).ranks.classes.brawler).toEqual({ rank: 35, exp: 600 })
  })

  it('rebuilds §8.7\'s Uma E: 28 Manuals on Summoner bank 23,680 and return 720 EXP as 360 Marks; the Tome Summoner at R50', () => {
    const save = marks(unlocked(), 28_000)
    expect(manualBlock(worldOf(save), '104', { kind: 'class', id: 'caller' }, 28)).toBeNull()
    const read = readManuals(save, '104', { kind: 'class', id: 'caller' }, 28, T(1))
    expect(her(read, '104').ranks.classes.caller).toEqual({ rank: 10, exp: RPG_TIER0_BANK })
    expect(worldOf(read).wallet.classMarks).toBe(360)
    expect(promotionPlan(her(read, '104'), 'caller', 'summoner')).toMatchObject({ after: { rank: 50, exp: 0 }, depths: 5, skills: 15, marks: 0 })
    const summoner = promoteUma(read, '104', 'caller', 'summoner', T(2))
    expect(her(summoner, '104').ranks.classes).toEqual({ caller: { rank: 10, exp: 0 }, summoner: { rank: 50, exp: 0 } })
    expect(her(summoner, '104').classId).toBe('summoner')
  })

  it('banks past 50 as Marks on promotion', () => {
    const plan = promotionPlan(her(track(unlocked(), '101', 'recruit', 10, RPG_TIER0_BANK)), 'recruit', 'brawler')
    expect(plan).toMatchObject({ waiting: RPG_TIER0_BANK, after: { rank: 50, exp: 0 }, marks: 0 })
  })
})

describe('Class EXP on a Tier 0 (CV5, CV8)', () => {
  it('fills her ladder to 10, then waits up to her bank, then pays Marks at half', () => {
    const uma = her(track(unlocked(), '101', 'recruit', 9, 500))
    const fill = fillRanks(uma, { classId: 'recruit', weapons: ['greatsword', 'axe', 'lance'], used: new Set() }, 300)
    expect(fill.ranks.classes.recruit).toEqual({ rank: 10, exp: 500 + 600 - 528 })
    expect(fill.classMarks).toBe(0)
    const full = fillRanks(her(track(unlocked(), '101', 'recruit', 10, RPG_TIER0_BANK - 80)), { classId: 'recruit', weapons: [], used: new Set() }, 300)
    expect(full.ranks.classes.recruit).toEqual({ rank: 10, exp: RPG_TIER0_BANK })
    expect(full.classMarks).toBe(260)
    // A Tier 1 class ranks on as ever.
    const brawler = fillRanks(her(track(unlocked(), '101', 'brawler', 10)), { classId: 'brawler', weapons: [], used: new Set() }, 300)
    expect(brawler.ranks.classes.brawler).toEqual({ rank: 12, exp: 600 - 280 - 296 })
  })

  it('reads Manuals onto a Tier 0 at Rank 10 until her bank is full; refuses a closed class with its gate', () => {
    const world = (save: Save) => worldOf(marks(save, 50_000))
    const save = unlocked()
    expect(manualBlock(world(save), '101', { kind: 'class', id: 'armsummoner' })).toBe('Opens with Warrior R10 or Summoner R10')
    expect(manualBlock(world(track(save, '101', 'recruit', 10)), '101', { kind: 'class', id: 'brawler' })).toBe('Promote from Warrior')
    expect(manualBlock(world(track(save, '101', 'recruit', 10, 5_000)), '101', { kind: 'class', id: 'recruit' })).toBeNull()
    expect(manualBlock(world(track(save, '101', 'recruit', 10, RPG_TIER0_BANK)), '101', { kind: 'class', id: 'recruit' })).toBe('Already at the top rank')
    expect(manualBlock(world(track(save, '101', 'brawler', 50)), '101', { kind: 'class', id: 'brawler' })).toBe('Already at the top rank')
    expect(manualBlock(world(save), '101', { kind: 'class', id: 'recruit' }, 1, 2)).toBe('Tier 0 is Tier 1’s')
  })
})

describe('her class tree (§14.1, UP23)', () => {
  it('draws every class of Tier 1\'s world in the tree\'s state language, with the Suggested badge', () => {
    let save = track(track(unlocked(), '101', 'recruit', 10, 400), '101', 'caller', 3)
    const tiles = (s: Save) => umaClassTree(her(s), FRONT).map((t) => `${t.classId} ${t.tier} ${t.state} R${t.rank}${t.waiting ? ` +${t.waiting}` : ''}` +
      `${t.gate ? ` · ${t.gate}` : ''}${t.suggested ? ' · Suggested' : ''}`)
    expect(tiles(save)).toEqual([
      'recruit 0 on R10 +400', 'duelist 0 open R1', 'acolyte 0 open R1', 'caller 0 available R3', 'apprentice 0 open R1',
      'brawler 1 ready R1 · Suggested', 'spellblade 1 ready R1', 'armsummoner 1 ready R1',
      'paladin 1 closed R1 · Opens with Healer R10', 'cleric 1 closed R1 · Opens with Healer R10',
      'summoner 1 closed R1 · Opens with Summoner R10 or Mage R10', 'tomeblade 1 closed R1 · Opens with Spellblade R10 or Mage R10',
      'mage 1 closed R1 · Opens with Mage R10',
    ])
    save = promoteUma(save, '101', 'recruit', 'brawler', T(1))
    expect(tiles(save).slice(0, 8)).toEqual(['recruit 0 available R10', 'duelist 0 open R1', 'acolyte 0 open R1', 'caller 0 available R3',
      'apprentice 0 open R1', 'brawler 1 on R11', 'spellblade 1 ready R1', 'armsummoner 1 ready R1'])
    // A Wit-led Spellblade at 10: the Tome Spellblade carries the badge, the Arms one doesn't.
    const duel = umaClassTree(her(track(unlocked(), '102', 'duelist', 10), '102'), PACE)
    expect(duel.filter((t) => t.suggested).map((t) => t.classId)).toEqual(['tomeblade'])
    // A Tier 2 world: the eight, open from Rank 1.
    expect(umaClassTree(her(save), FRONT, 2).map((t) => `${t.classId} ${t.state}`)).toEqual(['brawler on', 'spellblade open', 'armsummoner open',
      'paladin open', 'cleric open', 'summoner open', 'tomeblade open', 'mage open'])
  })
})

describe('a v19 fight from the save (§13)', () => {
  const region = regionChapter(worldContinent({ name: 'Synthetic', order: 1 }).regions[0]!, Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `C${i}` })))
  it('starts five Tier 0 Umas as engine v19 allies, a Healer no healer, and pays her Class EXP onto her Tier 0', () => {
    let save = unlocked()
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, T(1)) })
    const members = partyMembers(worldOf(save), ['101', '102', '103', '104', '105'], OUTFITS)
    expect(members.map((m) => [m.profile.classId, m.profile.classRank, m.loadout.length])).toEqual([
      ['recruit', 1, 3], ['duelist', 1, 3], ['acolyte', 1, 3], ['caller', 1, 3], ['apprentice', 1, 3],
    ])
    save = startFight(save, region, region.nodes.find((n) => n.kind === 'fight')!.id, OUTFITS, T(2))
    const run = openFightOf(worldOf(save))!
    expect(run.battle!.input.version).toBe(19)
    expect(run.battle!.input.allies.map((a) => a.classId)).toEqual(['recruit', 'duelist', 'acolyte', 'caller', 'apprentice'])
    let result = null
    for (let n = 0; n < 400 && !result; n++) {
      const state = rpgRunBattleStep(openFightOf(worldOf(save))!)!.state
      const actor = state.units.find((u) => u.side === 'ally' && u.hp > 0 && !state.acted.includes(u.id))!
      const acted = actInFight(save, region, autoAction(state, actor.id), T(3 + n))
      save = acted.save
      result = acted.result
    }
    expect(result?.outcome).toBe('victory')
    const gain = result!.members[0]!.ranks.find((r) => r.ref.kind === 'class')!
    expect(gain.ref).toEqual({ kind: 'class', id: 'recruit' })
    expect(her(save).ranks.classes.recruit!.exp).toBe(gain.exp)
  })
})

describe('Ascend (CV10)', () => {
  it('sends a Tier 0 up with no class, read there as her suggested promotion; a Tier 1 class as it is', () => {
    const save = (() => {
      const s: Save = JSON.parse(JSON.stringify(signUpRift(riftWorldSave(), TWENTY, RT(1))))
      const w = s.tierWorlds['1']!
      Object.assign(w.rift.runs[0]!, { fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 }, convergence: { attempts: 1, open: null }, wonAt: RT(50) })
      w.umas[TWENTY[0]!]!.classId = 'recruit'
      w.umas[TWENTY[0]!]!.ranks.classes = { recruit: { rank: 10, exp: 900 } }
      w.umas[TWENTY[1]!]!.classId = 'paladin'
      return s
    })()
    const up = worldOf(ascend(save, RT(70)).save, '2')
    const first = up.umas[TWENTY[0]!]!, second = up.umas[TWENTY[1]!]!
    expect([first.classId, second.classId]).toEqual([null, 'paladin'])
    expect(first.ranks.classes).toEqual({})
    expect(activeClass(outfit(TWENTY[0]!, ['front']), first, 2)).toBe('brawler')
    expect(rpgClassName(activeClass(outfit(TWENTY[0]!, ['late'], true), first, 2))).toBe('Cleric')
  })
})

describe('v18\'s class reads, engine 18 explicit (the six classes, no Tier 0, no promotion)', () => {
  it('starts her in her calling, reads a null class as her style\'s in every world, and holds all six', () => {
    expect([startingClass(FRONT, 18), startingClass(PACE_LATE, 18)]).toEqual(['brawler', 'spellblade'])
    expect([activeClass(FRONT, { classId: null }, 1, 18), activeClass(FRONT, { classId: null }, 2, 18)]).toEqual(['brawler', 'brawler'])
    const uma = { ...her(unlocked()), classId: 'brawler' as const }
    expect(umaHeldClasses(uma, 1, 18)).toEqual(rpgClasses(18))
    expect(umaClassTree(uma, FRONT, 1, 18).map((t) => `${t.classId} ${t.state}`)).toEqual([
      'brawler on', 'mage available', 'spellblade available', 'cleric available', 'summoner available', 'paladin available',
    ])
  })

  it('has no Tier 0 or new hybrid, no promotion, and every class of the six open', () => {
    const uma = her(unlocked())
    expect(rpgClassGate({ classes: {} }, 'recruit', 1, 18)).toBe('No such class')
    expect(rpgClassGate({ classes: {} }, 'tomeblade', 1, 18)).toBe('No such class')
    expect(rpgClasses(18).map((c) => rpgClassGate({ classes: {} }, c, 1, 18))).toEqual(rpgClasses(18).map(() => null))
    expect(promotionPlan(uma, 'recruit', 'brawler', 1, 18).block).toBe('no class recruit')
  })
})
