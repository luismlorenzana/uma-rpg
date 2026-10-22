// The Account's achievements (H49, rift.md §7): Tier 1's seals and "Rift Conquered", every other world's, and the nine
// titles. Earned ones lead, newest first, with the date and the run; the rest follow in catalog order, dimmed, with how
// each is earned. It fills the kit's Account `sections` slot; the kit draws nothing new for it.
import { Panel } from '@luismlorenzana/uma-kit/ui'
import { ACHIEVEMENTS, type AchievementDef, type Save } from '@rpg/domain'
import { AchievementBadge, FrontCrest } from '../battle/pixel-icons'
import { achievementTitle, runLabel, shortDate } from './words'

/** The badge, and Untouched's front crest beside it; a fixed cell, so every name lines up. */
export function AchievementArt({ def, dim = false }: { def: AchievementDef; dim?: boolean }) {
  return <span aria-hidden="true" className={`flex w-11 shrink-0 items-center gap-1 ${dim ? 'opacity-40' : ''}`}>
    <AchievementBadge id={def.id} />
    {def.kind === 'title' && def.front && <FrontCrest front={def.front} />}
  </span>
}

export function AchievementList({ save }: { save: Save }) {
  const held = save.account.achievements
  const worlds = new Set(Object.keys(save.tierWorlds).map(Number))
  const shown = ACHIEVEMENTS.filter((a) => a.tier === null || a.tier === 1 || worlds.has(a.tier) || held[a.id])
  const earned = shown.filter((a) => held[a.id]).sort((a, b) => Date.parse(held[b.id]!.at) - Date.parse(held[a.id]!.at))
  const rest = shown.filter((a) => !held[a.id])
  return (
    <Panel className="p-3" aria-label="Achievements" data-achievements>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2 className="text-micro">Achievements</h2>
        <span className="text-[12px] tabular-nums text-ink-soft">{earned.length} of {shown.length}</span>
      </div>
      <ul>
        {earned.map((a) => {
          const { at, run } = held[a.id]!
          return <Row key={a.id} def={a} line={run ? `${shortDate(at)} · ${runLabel(run)}` : shortDate(at)} earned />
        })}
        {rest.map((a) => <Row key={a.id} def={a} line={a.how} />)}
      </ul>
    </Panel>
  )
}

function Row({ def, line, earned = false }: { def: AchievementDef; line: string; earned?: boolean }) {
  return (
    <li data-achievement={def.id} data-earned={earned || undefined} className="flex min-h-12 items-center gap-2.5 border-b border-hairline py-1.5 last:border-0">
      <AchievementArt def={def} dim={!earned} />
      <span className="min-w-0">
        <span className={`block text-[14px] font-semibold leading-tight ${earned ? '' : 'text-ink-soft'}`}>{achievementTitle(def)}</span>
        <span className="block text-[12px] leading-tight text-ink-faint">{line}</span>
      </span>
    </li>
  )
}
