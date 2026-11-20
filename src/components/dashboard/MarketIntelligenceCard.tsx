import { BarChart3 } from 'lucide-react'
import type { RegionKey } from '../map/regionData'

type Props = {
  selectedRegion: RegionKey | null
}

export function MarketIntelligenceCard({ selectedRegion }: Props) {
  const data =
    selectedRegion === 'hong-kong-island'
      ? {
          title: 'Hong Kong Island',
          avg: 'HK$ 18.2M',
          ltv: '58%',
          demand: 'High',
          note: 'Prime district demand remains strongest around the core finance corridor.',
        }
      : selectedRegion === 'kowloon'
      ? {
          title: 'Kowloon',
          avg: 'HK$ 11.4M',
          ltv: '64%',
          demand: 'High',
          note: 'Dense urban mix and transport access sustain healthy mortgage demand.',
        }
      : selectedRegion === 'new-territories'
      ? {
          title: 'New Territories',
          avg: 'HK$ 8.9M',
          ltv: '69%',
          demand: 'Moderate',
          note: 'Wider supply and newer development areas support stronger affordability.',
        }
      : {
          title: 'Market Intelligence',
          avg: 'HK$ --',
          ltv: '--',
          demand: '--',
          note: 'Select a region to inspect pricing, indicative LTV, and demand signals.',
        }

  return (
    <div className="glass-soft rounded-[32px] p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="section-eyebrow">Market Intelligence</div>
          <h3 className="mt-3 text-2xl font-semibold text-white">{data.title}</h3>
        </div>

        <div className="rounded-full bg-white/5 p-2">
          <BarChart3 className="h-4 w-4 text-violet-300" />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
          <div className="text-xs text-slate-400">Average Property</div>
          <div className="mt-2 text-xl font-semibold text-white">{data.avg}</div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
          <div className="text-xs text-slate-400">Indicative LTV</div>
          <div className="mt-2 text-xl font-semibold text-white">{data.ltv}</div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
          <div className="text-xs text-slate-400">Demand Signal</div>
          <div className="mt-2 text-xl font-semibold text-white">{data.demand}</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/8 bg-white/5 p-4 text-sm leading-6 text-slate-300">
        {data.note}
      </div>
    </div>
  )
}
