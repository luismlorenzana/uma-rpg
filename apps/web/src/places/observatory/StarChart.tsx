// The Stars tab's chart (H142; profile-polish §3): every body a figure of numbered stars on a night sky. Stars, links and labels
// are the SVG; crests sit over it in real buttons, so a body's target is a true 44 pt and H144's pixel art keeps whole pixels.
// The geometry and the states are `star-chart.ts`'.
import type { StarMap } from '@rpg/domain'
import { bodyLabel, bodyName } from '../stable/copy'
import { StarCrest } from './star-marks'
import {
  bodyNode, CHART_BODIES, CHART_H, CHART_W, chartLinks, openCount, ORBIT_ARCS, SKY, STAR_R, STAR_TARGET, starState, type ChartBody, type ChartStar, type StarState,
} from './star-chart'
import { mapNodeTitle } from './stars-view'

const ROMAN = ['I', 'II', 'III', 'IV', 'V'] as const
const SKY_INK = '#101a24', STAR_FILL = '#16222e', STAR_INK = '#f2f6fa', LATER_RING = '#5b6b7e', LATER_INK = '#93a3b5', COUNT_INK = '#a8b6c6', READY_DOT = '#4fb37a'

interface ChartProps { map: StarMap; ready: (id: string) => boolean; templateType: string; onNode: (id: string) => void }

export function StarChart({ map, ready, templateType, onNode }: ChartProps) {
  return (
    <div className="relative overflow-hidden rounded-md" data-star-chart>
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="block h-auto w-full" role="group" aria-label="Planet-and-moons map">
        <defs>
          <radialGradient id="star-sky" cx="50%" cy="58%" r="72%"><stop offset="0" stopColor="#1c2b3c" /><stop offset="1" stopColor={SKY_INK} /></radialGradient>
          {CHART_BODIES.map((b) => <radialGradient key={b.id} id={`star-hub-${b.id}`}><stop offset="0" stopColor={b.color} stopOpacity=".28" /><stop offset="1" stopColor={b.color} stopOpacity=".06" /></radialGradient>)}
        </defs>
        <rect width={CHART_W} height={CHART_H} fill="url(#star-sky)" />
        {SKY.map(([x, y, r, opacity], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={opacity} />)}
        {ORBIT_ARCS.map((d) => <path key={d} d={d} fill="none" stroke="#fff" strokeOpacity=".13" strokeDasharray="1 6" strokeLinecap="round" />)}
        {CHART_BODIES.map((b) => <Body key={b.id} body={b} map={map} ready={ready} templateType={templateType} onNode={onNode} />)}
      </svg>
      {CHART_BODIES.map((b) => {
        const open = openCount(map, b)
        return (
          <button key={b.id} type="button" onClick={() => onNode(bodyNode(map, b))} aria-label={bodyLabel(b.id, templateType, open, b.stars.length)} data-map-body={b.id}
            className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full" style={{ left: `${(b.hub[0] / CHART_W) * 100}%`, top: `${(b.hub[1] / CHART_H) * 100}%` }}>
            <StarCrest body={b.id} color={b.color} />
          </button>
        )
      })}
    </div>
  )
}

function Body({ body, map, ready, templateType, onNode }: ChartProps & { body: ChartBody }) {
  const open = openCount(map, body), full = open === body.stars.length
  return (
    <g data-body={body.id}>
      {chartLinks(body, map).map((link) => <path key={link.key} d={link.path} fill="none" strokeLinecap="round" {...(link.lit
        ? { stroke: body.color, strokeWidth: 2.5 }
        : link.closing ? { stroke: '#fff', strokeOpacity: 0.1, strokeWidth: 1, strokeDasharray: '1 5' } : { stroke: '#fff', strokeOpacity: 0.26, strokeWidth: 1.25, strokeDasharray: '3 5' })} />)}
      {body.hubRadius > 0 && <circle cx={body.hub[0]} cy={body.hub[1]} r={body.hubRadius} fill={`url(#star-hub-${body.id})`} stroke={body.color} strokeOpacity={full ? 0.9 : 0.35} />}
      {body.stars.map((star) => <Star key={star.id} star={star} color={body.color} state={starState(map, star.id, ready)} title={mapNodeTitle(star.id, templateType)} onTap={() => onNode(star.id)} />)}
      <text x={body.label.x} y={body.label.y} textAnchor={body.label.anchor} fontSize="12" fontWeight="700" fill={body.color} className="font-display">
        {bodyName(body.id, templateType)}<tspan dx="5" fill={COUNT_INK} fontWeight="600">{open}/{body.stars.length}</tspan>
      </text>
    </g>
  )
}

function Star({ star, color, state, title, onTap }: { star: ChartStar; color: string; state: StarState; title: string; onTap: () => void }) {
  const { x, y } = star
  const ink = state === 'open' ? SKY_INK : state === 'later' ? LATER_INK : STAR_INK
  return (
    <g role="button" tabIndex={0} aria-label={`${title}, ${state}`} data-map-node={star.id} data-star-state={state} onClick={onTap} className="star-tap cursor-pointer"
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onTap() } }}>
      <circle cx={x} cy={y} r={STAR_TARGET} fill="transparent" />
      {state === 'ready' && <circle className="star-pulse" cx={x} cy={y} r="15" fill="none" stroke={color} strokeWidth="2" pointerEvents="none" />}
      {state === 'open' && <circle cx={x} cy={y} r={STAR_R + 4} fill={color} opacity=".2" pointerEvents="none" />}
      <circle cx={x} cy={y} r={STAR_R} fill={state === 'open' ? color : STAR_FILL} stroke={state === 'later' ? LATER_RING : color} strokeWidth={state === 'ready' ? 2 : 1.5} pointerEvents="none" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={ink} pointerEvents="none" className="font-display">{ROMAN[star.numeral - 1]}</text>
      {state === 'ready' && <circle cx={x + 10} cy={y - 10} r="5" fill={READY_DOT} stroke={SKY_INK} strokeWidth="2" pointerEvents="none" />}
      <circle className="star-focus" cx={x} cy={y} r={STAR_R + 3} fill="none" stroke="#fff" strokeWidth="2" pointerEvents="none" />
    </g>
  )
}
