// `@rpg/domain/rift` (D173): the Rift's generator and its achievement hook, a lazy subpath the main bundle never loads.
// The save shape and small constants stay in the main index (`rift/state.ts`); the run rules (H48) join this barrel.
export * from './achievements'
export * from './fronts'
export * from './generate'
export * from './picker'
