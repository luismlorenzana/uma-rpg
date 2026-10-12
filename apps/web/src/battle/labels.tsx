// Battle vocabulary for the UI: labels, element and weapon glyphs (inline SVG, ported from uma-racer), bars and the
// break shield. Shared by the region map, the fight and the skills page (D86: ten weapons, five classes).
import {
  isRpgElement, isRpgWeaponKind, rpgHand, rpgTierLevel, type BattleWeaknesses, type RpgClass, type RpgDamageKind,
  type RpgElement, type RpgProfile, type RpgSkillDef, type RpgWeapon, type RpgWeaponKind,
} from '@rpg/domain'

const WEAPON_KIND_LABEL: Readonly<Record<RpgWeaponKind, string>> = {
  greatsword: 'Greatsword', axe: 'Axe', lance: 'Lance', bow: 'Bow', katana: 'Katana',
}
export const WEAPON_LABEL: Readonly<Record<RpgWeapon, string>> = {
  ...WEAPON_KIND_LABEL, 'tome-fire': 'Fire Tome', 'tome-ice': 'Blizzard Tome', 'tome-lightning': 'Thunder Tome', 'tome-light': 'Light Tome', 'tome-dark': 'Dark Tome',
}
const ELEMENT_LABEL: Readonly<Record<RpgElement, string>> = { fire: 'Fire', ice: 'Ice', lightning: 'Lightning', light: 'Light', dark: 'Dark' }
export const CLASS_LABEL: Readonly<Record<RpgClass, string>> = { brawler: 'Brawler', mage: 'Mage', spellblade: 'Spell Blade', cleric: 'Cleric', summoner: 'Summoner' }
export const CLASS_BLURB: Readonly<Record<RpgClass, string>> = {
  brawler: 'Pure physical damage: all five Arms, one heavy action a turn. An Elemental Orb adds an element to every hit.',
  mage: 'Pure magic: all five Tomes, one full cast a turn. An Arms Orb adds a weapon kind to every cast.',
  spellblade: 'Three Arms and two Tomes: every act is a blade and a spell, each at half strength.',
  cleric: 'Any five weapons: her blows weaken the foe they hit, her spells bless the whole party.',
  summoner: 'Three Tomes and two Arms: each summon strikes, stays, and strikes again when the next one comes.',
}
/** What each slot holds, for the class's weapon pickers. */
export const SLOT_LABEL = { arms: 'Arm', tome: 'Tome', any: 'Weapon' } as const
/** The grade-0 weapon every Uma holds of each kind (D98): no stats, it opens the tree. */
export const trainingName = (w: RpgWeapon): string => `Training ${WEAPON_LABEL[w]}`
/** Element colors for the inline glyphs. */
const ELEMENT_COLOR: Readonly<Record<RpgElement, string>> = {
  fire: '#ff8a5c', ice: '#8fd3ff', lightning: '#ffd84d', light: '#fff2b0', dark: '#c79bff',
}

const kindLabel = (kind: RpgDamageKind): string => (isRpgWeaponKind(kind) ? WEAPON_KIND_LABEL[kind] : ELEMENT_LABEL[kind])

/** Distinct damage kinds a skill lands, in order. */
export const skillKinds = (skill: RpgSkillDef): RpgDamageKind[] =>
  [...new Set([...skill.hits, ...(skill.focus ?? []), ...(skill.splash ? [skill.splash] : []), ...(skill.other ?? [])].flatMap((h) => h.parts.map((p) => p.kind)))]

