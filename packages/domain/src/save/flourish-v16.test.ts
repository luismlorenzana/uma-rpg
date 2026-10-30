// The Flourish as her calling (H68, D204; uma-templates.md §3.3, §3.8, UT6, UT12, UT18), live since H72 (D210):
// `partyMembers` sends her template's Flourish only while she fights as her calling's class, and the world map's and the
// Rift's fights freeze it into their inputs. To v18 her calling's class is one class, by her stored calling pick (save v27,
// H69): kept for v18's fights with engine 18 explicit. From v19 (Classes v3, live since H134) her calling is her Tier 0 and
// the Flourish works as any class of its family (CV21). Invented outfits only.
import type { AptitudeGrade, Aptitudes } from '@luismlorenzana/uma-data'
import { describe, expect, it } from 'vitest'
import type { Points } from '../economy/bonus'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { createBattle } from '../rpg/battle/engine'
import { rpgCarriedMp, rpgPartyAllies } from '../rpg/campaign/run'
import { rpgClasses, type RpgTier0Class, type RpgTier1Class } from '../rpg/kinds'
import type { RpgClass, RpgProfile } from '../rpg/rules'
import { umaFlourishActive, umaTemplate } from '../roster/template'
import { regionChapter, worldContinent } from '../world/world'
import { chooseClass, partyMembers, startFight, startingClass, umaFlourish, type BattleOutfit } from './battle'
import { signUpRift, startRiftFight } from './rift'
import { OUTFITS as RIFT_OUTFITS, riftWorldSave, ROSTER, T as RT, TWENTY } from './rift-rules.fixture'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, type OwnedUma, type Save, type TierWorld } from './save'


const T0 = '2026-10-25T12:00:00.000Z'
type Grades<K extends string> = Partial<Record<K, AptitudeGrade>>
const outfit = (outfitId: string, style: Grades<keyof Aptitudes['strategy']>, distance: Grades<keyof Aptitudes['distance']>, power = 100,
  wit = 110): BattleOutfit => ({
  outfitId, baseStats: { speed: 100, stamina: 100, power, guts: 100, wit },
  growthRatePercents: { speed: 10, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'G', pace: 'G', late: 'G', end: 'G', ...style }, distance: { sprint: 'G', mile: 'G', medium: 'G', long: 'G', ...distance } },
})
// 201 a Pace Uma with Wit over Power (v18: calling Mage, her pick Mage or Spell Blade; v19: Spellblade), Medium A: a Middle
// stride, Even pace. 202 a front runner at Sprint (Brawler; Warrior. Dash: Clean break); 203 an End closer at Long
// (Summoner; Summoner. Stayer: Late reserve); 204 a front runner at Medium (Brawler; Warrior. Even pace); 205 a Late Uma with
// Power over Wit at Mile (Paladin; Healer. Clean break).
const OUTFITS = new Map([
  outfit('201', { pace: 'A' }, { medium: 'A' }), outfit('202', { front: 'A' }, { sprint: 'A' }), outfit('203', { end: 'A' }, { long: 'A' }),
  outfit('204', { front: 'A' }, { medium: 'A' }), outfit('205', { late: 'A' }, { mile: 'A' }, 110, 100),
].map((o) => [o.outfitId, o]))
const IDS = [...OUTFITS.keys()]
const o201 = OUTFITS.get('201')!

const cast = Array.from({ length: 7 }, (_, i) => ({ id: `cast${i}`, name: `Rival ${i}` }))
const region = regionChapter(worldContinent({ name: 'Test Circuit', order: 1 }).regions[0]!, cast)
const S1 = 'w1-1-1-s1'

/** The five unlocked in their starting classes in `engine`'s generation (v16–v18 their callings, v19 their Tier 0), in
 * party 0. */
