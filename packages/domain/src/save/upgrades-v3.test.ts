import { describe, expect, it } from 'vitest'
import { newGrades } from '../economy/grades'
import { gradedUma, gradedWorld, starMap } from './economy-v3.fixture'
import { upgradesFor } from './upgrades'


const worldAt = (level: number) => {
  const gear = newGrades(1)
  gear.weapons.greatsword = { grade: 1 }
  gear.accessories[0] = { grade: 1, family: null, form: 'base' }
  return gradedWorld({ items: { 'weapon-gem-g2': 1, 'jewel-moon-2': 1 }, umas: { '101': gradedUma({ level, gear, stars: starMap() }) } })
}

describe('R2 Can upgrade', () => {
  it('uses the level gate, settable jewels and an unformed G1 accessory', () => {
    const ready = upgradesFor(worldAt(6), '101', 'brawler', 1, 17)!
    expect(ready.grades).toContainEqual({ kind: 'weapon', weapon: 'greatsword' })
    expect(ready.grades).toContainEqual({ kind: 'accessory', slot: 0 })
    expect(ready.any).toBe(true)
    const early = upgradesFor(worldAt(5), '101', 'brawler', 1, 17)!
    expect(early.grades).not.toContainEqual({ kind: 'weapon', weapon: 'greatsword' })
    expect(early.grades).toContainEqual({ kind: 'accessory', slot: 0 })
    expect(upgradesFor(worldAt(16), '101', 'brawler', 1, 17)!.jewels).toEqual(['jewel-moon-2'])
  })

  it('counts nothing else', () => {
    const world = worldAt(5)
    world.items = { 'weapon-gem-g3': 5, 'jewel-planet-5': 2 }
    world.umas['101']!.gear = { ...newGrades(1), accessories: [{ grade: 0, family: null, form: 'base' }] }
    expect(upgradesFor(world, '101', 'brawler', 1, 17)).toMatchObject({ grades: [], jewels: [], any: false })
  })
})
