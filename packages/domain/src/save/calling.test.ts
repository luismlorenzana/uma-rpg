// The calling pick over the save (H69, D205; class-progression.md §10, CP29–CP30; uma-templates UT17), live since H72
// (D210). A Pace or Late Uma picks between her row's two classes until her calling is confirmed, by a tap or by her first
// won fight; at Uma Lv 1 the pick also moves her start. Invented outfits.
import type { AptitudeGrade, Aptitudes } from '@luismlorenzana/uma-data'
import { describe, expect, it } from 'vitest'
import { autoAction } from '../rpg/battle/auto'
import { battleActionsLeft } from '../rpg/battle/engine'
import type { BattleEnemy } from '../rpg/battle/types'
import { rpgRunBattleStep } from '../rpg/campaign/run'
import { CALLING_NO_PICK, CALLING_SET } from '../roster/template'
import { regionChapter, worldContinent } from '../world/world'
import {
  actInFight, activeClass, chooseClass, confirmCalling, NOT_HER_PICK, openFightOf, pickCalling, startFight, startingClass, type BattleOutfit,
} from './battle'
import { sweepFight } from './exchange'
import { ascend, signUpRift, startRiftFight, sweepEcho } from './rift'
import { ids, OUTFITS as RIFT_OUTFITS, play, riftWorldSave, ROSTER, T as RT, TWENTY, weaken } from './rift-rules.fixture'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { armorHalf } from '../economy/grades'
import { newOwnedUma, newSave, parseSave, type OwnedUma, type Save, type TierWorld } from './save'


const T = (n: number) => new Date(Date.UTC(2026, 9, 25, 12) + n * 60_000).toISOString()
type Grades<K extends string> = Partial<Record<K, AptitudeGrade>>
const outfit = (outfitId: string, style: Grades<keyof Aptitudes['strategy']>, distance: Grades<keyof Aptitudes['distance']>, power: number,
  wit: number): BattleOutfit => ({
  outfitId, baseStats: { speed: 110, stamina: 110, power, guts: 110, wit },
  growthRatePercents: { speed: 10, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'B', pace: 'B', late: 'B', end: 'B', ...style }, distance: { sprint: 'B', mile: 'B', medium: 'B', long: 'B', ...distance } },
})
/** A front runner (row 1, no pick), a Pace Uma with Power (row 5: Spell Blade, or Mage), a Wit-led Pace Uma (row 6), an
 * end closer (row 3) and a Late Uma with Power (row 7: Paladin, or Cleric). */
const FRONT = outfit('301', { front: 'A' }, { long: 'A' }, 104, 90)
const PACE = outfit('305', { pace: 'A' }, { mile: 'A' }, 104, 90)
const PACE_WIT = outfit('306', { pace: 'A' }, { medium: 'A' }, 90, 104)
const END = outfit('303', { end: 'A' }, { long: 'A' }, 104, 90)
const LATE = outfit('307', { late: 'A' }, { medium: 'A' }, 104, 90)
const PARTY = [FRONT, PACE, PACE_WIT, END, LATE]
const OUTFITS: ReadonlyMap<string, BattleOutfit> = new Map(PARTY.map((o) => [o.outfitId, o]))
const ura = regionChapter(worldContinent({ name: 'Sim', order: 1 }).regions[0]!, Array.from({ length: 7 }, (_, i) => ({ id: `cast${i}`, name: `Rival ${i}` })))

/** The five unlocked in their starts (H67), in party 1. */
function party(): Save {
  let save = newSave('Trainer', T(0))
  for (const [slot, o] of PARTY.entries()) {
    save = unlockUma(save, o.outfitId, T(0), '1', startingClass(o))
    save = setPartySlot(save, 0, slot, o.outfitId, T(0))
  }
  return save
}
const umaOf = (save: Save, id: string, tier = '1'): OwnedUma => worldOf(save, tier).umas[id]!
/** Changes Tier 1's world in place of a rule (test setup only). */
const edit = (save: Save, change: (w: TierWorld) => void): Save => {
  const copy: Save = JSON.parse(JSON.stringify(save))
  change(copy.tierWorlds['1']!)
  return copy
}
const roundTrip = (save: Save) => expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)

