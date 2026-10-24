import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, MeshBasicMaterial } from 'three'
import { GROUND, PLATEAU_RADIUS, alignToNormal, facingCameraRy } from '../layout'
import { InteractiveMarker } from '../InteractiveMarker'
import { Tooltip } from '../Tooltip'
import { useLandmarkEvents } from '../useLandmarkEvents'
import { Reveal } from '../details/parts'
import { useArrived } from '../useArrived'
import { ContactScene } from '../stage/scenes'
import type { SceneInteraction } from '../types'

const PULSES = [0, 1, 2]

/** Contact → glowing communication beacon emitting signal rings. */
export function ContactBeacon({ ui }: { ui: SceneInteraction }) {
  const { dir } = GROUND.contact
  const position = useMemo(() => dir.clone().multiplyScalar(PLATEAU_RADIUS - 0.015), [dir])
  const quaternion = useMemo(() => alignToNormal(dir), [dir])
  const active = ui.section === 'contact'
  const arrived = useArrived(active)
  const ry = useMemo(() => facingCameraRy(dir), [dir])
  const { hovered, handlers } = useLandmarkEvents(() => ui.onSelectSection('contact'))

  const rings = useRef<(Mesh | null)[]>([])
  const orb = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (orb.current) orb.current.scale.setScalar(1 + (ui.reducedMotion ? 0 : Math.sin(t * 3) * 0.12))
    rings.current.forEach((m, i) => {
      if (!m) return
      const p = ui.reducedMotion ? 0.4 + i * 0.25 : ((t * 0.35 + i / PULSES.length) % 1)
      m.scale.setScalar(0.15 + p * 1.5)
      ;(m.material as MeshBasicMaterial).opacity = (1 - p) * 0.7
    })
  })

  return (
    <group position={position} quaternion={quaternion} {...handlers}>
      <group visible={!arrived}>
      {/* Base */}
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.07, 6]} />
        <meshStandardMaterial color="#34497e" emissive="#22346a" emissiveIntensity={0.6} flatShading metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.072, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.007, 6, 30]} />
        <meshBasicMaterial color={active || hovered ? '#ffffff' : '#a78bfa'} toneMapped={false} />
      </mesh>

      {/* Mast */}
      <mesh position={[0, 0.48, 0]}>
        <coneGeometry args={[0.075, 0.82, 6]} />
        <meshStandardMaterial color="#cbd5ff" flatShading metalness={0.5} roughness={0.35} />
      </mesh>
      {[0.28, 0.5, 0.7].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06 - i * 0.012, 0.006, 5, 14]} />
          <meshBasicMaterial color="#67e8f9" toneMapped={false} />
        </mesh>
      ))}

      {/* Dish */}
      <mesh position={[0.1, 0.62, 0]} rotation={[0, 0, -0.9]}>
        <sphereGeometry args={[0.07, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e9edff" flatShading side={2} metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Glowing orb + signal pulses */}
      <mesh ref={orb} position={[0, 0.94, 0]}>
        <icosahedronGeometry args={[0.065, 1]} />
        <meshBasicMaterial color="#c4b5fd" toneMapped={false} />
      </mesh>
      <group position={[0, 0.94, 0]}>
        {PULSES.map((i) => (
          <mesh key={i} ref={(el) => void (rings.current[i] = el)} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.008, 6, 48]} />
            <meshBasicMaterial color="#a78bfa" transparent opacity={0.4} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>

      </group>

      <Reveal show={arrived} reduced={ui.reducedMotion}>
        <group rotation={[0, ry, 0]} scale={0.3}>
          <ContactScene reduced={ui.reducedMotion} />
        </group>
      </Reveal>

      <InteractiveMarker
        position={[0, 1.38, 0]}
        color="#c4b5fd"
        active={active}
        hovered={hovered}
        reducedMotion={ui.reducedMotion}
      />
      {(hovered || active) && (
        <Tooltip title="Contact" subtitle="Communication beacon" position={[0, 1.62, 0]} />
      )}
    </group>
  )
}
