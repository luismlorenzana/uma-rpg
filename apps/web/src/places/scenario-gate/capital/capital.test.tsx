import { syntheticMasterData, buildMemoryRelease } from '@luismlorenzana/uma-data/testing'
import { outfitRowBase } from '@luismlorenzana/uma-kit/roster'
import { MotionRoot, setReducedMotion } from '@luismlorenzana/uma-kit/ui'
import { buildChapters, buildRoster, capitalRunChapter, capitalRunNodeId, newOwnedUma, newSave, placeById, type CapitalLanes, type CapitalRun, type FightResult as Result, type Save } from '@rpg/domain'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { domMax } from 'motion/react'
import type { ReactNode } from 'react'
import { MemoryRouter, useLocation } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildCampaign, type Campaign } from '../../../battle/campaign'
import { campaignFightSource } from '../../../battle/fight-source'
import type { CastMember } from '../../../content/cast'
import { nextLabel, TRACK_SOURCE } from '../../gallery/glass-view'
import { resetGame, useGame } from '../../../save/game'
import ScenarioGatePage, { FightRoute } from '../ScenarioGatePage'
import { FightResult } from '../FightResult'
import CapitalPage from './CapitalPage'
import { CapitalRunPage } from './CapitalRunPage'
import { NewRun } from './NewRun'
import { CAPITAL_WORDS, capitalAgain, capitalLine, capitalResultLine, capitalReturn, finalLock, generalLine, partyBlock, runCount, runName, runParties, startLabel } from './capital-view'

vi.mock('../../../../../../packages/domain/src/save/version', () => ({ SAVE_SCHEMA_VERSION: 37 }))
const live = vi.hoisted(() => ({ on: true }))
vi.mock('@rpg/domain', async (original) => ({ ...await original<typeof import('@rpg/domain')>(), capitalRunsLive: () => live.on }))
let campaign: Campaign
vi.mock('../../../battle/campaign', async (original) => ({ ...await original<typeof import('../../../battle/campaign')>(), CampaignGate: ({ children }: { children: (c: Campaign) => ReactNode }) => children(campaign) }))
vi.mock('../../../battle/CastFace', () => ({ CastFace: ({ castId }: { castId: string }) => <span>{castId}</span> }))
vi.mock('../ActiveParty', () => ({ ActivePartyBar: () => null }))
vi.mock('../FightScreen', () => ({ FightScreen: () => <div data-fight-screen /> }))
vi.mock('../../../save/db', () => ({ writeSaveRow: vi.fn(async () => undefined) }))
const NOW = '2026-11-04T12:00:00.000Z'
const place = placeById('scenario-gate')!

async function fixture(): Promise<Save> {
  const data = syntheticMasterData(), release = await buildMemoryRelease(data)
  const base = buildRoster(data)[0]!
  const roster = Array.from({ length: 40 }, (_, i) => ({ ...base, outfitId: String(81001 + i), name: `Uma ${i + 1}` }))
  const tiers = ['regular', 'key', 'subboss', 'boss'] as const
  const members: CastMember[] = Array.from({ length: 16 }, (_, i) => ({ id: `rival-${i}`, name: `Rival ${i}`, franchise: 'priconne', tier: tiers[i % 4]!, color: '#888888',
    face: { path: `enemies/${i}-face.00000000.webp`, width: 32, height: 32 }, art: { path: `enemies/${i}-art.00000000.webp`, width: 32, height: 48 } }))
  const album = new Map(roster.map((o) => [o.outfitId, { ...outfitRowBase(data.outfits[0]!, data.characters[0]), id: o.outfitId }]))
  campaign = buildCampaign({ manifest: release.manifest, roster, album, art: null, chapters: buildChapters(data.scenarios) }, { members, byId: new Map(members.map((m) => [m.id, m])) })
  const save = newSave('Capital test', NOW), world = save.tierWorlds['1']!
  roster.forEach((o, i) => { world.umas[o.outfitId] = { ...newOwnedUma(NOW, 'brawler'), ranks: { classes: { recruit: { rank: 10, exp: 0 }, brawler: { rank: 10, exp: 0 } } } }; world.parties[Math.floor(i / 5)]!.slots[i % 5] = o.outfitId })
  world.capitalRuns = []; world.capitals = { w1: { started: 2, won: 0, recent: [] } }
  return save
}
function run(s: Save, n: number, from = 0): CapitalRun {
  return { id: `w1-run${n}`, continent: 'w1', startedAt: NOW, lanes: Array.from({ length: 4 }, (_, i) => ({ party: from + i, umas: [...s.tierWorlds['1']!.parties[from + i]!.slots], generals: 0, finalAt: null })) as CapitalLanes }
}
function Location() { return <span data-location>{useLocation().pathname}</span> }
function show(s: Save, children: ReactNode) {
  useGame.setState({ save: s, status: 'ready', activeTier: 1, uid: null })
  return render(<MotionRoot features={domMax}><MemoryRouter initialEntries={['/battle/scenario-gate/capital/w1']}><Location />{children}</MemoryRouter></MotionRoot>)
}
beforeEach(() => { live.on = true; vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true); setReducedMotion(true) })
afterEach(() => { cleanup(); resetGame(); vi.unstubAllGlobals() })

