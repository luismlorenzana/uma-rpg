// The Class tab (H120; D239 UP10–UP12, D240 CV32; proposal §4.1): her class and three weapons as the first row, her equipped
// skills, the selected weapon's tree, and the Limit line. A tap opens one sheet, a square never unequips blind, and every
// change here is free. A Tier 1 tree is a trunk (depths 1–2), a fork at depth 3 into lines A and B down to depth 5, the held
// line filled, the other dimmed, a closed depth faded with its gate. A Tier 0's trees are one node each with her promotion
// line. The models are the domain's `rpgTreeView`, which reads the catalog (so only this lazy tab imports it), and
// `class-view.ts`.
import {
  activeClass, classOf, rpgActiveSlots, rpgRework, rpgTreeView, SaveRuleError, umaLoadout, umaProfile,
  type OwnedUma, type RosterOutfit, type RpgBranch, type RpgTier0Class, type RpgTier1Class, type RpgTreeViewNode, type TierWorld,
} from '@rpg/domain'
import { useMemo, useState } from 'react'
import { Bar, WEAPON_LABEL, WeaponGlyph } from '../../battle/labels'
import { ClassEmblem } from '../../battle/pixel-icons'
import { masterRoster } from '../../master/master'
import { equip, takeBranch, useActiveTier } from '../../save/game'
import { HelpButton } from '../../ui/HelpButton'
import { tier0RankWord } from '../../ui/rank-words'
import { classButton, limitView, promotionFrom, promotionLine, tier0NodeTitle } from './class-view'
import { LimitSheet, LineSheet, lineTitle, nodeLine, NodeSheet, rankText, SkillMarks } from './class-sheets'
import { ClassesSheet } from './ClassesSheet'
import { actions, equipped } from './copy'
import { PromotionSheet } from './PromotionSheet'
import { useSheetReturn } from './sheet-door'
import { WeaponSheet } from './WeaponSheet'

/** The one sheet open on this tab. Promote on a Ready tile and the promotion sheet's "Classes ›" swap two of them. */
type Sheet = { kind: 'classes' } | { kind: 'promotion'; from: RpgTier0Class; child: RpgTier1Class | null } | { kind: 'weapon'; slot: number }
  | { kind: 'node'; id: string } | { kind: 'line'; branch: RpgBranch } | { kind: 'limit' }

