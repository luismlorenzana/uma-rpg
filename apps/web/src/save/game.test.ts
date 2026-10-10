import 'fake-indexeddb/auto'
import { newSave, type Save, type SaveEnvelope } from '@rpg/domain'
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

const { boot, createAccount, renameAccount, resetGame, syncNow, useGame } = await import('./game')
const { db } = await import('./db')

beforeEach(async () => {
  resetGame()
  server.envelope = { revision: 0, save: null }
  server.puts = 0
  await db.save.clear()
})

describe('game store', () => {
  it('asks for a trainer name on a fresh device with an empty server, then saves 20 Unlock Tickets', async () => {
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
})
