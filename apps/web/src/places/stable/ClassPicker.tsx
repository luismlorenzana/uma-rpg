// The Skills tab's class picker (D86; H59's six in two rows; shared by the tab before and from v16, H70): every class with
// its emblem and Class Rank, the one she fights as picked.
import { classRankOf, RPG_CLASSES, type OwnedUma, type RpgClass } from '@rpg/domain'
import { CLASS_LABEL } from '../../battle/labels'
import { ClassEmblem } from '../../battle/pixel-icons'
import { classRank } from './copy'

export function ClassPicker({ uma, classId, onPick }: { uma: OwnedUma; classId: RpgClass; onPick: (next: RpgClass) => void }) {
  return (
    // Classes v2's six in two rows of three (H59): six in a row leaves "Summoner" no room at 375 pt.
    <div className={`grid gap-1 ${RPG_CLASSES.length > 5 ? 'grid-cols-3' : 'grid-cols-5'}`} role="radiogroup" aria-label="Class">
      {RPG_CLASSES.map((c) => (
        <button key={c} type="button" role="radio" aria-checked={c === classId} onClick={() => onPick(c)}
          className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-sm px-0.5 text-center ${c === classId ? 'bg-accent text-accent-ink' : 'bg-raised text-ink'}`}>
          <ClassEmblem classId={c} />
          <span className="text-[11px] font-semibold leading-tight">{CLASS_LABEL[c]}</span>
          <span className={`text-[10px] leading-none ${c === classId ? 'text-accent-ink/80' : 'text-ink-faint'}`}>{classRank(classRankOf(uma.ranks, c))}</span>
        </button>
      ))}
    </div>
  )
}
