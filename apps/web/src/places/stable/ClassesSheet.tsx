// The Classes sheet: Classes v3's class tree, the reclass view (D240 CV32, classes-v3.md §14.1; H137, D253). Three root
// columns, Warrior · All-Rounder · Mage, the Tier 0 row over the Tier 1 rows, every tile in the state language (On, Held,
// Ready, Open, Closed) with its rank; a tap selects (2 px ring) and the footer acts on the selection: Fight as, Start …
// · R1, Promote to … (the caller swaps this sheet for the promotion sheet: never a sheet on a sheet), or the closed gate.
// "Class Manuals ›" is a door to the Exchange's Manual sheet with her picked; its Back reopens this sheet. Standalone (props
// in, no knowledge of the tab around it): today's Skills tab opens it from v19; H120 places it in profile v2's Class tab.
// The model is `class-view.ts`.
import { SaveRuleError, type BattleOutfit, type OwnedUma, type RpgClass, type RpgClassTileState, type RpgTier1Class, type TierWorld } from '@rpg/domain'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { WEAPON_LABEL, WeaponGlyph } from '../../battle/labels'
import { ClassEmblem } from '../../battle/pixel-icons'
import { pickClass } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { classesSheet, type ClassGrid, type ClassLine, type ClassTileView } from './class-view'

/** The navigation state the profile's entry carries while the Manuals door is open (H120 decision 6). */
interface ReturnState { sheet?: 'classes' }
/** The Exchange's Manual sheet on her (H132's route). */
export const manualsPath = (outfitId: string): string => `/town/exchange/manual/${encodeURIComponent(outfitId)}`

/** The Manuals door (UP30; H120 decisions 5–6): replaces this entry with its state plus `sheet: 'classes'`, then pushes the
 * Exchange's Manual sheet on her with `{ back: true }`, so the Exchange's Back pops to here with the Classes sheet open. */
export function useManualsDoor(outfitId: string): () => void {
  const navigate = useNavigate()
  const location = useLocation()
  return () => {
    const here = `${location.pathname}${location.search}${location.hash}`
    const state = { ...(location.state as object | null ?? {}), sheet: 'classes' } satisfies ReturnState
    // A data router's navigate resolves once the entry is replaced; a memory router's returns at once.
    void Promise.resolve(navigate(here, { replace: true, state })).then(() => navigate(manualsPath(outfitId), { state: { back: true } }))
  }
}
/** Whether this entry asks for the Classes sheet (Back from the Manuals door). Read once on mount; the entry's `sheet` is then
 * replaced away, so a later visit opens the tab as usual. */
