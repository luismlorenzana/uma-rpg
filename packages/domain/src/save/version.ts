// The save's schema version, and the farm by line's switch (D224; farm-by-line.md §10, H109), in a module with no imports
// so the catalogs and the rules read them without a cycle through `save.ts`. `farmByLine` mirrors `rpgRework`: the farm
// by line is built dark (H109–H111) and turned on by its switch (H112), which moves SAVE_SCHEMA_VERSION to 30. Tests
// mock it with `version-at.fixture.ts`.

export const SAVE_SCHEMA_VERSION = 29
/** The save that turns the farm by line on (FL17–FL21). */
export const FARM_BY_LINE_SAVE = 30
/** Whether a save plays the farm by line: every trade gathers, processes and makes its own line, on G1–G10 materials. */
export const farmByLine = (save: number = SAVE_SCHEMA_VERSION): boolean => save >= FARM_BY_LINE_SAVE
