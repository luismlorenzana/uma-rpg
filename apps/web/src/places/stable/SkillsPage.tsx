// An Uma's class, weapons and skills (D86, docs/design/class-rework.md), the first tab of her profile: pick the class
// she fights as, its five weapons (a Brawler's and a Mage's are fixed; Summoner, Spell Blade and Cleric choose), then
// her skills. Each weapon has a tree; a depth's core skill comes free once her class rank and level open it, and side
// skills cost points. Skills are chosen for her until she picks her own.
import {
  activeClass, CLASS_HALLS, classOf, isRpgTome, placeById, RPG_CLASS_SLOTS, RPG_CLASSES, RPG_DEPTH_GATES, rpgActiveSlots, rpgClassWeapons,
  rpgDepthBlock, rpgLearnBlock, rpgNode, rpgPicksWeapons, rpgSideNodeLevel, rpgTreeNodes, rpgTreeOf, rpgTreePointsEarned, rpgTreePointsSpent,
  SaveRuleError, umaLoadout, umaProfile, type BattleOutfit, type RpgClass, type RpgNode, type RpgWeapon,
} from '@rpg/domain'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CLASS_BLURB, CLASS_LABEL, KindMark, SLOT_LABEL, skillKinds, skillLine, WEAPON_LABEL, WeaponGlyph } from '../../battle/labels'
import { equip, learn, pickClass, pickWeapons, unlearn, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'

export function SkillsPage({ outfit, name }: { outfit: BattleOutfit; name: string }) {
  const navigate = useNavigate()
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
  const points = rpgTreePointsEarned(uma.level) - rpgTreePointsSpent(profile.tree)
  const slots = rpgActiveSlots(uma.level)
  const learned = new Set(setup.tree)
  const rank = uma.ranks.classes[classId]
  const hall = Object.entries(CLASS_HALLS).find(([, h]) => h.classId === classId)?.[0]
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
  const swapWeapon = (slot: number, w: RpgWeapon) => {
    const next = [...weapons]
    const other = next.indexOf(w)
    if (other >= 0) next[other] = next[slot]!
    next[slot] = w
    setSlotPick(null)
    run(() => pickWeapons(outfit.outfitId, classId, next))
  }

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <div className="-my-2 flex items-center justify-between">
          <h4 className="text-micro">Class</h4>
          <HelpButton title="Classes and skills">
            <p>{CLASS_BLURB[classId]}</p>
            <p>Switching class is free; each class keeps its own weapons, skills and loadout.</p>
            <p>Core skills come free: depth d opens at class rank d and Lv 1, 10, 20, 30 or 40. She earns a point a level for side skills, which open at Lv 5, 15, 25, 35 and 45. Take one side of each fork; swap whenever you like.</p>
            <p>Until you equip skills yourself, each weapon's deepest skill is equipped for her.</p>
          </HelpButton>
        </div>
        <div className="grid grid-cols-5 gap-1" role="radiogroup" aria-label="Class">
          {RPG_CLASSES.map((c) => (
            <button key={c} type="button" role="radio" aria-checked={c === classId} onClick={() => switchTo(c)}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-sm px-0.5 text-center ${c === classId ? 'bg-accent text-accent-ink' : 'bg-raised text-ink'}`}>
              <WeaponGlyph weapon={classOf(uma, c).weapons[0]!} size={16} />
              <span className="text-[11px] font-semibold leading-tight">{CLASS_LABEL[c]}</span>
              <span className={`text-[10px] leading-none ${c === classId ? 'text-accent-ink/80' : 'text-ink-faint'}`}>Rank {uma.ranks.classes[c]}</span>
            </button>
          ))}
        </div>
        <div>
          <h4 className="text-micro mb-1">Weapons</h4>
          <div className="grid grid-cols-5 gap-1" aria-label="Weapon slots">
            {weapons.map((w, i) => (
              <button key={`${i}-${w}`} type="button" disabled={!rpgPicksWeapons(classId)} onClick={() => setSlotPick(i)}
                className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-sm bg-raised px-0.5 text-center disabled:cursor-default">
                <WeaponGlyph weapon={w} size={18} />
                <span className="w-full truncate text-[10.5px] font-semibold leading-tight">{WEAPON_LABEL[w].replace(' Tome', '')}</span>
                <span className="text-[9.5px] leading-none text-ink-faint">{SLOT_LABEL[RPG_CLASS_SLOTS[classId][i]!]}</span>
              </button>
            ))}
          </div>
        </div>
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
            const needs = [depth > (profile.maxDepth ?? 5) ? `class rank ${depth}` : null, uma.level < RPG_DEPTH_GATES[depth - 1]! ? `Lv${RPG_DEPTH_GATES[depth - 1]}` : null].filter(Boolean)
            const sidesAt = rpgSideNodeLevel(depth)
            const usable = !closed && weapons.includes(weapon)
            return (
              <div key={depth} className={`space-y-1 ${closed && !sides.some((n) => learned.has(n.id)) ? 'opacity-55' : ''}`}>
                <p className="text-[10px] uppercase tracking-wide text-ink-faint">
                  Depth {depth}{needs.length ? ` · needs ${needs.join(' and ')}` : ''}{!closed && uma.level < sidesAt ? ` · side skills at Lv${sidesAt}` : ''}
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

      {slotPick !== null && (
        <BottomSheet title={`${CLASS_LABEL[classId]}: slot ${slotPick + 1} (${SLOT_LABEL[RPG_CLASS_SLOTS[classId][slotPick]!]})`} onClose={() => setSlotPick(null)}>
          <div className="grid grid-cols-2 gap-1.5">
            {rpgClassWeapons(classId).filter((w) => {
              const kind = RPG_CLASS_SLOTS[classId][slotPick]!
              return kind === 'any' || (kind === 'tome') === isRpgTome(w)
            }).map((w) => (
              <button key={w} type="button" onClick={() => swapWeapon(slotPick, w)} aria-pressed={weapons[slotPick] === w}
                className={`flex min-h-12 items-center gap-2 rounded-sm px-3 text-left text-[13px] font-semibold ${weapons[slotPick] === w ? 'bg-accent/15 text-accent ring-1 ring-accent' : 'bg-raised'}`}>
                <WeaponGlyph weapon={w} size={18} />
                <span className="min-w-0 flex-1">{WEAPON_LABEL[w]}{weapons.includes(w) && weapons[slotPick] !== w ? <span className="block text-[11px] font-normal text-ink-faint">swaps with slot {weapons.indexOf(w) + 1}</span> : null}</span>
              </button>
            ))}
          </div>
        </BottomSheet>
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