export function useClassesReturn(): boolean {
  const navigate = useNavigate()
  const location = useLocation()
  const [asked] = useState(() => (location.state as ReturnState | null)?.sheet === 'classes')
  useEffect(() => {
    if (!asked) return
    const rest: Record<string, unknown> = { ...(location.state as Record<string, unknown>) }
    delete rest.sheet
    navigate(`${location.pathname}${location.search}${location.hash}`, { replace: true, state: rest })
    // Once, on mount: the entry is read as it arrived.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return asked
}

/** One look a state (profile v2's §7.4): On the accent fill, Held raised, Ready raised with the green dot, Open a dashed
 * outline, Closed at 40%. */
const LOOK: Readonly<Record<RpgClassTileState, string>> = {
  on: 'bg-accent text-accent-ink',
  available: 'bg-raised text-ink',
  ready: 'bg-raised text-ink',
  open: 'border border-dashed border-hairline-strong text-ink',
  closed: 'bg-raised text-ink opacity-40',
}
const WORD_TONE: Readonly<Record<RpgClassTileState, string>> = {
  on: 'text-accent-ink/80', available: 'text-ink-soft', ready: 'font-semibold text-success', open: 'text-ink-soft', closed: 'text-ink-faint',
}

export function ClassesSheet({ outfit, uma, world, tier, outfits, onClose, onPromote, onSwitch }: {
  outfit: BattleOutfit
  uma: OwnedUma
  world: TierWorld
  tier: number
  /** Her world's outfits, for the healer note (none: no note). */
  outfits?: ReadonlyMap<string, BattleOutfit>
  onClose: () => void
  /** Promote to … on a Ready tile: the caller closes this sheet and opens the promotion sheet on that child. */
  onPromote: (child: RpgTier1Class) => void
  /** After Fight as or Start: she fights as it; the sheet stays open on its new state. */
  onSwitch?: (classId: RpgClass) => void
}) {
  const [selected, setSelected] = useState<RpgClass | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const door = useManualsDoor(outfit.outfitId)
  const view = classesSheet(outfit, uma, world, tier, selected, outfits)
  const { footer } = view
  const pick = view.selected
  const act = () => {
    if (footer.act === 'promote') return onPromote(pick.classId as RpgTier1Class)
    setBusy(true)
    setError(null)
    pickClass(outfit.outfitId, pick.classId).then(() => {
      setSelected(pick.classId)
      onSwitch?.(pick.classId)
    }, (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.')).finally(() => setBusy(false))
  }
  return (
    <BottomSheet title="Classes" onClose={onClose} footer={
      <button type="button" disabled={!footer.act || busy} onClick={act} data-classes-footer
        className={`min-h-12 w-full rounded-sm px-3 font-display font-bold ${footer.act ? 'bg-accent text-accent-ink' : 'bg-raised text-[14px] text-ink-soft'}`}>
        {footer.label}
      </button>
    }>
      <div className="space-y-1.5" data-classes-sheet>
        <Tree grid={view.grid} selected={pick.classId} onSelect={setSelected} />
        <Selection line={view.line} />
        <button type="button" onClick={door} data-manuals-door
          className="flex min-h-11 w-full items-center justify-between gap-2 rounded-sm bg-raised px-3 text-left">
          <span className="text-[14px] font-semibold">Class Manuals</span>
          <span className="text-[12.5px] text-ink-faint">Exchange ›</span>
        </button>
        {error && <p className="text-[13px] text-danger">{error}</p>}
      </div>
    </BottomSheet>
  )
}

/** The tree: the roots over their columns, then each row with its label; a cell with no class is left empty. */
function Tree({ grid, selected, onSelect }: { grid: ClassGrid; selected: RpgClass; onSelect: (classId: RpgClass) => void }) {
  const columns = { gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))` }
  return (
    <div className="space-y-1" role="radiogroup" aria-label="Classes">
      {grid.roots && (
        <div className="grid gap-1" style={columns} aria-hidden>
          {grid.roots.map((r) => (
            <span key={r.name} style={{ gridColumn: `span ${r.span}` }}
              className="truncate rounded-xs bg-sunken py-0.5 text-center text-[11px] font-bold uppercase tracking-[0.04em] text-ink-faint">{r.name}</span>
          ))}
        </div>
      )}
      {grid.rows.map((row, i) => (
        <div key={i} className="space-y-0.5">
          {row.label && <p className="px-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-faint">{row.label}</p>}
          <div className="grid gap-1" style={columns}>
            {row.cells.map((tile, j) => (tile
              ? <Tile key={tile.classId} tile={tile} selected={tile.classId === selected} onSelect={() => onSelect(tile.classId)} />
              : <span key={`empty-${j}`} aria-hidden />))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Tile({ tile, selected, onSelect }: { tile: ClassTileView; selected: boolean; onSelect: () => void }) {
  return (
    // The ring sits on the button and the state's look on the face inside, so a Closed tile fades and its ring doesn't.
    <button type="button" role="radio" aria-checked={selected} onClick={onSelect} data-class-tile={tile.classId} data-state={tile.state}
      aria-label={`${tile.name}, ${tile.word}${tile.suggested ? ', Suggested' : ''}`}
      className={`relative flex min-w-0 rounded-sm ${selected ? 'ring-2 ring-accent ring-offset-1 ring-offset-panel' : ''}`}>
      <span className={`flex min-h-[60px] w-full min-w-0 flex-col items-center justify-center gap-0.5 rounded-sm px-0.5 py-1 text-center ${LOOK[tile.state]}`}>
        <ClassEmblem classId={tile.classId} />
        <span className="text-[11px] font-semibold leading-tight">{tile.name}</span>
        <span className={`text-[11px] leading-tight ${WORD_TONE[tile.state]}`}>{tile.word}</span>
      </span>
      {tile.state === 'ready' && <span aria-hidden className="absolute right-1 top-1 size-1.5 rounded-full bg-success" />}
    </button>
  )
}

/** The selection's line: its name and state, slots and role, its three defaults, its hand, the healer note. */
function Selection({ line }: { line: ClassLine }) {
  return (
    <div className="space-y-0.5 rounded-sm bg-raised px-3 py-1.5" data-class-line aria-live="polite">
      <p className="text-[14px] font-semibold">{line.title}</p>
      {line.facts.map((f) => <p key={f} className="text-[12.5px] text-ink-soft">{f}</p>)}
      {line.weapons.length > 0 && (
        <p className="flex flex-wrap gap-x-2.5 text-[12.5px] text-ink-soft">
          {line.weapons.map((w) => <span key={w} className="inline-flex items-center gap-1"><WeaponGlyph weapon={w} size={14} />{WEAPON_LABEL[w]}</span>)}
        </p>
      )}
      <p className="text-[12.5px] text-ink-faint">{line.hand}</p>
      {line.healer && <p className="text-[12.5px] font-semibold text-warning">{line.healer}</p>}
    </div>
  )
}
