// Push notifications when work and training finish (D63). Imported by the generated service worker (vite.config.ts,
// workbox.importScripts). Every push shows a notification: iOS revokes push for an app that receives one silently.
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { body: event.data ? event.data.text() : '' }
  }
  const shown = self.registration.showNotification(data.title || 'Uma RPG', {
    body: data.body || '',
    tag: data.tag || 'work',
    data: { url: data.url || '/' },
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-64.png',
  })
  const badge = typeof data.badge === 'number' && self.navigator.setAppBadge ? self.navigator.setAppBadge(data.badge).catch(() => {}) : null
  event.waitUntil(Promise.all([shown, badge]))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = new URL((event.notification.data && event.notification.data.url) || '/', self.location.origin).href
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((w) => 'focus' in w)
      if (open) return open.focus().then((w) => (w && 'navigate' in w ? w.navigate(url) : w))
      return self.clients.openWindow(url)
    }),
  )
})
