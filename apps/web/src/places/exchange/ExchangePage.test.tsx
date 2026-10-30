// The Exchange's Class Manual route (H132, shared with H120's door): `/town/exchange/manual` opens the sheet on the
// picker, `/town/exchange/manual/:outfitId` on her bars; a tap selects a bar and a count, the footer reads them and the
// sheet stays open; closing it replaces the URL with `/town/exchange`, keeping the navigation state. The live engine (v19
// since H134): Aster, a Brawler R34 in Tier 1's world, has the five Tier 0 bars and her Brawler's.
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot } from '@luismlorenzana/uma-kit/ui'
import { placeById } from '@rpg/domain'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { domAnimation } from 'motion/react'
import { MemoryRouter, Route, Routes, useLocation, useParams } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { albumFixture } from '../../album/testing'
import ExchangePage, { manualRoute } from './ExchangePage'

let fixture: Awaited<ReturnType<typeof albumFixture>>
const calls = vi.hoisted(() => ({ read: vi.fn(async () => {}) }))
vi.mock('../../save/game', async (importOriginal) => ({ ...await importOriginal<typeof import('../../save/game')>(),
  useWorld: () => fixture.world, readManual: calls.read,
}))
vi.mock('../../master/master', async (importOriginal) => ({ ...await importOriginal<typeof import('../../master/master')>(),
  useMaster: () => ({ status: 'ready', view: fixture.view }),
}))

function ExchangeAt() {
  return <ExchangePage place={placeById('exchange')!} rest={useParams()['*'] ?? ''} />
}
function Where() {
  const location = useLocation()
  return <p data-testid="where">{`${location.pathname} ${JSON.stringify(location.state)}`}</p>
}
function show(at: string, state: unknown = { back: true }) {
  render(
    <MemoryRouter initialEntries={[{ pathname: at, state }]}>
      <MotionRoot features={domAnimation}>
        <AlbumArtProvider art={{ useUrl: () => 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E' }}>
          <Routes><Route path="/town/exchange/*" element={<><ExchangeAt /><Where /></>} /></Routes>
        </AlbumArtProvider>
      </MotionRoot>
    </MemoryRouter>,
  )
}
const where = () => screen.getByTestId('where').textContent
const dialog = () => screen.getByRole('dialog')

beforeEach(async () => {
  fixture = await albumFixture()
  fixture.world.wallet.classMarks = 12_000
  fixture.world.umas['81001'] = { ...fixture.world.umas['81001']!, classId: 'brawler', ranks: { classes: { brawler: { rank: 34, exp: 0 } } } }
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  configureKit({ storagePrefix: 'rpg.' })
  vi.clearAllMocks()
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('the Manual sheet\'s route (H132, H120)', () => {
  it('reads its sub-route: manual, manual/:outfitId, anything else closed', () => {
    expect(manualRoute('manual')).toEqual({ open: true, outfitId: null })
    expect(manualRoute('manual/81001')).toEqual({ open: true, outfitId: '81001' })
    expect(manualRoute('manual/81001/')).toEqual({ open: true, outfitId: '81001' })
    expect(manualRoute('')).toEqual({ open: false, outfitId: null })
    expect(manualRoute('other')).toEqual({ open: false, outfitId: null })
  })

  it('/town/exchange/manual opens on the picker; a pick moves to her bars in place, state kept', async () => {
    show('/town/exchange/manual')
    expect(within(dialog()).getByRole('button', { name: 'Aster' })).toBeDefined()
    fireEvent.click(within(dialog()).getByRole('button', { name: 'Aster' }))
    await waitFor(() => expect(where()).toBe('/town/exchange/manual/81001 {"back":true}'))
    // The five Tier 0s and the Brawler she holds.
    await waitFor(() => expect(document.querySelectorAll('[data-manual-bar]')).toHaveLength(6))
  })

  it('/town/exchange/manual/81001 opens on her bars: her Brawler selected, 1 counted, Read in the footer', async () => {
    show('/town/exchange/manual/81001')
    await screen.findByRole('dialog', { name: 'Read a Class Manual' })
    expect(document.querySelector('[data-manual-head]')!.textContent).toBe('Aster · Class Marks 12,000')
    expect(document.querySelector('[data-manual-bar="brawler"]')!.getAttribute('aria-pressed')).toBe('true')
    expect([...document.querySelectorAll('[data-manual-count]')].map((b) => b.textContent)).toEqual(['1', '5', '10', 'Max · 12'])
    expect(document.querySelector('[data-manual-step]')!.getAttribute('data-manual-step')).toBe('Brawler R34 → R35')
    fireEvent.click(document.querySelector('[data-manual-count="5"]')!)
    // 664 + 680 + … + 760 = 4,984 of 5,000.
    expect(document.querySelector('[data-manual-step]')!.getAttribute('data-manual-step')).toBe('Brawler R34 → R41')
    const button = document.querySelector<HTMLButtonElement>('[data-manual-read]')!
    expect(button.textContent).toBe('Read 5 · 5,000 Class Marks')
    fireEvent.click(button)
    await waitFor(() => expect(calls.read).toHaveBeenCalledWith('81001', { kind: 'class', id: 'brawler' }, 5))
    expect(screen.getByRole('dialog', { name: 'Read a Class Manual' })).toBeDefined()
  })

  it('selects another bar with a tap and disables a count the Marks can\'t buy', async () => {
    fixture.world.wallet.classMarks = 7_000
    show('/town/exchange/manual/81001')
    await screen.findByRole('dialog', { name: 'Read a Class Manual' })
    fireEvent.click(document.querySelector('[data-manual-bar="duelist"]')!)
    expect(document.querySelector('[data-manual-bar="duelist"]')!.getAttribute('aria-pressed')).toBe('true')
    expect(document.querySelector<HTMLButtonElement>('[data-manual-count="10"]')!.disabled).toBe(true)
    // A Tier 0's own curve: 272 + 304 + 336 = 912 of 1,000.
    expect(document.querySelector('[data-manual-step]')!.getAttribute('data-manual-step')).toBe('Spellblade R1 → R4')
  })

  it('closing it lands on /town/exchange with the navigation state kept; Choose another Uma goes back to the picker', async () => {
    show('/town/exchange/manual/81001')
    await screen.findByRole('dialog', { name: 'Read a Class Manual' })
    fireEvent.click(screen.getByRole('button', { name: 'Choose another Uma' }))
    await waitFor(() => expect(where()).toBe('/town/exchange/manual {"back":true}'))
    fireEvent.click(within(dialog()).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(where()).toBe('/town/exchange {"back":true}'))
  })

  it('opens the sheet from the page\'s row in place', async () => {
    show('/town/exchange', null)
    fireEvent.click(screen.getByRole('button', { name: /Read a Class Manual/ }))
    await waitFor(() => expect(where()).toBe('/town/exchange/manual null'))
  })
})
