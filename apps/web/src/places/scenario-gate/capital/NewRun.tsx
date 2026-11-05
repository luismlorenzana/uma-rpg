// Four lanes in one sheet. Choosing a party replaces its body inline, never stacks another sheet (G3–G5).
import { capitalRunId, rpgFinals, SaveRuleError, tierKey, type WorldContinent } from '@rpg/domain'
import { capitalRunBlock } from '@rpg/domain/capital'
import { useState } from 'react'
import type { Campaign } from '../../../battle/campaign'
import { ElementGlyph } from '../../../battle/labels'
import { useHubNavigation } from '../../../hub/navigation'
import { startRun, useGame, useWorld } from '../../../save/game'
import { BottomSheet } from '../../../ui/BottomSheet'
import type { PageProps } from '../../registry'
import { CAPITAL_WORDS, partyBlock, runPath, startLabel } from './capital-view'
import { RunFaces } from './RunBits'

export function NewRun({ campaign, continent, place, onClose }: {
  campaign: Campaign; continent: WorldContinent; place: PageProps['place']; onClose: () => void
}) {
  const world = useWorld()
  const save = useGame((s) => s.save)
  const nav = useHubNavigation()
  const [parties, setParties] = useState<(number | null)[]>([null, null, null, null])
  const [picking, setPicking] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  if (!world || !save) return null
  const routes = rpgFinals(continent.order).routes
  const block = (index: number, lane: number) => partyBlock(world, index, parties, lane, campaign.outfits, campaign.tier)
  const count = parties.filter((p, i) => p !== null && block(p, i) === null).length
  const reason = count === 4 ? capitalRunBlock(save, continent.id, parties as number[], tierKey(campaign.tier), (id) => campaign.name(id)) : null
  const start = async () => {
    setBusy(true); setError(null)
    try {
      await startRun(continent.id, parties as number[])
      const n = useGame.getState().save?.tierWorlds[tierKey(campaign.tier)]?.capitals?.[continent.id]?.started
      if (n) nav.sub(place, runPath(continent.id, capitalRunId(continent.id, n)))
    } catch (err) { setError(err instanceof SaveRuleError ? err.message : 'Couldn’t start the run') }
    finally { setBusy(false) }
  }
  return <BottomSheet title={CAPITAL_WORDS.newRun} onClose={onClose} footer={picking === null ? <div className="space-y-1.5">
    <button type="button" disabled={busy || count !== 4 || reason !== null} onClick={() => void start()} data-capital-start
      className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">{startLabel(count)}</button>
    {reason && <p className="text-center text-[12px] text-danger">{reason}</p>}
    {error && <p role="alert" className="text-center text-[12px] text-danger">{error}</p>}
  </div> : undefined}>
    {picking === null ? <ol className="space-y-2" data-capital-signup>
      {routes.map((route, i) => {
        const party = parties[i] === null ? null : world.parties[parties[i]!]
        const why = parties[i] === null ? null : block(parties[i]!, i)
        return <li key={i} className="space-y-1.5 rounded-md bg-raised p-2.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-[14px] font-bold">{route.name}</h3>
            <span className="flex gap-1"><ElementGlyph element={route.vanguard.element} size={16} /><ElementGlyph element={route.champion.element} size={16} /></span>
          </div>
          <p className="text-[12px] text-ink-soft">{route.line}</p>
          <button type="button" onClick={() => setPicking(i)} aria-label={`${route.name}: ${party?.name ?? CAPITAL_WORDS.pick}`}
            className="flex min-h-11 w-full items-center justify-between gap-2 rounded-sm border border-hairline-strong px-2 text-left text-[13px] font-semibold">
            <span>{party?.name ?? CAPITAL_WORDS.pick}{why && <span className="block text-[11px] text-danger">{why}</span>}</span>
            {party && <RunFaces ids={party.slots} campaign={campaign} size={22} />}
          </button>
        </li>
      })}
    </ol> : <div className="space-y-2" data-capital-party-pick>
      <button type="button" onClick={() => setPicking(null)} className="min-h-11 text-[13px] font-semibold text-ink-soft">‹ Four lanes</button>
      <h3 className="font-display font-bold">{routes[picking]!.name}</h3>
      <ul className="space-y-1.5">
        {world.parties.map((party, i) => ({ party, i })).sort((a, b) => Number(block(a.i, picking) !== null) - Number(block(b.i, picking) !== null) || a.i - b.i).map(({ party, i }) => {
          const why = block(i, picking)
          return <li key={i}><button type="button" disabled={why !== null} data-capital-party={i}
            onClick={() => { setParties((prev) => prev.map((p, lane) => lane === picking ? i : p)); setPicking(null); setError(null) }}
            className="flex min-h-14 w-full items-center justify-between gap-2 rounded-sm bg-raised p-2 text-left disabled:opacity-40">
            <span className="min-w-0"><span className="block truncate text-[13px] font-semibold">{party.name}</span><span className="block text-[11px] text-ink-soft">{why ?? `${party.slots.filter(Boolean).length}/5`}</span></span>
            <RunFaces campaign={campaign} ids={party.slots} size={24} />
          </button></li>
        })}
      </ul>
    </div>}
  </BottomSheet>
}
