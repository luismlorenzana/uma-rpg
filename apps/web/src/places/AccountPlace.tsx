// The Account (S1): trainer name, tier world, wallet, versions and sign-out. A hidden Town place (D31).
import { TRAINER_NAME_MAX, normalizeTrainerName } from '@rpg/domain'
import { useState } from 'react'
import { APP_BUILD_ID } from '../app/build'
import { useAppUpdate } from '../app/UpdateNotice'
import { appUpdateLifecycle } from '../app/update-lifecycle'
import { useAuth } from '../auth/AuthProvider'
import { useMaster } from '../master/master'
import { renameAccount, resetGame, useGame } from '../save/game'
import { LaurelIcon, ShardIcon, TicketIcon } from '../ui/icons'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-hairline py-2.5 text-[14px] last:border-0">
      <span className="text-ink-soft">{label}</span>
      <span className="text-right font-semibold">{children}</span>
    </div>
  )
}

export default function AccountPlace() {
  const save = useGame((s) => s.save)
  const sync = useGame((s) => s.sync)
  const lastSyncedAt = useGame((s) => s.lastSyncedAt)
  const master = useMaster()
  const update = useAppUpdate()
  const auth = useAuth()
  const [name, setName] = useState(save?.account.trainerName ?? '')
  const [saved, setSaved] = useState(false)
  if (!save) return null
  const wallet = save.tierWorlds['1']?.wallet
  const valid = normalizeTrainerName(name) !== null
  const changed = normalizeTrainerName(name) !== save.account.trainerName
  return (
    <div className="space-y-5 p-4">
      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!valid || !changed) return
          void renameAccount(name).then(() => {
            setName(normalizeTrainerName(name) ?? name)
            setSaved(true)
          })
        }}
      >
        <label htmlFor="trainer-name" className="text-micro">
          Trainer name
        </label>
        <div className="flex gap-2">
          <input
            id="trainer-name"
            value={name}
            maxLength={TRAINER_NAME_MAX + 8}
            onChange={(e) => {
              setName(e.target.value)
              setSaved(false)
            }}
            className="min-h-11 min-w-0 flex-1 rounded-sm bg-sunken px-3 text-ink outline-none ring-accent focus:ring-2"
            aria-invalid={!valid}
          />
          <button type="submit" disabled={!valid || !changed} className="min-h-11 rounded-sm bg-accent px-4 font-display font-bold text-accent-ink disabled:opacity-40">
            Save
          </button>
        </div>
        <p className="text-[12px] text-ink-faint">{!valid ? `1–${TRAINER_NAME_MAX} characters.` : saved ? 'Saved.' : ' '}</p>
      </form>

      <section>
        <h3 className="text-micro mb-1">Tier 1 wallet</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <TicketIcon size={22} />, value: wallet?.unlockTickets ?? 0, label: 'Unlock Tickets' },
            { icon: <ShardIcon size={20} />, value: wallet?.shards ?? 0, label: 'Shards' },
            { icon: <LaurelIcon size={22} />, value: wallet?.laurels ?? 0, label: 'Laurels' },
          ].map((c) => (
            <div key={c.label} className="flex flex-col items-center gap-1 rounded-md bg-raised p-2.5">
              {c.icon}
              <span className="font-display text-lg font-bold">{c.value}</span>
              <span className="text-[11px] text-ink-soft">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Row label="Tier world">Tier 1</Row>
        <Row label="Trainer since">{new Date(save.account.createdAt).toLocaleDateString()}</Row>
        <Row label="Umas unlocked">0 / {master.status === 'ready' ? master.view.roster.length : '…'}</Row>
        <Row label="Cloud save">{sync === 'synced' && lastSyncedAt ? `Synced ${new Date(lastSyncedAt).toLocaleTimeString()}` : sync === 'syncing' ? 'Syncing…' : sync === 'offline' ? 'Offline' : sync === 'error' ? 'Paused' : '—'}</Row>
        <Row label="Game data">{master.status === 'ready' ? `${master.view.manifest.version} · schema ${master.view.manifest.schemaVersion}` : master.status === 'error' ? 'Not loaded' : 'Loading…'}</Row>
        <Row label="App build">{APP_BUILD_ID}</Row>
      </section>

      {update.status !== 'current' && (
        <button type="button" onClick={() => appUpdateLifecycle.requestRestart()} className="min-h-11 w-full rounded-sm bg-accent font-display font-bold text-accent-ink">
          Update ready — Restart
        </button>
      )}

      {auth.authRequired && (
        <button
          type="button"
          onClick={() => {
            resetGame()
            void auth.signOut()
          }}
          className="min-h-11 w-full rounded-sm border border-hairline-strong font-semibold text-ink-soft"
        >
          Sign out
        </button>
      )}
    </div>
  )
}
