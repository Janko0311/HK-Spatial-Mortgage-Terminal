import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { REGION_MARKET_DATA, type RegionKey } from './regionData'

type Props = {
  selectedRegion: RegionKey | null
  onClose: () => void
  onCalculateMortgage: (region: RegionKey) => void
}

function Sparkline({ values }: { values: number[] }) {
  const width = 280
  const height = 72
  const pad = 6
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = Math.max(max - min, 1)
  const points = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (width - pad * 2)
      const y = height - pad - ((v - min) / range) * (height - pad * 2)
      return `${x},${y}`
    })
    .join(' ')
  const area = `${pad},${height - pad} ${points} ${width - pad},${height - pad}`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-20 w-full">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,240,255,0.35)" />
          <stop offset="100%" stopColor="rgba(0,240,255,0)" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#sparkFill)" />
      <polyline
        points={points}
        fill="none"
        stroke="#00F0FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.55))' }}
      />
      {values.map((v, i) => {
        const x = pad + (i / (values.length - 1)) * (width - pad * 2)
        const y = height - pad - ((v - min) / range) * (height - pad * 2)
        return <circle key={i} cx={x} cy={y} r={i === values.length - 1 ? 3.5 : 2.2} fill={i === values.length - 1 ? '#67e8f9' : 'rgba(103,232,249,0.7)'} />
      })}
    </svg>
  )
}

function Metric({ label, value, sub, subUp }: { label: string; value: string; sub?: string; subUp?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className="mt-1.5 text-[15px] font-semibold text-white">{value}</div>
      {sub && <div className={`mt-1 text-[11px] ${subUp ? 'text-emerald-300' : 'text-rose-300'}`}>{sub}</div>}
    </div>
  )
}

export function RegionInfoCard({ selectedRegion, onClose, onCalculateMortgage }: Props) {
  const data = selectedRegion ? REGION_MARKET_DATA[selectedRegion] : null

  return (
    <AnimatePresence>
      {selectedRegion && data && (
        <motion.aside
          key={selectedRegion}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 28 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="absolute right-6 top-1/2 z-20 w-[340px] -translate-y-1/2 rounded-2xl p-5 text-white"
          style={{
            background: 'rgba(10, 18, 36, 0.78)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(0, 240, 255, 0.28)',
            boxShadow: '0 0 0 1px rgba(0,240,255,0.06), 0 20px 50px rgba(0,0,0,0.45)',
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full border border-white/10 bg-white/5 p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Close region info"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="pr-8">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-300/90">
              Regional Market Intel
            </div>
            <div className="mt-2 flex items-center gap-2">
              <h3 className="text-xl font-semibold tracking-tight text-white">{data.title}</h3>
              <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-cyan-200">
                {data.status}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Metric label="Avg. Price / sq.ft" value={data.avgPrice} sub={data.avgPriceTrend} subUp={data.avgPriceTrendUp} />
            <Metric label="Est. 500 sq.ft Unit" value={data.estUnit} />
            <Metric label="Avg. Mortgage / LTV" value={data.mortgageRate} sub={data.ltv} subUp />
            <Metric label="Est. Monthly (30yr)" value={data.monthlyPayment} />
          </div>

          <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.03] p-3">
            <div className="mb-1 flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">6-Month Price Trend</div>
              <div className="text-[10px] text-cyan-300/80">HK$ / sq.ft</div>
            </div>
            <Sparkline values={data.trend} />
          </div>

          <button
            onClick={() => onCalculateMortgage(selectedRegion)}
            className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-[#041018] transition hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #00F0FF 0%, #38BDF8 55%, #60A5FA 100%)',
              boxShadow: '0 0 24px rgba(0,240,255,0.25)',
            }}
          >
            Calculate Mortgage for {data.title} →
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
