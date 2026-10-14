// Renders an entry's images (formats.mjs) in the browser and hands each to `save(name, blob)`: a still is one WebP
// frame; an animation is one frame every 1/fps s over the idle loop, joined by webp-anim.mjs; the GIF goes through
// gifenc. Each pose is drawn by Spine on a WebGL canvas, then laid side by side on a 2D canvas.
import { GIFEncoder, applyPalette, quantize } from '/vendor/gifenc.esm.js'
import { MAX_LOOP_S, posesOf } from './formats.mjs'
import { poseAt, SpineStage } from './spine-view.js'
import { animatedWebp } from './webp-anim.mjs'

const toBlob = (canvas, type, quality) => new Promise((resolve, reject) =>
  canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error(`the browser couldn't encode ${type}`))), type, quality))

/** Renders `renders` for an entry, skipping any she lacks the poses for, and her splash while poses are still to
 * download (it would fall back to Standing). Returns the names saved. */
export async function renderEntry(entry, renders, save, onStep = () => {}) {
  const available = Object.keys(entry.poses)
  const jobs = renders.map((render) => ({ render, poses: posesOf(render, available) }))
    .filter((j) => j.poses && !(j.render.layout === 'splash' && entry.pending?.length))
  const stage = new SpineStage(document.createElement('canvas'))
  const out = document.createElement('canvas')
  const ctx = out.getContext('2d', { willReadFrequently: true })
  const saved = []
  try {
    const actors = {}
    for (const pose of new Set(jobs.flatMap((j) => j.poses))) actors[pose] = await stage.load(entry, pose)

    /** One frame at time t: each pose in an equal share of the width, wrapping on its own loop. */
    const frame = ({ render, poses }, t) => {
      out.width = render.width
      out.height = render.height
      ctx.clearRect(0, 0, out.width, out.height)
      const panel = Math.round(render.width / poses.length)
      stage.resize(panel, render.height)
      poses.forEach((pose, i) => {
        const actor = actors[pose]
        poseAt(actor, actor.duration > 0 ? t % actor.duration : 0)
        stage.draw(actor)
        ctx.drawImage(stage.canvas, i * panel, 0)
      })
    }

    for (const job of jobs) {
      const { render } = job
      onStep(render.label)
      if (render.kind === 'still') {
        frame(job, 0)
        await save(render.name, await toBlob(out, 'image/webp', render.quality))
        saved.push(render.name)
        continue
      }
      const loop = Math.min(MAX_LOOP_S, Math.max(...job.poses.map((p) => actors[p].duration))) || 1
      const count = Math.max(1, Math.round(loop * render.fps))
      const delay = (loop * 1000) / count
      if (render.kind === 'anim') {
        const frames = []
        for (let i = 0; i < count; i++) {
          frame(job, (i * loop) / count)
          frames.push({ bytes: new Uint8Array(await (await toBlob(out, 'image/webp', render.quality)).arrayBuffer()), duration: delay })
        }
        await save(render.name, new Blob([animatedWebp(frames, render)], { type: 'image/webp' }))
      } else {
        // GIF: 256 colours a frame and on/off transparency.
        const gif = GIFEncoder()
        for (let i = 0; i < count; i++) {
          frame(job, (i * loop) / count)
          const { data } = ctx.getImageData(0, 0, out.width, out.height)
          const palette = quantize(data, 256, { format: 'rgba4444', oneBitAlpha: true })
          const transparentIndex = palette.findIndex((c) => c[3] === 0)
          gif.writeFrame(applyPalette(data, palette, 'rgba4444'), out.width, out.height,
            { palette, delay, dispose: 2, ...(transparentIndex >= 0 ? { transparent: true, transparentIndex } : {}) })
        }
        gif.finish()
        await save(render.name, new Blob([gif.bytes()], { type: 'image/gif' }))
      }
      saved.push(render.name)
    }
  } finally {
    stage.unloadAll()
    stage.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
  return saved
}
