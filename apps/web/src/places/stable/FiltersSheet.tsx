import { EMPTY_FACETS, KEY_LABELS, type RosterFacets } from '@rpg/domain'
import { BottomSheet } from '../../ui/BottomSheet'

type ArrayFacet = 'rarity' | 'surface' | 'distance' | 'strategy' | 'sex'

const GROUPS: { facet: ArrayFacet; title: string; options: { value: string | number; label: string }[] }[] = [
  { facet: 'rarity', title: 'Rarity', options: [1, 2, 3].map((r) => ({ value: r, label: '★'.repeat(r) })) },
  { facet: 'surface', title: 'Surface · A or better', options: ['turf', 'dirt'].map((k) => ({ value: k, label: KEY_LABELS[k] ?? k })) },
  { facet: 'distance', title: 'Distance · A or better', options: ['sprint', 'mile', 'medium', 'long'].map((k) => ({ value: k, label: KEY_LABELS[k] ?? k })) },
  { facet: 'strategy', title: 'Running style · A or better', options: ['front', 'pace', 'late', 'end'].map((k) => ({ value: k, label: KEY_LABELS[k] ?? k })) },
  { facet: 'sex', title: 'Real horse', options: [{ value: 'female', label: 'Mare' }, { value: 'male', label: 'Stallion' }, { value: 'unknown', label: 'Unknown' }] },
]

function Chip({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className={`min-h-10 rounded-full px-3.5 text-[13px] font-semibold ${on ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'}`}>
      {label}
    </button>
  )
}

export function FiltersSheet({ facets, onChange, onClose, resultCount }: { facets: RosterFacets; onChange: (f: RosterFacets) => void; onClose: () => void; resultCount: number }) {
  const toggle = (facet: ArrayFacet, value: string | number) => {
    const list = facets[facet] as (string | number)[]
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    onChange({ ...facets, [facet]: next } as RosterFacets)
  }
  return (
    <BottomSheet
      title="Filters"
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <button type="button" onClick={() => onChange(EMPTY_FACETS)} className="min-h-12 flex-1 rounded-sm border border-hairline-strong font-semibold text-ink-soft">
            Clear all
          </button>
          <button type="button" onClick={onClose} className="min-h-12 flex-[2] rounded-sm bg-accent font-display font-bold text-accent-ink">
            Show {resultCount}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {GROUPS.map((g) => (
          <section key={g.facet}>
            <h3 className="text-micro mb-2">{g.title}</h3>
            <div className="flex flex-wrap gap-2">
              {g.options.map((o) => (
                <Chip key={String(o.value)} label={o.label} on={(facets[g.facet] as (string | number)[]).includes(o.value)} onClick={() => toggle(g.facet, o.value)} />
              ))}
            </div>
          </section>
        ))}
        <section>
          <h3 className="text-micro mb-2">Collection</h3>
          <Chip label="New to you (24 h)" on={facets.newOnly} onClick={() => onChange({ ...facets, newOnly: !facets.newOnly })} />
        </section>
      </div>
    </BottomSheet>
  )
}
