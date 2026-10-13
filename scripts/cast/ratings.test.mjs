import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { loadReview, packPath, parseRatings, ratingsPath, readRatings, saveVotes } from './ratings.mjs'

async function fixture(t) {
  const root=await mkdtemp(join(tmpdir(),'cast-ratings-test-')),release=join(root,'release'),file=ratingsPath(release)
  t.after(()=>rm(root,{recursive:true,force:true}))
  for(const [pack,count] of [['priconne',3],['nikke',2],['azurlane',4]]) {
    const raw={schemaVersion:1,source:'synthetic',avatar:{x:.5,y:0,size:.3},extra:{keep:true},members:Array.from({length:count},(_,i)=>
      ({id:'unit'+i,name:'Synthetic rival '+i,color:'#777777',extra:i,art:{path:(pack==='priconne'?'':pack+'/')+'cast/unit'+i+'.01234567.png',width:1,height:1}}))}
    const path=packPath(release,pack)
    await mkdir(join(path,'..'),{recursive:true}); await writeFile(path,JSON.stringify(raw))
  }
  return {root,release,file}
}
test('starts smallest first, displays persisted votes, and never changes any cast manifest',async t=>{
  const {release,file}=await fixture(t)
  const originals=await Promise.all(['priconne','nikke','azurlane'].map(p=>readFile(packPath(release,p),'utf8')))
  assert.deepEqual((await loadReview(release,file)).packs.map(p=>[p.id,p.members.length]),[['priconne',3],['azurlane',4]])
  await saveVotes(release,file,[{franchise:'priconne',id:'unit0',rating:2}],0)
  const loaded=await loadReview(release,file)
  assert.equal(loaded.packs[0].members[0].rating,2)
  assert.equal(loaded.packs[0].members[0].extra,0)
  assert.deepEqual(loaded.packs[0].avatar,{x:.5,y:0,size:.3})
  assert.deepEqual(await Promise.all(['priconne','nikke','azurlane'].map(p=>readFile(packPath(release,p),'utf8'))),originals)
})
test('votes survive reimports by stable ID and zero clears a vote in the separate file only',async t=>{
  const {release,file}=await fixture(t)
  await saveVotes(release,file,[{franchise:'priconne',id:'unit1',rating:-2}],0)
  const raw=JSON.parse(await readFile(packPath(release,'priconne'),'utf8'))
  raw.members[1].name='Reimported synthetic rival'
  await writeFile(packPath(release,'priconne'),JSON.stringify(raw))
  const before=await readFile(packPath(release,'priconne'),'utf8')
  assert.equal((await loadReview(release,file)).packs.find(p=>p.id==='priconne').members[1].rating,-2)
  await saveVotes(release,file,[{franchise:'priconne',id:'unit1',rating:0}],1)
  assert.equal((await loadReview(release,file)).packs.find(p=>p.id==='priconne').members[1].rating,0)
  assert.equal(await readFile(packPath(release,'priconne'),'utf8'),before)
})
test('bad values, prototype keys and unknown IDs fail atomically; stale revisions do not overwrite votes',async t=>{
  const {release,file}=await fixture(t)
  await saveVotes(release,file,[{franchise:'azurlane',id:'unit0',rating:1}],0)
  const before=await readFile(file,'utf8')
  for(const entries of [
    [{franchise:'azurlane',id:'unit1',rating:2},{franchise:'azurlane',id:'missing',rating:2}],
    [{franchise:'azurlane',id:'unit1',rating:'2'}],[{franchise:'other',id:'unit1',rating:1}],
    [{franchise:'azurlane',id:'__proto__',rating:1}],
  ]) await assert.rejects(saveVotes(release,file,entries,1))
  await assert.rejects(saveVotes(release,file,[{franchise:'azurlane',id:'unit0',rating:2}],0),/another tab/)
  assert.equal(await readFile(file,'utf8'),before)
  for(const raw of [{schemaVersion:2,ratings:{}},{schemaVersion:1,ratings:{nikke:{unit0:3}}},{schemaVersion:1,ratings:{other:{unit0:1}}},
    JSON.parse('{"schemaVersion":1,"ratings":{"nikke":{"__proto__":2}}}')]) assert.throws(()=>parseRatings(raw))
  assert.deepEqual(parseRatings(JSON.parse(before)),await readRatings(file))
})