export function ClassTab({ outfit, uma, world }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld }) {
  const tier = useActiveTier()
  const classId = activeClass(outfit, uma, tier)
  const profile = umaProfile(outfit, uma, tier, classId)
  const refs = umaLoadout(outfit, uma, tier, classId)
  const view = rpgTreeView(profile, refs)!
  const shown = refs.map((r) => r.id)
  const [treeIndex, setTreeIndex] = useState(0)
  const back = useSheetReturn()
  const [sheet, setSheet] = useState<Sheet | null>(() => (back ? { kind: back } : null))
  const [error, setError] = useState<string | null>(null)
  const outfits = useMemo(() => new Map((masterRoster() ?? []).map((o) => [o.outfitId, o])), [])
  const button = classButton(outfit, uma, tier)
  const tree = view.trees[Math.min(treeIndex, view.trees.length - 1)]!
  const allNodes = view.trees.flatMap((item) => item.nodes)
  const auto = classOf(uma, classId).loadout === null
  const slots = rpgActiveSlots(uma.level)
  const limit = limitView(world, outfit.outfitId, classId, (id) => outfits.get(id)?.name ?? id)
  const run = (op: () => Promise<void>) => {
    setError(null)
    op().catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  const trunk = tree.nodes.filter((n) => n.line === 'trunk')
  const line = (b: RpgBranch) => tree.nodes.filter((n) => n.line === b)
  const tier0 = view.root.tier === 0 ? (classId as RpgTier0Class) : null
  const promotion = tier0 ? promotionLine(uma, tier0, tier) : null
  const openClass = () => setSheet(button.promote ? { kind: 'promotion', from: button.promote, child: null } : { kind: 'classes' })
  const toChild = (child: RpgTier1Class) => {
    const from = promotionFrom(outfit, uma, tier, child)
    setSheet(from ? { kind: 'promotion', from, child } : null)
  }
  const openNode = (node: RpgTreeViewNode) => { setError(null); setSheet({ kind: 'node', id: node.id }) }
  const nodeOpen = sheet?.kind === 'node' ? allNodes.find((n) => n.id === sheet.id) : undefined
  const nodeTree = nodeOpen ? view.trees.find((item) => item.nodes.includes(nodeOpen)) : undefined

  return (
    <div className="space-y-2" data-class-tab>
      <section className="flex items-stretch gap-1.5" aria-label="Class and skill trees">
        <button type="button" onClick={openClass} data-class-button aria-label={`Class: ${button.name}, ${button.promote ? 'promotion ready' : button.word}`}
          className="relative flex min-h-16 min-w-0 flex-1 flex-col justify-center gap-1 rounded-sm bg-raised px-2 text-left">
          <span className="flex min-w-0 items-center gap-1.5">
            <ClassEmblem classId={classId} />
            <span className="min-w-0 text-[12.5px] font-semibold leading-tight">{button.name}</span>
          </span>
          <span className={`flex items-center gap-1 text-[11px] font-bold leading-none ${button.promote ? 'text-ink' : 'text-ink-soft'}`}>
            {button.promote && <span aria-hidden className="size-1.5 rounded-full bg-success" />}{button.word}
          </span>
          <Bar className="h-1" value={button.bar.value} max={button.bar.max} tone="exp" />
        </button>
        <div className="contents" role="tablist" aria-label="Trees">
          {view.trees.map((item, i) => (
            <button key={`${i}-${item.weapon}`} type="button" role="tab" aria-selected={item === tree}
              aria-label={`${WEAPON_LABEL[item.weapon]}${tier0 ? '' : `, line ${item.branch}`}`}
              onClick={() => setTreeIndex(i)}
              className={`relative flex min-h-16 w-12 shrink-0 items-center justify-center rounded-sm bg-raised text-ink ${item === tree ? 'ring-2 ring-accent ring-inset' : ''}`}>
              <WeaponGlyph weapon={item.weapon} size={24} />
              {!tier0 && <span className={`absolute bottom-1 right-1 rounded-full px-1 text-[11px] font-bold leading-4 ${item.branch === 'B' ? 'bg-accent text-accent-ink' : 'bg-page text-ink-soft'}`}>{item.branch}</span>}
            </button>
          ))}
        </div>
        <span className="flex shrink-0 items-center">
          <HelpButton title="Classes and skills">
            <p>Switching class is free; each class keeps its own weapons, lines and skills.</p>
            <p>One healer a party: a Paladin or a Cleric.</p>
            <p>Depths open at R1, R10, R20, R30 and R40.</p>
            <p>A skill gains a rank every 2 Class Ranks, up to 5.</p>
            <p>Uma Level sets how many skills she equips; Auto picks until you do.</p>
            <p>Tier 0: Class Rank 1–10, one skill, any three weapons.</p>
            <p>At R10 each of its classes opens at R10, free; the others stay open.</p>
            <p>EXP past R10 waits for the promotion.</p>
            <p>Another family's class opens through its Tier 0 at R10.</p>
            <p>A Hero owns her seat's Limit Break; a Learner borrows it and builds a Bond.</p>
          </HelpButton>
        </span>
      </section>

      <section className="rounded-sm bg-raised px-2 pb-2">
        <div className="flex items-center justify-between">
          <h4 className="text-micro">{equipped(shown.length, slots)}</h4>
          <button type="button" aria-pressed={auto} disabled={auto} onClick={() => run(() => equip(outfit, classId, null))}
            className="flex min-h-11 items-center">
            <span className={`rounded-sm px-3 py-1 text-[12.5px] font-semibold ${auto ? 'bg-accent text-accent-ink' : 'bg-panel text-ink'}`}>{actions.auto}</span>
          </button>
        </div>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${slots}, minmax(0, 1fr))` }} aria-label="Equipped skills">
          {Array.from({ length: slots }, (_, i) => {
            const id = shown[i]
            const item = id ? allNodes.find((candidate) => candidate.id === id) : null
            return item ? (
              <button key={item.id} type="button" onClick={() => openNode(item)} aria-label={item.name}
                className="relative flex min-h-11 items-center justify-center rounded-sm border border-accent bg-sunken">
                <SkillMarks node={item} />
                <span className="absolute bottom-0 right-0 rounded-full bg-accent px-1 text-[11px] font-bold leading-4 text-accent-ink">{item.rank}</span>
              </button>
            ) : <span key={`empty-${i}`} className="min-h-11 rounded-sm border border-dashed border-hairline-strong" aria-hidden />
          })}
        </div>
      </section>

      <section className="rounded-sm bg-raised px-2 pb-2">
        <div className="flex min-h-11 items-center justify-between gap-2">
          <h4 className="text-micro">{WEAPON_LABEL[tree.weapon]} tree</h4>
          <button type="button" onClick={() => { setError(null); setSheet({ kind: 'weapon', slot: treeIndex }) }} className="min-h-11 shrink-0 px-2 text-[12.5px] font-semibold text-ink-soft"
            aria-label={`Change ${WEAPON_LABEL[tree.weapon]}`}>Change ›</button>
        </div>
        {tier0 ? (
          <div className="space-y-2 rounded-sm bg-panel p-2" aria-label={`${WEAPON_LABEL[tree.weapon]} tree`}>
            {trunk.map((node) => (
              <Tier0Node key={node.id} node={node} title={tier0NodeTitle(node.name, WEAPON_LABEL[tree.weapon])} line={nodeLine(profile, node)}
                equippedIn={shown.includes(node.id)} onOpen={() => openNode(node)} />
            ))}
            {promotion && (promotion.opens ? (
              <button type="button" onClick={() => setSheet({ kind: 'promotion', from: tier0, child: null })} data-promotion-line
                className="flex min-h-11 w-full items-center justify-between gap-2 rounded-sm bg-raised px-2.5 text-left">
                <span className="text-[12.5px] font-semibold">{promotion.text}</span>
                <span className="flex shrink-0 items-center gap-1.5 text-ink-faint">
                  <span aria-hidden className="size-1.5 rounded-full bg-success" />›
                </span>
              </button>
            ) : (
              <div className="px-1" data-promotion-line>
                <p className="text-[12.5px] font-semibold">{promotion.text}</p>
                <Bar className="mt-1" value={promotion.value} max={promotion.max} tone="exp" />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-sm bg-panel p-2" aria-label={`${WEAPON_LABEL[tree.weapon]} tree`}>
            <div className="flex flex-col items-center">
              {trunk.map((node, i) => (
                <div key={node.id}>
                  {i > 0 && <Stem on={node.open} />}
                  <TreeNodeButton node={node} onPath equippedIn={shown.includes(node.id)} onOpen={() => openNode(node)} />
                </div>
              ))}
            </div>
            <Fork held={tree.branch} open={line(tree.branch)[0]?.open ?? false} />
            <div className="grid grid-cols-2 gap-6">
              {(['A', 'B'] as const).map((branch) => {
                const mine = tree.branch === branch
                const name = `${lineTitle(tree, branch)}${mine ? ', held' : ''}`
                return (
                  <div key={branch} role="group" className="flex min-w-0 flex-col items-center" aria-label={name}>
                    <button type="button" onClick={() => { setError(null); setSheet({ kind: 'line', branch }) }} aria-label={name}
                      className={`mb-1 flex size-12 items-center justify-center rounded-sm text-[14px] font-bold ${mine ? 'bg-accent text-accent-ink' : 'border border-hairline-strong bg-page text-ink-soft'}`}>
                      {branch}
                    </button>
                    {line(branch).map((node, i) => (
                      <div key={node.id}>
                        {i > 0 && <Stem on={mine && node.open} />}
                        <TreeNodeButton node={node} onPath={mine} equippedIn={shown.includes(node.id)} onOpen={() => openNode(node)} />
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      <button type="button" onClick={() => setSheet({ kind: 'limit' })} data-limit-line aria-label={`Limit: ${limit.line}`}
        className="flex min-h-11 w-full items-center gap-2 rounded-sm bg-raised px-2.5 text-left">
        <span className="text-micro shrink-0">Limit</span>
        <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold">{limit.line}</span>
        <span className="shrink-0 text-ink-faint">›</span>
      </button>

      {sheet?.kind === 'weapon' && (
        <WeaponSheet outfitId={outfit.outfitId} uma={uma} world={world} classId={classId} slot={sheet.slot} onClose={() => setSheet(null)} />
      )}
      {sheet?.kind === 'line' && (
        <LineSheet tree={tree} branch={sheet.branch} profile={profile} error={error} onClose={() => setSheet(null)}
          onTake={() => run(() => takeBranch(outfit, classId, tree.weapon, sheet.branch))} />
      )}
      {sheet?.kind === 'classes' && (
        <ClassesSheet outfit={outfit} uma={uma} world={world} tier={tier} outfits={outfits} onClose={() => setSheet(null)}
          onPromote={toChild} onSwitch={() => setTreeIndex(0)} />
      )}
      {sheet?.kind === 'promotion' && (
        <PromotionSheet outfit={outfit} uma={uma} tier={tier} from={sheet.from} child={sheet.child} onClose={() => setSheet(null)}
          onClasses={() => setSheet({ kind: 'classes' })} onPromoted={() => { setTreeIndex(0); setSheet(null) }} />
      )}
      {nodeOpen && nodeTree && (
        <NodeSheet node={nodeOpen} profile={profile} tier0={!!tier0} shown={shown} slots={slots} nodes={allNodes} error={error} onClose={() => setSheet(null)}
          onEquip={(loadout) => run(() => equip(outfit, classId, loadout))}
          onTakeLine={(next) => run(() => takeBranch(outfit, classId, nodeTree.weapon, next))} />
      )}
      {sheet?.kind === 'limit' && <LimitSheet view={limit} onClose={() => setSheet(null)} />}
    </div>
  )
}

/** A Tier 0's one node (CV6): her skill and the weapon that casts it, its line at her Class Rank, and its rank, which is her
 * Class Rank ("R7/10"); no fork. Tap: its node sheet. */
function Tier0Node({ node, title, line, equippedIn, onOpen }: {
  node: RpgTreeViewNode; title: string; line: string; equippedIn: boolean; onOpen: () => void
}) {
  return (
    <button type="button" onClick={onOpen} data-node={node.id} data-held={node.held || undefined}
      aria-label={`${title}, ${tier0RankWord(node.rank)}${equippedIn ? ', equipped' : ''}`}
      className="flex min-h-14 w-full items-center gap-2.5 rounded-sm text-left">
      {/* Her three are always equipped (three slots from Lv 1): the ring keeps the kind's colour readable. */}
      <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
        <SkillMarks node={node} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-semibold">{title}</span>
        <span className="block text-[11px] text-ink-soft">{line}</span>
      </span>
      <span className="shrink-0 rounded-full bg-sunken px-1.5 py-0.5 text-[11px] font-bold text-ink-soft">{tier0RankWord(node.rank)}</span>
    </button>
  )
}

/** A line joining two depths: filled on her path at an open depth. */
function Stem({ on }: { on: boolean }) {
  return <span aria-hidden className={`mx-auto block h-2 w-0.5 ${on ? 'bg-accent' : 'bg-hairline-strong'}`} />
}
/** The fork under depth 2: one stem into a bar that drops into each line's column, her line's side filled. */
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

/** One icon node: its fill for the state (equipped On, held ringed, the other line dimmed, closed faded), its rank or gate
 * badge. Tap for its line and action. */
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
      <span className={`absolute -right-1 -top-1 min-w-4 rounded-full px-1 text-center text-[11px] font-bold leading-4 ${node.open ? 'bg-page text-ink-soft ring-1 ring-hairline-strong' : 'bg-sunken text-ink-faint'}`}>
        {node.open ? node.rank : node.gate}
      </span>
    </button>
  )
}
