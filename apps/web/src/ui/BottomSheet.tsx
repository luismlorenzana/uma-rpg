// uma-rpg's bottom sheet is uma-kit's (D147): this keeps the call sites' shape, mounted while open, with a title and an
// optional footer. The kit's sheet adds the drag handle, the spring and stacking through a portal.
import { Sheet } from '@luismlorenzana/uma-kit/ui'
import type { ReactNode } from 'react'

export function BottomSheet({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  return <Sheet open onClose={onClose} title={title} footer={footer}>{children}</Sheet>
}
