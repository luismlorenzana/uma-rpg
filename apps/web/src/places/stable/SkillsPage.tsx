// An Uma's class builds and skills (S3, D49): pick the build she fights with, spend her points in each build's two
// trees (every build gets the full budget), and choose which skills she equips. Her class rank opens the depths: rank 1
// learns nothing, each rank one depth more (S5, D57); the class halls train it.
import {
  activeBuild, buildOf, CLASS_HALLS, placeById, RPG_BUILD, RPG_BUILDS, RPG_WEAPON_KINDS, rpgActiveSlots, rpgBuildTrees, rpgLearnBlock, rpgNode,
  rpgTreeBranches, rpgTreeNodes, rpgTreePointsEarned, rpgTreePointsSpent, SaveRuleError, umaProfile, type BattleOutfit, type RpgBuildId,
  type RpgNode,
} from '@rpg/domain'
import { useState } from 'react'
import {
  BRANCH_LABEL, BUILD_LABEL, CLASS_BLURB, CLASS_LABEL, KindMark, skillKinds, skillLine, TREE_LABEL, WEAPON_KIND_LABEL, WeaponGlyph,
} from '../../battle/labels'
import { chooseFamiliar, equip, learn, pickBuild, unlearn, useWorld } from '../../save/game'

export function SkillsPage({ outfit, name }: { outfit: BattleOutfit; name: string }) {
  const world = useWorld()
  const uma = world?.umas[outfit.outfitId]
  const [build, setBuild] = useState<RpgBuildId | null>(null)
  const [treeIndex, setTreeIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  if (!uma) return <p className="p-4 text-ink-soft">Unlock her first.</p>
  const fighting = activeBuild(outfit, uma)
  const shownBuild = build ?? fighting
  const profile = umaProfile(outfit, uma, 1, shownBuild)
  const current = buildOf(uma, shownBuild)
  const trees = rpgBuildTrees(shownBuild)
  const tree = trees[Math.min(treeIndex, trees.length - 1)]!
  const points = rpgTreePointsEarned(uma.level) - rpgTreePointsSpent(profile.tree)
  const slots = rpgActiveSlots(uma.level)
  const learned = new Set(current.tree)
  const run = (op: () => Promise<void>) => {
    setError(null)
    op().catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  const toggleEquip = (id: string) =>
    run(() => equip(outfit, shownBuild, current.loadout.includes(id) ? current.loadout.filter((x) => x !== id) : [...current.loadout, id]))

  return (
    <div className="space-y-4">
      <section>
        <h4 className="text-micro mb-1.5">Class builds · free to switch</h4>
        <div className="grid grid-cols-2 gap-1.5">
          {RPG_BUILDS.map((b) => {
            const spent = rpgTreePointsSpent(buildOf(uma, b).tree.map((id) => ({ tier: 1, id })))
            return (
              <button key={b} type="button" onClick={() => { setBuild(b); setTreeIndex(0) }} aria-pressed={b === shownBuild}
                className={`flex min-h-12 flex-col items-start justify-center rounded-sm px-2.5 py-1.5 text-left ${b === shownBuild ? 'bg-accent/15 ring-1 ring-accent' : 'bg-raised'}`}>
                <span className="flex items-center gap-1 text-[13px] font-semibold">
                  {RPG_BUILD[b].weapons.map((w) => <WeaponGlyph key={w} weapon={w} size={14} />)}
                  {BUILD_LABEL[b]}
                </span>
                <span className="text-[11px] text-ink-faint">{b === fighting ? 'Fighting as this' : spent ? `${spent} points spent` : 'Nothing learned'}</span>
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-[12px] text-ink-soft">{CLASS_BLURB[RPG_BUILD[shownBuild].classId]}</p>
        {(() => {
          const classId = RPG_BUILD[shownBuild].classId
          const rank = uma.ranks.classes[classId]
          const hall = Object.entries(CLASS_HALLS).find(([, h]) => h.classId === classId)?.[0]
          return (
            <p className={`mt-2 rounded-sm px-2.5 py-2 text-[12px] ${rank <= 1 ? 'bg-accent/15 text-accent' : 'bg-raised text-ink-soft'}`}>
              {CLASS_LABEL[classId]} rank {rank}: {rank <= 1 ? 'learns no skills yet' : `depths 1–${rank - 1} open`}.
              {rank < 6 && hall ? ` Train the next rank at the ${placeById(hall)?.name} (Learning District).` : ''}
            </p>
          )
        })()}
        {shownBuild !== fighting && (
          <button type="button" onClick={() => run(() => pickBuild(outfit.outfitId, shownBuild))} className="mt-2 min-h-11 w-full rounded-sm bg-accent font-display font-bold text-accent-ink">
            Fight as {BUILD_LABEL[shownBuild]}
          </button>
        )}
      </section>

      <section>
        <div className="mb-1.5 flex items-baseline justify-between">
          <h4 className="text-micro">Equipped · {current.loadout.length}/{slots}</h4>
          <span className="text-[12px] text-ink-soft">{points} point{points === 1 ? '' : 's'} to spend</span>
        </div>
        {current.loadout.length === 0 ? (
          <p className="text-[12px] text-ink-faint">No skills equipped: she fights with her free action only. Learn a skill below.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {current.loadout.map((id) => {
              const node = rpgNode(id)
              return node ? (
                <button key={id} type="button" onClick={() => toggleEquip(id)} className="flex min-h-9 items-center gap-1 rounded-full bg-accent/15 px-2.5 text-[12px] font-semibold text-accent" aria-label={`Unequip ${node.name}`}>
                  {node.skill && skillKinds(node.skill).map((k) => <KindMark key={k} kind={k} size={12} />)}
                  {node.name} ×
                </button>
              ) : null
            })}
          </div>
        )}
        {RPG_BUILD[shownBuild].classId === 'summoner' && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px]" aria-label="Familiar form">
            <span className="text-ink-soft">Familiar</span>
            {RPG_WEAPON_KINDS.map((k) => (
              <button key={k} type="button" aria-pressed={k === current.familiar} onClick={() => run(() => chooseFamiliar(outfit.outfitId, k))}
                className={`flex min-h-8 items-center gap-1 rounded-full px-2 ${k === current.familiar ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'}`}>
                <WeaponGlyph weapon={k} size={12} />
                {WEAPON_KIND_LABEL[k]}
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-2 grid grid-cols-2 gap-1 rounded-sm bg-sunken p-1" role="tablist" aria-label="Trees">
          {trees.map((t, i) => (
            <button key={t} type="button" role="tab" aria-selected={t === tree} onClick={() => setTreeIndex(i)}
              className={`min-h-10 rounded-xs text-[13px] font-semibold ${t === tree ? 'bg-raised text-ink shadow-2' : 'text-ink-faint'}`}>
              {TREE_LABEL[t]}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {rpgTreeBranches(tree).map((branch) => {
            const nodes = rpgTreeNodes(tree).filter((n) => n.branch === branch)
            const depths = [...new Set(nodes.map((n) => n.depth))].sort((a, b) => a - b)
            return (
              <div key={branch} className="rounded-md bg-panel p-2">
                <p className="mb-1.5 flex justify-between text-[12px] font-semibold text-ink-soft">
                  <span>{BRANCH_LABEL[branch] ?? branch}</span>
                  {(() => {
                    const next = depths.find((depth) => depth > (profile.maxDepth ?? 5))
                    return next ? <span className="font-normal text-ink-faint">Depth {next} at rank {next + 1}</span> : null
                  })()}
                </p>
                <div className="space-y-1.5">
                  {depths.filter((depth) => depth <= (profile.maxDepth ?? 5) || nodes.some((n) => n.depth === depth && learned.has(n.id))).map((depth) => {
                    const row = nodes.filter((n) => n.depth === depth)
                    const core = row.find((n) => n.variant === null)
                    const forks = row.filter((n) => n.variant !== null)
                    return (
                      <div key={depth} className="space-y-1">
                        {core && <NodeButton node={core} profileBlock={rpgLearnBlock(profile, core.id)} learned={learned.has(core.id)} equipped={current.loadout.includes(core.id)}
                          line={core.skill ? skillLine(profile, core.skill) : core.summary}
                          onLearn={() => run(() => learn(outfit, shownBuild, core.id))} onEquip={() => toggleEquip(core.id)} />}
                        {forks.length > 0 && (
                          <div className="grid grid-cols-2 gap-1">
                            {forks.map((n) => (
                              <NodeButton key={n.id} node={n} compact profileBlock={rpgLearnBlock(profile, n.id)} learned={learned.has(n.id)} equipped={current.loadout.includes(n.id)}
                                line={n.skill ? skillLine(profile, n.skill) : n.summary}
                                onLearn={() => run(() => learn(outfit, shownBuild, n.id))} onEquip={() => toggleEquip(n.id)}
                                onForget={() => run(() => unlearn(outfit, shownBuild, n.id))} />
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>
      {error && <p className="sticky bottom-2 rounded-sm bg-danger/90 p-2 text-center text-[13px]">{error}</p>}
      <p className="text-[11px] text-ink-faint">{name} earns 2 points a level (to Lv50) and 5 more as each depth opens, in every build at once. A depth’s core skills open with her class rank; its side skills (variants) at Lv 5, 15, 25, 35 and 45.</p>
    </div>
  )
}

function NodeButton({ node, learned, equipped, profileBlock, line, compact = false, onLearn, onEquip, onForget }: {
  node: RpgNode
  learned: boolean
  equipped: boolean
  profileBlock: string | null
  line: string
  compact?: boolean
  onLearn: () => void
  onEquip: () => void
  onForget?: () => void
}) {
  const kinds = node.skill ? skillKinds(node.skill) : []
  return (
    <div className={`rounded-sm border px-2 py-1.5 ${learned ? 'border-accent/60 bg-accent/10' : 'border-hairline'} ${compact ? 'text-[11px]' : 'text-[12px]'}`}>
      <p className="flex items-center gap-1 font-semibold">
        {kinds.map((k) => <KindMark key={k} kind={k} size={12} />)}
        <span className="min-w-0 flex-1 truncate">{node.name}</span>
        {node.variant && <span className="text-[10px] font-normal text-ink-faint">variant</span>}
      </p>
      <p className="text-[10.5px] leading-snug text-ink-soft">{line}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {!learned ? (
          <button type="button" disabled={!!profileBlock} onClick={onLearn} className="min-h-8 rounded-xs bg-raised px-2 text-[11px] font-semibold text-accent disabled:text-ink-faint">
            {profileBlock ?? `Learn · ${node.cost} pt${node.cost === 1 ? '' : 's'}`}
          </button>
        ) : (
          <>
            {node.skill && (
              <button type="button" onClick={onEquip} className={`min-h-8 rounded-xs px-2 text-[11px] font-semibold ${equipped ? 'bg-accent text-accent-ink' : 'bg-raised text-ink'}`}>
                {equipped ? 'Equipped' : 'Equip'}
              </button>
            )}
            {onForget && node.variant && (
              <button type="button" onClick={onForget} className="min-h-8 rounded-xs bg-raised px-2 text-[11px] text-ink-soft">Swap out · refund</button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
