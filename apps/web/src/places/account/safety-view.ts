// The Account's safety copies in words (D260). A copy is whatever a device held, so nothing here trusts its shape.
import type { SafetyCopy } from '../../save/db'

/** "Oct 30, 9:15 AM". */
export const dateWords = (iso: string): string =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

const WHY: Readonly<Record<SafetyCopy['reason'], string>> = {
  replaced: 'Replaced by a newer save',
  restore: 'Before a restore',
  unreadable: 'Couldn’t be read here',
}

interface CopyShape { tierWorlds?: Record<string, { umas?: Record<string, { level?: unknown }> }> }

/** What a copy held: "29 Umas · best Lv 20", or "" when its shape can't say. */
export function copyContents(save: unknown): string {
  const worlds = Object.values((save as CopyShape | null)?.tierWorlds ?? {})
  const umas = worlds.flatMap((w) => Object.values(w?.umas ?? {}))
  if (umas.length === 0) return ''
  const best = Math.max(...umas.map((u) => (typeof u?.level === 'number' ? u.level : 0)))
  return `${umas.length} Uma${umas.length === 1 ? '' : 's'} · best Lv ${best}`
}

export interface SafetyRow { title: string; detail: string }
export const safetyRow = (copy: SafetyCopy): SafetyRow => ({
  title: dateWords(copy.at),
  detail: [WHY[copy.reason], copyContents(copy.save)].filter(Boolean).join(' · '),
})
