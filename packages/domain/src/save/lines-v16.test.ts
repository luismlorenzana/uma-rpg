// A tree's line over the save (H69, D205; class-progression.md §6.1, CP14, CP18, CP23), live since H72 (D210). Her line
// on each of her class's trees is a free pick that her equipped skills follow; nothing is learned; her profile, loadout
// and fights read her lines. Invented outfits.
import { describe, expect, it } from 'vitest'
import { rpgNode } from '../rpg/catalog'
import { rpgDefaultWeapons } from '../rpg/rules'
import { regionChapter, worldContinent } from '../world/world'
import {
  classOf, equipSkills, holdWeapon, partyMembers, pickBranch, setClassWeapons, startFight, umaLoadout,
  umaProfile, type BattleOutfit,
} from './battle'
import { wearClassPreset } from './presets'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, parseSave, type OwnedUma, type Save, type TierWorld } from './save'


const T = (n: number) => new Date(Date.UTC(2026, 9, 25, 12) + n * 60_000).toISOString()
const outfit = (outfitId: string, style: 'front' | 'pace' | 'end', power = 104, wit = 90): BattleOutfit => ({
  outfitId, baseStats: { speed: 110, stamina: 110, power, guts: 110, wit },
  growthRatePercents: { speed: 10, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: style === 'front' ? 'A' : 'B', pace: style === 'pace' ? 'A' : 'B', late: 'B', end: style === 'end' ? 'A' : 'B' },
    distance: { sprint: 'B', mile: 'B', medium: 'A', long: 'B' } },
})
/** A front-running Brawler, a Pace Spell Blade, a Wit-led Pace Mage, an end-closing Summoner and another Brawler. */
const PARTY = [outfit('101', 'front'), outfit('102', 'pace'), outfit('103', 'pace', 90, 104), outfit('104', 'end'), outfit('105', 'front')]
const OUTFITS: ReadonlyMap<string, BattleOutfit> = new Map(PARTY.map((o) => [o.outfitId, o]))
const STARTS = ['brawler', 'spellblade', 'mage', 'summoner', 'brawler'] as const
const BRAWLER = PARTY[0]!
const name = (id: string) => rpgNode(id)!.name
const ura = regionChapter(worldContinent({ name: 'Sim', order: 1 }).regions[0]!, Array.from({ length: 7 }, (_, i) => ({ id: `cast${i}`, name: `Rival ${i}` })))

/** The five unlocked in their starts, in party 1, each at Uma Lv 30 and Class Rank 30 (depths 1–4 open). */
function party(): Save {
  let save = newSave('Trainer', T(0))
  for (const [slot, [o, start]] of PARTY.map((p, i) => [p, STARTS[i]!] as const).entries()) {
    save = unlockUma(save, o.outfitId, T(0), '1', start)
    save = setPartySlot(save, 0, slot, o.outfitId, T(0))
  }
  return edit(save, (w) => {
    for (const uma of Object.values(w.umas)) {
      uma.level = 30
      uma.ranks.classes[uma.classId!] = { rank: 30, exp: 0 }
    }
  })
}
const edit = (save: Save, change: (w: TierWorld) => void): Save => {
  const copy: Save = JSON.parse(JSON.stringify(save))
  change(copy.tierWorlds['1']!)
  return copy
}
const umaOf = (save: Save, id: string): OwnedUma => worldOf(save).umas[id]!
const roundTrip = (save: Save) => expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
const ids = (refs: readonly { id: string }[]) => refs.map((r) => r.id)

