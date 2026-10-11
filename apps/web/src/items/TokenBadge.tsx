// A token's icon (D67, D94), drawn in code: a shield for Promotion Tokens, a hexagon for Mastery, a coin for Cooking,
// with the class, "LV" or the stat inside and one pip per band underneath.
import type { TokenDef } from '@rpg/domain'

const COLOR = { class: ['#8f7ae6', '#4b3a99'], mastery: ['#d9933a', '#7a4a12'], cook: ['#5fb36a', '#25602f'] } as const
const CLASS_MARK: Record<string, string> = { brawler: 'Br', mage: 'Ma', spellblade: 'SB', cleric: 'Cl', summoner: 'Su' }
const STAT_MARK: Record<string, string> = { hp: 'HP', mp: 'MP', atk: 'ATK', matk: 'MAT', def: 'DEF', mdef: 'MDF', speed: 'SPD', limit: 'LB' }

export function TokenBadge({ token, size }: { token: TokenDef; size: number }) {
  const [fill, edge] = COLOR[token.kind]
  const mark = token.kind === 'class' ? CLASS_MARK[token.classId ?? ''] ?? '?' : token.kind === 'mastery' ? 'LV' : STAT_MARK[token.effect ?? ''] ?? '?'
  const shape = token.kind === 'class' ? <path d="M16 2 L28 6 V15 C28 22 23 27 16 30 C9 27 4 22 4 15 V6 Z" />
    : token.kind === 'mastery' ? <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" /> : <circle cx="16" cy="16" r="14" />
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <g fill={fill} stroke={edge} strokeWidth="1.5">{shape}</g>
      <text x="16" y="17" textAnchor="middle" dominantBaseline="central" fontSize={mark.length > 2 ? 8.5 : 10.5} fontWeight="800" fill="#fff" stroke={edge} strokeWidth="0.6"
        style={{ paintOrder: 'stroke' }}>{mark}</text>
      {Array.from({ length: token.band }, (_, i) => <circle key={i} cx={16 - (token.band - 1) * 2 + i * 4} cy="25.5" r="1.3" fill="#fff" />)}
    </svg>
  )
}
