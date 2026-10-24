import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { portfolio } from '../../data/portfolio'
import { cameraState } from '../cameraState'
import { ExperienceScene, ProjectScene } from '../stage/scenes'
import { INTERIOR_POS, sameKind } from './focus'
import type { InteriorFocus } from './focus'
import { ImageOrbit } from './ImageOrbit'
import { ProjectPlace } from './projectPlaces'
import { LabRoom, SatelliteInterior, SignalHub, SkillsPlaza } from './rooms'

const EXP_ACCENT = ['#f472b6', '#38bdf8', '#2dd4bf', '#fbbf24', '#a78bfa']
const key = (f: InteriorFocus | null) => (!f ? 'none' : 'index' in f ? `${f.kind}:${f.index}` : f.kind)

/**
 * The full "place" behind each landmark. It lives far from the planet and is
 * only visible while the camera is inside it (see CameraController).
 */
export function InteriorWorld({
  focus,
  skillId,
  onSelectSkill,
  reduced,
}: {
  focus: InteriorFocus | null
  skillId: string | null
  onSelectSkill: (id: string) => void
  reduced: boolean
}) {
  const root = useRef<Group>(null)
  const [shown, setShown] = useState<InteriorFocus | null>(focus)

  useFrame(() => {
    if (root.current) root.current.visible = cameraState.interior
    if (focus) {
      // never swap the content while the old place is still on screen
      if (key(shown) !== key(focus) && (!cameraState.interior || sameKind(shown, focus))) setShown(focus)
    } else if (shown && !cameraState.interior) setShown(null)
  })

  let body = null
  if (shown) {
    switch (shown.kind) {
      case 'about':
        body = <LabRoom reduced={reduced} />
        break
      case 'skills':
        body = <SkillsPlaza reduced={reduced} skillId={skillId} onSelectSkill={onSelectSkill} />
        break
      case 'contact':
        body = <SignalHub reduced={reduced} />
        break
      case 'project': {
        const accent = portfolio.projects[shown.index]?.accent ?? '#22d3ee'
        body = (
          <>
            <ProjectPlace index={shown.index} accent={accent} reduced={reduced} />
            <group scale={1}>
              <ProjectScene index={shown.index} accent={accent} reduced={reduced} />
            </group>
            <ImageOrbit project={portfolio.projects[shown.index]} reduced={reduced} />
          </>
        )
        break
      }
      case 'exp': {
        const accent = EXP_ACCENT[shown.index % 5]
        body = (
          <>
            <SatelliteInterior accent={accent} reduced={reduced} />
            <group scale={1}>
              <ExperienceScene index={shown.index} reduced={reduced} />
            </group>
          </>
        )
        break
      }
    }
  }

  return (
    <group ref={root} position={INTERIOR_POS} visible={false}>
      <group key={key(shown)}>{body}</group>
    </group>
  )
}
