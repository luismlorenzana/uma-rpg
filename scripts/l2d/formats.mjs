// The images rendered from each entry's poses (docs/design/l2d-enemies.md), on the authoring pass's ratios: the square
// face is the viewer's own icon; the vertical is her Standing pose at 2:3; the splash is 16:9, Aim and Cover side by
// side (her back and her weapon-ready front), or her Standing pose alone when she has no battle poses. Pure: the
// server allowlists these names and the browser renders them.

/** The longest loop recorded: an idle longer than this is cut (and won't loop seamlessly). */
export const MAX_LOOP_S = 6
/** Space left around the figure, as a share of the panel. */
export const MARGIN = 0.03
const STILL = { kind: 'still', quality: 0.86 }
const ANIM = { kind: 'anim', fps: 12, quality: 0.7 }
const ROLES = ['regular', 'key', 'subboss', 'boss']
const BOSSES = ['subboss', 'boss']

/**
 * Each render: its canvas, its layout (or fixed poses), and the roles whose units get it in a batch. Comparisons are
 * the options weighed in the design note, rendered only on request.
 */
export const RENDERS = [
  { name: 'full.webp', label: 'Vertical 2:3', width: 600, height: 900, layout: 'standing', roles: ROLES, ...STILL },
  { name: 'splash.webp', label: 'Splash 16:9', width: 1280, height: 720, layout: 'splash', roles: ROLES, ...STILL },
  { name: 'full-anim.webp', label: 'Vertical 2:3 · animated', width: 400, height: 600, layout: 'standing', roles: BOSSES, ...ANIM },
  { name: 'splash-anim.webp', label: 'Splash 16:9 · animated', width: 720, height: 405, layout: 'splash', roles: BOSSES, ...ANIM },
  { name: 'compare-front-back.webp', label: 'Compare · Standing + Aim', width: 1280, height: 720, poses: ['fb', 'aim'], compare: true, ...STILL },
  { name: 'compare-splash-hq.webp', label: 'Compare · animated at 960×540, 15 fps', width: 960, height: 540, layout: 'splash', compare: true, ...ANIM, fps: 15, quality: 0.86 },
  { name: 'compare-splash.gif', label: 'Compare · GIF', width: 720, height: 405, layout: 'splash', compare: true, ...ANIM, kind: 'gif' },
]
export const RENDER_TYPE = { webp: 'image/webp', gif: 'image/gif', png: 'image/png' }

/**
 * The locked pack's images (D134), on the other franchises' export terms: lossless PNG, 2:3 vertical at 640×960, 16:9
 * splash at 1280×720 (Key enemy, Sub-boss and Boss only), and a face only for the few without the viewer's icon.
 */
export const PACK = {
  vertical: { name: 'pack-vertical.png', width: 640, height: 960 },
  splash: { name: 'pack-splash.png', width: 1280, height: 720 },
  face: { name: 'pack-face.png', width: 256, height: 256 },
}
export const RENDER_NAMES = new Set([...RENDERS.map((r) => r.name), ...Object.values(PACK).map((p) => p.name)])
/** How much of a figure the vertical keeps, from the top: head to about the knees, so she fills the frame. */
export const KEEP = 0.75

// Framing, in world units with y up: a figure is her trimmed bounds { x, y, w, h } (y her lowest point), plus `top`, the
// top of her head (below anything thin she holds up), and `crownX`, the middle of her head.

/** The 2:3 vertical: the top KEEP of her height, from the top of her head, centred on her head; props wider than that
 * are cut at the sides, and a narrow figure is never cut. */
export function verticalCrop(fig, ratio = 2 / 3, keep = KEEP, margin = MARGIN) {
  const top = fig.top ?? fig.y + fig.h, h = (top - fig.y) * keep * (1 + margin), w = h * ratio
  return { x: centreWithin(fig, fig.crownX ?? fig.x + fig.w / 2, w, margin), y: top + margin * h - h, w, h }
}

/** The left edge of a crop `w` wide, centred on x but kept to the figure: no empty side while she fills the width,
 * no cut while she's narrower. */
function centreWithin(fig, x, w, margin) {
  const a = fig.x - margin * w, b = fig.x + fig.w + margin * w - w
  return Math.min(Math.max(x - w / 2, Math.min(a, b)), Math.max(a, b))
}

/** The whole figure, centred, at a ratio, with a margin all round. */
export function containCrop(fig, ratio, margin = MARGIN) {
  const w = Math.max(fig.w, fig.h * ratio) * (1 + 2 * margin), h = w / ratio
  return { x: fig.x + fig.w / 2 - w / 2, y: fig.y + fig.h / 2 - h / 2, w, h }
}

/** A square face, centred on her head: about an eighth of her height below its top, so tall ears or hats don't push
 * her face to the bottom edge. */
export function faceCrop(fig) {
  const top = fig.top ?? fig.y + fig.h, side = (top - fig.y) * 0.2, cy = top - (top - fig.y) * 0.11
  return { x: (fig.crownX ?? fig.x + fig.w / 2) - side / 2, y: cy - side / 2, w: side, h: side }
}

/** The poses a render draws, left to right, for an entry with these poses downloaded; null if she can't have it. */
export function posesOf(render, available) {
  const has = (p) => available.includes(p)
  const poses = render.poses ?? (render.layout === 'splash' && has('aim') && has('cover') ? ['aim', 'cover'] : ['fb'])
  return poses.every(has) ? poses : null
}

/** What a batch renders for a unit with this role (none for Exclude or no vote). */
export const rendersForRole = (tier) => RENDERS.filter((r) => !r.compare && r.roles.includes(tier))
