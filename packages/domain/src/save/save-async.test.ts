import { describe, expect, it } from 'vitest'
import { autoAction } from '../rpg/battle/auto'
import { rpgRunBattleStep } from '../rpg/campaign/run'
import { rpgBranchNode, rpgDefaultWeapons } from '../rpg/rules'
import { RPG_CLASSES } from '../rpg/kinds'
import { GEMS } from '../economy/gems'
import { EQUIP_TYPES } from '../economy/gear'
import { ITEMS } from '../items/catalog'
import { regionChapter, worldContinent } from '../world/world'
import { chooseClass, openFightOf, startFight, worldRun, type BattleOutfit } from './battle'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, newTierWorld, parseSave, parseSaveAsync, SAVE_SCHEMA_VERSION, SaveParseError, type Save } from './save'
import { queueJob, startJob, type WorkOutfit } from './work'
import { convergenceSave, riftSave } from './rift.fixture'

const NOW = '2026-10-12T12:00:00.000Z'
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const continent = worldContinent({ name: 'Synthetic', order: 1 })
const region = regionChapter(continent.regions.find((r) => r.biome === 'volcano')!, cast)
const outfits = new Map<string, BattleOutfit>(RPG_CLASSES.map((_, i) => {
  const outfitId = `${9000000 + i}`
  return [outfitId, { outfitId, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRatePercents: { speed: 10, stamina: 10, power: 10, guts: 0, wit: 0 },
    aptitudes: { strategy: { front: 'A', pace: 'B', late: 'C', end: 'D' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } } }]
}))
/** One Uma of each class; the first five in party 0, so the Paladin waits outside it (one healer a party, classes v2). */
function party(): Save {
  let s = newSave('Parser test', NOW)
  ;[...outfits.keys()].forEach((id, i) => {
    s = unlockUma(s, id, NOW)
    if (i < 5) s = setPartySlot(s, 0, i, id, NOW)
    s = chooseClass(s, id, RPG_CLASSES[i]!, NOW)
  })
  return s
}
function frozen(): Save {
  const s = party(), w = worldOf(s)
  w.world.run.wins = Object.fromEntries(region.nodes.map((n) => [n.id, 1]))
  return startFight(s, region, region.nodes.at(-1)!.id, outfits, NOW)
}
const rawOf = (s: Save): Save => JSON.parse(JSON.stringify(s)) as Save

