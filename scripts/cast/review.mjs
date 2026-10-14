// Run with pnpm cast:review. Existing local imports only; no wiki access or added dependency.
import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { ratingsPath } from './ratings.mjs'
import { reviewHandler } from './review-server.mjs'
import { projectPaths } from './authoring-round.mjs'

const assets = dirname(fileURLToPath(import.meta.url))
const fallbackRelease=resolve(process.env.CAST_CONTENT_DIR ?? resolve(assets,'../../content/release'))
const projectFile=process.env.CAST_PROJECT_FILE ?? (!process.env.CAST_RATINGS_FILE ? resolve(dirname(fallbackRelease),'authoring/project.json') : undefined)
let paths
if(projectFile) {
  try{paths=await projectPaths(resolve(projectFile))}catch(error){if(error.code!=='ENOENT')throw error}
}
const release = paths?.release ?? fallbackRelease
const file = paths?.file ?? resolve(process.env.CAST_RATINGS_FILE ?? ratingsPath(release))
{
  const port = Number(process.env.CAST_REVIEW_PORT ?? 5194)
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid CAST_REVIEW_PORT')
  const handler = await reviewHandler({ release, file, port, assets })
  // The private content path survives task-worktree cleanup; so do static assets preloaded by the handler.
  process.chdir(dirname(release))
  const server = createServer(handler)
  const url = 'http://127.0.0.1:' + port
  const open = () => {
    if (process.argv.includes('--open') && process.platform === 'darwin') execFile('/usr/bin/open', [url], error => { if (error) console.error('Open ' + url) })
  }
  server.on('error', async error => {
    if (error.code === 'EADDRINUSE' && process.argv.includes('--open')) {
      try {
        const response = await fetch(url + '/api/review'), data = await response.json()
        if (response.ok && data.schemaVersion === 1 && Array.isArray(data.packs) && typeof data.token === 'string') { open(); return }
      } catch { /* Do not assume an unrelated server is our reviewer. */ }
    }
    console.error(error.message); process.exitCode = 1
  })
  server.listen(port, '127.0.0.1', () => { console.log('Portrait reviewer: ' + url); open() })
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit()))
}
