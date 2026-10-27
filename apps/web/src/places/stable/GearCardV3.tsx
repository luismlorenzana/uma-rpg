// The Gear tab's two views (H107, D219; R2's grades, H79): **Equip**, what she wears (the preset, her weapons, her armor
// half, and her accessory slot as four cards of one shape, ★ on her signature family), and **Upgrade**, every slot's
// grade row with the made item that raises it, then Extra Stats. The data is `gear-equip.ts`'.
import {
  ARMOR_LABEL, ARMOR_SLOTS, ARMOR_SLOT_LABEL, accessoryKinds, activeClass, armorHalf, armorKindFor, armorValues, classOf, EFFECT_LABEL,
  gradeOf, ITEM_EFFECTS, isGrades, madeName, mightAt, raisePlan, starMapOf, umaPoints, umaTemplate, moonTemplate, WEAPON_LABEL,
  type AccessoryFamily, type ArmorSlot, type GearTier, type GradeTarget, type OwnedUma, type RosterOutfit, type RpgClass,
  type RpgDamageKind, type TierWorld, type UmaUpgrades,
} from '@rpg/domain'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { WeaponGlyph } from '../../battle/labels'
import { accessoryIconId } from '../../items/frames'
import { ItemIcon } from '../../items/ItemIcon'
import { pointText } from '../../items/planets'
import { chooseAccessoryForm, raiseGear } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { UpgradeMark } from '../../ui/UpgradeMark'
import { accessoryCards, cardButton, cardKind, upgradeRows, type AccessoryCard, type UpgradeRow } from './gear-equip'
import { gradeUpgradeView } from './gear-v3'
import { PresetButton } from './PresetButton'

const armorStat = (slot: ArmorSlot, grade: number, tier: GearTier) => {
  const values = armorValues(slot, grade, tier)
  const stat = values.stat === 'speed' ? `Evasion ${(values.value * 0.6).toFixed(1)}%`
    : `${({ hp: 'HP', def: 'DEF', mp: 'MP', mdef: 'M.DEF' } as const)[values.stat]} +${values.value}`
  return `${stat} · Offense +${values.offense}`
}

