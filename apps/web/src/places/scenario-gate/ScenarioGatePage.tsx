// The Scenario Gate (S1, S3): Tier 1's chapters with their progress, each chapter's map, and its fights. Later tiers
// stay locked until promotion (S8). Routes: `` (chapters), `<chapterId>` (map), `<chapterId>/fight/<party>` (fight).
import { rpgChapterCleared, runOf, SaveRuleError, type FightResult as Result, type RpgCampaignChapter } from '@rpg/domain'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { CampaignGate, type Campaign } from '../../battle/campaign'
import { pagePath, useHubNavigation, type NavState } from '../../hub/navigation'
import { AtlasSprite } from '../../master/art'
import { beginFight, useWorld } from '../../save/game'
import { LockIcon } from '../../ui/icons'
import type { PageProps } from '../registry'
import { ChapterMap } from './ChapterMap'
import { FightResult } from './FightResult'
import { FightScreen } from './FightScreen'

export default function ScenarioGatePage({ place, rest }: PageProps) {
  const [chapterId, sub, partyText] = rest.split('/')
  return (
    <CampaignGate>
      {(campaign) => {
        const chapter = chapterId ? campaign.chapter(chapterId) : null
        if (chapterId && !chapter) return <p className="p-4 text-ink-soft">That chapter isn’t in Tier 1.</p>
        if (chapter && sub === 'fight') return <FightRoute campaign={campaign} chapter={chapter} party={Number(partyText) - 1} place={place} />
        if (chapter) return <ChapterMap campaign={campaign} chapter={chapter} place={place} />
        return <Chapters campaign={campaign} place={place} />
      }}
    </CampaignGate>
  )
}

function Chapters({ campaign, place }: { campaign: Campaign; place: PageProps['place'] }) {
  const world = useWorld()
  const nav = useHubNavigation()
  const tiers = [...new Set(campaign.view.chapters.map((c) => c.tier))].sort((a, b) => a - b)
  return (
    <div className="space-y-5 p-4">
      {tiers.map((tier) => {
        const infos = campaign.view.chapters.filter((c) => c.tier === tier)
        if (tier !== 1) {
          return (
            <section key={tier}>
              <h3 className="text-micro mb-2">Tier {tier} · locked</h3>
              <div className="flex items-center gap-2 rounded-md bg-raised/60 p-3 text-[13px] text-ink-soft">
                <LockIcon size={16} className="text-locked" />
                <span>
                  {infos.map((c) => c.name).join(' · ')}
                  {infos.length < 5 && ' · next scenario'} — promote an Uma to reach Tier {tier}.
                </span>
              </div>
            </section>
          )
        }
        return (
          <section key={tier}>
            <h3 className="text-micro mb-2">Tier 1</h3>
            <ul className="space-y-2">
              {infos.map((info) => {
                const chapter = campaign.chapter(String(info.scenarioId))
                const runs = world && chapter ? Object.values(world.runs).filter((r) => r.chapterId === chapter.id) : []
                const cleared = chapter && runs.some((r) => rpgChapterCleared(chapter, r))
                const fighting = runs.some((r) => r.battle)
                const won = chapter ? Math.max(0, ...runs.map((r) => chapter.nodes.filter((n) => n.kind !== 'camp' && (r.wins[n.id] ?? 0) > 0).length)) : 0
                const total = chapter?.nodes.filter((n) => n.kind !== 'camp').length ?? 0
                return (
                  <li key={info.scenarioId}>
                    <button type="button" onClick={() => nav.sub(place, String(info.scenarioId))}
                      className="flex w-full items-center gap-3 rounded-md border-l-4 bg-raised p-2.5 text-left active:bg-white/5" style={{ borderColor: info.color }}>
                      <AtlasSprite art={campaign.view.art} family="scenario-icons" frameKey={String(info.scenarioId)} size={44} label={`${info.name} crest`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display font-bold">{info.name}</p>
                        <p className="text-[12px] text-ink-soft">
                          Chapter {info.order} · Lv {info.levelBand[0]}–{info.levelBand[1]}
                          {won > 0 ? ` · ${won}/${total} won` : ''}
                        </p>
                      </div>
                      {fighting ? <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-ink">Fight open</span>
                        : cleared ? <span className="shrink-0 rounded-full bg-success/20 px-2 py-0.5 text-[11px] font-bold text-success">Cleared</span> : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function FightRoute({ campaign, chapter, party, place }: { campaign: Campaign; chapter: RpgCampaignChapter; party: number; place: PageProps['place'] }) {
  const world = useWorld()
  const navigate = useNavigate()
  const location = useLocation()
  const [ended, setEnded] = useState<{ result: Result; nodeId: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const run = world && Number.isInteger(party) ? runOf(world, party, chapter.id) : null
  const toMap = () => ((location.state as NavState | null)?.fromPlace ? navigate(-1) : navigate(pagePath(place, chapter.id), { replace: true }))
  if (ended) {
    return (
      <>
        <FightResult campaign={campaign} chapter={chapter} result={ended.result} onMap={toMap}
          onAgain={() => {
            beginFight(chapter, party, ended.nodeId, campaign.outfits).then(() => setEnded(null), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'The fight couldn’t start.'))
          }} />
        {error && <p className="fixed inset-x-0 bottom-24 z-50 mx-4 rounded-sm bg-danger/90 p-2 text-center text-[13px]">{error}</p>}
      </>
    )
  }
  return <FightScreen key={run?.battle?.battleId ?? 'none'} campaign={campaign} chapter={chapter} party={party} onMap={toMap} onEnd={(result, nodeId) => setEnded({ result, nodeId })} />
}
