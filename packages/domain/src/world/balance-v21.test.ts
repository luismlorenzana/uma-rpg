// The combat pass's balance (D282): the owner's two parties on engine v20 against v21, on curve, at each level and kind of
// fight. The tables: `SIM=1 npx vitest run src/world/balance-v21.test.ts` (`SIM_SEEDS=16`).
import { describe, it } from 'vitest'
import type { BattleAlly } from '../rpg/battle/types'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import type { RpgTier1Class } from '../rpg/rules'
import { balanceMember, balanceStage, type BalanceOptions } from './balance-party'
import { play } from './balance-play'
import { damageOf, fightLog, logFight } from './balance-measure'
import { regionChapter, worldContinent } from './world'

const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true }
const PARTY_1: readonly RpgTier1Class[] = ['brawler', 'mage', 'spellblade', 'summoner', 'paladin']
const PARTY_2: readonly RpgTier1Class[] = ['brawler', 'mage', 'tomeblade', 'armsummoner', 'cleric']
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const SEEDS = Number(process.env.SIM_SEEDS ?? 8)
const KINDS = ['fight', 'sub-boss', 'boss'] as const
type Kind = (typeof KINDS)[number]

function stagesAt(level: number, engine: number): Record<Kind, RpgMapNode[]> {
  const out: Record<Kind, RpgMapNode[]> = { fight: [], 'sub-boss': [], boss: [] }
  const regions = worldContinent({ name: 'Sim', order: Math.ceil(level / 10) }).regions.filter((r) => r.level <= level && level <= r.levelTop)
  for (const region of regions) for (const n of regionChapter(region, cast, engine).nodes) if (n.kind !== 'camp' && n.level === level) out[n.kind as Kind].push(n)
  return out
}
interface Row { wins: number; rounds: number; lowest: number; kos: number; dmg: Record<string, number> }
function measure(allies: BattleAlly[], level: number, engine: number): Record<Kind, Row> {
  const stages = stagesAt(level, engine)
  return Object.fromEntries(KINDS.map((kind) => {
    const log = fightLog()
    let lowest = 0, kos = 0, n = 0
    stages[kind].forEach((node, i) => {
      for (let s = 0; s < SEEDS; s++) {
        const { observe, done } = logFight(allies, log)
        const played = play(balanceStage(node, 1000 + i + 100 * s, allies, engine as never), observe)
        done(played)
        lowest += played.lowest; kos += played.kos; n += 1
      }
    })
    const dmg = Object.fromEntries(Object.values(log.umas).map((u) => [u.classId, damageOf(u) / Math.max(1, u.turns)]))
    return [kind, { wins: log.wins / Math.max(1, log.fights), rounds: log.rounds / Math.max(1, log.fights), lowest: lowest / Math.max(1, n), kos: kos / Math.max(1, n), dmg }]
  })) as Record<Kind, Row>
}
const partyOf = (classes: readonly RpgTier1Class[], level: number, engine: number) => classes.map((c, i) => balanceMember(c, i, level, { ...ON_CURVE, engine }))
const pct = (n: number) => `${(n * 100).toFixed(0)}%`

describe('the combat pass on curve (D282)', () => {
  it.runIf(process.env.SIM)('prints v20 against v21', () => {
    for (const [name, classes] of [['Party 1', PARTY_1], ['Party 2', PARTY_2]] as const) {
      for (const level of (process.env.SIM_LEVELS ?? '12,20,30,40,50').split(',').map(Number)) {
        const before = measure(partyOf(classes, level, 20), level, 20)
        const after = measure(partyOf(classes, level, 21), level, 21)
        const lines = KINDS.flatMap((k) => {
          const a = before[k], b = after[k]
          if (!a.rounds || !b.rounds) return []
          const classDmg = classes.map((c) => `${c.slice(0, 7)} ${(a.dmg[c]! > 0 ? b.dmg[c]! / a.dmg[c]! : 0).toFixed(2)}`).join(' ')
          return [`  ${k.padEnd(9)} win ${pct(a.wins)}→${pct(b.wins)} rounds ${a.rounds.toFixed(1)}→${b.rounds.toFixed(1)} lowest ${pct(a.lowest)}→${pct(b.lowest)} KOs ${a.kos.toFixed(2)}→${b.kos.toFixed(2)} | dmg ${classDmg}`]
        })
        console.log(`${name} Lv ${level}\n${lines.join('\n')}`)
      }
    }
  }, 900_000)
})
