import './index.css'

import buildingsIndex from '@luismlorenzana/uma-art/buildings/atlas.json'
import buildingsUrl from '@luismlorenzana/uma-art/buildings/atlas.png?url'
import tilesIndex from '@luismlorenzana/uma-art/tiles/atlas.json'
import tilesUrl from '@luismlorenzana/uma-art/tiles/atlas.png?url'
import uiIndex from '@luismlorenzana/uma-art/ui/atlas.json'
import uiUrl from '@luismlorenzana/uma-art/ui/atlas.png?url'
import { AuthProvider, idToken } from '@luismlorenzana/uma-kit/auth'
import { ContentProvider } from '@luismlorenzana/uma-kit/content'
import { watchAppUpdates } from '@luismlorenzana/uma-kit/places'
import { configureKit, initAppearance, KitArtProvider, MotionRoot, type KitArt } from '@luismlorenzana/uma-kit/ui'
import { AlbumArtProvider } from '@luismlorenzana/uma-kit/album'
import { WorkArtProvider } from '@luismlorenzana/uma-kit/work'
import { ALBUM_ART } from './master/album-art'
import { ItemIcon } from './items/ItemIcon'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { registerSW } from 'virtual:pwa-register'
import { setTokenProvider } from './api/client'
import { FIREBASE } from './app/firebase-config'
import { router } from './app/router'
import { CONTENT } from './content/client'
import { clearBadgeOnOpen } from './push/push'

// uma-kit (D147): this game's device keys, the phone's appearance (or Account's choice), and uma-art for the bars and map.
// The kit's sign-in and update prompt (SD3): the API's token comes from the kit, and a new build waits for Restart.
configureKit({ storagePrefix: 'rpg.' })
initAppearance()
watchAppUpdates(registerSW)
setTokenProvider(() => idToken(FIREBASE))
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
        <AuthProvider config={FIREBASE}>
          <ContentProvider client={CONTENT}>
            <AlbumArtProvider art={ALBUM_ART}>
              <WorkArtProvider art={{ Item: ItemIcon }}>
                <RouterProvider router={router} />
              </WorkArtProvider>
            </AlbumArtProvider>
          </ContentProvider>
        </AuthProvider>
      </KitArtProvider>
    </MotionRoot>
  </StrictMode>,
)
