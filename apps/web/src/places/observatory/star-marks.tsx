// The chart's crests and the stat marks, vector stand-ins until uma-art 2.19.0 (H141) draws them as pixel art: H144 swaps this
// file's insides for `PixelIcon` frames, so nothing that draws one changes.
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

const SHIELD = 'M8 1 14 3.2v4.6c0 3.3-2.5 5.8-6 7.2-3.5-1.4-6-3.9-6-7.2V3.2Z'
const STAT: Readonly<Record<StatMarkId, ReactNode>> = {
  hp: <path d="M8 14.3C3.4 10.8 1.3 8.3 1.3 5.6A3.5 3.5 0 0 1 8 4.3a3.5 3.5 0 0 1 6.7 1.3c0 2.7-2.1 5.2-6.7 8.7Z" />,
  mp: <path d="M8 1.2S3 7 3 10.2a5 5 0 0 0 10 0C13 7 8 1.2 8 1.2Z" />,
  atk: <g transform="rotate(45 8 8)"><path d="M8 .3 9.8 3v7.5H6.2V3Z" /><rect x="3.8" y="10.5" width="8.4" height="1.7" rx=".8" /><rect x="7.2" y="12.2" width="1.6" height="3" /></g>,
  matk: <path d="m8 .8 1.9 5.3L15.2 8l-5.3 1.9L8 15.2l-1.9-5.3L.8 8l5.3-1.9Z" />,
  def: <path d={SHIELD} />,
  mdef: <path fillRule="evenodd" d={`${SHIELD}m0 2.8L6.9 6.9 3.8 8l3.1 1.1L8 12.2l1.1-3.1L12.2 8 9.1 6.9Z`} />,
  evasion: <path d="M1 12.5C5 12 9 9 10.5 2c1 1.8 1.5 3.3 1.5 4.8 1-.5 2-.7 3-.7-.5 3.8-3.5 7.4-14 6.4Z" />,
  limit: <path d="m8 .6 1.4 3.9 3.6-1.8-1.8 3.6L15.1 8l-3.9 1.4 1.8 3.6-3.6-1.8L8 15.1l-1.4-3.9-3.6 1.8 1.8-3.6L.9 8l3.9-1.4L3 3l3.6 1.8Z" />,
}
export type StatMarkId = 'hp' | 'mp' | 'atk' | 'matk' | 'def' | 'mdef' | 'evasion' | 'limit'

/** A stat's 16 px mark, in the text's color. Decorative: its label stays beside it. */
export function StatMark({ stat, className = '' }: { stat: StatMarkId; className?: string }) {
  return <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true" className={`shrink-0 ${className}`} data-stat-mark={stat}>{STAT[stat]}</svg>
}
