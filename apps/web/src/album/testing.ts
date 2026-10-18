// Small, invented UI fixtures only. Never import private release data into tests.
import { buildMemoryRelease, syntheticMasterData } from '@luismlorenzana/uma-data/testing'
import { outfitRowBase } from '@luismlorenzana/uma-kit/roster'
import { buildRoster, newOwnedUma, newSave, worldOf } from '@rpg/domain'
import type { MasterView } from '../master/master'

export const NOW = '2026-10-17T12:00:00.000Z'
export async function albumFixture() {
  const data = syntheticMasterData()
  const names = ['Aster', 'Beryl', 'Cinder', 'Dune', 'Ember', 'Fable']
  const characters = names.map((name, i) => ({ ...data.characters[0]!, id: 90001 + i, name: { ja: name, en: name, global: name } }))
  const outfits = characters.map((c, i) => ({ ...data.outfits[0]!, id: 81001 + i, characterId: c.id,
    title: { ja: `Practice ${i}`, en: `Practice ${i}`, global: `Practice ${i}` },
    release: { ...data.outfits[0]!.release, jp: `2026-01-${String(i + 1).padStart(2, '0')}` },
  }))
  const roster = buildRoster({ characters, outfits })
  const view: MasterView = { roster, chapters: [], art: null, manifest: (await buildMemoryRelease(data)).manifest,
    album: new Map(outfits.map((o, i) => [String(o.id), outfitRowBase(o, characters[i]!)])) }
  const save = newSave('Review', NOW)
  const world = worldOf(save)
  world.umas = Object.fromEntries(roster.slice(0, 5).map((o, i) => [o.outfitId, {
    ...newOwnedUma(NOW), level: [3, 20, 20, 8, 1][i]!, craft: { level: [12, 2, 7, 5, 1][i]!, exp: 0 },
  }]))
  return { view, save, world }
}
