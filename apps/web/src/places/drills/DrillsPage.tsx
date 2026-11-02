// Drills (D283, H154; collections.md §6.4, §7.5): the daily farm on the Battle page, hidden until save v35. Five fights
// at the tier's Lv 10–50 pay Training Logs; ten runs a day, banked to thirty, fights and sweeps alike. Routes under
// `/battle/drills/`: `` the page and `fight` the open Drill (the world map's open fight, on the shared fight screen).
import { drillDay, drillOfNode, openFightOf, SaveRuleError, type FightResult, type RpgCampaignChapter } from '@rpg/domain'
import { drillChapter } from '@rpg/domain/drills'
import { formatLevel } from '@luismlorenzana/uma-kit/roster'
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { albumRows, lockedReason } from '../../album/rows'
import { PickerStep } from '../../album/PickerStep'
import { CampaignGate, type Campaign } from '../../battle/campaign'
import { campaignFightSource } from '../../battle/fight-source'
import { pagePath, useHubNavigation } from '../../hub/navigation'
import { beginDrill, readTrainingLogs, sweepDrills, useAlbumScope, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import type { PageProps } from '../registry'
import { FightScreen } from '../scenario-gate/FightScreen'
import { drillRows, logCounts, runsLine } from './drills-view'

export default function DrillsPage({ place, rest }: PageProps) {
  const [kind] = rest.split('/')
  return <CampaignGate>{(campaign) => (kind === 'fight' ? <DrillFight campaign={campaign} place={place} /> : <Drills campaign={campaign} place={place} />)}</CampaignGate>
}

const today = () => drillDay(new Date())

/** The tier's five Drills, built once a campaign. */
const chapters = new WeakMap<Campaign, RpgCampaignChapter>()
function drillsOf(campaign: Campaign): RpgCampaignChapter {
  let chapter = chapters.get(campaign)
  if (!chapter) chapters.set(campaign, (chapter = drillChapter(campaign.tier, campaign.roster)))
  return chapter
}

function Drills({ campaign, place }: { campaign: Campaign; place: PageProps['place'] }) {
  const world = useWorld()
  const nav = useHubNavigation()
  const [error, setError] = useState<string | null>(null)
  const [swept, setSwept] = useState<string | null>(null)
  const [reading, setReading] = useState(false)
  const chapter = drillsOf(campaign)
  const levels = useMemo(() => chapter.nodes.filter((n) => n.kind !== 'camp').map((n) => n.level), [chapter])
  if (!world) return null
  const open = openFightOf(world)
  const drillOpen = open?.battle && drillOfNode(open.battle.nodeId) !== null
  const runs = world.drills?.runs ?? 0
  const logs = world.wallet.trainingLogs ?? 0
  const fight = (n: number) => {
    setError(null)
    beginDrill(chapter, n, campaign.outfits).then(() => nav.sub(place, 'fight'), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'The Drill couldn’t start.'))
  }
  const sweep = (n: number, times: number) => {
    setError(null)
    sweepDrills(n, times).then((got) => setSwept(`+${got} Training Logs`), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t sweep.'))
  }
  return (
    <div className="space-y-3 p-3 pb-6">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] text-ink-soft" data-drills-runs>{runsLine(world.drills, today())}</p>
        <button type="button" onClick={() => setReading(true)} data-drills-read className="min-h-11 rounded-sm border border-hairline-strong px-3 text-[13px] font-semibold">
          Read Logs · {logs}
        </button>
      </div>
      {drillOpen && (
        <button type="button" onClick={() => nav.sub(place, 'fight')} className="flex min-h-11 w-full items-center justify-center rounded-sm bg-accent font-display font-bold text-accent-ink">
          Resume the open fight
        </button>
      )}
      <ul className="space-y-2" data-drills>
        {drillRows(world.drills, levels).map((row) => (
          <li key={row.n} className="flex items-center gap-2 rounded-md bg-raised p-2.5" data-drill={row.n}>
            <span className="min-w-0 flex-1">
              <span className="block font-display font-bold">{row.name} · {row.level}</span>
              <span className="block text-[12px] text-ink-soft">{row.logs}</span>
            </span>
            {row.won ? (
              <>
                <button type="button" disabled={runs < 1 || !!open} onClick={() => sweep(row.n, 1)} className="min-h-11 rounded-sm border border-hairline-strong px-3 text-[13px] font-semibold disabled:opacity-40">Sweep ×1</button>
                <button type="button" disabled={runs < 5 || !!open} onClick={() => sweep(row.n, 5)} className="min-h-11 rounded-sm border border-hairline-strong px-3 text-[13px] font-semibold disabled:opacity-40">×5</button>
              </>
            ) : (
              <button type="button" disabled={runs < 1 || !!open} onClick={() => fight(row.n)} className="min-h-11 rounded-sm bg-accent px-4 font-display font-bold text-accent-ink disabled:opacity-40">Fight</button>
            )}
          </li>
        ))}
      </ul>
      {swept && <p className="text-center text-[13px] font-semibold text-accent-strong" role="status">{swept}</p>}
      {error && <p role="alert" className="text-center text-[13px] text-danger">{error}</p>}
      {reading && <LogsSheet campaign={campaign} onClose={() => setReading(false)} />}
    </div>
  )
}

