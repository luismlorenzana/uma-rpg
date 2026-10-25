// The skill, support and class lines by generation (H59): classes v1's exactly as before, classes v2's from the engine's
// own rules (each half's hand, the Spell Blade's extra hit, the Summoner's farewell, the healers' `support15`). Numbers
// come from the domain, so H60's tuning moves them with it. Engine v16's (H70): a foe's twins Arm first, Pierce's words,
// a Skill Rank's factor on the power, three weapons in the blurbs.
import {
  BATTLE_REGEN_ROUNDS, RPG_ALL_NODES, RPG_SKILL_RANK_FACTOR, rpgClasses, rpgHand, rpgNode, rpgNodeSkill, rpgTreeNodes, type RpgProfile, type RpgSkillDef,
  type RpgSupport,
} from '@rpg/domain'
import { battleExtraHit } from '@rpg/domain/engine'
import { cleanup, render } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { CLASS_BLURB, classBlurbs, skillLine, supportText, WeaknessIcons } from './labels'

const STATUS: Record<string, string> = {
  'armor-break': 'Armor Break', 'mind-break': 'Mind Break', enfeeble: 'Enfeeble', shatter: 'Shatter', hex: 'Hex',
  brave: 'Brave', faith: 'Faith', aegis: 'Aegis', breaker: 'Breaker', clarity: 'Clarity',
}
/** Today's lines (before H59), kept here to pin classes v1. */
function supportV1(sup: RpgSupport | undefined): string {
  if (!sup) return ''
  return [
    sup.mend === 'hurt' ? 'heals the most hurt' : sup.mend === 'all' ? 'heals every ally' : '',
    sup.shield === 'threatened' ? 'Barrier on the most threatened' : sup.shield === 'all' ? 'Barrier on every ally' : '',
    sup.cleanse ? 'cleanses' : '', sup.revive ? 'revives the fallen' : '', sup.drain ? 'drains HP' : '',
    sup.bless ? 'Aegis on every ally' : '', sup.curse ? 'Enfeebles the foes it hits' : '',
  ].filter(Boolean).join(', ')
}
function lineV1(profile: Pick<RpgProfile, 'classId' | 'tier'>, skill: RpgSkillDef): string {
  const hand = rpgHand(profile, 14)
  const per = skill.target === 'all' ? 'every foe' : skill.target === 'random' ? 'random foes' : 'one foe'
  const total = skill.hits.reduce((sum, h) => sum + h.power, 0) * hand.power
  const mp = Math.max(1, Math.round(skill.mp * hand.mp)) * profile.tier
  const extra = skill.status ? ` · ${STATUS[skill.status.key]} ${skill.status.stacks}${skill.status.to === 'allies' ? ' to all' : skill.status.to === 'foes' ? ' on all foes' : ''}`
    : skill.summon ? ` · lingers ${skill.summon.linger}×` : ''
  const support = supportV1(skill.support)
  return `${per} · ${skill.hits.length} hit${skill.hits.length === 1 ? '' : 's'} · ${total.toFixed(1)}× · ${mp} MP${extra}${support ? ` · ${support}` : ''}`
}
const node = (id: string) => rpgNode(id)!

describe('classes v1\'s lines (H59)', () => {
  it('reads every node of the five classes exactly as before, at any tier', () => {
    const v1 = RPG_ALL_NODES.filter((n) => rpgClasses(14).includes(n.classId))
    expect(v1).toHaveLength(600)
    for (const n of v1) for (const tier of [1, 2]) expect(skillLine({ classId: n.classId, tier }, n.skill, 14), n.id).toBe(lineV1({ classId: n.classId, tier }, n.skill))
  })
  it('keeps today\'s blurbs and the live table', () => {
    expect(classBlurbs(14).spellblade).toBe('Three Arms and two Tomes: every act is a blade and a spell, each at half strength.')
    expect(classBlurbs(14).summoner).toBe('Three Tomes and two Arms: each summon strikes, stays, and strikes again when the next one comes.')
    expect(CLASS_BLURB).toBe(classBlurbs())
  })
})

