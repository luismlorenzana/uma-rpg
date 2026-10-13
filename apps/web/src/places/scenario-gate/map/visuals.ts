// Published world's palette contract; props/dimensions come from atlas.json rather than a copied list.
import index from '@luismlorenzana/uma-art/world/atlas.json'
import compactIndex from '@luismlorenzana/uma-art/world/stages-compact.json'
import type { Biome } from '@rpg/domain'
export type Road = 'dirt' | 'stone' | 'boards'
export const ROADS: readonly Road[] = ['dirt', 'stone', 'boards']
export const visuals: Record<Biome, { liquid: string | null; road: Road }> = {
  meadow: { liquid: 'water', road: 'dirt' }, forest: { liquid: 'water', road: 'dirt' },
  coast: { liquid: 'water', road: 'boards' }, swamp: { liquid: 'marsh', road: 'boards' },
  jungle: { liquid: 'water', road: 'dirt' }, desert: { liquid: 'water', road: 'dirt' },
  canyon: { liquid: null, road: 'stone' }, volcano: { liquid: 'lava', road: 'stone' },
  geyser: { liquid: 'water', road: 'boards' }, tundra: { liquid: 'ice', road: 'dirt' },
  glacier: { liquid: 'ice', road: 'stone' }, peaks: { liquid: null, road: 'stone' },
  highlands: { liquid: 'water', road: 'dirt' }, sky: { liquid: 'cloud', road: 'boards' },
  underworld: { liquid: 'void', road: 'stone' }, moor: { liquid: 'marsh', road: 'dirt' },
  crystal: { liquid: 'water', road: 'stone' }, ruins: { liquid: 'water', road: 'stone' }, rift: { liquid: 'void', road: 'stone' },
}
export interface Frame { x: number; y: number; w: number; h: number; group: string; biome?: string }
export const frames: Readonly<Record<string, Frame>> = { ...index.frames, ...compactIndex.frames }
export const propsOf = (biome: Biome): string[] => Object.keys(frames).filter((id) => id.startsWith('prop/' + biome + '/'))
