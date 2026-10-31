// The Gear tab (H121; D239 UP13, UP14, UP22; proposal §4.2; D264's three accessory slots): one view of eleven tiles. A tile
// opens one sheet with its cost, before → after, the target grades and one Raise button, and Raise all spends every ready slot
// behind one confirm. An accessory tile's sheet also holds its list, where a tap wears a row and closes it (D266), so what a
// tile shows is what the save holds. Weapons are chosen on the Class tab and raised here. The data is `gear-view.ts`'.
import {
  accessoryKinds, accessorySlotValue, activeClass, armorHalf, armorKindFor, classOf, INSIGNIA_SLOT_PERMILLE, isGrades, signatureBonus, signatureWorn,
  umaPick, umaTemplate, WEAPON_LABEL, type AccessoryFamily, type ArmorSlot, type GearTier, type GradeTarget, type OwnedUma, type RosterOutfit, type RpgClass,
  type RpgDamageKind, type RpgWeapon, type TierWorld, type UmaUpgrades,
} from '@rpg/domain'
import { useState } from 'react'
import { WeaponGlyph } from '../../battle/labels'
import { accessoryIconId } from '../../items/frames'
import { ItemIcon } from '../../items/ItemIcon'
import { chooseAccessoryForm, raiseAll, raiseGear } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { actions, armorHalf as armorHalfCopy, armorSlot, gearSummary, grade, signature, usesItems } from './copy'
import { accessoryChoices, type AccessoryChoice } from './gear-equip'
import { accessoryGradeLine } from './gear-v3'
import { gearTiles, raiseAllPlan, raiseSheet, type GearTile, type RaiseView } from './gear-view'

const failed = (err: unknown) => (err instanceof Error ? err.message : 'That didn’t work.')

export function GearTab({ outfit, uma, world, tier, upgrades }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; tier: GearTier; upgrades: UmaUpgrades | null }) {
  const [open, setOpen] = useState<GradeTarget | null>(null)
  const [all, setAll] = useState(false)
  if (!isGrades(uma.gear)) return null
  const grades = uma.gear
  const active = activeClass(outfit, uma, tier)
  const weapons = classOf(uma, active).weapons
  const tiles = gearTiles(grades, weapons, accessoryKinds(uma, active), tier, upgrades)
  const plan = raiseAllPlan(world, outfit.outfitId, weapons)
  const value = (of: AccessoryFamily) => accessorySlotValue(of, 10, tier)
  const close = () => setOpen(null)
  return (
    <div className="space-y-2" data-gear-tab>
      <div className="flex min-h-11 items-center justify-between gap-2">
        <p className="text-[12.5px] font-semibold">{gearSummary(armorHalf(active), upgrades?.gear ?? 0)}</p>
        <span className="flex items-center gap-1">
          {plan.steps.length > 0 && <button type="button" onClick={() => setAll(true)} className="min-h-11 rounded-sm bg-accent px-3 text-[12.5px] font-bold text-accent-ink">{actions.raiseAll}</button>}
          <HelpButton title="Gear">
            <p>G1–G10</p>
            <p>Gg opens at Lv 5g − 4</p>
            <p>Arms Gem: Weapon Forge</p>
            <p>Tome Ink: Tome Forge</p>
            <p>Armor Fittings: Armorer</p>
            <p>Accessory Setting: Charm Forge</p>
            <p>Physical or Magical: her class's half of all five slots.</p>
            <p>Pendant · ATK +{value('pendant')} at G10</p>
            <p>Charm · M.ATK +{value('bell')} at G10</p>
            <p>Orb · +{value('orb')} on one kind at G10</p>
            <p>Insignia · +{INSIGNIA_SLOT_PERMILLE / 10}% a grade on sub-bosses and bosses</p>
            <p>Three slots, each with its own grade. The same one can fill more than one, and they add up.</p>
          </HelpButton>
        </span>
      </div>
      <section aria-label="Weapons">
        <h4 className="text-micro mb-1">Weapons</h4>
        <div className="grid grid-cols-3 gap-1.5">
          {tiles.weapons.map((tile) => <Tile key={tile.name} tile={tile} classId={active} onOpen={() => setOpen(tile.target)} />)}
        </div>
      </section>
      <section aria-label="Armor">
        <h4 className="text-micro mb-1">Armor</h4>
        <div className="grid grid-cols-5 gap-1">
          {tiles.armor.map((tile) => <Tile key={tile.name} tile={tile} classId={active} onOpen={() => setOpen(tile.target)} />)}
        </div>
      </section>
      <section aria-label="Accessories">
        <h4 className="text-micro mb-1">Accessories</h4>
        <div className="grid grid-cols-3 gap-1.5">
          {tiles.accessories.map((tile) => {
            const slot = grades.accessories[tile.slot]!
            return (
              <button key={tile.slot} type="button" onClick={() => setOpen(tile.target)} aria-label={`Accessory ${tile.slot + 1}, ${tile.text}, grade ${tile.grade}${tile.ready ? ', ready' : ''}`}
                className="relative flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-sm bg-raised px-1 py-1 text-center">
                {tile.ready && <ReadyDot />}
                {slot.family
                  ? <ItemIcon id={accessoryIconId({ ...slot, grade: Math.max(1, slot.grade) })} size={28} />
                  : <span className="size-7 rounded-xs border border-dashed border-hairline-strong" />}
                <span className={`w-full text-[11px] font-semibold leading-tight ${tile.stale ? 'text-warning' : ''}`}>{tile.stale ?? tile.text}</span>
                <GradeBadge grade={tile.grade} />
              </button>
            )
          })}
        </div>
      </section>
      {open?.kind === 'accessory' && <AccessorySheet outfit={outfit} uma={uma} world={world} tier={tier} slot={open.slot} onClose={close} />}
      {open && open.kind !== 'accessory' && <RaiseSheet outfitId={outfit.outfitId} world={world} tier={tier} classId={active} target={open} weapons={weapons} onClose={close} />}
      {all && <RaiseAllSheet outfitId={outfit.outfitId} world={world} weapons={weapons} onClose={() => setAll(false)} />}
    </div>
  )
}

