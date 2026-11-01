// The chart's crests, vector stand-ins until uma-art 2.19.0 (H141) draws them as pixel art: H144 swaps this file's insides for
// `PixelIcon` frames, so nothing that draws one changes.
import type { MapBody } from '@rpg/domain'
import type { ReactNode } from 'react'

const CREST: Readonly<Record<MapBody, ReactNode>> = {
  planet: <><circle cx="12" cy="12" r="6.6" /><ellipse cx="12" cy="12" rx="11" ry="3.5" transform="rotate(-24 12 12)" fill="none" stroke="currentColor" strokeWidth="1.6" /></>,
  prowess: <><path d="M12 1 14.6 4.6V15H9.4V4.6Z" /><rect x="6" y="15" width="12" height="2.2" rx="1.1" /><rect x="11" y="17.2" width="2" height="3.8" /><circle cx="12" cy="22" r="1.5" /><path d="m19.5 3 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6L16 6.5l2.6-.9Z" /></>,
  vigor: <path d="M12 21.5C5.3 16.3 2 12.7 2 8.6A5.2 5.2 0 0 1 12 6.5a5.2 5.2 0 0 1 10 2.1c0 4.1-3.3 7.7-10 12.9Z" />,
  guard: <path d="M12 1.8 20.8 5v6.8c0 4.9-3.7 8.5-8.8 10.4-5.1-1.9-8.8-5.5-8.8-10.4V5Z" />,
  template: <><path d="M15.5 2.2a10 10 0 1 0 6.3 16.1A8.3 8.3 0 0 1 15.5 2.2Z" /><path d="m17.5 6.5.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" /></>,
}

/** A body's 24 px crest, in its color. Decorative: its button names it. */
export function StarCrest({ body, color }: { body: MapBody; color: string }) {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" style={{ color }}>{CREST[body]}</svg>
}
