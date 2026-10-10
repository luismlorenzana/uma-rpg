// What one sync round should do, as a pure decision (D32): adopt the server's save, push ours, or nothing.
import { resolveConflict, type Save, type SaveEnvelope } from '@rpg/domain'

export interface LocalState {
  revision: number
  save: Save | null
  dirty: boolean
}

export type SyncStep =
  | { kind: 'adopt'; envelope: SaveEnvelope & { save: Save } }
  | { kind: 'push'; baseRevision: number; save: Save }
  | { kind: 'none' }

export function reconcile(local: LocalState, remote: SaveEnvelope): SyncStep {
  if (!remote.save) return local.save ? { kind: 'push', baseRevision: remote.revision, save: local.save } : { kind: 'none' }
  const remoteEnvelope = { revision: remote.revision, save: remote.save }
  if (!local.save) return { kind: 'adopt', envelope: remoteEnvelope }
  if (!local.dirty) return remote.revision > local.revision ? { kind: 'adopt', envelope: remoteEnvelope } : { kind: 'none' }
  if (remote.revision === local.revision) return { kind: 'push', baseRevision: local.revision, save: local.save }
  // The server moved on while this device had edits: the most recently changed save wins whole.
  return resolveConflict(local.save, remote.save) === local.save
    ? { kind: 'push', baseRevision: remote.revision, save: local.save }
    : { kind: 'adopt', envelope: remoteEnvelope }
}