describe('classes v2\'s lines (H59)', () => {
  const blade = { classId: 'spellblade', tier: 1 } as const
  const summoner = { classId: 'summoner', tier: 1 } as const

  it('counts a Spell Blade\'s Arms skill at n + 1 hits at her Arms hand, her Tome skill as it is at her Tome hand', () => {
    const hand = rpgHand(blade, 15)
    for (const n of rpgTreeNodes('spellblade-bow')) {
      const hits = battleExtraHit(n.skill).hits.length
      expect(hits).toBe(n.skill.hits.length + 1)
      const total = (n.skill.hits.reduce((s, h) => s + h.power, 0) * hand.arms).toFixed(1)
      expect(skillLine(blade, n.skill, 15), n.id).toMatch(new RegExp(`^(one foe|every foe|random foes) · ${hits} hits · ${total}× · `))
    }
    const tome = node('spellblade-tome-light.1').skill
    expect(skillLine(blade, tome, 15)).toContain(` · ${tome.hits.length} hit${tome.hits.length === 1 ? '' : 's'} · ${(tome.hits.reduce((s, h) => s + h.power, 0) * hand.tome).toFixed(1)}× · `)
    // An Attack-shaped one-hit Arms skill lands as two.
    expect(skillLine(blade, node('spellblade-greatsword.1').skill, 15)).toContain(' · 2 hits · ')
  })

  it('says a Summoner\'s Tome summon lingers, then strikes every foe, and her Arms summon strikes once', () => {
    const hand = rpgHand(summoner, 15)
    const tome = node('summoner-tome-fire.1').skill, arms = node('summoner-greatsword.1').skill
    expect(skillLine(summoner, tome, 15)).toContain(` · ${(tome.hits.reduce((s, h) => s + h.power, 0) * hand.tome).toFixed(1)}× · `)
    expect(skillLine(summoner, tome, 15)).toMatch(/ · lingers, then strikes every foe$/)
    expect(skillLine(summoner, arms, 15)).toMatch(/ · strikes once$/)
    // Her lines carry no support any more (§3.2); v1's did.
    const light = node('summoner-tome-light.3').skill
    expect(skillLine(summoner, light, 14)).toMatch(/heals/)
    expect(skillLine(summoner, light, 15)).not.toMatch(/heals|Barrier|drains/)
  })

  it('reads the healers\' v15 support and names its new parts', () => {
    const cleric = { classId: 'cleric', tier: 1 } as const, paladin = { classId: 'paladin', tier: 1 } as const
    expect(skillLine(cleric, node('cleric-tome-light.1').skill, 15)).toContain(`heals the most hurt, Regen ${BATTLE_REGEN_ROUNDS} rounds, cleanses`)
    expect(skillLine(cleric, node('cleric-tome-dark.1').skill, 15)).toContain('drains 30%')
    expect(skillLine(paladin, node('paladin-tome-ice.1').skill, 15)).toContain('heals the most hurt, Barrier on every ally, cleanses')
    expect(skillLine(paladin, node('paladin-greatsword.1').skill, 15)).toContain('Barrier on the most threatened, Aegis on the Barriered')
    expect(supportText({ share: 0.3, drain: 0.3 }, 14)).toBe('drains HP')
    expect(supportText({ share: 0.3, drain: 0.3 }, 15)).toBe('drains 30%')
  })

  it('has six blurbs, one line each', () => {
    expect(classBlurbs(15)).toEqual({
      brawler: 'Five Arms, one heavy act a turn.',
      mage: 'Five Tomes, one full cast a turn.',
      spellblade: 'Three Arms and two Tomes: a blade and a spell each turn, the blade striking twice.',
      summoner: 'Three Tomes and two Arms: a Tome summon that lingers and strikes every foe as it leaves, and an Arms summon.',
      paladin: 'Three Arms and two Tomes: Barriers and Aegis on the party, from her ATK.',
      cleric: 'Three Tomes and two Arms: mends, Regen and cleanses for the party, from her M.ATK.',
    })
  })
})

