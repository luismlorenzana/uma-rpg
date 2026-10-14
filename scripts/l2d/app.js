// The L2D reviewer's page: one character at a time, playing live; a vote saves and moves on. Keys: 1–5 vote,
// ← → move, Z undo, S A C switch pose.
import { RENDERS, rendersForRole } from './formats.mjs'

/** The stills made for whoever is on screen. */
const STILLS = RENDERS.filter((r) => r.kind === 'still' && !r.compare)
import { renderEntry } from './render.js'
import { GROUPS, POSE_LABEL, POSES } from './roster.mjs'
import { poseAt, SpineStage } from './spine-view.js'
import { TIER_LABEL, TIERS, tierCounts } from './tiers.mjs'

const $ = (id) => document.getElementById(id)
const token = document.querySelector('meta[name=l2d-token]').content
const store = {
  get: (key) => { try { return localStorage.getItem(key) } catch { return null } },
  set: (key, value) => { try { localStorage.setItem(key, value) } catch { /* private window: position isn't kept */ } },
}

let entries = [], tiers = {}
let currentId = store.get('l2d.current')
let pose = 'fb'
const undo = []
const stage = new SpineStage($('canvas'))
let actor = null, started = 0, loadSeq = 0

async function refresh() {
  const data = await (await fetch('/api/state')).json()
  entries = data.entries
  tiers = data.tiers
}

function visible() {
  const filter = $('filter').value, group = $('group').value, q = $('search').value.trim().toLowerCase()
  return entries.filter((e) => e.poses.fb && (filter === 'all' || (filter === 'unrated' ? !tiers[e.id] : tiers[e.id] === filter))
    && (group === 'all' || e.group === group) && (!q || e.name.toLowerCase().includes(q) || e.id.includes(q)))
}

const current = () => entries.find((e) => e.id === currentId)

function showStatus() {
  if (!batching) showBatch()
  const rated = entries.filter((e) => tiers[e.id]).length
  const downloaded = entries.filter((e) => e.poses.fb).length
  const list = visible()
  const at = list.findIndex((e) => e.id === currentId)
  $('status').textContent = `${rated} / ${entries.length} rated · ${at >= 0 ? `${at + 1} of ${list.length} shown` : `${list.length} shown`}`
    + (downloaded < entries.length ? ` · ${downloaded} downloaded so far` : '')
  const counts = tierCounts(tiers)
  $('counts').textContent = TIERS.map((t) => `${TIER_LABEL[t]} ${counts[t]}`).join(' · ')
}

function go(id) {
  currentId = id
  if (id) store.set('l2d.current', id)
  pose = 'fb'
  show()
}

function show() {
  const entry = current()
  showStatus()
  $('name').textContent = entry?.name ?? 'Nothing to show'
  $('meta').textContent = entry ? `${entry.id} · ${entry.group}${tiers[entry.id] ? ` · ${TIER_LABEL[tiers[entry.id]]}` : ''}` : 'Change the filter to see more.'
  $('face').src = entry?.face ? `/src/${entry.id}/face.png` : ''
  for (const button of $('votes').children) button.setAttribute('aria-pressed', String(!!entry && tiers[entry.id] === button.dataset.tier))
  $('poses').replaceChildren(...POSES.map((p) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = `${POSE_LABEL[p]}${{ fb: '', aim: ' (back)', cover: ' (front)' }[p]}`
    button.disabled = !entry?.poses[p]
    button.setAttribute('aria-pressed', String(p === pose))
    button.onclick = () => { pose = p; show() }
    return button
  }))
  showRenders(entry)
  load(entry)
  autoRender(entry)
}

