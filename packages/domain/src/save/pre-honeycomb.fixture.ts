// Test-only downgrade of constructors used to author historical saves. Never run this on a live save.
export function beforeHoneycomb<T>(save: T): T {
  const worlds = (save as { tierWorlds: Record<string, { parties: unknown[]; regionTeams?: unknown }> }).tierWorlds
  for (const world of Object.values(worlds)) {
    world.parties = world.parties.slice(0, 20)
    delete world.regionTeams
  }
  return save
}
