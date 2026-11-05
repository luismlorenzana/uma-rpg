// Capital runs' compact words and selection state (D293, H161). The saved five, not today's Party Hall row, fight.
import { capitalRunNodeOf, capitalRunOf, healerBlock, type BattleOutfit, type CapitalRun, type FightResult, type TierWorld } from '@rpg/domain'

export const runName = (id: string): string => `Run ${capitalRunOf(id)?.n ?? '?'}`
export const runPath = (continent: string, id: string): string => `capital/${continent}/run/${id}`
export const runGenerals = (run: CapitalRun): number => run.lanes.reduce((n, l) => n + l.generals, 0)
export const runFinals = (run: CapitalRun): number => run.lanes.filter((l) => l.finalAt !== null).length
export const runCount = (run: CapitalRun): string => `${runGenerals(run) + runFinals(run)}/16`
export const runParties = (run: CapitalRun): string => `Parties ${run.lanes.map((l) => l.party + 1).join(', ')}`
export const capitalLine = (world: TierWorld, continent: string): string => world.capitalRuns?.some((r) => r.continent === continent)
  ? 'Capital · open run' : `Capital · ${world.capitals?.[continent]?.won ?? 0} runs won`
export const generalLine = (generals: number): string => generals >= 3 ? 'Through ✓' : `General ${generals + 1} of 3`
export const finalLock = (generals: number): string => `Beat every lane’s generals · ${generals} of 12`
export const startLabel = (count: number): string => count === 4 ? 'Start run' : `Start run · ${count} of 4 parties`
export const CAPITAL_WORDS = { newRun: 'New run', abandon: 'Abandon run', lost: 'Progress is lost', full: 'Four full parties',
  generals: 'Three generals each', finals: 'Then four finals', noRun: 'Run not found', pick: 'Pick a party' } as const

/** Why a Party Hall row can't join a lane, including another lane in this sheet. No level gate. */
export function partyBlock(world: TierWorld, index: number, selected: readonly (number | null)[], lane: number,
  outfits: ReadonlyMap<string, BattleOutfit>, tier: number): string | null {
  const party = world.parties[index]
  if (!party || party.slots.some((id) => id === null) || party.slots.length !== 5) return 'Not full'
  const ids = party.slots as string[]
  if (ids.some((id) => !world.umas[id])) return 'Not owned'
  const open = world.capitalRuns?.find((r) => r.lanes.some((l) => l.umas.some((id) => ids.includes(id))))
  if (open) return `In ${runName(open.id)}`
  if (selected.some((p, i) => i !== lane && p !== null && world.parties[p]?.slots.some((id) => id !== null && ids.includes(id)))) return 'Picked for another lane'
  if (healerBlock(world, ids, outfits, undefined, tier)) return 'Two healers'
  return null
}

/** A result's extra line; the World numeral is local to its tier, as on the Window board. */
export function capitalResultLine(result: FightResult): string | null {
  const capital = result.capital
  if (!capital) return null
  if (capital.won) {
    const continent = capitalRunOf(capital.runId)?.continentId ?? 'w1'
    return `Capital won · World ${['I', 'II', 'III', 'IV', 'V'][(Number(continent.slice(1)) - 1) % 5]} for 20`
  }
  return capital.general ? `General ${capital.general} of 3` : `Final ${capital.final ?? 0} of 4`
}

/** A win advances only to the next general; losses retry the same fight, finals return to the run. */
export function capitalAgain(result: FightResult): { lane: number; kind: 'general' | 'final'; label: string } | null {
  const capital = result.capital
  if (!capital || capital.won) return null
  if (result.outcome !== 'victory') return { lane: capital.lane, kind: capital.general ? 'general' : 'final', label: 'Retry' }
  return capital.general && capital.general < 3 ? { lane: capital.lane, kind: 'general', label: 'Next general' } : null
}

/** The run page survives a reload or the settling of its final fight. */
export function capitalReturn(nodeId: string, won = false): string | null {
  const ref = capitalRunNodeOf(nodeId)
  return ref ? won ? `capital/${ref.continentId}` : runPath(ref.continentId, ref.runId) : null
}
