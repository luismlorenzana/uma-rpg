// "The Wilds are rebuilt" in §14.6's words (H80), from H78's own migration of its fixtures: the fully built roster's
// numbers, the zero parts dropped (a fresh player's upgrades), the Umas sorted by tickets with the banked line, the floor's
// line, and the Account's row.
import type { TierGrant } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { toV28 } from '../../../../packages/domain/src/save/migrations'
import { floorWorld, freshPlayer, fullRoster } from '../../../../packages/domain/src/save/v28.fixture'
import { grantLines, grantRow, UNKNOWN_UMA } from './grant-lines'

const grantOf = (world: Record<string, unknown>): TierGrant => (toV28(world, 1) as { grant: TierGrant }).grant
const named = (id: string) => ({ name: `Uma ${id}`, trade: 'Forest · Armorer' })

describe('the first launch\'s sheet', () => {
  it('words the fully built roster as §14.6 does', () => {
    const lines = grantLines(grantOf(fullRoster()), named)
    expect(lines.lead).toBe('Ten professions, each in its own place. Every Uma starts again at Craft Lv 1, and the time they worked comes back as Speed Tickets.')
    expect(lines.tickets).toBe('+63,800 Speed Tickets')
    expect(lines.hours).toBe('31,900 hours of work: every gather, refine, craft and cut your Umas did')
    expect(lines.went).toBe('5,400 gear pieces · 2,500 Star Gems · 22 facility upgrades. Their making is in those hours.')
    expect(lines.back).toBe('7,150 Laurels · 66 refined items · your Warehouse’s 2,066 items, now the new materials (Ores → Copper and Iron …)')
    expect(lines.stays).toBe('Uma Levels, classes and Class Ranks, Laurels, every ticket you had')
    expect(lines.footer).toBe('A ticket takes 30 minutes off a running job: Finish on a job, or Finish all on a place.')
    expect(lines.floor).toBeNull()
  })

  it('sorts the Umas by tickets, a banked one with her EXP past Lv 50', () => {
    const { umas } = grantLines(grantOf(fullRoster()), named)
    expect(umas).toHaveLength(40)
    expect(umas.map((u) => u.tickets)).toEqual([...umas.map((u) => u.tickets)].sort((a, b) => b - a))
    expect(umas[0]).toMatchObject({ trade: 'Forest · Armorer', line: 'Craft Lv 50 → 1 · 1,970 (30,000 EXP past Lv 50)' })
    expect(umas.at(-1)!.line).toBe('Craft Lv 50 → 1 · 1,470')
  })

  it('names an outfit master data lacks "An Uma"', () => {
    expect(grantLines(grantOf(fullRoster()), () => undefined).umas[0]).toMatchObject({ name: UNKNOWN_UMA, trade: null })
  })

  it('pays the floor\'s line when it paid more than the Umas', () => {
    expect(grantLines(grantOf(floorWorld()), named).floor).toBe('Pieces whose makers have left this world · +22,553')
  })

  it('leaves out a part whose numbers are all zero, and a zero inside a part', () => {
    const grant: TierGrant = { tickets: 528, floor: 0, umas: { 101: { level: 21, exp: 0, tickets: 528 }, 102: { level: 1, exp: 0, tickets: 0 } },
      deleted: { gear: 0, gems: 0, upgrades: 0 }, back: { laurels: 0, items: 0, stock: 12 }, seen: false }
    const lines = grantLines(grant, named)
    expect(lines.went).toBeNull()
    expect(lines.back).toBe('your Warehouse’s 12 items, now the new materials (Ores → Copper and Iron …)')
    expect(lines.umas.map((u) => u.line)).toEqual(['Craft Lv 21 → 1 · 528'])
    expect(lines.hours.startsWith('264 hours')).toBe(true)
    // A fresh player's: no facility upgrades, no Laurels or refined items back.
    const fresh = grantLines(grantOf(freshPlayer()), named)
    expect(fresh.went).toBe('24 gear pieces · 10 Star Gems. Their making is in those hours.')
    expect(fresh.back).toBe('your Warehouse’s 45 items, now the new materials (Ores → Copper and Iron …)')
    expect(fresh.tickets).toBe('+720 Speed Tickets')
  })

  it('keeps an Account row with the world\'s grant', () => {
    expect(grantRow(grantOf(fullRoster()))).toEqual({ label: 'The Tier rework’s grant', value: '63,800 Speed Tickets' })
  })
})