let autoBusy = false
/** Her stills, a moment after she comes on screen, if they're missing: one at a time, skipped if you've moved on. */
function autoRender(entry) {
  if (!entry?.poses.fb) return
  const missing = STILLS.filter((r) => !entry.renders[r.name] && !(r.layout === 'splash' && entry.pending?.length))
  if (!missing.length) return
  setTimeout(async () => {
    if (autoBusy || batching || currentId !== entry.id) return
    autoBusy = true
    try {
      await renderEntry(entry, missing, async (name, blob) => {
        await saver(entry)(name, blob)
        entry.renders[name] = blob.size
      })
      if (currentId === entry.id) showRenders(entry)
    } catch (error) {
      if (currentId === entry.id) $('render-status').textContent = `Couldn't render her stills: ${error.message ?? error}`
    } finally {
      autoBusy = false
    }
  }, 500)
}

async function load(entry) {
  const seq = ++loadSeq
  actor = null
  $('message').hidden = false
  $('message').textContent = entry ? (entry.poses[pose] ? 'Loading…' : `No ${POSE_LABEL[pose]} pose downloaded yet.`) : ''
  if (!entry?.poses[pose]) return
  try {
    stage.unloadAll()
    const loaded = await stage.load(entry, pose)
    if (seq !== loadSeq) return
    actor = loaded
    started = performance.now()
    $('message').hidden = true
  } catch (error) {
    if (seq === loadSeq) $('message').textContent = `Couldn't load this pose: ${error.message ?? error}`
  }
}

function tick(now) {
  requestAnimationFrame(tick)
  if (!actor) return
  const canvas = stage.canvas, dpr = Math.min(2, window.devicePixelRatio || 1)
  stage.resize(Math.round(canvas.clientWidth * dpr), Math.round(canvas.clientHeight * dpr))
  const t = (now - started) / 1000
  poseAt(actor, actor.duration > 0 ? t % actor.duration : 0)
  stage.draw(actor)
}

async function post(path, body) {
  const response = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json', 'x-l2d-token': token }, body: JSON.stringify(body) })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error ?? `HTTP ${response.status}`)
  return result
}

async function vote(tier) {
  const entry = current()
  if (!entry) return
  const list = visible()
  const next = list[list.findIndex((e) => e.id === entry.id) + 1]
  try {
    await post('/api/tier', { id: entry.id, tier })
  } catch (error) {
    $('status').textContent = `Not saved: ${error.message}`
    return
  }
  undo.push({ id: entry.id, from: tiers[entry.id] ?? null })
  if (undo.length > 100) undo.shift()
  tiers[entry.id] = tier
  go(next?.id ?? entry.id)
}

async function undoLast() {
  const last = undo.pop()
  if (!last) return
  await post('/api/tier', { id: last.id, tier: last.from })
  if (last.from) tiers[last.id] = last.from
  else delete tiers[last.id]
  go(last.id)
}

function step(by) {
  const list = visible()
  const at = list.findIndex((e) => e.id === currentId)
  const next = list[at < 0 ? 0 : at + by]
  if (next) go(next.id)
}

function showRenders(entry) {
  $('render').disabled = !entry?.poses.fb
  $('render-status').textContent = entry?.pending?.length && entry.poses.fb ? 'Her splash waits for her Aim and Cover poses to download.' : ''
  $('renders').replaceChildren(...RENDERS.filter((r) => entry?.renders[r.name]).map((r) => {
    const figure = document.createElement('figure')
    const img = document.createElement('img')
    img.src = `/renders/${entry.id}/${r.name}?v=${entry.renders[r.name]}`
    img.alt = r.label
    img.loading = 'lazy'
    const caption = document.createElement('figcaption')
    caption.textContent = `${r.label} · ${r.width}×${r.height} · ${Math.round(entry.renders[r.name] / 1024)} KB`
    figure.append(img, caption)
    return figure
  }))
}

/** Saves one rendered image beside the entry's sources. */
const saver = (entry) => async (name, blob) => {
  const response = await fetch(`/api/render/${entry.id}/${name}`, { method: 'PUT', headers: { 'content-type': blob.type, 'x-l2d-token': token }, body: blob })
  if (!response.ok) throw new Error((await response.json()).error ?? `HTTP ${response.status}`)
}

