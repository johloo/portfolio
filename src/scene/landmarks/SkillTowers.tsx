import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CylinderGeometry, MeshStandardMaterial } from 'three'
import type { Mesh } from 'three'
import { portfolio } from '../../data/portfolio'
import type { Skill } from '../../data/portfolio'
import { GROUND, PLATEAU_RADIUS, alignToNormal, facingCameraRy } from '../layout'
import { InteractiveMarker } from '../InteractiveMarker'
import { Tooltip } from '../Tooltip'
import { useLandmarkEvents } from '../useLandmarkEvents'
import { focusRegistry } from '../focusRegistry'
import { Reveal } from '../details/parts'
import { useArrived } from '../useArrived'
import { SkillsScene } from '../stage/scenes'
import type { SceneInteraction } from '../types'

const SPACING = 0.28

/** One tower: height encodes proficiency. */
function Tower({
  skill,
  x,
  z,
  geometry,
  material,
  color,
  ui,
}: {
  skill: Skill
  x: number
  z: number
  geometry: CylinderGeometry
  material: MeshStandardMaterial
  color: string
  ui: SceneInteraction
}) {
  const height = 0.14 + (skill.level / 100) * 0.82
  const active = ui.section === 'skills' && ui.skillId === skill.id
  const { hovered, handlers } = useLandmarkEvents(() => ui.onSelectSkill(skill.id))
  const cap = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (cap.current && !ui.reducedMotion) {
      cap.current.rotation.y = clock.elapsedTime * 1.2 + x * 4
      cap.current.position.y = height + 0.07 + Math.sin(clock.elapsedTime * 1.8 + z * 5) * 0.012
    }
  })

  return (
    <group position={[x, 0, z]} {...handlers}>
      <mesh geometry={geometry} material={material} scale={[1, height, 1]} />
      <group ref={(o) => focusRegistry.set(`skill:${skill.id}`, o)} position={[0, height * 0.55, 0]} />
      <mesh ref={cap} position={[0, height + 0.07, 0]} scale={active || hovered ? 1.45 : 1}>
        <octahedronGeometry args={[0.055, 0]} />
        <meshBasicMaterial color={active ? '#ffffff' : color} toneMapped={false} />
      </mesh>
      {active && (
        <>
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.15, 0.01, 6, 28]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          <mesh position={[0, height / 2 + 0.5, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 1, 8, 1, true]} />
            <meshBasicMaterial color={color} transparent opacity={0.28} depthWrite={false} toneMapped={false} />
          </mesh>
        </>
      )}
      {(hovered || active) && (
        <Tooltip title={skill.name} subtitle={`${skill.level}%`} position={[0, height + 0.3, 0]} />
      )}
    </group>
  )
}

/** Skills → a cluster of glowing energy towers (height = proficiency). */
export function SkillTowers({ ui }: { ui: SceneInteraction }) {
  const { dir } = GROUND.skills
  const position = useMemo(() => dir.clone().multiplyScalar(PLATEAU_RADIUS - 0.015), [dir])
  const quaternion = useMemo(() => alignToNormal(dir), [dir])
  const active = ui.section === 'skills' && !ui.skillId
  const arrived = useArrived(ui.section === 'skills')
  const ry = useMemo(() => facingCameraRy(dir), [dir])
  const { hovered, handlers } = useLandmarkEvents(() => ui.onSelectSection('skills'))

  const geometry = useMemo(() => {
    const g = new CylinderGeometry(0.055, 0.085, 1, 6)
    g.translate(0, 0.5, 0)
    return g
  }, [])

  const materials = useMemo(() => {
    const map: Record<string, MeshStandardMaterial> = {}
    for (const c of portfolio.skillCategories) {
      map[c.id] = new MeshStandardMaterial({
        color: c.color,
        emissive: c.color,
        emissiveIntensity: 0.65,
        flatShading: true,
        roughness: 0.3,
        metalness: 0.15,
        transparent: true,
        opacity: 0.92,
      })
    }
    return map
  }, [])

  useEffect(
    () => () => {
      geometry.dispose()
      Object.values(materials).forEach((m) => m.dispose())
    },
    [geometry, materials],
  )

  // Lay skills out in a grid ordered by category so colours cluster together.
  const layout = useMemo(() => {
    const order = portfolio.skillCategories.map((c) => c.id as string)
    const sorted = [...portfolio.skills].sort(
      (a, b) => order.indexOf(a.category) - order.indexOf(b.category),
    )
    const cols = Math.ceil(Math.sqrt(sorted.length))
    const rows = Math.ceil(sorted.length / cols)
    return sorted.map((skill, i) => ({
      skill,
      x: ((i % cols) - (cols - 1) / 2) * SPACING,
      z: (Math.floor(i / cols) - (rows - 1) / 2) * SPACING,
    }))
  }, [])

  const colorOf = (cat: string) => portfolio.skillCategories.find((c) => c.id === cat)?.color ?? '#67e8f9'

  return (
    <group position={position} quaternion={quaternion}>
      <group {...handlers}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.62, 0.66, 0.06, 10]} />
          <meshStandardMaterial color="#34497e" emissive="#22346a" emissiveIntensity={0.7} flatShading metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.062, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.62, 0.008, 6, 48]} />
          <meshBasicMaterial color={active || hovered ? '#ffffff' : '#22d3ee'} toneMapped={false} />
        </mesh>
      </group>

      {layout.map(({ skill, x, z }) => (
        <Tower
          key={skill.id}
          skill={skill}
          x={x}
          z={z}
          geometry={geometry}
          material={materials[skill.category]}
          color={colorOf(skill.category)}
          ui={ui}
        />
      ))}

      <Reveal show={arrived} reduced={ui.reducedMotion}>
        <group rotation={[0, ry, 0]} scale={0.3}>
          <SkillsScene reduced={ui.reducedMotion} />
        </group>
      </Reveal>

      <group {...handlers}>
        <InteractiveMarker
          position={[0, 1.5, 0]}
          active={ui.section === 'skills'}
          hovered={hovered}
          reducedMotion={ui.reducedMotion}
        />
        {hovered && <Tooltip title="Skills" subtitle="Energy towers" position={[0, 1.76, 0]} />}
      </group>
    </group>
  )
}
