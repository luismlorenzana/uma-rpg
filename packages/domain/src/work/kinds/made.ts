// What the Forge and the Lapidary share (S7, D144): a piece or gem of a grade from its refined materials, two items'
// time each at her Craft Level, paid onto its own shelf (the gear stock or the Star Gems), never the Warehouse.
import { workRefusal, type WorkKindRules, type WorkOutput } from '@luismlorenzana/uma-work'
import { facilitySpec, type JobKind } from '../../economy/jobs'
import { jobExp, makeMinutes } from '../../economy/pacing'
import { gradeUnlockLevel } from '../../items/catalog'
import type { TierWorld } from '../../save/save'
import { craftLevel, many, secondsAt } from './shared'

interface Made { id: string; grade: number; inputs: Readonly<Record<string, number>> }

export function madeKind(kind: Extract<JobKind, 'craft' | 'cut'>, byId: (id: string) => Made | undefined, shelf: 'gear' | 'gems'): WorkKindRules<TierWorld> {
  return {
    plan(world, outfitId, request, _now, { slot, speed, env }) {
      const made = byId(request.item)
      if (request.kind !== kind || facilitySpec(slot.building)?.kind !== kind || !made) return workRefusal('not-here')
      if (!env.exp.gradeOpen(world, outfitId, kind, made.grade)) return workRefusal('grade', { level: gradeUnlockLevel(made.grade) })
      const minutes = makeMinutes(craftLevel(world, outfitId))
      const inputs = Object.entries(made.inputs).map(([item, qty]) => ({ item, qty }))
      return many({ seconds: secondsAt(minutes, speed), inputs, output: { item: made.id }, exp: jobExp(minutes) }, request.count)
    },
    pay<T extends TierWorld>(world: T, _outfitId: string, outputs: readonly WorkOutput[]): { state: T } {
      const into: Record<string, number> = { ...world[shelf] }
      for (const output of outputs) if ('item' in output) into[output.item] = (into[output.item] ?? 0) + 1
      return { state: { ...world, [shelf]: into } }
    },
  }
}
