// An Uma's class, weapons and skills (D86, D98, docs/design/class-rework.md), the first tab of her profile: pick the class
// she fights as, the weapons in its five slots (a Brawler's and a Mage's kinds are fixed; Summoner, Spell Blade and
// Cleric choose), then her skills. Each weapon in a slot opens its tree; she holds a Training weapon of every kind until
// she wears a crafted one. A depth's core skill comes free once her class rank and level open it, and side skills cost
// points. Skills are chosen for her until she picks her own.
import {
  activeClass, classOf, classRankOf, classTrack, gearById, RPG_CLASSES, RPG_DEPTH_GATES, rpgActiveSlots, rpgClassWeapons, rpgOpenDepth,
  rpgDepthBlock, rpgLearnBlock, rpgNode, rpgSideNodeLevel, rpgTreeNodes, rpgTreeOf, rpgTreePointsEarned, rpgTreePointsSpent,
  SaveRuleError, umaLoadout, umaProfile, type BattleOutfit, type RpgClass, type RpgNode,
} from '@rpg/domain'
import { useState } from 'react'
import { CLASS_BLURB, CLASS_LABEL, KindMark, skillKinds, skillLine, WEAPON_LABEL, WeaponGlyph } from '../../battle/labels'
import { equip, learn, pickClass, unlearn, useWorld } from '../../save/game'
import { HelpButton } from '../../ui/HelpButton'
import { RankRow } from '../../ui/RankBars'
import { WeaponSheet } from './WeaponSheet'

