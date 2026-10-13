import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, stat, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { installReview } from './install-review.mjs'

test('the double-click launcher uses the existing private folder, preserves votes/art and quotes spaces/apostrophes',async t=>{
  const root=await mkdtemp(join(tmpdir(),'cast-install-test-')),content=join(root,"owner's content")
  t.after(()=>rm(root,{recursive:true,force:true}))
  await mkdir(join(content,'release'),{recursive:true})
  await writeFile(join(content,'cast-ratings.json'),'private votes')
  await writeFile(join(content,'release/portrait.png'),'private art')
  const launcher=await installReview(content)
  const text=await readFile(launcher,'utf8')
  assert.match(text,/^#!\/bin\/zsh/)
  assert.ok(text.includes("'\\''"),'apostrophes are shell-quoted, never evaluated')
  assert.ok(text.includes('--open'))
  assert.equal((await stat(launcher)).mode&0o777,0o700)
  assert.equal(await readFile(join(content,'cast-ratings.json'),'utf8'),'private votes')
  assert.equal(await readFile(join(content,'release/portrait.png'),'utf8'),'private art')
  assert.ok((await readFile(join(content,'tools/cast-review/review.html'),'utf8')).includes('Portrait review'))
  assert.equal(await installReview(content),launcher)
})
