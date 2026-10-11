// Battle vocabulary for the UI: labels, element and weapon glyphs (inline SVG, ported from uma-racer), bars and the
// break shield. Shared by the chapter map, the fight and the skills page.
import {
  isRpgElement, isRpgWeaponKind, rpgHand, rpgTierLevel, type BattleWeaknesses, type RpgBuildId, type RpgClass, type RpgDamageKind,
  type RpgElement, type RpgProfile, type RpgSkillDef, type RpgTreeId, type RpgWeapon, type RpgWeaponKind,
} from '@rpg/domain'

export const WEAPON_KIND_LABEL: Readonly<Record<RpgWeaponKind, string>> = {
  greatsword: 'Greatsword', spear: 'Spear', axe: 'Axe', bow: 'Bow', 'short-sword': 'Short Sword',
}
export const WEAPON_LABEL: Readonly<Record<RpgWeapon, string>> = {
  ...WEAPON_KIND_LABEL, 'mage-staff': 'Mage Staff', 'arcane-staff': 'Arcane Staff', 'cleric-staff': 'Cleric Staff', 'summoner-tome': 'Summoner Tome',
}
export const ELEMENT_LABEL: Readonly<Record<RpgElement, string>> = { fire: 'Fire', ice: 'Ice', lightning: 'Lightning', light: 'Light', dark: 'Dark' }
export const CLASS_LABEL: Readonly<Record<RpgClass, string>> = { brawler: 'Brawler', mage: 'Mage', spellblade: 'Spell Blade', cleric: 'Cleric', summoner: 'Summoner' }
export const BUILD_LABEL: Readonly<Record<RpgBuildId, string>> = {
  'greatsword-spear': 'Brawler · Greatsword & Spear', 'axe-bow': 'Brawler · Axe & Bow', mage: 'Mage', spellblade: 'Spell Blade', cleric: 'Cleric', summoner: 'Summoner',
}
export const CLASS_BLURB: Readonly<Record<RpgClass, string>> = {
  brawler: 'One heavy action a turn with either weapon: weapon damage with an elemental splash.',
  mage: 'Pure magic: two casts a turn of every element, Light, Dark and Ultima.',
  spellblade: 'Half magic, half blade: two half-strength actions a turn, every skill a Short Sword cut with an element or arcane magic.',
  cleric: 'Light, Dark and Ultima casts that carry buffs, debuffs, barriers and heals.',
  summoner: 'Two half-strength summons a turn of every damage kind, plus a free Familiar.',
}
export const TREE_LABEL: Readonly<Record<RpgTreeId, string>> = {
  greatsword: 'Greatsword', spear: 'Spear', axe: 'Axe', bow: 'Bow', 'mage-staff': 'Mage Staff', 'arcane-staff': 'Arcane Staff',
  'short-sword': 'Short Sword', 'cleric-staff': 'Cleric Staff', 'summon-elemental': 'Elemental summons', 'summon-arcane': 'Arcane summons',
  'blade-elemental': 'Elemental Blade', 'blade-arcane': 'Arcane Blade',
}
export const BRANCH_LABEL: Readonly<Record<string, string>> = {
  fire: 'Fire', ice: 'Ice', lightning: 'Lightning', light: 'Light', dark: 'Dark', ultima: 'Ultima', duel: 'Duel', melee: 'Melee',
  tempo: 'Tempo', grace: 'Grace', malice: 'Malice', sanctuary: 'Sanctuary', angels: 'Angels', demons: 'Demons', archons: 'Archons',
}
/** Element colors, shared with the battle stage's effects. */
export const ELEMENT_COLOR: Readonly<Record<RpgElement | 'ultima', string>> = {
  fire: '#ff8a5c', ice: '#8fd3ff', lightning: '#ffd84d', light: '#fff2b0', dark: '#c79bff', ultima: '#f0b8ff',
}

export const kindLabel = (kind: RpgDamageKind): string =>
  isRpgWeaponKind(kind) ? WEAPON_KIND_LABEL[kind] : isRpgElement(kind) ? ELEMENT_LABEL[kind] : kind === 'ultima' ? 'Ultima' : 'Staff'

/** Distinct damage kinds a skill lands, in order. */
export const skillKinds = (skill: RpgSkillDef): RpgDamageKind[] =>
  [...new Set([...skill.hits, ...(skill.focus ?? []), ...(skill.splash ? [skill.splash] : []), ...(skill.sweep ? [skill.sweep] : [])].flatMap((h) => h.parts.map((p) => p.kind)))]

/** A skill as this Uma casts it: targets, hits, power after her hand, and MP. */
export function skillLine(profile: Pick<RpgProfile, 'classId' | 'weapons' | 'tier'>, skill: RpgSkillDef): string {
  const hand = rpgHand(profile)
  const per = skill.target === 'all' ? 'every foe' : skill.target === 'random' ? 'random foes' : 'one foe'
  const total = skill.hits.reduce((sum, h) => sum + h.power, 0) * hand.power
  const mp = Math.max(1, Math.round(skill.mp * hand.mp)) * profile.tier
  return `${per} · ${skill.hits.length} hit${skill.hits.length === 1 ? '' : 's'} · ${total.toFixed(1)}× · ${mp} MP`
}

