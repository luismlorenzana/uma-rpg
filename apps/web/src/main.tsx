import './index.css'

import buildingsIndex from '@luismlorenzana/uma-art/buildings/atlas.json'
import buildingsUrl from '@luismlorenzana/uma-art/buildings/atlas.png?url'
import tilesIndex from '@luismlorenzana/uma-art/tiles/atlas.json'
import tilesUrl from '@luismlorenzana/uma-art/tiles/atlas.png?url'
import uiIndex from '@luismlorenzana/uma-art/ui/atlas.json'
import uiUrl from '@luismlorenzana/uma-art/ui/atlas.png?url'
import { configureKit, initAppearance, KitArtProvider, MotionRoot, type KitArt } from '@luismlorenzana/uma-kit/ui'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { registerAppUpdates } from './app/register-updates'
import { router } from './app/router'
import { UpdateNotice } from './app/UpdateNotice'
import { AuthProvider } from './auth/AuthProvider'
import { clearBadgeOnOpen } from './push/push'

// uma-kit (D147): this game's device keys, the phone's appearance (or Account's choice), and uma-art for the bars and map.
configureKit({ storagePrefix: 'rpg.' })
initAppearance()
registerAppUpdates()
clearBadgeOnOpen()

const ART: KitArt = {
  ui: { url: uiUrl, index: uiIndex },
  tiles: { url: tilesUrl, index: tilesIndex },
  buildings: { url: buildingsUrl, index: buildingsIndex },
}

const root = document.getElementById('root')
if (!root) throw new Error('missing #root')

createRoot(root).render(
  <StrictMode>
    <MotionRoot>
      <KitArtProvider art={ART}>
        <AuthProvider>
          <RouterProvider router={router} />
          <UpdateNotice />
        </AuthProvider>
      </KitArtProvider>
    </MotionRoot>
  </StrictMode>,
)
