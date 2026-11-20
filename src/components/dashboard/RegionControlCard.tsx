import type { RegionKey } from '../map/regionData'

type Props = {
  selectedRegion: RegionKey | null
  onSelect: (region: RegionKey) => void
}

const items: Array<{ id: RegionKey; label: string; desc: string }> = [
  {
    id: 'new-territories',
    label: 'New Territories',
    desc: 'Broader land coverage and suburban growth corridors.',
  },
  {
    id: 'kowloon',
    label: 'Kowloon',
    desc: 'Dense mid-city urban strip with transport-linked clusters.',
  },
  {
    id: 'hong-kong-island',
    label: 'Hong Kong Island',
    desc: 'Premium skyline and financial district concentration.',
  },
]

export function RegionControlCard({ selectedRegion, onSelect }: Props) {
  return (
    <div className="glass-soft rounded-[32px] p-5">
      <div className="section-eyebrow">Region Control</div>
      <h3 className="mt-3 text-xl font-semibold text-white">Select a region</h3>

      <div className="mt-5 space-y-3">
        {items.map((item) => {
          const active = selectedRegion === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                active
                  ? 'border-sky-300/20 bg-sky-400/10'
                  : 'border-white/8 bg-white/5 hover:bg-white/8'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white">{item.label}</div>
                {active && (
                  <div className="text-[11px] uppercase tracking-[0.18em] text-sky-300">
                    Active
                  </div>
                )}
              </div>

              <div className="mt-2 text-sm leading-6 text-slate-300">
                {item.desc}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
