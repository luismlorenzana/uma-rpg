import { newSave, renameTrainer } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { reconcile } from './reconcile'

const T0 = '2026-10-10T12:00:00.000Z'
const T1 = '2026-10-10T13:00:00.000Z'
const T2 = '2026-10-10T14:00:00.000Z'
const base = newSave('Luis', T0)

describe('sync reconcile', () => {
  it('pushes a first local save to an empty server', () => {
    expect(reconcile({ revision: 0, save: base, dirty: true }, { revision: 0, save: null })).toEqual({ kind: 'push', baseRevision: 0, save: base })
  })

  it('adopts the server save on a fresh device', () => {
    expect(reconcile({ revision: 0, save: null, dirty: false }, { revision: 3, save: base }).kind).toBe('adopt')
  })

  it('adopts newer server revisions when clean, and does nothing when up to date', () => {
    expect(reconcile({ revision: 2, save: base, dirty: false }, { revision: 3, save: base }).kind).toBe('adopt')
    expect(reconcile({ revision: 3, save: base, dirty: false }, { revision: 3, save: base }).kind).toBe('none')
  })

  it('pushes local edits on top of the revision they were based on', () => {
    const edited = renameTrainer(base, 'Luis 2', T1)
    expect(reconcile({ revision: 3, save: edited, dirty: true }, { revision: 3, save: base })).toEqual({ kind: 'push', baseRevision: 3, save: edited })
  })

  it('keeps the more recently changed save when both sides moved', () => {
    const mine = renameTrainer(base, 'Mine', T2)
    const theirs = renameTrainer(base, 'Theirs', T1)
    expect(reconcile({ revision: 3, save: mine, dirty: true }, { revision: 4, save: theirs })).toEqual({ kind: 'push', baseRevision: 4, save: mine })
    const older = renameTrainer(base, 'Older', T1)
    const newer = renameTrainer(base, 'Newer', T2)
    expect(reconcile({ revision: 3, save: older, dirty: true }, { revision: 4, save: newer }).kind).toBe('adopt')
  })

  it('flags only the adopt that replaces unsynced changes (D260)', () => {
    const older = renameTrainer(base, 'Older', T1)
    const newer = renameTrainer(base, 'Newer', T2)
    expect(reconcile({ revision: 3, save: older, dirty: true }, { revision: 4, save: newer })).toMatchObject({ kind: 'adopt', replacesUnsynced: true })
    expect(reconcile({ revision: 3, save: older, dirty: false }, { revision: 4, save: newer })).toMatchObject({ kind: 'adopt', replacesUnsynced: false })
    expect(reconcile({ revision: 0, save: null, dirty: false }, { revision: 4, save: newer })).toMatchObject({ kind: 'adopt', replacesUnsynced: false })
  })
})
