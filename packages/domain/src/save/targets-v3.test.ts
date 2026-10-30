import { describe, expect, it } from 'vitest'
import { newGrades } from '../economy/grades'
import { lineItem } from '../items/lines'
import { facilityTargets, targetDemand, targetPlan } from './targets'
import { gradedUma, gradedWorld, starMap } from './economy-v3.fixture'


const total = (rows: readonly { need: number }[]) => rows.reduce((sum, row) => sum + row.need, 0)
const planAt = (tier: 1 | 2 = 1) => {
  const world = gradedWorld({ targets: ['101'], umas: { '101': gradedUma({ gear: newGrades(tier), stars: starMap() }) } })
  return { world, plan: targetPlan(world, () => 'brawler', tier) }
}

describe('targets (R2; the farm by line since H112)', () => {
  it('plans exact fresh Tier 1 gear, jewels, refined and raw totals', () => {
    const { plan } = planAt(1)
    const count = (prefix: string) => total(plan.made.filter((row) => row.key.startsWith(prefix)))
    expect(count('weapon-gem-')).toBe(30)
    expect(count('armor-fittings-')).toBe(50)
    expect(count('accessory-setting-')).toBe(30)
    expect(count('jewel-planet-')).toBe(15)
    expect(count('jewel-moon-')).toBe(15)
    // A Brawler's three Arms: 30 Arms Gems × 10 Ingots, 50 Fittings × 3 Planks, 30 Settings × 5 Fillets, and 15 Planet and
    // 15 Moon Jewels × 5 cut stones (D264).
    expect(total(plan.refined)).toBe(300 + 150 + 150 + 150)
    // Every grade the same on every line but the one she doesn't use: the wishlist is flat.
    for (const place of ['forest-workbench', 'fishery-workbench', 'den-workbench']) {
      expect(new Set(facilityTargets(plan, place).map((row) => row.need)), place).toEqual(new Set([15]))
    }
    expect(total(plan.raw)).toBe(total(plan.refined))
    const lineOf = (key: string) => lineItem(key)?.line
    const forge = facilityTargets(plan, 'weapon-forge')
    expect(forge.slice(0, 10).every((row) => row.key.startsWith('weapon-gem-'))).toBe(true)
    expect(forge).toHaveLength(10)
    expect(facilityTargets(plan, 'mine-workbench').every((row) => lineOf(row.key) === 'metal' && lineItem(row.key)!.refined)).toBe(true)
    expect(facilityTargets(plan, 'mine').every((row) => lineOf(row.key) === 'metal' && !lineItem(row.key)!.refined)).toBe(true)
    expect(facilityTargets(plan, 'armorer').slice(0, 10).every((row) => row.key.startsWith('armor-fittings-'))).toBe(true)
    expect(facilityTargets(plan, 'charm-forge').slice(0, 10).every((row) => row.key.startsWith('accessory-setting-'))).toBe(true)
    expect(facilityTargets(plan, 'lapidary').slice(0, 10).every((row) => row.key.startsWith('jewel-'))).toBe(true)
    // A Brawler holds no Tome: nothing for the Tome Forge, its Workbench or the Fields.
    expect(facilityTargets(plan, 'tome-forge')).toEqual([])
    expect(facilityTargets(plan, 'fields-workbench')).toEqual([])
    expect(facilityTargets(plan, 'fields')).toEqual([])
  })

  it('plans the same fifty types in a Tier 2 world (FL8)', () => {
    expect(total(planAt(2).plan.refined)).toBe(total(planAt(1).plan.refined))
  })

  it('a G4 Greatsword asks only for its G5–G10 gems', () => {
    const grades = newGrades(1)
    grades.weapons.greatsword = { grade: 4 }
    const demand = targetDemand(gradedUma({ gear: grades, stars: starMap() }), 'brawler')
    for (let grade = 1; grade <= 4; grade++) expect(demand.get(`weapon-gem-g${grade}`)).toBe(2)
    for (let grade = 5; grade <= 10; grade++) expect(demand.get(`weapon-gem-g${grade}`)).toBe(3)
  })
})
