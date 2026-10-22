// A world party for a Rift fight (H50): the chosen party's name and five faces; a tap opens the shared party picker, with
// the parties that can't take the fight disabled and their reason.
import { FaceTile } from '@luismlorenzana/uma-kit/album'
import { formatLevel } from '@luismlorenzana/uma-kit/roster'
import type { TierWorld } from '@rpg/domain'
import { useState } from 'react'
import { PickerStep } from '../../album/PickerStep'
import { activePartyRows } from '../../album/party-rows'
import type { Campaign } from '../../battle/campaign'

/** Five round faces in a row (an empty slot is a dim dot). */
export function Faces({ campaign, ids, size = 24 }: { campaign: Campaign; ids: readonly (string | null)[]; size?: number }) {
  return (
    <span className="flex shrink-0 gap-0.5">
      {ids.map((id, i) => id
        ? <FaceTile key={id} outfitId={id} size={size} label={campaign.outfits.get(id)?.name ?? 'Uma'} round />
        : <span key={`empty${i}`} className="shrink-0 rounded-full bg-sunken" style={{ width: size, height: size }} />)}
    </span>
  )
}

export function PartyPick({ campaign, world, value, block, onChange, title = 'Which party?', label }: {
  campaign: Campaign
  world: TierWorld
  value: number | null
  /** Why a party can't take this fight, or null. */
  block: (index: number) => string | null
  onChange: (index: number) => void
  title?: string
  /** What the party is for, read before its name ("Iron"). */
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const party = value === null ? null : world.parties[value] ?? null
  const reason = value === null ? null : block(value)
  const rows = open ? activePartyRows(campaign.view, world) : []
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`${label ? `${label}: ` : ''}${party?.name ?? 'no party'}. Change the party`}
        className="flex min-h-12 w-full items-center gap-2 rounded-sm border border-hairline-strong bg-raised px-2 text-left">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold">{party?.name ?? 'Pick a party'}</span>
          {reason && <span className="block truncate text-[11px] text-danger">{reason}</span>}
        </span>
        {party && <Faces campaign={campaign} ids={party.slots} size={22} />}
        <span className="shrink-0 text-[12px] text-ink-faint">Change</span>
      </button>
      {open && (
        <PickerStep title={title} rows={rows} disabled={(row) => block(row.partyIndex)}
          describe={(row) => `${row.members.length}/5 · ${formatLevel(row.level)}`}
          renderChips={(row) => row.members.map((id) => <span key={id} className="w-5"><FaceTile outfitId={id} size={20} label={campaign.outfits.get(id)?.name ?? 'Uma'} round /></span>)}
          onClose={() => setOpen(false)}
          onPick={(id) => {
            const row = rows.find((r) => r.id === id)
            if (row) onChange(row.partyIndex)
            setOpen(false)
          }} />
      )}
    </>
  )
}
