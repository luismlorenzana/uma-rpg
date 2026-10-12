// The Stable (S2, T012): every outfit, with ownership, search, filters, sorts and grid/list views in the spirit of
// uma-racer's Stable, plus profiles with the unlock flow.
import { activeFacetCount, bestAptitudeLine, isBusy, isInFight, KEY_LABELS, runRosterQuery, SORT_LABELS, type RosterEntry, type RosterFacets, type RosterSortKey } from '@rpg/domain'
import { useEffect, useMemo, useState } from 'react'
import { useHubNavigation } from '../../hub/navigation'
import { AtlasSprite, imagePath, useArtUrl } from '../../master/art'
import type { MasterView } from '../../master/master'
import { useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { BackIcon, CloseIcon, LockIcon, SearchIcon, TargetIcon } from '../../ui/icons'
import { MasterGate } from '../MasterGate'
import type { PageProps } from '../registry'
import { FiltersSheet } from './FiltersSheet'
import { OutfitProfile } from './OutfitProfile'
import { SkillsPage } from './SkillsPage'
import { loadPrefs, savePrefs, type StablePrefs } from './stable-prefs'

function Skeleton() {
  return (
    <div className="grid grid-cols-4 gap-2 p-4 min-[400px]:grid-cols-5">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="aspect-square animate-pulse rounded-md bg-raised" />
      ))}
    </div>
  )
}

export default function StablePage({ place, rest }: PageProps) {
  const [, outfitId, sub] = rest.split('/')
  return (
    <MasterGate skeleton={<Skeleton />}>
      {(view) => {
        if (!outfitId) return <Roster view={view} place={place} />
        const outfit = view.roster.find((o) => o.outfitId === outfitId)
        if (sub === 'skills' && outfit) return <SkillsRoute outfit={outfit} place={place} />
        return <OutfitProfile view={view} outfitId={outfitId} place={place} />
      }}
    </MasterGate>
  )
}

function SkillsRoute({ outfit, place }: { outfit: RosterEntry['outfit']; place: PageProps['place'] }) {
  const nav = useHubNavigation()
  return (
    <div className="space-y-2 p-4">
      <button type="button" onClick={() => nav.subBack(place)} className="-ml-2 flex min-h-11 items-center gap-1 px-2 text-[14px] font-semibold text-ink-soft">
        <BackIcon size={18} /> {outfit.name}
      </button>
      <SkillsPage outfit={outfit} name={outfit.name} />
    </div>
  )
}

/** The badge on an owned Uma: whatever the list is sorted by, else her Uma Level. */
function badgeOf(entry: RosterEntry, key: RosterSortKey): string {
  const u = entry.owned
  if (!u) return ''
  if (key === 'farm') return `Farm ${u.professions.farming.level}`
  if (key === 'craft') return `Craft ${u.professions.gathering.level}`
  if (key === 'classRank') return `Rank ${Math.max(...Object.values(u.ranks.classes))}`
  return `Lv ${u.level}`
}

function facetChips(f: RosterFacets): { label: string; remove: (f: RosterFacets) => RosterFacets }[] {
  const chips: { label: string; remove: (f: RosterFacets) => RosterFacets }[] = []
  for (const r of f.rarity) chips.push({ label: '★'.repeat(r), remove: (x) => ({ ...x, rarity: x.rarity.filter((v) => v !== r) }) })
  for (const k of f.surface) chips.push({ label: `${KEY_LABELS[k]} A`, remove: (x) => ({ ...x, surface: x.surface.filter((v) => v !== k) }) })
  for (const k of f.distance) chips.push({ label: `${KEY_LABELS[k]} A`, remove: (x) => ({ ...x, distance: x.distance.filter((v) => v !== k) }) })
  for (const k of f.strategy) chips.push({ label: `${KEY_LABELS[k]} A`, remove: (x) => ({ ...x, strategy: x.strategy.filter((v) => v !== k) }) })
  for (const k of f.sex) chips.push({ label: k === 'female' ? 'Mare' : k === 'male' ? 'Stallion' : 'Unknown', remove: (x) => ({ ...x, sex: x.sex.filter((v) => v !== k) }) })
  if (f.newOnly) chips.push({ label: 'New', remove: (x) => ({ ...x, newOnly: false }) })
  if (f.freeOnly) chips.push({ label: 'Free now', remove: (x) => ({ ...x, freeOnly: false }) })
  return chips
}

