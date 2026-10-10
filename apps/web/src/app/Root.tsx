// Gates before the Hub: auth ready → signed in → save booted (or first launch). Nothing here waits on the network
// once a device save exists (D32).
import { DEFAULT_TRAINER_NAME, TRAINER_NAME_MAX, normalizeTrainerName } from '@rpg/domain'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { useAuth } from '../auth/AuthProvider'
import { boot, createAccount, startSyncTriggers, useGame } from '../save/game'
import { TicketIcon } from '../ui/icons'

function Splash() {
  return (
    <div className="flex h-dvh items-center justify-center bg-page">
      <p className="font-display text-2xl font-bold text-accent">Uma RPG</p>
    </div>
  )
}

function SignIn({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="pt-safe pb-safe flex h-dvh flex-col items-center justify-center gap-6 bg-page px-8 text-center">
      <div>
        <p className="font-display text-4xl font-bold text-accent">Uma RPG</p>
        <p className="mt-2 text-ink-soft">A party RPG for one trainer.</p>
      </div>
      <button type="button" onClick={onSignIn} className="min-h-12 w-full max-w-xs rounded-sm bg-accent font-display text-base font-bold text-accent-ink">
        Sign in with Google
      </button>
    </div>
  )
}

function FirstLaunch() {
  const [name, setName] = useState(DEFAULT_TRAINER_NAME)
  const valid = normalizeTrainerName(name) !== null
  return (
    <form
      className="pt-safe pb-safe flex h-dvh flex-col items-center justify-center gap-5 bg-page px-8"
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) void createAccount(name)
      }}
    >
      <div className="text-center">
        <p className="font-display text-3xl font-bold">Welcome, trainer</p>
        <p className="mt-2 text-ink-soft">Your stable starts empty. Tier 1 opens with</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 font-display text-lg font-bold text-ticket">
          <TicketIcon size={24} /> 15 Unlock Tickets
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

export function Root() {
  const auth = useAuth()
  const status = useGame((s) => s.status)
  const uid = auth.user?.uid

  useEffect(() => {
    if (auth.ready && uid) void boot(uid)
  }, [auth.ready, uid])

  useEffect(() => startSyncTriggers(), [])

  if (!auth.ready) return <Splash />
  if (auth.authRequired && !auth.user) return <SignIn onSignIn={() => void auth.signIn()} />
  if (status === 'idle' || status === 'booting') return <Splash />
  if (status === 'first-launch') return <FirstLaunch />
  return <Outlet />
}
