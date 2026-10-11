import { useWorld } from '../../save/game'
import { LaurelIcon } from '../../ui/icons'

/** The Scenario Gate header's counter: Laurels earned in battle (D51), spent at the Exchange from S4. */
export default function LaurelCounter() {
  const laurels = useWorld()?.wallet.laurels ?? 0
  return (
    <span className="flex items-center gap-1 font-display text-[15px] font-bold text-laurel" aria-label={`${laurels} Laurels`}>
      <LaurelIcon size={20} /> {laurels}
    </span>
  )
}
