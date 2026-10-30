import { describe, expect, it } from 'vitest'
import { regionChapter, worldContinent } from '../world/world'
import { applyBattleAction, battleActionsLeft } from '../rpg/battle/engine'
import type { BattleAction, BattleState } from '../rpg/battle/types'
import { rpgRunBattleStep } from '../rpg/campaign/run'
import {
  actInFight, activeClass, chooseClass, classOf, equipSkills, openFightOf, promoteUma, retreat, setActiveParty, setClassWeapons,
  settleFight, startFight, startingClass, umaLoadout, umaProfile, useSpring, worldRun, type BattleOutfit,
} from './battle'
import type { RpgTier0Class, RpgTier1Class } from '../rpg/kinds'
import { umaBattleSheet } from './sheet'
import { isInFight } from './status'
import { setPartySlot, SaveRuleError, unlockUma, worldOf } from './rules'
import { newOwnedUma, newSave, newWorldState, parseSave, SaveParseError, type OwnedUma, type Save, SAVE_SCHEMA_VERSION } from './save'

const T = (n: number) => `2026-10-10T12:${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}.000Z`
const cast = Array.from({ length: 7 }, (_, i) => ({ id: `cast${i}`, name: `Rival ${i}` }))
const ura = regionChapter(worldContinent({ name: 'Test Circuit', order: 1 }).regions[0]!, cast)

// Invented outfits only.
const outfit = (id: string, style: 'front' | 'pace' | 'late' | 'end'): BattleOutfit => ({
  outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
  growthRatePercents: { speed: 10, stamina: 10, power: 0, guts: 0, wit: 20 },
  aptitudes: { strategy: { front: style === 'front' ? 'A' : 'G', pace: style === 'pace' ? 'A' : 'G', late: style === 'late' ? 'A' : 'G', end: style === 'end' ? 'A' : 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } },
})
const OUTFITS = new Map([['101', outfit('101', 'front')], ['102', outfit('102', 'pace')], ['103', outfit('103', 'late')],
  ['104', outfit('104', 'end')], ['105', outfit('105', 'front')]])
const o101 = OUTFITS.get('101')!

/** Every Tier 0 at a Class Rank (D102: depths open at 1, 10, 20, 30, 40). From v19 (Classes v3) the five Tier 0 are the
 * classes she holds in Tier 1's world without a promotion; a Tier 1 class is hers from Rank 10 (`promoted`). */
function ranked(save: Save, rank = 1): Save {
  const w = worldOf(save)
  const t = { rank, exp: 0 }
  const classes = { recruit: t, duelist: t, acolyte: t, caller: t, apprentice: t }
  return { ...save, tierWorlds: { '1': { ...w, umas: Object.fromEntries(Object.entries(w.umas).map(([id, u]) => [id, { ...u, ranks: { ...u.ranks, classes } }])) } } }
}

function withParty(): Save {
  let save = newSave('Luis', T(0))
  for (const id of OUTFITS.keys()) save = unlockUma(save, id, T(1))
  ;[...OUTFITS.keys()].forEach((id, slot) => { save = setPartySlot(save, 0, slot, id, T(2)) })
  return ranked(save)
}

/** Uma `id` with `from` at Class Rank 10 promoted into `to` (CV8): she holds it and fights as it. */
function promoted(save: Save, id: string, from: RpgTier0Class, to: RpgTier1Class): Save {
  const w = worldOf(save), u = w.umas[id]!
  const ranks = { ...u.ranks, classes: { ...u.ranks.classes, [from]: { rank: 10, exp: 0 } } }
  return promoteUma({ ...save, tierWorlds: { '1': { ...w, umas: { ...w.umas, [id]: { ...u, ranks } } } } }, id, from, to, T(3))
}

