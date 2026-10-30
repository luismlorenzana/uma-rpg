// This device's safety copies (D260): each a save kept before something replaced it, with its Restore. Nothing shows until
// there is one. Restoring keeps today's save as a copy too, so it can be undone.
import { useEffect, useState } from 'react'
import { safetyCopies, type SafetyCopy } from '../../save/db'
import { restoreSafetyCopy, seeReplaced, useGame } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { safetyRow } from './safety-view'

export function SafetyCopies() {
  const uid = useGame((s) => s.uid)
  const [copies, setCopies] = useState<SafetyCopy[]>([])
  const [open, setOpen] = useState<SafetyCopy | null>(null)
  const [failed, setFailed] = useState(false)
  const reload = () => { if (uid) void safetyCopies(uid).then(setCopies) }
  useEffect(reload, [uid])
  useEffect(() => seeReplaced(), [])
  if (copies.length === 0) return null
  const close = () => { setOpen(null); setFailed(false) }
  const restore = async (copy: SafetyCopy) => {
    if (copy.id === undefined || !(await restoreSafetyCopy(copy.id))) { setFailed(true); return }
    close()
    reload()
  }
  return (
    <section className="space-y-1.5" data-safety-copies>
      <p className="text-micro">Safety copies</p>
      {copies.map((copy) => {
        const row = safetyRow(copy)
        return (
          <button key={copy.id} type="button" onClick={() => setOpen(copy)} className="flex min-h-12 w-full items-center justify-between gap-3 rounded-md bg-raised px-3 py-2 text-left">
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold">{row.title}</span>
              <span className="block text-[12px] text-ink-soft">{row.detail}</span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-[13px] text-ink-soft">Restore <span aria-hidden className="text-ink-faint">›</span></span>
          </button>
        )
      })}
      {open && (
        <BottomSheet title="Restore this save?" onClose={close} footer={
          <button type="button" onClick={() => void restore(open)} className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink">Restore</button>
        }>
          <p className="text-[14px] font-semibold">{safetyRow(open).title}</p>
          <p className="text-[13px] text-ink-soft">{safetyRow(open).detail}</p>
          <p className="mt-2 text-[13px] text-ink-soft">Your current save becomes a safety copy.</p>
          {failed && <p className="mt-2 rounded-sm bg-danger/15 p-2 text-[13px] text-danger">This copy can’t be restored.</p>}
        </BottomSheet>
      )}
    </section>
  )
}
