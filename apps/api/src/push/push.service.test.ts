import { newOwnedUma, newSave, newTierWorld, startJob, unlockUma, type Save } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import type { SaveRepository } from '../save/save.repository'
import { MemoryPushRepository, type Subscription } from './push.repository'
import type { PushSender, SendResult } from './push.sender'
import { PushService } from './push.service'

const T0 = Date.parse('2026-10-10T12:00:00.000Z')
const MINUTE = 60_000
const at = (ms: number) => new Date(T0 + ms).toISOString()
const sub = (endpoint: string): Subscription => ({ endpoint, keys: { p256dh: 'p', auth: 'a' } })

describe('push tick (D63)', () => {
  it('announces each finish once, to every live device, and forgets devices that are gone', async () => {
    // An invented outfit at Craft Lv1: 2 ores take 108 minutes (D139).
    const save: Save = startJob(unlockUma(newSave('Luis', at(0)), '101', at(0)), 'mine', 0,
      { outfitId: '101' }, 'copper-ore', 2, at(0))
    const saves = { load: async () => ({ revision: 1, save }), put: async () => { throw new Error('read only') } } as unknown as SaveRepository
    const sent: { endpoint: string; payload: object }[] = []
    const sender = { enabled: true, send: async (s: Subscription, payload: object): Promise<SendResult> => {
      sent.push({ endpoint: s.endpoint, payload })
      return s.endpoint.endsWith('/gone') ? 'gone' : 'sent'
    } } as unknown as PushSender
    const records = new MemoryPushRepository()
    const push = new PushService(records, saves, sender)
    await push.subscribe('u', sub('https://push.example/phone'), T0)
    await push.subscribe('u', sub('https://push.example/gone'), T0)

    expect(await push.tick(T0 + 100 * MINUTE)).toEqual({ accounts: 1, sent: 0 })
    expect(await push.tick(T0 + 110 * MINUTE)).toEqual({ accounts: 1, sent: 1 })
    expect(sent.map((s) => s.endpoint)).toEqual(['https://push.example/phone', 'https://push.example/gone'])
    expect(sent[0]!.payload).toMatchObject({ title: 'Work done', body: 'Mine: Copper Ore ×2', url: '/wilds/mine?tier=1', badge: 1 })
    expect((await records.get('u'))!.subscriptions.map((s) => s.endpoint)).toEqual(['https://push.example/phone'])
    expect(await push.tick(T0 + 115 * MINUTE)).toEqual({ accounts: 1, sent: 0 })
  })

  it('sends one notification per tier world with news, each linking its tier, with the badge of both (H35)', async () => {
    // A synthetic Tier 2 world: no promotion exists yet. Each world's Mine finishes 2 ores at 108 minutes.
    let save: Save = unlockUma(newSave('Luis', at(0)), '101', at(0))
    save = { ...save, tierWorlds: { ...save.tierWorlds, '2': { ...newTierWorld(at(0), 0), umas: { '201': newOwnedUma(at(0)) } } } }
    save = startJob(save, 'mine', 0, { outfitId: '101' }, 'copper-ore', 2, at(0))
    save = startJob(save, 'mine', 0, { outfitId: '201' }, 'copper-ore', 2, at(0), '2')
    const saves = { load: async () => ({ revision: 1, save }), put: async () => { throw new Error('read only') } } as unknown as SaveRepository
    const sent: object[] = []
    const sender = { enabled: true, send: async (_: Subscription, payload: object): Promise<SendResult> => { sent.push(payload); return 'sent' } } as unknown as PushSender
    const push = new PushService(new MemoryPushRepository(), saves, sender)
    await push.subscribe('u', sub('https://push.example/phone'), T0)

    expect(await push.tick(T0 + 110 * MINUTE)).toEqual({ accounts: 1, sent: 2 })
    expect(sent).toMatchObject([
      { title: 'Tier 1 · Work done', url: '/wilds/mine?tier=1', tag: 'slot-mine-0', badge: 2 },
      { title: 'Tier 2 · Work done', url: '/wilds/mine?tier=2', tag: 't2-slot-mine-0', badge: 2 },
    ])
  })
})
