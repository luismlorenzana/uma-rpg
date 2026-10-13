import { readFile, mkdir, copyFile } from 'node:fs/promises'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { atomicJson, readRatings, packPath, snapshotRatings } from './ratings.mjs'
import { digest } from './authoring-import.mjs'

const id = value => typeof value==='string' && /^[a-z0-9-]{1,64}$/.test(value)
export async function projectPaths(projectFile) {
  const project=JSON.parse(await readFile(projectFile,'utf8'))
  if(project.schemaVersion!==1 || !id(project.datasetId) || !id(project.roundId))throw new Error('Invalid authoring project')
  const root=dirname(projectFile)
  return {release:join(root,'datasets',project.datasetId),file:join(root,'rounds',project.roundId,'ratings.json')}
}
/** Call only after stopping the reviewer. Does not delete or change any prior round, game pack or image. */
export async function startRound(content,datasetId,roundId) {
  if(!id(datasetId) || !id(roundId))throw new Error('Invalid authoring identity')
  const authoring=join(resolve(content),'authoring'),dataset=join(authoring,'datasets',datasetId),round=join(authoring,'rounds',roundId)
  const manifest=JSON.parse(await readFile(join(dataset,'dataset.json'),'utf8'))
  if(manifest.id!==datasetId || !manifest.complete)throw new Error('Dataset must be complete before ranking')
  let priorFile=join(content,'cast-ratings.json'),priorRelease=join(content,'release')
  try {const prior=await projectPaths(join(authoring,'project.json'));priorFile=prior.file;priorRelease=prior.release}
  catch(error){if(error.code!=='ENOENT')throw error}
  const priorBytes=await readFile(priorFile),prior=await readRatings(priorFile)
  const archived=join(authoring,'archive','votes-'+digest(priorBytes)+'.json')
  await mkdir(dirname(archived),{recursive:true});await copyFile(priorFile,archived,1)
    .catch(error=>{if(error.code!=='EEXIST')throw error})
  const previousRatings={},ratings={},catalogues={}
  for(const franchise of ['priconne','azurlane']) {
    const bytes=await readFile(packPath(dataset,franchise)),pack=JSON.parse(bytes)
    const old=JSON.parse(await readFile(packPath(priorRelease,franchise),'utf8'))
    catalogues[franchise]=digest(bytes);previousRatings[franchise]={};ratings[franchise]={}
    for(const member of pack.members) {
      const matches=old.members.filter(m=>m.id===member.id || (franchise==='priconne' && (m.nameJa??m.name)===(member.nameJa??member.name)))
      if(matches.length!==1)continue
      const vote=prior.ratings[franchise]?.[matches[0].id]
      if(vote===undefined)continue
      previousRatings[franchise][member.id]=vote
      // Same stable ID means the same ship/variant. Never assign a base-character vote to a costume.
      if(matches[0].id===member.id)ratings[franchise][member.id]=vote
    }
  }
  await mkdir(dirname(round),{recursive:true})
  await mkdir(round,{recursive:false})
  const data={schemaVersion:1,roundId,datasetId,revision:0,ratings}
  await atomicJson(join(round,'round.json'),{schemaVersion:1,id:roundId,datasetId,label:'Ranking · '+roundId,createdAt:new Date().toISOString(),catalogues,priorRatings:archived,previousRatings,
    sourceComplete:manifest.complete,missingSplashes:manifest.missing,
    nextPhase:'crop-authoring',assetRoles:{regular:['vertical','face'],elite:['vertical','face','splash']}})
  await snapshotRatings(join(round,'ratings.json'),data)
  await atomicJson(join(round,'ratings.json'),data)
  await atomicJson(join(dataset,'in-use.json'),{schemaVersion:1,datasetId})
  await atomicJson(join(authoring,'project.json'),{schemaVersion:1,datasetId,roundId})
  return {dataset,round,archived}
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const [content,dataset,round]=process.argv.slice(2)
  if(!content || !dataset || !round)throw new Error('Usage: node scripts/cast/authoring-round.mjs <private-content-folder> <dataset-id> <new-round-id>')
  console.log(await startRound(content,dataset,round))
}
