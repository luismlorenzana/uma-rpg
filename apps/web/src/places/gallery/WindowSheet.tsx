// Her Window sheet (D283, H155; collections.md §7.2): her window large and her board, six rows of five and the Rift, each
// row's share beside its name (CO36). A lit tile shows its day, a track's next tile what's left, the rest are dark; a tap
// opens a tile's line under the board, inline (G4: nothing opens over the sheet). A full window is ready to ascend, from
// the Gallery. Earlier tiers' full windows sit at the foot in their frames.
import { placeById, type OwnedUma, type RosterOutfit } from '@rpg/domain'
import { windowNext, windowOf, type WindowView } from '@rpg/domain/windows'
import { useState } from 'react'
import { useHubNavigation } from '../../hub/navigation'
import { useGame } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { GlassWindow } from './GlassWindow'
import { dayLabel, GALLERY_WORDS, nextLabel, stepLabel, TRACK_NAME, TRACK_SOURCE, windowCount } from './glass-view'

/** A full window's ring, by tier: day gold, dusk amber, night violet (the tiers' looks). */
export const TIER_FRAME: Readonly<Record<number, string>> = { 1: '#e8c25a', 2: '#c07a3a', 3: '#7a5ad0' }

/** `onReady` is the full window's door: the Gallery's Ascend from the Gallery, else the Gallery itself. */
export function WindowSheet({ outfit, uma, tier, onClose, onReady }: {
  outfit: RosterOutfit; uma: OwnedUma; tier: number; onClose: () => void; onReady?: () => void
}) {
  const save = useGame((s) => s.save)
  const nav = useHubNavigation()
  const [picked, setPicked] = useState<string | null>(null)
  if (!save) return null
  const view = windowOf(save, outfit.outfitId, tier)
  const next = new Map(windowNext(save, uma, outfit, outfit.outfitId, tier).map((n) => [`${n.track}-${n.numeral}`, n]))
  const selected = view.steps.find((s) => s.id === picked) ?? null
  const earlier = Array.from({ length: tier - 1 }, (_, i) => i + 1).map((t) => windowOf(save, outfit.outfitId, t)).filter((w) => w.full)
  const gallery = placeById('gallery')
  return (
    <BottomSheet title="Window" onClose={onClose}>
      <div className="space-y-3" data-window-sheet>
        <p className="text-[13px] text-ink-soft" data-window-count>Tier {tier} · {windowCount(view)}</p>
        <GlassWindow outfitId={outfit.outfitId} lit={view.lit} steps={view.total} size={232} className="mx-auto rounded-sm"
          label={`${outfit.name}, window ${view.percent}%`} />
        <Board view={view} tier={tier} next={next} picked={picked} onPick={(id) => setPicked(id === picked ? null : id)} />
        {selected && (
          <p className="rounded-sm bg-raised px-3 py-2 text-[13px]" data-window-line>
            <span className="font-semibold">{selected.rule}</span>
            <span className="block text-[12px] text-ink-soft">{TRACK_SOURCE[selected.track]}</span>
          </p>
        )}
        {view.full && tier < 3 && (
          <button type="button" onClick={onReady ?? (() => { onClose(); if (gallery) nav.open(gallery) })} data-window-ready
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-sm bg-success font-display font-bold text-white">
            {onReady ? 'Ready to ascend' : GALLERY_WORDS.ready}
          </button>
        )}
        {earlier.length > 0 && (
          <div className="flex gap-2" data-window-earlier>
            {earlier.map((w) => (
              <span key={w.tier} className="text-center text-[11px] text-ink-soft">
                <GlassWindow outfitId={outfit.outfitId} lit={w.total} steps={w.total} size={56} className="rounded-sm"
                  label={`Tier ${w.tier} window`} />
                <span className="mt-1 block" style={{ color: TIER_FRAME[w.tier] }}>Tier {w.tier}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </BottomSheet>
  )
}

/** Six rows of five tiles and the Rift tile; a row's share under its name. */
function Board({ view, tier, next, picked, onPick }: {
  view: WindowView; tier: number; next: ReadonlyMap<string, ReturnType<typeof windowNext>[number]>; picked: string | null; onPick: (id: string) => void
}) {
  const rows = view.tracks.filter((t) => t.track !== 'rift')
  const rift = view.steps.find((s) => s.id === 'rift')
  const tile = (step: WindowView['steps'][number], wide = false) => {
    const n = next.get(step.id)
    const state = step.day ? 'lit' : n ? 'next' : 'dark'
    return (
      <button key={step.id} type="button" onClick={() => onPick(step.id)} aria-pressed={picked === step.id} data-window-tile={step.id} data-state={state}
        className={`flex min-h-11 flex-col items-center justify-center rounded-[7px] px-0.5 text-center text-[10px] leading-tight font-semibold ${wide ? 'col-span-5' : ''}
          ${state === 'lit' ? 'bg-accent-wash text-ink ring-1 ring-accent' : state === 'next' ? 'bg-raised text-ink ring-1 ring-hairline-strong' : 'bg-sunken text-ink-faint'}
          ${picked === step.id ? 'ring-2 ring-info' : ''}`}>
        <span>{stepLabel(step, tier)}</span>
        {step.day && <span className="font-normal text-ink-soft">{dayLabel(step.day)}</span>}
        {!step.day && n && <span className="font-normal text-ink-soft">{nextLabel(n)}</span>}
      </button>
    )
  }
  return (
    <div className="grid grid-cols-[44px_repeat(5,minmax(0,1fr))] gap-1" data-window-board>
      {rows.map((row) => (
        <div key={row.track} className="contents">
          <span className="self-center text-[10px] leading-tight text-ink-faint">
            {TRACK_NAME[row.track]}<b className="block text-ink">{row.percent}%</b>
          </span>
          {view.steps.filter((s) => s.track === row.track).map((s) => tile(s))}
        </div>
      ))}
      {rift && (
        <div className="contents">
          <span className="self-center text-[10px] text-ink-faint">Rift</span>
          {tile(rift, true)}
        </div>
      )}
    </div>
  )
}
