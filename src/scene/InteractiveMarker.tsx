import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import type { Group, Mesh } from 'three'

interface Props {
  position?: [number, number, number]
  color?: string
  size?: number
  active?: boolean
  hovered?: boolean
  reducedMotion?: boolean
}

/**
 * Glowing diamond + pulsing ring. Purely visual — the parent landmark owns
 * pointer events, so hovering or clicking anywhere on the landmark works.
 */
export function InteractiveMarker({
  position = [0, 0, 0],
  color = '#67e8f9',
  size = 1,
  active = false,
  hovered = false,
  reducedMotion = false,
}: Props) {
  const gem = useRef<Mesh>(null)
  const ring = useRef<Group>(null)
  const hit = useRef<Group>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (gem.current && !reducedMotion) gem.current.rotation.y = t * 1.4
    if (ring.current) {
      const base = active ? 1.25 : hovered ? 1.15 : 1
      const pulse = reducedMotion ? 0 : Math.sin(t * 2.4) * 0.08
      ring.current.scale.setScalar(base + pulse)
    }
    if (hit.current && !reducedMotion) hit.current.position.y = Math.sin(t * 1.6) * 0.02
  })

  const c = active ? '#ffffff' : color

  return (
    <group position={position} scale={size}>
      <group ref={hit}>
        <mesh ref={gem}>
          <octahedronGeometry args={[0.07, 0]} />
          <meshBasicMaterial color={c} toneMapped={false} />
        </mesh>
        <Billboard>
          <group ref={ring}>
            <mesh>
              <torusGeometry args={[0.15, 0.007, 6, 40]} />
              <meshBasicMaterial color={c} transparent opacity={active || hovered ? 0.95 : 0.55} toneMapped={false} />
            </mesh>
          </group>
        </Billboard>
        {/* Generous invisible hit target */}
        <mesh>
          <sphereGeometry args={[0.3, 10, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}