function worldMap(engine: number = BATTLE_ENGINE_VERSION): Save {
  let save = newSave('Luis', T0)
  for (const o of OUTFITS.values()) save = unlockUma(save, o.outfitId, T0, '1', startingClass(o, engine))
  IDS.forEach((id, slot) => { save = setPartySlot(save, 0, slot, id, T0) })
  return save
}
/** Changes Tier 1's world in place of a rule (test setup only: v18's classes, a stored v18 pick, a promotion). */
const edit = (save: Save, change: (w: TierWorld) => void): Save => {
  const copy: Save = JSON.parse(JSON.stringify(save))
  change(copy.tierWorlds['1']!)
  return copy
}
const asClass = (save: Save, id: string, classId: RpgClass, calling?: OwnedUma['calling']): Save =>
  edit(save, (w) => { w.umas[id] = { ...w.umas[id]!, classId, ...(calling ? { calling } : {}) } })
const flourishes = (allies: readonly { id: string; flourish?: string }[]) => Object.fromEntries(allies.map((a) => [a.id, a.flourish ?? null]))

describe('the Flourish as her calling\'s class, v16–v18 (H68), engine 18 explicit', () => {
  it('reads v18\'s callings and strides', () => {
    expect(IDS.map((id) => umaTemplate(OUTFITS.get(id)!, undefined, 18)).map((t) => [t.calling, t.flourish])).toEqual([['mage', 'even-pace'],
      ['brawler', 'clean-break'], ['summoner', 'late-reserve'], ['brawler', 'even-pace'], ['paladin', 'clean-break']])
  })

  it('is hers only as her calling’s class, and her pick moves her calling', () => {
    const uma = worldOf(worldMap(18)).umas['201']!
    expect(uma.classId).toBe('mage')
    expect([umaFlourish(o201, uma, undefined, undefined, 18), umaFlourish(o201, uma, 'mage', null, 18), umaFlourish(o201, uma, 'brawler', null, 18)])
      .toEqual(['even-pace', 'even-pace', null])
    // Picked a Spell Blade: her Flourish works as a Spell Blade, no longer as a Mage.
    expect([umaFlourish(o201, uma, 'spellblade', 'spellblade', 18), umaFlourish(o201, uma, 'mage', 'spellblade', 18)]).toEqual(['even-pace', null])
    // Unnamed, the pick is her stored one.
    const picked = { ...uma, calling: { pick: 'spellblade' as const, confirmed: false } }
    expect([umaFlourish(o201, picked, 'spellblade', undefined, 18), umaFlourish(o201, picked, 'mage', undefined, 18)]).toEqual(['even-pace', null])
    // A pick outside her row's two is ignored.
    expect(umaFlourish(o201, uma, 'mage', 'cleric', 18)).toBe('even-pace')
  })

  it('partyMembers sends her Even pace as a Mage and nothing as a Brawler; nothing on v15', () => {
    const save = worldMap(18)
    const [mage] = partyMembers(worldOf(save), ['201'], OUTFITS, '1', 18)
    expect(mage).toMatchObject({ profile: { classId: 'mage' }, flourish: 'even-pace' })
    const [brawler] = partyMembers(worldOf(asClass(save, '201', 'brawler')), ['201'], OUTFITS, '1', 18)
    expect(brawler!.profile.classId).toBe('brawler')
    expect('flourish' in brawler!).toBe(false)
    expect(partyMembers(worldOf(save), IDS, OUTFITS, '1', 15).some((m) => 'flourish' in m)).toBe(false)
    // The input takes it from v16 only.
    const members = partyMembers(worldOf(save), IDS, OUTFITS, '1', 18)
    const mpOf = (engine: number) => (profile: RpgProfile, points?: Points) => rpgCarriedMp({ mp: {} }, profile, points, engine)
    expect(rpgPartyAllies(members, mpOf(16)).find((a) => a.id === '201')!.flourish).toBe('even-pace')
    expect(rpgPartyAllies(members, mpOf(15), 15).some((a) => 'flourish' in a)).toBe(false)
  })

  it('follows her stored pick: a Pace Uma who picked the Spell Blade has it as a Spell Blade, not as a Mage', () => {
    const save = asClass(worldMap(18), '201', 'spellblade', { pick: 'spellblade', confirmed: false })
    const [blade] = partyMembers(worldOf(save), ['201'], OUTFITS, '1', 18)
    expect(blade).toMatchObject({ profile: { classId: 'spellblade' }, flourish: 'even-pace' })
    const [mage] = partyMembers(worldOf(asClass(save, '201', 'mage')), ['201'], OUTFITS, '1', 18)
    expect(mage!.profile.classId).toBe('mage')
    expect('flourish' in mage!).toBe(false)
  })
})

