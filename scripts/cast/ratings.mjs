// Owner-only, private overlay (D123). This file contains no original-game records.
import { readFile, readdir, rename, mkdir, open, unlink } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { randomUUID, createHash } from 'node:crypto'

const STORED_PACKS = [
  ['priconne', 'PriConne'], ['azurlane', 'Azur Lane'], ['lastorigin', 'Last Origin'],
  ['nikke', 'NIKKE'], ['destinychild', 'Destiny Child'], ['girlsfrontline', "Girls' Frontline"],
]
export const PACKS=STORED_PACKS.filter(([id])=>['priconne','azurlane'].includes(id))
export const packPath = (release, franchise) => join(release, franchise === 'priconne' ? '' : franchise, 'cast.json')
export const ratingsPath = release => resolve(dirname(release), 'cast-ratings.json')
export const validRating = (rating, schemaVersion = 1) => Number.isInteger(rating) &&
  (schemaVersion === 2 ? rating >= 1 && rating <= 4 : rating >= -2 && rating <= 2)
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const safeId = id => typeof id === 'string' && /^[a-z0-9_-]{1,80}$/.test(id) && !['__proto__', 'constructor', 'prototype'].includes(id)
const historyRoot = file => file.endsWith('/cast-ratings.json')?join(dirname(file),'authoring/legacy-history'):join(dirname(file),'history')

export function parseRatings(raw) {
  if (!record(raw) || ![1,2].includes(raw.schemaVersion) || !record(raw.ratings)) throw new Error('Invalid ratings file')
  if (raw.schemaVersion === 2 && (raw.mode !== 'tiers' || !safeId(raw.roundId) || !safeId(raw.datasetId))) throw new Error('Invalid tier round')
  const revision = raw.revision ?? 0
  if (!Number.isSafeInteger(revision) || revision < 0) throw new Error('Invalid ratings revision')
  const ratings = {}
  for (const [franchise, values] of Object.entries(raw.ratings)) {
    if (!STORED_PACKS.some(([id]) => id === franchise) || !record(values)) throw new Error('Invalid franchise ratings')
    if (raw.schemaVersion === 2 && !PACKS.some(([id]) => id === franchise)) throw new Error('Invalid tier franchise')
    ratings[franchise] = {}
    for (const [id, rating] of Object.entries(values)) {
      if (!safeId(id) || !validRating(rating, raw.schemaVersion)) throw new Error('Invalid member rating')
      ratings[franchise][id] = rating
    }
  }
  for(const key of ['roundId','datasetId']) if(raw[key] !== undefined && !safeId(raw[key])) throw new Error('Invalid review identity')
  return { schemaVersion: raw.schemaVersion, ...(raw.schemaVersion === 2 ? {mode:'tiers'} : {}), revision, ratings, ...(raw.roundId ? {roundId:raw.roundId} : {}), ...(raw.datasetId ? {datasetId:raw.datasetId} : {}) }
}

export async function readRatings(file) {
  try { return parseRatings(JSON.parse(await readFile(file, 'utf8'))) }
  catch (error) {
    if (error.code === 'ENOENT') {
      let history=[]
      try {history=await readdir(historyRoot(file))}catch(missing){if(missing.code!=='ENOENT')throw missing}
      if(history.some(name=>name.endsWith('.json')))throw new Error('Ratings file missing. Restore it from history before continuing.')
      return { schemaVersion: 1, revision: 0, ratings: {} }
    }
    throw error
  }
}

