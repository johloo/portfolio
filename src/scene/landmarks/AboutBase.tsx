import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { GROUND, PLATEAU_RADIUS, alignToNormal, facingCameraRy } from '../layout'
import { InteractiveMarker } from '../InteractiveMarker'
import { Tooltip } from '../Tooltip'
import { useLandmarkEvents } from '../useLandmarkEvents'
import { Reveal } from '../details/parts'
import { useArrived } from '../useArrived'
import { AboutScene } from '../stage/scenes'
import type { SceneInteraction } from '../types'

const SCENE_SCALE = 0.3
const LIGHTS = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2)

/** About → futuristic research station on a landing platform. */
export function AboutBase({ ui }: { ui: SceneInteraction }) {
  const { dir } = GROUND.about
  const position = useMemo(() => dir.clone().multiplyScalar(PLATEAU_RADIUS - 0.015), [dir])
  const quaternion = useMemo(() => alignToNormal(dir), [dir])
  const active = ui.section === 'about'
  const arrived = useArrived(active)
  const ry = useMemo(() => facingCameraRy(dir), [dir])
  const { hovered, handlers } = useLandmarkEvents(() => ui.onSelectSection('about'))
  const dish = useRef<Mesh>(null)

  useFrame((_, dt) => {
    if (dish.current && !ui.reducedMotion) dish.current.rotation.y += dt * 0.6
  })

  return (
    <group position={position} quaternion={quaternion} {...handlers}>
      <group visible={!arrived}>
      {/* Landing platform */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.4, 0.44, 0.06, 8]} />
        <meshStandardMaterial color="#34497e" emissive="#22346a" emissiveIntensity={0.6} flatShading metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 8]} />
        <meshStandardMaterial color="#4a669f" flatShading metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.062, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.008, 6, 40]} />
        <meshBasicMaterial color={active || hovered ? '#ffffff' : '#67e8f9'} toneMapped={false} />
      </mesh>

      {/* Research dome */}
      <mesh position={[-0.08, 0.075, 0.02]}>
        <sphereGeometry args={[0.15, 9, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#8be9ff"
          emissive="#22d3ee"
          emissiveIntensity={0.55}
          flatShading
          transparent
          opacity={0.78}
        />
      </mesh>

      {/* Tower + rotating dish */}
      <mesh position={[0.17, 0.28, -0.05]}>
        <cylinderGeometry args={[0.022, 0.034, 0.44, 6]} />
        <meshStandardMaterial color="#cbd5ff" flatShading metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh ref={dish} position={[0.17, 0.52, -0.05]}>
        <coneGeometry args={[0.07, 0.05, 6]} />
        <meshStandardMaterial color="#e9edff" flatShading metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0.17, 0.58, -0.05]}>
        <sphereGeometry args={[0.014, 8, 6]} />
        <meshBasicMaterial color="#a78bfa" toneMapped={false} />
      </mesh>

      {/* Annex module + solar fins */}
      <mesh position={[-0.02, 0.1, -0.2]}>
        <boxGeometry args={[0.2, 0.07, 0.1]} />
        <meshStandardMaterial color="#dfe6ff" flatShading metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0.18, 0.095, 0.2]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.012, 0.1]} />
        <meshStandardMaterial color="#1e3a8a" emissive="#22d3ee" emissiveIntensity={0.25} flatShading />
      </mesh>

      {/* Landing lights */}
      {LIGHTS.map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.4, 0.075, Math.sin(a) * 0.4]}>
          <sphereGeometry args={[0.012, 6, 5]} />
          <meshBasicMaterial color={i % 2 ? '#a78bfa' : '#67e8f9'} toneMapped={false} />
        </mesh>
      ))}

      </group>

      <Reveal show={arrived} reduced={ui.reducedMotion}>
        <group rotation={[0, ry, 0]} scale={SCENE_SCALE}>
          <AboutScene reduced={ui.reducedMotion} />
        </group>
      </Reveal>

      <InteractiveMarker
        position={[0, active ? 1.45 : 0.85, 0]}
        active={active}
        hovered={hovered}
        reducedMotion={ui.reducedMotion}
      />
      {(hovered || active) && <Tooltip title="About Me" subtitle="Research station" position={[0, active ? 1.7 : 1.1, 0]} />}
    </group>
  )
}
