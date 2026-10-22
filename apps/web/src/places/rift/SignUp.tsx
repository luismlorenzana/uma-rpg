// Sign up twenty (H50, rift.md §4, R2): four parties of five Lv 50 Umas, or twenty Lv 50 Umas picked one by one; then a
// confirm sheet with the twenty faces. Route `signup`.
import { UmaPicker } from '@luismlorenzana/uma-kit/album'
import { formatLevel } from '@luismlorenzana/uma-kit/roster'
import { FaceTile } from '@luismlorenzana/uma-kit/album'
import { RIFT_ROSTER, riftLevel50s, RPG_TIER_MAX_LEVEL, SaveRuleError } from '@rpg/domain'
import { signUpBlock } from '@rpg/domain/rift'
import { useState } from 'react'
import { activePartyRows } from '../../album/party-rows'
import { albumRows } from '../../album/rows'
import type { Campaign } from '../../battle/campaign'
import { useHubNavigation } from '../../hub/navigation'
import { signUpForRift, useAlbumScope } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import type { PageProps } from '../registry'
import { levelPartyBlock } from './rift-view'
import { useRift } from './use-rift'

export function SignUp({ campaign, place }: { campaign: Campaign; place: PageProps['place'] }) {
  const { save, world, run, key } = useRift()
  const scope = useAlbumScope()
  const nav = useHubNavigation()
  const [mode, setMode] = useState<'parties' | 'umas' | null>(null)
  const [roster, setRoster] = useState<string[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const back = () => nav.subBack(place)
  if (!save || !world) return null
  if (run) {
    return (
      <div className="space-y-3 p-4">
        <p className="text-ink-soft">A run is on.</p>
        <button type="button" onClick={back} className="min-h-11 rounded-sm bg-raised px-4 font-semibold">Back to the Rift</button>
      </div>
    )
  }
  const n50 = riftLevel50s(world)
  const partyRows = mode === 'parties' ? activePartyRows(campaign.view, world) : []
  const umaRows = mode === 'umas' ? albumRows(campaign.view, world, [], undefined, scope).filter((row) => row.uma) : []
  const block = roster ? signUpBlock(save, roster, key) : null
  const signUp = async () => {
    if (!roster) return
    try {
      await signUpForRift(roster)
      back()
    } catch (err) {
      setError(err instanceof SaveRuleError ? err.message : 'Couldn’t sign up.')
    }
  }
  return (
    <div className="space-y-3 p-4">
      <h2 className="font-display text-lg font-bold">Sign up twenty</h2>
      <p className="text-[13px] text-ink-soft">{n50 >= RIFT_ROSTER ? `${n50} Lv 50 Umas` : `${n50} of ${RIFT_ROSTER} at Lv 50`}</p>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => { setError(null); setMode('parties') }} className="min-h-14 rounded-sm bg-accent font-display font-bold text-accent-ink">Four parties</button>
        <button type="button" onClick={() => { setError(null); setMode('umas') }} className="min-h-14 rounded-sm border border-hairline-strong bg-raised font-display font-bold">Twenty Umas</button>
      </div>
      {error && <p role="alert" className="text-[13px] text-danger">{error}</p>}
      {mode === 'parties' && (
        <UmaPicker open title="Four parties" rows={partyRows} max={4} disabled={(row) => levelPartyBlock(world, row.partyIndex)}
          describe={(row) => `${row.members.length}/5 · ${formatLevel(row.level)}`}
          renderChips={(row) => row.members.map((id) => <span key={id} className="w-5"><FaceTile outfitId={id} size={20} label={campaign.outfits.get(id)?.name ?? 'Uma'} round /></span>)}
          onClose={() => setMode(null)}
          onPick={(ids) => {
            const picked = partyRows.filter((row) => ids.includes(row.id))
            if (picked.length === 4) setRoster(picked.flatMap((row) => row.members))
            else setError('Pick four parties')
          }} />
      )}
      {mode === 'umas' && (
        <UmaPicker open title="Twenty Umas" rows={umaRows} max={RIFT_ROSTER} disabled={(row) => ((row.uma?.level ?? 0) >= RPG_TIER_MAX_LEVEL ? null : 'Below Lv 50')}
          describe={(row) => formatLevel(row.level)}
          onClose={() => setMode(null)}
          onPick={(ids) => (ids.length === RIFT_ROSTER ? setRoster([...ids]) : setError(`Pick twenty (${ids.length} picked)`))} />
      )}
      {roster && (
        <BottomSheet title="Sign up twenty" onClose={() => setRoster(null)} footer={
          <button type="button" disabled={block !== null} onClick={() => void signUp()}
            className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">Sign up</button>
        }>
          <ul className="grid grid-cols-5 gap-2" aria-label="The twenty">
            {roster.map((id) => <li key={id} className="flex justify-center"><FaceTile outfitId={id} size={52} label={campaign.outfits.get(id)?.name ?? 'Uma'} round /></li>)}
          </ul>
          <p className="mt-3 text-[14px]">They fight this Rift together until it ends.</p>
          {block && <p className="mt-2 text-[13px] text-danger">{block}</p>}
          {error && <p role="alert" className="mt-2 text-[13px] text-danger">{error}</p>}
        </BottomSheet>
      )}
    </div>
  )
}