describe('the Flourish as her Tier 0\'s family, live since H134 (CV21)', () => {
  it('reads her Tier 0 as her calling, with her stride\'s Flourish as before', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(20)
    expect(IDS.map((id) => umaTemplate(OUTFITS.get(id)!)).map((t) => [t.calling, t.flourish])).toEqual([['duelist', 'even-pace'],
      ['recruit', 'clean-break'], ['caller', 'late-reserve'], ['recruit', 'even-pace'], ['acolyte', 'clean-break']])
  })

  it('is always her template\'s Flourish under the gate, in either generation, for every outfit, class and pick', () => {
    const uma = worldOf(worldMap()).umas['201']!
    for (const engine of [18, 19]) {
      for (const o of [...OUTFITS.values(), RIFT_OUTFITS.get('101')!]) {
        for (const classId of rpgClasses(engine)) for (const pick of [null, ...rpgClasses(engine)]) {
          const template = umaTemplate(o, pick, engine)
          expect(umaFlourish(o, uma, classId, pick, engine)).toBe(umaFlourishActive(template, classId, engine) ? template.flourish : null)
        }
      }
    }
  })

  it('freezes each Uma’s Flourish into a world-map fight’s input, and Clean break opens it with her Barrier', () => {
    const started = startFight(worldMap(), region, S1, OUTFITS, T0)
    const input = worldOf(started).world.run.battle!.input
    expect(input.version).toBe(20)
    expect(input.allies.map((a) => a.classId)).toEqual(['duelist', 'recruit', 'caller', 'recruit', 'acolyte'])
    expect(flourishes(input.allies)).toEqual({ 201: 'even-pace', 202: 'clean-break', 203: 'late-reserve', 204: 'even-pace', 205: 'clean-break' })
    const opening = createBattle(input).cues.flatMap((c) => (c.kind === 'cover' ? [[c.targetId, c.label]] : []))
    expect(opening).toEqual([['202', 'Flourish'], ['205', 'Flourish']])
    // As a Warrior, another Tier 0's family, 201 fights without hers.
    const off = worldOf(startFight(chooseClass(worldMap(), '201', 'recruit', T0), region, S1, OUTFITS, T0)).world.run.battle!.input
    expect(flourishes(off.allies)['201']).toBeNull()
  })

  it('freezes it into a Rift fight’s input too, as any class of her family', () => {
    // The Rift fixture's Umas are front runners at Medium: Warrior callings, Even pace. Party 0 as a Brawler, a Sorcerer, an
    // Arms Spellblade, a Cleric and a Tome Summoner, each promoted: the Brawler and the Spellblade are the Warrior's children.
    const promoted: [string, RpgTier0Class, RpgTier1Class][] = [['101', 'recruit', 'brawler'], ['102', 'apprentice', 'mage'],
      ['103', 'recruit', 'spellblade'], ['104', 'acolyte', 'cleric'], ['105', 'caller', 'summoner']]
    const save = edit(signUpRift(riftWorldSave(), TWENTY, RT(1)), (w) => {
      for (const [id, from, to] of promoted) {
        w.umas[id] = { ...w.umas[id]!, classId: to, ranks: { ...w.umas[id]!.ranks, classes: { [from]: { rank: 10, exp: 0 }, [to]: { rank: 10, exp: 0 } } } }
      }
    })
    const started = startRiftFight(save, { kind: 'front', front: 'iron', stage: 1 }, 0, RIFT_OUTFITS, ROSTER, RT(2))
    const input = worldOf(started).rift.battle!.input
    expect(input.version).toBe(20)
    expect(flourishes(input.allies)).toEqual({ 101: 'even-pace', 102: null, 103: 'even-pace', 104: null, 105: null })
  })
})