/** A skill as this Uma casts it: targets, hits, power after her hand, and MP. */
export function skillLine(profile: Pick<RpgProfile, 'classId' | 'tier'>, skill: RpgSkillDef): string {
  const hand = rpgHand(profile)
  const per = skill.target === 'all' ? 'every foe' : skill.target === 'random' ? 'random foes' : 'one foe'
  const total = skill.hits.reduce((sum, h) => sum + h.power, 0) * hand.power
  const mp = Math.max(1, Math.round(skill.mp * hand.mp)) * profile.tier
  const extra = skill.status ? ` · ${STATUS_LABEL[skill.status.key]} ${skill.status.stacks}${skill.status.to === 'allies' ? ' to all' : skill.status.to === 'foes' ? ' on all foes' : ''}`
    : skill.summon ? ` · lingers ${skill.summon.linger}×` : ''
  return `${per} · ${skill.hits.length} hit${skill.hits.length === 1 ? '' : 's'} · ${total.toFixed(1)}× · ${mp} MP${extra}`
}
const STATUS_LABEL: Readonly<Record<NonNullable<RpgSkillDef['status']>['key'], string>> = {
  'armor-break': 'Armor Break', 'mind-break': 'Mind Break', enfeeble: 'Enfeeble', shatter: 'Shatter', hex: 'Hex',
  brave: 'Brave', faith: 'Faith', aegis: 'Aegis', breaker: 'Breaker', clarity: 'Clarity',
}

/** Tier 1 reads "Lv 7"; later tiers lead with their tier. */
export function formatLevel(lifetime: number): string {
  const { tier, level } = rpgTierLevel(lifetime)
  return tier === 1 ? `Lv ${level}` : `T${tier} Lv ${level}`
}

/** A range of lifetime levels in one tier, as "Lv 1–5". */
export function formatLevels(from: number, to: number): string {
  return `${formatLevel(from)}–${rpgTierLevel(to).level}`
}

const ELEMENT_PATH: Readonly<Record<RpgElement, string>> = {
  fire: 'M10 2c1 4-3 5-1 8 1-2 3-2 4-5 6 7 1 13-3 13S2 15 5 10c0 3 2 3 2 3-2-4 0-7 3-11Z',
  ice: 'M10 1v18M2 5l16 10M18 5 2 15M7 3l3 3 3-3M7 17l3-3 3 3',
  lightning: 'm11 1-7 10h6l-1 8 7-11h-6l1-7Z',
  light: 'M10 3v14M3 10h14M5 5l10 10M15 5 5 15M10 1v1m0 16v1M1 10h1m16 0h1',
  dark: 'M15 2a8 8 0 1 0 3 13A8 8 0 0 1 15 2Z',
}

export function ElementGlyph({ element, size = 16 }: { element: RpgElement; size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke={ELEMENT_COLOR[element]} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
      <path d={ELEMENT_PATH[element]} />
    </svg>
  )
}

const line = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' } as const
/** A Tome: a book in its element's color, with a spine. */
function tome(element: RpgElement): React.ReactNode {
  return <g transform="rotate(-8 12 12)"><path fill={ELEMENT_COLOR[element]} d="M5 3.5C5 2.7 5.7 2 6.5 2h12c.8 0 1.5.7 1.5 1.5V19c0 .8-.7 1.5-1.5 1.5h-12C5.7 20.5 5 19.8 5 19Z" /><rect x="5" y="2" width="2.2" height="18.5" rx=".6" /></g>
}
/** Weapon silhouettes on a 24-unit grid, tilted: blades 45° (from uma-racer); Tomes in their element's color. */
const WEAPON_ART: Readonly<Record<RpgWeapon, React.ReactNode>> = {
  greatsword: <g transform="rotate(45 12 12)"><path fillRule="evenodd" d="M12 .5 15 4v11H9V4Zm-.6 4v9h1.2v-9Z" /><rect x="4.5" y="15" width="15" height="2.2" rx="1.1" /><rect x="11" y="17.2" width="2" height="4.3" /><circle cx="12" cy="22.6" r="1.5" /></g>,
  lance: <g transform="rotate(45 12 12)"><path d="M12 .5c2.4 3 2.6 6.3.9 9.1h-1.8C9.4 6.8 9.6 3.5 12 .5Z" /><rect x="10.6" y="9.6" width="2.8" height="1.6" rx=".5" /><rect x="11.35" y="11.2" width="1.3" height="12.6" rx=".6" /></g>,
  axe: <g transform="rotate(35 12 12)"><rect x="11.2" y="3" width="1.6" height="20.5" rx=".8" /><path d="M12.8 4.5c3.7-1.3 7.7 1 8.4 5.5-.7 4.5-4.7 6.8-8.4 5.5Z" /><path d="m11.2 7-3.4 1.6v2.8l3.4 1.6Z" /></g>,
  bow: <g transform="rotate(-45 12 12)"><path {...line} strokeWidth="2.4" d="M6 2c9.5 4 9.5 16 0 20" /><path {...line} strokeWidth=".9" d="M6 2v20" /><path {...line} strokeWidth="1.4" d="M3.2 12h15.3" /><path d="m21.5 12-4-2.4v4.8Z" /></g>,
  katana: <g transform="rotate(45 12 12)"><path d="M12.4 .8c1.4 3.2 1.6 8.4.6 13.2h-2.1c.9-4.6.9-9.4-.4-12.6Z" /><rect x="9" y="14" width="6" height="1.6" rx=".8" /><rect x="11.1" y="15.6" width="1.9" height="7.2" rx=".5" /></g>,
  'tome-fire': tome('fire'), 'tome-ice': tome('ice'), 'tome-lightning': tome('lightning'), 'tome-light': tome('light'), 'tome-dark': tome('dark'),
}

