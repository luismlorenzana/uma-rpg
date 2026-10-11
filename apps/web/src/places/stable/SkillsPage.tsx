// An Uma's class, weapons and skills (S3, D49, D77), the first tab of her profile: pick the class she fights as and, for
// a class with two weapon pairs, which pair; then spend points in the build's two trees and choose what she equips.
// Every build keeps its own tree and earns the full budget, so switching is free. Class rank r opens depths 1–r, each
// behind its Uma-level gate (Lv 1/10/20/30/40); side skills open at Lv 5/15/25/35/45 (D73).
import {
  activeBuild, buildOf, CLASS_HALLS, placeById, RPG_BUILD, RPG_BUILDS, RPG_CLASSES, RPG_DEPTH_GATES, RPG_WEAPON_KINDS, rpgActiveSlots, rpgBuildTrees,
  rpgLearnBlock, rpgNode, rpgTreeBranches, rpgTreeNodes, rpgTreePointsEarned, rpgTreePointsSpent, SaveRuleError, umaProfile, type BattleOutfit,
  type OwnedUma, type RpgBuildId, type RpgClass, type RpgNode,
} from '@rpg/domain'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  BRANCH_LABEL, CLASS_BLURB, CLASS_LABEL, KindMark, skillKinds, skillLine, TREE_LABEL, WEAPON_KIND_LABEL, WEAPON_LABEL, WeaponGlyph,
} from '../../battle/labels'
import { chooseFamiliar, equip, learn, pickBuild, unlearn, useWorld } from '../../save/game'

const buildsOf = (classId: RpgClass): RpgBuildId[] => RPG_BUILDS.filter((b) => RPG_BUILD[b].classId === classId)
const weaponsLabel = (build: RpgBuildId): string => RPG_BUILD[build].weapons.map((w) => WEAPON_LABEL[w]).join(' & ')

/** The build a class switches to: the current one if it's of that class, else the pair she has learned most in. */
function buildFor(uma: OwnedUma, classId: RpgClass, current: RpgBuildId): RpgBuildId {
  const options = buildsOf(classId)
  if (options.includes(current)) return current
  return [...options].sort((a, b) => buildOf(uma, b).tree.length - buildOf(uma, a).tree.length)[0]!
}

