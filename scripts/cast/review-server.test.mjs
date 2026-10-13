import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, symlink, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { artPathAllowed, reviewHandler } from './review-server.mjs'
import { ratingsPath, readRatings } from './ratings.mjs'

async function fixture(t) {
  const root=await mkdtemp(join(tmpdir(),'cast-review-server-test-')),release=join(root,'release'),file=ratingsPath(release)
  await mkdir(join(release,'cast'),{recursive:true})
  await writeFile(join(release,'cast/unit0.01234567.png'),'synthetic image')
  await writeFile(join(release,'cast.json'),JSON.stringify({schemaVersion:1,members:[
    {id:'unit0',name:'Synthetic <rival>',art:{path:'cast/unit0.01234567.png',width:1,height:1}},
    {id:'unit1',name:'Synthetic rival two',art:{path:'cast/unit1.01234567.png',width:1,height:1}},
  ]}))
  t.after(()=>rm(root,{recursive:true,force:true}))
  const handler=await reviewHandler({release,file,port:5194,assets:dirname(fileURLToPath(import.meta.url))})
  const request=async(path,{method='GET',host='127.0.0.1:5194',origin,token,body,raw,contentType='application/json'}={})=>{
    const headers={host,...(origin?{origin}:{}),...(token?{'x-review-token':token}:{}),'content-type':contentType}
    const req={url:path,method,headers,async *[Symbol.asyncIterator](){if(raw!==undefined)yield raw;else if(body!==undefined)yield JSON.stringify(body)}}
    const res={headers:{},status:200,setHeader(k,v){this.headers[k]=v},writeHead(status,headers){this.status=status;Object.assign(this.headers,headers)},end(bytes){this.bytes=Buffer.from(bytes)}}
    await handler(req,res)
    return {status:res.status,headers:res.headers,bytes:res.bytes,json:()=>JSON.parse(res.bytes)}
  }
  return {root,release,file,request}
}
test('serves the reviewer and only manifest-listed portraits; refuses traversal, unknown files and escaping symlinks',async t=>{
  const {root,release,request}=await fixture(t)
  assert.equal((await request('/')).status,200)
  assert.equal((await request('/review.js')).headers['X-Content-Type-Options'],'nosniff')
  assert.match((await request('/')).headers['Content-Security-Policy'],/frame-ancestors 'none'/)
  const data=(await request('/api/review')).json()
  assert.equal(data.packs[0].members[0].name,'Synthetic <rival>')
  assert.equal((await request('/art/cast/unit0.01234567.png')).bytes.toString(),'synthetic image')
  for(const path of ['/art/cast/unknown.01234567.png','/art/../cast.json','/art/%2e%2e%2fsecret','/content/cast.json','/api/private','/art/cast/unit0.png']) assert.equal((await request(path)).status,404)
  await writeFile(join(root,'outside.png'),'private')
  await symlink(join(root,'outside.png'),join(release,'cast/unit1.01234567.png'))
  assert.equal((await request('/art/cast/unit1.01234567.png')).status,404)
  assert.equal(artPathAllowed('nikke/cast/unit0.01234567.webp'),true)
  assert.equal(artPathAllowed('cast/../unit0.01234567.webp'),false)
})
test('Host, Origin, per-process token and JSON limits protect writes; simultaneous tabs serialize with revision conflicts',async t=>{
  const {request,file}=await fixture(t),data=(await request('/api/review')).json()
  const body={revision:0,entries:[{franchise:'priconne',id:'unit0',rating:2}]},origin='http://127.0.0.1:5194',token=data.token
  assert.equal((await request('/api/review',{host:'evil.example:5194'})).status,403)
  assert.equal((await request('/api/review',{origin:'https://evil.example'})).status,403)
  for(const options of [{body},{body,origin},{body,origin,token:'wrong'},{body,origin:'https://evil.example',token},{body,origin,token,host:'localhost:5194'}])
    assert.equal((await request('/api/votes',{method:'POST',...options})).status,403)
  assert.equal((await request('/api/votes',{method:'POST',origin,token,body,contentType:'text/plain'})).status,400)
  assert.equal((await request('/api/votes',{method:'POST',origin,token,raw:'x'.repeat(256*1024+1)})).status,400)
  const results=await Promise.all([0,1].map(()=>request('/api/votes',{method:'POST',origin,token,body})))
  assert.deepEqual(results.map(r=>r.status).sort(),[200,409])
  assert.equal((await readRatings(file)).ratings.priconne.unit0,2)
})
test('ratings-only import/export round trips, rejects unknown members, and has no publishing endpoint',async t=>{
  const {request}=await fixture(t),data=(await request('/api/review')).json()
  const options={method:'POST',origin:'http://127.0.0.1:5194',token:data.token}
  const imported={schemaVersion:1,ratings:{priconne:{unit0:2,unit1:-2}}}
  assert.equal((await request('/api/import',{...options,body:{revision:0,data:imported}})).status,200)
  const exported=(await request('/api/export')).json()
  assert.deepEqual(exported.ratings,imported.ratings)
  assert.equal((await request('/api/import',{...options,body:{revision:1,data:{schemaVersion:1,ratings:{priconne:{missing:2}}}}})).status,400)
  assert.equal((await request('/api/publish',{...options,body:{}})).status,404)
})
