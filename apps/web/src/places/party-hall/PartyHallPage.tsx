// The Party Hall (S2, T013): twenty parties of five; /town/party-hall/:n edits one. One party per Uma (D46); a working
// member can be recalled from her job here, and fights either way (D119). From classes v2 a party with two healers
// carries the "One healer a party" note (H59); editing it is never refused.
import { activeClass, isInFight, isPartyFull, partyLead, partyOf, placeById, workOf, PARTY_COUNT, PARTY_NAME_MAX, normalizeName, SaveRuleError, type Party, type Place, type TierWorld } from '@rpg/domain'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useHubNavigation } from '../../hub/navigation'
import { FaceTile } from '@luismlorenzana/uma-kit/album'
import { formatLevel } from '@luismlorenzana/uma-kit/roster'
import { albumRows } from '../../album/rows'
import { PickerStep } from '../../album/PickerStep'
import { CLASS_LABEL } from '../../battle/labels'
import { ClassEmblem } from '../../battle/pixel-icons'
import type { MasterView } from '../../master/master'
import { leadParty, nameParty, recall, setSlot, useAlbumScope, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { BackIcon } from '../../ui/icons'
import { MasterGate } from '../MasterGate'
import type { PageProps } from '../registry'
import { healerNote } from './healer-note'

/** A party's one-healer note, in the warning colour. */
function HealerNote({ note, className = '' }: { note: string | null; className?: string }) {
  return note ? <span className={`block text-[12px] font-semibold text-warning ${className}`}>{note}</span> : null
}

export default function PartyHallPage({ place, rest }: PageProps) {
  const world = useWorld()
  const index = /^\d+$/.test(rest) ? Number(rest) - 1 : null
  if (!world) return null
  return (
    <MasterGate>
      {(view) =>
        index !== null && index >= 0 && index < PARTY_COUNT ? (
          <PartyEditor view={view} world={world} index={index} place={place} />
        ) : (
          <PartyList view={view} world={world} place={place} />
        )
      }
    </MasterGate>
  )
}

function SlotIcon({ view, world, outfitId, size }: { view: MasterView; world: TierWorld; outfitId: string | null; size: number }) {
  if (!outfitId) return <span className="flex items-center justify-center rounded-sm border border-dashed border-hairline-strong text-ink-faint" style={{ width: size, height: size }}>+</span>
  const outfit = view.roster.find(o => o.outfitId === outfitId)
  const uma = world.umas[outfitId]
  const classId = outfit && uma ? activeClass(outfit, uma) : null
  return (
    <span className="relative" style={{ width: size, height: size }}>
      <FaceTile outfitId={outfitId} size={size} label={outfit?.name ?? 'Uma'} round badges={{
        bottomLeft: <span className="rounded-tr-sm bg-black/70 px-1 font-display text-[9px] font-bold leading-3.5">Lv {uma?.level ?? 1}</span>,
        bottomRight: classId ? <span role="img" aria-label={CLASS_LABEL[classId]} title={CLASS_LABEL[classId]} className="rounded-tl-sm bg-black/70"><ClassEmblem classId={classId} /></span> : undefined,
      }} />
    </span>
  )
}

function PartyList({ view, world, place }: { view: MasterView; world: TierWorld; place: Place }) {
  const nav = useHubNavigation()
  const owned = Object.keys(world.umas).length
  const outfits = new Map(view.roster.map((o) => [o.outfitId, o]))
  return (
    <div className="space-y-2 p-3">
      {owned === 0 && (
        <p className="rounded-md border border-accent/40 bg-accent/10 p-3 text-[13px] text-ink-soft">Your stable is empty: unlock Umas in the Stable, then build parties here.</p>
      )}
      {world.parties.map((party, i) => (
        <button key={i} type="button" onClick={() => nav.sub(place, String(i + 1))} className="w-full rounded-md bg-panel p-2.5 text-left active:bg-raised">
          <span className="mb-1.5 flex items-center justify-between">
            <span className="font-display text-[15px] font-bold">{party.name}</span>
            <span className={`text-[11px] font-semibold ${isPartyFull(party) ? 'text-success' : 'text-ink-faint'}`}>
              {party.slots.filter(Boolean).length}/5 · Edit
            </span>
          </span>
          <span className="grid grid-cols-5 gap-1.5">
            {party.slots.map((s, k) => (
              <SlotIcon key={k} view={view} world={world} outfitId={s} size={56} />
            ))}
          </span>
          <HealerNote note={healerNote(world, party, outfits)} className="mt-1.5" />
        </button>
      ))}
    </div>
  )
}

function PartyEditor({ view, world, index, place }: { view: MasterView; world: TierWorld; index: number; place: Place }) {
  const scope = useAlbumScope()
  const navigate = useNavigate()
  const nav = useHubNavigation()
  const party = world.parties[index] as Party
  const [name, setName] = useState(party.name)
  const [picking, setPicking] = useState<number | null>(null)
  const [acting, setActing] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const valid = normalizeName(name, PARTY_NAME_MAX) !== null
  const run = (p: Promise<void>) => p.then(() => setError(null), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Could not save.'))
  const byId = new Map(view.roster.map((o) => [o.outfitId, o]))
  const lead = partyLead(party)

  return (
    <div className="space-y-4 p-4">
      <button type="button" onClick={() => nav.subBack(place)} className="-ml-2 flex min-h-11 items-center gap-1 px-2 text-[14px] font-semibold text-ink-soft">
        <BackIcon size={18} /> All parties
      </button>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (valid) void run(nameParty(index, name))
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} aria-label="Party name" aria-invalid={!valid} className="min-h-11 min-w-0 flex-1 rounded-sm bg-sunken px-3 font-display font-bold text-ink outline-none ring-accent focus:ring-2" />
        <button type="submit" disabled={!valid || normalizeName(name, PARTY_NAME_MAX) === party.name} className="min-h-11 rounded-sm bg-accent px-4 font-display font-bold text-accent-ink disabled:opacity-40">
          Rename
        </button>
      </form>
      <ul className="space-y-2">
        {party.slots.map((outfitId, slot) => {
          const outfit = outfitId ? byId.get(outfitId) : undefined
          const uma = outfitId ? world.umas[outfitId] : undefined
          const classId = outfit && uma ? activeClass(outfit, uma) : null
          return (
            <li key={slot}>
              <button type="button" onClick={() => (outfitId ? setActing(slot) : setPicking(slot))} className="flex min-h-18 w-full items-center gap-3 rounded-md bg-panel p-2 text-left active:bg-raised">
                <SlotIcon view={view} world={world} outfitId={outfitId} size={56} />
                <span className="min-w-0 flex-1">
                  {outfit ? (
                    <>
                      <span className="block truncate text-[14px] font-semibold">{outfit.name}</span>
                      <span className="block truncate text-[11px] text-ink-faint">{outfitId === lead ? 'Lead · ' : ''}{classId ? CLASS_LABEL[classId] : outfit.title}</span>
                    </>
                  ) : (
                    <span className="text-[14px] text-ink-faint">Slot {slot + 1} · add an Uma</span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <HealerNote note={healerNote(world, party, byId)} className="text-[13px]" />
      {error && <p className="text-[13px] text-danger">{error}</p>}

      {picking !== null && (
        <PickerStep title="Choose an Uma" rows={albumRows(view, world, [], undefined, scope).filter(row => row.uma !== null)}
          dimmed={row => partyOf(world, row.id) !== null}
          disabled={row => (partyOf(world, row.id)?.party === index ? 'In this party' : null)
            ?? (isInFight(world, row.id) || party.slots.some(id => id !== null && isInFight(world, id)) ? 'In a fight' : null)}
          describe={row => {
            const at = partyOf(world, row.id)
            return at ? `Moves from ${world.parties[at.party]?.name}` : `${formatLevel(row.level)} · ${row.classId ? CLASS_LABEL[row.classId] : ''}`
          }}
          onClose={() => setPicking(null)}
          onPick={(id) => {
            void run(setSlot(index, picking, id))
            setPicking(null)
          }}
        />
      )}
      {acting !== null && party.slots[acting] && (
        <BottomSheet title={byId.get(party.slots[acting] ?? '')?.name ?? 'Uma'} onClose={() => setActing(null)}>
          <div className="space-y-2">
            {party.slots[acting] === lead ? (
              <button type="button" disabled className="min-h-12 w-full rounded-sm bg-raised font-semibold opacity-55">Party lead</button>
            ) : (
              <button type="button" onClick={() => { void run(leadParty(index, party.slots[acting]!)); setActing(null) }} className="min-h-12 w-full rounded-sm bg-raised font-semibold">
                Make party lead
              </button>
            )}
            <button type="button" onClick={() => { setPicking(acting); setActing(null) }} className="min-h-12 w-full rounded-sm bg-raised font-semibold">
              Swap with another Uma
            </button>
            <button type="button" onClick={() => navigate(`/town/stable/outfit/${party.slots[acting]}`, { state: { fromHub: true } })} className="min-h-12 w-full rounded-sm bg-raised font-semibold">
              View profile
            </button>
            {(() => {
              const work = workOf(world, party.slots[acting] ?? '')
              return work ? (
                <button type="button" onClick={() => { void run(recall(work.placeId, work.slot)); setActing(null) }} className="min-h-12 w-full rounded-sm bg-raised font-semibold">
                  Recall from {placeById(work.placeId)?.name ?? work.placeId} · what's made is kept
                </button>
              ) : null
            })()}
            <button type="button" onClick={() => { void run(setSlot(index, acting, null)); setActing(null) }} className="min-h-12 w-full rounded-sm border border-danger/50 font-semibold text-danger">
              Remove from {party.name}
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  )
}
