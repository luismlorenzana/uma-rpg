// Draws a downloaded pose with Spine's WebGL runtime: loads her skeleton and atlas from /src, frames her on the canvas,
// and draws any moment of her idle loop. The models use Spine 4.0 and 4.1, which read differently, so each skeleton
// goes through its own version's runtime (/vendor/spine.js defines `spine40` and `spine41`). Used live by the reviewer
// and frame by frame by the renderer.
import { idlesFor, skinsFor } from './roster.mjs'
import { MARGIN } from './formats.mjs'

const RUNTIMES = { '4.0': 'spine40', '4.1': 'spine41' }

export class SpineStage {
  constructor(canvas) {
    this.canvas = canvas
    /** Per Spine version: its runtime, context, renderer and asset manager, all on this canvas's one WebGL context. */
    this.kits = {}
  }

  kit(version) {
    if (!this.kits[version]) {
      const spine = globalThis[RUNTIMES[version]]
      if (!spine) throw new Error(`no runtime for Spine ${version}`)
      const context = new spine.ManagedWebGLRenderingContext(this.canvas, { alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true })
      this.kits[version] = { spine, context, renderer: new spine.SceneRenderer(this.canvas, context, true), assets: new spine.AssetManager(context, '') }
    }
    return this.kits[version]
  }

  get gl() {
    return this.kit('4.1').context.gl
  }

  /** Loads one pose of an entry: `{ skeleton, state, animation, duration, bounds }`, posed at the loop's start. */
  async load(entry, pose) {
    const stem = entry.poses[pose]
    if (!stem) throw new Error(`no ${pose} pose downloaded`)
    const kit = this.kit(entry.spine?.[pose] ?? '4.1')
    const { spine, assets } = kit
    const base = `/src/${entry.id}/${stem}`
    // Load callbacks, not loadAll(): it polls on animation frames, which stop in a hidden tab.
    const loaded = (method, path) => new Promise((resolve, reject) =>
      assets[method](path, resolve, (_, message) => reject(new Error(message ?? `couldn't load ${path}`))))
    await Promise.all([loaded('loadBinary', `${base}.skel`), loaded('loadTextureAtlas', `${base}.atlas`)])
    const atlas = assets.require(`${base}.atlas`)
    const data = new spine.SkeletonBinary(new spine.AtlasAttachmentLoader(atlas)).readSkeletonData(assets.require(`${base}.skel`))
    const skeleton = new spine.Skeleton(data)
    const skin = skinsFor(entry.id, pose).find((name) => data.findSkin(name)) ?? data.skins[0]?.name
    if (skin) skeleton.setSkinByName(skin)
    skeleton.setSlotsToSetupPose()
    const state = new spine.AnimationState(new spine.AnimationStateData(data))
    const animation = idlesFor(entry.id, pose).map((name) => data.findAnimation(name)).find(Boolean) ?? data.animations[0]
    const actor = { pose, kit, skeleton, state, animation: animation?.name ?? null, duration: animation?.duration ?? 0 }
    if (animation) state.setAnimation(0, animation.name, true)
    actor.bounds = loopBounds(actor)
    poseAt(actor, 0)
    return actor
  }

  /** Frees every loaded texture and skeleton. */
  unloadAll() {
    for (const kit of Object.values(this.kits)) kit.assets.removeAll()
  }

