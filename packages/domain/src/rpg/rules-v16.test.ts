// The Tier rework's fight by generation (H64, D200): classes v2's rules to engine v15, the rework's from v16 behind
// `rpgRework('fight')`, the live game since H72 (D210). The v16 rows are class-progression.md §3 (CP2, CP3, CP12) and
// SB11; every v15 row is the game before H72 exactly, which a v15 fight still replays on.
import { describe, expect, it } from 'vitest'
import {
  RPG_ALL_CLASSES, RPG_CLASS_SLOTS, RPG_TOMES, RPG_WEAPON_KINDS, RPG_WEAPON_SLOTS, rpgClassSlots, rpgClassWeapons, rpgDefaultWeapons, rpgHand,
  rpgPicksWeapons, rpgWeaponSlots, validRpgWeapons, type RpgClass, type RpgWeapon,
} from './rules'
import { BATTLE_ENGINE_VERSION, RPG_REWORK_ENGINE, rpgRework, type RpgReworkStage } from './battle/caps'
import { WEAPON_EXP_PER_WEAPON, WEAPON_EXP_SHARE, weaponExpShares } from '../economy/ranks'

const V15 = 15, V16 = 16
const A = 'arms', T = 'tome'

/** The game before H72 (classes v2, engine v15), written out. */
const TODAY = {
  slots: {
    brawler: [A, A, A, A, A], mage: [T, T, T, T, T], spellblade: [A, A, A, T, T], cleric: [T, T, T, A, A], summoner: [T, T, T, A, A],
    paladin: [A, A, A, T, T],
  },
  weapons: {
    brawler: ['greatsword', 'axe', 'lance', 'bow', 'katana'], mage: ['tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark'],
    spellblade: ['greatsword', 'lance', 'katana', 'tome-fire', 'tome-lightning'], cleric: ['tome-light', 'tome-dark', 'tome-lightning', 'katana', 'bow'],
    summoner: ['tome-fire', 'tome-ice', 'tome-lightning', 'greatsword', 'lance'], paladin: ['greatsword', 'axe', 'lance', 'tome-ice', 'tome-fire'],
  },
  hands: {
    brawler: { arms: 1, tome: 1 }, mage: { arms: 1, tome: 1 }, spellblade: { arms: 0.72, tome: 0.44 }, cleric: { arms: 0.5, tome: 0.5 },
    summoner: { arms: 0.56, tome: 0.58 }, paladin: { arms: 0.5, tome: 0.5 },
  },
} as const
/** The rework's fight (v16): CP2's slots, the lead channel first, and CP3's defaults in slot order. */
const V16_ROWS = {
  slots: { brawler: [A, A, A], mage: [T, T, T], spellblade: [A, A, T], paladin: [A, A, T], summoner: [T, T, A], cleric: [T, T, A] },
  weapons: {
    brawler: ['greatsword', 'axe', 'lance'], mage: ['tome-fire', 'tome-ice', 'tome-lightning'], spellblade: ['katana', 'lance', 'tome-lightning'],
    summoner: ['tome-dark', 'tome-light', 'bow'], paladin: ['greatsword', 'axe', 'tome-light'], cleric: ['tome-light', 'tome-ice', 'bow'],
  },
} as const

describe('the Tier rework’s switch (H64)', () => {
  it('opens each release at its engine, the fight live on 16 since H72 and the rest dark', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(16)
    expect(RPG_REWORK_ENGINE).toEqual({ fight: 16, economy: 17, t2Weapons: 18, t2Classes: 19, t3: 20 })
    const stages = Object.keys(RPG_REWORK_ENGINE) as RpgReworkStage[]
    expect(stages.map((s) => rpgRework(s))).toEqual([true, false, false, false, false])
    expect(stages.map((s) => rpgRework(s, V15))).toEqual([false, false, false, false, false])
    expect([rpgRework('fight', V16), rpgRework('economy', V16)]).toEqual([true, false])
    for (const s of stages) expect([rpgRework(s, RPG_REWORK_ENGINE[s] - 1), rpgRework(s, RPG_REWORK_ENGINE[s]), rpgRework(s, 20)], s).toEqual([false, true, true])
  })
})

