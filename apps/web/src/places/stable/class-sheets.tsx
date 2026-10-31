// The Class tab's small sheets (H120, UP11, UP12): a node (Equip, Unequip, Replace at a full loadout, Take line on the other
// line, its gate when closed), a line (its three skills, Take line) and the Limit sheet (each Limit Break she casts, every
// other Bond, Open {hall}). A tap on a square or a node opens one, never an unequip; each stays open on its new state (G5).
import { rpgNode, rpgNodeSkill, RPG_SKILL_RANK_MAX, BATTLE_ENGINE_VERSION, rpgSkillFactor, type RpgBranch, type RpgProfile, type RpgTreeViewNode, type RpgTreeViewTree } from '@rpg/domain'
import { useState } from 'react'
import { KindMark, skillKinds, skillLine, WEAPON_LABEL, WeaponGlyph } from '../../battle/labels'
import { BottomSheet } from '../../ui/BottomSheet'
import { tier0NodeTitle, type LimitView } from './class-view'
import { actions, classRank, depth, line as lineCopy, opens, skillRank } from './copy'
import { useSheetDoor } from './sheet-door'

/** A node's rank words from the profile wording list. */
export function rankText(node: Pick<RpgTreeViewNode, 'open' | 'rank' | 'nextRankAt' | 'gate'>): string {
  if (!node.open) return classRank(node.gate)
  return skillRank(node.rank, node.nextRankAt)
}
/** A node's line at her Skill Rank (CP32): v16's def (Pierce, the Paladin's revive), its power × her rank's factor; a Tier 0's
 * node at her skill's power for her Class Rank (`rpgSkillFactor`, CV6). */
export function nodeLine(profile: Pick<RpgProfile, 'classId' | 'tier' | 'classRank'>, node: Pick<RpgTreeViewNode, 'id' | 'depth'>,
  engine: number = BATTLE_ENGINE_VERSION): string {
  const base = rpgNode(node.id)!
  return skillLine(profile, rpgNodeSkill(base, engine), engine, rpgSkillFactor({ classId: base.classId, depth: node.depth }, profile.classRank, engine))
}
const lineTitle = (tree: Pick<RpgTreeViewTree, 'bName'>, branch: RpgBranch) => lineCopy(branch, branch === 'B' ? tree.bName : undefined)
export { lineTitle }

/** Five rank pips: filled to her Skill Rank (none while closed). */
export function RankPips({ rank }: { rank: number }) {
  return (
    <span role="img" aria-label={rank ? `Rank ${rank} of ${RPG_SKILL_RANK_MAX}` : 'Closed'} className="inline-flex shrink-0 gap-0.5">
      {Array.from({ length: RPG_SKILL_RANK_MAX }, (_, i) => (
        <span key={i} className={`size-1.5 rounded-full ${i < rank ? 'bg-accent' : 'bg-ink-faint/35'}`} />
      ))}
    </span>
  )
}

/** A node's compact identity. Damage-kind marks carry the overview; its sheet owns the words. */
export function SkillMarks({ node }: { node: Pick<RpgTreeViewNode, 'id'> }) {
  const base = rpgNode(node.id)!
  const kinds = skillKinds(rpgNodeSkill(base, BATTLE_ENGINE_VERSION))
  return <span className="flex items-center justify-center gap-0.5">{kinds.length
    ? kinds.slice(0, 2).map((kind) => <KindMark key={kind} kind={kind} size={kinds.length > 1 ? 15 : 19} />)
    : <WeaponGlyph weapon={base.weapon} size={19} />}</span>
}

const PRIMARY = 'min-h-12 w-full rounded-sm bg-accent px-3 font-display font-bold text-accent-ink'
const QUIET = 'min-h-12 w-full rounded-sm bg-raised px-3 font-display font-bold text-ink'
const DISABLED = 'min-h-12 w-full rounded-sm bg-raised px-3 font-display text-[14px] font-bold text-ink-soft'

