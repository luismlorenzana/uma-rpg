// The Rift page's pure helpers (H50): fight labels, which world parties can take a fight, the Convergence's coverage, the
// Ascend sheet's numbers, the result screen's lines and the finale's faces (H52). Lazy, with the page.
import {
  activeClass, BATTLE_ENGINE_VERSION, CONVERGENCE_FIGHTS, FRONT_NAME, healerBlock, PARTY_SIZE, RIFT_FRONTS, RIFT_STAGES, RPG_TIER_MAX_LEVEL, rpgRework,
  umaClassTree, umaHeldClasses,
  type BattleEnemy, type BattleOutfit, type EnemyTier, type RiftFightRef, type RiftFront, type RiftRun, type RosterMember, type RpgClass, type RpgWeapon,
  type TierWorld,
} from '@rpg/domain'
import {
  ASCEND_PURSE, bankedMarks, RIFT_FRONT_SPECS, riftConvergence, riftFight, riftGuidedBuild, riftParty, type RiftContext, type RiftFightPlan, type RiftFightResult,
} from '@rpg/domain/rift'
import { CLASS_LABEL } from '../../battle/labels'

/** A fight's name on its screen: "Stage 5", "Champion", "Fight 2 of 4", "Lv 55". */
export function riftRefLabel(ref: RiftFightRef): string {
  switch (ref.kind) {
    case 'front': return ref.stage === RIFT_STAGES ? 'Champion' : `Stage ${ref.stage}`
    case 'convergence': return `Fight ${ref.fight + 1} of ${CONVERGENCE_FIGHTS}`
    case 'echo': return `Lv ${ref.level}`
  }
}

/** A fight's small line: "Iron front", "Convergence", "Echo · Iron". */
export function riftRefTitle(ref: RiftFightRef): string {
  switch (ref.kind) {
    case 'front': return `${FRONT_NAME[ref.front]} front`
    case 'convergence': return 'Convergence'
    case 'echo': return `Echo · ${FRONT_NAME[ref.front]}`
  }
}

/** Where a fight's screen returns: its front's chain, the Convergence, or the Rift. */
export function riftHome(ref: RiftFightRef): string {
  return ref.kind === 'front' ? `front/${ref.front}` : ref.kind === 'convergence' ? 'convergence' : ''
}

/** A front's party guidance (D168): "2 Brawler · 2 Spell Blade · Cleric". */
export function partyGuidance(front: RiftFront): string {
  const counts = new Map<RpgClass, number>()
  for (const c of RIFT_FRONT_SPECS[front].party) counts.set(c, (counts.get(c) ?? 0) + 1)
  return [...counts].map(([c, n]) => (n > 1 ? `${n} ${CLASS_LABEL[c]}` : CLASS_LABEL[c])).join(' · ')
}

/** A world party's five, or null while a slot is empty. */
export function fullParty(world: Pick<TierWorld, 'parties'>, index: number): string[] | null {
  const slots = world.parties[index]?.slots
  return slots && slots.length === PARTY_SIZE && slots.every((s) => s !== null) ? (slots as string[]) : null
}

const atTop = (world: Pick<TierWorld, 'umas'>, id: string): boolean => (world.umas[id]?.level ?? 0) >= RPG_TIER_MAX_LEVEL

/** Why world party `index` can't take this run's front fights, or null: five, every one on the roster. */
export function frontPartyBlock(world: Pick<TierWorld, 'parties'>, run: Pick<RiftRun, 'roster'>, index: number): string | null {
  const five = fullParty(world, index)
  if (!five) return 'Needs five'
  return five.every((id) => run.roster.includes(id)) ? null : 'Not all on the roster'
}

/** Why world party `index` can't fight an Echo or sign up, or null: five Lv 50 Umas. */
export function levelPartyBlock(world: Pick<TierWorld, 'parties' | 'umas'>, index: number): string | null {
  const five = fullParty(world, index)
  if (!five) return 'Needs five'
  return five.every((id) => atTop(world, id)) ? null : 'Needs five Lv 50 Umas'
}

