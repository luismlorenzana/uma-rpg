// A foe in a stage's list (the world map's stage sheet, the Rift's chain and stage sheets): her face, elements and name,
// her Boss or Elite tag and how often she acts, then her shield, weaknesses and the Rift's ward (D169).
import type { BattleChannel, BattleEnemy, EnemyRank } from '@rpg/domain'
import type { Campaign } from './campaign'
import { CastFace } from './CastFace'
import { ElementGlyph, WeaknessIcons } from './labels'

/** The ward's badge: the channel she halves, in weapon words. */
export const WARD_BADGE: Readonly<Record<BattleChannel, string>> = { physical: 'Wards Arms', magical: 'Wards Tomes' }

/** "Acts twice", "Acts three times", or null. */
export const actsBadge = (enemy: Pick<BattleEnemy, 'twice' | 'thrice'>): string | null =>
  enemy.thrice ? 'Acts three times' : enemy.twice ? 'Acts twice' : null

/** One foe; `rank` is how she reads (the world map: her rank; the Rift: her face's tier). */
export function FoeRow({ campaign, enemy, rank }: { campaign: Campaign; enemy: BattleEnemy; rank: EnemyRank }) {
  const acts = actsBadge(enemy)
  return (
    <li className="flex items-center gap-2 rounded-sm bg-raised p-2">
      <CastFace campaign={campaign} castId={enemy.castId} size={40} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 text-[13px] font-semibold">
          <ElementGlyph element={enemy.element} size={14} />
          {enemy.element2 && <ElementGlyph element={enemy.element2} size={14} />}
          <span className="truncate">{campaign.name(enemy.id, enemy.castId)}</span>
          {rank !== 'regular' && <span className="shrink-0 rounded-xs bg-accent/20 px-1 text-[10px] text-accent">{rank === 'boss' ? 'Boss' : 'Elite'}</span>}
          {acts && <span className="shrink-0 rounded-xs bg-danger/20 px-1 text-[10px] text-danger">{acts}</span>}
        </p>
        <p className="flex items-center gap-1 text-[11px] text-ink-soft">
          Shield {enemy.shield} · weak <WeaknessIcons weaknesses={enemy.weaknesses} size={12} />
          {enemy.ward && <span className="shrink-0 rounded-xs bg-danger/20 px-1 text-[10px] text-danger">{WARD_BADGE[enemy.ward]}</span>}
        </p>
      </div>
    </li>
  )
}
