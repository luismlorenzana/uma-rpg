// The shell's one-time sheets (H80, H132): "The classes are rebuilt" opens once for a world whose save v32 record is
// unseen and whose trades have settled, never over a fight; after "The Wilds are rebuilt" when both are unseen; Later and
// To the Exchange mark it seen, To the Exchange landing on the Manual sheet's picker; `?sheet=classes` reopens it. The
// Account's rows reopen each sheet while its record lasts. The kit's frame and the sheets' bodies are stubbed: their own
// tests draw them (the kit and the tests load react-router as two instances).
import { newSave, unlockUma, type ClassesV3Record, type Save, type TierGrant } from '@rpg/domain'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { OneTimeRows } from '../places/account/AccountPage'
import { resetGame, seeClassesRebuilt, useGame } from '../save/game'
import { dueSheet, shownSheet } from './one-time'
import { Shell } from './Shell'

vi.mock('../save/game', async (importOriginal) => {
  const game = await importOriginal<typeof import('../save/game')>()
  return { ...game, seeClassesRebuilt: vi.fn(game.seeClassesRebuilt), seeGrant: vi.fn(game.seeGrant) }
})
vi.mock('@luismlorenzana/uma-kit/shell', async (importOriginal) => {
  const { useNavigate } = await import('react-router')
  return {
    ...await importOriginal<typeof import('@luismlorenzana/uma-kit/shell')>(),
    AppFrame: ({ overlays, children }: { overlays: ReactNode; children: ReactNode }) => <>{overlays}{children}</>,
    useLeave: () => { const navigate = useNavigate(); return (to: string) => navigate(to, { replace: true }) },
  }
})
vi.mock('./Bars', () => ({ RpgAccountBar: () => null, RpgBottomBar: () => null }))
vi.mock('./MenuSheet', () => ({ MenuSheet: () => null }))
vi.mock('./TierSheet', () => ({ TierSheet: () => null }))
vi.mock('./Featured', async (importOriginal) => ({ ...await importOriginal<typeof import('./Featured')>(), FeaturedSheet: () => null }))
vi.mock('../grant/GrantSheet', () => ({
  default: ({ onLater }: { onLater: () => void }) => <div data-testid="grant"><button type="button" onClick={onLater}>Grant later</button></div>,
}))
vi.mock('../grant/ClassesSheet', () => ({
  default: ({ onLater, onExchange }: { onLater: () => void; onExchange: () => void }) => <div data-testid="classes">
    <button type="button" onClick={onLater}>Later</button><button type="button" onClick={onExchange}>To the Exchange</button>
  </div>,
}))

const NOW = '2026-10-29T12:00:00.000Z'
const record = (over: Partial<ClassesV3Record> = {}): ClassesV3Record =>
  ({ manuals: 78, marks: 78_000, umas: {}, halls: [], traded: true, seen: false, ...over })
const grant = (seen: boolean): TierGrant => ({ tickets: 10, floor: 0, seen, deleted: { gear: 0, gems: 0, upgrades: 0 }, back: { laurels: 0, items: 0, stock: 0 }, umas: {} })
/** Tier 1 with an Uma, its class reset record and grant as given. */
function save(classesV3: ClassesV3Record | undefined, tierGrant: TierGrant | null = null): Save {
  const s = unlockUma(newSave('Luis', NOW), '101', NOW)
  const world = s.tierWorlds['1']!
  return { ...s, tierWorlds: { '1': { ...world, grant: tierGrant, ...(classesV3 ? { classesV3 } : {}) } } }
}
const classesOf = () => useGame.getState().save!.tierWorlds['1']!.classesV3

function Where() {
  const location = useLocation()
  return <p data-testid="where">{`${location.pathname}${location.search} ${JSON.stringify(location.state)}`}</p>
}
function show(at: string) {
  render(<MemoryRouter initialEntries={[at]}><Routes>
    <Route path="/:page/:placeId?/*" element={<><Shell /><Where /></>} />
  </Routes></MemoryRouter>)
}
const where = () => screen.getByTestId('where').textContent

beforeEach(() => {
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.mocked(seeClassesRebuilt).mockClear()
})
afterEach(() => {
  cleanup()
  resetGame()
  vi.unstubAllGlobals()
})

