// The Ascend sheet (H50, tiers.md §5, R7): what moving the won run's twenty up a tier does, its reason when it can't yet,
// and Ascend, which runs behind the tier veil and lands on the new tier's Town Hall.
import { SaveRuleError } from '@rpg/domain'
import { ascendBlock } from '@rpg/domain/rift'
import { Sheet } from '@luismlorenzana/uma-kit/ui'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { Campaign } from '../../battle/campaign'
import { useSwitchTier } from '../../hub/TierVeil'
import { ascendRun } from '../../save/game'
import { ascendLines, ascendNumbers } from './rift-view'
import { useRift } from './use-rift'

export function AscendSheet({ campaign, open, onClose }: { campaign: Campaign; open: boolean; onClose: () => void }) {
  const { save, world, run, tier, key } = useRift()
  const switchTier = useSwitchTier()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  if (!save || !world || !run) return null
  const numbers = ascendNumbers(world, run, tier)
  const block = ascendBlock(save, key, (id) => campaign.outfits.get(id)?.name ?? id)
  const go = () => {
    setBusy(true)
    setError(null)
    switchTier(numbers.to, async () => {
      await ascendRun()
      // Leave the Rift's page first, under the veil: the new tier's Rift is shut, and its page would send the switch to
      // the Battle page's quick look instead of the new tier's Town Hall.
      void navigate('/town', { replace: true })
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    }).catch((err: unknown) => {
      setError(err instanceof SaveRuleError ? err.message : 'Couldn’t ascend.')
      setBusy(false)
    })
  }
  return (
    <Sheet open={open} onClose={onClose} title={`Ascend to Tier ${numbers.to}`} footer={
      <button type="button" disabled={block !== null || busy} onClick={go}
        className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
        Ascend
      </button>
    }>
      <ul className="space-y-2 text-[14px]" data-ascend-lines>
        {ascendLines(numbers, tier).map((line) => <li key={line} className="rounded-sm bg-raised px-3 py-2">{line}</li>)}
      </ul>
      {block && <p className="mt-3 text-[13px] text-danger">{block}</p>}
      {error && <p role="alert" className="mt-3 text-[13px] text-danger">{error}</p>}
    </Sheet>
  )
}
