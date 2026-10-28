// The Flourish as her calling with the Tier rework's fight live (H68, D204; uma-templates.md §3.3, §3.8, UT6, UT12, UT18):
// live since H72 (D210; R1's packets mocked the switch to 16 here). `partyMembers` sends her template's Flourish only
// while she fights as her calling's class, by her stored calling pick (save v27, H69), and the world map's and the Rift's
// fights freeze it into their inputs. Invented outfits only.
import type { AptitudeGrade, Aptitudes } from '@luismlorenzana/uma-data'
import { describe, expect, it } from 'vitest'
import type { Points } from '../economy/bonus'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { createBattle } from '../rpg/battle/engine'
import { rpgCarriedMp, rpgPartyAllies } from '../rpg/campaign/run'
import { RPG_CLASSES, type RpgProfile } from '../rpg/rules'
import { umaFlourishActive, umaTemplate } from '../roster/template'
import { regionChapter, worldContinent } from '../world/world'
import { chooseClass, partyMembers, pickCalling, startFight, startingClass, umaFlourish, type BattleOutfit } from './battle'
import { signUpRift, startRiftFight } from './rift'
import { OUTFITS as RIFT_OUTFITS, riftWorldSave, ROSTER, T as RT, TWENTY } from './rift-rules.fixture'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, type Save } from './save'


const T0 = '2026-10-25T12:00:00.000Z'
type Grades<K extends string> = Partial<Record<K, AptitudeGrade>>
const outfit = (outfitId: string, style: Grades<keyof Aptitudes['strategy']>, distance: Grades<keyof Aptitudes['distance']>, power = 100,
  wit = 110): BattleOutfit => ({
  outfitId, baseStats: { speed: 100, stamina: 100, power, guts: 100, wit },
  growthRatePercents: { speed: 10, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'G', pace: 'G', late: 'G', end: 'G', ...style }, distance: { sprint: 'G', mile: 'G', medium: 'G', long: 'G', ...distance } },
})
// 201 a Pace Uma with Wit over Power (calling Mage, her pick Mage or Spell Blade), Medium A: a Middle stride, Even pace.
// 202 a front runner at Sprint (Brawler, Dash: Clean break); 203 an End closer at Long (Summoner, Stayer: Late reserve);
// 204 a front runner at Medium (Brawler, Even pace); 205 a Late Uma with Power over Wit at Mile (Paladin, Clean break).
const OUTFITS = new Map([
  outfit('201', { pace: 'A' }, { medium: 'A' }), outfit('202', { front: 'A' }, { sprint: 'A' }), outfit('203', { end: 'A' }, { long: 'A' }),
  outfit('204', { front: 'A' }, { medium: 'A' }), outfit('205', { late: 'A' }, { mile: 'A' }, 110, 100),
].map((o) => [o.outfitId, o]))
const IDS = [...OUTFITS.keys()]
const o201 = OUTFITS.get('201')!

const cast = Array.from({ length: 7 }, (_, i) => ({ id: `cast${i}`, name: `Rival ${i}` }))
const region = regionChapter(worldContinent({ name: 'Test Circuit', order: 1 }).regions[0]!, cast)
const S1 = 'w1-1-1-s1'

/** The five unlocked in their starting classes (from v16 their callings), in party 0. */
function worldMap(): Save {
  let save = newSave('Luis', T0)
  for (const o of OUTFITS.values()) save = unlockUma(save, o.outfitId, T0, '1', startingClass(o))
  IDS.forEach((id, slot) => { save = setPartySlot(save, 0, slot, id, T0) })
  return save
}
const flourishes = (allies: readonly { id: string; flourish?: string }[]) => Object.fromEntries(allies.map((a) => [a.id, a.flourish ?? null]))

