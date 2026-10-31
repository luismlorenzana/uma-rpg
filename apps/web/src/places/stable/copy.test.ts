// H117's executable profile wording list: exact examples, a broad view-model sweep and a small JSX prose guard.
import type { AptitudeGrade, Aptitudes } from '@luismlorenzana/uma-data'
import {
  ACCESSORY_FAMILY_LABEL, ARMOR_LABEL, ARMOR_SLOT_LABEL, BATTLE_ENGINE_VERSION, EFFECT_LABEL, FLOURISH_NAMES, KEY_LABELS,
  KNACK_LABEL, madeName, newGrades, newOwnedUma, newTierWorld, RPG_ALL_CLASSES, RPG_CLASSES, rpgClassName, RPG_ROOT_NAME, RPG_TIER0_SKILL, STRIDE_LABEL, umaBattleSheet, WEAPON_LABEL,
  type AccessoryFamily, type RosterOutfit, type RpgFlourish,
} from '@rpg/domain'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import { mapNodeValue, nodeSheet, setAllLines, setAllPlan } from '../observatory/stars-view'
import * as copy from './copy'
import { accessoryChoices, accessoryTile } from './gear-equip'
import { accessoryGradeLine, weaponGradeLine } from './gear-v3'
import { gearTiles, raiseAllPlan, raiseSheet } from './gear-view'
import { rankText } from './class-sheets'
import { classesSheet, classTiles, handWord, limitView, promotionLine, promotionSheet } from './class-view'
import { flourishLine, flourishSheet, templateTab } from './template-view'

const NAMES = [
  ...Object.values(WEAPON_LABEL), ...Object.values(ACCESSORY_FAMILY_LABEL), ...Object.values(ARMOR_SLOT_LABEL),
  ...Object.values(ARMOR_LABEL), ...Object.values(EFFECT_LABEL), ...Object.values(FLOURISH_NAMES), ...Object.values(STRIDE_LABEL),
  ...Object.values(KNACK_LABEL), ...Object.values(KEY_LABELS), ...RPG_CLASSES, ...RPG_ALL_CLASSES.map((c) => rpgClassName(c)),
  ...Object.values(RPG_ROOT_NAME), ...Object.values(RPG_TIER0_SKILL), 'Warrior Dojo', 'Mage Tower', 'Spellblade Salle', 'Summoner Circle', 'Healer Sanctum',
  'Spell Blade', 'Greatsword', 'Thunder Tome', 'Even pace', 'Late reserve', 'Clean break', 'Weapon Forge', 'Tome Forge',
  'Charm Forge', 'Armor Fittings G5', 'Arms Gem G10', 'Accessory Setting', 'Armor Fittings', 'Arms Gem', 'Tome Ink', 'Planet Jewel', 'Moon Jewel', 'Clever Spellwright', 'Clever Spellfencer',
  'Aster', 'Beryl', 'Fire', 'Blizzard', 'Thunder', 'Dark', 'Light', 'Physical', 'Magical',
].sort((a, b) => b.length - a.length)
const numberPattern = /[+−-]?\d[\d,.]*(?:%|×\d+(?:\.\d+)?)?/g
const banned = /\b(?:her|this|when|will|you|your|bonus)\b|\bis a\b/i

export function copyWords(value: string): string[] {
  let clean = value
  for (const name of NAMES) clean = clean.replaceAll(name, ' ')
  return clean.replace(numberPattern, ' ').split(/[\s·→\/>≥+★(),:]+/).filter(Boolean)
}
function check(value: string, source: string, limit = 6) {
  expect(banned.test(value), `${source}: banned word in “${value}”`).toBe(false)
  expect(copyWords(value).length, `${source}: ${copyWords(value).length} words in “${value}”`).toBeLessThanOrEqual(limit)
}
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(strings)
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings)
  return []
}

