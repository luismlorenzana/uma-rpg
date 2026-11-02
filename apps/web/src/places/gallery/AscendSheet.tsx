// The Gallery's Ascend (D283, H155; collections.md §5): the world's ready Umas, each ticked (untick to leave one here),
// one who can't go now with why, what moving up does for the ticked, and Ascend n, which runs behind the tier veil and
// lands on the new tier's Town Hall. It replaces the Rift's run-wide Ascend from save v35.
import { SaveRuleError, type RosterOutfit } from '@rpg/domain'
import { ASCEND_PURSE, ascendUmasBlock, bankedMarks } from '@rpg/domain/rift'
import { useState } from 'react'
import { useSwitchTier } from '../../hub/TierVeil'
import { ascendWindows, useActiveTier, useGame } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { ascendCount, ascendLines, cantGo } from './glass-view'

export function AscendSheet({ ready, outfits, onClose }: { ready: readonly string[]; outfits: ReadonlyMap<string, RosterOutfit>; onClose: () => void }) {
  const save = useGame((s) => s.save)
  const tier = useActiveTier()
  const switchTier = useSwitchTier()
  const [skipped, setSkipped] = useState<ReadonlySet<string>>(new Set())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  if (!save) return null
  const key = String(tier)
  const world = save.tierWorlds[key]
  const name = (id: string) => outfits.get(id)?.name ?? id
  const why = new Map(ready.map((id) => [id, ascendUmasBlock(save, [id], key, name)]))
  const ticked = ready.filter((id) => why.get(id) === null && !skipped.has(id))
  const block = ticked.length ? ascendUmasBlock(save, ticked, key, name) : null
  const n = ticked.length
  const numbers = { to: tier + 1, laurels: ASCEND_PURSE.laurels * n, speedTickets: ASCEND_PURSE.speedTickets * n,
    classMarks: ticked.reduce((sum, id) => sum + bankedMarks(world?.umas[id]?.exp ?? 0), 0) }
  const toggle = (id: string) => setSkipped((s) => {
    const next = new Set(s)
    if (!next.delete(id)) next.add(id)
    return next
  })
  const go = () => {
    setBusy(true)
    setError(null)
    switchTier(tier + 1, () => ascendWindows(ticked)).catch((err: unknown) => {
      setError(err instanceof SaveRuleError ? err.message : 'Couldn’t ascend.')
      setBusy(false)
    })
  }
  return (
    <BottomSheet title={`Ascend to Tier ${tier + 1}`} onClose={onClose} footer={
      <button type="button" disabled={n === 0 || block !== null || busy} onClick={go} data-ascend-go
        className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
        {ascendCount(n)}
      </button>
    }>
      <ul className="space-y-1" data-ascend-umas>
        {ready.map((id) => {
          const reason = why.get(id)
          return (
            <li key={id}>
              <label className={`flex min-h-11 items-center gap-2.5 rounded-sm bg-raised px-3 ${reason ? 'opacity-60' : ''}`}>
                <input type="checkbox" className="size-5 accent-[var(--color-accent)]" disabled={!!reason} checked={!reason && !skipped.has(id)} onChange={() => toggle(id)} />
                <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">{name(id)}</span>
                {reason && <span className="shrink-0 text-[12px] text-ink-soft">{cantGo(reason)}</span>}
              </label>
            </li>
          )
        })}
      </ul>
      <ul className="mt-3 space-y-2 text-[14px]" data-ascend-lines>
        {ascendLines(numbers, tier).map((line) => <li key={line} className="rounded-sm bg-raised px-3 py-2">{line}</li>)}
      </ul>
      {block && <p className="mt-3 text-[13px] text-danger">{block}</p>}
      {error && <p role="alert" className="mt-3 text-[13px] text-danger">{error}</p>}
    </BottomSheet>
  )
}
