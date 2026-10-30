// The Gear tab's standard presets (D263): a Tier 1 class's one row, a Tier 0's one row a child, and a tap wears that child's
// weapons and reads On. Invented outfits; the store is the real one, holding a test save.
import { newGrades, newOwnedUma, newSave, worldOf, type OwnedUma, type RpgClass, type Save } from '@rpg/domain'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { albumFixture } from '../../album/testing'
import { resetGame, useGame } from '../../save/game'
import { PresetButton } from './PresetButton'

const NOW = '2026-10-30T12:00:00.000Z'
let outfit: Awaited<ReturnType<typeof albumFixture>>['view']['roster'][number]

function Live() {
  const save = useGame((s) => s.save)
  if (!save) return null
  const world = worldOf(save)
  return <PresetButton outfit={outfit} uma={world.umas[outfit.outfitId]!} world={world} />
}
async function show(classId: RpgClass) {
  const { view } = await albumFixture()
  outfit = view.roster[0]!
  const save: Save = newSave('Presets', NOW)
  const uma: OwnedUma = { ...newOwnedUma(NOW), classId, gear: newGrades(1) }
  worldOf(save).umas[outfit.outfitId] = uma
  useGame.setState({ status: 'ready', save, activeTier: 1 })
  render(<Live />)
}
const held = () => worldOf(useGame.getState().save!).umas[outfit.outfitId]!.classes

describe('PresetButton (D263)', () => {
  beforeEach(() => resetGame())
  afterEach(cleanup)

  it('gives a Tier 1 class its one standard preset', async () => {
    await show('paladin')
    expect(screen.getAllByRole('button')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: /Standard preset/ }))
    await waitFor(() => expect(held().paladin?.weapons).toEqual(['lance', 'greatsword', 'tome-light']))
    expect((await screen.findByRole('button', { name: /Standard preset · On/ })).hasAttribute('disabled')).toBe(true)
  })

  it('lets a Healer pick between the Paladin and the Cleric, and swap', async () => {
    await show('acolyte')
    expect(screen.getByRole('heading').textContent).toBe('Standard preset')
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([
      expect.stringContaining('Paladin'), expect.stringContaining('Cleric'),
    ])
    fireEvent.click(screen.getByRole('button', { name: /Cleric/ }))
    await waitFor(() => expect(held().acolyte?.weapons).toEqual(['tome-light', 'tome-fire', 'lance']))
    await screen.findByRole('button', { name: /Cleric · On/ })
    fireEvent.click(screen.getByRole('button', { name: /Paladin/ }))
    await waitFor(() => expect(held().acolyte?.weapons).toEqual(['lance', 'greatsword', 'tome-light']))
    await screen.findByRole('button', { name: /Paladin · On/ })
  })

  it('lists three for the Warrior and the Mage', async () => {
    await show('recruit')
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })
})
