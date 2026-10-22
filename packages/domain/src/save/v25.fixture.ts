// Test-only (excluded from the build): a real-shaped v24 save for save v25's migration (H58). Tier 1 holds twenty Umas,
// 100–119, invented: a Cleric (103) who picked four Arms and a Fire Tome, learned Rebirth and Heavy Transfix and picked her
// skills; a Cleric with only her Class Rank (105) wearing two Orbs; a Mage (106) wearing an Amulet in accessory 1 and an
// Orb in accessory 2; the Chapel's seats 3–4 with their Heroes (107, 110), Learners (108, 109) and Bonds; a Brawler (100)
// with her own setup; party 1 with two Clerics; and an open world-map fight and an open Rift fight (Iron stage 5), both
// engine v14, taken from the frozen replays mid-fight (`rpg/battle/v14-replays.fixture.json`).
import { loadV14Replays, type V14Replay } from '../rpg/battle/v14-replays.fixture'
import type { RpgClass } from '../rpg/kinds'
import { newOwnedUma, newSave, type OwnedUma, type Save } from './save'

export const V25_T = ['2026-10-01T12:00:00.000Z', '2026-10-10T12:00:00.000Z', '2026-10-20T12:00:00.000Z'] as const
const [T0, T1, T2] = V25_T
const ids = (from: number, n: number): string[] => Array.from({ length: n }, (_, i) => `${from + i}`)
/** The world-map fight's and the Rift fight's frozen replays, and how many of their actions the open fights have taken. */
export const V25_WORLD_FIGHT = { name: 'w1:', actions: 10 }
export const V25_RIFT_FIGHT = { name: 'the Rift Iron front, stage 5', actions: 12 }
export const v14Replay = (prefix: string): V14Replay => loadV14Replays().find((r) => r.name.startsWith(prefix))!

/** The Cleric's choices before v2: any five weapons, four of them Arms. */
export const CLERIC_WEAPONS = ['greatsword', 'axe', 'bow', 'katana', 'tome-fire'] as const
export const CLERIC_TREE = ['cleric-greatsword.1a', 'cleric-axe.2a', 'cleric-tome-light.3b', 'cleric-lance.4b']
export const CLERIC_LOADOUT = ['cleric-tome-fire.1', 'cleric-greatsword.1a', 'cleric-axe.2', 'cleric-tome-light.3b', 'cleric-bow.3', 'cleric-katana.4']

function uma(classId: RpgClass | null, change: (u: OwnedUma) => void = () => {}): OwnedUma {
  const u: OwnedUma = { ...newOwnedUma(T0), level: 50, classId }
  change(u)
  return u
}

export function v24Save(): Save {
  const save = newSave('Save v25', T0)
  const world = save.tierWorlds['1']!
  const classes: (RpgClass | null)[] = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner', 'cleric', 'mage', null, null, null, null, 'cleric']
  for (const [i, id] of ids(100, 20).entries()) world.umas[id] = uma(classes[i] ?? null)
  world.umas['100'] = uma('brawler', (u) => {
    u.ranks.classes.brawler = { rank: 20, exp: 0 }
    u.classes.brawler = { weapons: ['greatsword', 'axe', 'lance', 'bow', 'katana'], tree: ['brawler-greatsword.1a'], loadout: null }
    u.gear = { locker: ['orb-fire-g1', 'talisman-vital-g1'], equipped: { 'accessory-1': 'orb-fire-g1', 'accessory-2': 'talisman-vital-g1' }, kinds: {} }
  })
  world.umas['103'] = uma('cleric', (u) => {
    u.ranks.classes.cleric = { rank: 40, exp: 0 }
    u.ranks.classes.mage = { rank: 5, exp: 0 }
    u.classes.cleric = { weapons: [...CLERIC_WEAPONS], tree: [...CLERIC_TREE], loadout: [...CLERIC_LOADOUT] }
    u.classes.mage = { weapons: ['tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark'], tree: [], loadout: null }
    u.gear = { locker: ['orb-fire-g1', 'talisman-vital-g1'], equipped: { 'accessory-1': 'orb-fire-g1', 'accessory-2': 'talisman-vital-g1' }, kinds: {} }
  })
  world.umas['105'] = uma('cleric', (u) => {
    u.ranks.classes.cleric = { rank: 12, exp: 30 }
    u.gear = { locker: ['orb-fire-g1', 'orb-ice-g1'], equipped: { 'accessory-1': 'orb-fire-g1', 'accessory-2': 'orb-ice-g1' }, kinds: {} }
  })
  world.umas['106'] = uma('mage', (u) => {
    u.gear = { locker: ['amulet-spring-g1', 'orb-greatsword-g1'], equipped: { 'accessory-1': 'amulet-spring-g1', 'accessory-2': 'orb-greatsword-g1' }, kinds: {} }
  })
  world.umas['107']!.bonds = { 'cleric-3': { level: 3, exp: 5 } }
  world.umas['108']!.bonds = { 'cleric-3': { level: 4, exp: 3 }, 'cleric-4': { level: 10, exp: 0 } }
  world.umas['109']!.bonds = { 'cleric-3': { level: 1, exp: 0 }, 'brawler-1': { level: 2, exp: 0 } }
  world.umas['110']!.bonds = { 'cleric-4': { level: 6, exp: 1 } }
  world.heroes = { 'brawler-1': { hero: '111', learners: ['109'] }, 'cleric-3': { hero: '107', learners: ['108', '109'] }, 'cleric-4': { hero: '110', learners: ['108'] } }
  world.parties[0]!.slots = ids(100, 5)
  world.parties[1]!.slots = ['105', '111', '112', '113', '114']
  const map = v14Replay(V25_WORLD_FIGHT.name), rift = v14Replay(V25_RIFT_FIGHT.name)
  world.world.run = {
    ...world.world.run, party: 0, wins: { start: 1, 'w1-1-1-s1': 1 }, battles: 2, updatedAt: T1,
    battle: { battleId: 'battle:0:world:2', nodeId: 'w1-1-1-s2', startedAt: T1, input: map.input, actions: map.actions.slice(0, V25_WORLD_FIGHT.actions) },
  }
  world.rift = {
    runs: [{ id: 't1-r1', roster: ids(100, 20), startedAt: T1, fronts: { iron: 4, arcane: 0, duel: 0, horde: 0 }, convergence: { attempts: 0, open: null },
      traces: { iron: ['physical'] }, wonAt: null, ascendedAt: null }],
    echoes: {},
    battle: { battleId: 'rift:t1:5', ref: { kind: 'front', front: 'iron', stage: 5 }, startedAt: T2, input: rift.input, actions: rift.actions.slice(0, V25_RIFT_FIGHT.actions) },
    battles: 5,
  }
  save.account.updatedAt = T2
  // Labelled v24, as a save written before H61 is (the type names the live version): parsing it runs the chain's `toV25`.
  ;(save as { schemaVersion: number }).schemaVersion = 24
  return save
}

/** A save's worlds as JSON, each run through `step`, still labelled v24: what the chain hands the parser since H61. */
export function migrated(save: Save, step: (world: Record<string, unknown>) => Record<string, unknown>): unknown {
  const raw = JSON.parse(JSON.stringify(save)) as { tierWorlds: Record<string, Record<string, unknown>> }
  return { ...raw, tierWorlds: Object.fromEntries(Object.entries(raw.tierWorlds).map(([k, w]) => [k, step(w)])) }
}
