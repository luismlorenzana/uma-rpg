// A small (i) button that opens a sheet of help. Screens stay clean; how a rule works lives behind the button.
import { useState, type ReactNode } from 'react'
import { BottomSheet } from './BottomSheet'
import { InfoIcon } from './icons'

export function HelpButton({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={(e) => { e.stopPropagation(); setOpen(true) }} aria-label={`How ${title.toLowerCase()} works`}
        className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink-faint active:text-ink ${className}`}>
        <InfoIcon size={18} />
      </button>
      {open && (
        <BottomSheet title={title} onClose={() => setOpen(false)}>
          <div className="space-y-2 text-[14px] leading-snug text-ink-soft">{children}</div>
        </BottomSheet>
      )}
    </>
  )
}
