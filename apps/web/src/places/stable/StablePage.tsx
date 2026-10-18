// SB4: shared album chrome, virtual views and device preferences. RPG profile routes and rules stay here.
import { AlbumChrome, AlbumGrid, useAlbumPrefs } from '@luismlorenzana/uma-kit/album'
import { emptyStateHint } from '@luismlorenzana/uma-kit/roster'
import { bestAptitudeLine, type RosterOutfit } from '@rpg/domain'
import { useMemo, useState } from 'react'
import { albumRows, stableResult, STABLE_FACETS, STABLE_SCHEMA, STABLE_SORTS } from '../../album/rows'
import { prepareStablePrefs } from '../../album/preferences'
import { ClassEmblem } from '../../battle/pixel-icons'
import { useHubNavigation } from '../../hub/navigation'
import type { MasterView } from '../../master/master'
import { useWorld } from '../../save/game'
import { BackIcon, TargetIcon } from '../../ui/icons'
import { useNow } from '../../ui/useNow'
import { MasterGate } from '../MasterGate'
import type { PageProps } from '../registry'
import { OutfitProfile } from './OutfitProfile'
import { SkillsPage } from './SkillsPage'

export default function StablePage({ place, rest }: PageProps) {
  const [, outfitId, sub] = rest.split('/')
  return <MasterGate>{view => {
    if (!outfitId) return <Roster view={view} place={place} />
    const outfit = view.roster.find(o => o.outfitId === outfitId)
    if (sub === 'skills' && outfit) return <SkillsRoute outfit={outfit} place={place} />
    return <OutfitProfile view={view} outfitId={outfitId} place={place} />
  }}</MasterGate>
}

function SkillsRoute({ outfit, place }: { outfit: RosterOutfit; place: PageProps['place'] }) {
  const nav = useHubNavigation()
  return <div className="space-y-2 p-4">
    <button type="button" onClick={() => nav.subBack(place)} className="-ml-2 flex min-h-11 items-center gap-1 px-2 text-[14px] font-semibold text-ink-soft">
      <BackIcon size={18} /> {outfit.name}
    </button>
    <SkillsPage outfit={outfit} name={outfit.name} />
  </div>
}

export function Roster({ view, place }: { view: MasterView; place: PageProps['place'] }) {
  const world = useWorld()
  const now = useNow(30_000)
  const nav = useHubNavigation()
  const [schema] = useState(() => {
    prepareStablePrefs(view.roster.map(o => o.outfitId))
    return STABLE_SCHEMA
  })
  const prefs = useAlbumPrefs('stable', schema)
  const rows = useMemo(() => albumRows(view, world, prefs.seen, now), [view, world, prefs.seen, now])
  const result = stableResult(rows, prefs.query)
  const ownership = prefs.query.filters.ownership
  const tab = Array.isArray(ownership) && ownership.length === 1 && (ownership[0] === 'owned' || ownership[0] === 'locked') ? ownership[0] : 'all'
  const counts = result.counts.ownership ?? {}
  return <div className="p-4">
    <AlbumChrome title="Stable" completion={`${Object.keys(world?.umas ?? {}).length}/${rows.length} owned`}
      facets={STABLE_FACETS} sorts={STABLE_SORTS} query={prefs.query} counts={result.counts} total={result.total}
      tabs={{ value: tab, counts: { all: (counts.owned ?? 0) + (counts.locked ?? 0), owned: counts.owned ?? 0, locked: counts.locked ?? 0 },
        onChange: value => {
          const filters = { ...prefs.query.filters }
          if (value === 'all') delete filters.ownership
          else filters.ownership = [value]
          prefs.setQuery({ ...prefs.query, filters })
        } }}
      hiddenFilterKeys={['ownership']} countFor={draft => stableResult(rows, draft).total}
      emptyHint={emptyStateHint(rows, STABLE_FACETS, prefs.query)}
      views={prefs.views} onSaveView={prefs.saveView} onDeleteView={prefs.deleteView} onQueryChange={prefs.setQuery}
      words={{ level: 'Uma Level', savedViewHint: 'Filters, sort and view' }}>
      <AlbumGrid rows={result.rows} view={prefs.query.view} columns={5}
        locked={row => row.uma === null}
        onOpen={row => { prefs.see([row.id]); nav.sub(place, `outfit/${row.id}`) }}
        renderBadges={row => ({
          topLeft: row.classId ? <ClassEmblem classId={row.classId} /> : undefined,
          topRight: row.busy ? <span className="rounded-full bg-panel px-1 text-[9px] font-bold" aria-label="Working">W</span> : undefined,
          bottomLeft: world?.targets.includes(row.id) ? <span className="text-accent" aria-label="Target"><TargetIcon size={14} /></span> : undefined,
          bottomRight: row.isNew ? <span className="rounded-full bg-accent px-1 text-[8px] font-bold text-accent-ink">NEW</span> : undefined,
        })}
        renderChips={row => <span className="min-w-0 text-[10px] text-ink-soft">
          <span className="block truncate">{row.base.title ?? '★'.repeat(row.base.rarity)}</span>
          {prefs.query.sort === 'craft' && row.uma ? <span>Craft Level {row.workLevel}</span>
            : prefs.query.sort === 'classRank' && row.uma ? <span>Class Rank {row.sorts.classRank}</span>
            : <span className="block truncate">{bestAptitudeLine(row.base.aptitudes)}</span>}
        </span>} />
    </AlbumChrome>
  </div>
}
