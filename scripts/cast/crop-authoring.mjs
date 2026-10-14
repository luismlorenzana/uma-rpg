import { readFile, mkdir, copyFile, realpath, open } from 'node:fs/promises'
import { constants } from 'node:fs'
import { join, dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadReview, readRatings, atomicJson, classificationStatus } from './ratings.mjs'
import { projectPaths } from './authoring-round.mjs'
import { digest } from './authoring-import.mjs'
import { fitRect, validRect, outputSize } from './crop-geometry.mjs'

const safeId = id => typeof id==='string' && /^[a-z0-9-]{1,64}$/.test(id)
const rootFor = file => resolve(dirname(file),'../../crops')
export function calibrationMembers(review) {
  const picked=[]
  for(const pack of review.packs) {
    const start=picked.length
    for(const [tier,count] of [[1,2],[2,3],[3,2],[4,3]]) {
      const pool=pack.members.filter(member=>member.rating===tier)
      const take=Math.min(count,pool.length)
      const indices=take===3?[0,tier===4?Math.floor(pool.length/2):Math.floor((pool.length-1)/2),pool.length-1]:
        take===2?[0,pool.length-1]:take===1?[0]:[]
      for(const index of indices)picked.push({franchise:pack.id,...pool[index]})
    }
    const remaining=pack.members.filter(member=>!picked.some(p=>p.franchise===pack.id&&p.id===member.id))
    for(const member of remaining.slice(0,Math.min(10,pack.members.length)-(picked.length-start)))picked.push({franchise:pack.id,...member})
  }
  return picked
}
async function snapshot(file,data) {
  const sha256=digest(JSON.stringify(data)),path=join(dirname(file),'history',String(data.revision).padStart(8,'0')+'-'+sha256+'.json')
  try {
    const old=JSON.parse(await readFile(path));if(old.sha256!==sha256 || digest(JSON.stringify(old.data))!==sha256)throw new Error('Corrupt crop history')
  }catch(error){if(error.code!=='ENOENT')throw error;await atomicJson(path,{savedAt:new Date().toISOString(),sha256,data})}
}
/** No fetches, image transformations or classification writes. Stop the reviewer before initialization. */
export async function startCropCalibration(content,sessionId,{seeds={}}={}) {
  if(!safeId(sessionId))throw new Error('Invalid crop session')
  const project=join(resolve(content),'authoring/project.json'),{release,file}=await projectPaths(project)
  const bytes=await readFile(file),ratings=await readRatings(file),review=await loadReview(release,file)
  if(ratings.schemaVersion!==2 || !review.round)throw new Error('Final role tiers are required before cropping')
  const members=calibrationMembers(review),session=join(rootFor(file),sessionId),createdAt=new Date().toISOString()
  const sourceRoot=await realpath(release)
  for(const member of members)for(const image of [member.art,member.face]) {
    if(!image || !/^(?:azurlane\/)?cast\/[a-z0-9_-]{1,60}\.[a-f0-9]{8}\.(png|webp|jpg)$/.test(image.path) || !/^[a-f0-9]{64}$/.test(image.sha256??''))throw new Error('Invalid crop source image')
    const path=await realpath(join(sourceRoot,image.path))
    if(!path.startsWith(sourceRoot+sep) || digest(await readFile(path))!==image.sha256)throw new Error('Crop original hash mismatch')
  }
  await mkdir(dirname(session),{recursive:true});await mkdir(session)
  const entries=members.flatMap(member=>(member.rating===1?['vertical']:['vertical','splash']).map(role=>{
    const key=member.franchise+'/'+member.id+'/'+role,seed=seeds[key]
    const rect=seed?.rect??fitRect(member.art,role,seed)
    if(!validRect(rect,member.art,role) || !outputSize(rect,role).width)throw new Error('Invalid crop seed: '+key)
    return {key,franchise:member.franchise,id:member.id,role,sourceSha256:member.art.sha256,rect,output:outputSize(rect,role),status:'pending',suggestion:'pre-aligned',...(seed?.note?{note:seed.note}:{})}
  }))
  if(Object.keys(seeds).some(key=>!entries.some(entry=>entry.key===key)))throw new Error('Crop seed outside calibration')
  const manifest={schemaVersion:1,id:sessionId,phase:'calibration',createdAt,roundId:review.round.id,datasetId:review.round.datasetId,
    classificationSha256:digest(bytes),members,policy:'Existing local sources only; full body is a vertical format; reuse faces; all non-Regular tiers need splash; review before expanding'}
  await atomicJson(join(session,'manifest.json'),manifest)
  const crops={schemaVersion:1,sessionId,revision:0,entries}
  await snapshot(join(session,'crops.json'),crops);await atomicJson(join(session,'crops.json'),crops)
  const archive=join(dirname(file),'classification-final-ratings.json')
  try {await copyFile(file,archive,constants.COPYFILE_EXCL)}catch(error){if(error.code!=='EEXIST')throw error}
  const archived=await open(archive,'r');try{await archived.sync()}finally{await archived.close()}
  if(!(await readFile(archive)).equals(bytes) || !(await readFile(file)).equals(bytes))throw new Error('Classification changed during calibration setup')
  const existing=await classificationStatus(file)
  if(!existing)await atomicJson(join(dirname(file),'classification-final.json'),{schemaVersion:1,sha256:digest(bytes),roundId:review.round.id,datasetId:review.round.datasetId,revision:ratings.revision,finalizedAt:createdAt})
  await atomicJson(join(dirname(file),'crop-session.json'),{schemaVersion:1,id:sessionId,manifestSha256:digest(await readFile(join(session,'manifest.json')))})
  return {session,members:members.length,crops:entries.length,classificationSha256:manifest.classificationSha256}
}
export async function loadCropSession(release,file) {
  let pointer
  try{pointer=JSON.parse(await readFile(join(dirname(file),'crop-session.json')))}catch(error){if(error.code==='ENOENT')return null;throw error}
  if(pointer.schemaVersion!==1 || !safeId(pointer.id))throw new Error('Invalid crop pointer')
  const session=join(rootFor(file),pointer.id),manifestBytes=await readFile(join(session,'manifest.json')),manifest=JSON.parse(manifestBytes)
  if(digest(manifestBytes)!==pointer.manifestSha256)throw new Error('Crop catalogue changed')
  const frozen=await classificationStatus(file),review=await loadReview(release,file)
  if(manifest.schemaVersion!==1 || manifest.id!==pointer.id || manifest.phase!=='calibration' || !frozen ||
    frozen.sha256!==manifest.classificationSha256 || review.round?.id!==manifest.roundId || review.round.datasetId!==manifest.datasetId)throw new Error('Crop session identity mismatch')
  const source=new Map(review.packs.flatMap(p=>p.members.map(m=>[p.id+'/'+m.id,m])))
  if(!Array.isArray(manifest.members) || !manifest.members.length)throw new Error('Invalid crop catalogue')
  const known=new Map()
  for(const member of manifest.members) {
    const original=source.get(member.franchise+'/'+member.id)
    if(!original || original.rating!==member.rating || original.art.sha256!==member.art.sha256 || original.art.path!==member.art.path ||
      original.art.width!==member.art.width || original.art.height!==member.art.height || original.face.sha256!==member.face.sha256)throw new Error('Crop source changed')
    for(const role of member.rating===1?['vertical']:['vertical','splash']) {
      const key=member.franchise+'/'+member.id+'/'+role
      if(known.has(key))throw new Error('Duplicate crop source');known.set(key,member)
    }
  }
  const data=JSON.parse(await readFile(join(session,'crops.json')))
  if(data.schemaVersion!==1 || data.sessionId!==manifest.id || !Number.isSafeInteger(data.revision) || data.revision<0 || !Array.isArray(data.entries) || data.entries.length!==known.size)throw new Error('Invalid crop file; restore from history')
  const seen=new Set()
  for(const entry of data.entries) {
    const member=known.get(entry.key)
    if(!member || seen.has(entry.key) || entry.key!==entry.franchise+'/'+entry.id+'/'+entry.role || entry.sourceSha256!==member.art.sha256 ||
      !validRect(entry.rect,member.art,entry.role) || !outputSize(entry.rect,entry.role).width || !['pending','approved','flagged'].includes(entry.status))throw new Error('Invalid crop entry')
    seen.add(entry.key)
  }
  return {file:join(session,'crops.json'),manifest,data}
}
export async function saveCrops(release,file,{sessionId,revision,updates}) {
  const session=await loadCropSession(release,file)
  if(!session || sessionId!==session.manifest.id || revision!==session.data.revision){const error=new Error('Crop session changed. Reload and try again.');error.status=409;throw error}
  if(!Array.isArray(updates) || !updates.length || updates.length>100)throw new Error('Invalid crop edits')
  const next=structuredClone(session.data),seen=new Set()
  for(const edit of updates) {
    const entry=next.entries.find(e=>e.key===edit.key),member=session.manifest.members.find(m=>entry && m.id===entry.id && m.franchise===entry.franchise)
    if(!entry || seen.has(edit.key) || !validRect(edit.rect,member.art,entry.role) || !outputSize(edit.rect,entry.role).width || !['pending','approved','flagged'].includes(edit.status))throw new Error('Invalid crop edit')
    seen.add(edit.key);entry.rect={x:edit.rect.x,y:edit.rect.y,width:edit.rect.width,height:edit.rect.height};entry.status=edit.status
    entry.updatedAt=new Date().toISOString();entry.output=outputSize(entry.rect,entry.role)
  }
  await snapshot(session.file,session.data);next.revision++;await snapshot(session.file,next);await atomicJson(session.file,next)
  return next
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const [content,id,seeds]=process.argv.slice(2)
  if(!content || !id)throw new Error('Usage: node scripts/cast/crop-authoring.mjs <private-content-folder> <new-session-id> [private-seeds.json]')
  console.log(await startCropCalibration(content,id,{seeds:seeds?JSON.parse(await readFile(seeds)):undefined}))
}