/** How many of a party's classes the front's guidance asks for (0–5): a multiset match, in an engine's generation. */
export function guidanceMatch(classes: readonly RpgClass[], front: RiftFront, engine: number = BATTLE_ENGINE_VERSION): number {
  const want = [...riftParty(front, engine)]
  let n = 0
  for (const c of classes) {
    const at = want.indexOf(c)
    if (at >= 0) { want.splice(at, 1); n += 1 }
  }
  return n
}

/** Each member's active class, in an engine's generation. */
export function partyClassesOf(world: Pick<TierWorld, 'umas'>, members: readonly string[], outfits: ReadonlyMap<string, BattleOutfit>, tier = 1,
  engine: number = BATTLE_ENGINE_VERSION): RpgClass[] {
  return members.flatMap((id) => {
    const uma = world.umas[id], outfit = outfits.get(id)
    return uma && outfit ? [activeClass(outfit, uma, tier, engine)] : []
  })
}

/** A front's guided weapons for a party (CP7, H70): each member matched to the front's guided build by her class, in party
 * order (a party's first Brawler takes the build's first Brawler), with that build member's three weapons; null for a
 * member the build has no place for. */
export function guidedWeapons(classes: readonly (RpgClass | null)[], front: RiftFront, engine: number = BATTLE_ENGINE_VERSION):
  (readonly RpgWeapon[] | null)[] {
  const build = riftGuidedBuild(front, engine)
  const taken = new Set<number>()
  return classes.map((classId) => {
    const at = build.findIndex((m, i) => !taken.has(i) && m.classId === classId)
    if (at < 0) return null
    taken.add(at)
    return build[at]!.weapons
  })
}

// --- Classes v3: the guidance by held classes (CV §10.1; H134) ----------------------------------------------------------

/** Each member's classes as the guidance reads them, her active class first: before v19 that one alone; from v19 every
 * class she holds (`umaHeldClasses`), since the guided weapons' one tap switches her (CV §10.1). A member without her
 * outfit or Uma reads none. */
export function partyHeldOf(world: Pick<TierWorld, 'umas'>, members: readonly string[], outfits: ReadonlyMap<string, BattleOutfit>, tier = 1,
  engine: number = BATTLE_ENGINE_VERSION): RpgClass[][] {
  return members.map((id) => {
    const uma = world.umas[id], outfit = outfits.get(id)
    if (!uma || !outfit) return []
    const active = activeClass(outfit, uma, tier, engine)
    if (!rpgRework('classes', engine)) return [active]
    return [active, ...umaHeldClasses(uma, tier, engine).filter((c) => c !== active)]
  })
}

/** Which member fills each of the front's guided build slots (CP7, CV §10.1), in the build's slot order, or null: each
 * member fills one slot of a class she holds (`held[i]`, her active class first), a maximum matching that seats a member
 * on her active class where it can. Before v19 `held` is her active class alone, so this is `guidedWeapons`' pairing. */
export function guidanceFit(held: readonly (readonly RpgClass[])[], front: RiftFront, engine: number = BATTLE_ENGINE_VERSION): (number | null)[] {
  const build = riftGuidedBuild(front, engine)
  const slotOf: (number | null)[] = held.map(() => null)
  const memberOf: (number | null)[] = build.map(() => null)
  // Her active class first, in party order (as v16's pairing did).
  held.forEach((classes, i) => {
    const at = build.findIndex((m, s) => memberOf[s] === null && m.classId === classes[0])
    if (at >= 0) { memberOf[at] = i; slotOf[i] = at }
  })
  // Then augmenting paths (Kuhn's) over every class she holds, so a member who holds two guided classes frees the one
  // another member needs.
  const tryMember = (i: number, seen: Set<number>): boolean => {
    for (let s = 0; s < build.length; s += 1) {
      if (seen.has(s) || !held[i]!.includes(build[s]!.classId)) continue
      seen.add(s)
      const other = memberOf[s]
      if (other === null || other === undefined || tryMember(other, seen)) {
        if (slotOf[i] !== null) memberOf[slotOf[i]!] = null
        memberOf[s] = i; slotOf[i] = s
        return true
      }
    }
    return false
  }
  held.forEach((_, i) => { if (slotOf[i] === null) tryMember(i, new Set()) })
  return memberOf
}

