import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { AboutBase } from './landmarks/AboutBase'
import { ContactBeacon } from './landmarks/ContactBeacon'
import { ExperienceStations } from './landmarks/ExperienceStations'
import { ProjectIslands } from './landmarks/ProjectIslands'
import { SkillTowers } from './landmarks/SkillTowers'
import { StationModel } from './landmarks/Station'
import type { SceneInteraction } from './types'

/** Decorative satellites that make the sky feel inhabited. */
function Satellites({ reducedMotion }: { reducedMotion: boolean }) {
  const a = useRef<Group>(null)
  const b = useRef<Group>(null)
  useFrame((_, dt) => {
    if (reducedMotion) return
    if (a.current) a.current.rotation.y += dt * 0.07
    if (b.current) b.current.rotation.y -= dt * 0.045
  })
  return (
    <>
      <group rotation={[-0.35, 0, 0.5]}>
        <group ref={a}>
          <group position={[4.5, 0, 0]} rotation={[0, 0.8, 0.3]}>
            <StationModel accent="#a78bfa" scale={0.9} />
          </group>
        </group>
      </group>
      <group rotation={[0.9, 0, -0.7]}>
        <group ref={b}>
          <group position={[5.4, 0, 0]} rotation={[0.4, 0, 0.6]}>
            <StationModel accent="#2dd4bf" scale={0.75} />
          </group>
        </group>
      </group>
    </>
  )
}

/** Every interactive portfolio location, wired to the shared UI state. */
export function OrbitingLandmarks({ ui }: { ui: SceneInteraction }) {
  return (
    <>
      <AboutBase ui={ui} />
      <ProjectIslands ui={ui} />
      <SkillTowers ui={ui} />
      <ExperienceStations ui={ui} />
      <ContactBeacon ui={ui} />
      <Satellites reducedMotion={ui.reducedMotion} />
    </>
  )
}
