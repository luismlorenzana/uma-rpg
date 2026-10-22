import { buildMemoryRelease, syntheticMasterData } from '@luismlorenzana/uma-data/testing'
import { outfitRowBase } from '@luismlorenzana/uma-kit/roster'
import { buildChapters, buildRoster } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import type { Cast, CastMember } from '../content/cast'
import type { MasterView } from '../master/master'
import { buildCampaign, campaignOf } from './campaign'

/** Synthetic master data with ten scenarios (two tiers of five), each a copy of the synthetic one, and a small cast. */
async function fixture(): Promise<{ view: MasterView; cast: Cast }> {
  const data = syntheticMasterData()
  const first = data.scenarios[0]!
  const scenarios = [first, ...Array.from({ length: 9 }, (_, i) => ({ ...first, id: first.id + i + 1, order: i + 2,
    name: { ja: `試作 ${i + 2}`, en: `Prototype ${i + 2}`, global: `Prototype ${i + 2}` } }))]
  const release = await buildMemoryRelease(data)
  const tiers = ['regular', 'key', 'subboss', 'boss'] as const
  const members: CastMember[] = Array.from({ length: 12 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}`, color: '#888888',
    franchise: 'priconne', tier: tiers[i % 4]!, face: { path: `enemies/c${i}-face.00000000.webp`, width: 32, height: 32 },
    art: { path: `enemies/c${i}-art.00000000.webp`, width: 32, height: 48 } }))
  const view: MasterView = { manifest: release.manifest, roster: buildRoster(data), chapters: buildChapters(scenarios), art: null,
    album: new Map(data.outfits.map(o => [String(o.id), outfitRowBase(o, data.characters.find(c => c.id === o.characterId))])) }
  return { view, cast: { members, byId: new Map(members.map((m) => [m.id, m])) } }
}

describe('the world map per tier (H35)', () => {
  it('gives Tier 1 its five continents, w1–w5, as before', async () => {
    const { view, cast } = await fixture()
    const tier1 = buildCampaign(view, cast, 1)
    expect(tier1.tier).toBe(1)
    expect(tier1.continents.map((c) => [c.id, c.levelStart])).toEqual([['w1', 1], ['w2', 11], ['w3', 21], ['w4', 31], ['w5', 41]])
    expect(buildCampaign(view, cast).continents).toEqual(tier1.continents)
    const region = tier1.region(tier1.continents[0]!.regions[0]!.id)!
    expect(region).toMatchObject({ tier: 1, levelStart: 1 })
    expect(region.title).toMatch(/· Lv 1–5$/)
  })

  it('gives Tier 2 the continents w6–w10, whose regions are Tier 2 chapters from lifetime level 51', async () => {
    const { view, cast } = await fixture()
    const tier2 = buildCampaign(view, cast, 2)
    expect(tier2.continents.map((c) => [c.id, c.levelStart])).toEqual([['w6', 51], ['w7', 61], ['w8', 71], ['w9', 81], ['w10', 91]])
    const region = tier2.region(tier2.continents[0]!.regions[0]!.id)!
    expect(region).toMatchObject({ id: 'w6-1-1', tier: 2, levelStart: 51 })
    expect(region.title).toMatch(/· T2 Lv 1–5$/)
    expect(region.nodes.filter((n) => n.kind !== 'camp').every((n) => n.level >= 51 && n.level <= 55)).toBe(true)
    expect(tier2.stageRegion('w6-1-1-s3')).toBe(region)
    expect(tier2.region('w1-1-1')).toBeNull()
    expect(tier2.color('w6-capital')).toBe(view.chapters.find((c) => c.order === 6)!.color)
  })

  it('caches one campaign per tier', async () => {
    const { view, cast } = await fixture()
    const tier1 = campaignOf(view, cast, 1), tier2 = campaignOf(view, cast, 2)
    expect(tier2).not.toBe(tier1)
    expect(campaignOf(view, cast, 1)).toBe(tier1)
    expect(campaignOf(view, cast, 2)).toBe(tier2)
    expect(tier2.continents[0]!.id).toBe('w6')
  })
})