describe('which one-time sheet is due (H132)', () => {
  it('owes the class reset only once its trades have settled and until it is seen; the grant first', () => {
    expect(dueSheet(undefined)).toBeNull()
    expect(dueSheet({ grant: null })).toBeNull()
    expect(dueSheet({ grant: null, classesV3: record() })).toBe('classes')
    expect(dueSheet({ grant: null, classesV3: record({ traded: false }) })).toBeNull()
    expect(dueSheet({ grant: null, classesV3: record({ seen: true }) })).toBeNull()
    expect(dueSheet({ grant: grant(false), classesV3: record() })).toBe('grant')
    expect(dueSheet({ grant: grant(true), classesV3: record() })).toBe('classes')
  })

  it('shows the one asked for, else the one due, never over a fight', () => {
    expect(shownSheet('classes', null, true)).toBe('classes')
    expect(shownSheet('grant', 'classes', false)).toBe('grant')
    expect(shownSheet(null, 'classes', false)).toBe('classes')
    expect(shownSheet('menu', 'classes', false)).toBe('classes')
    expect(shownSheet(null, 'classes', true)).toBeNull()
  })
})

describe('the shell opens "The classes are rebuilt" (H132)', () => {
  it('once for an unseen record whose trades have settled; Later marks it seen and it stays shut', async () => {
    useGame.setState({ uid: 'u1', status: 'ready', save: save(record()), activeTier: 1 })
    show('/town')
    await screen.findByTestId('classes')
    fireEvent.click(screen.getByRole('button', { name: 'Later' }))
    expect(seeClassesRebuilt).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByTestId('classes')).toBeNull())
    expect(classesOf()!.seen).toBe(true)
  })

  it('not while its trades wait, nor over a fight, nor once seen, nor without a record', async () => {
    for (const [s, at] of [[save(record({ traded: false })), '/town'], [save(record()), '/battle/scenario-gate/fight'],
      [save(record({ seen: true })), '/town'], [save(undefined), '/town']] as const) {
      useGame.setState({ uid: 'u1', status: 'ready', save: s, activeTier: 1 })
      show(at)
      await act(async () => {})
      expect(screen.queryByTestId('classes')).toBeNull()
      cleanup()
    }
  })

  it('after "The Wilds are rebuilt" when both are unseen', async () => {
    useGame.setState({ uid: 'u1', status: 'ready', save: save(record(), grant(false)), activeTier: 1 })
    show('/town')
    await screen.findByTestId('grant')
    expect(screen.queryByTestId('classes')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Grant later' }))
    await screen.findByTestId('classes')
    expect(screen.queryByTestId('grant')).toBeNull()
  })

  it('To the Exchange marks it seen and lands on the Manual sheet\'s picker, pushed with Back', async () => {
    useGame.setState({ uid: 'u1', status: 'ready', save: save(record()), activeTier: 1 })
    show('/town')
    fireEvent.click(await screen.findByRole('button', { name: 'To the Exchange' }))
    expect(seeClassesRebuilt).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(where()).toBe('/town/exchange/manual {"back":true}'))
    expect(classesOf()!.seen).toBe(true)
    expect(screen.queryByTestId('classes')).toBeNull()
  })

  it('reopens on ?sheet=classes once seen, and Later closes it', async () => {
    useGame.setState({ uid: 'u1', status: 'ready', save: save(record({ seen: true })), activeTier: 1 })
    show('/town/account?sheet=classes')
    fireEvent.click(await screen.findByRole('button', { name: 'Later' }))
    await waitFor(() => expect(where()).toBe('/town/account null'))
    expect(screen.queryByTestId('classes')).toBeNull()
  })
})

describe('the Account\'s rows (H80, H132)', () => {
  function rows(world: Parameters<typeof OneTimeRows>[0]['world']) {
    render(<MemoryRouter initialEntries={['/town/account']}><Routes>
      <Route path="*" element={<><OneTimeRows world={world} /><Where /></>} />
    </Routes></MemoryRouter>)
  }

  it('shows "The classes are rebuilt · 78 Class Manuals", which opens ?sheet=classes', async () => {
    rows({ grant: null, classesV3: record({ seen: true }) })
    const row = screen.getByRole('button', { name: /The classes are rebuilt/ })
    expect(row.textContent).toBe('The classes are rebuilt78 Class Manuals ›')
    fireEvent.click(row)
    await waitFor(() => expect(where()).toBe('/town/account?sheet=classes null'))
  })

  it('has no row without a record, and keeps the grant\'s first', () => {
    rows({ grant: null })
    expect(screen.queryByRole('button')).toBeNull()
    cleanup()
    rows({ grant: grant(true), classesV3: record() })
    expect(screen.getAllByRole('button').map((b) => b.getAttribute('data-sheet-row'))).toEqual(['grant', 'classes'])
  })
})
