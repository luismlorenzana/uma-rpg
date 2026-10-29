// RPG data and eligibility over the kit's neutral album rows. No list/query implementation lives here.
import { type AlbumPreset, type AlbumPrefsSchema, type AlbumQuery, type FacetDef, type SortDef, type OutfitRowBase, runAlbumQuery } from '@luismlorenzana/uma-kit/roster'
import {
  ACCESSORY_FAMILIES, ACCESSORY_FAMILY_LABEL, activeClass, availableWorkers, BATTLE_ENGINE_VERSION, KEY_LABELS, KNACK_LABEL, RPG_CLASSES, rpgRework, statTotal, STRIDE_LABEL,
  TRADE_IDS, UMA_KNACKS, UMA_STRIDES, umaTemplate, umaTemplateFacets, tradeOfCalling,
  type OwnedUma, type RosterOutfit, type TierWorld, type UmaUpgrades, umaPick,
} from '@rpg/domain'
import { CLASS_LABEL } from '../battle/labels'
import type { MasterView } from '../master/master'
import { tradeLabel } from '../save/trade'
import type { UmaPickerRow } from '@luismlorenzana/uma-kit/album'

export interface RpgUmaRow extends UmaPickerRow {
  outfit: RosterOutfit
  base: OutfitRowBase
  uma: OwnedUma | null
  classId: typeof RPG_CLASSES[number] | null
  isNew: boolean
  busy: boolean
  /** What she can upgrade now (H34): filled by `withUpgrades` on the Stable only, null elsewhere. */
  upgrades: UmaUpgrades | null
}

const enumFacet = (key: string, label: string, options: readonly string[], group = 'Aptitudes'): FacetDef => ({
  key, label, group, kind: 'enum', options: options.map(value => ({ value, label: KEY_LABELS[value] ?? value })),
})
const FACETS: readonly FacetDef[] = [
  { ...enumFacet('ownership', 'Ownership', ['owned', 'locked'], 'Collection'), options: [{ value: 'owned', label: 'Owned' }, { value: 'locked', label: 'Locked' }] },
  { ...enumFacet('rarity', 'Rarity', ['1', '2', '3'], 'Collection'), options: [1, 2, 3].map(n => ({ value: String(n), label: '★'.repeat(n) })) },
  enumFacet('surface', 'Surface · A+', ['turf', 'dirt']),
  enumFacet('distance', 'Distance · A+', ['sprint', 'mile', 'medium', 'long']),
  enumFacet('strategy', 'Running style · A+', ['front', 'pace', 'late', 'end']),
  { key: 'sex', label: 'Real horse', group: 'Collection', kind: 'enum', options: [{ value: 'female', label: 'Mare' }, { value: 'male', label: 'Stallion' }, { value: 'unknown', label: 'Unknown' }] },
  { key: 'new', label: 'New', group: 'Collection', kind: 'boolean' },
  { key: 'free', label: 'Free now', group: 'Collection', kind: 'boolean' },
  { key: 'class', label: 'Class', group: 'RPG', kind: 'enum', options: RPG_CLASSES.map(value => ({ value, label: CLASS_LABEL[value] })) },
  { key: 'upgrade', label: 'Can upgrade', group: 'RPG', kind: 'boolean' },
]
const TEMPLATE_FACETS: readonly FacetDef[] = [
  { key: 'calling', label: 'Calling', group: 'Template', kind: 'enum', options: RPG_CLASSES.map(value => ({ value, label: CLASS_LABEL[value] })) },
  { key: 'stride', label: 'Stride', group: 'Template', kind: 'enum', options: UMA_STRIDES.map(value => ({ value, label: STRIDE_LABEL[value] })) },
  { key: 'knack', label: 'Knack', group: 'Template', kind: 'enum', options: UMA_KNACKS.map(value => ({ value, label: KNACK_LABEL[value] })) },
]
/** Her trade (R2, PP21; H80): her calling's two places, "Mine · Forge"; the filter tray counts each one's heads. */
export const TRADE_FACET: FacetDef = {
  key: 'trade', label: 'Trade', group: 'Trade', kind: 'enum', options: TRADE_IDS.map(value => ({ value, label: tradeLabel(value) })),
}
const SIGNATURE_FACET: FacetDef = { key: 'signature', label: 'Signature', group: 'Template', kind: 'enum',
  options: ACCESSORY_FAMILIES.map(value => ({ value, label: ACCESSORY_FAMILY_LABEL[value] })) }
/** The Stable's facets: from engine v16 (UT15, H70) a Template group after RPG, her calling (an owned Uma's pick counts),
 * stride and knack; from R2's switch, Signature in Template and Trade after it, on locked outfits too. The boolean
 * overload keeps H80's isolated switch test legible. */
