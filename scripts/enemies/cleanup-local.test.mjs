// Cleanup uses only synthetic files and a temporary Trash, never the owner's private content.
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { createCanvas } from '@napi-rs/canvas'
import { buildRelease } from './release.mjs'
import { applyCleanup, auditKeep, planCleanup } from './cleanup-local.mjs'

const hash=b=>createHash('sha256').update(b).digest('hex')
const put=async(path,bytes)=>{await mkdir(dirname(path),{recursive:true});await writeFile(path,bytes)}
async function fixture(t) {
  const root=await mkdtemp(join(tmpdir(),'enemy-cleanup-test-')),content=join(root,'content'),trashBase=join(root,'trash')
  t.after(()=>rm(root,{recursive:true,force:true}))
  const png=await createCanvas(12,18).encode('png'),exports=join(content,'authoring/exports')
  for(const [pointer,id,franchise,tier] of [['latest.json','full-test','priconne',1],['latest-nikke.json','nikke-test','nikke',4]]) {
    const assets={}
    for(const role of tier===1?['face','vertical']:['face','vertical','splash']) {
      const path=`${franchise}/test/${role}.png`
      await put(join(exports,id,path),png);assets[role]={path,sha256:hash(png),bytes:png.length}
    }
    const manifest=Buffer.from(JSON.stringify({id,complete:true,units:[{id:`${franchise}-test`,franchise,name:'Synthetic',tier,assets}]}))
    await put(join(exports,id,'manifest.json'),manifest)
    const marker=JSON.stringify({id,manifestSha256:hash(manifest)})
    await put(join(exports,id,'complete.json'),marker);await put(join(exports,pointer),marker)
  }
  await buildRelease(exports,join(content,'enemies-release'))
  const images=['authoring/datasets/old/source.png','authoring/cache/cache.bin','authoring/previews/old.png',
    'authoring/archive/legacy.png','.cache/old/portrait.png','release/old.png','l2d/sources/model/texture.png',
    'l2d/renders/old.png','sources/source.png']
  for(const path of images)await put(join(content,path),png)
  const metadata=['authoring/rounds/final/ratings.json','authoring/crops/final/crops.json','l2d/tiers.json','sources/source.json']
  for(const path of metadata)await put(join(content,path),'{}\n')
  await put(join(exports,'earlier-version/master.png'),png)
  await put(join(content,'Portrait Review.command'),'retired launcher')
  await put(join(content,'tools/cast-review/review.mjs'),'retired reviewer')
  await put(join(content,'tools/cast-export/export.mjs'),'retired exporter')
  await put(join(content,'tools/unrelated/keep.mjs'),'unrelated tool')
  return {root,content,trashBase,png,images,metadata,exports}
}

test('audit-only plan preserves masters, runtime and metadata, including older bundle versions',async t=>{
  const f=await fixture(t),plan=await planCleanup(f.content)
  assert.equal(plan.units,2);assert.equal(plan.totals.images,f.images.length);assert.equal(plan.totals.retiredApps,3)
  assert.deepEqual(plan.candidates.filter(x=>x.kind==='image').map(x=>x.path).sort(),[...f.images].sort())
  assert.ok(plan.kept.some(x=>x.path.startsWith('enemies-release/enemies/')))
  assert.deepEqual(await readFile(join(f.exports,'earlier-version/master.png')),f.png)
  for(const path of f.images)assert.deepEqual(await readFile(join(f.content,path)),f.png)
  await assert.rejects(readdir(f.trashBase),{code:'ENOENT'})
})

