// What the four kinds share: her Craft Level, an item's whole seconds at a building's speed, and one planned item
// repeated for a request's count.
import type { PlannedItem } from '@luismlorenzana/uma-work'
import { MINUTE } from '../../economy/pacing'
import type { TierWorld } from '../../save/save'

/** Her Craft Level: it sets every job's minutes (D139). */
export const craftLevel = (world: TierWorld, outfitId: string): number => world.umas[outfitId]?.craft.level ?? 1

/** An item's real seconds: its minutes at her level, sped up by the building's level, whole and at least one. */
export const secondsAt = (minutes: number, speed: number): number => Math.max(1, Math.round((minutes * MINUTE) / 1000 / speed))

/** One planned item, `count` times: every item of a request takes the same time and pays the same. */
export const many = (item: PlannedItem, count: number): PlannedItem[] => Array.from({ length: count }, () => item)