describe('engine v16\'s lines and weaknesses (H70)', () => {
  afterEach(cleanup)
  /** The icons' order as drawn: a weapon glyph (filled) or an element glyph (stroked), and the aria label. */
  const drawn = (engine: number) => {
    const { container } = render(createElement(WeaknessIcons, { weaknesses: { weapons: ['lance'], elements: ['lightning'] }, engine }))
    const icons = [...container.querySelectorAll('svg')].map((svg) => (svg.getAttribute('fill') === 'currentColor' ? 'weapon' : 'element'))
    return { icons, label: container.firstElementChild!.getAttribute('aria-label') }
  }

  it('lists a foe\'s twins Arm first from v16, and today\'s order (elements first) before', () => {
    expect(drawn(16)).toEqual({ icons: ['weapon', 'element'], label: 'Weak to Lance, Lightning' })
    expect(drawn(15)).toEqual({ icons: ['element', 'weapon'], label: 'Weak to Lightning, Lance' })
    // Twilight: two Arms, Bow then Katana.
    const { container } = render(createElement(WeaknessIcons, { weaknesses: { weapons: ['bow', 'katana'], elements: [] }, engine: 16 }))
    expect(container.firstElementChild!.getAttribute('aria-label')).toBe('Weak to Bow, Katana')
  })

  it('says a Pierce cuts through the shield from v16, and only then', () => {
    const blade = { classId: 'spellblade', tier: 1 } as const
    const pierce = rpgNodeSkill(rpgNode('spellblade-katana.3b')!, 16)
    expect(pierce.special).toBe('pierce')
    expect(skillLine(blade, pierce, 16)).toMatch(/^one foe · 2 hits · .* MP · cuts through the shield$/)
    // The Brawler's Katana side had a pierce in v15 too: its v15 line keeps today's words.
    const v15 = rpgNode('brawler-katana.3a')!.skill
    expect(v15.special).toBe('pierce')
    expect(skillLine({ classId: 'brawler', tier: 1 }, v15, 15)).not.toContain('cuts through')
    expect(skillLine({ classId: 'brawler', tier: 1 }, v15, 16)).toContain(' · cuts through the shield')
    expect(skillLine(blade, rpgNodeSkill(rpgNode('spellblade-katana.3')!, 16), 16)).not.toContain('cuts through')
  })

  it('shows a Rank 5 skill at ×1.05 its power, and Rank 1 at ×0.95', () => {
    const brawler = { classId: 'brawler', tier: 1 } as const
    const sunder = rpgNode('brawler-greatsword.3')!.skill
    const total = sunder.hits.reduce((n, h) => n + h.power, 0) * rpgHand(brawler, 16).arms
    const power = (line: string) => Number(/ · ([\d.]+)× · /.exec(line)![1])
    expect(RPG_SKILL_RANK_FACTOR[4]).toBe(1.05)
    expect(power(skillLine(brawler, sunder, 16, RPG_SKILL_RANK_FACTOR[4]))).toBe(Number((total * 1.05).toFixed(1)))
    expect(power(skillLine(brawler, sunder, 16, RPG_SKILL_RANK_FACTOR[0]))).toBe(Number((total * 0.95).toFixed(1)))
    expect(skillLine(brawler, sunder, 16)).toBe(skillLine(brawler, sunder, 16, 1))
  })

  it('counts three weapons in the blurbs', () => {
    expect(classBlurbs(16).brawler).toBe('Three Arms, one heavy act a turn.')
    expect(classBlurbs(16).cleric).toBe('Two Tomes and an Arm: mends, Regen and cleanses for the party, from her M.ATK.')
    expect(classBlurbs(15).brawler).toBe('Five Arms, one heavy act a turn.')
  })
})
