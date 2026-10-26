// R2's balance in the world (the Tier rework's Tier 1 economy, engine v17, H81; README §9.5 items 1, 2, 5–8 and the Tier 2
// and 3 worlds on Tier 1's shape × tier; stat-balance §12): engine v17 measured with explicit v17 inputs, never the switch,
// against the same measurement on v15 ("today's", H60–H63) and v16 (R1's, H71). The v17 member is `balanceMember`'s
// (`engine: 17`): grades on curve, WP25's Tier 1 forms, the core map her level opens with Prowess at her split, Class Rank
// on R1's real pace, the base MP regen and no MP accessory, no template (XR12) unless `template` makes her matched. The
// always-on checks are small; the targets' tables: `SIM=1 npx vitest run src/world/balance-v17.test.ts` (`SIM_SEEDS=32`
// for the delivery; `SIM_TARGETS=1,5` and `SIM_LEVELS=30,50` narrow them while tuning). The Rift's are
// `rift/balance-v17.test.ts`; H51's tables play v17 with `SIM_ENGINE=17`.
import { describe, expect, it } from 'vitest'
import { accessoryParts } from '../economy/accessories'
import { tierScaled } from '../economy/grades'
import { createBattle, battleDamage } from '../rpg/battle/engine'
import type { BattleAlly, BattleInput } from '../rpg/battle/types'
import { rpgFoe } from '../rpg/campaign/enemies'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import { rpgNode, rpgNodeSkill } from '../rpg/catalog'
import {
  isRpgTome, RPG_ALL_CLASSES, RPG_CLASS_ARMOR, rpgBaseMpRegen, rpgIsHealer, rpgDefaultWeapons, rpgHand, rpgHeldSkills, rpgOpenDepth, rpgWeaponKind,
  type RpgClass, type RpgDamageKind,
} from '../rpg/rules'
import type { UmaKnack, UmaStride } from '../roster/template'
import { classPresetV3, type PresetAccessory } from '../save/presets'
import { BALANCE_PARTY, balanceMember, balanceStage, type BalanceOptions, type BalanceTemplate } from './balance-party'
import { play } from './balance-play'
import { byClass, damageOf, fightLog, logFight, perTurn, physicalShare, type FightLog, type UmaLog } from './balance-measure'
import { regionChapter, worldContinent } from './world'

const V15 = 15, V16 = 16, V17 = 17
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true }
type Kind = 'fight' | 'sub-boss' | 'boss'
const KINDS: readonly Kind[] = ['fight', 'sub-boss', 'boss']

const lifetimeOf = (level: number, tier = 1) => 50 * (tier - 1) + level
const regionsAt = (level: number, tier = 1) => {
  const lifetime = lifetimeOf(level, tier)
  return worldContinent({ name: 'Sim', order: 5 * (tier - 1) + Math.ceil(level / 10) }).regions.filter((r) => r.level <= lifetime && lifetime <= r.levelTop)
}
function stagesAt(level: number, tier: number, engine: number): Record<Kind, RpgMapNode[]> {
  const lifetime = lifetimeOf(level, tier)
  const out: Record<Kind, RpgMapNode[]> = { fight: [], 'sub-boss': [], boss: [] }
  for (const region of regionsAt(level, tier)) {
    for (const n of regionChapter(region, cast, engine).nodes) if (n.kind !== 'camp' && n.level === lifetime) out[n.kind as Kind].push(n)
  }
  return out
}
const allStages = (level: number, tier: number, engine: number): RpgMapNode[] => {
  const s = stagesAt(level, tier, engine)
  return [...s.fight, ...s['sub-boss'], ...s.boss]
}
/** The balance party at a level in an engine's generation; `swap` puts a class in another's place (the Paladin for the
 * Cleric), `each` adds to one member's options by her class. */
const partyAt = (level: number, engine: number, options: BalanceOptions = {}, swap: Partial<Record<RpgClass, RpgClass>> = {},
  each: (c: RpgClass) => BalanceOptions = () => ({})): BattleAlly[] =>
  BALANCE_PARTY.map((c) => swap[c] ?? c).map((c, i) => balanceMember(c, i, level, { ...ON_CURVE, ...options, engine, ...each(c) }))
function playInto(nodes: readonly RpgMapNode[], allies: BattleAlly[], engine: number, seeds: number, into: FightLog = fightLog()): FightLog {
  nodes.forEach((node, i) => {
    for (let s = 0; s < seeds; s++) {
      const { observe, done } = logFight(allies, into)
      done(play(balanceStage(node, 1000 + i + 100 * s, allies, engine as BattleInput['version']), observe))
    }
  })
  return into
}
/** Each stage's own log, by node id: a context's stages are filtered afterwards (item 7). */
function playEach(nodes: readonly RpgMapNode[], allies: BattleAlly[], engine: number, seeds: number): Map<string, FightLog> {
  const out = new Map<string, FightLog>()
  nodes.forEach((node, i) => {
    const log = fightLog()
    for (let s = 0; s < seeds; s++) {
      const { observe, done } = logFight(allies, log)
      done(play(balanceStage(node, 1000 + i + 100 * s, allies, engine as BattleInput['version']), observe))
    }
    out.set(node.id, log)
  })
  return out
}
const pct = (x: number) => `${Math.round(100 * x)}%`
const p1 = (x: number) => `${(100 * x).toFixed(1)}%`
const f1 = (x: number) => x.toFixed(1)
const f2 = (x: number) => x.toFixed(2)
const winRate = (l: FightLog) => (l.fights ? l.wins / l.fights : 0)
const roundsOf = (l: FightLog) => (l.fights ? l.rounds / l.fights : 0)
const partyDamage = (l: FightLog) => Object.values(l.umas).reduce((n, u) => n + damageOf(u), 0)
const tick = () => new Promise((resolve) => setTimeout(resolve, 0))
const sumOf = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0)

