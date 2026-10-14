// Execute approved source-pixel recipes locally. No fetch, source mutation, game import or upload.
import { readFile, mkdir, realpath, open, lstat, link, unlink } from 'node:fs/promises'
import { join, dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { randomUUID } from 'node:crypto'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { projectPaths } from './authoring-round.mjs'
import { loadCropSession } from './crop-authoring.mjs'
import { atomicJson } from './ratings.mjs'
import { digest, sourceImage } from './authoring-import.mjs'
import { imageInfo } from './pack.mjs'
import { validRect, outputSize, CROP_ROLES } from './crop-geometry.mjs'

const version=createRequire(import.meta.url)('@napi-rs/canvas/package.json').version
const renderer={pipelineVersion:1,library:'@napi-rs/canvas',version,smoothing:'high',format:'png',limits:CROP_ROLES}
const tiers={1:'Regular',2:'KeyEnemy',3:'MiniBoss',4:'FinalBoss'}
const size=bytes=>bytes.toString('ascii',0,4)==='RIFF'?imageInfo(bytes):sourceImage(bytes)
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b)
async function syncDirectory(path){const dir=await open(path,'r');try{await dir.sync()}finally{await dir.close()}}
async function safeDirectory(root,path) {
  await mkdir(path,{recursive:true})
  if((await lstat(path)).isSymbolicLink() || !((await realpath(path))+sep).startsWith(root+sep))throw new Error('Export path escapes private folder')
}
async function immutable(root,path,bytes) {
  await safeDirectory(root,dirname(path));let handle
  const temp=path+'.'+randomUUID()+'.tmp'
  try {
    // Publish only a fully written inode, without replacing an existing output. Mid-write interruption leaves
    // an unreferenced temp, never a truncated final PNG/snapshot that would prevent safe resume.
    handle=await open(temp,'wx',0o600);await handle.writeFile(bytes);await handle.sync();await handle.close();handle=null
    await link(temp,path)
    await syncDirectory(dirname(path))
  }catch(error){await handle?.close();if(error.code!=='EEXIST')throw error
    if((await lstat(path)).isSymbolicLink() || !(await readFile(path)).equals(bytes))throw new Error('Existing export file differs: '+path)
  }finally{await unlink(temp).catch(error=>{if(error.code!=='ENOENT')throw error})}
}
async function sourceBytes(root,image) {
  if(!image || !/^(?:azurlane\/)?cast\/[a-z0-9_-]{1,60}\.[a-f0-9]{8}\.(png|webp|jpg)$/.test(image.path) || !/^[a-f0-9]{64}$/.test(image.sha256??''))throw new Error('Invalid export source')
  const path=await realpath(join(root,image.path));if(!path.startsWith(root+sep))throw new Error('Export source escapes dataset')
  const bytes=await readFile(path),dimensions=size(bytes)
  if(digest(bytes)!==image.sha256 || dimensions.width!==image.width || dimensions.height!==image.height)throw new Error('Export source changed: '+image.path)
  return bytes
}
/** Fractional coordinates are deliberately not rounded: this is the same nine-argument drawImage used by preview. */
export async function renderCrop(bytes,image,entry) {
  if(!validRect(entry.rect,image,entry.role))throw new Error('Invalid export rectangle')
  const output=outputSize(entry.rect,entry.role);if(!output.width || !output.height)throw new Error('Crop too small to export')
  const original=await loadImage(bytes)
  if(original.width!==image.width || original.height!==image.height)throw new Error('Decoded source dimensions changed')
  const canvas=createCanvas(output.width,output.height),ctx=canvas.getContext('2d'),r=entry.rect
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high'
  ctx.drawImage(original,r.x,r.y,r.width,r.height,0,0,output.width,output.height)
  return canvas.encode('png')
}
export async function verifyExport(folder) {
  folder=await realpath(folder)
  const marker=JSON.parse(await readFile(join(folder,'complete.json'))),bytes=await readFile(join(folder,'manifest.json'))
  if(marker.schemaVersion!==1 || marker.manifestSha256!==digest(bytes))throw new Error('Export manifest checksum mismatch')
  const manifest=JSON.parse(bytes)
  if(manifest.schemaVersion!==1 || !manifest.complete || manifest.id!==marker.id)throw new Error('Incomplete crop export')
  for(const name of ['manifest.json','crops.json','classification.json'])if(digest(await readFile(join(folder,'snapshots',name)))!==manifest.snapshots[name])throw new Error('Export snapshot changed')
  const source=JSON.parse(await readFile(join(folder,'snapshots/manifest.json'))),recipes=JSON.parse(await readFile(join(folder,'snapshots/crops.json')))
  const members=new Map(source.members.map(member=>[member.franchise+'/'+member.id,member])),entries=new Map(recipes.entries.map(entry=>[entry.key,entry]))
  const counts={units:0,vertical:0,splash:0,face:0,files:0};let totalBytes=0
  for(const unit of manifest.units) {
    const key=unit.franchise+'/'+unit.id,member=members.get(key)
    if(!member || !same(unit.source,member) || unit.tier!==member.rating || !same(Object.keys(unit.assets).sort(),(unit.tier===1?['vertical','face']:['vertical','splash','face']).sort()))throw new Error('Export unit changed')
    members.delete(key);counts.units++
    for(const [role,asset] of Object.entries(unit.assets)) {
    if(!/^(priconne|azurlane)\/[a-z0-9-]{1,64}\/(vertical|splash|face)\.[a-f0-9]{16}\.(png|webp|jpg)$/.test(asset.path))throw new Error('Invalid export asset path')
    const path=await realpath(join(folder,asset.path));if(!path.startsWith(folder+sep))throw new Error('Export asset escapes folder')
    const data=await readFile(path)
    if(digest(data)!==asset.sha256 || data.length!==asset.bytes)throw new Error('Export asset changed: '+asset.path)
    const dimensions=size(data)
    if(dimensions.width!==asset.width || dimensions.height!==asset.height)throw new Error('Export asset dimensions changed: '+asset.path)
    if(role==='face' && asset.sha256!==unit.source.face.sha256)throw new Error('Face was transformed')
    if(role!=='face' && (dimensions.ext!=='png' || !same(outputSize(asset.rect,role),{width:asset.width,height:asset.height})))throw new Error('Crop dimensions changed')
    if(role!=='face') {
      const entry=entries.get(key+'/'+role)
      if(!entry || entry.status!=='approved' || !same(entry.rect,asset.rect) || entry.sourceSha256!==asset.sourceSha256)throw new Error('Export recipe changed')
    }
    counts[role]++;counts.files++;totalBytes+=data.length
    }
  }
  if(members.size || !same(counts,manifest.counts) || totalBytes!==manifest.totalBytes)throw new Error('Export totals changed')
  return manifest
}
export async function exportCrops(content,{log=()=>{}}={}) {
  content=await realpath(resolve(content))
  const paths=await projectPaths(join(content,'authoring/project.json')),session=await loadCropSession(paths.release,paths.file)
  if(!session || session.manifest.phase!=='full-roster')throw new Error('Full-roster crop session required')
  if(session.data.entries.some(entry=>entry.status!=='approved'))throw new Error('Every crop must be approved before export')
  const manifestBytes=await readFile(join(dirname(session.file),'manifest.json')),cropBytes=await readFile(session.file),classification=await readFile(paths.file)
  if(!same(JSON.parse(cropBytes),session.data) || !same(JSON.parse(manifestBytes),session.manifest) || digest(classification)!==session.manifest.classificationSha256)throw new Error('Crop baseline changed during export setup')
  const snapshots={'manifest.json':digest(manifestBytes),'crops.json':digest(cropBytes),'classification.json':digest(classification)}
  const identity={sessionId:session.manifest.id,revision:session.data.revision,roundId:session.manifest.roundId,datasetId:session.manifest.datasetId,snapshots,renderer}
  const fingerprint=digest(JSON.stringify(identity)),id=session.manifest.id+'-r'+session.data.revision+'-'+fingerprint.slice(0,12)
  const root=join(content,'authoring/exports'),folder=join(root,id),sourceRoot=await realpath(paths.release)
  // Validate every original and face before any output exists. The dataset and owner records stay unchanged.
  for(const member of session.manifest.members) {
    if(!['priconne','azurlane'].includes(member.franchise) || !/^[a-z0-9-]{1,64}$/.test(member.id))throw new Error('Invalid export member')
    await sourceBytes(sourceRoot,member.art);await sourceBytes(sourceRoot,member.face)
  }
  await safeDirectory(content,folder)
  let completed=false
  try {await lstat(join(folder,'complete.json'));completed=true}catch(error){if(error.code!=='ENOENT')throw error}
  if(completed) {
    const previous=await verifyExport(folder)
    if(previous.fingerprint!==fingerprint)throw new Error('Export baseline mismatch')
    await atomicJson(join(root,'latest.json'),{schemaVersion:1,id,manifestSha256:digest(await readFile(join(folder,'manifest.json')))})
    return {folder,manifest:previous,reused:true}
  }
  let plan
  try{plan=JSON.parse(await readFile(join(folder,'export.json')));if(plan.fingerprint!==fingerprint || !same(plan.identity,identity))throw new Error('Partial export baseline mismatch')}
  catch(error){if(error.code!=='ENOENT')throw error;plan={schemaVersion:1,fingerprint,identity,createdAt:new Date().toISOString()};await immutable(content,join(folder,'export.json'),Buffer.from(JSON.stringify(plan,null,2)+'\n'))}
  for(const [name,bytes] of [['manifest.json',manifestBytes],['crops.json',cropBytes],['classification.json',classification]])await immutable(content,join(folder,'snapshots',name),bytes)
  const entries=new Map(session.data.entries.map(entry=>[entry.key,entry])),units=[],counts={units:0,vertical:0,splash:0,face:0,files:0};let totalBytes=0
  for(const member of session.manifest.members) {
    const unit={franchise:member.franchise,id:member.id,name:member.name,nameJa:member.nameJa??'',tier:member.rating,tierLabel:tiers[member.rating],source:member,assets:{}}
    const original=await sourceBytes(sourceRoot,member.art)
    for(const role of member.rating===1?['vertical']:['vertical','splash']) {
      const entry=entries.get(member.franchise+'/'+member.id+'/'+role),bytes=await renderCrop(original,member.art,entry),dimensions=size(bytes),sha256=digest(bytes)
      const path=member.franchise+'/'+member.id+'/'+role+'.'+sha256.slice(0,16)+'.png'
      await immutable(content,join(folder,path),bytes)
      unit.assets[role]={path,sha256,bytes:bytes.length,width:dimensions.width,height:dimensions.height,rect:entry.rect,sourceSha256:entry.sourceSha256,approvedAt:entry.updatedAt??null}
      counts[role]++;counts.files++;totalBytes+=bytes.length
    }
    const face=await sourceBytes(sourceRoot,member.face),sha256=digest(face),dimensions=size(face)
    const path=member.franchise+'/'+member.id+'/face.'+sha256.slice(0,16)+'.'+dimensions.ext
    await immutable(content,join(folder,path),face)
    unit.assets.face={path,sha256,bytes:face.length,width:dimensions.width,height:dimensions.height,sourceSha256:sha256,reused:true}
    counts.face++;counts.files++;counts.units++;totalBytes+=face.length;units.push(unit);log({done:counts.units,total:session.manifest.members.length})
  }
  // Never publish a completion marker for recipes edited during the batch. A retry preserves the partial export.
  if(!(await readFile(session.file)).equals(cropBytes) || !(await readFile(paths.file)).equals(classification) || !(await readFile(join(dirname(session.file),'manifest.json'))).equals(manifestBytes))throw new Error('Owner records changed during export; rerun for the new revision')
  const manifest={schemaVersion:1,id,complete:true,createdAt:plan.createdAt,fingerprint,...identity,counts,totalBytes,units}
  await immutable(content,join(folder,'manifest.json'),Buffer.from(JSON.stringify(manifest,null,2)+'\n'))
  await immutable(content,join(folder,'complete.json'),Buffer.from(JSON.stringify({schemaVersion:1,id,manifestSha256:digest(await readFile(join(folder,'manifest.json')))},null,2)+'\n'))
  await verifyExport(folder)
  await atomicJson(join(root,'latest.json'),{schemaVersion:1,id,manifestSha256:digest(await readFile(join(folder,'manifest.json')))})
  return {folder,manifest,reused:false}
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const [content]=process.argv.slice(2);if(!content)throw new Error('Usage: node scripts/cast/export-crops.mjs <private-content-folder>')
  const result=await exportCrops(content,{log:({done,total})=>{if(done%25===0||done===total)console.log('Rendered '+done+'/'+total+' units')}})
  console.log({folder:result.folder,counts:result.manifest.counts,bytes:result.manifest.totalBytes,reused:result.reused})
}
