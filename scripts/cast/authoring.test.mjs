import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { importSources, jpRoster, jpSplash, sourceImage, digest } from './authoring-import.mjs'
import { startRound, projectPaths } from './authoring-round.mjs'
import { readRatings, saveVotes, loadReview } from './ratings.mjs'
import { reviewHandler } from './review-server.mjs'

const row=(number,name)=>`<tr class="w-idb-element r3" data-col1="${name}"><td><a href='https://gamewith.jp/pricone-re/article/show/${number}'><img src='https://img.gamewith.jp/test/${number}_i.png'></a></td></tr>`
const roster=row(111,'Synthetic base')+row(222,'Synthetic base (Variant)')
const splash=n=>`<img src='https://img.gamewith.jp/test/wrong.png'><div class="pcr_img_charatop"><a><img src='https://img.gamewith.jp/test/${n}_main.jpg'></a></div>`
function png(){const b=Buffer.alloc(24);Buffer.from([137,80,78,71,13,10,26,10]).copy(b);b.writeUInt32BE(16,16);b.writeUInt32BE(24,20);return b}
const jpg=Buffer.from([255,216,255,224,0,2,255,192,0,8,8,0,24,0,32,3,255,217])
async function fixture(t) {
  const content=await mkdtemp(join(tmpdir(),'authoring-test-'))
  t.after(()=>rm(content,{recursive:true,force:true}))
  await mkdir(join(content,'release/azurlane'),{recursive:true});await mkdir(join(content,'.cache/azurlane'),{recursive:true})
  await writeFile(join(content,'release/cast.json'),JSON.stringify({schemaVersion:1,members:[{id:'base',name:'Old label',nameJa:'Synthetic base'}]}))
  await writeFile(join(content,'release/azurlane/cast.json'),JSON.stringify({schemaVersion:1,members:[
    {id:'al-synthetic',name:'Synthetic ship',rarity:'Elite',art:{}},
    {id:'al-normal',name:'Synthetic normal',rarity:'Normal'},
    {id:'al-rare',name:'Synthetic rare',rarity:'Rare'},
  ]}))
  for(const suffix of ['-full.png','.png'])await writeFile(join(content,'.cache/azurlane/al-synthetic'+suffix),png())
  const votes={schemaVersion:1,revision:7,ratings:{priconne:{base:2},azurlane:{'al-synthetic':1,'al-normal':-1},nikke:{archived:2}}}
  await writeFile(join(content,'cast-ratings.json'),JSON.stringify(votes))
  const calls=[],fetcher=async url=>{
    calls.push(url)
    const bytes=url.endsWith('/92923')?Buffer.from(roster):url.includes('gamewith.jp/pricone')?Buffer.from(splash(url.endsWith('/111')?111:222)):url.endsWith('.jpg')?jpg:png()
    return {ok:true,status:200,arrayBuffer:async()=>bytes}
  }
  return {content,votes,calls,fetcher}
}
test('JP variants are stable, evaluation splash is selected, PNG/JPEG dimensions are read without cropping',()=>{
  assert.deepEqual(jpRoster(roster).map(m=>[m.id,m.name]),[['gw-111','Synthetic base'],['gw-222','Synthetic base (Variant)']])
  assert.equal(jpSplash(splash(111)),'https://img.gamewith.jp/test/111_main.jpg')
  assert.throws(()=>jpRoster(roster+row(111,'Duplicate')),/duplicate/)
  assert.throws(()=>jpSplash('<img src="https://img.gamewith.jp/test/wrong.jpg">'),/Missing/)
  assert.deepEqual(sourceImage(jpg),{ext:'jpg',width:32,height:24})
  assert.deepEqual(sourceImage(png()),{ext:'png',width:16,height:24})
  assert.throws(()=>sourceImage(Buffer.from('not an image')))
})
test('private import is cached, complete before activation, excludes AL low rarities and never alters release/votes',async t=>{
  const {content,fetcher,calls}=await fixture(t)
  const before=await readFile(join(content,'cast-ratings.json')),manifest=await importSources(content,'synthetic',{fetcher,sleep:async()=>{},log:()=>{}})
  assert.equal(manifest.complete,true);assert.equal(manifest.sources.priconne.downloaded,2);assert.equal(manifest.sources.azurlane.downloaded,1)
  const dataset=join(content,'authoring/datasets/synthetic'),pack=JSON.parse(await readFile(join(dataset,'cast.json')))
  assert.equal(pack.members[0].art.sha256,digest(jpg));assert.deepEqual(await readFile(join(dataset,pack.members[0].art.path)),jpg)
  assert.deepEqual(await readFile(join(content,'cast-ratings.json')),before)
  assert.equal(calls.length,7)
  await assert.rejects(importSources(content,'synthetic',{fetcher}),/already complete/)
  await assert.rejects(readFile(join(content,'authoring/project.json')),/ENOENT/)
  // Incomplete imports resume from cached successful sources, never promote the app automatically.
  await writeFile(join(dataset,'dataset.json'),JSON.stringify({...manifest,complete:false}))
  calls.length=0
  await importSources(content,'synthetic',{fetcher,sleep:async()=>{},log:()=>{}})
  assert.equal(calls.length,0)
})
test('cached-pages mode never requests an uncached character page and reports missing splashes without activation',async t=>{
  const {content,fetcher,calls}=await fixture(t)
  const manifest=await importSources(content,'synthetic',{fetcher,sleep:async()=>{},log:()=>{}})
  const dataset=join(content,'authoring/datasets/synthetic')
  await writeFile(join(dataset,'dataset.json'),JSON.stringify({...manifest,complete:false}))
  const page='https://gamewith.jp/pricone-re/article/show/222'
  await rm(join(content,'authoring/cache/gamewith',digest(page)+'.html'))
  calls.length=0
  await assert.rejects(importSources(content,'synthetic',{cachedPages:true,fetcher,sleep:async()=>{},log:()=>{}}),/incomplete/)
  assert.equal(calls.length,0,'no character page or other network request was made')
  const result=JSON.parse(await readFile(join(dataset,'dataset.json')))
  assert.equal(result.complete,false);assert.equal(result.rosterComplete,true);assert.equal(result.sources.priconne.faces,2)
  assert.equal(result.missing.length,1)
  assert.equal(JSON.parse(await readFile(join(dataset,'cast.json'))).members[1].source.missingSplash,true)
  await assert.rejects(startRound(content,'synthetic','incomplete-round'),/complete/)
})
test('a refused source host is not requested again; accessible list faces do not bypass character pages',async t=>{
  const {content,fetcher,calls}=await fixture(t)
  const refused=async url=>{
    if(url.endsWith('/111')){calls.push(url);return{ok:false,status:403}}
    return fetcher(url)
  }
  await assert.rejects(importSources(content,'synthetic',{fetcher:refused,sleep:async()=>{},log:()=>{}}),/incomplete/)
  assert.equal(calls.filter(u=>u.includes('/article/show/') && !u.endsWith('/92923')).length,1)
  assert.equal(calls.some(u=>u.endsWith('/222')),false)
})
test('owner-requested fresh rounds start with no votes or hints, archive all earlier votes and permit explicit face-only fallbacks',async t=>{
  const {content,fetcher}=await fixture(t)
  const manifest=await importSources(content,'synthetic',{fetcher,sleep:async()=>{},log:()=>{}})
  const dataset=join(content,'authoring/datasets/synthetic'),file=join(content,'cast-ratings.json'),before=await readFile(file)
  await writeFile(join(dataset,'dataset.json'),JSON.stringify({...manifest,complete:false,rosterComplete:true,missing:[{id:'gw-222',error:'Splash pending'}]}))
  const pack=JSON.parse(await readFile(join(dataset,'cast.json')))
  pack.members[1].art=pack.members[1].face;pack.members[1].source.missingSplash=true
  await writeFile(join(dataset,'cast.json'),JSON.stringify(pack))
  await assert.rejects(startRound(content,'synthetic','fresh-round',{resetVotes:true}),/complete/)
  const result=await startRound(content,'synthetic','fresh-round',{resetVotes:true,allowMissingSplashes:true})
  const paths=await projectPaths(join(content,'authoring/project.json')),data=await loadReview(paths.release,paths.file)
  assert.equal(data.packs.flatMap(p=>p.members).every(m=>m.rating===0 && m.previousRating===undefined),true)
  assert.deepEqual((await readRatings(paths.file)).ratings,{priconne:{},azurlane:{}})
  assert.deepEqual(await readFile(file),before);assert.deepEqual(await readFile(result.archived),before)
  const round=JSON.parse(await readFile(join(result.round,'round.json')))
  assert.equal(round.votesMode,'fresh');assert.equal(round.sourceComplete,false);assert.equal(round.missingSplashes.length,1)
  await assert.rejects(importSources(content,'synthetic',{fetcher}),/used by a round/)
  await saveVotes(paths.release,paths.file,[{franchise:'azurlane',id:'al-synthetic',rating:2}],0)
  assert.deepEqual(await readFile(file),before)
})
test('new rounds retain same-ID votes, keep exact-name hints without assigning base votes to variants, and archive every edit',async t=>{
  const {content,fetcher}=await fixture(t)
  await importSources(content,'synthetic',{fetcher,sleep:async()=>{},log:()=>{}})
  const before=await readFile(join(content,'cast-ratings.json'))
  const {round}=await startRound(content,'synthetic','round-two'),paths=await projectPaths(join(content,'authoring/project.json'))
  await assert.rejects(importSources(content,'synthetic',{fetcher}),/used by a round/)
  let data=await loadReview(paths.release,paths.file)
  assert.deepEqual(data.packs.map(p=>p.id),['azurlane','priconne'])
  const jp=data.packs.find(p=>p.id==='priconne').members
  assert.equal(jp[0].rating,0);assert.equal(jp[0].previousRating,2);assert.equal(jp[1].rating,0);assert.equal(jp[1].previousRating,undefined)
  assert.equal(data.packs[0].members[0].rating,1)
  await saveVotes(paths.release,paths.file,[{franchise:'priconne',id:'gw-222',rating:2}],0)
  await saveVotes(paths.release,paths.file,[{franchise:'priconne',id:'gw-222',rating:-1}],1)
  const history=await readdir(join(round,'history'))
  assert.equal(history.length,3)
  for(const file of history){const snapshot=JSON.parse(await readFile(join(round,'history',file)));assert.equal(snapshot.sha256,digest(JSON.stringify(snapshot.data)))}
  assert.deepEqual(await readFile(join(content,'cast-ratings.json')),before)
  await assert.rejects(startRound(content,'synthetic','round-two'),/EEXIST/)
  await writeFile(paths.file,'corrupted current data')
  await assert.rejects(readRatings(paths.file));assert.equal((await readdir(join(round,'history'))).length,3)
})
test('legacy first-pass edits preserve hidden franchise votes and keep their snapshots in the private authoring folder',async t=>{
  const {content,votes}=await fixture(t),file=join(content,'cast-ratings.json'),release=join(content,'release')
  await saveVotes(release,file,[{franchise:'azurlane',id:'al-synthetic',rating:2}],7)
  const after=await readRatings(file)
  assert.deepEqual(after.ratings.nikke,votes.ratings.nikke)
  assert.equal(after.ratings.azurlane['al-normal'],-1)
  assert.equal((await readdir(join(content,'authoring/legacy-history'))).length,2)
  assert.equal((await loadReview(release,file)).packs.find(p=>p.id==='azurlane').members.length,1)
  await assert.rejects(saveVotes(release,file,[{franchise:'azurlane',id:'al-normal',rating:1}],8),/Unknown/)
  await saveVotes(release,file,[{franchise:'azurlane',id:'al-normal',rating:1}],8,{restoreArchived:true})
  assert.equal((await readRatings(file)).ratings.azurlane['al-normal'],1)
  assert.equal((await loadReview(release,file)).packs.find(p=>p.id==='azurlane').members.length,1)
  await rm(file)
  await assert.rejects(readRatings(file),/Restore it from history/)
  await assert.rejects(loadReview(release,file),/Restore it from history/)
})
test('round API rejects stale clients and cross-round imports, serves JPEG, and detects catalogue mutation',async t=>{
  const {content,fetcher}=await fixture(t)
  await importSources(content,'synthetic',{fetcher,sleep:async()=>{},log:()=>{}});await startRound(content,'synthetic','round-two')
  const paths=await projectPaths(join(content,'authoring/project.json'))
  const handler=await reviewHandler({...paths,port:5194,assets:dirname(fileURLToPath(import.meta.url))})
  async function request(url,body,token) {
    const req={url,method:body?'POST':'GET',headers:{host:'127.0.0.1:5194',origin:'http://127.0.0.1:5194','content-type':'application/json','x-review-token':token},async *[Symbol.asyncIterator](){if(body)yield JSON.stringify(body)}}
    const res={status:200,headers:{},setHeader(k,v){this.headers[k]=v},writeHead(n,h){this.status=n;Object.assign(this.headers,h)},end(b){this.bytes=Buffer.from(b)}}
    await handler(req,res);return res
  }
  const data=JSON.parse((await request('/api/review')).bytes),token=data.token
  const vote={revision:0,entries:[{franchise:'priconne',id:'gw-111',rating:1}]}
  assert.equal((await request('/api/votes',vote,token)).status,409)
  assert.equal((await request('/api/import',{...vote,roundId:'round-two',data:{schemaVersion:1,ratings:{}}},token)).status,409)
  assert.equal((await request('/api/votes',{...vote,roundId:'round-two'},token)).status,200)
  const member=data.packs.find(p=>p.id==='priconne').members[0]
  assert.equal((await request('/art/'+member.art.path)).headers['Content-Type'],'image/jpeg')
  await writeFile(join(paths.release,'cast.json'),'{}')
  await assert.rejects(loadReview(paths.release,paths.file),/catalogue changed/)
})
