// The Account (S1, SD3): the kit's frame (uma-platform P56) with this game's content: the trainer name, the active
// tier's wallet (H35), Appearance, push notifications, the info rows and sign-out. A hidden Town place (D31).
import { useAuth } from '@luismlorenzana/uma-kit/auth'
import { AccountPage as AccountFrame } from '@luismlorenzana/uma-kit/places'
import { UiMark } from '@luismlorenzana/uma-kit/ui'
import { TRAINER_NAME_MAX, normalizeTrainerName } from '@rpg/domain'
import { APP_BUILD_ID } from '../../app/build'
import { useMaster } from '../../master/master'
import { NotificationsCard } from '../../push/NotificationsCard'
import { renameAccount, resetGame, useActiveTier, useGame, useWorld } from '../../save/game'
import { LaurelIcon, ShardIcon, TicketIcon } from '../../ui/icons'

export default function AccountPage() {
  const save = useGame((s) => s.save)
  const tier = useActiveTier()
  const wallet = useWorld()?.wallet
  const sync = useGame((s) => s.sync)
  const lastSyncedAt = useGame((s) => s.lastSyncedAt)
  const master = useMaster()
  const auth = useAuth()
  if (!save) return null
  const speed = { icon: <UiMark mark="currency/speed-ticket" scale={2} fallback={<TicketIcon size={22} />} />, value: wallet?.timeTickets ?? 0, label: 'Speed Tickets' }
  const sweep = { icon: <span className="flex h-8 items-center"><TicketIcon size={22} /></span>, value: wallet?.sweepTickets ?? 0, label: 'Sweep Tickets' }
  const laurels = { icon: <UiMark mark="currency/laurel" scale={2} fallback={<LaurelIcon size={22} />} />, value: wallet?.laurels ?? 0, label: 'Laurels' }
  // Uma Tickets and Shards are Tier 1's only (D5); a later tier shows its tickets instead.
  const shown = tier === 1 ? [
    { icon: <UiMark mark="currency/uma-ticket" scale={2} fallback={<TicketIcon size={22} />} />, value: wallet?.unlockTickets ?? 0, label: 'Uma Tickets' },
    { icon: <span className="flex h-8 items-center"><ShardIcon size={20} /></span>, value: wallet?.shards ?? 0, label: 'Uma Shards' },
    laurels,
  ] : [laurels, speed, sweep]
  const umas = Object.values(save.tierWorlds).reduce((n, w) => n + Object.keys(w.umas).length, 0)
  const cloud = sync === 'synced' && lastSyncedAt ? `Synced ${new Date(lastSyncedAt).toLocaleTimeString()}`
    : sync === 'syncing' ? 'Syncing…' : sync === 'offline' ? 'Offline' : sync === 'error' ? 'Paused' : '—'
  return (
    <AccountFrame
      words={{ name: 'Trainer name', wallet: `Tier ${tier} wallet` }}
      rename={{ value: save.account.trainerName, maxLength: TRAINER_NAME_MAX, normalize: normalizeTrainerName, onSave: renameAccount }}
      wallet={shown}
      notifications={<NotificationsCard />}
      info={[
        { label: 'Tier world', value: `Tier ${tier}` },
        { label: 'Trainer since', value: new Date(save.account.createdAt).toLocaleDateString() },
        { label: 'Umas unlocked', value: `${umas} / ${master.status === 'ready' ? master.view.roster.length : '…'}` },
        { label: 'Cloud save', value: cloud },
        { label: 'Game data', value: master.status === 'ready' ? master.view.manifest.version : master.status === 'error' ? 'Not loaded' : 'Loading…' },
        { label: 'App build', value: APP_BUILD_ID },
      ]}
      onSignOut={auth.authRequired ? async () => { resetGame(); await auth.signOut() } : undefined}
    />
  )
}
