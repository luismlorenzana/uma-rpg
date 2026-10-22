// The "Can upgrade" mark (H34): a green disc with the kit's level-up chevrons, the kit's "ready" look (the bottom bar's
// badges). On a Stable tile (16), a gear row (18) and a weapon slot (14).
import { LevelUpIcon } from '@luismlorenzana/uma-kit/ui'

export function UpgradeMark({ size = 16, className = '' }: { size?: number; className?: string }) {
  const icon = Math.round(size * 0.7)
  return (
    <span role="img" aria-label="Can upgrade" data-upgrade=""
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-success text-ink-on-dark ring-2 ring-panel ${className}`}
      style={{ width: size, height: size }}>
      <LevelUpIcon size={16} strokeWidth={2.5} style={{ width: icon, height: icon }} />
    </span>
  )
}