export const stableFacets = (stage: number | boolean = BATTLE_ENGINE_VERSION): readonly FacetDef[] => {
  const economy = typeof stage === 'boolean' ? stage : rpgRework('economy', stage)
  return [...FACETS, ...TEMPLATE_FACETS, ...(economy ? [SIGNATURE_FACET, TRADE_FACET] : [])]
}
export const STABLE_FACETS: readonly FacetDef[] = stableFacets()
/** The Filters sheet's quick picks (H34): "Can upgrade" turns that facet on. */
export const STABLE_PRESETS: readonly AlbumPreset[] = [
  { key: 'upgrade', label: 'Can upgrade', apply: q => ({ ...q, filters: { ...q.filters, upgrade: true } }) },
]
export const STABLE_SORTS: readonly SortDef[] = [
  { key: 'level', label: 'Uma Level', defaultDirection: 'desc' },
  { key: 'release', label: 'Release date', defaultDirection: 'desc' },
  { key: 'name', label: 'Name', defaultDirection: 'asc' },
  { key: 'rarity', label: 'Rarity', defaultDirection: 'desc' },
  { key: 'statTotal', label: 'Total base stats', defaultDirection: 'desc' },
  { key: 'craft', label: 'Craft Level', defaultDirection: 'desc' },
  { key: 'classRank', label: 'Class Rank', defaultDirection: 'desc' },
]
export const STABLE_SCHEMA: AlbumPrefsSchema = {
  facets: STABLE_FACETS, sorts: STABLE_SORTS,
  fallback: { search: '', filters: {}, sort: 'level', direction: 'desc', group: null, view: 'icons', mode: null },
}
export const foldSearch = (text: string): string => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

/** Who a tier's album lists (H35): its world's Umas, and in Tier 1 the catalogue no world owns yet (D5). `elsewhere` is
 * every outfit another tier's world owns. */
export interface AlbumScope { tier: number; elsewhere: ReadonlySet<string> }
export const TIER_ONE_SCOPE: AlbumScope = { tier: 1, elsewhere: new Set() }

/** The album's rows. Each carries her template's facets and its name in search (UT15, H70: "ironhide" finds every
 * Ironhide). */
export function albumRows(view: MasterView, world: TierWorld | null, seen: readonly string[] = [], now = new Date().toISOString(),
  scope: AlbumScope = TIER_ONE_SCOPE): RpgUmaRow[] {
  const known = new Set(seen)
  const available = world ? availableWorkers(world, now) : new Set<string>()
  return view.roster.flatMap(outfit => {
    const base = view.album.get(outfit.outfitId)!
    const uma = world?.umas[base.id] ?? null
    // An Uma lives in one world: another tier's Uma is in no list here, and only Tier 1 shows the locked catalogue.
    if (!uma && (scope.tier !== 1 || scope.elsewhere.has(base.id))) return []
    const busy = uma !== null && !available.has(base.id)
    const classId = uma ? activeClass(outfit, uma, scope.tier) : null
    const isNew = !known.has(base.id)
    const top = (grades: Record<string, string>) => Object.keys(grades).filter(k => grades[k] === 'A' || grades[k] === 'S')
    const template = umaTemplateFacets(outfit, uma ? umaPick(uma) : null)
    return [{
      id: base.id, name: base.name, releasedAt: base.releasedAt, level: uma?.level ?? null,
      free: uma !== null && !busy, workLevel: uma?.craft.level ?? null,
      search: `${base.name} ${base.title ?? ''} ${foldSearch(`${base.name} ${base.title ?? ''}`)} ${template.name}`.toLowerCase(),
      facets: { ownership: uma ? ['owned'] : ['locked'], rarity: [String(base.rarity)],
        surface: top(base.aptitudes.surface), distance: top(base.aptitudes.distance), strategy: top(base.aptitudes.strategy),
        sex: [outfit.realHorseSex ?? 'unknown'], new: isNew, free: uma !== null && !busy, class: classId ? [classId] : [], upgrade: false,
        calling: [template.calling], stride: [template.stride], knack: [template.knack],
        signature: [umaTemplate(outfit, uma ? umaPick(uma) : null).family], trade: [tradeOfCalling(template.calling)] },
      sorts: { level: uma?.level ?? null, release: base.releasedAt, name: base.name, rarity: base.rarity,
        statTotal: statTotal(outfit), craft: uma?.craft.level ?? null,
        classRank: uma ? Math.max(1, ...Object.values(uma.ranks.classes).map(track => track.rank)) : null },
      outfit, base, uma, classId, isNew, busy, upgrades: null,
    }]
  })
}

/** The kit sorts both ownership groups; the RPG keeps owned before locked even when direction flips (D146). `facets` is the
 * Stable's list unless a test names another. */
export function stableResult(rows: readonly RpgUmaRow[], query: AlbumQuery, facets: readonly FacetDef[] = STABLE_FACETS) {
  const result = runAlbumQuery(rows, facets, { ...query, search: foldSearch(query.search) }, [
    { key: 'release', direction: 'desc' }, { key: 'name', direction: 'asc' },
  ])
  const byId = new Map(rows.map(row => [row.id, row]))
  const ordered = result.rows.map(row => byId.get(row.id)!)
  return { ...result, rows: [...ordered.filter(row => row.uma), ...ordered.filter(row => !row.uma)] }
}

export const lockedReason = (row: RpgUmaRow): string | null => row.uma ? null : 'Locked'
