// Retire redundant LOCAL image copies, not the locked packs or phone release. Dry-run unless --apply.
import { createHash, randomUUID } from 'node:crypto'
import { readFile, readdir, lstat, realpath, open, mkdir, rename, mkdtemp } from 'node:fs/promises'
import { dirname, join, resolve, relative, sep } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const sha=bytes=>createHash('sha256').update(bytes).digest('hex')
const inside=(root,path)=>path.startsWith(root+sep)
const safeRelative=path=>typeof path==='string' && path.length>0 && !path.startsWith('/') && !path.includes('\\') && !path.split('/').some(part=>!part||part==='.'||part==='..')
const scans=['authoring','.cache','release','l2d','sources']
const apps=['Portrait Review.command','tools/cast-review','tools/cast-export']
const tiers={1:'regular',2:'key',3:'subboss',4:'boss'}
async function json(file){return JSON.parse(await readFile(file,'utf8'))}
async function syncDirectory(path) {
  const handle=await open(path,'r');try{await handle.sync()}finally{await handle.close()}
}
async function atomicJson(file,data) {
  await mkdir(dirname(file),{recursive:true});const temp=file+'.'+randomUUID()+'.tmp',handle=await open(temp,'wx',0o600)
  try{await handle.writeFile(JSON.stringify(data,null,2)+'\n');await handle.sync()}finally{await handle.close()}
  await rename(temp,file)
  await syncDirectory(dirname(file))
}
async function recordFile(content,path,expectedHash,expectedSize) {
  if(!inside(content,resolve(path)) || !inside(content,await realpath(path)))throw new Error('Protected path escapes content')
  const bytes=await readFile(path),hash=sha(bytes)
  if(expectedHash && hash!==expectedHash || expectedSize!==undefined && bytes.length!==expectedSize)throw new Error('Protected asset changed: '+relative(content,path))
  return {path:relative(content,path),sha256:hash,bytes:bytes.length}
}
/** Check every rebuild input and current game asset before considering any cleanup. */
export async function auditKeep(content) {
  content=await realpath(content)
  const exports=join(content,'authoring/exports'),kept=[],bundles=[],sourceUnits=new Map()
  for(const pointer of ['latest.json','latest-nikke.json']) {
    const marker=await json(join(exports,pointer));if(!/^[a-z0-9-]{1,120}$/.test(marker.id))throw new Error('Unsafe locked bundle ID')
    const folder=join(exports,marker.id),manifestFile=join(folder,'manifest.json')
    kept.push(await recordFile(content,join(exports,pointer)))
    kept.push(await recordFile(content,manifestFile,marker.manifestSha256))
    const complete=await json(join(folder,'complete.json'));if(complete.manifestSha256!==marker.manifestSha256)throw new Error('Incomplete locked bundle')
    kept.push(await recordFile(content,join(folder,'complete.json')))
    const manifest=await json(manifestFile)
    if(manifest.id!==marker.id || !manifest.complete || !Array.isArray(manifest.units) || !manifest.units.length)throw new Error('Invalid locked bundle')
    bundles.push(marker.id)
    for(const unit of manifest.units) {
      if(!['priconne','azurlane','nikke'].includes(unit.franchise) || !tiers[unit.tier] || sourceUnits.has(unit.id))throw new Error('Invalid locked unit')
      sourceUnits.set(unit.id,unit)
      for(const asset of Object.values(unit.assets)) {
        if(!safeRelative(asset.path) || !/^[a-f0-9]{64}$/.test(asset.sha256))throw new Error('Unsafe locked asset')
        kept.push(await recordFile(content,join(folder,asset.path),asset.sha256,asset.bytes))
      }
    }
  }
  const releaseFile=join(content,'enemies-release/enemies.json'),release=await json(releaseFile)
  if(release.schemaVersion!==2 || JSON.stringify([...release.sources].sort())!==JSON.stringify([...bundles].sort()) || release.units.length!==sourceUnits.size)throw new Error('Release and locked bundles differ')
  kept.push(await recordFile(content,releaseFile))
  const seen=new Set()
  for(const unit of release.units) {
    const original=sourceUnits.get(unit.id)
    if(!original || seen.has(unit.id) || original.franchise!==unit.franchise || tiers[original.tier]!==unit.tier)throw new Error('Release unit differs from locked input')
    seen.add(unit.id)
    for(const [role,from] of [['face','face'],['art','vertical'],['splash','splash']]) {
      const asset=unit[role]
      if(!asset && role==='splash' && unit.tier==='regular')continue
      if(!asset || !original.assets[from] || !/^enemies\/[a-z0-9-]+-(face|art|splash)\.[a-f0-9]{8}\.webp$/.test(asset.path))throw new Error('Invalid release image')
      const record=await recordFile(content,join(content,'enemies-release',asset.path),undefined,asset.bytes)
      if(!asset.path.endsWith('.'+record.sha256.slice(0,8)+'.webp'))throw new Error('Release image hash mismatch')
      kept.push(record)
    }
  }
  return {content,bundles,units:release.units.length,kept}
}
async function bytesIn(path) {
  const info=await lstat(path)
  if(!info.isDirectory())return info.size
  let bytes=0;for(const entry of await readdir(path))bytes+=await bytesIn(join(path,entry));return bytes
}
async function imageFile(path) {
  const file=await open(path,'r'),head=Buffer.alloc(512);let length
  try{length=(await file.read(head,0,head.length,0)).bytesRead}finally{await file.close()}
  const b=head.subarray(0,length)
  return b.subarray(0,8).toString('hex')==='89504e470d0a1a0a' || b[0]===255&&b[1]===216 ||
    b.toString('ascii',0,6).startsWith('GIF8') || b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP' ||
    b.toString('ascii',4,8)==='ftyp'&&/avif|avis|heic/.test(b.toString('ascii',8,32)) ||
    /\.svg$/i.test(path)&&/<svg\b/.test(b.toString('utf8'))
}
export async function planCleanup(content) {
  const audit=await auditKeep(content);content=audit.content
  const candidates=[],protectedExports=join(content,'authoring/exports')
  async function scan(path) {
    if(path===protectedExports)return // Canonical locked PNGs, including earlier complete versions, are rebuild inputs.
    let entries;try{
      if((await lstat(path)).isSymbolicLink())return
      if(!inside(content,await realpath(path)))throw new Error('Cleanup directory escapes content')
      entries=await readdir(path,{withFileTypes:true})
    }catch(error){if(error.code==='ENOENT')return;throw error}
    for(const entry of entries) {
      const file=join(path,entry.name)
      if(entry.isSymbolicLink())continue // Never follow a source/cache link outside the owned content tree.
      if(entry.isDirectory())await scan(file)
      else if(entry.isFile() && await imageFile(file)) {
        const info=await lstat(file);candidates.push({path:relative(content,file),kind:'image',bytes:info.size,mtimeMs:info.mtimeMs})
      }
    }
  }
  for(const root of scans)await scan(join(content,root))
  for(const app of apps) {
    const path=join(content,app);try{const info=await lstat(path);if(info.isSymbolicLink() || !inside(content,await realpath(path)))throw new Error('Retired app escapes content');candidates.push({path:app,kind:'retired-app',bytes:await bytesIn(path),mtimeMs:info.mtimeMs})}catch(error){if(error.code!=='ENOENT')throw error}
  }
  candidates.sort((a,b)=>a.path.localeCompare(b.path))
  const totals={images:candidates.filter(entry=>entry.kind==='image').length,retiredApps:candidates.filter(entry=>entry.kind==='retired-app').length,bytes:candidates.reduce((n,entry)=>n+entry.bytes,0)}
  return {schemaVersion:1,plannedAt:new Date().toISOString(),...audit,candidates,totals}
}
/** Never deletes: moves exact validated candidates into a new recoverable Trash folder, with a durable journal. */
export async function applyCleanup(content,{trashBase=join(homedir(),'.Trash'),log=()=>{}}={}) {
  const plan=await planCleanup(content);content=plan.content
  await mkdir(trashBase,{recursive:true});trashBase=await realpath(trashBase)
  if(trashBase===content || inside(content,trashBase) || inside(trashBase,content))throw new Error('Trash and content must be separate')
  const trash=await mkdtemp(join(trashBase,'uma-rpg-retired-portraits-'))
  const id=trash.split(sep).at(-1),receiptRoot=join(content,'authoring/maintenance',id)
  await mkdir(receiptRoot,{recursive:true})
  if(!inside(content,await realpath(receiptRoot)))throw new Error('Receipt directory escapes content')
  await atomicJson(join(receiptRoot,'plan.json'),{...plan,trash})
  await atomicJson(join(trash,'RECOVERY.json'),{content,receiptRoot,policy:'Move files/<relative path> back under content; app/<relative path> restores retired tools. Never overwrite a newer file.',plan})
  await mkdir(receiptRoot,{recursive:true});const journal=await open(join(receiptRoot,'moves.jsonl'),'ax',0o600);let moved=0
  try {
    for(const entry of plan.candidates) {
      if(!safeRelative(entry.path))throw new Error('Unsafe cleanup path')
      const source=join(content,entry.path),target=join(trash,entry.kind==='image'?'files':'app',entry.path)
      if(!inside(content,source) || !inside(trash,target))throw new Error('Cleanup escapes owned folders')
      const info=await lstat(source)
      if(info.isSymbolicLink() || !inside(content,await realpath(source)) || info.mtimeMs!==entry.mtimeMs || entry.kind==='image'&&info.size!==entry.bytes)throw new Error('Cleanup candidate changed')
      const sha256=entry.kind==='image'?sha(await readFile(source)):null
      await mkdir(dirname(target),{recursive:true})
      await journal.write(JSON.stringify({state:'intent',...entry,source,target,sha256})+'\n');await journal.sync()
      await rename(source,target)
      await syncDirectory(dirname(target));await syncDirectory(dirname(source))
      await journal.write(JSON.stringify({state:'moved',source,target,sha256})+'\n');await journal.sync()
      moved++;if(moved%1000===0)log({moved,total:plan.candidates.length})
    }
  }finally{await journal.close()}
  for(const file of plan.kept)await recordFile(content,join(content,file.path),file.sha256,file.bytes)
  const receipt={schemaVersion:1,completedAt:new Date().toISOString(),trash,receiptRoot,moved,totals:plan.totals,units:plan.units,bundles:plan.bundles,protectedFilesVerified:plan.kept.length}
  await atomicJson(join(receiptRoot,'complete.json'),receipt)
  await atomicJson(join(content,'authoring/maintenance/latest-cleanup.json'),receipt)
  return receipt
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const [content,...flags]=process.argv.slice(2)
  if(!content || flags.some(flag=>flag!=='--apply'))throw new Error('Usage: node scripts/enemies/cleanup-local.mjs <private-content-folder> [--apply]')
  const result=flags.includes('--apply')?await applyCleanup(content,{log:console.log}):await planCleanup(content)
  console.log({applied:flags.includes('--apply'),units:result.units,bundles:result.bundles,totals:result.totals,...(result.trash?{trash:result.trash,receiptRoot:result.receiptRoot}:{})})
}
