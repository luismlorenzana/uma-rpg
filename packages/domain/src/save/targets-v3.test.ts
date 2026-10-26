import { describe, expect, it } from 'vitest'
import { newGrades } from '../economy/grades'
import { materialType } from '../items/materials-id'
import { facilityTargets, targetDemand, targetPlan } from './targets'
import { gradedUma, gradedWorld, starMap } from './economy-v3.fixture'


const total = (rows: readonly { need: number }[]) => rows.reduce((sum, row) => sum + row.need, 0)
const planAt = (tier: 1 | 2 = 1) => {
  const world = gradedWorld({ targets: ['101'], umas: { '101': gradedUma({ gear: newGrades(tier), stars: starMap() }) } })
  return { world, plan: targetPlan(world, () => 'brawler', tier) }
}

describe('R2 targets', () => {
  it('plans exact fresh Tier 1 gear, jewels, refined and raw totals', () => {
    const { plan } = planAt(1)
    const count = (prefix: string) => total(plan.made.filter((row) => row.key.startsWith(prefix)))
    expect(count('weapon-gem-')).toBe(30)
    expect(count('armor-fittings-')).toBe(50)
    expect(count('accessory-setting-')).toBe(10)
    expect(count('jewel-planet-')).toBe(5)
    expect(count('jewel-moon-')).toBe(17)
    expect(total(plan.refined)).toBe(493)
    expect(total(plan.raw)).toBe(493)
    expect(facilityTargets(plan, 'forge').every((row) => row.key.startsWith('weapon-gem-'))).toBe(true)
    expect(facilityTargets(plan, 'armorer').every((row) => row.key.startsWith('armor-fittings-'))).toBe(true)
    expect(facilityTargets(plan, 'charm-shop').every((row) => row.key.startsWith('accessory-setting-'))).toBe(true)
    expect(facilityTargets(plan, 'lapidary').every((row) => row.key.startsWith('jewel-'))).toBe(true)
    expect(facilityTargets(plan, 'workbench')).toEqual(plan.refined.filter((row) => row.need > row.have))
  })

  it('uses Tier 2 pairs for the G5 and G10 lines', () => {
    const { plan } = planAt(2)
    expect(plan.refined.some((row) => row.key === materialType('metal', 2, 'low').refined)).toBe(true)
    expect(plan.refined.some((row) => row.key === materialType('metal', 2, 'high').refined)).toBe(true)
  })

  it('a G4 Greatsword asks only for its G5–G10 gems', () => {
    const grades = newGrades(1)
    grades.weapons.greatsword = { grade: 4 }
    const demand = targetDemand(gradedUma({ gear: grades, stars: starMap() }), 'brawler')
    for (let grade = 1; grade <= 4; grade++) expect(demand.get(`weapon-gem-g${grade}`)).toBe(2)
    for (let grade = 5; grade <= 10; grade++) expect(demand.get(`weapon-gem-g${grade}`)).toBe(3)
  })
})
