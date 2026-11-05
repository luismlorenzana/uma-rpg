// The collections' stage (D283, H152): windows, Drills and Training Logs, and Ascend one Uma at a time come with save v35.
// They're written dark and turn on when `SAVE_SCHEMA_VERSION` reaches 35 (H157), so one bump switches everything.
import { SAVE_SCHEMA_VERSION } from './version'

/** The save that carries the collections: windows on the account, Drills and Training Logs on each world. */
export const COLLECTIONS_SAVE = 35

/** The save whose windows carry the Weapons track (D289): five more steps at each record's end. */
export const WEAPONS_SAVE = 36

/** Capitals become runs, and World steps record a won run, from save v37 (D293, H160; switched by H162). */
export const CAPITAL_RUNS_SAVE = 37
export const capitalRunsLive = (version: number = SAVE_SCHEMA_VERSION): boolean => version >= CAPITAL_RUNS_SAVE

/** The honeycomb's 48 regions and six Springs (D295, H163), switched on with save v38 by H166. */
export const HONEYCOMB_SAVE = 38

/** Whether a save version plays the collections' rules; the live one by default. */
export const collectionsLive = (version: number = SAVE_SCHEMA_VERSION): boolean => version >= COLLECTIONS_SAVE
