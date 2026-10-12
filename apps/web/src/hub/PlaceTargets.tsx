// The tappable, accessible layer over the Phaser map (D33): one button per place at its registry position, with its
// name, its Uma slots (the face of whoever works there, ringed by her job's progress, D22; a hall's four Heroes, D106) and
// the slice badge. The canvas underneath only draws.
import {
  CURRENT_SLICE, facilityOf, facilitySpec, hallClass, HERO_LIMIT_IDS, heroLimitClass, isOpen, jobFinished, jobProgress, type Place, type TierWorld,
} from '@rpg/domain'
import { useEffect, useRef, useState } from 'react'
import { AtlasSprite } from '../master/art'
import { useMaster } from '../master/master'
import { useWorld } from '../save/game'
import { LockIcon } from '../ui/icons'
import { useNow } from '../ui/useNow'
import { BUILDING, hubDpr, hubGrid, placeAnchor } from './grid'

/** Places with something to collect. */
export function readyPlaces(world: TierWorld | null, now: string): Set<string> {
  const ready = new Set<string>()
  for (const [id, f] of Object.entries(world?.facilities ?? {})) {
    if (f.jobs.some((j) => j && (jobFinished(j, now) > j.collected || jobFinished(j, now) >= j.count))) ready.add(id)
  }
  return ready
}

export function PlaceTargets({ places, onOpen }: { places: Place[]; onOpen: (place: Place) => void }) {
  const world = useWorld()
  const now = useNow(15_000)
  const master = useMaster()
  const art = master.status === 'ready' ? master.view.art : null
  const ready = readyPlaces(world, now)
  // The map's grid, so each button sits on its building (the scene snaps buildings to the same grid).
  const root = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const grid = size && size.w > 0 ? hubGrid(size.w, size.h, hubDpr()) : null
  // The tap area covers the building's sprite; the slots and name hang below its ground line.
  const tapH = grid ? BUILDING.anchorY * grid.scale : 48
  const tapW = grid ? grid.tile * 3 : 80
  return (
    <div ref={root} className="absolute inset-0">
      {places.map((place) => {
        const open = isOpen(place, CURRENT_SLICE)
        const anchor = grid ? placeAnchor(place.at, grid) : null
        return (
          <button
            key={place.id}
            type="button"
            data-place={place.id}
            onClick={() => onOpen(place)}
            aria-label={open ? place.name : `${place.name}, not open yet`}
            className="group absolute flex w-32 flex-col items-center"
            style={anchor ? { left: anchor.x, top: anchor.y, transform: `translate(-50%, -${tapH}px)` } : { left: `${place.at.x * 100}%`, top: `${place.at.y * 100}%`, transform: 'translate(-50%, -36px)' }}
          >
            <span className="relative rounded-md transition group-active:scale-95 group-active:bg-white/10" style={{ width: tapW, height: tapH }}>
              {!open && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-sunken/90 text-locked ring-1 ring-hairline-strong">
                  <LockIcon size={12} />
                </span>
              )}
            </span>
            {open && ready.has(place.id) && (
              <span className="absolute right-6 top-0 rounded-full bg-success px-1.5 text-[10px] font-bold leading-4 text-white shadow-2">Ready</span>
            )}
            {place.slots > 0 && (
              <span className="mt-0.5 flex gap-1" aria-hidden="true">
                {open && world && hallClass(place.id) ? HERO_LIMIT_IDS.filter((id) => heroLimitClass(id) === hallClass(place.id)).map((id) => {
                  const hero = world.heroes[id]?.hero
                  return hero ? (
                    <span key={id} className="rounded-full bg-[#ffd84d] p-[2px]"><AtlasSprite art={art} family="outfit-icons" frameKey={hero} size={18} className="rounded-full" /></span>
                  ) : <span key={id} className="mt-[5px] size-2 rounded-full border border-white/50 bg-black/30" />
                }) : (open && world && facilitySpec(place.id) ? facilityOf(world, place.id).jobs : Array.from({ length: place.slots }, () => null)).map((job, i) =>
                  job ? (
                    <span key={i} className="rounded-full p-[2px]" style={{ background: `conic-gradient(#d6a23e ${jobProgress(job, now) * 360}deg, rgb(255 255 255 / 0.18) 0)` }}>
                      <AtlasSprite art={art} family="outfit-icons" frameKey={job.outfitId} size={18} className="rounded-full" />
                    </span>
                  ) : (
                    <span key={i} className="mt-[5px] size-2 rounded-full border border-white/50 bg-black/30" />
                  ),
                )}
              </span>
            )}
            <span className={`mt-0.5 max-w-full truncate rounded-full px-2 py-0.5 text-[11px] font-semibold leading-4 shadow-2 ${open ? 'bg-accent text-accent-ink' : 'bg-sunken/85 text-ink'}`}>
              {place.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
