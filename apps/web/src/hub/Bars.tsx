// uma-rpg's top and bottom bars on uma-kit (D147): the same bars as uma-racer, with this game's currencies, tabs and
// words. Top: the trainer's initial with the Tier crest; Laurels, Speed Tickets, Uma Tickets with Uma Shards toward the
// next. Bottom: Town Hall · Learning · Battle (raised) · Wilds · Menu.
import { HUB_PAGE_NAMES, SHARDS_PER_TICKET, type HubPage } from '@rpg/domain'
import { AccountBar, BottomBar, withParam, type BarTab, type CurrencyChip } from '@luismlorenzana/uma-kit/shell'
import { BookIcon, HomeIcon, PickaxeIcon, SwordsIcon, type IconComponent } from '@luismlorenzana/uma-kit/ui'
import { useLocation } from 'react-router'
import { useGame, useWorld } from '../save/game'
import { LaurelIcon } from '../ui/icons'
import { useNow } from '../ui/useNow'
import { readyOnPage } from './ready'

export function RpgAccountBar() {
  const save = useGame((s) => s.save)
  const sync = useGame((s) => s.sync)
  const wallet = save?.tierWorlds['1']?.wallet ?? null
  const name = save?.account.trainerName ?? ''
  const shards = wallet ? Math.min(wallet.shards, SHARDS_PER_TICKET) : 0
  const chips: CurrencyChip[] = [
    { key: 'laurels', mark: 'currency/laurel', fallback: <LaurelIcon size={16} />, value: wallet?.laurels ?? null, to: '/town/exchange', label: `${wallet?.laurels ?? 0} Laurels` },
    { key: 'speed', mark: 'currency/speed-ticket', value: wallet?.timeTickets ?? null, to: '/town/exchange', label: `${wallet?.timeTickets ?? 0} Speed Tickets` },
    {
      key: 'uma', mark: 'currency/uma-ticket', value: wallet?.unlockTickets ?? null, to: '/town/stable',
      label: `${wallet?.unlockTickets ?? 0} Uma Tickets, ${shards} of ${SHARDS_PER_TICKET} Uma Shards to the next`,
      extra: <span className="text-ink-soft">{' · '}{shards}/{SHARDS_PER_TICKET}</span>,
    },
  ]
  return (
    <AccountBar
      initial={name.slice(0, 1).toUpperCase()}
      tier={1}
      account={{ to: '/town/account', label: `Account: ${name}, Tier 1` }}
      chips={chips}
      sync={sync === 'offline' ? { state: 'offline', text: 'Offline', label: 'Offline: changes sync when you’re back', to: '/town/account' }
        : sync === 'error' ? { state: 'paused', text: 'Sync paused', label: 'Sync paused', to: '/town/account' } : undefined}
    />
  )
}

const TABS: readonly { page: HubPage; Icon: IconComponent; raised?: boolean }[] = [
  { page: 'town', Icon: HomeIcon },
  { page: 'learning', Icon: BookIcon },
  { page: 'battle', Icon: SwordsIcon, raised: true },
  { page: 'wilds', Icon: PickaxeIcon },
]

export function RpgBottomBar({ active }: { active: HubPage | null }) {
  const world = useWorld()
  const now = useNow(15_000)
  const location = useLocation()
  const tabs: BarTab[] = TABS.map(({ page, Icon, raised }) => {
    const badge = page === 'wilds' ? readyOnPage(world, now, page) : 0
    return { key: page, to: `/${page}`, label: HUB_PAGE_NAMES[page], Icon, raised, active: page === active, badge, badgeLabel: `${HUB_PAGE_NAMES[page]}, ${badge} ready` }
  })
  return <BottomBar label="Pages" tabs={tabs} menu={{ to: withParam(location, 'sheet', 'menu'), label: 'Every place', text: 'Menu' }} />
}
