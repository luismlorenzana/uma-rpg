// Tokens (D67, D94): won fights drop them, and training and cooking spend them, so battles feed the Hub.
// A band is a continent's ten levels (Lv1–10 is band 1); band n covers class rank n → n + 1 (bands 1–4, D77), Weapon,
// Armor and Accessory Levels 2n − 1 and 2n → the next (D94), and dishes of grades 2n − 1 and 2n.
// Promotion Tokens rank up a class; Mastery Tokens raise any Weapon, Armor or Accessory Level; Cooking Tokens, one per
// stat, go into dishes. The Forge takes none (D94): Craft Level alone gates gear.
// Tokens sit in the Warehouse's item stock under their own ids, so jobs take, return and check them like any input.
import { ITEM_EFFECTS, type ItemEffect } from '../items/kinds'
import type { RpgClass } from '../rpg/kinds'

export const TOKEN_BANDS = 5
export type TokenKind = 'class' | 'mastery' | 'cook'
export interface TokenDef { id: string; kind: TokenKind; band: number; name: string; classId?: RpgClass; effect?: ItemEffect }

const CLASS_IDS: readonly RpgClass[] = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner']
export const TOKEN_CLASS_NAME: Readonly<Record<RpgClass, string>> = { brawler: 'Brawler', mage: 'Mage', spellblade: 'Spell Blade', cleric: 'Cleric', summoner: 'Summoner' }
const STAT_NAME: Readonly<Record<ItemEffect, string>> = { hp: 'HP', mp: 'MP', atk: 'ATK', matk: 'M.ATK', def: 'DEF', mdef: 'M.DEF', speed: 'Speed', limit: 'Limit' }
const grades = (band: number) => `G${2 * band - 1}–${2 * band}`

export const promotionTokenId = (classId: RpgClass, band: number): string => `token-class-${classId}-${band}`
/** Raises a Weapon, Armor or Accessory Level (D94). */
export const masteryTokenId = (band: number): string => `token-mastery-${band}`
/** The band a mastery level-up spends: from Level L, band ⌈L/2⌉ (Levels 1 and 2 take band 1, Level 9 band 5). */
export const masteryBand = (level: number): number => Math.min(TOKEN_BANDS, Math.max(1, Math.ceil(level / 2)))
const masteryLevels = (band: number) => (band >= TOKEN_BANDS ? 'Level 10' : `Level ${2 * band}–${2 * band + 1}`)
/** Cooks dishes that feed this stat. */
export const cookTokenId = (effect: ItemEffect, band: number): string => `token-cook-${effect}-${band}`
/** The band that makes a grade: grades 1–2 are band 1, 9–10 band 5. */
export const gradeBand = (grade: number): number => Math.min(TOKEN_BANDS, Math.max(1, Math.ceil(grade / 2)))
/** The band a fight drops: its foes' level within the tier, ten levels a band. */
export const levelBand = (lifetimeLevel: number): number => Math.min(TOKEN_BANDS, Math.max(1, Math.ceil((((lifetimeLevel - 1) % 50) + 1) / 10)))

const bands = Array.from({ length: TOKEN_BANDS }, (_, i) => i + 1)
/** Bands whose fights drop Promotion Tokens: class ranks top out at 5 (D77), so band 5 promotes nothing. */
export const PROMOTION_BANDS = TOKEN_BANDS - 1
/** Every token: per band, 5 promotions (bands 1–4), one Mastery Token and 8 cooking. */
export const TOKENS: readonly TokenDef[] = bands.flatMap((band) => [
  ...(band > PROMOTION_BANDS ? [] : CLASS_IDS).map((classId): TokenDef => ({ id: promotionTokenId(classId, band), kind: 'class', band, classId, name: `${TOKEN_CLASS_NAME[classId]} Promotion Token (rank ${band + 1})` })),
  { id: masteryTokenId(band), kind: 'mastery', band, name: `Mastery Token (to ${masteryLevels(band)})` } as TokenDef,
  ...ITEM_EFFECTS.map((effect): TokenDef => ({ id: cookTokenId(effect, band), kind: 'cook', band, effect, name: `${STAT_NAME[effect]} Cooking Token (${grades(band)})` })),
])
const BY_ID = new Map(TOKENS.map((t) => [t.id, t]))
export const tokenById = (id: string): TokenDef | undefined => BY_ID.get(id)
export const isToken = (id: string): boolean => BY_ID.has(id)

/**
 * Tokens a won fight drops, by its kind (D82, D94): sized so each Uma's Lv1 → 50, as a fifth of her party's fights,
 * earns two full class tracks (8 Promotion Tokens), two full mastery tracks (18 Mastery Tokens: a Weapon, Armor or
 * Accessory Level 1 → 10 takes nine) and two Extra Stats planets (20 Cooking). Sub-bosses and champions always include
 * a Class Promotion Token, except in band 5, where a promotion's share goes to Mastery or Cooking.
 */
export const TOKEN_DROPS = { fight: 2, 'sub-boss': 3, vanguard: 3, boss: 5 } as const
/** Odds of each token kind per drop: Cooking and Mastery alike, Promotions rarer (one per class rank a band). */
export const TOKEN_ODDS: Readonly<Record<TokenKind, number>> = { cook: 0.425, mastery: 0.425, class: 0.15 }
/** Laurels a token sells for, per band (D80): 20 × its band. Any token costs twice that, so two tokens of a band buy
 * one of any kind in it, and low bands can't cheaply buy high ones. */
export const TOKEN_LAURELS_PER_BAND = 20
export const tokenSellPrice = (id: string): number => (tokenById(id)?.band ?? 0) * TOKEN_LAURELS_PER_BAND
export const tokenBuyPrice = (id: string): number => 2 * tokenSellPrice(id)

function hash(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return h >>> 0
}
const roll = (key: string): number => hash(key) / 4294967296

/** The tokens a win drops, decided by its seed so a replayed fight drops the same ones. On a replay (`share` below 1,
 * D79) each drop happens only with that chance. A stage in waves drops one more per extra wave (`extra`, D93), so its
 * 1.5× EXP doesn't thin the tokens an Uma earns per level (D82). */
export function rollTokens(seed: string, kind: keyof typeof TOKEN_DROPS, band: number, share = 1, extra = 0): Record<string, number> {
  const out: Record<string, number> = {}
  const add = (id: string) => { out[id] = (out[id] ?? 0) + 1 }
  const pick = <T>(list: readonly T[], key: string): T => list[Math.floor(roll(key) * list.length)]!
  for (let i = 0; i < TOKEN_DROPS[kind] + extra; i++) {
    if (share < 1 && roll(`${seed}:keep:${i}`) >= share) continue
    const r = roll(`${seed}:kind:${i}`)
    const guaranteed = i === 0 && (kind === 'sub-boss' || kind === 'boss')
    const promotion = guaranteed || r < TOKEN_ODDS.class
    if (promotion && band <= PROMOTION_BANDS) add(promotionTokenId(pick(CLASS_IDS, `${seed}:class:${i}`), band))
    else if (promotion ? roll(`${seed}:split:${i}`) < 0.5 : r < TOKEN_ODDS.class + TOKEN_ODDS.mastery) add(masteryTokenId(band))
    else add(cookTokenId(pick(ITEM_EFFECTS, `${seed}:cook:${i}`), band))
  }
  return out
}