/** Every format for the one on screen, comparisons included. */
async function renderCurrent() {
  const entry = current()
  if (!entry || batching) return
  $('render').disabled = true
  try {
    await renderEntry(entry, RENDERS, saver(entry), (label) => { $('render-status').textContent = `Rendering ${label}…` })
    await refresh()
    if (currentId === entry.id) showRenders(current())
    $('render-status').textContent = 'Done.'
  } catch (error) {
    $('render-status').textContent = `Render failed: ${error.message ?? error}`
  } finally {
    $('render').disabled = false
  }
}

/** What a batch still has to render: each voted unit's formats for her role that aren't on disk yet. */
const batchWork = () => entries.map((e) => ({ entry: e, renders: rendersForRole(tiers[e.id]).filter((r) => !e.renders[r.name]) }))
  .filter((w) => w.renders.length && w.entry.poses.fb)

let batching = false
/** Renders every unit with a role, one at a time; press again to stop after the current one. */
async function renderBatch() {
  if (batching) { batching = false; $('batch').textContent = 'Stopping…'; return }
  batching = true
  $('batch').textContent = 'Stop'
  const work = batchWork()
  let done = 0
  for (const { entry, renders } of work) {
    if (!batching) break
    try {
      await renderEntry(entry, renders, saver(entry), (label) => { $('render-status').textContent = `${done + 1}/${work.length} ${entry.name}: ${label}…` })
    } catch (error) {
      console.error(entry.id, error)
    }
    done++
  }
  batching = false
  await refresh()
  showRenders(current())
  $('render-status').textContent = `Batch: ${done} of ${work.length} rendered.`
  showBatch()
}

function showBatch() {
  const left = batchWork().length
  $('batch').textContent = left ? `Render all with a role (${left})` : 'All roles rendered'
  $('batch').disabled = !left && !batching
}

function setup() {
  $('filter').replaceChildren(...[['unrated', 'Unrated'], ['all', 'All'], ...TIERS.map((t) => [t, TIER_LABEL[t]])].map(([value, label]) => new Option(label, value)))
  $('group').replaceChildren(...[['all', 'All groups'], ...GROUPS.map((g) => [g, g])].map(([value, label]) => new Option(label, value)))
  $('filter').value = store.get('l2d.filter') ?? 'unrated'
  $('group').value = store.get('l2d.group') ?? 'all'
  for (const id of ['filter', 'group']) $(id).onchange = () => { store.set(`l2d.${id}`, $(id).value); if (!visible().some((e) => e.id === currentId)) go(visible()[0]?.id ?? null); else show() }
  $('search').oninput = () => { const first = visible()[0]; if (first) go(first.id); else show() }
  $('votes').replaceChildren(...TIERS.map((tier, i) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.dataset.tier = tier
    button.innerHTML = `<kbd>${i + 1}</kbd>`
    button.append(TIER_LABEL[tier])
    button.onclick = () => vote(tier)
    return button
  }))
  $('back').onclick = () => step(-1)
  $('skip').onclick = () => step(1)
  $('undo').onclick = undoLast
  $('render').onclick = renderCurrent
  $('batch').onclick = renderBatch
  document.addEventListener('keydown', (event) => {
    if (event.target.closest('input, select') || event.metaKey || event.ctrlKey || event.altKey) return
    const n = Number(event.key)
    if (n >= 1 && n <= TIERS.length) vote(TIERS[n - 1])
    else if (event.key === 'ArrowLeft') step(-1)
    else if (event.key === 'ArrowRight') step(1)
    else if (event.key.toLowerCase() === 'z') undoLast()
    else if ('sac'.includes(event.key.toLowerCase())) {
      const p = { s: 'fb', a: 'aim', c: 'cover' }[event.key.toLowerCase()]
      if (current()?.poses[p]) { pose = p; show() }
    } else return
    event.preventDefault()
  })
}

setup()
await refresh()
if (!current() || !visible().some((e) => e.id === currentId)) currentId = visible()[0]?.id ?? entries[0]?.id ?? null
show()
requestAnimationFrame(tick)
// Pick up what the downloader adds while the page is open.
setInterval(async () => { if (!batching) { await refresh(); showStatus() } }, 60_000)
