import atlas from '@luismlorenzana/uma-art/ui/atlas.json'
import { RPG_CLASSES, rpgTreeNodes, type BattleStatus } from '@rpg/domain'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { CLASS_LABEL, skillLine, STATUS_LABEL } from './labels'
import { ClassEmblem, StatusChips, StatusGlyph } from './pixel-icons'

async function renderIcons(content: React.ReactNode, check: (host: HTMLElement) => void) {
  const host = document.createElement('div'), root = createRoot(host)
  document.body.append(host); vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  try { await act(async () => root.render(content)); check(host) }
  finally { await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals() }
}
describe('class emblems and status glyphs', () => {
  it('keeps all five full class names alongside decorative, native-size emblems', async () => {
    await renderIcons(<>{RPG_CLASSES.map((c) => <button key={c}><ClassEmblem classId={c} />{CLASS_LABEL[c]}</button>)}</>, (host) => {
      expect([...host.querySelectorAll('button')].map((b) => b.textContent)).toEqual(RPG_CLASSES.map((c) => CLASS_LABEL[c]))
      const emblems = host.querySelectorAll<HTMLElement>('[aria-hidden="true"]')
      expect(emblems).toHaveLength(5)
      for (const [i, e] of [...emblems].entries()) {
        expect(e.style.width).toBe('24px'); expect(e.style.height).toBe('24px')
        expect(e.style.backgroundSize).toBe(`${atlas.width}px ${atlas.height}px`)
        expect(e.style.backgroundPosition).toBe(`${-i * 24}px 0px`)
        expect(e.style.imageRendering).toBe('pixelated')
      }
    })
  })
  it('renders every published status at 12px, without replacing the skill line name', async () => {
    const keys = Object.values(atlas.frames).filter((f) => f.group === 'status').map((f) => f.key as keyof typeof STATUS_LABEL)
    await renderIcons(<>{keys.map((key) => <StatusGlyph key={key} status={key} />)}</>, (host) => {
      const glyphs = host.querySelectorAll<HTMLElement>('span')
      expect(glyphs).toHaveLength(10)
      for (const g of glyphs) { expect(g.style.width).toBe('12px'); expect(g.style.height).toBe('12px'); expect(g.style.imageRendering).toBe('pixelated') }
    })
    for (const node of rpgTreeNodes('cleric-greatsword')) {
      expect(skillLine({ classId: 'cleric', tier: 1 }, node.skill)).toContain('Armor Break')
    }
  })
  it('labels persisted statuses with their full names and stacks, with text fallback for enemy-only kinds', async () => {
    const statuses: BattleStatus[] = [
      { kind: 'armor-break', stacks: 2, turns: 2 }, { kind: 'brave', stacks: 3, turns: 1 },
      { kind: 'burn', stacks: 1, turns: 2 }, { kind: 'power-up', stacks: 1, turns: 2 },
      { kind: 'hex', stacks: 1, turns: 0 }, { kind: 'faith', stacks: 0, turns: 1 },
    ]
    await renderIcons(<StatusChips statuses={statuses} />, (host) => {
      const chips = [...host.querySelectorAll('[role="img"]')]
      expect(chips.map((c) => c.getAttribute('aria-label'))).toEqual(['Armor Break 2', 'Brave 3', 'Burn 1', 'Power-up 1'])
      expect(chips.map((c) => c.textContent)).toEqual(['2', '3', 'Burn1', 'Power-up1'])
      expect(chips[0]!.querySelector('span')?.getAttribute('aria-hidden')).toBe('true')
      expect(host.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Statuses')
    })
    await renderIcons(<StatusChips statuses={[]} />, (host) => expect(host.children).toHaveLength(0))
  })
})
