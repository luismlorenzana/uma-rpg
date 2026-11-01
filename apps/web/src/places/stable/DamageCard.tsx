// Details' Damage section (H140, D279; profile-polish §2): one row a weapon, every source on it, each number in its source's color.
// The rows are `damage-view.ts`'.
import type { DamageSheet } from '@rpg/domain'
import { Fragment } from 'react'
import { KindMark } from '../../battle/labels'
import * as copy from './copy'
import { damageKeyRows, damageRows, PART_COLOR, SOURCE_COLOR, type DamageRow } from './damage-view'

export function DamageCard({ sheet }: { sheet: DamageSheet }) {
  return (
    <section data-damage>
      <div className="mb-1 flex min-h-[22px] items-center justify-between gap-2">
        <h3 className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">{copy.details.damage}</h3>
        {sheet.bosses > 0 && <span className="text-[11px] font-bold" style={{ color: SOURCE_COLOR.accessory }}>{copy.bosses(sheet.bosses)}</span>}
      </div>
      <ul className="divide-y divide-hairline">
        {damageRows(sheet).map((row) => <Row key={row.kind} row={row} />)}
      </ul>
      <p className="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-0.5 text-[11px] text-ink-soft" aria-hidden="true">
        {damageKeyRows(sheet).map(({ source, label }) => (
          <span key={source} className="inline-flex items-center gap-1"><i className="block size-2 rounded-[2px]" style={{ background: SOURCE_COLOR[source] }} />{label}</span>
        ))}
      </p>
    </section>
  )
}

function Row({ row }: { row: DamageRow }) {
  return (
    <li className="grid grid-cols-[30px_auto_1fr] items-center gap-x-2 py-1.5" role="img" aria-label={row.label} data-damage-row={row.kind}>
      <span className="row-span-2 flex justify-center"><KindMark kind={row.kind} size={26} /></span>
      <span className="min-w-[46px] text-right font-display text-[24px] font-extrabold leading-none tabular-nums">{row.total}</span>
      <span className="whitespace-nowrap text-[14px] font-semibold tabular-nums text-ink-soft">
        ({row.parts.map((part, index) => <Fragment key={part.source}>{index > 0 && ' '}<span style={{ color: SOURCE_COLOR[part.source] }}>{part.text}</span></Fragment>)})
      </span>
      <span className="col-span-2 col-start-2 mt-1 flex h-1 gap-0.5" style={{ width: `${row.width * 100}%` }} aria-hidden="true">
        {row.parts.map((part) => <i key={part.source} className="block h-full min-w-0.5 first:rounded-l-sm last:rounded-r-sm" style={{ flex: `${part.value} 0 0`, background: SOURCE_COLOR[part.source] }} />)}
      </span>
    </li>
  )
}

/** A stat's parts, each in its source's color. */
export function StatParts({ parts }: { parts: readonly copy.StatPart[] }) {
  return <>{parts.map((part, index) => <Fragment key={part.source}>{index > 0 && ' · '}<span style={{ color: PART_COLOR[part.source] }}>{part.text}</span></Fragment>)}</>
}
