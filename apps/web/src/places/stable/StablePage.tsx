// SB4: shared album chrome, virtual views and device preferences. RPG profile routes and rules stay here.
import { AlbumChrome, AlbumGrid, useAlbumPrefs } from '@luismlorenzana/uma-kit/album'
import { emptyStateHint } from '@luismlorenzana/uma-kit/roster'
import { bestAptitudeLine } from '@rpg/domain'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { albumRows, stableResult, STABLE_FACETS, STABLE_PRESETS, STABLE_SCHEMA, STABLE_SORTS } from '../../album/rows'
import { withUpgrades } from '../../album/upgrades'
import { prepareStablePrefs } from '../../album/preferences'
import { ClassEmblem } from '../../battle/pixel-icons'
import type { MasterView } from '../../master/master'
import { useActiveTier, useAlbumScope, useWorld } from '../../save/game'
import { TargetIcon } from '../../ui/icons'
import { UpgradeMark } from '../../ui/UpgradeMark'
import { useNow } from '../../ui/useNow'
import { MasterGate } from '../MasterGate'
import type { PageProps } from '../registry'
import { OutfitProfile } from './OutfitProfile'
import { restoreRosterScroll, rosterList, saveRosterScroll } from './profile-nav'
import { firstDotTab, profileDoor, tabDots } from './profile-tabs'

export default function StablePage({ place, rest }: PageProps) {
  const [, outfitId, sub] = rest.split('/')
  return <MasterGate>{view => {
    if (!outfitId) return <Roster view={view} place={place} />
    // Keyed by her, so a step closes any open sheet (H124).
    return <OutfitProfile key={outfitId} view={view} outfitId={outfitId} place={place} route={sub} />
  }}</MasterGate>
}

export function Roster({ view }: { view: MasterView; place: PageProps['place'] }) {
  const world = useWorld()
  const scope = useAlbumScope()
  const tier = useActiveTier()
  const now = useNow(30_000)
  const navigate = useNavigate()
  const [schema] = useState(() => {
    prepareStablePrefs(view.roster.map(o => o.outfitId))
    return STABLE_SCHEMA
  })
  const prefs = useAlbumPrefs('stable', schema)
  // "Can upgrade" (H34) is memoized per world, so the 30-second rerun only rebuilds the rows.
  const rows = useMemo(() => withUpgrades(albumRows(view, world, prefs.seen, now, scope), world, tier), [view, world, prefs.seen, now, scope, tier])
  const result = stableResult(rows, prefs.query)
  const ownership = prefs.query.filters.ownership
  const tab = Array.isArray(ownership) && ownership.length === 1 && (ownership[0] === 'owned' || ownership[0] === 'locked') ? ownership[0] : 'all'
  const counts = result.counts.ownership ?? {}
  useEffect(restoreRosterScroll, [])
  /** A face (H124): the remembered tab, or with Can upgrade on the first tab with a dot; the list is what the view shows, owned. */
  const open = (row: (typeof result.rows)[number]) => {
    prefs.see([row.id])
    saveRosterScroll()
    const dots = prefs.query.filters.upgrade && row.uma ? tabDots(row.upgrades) : null
    const door = profileDoor(row.id, { tab: (dots && firstDotTab(dots)) ?? undefined, list: rosterList(result.rows) })
    void navigate(door.to, { state: door.state })
  }
  return <div className="p-4">
    <AlbumChrome title="Stable" completion={`${Object.keys(world?.umas ?? {}).length}/${rows.length} owned`}
      facets={STABLE_FACETS} sorts={STABLE_SORTS} presets={STABLE_PRESETS} query={prefs.query} counts={result.counts} total={result.total}
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
        onOpen={open}
        renderBadges={row => ({
          topLeft: row.classId ? <ClassEmblem classId={row.classId} /> : undefined,
          bottomLeft: world?.targets.includes(row.id) ? (
            <span className="flex size-5 items-center justify-center rounded-full bg-accent text-accent-ink shadow-1 ring-1 ring-page" aria-label="Target">
              <TargetIcon size={13} />
            </span>
          ) : undefined,
          bottomRight: row.isNew ? <span className="rounded-full bg-accent px-1 text-[8px] font-bold text-accent-ink">NEW</span>
            : row.upgrades?.any ? <UpgradeMark /> : undefined,
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
