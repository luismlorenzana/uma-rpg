// The ranks as bars (D102): a Class Rank row, and compact cells for five weapons or five armor kinds, each with its
// rank and how far into the next one she is. Used on the fight result and an Uma's profile.
import {
  ARMOR_LABEL, expToNextOf, gearId, maxRankOf, type ArmorKind, type EquipType, type RankKind, type RankTrack, type RpgWeapon,
} from '@rpg/domain'
import { Bar, WEAPON_LABEL, WeaponGlyph } from '../battle/labels'
import { ItemIcon } from '../items/ItemIcon'

/** How full a track's bar is: EXP over what the next rank needs, full at the top rank. */
export function fill(kind: RankKind, t: RankTrack): { value: number; max: number; top: boolean } {
  const top = t.rank >= maxRankOf(kind)
  return top ? { value: 1, max: 1, top } : { value: t.exp, max: expToNextOf(kind, t.rank), top }
}

/** An armor kind's icon: its grade-1 piece (the Orbs, a representative one). */
export function ArmorMark({ kind, size = 20 }: { kind: ArmorKind; size?: number }) {
  const type: EquipType = kind === 'arms-orb' ? 'orb-greatsword' : kind === 'elemental-orb' ? 'orb-fire' : kind
  return <ItemIcon id={gearId(type, 1, 'hp')} size={size} label={ARMOR_LABEL[kind]} plain />
}

/** One wide bar: a label, the rank, the bar, and what this fight added. */
export function RankRow({ label, kind, track, before, gain }: { label: string; kind: RankKind; track: RankTrack; before?: RankTrack; gain?: number }) {
  const f = fill(kind, track)
  const up = before && track.rank > before.rank
  return (
    <div className="text-[12px]">
      <p className="flex items-baseline justify-between gap-2">
        <span className="truncate">{label} <span className="font-semibold">Rank {track.rank}</span>{f.top ? ' · Max' : ''}</span>
        <span className={`shrink-0 ${up ? 'font-semibold text-accent' : 'text-ink-faint'}`}>{up ? `Rank up! ${before!.rank} → ${track.rank}` : gain ? `+${gain}` : ''}</span>
      </p>
      <Bar className="mt-0.5" value={f.value} max={f.max} tone="exp" />
    </div>
  )
}

export interface RankCell { key: string; kind: 'weapon' | 'armor'; id: RpgWeapon | ArmorKind; track: RankTrack; before?: RankTrack }
/** Five small cells in a row: icon, rank, a thin bar; a rank-up glows. */
export function RankCells({ cells, label }: { cells: readonly RankCell[]; label: string }) {
  return (
    <ul className="grid grid-cols-5 gap-1" aria-label={label}>
      {cells.map((c) => {
        const f = fill(c.kind, c.track)
        const up = c.before && c.track.rank > c.before.rank
        const name = c.kind === 'weapon' ? WEAPON_LABEL[c.id as RpgWeapon] : ARMOR_LABEL[c.id as ArmorKind]
        return (
          <li key={c.key} className={`rounded-xs px-1 py-0.5 ${up ? 'bg-accent/20 ring-1 ring-accent' : 'bg-panel'}`} aria-label={`${name} Rank ${c.track.rank}${up ? ', rank up' : ''}`}>
            <span className="flex items-center justify-between gap-0.5">
              {c.kind === 'weapon' ? <WeaponGlyph weapon={c.id as RpgWeapon} size={14} /> : <ArmorMark kind={c.id as ArmorKind} size={16} />}
              <span className={`font-display text-[11px] font-bold ${up ? 'text-accent' : ''}`}>{c.track.rank}</span>
            </span>
            <Bar className="mt-0.5 h-1" value={f.value} max={f.max} tone="exp" />
          </li>
        )
      })}
    </ul>
  )
}
