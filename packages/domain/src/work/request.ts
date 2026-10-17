// What an Uma is asked to make (SC3): one of uma-rpg's four kinds of work, an item, gear piece or Star Gem, and how many.
// The shared engine (`@luismlorenzana/uma-work`) stores requests as given; the kinds in `kinds/` plan them.
import type { ItemRequest } from '@luismlorenzana/uma-work'
import type { JobKind } from '../economy/jobs'

/** Gather at a Wilds site, refine at the Workbench, craft at the Forge, cut at the Lapidary. */
export type RpgWorkRequest = ItemRequest<JobKind>
