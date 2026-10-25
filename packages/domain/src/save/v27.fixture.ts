// Test-only (excluded from the build): a real-shaped v26 save for save v27's migration (H69). Tier 1 holds twenty Umas,
// 100–119, invented, built on engine 15's rules whatever the switch says (a v26 save holds no `calling`):
// - 100, a Lv 50 Brawler at Class Rank 45 with five Arms, the sides Greatsword 4B and 5B, Lance 3A, Katana 2A and Axe 3A
//   (§14's worked Brawler, her Greatsword 5B learned so the v26 parse takes her loadout), and four skills picked;
// - 101, a Lv 20 Mage whose loadout holds only side skills; 102, a Lv 40 Spell Blade with her Katana 4B equipped; 103, a
//   Lv 50 Paladin with her Light 3B (Valkyrie's Oath from v16) and her Lance 4B equipped; 104, a Summoner set up with
//   nothing learned; 105, a Lv 15 Brawler with five trunk skills equipped (v15's five slots, v16's four); 106 with no
//   class set up; and a crafted Katana worn by 102;
// - an open world-map fight and an open Rift fight (Iron stage 5), both engine v15, taken mid-fight from the frozen
//   replays (`rpg/battle/v15-replays.fixture.json`), whose allies are 100–104.
import { loadV15Replays, type V15Replay } from '../rpg/battle/v15-replays.fixture'
import type { RpgClass } from '../rpg/kinds'
import { newOwnedUma, newSave, type ClassLoadout, type OwnedUma, type Save } from './save'

export const V27_T = ['2026-10-01T12:00:00.000Z', '2026-10-10T12:00:00.000Z', '2026-10-20T12:00:00.000Z'] as const
const [T0, T1, T2] = V27_T
const ids = (from: number, n: number): string[] => Array.from({ length: n }, (_, i) => `${from + i}`)
/** The world-map fight's and the Rift fight's frozen replays, and how many of their actions the open fights have taken. */
export const V27_WORLD_FIGHT = { name: 'w1:', actions: 10 }
export const V27_RIFT_FIGHT = { name: 'the Rift Iron front, stage 5', actions: 12 }
export const v15Replay = (prefix: string): V15Replay => loadV15Replays().find((r) => r.name.startsWith(prefix))!

/** Each set-up class of the fixture's Umas, as v26 stores it. */
export const V26_CLASSES: Readonly<Record<string, Partial<Record<RpgClass, ClassLoadout>>>> = {
  100: { brawler: { weapons: ['greatsword', 'axe', 'lance', 'bow', 'katana'],
    tree: ['brawler-greatsword.4b', 'brawler-greatsword.5b', 'brawler-lance.3a', 'brawler-katana.2a', 'brawler-axe.3a'],
    loadout: ['brawler-greatsword.5b', 'brawler-axe.3a', 'brawler-katana.5', 'brawler-greatsword.2'] } },
  101: { mage: { weapons: ['tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark'], tree: ['mage-tome-fire.3b', 'mage-tome-ice.2a'],
    loadout: ['mage-tome-fire.3b', 'mage-tome-ice.2a'] } },
  102: { spellblade: { weapons: ['katana', 'greatsword', 'lance', 'tome-fire', 'tome-lightning'], tree: ['spellblade-katana.4b'],
    loadout: ['spellblade-katana.4b', 'spellblade-tome-fire.3', 'spellblade-lance.1'] } },
  103: { paladin: { weapons: ['greatsword', 'axe', 'lance', 'tome-light', 'tome-ice'], tree: ['paladin-tome-light.3b', 'paladin-lance.4b'],
    loadout: ['paladin-lance.4b', 'paladin-tome-light.3b', 'paladin-greatsword.3'] } },
  104: { summoner: { weapons: ['tome-fire', 'tome-ice', 'tome-lightning', 'greatsword', 'lance'], tree: [], loadout: null } },
  105: { brawler: { weapons: ['greatsword', 'axe', 'lance', 'bow', 'katana'], tree: [],
    loadout: ['brawler-greatsword.1', 'brawler-axe.1', 'brawler-lance.1', 'brawler-greatsword.2', 'brawler-axe.2'] } },
}
const LEVELS: Readonly<Record<string, number>> = { 100: 50, 101: 20, 102: 40, 103: 50, 104: 30, 105: 15 }
const RANKS: Readonly<Record<string, number>> = { 100: 45, 101: 30, 102: 40, 103: 40, 104: 20, 105: 10 }

function uma(id: string, classId: RpgClass | null): OwnedUma {
  const u: OwnedUma = { ...newOwnedUma(T0, undefined, 15), level: LEVELS[id] ?? 50, classId }
  const classes = V26_CLASSES[id]
  if (classes) {
    u.classes = JSON.parse(JSON.stringify(classes)) as OwnedUma['classes']
    for (const c of Object.keys(classes) as RpgClass[]) u.ranks.classes[c] = { rank: RANKS[id]!, exp: 0 }
  }
  return u
}

/** The v26 save, labelled v26 (the live version until H72). */
export function v26Save(): Save {
  const save = newSave('Save v27', T0)
  const world = save.tierWorlds['1']!
  const classes: (RpgClass | null)[] = ['brawler', 'mage', 'spellblade', 'paladin', 'summoner', 'brawler', null, 'cleric', null, 'mage']
  for (const [i, id] of ids(100, 20).entries()) world.umas[id] = uma(id, classes[i] ?? null)
  world.umas['102']!.gear = { locker: ['katana-g1'], equipped: { katana: 'katana-g1' }, kinds: {} }
  world.parties[0]!.slots = ids(100, 5)
  world.parties[1]!.slots = ids(105, 5)
  const map = v15Replay(V27_WORLD_FIGHT.name), rift = v15Replay(V27_RIFT_FIGHT.name)
  world.world.run = {
    ...world.world.run, party: 0, wins: { start: 1, 'w1-1-1-s1': 1 }, battles: 2, updatedAt: T1,
    battle: { battleId: 'battle:0:world:2', nodeId: 'w1-1-1-s2', startedAt: T1, input: map.input, actions: map.actions.slice(0, V27_WORLD_FIGHT.actions) },
  }
  world.rift = {
    runs: [{ id: 't1-r1', roster: ids(100, 20), startedAt: T1, fronts: { iron: 4, arcane: 0, duel: 0, horde: 0 }, convergence: { attempts: 0, open: null },
      traces: { iron: ['physical'] }, wonAt: null, ascendedAt: null }],
    echoes: {},
    battle: { battleId: 'rift:t1:5', ref: { kind: 'front', front: 'iron', stage: 5 }, startedAt: T2, input: rift.input, actions: rift.actions.slice(0, V27_RIFT_FIGHT.actions) },
    battles: 5,
  }
  save.account.updatedAt = T2
  return save
}

/** A save's worlds as JSON, each run through `step`, still labelled v26: what H72's chain will hand the parser. */
export function migrated(save: Save, step: (world: Record<string, unknown>) => Record<string, unknown>): unknown {
  const raw = JSON.parse(JSON.stringify(save)) as { tierWorlds: Record<string, Record<string, unknown>> }
  return { ...raw, tierWorlds: Object.fromEntries(Object.entries(raw.tierWorlds).map(([k, w]) => [k, step(w)])) }
}