export async function loadReview(release, file = ratingsPath(release), {includeArchived=false}={}) {
  const votes = await readRatings(file)
  let round
  try { round=JSON.parse(await readFile(join(dirname(file),'round.json'),'utf8')) }
  catch(error){if(error.code!=='ENOENT')throw error}
  if(round && (round.schemaVersion!==1 || !safeId(round.id) || !safeId(round.datasetId) || typeof round.label!=='string' || votes.roundId!==round.id || votes.datasetId!==round.datasetId)) throw new Error('Review round identity mismatch')
  if (votes.schemaVersion === 2 && (!round || round.votesMode !== 'tiers')) throw new Error('Tier round identity mismatch')
  if (round?.votesMode === 'tiers' && votes.schemaVersion !== 2) throw new Error('Tier ratings schema mismatch')
  const packs = []
  for (const [id, label] of includeArchived && !round ? STORED_PACKS : PACKS) {
    if(round && !['priconne','azurlane'].includes(id))continue
    let raw
    try {
      const bytes=await readFile(packPath(release,id))
      if(round && createHash('sha256').update(bytes).digest('hex')!==round.catalogues?.[id])throw new Error('Review catalogue changed: '+id)
      raw=JSON.parse(bytes)
    }
    catch (error) { if (error.code === 'ENOENT' && !round) continue; throw error }
    if (raw.schemaVersion !== 1 || !Array.isArray(raw.members)) throw new Error('Invalid cast pack: ' + id)
    const seen = new Set()
    const members = raw.members.filter(member=>includeArchived || id!=='azurlane' || !['Normal','Rare'].includes(member.rarity)).map(member => {
      if (!safeId(member.id) || typeof member.name !== 'string' || seen.has(member.id)) throw new Error('Invalid cast member: ' + id)
      seen.add(member.id)
      if (votes.schemaVersion === 2 && !validRating(votes.ratings[id]?.[member.id], 2)) throw new Error('Tier missing for active member')
      return { ...member, rating: votes.ratings[id]?.[member.id] ?? 0,
        ...(round?.previousRatings?.[id]?.[member.id] !== undefined ? {previousRating:round.previousRatings[id][member.id]} : {}) }
    })
    if (votes.schemaVersion === 2 && Object.keys(votes.ratings[id] ?? {}).some(member => !seen.has(member))) throw new Error('Tier rating outside active catalogue')
    if (members.length) packs.push({ id, label, members, ...(raw.avatar ? { avatar: raw.avatar } : {}) })
  }
  packs.sort((a, b) => a.members.length - b.members.length || a.id.localeCompare(b.id))
  return { schemaVersion: 1, mode: votes.schemaVersion === 2 ? 'tiers' : 'ranking', revision: votes.revision, packs, ...(round?{round:{id:round.id,label:round.label,datasetId:round.datasetId}}:{}) }
}

export async function atomicJson(file, value) {
  await mkdir(dirname(file), { recursive: true })
  const temp = file + '.' + randomUUID() + '.tmp'
  let handle
  try {
    handle=await open(temp,'wx',0o600)
    await handle.writeFile(JSON.stringify(value,null,2)+'\n'); await handle.sync();await handle.close();handle=null
    await rename(temp, file)
    const dir=await open(dirname(file),'r');try{await dir.sync()}finally{await dir.close()}
  }catch(error){await handle?.close();await unlink(temp).catch(()=>undefined);throw error}
}

export async function snapshotRatings(file, value) {
  value=parseRatings(value)
  const hash=createHash('sha256').update(JSON.stringify(value)).digest('hex')
  const history=join(historyRoot(file),String(value.revision).padStart(8,'0')+'-'+hash+'.json')
  try {
    const snapshot=JSON.parse(await readFile(history,'utf8'))
    if(snapshot.sha256!==hash || createHash('sha256').update(JSON.stringify(snapshot.data)).digest('hex')!==hash)throw new Error('Corrupt ratings history')
    return history
  }catch(error){if(error.code!=='ENOENT')throw error}
  await atomicJson(history,{savedAt:new Date().toISOString(),sha256:hash,data:value})
  return history
}

export async function saveVotes(release, file, entries, revision, {restoreArchived=false}={}) {
  const data = await loadReview(release, file,{includeArchived:restoreArchived}), current = await readRatings(file)
  if (revision !== current.revision) {
    const error = new Error('Votes changed in another tab. Reload and try again.')
    error.status = 409; throw error
  }
  if (!Array.isArray(entries) || !entries.length || entries.length > 10000) throw new Error('Invalid votes')
  const known = new Map(data.packs.map(p => [p.id, new Set(p.members.map(m => m.id))]))
  for (const entry of entries) {
    if (!record(entry) || !safeId(entry.id) || !known.get(entry.franchise)?.has(entry.id) || !validRating(entry.rating, current.schemaVersion)) throw new Error('Unknown member or invalid vote')
  }
  // Preserve both sides of every edit/import/undo before acknowledging it. A corrupt current file is never reset.
  await snapshotRatings(file,current)
  for(const entry of entries)(current.ratings[entry.franchise]??={})[entry.id]=entry.rating
  current.revision++
  await snapshotRatings(file,current)
  await atomicJson(file, current)
  return current
}