/** Her deepest act's MP (the refund check, as R1's file). */
function deepActMp(a: BattleAlly, engine: number): number {
  const depth = rpgOpenDepth(a.classRank!)
  const held = rpgHeldSkills({ classId: a.classId, weapons: a.weapons, tier: a.tier, classRank: a.classRank!, tree: [], legacy: [], ...(a.lines ? { lines: a.lines } : {}) }, engine)
    .map((r) => rpgNode(r.id)!).filter((n) => n.depth === depth)
  const hand = rpgHand({ classId: a.classId }, engine)
  const cost = (tome: boolean | null) => Math.max(0, ...held.filter((n) => tome === null || isRpgTome(n.weapon) === tome)
    .map((n) => Math.max(1, Math.round(rpgNodeSkill(n, engine).mp * hand.mp))))
  return hand.pair ? cost(false) + cost(true) : cost(null)
}
function refundAt(classId: RpgClass, level: number, tier = 1): { mp: number; regen: number; deep: number; share: number } {
  const a = balanceMember(classId, 0, level, { ...ON_CURVE, engine: V17, tier })
  const regen = rpgBaseMpRegen(a.stats.mp, a.classRank!, V17)
  const deep = deepActMp(a, V17)
  return { mp: a.stats.mp, regen, deep, share: regen / deep }
}

/** A region's twelve stages back to back, MP carried, the party at each stage's level, a Spring before stage 7 (as R1's
 * file): stages cleared before the first loss, stages 9–12's rounds and MP's drag on them (those rounds ÷ the same stages
 * on a full bar). */
function regionRun(level: number, engine: number, seeds: number, tier = 1, each: (c: RpgClass) => BalanceOptions = () => ({})) {
  const cleared: number[] = []
  let lateRounds = 0, freshRounds = 0, late = 0
  for (const region of regionsAt(level, tier).slice(0, 4)) {
    const nodes = regionChapter(region, cast, engine).nodes.filter((x) => x.kind !== 'camp')
    for (let s = 0; s < seeds; s++) {
      let mp: Record<string, number> = {}
      let n = 0
      for (const node of nodes) {
        if (n === 6) mp = {}
        const full = partyAt(node.level - 50 * (tier - 1), engine, { tier }, {}, each)
        const party = full.map((a) => ({ ...a, mp: Math.min(a.mp, mp[a.id] ?? a.mp) }))
        const r = play(balanceStage(node, 2000 + n + 100 * s, party, engine as BattleInput['version']))
        if (!r.won) break
        if (n >= 8) {
          lateRounds += r.rounds; late++
          freshRounds += play(balanceStage(node, 2000 + n + 100 * s, full, engine as BattleInput['version'])).rounds
        }
        n++
        mp = Object.fromEntries(party.map((a) => [a.id, r.mp[a.id] ?? a.mp]))
      }
      cleared.push(n)
    }
  }
  return { cleared, mean: sumOf(cleared) / Math.max(1, cleared.length), all: cleared.filter((n) => n === 12).length,
    tenPlus: cleared.filter((n) => n >= 10).length, lateRounds: lateRounds / Math.max(1, late), drag: lateRounds / Math.max(1, freshRounds) }
}

/** A region's twelve stages back to back at each stage's level, MP carried and a Spring before stage 7, as `regionRun`
 * plays them but through a loss too: each stage's own log, by node id, `seeds` times (items 7 and 8: a form or her
 * signature "left on all region long", WP §5.7's campaign, where MP runs low late and she Attacks). */
function regionLogs(level: number, engine: number, seeds: number, swap: Partial<Record<RpgClass, RpgClass>> = {},
  each: (c: RpgClass) => BalanceOptions = () => ({})): { nodes: RpgMapNode[]; logs: Map<string, FightLog> } {
  const logs = new Map<string, FightLog>()
  const nodesAll: RpgMapNode[] = []
  for (const region of regionsAt(level).slice(0, 4)) {
    const nodes = regionChapter(region, cast, engine).nodes.filter((x) => x.kind !== 'camp')
    nodesAll.push(...nodes)
    for (let s = 0; s < seeds; s++) {
      let mp: Record<string, number> = {}
      nodes.forEach((node, n) => {
        if (n === 6) mp = {}
        const party = partyAt(node.level, engine, {}, swap, each).map((a) => ({ ...a, mp: Math.min(a.mp, mp[a.id] ?? a.mp) }))
        const log = logs.get(node.id) ?? fightLog()
        logs.set(node.id, log)
        const { observe, done } = logFight(party, log)
        const r = play(balanceStage(node, 2000 + n + 100 * s, party, engine as BattleInput['version']), observe)
        done(r)
        mp = Object.fromEntries(party.map((a) => [a.id, r.mp[a.id] ?? 0]))
      })
    }
  }
  return { nodes: nodesAll, logs }
}

