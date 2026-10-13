const $ = id => document.getElementById(id)
const state = { data: null, pack: '', member: '', filter: 'unrated', query: '', mode: 'full', view: 'single', busy: false, history: [] }
const labels = { '-2': 'Excluded ↓↓', '-1': 'Rare ↓', '0': 'Unreviewed', '1': 'Regular ↑', '2': 'Key ↑↑' }
const selectedPack = () => state.data?.packs.find(p => p.id === state.pack)
const members = () => (selectedPack()?.members ?? []).filter(m =>
  (state.filter === 'all' || (state.filter === 'unrated' ? !m.rating : m.rating === Number(state.filter))) &&
  (!state.query || m.name.toLocaleLowerCase().includes(state.query) || m.id.toLocaleLowerCase().includes(state.query)))
const selected = () => members().find(m => m.id === state.member)
const imageUrl = path => '/art/' + path
const remember = () => { try { localStorage.setItem('uma-cast-review-position', JSON.stringify({ pack: state.pack, member: state.member })) } catch { /* Votes live on disk even if browser storage is unavailable. */ } }
const totals = pack => pack.members.reduce((n, m) => { n[String(m.rating)]++; return n }, { '-2': 0, '-1': 0, '0': 0, '1': 0, '2': 0 })
const fail = error => { $('error').hidden = false; $('error').querySelector('span').textContent = error.message; $('status').textContent = 'Not saved' }
const clearError = () => { $('error').hidden = true }
function choose(id) { state.member = id; remember(); render() }

async function post(path, body) {
  const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Review-Token': state.data.token },
    body: JSON.stringify(body) })
  const value = await response.json()
  if (!response.ok) throw new Error(value.error || 'Request failed')
  return value
}
function enable() {
  for (const button of document.querySelectorAll('button')) button.disabled = state.busy
  for (const button of document.querySelectorAll('[data-vote]')) button.disabled = state.busy || state.view !== 'single' || !selected()
  $('undo').disabled = state.busy || !state.history.length
  $('previous').disabled = state.busy || members().findIndex(m => m.id === state.member) <= 0
  $('skip').disabled = state.busy || !members().length
}
function portrait(member) {
  const image = $('image'), box = $('portrait')
  $('image-error').hidden = true; image.hidden = false
  image.removeAttribute('style'); box.classList.remove('face-crop')
  const face = state.mode === 'face'
  image.alt = member.name + (face ? ', face' : ', full art')
  image.src = imageUrl(face && member.face ? member.face.path : member.art.path)
  if (face && !member.face) {
    const avatar = member.avatar ?? selectedPack().avatar ?? { x: .5, y: 0, size: .3 }
    const clamp = (v, min, max, fallback) => Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : fallback
    const size = clamp(avatar.size, .05, 1, .3), x = clamp(avatar.x, 0, 1, .5), y = clamp(avatar.y, 0, 1, 0)
    box.classList.add('face-crop')
    image.style.height = 100 / size + '%'; image.style.top = -100 * y / size + '%'
    image.style.transform = 'translateX(' + (-100 * x) + '%)'
  }
  $('full').setAttribute('aria-pressed', String(!face)); $('face').setAttribute('aria-pressed', String(face))
}
function render() {
  const pack = selectedPack(), list = members()
  if (!pack) { $('empty').hidden = false; $('single').hidden = true; enable(); return }
  if (!list.some(m => m.id === state.member)) state.member = list[0]?.id ?? ''
  const member = selected(), counts = totals(pack), reference = state.data.packs[0], ref = totals(reference)
  const options = state.data.packs.map(p => {
    const o = document.createElement('option'), n = totals(p)
    o.value = p.id; o.textContent = p.label + ' · ' + p.members.length + ' · ' + (p.members.length - n['0']) + ' reviewed'
    return o
  })
  $('pack').replaceChildren(...options); $('pack').value = state.pack
  $('counts').textContent = (pack.members.length - counts['0']) + '/' + pack.members.length +
    ' reviewed · Key ' + counts['2'] + ' · Regular ' + counts['1'] + ' · Rare ' + counts['-1'] + ' · Excluded ' + counts['-2']
  $('reference').textContent = 'Reference · ' + reference.label + ' (' + reference.members.length + ') · Key ' + ref['2'] + ' · Regular ' + ref['1']
  $('empty').hidden = list.length > 0
  $('single').hidden = !member || state.view !== 'single'
  $('grid').hidden = !list.length || state.view !== 'grid'
  $('grid-toggle').textContent = state.view === 'grid' ? 'Single' : 'Grid'
  $('grid-toggle').setAttribute('aria-pressed', String(state.view === 'grid'))
  if (member && state.view === 'single') {
    portrait(member)
    $('name').textContent = member.name; $('rating').textContent = labels[String(member.rating)]
    $('position').textContent = (list.indexOf(member) + 1) + '/' + list.length
    const index = list.indexOf(member)
    $('upcoming').replaceChildren(...list.slice(index + 1, index + 7).map(m => {
      const button = document.createElement('button'), img = document.createElement('img')
      button.type = 'button'; button.title = m.name; button.setAttribute('aria-label', 'Review ' + m.name)
      img.src = imageUrl(m.face?.path ?? m.art.path); img.alt = ''; img.decoding = 'async'
      button.append(img); button.addEventListener('click', () => choose(m.id)); return button
    }))
    // Full portraits prefetch alongside the small upcoming faces; only the next three, not whole packs.
    for (const m of list.slice(index + 1, index + 4)) { const next = new Image(); next.src = imageUrl(m.art.path) }
  }
  if (state.view === 'grid') $('grid').replaceChildren(...list.map(m => {
    const button = document.createElement('button'), img = document.createElement('img'), name = document.createElement('span'), rating = document.createElement('span')
    button.type = 'button'; button.setAttribute('aria-label', 'Review ' + m.name + ', ' + labels[String(m.rating)])
    img.src = imageUrl(state.mode === 'face' && m.face ? m.face.path : m.art.path); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'
    name.textContent = m.name; name.className = 'grid-name'; rating.textContent = labels[String(m.rating)]; rating.className = 'grid-rating'
    button.append(img, name, rating); button.addEventListener('click', () => { state.view = 'single'; choose(m.id) }); return button
  }))
  remember(); enable()
}

