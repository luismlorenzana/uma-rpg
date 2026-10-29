// Classes v3's Rift builds (H126; classes-v3.md §10, CV22, CV23): each front's guided build is a family of the tree, one
// healer each; the kinds each holds; a run's twenty hold all eight Tier 1 classes. Engine v19 passed explicitly.
import { describe, expect, it } from 'vitest'
import { rpgIsHealer, rpgWeaponKind, validRpgWeapons, type RpgClass } from '../rpg/rules'
import { BUILDS_V19, PARTY_V19, RIFT_FRONT_SPECS, riftFrontSpecs, riftGuidedBuild, riftParty } from './fronts'
import { RIFT_FRONTS } from './state'

const V18 = 18, V19 = 19
const count = (list: readonly string[]) => list.reduce<Record<string, number>>((n, k) => ({ ...n, [k]: (n[k] ?? 0) + 1 }), {})

describe('the Rift\'s builds by family (CV23)', () => {
  it('guides Iron to the Warrior side, Arcane to the Mage side, the Duel to the Spellblades and the Horde to the Summoners', () => {
    expect(Object.fromEntries(RIFT_FRONTS.map((f) => [f, riftParty(f, V19)]))).toEqual({
      iron: ['brawler', 'brawler', 'spellblade', 'armsummoner', 'paladin'],
      arcane: ['mage', 'mage', 'tomeblade', 'summoner', 'cleric'],
      duel: ['spellblade', 'spellblade', 'tomeblade', 'tomeblade', 'paladin'],
      horde: ['armsummoner', 'armsummoner', 'summoner', 'summoner', 'cleric'],
    })
    expect(PARTY_V19).toEqual(Object.fromEntries(RIFT_FRONTS.map((f) => [f, riftParty(f, V19)])))
    for (const f of RIFT_FRONTS) {
      expect(riftParty(f, V19).filter((c) => rpgIsHealer(c, V19)), f).toHaveLength(1)
      expect(riftGuidedBuild(f, V19).map((m) => m.classId), f).toEqual(riftParty(f, V19))
      for (const m of riftGuidedBuild(f, V19)) expect(validRpgWeapons(m.classId, m.weapons, V19), `${f} ${m.classId}`).toBe(true)
    }
  })

  it('re-specs the second copies as §10.1 says, the rest on their v19 defaults', () => {
    const build = (f: (typeof RIFT_FRONTS)[number]) => riftGuidedBuild(f, V19).map((m) => `${m.classId}: ${m.weapons.join(' ')}`)
    expect(build('iron')).toEqual(['brawler: greatsword axe lance', 'brawler: bow katana axe', 'spellblade: katana lance tome-lightning',
      'armsummoner: bow axe tome-dark', 'paladin: greatsword axe tome-light'])
    expect(build('arcane')).toEqual(['mage: tome-fire tome-ice tome-lightning', 'mage: tome-light tome-dark tome-fire',
      'tomeblade: tome-light tome-lightning katana', 'summoner: tome-dark tome-ice axe', 'cleric: tome-light tome-ice bow'])
    expect(build('duel')).toEqual(['spellblade: katana lance tome-lightning', 'spellblade: bow greatsword tome-fire',
      'tomeblade: tome-light tome-lightning katana', 'tomeblade: tome-dark tome-ice axe', 'paladin: greatsword axe tome-light'])
    expect(build('horde')).toEqual(['armsummoner: bow axe tome-dark', 'armsummoner: lance greatsword tome-lightning',
      'summoner: tome-dark tome-ice axe', 'summoner: tome-fire tome-lightning katana', 'cleric: tome-light tome-ice bow'])
    expect(Object.keys(BUILDS_V19)).toEqual([...RIFT_FRONTS])
  })

  it('holds §10.1\'s kinds: Iron\'s Arms and Arcane\'s elements twice or more, the Duel and the Horde every kind', () => {
    const kinds = (f: (typeof RIFT_FRONTS)[number]) => count(riftGuidedBuild(f, V19).flatMap((m) => m.weapons.map(rpgWeaponKind)))
    const iron = kinds('iron'), arcane = kinds('arcane')
    expect(['greatsword', 'axe', 'lance', 'bow', 'katana'].map((k) => iron[k])).toEqual([2, 4, 2, 2, 2])
    expect(['fire', 'ice', 'lightning', 'light', 'dark'].map((k) => arcane[k])).toEqual([2, 3, 2, 3, 2])
    for (const f of ['duel', 'horde'] as const) expect(Object.keys(kinds(f)).length, f).toBe(10)
  })

  it('fields all eight Tier 1 classes across a run\'s twenty', () => {
    const twenty: RpgClass[] = RIFT_FRONTS.flatMap((f) => [...riftParty(f, V19)])
    expect(count(twenty)).toEqual({ brawler: 2, mage: 2, spellblade: 3, tomeblade: 3, armsummoner: 3, summoner: 3, paladin: 2, cleric: 2 })
  })

  it('keeps v18\'s guidance and the live fronts until H134', () => {
    expect(riftParty('duel', V18)).toEqual(['brawler', 'brawler', 'mage', 'mage', 'paladin'])
    expect(riftGuidedBuild('iron', V18).map((m) => m.classId)).toEqual(['brawler', 'brawler', 'spellblade', 'spellblade', 'paladin'])
    expect(RIFT_FRONT_SPECS).toEqual(riftFrontSpecs(V18))
  })
})
