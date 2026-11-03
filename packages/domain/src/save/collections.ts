// The collections' stage (D283, H152): windows, Drills and Training Logs, and Ascend one Uma at a time come with save v35.
// They're written dark and turn on when `SAVE_SCHEMA_VERSION` reaches 35 (H157), so one bump switches everything.
import { SAVE_SCHEMA_VERSION } from './version'

/** The save that carries the collections: windows on the account, Drills and Training Logs on each world. */
export const COLLECTIONS_SAVE = 35

/** The save whose windows carry the Weapons track (D289): five more steps at each record's end. */
export const WEAPONS_SAVE = 36

/** Whether a save version plays the collections' rules; the live one by default. */
export const collectionsLive = (version: number = SAVE_SCHEMA_VERSION): boolean => version >= COLLECTIONS_SAVE