describe('class rules, v15 and v16 (H64)', () => {
  it('gives five weapon slots to v15 and three from v16; the live value is three', () => {
    expect([rpgWeaponSlots(V15), rpgWeaponSlots(V16), rpgWeaponSlots()]).toEqual([5, 3, 3])
    expect(RPG_WEAPON_SLOTS).toBe(3)
  })

  it('types the slots by channel from v16, the lead channel first; v15 is classes v2’s', () => {
    for (const c of RPG_ALL_CLASSES) {
      expect(rpgClassSlots(c, V15), c).toEqual(TODAY.slots[c])
      expect(rpgClassSlots(c, V16), c).toEqual(V16_ROWS.slots[c])
      expect(RPG_CLASS_SLOTS[c], c).toEqual(V16_ROWS.slots[c])
    }
  })

  it('starts every class on the owner’s three from v16; v15 is classes v2’s spreads', () => {
    for (const c of RPG_ALL_CLASSES) {
      expect(rpgDefaultWeapons(c, V15), c).toEqual(TODAY.weapons[c])
      expect(rpgDefaultWeapons(c, V16), c).toEqual(V16_ROWS.weapons[c])
      expect(rpgDefaultWeapons(c), c).toEqual(V16_ROWS.weapons[c])
      for (const v of [V15, V16]) expect(validRpgWeapons(c, rpgDefaultWeapons(c, v), v), `${c} v${v}`).toBe(true)
      expect(validRpgWeapons(c, rpgDefaultWeapons(c, V15), V16), c).toBe(false)
      expect(validRpgWeapons(c, rpgDefaultWeapons(c, V16), V15), c).toBe(false)
    }
  })

  it('lets every class pick from v16 (CP12); to v15 the Brawler’s and the Mage’s are fixed', () => {
    for (const c of RPG_ALL_CLASSES) {
      expect(rpgPicksWeapons(c, V15), c).toBe(c !== 'brawler' && c !== 'mage')
      expect(rpgPicksWeapons(c, V16), c).toBe(true)
      expect(rpgPicksWeapons(c), c).toBe(true)
    }
  })

  it('takes three different kinds of her class’s trees from v16, each in a slot of its channel by position', () => {
    // Any three of a slot's channel: a Brawler on Bow, Katana and Axe, a Mage on Light, Dark and Blizzard.
    expect(validRpgWeapons('brawler', ['bow', 'katana', 'axe'], V16)).toBe(true)
    expect(validRpgWeapons('mage', ['tome-light', 'tome-dark', 'tome-ice'], V16)).toBe(true)
    // Five Arms, or two of one kind, never.
    expect(validRpgWeapons('brawler', [...RPG_WEAPON_KINDS], V16)).toBe(false)
    expect(validRpgWeapons('brawler', ['axe', 'axe', 'bow'], V16)).toBe(false)
    expect(validRpgWeapons('mage', ['tome-fire', 'tome-fire', 'tome-ice'], V16)).toBe(false)
    // A Spell Blade's Tome sits in her third slot: Thunder Tome, Katana, Lance is out of place; swaps within a channel are free.
    expect(validRpgWeapons('spellblade', ['tome-lightning', 'katana', 'lance'], V16)).toBe(false)
    expect(validRpgWeapons('spellblade', ['lance', 'katana', 'tome-lightning'], V16)).toBe(true)
    expect(validRpgWeapons('spellblade', ['lance', 'katana', 'tome-fire'], V16)).toBe(true)
    expect(validRpgWeapons('spellblade', ['lance', 'katana', 'bow'], V16)).toBe(false)
    // The Summoner and the Cleric lead with two Tomes, their Arm last.
    expect(validRpgWeapons('summoner', ['tome-dark', 'tome-light', 'katana'], V16)).toBe(true)
    expect(validRpgWeapons('summoner', ['bow', 'tome-dark', 'tome-light'], V16)).toBe(false)
    expect(validRpgWeapons('cleric', ['tome-light', 'tome-fire', 'greatsword'], V16)).toBe(true)
    expect(validRpgWeapons('paladin', ['greatsword', 'tome-light', 'axe'], V16)).toBe(false)
    // Only her class's kinds: a Brawler has no Tome trees, a Mage no Arms.
    expect(validRpgWeapons('brawler', ['greatsword', 'axe', 'tome-fire'], V16)).toBe(false)
    // Every channel's kind fits every class that has that channel (CP12): each of a slot's kinds, in each slot.
    for (const c of RPG_ALL_CLASSES) {
      const slots = rpgClassSlots(c, V16)
      const defaults = rpgDefaultWeapons(c, V16)
      slots.forEach((kind, i) => {
        for (const w of (kind === T ? RPG_TOMES : RPG_WEAPON_KINDS) as readonly RpgWeapon[]) {
          const spread = [...defaults]
          const other = spread.indexOf(w)
          if (other >= 0) spread[other] = spread[i]!
          spread[i] = w
          expect(validRpgWeapons(c, spread, V16), `${c} ${i} ${w}`).toBe(true)
          expect(rpgClassWeapons(c)).toContain(w)
        }
      })
    }
    // v15 still counts: five, and the Tomes by number, not by place.
    expect(validRpgWeapons('spellblade', ['tome-fire', 'tome-lightning', 'greatsword', 'lance', 'katana'], V15)).toBe(true)
    expect(validRpgWeapons('brawler', ['bow', 'katana', 'axe'], V15)).toBe(false)
  })

  it('keeps v2’s hands from v16 but the Summoner’s Arms hand, 0.50 (SB11; H71); her Tome still leads', () => {
    const pick = (c: RpgClass, v?: number) => { const h = rpgHand({ classId: c }, v); return { arms: h.arms, tome: h.tome } }
    for (const c of RPG_ALL_CLASSES) {
      expect(pick(c, V15), c).toEqual(TODAY.hands[c])
      expect(pick(c, V16), c).toEqual(c === 'summoner' ? { arms: 0.5, tome: 0.58 } : TODAY.hands[c])
      expect(pick(c), c).toEqual(pick(c, V16))
      const [h15, h16] = [rpgHand({ classId: c }, V15), rpgHand({ classId: c }, V16)]
      expect({ ...h16, arms: h15.arms }, c).toEqual(h15)
    }
    const summoner = rpgHand({ classId: 'summoner' }, V16)
    expect(summoner.tome > summoner.arms && summoner.pair).toBe(true)
  })
})