/** Each living ally attacks the foe with the least shield until the fight ends. */
function autoplay(save: Save): { save: Save; result: ReturnType<typeof actInFight>['result'] } {
  let s = save
  for (let n = 0; n < 400; n += 1) {
    const run = openFightOf(worldOf(s))
    if (!run) throw new Error('no fight')
    const state: BattleState = rpgRunBattleStep(run)!.state
    const ally = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
    const foe = state.units.filter((u) => u.side === 'enemy' && u.hp > 0).sort((a, b) => a.shield - b.shield || a.hp - b.hp)[0]!
    const source = state.input.allies.find((a) => a.id === ally.id)!
    // A Spell Blade's act pairs an Arms Attack with a Tome Attack (D86), and from v15 a Summoner's too (D183).
    const first = source.weapons[0]!
    const action: BattleAction = source.classId === 'spellblade' || source.classId === 'summoner'
      ? { kind: 'attack', actorId: ally.id, targetId: foe.id, weapon: first, pair: { weapon: source.weapons.find((w) => w.startsWith('tome-') !== first.startsWith('tome-')) } }
      : { kind: 'attack', actorId: ally.id, targetId: foe.id }
    const acted = actInFight(s, ura, action, T(100 + n))
    s = acted.save
    if (acted.result) return { save: s, result: acted.result }
  }
  throw new Error('fight never ended')
}

describe('classes (D86)', () => {
  it('starts in her calling’s class, switches freely, and keeps each class’s weapons', () => {
    const save = withParty()
    const uma = worldOf(save).umas['102']!
    expect(activeClass(OUTFITS.get('102')!, uma)).toBe('duelist')
    expect(activeClass(OUTFITS.get('104')!, worldOf(save).umas['104']!)).toBe('caller')
    // Her starting class, the one her armor follows at unlock (D160 §7): from v19 her calling's Tier 0 in Tier 1's world
    // (Power = Wit here; Classes v3, CV10).
    expect((['front', 'pace', 'late', 'end'] as const).map((s) => startingClass(outfit('x', s)))).toEqual(['recruit', 'duelist', 'acolyte', 'caller'])
    // Free among the classes she holds: every Tier 0 here (a closed Tier 1 class is `classes-v19.test.ts`'s).
    const switched = chooseClass(save, '102', 'acolyte', T(3))
    expect(activeClass(OUTFITS.get('102')!, worldOf(switched).umas['102']!)).toBe('acolyte')
    const profile = umaProfile(o101, worldOf(save).umas['101']!, 1)
    expect(profile).toMatchObject({ classId: 'recruit', weapons: ['greatsword', 'axe', 'lance'], level: 1, tree: [], lines: {} })
    expect(profile.growthRates).toEqual({ speed: 0.1, stamina: 0.1, power: 0, guts: 0, wit: 0.2 })
    // From v16 every class picks three, each in a slot of its channel (CP2, CP12): a Cleric and a Summoner two Tomes and an
    // Arm, a Paladin two Arms and a Tome, a Brawler three Arms.
    const picked = setClassWeapons(save, '101', 'cleric', ['tome-dark', 'tome-ice', 'katana'], T(4))
    expect(classOf(worldOf(picked).umas['101']!, 'cleric').weapons).toEqual(['tome-dark', 'tome-ice', 'katana'])
    expect(classOf(worldOf(setClassWeapons(save, '101', 'brawler', ['katana', 'bow', 'axe'], T(4))).umas['101']!, 'brawler').weapons).toEqual(['katana', 'bow', 'axe'])
    expect(() => setClassWeapons(save, '101', 'cleric', ['katana', 'bow', 'tome-dark'], T(4))).toThrow(/slots/)
    expect(() => setClassWeapons(save, '101', 'paladin', ['tome-dark', 'tome-ice', 'katana'], T(4))).toThrow(/slots/)
    expect(() => setClassWeapons(save, '101', 'summoner', ['katana', 'tome-ice', 'tome-dark'], T(4))).toThrow(/slots/)
    expect(() => setClassWeapons(save, '101', 'brawler', ['katana', 'bow', 'tome-dark'], T(4))).toThrow(/slots/)
    expect(() => setClassWeapons(save, '101', 'brawler', ['greatsword', 'axe', 'lance', 'bow', 'katana'], T(4))).toThrow(/slots/)
  })

  it('knows every open depth’s core skills for free and chooses her skills until she picks; Class Rank opens depths (D102)', () => {
    const save = withParty()
    const uma = worldOf(save).umas['101']!
    expect(umaLoadout(o101, uma, 1).map((r) => r.id)).toEqual(['recruit-greatsword.1', 'recruit-axe.1', 'recruit-lance.1'])
    // From v19 a Tier 0 holds depth 1 at any Class Rank (CV6); a Tier 1 class opens at Rank 10, on depth 2.
    expect(umaLoadout(o101, worldOf(ranked(save, 10)).umas['101']!, 1).map((r) => r.id)[0]).toBe('recruit-greatsword.1')
    const brawler = worldOf(promoted(save, '101', 'recruit', 'brawler')).umas['101']!
    expect(umaLoadout(o101, brawler, 1).map((r) => r.id).slice(0, 2)).toEqual(['brawler-greatsword.2', 'brawler-axe.2'])
    // Class Rank 20 opens depth 3, whatever her level; Lv 20 alone doesn't.
    const first = (u: OwnedUma) => umaLoadout(o101, u, 1).map((r) => r.id)[0]
    expect(first({ ...brawler, level: 20 })).toBe('brawler-greatsword.2')
    expect(first({ ...brawler, ranks: { ...brawler.ranks, classes: { ...brawler.ranks.classes, brawler: { rank: 20, exp: 0 } } } })).toBe('brawler-greatsword.3')
    // Nothing is learned from v16 (CP14): her line on each tree is `lines-v16.test.ts`'s.
  })

  it('equips skills she knows within her slots, or goes back to having them chosen', () => {
    let save = withParty()
    save = equipSkills(save, o101, 'recruit', ['recruit-lance.1'], T(4))
    expect(classOf(worldOf(save).umas['101']!, 'recruit').loadout).toEqual(['recruit-lance.1'])
    expect(umaLoadout(o101, worldOf(save).umas['101']!, 1).map((r) => r.id)).toEqual(['recruit-lance.1'])
    expect(() => equipSkills(save, o101, 'recruit', ['recruit-lance.2'], T(5))).toThrow(/knows/)
    // A tree she doesn't slot isn't hers to equip.
    expect(() => equipSkills(save, o101, 'recruit', ['recruit-katana.1'], T(5))).toThrow(/knows/)
    // A fourth equipped skill needs Lv 10 (her Uma Level keeps the slots).
    expect(() => equipSkills(ranked(save, 10), o101, 'recruit', ['recruit-greatsword.1', 'recruit-axe.1', 'recruit-lance.1', 'recruit-greatsword.2'], T(5)))
      .toThrow(/up to 3/)
    expect(() => equipSkills(save, o101, 'recruit', ['recruit-axe.1', 'recruit-axe.1'], T(5))).toThrow(SaveRuleError)
    save = equipSkills(save, o101, 'recruit', null, T(6))
    expect(classOf(worldOf(save).umas['101']!, 'recruit').loadout).toBeNull()
  })
})

