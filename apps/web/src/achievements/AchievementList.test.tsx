import { newSave, newTierWorld, type Save } from '@rpg/domain'
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { AchievementList } from './AchievementList'

const NOW = '2026-10-21T12:00:00.000Z'
const rows = () => [...document.querySelectorAll<HTMLElement>('[data-achievement]')]
const texts = () => rows().map((r) => [...r.querySelectorAll(':scope > span:last-child > span')].map((s) => s.textContent))
const count = () => document.querySelector('[data-achievements] h2')?.nextElementSibling?.textContent

afterEach(cleanup)

describe('the Account\'s achievements', () => {
  it('shows Tier 1\'s seals and Rift Conquered and the nine titles on a fresh save, none earned', () => {
    render(<AchievementList save={newSave('Luis', NOW)} />)
    expect(document.querySelector('[data-achievements] h2')?.textContent).toBe('Achievements')
    expect(count()).toBe('0 of 14')
    expect(rows()).toHaveLength(14)
    expect(rows().filter((r) => r.dataset.earned)).toHaveLength(0)
    expect(texts().slice(0, 6)).toEqual([
      ['Iron Seal · Tier 1', 'Win the Iron front’s champion'], ['Arcane Seal · Tier 1', 'Win the Arcane front’s champion'],
      ['Duel Seal · Tier 1', 'Win the Duel front’s champion'], ['Horde Seal · Tier 1', 'Win the Horde front’s champion'],
      ['Rift Conquered · Tier 1', 'Win the Convergence'], ['Iron Will', 'Seal Iron with no magic dealt'],
    ])
    // Badges are decorative, dimmed until earned; Untouched shows its front's crest beside it.
    const untouched = rows().find((r) => r.dataset.achievement === 'untouched-arcane')!
    const art = untouched.querySelector<HTMLElement>('[aria-hidden="true"]')!
    expect(art.className).toContain('opacity-40')
    expect(art.querySelectorAll('span')).toHaveLength(2)
    expect(art.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Arcane front')
  })

  it('adds Tier 2\'s five once the save has its world', () => {
    const save = newSave('Luis', NOW)
    render(<AchievementList save={{ ...save, tierWorlds: { ...save.tierWorlds, '2': newTierWorld(NOW, 0) } }} />)
    expect(rows()).toHaveLength(19)
    expect(count()).toBe('0 of 19')
    expect(rows().map((r) => r.dataset.achievement).slice(5, 10)).toEqual(['t2-seal-iron', 't2-seal-arcane', 't2-seal-duel', 't2-seal-horde', 't2-rift-conquered'])
  })

  it('leads with the earned ones, newest first, with the date and the run', () => {
    const save: Save = newSave('Luis', NOW)
    save.account.achievements = {
      bestiary: { at: '2026-10-19T12:00:00.000Z', run: null },
      't1-seal-iron': { at: NOW, run: 't1-r1' },
    }
    render(<AchievementList save={save} />)
    expect(count()).toBe('2 of 14')
    expect(rows().slice(0, 3).map((r) => r.dataset.achievement)).toEqual(['t1-seal-iron', 'bestiary', 't1-seal-arcane'])
    expect(texts().slice(0, 2)).toEqual([['Iron Seal · Tier 1', '21 Oct · Tier 1 run 1'], ['Bestiary', '19 Oct']])
    expect(rows()[0]!.dataset.earned).toBe('true')
    expect(rows()[0]!.querySelector('[aria-hidden="true"]')!.className).not.toContain('opacity-40')
    expect(rows().filter((r) => r.dataset.earned)).toHaveLength(2)
  })
})