describe('weapon EXP, E a weapon (H64)', () => {
  /** v15's rule, written out: 5E over her five weapons, two parts for each one she used. */
  const today = (weapons: readonly RpgWeapon[], used: ReadonlySet<RpgWeapon>, exp: number) => {
    const parts = weapons.reduce((n, w) => n + (used.has(w) ? 2 : 1), 0)
    return Object.fromEntries(weapons.map((w) => [w, Math.round((5 * exp * (used.has(w) ? 2 : 1)) / parts)]))
  }

  it('pays five weapons v15’s 5E exactly, whichever she used (an open v15 fight settles on five)', () => {
    expect([WEAPON_EXP_PER_WEAPON, WEAPON_EXP_SHARE]).toEqual([1, 3])
    for (const c of RPG_ALL_CLASSES) {
      const five = rpgDefaultWeapons(c, V15)
      for (let mask = 0; mask < 32; mask++) {
        const used = new Set(five.filter((_, i) => mask & (1 << i)))
        for (const exp of [0, 1, 7, 70, 100, 333, 1234]) expect(weaponExpShares(five, used, exp), `${c} ${mask} ${exp}`).toEqual(today(five, used, exp))
      }
    }
  })

  it('pays three weapons 3E: E each, and a used one two parts of four', () => {
    const three = rpgDefaultWeapons('brawler', V16)
    expect(weaponExpShares(three, new Set(), 100)).toEqual({ greatsword: 100, axe: 100, lance: 100 })
    expect(weaponExpShares(three, new Set(['axe'] as const), 100)).toEqual({ greatsword: 75, axe: 150, lance: 75 })
    expect(weaponExpShares(three, new Set(three), 90)).toEqual({ greatsword: 90, axe: 90, lance: 90 })
  })
})
