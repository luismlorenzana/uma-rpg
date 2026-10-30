// The Gear tab's two views (H107, D219; R2's grades, H79): **Equip**, what she wears (the preset, her weapons, her armor
// half, and her accessory slot as four cards of one shape, ★ on her signature family), and **Upgrade**, every slot's
// grade row with the made item that raises it, then Extra Stats. The data is `gear-equip.ts`'.
import {
  ACCESSORY_FAMILY_LABEL, accessorySlotValue, ARMOR_SLOTS, ARMOR_SLOT_LABEL, accessoryKinds, activeClass, armorHalf, armorKindFor, armorValues, classOf,
  gradeOf, isGrades, madeName, mightAt, raisePlan, starMapOf, umaTemplate, WEAPON_LABEL,
  type AccessoryFamily, type ArmorSlot, type GearTier, type GradeTarget, type OwnedUma, type RosterOutfit, type RpgClass,
  type RpgDamageKind, type TierWorld, type UmaUpgrades, umaPick,
} from '@rpg/domain'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { KindMark, WeaponGlyph } from '../../battle/labels'
import { accessoryIconId } from '../../items/frames'
import { ItemIcon } from '../../items/ItemIcon'
import { chooseAccessoryForm, raiseGear } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { UpgradeMark } from '../../ui/UpgradeMark'
import { accessoryCards, cardButton, cardKind, upgradeRows, type AccessoryCard, type UpgradeRow } from './gear-equip'
import { gradeUpgradeView } from './gear-v3'
import { PresetButton } from './PresetButton'
import { accessoryEffect, actions, armorHalf as armorHalfCopy, armorSlot, armorStat, extraStatsCount, grade, gradeStep, itemCount, maxGrade, might } from './copy'

const armorStatLine = (slot: ArmorSlot, gradeValue: number, tier: GearTier, classId: RpgClass) => {
  const values = armorValues(slot, gradeValue, tier)
  const stat = values.stat === 'speed' ? armorStat('Evasion', `${(values.value * 0.6).toFixed(1)}%`)
    : armorStat(({ hp: 'HP', def: 'DEF', mp: 'MP', mdef: 'M.DEF' } as const)[values.stat], values.value)
  return `${stat} · ${armorStat(armorHalf(classId) === 'physical' ? 'ATK' : 'M.ATK', values.offense)}`
}

function GradeIcon({ target, grade, classId }: { target: GradeTarget; grade: number; classId: RpgClass }) {
  if (target.kind === 'weapon') return grade > 0 ? <ItemIcon id={`${target.weapon}-g${grade}`} size={32} />
    : <span className="flex size-8 items-center justify-center rounded-xs border border-dashed border-hairline-strong"><WeaponGlyph weapon={target.weapon} size={19} /></span>
  if (target.kind === 'armor') {
    const kind = armorKindFor(target.slot, armorHalf(classId))
    return grade > 0 ? <ItemIcon id={`${kind}-g${grade}`} size={32} />
      : <span className="flex size-8 items-center justify-center rounded-xs border border-dashed border-hairline-strong" />
  }
  return <span className="flex size-8 items-center justify-center rounded-xs border border-dashed border-hairline-strong text-[10px] text-ink-faint">G{grade}</span>
}