  /** Sizes the canvas's drawing buffer, in pixels. */
  resize(width, height) {
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width
      this.canvas.height = height
    }
  }

  /** Clears the canvas and draws one actor fitted into it (a box in canvas pixels; the whole canvas by default). */
  draw(actor, box = { x: 0, y: 0, w: this.canvas.width, h: this.canvas.height }) {
    // World units per pixel, so her loop's bounds fit the box with a margin; the box's centre (y down in pixels)
    // sits on her bounds' centre.
    const b = actor.bounds
    const scale = Math.max(b.w / (box.w * (1 - 2 * MARGIN)), b.h / (box.h * (1 - 2 * MARGIN)))
    const cx = b.x + b.w / 2 - (box.x + box.w / 2 - this.canvas.width / 2) * scale
    const cy = b.y + b.h / 2 + (box.y + box.h / 2 - this.canvas.height / 2) * scale
    const w = this.canvas.width * scale, h = this.canvas.height * scale
    this.drawRect(actor, { x: cx - w / 2, y: cy - h / 2, w, h })
  }

  /** Clears the canvas and draws exactly this world rectangle (y up) across it. */
  drawRect(actor, rect) {
    const { context, renderer } = actor.kit
    const gl = context.gl
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    const camera = renderer.camera
    camera.setViewport(rect.w, rect.h)
    camera.position.x = rect.x + rect.w / 2
    camera.position.y = rect.y + rect.h / 2
    renderer.begin()
    renderer.drawSkeleton(actor.skeleton, true)
    renderer.end()
  }

  /**
   * Her bounds in the current pose, trimmed to what's actually drawn: Spine's bounds count every attachment, hidden or
   * see-through ones too. Draws her loop bounds at up to 1024 px and keeps the pixels with any alpha.
   */
  figureBounds(actor) {
    const b = actor.bounds, side = 1024, scale = Math.max(b.w, b.h) / side
    const width = Math.max(1, Math.round(b.w / scale)), height = Math.max(1, Math.round(b.h / scale))
    this.resize(width, height)
    this.drawRect(actor, b)
    const gl = actor.kit.context.gl, pixels = new Uint8Array(width * height * 4)
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
    let x0 = width, y0 = height, x1 = -1, y1 = -1
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      if (pixels[(y * width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
    }
    if (x1 < 0) throw new Error('nothing drawn in this pose')
    // readPixels rows start at the bottom, as world y does. Her head's top: the highest row at least head-wide (3.5% of
    // her height), so an upright rifle or a pole above her doesn't count. Bones can't tell: their names vary, and some
    // "head" bones belong to a pet. Her crown: the middle of what's drawn in the 6% of her height below that.
    const opaque = (x, y) => pixels[(y * width + x) * 4 + 3] > 8
    const wide = Math.max(3, (y1 - y0 + 1) * 0.035)
    let head = y1
    for (; head > y0; head--) {
      let n = 0
      for (let x = x0; x <= x1; x++) if (opaque(x, head)) n++
      if (n >= wide) break
    }
    let sum = 0, count = 0
    for (let y = Math.max(y0, head - Math.ceil((y1 - y0 + 1) * 0.06)); y <= head; y++) for (let x = x0; x <= x1; x++) if (opaque(x, y)) { sum += x; count++ }
    return { x: b.x + x0 * scale, y: b.y + y0 * scale, w: (x1 - x0 + 1) * scale, h: (y1 - y0 + 1) * scale,
      top: b.y + (head + 1) * scale, crownX: b.x + (sum / count + 0.5) * scale }
  }
}

/** Poses an actor at a time into her loop, in seconds. */
export function poseAt(actor, seconds) {
  const track = actor.state.getCurrent(0)
  if (track) track.trackTime = seconds
  actor.skeleton.setToSetupPose()
  actor.state.apply(actor.skeleton)
  actor.skeleton.updateWorldTransform()
}

/** Her bounds over the whole idle loop (sampled), so a frame never cuts off a swaying arm. */
function loopBounds(actor) {
  const { spine } = actor.kit
  const offset = new spine.Vector2(), size = new spine.Vector2()
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  const samples = actor.duration > 0 ? 12 : 1
  for (let i = 0; i < samples; i++) {
    poseAt(actor, (actor.duration * i) / samples)
    actor.skeleton.getBounds(offset, size, [])
    if (!Number.isFinite(size.x) || size.x <= 0) continue
    x0 = Math.min(x0, offset.x); y0 = Math.min(y0, offset.y)
    x1 = Math.max(x1, offset.x + size.x); y1 = Math.max(y1, offset.y + size.y)
  }
  if (!Number.isFinite(x0)) throw new Error('nothing visible in this pose')
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}