/** One guided class the party leaves empty (CV §10.1): "Needs an Arms Summoner", with up to three roster Umas who could
 * fill it, those who can promote into it now first (`ready`, a `'ready'` tile in `umaClassTree`), then those who hold it. */
export interface GuidanceNeed { classId: RpgClass; count: number; umas: { outfitId: string; ready: boolean }[] }
/** "Needs an Arms Summoner", "Needs 2 Brawlers". */
export function needLine(need: Pick<GuidanceNeed, 'classId' | 'count'>, label: (classId: RpgClass) => string): string {
  const name = label(need.classId)
  return need.count > 1 ? `Needs ${need.count} ${name}s` : `Needs ${/^[AEIOU]/.test(name) ? 'an' : 'a'} ${name}`
}
/** The guided classes a party leaves empty, in the build's order (from v19; before it none), each with up to three Umas of
 * `roster` outside the party's fit who could fill it: Ready to promote first, then those who hold it, in roster order. */
export function guidanceNeeds(world: Pick<TierWorld, 'umas'>, members: readonly string[], front: RiftFront, roster: readonly string[],
  outfits: ReadonlyMap<string, BattleOutfit>, tier = 1, engine: number = BATTLE_ENGINE_VERSION): GuidanceNeed[] {
  if (!rpgRework('classes', engine)) return []
  const fit = guidanceFit(partyHeldOf(world, members, outfits, tier, engine), front, engine)
  const build = riftGuidedBuild(front, engine)
  const seated = new Set(fit.flatMap((m) => (m === null ? [] : [members[m]!])))
  const needs: GuidanceNeed[] = []
  build.forEach((slot, s) => {
    if (fit[s] !== null) return
    const had = needs.find((n) => n.classId === slot.classId)
    if (had) { had.count += 1; return }
    const ready: string[] = [], holds: string[] = []
    for (const id of roster) {
      const uma = world.umas[id], outfit = outfits.get(id)
      if (!uma || !outfit || seated.has(id)) continue
      const tile = umaClassTree(uma, outfit, tier, engine).find((t) => t.classId === slot.classId)
      if (tile?.state === 'ready') ready.push(id)
      else if (umaHeldClasses(uma, tier, engine).includes(slot.classId)) holds.push(id)
    }
    needs.push({ classId: slot.classId, count: 1,
      umas: [...ready.map((outfitId) => ({ outfitId, ready: true })), ...holds.map((outfitId) => ({ outfitId, ready: false }))].slice(0, 3) })
  })
  return needs
}

/** Each member's guided class and weapons for the one tap (CP7; from v19 by held class, CV §10.1), or null: `switch` when
 * the guided class isn't the one she fights as now, so the tap also switches her. */
export function guidedPlan(held: readonly (readonly RpgClass[])[], front: RiftFront, engine: number = BATTLE_ENGINE_VERSION):
  ({ classId: RpgClass; weapons: readonly RpgWeapon[]; switch: boolean } | null)[] {
  const build = riftGuidedBuild(front, engine)
  const fit = guidanceFit(held, front, engine)
  return held.map((classes, i) => {
    const s = fit.indexOf(i)
    if (s < 0) return null
    const { classId, weapons } = build[s]!
    return { classId, weapons, switch: classId !== classes[0] }
  })
}

/** How well a party fits a front's guidance (0–5): before v19 its active classes' multiset match, from v19 the held
 * classes' (CV §10.1), so a rebuilt roster isn't 0 of 5. */
