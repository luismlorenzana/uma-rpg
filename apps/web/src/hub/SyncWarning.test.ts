import { describe, expect, it } from 'vitest'
import { dateWords } from '../places/account/safety-view'
import { SYNC_WARNING_AFTER_MS, syncWarning } from './SyncWarning'

const NOW = '2026-10-30T12:00:00.000Z'
const ago = (ms: number) => new Date(Date.parse(NOW) - ms).toISOString()
const state = (over: Partial<Parameters<typeof syncWarning>[0]>) => ({ sync: 'error' as const, dirty: true, lastSyncedAt: null, replacedAt: null, ...over })

describe('the sync warning (D260)', () => {
  it('says how long this device has gone unbacked up, in words', () => {
    const last = ago(SYNC_WARNING_AFTER_MS + 1)
    expect(syncWarning(state({ lastSyncedAt: last }), NOW)).toBe(`Not backed up since ${dateWords(last)}. Your progress is only on this device.`)
    expect(syncWarning(state({}), NOW)).toBe('Not backed up. Your progress is only on this device.')
  })

  it('stays quiet for a moment\'s error, nothing to send, offline and a good sync', () => {
    expect(syncWarning(state({ lastSyncedAt: ago(SYNC_WARNING_AFTER_MS - 1) }), NOW)).toBeNull()
    expect(syncWarning(state({ dirty: false }), NOW)).toBeNull()
    expect(syncWarning(state({ sync: 'offline' }), NOW)).toBeNull()
    expect(syncWarning(state({ sync: 'synced' }), NOW)).toBeNull()
  })

  it('says a newer save replaced changes here, whatever the sync is doing', () => {
    expect(syncWarning(state({ sync: 'synced', dirty: false, replacedAt: NOW }), NOW)).toBe('A newer save replaced this device’s changes. They’re kept in Account.')
  })
})
