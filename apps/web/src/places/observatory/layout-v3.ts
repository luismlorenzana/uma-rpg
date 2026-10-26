import { MAP_NODES, nodeBody, nodeNumeral } from '@rpg/domain'

export interface MapNodeLayout { id: string; x: number; y: number; r: number; orbit: 'planet' | 'shared' | 'template' }

const ring = (ids: readonly string[], cx: number, cy: number, radius: number, start = -Math.PI / 2,
  orbit: MapNodeLayout['orbit'] = 'shared'): MapNodeLayout[] => ids.map((id, index) => ({
    id, x: cx + Math.cos(start + (index * Math.PI * 2) / ids.length) * radius,
    y: cy + Math.sin(start + (index * Math.PI * 2) / ids.length) * radius, r: 7, orbit,
  }))

/** H79's 360×360 Planet, three shared moons and separate ★ moon. */
export function observatoryLayoutV3(): MapNodeLayout[] {
  const body = (name: string) => MAP_NODES.filter((id) => nodeBody(id) === name).sort((a, b) => nodeNumeral(a) - nodeNumeral(b))
  return [
    ...ring(body('planet'), 180, 180, 38, -Math.PI / 2, 'planet'),
    ...ring(body('prowess'), 180, 68, 38),
    ...ring(body('vigor'), 92, 276, 38),
    ...ring(body('guard'), 268, 276, 38),
    ...ring(body('template'), 302, 112, 23, -Math.PI / 2, 'template'),
  ]
}