/** A node's sheet; a Tier 0's is titled with its weapon and has no pips: its rank is her Class Rank, to 10. */
export function NodeSheet({ node, profile, tier0, shown, slots, nodes, error, onClose, onEquip, onTakeLine }: {
  node: RpgTreeViewNode
  profile: RpgProfile
  tier0: boolean
  /** What she equips now, in order. */
  shown: readonly string[]
  slots: number
  /** Every node of her three trees, to name what she equips. */
  nodes: readonly RpgTreeViewNode[]
  error: string | null
  onClose: () => void
  onEquip: (loadout: string[]) => void
  onTakeLine: (line: RpgBranch) => void
}) {
  const [replacing, setReplacing] = useState(false)
  const title = tier0 ? tier0NodeTitle(node.name, WEAPON_LABEL[rpgNode(node.id)!.weapon]) : node.name
  const worn = shown.includes(node.id)
  const swap = (out: string) => { setReplacing(false); onEquip(shown.map((id) => (id === out ? node.id : id))) }
  const footer = !node.open ? <button type="button" disabled className={DISABLED}>{opens(classRank(node.gate))}</button>
    : !node.held ? <button type="button" onClick={() => onTakeLine(node.line as RpgBranch)} className={PRIMARY}>{actions.takeLine(node.line as RpgBranch)}</button>
    : worn ? <button type="button" onClick={() => onEquip(shown.filter((id) => id !== node.id))} className={QUIET}>{actions.unequip}</button>
    : shown.length < slots ? <button type="button" onClick={() => onEquip([...shown, node.id])} className={PRIMARY}>{actions.equip}</button>
    : <button type="button" aria-expanded={replacing} onClick={() => setReplacing(!replacing)} className={PRIMARY}>{actions.replace}</button>
  return (
    <BottomSheet title={title} onClose={onClose} footer={footer}>
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-sm bg-raised p-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-accent/10"><SkillMarks node={node} /></span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[14px] font-semibold">{!tier0 && <RankPips rank={node.open ? node.rank : 0} />} {rankText(node)}</p>
            <p className="text-[12.5px] text-ink-soft">{depth(node.depth, node.line)}</p>
          </div>
        </div>
        <p className="rounded-sm bg-raised p-3 text-[14px] text-ink-soft">{nodeLine(profile, node)}</p>
        {replacing && (
          <ul className="space-y-1" aria-label="Equipped skills">
            {shown.map((id) => {
              const item = nodes.find((candidate) => candidate.id === id)
              return item && (
                <li key={id}>
                  <button type="button" onClick={() => swap(id)} className="flex min-h-11 w-full items-center gap-2 rounded-sm bg-raised px-3 text-left text-[14px] font-semibold">
                    <SkillMarks node={item} /><span className="min-w-0 flex-1 truncate">{item.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        {error && <p className="text-[13px] text-danger">{error}</p>}
      </div>
    </BottomSheet>
  )
}

/** A line's sheet: its three skills, and the action to take it, or Held. */
export function LineSheet({ tree, branch, profile, error, onClose, onTake }: {
  tree: RpgTreeViewTree; branch: RpgBranch; profile: RpgProfile; error: string | null; onClose: () => void; onTake: () => void
}) {
  const nodes = tree.nodes.filter((n) => n.line === branch)
  const held = tree.branch === branch
  return (
    <BottomSheet title={`${WEAPON_LABEL[tree.weapon]} · ${lineTitle(tree, branch)}`} onClose={onClose}
      footer={held ? <button type="button" disabled className={DISABLED}>Held</button>
        : <button type="button" onClick={onTake} className={PRIMARY}>{actions.takeLine(branch)}</button>}>
      <ul className="space-y-1.5">
        {nodes.map((n) => (
          <li key={n.id} className="rounded-sm bg-raised p-2">
            <p className="flex items-center justify-between gap-2 text-[14px] font-semibold">
              <span className="min-w-0 truncate">{n.name}</span>
              <span className="shrink-0 text-[11px] font-normal text-ink-faint">{depth(n.depth, branch)} · {classRank(n.gate)}</span>
            </p>
            <p className="text-[12.5px] leading-snug text-ink-soft">{nodeLine(profile, n)}</p>
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </BottomSheet>
  )
}

/** Her Limit Breaks: one block each, a tap on one of two selects it and the footer's hall follows; then her other Bonds. */
export function LimitSheet({ view, onClose }: { view: LimitView; onClose: () => void }) {
  const [selected, setSelected] = useState(0)
  const door = useSheetDoor('limit')
  const block = view.blocks[Math.min(selected, view.blocks.length - 1)]
  const hall = block?.hall ?? view.hall
  return (
    <BottomSheet title={view.blocks[0]?.name ?? 'Limit'} onClose={onClose}
      footer={<button type="button" onClick={() => door(`/learning/${hall.place}`)} data-limit-footer className={PRIMARY}>{actions.open(hall.name)}</button>}>
      <div className="space-y-1.5" data-limit-sheet>
        {view.blocks.length === 0 && <p className="rounded-sm bg-raised p-3 text-[14px] text-ink-soft">None</p>}
        {view.blocks.map((b, i) => {
          const rows = (
            <>
              {view.blocks.length > 1 && <span className="block text-[14px] font-semibold">{b.name}</span>}
              <span className="block text-[12.5px] text-ink-soft">{b.seat}</span>
              <span className="block text-[12.5px] text-ink-soft">{b.bond}</span>
              {b.next && <span className="block text-[12.5px] text-ink-soft">{b.next}</span>}
              {b.hero && <span className="block text-[12.5px] text-ink-soft">{b.hero}</span>}
              <span className="block text-[12.5px] text-ink-soft">Power · {b.power}</span>
            </>
          )
          return view.blocks.length > 1
            ? <button key={b.id} type="button" aria-pressed={i === selected} onClick={() => setSelected(i)}
                className={`block w-full rounded-sm bg-raised p-3 text-left ${i === selected ? 'ring-2 ring-accent' : ''}`}>{rows}</button>
            : <div key={b.id} className="rounded-sm bg-raised p-3">{rows}</div>
        })}
        {view.others.length > 0 && (
          <ul className="space-y-0.5 pt-1" aria-label="Other Bonds">
            {view.others.map((other) => <li key={other.id} className="px-1 text-[12.5px] text-ink-soft">{other.text}</li>)}
          </ul>
        )}
      </div>
    </BottomSheet>
  )
}
