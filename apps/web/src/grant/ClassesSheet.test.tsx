// "The classes are rebuilt" drawn (H132): the grant, the tree, the steps, the parts and each Uma's row with her face, from
// a world's record and master data; its two buttons; nothing without a record. Made-up outfits (the album fixture).
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { MotionRoot } from '@luismlorenzana/uma-kit/ui'
import type { ClassesV3Record } from '@rpg/domain'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { domAnimation } from 'motion/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { albumFixture } from '../album/testing'
import ClassesSheet from './ClassesSheet'

let fixture: Awaited<ReturnType<typeof albumFixture>>
vi.mock('../save/game', async (importOriginal) => ({ ...await importOriginal<typeof import('../save/game')>(),
  useWorld: () => fixture.world, useActiveTier: () => 1 }))
vi.mock('../master/master', async (importOriginal) => ({ ...await importOriginal<typeof import('../master/master')>(),
  useMaster: () => ({ status: 'ready', view: fixture.view }) }))

const RECORD: ClassesV3Record = {
  manuals: 34, marks: 34_000, traded: true, seen: false,
  umas: {
    81001: { classId: 'summoner', ranks: { summoner: { rank: 50, exp: 0 } }, pick: null, manuals: 28, left: 28 },
    81002: { classId: 'brawler', ranks: { brawler: { rank: 8, exp: 0 } }, pick: null, manuals: 6, left: 6, trade: { from: 'physical', to: 'magical' } },
  },
  halls: [{ outfitId: '81002', from: 'paladin-3', to: 'healer-2', was: 'hero', now: 'learner', bond: 4 }],
}

function show(onLater = vi.fn(), onExchange = vi.fn()) {
  render(<MotionRoot features={domAnimation}><AlbumArtProvider art={{ useUrl: () => 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E' }}>
    <ClassesSheet onLater={onLater} onExchange={onExchange} />
  </AlbumArtProvider></MotionRoot>)
  return { onLater, onExchange }
}

beforeEach(async () => {
  fixture = await albumFixture()
  fixture.world.classesV3 = RECORD
})
afterEach(() => cleanup())

describe('ClassesSheet (H132)', () => {
  it('draws the grant, the tree, the steps, the parts and each Uma by Manuals', () => {
    show()
    const sheet = screen.getByRole('dialog', { name: 'The classes are rebuilt' })
    expect(sheet.querySelector('[data-classes-grant]')!.textContent).toBe('+34 Class Manuals')
    expect(sheet.textContent).toContain('34,000 Class Marks · Exchange')
    expect(sheet.querySelector('[data-classes-tree]')!.textContent).toContain('Duelist · Acolyte · Caller')
    expect(sheet.textContent).toContain('Her profile → Skills → Promote (Rank 10)')
    expect(sheet.textContent).toContain('1 Uma moved trade · her running work finished into the Warehouse')
    expect(sheet.querySelector('[data-classes-halls]')!.textContent).toContain('Beryl Hero → Learner · Archdemon’s Toll · Bond 4')
    expect([...sheet.querySelectorAll('[data-classes-umas] li')].map((li) => li.textContent)).toEqual([
      'AsterSummoner R50 → Recruit R128', 'BerylBrawler R8 → Recruit R1 · trade Metal → Stone6',
    ])
  })

  it('To the Exchange and Later call their own; ✕ is Later', () => {
    const { onLater, onExchange } = show()
    fireEvent.click(screen.getByRole('button', { name: 'To the Exchange' }))
    expect(onExchange).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'Later' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onLater).toHaveBeenCalledTimes(2)
  })

  it('draws nothing without a record', () => {
    delete fixture.world.classesV3
    show()
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