export function partyFit(world: Pick<TierWorld, 'umas'>, members: readonly string[], front: RiftFront, outfits: ReadonlyMap<string, BattleOutfit>,
  tier = 1, engine: number = BATTLE_ENGINE_VERSION): number {
  if (!rpgRework('classes', engine)) return guidanceMatch(partyClassesOf(world, members, outfits, tier, engine), front, engine)
  return guidanceFit(partyHeldOf(world, members, outfits, tier, engine), front, engine).filter((m) => m !== null).length
}

/** The open party that best fits a front's guidance (ties to the lower index), or null when none can fight. From classes
 * v2 it never proposes a party with two healers (`healerBlock`, H59); `engine` defaults to the live generation; from v19
 * the fit counts held classes (`partyFit`). */
export function bestParty(world: Pick<TierWorld, 'parties' | 'umas'>, front: RiftFront, outfits: ReadonlyMap<string, BattleOutfit>,
  block: (index: number) => string | null, taken: ReadonlySet<number> = new Set(), engine?: number, tier = 1): number | null {
  let best: number | null = null, score = -1
  for (let i = 0; i < world.parties.length; i += 1) {
    if (taken.has(i) || block(i) !== null || healerBlock(world, fullParty(world, i) ?? [], outfits, engine, tier) !== null) continue
    const s = partyFit(world, fullParty(world, i)!, front, outfits, tier, engine ?? BATTLE_ENGINE_VERSION)
    if (s > score) { best = i; score = s }
  }
  return best
}

/** The Convergence's opening assignment: for each front in order, the best-fitting party of the roster not yet taken (from
 * classes v2, none with two healers). */
export function suggestConvergence(world: Pick<TierWorld, 'parties' | 'umas'>, run: Pick<RiftRun, 'roster'>, outfits: ReadonlyMap<string, BattleOutfit>,
  engine?: number, tier = 1): (number | null)[] {
  const taken = new Set<number>()
  return RIFT_FRONTS.map((front) => {
    const pick = bestParty(world, front, outfits, (i) => frontPartyBlock(world, run, i), taken, engine, tier)
    if (pick !== null) taken.add(pick)
    return pick
  })
}

/** The run's Umas these parties leave out, in roster order. */
export function convergenceMissing(world: Pick<TierWorld, 'parties'>, run: Pick<RiftRun, 'roster'>, parties: readonly (number | null)[]): string[] {
  const in4 = new Set(parties.flatMap((p) => (p === null ? [] : (world.parties[p]?.slots ?? []).filter((s): s is string => s !== null))))
  return run.roster.filter((id) => !in4.has(id))
}

/** The world party holding exactly these five, in any order, or null. */
export function partyHolding(world: Pick<TierWorld, 'parties'>, five: readonly string[]): number | null {
  const at = world.parties.findIndex((_, i) => {
    const members = fullParty(world, i)
    return !!members && members.length === five.length && five.every((id) => members.includes(id))
  })
  return at < 0 ? null : at
}

/** What Ascend gives the next tier (tiers.md §5, T3, T5): the purse for each of the twenty and their banked EXP as Marks. */
export function ascendNumbers(world: Pick<TierWorld, 'umas'>, run: Pick<RiftRun, 'roster'>, tier: number):
  { to: number; umas: number; laurels: number; speedTickets: number; classMarks: number } {
  const n = run.roster.length
  return {
    to: tier + 1, umas: n, laurels: ASCEND_PURSE.laurels * n, speedTickets: ASCEND_PURSE.speedTickets * n,
    classMarks: run.roster.reduce((sum, id) => sum + bankedMarks(world.umas[id]?.exp ?? 0), 0),
  }
}

/** The Ascend sheet's lines. */
export function ascendLines(numbers: ReturnType<typeof ascendNumbers>, tier: number): string[] {
  const f = (n: number) => n.toLocaleString('en-US')
  return [
    `${numbers.umas} Umas move to Tier ${numbers.to} at Lv 1`,
    'Ranks, skills and Extra Stats start over',
    `Their gear returns to Tier ${tier}’s stock`,
    `Tier ${numbers.to} gets ${f(numbers.laurels)} Laurels, ${f(numbers.speedTickets)} Speed Tickets and ${f(numbers.classMarks)} Class Marks`,
  ]
}

