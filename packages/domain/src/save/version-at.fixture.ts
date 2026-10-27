// Test-only (excluded from the build): the farm by line's switch mocked to a save version (H109), as `caps-at.fixture.ts`
// mocks the engine. A rule's default `save` closes over `version.ts`' own SAVE_SCHEMA_VERSION, so a mock overrides the
// constant and the predicate that reads it. A test file mocks it in a file of its own; `vi.mock` is hoisted above the
// imports, so its factory imports this module itself:
//
//   vi.mock('../save/version', async (orig) => (await import('../save/version-at.fixture')).versionAt(30, await orig()))
//
// with the paths from that test. H109–H111 mock 30 until H112 makes it live.
import type * as Version from './version'

type VersionModule = typeof Version

/** `version.ts` with the save at `version`: SAVE_SCHEMA_VERSION, and `farmByLine` reading it as its default. */
export function versionAt(version: number, original: unknown): VersionModule {
  const v = original as VersionModule
  return { ...v, SAVE_SCHEMA_VERSION: version as VersionModule['SAVE_SCHEMA_VERSION'], farmByLine: (save: number = version) => save >= v.FARM_BY_LINE_SAVE }
}
