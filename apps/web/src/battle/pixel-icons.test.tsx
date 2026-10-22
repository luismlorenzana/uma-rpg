import atlas from '@luismlorenzana/uma-art/ui/atlas.json'
import { ACHIEVEMENTS, RIFT_FRONTS, RPG_CLASSES, rpgTreeNodes, type BattleStatus } from '@rpg/domain'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { CLASS_LABEL, skillLine, STATUS_LABEL } from './labels'
import { AchievementBadge, ClassEmblem, FrontCrest, StatusChips, StatusGlyph } from './pixel-icons'

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

describe('the Rift\'s crests and badges (uma-art 2.11.0)', () => {
  const frames: Record<string, { x: number; y: number; w: number; h: number }> = atlas.frames
  it('finds every catalog badge and front crest on the pinned ui sheet', () => {
    for (const a of ACHIEVEMENTS) expect(frames[a.badge], a.id).toMatchObject({ w: 24, h: 24 })
    for (const f of RIFT_FRONTS) expect(frames[`front/${f}`], f).toMatchObject({ w: 16, h: 16 })
  })
  it('names a front crest and draws its frame at native size or a whole scale', async () => {
    const iron = frames['front/iron']!, horde = frames['front/horde']!
    await renderIcons(<><FrontCrest front="iron" /><FrontCrest front="horde" scale={2} /></>, (host) => {
      const [a, b] = [...host.querySelectorAll<HTMLElement>('[role="img"]')]
      expect(a!.getAttribute('aria-label')).toBe('Iron front')
      expect(a!.style.width).toBe('16px'); expect(a!.style.backgroundPosition).toBe(`${-iron.x}px ${-iron.y}px`)
      expect(b!.getAttribute('aria-label')).toBe('Horde front')
      expect(b!.style.width).toBe('32px'); expect(b!.style.height).toBe('32px')
      expect(b!.style.backgroundSize).toBe(`${atlas.width * 2}px ${atlas.height * 2}px`)
      expect(b!.style.backgroundPosition).toBe(`${-horde.x * 2}px ${-horde.y * 2}px`)
    })
  })
  it('draws a badge as decoration, at 4× with a scaled background, dimmed when not earned', async () => {
    const seal = frames['achievement/seal-arcane']!
    await renderIcons(<><AchievementBadge id="t1-seal-arcane" scale={4} /><AchievementBadge id="untouched-duel" dim /><AchievementBadge id="nope" /></>, (host) => {
      const [big, small] = [...host.querySelectorAll<HTMLElement>('span')]
      expect(host.querySelectorAll('span')).toHaveLength(2)
      expect(big!.getAttribute('aria-hidden')).toBe('true')
      expect(big!.style.width).toBe('96px'); expect(big!.style.height).toBe('96px')
      expect(big!.style.backgroundSize).toBe(`${atlas.width * 4}px ${atlas.height * 4}px`)
      expect(big!.style.backgroundPosition).toBe(`${-seal.x * 4}px ${-seal.y * 4}px`)
      expect(big!.style.imageRendering).toBe('pixelated')
      const untouched = frames['achievement/untouched']!
      expect(small!.style.width).toBe('24px'); expect(small!.style.backgroundPosition).toBe(`${-untouched.x}px ${-untouched.y}px`)
      expect(small!.className).toContain('opacity-40')
    })
  })
})