async function vote(rating) {
  const member = selected(), pack = selectedPack()
  if (!member || state.busy || state.view !== 'single') return
  const old = member.rating, list = members(), index = list.indexOf(member)
  state.busy = true; clearError(); $('status').textContent = 'Saving'; enable()
  try {
    const value = await post('/api/votes', { revision: state.data.revision, entries: [{ franchise: pack.id, id: member.id, rating }] })
    state.data.revision = value.revision; member.rating = rating
    state.history.push({ franchise: pack.id, id: member.id, rating: old })
    if (state.history.length > 100) state.history.shift()
    const after = members()
    state.member = (after.some(m => m.id === member.id) ? after[index + 1] ?? after[index] : after[index] ?? after.at(-1))?.id ?? ''
    if (!after.length && state.filter === 'unrated' && !state.query) {
      const next = state.data.packs.find(p => p.members.some(m => !m.rating))
      if (next) { state.pack = next.id; state.member = next.members.find(m => !m.rating).id }
    }
    $('status').textContent = 'Saved'
  } catch (error) { fail(error) }
  finally { state.busy = false; render() }
}
async function undo() {
  if (state.busy || !state.history.length) return
  const entry = state.history.at(-1)
  state.busy = true; clearError(); $('status').textContent = 'Saving'; enable()
  try {
    const value = await post('/api/votes', { revision: state.data.revision, entries: [entry] })
    state.data.revision = value.revision
    state.data.packs.find(p => p.id === entry.franchise).members.find(m => m.id === entry.id).rating = entry.rating
    state.history.pop(); state.pack = entry.franchise; state.member = entry.id; state.filter = 'all'; state.query = ''; state.view = 'single'
    $('filter').value = 'all'; $('search').value = ''; $('status').textContent = 'Saved'
  } catch (error) { fail(error) }
  finally { state.busy = false; render() }
}
function skip(direction) {
  if (state.busy) return
  const list = members(), index = list.findIndex(m => m.id === state.member)
  choose(list[Math.max(0, Math.min(list.length - 1, index + direction))]?.id ?? '')
}
async function load() {
  try {
    const response = await fetch('/api/review'), data = await response.json()
    if (!response.ok) throw new Error(data.error)
    state.data = data
    let cursor
    try { cursor = JSON.parse(localStorage.getItem('uma-cast-review-position') ?? '{}') } catch { cursor = {} }
    state.pack = data.packs.find(p => p.id === cursor.pack)?.id ?? data.packs[0]?.id ?? ''
    state.member = cursor.member ?? ''
    clearError(); $('status').textContent = 'Saved'; render()
  } catch (error) { fail(error) }
}
for (const button of document.querySelectorAll('[data-vote]')) button.addEventListener('click', () => vote(Number(button.dataset.vote)))
$('pack').addEventListener('change', () => { state.pack = $('pack').value; state.member = ''; render() })
$('filter').addEventListener('change', () => { state.filter = $('filter').value; render() })
$('search').addEventListener('input', () => { state.query = $('search').value.toLocaleLowerCase().trim(); render() })
$('previous').addEventListener('click', () => skip(-1)); $('skip').addEventListener('click', () => skip(1))
$('undo').addEventListener('click', undo); $('reload').addEventListener('click', load)
$('grid-toggle').addEventListener('click', () => { state.view = state.view === 'grid' ? 'single' : 'grid'; render() })
$('full').addEventListener('click', () => { state.mode = 'full'; render() })
$('face').addEventListener('click', () => { state.mode = 'face'; render() })
$('image').addEventListener('error', () => { $('image-error').hidden = false; $('image').hidden = true })
$('import').addEventListener('click', () => $('import-file').click())
$('import-file').addEventListener('change', async () => {
  const file = $('import-file').files[0]
  if (!file || state.busy) return
  state.busy = true; clearError(); enable()
  try {
    const value = await post('/api/import', { revision: state.data.revision, data: JSON.parse(await file.text()) })
    state.data.revision = value.revision; state.history = []; await load()
  } catch (error) { fail(error) }
  finally { $('import-file').value = ''; state.busy = false; render() }
})
$('export').addEventListener('click', async () => {
  try {
    const response = await fetch('/api/export')
    if (!response.ok) throw new Error('Export failed')
    const url = URL.createObjectURL(new Blob([JSON.stringify(await response.json(), null, 2)], { type: 'application/json' }))
    const link = document.createElement('a'); link.href = url; link.download = 'cast-ratings.json'; link.click(); URL.revokeObjectURL(url)
  } catch (error) { fail(error) }
})
document.addEventListener('keydown', event => {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || /^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName)) return
  if (state.busy || !state.data) return
  if (['1','2','3','4'].includes(event.key)) { event.preventDefault(); void vote([-2,-1,1,2][Number(event.key)-1]) }
  else if (event.key === 'ArrowLeft') { event.preventDefault(); skip(-1) }
  else if (event.key === 'ArrowRight') { event.preventDefault(); skip(1) }
  else if (event.key.toLowerCase() === 'z') { event.preventDefault(); void undo() }
})
await load()
