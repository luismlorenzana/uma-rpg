// Owner-only, private overlay (D123). This file contains no original-game records.
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

export const PACKS = [
  ['priconne', 'PriConne'], ['azurlane', 'Azur Lane'], ['lastorigin', 'Last Origin'],
  ['nikke', 'NIKKE'], ['destinychild', 'Destiny Child'], ['girlsfrontline', "Girls' Frontline"],
]
export const packPath = (release, franchise) => join(release, franchise === 'priconne' ? '' : franchise, 'cast.json')
export const ratingsPath = release => resolve(dirname(release), 'cast-ratings.json')
export const validRating = rating => Number.isInteger(rating) && rating >= -2 && rating <= 2
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const safeId = id => typeof id === 'string' && /^[a-z0-9_-]{1,80}$/.test(id) && !['__proto__', 'constructor', 'prototype'].includes(id)

export function parseRatings(raw) {
  if (!record(raw) || raw.schemaVersion !== 1 || !record(raw.ratings)) throw new Error('Invalid ratings file')
  const revision = raw.revision ?? 0
  if (!Number.isSafeInteger(revision) || revision < 0) throw new Error('Invalid ratings revision')
  const ratings = {}
  for (const [franchise, values] of Object.entries(raw.ratings)) {
    if (!PACKS.some(([id]) => id === franchise) || !record(values)) throw new Error('Invalid franchise ratings')
    ratings[franchise] = {}
    for (const [id, rating] of Object.entries(values)) {
      if (!safeId(id) || !validRating(rating)) throw new Error('Invalid member rating')
      ratings[franchise][id] = rating
    }
  }
  return { schemaVersion: 1, revision, ratings }
}

export async function readRatings(file) {
  try { return parseRatings(JSON.parse(await readFile(file, 'utf8'))) }
  catch (error) {
    if (error.code === 'ENOENT') return { schemaVersion: 1, revision: 0, ratings: {} }
    throw error
  }
}

export async function loadReview(release, file = ratingsPath(release)) {
  const votes = await readRatings(file)
  const packs = []
  for (const [id, label] of PACKS) {
    let raw
    try { raw = JSON.parse(await readFile(packPath(release, id), 'utf8')) }
    catch (error) { if (error.code === 'ENOENT') continue; throw error }
    if (raw.schemaVersion !== 1 || !Array.isArray(raw.members)) throw new Error('Invalid cast pack: ' + id)
    const seen = new Set()
    const members = raw.members.map(member => {
      if (!safeId(member.id) || typeof member.name !== 'string' || seen.has(member.id)) throw new Error('Invalid cast member: ' + id)
      seen.add(member.id)
      return { ...member, rating: votes.ratings[id]?.[member.id] ?? 0 }
    })
    if (members.length) packs.push({ id, label, members, ...(raw.avatar ? { avatar: raw.avatar } : {}) })
  }
  packs.sort((a, b) => a.members.length - b.members.length || a.id.localeCompare(b.id))
  return { schemaVersion: 1, revision: votes.revision, packs }
}

export async function atomicJson(file, value) {
  await mkdir(dirname(file), { recursive: true })
  const temp = file + '.' + randomUUID() + '.tmp'
  await writeFile(temp, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 })
  await rename(temp, file)
}

export async function saveVotes(release, file, entries, revision) {
  const data = await loadReview(release, file), current = await readRatings(file)
  if (revision !== current.revision) {
    const error = new Error('Votes changed in another tab. Reload and try again.')
    error.status = 409; throw error
  }
  if (!Array.isArray(entries) || !entries.length || entries.length > 10000) throw new Error('Invalid votes')
  const known = new Map(data.packs.map(p => [p.id, new Set(p.members.map(m => m.id))]))
  for (const entry of entries) {
    if (!record(entry) || !safeId(entry.id) || !known.get(entry.franchise)?.has(entry.id) || !validRating(entry.rating)) throw new Error('Unknown member or invalid vote')
    const votes = current.ratings[entry.franchise] ??= {}
    votes[entry.id] = entry.rating
  }
  current.revision++
  await atomicJson(file, current)
  return current
}

