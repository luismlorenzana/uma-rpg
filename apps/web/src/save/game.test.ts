import 'fake-indexeddb/auto'
import { armorHalf, gearV1, newOwnedUma, newSave, newTierWorld, SAVE_SCHEMA_VERSION, unlockUma, type Save, type SaveEnvelope } from '@rpg/domain'
import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// An in-memory server with the API's revision rules.
const server: { envelope: SaveEnvelope; puts: number } = { envelope: { revision: 0, save: null }, puts: 0 }

vi.mock('../api/client', async () => {
  const actual = await vi.importActual<typeof import('../api/client')>('../api/client')
  return {
    ...actual,
    saveApi: {
      load: vi.fn(async () => structuredClone(server.envelope)),
      put: vi.fn(async (baseRevision: number, save: Save) => {
        if (baseRevision !== server.envelope.revision) throw new actual.ApiError('/api/save', 409, { current: structuredClone(server.envelope) })
        server.puts++
        server.envelope = { revision: baseRevision + 1, save: structuredClone(save) }
        return structuredClone(server.envelope)
      }),
    },
  }
})

/** Set to make the device refuse a safety copy. */
const device = { refuseCopies: false }
vi.mock('./db', async () => {
  const actual = await vi.importActual<typeof import('./db')>('./db')
  return { ...actual, addSafetyCopy: async (copy: Parameters<typeof actual.addSafetyCopy>[0]) => !device.refuseCopies && actual.addSafetyCopy(copy) }
})

const { boot, buyTicket, createAccount, markTarget, nameParty, pickClass, renameAccount, resetGame, restoreSafetyCopy, setActiveTier, setSlot, syncNow, unlock, useGame, useWorld } = await import('./game')
const { db, safetyCopies } = await import('./db')
const { saveApi, ApiError } = await import('../api/client')

/** An invented outfit whose best running style is `best`. */
const outfit = (outfitId: string, best: 'front' | 'pace' | 'late' | 'end' = 'front') => ({
  outfitId, aptitudes: { strategy: { front: 'G', pace: 'G', late: 'G', end: 'G', [best]: 'A' } as const, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } as const },
})

beforeEach(async () => {
  resetGame()
  server.envelope = { revision: 0, save: null }
  server.puts = 0
  device.refuseCopies = false
  await db.save.clear()
  await db.safety.clear()
})

describe('game store', () => {
  it('reads the latest save after lazy rules load, so concurrent cold actions preserve both changes', async () => {
    await boot('u1')
    await createAccount('Test')
    await unlock(outfit('9000000'))
    const save = useGame.getState().save!
    useGame.setState({ save: { ...save, tierWorlds: { '1': { ...save.tierWorlds['1']!, wallet: { ...save.tierWorlds['1']!.wallet, laurels: 100 } } } } })
    await Promise.all([pickClass('9000000', 'duelist'), buyTicket('time', 1)])
    const world = useGame.getState().save!.tierWorlds['1']!
    expect(world.umas['9000000']!.classId).toBe('duelist')
    expect(world.wallet).toMatchObject({ laurels: 90, timeTickets: 1 })
    resetGame()
    await boot('u1')
    expect(useGame.getState().save!.tierWorlds['1']).toEqual(world)
  })
  it('asks for a trainer name on a fresh device with an empty server, then saves 20 Uma Tickets', async () => {
    await boot('u1')
    expect(useGame.getState().status).toBe('first-launch')
    await createAccount('Luis')
    await syncNow()
    const state = useGame.getState()
    expect(state.save?.tierWorlds['1']?.wallet.unlockTickets).toBe(20)
    expect(state).toMatchObject({ status: 'ready', dirty: false, revision: 1 })
    expect(server.envelope.save?.account.trainerName).toBe('Luis')
  })

  it('adopts the server save on a fresh device', async () => {
    server.envelope = { revision: 4, save: newSave('From cloud', '2026-10-10T12:00:00.000Z') }
    await boot('u1')
    expect(useGame.getState()).toMatchObject({ status: 'ready', revision: 4, dirty: false })
    expect(useGame.getState().save?.account.trainerName).toBe('From cloud')
  })

  it('opens from the device save without waiting, and a rename survives a reboot', async () => {
    await boot('u1')
    await createAccount('Luis')
    await syncNow()
    await renameAccount('Luis 2')
    resetGame()
    await boot('u1')
    expect(useGame.getState().save?.account.trainerName).toBe('Luis 2')
    await syncNow()
    expect(server.envelope.save?.account.trainerName).toBe('Luis 2')
  })

  it('never reads another uid’s device save', async () => {
    await boot('u1')
    await createAccount('Luis')
    resetGame()
    server.envelope = { revision: 0, save: null }
    await boot('someone-else')
    expect(useGame.getState().status).toBe('first-launch')
  })

  it('rejects an invalid trainer name without changing the save', async () => {
    await boot('u1')
    await createAccount('Luis')
    await expect(renameAccount('   ')).rejects.toThrow()
    expect(useGame.getState().save?.account.trainerName).toBe('Luis')
  })

  it('unlocks Umas for tickets and builds parties, and all of it syncs (S2)', async () => {
    await boot('u1')
    await createAccount('Luis')
    await unlock(outfit('100101'))
    await unlock(outfit('100201', 'late'))
    await setSlot(0, 0, '100101')
    await setSlot(0, 1, '100201')
    await setSlot(4, 2, '100101') // moves her from Party 1 to Party 5
    await nameParty(4, 'Front runners')
    await syncNow()
    const world = server.envelope.save?.tierWorlds['1']
    expect(world?.wallet.unlockTickets).toBe(18)
    expect(Object.keys(world?.umas ?? {}).sort()).toEqual(['100101', '100201'])
    expect(world?.parties[0]?.slots).toEqual([null, '100201', null, null, null])
    expect(world?.parties[4]).toEqual({ name: 'Front runners', slots: [null, null, '100101', null, null], lead: null })
    // A late outfit starts as a Healer, on the magical half; a front one as a Warrior, on the physical (her calling's
    // Tier 0, CV19; v28: the half is her class's, every grade G0, H82).
    expect([world!.umas['100201']!.classId, world!.umas['100101']!.classId]).toEqual(['acolyte', 'recruit'])
    expect([world!.umas['100201']!.classId, world!.umas['100101']!.classId].map((c) => armorHalf(c!))).toEqual(['magical', 'physical'])
    expect(world!.umas['100201']!.gear).toEqual({ weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] })
    await expect(unlock(outfit('100101'))).rejects.toThrow(/already/)
  })

  it('migrates a v1 device save when it boots', async () => {
    await db.save.put({
      id: 'main',
      uid: 'u1',
      revision: 1,
      dirty: false,
      save: { schemaVersion: 1, account: { trainerName: 'Old', createdAt: '2026-10-10T12:00:00.000Z', updatedAt: '2026-10-10T12:00:00.000Z' }, tierWorlds: { '1': { createdAt: '2026-10-10T12:00:00.000Z', wallet: { unlockTickets: 20, shards: 0, laurels: 0 } } } } as never,
    })
    server.envelope = { revision: 1, save: null }
    await boot('u1')
    const save = useGame.getState().save
    expect(save?.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    expect(save?.tierWorlds['1']?.parties).toHaveLength(20)
  })
})

