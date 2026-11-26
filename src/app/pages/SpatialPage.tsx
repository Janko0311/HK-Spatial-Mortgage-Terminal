import { useState } from 'react'
import type { RegionKey } from '../../components/map/regionData'
import { Sidebar } from '../../components/layout/Sidebar'
import { DashboardTopBar } from '../../components/layout/DashboardTopBar'
import { HologramMap } from '../../components/map/HologramMap'
import { RegionInfoCard } from '../../components/map/RegionInfoCard'
import { MortgageDrawer } from '../../components/mortgage/MortgageDrawer'

export function SpatialPage() {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="site-shell">
      <div className="dashboard-layout">
        <Sidebar />

        <div className="space-y-5">
          <DashboardTopBar onBorrowClick={() => setDrawerOpen(true)} />

          <section className="glass-card flex h-[calc(100vh-220px)] min-h-[560px] flex-col rounded-[32px] p-4">
            <div className="mb-4 flex items-center justify-between px-2">
              <div>
                <div className="section-eyebrow">Spatial</div>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Hong Kong Holographic Map
                </h2>
              </div>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                {selectedRegion ? selectedRegion.replace(/-/g, ' ') : 'Interactive'}
              </div>
            </div>

            <div className="relative min-h-0 flex-1">
              <HologramMap
                selectedRegion={selectedRegion}
                onSelectRegion={setSelectedRegion}
              />
              <RegionInfoCard
                selectedRegion={selectedRegion}
                onClose={() => setSelectedRegion(null)}
                onCalculateMortgage={() => setDrawerOpen(true)}
              />
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