export function SkillsPage({ outfit, name }: { outfit: BattleOutfit; name: string }) {
  const navigate = useNavigate()
  const world = useWorld()
  const uma = world?.umas[outfit.outfitId]
  const [treeIndex, setTreeIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  if (!uma) return <p className="p-4 text-ink-soft">Unlock her first.</p>
  const build = activeBuild(outfit, uma)
  const classId = RPG_BUILD[build].classId
  const profile = umaProfile(outfit, uma, 1, build)
  const current = buildOf(uma, build)
  const trees = rpgBuildTrees(build)
  const tree = trees[Math.min(treeIndex, trees.length - 1)]!
  const points = rpgTreePointsEarned(uma.level) - rpgTreePointsSpent(profile.tree)
  const slots = rpgActiveSlots(uma.level)
  const learned = new Set(current.tree)
  const rank = uma.ranks.classes[classId]
  const hall = Object.entries(CLASS_HALLS).find(([, h]) => h.classId === classId)?.[0]
  const run = (op: () => Promise<void>) => {
    setError(null)
    op().catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  const switchTo = (next: RpgBuildId) => {
    if (next === build) return
    setTreeIndex(0)
    run(() => pickBuild(outfit.outfitId, next))
  }
  const toggleEquip = (id: string) =>
    run(() => equip(outfit, build, current.loadout.includes(id) ? current.loadout.filter((x) => x !== id) : [...current.loadout, id]))
  const pairs = buildsOf(classId)

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <h4 className="text-micro">Class · free to switch</h4>
        <div className="grid grid-cols-5 gap-1" role="radiogroup" aria-label="Class">
          {RPG_CLASSES.map((c) => (
            <button key={c} type="button" role="radio" aria-checked={c === classId} onClick={() => switchTo(buildFor(uma, c, build))}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-sm px-0.5 text-center ${c === classId ? 'bg-accent text-accent-ink' : 'bg-raised text-ink'}`}>
              <WeaponGlyph weapon={RPG_BUILD[buildsOf(c)[0]!].weapons[0]!} size={16} />
              <span className="text-[11px] font-semibold leading-tight">{CLASS_LABEL[c]}</span>
              <span className={`text-[10px] leading-none ${c === classId ? 'text-accent-ink/80' : 'text-ink-faint'}`}>Rank {uma.ranks.classes[c]}</span>
            </button>
          ))}
        </div>
        <div>
          <h4 className="text-micro mb-1">Weapons{pairs.length > 1 ? ' · pick a pair' : ''}</h4>
          {pairs.length > 1 ? (
            <div className="grid grid-cols-2 gap-1" role="radiogroup" aria-label="Weapon pair">
              {pairs.map((b) => (
                <button key={b} type="button" role="radio" aria-checked={b === build} onClick={() => switchTo(b)}
                  className={`flex min-h-11 items-center justify-center gap-1.5 rounded-sm px-2 text-[12.5px] font-semibold ${b === build ? 'bg-accent/15 text-accent ring-1 ring-accent' : 'bg-raised text-ink'}`}>
                  {RPG_BUILD[b].weapons.map((w) => <WeaponGlyph key={w} weapon={w} size={15} />)}
                  {weaponsLabel(b)}
                </button>
              ))}
            </div>
          ) : (
            <p className="flex min-h-9 items-center gap-1.5 rounded-sm bg-raised px-2.5 text-[12.5px] font-semibold">
              {RPG_BUILD[build].weapons.map((w) => <WeaponGlyph key={w} weapon={w} size={15} />)}
              {weaponsLabel(build)}
            </p>
          )}
        </div>
        <p className="text-[12px] text-ink-soft">{CLASS_BLURB[classId]}</p>
        <button type="button" disabled={!hall} onClick={() => hall && navigate(`/learning/${hall}`, { state: { fromHub: true } })}
          className="flex w-full items-center justify-between gap-2 rounded-sm bg-raised px-2.5 py-2 text-left text-[12px]">
          <span>
            <span className="font-semibold">{CLASS_LABEL[classId]} rank {rank}</span>
            <span className="text-ink-soft"> · depth{rank > 1 ? `s 1–${rank}` : ' 1'} open</span>
          </span>
          {rank < 5 && hall && <span className="shrink-0 text-accent">Rank {rank + 1} at the {placeById(hall)?.name} ›</span>}
        </button>
      </section>

      <section>
        <div className="mb-1.5 flex items-baseline justify-between">
          <h4 className="text-micro">Equipped · {current.loadout.length}/{slots}</h4>
          <span className={`text-[12px] ${points > 0 ? 'font-semibold text-accent' : 'text-ink-soft'}`}>{points} point{points === 1 ? '' : 's'} to spend</span>
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
        {classId === 'summoner' && (
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
        <h4 className="text-micro mb-1.5">Skill trees</h4>
        <div className="mb-2 grid grid-cols-2 gap-1 rounded-sm bg-sunken p-1" role="tablist" aria-label="Trees">
          {trees.map((t, i) => {
            const spent = rpgTreePointsSpent(rpgTreeNodes(t).filter((n) => learned.has(n.id)).map((n) => ({ tier: 1, id: n.id })))
            return (
              <button key={t} type="button" role="tab" aria-selected={t === tree} onClick={() => setTreeIndex(i)}
                className={`min-h-10 rounded-xs text-[13px] font-semibold ${t === tree ? 'bg-raised text-ink shadow-2' : 'text-ink-faint'}`}>
                {TREE_LABEL[t]}{spent > 0 && <span className="ml-1 text-[11px] font-normal text-ink-soft">{spent} pt{spent === 1 ? '' : 's'}</span>}
              </button>
            )
          })}
        </div>
        <div className="space-y-3">
          {rpgTreeBranches(tree).map((branch) => {
            const nodes = rpgTreeNodes(tree).filter((n) => n.branch === branch)
            const depths = [...new Set(nodes.map((n) => n.depth))].sort((a, b) => a - b)
            return (
              <div key={branch} className="rounded-md bg-panel p-2">
                <p className="mb-1.5 text-[12px] font-semibold text-ink-soft">{BRANCH_LABEL[branch] ?? branch}</p>
                <div className="space-y-1.5">
                  {depths.map((depth) => {
                    const row = nodes.filter((n) => n.depth === depth)
                    const core = row.find((n) => n.variant === null)
                    const forks = row.filter((n) => n.variant !== null)
                    const needs = [depth > (profile.maxDepth ?? 5) ? `class rank ${depth}` : null,
                      uma.level < RPG_DEPTH_GATES[depth - 1]! ? `Lv${RPG_DEPTH_GATES[depth - 1]}` : null].filter(Boolean)
                    const closed = needs.length > 0 ? `needs ${needs.join(' and ')}` : null
                    return (
                      <div key={depth} className={`space-y-1 ${closed && !row.some((n) => learned.has(n.id)) ? 'opacity-55' : ''}`}>
                        <p className="text-[10px] uppercase tracking-wide text-ink-faint">Depth {depth}{closed ? ` · ${closed}` : ''}</p>
                        {core && <NodeButton node={core} profileBlock={rpgLearnBlock(profile, core.id)} learned={learned.has(core.id)} equipped={current.loadout.includes(core.id)}
                          line={core.skill ? skillLine(profile, core.skill) : core.summary}
                          onLearn={() => run(() => learn(outfit, build, core.id))} onEquip={() => toggleEquip(core.id)} />}
                        {forks.length > 0 && (
                          <div className="grid grid-cols-2 gap-1">
                            {forks.map((n) => (
                              <NodeButton key={n.id} node={n} compact profileBlock={rpgLearnBlock(profile, n.id)} learned={learned.has(n.id)} equipped={current.loadout.includes(n.id)}
                                line={n.skill ? skillLine(profile, n.skill) : n.summary}
                                onLearn={() => run(() => learn(outfit, build, n.id))} onEquip={() => toggleEquip(n.id)}
                                onForget={() => run(() => unlearn(outfit, build, n.id))} />
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
      <p className="text-[11px] text-ink-faint">{name} earns 2 points a level (to Lv50) and 5 more as each depth opens, in every build at once. Depth d opens at class rank d and Lv 1, 10, 20, 30 or 40; its side skills at Lv 5, 15, 25, 35 and 45.</p>
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
        {node.variant && <span className="text-[10px] font-normal text-ink-faint">side</span>}
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
