import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { checkSize, entrySrc, LAZY_MODULES, lazyInInitial } from './check-size.mjs'

const ENGINE = '../../packages/domain/src/rpg/battle/engine.ts'
const MIGRATIONS = '../../packages/domain/src/save/migrations.ts'
const NAMES_V1 = ['../../packages/domain/src/items/families.ts', '../../packages/domain/src/items/names-v1.ts']

async function fixture(fn, { entry = 'assets/main.js', imports = [], extra = {}, chunks } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'rpg-size-test-'))
  try {
    await mkdir(join(root, '.vite'))
    await mkdir(join(root, 'assets'))
    await writeFile(join(root, 'index.html'), `<script crossorigin src="/${entry}" type="module"></script>`)
    const manifest = { 'index.html': { file: entry, isEntry: true, imports, dynamicImports: ['lazy'] },
      lazy: { file: 'assets/phaser.js' }, ...extra }
    await writeFile(join(root, '.vite/manifest.json'), JSON.stringify(manifest))
    await writeFile(join(root, 'assets/main.js'), 'console.log("boot")')
    await writeFile(join(root, 'assets/phaser.js'), noise(300_000))
    for (const node of Object.values(extra)) if (node.file.startsWith('assets/')) await writeFile(join(root, node.file), noise(240_000))
    const map = chunks ?? Object.fromEntries([entry, 'assets/phaser.js', ...Object.values(extra).map((n) => n.file)].map((f) => [f, ['src/main.tsx']]))
    if (chunks !== null) await writeFile(join(root, '.vite/chunks.json'), JSON.stringify(map))
    await fn(root)
  } finally { await rm(root, { recursive: true, force: true }) } // Only this freshly created fixture directory.
}
function noise(length) {
  let seed = 123456789
  return Buffer.from(Array.from({ length }, () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return seed >>> 24 }))
}

test('finds the module src regardless of attribute order and rejects an absent/ambiguous entry', () => {
  assert.equal(entrySrc('<script src="/assets/main.js" type="module" crossorigin>'), '/assets/main.js')
  assert.throws(() => entrySrc('<script src="/assets/main.js">'), /one module/)
  assert.throws(() => entrySrc('<script type="module" src="a.js"><script type="module" src="b.js">'), /one module/)
})
test('measures the entry, not a large lazy Phaser asset, and includes the exact budget boundary', async () => {
  await fixture(async (root) => {
    const result = await checkSize(root)
    assert.equal(result.files.length, 1)
    assert.equal(result.entry, 'assets/main.js')
    await checkSize(root, result.mainGzip)
    await assert.rejects(checkSize(root, result.mainGzip - 1), /exceeds/)
  })
})
test('counts static imports so a small entry cannot hide oversized initial vendor JS', async () => {
  await fixture(async (root) => { await assert.rejects(checkSize(root), /exceeds/) },
    { imports: ['vendor'], extra: { vendor: { file: 'assets/vendor.js' } } })
})
test('refuses traversal and missing static manifest nodes', async () => {
  await fixture(async (root) => { await assert.rejects(checkSize(root), /Unsafe JS/) }, { entry: '../escape.js' })
  await fixture(async (root) => { await assert.rejects(checkSize(root), /Missing static chunk/) }, { imports: ['missing'] })
})
test('refuses the fight engine in the entry, and allows it in a lazy chunk (H62)', async () => {
  await fixture(async (root) => { await assert.rejects(checkSize(root), /load on demand.*engine\.ts \(assets\/main\.js\)/) },
    { chunks: { 'assets/main.js': ['src/main.tsx', ENGINE], 'assets/phaser.js': [] } })
  await fixture(async (root) => { assert.equal((await checkSize(root)).files.length, 1) },
    { chunks: { 'assets/main.js': ['src/main.tsx'], 'assets/phaser.js': [ENGINE] } })
})
test('refuses old saves\' migrations or the v1 names in the entry, and allows them in lazy chunks (H136)', async () => {
  await fixture(async (root) => { await assert.rejects(checkSize(root), /\(H62, H136\).*save\/migrations\.ts \(assets\/main\.js\)/) },
    { chunks: { 'assets/main.js': ['src/main.tsx', '../../packages/domain/src/save/save.ts', MIGRATIONS], 'assets/phaser.js': [] } })
  for (const names of NAMES_V1) {
    await fixture(async (root) => { await assert.rejects(checkSize(root), (error) => error.message.includes(`${names} (assets/main.js)`)) },
      { chunks: { 'assets/main.js': ['src/main.tsx', '../../packages/domain/src/items/catalog.ts', names], 'assets/phaser.js': [] } })
  }
  await fixture(async (root) => { assert.equal((await checkSize(root)).files.length, 1) },
    { chunks: { 'assets/main.js': ['src/main.tsx', '../../packages/domain/src/save/save.ts', '../../packages/domain/src/items/catalog.ts'],
      'assets/phaser.js': [MIGRATIONS, ...NAMES_V1] } })
})
test('refuses a lazy module in a static import, and a build without its chunk map', async () => {
  const small = { file: 'assets/vendor.js' }
  await fixture(async (root) => {
    await writeFile(join(root, 'assets/vendor.js'), 'export const x = 1')
    await assert.rejects(checkSize(root), /save\/battle\.ts \(assets\/vendor\.js\)/)
  }, { imports: ['vendor'], extra: { vendor: small }, chunks: { 'assets/main.js': [], 'assets/vendor.js': ['../../packages/domain/src/save/battle.ts'] } })
  await fixture(async (root) => { await assert.rejects(checkSize(root), /Missing \.vite\/chunks\.json/) }, { chunks: null })
})
test('matches whole module paths only', () => {
  assert.deepEqual(lazyInInitial({ a: ['../../packages/domain/src/rpg/battle/engine-v15.test.ts', 'x/save/battle.tsx'] }, ['a']), [])
  assert.equal(lazyInInitial({ a: [ENGINE] }, ['a']).length, 1)
  assert.throws(() => lazyInInitial({}, ['a']), /missing a/)
  assert.ok(LAZY_MODULES.includes('packages/domain/src/rpg/battle/engine.ts'))
  for (const path of ['save/migrations.ts', 'save/classes-v3.ts', 'save/class-tiles.ts', 'items/families.ts', 'items/names-v1.ts']) assert.ok(LAZY_MODULES.includes(`packages/domain/src/${path}`), path)
  // The id-level catalog stays in the entry: only its names left (H136).
  assert.deepEqual(lazyInInitial({ a: ['../../packages/domain/src/items/catalog.ts', '../../packages/domain/src/items/identity.ts'] }, ['a']), [])
})
