// The Rift page's reads (H50): the active tier's world, its current run, and the generator's context for the run's
// fights, so its chains show the faces the fights will have.
import { openRiftRun, tierKey, type RiftRun, type Save, type TierWorld } from '@rpg/domain'
import { riftContextFor, type RiftContext } from '@rpg/domain/rift'
import { useMemo } from 'react'
import type { Campaign } from '../../battle/campaign'
import { useActiveTier, useGame } from '../../save/game'

export interface RiftView {
  save: Save | null
  tier: number
  /** The tier's world key, for the rules. */
  key: string
  world: TierWorld | null
  /** The current run, until it ascends. */
  run: RiftRun | null
}

export function useRift(): RiftView {
  const save = useGame((s) => s.save)
  const tier = useActiveTier()
  const key = tierKey(tier)
  const world = save?.tierWorlds[key] ?? null
  return { save, tier, key, world, run: world ? openRiftRun(world.rift) : null }
}

/** The generator's context for the run's front and Convergence fights (null without a run), memoized per run: the faces
 * it prefers were fixed when the run started. */
export function useRunContext(campaign: Campaign, view: RiftView): RiftContext | null {
  const { save, run, key } = view
  return useMemo(() => (save && run ? riftContextFor(save, { kind: 'front', front: 'iron', stage: 1 }, campaign.cast.members, key) : null),
    // One context a run: later saves only add faces defeated after it started.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [run?.id, run?.startedAt, key, campaign.cast.members, !!save])
}
