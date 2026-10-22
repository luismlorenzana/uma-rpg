// Small inline icons for the Hub chrome. Currency colours come from the theme (--color-ticket, -shard, -laurel).
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
      {children}
    </svg>
  )
}

export function TicketIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5V14a2 2 0 0 0 0-4V7.5Z" fill="var(--color-ticket)" />
      <path d="M15 6v12" stroke="#7a5a12" strokeWidth="1.4" strokeDasharray="1.6 1.6" />
      <path d="M8.2 12.8 9.4 10l1.2 2.8m-2 0h1.6" stroke="#5a420c" strokeWidth="1.3" strokeLinecap="round" />
    </Svg>
  )
}

export function ShardIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m12 2.5 6 7.5-6 11.5L6 10l6-7.5Z" fill="var(--color-shard)" />
      <path d="m12 2.5 2.4 7.5L12 21.5 9.6 10 12 2.5Z" fill="#dff3ff" opacity=".75" />
      <path d="M6 10h12" stroke="#4d8db8" strokeWidth="1" />
    </Svg>
  )
}

export function LaurelIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 20.5c-4.6-1.2-7.5-5.2-7.5-10.2" stroke="var(--color-laurel)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 20.5c4.6-1.2 7.5-5.2 7.5-10.2" stroke="var(--color-laurel)" strokeWidth="1.6" strokeLinecap="round" />
      {[[5.2, 8], [5.4, 12], [6.9, 15.6], [9.2, 18.4]].map(([x, y]) => (
        <ellipse key={`l${x}`} cx={x} cy={y} rx="2.1" ry="1.1" transform={`rotate(-50 ${x} ${y})`} fill="var(--color-laurel)" />
      ))}
      {[[18.8, 8], [18.6, 12], [17.1, 15.6], [14.8, 18.4]].map(([x, y]) => (
        <ellipse key={`r${x}`} cx={x} cy={y} rx="2.1" ry="1.1" transform={`rotate(50 ${x} ${y})`} fill="var(--color-laurel)" />
      ))}
    </Svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}

export function LockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" fill="currentColor" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="2" />
    </Svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}

export function BackIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function FlagIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 21V3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 4h10l-2.5 3L18 10H8V4Z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" />
    </Svg>
  )
}

/** A target (D100): a crosshair. */
export function TargetIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}

export function InfoIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
    </Svg>
  )
}
