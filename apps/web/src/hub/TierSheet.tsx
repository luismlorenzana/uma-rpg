// The Tier shifter's sheet (H36, tiers.md §4): `?sheet=tier` over the current route, opened by the top bar's crest. One
// card per tier, 1 to 3. A tier with a world shows its Uma count and its Rift, and picking another one switches to it
// (`switchTier`); the active one has an accent border and just closes the sheet. A tier with no world is locked until the
// Rift below it promotes Umas.
import { tierKey, TIERS, type Save, type TierWorld } from '@rpg/domain'
import { LockedIcon, Sheet, TierCrest } from '@luismlorenzana/uma-kit/ui'
import { useActiveTier, useGame } from '../save/game'
import { useSwitchTier } from './TierVeil'

export type TierCard = {
  readonly tier: number
  readonly name: string
  readonly active: boolean
} & ({ readonly open: true; readonly count: string; readonly rift: string } | { readonly open: false; readonly lock: string })

/** "No Umas yet", "1 Uma" or "12 Umas". */
export const umaCount = (n: number): string => (n === 0 ? 'No Umas yet' : n === 1 ? '1 Uma' : `${n} Umas`)

/** A world's Rift, in one line. The Rift isn't built yet; its packet replaces this. */
export function riftLine(_world: TierWorld): string {
  return 'The Rift isn’t open yet'
}

/** The sheet's cards: every tier in order, open where the save has its world. */
export function tierCards(save: Pick<Save, 'tierWorlds'>, active: number): TierCard[] {
  return TIERS.map(({ tier, name }) => {
    const world = save.tierWorlds[tierKey(tier)]
    return world
      ? { tier, name, active: tier === active, open: true, count: umaCount(Object.keys(world.umas).length), rift: riftLine(world) }
      : { tier, name, active: tier === active, open: false, lock: `Promote Umas through the Tier ${tier - 1} Rift` }
  })
}

export function TierSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const save = useGame((s) => s.save)
  const active = useActiveTier()
  const switchTier = useSwitchTier()
  const cards = save ? tierCards(save, active) : []
  return (
    <Sheet open={open} onClose={onClose} title="Tiers">
      <ul className="space-y-2" data-tier-cards>
        {cards.map((card) => (
          <li key={card.tier}>
            {card.open ? (
              <button
                type="button"
                data-tier={card.tier}
                aria-current={card.active ? 'true' : undefined}
                onClick={() => (card.active ? onClose() : switchTier(card.tier))}
                className={`flex min-h-16 w-full items-center gap-3 rounded-md border-2 bg-raised px-3 py-2 text-left shadow-1 active:bg-sunken ${
                  card.active ? 'border-accent' : 'border-transparent'
                }`}
              >
                <span aria-hidden className="shrink-0"><TierCrest tier={card.tier} /></span>
                <span className="min-w-0">
                  <span className="font-display block font-semibold">Tier {card.tier} · {card.name}</span>
                  <span className="block text-[13px] text-ink-soft">{card.count}</span>
                  <span className="block text-[13px] text-ink-faint">{card.rift}</span>
                </span>
              </button>
            ) : (
              <div data-tier={card.tier} aria-disabled="true" className="flex min-h-16 items-center gap-3 rounded-md border-2 border-transparent bg-sunken/60 px-3 py-2">
                <span aria-hidden className="shrink-0 opacity-50"><TierCrest tier={card.tier} /></span>
                <span className="min-w-0 flex-1">
                  <span className="font-display block font-semibold text-ink-soft">Tier {card.tier} · {card.name}</span>
                  <span className="block text-[13px] text-ink-faint">{card.lock}</span>
                </span>
                <LockedIcon size={20} className="shrink-0 text-locked" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </Sheet>
  )
}
