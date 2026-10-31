// The Template tab on the real store with a test save (H123): the Signature row opens the accessory sheet and a tap on her ★
// wears it, the dot going; a Moon row opens the node sheet; the Flourish sheet's Fight as switches her and the row reads On; the
// racing skill sheet shows its name and text; a locked outfit has no taps.
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { configureKit, MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { newGrades, newOwnedUma, worldOf, type RpgClass, type Save } from '@rpg/domain'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { domMax } from 'motion/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { albumFixture } from '../../album/testing'
import { resetGame, useGame } from '../../save/game'
import { TemplateTab } from './TemplateTab'

vi.mock('../../master/master', async (orig) => ({ ...await orig<typeof import('../../master/master')>(),
  loadSkills: async () => new Map([[100101, { name: 'Sample Burst', description: 'Sample text.' }]]) }))
vi.mock('@rpg/domain', async (orig) => ({ ...await orig<typeof import('@rpg/domain')>(), skillText: () => ({ name: 'Sample Burst', description: 'Sample text.' }) }))

const NOW = '2026-10-31T12:00:00.000Z'
let fixture: Awaited<ReturnType<typeof albumFixture>>
const outfit = () => fixture.view.roster[0]!

async function saveWith(classId: RpgClass, grade: number): Promise<Save> {
  fixture = await albumFixture()
  const save: Save = { ...fixture.save }
  const world = worldOf(save)
  const gear = newGrades(1)
  gear.accessories[0] = { grade, family: null, form: 'base' }
  world.umas[outfit().outfitId] = { ...newOwnedUma(NOW), level: 40, classId, gear, ranks: { classes: { [classId]: { rank: 10, exp: 0 } } } }
  return save
}
function Live({ locked = false }: { locked?: boolean }) {
  const world = worldOf(useGame((s) => s.save)!)
  return <TemplateTab view={fixture.view} outfit={outfit()} uma={locked ? null : world.umas[outfit().outfitId]!} world={locked ? null : world} tier={1} />
}
function show(save: Save, locked = false) {
  useGame.setState({ status: 'ready', save, activeTier: 1 })
  render(<MemoryRouter><MotionRoot features={domMax}><AlbumArtProvider art={{ useUrl: () => null }}><Live locked={locked} /></AlbumArtProvider></MotionRoot></MemoryRouter>)
}
const row = (key: string) => document.querySelector<HTMLElement>(`[data-template-row="${key}"]`)!
const her = () => worldOf(useGame.getState().save!).umas[outfit().outfitId]!

beforeEach(() => {
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  configureKit({ storagePrefix: 'rpg.' })
  setReducedMotion(true)
})
afterEach(() => {
  cleanup()
  resetGame()
  vi.unstubAllGlobals()
})

describe('the Template tab (H123)', () => {
  it('opens Gear\'s accessory sheet from the Signature row with no dot, and a tap on her ★ wears it', async () => {
    show(await saveWith('recruit', 2))
    expect(row('signature').getAttribute('aria-label')).toMatch(/Not worn$/)
    expect(row('signature').querySelector('.bg-success')).toBeNull()
    fireEvent.click(row('signature'))
    const sheet = await screen.findByRole('dialog', { name: 'Accessory 1 · G2' })
    await act(async () => { fireEvent.click(within(sheet).getAllByRole('button', { name: /^★ / })[0]!) })
    await waitFor(() => expect(row('signature').getAttribute('aria-label')).toMatch(/Worn$/))
  })

  it('opens Stars\' node sheet from a Moon row', async () => {
    show(await saveWith('recruit', 0))
    fireEvent.click(row('moon-2'))
    expect(await screen.findByRole('button', { name: 'With its moons' })).toHaveProperty('disabled', true)
  })

  it('fights as her family from the Flourish sheet: the row reads On, and the sheet stays open on it', async () => {
    show(await saveWith('apprentice', 0))
    const calling = document.querySelector('[data-profile-template]')!.textContent!
    expect(calling).toContain('Calling')
    expect(row('flourish').textContent).toContain('Off · as Mage')
    fireEvent.click(row('flourish'))
    const sheet = await screen.findByRole('dialog', { name: '★ Flourish' })
    const footer = within(sheet).getByRole('button', { name: /^(Start|Fight as) / })
    await act(async () => { fireEvent.click(footer) })
    await waitFor(() => expect(her().classId).not.toBe('apprentice'))
    await waitFor(() => expect(row('flourish').textContent).toContain('On'))
    expect(within(sheet).getByText('Now · On')).toBeDefined()
  })

  it('shows her racing skill\'s name and text in its sheet', async () => {
    show(await saveWith('recruit', 0))
    fireEvent.click(screen.getByRole('button', { name: 'Racing skill ›' }))
    expect(await screen.findByText('Sample Burst')).toBeDefined()
    expect(screen.getByText('Sample text.')).toBeDefined()
  })

  it('has no taps on a locked outfit\'s ★ rows, and no states', async () => {
    show(await saveWith('recruit', 0), true)
    expect(row('flourish').tagName).toBe('DIV')
    expect(row('signature').textContent).toContain('Lv 50')
    expect(screen.getByText(/^Calling on unlock · /)).toBeDefined()
  })
})
