// Test-only (excluded from the build): a full-shaped v30 save for save v31's migration (H114, FL31). Its work rows are
// literals because the live env no longer knows v30's ten place ids: a process at the old Forge, a make at the old
// Workbench, and a queued process. Stock and every other field already have v30's farm-by-line shape.
import type { Entry, WorkRow } from '@luismlorenzana/uma-work'
import type { RpgWorkRequest } from '../work/request'
import { toV30 } from './migrations'
import type { Save, TierWorld } from './save'
import { V29_T0, v29Save } from './v29.fixture'

const T0 = Date.parse(V29_T0)
type Raw = Record<string, unknown>

function entry(request: RpgWorkRequest, exp: number, collected: number, inputs: readonly { item: string; qty: number }[]): Entry<RpgWorkRequest> {
  const n = request.count
  return {
    request, seconds: Array(n).fill(1728), inputs: Array(n).fill(inputs), outputs: Array(n).fill({ item: request.item }), exp: Array(n).fill(exp),
    startedAt: T0, acceleratedMs: 0, collected, speed: 1.25, fromQueue: false,
  }
}

function row(outfitId: string, building: string, running: Entry<RpgWorkRequest>, queue: readonly RpgWorkRequest[] = []): WorkRow<RpgWorkRequest> {
  return { outfitId, slot: { building, slot: 0 }, entries: [running], queue, last: null, dropped: null }
}

export function v30World(): TierWorld {
  const old = v29Save().tierWorlds['1']!
  const world = toV30(JSON.parse(JSON.stringify(old)) as Raw) as unknown as TierWorld
  return {
    ...world,
    work: {
      '201': row('201', 'forge', entry({ kind: 'refine', item: 'copper-ingot', count: 2 }, 72, 1, [{ item: 'copper-ore', qty: 1 }]),
        [{ kind: 'refine', item: 'iron-ingot', count: 4 }]),
      '202': row('202', 'workbench', entry({ kind: 'craft', item: 'tome-ink-g1', count: 1 }, 504, 0, [{ item: 'chopped-carrot', qty: 7 }])),
    },
  }
}

export function v30Save(): Save {
  const old = v29Save()
  return {
    ...old,
    schemaVersion: 30 as Save['schemaVersion'],
    tierWorlds: {
      '1': v30World(),
      '2': toV30(JSON.parse(JSON.stringify(old.tierWorlds['2'])) as Raw) as unknown as TierWorld,
      '3': toV30(JSON.parse(JSON.stringify(old.tierWorlds['3'])) as Raw) as unknown as TierWorld,
    },
  }
}
