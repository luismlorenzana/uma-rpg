// Trials (D283, H153; collections.md §6.3): the rank content, the Echoes in a place of their own on the Battle page. The
// same twelve fights, pay and Sweeps the Rift's page held (rift.md §8): Class EXP ×2 to the class she fights as, for
// parties of five Lv 50 Umas. Code and save keep `echo`; the screen says Trial. Routes under `/battle/trials/`: `` the
// grid and `fight` the open Trial, the Rift's fight route with its home here.
import { ECHO_LEVELS, FRONT_NAME, RIFT_FRONTS, type EchoLevel, type RiftFront } from '@rpg/domain'
import { useState } from 'react'
import { CampaignGate, type Campaign } from '../../battle/campaign'
import { FrontCrest } from '../../battle/pixel-icons'
import { useHubNavigation } from '../../hub/navigation'
import type { PageProps } from '../registry'
import { RiftFightRoute } from '../rift/RiftFightRoute'
import { useRift } from '../rift/use-rift'
import { TrialSheet } from './TrialSheet'

export default function TrialsPage({ place, rest }: PageProps) {
  const [kind] = rest.split('/')
  return (
    <CampaignGate>
      {(campaign) => (kind === 'fight' ? <RiftFightRoute campaign={campaign} place={place} /> : <TrialGrid campaign={campaign} place={place} />)}
    </CampaignGate>
  )
}

/** Four fronts at Lv 45, 50 and 55, "✓" on each won; a tap opens its sheet. */
export function TrialGrid({ campaign, place }: { campaign: Campaign; place: PageProps['place'] }) {
  const { world } = useRift()
  const nav = useHubNavigation()
  const [trial, setTrial] = useState<{ front: RiftFront; level: EchoLevel } | null>(null)
  if (!world) return null
  const open = world.rift.battle?.ref.kind === 'echo'
  return (
    <div className="space-y-4 p-3 pb-6">
      <p className="text-[13px] text-ink-soft" data-trials-line>Class EXP ×2 · Lv 50 parties</p>
      {open && (
        <button type="button" onClick={() => nav.sub(place, 'fight')} className="flex min-h-11 w-full items-center justify-center rounded-sm bg-accent font-display font-bold text-accent-ink">
          Resume the open fight
        </button>
      )}
      <ul className="space-y-2" data-trials>
        {RIFT_FRONTS.map((front) => (
          <li key={front} className="flex items-center gap-2 rounded-md bg-raised p-2">
            <FrontCrest front={front} />
            <span className="w-14 shrink-0 text-[13px] font-semibold">{FRONT_NAME[front]}</span>
            <span className="grid flex-1 grid-cols-3 gap-1.5">
              {ECHO_LEVELS.map((level) => {
                const won = !!world.rift.echoes[front]?.[level]
                return (
                  <button key={level} type="button" onClick={() => setTrial({ front, level })} aria-label={`${FRONT_NAME[front]} Trial, Lv ${level}${won ? ', won' : ''}`}
                    className={`min-h-11 rounded-sm border text-[12px] font-semibold ${won ? 'border-accent/60 text-accent' : 'border-hairline-strong'}`}>
                    Lv {level}{won ? ' ✓' : ''}
                  </button>
                )
              })}
            </span>
          </li>
        ))}
      </ul>
      {trial && <TrialSheet campaign={campaign} place={place} front={trial.front} level={trial.level} onClose={() => setTrial(null)} />}
    </div>
  )
}
