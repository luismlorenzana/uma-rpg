// A front stage's sheet (H50): its foes by wave as the fight will have them (faces, Boss or Elite by face, acts, shields,
// weaknesses, the ward), and on the next stage a party of the roster and Fight.
import { FRONT_NAME, SaveRuleError, type RiftFront } from '@rpg/domain'
import { riftFightBlock, type RiftFightPlan } from '@rpg/domain/rift'
import { useMemo, useState } from 'react'
import type { Campaign } from '../../battle/campaign'
import { faceRank } from '../../battle/fight-source'
import { FoeRow } from '../../battle/FoeRow'
import { useHubNavigation } from '../../hub/navigation'
import { beginRiftFight } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import type { PageProps } from '../registry'
import { PartyPick } from './PartyPick'
import { bestParty, frontPartyBlock, planSize } from './rift-view'
import { useRift } from './use-rift'

export type StageStatus = 'cleared' | 'next' | 'locked'

/** A plan's foes, wave by wave, each as her face reads. */
export function PlanFoes({ campaign, plan }: { campaign: Campaign; plan: Pick<RiftFightPlan, 'enemies' | 'waves'> }) {
  const rank = useMemo(() => faceRank(campaign.cast.byId), [campaign.cast.byId])
  const waves = [plan.enemies, ...(plan.waves ?? [])]
  return waves.map((wave, w) => (
    <section key={w} className="mb-2">
      {waves.length > 1 && <h3 className="text-micro mb-1">Wave {w + 1}</h3>}
      <ul className="space-y-1.5">
        {wave.map((e) => <FoeRow key={e.id} campaign={campaign} enemy={e} rank={rank(e)} />)}
      </ul>
    </section>
  ))
}

/** A Rift level in its tier: "Lv 55" in Tier 1, "T2 Lv 50" above (the Lv 55 Echo stands at the tier's top, D173). */
export const riftLevel = (tier: number, level: number): string => (tier === 1 ? `Lv ${level}` : `T${tier} Lv ${level}`)

/** "Lv 50 · 3 waves · 15 foes". */
export function planLine(plan: Pick<RiftFightPlan, 'enemies' | 'waves' | 'level'>, tier: number): string {
  const { waves, foes } = planSize(plan)
  return `${riftLevel(tier, plan.level)} · ${waves > 1 ? `${waves} waves · ` : ''}${foes} foe${foes === 1 ? '' : 's'}`
}

export function StageSheet({ campaign, place, front, plan, status, onClose }: {
  campaign: Campaign; place: PageProps['place']; front: RiftFront; plan: RiftFightPlan; status: StageStatus; onClose: () => void
}) {
  const { save, world, run, key, tier } = useRift()
  const nav = useHubNavigation()
  const [party, setParty] = useState<number | null>(() =>
    world && run ? bestParty(world, front, campaign.outfits, (i) => frontPartyBlock(world, run, i)) : null)
  const [error, setError] = useState<string | null>(null)
  if (!save || !world || !run) return null
  const open = world.rift.battle !== null
  const block = status === 'next' ? riftFightBlock(save, plan.ref, party, key) : null
  const fight = async () => {
    setError(null)
    try {
      await beginRiftFight(plan.ref, party, campaign.outfits, campaign.cast.members)
      onClose()
      nav.sub(place, 'fight')
    } catch (err) {
      setError(err instanceof SaveRuleError ? err.message : 'The fight couldn’t start.')
    }
  }
  return (
    <BottomSheet title={`${FRONT_NAME[front]} · ${plan.name}`} onClose={onClose} footer={
      <div className="space-y-2">
        {status === 'next' && !open && (
          <PartyPick campaign={campaign} world={world} value={party} block={(i) => frontPartyBlock(world, run, i)} onChange={setParty} title="Who fights?" />
        )}
        <button type="button" disabled={status !== 'next' || block !== null} onClick={() => void fight()}
          className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
          {status === 'cleared' ? 'Cleared' : status === 'locked' ? 'Locked' : open ? 'Fight open' : 'Fight'}
        </button>
        {status === 'next' && block && !open && party !== null && !frontPartyBlock(world, run, party) && <p className="text-center text-[12px] text-ink-soft">{block}</p>}
        {error && <p role="alert" className="text-center text-[12px] text-danger">{error}</p>}
      </div>
    }>
      <p className="mb-2 text-[13px] text-ink-soft">{planLine(plan, tier)}</p>
      <PlanFoes campaign={campaign} plan={plan} />
    </BottomSheet>
  )
}
