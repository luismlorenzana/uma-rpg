import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, readdir, writeFile, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { cropFixture } from './crop-fixture.mjs'
import { loadCropSession, saveCrops, startCropCalibration, calibrationMembers } from './crop-authoring.mjs'
import { loadReview, saveVotes, atomicJson } from './ratings.mjs'
import { fitRect, moveRect, resizeRect, validRect, outputSize } from './crop-geometry.mjs'
import { reviewHandler } from './review-server.mjs'

async function fixture(t) {
  const root=await mkdtemp(join(tmpdir(),'crop-authoring-test-'));t.after(()=>rm(root,{recursive:true,force:true}))
  return cropFixture(root)
}
test('geometry keeps both ratios inside source bounds and caps output without upscaling',()=>{
  for(const image of [{width:400,height:225},{width:2048,height:1731},{width:96,height:96}])for(const role of ['vertical','splash']) {
    const rect=fitRect(image,role,{cx:.99,cy:0,coverage:1})
    assert.equal(validRect(rect,image,role),true)
    const moved=moveRect(rect,image,1e6,-1e6),resized=resizeRect(moved,image,role,1e6)
    assert.equal(validRect(moved,image,role),true);assert.equal(validRect(resized,image,role),true)
    const anchored=resizeRect(rect,image,role,1e6,false);assert.equal(validRect(anchored,image,role),true)
    const output=outputSize(rect,role);assert.ok(output.width<=rect.width&&output.height<=rect.height)
    assert.equal(validRect({...rect,x:-1},image,role),false);assert.equal(validRect({...rect,width:NaN},image,role),false)
  }
})
test('calibration selects ten per franchise across four tiers, freezes exact classifications and reuses every face',async t=>{
  const f=await fixture(t),session=await loadCropSession(f.release,f.file)
  assert.equal(session.manifest.members.length,20);assert.equal(session.data.entries.length,34)
  assert.deepEqual(await readFile(f.file),f.baseline);assert.deepEqual(await readFile(join(dirname(f.file),'classification-final-ratings.json')),f.baseline)
  assert.equal((await loadReview(f.release,f.file)).readOnly,true)
  const picked=calibrationMembers(await loadReview(f.release,f.file))
  for(const franchise of ['priconne','azurlane']) {
    assert.equal(picked.filter(m=>m.franchise===franchise).length,10)
    assert.deepEqual([...new Set(picked.filter(m=>m.franchise===franchise).map(m=>m.rating))].sort(),[1,2,3,4])
  }
  for(const member of session.manifest.members) {
    assert.equal(member.face.sha256,member.art.sha256)
    const roles=session.data.entries.filter(e=>e.franchise===member.franchise&&e.id===member.id).map(e=>e.role)
    assert.deepEqual(roles,member.rating===1?['vertical']:['vertical','splash'])
  }
  await assert.rejects(saveVotes(f.release,f.file,[{franchise:'priconne',id:'synthetic-0',rating:4}],12),/Classification is final/)
})
test('crop edits, approvals and Undo persist with history without changing classifications or original bytes',async t=>{
  const f=await fixture(t),start=await loadCropSession(f.release,f.file),e=start.data.entries[0],source=start.manifest.members[0].art
  const original=await readFile(join(f.release,source.path)),rect=moveRect(e.rect,source,5,5)
  const saved=await saveCrops(f.release,f.file,{sessionId:'calibration',revision:0,updates:[{key:e.key,rect,status:'approved'}]})
  assert.equal(saved.revision,1);assert.equal(saved.entries[0].status,'approved');assert.deepEqual(saved.entries[0].rect,rect)
  await saveCrops(f.release,f.file,{sessionId:'calibration',revision:1,updates:[{key:e.key,rect:e.rect,status:'pending'}]})
  const reloaded=await loadCropSession(f.release,f.file)
  assert.deepEqual(reloaded.data.entries[0].rect,e.rect);assert.equal(reloaded.data.entries[0].status,'pending')
  assert.equal((await readdir(join(dirname(reloaded.file),'history'))).length,3)
  assert.deepEqual(await readFile(f.file),f.baseline);assert.deepEqual(await readFile(join(f.release,source.path)),original)
  const before=await readFile(reloaded.file)
  for(const updates of [[{key:'missing',rect,status:'approved'}],[{key:e.key,rect:{...rect,x:-1},status:'approved'}],[{key:e.key,rect,status:'bad'}]])
    await assert.rejects(saveCrops(f.release,f.file,{sessionId:'calibration',revision:2,updates}))
  await assert.rejects(saveCrops(f.release,f.file,{sessionId:'other',revision:2,updates:[{key:e.key,rect,status:'pending'}]}),/changed/)
  await assert.rejects(saveCrops(f.release,f.file,{sessionId:'calibration',revision:0,updates:[{key:e.key,rect,status:'pending'}]}),/changed/)
  assert.deepEqual(await readFile(reloaded.file),before)
})
test('corrupt/missing crop records, catalogues or frozen classifications fail instead of silently resetting',async t=>{
  const f=await fixture(t),session=await loadCropSession(f.release,f.file),cropBytes=await readFile(session.file)
  await writeFile(session.file,'{broken');await assert.rejects(loadCropSession(f.release,f.file))
  await rm(session.file);await assert.rejects(loadCropSession(f.release,f.file),/ENOENT/)
  await writeFile(session.file,cropBytes)
  const manifestFile=join(dirname(session.file),'manifest.json'),manifestBytes=await readFile(manifestFile)
  await atomicJson(manifestFile,{...session.manifest,members:[]});await assert.rejects(loadCropSession(f.release,f.file),/catalogue changed/)
  await writeFile(manifestFile,manifestBytes)
  await writeFile(f.file,Buffer.concat([f.baseline,Buffer.from(' ')]));await assert.rejects(loadCropSession(f.release,f.file),/Final classification changed/)
})
test('crop HTTP endpoints use the same local protections and reject any classification mutation',async t=>{
  const f=await fixture(t),handler=await reviewHandler({...f,port:5195,assets:dirname(fileURLToPath(import.meta.url))})
  const request=async(url,{body,token,origin='http://127.0.0.1:5195',host='127.0.0.1:5195'}={})=>{
    const req={url,method:body?'POST':'GET',headers:{host,origin,'content-type':'application/json','x-review-token':token},async *[Symbol.asyncIterator](){if(body)yield JSON.stringify(body)}}
    const res={setHeader(){},writeHead(status){this.status=status},end(bytes){this.bytes=Buffer.from(bytes)}};await handler(req,res)
    return {status:res.status,json:()=>JSON.parse(res.bytes)}
  }
  for(const path of ['/crop','/crop.js','/crop.css','/crop-geometry.mjs'])assert.equal((await request(path)).status,200)
  const data=(await request('/api/crops')).json(),edit={key:data.entries[0].key,rect:data.entries[0].rect,status:'approved'}
  const body={sessionId:data.sessionId,revision:0,updates:[edit]}
  assert.equal((await request('/api/crops',{body})).status,403)
  assert.equal((await request('/api/crops',{body,token:data.token,origin:'https://other.example'})).status,403)
  assert.equal((await request('/api/crops',{host:'other.example:5195'})).status,403)
  assert.equal((await request('/api/crops',{body,token:data.token})).status,200)
  assert.equal((await request('/api/crops',{body,token:data.token})).status,409)
  const exportData=(await request('/api/crops/export')).json();assert.equal(exportData.entries[0].status,'approved');assert.equal(exportData.token,undefined)
  const votes={roundId:'tiers',revision:12,entries:[{franchise:'priconne',id:'synthetic-0',rating:4}]}
  assert.equal((await request('/api/votes',{body:votes,token:data.token})).status,423)
  assert.equal((await request('/api/import',{body:{roundId:'tiers',revision:12,data:JSON.parse(f.baseline)},token:data.token})).status,423)
  assert.deepEqual(await readFile(f.file),f.baseline)
})