/** Tier 1 reads "Lv 7"; later tiers lead with their tier. */
export function formatLevel(lifetime: number): string {
  const { tier, level } = rpgTierLevel(lifetime)
  return tier === 1 ? `Lv ${level}` : `T${tier} Lv ${level}`
}

const ELEMENT_PATH: Readonly<Record<RpgElement | 'ultima', string>> = {
  ultima: 'M10 2l2.5 5.5L18 10l-5.5 2.5L10 18l-2.5-5.5L2 10l5.5-2.5Z',
  fire: 'M10 2c1 4-3 5-1 8 1-2 3-2 4-5 6 7 1 13-3 13S2 15 5 10c0 3 2 3 2 3-2-4 0-7 3-11Z',
  ice: 'M10 1v18M2 5l16 10M18 5 2 15M7 3l3 3 3-3M7 17l3-3 3 3',
  lightning: 'm11 1-7 10h6l-1 8 7-11h-6l1-7Z',
  light: 'M10 3v14M3 10h14M5 5l10 10M15 5 5 15M10 1v1m0 16v1M1 10h1m16 0h1',
  dark: 'M15 2a8 8 0 1 0 3 13A8 8 0 0 1 15 2Z',
}

export function ElementGlyph({ element, size = 16 }: { element: RpgElement | 'ultima'; size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke={ELEMENT_COLOR[element]} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
      <path d={ELEMENT_PATH[element]} />
    </svg>
  )
}

const line = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' } as const
/** Weapon silhouettes on a 24-unit grid, tilted: blades 45°, staves 25° (from uma-racer). */
const WEAPON_ART: Readonly<Record<RpgWeapon, React.ReactNode>> = {
  greatsword: <g transform="rotate(45 12 12)"><path fillRule="evenodd" d="M12 .5 15 4v11H9V4Zm-.6 4v9h1.2v-9Z" /><rect x="4.5" y="15" width="15" height="2.2" rx="1.1" /><rect x="11" y="17.2" width="2" height="4.3" /><circle cx="12" cy="22.6" r="1.5" /></g>,
  spear: <g transform="rotate(45 12 12)"><path d="M12 .5c2.4 3 2.6 6.3.9 9.1h-1.8C9.4 6.8 9.6 3.5 12 .5Z" /><rect x="10.6" y="9.6" width="2.8" height="1.6" rx=".5" /><rect x="11.35" y="11.2" width="1.3" height="12.6" rx=".6" /></g>,
  axe: <g transform="rotate(35 12 12)"><rect x="11.2" y="3" width="1.6" height="20.5" rx=".8" /><path d="M12.8 4.5c3.7-1.3 7.7 1 8.4 5.5-.7 4.5-4.7 6.8-8.4 5.5Z" /><path d="m11.2 7-3.4 1.6v2.8l3.4 1.6Z" /></g>,
  bow: <g transform="rotate(-45 12 12)"><path {...line} strokeWidth="2.4" d="M6 2c9.5 4 9.5 16 0 20" /><path {...line} strokeWidth=".9" d="M6 2v20" /><path {...line} strokeWidth="1.4" d="M3.2 12h15.3" /><path d="m21.5 12-4-2.4v4.8Z" /></g>,
  'short-sword': <g transform="rotate(45 12 12)"><path d="m12 4 1.9 2.4v7.8h-3.8V6.4Z" /><path d="M7.5 14.2h9l-.9 1.8H8.4Z" /><rect x="11.1" y="16" width="1.8" height="3.6" rx=".4" /><circle cx="12" cy="20.6" r="1.25" /></g>,
  'mage-staff': <g transform="rotate(25 12 12)"><rect x="11.3" y="9" width="1.4" height="14.5" rx=".7" /><path d="M12 .8 15 5l-3 4.2L9 5Z" /></g>,
  'arcane-staff': <g transform="rotate(25 12 12)"><rect x="11.3" y="9.5" width="1.4" height="14" rx=".7" /><circle {...line} cx="12" cy="5" r="4" strokeWidth="1.4" /></g>,
  'cleric-staff': <g transform="rotate(20 12 12)"><rect x="10.9" y=".8" width="2.2" height="9.6" rx=".6" /><rect x="8" y="3.2" width="8" height="2.2" rx=".6" /><rect x="11.3" y="10" width="1.4" height="13.5" rx=".7" /></g>,
  'summoner-tome': <g transform="rotate(-8 12 12)"><path d="M5 3.5C5 2.7 5.7 2 6.5 2h12c.8 0 1.5.7 1.5 1.5V19c0 .8-.7 1.5-1.5 1.5h-12C5.7 20.5 5 19.8 5 19Z" /></g>,
}

export function WeaponGlyph({ weapon, size = 16, className = '' }: { weapon: RpgWeapon; size?: number; className?: string }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden className={`shrink-0 ${className}`}>{WEAPON_ART[weapon]}</svg>
}

/** Any damage kind: an element, Ultima or a weapon kind. A staff strike has no mark. */
export function KindMark({ kind, size = 16 }: { kind: RpgDamageKind; size?: number }) {
  if (isRpgWeaponKind(kind)) return <span role="img" aria-label={kindLabel(kind)} className="inline-flex text-ink"><WeaponGlyph weapon={kind} size={size} /></span>
  if (isRpgElement(kind) || kind === 'ultima') return <span role="img" aria-label={kindLabel(kind)} className="inline-flex"><ElementGlyph element={kind} size={size} /></span>
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
