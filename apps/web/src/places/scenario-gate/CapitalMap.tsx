// The capital's authored Finals: three independent vanguard → champion routes (H15).
import { capitalId, capitalStageIds, rpgFinals, worldRun, type RpgElement, type WorldContinent } from '@rpg/domain'
import type { Campaign } from '../../battle/campaign'
import { ElementGlyph, formatLevel } from '../../battle/labels'
import { useWorld } from '../../save/game'
import type { PageProps } from '../registry'
import { StageMap } from './RegionMap'

export function CapitalMap({ campaign, continent, place }: { campaign: Campaign; continent: WorldContinent; place: PageProps['place'] }) {
  const world = useWorld()
  const chapter = campaign.region(capitalId(continent.id))!
  const finals = rpgFinals(continent.order)
  if (!world) return null
  const run = worldRun(world)
  return <StageMap campaign={campaign} region={chapter} place={place} title={finals.title}
    levels={formatLevel(chapter.levelStart)} color={campaign.color(chapter.id)} capital renderStages={(choice) => (
      <div className="space-y-3 p-3">
        {finals.routes.map((route, i) => {
          const ids = capitalStageIds(continent.id, i + 1)
          const nodes = [ids.vanguard, ids.champion].map((id) => chapter.nodes.find((n) => n.id === id)!)
          const elements = [...new Set<RpgElement>(nodes.flatMap((n) => n.enemies.flatMap((e) => e.element2 ? [e.element, e.element2] : [e.element])))]
          const won = nodes.filter((n) => (run.wins[n.id] ?? 0) > 0).length
          return <section key={ids.vanguard} aria-labelledby={`${ids.vanguard}-title`} className="space-y-2 rounded-md border border-hairline p-2">
            <div className="flex items-baseline justify-between gap-2">
              <h3 id={`${ids.vanguard}-title`} className="font-display font-bold">{route.name}</h3>
              <span className="shrink-0 text-[12px] text-ink-soft">{won}/2</span>
            </div>
            <p className="text-[12px] text-ink-soft">{route.line}</p>
            <div role="img" aria-label={`Elements: ${elements.join(', ')}`} className="flex gap-1">{elements.map((e) => <ElementGlyph key={e} element={e} size={16} />)}</div>
            <ol className="space-y-2">{nodes.map((n, j) => <li key={n.id}>{choice(n, 2 * i + j)}</li>)}</ol>
          </section>
        })}
      </div>
    )} />
}
