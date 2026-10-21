// This game's adapter from uma-kit's shared release client to the RPG's MasterView (SE3).
// Only the small sets load up front; the 2.5 MB skill set loads when a profile first needs it.
import { buildChapters, buildRoster, type ChapterInfo, type RosterOutfit } from '@rpg/domain'
import type { ArtIndex, ReleaseManifest, Skill } from '@luismlorenzana/uma-data'
import { outfitRowBase, type OutfitRowBase } from '@luismlorenzana/uma-kit/roster'
import { useSyncExternalStore } from 'react'
import { CONTENT } from '../content/client'

export interface MasterView {
  manifest: ReleaseManifest
  roster: RosterOutfit[]
  album: ReadonlyMap<string, OutfitRowBase>
  chapters: ChapterInfo[]
  art: ArtIndex | null
}

export type MasterState =
  | { status: 'idle' | 'loading' }
  | { status: 'ready'; view: MasterView }
  | { status: 'error'; offline: boolean; message: string }

let state: MasterState = { status: 'idle' }
const listeners = new Set<() => void>()
let skillsPromise: Promise<Map<number, Skill>> | null = null

function set(next: MasterState): void {
  state = next
  for (const listener of listeners) listener()
}

function loadMaster(): void {
  if (state.status === 'loading' || state.status === 'ready') return
  set({ status: 'loading' })
  void (async () => {
    try {
      const [c, manifest] = await Promise.all([CONTENT.release(), CONTENT.manifest()])
      const [characters, outfits, scenarios, art] = await Promise.all([
        c.set(manifest, 'characters'),
        c.set(manifest, 'outfits'),
        c.set(manifest, 'scenarios'),
        c.art(manifest),
      ])
      const byCharacter = new Map(characters.map(c => [c.id, c]))
      const album = new Map(outfits.map(o => [String(o.id), outfitRowBase(o, byCharacter.get(o.characterId))]))
      set({ status: 'ready', view: { manifest, roster: buildRoster({ characters, outfits }), album, chapters: buildChapters(scenarios), art } })
    } catch (err) {
      const offline = typeof navigator !== 'undefined' && navigator.onLine === false
      set({ status: 'error', offline, message: err instanceof Error ? err.message : String(err) })
    }
  })()
}

/** The skill set, by id. Loaded on first use and kept for the session. */
export function loadSkills(manifest: ReleaseManifest): Promise<Map<number, Skill>> {
  skillsPromise ??= CONTENT.release()
    .then((c) => c.set(manifest, 'skills'))
    .then((skills) => new Map(skills.map((s) => [s.id, s])))
  skillsPromise.catch(() => {
    skillsPromise = null
  })
  return skillsPromise
}

export function useMaster(): MasterState {
  const snapshot = useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => state,
    () => state,
  )
  if (snapshot.status === 'idle') queueMicrotask(loadMaster)
  return snapshot
}

/** Retries a failed load (for example after coming back online). */
export function retryMaster(): void {
  if (state.status === 'error') {
    CONTENT.refresh()
    set({ status: 'idle' })
    loadMaster()
  }
}
