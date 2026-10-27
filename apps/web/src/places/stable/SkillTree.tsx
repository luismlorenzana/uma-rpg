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
    run(() => pickClass(outfit.outfitId, next))
  }
  const trunk = tree.nodes.filter((n) => n.line === 'trunk')
  const line = (b: RpgBranch) => tree.nodes.filter((n) => n.line === b)

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <div className="-my-2 flex items-center justify-between">
          <h4 className="text-micro">Class</h4>
          <HelpButton title="Classes and skills">
            <p>{CLASS_BLURB[classId]}</p>
            <p>Switching class is free; each class keeps its own weapons, skills and loadout.</p>
            <p>A party fights with one healer at most: a Paladin or a Cleric.</p>
            <p>Each weapon in her three slots opens its tree. Depths open at Class Rank 1, 10, 20, 30 and 40. At depth 3 the tree forks: branch A or B, free to swap. Every skill gains a rank every 2 Class Ranks, up to 5. Her Uma Level sets how many skills she can equip; until you pick, they are chosen for her.</p>
            {graded ? <p>Each of her weapons has a grade, G0 to G10, raised with Arms Gems or Tome Ink on the Gear tab; any grade opens the tree.</p>
              : <p>She holds a Training weapon of every kind: no stats, but it opens the tree. A crafted weapon from the Forge does the same and adds its stats.</p>}
          </HelpButton>
        </div>
        <div className="rounded-md bg-raised px-3 py-2" aria-label="Her root">
          <p className="flex items-center gap-1.5 text-[13px]">
            <ClassEmblem classId={view.root.classId} />
            <span className="font-semibold">{CLASS_LABEL[view.root.classId]}</span>
            <span className="text-ink-soft">· {handLine(view.root.classId, view.root.hand)}</span>
          </p>
          <p className="mt-0.5 text-[11.5px] leading-snug">
            <span className={flourish.off ? 'text-ink-faint opacity-60' : 'font-semibold text-accent'}>{flourish.line}</span>
            {flourish.off && <span className="block text-[11px] text-ink-faint">{flourish.off}</span>}
          </p>
        </div>
        <ClassPicker uma={uma} classId={classId} onPick={switchTo} />
        <div>
          <h4 className="text-micro mb-1">Weapons</h4>
          <div className="grid grid-cols-3 gap-1" aria-label="Weapon slots">
            {view.trees.map((t, i) => {
              const piece = !graded && gear.equipped[t.weapon] ? gearById(gear.equipped[t.weapon]!) : undefined
              const grade = graded ? gradeOf(graded, { kind: 'weapon', weapon: t.weapon }) : piece?.grade ?? 0
              const mark = better.includes(t.weapon)
              return (
                <button key={`${i}-${t.weapon}`} type="button" onClick={() => setSlotPick(i)}
                  aria-label={`Weapon ${i + 1}: ${graded ? `${WEAPON_LABEL[t.weapon]} · G${grade}` : piece ? piece.name : `Training ${WEAPON_LABEL[t.weapon]}`}, branch ${t.branch}${mark ? ', can upgrade' : ''}`}
                  className="relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-sm bg-raised px-0.5 text-center">
                  {mark && <UpgradeMark size={14} className="absolute top-1 right-1" />}
                  <span className="absolute top-1 left-1.5 text-[9.5px] font-bold leading-none text-ink-faint">{t.branch}</span>
                  <WeaponGlyph weapon={t.weapon} size={18} />
                  <span className="w-full truncate text-[11px] font-semibold leading-tight">{WEAPON_LABEL[t.weapon]}</span>
                  <span className={`text-[10px] leading-none ${grade > 0 ? 'font-semibold text-accent' : 'text-ink-faint'}`}>{graded || piece ? `G${grade}` : 'Training'}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="rounded-sm bg-raised px-2.5 py-2">
          <RankRow label={CLASS_LABEL[classId]} kind="class" track={classTrack(uma.ranks, classId)} />
          <p className="mt-0.5 text-[11px] text-ink-faint">Depth{rpgOpenDepth(rank) > 1 ? `s 1–${rpgOpenDepth(rank)}` : ' 1'} open</p>
        </div>
      </section>

      <section>
        <h4 className="text-micro mb-1.5">Equipped · {shown.length}/{slots}{auto ? ' · chosen for her' : ''}</h4>
        {shown.length === 0 ? (
          <p className="text-[12px] text-ink-faint">No skills yet</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {shown.map((id) => {
              const node = rpgNode(id)
              return node ? (
                <button key={id} type="button" onClick={() => toggleEquip(id)} className="flex min-h-9 items-center gap-1 rounded-full bg-accent/15 px-2.5 text-[12px] font-semibold text-accent" aria-label={`Unequip ${node.name}`}>
                  <WeaponGlyph weapon={node.weapon} size={12} />
                  {node.name} ×
                </button>
              ) : null
            })}
          </div>
        )}
        <p className="mt-1.5 text-[11px] text-ink-faint">
          {auto ? <span className="rounded-full bg-panel px-2 py-0.5 font-semibold">Auto</span>
            : <button type="button" onClick={() => run(() => equip(outfit, classId, null))} className="min-h-9 font-semibold text-accent">Back to auto</button>}
        </p>
      </section>

      <section>
        <h4 className="text-micro mb-1.5">Skill trees · one per weapon</h4>
        <div className="mb-2 grid grid-cols-3 gap-1 rounded-sm bg-sunken p-1" role="tablist" aria-label="Trees">
          {view.trees.map((t, i) => (
            <button key={t.weapon} type="button" role="tab" aria-selected={t === tree} aria-label={`${WEAPON_LABEL[t.weapon]}, branch ${t.branch}`}
              onClick={() => setTreeIndex(i)}
              className={`flex min-h-11 items-center justify-center gap-1 rounded-xs px-1 text-[11px] font-semibold ${t === tree ? 'bg-raised text-ink shadow-2' : 'text-ink-soft'}`}>
              <WeaponGlyph weapon={t.weapon} size={15} />
              <span className="min-w-0 truncate">{WEAPON_LABEL[t.weapon].replace(' Tome', '')}</span>
              <span className={`shrink-0 rounded-full px-1 text-[9.5px] font-bold leading-4 ${t.branch === 'B' ? 'bg-accent text-accent-ink' : 'bg-panel text-ink-soft'}`}>{t.branch}</span>
            </button>
          ))}
        </div>
        <div className="rounded-md bg-panel p-2" aria-label={`${WEAPON_LABEL[tree.weapon]} tree`}>
          {trunk.map((n, i) => (
            <div key={n.id}>
              {i > 0 && <Stem on={n.open} />}
              <TreeNode node={n} profile={profile} onPath equippedIn={shown.includes(n.id)} onEquip={n.held && n.open ? () => toggleEquip(n.id) : undefined} />
            </div>
          ))}
          <Fork held={tree.branch} open={line(tree.branch)[0]?.open ?? false} />
          <div className="grid grid-cols-2 gap-2">
            {(['A', 'B'] as const).map((b) => {
              const mine = tree.branch === b
              return (
                <div key={b} role="group" className="min-w-0" aria-label={`Branch ${branchTitle(tree, b)}${mine ? ', hers' : ''}`}>
                  <button type="button" onClick={() => setBranchSheet(b)}
                    className={`mb-1 flex min-h-9 w-full items-center justify-center rounded-sm px-1 text-[12px] font-bold ${mine ? 'bg-accent text-accent-ink' : 'border border-hairline-strong text-ink-soft'}`}>
                    {branchTitle(tree, b)}
                  </button>
                  {line(b).map((n, i) => (
                    <div key={n.id}>
                      {i > 0 && <Stem on={mine && n.open} />}
                      <TreeNode node={n} profile={profile} onPath={mine} compact equippedIn={shown.includes(n.id)}
                        onEquip={n.held && n.open ? () => toggleEquip(n.id) : undefined} />
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

/** One node: her path's filled, the other branch dimmed, a closed depth faded with its gate; a held node at an open depth
 * shows its pips, its rank, its line and Equip. */
function TreeNode({ node, profile, onPath, equippedIn, onEquip, compact = false }: {
  node: RpgTreeViewNode
  profile: RpgProfile
  onPath: boolean
  equippedIn: boolean
  onEquip?: () => void
  compact?: boolean
}) {
  const def = rpgNodeSkill(rpgNode(node.id)!, BATTLE_ENGINE_VERSION)
  const held = node.held && node.open
  return (
    <div data-node={node.id} data-held={held || undefined}
      className={`min-h-11 rounded-sm border px-2 py-1.5 ${held ? 'border-accent/60 bg-accent/10' : 'border-hairline'} ${!node.open ? 'opacity-45' : !onPath ? 'opacity-55' : ''}`}>
      <p className={`flex items-center gap-1 font-semibold ${compact ? 'text-[11.5px]' : 'text-[12.5px]'}`}>
        {skillKinds(def).map((k) => <KindMark key={k} kind={k} size={12} />)}
        <span className="min-w-0 flex-1 truncate">{node.name}</span>
      </p>
      <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[10.5px] leading-snug text-ink-soft">
        <RankPips rank={node.open ? node.rank : 0} />
        <span>{rankText(node)}</span>
      </p>
      <p className="mt-0.5 text-[10.5px] leading-snug text-ink-soft">{nodeLine(profile, node)}</p>
      {onEquip && (
        <button type="button" onClick={onEquip} aria-pressed={equippedIn}
          className={`mt-1 min-h-9 w-full rounded-xs px-2 text-[11.5px] font-semibold ${equippedIn ? 'bg-accent text-accent-ink' : 'bg-raised text-ink'}`}>
          {equippedIn ? 'Equipped' : 'Equip'}
        </button>
      )}
    </div>
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