function Roster({ view, place }: { view: MasterView; place: PageProps['place'] }) {
  const world = useWorld()
  const nav = useHubNavigation()
  const [prefs, setPrefs] = useState<StablePrefs>(loadPrefs)
  const [search, setSearch] = useState('')
  const [sheet, setSheet] = useState<'filters' | 'sort' | null>(null)
  useEffect(() => savePrefs(prefs), [prefs])
  const result = useMemo(() => {
    const busy = new Set(world ? Object.keys(world.umas).filter((id) => isBusy(world, id) || isInFight(world, id)) : [])
    return runRosterQuery(view.roster, world?.umas ?? {}, { ...prefs.query, search }, Date.now(), busy)
  }, [view.roster, world, prefs.query, search])
  const setQuery = (patch: Partial<StablePrefs['query']>) => setPrefs((p) => ({ ...p, query: { ...p.query, ...patch } }))
  const open = (entry: RosterEntry) => nav.sub(place, `outfit/${entry.outfit.outfitId}`)
  const chips = facetChips(prefs.query.facets)
  const filterCount = activeFacetCount(prefs.query.facets)

  return (
    <div>
      <div className="sticky top-0 z-10 space-y-2 border-b border-hairline bg-page/95 p-3 backdrop-blur">
        <div className="grid grid-cols-3 rounded-sm bg-sunken p-1" role="tablist" aria-label="Ownership">
          {(['all', 'owned', 'locked'] as const).map((o) => (
            <button
              key={o}
              type="button"
              role="tab"
              aria-selected={prefs.query.ownership === o}
              onClick={() => setQuery({ ownership: o })}
              className={`min-h-10 rounded-xs text-[13px] font-semibold ${prefs.query.ownership === o ? 'bg-raised text-ink shadow-2' : 'text-ink-faint'}`}
            >
              {o === 'all' ? 'All' : o === 'owned' ? 'Owned' : 'Locked'} <span className="tabular-nums text-ink-faint">{result.counts[o]}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-sm bg-sunken px-3">
            <SearchIcon size={18} className="shrink-0 text-ink-faint" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="min-h-11 w-full bg-transparent text-ink outline-none placeholder:text-ink-faint" aria-label="Search outfits" />
          </label>
          <button type="button" onClick={() => setSheet('filters')} className="relative min-h-11 rounded-sm bg-raised px-3 text-[13px] font-semibold">
            Filters
            {filterCount > 0 && <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-ink">{filterCount}</span>}
          </button>
          <button type="button" onClick={() => setSheet('sort')} className="min-h-11 rounded-sm bg-raised px-3 text-[13px] font-semibold" aria-label={`Sort: ${SORT_LABELS[prefs.query.sort.key]}`}>
            Sort
          </button>
          <button
            type="button"
            onClick={() => setPrefs((p) => ({ ...p, view: p.view === 'grid' ? 'list' : 'grid' }))}
            className="min-h-11 rounded-sm bg-raised px-3 text-[13px] font-semibold"
            aria-label={prefs.view === 'grid' ? 'Show as list' : 'Show as grid'}
          >
            {prefs.view === 'grid' ? 'List' : 'Grid'}
          </button>
        </div>
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <button key={c.label} type="button" onClick={() => setQuery({ facets: c.remove(prefs.query.facets) })} className="flex min-h-8 items-center gap-1 rounded-full bg-accent/15 pl-2.5 pr-1.5 text-[12px] font-semibold text-accent">
                {c.label} <CloseIcon size={14} />
              </button>
            ))}
          </div>
        )}
        <p className="text-[11px] text-ink-faint">
          {SORT_LABELS[prefs.query.sort.key]} · {prefs.query.sort.direction === 'desc' ? 'high → low' : 'low → high'}
        </p>
      </div>

      {prefs.view === 'grid' ? (
        <ul className="grid grid-cols-4 gap-2 p-3 min-[400px]:grid-cols-5">
          {result.entries.map((e) => (
            <li key={e.outfit.outfitId} style={{ contentVisibility: 'auto', containIntrinsicSize: '96px' }}>
              <button type="button" onClick={() => open(e)} className="flex w-full flex-col items-center gap-1 rounded-md p-1 text-center active:bg-white/5" aria-label={`${e.outfit.name}${e.outfit.title ? `, ${e.outfit.title}` : ''}${e.owned ? `, level ${e.owned.level}` : ', locked'}`}>
                <span className="relative">
                  <AtlasSprite art={view.art} family="outfit-icons" frameKey={e.outfit.outfitId} size={60} className={e.owned ? '' : 'opacity-55 grayscale-[40%]'} />
                  {e.owned ? (
                    <span className="absolute bottom-0.5 left-0.5 rounded-full bg-black/70 px-1.5 font-display text-[10px] font-bold leading-4 text-ink">{badgeOf(e, prefs.query.sort.key)}</span>
                  ) : (
                    <span className="absolute bottom-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-locked">
                      <LockIcon size={12} />
                    </span>
                  )}
                  {e.isNew && <span className="absolute -right-1 -top-1 rounded-full bg-accent px-1 text-[9px] font-bold leading-4 text-accent-ink">NEW</span>}
                  {world?.targets.includes(e.outfit.outfitId) && (
                    <span className="absolute -left-1 -top-1 rounded-full bg-accent p-0.5 text-accent-ink" aria-label="Target"><TargetIcon size={12} /></span>
                  )}
                </span>
                <span className="line-clamp-2 break-words text-[10.5px] font-semibold leading-tight text-ink-soft [overflow-wrap:anywhere]">{e.outfit.name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-1.5 p-3">
          {result.entries.map((e) => (
            <li key={e.outfit.outfitId} style={{ contentVisibility: 'auto', containIntrinsicSize: '64px' }}>
              <ListRow entry={e} view={view} onOpen={() => open(e)} badge={badgeOf(e, prefs.query.sort.key)} />
            </li>
          ))}
        </ul>
      )}
      {result.entries.length === 0 && <p className="p-6 text-center text-ink-soft">No outfit matches these filters.</p>}

      {sheet === 'filters' && (
        <FiltersSheet facets={prefs.query.facets} onChange={(facets) => setQuery({ facets })} onClose={() => setSheet(null)} resultCount={result.entries.length} />
      )}
      {sheet === 'sort' && (
        <BottomSheet title="Sort" onClose={() => setSheet(null)}>
          <ul className="space-y-1.5">
            {(Object.keys(SORT_LABELS) as RosterSortKey[]).map((key) => {
              const active = prefs.query.sort.key === key
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => setQuery({ sort: { key, direction: active ? (prefs.query.sort.direction === 'desc' ? 'asc' : 'desc') : key === 'name' ? 'asc' : 'desc' } })}
                    className={`flex min-h-12 w-full items-center justify-between rounded-sm px-3 text-left text-[14px] font-semibold ${active ? 'bg-accent/15 text-accent' : 'bg-raised'}`}
                  >
                    {SORT_LABELS[key]}
                    {active && <span className="text-[12px]">{prefs.query.sort.direction === 'desc' ? 'high → low' : 'low → high'} · tap to flip</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </BottomSheet>
      )}
    </div>
  )
}

function ListRow({ entry, view, onOpen, badge }: { entry: RosterEntry; view: MasterView; onOpen: () => void; badge: string }) {
  const bust = useArtUrl(imagePath(view.art, 'outfit-busts', entry.outfit.outfitId))
  return (
    <button type="button" onClick={onOpen} className="flex w-full items-center gap-3 rounded-md bg-panel p-2 text-left active:bg-raised">
      <span className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-raised">
        {bust ? (
          <img src={bust} alt="" className={`size-full object-cover object-top ${entry.owned ? '' : 'opacity-50 saturate-50'}`} />
        ) : (
          <AtlasSprite art={view.art} family="outfit-icons" frameKey={entry.outfit.outfitId} size={48} className={entry.owned ? '' : 'opacity-55'} />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[14px] font-semibold">{entry.outfit.name}</span>
          {entry.isNew && <span className="rounded-full bg-accent px-1 text-[9px] font-bold leading-4 text-accent-ink">NEW</span>}
        </span>
        <span className="block truncate text-[11px] text-ink-faint">
          {'★'.repeat(entry.outfit.rarity)} {entry.outfit.title ?? ''}
        </span>
        <span className="block truncate text-[11px] text-ink-soft">{bestAptitudeLine(entry.outfit.aptitudes)}</span>
      </span>
      <span className="shrink-0 text-right text-[12px]">
        {entry.owned ? (
          <span className="font-display font-bold">{badge}</span>
        ) : (
          <span className="flex items-center gap-1 text-locked">
            <LockIcon size={12} /> Locked
          </span>
        )}
      </span>
    </button>
  )
}
