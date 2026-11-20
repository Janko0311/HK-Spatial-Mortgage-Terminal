import { Activity, Building2, Globe2, ShieldCheck } from 'lucide-react'

const cards = [
  {
    title: 'Mortgage Readiness',
    value: '88%',
    note: 'Pre-underwriting frontend flow coverage',
    icon: ShieldCheck,
  },
  {
    title: 'Spatial Regions',
    value: '03',
    note: 'Hong Kong Island, Kowloon, New Territories',
    icon: Globe2,
  },
  {
    title: 'Market Pulse',
    value: '+12.4%',
    note: 'Demo mortgage interaction growth',
    icon: Activity,
  },
  {
    title: 'Property Layer',
    value: '3D',
    note: 'Procedural terrain and tower clusters',
    icon: Building2,
  },
]

export function KpiGrid() {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <div key={card.title} className="glass-soft rounded-[28px] p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">{card.title}</div>
              <div className="rounded-full bg-white/5 p-2">
                <Icon className="h-4 w-4 text-sky-300" />
              </div>
            </div>

            <div className="mt-5 kpi-value text-white">{card.value}</div>
            <div className="mt-2 text-sm leading-6 text-slate-300">{card.note}</div>
          </div>
        )
      })}
    </section>
  )
}
