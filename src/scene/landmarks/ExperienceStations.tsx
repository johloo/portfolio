import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Quaternion, Vector3 } from 'three'
import type { Group } from 'three'
import type { ReactNode } from 'react'
import { portfolio } from '../../data/portfolio'
import { ORBIT_RADIUS, ORBIT_TILT } from '../layout'
import { InteractiveMarker } from '../InteractiveMarker'
import { Tooltip } from '../Tooltip'
import { useLandmarkEvents } from '../useLandmarkEvents'
import { StationModel } from './Station'
import { focusRegistry } from '../focusRegistry'
import { Reveal } from '../details/parts'
import { useArrived } from '../useArrived'
import { ExperienceScene } from '../stage/scenes'
import { Cyl } from '../details/parts'
import type { SceneInteraction } from '../types'

const P = new Vector3()
const Q = new Quaternion()
const QY = new Quaternion()
const AXIS = new Vector3(0, 1, 0)
const ACCENTS = ['#67e8f9', '#a78bfa', '#2dd4bf', '#60a5fa', '#f0abfc']

/** Keeps a workshop upright in world space and facing the zoomed camera, wherever the station is on its orbit. */
function UprightScene({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame(() => {
    const g = ref.current
    if (!g?.parent) return
    g.parent.getWorldPosition(P)
    const ry = Math.atan2(P.x, P.z)
    g.parent.getWorldQuaternion(Q).invert().multiply(QY.setFromAxisAngle(AXIS, ry))
    g.quaternion.copy(Q)
  })
  return (
    <group ref={ref} scale={0.27}>
      {children}
    </group>
  )
}

function Station({
  id,
  title,
  angle,
  accent,
  index,
  ui,
}: {
  id: string
  title: string
  angle: number
  accent: string
  index: number
  ui: SceneInteraction
}) {
  const active = ui.section === 'experience' && ui.experienceId === id
  const arrived = useArrived(active)
  const { hovered, handlers } = useLandmarkEvents(() => ui.onSelectExperience(id))
  return (
    <group
      position={[Math.cos(angle) * ORBIT_RADIUS, 0, Math.sin(angle) * ORBIT_RADIUS]}
      rotation={[0, -angle, 0]}
      {...handlers}
    >
      <group ref={(o) => focusRegistry.set(`station:${id}`, o)} />
      <group scale={hovered ? 1.35 : 1.1} visible={!arrived}>
        <StationModel accent={accent} />
      </group>
      <Reveal show={arrived} reduced={ui.reducedMotion}>
        <UprightScene>
          <Cyl p={[0, -0.1, 0]} r0={3.0} h={0.3} seg={9} c="#243b6b" e={accent} ei={0.15} />
          <ExperienceScene index={index} reduced={ui.reducedMotion} />
        </UprightScene>
      </Reveal>
      {!active && (
        <InteractiveMarker
        position={[0, active ? 0.62 : 0.3, 0]}
        size={active ? 1.3 : 0.7}
        color={accent}
        active={active}
        hovered={hovered}
        reducedMotion={ui.reducedMotion}
      />
      )}
      {(hovered || active) && <Tooltip title={title} subtitle="Orbital station" position={[0, active ? 0.95 : 0.58, 0]} />}
    </group>
  )
}

/** Experience → stations riding an inclined orbit (one per timeline item). */
export function ExperienceStations({ ui }: { ui: SceneInteraction }) {
  const spin = useRef<Group>(null)
  const items = portfolio.experience.items

  useFrame((_, dt) => {
    if (spin.current && !ui.reducedMotion && !ui.experienceId) spin.current.rotation.y -= dt * 0.1
  })

  return (
    <group rotation={ORBIT_TILT}>
      <group ref={spin}>
        {items.map((item, i) => (
          <Station
            key={item.id}
            id={item.id}
            title={item.title}
            angle={(i / items.length) * Math.PI * 2}
            accent={ACCENTS[i % ACCENTS.length]}
            index={i}
            ui={ui}
          />
        ))}
      </group>
    </group>
  )
}