test('moves only redundant files to recoverable Trash and re-verifies all required assets',async t=>{
  const f=await fixture(t),before=await auditKeep(f.content),receipt=await applyCleanup(f.content,{trashBase:f.trashBase})
  assert.equal(receipt.moved,f.images.length+3)
  assert.equal(receipt.protectedFilesVerified,before.kept.length)
  assert.deepEqual((await auditKeep(f.content)).kept,before.kept)
  for(const path of f.images) {
    await assert.rejects(readFile(join(f.content,path)),{code:'ENOENT'})
    assert.deepEqual(await readFile(join(receipt.trash,'files',path)),f.png)
  }
  for(const path of f.metadata)assert.equal(await readFile(join(f.content,path),'utf8'),'{}\n')
  assert.equal(await readFile(join(receipt.trash,'app/tools/cast-review/review.mjs'),'utf8'),'retired reviewer')
  assert.equal(await readFile(join(f.content,'tools/unrelated/keep.mjs'),'utf8'),'unrelated tool')
  assert.deepEqual(await readFile(join(f.exports,'earlier-version/master.png')),f.png)
  const journal=(await readFile(join(receipt.receiptRoot,'moves.jsonl'),'utf8')).trim().split('\n').map(JSON.parse)
  assert.equal(journal.length,receipt.moved*2)
  assert.equal(journal.filter(x=>x.state==='moved'&&x.sha256===hash(f.png)).length,f.images.length)
  assert.equal(JSON.parse(await readFile(join(receipt.trash,'RECOVERY.json'),'utf8')).content,before.content)
  assert.deepEqual(JSON.parse(await readFile(join(f.content,'authoring/maintenance/latest-cleanup.json'),'utf8')),receipt)
  assert.equal((await planCleanup(f.content)).candidates.length,0)
})

test('refuses changed master or runtime images before creating Trash or moving anything',async t=>{
  const f=await fixture(t),keep=await auditKeep(f.content)
  for(const path of [keep.kept.find(x=>x.path.endsWith('.png')).path,keep.kept.find(x=>x.path.endsWith('.webp')).path]) {
    const file=join(f.content,path),bytes=await readFile(file)
    const corrupt=Buffer.from(bytes);corrupt[corrupt.length-1]^=1;await writeFile(file,corrupt)
    await assert.rejects(applyCleanup(f.content,{trashBase:f.trashBase}),/changed|hash mismatch/)
    await assert.rejects(readdir(f.trashBase),{code:'ENOENT'})
    await writeFile(file,bytes)
  }
  assert.deepEqual(await readFile(join(f.content,f.images[0])),f.png)
})

test('refuses a release that is not the locked roster before any moves',async t=>{
  const f=await fixture(t),file=join(f.content,'enemies-release/enemies.json'),release=JSON.parse(await readFile(file,'utf8'))
  release.units[0].tier='boss';await writeFile(file,JSON.stringify(release))
  await assert.rejects(applyCleanup(f.content,{trashBase:f.trashBase}),/differs from locked input/)
  await assert.rejects(readdir(f.trashBase),{code:'ENOENT'})
})

test('does not follow cache directory or file symlinks; refuses an escaped installed app',async t=>{
  const f=await fixture(t),outside=join(f.root,'outside')
  await put(join(outside,'keep.png'),f.png)
  await symlink(outside,join(f.content,'.cache/linked'),'dir')
  await symlink(join(outside,'keep.png'),join(f.content,'sources/linked.png'))
  let plan=await planCleanup(f.content)
  assert.ok(!plan.candidates.some(x=>x.path.includes('linked')))
  // The named scan root itself may be a link, not just a child.
  await rm(join(f.content,'sources'),{recursive:true});await symlink(outside,join(f.content,'sources'),'dir')
  plan=await planCleanup(f.content);assert.ok(!plan.candidates.some(x=>x.path.startsWith('sources/')))
  await rm(join(f.content,'tools/cast-review'),{recursive:true});await symlink(outside,join(f.content,'tools/cast-review'),'dir')
  await assert.rejects(applyCleanup(f.content,{trashBase:f.trashBase}),/escapes content/)
  assert.deepEqual(await readFile(join(outside,'keep.png')),f.png)
})

test('rejects a Trash location inside private content',async t=>{
  const f=await fixture(t)
  await assert.rejects(applyCleanup(f.content,{trashBase:join(f.content,'not-trash')}),/must be separate/)
  assert.deepEqual(await readFile(join(f.content,f.images[0])),f.png)
})
