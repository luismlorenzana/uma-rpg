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
export const RENDER_NAMES = new Set(RENDERS.map((r) => r.name))
export const RENDER_TYPE = { webp: 'image/webp', gif: 'image/gif', png: 'image/png' }

/** The poses a render draws, left to right, for an entry with these poses downloaded; null if she can't have it. */
export function posesOf(render, available) {
  const has = (p) => available.includes(p)
  const poses = render.poses ?? (render.layout === 'splash' && has('aim') && has('cover') ? ['aim', 'cover'] : ['fb'])
  return poses.every(has) ? poses : null
}

/** What a batch renders for a unit with this role (none for Exclude or no vote). */
export const rendersForRole = (tier) => RENDERS.filter((r) => !r.compare && r.roles.includes(tier))
