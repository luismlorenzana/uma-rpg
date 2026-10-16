// Material requirements planning (D126, docs/design/gear-and-targets.md §2): the standard netting pass over a recipe
// graph. It knows nothing of Umas or facilities: callers give the end products wanted, each item's recipe and each
// item's supply, and it returns, for every item reached, what is needed, held, coming and still to start.

export interface Supply {
  /** In stock and free: what queued jobs hold for themselves is already taken out. */
  onHand: number
  /** What running and queued jobs will still make. */
  coming: number
}
export interface Requirement {
  id: string
  /** What the end products need of it, through the recipes. */
  gross: number
  onHand: number
  coming: number
  /** What still has to be started: `max(0, gross − onHand − coming)`. Only this flows down to its inputs. */
  net: number
}
export interface RequirementsInput {
  /** End products and how many of each. */
  demand: ReadonlyMap<string, number>
  /** One item's inputs, per unit; null for a raw item. */
  recipe: (id: string) => Readonly<Record<string, number>> | null
  supply: (id: string) => Supply
}

/** The deepest a recipe chain may go: guards against a cycle in a bad recipe table. */
const MAX_DEPTH = 16

/** Nets every item reached from the demand, parents before children (each item at its deepest level). */
export function planRequirements({ demand, recipe, supply }: RequirementsInput): Map<string, Requirement> {
  // Low-level codes: an item shared by several chains is netted once, after every parent that needs it.
  const level = new Map<string, number>()
  const visit = (id: string, depth: number) => {
    if (depth > MAX_DEPTH) throw new RangeError(`recipe chain too deep at ${id}`)
    if ((level.get(id) ?? -1) >= depth) return
    level.set(id, depth)
    for (const child of Object.keys(recipe(id) ?? {})) visit(child, depth + 1)
  }
  for (const [id, n] of demand) if (n > 0) visit(id, 0)
  const gross = new Map<string, number>()
  for (const [id, n] of demand) if (n > 0) gross.set(id, n)
  const out = new Map<string, Requirement>()
  const order = [...level.keys()].sort((a, b) => level.get(a)! - level.get(b)! || a.localeCompare(b))
  for (const id of order) {
    const need = gross.get(id) ?? 0
    const { onHand, coming } = supply(id)
    const net = Math.max(0, need - onHand - coming)
    out.set(id, { id, gross: need, onHand, coming, net })
    if (net > 0) for (const [child, n] of Object.entries(recipe(id) ?? {})) gross.set(child, (gross.get(child) ?? 0) + n * net)
  }
  return out
}
