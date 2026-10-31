// The three accessory slots' balance (D266): each class of the owner's two parties (D263) on her preset's weapons, on curve,
// with no accessory against her preset's three slots, with her signature, and against every mix a slot can wear. The
// always-on checks are small; the tables: `SIM=1 npx vitest run src/world/balance-v20.test.ts` (`SIM_SEEDS=32`).
import { describe, expect, it } from 'vitest'
import { signatureBonus } from '../economy/accessories'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import type { BattleAlly } from '../rpg/battle/types'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import type { RpgClass, RpgTier1Class } from '../rpg/rules'
import { weaponPreset, type PresetAccessory } from '../save/presets'
import { balanceMember, balanceStage, onCurveGrade, type BalanceOptions } from './balance-party'
import { play } from './balance-play'
import { damageOf, fightLog, logFight } from './balance-measure'
import { regionChapter, worldContinent } from './world'

const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true }
const PARTY_1: readonly RpgTier1Class[] = ['brawler', 'mage', 'spellblade', 'summoner', 'paladin']
const PARTY_2: readonly RpgTier1Class[] = ['brawler', 'mage', 'tomeblade', 'armsummoner', 'cleric']
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const SEEDS = Number(process.env.SIM_SEEDS ?? 8)
const NONE: readonly (PresetAccessory | null)[] = [null, null, null]
type Kind = 'fight' | 'sub-boss' | 'boss'
const KINDS: readonly Kind[] = ['fight', 'sub-boss', 'boss']

function stagesAt(level: number): Record<Kind, RpgMapNode[]> {
  const out: Record<Kind, RpgMapNode[]> = { fight: [], 'sub-boss': [], boss: [] }
  const regions = worldContinent({ name: 'Sim', order: Math.ceil(level / 10) }).regions.filter((r) => r.level <= level && level <= r.levelTop)
  for (const region of regions) for (const n of regionChapter(region, cast).nodes) if (n.kind !== 'camp' && n.level === level) out[n.kind as Kind].push(n)
  return out
}
/** Each kind of fight: rounds, damage taken, and each class's damage a turn. */
function measure(allies: BattleAlly[], level: number) {
  const stages = stagesAt(level)
  return Object.fromEntries(KINDS.map((kind) => {
    const log = fightLog()
    stages[kind].forEach((node, i) => {
      for (let s = 0; s < SEEDS; s++) {
        const { observe, done } = logFight(allies, log)
        done(play(balanceStage(node, 1000 + i + 100 * s, allies), observe))
      }
    })
    const dmg = Object.fromEntries(Object.values(log.umas).map((u) => [u.classId, damageOf(u) / Math.max(1, u.turns)]))
    return [kind, { wins: log.wins / log.fights, rounds: log.rounds / log.fights, taken: log.taken / log.fights, dmg }]
  })) as Record<Kind, { wins: number; rounds: number; taken: number; dmg: Record<string, number> }>
}
const partyOf = (classes: readonly RpgClass[], level: number, forms: (c: RpgClass) => BalanceOptions, signature = 0) =>
  classes.map((c, i) => ({ ...balanceMember(c, i, level, { ...ON_CURVE, ...forms(c) }), ...(signature ? { signature } : {}) }))
const mean = (r: ReturnType<typeof measure>, read: (x: ReturnType<typeof measure>[Kind]) => number) =>
  (read(r.fight) * 2 + read(r['sub-boss']) + read(r.boss)) / 4
const gain = (r: ReturnType<typeof measure>, base: ReturnType<typeof measure>, c: string) => (mean(r, (x) => x.dmg[c]!) / mean(base, (x) => x.dmg[c]!) - 1) * 100

describe('three accessory slots on curve (D266)', () => {
  it('builds her with her preset’s three slots: her stat twice and an Orb, each at her grade', () => {
    const level = 50
    const grade = onCurveGrade(level)
    const worn = balanceMember('brawler', 0, level, ON_CURVE)
    const bare = balanceMember('brawler', 0, level, { ...ON_CURVE, accessories: NONE })
    expect(worn.stats.atk - bare.stats.atk).toBe(2 * grade)
    expect(worn.flat).toEqual({ greatsword: 2 * grade })
    expect(weaponPreset('brawler').accessories.map((a) => a.family)).toEqual(['pendant', 'pendant', 'orb'])
    const insignias = balanceMember('brawler', 0, level, { ...ON_CURVE, accessories: [{ family: 'insignia' }, { family: 'insignia' }, { family: 'insignia' }] })
    expect(insignias.insignia).toEqual({ value: 300 })
  })

  it.runIf(process.env.SIM)('prints each class’s gain and the party’s pace by level', () => {
    for (const [name, classes] of [['Party 1', PARTY_1], ['Party 2', PARTY_2]] as const) {
      for (const level of [10, 20, 30, 40, 50]) {
        const bare = measure(partyOf(classes, level, () => ({ accessories: NONE })), level)
        const worn = measure(partyOf(classes, level, () => ({})), level)
        const star = measure(partyOf(classes, level, () => ({}), signatureBonus(level, 1, BATTLE_ENGINE_VERSION)), level)
        const line = (r: typeof bare) => `${classes.map((c) => gain(r, bare, c).toFixed(1).padStart(6)).join('')} · rounds ${mean(r, (x) => x.rounds).toFixed(2)} · taken ${mean(r, (x) => x.taken).toFixed(0)} · wins ${Math.min(...KINDS.map((k) => r[k].wins)).toFixed(2)}`
        console.log(`${name} Lv ${level}\n  bare ${line(bare)}\n  slots ${line(worn)}\n  ★ ${line(star)}`)
      }
    }
  }, 600_000)

  it.runIf(process.env.SIM)('prints which mix wins each class and kind of fight at Lv 50', () => {
    const level = 50
    const P = { family: 'pendant' } as const, C = { family: 'bell' } as const, I = { family: 'insignia' } as const
    for (const c of [...PARTY_1, ...PARTY_2.filter((x) => !PARTY_1.includes(x))]) {
      const O = weaponPreset(c).accessories.find((a) => a.family === 'orb')!
      const classes = PARTY_1.includes(c) ? PARTY_1 : PARTY_2
      const S = weaponPreset(c).accessories[0]!
      const mixes = { 'stat ×3': [S, S, S], 'stat ×2, Orb': [S, S, O], 'stat, Orb ×2': [S, O, O], 'Orb ×3': [O, O, O], 'stat ×2, Insignia': [S, S, I], 'stat, Orb, Insignia': [S, O, I], 'Insignia ×3': [I, I, I], 'Pendant, Charm, Orb': [P, C, O] }
      const only = (forms: readonly PresetAccessory[] | null) => measure(partyOf(classes, level, (x) => ({ accessories: x === c && forms ? forms : NONE })), level)
      const bare = only(null)
      const rows = Object.entries(mixes).map(([mix, forms]) => { const r = only(forms); return [mix, ...KINDS.map((k) => (r[k].dmg[c]! / bare[k].dmg[c]! - 1) * 100)] as const })
      console.log(`${c}\n${rows.map(([mix, ...v]) => `  ${mix.padEnd(20)}${v.map((x) => x.toFixed(1).padStart(6)).join('')}`).join('\n')}`)
    }
  }, 600_000)
})