/** Plays the open world-map fight on Auto, every foe at 1 HP. */
function winWorldFight(save: Save): Save {
  const soft = (e: BattleEnemy): BattleEnemy => ({ ...e, stats: { ...e.stats, hp: 1 } })
  let s = edit(save, (w) => {
    const input = w.world.run.battle!.input
    w.world.run.battle!.input = { ...input, enemies: input.enemies.map(soft), ...(input.waves ? { waves: input.waves.map((wave) => wave.map(soft)) } : {}) }
  })
  for (let n = 0; n < 500; n += 1) {
    const state = rpgRunBattleStep(openFightOf(worldOf(s))!)!.state
    const ally = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
    const acted = actInFight(s, ura, autoAction(state, ally.id), T(10 + n))
    s = acted.save
    if (acted.result) {
      expect(acted.result.outcome).toBe('victory')
      return s
    }
  }
  throw new Error('the fight never ended')
}

describe('the calling pick (H69)', () => {
  it('is stored open on every new Uma', () => {
    expect(newOwnedUma(T(0)).calling).toEqual({ pick: null, confirmed: false })
    expect(newOwnedUma(T(0), 'brawler').calling).toEqual({ pick: null, confirmed: false })
    expect(umaOf(party(), '305').calling).toEqual({ pick: null, confirmed: false })
    roundTrip(party())
  })

  it('is refused for a front runner, once confirmed, and for a class outside her two', () => {
    const save = party()
    expect(() => pickCalling(save, FRONT, 'mage', T(1))).toThrow(CALLING_NO_PICK)
    expect(() => pickCalling(save, END, 'summoner', T(1))).toThrow(CALLING_NO_PICK)
    expect(() => pickCalling(save, PACE, 'paladin', T(1))).toThrow(NOT_HER_PICK)
    expect(() => pickCalling(save, PACE, 'brawler', T(1))).toThrow(NOT_HER_PICK)
    expect(() => pickCalling(save, LATE, 'mage', T(1))).toThrow(NOT_HER_PICK)
    const confirmed = confirmCalling(save, '305', T(1))
    expect(() => pickCalling(confirmed, PACE, 'mage', T(2))).toThrow(CALLING_SET)
  })

  it('at Uma Lv 1 moves her class, and her armor half with it (v28: the half is her class’s, H82)', () => {
    const save = party()
    expect(umaOf(save, '305').classId).toBe('spellblade')
    const mage = pickCalling(save, PACE, 'mage', T(1))
    expect(umaOf(mage, '305')).toMatchObject({ classId: 'mage', calling: { pick: 'mage', confirmed: false } })
    expect(armorHalf(umaOf(mage, '305').classId!)).toBe('magical')
    roundTrip(mage)
    // Back to the suggested one: her class and her physical half.
    const back = pickCalling(mage, PACE, 'spellblade', T(2))
    expect(umaOf(back, '305')).toMatchObject({ classId: 'spellblade', calling: { pick: 'spellblade', confirmed: false } })
    expect(armorHalf(umaOf(back, '305').classId!)).toBe('physical')
    // A Late Uma picks the Cleric: magical. Her grades don't move: a grade is the slot's, on either half.
    const cleric = umaOf(pickCalling(save, LATE, 'cleric', T(1)), '307')
    expect(cleric).toMatchObject({ classId: 'cleric', gear: umaOf(save, '307').gear })
    // Switched to another class, her class stays.
    const switched = chooseClass(save, '305', 'brawler', T(1))
    expect(umaOf(pickCalling(switched, PACE, 'mage', T(2)), '305')).toMatchObject({ classId: 'brawler', calling: { pick: 'mage', confirmed: false } })
    // An Uma unlocked before v16 has no class written (her style's): the pick is her start.
    const older = edit(save, (w) => { w.umas['306']!.classId = null })
    expect(activeClass(PACE_WIT, umaOf(older, '306'))).toBe('mage')
    expect(umaOf(pickCalling(older, PACE_WIT, 'spellblade', T(1)), '306').classId).toBe('spellblade')
  })

  it('above Lv 1 moves only her calling', () => {
    const save = edit(party(), (w) => { w.umas['305']!.level = 5 })
    const picked = pickCalling(save, PACE, 'mage', T(1))
    expect(umaOf(picked, '305')).toEqual({ ...umaOf(save, '305'), calling: { pick: 'mage', confirmed: false } })
  })

  it('is confirmed by the card’s Confirm, the pick (or none) kept, and then never moves', () => {
    const save = pickCalling(party(), PACE, 'mage', T(1))
    const confirmed = confirmCalling(save, '305', T(2))
    expect(umaOf(confirmed, '305').calling).toEqual({ pick: 'mage', confirmed: true })
    expect(confirmCalling(confirmed, '305', T(3))).toBe(confirmed)
    expect(umaOf(confirmCalling(save, '306', T(2)), '306').calling).toEqual({ pick: null, confirmed: true })
    expect(() => confirmCalling(save, '999', T(2))).toThrow('only owned Umas can fight')
    roundTrip(confirmed)
  })

  it('is confirmed by her first won world fight and by a Sweep, for every Uma who fought, eligible or not', () => {
    const save = pickCalling(party(), PACE, 'mage', T(1))
    const won = winWorldFight(startFight(save, ura, 'w1-1-1-s1', OUTFITS, T(5)))
    expect(PARTY.map((o) => umaOf(won, o.outfitId).calling)).toEqual([
      { pick: null, confirmed: true }, { pick: 'mage', confirmed: true }, { pick: null, confirmed: true }, { pick: null, confirmed: true },
      { pick: null, confirmed: true },
    ])
    roundTrip(won)
    // A Sweep pays as a win.
    const ready = edit(save, (w) => { w.world.run.wins = { start: 1, 'w1-1-1-s1': 1 }; w.wallet.sweepTickets = 1 })
    const swept = sweepFight(ready, ura, 'w1-1-1-s1', OUTFITS, T(5)).save
    expect(PARTY.every((o) => umaOf(swept, o.outfitId).calling!.confirmed)).toBe(true)
    expect(umaOf(swept, '305').calling).toEqual({ pick: 'mage', confirmed: true })
  })

  it('is confirmed by a Rift win, an Echo win and an Echo Sweep', () => {
    const signed = edit(signUpRift(riftWorldSave(), TWENTY, RT(1)), (w) => { w.umas['102']!.calling = { pick: 'spellblade', confirmed: false } })
    const front = play(weaken(startRiftFight(signed, { kind: 'front', front: 'iron', stage: 1 }, 0, RIFT_OUTFITS, ROSTER, RT(2))))
    expect(front.result.outcome).toBe('victory')
    expect(ids(101, 5).map((id) => umaOf(front.save, id).calling!.confirmed)).toEqual([true, true, true, true, true])
    expect(umaOf(front.save, '102').calling).toEqual({ pick: 'spellblade', confirmed: true })
    expect(ids(106, 20).every((id) => !umaOf(front.save, id).calling!.confirmed)).toBe(true)
    roundTrip(front.save)
    // An Echo won by party 5 (121–125), then swept by party 4 (116–120), who never fought.
    const echo = { kind: 'echo', front: 'iron', level: '50' } as const
    const tickets = edit(riftWorldSave(), (w) => { w.wallet.sweepTickets = 1 })
    const echoWon = play(weaken(startRiftFight(tickets, echo, 4, RIFT_OUTFITS, ROSTER, RT(2))))
    expect(ids(121, 5).every((id) => umaOf(echoWon.save, id).calling!.confirmed)).toBe(true)
    expect(ids(116, 5).some((id) => umaOf(echoWon.save, id).calling!.confirmed)).toBe(false)
    const swept = sweepEcho(echoWon.save, 'iron', '50', 3, 1, RIFT_OUTFITS, RT(900)).save
    expect(ids(116, 5).every((id) => umaOf(swept, id).calling!.confirmed)).toBe(true)
    roundTrip(swept)
  })

  it('goes with her when she ascends', () => {
    const save = edit(signUpRift(riftWorldSave(), TWENTY, RT(1)), (w) => {
      Object.assign(w.rift.runs[0]!, { fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 }, convergence: { attempts: 1, open: null }, wonAt: RT(50) })
      w.umas['101']!.calling = { pick: 'mage', confirmed: true }
      w.umas['102']!.calling = { pick: 'paladin', confirmed: false }
    })
    const up = worldOf(ascend(save, RT(70)).save, '2')
    expect(up.umas['101']).toEqual({ ...newOwnedUma(RT(0)), classId: 'brawler', calling: { pick: 'mage', confirmed: true } })
    expect(up.umas['102']!.calling).toEqual({ pick: 'paladin', confirmed: false })
    expect(up.umas['103']!.calling).toEqual({ pick: null, confirmed: false })
    roundTrip(ascend(save, RT(70)).save)
  })
})