const ReadyDot = () => <span aria-hidden className="absolute left-1 top-1 size-1.5 rounded-full bg-success" />
const GradeBadge = ({ grade: value }: { grade: number }) => <span className="absolute right-1 top-1 rounded-full bg-page/90 px-1 text-[11px] font-bold leading-4 text-ink">{grade(value)}</span>

/** A weapon or armor slot's icon: its made item, an empty frame at G0. */
function SlotIcon({ target, grade: value, classId }: { target: GradeTarget; grade: number; classId: RpgClass }) {
  if (target.kind === 'weapon') return value > 0 ? <ItemIcon id={`${target.weapon}-g${value}`} size={28} />
    : <span className="flex size-7 items-center justify-center rounded-xs border border-dashed border-hairline-strong"><WeaponGlyph weapon={target.weapon} size={17} /></span>
  const slot = (target as { slot: ArmorSlot }).slot
  return value > 0 ? <ItemIcon id={`${armorKindFor(slot, armorHalf(classId))}-g${value}`} size={28} /> : <span className="size-7 rounded-xs border border-dashed border-hairline-strong" />
}

function Tile({ tile, classId, onOpen }: { tile: GearTile; classId: RpgClass; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} data-gear-tile={tile.name} aria-label={`${tile.name}, grade ${tile.grade}, ${tile.stat}${tile.ready ? ', ready' : ''}`}
      className="relative flex min-h-16 min-w-0 flex-col items-center justify-center gap-0.5 rounded-sm bg-raised px-0.5 py-1 text-center">
      {tile.ready && <ReadyDot />}
      <SlotIcon target={tile.target} grade={tile.grade} classId={classId} />
      <span className="w-full text-[11px] font-semibold leading-tight">{tile.stat}</span>
      <GradeBadge grade={tile.grade} />
    </button>
  )
}