/** One Uma's log over some stages of a `regionLogs` run. */
function herOn(logs: Map<string, FightLog>, id: string, nodes: readonly RpgMapNode[]): UmaLog | undefined {
  let m: UmaLog | undefined
  for (const n of nodes) {
    const u = logs.get(n.id)?.umas[id]
    if (!u) continue
    m ??= { ...u, physical: 0, magical: 0, limitPhysical: 0, limitMagical: 0, farewell: 0, turns: 0, heal: 0, big: 0, bigTurns: 0, attacks: 0, flourish: 0 }
    for (const f of ['physical', 'magical', 'limitPhysical', 'limitMagical', 'farewell', 'turns', 'heal', 'big', 'bigTurns', 'attacks', 'flourish'] as const) m[f] += u[f]
  }
  return m
}

/** A regular striker's 100% hit (its Strike, physical, no element) on an Uma, as a share of her HP (WP15, SB13): the
 * engine's own damage, with her evasion or without. */
function regularHitShare(a: BattleAlly, lifetime: number, evasion: boolean): number {
  const foe = rpgFoe({ id: 'f', castId: 'c', element: 'fire', role: 'striker', rank: 'regular', level: lifetime, shield: 2, weaknesses: { weapons: [], elements: ['ice'] } }, V17)
  const ally = evasion ? a : { ...a, evasion: undefined }
  // A fight takes five: hers in slot 1 (id 100), the balance party's other four beside her.
  const others = partyAt(a.level, V17, { tier: a.tier }, rpgIsHealer(a.classId) ? { cleric: 'brawler' } : {}).slice(1)
  const s = createBattle({ version: V17 as BattleInput['version'], seed: 1, allies: [ally, ...others], enemies: [foe] }).state
  const u = s.units.find((x) => x.id === a.id)!, e = s.units.find((x) => x.id === 'f')!
  return battleDamage(s, e, u, 'physical', 1, null).amount / a.stats.hp
}

// --- Item 7: the forms ---------------------------------------------------------------------------------------------

type Context = 'campaign' | 'tuned' | 'long' | 'waves'
const CONTEXTS: readonly Context[] = ['campaign', 'tuned', 'long', 'waves']
/** A stage's foes, every wave. */
const foesOf = (n: RpgMapNode) => [...n.enemies, ...(n.waves ?? []).flat()]
/** A stage tuned to a kind: half its foes or more are weak to it (twins: a region's foes share their sets). */
const tunedTo = (n: RpgMapNode, k: RpgDamageKind) => {
  const foes = foesOf(n)
  return 2 * foes.filter((f) => f.weaknesses.weapons.includes(k as never) || f.weaknesses.elements.includes(k as never)).length >= foes.length
}
const isWaves = (n: RpgMapNode) => n.kind === 'fight' && [n.enemies, ...(n.waves ?? [])].some((w) => w.length >= 4)
/** One form alone at G10 in her slot: the family's base form, an Orb's or a Bell's kind. */
interface FormCase { label: string; form: PresetAccessory | null }
const formsOf = (classId: RpgClass): FormCase[] => {
  const kinds = rpgDefaultWeapons(classId, V17).map(rpgWeaponKind)
  return [
    { label: 'none', form: null }, { label: 'Pendant', form: { family: 'pendant' } }, { label: 'Insignia', form: { family: 'insignia' } },
    ...kinds.map((kind): FormCase => ({ label: `Orb ${kind}`, form: { family: 'orb', kind } })),
    ...kinds.map((kind): FormCase => ({ label: `Bell ${kind}`, form: { family: 'bell', kind } })),
  ]
}
const familyOfLabel = (label: string) => label.split(' ')[0]!

// --- Item 8: the templates ---------------------------------------------------------------------------------------------

/** A knack for each family (UT7): the Bell Fleet's, the Orb Mighty's, the Pendant Tireless's, the Insignia Gritty's. */
const KNACK_OF: Readonly<Record<string, UmaKnack>> = { bell: 'fleet', orb: 'mighty', pendant: 'tireless', insignia: 'gritty' }
/** The five matched Umas of the party (her calling her class), one family each way: the Brawler's Bell (her preset's), the
 * Mage's Pendant (hers), the Spell Blade's Orb, the Cleric's Insignia and the Summoner's Insignia (Clever). */
const MATCHED: Readonly<Record<RpgClass, BalanceTemplate>> = {
  brawler: { knack: 'fleet', calling: 'brawler' }, mage: { knack: 'tireless', calling: 'mage' }, spellblade: { knack: 'mighty', calling: 'spellblade' },
  cleric: { knack: 'gritty', calling: 'cleric' }, summoner: { knack: 'clever', calling: 'summoner' }, paladin: { knack: 'gritty', calling: 'paladin' },
}

