// The (i) button is uma-kit's (D147): screens stay clean; how a rule works lives behind it.
import { HelpButton as KitHelpButton } from '@luismlorenzana/uma-kit/ui'
import type { ReactNode } from 'react'

export function HelpButton({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return <KitHelpButton title={title} label={`How ${title.toLowerCase()} works`} className={className}>{children}</KitHelpButton>
}
