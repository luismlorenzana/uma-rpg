import { isPartyFull, PARTY_COUNT } from '@rpg/domain'
import { useWorld } from '../../save/game'

/** The Party Hall header's counter: full parties out of twenty. */
export default function PartyCounter() {
  const full = useWorld()?.parties.filter(isPartyFull).length ?? 0
  return (
    <span className="font-display text-[15px] font-bold" aria-label={`${full} of ${PARTY_COUNT} parties full`}>
      {full}
      <span className="text-ink-faint">/{PARTY_COUNT}</span>
    </span>
  )
}
