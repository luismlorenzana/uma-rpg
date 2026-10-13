// Install a tiny, dependency-free local copy inside the existing private content folder, not another checkout.
import { copyFile, mkdir, realpath, writeFile, chmod } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const source = dirname(fileURLToPath(import.meta.url))
const quote = value => "'" + value.replaceAll("'", "'\\''") + "'"
export async function installReview(content, from = source, node = process.execPath) {
  content = await realpath(content)
  const release = await realpath(join(content, 'release'))
  const app = join(content, 'tools/cast-review')
  await mkdir(app, { recursive: true })
  for (const file of ['ratings.mjs','review-server.mjs','review.mjs','review.html','review.js','review.css']) await copyFile(join(from,file),join(app,file))
  const launcher = join(content, 'Portrait Review.command')
  await writeFile(launcher, '#!/bin/zsh\nexport CAST_CONTENT_DIR=' + quote(release) +
    '\nexport CAST_RATINGS_FILE=' + quote(join(content,'cast-ratings.json')) +
    '\n' + quote(node) + ' ' + quote(join(app,'review.mjs')) + ' --open\n', { mode: 0o700 })
  await chmod(launcher, 0o700)
  return launcher
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = process.argv.slice(2).find(arg=>arg!=='--') ?? resolve(source,'../../content')
  console.log(await installReview(target))
}
