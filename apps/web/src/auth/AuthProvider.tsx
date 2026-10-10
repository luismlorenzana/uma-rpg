import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setTokenProvider } from '../api/client'
import { firebaseEnabled, loadAuth } from './firebase'

export interface AuthUser {
  uid: string
  name: string | null
  email: string | null
}

interface AuthState {
  ready: boolean
  authRequired: boolean
  user: AuthUser | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)
const LOCAL_USER: AuthUser = { uid: 'local-dev', name: 'Local Dev', email: null }

// uma-racer's contract: the Firebase SDK loads lazily after first render; without Firebase config (local dev) there is
// no sign-in and the API runs with AUTH_MODE=disabled.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(firebaseEnabled ? null : LOCAL_USER)
  const [ready, setReady] = useState(!firebaseEnabled)

  useEffect(() => {
    if (!firebaseEnabled) {
      setTokenProvider(async () => null)
      return
    }
    let unsubscribe: (() => void) | undefined
    let cancelled = false
    setTokenProvider(async () => {
      const auth = await loadAuth()
      // Cached master data stays usable offline even if Firebase can't refresh an expired token.
      return auth.currentUser ? auth.currentUser.getIdToken().catch(() => null) : null
    })
    void Promise.all([loadAuth(), import('firebase/auth')]).then(([auth, { onAuthStateChanged }]) => {
      if (cancelled) return
      unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u ? { uid: u.uid, name: u.displayName, email: u.email } : null)
        setReady(true)
      })
    })
    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      ready,
      user,
      authRequired: firebaseEnabled,
      signIn: async () => {
        if (!firebaseEnabled) return
        const [auth, { GoogleAuthProvider, signInWithRedirect }] = await Promise.all([loadAuth(), import('firebase/auth')])
        await signInWithRedirect(auth, new GoogleAuthProvider())
      },
      signOut: async () => {
        if (!firebaseEnabled) return
        const [auth, { signOut }] = await Promise.all([loadAuth(), import('firebase/auth')])
        await signOut(auth)
      },
    }),
    [ready, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