describe('capital runs’ screens (H161)', () => {
  it('shows two runs, live continent names, parties, progress and pips', async () => {
    const s = await fixture(), a = run(s, 1), b = run(s, 2, 4)
    a.lanes.forEach((l, i) => { l.generals = [3, 2, 1, 1][i] as 1 | 2 | 3 })
    b.lanes.forEach((l, i) => { l.generals = 3; l.finalAt = i < 2 ? NOW : null })
    s.tierWorlds['1']!.capitalRuns = [a, b]
    campaign.continents[0]!.name = 'Synthetic capital'
    show(s, <CapitalPage campaign={campaign} continent={campaign.continents[0]!} place={place} />)
    expect(screen.getByRole('heading', { name: 'Synthetic capital · Capital' })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Run 1/ }).textContent).toContain('7/16')
    expect(screen.getByRole('button', { name: /Run 2/ }).textContent).toContain('14/16')
    expect(screen.getByText('Parties 5, 6, 7, 8')).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Finals: 2 of 4' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Run 2/ }))
    expect(document.querySelector('[data-location]')!.textContent).toBe('/battle/scenario-gate/capital/w1/run/w1-run2')
  })

  it('keeps the party picker inline, blocks full/run/healer/duplicate choices, and starts only with four', async () => {
    const s = await fixture(), world = s.tierWorlds['1']!
    world.capitalRuns = [run(s, 1, 4)]
    world.parties[8]!.slots = [...world.parties[4]!.slots]
    world.parties[9]!.slots = [...world.parties[0]!.slots]
    world.umas['81001']!.classId = 'cleric'; world.umas['81002']!.classId = 'paladin'
    show(s, <NewRun campaign={campaign} continent={campaign.continents[0]!} place={place} onClose={() => {}} />)
    const start = () => document.querySelector<HTMLButtonElement>('[data-capital-start]')!
    expect(start().disabled).toBe(true)
    fireEvent.click(screen.getAllByRole('button', { name: /Pick a party/ })[0]!)
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1)
    for (const [i, reason] of [[0, 'Two healers'], [4, 'In Run 1'], [10, 'Not full']] as const) {
      const b = document.querySelector<HTMLButtonElement>(`[data-capital-party="${i}"]`)!
      expect(b.disabled).toBe(true); expect(b.textContent).toContain(reason)
    }
    // Fix the current builds, then rerender the subscription by replacing the save.
    world.umas['81001']!.classId = 'brawler'; world.umas['81002']!.classId = 'brawler'
    cleanup()
    show(s, <NewRun campaign={campaign} continent={campaign.continents[0]!} place={place} onClose={() => {}} />)
    for (let lane = 0; lane < 4; lane++) {
      fireEvent.click(screen.getAllByRole('button', { name: /Pick a party/ })[0]!)
      if (lane > 0) expect(document.querySelector<HTMLButtonElement>('[data-capital-party="0"]')!.disabled).toBe(true)
      fireEvent.click(document.querySelector<HTMLButtonElement>(`[data-capital-party="${lane}"]`)!)
      expect(start().disabled).toBe(lane !== 3)
      expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1)
    }
    fireEvent.click(start())
    await waitFor(() => expect(useGame.getState().save?.tierWorlds['1']!.capitalRuns).toHaveLength(2))
    await waitFor(() => expect(document.querySelector('[data-location]')!.textContent).toBe('/battle/scenario-gate/capital/w1/run/w1-run3'))
  })

  it('locks finals at 7/12 and opens all four bosses at 12/12; previews the saved five', async () => {
    const s = await fixture(), r = run(s, 1), world = s.tierWorlds['1']!
    r.lanes.forEach((l, i) => { l.generals = [3, 2, 1, 1][i] as 1 | 2 | 3 }); world.capitalRuns = [r]
    // Changing a Party Hall row must not change the signed run’s faces.
    world.parties[1]!.slots = [...world.parties[6]!.slots]
    show(s, <CapitalRunPage campaign={campaign} continent={campaign.continents[0]!} place={place} runId={r.id} />)
    expect(document.querySelector('[data-capital-final]')!.textContent).toContain('7 of 12')
    expect(screen.getByText('Through ✓')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Mile Final · Fight' }))
    expect(screen.getByRole('dialog').textContent).toContain('General 3')
    expect(screen.getByRole('dialog').textContent).toContain('Rival')
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1)
    const next = structuredClone(s)
    fireEvent.click(screen.getByRole('button', { name: 'Fight' }))
    await waitFor(() => {
      expect(screen.queryByRole('alert')?.textContent).toBeUndefined()
      expect(useGame.getState().save?.tierWorlds['1']!.world.run.battle?.input.allies.map((a) => a.id)).toEqual(r.lanes[1]!.umas)
    })
    await waitFor(() => expect(document.querySelector('[data-location]')!.textContent).toBe('/battle/scenario-gate/fight'))
    expect(useGame.getState().save?.tierWorlds['1']!.world.activeParty).toBe(0)
    next.tierWorlds['1']!.capitalRuns![0]!.lanes.forEach((l) => { l.generals = 3 })
    cleanup()
    show(next, <CapitalRunPage campaign={campaign} continent={campaign.continents[0]!} place={place} runId={r.id} />)
    expect(screen.getAllByRole('button', { name: /Final · Final · Fight/ })).toHaveLength(4)
    fireEvent.click(screen.getByRole('button', { name: 'Sprint Final · Final · Fight' }))
    expect(screen.getByText('Wave 1')).toBeTruthy(); expect(screen.getByText('Wave 2')).toBeTruthy()
  })

  it('abandons through one confirmation, then keeps the sheet open on the new state', async () => {
    const s = await fixture(); s.tierWorlds['1']!.capitalRuns = [run(s, 1)]
    show(s, <CapitalRunPage campaign={campaign} continent={campaign.continents[0]!} place={place} runId="w1-run1" />)
    fireEvent.click(screen.getByRole('button', { name: 'Abandon run' }))
    expect(screen.getByText('Progress is lost')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Abandon' }))
    await waitFor(() => expect(screen.getByText('Run abandoned')).toBeTruthy())
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1)
    expect(useGame.getState().save?.tierWorlds['1']!.capitalRuns).toEqual([])
  })

  it('resolves run chapters after reload, titles their shared fights and keeps legacy capitals dark', async () => {
    await fixture()
    const chapter = campaign.region('w1-run2')!
    expect(chapter).toEqual(capitalRunChapter(campaign.continents[0]!, 'w1-run2', campaign.roster))
    expect(campaign.stageRegion('w1-run2-l2-g2')).toBe(chapter)
    expect(campaign.region('w6-run1')).toBeNull()
    const s = await fixture(), world = s.tierWorlds['1']!
    world.world.run.battle = { nodeId: 'w1-run2-l2-g2' } as typeof world.world.run.battle
    expect(campaignFightSource(world, chapter, null)).toMatchObject({ title: 'Mile Final', name: 'General 2', back: 'Back to the run' })
    live.on = false
    expect(campaign.region('w1-run2')).toBeNull()
    show(await fixture(), <ScenarioGatePage place={place} rest="capital/w1" />)
    expect(document.querySelector('[data-capital-page]')).toBeNull()
    expect(screen.queryByRole('button', { name: 'New run' })).toBeNull()
    expect(screen.getAllByRole('button', { name: /^Stage / })).toHaveLength(6)
  })

  it('renders result progress, retry/next choices, and returns the fourth final to the capital', async () => {
    const s = await fixture()
    const base: Result = { outcome: 'victory', chapterId: 'w1-run1', nodeId: capitalRunNodeId('w1-run1', 1, 2), rounds: 2, members: [], laurels: 0, shards: 0, tickets: 0, gearMarks: 0, classMarks: 0,
      capital: { runId: 'w1-run1', lane: 1, general: 2, won: false } }
    show(s, <FightResult campaign={campaign} chapter={campaign.region('w1-run1')!} result={base} onAgain={() => {}} againLabel="Next general" onMap={() => {}} />)
    expect(screen.getByText('General 2 of 3')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Next general' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Back to the run' })).toBeTruthy()
    const won = { ...base, capital: { runId: 'w1-run1', lane: 4, final: 4, won: true } }
    cleanup()
    show(s, <FightResult campaign={campaign} chapter={campaign.region('w1-run1')!} result={won} onMap={() => {}} />)
    expect(screen.getByText('Capital won · World I for 20')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Back to the capital' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Fight again' })).toBeNull()
    expect(capitalAgain(base)?.label).toBe('Next general')
    expect(capitalAgain({ ...base, outcome: 'loss' })?.label).toBe('Retry')
    expect(capitalAgain({ ...base, capital: { ...base.capital!, general: 3 } })).toBeNull()
    expect(capitalAgain(won)).toBeNull()
    expect(capitalResultLine({ ...base, capital: { runId: 'w1-run1', lane: 3, final: 3, won: false } })).toBe('Final 3 of 4')
    expect(capitalReturn('w1-run1-l4-final', true)).toBe('capital/w1')
    expect(capitalReturn(base.nodeId)).toBe('capital/w1/run/w1-run1')
  })

  it('has no run fight on an empty fight route', async () => {
    const s = await fixture()
    show(s, <FightRoute campaign={campaign} place={place} />)
    expect(screen.getByText('No fight is open.')).toBeTruthy()
  })

  it('shows World’s run progress, while retaining the old champions wording in the dark', () => {
    expect(nextLabel({ track: 'world', numeral: 1, have: 0, need: 4 })).toBe('Not run')
    expect(nextLabel({ track: 'world', numeral: 1, have: 2, need: 4, run: 'w1-run3' })).toBe('2 of 4 finals')
    expect(TRACK_SOURCE.world).toBe('Capital runs')
    live.on = false
    expect(nextLabel({ track: 'world', numeral: 1, have: 1, need: 3 })).toBe('1 of 3')
  })

  it('keeps view words compact and continent markers honest', async () => {
    const s = await fixture(), world = s.tierWorlds['1']!, r = run(s, 1)
    expect(capitalLine(world, 'w1')).toBe('Capital · 0 runs won')
    world.capitalRuns = [r]
    expect(capitalLine(world, 'w1')).toBe('Capital · open run')
    expect(partyBlock(world, 0, [null, null, null, null], 0, campaign.outfits, 1)).toBe('In Run 1')
    const words = [...Object.values(CAPITAL_WORDS), runName(r.id), runCount(r), runParties(r), generalLine(2), generalLine(3), finalLock(7), ...[0, 3, 4].map(startLabel)]
    for (const word of words) {
      expect(/\b(?:her|this|when|will|you|your|bonus)\b|\bis a\b/i.test(word), word).toBe(false)
      expect(word.replace(/\d+/g, '').split(/[\s·/,]+/).filter(Boolean).length, word).toBeLessThanOrEqual(6)
    }
  })
})
