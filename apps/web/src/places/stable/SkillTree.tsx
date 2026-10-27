// The Skills tab from engine v16 (the Tier rework's R1, H70; class-progression.md §6.1, §6.2, §6.7, CP23): her root plate
// (class, hand and ★ Flourish), the class picker, her three weapon slots, what she equips, and one tree a slot drawn as a
// real tree: the trunk (depths 1–2), the fork at depth 3 into branches A and B down to depth 5, her path filled, the other
// branch dimmed, a closed depth faded with its gate, five rank pips on every node and a branch sheet to take the other
// branch (free; her equipped skills follow). Nothing is learned and nothing costs points (CP14). The model is the domain's
// `rpgTreeView`, which reads the catalog: only this lazy page imports it.
import {
  BATTLE_ENGINE_VERSION, classOf, classRankOf, classTrack, gearById, gearV1, gradeOf, isGrades, rpgActiveSlots, rpgClassSlots, rpgNode, rpgNodeSkill, rpgOpenDepth, rpgSkillRankFactor,
  RPG_SKILL_RANK_MAX, SaveRuleError, type BattleOutfit, type OwnedUma, type RpgBranch, type RpgClass, type RpgHand, type RpgProfile,
  type RpgTreeView, type RpgTreeViewNode, type RpgTreeViewTree, type TemplateOutfit, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { umaUpgrades } from '../../album/upgrades'
import { CLASS_BLURB, CLASS_LABEL, KindMark, skillKinds, skillLine, WEAPON_LABEL, WeaponGlyph } from '../../battle/labels'
import { ClassEmblem } from '../../battle/pixel-icons'
import { equip, pickClass, takeBranch } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { RankRow } from '../../ui/RankBars'
import { UpgradeMark } from '../../ui/UpgradeMark'
import { ClassPicker } from './ClassPicker'
import { rootFlourish } from './template-view'
import { WeaponSheet } from './WeaponSheet'

/** Her hand, half by half in her slots' order: "Arms ×0.72 + Tome ×0.44" (a pure class's one half: "Tome ×1"). */
export function handLine(classId: RpgClass, hand: RpgHand, engine?: number): string {
  const halves = [...new Set(rpgClassSlots(classId, engine).map((s) => (s === 'tome' ? 'tome' : 'arms')))]
  return halves.map((h) => `${h === 'tome' ? 'Tome' : 'Arms'} ×${+hand[h].toFixed(2)}`).join(' + ')
}
/** A node's rank words: "Rank 3 · next at Class Rank 14", "Rank 5", or its gate while closed ("Class Rank 20"). */
export function rankText(node: Pick<RpgTreeViewNode, 'open' | 'rank' | 'nextRankAt' | 'gate'>): string {
  if (!node.open) return `Class Rank ${node.gate}`
  return node.nextRankAt === null ? `Rank ${node.rank}` : `Rank ${node.rank} · next at Class Rank ${node.nextRankAt}`
}
/** A node's line at her Skill Rank (CP32): v16's def (Pierce, the Paladin's revive), its power × her rank's factor. */
export function nodeLine(profile: Pick<RpgProfile, 'classId' | 'tier' | 'classRank'>, node: Pick<RpgTreeViewNode, 'id' | 'depth'>,
  engine: number = BATTLE_ENGINE_VERSION): string {
  const def = rpgNodeSkill(rpgNode(node.id)!, engine)
  return skillLine(profile, def, engine, rpgSkillRankFactor(node.depth, profile.classRank, engine))
}
const branchTitle = (tree: Pick<RpgTreeViewTree, 'bName'>, branch: RpgBranch) => (branch === 'B' ? `B · ${tree.bName}` : 'A')

export function SkillTree({ outfit, uma, world, tier, classId, profile, view, loadout }: {
  outfit: BattleOutfit & TemplateOutfit
  uma: OwnedUma
  world: TierWorld
  tier: number
  classId: RpgClass
  profile: RpgProfile
  view: RpgTreeView
  /** What she equips now, in order: her pick, or the one chosen for her. */
  loadout: readonly string[]
}) {
  const [treeIndex, setTreeIndex] = useState(0)
  const [slotPick, setSlotPick] = useState<number | null>(null)
  const [classSheet, setClassSheet] = useState(false)
  const [nodeSheet, setNodeSheet] = useState<RpgTreeViewNode | null>(null)
  const [branchSheet, setBranchSheet] = useState<RpgBranch | null>(null)
  const [error, setError] = useState<string | null>(null)
  const setup = classOf(uma, classId)
  const gear = gearV1(uma)
  const tree = view.trees[Math.min(treeIndex, view.trees.length - 1)]!
  const shown = [...loadout]
  const auto = setup.loadout === null
  const upgrades = umaUpgrades(world, outfit, tier)
  // A graded Uma (save v28, R2) has a grade on each weapon slot and no pieces; a v27 one her pieces and their slots.
  const graded = isGrades(uma.gear) ? uma.gear : null
  const better: readonly string[] = graded ? (upgrades?.grades ?? []).flatMap((g) => (g.kind === 'weapon' ? [g.weapon] : [])) : upgrades?.gearSlots ?? []
  const rank = classRankOf(uma.ranks, classId)
  const slots = rpgActiveSlots(uma.level)
  const flourish = rootFlourish(outfit, uma, classId)
  const run = (op: () => Promise<void>) => {
    setError(null)
    op().catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  const toggleEquip = (id: string) => {
    if (shown.includes(id)) return run(() => equip(outfit, classId, shown.filter((x) => x !== id)))
    if (shown.length >= slots) return setError(`All ${slots} skill slots are full: unequip one first`)
    run(() => equip(outfit, classId, [...shown, id]))
  }
  const switchTo = (next: RpgClass) => {
    if (next === classId) return
    setTreeIndex(0)
    setClassSheet(false)
    run(() => pickClass(outfit.outfitId, next))
  }
  const trunk = tree.nodes.filter((n) => n.line === 'trunk')
  const line = (b: RpgBranch) => tree.nodes.filter((n) => n.line === b)

  const allNodes = view.trees.flatMap((item) => item.nodes)
  return (
    <div className="space-y-2">
      <section className="space-y-1.5 rounded-sm bg-raised p-2">
        <div className="flex items-center justify-between">
          <h4 className="text-micro">Class and trees</h4>
          <HelpButton title="Classes and skills">
            <p>{CLASS_BLURB[classId]}</p>
            <p>Switching class is free; each class keeps its own weapons, skills and loadout.</p>
            <p>A party fights with one healer at most: a Paladin or a Cleric.</p>
            <p>Each weapon opens its tree. Depths open at Class Rank 1, 10, 20, 30 and 40. At depth 3 the tree forks: branch A or B, free to swap. Every skill gains a rank every 2 Class Ranks, up to 5. Her Uma Level sets how many skills she can equip; until you pick, they are chosen for her.</p>
            {graded ? <p>Weapon grades are raised with Arms Gems or Tome Ink on the Gear tab; any grade opens the tree.</p>
              : <p>A Training weapon has no stats, but it opens the tree. A crafted weapon does the same and adds its stats.</p>}
          </HelpButton>
        </div>
        <div className="grid grid-cols-4 gap-1" aria-label="Class and skill trees">
          <button type="button" onClick={() => setClassSheet(true)} aria-label={`Class: ${CLASS_LABEL[classId]}, Rank ${rank}`}
            className="relative flex min-h-14 flex-col items-center justify-center rounded-sm bg-panel px-1 text-center">
            <ClassEmblem classId={classId} />
            <span className="w-full truncate text-[10px] font-semibold">{CLASS_LABEL[classId]}</span>
            <span className="absolute right-1 top-1 rounded-full bg-sunken px-1 text-[8.5px] font-bold text-ink-soft">R{rank}</span>
          </button>
          <div className="contents" role="tablist" aria-label="Trees">
            {view.trees.map((item, i) => {
              const piece = !graded && gear.equipped[item.weapon] ? gearById(gear.equipped[item.weapon]!) : undefined
              const grade = graded ? gradeOf(graded, { kind: 'weapon', weapon: item.weapon }) : piece?.grade ?? 0
              const mark = better.includes(item.weapon)
              return (
                <button key={`${i}-${item.weapon}`} type="button" role="tab" aria-selected={item === tree}
                  aria-label={`${WEAPON_LABEL[item.weapon]}, branch ${item.branch}${mark ? ', can upgrade' : ''}`}
                  onClick={() => setTreeIndex(i)}
                  className={`relative flex min-h-14 items-center justify-center rounded-sm border ${item === tree ? 'border-accent bg-panel text-ink shadow-1' : 'border-transparent bg-sunken text-ink-soft'}`}>
                  {mark && <UpgradeMark size={13} className="absolute right-1 top-1" />}
                  <WeaponGlyph weapon={item.weapon} size={24} />
                  <span className={`absolute left-1 top-1 rounded-full px-1 text-[8.5px] font-bold ${item.branch === 'B' ? 'bg-accent text-accent-ink' : 'bg-page text-ink-soft'}`}>{item.branch}</span>
                  <span className={`absolute bottom-1 right-1 text-[8.5px] font-bold ${grade > 0 ? 'text-accent' : 'text-ink-faint'}`}>{graded || piece ? `G${grade}` : 'T'}</span>
                </button>
              )
            })}
          </div>
        </div>
        <p className={`truncate px-1 text-[10.5px] ${flourish.off ? 'text-ink-faint' : 'font-semibold text-accent'}`}>
          {flourish.line}{flourish.off ? ` · ${flourish.off}` : ''}
        </p>
        <div className="rounded-xs bg-panel px-2 py-1.5">
          <RankRow label={CLASS_LABEL[classId]} kind="class" track={classTrack(uma.ranks, classId)} />
          <p className="text-[9.5px] text-ink-faint">Depth{rpgOpenDepth(rank) > 1 ? `s 1–${rpgOpenDepth(rank)}` : ' 1'} open</p>
        </div>
      </section>

      <section className="rounded-sm bg-raised p-2">
        <div className="mb-1 flex min-h-9 items-center justify-between">
          <h4 className="text-micro">Equipped · {shown.length}/{slots}</h4>
          {auto ? <span className="rounded-full bg-panel px-2 py-0.5 text-[10px] font-semibold text-ink-soft">Auto</span>
            : <button type="button" onClick={() => run(() => equip(outfit, classId, null))} className="min-h-9 px-1 text-[11px] font-semibold text-accent">Back to auto</button>}
        </div>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${slots}, minmax(0, 1fr))` }} aria-label="Equipped skills">
          {Array.from({ length: slots }, (_, i) => {
            const id = shown[i]
            const item = id ? allNodes.find((candidate) => candidate.id === id) : null
            return item ? (
              <button key={item.id} type="button" onClick={() => toggleEquip(item.id)} aria-label={`Unequip ${item.name}`}
                className="relative flex min-h-11 items-center justify-center rounded-sm border border-accent bg-sunken">
                <SkillMarks node={item} />
                <span className="absolute bottom-0.5 right-0.5 rounded-full bg-accent px-1 text-[8px] font-bold leading-3 text-accent-ink">{item.rank}</span>
              </button>
            ) : <span key={`empty-${i}`} className="min-h-11 rounded-sm border border-dashed border-hairline-strong" aria-hidden />
          })}
        </div>
      </section>

      <section className="rounded-sm bg-raised p-2">
        <div className="flex min-h-11 items-center justify-between gap-2">
          <p className="flex min-w-0 items-center gap-1.5 text-[12px] font-semibold">
            <WeaponGlyph weapon={tree.weapon} size={18} />
            <span className="truncate">{WEAPON_LABEL[tree.weapon]} tree</span>
          </p>
          <button type="button" onClick={() => setSlotPick(treeIndex)} className="min-h-11 shrink-0 px-2 text-[11px] font-semibold text-ink-soft"
            aria-label={`Change ${WEAPON_LABEL[tree.weapon]}`}>Change</button>
        </div>
        <div className="rounded-sm bg-panel p-2" aria-label={`${WEAPON_LABEL[tree.weapon]} tree`}>
          <div className="flex flex-col items-center">
            {trunk.map((node, i) => (
              <div key={node.id}>
                {i > 0 && <Stem on={node.open} />}
                <TreeNodeButton node={node} onPath equippedIn={shown.includes(node.id)} onOpen={() => setNodeSheet(node)} />
              </div>
            ))}
          </div>
          <Fork held={tree.branch} open={line(tree.branch)[0]?.open ?? false} />
          <div className="grid grid-cols-2 gap-6">
            {(['A', 'B'] as const).map((branch) => {
              const mine = tree.branch === branch
              return (
                <div key={branch} role="group" className="flex min-w-0 flex-col items-center" aria-label={`Branch ${branchTitle(tree, branch)}${mine ? ', hers' : ''}`}>
                  <button type="button" onClick={() => setBranchSheet(branch)}
                    aria-label={`Branch ${branchTitle(tree, branch)}${mine ? ', hers' : ''}`}
                    className={`mb-1 flex size-12 items-center justify-center rounded-sm text-[13px] font-bold ${mine ? 'bg-accent text-accent-ink' : 'border border-hairline-strong bg-page text-ink-soft'}`}>
                    {branch}
                  </button>
                  {line(branch).map((node, i) => (
                    <div key={node.id}>
                      {i > 0 && <Stem on={mine && node.open} />}
                      <TreeNodeButton node={node} onPath={mine} equippedIn={shown.includes(node.id)} onOpen={() => setNodeSheet(node)} />
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </section>
      {error && <p className="sticky bottom-2 rounded-sm bg-danger/90 p-2 text-center text-[13px]">{error}</p>}

      {slotPick !== null && (
        <WeaponSheet outfitId={outfit.outfitId} uma={uma} world={world} classId={classId} slot={slotPick} onClose={() => setSlotPick(null)} />
      )}
      {branchSheet && (
        <BranchSheet tree={tree} branch={branchSheet} profile={profile} onClose={() => setBranchSheet(null)}
          onTake={() => run(async () => {
            await takeBranch(outfit, classId, tree.weapon, branchSheet)
            setBranchSheet(null)
          })} />
      )}
      {classSheet && (
        <BottomSheet title="Class" onClose={() => setClassSheet(false)}>
          <div className="space-y-2">
            <div className="rounded-sm bg-raised p-2" aria-label="Her root">
              <p className="flex items-center gap-1.5 text-[13px]">
                <ClassEmblem classId={view.root.classId} />
                <span className="font-semibold">{CLASS_LABEL[view.root.classId]}</span>
                <span className="text-ink-soft">· {handLine(view.root.classId, view.root.hand)}</span>
              </p>
              <p className={`mt-0.5 text-[11px] ${flourish.off ? 'text-ink-faint' : 'font-semibold text-accent'}`}>{flourish.line}</p>
            </div>
            <ClassPicker uma={uma} classId={classId} onPick={switchTo} />
          </div>
        </BottomSheet>
      )}
      {nodeSheet && (
        <SkillNodeSheet node={nodeSheet} profile={profile} equipped={shown.includes(nodeSheet.id)} onClose={() => setNodeSheet(null)}
          onEquip={nodeSheet.held && nodeSheet.open ? () => { toggleEquip(nodeSheet.id); setNodeSheet(null) } : undefined} />
      )}
    </div>
  )
}

/** A line joining two depths: filled on her path at an open depth. */
function Stem({ on }: { on: boolean }) {
  return <span aria-hidden className={`mx-auto block h-2 w-0.5 ${on ? 'bg-accent' : 'bg-hairline-strong'}`} />
}
/** The fork under depth 2: one stem into a bar that drops into each branch's column, her branch's side filled. */
function Fork({ held, open }: { held: RpgBranch; open: boolean }) {
  const tone = (b: RpgBranch) => (b === held && open ? 'bg-accent' : 'bg-hairline-strong')
  return (
    <div aria-hidden className="relative h-4">
      <span className={`absolute left-1/2 top-0 h-2 w-0.5 -translate-x-1/2 ${open ? 'bg-accent' : 'bg-hairline-strong'}`} />
      <span className={`absolute top-2 h-0.5 ${tone('A')}`} style={{ left: 'calc(25% - 2px)', right: '50%' }} />
      <span className={`absolute top-2 h-0.5 ${tone('B')}`} style={{ left: '50%', right: 'calc(25% - 2px)' }} />
      <span className={`absolute top-2 h-2 w-0.5 ${tone('A')}`} style={{ left: 'calc(25% - 2px)' }} />
      <span className={`absolute top-2 h-2 w-0.5 ${tone('B')}`} style={{ left: 'calc(75% + 1px)' }} />
    </div>
  )
}

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
function SkillMarks({ node }: { node: RpgTreeViewNode }) {
  const base = rpgNode(node.id)!
  const def = rpgNodeSkill(base, BATTLE_ENGINE_VERSION)
  const kinds = skillKinds(def)
  return <span className="flex items-center justify-center gap-0.5">{kinds.length
    ? kinds.slice(0, 2).map((kind) => <KindMark key={kind} kind={kind} size={kinds.length > 1 ? 15 : 19} />)
    : <WeaponGlyph weapon={base.weapon} size={19} />}</span>
}

/** One icon node: ring/fill/path, rank or gate badge and equipped mark. Tap for its exact line and action. */
function TreeNodeButton({ node, onPath, equippedIn, onOpen }: {
  node: RpgTreeViewNode
  onPath: boolean
  equippedIn: boolean
  onOpen: () => void
}) {
  const held = node.held && node.open
  const state = !node.open ? `closed until Class Rank ${node.gate}` : `${rankText(node)}${equippedIn ? ', equipped' : ''}`
  return (
    <button type="button" onClick={onOpen} data-node={node.id} data-held={held || undefined}
      aria-label={`${node.name}, ${state}`}
      className={`relative flex size-12 items-center justify-center rounded-full border-2 ${equippedIn ? 'border-accent bg-accent text-accent-ink shadow-2' : held ? 'border-accent bg-accent/10' : 'border-hairline-strong bg-raised'} ${!node.open ? 'opacity-40' : !onPath ? 'opacity-55' : ''}`}>
      <SkillMarks node={node} />
      <span className={`absolute -right-1 -top-1 min-w-4 rounded-full px-1 text-[8px] font-bold leading-4 ${node.open ? 'bg-page text-ink-soft ring-1 ring-hairline-strong' : 'bg-sunken text-ink-faint'}`}>
        {node.open ? node.rank : node.gate}
      </span>
      {equippedIn && <span aria-hidden className="absolute -bottom-0.5 -left-0.5 size-2.5 rounded-full border-2 border-panel bg-success" />}
    </button>
  )
}

function SkillNodeSheet({ node, profile, equipped, onClose, onEquip }: {
  node: RpgTreeViewNode
  profile: RpgProfile
  equipped: boolean
  onClose: () => void
  onEquip?: () => void
}) {
  return (
    <BottomSheet title={node.name} onClose={onClose} footer={onEquip ? (
      <button type="button" onClick={onEquip} className={`min-h-12 w-full rounded-sm font-display font-bold ${equipped ? 'bg-raised text-ink' : 'bg-accent text-accent-ink'}`}>
        {equipped ? 'Unequip' : 'Equip'}
      </button>
    ) : undefined}>
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-sm bg-raised p-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-accent/10"><SkillMarks node={node} /></span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[12px] font-semibold"><RankPips rank={node.open ? node.rank : 0} /> {rankText(node)}</p>
            <p className="text-[11px] text-ink-faint">Depth {node.depth} · {node.line === 'trunk' ? 'Trunk' : `Branch ${node.line}`}</p>
          </div>
        </div>
        <p className="rounded-sm bg-raised p-3 text-[13px] text-ink-soft">{nodeLine(profile, node)}</p>
      </div>
    </BottomSheet>
  )
}

/** A branch's sheet: its three skills; "Take branch B" when it isn't hers (free; her equipped skills follow). */
function BranchSheet({ tree, branch, profile, onClose, onTake }: {
  tree: RpgTreeViewTree; branch: RpgBranch; profile: RpgProfile; onClose: () => void; onTake: () => void
}) {
  const nodes = tree.nodes.filter((n) => n.line === branch)
  const hers = tree.branch === branch
  return (
    <BottomSheet title={`${WEAPON_LABEL[tree.weapon]} · ${branchTitle(tree, branch)}`} onClose={onClose}
      footer={hers ? undefined : (
        <button type="button" onClick={onTake} className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink">Take branch {branch}</button>
      )}>
      <ul className="space-y-1.5">
        {nodes.map((n) => (
          <li key={n.id} className="rounded-sm bg-raised p-2">
            <p className="flex items-center justify-between gap-2 text-[13px] font-semibold">
              <span className="min-w-0 truncate">{n.name}</span>
              <span className="shrink-0 text-[11px] font-normal text-ink-faint">Depth {n.depth} · Class Rank {n.gate}</span>
            </p>
            <p className="text-[11.5px] leading-snug text-ink-soft">{nodeLine(profile, n)}</p>
          </li>
        ))}
      </ul>
      {hers && <p className="mt-2 text-center text-[12px] text-ink-faint">Her branch</p>}
    </BottomSheet>
  )
}
