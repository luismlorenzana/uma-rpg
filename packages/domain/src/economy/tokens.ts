// Tokens (D67): won fights drop them, and class promotions, crafting and cooking spend them, so battles feed the Hub.
// A band is a continent's ten levels (Lv1–10 is band 1); band n covers class rank n → n + 1 (bands 1–4, D77) and grades
// 2n − 1 and 2n.
// Crafting and Cooking Tokens mirror each other: one per stat, the same eight the item families pair up on (§8.2).
// Tokens sit in the Warehouse's item stock under their own ids, so jobs take, return and check them like any input.
import { ITEM_EFFECTS, type ItemEffect } from '../items/catalog'
import type { RpgClass } from '../rpg/kinds'

export const TOKEN_BANDS = 5
export type TokenKind = 'class' | 'craft' | 'cook'
export interface TokenDef { id: string; kind: TokenKind; band: number; name: string; classId?: RpgClass; effect?: ItemEffect }

const CLASS_IDS: readonly RpgClass[] = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner']
export const TOKEN_CLASS_NAME: Readonly<Record<RpgClass, string>> = { brawler: 'Brawler', mage: 'Mage', spellblade: 'Spell Blade', cleric: 'Cleric', summoner: 'Summoner' }
const STAT_NAME: Readonly<Record<ItemEffect, string>> = { hp: 'HP', mp: 'MP', atk: 'ATK', matk: 'M.ATK', def: 'DEF', mdef: 'M.DEF', speed: 'Speed', limit: 'Limit' }
const grades = (band: number) => `G${2 * band - 1}–${2 * band}`

export const promotionTokenId = (classId: RpgClass, band: number): string => `token-class-${classId}-${band}`
/** Crafts gear whose accent is this stat. */
export const craftTokenId = (effect: ItemEffect, band: number): string => `token-craft-${effect}-${band}`
/** Cooks dishes that feed this stat. */
export const cookTokenId = (effect: ItemEffect, band: number): string => `token-cook-${effect}-${band}`
/** The band that makes a grade: grades 1–2 are band 1, 9–10 band 5. */
export const gradeBand = (grade: number): number => Math.min(TOKEN_BANDS, Math.max(1, Math.ceil(grade / 2)))
/** The band a fight drops: its foes' level within the tier, ten levels a band. */
export const levelBand = (lifetimeLevel: number): number => Math.min(TOKEN_BANDS, Math.max(1, Math.ceil((((lifetimeLevel - 1) % 50) + 1) / 10)))

const bands = Array.from({ length: TOKEN_BANDS }, (_, i) => i + 1)
/** Bands whose fights drop Promotion Tokens: class ranks top out at 5 (D77), so band 5 promotes nothing. */
export const PROMOTION_BANDS = TOKEN_BANDS - 1
/** Every token: per band, 5 promotions (bands 1–4), 8 crafting and 8 cooking. */
export const TOKENS: readonly TokenDef[] = bands.flatMap((band) => [
  ...(band > PROMOTION_BANDS ? [] : CLASS_IDS).map((classId): TokenDef => ({ id: promotionTokenId(classId, band), kind: 'class', band, classId, name: `${TOKEN_CLASS_NAME[classId]} Promotion Token (rank ${band + 1})` })),
  ...ITEM_EFFECTS.map((effect): TokenDef => ({ id: craftTokenId(effect, band), kind: 'craft', band, effect, name: `${STAT_NAME[effect]} Crafting Token (${grades(band)})` })),
  ...ITEM_EFFECTS.map((effect): TokenDef => ({ id: cookTokenId(effect, band), kind: 'cook', band, effect, name: `${STAT_NAME[effect]} Cooking Token (${grades(band)})` })),
])
const BY_ID = new Map(TOKENS.map((t) => [t.id, t]))
export const tokenById = (id: string): TokenDef | undefined => BY_ID.get(id)
export const isToken = (id: string): boolean => BY_ID.has(id)

/** Tokens a won fight drops, by its kind (half of D67's first numbers, owner 2026-10-11); sub-bosses and champions
 * always include a Class Promotion Token, except in band 5, where a promotion's share goes to Crafting or Cooking. */
export const TOKEN_DROPS = { fight: 1, 'sub-boss': 2, vanguard: 2, boss: 3 } as const
/** Odds of each token kind per drop: Cooking and Crafting alike, Promotions rarer (one per class rank a band). */
export const TOKEN_ODDS: Readonly<Record<TokenKind, number>> = { cook: 0.425, craft: 0.425, class: 0.15 }
/** Tokens the Exchange swaps for one of your choice, same kind and band. */
export const TOKEN_SWAP_COST = 3

function hash(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return h >>> 0
}
const roll = (key: string): number => hash(key) / 4294967296

/** The tokens a win drops, decided by its seed so a replayed fight drops the same ones. */
export function rollTokens(seed: string, kind: keyof typeof TOKEN_DROPS, band: number): Record<string, number> {
  const out: Record<string, number> = {}
  const add = (id: string) => { out[id] = (out[id] ?? 0) + 1 }
  const pick = <T>(list: readonly T[], key: string): T => list[Math.floor(roll(key) * list.length)]!
  for (let i = 0; i < TOKEN_DROPS[kind]; i++) {
    const r = roll(`${seed}:kind:${i}`)
    const guaranteed = i === 0 && (kind === 'sub-boss' || kind === 'boss')
    const promotion = guaranteed || r < TOKEN_ODDS.class
    if (promotion && band <= PROMOTION_BANDS) add(promotionTokenId(pick(CLASS_IDS, `${seed}:class:${i}`), band))
    else if (promotion ? roll(`${seed}:split:${i}`) < 0.5 : r < TOKEN_ODDS.class + TOKEN_ODDS.craft) add(craftTokenId(pick(ITEM_EFFECTS, `${seed}:craft:${i}`), band))
    else add(cookTokenId(pick(ITEM_EFFECTS, `${seed}:cook:${i}`), band))
  }
  return out
}