function GradeIcon({ target, grade, classId }: { target: GradeTarget; grade: number; classId: RpgClass }) {
  if (target.kind === 'weapon') return grade > 0 ? <ItemIcon id={`${target.weapon}-g${grade}`} size={32} />
    : <span className="flex size-8 items-center justify-center rounded-xs border border-dashed border-hairline-strong"><WeaponGlyph weapon={target.weapon} size={19} /></span>
  if (target.kind === 'armor') {
    const kind = armorKindFor(target.slot, armorHalf(classId))
    return grade > 0 ? <ItemIcon id={`${kind}-g${grade}`} size={32} />
      : <span className="flex size-8 items-center justify-center rounded-xs border border-dashed border-hairline-strong text-[10px] text-ink-faint">G0</span>
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
  const line = (grade: number) => target.kind === 'weapon' ? `G${grade} · Might ${mightAt(grade, tier)} · weak ×1.3`
    : target.kind === 'armor' ? `G${grade} · ${armorStat(target.slot, grade, tier)}` : `G${grade}`
  let highest = current
  for (let to = current + 1; to <= 10; to++) if (raisePlan(world, outfitId, target, to).block === null) highest = to
  const run = (to?: number) => raiseGear(outfitId, target, to).then(() => { setError(null); setConfirmTo(null) }, (err: unknown) => setError(err instanceof Error ? err.message : 'That didn’t work.'))
  const plan = confirmTo ? raisePlan(world, outfitId, target, confirmTo) : null
  return (
    <BottomSheet title={title} onClose={onClose}>
      <div className="space-y-3">
        <div className="rounded-md bg-raised p-3 text-[13px]">
          <p className="font-semibold">Now · {line(current)}</p>
          {current < 10 && <p className="mt-1 text-ink-soft">Next · {line(current + 1)}</p>}
          {target.kind === 'armor' && <p className="mt-1 text-[11px] text-ink-faint">Her class’s half · {ARMOR_LABEL[armorKindFor(target.slot, armorHalf(classId))]}</p>}
        </div>
        <button type="button" disabled={!upgrade.ready} onClick={() => void run()}
          className="min-h-12 w-full rounded-sm bg-accent px-3 font-semibold text-accent-ink disabled:bg-raised disabled:text-ink-faint">
          {upgrade.ready ? upgrade.label : upgrade.block ?? upgrade.label}
        </button>
        {highest > current + 1 && <button type="button" onClick={() => setConfirmTo(highest)} className="min-h-12 w-full rounded-sm bg-raised font-semibold">Up to G{highest}</button>}
        {error && <p className="text-[13px] text-danger">{error}</p>}
        {confirmTo && plan && (
          <div className="rounded-md border border-hairline-strong p-3">
            <p className="font-semibold">Up to G{confirmTo}</p>
            <ul className="mt-2 space-y-1">
              {plan.items.map((id) => <li key={id} className="flex items-center gap-2 text-[13px]"><ItemIcon id={id} size={28} />{madeName(id)}</li>)}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setConfirmTo(null)} className="min-h-11 rounded-sm bg-raised font-semibold">Cancel</button>
              <button type="button" onClick={() => void run(confirmTo)} className="min-h-11 rounded-sm bg-accent font-semibold text-accent-ink">Raise</button>
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  )
}

// --- Equip ------------------------------------------------------------------------------------------------------------

function AccessoryCardView({ card, grade, onEquip }: { card: AccessoryCard; grade: number; onEquip: (family: AccessoryFamily, kind?: RpgDamageKind) => void }) {
  const [picked, setPicked] = useState<RpgDamageKind | null>(cardKind(card))
  const button = cardButton(card, picked)
  return (
    <div className={`rounded-sm border bg-panel p-2 ${card.wearing ? 'border-accent' : 'border-transparent'}`} data-accessory={card.family}>
      <div className="flex items-center gap-2">
        <ItemIcon id={accessoryIconId({ grade: Math.max(1, grade), family: card.family, form: 'base', ...(picked ? { kind: picked } : {}) })} size={32} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold">{card.signature ? '★ ' : ''}{card.label}</p>
          <p className="text-[11px] text-ink-soft">{card.effect}</p>
        </div>
        <button type="button" disabled={button.disabled} onClick={() => onEquip(card.family, card.kinds.length ? picked ?? undefined : undefined)}
          className="min-h-11 shrink-0 rounded-sm px-3 text-[12px] font-semibold enabled:bg-accent enabled:text-accent-ink disabled:bg-sunken disabled:text-ink-soft">
          {button.label}
        </button>
      </div>
      {card.signature && <p className="mt-1 text-[11px] font-semibold text-accent">{card.signature}</p>}
      {card.kinds.length > 0 && (
        <div role="group" aria-label={`${card.label}: which weapon`} className="mt-2 grid grid-cols-3 gap-1">
          {card.kinds.map(({ kind, label }) => (
            <button key={kind} type="button" aria-pressed={picked === kind} onClick={() => setPicked(kind)}
              className={`min-h-11 rounded-sm border px-1 text-[11px] font-semibold ${picked === kind ? 'border-accent bg-accent/10' : 'border-transparent bg-sunken'}`}>
              {label}
            </button>
          ))}
        </div>
      )}
      {card.stale && <p className="mt-1 text-[11px] font-semibold text-warning">{card.stale}</p>}
    </div>
  )
}

/** Equip: what she wears, nothing to spend. */
export function EquipView({ outfit, uma, world, tier, onSkills }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; tier: GearTier; onSkills: () => void }) {
  const [error, setError] = useState<string | null>(null)
  if (!isGrades(uma.gear)) return null
  const grades = uma.gear
  const active = activeClass(outfit, uma)
  const weapons = classOf(uma, active).weapons
  const kinds = accessoryKinds(uma, active)
  const signature = umaTemplate(outfit, uma.calling.pick).family
  const equip = (slot: number) => (family: AccessoryFamily, kind?: RpgDamageKind) => chooseAccessoryForm(outfit.outfitId, active, slot, family, kind)
    .then(() => setError(null), (err: unknown) => setError(err instanceof Error ? err.message : 'That didn’t work.'))
  return (
    <div className="space-y-3">
      <PresetButton outfit={outfit} uma={uma} world={world} />
      <section className="space-y-1.5 rounded-md bg-raised p-3">
        <div className="flex items-center justify-between">
          <h4 className="text-micro">Weapons</h4>
          <button type="button" onClick={onSkills} className="min-h-11 px-1 text-[12px] font-semibold text-ink-soft">Set on Skills ›</button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {weapons.map((weapon) => {
            const target: GradeTarget = { kind: 'weapon', weapon }
            const grade = gradeOf(grades, target)
            return (
              <div key={weapon} className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-sm bg-panel p-1.5 text-center">
                <GradeIcon target={target} grade={grade} classId={active} />
                <span className="text-[11px] font-semibold">{WEAPON_LABEL[weapon]} · G{grade}</span>
              </div>
            )
          })}
        </div>
        <h4 className="pt-1 text-micro">Armor</h4>
        <p className="rounded-sm bg-panel px-2 py-2 text-[12px]">
          <span className="font-semibold">{armorHalf(active) === 'magical' ? 'Magical' : 'Physical'} armor</span>
          <span className="text-ink-soft"> · {ARMOR_SLOTS.map((slot) => `${ARMOR_SLOT_LABEL[slot]} G${gradeOf(grades, { kind: 'armor', slot })}`).join(' · ')}</span>
        </p>
      </section>
      {grades.accessories.map((slot, i) => (
        <section key={i} className="space-y-1.5 rounded-md bg-raised p-3">
          <div className="flex items-center justify-between">
            <h4 className="text-micro">Accessory · G{slot.grade}</h4>
            <HelpButton title="Accessory"><p>What she wears. A form changes freely outside fights; its strength follows the slot’s grade, raised on Upgrade.</p></HelpButton>
          </div>
          {accessoryCards(slot, kinds, signature, uma.level, tier).map((card) => (
            <AccessoryCardView key={`${card.family}:${card.wornKind ?? ''}:${card.wearing}`} card={card} grade={slot.grade} onEquip={equip(i)} />
          ))}
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
  const active = activeClass(outfit, uma)
  const weapons = classOf(uma, active).weapons
  const template = umaTemplate(outfit, uma.calling.pick)
  const rows = upgradeRows(grades, weapons, active, uma.level, world.items, tier, template.family)
  const marked = upgrades?.grades ?? []
  const isMarked = (target: GradeTarget) => marked.some((m) => JSON.stringify(m) === JSON.stringify(target))
  const points = umaPoints(uma, active, tier, moonTemplate(outfit, uma.calling.pick))
  const map = starMapOf(uma)
  const jewels = upgrades?.jewels.length ?? 0
  const icon = (row: UpgradeRow) => row.target.kind === 'accessory' && grades.accessories[row.target.slot]?.grade && grades.accessories[row.target.slot]?.family
    ? <ItemIcon id={accessoryIconId(grades.accessories[row.target.slot])} size={32} />
    : <GradeIcon target={row.target} grade={row.upgrade.grade} classId={active} />
  return (
    <div className="space-y-3">
      <section className="space-y-1.5 rounded-md bg-raised p-3">
        <div className="flex items-center justify-between"><h4 className="text-micro">Grades</h4><HelpButton title="Grades"><p>A made item raises one slot a grade, up to G10. Grade g opens at Uma Lv 5g − 4. Arms Gems, Tome Ink, Armor Fittings and Accessory Settings come from the Forge, the Workbench, the Armorer and the Charm Shop.</p></HelpButton></div>
        {rows.map((row, i) => (
          <div key={row.key}>
            {(i === 0 || rows[i - 1]!.target.kind !== row.target.kind) && <h4 className="pt-1 pb-1 text-micro">{GROUP_LABEL[row.target.kind]}</h4>}
            <div className="flex min-h-14 items-center gap-2 rounded-sm bg-panel px-2">
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
      <button type="button" onClick={() => navigate(`/town/observatory/${outfit.outfitId}`, { state: { fromHub: true } })} className="w-full rounded-md bg-raised p-3 text-left">
        <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span className="text-[14px] font-semibold">Extra Stats</span>
            {jewels > 0 && <span className="rounded-full bg-success px-1.5 text-[11px] font-bold text-ink-on-dark">{jewels} to set</span>}
          </span>
          <span className="text-[12px] text-ink-soft">{map.open.length}/22 open · map ›</span>
        </span>
        <span className="mt-1 block text-[11px] text-ink-faint">
          Total with armor: {ITEM_EFFECTS.filter((e) => points[e]).map((e) => `${EFFECT_LABEL[e]} ${pointText(e, points[e])}`).join(' · ') || 'nothing yet'}
        </span>
      </button>
      {open && <GradeSheet outfitId={outfit.outfitId} uma={uma} world={world} tier={tier} classId={active} target={open} onClose={() => setOpen(null)} />}
    </div>
  )
}

/** The label count on the Upgrade view's tab: raises ready and jewels to set, as the profile's dot reads them. */
export const upgradeCount = (upgrades: UmaUpgrades | null): number => (upgrades ? upgrades.gear + upgrades.stars : 0)