describe('a tree’s line over the save (H69)', () => {
  it('sets her up on her three defaults, every tree on A, skills chosen for her', () => {
    const save = party()
    expect(classOf(umaOf(save, '101'), 'brawler')).toEqual({ weapons: ['greatsword', 'axe', 'lance'], lines: {}, loadout: null })
    expect(classOf(umaOf(save, '101'), 'mage')).toEqual({ weapons: rpgDefaultWeapons('mage', 16), lines: {}, loadout: null })
  })

  it('takes line B with her equipped skills following, Rend becoming Rending Combo, and back', () => {
    const save = equipSkills(party(), BRAWLER, 'brawler', ['brawler-greatsword.4', 'brawler-axe.4', 'brawler-greatsword.2'], T(1))
    const b = pickBranch(save, BRAWLER, 'brawler', 'greatsword', 'B', T(2))
    expect(classOf(umaOf(b, '101'), 'brawler')).toEqual({ weapons: ['greatsword', 'axe', 'lance'], lines: { greatsword: 'B' },
      loadout: ['brawler-greatsword.4b', 'brawler-axe.4', 'brawler-greatsword.2'] })
    expect([name('brawler-greatsword.4'), name('brawler-greatsword.4b')]).toEqual(['Rend', 'Rending Combo'])
    roundTrip(b)
    const a = pickBranch(b, BRAWLER, 'brawler', 'greatsword', 'A', T(3))
    expect(classOf(umaOf(a, '101'), 'brawler')).toEqual(classOf(umaOf(save, '101'), 'brawler'))
    // A line she already has changes nothing.
    expect(pickBranch(b, BRAWLER, 'brawler', 'greatsword', 'B', T(4))).toBe(b)
    // Any kind of her class, slotted or not; her auto loadout stays auto.
    const bow = pickBranch(party(), BRAWLER, 'brawler', 'bow', 'B', T(2))
    expect(classOf(umaOf(bow, '101'), 'brawler')).toEqual({ weapons: ['greatsword', 'axe', 'lance'], lines: { bow: 'B' }, loadout: null })
    roundTrip(bow)
    // Another class's tree is hers to pick too, set up on its defaults.
    expect(classOf(umaOf(pickBranch(party(), BRAWLER, 'mage', 'tome-ice', 'B', T(2)), '101'), 'mage'))
      .toEqual({ weapons: rpgDefaultWeapons('mage', 16), lines: { 'tome-ice': 'B' }, loadout: null })
  })

  it('refuses a kind outside her class and a line that isn’t A or B (nothing is learned: the save-level learning rules retired with H72)', () => {
    const save = party()
    expect(() => pickBranch(save, BRAWLER, 'brawler', 'tome-fire', 'B', T(1))).toThrow('Not in this class’s trees')
    expect(() => pickBranch(save, BRAWLER, 'brawler', 'axe', 'C' as 'B', T(1))).toThrow('No such line')
  })

  it('builds her profile and loadout from her lines: no sides, no legacy, B’s nodes where she is on B', () => {
    const save = pickBranch(party(), BRAWLER, 'brawler', 'lance', 'B', T(1))
    const uma = umaOf(save, '101')
    expect(umaProfile(BRAWLER, uma, 1)).toMatchObject({ classId: 'brawler', weapons: ['greatsword', 'axe', 'lance'], tree: [], legacy: [],
      lines: { lance: 'B' }, classRank: 30 })
    // Auto: each weapon's deepest held skill in turn, her Lance's from its B line (the catalog's side a).
    expect(ids(umaLoadout(BRAWLER, uma, 1))).toEqual(['brawler-greatsword.4', 'brawler-axe.4', 'brawler-lance.4a', 'brawler-greatsword.3', 'brawler-axe.3',
      'brawler-lance.3a'])
    // A picked loadout keeps only what she holds: the Lance's core at depth 4 is off her path.
    const picked = equipSkills(save, BRAWLER, 'brawler', ['brawler-lance.4a', 'brawler-lance.2'], T(2))
    expect(ids(umaLoadout(BRAWLER, umaOf(picked, '101'), 1))).toEqual(['brawler-lance.4a', 'brawler-lance.2'])
    expect(() => equipSkills(save, BRAWLER, 'brawler', ['brawler-lance.4'], T(2))).toThrow('equip up to 6 skills she knows')
    // Depth 5 isn't open at Class Rank 30.
    expect(() => equipSkills(save, BRAWLER, 'brawler', ['brawler-lance.5a'], T(2))).toThrow('equip up to 6 skills she knows')
  })

  it('drops the equipped skills of a tree she stops slotting, back to auto when none is left', () => {
    const save = equipSkills(party(), BRAWLER, 'brawler', ['brawler-lance.4', 'brawler-axe.2'], T(1))
    const bow = holdWeapon(save, '101', 'brawler', 2, 'bow', null, T(2))
    expect(classOf(umaOf(bow, '101'), 'brawler')).toEqual({ weapons: ['greatsword', 'axe', 'bow'], lines: {}, loadout: ['brawler-axe.2'] })
    roundTrip(bow)
    const none = setClassWeapons(bow, '101', 'brawler', ['greatsword', 'bow', 'katana'], T(3))
    expect(classOf(umaOf(none, '101'), 'brawler')).toEqual({ weapons: ['greatsword', 'bow', 'katana'], lines: {}, loadout: null })
    // Swapping two of her slots keeps every skill.
    const swapped = holdWeapon(save, '101', 'brawler', 0, 'lance', null, T(2))
    expect(classOf(umaOf(swapped, '101'), 'brawler')).toMatchObject({ weapons: ['lance', 'axe', 'greatsword'], loadout: ['brawler-lance.4', 'brawler-axe.2'] })
    // Her preset dresses her in her defaults the same way.
    const off = setClassWeapons(save, '101', 'brawler', ['bow', 'axe', 'katana'], T(2))
    const dressed = wearClassPreset(equipSkills(off, BRAWLER, 'brawler', ['brawler-bow.4', 'brawler-axe.2'], T(3)), '101', 'brawler', T(4))
    expect(classOf(umaOf(dressed, '101'), 'brawler')).toMatchObject({ weapons: ['greatsword', 'axe', 'lance'], loadout: ['brawler-axe.2'] })
    roundTrip(dressed)
  })

  it('brings her lines into a fight: only her slotted trees on B, none when all are on A', () => {
    let save = pickBranch(party(), BRAWLER, 'brawler', 'greatsword', 'B', T(1))
    save = pickBranch(save, BRAWLER, 'brawler', 'bow', 'B', T(1))
    save = pickBranch(save, PARTY[1]!, 'spellblade', 'katana', 'B', T(1))
    const members = partyMembers(worldOf(save), PARTY.map((o) => o.outfitId), OUTFITS)
    expect(members[0]!.profile.lines).toEqual({ greatsword: 'B', bow: 'B' })
    const fought = startFight(save, ura, 'w1-1-1-s1', OUTFITS, T(2))
    const allies = worldOf(fought).world.run.battle!.input.allies
    expect(allies.map((a) => a.lines)).toEqual([{ greatsword: 'B' }, { katana: 'B' }, undefined, undefined, undefined])
    expect(allies[0]!.loadout.map((r) => r.id)).toContain('brawler-greatsword.4b')
    expect(allies[0]).toMatchObject({ tree: [], legacy: [], weapons: ['greatsword', 'axe', 'lance'] })
    roundTrip(fought)
  })
})
