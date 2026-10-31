// A door out of an open sheet (H120 decisions 5–6): before pushing, the profile's entry takes `sheet` in its state, so Back
// lands on the same tab with that sheet open, and the entry's request is then read once and replaced away.
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

/** The Class tab's sheets a door can return to. */
export type ReturnSheet = 'classes' | 'limit'
interface ReturnState { sheet?: ReturnSheet }

/** Replaces this entry with its state plus `sheet`, then pushes `to` with `{ back: true }`. */
export function useSheetDoor(sheet: ReturnSheet): (to: string) => void {
  const navigate = useNavigate()
  const location = useLocation()
  return (to) => {
    const here = `${location.pathname}${location.search}${location.hash}`
    const state = { ...(location.state as object | null ?? {}), sheet } satisfies ReturnState
    // A data router's navigate resolves once the entry is replaced; a memory router's returns at once.
    void Promise.resolve(navigate(here, { replace: true, state })).then(() => navigate(to, { state: { back: true } }))
  }
}

/** The sheet this entry asks for (Back from a door), read once on mount; the request is then replaced away, so a later visit
 * opens the tab as usual. */
export function useSheetReturn(): ReturnSheet | null {
  const navigate = useNavigate()
  const location = useLocation()
  const [asked] = useState(() => (location.state as ReturnState | null)?.sheet ?? null)
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
