// A region (D66): one biome at one level, its twelve stages on a path. Stages open in order and stay open for replays;
// progress is the world's, whichever party won. Tap a stage for its rivals, then fight with the active party.
import {
  biomeById, openFightOf, rpgNodeStatus, SaveRuleError, sweepBlock, worldRun, type FightResult as Result, type RpgCampaignChapter, type RpgElement,
  type RpgMapNode, type RpgNodeStatus,
} from '@rpg/domain'
import { useEffect, useState } from 'react'
import type { Campaign } from '../../battle/campaign'
import { ElementGlyph, formatLevel, WeaknessIcons } from '../../battle/labels'
import { castArtUrl } from '../../content/cast'
import { useHubNavigation } from '../../hub/navigation'
import { beginFight, sweep, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import type { PageProps } from '../registry'
import { ActivePartyBar } from './ActiveParty'
import { FightResult } from './FightResult'

/** A foe's round face: her face icon, else full-body art zoomed onto the head (D81), else the bust's top. */
export function CastFace({ campaign, castId, size }: { campaign: Campaign; castId: string; size: number }) {
  const [url, setUrl] = useState<string | null>(null)
  const member = campaign.cast.byId.get(castId)
  const image = member?.face ?? member?.art
  useEffect(() => {
    let live = true
    if (image) void castArtUrl(image.path).then((u) => live && setUrl(u), () => undefined)
    return () => {
      live = false
    }
  }, [image])
  const box = member && !member.face ? member.avatar : undefined
  let zoom: React.CSSProperties | undefined
  if (box && member) {
    const height = size / box.size
    const width = (height * member.art.width) / member.art.height
    zoom = { position: 'absolute', maxWidth: 'none', width, height, left: size / 2 - box.x * width, top: size / 2 - box.y * height }
  }
  return (
    <span className="relative block shrink-0 overflow-hidden rounded-full bg-raised" style={{ width: size, height: size, background: member?.color }}>
      {url && <img src={url} alt="" className={zoom ? '' : 'size-full object-cover object-top'} style={zoom} />}
    </span>
  )
}

/** The elements a stage's foes carry: one, or a pair. */
export const signatureOf = (n: RpgMapNode): RpgElement[] => (n.note ? (n.note.split(' + ') as RpgElement[]) : n.element ? [n.element] : [])

export function RegionMap({ campaign, region, place }: { campaign: Campaign; region: RpgCampaignChapter; place: PageProps['place'] }) {
  const world = useWorld()
  const nav = useHubNavigation()
  const [open, setOpen] = useState<RpgMapNode | null>(null)
  const [swept, setSwept] = useState<{ result: Result; nodeId: string } | null>(null)
  const [sweepFor, setSweepFor] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  if (!world) return null
  const info = campaign.regionInfo(region.id)!
  const biome = biomeById(info.biome)
  const run = worldRun(world)
  const fightOpen = openFightOf(world)
  const status = (id: string): RpgNodeStatus => rpgNodeStatus(region, run, id)
  const stages = region.nodes.filter((n) => n.kind !== 'camp')
  const cleared = stages.filter((n) => (run.wins[n.id] ?? 0) > 0).length
  const fight = async (node: RpgMapNode) => {
    setError(null)
    try {
      await beginFight(region, node.id, campaign.outfits)
      setOpen(null)
      nav.sub(place, 'fight')
    } catch (err) {
      setError(err instanceof SaveRuleError ? err.message : 'The fight couldn’t start.')
    }
  }
  const doSweep = async (nodeId: string, times = 1) => {
    setError(null)
    try {
      const result = await sweep(region, nodeId, times)
      setOpen(null)
      setSweepFor(null)
      setSwept({ result, nodeId })
    } catch (err) {
      setError(err instanceof SaveRuleError ? err.message : 'Couldn’t sweep.')
    }
  }
  return (
    <div>
      <div className="sticky top-0 z-10 space-y-2 border-b border-hairline bg-page/95 p-3 backdrop-blur" style={{ borderTop: `4px solid ${biome.color}` }}>
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="truncate font-display text-lg font-bold">{info.name}</h2>
          <span className="shrink-0 text-[12px] text-ink-soft">{formatLevel(info.level)} · {cleared}/12 cleared</span>
        </div>
        <ActivePartyBar campaign={campaign} />
        {fightOpen?.battle && (
          <button type="button" onClick={() => nav.sub(place, 'fight')} className="flex min-h-11 w-full items-center justify-center rounded-sm bg-accent font-display font-bold text-accent-ink">
            Resume the open fight
          </button>
        )}
      </div>
      <ol className="space-y-2 p-3">
        {stages.map((n, i) => {
          const s = status(n.id)
          const wins = run.wins[n.id] ?? 0
          const lead = n.kind !== 'fight' ? n.enemies[0]?.castId : undefined
          return (
            <li key={n.id}>
              <button type="button" onClick={() => setOpen(n)} aria-label={`Stage ${i + 1}, ${n.name}, ${s}`}
                className={`flex w-full items-center gap-3 rounded-md p-2.5 text-left ${s === 'locked' ? 'bg-sunken opacity-55' : 'bg-raised'} ${s === 'available' ? 'ring-1 ring-ink/60' : ''}`}>
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-full font-display text-[15px] font-bold ${s === 'cleared' ? 'bg-accent/30 text-accent' : 'bg-panel'}`}>
                  {lead ? <CastFace campaign={campaign} castId={lead} size={36} /> : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{n.name}{n.kind === 'boss' ? ' ★' : n.kind === 'sub-boss' ? ' ♛' : ''}</span>
                  <span className="flex items-center gap-1 text-[12px] text-ink-soft">
                    {signatureOf(n).map((e) => <ElementGlyph key={e} element={e} size={14} />)}
                    <span>{n.enemies.length} foe{n.enemies.length > 1 ? 's' : ''}</span>
                  </span>
                </span>
                <span className="shrink-0 text-[12px] text-ink-faint">{s === 'cleared' ? `✓${wins > 1 ? ` ×${wins}` : ''}` : s === 'locked' ? 'locked' : 'open'}</span>
              </button>
            </li>
          )
        })}
      </ol>

      {open && (
        <BottomSheet title={open.name} onClose={() => { setOpen(null); setError(null) }} footer={
          <div className="flex gap-2">
            <button type="button" disabled={status(open.id) === 'locked' || !!fightOpen?.battle} onClick={() => void fight(open)}
              className="min-h-12 flex-[2] rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
              {status(open.id) === 'locked' ? 'Clear the stage before it' : fightOpen?.battle ? 'Finish the open fight first' : status(open.id) === 'cleared' ? 'Fight again · pays ¼' : 'Fight · first clear pays triple'}
            </button>
            {open.kind === 'fight' && status(open.id) === 'cleared' && (
              <button type="button" disabled={!!sweepBlock(world, region, open.id)} onClick={() => setSweepFor(open.id)}
                className="min-h-12 flex-1 rounded-sm border border-hairline-strong font-semibold disabled:opacity-40" aria-label={sweepBlock(world, region, open.id) ?? 'Sweep with a ticket'}>
                Sweep · {world.wallet.sweepTickets}
              </button>
            )}
          </div>
        }>
          <p className="mb-2 flex items-center gap-1 text-[13px] text-ink-soft">
            {formatLevel(open.level)} · {open.kind === 'boss' ? 'Region boss' : open.kind === 'sub-boss' ? 'Elite' : 'Stage'} ·
            {signatureOf(open).map((e) => <ElementGlyph key={e} element={e} size={14} />)}
          </p>
          <ul className="space-y-1.5">
            {open.enemies.map((e) => (
              <li key={e.id} className="flex items-center gap-2 rounded-sm bg-raised p-2">
                <CastFace campaign={campaign} castId={e.castId} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-[13px] font-semibold">
                    <ElementGlyph element={e.element} size={14} />
                    <span className="truncate">{campaign.name(e.id, e.castId)}</span>
                    {e.rank !== 'regular' && <span className="rounded-xs bg-accent/20 px-1 text-[10px] text-accent">{e.rank === 'boss' ? 'Boss' : 'Elite'}</span>}
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-ink-soft">Shield {e.shield} · weak <WeaknessIcons weaknesses={e.weaknesses} size={12} /></p>
                </div>
              </li>
            ))}
          </ul>
          {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
        </BottomSheet>
      )}
      {sweepFor && (
        <BottomSheet title="Sweep" onClose={() => setSweepFor(null)}>
          <p className="mb-3 text-[13px] text-ink-soft">Each sweep pays this stage's EXP and Shards (no Laurels or tokens) for one Sweep Ticket. You have {world.wallet.sweepTickets}.</p>
          <div className="grid grid-cols-4 gap-2">
            {[1, 5, 10, world.wallet.sweepTickets].filter((n, i, a) => n >= 1 && n <= world.wallet.sweepTickets && a.indexOf(n) === i).map((n) => (
              <button key={n} type="button" onClick={() => void doSweep(sweepFor, n)} className="min-h-12 rounded-sm bg-accent font-display font-bold text-accent-ink">
                {n === world.wallet.sweepTickets && n > 10 ? `All ${n}` : `×${n}`}
              </button>
            ))}
          </div>
          {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
        </BottomSheet>
      )}
      {swept && <FightResult campaign={campaign} chapter={region} result={swept.result} onMap={() => setSwept(null)} againLabel={`Sweep again · ${world.wallet.sweepTickets}`}
        onAgain={() => { if (!sweepBlock(world, region, swept.nodeId)) void sweep(region, swept.nodeId).then((result) => setSwept({ result, nodeId: swept.nodeId })) }} />}
    </div>
  )
}
