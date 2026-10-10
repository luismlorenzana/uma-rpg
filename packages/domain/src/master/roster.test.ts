import { syntheticMasterData } from '@luismlorenzana/uma-data/testing'
import { describe, expect, it } from 'vitest'
import { buildChapters, buildRoster, chapterFor, displayText, matchesSearch, skillText } from './roster'

describe('master data adapter', () => {
  it('maps every synthetic outfit with its character, stats and unique skill', () => {
    const data = syntheticMasterData()
    const roster = buildRoster(data)
    expect(roster).toHaveLength(data.outfits.length)
    for (const entry of roster) {
      const outfit = data.outfits.find((o) => o.id === entry.masterId)
      expect(entry.outfitId).toBe(String(outfit?.id))
      expect(entry.name.length).toBeGreaterThan(0)
      expect(entry.baseStats.speed).toBeGreaterThan(0)
      expect(entry.title ?? '').not.toMatch(/^\[/)
    }
  })

  it('skips outfits whose character is missing instead of crashing', () => {
    const data = syntheticMasterData()
    data.characters = []
    expect(buildRoster(data)).toEqual([])
  })

  it('resolves unique skills lazily and tolerates ids the release does not hold', () => {
    const data = syntheticMasterData()
    const roster = buildRoster(data)
    const withSkill = roster.find((o) => o.uniqueSkillId !== null)
    expect(withSkill).toBeDefined()
    expect(skillText(data.skills, withSkill?.uniqueSkillId ?? null)?.name.length).toBeGreaterThan(0)
    expect(skillText(new Map(), withSkill?.uniqueSkillId ?? null)).toBeNull()
    expect(skillText(data.skills, null)).toBeNull()
  })

  it('puts five chapters in a tier, ten levels each', () => {
    expect(chapterFor(1)).toEqual({ tier: 1, levelBand: [1, 10] })
    expect(chapterFor(5)).toEqual({ tier: 1, levelBand: [41, 50] })
    expect(chapterFor(7)).toEqual({ tier: 2, levelBand: [11, 20] })
    expect(chapterFor(14)).toEqual({ tier: 3, levelBand: [31, 40] })
  })

  it('orders chapters by release order', () => {
    const chapters = buildChapters(syntheticMasterData().scenarios)
    expect(chapters.map((c) => c.order)).toEqual([...chapters.map((c) => c.order)].sort((a, b) => a - b))
    expect(chapters[0]?.color).toMatch(/^#[0-9a-fA-F]{6}$/)
  })

  it('prefers Global English text', () => {
    expect(displayText({ ja: 'ス', en: 'Su', global: 'Suzuka' })).toBe('Suzuka')
    expect(displayText({ ja: 'ス', en: null, global: null })).toBe('ス')
  })

  it('searches name and title without case or accents', () => {
    const [first] = buildRoster(syntheticMasterData())
    if (!first) throw new Error('no synthetic outfit')
    expect(matchesSearch(first, first.name.toUpperCase())).toBe(true)
    expect(matchesSearch(first, '')).toBe(true)
    expect(matchesSearch(first, 'zzzz-no-match')).toBe(false)
  })
})
