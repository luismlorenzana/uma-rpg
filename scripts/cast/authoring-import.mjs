// Review-only sources. Never reads/writes the game release except to copy the owner's existing AL cache.
import { readFile, mkdir, writeFile, rename, stat } from 'node:fs/promises'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash, randomUUID } from 'node:crypto'
import { setTimeout as delay } from 'node:timers/promises'
import { atomicJson } from './ratings.mjs'

export const JP_LIST = 'https://gamewith.jp/pricone-re/article/show/92923'
export const digest = bytes => createHash('sha256').update(bytes).digest('hex')
const decode = s => s.replace(/&(?:amp|quot|apos|lt|gt);/g, x => ({'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>'}[x]))
export function jpRoster(html) {
  const rows = [...html.matchAll(/<tr\b[^>]*class="w-idb-element[^>]*data-col1="([^"]+)"[^>]*>([\s\S]*?)<\/tr>/g)]
  const members = rows.map(row => {
    const page = row[2].match(/href=['"](https:\/\/gamewith\.jp\/pricone-re\/article\/show\/(\d+))['"]/)
    const face = row[2].match(/<img\b[^>]*src=['"](https:\/\/img\.gamewith\.jp\/[^'"]+)['"]/)
    if (!page || !face) throw new Error('Incomplete JP roster row')
    return {id:'gw-'+page[2], name:decode(row[1]), page:page[1], faceUrl:decode(face[1])}
  })
  if (!members.length || new Set(members.map(m=>m.id)).size !== members.length) throw new Error('Missing or duplicate JP roster')
  return members
}
export function jpSplash(html) {
  const block = html.match(/<div\b[^>]*class=['"]pcr_img_charatop['"][^>]*>([\s\S]*?)<\/div>/)
  const image = block?.[1].match(/<img\b[^>]*src=['"](https:\/\/img\.gamewith\.jp\/[^'"]+)['"]/)
  if (!image) throw new Error('Missing character evaluation splash')
  return decode(image[1])
}
export function sourceImage(bytes) {
  if (bytes.length >= 24 && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) {
    return {ext:'png',width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)}
  }
  if (bytes[0]===255 && bytes[1]===216) {
    let i=2
    while (i+4<=bytes.length) {
      if(bytes[i++]!==255) throw new Error('Invalid JPEG marker')
      while(bytes[i]===255)i++
      const marker=bytes[i++]
      if(marker===0xd9 || marker===0xda)break
      if(marker===0x01 || (marker>=0xd0 && marker<=0xd7))continue
      if(i+2>bytes.length)break
      const length=bytes.readUInt16BE(i)
      if(length<2 || i+length>bytes.length)break
      if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker) && length>=8)
        return {ext:'jpg',width:bytes.readUInt16BE(i+5),height:bytes.readUInt16BE(i+3)}
      i+=length
    }
  }
  throw new Error('Unsupported or invalid original image')
}
const inside = (root,path) => resolve(path).startsWith(resolve(root)+'/')
export async function importSources(content, datasetId, {fetcher=fetch, sleep=delay, log=console.log, cachedPages=false}={}) {
  if(!/^[a-z0-9-]{1,64}$/.test(datasetId))throw new Error('Invalid dataset ID')
  content=resolve(content)
  const root=join(content,'authoring/datasets',datasetId),cache=join(content,'authoring/cache/gamewith')
  try {await stat(join(root,'in-use.json'));throw new Error('Dataset is used by a round; choose a new ID')}
  catch(error){if(error.code!=='ENOENT')throw error}
  try { const manifest=JSON.parse(await readFile(join(root,'dataset.json'),'utf8')); if(manifest.complete)throw new Error('Dataset already complete; choose a new ID') }
  catch(error){if(error.code!=='ENOENT')throw error}
  await mkdir(cache,{recursive:true}); await mkdir(join(root,'cast'),{recursive:true});await mkdir(join(root,'azurlane/cast'),{recursive:true})
  const last=new Map(),blockedHosts=new Set()
  async function cached(url,kind) {
    const u=new URL(url)
    if(!['gamewith.jp','img.gamewith.jp'].includes(u.hostname) || u.protocol!=='https:')throw new Error('Unexpected source host')
    const file=join(cache,digest(url)+(kind==='page'?'.html':'.image'))
    try{return await readFile(file)}catch(error){if(error.code!=='ENOENT')throw error}
    if(kind==='page' && cachedPages)throw new Error('Character page not cached; no page request made')
    if(blockedHosts.has(u.hostname))throw new Error('Source host refused access; remaining requests stopped')
    for(let attempt=0;attempt<3;attempt++) {
      await sleep(Math.max(0,(last.get(u.hostname)??0)+(kind==='page'?1000:300)-Date.now()))
      last.set(u.hostname,Date.now())
      const response=await fetcher(url,{headers:{'User-Agent':'uma-rpg-private-portrait-review/1.0'},signal:AbortSignal.timeout(30000),redirect:'error'})
      if(response.status===429 || response.status>=500){await sleep(2000*(attempt+1));continue}
      if(response.status===401 || response.status===403)blockedHosts.add(u.hostname)
      if(!response.ok)throw new Error('Source HTTP '+response.status+' at '+u.hostname)
      const bytes=Buffer.from(await response.arrayBuffer())
      if(kind!=='page')sourceImage(bytes)
      const temp=file+'.'+randomUUID()+'.tmp';await writeFile(temp,bytes,{mode:0o600});await rename(temp,file)
      return bytes
    }
    throw new Error('Source unavailable after retries')
  }
  async function image(bytes,id,prefix,url) {
    const info=sourceImage(bytes),sha256=digest(bytes),path=prefix+'cast/'+id+'.'+sha256.slice(0,8)+'.'+info.ext
    const target=join(root,path)
    try { await writeFile(target,bytes,{flag:'wx',mode:0o600}) }
    catch(error){if(error.code!=='EEXIST' || digest(await readFile(target))!==sha256)throw error}
    return {path,width:info.width,height:info.height,sha256,...(url?{sourceUrl:url}:{})}
  }
  const listBytes=await cached(JP_LIST,'page'),roster=jpRoster(listBytes.toString('utf8')),jp=[],missing=[]
  await atomicJson(join(root,'roster.json'),{schemaVersion:1,source:JP_LIST,sha256:digest(listBytes),members:roster})
  log('JP roster: '+roster.length+' variants')
  for(const [index,member] of roster.entries()) {
    let face
    try {
      // Faces come directly from the accessible list; never guess URLs to bypass refused character pages.
      face=await image(await cached(member.faceUrl,'image'),member.id+'-face','',member.faceUrl)
      const page=await cached(member.page,'page'),url=jpSplash(page.toString('utf8'))
      const art=await image(await cached(url,'image'),member.id,'',url)
      jp.push({id:member.id,name:member.name,nameJa:member.name,art,face,source:{page:member.page,pageSha256:digest(page),kind:'evaluation-splash'}})
    }catch(error){
      missing.push({id:member.id,name:member.name,page:member.page,error:error.message})
      if(face)jp.push({id:member.id,name:member.name,nameJa:member.name,art:face,face,source:{page:member.page,kind:'list-face-only',missingSplash:true}})
      if(!cachedPages)log('Unresolved '+member.id+': '+error.message)
    }
    if((index+1)%10===0 || index===roster.length-1)log('JP '+(index+1)+'/'+roster.length+' · splashes '+jp.filter(m=>!m.source.missingSplash).length+' · unresolved '+missing.length)
  }
  await atomicJson(join(root,'cast.json'),{schemaVersion:1,source:JP_LIST,members:jp})
  const alSource=JSON.parse(await readFile(join(content,'release/azurlane/cast.json'),'utf8')),al=[]
  for(const member of alSource.members.filter(m=>!['Normal','Rare'].includes(m.rarity))) {
    if(!/^[a-z0-9_-]{1,60}$/.test(member.id) || !member.rarity)throw new Error('Invalid local AL source')
    const full=join(content,'.cache/azurlane',member.id+'-full.png'),faceFile=join(content,'.cache/azurlane',member.id+'.png')
    if(!inside(content,full) || !(await stat(full)).isFile())throw new Error('Missing AL original '+member.id)
    const art=await image(await readFile(full),member.id,'azurlane/',member.art.sourceUrl)
    const face=await image(await readFile(faceFile),member.id+'-face','azurlane/',member.face?.sourceUrl)
    al.push({id:member.id,name:member.name,rarity:member.rarity,art,face,source:{kind:'owner-existing-original-cache',page:'https://azurlane.koumakan.jp/wiki/'+encodeURIComponent(member.name.replaceAll(' ','_'))}})
  }
  await atomicJson(join(root,'azurlane/cast.json'),{schemaVersion:1,source:'owner-existing-original-cache',members:al})
  const manifest={schemaVersion:1,id:datasetId,capturedAt:new Date().toISOString(),complete:!missing.length,rosterComplete:jp.length===roster.length,
    sources:{priconne:{url:JP_LIST,rosterSha256:digest(listBytes),expected:roster.length,faces:jp.length,downloaded:jp.filter(m=>!m.source.missingSplash).length},azurlane:{url:'https://azurlane.koumakan.jp/wiki/List_of_Ships',localSourceSha256:digest(await readFile(join(content,'release/azurlane/cast.json'))),downloaded:al.length,excludedRarities:['Normal','Rare']}},missing}
  await atomicJson(join(root,'dataset.json'),manifest)
  log(JSON.stringify({dataset:root,complete:manifest.complete,priconne:jp.length,azurlane:al.length,missing:missing.length}))
  if(missing.length)throw new Error('Import incomplete; rerun the same ID to resume from cache')
  return manifest
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const [content,id]=process.argv.slice(2).filter(arg=>arg!=='--cached-pages')
  if(!content || !id)throw new Error('Usage: node scripts/cast/authoring-import.mjs <private-content-folder> <new-dataset-id>')
  await importSources(content,id,{cachedPages:process.argv.includes('--cached-pages')})
}
