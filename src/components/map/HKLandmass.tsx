import { RegionMesh } from './RegionMesh'
import { REGIONS } from './regionData'
import type { RegionKey } from './regionData'

type Props = {
  selectedRegion: RegionKey | null
  onSelectRegion: (region: RegionKey) => void
}

export function HKLandmass({ selectedRegion, onSelectRegion }: Props) {
  return (
    <group>
      {REGIONS.map((region) => (
        <RegionMesh
          key={region.id}
          regionId={region.id}
          name={region.name}
          position={region.position}
          baseColor={region.baseColor}
          selected={selectedRegion === region.id}
          onSelect={onSelectRegion}
        />
      ))}
    </group>
  )
}