/** The open Drill on the shared fight screen; its result shows the Logs it paid. */
function DrillFight({ campaign, place }: { campaign: Campaign; place: PageProps['place'] }) {
  const world = useWorld()
  const navigate = useNavigate()
  const [ended, setEnded] = useState<FightResult | null>(null)
  const chapter = drillsOf(campaign)
  const shown = useRef<string | null>(null)
  const run = world ? openFightOf(world) : null
  if (run?.battle && drillOfNode(run.battle.nodeId) !== null) shown.current = run.battle.battleId
  const home = () => navigate(pagePath(place, ''), { replace: true })
  if (ended) {
    const win = ended.outcome === 'victory'
    return (
      <div data-theme="dark" className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-page p-6 text-center" data-drill-result>
        <p className="font-display text-[28px] font-extrabold">{win ? 'Victory!' : 'Defeated'}</p>
        <p className="text-ink-soft">{ended.rounds} round{ended.rounds === 1 ? '' : 's'}</p>
        <p className="font-display text-[20px] font-bold text-accent-strong">{win ? `+${ended.logs ?? 0} Training Logs` : 'No runs spent'}</p>
        <button type="button" onClick={home} className="min-h-12 w-full max-w-xs rounded-sm bg-accent font-display font-bold text-accent-ink">Back to Drills</button>
      </div>
    )
  }
  if (!shown.current) {
    return (
      <div className="space-y-3 p-4 text-center">
        <p className="text-ink-soft">No Drill is open.</p>
        <button type="button" onClick={home} className="min-h-11 rounded-sm bg-accent px-4 font-display font-bold text-accent-ink">Back to Drills</button>
      </div>
    )
  }
  const source = { ...campaignFightSource(world, chapter, null), back: 'Back to Drills' }
  return <FightScreen key={shown.current} campaign={campaign} source={source} onMap={home} onEnd={(result) => setEnded(result)} />
}

const LOGS_TITLE = 'Read Logs'

/** The Class Manual sheet's twin (H154): pick an Uma, then a count. It stays open after reading (G5). */
function LogsSheet({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
  const world = useWorld()
  const scope = useAlbumScope()
  const [outfitId, setOutfitId] = useState<string | null>(null)
  const [countKey, setCountKey] = useState('1')
  const [line, setLine] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  if (!world) return null
  const held = world.wallet.trainingLogs ?? 0
  const uma = outfitId ? world.umas[outfitId] : undefined
  const outfit = outfitId ? campaign.view.roster.find((o) => o.outfitId === outfitId) : undefined
  if (!uma || !outfit) {
    return <PickerStep title={LOGS_TITLE} rows={albumRows(campaign.view, world, [], undefined, scope)}
      disabled={(row) => lockedReason(row) ?? ((row.level ?? 0) >= 50 ? 'Lv 50 · Trials pay ranks' : null)}
      describe={(row) => `${formatLevel(row.level)} · ${row.base.title ?? ''}`} onPick={setOutfitId} onClose={onClose} />
  }
  const counts = logCounts(uma.level, uma.exp, held)
  const count = counts.find((c) => c.key === countKey) ?? counts[0]
  const read = () => {
    if (!count) return
    setBusy(true)
    readTrainingLogs(outfit.outfitId, count.count, campaign.outfits)
      .then((r) => { setError(null); setLine(`Lv ${r.before.level} → ${r.after.level} · R${r.before.rank} → R${r.after.rank}`) },
        (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t read them.'))
      .finally(() => setBusy(false))
  }
  return (
    <BottomSheet title={LOGS_TITLE} onClose={onClose} footer={
      <button type="button" disabled={!count || busy} onClick={read} data-logs-read
        className="min-h-11 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:bg-sunken disabled:text-ink-soft">
        {count ? `Read ${count.count}` : uma.level >= 50 ? 'Lv 50 · Trials pay ranks' : 'No Logs'}
      </button>
    }>
      <div className="space-y-2.5" data-logs-sheet>
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 text-[13px]">{outfit.name} · {formatLevel(uma.level)} · {held} Training Logs</p>
          <button type="button" onClick={() => { setOutfitId(null); setLine(null) }} className="-my-3 min-h-11 shrink-0 text-[13px] text-ink-soft underline">Choose another Uma</button>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="How many">
          {counts.map((c) => (
            <button key={c.key} type="button" aria-pressed={c.key === count?.key} onClick={() => setCountKey(c.key)} data-logs-count={c.key}
              className={`min-h-11 min-w-11 rounded-full bg-raised px-3 text-[13px] font-semibold tabular-nums ${c.key === count?.key ? 'ring-2 ring-accent' : ''}`}>
              {c.label}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-ink-soft">Three Logs, one level</p>
        {line && <p className="text-[13px] font-semibold text-accent-strong" role="status" data-logs-line>{line}</p>}
        {error && <p className="text-[13px] text-danger">{error}</p>}
      </div>
    </BottomSheet>
  )
}
