import {
  ACCESSORY_FAMILY_LABEL, ARMOR_LABEL, ARMOR_SLOTS, ARMOR_SLOT_LABEL, accessoryFlatValue, activeClass, armorHalf, armorKindFor, armorValues, classOf, gradeOf, isGrades, isRpgElement, madeName, mightAt, raisePlan,
  rpgTomeOf, rpgWeaponKind, signatureBonus, signatureWorn, umaTemplate, WEAPON_LABEL,
  type AccessoryFamily, type ArmorSlot, type GearTier, type GradeTarget, type OwnedUma, type RosterOutfit, type RpgClass,
  type RpgDamageKind, type RpgWeapon, type TierWorld,
} from '@rpg/domain'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { WeaponGlyph } from '../../battle/labels'
import { accessoryIconId } from '../../items/frames'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { chooseAccessoryForm, raiseGear } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { UpgradeMark } from '../../ui/UpgradeMark'
import { accessoryChoicesV3 } from './accessory-v3'
import { accessoryGradeLine, armorGradeLine, gradeUpgradeView, weaponGradeLine } from './gear-v3'

type Open = { target: GradeTarget } | { accessory: number } | null

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

function AccessorySheetV3({ outfitId, uma, world, tier, classId, slot, signature, onClose }: {
  outfitId: string; uma: OwnedUma; world: TierWorld; tier: GearTier; classId: RpgClass; slot: number; signature: AccessoryFamily; onClose: () => void
}) {
  if (!isGrades(uma.gear)) return null
  const grades = uma.gear
  const state = uma.gear.accessories[slot]
  const weapons = classOf(uma, classId).weapons
  const choices = useMemo(() => accessoryChoicesV3(signature, weapons, classId), [signature, weapons, classId])
  const [error, setError] = useState<string | null>(null)
  const [gradeOpen, setGradeOpen] = useState(false)
  const choose = (family: AccessoryFamily, kind?: RpgDamageKind) => chooseAccessoryForm(outfitId, classId, slot, family, kind)
    .then(() => setError(null), (err: unknown) => setError(err instanceof Error ? err.message : 'That didn’t work.'))
  const grade = state?.grade ?? 0
  const familyLine = (family: AccessoryFamily) => family === 'pendant' ? `+${accessoryFlatValue(family, grade, tier)} on her three kinds`
    : family === 'insignia' ? `+${(grade * 1.5).toFixed(grade % 2 ? 1 : 0)}% on sub-bosses and bosses` : ''
  return (
    <BottomSheet title="Accessory" onClose={onClose}>
      <div className="space-y-3">
        <p className="text-[13px] text-ink-soft">G{state?.grade ?? 0} · changing form keeps its grade</p>
        {choices.map((choice) => (
          <section key={choice.family} className="rounded-md bg-raised p-2">
            <div className="flex items-center gap-2">
              <ItemIcon id={accessoryIconId({ grade: Math.max(1, state?.grade ?? 0), family: choice.family, form: 'base',
                ...((choice.family === 'orb' || choice.family === 'bell') ? { kind: choice.kinds[0]?.kind } : {}) })} size={32} />
              <span className="flex-1 text-[13px] font-semibold">{choice.signature ? '★ ' : ''}{choice.label}</span>
              {!choice.kinds.length && <button type="button" onClick={() => void choose(choice.family)} className="min-h-11 rounded-sm bg-panel px-3 text-[12px] font-semibold">Wear</button>}
            </div>
            {choice.signature && <p className="mt-1 text-[11px] text-ink-soft">ATK and M.ATK +{signatureBonus(uma.level, tier)} (her signature)</p>}
            {familyLine(choice.family) && <p className="mt-1 text-[11px] text-ink-soft">{familyLine(choice.family)}</p>}
            {!!choice.kinds.length && <div className="mt-2 grid grid-cols-2 gap-1">
              {choice.kinds.map(({ kind, label }) => {
                const worn = state?.family === choice.family && state.kind === kind
                return <button key={kind} type="button" onClick={() => void choose(choice.family, kind)}
                  className={`min-h-11 rounded-sm px-2 text-left text-[11px] font-semibold ${worn ? 'bg-accent text-accent-ink' : 'bg-panel'}`}>
                  {label}{choice.family === 'orb' ? ` · +${accessoryFlatValue('orb', grade, tier)} offense` : ` · ${(grade / 10).toFixed(1)} after her Attack`}
                </button>
              })}
            </div>}
          </section>
        ))}
        {state?.family === 'bell' && state.kind && !weapons.some((weapon) => rpgWeaponKind(weapon) === state.kind) &&
          <p className="text-[13px] text-warning">No {WEAPON_LABEL[isRpgElement(state.kind) ? rpgTomeOf(state.kind) : state.kind]} in her slots</p>}
        <button type="button" onClick={() => setGradeOpen(true)} className="min-h-12 w-full rounded-sm bg-raised font-semibold">Grade</button>
        {error && <p className="text-[13px] text-danger">{error}</p>}
        {gradeOpen && <GradeSheet outfitId={outfitId} uma={uma} world={world} tier={tier} classId={classId}
          target={{ kind: 'accessory', slot }} onClose={() => setGradeOpen(false)} />}
      </div>
    </BottomSheet>
  )
}