describe('the Flourish as her calling, engine v16 (H68)', () => {
  it('runs with the Tier rework’s fight live (on engine 18 since H116)', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(18)
    expect(IDS.map((id) => umaTemplate(OUTFITS.get(id)!)).map((t) => [t.calling, t.flourish])).toEqual([['mage', 'even-pace'],
      ['brawler', 'clean-break'], ['summoner', 'late-reserve'], ['brawler', 'even-pace'], ['paladin', 'clean-break']])
  })

  it('is hers only as her calling’s class, and her pick moves her calling', () => {
    const uma = worldOf(worldMap()).umas['201']!
    expect(uma.classId).toBe('mage')
    expect([umaFlourish(o201, uma), umaFlourish(o201, uma, 'mage'), umaFlourish(o201, uma, 'brawler')]).toEqual(['even-pace', 'even-pace', null])
    // Picked a Spell Blade: her Flourish works as a Spell Blade, no longer as a Mage.
    expect([umaFlourish(o201, uma, 'spellblade', 'spellblade'), umaFlourish(o201, uma, 'mage', 'spellblade')]).toEqual(['even-pace', null])
    // Unnamed, the pick is her stored one.
    const picked = { ...uma, calling: { pick: 'spellblade' as const, confirmed: false } }
    expect([umaFlourish(o201, picked, 'spellblade'), umaFlourish(o201, picked, 'mage')]).toEqual(['even-pace', null])
    // A pick outside her row's two is ignored.
    expect(umaFlourish(o201, uma, 'mage', 'cleric')).toBe('even-pace')
    // Always her template's Flourish under UT12's gate, for every outfit, class and pick.
    for (const o of [...OUTFITS.values(), RIFT_OUTFITS.get('101')!]) {
      for (const classId of RPG_CLASSES) for (const pick of [null, ...RPG_CLASSES]) {
        const template = umaTemplate(o, pick)
        expect(umaFlourish(o, uma, classId, pick)).toBe(umaFlourishActive(template, classId) ? template.flourish : null)
      }
    }
  })

  it('partyMembers sends her Even pace as a Mage and nothing as a Brawler; nothing on v15', () => {
    const save = worldMap()
    const [mage] = partyMembers(worldOf(save), ['201'], OUTFITS)
    expect(mage).toMatchObject({ profile: { classId: 'mage' }, flourish: 'even-pace' })
    const [brawler] = partyMembers(worldOf(chooseClass(save, '201', 'brawler', T0)), ['201'], OUTFITS)
    expect(brawler!.profile.classId).toBe('brawler')
    expect('flourish' in brawler!).toBe(false)
    expect(partyMembers(worldOf(save), IDS, OUTFITS, '1', 15).some((m) => 'flourish' in m)).toBe(false)
    // The input takes it from v16 only.
    const members = partyMembers(worldOf(save), IDS, OUTFITS)
    const mpOf = (engine: number) => (profile: RpgProfile, points?: Points) => rpgCarriedMp({ mp: {} }, profile, points, engine)
    expect(rpgPartyAllies(members, mpOf(16)).find((a) => a.id === '201')!.flourish).toBe('even-pace')
    expect(rpgPartyAllies(members, mpOf(15), 15).some((a) => 'flourish' in a)).toBe(false)
  })

  it('follows her stored pick: a Pace Uma who picked the Spell Blade has it as a Spell Blade, not as a Mage', () => {
    // At Lv 1 the pick moves her class too (H69).
    const save = pickCalling(worldMap(), o201, 'spellblade', T0)
    expect(worldOf(save).umas['201']).toMatchObject({ classId: 'spellblade', calling: { pick: 'spellblade', confirmed: false } })
    const [blade] = partyMembers(worldOf(save), ['201'], OUTFITS)
    expect(blade).toMatchObject({ profile: { classId: 'spellblade' }, flourish: 'even-pace' })
    const [mage] = partyMembers(worldOf(chooseClass(save, '201', 'mage', T0)), ['201'], OUTFITS)
    expect(mage!.profile.classId).toBe('mage')
    expect('flourish' in mage!).toBe(false)
    // And in a world-map fight's input.
    const input = worldOf(startFight(save, region, S1, OUTFITS, T0)).world.run.battle!.input
    expect(input.allies.find((a) => a.id === '201')).toMatchObject({ classId: 'spellblade', flourish: 'even-pace' })
    const asMage = worldOf(startFight(chooseClass(save, '201', 'mage', T0), region, S1, OUTFITS, T0)).world.run.battle!.input
    expect(flourishes(asMage.allies)['201']).toBeNull()
  })

  it('freezes each Uma’s Flourish into a world-map fight’s input, and Clean break opens it with her Barrier', () => {
    const started = startFight(worldMap(), region, S1, OUTFITS, T0)
    const input = worldOf(started).world.run.battle!.input
    expect(input.version).toBe(18)
    expect(flourishes(input.allies)).toEqual({ 201: 'even-pace', 202: 'clean-break', 203: 'late-reserve', 204: 'even-pace', 205: 'clean-break' })
    const opening = createBattle(input).cues.flatMap((c) => (c.kind === 'cover' ? [[c.targetId, c.label]] : []))
    expect(opening).toEqual([['202', 'Flourish'], ['205', 'Flourish']])
    // As a Brawler, out of her calling, 201 fights without hers.
    const off = worldOf(startFight(chooseClass(worldMap(), '201', 'brawler', T0), region, S1, OUTFITS, T0)).world.run.battle!.input
    expect(flourishes(off.allies)['201']).toBeNull()
  })

  it('freezes it into a Rift fight’s input too', () => {
    // The Rift fixture's Umas are front runners at Medium: Brawler callings, Even pace. Party 0 is a Brawler, a Mage, a
    // Spell Blade, a Cleric and a Summoner: only the Brawler fights as her calling.
    const save = signUpRift(riftWorldSave(), TWENTY, RT(1))
    const started = startRiftFight(save, { kind: 'front', front: 'iron', stage: 1 }, 0, RIFT_OUTFITS, ROSTER, RT(2))
    const input = worldOf(started).rift.battle!.input
    expect(input.version).toBe(18)
    expect(flourishes(input.allies)).toEqual({ 101: 'even-pace', 102: null, 103: null, 104: null, 105: null })
  })
})
