// The owner's role vote for each L2D roster entry (docs/design/l2d-enemies.md). Pure, so the server and the browser
// share it; the server keeps the file (content/l2d/tiers.json) and an append-only history beside it.

/** Exclude drops her; the other four are the enemy roles, matching the authoring tiers' Regular, KeyEnemy, MiniBoss and
 * FinalBoss. */
export const TIERS = ['exclude', 'regular', 'key', 'subboss', 'boss']
export const TIER_LABEL = { exclude: 'Exclude', regular: 'Regular', key: 'Key enemy', subboss: 'Sub-boss', boss: 'Boss' }

export const emptyTiers = () => ({ schemaVersion: 1, revision: 0, tiers: {} })

/** A saved file's contents, checked: unknown keys, tiers or ids are refused rather than half-read. */
export function parseTiers(value) {
  if (!value || value.schemaVersion !== 1 || !Number.isInteger(value.revision) || value.revision < 0) throw new Error('not an L2D tiers file')
  if (!value.tiers || typeof value.tiers !== 'object' || Array.isArray(value.tiers)) throw new Error('tiers must be an object')
  const tiers = {}
  for (const [id, tier] of Object.entries(value.tiers)) {
    if (!/^[a-z0-9_]{1,40}$/.test(id)) throw new Error(`bad id ${JSON.stringify(id)}`)
    if (!TIERS.includes(tier)) throw new Error(`${id}: unknown tier ${JSON.stringify(tier)}`)
    tiers[id] = tier
  }
  return { schemaVersion: 1, revision: value.revision, tiers }
}

/** One vote: a tier, or null to clear it. Returns the next state. */
export function applyVote(state, id, tier) {
  if (tier !== null && !TIERS.includes(tier)) throw new Error(`unknown tier ${JSON.stringify(tier)}`)
  const tiers = { ...state.tiers }
  if (tier === null) delete tiers[id]
  else tiers[id] = tier
  return { schemaVersion: 1, revision: state.revision + 1, tiers }
}

export function tierCounts(tiers) {
  const counts = Object.fromEntries(TIERS.map((t) => [t, 0]))
  for (const tier of Object.values(tiers)) counts[tier]++
  return counts
}