export function WeaponGlyph({ weapon, size = 16, className = '' }: { weapon: RpgWeapon; size?: number; className?: string }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden className={`shrink-0 ${className}`}>{WEAPON_ART[weapon]}</svg>
}

/** Any damage kind: a weapon kind or an element. */
export function KindMark({ kind, size = 16 }: { kind: RpgDamageKind; size?: number }) {
  if (isRpgWeaponKind(kind)) return <span role="img" aria-label={kindLabel(kind)} className="inline-flex text-ink"><WeaponGlyph weapon={kind} size={size} /></span>
  if (isRpgElement(kind)) return <span role="img" aria-label={kindLabel(kind)} className="inline-flex"><ElementGlyph element={kind} size={size} /></span>
  return null
}
export function Bar({ value, max, tone = 'hp', className = '' }: { value: number; max: number; tone?: 'hp' | 'mp' | 'exp' | 'limit'; className?: string }) {
  const color = tone === 'hp' ? 'bg-[#5fd28a]' : tone === 'mp' ? 'bg-[#6aa8ff]' : tone === 'limit' ? 'bg-[#ffd84d]' : 'bg-accent'
  const width = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  return (
    <span className={`block h-1.5 overflow-hidden rounded-full bg-white/10 ${className}`} aria-hidden>
      <span className={`block h-full rounded-full ${color}`} style={{ width: `${width}%`, transition: 'width 240ms ease-out' }} />
    </span>
  )
}

/** Octopath-style break gauge: the shield count, or ! while it is down. */
export function ShieldBadge({ value, broken = false }: { value: number; broken?: boolean }) {
  return (
    <span role="img" aria-label={broken ? 'Broken' : `Shield ${value}`} className="relative inline-flex h-6 w-5 shrink-0 items-center justify-center">
      <svg viewBox="0 0 24 28" className={`absolute inset-0 h-full w-full ${broken ? 'text-accent' : 'text-[#9fb4cc]'}`} aria-hidden>
        <path d="M12 1 2 5v8c0 7 4.5 11.5 10 14 5.5-2.5 10-7 10-14V5L12 1Z" fill="currentColor" opacity={broken ? 0.9 : 0.35} stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="relative text-[11px] font-bold leading-none">{broken ? '!' : value}</span>
    </span>
  )
}

/** Weakness icons: elements first, then weapon kinds. */
export function WeaknessIcons({ weaknesses, size = 14 }: { weaknesses: BattleWeaknesses; size?: number }) {
  const names = [...weaknesses.elements.map((e) => ELEMENT_LABEL[e]), ...weaknesses.weapons.map((w) => WEAPON_KIND_LABEL[w])]
  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-0.5" aria-label={`Weak to ${names.join(', ')}`}>
      {weaknesses.elements.map((e) => <ElementGlyph key={e} element={e} size={size} />)}
      {weaknesses.weapons.map((w) => <span key={w} className="inline-flex text-ink-soft"><WeaponGlyph weapon={w} size={size} /></span>)}
    </span>
  )
}