const S1 = 'w1-1-1-s1'

describe('fights (D52, D66)', () => {
  it('needs a full party, one fight at a time, and freezes the line-up until it ends', () => {
    const short = setPartySlot(withParty(), 0, 4, null, T(3))
    expect(() => startFight(short, ura, 'w1-1-1-s1', OUTFITS, T(4))).toThrow(/five/)
    const save = startFight(withParty(), ura, 'w1-1-1-s1', OUTFITS, T(4))
    expect(() => startFight(save, ura, 'w1-1-1-s2', OUTFITS, T(5))).toThrow(/already/)
    expect(isInFight(worldOf(save), '101')).toBe(true)
    expect(() => setPartySlot(save, 0, 0, null, T(5))).toThrow(/fight/)
    expect(() => setPartySlot(save, 1, 0, '101', T(5))).toThrow(/fight/)
    expect(() => setActiveParty(save, 1, T(5))).toThrow(/open fight/)
    expect(worldRun(worldOf(retreat(save, T(6)))).battle).toBeNull()
  })

  it('pays a win: EXP to all five, their Class bar (R2 retired the gear bars), Laurels (triple on a first clear, a quarter on a replay), and an Uma Shard at Lv10', () => {
    const fought = autoplay(startFight(withParty(), ura, S1, OUTFITS, T(4)))
    expect(fought.result).toMatchObject({ outcome: 'victory', nodeId: S1, laurels: 30, shards: 0, firstClear: true })
    expect(fought.result!.members).toHaveLength(5)
    const world = worldOf(fought.save)
    expect(world.wallet.laurels).toBe(30)
    expect(world.umas['101']!.exp).toBe(fought.result!.members[0]!.afterExp)
    expect(worldRun(world).wins).toMatchObject({ start: 1, [S1]: 1 })
    const again = autoplay(startFight(fought.save, ura, S1, OUTFITS, T(300)))
    // A replay pays a quarter of the first clear (D79): 30 Laurels become 8, and a quarter of the EXP at most.
    expect(again.result).toMatchObject({ laurels: 8, firstClear: false })
    expect(again.result!.members[0]!.exp).toBeLessThanOrEqual(Math.ceil(fought.result!.members[0]!.exp / 4))
    // Her Class bar (D102): 2E. R2 retired the Weapon, Armor and Accessory bars (WP3, H74; live since H82): a win pays none.
    const m = fought.result!.members[0]!
    const gain = (kind: string, id: string) => m.ranks.find((g) => g.ref.kind === kind && g.ref.id === id)?.exp ?? 0
    expect(gain('class', 'recruit')).toBe(2 * m.exp)
    expect(m.ranks.every((g) => g.ref.kind === 'class')).toBe(true)
    expect(world.umas['101']!.ranks.classes.recruit).toEqual(m.ranks[0]!.after)
    expect(world.items).toEqual({})

    // Lv9 Umas one fight short of Lv10: each earns an Uma Shard, and five Uma Shards make a Ticket.
    let ready = withParty()
    const w = worldOf(ready)
    const umas = Object.fromEntries(Object.entries(w.umas).map(([id, u]) => [id, { ...u, level: 9, exp: 270 }]))
    ready = { ...ready, tierWorlds: { '1': { ...w, umas } } }
    const before = worldOf(ready).wallet.unlockTickets
    const leveled = autoplay(startFight(ready, ura, 'w1-1-1-s1', OUTFITS, T(4)))
    expect(leveled.result!.members.every((m) => m.afterLevel === 10 && m.shards === 1)).toBe(true)
    expect(leveled.result).toMatchObject({ shards: 5, tickets: 1 })
    expect(worldOf(leveled.save).wallet).toMatchObject({ unlockTickets: before + 1, shards: 0 })
  }, 30_000)

  it('settles a loss with nothing paid and the run as it was', () => {
    const save = startFight(withParty(), ura, S1, OUTFITS, T(4))
    const run = openFightOf(worldOf(save))!
    const lost = { ...rpgRunBattleStep(run)!.state, outcome: 'loss' as const }
    const settled = settleFight(save, ura, run, lost, T(5))
    expect(settled.result).toMatchObject({ outcome: 'loss', laurels: 0, members: [] })
    expect(worldRun(worldOf(settled.save)).wins).toEqual({ start: 1 })
  })

  it('opens stages in order, carries MP per Uma, and refills the active party at a Spring every two hours', () => {
    expect(() => startFight(withParty(), ura, 'w1-1-1-s2', OUTFITS, T(4))).toThrow(/Clear the stage before it/)
    const won = autoplay(startFight(withParty(), ura, S1, OUTFITS, T(4))).save
    const w = worldOf(won)
    const tired = { ...won, tierWorlds: { '1': { ...w, world: { ...w.world, run: { ...w.world.run, mp: { '101': 1, '102': 2 } } } } } }
    const rested = useSpring(tired, 'w1-spring1', T(400))
    expect(worldRun(worldOf(rested)).mp).toEqual({})
    expect(() => useSpring(rested, 'w1-spring1', T(500))).toThrow(/recharging/)
    expect(() => useSpring(rested, 'w1-spring2', T(500))).not.toThrow()
    expect(worldOf(setActiveParty(rested, 3, T(500))).world.activeParty).toBe(3)
  })
})

