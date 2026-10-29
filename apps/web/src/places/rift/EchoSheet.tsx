// An Echo's sheet (H50, rift.md §8): its front and level, its foes, a party of five Lv 50 Umas and Fight (from v16 with
// the front's guided weapons, H70); once won, Sweeps with Sweep Tickets, whose result shows like a win.
import { FRONT_NAME, SaveRuleError, type EchoLevel, type RiftFront } from '@rpg/domain'
import { riftFight, riftFightBlock, sweepEchoBlock, type RiftFightResult } from '@rpg/domain/rift'
import { useMemo, useState } from 'react'
import type { Campaign } from '../../battle/campaign'
import { useHubNavigation } from '../../hub/navigation'
import { beginRiftFight, sweepEchoes } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import type { PageProps } from '../registry'
import { GuidedWeapons } from './GuidedWeapons'
import { PartyPick } from './PartyPick'
import { bestParty, levelPartyBlock } from './rift-view'
import { RiftResult } from './RiftResult'
import { planLine, PlanFoes } from './StageSheet'
import { useRift } from './use-rift'

export function EchoSheet({ campaign, place, front, level, onClose }: {
  campaign: Campaign; place: PageProps['place']; front: RiftFront; level: EchoLevel; onClose: () => void
}) {
  const { save, world, tier, key } = useRift()
  const nav = useHubNavigation()
  const [party, setParty] = useState<number | null>(() => (world ? bestParty(world, front, campaign.outfits, (i) => levelPartyBlock(world, i), undefined, undefined,
    Number(tier)) : null))
  const [swept, setSwept] = useState<RiftFightResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const ref = useMemo(() => ({ kind: 'echo', front, level }) as const, [front, level])
  const plan = useMemo(() => riftFight({ tier, runId: null, roster: campaign.cast.members, defeated: new Set() }, ref), [tier, campaign.cast.members, ref])
  if (!save || !world) return null
  const won = !!world.rift.echoes[front]?.[level]
  const open = world.rift.battle !== null
  const tickets = world.wallet.sweepTickets
  const block = riftFightBlock(save, ref, party, key, campaign.outfits)
  const sweepBlock = party === null ? 'Pick a party' : sweepEchoBlock(save, front, level, party, key)
  const fight = async () => {
    setError(null)
    try {
      await beginRiftFight(ref, party, campaign.outfits, campaign.cast.members)
      onClose()
      nav.sub(place, 'fight')
    } catch (err) {
      setError(err instanceof SaveRuleError ? err.message : 'The fight couldn’t start.')
    }
  }
  const sweep = async (times: number) => {
    if (party === null) return
    setError(null)
    try {
      setSwept(await sweepEchoes(front, level, party, times, campaign.outfits))
    } catch (err) {
      setError(err instanceof SaveRuleError ? err.message : 'Couldn’t sweep.')
    }
  }
  if (swept) {
    return <RiftResult campaign={campaign} result={swept} error={error} againLabel={`Sweep again · ${tickets}`}
      onAgain={() => { if (!sweepBlock) void sweep(1) }} onBack={() => { setSwept(null); onClose() }} />
  }
  return (
    <BottomSheet title={`${FRONT_NAME[front]} Echo · Lv ${level}`} onClose={onClose} footer={
      <div className="space-y-2">
        {!open && <PartyPick campaign={campaign} world={world} value={party} block={(i) => levelPartyBlock(world, i)} onChange={setParty} title="Who fights?" />}
        {!open && <GuidedWeapons campaign={campaign} world={world} front={front} party={party} />}
        <button type="button" disabled={block !== null} onClick={() => void fight()}
          className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
          {open ? 'Fight open' : won ? 'Fight again' : 'Fight'}
        </button>
        {won && (
          <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
            <button type="button" disabled={sweepBlock !== null} onClick={() => void sweep(1)} className="min-h-11 rounded-sm border border-hairline-strong font-semibold disabled:opacity-40">Sweep ×1</button>
            <button type="button" disabled={sweepBlock !== null || tickets < 5} onClick={() => void sweep(5)} className="min-h-11 rounded-sm border border-hairline-strong font-semibold disabled:opacity-40">Sweep ×5</button>
            <span className="text-[12px] text-ink-soft" aria-label={`${tickets} Sweep Tickets`}>{tickets} tickets</span>
          </div>
        )}
        {error && <p role="alert" className="text-center text-[12px] text-danger">{error}</p>}
      </div>
    }>
      <p className="mb-2 text-[13px] text-ink-soft">{planLine(plan, tier)}{won ? ' · won ✓' : ''}</p>
      <PlanFoes campaign={campaign} plan={plan} />
    </BottomSheet>
  )
}
