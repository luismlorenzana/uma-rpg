import { describe, expect, it } from 'vitest'
import { applyBattleAction, battleActionsLeft } from '../rpg/battle/engine'
import type { BattleAction, BattleState } from '../rpg/battle/types'
import { rpgCampaignChapter } from '../rpg/campaign/chapters'
import { rpgRunBattleStep } from '../rpg/campaign/run'
import {
  actInFight, activeBuild, chooseBuild, equipSkills, forgetSkill, learnSkill, openFightOf, restAtCamp, retreat, runOf, settleFight,
  startFight, umaProfile, type BattleOutfit,
} from './battle'
import { isInFight } from './status'
import { setPartySlot, SaveRuleError, unlockUma, worldOf } from './rules'
import { newOwnedUma, newSave, parseSave, SaveParseError, type Save, SAVE_SCHEMA_VERSION } from './save'

const T = (n: number) => `2026-10-10T12:${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}.000Z`
const cast = Array.from({ length: 7 }, (_, i) => ({ id: `cast${i}`, name: `Rival ${i}` }))
const ura = rpgCampaignChapter({ scenarioId: 1, name: 'URA Finale', order: 1 }, cast)

// Invented outfits only.
const outfit = (id: string, style: 'front' | 'pace' | 'late' | 'end'): BattleOutfit => ({
  outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
  growthRatePercents: { speed: 10, stamina: 10, power: 0, guts: 0, wit: 20 },
  aptitudes: { strategy: { front: style === 'front' ? 'A' : 'G', pace: style === 'pace' ? 'A' : 'G', late: style === 'late' ? 'A' : 'G', end: style === 'end' ? 'A' : 'G' } },
})
const OUTFITS = new Map([['101', outfit('101', 'front')], ['102', outfit('102', 'pace')], ['103', outfit('103', 'late')],
  ['104', outfit('104', 'end')], ['105', outfit('105', 'front')]])
const o101 = OUTFITS.get('101')!

/** Every class at a rank, as if trained in the Learning District (S5: rank 1 learns nothing). */
function ranked(save: Save, rank = 2): Save {
  const w = worldOf(save)
  const classes = { brawler: rank, mage: rank, spellblade: rank, cleric: rank, summoner: rank }
  return { ...save, tierWorlds: { '1': { ...w, umas: Object.fromEntries(Object.entries(w.umas).map(([id, u]) => [id, { ...u, ranks: { ...u.ranks, classes } }])) } } }
}

function withParty(): Save {
  let save = newSave('Luis', T(0))
  for (const id of OUTFITS.keys()) save = unlockUma(save, id, T(1))
  ;[...OUTFITS.keys()].forEach((id, slot) => { save = setPartySlot(save, 0, slot, id, T(2)) })
  return ranked(save)
}

/** Each living ally attacks the foe with the least shield until the fight ends. */
function autoplay(save: Save, party = 0): { save: Save; result: ReturnType<typeof actInFight>['result'] } {
  let s = save
  for (let n = 0; n < 400; n += 1) {
    const run = openFightOf(worldOf(s), party)
    if (!run) throw new Error('no fight')
    const state: BattleState = rpgRunBattleStep(run)!.state
    const ally = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
    const foe = state.units.filter((u) => u.side === 'enemy' && u.hp > 0).sort((a, b) => a.shield - b.shield || a.hp - b.hp)[0]!
    // A Summoner's Familiar strikes once a round; her second action guards a friend.
    const friend = state.units.find((u) => u.side === 'ally' && u.hp > 0 && u.id !== ally.id)
    const action: BattleAction = state.familiars.includes(ally.id) && friend
      ? { kind: 'guard', actorId: ally.id, targetId: friend.id } : { kind: 'attack', actorId: ally.id, targetId: foe.id }
    const acted = actInFight(s, ura, party, action, T(100 + n))
    s = acted.save
    if (acted.result) return { save: s, result: acted.result }
  }
  throw new Error('fight never ended')
}

