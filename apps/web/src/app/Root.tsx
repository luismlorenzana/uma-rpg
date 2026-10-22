// Getting in (SD3): the kit's gates (uma-platform P56): splash → sign-in → boot → first launch → start page, with this
// game's boot (the device save, else the server's), its first launch (a trainer name, then 20 Uma Tickets) and its start
// page (the last Hub page). Nothing here waits on the network once a device save exists (D32).
import { useAuth } from '@luismlorenzana/uma-kit/auth'
import { BootGates, UpdateNotice } from '@luismlorenzana/uma-kit/places'
import { DEFAULT_TRAINER_NAME, STARTING_UNLOCK_TICKETS, TRAINER_NAME_MAX, normalizeTrainerName } from '@rpg/domain'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { lastPage } from '../hub/start'
import { boot, createAccount, startSyncTriggers, useGame } from '../save/game'
import { TicketIcon } from '../ui/icons'
import { signInEnabled } from './firebase-config'

function FirstLaunch({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState(DEFAULT_TRAINER_NAME)
  const valid = normalizeTrainerName(name) !== null
  return (
    <form
      className="pt-safe pb-safe fixed inset-0 flex flex-col items-center justify-center gap-5 bg-page px-8"
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) void createAccount(name).then(onDone)
      }}
    >
      <div className="text-center">
        <p className="font-display text-3xl font-bold">Welcome, trainer</p>
        <p className="mt-2 text-ink-soft">Your stable starts empty. Tier 1 opens with</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 font-display text-lg font-bold text-ticket">
          <TicketIcon size={24} /> {STARTING_UNLOCK_TICKETS} Uma Tickets
        </p>
      </div>
      <label className="w-full max-w-xs">
        <span className="text-micro">Trainer name</span>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 min-h-12 w-full rounded-sm bg-sunken px-3 text-ink outline-none ring-accent focus:ring-2"
          aria-invalid={!valid}
        />
        <span className="mt-1 block text-[12px] text-ink-faint">1–{TRAINER_NAME_MAX} characters.</span>
      </label>
      <button type="submit" disabled={!valid} className="min-h-12 w-full max-w-xs rounded-sm bg-accent font-display text-base font-bold text-accent-ink disabled:opacity-40">
        Enter the Hub
      </button>
    </form>
  )
}

/** The game's boot for the gates: opens the device save (or the server's) on the asked tier (a `?tier=` link, H35), and
 * says whether a first launch is due. */
async function bootFor({ uid }: { uid: string }): Promise<{ firstLaunch: boolean }> {
  await boot(uid, new URLSearchParams(window.location.search).get('tier'))
  return { firstLaunch: useGame.getState().status === 'first-launch' }
}

export function Root() {
  const auth = useAuth()

  useEffect(() => startSyncTriggers(), [])

  // Never run a production build signed out: every API call would fail (the S1 incident, D42).
  if (import.meta.env.PROD && !signInEnabled)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-page p-8 text-center text-ink-soft">This build is missing its sign-in configuration.</div>
    )
  return (
    <>
      <UpdateNotice />
      <BootGates auth={auth} boot={bootFor} firstLaunch={(done) => <FirstLaunch onDone={done} />} startPath={() => `/${lastPage()}`}
        words={{ name: 'Uma RPG', tagline: 'A party RPG for one trainer.' }}>
        <Outlet />
      </BootGates>
    </>
  )
}