/** The part every raise sheet shares: before → after, each grade's cost, the target grades. */
function RaiseBody({ view, onPick }: { view: RaiseView; onPick: (to: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="text-center" aria-live="polite" data-raise-plan>
        <p className="font-display text-[22px] font-extrabold leading-tight">{view.step}</p>
        {view.value && <p className="text-[14px] font-semibold text-ink-soft">{view.value}</p>}
      </div>
      {view.costs.length > 0 && <ul className="space-y-0.5" aria-label="Cost">{view.costs.map((cost) => <li key={cost} className="text-center text-[12.5px] text-ink-soft">{cost}</li>)}</ul>}
      {view.chips.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1" role="radiogroup" aria-label="Target grade">
          {view.chips.map((chip) => (
            <button key={chip.grade} type="button" role="radio" aria-checked={chip.selected} disabled={!!chip.gate} onClick={() => onPick(chip.grade)}
              className={`flex min-h-11 min-w-11 flex-col items-center justify-center rounded-sm bg-raised px-1 text-[12.5px] font-semibold leading-tight ${chip.selected ? 'ring-2 ring-accent' : ''} ${chip.gate ? 'opacity-40' : ''}`}>
              {grade(chip.grade)}
              {chip.gate && <span className="text-[11px] font-normal">{chip.gate}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** The Raise button: a raise stays on the sheet, on the new grade (G5). */
function useRaise(outfitId: string, target: GradeTarget, view: RaiseView, onDone: () => void) {
  const [error, setError] = useState<string | null>(null)
  const raise = () => view.footer && raiseGear(outfitId, target, view.footer.to).then(() => { setError(null); onDone() }, (err: unknown) => setError(failed(err)))
  const footer = view.footer
    ? <button type="button" disabled={!view.footer.ready} onClick={() => void raise()}
        className={`min-h-12 w-full rounded-sm px-3 font-display font-bold ${view.footer.ready ? 'bg-accent text-accent-ink' : 'bg-raised text-[14px] text-ink-soft'}`}>{view.footer.label}</button>
    : undefined
  return { error, footer }
}

/** A weapon's or an armor slot's sheet. */
function RaiseSheet({ outfitId, world, tier, classId, target, weapons, onClose }: {
  outfitId: string; world: TierWorld; tier: GearTier; classId: RpgClass; target: Exclude<GradeTarget, { kind: 'accessory' }>; weapons: readonly RpgWeapon[]; onClose: () => void
}) {
  const [to, setTo] = useState<number | null>(null)
  const view = raiseSheet(world, outfitId, target, classId, tier, to)
  const { error, footer } = useRaise(outfitId, target, view, () => setTo(null))
  const title = target.kind === 'weapon' ? `${WEAPON_LABEL[target.weapon]} · Slot ${weapons.indexOf(target.weapon) + 1}`
    : `${armorSlot(target.slot)} · ${armorHalfCopy(armorHalf(classId))}`
  return (
    <BottomSheet title={title} onClose={onClose} footer={footer}>
      <RaiseBody view={view} onPick={setTo} />
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </BottomSheet>
  )
}

/** One accessory slot's sheet, Gear's and Template's ★ Signature row's (H123): its raise, and its list, where a tap wears a row
 * and closes the sheet (D266). */
export function AccessorySheet({ outfit, uma, world, tier, slot, onClose }: { outfit: RosterOutfit; uma: OwnedUma; world: TierWorld; tier: GearTier; slot: number; onClose: () => void }) {
  const [to, setTo] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const target: GradeTarget = { kind: 'accessory', slot }
  const active = activeClass(outfit, uma, tier)
  const view = raiseSheet(world, outfit.outfitId, target, active, tier, to)
  const raised = useRaise(outfit.outfitId, target, view, () => setTo(null))
  if (!isGrades(uma.gear)) return null
  const state = uma.gear.accessories[slot]!
  const family = umaTemplate(outfit, umaPick(uma)).family
  const choices = accessoryChoices(state, accessoryKinds(uma, active), family, tier)
  const pick = (choice: AccessoryChoice) => (choice.worn ? onClose()
    : void chooseAccessoryForm(outfit.outfitId, active, slot, choice.family, (choice.kind ?? undefined) as RpgDamageKind | undefined).then(onClose, (err: unknown) => setError(failed(err))))
  return (
    <BottomSheet title={`Accessory ${slot + 1} · ${grade(state.grade)}`} onClose={onClose} footer={raised.footer}>
      <div className="space-y-2">
        <div className="space-y-0.5 text-center">
          <p className="text-[12.5px] font-semibold">{accessoryGradeLine(state, classOf(uma, active).weapons, tier, family, uma.level)}</p>
          <p className="text-[11px] text-ink-soft">{signature(signatureBonus(uma.level, tier), signatureWorn(uma.gear, family))}</p>
        </div>
        <RaiseBody view={view} onPick={setTo} />
        <div className="space-y-1" role="group" aria-label="Accessory">
          {choices.map((choice) => (
            <button key={`${choice.family}-${choice.kind}`} type="button" aria-pressed={choice.worn} onClick={() => pick(choice)}
              className={`flex min-h-11 w-full items-center gap-2 rounded-sm bg-raised px-2 text-left text-[14px] ${choice.worn ? 'ring-2 ring-accent ring-inset' : ''}`}>
              <ItemIcon id={accessoryIconId({ grade: Math.max(1, state.grade), family: choice.family, form: 'base', ...(choice.kind ? { kind: choice.kind } : {}) })} size={28} />
              <span className="min-w-0 flex-1 truncate"><span className="font-semibold">{choice.signature ? '★ ' : ''}{choice.label}</span> <span className="text-ink-soft">{choice.effect}</span></span>
              {choice.worn && <span aria-hidden className="shrink-0 font-bold text-accent">✓</span>}
            </button>
          ))}
        </div>
        {(error ?? raised.error) && <p className="text-[13px] text-danger">{error ?? raised.error}</p>}
      </div>
    </BottomSheet>
  )
}

/** Raise all: every line, what it uses, and one button. It closes when done: nothing is left to list. */
function RaiseAllSheet({ outfitId, world, weapons, onClose }: { outfitId: string; world: TierWorld; weapons: readonly RpgWeapon[]; onClose: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const plan = raiseAllPlan(world, outfitId, weapons)
  const go = () => void raiseAll(outfitId, plan.steps).then(onClose, (err: unknown) => setError(failed(err)))
  return (
    <BottomSheet title={actions.raiseAll} onClose={onClose} footer={plan.steps.length > 0
      ? <button type="button" onClick={go} className="min-h-12 w-full rounded-sm bg-accent px-3 font-display font-bold text-accent-ink">{actions.raise(plan.steps.length)}</button>
      : undefined}>
      <ul className="space-y-1" aria-label="Raises">
        {plan.lines.map((line) => <li key={line} className="rounded-sm bg-raised px-3 py-2 text-[12.5px] font-semibold">{line}</li>)}
      </ul>
      {plan.items > 0 && <p className="mt-2 text-center text-[12.5px] text-ink-soft">{usesItems(plan.items)}</p>}
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </BottomSheet>
  )
}

