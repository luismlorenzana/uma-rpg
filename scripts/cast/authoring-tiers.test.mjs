import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, readdir, rm } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { atomicJson, loadReview, packPath, parseRatings, readRatings, saveVotes } from './ratings.mjs'
import { startRound, projectPaths } from './authoring-round.mjs'
import { startTierRound } from './authoring-tiers.mjs'
import { reviewHandler } from './review-server.mjs'
import { digest } from './authoring-import.mjs'
import { writeFile } from 'node:fs/promises'

const assets = dirname(fileURLToPath(import.meta.url))
async function fixture(t) {
  const content = await mkdtemp(join(tmpdir(),'portrait-tier-test-')),root=join(content,'authoring')
  t.after(()=>rm(content,{recursive:true,force:true}))
  const dataset=join(root,'datasets','source'),round=join(root,'rounds','ranking'),catalogues={},ratings={}
  for(const franchise of ['priconne','azurlane']) {
    const members=[]; ratings[franchise]={}
    for(const [index,rating] of [1,2,-1,-2].entries()) {
      const path=(franchise==='priconne'?'':franchise+'/')+'cast/unit'+index+'.01234567.jpg'
      const bytes=Buffer.from('synthetic art '+franchise+index)
      await mkdir(dirname(join(dataset,path)),{recursive:true});await writeFile(join(dataset,path),bytes)
      const image={path,width:680,height:383,sha256:digest(bytes)}
      members.push({id:'unit'+index,name:'Synthetic '+index,art:image,face:image})
      ratings[franchise]['unit'+index]=rating
    }
    await atomicJson(packPath(dataset,franchise),{schemaVersion:1,members})
    catalogues[franchise]=digest(await readFile(packPath(dataset,franchise)))
  }
  await atomicJson(join(dataset,'dataset.json'),{schemaVersion:1,id:'source',complete:true,rosterComplete:true,missing:[]})
  await atomicJson(join(round,'round.json'),{schemaVersion:1,id:'ranking',datasetId:'source',label:'Ranking',catalogues})
  const file=join(round,'ratings.json')
  await atomicJson(file,{schemaVersion:1,roundId:'ranking',datasetId:'source',revision:42,ratings})
  await atomicJson(join(root,'project.json'),{schemaVersion:1,datasetId:'source',roundId:'ranking'})
  return {content,root,dataset,file}
}
async function requestFixture(release,file) {
  const handler=await reviewHandler({release,file,port:5194,assets})
  return async (url,body,token) => {
    const req={url,method:body?'POST':'GET',headers:{host:'127.0.0.1:5194',origin:'http://127.0.0.1:5194','content-type':'application/json','x-review-token':token},async *[Symbol.asyncIterator](){if(body)yield JSON.stringify(body)}}
    const res={setHeader(){},writeHead(status){this.status=status},end(bytes){this.bytes=Buffer.from(bytes)}}
    await handler(req,res)
    return {status:res.status,bytes:res.bytes,json:()=>JSON.parse(res.bytes)}
  }
}
test('tier migration copies only survivors, preserving IDs, original bytes and every earlier vote',async t=>{
  const f=await fixture(t),before=await readFile(f.file),source=await readFile(packPath(f.dataset,'priconne'))
  const result=await startTierRound(f.content,'survivors','roles')
  assert.deepEqual(result.counts,{priconne:2,azurlane:2});assert.equal(result.originalImages,4)
  assert.deepEqual(await projectPaths(join(f.root,'project.json')),{release:result.dataset,file:join(result.round,'ratings.json')})
  assert.deepEqual(await readFile(f.file),before);assert.deepEqual(await readFile(result.archive),before)
  assert.deepEqual(await readFile(packPath(f.dataset,'priconne')),source)
  const data=await loadReview(result.dataset,join(result.round,'ratings.json'))
  assert.equal(data.mode,'tiers')
  for(const pack of data.packs) {
    assert.deepEqual(pack.members.map(m=>[m.id,m.rating]),[['unit0',1],['unit1',2]])
    for(const member of pack.members)assert.deepEqual(await readFile(join(result.dataset,member.art.path)),await readFile(join(f.dataset,member.art.path)))
  }
  assert.deepEqual((await readdir(join(result.dataset,'cast'))).sort(),['unit0.01234567.jpg','unit1.01234567.jpg'])
  await assert.rejects(startTierRound(f.content,'another','roles2'),/completed ranking/)
})
test('all four tiers persist through save, Undo, export/import and reload; removed IDs/art cannot return',async t=>{
  const f=await fixture(t),result=await startTierRound(f.content,'survivors','roles'),file=join(result.round,'ratings.json')
  const request=await requestFixture(result.dataset,file),initial=(await request('/api/review')).json(),token=initial.token
  const vote=(id,rating,revision)=>request('/api/votes',{roundId:'roles',revision,entries:[{franchise:'priconne',id,rating}]},token)
  for(const [rating,revision] of [[3,0],[4,1],[2,2],[1,3]])assert.equal((await vote('unit0',rating,revision)).status,200)
  const exported=(await request('/api/export')).json()
  assert.equal(exported.schemaVersion,2);assert.equal(exported.mode,'tiers')
  assert.deepEqual(Object.keys(exported.ratings.priconne),['unit0','unit1'])
  assert.equal((await vote('unit2',4,4)).status,400)
  for(const rating of [-2,-1,0,5])assert.equal((await vote('unit0',rating,4)).status,400)
  for(const path of ['/art/cast/unit2.01234567.jpg','/art/cast/unit3.01234567.jpg'])assert.equal((await request(path)).status,404)
  assert.equal((await request('/api/import',{roundId:'roles',revision:4,data:{...exported,ratings:{priconne:{unit2:1}}}},token)).status,400)
  assert.equal((await request('/api/import',{roundId:'roles',revision:4,data:{...exported,schemaVersion:1}},token)).status,400)
  assert.equal((await request('/api/import',{roundId:'ranking',revision:4,data:exported},token)).status,409)
  assert.equal((await request('/api/import',{roundId:'roles',revision:4,data:{...exported,ratings:{priconne:{unit0:4,unit1:3}}}},token)).status,200)
  const reloaded=await loadReview(result.dataset,file)
  assert.deepEqual(reloaded.packs.find(pack=>pack.id==='priconne').members.map(m=>m.rating),[4,3])
  await assert.rejects(saveVotes(result.dataset,file,[{franchise:'priconne',id:'unit0',rating:2}],4),/another tab/)
  assert.equal((await readdir(join(result.round,'history'))).length,6)
  const fresh=await requestFixture(result.dataset,file)
  assert.deepEqual((await fresh('/api/export')).json().ratings,(await readRatings(file)).ratings)
  await assert.rejects(startRound(f.content,'survivors','bad-carryover'),/cannot be inherited/)
})
test('migration refuses unfinished ranks, corrupt images and existing output without switching projects',async t=>{
  const f=await fixture(t),project=await readFile(join(f.root,'project.json')),baseline=await readRatings(f.file)
  await atomicJson(f.file,{...baseline,ratings:{...baseline.ratings,priconne:{...baseline.ratings.priconne,unit0:0}}})
  await assert.rejects(startTierRound(f.content,'pending','roles'),/Finish ranking/)
  await atomicJson(f.file,baseline)
  await writeFile(join(f.dataset,'cast/unit0.01234567.jpg'),'corrupt')
  await assert.rejects(startTierRound(f.content,'corrupt','roles'),/hash mismatch/)
  assert.deepEqual(await readFile(join(f.root,'project.json')),project)
  await assert.rejects(startTierRound(f.content,'corrupt','other'),/EEXIST/)
  await assert.rejects(startTierRound(f.content,'../bad','roles'),/identity/)
})
test('tier schemas cannot reinterpret legacy votes or restore hidden franchises',()=>{
  const base={schemaVersion:2,mode:'tiers',roundId:'roles',datasetId:'survivors',ratings:{priconne:{unit0:4}}}
  assert.equal(parseRatings(base).ratings.priconne.unit0,4)
  for(const raw of [{...base,mode:'ranking'},{...base,roundId:undefined},{...base,ratings:{nikke:{unit0:1}}},
    {...base,ratings:{priconne:{unit0:-1}}},{...base,schemaVersion:1}])assert.throws(()=>parseRatings(raw))
  assert.equal(parseRatings({schemaVersion:1,ratings:{priconne:{unit0:-2}}}).ratings.priconne.unit0,-2)
})
