// Her battle sheet on engine v16 (H70; stat-balance.md §7.2, SB18; uma-templates.md §3.3, UT6, UT14), asked with an explicit
// engine: the Sustain group's MP row carries what she regains a round (the base regen by her Class Rank plus any Spring's),
// "MP Regen" goes, and a ★ Flourish row reads her template's as her calling, or "No effect as Brawler". The live sheet since
// H72 (D210), when v15's Sustain rows retired. Invented outfits only.
import { describe, expect, it } from 'vitest'
import { withTrack } from '../economy/ranks'
import { starPoints } from '../economy/stars'
import { rpgBaseMpRegen } from '../rpg/rules'
import type { BattleOutfit } from './battle'
import { gearV1, newOwnedUma, type OwnedUma } from './save'
import { flourishShort, umaBattleSheet } from './sheet'

const NOW = '2026-10-25T12:00:00.000Z'
/** A Pace Uma with Wit over Power at Medium A and Wit growth: a Mage by her calling, Middle, Clever (Even pace). */
const MAGE: BattleOutfit = {
  outfitId: '701', baseStats: { speed: 100, stamina: 100, power: 90, guts: 100, wit: 200 },
  growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 30 },
  aptitudes: { strategy: { front: 'C', pace: 'A', late: 'C', end: 'C' }, distance: { sprint: 'C', mile: 'C', medium: 'A', long: 'C' } },
}
/** A Lv 50 Mage at Class Rank 40, her Extra Stats topped up with MP moons so her max MP is `mp`. */
function mageAt(mp: number, extra: Partial<OwnedUma> = {}): OwnedUma {
  let uma: OwnedUma = { ...newOwnedUma(NOW, 'mage'), level: 50, classId: 'mage', ...extra }
  uma = { ...uma, ranks: withTrack(uma.ranks, { kind: 'class', id: 'mage' }, { rank: 40, exp: 0 }) }
  const base = Number(row(umaBattleSheet(MAGE, uma, 'mage', 1, 16), 'MP').value)
  // Moons of grade 10 down to 1 (each worth its grade in MP) close the gap, so the case reads 296 whatever her base.
  const moons: string[] = []
  for (let g = 10, left = mp - base; g >= 1 && left > 0; g -= 1) if (g <= left) { moons.push(`moon:mp:${g}`); left -= g }
  expect(base + starPoints(moons).mp, 'her base MP leaves a gap the moons can close').toBe(mp)
  return { ...uma, stars: { ...uma.stars, active: moons } }
}
const row = (sheet: ReturnType<typeof umaBattleSheet>, label: string) => sheet.flatMap((g) => g.rows).find((r) => r.label === label)!
const sustain = (sheet: ReturnType<typeof umaBattleSheet>) => sheet.find((g) => g.title === 'Sustain')!.rows
const spring = (uma: OwnedUma): OwnedUma => ({ ...uma, gear: { ...gearV1(uma), equipped: { ...gearV1(uma).equipped, 'accessory-2': 'amulet-spring-g10' } } })

describe('the battle sheet on engine v16 (H70)', () => {
  it('reads a Class Rank 40 Mage\'s 296 MP as "296 · +13 a round", "+23" with a G10 Spring, and drops the MP Regen row', () => {
    const uma = mageAt(296)
    const mp = row(umaBattleSheet(MAGE, uma, 'mage', 1, 16), 'MP')
    expect(`${mp.value} · ${mp.note}`).toBe('296 · +13 a round')
    expect(rpgBaseMpRegen(296, 40, 16)).toBe(13)
    const sprung = row(umaBattleSheet(MAGE, spring(uma), 'mage', 1, 16), 'MP')
    expect(`${sprung.value} · ${sprung.note}`).toBe('296 · +23 a round')
    expect(sustain(umaBattleSheet(MAGE, uma, 'mage', 1, 16)).map((r) => r.label))
      .toEqual(['HP', 'HP Regen', 'Lifesteal', 'MP', 'MP Steal', '★ Flourish'])
    // The base regen follows her Class Rank: 0.9% a depth open (R1's balance, H71; SB18 drafted 0.8%).
    const low = { ...uma, ranks: withTrack(uma.ranks, { kind: 'class', id: 'mage' }, { rank: 10, exp: 0 }) }
    expect(row(umaBattleSheet(MAGE, low, 'mage', 1, 16), 'MP').note).toBe(`+${rpgBaseMpRegen(296, 10, 16)} a round`)
  })

  it('shows her Flourish as her calling, and no effect in another class', () => {
    const uma = mageAt(296)
    expect(row(umaBattleSheet(MAGE, uma, 'mage', 1, 16), '★ Flourish').value).toBe('Even pace · 1% a round, up to 4%')
    expect(row(umaBattleSheet(MAGE, uma, 'brawler', 1, 16), '★ Flourish').value).toBe('No effect as Brawler')
    // A pick moves her calling (H69): picked a Spell Blade, her Flourish works only as one.
    const picked = { ...uma, calling: { pick: 'spellblade' as const, confirmed: false } }
    expect(row(umaBattleSheet(MAGE, picked, 'mage', 1, 16), '★ Flourish').value).toBe('No effect as Mage')
    expect(row(umaBattleSheet(MAGE, picked, 'spellblade', 1, 16), '★ Flourish').value).toBe('Even pace · 1% a round, up to 4%')
    expect(flourishShort('clean-break')).toBe('Clean break · a Barrier of 4% at the start')
    expect(flourishShort('late-reserve')).toBe('Late reserve · from round 3, 2% a round, up to 4%')
  })

  it('is the live sheet since H72: v15\'s Sustain rows ("MP Regen", no Flourish) retired with the switch', () => {
    const uma = spring(mageAt(296))
    expect(umaBattleSheet(MAGE, uma, 'mage')).toEqual(umaBattleSheet(MAGE, uma, 'mage', 1, 16))
    expect(sustain(umaBattleSheet(MAGE, uma, 'mage')).map((r) => r.label)).not.toContain('MP Regen')
    // Every other row reads the same in both generations.
    const others = (engine: number) => umaBattleSheet(MAGE, uma, 'mage', 1, engine).filter((g) => g.title !== 'Sustain')
    expect(others(16)).toEqual(others(15))
  })
})
