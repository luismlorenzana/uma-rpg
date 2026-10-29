// The shell's one-time sheets (H80, H132): "The Wilds are rebuilt" for a world's unseen Tier rework grant (save v28) and
// "The classes are rebuilt" for its unseen class reset (save v32), one at a time, the grant first. A few bytes in the main
// bundle; the sheets themselves are lazy.
import type { TierWorld } from '@rpg/domain'

export type OneTimeSheet = 'grant' | 'classes'

/** The one-time sheet a world still owes, or null: the grant first (a save that crosses v28 and v32 in one load has both),
 * then the class reset once its trades have settled (`traded`, so its trade lines are complete). */
export function dueSheet(world: Pick<TierWorld, 'grant' | 'classesV3'> | undefined): OneTimeSheet | null {
  if (world?.grant && !world.grant.seen) return 'grant'
  const record = world?.classesV3
  return record && record.traded && !record.seen ? 'classes' : null
}

/** The one the shell shows: the one `?sheet=` asks for (the Account's rows), else the one due, never over a fight. */
export function shownSheet(asked: string | null, due: OneTimeSheet | null, fullScreen: boolean): OneTimeSheet | null {
  if (asked === 'grant' || asked === 'classes') return asked
  return fullScreen ? null : due
}
