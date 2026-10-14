import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile, readdir, rm, realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { cropFixture } from './crop-fixture.mjs'
import { startCropRoster, loadCropSession, saveCrops } from './crop-authoring.mjs'
import { exportCrops, verifyExport, renderCrop } from './export-crops.mjs'
import { digest } from './authoring-import.mjs'
import { installExporter } from './install-export.mjs'

async function fixture(t) {
  const root=await mkdtemp(join(tmpdir(),'crop-export-test-'));t.after(()=>rm(root,{recursive:true,force:true}))
  const f=await cropFixture(root,{counts:[2,3]});await startCropRoster(root,'full')
  const session=await loadCropSession(f.release,f.file)
  const approved=await saveCrops(f.release,f.file,{sessionId:'full',revision:0,updates:session.data.entries.map(entry=>({key:entry.key,rect:entry.rect,status:'approved'}))})
  return {...f,session,approved}
}
test('raster rendering retains fractional source coordinates, exact ratios and transparency without upscaling',async()=>{
  const canvas=createCanvas(12,18),ctx=canvas.getContext('2d')
  for(let x=0;x<12;x++){ctx.fillStyle=x%2?'#ff0000':'#0000ff';ctx.fillRect(x,0,1,18)}
  const bytes=await canvas.encode('png'),image={width:12,height:18},rect={x:.5,y:.25,width:8,height:12}
  const actual=await renderCrop(bytes,image,{role:'vertical',rect}),original=await loadImage(bytes)
  const expected=createCanvas(8,12),expectedCtx=expected.getContext('2d');expectedCtx.imageSmoothingQuality='high'
  expectedCtx.drawImage(original,.5,.25,8,12,0,0,8,12)
  assert.deepEqual(actual,await expected.encode('png'))
  assert.notDeepEqual(actual,await renderCrop(bytes,image,{role:'vertical',rect:{...rect,x:0,y:0}}))
  const transparent=await renderCrop(await createCanvas(8,12).encode('png'),{width:8,height:12},{role:'vertical',rect:{x:0,y:0,width:8,height:12}})
  const decoded=await loadImage(transparent),out=createCanvas(8,12);out.getContext('2d').drawImage(decoded,0,0)
  assert.equal(out.getContext('2d').getImageData(0,0,8,12).data.some(value=>value!==0),false)
})
test('exports a complete immutable bundle, copied faces, exact snapshots and reproducible recipe provenance',async t=>{
  const f=await fixture(t),before=await readFile(f.session.file),ratings=await readFile(f.file)
  const result=await exportCrops(f.content),manifest=await verifyExport(result.folder)
  assert.deepEqual(manifest.counts,{units:5,vertical:5,splash:3,face:5,files:13})
  assert.deepEqual(await readFile(join(result.folder,'snapshots/crops.json')),before)
  assert.deepEqual(await readFile(join(result.folder,'snapshots/classification.json')),ratings)
  for(const unit of manifest.units) {
    assert.deepEqual(await readFile(join(result.folder,unit.assets.face.path)),await readFile(join(f.release,unit.source.face.path)))
    assert.equal(!!unit.assets.splash,unit.tier!==1)
    const bytes=await readFile(join(f.release,unit.source.art.path))
    for(const role of unit.tier===1?['vertical']:['vertical','splash']) {
      const entry=f.approved.entries.find(entry=>entry.key===unit.franchise+'/'+unit.id+'/'+role)
      assert.equal(digest(await renderCrop(bytes,unit.source.art,entry)),unit.assets[role].sha256)
      assert.deepEqual(unit.assets[role].rect,entry.rect)
    }
  }
  const reused=await exportCrops(f.content);assert.equal(reused.reused,true);assert.deepEqual(reused.manifest,manifest)
  assert.deepEqual(await readFile(f.session.file),before);assert.deepEqual(await readFile(f.file),ratings)
  const file=join(result.folder,manifest.units[0].assets.vertical.path)
  await writeFile(file,'bad');await assert.rejects(exportCrops(f.content),/Export asset changed/)
})
test('refuses unapproved recipes and source mismatches before creating outputs; never edits approvals',async t=>{
  const f=await fixture(t),entry=f.approved.entries[0]
  await saveCrops(f.release,f.file,{sessionId:'full',revision:1,updates:[{key:entry.key,rect:entry.rect,status:'flagged'}]})
  await assert.rejects(exportCrops(f.content),/Every crop must be approved/)
  await assert.rejects(readdir(join(f.content,'authoring/exports')),/ENOENT/)
  await saveCrops(f.release,f.file,{sessionId:'full',revision:2,updates:[{key:entry.key,rect:entry.rect,status:'approved'}]})
  const before=await readFile(f.session.file);await writeFile(join(f.release,f.session.manifest.members[0].art.path),'bad')
  await assert.rejects(exportCrops(f.content));assert.deepEqual(await readFile(f.session.file),before)
  await assert.rejects(readdir(join(f.content,'authoring/exports')),/ENOENT/)
})
test('interrupted batches preserve frozen recipes and resume, while later revisions create sibling exports',async t=>{
  const f=await fixture(t)
  await assert.rejects(exportCrops(f.content,{log:()=>{throw new Error('Synthetic interruption')}}),/Synthetic interruption/)
  const folders=(await readdir(join(f.content,'authoring/exports'))).filter(name=>name!=='latest.json'),folder=join(f.content,'authoring/exports',folders[0])
  await assert.rejects(readFile(join(folder,'complete.json')),/ENOENT/)
  const frozen=await readFile(join(folder,'snapshots/crops.json')),result=await exportCrops(f.content)
  assert.equal(result.folder,await realpath(folder));assert.deepEqual(await readFile(join(folder,'snapshots/crops.json')),frozen)
  const entry=f.approved.entries[0],rect={...entry.rect,x:entry.rect.x+1}
  await saveCrops(f.release,f.file,{sessionId:'full',revision:1,updates:[{key:entry.key,rect,status:'approved'}]})
  const next=await exportCrops(f.content);assert.notEqual(next.folder,result.folder)
  assert.deepEqual(await readFile(join(folder,'snapshots/crops.json')),frozen);await verifyExport(folder);await verifyExport(next.folder)
})
test('installs a reproducible private executor without copying sources or altering authoring data',async t=>{
  const f=await fixture(t),before=await readFile(f.session.file),target=await installExporter(f.content)
  const config=JSON.parse(await readFile(join(target,'package.json')))
  assert.equal(config.private,true);assert.equal(config.dependencies['@napi-rs/canvas'],'0.1.100')
  assert.equal((await readdir(target)).length,9);assert.deepEqual(await readFile(f.session.file),before)
  assert.deepEqual(JSON.parse(await readFile(join(target,'pnpm-workspace.yaml'))),{packages:['.']})
  assert.match(await readFile(join(target,'export-crops.mjs'),'utf8'),/export async function exportCrops/)
})
