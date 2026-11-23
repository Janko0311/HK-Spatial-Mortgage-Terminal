import { useState } from 'react'
import type { RegionKey } from '../../components/map/regionData'
import { Sidebar } from '../../components/layout/Sidebar'
import { DashboardTopBar } from '../../components/layout/DashboardTopBar'
import { KpiGrid } from '../../components/dashboard/KpiGrid'
import { RegionControlCard } from '../../components/dashboard/RegionControlCard'
import { MarketIntelligenceCard } from '../../components/dashboard/MarketIntelligenceCard'
import { MortgageActionCard } from '../../components/dashboard/MortgageActionCard'
import { SpatialCanvas } from '../../components/map/SpatialCanvas'
import { MortgageDrawer } from '../../components/mortgage/MortgageDrawer'

export function DashboardPage() {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="site-shell">
      <div className="dashboard-layout">
        <Sidebar />

        <div className="space-y-5">
          <DashboardTopBar onBorrowClick={() => setDrawerOpen(true)} />
          <KpiGrid />

          <section className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_340px]">
            <RegionControlCard
              selectedRegion={selectedRegion}
              onSelect={setSelectedRegion}
            />

            <div className="glass-card rounded-[32px] p-4">
              <div className="mb-4 flex items-center justify-between px-2">
                <div>
                  <div className="section-eyebrow">Spatial Platform</div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Hong Kong 3D Visualization
                  </h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  Interactive
                </div>
              </div>

              <SpatialCanvas
                selectedRegion={selectedRegion}
                onSelectRegion={setSelectedRegion}
              />
            </div>

            <MarketIntelligenceCard selectedRegion={selectedRegion} />
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <MortgageActionCard onOpen={() => setDrawerOpen(true)} />

            <div className="glass-soft rounded-[32px] p-6">
              <div className="section-eyebrow">Platform Notes</div>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Commercial card-based structure
              </h3>

              <div className="mt-5 space-y-3">
                {[
                  'Separate landing and dashboard pages',
                  'Frosted glass cards with larger radius',
                  'Aurora background for visual depth',
                  '3D model embedded in a featured product card',
                  'Dedicated market and mortgage cards beside the map',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <MortgageDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedRegion={selectedRegion}
      />
    </div>
  )
}