/** §8.2's Extra Stats part of each stat at each tier's Lv 50 (HP, MP, ATK, M.ATK, DEF, M.DEF), without her moon. */
const SHEET_EXTRA: Readonly<Record<RpgClass, readonly (readonly number[])[]>> = {
  brawler: [[255, 51, 51, 21, 51, 51], [460, 92, 92, 38, 92, 92], [665, 133, 133, 55, 133, 133]],
  mage: [[255, 51, 21, 51, 51, 51], [460, 92, 38, 92, 92, 92], [665, 133, 55, 133, 133, 133]],
  spellblade: [[255, 51, 42, 30, 51, 51], [460, 92, 77, 53, 92, 92], [665, 133, 110, 78, 133, 133]],
  summoner: [[255, 51, 30, 42, 51, 51], [460, 92, 53, 77, 92, 92], [665, 133, 78, 110, 133, 133]],
  paladin: [[255, 51, 45, 27, 51, 51], [460, 92, 81, 49, 92, 92], [665, 133, 118, 70, 133, 133]],
  cleric: [[255, 51, 27, 45, 51, 51], [460, 92, 49, 81, 92, 92], [665, 133, 70, 118, 133, 133]],
}
const STAT_KEYS = ['hp', 'mp', 'atk', 'matk', 'pdef', 'mdef'] as const

