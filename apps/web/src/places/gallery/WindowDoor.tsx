// Her window beside her bust (D283 note 2, H155; collections.md §7.1, CO35): the window at her tier's share lit, the
// share on its corner, and a tap opens her Window sheet (G3). From save v35.
import type { OwnedUma, RosterOutfit } from '@rpg/domain'
import { windowOf } from '@rpg/domain/windows'
import { useState } from 'react'
import { useGame } from '../../save/game'
import { GlassWindow } from './GlassWindow'
import { WindowSheet } from './WindowSheet'

export function WindowDoor({ outfit, uma, tier }: { outfit: RosterOutfit; uma: OwnedUma; tier: number }) {
  const save = useGame((s) => s.save)
  const [open, setOpen] = useState(false)
  if (!save) return null
  const view = windowOf(save, outfit.outfitId, tier)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Window, ${view.percent}%`} className="relative block size-full" data-window-door>
        <GlassWindow outfitId={outfit.outfitId} lit={view.lit} steps={view.total} size={64} />
        <span className="absolute right-0.5 bottom-0.5 rounded-full bg-scrim/70 px-1 text-[10px] leading-[14px] font-semibold text-ink-on-dark">{view.percent}%</span>
      </button>
      {open && <WindowSheet outfit={outfit} uma={uma} tier={tier} onClose={() => setOpen(false)} />}
    </>
  )
}
