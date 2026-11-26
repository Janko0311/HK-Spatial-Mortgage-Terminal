import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { RegionKey } from './regionData'

type Props = {
  selectedRegion: RegionKey | null
  onSelectRegion: (region: RegionKey | null) => void
}

type RegionDef = {
  key: RegionKey
  meshName: string
  label: string
}

const REGION_DEFS: RegionDef[] = [
  { key: 'hong-kong-island', meshName: 'Region_HongKongIsland', label: 'Hong Kong Island' },
  { key: 'kowloon', meshName: 'Region_Kowloon', label: 'Kowloon' },
  { key: 'new-territories', meshName: 'Region_NewTerritories', label: 'New Territories' },
]

const MODEL_PATH = '/models/hk_hologram_map.glb'
const REST_Y = 0
const FLOAT_Y = 0.28
const SOUTH_OFFSETS: Partial<Record<RegionKey, number>> = {
  kowloon: 0.012,
  'hong-kong-island': 0.027,
}

function HologramModel({ selectedRegion, onSelectRegion }: Props) {
  const gltf = useGLTF(MODEL_PATH)
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene])
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const [hovered, setHovered] = useState<RegionKey | null>(null)
  const regionRoots = useRef<Record<string, THREE.Object3D>>({})
  const basePositions = useRef<Record<string, THREE.Vector3>>({})
  const wireMats = useRef<THREE.MeshStandardMaterial[]>([])

  useEffect(() => {
    regionRoots.current = {}
    wireMats.current = []

    scene.rotation.set(0, 0, 0)
    scene.position.set(0, 0, 0)
    scene.scale.set(1, 1, 1)
    scene.updateMatrixWorld(true)

    scene.traverse((obj) => {
      const def = REGION_DEFS.find((r) => r.meshName === obj.name)
      if (def && obj instanceof THREE.Object3D) {
        regionRoots.current[def.key] = obj
      }

      if (!(obj as THREE.Mesh).isMesh) return
      const mesh = obj as THREE.Mesh
      mesh.castShadow = false
      mesh.receiveShadow = false

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      materials.forEach((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return
        mat.transparent = true
        mat.depthWrite = mat.opacity > 0.95
        mat.emissiveIntensity = mat.emissiveIntensity || 1
        if (mat.name.includes('Wire') || mat.emissiveIntensity >= 4) {
          wireMats.current.push(mat)
        }
      })
    })

    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    scene.position.sub(center)

    // Natural HK orientation: NT top, Lantau bottom-left, Kowloon center, HK Island bottom-right
    scene.rotation.y = Math.PI / 2
    scene.updateMatrixWorld(true)

    const orientedBox = new THREE.Box3().setFromObject(scene)
    const orientedCenter = orientedBox.getCenter(new THREE.Vector3())
    const orientedSize = orientedBox.getSize(new THREE.Vector3())
    const southAxis: 'x' | 'z' = orientedSize.x >= orientedSize.z ? 'z' : 'x'
    const southSpan = Math.max(orientedSize.x, orientedSize.z)

    REGION_DEFS.forEach((def) => {
      const root = regionRoots.current[def.key]
      if (!root) return
      const base = root.position.clone()
      base.y = REST_Y
      const offsetPct = SOUTH_OFFSETS[def.key] ?? 0
      if (offsetPct) {
        // After scene.rotation.y = PI/2 and current camera, world +Z shifts regions
        // southward on screen (below NT, not west toward Lantau).
        base[southAxis] += southSpan * offsetPct
      }
      basePositions.current[def.key] = base
      root.position.copy(base)
    })
    const maxDim = Math.max(orientedSize.x, orientedSize.y, orientedSize.z)
    const fitDistance = maxDim * 1.35

    camera.position.set(
      orientedCenter.x + fitDistance * 0.55,
      orientedCenter.y + fitDistance * 0.85,
      orientedCenter.z + fitDistance * 0.95,
    )
    camera.near = 0.1
    camera.far = 200
    camera.updateProjectionMatrix()

    if (controlsRef.current) {
      controlsRef.current.target.copy(orientedCenter)
      controlsRef.current.update()
    }
  }, [scene, camera])

  useFrame((_, delta) => {
    REGION_DEFS.forEach((def) => {
      const root = regionRoots.current[def.key]
      if (!root) return
      const base = basePositions.current[def.key]
      const isSelected = selectedRegion === def.key
      const isHovered = hovered === def.key
      if (base) {
        root.position.x = base.x
        root.position.z = base.z
      }
      const targetY = (base?.y ?? REST_Y) + (isSelected ? FLOAT_Y : 0)
      root.position.y = THREE.MathUtils.damp(root.position.y, targetY, 8, delta)

      root.traverse((obj) => {
        if (!(obj as THREE.Mesh).isMesh) return
        const mesh = obj as THREE.Mesh
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((mat) => {
          if (!(mat instanceof THREE.MeshStandardMaterial)) return
          const base = mat.name.includes('Wire') ? 6 : 0.6
          const boost = isSelected ? 2.2 : isHovered ? 1.2 : 0
          mat.emissiveIntensity = THREE.MathUtils.damp(mat.emissiveIntensity, base + boost, 10, delta)
        })
      })
    })
  })

  const getRegionKey = (obj: THREE.Object3D | null): RegionKey | null => {
    let cur: THREE.Object3D | null = obj
    while (cur) {
      const def = REGION_DEFS.find((r) => r.meshName === cur?.name)
      if (def) return def.key
      cur = cur.parent
    }
    return null
  }

  const pickRegion = (e: any): RegionKey | null => {
    const hits: Array<{ key: RegionKey; distance: number }> = []
    for (const hit of e.intersections ?? []) {
      const key = getRegionKey(hit.object)
      if (!key) continue
      if (!hits.some((h) => h.key === key)) hits.push({ key, distance: hit.distance })
    }
    if (hits.length === 0) return getRegionKey(e.object)
    hits.sort((a, b) => a.distance - b.distance)
    const first = hits[0]
    const preferred = hits.find((h) => h.key === 'kowloon' || h.key === 'hong-kong-island')
    if (preferred && first.key === 'new-territories' && preferred.distance - first.distance < 0.75) {
      return preferred.key
    }
    return first.key
  }

  return (
    <>
      <primitive
        object={scene}
        onPointerOver={(e: any) => {
          const key = pickRegion(e)
          if (!key) return
          e.stopPropagation()
          setHovered(key)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e: any) => {
          e.stopPropagation()
          setHovered(null)
          document.body.style.cursor = 'default'
        }}
        onPointerDown={(e: any) => {
          const key = pickRegion(e)
          if (!key) return
          e.stopPropagation()
          onSelectRegion(selectedRegion === key ? null : key)
        }}
      />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={8}
        maxDistance={30}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.25}
      />
    </>
  )
}

export function HologramMap({ selectedRegion, onSelectRegion }: Props) {
  const activeLabel = REGION_DEFS.find((r) => r.key === selectedRegion)?.label

  return (
    <div className="canvas-frame relative h-full min-h-[560px] w-full flex-1">
      <Canvas
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, 11, 14], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        onPointerMissed={() => onSelectRegion(null)}
      >
        <color attach="background" args={['#060B19']} />
        <fog attach="fog" args={['#060B19', 18, 55]} />
        <ambientLight intensity={0.55} />
        <pointLight position={[8, 12, 6]} intensity={8} color="#67e8f9" />
        <pointLight position={[-10, 8, -6]} intensity={4} color="#22d3ee" />

        <Suspense fallback={null}>
          <HologramModel selectedRegion={selectedRegion} onSelectRegion={onSelectRegion} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-cyan-400/20 bg-[#0B1224]/80 px-4 py-2 text-xs tracking-[0.2em] text-cyan-200/90 backdrop-blur">
        {activeLabel ? `ACTIVE: ${activeLabel.toUpperCase()}` : 'CLICK A REGION'}
      </div>
    </div>
  )
}

useGLTF.preload(MODEL_PATH)
