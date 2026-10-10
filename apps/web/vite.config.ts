import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

const buildId = (process.env.VITE_APP_BUILD_ID ?? process.env.GITHUB_SHA ?? 'local').slice(0, 12)

export default defineConfig({
  define: {
    __APP_BUILD_ID__: JSON.stringify(buildId),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      includeAssets: ['icons/icon.svg', 'icons/apple-touch-icon.png'],
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
        ],
      },
    }),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
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
  },
  test: {
    environment: 'jsdom',
  },
})
