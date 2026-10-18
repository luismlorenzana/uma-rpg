import { UmaPicker, type UmaPickerProps, type UmaPickerRow } from '@luismlorenzana/uma-kit/album'
import { formatLevel } from '@luismlorenzana/uma-kit/roster'
import { useRef } from 'react'

/** The kit closes after a choice. In an RPG multi-step flow that means advance, not cancel the whole flow. */
export function PickerStep<T extends UmaPickerRow>({ onPick, onClose, ...props }: Omit<UmaPickerProps<T>, 'open' | 'onPick' | 'onClose'> & {
  onPick: (id: string) => void
  onClose: () => void
}) {
  const advancing = useRef(false)
  return <UmaPicker {...props} open describe={props.describe ?? (row => formatLevel(row.level))}
    onPick={ids => { if (ids[0]) { advancing.current = true; onPick(ids[0]) } }}
    onClose={() => {
      if (advancing.current) advancing.current = false
      else onClose()
    }} />
}
