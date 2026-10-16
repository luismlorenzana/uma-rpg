import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

const buildId = (process.env.VITE_APP_BUILD_ID ?? process.env.GITHUB_SHA ?? 'local').slice(0, 12)

export default defineConfig(({ mode }) => {
  // A production build without the Firebase web config would run signed out and every API call would get a 401.
  // Fail the build instead (apps/web/.env.production must be committed).
  if (mode === 'production') {
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    const missing = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_PROJECT_ID'].filter((k) => !env[k])
    if (missing.length > 0) throw new Error(`Production build is missing ${missing.join(', ')} (apps/web/.env.production)`)
  }
  return {
  define: {
    __APP_BUILD_ID__: JSON.stringify(buildId),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      // App icons are drawn in uma-platform (scripts/pixel-art, `pnpm art:icons`) and copied here; iOS keeps the icon it saw
      // at Add to Home Screen, so change them only with a reinstall in mind.
      includeAssets: ['icons/icon-64.png', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Uma RPG',
        short_name: 'Uma RPG',
        description: 'Personal party RPG',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        background_color: '#0f1620',
        theme_color: '#0f1620',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Push notifications (D63): the handlers live in public/push-sw.js.
        importScripts: ['push-sw.js'],
        // Phaser is a large lazy chunk: precache it too, so the Hub map works offline after install.
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: '/index.html',
        // /__/ is Firebase Hosting's reserved space (the redirect sign-in handler): never answer it with the app shell.
        navigateFallbackDenylist: [/^\/api\//, /^\/__\//],
        runtimeCaching: [
          {
            // Master data files are named by hash: cache forever on the device once downloaded.
            urlPattern: ({ url }) => url.pathname.startsWith('/api/master/files/') || url.pathname.startsWith('/api/master/manifests/'),
            handler: 'CacheFirst',
            options: { cacheName: 'rpg-master', expiration: { maxEntries: 4000 } },
          },
          {
            // The channel pointer changes with each release: prefer the network, fall back to the last one offline.
            urlPattern: ({ url }) => url.pathname.startsWith('/api/master/channels/'),
            handler: 'NetworkFirst',
            options: { cacheName: 'rpg-master-channel', networkTimeoutSeconds: 4 },
          },
          {
            // Enemy faces, verticals and splashes are hash-named too (D135): about 2,000 files in all.
            urlPattern: ({ url }) => url.pathname.startsWith('/api/content/enemies/'),
            handler: 'CacheFirst',
            options: { cacheName: 'rpg-content', expiration: { maxEntries: 2500 } },
          },
          {
            // The enemy list changes with each release: prefer the network, fall back to the last one offline.
            urlPattern: ({ url }) => url.pathname === '/api/content/enemies.json',
            handler: 'NetworkFirst',
            options: { cacheName: 'rpg-content-list', networkTimeoutSeconds: 4 },
          },
        ],
      },
    }),
  ],
  resolve: {
    // uma-kit's peers resolve to this app's copies (also when the kit is linked from uma-platform).
    dedupe: ['react', 'react-dom', 'react-router', 'motion', 'phaser'],
  },
  server: {
    port: 5174,
    // `host: true` exposes the dev server on the LAN so the iPhone can load it directly.
    host: true,
    proxy: {
      '/api': { target: process.env.API_PROXY_TARGET ?? 'http://localhost:8081', changeOrigin: true },
    },
  },
  preview: { port: 5174 },
  build: {
    target: 'es2022',
    manifest: true,
  },
  test: {
    environment: 'jsdom',
  },
}
})
