// This game's Firebase config for the kit's sign-in (uma-platform P56, SD3). Present only in production builds: local dev
// has none, so the app runs as `local-dev` and the API runs with AUTH_MODE=disabled.
import { firebaseEnabled, type FirebaseConfig } from '@luismlorenzana/uma-kit/auth'

export const FIREBASE: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // The Hosting domain (uma-rpg.web.app), so the auth handler is same-origin inside the iOS Home Screen app.
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

export const signInEnabled = firebaseEnabled(FIREBASE)