function GradeSheet({ outfitId, uma, world, tier, classId, target, onClose }: {
  outfitId: string; uma: OwnedUma; world: TierWorld; tier: GearTier; classId: RpgClass; target: GradeTarget; onClose: () => void
}) {
  if (!isGrades(uma.gear)) return null
  const grades = uma.gear
  const current = gradeOf(grades, target)
  const upgrade = gradeUpgradeView(grades, target, uma.level, world.items)
  const [confirmTo, setConfirmTo] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const title = target.kind === 'weapon' ? WEAPON_LABEL[target.weapon] : target.kind === 'armor' ? ARMOR_SLOT_LABEL[target.slot] : 'Accessory'
  const transition = (() => {
    if (current >= 10) {
      if (target.kind === 'weapon') return `${maxGrade()} · ${might(mightAt(current, tier))}`
      if (target.kind === 'armor') return `${maxGrade()} · ${armorStatLine(target.slot, current, tier, classId)}`
      const slot = grades.accessories[target.slot]
      return `${maxGrade()}${slot?.family ? ` · ${ACCESSORY_FAMILY_LABEL[slot.family]} · ${accessoryEffect(slot.family, current, tier, slot.kind)}` : ''}`
    }
    const next = current + 1
    if (target.kind === 'weapon') return `${gradeStep(current, next)} · Might ${mightAt(current, tier)} → ${mightAt(next, tier)}`
    if (target.kind === 'armor') {
      const before = armorValues(target.slot, current, tier)
      const after = armorValues(target.slot, next, tier)
      const label = before.stat === 'speed' ? 'Evasion' : ({ hp: 'HP', def: 'DEF', mp: 'MP', mdef: 'M.DEF' } as const)[before.stat]
      const value = (v: typeof before) => v.stat === 'speed' ? `${(v.value * 0.6).toFixed(1)}%` : `${v.value}`
      const offense = armorHalf(classId) === 'physical' ? 'ATK' : 'M.ATK'
      return `${gradeStep(current, next)} · ${label} ${value(before)} → ${value(after)} · ${offense} ${before.offense} → ${after.offense}`
    }
    const slot = grades.accessories[target.slot]
    return `${gradeStep(current, next)}${slot?.family ? ` · ${ACCESSORY_FAMILY_LABEL[slot.family]} · ${accessoryEffect(slot.family, current, tier, slot.kind)} → ${accessoryEffect(slot.family, next, tier, slot.kind)}` : ''}`
  })()
  let highest = current
  for (let to = current + 1; to <= 10; to++) if (raisePlan(world, outfitId, target, to).block === null) highest = to
  const run = (to?: number) => raiseGear(outfitId, target, to).then(() => { setError(null); setConfirmTo(null) }, (err: unknown) => setError(err instanceof Error ? err.message : 'That didn’t work.'))
  const plan = confirmTo ? raisePlan(world, outfitId, target, confirmTo) : null
  return (
    <BottomSheet title={title} onClose={onClose}>
      <div className="space-y-3">
        <div className="rounded-md bg-raised p-3 text-[13px]">
          <p className="font-semibold">{transition}</p>
          {upgrade.item && <p className="mt-1 text-ink-soft">{itemCount(madeName(upgrade.item) ?? upgrade.item, 1)}</p>}
          {target.kind === 'armor' && <p className="mt-1 text-[11px] text-ink-faint">{armorSlot(target.slot)} · {armorHalfCopy(armorHalf(classId))}</p>}
        </div>
        {upgrade.next && <>
          <button type="button" disabled={!upgrade.ready} onClick={() => void run()}
            className="min-h-12 w-full rounded-sm bg-accent px-3 font-semibold text-accent-ink disabled:bg-raised disabled:text-ink-faint">
            {actions.raiseTo(upgrade.next)}
          </button>
          {!upgrade.ready && upgrade.block && <p className="text-center text-[12px] text-ink-faint">{upgrade.block}</p>}
        </>}
        {highest > current + 1 && <button type="button" onClick={() => setConfirmTo(highest)} className="min-h-12 w-full rounded-sm bg-raised font-semibold">{actions.raiseAll}</button>}
        {error && <p className="text-[13px] text-danger">{error}</p>}
        {confirmTo && plan && (
          <div className="rounded-md border border-hairline-strong p-3">
            <p className="font-semibold">{actions.raise(confirmTo - current)}</p>
            <ul className="mt-2 space-y-1">
              {plan.items.map((id) => <li key={id} className="flex items-center gap-2 text-[13px]"><ItemIcon id={id} size={28} />{madeName(id)}</li>)}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setConfirmTo(null)} className="min-h-11 rounded-sm bg-raised font-semibold">Cancel</button>
              <button type="button" onClick={() => void run(confirmTo)} className="min-h-11 rounded-sm bg-accent font-semibold text-accent-ink">{actions.confirm}</button>
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  )
}

// --- Equip ------------------------------------------------------------------------------------------------------------

function AccessoryPicker({ cards, grade, onEquip }: { cards: AccessoryCard[]; grade: number; onEquip: (family: AccessoryFamily, kind?: RpgDamageKind) => void }) {
  const initial = cards.find((card) => card.wearing) ?? cards[0]!
  const [family, setFamily] = useState<AccessoryFamily>(initial.family)
  const [kinds, setKinds] = useState<Partial<Record<AccessoryFamily, RpgDamageKind | null>>>(() => Object.fromEntries(
    cards.map((card) => [card.family, cardKind(card)]),
  ))
  const card = cards.find((item) => item.family === family) ?? initial
  const picked = kinds[card.family] ?? cardKind(card)
  const button = cardButton(card, picked)
  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-4 gap-1" role="radiogroup" aria-label="Accessory family">
        {cards.map((item) => {
          const itemKind = kinds[item.family] ?? cardKind(item)
          return (
            <button key={item.family} type="button" role="radio" aria-checked={item.family === card.family}
              aria-label={`${item.signature ? 'Signature ' : ''}${item.label}${item.wearing ? ', equipped' : ''}`}
              onClick={() => setFamily(item.family)} data-accessory={item.family}
              className={`relative flex min-h-14 items-center justify-center rounded-sm border ${item.family === card.family ? 'border-accent bg-panel' : 'border-transparent bg-sunken'} ${item.wearing ? 'ring-2 ring-accent ring-inset' : ''}`}>
              {item.signature && <span aria-hidden className="absolute left-1 top-0.5 text-[11px] font-bold text-accent">★</span>}
              <ItemIcon id={accessoryIconId({ grade: Math.max(1, grade), family: item.family, form: 'base', ...(itemKind ? { kind: itemKind } : {}) })} size={36} />
              {item.wearing && <span aria-hidden className="absolute bottom-1 right-1 size-1.5 rounded-full bg-accent" />}
            </button>
          )
        })}
      </div>
      <div className="rounded-sm bg-panel p-2">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold">{card.signature ? '★ ' : ''}{card.label}</p>
            <p className="text-[10.5px] leading-snug text-ink-soft">{card.effect}</p>
            {card.signature && <p className="text-[10.5px] font-semibold text-accent">{card.signature}</p>}
            {card.stale && <p className="text-[10.5px] font-semibold text-warning">{card.stale}</p>}
          </div>
          {card.kinds.length > 0 && (
            <div role="group" aria-label={`${card.label}: which weapon`} className="grid grid-cols-3 gap-1">
              {card.kinds.map(({ kind, label }) => (
                <button key={kind} type="button" aria-label={label} aria-pressed={picked === kind}
                  onClick={() => setKinds((current) => ({ ...current, [card.family]: kind }))}
                  className={`flex size-11 items-center justify-center rounded-sm border ${picked === kind ? 'border-accent bg-accent/10' : 'border-transparent bg-sunken'}`}>
                  <KindMark kind={kind} size={20} />
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" disabled={button.disabled} onClick={() => onEquip(card.family, card.kinds.length ? picked ?? undefined : undefined)}
          className="mt-2 min-h-11 w-full rounded-sm px-3 text-[12px] font-semibold enabled:bg-accent enabled:text-accent-ink disabled:bg-sunken disabled:text-ink-soft">
          {button.label}
        </button>
      </div>
    </div>
  )
}

/** Equip: what she wears, nothing to spend. */
export function EquipView({ outfit, uma, world, tier, onSkills }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; tier: GearTier; onSkills: () => void }) {
  const [error, setError] = useState<string | null>(null)
  if (!isGrades(uma.gear)) return null
  const grades = uma.gear
  const active = activeClass(outfit, uma, tier)
  const weapons = classOf(uma, active).weapons
  const kinds = accessoryKinds(uma, active)
  const signature = umaTemplate(outfit, umaPick(uma)).family
  const equip = (slot: number) => (family: AccessoryFamily, kind?: RpgDamageKind) => chooseAccessoryForm(outfit.outfitId, active, slot, family, kind)
    .then(() => setError(null), (err: unknown) => setError(err instanceof Error ? err.message : 'That didn’t work.'))
  return (
    <div className="space-y-2">
      <PresetButton outfit={outfit} uma={uma} world={world} />
      <section className="space-y-1.5 rounded-sm bg-raised p-2">
        <div className="flex items-center justify-between">
          <h4 className="text-micro">Loadout</h4>
          <button type="button" onClick={onSkills} className="min-h-11 px-1 text-[12px] font-semibold text-ink-soft">Set on Skills ›</button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {weapons.map((weapon) => {
            const target: GradeTarget = { kind: 'weapon', weapon }
            const grade = gradeOf(grades, target)
            return (
              <div key={weapon} role="img" aria-label={`${WEAPON_LABEL[weapon]}, grade ${grade}`} title={`${WEAPON_LABEL[weapon]} · G${grade}`}
                className="relative flex min-h-14 items-center justify-center rounded-sm bg-panel text-center">
                <GradeIcon target={target} grade={grade} classId={active} />
                <span className="absolute bottom-1 right-1 rounded-full bg-page/90 px-1 text-[9px] font-bold text-ink">G{grade}</span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <h4 className="text-micro">{armorHalf(active) === 'magical' ? 'Magical' : 'Physical'} armor</h4>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {ARMOR_SLOTS.map((slot) => {
            const target: GradeTarget = { kind: 'armor', slot }
            const grade = gradeOf(grades, target)
            return (
              <div key={slot} role="img" aria-label={`${ARMOR_SLOT_LABEL[slot]}, grade ${grade}`} title={`${ARMOR_SLOT_LABEL[slot]} · G${grade}`}
                className="relative flex min-h-12 items-center justify-center rounded-sm bg-panel">
                <GradeIcon target={target} grade={grade} classId={active} />
                <span className="absolute bottom-0.5 right-0.5 rounded-full bg-page/90 px-1 text-[8.5px] font-bold text-ink">G{grade}</span>
              </div>
            )
          })}
        </div>
      </section>
      {grades.accessories.map((slot, i) => (
        <section key={i} className="space-y-1.5 rounded-sm bg-raised p-2">
          <div className="flex items-center justify-between">
            <h4 className="text-micro">Accessory {i + 1} · {grade(slot.grade)}</h4>
            <HelpButton title="Accessory">
              <p>Pendant · ATK +{accessorySlotValue('pendant', Math.max(1, slot.grade), tier)}</p>
              <p>Charm · M.ATK +{accessorySlotValue('bell', Math.max(1, slot.grade), tier)}</p>
              <p>Orb · +{accessorySlotValue('orb', Math.max(1, slot.grade), tier)} on one kind</p>
              <p>Insignia · +0.5% a grade on sub-bosses and bosses</p>
              <p>Three slots, each with its own grade. The same accessory can fill more than one.</p>
              <p>The form changes freely outside fights. Its strength follows the slot’s grade, raised on Upgrade.</p>
            </HelpButton>
          </div>
          <AccessoryPicker cards={accessoryCards(slot, kinds, signature, uma.level, tier)} grade={slot.grade} onEquip={equip(i)} />
        </section>
      ))}
      {error && <p className="text-[13px] text-danger">{error}</p>}
    </div>
  )
}

// --- Upgrade ----------------------------------------------------------------------------------------------------------

const GROUP_LABEL = { weapon: 'Weapons', armor: 'Armor', accessory: 'Accessory' } as const

/** Upgrade: every slot's grade row and the made item that raises it, then Extra Stats. */
export function UpgradeView({ outfit, uma, world, tier, upgrades }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; tier: GearTier; upgrades: UmaUpgrades | null }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState<GradeTarget | null>(null)
  if (!isGrades(uma.gear)) return null
  const grades = uma.gear
  const active = activeClass(outfit, uma, tier)
  const weapons = classOf(uma, active).weapons
  const template = umaTemplate(outfit, umaPick(uma))
  const rows = upgradeRows(grades, weapons, active, uma.level, world.items, tier, template.family)
  const marked = upgrades?.grades ?? []
  const isMarked = (target: GradeTarget) => marked.some((m) => JSON.stringify(m) === JSON.stringify(target))
  const map = starMapOf(uma)
  const jewels = upgrades?.jewels.length ?? 0
  const icon = (row: UpgradeRow) => row.target.kind === 'accessory' && grades.accessories[row.target.slot]?.grade && grades.accessories[row.target.slot]?.family
    ? <ItemIcon id={accessoryIconId(grades.accessories[row.target.slot])} size={32} />
    : <GradeIcon target={row.target} grade={row.upgrade.grade} classId={active} />
  return (
    <div className="space-y-2">
      <section className="space-y-1 rounded-sm bg-raised p-2">
        <div className="flex items-center justify-between"><h4 className="text-micro">Grades</h4><HelpButton title="Grades">
          <p>G1–G10</p>
          <p>Gg opens at Lv 5g − 4</p>
          <p>Arms Gem: Weapon Forge</p>
          <p>Tome Ink: Tome Forge</p>
          <p>Armor Fittings: Armorer</p>
          <p>Accessory Setting: Charm Forge</p>
        </HelpButton></div>
        {rows.map((row, i) => (
          <div key={row.key}>
            {(i === 0 || rows[i - 1]!.target.kind !== row.target.kind) && <h4 className="pt-1 pb-1 text-micro">{GROUP_LABEL[row.target.kind]}</h4>}
            <div className="flex min-h-12 items-center gap-2 rounded-sm bg-panel px-2">
              {icon(row)}
              <button type="button" onClick={() => setOpen(row.target)} className="min-h-12 min-w-0 flex-1 text-left text-[12px] font-semibold">{row.text}</button>
              <button type="button" disabled={!row.upgrade.ready} onClick={() => void raiseGear(outfit.outfitId, row.target)}
                aria-label={row.upgrade.ready ? row.upgrade.label : row.upgrade.block ?? row.upgrade.label}
                className="flex min-h-11 max-w-32 items-center justify-center gap-1 rounded-sm bg-sunken px-2 text-[10px] font-semibold leading-tight disabled:text-ink-faint">
                {(isMarked(row.target) || row.upgrade.ready) && <UpgradeMark size={14} />}<span>{row.upgrade.ready ? row.upgrade.label : row.upgrade.block ?? row.upgrade.label}</span>
              </button>
            </div>
          </div>
        ))}
      </section>
      <button type="button" onClick={() => navigate(`/learning/observatory/${outfit.outfitId}`, { state: { back: true } })} className="min-h-11 w-full rounded-sm bg-raised p-2 text-left">
        <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span className="text-[14px] font-semibold">Extra Stats</span>
            {jewels > 0 && <span className="rounded-full bg-success px-1.5 text-[11px] font-bold text-ink-on-dark">{jewels} to set</span>}
          </span>
          <span className="text-[12px] text-ink-soft">{extraStatsCount(map.open.length)} ›</span>
        </span>
      </button>
      {open && <GradeSheet outfitId={outfit.outfitId} uma={uma} world={world} tier={tier} classId={active} target={open} onClose={() => setOpen(null)} />}
    </div>
  )
}

/** The label count on the Upgrade view's tab: raises ready and jewels to set, as the profile's dot reads them. */
export const upgradeCount = (upgrades: UmaUpgrades | null): number => (upgrades ? upgrades.gear + upgrades.stars : 0)

