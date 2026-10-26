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

const { boot, buyTicket, createAccount, markTarget, nameParty, pickClass, renameAccount, repairCallingRule, resetGame, setActiveTier, setSlot, syncNow, unlock, useGame, useWorld } = await import('./game')
const { db } = await import('./db')

/** An invented outfit whose best running style is `best`. */
const outfit = (outfitId: string, best: 'front' | 'pace' | 'late' | 'end' = 'front') => ({
  outfitId, aptitudes: { strategy: { front: 'G', pace: 'G', late: 'G', end: 'G', [best]: 'A' } as const, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } as const },
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
    expect(world?.parties[4]).toEqual({ name: 'Front runners', slots: [null, null, '100101', null, null], lead: null })
    // A pace outfit starts as a Mage, on the magical half; a front one as a Brawler, on the physical (D160 §7; v28: the half
    // is her class's, every grade G0, H82).
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

  it('persists the master-data-aware calling repair without moving her active class', async () => {
    const paceLate = {
      outfitId: '100201', baseStats: { power: 90, wit: 100 },
      aptitudes: {
        strategy: { front: 'G', pace: 'A', late: 'A', end: 'G' } as const,
        distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } as const,
      },
    }
    await boot('u1')
    await createAccount('Luis')
    await unlock(paceLate)
    const save = structuredClone(useGame.getState().save!)
    save.tierWorlds['1']!.umas['100201']!.classId = 'summoner'
    save.tierWorlds['1']!.umas['100201']!.calling = { pick: null, confirmed: true }
    useGame.setState({ save, dirty: false })
    await repairCallingRule([paceLate])
    expect(useGame.getState()).toMatchObject({ dirty: true, save: { tierWorlds: { '1': { umas: {
      '100201': { classId: 'summoner', calling: { pick: 'mage', confirmed: false } },
    } } } } })
    resetGame()
    await boot('u1')
    expect(useGame.getState().save!.tierWorlds['1']!.umas['100201']).toMatchObject({ classId: 'summoner', calling: { pick: 'mage', confirmed: false } })
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
    const pending = pickClass('101', 'mage')
    expect(setActiveTier(2)).toBe(true)
    await pending
    expect(tier('1').umas['101']!.classId).toBe('mage')
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
