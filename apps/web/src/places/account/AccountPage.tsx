// The Account (S1, SD3): the kit's frame (uma-platform P56) with this game's content: the trainer name, the active
// tier's wallet (H35), Appearance, push notifications, the achievements (H49), the info rows and sign-out. A hidden Town
// place (D31). A world with the Tier rework's grant (save v28, PP25; H80) keeps a row that reopens its sheet, and one with
// Classes v3's reset (save v32, CV30; H132) another, each for as long as its record lasts. This device's safety copies
// (D260) list here, each with its Restore.
import { useAuth } from '@luismlorenzana/uma-kit/auth'
import { AccountPage as AccountFrame } from '@luismlorenzana/uma-kit/places'
import { withParam } from '@luismlorenzana/uma-kit/shell'
import { UiMark } from '@luismlorenzana/uma-kit/ui'
import { TRAINER_NAME_MAX, normalizeTrainerName, type TierWorld } from '@rpg/domain'
import { useLocation, useNavigate } from 'react-router'
import { AchievementList } from '../../achievements/AchievementList'
import { APP_BUILD_ID } from '../../app/build'
import { classesRow, grantRow } from '../../grant/grant-lines'
import { useMaster } from '../../master/master'
import { NotificationsCard } from '../../push/NotificationsCard'
import { renameAccount, resetGame, useActiveTier, useGame, useWorld } from '../../save/game'
import { LaurelIcon, ShardIcon, TicketIcon } from '../../ui/icons'
import { SafetyCopies } from './SafetyCopies'
import { dateWords } from './safety-view'

export default function AccountPage() {
  const save = useGame((s) => s.save)
  const tier = useActiveTier()
  const world = useWorld()
  const wallet = world?.wallet
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
    : sync === 'syncing' ? 'Syncing…' : sync === 'offline' ? 'Offline'
    : sync === 'error' ? (lastSyncedAt ? `Paused · last ${dateWords(lastSyncedAt)}` : 'Paused') : '—'
  return (
    <AccountFrame
      words={{ name: 'Trainer name', wallet: `Tier ${tier} wallet` }}
      rename={{ value: save.account.trainerName, maxLength: TRAINER_NAME_MAX, normalize: normalizeTrainerName, onSave: renameAccount }}
      wallet={shown}
      notifications={<NotificationsCard />}
      sections={<>{world && <OneTimeRows world={world} />}<SafetyCopies /><AchievementList save={save} /></>}
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

/** The rows that reopen a world's one-time sheets: the Tier rework's grant, then Classes v3's reset, each while its record
 * lasts. */
export function OneTimeRows({ world }: { world: Pick<TierWorld, 'grant' | 'classesV3'> }) {
  return <>
    {world.grant && <SheetRow sheet="grant" row={grantRow(world.grant)} />}
    {world.classesV3 && <SheetRow sheet="classes" row={classesRow(world.classesV3)} />}
  </>
}

/** A row that reopens its sheet: "The Tier rework’s grant · 63,800 Speed Tickets" (`?sheet=grant`), "The classes are
 * rebuilt · 78 Class Manuals" (`?sheet=classes`). */
function SheetRow({ sheet, row }: { sheet: 'grant' | 'classes'; row: { label: string; value: string } }) {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <button type="button" onClick={() => navigate(withParam(location, 'sheet', sheet))} data-sheet-row={sheet}
      className="flex min-h-12 w-full items-center justify-between gap-3 rounded-md bg-raised px-3 py-2 text-left">
      <span className="text-[14px] font-semibold">{row.label}</span>
      <span className="flex items-center gap-1 text-[13px] text-ink-soft">{row.value} <span aria-hidden className="text-ink-faint">›</span></span>
    </button>
  )
}
