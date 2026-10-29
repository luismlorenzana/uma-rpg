// Classes v3's save rules unmocked (H126): with the switch at 18, the same calls `classes-v19.test.ts` makes at 19 behave as
// today. No Tier 0 or new hybrid is a class, every class of the six is open, a null class is her style's, the calling pick
// still reads and the trees list today's six classes. Invented outfits only.
import { describe, expect, it } from 'vitest'
import { RPG_CLASSES, rpgClassGate } from '../rpg/rules'
import {
  activeClass, chooseClass, confirmCalling, pickCalling, promoteUma, promotionPlan, startingClass, type BattleOutfit,
} from './battle'
import { umaClassTree, umaHeldClasses } from './class'
import { manualBlock } from './exchange'
import { SaveRuleError, unlockUma, worldOf } from './rules'
import { newSave, type Save } from './save'

const T = (n: number) => new Date(Date.parse('2026-10-29T12:00:00.000Z') + n * 1000).toISOString()
const outfit = (id: string, styles: ('front' | 'pace' | 'late' | 'end')[]): BattleOutfit => ({
  outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 90 },
  growthRatePercents: { speed: 10, stamina: 10, power: 10, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'B', pace: 'B', late: 'B', end: 'B', ...Object.fromEntries(styles.map((s) => [s, 'A'])) },
    distance: { sprint: 'B', mile: 'B', medium: 'A', long: 'B' } },
})
const FRONT = outfit('101', ['front']), PACE_LATE = outfit('105', ['pace', 'late'])
const save = (): Save => [FRONT, PACE_LATE].reduce((s, o) => unlockUma(s, o.outfitId, T(0), '1', startingClass(o)), newSave('Luis', T(0)))
const message = (fn: () => unknown): string | null => {
  try { fn(); return null } catch (err) { return err instanceof SaveRuleError ? err.message : String(err) }
}

describe('Classes v3\'s save rules with the live switch (engine 18)', () => {
  it('starts and reads classes as today', () => {
    const s = save()
    expect([worldOf(s).umas['101']!.classId, worldOf(s).umas['105']!.classId]).toEqual(['brawler', 'spellblade'])
    expect([activeClass(FRONT, { classId: null }), activeClass(FRONT, { classId: null }, 2)]).toEqual(['brawler', 'brawler'])
    expect(umaHeldClasses(worldOf(s).umas['101']!)).toEqual(RPG_CLASSES)
    expect(umaClassTree(worldOf(s).umas['101']!, FRONT).map((t) => `${t.classId} ${t.state}`)).toEqual([
      'brawler on', 'mage available', 'spellblade available', 'cleric available', 'summoner available', 'paladin available',
    ])
  })

  it('refuses Classes v3\'s classes and promotion; every class of the six switches freely', () => {
    const s = save()
    expect(message(() => chooseClass(s, '101', 'recruit', T(1)))).toBe('no class recruit')
    expect(message(() => chooseClass(s, '101', 'tomeblade', T(1)))).toBe('no class tomeblade')
    expect(worldOf(chooseClass(s, '101', 'mage', T(1))).umas['101']!.classId).toBe('mage')
    expect(message(() => promoteUma(s, '101', 'recruit', 'brawler', T(1)))).toBe('no class recruit')
    expect(promotionPlan(worldOf(s).umas['101']!, 'recruit', 'brawler').block).toBe('no class recruit')
    expect(rpgClassGate({ classes: {} }, 'brawler')).toBeNull()
    expect(manualBlock(worldOf(s), '101', { kind: 'class', id: 'recruit' })).toBe('No such class')
    expect(manualBlock(worldOf(s), '101', { kind: 'class', id: 'mage' })).toBe('Needs 1000 Class Marks')
  })

  it('keeps the calling pick', () => {
    const picked = pickCalling(save(), PACE_LATE, 'mage', T(1))
    expect(worldOf(picked).umas['105']!.calling).toEqual({ pick: 'mage', confirmed: false })
    expect(worldOf(confirmCalling(picked, '105', T(2))).umas['105']!.calling).toEqual({ pick: 'mage', confirmed: true })
  })
})