describe('class builds (D49)', () => {
  it('starts in her best running style’s class and switches freely', () => {
    const save = withParty()
    const uma = worldOf(save).umas['102']!
    expect(activeBuild(OUTFITS.get('102')!, uma)).toBe('mage')
    expect(activeBuild(OUTFITS.get('104')!, worldOf(save).umas['104']!)).toBe('summoner')
    const switched = chooseBuild(save, '102', 'axe-bow', T(3))
    expect(activeBuild(OUTFITS.get('102')!, worldOf(switched).umas['102']!)).toBe('axe-bow')
    const profile = umaProfile(o101, worldOf(save).umas['101']!, 1)
    expect(profile).toMatchObject({ classId: 'brawler', weapons: ['greatsword', 'spear'], level: 1, tree: [] })
    expect(profile.growthRates).toEqual({ speed: 0.1, stamina: 0.1, power: 0, guts: 0, wit: 0.2 })
  })

  it('learns depth-1 skills at class rank 2 into free slots, keeps each build’s tree, and gates deeper depths by rank (D57)', () => {
    let save = withParty()
    save = learnSkill(save, o101, 'greatsword-spear', 'greatsword.fire.1', T(3))
    save = learnSkill(save, o101, 'axe-bow', 'axe.ice.1', T(4))
    const uma = worldOf(save).umas['101']!
    expect(uma.builds['greatsword-spear']).toEqual({ tree: ['greatsword.fire.1'], loadout: ['greatsword.fire.1'], familiar: 'greatsword' })
    expect(uma.builds['axe-bow']?.tree).toEqual(['axe.ice.1'])
    expect(() => learnSkill(save, o101, 'greatsword-spear', 'greatsword.fire.2', T(5))).toThrow(/class rank 3/)
    expect(() => learnSkill(ranked(withParty(), 1), o101, 'greatsword-spear', 'greatsword.fire.1', T(5))).toThrow(/class rank 2/)
    expect(() => learnSkill(save, o101, 'greatsword-spear', 'mage-staff.fire.1', T(5))).toThrow(SaveRuleError)
    expect(() => forgetSkill(save, o101, 'greatsword-spear', 'greatsword.fire.1', T(5))).toThrow(/variant/)
  })

  it('equips only learned skills within her slots', () => {
    let save = withParty()
    for (const id of ['greatsword.fire.1', 'greatsword.ice.1']) save = learnSkill(save, o101, 'greatsword-spear', id, T(3))
    save = equipSkills(save, o101, 'greatsword-spear', ['greatsword.ice.1'], T(4))
    expect(worldOf(save).umas['101']!.builds['greatsword-spear']?.loadout).toEqual(['greatsword.ice.1'])
    expect(() => equipSkills(save, o101, 'greatsword-spear', ['greatsword.lightning.1'], T(5))).toThrow(/learned/)
    expect(() => equipSkills(save, o101, 'greatsword-spear', ['greatsword.ice.1', 'greatsword.ice.1'], T(5))).toThrow(SaveRuleError)
  })
})

describe('fights (D52)', () => {
  it('needs a full party, one fight at a time, and freezes the line-up until it ends', () => {
    const short = setPartySlot(withParty(), 0, 4, null, T(3))
    expect(() => startFight(short, ura, 0, 'a1r1c1', OUTFITS, T(4))).toThrow(/five/)
    const save = startFight(withParty(), ura, 0, 'a1r1c1', OUTFITS, T(4))
    expect(() => startFight(save, ura, 0, 'a1r1c2', OUTFITS, T(5))).toThrow(/already/)
    expect(isInFight(worldOf(save), '101')).toBe(true)
    expect(() => setPartySlot(save, 0, 0, null, T(5))).toThrow(/fight/)
    expect(() => setPartySlot(save, 1, 0, '101', T(5))).toThrow(/fight/)
    expect(runOf(worldOf(retreat(save, ura, 0, T(6))), 0, ura.id)?.battle).toBeNull()
  })

  it('pays a win: EXP to all five, Laurels, and a Shard for each Uma that reaches Lv10', () => {
    const fought = autoplay(startFight(withParty(), ura, 0, 'a1r1c1', OUTFITS, T(4)))
    expect(fought.result).toMatchObject({ outcome: 'victory', nodeId: 'a1r1c1', laurels: 10, shards: 0 })
    expect(fought.result!.members).toHaveLength(5)
    const world = worldOf(fought.save)
    expect(world.wallet.laurels).toBe(10)
    expect(world.umas['101']!.exp).toBe(fought.result!.members[0]!.afterExp)
    expect(runOf(world, 0, ura.id)!.wins).toMatchObject({ start: 1, a1r1c1: 1 })

    // Lv9 Umas one fight short of Lv10: each earns a Shard, and five Shards make a Ticket.
    let ready = withParty()
    const w = worldOf(ready)
    const umas = Object.fromEntries(Object.entries(w.umas).map(([id, u]) => [id, { ...u, level: 9, exp: 270 }]))
    ready = { ...ready, tierWorlds: { '1': { ...w, umas } } }
    const before = worldOf(ready).wallet.unlockTickets
    const leveled = autoplay(startFight(ready, ura, 0, 'a1r1c1', OUTFITS, T(4)))
    expect(leveled.result!.members.every((m) => m.afterLevel === 10 && m.shards === 1)).toBe(true)
    expect(leveled.result).toMatchObject({ shards: 5, tickets: 1 })
    expect(worldOf(leveled.save).wallet).toMatchObject({ unlockTickets: before + 1, shards: 0 })
  })

  it('settles a loss with nothing paid and the run as it was', () => {
    const save = startFight(withParty(), ura, 0, 'a1r1c1', OUTFITS, T(4))
    const run = runOf(worldOf(save), 0, ura.id)!
    const lost = { ...rpgRunBattleStep(run)!.state, outcome: 'loss' as const }
    const settled = settleFight(save, ura, run, lost, T(5))
    expect(settled.result).toMatchObject({ outcome: 'loss', laurels: 0, members: [] })
    expect(runOf(worldOf(settled.save), 0, ura.id)!.wins).toEqual({ start: 1 })
  })

  it('rests at reachable camps only', () => {
    expect(() => restAtCamp(withParty(), ura, 0, 'a1camp', T(3))).toThrow(SaveRuleError)
    expect(runOf(worldOf(restAtCamp(withParty(), ura, 0, 'start', T(3))), 0, ura.id)!.mp).toEqual({})
  })
})

