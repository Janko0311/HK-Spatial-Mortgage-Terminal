import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { RegionKey } from '../../components/map/regionData'
import { Sidebar } from '../../components/layout/Sidebar'
import { DashboardTopBar } from '../../components/layout/DashboardTopBar'
import { KpiGrid } from '../../components/dashboard/KpiGrid'
import { RegionControlCard } from '../../components/dashboard/RegionControlCard'
import { MarketIntelligenceCard } from '../../components/dashboard/MarketIntelligenceCard'
import { MortgageActionCard } from '../../components/dashboard/MortgageActionCard'
import { PropertyTrendChart } from '../../components/dashboard/PropertyTrendChart'
import { SpatialCanvas } from '../../components/map/SpatialCanvas'
import { MortgageDrawer } from '../../components/mortgage/MortgageDrawer'

export function DashboardPage() {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('tab') === 'mortgage') {
      setDrawerOpen(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  return (
    <div className="site-shell">
      <div className="dashboard-layout">
        <Sidebar />

        <div className="space-y-5">
          <DashboardTopBar onBorrowClick={() => setDrawerOpen(true)} onSelectRegion={setSelectedRegion} />
          <KpiGrid />

          <section className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_340px]">
            <RegionControlCard
              selectedRegion={selectedRegion}
              onSelect={setSelectedRegion}
            />

            <div className="glass-card flex flex-col rounded-[32px] p-4">
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

          <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <PropertyTrendChart selectedRegion={selectedRegion} />
            <MortgageActionCard onOpen={() => setDrawerOpen(true)} />
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