/** The result screen's words: its heading, its lines and its two buttons ("again" null when there's none). */
export function riftResultView(result: RiftFightResult): { heading: string; lines: string[]; again: string | null; back: string } {
  const win = result.outcome === 'victory'
  const { ref } = result
  const rounds = result.swept ? `Swept ${result.swept > 1 ? `${result.swept} times` : 'with a ticket'}`
    : `${result.rounds} round${result.rounds === 1 ? '' : 's'}`
  const back = 'Back to the Rift'
  const heading = win ? 'Victory!' : 'Defeated'
  switch (ref.kind) {
    case 'front': {
      if (!win) return { heading, lines: [rounds, 'No penalty'], again: 'Retry', back }
      const sealed = (result.cleared ?? 0) >= RIFT_STAGES
      return { heading, lines: [rounds, sealed ? `${FRONT_NAME[ref.front]} sealed` : `Stage ${ref.stage} cleared · ${result.cleared}/${RIFT_STAGES}`],
        again: sealed ? null : 'Next stage', back }
    }
    case 'convergence': {
      if (!win) return { heading, lines: [rounds, 'The attempt is over'], again: null, back }
      if (result.runWon) return { heading, lines: [rounds, 'The Rift is won!'], again: null, back }
      const next = RIFT_FRONTS[result.attempt ?? ref.fight + 1]
      return { heading, lines: [rounds, `Fight ${ref.fight + 1} of ${CONVERGENCE_FIGHTS} won`], again: next ? `Next: ${FRONT_NAME[next]}` : null, back }
    }
    case 'echo':
      return { heading, lines: win ? [rounds] : [rounds, 'No penalty'], again: result.swept ? 'Sweep again' : win ? 'Fight again' : 'Retry', back }
  }
}

/** A stage's leaders for its row: boss faces, then sub-boss faces, last wave first, each once (at most `max`). */
export function stageLeaders(plan: { enemies: readonly BattleEnemy[]; waves?: readonly (readonly BattleEnemy[])[] }, tierOf: (castId: string) => EnemyTier | undefined, max = 3): string[] {
  const foes = [plan.enemies, ...(plan.waves ?? [])].reverse().flat()
  const of = (tier: EnemyTier) => foes.filter((e) => tierOf(e.castId) === tier).map((e) => e.castId)
  return [...new Set([...of('boss'), ...of('subboss')])].slice(0, max)
}

/** A plan's foes: how many waves, and how many foes in all. */
export function planSize(plan: { enemies: readonly BattleEnemy[]; waves?: readonly (readonly BattleEnemy[])[] }): { waves: number; foes: number } {
  const waves = [plan.enemies, ...(plan.waves ?? [])]
  return { waves: waves.length, foes: waves.reduce((n, w) => n + w.length, 0) }
}

/** The fights whose champions the finale shows (H52): each front's champion, Iron to Horde, then the Convergence's four. */
export function riftFinalePlans(ctx: RiftContext): RiftFightPlan[] {
  return [...RIFT_FRONTS.map((front) => riftFight(ctx, { kind: 'front', front, stage: RIFT_STAGES })), ...riftConvergence(ctx)]
}

/** The finale's faces (H52): every boss-faced foe of these fights, in order, each once; a face the roster lacks is skipped. */
export function riftFinaleFaces(plans: readonly Pick<RiftFightPlan, 'enemies' | 'waves'>[], roster: ReadonlyMap<string, Pick<RosterMember, 'tier'>>): string[] {
  const faces = new Set<string>()
  for (const plan of plans) {
    for (const foe of [plan.enemies, ...(plan.waves ?? [])].flat()) if (roster.get(foe.castId)?.tier === 'boss') faces.add(foe.castId)
  }
  return [...faces]
}
