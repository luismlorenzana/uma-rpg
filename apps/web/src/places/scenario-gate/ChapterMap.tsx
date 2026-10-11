// A chapter's map (S3): pick a party, then walk the nodes top to bottom. Fights open the nodes below them, camps refill
// MP, and the Finals' three routes each end in a champion. Every party keeps its own run (D52).
import {
  activeBuild, buildOf, isBusy, RPG_BUILD, isPartyFull, openFightOf, rpgTreePointsEarned, rpgTreePointsSpent, sweepBlock, type FightResult as Result, RPG_STAGE_NAMES, rpgNodeStatus, runOf, SaveRuleError, type RpgCampaignChapter, type RpgMapNode,
  type RpgNodeStatus,
} from '@rpg/domain'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import type { Campaign } from '../../battle/campaign'
import { BUILD_LABEL, ElementGlyph, formatLevel, WeaknessIcons } from '../../battle/labels'
import { castArtUrl } from '../../content/cast'
import { pagePath, useHubNavigation } from '../../hub/navigation'
import { AtlasSprite } from '../../master/art'
import { beginFight, rest, sweep, useWorld } from '../../save/game'
import { FightResult } from './FightResult'
import { BottomSheet } from '../../ui/BottomSheet'
import type { PageProps } from '../registry'

const PARTY_KEY = 'rpg.gate.party.v1'
const ROW = 84
const NODE = 50

function storedParty(): number | null {
  try {
    const n = Number(localStorage.getItem(PARTY_KEY))
    return Number.isInteger(n) && n >= 1 && n <= 20 ? n - 1 : null
  } catch {
    return null
  }
}

function CastFace({ campaign, castId, size }: { campaign: Campaign; castId: string; size: number }) {
  const [url, setUrl] = useState<string | null>(null)
  const member = campaign.cast.byId.get(castId)
  useEffect(() => {
    let live = true
    if (member) void castArtUrl(member.art.path).then((u) => live && setUrl(u), () => undefined)
    return () => {
      live = false
    }
  }, [member])
  return (
    <span className="block shrink-0 overflow-hidden rounded-full bg-raised" style={{ width: size, height: size, background: member?.color }}>
      {url && <img src={url} alt="" className="size-full object-cover object-top" />}
    </span>
  )
}

const KIND_MARK: Record<RpgMapNode['kind'], string> = { camp: '⛺', fight: '⚔', 'sub-boss': '♛', boss: '★' }

