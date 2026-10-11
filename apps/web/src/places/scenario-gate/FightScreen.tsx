// A fight (S3, D53, D86): the Phaser stage shows the rivals and the party and plays every action; the DOM on top carries
// taps, bars, shields, weaknesses and commands. Pick one of her five weapons to attack with, or a skill, then tap a
// rival; a Spell Blade picks an Arms half and a Tome half. Weak hits chip shields; a Break leaves the rival open for two
// rounds. Every action is saved as it's taken, so a fight survives a reload (D52).
import {
  autoAction, battleActionsLeft, battleBroken, battleFoe, battleWaveCount, isRpgTome, openFightOf, rpgRunBattleStep, SaveRuleError, type BattleAction, type BattleCue, type BattleState,
  type BattleUnit, type FightResult, type RpgCampaignChapter, type RpgNodeRef, type RpgWeapon,
} from '@rpg/domain'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Campaign } from '../../battle/campaign'
import {
  actionFor, describeCue, followCue, halfIsTome, limitMode, limitNow, limitOptions, limitReady, pairMode, pairOf, previewTarget, skillChoices,
  type BattleMode, type SkillChoice,
} from '../../battle/battle-view'
import { BattleStage } from '../../battle/BattleStage'
import { loadBattlePreferences, nextBattleSpeed, saveBattlePreferences } from '../../battle/battle-prefs'
import { Bar, ElementGlyph, KindMark, ShieldBadge, skillKinds, WeaknessIcons, WEAPON_LABEL, WeaponGlyph } from '../../battle/labels'
import type { StageSetup } from '../../battle/scene/BattleScene'
import type { BattleGame } from '../../battle/scene/createBattleGame'
import { stageLayout } from '../../battle/stage-layout'
import { castArtUrl } from '../../content/cast'
import { artUrl, AtlasSprite, imagePath } from '../../master/art'
import { fightAction, leaveFight, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { BackIcon, MenuIcon } from '../../ui/icons'

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('image'))
    img.src = url
  })
}
const maybe = (url: Promise<string> | null): Promise<HTMLImageElement | null> => (url ? url.then(loadImage).catch(() => null) : Promise.resolve(null))