describe('R2\'s balance in the world on engine v17 (H81)', () => {
  it('builds the v17 member\'s Lv 50 sheet as extra-stats §8.2 and weapon-progression §4.4 do: armor, the map and Might to the point', () => {
    for (const tier of [1, 2, 3] as const) for (const c of RPG_ALL_CLASSES) {
      const built = balanceMember(c, 0, 50, { ...ON_CURVE, engine: V17, tier })
      const bare = balanceMember(c, 0, 50, { heroes: true, engine: V17, tier })
      const half = RPG_CLASS_ARMOR[c]
      // WP15's suit at G10 × tier: HP +150, MP +30, DEF and M.DEF +40, +25 offense on her half.
      const armor = [tierScaled(150, tier), tierScaled(30, tier), half === 'physical' ? tierScaled(25, tier) : 0, half === 'magical' ? tierScaled(25, tier) : 0,
        tierScaled(40, tier), tierScaled(40, tier)]
      STAT_KEYS.forEach((k, i) => {
        expect(Math.abs(built.stats[k] - bare.stats[k] - SHEET_EXTRA[c][tier - 1]![i]! - armor[i]!), `T${tier} ${c} ${k}`).toBeLessThanOrEqual(1)
      })
      for (const w of built.weapons) expect(built.might?.[rpgWeaponKind(w)], `T${tier} ${c} ${w}`).toBe([68, 122, 177][tier - 1])
    }
  })

  it('wears WP25\'s Tier 1 forms: `classPresetV3(c, 17)` is the harness\'s form for all six', () => {
    for (const c of RPG_ALL_CLASSES) {
      const a = balanceMember(c, 0, 50, { ...ON_CURVE, engine: V17 })
      const form = classPresetV3(c, V17).accessory
      const parts = accessoryParts({ grade: 10, family: form.family, form: 'base', ...(form.kind ? { kind: form.kind } : {}) }, a.weapons, 1)
      expect({ flat: a.flat ?? {}, bell: a.bell, insignia: a.insignia }, c).toEqual({ flat: parts.flat, bell: parts.bell, insignia: parts.insignia })
    }
    expect(classPresetV3('brawler', V17).accessory).toEqual({ family: 'bell', kind: 'greatsword' })
    expect(classPresetV3('summoner', V17).accessory).toEqual({ family: 'orb', kind: 'light' })
    expect(classPresetV3('cleric', V17).accessory).toEqual({ family: 'orb', kind: 'ice' })
  })

  it('dresses a matched member in her family by UT8\'s swap, with her signature, her moon and her Flourish', () => {
    const plain = balanceMember('mage', 0, 50, { ...ON_CURVE, engine: V17 })
    const orb = balanceMember('mage', 0, 50, { ...ON_CURVE, engine: V17, template: { knack: 'mighty', calling: 'mage' } })
    expect(orb.flat).toEqual({ fire: 27 })
    expect(orb.signature).toBe(10)
    expect(orb.flourish).toBe('even-pace')
    // Her moon: Mighty's +4 DEF and M.DEF at node I, the Mage's +8 M.DEF at node II.
    expect([orb.stats.pdef - plain.stats.pdef, orb.stats.mdef - plain.stats.mdef]).toEqual([4, 12])
    // In another class she keeps her signature and her moon, not her Flourish (UT12).
    const away = balanceMember('brawler', 0, 50, { ...ON_CURVE, engine: V17, template: { knack: 'mighty', calling: 'mage' } })
    expect([away.signature, away.flourish]).toEqual([10, undefined])
  })

  it('lets the v17 party win a Tier 1 Lv 30 stage on Auto', () => {
    const node = stagesAt(30, 1, V17).boss[0]!
    expect(play(balanceStage(node, 7, partyAt(30, V17), V17 as BattleInput['version'])).won).toBe(true)
  })

  it('never refunds a deep act by a round with the base regen alone, any class, Lv 1–50 (SB18)', () => {
    for (const c of RPG_ALL_CLASSES) for (let level = 1; level <= 50; level++) {
      const r = refundAt(c, level)
      expect(r.share, `${c} Lv ${level}: ${r.regen} of ${r.deep}`).toBeLessThan(1)
    }
  })

  it.skipIf(!process.env.SIM)('prints R2\'s targets in the world (README §9.5 items 1, 2, 5–8, the Tier 2 and 3 worlds as 9)', async () => {
    const want = new Set((process.env.SIM_TARGETS ?? '1,2,5,6,7,8,9').split(',').map(Number))
    const seeds = Number(process.env.SIM_SEEDS ?? 8)
    const levels = process.env.SIM_LEVELS ? process.env.SIM_LEVELS.split(',').map(Number) : null
    const rows: string[] = [`engine v17 against v15 (today's) and v16 (R1), world stages × ${seeds} seeds; on curve, first try on Auto`]
    /** Prints what is measured so far, so one item's crash never loses another's table. */
    const flush = () => { if (rows.length) console.log(rows.splice(0).join('\n')) }
    const logs = new Map<string, Record<Kind, FightLog>>()
    const run = async (key: string, level: number, tier: number, engine: number, allies: BattleAlly[]) => {
      const cached = logs.get(key)
      if (cached) return cached
      const stages = stagesAt(level, tier, engine)
      const out = { fight: fightLog(), 'sub-boss': fightLog(), boss: fightLog() } as Record<Kind, FightLog>
      for (const k of KINDS) playInto(stages[k], allies, engine, seeds, out[k])
      logs.set(key, out)
      await tick()
      return out
    }
    const cells = (r: Record<Kind, FightLog>) => KINDS.map((k) => (r[k].fights ? `${pct(winRate(r[k]))} ${f1(roundsOf(r[k]))}r` : '—')).join(' | ')
    const pace = (r: Record<Kind, FightLog>, base: Record<Kind, FightLog>) => KINDS.map((k) => f2((partyDamage(r[k]) / Math.max(1, r[k].rounds)) /
      (partyDamage(base[k]) / Math.max(1, base[k].rounds)))).join(' · ')
    const gap = (a: Record<Kind, FightLog>, b: Record<Kind, FightLog>) => Math.max(...KINDS.filter((k) => a[k].fights).map((k) => Math.abs(winRate(a[k]) - winRate(b[k]))))
    const all = (r: Record<Kind, FightLog>): FightLog => {
      const m = fightLog()
      for (const k of KINDS) {
        m.fights += r[k].fights; m.wins += r[k].wins; m.rounds += r[k].rounds
        for (const [id, u] of Object.entries(r[k].umas)) {
          const x = (m.umas[id] ??= { ...u, physical: 0, magical: 0, limitPhysical: 0, limitMagical: 0, farewell: 0, turns: 0, heal: 0, big: 0, bigTurns: 0, attacks: 0, flourish: 0 })
          for (const f of ['physical', 'magical', 'limitPhysical', 'limitMagical', 'farewell', 'turns', 'heal', 'big', 'bigTurns', 'attacks', 'flourish'] as const) x[f] += u[f]
        }
      }
      return m
    }

    if (want.has(1)) {
      rows.push('', 'Item 1: tier level | party | regular | elite | boss (win rate, rounds) | gap to v15 | the party\'s damage a round ÷ v15\'s · ÷ v16\'s')
      let worst = 0
      for (const level of levels ?? [10, 20, 30, 40, 50]) {
        const v15 = await run(`1:${level}:15`, level, 1, V15, partyAt(level, V15))
        const v16 = await run(`1:${level}:16`, level, 1, V16, partyAt(level, V16))
        const v17 = await run(`1:${level}:17`, level, 1, V17, partyAt(level, V17))
        const p15 = await run(`1:${level}:15p`, level, 1, V15, partyAt(level, V15, {}, { cleric: 'paladin' }))
        const p17 = await run(`1:${level}:17p`, level, 1, V17, partyAt(level, V17, {}, { cleric: 'paladin' }))
        worst = Math.max(worst, gap(v17, v15), gap(p17, p15))
        rows.push(`T1 Lv${level} | v15 | ${cells(v15)} | — | —`, `T1 Lv${level} | v16 | ${cells(v16)} | ${f1(100 * gap(v16, v15))} pts | ${pace(v16, v15)}`,
          `T1 Lv${level} | v17 | ${cells(v17)} | ${f1(100 * gap(v17, v15))} pts | ${pace(v17, v15)} · ${pace(v17, v16)}`,
          `T1 Lv${level} | v17, Paladin for the Cleric | ${cells(p17)} | ${f1(100 * gap(p17, p15))} pts | ${pace(p17, p15)}`)
      }
      rows.push(`Worst gap (on curve): ${f1(100 * worst)} points`)
      // The build: each class's damage a turn on v17 ÷ v16, the same three weapons and twins (R2's gear against today's).
      rows.push('', 'Item 1, the build: class | her damage a turn, v17 ÷ v16, Lv 10 · 20 · 30 · 40 · 50 (every stage)')
      const buildLevels = levels ?? [10, 20, 30, 40, 50]
      for (const c of RPG_ALL_CLASSES) {
        const swap = c === 'paladin' ? { cleric: 'paladin' as const } : {}
        const ratios: string[] = []
        for (const level of buildLevels) {
          const a = all(await run(`1:${level}:16${c === 'paladin' ? 'p' : ''}`, level, 1, V16, partyAt(level, V16, {}, swap)))
          const b = all(await run(`1:${level}:17${c === 'paladin' ? 'p' : ''}`, level, 1, V17, partyAt(level, V17, {}, swap)))
          ratios.push(f2(perTurn(byClass(b, c)) / perTurn(byClass(a, c))))
        }
        rows.push(`${c} | ${ratios.join(' · ')}`)
      }
      // Skill Ranks at Lv 50: Class Rank 50 (every held skill Rank 5) ÷ Class Rank 44 (her depth-5 skills at Rank 3, ×1.00).
      const at50 = all(await run('1:50:17', 50, 1, V17, partyAt(50, V17)))
      const at44 = all(await run('1:50:17cr44', 50, 1, V17, partyAt(50, V17, { classRank: 44 })))
      rows.push('', `Item 1, Skill Ranks at Lv 50: the party's damage a round, Class Rank 50 ÷ 44: ${f2((partyDamage(at50) / at50.rounds) / (partyDamage(at44) / at44.rounds))}`)
    }

    flush()
    if (want.has(2)) {
      rows.push('', 'Item 2: Lv | engine | Spell Blade a turn, physical | Summoner a turn, magical | Summoner ÷ Spell Blade (the world\'s regular stages)')
      for (const level of levels ?? [10, 30, 50]) {
        for (const engine of [V15, V16, V17]) {
          const r = await run(`1:${level}:${engine}`, level, 1, engine, partyAt(level, engine))
          const sb = byClass(r.fight, 'spellblade')!, su = byClass(r.fight, 'summoner')!
          rows.push(`Lv${level} | v${engine} | ${f1(perTurn(sb))}, ${pct(physicalShare(sb))} | ${f1(perTurn(su))}, ${pct(1 - physicalShare(su))} | ${pct(perTurn(su) / perTurn(sb))}`)
        }
      }
    }

    flush()
    if (want.has(5)) {
      rows.push('', 'Item 5: Lv | party | stages cleared of 12 (mean; all 12; 10+) | rounds a stage in stages 9–12 | today\'s ÷ it (pace) | MP\'s drag')
      for (const level of levels ?? [10, 30, 50]) {
        const v15 = regionRun(level, V15, seeds)
        await tick()
        const v16 = regionRun(level, V16, seeds)
        await tick()
        const v17 = regionRun(level, V17, seeds)
        await tick()
        const line = (label: string, r: ReturnType<typeof regionRun>) => rows.push(`Lv${level} | ${label} | ${f1(r.mean)}; ${r.all} of ${r.cleared.length}; ` +
          `${r.tenPlus} | ${f2(r.lateRounds)} | ${f2(v15.lateRounds / r.lateRounds)} | ${f2(r.drag)}`)
        line('v15, today\'s supports', v15)
        line('v16, R1 (today\'s supports)', v16)
        line('v17, no MP accessory', v17)
      }
      rows.push('', 'Item 5, the first levels\' MP: tier | Lv 10 drag | its lead on Tier 1 (Tier 1\'s drag ÷ it)')
      const t1 = regionRun(10, V17, seeds)
      for (const tier of [1, 2, 3]) {
        const r = tier === 1 ? t1 : regionRun(10, V17, seeds, tier)
        rows.push(`T${tier} | ${f2(r.drag)} | ${f2(t1.drag / r.drag)}`)
        await tick()
      }
      rows.push('', 'Item 5, the refund: class | MP, regen a round, deepest act\'s MP, share at Lv 10 · 20 · 30 · 40 · 50 | the most, Lv 1–50')
      for (const c of RPG_ALL_CLASSES) {
        const at = [10, 20, 30, 40, 50].map((l) => refundAt(c, l))
        const most = Array.from({ length: 50 }, (_, k) => ({ level: k + 1, ...refundAt(c, k + 1) })).reduce((m, x) => (x.share > m.share ? x : m))
        rows.push(`${c} | ${at.map((x) => `${x.mp}, +${x.regen}, ${x.deep}, ${pct(x.share)}`).join(' · ')} | ${pct(most.share)} at Lv ${most.level}`)
      }
    }

    flush()
    if (want.has(6)) {
      rows.push('', 'Item 6: class | a regular\'s 100% hit, share of her HP at each tier\'s Lv 50 (no evasion: T1 · T2 · T3) | with her feet\'s evasion')
      for (const c of RPG_ALL_CLASSES) {
        const share = (tier: number, ev: boolean) => regularHitShare(balanceMember(c, 0, 50, { ...ON_CURVE, engine: V17, tier }), lifetimeOf(50, tier), ev)
        rows.push(`${c} | ${[1, 2, 3].map((t) => p1(share(t, false))).join(' · ')} | ${[1, 2, 3].map((t) => p1(share(t, true))).join(' · ')}`)
      }
      rows.push(`Brawler by level, Tier 1, no evasion: ${[10, 20, 30, 40, 50].map((l) => p1(regularHitShare(balanceMember('brawler', 0, l, { ...ON_CURVE, engine: V17 }), l, false))).join(' · ')}`)
    }

    flush()
    if (want.has(7)) {
      rows.push('', 'Item 7: class | context | each form alone at G10 over a region run at Lv 50, MP carried (her damage a turn ÷ an empty slot − 1), ' +
        'the best kind for an Orb and a Bell | best')
      const best: Record<string, number> = { Pendant: 0, Orb: 0, Bell: 0, Insignia: 0 }
      const parity: Record<string, Record<string, { gain: number; perAttack: number }>> = {}
      for (const c of RPG_ALL_CLASSES) {
        const swap = c === 'paladin' ? { cleric: 'paladin' as const } : {}
        const id = String(100 + BALANCE_PARTY.indexOf(c === 'paladin' ? 'cleric' : c))
        const forms = formsOf(c)
        const runs = new Map<string, Map<string, FightLog>>()
        let stages: RpgMapNode[] = []
        for (const f of forms) {
          const r = regionLogs(50, V17, seeds, swap, (k) => (k === c ? { accessory: f.form } : {}))
          runs.set(f.label, r.logs)
          stages = r.nodes
          await tick()
        }
        const gainOn = (label: string, nodes: readonly RpgMapNode[]) => perTurn(herOn(runs.get(label)!, id, nodes)) / perTurn(herOn(runs.get('none')!, id, nodes)) - 1
        const kinds = rpgDefaultWeapons(c, V17).map(rpgWeaponKind)
        for (const ctx of CONTEXTS) {
          // Campaign and waves: one setting for all their stages; tuned and long: the stages of a kind she tunes to, per kind.
          const sets: { kind: RpgDamageKind | null; nodes: RpgMapNode[] }[] = ctx === 'campaign' ? [{ kind: null, nodes: stages }]
            : ctx === 'waves' ? [{ kind: null, nodes: stages.filter(isWaves) }]
              : kinds.map((k) => ({ kind: k, nodes: stages.filter((n) => tunedTo(n, k) && (ctx === 'tuned' || n.kind === 'boss')) })).filter((x) => x.nodes.length)
          // A long fight with no boss weak to her kinds is every boss, untuned.
          if (ctx === 'long' && !sets.length) sets.push({ kind: null, nodes: stages.filter((n) => n.kind === 'boss') })
          const family = (fam: string) => {
            let top = -Infinity, at = ''
            for (const set of sets) for (const f of forms.filter((x) => familyOfLabel(x.label) === fam)) {
              if (set.kind && f.form?.kind && f.form.kind !== set.kind) continue
              const g = gainOn(f.label, set.nodes)
              if (g > top) { top = g; at = f.form?.kind ?? '' }
            }
            return { gain: top, kind: at }
          }
          const r = Object.fromEntries(['Pendant', 'Orb', 'Bell', 'Insignia'].map((fam) => [fam, family(fam)]))
          const winner = Object.entries(r).reduce((m, x) => (x[1].gain > m[1].gain ? x : m))
          best[winner[0]]!++
          rows.push(`${c} | ${ctx} | ${Object.entries(r).map(([fam, x]) => `${fam} ${p1(x.gain)}${x.kind ? ` ${x.kind}` : ''}`).join(' · ')} | ${winner[0]}`)
          if (ctx === 'campaign' && (c === 'brawler' || c === 'mage')) {
            parity[c] = Object.fromEntries(Object.entries(r).map(([fam, x]) => {
              const label = forms.find((f) => familyOfLabel(f.label) === fam && (f.form?.kind ?? '') === x.kind)!.label
              const u = herOn(runs.get(label)!, id, stages)!
              return [fam, { gain: x.gain, perAttack: x.gain / Math.max(0.01, u.attacks / u.turns) }]
            }))
          }
        }
        const plain = herOn(runs.get('none')!, id, stages)!
        rows.push(`${c} | her Attacks a turn over the region (an empty slot): ${pct(plain.attacks / plain.turns)}`)
      }
      rows.push(`Best in (cells of 24): ${Object.entries(best).map(([f, n]) => `${f} ${n}`).join(' · ')}`)
      rows.push(`Channel parity, campaign, Brawler − Mage: ${['Pendant', 'Orb', 'Bell', 'Insignia'].map((f) =>
        `${f} ${(100 * (parity.brawler![f]!.gain - parity.mage![f]!.gain)).toFixed(1)} pts (at an equal Attack share ${(100 * (parity.brawler![f]!.perAttack - parity.mage![f]!.perAttack) / 100).toFixed(2)})`).join(' · ')}`)
    }
    flush()
    if (want.has(8)) {
      rows.push('', 'Item 8, the signature: class | matched in each family over a region run at Lv 50, MP carried (her damage a turn ÷ the ' +
        'template-less member − 1, net of the form she swapped out) | the preset\'s family alone')
      for (const c of RPG_ALL_CLASSES) {
        const swap = c === 'paladin' ? { cleric: 'paladin' as const } : {}
        const id = String(100 + BALANCE_PARTY.indexOf(c === 'paladin' ? 'cleric' : c))
        const base = regionLogs(50, V17, seeds, swap)
        const cellsFor: string[] = []
        for (const fam of ['pendant', 'orb', 'bell', 'insignia']) {
          const l = regionLogs(50, V17, seeds, swap, (k) => (k === c ? { template: { knack: KNACK_OF[fam]!, calling: c } } : {}))
          cellsFor.push(`${fam} ${p1(perTurn(herOn(l.logs, id, l.nodes)) / perTurn(herOn(base.logs, id, base.nodes)) - 1)}`)
          await tick()
        }
        rows.push(`${c} | ${cellsFor.join(' · ')} | ${classPresetV3(c, V17).accessory.family}`)
      }
      rows.push('', 'Item 8, five matched: Lv | template-less | matched (the Brawler\'s Bell, the Mage\'s Pendant, the Spell Blade\'s Orb, the Cleric\'s and the Summoner\'s Insignias) | gap')
      for (const level of levels ?? [10, 30, 50]) {
        const base = await run(`1:${level}:17`, level, 1, V17, partyAt(level, V17))
        const matched = await run(`1:${level}:17m`, level, 1, V17, partyAt(level, V17, {}, {}, (k) => ({ template: MATCHED[k] })))
        rows.push(`Lv${level} | ${cells(base)} | ${cells(matched)} | ${f1(100 * gap(matched, base))} pts`)
      }
      rows.push('', 'Item 8, the mirror with both hybrids matched (the world\'s regular stages): Lv | family | Summoner ÷ Spell Blade, splits')
      for (const level of levels ?? [10, 30, 50]) for (const fam of ['pendant', 'orb']) {
        const stagesR = stagesAt(level, 1, V17).fight
        const l = playInto(stagesR, partyAt(level, V17, {}, {}, (k) => (k === 'spellblade' || k === 'summoner' ? { template: { knack: KNACK_OF[fam]!, calling: k } } : {})), V17, seeds)
        const sb = byClass(l, 'spellblade')!, su = byClass(l, 'summoner')!
        rows.push(`Lv${level} | ${fam} | ${pct(perTurn(su) / perTurn(sb))}, ${pct(physicalShare(sb))} · ${pct(1 - physicalShare(su))}`)
        await tick()
      }
      rows.push('', 'Item 8, the Flourish: stride | its mends a fight ÷ her max HP, as her calling (Lv 50, every class, every stage; Clean break a 4% Barrier at the start)')
      for (const stride of ['middle', 'stayer'] as UmaStride[]) {
        const l = playInto(allStages(50, 1, V17), partyAt(50, V17, {}, {}, (k) => ({ template: { ...MATCHED[k], stride } })), V17, seeds)
        const party = partyAt(50, V17)
        const share = sumOf(Object.entries(l.umas).map(([pid, u]) => u.flourish / party.find((a) => a.id === pid)!.stats.hp)) / party.length / (l.fights)
        rows.push(`${stride} | ${p1(share)}`)
        await tick()
      }
    }

    flush()
    if (want.has(9)) {
      rows.push('', 'Item 9, Tier 2 and 3 worlds on Tier 1\'s shape × tier: tier level | rounds a fight ÷ Tier 1\'s (regular · elite · boss) | win rates')
      for (const level of levels ?? [10, 20, 30, 40, 50]) {
        const t1 = await run(`1:${level}:17`, level, 1, V17, partyAt(level, V17))
        for (const tier of [2, 3]) {
          if (!regionsAt(level, tier).length) { rows.push(`T${tier} Lv${level} | no world`); continue }
          const r = await run(`${tier}:${level}:17`, level, tier, V17, partyAt(level, V17, { tier }))
          rows.push(`T${tier} Lv${level} | ${KINDS.map((k) => f2(roundsOf(r[k]) / Math.max(0.01, roundsOf(t1[k])))).join(' · ')} | ${cells(r)}`)
        }
      }
      rows.push('', 'Item 9, SB1: class | stat | Tier 1 · 2 · 3 at Lv 50: base · armor · Extra Stats shares | the largest move from Tier 1, points')
      let worst = 0
      for (const c of RPG_ALL_CLASSES) {
        for (const k of STAT_KEYS) {
          const shares = [1, 2, 3].map((tier) => {
            const bare = balanceMember(c, 0, 50, { heroes: true, engine: V17, tier }).stats[k]
            const armor = balanceMember(c, 0, 50, { gear: true, heroes: true, engine: V17, tier }).stats[k] - bare
            const extra = balanceMember(c, 0, 50, { stars: true, heroes: true, engine: V17, tier }).stats[k] - bare
            const whole = bare + armor + extra
            return [bare / whole, armor / whole, extra / whole]
          })
          const move = Math.max(...[1, 2].flatMap((t) => shares[t]!.map((x, i) => Math.abs(x - shares[0]![i]!))))
          worst = Math.max(worst, move)
          if (k === 'hp' || k === 'atk' || k === 'matk') rows.push(`${c} | ${k} | ${shares.map((s) => s.map(pct).join(' · ')).join(' | ')} | ${f1(100 * move)}`)
        }
      }
      rows.push(`SB1: the largest share move from Tier 1, any class and stat: ${f1(100 * worst)} points`)
    }
    flush()
  }, 14_400_000)
})

