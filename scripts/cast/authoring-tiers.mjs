// A new private catalogue/round, never a destructive edit of source data or prior votes.
import { readFile, mkdir, copyFile, realpath } from 'node:fs/promises'
import { constants } from 'node:fs'
import { join, resolve, dirname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { atomicJson, loadReview, packPath, parseRatings, snapshotRatings, PACKS } from './ratings.mjs'
import { projectPaths } from './authoring-round.mjs'
import { digest } from './authoring-import.mjs'
import { artPathAllowed } from './review-server.mjs'

const validId = value => typeof value === 'string' && /^[a-z0-9-]{1,64}$/.test(value)
/** Stop the reviewer first. The project pointer changes only after all copies and snapshots succeed. */
export async function startTierRound(content, datasetId, roundId) {
  if (!validId(datasetId) || !validId(roundId)) throw new Error('Invalid authoring identity')
  const root = join(resolve(content), 'authoring'), projectFile = join(root, 'project.json')
  const projectBytes = await readFile(projectFile), prior = await projectPaths(projectFile)
  const priorBytes = await readFile(prior.file), votes = parseRatings(JSON.parse(priorBytes))
  if (votes.schemaVersion !== 1) throw new Error('A tier round requires a completed ranking pass')
  const review = await loadReview(prior.release, prior.file)
  const sourceManifest = JSON.parse(await readFile(join(prior.release, 'dataset.json')))
  if (!sourceManifest.complete || !review.round) throw new Error('Complete source images are required')
  const sourceRoot = await realpath(prior.release)
  const packs = []
  for (const [franchise] of PACKS) {
    const raw = JSON.parse(await readFile(packPath(prior.release, franchise)))
    const active = review.packs.find(pack => pack.id === franchise)?.members ?? []
    if (active.some(member => !member.rating)) throw new Error('Finish ranking every active unit before creating tiers')
    const survivors = new Set(active.filter(member => member.rating > 0).map(member => member.id))
    packs.push({franchise, raw: {...raw, members: raw.members.filter(member => survivors.has(member.id))}})
  }
  const dataset = join(root, 'datasets', datasetId), round = join(root, 'rounds', roundId)
  await mkdir(dirname(dataset), {recursive:true}); await mkdir(dataset) // Never overwrite an existing collection.
  await mkdir(dirname(round), {recursive:true}); await mkdir(round)
  const archive = join(root, 'archive', 'votes-' + digest(priorBytes) + '.json')
  await mkdir(dirname(archive), {recursive:true})
  try { await copyFile(prior.file, archive, constants.COPYFILE_EXCL) }
  catch (error) { if (error.code !== 'EEXIST') throw error }
  if (!(await readFile(archive)).equals(priorBytes)) throw new Error('Prior-vote archive mismatch')
  const ratings = {}, catalogues = {}, counts = {}, copied = new Set()
  for (const {franchise, raw} of packs) {
    ratings[franchise] = {}; counts[franchise] = raw.members.length
    for (const member of raw.members) {
      ratings[franchise][member.id] = votes.ratings[franchise][member.id] // +1 Regular; +2 KeyEnemy.
      for (const image of [member.art, member.face]) {
        if (!image || !artPathAllowed(image.path) || !/^[a-f0-9]{64}$/.test(image.sha256 ?? '')) throw new Error('Invalid original image reference')
        if (copied.has(image.path)) continue
        const from = await realpath(join(sourceRoot, image.path))
        if (!from.startsWith(sourceRoot + sep)) throw new Error('Image escapes private dataset')
        const to = join(dataset, image.path)
        await mkdir(dirname(to), {recursive:true})
        await copyFile(from, to, constants.COPYFILE_EXCL | constants.COPYFILE_FICLONE)
        if (digest(await readFile(to)) !== image.sha256) throw new Error('Original image hash mismatch')
        copied.add(image.path)
      }
    }
    await atomicJson(packPath(dataset, franchise), raw)
    catalogues[franchise] = digest(await readFile(packPath(dataset, franchise)))
  }
  const createdAt = new Date().toISOString()
  await atomicJson(join(dataset, 'dataset.json'), {
    schemaVersion:1, id:datasetId, complete:true, rosterComplete:true, createdAt,
    parentDataset:review.round.datasetId, selectionRound:review.round.id,
    selectionRatingsSha256:digest(priorBytes), counts, missing:[], purpose:'role-tiers',
  })
  const data = {schemaVersion:2, mode:'tiers', revision:0, roundId, datasetId, ratings}
  await atomicJson(join(round, 'round.json'), {
    schemaVersion:1, id:roundId, datasetId, label:'Enemy tiers', createdAt, catalogues,
    priorRatings:archive, previousRatings:{}, votesMode:'tiers', sourceComplete:true,
    missingSplashes:[], nextPhase:'crop-authoring', tiers:{1:'Regular',2:'KeyEnemy',3:'MiniBoss',4:'FinalBoss'},
  })
  const file = join(round, 'ratings.json')
  await snapshotRatings(file, data); await atomicJson(file, data)
  await atomicJson(join(dataset, 'in-use.json'), {schemaVersion:1,datasetId})
  await loadReview(dataset, file)
  if (!(await readFile(prior.file)).equals(priorBytes) || !(await readFile(projectFile)).equals(projectBytes)) throw new Error('Source round changed. Stop the reviewer before migration.')
  await atomicJson(projectFile, {schemaVersion:1,datasetId,roundId})
  return {dataset, round, archive, counts, originalImages:copied.size}
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [content, dataset, round] = process.argv.slice(2)
  if (!content || !dataset || !round) throw new Error('Usage: node scripts/cast/authoring-tiers.mjs <private-content-folder> <new-dataset-id> <new-round-id>')
  console.log(await startTierRound(content, dataset, round))
}