/** Loads the stage art: chibis (idle and cheer) and busts for the party, portraits for the rivals. Missing art is fine. */
function useStageSetup(campaign: Campaign, chapter: RpgCampaignChapter, state: BattleState | null, reducedMotion: boolean): StageSetup | null {
  const [setup, setSetup] = useState<StageSetup | null>(null)
  const key = state ? `${state.input.seed}` : ''
  useEffect(() => {
    if (!state) return
    let live = true
    const art = campaign.view.art
    const path = (family: 'outfit-chibis' | 'outfit-busts', k: string) => {
      const p = imagePath(art, family, k)
      return p ? artUrl(p) : null
    }
    void Promise.all([
      Promise.all(state.input.allies.map(async (a) => ({
        id: a.id,
        idle: await maybe(path('outfit-chibis', `${a.id}-a`)),
        cheer: await maybe(path('outfit-chibis', `${a.id}-b`)),
        bust: await maybe(path('outfit-busts', a.id)),
      }))),
      // Every wave's rivals load up front, so the next wave steps in without a wait (W3).
      Promise.all([state.input.enemies, ...(state.input.waves ?? [])].flat().map(async (e) => {
        const member = campaign.cast.byId.get(e.castId)
        return { id: e.id, rank: e.rank, color: member?.color ?? '#888888', art: await maybe(member ? castArtUrl(member.art.path) : null) }
      })),
    ]).then(([allies, enemies]) => {
      const field = state.units.filter((u) => u.side === 'enemy').map((u) => u.id)
      if (live) setSetup({ allies, enemies, field, color: campaign.color(chapter.id), reducedMotion })
    })
    return () => {
      live = false
    }
    // One setup per fight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return setup
}

function useSize(ref: React.RefObject<HTMLElement | null>): { w: number; h: number } {
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return size
}

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const AUTO_DELAY_MS = 180

export function FightScreen({ campaign, chapter, onEnd, onMap }: {
  campaign: Campaign
  chapter: RpgCampaignChapter
  onEnd: (result: FightResult, nodeId: string) => void
  onMap: () => void
}) {
  const world = useWorld()
  const run = world ? openFightOf(world) : null
  const [live, setLive] = useState<BattleState | null>(() => (run?.battle ? rpgRunBattleStep(run)?.state ?? null : null))
  const [shown, setShown] = useState<BattleState | null>(live)
  const nodeId = useRef(run?.battle?.nodeId ?? '')
  const node = chapter.nodes.find((n) => n.id === nodeId.current)
  const [actorId, setActorId] = useState<string | null>(null)
  const [mode, setMode] = useState<BattleMode>({ kind: 'attack' })
  const [sheet, setSheet] = useState<'skills' | 'menu' | { limit: string } | null>(null)
  const [limitPicks, setLimitPicks] = useState<RpgNodeRef[]>([])
  const [busy, setBusy] = useState(false)
  const [cue, setCue] = useState<BattleCue | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prefs, setPrefs] = useState(loadBattlePreferences)
  const [stageReady, setStageReady] = useState(false)
  const game = useRef<BattleGame | null>(null)
  const actRef = useRef<(action: BattleAction) => Promise<void>>(async () => undefined)
  const setup = useStageSetup(campaign, chapter, live, reduced())
  const stageRef = useRef<HTMLDivElement>(null)
  const size = useSize(stageRef)
  const onGame = useCallback((g: BattleGame | null) => {
    game.current = g
    setStageReady(g !== null)
  }, [])

  useEffect(() => saveBattlePreferences(prefs), [prefs])

  // Auto owns only the next ready ally. The action's cue playback keeps `busy` true, so the following ally waits until
  // the stage has finished and synced. Reduced motion removes this small hand-off pause too.
  useEffect(() => {
    if (!prefs.auto || busy || cue || sheet || !stageReady || !live || live.outcome !== 'active') return
    const actor = live.units.find((unit) => unit.side === 'ally' && unit.hp > 0 && battleActionsLeft(live, unit.id) > 0)
    if (!actor) return
    const timer = window.setTimeout(() => void actRef.current(autoAction(live, actor.id)), reduced() ? 0 : AUTO_DELAY_MS / prefs.speed)
    return () => window.clearTimeout(timer)
  }, [busy, cue, live, prefs.auto, prefs.speed, sheet, stageReady])

  // Hidden mid-playback: finish at once rather than animate into the background.
  useEffect(() => {
    const hide = () => {
      if (document.hidden) game.current?.skip()
    }
    document.addEventListener('visibilitychange', hide)
    return () => document.removeEventListener('visibilitychange', hide)
  }, [])

  const name = (id: string) => {
    const enemy = live ? battleFoe(live, id) : undefined
    return enemy ? campaign.name(id, enemy.castId) : campaign.name(id)
  }

  if (!live || !shown) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-page p-6 text-center">
        <p>No fight is open.</p>
        <button type="button" onClick={onMap} className="min-h-11 rounded-sm bg-accent px-4 font-display font-bold text-accent-ink">Back to the map</button>
      </div>
    )
  }

  const state = live
  const ready = state.units.filter((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)
  const actor = ready.find((u) => u.id === actorId) ?? ready[0] ?? null
  const ally = actor ? state.input.allies.find((a) => a.id === actor.id)! : null
  const choices = actor ? skillChoices(state, actor.id) : []
  const playing = cue !== null
  const paired = ally?.classId === 'spellblade'
  const pair = ally && paired ? pairOf(mode, ally) : null
  const skill = mode.kind === 'skill' ? choices.find((c) => c.ref.id === mode.ref.id) ?? null : null
  const halfName = (h: { skill?: RpgNodeRef; weapon?: RpgWeapon }) =>
    h.skill ? choices.find((c) => c.ref.id === h.skill!.id)?.skill.label ?? '?' : h.weapon ? `${WEAPON_LABEL[h.weapon]} Attack` : '?'
  const pairMp = pair ? [pair.arms, pair.tome].reduce((n, h) => n + (h.skill ? choices.find((c) => c.ref.id === h.skill!.id)?.skill.mp ?? 0 : 0), 0) : 0
  /** The mode an act uses: a Spell Blade's always carries both halves. */
  const effective: BattleMode = pair && (mode.kind === 'attack' || mode.kind === 'skill') ? pairMode(pair) : mode
  /** The weapon an Attack uses now: hers, or for a Spell Blade whichever half is an Attack. */
  const attackWeapon = (w: RpgWeapon) => (pair ? (isRpgTome(w) ? pair.tome.weapon === w : pair.arms.weapon === w)
    : mode.kind === 'attack' && (mode.weapon ?? ally?.weapons[0]) === w)

  const act = async (action: BattleAction) => {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      const { step, result } = await fightAction(chapter, action)
      setLive(step.state)
      setMode({ kind: 'attack' })
      setActorId(battleActionsLeft(step.state, action.actorId) > 0 ? action.actorId : null)
      let display = shown
      const g = game.current
      if (g) {
        await g.play(step.cues.filter((c) => c.kind !== 'intent'), (c) => {
          // A new wave (W3) is the act's last cue: the stage and the overlay jump to the foes stepping in.
          if (c.kind === 'wave') {
            display = step.state
            g.sync(step.state)
          } else display = followCue(display, c)
          setShown(display)
          setCue(c)
        })
        g.sync(step.state)
      }
      setCue(null)
      setShown(step.state)
      if (result) onEnd(result, nodeId.current)
    } catch (err) {
      setError(err instanceof SaveRuleError || err instanceof Error ? err.message : 'That action didn’t work.')
      // A failed action hands control back, or Auto would resend it the moment `busy` clears.
      setPrefs((current) => current.auto ? { ...current, auto: false } : current)
    } finally {
      setBusy(false)
    }
  }
  actRef.current = act

  const stopAuto = () => setPrefs((current) => current.auto ? { ...current, auto: false } : current)

  const tapEnemy = (unit: BattleUnit) => {
    if (busy || playing || !actor || unit.hp <= 0 || mode.kind === 'guard') return
    stopAuto()
    void act(actionFor(effective, actor.id, unit.id))
  }
  const tapAlly = (unit: BattleUnit) => {
    if (busy || playing || !actor) return
    stopAuto()
    if (mode.kind === 'guard') {
      if (unit.id !== actor.id && unit.hp > 0) void act({ kind: 'guard', actorId: actor.id, targetId: unit.id })
      return
    }
    if (unit.hp > 0 && battleActionsLeft(state, unit.id) > 0) {
      setActorId(unit.id)
      setMode({ kind: 'attack' })
    }
  }
  const pickSkill = (choice: SkillChoice) => {
    stopAuto()
    if (pair) setMode(pairMode(isRpgTome(choice.skill.node.weapon) ? { ...pair, tome: { skill: choice.ref } } : { ...pair, arms: { skill: choice.ref } }))
    else setMode({ kind: 'skill', ref: choice.ref })
    setSheet(null)
  }
  const pickWeapon = (w: RpgWeapon) => {
    stopAuto()
    if (pair) setMode(pairMode(isRpgTome(w) ? { ...pair, tome: { weapon: w } } : { ...pair, arms: { weapon: w } }))
    else setMode({ kind: 'attack', weapon: w })
  }

  const hint = error ?? (cue ? describeCue(cue, name)
    : prefs.auto ? `Auto · ${prefs.speed}×${actor ? ` · ${name(actor.id)}` : ''}`
    : mode.kind === 'guard' ? `Tap an ally for ${name(actor?.id ?? '')} to guard`
    : mode.kind === 'limit' ? `Tap a rival: LIMIT BREAK · ${mode.name}`
    : pair ? `Tap a rival: ${halfName(pair.arms)} + ${halfName(pair.tome)}${pairMp ? ` · ${pairMp} MP` : ''}`
    : skill ? `Tap a rival: ${skill.skill.label} · ${skill.skill.mp} MP`
    : actor && ally ? `${name(actor.id)}: tap a rival to attack with her ${WEAPON_LABEL[mode.kind === 'attack' && mode.weapon ? mode.weapon : ally.weapons[0]!]}` : '')

  const enemies = shown.units.filter((u) => u.side === 'enemy')
  const allies = shown.units.filter((u) => u.side === 'ally')
  const layout = size.w > 0 ? stageLayout(size.w, size.h, enemies.map((u) => battleFoe(state, u.id)!.rank), allies.length) : null
  const waves = battleWaveCount(state.input)

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-page">
      <header className="pt-safe z-20 flex min-h-13 items-center gap-1 border-b border-hairline bg-panel/95 px-1.5">
        <button type="button" onClick={onMap} disabled={busy} className="flex size-11 items-center justify-center rounded-full text-ink-soft" aria-label="Back to the map (the fight stays open)">
          <BackIcon />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] text-ink-faint">{chapter.title}</p>
          <h1 className="truncate text-[15px] leading-tight">{node?.name ?? 'Fight'}</h1>
        </div>
        {waves > 1 && <span className="rounded-full bg-[#8fd3ff]/15 px-2 py-1 text-[11px] font-bold text-[#8fd3ff]" aria-label={`Wave ${(shown.wave ?? 0) + 1} of ${waves}`}>W{(shown.wave ?? 0) + 1}/{waves}</span>}
        <span className="rounded-full bg-sunken px-2 py-1 text-[11px] font-bold">Round {state.round}</span>
        <button type="button" aria-pressed={prefs.auto} aria-label={`Auto-battle ${prefs.auto ? 'on' : 'off'}`}
          onClick={() => setPrefs((current) => ({ ...current, auto: !current.auto }))}
          className={`flex h-11 min-w-11 items-center justify-center rounded-full border text-[11px] font-bold ${prefs.auto ? 'border-accent bg-accent/15 text-accent' : 'border-transparent text-ink-soft'}`}>
          Auto
        </button>
        <button type="button" aria-label={`Battle speed ${prefs.speed} times. Tap for ${nextBattleSpeed(prefs.speed)} times`}
          onClick={() => setPrefs((current) => ({ ...current, speed: nextBattleSpeed(current.speed) }))}
          className="flex size-11 items-center justify-center rounded-full text-[12px] font-bold text-ink-soft">
          {prefs.speed}×
        </button>
        <button type="button" onClick={() => { stopAuto(); setSheet('menu') }} disabled={busy} className="flex size-11 items-center justify-center rounded-full text-ink-soft" aria-label="Fight menu">
          <MenuIcon />
        </button>
      </header>

      <div ref={stageRef} className="relative min-h-0 flex-1 overflow-hidden" onClick={() => playing && game.current?.skip()}>
        {setup ? <BattleStage setup={setup} state={state} speed={prefs.speed} onGame={onGame} /> : <p className="p-6 text-center text-ink-soft">Setting the stage…</p>}
        {layout && enemies.map((unit, i) => {
          const enemy = battleFoe(state, unit.id)!
          const box = layout.enemies[i]!
          const info = layout.enemyInfo[i]!
          // A foe that acts twice (W3) shows both of this round's moves.
          const intents = state.intents.filter((x) => x.enemyId === unit.id)
          const intent = intents[0]
          const moveOf = (id: string) => [...enemy.moves, ...(enemy.phaseTwo?.moves ?? [])].find((m) => m.id === id)
          const move = intent && moveOf(intent.moveId)
          const preview = actor && unit.hp > 0 && mode.kind !== 'guard' && !playing ? previewTarget(state, actor.id, effective, unit.id) : null
          const broken = battleBroken(unit)
          return (
            <div key={unit.id}>
              <button
                type="button"
                disabled={unit.hp <= 0 || busy}
                onClick={(e) => {
                  e.stopPropagation()
                  tapEnemy(unit)
                }}
                aria-label={`${name(unit.id)}, ${enemy.element}${enemy.element2 ? ` and ${enemy.element2}` : ''}${enemy.twice ? ', acts twice' : ''}, HP ${unit.hp} of ${enemy.stats.hp}, ${broken ? 'broken' : `shield ${unit.shield}`}`}
                className="absolute rounded-md"
                style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
              >
                {preview && !preview.error && (
                  <span className={`absolute -top-1 right-0 rounded-xs px-1 text-[10px] font-bold ${preview.weak ? 'bg-[#ffd84d] text-accent-ink' : 'bg-sunken/90 text-ink'}`}>
                    {preview.amount}
                    {preview.breaks ? ' BREAK' : preview.chips ? ` −${preview.chips}` : ''}
                  </span>
                )}
                {broken && unit.hp > 0 && <span className="absolute left-0 top-1 rounded-xs bg-accent px-1 text-[10px] font-bold text-accent-ink">BREAK</span>}
              </button>
              <div className={`pointer-events-none absolute flex flex-col items-center gap-0.5 text-center ${unit.hp <= 0 ? 'opacity-30' : ''}`} style={{ left: info.x, top: info.y, width: info.w }}>
                <p className="flex max-w-full items-center gap-0.5 text-[11px] font-semibold leading-tight">
                  <ElementGlyph element={enemy.element} size={12} />
                  {enemy.element2 && <ElementGlyph element={enemy.element2} size={12} />}
                  <span className="truncate">{name(unit.id)}</span>
                </p>
                <Bar className="w-full max-w-24" value={unit.hp} max={enemy.stats.hp} />
                <div className="flex items-center gap-1">
                  <ShieldBadge value={unit.shield} broken={broken} />
                  <WeaknessIcons weaknesses={enemy.weaknesses} size={12} />
                </div>
                {move && unit.hp > 0 && !broken && (
                  <p className="line-clamp-1 max-w-full text-[9.5px] leading-3 text-ink-faint">
                    {intents.map((x) => `${moveOf(x.moveId)?.label ?? ''} → ${x.targetId === 'all' ? 'all' : name(x.targetId)}`).join(' · ')}
                  </p>
                )}
              </div>
            </div>
          )
        })}
        {layout && allies.map((unit, i) => {
          const a = state.input.allies.find((x) => x.id === unit.id)!
          const box = layout.allies[i]!
          const info = layout.allyInfo[i]!
          const done = unit.hp <= 0 || battleActionsLeft(shown, unit.id) <= 0
          const selected = actor?.id === unit.id && !playing
          const lb = unit.hp > 0 && limitReady(shown, unit.id)
          return (
            <div key={unit.id}>
              {selected && <span className="pointer-events-none absolute rounded-[50%] border-2 border-accent shadow-[0_0_14px_rgba(214,162,62,0.7)]" style={{ left: box.x + box.w * 0.12, top: box.y + box.h - box.w * 0.14, width: box.w * 0.76, height: box.w * 0.2 }} />}
              <button
                type="button"
                disabled={busy}
                onClick={(e) => {
                  e.stopPropagation()
                  tapAlly(unit)
                }}
                aria-label={`${name(unit.id)}, HP ${unit.hp} of ${a.stats.hp}, MP ${unit.mp} of ${a.stats.mp}${done ? ', done' : ''}`}
                className="absolute flex items-end justify-center"
                style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
              >
                {setup && !setup.allies.find((x) => x.id === unit.id)?.idle && (
                  <AtlasSprite art={campaign.view.art} family="outfit-icons" frameKey={unit.id} size={Math.round(box.w * 0.62)} className={`mb-1 rounded-full ${unit.hp <= 0 ? 'opacity-35 grayscale' : ''}`} />
                )}
              </button>
              {lb && (
                <button
                  type="button"
                  disabled={busy || playing}
                  onClick={(e) => {
                    e.stopPropagation()
                    stopAuto()
                    setLimitPicks([])
                    setSheet({ limit: unit.id })
                  }}
                  aria-label={`${name(unit.id)}: Limit Break ready`}
                  className="absolute flex h-6 -translate-x-1/2 items-center rounded-full border border-[#ffd84d] bg-sunken/90 px-2 text-[10px] font-bold text-[#ffd84d] shadow-[0_0_10px_rgba(255,216,77,0.55)]"
                  style={{ left: box.x + box.w / 2, top: box.y + 2 }}
                >
                  LB
                </button>
              )}
              <div className={`pointer-events-none absolute px-1 ${done ? 'opacity-55' : ''}`} style={{ left: info.x, top: info.y, width: info.w }}>
                <Bar value={unit.hp} max={a.stats.hp} />
                <Bar className="mt-0.5" value={unit.mp} max={a.stats.mp} tone="mp" />
                <p className="truncate text-center text-[9.5px] leading-3 text-ink-soft">
                  {unit.hp <= 0 ? 'KO' : `${unit.hp} HP`}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <footer className="pb-safe shrink-0 border-t border-hairline bg-panel px-3 pt-2">
        <p aria-live="polite" className={`mb-1.5 min-h-5 text-center font-semibold ${error ? 'text-danger' : 'text-accent'} ${cue?.kind === 'break' || cue?.kind === 'limit' ? 'font-display text-[18px]' : 'text-[12px] leading-4'}`}>
          {hint}
        </p>
        {ally && (
          <div className="mb-2 grid grid-cols-5 gap-1.5" aria-label={paired ? 'Attack weapons: one Arm and one Tome' : 'Attack weapon'}>
            {ally.weapons.map((w) => {
              const on = attackWeapon(w)
              return (
                <button key={w} type="button" aria-pressed={on} aria-label={`Attack with ${WEAPON_LABEL[w]}`} disabled={busy || playing} onClick={() => pickWeapon(w)}
                  className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-sm border text-[10px] font-semibold leading-none ${on ? 'border-accent bg-accent/15 text-accent' : 'border-hairline-strong'}`}>
                  <WeaponGlyph weapon={w} size={18} />
                  <span className="max-w-full truncate px-0.5">{WEAPON_LABEL[w].replace(' Tome', '')}</span>
                </button>
              )
            })}
          </div>
        )}
        <div className="mb-2 grid grid-cols-3 gap-2">
          {(['attack', 'skill', 'guard'] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              disabled={busy || playing || !actor || (kind === 'skill' && choices.length === 0)}
              aria-pressed={mode.kind === kind}
              onClick={() => {
                stopAuto()
                if (kind === 'skill') setSheet('skills')
                else setMode(kind === 'attack' ? (ally && paired ? pairMode(pairOf({ kind: 'attack' }, ally)) : { kind }) : { kind: 'guard' })
              }}
              className={`min-h-12 rounded-sm border font-display text-[15px] font-bold disabled:opacity-40 ${mode.kind === kind ? 'border-accent bg-accent/15 text-accent' : 'border-hairline-strong bg-raised'}`}
            >
              {kind === 'skill' ? `Skills${choices.length ? ` (${choices.length})` : ''}` : kind === 'attack' ? 'Attack' : 'Guard'}
            </button>
          ))}
        </div>
      </footer>

      {sheet === 'skills' && actor && (
        <BottomSheet title={`${name(actor.id)} · ${actor.mp} MP`} onClose={() => setSheet(null)}>
          <ul className="space-y-1.5">
            {[...choices].sort((a, b) => (ally?.weapons.indexOf(a.skill.node.weapon) ?? 0) - (ally?.weapons.indexOf(b.skill.node.weapon) ?? 0)).map((choice) => {
              const kinds = skillKinds(choice.skill.def)
              const weak = enemies.filter((u) => {
                const w = battleFoe(state, u.id)!.weaknesses
                return u.hp > 0 && kinds.some((k) => (w.elements as string[]).includes(k) || (w.weapons as string[]).includes(k))
              })
              const def = choice.skill.def
              return (
                <li key={choice.ref.id}>
                  <button type="button" disabled={!choice.affordable} onClick={() => pickSkill(choice)}
                    className="flex min-h-14 w-full items-center justify-between gap-2 rounded-sm bg-raised p-3 text-left disabled:opacity-40">
                    <span className="min-w-0">
                      <span className="flex items-center gap-1 font-semibold"><WeaponGlyph weapon={choice.skill.node.weapon} size={14} />{kinds.map((k) => <KindMark key={k} kind={k} size={14} />)}{choice.skill.label}</span>
                      <span className="block text-[11px] text-ink-soft">
                        {def.target === 'all' ? 'All rivals' : def.target === 'random' ? `${def.hits.length} hits on random rivals` : def.hits.length > 1 ? `${def.hits.length} hits` : 'One rival'}
                        {weak.length ? ` · weak: ${weak.map((u) => name(u.id)).join(', ')}` : ''}
                      </span>
                    </span>
                    <span className="shrink-0 text-[13px] font-semibold">{choice.skill.mp} MP</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </BottomSheet>
      )}

      {sheet && typeof sheet === 'object' && 'limit' in sheet && (() => {
        const id = sheet.limit
        const { pick, options } = limitOptions(state, id)
        const now = limitNow(state, id)
        const choose = (choice: Parameters<typeof limitMode>[2]) => {
          const next = limitMode(state, id, choice)
          if (!next) return setError('That Limit Break isn’t available')
          setActorId(id)
          setMode(next)
          setSheet(null)
        }
        return (
          <BottomSheet title={`Limit Break · ${name(id)}`} onClose={() => setSheet(null)}>
            {!now ? (
              <p className="text-[14px] text-ink-soft">Ready on her next turn</p>
            ) : options.length === 0 ? (
              <p className="text-[14px] text-ink-soft">Equip a summon to use her Limit Break.</p>
            ) : (
              <ul className="space-y-1.5">
                <li className="text-[12px] text-ink-soft">{pick === 2 ? `Pick an Arms skill and a Tome skill · ${limitPicks.length}/2` : 'Pick one, then tap a rival'}</li>
                {options.map((o) => (
                  <li key={o.key}>
                    <button type="button" onClick={() => {
                      if (pick === 1) return choose(o.choice)
                      const picks = [...limitPicks, o.choice.skills![0]!]
                      if (picks.length < 2) return setLimitPicks(picks)
                      choose({ skills: picks })
                    }} className="flex min-h-14 w-full items-center justify-between gap-2 rounded-sm border border-[#ffd84d]/40 bg-raised p-3 text-left">
                      <span><span className="block font-semibold">{o.name}</span><span className="block text-[11px] text-ink-soft">{o.detail}</span></span>
                      <span className="text-[13px] font-semibold text-[#ffd84d]">0 MP</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </BottomSheet>
        )
      })()}

      {sheet === 'menu' && (
        <BottomSheet title="Fight" onClose={() => setSheet(null)}>
          <div className="space-y-2">
            <button type="button" onClick={onMap} className="flex min-h-12 w-full items-center justify-center rounded-sm bg-raised font-semibold">Back to the map</button>
            <button type="button" onClick={() => void leaveFight().then(onMap)} className="flex min-h-12 w-full items-center justify-center rounded-sm border border-hairline-strong font-semibold text-ink-soft">
              Give up
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  )
}
