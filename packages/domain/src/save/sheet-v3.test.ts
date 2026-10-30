import { describe, expect, it } from 'vitest'
import { newGrades } from '../economy/grades'
import { rpgDefaultWeapons } from '../rpg/rules'
import { accessorySlot, FULL_MAP, gradedUma, templateOutfit } from './economy-v3.fixture'
import { umaBattleSheet } from './sheet'


const sheet = (tier: 1 | 2) => {
  const gear = newGrades(tier)
  for (const weapon of rpgDefaultWeapons('brawler', 17)) gear.weapons[weapon] = { grade: 10 }
  for (const slot of ['head', 'body', 'legs', 'arms', 'feet'] as const) gear.armor[slot] = { grade: 10 }
  gear.accessories[0] = accessorySlot('bell', 10)
  const uma = gradedUma({ level: 50, classId: 'brawler', gear, stars: FULL_MAP, ranks: { classes: { brawler: { rank: 50, exp: 0 } } } })
  return umaBattleSheet(templateOutfit('101', 'fleet', 'physical'), uma, 'brawler', tier, 17)
}

describe('R2 battle sheet', () => {
  it('lists every weapon, the three accessory slots and signature, with only R2 defense rows', () => {
    const groups = sheet(1)
    const offense = groups.find((group) => group.title === 'Offense')!.rows
    expect(offense.filter((row) => row.label === 'Might').map((row) => row.value)).toEqual(['Greatsword +68', 'Axe +68', 'Lance +68'])
    expect(offense.filter((row) => row.label.startsWith('Accessory')).map((row) => [row.label, row.value])).toEqual([
      ['Accessory 1', 'Charm · M.ATK +6'], ['Accessory 2', 'None'], ['Accessory 3', 'None']])
    expect(offense.find((row) => row.label === '★ Signature')!.value).toBe('ATK/M.ATK +10 · Worn')
    expect(groups.find((group) => group.title === 'Defense')!.rows.map((row) => row.label)).toEqual(['DEF', 'M.DEF', 'Evasion'])
  })

  it('scales Tier 2 Might and signature', () => {
    const offense = sheet(2).find((group) => group.title === 'Offense')!.rows
    expect(offense.filter((row) => row.label === 'Might').map((row) => row.value)).toEqual(['Greatsword +122', 'Axe +122', 'Lance +122'])
    expect(offense.find((row) => row.label === '★ Signature')!.value).toBe('ATK/M.ATK +18 · Worn')
  })
})