describe('save parsing', () => {
  it('round-trips classes and an open fight with actions', () => {
    let save = equipSkills(withParty(), o101, 'recruit', ['recruit-lance.1', 'recruit-axe.1'], T(3))
    save = startFight(save, ura, 'w1-1-1-s1', OUTFITS, T(4))
    const action: BattleAction = { kind: 'attack', actorId: '101', targetId: 'foe1' }
    save = actInFight(save, ura, action, T(5)).save
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    expect(applyBattleAction(rpgRunBattleStep(openFightOf(worldOf(save))!)!.state, action).error).toBe('already-acted')
    // A Spell Blade's act carries its other half (D86): the save must keep it. From v19 she is one once promoted (CV8).
    let bladed = startFight(promoted(withParty(), '102', 'recruit', 'spellblade'), ura, 'w1-1-1-s1', OUTFITS, T(4))
    const blade = rpgRunBattleStep(openFightOf(worldOf(bladed))!)!.state.input.allies.find((a) => a.id === '102')!
    const pair: BattleAction = { kind: 'attack', actorId: blade.id, targetId: 'foe1', weapon: blade.weapons.find((w) => !w.startsWith('tome-')),
      pair: { weapon: blade.weapons.find((w) => w.startsWith('tome-')) } }
    bladed = actInFight(bladed, ura, pair, T(6)).save
    expect(parseSave(JSON.parse(JSON.stringify(bladed)))).toEqual(bladed)
  })

  it('rejects a line other than B, a skill of another class, wrong weapons, a refused action and an unknown Spring', () => {
    // A promoted Brawler: a Tier 0 has no lines and slots any kind (CV6).
    const brawler = equipSkills(promoted(withParty(), '101', 'recruit', 'brawler'), o101, 'brawler', ['brawler-lance.1'], T(3))
    const save = startFight(brawler, ura, 'w1-1-1-s1', OUTFITS, T(4))
    const raw = () => JSON.parse(JSON.stringify(save))
    const line = raw()
    line.tierWorlds['1'].umas['101'].classes.brawler.lines = { greatsword: 'A' }
    expect(() => parseSave(line)).toThrow(/lines/)
    const equip = raw()
    equip.tierWorlds['1'].umas['101'].classes.brawler.loadout = ['mage-tome-fire.1']
    expect(() => parseSave(equip)).toThrow(/trees/)
    const weapons = raw()
    weapons.tierWorlds['1'].umas['101'].classes.brawler.weapons = ['greatsword', 'axe', 'tome-fire']
    expect(() => parseSave(weapons)).toThrow(/weapons/)
    const refused = raw()
    refused.tierWorlds['1'].world.run.battle.actions = [{ kind: 'attack', actorId: '101', targetId: 'foe1' }, { kind: 'attack', actorId: '101', targetId: 'foe1' }]
    expect(() => parseSave(refused)).toThrow(/refused/)
    const spring = raw()
    spring.tierWorlds['1'].world.springs = { somewhere: T(1) }
    expect(() => parseSave(spring)).toThrow(SaveParseError)
  })

  it('moves a v13 save to classes: the build’s class carries over, skills reset, an open fight closes (D86)', () => {
    const save = startFight(withParty(), ura, 'w1-1-1-s1', OUTFITS, T(4))
    const old = JSON.parse(JSON.stringify(save))
    old.schemaVersion = 13
    for (const uma of Object.values(old.tierWorlds['1'].umas) as Record<string, unknown>[]) {
      delete uma.classId
      delete uma.classes
      uma.build = null
      uma.builds = { 'axe-bow': { tree: ['axe.ice.1'], loadout: ['axe.ice.1'], familiar: 'greatsword' } }
      // Before v21 an Uma had professions, not a Craft Level (D144).
      uma.professions = { gathering: uma.craft }
      delete uma.craft
    }
    old.tierWorlds['1'].umas['102'].build = 'axe-bow'
    old.tierWorlds['1'].world.run.battle.input.version = 5
    const moved = parseSave(old)
    expect(moved.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    // The build's class reaches v31 and v32's reset records it (D247): every Uma then starts again on her Tier 0.
    expect(worldOf(moved).classesV3!.umas['102']!.classId).toBe('brawler')
    expect(worldOf(moved).classesV3!.umas['101']!.classId).toBeNull()
    expect(worldOf(moved).umas['102']).toMatchObject({ classId: null, classes: {} })
    expect(worldRun(worldOf(moved)).battle).toBeNull()
    expect(parseSave(JSON.parse(JSON.stringify(moved)))).toEqual(moved)
  })

  it('starts a v2 save over: no build chosen, nothing learned, a fresh world', () => {
    const v2 = { schemaVersion: 2, account: { trainerName: 'Luis', createdAt: T(0), updatedAt: T(0) },
      tierWorlds: { '1': { createdAt: T(0), wallet: { unlockTickets: 19, shards: 0, laurels: 0 }, umas: { '101': { unlockedAt: T(1), level: 1, exp: 0 } },
        parties: Array.from({ length: 20 }, (_, i) => ({ name: `Party ${i + 1}`, slots: [null, null, null, null, null] })) } } }
    const migrated = parseSave(v2)
    expect(migrated.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    expect(migrated.tierWorlds['1']!.umas['101']).toEqual(newOwnedUma(T(1)))
    expect(migrated.tierWorlds['1']!.world).toEqual(newWorldState(T(0)))
  })
})

describe('her battle sheet (combat-balance.md §6.0)', () => {
  it('lists every battle stat in four groups, 0 included, with gear and Extra Stats apart for the core six (engine v16’s sheet, to H82)', () => {
    const save = withParty()
    // Her v1 gear, map and ranks, as engine v16's sheet reads them; the live sheet since H82 is `sheet-v3.test.ts`'s.
    const live = worldOf(save).umas['101']!
    const old = newOwnedUma(live.unlockedAt, 'brawler', 16)
    const uma = { ...live, gear: old.gear, stars: old.stars, ranks: { ...old.ranks, classes: live.ranks.classes } }
    const sheet = umaBattleSheet(o101, uma, 'brawler', 1, 16)
    expect(sheet.map((g) => g.title)).toEqual(['Offense', 'Defense', 'Sustain', 'Other'])
    const labels = sheet.flatMap((g) => g.rows.map((r) => r.label))
    for (const label of ['ATK', 'M.ATK', 'Might', 'Orb', 'DEF', 'M.DEF', 'Evasion', 'Physical damage cut', 'Magical damage cut',
      'Bulwark (physical) at the start', 'Veil (magical) at the start', 'Thorns', 'Mirror', 'HP', 'HP Regen', 'Lifesteal', 'MP', 'MP Steal',
      '★ Flourish', 'Limit start']) expect(labels).toContain(label)
    // From v16 (H70) the MP row carries her regen; "MP Regen" retired with v15's sheet.
    expect(labels).not.toContain('MP Regen')
    // Classes v2: one flat Orb, and no Heal (a healer's Mends come from her ATK or M.ATK, `accessories-v2.test.ts`).
    expect(labels).not.toContain('Orbs')
    expect(labels).not.toContain('Heal')
    const row = (label: string) => sheet.flatMap((g) => g.rows).find((r) => r.label === label)!
    expect(row('HP Regen').value).toBe('0 a round')
    expect(row('Might').value).toBe('None')
    // Might is a flat number on its weapon's hits (D142), and armor adds its offense from grade 1 (D143).
    const geared = { ...uma, gear: { ...uma.gear, equipped: { greatsword: 'greatsword-g1', head: 'helm-g1' } } }
    const gearedRow = (label: string) => umaBattleSheet(o101, geared, 'brawler', 1, 16).flatMap((g) => g.rows).find((r) => r.label === label)!
    expect(gearedRow('Might').value).toBe('Greatsword +1')
    expect(gearedRow('ATK').gear).toBe(1)
    expect(gearedRow('DEF').gear).toBe(2)
    expect(Number(row('ATK').value)).toBeGreaterThan(0)
  })

  it('reads her tier: the same Uma Level projects higher stats in Tier 2 (lifetime level, H35)', () => {
    const uma = worldOf(withParty()).umas['101']!
    const value = (tier: number, label: string) => Number(umaBattleSheet(o101, uma, 'brawler', tier).flatMap((g) => g.rows).find((r) => r.label === label)!.value)
    for (const label of ['ATK', 'M.ATK', 'DEF', 'M.DEF', 'HP', 'MP']) expect(value(2, label), label).toBeGreaterThan(value(1, label))
    expect(umaBattleSheet(o101, uma, 'brawler')).toEqual(umaBattleSheet(o101, uma, 'brawler', 1))
  })
})
