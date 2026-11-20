import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { HKLandmass } from './HKLandmass'
import type { RegionKey } from './regionData'

type Props = {
  selectedRegion: RegionKey | null
  onSelectRegion: (region: RegionKey) => void
}

export function SpatialCanvas({ selectedRegion, onSelectRegion }: Props) {
  return (
    <div className="canvas-frame grid-overlay">
      <Canvas camera={{ position: [0, 9, 12], fov: 38 }} shadows dpr={[1, 1.5]}>
        <color attach="background" args={['#050814']} />
        <fog attach="fog" args={['#050814', 12, 32]} />

        <ambientLight intensity={0.75} />
        <directionalLight
          position={[8, 12, 8]}
          intensity={1.7}
          color="#c4b5fd"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-8, 5, 2]} intensity={1.2} color="#60a5fa" />
        <pointLight position={[5, 4, 10]} intensity={1.1} color="#a855f7" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.28, 0]}>
          <planeGeometry args={[44, 44]} />
          <meshStandardMaterial color="#071120" roughness={0.92} metalness={0.08} />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.22, 0]}>
          <planeGeometry args={[24, 24]} />
          <meshStandardMaterial color="#0b1830" roughness={0.74} metalness={0.16} />
        </mesh>

        <HKLandmass
          selectedRegion={selectedRegion}
          onSelectRegion={onSelectRegion}
        />

        <Stars radius={90} depth={40} count={1600} factor={3} fade speed={0.45} />

        <OrbitControls
          enablePan={false}
          minDistance={9}
          maxDistance={18}
          minPolarAngle={Math.PI / 4.8}
          maxPolarAngle={Math.PI / 2.15}
          target={[0.5, 0.8, 2.2]}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  )
}