describe('save v3 parsing', () => {
  it('round-trips builds and an open fight with actions', () => {
    let save = learnSkill(withParty(), o101, 'greatsword-spear', 'greatsword.fire.1', T(3))
    save = startFight(save, ura, 0, 'a1r1c1', OUTFITS, T(4))
    const action: BattleAction = { kind: 'attack', actorId: '101', targetId: 'foe1' }
    save = actInFight(save, ura, 0, action, T(5)).save
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    expect(applyBattleAction(rpgRunBattleStep(runOf(worldOf(save), 0, ura.id)!)!.state, action).error).toBe('already-acted')
  })

  it('rejects an invalid tree, an unlearned equipped skill, a refused action and two fights in one party', () => {
    const save = startFight(learnSkill(withParty(), o101, 'greatsword-spear', 'greatsword.fire.1', T(3)), ura, 0, 'a1r1c1', OUTFITS, T(4))
    const raw = () => JSON.parse(JSON.stringify(save))
    const deep = raw()
    deep.tierWorlds['1'].umas['101'].builds['greatsword-spear'].tree.push('greatsword.fire.2')
    expect(() => parseSave(deep)).toThrow(/tree/)
    const equip = raw()
    equip.tierWorlds['1'].umas['101'].builds['greatsword-spear'].loadout = ['greatsword.ice.1']
    expect(() => parseSave(equip)).toThrow(/learned/)
    const refused = raw()
    refused.tierWorlds['1'].runs[`0:${ura.id}`].battle.actions = [{ kind: 'attack', actorId: '101', targetId: 'foe1' }, { kind: 'attack', actorId: '101', targetId: 'foe1' }]
    expect(() => parseSave(refused)).toThrow(/refused/)
    const twice = raw()
    twice.tierWorlds['1'].runs['0:2'] = { ...twice.tierWorlds['1'].runs[`0:${ura.id}`], chapterId: '2' }
    expect(() => parseSave(twice)).toThrow(SaveParseError)
  })

  it('migrates a v2 save: no build chosen, nothing learned, no runs', () => {
    const v2 = { schemaVersion: 2, account: { trainerName: 'Luis', createdAt: T(0), updatedAt: T(0) },
      tierWorlds: { '1': { createdAt: T(0), wallet: { unlockTickets: 19, shards: 0, laurels: 0 }, umas: { '101': { unlockedAt: T(1), level: 1, exp: 0 } },
        parties: Array.from({ length: 20 }, (_, i) => ({ name: `Party ${i + 1}`, slots: [null, null, null, null, null] })) } } }
    const migrated = parseSave(v2)
    expect(migrated.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    expect(migrated.tierWorlds['1']!.umas['101']).toEqual(newOwnedUma(T(1)))
    expect(migrated.tierWorlds['1']!.runs).toEqual({})
  })
})