export function SkillsPage({ outfit, name }: { outfit: BattleOutfit; name: string }) {
  const world = useWorld()
  const uma = world?.umas[outfit.outfitId]
  const [treeIndex, setTreeIndex] = useState(0)
  const [slotPick, setSlotPick] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  if (!uma) return <p className="p-4 text-ink-soft">Unlock her first.</p>
  const classId = activeClass(outfit, uma)
  const setup = classOf(uma, classId)
  const profile = umaProfile(outfit, uma, 1, classId)
  const weapons = setup.weapons
  const treeWeapons = [...weapons, ...rpgClassWeapons(classId).filter((w) => !weapons.includes(w))]
  const weapon = treeWeapons[Math.min(treeIndex, treeWeapons.length - 1)]!
  const equipped = umaLoadout(outfit, uma, 1, classId).map((r) => r.id)
  const auto = setup.loadout === null
  const rank = classRankOf(uma.ranks, classId)
  const points = rpgTreePointsEarned(rank) - rpgTreePointsSpent(profile.tree)
  const slots = rpgActiveSlots(uma.level)
  const learned = new Set(setup.tree)
  const run = (op: () => Promise<void>) => {
    setError(null)
    op().catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  }
  const switchTo = (next: RpgClass) => {
    if (next === classId) return
    setTreeIndex(0)
    run(() => pickClass(outfit.outfitId, next))
  }
  const toggleEquip = (id: string) => {
    if (equipped.includes(id)) return run(() => equip(outfit, classId, equipped.filter((x) => x !== id)))
    if (equipped.length >= slots) return setError(`All ${slots} skill slots are full: unequip one first`)
    run(() => equip(outfit, classId, [...equipped, id]))
  }

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <div className="-my-2 flex items-center justify-between">
          <h4 className="text-micro">Class</h4>
          <HelpButton title="Classes and skills">
            <p>{CLASS_BLURB[classId]}</p>
            <p>Switching class is free; each class keeps its own weapons, skills and loadout.</p>
            <p>Each weapon in her five slots opens its skill tree. She holds a Training weapon of every kind: no stats, but it opens the tree. A crafted weapon from the Forge does the same and adds its stats.</p>
            <p>Her Class Rank rises as she wins fights in this class. Core skills come free: depths open at Class Rank 1, 10, 20, 30 and 40. Each rank gives a point for side skills, which open at Class Rank 5, 15, 25, 35 and 45. Take one side of each fork; swap whenever you like.</p>
            <p>Her Uma Level sets how many skills she can equip.</p>
            <p>Until you equip skills yourself, each weapon's deepest skill is equipped for her.</p>
          </HelpButton>
        </div>
        <div className="grid grid-cols-5 gap-1" role="radiogroup" aria-label="Class">
          {RPG_CLASSES.map((c) => (
            <button key={c} type="button" role="radio" aria-checked={c === classId} onClick={() => switchTo(c)}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-sm px-0.5 text-center ${c === classId ? 'bg-accent text-accent-ink' : 'bg-raised text-ink'}`}>
              <WeaponGlyph weapon={classOf(uma, c).weapons[0]!} size={16} />
              <span className="text-[11px] font-semibold leading-tight">{CLASS_LABEL[c]}</span>
              <span className={`text-[10px] leading-none ${c === classId ? 'text-accent-ink/80' : 'text-ink-faint'}`}>Rank {classRankOf(uma.ranks, c)}</span>
            </button>
          ))}
        </div>
        <div>
          <h4 className="text-micro mb-1">Weapons</h4>
          <div className="grid grid-cols-5 gap-1" aria-label="Weapon slots">
            {weapons.map((w, i) => {
              const piece = uma.gear.equipped[w] ? gearById(uma.gear.equipped[w]!) : undefined
              return (
                <button key={`${i}-${w}`} type="button" onClick={() => setSlotPick(i)} aria-label={`Weapon ${i + 1}: ${piece ? piece.name : `Training ${WEAPON_LABEL[w]}`}`}
                  className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-sm bg-raised px-0.5 text-center">
                  <WeaponGlyph weapon={w} size={18} />
                  <span className="w-full truncate text-[10.5px] font-semibold leading-tight">{WEAPON_LABEL[w].replace(' Tome', '')}</span>
                  <span className={`text-[9.5px] leading-none ${piece ? 'font-semibold text-accent' : 'text-ink-faint'}`}>{piece ? `G${piece.grade}` : 'Training'}</span>
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
        <div className="mb-1.5 flex items-baseline justify-between">
          <h4 className="text-micro">Equipped · {equipped.length}/{slots}{auto ? ' · chosen for her' : ''}</h4>
          <span className={`text-[12px] ${points > 0 ? 'font-semibold text-accent' : 'text-ink-soft'}`}>{points} point{points === 1 ? '' : 's'} for side skills</span>
        </div>
        {equipped.length === 0 ? (
          <p className="text-[12px] text-ink-faint">No skills yet</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {equipped.map((id) => {
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
        <div className={`mb-2 grid gap-1 rounded-sm bg-sunken p-1 ${treeWeapons.length > 5 ? 'grid-cols-5' : 'grid-cols-5'}`} role="tablist" aria-label="Trees">
          {treeWeapons.map((w, i) => {
            const active = weapons.includes(w)
            return (
              <button key={w} type="button" role="tab" aria-selected={w === weapon} onClick={() => setTreeIndex(i)}
                className={`flex min-h-10 flex-col items-center justify-center gap-0.5 rounded-xs text-[10.5px] font-semibold ${w === weapon ? 'bg-raised text-ink shadow-2' : active ? 'text-ink-soft' : 'text-ink-faint opacity-55'}`}>
                <WeaponGlyph weapon={w} size={15} />
                <span className="w-full truncate px-0.5">{WEAPON_LABEL[w].replace(' Tome', '')}</span>
              </button>
            )
          })}
        </div>
        {!weapons.includes(weapon) && (
          <p className="mb-2 text-[12px] font-semibold text-ink-faint">Not equipped</p>
        )}
        <div className="space-y-1.5 rounded-md bg-panel p-2">
          {[1, 2, 3, 4, 5].map((depth) => {
            const row = rpgTreeNodes(rpgTreeOf(classId, weapon)).filter((n) => n.depth === depth)
            const core = row.find((n) => n.variant === null)!
            const sides = row.filter((n) => n.variant !== null)
            const closed = rpgDepthBlock(profile, depth)
            const needs = rank < RPG_DEPTH_GATES[depth - 1]! ? [`Class Rank ${RPG_DEPTH_GATES[depth - 1]}`] : []
            const sidesAt = rpgSideNodeLevel(depth)
            const usable = !closed && weapons.includes(weapon)
            return (
              <div key={depth} className={`space-y-1 ${closed && !sides.some((n) => learned.has(n.id)) ? 'opacity-55' : ''}`}>
                <p className="text-[10px] uppercase tracking-wide text-ink-faint">
                  Depth {depth}{needs.length ? ` · needs ${needs.join(' and ')}` : ''}{!closed && rank < sidesAt ? ` · side skills at Class Rank ${sidesAt}` : ''}
                </p>
                <NodeCard node={core} line={skillLine(profile, core.skill)} state={closed ? closed : 'Known'} equipped={equipped.includes(core.id)}
                  onEquip={usable ? () => toggleEquip(core.id) : undefined} />
                <div className="grid grid-cols-2 gap-1">
                  {sides.map((n) => {
                    const has = learned.has(n.id)
                    const block = has ? null : rpgLearnBlock(profile, n.id)
                    return (
                      <NodeCard key={n.id} node={n} compact line={skillLine(profile, n.skill)} state={has ? 'Learned' : block}
                        equipped={equipped.includes(n.id)} onLearn={!has && !block ? () => run(() => learn(outfit, classId, n.id)) : undefined}
                        onEquip={has && usable ? () => toggleEquip(n.id) : undefined} onForget={has ? () => run(() => unlearn(outfit, classId, n.id)) : undefined} />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>
      {error && <p className="sticky bottom-2 rounded-sm bg-danger/90 p-2 text-center text-[13px]">{error}</p>}

      {slotPick !== null && world && (
        <WeaponSheet outfitId={outfit.outfitId} uma={uma} world={world} classId={classId} slot={slotPick} onClose={() => setSlotPick(null)} />
      )}
    </div>
  )
}

function NodeCard({ node, line, state, equipped, compact = false, onLearn, onEquip, onForget }: {
  node: RpgNode
  line: string
  state: string | null
  equipped: boolean
  compact?: boolean
  onLearn?: () => void
  onEquip?: () => void
  onForget?: () => void
}) {
  const known = state === 'Known' || state === 'Learned'
  return (
    <div className={`rounded-sm border px-2 py-1.5 ${known ? 'border-accent/60 bg-accent/10' : 'border-hairline'} ${compact ? 'text-[11px]' : 'text-[12px]'}`}>
      <p className="flex items-center gap-1 font-semibold">
        {skillKinds(node.skill).map((k) => <KindMark key={k} kind={k} size={12} />)}
        <span className="min-w-0 flex-1 truncate">{node.name}</span>
        {node.variant ? <span className="text-[10px] font-normal text-ink-faint">side · {node.cost} pt{node.cost === 1 ? '' : 's'}</span> : <span className="text-[10px] font-normal text-ink-faint">core</span>}
      </p>
      <p className="text-[10.5px] leading-snug text-ink-soft">{line}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {onLearn ? (
          <button type="button" onClick={onLearn} className="min-h-8 rounded-xs bg-raised px-2 text-[11px] font-semibold text-accent">Learn · {node.cost} pt{node.cost === 1 ? '' : 's'}</button>
        ) : !known ? (
          <span className="flex min-h-8 items-center rounded-xs bg-raised px-2 text-[11px] text-ink-faint">{state ?? '—'}</span>
        ) : null}
        {known && onEquip && (
          <button type="button" onClick={onEquip} className={`min-h-8 rounded-xs px-2 text-[11px] font-semibold ${equipped ? 'bg-accent text-accent-ink' : 'bg-raised text-ink'}`}>
            {equipped ? 'Equipped' : 'Equip'}
          </button>
        )}
        {onForget && <button type="button" onClick={onForget} className="min-h-8 rounded-xs bg-raised px-2 text-[11px] text-ink-soft">Swap out · refund</button>}
      </div>
    </div>
  )
}
