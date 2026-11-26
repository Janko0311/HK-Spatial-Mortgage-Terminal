import { useMemo, useState } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { REGION_MARKET_DATA, type RegionKey } from '../map/regionData'

type Props = {
  selectedRegion: RegionKey | null
}

export function PropertyTrendChart({ selectedRegion }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)
  const data = selectedRegion ? REGION_MARKET_DATA[selectedRegion] : null

  const chart = useMemo(() => {
    if (!data) return null
    const values = data.priceHistory
    const width = 760
    const height = 280
    const pad = { top: 20, right: 24, bottom: 34, left: 58 }
    const min = Math.min(...values.map((p) => p.value))
    const max = Math.max(...values.map((p) => p.value))
    const range = Math.max(max - min, 1)
    const x = (i: number) =>
      pad.left + (i / (values.length - 1)) * (width - pad.left - pad.right)
    const y = (v: number) =>
      height - pad.bottom - ((v - min) / range) * (height - pad.top - pad.bottom)
    const points = values.map((p, i) => ({ ...p, x: x(i), y: y(p.value) }))
    const line = points.map((p) => `${p.x},${p.y}`).join(' ')
    const area = `${pad.left},${height - pad.bottom} ${line} ${width - pad.right},${height - pad.bottom}`
    const ticks = Array.from({ length: 4 }, (_, i) => {
      const value = min + (range * i) / 3
      return { value, y: y(value) }
    })
    const first = values[0].value
    const last = values[values.length - 1].value
    const change = last - first
    const changePct = (change / first) * 100
    return { width, height, pad, points, line, area, ticks, min, max, change, changePct }
  }, [data])

  if (!data || !chart) {
    return (
      <div className="glass-soft rounded-[32px] p-6">
        <div className="section-eyebrow">Property Trend</div>
        <h3 className="mt-3 text-2xl font-semibold text-white">Regional Price Movement</h3>
        <div className="mt-6 rounded-2xl border border-white/8 bg-white/5 p-8 text-center text-sm text-slate-400">
          Select a region to view 12-month HK$/sq.ft trend data.
        </div>
      </div>
    )
  }

  const up = chart.change >= 0
  const active = hovered !== null ? chart.points[hovered] : chart.points[chart.points.length - 1]
  const gradId = `trend-${selectedRegion}`

  return (
    <div className="glass-soft rounded-[32px] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="section-eyebrow">Property Trend</div>
          <h3 className="mt-3 text-2xl font-semibold text-white">{data.title} Price Index</h3>
          <p className="mt-1 text-sm text-slate-400">12-month average transaction price (demo visualization)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Current</div>
            <div className="mono mt-1 text-lg font-semibold text-white">HK$ {active.value.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500">{active.month}</div>
          </div>
          <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3 ${up ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-rose-400/20 bg-rose-400/10 text-rose-300'}`}>
            {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <div>
              <div className="mono text-sm font-semibold">{up ? '+' : ''}{chart.changePct.toFixed(1)}%</div>
              <div className="text-[11px] opacity-80">12M change</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/8 bg-[#0b1224]/50 p-4">
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className="w-full"
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={up ? 'rgba(52,211,153,0.28)' : 'rgba(251,113,133,0.28)'} />
              <stop offset="100%" stopColor="rgba(0,240,255,0)" />
            </linearGradient>
          </defs>

          {chart.ticks.map((t, i) => (
            <g key={i}>
              <line x1={chart.pad.left} x2={chart.width - chart.pad.right} y1={t.y} y2={t.y} stroke="rgba(255,255,255,0.07)" strokeDasharray="4 6" />
              <text x={chart.pad.left - 10} y={t.y + 4} textAnchor="end" fontSize="11" fill="rgba(148,163,184,0.9)">
                {(t.value / 1000).toFixed(1)}k
              </text>
            </g>
          ))}

          <polygon points={chart.area} fill={`url(#${gradId})`} />
          <polyline
            points={chart.line}
            fill="none"
            stroke={up ? '#34D399' : '#FB7185'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 8px ${up ? 'rgba(52,211,153,0.45)' : 'rgba(251,113,133,0.45)'})` }}
          />

          {chart.points.map((p, i) => (
            <g key={p.month} onMouseEnter={() => setHovered(i)}>
              <rect x={p.x - 24} y={chart.pad.top} width={48} height={chart.height - chart.pad.top - chart.pad.bottom} fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={hovered === i ? 5 : 3}
                fill={hovered === i ? '#E0F2FE' : up ? '#34D399' : '#FB7185'}
                stroke="rgba(10,18,36,0.9)"
                strokeWidth="2"
              />
              <text x={p.x} y={chart.height - 12} textAnchor="middle" fontSize="11" fill="rgba(148,163,184,0.9)">
                {p.month}
              </text>
            </g>
          ))}

          {hovered !== null && (
            <line
              x1={chart.points[hovered].x}
              x2={chart.points[hovered].x}
              y1={chart.pad.top}
              y2={chart.height - chart.pad.bottom}
              stroke="rgba(103,232,249,0.35)"
              strokeDasharray="4 4"
            />
          )}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
        <div className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5">High: <span className="mono text-slate-200">HK$ {chart.max.toLocaleString()}</span></div>
        <div className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5">Low: <span className="mono text-slate-200">HK$ {chart.min.toLocaleString()}</span></div>
        <div className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5">Unit: <span className="text-slate-200">HK$ / sq.ft</span></div>
      </div>
    </div>
  )
}