// D260: on 2026-10-30 a server copy days behind was stamped newest, and the one device holding those days adopted it whole.
describe('saves can\'t be lost to a sync (D260)', () => {
  const LATER = '2099-01-01T00:00:00.000Z'
  /** A device in step with the server, then with a change of its own the server never got. */
  async function unsynced(): Promise<Save> {
    await boot('u1')
    await createAccount('Mine')
    await syncNow()
    await renameAccount('Days of play')
    return useGame.getState().save!
  }
  /** The server moving on with an older save marked newest, as the hand-edited one was. */
  const staleServerMarkedNewest = (save: Save) => {
    server.envelope = { revision: server.envelope.revision + 1,
      save: { ...save, account: { ...save.account, trainerName: 'Stale', updatedAt: LATER } } }
  }

  it('keeps unsynced changes before a save marked newer replaces them, and says so', async () => {
    const mine = await unsynced()
    vi.mocked(saveApi.put).mockRejectedValueOnce(new ApiError('/api/save', 500, null))
    await syncNow()
    expect(useGame.getState()).toMatchObject({ sync: 'error', dirty: true })
    staleServerMarkedNewest(mine)
    await syncNow()
    const state = useGame.getState()
    expect(state.save!.account.trainerName).toBe('Stale')
    expect(state.replacedAt).not.toBeNull()
    const copies = await safetyCopies('u1')
    expect(copies).toHaveLength(1)
    expect(copies[0]).toMatchObject({ reason: 'replaced', uid: 'u1' })
    expect(copies[0]!.save).toMatchObject({ account: { trainerName: 'Days of play' } })
  })

  it('restores a copy over the server\'s newer save, and keeps what it replaced', async () => {
    staleServerMarkedNewest(await unsynced())
    await syncNow()
    const [copy] = await safetyCopies('u1')
    await expect(restoreSafetyCopy(copy!.id!)).resolves.toBe(true)
    await syncNow()
    expect(useGame.getState()).toMatchObject({ dirty: false, sync: 'synced', replacedAt: null })
    expect(server.envelope.save!.account.trainerName).toBe('Days of play')
    const copies = await safetyCopies('u1')
    expect(copies.map((c) => c.reason)).toEqual(['restore'])
    expect(copies[0]!.save).toMatchObject({ account: { trainerName: 'Stale' } })
  })

  it('replaces nothing unsynced when it can\'t keep a copy', async () => {
    staleServerMarkedNewest(await unsynced())
    device.refuseCopies = true
    await syncNow()
    expect(useGame.getState()).toMatchObject({ sync: 'error', dirty: true, replacedAt: null })
    expect(useGame.getState().save!.account.trainerName).toBe('Days of play')
  })

  it('copies nothing when a clean device adopts: it held nothing the server lacked', async () => {
    await boot('u1')
    await createAccount('Mine')
    await syncNow()
    staleServerMarkedNewest(useGame.getState().save!)
    await syncNow()
    expect(useGame.getState().save!.account.trainerName).toBe('Stale')
    expect(useGame.getState().replacedAt).toBeNull()
    expect(await safetyCopies('u1')).toEqual([])
  })

  it('never calls edits left unsent synced', async () => {
    await unsynced()
    const before = useGame.getState().lastSyncedAt
    const put = vi.mocked(saveApi.put)
    put.mockImplementation(async () => { throw new ApiError('/api/save', 409, { current: structuredClone(server.envelope) }) })
    server.envelope = { ...server.envelope, revision: server.envelope.revision + 1 }
    await syncNow()
    expect(useGame.getState()).toMatchObject({ sync: 'error', dirty: true, lastSyncedAt: before })
    put.mockReset()
  })

  it('remembers across a restart when the server last held everything', async () => {
    await boot('u1')
    await createAccount('Mine')
    await syncNow()
    const { lastSyncedAt } = useGame.getState()
    expect(lastSyncedAt).not.toBeNull()
    expect((await db.save.get('main'))?.lastSyncedAt).toBe(lastSyncedAt)
    resetGame()
    await boot('u1')
    expect(useGame.getState().lastSyncedAt).not.toBeNull()
  })
})

