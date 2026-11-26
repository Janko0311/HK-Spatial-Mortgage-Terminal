import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { REGION_MARKET_DATA, type RegionKey } from '../map/regionData'
import { ConnectWalletButton } from '../web3/ConnectWalletButton'
import { BorrowButton } from '../web3/BorrowButton'

type Props = {
  onBorrowClick: () => void
  onSelectRegion?: (region: RegionKey) => void
}

type SearchItem = {
  id: string
  region: RegionKey
  title: string
  category: string
  metric: string
  sub: string
  trend: number[]
  keywords: string
}

function Sparkline({ values }: { values: number[] }) {
  const w = 84
  const h = 28
  const pad = 3
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = Math.max(max - min, 1)
  const pts = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2)
      const y = h - pad - ((v - min) / range) * (h - pad * 2)
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-[84px] shrink-0">
      <polyline points={pts} fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(56,189,248,0.45))' }} />
    </svg>
  )
}

function fuzzyMatch(query: string, text: string) {
  const q = query.toLowerCase().trim()
  if (!q) return true
  const t = text.toLowerCase()
  if (t.includes(q)) return true
  let i = 0
  for (const ch of t) {
    if (ch === q[i]) i += 1
    if (i === q.length) return true
  }
  return false
}

export function DashboardTopBar({ onBorrowClick, onSelectRegion }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const items = useMemo<SearchItem[]>(() => {
    return (Object.keys(REGION_MARKET_DATA) as RegionKey[]).flatMap((key) => {
      const d = REGION_MARKET_DATA[key]
      return [
        {
          id: `${key}-region`,
          region: key,
          title: d.title,
          category: 'Region',
          metric: `Avg. Property ${d.estUnit}`,
          sub: `${d.avgPriceTrend} · ${d.demand} demand`,
          trend: d.trend,
          keywords: `${d.title} region ${d.status} ${d.demand}`,
        },
        {
          id: `${key}-loan`,
          region: key,
          title: `${d.title} Loan Metrics`,
          category: 'Loan Metric',
          metric: d.monthlyPayment,
          sub: `${d.mortgageRate} · ${d.ltv}`,
          trend: d.trend,
          keywords: `${d.title} loan mortgage rate ltv monthly payment`,
        },
      ]
    })
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim()
    const list = q ? items.filter((i) => fuzzyMatch(q, `${i.title} ${i.category} ${i.metric} ${i.sub} ${i.keywords}`)) : items.slice(0, 4)
    return list.slice(0, 6)
  }, [items, query])

  useEffect(() => {
    setActiveIndex(0)
  }, [query, open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const selectItem = (item: SearchItem) => {
    onSelectRegion?.(item.region)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  return (
    <div className="glass-card relative z-50 rounded-[28px] px-5 py-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="section-eyebrow">Overview</div>
          <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
            HK Spatial Mortgage Dashboard
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div ref={rootRef} className="relative">
            <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-4 py-2.5 text-sm text-slate-300 focus-within:border-cyan-400/35">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setOpen(true)
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => {
                  if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) setOpen(true)
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)))
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setActiveIndex((i) => Math.max(i - 1, 0))
                  }
                  if (e.key === 'Enter' && filtered.length > 0) {
                    e.preventDefault()
                    selectItem(filtered[Math.min(activeIndex, filtered.length - 1)])
                  }
                  if (e.key === 'Escape') setOpen(false)
                }}
                placeholder="Search regions, loans, or metrics..."
                className="w-[280px] bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
              />
              <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400 md:inline">⌘K</kbd>
            </div>

            {open && (
              <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-[420px] overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#0B1120]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                {filtered.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-slate-400">No results for "{query}"</div>
                ) : (
                  filtered.map((item, idx) => {
                    const active = idx === activeIndex
                    return (
                      <button
                        key={item.id}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectItem(item)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition ${active ? 'bg-cyan-400/10 shadow-[inset_0_0_0_1px_rgba(0,240,255,0.18)]' : 'hover:bg-white/5'}`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium text-white">{item.title}</span>
                            <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-cyan-200/90">{item.category}</span>
                          </div>
                          <div className="mt-1 text-xs text-slate-300">{item.metric}</div>
                          <div className="mt-0.5 text-[11px] text-slate-500">{item.sub}</div>
                        </div>
                        <Sparkline values={item.trend} />
                      </button>
                    )
                  })
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ConnectWalletButton />
            <BorrowButton onClick={onBorrowClick} />
          </div>
        </div>
      </div>
    </div>
  )
}
