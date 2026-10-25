import { ONE_HEALER, type BattleOutfit, type OwnedUma, type RpgClass } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { healerNote } from './healer-note'

// Invented outfits: every one a Late surger, so an Uma who never picked fights as a Cleric.
const outfit = (outfitId: string): BattleOutfit => ({
  outfitId, baseStats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100 },
  growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'G', pace: 'G', late: 'A', end: 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } },
})
const OUTFITS = new Map(['1', '2', '3', '4', '5'].map((id) => [id, outfit(id)]))
const world = (classes: (RpgClass | null)[]) => ({
  umas: Object.fromEntries(classes.map((classId, i) => [String(i + 1), { classId } as unknown as OwnedUma])),
})
const party = { slots: ['1', '2', '3', '4', '5'] }

describe('the Party Hall\'s one-healer note (H59, C8)', () => {
  it('says "One healer a party" for two healers in classes v2, and goes once one fights as a damage class', () => {
    expect(ONE_HEALER).toBe('One healer a party')
    expect(healerNote(world(['cleric', 'cleric', 'brawler', 'mage', 'summoner']), party, OUTFITS, 15)).toBe(ONE_HEALER)
    expect(healerNote(world(['cleric', 'paladin', 'brawler', 'mage', 'summoner']), party, OUTFITS, 15)).toBe(ONE_HEALER)
    // Two who never picked fight as their style's Cleric.
    expect(healerNote(world([null, null, 'brawler', 'mage', 'summoner']), party, OUTFITS, 15)).toBe(ONE_HEALER)
    expect(healerNote(world(['cleric', 'brawler', 'brawler', 'mage', 'summoner']), party, OUTFITS, 15)).toBeNull()
    expect(healerNote(world(['cleric', 'cleric', 'brawler', 'mage', 'summoner']), { slots: ['1', null, '3', null, '5'] }, OUTFITS, 15)).toBeNull()
  })

  it('shows nothing in classes v1, where a Cleric is no healer', () => {
    expect(healerNote(world(['cleric', 'cleric', 'cleric', 'mage', 'summoner']), party, OUTFITS, 14)).toBeNull()
  })
})
