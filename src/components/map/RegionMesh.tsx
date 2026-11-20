import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { RegionKey } from './regionData'

type Props = {
  regionId: RegionKey
  name: string
  position: [number, number, number]
  baseColor: string
  selected: boolean
  onSelect: (id: RegionKey) => void
}

export function RegionMesh({
  regionId,
  name,
  position,
  baseColor,
  selected,
  onSelect,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const targetY = hovered || selected ? position[1] + 0.15 : position[1]
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetY,
      12,
      delta
    )
  })

  const buildings = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      const x = (Math.random() - 0.5) * 2.6
      const z = (Math.random() - 0.5) * 1.8
      const h = 0.2 + Math.random() * (selected ? 1.8 : 1.2)
      const sx = 0.08 + Math.random() * 0.16
      const sz = 0.08 + Math.random() * 0.16
      return { id: i, x, z, h, sx, sz }
    })
  }, [selected])

  const terrainColor = useMemo(() => new THREE.Color(baseColor), [baseColor])

  return (
    <group
      ref={groupRef}
      name={name}
      position={position}
      onClick={() => onSelect(regionId)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh receiveShadow>
        <boxGeometry args={[3, 0.3, 2.2]} />
        <meshStandardMaterial
          color={terrainColor}
          emissive={hovered || selected ? '#5CE1E6' : '#000000'}
          emissiveIntensity={hovered || selected ? 0.4 : 0}
        />
      </mesh>

      {buildings.map((b) => (
        <mesh
          key={b.id}
          castShadow
          receiveShadow
          position={[b.x, 0.2 + b.h / 2, b.z]}
        >
          <boxGeometry args={[b.sx, b.h, b.sz]} />
          <meshStandardMaterial
            color={selected ? '#5CE1E6' : '#2185B5'}
            emissive={hovered || selected ? '#5CE1E6' : '#000000'}
            emissiveIntensity={hovered || selected ? 0.25 : 0}
          />
        </mesh>
      ))}

      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.45, 64]} />
        <meshBasicMaterial
          color={hovered || selected ? '#A5F3FC' : '#153B50'}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}
