import { byLevel, type LevelRow } from '@luismlorenzana/uma-kit/roster'
import type { UmaPickerRow } from '@luismlorenzana/uma-kit/album'
import { partyLead, type TierWorld } from '@rpg/domain'
import type { MasterView } from '../master/master'

export interface PartyPickerRow extends UmaPickerRow { partyIndex: number; members: string[] }

/** A party remains one choice, represented by its chosen lead while ordered by its highest-level member. */
export function activePartyRows(view: MasterView, world: TierWorld): PartyPickerRow[] {
  const outfits = new Map(view.roster.map(o => [o.outfitId, o]))
  return world.parties.flatMap((party, partyIndex) => {
    const members = party.slots.filter((id): id is string => id !== null)
    const levels: LevelRow[] = members.map(id => ({
      id, name: outfits.get(id)?.name ?? id, level: world.umas[id]?.level ?? null,
      releasedAt: outfits.get(id)?.releasedJp ?? '',
    })).sort(byLevel)
    const first = levels[0]
    const lead = partyLead(party)
    return first && lead ? [{ ...first, id: lead, name: party.name, partyIndex, members,
      search: `${party.name} ${levels.map(row => row.name).join(' ')}`.toLowerCase(), facets: {}, sorts: {} }] : []
  })
}
