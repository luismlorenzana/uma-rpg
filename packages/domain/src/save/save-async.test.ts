import { describe, expect, it } from 'vitest'
import { autoAction } from '../rpg/battle/auto'
import { rpgRunBattleStep } from '../rpg/campaign/run'
import { rpgDefaultWeapons } from '../rpg/rules'
import { RPG_CLASSES } from '../rpg/kinds'
import { DISHES } from '../economy/dishes'
import { EQUIP_TYPES, hasAccent } from '../economy/gear'
import { ITEMS } from '../items/catalog'
import { regionChapter, worldContinent } from '../world/world'
import { chooseClass, openFightOf, startFight, worldRun, type BattleOutfit } from './battle'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, parseSave, parseSaveAsync, SAVE_SCHEMA_VERSION, SaveParseError, type Save } from './save'
import { queueJob, startJob, type WorkOutfit } from './work'

const NOW = '2026-10-12T12:00:00.000Z'
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const continent = worldContinent({ name: 'Synthetic', order: 1 })
const region = regionChapter(continent.regions.find((r) => r.biome === 'volcano')!, cast)
const outfits = new Map<string, BattleOutfit>(RPG_CLASSES.map((_, i) => {
  const outfitId = `${9000000 + i}`
  return [outfitId, { outfitId, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRatePercents: { speed: 10, stamina: 10, power: 10, guts: 0, wit: 0 },
    aptitudes: { strategy: { front: 'A', pace: 'B', late: 'C', end: 'D' } } }]
}))
function party(): Save {
  let s = newSave('Parser test', NOW)
  ;[...outfits.keys()].forEach((id, i) => { s = chooseClass(setPartySlot(unlockUma(s, id, NOW), 0, i, id, NOW), id, RPG_CLASSES[i]!, NOW) })
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
    const workers = [...outfits.values()].map((o): WorkOutfit => ({ ...o, aptitudes: {
      ...o.aptitudes, surface: { turf: 'A', dirt: 'A' }, distance: { sprint: 'A', mile: 'B', medium: 'C', long: 'D' },
    } }))
    s = startJob(s, 'fields', 0, workers[0]!, 'wheat', 2, NOW)
    s = queueJob(s, 'fields', 0, workers[0]!, 'wheat', 2, NOW)
    s = startJob(s, 'pantry', 0, workers[1]!, 'wheat-flour', 1, NOW)
    s = startJob(s, 'kitchen', 0, workers[2]!, DISHES[0]!.id, 1, NOW)
    s = startJob(s, 'forge', 0, workers[3]!, 'greatsword-g1', 1, NOW)
    s = queueJob(s, 'forge', 0, workers[3]!, 'helm-g1-atk', 1, NOW)
    expect(await parseSaveAsync(rawOf(s))).toEqual(parseSave(rawOf(s)))
    expect(await parseSaveAsync(rawOf(s))).toEqual(s)
  })

  it('matches the synchronous parser for a current save containing every catalog id and all class loadouts', async () => {
    const s = party(), w = worldOf(s)
    w.items = Object.fromEntries(ITEMS.map((i) => [i.id, 1]))
    w.dishes = Object.fromEntries(DISHES.map((d) => [d.id, 1]))
    w.gear = Object.fromEntries(EQUIP_TYPES.map((t) => [hasAccent(t) ? `${t}-g1-hp` : `${t}-g1`, 1]))
    for (const u of Object.values(w.umas)) for (const classId of RPG_CLASSES) {
      u.level = 45
      u.ranks.classes[classId] = { rank: 45, exp: 0 }
      const weapons = rpgDefaultWeapons(classId), tree = [`${classId}-${weapons[0]}.1a`, `${classId}-${weapons[1]}.2b`]
      u.classes[classId] = { weapons, tree, loadout: [...tree, `${classId}-${weapons[0]}.5`] }
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
      if (version < 16) w.umas['9000000']!.professions.farming = { level: 12, exp: 9 }
      if (version < 17) delete (w as unknown as Record<string, unknown>).targets
      expect(await parseSaveAsync(raw), `v${version}`).toEqual(parseSave(raw))
    }
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
    // A v6 fight's allies never carry v8's Class Rank, Might, Barrier or Regen.
    for (const a of older.input.allies) { delete a.classRank; delete a.might; delete a.barrier; delete a.regen }
    expect(await parseSaveAsync(v6)).toEqual(parseSave(v6))
  })

  it('rejects invalid replay inputs and actions, including a malformed fight in a second tier', async () => {
    const invalids = [rawOf(frozen()), rawOf(frozen()), rawOf(frozen())]
    openFightOf(worldOf(invalids[0]!))!.battle!.input.allies.pop()
    openFightOf(worldOf(invalids[1]!))!.battle!.actions = [{ kind: 'attack', actorId: 'not-owned', targetId: 'foe1' }]
    invalids[2]!.tierWorlds['2'] = rawOf(frozen()).tierWorlds['1']!
    invalids[2]!.tierWorlds['2']!.world.run.battle!.input.seed = -1
    for (const s of invalids) {
      expect(() => parseSave(s)).toThrow(SaveParseError)
      await expect(parseSaveAsync(s)).rejects.toThrow(SaveParseError)
    }
  })

  it('keeps strict keys, class gates, catalog ids and wear levels; never mutates the source while migrating', async () => {
    const base = party(), invalids: unknown[] = [{ ...base, extra: 1 }, { ...base, schemaVersion: SAVE_SCHEMA_VERSION + 1 }]
    const gear = rawOf(base); worldOf(gear).umas['9000000']!.gear = { locker: ['lance-g10'], equipped: { lance: 'lance-g10' }, kinds: {} }; invalids.push(gear)
    const tree = rawOf(base); worldOf(tree).umas['9000000']!.classes.brawler = { weapons: rpgDefaultWeapons('brawler'), tree: ['brawler-greatsword.5a'], loadout: null }; invalids.push(tree)
    const items = rawOf(base); worldOf(items).items.unknown = 1; invalids.push(items)
    const dish = rawOf(base); worldOf(dish).dishes['feast-5'] = 1; invalids.push(dish)
    for (const s of invalids) {
      expect(() => parseSave(s)).toThrow(SaveParseError)
      await expect(parseSaveAsync(s)).rejects.toThrow(SaveParseError)
    }
    const older = rawOf(base) as unknown as Record<string, unknown>; older.schemaVersion = 15
    const before = JSON.stringify(older)
    await parseSaveAsync(older)
    expect(JSON.stringify(older)).toBe(before)
  })
})