describe('the profile wording list (H117)', () => {
  it('pins every listed fact and action', () => {
    expect(copy.level(40)).toBe('Lv 40')
    expect(copy.exp(1200, 2400)).toBe('1,200/2,400')
    expect(copy.exp(301, null)).toBe('Max · 301 EXP')
    expect(copy.classRank(40)).toBe('R40')
    expect(copy.tier0Rank(7)).toBe('R7/10')
    expect(copy.waitingExp(17400)).toBe('+17,400 EXP waiting')
    expect(copy.craftLevel(10)).toBe('Craft 10')
    expect(copy.gate('level', 36)).toBe('Lv 36')
    expect(copy.gate('rank', 30)).toBe('R30')
    expect(copy.gate('craft', 21)).toBe('Craft 21')
    expect(copy.nodeGate('Planet I')).toBe('Planet I first')
    expect(copy.grade(8)).toBe('G8')
    expect(copy.gradeStep(8, 9)).toBe('G8 → G9')
    expect(copy.maxGrade()).toBe('G10 · Max')
    expect(copy.might(44)).toBe('Might 44')
    expect(copy.armorStat('DEF', 32)).toBe('DEF 32')
    expect(copy.armorHalf('physical')).toBe('Physical')
    expect(copy.accessoryEffect('bell', 8, 1)).toBe('M.ATK +8')
    expect(copy.accessoryEffect('pendant', 8, 1)).toBe('ATK +8')
    expect(copy.accessoryEffect('bell', 0, 1)).toBe('Off')
    expect(copy.staleKind('Greatsword')).toBe('Greatsword not held')
    expect(copy.signature(10, true)).toBe('★ Signature · ATK/M.ATK +10 · Worn')
    expect(copy.signature(10, false)).toBe('★ Signature · ATK/M.ATK +10 · Not worn')
    expect(copy.flourish('even-pace', true)).toBe('★ Flourish · Even pace · 1%/round · max 4% · On')
    expect(copy.moonNode('I', 'Evasion +2.4%', 'Open')).toBe('★ Moon I · Evasion +2.4% · Open')
    expect(copy.calling('Warrior')).toBe('Calling · Warrior · fixed')
    expect(copy.callingOnUnlock('Spellblade')).toBe('Calling on unlock · Spellblade')
    expect(copy.worksAs(['Warrior', 'Brawler'])).toBe('Works as · Warrior, Brawler')
    expect(copy.flourishNow(true, 'Mage')).toBe('Now · On')
    expect(copy.flourishNow(false, 'Sorcerer')).toBe('Now · Off · as Sorcerer')
    expect(copy.offAs('Mage')).toBe('Off · as Mage')
    expect(copy.signatureFirst).toBe('G1 first')
    expect(copy.atLevel('ATK/M.ATK +5', 50)).toBe('ATK/M.ATK +5 · Lv 50')
    expect(copy.growth([{ stat: 'Speed', percent: 20 }, { stat: 'Power', percent: 10 }])).toBe('Speed +20% · Power +10%')
    expect(copy.racingSkill).toBe('Racing skill')
    expect(copy.extraStatsCount(17)).toBe('Open 17/22')
    expect(copy.extraStatsRow(13, 2)).toBe('Open 13/22 · 2 ready')
    expect(copy.extraStatsRow(4, 0)).toBe('Open 4/22')
    expect(copy.extraStats(13, 2)).toBe('Extra Stats · Open 13/22 · 2 ready')
    expect(copy.setLine('Moon Jewel IV', 'Guard IV', 'DEF/M.DEF +8')).toBe('Moon Jewel IV → Guard IV · DEF/M.DEF +8')
    expect(copy.nodeValue({ kind: 'planet', value: 21 })).toBe('+21 · all six')
    expect(copy.nodeValue({ kind: 'vigor', hp: 100, mp: 20 })).toBe('HP +100 · MP +20')
    expect(copy.nodeValue({ kind: 'guard', value: 4 })).toBe('DEF/M.DEF +4')
    expect(copy.itemCount('Arms Gem G10', 1, 3)).toBe('Arms Gem G10 ×1 · 3 held')
    expect(copy.reading('Mage', 'Pace A · Wit 102 ≥ Power 90')).toBe('Mage · from Pace A · Wit 102 ≥ Power 90')
    expect(copy.reading('Spell Blade', 'Picked')).toBe('Spell Blade · Picked')
    expect(copy.trade('Forest', 'Armorer')).toBe('Forest · Armorer')
    expect(copy.profileFacts).toEqual({ party: 'Party', work: 'Work', details: 'Details' })
    expect(copy.party(null)).toBe('No party')
    expect(copy.party('fighting')).toBe('Fighting')
    expect(copy.party(3)).toBe('Party 3')
    expect(copy.work(null)).toBe('Idle')
    expect(copy.work('Mine', 'done')).toBe('Mine · Done')
    expect(copy.statParts(42, 8, 3, 1)).toBe('base 42 · gear 8 · Stars 3 · ★ 1')
    expect(copy.statParts(42, 0, 0, 0)).toBe('base 42')
    expect(copy.coreSource(102, 20)).toBe('102 · +20%')
    expect(copy.coreSource(90, 0)).toBe('90')
    expect(copy.gradeGate(1, { grade: 2, craft: 6 })).toBe('G1 open · G2 at Craft 6')
    expect(copy.statFormulaLines).toHaveLength(7)
    expect(copy.equipped(7, 7)).toBe('Equipped 7/7')
    expect(copy.line('B', 'Impale')).toBe('Line B · Impale')
    expect(copy.skillRank(3, 14)).toBe('Rank 3 · next R14')
    expect(copy.depth(4, 'B')).toBe('Depth 4 · Line B')
    expect(copy.bond(2, 60)).toBe('Bond 2/10 · Strength 60%')
    expect(copy.bondLevel(2)).toBe('Bond 2/10')
    expect(copy.heroBond()).toBe('Hero · Strength 100%')
    expect(copy.limitStart(0, 12)).toBe('Limit start 0/12')
    expect(copy.mp(296, 15)).toBe('MP 296 · +15/round')
    expect(copy.hand(.72, .44)).toBe('Hand · Arms ×0.72 · Tome ×0.44')
    expect(copy.standardPreset(true)).toBe('Standard preset · On')
    expect(copy.promoteRank(10)).toBe('R10 · Promote')
    expect(copy.opens('R40')).toBe('Opens · R40')
    expect(copy.weaponSlot(3, 'arms')).toBe('Slot 3 · Arms')
    expect(copy.weaponSlot(3, 'any')).toBe('Slot 3 · Any')
    expect(copy.bondNext(3, 12)).toBe('Next · 3/12')
    expect(copy.heroName('Uma F')).toBe('Hero · Uma F')
    expect(copy.limitLine({ kind: 'none' })).toBe('None')
    expect(copy.limitLine({ kind: 'hero', name: 'Rend' })).toBe('Rend · Hero')
    expect(copy.limitLine({ kind: 'learner', name: 'Rend', bond: 2, more: true })).toBe('Rend · Learner · Bond 2/10 · +1')
    expect(copy.limitSeat('Learner', 'Warrior Dojo', 2)).toBe('Learner · Warrior Dojo · Seat 2')
    expect(copy.limitPower(2.9, { value: 0.8, name: 'Paladin' })).toBe('×2.9 · ×0.8 as Paladin')
    expect(copy.actions.promoteTo('Brawler')).toBe('Promote to Brawler')
    expect(copy.actions.startClass('Summoner')).toBe('Start Summoner · R1')
    expect(copy.armorSlot('head')).toBe('Head')
    expect(copy.unlock({ kind: 'ticket' })).toBe('Unlock · 1 Ticket')
    expect(copy.unlock({ kind: 'tier', tier: 2 })).toBe('In Tier 2')
    expect(copy.unlock({ kind: 'tier-one' })).toBe('Unlock in Tier 1')
    expect(copy.unlock({ kind: 'pick', a: 'Mage', b: 'Spell Blade' })).toBe('Pick on unlock · Mage or Spell Blade')
    expect(copy.actions.raiseTo(9)).toBe('Raise to G9')
    expect(copy.actions.raiseAll).toBe('Raise all')
    expect(copy.valueStep('Might', 26, 45)).toBe('Might 26 → 45')
    expect(copy.effectStep('ATK +7', 'ATK +9')).toBe('ATK +7 → +9')
    expect(copy.effectStep('Off', 'Lance +2')).toBe('Off → Lance +2')
    expect(copy.raiseLine('Axe', 6, 8, ['Arms Gem G7', 'Arms Gem G8'])).toBe('Axe G6 → G8 · Arms Gem G7 ×1 · G8 ×1')
    expect(copy.usesItems(4)).toBe('Uses 4 items')
    expect(copy.usesItems(1)).toBe('Uses 1 item')
    expect(copy.gearSummary('physical', 3)).toBe('Physical · 3 ready')
    expect(copy.gearSummary('magical', 0)).toBe('Magical')
    expect(copy.actions.raise(3)).toBe('Raise 3')
    expect(copy.actions.set).toBe('Set')
    expect(copy.actions.setAll).toBe('Set all')
    expect(copy.actions.setCount(3)).toBe('Set 3')
    expect(copy.actions.equip).toBe('Equip')
    expect(copy.actions.unequip).toBe('Unequip')
    expect(copy.actions.replace).toBe('Replace')
    expect(copy.actions.auto).toBe('Auto')
    expect(copy.actions.standardPreset).toBe('Standard preset')
    expect(copy.actions.confirm).toBe('Confirm')
    expect(copy.actions.confirmOnce).toBe('Confirm once')
    expect(copy.actions.fightAs('Mage')).toBe('Fight as Mage')
    expect(copy.actions.unlock).toBe('Unlock · 1 Ticket')
    expect(copy.actions.open('Observatory')).toBe('Open Observatory')
    expect(copy.actions.takeLine('B')).toBe('Take line B')
  })

  it('keeps every builder and profile view-model compact', () => {
    const styles: Aptitudes['strategy'] = { front: 'C', pace: 'A', late: 'C', end: 'C' }
    const distances: Aptitudes['distance'] = { sprint: 'C', mile: 'C', medium: 'A', long: 'C' }
    const outfit = {
      outfitId: '81001', baseStats: { speed: 100, stamina: 100, power: 90, guts: 100, wit: 102 },
      growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 20 }, aptitudes: { surface: { turf: 'A', dirt: 'G' }, strategy: styles, distance: distances },
    } as unknown as RosterOutfit
    const owned = { ...newOwnedUma('2026-10-29T00:00:00.000Z', 'mage'), level: 50, calling: { pick: null, confirmed: false } }
    const values: { source: string; value: unknown }[] = [
      { source: 'level and exp ends', value: [copy.level(1), copy.level(50), copy.exp(0, 168), copy.exp(301, null)] },
      { source: 'templateTab locked', value: templateTab(outfit, null, null, 1) },
      { source: 'templateTab owned', value: templateTab(outfit, owned, 'mage', 1) },
      { source: 'flourishSheet', value: [flourishSheet(outfit, owned, 'duelist', 1, null), flourishSheet(outfit, owned, 'brawler', 1, null)] },
      { source: 'handWord', value: handWord('spellblade') },
      { source: 'rankText', value: [rankText({ open: true, rank: 3, nextRankAt: 14, gate: 1 }), rankText({ open: false, rank: 0, nextRankAt: null, gate: 30 })] },
      { source: 'mapNodeValue', value: ['planet:1', 'prowess:1', 'vigor:1', 'guard:1', 'template:1'].map((id) => mapNodeValue(id, 'spellblade', 'fleet', 'physical', 1)) },
    ]
    const grades = newGrades(1)
    for (const family of ['bell', 'pendant', 'orb', 'insignia'] as AccessoryFamily[]) {
      for (const grade of [0, 1, 10]) {
        const slot = { grade, family, form: 'base' as const, kind: 'greatsword' as const }
        const kinds = ['greatsword', 'axe', 'lance'] as const
        values.push({ source: `accessoryChoices ${family} G${grade}`, value: [accessoryChoices(slot, kinds, family, 1), accessoryTile(slot, kinds, 1)] })
        values.push({ source: `accessoryGradeLine ${family} G${grade}`, value: accessoryGradeLine(slot, ['greatsword', 'axe', 'lance'], 1, family, 50) })
        values.push({ source: `accessoryEffect ${family} G${grade}`, value: [copy.accessoryEffect(family, grade, 1), copy.accessoryEffect(family, grade, 1, 'greatsword')] })
      }
    }
    for (const value of ['even-pace', 'late-reserve', 'clean-break'] as RpgFlourish[]) values.push({ source: `flourish ${value}`, value: flourishLine(value) })
    for (const knack of ['tireless', 'clever', 'mighty', 'fleet', 'gritty'] as const) values.push({ source: `moon ${knack}`, value: mapNodeValue('template:1', 'spellblade', knack, 'physical', 1) })
    const gearWorld = { ...newTierWorld('2026-10-29T00:00:00.000Z', 3), items: { 'weapon-gem-g1': 1, 'armor-fittings-g1': 1, 'accessory-setting-g1': 1 },
      umas: { '81001': { ...owned, classId: 'brawler' as const, gear: { ...grades, accessories: [{ grade: 0, family: 'orb' as const, form: 'base' as const, kind: 'fire' as const }, ...grades.accessories.slice(1)] } } } }
    values.push({ source: 'gear tab', value: [weaponGradeLine(grades, 'greatsword', 1), gearTiles(gearWorld.umas['81001'].gear, ['greatsword', 'axe', 'lance'], ['greatsword', 'axe', 'lance'], 1, null),
      raiseAllPlan(gearWorld, '81001', ['greatsword', 'axe', 'lance']).lines,
      (['weapon', 'armor', 'accessory'] as const).map((kind) => raiseSheet(gearWorld, '81001', kind === 'weapon' ? { kind, weapon: 'greatsword' } : kind === 'armor' ? { kind, slot: 'feet' } : { kind, slot: 0 }, 'brawler', 1))] })
    const world = { ...newTierWorld('2026-10-29T00:00:00.000Z', 3), umas: { '81001': { ...owned, classId: 'recruit' as const,
      ranks: { classes: { recruit: { rank: 10, exp: 400 }, duelist: { rank: 7, exp: 0 } } }, bonds: { 'brawler-1': { level: 3, exp: 2 } } } } }
    const tiered = world.umas['81001']
    values.push({ source: 'class tree', value: [classTiles(outfit, tiered).map((t) => t.word), RPG_CLASSES.map((c) => classesSheet(outfit, tiered, world, 1, c).line),
      RPG_CLASSES.map((c) => classesSheet(outfit, tiered, world, 1, c).footer.label), promotionSheet(outfit, tiered, 1, 'recruit'), promotionLine(tiered, 'duelist')] })
    values.push({ source: 'limit', value: limitView(world, '81001', 'recruit', () => 'Aster') })
    const starred = { ...owned, classId: 'brawler' as const, stars: { open: ['planet:1', 'prowess:1', 'vigor:1', 'guard:1'], moons: [] as [] } }
    const stock = { 'jewel-moon-2': 3, 'jewel-planet-2': 3 }
    const steps = setAllPlan(starred.stars, stock, 50)
    expect(steps.length).toBeGreaterThan(0)
    values.push({ source: 'stars tab', value: [setAllLines(steps, outfit, starred, 'brawler', ['greatsword', 'axe', 'lance'], 1),
      ['planet:2', 'guard:2', 'guard:3', 'planet:5', 'template:1', 'template:2'].map((id) => { const { jewelId: _, ...view } = nodeSheet(outfit, starred, id, 'brawler', ['greatsword', 'axe', 'lance'], 1, stock); return view })] })
    for (const classId of RPG_CLASSES) values.push({ source: `battle sheet ${classId}`, value: umaBattleSheet(outfit, { ...owned, classId }, classId, 1, BATTLE_ENGINE_VERSION) })
    for (const entry of values) for (const value of strings(entry.value)) check(value, entry.source)
  })

  it('keeps literal JSX terse outside help sheets', () => {
    const files = [
      'OutfitProfile.tsx', 'FactsRow.tsx', 'DetailsSheet.tsx', 'TemplateTab.tsx', 'GearTab.tsx',
      'ClassTab.tsx', 'class-sheets.tsx', 'ClassesSheet.tsx', 'PromotionSheet.tsx', 'WeaponSheet.tsx', 'PresetButton.tsx',
      '../observatory/StarsPanel.tsx', '../observatory/ObservatoryPage.tsx',
    ]
    const allow = new Set(["That outfit isn't in the current game data.", 'Not in the current game data.', 'Unlock her first.', 'Unlock an Uma first.'])
    const root = path.dirname(new URL(import.meta.url).pathname)
    const failures: string[] = []
    for (const relative of files) {
      const name = path.basename(relative, '.tsx')
      const file = path.join(root, relative)
      const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
      const walk = (node: ts.Node, inHelp = false) => {
        const tag = ts.isJsxElement(node) ? node.openingElement.tagName : ts.isJsxSelfClosingElement(node) ? node.tagName : null
        const help = inHelp || (!!tag && tag.getText(source) === 'HelpButton')
        if (!help && ts.isJsxText(node)) {
          const value = node.text.replace(/\s+/g, ' ').trim()
          if (value && !allow.has(value) && copyWords(value).length > 4) failures.push(`${name}: ${value}`)
        }
        if (!help && ts.isJsxExpression(node) && node.expression && ts.isStringLiteral(node.expression)) {
          const value = node.expression.text
          if (!allow.has(value) && copyWords(value).length > 4) failures.push(`${name}: ${value}`)
        }
        ts.forEachChild(node, (child) => walk(child, help))
      }
      walk(source)
    }
    expect(failures).toEqual([])
  })

  it('rejects the audit slop and accepts its compact replacements', () => {
    for (const value of ['This is a +1 bonus to fire damage when this is equipped', 'After her Attack, one more hit of that kind at 0.8',
      'Empty this seat (its 3 Learners leave; their Bonds stay)']) {
      expect(banned.test(value) || copyWords(value).length > 6, value).toBe(true)
    }
    for (const value of ['Fire +1', 'Greatsword ×0.8', 'Empty seat']) check(value, 'fixed')
  })
})
