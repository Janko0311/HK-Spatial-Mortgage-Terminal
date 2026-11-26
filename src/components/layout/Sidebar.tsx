import { BarChart3, Building2, Home, Map, Rocket, Wallet } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const items = [
  { label: 'Landing', icon: Home, href: '/' },
  { label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
  { label: 'Spatial', icon: Map, href: '/spatial' },
  { label: 'Mortgage', icon: Building2, href: '/dashboard' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="glass-card rounded-[32px] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)]">
          A
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Aura Finance
          </div>
          <div className="mt-1 text-lg font-semibold text-white">
            Mortgage OS
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const active = location.pathname === item.href

          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                active
                  ? 'bg-sky-400/12 text-white shadow-[inset_0_0_0_1px_rgba(56,189,248,0.18)]'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </div>

      <div className="mt-4">
        <Link
          to="/deploy"
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
            location.pathname === '/deploy'
              ? 'bg-sky-400/12 text-white shadow-[inset_0_0_0_1px_rgba(56,189,248,0.18)]'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Rocket className="h-4 w-4" />
          Deploy
        </Link>
      </div>

      <div className="mt-8 rounded-[24px] border border-white/8 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <Wallet className="h-4 w-4 text-sky-300" />
          Frontend status
        </div>
        <div className="mt-3 text-sm leading-6 text-slate-300">
          Card-based UI shell active with aurora background and glass dashboard layout.
        </div>
      </div>
    </aside>
  )
}