export function ChapterMap({ campaign, chapter, place }: { campaign: Campaign; chapter: RpgCampaignChapter; place: PageProps['place'] }) {
  const world = useWorld()
  const navigate = useNavigate()
  const nav = useHubNavigation()
  const full = world?.parties.map((p, i) => ({ p, i })).filter(({ p }) => isPartyFull(p)) ?? []
  const [party, setPartyState] = useState<number | null>(() => {
    const stored = storedParty()
    return stored !== null && full.some((f) => f.i === stored) ? stored : full[0]?.i ?? null
  })
  const [open, setOpen] = useState<RpgMapNode | null>(null)
  const [swept, setSwept] = useState<{ result: Result; nodeId: string } | null>(null)
  const [sweepFor, setSweepFor] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const setParty = (i: number) => {
    setPartyState(i)
    try {
      localStorage.setItem(PARTY_KEY, String(i + 1))
    } catch {
      // per-device convenience only
    }
  }
  if (!world) return null
  const run = party !== null ? runOf(world, party, chapter.id) : null
  const elsewhere = party !== null ? openFightOf(world, party) : null
  const status = (id: string): RpgNodeStatus => rpgNodeStatus(chapter, run, id)
  const toFight = () => party !== null && nav.sub(place, `${chapter.id}/fight/${party + 1}`)

  if (full.length === 0) {
    return (
      <div className="space-y-3 p-4">
        <p>A fight needs a full party of five.</p>
        <button type="button" onClick={() => navigate(pagePath({ page: 'town', id: 'party-hall' }), { state: { fromPlace: true } })} className="min-h-11 rounded-sm bg-accent px-4 font-display font-bold text-accent-ink">
          Build one in the Party Hall
        </button>
      </div>
    )
  }

  const members = party !== null ? (world.parties[party]?.slots ?? []).filter((s): s is string => s !== null) : []
  const width = 100 / 5
  const fight = async (node: RpgMapNode) => {
    if (party === null) return
    setError(null)
    try {
      await beginFight(chapter, party, node.id, campaign.outfits)
      setOpen(null)
      toFight()
    } catch (err) {
      setError(err instanceof SaveRuleError ? err.message : 'The fight couldn’t start.')
    }
  }
  const doSweep = async (nodeId: string, times = 1) => {
    if (party === null) return
    setError(null)
    try {
      const result = await sweep(chapter, party, nodeId, times)
      setOpen(null)
      setSweepFor(null)
      setSwept({ result, nodeId })
    } catch (err) {
      setError(err instanceof SaveRuleError ? err.message : 'Couldn’t sweep.')
    }
  }
  const camp = async (node: RpgMapNode) => {
    if (party === null) return
    try {
      await rest(chapter, party, node.id)
      setOpen(null)
    } catch (err) {
      setError(err instanceof SaveRuleError ? err.message : 'Can’t rest there yet.')
    }
  }

  return (
    <div>
      <div className="sticky top-0 z-10 space-y-2 border-b border-hairline bg-page/95 p-3 backdrop-blur">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="truncate font-display text-lg font-bold">{chapter.title}</h2>
          <span className="shrink-0 text-[12px] text-ink-soft">{formatLevel(chapter.levelStart)}–{formatLevel(chapter.levelStart + 9).replace('Lv ', '')}</span>
        </div>
        <div className="-mx-3 flex gap-1.5 overflow-x-auto px-3" role="tablist" aria-label="Party">
          {full.map(({ p, i }) => (
            <button key={i} type="button" role="tab" aria-selected={party === i} onClick={() => setParty(i)}
              className={`min-h-9 shrink-0 rounded-full px-3 text-[13px] font-semibold ${party === i ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'}`}>
              {p.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {members.map((id) => {
            const uma = world.umas[id]!
            const outfit = campaign.outfits.get(id)
            const build = outfit ? activeBuild(outfit, uma) : null
            const spare = build && uma.ranks.classes[RPG_BUILD[build].classId] > 1 ? rpgTreePointsEarned(uma.level) - rpgTreePointsSpent(buildOf(uma, build).tree.map((n) => ({ tier: 1, id: n }))) : 0
            return (
              <button key={id} type="button" className="relative" title={build ? BUILD_LABEL[build] : ''} aria-label={`${outfit?.name ?? id}: skills`}
                onClick={() => navigate(pagePath({ page: 'town', id: 'stable' }, `outfit/${id}/skills`), { state: { fromPlace: true } })}>
                <AtlasSprite art={campaign.view.art} family="outfit-icons" frameKey={id} size={40} className={isBusy(world, id) ? 'opacity-40 grayscale' : ''} />
                <span className="absolute bottom-0 left-0 rounded-full bg-black/70 px-1 font-display text-[9px] font-bold leading-3.5">{isBusy(world, id) ? 'Busy' : `Lv ${uma.level}`}</span>
                {spare > 0 && <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-page bg-accent" />}
              </button>
            )
          })}
          {members.some((id) => {
            const uma = world.umas[id]!
            const outfit = campaign.outfits.get(id)
            const build = outfit ? activeBuild(outfit, uma) : null
            return build && uma.ranks.classes[RPG_BUILD[build].classId] > 1 && rpgTreePointsEarned(uma.level) > rpgTreePointsSpent(buildOf(uma, build).tree.map((n) => ({ tier: 1, id: n })))
          }) && <span className="text-[11px] leading-tight text-accent">Skill points to spend: tap an Uma</span>}
        </div>
        {elsewhere?.battle && (
          <button type="button" onClick={() => (elsewhere.chapterId === chapter.id ? toFight() : nav.sub(place, `${elsewhere.chapterId}/fight/${(party ?? 0) + 1}`))}
            className="flex min-h-11 w-full items-center justify-center rounded-sm bg-accent font-display font-bold text-accent-ink">
            {elsewhere.chapterId === chapter.id ? 'Resume the fight' : `Resume the fight in ${campaign.chapter(elsewhere.chapterId)?.title ?? 'another chapter'}`}
          </button>
        )}
      </div>

      <div className="relative mx-auto my-4 max-w-md" style={{ height: chapter.rows * ROW }}>
        <svg className="absolute inset-0 size-full" aria-hidden>
          {chapter.nodes.flatMap((n) => n.exits.map((to) => {
            const m = chapter.nodes.find((x) => x.id === to)!
            const on = status(n.id) === 'cleared'
            return (
              <line key={`${n.id}-${to}`} x1={`${(n.col + 0.5) * width}%`} y1={n.row * ROW + ROW / 2} x2={`${(m.col + 0.5) * width}%`} y2={m.row * ROW + ROW / 2}
                stroke={on ? 'rgb(214 162 62 / 0.55)' : 'rgb(255 255 255 / 0.1)'} strokeWidth={on ? 3 : 2} />
            )
          }))}
        </svg>
        {chapter.nodes.filter((n) => n.kind === 'fight' && n.row === Math.min(...chapter.nodes.filter((x) => x.stage === n.stage && x.kind === 'fight').map((x) => x.row)) && n.col === 1).map((n) => (
          <span key={`stage-${n.stage}`} className="absolute left-1 text-[10px] font-semibold uppercase tracking-wide text-ink-faint" style={{ top: n.row * ROW - 4 }}>{RPG_STAGE_NAMES[n.stage]}</span>
        ))}
        <span className="absolute left-1 text-[10px] font-semibold uppercase tracking-wide text-ink-faint" style={{ top: (chapter.nodes.find((x) => x.id === 'final-camp')?.row ?? 0) * ROW - 4 }}>{RPG_STAGE_NAMES[3]}</span>
        {chapter.nodes.map((n) => {
          const s = status(n.id)
          const lead = n.kind === 'boss' || n.kind === 'sub-boss' ? n.enemies[0]?.castId : undefined
          const wins = run?.wins[n.id] ?? 0
          return (
            <button key={n.id} type="button" onClick={() => setOpen(n)} aria-label={`${n.name}, ${s}`}
              className={`absolute flex -translate-x-1/2 items-center justify-center rounded-full border-2 font-bold ${
                s === 'cleared' ? 'border-accent bg-accent/25' : s === 'available' ? 'border-ink bg-raised shadow-[0_0_12px_rgba(233,238,244,0.35)]' : 'border-hairline-strong bg-sunken opacity-60'
              }`}
              style={{ left: `${(n.col + 0.5) * width}%`, top: n.row * ROW + (ROW - NODE) / 2, width: NODE, height: NODE }}>
              {lead ? <CastFace campaign={campaign} castId={lead} size={NODE - 6} /> : <span className="text-[20px] leading-none">{KIND_MARK[n.kind]}</span>}
              {n.element && n.kind !== 'fight' && <span className="absolute -right-1 -top-1 rounded-full bg-page p-0.5"><ElementGlyph element={n.element} size={14} /></span>}
              {wins > 1 && n.kind !== 'camp' && <span className="absolute -bottom-1 right-0 rounded-full bg-page px-1 text-[9px] text-ink-soft">×{wins}</span>}
            </button>
          )
        })}
      </div>

      {open && (
        <BottomSheet title={open.name} onClose={() => { setOpen(null); setError(null) }}
          footer={open.kind === 'camp' ? (
            <button type="button" disabled={status(open.id) === 'locked' || !!run?.battle} onClick={() => void camp(open)}
              className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">Rest · refill MP</button>
          ) : (
            <div className="flex gap-2">
              <button type="button" disabled={status(open.id) === 'locked' || !!elsewhere?.battle} onClick={() => void fight(open)}
                className="min-h-12 flex-[2] rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
                {status(open.id) === 'locked' ? 'Clear a path to it first' : elsewhere?.battle ? 'Finish the open fight first' : status(open.id) === 'cleared' ? 'Fight again' : 'Fight'}
              </button>
              {open.kind === 'fight' && status(open.id) === 'cleared' && party !== null && (
                <button type="button" disabled={!!sweepBlock(world, chapter, party, open.id)} onClick={() => setSweepFor(open.id)}
                  className="min-h-12 flex-1 rounded-sm border border-hairline-strong font-semibold disabled:opacity-40" aria-label={sweepBlock(world, chapter, party, open.id) ?? 'Sweep with a ticket'}>
                  Sweep · {world.wallet.sweepTickets}
                </button>
              )}
            </div>
          )}>
          <p className="mb-2 text-[13px] text-ink-soft">
            {open.kind === 'camp' ? 'Rest here to refill every member’s MP.' : `${formatLevel(open.level)} · ${open.kind === 'fight' ? 'Rivals' : open.kind === 'boss' ? 'Champion' : open.stage >= 3 ? 'Vanguard' : 'Sub-boss'}`}
            {open.note ? ` · ${open.note}` : ''}
          </p>
          {open.enemies.length > 0 && (
            <ul className="space-y-1.5">
              {open.enemies.map((e) => (
                <li key={e.id} className="flex items-center gap-2 rounded-sm bg-raised p-2">
                  <CastFace campaign={campaign} castId={e.castId} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-[13px] font-semibold">
                      <ElementGlyph element={e.element} size={14} />
                      <span className="truncate">{campaign.name(e.id, e.castId)}</span>
                      {e.rank !== 'regular' && <span className="rounded-xs bg-accent/20 px-1 text-[10px] text-accent">{e.rank === 'boss' ? 'Champion' : 'Leader'}</span>}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-ink-soft">Shield {e.shield} · weak <WeaknessIcons weaknesses={e.weaknesses} size={12} /></p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
        </BottomSheet>
      )}
      {sweepFor && party !== null && (
        <BottomSheet title="Sweep" onClose={() => setSweepFor(null)}>
          <p className="mb-3 text-[13px] text-ink-soft">Each sweep pays this fight's EXP and Shards (no Laurels) for one Sweep Ticket. You have {world.wallet.sweepTickets}.</p>
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
      {swept && <FightResult campaign={campaign} chapter={chapter} result={swept.result} onMap={() => setSwept(null)} againLabel={`Sweep again · ${world.wallet.sweepTickets}`}
        onAgain={() => { if (party !== null && !sweepBlock(world, chapter, party, swept.nodeId)) void sweep(chapter, party, swept.nodeId).then((result) => setSwept({ result, nodeId: swept.nodeId })) }} />}
    </div>
  )
}
