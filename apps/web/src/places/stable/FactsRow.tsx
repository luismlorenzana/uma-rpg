// The profile's three compact doors (UP26): state at a glance, each also the honest route to change it.
import {
  isInFight, partyOf, placeById, slotJobOf, tradePlaces, umaPick, umaTrade,
  type OwnedUma, type RosterOutfit, type TierWorld,
} from '@rpg/domain'
import { useNavigate } from 'react-router'
import { formatDuration, useNow } from '../../ui/useNow'
import * as copy from './copy'

export interface FactsRowProps {
  outfit: RosterOutfit
  uma: OwnedUma
  world: TierWorld
  tier: number
  onDetails: () => void
}

export function FactsRow({ outfit, uma, world, tier, onDetails }: FactsRowProps) {
  const navigate = useNavigate()
  const now = useNow()
  const party = partyOf(world, outfit.outfitId)
  const fighting = isInFight(world, outfit.outfitId)
  const job = slotJobOf(world, outfit.outfitId, now, tier)
  const jobPlace = placeById(job?.placeId)
  const idlePlace = placeById(tradePlaces(umaTrade(outfit, umaPick(uma)))[0])
  const partyValue = copy.party(fighting ? 'fighting' : party ? party.party + 1 : null)
  const workValue = copy.work(
    jobPlace?.name ?? null,
    job ? (job.done ? 'done' : formatDuration(job.endsAt - Date.parse(now))) : undefined,
  )

  const openParty = () => navigate(party ? `/town/party-hall/${party.party + 1}` : '/town/party-hall', { state: { back: true } })
  const openWork = () => {
    const place = jobPlace ?? idlePlace
    if (place) navigate(`/${place.page}/${place.id}`, { state: { back: true } })
  }

  return (
    <div className="grid grid-cols-3 gap-1.5" data-profile-facts>
      <Fact label={copy.profileFacts.party} value={partyValue} accent={fighting} onClick={openParty} />
      <Fact label={copy.profileFacts.work} value={workValue} accent={job?.done === true} onClick={openWork} />
      <button type="button" onClick={onDetails} className="min-h-11 rounded-md bg-panel px-1.5 text-center active:bg-raised">
        <span className="block text-[11px] font-semibold text-ink-soft">{copy.profileFacts.details}</span>
      </button>
    </div>
  )
}

function Fact({ label, value, accent = false, onClick }: { label: string; value: string; accent?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="min-h-11 min-w-0 rounded-md bg-panel px-1.5 text-center active:bg-raised">
      <span className="block text-[10px] font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
      <span className={`block truncate text-[11px] font-semibold ${accent ? 'text-success' : 'text-ink-soft'}`}>{value}</span>
    </button>
  )
}