describe('the active tier (H35)', () => {
  const NOW = '2026-10-21T12:00:00.000Z'
  /** Tier 1 with Uma 101, and a synthetic Tier 2 world (no promotion exists yet) with 201 and 202 and 5,000 Laurels. */
  const twoTiers = (): Save => {
    const save = unlockUma(newSave('Luis', NOW), '101', NOW)
    const world = newTierWorld(NOW, 0)
    return { ...save, tierWorlds: { ...save.tierWorlds,
      '2': { ...world, wallet: { ...world.wallet, laurels: 5000 }, umas: { '201': newOwnedUma(NOW), '202': newOwnedUma(NOW) } } } }
  }
  const tier = (key: string) => useGame.getState().save!.tierWorlds[key]!

  beforeEach(() => {
    const rows = new Map<string, string>()
    vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value) })
    server.envelope = { revision: 1, save: twoTiers() }
  })
  afterEach(() => vi.unstubAllGlobals())

  it('opens the highest tier with Umas when nothing is remembered, and an asked tier first, remembering it', async () => {
    await boot('u1')
    expect(useGame.getState().activeTier).toBe(2)
    expect(localStorage.getItem('rpg.tier')).toBe('2')
    resetGame()
    await boot('u1', '1')
    expect(useGame.getState().activeTier).toBe(1)
    expect(localStorage.getItem('rpg.tier')).toBe('1')
    resetGame()
    await boot('u1')
    expect(useGame.getState().activeTier).toBe(1)
  })

  it('switches only to a tier the save has a world for', async () => {
    await boot('u1', '1')
    expect(setActiveTier(7)).toBe(false)
    expect(setActiveTier(1.5)).toBe(false)
    expect(useGame.getState().activeTier).toBe(1)
    expect(setActiveTier(2)).toBe(true)
    expect(localStorage.getItem('rpg.tier')).toBe('2')
  })

  it('reads and writes only the active world', async () => {
    await boot('u1', '1')
    const before = structuredClone(tier('1'))
    expect(renderHook(() => useWorld()).result.current).toBe(tier('1'))
    setActiveTier(2)
    expect(renderHook(() => useWorld()).result.current).toBe(tier('2'))
    await buyTicket('time', 1)
    await pickClass('201', 'mage')
    await markTarget('202', true)
    expect(tier('2').wallet).toMatchObject({ laurels: 4990, timeTickets: 1 })
    expect(tier('2').umas['201']!.classId).toBe('mage')
    expect(tier('2').targets).toEqual(['202'])
    expect(tier('1')).toEqual(before)
  })

  it('writes an action to the tier it was called on, even after a switch before its rules load', async () => {
    await boot('u1', '1')
    const before = structuredClone(tier('2'))
    const pending = pickClass('101', 'duelist')
    expect(setActiveTier(2)).toBe(true)
    await pending
    expect(tier('1').umas['101']!.classId).toBe('duelist')
    expect(tier('2')).toEqual(before)
  })

  it('falls back to the start rule when a sync adopts a save without the active world', async () => {
    await boot('u1')
    expect(useGame.getState().activeTier).toBe(2)
    server.envelope = { revision: 2, save: unlockUma(newSave('Luis', NOW), '101', NOW) }
    await syncNow()
    expect(useGame.getState()).toMatchObject({ revision: 2, activeTier: 1 })
  })
})