export function GearCardV3({ outfit, uma, world, tier, marked = [] }: {
  outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; tier: GearTier; marked?: readonly GradeTarget[]
}) {
  if (!isGrades(uma.gear)) return null
  const grades = uma.gear
  const active = activeClass(outfit, uma)
  const weapons = classOf(uma, active).weapons
  const template = umaTemplate(outfit, uma.calling.pick)
  const [open, setOpen] = useState<Open>(null)
  const matches = (target: GradeTarget) => marked.some((m) => JSON.stringify(m) === JSON.stringify(target))
  const Row = ({ target, icon, text, onClick }: { target: GradeTarget; icon: ReactNode; text: string; onClick: () => void }) => {
    const upgrade = gradeUpgradeView(grades, target, uma.level, world.items)
    return <div className="flex min-h-14 items-center gap-2 rounded-sm bg-panel px-2">
      {icon}<button type="button" onClick={onClick} className="min-h-12 min-w-0 flex-1 text-left text-[12px] font-semibold">{text}</button>
      <button type="button" disabled={!upgrade.ready} onClick={() => void raiseGear(outfit.outfitId, target)} aria-label={upgrade.ready ? upgrade.label : upgrade.block ?? upgrade.label}
        className="flex min-h-11 max-w-32 items-center justify-center gap-1 rounded-sm bg-sunken px-2 text-[10px] font-semibold leading-tight disabled:text-ink-faint">
        {(matches(target) || upgrade.ready) && <UpgradeMark size={14} />}<span>{upgrade.ready ? upgrade.label : upgrade.block ?? upgrade.label}</span>
      </button>
    </div>
  }
  const accessory = grades.accessories[0]
  const accessoryTarget: GradeTarget = { kind: 'accessory', slot: 0 }
  return (
    <section className="space-y-1.5 rounded-md bg-raised p-3">
      <div className="flex items-center justify-between"><h4 className="text-micro">Gear</h4><HelpButton title="Grades"><p>A made item raises one slot a grade, up to G10. Grade g opens at Lv 5g − 4. Weapon Gems, Armor Fittings and Accessory Settings come from the Forge, the Armorer and the Charm Shop.</p></HelpButton></div>
      <h4 className="pt-1 text-micro">Weapons</h4>
      {weapons.map((weapon) => { const target: GradeTarget = { kind: 'weapon', weapon }; const grade = gradeOf(grades, target)
        return <Row key={weapon} target={target} icon={<GradeIcon target={target} grade={grade} classId={active} />} text={weaponGradeLine(grades, weapon, tier)} onClick={() => setOpen({ target })} /> })}
      <h4 className="pt-1 text-micro">Armor</h4>
      {ARMOR_SLOTS.map((slot) => { const target: GradeTarget = { kind: 'armor', slot }; const grade = gradeOf(grades, target)
        return <Row key={slot} target={target} icon={<GradeIcon target={target} grade={grade} classId={active} />} text={armorGradeLine(grades, slot, active, tier)} onClick={() => setOpen({ target })} /> })}
      <h4 className="pt-1 text-micro">Accessory</h4>
      <Row target={accessoryTarget} icon={accessory?.grade && accessory.family ? <ItemIcon id={accessoryIconId(accessory)} size={32} /> : <GradeIcon target={accessoryTarget} grade={accessory?.grade ?? 0} classId={active} />}
        text={accessoryGradeLine(accessory, weapons, tier, template.family, uma.level)} onClick={() => setOpen({ accessory: 0 })} />
      {!signatureWorn(grades, template.family) && <p className="px-2 text-[11px] text-ink-faint">Wear a {ACCESSORY_NAME[template.family]} for ★ +{signatureBonus(uma.level, tier)}</p>}
      {open && 'target' in open && <GradeSheet outfitId={outfit.outfitId} uma={uma} world={world} tier={tier} classId={active} target={open.target} onClose={() => setOpen(null)} />}
      {open && 'accessory' in open && <AccessorySheetV3 outfitId={outfit.outfitId} uma={uma} world={world} tier={tier} classId={active} slot={open.accessory} signature={template.family} onClose={() => setOpen(null)} />}
    </section>
  )
}

const ACCESSORY_NAME: Record<AccessoryFamily, string> = ACCESSORY_FAMILY_LABEL
