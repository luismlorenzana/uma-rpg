import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { registerAppUpdates } from './app/register-updates'
import { router } from './app/router'
import { UpdateNotice } from './app/UpdateNotice'
import { AuthProvider } from './auth/AuthProvider'

registerAppUpdates()

const root = document.getElementById('root')
if (!root) throw new Error('missing #root')

createRoot(root).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <UpdateNotice />
    </AuthProvider>
  </StrictMode>,
)
