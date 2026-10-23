import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('the installed iOS app', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
  const page = new DOMParser().parseFromString(html, 'text/html')

  it('uses an opaque status bar without giving up the bottom safe area', () => {
    expect(page.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.getAttribute('content')).toBe('default')
    expect(page.querySelector('meta[name="viewport"]')?.getAttribute('content')).toContain('viewport-fit=cover')
  })
})
