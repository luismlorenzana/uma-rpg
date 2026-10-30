// The promotion sheet: the owner's "class promotion screen" (D240 CV8, classes-v3.md §14.2; H137, D253). A Tier 0 at Class
// Rank 10: her children as tiles (Suggested on one, Held on one she holds; each its slots, three defaults and role where
// they differ), before → after in one line ("Warrior R10 → Brawler R10", "Depths 1–2 · 6 skills · +400 EXP"), one footer
// "Promote to …" (free, no confirm), and a "Classes ›" row that swaps back to the Classes sheet. Standalone (props in): the
// caller closes it after Promote and owns the swap. The model is `class-view.ts`.
import { SaveRuleError, type BattleOutfit, type OwnedUma, type RpgTier0Class, type RpgTier1Class } from '@rpg/domain'
import { useState } from 'react'
import { WEAPON_LABEL, WeaponGlyph } from '../../battle/labels'
import { ClassEmblem } from '../../battle/pixel-icons'
import { pickClass, promoteClass } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { promotionSheet, type PromotionTileView } from './class-view'

export function PromotionSheet({ outfit, uma, tier, from, child = null, onClose, onClasses, onPromoted }: {
  outfit: BattleOutfit
  uma: OwnedUma
  tier: number
  /** The Tier 0 at Rank 10 she promotes from (`promotionFrom`). */
  from: RpgTier0Class
  /** The child to open on (a Ready tile's); else the Suggested one. */
  child?: RpgTier1Class | null
  onClose: () => void
  /** "Classes ›": the caller closes this sheet and opens the Classes sheet. */
  onClasses: () => void
  /** After Promote: she fights as the child; the caller closes the sheet and shows its first tree. */
  onPromoted: (to: RpgTier1Class) => void
}) {
  const [selected, setSelected] = useState<RpgTier1Class | null>(child)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const view = promotionSheet(outfit, uma, tier, from, selected)
  const pick = view.selected
  const { footer } = view
  const act = () => {
    setBusy(true)
    setError(null)
    const done = footer.act === 'promote' ? promoteClass(outfit.outfitId, from, pick.classId).then(() => onPromoted(pick.classId))
      : pickClass(outfit.outfitId, pick.classId).then(() => setSelected(pick.classId))
    done.catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.')).finally(() => setBusy(false))
  }
  return (
    <BottomSheet title={view.title} onClose={onClose} footer={
      <button type="button" disabled={!footer.act || !!footer.block || busy} onClick={act} data-promotion-footer
        className={`min-h-12 w-full rounded-sm px-3 font-display font-bold ${footer.act && !footer.block ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'}`}>
        {footer.label}
      </button>
    }>
      <div className="space-y-2.5" data-promotion-sheet>
        <p className="text-[12.5px] text-ink-soft">{view.caption}</p>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${view.tiles.length}, minmax(0, 1fr))` }} role="radiogroup" aria-label="Her class">
          {view.tiles.map((t) => <Tile key={t.classId} tile={t} selected={t.classId === pick.classId} onSelect={() => setSelected(t.classId)} />)}
        </div>
        <div className="text-center" data-promotion-plan aria-live="polite">
          {/* Each side keeps its class and rank together: a long name wraps after the arrow, never before its rank. */}
          <p className="font-display text-[22px] font-extrabold leading-tight">
            {view.before.split(' → ').map((side, i) => <span key={side}>{i > 0 && ' → '}<span className="whitespace-nowrap">{side}</span></span>)}
          </p>
          {view.after && <p className="text-[12.5px] text-ink-soft">{view.after}</p>}
          {footer.block && <p className="text-[12.5px] font-semibold text-warning">{footer.block}</p>}
        </div>
        <button type="button" onClick={onClasses} data-classes-row
          className="flex min-h-11 w-full items-center justify-between gap-2 rounded-sm bg-raised px-3 text-left">
          <span className="text-[14px] font-semibold">Classes</span>
          <span className="text-ink-faint">›</span>
        </button>
        {error && <p className="text-[13px] text-danger">{error}</p>}
      </div>
    </BottomSheet>
  )
}

/** One child: emblem and name, Suggested or Held, then the rows that differ between siblings. */
function Tile({ tile, selected, onSelect }: { tile: PromotionTileView; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={onSelect} data-promotion-tile={tile.classId}
      aria-label={`${tile.name}${tile.badge ? `, ${tile.badge}` : ''}`}
      className={`flex min-h-24 min-w-0 flex-col items-start gap-1 rounded-sm bg-raised p-2 text-left ${selected ? 'ring-2 ring-accent' : ''}`}>
      <span className="flex min-w-0 items-start gap-1.5">
        <span className="shrink-0 pt-0.5"><ClassEmblem classId={tile.classId} /></span>
        <span className="min-w-0 text-[12.5px] font-semibold leading-tight">{tile.name}</span>
      </span>
      {tile.badge && <span className={`text-[11px] font-bold ${tile.badge === 'Suggested' ? 'text-accent' : 'text-ink-faint'}`}>{tile.badge}</span>}
      {tile.slots && <span className="text-[11px] text-ink-soft">{tile.slots}</span>}
      <span className="flex gap-1" title={tile.weapons.map((w) => WEAPON_LABEL[w]).join(', ')}>
        {tile.weapons.map((w) => <WeaponGlyph key={w} weapon={w} size={16} />)}
      </span>
      {tile.role && <span className="text-[11px] leading-tight text-ink-soft">{tile.role}</span>}
    </button>
  )
}
