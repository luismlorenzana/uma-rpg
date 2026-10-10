import { isPartyFull, PARTY_COUNT } from '@rpg/domain'
import { useWorld } from '../../save/game'

/** The Party Hall's quick look: how many of the twenty parties are full, and how many Umas are placed. */
export default function PartyHallPeek() {
  const world = useWorld()
  const parties = world?.parties ?? []
  const full = parties.filter(isPartyFull).length
  const placed = parties.reduce((n, p) => n + p.slots.filter((s) => s !== null).length, 0)
  const owned = Object.keys(world?.umas ?? {}).length
  return (
    <div className="space-y-4 p-4">
      <p className="text-[15px] leading-relaxed text-ink">Twenty parties of five. Each Uma belongs to one party; busy ones show greyed out.</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-raised p-3">
          <p className="text-micro">Full parties</p>
          <p className="font-display text-2xl font-bold">
            {full} <span className="text-base text-ink-faint">/ {PARTY_COUNT}</span>
          </p>
        </div>
        <div className="rounded-md bg-raised p-3">
          <p className="text-micro">Umas placed</p>
          <p className="font-display text-2xl font-bold">
            {placed} <span className="text-base text-ink-faint">/ {owned}</span>
          </p>
        </div>
      </div>
      {owned === 0 && <p className="text-[13px] text-ink-soft">Unlock Umas in the Stable first.</p>}
    </div>
  )
}
