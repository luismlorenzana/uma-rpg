import 'fake-indexeddb/auto'
import { newSave, SAVE_SCHEMA_VERSION, type Save, type SaveEnvelope } from '@rpg/domain'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

const { boot, buyTicket, createAccount, nameParty, pickClass, renameAccount, resetGame, setSlot, syncNow, unlock, useGame } = await import('./game')
const { db } = await import('./db')

/** An invented outfit whose best running style is `best`. */
const outfit = (outfitId: string, best: 'front' | 'pace' | 'late' | 'end' = 'front') => ({
  outfitId, aptitudes: { strategy: { front: 'G', pace: 'G', late: 'G', end: 'G', [best]: 'A' } as const },
})

beforeEach(async () => {
  resetGame()
  server.envelope = { revision: 0, save: null }
  server.puts = 0
  await db.save.clear()
})

describe('game store', () => {
  it('reads the latest save after lazy rules load, so concurrent cold actions preserve both changes', async () => {
    await boot('u1')
    await createAccount('Test')
    await unlock(outfit('9000000'))
    const save = useGame.getState().save!
    useGame.setState({ save: { ...save, tierWorlds: { '1': { ...save.tierWorlds['1']!, wallet: { ...save.tierWorlds['1']!.wallet, laurels: 100 } } } } })
    await Promise.all([pickClass('9000000', 'mage'), buyTicket('time', 1)])
    const world = useGame.getState().save!.tierWorlds['1']!
    expect(world.umas['9000000']!.classId).toBe('mage')
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
    await unlock(outfit('100201', 'pace'))
    await setSlot(0, 0, '100101')
    await setSlot(0, 1, '100201')
    await setSlot(4, 2, '100101') // moves her from Party 1 to Party 5
    await nameParty(4, 'Front runners')
    await syncNow()
    const world = server.envelope.save?.tierWorlds['1']
    expect(world?.wallet.unlockTickets).toBe(18)
    expect(Object.keys(world?.umas ?? {}).sort()).toEqual(['100101', '100201'])
    expect(world?.parties[0]?.slots).toEqual([null, '100201', null, null, null])
    expect(world?.parties[4]).toEqual({ name: 'Front runners', slots: [null, null, '100101', null, null] })
    // A pace outfit starts as a Mage, in five magical kinds; a front one in physical (D160 §7).
    expect(world?.umas['100201']?.gear.kinds).toEqual({ head: 'circlet', body: 'robe', legs: 'leggings', arms: 'bracers', feet: 'slippers' })
    expect(world?.umas['100101']?.gear.kinds).toEqual({})
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