describe('asynchronous strict save parsing (H16)', () => {
  it('validates every job kind and queued outputs without full recipes at boot', async () => {
    let s = party()
    worldOf(s).items = Object.fromEntries(ITEMS.map((i) => [i.id, 10]))
    const workers: WorkOutfit[] = [...outfits.values()]
    s = startJob(s, 'mine', 0, workers[0]!, 'copper-ore', 2, NOW)
    s = queueJob(s, 'mine', 0, workers[0]!, 'copper-ore', 2, NOW)
    s = startJob(s, 'workbench', 0, workers[1]!, 'copper-ingot', 1, NOW)
    s = startJob(s, 'lapidary', 0, workers[2]!, GEMS[0]!.id, 1, NOW)
    s = startJob(s, 'forge', 0, workers[3]!, 'greatsword-g1', 1, NOW)
    s = queueJob(s, 'forge', 0, workers[3]!, 'helm-g1', 1, NOW)
    expect(await parseSaveAsync(rawOf(s))).toEqual(parseSave(rawOf(s)))
    expect(await parseSaveAsync(rawOf(s))).toEqual(s)
  })

  it('matches the synchronous parser for a current save containing every catalog id and all class loadouts', async () => {
    const s = party(), w = worldOf(s)
    w.items = Object.fromEntries(ITEMS.map((i) => [i.id, 1]))
    w.gems = Object.fromEntries(GEMS.map((g) => [g.id, 1]))
    w.gear = Object.fromEntries(EQUIP_TYPES.map((t) => [`${t}-g1`, 1]))
    for (const u of Object.values(w.umas)) for (const classId of RPG_CLASSES) {
      u.level = 45
      u.ranks.classes[classId] = { rank: 45, exp: 0 }
      // Save v27 (H72): her three, line B on her second tree, a trunk skill, her B line's depth-4 node and a depth-5 core.
      const weapons = rpgDefaultWeapons(classId)
      u.classes[classId] = { weapons, lines: { [weapons[1]!]: 'B' }, loadout: [`${classId}-${weapons[0]}.1`, rpgBranchNode(classId, weapons[1]!, 4, 'B'), `${classId}-${weapons[0]}.5`] }
    }
    expect(await parseSaveAsync(rawOf(s))).toEqual(parseSave(rawOf(s)))
    expect(await parseSaveAsync(rawOf(s))).toEqual(s)
  })

  it('matches every supported migration version, including the v18 reset, refunds and carried profession EXP', async () => {
    for (let version = 1; version < SAVE_SCHEMA_VERSION; version++) {
      const s = rawOf(party()), w = worldOf(s), raw = s as unknown as Record<string, unknown>
      raw.schemaVersion = version
      if (version < 12) {
        const wallet = w.wallet as unknown as Record<string, unknown>
        wallet.rushTickets = 3; delete wallet.timeTickets
      }
      if (version < 11) {
        const old = w as unknown as Record<string, unknown>
        old.runs = {}; delete old.world
      }
      if (version < 14) for (const u of Object.values(w.umas)) {
        const old = u as unknown as Record<string, unknown>
        old.build = 'greatsword-spear'; old.builds = {}; delete old.classId; delete old.classes
      }
      if (version >= 10 && version < 14) w.gear = { 'mage-staff-g2-mp': 2, 'spear-g1-atk': 1 }
      if (version >= 10 && version < 15) w.items = { 'token-craft-hp-1': 2 }
      // Before v24 the account had no defeated faces, the Rift no fight or count, and a run no traces or open attempt (D171).
      if (version < 24) {
        const rift = (w as unknown as { rift: Record<string, unknown> & { runs: Record<string, any>[] } }).rift
        delete rift.battle; delete rift.battles
        for (const run of rift.runs) { delete run.traces; delete run.convergence.open }
        delete (s.account as unknown as Record<string, unknown>).defeated
      }
      // Before v23 there was no Rift, and the account held only its name and times (D163).
      if (version < 23) {
        delete (w as unknown as Record<string, unknown>).rift
        const account = s.account as unknown as Record<string, unknown>
        delete account.achievements; delete account.history
      }
      // Before v22 facilities held the jobs (SC3).
      if (version < 22) {
        const old = w as unknown as Record<string, unknown>
        delete old.buildings; delete old.work; old.facilities = {}
      }
      // Before v21 an Uma had professions, not a Craft Level (D144).
      if (version < 21) for (const u of Object.values(w.umas)) {
        const old = u as unknown as Record<string, unknown>
        old.professions = { gathering: version < 16 && old === (w.umas['9000000'] as unknown) ? { level: 12, exp: 9 } : old.craft }
        delete old.craft
      }
      if (version < 17) delete (w as unknown as Record<string, unknown>).targets
      expect(await parseSaveAsync(raw), `v${version}`).toEqual(parseSave(raw))
    }
  })

  it('matches the synchronous parser for a v24 save with the Rift in use, and refuses its broken references alike', async () => {
    const s = riftSave()
    expect(await parseSaveAsync(rawOf(s))).toEqual(parseSave(rawOf(s)))
    expect(await parseSaveAsync(rawOf(s))).toEqual(s)
    const open = rawOf(s); open.account.history['201']![0]!.run = 't1-r2'
    expect(() => parseSave(open)).toThrow(SaveParseError)
    await expect(parseSaveAsync(open)).rejects.toThrow(/hasn't ascended/)
  })

  it('replays the open Rift fight after the lazy engine import, front or Convergence, and refuses what the engine refuses', async () => {
    for (const s of [riftSave(), convergenceSave()]) {
      expect(await parseSaveAsync(rawOf(s))).toEqual(parseSave(rawOf(s)))
      expect(await parseSaveAsync(rawOf(s))).toEqual(s)
    }
    // Only the replay can tell: 101 has already acted this round, and the seed is out of range.
    const acted = rawOf(riftSave()); acted.tierWorlds['1']!.rift.battle!.actions.push({ kind: 'guard', actorId: '101', targetId: '101' })
    const seed = rawOf(convergenceSave()); seed.tierWorlds['1']!.rift.battle!.input.seed = -1
    for (const [raw, message] of [[acted, /rift\.battle\.actions: an action was refused/], [seed, /rift\.battle\.input: /]] as const) {
      expect(() => parseSave(raw)).toThrow(message)
      await expect(parseSaveAsync(raw)).rejects.toThrow(message)
    }
    // The cross-checks run before the replay and read the unchecked input safely.
    const broken = rawOf(riftSave()); (broken.tierWorlds['1']!.rift.battle!.input as unknown as Record<string, unknown>).allies = 'five'
    expect(() => parseSave(broken)).toThrow(SaveParseError)
    await expect(parseSaveAsync(broken)).rejects.toThrow(SaveParseError)
  })

  it('replays frozen v8 waves and actions before returning, with identical v6 compatibility', async () => {
    const s = frozen(), battle = openFightOf(worldOf(s))!.battle!
    const state = rpgRunBattleStep(worldRun(worldOf(s)))!.state
    battle.actions = [autoAction(state, state.input.allies[0]!.id)]
    expect(await parseSaveAsync(rawOf(s))).toEqual(parseSave(rawOf(s)))
    const v6 = rawOf(s), older = openFightOf(worldOf(v6))!.battle!
    older.input.version = 6; delete older.input.waves
    older.input.enemies = older.input.enemies.slice(0, 3).map((e) => { delete e.element2; delete e.twice; return e })
    older.actions = []
    // A v6 fight's allies never carry v8's Class Rank, Might, Barrier or Regen, nor v16's lines and Flourish; they hold
    // classes v1's five weapons (the live fight's three since H72), and these none of v16's skills.
    for (const a of older.input.allies) {
      delete a.classRank; delete a.might; delete a.barrier; delete a.regen; delete a.lines; delete a.flourish
      a.weapons = rpgDefaultWeapons(a.classId, 6); a.loadout = []
    }
    expect(await parseSaveAsync(v6)).toEqual(parseSave(v6))
  })

  it('rejects invalid replay inputs and actions, including a malformed fight in a second tier', async () => {
    const invalids = [rawOf(frozen()), rawOf(frozen()), rawOf(frozen())]
    openFightOf(worldOf(invalids[0]!))!.battle!.input.allies.pop()
    openFightOf(worldOf(invalids[1]!))!.battle!.actions = [{ kind: 'attack', actorId: 'not-owned', targetId: 'foe1' }]
    // Tier 2 holds the fight and Tier 1 is empty, so its Umas live in one world and the bad seed stays the only fault (H35).
    invalids[2]!.tierWorlds['2'] = rawOf(frozen()).tierWorlds['1']!
    invalids[2]!.tierWorlds['1'] = newTierWorld(NOW, 0)
    invalids[2]!.tierWorlds['2']!.world.run.battle!.input.seed = -1
    for (const s of invalids) {
      expect(() => parseSave(s)).toThrow(SaveParseError)
      await expect(parseSaveAsync(s)).rejects.toThrow(SaveParseError)
    }
  })

  it('keeps strict keys, class gates, catalog ids and wear levels; never mutates the source while migrating', async () => {
    const base = party(), invalids: unknown[] = [{ ...base, extra: 1 }, { ...base, schemaVersion: SAVE_SCHEMA_VERSION + 1 }]
    const gear = rawOf(base); worldOf(gear).umas['9000000']!.gear = { locker: ['lance-g10'], equipped: { lance: 'lance-g10' }, kinds: {} }; invalids.push(gear)
    const line = rawOf(base); worldOf(line).umas['9000000']!.classes.brawler = { weapons: rpgDefaultWeapons('brawler'), lines: { 'tome-fire': 'B' }, loadout: null }; invalids.push(line)
    const items = rawOf(base); worldOf(items).items.unknown = 1; invalids.push(items)
    const gem = rawOf(base); worldOf(gem).gems['gem-sun-5'] = 1; invalids.push(gem)
    for (const s of invalids) {
      expect(() => parseSave(s)).toThrow(SaveParseError)
      await expect(parseSaveAsync(s)).rejects.toThrow(SaveParseError)
    }
    const older = rawOf(base) as unknown as Record<string, unknown>; older.schemaVersion = 15
    for (const u of Object.values(worldOf(older as unknown as Save).umas) as unknown as Record<string, unknown>[]) { u.professions = { gathering: u.craft }; delete u.craft }
    const before = JSON.stringify(older)
    await parseSaveAsync(older)
    expect(JSON.stringify(older)).toBe(before)
  })
})
