// One authenticated content client for uma-platform's release and this game's private enemy pack (SE3).
import { idToken } from '@luismlorenzana/uma-kit/auth'
import { createContentClient } from '@luismlorenzana/uma-kit/content'
import { FIREBASE } from '../app/firebase-config'

export const CONTENT = createContentClient({ token: () => idToken(FIREBASE) })
